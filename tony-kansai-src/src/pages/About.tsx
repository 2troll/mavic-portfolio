import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Clock, Star, MessageCircle, ChevronRight } from 'lucide-react'
import { Card3D } from '../components/Card3D'
import { HeroTextKinetic } from '../components/HeroTextKinetic'
import { ExplodeIn } from '../components/ExplodeIn'
import { LANGUAGES, WHATSAPP, WHATSAPP_NUMBER } from '../lib/data'
import { useLanguage } from '../contexts/LanguageContext'
import { PageSEO } from '../components/PageSEO'

export default function About() {
  const { t } = useLanguage()
  const a = t.about_page

  return (
    <>
      <PageSEO
        title="About the Team · Tony Hanma & Kansai Guide"
        description="Meet Tony Hanma, Johnny Coletta and Larion — private guides across Osaka, Kyoto & Kansai. Fluent in English, Spanish, Arabic, Czech, Russian & Japanese."
        path="/about"
        breadcrumb={[{ name: 'About', path: '/about' }]}
      />
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-japan-dark to-japan-surface" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full bg-japan-red/7 blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-4">
            {a.label}
          </motion.div>
          <div className="mb-4">
            <HeroTextKinetic text={a.heading} className="justify-center text-5xl md:text-6xl font-serif font-semibold" delay={0.1} />
          </div>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="text-white/50 text-lg font-light font-serif italic">
            {a.sub}
          </motion.p>
        </div>
      </section>

      <section className="pb-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-start">

            <ExplodeIn index={0}>
              <Card3D glowColor="rgba(229,48,48,0.2)" className="sticky top-24">
                <div className="glass rounded-2xl p-8 border border-white/6">
                  <div className="flex items-center justify-between mb-7">
                    <div>
                      <div className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-1">{a.private_guide}</div>
                      <h3 className="font-serif text-3xl font-semibold text-white">Tony Hanma</h3>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-japan-red to-japan-orange flex items-center justify-center text-3xl font-serif font-bold text-white shadow-lg shadow-japan-red/40">
                      TH
                    </div>
                  </div>

                  <div className="space-y-2.5 text-sm text-white/60 mb-7">
                    <div className="flex items-center gap-2"><MapPin size={13} className="text-japan-red" />{a.based}</div>
                    <div className="flex items-center gap-2"><Star size={13} className="text-japan-red" fill="currentColor" />{a.rating}</div>
                  </div>

                  <div className="mb-7">
                    <div className="text-xs text-white/35 font-medium tracking-wider uppercase mb-3">{a.speaks}</div>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map(({ flag, name }) => (
                        <div key={name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70">
                          <span>{flag}</span><span>{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white font-semibold shadow-lg shadow-japan-red/30 hover:scale-105 transition-transform">
                    <MessageCircle size={15} /> {a.cta_wa}
                  </a>
                  <div className="text-center text-xs text-white/35 mt-2">{WHATSAPP_NUMBER} · {t.common.replies}</div>
                </div>
              </Card3D>
            </ExplodeIn>

            <div className="space-y-6">
              <ExplodeIn index={1}>
                <div className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-3">{a.story_label}</div>
                <h2 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight">
                  <span className="text-gradient-japan italic">{a.story_heading}</span>
                </h2>
              </ExplodeIn>

              <ExplodeIn index={2}>
                <p className="text-white/65 leading-relaxed text-[15px]">
                  Tony Hanma has spent years exploring every corner of Kansai — not as a tourist, but as someone who grew up breathing its culture. He shares hidden temples, forgotten markets, and the living traditions that guidebooks miss.
                </p>
              </ExplodeIn>

              <ExplodeIn index={3}>
                <p className="text-white/65 leading-relaxed text-[15px]">
                  His approach is simple: no scripts, no rush, no crowds. Each tour is tailored completely to you — your pace, your interests, your language. Whether you want spiritual depth in Kyoto or the electric chaos of Osaka nights, Tony knows exactly where to take you.
                </p>
              </ExplodeIn>

              <ExplodeIn index={4}>
                <p className="text-white/65 leading-relaxed text-[15px]">
                  With fluency in five languages — English, Spanish, Russian, Czech, and Arabic — Tony bridges not just geography but culture. Nuance, humor, and history come through naturally in a way that only native-level understanding can provide.
                </p>
              </ExplodeIn>

              <ExplodeIn index={5}>
                <p className="text-white/65 leading-relaxed text-[15px]">
                  Tony covers the full Kansai region: the neon streets of Dotonbori, the thousand torii of Fushimi Inari, the bamboo groves of Arashiyama, the deer parks of Nara, the mountain trails of Kurama — and countless places in between that exist only in local memory.
                </p>
              </ExplodeIn>

              <ExplodeIn index={6}>
                <div className="glass rounded-2xl p-6 border border-white/6">
                  <div className="text-sm font-semibold text-white/50 mb-3">{a.coverage_label}</div>
                  <div className="flex flex-wrap gap-2">
                    {['Osaka','Kyoto','Nara','Kobe','Arashiyama','Fushimi','Kurama','Uji','Himeji','Beppu'].map((city) => (
                      <span key={city} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">{city}</span>
                    ))}
                  </div>
                </div>
              </ExplodeIn>

              <ExplodeIn index={7}>
                <div className="flex gap-4 pt-2">
                  <Link to="/tours"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white text-sm font-semibold shadow-md hover:scale-105 transition-transform">
                    {a.cta_tours} <ChevronRight size={14} />
                  </Link>
                  <Link to="/pricing"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl glass text-white/80 hover:text-white border border-white/10 hover:border-japan-red/30 text-sm transition-all">
                    {a.cta_pricing}
                  </Link>
                </div>
              </ExplodeIn>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
