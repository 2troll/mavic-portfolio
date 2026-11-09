// Carrusel circular de guías: las tarjetas forman un cilindro 3D que gira solo,
// se para al pasar el ratón o al tocar, se arrastra con el dedo y tiene flechas.
// Idea de «Rolling Gallery» de React Bits (gratis, MIT + Commons Clause), rehecha
// con GSAP para que cada tarjeta siga siendo un enlace accesible y no una imagen.
// Con «reducir movimiento» no gira solo: solo se mueve con las flechas.

import { useEffect, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import { gsap } from 'gsap'

const VELOCIDAD = 0.06 // grados por fotograma (~1 vuelta por minuto)

export function AnilloEquipo({ hijos, etiquetas }: { hijos: ReactElement[]; etiquetas: { ant: string; sig: string } }) {
  const escena = useRef<HTMLDivElement>(null)
  const anillo = useRef<HTMLUListElement>(null)
  const angulo = useRef(0)
  const pausa = useRef(false)
  const [frente, setFrente] = useState(0)
  const n = hijos.length
  const paso = 360 / n

  useEffect(() => {
    const el = anillo.current, sc = escena.current
    if (!el || !sc) return
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Radio para que las tarjetas no se pisen: depende del ancho real de la tarjeta.
    const colocar = () => {
      const ancho = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 280
      const radio = Math.round((ancho / 2) / Math.tan(Math.PI / n) + 28)
      el.style.setProperty('--eq-radio', `${radio}px`)
    }
    colocar()
    const ro = new ResizeObserver(colocar)
    ro.observe(sc)

    const pintar = () => {
      el.style.transform = `translateZ(calc(var(--eq-radio) * -1)) rotateY(${angulo.current}deg)`
      // La tarjeta de delante se ilumina; las de detrás se apagan y no se pueden pulsar.
      const delante = ((Math.round(-angulo.current / paso) % n) + n) % n
      setFrente((f) => (f === delante ? f : delante))
      Array.from(el.children).forEach((c, i) => {
        const rel = ((i * paso + angulo.current) % 360 + 360) % 360
        const cos = Math.cos((rel * Math.PI) / 180)
        ;(c as HTMLElement).style.opacity = String(Math.max(0.18, 0.35 + 0.65 * cos))
        ;(c as HTMLElement).style.pointerEvents = cos > 0.2 ? 'auto' : 'none'
      })
    }
    pintar()

    const giro = () => { if (!pausa.current && !quieto) { angulo.current -= VELOCIDAD; pintar() } }
    gsap.ticker.add(giro)

    // Arrastrar con el dedo o el ratón.
    let x0 = 0, a0 = 0, arrastrando = false
    const abajo = (e: PointerEvent) => { arrastrando = true; x0 = e.clientX; a0 = angulo.current; pausa.current = true; gsap.killTweensOf(angulo) }
    const mover = (e: PointerEvent) => { if (!arrastrando) return; angulo.current = a0 + (e.clientX - x0) * 0.25; pintar() }
    const arriba = () => {
      if (!arrastrando) return
      arrastrando = false
      // Se encaja en la tarjeta más cercana, con un rebote suave.
      gsap.to(angulo, { current: Math.round(angulo.current / paso) * paso, duration: 0.6, ease: 'power3.out', onUpdate: pintar, onComplete: () => { pausa.current = sc.matches(':hover') } })
    }
    sc.addEventListener('pointerdown', abajo)
    window.addEventListener('pointermove', mover)
    window.addEventListener('pointerup', arriba)
    const entra = () => { pausa.current = true }
    const sale = () => { if (!arrastrando) pausa.current = false }
    sc.addEventListener('mouseenter', entra)
    sc.addEventListener('mouseleave', sale)
    sc.addEventListener('focusin', entra)
    sc.addEventListener('focusout', sale)

    // Las flechas giran una tarjeta exacta.
    const ir = (dir: number) => {
      pausa.current = true
      gsap.to(angulo, { current: Math.round(angulo.current / paso) * paso - dir * paso, duration: 0.8, ease: 'power3.inOut', onUpdate: pintar })
    }
    ;(sc as HTMLDivElement & { __ir?: (d: number) => void }).__ir = ir

    return () => {
      gsap.ticker.remove(giro)
      gsap.killTweensOf(angulo)
      ro.disconnect()
      sc.removeEventListener('pointerdown', abajo)
      window.removeEventListener('pointermove', mover)
      window.removeEventListener('pointerup', arriba)
      sc.removeEventListener('mouseenter', entra)
      sc.removeEventListener('mouseleave', sale)
      sc.removeEventListener('focusin', entra)
      sc.removeEventListener('focusout', sale)
    }
  }, [n, paso])

  const ir = (d: number) => (escena.current as (HTMLDivElement & { __ir?: (d: number) => void }) | null)?.__ir?.(d)

  return (
    <div className="eq-anillo-caja">
      <div className="eq-anillo-escena" ref={escena}>
        <ul className="eq-anillo" ref={anillo}>
          {hijos.map((h, i) => (
            <li key={i} className={`eq-anillo-hueco${i === frente ? ' eq-frente' : ''}`} style={{ transform: `rotateY(${i * paso}deg) translateZ(var(--eq-radio))` }}>
              {h}
            </li>
          ))}
        </ul>
      </div>
      <div className="eq-anillo-mandos">
        <button type="button" className="eq-flecha" onClick={() => ir(-1)} aria-label={etiquetas.ant}>←</button>
        <span className="eq-puntos" aria-hidden="true">{hijos.map((_, i) => <i key={i} className={i === frente ? 'on' : ''} />)}</span>
        <button type="button" className="eq-flecha" onClick={() => ir(1)} aria-label={etiquetas.sig}>→</button>
      </div>
    </div>
  )
}
