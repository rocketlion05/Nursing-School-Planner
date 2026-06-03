'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { submitSchoolRequest } from '@/app/actions/request-school'
import { CheckCircle, AlertCircle, Send } from 'lucide-react'

const input =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'

export default function RequestSchoolForm() {
  const [schoolName, setSchoolName] = useState('')
  const [university, setUniversity] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [programType, setProgramType] = useState('BSN')
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [needsUpgrade, setNeedsUpgrade] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    startTransition(async () => {
      const result = await submitSchoolRequest({
        schoolName, university, city, state, programType, reason,
      })
      if (result.ok) {
        setStatus('sent')
        setSchoolName(''); setUniversity(''); setCity(''); setState(''); setReason('')
      } else {
        setStatus('error')
        setErrorMsg(result.error ?? 'Something went wrong.')
        setNeedsUpgrade(Boolean(result.needsUpgrade))
      }
    })
  }

  if (status === 'sent') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
        <h2 className="font-semibold text-gray-900 mb-1">Request submitted — thank you!</h2>
        <p className="text-sm text-gray-500 mb-4">
          We&apos;ll review {university || 'the school'} and add it to the database.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-teal-600 font-medium text-sm hover:underline"
        >
          Request another school
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Program name">
          <input className={input} value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="e.g. Traditional BSN" />
        </Field>
        <Field label="University / school">
          <input className={input} value={university} onChange={e => setUniversity(e.target.value)} placeholder="e.g. Baylor University" />
        </Field>
        <Field label="City">
          <input className={input} value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Waco" />
        </Field>
        <Field label="State">
          <input className={input} value={state} onChange={e => setState(e.target.value)} placeholder="e.g. TX" maxLength={20} />
        </Field>
        <Field label="Degree type">
          <input className={input} value={programType} onChange={e => setProgramType(e.target.value)} placeholder="BSN" />
        </Field>
      </div>
      <Field label="Anything else? (optional)">
        <textarea className={`${input} min-h-20`} value={reason} onChange={e => setReason(e.target.value)} placeholder="A link to the program, why you'd like it added, etc." />
      </Field>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4" />
          {isPending ? 'Submitting…' : 'Submit request'}
        </button>
        {status === 'error' && (
          <span className="flex items-center gap-1.5 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" /> {errorMsg}
            {needsUpgrade && (
              <Link href="/pricing" className="underline font-medium">Upgrade</Link>
            )}
          </span>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  )
}
