import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Clock, DollarSign, Calendar, MapPin, Shield, Star,
  Briefcase, Heart, Users, CheckCircle, ArrowRight
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const TABS = {
  helpers: {
    badge: 'For College Students',
    headline: 'Earn on Your Schedule',
    description: 'Set your own hours, pick jobs that interest you, and build real-world experience while earning great pay — right in your college town.',
    features: [
      { icon: Clock, title: 'Flexible Hours', desc: 'Work around your class schedule. No minimum hours required.' },
      { icon: DollarSign, title: 'Competitive Pay', desc: 'Earn $15–$45/hr depending on the task. Get paid quickly.' },
      { icon: Calendar, title: 'Choose Your Jobs', desc: 'Browse available tasks and accept only the ones that fit you.' },
      { icon: MapPin, title: 'Work Locally', desc: 'All jobs are nearby — no long commutes or travel costs.' },
    ],
    stats: [
      { value: '$25', label: 'Avg. Hourly Rate' },
      { value: '8+', label: 'Job Categories' },
      { value: '4hrs', label: 'Avg. per Job' },
    ],
    color: 'blue',
  },
  customers: {
    badge: 'For Families & Individuals',
    headline: 'Help at Your Fingertips',
    description: 'Post a task, set your budget, and get matched with background-checked college students ready to help — from moving to mowing.',
    features: [
      { icon: Shield, title: 'Verified Helpers', desc: 'Every helper is background-checked and identity-verified.' },
      { icon: Star, title: 'Rated & Reviewed', desc: 'See reviews from other customers before you book.' },
      { icon: Briefcase, title: 'Wide Range of Help', desc: 'Yard work, moving, tutoring, event setup, and more.' },
      { icon: Heart, title: 'Support Students', desc: 'Your jobs help local college students earn and build skills.' },
    ],
    stats: [
      { value: '100%', label: 'Background Checked' },
      { value: '5★', label: 'Rating Goal' },
      { value: '24hr', label: 'Avg. Response' },
    ],
    color: 'emerald',
  },
}

const colorStyles = {
  blue: {
    tabActive: 'bg-blue-500 text-white shadow-lg shadow-blue-500/25',
    badge: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
    iconBg: 'bg-blue-500/10',
    iconText: 'text-blue-400',
    statBg: 'bg-blue-500/10',
    statText: 'text-blue-400',
    accent: 'from-blue-500 to-cyan-500',
  },
  emerald: {
    tabActive: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25',
    badge: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
    iconBg: 'bg-emerald-500/10',
    iconText: 'text-emerald-400',
    statBg: 'bg-emerald-500/10',
    statText: 'text-emerald-400',
    accent: 'from-emerald-500 to-green-500',
  },
}

export default function TwoSided() {
  const [active, setActive] = useState('helpers')
  const contentRef = useRef(null)
  const sectionRef = useRef(null)

  const data = TABS[active]
  const cs = colorStyles[data.color]

  useEffect(() => {
    if (!contentRef.current) return
    gsap.fromTo(
      contentRef.current.children,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' }
    )
  }, [active])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="two-sided" ref={sectionRef} className="relative py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full glass text-sm text-blue-300">
            <Users size={14} /> Two-Sided Marketplace
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            Built for <span className="gradient-text">Everyone</span>
          </h2>
          <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
            Whether you need help or want to help — HelpHand has you covered.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="glass rounded-full p-1.5 inline-flex gap-1">
            {Object.entries(TABS).map(([key, tab]) => {
              const isActive = active === key
              const tc = colorStyles[tab.color]
              return (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`relative px-6 py-3 rounded-full text-sm font-semibold transition-all duration-400 ${
                    isActive
                      ? tc.tabActive
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {key === 'helpers' ? '🎓 Helpers' : '🏠 Customers'}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left: Info */}
          <div>
            <div className={`inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border text-xs font-medium ${cs.badge}`}>
              {data.badge}
            </div>
            <h3 className="text-3xl font-display font-bold text-white mb-4">{data.headline}</h3>
            <p className="text-slate-400 leading-relaxed mb-8">{data.description}</p>

            {/* Stats */}
            <div className="flex gap-4 mb-8">
              {data.stats.map((stat) => (
                <div key={stat.label} className={`flex-1 glass rounded-xl p-4 text-center border border-white/5`}>
                  <p className={`text-2xl font-bold font-display ${cs.statText}`}>{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 text-sm text-slate-500">
              <CheckCircle size={16} className="text-emerald-400" />
              Available at launch
            </div>
          </div>

          {/* Right: Features Grid */}
          <div className="grid gap-4">
            {data.features.map((feat, i) => {
              const Icon = feat.icon
              return (
                <div
                  key={feat.title}
                  className="group glass rounded-xl p-5 border border-white/5 flex gap-4 items-start cursor-default
                    transition-all duration-300 hover:border-white/15 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className={`w-11 h-11 rounded-lg ${cs.iconBg} flex-shrink-0 flex items-center justify-center
                    transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    <Icon size={20} className={cs.iconText} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
                      {feat.title}
                      <ArrowRight size={12} className={`${cs.iconText} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
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
