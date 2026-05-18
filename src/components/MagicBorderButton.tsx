import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

interface MagicBorderButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  href?: string
}

const SURFACE =
  'relative flex items-center gap-2 rounded-full bg-[#0a0a0f] px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#111120]'

export function MagicBorderButton({
  children,
  className,
  onClick,
  href,
}: MagicBorderButtonProps) {
  return (
    <motion.div
      className="relative inline-flex cursor-pointer overflow-hidden rounded-full p-[1.5px]"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
    >
      {/* Spinning conic-gradient border */}
      <div className="pointer-events-none absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,#6366f1_60deg,#22d3ee_120deg,#a855f7_180deg,#22d3ee_240deg,#6366f1_300deg,transparent_360deg)]" />

      {href ? (
        <a href={href} className={cn(SURFACE, className)}>
          {children}
        </a>
      ) : (
        <button type="button" onClick={onClick} className={cn(SURFACE, className)}>
          {children}
        </button>
      )}
    </motion.div>
  )
}
