import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'My Application Plan',
  robots: { index: false, follow: false },
}
import { prisma } from '@/lib/prisma'
import { getProfile } from '@/app/actions/profile'
import { scorePrograms, computeGapSummary, computeExamInsights, computeRetakeRecommendations } from '@/lib/gap'
import { requireUser } from '@/app/lib/dal'
import Disclaimer from '@/components/Disclaimer'
import FitBadge from '@/components/FitBadge'
import AIAdvisor from '@/components/AIAdvisor'
import LockedAIPlan from '@/components/LockedAIPlan'
import GapReportButton, { type ReportProgram } from '@/components/GapReportButton'
import WhatIfSimulator, { LockedWhatIf, type SimProgram } from '@/components/WhatIfSimulator'
import RetakeRecommendations from '@/components/RetakeRecommendations'
import type { ProgramData, FitStatus } from '@/types'
import { Target, AlertCircle, TrendingUp, BookOpen, FlaskConical } from 'lucide-react'

const STATUS_COLORS: Record<FitStatus, string> = {
  Safe: 'bg-green-100 text-green-800',
  Match: 'bg-blue-100 text-blue-800',
  Reach: 'bg-amber-100 text-amber-800',
  'Additional Steps Needed': 'bg-red-100 text-red-700',
  'No profile': 'bg-gray-100 text-gray-600',
  Unverified: 'bg-slate-100 text-slate-600',
}

