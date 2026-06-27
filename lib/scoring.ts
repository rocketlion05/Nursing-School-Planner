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
  // --- No requirement signals: either a direct-admit program or unresearched ---
  // A program with no GPA/exam/prerequisite data can't be scored. WHY it has no
  // data matters: a program we've verified as direct-admit (you apply to the
  // university as a first-year student, no nursing-specific cutoffs) is a real,
  // accurate state — not a gap. Distinguish it from a genuinely unresearched row
  // so we don't slap a misleading "Unverified" warning on schools like UCLA, NYU,
  // or Penn State. This is profile-independent, so it's checked before the profile.
  const hasRequirementData =
    program.requiredCourses.length > 0 ||
    program.minOverallGPA !== null ||
    program.minScienceGPA !== null ||
    program.examType !== null ||
    program.casperRequired
  if (!hasRequirementData) {
    const researched = program.dataQuality === 'verified' || program.dataQuality === 'partial'
    if (researched) {
      return {
        status: 'Direct Admit',
        explanation:
          "This is a direct-admit program: you apply to the university as a first-year student, so there's no separate nursing entrance exam or prerequisite-GPA cutoff to score against. Review the school's first-year admission criteria and official page for details.",
        missingCourses: [],
        completedCourses: [],
        examNote: null,
        gpaNote: null,
        nextSteps: ["Review this school's first-year / direct-admit criteria on its official nursing page."],
      }
    }
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
      status: 'Additional Steps Needed',
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
        status: 'Additional Steps Needed',
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
      gpaNote = `Overall GPA minimum is ${program.minOverallGPA.toFixed(2)}. Enter your GPA to see your full fit.`
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
      examNote = `${program.examType} required${program.minExamScore ? ` (min ${program.minExamScore}%)` : ''}: no score on file.`
      nextSteps.push(`Take the ${program.examType}${program.minExamScore ? ` and score at least ${program.minExamScore}%` : ''}.`)
    } else if (program.minExamScore !== null) {
      const margin = score - program.minExamScore
      if (margin < 0) {
        penalties += 2
        examNote = `Your ${program.examType} score (${score}%) is below the ${program.minExamScore}% minimum.`
        nextSteps.push(`Retake the ${program.examType}: you need at least ${program.minExamScore}% (currently ${score}%).`)
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
      nextSteps.push('Consider retaking CASPer; a higher quartile improves your competitiveness.')
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
    nextSteps: nextSteps.length > 0 ? nextSteps : ['Keep up the great work; you look strong for this program!'],
  }
}
