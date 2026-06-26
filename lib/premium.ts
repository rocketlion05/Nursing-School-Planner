/**
 * Single source of truth for whether a profile currently has paid ("Pro") access.
 *
 * Premium can come from three independent sources, any of which grants access:
 *   1. A one-time Cycle Pass — premium purely while today < the pass's fixed
 *      `expiryDate` (date check, nothing else). A user may hold several; the
 *      furthest-future one wins. Cycle-pass buyers keep tier 'free' on the
 *      Profile — the pass row is the grant.
 *   2. tier === 'cycle' with `premiumUntil` — access-code grants (lapse on date)
 *      or legacy unlimited (premiumUntil null).
 *   3. Admins — handled by the caller via isAdminEmail(), not here.
 */

type DateLike = Date | string

type PremiumProfile = {
  tier: string
  premiumUntil?: DateLike | null
  cyclePasses?: { expiryDate: DateLike }[]
}

function toMs(v: DateLike): number {
  return typeof v === 'string' ? Date.parse(v) : v.getTime()
}

export function hasActivePremium(
  profile: PremiumProfile | null | undefined,
  now: number = Date.now(),
): boolean {
  if (!profile) return false

  // 1. Active Cycle Pass — today before a pass's immutable expiry.
  if (profile.cyclePasses?.some(p => { const ms = toMs(p.expiryDate); return Number.isFinite(ms) && ms > now })) {
    return true
  }

  // 2. Access-code / legacy tier premium.
  if (profile.tier === 'cycle') {
    if (profile.premiumUntil == null) return true
    const ms = toMs(profile.premiumUntil)
    if (!Number.isFinite(ms) || ms > now) return true
  }

  return false
}

/**
 * The furthest-future expiry among the profile's *active* Cycle Passes, or null
 * if none is currently active. Used to display "active through <date>".
 */
export function activeCyclePassExpiry(
  passes: { expiryDate: DateLike }[] | null | undefined,
  now: number = Date.now(),
): Date | null {
  let best: number | null = null
  for (const p of passes ?? []) {
    const ms = toMs(p.expiryDate)
    if (Number.isFinite(ms) && ms > now && (best == null || ms > best)) best = ms
  }
  return best == null ? null : new Date(best)
}

/**
 * The latest expiry across ALL passes (active or lapsed), or null if the profile
 * never bought one. Used to tell an "expired cycle pass" apart from a user who
 * was never Pro.
 */
export function latestCyclePassExpiry(
  passes: { expiryDate: DateLike }[] | null | undefined,
): Date | null {
  let best: number | null = null
  for (const p of passes ?? []) {
    const ms = toMs(p.expiryDate)
    if (Number.isFinite(ms) && (best == null || ms > best)) best = ms
  }
  return best == null ? null : new Date(best)
}
