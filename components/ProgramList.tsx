'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Heart, ChevronRight, Star } from 'lucide-react'
import FitBadge from '@/components/FitBadge'
import { toggleFavorite } from '@/app/actions/favorites'
import type { ScoredProgram, FitStatus } from '@/types'

type Props = {
  programs: ScoredProgram[]
  tier: 'free' | 'cycle'
}

const STATUS_OPTIONS: Array<FitStatus | 'All'> = ['All', 'Safe', 'Match', 'Reach', 'Not eligible']

export default function ProgramList({ programs, tier }: Props) {
  const [stateFilter, setStateFilter] = useState<'All' | 'AR' | 'TX'>('All')
  const [statusFilter, setStatusFilter] = useState<FitStatus | 'All'>('All')
  const [examFilter, setExamFilter] = useState<string>('All')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>(
    Object.fromEntries(programs.map(p => [p.id, p.isFavorite])),
  )
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const examTypes = ['All', ...Array.from(new Set(programs.map(p => p.examType ?? 'None')))]

  const filtered = programs.filter(p => {
    if (stateFilter !== 'All' && p.state !== stateFilter) return false
    if (statusFilter !== 'All' && p.fit.status !== statusFilter) return false
    if (examFilter !== 'All' && (p.examType ?? 'None') !== examFilter) return false
    if (favoritesOnly && !favoriteStates[p.id]) return false
    return true
  })

  function handleFavorite(programId: string) {
    startTransition(async () => {
      const result = await toggleFavorite(programId)
      if (result.error) {
        setToastMsg(result.error)
        setTimeout(() => setToastMsg(null), 4000)
      } else {
        setFavoriteStates(prev => ({ ...prev, [programId]: result.isFavorite }))
      }
    })
  }

  return (
    <div>
      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-center">
        <FilterGroup label="State">
          {(['All', 'AR', 'TX'] as const).map(s => (
            <FilterBtn key={s} active={stateFilter === s} onClick={() => setStateFilter(s)}>{s}</FilterBtn>
          ))}
        </FilterGroup>
        <FilterGroup label="Status">
          {STATUS_OPTIONS.map(s => (
            <FilterBtn key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>{s}</FilterBtn>
          ))}
        </FilterGroup>
        <FilterGroup label="Exam">
          {examTypes.map(e => (
            <FilterBtn key={e} active={examFilter === e} onClick={() => setExamFilter(e)}>{e}</FilterBtn>
          ))}
        </FilterGroup>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer ml-auto">
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={e => setFavoritesOnly(e.target.checked)}
            className="accent-teal-600"
          />
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          Favorites only
        </label>
      </div>

      {toastMsg && (
        <div className="mb-4 text-sm bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-2">
          {toastMsg}
        </div>
      )}

      {/* Program count */}
      <p className="text-sm text-gray-500 mb-3">
        Showing {filtered.length} of {programs.length} programs
      </p>

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No programs match the current filters.
          </div>
        ) : (
          filtered.map(program => (
            <div
              key={program.id}
              className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-start gap-4 hover:border-teal-300 transition-colors"
            >
              {/* Favorite button */}
              <button
                onClick={() => handleFavorite(program.id)}
                disabled={isPending}
                className="mt-0.5 shrink-0"
                title={favoriteStates[program.id] ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    favoriteStates[program.id] ? 'fill-rose-500 text-rose-500' : 'text-gray-300 hover:text-rose-400'
                  }`}
                />
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start gap-2 mb-1">
                  <span className="font-medium text-gray-900 truncate">{program.university}</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{program.state}</span>
                  {!program.isPublic && (
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">Private</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-2">{program.name} · {program.city}</p>
                <p className="text-sm text-gray-600 line-clamp-1">{program.fit.explanation}</p>
              </div>

              {/* Right side */}
              <div className="shrink-0 flex flex-col items-end gap-2">
                <FitBadge status={program.fit.status} />
                <Link
                  href={`/programs/${program.id}`}
                  className="text-xs text-teal-600 hover:text-teal-800 flex items-center gap-0.5"
                >
                  Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-gray-400 font-medium mr-1">{label}:</span>
      {children}
    </div>
  )
}

function FilterBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
        active
          ? 'bg-teal-600 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  )
}
