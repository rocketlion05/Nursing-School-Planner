import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set.')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-05-27.dahlia',
})

export type PlanId = 'monthly' | 'yearly'

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
 * Paid plans. Both grant the same Pro access (Profile.tier === 'cycle' — a legacy
 * internal value). The only difference is billing cadence.
 */
export const PLANS: Record<PlanId, Plan> = {
  monthly: {
    id: 'monthly',
    name: 'Monthly Plan — Nursing School Planner',
    amount: 900,
    mode: 'subscription',
    interval: 'month',
    label: '$9 / month',
    description:
      'Full Pro access billed monthly — cancel anytime. Great if you are still early in your prerequisites.',
  },
  yearly: {
    id: 'yearly',
    name: 'Yearly Plan — Nursing School Planner',
    amount: 4900,
    mode: 'subscription',
    interval: 'year',
    label: '$49 / year',
    description:
      'Full Pro access billed yearly — best value if you are planning more than one application season.',
  },
}

export function isPlanId(value: string): value is PlanId {
  return value === 'monthly' || value === 'yearly'
}
