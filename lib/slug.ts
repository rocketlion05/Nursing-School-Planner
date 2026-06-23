// Shared slug helpers for SEO-friendly URLs.

/** Lowercase, hyphenate, strip non-alphanumerics. "UT Health San Antonio" -> "ut-health-san-antonio". */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

type NamedRow = { slug: string; university: string; city: string; state: string }

/**
 * Compute collision-safe `urlSlug` values for a list of programs.
 * Base is the university name; if two schools share a base we append the city,
 * then the state, then a numeric suffix as a last resort. Deterministic given
 * the same input order, so re-seeding is stable. Returns a map of slug -> urlSlug.
 */
export function computeUrlSlugs<T extends NamedRow>(rows: T[]): Map<string, string> {
  const baseCounts = new Map<string, number>()
  for (const r of rows) {
    const b = slugify(r.university)
    baseCounts.set(b, (baseCounts.get(b) ?? 0) + 1)
  }

  const seen = new Set<string>()
  const map = new Map<string, string>()
  for (const r of rows) {
    const base = slugify(r.university)
    let candidate = baseCounts.get(base)! > 1 ? `${base}-${slugify(r.city)}` : base
    if (seen.has(candidate)) candidate = `${candidate}-${slugify(r.state)}`
    let unique = candidate
    let n = 2
    while (seen.has(unique)) unique = `${candidate}-${n++}`
    seen.add(unique)
    map.set(r.slug, unique)
  }
  return map
}
