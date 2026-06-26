import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
}
import { requireUser } from '@/app/lib/dal'
import { getProfile } from '@/app/actions/profile'
import { getDeadlines } from '@/app/actions/deadlines'
import { prisma } from '@/lib/prisma'
import { computeFit } from '@/lib/scoring'
import CompareSelect from '@/components/CompareSelect'
import { CyclePassStatus, CyclePassExpiredNotice } from '@/components/CyclePassNotice'
import { CheckCircle, Circle, BookOpen, ClipboardList, Heart, ArrowRight, AlertCircle, CalendarClock, ListChecks } from 'lucide-react'
import type { ProgramData, FitStatus } from '@/types'

function daysUntil(fromISO: string, toISO: string): number {
  return Math.round((Date.parse(`${toISO}T00:00:00Z`) - Date.parse(`${fromISO}T00:00:00Z`)) / 86_400_000)
}

export default async function DashboardPage() {
  const user = await requireUser()
  const profileRow = await prisma.profile.findUnique({ where: { userId: user.id }, select: { id: true } })
  const [profile, lists, schoolRequests, deadlines] = await Promise.all([
    getProfile(),
    profileRow
      ? prisma.list.findMany({
          where: { profileId: profileRow.id },
          include: { items: { include: { program: true }, orderBy: { createdAt: 'desc' } } },
          orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
        })
      : Promise.resolve([]),
    prisma.schoolRequest.findMany({
      where: { requestedBy: user.id },
      orderBy: { createdAt: 'desc' },
    }),
    getDeadlines(),
  ])

  const isPremium = profile?.tier === 'cycle'
  // Matches the compare page's tier caps (free 2 / premium 6).
  const compareLimit = isPremium ? 6 : 2
  const defaultList = lists.find(l => l.isDefault)
  const namedLists = lists.filter(l => !l.isDefault)

  // Compute fit for each saved (default-list) program
  const favPrograms = (defaultList?.items ?? []).map(item => {
    const prog: ProgramData = {
      ...item.program,
      requiredCourses: JSON.parse(item.program.requiredCourses) as string[],
      estimatedFields: JSON.parse(item.program.estimatedFields) as string[],
    }
    return { ...prog, fit: computeFit(profile, prog), isFavorite: true }
  })

  // Upcoming deadlines (today or later), soonest first
  const todayISO = new Date().toISOString().slice(0, 10)
  const upcomingDeadlines = deadlines.filter(d => d.deadlineDate >= todayISO).slice(0, 4)

  // Fit counts for the summary bar
  const fitCounts: Record<FitStatus, number> = { Safe: 0, Match: 0, Reach: 0, 'Additional Steps Needed': 0, 'No profile': 0, Unverified: 0 }
  favPrograms.forEach(p => { fitCounts[p.fit.status] = (fitCounts[p.fit.status] ?? 0) + 1 })

  // Profile completeness checklist
  const steps = [
    { label: 'Add your GPA', done: profile?.overallGPA != null },
    { label: 'Add your science GPA', done: profile?.scienceGPA != null },
    { label: 'Check off prerequisites', done: (profile?.coursesCompleted.length ?? 0) > 0 },
    { label: 'Enter a TEAS or HESI score', done: (profile?.teasScore ?? profile?.hesiScore) != null },
  ]
  const allDone = steps.every(s => s.done)

  const summaryParts = (['Safe', 'Match', 'Reach'] as FitStatus[])
    .filter(s => fitCounts[s] > 0)
    .map(s => `${fitCounts[s]} ${s}`)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {profile?.name ? `Welcome back, ${profile.name.split(' ')[0]}` : `Hi, ${user.username}`}
        </h1>
        {favPrograms.length > 0 && profile && (
          <p className="text-gray-500 mt-1">
            {favPrograms.length} saved program{favPrograms.length !== 1 ? 's' : ''}
            {summaryParts.length > 0 ? `: ${summaryParts.join(', ')}` : ''}.
          </p>
        )}
      </div>

      {/* Cycle Pass status — active window + 14-day expiry warning, or expired prompt */}
      {profile?.cyclePassExpiry && <CyclePassStatus expiry={profile.cyclePassExpiry} />}
      {profile?.cyclePassExpired && <CyclePassExpiredNotice />}

      {/* Next-steps checklist */}
      {!allDone && (
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-5 h-5 text-teal-600" />
            <h2 className="font-semibold text-gray-900">Complete your profile</h2>
            <span className="ml-auto text-sm text-gray-400">{steps.filter(s => s.done).length}/{steps.length} done</span>
          </div>
          <ul className="space-y-2">
            {steps.map(step => (
              <li key={step.label} className="flex items-center gap-3 text-sm">
                {step.done
                  ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  : <Circle className="w-4 h-4 text-gray-300 shrink-0" />}
                <span className={step.done ? 'text-gray-400 line-through' : 'text-gray-700'}>{step.label}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-teal-600 hover:text-teal-800"
          >
            Go to My Profile <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>
      )}

      {/* Saved programs */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-rose-400" />
          <h2 className="font-semibold text-gray-900">Saved Programs</h2>
          <Link href="/programs" className="ml-auto text-sm text-teal-600 hover:underline">Browse all</Link>
        </div>

        {favPrograms.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Heart className="w-8 h-8 mx-auto mb-2 text-gray-200" />
            <p className="text-sm">You haven&apos;t saved any programs yet.</p>
            <p className="text-xs mt-1">Use the heart icon next to a program to add it to your list.</p>
            <Link
              href="/programs"
              className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-teal-600 hover:text-teal-800"
            >
              Browse programs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <CompareSelect
            variant="table"
            limit={compareLimit}
            items={favPrograms.map(p => ({
              id: p.id,
              university: p.university,
              urlSlug: p.urlSlug,
              state: p.state,
              tier: p.tier,
              fitStatus: p.fit.status,
              dataQuality: p.dataQuality,
            }))}
          />
        )}
      </section>

      {/* Custom lists (premium) */}
      {isPremium && namedLists.length > 0 && (
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ListChecks className="w-5 h-5 text-teal-600" />
            <h2 className="font-semibold text-gray-900">My Lists</h2>
            <Link href="/programs" className="ml-auto text-sm text-teal-600 hover:underline">Manage</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {namedLists.map(l => (
              <div key={l.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{l.name}</span>
                  <span className="text-xs text-gray-400">
                    {l.items.length} school{l.items.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {l.items.length > 0 && (
                  <CompareSelect
                    variant="list"
                    limit={compareLimit}
                    items={l.items.map(i => ({
                      id: i.program.id,
                      university: i.program.university,
                      urlSlug: i.program.urlSlug,
                    }))}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming deadlines (premium) */}
      {isPremium && upcomingDeadlines.length > 0 && (
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarClock className="w-5 h-5 text-teal-600" />
            <h2 className="font-semibold text-gray-900">Upcoming Deadlines</h2>
            <Link href="/deadlines" className="ml-auto text-sm text-teal-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {upcomingDeadlines.map(d => {
              const days = daysUntil(todayISO, d.deadlineDate)
              return (
                <div key={d.id} className="flex items-center justify-between gap-4 text-sm py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{d.university}</p>
                    {d.label && <p className="text-xs text-gray-500">{d.label}</p>}
                  </div>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${
                    days <= 7 ? 'bg-amber-100 text-amber-700' : days <= 30 ? 'bg-sky-100 text-sky-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {days === 0 ? 'Due today' : `${days} day${days !== 1 ? 's' : ''} left`}
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* School requests */}
      {schoolRequests.length > 0 && (
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <h2 className="font-semibold text-gray-900">Your School Requests</h2>
          </div>
          <div className="space-y-2">
            {schoolRequests.map(r => (
              <div key={r.id} className="flex items-start justify-between gap-4 text-sm py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{r.schoolName}</p>
                  <p className="text-gray-500">{r.city ? `${r.city}, ` : ''}{r.state} · {r.programType}</p>
                </div>
                <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full capitalize ${
                  r.status === 'added' ? 'bg-green-100 text-green-700'
                  : r.status === 'wont_add' ? 'bg-red-100 text-red-600'
                  : r.status === 'in_progress' ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-500'
                }`}>
                  {r.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upgrade nudge for free users with no requests section */}
      {profile?.tier === 'free' && (
        <div className="flex items-start gap-3 bg-teal-50 border border-teal-200 rounded-xl p-4 text-sm">
          <AlertCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-teal-900">Free tier: </span>
            <span className="text-teal-800">up to 2 saved programs.</span>
            {' '}
            <Link href="/pricing" className="font-semibold text-teal-700 hover:underline">
              Upgrade to Pro
            </Link>
            {' '}for unlimited favorites, full gap analysis, and more.
          </div>
        </div>
      )}
    </div>
  )
}
