/**
 * Generates the free lead-magnet PDF (BSN Prerequisite & Application Checklist)
 * into public/downloads/. Re-run after editing the content below.
 *
 *   npx tsx scripts/make-lead-magnet.ts
 */
import { jsPDF } from 'jspdf'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { COURSE_MAP } from '../lib/constants'

const TEAL: [number, number, number] = [13, 148, 136]
const GRAY: [number, number, number] = [107, 114, 128]
const DARK: [number, number, number] = [17, 24, 39]

async function main() {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const margin = 56
  const width = doc.internal.pageSize.getWidth() - margin * 2
  const pageHeight = doc.internal.pageSize.getHeight()
  let y = margin

  const guard = (h: number) => { if (y + h > pageHeight - margin) { doc.addPage(); y = margin } }
  const heading = (t: string) => {
    guard(34); y += 8
    doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.setTextColor(...TEAL)
    doc.text(t, margin, y); y += 18
  }
  const para = (t: string) => {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(...DARK)
    for (const line of doc.splitTextToSize(t, width) as string[]) { guard(16); doc.text(line, margin, y); y += 15 }
    y += 4
  }
  const check = (t: string) => {
    guard(18)
    doc.setDrawColor(...TEAL); doc.setLineWidth(1); doc.rect(margin, y - 9, 11, 11)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(...DARK)
    for (const [i, line] of (doc.splitTextToSize(t, width - 22) as string[]).entries()) {
      if (i > 0) guard(15)
      doc.text(line, margin + 20, y); y += 15
    }
    y += 2
  }

  // Title
  doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.setTextColor(...DARK)
  doc.text('BSN Prerequisite & Application Checklist', margin, y); y += 24
  doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(...GRAY)
  doc.text('Everything you need to get into a nursing program — Nursing School Planner', margin, y); y += 24

  para('Use this checklist to stay on track for your BSN application. Requirements vary by school, so always confirm specifics on each program’s official admissions page.')

  heading('1. Prerequisite courses (earn a C or better — many want a B in sciences)')
  for (const label of Object.values(COURSE_MAP)) check(label as string)

  heading('2. GPA targets')
  check('Cumulative GPA at or above each program’s minimum (commonly 2.5–3.0)')
  check('Science / prerequisite GPA — often weighted most heavily; aim 3.0+')
  check('Recalculate your GPA after each semester and track it')

  heading('3. Entrance exam')
  check('Find out whether your schools require the TEAS, HESI A2, or no exam')
  check('Register early and study 4–6 weeks (aim well above the minimum)')
  check('Know each school’s minimum score and number of allowed attempts')

  heading('4. Application materials')
  check('Official transcripts from every college attended')
  check('Personal statement / essay (why nursing?)')
  check('Letters of recommendation (if required)')
  check('Immunization records, background check, CPR certification (often after acceptance)')
  check('Note whether the school uses NursingCAS or its own application')

  heading('5. Deadlines & timeline')
  check('List each program’s application deadline (Fall vs. Spring intake)')
  check('Mark priority deadlines — often months before the final deadline')
  check('Build a calendar working backward from the earliest deadline')

  heading('Next step')
  para('See exactly which programs you’re a Safe, Match, or Reach for — free at nursingschoolplanner.com/chance-calculator. Compare every BSN program and build your plan at nursingschoolplanner.com.')

  doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor(...GRAY)
  guard(14); doc.text('For planning purposes only — always verify requirements with each school. © Nursing School Planner', margin, y)

  const out = path.join(process.cwd(), 'public', 'downloads')
  await fs.mkdir(out, { recursive: true })
  const buf = Buffer.from(doc.output('arraybuffer'))
  await fs.writeFile(path.join(out, 'bsn-prerequisite-checklist.pdf'), buf)
  console.log(`Wrote public/downloads/bsn-prerequisite-checklist.pdf (${buf.length} bytes)`)
}

main().catch(e => { console.error(e); process.exit(1) })
