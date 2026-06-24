import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendProConfirmationEmail } from '@/lib/email'

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

  // Grant Pro on the first successful invoice of a monthly/yearly subscription.
  // Both paid plans map to tier 'cycle' (legacy internal value for "Pro").
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status === 'paid') {
      const userId = session.client_reference_id
      if (!userId) {
        console.error('checkout.session.completed: missing client_reference_id', session.id)
        return NextResponse.json({ received: true })
      }

      // Cycle Pass (one-time) carries a derived expiry + cycle label in metadata;
      // it grants time-boxed Pro. Subscriptions have no such metadata → unlimited.
      const cycleUntilRaw = session.metadata?.cyclePremiumUntil
      const cycleUntil = cycleUntilRaw ? new Date(cycleUntilRaw) : null
      const isCyclePass = cycleUntil != null && !Number.isNaN(cycleUntil.getTime())
      const cycleLabel = session.metadata?.cycleLabel

      try {
        // Upsert the profile tier to 'cycle' (Pro). Subscriptions have no expiry
        // (premiumUntil null). The Cycle Pass expires at the end of the chosen
        // cycle and records that cycle as the student's target term.
        const data = isCyclePass
          ? { tier: 'cycle', premiumUntil: cycleUntil, ...(cycleLabel ? { targetTerm: cycleLabel } : {}) }
          : { tier: 'cycle', premiumUntil: null }
        await prisma.profile.upsert({
          where:  { userId },
          create: { userId, ...data },
          update: data,
        })
        console.log(`Upgraded user ${userId} to Pro${isCyclePass ? ` (Cycle Pass until ${cycleUntil!.toISOString()})` : ''} (session ${session.id})`)
        // Send confirmation email — look up user email from userId
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } })
        if (user?.email) sendProConfirmationEmail(user.email, isCyclePass ? { expiresAt: cycleUntil! } : undefined).catch(() => {})
      } catch (err) {
        console.error('Failed to upgrade user tier:', err)
        return NextResponse.json({ error: 'DB error' }, { status: 500 })
      }
    }
  }

  // A monthly/yearly subscription ended (cancellation reached period end, or
  // dunning exhausted) — revoke Pro. Access-code grants have no subscription and
  // expire on their own via premiumUntil, so they're unaffected here.
  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const userId = sub.metadata?.userId
    if (userId) {
      try {
        await prisma.profile.updateMany({
          where: { userId },
          data: { tier: 'free' },
        })
        console.log(`Downgraded user ${userId} to free (subscription ${sub.id} ended)`)
      } catch (err) {
        console.error('Failed to downgrade user tier:', err)
        return NextResponse.json({ error: 'DB error' }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ received: true })
}
