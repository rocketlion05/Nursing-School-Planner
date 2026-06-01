import { useState } from 'react'
import { Link } from 'react-router-dom'
import { generateQuestions } from '../services/claude'
import QuestionCard from '../components/QuestionCard'

const TOPICS = [
  'Fundamentals',
  'Pharmacology',
  'Med-Surg',
  'Pediatrics',
  'Maternal-Newborn',
  'Mental Health',
  'Leadership & Management',
]

const DIFFICULTIES = [
  { value: 'NCLEX Beginner', label: 'NCLEX Beginner', desc: 'Core concepts & recall' },
  { value: 'NCLEX Intermediate', label: 'NCLEX Intermediate', desc: 'Application & analysis' },
  { value: 'NCLEX Advanced', label: 'NCLEX Advanced', desc: 'Complex clinical judgment' },
]

const TOPIC_ICONS = {
  Fundamentals: '🏥',
  Pharmacology: '💊',
  'Med-Surg': '🫀',
  Pediatrics: '👶',
  'Maternal-Newborn': '🤱',
  'Mental Health': '🧠',
  'Leadership & Management': '📋',
}

function getScoreMessage(correct, total) {
  const pct = correct / total
  if (pct === 1) return { emoji: '🏆', title: 'Perfect score!', sub: 'You absolutely crushed it. Outstanding clinical thinking!' }
  if (pct >= 0.8) return { emoji: '🌟', title: 'Great job!', sub: 'You\'re really getting the hang of this. Keep up the great work!' }
  if (pct >= 0.6) return { emoji: '💪', title: 'Almost there!', sub: 'You\'re on the right track. A little more practice and you\'ll have it!' }
  if (pct >= 0.4) return { emoji: '📚', title: 'Keep studying!', sub: 'Every question is a learning opportunity. You\'re making progress!' }
  return { emoji: '🌱', title: 'Don\'t give up!', sub: 'Learning takes time. Review the rationales and try again — you\'ve got this!' }
}

function ScoreRing({ correct, total }) {
  const pct = correct / total
  const size = 120
  const strokeWidth = 10
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - pct)
  const color = pct >= 0.8 ? '#10b981' : pct >= 0.6 ? '#3b82f6' : pct >= 0.4 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-black text-slate-800">{correct}/{total}</div>
        <div className="text-xs font-medium text-slate-500">correct</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [view, setView] = useState('setup')
  const [topic, setTopic] = useState(TOPICS[0])
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0].value)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const qs = await generateQuestions(topic, difficulty)
      setQuestions(qs)
      setAnswers([])
      setCurrentIndex(0)
      setView('questions')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswer = (selectedAnswer, isCorrect) => {
    setAnswers((prev) => [...prev, { selectedAnswer, isCorrect }])
  }

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setView('complete')
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handleReset = () => {
    setView('setup')
    setQuestions([])
    setAnswers([])
    setCurrentIndex(0)
    setError(null)
  }

  const correctCount = answers.filter((a) => a.isCorrect).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🩺</span>
            <span className="font-bold text-blue-700 text-xl">NursePrep AI</span>
          </Link>
          {view !== 'setup' && (
            <button
              onClick={handleReset}
              className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
            >
              ← New Session
            </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* ── SETUP VIEW ── */}
        {view === 'setup' && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3">
                What are you studying today?
              </h1>
              <p className="text-slate-500 text-lg">
                Pick your topic and difficulty, and we'll generate 5 fresh NCLEX questions just for you.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-8">
              {/* Topic selector */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                  📚 Topic
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {TOPICS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-sm font-semibold transition-all duration-150 ${
                        topic === t
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                    >
                      <span className="text-2xl">{TOPIC_ICONS[t]}</span>
                      <span className="text-center leading-tight">{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty selector */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                  🎯 Difficulty
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDifficulty(d.value)}
                      className={`text-left p-4 rounded-xl border-2 transition-all duration-150 ${
                        difficulty === d.value
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                    >
                      <div className={`font-bold text-sm ${difficulty === d.value ? 'text-blue-700' : 'text-slate-700'}`}>
                        {d.label}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{d.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                  <strong>Oops!</strong> {error}
                </div>
              )}

              {/* Summary + CTA */}
              <div className="pt-2">
                <div className="flex items-center gap-3 text-sm text-slate-500 mb-5">
                  <span className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full">
                    {TOPIC_ICONS[topic]} {topic}
                  </span>
                  <span>·</span>
                  <span className="bg-emerald-100 text-emerald-700 font-semibold px-3 py-1 rounded-full">
                    {difficulty}
                  </span>
                  <span>·</span>
                  <span>5 Questions</span>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-sm hover:shadow ${
                    isLoading
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white cursor-pointer hover:-translate-y-0.5 active:translate-y-0'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-slate-500" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Generating your questions...
                    </span>
                  ) : (
                    '✨ Generate Questions'
                  )}
                </button>
                {isLoading && (
                  <p className="text-center text-sm text-slate-400 mt-3 animate-pulse">
                    Claude is crafting your NCLEX questions — hang tight!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── QUESTIONS VIEW ── */}
        {view === 'questions' && questions.length > 0 && (
          <QuestionCard
            key={currentIndex}
            question={questions[currentIndex]}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            onNext={handleNext}
            isLast={currentIndex + 1 >= questions.length}
          />
        )}

        {/* ── COMPLETE VIEW ── */}
        {view === 'complete' && (
          <div className="animate-bounce-in text-center">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10">
              {(() => {
                const msg = getScoreMessage(correctCount, questions.length)
                return (
                  <>
                    <div className="text-5xl mb-4">{msg.emoji}</div>
                    <h2 className="text-3xl font-extrabold text-slate-800 mb-2">{msg.title}</h2>
                    <p className="text-slate-500 text-lg mb-8 max-w-sm mx-auto">{msg.sub}</p>

                    <div className="flex justify-center mb-8">
                      <ScoreRing correct={correctCount} total={questions.length} />
                    </div>

                    {/* Per-question breakdown */}
                    <div className="flex justify-center gap-3 mb-8 flex-wrap">
                      {answers.map((a, i) => (
                        <div
                          key={i}
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            a.isCorrect
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-600'
                          }`}
                          title={`Question ${i + 1}: ${a.isCorrect ? 'Correct' : 'Incorrect'}`}
                        >
                          {a.isCorrect ? '✓' : '✕'}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={handleReset}
                        className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-base transition-all shadow-sm hover:shadow cursor-pointer"
                      >
                        Try Another Topic ✨
                      </button>
                      <button
                        onClick={() => {
                          setAnswers([])
                          setCurrentIndex(0)
                          setView('setup')
                        }}
                        className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-bold text-base hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                      >
                        Same Topic, New Questions
                      </button>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
