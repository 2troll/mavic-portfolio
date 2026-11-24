// Cabecera común de TODAS las páginas en español (Tony, 25-11-2026: «en la barra
// del menú no hace falta que pongas nada, con tres rayitas… que sea básico… y eso
// va creciendo como roots»). Marca a la izquierda y ☰ a la derecha; al tocarlo se
// abre el árbol de la web (arbolEs.ts, el mismo que lleva el pie): una hoja que
// en el móvil ocupa la pantalla, se cierra con Esc, la X o tocando fuera, y
// atrapa el foco mientras está abierta. El panel va SIEMPRE en el HTML
// pregenerado (oculto con visibility), así Google y las IAs ven todos los enlaces.
// Las páginas estáticas llevan la misma pieza en HTML: scripts/cabecera-es.mjs.
// Firma estable: <CabeceraEs /> sin props obligatorias.
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { IconoWa } from './IconoWa'
import { arbolEs } from './arbolEs'
import type { EnlaceArbol } from './arbolEs'
import './cabecera-es.css'

const ARBOL = arbolEs()
/** Las ramas que van abiertas al abrir el menú (la primera: lo que se vende). */
const ABIERTA = 'experiencias'

export interface EnlacePagina { texto: string; ruta: string }

function EnlaceMenu({ e, actual, onIr }: { e: EnlaceArbol; actual: string; onIr: () => void }) {
  const clase = e.destacado ? 'cab-es-destacado' : undefined
  const dentro = <>{e.texto}{e.nuevo && <small className="cab-es-nuevo">nuevo</small>}</>
  const aqui = e.ruta === actual ? 'page' as const : undefined
  if (e.fuera) return <a href={e.ruta} className={clase} target="_blank" rel="noopener">{dentro}</a>
  if (e.app) return <Link to={e.ruta} className={clase} aria-current={aqui} onClick={onIr}>{dentro}</Link>
  return <a href={e.ruta} className={clase} aria-current={aqui} onClick={onIr}>{dentro}</a>
}

/**
 * activo: ruta de la página actual (si no es una ruta, la de la URL) para marcarla en el menú.
 * enPagina: atajos a las secciones de esta página (rama «En esta página», plegada).
 * idiomas: la misma página en inglés y árabe; si no hay, /international/.
 */
export function CabeceraEs({ activo, enPagina, idiomas }: { activo?: string; enPagina?: EnlacePagina[]; idiomas?: { lang: string; ruta: string; texto: string }[] } = {}) {
  const { pathname } = useLocation()
  // activo puede ser una ruta ('/es/rutas/') o un nombre ('inicio' en la portada): entonces manda la URL.
  const actual = activo?.startsWith('/') ? activo : (pathname.endsWith('/') ? pathname : `${pathname}/`)
  const [abierto, setAbierto] = useState(false)
  const boton = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const cerrar = () => setAbierto(false)

  useEffect(() => {
    if (!abierto) return
    const raiz = document.documentElement
    raiz.classList.add('cab-es-bloqueo')
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
    return () => { document.removeEventListener('keydown', tecla); raiz.classList.remove('cab-es-bloqueo') }
  }, [abierto])
  // Al cambiar de página (SPA), el menú se cierra.
  useEffect(() => { setAbierto(false) }, [pathname])

  const otras = idiomas?.length ? idiomas : null
  return (
    <header className="cab-es" data-abierto={abierto ? '' : undefined}>
      <div className="cab-es-in">
        <Link to="/es/" className="cab-es-marca" aria-label="Tony Kansai Guide, inicio"><Logo /></Link>
        <button ref={boton} type="button" className="cab-es-boton" aria-expanded={abierto} aria-controls="cab-es-menu" onClick={() => setAbierto((a) => !a)}>
          <span className="cab-es-rayas" aria-hidden="true"><i /><i /><i /></span>
          <span className="cab-es-boton-txt">Menú</span>
        </button>
      </div>
      <div className="cab-es-velo" aria-hidden="true" onClick={() => { cerrar(); boton.current?.focus() }} />
      <div ref={panel} id="cab-es-menu" className="cab-es-panel" role="dialog" aria-modal="true" aria-label="Menú de la web" data-lenis-prevent="">
        <div className="cab-es-panel-cab">
          <span className="cab-es-panel-marca"><Logo /></span>
          <button type="button" className="cab-es-cerrar" aria-label="Cerrar el menú" onClick={() => { cerrar(); boton.current?.focus() }}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" /></svg>
          </button>
        </div>
        <nav className="cab-es-arbol" aria-label="Menú">
          <ul className="cab-es-primeros">
            {ARBOL.primeros.map((e) => <li key={e.ruta}><EnlaceMenu e={e} actual={actual} onIr={cerrar} /></li>)}
          </ul>
          {enPagina && enPagina.length > 0 && (
            <details className="cab-es-rama">
              <summary>En esta página</summary>
              <ul>{enPagina.map((e) => <li key={e.ruta}><a href={e.ruta} onClick={cerrar}>{e.texto}</a></li>)}</ul>
            </details>
          )}
          {ARBOL.ramas.map((r) => (
            <details key={r.id} className={`cab-es-rama cab-es-rama-${r.id}`} open={r.id === ABIERTA}>
              <summary>{r.titulo}</summary>
              <ul>{r.enlaces.map((e) => <li key={e.ruta}><EnlaceMenu e={e} actual={actual} onIr={cerrar} /></li>)}</ul>
            </details>
          ))}
        </nav>
        <a className="cab-es-wa" href={ARBOL.whatsapp.href} target="_blank" rel="noopener noreferrer"><IconoWa /> {ARBOL.whatsapp.texto}</a>
        <p className="cab-es-idiomas">
          {otras
            ? otras.map((o, i) => <span key={o.ruta}>{i > 0 && ' · '}<a href={o.ruta} lang={o.lang} dir={o.lang === 'ar' ? 'rtl' : undefined}>{o.texto}</a></span>)
            : <a href="/international/" lang="en">English · <span lang="ar" dir="rtl">العربية</span></a>}
        </p>
      </div>
    </header>
  )
}
