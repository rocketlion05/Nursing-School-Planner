'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import type { ProfileData, GapSummary, FitStatus } from '@/types'

export type ReportProgram = {
  university: string
  state: string
  status: FitStatus
  missingCount: number
  examNote: string | null
}

interface Props {
  profile: ProfileData
  gap: GapSummary
  programs: ReportProgram[]
}

// jsPDF's built-in Helvetica uses WinAnsi encoding; characters outside it (e.g. the
// ✓ in exam notes) render as garbage and mangle the whole text run. Map the common
// offenders to ASCII and drop anything else WinAnsi can't represent — while keeping
// the punctuation WinAnsi DOES support (em dash, bullet, smart quotes, …).
const WINANSI_EXTRA =
  '€‚ƒ„…†‡ˆ‰Š‹ŒŽ' +
  '‘’“”•–—˜™š›œžŸ·'

function clean(s: string): string {
  return s
    .replace(/\s*[✓✔]\s*/g, ' ')           // ✓ ✔ -> drop (meeting the min is implied)
    .replace(/[✗✘✕✖❌]/g, 'x') // ✗ ❌ -> x
    .replace(/≥/g, '>=')
    .replace(/≤/g, '<=')
    .replace(/→/g, '->')
    .replace(/[^\x00-\xFF]/g, ch => (WINANSI_EXTRA.includes(ch) ? ch : '')) // strip other non-Latin1
}

export default function GapReportButton({ profile, gap, programs }: Props) {
  const [loading, setLoading] = useState(false)

  async function generate() {
    setLoading(true)
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ unit: 'pt', format: 'letter' })
      const M = 56
      const W = doc.internal.pageSize.getWidth() - M * 2
      const PH = doc.internal.pageSize.getHeight()
      let y = M

      function guard(needed = 18) {
        if (y + needed > PH - M) { doc.addPage(); y = M }
      }

      function line(str: string, size: number, bold: boolean, rgb: [number, number, number]) {
        guard(size * 1.8)
        doc.setFontSize(size)
        doc.setFont('helvetica', bold ? 'bold' : 'normal')
        doc.setTextColor(...rgb)
        const wrapped = doc.splitTextToSize(clean(str), W) as string[]
        wrapped.forEach(l => { guard(size * 1.5); doc.text(l, M, y); y += size * 1.45 })
      }

      function section(title: string) {
        y += 12
        guard(22)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(13, 148, 136)
        doc.text(title.toUpperCase(), M, y)
        y += 5
        doc.setDrawColor(167, 243, 208)
        doc.setLineWidth(0.8)
        doc.line(M, y, M + W, y)
        y += 11
      }

      function kv(label: string, value: string) {
        guard(14)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(75, 85, 99)
        doc.text(`${label}:`, M, y)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(17, 24, 39)
        doc.text(clean(value), M + 115, y)
        y += 14
      }

      // Title
      doc.setFontSize(22)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(13, 148, 136)
      doc.text('Gap Analysis Report', M, y)
      y += 26
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(107, 114, 128)
      doc.text(
        clean(`${profile.name || 'Student'}  ·  Nursing School Planner  ·  ${new Date().toLocaleDateString()}`),
        M, y,
      )
      y += 8
      doc.setDrawColor(229, 231, 235)
      doc.setLineWidth(0.8)
      doc.line(M, y, M + W, y)
      y += 18

      // Profile
      section('Profile Summary')
      kv('Overall GPA', profile.overallGPA?.toFixed(2) ?? 'Not entered')
      kv('Science GPA', profile.scienceGPA?.toFixed(2) ?? 'Not entered')
      if (profile.teasScore !== null) kv('TEAS Score', `${profile.teasScore}%`)
      if (profile.hesiScore !== null) kv('HESI A2 Score', `${profile.hesiScore}%`)
      if (profile.casperQuartile !== null) kv('CASPer', `Quartile ${profile.casperQuartile}`)
      kv('Target Term', profile.targetTerm || 'Not set')
      kv('Courses Completed', String(profile.coursesCompleted.length))
      kv('State Preferences', profile.statePrefs.length ? profile.statePrefs.join(', ') : 'Any')

      // Fit counts
      section('Fit Summary')
      const statusOrder: FitStatus[] = ['Safe', 'Match', 'Reach', 'Additional Steps Needed', 'Unverified']
      statusOrder.forEach(s => {
        const c = gap.counts[s]
        if (c > 0) line(`${s}: ${c} program${c !== 1 ? 's' : ''}`, 10, false, [17, 24, 39])
      })

      // Recommendations
      if (gap.topRecommendations.length > 0) {
        section('Priority Recommendations')
        gap.topRecommendations.forEach((rec, i) => line(`${i + 1}. ${rec}`, 10, false, [17, 24, 39]))
      }

      // Missing prereqs
      if (gap.commonMissingCourses.length > 0) {
        section('Most Common Missing Prerequisites')
        gap.commonMissingCourses.forEach(c =>
          line(`• ${c.label}  (required by ${c.count} program${c.count !== 1 ? 's' : ''})`, 10, false, [17, 24, 39])
        )
      }

      // Exams
      if (gap.examsNeeded.length > 0) {
        section('Exams To Take / Retake')
        gap.examsNeeded.forEach(e => line(`• ${e}`, 10, false, [17, 24, 39]))
      }

      // Programs by status
      section('Programs: Fit Overview')
      const grouped = new Map<FitStatus, ReportProgram[]>()
      programs.forEach(p => {
        if (!grouped.has(p.status)) grouped.set(p.status, [])
        grouped.get(p.status)!.push(p)
      })

      const statusColors: Record<FitStatus, [number, number, number]> = {
        Safe: [4, 120, 87],
        Match: [29, 78, 216],
        Reach: [180, 83, 9],
        'Additional Steps Needed': [185, 28, 28],
        'No profile': [75, 85, 99],
        Unverified: [71, 85, 105],
      }

      const renderOrder: FitStatus[] = ['Safe', 'Match', 'Reach', 'Additional Steps Needed']
      renderOrder.forEach(status => {
        const group = grouped.get(status)
        if (!group || group.length === 0) return
        y += 6
        guard(14)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...statusColors[status])
        doc.text(clean(`${status} (${group.length})`), M, y)
        y += 13
        group.forEach(p => {
          const detail = p.missingCount > 0
            ? `missing ${p.missingCount} course${p.missingCount !== 1 ? 's' : ''}`
            : p.examNote ?? ''
          line(
            `  ${p.university}, ${p.state}${detail ? ': ' + detail : ''}`,
            9, false, [75, 85, 99],
          )
        })
      })

      const slug = profile.name?.toLowerCase().replace(/\s+/g, '-') || 'report'
      doc.save(`gap-analysis-${slug}.pdf`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={generate}
      disabled={loading}
      className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 transition-colors"
    >
      <Download className="w-4 h-4" />
      {loading ? 'Generating…' : 'Download PDF Report'}
    </button>
  )
}
