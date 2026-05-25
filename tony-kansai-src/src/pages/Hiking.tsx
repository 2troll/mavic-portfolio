import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mountain, Clock, MapPin, Users, MessageCircle, ChevronDown, ChevronUp, Calendar, Filter } from 'lucide-react'
import { HeroTextKinetic } from '../components/HeroTextKinetic'
import { PageSEO } from '../components/PageSEO'
import { HIKING_ROUTES, WHATSAPP } from '../lib/data'

const GRADES = ['All', 'Easy', 'Moderate', 'Hard', 'Technical', 'Expert Only'] as const

const CALENDAR_MONTHS = [
  {
    month: 'April 2026',
    routes: HIKING_ROUTES.filter(r => r.date.startsWith('Apr')),
  },
  {
    month: 'May 2026',
    routes: HIKING_ROUTES.filter(r => r.date.startsWith('May')),
  },
]

function GradeTag({ grade, accent }: { grade: string; accent: string }) {
  const level = grade.toLowerCase()
  const isHard = level.includes('hard') || level.includes('technical') || level.includes('expert')
  const isEasy = level.includes('easy')
  return (
    <span
      className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
      style={{
        background: isHard ? 'rgba(239,68,68,0.15)' : isEasy ? 'rgba(34,197,94,0.15)' : `${accent}18`,
        color: isHard ? '#EF4444' : isEasy ? '#22C55E' : accent,
        border: `1px solid ${isHard ? 'rgba(239,68,68,0.35)' : isEasy ? 'rgba(34,197,94,0.35)' : accent + '35'}`,
      }}
    >
      {grade}
    </span>
  )
}

