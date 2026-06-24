import type { Metadata } from 'next'
import { getAllPrograms } from '@/lib/programs'
import ChanceCalculator from '@/components/ChanceCalculator'
import JsonLd from '@/components/JsonLd'
import Disclaimer from '@/components/Disclaimer'
import { SITE_URL } from '@/lib/seo'

const BASE_TITLE = 'Nursing School Chances Calculator — Will I Get In?'
const BASE_DESC =
  'Free calculator: enter your GPA and TEAS/HESI score to instantly see how many BSN nursing programs you’re a Safe, Match, or Reach for. No signup required.'

export async function generateMetadata(props: PageProps<'/chance-calculator'>): Promise<Metadata> {
  const sp = await props.searchParams
  const get = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) as string | undefined
  const has = ['safe', 'match', 'reach', 'steps'].some(k => get(k) != null)

  // When a result link is shared, unfurl with a personalized result card.
  if (has) {
    const q = new URLSearchParams()
    for (const k of ['safe', 'match', 'reach', 'steps', 'state']) { const v = get(k); if (v != null) q.set(k, v) }
    const safe = Number(get('safe') ?? 0), match = Number(get('match') ?? 0)
    const competitive = safe + match
    const title = competitive > 0
      ? `I'm a Safe or Match for ${competitive} BSN program${competitive === 1 ? '' : 's'}!`
      : 'My nursing school chances'
    const imageUrl = `${SITE_URL}/chance-calculator/result-image?${q.toString()}`
    return {
      title,
      description: BASE_DESC,
      alternates: { canonical: `${SITE_URL}/chance-calculator` },
      openGraph: { title, description: BASE_DESC, url: `${SITE_URL}/chance-calculator`, type: 'website', images: [{ url: imageUrl, width: 1200, height: 630 }] },
      twitter: { card: 'summary_large_image', title, description: BASE_DESC, images: [imageUrl] },
    }
  }

  return {
    title: BASE_TITLE,
    description: BASE_DESC,
    alternates: { canonical: `${SITE_URL}/chance-calculator` },
    openGraph: {
      title: BASE_TITLE,
      description: 'Enter your GPA and entrance-exam score to instantly see your odds across real BSN nursing programs. Free, no signup.',
      url: `${SITE_URL}/chance-calculator`,
      type: 'website',
    },
  }
}

export default async function ChanceCalculatorPage() {
  const programs = await getAllPrograms()

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What GPA do I need to get into nursing school?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most BSN programs require a minimum GPA of 2.5–3.0, but admitted students are usually well above the minimum. This calculator compares your GPA and entrance-exam score against real program requirements to estimate your odds.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is this nursing school chances calculator free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The calculator is completely free and requires no signup. It scores your fit against accredited BSN programs using their published GPA, entrance-exam, and prerequisite requirements.',
        },
      },
    ],
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <JsonLd data={faqSchema} />
      <h1 className="text-3xl font-bold text-gray-900">Nursing School Chances Calculator</h1>
      <p className="text-gray-600 mt-3 mb-8 max-w-2xl">
        Enter your GPA and entrance-exam score to instantly see how many accredited BSN nursing
        programs you&apos;re a <strong>Safe</strong>, <strong>Match</strong>, or <strong>Reach</strong> for —
        scored against each school&apos;s real requirements. Free, no signup.
      </p>

      <ChanceCalculator programs={programs} />

      <div className="mt-10">
        <Disclaimer compact />
      </div>
    </div>
  )
}
