import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, MessageCircle, Star, Check, ChevronRight, MapPin, Clock, Users } from 'lucide-react'
import { AnimatedHeroBG } from '../components/AnimatedHeroBG'
import { HeroTextKinetic } from '../components/HeroTextKinetic'
import { FadeUp } from '../components/FadeUp'
import { ExplodeIn } from '../components/ExplodeIn'
import { CurtainReveal } from '../components/CurtainReveal'
import { Card3D } from '../components/Card3D'
import { TOURS, STATS, GUIDES, TESTIMONIALS, WHATSAPP, LANGUAGES } from '../lib/data'
import { useLanguage } from '../contexts/LanguageContext'
import { PageSEO } from '../components/PageSEO'

const PHOTO_TORII = 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&q=85&w=900'
const PHOTO_CASTLE = 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&q=85&w=900'

const cardReveal = {
  hidden: { opacity: 0, y: 48, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 220, damping: 22, delay: i * 0.07 },
  }),
}

export default function Home() {
  const { t } = useLanguage()
  const discoverRef = useRef<HTMLElement>(null)
  const castleRef = useRef<HTMLElement>(null)

  const { scrollYProgress: discoverProgress } = useScroll({ target: discoverRef, offset: ['start end', 'end start'] })
  const { scrollYProgress: castleProgress } = useScroll({ target: castleRef, offset: ['start end', 'end start'] })
  const discoverPhotoY = useTransform(discoverProgress, [0, 1], ['0%', '18%'])
  const castlePhotoY = useTransform(castleProgress, [0, 1], ['0%', '18%'])

  return (
    <>
      <PageSEO
        title="Private Japan Tour Guide · Osaka, Kyoto & Kansai"
        description="100% private guided tours in Osaka, Kyoto, Nara & Kansai with expert local guides. English, Spanish, Arabic, Czech & Russian. ★5.0 · 400+ tours."
        path="/"
      />
      <CurtainReveal />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-[#08060F] to-japan-surface" />
        <AnimatedHeroBG />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-japan-red/30 bg-japan-red/10 text-japan-red text-sm font-semibold tracking-wider"
          >
            <Star size={13} fill="currentColor" />
            {t.hero.badge}
            <Star size={13} fill="currentColor" />
          </motion.div>

          <div className="mb-5">
            <HeroTextKinetic
              text={t.hero.headline}
              className="justify-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-semibold leading-[1.05]"
              delay={0.3}
              accentWords={[1, 2, 3]}
            />
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-[3px] w-44 mx-auto mb-10 rounded-full bg-gradient-to-r from-japan-red to-japan-orange origin-left"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-white/55 font-light leading-relaxed mb-12"
          >
            {t.hero.sub}
          </motion.p>

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
              <MessageCircle size={16} /> {t.hero.cta_wa}
            </a>
            <Link
              to="/tours"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass text-white/90 hover:text-white font-semibold text-sm border border-white/10 hover:border-japan-red/40 transition-all hover:scale-105"
            >
              {t.hero.cta_tours} <ChevronRight size={15} />
            </Link>
          </motion.div>

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

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={20} className="text-white/30" />
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
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
                    <div className="text-xs text-white/45 tracking-wide font-medium">
                      {i === 0 ? t.stats.destinations
                        : i === 1 ? t.stats.tours
                        : i === 2 ? t.stats.languages
                        : t.stats.private}
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISCOVER — Fushimi Inari parallax ────────────────── */}
      <section
        ref={discoverRef}
        className="relative py-24 overflow-hidden bg-gradient-to-b from-transparent to-japan-surface/20"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <FadeUp>
              <div className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-3">
                {t.discover.label}
              </div>
              <HeroTextKinetic
                text={t.discover.heading}
                className="text-4xl md:text-5xl font-serif font-semibold text-white leading-tight mb-5"
                delay={0.1}
                accentWords={[4, 5, 6]}
              />
              <p className="text-white/50 leading-relaxed mb-7 font-light text-[15px]">
                {t.discover.body}
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: MapPin, label: t.discover.tag1 },
                  { icon: Users, label: t.discover.tag2 },
                  { icon: Clock, label: t.discover.tag3 },
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

            <FadeUp delay={0.15}>
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                <motion.div className="absolute inset-0 scale-[1.2]" style={{ y: discoverPhotoY }}>
                  <img src={PHOTO_TORII} alt="Fushimi Inari torii gates Kyoto Japan" className="w-full h-full object-cover" loading="lazy" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-japan-dark/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5">
                  <div className="text-xs text-white/50 font-medium tracking-wider uppercase">{t.discover.caption}</div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── FORTRESS — Himeji Castle parallax ────────────────── */}
      <section ref={castleRef} className="py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <ExplodeIn index={2}>
              <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                <motion.div className="absolute inset-0 scale-[1.2]" style={{ y: castlePhotoY }}>
                  <img src={PHOTO_CASTLE} alt="Himeji Castle Japan UNESCO World Heritage" className="w-full h-full object-cover" loading="lazy" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-japan-dark/65 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5">
                  <div className="text-xs text-white/50 font-medium tracking-wider uppercase">{t.fortress.caption}</div>
                </div>
              </div>
            </ExplodeIn>

            <FadeUp delay={0.1}>
              <div className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-3">
                {t.fortress.label}
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-5 leading-tight">
                {t.fortress.heading}<br />
                <span className="text-gradient-japan italic">{t.fortress.headingAccent}</span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-6 font-light text-[15px]">
                {t.fortress.body}
              </p>
              <Link
                to="/tours"
                className="inline-flex items-center gap-2 text-sm text-japan-red hover:text-japan-orange transition-colors font-medium"
              >
                {t.fortress.cta} <ChevronRight size={14} />
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── TOURS GRID ────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-transparent via-japan-surface/30 to-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="text-center mb-14">
            <div className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-3">
              {t.tours_section.label}
            </div>
            <HeroTextKinetic
              text={t.tours_section.heading}
              className="justify-center text-4xl md:text-5xl font-serif font-semibold text-white mb-4"
              delay={0.05}
              accentWords={[2]}
            />
            <p className="max-w-xl mx-auto text-white/50 text-lg font-light">
              {t.tours_section.sub}
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
                            {t.tours_section.view} <ChevronRight size={12} />
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

      {/* ── MEET THE GUIDES ───────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-japan-surface/20 to-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="text-center mb-14">
            <div className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-3">Our Team</div>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-4">Meet Your Guides</h2>
            <p className="max-w-xl mx-auto text-white/50 text-lg font-light">
              Three specialists. Every language. Every corner of Kansai.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-8">
            {GUIDES.map((guide, i) => (
              <FadeUp key={guide.id} delay={i * 0.1}>
                <Card3D glowColor={`${guide.accent}20`} className="h-full">
                  <div className="glass rounded-2xl border border-white/6 overflow-hidden h-full flex flex-col">
                    {/* Photo */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={guide.photo}
                        alt={guide.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: guide.accent }}>
                          {guide.specialty}
                        </div>
                        <h3 className="font-serif text-xl font-semibold text-white">{guide.name}</h3>
                        <div className="text-xs text-white/55 mt-0.5">{guide.role}</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-sm text-white/60 leading-relaxed mb-4 flex-1">{guide.bio}</p>

                      <div className="space-y-3">
                        {/* Stats row */}
                        <div className="flex items-center gap-4 text-xs text-white/45">
                          <span>Since {guide.since}</span>
                          <span className="w-px h-3 bg-white/15" />
                          <span>{guide.tours} tours</span>
                          <span className="w-px h-3 bg-white/15" />
                          <span className="text-japan-gold">★ {guide.rating}</span>
                        </div>

                        {/* Languages */}
                        <div className="flex items-center gap-1.5">
                          {guide.languages.map((flag, j) => (
                            <span key={j} title={guide.langLabels[j]} className="text-lg leading-none">{flag}</span>
                          ))}
                        </div>

                        {/* Signature tours */}
                        <div className="flex flex-wrap gap-1.5">
                          {guide.highlights.map(h => (
                            <span
                              key={h}
                              className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
                              style={{ color: guide.accent, borderColor: `${guide.accent}40`, background: `${guide.accent}10` }}
                            >
                              {h}
                            </span>
                          ))}
                        </div>

                        {/* Profile link */}
                        <Link
                          to={`/guides/${guide.id}`}
                          className="mt-1 flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-75"
                          style={{ color: guide.accent }}
                        >
                          View full profile <ChevronRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card3D>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="text-center mb-12">
            <div className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-3">Reviews</div>
            <h2 className="font-serif text-4xl font-semibold text-white mb-3">What Guests Say</h2>
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-japan-gold fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-white/40 text-sm">5.0 average · 400+ tours completed</p>
          </FadeUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((review, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div className="glass rounded-2xl border border-white/6 p-6 h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(review.rating)].map((_, j) => (
                      <svg key={j} className="w-3.5 h-3.5 text-japan-gold fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed italic flex-1 mb-5">"{review.text}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">{review.name}</div>
                      <div className="text-xs text-white/40">{review.country}</div>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-[11px] text-white/50">
                      {review.tour}
                    </div>
                  </div>
                </div>
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
                  <HeroTextKinetic
                    text={t.cta_section.heading}
                    className="justify-center text-3xl md:text-4xl font-serif font-semibold text-white mb-4"
                    delay={0.05}
                    accentWords={[4, 5]}
                  />
                  <p className="text-white/55 max-w-lg mx-auto mb-8 font-light">
                    {t.cta_section.sub}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={WHATSAPP}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white font-semibold shadow-lg shadow-japan-red/40 hover:scale-105 transition-transform"
                    >
                      <MessageCircle size={16} /> {t.cta_section.cta_wa}
                    </a>
                    <Link
                      to="/pricing"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass text-white/80 hover:text-white border border-white/10 hover:border-japan-red/40 transition-all"
                    >
                      {t.cta_section.cta_pricing} <ChevronRight size={15} />
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
