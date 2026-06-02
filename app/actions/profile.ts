'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { ProfileData } from '@/types'

export type ProfileFormInput = {
  name: string
  email: string
  statePrefs: string[]
  targetTerm: string
  overallGPA: string
  scienceGPA: string
  totalCredits: string
  coursesCompleted: string[]
  teasScore: string
  hesiScore: string
  casperQuartile: string
  casperPercentile: string
  otherExamName: string
  otherExamScore: string
}

export async function saveProfile(input: ProfileFormInput): Promise<{ id: string; error?: string }> {
  try {
    const cookieStore = await cookies()
    const existingId = cookieStore.get('profile_id')?.value

    const data = {
      name: input.name.trim(),
      email: input.email.trim(),
      statePrefs: JSON.stringify(input.statePrefs),
      targetTerm: input.targetTerm,
      overallGPA: input.overallGPA ? parseFloat(input.overallGPA) : null,
      scienceGPA: input.scienceGPA ? parseFloat(input.scienceGPA) : null,
      totalCredits: input.totalCredits ? parseInt(input.totalCredits, 10) : null,
      coursesCompleted: JSON.stringify(input.coursesCompleted),
      teasScore: input.teasScore ? parseFloat(input.teasScore) : null,
      hesiScore: input.hesiScore ? parseFloat(input.hesiScore) : null,
      casperQuartile: input.casperQuartile ? parseInt(input.casperQuartile, 10) : null,
      casperPercentile: input.casperPercentile ? parseInt(input.casperPercentile, 10) : null,
      otherExamName: input.otherExamName.trim() || null,
      otherExamScore: input.otherExamScore ? parseFloat(input.otherExamScore) : null,
    }

    let profileId: string

    if (existingId) {
      const existing = await prisma.profile.findUnique({ where: { id: existingId } })
      if (existing) {
        await prisma.profile.update({ where: { id: existingId }, data })
        profileId = existingId
      } else {
        const created = await prisma.profile.create({ data })
        profileId = created.id
      }
    } else {
      const created = await prisma.profile.create({ data })
      profileId = created.id
    }

    cookieStore.set('profile_id', profileId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    })

    revalidatePath('/programs')
    revalidatePath('/plan')
    return { id: profileId }
  } catch (err) {
    console.error('saveProfile error:', err)
    return { id: '', error: 'Failed to save profile. Please try again.' }
  }
}

export async function getProfile(): Promise<ProfileData | null> {
  const cookieStore = await cookies()
  const profileId = cookieStore.get('profile_id')?.value
  if (!profileId) return null

  const raw = await prisma.profile.findUnique({ where: { id: profileId } })
  if (!raw) return null

  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    statePrefs: JSON.parse(raw.statePrefs) as string[],
    targetTerm: raw.targetTerm,
    overallGPA: raw.overallGPA,
    scienceGPA: raw.scienceGPA,
    totalCredits: raw.totalCredits,
    coursesCompleted: JSON.parse(raw.coursesCompleted) as string[],
    teasScore: raw.teasScore,
    hesiScore: raw.hesiScore,
    casperQuartile: raw.casperQuartile,
    casperPercentile: raw.casperPercentile,
    otherExamName: raw.otherExamName,
    otherExamScore: raw.otherExamScore,
    tier: raw.tier as 'free' | 'cycle',
  }
}
