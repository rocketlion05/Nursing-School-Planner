'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/app/lib/dal'
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
  const user = await getCurrentUser()
  if (!user) {
    return { id: '', error: 'Please log in to save your profile.' }
  }

  try {
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

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      create: { ...data, userId: user.id },
      update: data,
      select: { id: true },
    })

    revalidatePath('/programs')
    revalidatePath('/plan')
    return { id: profile.id }
  } catch (err) {
    console.error('saveProfile error:', err)
    return { id: '', error: 'Failed to save profile. Please try again.' }
  }
}

export async function getProfile(): Promise<ProfileData | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const raw = await prisma.profile.findUnique({ where: { userId: user.id } })
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
