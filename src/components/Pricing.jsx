import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check, ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Pricing() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.price-heading', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.price-heading', start: 'top 85%', once: true },
      })

      gsap.from('.price-card', {
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.price-cards', start: 'top 80%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative py-28 sm:py-36 overflow-hidden"
    >
      <div className="section-divider mb-28" />

      <div className="orb orb--blue w-[400px] h-[400px] top-40 right-20 opacity-15" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="price-heading text-center mb-16">
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-blue-400 font-medium mb-4">
            Simple Pricing
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-5">
            Transparent. <span className="gradient-text">Affordable.</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Customers post for free. Helpers pay a small fee per accepted job. 
            No subscriptions, no hidden costs.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="price-cards grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Customer Card */}
          <div className="price-card glass rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-medium">
              For Customers
            </span>
            
            <div className="mt-4 mb-6">
              <span className="font-display text-5xl font-bold text-white">Free</span>
              <p className="text-sm text-slate-400 mt-2">No cost to post jobs or hire helpers</p>
            </div>

            <div className="space-y-3 mb-8">
              {[
                'Post unlimited jobs',
                'Browse helper profiles',
                'In-app messaging',
                'Leave reviews & ratings',
                'Background-checked helpers',
                'Choose from matched helpers',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <a
              href="https://gethelphand.com"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn-outline w-full justify-center text-sm"
            >
              Post a Job <ArrowRight size={16} />
            </a>
          </div>

          {/* Helper Card */}
          <div className="price-card glass rounded-2xl p-8 relative overflow-hidden gradient-border">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            
            {/* Popular badge */}
            <div className="absolute top-4 right-4 text-[10px] uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full">
              Earn Money
            </div>

            <span className="text-xs uppercase tracking-wider text-blue-400 font-medium">
              For Helpers
            </span>
            
            <div className="mt-4 mb-2">
              <span className="font-display text-5xl font-bold text-white">$3</span>
              <span className="text-slate-400 text-lg ml-1">/ job</span>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              $5 for jobs over 1 hour · First job is free
            </p>

            <div className="space-y-3 mb-8">
              {[
                'First job completely free',
                'Set your own hourly rate',
                'Choose jobs that fit your schedule',
                'Build your profile & reputation',
                'In-app messaging with customers',
                'Accept or decline any job',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                  <Check size={16} className="text-blue-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <a
              href="https://gethelphand.com"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn w-full justify-center text-sm"
            >
              Start Earning <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
