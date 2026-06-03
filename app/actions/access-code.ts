'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/app/lib/dal'
import { sendCyclePassConfirmationEmail } from '@/lib/email'

export async function redeemAccessCode(code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: 'Please log in to redeem a code.' }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    })
    if (!profile) return { success: false, error: 'Save your profile before redeeming a code.' }
    const profileId = profile.id

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
    revalidatePath('/dashboard')
    sendCyclePassConfirmationEmail(user.email).catch(() => {})
    return { success: true }
  } catch (err) {
    console.error('redeemAccessCode error:', err)
    return { success: false, error: 'Failed to redeem code.' }
  }
}
