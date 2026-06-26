// Pure, dependency-free date math for the one-time Cycle Pass window. Shared by
// the checkout action, the webhook, the success-page fallback, and the checkout
// preview so they all derive the exact same expiry. Never call new Date() at
// module scope — the caller always passes `now`.

/** A Cycle Pass is valid for this many days from the moment of purchase. */
export const CYCLE_PASS_DAYS = 180

const DAY_MS = 86_400_000

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS)
}

/**
 * A Cycle Pass's FIXED expiry: purchase date + 180 days. Computed once at
 * purchase, written to the pass row, and treated as immutable thereafter.
 */
export function computeCyclePassExpiry(now: Date): Date {
  return addDays(now, CYCLE_PASS_DAYS)
}
