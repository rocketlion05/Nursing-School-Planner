'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function toggleFavorite(programId: string): Promise<{ isFavorite: boolean; error?: string }> {
  try {
    const cookieStore = await cookies()
    const profileId = cookieStore.get('profile_id')?.value
    if (!profileId) return { isFavorite: false, error: 'No profile found. Save your profile first.' }

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
