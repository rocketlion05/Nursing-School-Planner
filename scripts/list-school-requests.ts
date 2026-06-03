/**
 * Lists school requests as JSON — input for the school-research routine.
 *
 *   npx tsx scripts/list-school-requests.ts              # unresolved (new + in_progress)
 *   npx tsx scripts/list-school-requests.ts --all        # every request
 *   npx tsx scripts/list-school-requests.ts --status=added
 *
 * SchoolRequest.status values (must match the app/admin): new | in_progress | added | wont_add
 *
 * Run with prod DATABASE_URL + DATABASE_AUTH_TOKEN set to read live requests.
 */
import { loadEnv } from './_env'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../app/generated/prisma/client'
import { libsqlConfig } from '../lib/libsql-config'

loadEnv() // pass --prod to read the live database
const prisma = new PrismaClient({ adapter: new PrismaLibSql(libsqlConfig()) })

async function main() {
  const args = process.argv.slice(2)
  const all = args.includes('--all')
  const statusArg = args.find(a => a.startsWith('--status='))?.split('=')[1]
  const where = all
    ? {}
    : statusArg
      ? { status: statusArg }
      : { status: { in: ['new', 'in_progress'] } }

  const requests = await prisma.schoolRequest.findMany({
    where,
    orderBy: { createdAt: 'asc' },
  })

  // Machine-readable output for an agent to parse.
  console.log(JSON.stringify(requests, null, 2))
  const label = all ? 'all' : statusArg ?? 'new + in_progress'
  console.error(`\n${requests.length} request(s) [${label}]`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
