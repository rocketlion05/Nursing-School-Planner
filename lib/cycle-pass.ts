// Pure, dependency-free date math for the one-time Cycle Pass window. Shared by
// the checkout action, the webhook, the success-page fallback, and the checkout
// preview so they all derive the exact same expiry. Never call new Date() at
// module scope — the caller always passes `now`.

import type { MonthDay } from './parse-deadline'
export type { MonthDay } from './parse-deadline'

/** Days added after the furthest saved-school deadline. */
export const DEADLINE_BUFFER_DAYS = 60
/** Window length when the buyer has no saved school with a parseable deadline. */
export const DEFAULT_WINDOW_DAYS = 180

const DAY_MS = 86_400_000

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS)
}

/**
 * The next future occurrence (at or after `now`, UTC) of a recurring month/day.
 * A "March 1" deadline resolves to this year's March 1 if it's still ahead,
 * otherwise next year's.
 */
export function nextDeadlineOccurrence(md: MonthDay, now: Date): Date {
  const year = now.getUTCFullYear()
  let d = new Date(Date.UTC(year, md.month - 1, md.day))
  if (d.getTime() <= now.getTime()) d = new Date(Date.UTC(year + 1, md.month - 1, md.day))
  return d
}

/**
 * Computes a Cycle Pass's FIXED expiry at the moment of purchase. `deadlines`
 * are the recurring month/day deadlines of the buyer's saved schools at that
 * moment. Expiry = furthest deadline's next occurrence + 60 days; if the list is
 * empty (no saved schools, or none with a parseable deadline) → purchase + 180
 * days. The result is written once and treated as immutable.
 */
export function computeCyclePassExpiry(now: Date, deadlines: MonthDay[]): Date {
  if (deadlines.length === 0) return addDays(now, DEFAULT_WINDOW_DAYS)
  const furthest = Math.max(...deadlines.map(md => nextDeadlineOccurrence(md, now).getTime()))
  return addDays(new Date(furthest), DEADLINE_BUFFER_DAYS)
}
