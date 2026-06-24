'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Calculator, Share2, ChevronRight, Sparkles, ImageDown } from 'lucide-react'
import type { ProgramData, FitStatus } from '@/types'
import { scorePrograms, computeGapSummary } from '@/lib/gap'
import { COURSE_MAP } from '@/lib/constants'

const ALL_COURSE_KEYS = Object.keys(COURSE_MAP)

const TILES: { status: FitStatus; label: string; cls: string }[] = [
  { status: 'Safe', label: 'Safe', cls: 'bg-green-50 border-green-200 text-green-800' },
  { status: 'Match', label: 'Match', cls: 'bg-blue-50 border-blue-200 text-blue-800' },
  { status: 'Reach', label: 'Reach', cls: 'bg-amber-50 border-amber-200 text-amber-800' },
  { status: 'Additional Steps Needed', label: 'Needs steps', cls: 'bg-red-50 border-red-200 text-red-700' },
]

function num(v: string): number | null {
  if (v.trim() === '') return null
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : null
}

export default function ChanceCalculator({ programs }: { programs: ProgramData[] }) {
  const [overall, setOverall] = useState('')
  const [science, setScience] = useState('')
  const [examType, setExamType] = useState<'none' | 'TEAS' | 'HESI A2'>('TEAS')
  const [examScore, setExamScore] = useState('')
  const [prereqsDone, setPrereqsDone] = useState(true)
  const [stateFilter, setStateFilter] = useState('All')
  const [submitted, setSubmitted] = useState(false)

  const states = useMemo(
    () => Array.from(new Set(programs.map(p => p.state))).sort(),
    [programs],
  )

  const result = useMemo(() => {
    const score = num(examScore)
    const profile = {
      id: 'calc', name: '', email: '', statePrefs: [], targetTerm: '',
      overallGPA: num(overall), scienceGPA: num(science), totalCredits: null,
      coursesCompleted: prereqsDone ? ALL_COURSE_KEYS : [],
      teasScore: examType === 'TEAS' ? score : null,
      hesiScore: examType === 'HESI A2' ? score : null,
      casperQuartile: null, casperPercentile: null,
      otherExamName: null, otherExamScore: null,
      tier: 'free' as const, premiumUntil: null,
    }
    const pool = stateFilter === 'All' ? programs : programs.filter(p => p.state === stateFilter)
    const scored = scorePrograms(profile, pool)
    const gap = computeGapSummary(profile, scored)
    const wins = scored
      .filter(p => p.fit.status === 'Safe' || p.fit.status === 'Match')
      .sort((a, b) => (a.fit.status === 'Safe' ? -1 : 1) - (b.fit.status === 'Safe' ? -1 : 1))
      .slice(0, 6)
    return { counts: gap.counts, total: pool.length, wins }
  }, [overall, science, examType, examScore, prereqsDone, stateFilter, programs])

  const canScore = num(overall) !== null

  function resultParams() {
    const c = result.counts
    const q = new URLSearchParams({
      safe: String(c.Safe), match: String(c.Match), reach: String(c.Reach),
      steps: String(c['Additional Steps Needed']),
    })
    if (stateFilter !== 'All') q.set('state', stateFilter)
    return q.toString()
  }
  const imagePath = `/chance-calculator/result-image?${resultParams()}`

  async function share() {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const url = `${origin}/chance-calculator?${resultParams()}`
    const text = `I checked my nursing school chances — I'm a Safe or Match for ${result.counts.Safe + result.counts.Match} BSN programs!`
    try {
      if (navigator.share) await navigator.share({ title: 'Nursing School Chances', text, url })
      else { await navigator.clipboard.writeText(url); alert('Share link copied!') }
    } catch { /* user dismissed */ }
  }

  return (
    <div>
      {/* Inputs */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Overall GPA (0.0–4.0)">
            <input inputMode="decimal" value={overall} onChange={e => setOverall(e.target.value)}
              placeholder="e.g. 3.4"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" />
          </Field>
          <Field label="Science GPA (optional)">
            <input inputMode="decimal" value={science} onChange={e => setScience(e.target.value)}
              placeholder="e.g. 3.2"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" />
          </Field>
          <Field label="Entrance exam">
            <select value={examType} onChange={e => setExamType(e.target.value as typeof examType)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none">
              <option value="TEAS">TEAS</option>
              <option value="HESI A2">HESI A2</option>
              <option value="none">Haven&apos;t taken one yet</option>
            </select>
          </Field>
          <Field label="Exam score (%)">
            <input inputMode="numeric" value={examScore} onChange={e => setExamScore(e.target.value)}
              disabled={examType === 'none'} placeholder="e.g. 75"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100 focus:ring-2 focus:ring-teal-500 focus:outline-none" />
          </Field>
          <Field label="State">
            <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none">
              <option value="All">All states</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm text-gray-600 sm:mt-7">
            <input type="checkbox" checked={prereqsDone} onChange={e => setPrereqsDone(e.target.checked)} className="accent-teal-600" />
            I&apos;ve completed (or am completing) the prerequisites
          </label>
        </div>

        <button
          onClick={() => setSubmitted(true)}
          disabled={!canScore}
          className="mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          <Calculator className="w-4 h-4" /> Calculate my chances
        </button>
        {!canScore && <p className="text-xs text-gray-400 mt-2">Enter at least your overall GPA to see results.</p>}
      </div>

      {/* Results */}
      {submitted && canScore && (
        <div className="mt-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="text-sm text-gray-500">
              Across <strong>{result.total}</strong> BSN program{result.total === 1 ? '' : 's'}
              {stateFilter !== 'All' ? ` in ${stateFilter}` : ''}:
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={imagePath}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 text-sm text-teal-700 hover:text-teal-900 font-medium"
                title="Open a shareable image of your result"
              >
                <ImageDown className="w-4 h-4" /> Save image
              </a>
              <button onClick={share} className="inline-flex items-center gap-1.5 text-sm text-teal-700 hover:text-teal-900 font-medium">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TILES.map(t => (
              <div key={t.status} className={`border rounded-xl p-4 text-center ${t.cls}`}>
                <div className="text-3xl font-bold">{result.counts[t.status]}</div>
                <div className="text-xs font-medium mt-1">{t.label}</div>
              </div>
            ))}
          </div>
          {result.counts.Unverified > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              {result.counts.Unverified} more program{result.counts.Unverified === 1 ? '' : 's'} don&apos;t publish enough
              requirements to score yet.
            </p>
          )}

          {result.wins.length > 0 && (
            <div className="mt-6">
              <h2 className="font-semibold text-gray-900 mb-2">Programs you&apos;re competitive for</h2>
              <div className="space-y-2">
                {result.wins.map(p => (
                  <Link key={p.id} href={`/programs/${p.urlSlug ?? p.id}`}
                    className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-teal-300">
                    <div className="min-w-0">
                      <span className="font-medium text-gray-900">{p.university}</span>
                      <span className="text-sm text-gray-500"> · {p.city}, {p.state}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${p.fit.status === 'Safe' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {p.fit.status}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-6 bg-gradient-to-br from-teal-50 to-white border border-teal-200 rounded-2xl p-5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">Want the full picture?</p>
              <p className="text-sm text-gray-600 mt-0.5">
                Create a free account to save schools, track deadlines, and see your exact gaps for every program — plus an AI application plan.
              </p>
              <Link href="/signup" className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-teal-700 hover:text-teal-900">
                Create your free account <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  )
}
