'use client'

import { useActionState } from 'react'
import { resendVerification } from '@/app/actions/auth'
import { Mail } from 'lucide-react'

const input =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'

export default function ResendVerification({ email = '' }: { email?: string }) {
  const [state, action, pending] = useActionState(resendVerification, undefined)

  if (state?.sent) {
    return (
      <p className="text-sm text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2">
        If that account still needs verifying, we’ve sent a fresh link. Check your inbox.
      </p>
    )
  }

  return (
    <form action={action} className="space-y-3">
      <div className="space-y-1 text-left">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={email}
          placeholder="you@email.com"
          autoComplete="email"
          className={input}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-2 w-full bg-teal-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors"
      >
        <Mail className="w-4 h-4" />
        {pending ? 'Sending…' : 'Resend verification email'}
      </button>
    </form>
  )
}
