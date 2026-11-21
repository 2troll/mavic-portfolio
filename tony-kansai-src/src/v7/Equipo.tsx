// Pie de empresa al final de TODAS las páginas React (App.tsx lo pone detrás de
// cada página): «Tony Kansai Guide · Guías privados en Japón» y, plegada, la lista
// de guías en texto, cada uno con su página. Sin fotos ni muro (Antonio,
// 21-11-2026: «contactan con una empresa»; «cada guía en su propia página»).
// Los enlaces siguen en el HTML pregenerado para Google y las IAs. Misma marca
// que scripts/equipo-estatico.mjs genera para las secciones estáticas.

import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { EQUIPO, UI_EQUIPO, versionGuia } from './datosEquipo'
import type { IdiomaEquipo } from './datosEquipo'
import './equipo.css'

/** Rutas que son de la app (enlace con <Link>); /tr/, /fr/, /familias/ y /private/ son HTML estático. */
const DE_LA_APP = /^\/(es|en|ar|ru|larion)\//

/** Idioma de la página a partir de la ruta; si la ruta no lo dice (legales, 404), el idioma elegido. */
function dePagina(pathname: string, langElegido: string): { lang: IdiomaEquipo } {
  const m = pathname.match(/^\/(es|en|ar|ru|larion)(\/|$)/)
  if (!m) return { lang: (langElegido in UI_EQUIPO.lema ? langElegido : 'en') as IdiomaEquipo }
  return { lang: m[1] === 'larion' ? 'en' : (m[1] as IdiomaEquipo) }
}

function Enlace({ to, children, ...resto }: { to: string; children: ReactNode; hrefLang?: string; 'aria-current'?: 'page' }) {
  return DE_LA_APP.test(to) ? <Link to={to} {...resto}>{children}</Link> : <a href={to} {...resto}>{children}</a>
}

export function Equipo() {
  const { pathname } = useLocation()
  const { lang: elegido } = useLanguage()
  // La portada solo redirige; el panel no es una página pública.
  if (pathname === '/' || pathname.startsWith('/admin')) return null
  const { lang } = dePagina(pathname, elegido)
  // «Estás aquí» solo en la página exacta del guía (antes salía en todas las suyas).
  const aqui = pathname.replace(/\/?$/, '/')
  return (
    <section className="eq eq-react" aria-label={UI_EQUIPO.enlace[lang]} lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="eq-kap">
        <p className="eq-marca"><strong>Tony Kansai Guide</strong> · {UI_EQUIPO.lema[lang]}</p>
        <details className="eq-guias" id="eq-titulo">
          <summary>{UI_EQUIPO.enlace[lang]}</summary>
          <ul>
            {EQUIPO.map((g) => {
              const { lang: l, v } = versionGuia(g, lang)
              return (
                <li key={g.id} lang={l} dir={l === 'ar' ? 'rtl' : 'ltr'}>
                  <Enlace to={v.ruta} hrefLang={l} aria-current={v.ruta === aqui ? 'page' : undefined}>{v.linea}</Enlace>{' '}
                  <span className="eq-quien">{v.nombre}</span>
                </li>
              )
            })}
          </ul>
        </details>
      </div>
    </section>
  )
}

export default Equipo
