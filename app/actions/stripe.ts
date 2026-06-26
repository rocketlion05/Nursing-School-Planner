'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/app/lib/dal'
import { stripe, PLANS, isPlanId, type PlanId } from '@/lib/stripe'
import { computeCyclePassExpiry } from '@/lib/cycle-pass'
import { getSavedSchoolDeadlines } from '@/app/lib/cycle-pass-server'

function baseUrl(): string {
  return process.env.OAUTH_REDIRECT_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000'
}

export async function createCheckoutSession(planIdInput: PlanId): Promise<void> {
  const user = await requireUser() // redirects to /login if not authed

  // Only the one-time Cycle Pass exists. The pass window is FIXED at purchase:
  // furthest saved-school deadline + 60 days, else 180 days. Compute it here,
  // server-side, from the saved schools at this moment — never trust the client —
  // and carry it in metadata so the webhook writes the immutable expiry.
  if (!isPlanId(planIdInput)) throw new Error('Unknown plan.')
  const plan = PLANS.cycle
  const base = baseUrl()

  const now = new Date()
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  })
  const deadlines = profile ? await getSavedSchoolDeadlines(profile.id) : []
  const expiry = computeCyclePassExpiry(now, deadlines)

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
            name: plan.name,
            description: plan.description,
          },
        },
      },
    ],
    // The Cycle Pass carries its fixed expiry so the webhook can create the pass
    // record with an immutable window.
    metadata: { plan: 'cycle', cyclePassExpiry: expiry.toISOString() },
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
