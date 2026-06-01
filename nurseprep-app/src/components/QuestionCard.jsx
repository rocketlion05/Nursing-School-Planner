import { useState } from 'react'

const OPTION_KEYS = ['A', 'B', 'C', 'D']

const optionBaseClass =
  'w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 font-medium text-slate-700 flex items-start gap-3'

function optionClass(key, selected, revealed, correctAnswer) {
  if (!revealed) {
    return selected === key
      ? `${optionBaseClass} border-blue-500 bg-blue-50 text-blue-800 shadow-sm`
      : `${optionBaseClass} border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer`
  }
  if (key === correctAnswer) {
    return `${optionBaseClass} border-emerald-500 bg-emerald-50 text-emerald-800`
  }
  if (key === selected && key !== correctAnswer) {
    return `${optionBaseClass} border-red-400 bg-red-50 text-red-700`
  }
  return `${optionBaseClass} border-slate-200 bg-slate-50 text-slate-400`
}

function OptionBadge({ keyLetter, selected, revealed, correctAnswer }) {
  if (revealed && keyLetter === correctAnswer) {
    return (
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">
        ✓
      </span>
    )
  }
  if (revealed && keyLetter === selected && keyLetter !== correctAnswer) {
    return (
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-400 text-white flex items-center justify-center text-sm font-bold">
        ✕
      </span>
    )
  }
  return (
    <span
      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
        selected === keyLetter && !revealed
          ? 'border-blue-500 bg-blue-500 text-white'
          : 'border-slate-300 bg-white text-slate-600'
      }`}
    >
      {keyLetter}
    </span>
  )
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
  isLast,
}) {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)

  const handleSelect = (key) => {
    if (!revealed) setSelected(key)
  }

  const handleCheck = () => {
    if (!selected) return
    const isCorrect = selected === question.correctAnswer
    setRevealed(true)
    onAnswer(selected, isCorrect)
  }

  const handleNext = () => {
    setSelected(null)
    setRevealed(false)
    onNext()
  }

  const isCorrect = revealed && selected === question.correctAnswer

  return (
    <div className="animate-slide-up">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-slate-500 mb-2 font-medium">
          <span>Question {questionNumber} of {totalQuestions}</span>
          <span>{Math.round((questionNumber / totalQuestions) * 100)}% complete</span>
        </div>
        <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
          <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>NCLEX Practice</span>
          </div>
          <p className="text-white text-lg font-semibold leading-relaxed">{question.question}</p>
        </div>

        <div className="p-6 space-y-3">
          {OPTION_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              disabled={revealed}
              className={optionClass(key, selected, revealed, question.correctAnswer)}
            >
              <OptionBadge
                keyLetter={key}
                selected={selected}
                revealed={revealed}
                correctAnswer={question.correctAnswer}
              />
              <span className="pt-0.5">{question.options[key]}</span>
            </button>
          ))}
        </div>

        {/* Action area */}
        {!revealed ? (
          <div className="px-6 pb-6">
            <button
              onClick={handleCheck}
              disabled={!selected}
              className={`w-full py-3.5 rounded-xl font-bold text-base transition-all duration-150 ${
                selected
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Check Answer
            </button>
          </div>
        ) : (
          <div className="px-6 pb-6 space-y-4 animate-fade-in">
            {/* Result badge */}
            <div
              className={`rounded-xl p-4 flex items-center gap-3 ${
                isCorrect
                  ? 'bg-emerald-50 border border-emerald-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <span className="text-2xl">{isCorrect ? '🎉' : '💪'}</span>
              <div>
                <p className={`font-bold text-base ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                  {isCorrect ? 'Great job! That\'s correct!' : 'Not quite — keep going!'}
                </p>
                <p className={`text-sm ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                  {isCorrect
                    ? 'You nailed the clinical reasoning on this one.'
                    : `The correct answer was ${question.correctAnswer}. Read the rationale to understand why.`}
                </p>
              </div>
            </div>

            {/* Rationale */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                <span>📖</span> Clinical Rationale
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">{question.rationale}</p>
            </div>

            {/* Next button */}
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3.5 rounded-xl text-base transition-all shadow-sm hover:shadow cursor-pointer"
            >
              {isLast ? 'See My Results →' : 'Next Question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
