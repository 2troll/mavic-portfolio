import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { ReactNode } from 'react'

// 10 evenly-spread blast directions covering the full compass rose.
// Each entry describes where the element starts before animating to origin.
// Directions (clockwise from top-left):
//   0 top-left  1 top       2 top-right  3 right     4 bottom-right
//   5 bottom    6 bottom-left  7 left   8 diagonal NE-ish  9 diagonal SW-ish
const BLASTS = [
  { x: -130, y: -100, rotate: -16 }, // 0 — top-left
  { x: 0,    y: -150, rotate:  -6 }, // 1 — top
  { x: 130,  y: -100, rotate:  14 }, // 2 — top-right
  { x: 155,  y:    0, rotate: -12 }, // 3 — right
  { x: 120,  y:  120, rotate:  18 }, // 4 — bottom-right
  { x: 0,    y:  155, rotate:   7 }, // 5 — bottom
  { x: -120, y:  120, rotate: -18 }, // 6 — bottom-left
  { x: -155, y:    0, rotate:  12 }, // 7 — left
  { x: 100,  y: -110, rotate: -20 }, // 8 — upper-right diagonal
  { x: -100, y:  110, rotate:  20 }, // 9 — lower-left diagonal
]

interface ExplodeInProps {
  children: ReactNode
  index?: number
  className?: string
  delay?: number
}

export function ExplodeIn({ children, index = 0, className, delay }: ExplodeInProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Trigger once the element is 10% inside the viewport on both top and bottom edges
  const inView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' })

  const d = BLASTS[index % BLASTS.length]
  const baseDelay = delay ?? index * 0.075

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        scale: 0,
        x: d.x,
        y: d.y,
        rotate: d.rotate,
        filter: 'blur(12px)',
      }}
      animate={
        inView
          ? {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              rotate: 0,
              filter: 'blur(0px)',
            }
          : {}
      }
      transition={{
        // Main spring drives position, scale, and rotation together
        type: 'spring',
        stiffness: 200,
        damping: 20,
        delay: baseDelay,
        // Opacity and blur use short tween so they don't oscillate with the spring
        opacity: { duration: 0.38, delay: baseDelay },
        filter: { duration: 0.55, delay: baseDelay },
      }}
    >
      {children}
    </motion.div>
  )
}
