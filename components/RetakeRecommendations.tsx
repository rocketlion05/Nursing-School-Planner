import { Zap } from 'lucide-react'
import type { RetakeRecommendation } from '@/types'

const PRIORITY_BADGE: Record<RetakeRecommendation['priority'], { label: string; cls: string }> = {
  high: { label: 'High impact', cls: 'bg-rose-100 text-rose-700' },
  medium: { label: 'Worth it', cls: 'bg-amber-100 text-amber-700' },
  low: { label: 'Good news', cls: 'bg-green-100 text-green-700' },
}

const PRIORITY_DOT: Record<RetakeRecommendation['priority'], string> = {
  high: 'bg-rose-500',
  medium: 'bg-amber-500',
  low: 'bg-green-500',
}

/**
 * Premium card on /plan: prioritized advice on whether retaking exams or
 * improving GPA / prerequisites is worth the student's time. Shows the top 3.
 */
export default function RetakeRecommendations({ recommendations }: { recommendations: RetakeRecommendation[] }) {
  if (recommendations.length === 0) return null

  const top = recommendations.slice(0, 3)

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Zap className="w-5 h-5 text-teal-600" />
        <h2 className="font-semibold text-gray-900">What&apos;s Worth Your Time</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Where to focus next, ranked by how many programs each move unlocks.
      </p>
      <ul className="space-y-3">
        {top.map((rec, i) => {
          const badge = PRIORITY_BADGE[rec.priority]
          return (
            <li
              key={i}
              className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
            >
              <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${PRIORITY_DOT[rec.priority]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">{rec.message}</p>
              </div>
              <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
                {badge.label}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
