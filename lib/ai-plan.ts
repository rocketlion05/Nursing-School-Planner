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

/** Conversational academic-advisor persona for the chat on /plan. */
export const AI_ADVISOR_SYSTEM_PROMPT =
  "You are a warm, knowledgeable academic advisor for pre-nursing students applying to BSN " +
  "programs, chatting one-on-one with a student. Use ONLY the STUDENT CONTEXT block (their " +
  "profile and the programs in our database) to answer — it is the source of truth.\n" +
  "- If they ask you to build an academic plan, give a clear semester-by-semester plan: which " +
  "courses to take each term, when to take the TEAS/HESI, and when to apply — end with the top 3 " +
  "actions to take now.\n" +
  "- If they ask about their best school options, recommend specific programs from their Safe and " +
  "Match lists and say why, then mention any worthwhile Reach schools.\n" +
  "- NEVER invent a school, GPA cutoff, deadline, exam, or requirement that isn't in the context. " +
  "If you don't have the data, say so and suggest checking the school's official admissions page.\n" +
  "- Keep replies focused (usually under ~350 words), supportive, and honest about reaches. Use " +
  "markdown: short headings, bullet lists, and **bold** for key numbers. Address the student by " +
  "first name when you know it.";

/** Suggested opening prompts shown before the student types anything. */
export const AI_ADVISOR_STARTERS = [
  'Build me an academic plan',
  'What schools are my best options?',
  'How can I improve my chances?',
  'What should I do before I apply?',
]

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
    `- Safe: ${gap.counts.Safe}, Match: ${gap.counts.Match}, Reach: ${gap.counts.Reach}, Additional Steps Needed: ${gap.counts['Additional Steps Needed']}`,
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

const FIT_RANK: Record<string, number> = { Safe: 0, Match: 1, Reach: 2, 'Additional Steps Needed': 3, Unverified: 4, 'No profile': 5 }

/**
 * Context block for the conversational advisor: the student's profile, their fit
 * across ALL programs, and the best-fit programs (Safe → Match → Reach, capped)
 * with key requirements. Sent as a system message so the model can answer freely.
 */
export function buildAdvisorContext(
  profile: ProfileData,
  scored: ScoredProgram[],
  gap: GapSummary,
): string {
  const lines: string[] = ['STUDENT CONTEXT', '', 'PROFILE']
  lines.push(`- First name: ${profile.name?.split(' ')[0] || 'Not provided'}`)
  lines.push(`- Target application term: ${profile.targetTerm || 'Not decided yet'}`)
  lines.push(`- Preferred states: ${profile.statePrefs.length ? profile.statePrefs.map(stateLabel).join(', ') : 'No preference'}`)
  lines.push(`- Overall GPA: ${fmtGpa(profile.overallGPA)}; Science (BCP) GPA: ${fmtGpa(profile.scienceGPA)}; Credits: ${profile.totalCredits ?? 'n/a'}`)

  const completed = profile.coursesCompleted.map(k => COURSE_MAP[k] ?? k)
  const remaining = Object.keys(COURSE_MAP).filter(k => !profile.coursesCompleted.includes(k)).map(k => COURSE_MAP[k])
  lines.push(`- Prerequisites completed: ${completed.length ? completed.join(', ') : 'None yet'}`)
  lines.push(`- Prerequisites still needed: ${remaining.length ? remaining.join(', ') : 'None — all common prereqs done'}`)
  lines.push(`- Exams: TEAS ${profile.teasScore !== null ? profile.teasScore + '%' : 'not taken'}; HESI A2 ${profile.hesiScore !== null ? profile.hesiScore + '%' : 'not taken'}`)

  lines.push('', 'FIT ACROSS OUR PROGRAMS')
  lines.push(`- Safe: ${gap.counts.Safe}, Match: ${gap.counts.Match}, Reach: ${gap.counts.Reach}, Additional Steps Needed: ${gap.counts['Additional Steps Needed']}, Unverified: ${gap.counts.Unverified}`)
  if (gap.commonMissingCourses.length) lines.push(`- Most-needed prerequisites: ${gap.commonMissingCourses.map(c => `${c.label} (${c.count})`).join(', ')}`)
  if (gap.examsNeeded.length) lines.push(`- Exams to take/retake: ${gap.examsNeeded.join(', ')}`)

  // Best-fit programs (Safe → Match → Reach), capped to keep context tight.
  const ranked = [...scored]
    .filter(p => ['Safe', 'Match', 'Reach'].includes(p.fit.status))
    .sort((a, b) => (FIT_RANK[a.fit.status] ?? 9) - (FIT_RANK[b.fit.status] ?? 9))
    .slice(0, 25)
  lines.push('', `BEST-FIT PROGRAMS (showing ${ranked.length}; recommend from these)`)
  if (ranked.length === 0) {
    lines.push('- None are Safe/Match/Reach yet — focus on raising GPA, finishing prereqs, and entrance exams first.')
  } else {
    for (const p of ranked) {
      const reqs: string[] = []
      if (p.minOverallGPA !== null) reqs.push(`GPA ${p.minOverallGPA.toFixed(2)}`)
      if (p.examType) reqs.push(`${p.examType}${p.minExamScore !== null ? ` ≥ ${p.minExamScore}%` : ''}`)
      if (p.deadlines) reqs.push(`deadline ${p.deadlines}`)
      lines.push(`- ${p.university} (${p.city}, ${p.state}) [${p.fit.status}]${reqs.length ? ' — ' + reqs.join(', ') : ''}`)
    }
  }
  return lines.join('\n')
}
