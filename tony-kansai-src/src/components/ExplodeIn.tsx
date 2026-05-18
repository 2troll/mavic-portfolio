import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { ReactNode } from 'react'

// Deterministic blast directions per index so items fly in from varied angles
const BLASTS = [
  { x: -130, y: -90, rotate: -14 },
  { x: 130, y: -90, rotate: 11 },
  { x: -150, y: 20, rotate: 17 },
  { x: 150, y: 20, rotate: -13 },
  { x: -110, y: 110, rotate: 9 },
  { x: 110, y: 110, rotate: -17 },
  { x: 0, y: -140, rotate: -7 },
  { x: 0, y: 140, rotate: 7 },
  { x: -90, y: -130, rotate: 20 },
  { x: 90, y: -130, rotate: -19 },
]

interface ExplodeInProps {
  children: ReactNode
  index?: number
  className?: string
  delay?: number
}

export function ExplodeIn({ children, index = 0, className, delay }: ExplodeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px -8% 0px' })

  const d = BLASTS[index % BLASTS.length]
  const baseDelay = delay ?? index * 0.075

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0, x: d.x, y: d.y, rotate: d.rotate, filter: 'blur(10px)' }}
      animate={
        inView
          ? { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0, filter: 'blur(0px)' }
          : {}
      }
      transition={{
        type: 'spring',
        stiffness: 155,
        damping: 15,
        delay: baseDelay,
        opacity: { duration: 0.35, delay: baseDelay },
        filter: { duration: 0.5, delay: baseDelay },
      }}
    >
      {children}
    </motion.div>
  )
}
