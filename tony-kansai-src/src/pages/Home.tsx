import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown, MessageCircle, Star, Check, ChevronRight } from 'lucide-react'
import { Scene3D } from '../components/Scene3D'
import { CastleScene } from '../components/CastleScene'
import { HeroText } from '../components/HeroText'
import { FadeUp } from '../components/FadeUp'
import { CurtainReveal } from '../components/CurtainReveal'
import { Card3D } from '../components/Card3D'
import { TOURS, STATS, WHATSAPP, LANGUAGES } from '../lib/data'

export default function Home() {
  return (
    <>
      <CurtainReveal />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-japan-dark via-[#08060F] to-japan-surface" />
        <Scene3D />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity:0, y:20, scale:0.9 }} animate={{ opacity:1, y:0, scale:1 }} transition={{ duration:0.6, delay:0.1 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-japan-red/30 bg-japan-red/10 text-japan-red text-sm font-semibold tracking-wider">
            <Star size={13} fill="currentColor" /> Private Tours · Kansai, Japan <Star size={13} fill="currentColor" />
          </motion.div>

          <div className="mb-6">
            <HeroText text="Discover Japan's True Soul"
              className="justify-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-semibold leading-[1.05]"
              delay={0.3} />
          </div>

          <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ duration:0.8, delay:1.2, ease:[0.16,1,0.3,1] }}
            className="h-1 w-48 mx-auto mb-10 rounded-full bg-gradient-to-r from-japan-red to-japan-orange origin-left" />

          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:1.0 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-white/55 font-light leading-relaxed mb-12">
            100% private tours in Osaka, Kyoto, Nara & Kansai — guided in{' '}
            <span className="text-white/80 font-medium">5 languages</span> by a local who knows the stories behind every stone.
          </motion.p>

          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white font-semibold text-sm shadow-lg shadow-japan-red/40 hover:shadow-japan-red/60 transition-all hover:scale-105 active:scale-95">
              <MessageCircle size={16} /> Book via WhatsApp
            </a>
            <Link to="/tours"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass text-white/90 hover:text-white font-semibold text-sm border border-white/10 hover:border-japan-red/40 transition-all hover:scale-105">
              Explore Tours <ChevronRight size={15} />
            </Link>
          </motion.div>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6, delay:1.5 }}
            className="flex justify-center gap-3">
            {LANGUAGES.map(({ flag, code }) => (
              <div key={code} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{flag}</span>
                <span className="text-[10px] text-white/40 font-medium tracking-wider">{code}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y:[0,8,0] }} transition={{ duration:2, repeat:Infinity }}>
          <ChevronDown size={20} className="text-white/30" />
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="py-6 border-y border-white/5 bg-gradient-to-r from-japan-surface via-japan-surface2 to-japan-surface">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ value, label, icon }, i) => (
              <FadeUp key={label} delay={i * 0.08}>
                <div className="flex items-center gap-3 py-4">
                  <div className="w-10 h-10 rounded-xl bg-japan-red/10 border border-japan-red/20 flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
                  <div>
                    <div className="text-2xl font-serif font-bold text-gradient-japan">{value}</div>
                    <div className="text-xs text-white/45 tracking-wide font-medium">{label}</div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── OSAKA CASTLE DIORAMA ──────────────────────────────── */}
      <section className="py-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeUp>
              <div className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-3">Kansai Icons</div>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-5 leading-tight">
                From ancient castles<br />to <span className="text-gradient-japan italic">hidden alleys</span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-6 font-light">
                Tony unlocks the Kansai region layer by layer — feudal ramparts, temple forests, and streets that haven't changed in centuries. Move your cursor over the castle to feel the depth.
              </p>
              <Link to="/tours" className="inline-flex items-center gap-2 text-sm text-japan-red hover:text-japan-orange transition-colors font-medium">
                Explore all destinations <ChevronRight size={14} />
              </Link>
            </FadeUp>
            <FadeUp delay={0.15}>
              <CastleScene />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── TOURS GRID ────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-transparent via-japan-surface/30 to-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="text-center mb-14">
            <div className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-3">Experiences</div>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-4">
              Choose Your <span className="text-gradient-japan italic">Journey</span>
            </h2>
            <p className="max-w-xl mx-auto text-white/50 text-lg font-light">Every tour is private, every route is yours.</p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {TOURS.map((tour, i) => (
              <FadeUp key={tour.id} delay={i * 0.08}>
                <Link to={`/tours/${tour.id}`} className="group block h-full">
                  <Card3D glowColor={`${tour.accent}20`} className="h-full">
                    <div className="rounded-2xl overflow-hidden h-full flex flex-col border border-white/6 bg-japan-surface/60">
                      {/* Photo */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={tour.imageCard}
                          alt={tour.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
                          style={{ background:`${tour.accent}25`, color:tour.accent, border:`1px solid ${tour.accent}50` }}>
                          {tour.badge}
                        </div>
                        <div className="absolute bottom-3 left-3 text-xs font-medium tracking-wider" style={{ color: tour.accent }}>
                          {tour.subtitle}
                        </div>
                      </div>
                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-serif text-xl font-semibold text-white mb-2">{tour.title}</h3>
                        <p className="text-sm text-white/55 leading-relaxed mb-4 flex-1">{tour.description}</p>
                        <ul className="space-y-1.5 mb-4">
                          {tour.highlights.slice(0,3).map((h) => (
                            <li key={h} className="flex items-center gap-2 text-xs text-white/60">
                              <Check size={11} style={{ color:tour.accent }} className="flex-shrink-0" />{h}
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <span className="font-serif font-bold text-gradient-japan text-sm">{tour.price}</span>
                          <span className="text-xs text-japan-red group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                            View Tour <ChevronRight size={12} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card3D>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ─────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <FadeUp>
            <Card3D glowColor="rgba(229,48,48,0.3)">
              <div className="relative rounded-3xl glass border border-japan-red/20 p-10 md:p-16 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-japan-red/8 via-transparent to-japan-orange/6 pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-px bg-gradient-to-r from-transparent via-japan-red/60 to-transparent" />
                <div className="relative z-10">
                  <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-4">
                    Ready to Experience <span className="text-gradient-japan italic">Real Japan?</span>
                  </h2>
                  <p className="text-white/55 max-w-lg mx-auto mb-8 font-light">Tony typically replies within 2 hours. Tell him your dates and he'll build your perfect itinerary.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white font-semibold shadow-lg shadow-japan-red/40 hover:scale-105 transition-transform">
                      <MessageCircle size={16} /> Message Tony Now
                    </a>
                    <Link to="/pricing"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass text-white/80 hover:text-white border border-white/10 hover:border-japan-red/40 transition-all">
                      See Pricing <ChevronRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            </Card3D>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
