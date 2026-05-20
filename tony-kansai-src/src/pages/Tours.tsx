import { motion } from 'framer-motion'
import { HeroTextKinetic } from '../components/HeroTextKinetic'
import { Slider3D } from '../components/Slider3D'
import { useLanguage } from '../contexts/LanguageContext'
import { PageSEO } from '../components/PageSEO'

export default function Tours() {
  const { t } = useLanguage()

  return (
    <>
      <PageSEO
        title="Private Tours in Osaka, Kyoto & Kansai"
        description="7 exclusive private tours in Kansai Japan — Osaka food circuits, hidden Kyoto temples, Kōyasan pilgrimage and more. Guided in English, Spanish, Arabic, Czech & Russian."
        path="/tours"
      />
      <section className="relative pt-28 pb-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-japan-dark to-japan-surface" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-4"
          >
            {t.tours_page.label}
          </motion.div>
          <div className="mb-4">
            <HeroTextKinetic
              text={t.tours_page.heading}
              className="justify-center text-4xl md:text-5xl lg:text-6xl font-serif font-semibold"
              delay={0.1}
            />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/50 text-lg font-light max-w-xl mx-auto"
          >
            {t.tours_page.sub}
          </motion.p>
        </div>
      </section>

      <section className="relative pb-24">
        <Slider3D />
      </section>
    </>
  )
}
