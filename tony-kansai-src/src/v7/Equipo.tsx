// Franja «Nuestros guías»: al final de TODAS las páginas React (App.tsx la pone
// detrás de cada página), para saltar de un guía a otro sin perderse. Cada
// tarjeta va en el idioma de su guía; la frase larga queda como texto pequeño
// (no oculto) porque es la que leen Google y las IAs. Misma marca que
// scripts/equipo-estatico.mjs genera para /tr/, /fr/, /ru/kndr/, /familias/ y /private/.

import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { EQUIPO, NOMBRE_IDIOMA, UI_EQUIPO, versionGuia } from './datosEquipo'
import { CORREO } from './contenido'
import type { GuiaEquipo, GuiaEquipoId, IdiomaEquipo } from './datosEquipo'
import './equipo.css'

/** Rutas que son de la app (enlace con <Link>); /tr/, /fr/, /familias/ y /private/ son HTML estático. */
const DE_LA_APP = /^\/(es|en|ar|ru|larion)\//

/** Idioma y guía de la página a partir de la ruta; si la ruta no lo dice (legales, 404), el idioma elegido. */
function dePagina(pathname: string, langElegido: string): { lang: IdiomaEquipo; actual: GuiaEquipoId | null } {
  const m = pathname.match(/^\/(es|en|ar|ru|larion)(\/|$)/)
  if (!m) return { lang: (langElegido in UI_EQUIPO.titulo ? langElegido : 'en') as IdiomaEquipo, actual: null }
  if (m[1] === 'larion') return { lang: 'en', actual: 'larion' }
  return { lang: m[1] as IdiomaEquipo, actual: m[1] === 'ru' ? 'larion' : 'tony' }
}

function Enlace({ to, children, ...resto }: { to: string; children: ReactNode; className?: string; hrefLang?: string; lang?: string; 'aria-current'?: 'page' }) {
  return DE_LA_APP.test(to) ? <Link to={to} {...resto}>{children}</Link> : <a href={to} {...resto}>{children}</a>
}

function Tarjeta({ g, langPagina, aqui }: { g: GuiaEquipo; langPagina: IdiomaEquipo; aqui: boolean }) {
  const { lang, v } = versionGuia(g, langPagina)
  const rtl = lang === 'ar'
  return (
    <li className={`eq-tarjeta${aqui ? ' eq-aqui' : ''}`} lang={lang} dir={rtl ? 'rtl' : 'ltr'}>
      {aqui && <span className="eq-sello" lang={langPagina} dir={langPagina === 'ar' ? 'rtl' : 'ltr'}>{UI_EQUIPO.aqui[langPagina]}</span>}
      <div className="eq-cabeza">
        {g.foto
          ? <img className="eq-foto" src={g.foto} alt={v.alt ?? v.nombre} width={320} height={400} loading="lazy" decoding="async" />
          : <span className="eq-emblema" aria-hidden="true"><span>{g.emblema}</span></span>}
        <div>
          <h3 className="eq-nombre">{v.nombre}</h3>
          <ul className="eq-idiomas" aria-label={g.idiomas.map((i) => NOMBRE_IDIOMA[i]).join(', ')}>
            {g.idiomas.map((i) => <li key={i} title={NOMBRE_IDIOMA[i]} aria-hidden="true">{i.toUpperCase()}</li>)}
          </ul>
        </div>
      </div>
      <p className="eq-linea">{v.linea}</p>
      <p className="eq-desc">{v.desc}</p>
      <div className="eq-acciones">
        <Enlace to={v.ruta} className="eq-boton" hrefLang={lang} aria-current={aqui ? 'page' : undefined}>
          {v.boton}<span className="eq-oculto">{v.oculto}</span> <span aria-hidden="true">{rtl ? '←' : '→'}</span>
        </Enlace>
        {g.extra && <Enlace to={g.extra.ruta} className="eq-extra" hrefLang={g.extra.lang} lang={g.extra.lang}>{g.extra.texto}</Enlace>}
      </div>
    </li>
  )
}

export function Equipo() {
  const { pathname } = useLocation()
  const { lang: elegido } = useLanguage()
  // La portada solo redirige; el panel no es una página pública.
  if (pathname === '/' || pathname.startsWith('/admin')) return null
  const { lang, actual } = dePagina(pathname, elegido)
  return (
    <section className="eq eq-react" aria-labelledby="eq-titulo" lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="eq-kap">
        <p className="eq-ante"><span aria-hidden="true">案内人</span> {UI_EQUIPO.equipo[lang]}</p>
        <h2 className="eq-titulo" id="eq-titulo">{UI_EQUIPO.titulo[lang]}</h2>
        <p className="eq-sub">{UI_EQUIPO.sub[lang]}</p>
        <ul className="eq-fila">
          {/* El guía de la página primero: sale en grande (equipo.css). */}
          {[...EQUIPO.filter((g) => g.id === actual), ...EQUIPO.filter((g) => g.id !== actual)].map((g) => <Tarjeta key={g.id} g={g} langPagina={lang} aqui={g.id === actual} />)}
        </ul>
        {/* Línea final fina, la última cosa de la página (como en nawatravel.ae). */}
        <p className="eq-fin"><span>© Tony Kansai Guide</span> <a href={`mailto:${CORREO}`}>{CORREO}</a></p>
      </div>
    </section>
  )
}

export default Equipo
