import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useRef, useCallback } from 'react'

interface OsakaCastleSVGProps {
  className?: string
}

const SPRING = { stiffness: 220, damping: 26 }

// Canonical viewBox dimensions
const VW = 480
const VH = 540

export function OsakaCastleSVG({ className }: OsakaCastleSVGProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Raw mouse offset values — normalised to −1 … +1 relative to container centre
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  // Spring-smoothed versions of the raw offset
  const springX = useSpring(rawX, SPRING)
  const springY = useSpring(rawY, SPRING)

  // Per-layer transforms — multiplier controls depth of parallax effect.
  // Max travel is ±60 px horizontal, ±40 px vertical at full cursor excursion.
  const l1x = useTransform(springX, (v) => v * 0.15 * 60)
  const l1y = useTransform(springY, (v) => v * 0.15 * 40)

  const l2x = useTransform(springX, (v) => v * 0.28 * 60)
  const l2y = useTransform(springY, (v) => v * 0.28 * 40)

  const l3x = useTransform(springX, (v) => v * 0.42 * 60)
  const l3y = useTransform(springY, (v) => v * 0.42 * 40)

  const l4x = useTransform(springX, (v) => v * 0.60 * 60)
  const l4y = useTransform(springY, (v) => v * 0.60 * 40)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      // Normalise: centre = 0, edges = ±1
      rawX.set((e.clientX - cx) / (rect.width / 2))
      rawY.set((e.clientY - cy) / (rect.height / 2))
    },
    [rawX, rawY]
  )

  const handleMouseLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'inline-block', position: 'relative', cursor: 'crosshair' }}
    >
      <svg
        width={VW}
        height={VH}
        viewBox={`0 0 ${VW} ${VH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="osk-skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0C0D16" />
            <stop offset="100%" stopColor="#12141F" />
          </linearGradient>
          {/* Soft radial mist centred in the lower half */}
          <radialGradient id="osk-mistGrad" cx="50%" cy="70%" r="55%">
            <stop offset="0%" stopColor="#1a1d30" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0C0D16" stopOpacity="0" />
          </radialGradient>
          {/* Gold glow filter for the finial */}
          <filter id="osk-finialGlow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blurred" />
            <feMerge>
              <feMergeNode in="blurred" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── LAYER 1: Background mist / sky (parallax ×0.15) ── */}
        <motion.g style={{ x: l1x, y: l1y }}>
          {/* Base sky fill */}
          <rect x="-60" y="-40" width={VW + 120} height={VH + 80} fill="url(#osk-skyGrad)" />

          {/* Star field — fixed positions, opacity varies for twinkling feel */}
          {(
            [
              [58, 38, 0.55], [118, 68, 0.35], [198, 22, 0.60], [302, 52, 0.40],
              [382, 28, 0.50], [442, 78, 0.30], [28, 98, 0.45], [158, 108, 0.55],
              [338, 88, 0.35], [412, 48, 0.60], [78, 148, 0.30], [248, 128, 0.50],
              [462, 118, 0.40], [330, 160, 0.25], [62, 175, 0.45], [210, 55, 0.50],
            ] as [number, number, number][]
          ).map(([sx, sy, op], i) => (
            <circle key={i} cx={sx} cy={sy} r={1.3} fill="#D4A847" opacity={op} />
          ))}

          {/* Mist bands low in the composition */}
          <ellipse cx="240" cy="430" rx="290" ry="42" fill="#1c1f34" opacity="0.55" />
          <ellipse cx="240" cy="468" rx="330" ry="38" fill="#1c1f34" opacity="0.38" />
          <ellipse cx="170" cy="408" rx="210" ry="30" fill="#222540" opacity="0.30" />
          <ellipse cx="340" cy="396" rx="170" ry="24" fill="#222540" opacity="0.22" />

          {/* Full radial mist overlay */}
          <rect x="-60" y="-40" width={VW + 120} height={VH + 80} fill="url(#osk-mistGrad)" />
        </motion.g>

        {/* ── LAYER 2: Stone base walls / ishigaki (parallax ×0.28) ── */}
        <motion.g style={{ x: l2x, y: l2y }}>
          {/* Main polygonal stone foundation — tapers inward toward top */}
          <path
            d="M58 540 L58 378 L108 338 L372 338 L422 378 L422 540 Z"
            fill="#12141F"
            stroke="#1e2235"
            strokeWidth="1.5"
          />

          {/* Horizontal stone mortar courses */}
          {[365, 386, 406, 426].map((y, i) => (
            <line key={i} x1="63" y1={y} x2="417" y2={y} stroke="#1e2235" strokeWidth="1" opacity="0.75" />
          ))}

          {/* Vertical stone joints — staggered per course for realism */}
          {[118, 158, 198, 238, 278, 318, 358, 398].map((x, i) => (
            <line
              key={i}
              x1={x}
              y1={338}
              x2={x + (i % 2 === 0 ? -4 : 4)}
              y2={540}
              stroke="#1e2235"
              strokeWidth="0.8"
              opacity="0.45"
            />
          ))}

          {/* Crenellations (merlons) along the top of the ishigaki */}
          {Array.from({ length: 15 }, (_, i) => {
            const bx = 108 + i * 19
            return (
              <rect
                key={i}
                x={bx}
                y={323}
                width={11}
                height={17}
                rx="1.5"
                fill="#12141F"
                stroke="#1e2235"
                strokeWidth="0.8"
              />
            )
          })}

          {/* Subtle red ridge line along top of base */}
          <path
            d="M130 338 L240 308 L350 338"
            stroke="#E53030"
            strokeWidth="1.5"
            fill="none"
            opacity="0.28"
          />

          {/* Moat water at the very bottom */}
          <rect x="28" y="518" width="424" height="22" rx="4" fill="#0C0D16" opacity="0.75" />
          <line x1="28" y1="524" x2="452" y2="524" stroke="#12141F" strokeWidth="1" opacity="0.5" />
          <line x1="28" y1="530" x2="452" y2="530" stroke="#12141F" strokeWidth="0.6" opacity="0.3" />
        </motion.g>

        {/* ── LAYER 3: Middle keep floors with bracketed eaves (parallax ×0.42) ── */}
        <motion.g style={{ x: l3x, y: l3y }}>

          {/* ── Floor 1 (widest) ── */}
          <rect x="118" y="288" width="244" height="52" fill="#12141F" stroke="#1e2235" strokeWidth="1" />
          {/* Eave curve — slight upswept ends */}
          <path
            d="M96 288 C 118 281,180 276, 240 278 C 300 276, 362 281, 384 288
               L 374 295 C 353 289, 296 285, 240 287 C 184 285, 127 289, 106 295 Z"
            fill="#1a1d2e"
          />
          {/* Eave tip ornaments — red curled ends */}
          <path d="M96 288 C 89 284, 82 279, 85 272" stroke="#E53030" strokeWidth="1.5" fill="none" opacity="0.65" />
          <path d="M384 288 C 391 284, 398 279, 395 272" stroke="#E53030" strokeWidth="1.5" fill="none" opacity="0.65" />
          {/* Window openings */}
          {[146, 206, 266, 326].map((wx) => (
            <rect key={wx} x={wx} y={298} width={22} height={30} rx="2" fill="#0C0D16" stroke="#1e2235" strokeWidth="0.8" />
          ))}
          {/* Corner red banding */}
          <rect x="118" y="288" width="5" height="52" fill="#E53030" opacity="0.45" />
          <rect x="357" y="288" width="5" height="52" fill="#E53030" opacity="0.45" />

          {/* ── Floor 2 ── */}
          <rect x="146" y="236" width="188" height="54" fill="#12141F" stroke="#1e2235" strokeWidth="1" />
          <path
            d="M124 236 C 146 229, 196 224, 240 226 C 284 224, 334 229, 356 236
               L 347 242 C 327 237, 282 233, 240 235 C 198 233, 153 237, 133 242 Z"
            fill="#1a1d2e"
          />
          <path d="M124 236 C 117 232, 110 227, 113 221" stroke="#E53030" strokeWidth="1.5" fill="none" opacity="0.65" />
          <path d="M356 236 C 363 232, 370 227, 367 221" stroke="#E53030" strokeWidth="1.5" fill="none" opacity="0.65" />
          {[164, 214, 264, 314].map((wx) => (
            <rect key={wx} x={wx} y={246} width={18} height={26} rx="2" fill="#0C0D16" stroke="#1e2235" strokeWidth="0.8" />
          ))}
          <rect x="146" y="236" width="4" height="54" fill="#E53030" opacity="0.40" />
          <rect x="330" y="236" width="4" height="54" fill="#E53030" opacity="0.40" />

          {/* ── Floor 3 ── */}
          <rect x="170" y="190" width="140" height="48" fill="#12141F" stroke="#1e2235" strokeWidth="1" />
          <path
            d="M152 190 C 170 183, 205 179, 240 181 C 275 179, 310 183, 328 190
               L 320 196 C 304 191, 273 187, 240 189 C 207 187, 176 191, 160 196 Z"
            fill="#1a1d2e"
          />
          <path d="M152 190 C 145 186, 138 181, 141 176" stroke="#E53030" strokeWidth="1.5" fill="none" opacity="0.65" />
          <path d="M328 190 C 335 186, 342 181, 339 176" stroke="#E53030" strokeWidth="1.5" fill="none" opacity="0.65" />
          {[188, 228, 268].map((wx) => (
            <rect key={wx} x={wx} y={199} width={16} height={22} rx="2" fill="#0C0D16" stroke="#1e2235" strokeWidth="0.8" />
          ))}
          <rect x="170" y="190" width="4" height="48" fill="#E53030" opacity="0.38" />
          <rect x="306" y="190" width="4" height="48" fill="#E53030" opacity="0.38" />

          {/* Bracket clusters (tokyō) hinting at structural corbels */}
          {[134, 164, 194, 284, 314, 344].map((bx) => (
            <g key={bx}>
              <rect x={bx} y={283} width={8} height={7} rx="1" fill="#1e2235" />
              <rect x={bx - 3} y={289} width={14} height={4} rx="1" fill="#252840" />
            </g>
          ))}
        </motion.g>

        {/* ── LAYER 4: Upper spire + gold finial (parallax ×0.60) ── */}
        <motion.g style={{ x: l4x, y: l4y }}>
          {/* Roof peak / shibi curved gable */}
          <path
            d="M174 190 C 198 168, 220 150, 240 138 C 260 150, 282 168, 306 190"
            fill="#12141F"
            stroke="#1e2235"
            strokeWidth="1.5"
          />
          {/* Ridge crest decoration */}
          <path
            d="M194 190 C 196 178, 210 164, 240 155 C 270 164, 284 178, 286 190"
            fill="#0C0D16"
            stroke="#1e2235"
            strokeWidth="1"
          />

          {/* Sokotai — spire shaft */}
          <rect x="235" y="90" width="10" height="50" rx="3" fill="#1a1d2e" stroke="#1e2235" strokeWidth="0.8" />

          {/* Spire decorative rings ascending the shaft */}
          {[108, 120, 130].map((ry) => (
            <ellipse key={ry} cx="240" cy={ry} rx="9" ry="4.5" fill="#D4A847" opacity="0.80" />
          ))}

          {/* ── Gold kinshachi finial — animated glow pulse ── */}

          {/* Outermost diffuse halo (largest, most transparent) */}
          <motion.circle
            cx="240"
            cy="80"
            r="22"
            fill="#D4A847"
            opacity={0.12}
            animate={{
              r: [22, 32, 22],
              opacity: [0.12, 0.30, 0.12],
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Mid glow ring */}
          <motion.circle
            cx="240"
            cy="80"
            r="14"
            fill="#D4A847"
            opacity={0.28}
            animate={{
              r: [14, 20, 14],
              opacity: [0.28, 0.50, 0.28],
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.18,
            }}
          />

          {/* Solid finial disc */}
          <circle cx="240" cy="80" r="9" fill="#D4A847" filter="url(#osk-finialGlow)" />
          {/* Inner bright spot */}
          <circle cx="240" cy="80" r="5.5" fill="#f5c842" />
          {/* Specular highlight */}
          <circle cx="237" cy="77" r="2" fill="#fff8d6" opacity="0.65" />

          {/* Spire tip needle */}
          <line x1="240" y1="71" x2="240" y2="54" stroke="#D4A847" strokeWidth="2" strokeLinecap="round" />
          {/* Arrow-head tip */}
          <polygon points="240,44 244.5,58 235.5,58" fill="#D4A847" />
        </motion.g>
      </svg>
    </div>
  )
}
