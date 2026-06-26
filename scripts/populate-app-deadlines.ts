/**
 * Fills Program.appDeadlineMonth / appDeadlineDay from each program's free-text
 * `deadlines`, using parseFurthestDeadline. Deterministic + re-runnable: run it
 * after a fresh seed (the seed never touches these columns, so they survive
 * re-seeds, but a brand-new DB starts them null).
 *
 *   npx tsx scripts/populate-app-deadlines.ts          # local dev.db
 *   npx tsx scripts/populate-app-deadlines.ts --prod   # live Turso
 */
import { loadEnv } from './_env'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../app/generated/prisma/client'
import { libsqlConfig } from '../lib/libsql-config'
import { parseFurthestDeadline } from '../lib/parse-deadline'

loadEnv()
const prisma = new PrismaClient({ adapter: new PrismaLibSql(libsqlConfig()) })

async function main() {
  const programs = await prisma.program.findMany({
    select: { id: true, university: true, deadlines: true },
  })
  let filled = 0
  let cleared = 0
  for (const p of programs) {
    const md = parseFurthestDeadline(p.deadlines)
    await prisma.program.update({
      where: { id: p.id },
      data: { appDeadlineMonth: md?.month ?? null, appDeadlineDay: md?.day ?? null },
    })
    if (md) filled++
    else cleared++
  }
  console.log(`Parsed deadlines for ${programs.length} programs: ${filled} with a date, ${cleared} without.`)
}

main()
  .catch(err => {
    console.error('populate-app-deadlines failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
