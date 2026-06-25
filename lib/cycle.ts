// Application-cycle helpers for the one-time Cycle Pass. Pure + dependency-free so
// both the client (pricing selector) and the server (checkout action + webhook)
// share the exact same date logic. Never call new Date() at module scope.

export type CycleTerm = 'Fall' | 'Spring'

/**
 * When a Cycle Pass for a given cycle stops granting Pro — the END of that
 * application round. The pass window runs from purchase (when the student starts
 * applying) through the close of the round: the application + decision/waitlist
 * season resolves right as the target term begins. Fall round → Sept 1; Spring
 * round → Feb 1 (UTC, to avoid timezone drift).
 */
export function cycleEndDate(term: CycleTerm, year: number): Date {
  return term === 'Fall'
    ? new Date(Date.UTC(year, 8, 1)) // Sept 1
    : new Date(Date.UTC(year, 1, 1)) // Feb 1
}

export function cycleLabel(term: CycleTerm, year: number): string {
  return `${term} ${year}`
}

export function isCycleTerm(v: unknown): v is CycleTerm {
  return v === 'Fall' || v === 'Spring'
}

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

export type CycleOption = { term: CycleTerm; year: number; label: string }

/**
 * The upcoming application cycles a student can still buy a pass for (cycle end is
 * in the future), soonest first. Caller passes the current time.
 */
export function availableCycles(now: Date): CycleOption[] {
  const startYear = now.getUTCFullYear()
  const out: (CycleOption & { ms: number })[] = []
  for (let y = startYear; y <= startYear + 2; y++) {
    for (const term of ['Spring', 'Fall'] as const) {
      const ms = cycleEndDate(term, y).getTime()
      if (ms > now.getTime()) out.push({ term, year: y, label: cycleLabel(term, y), ms })
    }
  }
  out.sort((a, b) => a.ms - b.ms)
  return out.slice(0, 6).map(({ term, year, label }) => ({ term, year, label }))
}
