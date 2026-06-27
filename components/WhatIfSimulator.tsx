'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { SlidersHorizontal } from 'lucide-react'
import { computeFit } from '@/lib/scoring'
import type { ProfileData, ProgramData, FitStatus } from '@/types'

// Only the fields computeFit actually reads — keeps HTML payload small
export type SimProgram = {
  id: string
  minOverallGPA: number | null
  minScienceGPA: number | null
  examType: string | null
  minExamScore: number | null
  casperRequired: boolean
  requiredCourses: string[]
}

const STATUS_ORDER: FitStatus[] = ['Safe', 'Match', 'Reach', 'Additional Steps Needed']

function Slider({
  label, value, min, max, step, format, onChange, original,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  format: (v: number) => string
  onChange: (v: number) => void
  original: number | null
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-teal-700 tabular-nums">{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full accent-teal-600 cursor-pointer"
      />
      {original !== null && (
        <p className="text-xs text-gray-400 mt-0.5">Your current: {format(original)}</p>
      )}
    </div>
  )
}

const STATUS_COLORS: Record<FitStatus, string> = {
  Safe: 'bg-green-50 text-green-800',
  Match: 'bg-blue-50 text-blue-800',
  Reach: 'bg-amber-50 text-amber-800',
  'Additional Steps Needed': 'bg-red-50 text-red-700',
  'No profile': 'bg-gray-50 text-gray-600',
  Unverified: 'bg-slate-50 text-slate-600',
  'Direct Admit': 'bg-indigo-50 text-indigo-700',
}

function tally(profile: ProfileData, programs: SimProgram[]) {
  const counts: Record<FitStatus, number> = {
    Safe: 0, Match: 0, Reach: 0, 'Additional Steps Needed': 0, 'No profile': 0, Unverified: 0, 'Direct Admit': 0,
  }
  programs.forEach(p => {
    counts[computeFit(profile, p as unknown as ProgramData).status]++
  })
  return counts
}

interface Props {
  profile: ProfileData
  programs: SimProgram[]
}

export default function WhatIfSimulator({ profile, programs }: Props) {
  const [gpa, setGpa] = useState(profile.overallGPA ?? 3.0)
  const [sciGpa, setSciGpa] = useState(profile.scienceGPA ?? 3.0)
  const [teas, setTeas] = useState(profile.teasScore ?? 70)
  const [hesi, setHesi] = useState(profile.hesiScore ?? 70)

  const hasTeasPrograms = programs.some(p => p.examType === 'TEAS')
  const hasHesiPrograms = programs.some(p => p.examType === 'HESI A2')

  const baseline = useMemo(() => tally(profile, programs), [profile, programs])

  const simulated = useMemo(() => {
    return tally(
      {
        ...profile,
        overallGPA: gpa,
        scienceGPA: sciGpa,
        teasScore: hasTeasPrograms ? teas : profile.teasScore,
        hesiScore: hasHesiPrograms ? hesi : profile.hesiScore,
      },
      programs,
    )
  }, [profile, programs, gpa, sciGpa, teas, hesi, hasTeasPrograms, hasHesiPrograms])

  const improvement =
    (simulated['Safe'] + simulated['Match']) - (baseline['Safe'] + baseline['Match'])

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-5">
        <SlidersHorizontal className="w-5 h-5 text-teal-600" />
        <h2 className="font-semibold text-gray-900">What-If Simulator</h2>
        <span className="text-xs text-gray-400 hidden sm:inline">
          drag to see how your fit changes
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5 mb-6">
        <Slider
          label="Overall GPA" value={gpa} min={2.0} max={4.0} step={0.05}
          format={v => v.toFixed(2)} onChange={setGpa} original={profile.overallGPA}
        />
        <Slider
          label="Science GPA" value={sciGpa} min={2.0} max={4.0} step={0.05}
          format={v => v.toFixed(2)} onChange={setSciGpa} original={profile.scienceGPA}
        />
        {hasTeasPrograms && (
          <Slider
            label="TEAS Score" value={teas} min={40} max={100} step={1}
            format={v => `${v}%`} onChange={setTeas} original={profile.teasScore}
          />
        )}
        {hasHesiPrograms && (
          <Slider
            label="HESI A2 Score" value={hesi} min={40} max={100} step={1}
            format={v => `${v}%`} onChange={setHesi} original={profile.hesiScore}
          />
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {STATUS_ORDER.map(s => {
          const delta = simulated[s] - baseline[s]
          return (
            <div key={s} className={`rounded-xl p-3 text-center ${STATUS_COLORS[s]}`}>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-2xl font-bold leading-none">{simulated[s]}</span>
                {delta !== 0 && (
                  <span className={`text-xs font-semibold leading-none ${delta > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {delta > 0 ? `+${delta}` : delta}
                  </span>
                )}
              </div>
              <div className="text-xs font-medium mt-1">{s}</div>
            </div>
          )
        })}
      </div>

      {improvement > 0 && (
        <p className="text-xs text-teal-700 font-medium mt-3">
          ✦ {improvement} more program{improvement !== 1 ? 's' : ''} would be Safe or Match with these stats.
        </p>
      )}
      {improvement < 0 && (
        <p className="text-xs text-amber-600 font-medium mt-3">
          These stats would reduce your Safe/Match count by {Math.abs(improvement)}.
        </p>
      )}
    </section>
  )
}

/** Locked teaser shown to free users */
export function LockedWhatIf() {
  return (
    <div className="relative mb-6">
      <div className="blur-sm pointer-events-none select-none" aria-hidden>
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <SlidersHorizontal className="w-5 h-5 text-gray-300" />
            <span className="font-semibold text-gray-300">What-If Simulator</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-8 mb-6">
            {[1, 2].map(i => (
              <div key={i}>
                <div className="h-3 w-32 bg-gray-100 rounded mb-3" />
                <div className="h-2 w-full bg-gray-100 rounded" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {['bg-green-50', 'bg-blue-50', 'bg-amber-50', 'bg-red-50'].map((c, i) => (
              <div key={i} className={`rounded-xl p-3 text-center ${c}`}>
                <div className="h-6 w-6 bg-gray-200 rounded mx-auto mb-1" />
                <div className="h-2 w-12 bg-gray-200 rounded mx-auto" />
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-6 py-5 text-center max-w-xs">
          <SlidersHorizontal className="w-5 h-5 text-teal-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-900 mb-1">What-If Simulator</p>
          <p className="text-xs text-gray-500 mb-3">
            See how your fit scores change if you improve your GPA or exam scores
          </p>
          <Link
            href="/pricing"
            className="inline-block text-xs font-semibold text-white bg-teal-600 px-4 py-1.5 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Upgrade to unlock
          </Link>
        </div>
      </div>
    </div>
  )
}
