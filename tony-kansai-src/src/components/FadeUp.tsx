import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

interface FadeUpProps {
  children: ReactNode
  className?: string
  delay?: number
  once?: boolean
}

export function FadeUp({ children, className, delay = 0, once = true }: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 80, damping: 16, delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
