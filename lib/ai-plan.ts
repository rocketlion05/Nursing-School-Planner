import type { ProfileData, ScoredProgram, GapSummary } from '@/types'
import { COURSE_MAP, US_STATES } from '@/lib/constants'

/** OpenAI model — gpt-4o-mini for cost efficiency. */
export const AI_PLAN_MODEL = 'gpt-4o-mini'

export const AI_PLAN_SYSTEM_PROMPT =
  "You are a nursing school admissions advisor. Based on the student's academic " +
  'profile and target schools, generate a realistic semester-by-semester action ' +
  'plan. Be specific, practical, and encouraging. Include: which courses to take ' +
  'each term, when to register for and take TEAS/HESI, when to apply to each ' +
  'school, and 3 top priority actions for right now. Keep it under 400 words.'

function fmtGpa(n: number | null): string {
  return n === null ? 'not provided' : n.toFixed(2)
}

function stateLabel(code: string): string {
  return US_STATES.find(s => s.code === code)?.label ?? code
}

/**
 * Builds the structured, per-student context block that gets sent as the user
 * message. Kept separate from the API call so it stays easy to test and tweak.
 */
export function buildPlanContext(
  profile: ProfileData,
  favorites: ScoredProgram[],
  gap: GapSummary,
): string {
  const lines: string[] = []

  lines.push('STUDENT PROFILE')
  lines.push(`- Name: ${profile.name || 'Not provided'}`)
  lines.push(
    `- Target application term: ${profile.targetTerm || 'Not decided yet'}`,
  )
  lines.push(
    `- Preferred states: ${
      profile.statePrefs.length ? profile.statePrefs.map(stateLabel).join(', ') : 'No preference'
    }`,
  )
  lines.push(`- Overall GPA: ${fmtGpa(profile.overallGPA)}`)
  lines.push(`- Science (BCP) GPA: ${fmtGpa(profile.scienceGPA)}`)
  lines.push(
    `- Total college credits earned: ${profile.totalCredits ?? 'not provided'}`,
  )

  const completed = profile.coursesCompleted.map(k => COURSE_MAP[k] ?? k)
  lines.push(
    `- Prerequisites completed: ${completed.length ? completed.join(', ') : 'None yet'}`,
  )

  const allCourseKeys = Object.keys(COURSE_MAP)
  const remaining = allCourseKeys
    .filter(k => !profile.coursesCompleted.includes(k))
    .map(k => COURSE_MAP[k])
  lines.push(
    `- Prerequisites still needed: ${remaining.length ? remaining.join(', ') : 'None — all common prereqs done'}`,
  )

  // Entrance exams / Casper
  const exams: string[] = []
  exams.push(`TEAS: ${profile.teasScore !== null ? `${profile.teasScore}%` : 'not taken'}`)
  exams.push(`HESI A2: ${profile.hesiScore !== null ? `${profile.hesiScore}%` : 'not taken'}`)
  if (profile.otherExamName) {
    exams.push(
      `${profile.otherExamName}: ${profile.otherExamScore !== null ? profile.otherExamScore : 'not taken'}`,
    )
  }
  if (profile.casperQuartile !== null || profile.casperPercentile !== null) {
    const casper = [
      profile.casperQuartile !== null ? `quartile ${profile.casperQuartile}` : null,
      profile.casperPercentile !== null ? `${profile.casperPercentile}th percentile` : null,
    ]
      .filter(Boolean)
      .join(', ')
    exams.push(`CASPer: ${casper}`)
  } else {
    exams.push('CASPer: not taken')
  }
  lines.push(`- Entrance exams: ${exams.join('; ')}`)

  // Target (favorited) schools
  lines.push('')
  lines.push('TARGET SCHOOLS (the student saved these as favorites)')
  if (favorites.length === 0) {
    lines.push('- None saved yet. Recommend the student favorite some programs to target.')
  } else {
    favorites.forEach(p => {
      const reqs: string[] = []
      if (p.minOverallGPA !== null) reqs.push(`min GPA ${p.minOverallGPA.toFixed(2)}`)
      if (p.minScienceGPA !== null) reqs.push(`min science GPA ${p.minScienceGPA.toFixed(2)}`)
      if (p.examType) reqs.push(`${p.examType}${p.minExamScore !== null ? ` ≥ ${p.minExamScore}%` : ''}`)
      if (p.casperRequired) reqs.push('CASPer required')
      if (p.deadlines) reqs.push(`deadlines: ${p.deadlines}`)
      const reqStr = reqs.length ? ` — requirements: ${reqs.join(', ')}` : ' — requirements not published'
      lines.push(
        `- ${p.university} (${p.city}, ${p.state}) [current fit: ${p.fit.status}]${reqStr}`,
      )
    })
  }

  // Gap summary signals
  lines.push('')
  lines.push('FIT SUMMARY ACROSS ALL PROGRAMS')
  lines.push(
    `- Safe: ${gap.counts.Safe}, Match: ${gap.counts.Match}, Reach: ${gap.counts.Reach}, Not eligible: ${gap.counts['Not eligible']}`,
  )
  if (gap.commonMissingCourses.length) {
    lines.push(
      `- Most-needed prerequisites: ${gap.commonMissingCourses.map(c => `${c.label} (${c.count} programs)`).join(', ')}`,
    )
  }
  if (gap.examsNeeded.length) {
    lines.push(`- Exams to take/retake: ${gap.examsNeeded.join(', ')}`)
  }

  lines.push('')
  lines.push(
    'Using the profile and target schools above, write the semester-by-semester action plan.',
  )

  return lines.join('\n')
}