function RouteCard({ route, index }: { route: typeof HIKING_ROUTES[0]; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const waMsg = encodeURIComponent(
    `Hi Tony! I'm interested in hiring you as a guide for the ${route.title} hike (${route.date}). Can you share availability and pricing?`
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="rounded-2xl overflow-hidden border"
      style={{
        borderColor: `${route.accent}22`,
        background: 'linear-gradient(145deg, #12141F 0%, #0C0D16 100%)',
        boxShadow: `0 0 0 1px ${route.accent}10`,
      }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={route.imageCard}
          alt={route.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase backdrop-blur-sm"
            style={{ background: `${route.accent}30`, color: route.accent, border: `1px solid ${route.accent}50` }}
          >
            {route.badge}
          </span>
          {!route.available && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase backdrop-blur-sm bg-black/40 text-white/40 border border-white/15">
              Extreme
            </span>
          )}
        </div>

        {/* Date */}
        <div className="absolute bottom-3 right-3">
          <span className="text-[10px] text-white/50 font-medium">{route.date}</span>
        </div>

        {/* Altitude pill */}
        {route.altitude && (
          <div className="absolute bottom-3 left-3">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-sm"
              style={{ background: `${route.accent}25`, border: `1px solid ${route.accent}40` }}
            >
              <Mountain size={10} style={{ color: route.accent }} />
              <span className="text-xs font-bold" style={{ color: route.accent }}>{route.altitude}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: route.accent }}>
          {route.subtitle}
        </div>
        <h3 className="font-serif text-xl font-semibold text-white mb-3 leading-snug">{route.title}</h3>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3">
          {route.duration && (
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Clock size={11} style={{ color: route.accent }} />{route.duration}
            </div>
          )}
          {route.distance && (
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <MapPin size={11} style={{ color: route.accent }} />{route.distance}
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <Users size={11} style={{ color: route.accent }} />{route.companions}
          </div>
        </div>

        <div className="mb-4">
          <GradeTag grade={route.grade} accent={route.accent} />
        </div>

        <p className="text-xs text-white/45 leading-relaxed mb-4 italic line-clamp-2">"{route.note}"</p>

        {/* Expandable details */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-3"
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? 'Less details' : 'Route details'}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 mb-4 pt-1 border-t border-white/5">
                {[
                  { label: 'Location', value: route.location },
                  { label: 'Access', value: route.access },
                  { label: 'Route', value: route.route },
                  { label: 'Summit', value: route.summit },
                  route.wildlife ? { label: 'Wildlife', value: route.wildlife } : null,
                ].filter(Boolean).map((item) => (
                  <div key={item!.label} className="flex gap-2 text-xs">
                    <span className="text-white/30 w-16 flex-shrink-0 font-medium uppercase tracking-wide">{item!.label}</span>
                    <span className="text-white/55">{item!.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        {route.available ? (
          <a
            href={`${WHATSAPP}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white text-xs font-semibold hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-japan-red/25"
          >
            <MessageCircle size={12} /> Hire Tony as Guide
          </a>
        ) : (
          <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/8 text-white/25 text-xs font-medium">
            Extreme route — contact for consultation
          </div>
        )}
      </div>
    </motion.div>
  )
}

function CalendarSection() {
  return (
    <section className="py-20 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-3"
          >
            Photo Calendar
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl font-semibold text-white mb-3"
          >
            Each Mountain · Its Own Light
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-sm max-w-md mx-auto"
          >
            Browse the routes by month and pick the landscape that speaks to you — then book Tony as your guide.
          </motion.p>
        </div>

        {CALENDAR_MONTHS.map((block, bi) => (
          <div key={block.month} className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <Calendar size={14} className="text-japan-red" />
              <h3 className="font-serif text-lg text-white/80 font-medium">{block.month}</h3>
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-xs text-white/30">{block.routes.length} hikes</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {block.routes.map((route, i) => {
                const waMsg = encodeURIComponent(
                  `Hi Tony! I saw the photo from ${route.title} and I'd love to hike it with you as guide. What's your availability?`
                )
                return (
                  <motion.a
                    key={route.id}
                    href={`${WHATSAPP}?text=${waMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: bi * 0.05 + i * 0.04 }}
                    className="group relative rounded-xl overflow-hidden aspect-square border border-white/6 hover:border-white/25 transition-all"
                  >
                    <img
                      src={route.imageCard}
                      alt={route.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div
                        className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5"
                        style={{ background: `${route.accent}90`, color: '#fff' }}
                      >
                        <MessageCircle size={10} /> Book Guide
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="text-[9px] text-white/50 mb-0.5">{route.date}</div>
                      <div className="text-xs font-semibold text-white leading-tight truncate">{route.title}</div>
                      {route.altitude && (
                        <div className="text-[9px] mt-0.5" style={{ color: route.accent }}>{route.altitude}</div>
                      )}
                    </div>
                  </motion.a>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Hiking() {
  const [gradeFilter, setGradeFilter] = useState<string>('All')

  const filtered = gradeFilter === 'All'
    ? HIKING_ROUTES
    : HIKING_ROUTES.filter(r => r.grade.toLowerCase().includes(gradeFilter.toLowerCase()))

  const waGuide = encodeURIComponent(
    'Hi Tony! I\'m interested in hiring you as a mountain hiking guide in Kansai. Can we talk about routes and availability?'
  )

  return (
    <>
      <PageSEO
        title="Kansai Mountain Hiking Routes · Tony Hanma Guide"
        description="12 real mountain hikes completed by Tony Hanma in Osaka, Kyoto & Kobe — Mt. Kongo, Fushimi Inari, Mt. Hiei, Mt. Maya, Ponpon Mountain and more. Hire Tony as your private hiking guide."
        path="/hiking"
        breadcrumb={[{ name: 'Hiking', path: '/hiking' }]}
      />

      {/* Hero */}
      <section className="relative pt-28 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-japan-dark to-japan-surface" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(229,48,48,0.8) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-4"
          >
            Kansai · Mountain Expeditions 2026
          </motion.div>
          <div className="mb-4">
            <HeroTextKinetic
              text="Hiking Routes"
              className="justify-center text-4xl md:text-5xl lg:text-6xl font-serif font-semibold"
              delay={0.1}
            />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/50 text-lg font-light max-w-xl mx-auto mb-8"
          >
            12 real routes explored by Tony across Osaka, Kyoto and Kobe — from sacred summits to lost valleys. Hire Tony to guide you through any of them.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mb-8"
          >
            {[
              { value: '12', label: 'Routes Completed' },
              { value: '9', label: 'Available to Guide' },
              { value: '1,125m', label: 'Highest Peak' },
              { value: '14.1 km', label: 'Longest Route' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-serif text-2xl font-bold text-gradient-japan">{s.value}</div>
                <div className="text-[11px] text-white/35 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Book CTA */}
          <motion.a
            href={`${WHATSAPP}?text=${waGuide}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white font-semibold shadow-lg shadow-japan-red/30 hover:scale-105 active:scale-95 transition-transform"
          >
            <MessageCircle size={16} /> Hire Tony as Hiking Guide
          </motion.a>
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-16 z-20 bg-japan-dark/90 backdrop-blur-xl border-b border-white/5 py-3">
        <div className="max-w-5xl mx-auto px-6 flex items-center gap-3 overflow-x-auto pb-0.5">
          <Filter size={13} className="text-white/30 flex-shrink-0" />
          {GRADES.map((g) => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all"
              style={
                gradeFilter === g
                  ? { background: '#E53030', color: '#fff' }
                  : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)' }
              }
            >
              {g}
            </button>
          ))}
          <span className="ml-auto flex-shrink-0 text-xs text-white/25">{filtered.length} routes</span>
        </div>
      </section>

      {/* Routes grid */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-white/30 py-20"
              >
                No routes match this filter.
              </motion.p>
            ) : (
              <motion.div
                key={gradeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((route, i) => (
                  <RouteCard key={route.id} route={route} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Calendar photo section */}
      <CalendarSection />

      {/* Bottom CTA */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Mountain size={32} className="text-japan-red mx-auto mb-4 opacity-60" />
          <h2 className="font-serif text-3xl font-semibold text-white mb-3">
            Ready to hit the trail?
          </h2>
          <p className="text-white/45 text-sm leading-relaxed mb-8 max-w-md mx-auto">
            Tony has walked every one of these routes personally — some multiple times, some alone, some lost for hours. He knows exactly where to go, where to stop, and what you'd miss without a guide.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`${WHATSAPP}?text=${waGuide}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white font-semibold shadow-lg shadow-japan-red/30 hover:scale-105 transition-transform"
            >
              <MessageCircle size={15} /> Book a Hiking Guide
            </a>
            <a
              href="/tours"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/25 font-medium transition-all"
            >
              View All Tours
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
