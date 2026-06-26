import type { CourseItem } from '@/types'

export const COURSES: CourseItem[] = [
  { key: 'ANAT_PHYS_1', label: 'Anatomy & Physiology I', group: 'Science' },
  { key: 'ANAT_PHYS_2', label: 'Anatomy & Physiology II', group: 'Science' },
  { key: 'MICRO', label: 'Microbiology', group: 'Science' },
  { key: 'CHEM', label: 'General Chemistry', group: 'Science' },
  { key: 'STATS', label: 'Statistics', group: 'Math' },
  { key: 'NUTRITION', label: 'Nutrition', group: 'Health' },
  { key: 'LIFESPAN', label: 'Lifespan / Human Development', group: 'Social Science' },
  { key: 'ENGLISH_COMP', label: 'English Composition I', group: 'English' },
]

export const COURSE_MAP = Object.fromEntries(COURSES.map(c => [c.key, c.label]))

export const US_STATES = [
  { code: 'AR', label: 'Arkansas' },
  { code: 'TX', label: 'Texas' },
]

export const EXAM_TYPES = ['TEAS', 'HESI A2', 'NLN PAX'] as const

export const FREE_TIER_FAVORITE_LIMIT = 2

export const DISCLAIMER =
  'This tool is for planning purposes only. It does NOT guarantee admission. ' +
  'Always verify official requirements, deadlines, and policies directly with each nursing program before applying. ' +
  'Use this as a guide, not an official source. Program requirements change, and data shown here may be approximate or outdated.'
