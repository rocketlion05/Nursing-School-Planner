import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { SITE_URL } from '@/lib/seo'
import { slugify } from '@/lib/slug'
import { stateSlug } from '@/lib/states'
import { getAllGuides } from '@/lib/guides'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [programs, guides] = await Promise.all([
    prisma.program.findMany({ select: { id: true, urlSlug: true, state: true, city: true } }),
    getAllGuides(),
  ])

  const now = new Date()

  const programEntries: MetadataRoute.Sitemap = programs.map((p) => ({
    url: `${SITE_URL}/programs/${p.urlSlug ?? p.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // One hub page per state that has programs.
  const stateSlugs = Array.from(new Set(programs.map(p => stateSlug(p.state)).filter(Boolean))) as string[]
  const stateEntries: MetadataRoute.Sitemap = stateSlugs.map((s) => ({
    url: `${SITE_URL}/nursing-programs/${s}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // One hub page per (state, city) that has programs.
  const citySlugs = Array.from(
    new Set(
      programs
        .map(p => { const s = stateSlug(p.state); return s && p.city ? `${s}/${slugify(p.city)}` : null })
        .filter(Boolean) as string[],
    ),
  )
  const cityEntries: MetadataRoute.Sitemap = citySlugs.map((sc) => ({
    url: `${SITE_URL}/nursing-programs/${sc}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const guideEntries: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${SITE_URL}/guides/${g.slug}`,
    lastModified: g.date ? new Date(g.date) : undefined,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/programs`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/chance-calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/free-checklist`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/study-tools`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/compare`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/signup`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/login`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    ...stateEntries,
    ...cityEntries,
    ...guideEntries,
    ...programEntries,
  ]
}
