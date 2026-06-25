import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Accredited BSN Nursing Programs Nationwide',
  description:
    'Search and filter 100+ accredited BSN nursing programs across the U.S. Compare GPA requirements, entrance exams, and prerequisites side by side.',
  alternates: { canonical: 'https://www.nursingschoolplanner.com/programs' },
  openGraph: {
    title: 'Browse Accredited BSN Nursing Programs Nationwide',
    description:
      'Search and filter 100+ accredited BSN nursing programs across the U.S. Compare GPA requirements, entrance exams, and prerequisites side by side.',
    url: 'https://www.nursingschoolplanner.com/programs',
    type: 'website',
  },
}
import { getProfile } from '@/app/actions/profile'
import { getLists } from '@/app/actions/lists'
import { getCurrentUser } from '@/app/lib/dal'
import { scorePrograms } from '@/lib/gap'
import { getAllPrograms } from '@/lib/programs'
import ProgramList from '@/components/ProgramList'
import RequestSchoolButton from '@/components/RequestSchoolButton'
import Disclaimer from '@/components/Disclaimer'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default async function ProgramsPage() {
  const [profile, user] = await Promise.all([getProfile(), getCurrentUser()])
  const isPremium = profile?.tier === 'cycle'

  const [programs, lists] = await Promise.all([
    getAllPrograms(),
    user ? getLists() : Promise.resolve([]),
  ])

  // The heart reflects membership in the default "Saved" list.
  const defaultList = lists.find(l => l.isDefault)
  const favoriteIds = new Set(defaultList?.programIds ?? [])
  const scored = scorePrograms(profile, programs, favoriteIds)

  // Self-updating coverage line — counts distinct states so it stays accurate as
  // more states are added (no hardcoded "Arkansas, Texas, …").
  const stateCount = new Set(programs.map(p => p.state)).size

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">BSN Programs</h1>
          <p className="text-gray-500 mt-1">
            {scored.length} accredited BSN programs across {stateCount} states
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2">
          <RequestSchoolButton isPremium={isPremium} />
          {!user ? (
            <div className="flex flex-wrap items-center gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Log in to save programs and see your personalized fit.</span>
              <span className="flex items-center gap-2">
                <Link href="/login" className="underline font-medium">Log in</Link>
                <Link
                  href="/signup"
                  className="bg-teal-600 text-white px-2.5 py-1 rounded-md font-medium hover:bg-teal-700 transition-colors no-underline"
                >
                  Sign up
                </Link>
              </span>
            </div>
          ) : !profile ? (
            <div className="flex items-center gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                <Link href="/profile" className="underline font-medium">Complete your profile</Link> to see fit scores.
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <ProgramList
        programs={scored}
        tier={profile?.tier ?? 'free'}
        isAuthed={Boolean(user)}
        isPremium={isPremium}
        lists={lists}
      />

      <div className="mt-8">
        <Disclaimer compact />
      </div>
    </div>
  )
}
