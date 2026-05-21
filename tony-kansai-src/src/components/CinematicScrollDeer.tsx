import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

function DeerSVG() {
  return (
    <svg
      viewBox="0 0 210 148"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Body */}
      <ellipse cx="103" cy="92" rx="52" ry="26" fill="currentColor" />
      {/* Neck */}
      <path d="M 70 82 Q 62 62 60 48 Q 59 38 65 36 Q 72 34 75 45 Q 79 58 76 80 Z" fill="currentColor" />
      {/* Head */}
      <ellipse cx="55" cy="37" rx="18" ry="13" fill="currentColor" />
      {/* Snout */}
      <path d="M 40 40 Q 34 37 30 42 Q 34 47 41 44 Z" fill="currentColor" />
      {/* Nostril */}
      <ellipse cx="31" cy="42" rx="1.5" ry="1" fill="rgba(0,0,0,0.3)" />
      {/* Eye */}
      <circle cx="49" cy="32" r="2.8" fill="rgba(0,0,0,0.35)" />
      <circle cx="49" cy="32" r="1.2" fill="rgba(255,255,255,0.4)" />
      {/* Ear right */}
      <path d="M 61 26 Q 66 14 73 15 Q 75 22 68 27 Z" fill="currentColor" />
      {/* Ear left (inner) */}
      <path d="M 55 24 Q 57 13 63 14 Q 64 20 58 26 Z" fill="currentColor" opacity="0.6" />
      {/* Antlers */}
      <g stroke="currentColor" strokeLinecap="round" fill="none">
        <path d="M 66 22 C 70 14 74 7 78 2" strokeWidth="2.8" />
        <path d="M 78 2 C 82 -1 89 0 90 5" strokeWidth="2.2" />
        <path d="M 78 2 C 75 -2 77 -6 81 -5" strokeWidth="1.8" />
        <path d="M 73 13 C 78 9 84 8 85 13" strokeWidth="1.8" />
      </g>
      {/* White tail */}
      <ellipse cx="153" cy="78" rx="7" ry="9" fill="white" opacity="0.55" />
      {/* Front leg A — stride forward */}
      <path d="M 76 114 Q 70 127 68 140 Q 67 145 71 145 Q 74 145 74 140 Q 76 128 80 116 Z" fill="currentColor" />
      {/* Front leg B — push back */}
      <path d="M 88 114 Q 91 128 93 139 Q 94 144 97 143 Q 100 142 99 137 Q 97 124 94 112 Z" fill="currentColor" opacity="0.78" />
      {/* Hind leg A — stride forward */}
      <path d="M 120 112 Q 114 125 112 137 Q 111 142 115 142 Q 118 142 118 137 Q 120 125 124 113 Z" fill="currentColor" />
      {/* Hind leg B — kick back */}
      <path d="M 132 110 Q 138 120 142 130 Q 145 137 148 139 Q 151 140 153 137 Q 154 133 151 128 Q 147 119 140 107 Z" fill="currentColor" opacity="0.78" />
    </svg>
  )
}

interface CinematicScrollDeerProps {
  /** Ref to the section whose scroll progress drives the deer */
  sectionRef: React.RefObject<HTMLElement | null>
}

export function CinematicScrollDeer({ sectionRef }: CinematicScrollDeerProps) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Raw horizontal position: enters from left, exits right
  const rawX = useTransform(scrollYProgress, [0, 1], ['-18vw', '108vw'])

  // Spring gives organic deceleration when the user stops scrolling abruptly
  const x = useSpring(rawX, { stiffness: 100, damping: 20, restDelta: 0.5 })

  // Subtle vertical sway that implies a living creature moving through space
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [4, -6, 2])
  const springY = useSpring(y, { stiffness: 120, damping: 18 })

  return (
    <div
      className="absolute inset-x-0 bottom-8 overflow-hidden pointer-events-none"
      style={{ height: 148 }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute bottom-0 text-white/[0.11]"
        style={{ x, y: springY }}
        // Subtle gallop bounce synced loosely to motion
        animate={{ y: [0, -5, 0, -2, 0] }}
        transition={{
          duration: 0.55,
          repeat: Infinity,
          ease: [0.36, 0, 0.64, 1],
          repeatDelay: 0,
        }}
      >
        <DeerSVG />
      </motion.div>
    </div>
  )
}
