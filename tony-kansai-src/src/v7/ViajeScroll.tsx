// «El viaje»: el globo se queda fijo en pantalla y el scroll lo mueve, como
// en las páginas de producto de Apple. Cuatro frases cortas acompañan el
// vuelo: de la ciudad del cliente a Kansai, y del hotel al destino.

import { useEffect, useRef, useState } from 'react'
import { GloboReal } from '../v8/GloboReal'
import { suena } from './sonido'
import type { Pagina } from './contenido'

export function ViajeScroll({ p }: { p: Pagina }) {
  const seccion = useRef<HTMLElement>(null)
  const progreso = useRef(0)
  const [paso, setPaso] = useState(0)
  // En pantalla ancha el texto va a la izquierda: la cámara mira un poco al
  // oeste para que la zona quede a la derecha, libre. En móvil, centrada.
  const [ancho] = useState(() => typeof window !== 'undefined' && window.innerWidth > 820)
  const final = p.guia === 'larion'
    ? { lat: ancho ? 34.55 : 34.2, lon: ancho ? 131.7 : 133.75, dist: ancho ? 1.155 : 1.22 }
    : { lat: 34.8, lon: ancho ? 134.2 : 135.35, dist: 1.1 }

  // Un fūrin en cada cambio (si el visitante encendió el sonido).
  const inicio = useRef(true)
  useEffect(() => {
    if (inicio.current) { inicio.current = false; return }
    suena('furin')
  }, [paso])

  useEffect(() => {
    const el = seccion.current
    if (!el) return
    let raf = 0
    const medir = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const recorrido = r.height - window.innerHeight
      const v = recorrido > 0 ? Math.min(1, Math.max(0, -r.top / recorrido)) : 1
      progreso.current = v
      // El último tramo se queda quieto un rato para poder leer la zona.
      // Cada frase entra cuando el globo ya muestra lo que dice.
      setPaso(v < 0.3 ? 0 : v < 0.55 ? 1 : v < 0.78 ? 2 : 3)
    }
    const alScroll = () => { if (!raf) raf = requestAnimationFrame(medir) }
    medir()
    window.addEventListener('scroll', alScroll, { passive: true })
    window.addEventListener('resize', alScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', alScroll)
      window.removeEventListener('resize', alScroll)
    }
  }, [])

  // El vuelo ocupa el 85 % del recorrido; el resto es la pausa final.
  const vuelo = useRef({ get current() { return Math.min(1, progreso.current / 0.85) } }).current

  return (
    <section id="zona" ref={seccion} className="v7-viaje" aria-label={p.zona.titulo}>
      <div className="v7-viaje-fijo">
        <GloboReal
          className="v7-globo-viaje"
          lugares={p.zona.lugares}
          origenes={p.zona.origenes}
          inicio={p.zona.origenes[0] ? { lat: p.zona.origenes[0].lat - 8, lon: p.zona.origenes[0].lon } : undefined}
          final={final}
          progreso={vuelo}
          etiquetaAria={`${p.zona.titulo}: ${p.zona.lugares.map((l) => l.nombre).join(', ')}`}
        />
        <ol className="v7-viaje-frases" aria-live="polite">
          {p.viaje.map((f, i) => (
            <li key={f} className={`v7-viaje-frase ${i === paso ? 'activa' : ''} ${i === 3 ? 'ultima' : ''}`} aria-hidden={i !== paso}>
              <span className="v7-viaje-num">{i + 1} / 4</span>
              <p>{f}</p>
              {i === 3 && (
                <>
                  <p className="v7-viaje-sub">{p.zona.sub}</p>
                  <ul className="v7-lugares">{p.zona.lugares.map((l) => <li key={l.nombre}>{l.nombre}</li>)}</ul>
                </>
              )}
            </li>
          ))}
        </ol>
        <div className="v7-viaje-barra" aria-hidden="true"><span style={{ transform: `scaleX(${(paso + 1) / 4})` }} /></div>
      </div>
    </section>
  )
}
