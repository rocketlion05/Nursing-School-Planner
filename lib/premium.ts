/**
 * Single source of truth for whether a profile currently has paid ("Pro") access.
 *
 * Premium is represented by tier === 'cycle' (a legacy internal value kept to
 * avoid a DB-wide rename). Access can be time-boxed via `premiumUntil`:
 *   - null      → no expiry (active subscription or admin)
 *   - a date    → access lapses to free once that date passes (1-month codes)
 */
export function hasActivePremium(
  profile: { tier: string; premiumUntil?: Date | string | null } | null | undefined,
): boolean {
  if (!profile || profile.tier !== 'cycle') return false
  if (profile.premiumUntil != null) {
    const expiresAt =
      typeof profile.premiumUntil === 'string'
        ? Date.parse(profile.premiumUntil)
        : profile.premiumUntil.getTime()
    if (Number.isFinite(expiresAt) && expiresAt < Date.now()) return false
  }
  return true
}
