import Link from 'next/link'
import { ArrowRight, BookOpen, BarChart2, Target } from 'lucide-react'
import Disclaimer from '@/components/Disclaimer'
import { getCurrentUser } from '@/app/lib/dal'

export default async function Home() {
  const user = await getCurrentUser()

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="inline-block text-sm text-teal-700 bg-teal-50 border border-teal-100 rounded-full px-4 py-1.5 mb-5">
          Created by a nursing student at the University of Arkansas to reduce application stress.
        </p>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Navigate Your Path to Nursing School
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Enter your stats, compare yourself against BSN program requirements in Arkansas and Texas,
          and get a clear plan to close your gaps.
        </p>

        {user ? (
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              See my nursing school odds
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Browse programs
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Create my free account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Browse programs
              </Link>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Free to start · browse without an account.{' '}
              <Link href="/login" className="text-teal-600 font-medium hover:underline">
                Already have an account? Log in
              </Link>
            </p>
          </>
        )}
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <BookOpen className="w-8 h-8 text-teal-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Enter Your Profile</h3>
          <p className="text-sm text-gray-600">
            GPA, science courses, TEAS/HESI scores, and more — saved to your account and never shared.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <BarChart2 className="w-8 h-8 text-teal-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">See Your Fit</h3>
          <p className="text-sm text-gray-600">
            Each program is labeled Safe, Match, Reach, or Not Eligible based on your current stats.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <Target className="w-8 h-8 text-teal-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Close Your Gaps</h3>
          <p className="text-sm text-gray-600">
            See exactly which prerequisites and exam scores you still need for each program.
          </p>
        </div>
      </div>

      <Disclaimer />
    </div>
  )
}
