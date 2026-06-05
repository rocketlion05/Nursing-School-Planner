/**
 * Deadline reminder runner — meant to be scheduled daily.
 *
 * For every premium user's saved application deadline, sends a Resend email at
 * 30 / 14 / 7 days out. Idempotent: each deadline's `remindersSent` tracks which
 * milestones have already fired, so re-running the same day sends nothing new.
 * At most one email per deadline per run (the most urgent due milestone), and all
 * already-elapsed milestones are marked sent so larger ones never back-fire.
 *
 * Usage:
 *   npx tsx scripts/send-deadline-reminders.ts          # local dev.db
 *   npx tsx scripts/send-deadline-reminders.ts --prod   # live Turso DB
 */
import { loadEnv } from './_env'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../app/generated/prisma/client'
import { libsqlConfig } from '../lib/libsql-config'
import { isAdminEmail } from '../lib/admin'
import { sendDeadlineReminderEmail } from '../lib/email'

loadEnv()
const cfg = libsqlConfig()
const adapter = new PrismaLibSql(cfg)
const prisma = new PrismaClient({ adapter })

const MILESTONES = [30, 14, 7]
const MS_PER_DAY = 86_400_000

function parseInts(json: string): number[] {
  try {
    const v = JSON.parse(json)
    return Array.isArray(v) ? v.filter((n): n is number => typeof n === 'number') : []
  } catch {
    return []
  }
}

async function main() {
  const target = cfg.url.startsWith('file:') ? `LOCAL (${cfg.url})` : `REMOTE/PROD (${cfg.url})`
  console.log(`Sending deadline reminders -> ${target}`)

  const now = Date.now()
  const deadlines = await prisma.deadline.findMany({
    include: {
      program: { select: { university: true, name: true } },
      profile: { select: { name: true, email: true, tier: true, user: { select: { email: true, name: true } } } },
    },
  })

  let sent = 0
  let skipped = 0

  for (const dl of deadlines) {
    const isPremium = dl.profile.tier === 'cycle' || isAdminEmail(dl.profile.user?.email)
    if (!isPremium) {
      skipped++
      continue
    }

    const daysRemaining = Math.ceil((dl.deadlineDate.getTime() - now) / MS_PER_DAY)
    if (daysRemaining < 0) {
      skipped++
      continue
    }

    const due = MILESTONES.filter(m => daysRemaining <= m)
    const alreadySent = parseInts(dl.remindersSent)
    const unsentDue = due.filter(m => !alreadySent.includes(m))
    if (unsentDue.length === 0) {
      skipped++
      continue
    }

    const to = dl.profile.user?.email || dl.profile.email
    if (!to) {
      console.warn(`  ! deadline ${dl.id} has no recipient email — skipping`)
      skipped++
      continue
    }

    const deadlineDateStr = dl.deadlineDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    })

    await sendDeadlineReminderEmail({
      to,
      name: dl.profile.name || dl.profile.user?.name || '',
      university: dl.program.university,
      deadlineDate: deadlineDateStr,
      daysRemaining,
      label: dl.label || undefined,
    })

    // Mark every elapsed milestone as sent so larger ones don't fire later.
    const newSent = Array.from(new Set([...alreadySent, ...due])).sort((a, b) => b - a)
    await prisma.deadline.update({ where: { id: dl.id }, data: { remindersSent: JSON.stringify(newSent) } })

    console.log(`  ✓ ${dl.program.university} → ${to} (${daysRemaining}d left, milestones ${JSON.stringify(newSent)})`)
    sent++
  }

  console.log(`\nDone. ${sent} reminder(s) sent · ${skipped} deadline(s) skipped · ${deadlines.length} total.`)
}

main()
  .catch(err => {
    console.error('send-deadline-reminders failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
