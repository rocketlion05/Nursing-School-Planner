'use client'

import { useState } from 'react'
import { track } from '@vercel/analytics'
import { CheckCircle, Loader2, Send } from 'lucide-react'
import { submitOutcome } from '@/app/actions/outcomes'

type Result = 'admitted' | 'waitlisted' | 'rejected'

function numOrNull(v: string): number | null {
  if (v.trim() === '') return null
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : null
}

export default function OutcomeForm({ programId }: { programId: string }) {
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<Result | ''>('')
  const [overallGPA, setOverallGPA] = useState('')
  const [scienceGPA, setScienceGPA] = useState('')
  const [examType, setExamType] = useState<'' | 'TEAS' | 'HESI A2' | 'NLN PAX'>('')
  const [examScore, setExamScore] = useState('')
  const [cycleYear, setCycleYear] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!result) { setError('Please pick your result.'); return }
    setStatus('loading'); setError(null)
    const res = await submitOutcome({
      programId,
      result,
      overallGPA: numOrNull(overallGPA),
      scienceGPA: numOrNull(scienceGPA),
      examType: examType || null,
      examScore: numOrNull(examScore),
      cycleYear: cycleYear ? parseInt(cycleYear, 10) : null,
    })
    if (!res.ok) { setError(res.error ?? 'Something went wrong.'); setStatus('error'); return }
    track('outcome_submitted', { result })
    setStatus('done')
  }

  if (status === 'done') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2 text-sm text-green-800">
        <CheckCircle className="w-5 h-5 shrink-0" />
        Thanks for sharing! Your outcome helps other applicants see what it really takes.
      </div>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-semibold text-teal-700 hover:text-teal-900 underline"
      >
        Applied here? Share your outcome →
      </button>
    )
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <p className="text-sm font-medium text-gray-900">Share your admission outcome (anonymous)</p>

      <div className="flex flex-wrap gap-2">
        {(['admitted', 'waitlisted', 'rejected'] as Result[]).map(r => (
          <button
            type="button"
            key={r}
            onClick={() => setResult(r)}
            className={`text-sm px-3 py-1.5 rounded-full border capitalize ${
              result === r ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-700 border-gray-300 hover:border-teal-300'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input inputMode="decimal" value={overallGPA} onChange={e => setOverallGPA(e.target.value)} placeholder="Overall GPA"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" />
        <input inputMode="decimal" value={scienceGPA} onChange={e => setScienceGPA(e.target.value)} placeholder="Science GPA (optional)"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" />
        <select value={examType} onChange={e => setExamType(e.target.value as typeof examType)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none">
          <option value="">Exam (optional)</option>
          <option value="TEAS">TEAS</option>
          <option value="HESI A2">HESI A2</option>
          <option value="NLN PAX">NLN PAX</option>
        </select>
        <input inputMode="numeric" value={examScore} onChange={e => setExamScore(e.target.value)} placeholder="Exam score %"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" />
        <input inputMode="numeric" value={cycleYear} onChange={e => setCycleYear(e.target.value)} placeholder="Year (e.g. 2026)"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-2">
        <button type="submit" disabled={status === 'loading'}
          className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg">
          {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Submit
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
      </div>
      <p className="text-xs text-gray-400">No names, no accounts, just the stats. Helps future applicants gauge their odds.</p>
    </form>
  )
}
