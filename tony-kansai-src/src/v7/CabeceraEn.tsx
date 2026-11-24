// Common header for every ENGLISH page of Tony (Tony, 25-11-2026: «la página
// inglés separada, otra cosa»). Same logic as CabeceraEs — the brand on the left,
// a ☰ on the right that opens the site tree (arbolEn.ts, the same one the footer
// carries) — with its own identity: aizome indigo, kinari paper and a gold hairline
// (paleta-en.css, cabecera-en.css). The sheet takes the whole screen on a phone,
// closes with Esc, the X or a tap outside, and traps focus while open. The panel
// is ALWAYS in the prerendered HTML (hidden with visibility), so Google and AIs
// see every link. Static pages get the same piece in HTML: scripts/cabecera-en.mjs.
// Stable signature: <CabeceraEn activo? enPagina? idiomas? />. Never on /larion/.
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { IconoWa } from './IconoWa'
import { arbolEn } from './arbolEn'
import type { EnlaceArbol } from './arbolEn'
import './paleta-en.css'
import './cabecera-en.css'

const ARBOL = arbolEn()
/** The branch that opens with the menu: what is for sale. */
const ABIERTA = 'experiencias'
/** Without a translation of this page, the other home pages. */
export const IDIOMAS_EN = [{ lang: 'es', ruta: '/es/', texto: 'Español' }, { lang: 'ar', ruta: '/ar/', texto: 'العربية' }, { lang: 'ru', ruta: '/ru/', texto: 'Русский' }]

export interface EnlacePaginaEn { texto: string; ruta: string }

function EnlaceMenu({ e, actual, onIr }: { e: EnlaceArbol; actual: string; onIr: () => void }) {
  const clase = e.destacado ? 'cab-en-destacado' : undefined
  const dentro = <>{e.texto}{e.nuevo && <small className="cab-en-nuevo">new</small>}</>
  const aqui = e.ruta === actual ? 'page' as const : undefined
  if (e.fuera) return <a href={e.ruta} className={clase} target="_blank" rel="noopener">{dentro}</a>
  if (e.app) return <Link to={e.ruta} className={clase} aria-current={aqui} onClick={onIr}>{dentro}</Link>
  return <a href={e.ruta} className={clase} aria-current={aqui} onClick={onIr}>{dentro}</a>
}

/**
 * activo: route of this page (or a name such as 'inicio': then the URL decides) to mark it.
 * enPagina: shortcuts to this page's sections («On this page», folded).
 * idiomas: this same page in Spanish and Arabic; without it, the other home pages.
 */
export function CabeceraEn({ activo, enPagina, idiomas }: { activo?: string; enPagina?: EnlacePaginaEn[]; idiomas?: { lang: string; ruta: string; texto: string }[] } = {}) {
  const { pathname } = useLocation()
  const actual = activo?.startsWith('/') ? activo : (pathname.endsWith('/') ? pathname : `${pathname}/`)
  const [abierto, setAbierto] = useState(false)
  const boton = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const cerrar = () => setAbierto(false)

  useEffect(() => {
    if (!abierto) return
    const raiz = document.documentElement
    raiz.classList.add('cab-en-bloqueo')
    const enfocables = () => Array.from(panel.current?.querySelectorAll<HTMLElement>('a[href], button, summary') ?? []).filter((el) => el.offsetParent !== null)
    enfocables()[0]?.focus()
    const tecla = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') { ev.preventDefault(); setAbierto(false); boton.current?.focus(); return }
      if (ev.key !== 'Tab') return
      const lista = enfocables()
      if (!lista.length) return
      const primero = lista[0], ultimo = lista[lista.length - 1]
      if (ev.shiftKey && document.activeElement === primero) { ev.preventDefault(); ultimo.focus() }
      else if (!ev.shiftKey && document.activeElement === ultimo) { ev.preventDefault(); primero.focus() }
    }
    document.addEventListener('keydown', tecla)
    return () => { document.removeEventListener('keydown', tecla); raiz.classList.remove('cab-en-bloqueo') }
  }, [abierto])
  useEffect(() => { setAbierto(false) }, [pathname])

  const otras = idiomas?.length ? idiomas : IDIOMAS_EN
  return (
    <header className="cab-en" data-abierto={abierto ? '' : undefined}>
      <div className="cab-en-in">
        <Link to="/en/" className="cab-en-marca" aria-label="Tony Kansai Guide, home"><Logo /></Link>
        <button ref={boton} type="button" className="cab-en-boton" aria-expanded={abierto} aria-controls="cab-en-menu" onClick={() => setAbierto((a) => !a)}>
          <span className="cab-en-rayas" aria-hidden="true"><i /><i /><i /></span>
          <span className="cab-en-boton-txt">Menu</span>
        </button>
      </div>
      <div className="cab-en-velo" aria-hidden="true" onClick={() => { cerrar(); boton.current?.focus() }} />
      <div ref={panel} id="cab-en-menu" className="cab-en-panel" role="dialog" aria-modal="true" aria-label="Site menu" data-lenis-prevent="">
        <div className="cab-en-panel-cab">
          <span className="cab-en-panel-marca"><Logo /></span>
          <button type="button" className="cab-en-cerrar" aria-label="Close the menu" onClick={() => { cerrar(); boton.current?.focus() }}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" /></svg>
          </button>
        </div>
        <nav className="cab-en-arbol" aria-label="Menu">
          <ul className="cab-en-primeros">
            {ARBOL.primeros.map((e) => <li key={e.ruta}><EnlaceMenu e={e} actual={actual} onIr={cerrar} /></li>)}
          </ul>
          {enPagina && enPagina.length > 0 && (
            <details className="cab-en-rama">
              <summary>On this page</summary>
              <ul>{enPagina.map((e) => <li key={e.ruta}><a href={e.ruta} onClick={cerrar}>{e.texto}</a></li>)}</ul>
            </details>
          )}
          {ARBOL.ramas.map((r) => (
            <details key={r.id} className={`cab-en-rama cab-en-rama-${r.id}`} open={r.id === ABIERTA}>
              <summary>{r.titulo}</summary>
              <ul>{r.enlaces.map((e) => <li key={e.ruta}><EnlaceMenu e={e} actual={actual} onIr={cerrar} /></li>)}</ul>
            </details>
          ))}
        </nav>
        <a className="cab-en-wa" href={ARBOL.whatsapp.href} target="_blank" rel="noopener noreferrer"><IconoWa /> {ARBOL.whatsapp.texto}</a>
        <p className="cab-en-idiomas">
          {otras.map((o, i) => <span key={o.ruta}>{i > 0 && ' · '}<a href={o.ruta} lang={o.lang} dir={o.lang === 'ar' ? 'rtl' : undefined}>{o.texto}</a></span>)}
        </p>
      </div>
    </header>
  )
}
