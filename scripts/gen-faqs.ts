/**
 * Generates a UNIQUE, data-grounded FAQ for each BSN program and writes it to
 * prisma/faqs.json (keyed by program slug — same pattern as verification-log.json).
 * The program detail page renders these as a Q&A section + FAQPage JSON-LD, which
 * makes each page substantially more unique (not a thin template with swapped
 * numbers) and eligible for FAQ rich results.
 *
 * Uniqueness + accuracy:
 * - Each school's FAQ is written ONLY from its real data + its unique `notes`
 *   field, so answers genuinely diverge school-to-school.
 * - NEVER invents a GPA, exam score, deadline, or fact. Where a detail isn't
 *   known, the answer points to the school's official page.
 * - Idempotent: skips schools already in faqs.json unless --force.
 *
 * Usage:  npx tsx scripts/gen-faqs.ts [--force]   (needs OPENAI_API_KEY)
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import OpenAI from 'openai'
import { loadEnv } from './_env'
import { SEED_PROGRAMS, type SeedProgram } from '../prisma/programs-data'

loadEnv()

const MODEL = 'gpt-4o-mini'
const BATCH_SIZE = 1

type Faq = { q: string; a: string }
type FaqFile = Record<string, Faq[]>

const SYSTEM_PROMPT = `You write short, accurate FAQ sections for individual US BSN (Bachelor of Science in Nursing) program pages on a student planning site. You are given facts about ONE school's program at a time; write 5 to 7 question-and-answer pairs that are SPECIFIC to that exact program.

HARD RULES:
- Use ONLY the facts provided for that school. NEVER invent or guess a GPA, exam score, deadline, accreditation claim, ranking, tuition, or any number. If a detail is not provided, do not state it — instead answer by telling the reader to confirm on the school's official admissions page.
- Make every answer specific to THIS school by name and weave in its actual details and the "notes" text. Do NOT write generic, templated answers that would read identically for another school. Vary the wording and the angle based on what is actually known about this program.
- If the program is direct-admit / freshman-entry (no published nursing GPA or entrance-exam cutoff), say so plainly and explain you apply to the university as a first-year student; do not imply a cutoff exists.
- Only describe a program as direct-admit when the facts explicitly say "ADMISSION MODEL: direct-admit". If the school has a published GPA or entrance-exam cutoff, or ranked/competitive/upper-division admission, it is NOT direct-admit — describe it as a competitive or upper-division admission instead, and never claim it is direct-admit.
- 2 to 4 sentences per answer. Natural, helpful, plain English. No markdown, no links inside answers, no fluff.
- Phrase questions naturally and include the school name where it reads well (e.g. "Does <University> require the TEAS for nursing?", "What GPA do you need for <University>'s BSN program?", "Is <University>'s nursing program direct-admit?", "When is the application deadline?", "What prerequisites does <University> require?", "How competitive is admission?", "How do I apply?").

Respond with JSON for the single program: {"faqs": [{"q": "...", "a": "..."}, ...]}.`

function schoolBlock(p: SeedProgram): string {
  const directAdmit =
    p.minOverallGPA === null && p.examType === null && p.requiredCourses.length === 0 &&
    (p.dataQuality === 'verified' || p.dataQuality === 'partial')
  const bits = [
    `slug: ${p.slug}`,
    `university: ${p.university}`,
    `program: ${p.name} (${p.programType})`,
    `location: ${p.city}, ${p.state}`,
    p.isPublic ? 'public university' : 'private institution',
    p.isFlagship ? 'state flagship' : null,
    p.minOverallGPA != null ? `min overall GPA: ${p.minOverallGPA}` : 'min overall GPA: not published',
    p.minScienceGPA != null ? `min science GPA: ${p.minScienceGPA}` : null,
    p.examType ? `entrance exam: ${p.examType}${p.minExamScore != null ? ` (min ${p.minExamScore}%)` : ' (no numeric minimum published)'}` : 'entrance exam: none required',
    p.casperRequired ? 'CASPer required' : null,
    p.requiredCourses.length ? `prerequisite course keys: ${p.requiredCourses.join(', ')}` : 'prerequisites: none listed as pre-admission (or completed within the curriculum)',
    p.deadlines ? `application deadline(s): ${p.deadlines}` : 'application deadline: not published here (check official page)',
    p.officialUrl ? `official page: ${p.officialUrl}` : null,
    directAdmit ? 'ADMISSION MODEL: direct-admit / freshman-entry (apply to the university as a first-year student; no nursing-specific cutoff)' : null,
    p.notes ? `notes: ${p.notes}` : null,
  ].filter(Boolean)
  return `### Program\n${bits.join('\n')}`
}

function validFaqs(v: unknown): Faq[] | null {
  if (!Array.isArray(v)) return null
  const out: Faq[] = []
  for (const it of v) {
    if (it && typeof it.q === 'string' && typeof it.a === 'string' && it.q.trim() && it.a.trim()) {
      out.push({ q: it.q.trim(), a: it.a.trim() })
    }
  }
  return out.length ? out : null
}

async function main() {
  const force = process.argv.includes('--force')
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set.')
  const openai = new OpenAI()

  const file = path.join(process.cwd(), 'prisma', 'faqs.json')
  let existing: FaqFile = {}
  try { existing = JSON.parse(await fs.readFile(file, 'utf8')) as FaqFile } catch { existing = {} }

  const targets = SEED_PROGRAMS.filter(p => force || !existing[p.slug]?.length)
  console.log(`Programs needing FAQs: ${targets.length} (of ${SEED_PROGRAMS.length}; ${force ? 'force' : 'skip existing'})`)
  if (targets.length === 0) { console.log('Nothing to do.'); return }

  const result: FaqFile = { ...existing }
  let done = 0
  for (let i = 0; i < targets.length; i += BATCH_SIZE) {
    const batch = targets.slice(i, i + BATCH_SIZE)
    process.stdout.write(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(targets.length / BATCH_SIZE)} (${batch.length}) … `)
    const res = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.5,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: batch.map(schoolBlock).join('\n\n') },
      ],
    })
    const parsed = JSON.parse(res.choices[0]?.message?.content ?? '{}') as Record<string, unknown>
    const b = batch[0]
    const faqs =
      validFaqs(parsed.faqs) ??
      validFaqs((parsed.schools as Array<{ faqs?: unknown }> | undefined)?.[0]?.faqs) ??
      validFaqs(parsed.questions)
    let ok = 0
    if (faqs) { result[b.slug] = faqs; ok = 1; done++ }
    console.log(`${ok}/${batch.length} ok`)
  }

  // Stable, sorted output for clean diffs.
  const sorted: FaqFile = {}
  for (const slug of Object.keys(result).sort()) sorted[slug] = result[slug]
  await fs.writeFile(file, JSON.stringify(sorted, null, 2) + '\n')
  console.log(`\nWrote ${done} new FAQ sets. faqs.json now covers ${Object.keys(sorted).length}/${SEED_PROGRAMS.length} programs.`)
}

main().catch(e => { console.error(e); process.exit(1) })
