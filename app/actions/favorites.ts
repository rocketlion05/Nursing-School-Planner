'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/app/lib/dal'

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

export async function toggleFavorite(programId: string): Promise<{ isFavorite: boolean; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) return { isFavorite: false, error: 'Please log in to save favorites.' }

    const profileId = await getOrCreateProfileId(user.id)

    const existing = await prisma.favorite.findUnique({
      where: { profileId_programId: { profileId, programId } },
    })

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } })
      revalidatePath('/programs')
      return { isFavorite: false }
    }

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: { favorites: true },
    })

    if (profile?.tier === 'free' && (profile.favorites?.length ?? 0) >= 2) {
      return {
        isFavorite: false,
        error: 'Free tier is limited to 2 favorites. Upgrade to Cycle Pass for unlimited favorites.',
      }
    }

    await prisma.favorite.create({ data: { profileId, programId } })
    revalidatePath('/programs')
    return { isFavorite: true }
  } catch (err) {
    console.error('toggleFavorite error:', err)
    return { isFavorite: false, error: 'Failed to update favorites.' }
  }
}
