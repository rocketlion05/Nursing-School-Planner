'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login } from '@/app/actions/auth'
import type { AuthFormState } from '@/app/lib/auth-validation'
import { LogIn } from 'lucide-react'

const input =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'

export default function LoginForm() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(login, undefined)

  return (
    <form action={action} className="space-y-4">
      {state?.message && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.message}
        </p>
      )}

      <div className="space-y-1">
        <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
          Username or email
        </label>
        <input id="identifier" name="identifier" className={input} defaultValue={state?.values?.identifier} placeholder="janedoe" autoComplete="username" />
        {state?.errors?.identifier && (
          <p className="text-xs text-red-600">{state.errors.identifier[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Link href="/forgot-password" className="text-xs text-teal-600 font-medium hover:underline">
            Forgot password?
          </Link>
        </div>
        <input id="password" name="password" type="password" className={input} placeholder="••••••••" autoComplete="current-password" />
        {state?.errors?.password && (
          <p className="text-xs text-red-600">{state.errors.password[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-2 w-full bg-teal-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors"
      >
        <LogIn className="w-4 h-4" />
        {pending ? 'Logging in…' : 'Log in'}
      </button>

      <p className="text-sm text-gray-500 text-center">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-teal-600 font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  )
}
