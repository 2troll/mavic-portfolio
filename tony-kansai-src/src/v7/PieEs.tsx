// Pie común de las páginas en español (Tony, 25-11-2026: «al final de todas las
// páginas, el mismo formato»). Sacado de PaginaGuia.tsx para que lo usen todas
// las páginas React en español; los generadores estáticos llevan su copia en
// HTML (scripts/pie-es.mjs). PieColumna y Creditos los usa también el pie de
// /en/, /ar/ y /ru/ en PaginaGuia.
import { Children, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CREDITOS } from './contenido'
import type { Pagina } from './contenido'
import { CREDITOS_SONIDO } from './sonido'
import { Logo } from './Logo'
import { RESPUESTAS_PROPIAS } from './datosRespuestas'
import { HERRAMIENTAS } from './KitGuia'
import { RUTA_INVIERNO } from './datosInvierno'
import { CIUDADES, CIUDADES_TONY } from '../v8/ciudades'
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
/** Pie de la portada española (Tony, 24-11-2026: «la parte de abajo está
 *  sobrecargada»). Sustituye al índice «Todo lo que tenemos» (chips) y a las seis
 *  columnas del pie, que repetían muchos enlaces: UN solo índice en cuatro grupos,
 *  sin repetidos, y debajo, en pequeño, los idiomas, lo legal y los créditos.
 *  Todos los enlaces de antes siguen en el HTML pregenerado (Google y las IAs):
 *  los acordeones van abiertos en el HTML y PieColumna los cierra en el móvil.
 *  EN/AR/RU conservan su pie de siempre. */
interface EnlacePie { texto: string; ruta: string; app?: boolean; nuevo?: boolean; fuera?: boolean }
interface GrupoPie { titulo: string; clase?: string; enlaces: EnlacePie[] }
/** Las páginas de respuesta tienen por título una pregunta larga: en el índice, corto. */
const RESPUESTA_CORTA: Record<string, string> = {
  '/es/guia-espanol-kansai/': 'Guía en español en Kansai: servicios y precios',
  '/es/tour-privado-o-en-grupo-japon/': '¿Tour privado o en grupo en Japón?',
  '/es/guia-espanol-arabe-japon/': 'Guía en español y árabe en Japón',
}
function gruposPieEs(p: Pagina): GrupoPie[] {
  const respuestas = RESPUESTAS_PROPIAS.filter(([, r]) => r.lang === 'es').map(([, r]) => r)
  const grupos: GrupoPie[] = [
    { titulo: 'Viajes y excursiones', clase: 'pie-es-dos', enlaces: [
      ...CIUDADES_TONY.map((c) => ({ texto: CIUDADES[c].nombre.es, ruta: `${p.ruta}${c}/`, app: true })),
      { texto: 'Excursión a Nara desde Osaka', ruta: '/es/excursion-nara-desde-osaka/', app: true },
      { texto: 'Hiroshima y Miyajima en un día', ruta: '/es/excursion-hiroshima-miyajima-desde-osaka/', app: true },
      { texto: 'Kioto en 2 horas', ruta: '/es/guia-privado-kioto-2-horas/', app: true },
      { texto: 'Kioto en bici', ruta: '/es/tour-privado-bici-kioto/', app: true },
      { texto: 'Tokio, el Fuji y más: rutas', ruta: '/es/rutas/', app: true },
      { texto: 'Montaña', ruta: '/es/montana/', app: true },
      { texto: 'Todos los destinos', ruta: '/es/destinos/' },
    ] },
    { titulo: 'Temporadas', enlaces: [
      { texto: 'Invierno en Kansai', ruta: RUTA_INVIERNO.es, nuevo: true },
      { texto: 'Otoño en Kioto', ruta: '/es/otono-kioto/', app: true },
      { texto: 'Sakura en Kioto', ruta: '/es/sakura-kioto/', app: true },
    ] },
    { titulo: 'Para tu viaje', enlaces: [
      ...(p.mercado.enlaces ?? []).map((e) => ({ texto: e.texto, ruta: e.ruta, app: true })),
      { texto: 'Aeropuerto de Kansai', ruta: '/es/aeropuerto-kansai/' },
      { texto: 'Ventajas y descuentos', ruta: '/es/ventajas/', app: true },
      { texto: 'Herramientas gratis', ruta: HERRAMIENTAS.es.hub },
      { texto: '¿Te compensa un guía? Calculadora', ruta: '/es/calculadora-guia/' },
      { texto: 'Leyendas y lugares perdidos', ruta: '/es/leyendas/' },
      { texto: 'Japón de TikTok · precio especial', ruta: '/tiktok/' },
      { texto: 'Mapa de Yuru Camp△ (anime)', ruta: 'https://2troll.github.io/yurucamp-mapa/guia/' },
    ] },
    { titulo: 'Sobre nosotros', enlaces: [
      ...respuestas.map((r) => ({ texto: RESPUESTA_CORTA[r.ruta] ?? r.titulo, ruta: r.ruta, app: true })),
      { texto: 'Agencias · Hanma Travel Partners', ruta: '/partners/' },
      { texto: 'Agencias · Pide presupuesto de guía', ruta: 'https://forms.fillout.com/t/3Pq2Nob6Wkus', fuera: true },
      { texto: 'Tony Kansai Guide es una empresa de HBH Group', ruta: 'https://hbh.tonykansaiguide.com/es/' },
    ] },
  ]
  // Lo que ya salió en un grupo anterior no se repite (las respuestas de Kioto,
  // Nara e Hiroshima ya están en «Viajes y excursiones»). Ningún enlace se pierde.
  const visto = new Set<string>()
  for (const g of grupos) g.enlaces = g.enlaces.filter((e) => !visto.has(e.ruta) && !!visto.add(e.ruta))
  // Destinos extra del pie de siempre que no estén ya: al final del primer grupo.
  for (const d of DESTINOS_EXTRA.es) if (!visto.has(d.ruta)) { visto.add(d.ruta); grupos[0].enlaces.push({ texto: d.texto, ruta: d.ruta, app: !d.estatica }) }
  return grupos
}

