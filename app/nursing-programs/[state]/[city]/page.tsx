import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, ExternalLink, MapPin } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import JsonLd from '@/components/JsonLd'
import Disclaimer from '@/components/Disclaimer'
import { slugify } from '@/lib/slug'
import { STATE_NAMES, slugToStateCode } from '@/lib/states'
import { SITE_URL } from '@/lib/seo'

// Rendered dynamically on demand (there are many city/state combinations, so
// pre-rendering them all at build hammers the remote DB). Still fully crawlable
// and listed in the sitemap.
export const dynamic = 'force-dynamic'

async function resolve(stateParam: string, cityParam: string) {
  const code = slugToStateCode(stateParam)
  if (!code) return null
  const programs = await prisma.program.findMany({
    where: { state: code },
    orderBy: [{ university: 'asc' }],
  })
  const inCity = programs.filter(p => slugify(p.city) === cityParam)
  if (inCity.length === 0) return null
  return { code, cityName: inCity[0].city, programs: inCity }
}

export async function generateMetadata(props: PageProps<'/nursing-programs/[state]/[city]'>): Promise<Metadata> {
  const { state, city } = await props.params
  const r = await resolve(state, city)
  if (!r) return {}
  const name = STATE_NAMES[r.code]
  const title = `Nursing Programs in ${r.cityName}, ${r.code} — BSN Schools & Requirements`
  const description = `BSN nursing programs in ${r.cityName}, ${name}. Compare GPA requirements, entrance exams, prerequisites, and official admissions links for each school.`
  const url = `${SITE_URL}/nursing-programs/${state}/${city}`
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, type: 'website' } }
}

export default async function CityHubPage(props: PageProps<'/nursing-programs/[state]/[city]'>) {
  const { state, city } = await props.params
  const r = await resolve(state, city)
  if (!r) notFound()
  const name = STATE_NAMES[r.code]

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `BSN Nursing Programs in ${r.cityName}, ${name}`,
    itemListElement: r.programs.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.university,
      url: `${SITE_URL}/programs/${p.urlSlug ?? p.id}`,
    })),
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: `${name} Nursing Programs`, item: `${SITE_URL}/nursing-programs/${state}` },
      { '@type': 'ListItem', position: 3, name: r.cityName, item: `${SITE_URL}/nursing-programs/${state}/${city}` },
    ],
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <JsonLd data={itemListSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-2">
        <Link href={`/nursing-programs/${state}`} className="hover:text-teal-600">{name}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {r.cityName}</span>
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Nursing Programs in {r.cityName}, {r.code}</h1>
      <p className="text-gray-500 mt-3 mb-8 max-w-2xl">
        {r.programs.length} accredited BSN nursing {r.programs.length === 1 ? 'program' : 'programs'} in {r.cityName}, {name}.
        Compare GPA requirements, entrance exams, and prerequisites, and link straight to each school&apos;s official
        admissions page. <Link href="/programs" className="text-teal-600 underline">See your personalized fit →</Link>
      </p>

      <div className="space-y-2">
        {r.programs.map(p => (
          <div key={p.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-start justify-between gap-4 hover:border-teal-300 transition-colors">
            <div className="min-w-0">
              <Link href={`/programs/${p.urlSlug ?? p.id}`} className="font-semibold text-gray-900 hover:text-teal-700">
                {p.university}
              </Link>
              <p className="text-sm text-gray-500">{p.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {p.minOverallGPA != null ? `Min GPA ${p.minOverallGPA.toFixed(2)}` : 'GPA varies'}
                {' · '}
                {p.examType ? `${p.examType}${p.minExamScore != null ? ` ${p.minExamScore}%` : ''}` : 'No entrance exam'}
              </p>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-2">
              <Link href={`/programs/${p.urlSlug ?? p.id}`} className="text-xs text-teal-600 hover:text-teal-800 flex items-center gap-0.5">
                Details <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              {p.officialUrl && (
                <a href={p.officialUrl} target="_blank" rel="noopener nofollow" className="text-xs text-gray-400 hover:text-teal-600 flex items-center gap-0.5">
                  Official site <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link href={`/nursing-programs/${state}`} className="text-sm text-teal-600 hover:underline">
          ← All {name} nursing programs
        </Link>
      </div>
      <div className="mt-8"><Disclaimer compact /></div>
    </div>
  )
}
