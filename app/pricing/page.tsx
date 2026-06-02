import { getProfile } from '@/app/actions/profile'
import AccessCodeForm from '@/components/AccessCodeForm'
import { Check, Lock, Zap } from 'lucide-react'

const FREE_FEATURES = [
  'View fit scores for all programs (Safe/Match/Reach)',
  'See gap analysis and missing prerequisites',
  'Basic planning recommendations',
  'Up to 2 saved favorites',
]

const CYCLE_FEATURES = [
  'Everything in Free',
  'Unlimited favorites',
  'Full gap analysis across all programs',
  'AI-guided strategy (coming soon)',
  'Priority email support (coming soon)',
]

export default async function PricingPage() {
  const profile = await getProfile()
  const tier = profile?.tier ?? 'free'
  const hasCycle = tier === 'cycle'

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Simple, Student-Friendly Pricing</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Start free. Upgrade when you need more. No subscriptions — just a one-time Cycle Pass for the application season.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        {/* Free tier */}
        <div className={`bg-white rounded-2xl border-2 p-6 ${!hasCycle ? 'border-teal-400' : 'border-gray-200'}`}>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Free</h2>
            <div className="text-3xl font-bold mt-1 text-gray-900">$0</div>
            <p className="text-sm text-gray-500 mt-1">Always free. No credit card needed.</p>
          </div>
          <ul className="space-y-2 mb-6">
            {FREE_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          {!hasCycle && (
            <div className="text-sm text-center text-teal-700 font-semibold bg-teal-50 rounded-lg py-2">
              Your current plan
            </div>
          )}
        </div>

        {/* Cycle Pass */}
        <div className={`rounded-2xl border-2 p-6 ${hasCycle ? 'bg-teal-50 border-teal-400' : 'bg-white border-gray-200'}`}>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">Cycle Pass</h2>
              <span className="text-xs bg-teal-600 text-white px-2 py-0.5 rounded-full font-medium">Best Value</span>
            </div>
            <div className="text-3xl font-bold mt-1 text-gray-900">
              $19 <span className="text-base font-normal text-gray-400">/ application cycle</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">One-time payment. Covers your full application season.</p>
          </div>
          <ul className="space-y-2 mb-6">
            {CYCLE_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                <Check className={`w-4 h-4 shrink-0 mt-0.5 ${f.includes('coming soon') ? 'text-gray-300' : 'text-teal-500'}`} />
                <span className={f.includes('coming soon') ? 'text-gray-400' : ''}>{f}</span>
              </li>
            ))}
          </ul>
          {hasCycle ? (
            <div className="text-sm text-center text-teal-700 font-semibold bg-teal-100 rounded-lg py-2 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Active — Cycle Pass
            </div>
          ) : (
            <button
              disabled
              className="w-full bg-gray-200 text-gray-500 py-2.5 rounded-lg font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Pay Now — Coming Soon
            </button>
          )}
        </div>
      </div>

      {/* Access Code */}
      {!hasCycle && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md mx-auto">
          <h3 className="font-semibold text-gray-900 mb-1">Have an Access Code?</h3>
          <p className="text-sm text-gray-500 mb-4">
            Enter your beta or promotional code below to unlock Cycle Pass features.
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
