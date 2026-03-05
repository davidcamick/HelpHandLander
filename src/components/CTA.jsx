import { useEffect, useRef, useState, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Clock, Mail, Rocket, Sparkles } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/* ============================================
   Countdown Timer Hook
   ============================================ */
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime()
      const diff = targetDate.getTime() - now
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return timeLeft
}

/* ============================================
   Countdown Flip Unit
   ============================================ */
function CountdownUnit({ value, label }) {
  const prevRef = useRef(value)
  const unitRef = useRef(null)

  useEffect(() => {
    if (prevRef.current !== value && unitRef.current) {
      gsap.fromTo(
        unitRef.current,
        { scale: 1.1, rotateX: -10 },
        { scale: 1, rotateX: 0, duration: 0.4, ease: 'back.out(2)' }
      )
      prevRef.current = value
    }
  }, [value])

  return (
    <div className="flex flex-col items-center">
      <div
        ref={unitRef}
        className="glass rounded-xl w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center border border-white/10
          shadow-lg shadow-blue-500/5"
        style={{ perspective: '400px' }}
      >
        <span className="text-3xl sm:text-4xl font-bold font-display text-white tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs text-slate-500 mt-2 uppercase tracking-wider font-medium">{label}</span>
    </div>
  )
}

/* ============================================
   Floating Sparkles Background
   ============================================ */
function FloatingSparkles() {
  const sparkles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 2 + Math.random() * 3,
      isBlue: Math.random() > 0.5,
    })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className={`absolute rounded-full ${s.isBlue ? 'bg-blue-400' : 'bg-emerald-400'}`}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: 0.15,
            animation: `float ${s.duration}s ${s.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  )
}

/* ============================================
   Main CTA
   ============================================ */
export default function CTA() {
  const sectionRef = useRef(null)
  // Set launch date ~60 days from now (adjust as needed)
  const launchDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 60)
    return d
  }, [])

  const countdown = useCountdown(launchDate)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-content > *', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="cta" ref={sectionRef} className="relative py-28 overflow-hidden">
      <FloatingSparkles />

      <div className="orb orb--blue w-[500px] h-[500px] top-0 right-[-15%] opacity-40" />
      <div className="orb orb--green w-[400px] h-[400px] bottom-0 left-[-10%] opacity-30" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="cta-content text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full glass text-sm text-blue-300">
            <Rocket size={14} className="animate-bounce" />
            Launching Soon in Alabama
          </div>

          {/* Heading */}
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Something <span className="gradient-text">Big</span> is Coming
          </h2>

          <p className="mt-5 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            HelpHand is almost here. The easiest way to find reliable, local help from
            college students — or earn money on your schedule.
          </p>

          {/* Countdown */}
          <div className="flex justify-center gap-4 sm:gap-6 mt-12 mb-12">
            <CountdownUnit value={countdown.days} label="Days" />
            <CountdownUnit value={countdown.hours} label="Hours" />
            <CountdownUnit value={countdown.minutes} label="Minutes" />
            <CountdownUnit value={countdown.seconds} label="Seconds" />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="cta-btn text-base cursor-default">
              <Clock size={18} /> Coming Soon
            </span>
            <a
              href="mailto:ty@gethelphand.com"
              className="cta-btn-outline text-base"
            >
              <Mail size={18} /> Contact Us
            </a>
          </div>

          {/* Sub-note */}
          <p className="mt-8 text-sm text-slate-600 flex items-center justify-center gap-2">
            <Sparkles size={14} className="text-blue-500" />
            Be the first to know when we launch
          </p>
        </div>
      </div>
    </section>
  )
}
