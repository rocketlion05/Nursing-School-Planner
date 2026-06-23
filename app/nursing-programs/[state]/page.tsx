import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, ExternalLink, GraduationCap } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import JsonLd from '@/components/JsonLd'
import Disclaimer from '@/components/Disclaimer'
import { slugify } from '@/lib/slug'
import { SITE_URL } from '@/lib/seo'

// US state code -> full name. Used to map a pretty /nursing-programs/<state> slug
// to the two-letter code stored on each program.
const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
}

function slugToStateCode(slug: string): string | null {
  for (const [code, name] of Object.entries(STATE_NAMES)) {
    if (slugify(name) === slug) return code
  }
  return null
}

export async function generateStaticParams() {
  const rows = await prisma.program.findMany({ select: { state: true }, distinct: ['state'] })
  return rows
    .map(r => STATE_NAMES[r.state])
    .filter(Boolean)
    .map(name => ({ state: slugify(name!) }))
}

export async function generateMetadata(props: PageProps<'/nursing-programs/[state]'>): Promise<Metadata> {
  const { state } = await props.params
  const code = slugToStateCode(state)
  if (!code) return {}
  const name = STATE_NAMES[code]
  const title = `Nursing Programs in ${name} — BSN Schools & Requirements`
  const description = `Compare accredited BSN nursing programs in ${name}. See GPA requirements, TEAS/HESI entrance exams, prerequisites, and links to each school's official admissions page.`
  const url = `${SITE_URL}/nursing-programs/${state}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website' },
  }
}

export default async function StateHubPage(props: PageProps<'/nursing-programs/[state]'>) {
  const { state } = await props.params
  const code = slugToStateCode(state)
  if (!code) notFound()

  const programs = await prisma.program.findMany({
    where: { state: code },
    orderBy: [{ university: 'asc' }],
  })
  if (programs.length === 0) notFound()

  const name = STATE_NAMES[code]

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `BSN Nursing Programs in ${name}`,
    itemListElement: programs.map((p, i) => ({
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
      { '@type': 'ListItem', position: 2, name: 'Programs', item: `${SITE_URL}/programs` },
      { '@type': 'ListItem', position: 3, name: `${name} Nursing Programs`, item: `${SITE_URL}/nursing-programs/${state}` },
    ],
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <JsonLd data={itemListSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="flex items-center gap-2 mb-2">
        <GraduationCap className="w-6 h-6 text-teal-600" />
        <h1 className="text-3xl font-bold text-gray-900">Nursing Programs in {name}</h1>
      </div>
      <p className="text-gray-500 mb-8 max-w-2xl">
        {programs.length} accredited BSN nursing {programs.length === 1 ? 'program' : 'programs'} in {name}.
        Compare GPA requirements, entrance exams, and prerequisites, and link straight to each school&apos;s
        official admissions page. <Link href="/programs" className="text-teal-600 underline">See your personalized fit →</Link>
      </p>

      <div className="space-y-2">
        {programs.map(p => (
          <div
            key={p.id}
            className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-start justify-between gap-4 hover:border-teal-300 transition-colors"
          >
            <div className="min-w-0">
              <Link
                href={`/programs/${p.urlSlug ?? p.id}`}
                className="font-semibold text-gray-900 hover:text-teal-700"
              >
                {p.university}
              </Link>
              <p className="text-sm text-gray-500">{p.name} · {p.city}, {p.state}</p>
              <p className="text-xs text-gray-500 mt-1">
                {p.minOverallGPA != null ? `Min GPA ${p.minOverallGPA.toFixed(2)}` : 'GPA varies'}
                {' · '}
                {p.examType ? `${p.examType}${p.minExamScore != null ? ` ${p.minExamScore}%` : ''}` : 'No entrance exam'}
              </p>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-2">
              <Link
                href={`/programs/${p.urlSlug ?? p.id}`}
                className="text-xs text-teal-600 hover:text-teal-800 flex items-center gap-0.5"
              >
                Details <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              {p.officialUrl && (
                <a
                  href={p.officialUrl}
                  target="_blank"
                  rel="noopener nofollow"
                  className="text-xs text-gray-400 hover:text-teal-600 flex items-center gap-0.5"
                >
                  Official site <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Disclaimer compact />
      </div>
    </div>
  )
}
