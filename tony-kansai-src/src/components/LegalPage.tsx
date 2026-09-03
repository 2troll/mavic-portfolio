import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { PageSEO } from './PageSEO'
import { useLanguage } from '../contexts/LanguageContext'

const CONTACT_WA = 'https://wa.me/34634193106'

interface Props {
  /** Ya traducido por quien llama. */
  title: string
  description: string
  path: string
  icon: ReactNode
  /** Fecha de última revisión, en inglés ('May 2026'): se traduce aquí. */
  updated: string
  /** Resumen en el recuadro de arriba, ya traducido. */
  intro: ReactNode
  children: ReactNode
}

/**
 * Carcasa común de las páginas legales (aviso legal, privacidad, cookies,
 * seguridad, accesibilidad y términos). Antes cada una repetía la cabecera,
 * el pie y los componentes Section/Li; ahora se cambian en un sitio.
 */
export function LegalPage({ title, description, path, icon, updated, intro, children }: Props) {
  const { tc } = useLanguage()

  return (
    <>
      <PageSEO title={title} description={description} path={path} />
      <section className="relative pt-32 pb-28 min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-japan-dark to-japan-surface pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto px-6">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-10 h-10 rounded-xl bg-japan-red/15 flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
            <div>
              <h1 className="font-serif text-3xl font-semibold text-white">{title}</h1>
              <p className="text-xs text-white/50 mt-0.5">{tc('Last updated')}: {tc(updated)}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="prose-custom space-y-8 text-white/70 text-sm leading-relaxed"
          >
            <div className="glass rounded-xl border border-white/6 p-5 text-white/55 text-xs">
              {intro}
            </div>

            {children}

            <LegalFooterLinks current={path} />
          </motion.div>
        </div>
      </section>
    </>
  )
}

/** Las seis páginas legales se enlazan entre sí: nadie llega a una sola. */
export function LegalFooterLinks({ current }: { current: string }) {
  const { tc } = useLanguage()
  const paginas = [
    { to: '/terms', label: tc('Terms and Conditions') },
    { to: '/privacy', label: tc('Privacy Policy') },
    { to: '/cookies', label: tc('Cookie Policy') },
    { to: '/safety', label: tc('Safety & Insurance') },
    { to: '/legal', label: tc('Legal Notice') },
    { to: '/accessibility', label: tc('Accessibility') },
  ].filter((p) => p.to !== current)

  return (
    <div className="pt-4 border-t border-white/6 space-y-4">
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {paginas.map((p) => (
          <Link key={p.to} to={p.to} className="text-xs text-white/50 hover:text-japan-red transition-colors">
            {p.label}
          </Link>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl glass border border-white/10 text-white/70 hover:text-white text-sm transition-colors"
        >
          <span className="flip-rtl inline-block me-1.5">←</span> {tc('Back to Home')}
        </Link>
        <a
          href={CONTACT_WA}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-japan-red/15 border border-japan-red/25 text-japan-red hover:bg-japan-red/25 text-sm transition-colors"
        >
          {tc('Questions? WhatsApp us')}
        </a>
      </div>
    </div>
  )
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-white mb-2">{title}</h2>
      {children}
    </div>
  )
}

export function Li({ label, children }: { label: string; children: ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="text-japan-red font-medium flex-shrink-0">{label}:</span>
      <span>{children}</span>
    </li>
  )
}

/** Aviso destacado: para lo que el cliente no debe pasar por alto. */
export function Warning({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-japan-red/25 bg-japan-red/8 p-4 text-xs text-white/70 leading-relaxed">
      {children}
    </div>
  )
}
