import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const CONSENT_KEY = 'tony-cookie-consent'

function grantAnalytics() {
  window.gtag?.('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'granted',
  })
}

export function CookieBanner() {
  const { t } = useLanguage()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
    if (stored === 'accepted') grantAnalytics()
  }, [])

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    grantAnalytics()
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-24 left-4 right-4 md:left-6 md:right-auto md:max-w-xs z-[300] glass border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/60"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        >
          <p className="text-sm font-semibold text-white mb-1.5">{t.cookie.title}</p>
          <p className="text-xs text-white/55 leading-relaxed mb-4">
            {t.cookie.body}{' '}
            <Link
              to="/privacy"
              className="text-japan-red underline underline-offset-2 hover:text-japan-orange transition-colors"
              onClick={decline}
            >
              {t.cookie.learn}
            </Link>
          </p>
          <div className="flex gap-2">
            <button
              onClick={accept}
              className="flex-1 py-2 rounded-xl bg-japan-red text-white text-xs font-semibold hover:bg-japan-red/85 transition-colors"
            >
              {t.cookie.accept}
            </button>
            <button
              onClick={decline}
              className="flex-1 py-2 rounded-xl glass border border-white/10 text-white/55 text-xs font-semibold hover:text-white transition-colors"
            >
              {t.cookie.decline}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
