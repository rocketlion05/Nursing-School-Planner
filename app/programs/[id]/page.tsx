import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { getProfile } from '@/app/actions/profile'
import { computeFit } from '@/lib/scoring'
import { COURSE_MAP } from '@/lib/constants'
import Disclaimer from '@/components/Disclaimer'
import FitBadge from '@/components/FitBadge'
import JsonLd from '@/components/JsonLd'
import { ChevronLeft, CheckCircle, XCircle, Circle, AlertTriangle, ExternalLink, Users, Mail } from 'lucide-react'
import type { ProgramData } from '@/types'
import { SITE_URL } from '@/lib/seo'
import { summarizeOutcomes } from '@/lib/outcomes'
import { formatVerified } from '@/lib/verified'
import verificationLog from '@/prisma/verification-log.json'
import faqsData from '@/prisma/faqs.json'
import OutcomeForm from '@/components/OutcomeForm'

const VLOG = verificationLog as Record<string, string>
const FAQS = faqsData as Record<string, { q: string; a: string }[]>

// Resolve a program by its pretty urlSlug first, falling back to the raw cuid id
// (so old /programs/<cuid> links keep working).
function findProgram(idOrSlug: string) {
  return prisma.program.findFirst({ where: { OR: [{ urlSlug: idOrSlug }, { id: idOrSlug }] } })
}

