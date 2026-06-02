import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/app/lib/dal'
import LoginForm from '@/components/LoginForm'
import OAuthButtons from '@/components/OAuthButtons'

const ERROR_MESSAGES: Record<string, string> = {
  provider_unconfigured: 'That sign-in option isn’t set up yet. Try username/password.',
  unknown_provider: 'Unknown sign-in provider.',
  oauth_state: 'Your sign-in attempt expired or was invalid. Please try again.',
  oauth_token: 'We couldn’t complete sign-in with that provider. Please try again.',
  oauth_userinfo: 'We couldn’t read your account details from that provider.',
  oauth_failed: 'Something went wrong during sign-in. Please try again.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  if (await getCurrentUser()) redirect('/profile')

  const { error } = await searchParams
  const errorMessage = error ? ERROR_MESSAGES[error] ?? 'Sign-in failed. Please try again.' : null

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
        <p className="text-gray-500 text-sm mb-6">Log in to manage your profile and plan.</p>

        {errorMessage && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
            {errorMessage}
          </p>
        )}

        <OAuthButtons />

        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-400 uppercase tracking-wide">or</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
