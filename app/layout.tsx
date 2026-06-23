import type { Metadata } from 'next'
import Link from 'next/link'
import { Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import Navbar from '@/components/Navbar'
import JsonLd from '@/components/JsonLd'
import { getCurrentUser, getIsAdmin } from '@/app/lib/dal'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_KEYWORDS } from '@/lib/seo'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { email: false, telephone: false },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.jpg`,
  description: SITE_DESCRIPTION,
  sameAs: [],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/programs?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, isAdmin] = await Promise.all([getCurrentUser(), getIsAdmin()])

  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <Navbar username={user?.username ?? null} isAdmin={isAdmin} />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-400">
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mb-3" aria-label="Footer">
            <Link href="/programs" className="text-gray-500 hover:text-teal-600 hover:underline">All Programs</Link>
            <Link href="/nursing-programs/arkansas" className="text-gray-500 hover:text-teal-600 hover:underline">Arkansas Nursing Programs</Link>
            <Link href="/nursing-programs/texas" className="text-gray-500 hover:text-teal-600 hover:underline">Texas Nursing Programs</Link>
            <Link href="/guides" className="text-gray-500 hover:text-teal-600 hover:underline">Guides</Link>
            <Link href="/contact" className="text-gray-500 hover:text-teal-600 hover:underline">Contact Us</Link>
            <Link href="/privacy-policy" className="text-gray-500 hover:text-teal-600 hover:underline">Privacy Policy</Link>
          </nav>
          <p>Nursing School Planner &mdash; for planning only, not official admissions advice.</p>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
