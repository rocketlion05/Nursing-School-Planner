import type { ProfileData, ProgramData, ScoredProgram, GapSummary, FitStatus } from '@/types'
import { computeFit } from '@/lib/scoring'
import { COURSE_MAP } from '@/lib/constants'

export function scorePrograms(
  profile: ProfileData | null,
  programs: ProgramData[],
  favoriteIds: Set<string> = new Set(),
): ScoredProgram[] {
  return programs.map(p => ({
    ...p,
    fit: computeFit(profile, p),
    isFavorite: favoriteIds.has(p.id),
  }))
}

export function computeGapSummary(
  profile: ProfileData | null,
  scoredPrograms: ScoredProgram[],
): GapSummary {
  const counts: Record<FitStatus, number> = {
    Safe: 0,
    Match: 0,
    Reach: 0,
    'Not eligible': 0,
    'No profile': 0,
    Unverified: 0,
  }

  scoredPrograms.forEach(p => {
    counts[p.fit.status]++
  })

  // Tally missing courses across non-disqualified programs
  const courseCounts: Record<string, number> = {}
  scoredPrograms
    .filter(p => p.fit.status !== 'Not eligible' && p.fit.status !== 'No profile')
    .forEach(p => {
      p.fit.missingCourses.forEach(k => {
        courseCounts[k] = (courseCounts[k] ?? 0) + 1
      })
    })

  const commonMissingCourses = Object.entries(courseCounts)
    .map(([key, count]) => ({ key, label: COURSE_MAP[key] ?? key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Tally exams needed
  const examSet = new Set<string>()
  scoredPrograms.forEach(p => {
    if (!p.examType) return
    const score =
      p.examType === 'TEAS'
        ? profile?.teasScore
        : p.examType === 'HESI A2'
          ? profile?.hesiScore
          : profile?.otherExamScore

    if (score === null || score === undefined) {
      examSet.add(p.examType)
    } else if (p.minExamScore !== null && score < p.minExamScore) {
      examSet.add(`Retake ${p.examType}`)
    }
  })

  const examsNeeded = Array.from(examSet)

  // Build priority recommendations
  const recommendations: string[] = []

  if (!profile) {
    recommendations.push('Complete your student profile to see personalized recommendations.')
    return { counts, commonMissingCourses, examsNeeded, topRecommendations: recommendations }
  }

  if (commonMissingCourses.length > 0) {
    const top = commonMissingCourses[0]
    recommendations.push(
      `Priority: Enroll in ${top.label} — it's required by ${top.count} of your target programs.`,
    )
  }

  if (examsNeeded.length > 0) {
    recommendations.push(`Exams to take/retake: ${examsNeeded.join(', ')}.`)
  }

  if (counts.Safe === 0 && counts.Match === 0) {
    recommendations.push(
      'None of your target programs are currently "Safe" or "Match." Focus on your GPA and prerequisites first.',
    )
  } else if (counts.Safe === 0) {
    recommendations.push(
      `You have ${counts.Match} Match program(s). Close the gaps above to move into "Safe" territory.`,
    )
  } else {
    recommendations.push(
      `You have ${counts.Safe} Safe and ${counts.Match} Match program(s) — you're in a good position to apply!`,
    )
  }

  if (profile.overallGPA !== null && profile.overallGPA < 3.0) {
    recommendations.push(
      'Many programs require a 3.0+ GPA. Prioritize courses where you can earn strong grades.',
    )
  }

  return { counts, commonMissingCourses, examsNeeded, topRecommendations: recommendations }
}
