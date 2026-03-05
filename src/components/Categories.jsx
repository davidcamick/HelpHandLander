import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Scissors, // Yard work
  Truck,    // Moving help
  FolderOpen, // Organization
  Dog,      // Dog Walking
  Sofa,     // Furniture Assembly
  GraduationCap, // Tutoring
  Trash2,   // Dump Runs
  PartyPopper,  // Event Setup
  ArrowUpRight,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const CATEGORIES = [
  { icon: Scissors, name: 'Yard Work', desc: 'Mowing, trimming, leaf cleanup, garden maintenance', color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', example: '$20–$35/hr' },
  { icon: Truck, name: 'Moving Help', desc: 'Loading, unloading, packing, heavy lifting', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', example: '$22–$40/hr' },
  { icon: FolderOpen, name: 'Organization', desc: 'Closet, garage, and storage organization', color: 'from-violet-500 to-purple-600', bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', example: '$18–$30/hr' },
  { icon: Dog, name: 'Dog Walking', desc: 'Daily walks, pet sitting, backyard playtime', color: 'from-amber-400 to-orange-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', example: '$15–$25/hr' },
  { icon: Sofa, name: 'Furniture Assembly', desc: 'IKEA builds, shelves, desks, bed frames', color: 'from-rose-500 to-pink-600', bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', example: '$20–$35/hr' },
  { icon: GraduationCap, name: 'Tutoring', desc: 'K–12 and college tutoring across subjects', color: 'from-sky-400 to-blue-600', bg: 'bg-sky-500/10', border: 'border-sky-500/20', text: 'text-sky-400', example: '$18–$35/hr' },
  { icon: Trash2, name: 'Dump Runs', desc: 'Junk hauling, debris removal, donation drop-offs', color: 'from-slate-400 to-zinc-600', bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-400', example: '$25–$45/hr' },
  { icon: PartyPopper, name: 'Event Setup', desc: 'Decorating, setup, teardown, party prep', color: 'from-fuchsia-500 to-violet-600', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20', text: 'text-fuchsia-400', example: '$20–$35/hr' },
]

function CategoryCard({ cat, index }) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from(el, {
        y: 50,
        opacity: 0,
        duration: 0.6,
        delay: index * 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      })
    })
    return () => ctx.revert()
  }, [index])

  const Icon = cat.icon

  return (
    <div
      ref={cardRef}
      className={`group relative glass rounded-2xl p-6 border cursor-default
        transition-all duration-500 hover:border-white/20 hover:shadow-xl hover:-translate-y-2
        ${cat.border}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient glow on hover */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cat.color} opacity-0
          transition-opacity duration-500 ${isHovered ? 'opacity-[0.04]' : ''}`}
      />

      <div className="relative z-10">
        <div className={`w-14 h-14 rounded-xl ${cat.bg} flex items-center justify-center mb-4
          transition-all duration-500 ${isHovered ? 'scale-110 rotate-6' : ''}`}>
          <Icon size={26} className={`${cat.text} transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`} />
        </div>

        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          {cat.name}
          <ArrowUpRight
            size={14}
            className={`${cat.text} transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-x-0.5 -translate-y-0.5' : 'opacity-0'
            }`}
          />
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">{cat.desc}</p>

        <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${cat.bg} ${cat.text} border ${cat.border}`}>
          {cat.example}
        </div>
      </div>
    </div>
  )
}

export default function Categories() {
  return (
    <section id="categories" className="relative py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full glass text-sm text-violet-300">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            8+ Categories
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            What Can You <span className="gradient-text">Get Help</span> With?
          </h2>
          <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
            From yard work to tutoring — find college students ready to tackle your to-do list.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.name} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
