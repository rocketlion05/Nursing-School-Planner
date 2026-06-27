'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { Heart, ChevronRight, Search, Scale, X, ShieldCheck } from 'lucide-react'
import FitBadge from '@/components/FitBadge'
import { formatVerified } from '@/lib/verified'
import AddToListButton from '@/components/AddToListButton'
import UpgradeModal from '@/components/UpgradeModal'
import { toggleFavorite } from '@/app/actions/favorites'
import { addToList, removeFromList, createList } from '@/app/actions/lists'
import type { ListWithItems } from '@/app/actions/lists'
import type { ScoredProgram, FitStatus } from '@/types'
import { STATE_NAMES } from '@/lib/states'

type Props = {
  programs: ScoredProgram[]
  tier: 'free' | 'cycle'
  isAuthed: boolean
  isPremium: boolean
  lists: ListWithItems[]
  /** State codes from the user's profile preferences — powers the "Preferred States" view. */
  preferredStates: string[]
}

const STATUS_OPTIONS: Array<FitStatus | 'All'> = ['All', 'Safe', 'Match', 'Reach', 'Additional Steps Needed', 'Direct Admit', 'Unverified']
const VIEW_OPTIONS = ['All', 'Top US', 'Preferred States'] as const

const COMPARE_LIMIT_FREE = 2
const COMPARE_LIMIT_PREMIUM = 6

