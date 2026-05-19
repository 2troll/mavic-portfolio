import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

interface HeroTextKineticProps {
  text: string
  className?: string
  wordClassName?: string
  /** Delay before cascade begins, seconds */
  delay?: number
  /** 'words' staggers each word; 'chars' staggers every character */
  mode?: 'words' | 'chars'
  /** Highlight specific words by index (0-based). They receive text-gradient-japan. */
  accentWords?: number[]
}

export function HeroTextKinetic({
  text,
  className,
  wordClassName,
  delay = 0,
  mode = 'words',
  accentWords = [],
}: HeroTextKineticProps) {
  const tokens = mode === 'chars' ? Array.from(text) : text.split(' ')

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: mode === 'chars' ? 0.022 : 0.08,
        delayChildren: delay,
      },
    },
  }

  const item = {
    hidden: {
      rotateX: -95,
      y: 60,
      opacity: 0,
      scale: 0.82,
      filter: 'blur(8px)',
    },
    visible: {
      rotateX: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring' as const,
        stiffness: 260,
        damping: 18,
        // Blur resolves slightly ahead of spring so it doesn't oscillate
        filter: { duration: 0.45 },
      },
    },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={cn('flex flex-wrap gap-x-[0.3em] gap-y-1', className)}
      style={{ perspective: '1200px' }}
    >
      {tokens.map((token, i) => (
        <motion.span
          key={i}
          variants={item}
          className={cn(
            'origin-bottom inline-block',
            accentWords.includes(i) ? 'text-gradient-japan italic' : '',
            wordClassName,
          )}
          style={{
            transformStyle: 'preserve-3d',
            ...(mode === 'chars' ? { whiteSpace: 'pre' } : {}),
          }}
        >
          {token}
        </motion.span>
      ))}
    </motion.div>
  )
}
