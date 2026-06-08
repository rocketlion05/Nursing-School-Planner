'use server'

import { redirect } from 'next/navigation'
import { requireUser } from '@/app/lib/dal'
import { stripe, PLANS, isPlanId, type PlanId } from '@/lib/stripe'

function baseUrl(): string {
  return process.env.OAUTH_REDIRECT_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000'
}

export async function createCheckoutSession(planIdInput: PlanId): Promise<void> {
  const user = await requireUser() // redirects to /login if not authed

  // planIdInput comes from the client — validate before trusting it.
  const planId = isPlanId(planIdInput) ? planIdInput : 'monthly'
  const plan = PLANS[planId]
  const isSubscription = plan.mode === 'subscription'
  const base = baseUrl()

  const session = await stripe.checkout.sessions.create({
    mode: plan.mode,
    // client_reference_id lets the webhook / success page identify which user paid
    client_reference_id: user.id,
    customer_email: user.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: plan.amount,
          ...(isSubscription && plan.interval
            ? { recurring: { interval: plan.interval } }
            : {}),
          product_data: {
            name: plan.name,
            description: plan.description,
          },
        },
      },
    ],
    // Carry the user id onto the Subscription so we can downgrade them on cancel.
    ...(isSubscription
      ? { subscription_data: { metadata: { userId: user.id, plan: plan.id } } }
      : {}),
    success_url: `${base}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/pricing?canceled=1`,
  })

  if (!session.url) {
    throw new Error('Stripe did not return a checkout URL.')
  }

  redirect(session.url)
}

/**
 * Opens the Stripe Billing Portal so subscribers can update payment methods or
 * cancel. Looks the customer up by email (no extra columns needed). If the user
 * has no Stripe customer (e.g. access-code grant), bounce back with a notice.
 */
export async function createBillingPortalSession(): Promise<void> {
  const user = await requireUser()
  const base = baseUrl()

  const customers = await stripe.customers.list({ email: user.email, limit: 1 })
  const customer = customers.data[0]
  if (!customer) {
    redirect('/pricing?nobilling=1')
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: `${base}/pricing`,
  })

  redirect(portal.url)
}
