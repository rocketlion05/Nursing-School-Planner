import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, ChevronRight } from 'lucide-react'
import { getAllGuides } from '@/lib/guides'
import { SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Nursing School Guides & Admissions Advice',
  description:
    'Free guides to getting into nursing school — BSN admissions, TEAS and HESI A2 exam prep, GPA and prerequisite planning, and state-by-state requirements for Arkansas and Texas.',
  alternates: { canonical: `${SITE_URL}/guides` },
  openGraph: {
    title: 'Nursing School Guides & Admissions Advice',
    description:
      'Free guides to getting into nursing school — BSN admissions, TEAS and HESI A2 prep, GPA planning, and state requirements.',
    url: `${SITE_URL}/guides`,
    type: 'website',
  },
}

export default async function GuidesIndexPage() {
  const guides = await getAllGuides()

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-6 h-6 text-teal-600" />
        <h1 className="text-3xl font-bold text-gray-900">Nursing School Guides</h1>
      </div>
      <p className="text-gray-500 mb-6">
        Practical, no-nonsense advice on getting into a BSN program — admissions, entrance exams,
        GPA and prerequisites, and what each state expects.
      </p>

      <Link
        href="/free-checklist"
        className="flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-xl p-4 mb-8 hover:bg-teal-100 transition-colors"
      >
        <span className="text-2xl">📋</span>
        <span className="text-sm text-teal-900">
          <strong>Free download:</strong> the BSN Prerequisite &amp; Application Checklist — everything you
          need to apply, in one printable PDF. <span className="underline">Get it →</span>
        </span>
      </Link>

      {guides.length === 0 ? (
        <p className="text-gray-400">Guides are coming soon.</p>
      ) : (
        <div className="space-y-3">
          {guides.map(g => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-teal-300 transition-colors group"
            >
              <h2 className="font-semibold text-gray-900 group-hover:text-teal-700 flex items-center gap-1">
                {g.title}
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-teal-500" />
              </h2>
              {g.description && <p className="text-sm text-gray-500 mt-1">{g.description}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
