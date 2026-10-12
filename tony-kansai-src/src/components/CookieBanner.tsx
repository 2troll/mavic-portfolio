import { useState, useEffect } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { CONSENT_KEY, ponerConsentimiento } from '../lib/clarity'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

// Clarity se carga en main.tsx en todas las visitas; aquí solo se le pasa el
// consentimiento. Google Analytics sigue el mismo «consent update» de siempre.
function grantAnalytics() {
  window.gtag?.('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'granted',
  })
}

// localStorage puede lanzar (Safari privado, cookies bloqueadas).
function leeEleccion(): string | null {
  try {
    return localStorage.getItem(CONSENT_KEY)
  } catch {
    return null
  }
}

function guardaEleccion(valor: 'accepted' | 'declined') {
  try {
    localStorage.setItem(CONSENT_KEY, valor)
  } catch { /* sin almacenamiento: el banner volverá a salir la próxima vez */ }
}

/** compacto: versión de cristal en una línea para las páginas v7. */
export function CookieBanner({ compacto = false }: { compacto?: boolean } = {}) {
  const { t } = useLanguage()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = leeEleccion()
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
    if (stored === 'accepted') grantAnalytics()
  }, [])

  const accept = () => {
    guardaEleccion('accepted')
    grantAnalytics()
    ponerConsentimiento(true)
    setVisible(false)
  }

  const decline = () => {
    guardaEleccion('declined')
    ponerConsentimiento(false)
    setVisible(false)
  }

  if (compacto) {
    return visible ? (
      <div className="v7-cookies" role="region" aria-label={t.cookie.title}>
        <p>
          {t.cookie.title}.{' '}
          <Link to="/privacy" onClick={decline}>{t.cookie.learn}</Link>
        </p>
        <div>
          <button type="button" onClick={decline}>{t.cookie.decline}</button>
          <button type="button" className="si" onClick={accept}>{t.cookie.accept}</button>
        </div>
      </div>
    ) : null
  }

  // MotionConfig: respeta «reducir movimiento» del sistema (antes lo hacía App).
  return (
    <MotionConfig reducedMotion="user">
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-24 start-4 end-4 md:start-6 md:end-auto md:max-w-xs z-[300] glass border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/60"
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
    </MotionConfig>
  )
}
