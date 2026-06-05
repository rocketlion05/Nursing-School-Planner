import Link from 'next/link'
import { requireUser } from '@/app/lib/dal'
import { getProfile } from '@/app/actions/profile'
import { getDeadlines } from '@/app/actions/deadlines'
import { prisma } from '@/lib/prisma'
import DeadlineManager from '@/components/DeadlineManager'
import { CalendarClock, Lock } from 'lucide-react'

export default async function DeadlinesPage() {
  await requireUser()
  const profile = await getProfile()
  const isPremium = profile?.tier === 'cycle'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-1">
        <CalendarClock className="w-6 h-6 text-teal-600" />
        <h1 className="text-2xl font-bold text-gray-900">Application Deadlines</h1>
      </div>
      <p className="text-gray-500 mb-6">
        Track each school&apos;s application deadline and get email reminders at 30, 14, and 7 days out.
      </p>

      {isPremium ? (
        <PremiumDeadlines />
      ) : (
        <div className="bg-gradient-to-br from-teal-50 to-white rounded-2xl border border-teal-200 p-8 text-center">
          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-gray-900 mb-1">Deadline tracking is a Cycle Pass feature</h2>
          <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
            Never miss an application deadline. Set a date for each school and we&apos;ll email you reminders
            at 30, 14, and 7 days out.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-teal-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            Upgrade to Cycle Pass — $19 one time
          </Link>
        </div>
      )}
    </div>
  )
}

async function PremiumDeadlines() {
  const [deadlines, rawPrograms] = await Promise.all([
    getDeadlines(),
    prisma.program.findMany({
      orderBy: [{ university: 'asc' }],
      select: { id: true, university: true, state: true },
    }),
  ])
  const todayISO = new Date().toISOString().slice(0, 10)

  return <DeadlineManager initialDeadlines={deadlines} programs={rawPrograms} todayISO={todayISO} />
}
