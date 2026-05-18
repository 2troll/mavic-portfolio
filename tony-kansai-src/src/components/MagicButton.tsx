import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

interface MagicButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'outline'
}

export function MagicButton({ children, href, onClick, className, variant = 'primary' }: MagicButtonProps) {
  const spring = { type: 'spring' as const, stiffness: 500, damping: 22 }

  const inner = (
    <motion.span
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={spring}
      className={cn(
        'relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-7 py-3.5 font-semibold text-sm tracking-wide',
        variant === 'primary'
          ? 'bg-gradient-to-r from-japan-red to-japan-orange text-white shadow-lg shadow-japan-red/30'
          : 'glass text-white/90 hover:text-white',
        className,
      )}
    >
      {variant === 'primary' && (
        <span className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0%,rgba(255,255,255,0.15)_40%,transparent_60%)]" />
      )}
      {variant === 'outline' && (
        <>
          <span className="absolute inset-0 rounded-xl">
            <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0%,#E53030_30%,#FF6B35_50%,transparent_60%)]" />
          </span>
          <span className="absolute inset-[1px] rounded-[10px] bg-japan-dark" />
        </>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.span>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block">
        {inner}
      </a>
    )
  }

  return (
    <button onClick={onClick} className="inline-block bg-transparent border-0 p-0 cursor-pointer">
      {inner}
    </button>
  )
}
