import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getProfile } from '@/app/actions/profile'
import { computeFit } from '@/lib/scoring'
import Disclaimer from '@/components/Disclaimer'
import FitBadge from '@/components/FitBadge'
import { ChevronLeft, Scale } from 'lucide-react'
import type { ProgramData, FitResult } from '@/types'

const COMPARE_LIMIT_FREE = 2
const COMPARE_LIMIT_PREMIUM = 6

const DQ_LABEL: Record<string, string> = {
  verified: 'Verified',
  partial: 'Partial',
  placeholder: 'Placeholder',
}

type CompareItem = { program: ProgramData; fit: FitResult }

type RowDef = {
  label: string
  render: (item: CompareItem) => React.ReactNode
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>
}) {
  const { ids } = await searchParams
  const requestedIds = (ids?.split(',').map(s => s.trim()).filter(Boolean)) ?? []

  const profile = await getProfile()
  const isPremium = profile?.tier === 'cycle'
  const limit = isPremium ? COMPARE_LIMIT_PREMIUM : COMPARE_LIMIT_FREE

  // Enforce the tier cap server-side too — a hand-crafted URL can't bypass it.
  const cappedIds = requestedIds.slice(0, limit)
  const wasTruncated = requestedIds.length > cappedIds.length

  const raw = cappedIds.length
    ? await prisma.program.findMany({ where: { id: { in: cappedIds } } })
    : []

  // Preserve the order the user selected schools in.
  const byId = new Map(raw.map(p => [p.id, p]))
  const items: CompareItem[] = cappedIds
    .map(id => byId.get(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map(p => {
      const program: ProgramData = { ...p, requiredCourses: JSON.parse(p.requiredCourses) as string[] }
      return { program, fit: computeFit(profile, program) }
    })

  const completed = new Set(profile?.coursesCompleted ?? [])

  const rows: RowDef[] = [
    {
      label: 'Your fit',
      render: ({ fit }) => <FitBadge status={fit.status} size="sm" />,
    },
    {
      label: 'Min. overall GPA',
      render: ({ program }) => (program.minOverallGPA != null ? program.minOverallGPA.toFixed(2) : 'None listed'),
    },
    {
      label: 'Min. science GPA',
      render: ({ program }) => (program.minScienceGPA != null ? program.minScienceGPA.toFixed(2) : 'None listed'),
    },
    {
      label: 'Entrance exam',
      render: ({ program }) =>
        program.examType
          ? `${program.examType}${program.minExamScore != null ? ` ${program.minExamScore}%` : ''}`
          : 'None',
    },
    {
      label: 'CASPer',
      render: ({ program }) => (program.casperRequired ? 'Yes' : 'No'),
    },
    {
      label: 'Prerequisites',
      render: ({ program }) => {
        const req = program.requiredCourses.length
        if (req === 0) return 'None listed'
        if (!profile) return `${req} required`
        const met = program.requiredCourses.filter(c => completed.has(c)).length
        return `${req} req / ${met} met`
      },
    },
    {
      label: 'Public / Private',
      render: ({ program }) => (program.isPublic ? 'Public' : 'Private'),
    },
    {
      label: 'Location',
      render: ({ program }) => `${program.city}, ${program.state}`,
    },
    {
      label: 'Data quality',
      render: ({ program }) => DQ_LABEL[program.dataQuality] ?? 'Placeholder',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/programs" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to Programs
      </Link>

      <div className="flex items-center gap-2 mb-1">
        <Scale className="w-6 h-6 text-teal-600" />
        <h1 className="text-2xl font-bold text-gray-900">Compare Programs</h1>
      </div>
      <p className="text-gray-500 mb-6">
        Side-by-side comparison of your selected schools
        {profile ? '.' : ' — complete your profile to see your fit for each.'}
      </p>

      {wasTruncated && (
        <div className="mb-6 text-sm bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3">
          {isPremium
            ? `You can compare up to ${COMPARE_LIMIT_PREMIUM} schools at once — showing the first ${COMPARE_LIMIT_PREMIUM}.`
            : (
              <>
                Free accounts can compare {COMPARE_LIMIT_FREE} schools.{' '}
                <Link href="/pricing" className="font-semibold underline">Upgrade</Link> to compare up to {COMPARE_LIMIT_PREMIUM}.
              </>
            )}
        </div>
      )}

      {items.length < 2 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
          <Scale className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium mb-1">Not enough programs to compare</p>
          <p className="text-sm text-gray-500 mb-5">
            Pick at least two schools using the compare button on the Programs page.
          </p>
          <Link
            href="/programs"
            className="inline-block bg-teal-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            Browse Programs
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left font-medium text-gray-400 p-4 align-bottom sticky left-0 bg-white z-10 min-w-[9rem]">
                  School
                </th>
                {items.map(({ program }) => (
                  <th key={program.id} className="text-left p-4 align-bottom min-w-[12rem]">
                    <Link
                      href={`/programs/${program.id}`}
                      className="font-semibold text-gray-900 hover:text-teal-600 hover:underline"
                    >
                      {program.university}
                    </Link>
                    <p className="text-xs text-gray-500 font-normal mt-0.5">{program.name}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map(row => (
                <tr key={row.label} className="hover:bg-gray-50">
                  <th
                    scope="row"
                    className="text-left font-medium text-gray-500 p-4 align-top sticky left-0 bg-white z-10"
                  >
                    {row.label}
                  </th>
                  {items.map(item => (
                    <td key={item.program.id} className="p-4 align-top text-gray-800">
                      {row.render(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8">
        <Disclaimer compact />
      </div>
    </div>
  )
}
