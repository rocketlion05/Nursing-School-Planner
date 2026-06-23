import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import LeadMagnetForm from '@/components/LeadMagnetForm'
import { SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Free BSN Prerequisite & Application Checklist',
  description:
    'Download a free printable checklist of nursing school prerequisites, GPA targets, entrance-exam steps, and application deadlines to keep your BSN application on track.',
  alternates: { canonical: `${SITE_URL}/free-checklist` },
  openGraph: {
    title: 'Free BSN Prerequisite & Application Checklist',
    description: 'A printable checklist of prerequisites, GPA targets, entrance exams, and deadlines for nursing school applicants.',
    url: `${SITE_URL}/free-checklist`,
    type: 'website',
  },
}

const INCLUDES = [
  'Every common BSN prerequisite course, in one checklist',
  'GPA targets that actually get applicants admitted',
  'TEAS / HESI A2 entrance-exam game plan',
  'Application materials & document checklist',
  'A deadline timeline so you never miss a cycle',
]

export default function FreeChecklistPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <span className="inline-block text-xs font-semibold uppercase tracking-wide text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-3 py-1 mb-3">
          Free download
        </span>
        <h1 className="text-3xl font-bold text-gray-900">The BSN Prerequisite &amp; Application Checklist</h1>
        <p className="text-gray-600 mt-3">
          A free, printable checklist that walks you through everything you need to apply to nursing
          school — prerequisites, GPA, entrance exams, documents, and deadlines.
        </p>
      </div>

      <ul className="space-y-2 mb-8">
        {INCLUDES.map(item => (
          <li key={item} className="flex items-start gap-2 text-gray-700">
            <CheckCircle className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <LeadMagnetForm source="free-checklist" />

      <p className="text-center text-sm text-gray-500 mt-6">
        Already know your stats?{' '}
        <Link href="/chance-calculator" className="text-teal-600 underline">See your nursing school chances →</Link>
      </p>
    </div>
  )
}
