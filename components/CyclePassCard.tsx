'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { track } from '@vercel/analytics'
import { Check, CreditCard, LogIn, CalendarClock } from 'lucide-react'
import { createCheckoutSession } from '@/app/actions/stripe'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function CyclePassCard({
  isAuthed,
  isPro,
  features,
  description,
  preview,
}: {
  isAuthed: boolean
  isPro: boolean
  features: string[]
  description: string
  /** Pre-purchase expiry preview; null when logged out (no saved schools known). */
  preview: { expiry: string; basedOnSchools: boolean; schoolsWithDeadline: number } | null
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="relative rounded-2xl border-2 border-teal-400 bg-teal-50/40 p-6 flex flex-col">
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-2.5 py-0.5 rounded-full font-medium bg-teal-600 text-white">
        Most popular
      </span>
      <h2 className="text-lg font-bold text-gray-900">Cycle Pass</h2>
      <div className="text-3xl font-bold mt-1 text-gray-900">
        $29 <span className="text-base font-normal text-gray-400">one-time</span>
      </div>
      <p className="text-sm text-gray-500 mt-2 mb-3">{description}</p>

      {/* Pre-purchase window preview — the expiry is fixed at purchase from your
          saved schools' deadlines. */}
      {!isPro && preview && (
        <div className="mb-4 rounded-lg border border-teal-200 bg-white px-3 py-2.5 text-xs text-gray-600 flex gap-2">
          <CalendarClock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <span>
            {preview.basedOnSchools ? (
              <>
                Your pass will be active through{' '}
                <strong className="text-gray-900">{formatDate(preview.expiry)}</strong> based on your
                current saved schools. Add all your target schools before purchasing to set your window.
              </>
            ) : (
              <>
                Defaults to <strong className="text-gray-900">180 days from today</strong> (
                {formatDate(preview.expiry)}) — <Link href="/programs" className="text-teal-700 underline">add your schools</Link>{' '}
                before purchasing to set your exact window.
              </>
            )}
          </span>
        </div>
      )}

      <ul className="space-y-2 mb-6 flex-1">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
            <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>

      {isPro ? (
        <div className="text-sm text-center text-teal-700 font-semibold bg-teal-100 rounded-lg py-2.5 flex items-center justify-center gap-2">
          <Check className="w-4 h-4" /> Pro active
        </div>
      ) : isAuthed ? (
        <>
          <button
            onClick={() => {
              setError(null)
              track('checkout_started', { plan: 'cycle' })
              startTransition(async () => {
                try {
                  await createCheckoutSession('cycle')
                } catch {
                  setError('Could not start checkout. Please try again.')
                }
              })
            }}
            disabled={isPending}
            className="w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-60 transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            {isPending ? 'Redirecting…' : 'Get the Cycle Pass'}
          </button>
          {error && <p className="text-xs text-red-600 mt-2 text-center">{error}</p>}
        </>
      ) : (
        <Link
          href="/login?next=/pricing"
          className="w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 bg-teal-600 text-white hover:bg-teal-700 transition-colors"
        >
          <LogIn className="w-4 h-4" /> Log in to choose
        </Link>
      )}
    </div>
  )
}
