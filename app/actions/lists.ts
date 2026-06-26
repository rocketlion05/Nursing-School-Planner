'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/app/lib/dal'
import { isAdminEmail } from '@/lib/admin'
import { hasActivePremium } from '@/lib/premium'

export type ListWithItems = {
  id: string
  name: string
  isDefault: boolean
  programIds: string[]
}

type Ctx = { profileId: string; isPremium: boolean }

/** Resolves the current profile + premium flag, or null if not logged in / no profile. */
async function getCtx(): Promise<Ctx | null> {
  const user = await getCurrentUser()
  if (!user) return null
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { id: true, tier: true, premiumUntil: true, cyclePasses: { select: { expiryDate: true } } },
  })
  if (!profile) return null
  return { profileId: profile.id, isPremium: isAdminEmail(user.email) || hasActivePremium(profile) }
}

/** All of the current profile's lists with their program ids (default list first). */
export async function getLists(): Promise<ListWithItems[]> {
  const ctx = await getCtx()
  if (!ctx) return []
  const lists = await prisma.list.findMany({
    where: { profileId: ctx.profileId },
    include: { items: { select: { programId: true } } },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
  })
  return lists.map(l => ({
    id: l.id,
    name: l.name,
    isDefault: l.isDefault,
    programIds: l.items.map(i => i.programId),
  }))
}

const PREMIUM_REQUIRED = 'Custom lists are a Pro feature. Upgrade to create named lists.'

export async function createList(name: string): Promise<{ id?: string; error?: string }> {
  try {
    const ctx = await getCtx()
    if (!ctx) return { error: 'Please log in.' }
    if (!ctx.isPremium) return { error: PREMIUM_REQUIRED }
    const trimmed = name.trim()
    if (!trimmed) return { error: 'List name cannot be empty.' }
    if (trimmed.length > 60) return { error: 'List name is too long (60 characters max).' }

    const created = await prisma.list.create({
      data: { profileId: ctx.profileId, name: trimmed, isDefault: false },
      select: { id: true },
    })
    revalidatePath('/programs')
    revalidatePath('/dashboard')
    return { id: created.id }
  } catch (err) {
    console.error('createList error:', err)
    return { error: 'Failed to create list.' }
  }
}

export async function renameList(id: string, name: string): Promise<{ error?: string }> {
  try {
    const ctx = await getCtx()
    if (!ctx) return { error: 'Please log in.' }
    if (!ctx.isPremium) return { error: PREMIUM_REQUIRED }
    const trimmed = name.trim()
    if (!trimmed) return { error: 'List name cannot be empty.' }

    const list = await prisma.list.findUnique({ where: { id }, select: { profileId: true, isDefault: true } })
    if (!list || list.profileId !== ctx.profileId) return { error: 'List not found.' }
    if (list.isDefault) return { error: 'The default Saved list cannot be renamed.' }

    await prisma.list.update({ where: { id }, data: { name: trimmed } })
    revalidatePath('/programs')
    revalidatePath('/dashboard')
    return {}
  } catch (err) {
    console.error('renameList error:', err)
    return { error: 'Failed to rename list.' }
  }
}

export async function deleteList(id: string): Promise<{ error?: string }> {
  try {
    const ctx = await getCtx()
    if (!ctx) return { error: 'Please log in.' }
    if (!ctx.isPremium) return { error: PREMIUM_REQUIRED }

    const list = await prisma.list.findUnique({ where: { id }, select: { profileId: true, isDefault: true } })
    if (!list || list.profileId !== ctx.profileId) return { error: 'List not found.' }
    if (list.isDefault) return { error: 'The default Saved list cannot be deleted.' }

    await prisma.list.delete({ where: { id } })
    revalidatePath('/programs')
    revalidatePath('/dashboard')
    return {}
  } catch (err) {
    console.error('deleteList error:', err)
    return { error: 'Failed to delete list.' }
  }
}

/** Verifies the list belongs to the current premium profile. */
async function ownedList(ctx: Ctx, listId: string) {
  const list = await prisma.list.findUnique({ where: { id: listId }, select: { profileId: true } })
  return list && list.profileId === ctx.profileId ? list : null
}

export async function addToList(listId: string, programId: string): Promise<{ error?: string }> {
  try {
    const ctx = await getCtx()
    if (!ctx) return { error: 'Please log in.' }
    if (!ctx.isPremium) return { error: PREMIUM_REQUIRED }
    if (!(await ownedList(ctx, listId))) return { error: 'List not found.' }

    // Idempotent — ignore if the program is already in the list.
    const existing = await prisma.listItem.findUnique({
      where: { listId_programId: { listId, programId } },
      select: { id: true },
    })
    if (!existing) {
      await prisma.listItem.create({ data: { listId, programId } })
    }
    revalidatePath('/programs')
    revalidatePath('/dashboard')
    return {}
  } catch (err) {
    console.error('addToList error:', err)
    return { error: 'Failed to add to list.' }
  }
}

export async function removeFromList(listId: string, programId: string): Promise<{ error?: string }> {
  try {
    const ctx = await getCtx()
    if (!ctx) return { error: 'Please log in.' }
    if (!ctx.isPremium) return { error: PREMIUM_REQUIRED }
    if (!(await ownedList(ctx, listId))) return { error: 'List not found.' }

    await prisma.listItem.deleteMany({ where: { listId, programId } })
    revalidatePath('/programs')
    revalidatePath('/dashboard')
    return {}
  } catch (err) {
    console.error('removeFromList error:', err)
    return { error: 'Failed to remove from list.' }
  }
}
