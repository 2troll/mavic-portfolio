import { motion } from 'framer-motion'

interface ToriiSVGProps {
  className?: string
  size?: number
}

const glowVariants = {
  rest: {
    filter: 'drop-shadow(0 0 0px rgba(229,48,48,0))',
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  glow: {
    filter: [
      'drop-shadow(0 0 4px rgba(229,48,48,0.6)) drop-shadow(0 0 10px rgba(229,48,48,0.4))',
      'drop-shadow(0 0 12px rgba(229,48,48,1)) drop-shadow(0 0 24px rgba(229,48,48,0.7)) drop-shadow(0 0 40px rgba(229,48,48,0.4))',
      'drop-shadow(0 0 6px rgba(229,48,48,0.7)) drop-shadow(0 0 14px rgba(229,48,48,0.5))',
      'drop-shadow(0 0 14px rgba(229,48,48,1)) drop-shadow(0 0 28px rgba(229,48,48,0.8)) drop-shadow(0 0 48px rgba(229,48,48,0.35))',
      'drop-shadow(0 0 4px rgba(229,48,48,0.6)) drop-shadow(0 0 10px rgba(229,48,48,0.4))',
    ],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Fixed viewBox dimensions
const VW = 280
const VH = 320

export function ToriiSVG({ className, size = 280 }: ToriiSVGProps) {
  const scaledH = Math.round((size / VW) * VH)

  return (
    <motion.div
      className={className}
      initial="rest"
      whileHover="glow"
      animate="rest"
      variants={glowVariants}
      style={{ display: 'inline-block', cursor: 'pointer' }}
    >
      <svg
        width={size}
        height={scaledH}
        viewBox={`0 0 ${VW} ${VH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* ── nemaki: base stones under each pillar ── */}
        {/* Left pillar — lower wide stone */}
        <rect x="52" y="279" width="46" height="15" rx="4" fill="#9B1A1A" />
        {/* Left pillar — upper narrow stone */}
        <rect x="58" y="264" width="34" height="17" rx="3" fill="#B52020" />

        {/* Right pillar — lower wide stone */}
        <rect x="182" y="279" width="46" height="15" rx="4" fill="#9B1A1A" />
        {/* Right pillar — upper narrow stone */}
        <rect x="188" y="264" width="34" height="17" rx="3" fill="#B52020" />

        {/* ── hashira: two pillars ── */}
        {/* Left pillar */}
        <rect x="64" y="128" width="22" height="138" rx="4" fill="#E53030" />
        {/* Right pillar */}
        <rect x="194" y="128" width="22" height="138" rx="4" fill="#E53030" />

        {/* ── Decorative daiwa rings on pillars ── */}
        {/* Left pillar rings */}
        <rect x="61" y="162" width="28" height="5" rx="2.5" fill="#B82020" />
        <rect x="61" y="174" width="28" height="5" rx="2.5" fill="#B82020" />
        {/* Right pillar rings */}
        <rect x="191" y="162" width="28" height="5" rx="2.5" fill="#B82020" />
        <rect x="191" y="174" width="28" height="5" rx="2.5" fill="#B82020" />

        {/* ── nuki: main horizontal crossbeam ── */}
        <rect x="50" y="148" width="180" height="19" rx="3" fill="#E53030" />
        {/* Nuki inset detail line */}
        <rect x="55" y="152" width="170" height="6" rx="2" fill="#C02828" opacity="0.45" />

        {/* ── shimagi: cap beam between kasagi and pillars ── */}
        <path
          d="M58 118 L222 118 L218 130 L62 130 Z"
          fill="#C82828"
        />

        {/* ── kasagi: curved top beam with upswept ends (sori) ── */}
        {/*
          The kasagi is the iconic element — gently curved upward at both ends.
          Rendered as a thick closed path with inner and outer curves.
        */}
        <path
          d="
            M22 114
            C 30 107, 56 99, 82 104
            L 198 104
            C 224 99, 250 107, 258 114
            L 256 121
            C 248 116, 223 110, 198 115
            L 82 115
            C 57 110, 32 116, 24 121
            Z
          "
          fill="#E53030"
        />

        {/* kasagi top highlight — gives sense of curved surface */}
        <path
          d="
            M24 114
            C 32 108, 57 101, 82 106
            L 198 106
            C 223 101, 248 108, 256 114
          "
          stroke="#F07070"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />

        {/* kasagi underside shadow */}
        <path
          d="
            M24 121
            C 32 116, 57 112, 82 115
            L 198 115
            C 223 112, 248 116, 256 121
          "
          stroke="#9A1515"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />

        {/* ── Upturned kasagi end caps (sori tips) ── */}
        {/* Left tip sweeps upward */}
        <path
          d="M22 114 C 14 111, 8 106, 12 98 C 16 93, 22 99, 24 108"
          fill="#E53030"
        />
        {/* Left tip highlight */}
        <path
          d="M12 98 C 14 94, 19 93, 22 99"
          stroke="#F07070"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />

        {/* Right tip sweeps upward */}
        <path
          d="M258 114 C 266 111, 272 106, 268 98 C 264 93, 258 99, 256 108"
          fill="#E53030"
        />
        {/* Right tip highlight */}
        <path
          d="M268 98 C 266 94, 261 93, 258 99"
          stroke="#F07070"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />
      </svg>
    </motion.div>
  )
}