export async function generateMetadata(props: PageProps<'/programs/[id]'>): Promise<Metadata> {
  const { id } = await props.params
  const program = await findProgram(id)
  if (!program) return {}

  const title = `${program.university} BSN Program Requirements`
  const description = `${program.name} at ${program.university} in ${program.city}, ${program.state}. View minimum GPA, entrance exam requirements, and prerequisites for the BSN nursing program.`
  const url = `${SITE_URL}/programs/${program.urlSlug ?? program.id}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
  }
}

const DQ_BADGE: Record<string, { label: string; cls: string }> = {
  verified: { label: 'Requirements verified', cls: 'bg-green-100 text-green-700' },
  partial: { label: 'Requirements partially verified, see note below', cls: 'bg-amber-100 text-amber-700' },
  placeholder: { label: 'Requirements not fully verified', cls: 'bg-gray-100 text-gray-500' },
}

export default async function ProgramDetailPage(props: PageProps<'/programs/[id]'>) {
  const { id } = await props.params
  const [raw, profile] = await Promise.all([
    findProgram(id),
    getProfile(),
  ])

  if (!raw) notFound()

  // Permanently redirect legacy cuid URLs to the pretty slug for clean, canonical URLs.
  if (raw.urlSlug && id !== raw.urlSlug) {
    permanentRedirect(`/programs/${raw.urlSlug}`)
  }

  const program: ProgramData = {
    ...raw,
    requiredCourses: JSON.parse(raw.requiredCourses) as string[],
    estimatedFields: JSON.parse(raw.estimatedFields) as string[],
    lastVerifiedAt: (raw.slug && VLOG[raw.slug]) || null,
  }

  const outcomeRows = await prisma.outcome.findMany({
    where: { programId: raw.id },
    select: { result: true, overallGPA: true, examType: true, examScore: true },
  })
  const stats = summarizeOutcomes(outcomeRows)

  const fit = computeFit(profile, program)
  const est = program.estimatedFields
  const hasEstimates = est.length > 0

  const allCourses = Object.entries(COURSE_MAP)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Programs', item: `${SITE_URL}/programs` },
      { '@type': 'ListItem', position: 3, name: program.university, item: `${SITE_URL}/programs/${program.urlSlug ?? program.id}` },
    ],
  }

  // Unique, data-grounded FAQ per school (prisma/faqs.json, keyed by slug) — makes
  // each program page distinct rather than a thin template, and emits FAQPage JSON-LD.
  const faqs = (raw.slug && FAQS[raw.slug]) || []
  const faqSchema = faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={breadcrumbSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <Link href="/programs" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to Programs
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{program.state}</span>
              {!program.isPublic && (
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">Private</span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{program.university}</h1>
            <p className="text-gray-500">{program.name} · {program.city}, {program.state}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {program.officialUrl && (
                <a
                  href={program.officialUrl}
                  target="_blank"
                  rel="noopener nofollow"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-200 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Visit official admissions page
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {program.admissionEmail && (
                <a
                  href={`mailto:${program.admissionEmail}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:border-teal-300 hover:text-teal-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email admissions
                </a>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <FitBadge status={fit.status} />
            {(() => {
              const dq =
                program.dataQuality === 'placeholder' && hasEstimates
                  ? { label: 'Includes estimated requirements', cls: 'bg-amber-100 text-amber-700' }
                  : (DQ_BADGE[program.dataQuality] ?? DQ_BADGE.placeholder)
              return (
                <span className={`text-xs px-2 py-0.5 rounded-full ${dq.cls}`}>{dq.label}</span>
              )
            })()}
            {program.lastVerifiedAt && (
              <span className="text-[11px] text-gray-500 inline-flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                Verified {formatVerified(program.lastVerifiedAt, true)}
              </span>
            )}
          </div>
        </div>
      </div>

      {program.dataQuality === 'placeholder' && hasEstimates && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong>About these numbers:</strong> {program.university} doesn&apos;t publish complete
            admission requirements publicly. Values marked <em>(reasonable estimate)</em> are
            approximated from comparable BSN programs (school type, selectivity, and region) so you
            can gauge your odds. It&apos;s the best picture possible short of contacting their
            admissions office directly. Treat your fit score as a guide, and confirm the real
            requirements with the school before applying.
          </span>
        </div>
      )}

      {program.dataQuality === 'placeholder' && !hasEstimates && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong>Exploratory estimate:</strong> requirements for this program are still being verified.
            Always check the school&apos;s official website before applying.
          </span>
        </div>
      )}

      {program.dataQuality === 'partial' && (
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong>Partially verified:</strong> not all official admission information for this program is publicly available.
            {hasEstimates
              ? ' Values marked (reasonable estimate) are approximated from comparable BSN programs, the best estimate possible without contacting the admissions office directly. '
              : ' The requirements shown represent the best reasonable estimate based on available sources. '}
            Always confirm details directly with the school before applying.
          </span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Program Requirements */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Program Requirements</h2>
          <dl className="space-y-3 text-sm">
            <Row label="Min. Overall GPA" value={program.minOverallGPA != null ? `${program.minOverallGPA.toFixed(2)}` : 'Not specified'} estimated={est.includes('minOverallGPA')} />
            <Row label="Min. Science GPA" value={program.minScienceGPA != null ? `${program.minScienceGPA.toFixed(2)}` : 'Not specified'} estimated={est.includes('minScienceGPA')} />
            <Row label="Entrance Exam" value={program.examType ?? 'None required'} estimated={est.includes('examType')} />
            <Row label="Min. Exam Score" value={program.minExamScore != null ? `${program.minExamScore}%` : 'Not specified'} estimated={est.includes('minExamScore')} />
            <Row label="CASPer Required" value={program.casperRequired ? 'Yes' : 'No'} />
            <Row label="Application Deadline" value={program.deadlines ?? 'Not specified'} />
            <Row label="Program Type" value={program.programType} />
          </dl>
          {program.notes && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-1">Notes</p>
              <p className="text-sm text-gray-600">{program.notes}</p>
            </div>
          )}
        </div>

        {/* Fit Analysis */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Your Fit</h2>
          {!profile ? (
            <div className="text-sm text-gray-500 py-4">
              <Link href="/profile" className="text-teal-600 underline">Complete your profile</Link> to see your fit analysis.
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">{fit.explanation}</p>
              {hasEstimates && (
                <p className="text-xs text-amber-700 mb-4 -mt-2">
                  Calculated partly from estimated requirements. See the note above.
                </p>
              )}
              {fit.gpaNote && (
                <div className="text-sm bg-gray-50 rounded-lg p-3 mb-3">
                  <span className="font-medium">GPA: </span>{fit.gpaNote}
                </div>
              )}
              {fit.examNote && (
                <div className="text-sm bg-gray-50 rounded-lg p-3 mb-3">
                  <span className="font-medium">Exam: </span>{fit.examNote}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Prerequisites checklist */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">
          Prerequisites
          {est.includes('requiredCourses') && (
            <span className="ml-2 text-xs font-normal text-amber-600">(reasonable estimate)</span>
          )}
        </h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {allCourses.map(([key, label]) => {
            const required = program.requiredCourses.includes(key)
            const completed = profile?.coursesCompleted.includes(key) ?? false

            if (!required) {
              return (
                <div key={key} className="flex items-center gap-2 text-sm text-gray-300 py-1">
                  <Circle className="w-4 h-4 shrink-0" />
                  <span className="line-through">{label}</span>
                  <span className="ml-auto text-xs">not required</span>
                </div>
              )
            }

            return (
              <div key={key} className={`flex items-center gap-2 text-sm py-1 ${completed ? 'text-green-700' : 'text-red-600'}`}>
                {completed
                  ? <CheckCircle className="w-4 h-4 shrink-0 text-green-500" />
                  : <XCircle className="w-4 h-4 shrink-0 text-red-400" />
                }
                <span>{label}</span>
                {!completed && <span className="ml-auto text-xs font-medium">missing</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* What to do next */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-teal-900 mb-3">What to Do Next</h2>
        <ul className="space-y-2">
          {fit.nextSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-teal-800">
              <span className="shrink-0 w-5 h-5 bg-teal-200 text-teal-800 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ul>
      </div>

      {/* Crowdsourced admission outcomes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-5 h-5 text-teal-600" />
          <h2 className="font-semibold text-gray-900">Real applicant outcomes</h2>
        </div>

        {stats.total === 0 ? (
          <p className="text-sm text-gray-500 mb-4">
            No outcomes reported yet for {program.university}. Be the first to share what it took, and
            help other applicants gauge their real odds.
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Based on {stats.total} self-reported outcome{stats.total === 1 ? '' : 's'} from applicants.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <Stat label="Admitted" value={stats.admitted} cls="text-green-700" />
              <Stat label="Waitlisted" value={stats.waitlisted} cls="text-amber-700" />
              <Stat label="Rejected" value={stats.rejected} cls="text-red-600" />
            </div>
            {(stats.admittedAvgGPA != null || stats.admittedAvgExam) && (
              <div className="text-sm bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4 text-teal-900">
                <span className="font-medium">Admitted students reported</span>
                {stats.admittedAvgGPA != null && <> an average GPA of <strong>{stats.admittedAvgGPA.toFixed(2)}</strong>{stats.admittedAvgExam ? '' : ` (n=${stats.admittedGpaN})`}</>}
                {stats.admittedAvgGPA != null && stats.admittedAvgExam && ' and'}
                {stats.admittedAvgExam && <> an average {stats.admittedAvgExam.type} of <strong>{stats.admittedAvgExam.avg}%</strong> (n={stats.admittedAvgExam.n})</>}
                .
              </div>
            )}
          </>
        )}

        <OutcomeForm programId={raw.id} />
      </div>

      {/* Unique per-school FAQ — distinct content + FAQPage structured data */}
      {faqs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Frequently asked questions about {program.university}&apos;s nursing program
          </h2>
          <div className="divide-y divide-gray-100">
            {faqs.map((f, i) => (
              <div key={i} className="py-3 first:pt-0 last:pb-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{f.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Disclaimer compact />
    </div>
  )
}

function Stat({ label, value, cls }: { label: string; value: number; cls: string }) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 text-center">
      <div className={`text-2xl font-bold ${cls}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  )
}

function Row({ label, value, estimated = false }: { label: string; value: string; estimated?: boolean }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-gray-900 font-medium text-right">
        {value}
        {estimated && (
          <span className="block text-xs font-normal text-amber-600">(reasonable estimate)</span>
        )}
      </dd>
    </div>
  )
}
