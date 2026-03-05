import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShieldCheck, UserCheck, MessageSquare, Star, Lock, Eye, Fingerprint } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  { icon: Fingerprint, title: 'Identity Verification', desc: 'Every helper verifies their identity with a valid ID and .edu email address. Know exactly who is showing up.', color: 'blue' },
  { icon: ShieldCheck, title: 'Background Checks', desc: 'Comprehensive background screening before any helper can accept jobs. Your safety is non-negotiable.', color: 'emerald' },
  { icon: Star, title: 'Two-Way Reviews', desc: 'Both helpers and customers rate each other after every job. Transparency builds trust over time.', color: 'amber' },
  { icon: MessageSquare, title: 'In-App Communication', desc: 'All messaging happens within HelpHand. Coordinate safely without sharing personal contact info.', color: 'violet' },
]

const colorMap = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/25', pill: 'bg-blue-500', ring: 'border-blue-400/40' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/25', pill: 'bg-emerald-500', ring: 'border-emerald-400/40' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/25', pill: 'bg-amber-500', ring: 'border-amber-400/40' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/25', pill: 'bg-violet-500', ring: 'border-violet-400/40' },
}

/* ============================================
   Animated Shield Composition
   ============================================ */
function ShieldComposition() {
  const shieldRef = useRef(null)
  const mainRef = useRef(null)
  const badgesRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main shield pop-in
      if (mainRef.current) {
        gsap.from(mainRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: { trigger: shieldRef.current, start: 'top 75%' },
        })

        // Gentle float
        gsap.to(mainRef.current, {
          y: -8,
          duration: 3,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        })
      }

      // Orbiting badges
      badgesRef.current.forEach((badge, i) => {
        if (!badge) return
        gsap.from(badge, {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          delay: i * 0.15,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: shieldRef.current, start: 'top 70%' },
        })
      })
    }, shieldRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={shieldRef} className="relative w-full h-80 flex items-center justify-center">
      {/* Outer glow rings */}
      <div className="absolute w-64 h-64 rounded-full border border-blue-500/10 animate-pulse" />
      <div className="absolute w-48 h-48 rounded-full border border-emerald-500/10" style={{ animation: 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite' }} />

      {/* Main Shield */}
      <div ref={mainRef} className="relative z-10 w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-2xl shadow-blue-500/20">
        <ShieldCheck size={48} className="text-white" />
      </div>

      {/* Orbiting Badges */}
      <div ref={el => badgesRef.current[0] = el} className="absolute top-6 left-1/4 glass rounded-full px-3 py-1.5 flex items-center gap-2 text-xs">
        <Lock size={12} className="text-blue-400" />
        <span className="text-slate-300">Encrypted</span>
      </div>
      <div ref={el => badgesRef.current[1] = el} className="absolute top-10 right-1/4 glass rounded-full px-3 py-1.5 flex items-center gap-2 text-xs">
        <Eye size={12} className="text-emerald-400" />
        <span className="text-slate-300">Verified</span>
      </div>
      <div ref={el => badgesRef.current[2] = el} className="absolute bottom-10 left-1/3 glass rounded-full px-3 py-1.5 flex items-center gap-2 text-xs">
        <UserCheck size={12} className="text-violet-400" />
        <span className="text-slate-300">Checked</span>
      </div>
      <div ref={el => badgesRef.current[3] = el} className="absolute bottom-6 right-1/3 glass rounded-full px-3 py-1.5 flex items-center gap-2 text-xs">
        <Star size={12} className="text-amber-400" />
        <span className="text-slate-300">Rated</span>
      </div>
    </div>
  )
}

export default function TrustSafety() {
  const sectionRef = useRef(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="trust" ref={sectionRef} className="relative py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full glass text-sm text-emerald-300">
            <ShieldCheck size={14} /> Your Safety Matters
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            Trust & <span className="gradient-text">Safety</span>
          </h2>
          <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
            Every interaction on HelpHand is backed by multiple layers of protection.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Shield Visual */}
          <ShieldComposition />

          {/* Feature Cards */}
          <div className="grid gap-4">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon
              const c = colorMap[feat.color]
              const isHovered = hoveredIndex === i

              return (
                <div
                  key={feat.title}
                  ref={el => cardsRef.current[i] = el}
                  className={`group glass rounded-xl p-5 border cursor-default
                    transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg
                    ${isHovered ? c.border : 'border-white/5'}`}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-lg ${c.bg} flex-shrink-0 flex items-center justify-center
                      transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                      <Icon size={20} className={c.text} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm mb-1">{feat.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
