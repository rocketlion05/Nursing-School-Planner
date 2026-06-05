/**
 * One-time, idempotent backfill: migrates the flat `Favorite` rows into the new
 * list model so existing saved programs survive the favorites→lists unification.
 *
 * For every profile that has favorites, finds-or-creates its default "Saved" list
 * (isDefault: true) and copies each favorite into a ListItem. The
 * @@unique([listId, programId]) constraint makes re-runs safe (duplicates skipped).
 *
 * Usage:
 *   npx tsx scripts/backfill-default-lists.ts          # local dev.db
 *   npx tsx scripts/backfill-default-lists.ts --prod   # live Turso DB
 */
import { loadEnv } from './_env'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../app/generated/prisma/client'
import { libsqlConfig } from '../lib/libsql-config'

loadEnv()
const cfg = libsqlConfig()
const adapter = new PrismaLibSql(cfg)
const prisma = new PrismaClient({ adapter })

const DEFAULT_LIST_NAME = 'Saved'

async function main() {
  const target = cfg.url.startsWith('file:') ? `LOCAL (${cfg.url})` : `REMOTE/PROD (${cfg.url})`
  console.log(`Backfilling default lists from favorites -> ${target}`)

  const profiles = await prisma.profile.findMany({
    where: { favorites: { some: {} } },
    include: { favorites: true, lists: { where: { isDefault: true } } },
  })

  let listsCreated = 0
  let itemsCreated = 0

  for (const profile of profiles) {
    let defaultListId = profile.lists[0]?.id
    if (!defaultListId) {
      const created = await prisma.list.create({
        data: { profileId: profile.id, name: DEFAULT_LIST_NAME, isDefault: true },
        select: { id: true },
      })
      defaultListId = created.id
      listsCreated++
    }

    for (const fav of profile.favorites) {
      const existing = await prisma.listItem.findUnique({
        where: { listId_programId: { listId: defaultListId, programId: fav.programId } },
        select: { id: true },
      })
      if (existing) continue
      await prisma.listItem.create({ data: { listId: defaultListId, programId: fav.programId } })
      itemsCreated++
    }
  }

  console.log(
    `Done. ${profiles.length} profile(s) with favorites · ${listsCreated} default list(s) created · ${itemsCreated} item(s) added.`,
  )
}

main()
  .catch(err => {
    console.error('backfill-default-lists failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
