import { loadEnv } from './_env'
loadEnv(process.argv)

import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../app/generated/prisma/client'
import { libsqlConfig } from '../lib/libsql-config'

const EMAILS = [
  'gracecheek310@gmail.com',
  'nwc006@uark.edu',
  'nwconnally.student@gmail.com',
]

const APPLY = process.argv.includes('--apply')

async function main() {
  const adapter = new PrismaLibSql(libsqlConfig())
  const prisma = new PrismaClient({ adapter })

  console.log(`Target: ${(libsqlConfig().url || '').includes('turso') ? 'REMOTE/PROD' : 'LOCAL'}`)
  console.log(APPLY ? '*** APPLY MODE — will DELETE ***' : '--- DRY RUN (no deletes) ---')

  for (const email of EMAILS) {
    const user = await prisma.user.findUnique({ where: { email }, include: { profile: true } })
    if (!user) {
      console.log(`\n[NOT FOUND] ${email}`)
      continue
    }
    const profile = user.profile
    let counts = { favorites: 0, lists: 0, listItems: 0, deadlines: 0, cyclePasses: 0, redemptions: 0 }
    if (profile) {
      const lists = await prisma.list.findMany({ where: { profileId: profile.id }, select: { id: true } })
      const listIds = lists.map(l => l.id)
      counts = {
        favorites: await prisma.favorite.count({ where: { profileId: profile.id } }),
        lists: lists.length,
        listItems: listIds.length ? await prisma.listItem.count({ where: { listId: { in: listIds } } }) : 0,
        deadlines: await prisma.deadline.count({ where: { profileId: profile.id } }),
        cyclePasses: await prisma.cyclePass.count({ where: { profileId: profile.id } }),
        redemptions: await prisma.accessCodeRedemption.count({ where: { profileId: profile.id } }),
      }
    }
    const oauth = await prisma.oAuthAccount.count({ where: { userId: user.id } })
    console.log(`\n[FOUND] ${email}`)
    console.log(`  user id=${user.id} username=${user.username} name="${user.name}" created=${user.createdAt.toISOString().slice(0,10)} tier=${profile?.tier ?? 'no-profile'}`)
    console.log(`  attached: oauth=${oauth} ` + Object.entries(counts).map(([k,v]) => `${k}=${v}`).join(' '))

    if (APPLY) {
      await prisma.$transaction(async (tx) => {
        if (profile) {
          const lists = await tx.list.findMany({ where: { profileId: profile.id }, select: { id: true } })
          const listIds = lists.map(l => l.id)
          if (listIds.length) await tx.listItem.deleteMany({ where: { listId: { in: listIds } } })
          await tx.list.deleteMany({ where: { profileId: profile.id } })
          await tx.favorite.deleteMany({ where: { profileId: profile.id } })
          await tx.deadline.deleteMany({ where: { profileId: profile.id } })
          await tx.cyclePass.deleteMany({ where: { profileId: profile.id } })
          await tx.accessCodeRedemption.deleteMany({ where: { profileId: profile.id } })
          await tx.profile.delete({ where: { id: profile.id } })
        }
        await tx.oAuthAccount.deleteMany({ where: { userId: user.id } })
        await tx.verificationToken.deleteMany({ where: { userId: user.id } })
        await tx.passwordResetToken.deleteMany({ where: { userId: user.id } })
        await tx.user.delete({ where: { id: user.id } })
      })
      const stillThere = await prisma.user.findUnique({ where: { email } })
      console.log(`  -> DELETED. verify gone: ${stillThere ? 'STILL PRESENT (!)' : 'yes'}`)
    }
  }

  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
