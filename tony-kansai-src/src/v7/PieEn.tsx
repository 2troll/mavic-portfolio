// Common footer for every English page of Tony (Tony, 25-11-2026: «al final de
// todas las páginas, el mismo formato»). Same structure as PieEs — brand and
// line, the four branches of the site tree (arbolEn.ts, the same as the ☰ menu)
// in short columns, accordions on a phone — with the English identity: a deep
// aizome band (pie-en.css). Static pages paint the same footer: scripts/pie-en.mjs.
// Stable signature: <PieEn p={PAGINAS.en} />. Never on /larion/.
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { CREDITOS } from './contenido'
import type { Pagina } from './contenido'
import { CREDITOS_SONIDO } from './sonido'
import { Logo } from './Logo'
import { IconoWa } from './IconoWa'
import { arbolEn } from './arbolEn'
import type { EnlaceArbol } from './arbolEn'
import type { CreditoPie } from './PieEs'
import { IDIOMAS_EN } from './CabeceraEn'
import './paleta-en.css'
import './pie-en.css'

/** Links on view in each column; the rest under «See all (N)» (still in the HTML). */
const VISIBLES = 6
const ARBOL = arbolEn()

function EnlacePieEn({ e }: { e: EnlaceArbol }) {
  const dentro = <>{e.texto}{e.nuevo && <small className="pie-en-nuevo">new</small>}</>
  if (e.fuera) return <a href={e.ruta} target="_blank" rel="noopener">{dentro}</a>
  if (e.app) return <Link to={e.ruta}>{dentro}</Link>
  return <a href={e.ruta}>{dentro}</a>
}

/**
 * p: PAGINAS.en (line and footer labels).
 * creditos: this page's own photos, added to the common ones.
 * idiomas: this same page in Spanish and Arabic; without it, the other home pages.
 */
export function PieEn({ p, creditos, idiomas }: { p: Pagina; creditos?: CreditoPie[]; idiomas?: { lang: string; ruta: string; texto: string }[] }) {
  const cols = useRef<HTMLDivElement>(null)
  // On a phone, accordions closed after mount (open in the HTML: Google).
  useEffect(() => {
    if (!cols.current || !window.matchMedia('(max-width: 720px)').matches) return
    cols.current.querySelectorAll<HTMLDetailsElement>(':scope > details').forEach((d) => { d.open = false })
  }, [])
  const extra = (creditos ?? []).filter((c) => !CREDITOS.some((x) => x.url === c.url))
  const otras = idiomas?.length ? idiomas : IDIOMAS_EN
  return (
    <footer className="pie-en">
      <div className="pie-en-in">
        <div className="pie-en-cabeza">
          <Link to="/en/" className="pie-en-marca" aria-label="Tony Kansai Guide, home"><Logo /></Link>
          <p className="pie-en-lema">{p.pie.lema}</p>
          <p className="pie-en-contacto">
            <a href={ARBOL.whatsapp.href} target="_blank" rel="noopener noreferrer"><IconoWa /> WhatsApp</a>
            <a href={`mailto:${ARBOL.correo}`}>{ARBOL.correo}</a>
          </p>
        </div>
        <nav className="pie-en-primeros" aria-label="Main">
          {ARBOL.primeros.map((e) => <EnlacePieEn key={e.ruta} e={e} />)}
        </nav>
        <div className="pie-en-cols" ref={cols}>
          {ARBOL.ramas.map((r) => {
            // The highlighted link (hiking) always on view.
            const orden = [...r.enlaces.filter((e) => e.destacado), ...r.enlaces.filter((e) => !e.destacado)]
            const vis = orden.slice(0, VISIBLES), resto = orden.slice(VISIBLES)
            return (
              <details key={r.id} className="pie-en-col" open>
                <summary>{r.titulo}</summary>
                <ul>{vis.map((e) => <li key={e.ruta}><EnlacePieEn e={e} /></li>)}</ul>
                {resto.length > 0 && (
                  <details className="pie-en-mas">
                    <summary>See all ({r.enlaces.length})</summary>
                    <ul>{resto.map((e) => <li key={e.ruta}><EnlacePieEn e={e} /></li>)}</ul>
                  </details>
                )}
              </details>
            )
          })}
        </div>
        <div className="pie-en-base">
          <nav className="pie-en-idiomas" aria-label={ARBOL.otrosIdiomas}>
            {otras.map((o) => <a key={o.ruta} href={o.ruta} lang={o.lang} dir={o.lang === 'ar' ? 'rtl' : undefined}>{o.texto}</a>)}
          </nav>
          <nav className="pie-en-legal" aria-label={p.pie.legal}>
            {ARBOL.legal.map((e) => <Link key={e.ruta} to={e.ruta}>{e.texto}</Link>)}
          </nav>
          <details className="pie-en-creditos">
            <summary>{p.pie.creditos}</summary>
            <ul dir="ltr">
              {extra.map((c) => <li key={c.url}>{c.foto}: <a href={c.url} target="_blank" rel="noopener noreferrer">{c.autor}</a>{c.licencia && `, ${c.licencia}`}</li>)}
              {CREDITOS.map((c) => (
                <li key={c.url}>{(c.tr as Record<string, string> | undefined)?.en ?? c.foto}: <a href={c.url} target="_blank" rel="noopener noreferrer">{c.autor}</a>, {c.licencia}</li>
              ))}
              {CREDITOS_SONIDO.map((c) => (
                <li key={c.url}>Sound “{c.sonido}”: <a href={c.url} target="_blank" rel="noopener noreferrer">{c.autor}</a>, {c.licencia} (Wikimedia Commons)</li>
              ))}
            </ul>
          </details>
          <span className="pie-en-copy">© Tony Kansai Guide</span>
        </div>
      </div>
    </footer>
  )
}
