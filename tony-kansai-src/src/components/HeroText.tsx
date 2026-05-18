import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

interface HeroTextProps {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
}

export function HeroText({ text, className, wordClassName, delay = 0 }: HeroTextProps) {
  const words = text.split(' ')

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.07, delayChildren: delay },
    },
  }

  const word = {
    hidden: { rotateX: -90, y: 60, opacity: 0, filter: 'blur(8px)' },
    visible: {
      rotateX: 0,
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { type: 'spring' as const, stiffness: 90, damping: 14 },
    },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={cn('flex flex-wrap gap-x-3 gap-y-1', className)}
      style={{ perspective: '800px' }}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          variants={word}
          className={cn('inline-block origin-bottom', wordClassName)}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {w}
        </motion.span>
      ))}
    </motion.div>
  )
}
