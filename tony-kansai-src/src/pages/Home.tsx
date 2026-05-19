import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChevronDown, MessageCircle, Star, Check, ChevronRight, MapPin, Clock, Users,
} from 'lucide-react'
import { AnimatedHeroBG } from '../components/AnimatedHeroBG'
import { HeroTextKinetic } from '../components/HeroTextKinetic'
import { CinematicScrollDeer } from '../components/CinematicScrollDeer'
import { DioramaCastle3D } from '../components/DioramaCastle3D'
import { InteractiveToriiGlow } from '../components/InteractiveToriiGlow'
import { FadeUp } from '../components/FadeUp'
import { ExplodeIn } from '../components/ExplodeIn'
import { CurtainReveal } from '../components/CurtainReveal'
import { Card3D } from '../components/Card3D'
import { TOURS, STATS, WHATSAPP, LANGUAGES } from '../lib/data'

// ── spring variant shared across reveal cards ─────────────────────────────────
const cardReveal = {
  hidden: { opacity: 0, y: 48, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 220, damping: 22, delay: i * 0.07 },
  }),
}

export default function Home() {
  // Ref for the deer section scroll tracking
  const deerSectionRef = useRef<HTMLElement>(null)

  return (
    <>
      <CurtainReveal />

      {/* ════════════════════════════════════════════════════════
          HERO — cinematic full viewport
      ════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
        {/* Deep dark ground */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-[#08060F] to-japan-surface" />
        <AnimatedHeroBG />

        {/* Decorative Torii watermark — desktop right edge */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block z-0">
          <InteractiveToriiGlow className="opacity-[0.10] w-40" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-japan-red/30 bg-japan-red/10 text-japan-red text-sm font-semibold tracking-wider"
          >
            <Star size={13} fill="currentColor" />
            Private Tours · Kansai, Japan
            <Star size={13} fill="currentColor" />
          </motion.div>

          {/* 3D kinetic headline */}
          <div className="mb-5">
            <HeroTextKinetic
              text="Discover Japan's True Soul"
              className="justify-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-semibold leading-[1.05]"
              delay={0.3}
              accentWords={[1, 2, 3]}
            />
          </div>

          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-[3px] w-44 mx-auto mb-10 rounded-full bg-gradient-to-r from-japan-red to-japan-orange origin-left"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-white/55 font-light leading-relaxed mb-12"
          >
            100% private tours in Osaka, Kyoto, Nara & Kansai — guided in{' '}
            <span className="text-white/80 font-medium">5 languages</span> by a local who knows the story behind every stone.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
          >
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white font-semibold text-sm shadow-xl shadow-japan-red/40 hover:shadow-japan-red/60 transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle size={16} /> Book via WhatsApp
            </a>
            <Link
              to="/tours"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass text-white/90 hover:text-white font-semibold text-sm border border-white/10 hover:border-japan-red/40 transition-all hover:scale-105"
            >
              Explore Tours <ChevronRight size={15} />
            </Link>
          </motion.div>

          {/* Language flags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="flex justify-center gap-4"
          >
            {LANGUAGES.map(({ flag, code }) => (
              <div key={code} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{flag}</span>
                <span className="text-[10px] text-white/40 font-medium tracking-wider">{code}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll caret */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={20} className="text-white/30" />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════
          STATS TICKER
      ════════════════════════════════════════════════════════ */}
      <section className="py-5 border-y border-white/5 bg-gradient-to-r from-japan-surface via-japan-surface2 to-japan-surface">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ value, label, icon }, i) => (
              <FadeUp key={label} delay={i * 0.07}>
                <div className="flex items-center gap-3 py-4">
                  <div className="w-10 h-10 rounded-xl bg-japan-red/10 border border-japan-red/20 flex items-center justify-center text-xl flex-shrink-0">
                    {icon}
                  </div>
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

      {/* ════════════════════════════════════════════════════════
          DEER WALK SECTION — Nara deer tracks scroll progress
      ════════════════════════════════════════════════════════ */}
      <section
        ref={deerSectionRef}
        className="relative py-24 overflow-hidden bg-gradient-to-b from-transparent to-japan-surface/20"
      >
        {/* Deer walks across here */}
        <CinematicScrollDeer sectionRef={deerSectionRef} />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <FadeUp>
              <div className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-3">
                Kansai · Japan
              </div>
              <HeroTextKinetic
                text="Where every path tells a story"
                className="text-4xl md:text-5xl font-serif font-semibold text-white leading-tight mb-5"
                delay={0.1}
                accentWords={[4, 5, 6]}
              />
              <p className="text-white/50 leading-relaxed mb-7 font-light text-[15px]">
                Tony Hanma has spent decades learning Kansai — not from guidebooks, but from the people who live there. The 8th-century deer of Nara that approach you calmly. The mountain monks who share rituals never filmed. The izakaya owners who still use hand-written menus. This is the Japan that belongs to those who know how to look.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: MapPin, label: '7 Destinations' },
                  { icon: Users, label: '100% Private' },
                  { icon: Clock, label: '200+ Tours' },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/8 text-xs text-white/60 font-medium"
                  >
                    <Icon size={12} className="text-japan-red" />
                    {label}
                  </div>
                ))}
              </div>
            </FadeUp>

            {/* Torii portal — interactive hover glow */}
            <FadeUp delay={0.15}>
              <div className="flex justify-center">
                <InteractiveToriiGlow className="w-56 md:w-64 opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          3D CASTLE DIORAMA
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <FadeUp>
              <div className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-3">
                Osaka Castle
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-5 leading-tight">
                From ancient fortresses<br />
                to <span className="text-gradient-japan italic">hidden alleys</span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-6 font-light text-[15px]">
                Osaka Castle has stood — and fallen, and risen again — for over 430 years. Tony guides you through the layers of its history like a diorama: the shogunate wars, the reconstruction, the cherry blossoms that frame it every spring. Move your cursor across the scene to feel the depth.
              </p>
              <Link
                to="/tours"
                className="inline-flex items-center gap-2 text-sm text-japan-red hover:text-japan-orange transition-colors font-medium"
              >
                Explore all destinations <ChevronRight size={14} />
              </Link>
            </FadeUp>

            <ExplodeIn index={2}>
              <DioramaCastle3D />
            </ExplodeIn>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          TOURS GRID — whileInView cascade with spring
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-b from-transparent via-japan-surface/30 to-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="text-center mb-14">
            <div className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-3">
              Experiences
            </div>
            <HeroTextKinetic
              text="Choose Your Journey"
              className="justify-center text-4xl md:text-5xl font-serif font-semibold text-white mb-4"
              delay={0.05}
              accentWords={[2]}
            />
            <p className="max-w-xl mx-auto text-white/50 text-lg font-light">
              Every tour is private, every route is yours.
            </p>
          </FadeUp>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {TOURS.map((tour, i) => (
              <motion.div key={tour.id} variants={cardReveal} custom={i}>
                <Link to={`/tours/${tour.id}`} className="group block h-full">
                  <Card3D glowColor={`${tour.accent}20`} className="h-full">
                    <div className="rounded-2xl overflow-hidden h-full flex flex-col border border-white/6 bg-japan-surface/60">
                      {/* Photo */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={tour.imageCard}
                          alt={tour.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                        <div
                          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
                          style={{ background: `${tour.accent}25`, color: tour.accent, border: `1px solid ${tour.accent}50` }}
                        >
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
                          {tour.highlights.slice(0, 3).map(h => (
                            <li key={h} className="flex items-center gap-2 text-xs text-white/60">
                              <Check size={11} style={{ color: tour.accent }} className="flex-shrink-0" />
                              {h}
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CTA STRIP
      ════════════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <FadeUp>
            <Card3D glowColor="rgba(229,48,48,0.3)">
              <div className="relative rounded-3xl glass border border-japan-red/20 p-10 md:p-16 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-japan-red/8 via-transparent to-japan-orange/6 pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-px bg-gradient-to-r from-transparent via-japan-red/60 to-transparent" />
                <div className="relative z-10">
                  <HeroTextKinetic
                    text="Ready to Experience Real Japan?"
                    className="justify-center text-3xl md:text-4xl font-serif font-semibold text-white mb-4"
                    delay={0.05}
                    accentWords={[4, 5]}
                  />
                  <p className="text-white/55 max-w-lg mx-auto mb-8 font-light">
                    Tony typically replies within 2 hours. Tell him your dates and he'll build your perfect itinerary.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={WHATSAPP}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white font-semibold shadow-lg shadow-japan-red/40 hover:scale-105 transition-transform"
                    >
                      <MessageCircle size={16} /> Message Tony Now
                    </a>
                    <Link
                      to="/pricing"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass text-white/80 hover:text-white border border-white/10 hover:border-japan-red/40 transition-all"
                    >
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
