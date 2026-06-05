import type {
  ProfileData,
  ProgramData,
  ScoredProgram,
  GapSummary,
  FitStatus,
  RetakeRecommendation,
} from '@/types'

export interface ExamInsight {
  examType: string
  yourScore: number
  programsRequiring: number
  programsMeetingMin: number
  nextThresholdScore: number | null
  programsUnlockedAtThreshold: number
}
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

/**
 * For each exam the student has taken, compute how many programs they meet the
 * published minimum for, and what score would unlock the next batch.
 * Only programs with both examType and a published minExamScore are counted.
 */
export function computeExamInsights(
  profile: ProfileData,
  programs: ScoredProgram[],
): ExamInsight[] {
  const insights: ExamInsight[] = []

  const checks = [
    { type: 'TEAS', score: profile.teasScore },
    { type: 'HESI A2', score: profile.hesiScore },
  ] as const

  for (const { type, score } of checks) {
    if (score === null) continue

    const requiring = programs.filter(
      p => p.examType === type && p.minExamScore !== null,
    )
    if (requiring.length === 0) continue

    const meetingMin = requiring.filter(p => score >= p.minExamScore!)

    // Find the lowest threshold above the student's current score
    const thresholdsAbove = requiring
      .filter(p => p.minExamScore! > score)
      .map(p => p.minExamScore!)
      .sort((a, b) => a - b)

    const nextThresholdScore = thresholdsAbove[0] ?? null
    const programsUnlockedAtThreshold = nextThresholdScore
      ? requiring.filter(p => p.minExamScore! > score && p.minExamScore! <= nextThresholdScore).length
      : 0

    insights.push({
      examType: type,
      yourScore: score,
      programsRequiring: requiring.length,
      programsMeetingMin: meetingMin.length,
      nextThresholdScore,
      programsUnlockedAtThreshold,
    })
  }

  return insights
}

/** How many programs the student is currently competitive for (Safe or Match). */
function countSafeMatch(profile: ProfileData, programs: ProgramData[]): number {
  return scorePrograms(profile, programs).filter(
    p => p.fit.status === 'Safe' || p.fit.status === 'Match',
  ).length
}

function plural(n: number): string {
  return n === 1 ? '' : 's'
}

/**
 * Prioritized, rule-based advice on whether retaking an exam or improving GPA /
 * prerequisites is "worth the student's time." Each recommendation's impact is
 * the number of programs it would unlock or move into Safe/Match, estimated by
 * re-running the same scoring logic with a hypothetical improvement — the same
 * pattern the What-If Simulator uses, but computed server-side.
 *
 * No AI: purely computational. Sorted by impact descending.
 */
export function computeRetakeRecommendations(
  profile: ProfileData,
  scored: ScoredProgram[],
): RetakeRecommendation[] {
  // ScoredProgram extends ProgramData, so it's a valid input to scorePrograms.
  const programs: ProgramData[] = scored
  const baseline = countSafeMatch(profile, programs)
  const recs: RetakeRecommendation[] = []

  const GPA_BUMP = 0.3

  // --- Exam retakes: reuse the established threshold/unlock logic ---
  for (const insight of computeExamInsights(profile, scored)) {
    if (insight.nextThresholdScore === null || insight.programsUnlockedAtThreshold <= 0) continue
    const impact = insight.programsUnlockedAtThreshold
    recs.push({
      type: 'exam',
      impact,
      priority: impact >= 2 ? 'high' : 'medium',
      message: `Retaking the ${insight.examType} is one of your highest-leverage moves — scoring ${insight.nextThresholdScore}%+ would make you competitive at ${impact} more program${plural(impact)}.`,
    })
  }

  // --- Overall GPA bump ---
  if (profile.overallGPA !== null) {
    const target = Math.min(4.0, profile.overallGPA + GPA_BUMP)
    const impact = countSafeMatch({ ...profile, overallGPA: target }, programs) - baseline
    if (impact > 0) {
      recs.push({
        type: 'gpa',
        impact,
        priority: impact >= 3 ? 'high' : 'medium',
        message: `Raising your overall GPA from ${profile.overallGPA.toFixed(2)} to ${target.toFixed(2)} would move ${impact} program${plural(impact)} into Safe or Match.`,
      })
    }
  }

  // --- Science GPA bump (often the real bottleneck) ---
  if (profile.scienceGPA !== null) {
    const target = Math.min(4.0, profile.scienceGPA + GPA_BUMP)
    const impact = countSafeMatch({ ...profile, scienceGPA: target }, programs) - baseline
    if (impact > 0) {
      recs.push({
        type: 'sci_gpa',
        impact,
        priority: impact >= 3 ? 'high' : 'medium',
        message: `Your science GPA is a bottleneck: raising it from ${profile.scienceGPA.toFixed(2)} to ${target.toFixed(2)} would move ${impact} program${plural(impact)} into Safe or Match.`,
      })
    }
  }

  // --- Finishing outstanding prerequisites ---
  const allRequired = new Set<string>()
  programs.forEach(p => p.requiredCourses.forEach(c => allRequired.add(c)))
  const withAllPrereqs = Array.from(new Set([...profile.coursesCompleted, ...allRequired]))
  if (withAllPrereqs.length > profile.coursesCompleted.length) {
    const impact = countSafeMatch({ ...profile, coursesCompleted: withAllPrereqs }, programs) - baseline
    if (impact > 0) {
      recs.push({
        type: 'prereq',
        impact,
        priority: impact >= 2 ? 'high' : 'medium',
        message: `Finishing your outstanding prerequisites would move ${impact} program${plural(impact)} into Safe or Match — focus your course planning here.`,
      })
    }
  }

  recs.sort((a, b) => b.impact - a.impact)

  // If nothing moves the needle, the student is either already strong or close.
  if (recs.length === 0) {
    const scoreable = programs.length > 0 && baseline > 0
    recs.push({
      type: 'prereq',
      impact: 0,
      priority: 'low',
      message: scoreable
        ? "You're meeting the requirements for your competitive programs — you're in a strong position to apply this cycle. Keep your prerequisites on track."
        : 'No single change unlocks more programs right now. Focus on steadily improving your GPA and finishing prerequisites, then re-check your fit.',
    })
  }

  return recs
}
