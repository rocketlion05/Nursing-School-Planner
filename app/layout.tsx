import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import Navbar from '@/components/Navbar'
import { getCurrentUser, getIsAdmin } from '@/app/lib/dal'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'Nursing School Planner',
  description: 'Compare your stats to BSN program requirements across Arkansas and Texas.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, isAdmin] = await Promise.all([getCurrentUser(), getIsAdmin()])

  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <Navbar username={user?.username ?? null} isAdmin={isAdmin} />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
          Nursing School Planner &mdash; for planning only, not official admissions advice.
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
