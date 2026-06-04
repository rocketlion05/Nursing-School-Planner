/**
 * Marks a school request resolved after the routine has acted on it.
 *
 *   npx tsx scripts/resolve-request.ts <id> --added       --note "Added as slug tx-foo-bar"
 *   npx tsx scripts/resolve-request.ts <id> --wont-add    --note "Not a BSN program"
 *   npx tsx scripts/resolve-request.ts <id> --wont-add    --no-public-info
 *       → marks wont_add AND emails the requesting user that no public info was found
 *
 * Status values: new | in_progress | added | wont_add
 * (--fulfilled / --rejected accepted as aliases for --added / --wont-add.)
 *
 * Run with --prod to update the live database and send real emails.
 */
import { loadEnv } from './_env'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../app/generated/prisma/client'
import { libsqlConfig } from '../lib/libsql-config'
import { sendSchoolNotFoundEmail } from '../lib/email'

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
  const noPublicInfo = args.includes('--no-public-info')

  if (!id || !status) {
    console.error('Usage: resolve-request.ts <id> --added|--wont-add [--note "..."] [--no-public-info]')
    process.exit(1)
  }

  const updated = await prisma.schoolRequest.update({
    where: { id },
    data: {
      status,
      resolution: note ?? (noPublicInfo ? 'No publicly available BSN requirements found.' : null),
      resolvedAt: new Date(),
    },
  })
  console.log(`Request ${updated.id} (${updated.university}) -> ${updated.status}`)

  // If marked wont_add with --no-public-info, email the requesting user.
  if (noPublicInfo && status === 'wont_add' && updated.requestedBy) {
    const user = await prisma.user.findUnique({
      where: { id: updated.requestedBy },
      select: { email: true, name: true, username: true },
    })
    if (user?.email) {
      console.log(`Sending "no public info" email to ${user.email}…`)
      await sendSchoolNotFoundEmail({
        to: user.email,
        name: user.name || user.username,
        university: updated.university,
        city: updated.city,
        state: updated.state,
      })
      console.log('Email sent.')
    } else {
      console.warn('No email found for requestedBy user — skipping notification.')
    }
  }
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
