import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Check, ChevronRight, MessageCircle } from 'lucide-react'
import { Card3D } from '../components/Card3D'
import { FadeUp } from '../components/FadeUp'
import { HeroText } from '../components/HeroText'
import { TOURS, WHATSAPP } from '../lib/data'

export default function Tours() {
  return (
    <>
      {/* Header */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-japan-dark to-japan-surface" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-japan-red/6 blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
            className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-4">
            All Experiences
          </motion.div>
          <div className="mb-6">
            <HeroText text="Private Tours in Kansai"
              className="justify-center text-4xl md:text-5xl lg:text-6xl font-serif font-semibold"
              delay={0.1} />
          </div>
          <motion.p initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
            className="text-white/50 text-lg font-light max-w-xl mx-auto">
            Every tour is 100% private. No strangers, no fixed schedule — just you and Tony.
          </motion.p>
        </div>
      </section>

      {/* Tour cards — detailed */}
      <section className="pb-28">
        <div className="max-w-5xl mx-auto px-6 space-y-10">
          {TOURS.map((tour, i) => (
            <FadeUp key={tour.id} delay={i * 0.1}>
              <Card3D glowColor={`${tour.accent}20`} className="w-full">
                <div className="glass rounded-2xl overflow-hidden border border-white/6">
                  <div className="md:flex">
                    {/* Left band */}
                    <div className={`md:w-64 bg-gradient-to-br ${tour.gradient} flex flex-col items-center justify-center p-10 gap-4`}>
                      <span className="text-7xl">{tour.emoji}</span>
                      <div className="text-center">
                        <div className="text-xs font-semibold tracking-wider mb-1" style={{ color:tour.accent }}>{tour.badge}</div>
                        <div className="flex items-center gap-1.5 text-xs text-white/60 justify-center">
                          <Clock size={11} />{tour.duration}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-7">
                      <div className="text-xs font-medium tracking-wider mb-1" style={{ color:tour.accent }}>{tour.subtitle}</div>
                      <h3 className="font-serif text-2xl font-semibold text-white mb-1">{tour.title}</h3>
                      <div className="text-xl font-serif font-bold text-gradient-japan mb-3">{tour.price}</div>
                      <p className="text-sm text-white/60 leading-relaxed mb-5">{tour.description}</p>

                      <div className="grid sm:grid-cols-2 gap-2 mb-6">
                        {tour.highlights.map((h) => (
                          <div key={h} className="flex items-start gap-2 text-sm text-white/65">
                            <Check size={13} className="mt-0.5 flex-shrink-0" style={{ color:tour.accent }} />{h}
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link to={`/tours/${tour.id}`}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-white/10 text-sm text-white/80 hover:text-white hover:border-japan-red/40 font-medium transition-all">
                          Full Details <ChevronRight size={14} />
                        </Link>
                        <a href={`${WHATSAPP}?text=${encodeURIComponent(`Hi Tony! I'm interested in the ${tour.title} tour.`)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white text-sm font-semibold shadow-md shadow-japan-red/30 hover:scale-105 transition-transform">
                          <MessageCircle size={14} /> Book This Tour
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Card3D>
            </FadeUp>
          ))}
        </div>
      </section>
    </>
  )
}
