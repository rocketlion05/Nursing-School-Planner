import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/app/lib/dal'
import ResendVerification from '@/components/ResendVerification'

type Status = 'invalid' | 'unverified' | undefined

const COPY: Record<
  'default' | 'invalid' | 'unverified',
  { heading: string; body: string; tone: 'info' | 'warn' }
> = {
  default: {
    heading: 'Check your email',
    body: 'We just sent you a verification link. Click it to activate your account and finish signing up.',
    tone: 'info',
  },
  unverified: {
    heading: 'Verify your email to continue',
    body: 'Your account isn’t active yet. We sent a verification link when you signed up — click it to log in. Need a new one? Resend it below.',
    tone: 'warn',
  },
  invalid: {
    heading: 'That link didn’t work',
    body: 'Your verification link is invalid or has expired (links last 24 hours). Enter your email below and we’ll send a fresh one.',
    tone: 'warn',
  },
}

export default async function VerificationSentPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; status?: Status }>
}) {
  // Already signed in and verified? Nothing to do here.
  if (await getCurrentUser()) redirect('/dashboard')

  const { email, status } = await searchParams
  const copy = COPY[status ?? 'default'] ?? COPY.default

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <Image
          src="/logo.jpg"
          alt="Nursing School Planner"
          width={96}
          height={96}
          priority
          className="w-20 h-20 mx-auto mb-4 rounded-xl"
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{copy.heading}</h1>
        <p className="text-gray-500 text-sm mb-6">{copy.body}</p>

        {email && status !== 'invalid' && (
          <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-6">
            Sent to <span className="font-medium">{email}</span>
          </p>
        )}

        <ResendVerification email={status === 'invalid' ? '' : email} />

        <p className="text-sm text-gray-500 mt-6">
          Already verified?{' '}
          <Link href="/login" className="text-teal-600 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
