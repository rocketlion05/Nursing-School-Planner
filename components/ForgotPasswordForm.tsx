'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { requestPasswordReset } from '@/app/actions/auth'
import type { AuthFormState } from '@/app/lib/auth-validation'
import { Mail, CheckCircle } from 'lucide-react'

const input =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'

export default function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(requestPasswordReset, undefined)

  // The action returns message: 'sent' on a successful (or no-op) request.
  if (state?.message === 'sent') {
    return (
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-6 h-6" />
        </div>
        <p className="text-sm text-gray-600 mb-6">
          If an account exists for{' '}
          <span className="font-medium">{state.values?.email}</span>, we&apos;ve sent a password reset
          link. It expires in 1 hour, so check your inbox and spam folder.
        </p>
        <Link href="/login" className="text-teal-600 font-medium hover:underline text-sm">
          Back to log in
        </Link>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className={input}
          defaultValue={state?.values?.email}
          placeholder="you@email.com"
          autoComplete="email"
        />
        {state?.errors?.email && <p className="text-xs text-red-600">{state.errors.email[0]}</p>}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-2 w-full bg-teal-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors"
      >
        <Mail className="w-4 h-4" />
        {pending ? 'Sending…' : 'Send reset link'}
      </button>

      <p className="text-sm text-gray-500 text-center">
        Remembered it?{' '}
        <Link href="/login" className="text-teal-600 font-medium hover:underline">
          Log in
        </Link>
      </p>
    </form>
  )
}
