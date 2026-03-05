import { Phone, Mail, MapPin } from 'lucide-react'

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradFooter" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B82F6"/>
        <stop offset="1" stopColor="#10B981"/>
      </linearGradient>
    </defs>
    <rect width="36" height="36" rx="10" fill="url(#logoGradFooter)"/>
    <path d="M11 12.5C11 11.672 11.672 11 12.5 11H16V17H12.5C11.672 17 11 16.328 11 15.5V12.5Z" fill="white" fillOpacity="0.9"/>
    <path d="M20 11H23.5C24.328 11 25 11.672 25 12.5V15.5C25 16.328 24.328 17 23.5 17H20V11Z" fill="white" fillOpacity="0.9"/>
    <rect x="11" y="19" width="14" height="2.5" rx="1.25" fill="white" fillOpacity="0.9"/>
    <rect x="16" y="11" width="4" height="15" rx="1" fill="white" fillOpacity="0.7"/>
  </svg>
)

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Categories', href: '#categories' },
      { label: 'Trust & Safety', href: '#trust' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About HelpHand', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Blog', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Logo />
              <span className="font-display text-lg font-bold text-white">HelpHand</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-6">
              Connecting college students seeking flexible work with families and 
              individuals who need trusted, task-based help.
            </p>
            
            {/* Contact info */}
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-3">
                <MapPin size={14} className="text-slate-500 shrink-0" />
                <span>Alabama</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-slate-500 shrink-0" />
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <span>Ty Nelson: (615) 957-6652</span>
                  <span>Troup Wallace: (615) 974-4663</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-slate-500 shrink-0" />
                <a href="https://gethelphand.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  gethelphand.com
                </a>
              </div>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group, i) => (
            <div key={i}>
              <h4 className="text-white font-semibold text-sm mb-4">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link, j) => (
                  <li key={j}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="gradient-line mb-6" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} HelpHand LLC. All rights reserved.</p>
          <p>Designed & built with care in Alabama</p>
        </div>
      </div>
    </footer>
  )
}
