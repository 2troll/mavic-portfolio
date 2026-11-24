// Pie común de las páginas en español (Tony, 25-11-2026: «al final de todas las
// páginas, el mismo formato»). Lo básico: marca y lema, las cuatro ramas del
// árbol de la web (arbolEs.ts, las mismas del menú ☰) en columnas cortas —en el
// móvil, acordeones—, idioma, lo legal y los créditos. Los generadores estáticos
// pintan el mismo pie en HTML (scripts/pie-es.mjs) con el mismo CSS (pie-es.css).
// PieColumna, Creditos y DESTINOS_EXTRA los usa también el pie de /en/, /ar/ y
// /ru/ en PaginaGuia: no cambian.
import { Children, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CREDITOS } from './contenido'
import type { Pagina } from './contenido'
import { CREDITOS_SONIDO } from './sonido'
import { Logo } from './Logo'
import { IconoWa } from './IconoWa'
import { arbolEs } from './arbolEs'
import type { EnlaceArbol } from './arbolEs'
import './pie-es.css'

/** Columna «Destinos» del pie (troncal), tras las 7 ciudades: lo que no es una
 *  ciudad de Kansai. Rutas existentes (App.tsx, datosOtono, datosTemporadas). */
export const DESTINOS_EXTRA: Record<string, { texto: string; ruta: string; estatica?: boolean }[]> = {
  es: [
    { texto: 'Tokio, el Fuji y más: rutas hora a hora', ruta: '/es/rutas/' },
    { texto: 'Montaña', ruta: '/es/montana/' },
    { texto: 'Otoño en Kioto', ruta: '/es/otono-kioto/' },
    { texto: 'Sakura en Kioto', ruta: '/es/sakura-kioto/' },
    { texto: 'Todos los destinos', ruta: '/es/destinos/', estatica: true },
  ],
  en: [
    { texto: 'Tokyo, Fuji and more: hour-by-hour routes', ruta: '/en/routes/' },
    { texto: 'Hiking', ruta: '/en/hiking/' },
    { texto: 'Autumn in Kyoto', ruta: '/en/kyoto-autumn/' },
    { texto: 'Cherry blossom in Kyoto', ruta: '/en/kyoto-cherry-blossom/' },
    { texto: 'All destinations', ruta: '/en/destinations/', estatica: true },
  ],
  ar: [
    { texto: 'طوكيو وفوجي وغيرهما: المسارات ساعة بساعة', ruta: '/ar/routes/' },
    { texto: 'الجبال', ruta: '/ar/hiking/' },
    { texto: 'الخريف في كيوتو', ruta: '/ar/kyoto-autumn/' },
    { texto: 'أزهار الكرز في كيوتو', ruta: '/ar/kyoto-cherry-blossom/' },
    { texto: 'كل الوجهات', ruta: '/ar/destinations/', estatica: true },
  ],
}
export function Creditos({ p }: { p: Pagina }) {
  return (
    <details className="v7-creditos">
      <summary>{p.pie.creditos}</summary>
      <ul dir="ltr">
        {CREDITOS.map((c) => (
          <li key={c.url}>{(c.tr as Record<string, string> | undefined)?.[p.lang] ?? c.foto}: <a href={c.url} target="_blank" rel="noopener noreferrer">{c.autor}</a>, {c.licencia}</li>
        ))}
        {CREDITOS_SONIDO.map((c) => (
          <li key={c.url}>Sonido «{c.sonido}»: <a href={c.url} target="_blank" rel="noopener noreferrer">{c.autor}</a>, {c.licencia} (Wikimedia Commons)</li>
        ))}
      </ul>
    </details>
  )
}

/** Enlaces a la vista en cada columna; el resto, en «Ver todo (N)» (en el HTML). */
const VISIBLES = 6
const ARBOL = arbolEs()

function EnlacePieEs({ e }: { e: EnlaceArbol }) {
  const dentro = <>{e.texto}{e.nuevo && <small className="pie-es-nuevo">nuevo</small>}</>
  if (e.fuera) return <a href={e.ruta} target="_blank" rel="noopener">{dentro}</a>
  if (e.app) return <Link to={e.ruta}>{dentro}</Link>
  return <a href={e.ruta}>{dentro}</a>
}

/** Créditos de una foto de la página (además de los comunes de CREDITOS). */
export interface CreditoPie { foto: string; autor: string; licencia?: string; url: string }

/**
 * p: PAGINAS.es (lema y rótulos del pie).
 * creditos: las fotos propias de esta página, que se suman a las comunes.
 * idiomas: esta misma página en inglés y árabe; si no hay, /international/.
 */
