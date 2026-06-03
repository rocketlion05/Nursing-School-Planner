'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { createCheckoutSession } from '@/app/actions/stripe'
import { CreditCard, LogIn } from 'lucide-react'

export default function CheckoutButton({ isAuthed }: { isAuthed: boolean }) {
  const [isPending, startTransition] = useTransition()

  if (!isAuthed) {
    return (
      <div className="space-y-2">
        <Link
          href="/login?next=/pricing"
          className="w-full bg-teal-600 text-white py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Log in to purchase
        </Link>
        <p className="text-xs text-center text-gray-400">
          Or{' '}
          <Link href="/signup" className="underline text-teal-600">
            create a free account
          </Link>{' '}
          first.
        </p>
      </div>
    )
  }

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => createCheckoutSession())}
      className="w-full bg-teal-600 text-white py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-teal-700 disabled:opacity-60 transition-colors"
    >
      <CreditCard className="w-4 h-4" />
      {isPending ? 'Redirecting to checkout…' : 'Pay $19 — Cycle Pass'}
    </button>
  )
}
