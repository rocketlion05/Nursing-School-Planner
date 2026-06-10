import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Create Your Free Account',
  description:
    'Sign up free to save your nursing school profile, track prerequisites, and see your fit scores for BSN programs across Arkansas and Texas.',
  alternates: { canonical: 'https://www.nursingschoolplanner.com/signup' },
  openGraph: {
    title: 'Create Your Free Account — Nursing School Planner',
    description:
      'Sign up free. Save your profile, track prerequisites, and compare your stats against 87+ BSN programs.',
    url: 'https://www.nursingschoolplanner.com/signup',
    type: 'website',
  },
}
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/app/lib/dal'
import SignupForm from '@/components/SignupForm'
import OAuthButtons from '@/components/OAuthButtons'

export default async function SignupPage() {
  if (await getCurrentUser()) redirect('/profile')

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <Image
          src="/logo.jpg"
          alt="Nursing School Planner"
          width={96}
          height={96}
          priority
          className="w-20 h-20 mx-auto mb-4 rounded-xl"
        />
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
