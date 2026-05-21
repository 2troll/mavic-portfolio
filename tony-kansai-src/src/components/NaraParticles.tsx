import { motion } from 'framer-motion'
import { useMemo } from 'react'

const COLORS = ['#FF6B35', '#D4A847', '#E53030', '#FF8C42']

// Seeded pseudo-random so SSR / hydration stays stable across renders
function seededRand(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

interface Particle {
  id: number
  color: string
  size: number
  startX: string   // vw units as a CSS string
  driftX: number   // total horizontal drift in px over the fall
  delay: number    // seconds before first loop begins
  duration: number // seconds per loop
  rotate: number   // starting rotation (degrees)
  rotateEnd: number
  borderRadius: string // irregular blob radius for leaf shape
}

function buildParticles(count: number): Particle[] {
  const rand = seededRand(42)
  return Array.from({ length: count }, (_, i) => {
    const r = () => rand()
    const color = COLORS[Math.floor(r() * COLORS.length)]
    const size = 10 + Math.floor(r() * 14)         // 10–23 px
    const startX = `${4 + r() * 92}vw`             // spread across full width
    const driftX = (r() - 0.5) * 180               // −90 … +90 px horizontal drift
    const delay = r() * 5                           // 0–5 s stagger
    const duration = 6 + r() * 6                   // 6–12 s per cycle

    const rotate = r() * 360
    // Leaves spin between 120 and 320 extra degrees, direction varies
    const rotateEnd = rotate + (r() > 0.5 ? 1 : -1) * (120 + r() * 200)

    // Irregular rounded shape — ~30% 70% 50% 50% family as requested
    const a = Math.floor(22 + r() * 18)   // 22–40
    const b = Math.floor(55 + r() * 20)   // 55–75
    const c = Math.floor(28 + r() * 24)   // 28–52
    const d = Math.floor(32 + r() * 22)   // 32–54
    const borderRadius = `${a}% ${100 - a}% ${b}% ${100 - b}% / ${c}% ${d}% ${100 - d}% ${100 - c}%`

    return { id: i, color, size, startX, driftX, delay, duration, rotate, rotateEnd, borderRadius }
  })
}

// Build once at module level so it never changes between renders
const PARTICLES = buildParticles(18)

export function NaraParticles() {
  // useMemo so the stable reference is preserved even if the parent re-renders
  const particles = useMemo(() => PARTICLES, [])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            top: 0,
            left: p.startX,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.borderRadius,
            // start invisible; opacity is driven by the animate keyframes below
            opacity: 0,
          }}
          animate={{
            // Fall from slightly above the viewport to 110 vh
            y: ['-6vh', '110vh'],
            // Gentle horizontal sway over the full fall
            x: [0, p.driftX * 0.4, p.driftX, p.driftX * 0.7],
            rotate: [p.rotate, p.rotateEnd],
            // Fade in quickly, hold opacity, then fade out near bottom
            opacity: [0, 0.88, 0.88, 0.88, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'linear',
            repeat: Infinity,
            repeatDelay: 0,
            // Keyframe time distribution:
            // [start, fade-in done, mid, near-end, fully-fallen]
            times: [0, 0.07, 0.5, 0.87, 1],
          }}
        />
      ))}
    </div>
  )
}
