import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const ease = [0.76, 0, 0.24, 1] as const

export function CurtainReveal() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden flex flex-col">
          {/* Top panel */}
          <motion.div
            className="flex-1 flex items-end justify-center pb-8"
            style={{ background: '#050508' }}
            initial={{ y: 0 }}
            exit={{ y: '-101%' }}
            transition={{ duration: 1.5, ease, delay: 0.05 }}
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <div className="font-serif text-4xl font-semibold tracking-[0.12em] text-white/90">
                TONY KANSAI
              </div>
              <div className="text-[10px] text-japan-red tracking-[0.4em] uppercase mt-2 font-semibold">
                Private Tours · Japan
              </div>
            </motion.div>
          </motion.div>

          {/* Red centre line that flashes as panels part */}
          <motion.div
            className="h-px w-full bg-gradient-to-r from-transparent via-japan-red to-transparent origin-center"
            initial={{ scaleX: 0, opacity: 0 }}
            exit={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.5, times: [0, 0.25, 0.75, 1] }}
          />

          {/* Bottom panel */}
          <motion.div
            className="flex-1 flex items-start justify-center pt-8"
            style={{ background: '#050508' }}
            initial={{ y: 0 }}
            exit={{ y: '101%' }}
            transition={{ duration: 1.5, ease, delay: 0.05 }}
          >
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex gap-3 items-center justify-center">
                {['🏯', '⛩️', '🌸'].map((e, i) => (
                  <motion.span
                    key={i}
                    className="text-2xl"
                    initial={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {e}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
