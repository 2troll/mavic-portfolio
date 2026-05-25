import { useParams, Link } from 'react-router-dom'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowLeft, Clock, MapPin, Mountain, Users, MessageCircle,
  Check, ChevronRight, Backpack, Star, Calendar, ArrowRight,
} from 'lucide-react'
import { HIKING_ROUTES, WHATSAPP } from '../lib/data'
import { PageSEO } from '../components/PageSEO'

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
          <h2 className="font-serif text-2xl text-white mb-3">Route not found</h2>
          <Link to="/hiking" className="text-japan-red hover:text-japan-orange">← Back to Hiking</Link>
        </div>
      </div>
    )
  }

  const waMsg = encodeURIComponent(
    `Hi Tony! I'm interested in hiring you as a guide for the ${route.title} hike. Can you share availability and pricing?`
  )

  const otherRoutes = HIKING_ROUTES.filter((r) => r.id !== route.id && r.available).slice(0, 4)

  return (
    <>
      <PageSEO
        title={`${route.title} · Hiking Guide Kansai`}
        description={`${route.subtitle} — Private guided hike with Tony Hanma. ${route.totalTime}. Grade: ${route.grade}. Book your guide now.`}
        path={`/hiking/${route.id}`}
        ogImage={route.imageHero}
        breadcrumb={[
          { name: 'Hiking', path: '/hiking' },
          { name: route.title, path: `/hiking/${route.id}` },
        ]}
      />

      {/* ── Hero ───────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-[85vh] overflow-hidden">
        <motion.div className="absolute inset-0 scale-110" style={{ y: imgY }}>
          <img src={route.imageHero} alt={route.title} className="w-full h-full object-cover" loading="eager" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-japan-dark via-japan-dark/50 to-japan-dark/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-japan-dark/60 to-transparent" />

        <motion.div className="absolute top-6 left-6 z-20" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
          <Link to="/hiking" className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/15 text-sm text-white/80 hover:text-white hover:border-japan-red/40 transition-all">
            <ArrowLeft size={14} /> All Hiking Routes
          </Link>
        </motion.div>

        <motion.div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10" style={{ y: textY, opacity }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
                style={{ background: `${route.accent}25`, color: route.accent, border: `1px solid ${route.accent}50` }}
              >
                {route.badge}
              </span>
              <span className="text-xs text-white/50 font-medium">{route.date}</span>
              <span className="text-xs text-white/40">{route.grade}</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-semibold text-white mb-3 leading-none">{route.title}</h1>
            <p className="text-white/60 text-lg mb-4">{route.subtitle}</p>
            <div className="flex items-center gap-6 flex-wrap">
              {route.altitude && (
                <div className="flex items-center gap-1.5" style={{ color: route.accent }}>
                  <Mountain size={15} />
                  <span className="font-bold text-lg">{route.altitude}</span>
                </div>
              )}
              <span className="flex items-center gap-1.5 text-sm text-white/50">
                <Clock size={13} />{route.totalTime}
              </span>
              {route.distance && (
                <span className="flex items-center gap-1.5 text-sm text-white/50">
                  <MapPin size={13} />{route.distance}
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
            <span className="text-white font-semibold">{route.title}</span> · {route.grade}
          </div>
          <div className="flex gap-3 ml-auto items-center">
            <span className="text-sm font-serif font-bold text-gradient-japan">{route.price}</span>
            <a
              href={`${WHATSAPP}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-japan-red to-japan-orange text-white font-semibold text-sm shadow-lg shadow-japan-red/40 hover:scale-105 transition-transform"
            >
              <MessageCircle size={14} /> Book Guide
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
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: route.accent }}>Tony's Field Note</span>
                </div>
                <blockquote className="font-serif text-lg text-white/80 leading-relaxed italic">
                  "{route.note}"
                </blockquote>
                <div className="mt-4 flex items-center gap-2">
                  <img src="/guides/guide-tony.jpg" alt="Tony" className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-xs text-white/40">Tony Hanma · {route.date}</span>
                  <span className="text-xs text-white/25 ml-1">· {route.companions}</span>
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
                  <h2 className="font-serif text-xl font-semibold text-white">Full Schedule & Timing</h2>
                </div>
                <div className="text-xs text-white/30 mb-5 uppercase tracking-wide">Total · {route.totalTime}</div>

                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-3 top-0 bottom-0 w-px bg-white/8" />

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
                          className="relative flex items-start gap-4 pl-8 py-3"
                        >
                          {/* Dot */}
                          <div
                            className="absolute left-0 top-4 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: `${color}20`, border: `1.5px solid ${color}50` }}
                          >
                            <span className="font-bold text-[9px]" style={{ color }}>{i + 1}</span>
                          </div>

                          <div className="flex-1 flex items-start justify-between gap-3 min-w-0">
                            <div className="min-w-0">
                              <div className="text-sm text-white/80 leading-snug">{step.segment}</div>
                              <div className="text-[10px] mt-0.5 font-medium uppercase tracking-wide" style={{ color }}>{label}</div>
                            </div>
                            <div
                              className="flex-shrink-0 text-xs font-mono font-semibold px-2 py-0.5 rounded-md"
                              style={{ background: `${color}15`, color }}
                            >
                              {step.duration}
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
                      <span className="text-[10px] text-white/35 uppercase tracking-wide">{TYPE_LABEL[t]}</span>
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
                  <h2 className="font-serif text-xl font-semibold text-white">What to Bring</h2>
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
                      {item}
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
                  <h2 className="font-serif text-xl font-semibold text-white">Tony's Insider Tips</h2>
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
                      <p className="text-sm text-white/60 leading-relaxed">{tip}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Other routes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.25 }}
              >
                <h2 className="font-serif text-xl font-semibold text-white mb-4">Other Routes</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {otherRoutes.map((r) => (
                    <Link
                      key={r.id}
                      to={`/hiking/${r.id}`}
                      className="group relative h-28 rounded-xl overflow-hidden border border-white/6 hover:border-white/20 transition-colors"
                    >
                      <img src={r.imageCard} alt={r.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <div className="text-xs font-medium mb-0.5" style={{ color: r.accent }}>{r.altitude || r.grade}</div>
                        <div className="text-sm font-semibold text-white">{r.title}</div>
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight size={14} className="text-white" />
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
                <div className="text-xs text-white/30 mb-1 uppercase tracking-wide">Guide Fee</div>
                <div className="font-serif text-3xl font-bold mb-1" style={{ color: route.accent }}>
                  {route.price}
                </div>
                <div className="text-xs text-white/30 mb-5">per group · not per person</div>

                <div className="space-y-3 text-sm mb-5">
                  <div className="flex items-center gap-2.5 text-white/55">
                    <Clock size={13} style={{ color: route.accent }} />{route.totalTime}
                  </div>
                  <div className="flex items-center gap-2.5 text-white/55">
                    <MapPin size={13} style={{ color: route.accent }} />{route.meetingPoint}
                  </div>
                  <div className="flex items-center gap-2.5 text-white/55">
                    <Users size={13} style={{ color: route.accent }} />Private — no shared groups
                  </div>
                  <div className="flex items-center gap-2.5 text-white/55">
                    <Calendar size={13} style={{ color: route.accent }} />Best: {route.bestSeason}
                  </div>
                </div>

                {route.available ? (
                  <a
                    href={`${WHATSAPP}?text=${waMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white text-sm font-semibold shadow-lg shadow-japan-red/30 hover:scale-105 transition-transform"
                  >
                    <MessageCircle size={14} /> Book Tony as Guide
                  </a>
                ) : (
                  <>
                    <a
                      href={`${WHATSAPP}?text=${waMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-white/15 text-white/60 text-sm font-medium hover:border-white/30 hover:text-white transition-all"
                    >
                      <MessageCircle size={14} /> Request Consultation
                    </a>
                    <p className="text-[11px] text-white/25 text-center mt-2">Extreme route — fitness assessment required</p>
                  </>
                )}
              </motion.div>

              {/* What's included */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-6 border border-white/6"
              >
                <h3 className="font-serif text-base font-semibold text-white mb-4">What's Included</h3>
                <div className="space-y-2.5">
                  {route.includes.map((inc) => (
                    <div key={inc} className="flex items-start gap-2.5 text-xs text-white/60">
                      <div className="w-4 h-4 rounded-full bg-japan-red/15 border border-japan-red/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={8} className="text-japan-red" />
                      </div>
                      {inc}
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
                <h3 className="font-serif text-base font-semibold text-white mb-4">Route Info</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Location', value: route.location },
                    { label: 'Access', value: route.access },
                    { label: 'Route', value: route.route },
                    { label: 'Summit', value: route.summit },
                    route.wildlife ? { label: 'Wildlife', value: route.wildlife } : null,
                  ].filter(Boolean).map((item) => (
                    <div key={item!.label} className="flex gap-2">
                      <span className="text-[10px] text-white/25 uppercase tracking-wide w-14 flex-shrink-0 pt-0.5 font-medium">{item!.label}</span>
                      <span className="text-xs text-white/55 leading-relaxed">{item!.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Back to all routes */}
              <Link
                to="/hiking"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/8 text-white/40 hover:text-white/70 hover:border-white/20 text-sm transition-all"
              >
                <ArrowLeft size={13} /> All 12 Hiking Routes
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-serif text-2xl font-semibold text-white mb-3">Ready to hike {route.title}?</h2>
          <p className="text-white/40 text-sm mb-6">Tony walked this route personally. Message him directly on WhatsApp to check availability.</p>
          <a
            href={`${WHATSAPP}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white font-semibold shadow-lg shadow-japan-red/30 hover:scale-105 transition-transform"
          >
            <MessageCircle size={15} /> Hire Tony · {route.price}
            <ArrowRight size={14} />
          </a>
        </div>
      </section>
    </>
  )
}
