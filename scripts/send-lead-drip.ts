/**
 * Advances the post-checklist email nurture sequence. For each captured lead that
 * hasn't finished the drip, sends the next email once enough time has passed since
 * the previous one (or since signup for the first). Idempotent — safe to run daily.
 *
 *   npx tsx scripts/send-lead-drip.ts          # local dev.db
 *   npx tsx scripts/send-lead-drip.ts --prod   # live Turso (where real leads are)
 */
import { loadEnv } from './_env'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../app/generated/prisma/client'
import { libsqlConfig } from '../lib/libsql-config'
import { sendLeadDripEmail, DRIP_STAGES } from '../lib/email'

loadEnv()
const cfg = libsqlConfig()
const prisma = new PrismaClient({ adapter: new PrismaLibSql(cfg) })

// Days to wait before sending the next email, indexed by the lead's CURRENT stage.
// stage 0 -> wait 1 day to send email #1, then +2, +3, +4 days for #2/#3/#4.
const WAIT_DAYS = [1, 2, 3, 4]
const DAY = 86_400_000

async function main() {
  const target = cfg.url.startsWith('file:') ? 'LOCAL' : 'REMOTE/PROD'
  const leads = await prisma.lead.findMany({ where: { dripStage: { lt: DRIP_STAGES } } })
  const now = Date.now()
  let sent = 0

  for (const lead of leads) {
    const ref = (lead.lastDripAt ?? lead.createdAt).getTime()
    const wait = WAIT_DAYS[lead.dripStage] ?? Number.MAX_SAFE_INTEGER
    if (now - ref < wait * DAY) continue

    const nextStage = lead.dripStage + 1
    const ok = await sendLeadDripEmail(lead.email, nextStage)
    if (ok) {
      await prisma.lead.update({ where: { id: lead.id }, data: { dripStage: nextStage, lastDripAt: new Date() } })
      sent++
    }
  }

  console.log(`Lead drip (${target}): ${leads.length} in-progress lead(s), ${sent} email(s) sent.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
