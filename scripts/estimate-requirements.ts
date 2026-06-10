/**
 * Fills in AI-estimated admission requirements for programs whose schools don't
 * publish them, so students see estimated odds instead of an unscoreable
 * "Unverified" badge or blank values.
 *
 * - 'placeholder' programs: estimates any missing requirement field.
 * - 'partial' programs: conservative — only minOverallGPA when null, and
 *   minExamScore when an exam is required but no minimum is published. Never
 *   touches examType/requiredCourses/minScienceGPA on partial entries, where
 *   null/empty is often a VERIFIED absence (e.g. "no entrance exam").
 * - 'verified' programs: never touched. Existing values are never overwritten.
 * - The AI may skip a school (e.g. program closed, or no traditional BSN exists)
 *   when estimating would mislead.
 * - Records estimated field names in `estimatedFields` so the UI labels each one
 *   "(reasonable estimate)" with a disclaimer.
 * - Writes into prisma/programs-data.ts (the seed source of truth) so estimates
 *   survive re-seeds. Re-running skips programs that already have estimates
 *   unless --force is passed.
 *
 * Usage:  npx tsx scripts/estimate-requirements.ts [--force]
 * Then:   npx tsx prisma/seed.ts   (and seed.ts --prod for the live DB)
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import OpenAI from 'openai'
import { loadEnv } from './_env'
import { SEED_PROGRAMS, type SeedProgram } from '../prisma/programs-data'

loadEnv()

const MODEL = 'gpt-4o-mini'
const BATCH_SIZE = 12
const COURSE_KEYS = [
  'ANAT_PHYS_1', 'ANAT_PHYS_2', 'MICRO', 'CHEM', 'STATS', 'NUTRITION', 'LIFESPAN', 'ENGLISH_COMP',
] as const

const SYSTEM_PROMPT = `You are an expert on US BSN (Bachelor of Science in Nursing) admissions. For each school below, estimate the admission requirements its program most likely has, based on comparable BSN programs (school type, selectivity, region, public/private).

Calibration guidance:
- minOverallGPA: open-access/local public programs 2.5-2.8; typical regional programs 2.75-3.0; selective privates 3.0-3.25; elite "Top US" programs (Duke, Penn, Johns Hopkins, Emory, Boston College, etc.) 3.3-3.5.
- minScienceGPA: many programs specify one equal to or slightly below the overall GPA; use null when programs like it typically don't publish a separate science GPA.
- examType: 'TEAS' is most common for TX/AR programs; some use 'HESI A2'. Elite direct-entry programs usually require NO entrance exam — use null for those. Never invent other exam names.
- minExamScore: typical published minimums are 60-75 (percent). null if examType is null or no minimum is typical.
- requiredCourses: choose from exactly these keys: ${COURSE_KEYS.join(', ')}. Nearly all BSN programs require ANAT_PHYS_1, ANAT_PHYS_2, MICRO. Add others only when typical for that school type. For 3-year direct-entry programs with no prerequisites (e.g. for-profit nursing colleges), use [].
- If the notes indicate the program is CLOSED to new admissions or the school does not actually offer a traditional pre-licensure BSN, do not invent requirements: return {"slug": "...", "skip": true} for that school.

Respond with JSON: {"estimates": [{"slug": "...", "minOverallGPA": 3.0, "minScienceGPA": null, "examType": "TEAS", "minExamScore": 65, "requiredCourses": ["ANAT_PHYS_1", ...]}, ...]} — one entry per school, in any order, every slug included.`

type Estimate = {
  slug: string
  skip?: boolean
  minOverallGPA: number | null
  minScienceGPA: number | null
  examType: string | null
  minExamScore: number | null
  requiredCourses: string[]
}

/** Which fields a program is missing and allowed to receive estimates for. */
function estimatableFields(p: SeedProgram): string[] {
  const fields: string[] = []
  if (p.minOverallGPA === null) fields.push('minOverallGPA')
  if (p.examType !== null && p.minExamScore === null) fields.push('minExamScore')
  if (p.dataQuality === 'placeholder') {
    // Only on placeholders: null/empty here might be a verified absence on partials.
    if (p.minScienceGPA === null) fields.push('minScienceGPA')
    if (p.examType === null) fields.push('examType')
    if (p.requiredCourses.length === 0) fields.push('requiredCourses')
  }
  return fields
}

function schoolLine(p: SeedProgram): string {
  const bits = [
    `slug=${p.slug}`,
    `university=${p.university}`,
    `program=${p.name} (${p.programType})`,
    `location=${p.city}, ${p.state}`,
    p.isPublic ? 'public' : 'private',
    `tier=${p.tier}`,
    p.isFlagship ? 'flagship' : null,
    p.notes ? `notes=${p.notes}` : null,
  ].filter(Boolean)
  return `- ${bits.join(' | ')}`
}

function validNumber(v: unknown, min: number, max: number): number | null {
  return typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max
    ? Math.round(v * 100) / 100
    : null
}

