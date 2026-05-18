import { motion } from 'framer-motion'

const ORBS = [
  { size: 400, x: '60%', y: '20%', color: '#E53030', delay: 0, duration: 12 },
  { size: 320, x: '10%', y: '60%', color: '#FF6B35', delay: 3, duration: 15 },
  { size: 280, x: '80%', y: '70%', color: '#D4A847', delay: 6, duration: 10 },
]

const SHAPES = [
  { size: 80,  x: '15%', y: '25%', shape: 'circle',  color: '#E53030', delay: 0,   dur: 8  },
  { size: 60,  x: '75%', y: '15%', shape: 'square',  color: '#FF6B35', delay: 1.5, dur: 10 },
  { size: 100, x: '85%', y: '55%', shape: 'circle',  color: '#D4A847', delay: 2,   dur: 7  },
  { size: 50,  x: '20%', y: '75%', shape: 'square',  color: '#E53030', delay: 0.8, dur: 11 },
  { size: 70,  x: '50%', y: '80%', shape: 'circle',  color: '#FF6B35', delay: 3,   dur: 9  },
  { size: 45,  x: '90%', y: '30%', shape: 'square',  color: '#D4A847', delay: 1,   dur: 13 },
]

const DOTS = Array.from({ length: 30 }, (_, i) => ({
  x: `${(i * 37 + 11) % 100}%`,
  y: `${(i * 61 + 23) % 100}%`,
  delay: (i * 0.3) % 4,
  dur: 3 + (i % 4),
}))

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Glowing orbs */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color}18 0%, transparent 70%)`,
            filter: 'blur(60px)',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: orb.duration, delay: orb.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Floating geometric shapes */}
      {SHAPES.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: s.size,
            height: s.size,
            left: s.x,
            top: s.y,
            borderRadius: s.shape === 'circle' ? '50%' : '20%',
            border: `1px solid ${s.color}30`,
            background: `${s.color}08`,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, s.shape === 'square' ? 45 : 0, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Particle dots */}
      {DOTS.map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2,
            height: 2,
            left: d.x,
            top: d.y,
            background: i % 3 === 0 ? '#E53030' : i % 3 === 1 ? '#FF6B35' : '#D4A847',
          }}
          animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.5, 0.5] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Corner accent lines */}
      <div className="absolute top-0 left-0 w-32 h-px bg-gradient-to-r from-japan-red/40 to-transparent" />
      <div className="absolute top-0 left-0 w-px h-32 bg-gradient-to-b from-japan-red/40 to-transparent" />
      <div className="absolute bottom-0 right-0 w-32 h-px bg-gradient-to-l from-japan-red/40 to-transparent" />
      <div className="absolute bottom-0 right-0 w-px h-32 bg-gradient-to-t from-japan-red/40 to-transparent" />
    </div>
  )
}
