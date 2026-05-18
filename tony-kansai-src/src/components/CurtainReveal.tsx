import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export function CurtainReveal() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="curtain"
          className="fixed inset-0 z-[9998] pointer-events-none flex flex-col items-center justify-center gap-3"
          style={{ background: '#050508' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: 'easeInOut' }}
        >
          <motion.div
            className="font-serif text-4xl font-semibold tracking-[0.12em] text-white/90"
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            TONY KANSAI
          </motion.div>
          <motion.div
            className="text-[10px] text-japan-red tracking-[0.4em] uppercase font-semibold"
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            Private Tours · Japan
          </motion.div>
          <motion.div
            className="mt-4 flex gap-3"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {['🏯', '⛩️', '🌸'].map((e, i) => (
              <motion.span
                key={i}
                className="text-2xl"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
              >
                {e}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