export function PieEs({ p, creditos, idiomas }: { p: Pagina; creditos?: CreditoPie[]; idiomas?: { lang: string; ruta: string; texto: string }[] }) {
  const cols = useRef<HTMLDivElement>(null)
  // En el móvil, acordeones cerrados al montar (en el HTML van abiertos: Google).
  useEffect(() => {
    if (!cols.current || !window.matchMedia('(max-width: 720px)').matches) return
    cols.current.querySelectorAll<HTMLDetailsElement>(':scope > details').forEach((d) => { d.open = false })
  }, [])
  const extra = (creditos ?? []).filter((c) => !CREDITOS.some((x) => x.url === c.url))
  return (
    <footer className="pie-es">
      <div className="pie-es-in">
        <div className="pie-es-cabeza">
          <Link to="/es/" className="pie-es-marca" aria-label="Tony Kansai Guide, inicio"><Logo /></Link>
          <p className="pie-es-lema">{p.pie.lema}</p>
          <p className="pie-es-contacto">
            <a href={ARBOL.whatsapp.href} target="_blank" rel="noopener noreferrer"><IconoWa /> WhatsApp</a>
            <a href={`mailto:${ARBOL.correo}`}>{ARBOL.correo}</a>
          </p>
        </div>
        <nav className="pie-es-primeros" aria-label="Lo principal">
          {ARBOL.primeros.map((e) => <EnlacePieEs key={e.ruta} e={e} />)}
        </nav>
        <div className="pie-es-cols" ref={cols}>
          {ARBOL.ramas.map((r) => {
            // Lo destacado (la montaña) siempre a la vista, aunque en el menú vaya tras las ciudades.
            const orden = [...r.enlaces.filter((e) => e.destacado), ...r.enlaces.filter((e) => !e.destacado)]
            const vis = orden.slice(0, VISIBLES), resto = orden.slice(VISIBLES)
            return (
              <details key={r.id} className="pie-es-col" open>
                <summary>{r.titulo}</summary>
                <ul>{vis.map((e) => <li key={e.ruta}><EnlacePieEs e={e} /></li>)}</ul>
                {resto.length > 0 && (
                  <details className="pie-es-mas">
                    <summary>Ver todo ({r.enlaces.length})</summary>
                    <ul>{resto.map((e) => <li key={e.ruta}><EnlacePieEs e={e} /></li>)}</ul>
                  </details>
                )}
              </details>
            )
          })}
        </div>
        <div className="pie-es-base">
          <nav className="pie-es-idiomas" aria-label={ARBOL.otrosIdiomas}>
            {idiomas?.length
              ? idiomas.map((o) => <a key={o.ruta} href={o.ruta} lang={o.lang} dir={o.lang === 'ar' ? 'rtl' : undefined}>{o.texto}</a>)
              : <a href="/international/" lang="en">English · <span lang="ar" dir="rtl">العربية</span></a>}
          </nav>
          <nav className="pie-es-legal" aria-label={p.pie.legal}>
            {ARBOL.legal.map((e) => <Link key={e.ruta} to={e.ruta}>{e.texto}</Link>)}
          </nav>
          <details className="pie-es-creditos">
            <summary>{p.pie.creditos}</summary>
            <ul dir="ltr">
              {extra.map((c) => <li key={c.url}>{c.foto}: <a href={c.url} target="_blank" rel="noopener noreferrer">{c.autor}</a>{c.licencia && `, ${c.licencia}`}</li>)}
              {CREDITOS.map((c) => (
                <li key={c.url}>{(c.tr as Record<string, string> | undefined)?.es ?? c.foto}: <a href={c.url} target="_blank" rel="noopener noreferrer">{c.autor}</a>, {c.licencia}</li>
              ))}
              {CREDITOS_SONIDO.map((c) => (
                <li key={c.url}>Sonido «{c.sonido}»: <a href={c.url} target="_blank" rel="noopener noreferrer">{c.autor}</a>, {c.licencia} (Wikimedia Commons)</li>
              ))}
            </ul>
          </details>
          <span className="pie-es-copy">© Tony Kansai Guide</span>
        </div>
      </div>
    </footer>
  )
}

/** Columna del pie: título + hasta 6 enlaces a la vista; el resto en «Ver todo (N)».
 *  Abierta en el HTML; en el móvil se pliega al montar (acordeón). */
const VER_TODO: Record<string, string> = { es: 'Ver todo', en: 'See all', ar: 'عرض الكل', ru: 'Показать все' }
export function PieColumna({ titulo, lang, children, todos, clase }: { titulo: string; lang: string; children: ReactNode; todos?: boolean; clase?: string }) {
  const ref = useRef<HTMLDetailsElement>(null)
  useEffect(() => { if (ref.current && window.matchMedia('(max-width: 720px)').matches) ref.current.open = false }, [])
  const hijos = Children.toArray(children)
  // «todos» (pie español): sin «Ver todo», la lista entera a la vista al abrir.
  const vis = todos ? hijos : hijos.slice(0, 6), resto = todos ? [] : hijos.slice(6)
  return (
    <details className={clase ? `v7-pie-col ${clase}` : 'v7-pie-col'} open ref={ref}>
      <summary className="v7-pie-titulo">{titulo}</summary>
      <nav aria-label={titulo}>
        {vis}
        {resto.length > 0 && (
          <details className="v7-pie-mas">
            <summary>{VER_TODO[lang] ?? VER_TODO.en} ({hijos.length})</summary>
            <div>{resto}</div>
          </details>
        )}
      </nav>
    </details>
  )
}

