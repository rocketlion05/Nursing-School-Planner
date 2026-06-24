'use server'

import { redirect } from 'next/navigation'
import { requireUser } from '@/app/lib/dal'
import { stripe, PLANS, isPlanId, type PlanId } from '@/lib/stripe'
import { cycleEndDate, cycleLabel, isCycleTerm, type CycleTerm } from '@/lib/cycle'

function baseUrl(): string {
  return process.env.OAUTH_REDIRECT_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000'
}

export async function createCheckoutSession(
  planIdInput: PlanId,
  cycleInput?: { term: string; year: number },
): Promise<void> {
  const user = await requireUser() // redirects to /login if not authed

  // Only the one-time Cycle Pass exists. Validate the chosen cycle server-side and
  // derive the access-expiry date here (never trust a date from the client). Access
  // runs through the end of the selected cycle; clamp to a sane future if past.
  if (!isPlanId(planIdInput)) throw new Error('Unknown plan.')
  const plan = PLANS.cycle
  const base = baseUrl()

  const term: CycleTerm = isCycleTerm(cycleInput?.term) ? cycleInput!.term : 'Fall'
  const now = new Date()
  let year = Number(cycleInput?.year)
  if (!Number.isInteger(year) || year < now.getUTCFullYear() || year > now.getUTCFullYear() + 3) {
    year = now.getUTCFullYear() + 1
  }
  let end = cycleEndDate(term, year)
  if (end.getTime() <= now.getTime()) end = new Date(now.getTime() + 270 * 86_400_000) // ~9mo safety
  const label = cycleLabel(term, year)

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    // client_reference_id lets the webhook / success page identify which user paid
    client_reference_id: user.id,
    customer_email: user.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: plan.amount,
          product_data: {
            name: `${plan.name} (${label})`,
            description: plan.description,
          },
        },
      },
    ],
    // The Cycle Pass carries its derived expiry + label so the webhook can set
    // the time-boxed Pro grant.
    metadata: { plan: 'cycle', cyclePremiumUntil: end.toISOString(), cycleLabel: label },
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
