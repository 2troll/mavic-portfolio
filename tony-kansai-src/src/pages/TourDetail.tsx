import { useParams, Link } from 'react-router-dom'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, Clock, Check, MessageCircle, MapPin, Users, ChevronRight } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { Card3D } from '../components/Card3D'
import { ExplodeIn } from '../components/ExplodeIn'
import { NaraParticles } from '../components/NaraParticles'
import { TourMap } from '../components/TourMap'
import { TOURS, WHATSAPP, LANGUAGES } from '../lib/data'
import { PageSEO } from '../components/PageSEO'

export default function TourDetail() {
  const { id } = useParams()
  const tour = TOURS.find((t) => t.id === id)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '60%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-white mb-3">Tour not found</h2>
          <Link to="/tours" className="text-japan-red hover:text-japan-orange">← Back to Tours</Link>
        </div>
      </div>
    )
  }

  const waMsg = encodeURIComponent(`Hi Tony! I'm very interested in the "${tour.title}" tour. Could you share more details and availability?`)
  const numericPrice = parseInt(tour.price.replace(/[^0-9]/g, ''), 10)
  const tourSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: tour.title,
    description: tour.subtitle,
    url: `https://tonykansaiguide.com/tours/${tour.id}`,
    image: tour.imageHero,
    offers: {
      '@type': 'Offer',
      price: numericPrice,
      priceCurrency: 'JPY',
      availability: 'https://schema.org/InStock',
    },
    provider: {
      '@type': 'LocalBusiness',
      name: 'Tony Hanma Private Kansai Tours',
      telephone: '+34634193106',
    },
  }

  return (
    <>
      <PageSEO
        title={`${tour.title} · Private Tour Kansai`}
        description={`${tour.subtitle} — Private guided tour with Tony Kansai Guide. ${tour.duration}. Guided in English, Spanish, Arabic, Czech & Russian.`}
        path={`/tours/${tour.id}`}
        ogImage={tour.imageHero}
        breadcrumb={[{ name: 'Tours', path: '/tours' }, { name: tour.title, path: `/tours/${tour.id}` }]}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(tourSchema)}</script>
      </Helmet>
      {/* ── Cinematic Hero ─────────────────────────────────── */}
      <section ref={heroRef} className="relative h-[85vh] overflow-hidden">
        {/* Parallax image */}
        <motion.div className="absolute inset-0 scale-110" style={{ y: imgY }}>
          <img
            src={tour.imageHero}
            alt={tour.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-japan-dark via-japan-dark/50 to-japan-dark/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-japan-dark/60 to-transparent" />

        {/* Nara: autumn leaf particles overlay */}
        {tour.id === 'nara-sacred' && <NaraParticles />}

        {/* Back button */}
        <motion.div
          className="absolute top-6 left-6 z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/15 text-sm text-white/80 hover:text-white hover:border-japan-red/40 transition-all"
          >
            <ArrowLeft size={14} /> All Tours
          </Link>
        </motion.div>

        {/* Hero text */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10"
          style={{ y: textY, opacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
                style={{ background: `${tour.accent}25`, color: tour.accent, border: `1px solid ${tour.accent}50` }}
              >
                {tour.badge}
              </span>
              <span className="text-xs text-white/50 font-medium">{tour.subtitle}</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-semibold text-white mb-4 leading-none">
              {tour.title}
            </h1>
            <div className="flex items-center gap-6 flex-wrap">
              <span className="font-serif text-3xl font-bold text-gradient-japan">{tour.price}</span>
              <span className="flex items-center gap-1.5 text-sm text-white/50">
                <Clock size={13} />{tour.duration}
              </span>
              <span className="text-sm text-white/40">per tour · not per person</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── CTA bar ─────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-japan-surface/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="hidden sm:block text-sm font-serif text-white/60">
            <span className="text-white font-semibold">{tour.title}</span> · {tour.duration}
          </div>
          <div className="flex gap-3 ml-auto">
            <Link to="/pricing" className="px-4 py-2 rounded-lg glass border border-white/10 text-sm text-white/70 hover:text-white transition-all">
              Pricing
            </Link>
            <a
              href={`${WHATSAPP}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-japan-red to-japan-orange text-white font-semibold text-sm shadow-lg shadow-japan-red/40 hover:scale-105 transition-transform"
            >
              <MessageCircle size={14} /> Book Now
            </a>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <section className="py-16 pb-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-10">

            {/* Main column */}
            <div className="lg:col-span-2 space-y-8">

              <ExplodeIn index={0}>
                <div className="glass rounded-2xl p-8 border border-white/6">
                  <h2 className="font-serif text-2xl font-semibold text-white mb-4">About this Tour</h2>
                  <p className="text-white/65 leading-relaxed text-[15px]">{tour.longDescription}</p>
                </div>
              </ExplodeIn>

              <ExplodeIn index={1}>
                <div className="glass rounded-2xl p-8 border border-white/6">
                  <h2 className="font-serif text-2xl font-semibold text-white mb-6">What You'll Experience</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {tour.highlights.map((h, i) => (
                      <motion.div
                        key={h}
                        className="flex items-start gap-3 text-sm text-white/70"
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.07 }}
                      >
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: `${tour.accent}20`, border: `1px solid ${tour.accent}40` }}>
                          <Check size={10} style={{ color: tour.accent }} />
                        </div>
                        {h}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ExplodeIn>

              <ExplodeIn index={2}>
                <div className="glass rounded-2xl p-8 border border-white/6">
                  <h2 className="font-serif text-2xl font-semibold text-white mb-5">What's Included</h2>
                  <div className="space-y-3">
                    {tour.includes.map((inc) => (
                      <div key={inc} className="flex items-center gap-3 text-sm text-white/70">
                        <div className="w-5 h-5 rounded-full bg-japan-red/15 border border-japan-red/30 flex items-center justify-center flex-shrink-0">
                          <Check size={10} className="text-japan-red" />
                        </div>
                        {inc}
                      </div>
                    ))}
                  </div>
                </div>
              </ExplodeIn>

              {/* Other tours — image strip */}
              <ExplodeIn index={3}>
                <div>
                  <h2 className="font-serif text-xl font-semibold text-white mb-4">Other Experiences</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {TOURS.filter((t) => t.id !== tour.id).slice(0, 4).map((t) => (
                      <Link
                        key={t.id}
                        to={`/tours/${t.id}`}
                        className="group relative h-28 rounded-xl overflow-hidden border border-white/6 hover:border-white/20 transition-colors"
                      >
                        <img
                          src={t.imageCard}
                          alt={t.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-3 left-3">
                          <div className="text-xs font-medium mb-0.5" style={{ color: t.accent }}>{t.subtitle}</div>
                          <div className="text-sm font-semibold text-white">{t.title}</div>
                        </div>
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={14} className="text-white" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </ExplodeIn>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <ExplodeIn index={4}>
                <Card3D glowColor={`${tour.accent}25`}>
                  <div className="glass rounded-2xl p-6 border border-white/6 space-y-5">
                    <h3 className="font-serif text-lg font-semibold text-white">Quick Info</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2.5 text-white/60">
                        <Clock size={14} style={{ color: tour.accent }} />{tour.duration}
                      </div>
                      <div className="flex items-center gap-2.5 text-white/60">
                        <MapPin size={14} style={{ color: tour.accent }} />{tour.meetingPoint}
                      </div>
                      <div className="flex items-center gap-2.5 text-white/60">
                        <Users size={14} style={{ color: tour.accent }} />Private — no shared groups
                      </div>
                    </div>
                    <div className="pt-3 border-t border-white/5">
                      <div className="text-xs text-white/35 mb-2.5 font-medium tracking-wider uppercase">Languages</div>
                      <div className="flex gap-2 flex-wrap">
                        {LANGUAGES.map(({ flag, code }) => (
                          <div key={code} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/8 text-xs text-white/60">
                            <span>{flag}</span><span>{code}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <a
                      href={`${WHATSAPP}?text=${waMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white text-sm font-semibold shadow-lg shadow-japan-red/30 hover:scale-105 transition-transform"
                    >
                      <MessageCircle size={14} /> Book This Tour
                    </a>
                  </div>
                </Card3D>
              </ExplodeIn>

            </div>
          </div>
        </div>
      </section>

      {/* ── ROUTE MAP ─────────────────────────────────────────────── */}
      {tour.mapStops && tour.mapStops.length > 0 && (
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-serif text-2xl font-semibold text-white mb-6">Route Overview</h2>
            <TourMap
              stops={tour.mapStops}
              accent={tour.accent}
              meetingPoint={tour.meetingPoint}
            />
          </div>
        </section>
      )}
    </>
  )
}
