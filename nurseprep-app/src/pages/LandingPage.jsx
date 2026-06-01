import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🧠',
    title: 'AI-Generated Questions',
    description:
      'Get fresh, clinically accurate NCLEX-style questions tailored to your chosen topic and difficulty — powered by Claude AI.',
  },
  {
    icon: '📋',
    title: 'Detailed Rationales',
    description:
      'Every answer comes with a full clinical explanation covering all four options, so you understand the "why" behind each decision.',
  },
  {
    icon: '🎯',
    title: 'Focused Practice',
    description:
      'Choose from 7 key nursing topics and 3 difficulty levels to target exactly what you need to master for your exam.',
  },
]

const stats = [
  { value: '7', label: 'Clinical Topics' },
  { value: '3', label: 'Difficulty Levels' },
  { value: '5', label: 'Questions per Set' },
  { value: '∞', label: 'Practice Sessions' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="stethoscope">🩺</span>
            <span className="font-bold text-xl text-blue-700">NursePrep AI</span>
          </div>
          <Link
            to="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors shadow-sm hover:shadow"
          >
            Start Studying
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <span>✨</span>
            <span>Powered by Claude AI</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
            Study smarter.
            <br />
            <span className="text-emerald-300">Pass with confidence.</span>
          </h1>

          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            NursePrep AI gives you unlimited, clinically accurate NCLEX practice questions with
            detailed rationales — so you can walk into your exam ready for anything.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="bg-white text-blue-700 font-bold px-8 py-4 rounded-2xl text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started — It's Free
            </Link>
            <a
              href="#how-it-works"
              className="border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-white/10 transition-colors"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white pt-4 pb-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center py-4">
                <div className="text-4xl font-black text-blue-600 mb-1">{s.value}</div>
                <div className="text-sm font-medium text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how-it-works" className="bg-gradient-to-b from-white to-blue-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Everything you need to pass
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              No fluff, no filler — just focused practice that mirrors the real NCLEX experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works steps */}
      <section className="bg-blue-50 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              How it works
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Pick your topic and difficulty',
                desc: 'Choose from Fundamentals, Pharm, Med-Surg, Peds, and more — then set the challenge level.',
              },
              {
                step: '2',
                title: 'AI generates 5 fresh questions',
                desc: 'Claude creates clinically realistic NCLEX-style questions with four plausible answer options, every single time.',
              },
              {
                step: '3',
                title: 'Answer, learn, and grow',
                desc: 'Select your answer, then get immediate feedback with a detailed rationale explaining all four options.',
              },
              {
                step: '4',
                title: 'See your results and keep going',
                desc: 'Track your score per set and jump straight into another round when you\'re ready for more.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-5 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{item.title}</h3>
                  <p className="text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-gradient-to-r from-blue-600 to-emerald-600 py-20 px-6 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          You've got this. Let's start preparing.
        </h2>
        <p className="text-blue-100 text-lg mb-8 max-w-lg mx-auto">
          Every question you practice brings you one step closer to that passing score.
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-white text-blue-700 font-bold px-10 py-4 rounded-2xl text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Start Practicing Now →
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-6 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span>🩺</span>
          <span className="font-semibold text-white">NursePrep AI</span>
        </div>
        <p>Built with care for nursing students everywhere. Good luck — you've got this! 💙</p>
      </footer>
    </div>
  )
}
