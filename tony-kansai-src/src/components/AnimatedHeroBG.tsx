import { motion } from 'framer-motion'

// Pure CSS animated background — zero WebGL, zero crash risk.
// GPU-only properties: transform (scale) + opacity. No reflow possible.
export function AnimatedHeroBG() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Large red atmosphere orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 700, height: 700,
          left: '62%', top: '18%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(229,48,48,0.13) 0%, transparent 68%)',
          filter: 'blur(90px)',
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Orange mid orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 440, height: 440,
          left: '12%', top: '58%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(255,107,53,0.10) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
        animate={{ scale: [1, 1.28, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 13, delay: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Gold accent orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 300, height: 300,
          left: '82%', top: '72%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(212,168,71,0.09) 0%, transparent 70%)',
          filter: 'blur(55px)',
        }}
        animate={{ scale: [1, 1.22, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 11, delay: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Subtle top center glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500, height: 200,
          left: '50%', top: '0%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(229,48,48,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Static particle dots — CSS only, no JS animation */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.25 }}>
        {[
          [8,12],[15,35],[22,8],[38,55],[45,20],[52,78],[60,42],[68,15],
          [75,62],[82,30],[88,70],[93,18],[5,80],[30,90],[70,88],[95,50],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={`${cx}%`} cy={`${cy}%`} r="1.5"
            fill={i % 3 === 0 ? '#E53030' : i % 3 === 1 ? '#FF6B35' : '#D4A847'} />
        ))}
      </svg>
    </div>
  )
}