const FIELD_ORDER: (keyof SeedProgram)[] = [
  'slug', 'name', 'university', 'city', 'state', 'isPublic', 'programType',
  'isFlagship', 'tier', 'region', 'minOverallGPA', 'minScienceGPA',
  'requiredCourses', 'examType', 'minExamScore', 'casperRequired',
  'deadlines', 'notes', 'dataQuality', 'estimatedFields',
]

function serialize(p: SeedProgram): string {
  const parts = FIELD_ORDER.filter(k => !(k === 'estimatedFields' && !p.estimatedFields?.length))
    .map(k => `${k}: ${JSON.stringify(p[k])}`)
  return `  { ${parts.join(', ')} },`
}

async function main() {
  const force = process.argv.includes('--force')
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set.')
  const openai = new OpenAI()

  const targets = SEED_PROGRAMS.filter(
    p =>
      p.dataQuality !== 'verified' &&
      estimatableFields(p).length > 0 &&
      (force || !p.estimatedFields?.length),
  )
  console.log(`Programs with estimatable gaps: ${targets.length}`)
  if (targets.length === 0) {
    console.log('Nothing to do.')
    return
  }

  const estimateBySlug = new Map<string, Estimate>()
  for (let i = 0; i < targets.length; i += BATCH_SIZE) {
    const batch = targets.slice(i, i + BATCH_SIZE)
    process.stdout.write(`  Batch ${i / BATCH_SIZE + 1}: ${batch.length} schools … `)
    const res = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Schools:\n${batch.map(schoolLine).join('\n')}` },
      ],
    })
    const parsed = JSON.parse(res.choices[0]?.message?.content ?? '{}') as { estimates?: Estimate[] }
    for (const e of parsed.estimates ?? []) estimateBySlug.set(e.slug, e)
    console.log('done')
  }

  let updatedCount = 0
  let skippedByAI = 0
  const updated: SeedProgram[] = SEED_PROGRAMS.map(p => {
    const est = estimateBySlug.get(p.slug)
    if (!est || p.dataQuality === 'verified') return p
    if (est.skip) {
      skippedByAI++
      return p
    }

    const allowed = new Set(estimatableFields(p))
    const next: SeedProgram = { ...p }
    const estimatedFields: string[] = force ? [] : [...(p.estimatedFields ?? [])]
    const mark = (f: string) => {
      if (!estimatedFields.includes(f)) estimatedFields.push(f)
    }

    const gpa = validNumber(est.minOverallGPA, 2.0, 4.0)
    if (allowed.has('minOverallGPA') && gpa !== null) {
      next.minOverallGPA = gpa
      mark('minOverallGPA')
    }
    const sciGpa = validNumber(est.minScienceGPA, 2.0, 4.0)
    if (allowed.has('minScienceGPA') && sciGpa !== null) {
      next.minScienceGPA = sciGpa
      mark('minScienceGPA')
    }
    if (allowed.has('examType')) {
      const exam = est.examType
      if (exam === 'TEAS' || exam === 'HESI A2' || exam === null) {
        // null is itself an estimate ("no entrance exam"), so always mark it.
        next.examType = exam
        mark('examType')
      }
    }
    if (next.examType !== null && (allowed.has('minExamScore') || allowed.has('examType'))) {
      const score = validNumber(est.minExamScore, 40, 100)
      if (next.minExamScore === null && score !== null) {
        next.minExamScore = score
        mark('minExamScore')
      }
    }
    if (allowed.has('requiredCourses')) {
      const courses = (est.requiredCourses ?? []).filter(c =>
        (COURSE_KEYS as readonly string[]).includes(c),
      )
      if (courses.length > 0) {
        next.requiredCourses = courses
        mark('requiredCourses')
      }
    }

    if (estimatedFields.length === (p.estimatedFields?.length ?? 0)) return p
    next.estimatedFields = estimatedFields
    updatedCount++
    return next
  })

  const file = path.join(process.cwd(), 'prisma', 'programs-data.ts')
  const original = await fs.readFile(file, 'utf8')
  const marker = 'export const SEED_PROGRAMS: SeedProgram[] = ['
  const idx = original.indexOf(marker)
  if (idx === -1) throw new Error('Could not find SEED_PROGRAMS marker')
  const header = original.slice(0, idx + marker.length)
  await fs.writeFile(file, `${header}\n${updated.map(serialize).join('\n')}\n]\n`)

  const missing = targets.filter(p => !estimateBySlug.has(p.slug)).map(p => p.slug)
  console.log(`\nEstimated requirements written for ${updatedCount} programs.`)
  if (skippedByAI) console.log(`AI declined to estimate (closed/no BSN): ${skippedByAI}`)
  if (missing.length) console.log(`No estimate returned for: ${missing.join(', ')}`)
  console.log('Next: `npx tsx prisma/seed.ts` (and `--prod`) to push to the DB.')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
