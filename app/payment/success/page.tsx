import Link from 'next/link'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/app/lib/dal'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  // Verify the session is real and paid, and manually upgrade the tier in case the
  // webhook arrives late. The webhook is still the primary upgrade path.
  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id)
      if (session.payment_status === 'paid' && session.client_reference_id) {
        await prisma.profile.upsert({
          where:  { userId: session.client_reference_id },
          create: { userId: session.client_reference_id, tier: 'cycle' },
          update: { tier: 'cycle' },
        })
      }
    } catch {
      // Non-fatal — webhook will handle it
    }
  }

  const user = await getCurrentUser()

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re all set!</h1>
      <p className="text-gray-500 mb-6">
        {user?.username ? `Hey ${user.username} — y` : 'Y'}our Cycle Pass is now active. Unlimited
        favorites, full gap analysis, and school requests are unlocked.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/programs"
          className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
        >
          Browse programs <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/profile"
          className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Update my profile
        </Link>
      </div>
    </div>
  )
}
