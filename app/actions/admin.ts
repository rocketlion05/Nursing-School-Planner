'use server'

import { stripe } from '@/lib/stripe'
import { getCurrentUser } from '@/app/lib/dal'
import { isAdminEmail } from '@/lib/admin'

export type SubscriberStats = {
  monthly: number
  yearly: number
  total: number
  /** Monthly recurring revenue in cents. yearly subs prorated to monthly. */
  mrrCents: number
}

export async function getSubscriberStats(): Promise<SubscriberStats | null> {
  const user = await getCurrentUser()
  if (!isAdminEmail(user?.email)) return null

  try {
    const subs = await stripe.subscriptions.list({ status: 'active', limit: 100 })
    let monthly = 0
    let yearly = 0

    for (const sub of subs.data) {
      for (const item of sub.items.data) {
        const interval = item.price.recurring?.interval
        if (interval === 'month') monthly++
        else if (interval === 'year') yearly++
      }
    }

    // MRR: monthly * $9 + yearly * ($49 / 12)
    const mrrCents = monthly * 900 + Math.round((yearly * 4900) / 12)
    return { monthly, yearly, total: monthly + yearly, mrrCents }
  } catch {
    return null
  }
}
