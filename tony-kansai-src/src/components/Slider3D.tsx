import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { TOURS, WHATSAPP } from '../lib/data'

const SPRING = { type: 'spring', stiffness: 220, damping: 30 } as const

export function Slider3D() {
  const [active, setActive] = useState(0)
  const total = TOURS.length

  const go = (idx: number) => setActive(((idx % total) + total) % total)

  return (
    <div className="relative w-full overflow-hidden px-4">
      {/* Atmospheric background per tour */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 50% 25%, ${TOURS[active].accent}20 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(229,48,48,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(229,48,48,.6) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Tab nav */}
      <div className="relative z-10 flex gap-1 mb-8 flex-wrap justify-center">
        {TOURS.map((t, i) => (
          <button
            key={t.id}
            onClick={() => go(i)}
            className="relative px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all"
            style={{ color: i === active ? '#fff' : 'rgba(255,255,255,0.4)' }}
          >
            {i === active && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 rounded-full"
                style={{
                  background: `${TOURS[active].accent}30`,
                  border: `1px solid ${TOURS[active].accent}50`,
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{t.title}</span>
          </button>
        ))}
      </div>

      {/* Cards carousel — horizontal translate, no rotateY (mobile-safe) */}
      <div className="relative flex items-center justify-center" style={{ minHeight: 'min(560px, 80vw + 120px)' }}>
        {TOURS.map((tour, i) => {
          const raw = i - active
          const offset = raw > total / 2 ? raw - total : raw < -total / 2 ? raw + total : raw
          const visible = Math.abs(offset) <= 1
          if (!visible) return null

          const isActive = offset === 0
          const sign = offset < 0 ? -1 : 1

          return (
            <motion.div
              key={tour.id}
              className="absolute"
              style={{ width: 'min(90vw, 640px)', zIndex: isActive ? 20 : 5, cursor: isActive ? 'default' : 'pointer' }}
              animate={{
                x: isActive ? 0 : sign * (typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.52, 340) : 300),
                scale: isActive ? 1 : 0.76,
                opacity: isActive ? 1 : 0.38,
                rotateY: isActive ? 0 : sign * 32,
              }}
              transition={SPRING}
              onClick={() => !isActive && go(i)}
            >
              <div
                className="rounded-3xl overflow-hidden border"
                style={{
                  borderColor: isActive ? `${tour.accent}35` : 'rgba(255,255,255,0.05)',
                  background: 'linear-gradient(145deg, #12141F 0%, #0C0D16 100%)',
                  boxShadow: isActive ? `0 32px 80px ${tour.accent}25, 0 0 0 1px ${tour.accent}18` : 'none',
                }}
              >
                {/* Banner */}
                <div className={`bg-gradient-to-br ${tour.gradient} flex flex-col items-center justify-center gap-4 py-10`}>
                  <motion.div
                    animate={isActive ? { scale: [1, 1.07, 1] } : { scale: 1 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-7xl md:text-[88px] leading-none drop-shadow-2xl select-none"
                  >
                    {tour.emoji}
                  </motion.div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
                    style={{ background: `${tour.accent}25`, color: tour.accent, border: `1px solid ${tour.accent}45` }}
                  >
                    {tour.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <div className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: tour.accent }}>
                    {tour.subtitle}
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white mb-2 leading-snug">
                    {tour.title}
                  </h2>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-serif text-xl font-bold text-gradient-japan">{tour.price}</span>
                    <span className="flex items-center gap-1 text-xs text-white/40">
                      <Clock size={10} /> {tour.duration}
                    </span>
                  </div>
                  <p className="text-sm text-white/55 leading-relaxed mb-5 line-clamp-2">{tour.description}</p>
                  <div className="flex gap-3">
                    <Link
                      to={`/tours/${tour.id}`}
                      className="flex-1 py-3 rounded-xl border border-white/10 text-center text-sm text-white/70 hover:text-white hover:border-japan-red/40 transition-all font-medium"
                    >
                      Details
                    </Link>
                    <a
                      href={`${WHATSAPP}?text=${encodeURIComponent(`Hi Tony! I'm interested in the ${tour.title} tour.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white text-sm font-semibold shadow-lg shadow-japan-red/30 hover:scale-105 active:scale-95 transition-transform"
                    >
                      <MessageCircle size={13} /> Book
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Arrow buttons — z-30 so they're above cards (z-20) */}
      <button
        onClick={() => go(active - 1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-japan-red/40 hover:scale-110 transition-all"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={() => go(active + 1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-japan-red/40 hover:scale-110 transition-all"
      >
        <ChevronRight size={16} />
      </button>

      {/* Dots */}
      <div className="relative z-10 flex items-center justify-center gap-5 mt-8 pb-6">
        <div className="flex gap-2 items-center">
          {TOURS.map((_, i) => (
            <button key={i} onClick={() => go(i)} className="p-1">
              <motion.div
                animate={
                  i === active
                    ? { width: 24, height: 6, background: TOURS[active].accent }
                    : { width: 6, height: 6, background: 'rgba(255,255,255,0.25)' }
                }
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="rounded-full"
              />
            </button>
          ))}
        </div>
        <div className="text-white/30 font-serif text-xs select-none">
          <span className="text-white/80 font-semibold">{String(active + 1).padStart(2, '0')}</span>
          {' / '}
          {String(total).padStart(2, '0')}
        </div>
      </div>
    </div>
  )
}