export default async function PlanPage() {
  await requireUser()
  const profile = await getProfile()

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Application Plan</h1>
        <p className="text-gray-500 mb-6">Complete your profile to see your personalized gap analysis and recommendations.</p>
        <Link href="/profile" className="inline-block bg-teal-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition-colors">
          Complete My Profile
        </Link>
      </div>
    )
  }

  const rawPrograms = await prisma.program.findMany({ orderBy: [{ state: 'asc' }, { university: 'asc' }] })
  const programs: ProgramData[] = rawPrograms.map(p => ({
    ...p,
    requiredCourses: JSON.parse(p.requiredCourses) as string[],
    estimatedFields: JSON.parse(p.estimatedFields) as string[],
  }))

  const scored = scorePrograms(profile, programs)
  const gap = computeGapSummary(profile, scored)

  const isPremium = profile.tier === 'cycle'

  // Exam breakdown — premium only
  const examInsights = isPremium ? computeExamInsights(profile, scored) : []

  // Retake / GPA recommendations — premium only
  const retakeRecs = isPremium ? computeRetakeRecommendations(profile, scored) : []

  // Trimmed program arrays for client components
  const simPrograms: SimProgram[] = programs.map(p => ({
    id: p.id,
    minOverallGPA: p.minOverallGPA,
    minScienceGPA: p.minScienceGPA,
    examType: p.examType,
    minExamScore: p.minExamScore,
    casperRequired: p.casperRequired,
    requiredCourses: p.requiredCourses,
  }))

  const reportPrograms: ReportProgram[] = scored.map(p => ({
    university: p.university,
    state: p.state,
    status: p.fit.status,
    missingCount: p.fit.missingCourses.length,
    examNote: p.fit.examNote,
  }))

  const statuses: FitStatus[] = ['Safe', 'Match', 'Reach', 'Additional Steps Needed']

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Application Plan</h1>
          <p className="text-gray-500 mt-1">
            Based on your profile — {profile.name || 'your current stats'}.
          </p>
        </div>
        {isPremium && (
          <GapReportButton profile={profile} gap={gap} programs={reportPrograms} />
        )}
      </div>

      {/* AI academic advisor (chat) — Pro unlocks it; free users see a locked teaser */}
      {isPremium ? (
        <AIAdvisor studentName={profile.name} />
      ) : (
        <LockedAIPlan />
      )}

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {statuses.map(status => (
          <div key={status} className={`rounded-xl p-4 text-center ${STATUS_COLORS[status]}`}>
            <div className="text-3xl font-bold mb-1">{gap.counts[status]}</div>
            <div className="text-sm font-medium">{status}</div>
          </div>
        ))}
      </div>

      {/* Exam Score Breakdown — premium only, only shown when student has scores */}
      {examInsights.length > 0 && (
        <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical className="w-5 h-5 text-teal-600" />
            <h2 className="font-semibold text-gray-900">Exam Score Breakdown</h2>
          </div>
          <div className="space-y-3">
            {examInsights.map(insight => (
              <div key={insight.examType} className="rounded-lg bg-blue-50 border border-blue-100 p-4">
                <p className="font-semibold text-blue-900 mb-1 text-sm">
                  {insight.examType} — your score: {insight.yourScore}%
                </p>
                <p className="text-sm text-blue-800">
                  Meets the minimum for{' '}
                  <strong>{insight.programsMeetingMin} of {insight.programsRequiring}</strong>{' '}
                  programs that require {insight.examType}.
                </p>
                {insight.nextThresholdScore !== null && insight.programsUnlockedAtThreshold > 0 && (
                  <p className="text-sm text-blue-700 mt-1">
                    Scoring{' '}
                    <strong>{insight.nextThresholdScore}%+</strong>{' '}
                    would make you competitive at{' '}
                    <strong>
                      {insight.programsUnlockedAtThreshold} more program
                      {insight.programsUnlockedAtThreshold !== 1 ? 's' : ''}
                    </strong>.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Priority Recommendations */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-teal-600" />
          <h2 className="font-semibold text-gray-900">Priority Recommendations</h2>
        </div>
        {gap.topRecommendations.length === 0 ? (
          <p className="text-gray-500 text-sm">No recommendations yet — add more profile data.</p>
        ) : (
          <ul className="space-y-3">
            {gap.topRecommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="shrink-0 w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Missing prerequisites */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <h2 className="font-semibold text-gray-900">Most Common Missing Prerequisites</h2>
          </div>
          {gap.commonMissingCourses.length === 0 ? (
            <p className="text-sm text-green-700 font-medium">All common prerequisites are complete!</p>
          ) : (
            <ul className="space-y-2">
              {gap.commonMissingCourses.map(c => (
                <li key={c.key} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{c.label}</span>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                    {c.count} program{c.count !== 1 ? 's' : ''} require it
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Exams needed */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical className="w-5 h-5 text-teal-600" />
            <h2 className="font-semibold text-gray-900">Exams To Take / Retake</h2>
          </div>
          {gap.examsNeeded.length === 0 ? (
            <p className="text-sm text-green-700 font-medium">You meet all exam requirements for your target programs!</p>
          ) : (
            <ul className="space-y-2">
              {gap.examsNeeded.map(e => (
                <li key={e} className="flex items-center gap-2 text-sm text-gray-700">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  {e}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* What's Worth Your Time — premium only retake/GPA recommendations */}
      {isPremium && retakeRecs.length > 0 && (
        <RetakeRecommendations recommendations={retakeRecs} />
      )}

      {/* What-If Simulator — premium unlocks it; free users see locked teaser */}
      {isPremium ? (
        <WhatIfSimulator profile={profile} programs={simPrograms} />
      ) : (
        <LockedWhatIf />
      )}

      {/* Program table */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">All Programs — Fit Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="pb-2 font-medium text-gray-500">University</th>
                <th className="pb-2 font-medium text-gray-500">State</th>
                <th className="pb-2 font-medium text-gray-500">Status</th>
                <th className="pb-2 font-medium text-gray-500">Missing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {scored.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="py-2 pr-4">
                    <Link href={`/programs/${p.urlSlug ?? p.id}`} className="text-teal-600 hover:underline">
                      {p.university}
                    </Link>
                  </td>
                  <td className="py-2 pr-4 text-gray-500">{p.state}</td>
                  <td className="py-2 pr-4">
                    <FitBadge status={p.fit.status} size="sm" />
                  </td>
                  <td className="py-2 text-gray-500">
                    {p.fit.missingCourses.length > 0
                      ? `${p.fit.missingCourses.length} course(s)`
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Disclaimer compact />
    </div>
  )
}
