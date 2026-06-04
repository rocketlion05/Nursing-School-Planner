'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Sparkles, RefreshCw, Download, AlertCircle } from 'lucide-react'

type Status = 'idle' | 'streaming' | 'done' | 'error'

export default function AIPlan({ studentName }: { studentName: string }) {
  const [text, setText] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const startedRef = useRef(false)

  const generate = useCallback(async () => {
    setStatus('streaming')
    setError(null)
    setText('')
    try {
      const res = await fetch('/api/ai-plan', { method: 'POST' })
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Could not generate your plan. Please try again.')
        setStatus('error')
        return
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setText(acc)
      }
      setStatus('done')
    } catch {
      setError('Network error while generating your plan. Please try again.')
      setStatus('error')
    }
  }, [])

  // Auto-generate on first view.
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    generate()
  }, [generate])

  const downloadPdf = useCallback(async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'pt', format: 'letter' })
    const margin = 56
    const width = doc.internal.pageSize.getWidth() - margin * 2
    const pageHeight = doc.internal.pageSize.getHeight()
    let y = margin

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.setTextColor(13, 148, 136) // teal-600
    doc.text('Your AI Application Plan', margin, y)
    y += 22

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(107, 114, 128) // gray-500
    const subtitle = `${studentName ? studentName + ' — ' : ''}Nursing School Planner · ${new Date().toLocaleDateString()}`
    doc.text(subtitle, margin, y)
    y += 24

    doc.setFontSize(11)
    doc.setTextColor(17, 24, 39) // gray-900
    // Strip lightweight markdown for a clean printed document.
    const plain = text
      .replace(/^#{1,6}\s*/gm, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/^\s*[-*•]\s+/gm, '• ')
    const lines = doc.splitTextToSize(plain, width) as string[]
    for (const line of lines) {
      if (y > pageHeight - margin) {
        doc.addPage()
        y = margin
      }
      doc.text(line, margin, y)
      y += 16
    }

    doc.save('nursing-application-plan.pdf')
  }, [text, studentName])

  return (
    <section className="bg-gradient-to-br from-teal-50 to-white rounded-2xl border border-teal-200 p-6 mb-8">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-bold text-gray-900">Your AI Application Plan</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={generate}
            disabled={status === 'streaming'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-teal-700 bg-white border border-teal-200 hover:bg-teal-50 disabled:opacity-50 transition-colors"
            title="Regenerate plan"
          >
            <RefreshCw className={`w-4 h-4 ${status === 'streaming' ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Regenerate plan</span>
          </button>
          <button
            onClick={downloadPdf}
            disabled={status !== 'done' || !text}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-40 transition-colors"
            title="Download as PDF"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : status === 'streaming' && !text ? (
        <p className="text-sm text-gray-500 animate-pulse">
          Building your personalized semester-by-semester plan…
        </p>
      ) : (
        <PlanContent text={text} streaming={status === 'streaming'} />
      )}

      <p className="text-xs text-gray-400 mt-4">
        AI-generated guidance based on your profile and saved schools. Always confirm
        deadlines and requirements with each program.
      </p>
    </section>
  )
}

/** Lightweight renderer for the plan's markdown-ish output (headings, bullets, bold). */
function PlanContent({ text, streaming }: { text: string; streaming: boolean }) {
  const lines = text.split('\n')
  return (
    <div className="text-sm text-gray-800 leading-relaxed space-y-1.5">
      {lines.map((raw, i) => {
        const line = raw.trimEnd()
        if (!line.trim()) return <div key={i} className="h-1.5" />

        const heading = line.match(/^(#{1,6})\s+(.*)$/)
        if (heading) {
          return (
            <h3 key={i} className="font-semibold text-gray-900 mt-3 first:mt-0">
              {renderInline(heading[2])}
            </h3>
          )
        }

        const bullet = line.match(/^\s*[-*•]\s+(.*)$/)
        if (bullet) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-teal-500 mt-0.5">•</span>
              <span>{renderInline(bullet[1])}</span>
            </div>
          )
        }

        const numbered = line.match(/^\s*(\d+)\.\s+(.*)$/)
        if (numbered) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="font-semibold text-teal-700">{numbered[1]}.</span>
              <span>{renderInline(numbered[2])}</span>
            </div>
          )
        }

        return <p key={i}>{renderInline(line)}</p>
      })}
      {streaming && <span className="inline-block w-2 h-4 bg-teal-400 animate-pulse align-middle" />}
    </div>
  )
}

/** Renders **bold** segments within a line. */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/)
    if (bold) return <strong key={i} className="font-semibold text-gray-900">{bold[1]}</strong>
    return <span key={i}>{part}</span>
  })
}
