import { getProfile } from '@/app/actions/profile'
import { getCurrentUser, getIsAdmin } from '@/app/lib/dal'
import { listAccessCodes } from '@/app/actions/access-code'
import AccessCodeForm from '@/components/AccessCodeForm'
import AdminCodeGenerator from '@/components/AdminCodeGenerator'
import CheckoutButton from '@/components/CheckoutButton'
import ManageBillingButton from '@/components/ManageBillingButton'
import { PLANS, type PlanId } from '@/lib/stripe'
import { Check, Zap } from 'lucide-react'

const FREE_FEATURES = [
  'View fit scores for all programs (Safe/Match/Reach)',
  'See gap analysis and missing prerequisites',
  'Basic planning recommendations',
  'Up to 2 saved favorites',
]

// All paid plans unlock the same premium features — only the billing cadence differs.
const PREMIUM_FEATURES = [
  'Everything in Free',
  'Unlimited saved favorites',
  'Full gap analysis across all programs',
  'AI-powered application plan (semester-by-semester) + PDF export',
  'Request a school to be added',
]

type PaidCard = {
  id: PlanId
  title: string
  cadence: string
  badge?: string
  highlight?: boolean
}

// Order shown left→right. Yearly highlighted as the best value for multi-year planners.
const PAID_CARDS: PaidCard[] = [
  { id: 'monthly', title: 'Monthly', cadence: '/ month' },
  { id: 'yearly', title: 'Yearly', cadence: '/ year', badge: 'Best value', highlight: true },
  { id: 'cycle', title: 'Cycle Pass', cadence: 'one-time', badge: 'Single season' },
]

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string; nobilling?: string }>
}) {
  const { canceled, nobilling } = await searchParams
  const [profile, user, isAdmin] = await Promise.all([getProfile(), getCurrentUser(), getIsAdmin()])
  const tier = profile?.tier ?? 'free'
  const hasCycle = tier === 'cycle'
  const accessCodes = isAdmin ? await listAccessCodes() : []

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Simple, Student-Friendly Pricing</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Start free, upgrade when you need more. Pay monthly or yearly if you&apos;re planning
          ahead, or grab a one-time Cycle Pass for a single application season — every paid plan
          unlocks the same premium features.
        </p>
      </div>

      {canceled && (
        <div className="max-w-md mx-auto mb-6 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-center">
          Payment was canceled — no charge was made. You can try again anytime.
        </div>
      )}
      {nobilling && (
        <div className="max-w-md mx-auto mb-6 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-center">
          We couldn&apos;t find a billing account for you. If you unlocked premium with an access
          code or a one-time Cycle Pass, there&apos;s no subscription to manage.
        </div>
      )}

      {hasCycle && (
        <div className="max-w-md mx-auto mb-8 text-center">
          <div className="text-sm text-teal-700 font-semibold bg-teal-100 rounded-lg py-2 px-4 flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" /> Premium is active on your account
          </div>
          <div className="mt-3">
            <ManageBillingButton />
          </div>
        </div>
      )}

      {/* Paid plans */}
      <div className="grid sm:grid-cols-3 gap-6 mb-6">
        {PAID_CARDS.map(card => {
          const plan = PLANS[card.id]
          const dollars = plan.amount / 100
          return (
            <div
              key={card.id}
              className={`relative rounded-2xl border-2 p-6 flex flex-col ${
                card.highlight ? 'border-teal-400 bg-teal-50/40' : 'border-gray-200 bg-white'
              }`}
            >
              {card.badge && (
                <span
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    card.highlight ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {card.badge}
                </span>
              )}
              <h2 className="text-lg font-bold text-gray-900">{card.title}</h2>
              <div className="text-3xl font-bold mt-1 text-gray-900">
                ${dollars} <span className="text-base font-normal text-gray-400">{card.cadence}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2 mb-4">{plan.description}</p>

              <ul className="space-y-2 mb-6 flex-1">
                {PREMIUM_FEATURES.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {hasCycle ? (
                <div className="text-sm text-center text-teal-700 font-semibold bg-teal-100 rounded-lg py-2.5 flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> Premium active
                </div>
              ) : (
                <CheckoutButton
                  plan={card.id}
                  label={`Choose ${plan.label}`}
                  isAuthed={Boolean(user)}
                  highlight={card.highlight}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Free tier */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-6 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Free</h2>
            <div className="text-2xl font-bold mt-1 text-gray-900">
              $0 <span className="text-sm font-normal text-gray-400">always</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">No credit card needed.</p>
          </div>
          <ul className="space-y-1.5 sm:max-w-xs">
            {FREE_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        {!hasCycle && (
          <div className="mt-4 text-sm text-center text-teal-700 font-semibold bg-teal-50 rounded-lg py-2">
            Your current plan
          </div>
        )}
      </div>

      {/* Access Code */}
      {(!hasCycle || isAdmin) && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md mx-auto">
          <h3 className="font-semibold text-gray-900 mb-1">Have an Access Code?</h3>
          <p className="text-sm text-gray-500 mb-4">
            Enter your beta or promotional code below to unlock premium features.
          </p>
          {profile ? (
            <AccessCodeForm />
          ) : (
            <p className="text-sm text-amber-700">
              <a href="/profile" className="underline">Save your profile first</a> to redeem an access code.
            </p>
          )}
          {isAdmin && <AdminCodeGenerator initialCodes={accessCodes} />}
        </div>
      )}
    </div>
  )
}
