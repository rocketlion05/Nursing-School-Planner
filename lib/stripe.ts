import Stripe from 'stripe'

let stripeClient: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set.')
    }
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-05-27.dahlia',
    })
  }
  return stripeClient
}

// Lazy proxy: builds without STRIPE_SECRET_KEY succeed; the error only
// surfaces if Stripe is actually used at runtime without the key.
export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const client = getStripe()
    const value = client[prop as keyof Stripe]
    return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(client) : value
  },
})

export type PlanId = 'cycle'

type Plan = {
  id: PlanId
  name: string
  /** Amount in cents. */
  amount: number
  mode: 'subscription' | 'payment'
  /** Billing interval for subscription plans. */
  interval?: 'month' | 'year'
  /** Short label for buttons, e.g. "$9 / month". */
  label: string
  description: string
}

/**
 * The single paid plan: a one-time Cycle Pass that grants Pro (Profile.tier ===
 * 'cycle') for one application cycle. No subscriptions.
 */
export const PLANS: Record<PlanId, Plan> = {
  cycle: {
    id: 'cycle',
    name: 'Cycle Pass — Nursing School Planner',
    amount: 2900,
    mode: 'payment',
    label: '$29 one-time',
    description:
      'Full Pro access for one application cycle — pick the term and year you’re applying for. One-time payment, no subscription, no auto-renew.',
  },
}

export function isPlanId(value: string): value is PlanId {
  return value === 'cycle'
}
