import { useParams, Link } from 'react-router-dom'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowLeft, Clock, MapPin, Mountain, Users, MessageCircle,
  Check, ChevronRight, Backpack, Star, Calendar, ArrowRight,
} from 'lucide-react'
import { HIKING_ROUTES, WHATSAPP } from '../lib/data'
import { Helmet } from 'react-helmet-async'
import { PageSEO } from '../components/PageSEO'
import { useLanguage } from '../contexts/LanguageContext'

type TimingType = 'transit' | 'hike' | 'explore'

const TYPE_COLOR: Record<TimingType, string> = {
  transit: '#64748B',
  hike: '#10B981',
  explore: '#F97316',
}
const TYPE_LABEL: Record<TimingType, string> = {
  transit: 'Transit',
  hike: 'Hiking',
  explore: 'At Site',
}

export default function HikingDetail() {
  const { tc } = useLanguage()
  const { id } = useParams()
  const route = HIKING_ROUTES.find((r) => r.id === id)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '60%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  if (!route) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-white mb-3">{tc('Route not found')}</h2>
          <Link to="/hiking" className="text-japan-red hover:text-japan-orange">← {tc('All Hiking Routes')}</Link>
        </div>
      </div>
    )
  }

  const waMsg = encodeURIComponent(
    `${tc('Hi Tony! I would like to hire you as a guide for this hike:')} ${tc(route.title)}. ${tc('Can you share availability and pricing?')}`,
  )

  const otherRoutes = HIKING_ROUTES.filter((r) => r.id !== route.id && r.available).slice(0, 4)

  // Google entiende una ruta guiada como TouristTrip. Sin esto, /hiking/:id
  // era la única parte del sitio sin datos estructurados y no salía con
  // precio ni con foto en los resultados.
  const precioNumerico = parseInt(route.price.replace(/[^0-9]/g, ''), 10)
  const rutaSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tc(route.title),
    description: tc(route.note),
    image: route.imageHero,
    url: `https://tonykansaiguide.com/hiking/${route.id}`,
    touristType: tc(route.grade),
    itinerary: {
      '@type': 'ItemList',
      itemListElement: route.timing.map((paso, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: tc(paso.segment),
      })),
    },
    provider: {
      '@type': 'LocalBusiness',
      name: 'Tony Hanma Private Kansai Tours',
      telephone: '+34634193106',
      areaServed: 'Kansai, Japan',
    },
    ...(precioNumerico ? {
      offers: {
        '@type': 'Offer',
        price: precioNumerico,
        priceCurrency: 'JPY',
        availability: route.available
          ? 'https://schema.org/InStock'
          : 'https://schema.org/PreOrder',
      },
    } : {}),
  }

  return (
    <>
      <PageSEO
        title={`${tc(route.title)} · ${tc('Hiking Guide Kansai')}`}
        description={`${tc(route.subtitle)} — ${tc('Private guided hike with Tony Hanma.')} ${tc(route.totalTime)}. ${tc('Grade')}: ${tc(route.grade)}. ${tc('Book your guide now.')}`}
        path={`/hiking/${route.id}`}
        ogImage={route.imageHero}
        breadcrumb={[
          { name: tc('Hiking'), path: '/hiking' },
          { name: tc(route.title), path: `/hiking/${route.id}` },
        ]}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(rutaSchema)}</script>
      </Helmet>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-[85vh] overflow-hidden">
        <motion.div className="absolute inset-0 scale-110" style={{ y: imgY }}>
          <img src={route.imageHero} alt={tc(route.title)} className="w-full h-full object-cover" loading="eager" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-japan-dark via-japan-dark/50 to-japan-dark/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-japan-dark/60 to-transparent" />

        <motion.div className="absolute top-6 start-6 z-20" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
          <Link to="/hiking" className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/15 text-sm text-white/80 hover:text-white hover:border-japan-red/40 transition-all">
            <ArrowLeft className="flip-rtl" size={14} /> {tc('All Hiking Routes')}
          </Link>
        </motion.div>

        <motion.div className="absolute bottom-0 start-0 end-0 p-8 md:p-16 z-10" style={{ y: textY, opacity }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
                style={{ background: `${route.accent}25`, color: route.accent, border: `1px solid ${route.accent}50` }}
              >
                {tc(route.badge)}
              </span>
              <span className="text-xs text-white/50 font-medium">{tc(route.date)}</span>
              <span className="text-xs text-white/55">{tc(route.grade)}</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-semibold text-white mb-3 leading-none">{tc(route.title)}</h1>
            <p className="text-white/60 text-lg mb-4">{tc(route.subtitle)}</p>
            <div className="flex items-center gap-6 flex-wrap">
              {route.altitude && (
                <div className="flex items-center gap-1.5" style={{ color: route.accent }}>
                  <Mountain size={15} />
                  <span className="ltr-num font-bold text-lg">{tc(route.altitude)}</span>
                </div>
              )}
              <span className="flex items-center gap-1.5 text-sm text-white/50">
                <Clock size={13} />{tc(route.totalTime)}
              </span>
              {route.distance && (
                <span className="flex items-center gap-1.5 text-sm text-white/50">
                  <MapPin size={13} />{tc(route.distance)}
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Sticky CTA bar ──────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-japan-surface/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="hidden sm:block text-sm font-serif text-white/60">
            <span className="text-white font-semibold">{tc(route.title)}</span> · {tc(route.grade)}
          </div>
          <div className="flex gap-3 ms-auto items-center">
            <span className="ltr-num text-sm font-serif font-bold text-gradient-japan">{tc(route.price)}</span>
            <a
              href={`${WHATSAPP}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-japan-red to-japan-orange text-white font-semibold text-sm shadow-lg shadow-japan-red/40 hover:scale-105 transition-transform"
            >
              <MessageCircle size={14} /> {tc('Book Guide')}
            </a>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <section className="py-16 pb-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-10">

            {/* Main column */}
            <div className="lg:col-span-2 space-y-8">

              {/* Tony's note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="glass rounded-2xl p-8 border"
                style={{ borderColor: `${route.accent}20` }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Star size={14} style={{ color: route.accent }} />
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: route.accent }}>{tc("Tony's Field Note")}</span>
                </div>
                <blockquote className="font-serif text-lg text-white/80 leading-relaxed italic">
                  "{tc(route.note)}"
                </blockquote>
                <div className="mt-4 flex items-center gap-2">
                  <img src="/guides/guide-tony.jpg" alt="Tony" className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-xs text-white/55">{tc('Tony Hanma')} · {tc(route.date)}</span>
                  <span className="text-xs text-white/45 ms-1">· {tc(route.companions)}</span>
                </div>
              </motion.div>

              {/* Full timing breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-8 border border-white/6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Clock size={16} className="text-japan-red" />
                  <h2 className="font-serif text-xl font-semibold text-white">{tc('Full Schedule and Timing')}</h2>
                </div>
                <div className="text-xs text-white/45 mb-5 uppercase tracking-wide">{tc('Total')} · {tc(route.totalTime)}</div>

                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute start-3 top-0 bottom-0 w-px bg-white/8" />

                  <div className="space-y-1">
                    {route.timing.map((step, i) => {
                      const color = TYPE_COLOR[step.type as TimingType]
                      const label = TYPE_LABEL[step.type as TimingType]
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.06 }}
                          className="relative flex items-start gap-4 ps-8 py-3"
                        >
                          {/* Dot */}
                          <div
                            className="absolute start-0 top-4 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: `${color}20`, border: `1.5px solid ${color}50` }}
                          >
                            <span className="font-bold text-[9px]" style={{ color }}>{i + 1}</span>
                          </div>

                          <div className="flex-1 flex items-start justify-between gap-3 min-w-0">
                            <div className="min-w-0">
                              <div className="text-sm text-white/80 leading-snug">{tc(step.segment)}</div>
                              <div className="text-[10px] mt-0.5 font-medium uppercase tracking-wide" style={{ color }}>{tc(label)}</div>
                            </div>
                            <div
                              className="flex-shrink-0 text-xs font-mono font-semibold px-2 py-0.5 rounded-md"
                              style={{ background: `${color}15`, color }}
                            >
                              {tc(step.duration)}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex gap-4 mt-6 pt-4 border-t border-white/6">
                  {(Object.keys(TYPE_COLOR) as TimingType[]).map((t) => (
                    <div key={t} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: TYPE_COLOR[t] }} />
                      <span className="text-[10px] text-white/50 uppercase tracking-wide">{tc(TYPE_LABEL[t])}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Gear */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="glass rounded-2xl p-8 border border-white/6"
              >
                <div className="flex items-center gap-2 mb-5">
                  <Backpack size={16} className="text-japan-red" />
                  <h2 className="font-serif text-xl font-semibold text-white">{tc('What to Bring')}</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {route.gear.map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 text-sm text-white/65"
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `${route.accent}18`, border: `1px solid ${route.accent}35` }}
                      >
                        <Check size={10} style={{ color: route.accent }} />
                      </div>
                      {tc(item)}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Tony's tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-8 border border-white/6"
              >
                <div className="flex items-center gap-2 mb-5">
                  <Mountain size={16} className="text-japan-red" />
                  <h2 className="font-serif text-xl font-semibold text-white">{tc("Tony's Insider Tips")}</h2>
                </div>
                <div className="space-y-4">
                  {route.tips.map((tip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] font-bold"
                        style={{ background: `${route.accent}20`, color: route.accent, border: `1px solid ${route.accent}40` }}
                      >
                        {i + 1}
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed">{tc(tip)}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Other routes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.25 }}
              >
                <h2 className="font-serif text-xl font-semibold text-white mb-4">{tc('Other Routes')}</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {otherRoutes.map((r) => (
                    <Link
                      key={r.id}
                      to={`/hiking/${r.id}`}
                      className="group relative h-28 rounded-xl overflow-hidden border border-white/6 hover:border-white/20 transition-colors"
                    >
                      <img src={r.imageCard} alt={tc(r.title)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-3 start-3">
                        <div className="text-xs font-medium mb-0.5" style={{ color: r.accent }}><span className={r.altitude ? 'ltr-num' : undefined}>{r.altitude ? tc(r.altitude) : tc(r.grade)}</span></div>
                        <div className="text-sm font-semibold text-white">{tc(r.title)}</div>
                      </div>
                      <div className="absolute top-3 end-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight size={14} className="flip-rtl text-white" />
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">

              {/* Book card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="glass rounded-2xl p-6 border"
                style={{ borderColor: `${route.accent}20`, boxShadow: `0 0 40px ${route.accent}10` }}
              >
                <div className="text-xs text-white/45 mb-1 uppercase tracking-wide">{tc('Guide Fee')}</div>
                <div className="font-serif text-3xl font-bold mb-1" style={{ color: route.accent }}>
                  <span className="ltr-num">{tc(route.price)}</span>
                </div>
                <div className="text-xs text-white/45 mb-5">{tc('per group · not per person')}</div>

                <div className="space-y-3 text-sm mb-5">
                  <div className="flex items-center gap-2.5 text-white/55">
                    <Clock size={13} style={{ color: route.accent }} />{tc(route.totalTime)}
                  </div>
                  <div className="flex items-center gap-2.5 text-white/55">
                    <MapPin size={13} style={{ color: route.accent }} />{tc(route.meetingPoint)}
                  </div>
                  <div className="flex items-center gap-2.5 text-white/55">
                    <Users size={13} style={{ color: route.accent }} />{tc('Private — no shared groups')}
                  </div>
                  <div className="flex items-center gap-2.5 text-white/55">
                    <Calendar size={13} style={{ color: route.accent }} />{tc('Best')}: {tc(route.bestSeason)}
                  </div>
                </div>

                {route.available ? (
                  <a
                    href={`${WHATSAPP}?text=${waMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white text-sm font-semibold shadow-lg shadow-japan-red/30 hover:scale-105 transition-transform"
                  >
                    <MessageCircle size={14} /> {tc('Book Tony as Guide')}
                  </a>
                ) : (
                  <>
                    <a
                      href={`${WHATSAPP}?text=${waMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-white/15 text-white/60 text-sm font-medium hover:border-white/30 hover:text-white transition-all"
                    >
                      <MessageCircle size={14} /> {tc('Request Consultation')}
                    </a>
                    <p className="text-[11px] text-white/45 text-center mt-2">{tc('Extreme route — fitness assessment required')}</p>
                  </>
                )}
              </motion.div>

              {/* What's included */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-6 border border-white/6"
              >
                <h3 className="font-serif text-base font-semibold text-white mb-4">{tc('What is Included')}</h3>
                <div className="space-y-2.5">
                  {route.includes.map((inc) => (
                    <div key={inc} className="flex items-start gap-2.5 text-xs text-white/60">
                      <div className="w-4 h-4 rounded-full bg-japan-red/15 border border-japan-red/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={8} className="text-japan-red" />
                      </div>
                      {tc(inc)}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Route details quick ref */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="glass rounded-2xl p-6 border border-white/6"
              >
                <h3 className="font-serif text-base font-semibold text-white mb-4">{tc('Route Info')}</h3>
                <div className="space-y-3">
                  {[
                    { label: tc('Location'), value: tc(route.location) },
                    { label: tc('Access'), value: tc(route.access) },
                    { label: tc('Route'), value: tc(route.route) },
                    { label: tc('Summit'), value: tc(route.summit) },
                    route.wildlife ? { label: tc('Wildlife'), value: tc(route.wildlife) } : null,
                  ].filter(Boolean).map((item) => (
                    <div key={item!.label} className="flex gap-2">
                      <span className="text-[10px] text-white/45 uppercase tracking-wide w-14 flex-shrink-0 pt-0.5 font-medium">{item!.label}</span>
                      <span className="text-xs text-white/55 leading-relaxed">{item!.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Back to all routes */}
              <Link
                to="/hiking"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/8 text-white/55 hover:text-white/70 hover:border-white/20 text-sm transition-all"
              >
                <ArrowLeft className="flip-rtl" size={13} /> {tc('All {n} Hiking Routes').replace('{n}', String(HIKING_ROUTES.length))}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-serif text-2xl font-semibold text-white mb-3">{tc('Ready to hike {name}?').replace('{name}', tc(route.title))}</h2>
          <p className="text-white/55 text-sm mb-6">{tc('Tony walked this route personally. Message him directly on WhatsApp to check availability.')}</p>
          <a
            href={`${WHATSAPP}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white font-semibold shadow-lg shadow-japan-red/30 hover:scale-105 transition-transform"
          >
            <MessageCircle size={15} /> {tc('Hire Tony')} · <span className="ltr-num">{tc(route.price)}</span>
            <ArrowRight className="flip-rtl" size={14} />
          </a>
        </div>
      </section>
    </>
  )
}
