'use client'

import { useState, useTransition } from 'react'
import { saveProfile } from '@/app/actions/profile'
import type { ProfileData } from '@/types'
import { COURSES, US_STATES, TARGET_TERMS, EXAM_TYPES } from '@/lib/constants'
import ProfileSummary from '@/components/ProfileSummary'
import { Save, CheckCircle, AlertCircle } from 'lucide-react'

type Props = { initialProfile: ProfileData | null; userEmail: string }

function toStr(v: number | null | undefined): string {
  return v == null ? '' : String(v)
}

export default function ProfileForm({ initialProfile, userEmail }: Props) {
  const p = initialProfile

  const [name, setName] = useState(p?.name ?? '')
  const email = p?.email || userEmail
  const [statePrefs, setStatePrefs] = useState<string[]>(p?.statePrefs ?? [])
  const [targetTerm, setTargetTerm] = useState(p?.targetTerm ?? '')
  const [overallGPA, setOverallGPA] = useState(toStr(p?.overallGPA))
  const [scienceGPA, setScienceGPA] = useState(toStr(p?.scienceGPA))
  const [totalCredits, setTotalCredits] = useState(toStr(p?.totalCredits))
  const [coursesCompleted, setCoursesCompleted] = useState<string[]>(p?.coursesCompleted ?? [])
  const [teasScore, setTeasScore] = useState(toStr(p?.teasScore))
  const [hesiScore, setHesiScore] = useState(toStr(p?.hesiScore))
  const [casperQuartile, setCasperQuartile] = useState(toStr(p?.casperQuartile))
  const [casperPercentile, setCasperPercentile] = useState(toStr(p?.casperPercentile))
  const [otherExamName, setOtherExamName] = useState(p?.otherExamName ?? '')
  const [otherExamScore, setOtherExamScore] = useState(toStr(p?.otherExamScore))
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [isPending, startTransition] = useTransition()

  function toggleState(code: string) {
    setStatePrefs(prev =>
      prev.includes(code) ? prev.filter(s => s !== code) : [...prev, code],
    )
  }

  function toggleCourse(key: string) {
    setCoursesCompleted(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key],
    )
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveProfile({
        name,
        email,
        statePrefs,
        targetTerm,
        overallGPA,
        scienceGPA,
        totalCredits,
        coursesCompleted,
        teasScore,
        hesiScore,
        casperQuartile,
        casperPercentile,
        otherExamName,
        otherExamScore,
      })
      if (result.error) {
        setStatus('error')
        setErrorMsg(result.error)
      } else {
        setStatus('saved')
        setTimeout(() => setStatus('idle'), 3000)
      }
    })
  }

  const currentProfile: ProfileData = {
    id: p?.id ?? '',
    name, email: email, statePrefs, targetTerm,
    overallGPA: overallGPA ? parseFloat(overallGPA) : null,
    scienceGPA: scienceGPA ? parseFloat(scienceGPA) : null,
    totalCredits: totalCredits ? parseInt(totalCredits, 10) : null,
    coursesCompleted,
    teasScore: teasScore ? parseFloat(teasScore) : null,
    hesiScore: hesiScore ? parseFloat(hesiScore) : null,
    casperQuartile: casperQuartile ? parseInt(casperQuartile, 10) : null,
    casperPercentile: casperPercentile ? parseInt(casperPercentile, 10) : null,
    otherExamName: otherExamName || null,
    otherExamScore: otherExamScore ? parseFloat(otherExamScore) : null,
    tier: p?.tier ?? 'free',
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* ── Form ── */}
      <div className="lg:col-span-2 space-y-6">

        {/* Basic Info */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Basic Info</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name">
              <input className={input} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
            </Field>
            <Field label="Email">
              <div className="flex items-center gap-2">
                <input className={`${input} bg-gray-50 text-gray-500 cursor-default`} type="email" value={email} readOnly />
                <span className="text-xs text-gray-400 whitespace-nowrap">from your account</span>
              </div>
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="State preferences">
              <div className="flex gap-3 pt-1">
                {US_STATES.map(s => (
                  <label key={s.code} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={statePrefs.includes(s.code)}
                      onChange={() => toggleState(s.code)}
                      className="accent-teal-600"
                    />
                    <span className="text-sm">{s.label}</span>
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Target start term">
              <select className={input} value={targetTerm} onChange={e => setTargetTerm(e.target.value)}>
                <option value="">-- Select --</option>
                {TARGET_TERMS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>
        </section>

        {/* Academics */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Academics</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Overall GPA" hint="0.0 – 4.0">
              <input className={input} type="number" min="0" max="4" step="0.01" value={overallGPA} onChange={e => setOverallGPA(e.target.value)} placeholder="3.50" />
            </Field>
            <Field label="Science GPA" hint="0.0 – 4.0">
              <input className={input} type="number" min="0" max="4" step="0.01" value={scienceGPA} onChange={e => setScienceGPA(e.target.value)} placeholder="3.20" />
            </Field>
            <Field label="Total credits completed">
              <input className={input} type="number" min="0" max="200" value={totalCredits} onChange={e => setTotalCredits(e.target.value)} placeholder="60" />
            </Field>
          </div>
        </section>

        {/* Prerequisites */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <h2 className="font-semibold text-gray-900">Prerequisites Completed</h2>
          <p className="text-sm text-gray-500">Check all courses you have completed (or are currently enrolled in).</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {COURSES.map(c => (
              <label key={c.key} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={coursesCompleted.includes(c.key)}
                  onChange={() => toggleCourse(c.key)}
                  className="accent-teal-600 w-4 h-4"
                />
                <span className="text-sm group-hover:text-teal-700 transition-colors">{c.label}</span>
                <span className="text-xs text-gray-400 ml-auto">{c.group}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Exam Scores */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Entrance Exam Scores</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="TEAS overall score (%)" hint="0 – 100">
              <input className={input} type="number" min="0" max="100" step="0.1" value={teasScore} onChange={e => setTeasScore(e.target.value)} placeholder="75" />
            </Field>
            <Field label="HESI A2 overall score (%)" hint="0 – 100">
              <input className={input} type="number" min="0" max="100" step="0.1" value={hesiScore} onChange={e => setHesiScore(e.target.value)} placeholder="80" />
            </Field>
            <Field label="CASPer quartile" hint="1 – 4">
              <select className={input} value={casperQuartile} onChange={e => setCasperQuartile(e.target.value)}>
                <option value="">-- Not taken --</option>
                {[1, 2, 3, 4].map(q => <option key={q} value={q}>Q{q}</option>)}
              </select>
            </Field>
            <Field label="CASPer percentile" hint="0 – 100">
              <input className={input} type="number" min="0" max="100" value={casperPercentile} onChange={e => setCasperPercentile(e.target.value)} placeholder="65" />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <Field label="Other exam name" hint="Optional">
              <input className={input} value={otherExamName} onChange={e => setOtherExamName(e.target.value)} placeholder="NLN PAX" />
            </Field>
            <Field label="Other exam score (%)" hint="Optional">
              <input className={input} type="number" min="0" max="100" value={otherExamScore} onChange={e => setOtherExamScore(e.target.value)} placeholder="70" />
            </Field>
          </div>
        </section>

        {/* Save button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {isPending ? 'Saving…' : 'Save Profile'}
          </button>
          {status === 'saved' && (
            <span className="flex items-center gap-1.5 text-green-700 text-sm">
              <CheckCircle className="w-4 h-4" /> Saved!
            </span>
          )}
          {status === 'error' && (
            <span className="flex items-center gap-1.5 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" /> {errorMsg}
            </span>
          )}
        </div>
      </div>

      {/* ── Summary sidebar ── */}
      <div className="lg:col-span-1">
        <div className="sticky top-20">
          <ProfileSummary profile={currentProfile} />
        </div>
      </div>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {hint && <span className="ml-1 text-gray-400 font-normal">({hint})</span>}
      </label>
      {children}
    </div>
  )
}

const input = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
