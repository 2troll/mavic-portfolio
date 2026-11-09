// Abanico de guías, al estilo del bloque «Hero 8» de React Bits Pro (de pago, no
// copiado; rehecho a mano): título enorme en mayúsculas con las caras de los guías
// metidas entre las palabras, que cambian y se ensanchan; debajo, una fila de
// fotos altas en la que la del guía elegido se abre y enseña nombre, idiomas y
// botón. Se elige pasando el ratón, tocando o con el teclado; sin tocar nada,
// avanza sola cada pocos segundos. Todos los guías están en el HTML para que
// Google y las IAs lean a todos.

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { NOMBRE_IDIOMA, UI_EQUIPO, versionGuia } from './datosEquipo'
import type { GuiaEquipo, IdiomaEquipo } from './datosEquipo'

const PASO_MS = 4500

/** Título partido en dos líneas con huecos para las caras (por idioma de la página). */
const TITULO: Record<IdiomaEquipo, [string, string, string]> = {
  es: ['Elige', 'tu guía', 'en tu idioma'],
  en: ['Pick', 'your guide', 'in your language'],
  ar: ['اختر', 'مرشدك', 'بلغتك'],
  ru: ['Выберите', 'своего гида', 'на своём языке'],
  tr: ['Rehberini', 'kendi dilinde', 'seç'],
  fr: ['Choisissez', 'votre guide', 'dans votre langue'],
}

export function VitrinaEquipo({ guias, langPagina, actual, Enlace }: {
  guias: GuiaEquipo[]
  langPagina: IdiomaEquipo
  actual: string | null
  Enlace: (p: { to: string; children: ReactNode; className?: string; hrefLang?: string; 'aria-current'?: 'page' }) => ReactNode
}) {
  const [i, setI] = useState(0)
  const pausa = useRef(false)
  const n = guias.length
  const conFoto = guias.filter((g) => g.foto)

  // Avanza sola; se para mientras el visitante está encima o con el foco dentro.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setInterval(() => { if (!pausa.current) setI((x) => (x + 1) % n) }, PASO_MS)
    return () => window.clearInterval(t)
  }, [n])

  const [t1, t2, t3] = TITULO[langPagina]
  // Las dos caras del título: el guía elegido (o el siguiente con foto) y el que viene después.
  const cara = (k: number) => conFoto.length ? conFoto[((k % conFoto.length) + conFoto.length) % conFoto.length] : null
  const idxFoto = Math.max(0, conFoto.findIndex((g) => g.id === guias[i].id))
  const a = cara(idxFoto), b = cara(idxFoto + 1)

  return (
    <div className="eqv" onMouseEnter={() => { pausa.current = true }} onMouseLeave={() => { pausa.current = false }}
      onFocus={() => { pausa.current = true }} onBlur={() => { pausa.current = false }}>
      <p className="eqv-grande" aria-hidden="true">
        <span>{t1}</span>
        <span className="eqv-pildora">{a && <img key={a.id} src={a.foto} alt="" width={160} height={90} />}</span>
        <span>{t2}</span>
        <br />
        <span className="eqv-pildora eqv-pildora-b">{b && <img key={b.id} src={b.foto} alt="" width={120} height={90} />}</span>
        <span>{t3}</span>
      </p>

      <ul className="eqv-abanico" role="tablist" aria-label={UI_EQUIPO.titulo[langPagina]}>
        {guias.map((g, k) => {
          const { lang, v } = versionGuia(g, langPagina)
          const rtl = lang === 'ar'
          const abierto = k === i
          return (
            <li key={g.id} className={`eqv-hoja${abierto ? ' on' : ''}`} lang={lang} dir={rtl ? 'rtl' : 'ltr'}
              onMouseEnter={() => setI(k)} onClick={() => setI(k)}>
              {g.foto
                ? <img className="eqv-img" src={g.foto} alt={v.alt ?? v.nombre} width={640} height={800} loading="lazy" decoding="async" />
                : <span className="eqv-emblema" aria-hidden="true">{g.emblema}</span>}
              <span className="eqv-velo" aria-hidden="true" />
              {/* Cerrada: solo el nombre en vertical. Abierta: toda la ficha. */}
              <button type="button" role="tab" aria-selected={abierto} className="eqv-pestana" onFocus={() => setI(k)}>{v.nombre}</button>
              <div className="eqv-ficha" aria-hidden={!abierto}>
                {g.id === actual && <span className="eqv-sello" lang={langPagina}>{UI_EQUIPO.aqui[langPagina]}</span>}
                <h3 className="eqv-nombre">{v.nombre}</h3>
                <p className="eqv-linea">{v.linea}</p>
                <ul className="eqv-idiomas" aria-label={g.idiomas.map((x) => NOMBRE_IDIOMA[x]).join(', ')}>
                  {g.idiomas.map((x) => <li key={x} title={NOMBRE_IDIOMA[x]}>{x.toUpperCase()}</li>)}
                </ul>
                <p className="eqv-desc">{v.desc}</p>
                <Enlace to={v.ruta} className="eqv-boton" hrefLang={lang} aria-current={g.id === actual ? 'page' : undefined}>
                  {v.boton}<span className="eq-oculto">{v.oculto}</span> <span aria-hidden="true">{rtl ? '←' : '→'}</span>
                </Enlace>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
