import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

interface HeroTextProps {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  mode?: 'words' | 'chars'
}

export function HeroText({
  text,
  className,
  wordClassName,
  delay = 0,
  mode = 'words',
}: HeroTextProps) {
  const isChars = mode === 'chars'

  // In word mode: split on whitespace.
  // In char mode: split every codepoint (Array.from handles emoji/surrogates correctly).
  const tokens = isChars ? Array.from(text) : text.split(' ')

  const container = {
    hidden: {},
    visible: {
      transition: {
        // Chars stagger tighter; words stagger slower so each word lands distinctly
        staggerChildren: isChars ? 0.025 : 0.07,
        delayChildren: delay,
      },
    },
  }

  const itemVariant = {
    hidden: {
      rotateX: -90,
      y: 50,
      opacity: 0,
      filter: 'blur(6px)',
      scale: 0.85,
    },
    visible: {
      rotateX: 0,
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        // Spring gives the satisfying elastic snap-in feel
        type: 'spring' as const,
        stiffness: 280,
        damping: 18,
      },
    },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={cn('flex flex-wrap gap-x-3 gap-y-1', className)}
      // Perspective on the parent enables the rotateX 3D flip effect
      style={{ perspective: '1000px' }}
    >
      {tokens.map((token, i) =>
        isChars ? (
          // Char mode — each character gets its own spring animation.
          // whiteSpace:'pre' ensures space characters occupy visible layout width.
          <motion.span
            key={i}
            variants={itemVariant}
            className={cn('origin-bottom', wordClassName)}
            style={{
              transformStyle: 'preserve-3d',
              display: 'inline-block',
              whiteSpace: 'pre',
            }}
          >
            {token}
          </motion.span>
        ) : (
          // Word mode — each word springs in as a unit
          <motion.span
            key={i}
            variants={itemVariant}
            className={cn('origin-bottom', wordClassName)}
            style={{
              transformStyle: 'preserve-3d',
              display: 'inline-block',
            }}
          >
            {token}
          </motion.span>
        )
      )}
    </motion.div>
  )
}
