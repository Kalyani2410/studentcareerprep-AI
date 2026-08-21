import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

/**
 * useInView
 * Re-triggers every time the element enters the viewport (not just once).
 * Respects prefers-reduced-motion by always reporting "in view" (no hidden state).
 */
function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { threshold: 0.2, ...options }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, inView]
}

function Home() {
  const [heroRef, heroInView] = useInView({ threshold: 0.15 })
  const [featuresRef, featuresInView] = useInView()
  const [howRef, howInView] = useInView()
  const [notesRef, notesInView] = useInView({ threshold: 0.15 })
  const [resumeRef, resumeInView] = useInView({ threshold: 0.2 })

  const fadeUp = (visible, delayMs = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.7s ease ${delayMs}ms, transform 0.7s ease ${delayMs}ms`,
  })

  const fadeLeft = (visible, delayMs = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateX(0)' : 'translateX(-32px)',
    transition: `opacity 0.7s ease ${delayMs}ms, transform 0.7s ease ${delayMs}ms`,
  })

  const fadeRight = (visible, delayMs = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateX(0)' : 'translateX(32px)',
    transition: `opacity 0.7s ease ${delayMs}ms, transform 0.7s ease ${delayMs}ms`,
  })

  const scaleIn = (visible, delayMs = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'scale(1)' : 'scale(0.94)',
    transition: `opacity 0.6s ease ${delayMs}ms, transform 0.6s ease ${delayMs}ms`,
  })

  const featureCards = [
    {
      icon: '📘',
      title: 'AI Study Notes',
      desc: 'Upload study material and get structured, exam-focused notes using AI.',
    },
    {
      icon: '📄',
      title: 'Resume Builder',
      desc: 'Create a professional, placement-ready resume with guided sections and AI assistance.',
    },
    {
      icon: '🎯',
      title: 'Placement Preparation',
      desc: 'Prepare yourself with tools designed for exams, interviews and career readiness.',
    },
  ]

  const steps = [
    {
      num: '01',
      label: 'Upload',
      title: 'Upload your study material',
      desc: 'Students upload their study PDFs or learning material.',
    },
    {
      num: '02',
      label: 'Understand',
      title: 'Get AI-powered insights',
      desc: 'Gemini transforms the material into concise, structured and exam-focused notes.',
    },
    {
      num: '03',
      label: 'Prepare',
      title: 'Build your career',
      desc: 'Create your professional resume and prepare yourself for placements.',
    },
  ]

  const notesFlow = [
    { icon: '📄', label: 'Normal Notes', desc: 'Upload your regular study material, notes or PDF.' },
    { icon: '⚙️', label: 'AI Processing', desc: 'Gemini reads and understands the material.' },
    { icon: '📝', label: 'Last-Minute Short Notes', desc: 'Get concise notes made for quick exam revision.' },
  ]

  const resumeSections = ['Personal Details', 'Education', 'Skills', 'Projects', 'Experience', 'Certifications', 'Achievements']

  return (
    <div className="bg-white text-[#172B35] overflow-x-hidden">
      <Navbar />

      {/* SECTION 1 — HERO (white) */}
      <section ref={heroRef} className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-20 md:pt-20 md:pb-24">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left */}
            <div style={fadeUp(heroInView, 0)}>
              <span className="inline-block text-xs font-semibold tracking-wider text-[#3E7C88] bg-[#EAF6F8] border border-[#DDECEF] rounded-full px-4 py-1.5 mb-6">
                AI-POWERED STUDENT CAREER PLATFORM
              </span>

              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
                Your AI Career Companion
              </h1>

              <p className="text-lg font-medium text-[#172B35] mb-4">
                Prepare for exams. Build your resume. Get placement ready.
              </p>

              <p className="text-[#60747C] text-base leading-relaxed mb-8 max-w-md">
                CareerPrep AI helps students turn study materials into clear, exam-focused
                notes and build professional, placement-ready resumes — all in one place.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <button className="bg-[#172B35] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#243D49] transition-colors">
                    Get Started →
                  </button>
                </Link>
                <Link to="/login">
                  <button className="border border-[#DDECEF] bg-white text-[#172B35] px-6 py-3 rounded-lg font-medium hover:bg-[#EAF6F8] transition-colors">
                    Explore Features
                  </button>
                </Link>
              </div>
            </div>

            {/* Right - UI style visual */}
            <div style={fadeUp(heroInView, 150)}>
              <div className="bg-white border border-[#DDECEF] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B8E3E9]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DDECEF]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DDECEF]"></span>
                  <span className="ml-2 text-xs text-[#60747C] font-medium">CareerPrep AI Dashboard</span>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: 'AI', title: 'AI Study Notes', desc: 'Structured notes from your materials' },
                    { icon: 'CV', title: 'Resume Builder', desc: 'Guided, professional resumes' },
                    { icon: '✓', title: 'Exam Preparation', desc: 'Everything for placement readiness' },
                  ].map((row, i) => (
                    <div
                      key={row.title}
                      className="flex items-center gap-4 rounded-xl border border-[#DDECEF] bg-[#F8FBFC] p-4"
                      style={fadeLeft(heroInView, 250 + i * 100)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#B8E3E9] flex items-center justify-center text-[#172B35] font-semibold text-sm shrink-0">
                        {row.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{row.title}</p>
                        <p className="text-xs text-[#60747C]">{row.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — EVERYTHING YOU NEED IN ONE PLACE (#F8FBFC) */}
      <section ref={featuresRef} className="bg-[#F8FBFC] border-y border-[#DDECEF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <div className="max-w-2xl mb-12" style={fadeUp(featuresInView, 0)}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need in one place
            </h2>
            <p className="text-[#60747C] text-base leading-relaxed">
              CareerPrep AI brings exam preparation and career preparation together,
              so you can study smarter and get placement ready in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featureCards.map((card, i) => (
              <div
                key={card.title}
                className="bg-white border border-[#DDECEF] rounded-2xl p-6 hover:border-[#B8E3E9] transition-colors"
                style={fadeUp(featuresInView, 150 + i * 120)}
              >
                <div className="w-12 h-12 rounded-xl bg-[#B8E3E9] flex items-center justify-center text-xl mb-5">
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-[#60747C] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — HOW CAREERPREP AI WORKS (white) */}
      <section ref={howRef} className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <div className="max-w-2xl mb-14" style={fadeUp(howInView, 0)}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How CareerPrep AI works
            </h2>
            <p className="text-[#60747C] text-base leading-relaxed">
              From study material to placement preparation — everything in a simple flow.
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-10 md:gap-6">
            {steps.map((step, idx, arr) => (
              <div
                key={step.num}
                className="flex-1 flex md:flex-col items-start gap-4 relative"
                style={fadeUp(howInView, 150 + idx * 180)}
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#B8E3E9] text-[#172B35] font-bold flex items-center justify-center text-sm shrink-0">
                    {step.num}
                  </div>
                  {idx < arr.length - 1 && (
                    <div
                      className="hidden md:block h-px bg-[#DDECEF] mt-6 absolute left-1/2 top-6 -z-10"
                      style={{ width: 'calc(100% + 1.5rem)' }}
                    ></div>
                  )}
                </div>
                <div className="md:mt-4">
                  <p className="text-xs font-semibold tracking-wide text-[#3E7C88] mb-1">
                    {step.label.toUpperCase()}
                  </p>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-[#60747C] leading-relaxed max-w-xs">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — TURN YOUR STUDY MATERIAL INTO EXAM-READY NOTES (#F8FBFC, large dedicated section) */}
      <section ref={notesRef} className="bg-[#F8FBFC] border-y border-[#DDECEF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 md:py-24">
          <div className="max-w-2xl mx-auto text-center mb-14" style={fadeUp(notesInView, 0)}>
            <span className="inline-block text-xs font-semibold tracking-wider text-[#3E7C88] bg-white border border-[#DDECEF] rounded-full px-4 py-1.5 mb-5">
              AI STUDY NOTES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Turn your study material into exam-ready notes
            </h2>
            <p className="text-[#60747C] text-base leading-relaxed">
              Upload a PDF and let AI turn it into structured notes built for real exam
              preparation — simplified, organized and ready to revise.
            </p>
          </div>

          {/* Simple 3-step flow: Normal Notes -> AI Processing -> Last-Minute Short Notes */}
          <div
            className="bg-white border border-[#DDECEF] rounded-2xl p-6 sm:p-8 max-w-5xl mx-auto"
            style={fadeUp(notesInView, 120)}
          >
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-5">
              {notesFlow.map((stage, i) => (
                <div key={stage.label} className="flex flex-1 items-center gap-5">
                  <div
                    className="flex-1 rounded-xl border border-[#DDECEF] bg-[#F8FBFC] p-6 text-center"
                    style={scaleIn(notesInView, 200 + i * 150)}
                  >
                    <div className="w-12 h-12 mx-auto rounded-xl bg-[#B8E3E9] flex items-center justify-center text-xl mb-4">
                      {stage.icon}
                    </div>
                    <p className="text-sm font-semibold mb-2">{stage.label}</p>
                    <p className="text-xs text-[#60747C] leading-relaxed">{stage.desc}</p>
                  </div>

                  {i < notesFlow.length - 1 && (
                    <div
                      className="hidden md:flex items-center justify-center text-[#3E7C88] text-xl font-semibold shrink-0"
                      style={fadeUp(notesInView, 350 + i * 150)}
                    >
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10" style={fadeUp(notesInView, 650)}>
            <Link to="/register">
              <button className="bg-[#172B35] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#243D49] transition-colors">
                Try AI Study Notes →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5 — BUILD A RESUME THAT REPRESENTS YOU (white) */}
      <section ref={resumeRef} className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Visual - transformation story */}
            <div style={fadeLeft(resumeInView, 0)} className="order-2 md:order-1">
              <p className="text-xs font-semibold tracking-wider text-[#3E7C88] mb-4">
                FROM STUDENT TO PLACEMENT READY
              </p>

              <div className="relative bg-[#F8FBFC] border border-[#DDECEF] rounded-2xl p-6 overflow-hidden">
                {/* Stage 1: student info tags */}
                <div className="mb-5">
                  <p className="text-[11px] font-semibold text-[#60747C] tracking-wide mb-3">
                    STUDENT INFORMATION
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Education', 'Skills', 'Projects', 'Experience'].map((tag, i) => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-3 py-1.5 rounded-full border border-[#DDECEF] bg-white text-[#172B35]"
                        style={scaleIn(resumeInView, 150 + i * 90)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow / transform indicator */}
                <div
                  className="flex items-center justify-center my-5"
                  style={fadeUp(resumeInView, 500)}
                >
                  <div className="flex items-center gap-2 text-[#3E7C88] text-xs font-semibold">
                    <span className="h-px w-10 bg-[#B8E3E9]"></span>
                    AI TRANSFORMS
                    <span className="h-px w-10 bg-[#B8E3E9]"></span>
                  </div>
                </div>

                {/* Stage 2: resume document */}
                <div
                  className="rounded-xl border border-[#DDECEF] bg-white p-5"
                  style={fadeUp(resumeInView, 650)}
                >
                  <p className="text-[11px] font-semibold text-[#3E7C88] tracking-wide mb-3">
                    PROFESSIONAL RESUME
                  </p>
                  <div className="bg-[#F8FBFC] rounded-lg border border-[#DDECEF] p-4 space-y-2">
                    <div
                      className="h-2.5 bg-[#B8E3E9] rounded w-1/2"
                      style={{ ...scaleIn(resumeInView, 750), transformOrigin: 'left' }}
                    ></div>
                    {resumeSections.slice(0, 4).map((sec, i) => (
                      <div
                        key={sec}
                        className="h-2 bg-[#DDECEF] rounded"
                        style={{
                          width: `${85 - i * 8}%`,
                          ...scaleIn(resumeInView, 820 + i * 80),
                          transformOrigin: 'left',
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div style={fadeRight(resumeInView, 100)} className="order-1 md:order-2">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Build a resume that represents you
              </h2>
              <p className="text-[#60747C] mb-5 leading-relaxed">
                Create your professional resume step by step with sections for:
              </p>
              <ul className="space-y-2 mb-6">
                {resumeSections.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-[#172B35]"
                    style={fadeUp(resumeInView, 200 + i * 60)}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8E3E9] shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-[#60747C] mb-6 leading-relaxed">
                AI assistance can help you write professional summaries and project
                descriptions, so your resume reads as polished as it looks.
              </p>
              <Link to="/register">
                <button className="bg-[#172B35] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#243D49] transition-colors">
                  Build Your Resume →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#172B35] border-t border-[#B8E3E9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 text-center">
          <p className="text-sm font-semibold text-white">CareerPrep AI</p>
          <p className="text-xs text-[#B8E3E9] mt-1">AI-powered student career platform</p>
        </div>
      </footer>
    </div>
  )
}

export default Home