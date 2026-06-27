'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/app/lib/dal'
import { isAdminEmail } from '@/lib/admin'

export type UserActivityStats = {
  totalUsers: number
  /**
   * Users with active Pro access — stored tier 'cycle' that hasn't lapsed:
   * a Cycle Pass / month code (premiumUntil in the future) or a lifetime grant
   * (premiumUntil null). Mirrors hasActivePremium(). (Revenue itself lives in Stripe.)
   */
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
      // Count pros through the User relation, NOT prisma.profile.count — Profile.userId
      // is nullable, so legacy anonymous/orphan profiles (no account) would otherwise
      // inflate this. Mirrors hasActivePremium(): an active Cycle Pass, OR tier
      // 'cycle' (access code / legacy) that hasn't lapsed.
      prisma.user.count({
        where: {
          profile: {
            OR: [
              { tier: 'cycle', OR: [{ premiumUntil: null }, { premiumUntil: { gt: new Date() } }] },
              { cyclePasses: { some: { expiryDate: { gt: new Date() } } } },
            ],
          },
        },
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

export type AdminUserRow = {
  id: string
  username: string
  email: string
  /** ISO date the account was created. */
  createdAt: string
}

/** All registered users (newest first) for the admin Users list. Admin-only. */
export async function listUsers(): Promise<AdminUserRow[]> {
  const user = await getCurrentUser()
  if (!isAdminEmail(user?.email)) return []

  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })
  return users.map(u => ({
    id: u.id,
    username: u.username,
    email: u.email,
    createdAt: u.createdAt.toISOString(),
  }))
}
