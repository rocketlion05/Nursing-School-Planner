// Aggregates self-reported admission outcomes into displayable stats.

export type OutcomeRow = {
  result: string
  overallGPA: number | null
  examType: string | null
  examScore: number | null
}

export type OutcomeStats = {
  total: number
  admitted: number
  waitlisted: number
  rejected: number
  admittedAvgGPA: number | null
  admittedGpaN: number
  admittedAvgExam: { type: string; avg: number; n: number } | null
}

function mean(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length
}

export function summarizeOutcomes(rows: OutcomeRow[]): OutcomeStats {
  const admittedRows = rows.filter(r => r.result === 'admitted')

  const gpas = admittedRows.map(r => r.overallGPA).filter((v): v is number => v != null)
  const admittedAvgGPA = gpas.length ? Math.round(mean(gpas) * 100) / 100 : null

  // Average the exam score for the most-reported exam type among admits.
  const byType = new Map<string, number[]>()
  for (const r of admittedRows) {
    if (r.examType && r.examScore != null) {
      if (!byType.has(r.examType)) byType.set(r.examType, [])
      byType.get(r.examType)!.push(r.examScore)
    }
  }
  let admittedAvgExam: OutcomeStats['admittedAvgExam'] = null
  for (const [type, scores] of byType) {
    if (!admittedAvgExam || scores.length > admittedAvgExam.n) {
      admittedAvgExam = { type, avg: Math.round(mean(scores) * 10) / 10, n: scores.length }
    }
  }

  return {
    total: rows.length,
    admitted: admittedRows.length,
    waitlisted: rows.filter(r => r.result === 'waitlisted').length,
    rejected: rows.filter(r => r.result === 'rejected').length,
    admittedAvgGPA,
    admittedGpaN: gpas.length,
    admittedAvgExam,
  }
}
