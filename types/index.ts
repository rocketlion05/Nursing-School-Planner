export type FitStatus = 'Safe' | 'Match' | 'Reach' | 'Additional Steps Needed' | 'No profile' | 'Unverified'

export interface CourseItem {
  key: string
  label: string
  group: string
}

export interface ProfileData {
  id: string
  name: string
  email: string
  statePrefs: string[]
  targetTerm: string
  overallGPA: number | null
  scienceGPA: number | null
  totalCredits: number | null
  coursesCompleted: string[]
  teasScore: number | null
  hesiScore: number | null
  casperQuartile: number | null
  casperPercentile: number | null
  otherExamName: string | null
  otherExamScore: number | null
  tier: 'free' | 'cycle'
  /** ISO date when time-boxed (1-month code) access lapses; null = no expiry. */
  premiumUntil: string | null
}

export interface ProgramData {
  id: string
  /** SEO-friendly URL key (e.g. "arkansas-state-university"); null for legacy rows. */
  urlSlug: string | null
  /** Official admissions / requirements page for the school; null if unverified. */
  officialUrl: string | null
  /** Admissions contact email for the program; null if unverified. */
  admissionEmail: string | null
  name: string
  university: string
  city: string
  state: string
  region: string
  tier: string
  isFlagship: boolean
  isPublic: boolean
  programType: string
  minOverallGPA: number | null
  minScienceGPA: number | null
  requiredCourses: string[]
  examType: string | null
  minExamScore: number | null
  casperRequired: boolean
  deadlines: string | null
  notes: string | null
  dataQuality: string
  /** Requirement field names whose values are AI estimates, not published data. */
  estimatedFields: string[]
}

export interface FitResult {
  status: FitStatus
  explanation: string
  missingCourses: string[]
  completedCourses: string[]
  examNote: string | null
  gpaNote: string | null
  nextSteps: string[]
}

export interface ScoredProgram extends ProgramData {
  fit: FitResult
  isFavorite: boolean
}

export interface GapSummary {
  counts: Record<FitStatus, number>
  commonMissingCourses: Array<{ key: string; label: string; count: number }>
  examsNeeded: string[]
  topRecommendations: string[]
}

export interface RetakeRecommendation {
  priority: 'high' | 'medium' | 'low'
  type: 'exam' | 'gpa' | 'sci_gpa' | 'prereq'
  message: string
  /** Number of programs unlocked or moved into Safe/Match by acting on this. */
  impact: number
}
