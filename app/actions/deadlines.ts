'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/app/lib/dal'
import { isAdminEmail } from '@/lib/admin'
import { hasActivePremium } from '@/lib/premium'

export type DeadlineWithProgram = {
  id: string
  programId: string
  university: string
  programName: string
  state: string
  /** ISO date string (yyyy-mm-dd). */
  deadlineDate: string
  label: string
  remindersSent: number[]
}

type Ctx = { profileId: string; isPremium: boolean }

async function getCtx(): Promise<Ctx | null> {
  const user = await getCurrentUser()
  if (!user) return null
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { id: true, tier: true, premiumUntil: true },
  })
  if (!profile) return null
  return { profileId: profile.id, isPremium: isAdminEmail(user.email) || hasActivePremium(profile) }
}

const PREMIUM_REQUIRED = 'The deadline tracker is a Pro feature. Upgrade to set application deadlines.'

/** Parses a yyyy-mm-dd string to a UTC Date, or null if invalid. */
function parseDateOnly(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim())
  if (!m) return null
  const d = new Date(`${iso.trim()}T00:00:00.000Z`)
  return Number.isNaN(d.getTime()) ? null : d
}

export async function getDeadlines(): Promise<DeadlineWithProgram[]> {
  const ctx = await getCtx()
  if (!ctx) return []
  const rows = await prisma.deadline.findMany({
    where: { profileId: ctx.profileId },
    include: { program: { select: { university: true, name: true, state: true } } },
    orderBy: { deadlineDate: 'asc' },
  })
  return rows.map(r => ({
    id: r.id,
    programId: r.programId,
    university: r.program.university,
    programName: r.program.name,
    state: r.program.state,
    deadlineDate: r.deadlineDate.toISOString().slice(0, 10),
    label: r.label,
    remindersSent: safeParseInts(r.remindersSent),
  }))
}

function safeParseInts(json: string): number[] {
  try {
    const v = JSON.parse(json)
    return Array.isArray(v) ? v.filter((n): n is number => typeof n === 'number') : []
  } catch {
    return []
  }
}

export async function setDeadline(
  programId: string,
  dateISO: string,
  label: string,
): Promise<{ error?: string }> {
  try {
    const ctx = await getCtx()
    if (!ctx) return { error: 'Please log in.' }
    if (!ctx.isPremium) return { error: PREMIUM_REQUIRED }

    const date = parseDateOnly(dateISO)
    if (!date) return { error: 'Please enter a valid date.' }

    const program = await prisma.program.findUnique({ where: { id: programId }, select: { id: true } })
    if (!program) return { error: 'Program not found.' }

    const existing = await prisma.deadline.findUnique({
      where: { profileId_programId: { profileId: ctx.profileId, programId } },
      select: { id: true, deadlineDate: true },
    })

    const trimmedLabel = label.trim().slice(0, 80)

    if (existing) {
      // Reset reminder history if the deadline moved earlier, so 30/14/7-day
      // reminders re-fire against the new (sooner) date.
      const movedEarlier = date.getTime() < existing.deadlineDate.getTime()
      await prisma.deadline.update({
        where: { id: existing.id },
        data: {
          deadlineDate: date,
          label: trimmedLabel,
          ...(movedEarlier ? { remindersSent: '[]' } : {}),
        },
      })
    } else {
      await prisma.deadline.create({
        data: { profileId: ctx.profileId, programId, deadlineDate: date, label: trimmedLabel },
      })
    }

    revalidatePath('/deadlines')
    revalidatePath('/dashboard')
    return {}
  } catch (err) {
    console.error('setDeadline error:', err)
    return { error: 'Failed to save deadline.' }
  }
}

export async function deleteDeadline(id: string): Promise<{ error?: string }> {
  try {
    const ctx = await getCtx()
    if (!ctx) return { error: 'Please log in.' }
    if (!ctx.isPremium) return { error: PREMIUM_REQUIRED }

    const dl = await prisma.deadline.findUnique({ where: { id }, select: { profileId: true } })
    if (!dl || dl.profileId !== ctx.profileId) return { error: 'Deadline not found.' }

    await prisma.deadline.delete({ where: { id } })
    revalidatePath('/deadlines')
    revalidatePath('/dashboard')
    return {}
  } catch (err) {
    console.error('deleteDeadline error:', err)
    return { error: 'Failed to delete deadline.' }
  }
}
