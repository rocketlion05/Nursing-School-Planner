'use client'

import { useTransition } from 'react'
import { createBillingPortalSession } from '@/app/actions/stripe'
import { Settings } from 'lucide-react'

export default function ManageBillingButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => createBillingPortalSession())}
      className="inline-flex items-center justify-center gap-2 text-sm font-medium text-teal-700 hover:underline disabled:opacity-60"
    >
      <Settings className="w-4 h-4" />
      {isPending ? 'Opening billing…' : 'Manage or cancel your subscription'}
    </button>
  )
}
