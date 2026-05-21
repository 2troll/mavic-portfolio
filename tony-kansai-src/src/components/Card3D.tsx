import { useRef, ReactNode } from 'react'
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'framer-motion'
import { cn } from '../lib/utils'

interface Card3DProps {
  children: ReactNode
  className?: string
  glowColor?: string
}

export function Card3D({ children, className, glowColor = 'rgba(229,48,48,0.15)' }: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [12, -12]), { stiffness: 180, damping: 24 })
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-12, 12]), { stiffness: 180, damping: 24 })
  const scale = useSpring(1, { stiffness: 300, damping: 28 })

  const glowX = useTransform(rawX, [-0.5, 0.5], [0, 100])
  const glowY = useTransform(rawY, [-0.5, 0.5], [0, 100])
  const boxShadow = useMotionTemplate`
    0 0 0 1px rgba(255,255,255,0.06),
    ${glowX}px ${glowY}px 60px ${glowColor},
    0 30px 80px rgba(0,0,0,0.5)
  `

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
    scale.set(1.02)
  }

  function onMouseLeave() {
    rawX.set(0)
    rawY.set(0)
    scale.set(1)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        boxShadow,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className={cn('relative rounded-2xl cursor-pointer', className)}
    >
      {children}
    </motion.div>
  )
}
