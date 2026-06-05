import 'server-only'
import { prisma } from '@/lib/prisma'

export const DEFAULT_LIST_NAME = 'Saved'

/**
 * Returns the profile's default ("Saved") list id, creating it on first use.
 * The default list replaces the old flat favorites — the heart UI toggles
 * membership here.
 */
export async function getOrCreateDefaultListId(profileId: string): Promise<string> {
  const existing = await prisma.list.findFirst({
    where: { profileId, isDefault: true },
    select: { id: true },
  })
  if (existing) return existing.id
  const created = await prisma.list.create({
    data: { profileId, name: DEFAULT_LIST_NAME, isDefault: true },
    select: { id: true },
  })
  return created.id
}
