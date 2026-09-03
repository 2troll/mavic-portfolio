import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, MessageCircle } from 'lucide-react'
import { PageSEO } from '../components/PageSEO'
import { WHATSAPP } from '../lib/data'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * 404 de verdad. Antes cualquier URL equivocada mostraba la portada sin
 * decir nada: el visitante creía que el enlace funcionaba y Google indexaba
 * la misma página con veinte direcciones distintas.
 */
export default function NotFound() {
  const { tc } = useLanguage()

  const DESTINOS = [
    { to: '/tours', label: tc('Tours') },
    { to: '/hiking', label: tc('Hiking Routes') },
    { to: '/guide', label: tc('Kansai Practical Guide') },
    { to: '/pricing', label: tc('Pricing') },
    { to: '/faq', label: tc('Read the FAQ') },
  ]

  return (
    <>
      <PageSEO
        title={tc('Page not found')}
        description={tc('That page does not exist. Here is the way back.')}
        path="/404"
      />
      <section className="relative min-h-[70vh] flex items-center justify-center pt-28 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-japan-dark to-japan-surface pointer-events-none" />
        <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-14 h-14 rounded-2xl bg-japan-red/12 flex items-center justify-center mx-auto mb-6"
          >
            <Compass size={26} className="text-japan-red" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="ltr-num font-serif text-5xl font-bold text-gradient-japan mb-3">404</div>
            <h1 className="font-serif text-2xl font-semibold text-white mb-3">
              {tc('This path does not go anywhere')}
            </h1>
            <p className="text-white/45 text-sm leading-relaxed mb-8">
              {tc('The page you were looking for is not here — it may have moved, or the link may have a typo. Everything else is one tap away.')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2.5 mb-8"
          >
            {DESTINOS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="px-4 py-2 rounded-full glass border border-white/10 text-sm text-white/65 hover:text-white hover:border-japan-red/40 transition-all"
              >
                {label}
              </Link>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white font-semibold text-sm shadow-lg shadow-japan-red/30 hover:scale-105 transition-transform"
            >
              {tc('Back to Home')}
            </Link>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/25 text-sm font-medium transition-all"
            >
              <MessageCircle size={14} /> {tc('Ask Tony directly')}
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}
