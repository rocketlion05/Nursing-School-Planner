/**
 * Marks a school request resolved after the routine has acted on it.
 *
 *   npx tsx scripts/resolve-request.ts <id> --added    --note "Added as slug tx-foo-bar"
 *   npx tsx scripts/resolve-request.ts <id> --wont-add --note "Not a BSN program"
 *
 * Status values must match the app/admin/dashboard: new | in_progress | added | wont_add.
 * (--fulfilled / --rejected are accepted as aliases for --added / --wont-add.)
 *
 * Run with prod DATABASE_URL + DATABASE_AUTH_TOKEN set to update live requests.
 */
import { loadEnv } from './_env'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../app/generated/prisma/client'
import { libsqlConfig } from '../lib/libsql-config'

loadEnv() // pass --prod to update the live database
const prisma = new PrismaClient({ adapter: new PrismaLibSql(libsqlConfig()) })

async function main() {
  const args = process.argv.slice(2)
  const id = args.find(a => !a.startsWith('--'))
  const status =
    args.includes('--wont-add') || args.includes('--rejected') ? 'wont_add'
    : args.includes('--added') || args.includes('--fulfilled') ? 'added'
    : null
  const note = args.find(a => a.startsWith('--note='))?.split('=').slice(1).join('=')
    ?? (args.includes('--note') ? args[args.indexOf('--note') + 1] : undefined)

  if (!id || !status) {
    console.error('Usage: resolve-request.ts <id> --added|--wont-add [--note "..."]')
    process.exit(1)
  }

  const updated = await prisma.schoolRequest.update({
    where: { id },
    data: { status, resolution: note ?? null, resolvedAt: new Date() },
  })
  console.log(`Request ${updated.id} (${updated.university}) -> ${updated.status}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
