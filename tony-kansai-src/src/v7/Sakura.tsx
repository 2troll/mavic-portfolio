// Lluvia suave de sakura sobre la portada de cada página: pocos pétalos,
// lentos, y sólo mientras se ve. Con movimiento reducido no se pinta.

import { useEffect, useRef } from 'react'
import { dibujaPetalo, mueve, movimientoReducido, nuevoPetalo } from './petalos'
import type { Petalo } from './petalos'

export function Sakura({ cantidad = 16 }: { cantidad?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = ref.current
    if (!c || movimientoReducido()) return
    const g = c.getContext('2d')
    if (!g) return
    let w = 0, h = 0, raf = 0, visible = false
    const tam = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = c.clientWidth; h = c.clientHeight
      c.width = w * dpr; c.height = h * dpr
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    tam()
    const n = w < 600 ? Math.ceil(cantidad * 0.6) : cantidad
    const nace = (arriba: boolean): Petalo => {
      const p = nuevoPetalo(Math.random() * w * 1.1 - w * 0.1, arriba ? -20 : Math.random() * h, 0)
      p.vy = 0.25 + Math.random() * 0.45
      p.vx = 0.15 + Math.random() * 0.35
      return p
    }
    const petalos = Array.from({ length: n }, () => nace(false))
    const paso = (t: number) => {
      raf = 0
      g.clearRect(0, 0, w, h)
      for (let i = 0; i < petalos.length; i++) {
        const p = petalos[i]
        mueve(p, t, 0.002)
        p.vy = Math.min(p.vy, 0.9)
        if (p.y > h + 20 || p.x > w + 20) petalos[i] = nace(true)
        dibujaPetalo(g, p, 0.85)
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(paso)
    }
    const sigue = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(paso) }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sigue() })
    io.observe(c)
    const ro = new ResizeObserver(tam)
    ro.observe(c)
    document.addEventListener('visibilitychange', sigue)
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect()
      document.removeEventListener('visibilitychange', sigue)
    }
  }, [cantidad])

  return <canvas ref={ref} className="v7-sakura" aria-hidden="true" />
}
