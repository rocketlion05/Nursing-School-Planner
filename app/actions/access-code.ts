'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function redeemAccessCode(code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies()
    const profileId = cookieStore.get('profile_id')?.value
    if (!profileId) return { success: false, error: 'Save your profile before redeeming a code.' }

    const accessCode = await prisma.accessCode.findUnique({ where: { code: code.trim().toUpperCase() } })

    if (!accessCode) return { success: false, error: 'Invalid access code.' }
    if (accessCode.usedBy && accessCode.usedBy !== profileId) {
      return { success: false, error: 'This access code has already been used.' }
    }

    await prisma.profile.update({ where: { id: profileId }, data: { tier: 'cycle' } })

    if (!accessCode.usedBy) {
      await prisma.accessCode.update({
        where: { id: accessCode.id },
        data: { usedBy: profileId, usedAt: new Date() },
      })
    }

    revalidatePath('/programs')
    revalidatePath('/pricing')
    return { success: true }
  } catch (err) {
    console.error('redeemAccessCode error:', err)
    return { success: false, error: 'Failed to redeem code.' }
  }
}
