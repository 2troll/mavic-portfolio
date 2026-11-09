// Vitrina de guías: a la izquierda el nombre en grande y lo que hace; a la derecha
// su foto, que gira en 2D al pasar al siguiente; entre las dos, una línea de
// progreso por tramos (uno por guía) que avanza sola. Debajo, una fila de caras
// para elegir guía directamente.
// Inspirado en el bloque «Hero 6» de React Bits Pro (de pago, no copiado):
// rehecho a mano con GSAP. Todos los guías están en el HTML (los inactivos solo
// se ocultan a la vista) para que Google y las IAs lean a todos.

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { gsap } from 'gsap'
import { NOMBRE_IDIOMA, UI_EQUIPO, versionGuia } from './datosEquipo'
import type { GuiaEquipo, IdiomaEquipo } from './datosEquipo'

const DURACION = 6 // segundos por guía

/** Color del brillo de cada guía (detrás de la foto y en la línea). */
const COLOR: Record<string, string> = {
  tony: '#d1342f', larion: '#3b6fd8', maks: '#c9a227', filipp: '#a23bd8',
  ferhat: '#1f8fb8', iheb: '#e2557a', antonio: '#2f8f5b', mario: '#00b3a4',
}

export function VitrinaEquipo({ guias, langPagina, actual, Enlace }: {
  guias: GuiaEquipo[]
  langPagina: IdiomaEquipo
  actual: string | null
  Enlace: (p: { to: string; children: ReactNode; className?: string; hrefLang?: string; 'aria-current'?: 'page' }) => ReactNode
}) {
  const [i, setI] = useState(0)
  const caja = useRef<HTMLDivElement>(null)
  const barra = useRef<gsap.core.Tween | null>(null)
  const pausa = useRef(false)
  const n = guias.length

  // Transición: la foto saliente gira y se aleja; la entrante entra girando desde el otro lado.
  const ir = useCallback((sig: number) => setI(((sig % n) + n) % n), [n])

  useEffect(() => {
    const el = caja.current
    if (!el) return
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fotos = el.querySelectorAll<HTMLElement>('.eqv-foto')
    const textos = el.querySelectorAll<HTMLElement>('.eqv-texto')
    fotos.forEach((f, k) => {
      if (k === i) gsap.fromTo(f, { rotate: quieto ? 0 : -9, scale: quieto ? 1 : 0.86, autoAlpha: 0 }, { rotate: 0, scale: 1, autoAlpha: 1, duration: quieto ? 0.2 : 1.1, ease: 'expo.out', overwrite: true })
      else if (gsap.getProperty(f, 'autoAlpha') !== 0) gsap.to(f, { rotate: quieto ? 0 : 9, scale: quieto ? 1 : 0.86, autoAlpha: 0, duration: quieto ? 0.2 : 0.7, ease: 'power3.in', overwrite: true })
    })
    textos.forEach((t, k) => {
      const lineas = t.querySelectorAll('.eqv-sube')
      if (k === i) {
        gsap.set(t, { autoAlpha: 1 })
        gsap.fromTo(lineas, { yPercent: quieto ? 0 : 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', stagger: 0.07, delay: 0.15, overwrite: true })
      } else gsap.set(t, { autoAlpha: 0 })
    })
    // Tramo de la línea: se llena en DURACION segundos y pasa al siguiente guía.
    const tramo = el.querySelectorAll<HTMLElement>('.eqv-tramo i')[i]
    el.querySelectorAll<HTMLElement>('.eqv-tramo i').forEach((b, k) => gsap.set(b, { scaleY: k < i ? 1 : 0 }))
    barra.current?.kill()
    barra.current = quieto ? null : gsap.fromTo(tramo, { scaleY: 0 }, { scaleY: 1, duration: DURACION, ease: 'none', paused: pausa.current, onComplete: () => ir(i + 1) })
    return () => { barra.current?.kill() }
  }, [i, ir])

  const parar = (si: boolean) => { pausa.current = si; if (si) barra.current?.pause(); else barra.current?.resume() }
  const color = COLOR[guias[i]?.id] ?? '#d1342f'

  return (
    <div className="eqv" ref={caja} style={{ ['--eqv-color' as string]: color }}
      onMouseEnter={() => parar(true)} onMouseLeave={() => parar(false)} onFocus={() => parar(true)} onBlur={() => parar(false)}>
      <div className="eqv-escena">
        <div className="eqv-textos">
          {guias.map((g, k) => {
            const { lang, v } = versionGuia(g, langPagina)
            const rtl = lang === 'ar'
            return (
              <article key={g.id} className="eqv-texto" lang={lang} dir={rtl ? 'rtl' : 'ltr'} aria-hidden={k !== i}>
                {g.id === actual && <span className="eqv-sello eqv-sube" lang={langPagina}>{UI_EQUIPO.aqui[langPagina]}</span>}
                <h3 className="eqv-nombre eqv-sube">{v.nombre}.</h3>
                <p className="eqv-linea eqv-sube">{v.linea}</p>
                <ul className="eqv-idiomas eqv-sube" aria-label={g.idiomas.map((x) => NOMBRE_IDIOMA[x]).join(', ')}>
                  {g.idiomas.map((x) => <li key={x} title={NOMBRE_IDIOMA[x]}>{x.toUpperCase()}</li>)}
                </ul>
                <p className="eqv-desc eqv-sube">{v.desc}</p>
                <div className="eqv-sube">
                  <Enlace to={v.ruta} className="eqv-boton" hrefLang={lang} aria-current={g.id === actual ? 'page' : undefined}>
                    {v.boton}<span className="eq-oculto">{v.oculto}</span> <span aria-hidden="true">{rtl ? '←' : '→'}</span>
                  </Enlace>
                </div>
              </article>
            )
          })}
        </div>
        <div className="eqv-tramos" aria-hidden="true">
          {guias.map((g, k) => <button key={g.id} type="button" tabIndex={-1} className={`eqv-tramo${k === i ? ' on' : ''}`} onClick={() => ir(k)}><i /></button>)}
        </div>
        <div className="eqv-marco">
          <div className="eqv-brillo" aria-hidden="true" />
          {guias.map((g, k) => {
            const { v } = versionGuia(g, langPagina)
            return (
              <div key={g.id} className="eqv-foto" aria-hidden={k !== i}>
                {g.foto
                  ? <img src={g.foto} alt={v.alt ?? v.nombre} width={640} height={640} loading="lazy" decoding="async" />
                  : <span className="eqv-emblema">{g.emblema}</span>}
              </div>
            )
          })}
        </div>
      </div>
      {/* Elegir guía directamente: una cara por guía. */}
      <div className="eqv-caras" role="tablist">
        {guias.map((g, k) => {
          const { v } = versionGuia(g, langPagina)
          return (
            <button key={g.id} type="button" role="tab" aria-selected={k === i} className={`eqv-cara${k === i ? ' on' : ''}`}
              style={{ ['--eqv-c' as string]: COLOR[g.id] ?? '#d1342f' }} onClick={() => ir(k)}>
              {g.foto ? <img src={g.foto} alt="" width={56} height={56} loading="lazy" /> : <span>{g.emblema}</span>}
              <b>{v.nombre}</b>
            </button>
          )
        })}
      </div>
    </div>
  )
}
