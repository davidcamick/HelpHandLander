import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Menu, X } from 'lucide-react'

const Logo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B82F6"/>
        <stop offset="1" stopColor="#10B981"/>
      </linearGradient>
    </defs>
    <rect width="36" height="36" rx="10" fill="url(#logoGrad)"/>
    <path d="M11 12.5C11 11.672 11.672 11 12.5 11H16V17H12.5C11.672 17 11 16.328 11 15.5V12.5Z" fill="white" fillOpacity="0.9"/>
    <path d="M20 11H23.5C24.328 11 25 11.672 25 12.5V15.5C25 16.328 24.328 17 23.5 17H20V11Z" fill="white" fillOpacity="0.9"/>
    <rect x="11" y="19" width="14" height="2.5" rx="1.25" fill="white" fillOpacity="0.9"/>
    <rect x="16" y="11" width="4" height="15" rx="1" fill="white" fillOpacity="0.7"/>
  </svg>
)

const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Categories', href: '#categories' },
  { label: 'For You', href: '#two-sided' },
  { label: 'Trust', href: '#trust' },
]

export default function Navbar() {
  const navRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-3 bg-[#0A1628]/80 backdrop-blur-xl border-b border-white/5'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <Logo />
          <span className="font-display text-xl font-bold text-white tracking-tight group-hover:opacity-80 transition-opacity">
            HelpHand
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-slate-300 hover:text-white transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-blue-500 after:to-emerald-500 hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Coming Soon Badge */}
        <div className="hidden md:flex items-center gap-4">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm text-emerald-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-glow" />
            Coming Soon
          </span>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0A1628]/95 backdrop-blur-xl border-b border-white/5 py-6 px-6 space-y-4">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-slate-300 hover:text-white transition-colors py-2"
            >
              {link.label}
            </a>
          ))}
          <span className="inline-flex items-center justify-center gap-2 w-full mt-4 px-5 py-2.5 rounded-full glass text-sm text-emerald-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-glow" />
            Coming Soon
          </span>
        </div>
      )}
    </nav>
  )
}
