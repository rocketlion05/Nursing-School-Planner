'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { track } from '@vercel/analytics'
import { Check, CreditCard, LogIn } from 'lucide-react'
import { createCheckoutSession } from '@/app/actions/stripe'
import { availableCycles } from '@/lib/cycle'

export default function CyclePassCard({
  isAuthed,
  isPro,
  features,
  description,
}: {
  isAuthed: boolean
  isPro: boolean
  features: string[]
  description: string
}) {
  const cycles = useMemo(() => availableCycles(new Date()), [])
  const [idx, setIdx] = useState(0)
  const [isPending, startTransition] = useTransition()
  const sel = cycles[idx] ?? cycles[0]

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

      {!isPro && (
        <div className="mb-4">
          <label htmlFor="cycle-select" className="block text-xs font-medium text-gray-600 mb-1">
            Which cycle are you applying for?
          </label>
          <select
            id="cycle-select"
            value={idx}
            onChange={e => setIdx(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            {cycles.map((c, i) => (
              <option key={c.label} value={i}>{c.label}</option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">Pro access runs through your selected cycle.</p>
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
        <button
          onClick={() => {
            if (!sel) return
            track('checkout_started', { plan: 'cycle' })
            startTransition(() => createCheckoutSession('cycle', { term: sel.term, year: sel.year }))
          }}
          disabled={isPending || !sel}
          className="w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-60 transition-colors"
        >
          <CreditCard className="w-4 h-4" />
          {isPending ? 'Redirecting…' : `Get the ${sel?.label ?? ''} pass`}
        </button>
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
