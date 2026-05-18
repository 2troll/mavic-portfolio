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
    <div
      className="relative w-full flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: '90vh', perspective: '1800px' }}
    >
      {/* Atmospheric background — transitions per tour */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 50% 25%, ${TOURS[active].accent}22 0%, transparent 70%)`,
            }}
          />
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(229,48,48,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(229,48,48,.5) 1px, transparent 1px)',
              backgroundSize: '90px 90px',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Nav tabs */}
      <div className="relative z-20 flex gap-1 mb-10 mt-2 px-4 flex-wrap justify-center">
        {TOURS.map((t, i) => (
          <button
            key={t.id}
            onClick={() => go(i)}
            className="relative px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all"
            style={{
              color: i === active ? '#fff' : 'rgba(255,255,255,0.4)',
            }}
          >
            {i === active && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: `${TOURS[active].accent}30`, border: `1px solid ${TOURS[active].accent}50` }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{t.title}</span>
          </button>
        ))}
      </div>

      {/* Slides */}
      <div
        className="relative w-full flex items-center justify-center"
        style={{ height: '560px', transformStyle: 'preserve-3d' }}
      >
        {TOURS.map((tour, i) => {
          const raw = i - active
          // shortest path around the ring
          const offset = raw > total / 2 ? raw - total : raw < -total / 2 ? raw + total : raw
          const visible = Math.abs(offset) <= 1

          if (!visible) return null

          const isActive = offset === 0
          const rotateY = isActive ? 0 : offset < 0 ? 44 : -44
          const translateX = isActive ? '0%' : offset < 0 ? '-56%' : '56%'
          const scale = isActive ? 1 : 0.72
          const opacity = isActive ? 1 : 0.42

          return (
            <motion.div
              key={tour.id}
              className="absolute cursor-pointer"
              style={{ width: 'min(58vw, 640px)' }}
              animate={{ rotateY, x: translateX, scale, opacity, zIndex: isActive ? 10 : 1 }}
              transition={SPRING}
              onClick={() => !isActive && go(i)}
            >
              <div
                className="rounded-3xl overflow-hidden border"
                style={{
                  borderColor: isActive ? `${tour.accent}30` : 'rgba(255,255,255,0.06)',
                  background: 'linear-gradient(145deg, #12141F 0%, #0C0D16 100%)',
                  boxShadow: isActive ? `0 40px 100px ${tour.accent}28, 0 0 0 1px ${tour.accent}18` : 'none',
                }}
              >
                {/* Hero banner */}
                <div
                  className={`relative bg-gradient-to-br ${tour.gradient} flex flex-col items-center justify-center gap-5 py-14`}
                >
                  <motion.div
                    animate={isActive ? { scale: [1, 1.07, 1] } : { scale: 1 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-[88px] leading-none drop-shadow-2xl select-none"
                  >
                    {tour.emoji}
                  </motion.div>
                  <span
                    className="px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
                    style={{
                      background: `${tour.accent}25`,
                      color: tour.accent,
                      border: `1px solid ${tour.accent}45`,
                    }}
                  >
                    {tour.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="p-7 md:p-9">
                  <div
                    className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2"
                    style={{ color: tour.accent }}
                  >
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
                  <p className="text-sm text-white/55 leading-relaxed mb-6 line-clamp-2">
                    {tour.description}
                  </p>
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
                      <MessageCircle size={13} /> Book Now
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Arrow buttons */}
      <button
        onClick={() => go(active - 1)}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-japan-red/40 hover:scale-110 transition-all"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => go(active + 1)}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-japan-red/40 hover:scale-110 transition-all"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots + counter */}
      <div className="relative z-20 flex items-center gap-6 mt-8">
        <div className="flex gap-2 items-center">
          {TOURS.map((_, i) => (
            <button key={i} onClick={() => go(i)} className="p-1">
              <motion.div
                animate={
                  i === active
                    ? { width: 28, height: 6, background: TOURS[active].accent }
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
