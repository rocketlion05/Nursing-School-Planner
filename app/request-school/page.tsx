import type { Metadata } from 'next'
import Link from 'next/link'
import { requireUser } from '@/app/lib/dal'
import { getProfile } from '@/app/actions/profile'
import RequestSchoolForm from '@/components/RequestSchoolForm'
import { Sparkles, Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Request a School',
  robots: { index: false, follow: false },
}

export default async function RequestSchoolPage() {
  await requireUser()
  const profile = await getProfile()
  const isPremium = profile?.tier === 'cycle'

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Request a school</h1>
        <p className="text-gray-500 mt-1">
          Don&apos;t see a nursing program you&apos;re interested in? Tell us and we&apos;ll add it.
        </p>
      </div>

      {isPremium ? (
        <RequestSchoolForm />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-amber-600" />
          </div>
          <h2 className="font-semibold text-gray-900 mb-1">This is a Pro feature</h2>
          <p className="text-sm text-gray-500 mb-5 max-w-sm mx-auto">
            Requesting new schools is included with Pro. Upgrade to submit program
            requests and unlock unlimited favorites.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Upgrade to Pro
          </Link>
        </div>
      )}
    </div>
  )
}
