import { useAnimation } from 'framer-motion'
import { motion } from 'framer-motion'

export function InteractiveToriiGlow({ className }: { className?: string }) {
  const controls = useAnimation()

  const startGlow = () =>
    controls.start({
      filter: [
        'drop-shadow(0 0 6px #E53030) drop-shadow(0 0 18px rgba(229,48,48,0.5))',
        'drop-shadow(0 0 18px #E53030) drop-shadow(0 0 48px rgba(229,48,48,0.75)) drop-shadow(0 0 80px rgba(255,107,53,0.35))',
        'drop-shadow(0 0 10px #E53030) drop-shadow(0 0 28px rgba(229,48,48,0.6))',
        'drop-shadow(0 0 22px #E53030) drop-shadow(0 0 56px rgba(229,48,48,0.8)) drop-shadow(0 0 90px rgba(255,107,53,0.4))',
        'drop-shadow(0 0 6px #E53030) drop-shadow(0 0 18px rgba(229,48,48,0.5))',
      ],
      transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
    })

  const stopGlow = () =>
    controls.start({
      filter: 'drop-shadow(0 0 0px #E53030)',
      transition: { type: 'spring', stiffness: 300, damping: 15 },
    })

  return (
    <motion.div
      className={className}
      initial={{ filter: 'drop-shadow(0 0 0px #E53030)' }}
      animate={controls}
      onHoverStart={startGlow}
      onHoverEnd={stopGlow}
      onFocus={startGlow}
      onBlur={stopGlow}
      style={{ cursor: 'default', willChange: 'filter' }}
    >
      <ToriiSVG />
    </motion.div>
  )
}

function ToriiSVG() {
  return (
    <svg
      viewBox="0 0 240 290"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Torii gate — Fushimi Inari"
    >
      {/* Left hashira (pillar) */}
      <rect x="51" y="72" width="19" height="200" rx="5" fill="#E53030" />
      {/* Right hashira (pillar) */}
      <rect x="170" y="72" width="19" height="200" rx="5" fill="#E53030" />

      {/* Daiwa — gold collar rings */}
      <rect x="48" y="138" width="25" height="9" rx="4.5" fill="#D4A847" />
      <rect x="167" y="138" width="25" height="9" rx="4.5" fill="#D4A847" />
      <rect x="48" y="112" width="25" height="7" rx="3.5" fill="#D4A847" opacity="0.65" />
      <rect x="167" y="112" width="25" height="7" rx="3.5" fill="#D4A847" opacity="0.65" />

      {/* Nuki (lower crossbeam) */}
      <rect x="49" y="158" width="142" height="15" rx="4" fill="#E53030" />

      {/* Shimagi (secondary cap under kasagi) */}
      <rect x="44" y="70" width="152" height="14" rx="3" fill="#E53030" />

      {/* Kasagi (top curved beam) */}
      <path
        d="M 5 62 C 18 44 36 50 58 52 L 182 52 C 204 50 222 44 235 62
           L 235 80 C 222 64 204 69 182 68 L 58 68 C 36 69 18 64 5 80 Z"
        fill="#E53030"
      />

      {/* Kasagi upswept wing tips */}
      <path d="M 0 68 C 2 56 8 54 18 58 L 10 76 C 4 72 0 76 0 72 Z" fill="#E53030" />
      <path d="M 240 68 C 238 56 232 54 222 58 L 230 76 C 236 72 240 76 240 72 Z" fill="#E53030" />

      {/* Nemaki (base stones) */}
      <rect x="38" y="268" width="46" height="22" rx="5" fill="#2a0d0d" />
      <rect x="156" y="268" width="46" height="22" rx="5" fill="#2a0d0d" />
      <rect x="42" y="278" width="38" height="12" rx="3" fill="#3d1515" />
      <rect x="160" y="278" width="38" height="12" rx="3" fill="#3d1515" />

      {/* Inner glow line between pillars */}
      <rect x="68" y="80" width="104" height="1" rx="1" fill="#FF6B35" opacity="0.15" />
    </svg>
  )
}
