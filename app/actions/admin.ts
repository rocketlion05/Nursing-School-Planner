'use server'

import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
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

export type UserActivityStats = {
  totalUsers: number
  /** Users with active Pro access (subscription, lifetime, or unexpired code). */
  proUsers: number
  activeToday: number
  activeWeek: number
  activeMonth: number
  newToday: number
  newWeek: number
  newMonth: number
}

export async function getUserActivityStats(): Promise<UserActivityStats | null> {
  const user = await getCurrentUser()
  if (!isAdminEmail(user?.email)) return null

  const now = Date.now()
  const dayAgo = new Date(now - 24 * 60 * 60 * 1000)
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000)

  const [totalUsers, proUsers, activeToday, activeWeek, activeMonth, newToday, newWeek, newMonth] =
    await Promise.all([
      prisma.user.count(),
      // Mirrors hasActivePremium(): tier 'cycle' and not lapsed.
      prisma.profile.count({
        where: { tier: 'cycle', OR: [{ premiumUntil: null }, { premiumUntil: { gt: new Date() } }] },
      }),
      prisma.user.count({ where: { lastActiveAt: { gte: dayAgo } } }),
      prisma.user.count({ where: { lastActiveAt: { gte: weekAgo } } }),
      prisma.user.count({ where: { lastActiveAt: { gte: monthAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: dayAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
    ])

  return { totalUsers, proUsers, activeToday, activeWeek, activeMonth, newToday, newWeek, newMonth }
}
