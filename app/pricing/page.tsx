import type { Metadata } from 'next'
import { getProfile } from '@/app/actions/profile'

export const metadata: Metadata = {
  title: 'Pricing: Free & Premium Plans',
  description:
    'Start free and upgrade with the one-time Cycle Pass ($29) for the AI academic advisor, unlimited favorites, gap-analysis PDF, and more. No subscription.',
  alternates: { canonical: 'https://www.nursingschoolplanner.com/pricing' },
  openGraph: {
    title: 'Pricing: Nursing School Planner',
    description:
      'Free plan available. Unlock Pro for your application cycle with the one-time $29 Cycle Pass.',
    url: 'https://www.nursingschoolplanner.com/pricing',
    type: 'website',
  },
}
import { getCurrentUser } from '@/app/lib/dal'
import AccessCodeForm from '@/components/AccessCodeForm'
import CyclePassCard from '@/components/CyclePassCard'
import { computeCyclePassExpiry } from '@/lib/cycle-pass'
import { PLANS } from '@/lib/stripe'
import { Check, Zap, AlertCircle } from 'lucide-react'

const FREE_FEATURES = [
  'View fit scores for all programs (Safe/Match/Reach)',
  'See gap analysis and missing prerequisites',
  'Basic planning recommendations',
  'Up to 2 saved favorites',
]

// Both paid plans unlock the same Pro features — only the billing cadence differs.
const PREMIUM_FEATURES = [
  'Everything in Free',
  'Unlimited saved favorites',
  'AI academic advisor: ask anything, get your plan & best-fit schools',
  'Gap analysis PDF report (profile, fit scores, missing prereqs)',
  'TEAS/HESI score breakdown + unlock insights',
  'What-if GPA & score simulator',
  'Deadline tracker, custom lists & school comparison',
  'Request a school to be added',
]

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string; nobilling?: string }>
}) {
  const { canceled, nobilling } = await searchParams
  const [profile, user] = await Promise.all([getProfile(), getCurrentUser()])
  const tier = profile?.tier ?? 'free'
  const isPro = tier === 'cycle'
  // Pre-purchase window preview: a flat 180 days from today.
  const previewExpiry = !isPro ? computeCyclePassExpiry(new Date()).toISOString() : null

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Simple, Student-Friendly Pricing</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Start free, then unlock Pro with the one-time Cycle Pass: full Pro access for 180 days,
          plenty of time for your application cycle. No subscription, no auto-renew. Have a promo
          code? Redeem it below for a free month.
        </p>
      </div>

      {canceled && (
        <div className="max-w-md mx-auto mb-6 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-center">
          Payment was canceled. No charge was made, and you can try again anytime.
        </div>
      )}
      {nobilling && (
        <div className="max-w-md mx-auto mb-6 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-center">
          We couldn&apos;t find a billing account for you. If you unlocked Pro with an access
          code, there&apos;s no subscription to manage.
        </div>
      )}

      {isPro && (
        <div className="max-w-md mx-auto mb-8 text-center">
          <div className="text-sm text-teal-700 font-semibold bg-teal-100 rounded-lg py-2 px-4 flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" /> Pro is active on your account
            {(profile?.cyclePassExpiry ?? profile?.premiumUntil) && (
              <span className="font-normal text-teal-600">
                · {profile?.cyclePassExpiry ? 'through' : 'until'}{' '}
                {new Date((profile?.cyclePassExpiry ?? profile?.premiumUntil)!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Expired Cycle Pass — repurchase prompt. */}
      {profile?.cyclePassExpired && (
        <div className="max-w-md mx-auto mb-8 text-center">
          <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg py-2.5 px-4 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Your cycle pass has expired. Repurchase below for your next cycle.
          </div>
        </div>
      )}

      {/* Plans — Free + the one-time Cycle Pass */}
      <div className="grid sm:grid-cols-2 gap-6 mb-10 max-w-3xl mx-auto items-stretch">
        {/* Free */}
        <div className="relative rounded-2xl border-2 border-gray-200 bg-white p-6 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900">Free</h2>
          <div className="text-3xl font-bold mt-1 text-gray-900">
            $0 <span className="text-base font-normal text-gray-400">always</span>
          </div>
          <p className="text-sm text-gray-500 mt-2 mb-4">
            No credit card needed. Everything you need to start planning.
          </p>

          <ul className="space-y-2 mb-6 flex-1">
            {FREE_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>

          {isPro ? (
            <div className="text-sm text-center text-gray-500 font-medium bg-gray-50 rounded-lg py-2.5">
              Free plan
            </div>
          ) : (
            <div className="text-sm text-center text-teal-700 font-semibold bg-teal-50 rounded-lg py-2.5">
              Your current plan
            </div>
          )}
        </div>

        {/* Cycle Pass — hero one-time offer with a cycle selector */}
        <CyclePassCard
          isAuthed={Boolean(user)}
          isPro={isPro}
          features={PREMIUM_FEATURES}
          description={PLANS.cycle.description}
          previewExpiry={previewExpiry}
        />

      </div>

      {/* Access Code */}
      {!isPro && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md mx-auto">
          <h3 className="font-semibold text-gray-900 mb-1">Have an Access Code?</h3>
          <p className="text-sm text-gray-500 mb-4">
            Enter your beta or promotional code to unlock <strong>1 month of Pro free</strong>.
          </p>
          {profile ? (
            <AccessCodeForm />
          ) : (
            <p className="text-sm text-amber-700">
              <a href="/profile" className="underline">Save your profile first</a> to redeem an access code.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
