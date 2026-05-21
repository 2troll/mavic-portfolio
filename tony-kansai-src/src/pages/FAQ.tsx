import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, MessageCircle } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { HeroTextKinetic } from '../components/HeroTextKinetic'
import { ExplodeIn } from '../components/ExplodeIn'
import { FAQS, WHATSAPP } from '../lib/data'
import { useLanguage } from '../contexts/LanguageContext'
import { PageSEO } from '../components/PageSEO'

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const { t } = useLanguage()
  const f = t.faq_page

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }

  return (
    <>
      <PageSEO
        title="FAQ · Private Japan Tour Guide Kansai"
        description="Common questions about private tours in Osaka, Kyoto & Kansai — languages, cancellation, transport, restaurant bookings and more."
        path="/faq"
        breadcrumb={[{ name: 'FAQ', path: '/faq' }]}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-japan-dark to-japan-surface" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-japan-red/6 blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-4">
            {f.label}
          </motion.div>
          <div className="mb-6">
            <HeroTextKinetic text={f.heading} className="justify-center text-4xl md:text-5xl font-serif font-semibold" delay={0.1} />
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-white/50 font-light">{f.sub}</motion.p>
        </div>
      </section>

      <section className="pb-28">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-3 mb-14">
            {FAQS.map((faq, i) => (
              <ExplodeIn key={i} index={i}>
                <motion.div
                  className="glass rounded-xl border overflow-hidden cursor-pointer"
                  animate={{ borderColor: open === i ? 'rgba(229,48,48,0.35)' : 'rgba(255,255,255,0.06)' }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <div className="flex items-center justify-between px-6 py-4 gap-4">
                    <h3 className="font-medium text-white/90">{faq.q}</h3>
                    <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
                      <ChevronDown size={16} className="text-japan-red flex-shrink-0" />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {open === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 240, damping: 26 }}>
                        <div className="px-6 pb-5 text-sm text-white/60 leading-relaxed border-t border-white/5 pt-4">{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </ExplodeIn>
            ))}
          </div>

          <ExplodeIn index={FAQS.length}>
            <div className="glass rounded-2xl border border-white/6 p-8 text-center">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-serif text-xl font-semibold text-white mb-2">{f.still_q}</h3>
              <p className="text-sm text-white/50 mb-5">{f.still_sub}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white text-sm font-semibold shadow-lg shadow-japan-red/30 hover:scale-105 transition-transform">
                  <MessageCircle size={15} /> {f.cta_wa}
                </a>
                <Link to="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass text-white/80 hover:text-white border border-white/10 hover:border-japan-red/30 text-sm transition-all">
                  {f.cta_pricing}
                </Link>
              </div>
            </div>
          </ExplodeIn>
        </div>
      </section>
    </>
  )
}
