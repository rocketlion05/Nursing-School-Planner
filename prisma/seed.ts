import { loadEnv } from '../scripts/_env'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../app/generated/prisma/client'
import { libsqlConfig } from '../lib/libsql-config'
import { SEED_PROGRAMS } from './programs-data'

loadEnv() // pass --prod to seed the live Turso database
const cfg = libsqlConfig()
const adapter = new PrismaLibSql(cfg)
const prisma = new PrismaClient({ adapter })

const accessCodes = [{ code: 'COMPASS2025' }, { code: 'NURSING-BETA' }, { code: 'CYCLE-DEMO' }]

async function main() {
  const target = cfg.url.startsWith('file:') ? `LOCAL (${cfg.url})` : `REMOTE/PROD (${cfg.url})`
  console.log(`Seeding programs (idempotent upsert by slug) -> ${target}`)

  let created = 0
  let updated = 0
  const canonicalSlugs: string[] = []

  for (const p of SEED_PROGRAMS) {
    canonicalSlugs.push(p.slug)
    const data = {
      name: p.name,
      university: p.university,
      city: p.city,
      state: p.state,
      region: p.region,
      tier: p.tier,
      isFlagship: p.isFlagship,
      isPublic: p.isPublic,
      programType: p.programType,
      minOverallGPA: p.minOverallGPA,
      minScienceGPA: p.minScienceGPA,
      requiredCourses: JSON.stringify(p.requiredCourses),
      examType: p.examType,
      minExamScore: p.minExamScore,
      casperRequired: p.casperRequired,
      deadlines: p.deadlines,
      notes: p.notes,
      dataQuality: p.dataQuality,
    }

    const existing = await prisma.program.findUnique({ where: { slug: p.slug }, select: { id: true } })
    await prisma.program.upsert({
      where: { slug: p.slug },
      create: { slug: p.slug, ...data },
      update: data,
    })
    existing ? updated++ : created++
  }

  // Remove legacy/stale programs no longer in the canonical list (favorites cascade).
  const stale = await prisma.program.findMany({
    where: { OR: [{ slug: null }, { slug: { notIn: canonicalSlugs } }] },
    select: { id: true },
  })
  if (stale.length) {
    await prisma.program.deleteMany({ where: { id: { in: stale.map(s => s.id) } } })
  }

  // Access codes (idempotent).
  for (const code of accessCodes) {
    await prisma.accessCode.upsert({ where: { code: code.code }, create: code, update: {} })
  }

  // Summary
  const byRegion = { Arkansas: 0, Texas: 0, National: 0 } as Record<string, number>
  const byTier = { Local: 0, 'Top TX': 0, 'Top US': 0 } as Record<string, number>
  for (const p of SEED_PROGRAMS) {
    byRegion[p.region] = (byRegion[p.region] ?? 0) + 1
    byTier[p.tier] = (byTier[p.tier] ?? 0) + 1
  }

  console.log(`\nPrograms: ${created} created, ${updated} updated, ${stale.length} stale removed.`)
  console.log(`Total BSN programs now: ${SEED_PROGRAMS.length}`)
  console.log(`  By region — Arkansas: ${byRegion.Arkansas}, Texas: ${byRegion.Texas}, National: ${byRegion.National}`)
  console.log(`  By tier   — Local: ${byTier.Local}, Top TX: ${byTier['Top TX']}, Top US: ${byTier['Top US']}`)
  console.log(`  Flagship: ${SEED_PROGRAMS.filter(p => p.isFlagship).length}`)
  console.log(`Access codes ensured: ${accessCodes.map(c => c.code).join(', ')}`)
  console.log('Done!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
