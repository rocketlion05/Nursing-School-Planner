import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set.')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-05-27.dahlia',
})

export const CYCLE_PASS_PRICE = 1900 // $19.00 in cents
export const CYCLE_PASS_NAME  = 'Cycle Pass — Nursing School Planner'
