import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { recordCyclePass } from '@/app/lib/cycle-pass-server'
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

      // The Cycle Pass (one-time) carries its FIXED expiry in metadata. Create a
      // brand-new immutable pass record (idempotent on the session id). A
      // subscription / non-cycle checkout (none currently) has no such metadata →
      // legacy unlimited tier grant.
      const expiryRaw = session.metadata?.cyclePassExpiry
      const expiry = expiryRaw ? new Date(expiryRaw) : null
      const isCyclePass = expiry != null && !Number.isNaN(expiry.getTime())

      try {
        if (isCyclePass) {
          const created = await recordCyclePass(userId, session.id, expiry)
          console.log(`Cycle Pass for user ${userId} until ${expiry.toISOString()} (session ${session.id})${created ? '' : ' [already recorded]'}`)
          if (created) {
            const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } })
            if (user?.email) sendProConfirmationEmail(user.email, { expiresAt: expiry, kind: 'cyclepass' }).catch(() => {})
          }
        } else {
          await prisma.profile.upsert({
            where:  { userId },
            create: { userId, tier: 'cycle', premiumUntil: null },
            update: { tier: 'cycle', premiumUntil: null },
          })
          console.log(`Upgraded user ${userId} to Pro (unlimited, session ${session.id})`)
          const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } })
          if (user?.email) sendProConfirmationEmail(user.email).catch(() => {})
        }
      } catch (err) {
        console.error('Failed to record purchase:', err)
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
