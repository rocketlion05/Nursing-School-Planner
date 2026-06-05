import { loadEnv } from './_env'
loadEnv(process.argv)

import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../app/generated/prisma/client'
import { libsqlConfig } from '../lib/libsql-config'
import bcrypt from 'bcryptjs'

async function main() {
  const adapter = new PrismaLibSql(libsqlConfig())
  const prisma = new PrismaClient({ adapter })

  const now = new Date()
  const freeHash = await bcrypt.hash('TestFree123!', 12)
  const premHash = await bcrypt.hash('TestPrem123!', 12)

  // Free user
  const free = await prisma.user.upsert({
    where: { email: 'testfree@nursingtest.dev' },
    create: {
      email: 'testfree@nursingtest.dev',
      username: 'testfree',
      passwordHash: freeHash,
      name: 'Test Free',
      emailVerified: now,
    },
    update: { passwordHash: freeHash, emailVerified: now },
  })
  console.log('Free user:', free.id)

  // Premium user
  const prem = await prisma.user.upsert({
    where: { email: 'testprem@nursingtest.dev' },
    create: {
      email: 'testprem@nursingtest.dev',
      username: 'testprem',
      passwordHash: premHash,
      name: 'Test Premium',
      emailVerified: now,
      profile: { create: { tier: 'cycle' } },
    },
    update: {
      passwordHash: premHash,
      emailVerified: now,
      profile: {
        upsert: {
          create: { tier: 'cycle' },
          update: { tier: 'cycle' },
        },
      },
    },
  })
  console.log('Premium user:', prem.id)
  console.log('Done.')

  await prisma.$disconnect()
}

main().catch(console.error)
