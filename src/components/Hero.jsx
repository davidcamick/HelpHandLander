import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { Shield, Star, Zap, Clock } from 'lucide-react'

/* ============================================
   Particle Field — Interactive canvas starfield
   ============================================ */
function ParticleField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animFrame
    let particles = []
    let mouse = { x: -9999, y: -9999 }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const COUNT = 70
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.5,
        isBlue: Math.random() > 0.5,
      })
    }

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const handleLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    canvas.addEventListener('mousemove', handleMouse)
    canvas.addEventListener('mouseleave', handleLeave)

    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      particles.forEach((p, i) => {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 140) {
          const force = (140 - dist) / 140
          p.vx += (dx / dist) * force * 0.25
          p.vy += (dy / dist) * force * 0.25
        }

        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.99
        p.vy *= 0.99

        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        const alpha = 0.4 + Math.sin(Date.now() * 0.002 + i) * 0.2
        const color = p.isBlue ? `rgba(59,130,246,${alpha})` : `rgba(16,185,129,${alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const d = Math.hypot(p.x - p2.x, p.y - p2.y)
          if (d < 100) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(59,130,246,${0.07 * (1 - d / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      animFrame = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouse)
      canvas.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6, zIndex: 1 }}
    />
  )
}

/* ============================================
   Typing Effect Hook
   ============================================ */
function useTypingEffect(phrases, typingSpeed = 80, deletingSpeed = 40, pauseTime = 2000) {
  const [text, setText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex]
    let timeout

    if (!isDeleting && text === currentPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), pauseTime)
    } else if (isDeleting && text === '') {
      setIsDeleting(false)
      setPhraseIndex((prev) => (prev + 1) % phrases.length)
    } else {
      timeout = setTimeout(() => {
        setText(
          isDeleting
            ? currentPhrase.substring(0, text.length - 1)
            : currentPhrase.substring(0, text.length + 1)
        )
      }, isDeleting ? deletingSpeed : typingSpeed)
    }

    return () => clearTimeout(timeout)
  }, [text, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseTime])

  return text
}

/* ============================================
   3D Tilt Card
   ============================================ */
function TiltCard({ children, className }) {
  const ref = useRef(null)

  const handleMove = useCallback((e) => {
    const card = ref.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    card.style.transform = `perspective(600px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) scale(1.03)`
  }, [])

  const handleLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)'
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{ transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1)' }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  )
}

/* ============================================
   Main Hero
   ============================================ */
export default function Hero() {
  const heroRef = useRef(null)
  const headlineRef = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)
  const vignetteRef = useRef(null)

  const typedText = useTypingEffect([
    'Yard Work',
    'Moving Help',
    'Tutoring',
    'Dog Walking',
    'Event Setup',
    'Dump Runs',
    'Furniture Assembly',
    'Organization',
  ], 90, 50, 1800)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from(headlineRef.current.children, { y: 80, opacity: 0, duration: 1, stagger: 0.12 })
        .from(subRef.current, { y: 40, opacity: 0, duration: 0.8 }, '-=0.5')
        .from(ctaRef.current.children, { y: 30, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.4')
        .from(vignetteRef.current, { x: 80, opacity: 0, duration: 1, ease: 'power2.out' }, '-=0.8')
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      <ParticleField />
      <div className="orb orb--blue w-[600px] h-[600px] -top-40 -left-40 opacity-60" />
      <div className="orb orb--green w-[500px] h-[500px] bottom-0 right-[-10%] opacity-40" />
      <div className="orb orb--purple w-[400px] h-[400px] top-1/3 left-1/2 opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full glass text-sm text-blue-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-glow" />
              Launching soon in Alabama
            </div>

            <div ref={headlineRef} className="overflow-hidden">
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white">
                <span className="block">Local Help.</span>
                <span className="block gradient-text">Trusted Hands.</span>
              </h1>
            </div>

            <div className="mt-5 h-10 flex items-center">
              <span className="text-lg sm:text-xl text-slate-500 mr-2">Need help with</span>
              <span className="text-lg sm:text-xl text-blue-400 font-semibold font-display">{typedText}</span>
              <span className="w-[2px] h-6 bg-blue-400 ml-0.5 animate-pulse" />
            </div>

            <p ref={subRef} className="mt-4 text-lg sm:text-xl text-slate-400 leading-relaxed max-w-xl">
              HelpHand connects college students looking for flexible work with families
              and individuals who need reliable, task-based help.
            </p>

            <div ref={ctaRef} className="flex flex-wrap items-center gap-4 mt-10">
              <span className="cta-btn text-base cursor-default"><Clock size={18} /> Coming Soon</span>
              <a href="#how-it-works" className="cta-btn-outline text-base">See How It Works</a>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-10 text-sm text-slate-500">
              <span className="flex items-center gap-2"><Shield size={16} className="text-emerald-400" />Background Checked</span>
              <span className="flex items-center gap-2"><Star size={16} className="text-amber-400" />Reviewed & Rated</span>
              <span className="flex items-center gap-2"><Zap size={16} className="text-blue-400" />Easy Booking</span>
            </div>
          </div>

          <div ref={vignetteRef} className="relative hidden lg:block">
            <VignetteComposition />
          </div>
        </div>
      </div>
    </section>
  )
}

function VignetteComposition() {
  return (
    <div className="relative w-full h-[560px]">
      <TiltCard className="absolute top-8 left-4 w-72 glass rounded-2xl p-5 animate-float shadow-2xl shadow-blue-500/10 cursor-default">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">JM</div>
          <div>
            <p className="text-white font-semibold text-sm">Jordan Mitchell</p>
            <p className="text-xs text-slate-400">UAB · Senior · 4.9 ★</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {['Yard Work', 'Moving', 'Dump Runs'].map(tag => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">{tag}</span>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/5 pt-3">
          <span>12 jobs completed</span>
          <span className="text-emerald-400 font-medium">Available now</span>
        </div>
      </TiltCard>

      <TiltCard className="absolute top-48 right-0 w-64 glass rounded-2xl p-4 animate-float-delayed shadow-2xl shadow-emerald-500/10 cursor-default">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center"><Zap size={16} className="text-emerald-400" /></div>
          <p className="text-white text-sm font-medium">New Job Posted</p>
        </div>
        <p className="text-xs text-slate-400 mb-2">Moving Help — 2 hrs</p>
        <p className="text-xs text-slate-500 mb-3">Need help moving furniture from apartment to storage unit.</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white">$25/hr</span>
          <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">3 helpers needed</span>
        </div>
      </TiltCard>

      <div className="absolute bottom-24 left-8 glass rounded-full px-4 py-2.5 flex items-center gap-3 animate-float shadow-lg">
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-400"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        </div>
        <div>
          <p className="text-xs text-white font-medium">Job Accepted!</p>
          <p className="text-[10px] text-slate-400">Jordan is on the way</p>
        </div>
      </div>

      <TiltCard className="absolute bottom-4 right-4 w-52 glass rounded-xl p-3 animate-float-delayed cursor-default">
        <div className="flex gap-1 mb-1">
          {[1,2,3,4,5].map(i => (<Star key={i} size={12} className="text-amber-400 fill-amber-400" />))}
        </div>
        <p className="text-[10px] text-slate-300 leading-relaxed">"Jordan was amazing! Moved everything in under 2 hours."</p>
        <p className="text-[9px] text-slate-500 mt-1">— Sarah K.</p>
      </TiltCard>
    </div>
  )
}
