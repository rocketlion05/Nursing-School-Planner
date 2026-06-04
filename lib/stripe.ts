import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set.')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-05-27.dahlia',
})

export type PlanId = 'monthly' | 'yearly' | 'cycle'

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
 * All paid plans grant the same premium access (Profile.tier === 'cycle').
 * The only difference is billing cadence — students starting a year or two
 * out can pay monthly/yearly instead of buying a single application cycle.
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
      'Full premium access billed monthly — cancel anytime. Great if you are still early in your prerequisites.',
  },
  yearly: {
    id: 'yearly',
    name: 'Yearly Plan — Nursing School Planner',
    amount: 4900,
    mode: 'subscription',
    interval: 'year',
    label: '$49 / year',
    description:
      'Full premium access billed yearly — best value if you are planning more than one application season.',
  },
  cycle: {
    id: 'cycle',
    name: 'Cycle Pass — Nursing School Planner',
    amount: 1900,
    mode: 'payment',
    label: '$19 one-time',
    description:
      'Full premium access for a single application season. One-time payment, nothing recurring.',
  },
}

export function isPlanId(value: string): value is PlanId {
  return value === 'monthly' || value === 'yearly' || value === 'cycle'
}
