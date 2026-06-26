import type { ProfileData } from '@/types'
import { COURSE_MAP, US_STATES } from '@/lib/constants'
import { User, BookOpen, FlaskConical } from 'lucide-react'

export default function ProfileSummary({ profile }: { profile: ProfileData }) {
  const stateLabels = US_STATES.filter(s => profile.statePrefs.includes(s.code)).map(s => s.label)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
      <div className="flex items-center gap-2">
        <User className="w-5 h-5 text-teal-600" />
        <h3 className="font-semibold text-gray-900">Profile Summary</h3>
      </div>

      {/* Identity */}
      <div>
        <p className="font-medium text-gray-800">{profile.name || <span className="text-gray-400 italic">No name set</span>}</p>
        {profile.email && <p className="text-sm text-gray-500">{profile.email}</p>}
        {profile.targetTerm && (
          <p className="text-sm text-gray-500 mt-1">Target: {profile.targetTerm}</p>
        )}
        {stateLabels.length > 0 && (
          <p className="text-sm text-gray-500">States: {stateLabels.join(', ')}</p>
        )}
      </div>

      {/* GPA */}
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Overall GPA" value={profile.overallGPA?.toFixed(2)} />
        <Stat label="Science GPA" value={profile.scienceGPA?.toFixed(2)} />
        <Stat label="Credits" value={profile.totalCredits?.toString()} />
        <Stat label="Tier" value={profile.tier === 'cycle' ? '✓ Pro' : 'Free'} highlight={profile.tier === 'cycle'} />
      </div>

      {/* Prerequisites */}
      <div>
        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
          <BookOpen className="w-4 h-4 text-teal-600" />
          Prerequisites ({profile.coursesCompleted.length}/8)
        </div>
        <div className="space-y-1">
          {Object.entries(COURSE_MAP).map(([key, label]) => {
            const done = profile.coursesCompleted.includes(key)
            return (
              <div key={key} className="flex items-center gap-2 text-xs">
                <span className={done ? 'text-green-600' : 'text-gray-300'}>
                  {done ? '✓' : '○'}
                </span>
                <span className={done ? 'text-gray-700' : 'text-gray-400'}>{label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Exams */}
      <div>
        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
          <FlaskConical className="w-4 h-4 text-teal-600" />
          Exam Scores
        </div>
        <div className="space-y-1 text-xs">
          {profile.teasScore !== null && (
            <p className="text-gray-700">TEAS: <strong>{profile.teasScore}%</strong></p>
          )}
          {profile.hesiScore !== null && (
            <p className="text-gray-700">HESI A2: <strong>{profile.hesiScore}%</strong></p>
          )}
          {profile.casperQuartile !== null && (
            <p className="text-gray-700">CASPer: Q{profile.casperQuartile}{profile.casperPercentile !== null ? ` (${profile.casperPercentile}th %ile)` : ''}</p>
          )}
          {profile.otherExamName && profile.otherExamScore !== null && (
            <p className="text-gray-700">{profile.otherExamName}: <strong>{profile.otherExamScore}%</strong></p>
          )}
          {profile.teasScore === null && profile.hesiScore === null && profile.casperQuartile === null && (
            <p className="text-gray-400 italic">No exam scores entered</p>
          )}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, highlight }: { label: string; value?: string; highlight?: boolean }) {
  return (
    <div className="bg-gray-50 rounded-lg px-3 py-2">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-teal-700' : 'text-gray-900'}`}>
        {value ?? <span className="text-gray-300 font-normal">N/A</span>}
      </p>
    </div>
  )
}
