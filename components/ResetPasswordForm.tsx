'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { resetPassword } from '@/app/actions/auth'
import type { AuthFormState } from '@/app/lib/auth-validation'
import { KeyRound } from 'lucide-react'

const input =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(resetPassword, undefined)

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      {state?.message && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.message}{' '}
          <Link href="/forgot-password" className="font-semibold underline">
            Request a new link
          </Link>
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className={input}
          placeholder="••••••••"
          autoComplete="new-password"
        />
        {state?.errors?.password ? (
          <ul className="text-xs text-red-600 list-disc pl-4 space-y-0.5">
            {state.errors.password.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-400">
            At least 8 characters with upper &amp; lowercase, a number, and a special character.
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className={input}
          placeholder="••••••••"
          autoComplete="new-password"
        />
        {state?.errors?.confirmPassword && (
          <p className="text-xs text-red-600">{state.errors.confirmPassword[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-2 w-full bg-teal-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors"
      >
        <KeyRound className="w-4 h-4" />
        {pending ? 'Saving…' : 'Reset password'}
      </button>
    </form>
  )
}
