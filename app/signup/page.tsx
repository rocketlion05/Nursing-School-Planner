import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/app/lib/dal'
import SignupForm from '@/components/SignupForm'
import OAuthButtons from '@/components/OAuthButtons'

export default async function SignupPage() {
  if (await getCurrentUser()) redirect('/profile')

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
        <p className="text-gray-500 text-sm mb-6">
          Save your profile, track your fit, and favorite programs.
        </p>

        <OAuthButtons />

        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-400 uppercase tracking-wide">or</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <SignupForm />
      </div>
    </div>
  )
}
