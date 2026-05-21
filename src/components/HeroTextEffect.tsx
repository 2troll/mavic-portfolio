import { motion } from 'framer-motion'

interface HeroTextEffectProps {
  text: string
  className?: string
  wordClassName?: string
}

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
}

const wordVariant = {
  hidden: {
    y: 90,
    opacity: 0,
    rotateX: -80,
    filter: 'blur(8px)',
  },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      stiffness: 90,
      damping: 13,
    },
  },
}

export function HeroTextEffect({
  text,
  className,
  wordClassName,
}: HeroTextEffectProps) {
  const words = text.split(' ')

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={`flex flex-wrap justify-center gap-x-[0.3em] gap-y-1 ${className ?? ''}`}
      style={{ perspective: '800px' }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariant}
          className={`inline-block ${wordClassName ?? ''}`}
          style={{ transformOrigin: '50% 0%' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}
