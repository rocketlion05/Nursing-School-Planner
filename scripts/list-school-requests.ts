/**
 * Lists school requests as JSON — input for the school-research routine.
 *
 *   npx tsx scripts/list-school-requests.ts              # pending only (default)
 *   npx tsx scripts/list-school-requests.ts --all        # every request
 *   npx tsx scripts/list-school-requests.ts --status=fulfilled
 *
 * Run with prod DATABASE_URL + DATABASE_AUTH_TOKEN set to read live requests.
 */
import 'dotenv/config'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../app/generated/prisma/client'
import { libsqlConfig } from '../lib/libsql-config'

const prisma = new PrismaClient({ adapter: new PrismaLibSql(libsqlConfig()) })

async function main() {
  const args = process.argv.slice(2)
  const all = args.includes('--all')
  const statusArg = args.find(a => a.startsWith('--status='))?.split('=')[1]
  const where = all ? {} : { status: statusArg ?? 'pending' }

  const requests = await prisma.schoolRequest.findMany({
    where,
    orderBy: { createdAt: 'asc' },
  })

  // Machine-readable output for an agent to parse.
  console.log(JSON.stringify(requests, null, 2))
  console.error(`\n${requests.length} request(s) [${all ? 'all' : where.status}]`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
