// Best-effort parser that turns a school's free-text application-deadline string
// (e.g. "October 1 for Spring; June 7 for Fall" or "Jan 15 (Fall) / July 15 for
// Spring, via NursingCAS") into a single recurring month/day — the FURTHEST
// (latest calendar) date mentioned, since that's the last point a student might
// still be applying. Pure + dependency-free; run once at seed/populate time to
// fill Program.appDeadlineMonth / appDeadlineDay.

export type MonthDay = { month: number; day: number } // month 1-12, day 1-31

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
}

// Matches "March 1", "Mar. 1", "Sept 15", "December 1-15" (captures the first day).
const DATE_RE =
  /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?\s+(\d{1,2})\b/gi

/**
 * Returns the latest (month, day) found in the free text, or null if none.
 * "Latest" compares by month then day, ignoring year (deadlines recur annually).
 */
export function parseFurthestDeadline(text: string | null | undefined): MonthDay | null {
  if (!text) return null
  let best: MonthDay | null = null
  for (const m of text.matchAll(DATE_RE)) {
    const month = MONTHS[m[1].slice(0, 3).toLowerCase()]
    const day = Number(m[2])
    if (!month || day < 1 || day > 31) continue
    if (!best || month > best.month || (month === best.month && day > best.day)) {
      best = { month, day }
    }
  }
  return best
}
