/**
 * One-shot: set `officialUrl` on the programs we have confirmed official
 * admissions links for (researched + verified from official sources, 2026).
 * Only touches officialUrl — every other field keeps its current value.
 *
 * Run once:  npx tsx scripts/add-official-urls.ts   then   npx tsx prisma/seed.ts --prod
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { SEED_PROGRAMS, type SeedProgram } from '../prisma/programs-data'

const OFFICIAL_URLS: Record<string, string> = {
  // Arkansas
  'ar-arkansas-state-university-jonesboro': 'https://www.astate.edu/programs/bsn-in-nursing.html',
  'ar-arkansas-tech-university-russellville': 'https://catalog.atu.edu/undergraduate/programs/education-health/nursing/',
  'ar-harding-university-searcy': 'https://www.harding.edu/nursing/undergraduate-program/admission.html',
  'ar-henderson-state-university-arkadelphia': 'https://www.hsu.edu/academics/aviation-science-and-nursing/nursing/bsn-on-campus/prelicensure-bsn-admission-policy-and-procedures/',
  'ar-southern-arkansas-university-magnolia': 'https://web.saumag.edu/nursing/bsn-program-application/',
  'ar-university-of-arkansas-fayetteville': 'https://catalog.uark.edu/undergraduatecatalog/collegesandschools/collegeofeducationandhealthprofessions/eleanormannschoolofnursingnurs/',
  'ar-university-of-arkansas-for-medical-sciences-uams-little-rock': 'https://nursing.uams.edu/programs/bsn/admissions/requirements/',
  'ar-university-of-central-arkansas-conway': 'https://uca.edu/nursing/bachelor-of-science-in-nursing-admission-requirements/',
  'ar-john-brown-university-siloam-springs': 'https://www.jbu.edu/majors/nursing/',
  'ar-ouachita-baptist-university-arkadelphia': 'https://obu.edu/nursing/index.php',
  'ar-philander-smith-university-little-rock': 'https://www.philander.edu/bsn-application/',
  'ar-university-of-arkansas-fort-smith-fort-smith': 'https://uafs.edu/academics/colleges-and-schools/chehs/health-sciences/departments/nursing/requirements.php',
  'ar-university-of-arkansas-at-monticello-monticello': 'https://www.uamont.edu/academics/nursing/undergraduate-student-information.html',
  'ar-university-of-arkansas-at-pine-bluff-pine-bluff': 'https://uapb.edu/academics/sas/dept-of-nursing/',
  'ar-university-of-arkansas-for-medical-sciences-northwest-fayetteville': 'https://nursing.uams.edu/programs/bsn/accelerated-bsn/',
  // Texas flagships
  'tx-university-of-texas-at-austin-austin': 'https://nursing.utexas.edu/academics/undergraduate/bsn',
  'tx-texas-a-m-university-bryan': 'https://nursing.tamu.edu/degrees/bsn-traditional/index.html',
  'tx-texas-tech-university-health-sciences-center-school-of-nursing-lubbock': 'https://www.ttuhsc.edu/nursing/undergrad/bsn/admission-requirements.aspx',
  'tx-the-university-of-texas-at-san-antonio-san-antonio': 'https://nursing.uthscsa.edu/nursing/programs/bsn-traditional/admissions',
  'tx-university-of-texas-health-science-center-at-houston-houston': 'https://nursing.uth.edu/programs/bsn/bsn-admission-criteria',
  'tx-baylor-university-dallas': 'https://nursing.baylor.edu/admissions/undergraduate-admissions',
}

// Must match the serializer in scripts/fix-programs-data.ts.
const FIELD_ORDER: (keyof SeedProgram)[] = [
  'slug', 'name', 'university', 'city', 'state', 'isPublic', 'programType',
  'isFlagship', 'tier', 'region', 'minOverallGPA', 'minScienceGPA',
  'requiredCourses', 'examType', 'minExamScore', 'casperRequired',
  'deadlines', 'notes', 'officialUrl', 'dataQuality', 'estimatedFields',
]

function serialize(p: SeedProgram): string {
  const parts = FIELD_ORDER
    .filter(k => !(k === 'estimatedFields' && !p.estimatedFields?.length))
    .filter(k => !(k === 'officialUrl' && !p.officialUrl))
    .map(k => `${k}: ${JSON.stringify(p[k])}`)
  return `  { ${parts.join(', ')} },`
}

async function main() {
  let set = 0
  const updated = SEED_PROGRAMS.map(p => {
    const url = OFFICIAL_URLS[p.slug]
    if (url && p.officialUrl !== url) { set++; return { ...p, officialUrl: url } }
    return p
  })

  // Sanity: every slug we reference must exist.
  const slugs = new Set(SEED_PROGRAMS.map(p => p.slug))
  for (const s of Object.keys(OFFICIAL_URLS)) {
    if (!slugs.has(s)) throw new Error(`Unknown slug referenced: ${s}`)
  }

  const file = path.join(process.cwd(), 'prisma', 'programs-data.ts')
  const original = await fs.readFile(file, 'utf8')
  const marker = 'export const SEED_PROGRAMS: SeedProgram[] = ['
  const idx = original.indexOf(marker)
  if (idx === -1) throw new Error('Could not find SEED_PROGRAMS marker')
  const header = original.slice(0, idx + marker.length)
  const body = updated.map(serialize).join('\n')
  await fs.writeFile(file, `${header}\n${body}\n]\n`)

  console.log(`officialUrl set on ${set} programs (of ${Object.keys(OFFICIAL_URLS).length} known links).`)
  console.log(`with officialUrl now: ${updated.filter(p => p.officialUrl).length}/${updated.length}`)
}

main().catch(e => { console.error(e); process.exit(1) })
