'use server'

import { redirect } from 'next/navigation'
import { requireUser } from '@/app/lib/dal'
import { stripe, CYCLE_PASS_PRICE, CYCLE_PASS_NAME } from '@/lib/stripe'

export async function createCheckoutSession(): Promise<void> {
  const user = await requireUser() // redirects to /login if not authed

  const base =
    process.env.OAUTH_REDIRECT_BASE_URL?.replace(/\/$/, '') ??
    'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    // client_reference_id lets the webhook identify which user paid
    client_reference_id: user.id,
    customer_email: user.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: CYCLE_PASS_PRICE,
          product_data: {
            name: CYCLE_PASS_NAME,
            description:
              'Unlimited favorites, full gap analysis, and request-a-school for your full application season.',
          },
        },
      },
    ],
    success_url: `${base}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${base}/pricing?canceled=1`,
  })

  if (!session.url) {
    throw new Error('Stripe did not return a checkout URL.')
  }

  redirect(session.url)
}
