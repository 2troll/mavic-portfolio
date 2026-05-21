import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { LANG_META } from '../lib/i18n'
import type { Lang } from '../lib/i18n'

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const current = LANG_META[lang]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg glass border border-white/10 text-sm text-white/70 hover:text-white hover:border-white/25 transition-all"
        aria-label="Change language"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="font-semibold text-xs tracking-wide">{current.label}</span>
        <ChevronDown
          size={11}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.13 }}
            className="absolute top-full mt-2 right-0 bg-japan-surface border border-white/12 rounded-xl overflow-hidden shadow-2xl shadow-black/50 min-w-[110px] z-[100]"
          >
            {(Object.keys(LANG_META) as Lang[]).map((l) => (
              <button
                key={l}
                onMouseDown={() => { setLang(l); setOpen(false) }}
                className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-left transition-colors ${
                  l === lang
                    ? 'bg-japan-red/15 text-white'
                    : 'text-white/55 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-base leading-none">{LANG_META[l].flag}</span>
                <span className="font-semibold text-xs tracking-wide">{LANG_META[l].label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
