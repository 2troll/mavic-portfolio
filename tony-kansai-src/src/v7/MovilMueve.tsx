// Movimiento del móvil de la portada de ventajas, con framer-motion (muelles y
// scroll de la librería, no animaciones a mano):
//  1. entrada: sube girando y se asienta con muelle;
//  2. reposo: flota y se mece despacio;
//  3. ratón: se inclina hacia el cursor y el reflejo del cristal le sigue;
//  4. scroll: al bajar, gira hacia atrás y se aleja;
//  5. toque: se hunde un poco, como al pulsar; tocando fuera de las apps da una vuelta entera;
//  6. arrastre (dedo o ratón): gira hacia los lados y vuelve con muelle;
//  7. reposo: además se balancea en 3D, y los iconos sobresalen del cristal (CSS translateZ).
// Con «reducir movimiento» del sistema se queda quieto e inclinado.
import { useRef } from 'react'
import type { ReactNode, PointerEvent } from 'react'
import { LazyMotion, domMax, m as motion, animate, useMotionValue, useSpring, useTransform, useScroll, useReducedMotion, useMotionTemplate } from 'framer-motion'

const MUELLE = { stiffness: 140, damping: 18, mass: 0.6 }

// Grosor de verdad: láminas apiladas hacia atrás (el canto) y una tapa trasera con
// cámara. Así, al girarlo de lado o darle la vuelta, se ve un móvil y no un papel.
const GROSOR = 22
const CAPAS = Array.from({ length: 12 }, (_, n) => 1.5 + (n * (GROSOR - 1.5)) / 11)
const Cuerpo = () => (
  <span className="vt-movil-cuerpo" aria-hidden="true">
    {CAPAS.map((z, n) => <i key={n} className={n === 0 || n === CAPAS.length - 1 ? 'vt-movil-filo' : undefined} style={{ transform: `translateZ(${-z}px)` }} />)}
    <b className="vt-movil-tapa" style={{ transform: `translateZ(${-GROSOR - 0.5}px) rotateY(180deg)` }}><i /></b>
  </span>
)

// `lado`: -1 inclina el móvil hacia el otro lado (la portada de ventajas lleva dos, enfrentados).
export default function MovilMueve({ rtl, etiqueta, children, lado = 1, retraso = 0 }: { rtl: boolean; etiqueta: string; children: ReactNode; lado?: 1 | -1; retraso?: number }) {
  const quieto = useReducedMotion()
  const zona = useRef<HTMLDivElement>(null)
  const signo = (rtl ? -1 : 1) * lado

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

  // Arrastre: el desplazamiento horizontal se convierte en giro; al soltar vuelve con muelle.
  const arrastre = useMotionValue(0)
  const arrastreS = useSpring(arrastre, { stiffness: 120, damping: 13 })
  // Vuelta entera al tocar la pantalla fuera de las apps.
  const vuelta = useMotionValue(0)
  const rotYTotal = useTransform([rotY, arrastreS, vuelta], ([a, b, c]: number[]) => a + b + c)
  const daVuelta = (e: MouseEvent | TouchEvent | globalThis.PointerEvent) => {
    if ((e.target as HTMLElement).closest('a, button')) return
    animate(vuelta, vuelta.get() + 360 * signo, { type: 'spring', stiffness: 55, damping: 13 })
  }

  const mueve = (e: PointerEvent<HTMLDivElement>) => {
    if (quieto || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const suelta = () => { px.set(0); py.set(0) }

  if (quieto) {
    return <div className="vt-movil vt-movil-quieto" role="navigation" aria-label={etiqueta}><Cuerpo />{children}</div>
  }

  return (
    <LazyMotion features={domMax} strict>
    <motion.div ref={zona} className="vt-movil-escena" style={{ y: scrollY, scale: escala, touchAction: 'pan-y' }} onPointerMove={mueve} onPointerLeave={suelta}
      onPan={(_, info) => arrastre.set(Math.max(-70, Math.min(70, info.offset.x * 0.45)))} onPanEnd={() => arrastre.set(0)}>
      <motion.div
        className="vt-movil-flota"
        animate={{ y: [0, -14, 0, -6, 0], rotateZ: [signo * -3, signo * -1.2, signo * -3, signo * -2, signo * -3], rotateY: [0, 7, 0, -7, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.2 + retraso * 3 }}
      >
        <motion.div
          className="vt-movil"
          role="navigation"
          aria-label={etiqueta}
          initial={{ opacity: 0, y: 140, rotateZ: signo * -14, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, rotateZ: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 70, damping: 14, mass: 0.9, delay: 0.15 + retraso }}
          whileTap={{ scale: 0.97 }}
          onTap={daVuelta}
          style={{ rotateY: rotYTotal, rotateX: rotXTotal }}
        >
          <Cuerpo />
          {children}
          <motion.span className="vt-movil-brillo" aria-hidden="true" style={{ background: brillo }} />
        </motion.div>
      </motion.div>
    </motion.div>
    </LazyMotion>
  )
}
