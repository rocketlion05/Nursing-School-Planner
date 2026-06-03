import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

// Stripe requires the raw body to verify the webhook signature.
// In Next.js App Router the body is already a ReadableStream.
export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', (err as Error).message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status === 'paid') {
      const userId = session.client_reference_id
      if (!userId) {
        console.error('checkout.session.completed: missing client_reference_id', session.id)
        return NextResponse.json({ received: true })
      }

      try {
        // Upsert the profile tier to 'cycle'. Creates an empty profile if none exists
        // (e.g. user paid before filling in their profile — they'll fill it afterward).
        await prisma.profile.upsert({
          where:  { userId },
          create: { userId, tier: 'cycle' },
          update: { tier: 'cycle' },
        })
        console.log(`Upgraded user ${userId} to Cycle Pass (session ${session.id})`)
      } catch (err) {
        console.error('Failed to upgrade user tier:', err)
        return NextResponse.json({ error: 'DB error' }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ received: true })
}
