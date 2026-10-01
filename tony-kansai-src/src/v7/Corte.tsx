// Transición «corte de katana» entre las páginas v7.
//
// 1. Al pulsar un enlace interno, dos mitades de tinta cierran la pantalla en
//    diagonal (0,42 s). 2. Se cambia de página por debajo. 3. Un filo de luz
//    cruza la diagonal, las mitades resbalan por el corte y se abren, y del
//    corte salen pétalos de sakura.
//
// Escucha los clics en fase de captura, así que sirve para cualquier <a> o
// <Link> sin tocar cada enlace. Con movimiento reducido no hace nada.

import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { dibujaPetalo, mueve, movimientoReducido, nuevoPetalo } from './petalos'
import type { Petalo } from './petalos'

const CIERRE_MS = 420
const APERTURA_MS = 1100

const limpia = (ruta: string) => ruta.replace(/\/+$/, '') || '/'

export function Corte({ rutas }: { rutas: string[] }) {
  const navegar = useNavigate()
  const { pathname } = useLocation()
  const [fase, setFase] = useState<'nada' | 'cierra' | 'abre'>('nada')
  const lienzo = useRef<HTMLCanvasElement>(null)
  const ocupado = useRef(false)
  const actual = useRef(pathname)
  actual.current = pathname

  // El filo cruza la pantalla en diagonal: largo y ángulo según la ventana.
  useEffect(() => {
    const mide = () => {
      const w = window.innerWidth, h = window.innerHeight
      document.documentElement.style.setProperty('--v7-filo-largo', `${Math.hypot(w, h) + 40}px`)
      document.documentElement.style.setProperty('--v7-filo-angulo', `${-Math.atan2(h, w)}rad`)
    }
    mide()
    window.addEventListener('resize', mide)
    return () => window.removeEventListener('resize', mide)
  }, [])

  useEffect(() => {
    const alClic = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement).closest('a')
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin) return
      const destino = limpia(url.pathname)
      if (!rutas.includes(destino) || destino === limpia(actual.current) || url.hash) return
      if (movimientoReducido() || ocupado.current) return
      e.preventDefault()
      ocupado.current = true
      setFase('cierra')
      window.setTimeout(() => {
        navegar(url.pathname + url.search)
        window.scrollTo(0, 0)
        setFase('abre')
        lanzaPetalos()
        // Termina con animationend de la mitad b; esto es sólo la red de seguridad.
        window.setTimeout(termina, APERTURA_MS * 2.5)
      }, CIERRE_MS)
    }
    document.addEventListener('click', alClic, true)
    return () => document.removeEventListener('click', alClic, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rutas.join()])

  const termina = () => { setFase('nada'); ocupado.current = false }

  /** Pétalos que brotan a lo largo del corte y caen. */
  const lanzaPetalos = () => {
    const c = lienzo.current
    if (!c) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = window.innerWidth, h = window.innerHeight
    c.width = w * dpr; c.height = h * dpr
    const g = c.getContext('2d')
    if (!g) return
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    const petalos: (Petalo & { nace: number })[] = []
    const n = w < 600 ? 34 : 60
    for (let i = 0; i < n; i++) {
      const t = Math.random()
      // La diagonal va de arriba a la derecha a abajo a la izquierda, y cada
      // pétalo nace cuando el filo (0,26 s) pasa por su punto.
      petalos.push({ ...nuevoPetalo(w * (1 - t), h * t, 4.5), nace: t * 260 })
    }
    const inicio = performance.now()
    const paso = (ahora: number) => {
      const edad = (ahora - inicio) / 1800
      g.clearRect(0, 0, w, h)
      // Los pétalos salen cuando pasa el filo, no antes.
      for (const p of petalos) {
        if (ahora - inicio < p.nace) continue
        mueve(p, ahora, 0.04)
        dibujaPetalo(g, p, Math.max(0, 1 - edad))
      }
      if (edad < 1) requestAnimationFrame(paso)
      else g.clearRect(0, 0, w, h)
    }
    requestAnimationFrame(paso)
  }

  return (
    <div className={`v7-corte ${fase}`} aria-hidden="true">
      <div className="v7-corte-mitad a" />
      <div className="v7-corte-mitad b" onAnimationEnd={termina} />
      <div className="v7-corte-filo"><span /></div>
      <canvas ref={lienzo} className="v7-corte-petalos" />
    </div>
  )
}
