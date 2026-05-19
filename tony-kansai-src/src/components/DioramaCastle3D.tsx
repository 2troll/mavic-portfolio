import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

// ── Layer 1: sky, moon, stars ─────────────────────────────────────────────────
function BackgroundLayer() {
  return (
    <svg viewBox="0 0 480 320" fill="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
      {/* Deep gradient sky via rect */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#04030D" />
          <stop offset="100%" stopColor="#0e0b1e" />
        </linearGradient>
        <radialGradient id="moonGlow" cx="75%" cy="22%" r="18%">
          <stop offset="0%" stopColor="#D4A847" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#D4A847" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="480" height="320" fill="url(#sky)" />
      <rect width="480" height="320" fill="url(#moonGlow)" />
      {/* Moon crescent */}
      <circle cx="362" cy="68" r="44" fill="#C49828" opacity="0.22" />
      <circle cx="380" cy="60" r="40" fill="#04030D" opacity="0.96" />
      {/* Stars */}
      {[
        [30,25],[65,42],[108,18],[155,36],[200,14],[248,30],[295,22],[340,38],
        [402,48],[440,20],[460,52],[18,55],[78,10],[130,55],[185,8],[222,48],
        [280,44],[380,14],[420,38],[50,72],[168,66],[310,60],[450,66],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1 + (i % 3) * 0.6} fill="white"
          opacity={0.25 + (i % 4) * 0.12} />
      ))}
      {/* Distant mist band */}
      <ellipse cx="240" cy="240" rx="280" ry="40" fill="#E53030" opacity="0.04" />
    </svg>
  )
}

// ── Layer 2: Osaka Castle silhouette ─────────────────────────────────────────
function CastleLayer() {
  return (
    <svg viewBox="0 0 480 320" fill="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="castleGlow" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#E53030" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#E53030" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Ishigaki (stone base) */}
      <path d="M 96 272 L 80 236 L 400 236 L 384 272 Z" fill="#180d1e" />
      <path d="M 112 236 L 98 208 L 382 208 L 368 236 Z" fill="#1a0f22" />
      {/* Body tier 1 */}
      <rect x="142" y="168" width="196" height="42" rx="2" fill="#110820" />
      {/* Eave 1 — upswept ends */}
      <path d="M 118 168 Q 148 156 240 154 Q 332 156 362 168 L 362 178 Q 332 167 240 165 Q 148 167 118 178 Z"
        fill="#E53030" opacity="0.82" />
      {/* Red horizontal accent stripe tier 1 */}
      <rect x="141" y="188" width="198" height="5" rx="2" fill="#E53030" opacity="0.25" />
      {/* Body tier 2 */}
      <rect x="162" y="128" width="156" height="42" rx="2" fill="#0e0619" />
      {/* Eave 2 */}
      <path d="M 142 128 Q 168 116 240 114 Q 312 116 338 128 L 338 138 Q 312 127 240 125 Q 168 127 142 138 Z"
        fill="#E53030" opacity="0.76" />
      {/* Body tier 3 */}
      <rect x="184" y="94" width="112" height="36" rx="2" fill="#0b041a" />
      {/* Eave 3 */}
      <path d="M 168 94 Q 192 82 240 80 Q 288 82 312 94 L 312 104 Q 288 94 240 92 Q 192 94 168 104 Z"
        fill="#E53030" opacity="0.70" />
      {/* Top roof pyramid */}
      <path d="M 194 80 L 240 44 L 286 80 Z" fill="#E53030" opacity="0.65" />
      {/* Gold finial */}
      <circle cx="240" cy="42" r="5.5" fill="#D4A847" opacity="0.92" />
      <circle cx="240" cy="42" r="9" fill="#D4A847" opacity="0.18" />
      {/* Corner tower caps */}
      <path d="M 142 208 L 142 188 L 154 188 L 154 208 Z" fill="#0e0619" />
      <path d="M 338 208 L 338 188 L 326 188 L 326 208 Z" fill="#0e0619" />
      {/* Castle ground glow */}
      <ellipse cx="240" cy="272" rx="90" ry="7" fill="url(#castleGlow)" />
      {/* Window slits */}
      {[160,186,212,260,286,312].map((x, i) => (
        <rect key={i} x={x} y={178} width={16} height={5} rx="2" fill="#D4A847" opacity="0.18" />
      ))}
    </svg>
  )
}

