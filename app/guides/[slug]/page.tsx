import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Markdown from '@/components/Markdown'
import JsonLd from '@/components/JsonLd'
import Disclaimer from '@/components/Disclaimer'
import { getAllGuides, getGuide } from '@/lib/guides'
import { SITE_URL, SITE_NAME } from '@/lib/seo'

export async function generateStaticParams() {
  const guides = await getAllGuides()
  return guides.map(g => ({ slug: g.slug }))
}

export async function generateMetadata(props: PageProps<'/guides/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params
  const guide = await getGuide(slug)
  if (!guide) return {}
  const url = `${SITE_URL}/guides/${guide.slug}`
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: url },
    openGraph: { title: guide.title, description: guide.description, url, type: 'article' },
  }
}

export default async function GuidePage(props: PageProps<'/guides/[slug]'>) {
  const { slug } = await props.params
  const guide = await getGuide(slug)
  if (!guide) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.date || undefined,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/guides/${guide.slug}`,
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides` },
      { '@type': 'ListItem', position: 3, name: guide.title, item: `${SITE_URL}/guides/${guide.slug}` },
    ],
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Link href="/guides" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6">
        <ChevronLeft className="w-4 h-4" /> All guides
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">{guide.title}</h1>
      <Markdown body={guide.body} />

      <div className="mt-10">
        <Disclaimer compact />
      </div>
    </article>
  )
}
