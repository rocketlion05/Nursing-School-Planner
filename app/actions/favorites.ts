'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/app/lib/dal'
import { isAdminEmail } from '@/lib/admin'
import { hasActivePremium } from '@/lib/premium'
import { getOrCreateDefaultListId } from '@/app/lib/lists'

/** Returns the logged-in user's profile id, creating an empty profile if needed. */
async function getOrCreateProfileId(userId: string): Promise<string> {
  const existing = await prisma.profile.findUnique({
    where: { userId },
    select: { id: true },
  })
  if (existing) return existing.id
  const created = await prisma.profile.create({
    data: { userId },
    select: { id: true },
  })
  return created.id
}

/**
 * Toggles a program in the profile's default "Saved" list. The heart UI on
 * /programs maps to default-list membership; named lists are managed separately.
 * Free tier is capped at 2 saved programs.
 */
export async function toggleFavorite(
  programId: string,
): Promise<{ isFavorite: boolean; error?: string; limitReached?: boolean }> {
  try {
    const user = await getCurrentUser()
    if (!user) return { isFavorite: false, error: 'Please log in to save favorites.' }

    const profileId = await getOrCreateProfileId(user.id)
    const listId = await getOrCreateDefaultListId(profileId)

    const existing = await prisma.listItem.findUnique({
      where: { listId_programId: { listId, programId } },
    })

    if (existing) {
      await prisma.listItem.delete({ where: { id: existing.id } })
      revalidatePath('/programs')
      revalidatePath('/dashboard')
      return { isFavorite: false }
    }

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      select: { tier: true, premiumUntil: true, cyclePasses: { select: { expiryDate: true } } },
    })
    const savedCount = await prisma.listItem.count({ where: { listId } })

    const isPremium = isAdminEmail(user.email) || hasActivePremium(profile)
    if (!isPremium && savedCount >= 2) {
      return {
        isFavorite: false,
        limitReached: true,
        error: 'Free tier is limited to 2 saved programs. Upgrade to Pro for unlimited favorites and custom lists.',
      }
    }

    await prisma.listItem.create({ data: { listId, programId } })
    revalidatePath('/programs')
    revalidatePath('/dashboard')
    return { isFavorite: true }
  } catch (err) {
    console.error('toggleFavorite error:', err)
    return { isFavorite: false, error: 'Failed to update favorites.' }
  }
}
