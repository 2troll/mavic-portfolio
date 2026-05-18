import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, MessageCircle } from 'lucide-react'
import { WHATSAPP } from '../lib/data'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/tours', label: 'Tours' },
  { to: '/about', label: 'About' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/faq', label: 'FAQ' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 glass"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl font-semibold tracking-wide">
          <span className="text-gradient-japan">Tony</span>
          <span className="text-white/60 font-light"> Hanma</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium tracking-wide transition-colors ${
                pathname === l.to ? 'text-japan-red' : 'text-white/60 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white text-sm font-semibold shadow-lg shadow-japan-red/30 hover:shadow-japan-red/50 transition-shadow"
          >
            <MessageCircle size={15} />
            Book Now
          </a>
        </nav>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-white/70 hover:text-white">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-japan-dark/95 border-t border-white/5"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`py-1 font-medium ${pathname === l.to ? 'text-japan-red' : 'text-white/70'}`}
                >
                  {l.label}
                </Link>
              ))}
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white text-sm font-semibold mt-2 justify-center"
              >
                <MessageCircle size={15} />
                Book via WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