export default function ProgramList({ programs, isAuthed, isPremium, lists: initialLists, preferredStates }: Props) {
  const [query, setQuery] = useState('')
  const [stateFilter, setStateFilter] = useState('All')
  const [viewFilter, setViewFilter] = useState<(typeof VIEW_OPTIONS)[number]>('All')

  // Distinct states present in the data, sorted by full name — scales as we add states.
  const states = useMemo(
    () => Array.from(new Set(programs.map(p => p.state)))
      .sort((a, b) => (STATE_NAMES[a] ?? a).localeCompare(STATE_NAMES[b] ?? b)),
    [programs],
  )
  const [statusFilter, setStatusFilter] = useState<FitStatus | 'All'>('All')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>(
    Object.fromEntries(programs.map(p => [p.id, p.isFavorite])),
  )
  // Named (non-default) lists with their membership; the default "Saved" list is
  // driven by the heart and excluded here.
  const [namedLists, setNamedLists] = useState<ListWithItems[]>(
    initialLists.filter(l => !l.isDefault),
  )
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  // Upgrade modal shown when a free user hits a paid gate (favorites / compare).
  const [upgradeModal, setUpgradeModal] = useState<{ title: string; message: string } | null>(null)
  // Compare selection — ordered, client-only (no DB). Capped by tier.
  const [compareIds, setCompareIds] = useState<string[]>([])
  const compareLimit = isPremium ? COMPARE_LIMIT_PREMIUM : COMPARE_LIMIT_FREE

  const q = query.trim().toLowerCase()
  const filtered = programs.filter(p => {
    if (stateFilter !== 'All' && p.state !== stateFilter) return false
    if (viewFilter === 'Top US' && p.tier !== 'Top US') return false
    if (viewFilter === 'Preferred States' && !preferredStates.includes(p.state)) return false
    if (statusFilter !== 'All' && p.fit.status !== statusFilter) return false
    if (favoritesOnly && !favoriteStates[p.id]) return false
    if (q) {
      const haystack = `${p.university} ${p.name} ${p.city} ${p.state}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })

  function handleFavorite(programId: string) {
    if (!isAuthed) {
      setToastMsg('Log in to save programs to your favorites.')
      setTimeout(() => setToastMsg(null), 4000)
      return
    }
    startTransition(async () => {
      const result = await toggleFavorite(programId)
      if (result.limitReached) {
        // Free user hit the 2-favorite cap — surface the upgrade modal.
        setUpgradeModal({
          title: "You've saved 2 schools",
          message:
            "You've saved 2 schools. Upgrade to save unlimited programs and unlock your AI application plan.",
        })
      } else if (result.error) {
        setToastMsg(result.error)
        setTimeout(() => setToastMsg(null), 4000)
      } else {
        setFavoriteStates(prev => ({ ...prev, [programId]: result.isFavorite }))
      }
    })
  }

  function showError(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 4000)
  }

  function handleCompareToggle(programId: string) {
    if (compareIds.includes(programId)) {
      setCompareIds(prev => prev.filter(id => id !== programId))
      return
    }
    if (compareIds.length >= compareLimit) {
      if (isPremium) {
        showError(`You can compare up to ${COMPARE_LIMIT_PREMIUM} schools at once.`)
      } else {
        // Free user trying to select a 3rd school — show the upgrade modal.
        setUpgradeModal({
          title: 'Compare more schools',
          message: `Free accounts can compare ${COMPARE_LIMIT_FREE} schools at a time. Upgrade to compare up to ${COMPARE_LIMIT_PREMIUM} side by side.`,
        })
      }
      return
    }
    setCompareIds(prev => [...prev, programId])
  }

  function handleToggleList(programId: string, listId: string, shouldAdd: boolean) {
    // Optimistic membership update; revert on error.
    setNamedLists(prev =>
      prev.map(l =>
        l.id !== listId
          ? l
          : {
              ...l,
              programIds: shouldAdd
                ? [...l.programIds, programId]
                : l.programIds.filter(id => id !== programId),
            },
      ),
    )
    startTransition(async () => {
      const result = shouldAdd ? await addToList(listId, programId) : await removeFromList(listId, programId)
      if (result.error) {
        setNamedLists(prev =>
          prev.map(l =>
            l.id !== listId
              ? l
              : {
                  ...l,
                  programIds: shouldAdd
                    ? l.programIds.filter(id => id !== programId)
                    : [...l.programIds, programId],
                },
          ),
        )
        showError(result.error)
      }
    })
  }

  function handleCreateList(programId: string, name: string) {
    startTransition(async () => {
      const created = await createList(name)
      if (created.error || !created.id) {
        showError(created.error ?? 'Failed to create list.')
        return
      }
      const listId = created.id
      const add = await addToList(listId, programId)
      if (add.error) {
        showError(add.error)
        return
      }
      setNamedLists(prev => [...prev, { id: listId, name: name.trim(), isDefault: false, programIds: [programId] }])
    })
  }

  return (
    <div>
      {/* Search */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by school, program, or city…"
          className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-center">
        <FilterGroup label="State">
          <select
            value={stateFilter}
            onChange={e => setStateFilter(e.target.value)}
            className="border border-gray-300 rounded-full text-xs font-medium px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All states</option>
            {states.map(s => (
              <option key={s} value={s}>{STATE_NAMES[s] ?? s}</option>
            ))}
          </select>
        </FilterGroup>
        <FilterGroup label="Show">
          {VIEW_OPTIONS.map(t => (
            <FilterBtn key={t} active={viewFilter === t} onClick={() => setViewFilter(t)}>{t}</FilterBtn>
          ))}
        </FilterGroup>
        <FilterGroup label="Status">
          {STATUS_OPTIONS.map(s => (
            <FilterBtn key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>{s}</FilterBtn>
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
        <div className="mb-4 text-sm bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-2 flex items-center gap-2">
          <span>{toastMsg}</span>
          {!isAuthed && (
            <Link href="/login" className="font-semibold underline shrink-0">
              Log in
            </Link>
          )}
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
            {viewFilter === 'Preferred States' && preferredStates.length === 0 ? (
              <>
                You haven&apos;t chosen any preferred states yet.{' '}
                <Link href="/profile" className="text-teal-600 underline">Set them in your profile</Link> to use this filter.
              </>
            ) : (
              'No programs match the current filters.'
            )}
          </div>
        ) : (
          filtered.map(program => (
            <div
              key={program.id}
              className="bg-white border border-gray-200 rounded-xl px-4 sm:px-5 py-4 flex items-start gap-2 sm:gap-4 hover:border-teal-300 transition-colors"
            >
              {/* Favorite + list controls */}
              <div className="flex items-center gap-0.5 shrink-0 -ml-1">
                <button
                  onClick={() => handleFavorite(program.id)}
                  disabled={isPending}
                  className="shrink-0 p-2 rounded-md"
                  title={favoriteStates[program.id] ? 'Remove from saved' : 'Save program'}
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      favoriteStates[program.id] ? 'fill-rose-500 text-rose-500' : 'text-gray-300 hover:text-rose-400'
                    }`}
                  />
                </button>
                {isAuthed && isPremium && (
                  <AddToListButton
                    lists={namedLists.map(l => ({
                      id: l.id,
                      name: l.name,
                      hasProgram: l.programIds.includes(program.id),
                    }))}
                    disabled={isPending}
                    onToggleList={(listId, shouldAdd) => handleToggleList(program.id, listId, shouldAdd)}
                    onCreateList={name => handleCreateList(program.id, name)}
                  />
                )}
                <button
                  onClick={() => handleCompareToggle(program.id)}
                  className="shrink-0 p-2 rounded-md"
                  title={compareIds.includes(program.id) ? 'Remove from comparison' : 'Add to comparison'}
                  aria-pressed={compareIds.includes(program.id)}
                >
                  <Scale
                    className={`w-4 h-4 transition-colors ${
                      compareIds.includes(program.id)
                        ? 'text-teal-600'
                        : 'text-gray-300 hover:text-teal-500'
                    }`}
                  />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 leading-snug break-words mb-1.5">
                  {program.university}
                </h3>
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  {/* Fit badge sits with the tags on mobile; desktop shows it in the right column */}
                  <span className="sm:hidden">
                    <FitBadge status={program.fit.status} size="sm" />
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{program.state}</span>
                  {program.tier === 'Top US' && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Top US</span>
                  )}
                  {program.tier === 'Top TX' && (
                    <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">Top TX</span>
                  )}
                  {program.isFlagship && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">★ Flagship</span>
                  )}
                  {!program.isPublic && (
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">Private</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {program.name} · {program.city}
                  {program.lastVerifiedAt && (
                    <span className="ml-2 inline-flex items-center gap-1 text-xs text-green-700">
                      <ShieldCheck className="w-3 h-3" /> Verified {formatVerified(program.lastVerifiedAt)}
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2 sm:line-clamp-1">
                  {program.fit.status === 'No profile' && !isAuthed
                    ? 'Log in to see your fit for this program.'
                    : program.fit.explanation}
                </p>
                {program.dataQuality === 'placeholder' &&
                  (program.estimatedFields.length > 0 ? (
                    <p className="text-xs text-amber-600 mt-1 italic">
                      Based on estimated requirements. Open Details for the full breakdown.
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 mt-1 italic">
                      Requirements not fully verified. Check the school&apos;s website before applying.
                    </p>
                  ))}
                {/* Details link on mobile (desktop has it in the right column) */}
                <Link
                  href={`/programs/${program.urlSlug ?? program.id}`}
                  className="sm:hidden mt-2 inline-flex items-center gap-0.5 text-sm font-medium text-teal-600 hover:text-teal-800"
                >
                  Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Right side (desktop only) */}
              <div className="shrink-0 hidden sm:flex flex-col items-end gap-2">
                <FitBadge status={program.fit.status} />
                <Link
                  href={`/programs/${program.urlSlug ?? program.id}`}
                  className="text-xs text-teal-600 hover:text-teal-800 flex items-center gap-0.5"
                >
                  Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sticky compare bar — appears once at least one school is selected */}
      {compareIds.length >= 1 && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 bg-gray-900 text-white rounded-2xl shadow-xl px-4 py-3 max-w-2xl w-full sm:w-auto">
            <Scale className="w-4 h-4 text-teal-300 shrink-0" />
            <span className="text-sm font-medium whitespace-nowrap">
              {compareIds.length} selected
              <span className="text-gray-400 font-normal hidden sm:inline">
                {' '}/ up to {compareLimit}
              </span>
            </span>
            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setCompareIds([])}
                className="text-xs text-gray-300 hover:text-white flex items-center gap-1 px-2 py-1.5 rounded-md"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
              {compareIds.length >= 2 ? (
                <Link
                  href={`/compare?ids=${compareIds.join(',')}`}
                  className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  Compare
                </Link>
              ) : (
                <span className="text-xs text-gray-400 whitespace-nowrap">Pick 1 more</span>
              )}
            </div>
          </div>
        </div>
      )}

      <UpgradeModal
        open={upgradeModal !== null}
        onClose={() => setUpgradeModal(null)}
        title={upgradeModal?.title ?? ''}
        message={upgradeModal?.message ?? ''}
      />
    </div>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
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
