import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Categories from './components/Categories'
import WhyHelpHand from './components/WhyHelpHand'
import TwoSided from './components/TwoSided'
import TrustSafety from './components/TrustSafety'
import CTA from './components/CTA'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Add landing-page class to body for dark theme scoping
    document.body.classList.add('landing-page')
    return () => document.body.classList.remove('landing-page')
  }, [])

  useEffect(() => {
    // Short loading delay for cinematic entrance
    const timer = setTimeout(() => setLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!loaded) return

    // Counter animation for stats
    const ctx = gsap.context(() => {
      const counters = document.querySelectorAll('[data-count]')
      counters.forEach(el => {
        const raw = el.getAttribute('data-count')
        const numeric = parseFloat(raw.replace(/[^0-9.]/g, ''))
        const suffix = raw.replace(/[0-9.]/g, '')
        const obj = { val: 0 }

        gsap.to(obj, {
          val: numeric,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            el.textContent = Math.floor(obj.val) + suffix
          },
        })
      })
    })

    return () => ctx.revert()
  }, [loaded])

  return (
    <div className={`min-h-screen transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Categories />
      <TwoSided />
      <WhyHelpHand />
      <TrustSafety />
      <CTA />
      <Footer />
    </div>
  )
}

export default App
