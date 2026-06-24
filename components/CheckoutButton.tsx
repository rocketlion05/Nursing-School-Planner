'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { track } from '@vercel/analytics'
import { createCheckoutSession } from '@/app/actions/stripe'
import type { PlanId } from '@/lib/stripe'
import { CreditCard, LogIn } from 'lucide-react'

export default function CheckoutButton({
  plan,
  label,
  isAuthed,
  highlight = false,
}: {
  plan: PlanId
  label: string
  isAuthed: boolean
  highlight?: boolean
}) {
  const [isPending, startTransition] = useTransition()

  if (!isAuthed) {
    return (
      <Link
        href="/login?next=/pricing"
        className={`w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
          highlight
            ? 'bg-teal-600 text-white hover:bg-teal-700'
            : 'bg-white border border-teal-600 text-teal-700 hover:bg-teal-50'
        }`}
      >
        <LogIn className="w-4 h-4" />
        Log in to choose
      </Link>
    )
  }

  return (
    <button
      disabled={isPending}
      onClick={() => { track('checkout_started', { plan }); startTransition(() => createCheckoutSession(plan)) }}
      className={`w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-colors ${
        highlight
          ? 'bg-teal-600 text-white hover:bg-teal-700'
          : 'bg-white border border-teal-600 text-teal-700 hover:bg-teal-50'
      }`}
    >
      <CreditCard className="w-4 h-4" />
      {isPending ? 'Redirecting…' : label}
    </button>
  )
}
