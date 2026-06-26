// Application-term helpers for the profile's "Target start term" selector. Pure +
// dependency-free; the caller passes the current time so past terms drop off
// automatically. Never call new Date() at module scope.
//
// (The one-time Cycle Pass no longer uses a term/year selector — its window is a
// fixed expiry of purchase + 180 days; see lib/cycle-pass.ts.)

// The three start terms a nursing applicant can target, with the (approximate)
// month each one begins. Used to generate the profile's "Target start term"
// options live, so the list never contains a term that has already started.
const TARGET_TERM_START_MONTH: Record<string, number> = {
  Spring: 0, // January
  Summer: 4, // May
  Fall: 7, // August
}

/**
 * The upcoming "target start term" options for the profile dropdown, soonest
 * first — every Spring/Summer/Fall whose start is still in the future. Computed
 * from the current time so past terms drop off automatically (no maintenance
 * needed). Caller passes the current time; never call new Date() at module scope.
 */
export function availableTargetTerms(now: Date, count = 8): string[] {
  const y0 = now.getUTCFullYear()
  const out: { label: string; ms: number }[] = []
  for (let y = y0; y <= y0 + 3; y++) {
    for (const term of ['Spring', 'Summer', 'Fall'] as const) {
      const ms = Date.UTC(y, TARGET_TERM_START_MONTH[term], 1)
      if (ms > now.getTime()) out.push({ label: `${term} ${y}`, ms })
    }
  }
  out.sort((a, b) => a.ms - b.ms)
  return out.slice(0, count).map(o => o.label)
}
