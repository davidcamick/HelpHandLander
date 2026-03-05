import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { UserPlus, Search, MessageCircle, Star, ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    icon: UserPlus,
    title: 'Create Your Account',
    description: 'Sign up as a Helper or Customer in seconds. Verify your identity for a trusted, secure experience.',
    color: 'blue',
    detail: 'Email + .edu verification',
  },
  {
    icon: Search,
    title: 'Post or Find a Job',
    description: 'Customers post tasks with details and pay. Helpers browse available jobs that fit their skills and schedule.',
    color: 'violet',
    detail: 'Smart category matching',
  },
  {
    icon: MessageCircle,
    title: 'Connect & Coordinate',
    description: 'Use in-app messaging to discuss details, set expectations, and confirm timing before the job starts.',
    color: 'emerald',
    detail: 'Built-in chat + scheduling',
  },
  {
    icon: Star,
    title: 'Complete & Review',
    description: 'Once the job is done, payment is released and both parties leave reviews to build trust in the community.',
    color: 'amber',
    detail: 'Two-way rating system',
  },
]

const colorMap = {
  blue: { bg: 'bg-blue-500/15', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-blue-500/20', dotBg: 'bg-blue-500', dotGlow: 'shadow-blue-400' },
  violet: { bg: 'bg-violet-500/15', border: 'border-violet-500/30', text: 'text-violet-400', glow: 'shadow-violet-500/20', dotBg: 'bg-violet-500', dotGlow: 'shadow-violet-400' },
  emerald: { bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'shadow-emerald-500/20', dotBg: 'bg-emerald-500', dotGlow: 'shadow-emerald-400' },
  amber: { bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-400', glow: 'shadow-amber-500/20', dotBg: 'bg-amber-500', dotGlow: 'shadow-amber-400' },
}

export default function HowItWorks() {
  const sectionRef = useRef(null)
  const lineRef = useRef(null)
  const [activeStep, setActiveStep] = useState(-1)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the progress line growing
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 70%',
            scrub: 0.5,
          },
        }
      )

      // Animate each step card
      STEPS.forEach((_, i) => {
        const el = sectionRef.current.querySelector(`[data-step="${i}"]`)
        if (!el) return

        gsap.from(el, {
          x: i % 2 === 0 ? -60 : 60,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            onEnter: () => setActiveStep((prev) => Math.max(prev, i)),
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full glass text-sm text-emerald-300">
            <ArrowRight size={14} /> Simple 4-Step Process
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            How <span className="gradient-text">HelpHand</span> Works
          </h2>
          <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
            From sign-up to five-star review — getting help (or earning money) couldn't be simpler.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block">
            <div className="absolute inset-0 bg-white/5 rounded-full" />
            <div
              ref={lineRef}
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-500 via-violet-500 via-emerald-500 to-amber-400 rounded-full origin-top"
              style={{ height: '100%' }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-16 md:space-y-24">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              const c = colorMap[step.color]
              const isLeft = i % 2 === 0
              const isActive = activeStep >= i

              return (
                <div
                  key={i}
                  data-step={i}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Card */}
                  <div className={`flex-1 ${isLeft ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'}`}>
                    <div
                      className={`group glass rounded-2xl p-6 border transition-all duration-500 cursor-default hover:scale-[1.02] ${
                        isActive ? `${c.border} shadow-lg ${c.glow}` : 'border-white/5'
                      }`}
                    >
                      <div className={`inline-flex items-center gap-3 mb-4 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                        <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center transition-transform duration-300 group-hover:rotate-12`}>
                          <Icon size={22} className={c.text} />
                        </div>
                        <div>
                          <span className={`text-xs font-medium ${c.text} uppercase tracking-wider`}>Step {i + 1}</span>
                          <h3 className="text-xl font-bold text-white mt-0.5">{step.title}</h3>
                        </div>
                      </div>
                      <p className="text-slate-400 leading-relaxed text-sm">{step.description}</p>
                      <div className={`mt-4 inline-flex items-center gap-2 text-xs ${c.text} px-3 py-1.5 rounded-full ${c.bg} border ${c.border}`}>
                        {step.detail}
                      </div>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
                    <div
                      className={`w-5 h-5 rounded-full border-4 border-slate-950 transition-all duration-500 ${
                        isActive ? `${c.dotBg} shadow-lg ${c.dotGlow}` : 'bg-slate-700'
                      }`}
                    />
                  </div>

                  {/* Spacer for the other side */}
                  <div className="flex-1 hidden md:block" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
