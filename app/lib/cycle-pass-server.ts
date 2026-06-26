import 'server-only'
import { prisma } from '@/lib/prisma'
import {
  computeCyclePassExpiry,
  DEFAULT_WINDOW_DAYS,
  type MonthDay,
} from '@/lib/cycle-pass'

/**
 * The recurring application deadlines of a profile's saved schools (the default
 * "Saved" list — what the heart UI toggles). Only schools with a structured
 * deadline contribute; the rest are ignored (handled by the 180-day fallback).
 */
export async function getSavedSchoolDeadlines(profileId: string): Promise<MonthDay[]> {
  const items = await prisma.listItem.findMany({
    where: { list: { profileId, isDefault: true } },
    select: { program: { select: { appDeadlineMonth: true, appDeadlineDay: true } } },
  })
  const out: MonthDay[] = []
  for (const i of items) {
    const { appDeadlineMonth: month, appDeadlineDay: day } = i.program
    if (month != null && day != null) out.push({ month, day })
  }
  return out
}

export type CyclePassPreview = {
  /** ISO date the would-be pass expires. */
  expiry: string
  /** Whether the expiry is derived from saved-school deadlines (vs. the default). */
  basedOnSchools: boolean
  /** Number of saved schools that contributed a deadline. */
  schoolsWithDeadline: number
}

/**
 * What a Cycle Pass purchased *right now* would expire on, given the profile's
 * current saved schools. Drives the pre-purchase copy on the checkout card.
 */
export async function getCyclePassPreview(
  profileId: string | null,
  now: Date,
): Promise<CyclePassPreview> {
  const deadlines = profileId ? await getSavedSchoolDeadlines(profileId) : []
  const expiry = computeCyclePassExpiry(now, deadlines)
  return {
    expiry: expiry.toISOString(),
    basedOnSchools: deadlines.length > 0,
    schoolsWithDeadline: deadlines.length,
  }
}

/** Expiry window length used when no saved-school deadline applies. */
export { DEFAULT_WINDOW_DAYS }

/**
 * Records a purchased Cycle Pass. Idempotent and write-once: keyed on the Stripe
 * session id, the `update: {}` makes re-delivery (webhook + success page) a
 * no-op so the immutable `expiryDate` can never be changed after creation.
 * Returns true if a new pass row was created.
 */
export async function recordCyclePass(
  userId: string,
  stripeSessionId: string,
  expiry: Date,
): Promise<boolean> {
  // Ensure the buyer has a profile (the premium holder) to attach the pass to.
  const profile = await prisma.profile.upsert({
    where: { userId },
    create: { userId },
    update: {},
    select: { id: true },
  })

  const existing = await prisma.cyclePass.findUnique({
    where: { stripeSessionId },
    select: { id: true },
  })
  await prisma.cyclePass.upsert({
    where: { stripeSessionId },
    create: { profileId: profile.id, stripeSessionId, expiryDate: expiry },
    update: {}, // immutable — never recompute or overwrite an existing pass
  })
  return !existing
}
