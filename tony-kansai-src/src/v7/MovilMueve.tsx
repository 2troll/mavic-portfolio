// Movimiento del móvil de la portada de ventajas, con framer-motion (muelles y
// scroll de la librería, no animaciones a mano):
//  1. entrada: sube girando y se asienta con muelle;
//  2. reposo: flota y se mece despacio;
//  3. ratón: se inclina hacia el cursor y el reflejo del cristal le sigue;
//  4. scroll: al bajar, gira hacia atrás y se aleja;
//  5. toque: se hunde un poco, como al pulsar.
// Con «reducir movimiento» del sistema se queda quieto e inclinado.
import { useRef } from 'react'
import type { ReactNode, PointerEvent } from 'react'
import { LazyMotion, domAnimation, m as motion, useMotionValue, useSpring, useTransform, useScroll, useReducedMotion, useMotionTemplate } from 'framer-motion'

const MUELLE = { stiffness: 140, damping: 18, mass: 0.6 }

export default function MovilMueve({ rtl, etiqueta, children }: { rtl: boolean; etiqueta: string; children: ReactNode }) {
  const quieto = useReducedMotion()
  const zona = useRef<HTMLDivElement>(null)
  const signo = rtl ? -1 : 1

  // Posición del cursor sobre el móvil, de -0.5 a 0.5 (0 = centro).
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, MUELLE)
  const sy = useSpring(py, MUELLE)
  // Inclinación de reposo (−16°/7°/−3°) que el cursor endereza y lleva hacia su lado.
  const rotY = useTransform(sx, [-0.5, 0, 0.5], [signo * -16 - 14, signo * -16, signo * -16 + 30])
  const rotX = useTransform(sy, [-0.5, 0.5], [16, -4])
  const brilloX = useTransform(sx, [-0.5, 0.5], [10, 90])
  const brilloY = useTransform(sy, [-0.5, 0.5], [0, 70])
  const brillo = useMotionTemplate`radial-gradient(120% 80% at ${brilloX}% ${brilloY}%, rgba(255,255,255,.26), rgba(255,255,255,0) 55%)`

  // Scroll de la portada: de 0 (arriba) a 1 (cuando la portada sale de pantalla).
  const { scrollYProgress } = useScroll({ target: zona, offset: ['start start', 'end start'] })
  const scrollX = useTransform(scrollYProgress, [0, 1], [0, 28])
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const escala = useTransform(scrollYProgress, [0, 1], [1, 0.86])
  const rotXTotal = useTransform([rotX, scrollX], ([a, b]: number[]) => a + b)

  const mueve = (e: PointerEvent<HTMLDivElement>) => {
    if (quieto || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const suelta = () => { px.set(0); py.set(0) }

  if (quieto) {
    return <div className="vt-movil vt-movil-quieto" role="navigation" aria-label={etiqueta}>{children}</div>
  }

  return (
    <LazyMotion features={domAnimation} strict>
    <motion.div ref={zona} className="vt-movil-escena" style={{ y: scrollY, scale: escala }} onPointerMove={mueve} onPointerLeave={suelta}>
      <motion.div
        className="vt-movil-flota"
        animate={{ y: [0, -12, 0], rotateZ: [signo * -3, signo * -1.5, signo * -3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      >
        <motion.div
          className="vt-movil"
          role="navigation"
          aria-label={etiqueta}
          initial={{ opacity: 0, y: 140, rotateZ: signo * -14, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, rotateZ: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 70, damping: 14, mass: 0.9, delay: 0.15 }}
          whileTap={{ scale: 0.97 }}
          style={{ rotateY: rotY, rotateX: rotXTotal }}
        >
          {children}
          <motion.span className="vt-movil-brillo" aria-hidden="true" style={{ background: brillo }} />
        </motion.div>
      </motion.div>
    </motion.div>
    </LazyMotion>
  )
}
