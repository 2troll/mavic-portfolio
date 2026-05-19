import { motion } from 'framer-motion'
import { HeroTextKinetic } from '../components/HeroTextKinetic'
import { Slider3D } from '../components/Slider3D'

export default function Tours() {
  return (
    <>
      {/* Header */}
      <section className="relative pt-28 pb-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-japan-dark to-japan-surface" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-4"
          >
            All Experiences
          </motion.div>
          <div className="mb-4">
            <HeroTextKinetic
              text="Private Tours in Kansai"
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
            Every tour is 100% private. No strangers, no fixed schedule — just you and Tony.
          </motion.p>
        </div>
      </section>

      {/* 3D Slider */}
      <section className="relative pb-24">
        <Slider3D />
      </section>
    </>
  )
}