function EnlacePieEs({ e }: { e: EnlacePie }) {
  const dentro = <>{e.texto}{e.nuevo && <small className="pie-es-nuevo">nuevo</small>}</>
  if (e.app) return <Link to={e.ruta}>{dentro}</Link>
  return e.fuera ? <a href={e.ruta} target="_blank" rel="noopener">{dentro}</a> : <a href={e.ruta}>{dentro}</a>
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

export function PieEs({ p }: { p: Pagina }) {
  return (
    <footer className="v7-pie v7-pie-es">
      <div className="pie-es-cabeza">
        <strong><Logo /></strong>
        <p>{p.pie.lema}</p>
      </div>
      <div className="pie-es-indice">
        {gruposPieEs(p).map((g) => (
          <PieColumna key={g.titulo} lang="es" titulo={g.titulo} todos clase={g.clase}>
            {g.enlaces.map((e) => <EnlacePieEs key={e.ruta} e={e} />)}
          </PieColumna>
        ))}
      </div>
      <div className="pie-es-base">
        {/* Un solo enlace: la página de inglés y árabe (estática, public/international/). */}
        <nav className="pie-es-idiomas" aria-label={p.pie.otrosIdiomas}>
          <a href="/international/" lang="en">English · <span lang="ar" dir="rtl">العربية</span></a>
        </nav>
        <div className="pie-es-legal">
          <nav aria-label={p.pie.legal}>
            <Link to="/legal/?lang=es">{p.pie.legal}</Link>
            <Link to="/privacy/?lang=es">{p.pie.privacidad}</Link>
            <Link to="/terms/?lang=es">{p.pie.condiciones}</Link>
            <Link to="/cookies/?lang=es">{p.pie.cookies}</Link>
          </nav>
          <Creditos p={p} />
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

