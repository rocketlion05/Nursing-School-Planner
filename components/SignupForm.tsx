'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signup } from '@/app/actions/auth'
import type { AuthFormState } from '@/app/lib/auth-validation'
import { UserPlus } from 'lucide-react'

const input =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'

export default function SignupForm() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(signup, undefined)

  return (
    <form action={action} className="space-y-4">
      {state?.message && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.message}
        </p>
      )}

      <div className="space-y-1">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input id="username" name="username" className={input} defaultValue={state?.values?.username} placeholder="janedoe" autoComplete="username" />
        <FieldErrors errors={state?.errors?.username} />
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input id="email" name="email" type="email" className={input} defaultValue={state?.values?.email} placeholder="you@email.com" autoComplete="email" />
        <FieldErrors errors={state?.errors?.email} />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input id="password" name="password" type="password" className={input} placeholder="••••••••" autoComplete="new-password" />
        {state?.errors?.password ? (
          <div className="text-xs text-red-600">
            <p className="font-medium">Password must:</p>
            <ul className="list-disc list-inside">
              {state.errors.password.map(e => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-xs text-gray-400">
            At least 8 characters with uppercase, lowercase, a number, and a special character.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-2 w-full bg-teal-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors"
      >
        <UserPlus className="w-4 h-4" />
        {pending ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-sm text-gray-500 text-center">
        Already have an account?{' '}
        <Link href="/login" className="text-teal-600 font-medium hover:underline">
          Log in
        </Link>
      </p>
    </form>
  )
}

function FieldErrors({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null
  return <p className="text-xs text-red-600">{errors[0]}</p>
}
