// Application-cycle helpers for the one-time Cycle Pass. Pure + dependency-free so
// both the client (pricing selector) and the server (checkout action + webhook)
// share the exact same date logic. Never call new Date() at module scope.

export type CycleTerm = 'Fall' | 'Spring'

/**
 * When a Cycle Pass for a given cycle stops granting Pro — roughly the start of
 * that academic term, which covers the full application + decision season leading
 * up to it. Fall → Sept 1; Spring → Feb 1 (UTC, to avoid timezone drift).
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
