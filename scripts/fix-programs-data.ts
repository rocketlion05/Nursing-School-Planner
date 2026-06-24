/**
 * One-shot data-quality pass over prisma/programs-data.ts.
 *
 *  1. Fixes the `isPublic` flag — almost every private / for-profit school was
 *     incorrectly flagged public. We flip a known set of private-school slugs.
 *  2. Applies verified admission data (researched from official program pages,
 *     2026) for the Arkansas schools and the major Texas public flagships.
 *
 * Run once with:  npx tsx scripts/fix-programs-data.ts
 * Then re-seed:    npx tsx prisma/seed.ts
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { SEED_PROGRAMS, type SeedProgram } from '../prisma/programs-data'

// --- 1. Private / for-profit schools (were wrongly isPublic: true) ------------
const PRIVATE_SLUGS = new Set<string>([
  // Arkansas
  'ar-harding-university-searcy',
  'ar-john-brown-university-siloam-springs',
  'ar-ouachita-baptist-university-arkadelphia',
  'ar-philander-smith-university-little-rock',
  // Texas
  'tx-abilene-christian-university-abilene',
  'tx-arizona-college-of-nursing-dallas',
  'tx-baylor-university-dallas',
  'tx-chamberlain-college-of-nursing-houston-houston',
  'tx-chamberlain-college-of-nursing-irving-irving',
  'tx-chamberlain-college-of-nursing-pearland-pearland',
  'tx-chamberlain-college-of-nursing-san-antonio-san-antonio',
  'tx-concordia-university-texas-austin',
  'tx-denver-college-of-nursing-houston',
  'tx-east-texas-baptist-university-marshall',
  'tx-fairfield-university-austin',
  'tx-galen-college-of-nursing-san-antonio',
  'tx-hallmark-university-san-antonio',
  'tx-hardin-simmons-university-abilene',
  'tx-houston-christian-university-houston',
  'tx-howard-payne-university-brownwood',
  'tx-letourneau-university-longview',
  'tx-patty-hanks-shelton-school-of-nursing-abilene',
  'tx-schreiner-university-kerrville',
  'tx-south-university-round-rock',
  'tx-southwestern-adventist-university-keene',
  'tx-st-edward-s-university-austin',
  'tx-st-mary-s-university-san-antonio',
  'tx-texas-christian-university-fort-worth',
  'tx-texas-lutheran-university-seguin',
  'tx-university-of-mary-hardin-baylor-belton',
  'tx-university-of-st-thomas-houston',
  'tx-university-of-the-incarnate-word-san-antonio',
  'tx-wayland-baptist-university-new-braunfels',
  'tx-west-coast-university-texas-richardson',
  'tx-western-governors-university-houston',
  'tx-western-technical-college-el-paso',
  // National
  'pa-university-of-pennsylvania-philadelphia',
  'md-johns-hopkins-university-baltimore',
  'nc-duke-university-durham',
  'ga-emory-university-atlanta',
  'ma-boston-college-chestnut-hill',
])

// --- 2. Verified admission data (official program pages, 2026) ----------------
const UPDATES: Record<string, Partial<SeedProgram>> = {
  // ── ARKANSAS ──────────────────────────────────────────────────────────────
  'ar-university-of-arkansas-fayetteville': {
    name: 'Pre-Licensure BSN',
    minOverallGPA: 3.0, minScienceGPA: null,
    requiredCourses: ['ANAT_PHYS_1', 'ANAT_PHYS_2', 'MICRO', 'CHEM', 'ENGLISH_COMP'],
    examType: 'TEAS', minExamScore: null, casperRequired: true,
    deadlines: 'Jan 15 (Fall) / July 15 (Spring), via NursingCAS',
    notes: "Eleanor Mann School of Nursing. TEAS and Casper required; admission is competitive (admits typically score ~70+ on the TEAS). Uses College Algebra rather than statistics. Verified from the official admission page (2026).",
    dataQuality: 'verified',
  },
  'ar-university-of-arkansas-for-medical-sciences-uams-little-rock': {
    minOverallGPA: 2.5, minScienceGPA: 2.5,
    examType: 'TEAS', minExamScore: 60, casperRequired: false,
    deadlines: 'March 1',
    notes: 'UAMS College of Nursing. TEAS minimum 60% (waived when both cumulative and prerequisite GPA are ≥ 3.4). Flagship academic medical center. Verified from the official admission page (2026).',
    dataQuality: 'verified',
  },
  'ar-university-of-central-arkansas-conway': {
    minOverallGPA: 2.75, minScienceGPA: 2.5,
    requiredCourses: ['ANAT_PHYS_1', 'ANAT_PHYS_2', 'MICRO', 'CHEM', 'STATS', 'NUTRITION', 'LIFESPAN', 'ENGLISH_COMP'],
    examType: null, minExamScore: null, casperRequired: false,
    deadlines: 'Feb 15 – Mar 15 (one application cycle per year)',
    notes: 'UCA Department of Nursing. No TEAS/HESI entrance exam required. Requires a grade of C or better in all prerequisites. Verified from the official admission page (2026).',
    dataQuality: 'verified',
  },
  'ar-arkansas-state-university-jonesboro': {
    minOverallGPA: 3.0, minScienceGPA: 3.0,
    examType: 'TEAS', minExamScore: null, casperRequired: false,
    deadlines: 'Verify with ASU School of Nursing',
    notes: '3.0 cumulative and prerequisite GPA required (official). TEAS required; minimum score not published. Verify current details with the ASU School of Nursing.',
    dataQuality: 'partial',
  },
  'ar-arkansas-tech-university-russellville': {
    minOverallGPA: 2.75, minScienceGPA: null,
    examType: 'TEAS', minExamScore: null, casperRequired: false,
    deadlines: 'Feb 15 (Fall) / Sep 15 (Spring)',
    notes: "Prerequisite GPA ≥ 2.75. TEAS required at the 'Proficient' level (≈59%+); ATU uses the TEAS, not the HESI. Verified from the official admission page (2026).",
    dataQuality: 'partial',
  },

  // ── TEXAS FLAGSHIPS ───────────────────────────────────────────────────────
  'tx-university-of-texas-at-austin-austin': {
    minOverallGPA: null, minScienceGPA: null,
    requiredCourses: ['ANAT_PHYS_1', 'ANAT_PHYS_2', 'MICRO', 'CHEM', 'STATS', 'NUTRITION'],
    examType: null, minExamScore: null, casperRequired: false,
    deadlines: 'Fall admission only (external transfer)',
    notes: 'UT Austin School of Nursing. Direct-entry BSN, fall admission only. No TEAS/HESI entrance exam required. Highly competitive — admitted students typically have ~3.5+ GPAs. Verify exact prerequisites with the school.',
    dataQuality: 'partial',
  },
  'tx-texas-a-m-university-bryan': {
    minOverallGPA: 3.0, minScienceGPA: 3.0,
    examType: 'HESI A2', minExamScore: 75, casperRequired: false,
    deadlines: 'via NursingCAS',
    notes: 'Texas A&M College of Nursing. HESI A2 required (minimum 75% in each section) plus a Kira Talent interview/writing assessment. Verified from official sources (2026).',
    dataQuality: 'verified',
  },
  'tx-texas-tech-university-health-sciences-center-school-of-nursing-lubbock': {
    minOverallGPA: 3.0, minScienceGPA: 3.0,
    requiredCourses: ['ANAT_PHYS_1', 'ANAT_PHYS_2', 'MICRO', 'CHEM'],
    examType: null, minExamScore: null, casperRequired: false,
    deadlines: null,
    notes: 'TTUHSC School of Nursing. 3.0 overall and science GPA preferred; holistic review with no TEAS/HESI entrance exam listed. Pathophysiology is also required. Verify current requirements.',
    dataQuality: 'partial',
  },
  'tx-the-university-of-texas-at-san-antonio-san-antonio': {
    name: 'Traditional BSN', university: 'UT Health San Antonio',
    minOverallGPA: 3.0, minScienceGPA: null,
    requiredCourses: ['ANAT_PHYS_1', 'ANAT_PHYS_2', 'MICRO', 'CHEM', 'STATS', 'NUTRITION', 'LIFESPAN', 'ENGLISH_COMP'],
    examType: 'TEAS', minExamScore: 65, casperRequired: false,
    deadlines: 'Feb 1 (Fall) / Aug 1 (Spring)',
    notes: 'UT Health San Antonio School of Nursing. TEAS minimum overall score 65, plus a Kira Talent interview/writing sample. Verified from the official admission page (2026).',
    dataQuality: 'verified',
  },
  'tx-university-of-texas-health-science-center-at-houston-houston': {
    minOverallGPA: 3.0, minScienceGPA: 3.0,
    requiredCourses: ['ANAT_PHYS_1', 'ANAT_PHYS_2', 'MICRO', 'CHEM'],
    examType: 'HESI A2', minExamScore: null, casperRequired: false,
    deadlines: null,
    notes: 'Cizik School of Nursing at UTHealth Houston (flagship). HESI A2 or TEAS required; the entrance exam is waived with a grade of B or better in each pre-nursing science. 3.0 overall and science GPA minimum. Verified from official sources (2026).',
    dataQuality: 'partial',
  },
}

const FIELD_ORDER: (keyof SeedProgram)[] = [
  'slug', 'name', 'university', 'city', 'state', 'isPublic', 'programType',
  'isFlagship', 'tier', 'region', 'minOverallGPA', 'minScienceGPA',
  'requiredCourses', 'examType', 'minExamScore', 'casperRequired',
  'deadlines', 'notes', 'officialUrl', 'admissionEmail', 'dataQuality', 'estimatedFields',
]

function serialize(p: SeedProgram): string {
  const parts = FIELD_ORDER
    .filter(k => !(k === 'estimatedFields' && !p.estimatedFields?.length))
    .filter(k => !(k === 'officialUrl' && !p.officialUrl))
    .filter(k => !(k === 'admissionEmail' && !p.admissionEmail))
    .map(k => `${k}: ${JSON.stringify(p[k])}`)
  return `  { ${parts.join(', ')} },`
}

async function main() {
  let isPublicFixes = 0
  let dataUpdates = 0

  const updated: SeedProgram[] = SEED_PROGRAMS.map(p => {
    const next: SeedProgram = { ...p }
    if (PRIVATE_SLUGS.has(p.slug) && next.isPublic) {
      next.isPublic = false
      isPublicFixes++
    }
    if (UPDATES[p.slug]) {
      Object.assign(next, UPDATES[p.slug])
      dataUpdates++
    }
    return next
  })

  // Sanity: every UPDATES / PRIVATE slug must exist in the data.
  const slugs = new Set(SEED_PROGRAMS.map(p => p.slug))
  for (const s of [...PRIVATE_SLUGS, ...Object.keys(UPDATES)]) {
    if (!slugs.has(s)) throw new Error(`Unknown slug referenced: ${s}`)
  }

  const file = path.join(process.cwd(), 'prisma', 'programs-data.ts')
  const original = await fs.readFile(file, 'utf8')
  const marker = 'export const SEED_PROGRAMS: SeedProgram[] = ['
  const idx = original.indexOf(marker)
  if (idx === -1) throw new Error('Could not find SEED_PROGRAMS marker')
  const header = original.slice(0, idx + marker.length)

  const body = updated.map(serialize).join('\n')
  const next = `${header}\n${body}\n]\n`
  await fs.writeFile(file, next)

  console.log(`isPublic fixes: ${isPublicFixes}`)
  console.log(`verified data updates: ${dataUpdates}`)
  console.log(`total programs: ${updated.length}`)
  console.log(`private programs now: ${updated.filter(p => !p.isPublic).length}`)
  console.log(`verified: ${updated.filter(p => p.dataQuality === 'verified').length}, ` +
    `partial: ${updated.filter(p => p.dataQuality === 'partial').length}, ` +
    `placeholder: ${updated.filter(p => p.dataQuality === 'placeholder').length}`)
}

main().catch(e => { console.error(e); process.exit(1) })
