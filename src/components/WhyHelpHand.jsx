import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  GraduationCap, DollarSign, ShieldCheck, Zap, MapPin, Heart,
  TrendingUp, Clock
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { icon: GraduationCap, value: '8+', label: 'Service Categories', color: 'blue' },
  { icon: ShieldCheck, value: '100%', label: 'Background Checked', color: 'emerald' },
  { icon: Clock, value: '17+', label: 'Minimum Age', color: 'violet' },
  { icon: TrendingUp, value: '5★', label: 'Rating Goal', color: 'amber' },
]

const REASONS = [
  {
    icon: DollarSign,
    title: 'Affordable Pricing',
    description: 'College students offer competitive rates without sacrificing quality. Save compared to traditional service providers.',
    color: 'emerald',
  },
  {
    icon: MapPin,
    title: 'Hyperlocal Focus',
    description: 'Serving communities across Alabama. Helpers work close to campus, meaning faster response times.',
    color: 'blue',
  },
  {
    icon: ShieldCheck,
    title: 'Trust Built In',
    description: 'Every helper is identity-verified and background-checked. Two-way reviews keep quality high.',
    color: 'violet',
  },
  {
    icon: Heart,
    title: 'Community Impact',
    description: 'Your jobs directly support college students — helping them earn, learn, and grow while they help you.',
    color: 'rose',
  },
  {
    icon: Zap,
    title: 'Quick & Easy',
    description: 'Post a task in under a minute. Get matched, chat, and have your job done — all in one app.',
    color: 'amber',
  },
  {
    icon: GraduationCap,
    title: 'Skilled Students',
    description: 'From engineering majors to business students — find helpers with the right skills for any task.',
    color: 'sky',
  },
]

const colorLookup = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', glow: 'shadow-blue-500/10', fill: 'bg-blue-500' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/10', fill: 'bg-emerald-500' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', glow: 'shadow-violet-500/10', fill: 'bg-violet-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', glow: 'shadow-amber-500/10', fill: 'bg-amber-500' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', glow: 'shadow-rose-500/10', fill: 'bg-rose-500' },
  sky: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20', glow: 'shadow-sky-500/10', fill: 'bg-sky-500' },
}

/* ============================================ 
   Animated Counter Component
   ============================================ */
function AnimatedStat({ stat, index }) {
  const ref = useRef(null)
  const c = colorLookup[stat.color]
  const Icon = stat.icon

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        delay: index * 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
      })
    })
    return () => ctx.revert()
  }, [index])

  return (
    <div
      ref={ref}
      className={`group glass rounded-2xl p-6 border ${c.border} text-center
        transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${c.glow} cursor-default`}
    >
      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl ${c.bg} flex items-center justify-center
        transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12`}>
        <Icon size={22} className={c.text} />
      </div>
      <p className={`text-3xl font-bold font-display ${c.text}`}>{stat.value}</p>
      <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
    </div>
  )
}

/* ============================================ 
   Reason Card with hover interactions
   ============================================ */
function ReasonCard({ reason, index }) {
  const ref = useRef(null)
  const c = colorLookup[reason.color]
  const Icon = reason.icon

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        delay: index * 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
      })
    })
    return () => ctx.revert()
  }, [index])

  return (
    <div
      ref={ref}
      className="group relative glass rounded-2xl p-6 border border-white/5 cursor-default
        transition-all duration-400 hover:border-white/15 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
    >
      {/* Background gradient on hover */}
      <div className={`absolute -inset-1 bg-gradient-to-br from-transparent ${c.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />

      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center mb-4
          transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
          <Icon size={22} className={c.text} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{reason.title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{reason.description}</p>
      </div>

      {/* Decorative floating dot */}
      <div className={`absolute -top-2 -right-2 w-20 h-20 ${c.fill} rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 blur-xl`} />
    </div>
  )
}

export default function WhyHelpHand() {
  const sectionRef = useRef(null)

  return (
    <section id="why" ref={sectionRef} className="relative py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full glass text-sm text-amber-300">
            <Zap size={14} /> Why Choose Us
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            Why <span className="gradient-text">HelpHand</span>?
          </h2>
          <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
            We're building the most trusted way to connect students with their communities in Alabama.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {STATS.map((stat, i) => (
            <AnimatedStat key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        {/* Reasons Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REASONS.map((reason, i) => (
            <ReasonCard key={reason.title} reason={reason} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
