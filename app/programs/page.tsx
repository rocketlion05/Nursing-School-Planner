import { prisma } from '@/lib/prisma'
import { getProfile } from '@/app/actions/profile'
import { getCurrentUser } from '@/app/lib/dal'
import { scorePrograms } from '@/lib/gap'
import ProgramList from '@/components/ProgramList'
import Disclaimer from '@/components/Disclaimer'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import type { ProgramData } from '@/types'

export default async function ProgramsPage() {
  const [profile, user] = await Promise.all([getProfile(), getCurrentUser()])

  const [rawPrograms, rawFavorites] = await Promise.all([
    prisma.program.findMany({ orderBy: [{ state: 'asc' }, { university: 'asc' }] }),
    user
      ? prisma.favorite.findMany({
          where: { profile: { userId: user.id } },
          select: { programId: true },
        })
      : Promise.resolve([]),
  ])

  const programs: ProgramData[] = rawPrograms.map(p => ({
    ...p,
    requiredCourses: JSON.parse(p.requiredCourses) as string[],
  }))

  const favoriteIds = new Set(rawFavorites.map(f => f.programId))
  const scored = scorePrograms(profile, programs, favoriteIds)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">BSN Programs</h1>
          <p className="text-gray-500 mt-1">{scored.length} programs in Arkansas and Texas</p>
        </div>
        {!profile && (
          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              <Link href="/profile" className="underline font-medium">Complete your profile</Link> to see fit scores.
            </span>
          </div>
        )}
      </div>

      <ProgramList programs={scored} tier={profile?.tier ?? 'free'} isAuthed={Boolean(user)} />

      <div className="mt-8">
        <Disclaimer compact />
      </div>
    </div>
  )
}
