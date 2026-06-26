'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Scale } from 'lucide-react'
import FitBadge from '@/components/FitBadge'
import type { FitStatus } from '@/types'

export type CompareItem = {
  id: string
  university: string
  urlSlug: string | null
  state?: string
  tier?: string
  fitStatus?: FitStatus
  dataQuality?: string
}

const DQ_LABELS: Record<string, string> = {
  verified: 'Verified',
  partial: 'Partially verified',
  placeholder: 'Unverified',
}
const DQ_COLORS: Record<string, string> = {
  verified: 'bg-green-100 text-green-700',
  partial: 'bg-amber-100 text-amber-700',
  placeholder: 'bg-gray-100 text-gray-500',
}

/**
 * Lets the user tick the specific schools they want to compare (rather than
 * comparing the whole list at once) and jump to /compare with just those.
 * `variant="table"` is the dashboard Saved Programs table; `variant="list"` is a
 * named list's schools. Selection is capped at `limit` (the compare page's tier cap).
 */
export default function CompareSelect({
  items,
  limit,
  variant,
}: {
  items: CompareItem[]
  limit: number
  variant: 'table' | 'list'
}) {
  const [selected, setSelected] = useState<string[]>([])
  const atLimit = selected.length >= limit

  function toggle(id: string) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length >= limit ? prev : [...prev, id],
    )
  }

  const canCompare = selected.length >= 2

  const toolbar = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-3">
      <span className="text-xs text-gray-500">
        {selected.length > 0 ? `${selected.length} selected` : 'Tick schools to compare'}
        {atLimit && <span className="text-gray-400"> (up to {limit} at a time)</span>}
      </span>
      {canCompare ? (
        <Link
          href={`/compare?ids=${selected.join(',')}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md px-3 py-1.5 transition-colors"
        >
          <Scale className="w-3.5 h-3.5" /> Compare {selected.length}
        </Link>
      ) : (
        <span
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-400 bg-gray-100 rounded-md px-3 py-1.5"
          title="Select at least 2 schools"
        >
          <Scale className="w-3.5 h-3.5" /> Compare
        </span>
      )}
    </div>
  )

  if (variant === 'list') {
    return (
      <div className="mt-2">
        <ul className="space-y-1 mb-2">
          {items.map(it => {
            const checked = selected.includes(it.id)
            return (
              <li key={it.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(it.id)}
                  disabled={!checked && atLimit}
                  className="accent-teal-600 shrink-0"
                  aria-label={`Select ${it.university} to compare`}
                />
                <Link href={`/programs/${it.urlSlug ?? it.id}`} className="text-teal-600 hover:underline">
                  {it.university}
                </Link>
              </li>
            )
          })}
        </ul>
        {items.length >= 2 && toolbar}
      </div>
    )
  }

  return (
    <div>
      {items.length >= 2 && toolbar}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="pb-2 w-8" aria-label="Select" />
              <th className="pb-2 font-medium text-gray-500">Program</th>
              <th className="pb-2 font-medium text-gray-500">State</th>
              <th className="pb-2 font-medium text-gray-500">Tier</th>
              <th className="pb-2 font-medium text-gray-500">Fit</th>
              <th className="pb-2 font-medium text-gray-500">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map(p => {
              const checked = selected.includes(p.id)
              return (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="py-2 pr-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(p.id)}
                      disabled={!checked && atLimit}
                      className="accent-teal-600"
                      aria-label={`Select ${p.university} to compare`}
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <Link href={`/programs/${p.urlSlug ?? p.id}`} className="text-teal-600 hover:underline font-medium">
                      {p.university}
                    </Link>
                  </td>
                  <td className="py-2 pr-4 text-gray-500">{p.state}</td>
                  <td className="py-2 pr-4 text-gray-500">{p.tier}</td>
                  <td className="py-2 pr-4">
                    {p.fitStatus && <FitBadge status={p.fitStatus} size="sm" />}
                  </td>
                  <td className="py-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${DQ_COLORS[p.dataQuality ?? ''] ?? 'bg-gray-100 text-gray-500'}`}>
                      {DQ_LABELS[p.dataQuality ?? ''] ?? p.dataQuality}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
