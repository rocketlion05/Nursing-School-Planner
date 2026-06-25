/**
 * Pure formatter for a program's "last verified" date — no data imports, so it's
 * safe to use from client components. Formatted in UTC so server-rendered and
 * client-hydrated output always match (avoids a timezone-shifted hydration diff).
 */
export function formatVerified(iso: string | null | undefined, long = false): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: long ? 'long' : 'short',
    day: 'numeric',
  })
}
