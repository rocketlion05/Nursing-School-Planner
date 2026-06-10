import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { SITE_URL } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const programs = await prisma.program.findMany({
    select: { id: true },
  })

  const programEntries: MetadataRoute.Sitemap = programs.map((p) => ({
    url: `${SITE_URL}/programs/${p.id}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const now = new Date()

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/programs`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/study-tools`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/compare`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/signup`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/login`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    ...programEntries,
  ]
}