// ── Layer 3: sakura trees (foreground) ────────────────────────────────────────
function SakuraLayer() {
  return (
    <svg viewBox="0 0 480 320" fill="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
      {/* Left trunk */}
      <path d="M 56 320 L 58 248 L 54 200 L 58 155 Q 61 144 65 155 L 69 200 L 67 248 L 64 320 Z"
        fill="#160808" opacity="0.85" />
      {/* Left branches */}
      <path d="M 58 200 Q 36 182 14 187" stroke="#160808" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M 60 174 Q 40 154 30 145" stroke="#160808" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 64 160 Q 78 142 88 140" stroke="#160808" strokeWidth="3" strokeLinecap="round" />
      <path d="M 58 186 Q 44 170 35 165" stroke="#160808" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left blossom clusters */}
      {[
        [14,182,16,11],[30,186,13,10],[10,170,14,10],[28,155,15,10],
        [40,148,13,9],[44,162,11,8],[82,137,15,10],[92,145,12,9],[78,155,10,7],
        [22,158,11,8],[35,143,12,9],
      ].map(([cx, cy, rx, ry], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#FFB7C5" opacity={0.28 + (i % 3) * 0.05} />
      ))}

      {/* Right trunk */}
      <path d="M 416 320 L 418 248 L 414 200 L 418 155 Q 421 144 425 155 L 429 200 L 427 248 L 424 320 Z"
        fill="#160808" opacity="0.85" />
      {/* Right branches */}
      <path d="M 418 200 Q 440 182 462 187" stroke="#160808" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M 420 174 Q 440 154 450 145" stroke="#160808" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 424 160 Q 410 142 398 140" stroke="#160808" strokeWidth="3" strokeLinecap="round" />
      <path d="M 418 186 Q 432 170 441 165" stroke="#160808" strokeWidth="2.5" strokeLinecap="round" />
      {/* Right blossom clusters */}
      {[
        [462,183,16,11],[452,190,13,10],[468,170,14,10],[450,157,15,10],
        [438,150,13,9],[436,164,11,8],[394,138,15,10],[400,148,12,9],[408,157,10,7],
        [458,161,11,8],[445,144,12,9],
      ].map(([cx, cy, rx, ry], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#FFB7C5" opacity={0.28 + (i % 3) * 0.05} />
      ))}

      {/* Fallen petals on ground */}
      {[
        [110,294,30],[140,308,20],[165,298,50],[200,302,10],[280,296,40],
        [310,305,70],[350,300,20],[385,294,55],
      ].map(([cx, cy, rot], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={4} ry={2}
          fill="#FFB7C5" opacity={0.22} transform={`rotate(${rot} ${cx} ${cy})`} />
      ))}

      {/* Atmospheric ground gradient */}
      <rect x="0" y="268" width="480" height="52" fill="#0e0b1e" opacity="0.7" />
    </svg>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export function DioramaCastle3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Rotation of the whole card
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-14, 14])
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10])

  const springRotY = useSpring(rotateY, { stiffness: 300, damping: 30 })
  const springRotX = useSpring(rotateX, { stiffness: 300, damping: 30 })

  // Each layer moves at a different amount → depth parallax
  const l1X = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 })
  const l1Y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-6, 6]),  { stiffness: 300, damping: 30 })
  const l2X = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), { stiffness: 300, damping: 30 })
  const l2Y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-12, 12]), { stiffness: 300, damping: 30 })
  const l3X = useSpring(useTransform(mouseX, [-0.5, 0.5], [-32, 32]), { stiffness: 300, damping: 30 })
  const l3Y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), { stiffness: 300, damping: 30 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  return (
    <div
      ref={containerRef}
      className="relative w-full cursor-pointer select-none"
      style={{ perspective: '900px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* The 3D rotating card — no overflow:hidden to preserve transformStyle */}
      <motion.div
        style={{
          rotateX: springRotX,
          rotateY: springRotY,
          transformStyle: 'preserve-3d',
          borderRadius: 20,
        }}
        className="relative w-full"
      >
        {/* Fixed-height container so layers size correctly */}
        <div className="w-full rounded-[20px]" style={{ aspectRatio: '3/2', background: '#04030D' }} />

        {/* Layer 1 — background (sky, moon, stars) z=20px */}
        <motion.div
          className="absolute inset-0 rounded-[20px] overflow-hidden"
          style={{ x: l1X, y: l1Y, z: 20 }}
        >
          <BackgroundLayer />
        </motion.div>

        {/* Layer 2 — castle silhouette z=40px */}
        <motion.div
          className="absolute inset-0"
          style={{ x: l2X, y: l2Y, z: 40 }}
        >
          <CastleLayer />
        </motion.div>

        {/* Layer 3 — sakura foreground z=60px */}
        <motion.div
          className="absolute inset-0"
          style={{ x: l3X, y: l3Y, z: 60 }}
        >
          <SakuraLayer />
        </motion.div>

        {/* Frame / vignette overlay — z=80px so it's always on top */}
        <motion.div
          className="absolute inset-0 rounded-[20px] pointer-events-none"
          style={{
            z: 80,
            boxShadow: 'inset 0 0 70px rgba(0,0,0,0.75), inset 0 0 3px rgba(229,48,48,0.2)',
          }}
        />
      </motion.div>
    </div>
  )
}
