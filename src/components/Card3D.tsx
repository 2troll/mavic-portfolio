import { useRef, type ReactNode } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useMotionTemplate,
} from 'framer-motion'
import { cn } from '../lib/utils'

interface Card3DProps {
  children: ReactNode
  className?: string
}

export function Card3D({ children, className }: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Raw mouse position normalised to [-0.5, 0.5]
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Convert mouse position to rotation angles (degrees)
  const rotateX = useTransform(y, [-0.5, 0.5], [14, -14])
  const rotateY = useTransform(x, [-0.5, 0.5], [-14, 14])

  // Apply spring physics for organic feel
  const springCfg = { stiffness: 160, damping: 22 }
  const springRotX = useSpring(rotateX, springCfg)
  const springRotY = useSpring(rotateY, springCfg)

  // Dynamic shadow follows the tilt direction
  const shadowX = useTransform(springRotY, [-14, 14], [-24, 24])
  const shadowY = useTransform(springRotX, [-14, 14], [24, -24])
  const boxShadow = useMotionTemplate`${shadowX}px ${shadowY}px 48px 0px rgba(99,102,241,0.28), 0 0 0 1px rgba(255,255,255,0.05)`

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ perspective: '1000px' }}
      className="h-full"
    >
      <motion.div
        style={{
          rotateX: springRotX,
          rotateY: springRotY,
          transformStyle: 'preserve-3d',
          boxShadow,
        }}
        className={cn(
          'relative h-full rounded-2xl bg-gradient-to-br from-[#1c1c30] to-[#0f1422]',
          'border border-white/[0.06] p-6',
          'transition-[border-color] duration-300 hover:border-indigo-500/25',
          className
        )}
      >
        {children}
      </motion.div>
    </div>
  )
}
