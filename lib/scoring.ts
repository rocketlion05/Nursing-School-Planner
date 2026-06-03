import type { ProfileData, ProgramData, FitResult, FitStatus } from '@/types'
import { COURSE_MAP } from '@/lib/constants'

function getStudentExamScore(profile: ProfileData, examType: string | null): number | null {
  if (!examType) return null
  if (examType === 'TEAS') return profile.teasScore
  if (examType === 'HESI A2') return profile.hesiScore
  if (examType === profile.otherExamName) return profile.otherExamScore
  return null
}

export function computeFit(profile: ProfileData | null, program: ProgramData): FitResult {
  if (!profile) {
    return {
      status: 'No profile',
      explanation: 'Complete your profile to see your fit for this program.',
      missingCourses: [],
      completedCourses: [],
      examNote: null,
      gpaNote: null,
      nextSteps: ['Complete your profile to see your fit score.'],
    }
  }

  // --- Unscoreable: no verified requirement data to evaluate against ---
  // Without any requirements (placeholder programs), every profile would otherwise
  // come back "Safe" — a dangerously misleading green light for schools like Duke
  // or UT Austin. Surface honest uncertainty instead.
  const hasRequirementData =
    program.requiredCourses.length > 0 ||
    program.minOverallGPA !== null ||
    program.minScienceGPA !== null ||
    program.examType !== null ||
    program.casperRequired
  if (!hasRequirementData) {
    return {
      status: 'Unverified',
      explanation:
        "We don't have verified admission requirements for this program yet, so we can't score your fit. Check the school's official nursing page for current GPA, prerequisite, and entrance-exam requirements.",
      missingCourses: [],
      completedCourses: [],
      examNote: null,
      gpaNote: null,
      nextSteps: ["Verify this program's requirements on the school's official website."],
    }
  }

  const completed = new Set(profile.coursesCompleted)
  const requiredCourses = program.requiredCourses

  const missingCourses = requiredCourses.filter(c => !completed.has(c))
  const completedCourses = requiredCourses.filter(c => completed.has(c))

  let penalties = 0
  const nextSteps: string[] = []
  let gpaNote: string | null = null
  let examNote: string | null = null

  // --- Hard disqualifiers ---
  if (missingCourses.length >= 3) {
    const labels = missingCourses.map(k => COURSE_MAP[k] ?? k).join(', ')
    return {
      status: 'Not eligible',
      explanation: `Missing ${missingCourses.length} required prerequisites (${labels}). Complete these before applying.`,
      missingCourses,
      completedCourses,
      examNote: null,
      gpaNote: null,
      nextSteps: missingCourses.map(k => `Enroll in ${COURSE_MAP[k] ?? k}`),
    }
  }

  if (program.minOverallGPA !== null && profile.overallGPA !== null) {
    const gap = program.minOverallGPA - profile.overallGPA
    if (gap > 0.5) {
      gpaNote = `Your GPA (${profile.overallGPA.toFixed(2)}) is ${gap.toFixed(2)} below the ${program.minOverallGPA.toFixed(2)} minimum.`
      return {
        status: 'Not eligible',
        explanation: gpaNote,
        missingCourses,
        completedCourses,
        examNote: null,
        gpaNote,
        nextSteps: ['Focus on improving your GPA before applying.'],
      }
    }
  }

  // --- Penalty scoring ---

  // Missing courses
  if (missingCourses.length === 1) {
    penalties += 2
    const label = COURSE_MAP[missingCourses[0]] ?? missingCourses[0]
    nextSteps.push(`Complete ${label} before the application deadline.`)
  } else if (missingCourses.length === 2) {
    penalties += 4
    missingCourses.forEach(k => nextSteps.push(`Enroll in ${COURSE_MAP[k] ?? k}.`))
  }

  // Overall GPA
  if (program.minOverallGPA !== null) {
    if (profile.overallGPA === null) {
      penalties += 1
      gpaNote = `Overall GPA minimum is ${program.minOverallGPA.toFixed(2)} — enter your GPA to see your full fit.`
      nextSteps.push('Enter your overall GPA in your profile.')
    } else {
      const margin = profile.overallGPA - program.minOverallGPA
      if (margin < 0) {
        penalties += 3
        gpaNote = `Your GPA (${profile.overallGPA.toFixed(2)}) is ${Math.abs(margin).toFixed(2)} below the minimum of ${program.minOverallGPA.toFixed(2)}.`
        nextSteps.push('Work on improving your cumulative GPA.')
      } else if (margin < 0.2) {
        penalties += 1
        gpaNote = `Your GPA (${profile.overallGPA.toFixed(2)}) meets the ${program.minOverallGPA.toFixed(2)} minimum, but with a narrow margin.`
      }
    }
  }

  // Science GPA
  if (program.minScienceGPA !== null) {
    if (profile.scienceGPA === null) {
      penalties += 1
      nextSteps.push('Enter your science GPA in your profile.')
    } else {
      const margin = profile.scienceGPA - program.minScienceGPA
      if (margin < 0) {
        penalties += 2
        nextSteps.push(`Improve your science GPA (currently ${profile.scienceGPA.toFixed(2)}; minimum is ${program.minScienceGPA.toFixed(2)}).`)
      } else if (margin < 0.2) {
        penalties += 1
      }
    }
  }

  // Entrance exam
  if (program.examType !== null) {
    const score = getStudentExamScore(profile, program.examType)
    if (score === null) {
      penalties += 2
      examNote = `${program.examType} required${program.minExamScore ? ` (min ${program.minExamScore}%)` : ''} — no score on file.`
      nextSteps.push(`Take the ${program.examType}${program.minExamScore ? ` and score at least ${program.minExamScore}%` : ''}.`)
    } else if (program.minExamScore !== null) {
      const margin = score - program.minExamScore
      if (margin < 0) {
        penalties += 2
        examNote = `Your ${program.examType} score (${score}%) is below the ${program.minExamScore}% minimum.`
        nextSteps.push(`Retake the ${program.examType} — you need at least ${program.minExamScore}% (currently ${score}%).`)
      } else if (margin < 5) {
        penalties += 1
        examNote = `Your ${program.examType} score (${score}%) meets the minimum of ${program.minExamScore}%, but with a narrow margin.`
      } else {
        examNote = `${program.examType}: ${score}% ✓ (minimum ${program.minExamScore}%)`
      }
    } else {
      examNote = `${program.examType}: ${score}% on file.`
    }
  }

  // CASPer
  if (program.casperRequired) {
    if (profile.casperQuartile === null) {
      penalties += 1
      nextSteps.push('Register for and complete the CASPer exam.')
    } else if (profile.casperQuartile <= 1) {
      penalties += 2
      nextSteps.push('Consider retaking CASPer — a higher quartile improves your competitiveness.')
    }
  }

  // Determine status
  let status: FitStatus
  if (penalties === 0) {
    status = 'Safe'
  } else if (penalties <= 3) {
    status = 'Match'
  } else {
    status = 'Reach'
  }

  // Build explanation
  const parts: string[] = []
  if (missingCourses.length === 0) parts.push('All required prerequisites completed.')
  else parts.push(`Missing ${missingCourses.length} prerequisite(s).`)
  if (gpaNote) parts.push(gpaNote)
  if (examNote) parts.push(examNote)
  if (penalties === 0) parts.push('You look competitive for this program!')

  return {
    status,
    explanation: parts.join(' '),
    missingCourses,
    completedCourses,
    examNote,
    gpaNote,
    nextSteps: nextSteps.length > 0 ? nextSteps : ['Keep up the great work — you look strong for this program!'],
  }
}
