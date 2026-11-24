// Página de un idioma: un público, un guía, todo en una sola página.
//
// Páginas de Tony (/es/, /en/, /ar/): portada «troncal» desde el 21-11-2026
// (encargo de Antonio: rediseno-movil/BRIEF.md y plan-contenido.md). Unas 5-6
// pantallas de móvil: portada → tres experiencias → un precio de referencia →
// reseñas → preguntas plegadas → contacto con WhatsApp primero → pie. Todo lo
// demás (ciudades, tarifas, planes, ventajas, herramientas…) sigue en sus
// páginas, a dos clics. Los datos para Google y las IAs no cambian: Helmet,
// JSON-LD, la ficha rápida y las 11 preguntas siguen en el HTML (plegadas).
//
// Páginas de Larion (/ru/, /larion/): la página larga de siempre, sin cambios:
// qué es → cómo funciona → quién → dónde → cuánto → de dónde vienes →
// preguntas → escribir.

import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Children } from 'react'
import type { ReactNode, RefObject } from 'react'
import { Link } from 'react-router-dom'
import { APPS } from './datosVentajas'
import { FranjaVentajas } from './FranjaVentajas'
import { PlanesVenta } from './PlanesVenta'
import { LOGOS } from './logosMarcas'
import { Helmet } from 'react-helmet-async'
import { Mosaico } from '../v8/Mosaico'
import { LibroSellos } from '../v9/Sellos'
import { PAGINAS, HERMANAS, GUIAS, NOMBRE_GUIA, CREDITOS, CORREO, PAYPAL_TONY, PAGAR, enlaceGuia, contactoLd, TG_LARION_URL, TG_LARION_VISIBLE, TG_TONY, WA_LARION_URL, WA_LARION_VISIBLE, NOTA_TG } from './contenido'
import type { PaginaId, Pagina, DatosContacto } from './contenido'
import { useLanguage } from '../contexts/LanguageContext'
import { foto } from './foto'
import { CREDITOS_SONIDO } from './sonido'
import { Logo } from './Logo'
import { CabeceraEs } from './CabeceraEs'
import './marca-es.css'
import { PieEs, PieColumna, Creditos, DESTINOS_EXTRA } from './PieEs'
import { useCambio } from './cambio'
import './v7.css'
import './estilo-pixel.css'
import { IconoCanal } from './IconoWa'
import './figuras.css'
// Lo que les falta a las piezas de la portada troncal (después de la hoja de estilo general).
import './portada.css'
import './resenas-es.css'
import './pie-es.css'
import { Experiencias } from './Experiencias'
import { useAparicion } from './aparicion'
import { HistoriaManga } from '../v8/HistoriaManga'
import { DIA, HISTORIA_LISTA, ROTULOS } from '../v8/historia'
import { PRECIO } from './datosRutas'
import { listaTours } from '../v8/seoTours'
import { CIUDADES, CIUDADES_LARION, CIUDADES_TONY } from '../v8/ciudades'
import type { Lengua } from '../v8/ciudades'
import resenasTony from '../../public/reviews.json'
// Miniaturas webp locales de las fotos de reseñas (scripts/miniaturas-resenas.mjs, a mano).
import MINIS_RESENAS from './resenas-min.json'
import { CuandoCerca } from './CuandoCerca'
import { MiraDentro } from '../v8/MiraDentro'
import { Oracion } from '../v8/Oracion'
import { visible } from './vozEmpresa'
import { FAQ_LD_PORTADA } from './faqLdPortada'
import { planesLD, type LangPlan } from './datosPlanes'
import { useBilletes } from './Cocina'
import './kndr-vip.css'
const KndrVip = lazy(() => import('./KndrVip'))
import { enlacesHreflang } from '../seo/hreflang'
import { RESPUESTAS_PROPIAS } from './datosRespuestas'
import { PRECIO_CORTO } from './datosRespuestasNuevas'
import { yenLocal } from './formato'
import { viajesToursNuevos } from './ToursNuevos'
import { HERRAMIENTAS, esLenguaKit } from './KitGuia'
import { toursInvierno, TXT_INVIERNO, RUTA_INVIERNO, VENTANAS, temporadasActivas, yenesDesde, variosPrecios, horasTexto } from './datosInvierno'
// Cifras de invierno: única fuente en datosTemporadas.ts (vía datosOtono, que App.tsx ya carga).
import { PRECIO_INVIERNO } from './datosOtono'
const TOURS_INVIERNO = toursInvierno(PRECIO_INVIERNO)
import type { LangInvierno, Temporada, TourInvierno } from './datosInvierno'

/** Añade al final de la lista de tours de Tony el de 2 h y el de bici por Kioto. */
function conToursNuevos(lista: ReturnType<typeof listaTours>, p: { guia: string; lang: string }) {
  if (p.guia !== 'tony') return lista
  const extra = viajesToursNuevos(p.lang).map((item, i) => ({ '@type': 'ListItem', position: lista.itemListElement.length + i + 1, item }))
  return { ...lista, itemListElement: [...lista.itemListElement, ...extra] }
}

// El 3D (three.js) llega después de pintar la foto de portada.

const BASE = 'https://tonykansaiguide.com'
// sizes de la foto de portada (igual en scripts/rutas-estaticas.mjs, que la
// precarga). En el móvil declara menos ancho del que ocupa: con pantallas x3
// el navegador bajaba la de 1800 px (≈250 KB) para un panel de 390 px; con 70vw
// elige la de 900 (x3) o la de 600 (x2), y se sigue viendo nítida.
export const SIZES_PORTADA = '(max-width: 900px) 70vw, 50vw'
/** Troncal (/es/, /en/, /ar/) en escritorio: recorte vertical 4:5 que ocupa media
 *  pantalla (igual en scripts/rutas-estaticas.mjs, que lo precarga). */
export const SIZES_PORTADA_ESCRITORIO = '50vw'

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

// ── Utilidades ───────────────────────────────────────────────────────────────

/** Número legible según el país: España +34 634 193 106; Japón +81 XX XXXX XXXX. */
function telefono(n: string) {
  return n.startsWith('34') ? `+34 ${n.slice(2, 5)} ${n.slice(5, 8)} ${n.slice(8)}` : `+${n.slice(0, 2)} ${n.slice(2, 4)} ${n.slice(4, 8)} ${n.slice(8)}`
}

/** Canal visible del guía: «Telegram» para Larion, «WhatsApp» para el resto. */
const canal = (p: Pagina) => (GUIAS[p.guia].tg ? 'Telegram' : 'WhatsApp')
/** Nota para que no despiste el perfil de Telegram (es de Tony, que coordina a Larion). */
const notaTg = (p: Pagina) => (GUIAS[p.guia].tg ? NOTA_TG[p.lang === 'ru' ? 'ru' : 'en'] : '')

const VACIO: DatosContacto = { nombre: '', pais: '', ciudad: '', fechas: '', personas: '', hotel: '', intereses: [], notas: '' }

/** Tipos de cambio del día (open.er-api.com: gratis, sin clave, CORS abierto).
 *  Si falla, no se enseña nada: el precio en yenes es el que vale. */
/** Hora actual, sólo en el navegador: la página llega ya pintada desde el
 *  build y una hora del servidor no coincidiría al hidratar. Antes: null. */
function useAhora(cadaMs = 20000) {
  const [ahora, setAhora] = useState<Date | null>(null)
  useEffect(() => {
    setAhora(new Date())
    const id = window.setInterval(() => setAhora(new Date()), cadaMs)
    return () => window.clearInterval(id)
  }, [cadaMs])
  return ahora
}

interface Resena { id: string; stars: number; name: string; country: string; tour: string; text: string; photo?: string; photoFull?: string; date: string
  lang?: string; traducciones?: Record<string, string>
  /** Nombre, procedencia y lugar ya escritos en otro idioma (las de Larion, en inglés). */
  meta?: Record<string, { name: string; country: string; tour: string }> }

// 21-11-2026 (crítica de diseño): fuera los 250 avatares de 24 familias distintas
// (teteras, caricaturas, mosaicos de píxeles: cada tarjeta parecía de otra web) y
// las banderas emoji. Ahora todas llevan la inicial del nombre en un círculo
// sakura, igual para todos, y la procedencia en texto.
function Inicial({ nombre }: { nombre: string }) {
  return <span className="v7-resena-inicial" aria-hidden="true">{[...nombre.trim()][0]?.toUpperCase() ?? '·'}</span>
}

/** Idioma real del texto. reviews.json marca algunas en inglés como «es» y la
 *  portada española abría con una reseña en inglés: se mira el propio texto. */
function idiomaTexto(t: string): string {
  if (/[\u0600-\u06FF]/.test(t)) return 'ar'
  if (/[а-яё]/i.test(t)) return 'ru'
  const es = (t.match(/\b(el|la|los|las|que|muy|con|por|para|nos|gracias|fue|una|del|todo|tour)\b|[ñ¿¡áéíóú]/gi) ?? []).length
  const en = (t.match(/\b(the|and|was|we|with|our|for|you|very|had|day|it)\b/gi) ?? []).length
  return en > es ? 'en' : 'es'
}
/** El texto que se pinta en una página: su traducción si la hay, si no el original. */
const textoEn = (r: Resena, lang: string) => r.traducciones?.[lang] ?? r.text
/** Lugar de la reseña en el idioma de la página (en /ar/ salía «KIOTO» en español). */
const LUGARES: Record<string, Record<string, string>> = {
  Kioto: { en: 'Kyoto', ar: 'كيوتو', ru: 'Киото' }, Osaka: { en: 'Osaka', ar: 'أوساكا', ru: 'Осака' },
  Nara: { en: 'Nara', ar: 'نارا', ru: 'Нара' }, Kobe: { en: 'Kobe', ar: 'كوبي', ru: 'Кобе' },
  Himeji: { en: 'Himeji', ar: 'هيميجي', ru: 'Химэдзи' }, Hiroshima: { en: 'Hiroshima', ar: 'هيروشيما', ru: 'Хиросима' },
}
function lugarEn(lugar: string | undefined, lang: string, yaTraducido: boolean): string {
  if (!lugar) return ''
  if (yaTraducido || lang === 'es') return lugar
  return LUGARES[lugar]?.[lang] ?? ''
}
const FOTO_DE: Record<string, string> = { es: 'Foto de la reseña de', en: 'Photo from the review by', ar: 'صورة من تقييم', ru: 'Фото из отзыва:' }
/** Si la foto de una reseña no carga (/api/resenas/fotopub caído), fuera el
 *  hueco: un recuadro con el icono de imagen rota parecía la web rota. */
function quitaFoto(img: HTMLImageElement) {
  img.closest('figure')?.classList.remove('v7-resena-con-foto')
  img.closest('a')?.remove()
}
function sinFoto(e: { currentTarget: HTMLImageElement }) { quitaFoto(e.currentTarget) }
/** Las fotos que fallaron ANTES de hidratar (vienen en el HTML pregenerado y el
 *  navegador las pide antes de que React escuche su «error»): se revisan al montar. */
function useFotosRotas(dep: unknown) {
  useEffect(() => {
    document.querySelectorAll<HTMLImageElement>('.v7-resenas img').forEach((img) => {
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) quitaFoto(img)
    })
  }, [dep])
}
// Enlace a la página de ventajas (apps y descuentos para el viajero). Larion lleva
// la versión rusa (/ru/perks/) y su página inglesa la de Tony en inglés.
const VENTAJAS: Record<string, { ruta: string; corto: string; titulo: string; sub: string }> = {
  es: { ruta: '/es/ventajas/', corto: 'Ventajas', titulo: 'Ventajas para tu viaje', sub: 'eSIM con descuento, entradas, traslados y más' },
  en: { ruta: '/en/perks/', corto: 'Perks', titulo: 'Travel perks', sub: 'Discounted eSIM, tickets, transfers and more' },
  ar: { ruta: '/ar/perks/', corto: 'مزايا', titulo: 'مزايا لرحلتك', sub: 'eSIM بخصم وتذاكر وتوصيل من المطار والمزيد' },
  ru: { ruta: '/ru/perks/', corto: 'Полезное', titulo: 'Полезное для поездки', sub: 'eSIM со скидкой, билеты, трансфер и другое' },
  larion: { ruta: '/en/perks/', corto: 'Perks', titulo: 'Travel perks', sub: 'Discounted eSIM, tickets, transfers and more' },
}
// Cuatro apps de muestra en el botón, como iconos de móvil apilados.
const MUESTRA_APPS = ['airalo', 'klook', 'welcome', 'luup'].map((c) => APPS.find((a) => a.clave === c)).filter(Boolean) as typeof APPS
const TODAS: Record<string, string> = { es: 'Todas', en: 'All', ar: 'الكل', ru: 'Все' }

// Las reseñas se escriben en el idioma del cliente; en cada página se enseña la
// traducción a ese idioma (si existe) y un enlace para ver el original, para no
// hacer pasar una traducción por las palabras del cliente.
const TRADUCIDA: Record<string, { de: string; original: string; ver: string }> = {
  es: { de: 'Traducida del', original: 'Ver original', ver: 'Ver traducción' },
  en: { de: 'Translated from', original: 'See original', ver: 'See translation' },
  ar: { de: 'مترجمة من', original: 'عرض النص الأصلي', ver: 'عرض الترجمة' },
  ru: { de: 'Переведено с', original: 'Показать оригинал', ver: 'Показать перевод' },
}
const NOMBRE_IDIOMA: Record<string, Record<string, string>> = {
  es: { es: 'español', en: 'inglés', ar: 'árabe', ru: 'ruso' },
  en: { es: 'Spanish', en: 'English', ar: 'Arabic', ru: 'Russian' },
  ar: { es: 'الإسبانية', en: 'الإنجليزية', ar: 'العربية', ru: 'الروسية' },
  ru: { es: 'испанского', en: 'английского', ar: 'арабского', ru: 'русского' },
}

function TextoResena({ r, lang }: { r: Resena; lang: string }) {
  const [original, setOriginal] = useState(false)
  const deIdioma = r.lang ?? 'es'
  const traducida = deIdioma !== lang ? r.traducciones?.[lang] : undefined
  if (!traducida) return <blockquote lang={deIdioma} dir={deIdioma === 'ar' ? 'rtl' : 'ltr'}>{r.text}</blockquote>
  const t = TRADUCIDA[lang] ?? TRADUCIDA.en
  const mostrar = original ? r.text : traducida
  const idiomaMostrado = original ? deIdioma : lang
  return (
    <>
      <blockquote lang={idiomaMostrado} dir={idiomaMostrado === 'ar' ? 'rtl' : 'ltr'}>{mostrar}</blockquote>
      <p className="v7-resena-traducida">
        {t.de} {NOMBRE_IDIOMA[lang]?.[deIdioma] ?? deIdioma} ·{' '}
        <button type="button" onClick={() => setOriginal(!original)}>{original ? t.ver : t.original}</button>
      </p>
    </>
  )
}

/** Columnas de las reseñas de Larion (su diseño de antes, en columnas sueltas).
 *  Se reparten a mano y no con `columns` de CSS: Safari no pintaba la 2.ª y 3.ª columna. */
function useColumnas() {
  const cuantas = () => (typeof window === 'undefined' ? 3 : window.innerWidth >= 1000 ? 3 : window.innerWidth >= 680 ? 2 : 1)
  const [n, setN] = useState(cuantas)
  useEffect(() => {
    const mira = () => setN(cuantas())
    window.addEventListener('resize', mira)
    return () => window.removeEventListener('resize', mira)
  }, [])
  return n
}
/** Reparte en orden de lectura: la 1.ª a la columna 1, la 2.ª a la 2… */
function repartir<T>(lista: T[], n: number): T[][] {
  const cols: T[][] = Array.from({ length: n }, () => [])
  lista.forEach((x, i) => cols[i % n].push(x))
  return cols
}
function TarjetaClasica({ r, lang }: { r: Resena; lang: string }) {
  const m = r.meta?.[lang]
  const nombre = m?.name ?? r.name, pais = m?.country ?? r.country, lugar = lugarEn(m?.tour ?? r.tour, lang, !!m)
  return (
    <figure className="tarjeta">
      <div className="v7-resena-cabeza">
        <div className="v7-estrellas" aria-label={`${r.stars}/5`}>{'★'.repeat(r.stars)}<span className="v7-estrellas-vacias">{'★'.repeat(5 - r.stars)}</span></div>
      </div>
      <TextoResena r={r} lang={lang} />
      <figcaption>
        <Inicial nombre={nombre} />
        <span><strong>{nombre}</strong><small>{[lugar, pais].filter(Boolean).join(' · ')}</small></span>
      </figcaption>
      {r.photo && <a href={r.photoFull || (r.photo.startsWith('/') ? r.photo : `/${r.photo}`)} target="_blank" rel="noopener" aria-label={`${FOTO_DE[lang] ?? FOTO_DE.en} ${nombre}`}><img loading="lazy" src={r.photo.startsWith('/') ? r.photo : `/${r.photo}`} alt="" onError={sinFoto} /></a>}
    </figure>
  )
}

/** Las reseñas de Tony que ya van dentro del build (reviews.json). Se pintan
 *  desde el primer render para que el HTML pregenerado las lleve: un bot sin JS
 *  (o Google comparando con el JSON-LD) las ve, y no «0 reseñas». */
function resenasFijas(): Resena[] {
  return ((resenasTony as unknown as { reviews: Resena[] }).reviews ?? []).filter((r) => r?.text && r.stars)
}

/** Sin foto del cliente, la tarjeta lleva arriba la ciudad en kanji, del mismo
 *  tamaño que una foto: así todas las tarjetas de una fila encajan igual. */
const KANJI_CIUDAD: [RegExp, string][] = [[/kio|kyo|كيو|киот/i, '京都'], [/osa|أوس|осак/i, '大阪'], [/nara|نار|нар/i, '奈良'], [/kob|كوب|кобе/i, '神戸'], [/hime|هيم|химе/i, '姫路'], [/hiro|miya|هير|хиро/i, '広島']]
const kanjiDe = (tour?: string) => KANJI_CIUDAD.find(([re]) => re.test(tour ?? ''))?.[1] ?? '関西'

const MAS_PIE: Record<string, string> = { es: 'Más', en: 'More', ar: 'المزيد', ru: 'Ещё' }
const LEER_MAS: Record<string, [string, string]> = { es: ['Leer más', 'Leer menos'], en: ['Read more', 'Read less'], ar: ['اقرأ المزيد', 'اقرأ أقل'], ru: ['Читать дальше', 'Свернуть'] }

/** Recorta a la vista las reseñas largas para que todas las tarjetas midan
 *  parecido. El texto completo sigue en el HTML (buscadores e IAs lo leen
 *  entero); solo se oculta con CSS hasta pulsar «Leer más». */
function TextoRecortable({ largo, lang, children }: { largo: boolean; lang: string; children: ReactNode }) {
  const [abierto, setAbierto] = useState(false)
  if (!largo) return <>{children}</>
  const [mas, menos] = LEER_MAS[lang] ?? LEER_MAS.en
  return (
    <div className={`v7-resena-recorte${abierto ? ' abierto' : ''}`}>
      {children}
      <button type="button" className="v7-resena-leer" aria-expanded={abierto} onClick={() => setAbierto((a) => !a)}>{abierto ? menos : mas}</button>
    </div>
  )
}

/** /es/: la tarjeta pide la miniatura local (≤ 640 px, ~35 KB) si el script la
 *  generó; si no (foto nueva del Worker), la completa. El enlace sigue a la grande. */
const MINIS = MINIS_RESENAS as Record<string, { src: string; w: number; h: number; mini: string }>
function atributosFotoEs(photo: string) {
  const m = MINIS[photo]
  return { decoding: 'async' as const, fetchpriority: 'low', ...(m ? { src: m.src, width: m.w, height: m.h } : { width: 600, height: 480 }) }
}

/** /es/: fila de fotos de clientes (miniaturas de 160 px, ~7 KB) que lleva a su
 *  reseña dentro de la fila deslizable. Solo las que tienen miniatura local. */
function FotosViajeros({ lista }: { lista: Resena[] }) {
  const conMini = lista.filter((r) => r.photo && MINIS[r.photo]).slice(0, 8)
  if (conMini.length < 4) return null
  const ir = (e: { preventDefault(): void }, id: string) => {
    const t = document.getElementById(`resena-${id}`)
    if (!t) return
    e.preventDefault()
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    t.scrollIntoView({ behavior: quieto ? 'auto' : 'smooth', block: 'nearest', inline: 'start' })
  }
  return (
    <div className="rs-fotos">
      <p className="rs-fotos-titulo">Fotos de nuestros viajeros</p>
      <ul>
        {conMini.map((r) => (
          <li key={r.id}><a href={`#resena-${r.id}`} onClick={(e) => ir(e, r.id)} aria-label={`Ver la reseña de ${r.name}`}>
            <img src={MINIS[r.photo!].mini} alt="" width={160} height={160} loading="lazy" decoding="async" />
          </a></li>
        ))}
      </ul>
    </div>
  )
}

/** Portada española: nota media y número real de reseñas, calculados de la
 *  lista que se pinta (reviews.json + las aprobadas en el Worker), nunca a mano. */
function ResumenResenas({ resenas, lang }: { resenas: Resena[]; lang: string }) {
  const media = resenas.reduce((a, r) => a + r.stars, 0) / resenas.length
  const llenas = Math.round(media)
  const conFoto = resenas.filter((r) => r.photo).length
  return (
    <div className="rs-resumen" role="group" aria-label={`Nota media ${mediaResenas(resenas, lang)} de 5 en ${resenas.length} reseñas`}>
      <p className="rs-nota" aria-hidden="true">
        <strong>{mediaResenas(resenas, lang)}</strong>
        <span className="v7-estrellas">{'★'.repeat(llenas)}<span className="v7-estrellas-vacias">{'★'.repeat(5 - llenas)}</span></span>
      </p>
      <p className="rs-cifras"><b>{resenas.length}</b> reseñas de clientes{conFoto > 0 && <> · <b>{conFoto}</b> con fotos de su viaje</>}</p>
    </div>
  )
}

/** Flechas de la fila de reseñas (/es/): pasan una tarjeta. En el móvil se
 *  desliza con el dedo y con teclado la fila (tabIndex 0) se mueve con las flechas. */
function MandosFila({ fila, total }: { fila: RefObject<HTMLDivElement | null>; total: number }) {
  const mover = (dir: 1 | -1) => {
    const f = fila.current
    const t = f?.querySelector('figure')
    if (!f || !t) return
    const paso = t.getBoundingClientRect().width + parseFloat(getComputedStyle(f).columnGap || '0')
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    f.scrollBy({ left: dir * paso, behavior: quieto ? 'auto' : 'smooth' })
  }
  // La fila mide lo que las tarjetas A LA VISTA, no lo que la más larga: a 360 px,
  // al pasar a una reseña corta quedaba un hueco de ~300 px bajo ella (auditoría 24-11).
  useEffect(() => {
    const f = fila.current
    if (!f || typeof ResizeObserver === 'undefined') return
    let raf = 0
    const ajustar = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const caja = f.getBoundingClientRect()
        let alto = 0
        f.querySelectorAll('figure').forEach((t) => {
          const r = t.getBoundingClientRect()
          if (r.right > caja.left + 1 && r.left < caja.right - 1) alto = Math.max(alto, r.height)
        })
        if (!alto) return
        const cs = getComputedStyle(f)
        const relleno = cs.boxSizing === 'border-box' ? parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) : 0
        f.style.height = `${Math.ceil(alto + relleno)}px`
      })
    }
    const ro = new ResizeObserver(ajustar)
    f.querySelectorAll('figure').forEach((t) => ro.observe(t))
    ro.observe(f)
    f.addEventListener('scroll', ajustar, { passive: true })
    ajustar()
    return () => { cancelAnimationFrame(raf); ro.disconnect(); f.removeEventListener('scroll', ajustar) }
  }, [fila, total])
  return (
    <div className="rs-mandos">
      <span className="rs-pista">Desliza para leer las {total}</span>
      <button type="button" onClick={() => mover(-1)} aria-label="Reseña anterior">←</button>
      <button type="button" onClick={() => mover(1)} aria-label="Reseña siguiente">→</button>
    </div>
  )
}

function useResenas(activas: boolean, fuente?: string) {
  // Larion tiene su propio archivo (`fuente`): ese sigue llegando por petición.
  const [lista, setLista] = useState<Resena[]>(() => (activas && !fuente ? resenasFijas() : []))
  useEffect(() => {
    if (!activas) return
    // Dos fuentes, como resenas.html: las aprobadas desde el móvil (Worker) y las
    // de reviews.json (Mac). Se unen quitando repetidas por id.
    const traer = (u: string) => fetch(u, { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null)).catch(() => null)
    // Larion: su archivo y las que sus clientes mandan desde /ru/otzyv/ (Worker).
    Promise.all(fuente ? [traer('/api/resenas/publicas?guia=larion'), traer(fuente)] : [traer('/api/resenas/publicas'), traer('/reviews.json')]).then((fuentes) => {
      const vistos = new Set<string>()
      const todas: Resena[] = []
      for (const d of fuentes) for (const r of (d?.reviews ?? []) as Resena[]) {
        if (!r?.text || !r.stars || vistos.has(r.id)) continue
        vistos.add(r.id); todas.push(r)
      }
      // La petición solo añade (las aprobadas desde el móvil, o un reviews.json
      // más nuevo); si no contesta nadie, se quedan las del build.
      if (!fuente) for (const r of resenasFijas()) if (!vistos.has(r.id)) { vistos.add(r.id); todas.push(r) }
      if (todas.length) setLista(todas)
    })
  }, [activas, fuente])
  return lista
}

// ── Piezas ───────────────────────────────────────────────────────────────────

/** Qué sección se está leyendo, para marcarla en el menú. */
function useSeccionActiva(ids: string[]) {
  const [activa, setActiva] = useState('')
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver((entradas) => {
      for (const e of entradas) if (e.isIntersecting) setActiva(e.target.id)
    }, { rootMargin: '-45% 0px -50% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids.join()])
  return activa
}

/** Atajos de la portada troncal (cabecera y barra del móvil): las tres
 *  secciones que quedan entre la portada y el contacto. */
const ATAJOS_TRONCAL: Record<string, [string, string, string]> = {
  es: ['Experiencias', 'Precio', 'Reseñas'], en: ['Experiences', 'Price', 'Reviews'], ar: ['التجارب', 'السعر', 'التقييمات'],
}

function Cabecera({ p, troncal }: { p: Pagina; troncal: boolean }) {
  const activa = useSeccionActiva(troncal ? ['experiencias', 'precios', 'resenas', 'contacto'] : ['zona', 'ciudades', 'rutas', 'como', 'precios', 'contacto'])
  const g = GUIAS[p.guia]
  const msg = p.contacto.plantilla(VACIO)
  const [exp, , opiniones] = ATAJOS_TRONCAL[p.lang] ?? ATAJOS_TRONCAL.en
  const anclas: [string, string][] = troncal
    ? [['experiencias', exp], ['precios', p.nav.precios], ['resenas', opiniones]]
    : [['ciudades', p.nav.zona], ['rutas', ({ es: 'Mira dentro', en: 'Step inside', ar: 'ادخل إلى المشهد', ru: 'Загляните внутрь' } as Record<string, string>)[p.lang]], ['como', p.nav.como], ['precios', p.nav.precios]]
  return (
    <header className="v7-cabecera cristal">
      <Link to="/" className="v7-marca" aria-label="Tony Kansai Guide"> <Logo />
      </Link>
      <nav className="v7-anclas" aria-label={p.nav.idioma}>
        {anclas.map(([id, txt]) => (
          <a key={id} href={`#${id}`} aria-current={activa === id ? 'location' : undefined}>{txt}</a>
        ))}
        {/* «Ventajas» como un enlace más: el regalo y la negrita la hacían insignia de relleno (crítica, 21-11). */}
        {VENTAJAS[p.id] && <Link to={VENTAJAS[p.id].ruta} className="v7-ancla-ventajas">{VENTAJAS[p.id].corto}</Link>}
      </nav>
      {/* En español, sin selector (Tony, 25-11-2026: «que el español, que es la mayoría
          de mis clientes, siempre vea la página en español»). El inglés y el árabe
          viven en /international/, enlazada desde el pie. Los hreflang no cambian. */}
      {p.lang !== 'es' && <nav className="v7-idiomas" aria-label={p.nav.idioma}>
        {HERMANAS[p.guia].map((h) => (
          <Link key={h.id} to={PAGINAS[h.id].ruta} lang={PAGINAS[h.id].lang} aria-current={h.id === p.id ? 'page' : undefined}>
            {h.etiqueta}
          </Link>
        ))}
      </nav>}
      <a className={`v7-boton v7-boton-peq${g.tg ? ' v7-tg' : ''}`} href={enlaceGuia(p.guia, msg)} target="_blank" rel="noopener noreferrer" aria-label={`${p.nav.contacto} — ${canal(p)}`}>
        <IconoCanal tg={!!g.tg} /> <span className="v7-solo-ancho">{p.nav.contacto}</span>
      </a>
    </header>
  )
}

function Relojes({ p }: { p: Pagina }) {
  const ahora = useAhora()
  const hora = (tz?: string) => {
    if (!ahora) return '––:––'
    try {
      return new Intl.DateTimeFormat(p.lang === 'ar' ? 'ar-u-nu-latn' : p.lang, { hour: '2-digit', minute: '2-digit', timeZone: tz }).format(ahora)
    } catch { return '' }
  }
  // La zona del visitante sólo se sabe en su navegador (tras hidratar).
  const tzVisitante = ahora ? (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone } catch { return '' } })() : ''
  const yaEsta = p.mercado.relojes.some((r) => r.tz === tzVisitante)
  return (
    <ul className="v7-relojes">
      {p.mercado.relojes.map((r) => (
        <li key={r.tz}><span className="v7-reloj-hora">{hora(r.tz)}</span><span className="v7-reloj-sitio">{r.ciudad}</span></li>
      ))}
      {!yaEsta && tzVisitante && (
        <li className="tuyo"><span className="v7-reloj-hora">{hora()}</span><span className="v7-reloj-sitio">{p.mercado.tuHora}</span></li>
      )}
    </ul>
  )
}

/** El otoño de Kioto (arces rojos): del 1 de octubre al 7 de diciembre, hora de Japón.
 *  Se decide tras montar la página para no chocar con el HTML pregenerado. */
function useEsOtono() {
  const [si, setSi] = useState(false)
  useEffect(() => {
    const [m, d] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo', month: 'numeric', day: 'numeric' })
      .formatToParts(new Date()).filter((x) => x.type !== 'literal').map((x) => Number(x.value))
    setSi(m === 10 || m === 11 || (m === 12 && d <= 7))
  }, [])
  return si
}

/** Temporadas de la portada de Tony (datosInvierno.ts: otoño, invierno, sakura),
 *  en hora de Japón. Tras montar, como useEsOtono: el HTML pregenerado no lleva
 *  fecha. «?fecha=2027-03-20» fuerza otra fecha para revisar la tarjeta (solo
 *  cambia qué aviso se ve; formato estricto AAAA-MM-DD). */
function useTemporadas() {
  const [lista, setLista] = useState<Temporada[]>([])
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('fecha') ?? ''
    const forzada = /^\d{4}-\d{2}-\d{2}$/.test(q) ? new Date(`${q}T12:00:00+09:00`) : null
    setLista(temporadasActivas(forzada && !Number.isNaN(forzada.getTime()) ? forzada : new Date()))
  }, [])
  return lista
}

const esLangInvierno = (l: string): l is LangInvierno => l === 'es' || l === 'en' || l === 'ar'

/** «4–5 h» con las duraciones distintas de un tour (en árabe, con el número aislado). */
function horasTour(t: TourInvierno, lang: LangInvierno) {
  const h = [...new Set(t.opciones.map((o) => o.horas))]
  return horasTexto(h.length > 1 ? `${h.map((x) => x.replace(/ h$/, '')).join('–')} h` : h[0], lang)
}

/** Aviso de temporada de la portada troncal: una tarjeta para la temporada que
 *  toca (la que termina antes) y, si coincide otra, una línea con su enlace.
 *  Invierno: los 4 tours con su precio por grupo, en formato compacto. Enlaces
 *  con <a>: la página de invierno puede ser HTML estático fuera de la SPA. */
function TemporadaPortada({ p }: { p: Pagina }) {
  const lista = useTemporadas()
  const r = p.precioRef
  if (!r || !esLangInvierno(p.lang) || lista.length === 0) return null
  const lang = p.lang
  const flecha = p.dir === 'rtl' ? '←' : '→'
  const txt = TXT_INVIERNO[lang]
  const datos = (t: Temporada): { titulo: string; texto: string; enlace?: { texto: string; ruta: string } } | null => {
    if (t === 'invierno') return { titulo: txt.titulo, texto: txt.entradilla, enlace: { texto: txt.enlace, ruta: RUTA_INVIERNO[lang] } }
    // r.otono empieza por «Otoño en Kioto:», que ya es el titular de la tarjeta.
    if (t === 'otono') {
      const texto = r.otono.replace(/^[^:]+:\s*/, '')
      return p.precios.temporada ? { titulo: p.precios.temporada.titulo, texto: texto.charAt(0).toUpperCase() + texto.slice(1), enlace: p.precios.temporada.enlace } : null
    }
    return r.sakura ? { titulo: r.sakura.titulo, texto: r.sakura.texto, enlace: { texto: r.sakura.enlace, ruta: r.sakura.ruta } } : null
  }
  const [primera, segunda] = lista
  const d = datos(primera)
  if (!d) return null
  const otra = segunda ? datos(segunda) : null
  return (
    <aside className={`v7-temp v7-temp-${primera}`} aria-labelledby="v7-temp-titulo">
      <h3 id="v7-temp-titulo"><span aria-hidden="true">{VENTANAS[primera].emoji}</span> {d.titulo}</h3>
      <p className="v7-temp-texto">{d.texto}</p>
      {primera === 'invierno' && (
        <>
          <ul className="v7-temp-lista">
            {TOURS_INVIERNO.map((t) => (
              <li key={t.id}>
                <span className="v7-temp-nombre">{t.nombre[lang]}</span>
                <span className="v7-temp-precio">
                  {horasTour(t, lang)} · {variosPrecios(t) ? `${txt.desde} ` : ''}<bdi dir="ltr">{yenLocal(yenesDesde(t), lang)}</bdi>
                </span>
              </li>
            ))}
          </ul>
          <p className="v7-temp-nota">{txt.nota}</p>
        </>
      )}
      {d.enlace && <a className="v9-enlace" href={d.enlace.ruta}>{d.enlace.texto} {flecha}</a>}
      {otra?.enlace && (
        <p className="v7-temp-otra"><span aria-hidden="true">{VENTANAS[segunda].emoji}</span> <a href={otra.enlace.ruta}>{otra.enlace.texto} {flecha}</a></p>
      )}
    </aside>
  )
}

/** Ejemplo de fechas en el formulario: noviembre, que es la temporada que vendemos. */
const EJ_FECHAS: Record<string, string> = { es: '18–21 nov.', en: '18–21 Nov', ar: '18–21 نوفمبر', ru: '18–21 нояб.' }

const VER_MAS: Record<string, string> = { es: 'Ver más reseñas', en: 'More reviews', ar: 'المزيد من التقييمات', ru: 'Показать ещё' }
const RESENAS_TXT: Record<string, string> = { es: 'reseñas de clientes', en: 'guest reviews', ar: 'تقييمات من العملاء', ru: 'отзывы гостей' }
const mediaResenas = (l: Resena[], lang: string) =>
  (l.reduce((a, r) => a + r.stars, 0) / l.length).toLocaleString(lang === 'ar' ? 'ar-u-nu-latn' : lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })

const RESERVAR_PLAN: Record<string, string> = { es: 'Reservar por WhatsApp', en: 'Book on WhatsApp', ar: 'احجز عبر واتساب', ru: 'Забронировать в WhatsApp' }
/** Larion: Telegram (t.me no prellena, el plan lo dice el cliente). */
const RESERVAR_PLAN_TG: Record<string, string> = { en: 'Book on Telegram', ru: 'Забронировать в Telegram' }
const PAGO_ADELANTADO: Record<string, string> = { es: 'o paga por adelantado con PayPal', en: 'or pay in advance with PayPal', ar: 'أو ادفع مسبقاً عبر PayPal', ru: 'или оплатить заранее через PayPal' }

// Tour corto de 2 horas en Kioto (precio en datosRespuestasNuevas.ts).
const CORTO_TXT: Record<string, { texto: string; ruta: string }> = {
  es: { texto: `¿Solo un rato? Tour privado de 2 horas en Kioto: ${yenLocal(PRECIO_CORTO, 'es')} por grupo`, ruta: '/es/guia-privado-kioto-2-horas/' },
  en: { texto: `Only have a couple of hours? 2-hour private tour in Kyoto: ${yenLocal(PRECIO_CORTO, 'en')} per group`, ruta: '/en/kyoto-private-guide-2-hours/' },
  ar: { texto: `وقتكم قصير؟ جولة خاصة لمدة ساعتين في كيوتو: ${yenLocal(PRECIO_CORTO, 'ar')} للمجموعة`, ruta: '/ar/kyoto-private-guide-2-hours/' },
}
const RECOMENDADO: Record<string, string> = { es: 'Recomendado', en: 'Recommended', ar: 'ننصح به', ru: 'Рекомендуем' }

/** Ficha fija bajo las tarifas: lo que comparan las plataformas (Civitatis,
 *  GoWithGuide) y lo que las IAs copian tal cual. Todo sale de lo que la web ya
 *  dice en «Qué incluye», «Lo que no incluye», las preguntas (72 h) y los planes
 *  (hasta 6 por precio). Nada nuevo: si cambia allí, cambia aquí. */
const FICHA: Record<string, { incluido: [string, string]; no: [string, string]; cancelacion: [string, string]; grupo: string }> = {
  es: { incluido: ['Incluido', 'Ruta preparada, recogida en el vestíbulo del hotel y ayuda con trenes y tarjeta IC.'],
    no: ['No incluido', 'Trenes, entradas y comidas: se pagan en el momento.'],
    cancelacion: ['Cancelación', 'Gratis hasta 72 horas antes.'], grupo: 'Grupo máx.' },
  en: { incluido: ['Included', 'Planned route, hotel lobby pick-up and help with trains and IC cards.'],
    no: ['Not included', 'Trains, admissions and meals, paid as you go.'],
    cancelacion: ['Cancellation', 'Free up to 72 hours before.'], grupo: 'Max. group' },
  ar: { incluido: ['يشمل السعر', 'مسار مُعدّ مسبقاً، والاستقبال في بهو الفندق، والمساعدة في القطارات وبطاقة IC.'],
    no: ['لا يشمل', 'القطارات وتذاكر الدخول والوجبات تُدفع في حينها.'],
    cancelacion: ['الإلغاء', 'مجاني حتى ٧٢ ساعة قبل الجولة.'], grupo: 'حجم المجموعة' },
  ru: { incluido: ['Входит в цену', 'Продуманный маршрут, встреча в лобби отеля и помощь с поездами и картой IC.'],
    no: ['Не входит', 'Поезда, входные билеты и еда — оплачиваются на месте.'],
    cancelacion: ['Отмена', 'Бесплатно не позднее чем за 72 часа.'], grupo: 'Размер группы' },
}
// Hasta 14 es el grupo más grande que ha llevado Tony; de Larion no consta, así
// que en sus páginas solo se dice «más grandes, a consultar».
const GRUPO_MAX: Record<string, Record<string, string>> = {
  tony: { es: '6 personas al precio indicado; hasta 14, bajo consulta.', en: '6 people at the listed price; up to 14 on request.',
    ar: '٦ أشخاص بالسعر المذكور، وحتى ١٤ شخصاً عند الطلب.', ru: '6 человек по указанной цене; до 14 — по запросу.' },
  larion: { es: '6 personas al precio indicado; grupos mayores, bajo consulta.', en: '6 people at the listed price; larger groups on request.',
    ar: '٦ أشخاص بالسعر المذكور، والمجموعات الأكبر عند الطلب.', ru: '6 человек по указанной цене; группы больше — по запросу.' },
}

function FichaTour({ p }: { p: Pagina }) {
  const f = FICHA[p.lang] ?? FICHA.en
  const filas: [string, string][] = [f.incluido, f.no, f.cancelacion, [f.grupo, (GRUPO_MAX[p.guia] ?? GRUPO_MAX.tony)[p.lang] ?? GRUPO_MAX.tony.en]]
  // Estilos en v7.css (.v7-ficha): con estilo en línea y sin relleno, el texto
  // quedaba pegado al borde de la caja y en el móvil la etiqueta se salía.
  return (
    <dl className="v7-ficha tarjeta">
      {filas.map(([k, v]) => (
        <div key={k} className="v7-ficha-fila">
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  )
}

function Precios({ p, resenas }: { p: Pagina; resenas: Resena[] }) {
  // Solo en las páginas de Tony: el PayPal es suyo.
  const pagar = p.guia === 'tony' ? PAGAR[p.lang] : undefined
  const cambios = useCambio(p.mercado.divisas)
  const otono = useEsOtono()
  const planes = useRef<HTMLDivElement>(null)
  useBilletes(planes)
  const fmt = (n: number, divisa: string) => {
    try {
      return new Intl.NumberFormat(p.lang === 'ar' ? 'ar-u-nu-latn' : p.lang, { style: 'currency', currency: divisa, maximumFractionDigits: 0, useGrouping: 'always' } as unknown as Intl.NumberFormatOptions).format(n)
    } catch { return `${Math.round(n)} ${divisa}` }
  }
  return (
    <>
      {/* La nota junto al precio, de las reseñas reales (las de Tony vienen ya
          en el build, así que también sale en el HTML pregenerado). */}
      {p.guia === 'tony' && resenas.length > 0 && (
        <p className="v7-hero-nota v7-precios-nota"><a href="#resenas">
          <span aria-hidden="true">★</span> {mediaResenas(resenas, p.lang)} · {resenas.length} {RESENAS_TXT[p.lang] ?? RESENAS_TXT.en}
        </a></p>
      )}
      <div className="v7-planes" ref={planes}>
        {p.precios.planes.map((plan, i) => (
          // El día completo es lo que más rinde al cliente: se destaca con tinta, no con altura.
          <article key={plan.nombre} className={`v7-plan tarjeta ck-billete ${i === 1 ? 'v7-plan-destacado' : ''}`}>
            {i === 1 && <p className="v7-plan-sello ck-foil">{RECOMENDADO[p.lang] ?? RECOMENDADO.en}</p>}
            <h3>{plan.nombre}</h3>
            {/* Sin «hasta 6» a la vista (vozEmpresa.ts); el Offer del JSON-LD conserva el detalle. */}
            <p className="v7-plan-detalle">{visible(plan.detalle)}</p>
            <p className="v7-plan-precio">{plan.desde && <span className="v7-plan-desde">{p.precios.desde} </span>}<bdi>{plan.precio}</bdi></p>
            <p className="v7-plan-grupo">{p.precios.porGrupo}</p>
            {p.precios.porPersona && !plan.desde && <p className="v7-plan-persona">{p.precios.porPersona(plan.yenes)}</p>}
            {/* Talón de billete: separa lo que cuesta de cómo se reserva. */}
            <div className="ck-corte" aria-hidden="true"><i /></div>
            {/* Primero se habla (WhatsApp con el plan ya escrito) y luego se paga:
                el botón grande de pagar antes de escribir echaba para atrás. */}
            <a className="v7-plan-pagar" href={enlaceGuia(p.guia, p.contacto.plantilla({ ...VACIO, intereses: [plan.nombre] }))} target="_blank" rel="noopener noreferrer"
              onClick={() => window.gtag?.('event', 'generate_lead', { pagina: p.id, valor: plan.yenes, canal: GUIAS[p.guia].tg ? 'telegram-precio' : 'whatsapp-precio' })}>
              {(GUIAS[p.guia].tg ? RESERVAR_PLAN_TG : RESERVAR_PLAN)[p.lang] ?? RESERVAR_PLAN.en}
            </a>
            {pagar && !plan.desde && (
              <a className="v7-plan-pagar-enlace" href={`${PAYPAL_TONY}/${plan.yenes}JPY`} target="_blank" rel="noopener noreferrer"
                onClick={() => window.gtag?.('event', 'begin_checkout', { pagina: p.id, valor: plan.yenes, canal: 'paypal' })}>
                {PAGO_ADELANTADO[p.lang] ?? PAGO_ADELANTADO.en}
              </a>
            )}
            {cambios.length > 0 && (
              <p className="v7-plan-aprox">
                ≈ {cambios.map((c) => fmt(plan.yenes * c.tasa, c.divisa)).join(' · ')}{plan.desde ? '+' : ''}
              </p>
            )}
          </article>
        ))}
      </div>
      {/* Tour corto de 2 h (11-11-2026): línea aparte para no mover la tarjeta destacada. */}
      {p.guia === 'tony' && CORTO_TXT[p.lang] && (
        <p className="v7-entradilla v7-corto"><Link to={CORTO_TXT[p.lang].ruta}>{CORTO_TXT[p.lang].texto} →</Link></p>
      )}
      {/* Página de todos los precios (HTML estático de scripts/precios.mjs): <a>, no <Link>, para salir del SPA. */}
      {p.guia === 'tony' && (p.lang === 'es' || p.lang === 'en' || p.lang === 'ar') && (
        <p className="v7-entradilla v7-corto">
          <a href={{ es: '/es/precios/', en: '/en/prices/', ar: '/ar/prices/' }[p.lang]}>
            {{ es: 'Todos los precios: montaña, planes y experiencias', en: 'All prices: hiking, plans and experiences', ar: 'كل الأسعار: الجبال والخطط والتجارب' }[p.lang]} {p.lang === 'ar' ? '←' : '→'}
          </a>
        </p>
      )}
      {/* El aviso de otoño, después de los precios: antes los tapaba en el móvil. */}
      {otono && p.precios.temporada && (
        <aside className="v7-temporada tarjeta">
          <h3>🍁 {p.precios.temporada.titulo}</h3>
          <p>{p.precios.temporada.texto}</p>
          {p.precios.temporada.enlace && p.id !== 'larion' && <p className="v7-temporada-enlace"><Link to={p.precios.temporada.enlace.ruta}>{p.precios.temporada.enlace.texto} →</Link></p>}
        </aside>
      )}
      <FichaTour p={p} />
      <ul className="v7-notas">
        {pagar && <li>{pagar.nota}</li>}
        {p.precios.notas.map((n) => <li key={n}>{n}</li>)}
      </ul>
      {cambios.length > 0 && (
        <p className="v7-fuente-cambio">
          ≈ {p.precios.aprox} · <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer">Rates by Exchange Rate API</a>
        </p>
      )}
    </>
  )
}

function Contacto({ p }: { p: Pagina }) {
  const [d, setD] = useState<DatosContacto>(VACIO)
  const g = GUIAS[p.guia]
  const msg = useMemo(() => p.contacto.plantilla(d), [d, p])
  const cambia = (k: keyof DatosContacto) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setD((x) => ({ ...x, [k]: e.target.value }))
  const alterna = (i: string) => setD((x) => ({ ...x, intereses: x.intereses.includes(i) ? x.intereses.filter((y) => y !== i) : [...x.intereses, i] }))
  // De dónde viene la gente es lo que más necesitamos saber: va en el mensaje
  // y, si el visitante aceptó las cookies, también a Analytics.
  const avisaAnalytics = (canal: string) => window.gtag?.('event', 'generate_lead', { pagina: p.id, pais: d.pais || 'sin_decir', canal })

  return (
    <div className="v7-contacto">
      <form className="v7-formulario tarjeta" onSubmit={(e) => {
        e.preventDefault()
        avisaAnalytics(g.tg ? 'telegram' : 'whatsapp')
        // t.me no admite texto: se copia el mensaje para pegarlo en el chat.
        if (g.tg) navigator.clipboard?.writeText(msg).catch(() => {})
        window.open(enlaceGuia(p.guia, msg), '_blank', 'noopener')
      }}>
        <div className="v7-campos">
          <label><span>{p.contacto.nombre}</span><input value={d.nombre} onChange={cambia('nombre')} autoComplete="name" /></label>
          <label><span>{p.contacto.pais}</span>
            <select value={d.pais} onChange={cambia('pais')}>
              <option value="">—</option>
              {p.contacto.paises.map((x) => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label><span>{p.contacto.ciudad}</span><input value={d.ciudad} onChange={cambia('ciudad')} autoComplete="address-level2" /></label>
          <label><span>{p.contacto.fechas}</span><input value={d.fechas} onChange={cambia('fechas')} placeholder={EJ_FECHAS[p.lang] ?? EJ_FECHAS.en} /></label>
          <label><span>{p.contacto.personas}</span>
            <select value={d.personas} onChange={cambia('personas')}>
              <option value="">—</option>
              {['1', '2', '3', '4', '5', '6', '7+'].map((x) => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label><span>{p.contacto.hotel}</span><input value={d.hotel} onChange={cambia('hotel')} /></label>
        </div>
        <fieldset className="v7-intereses">
          <legend>{p.contacto.intereses}</legend>
          {p.contacto.opcionesIntereses.map((i) => (
            <button type="button" key={i} aria-pressed={d.intereses.includes(i)} onClick={() => alterna(i)}>{i}</button>
          ))}
        </fieldset>
        <label className="v7-ancho"><span>{p.contacto.notas}</span><textarea rows={2} value={d.notas} onChange={cambia('notas')} /></label>
        <div className="v7-acciones">
          <button type="submit" className={`v7-boton${g.tg ? ' v7-tg' : ''}`}><IconoCanal tg={!!g.tg} /> {p.contacto.wa}</button>
          <a className="v7-boton v7-boton-sec" href={`mailto:${CORREO}?subject=${encodeURIComponent(p.contacto.asuntoMail)}&body=${encodeURIComponent(msg)}`} onClick={() => avisaAnalytics('email')}>
            {p.contacto.mail}
          </a>
        </div>
        <p className="v7-aviso">{p.contacto.aviso}</p>
      </form>
      <aside className="v7-vista v7-con-figura tarjeta" aria-live="polite">
        <h3>{p.contacto.vista}</h3>
        <pre>{msg}</pre>
      </aside>
    </div>
  )
}

/** Precio de referencia de la portada troncal: UNA cifra a la vista (Antonio:
 *  precios repetidos = sobrecarga; antes ¥38.000 salía 8 veces). Tarifas,
 *  PayPal, planes y experiencias siguen en /es/precios/ (/en/prices/,
 *  /ar/prices/). La ficha rápida sigue en el HTML, plegada: es lo que ChatGPT
 *  encontró y citó (18-10-2026), y lo que lee scripts/textos-ia.mjs. */
function PrecioReferencia({ p }: { p: Pagina }) {
  const otono = useEsOtono()
  const r = p.precioRef
  if (!r) return null
  const flecha = p.dir === 'rtl' ? '←' : '→'
  const temporada = p.precios.temporada?.enlace
  return (
    <section id="precios" className="v7-seccion v7-precio-seccion" aria-label={r.titulo}>
      {/* Un solo titular: la cifra. Antes «Cuánto cuesta» (mincho) y debajo otra cifra
          en negrita casi igual de grande: dos titulares en dos letras (crítica, 21-11). */}
      <div className="v7-precio-ref" data-aparece="">
        <h2 className="v7-precio-cifra">{desdeHero(p.lang)}</h2>
        <p>{r.texto}</p>
        {/* HTML estático (scripts/precios.mjs): <a>, no <Link>, para salir de la SPA. */}
        <a className="v9-enlace" href={r.ruta}>{r.enlace} {flecha}</a>
        {/* Temporada que toca o se acerca (otoño, invierno o sakura; datosInvierno.ts):
            solo en español (Tony, 24-11). EN/AR siguen con la línea de los arces de
            Kioto (1-oct a 7-dic, hora de Japón), como antes. */}
        {p.lang === 'es' ? <TemporadaPortada p={p} /> : otono && temporada && (
          <p className="v7-precio-otono">{r.otono} <Link to={temporada.ruta}>{temporada.texto} {flecha}</Link></p>
        )}
        {FICHA_RAPIDA[p.lang] && (
          <details className="v7-plegado">
            <summary>{r.plegado}</summary>
            <dl className="v9-ficha">
              {FICHA_RAPIDA[p.lang].map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}
            </dl>
          </details>
        )}
      </div>
    </section>
  )
}

/** Contacto de la portada troncal: WhatsApp grande primero, número y correo a
 *  la vista, y el formulario de siempre plegado debajo (Antonio: el contacto
 *  antes que los formularios). form.v7-formulario no cambia: Clarity lo marca. */
function ContactoTroncal({ p, msg }: { p: Pagina; msg: string }) {
  const g = GUIAS[p.guia]
  const c = p.contactoWa
  if (!c) return null
  return (
    <section id="contacto" className="v7-seccion">
      <h2>{p.contacto.titulo}</h2>
      <p className="v7-entradilla">{c.sub}</p>
      <div className="v7-contacto-wa" data-aparece="">
        <a className={`v7-boton${g.tg ? ' v7-tg' : ''}`} href={enlaceGuia(p.guia, msg)} target="_blank" rel="noopener noreferrer" aria-label={`${c.boton} — ${canal(p)}`}>
          <IconoCanal tg={!!g.tg} /> {c.boton}
        </a>
        <p className="v7-contacto-otros">
          {p.lang === 'ar' ? 'واتساب' : 'WhatsApp'} <bdi dir="ltr">{telefono(g.wa ?? '')}</bdi> · {c.correo} <a href={`mailto:${CORREO}`}>{CORREO}</a>
        </p>
      </div>
      {/* Fuera de .v7-contacto-wa (que mide 40rem) para que el formulario y la
          vista previa del mensaje tengan el ancho de siempre en escritorio. */}
      <details className="v7-plegado">
        <summary>{c.formulario}</summary>
        <p className="v7-entradilla">{p.contacto.sub}</p>
        <Contacto p={p} />
      </details>
    </section>
  )
}

const ATAJOS: Record<string, [string, string, string]> = {
  es: ['Tours', 'Precios', 'Reseñas'], en: ['Tours', 'Prices', 'Reviews'],
  ar: ['الجولات', 'الأسعار', 'التقييمات'], ru: ['Туры', 'Цены', 'Отзывы'],
}

/** En móvil, en cuanto se deja atrás la portada, queda abajo una barra con lo
 *  que busca el cliente (tours o experiencias, precios, reseñas) y el botón de
 *  WhatsApp. Se esconde donde ya hay un WhatsApp grande a la vista (el
 *  contacto y, en la portada troncal, el pie): así no tapa sus enlaces. */
function BarraMovil({ p, href, conResenas, troncal }: { p: Pagina; href: string; conResenas: boolean; troncal: boolean }) {
  const [ver, setVer] = useState(false)
  const primera = troncal ? 'experiencias' : 'ciudades'
  // Con las reseñas (llegan después) cambia la lista y se vuelve a observar.
  const activa = useSeccionActiva(conResenas ? [primera, 'precios', 'resenas'] : [primera, 'precios'])
  useEffect(() => {
    // La portada actual es .v9-portada (con .v7-hero, la de antes, la barra no salía nunca).
    const hero = document.querySelector('.v9-portada, .v7-hero')
    const contacto = document.getElementById('contacto')
    const pie = troncal ? document.querySelector('.v7-pie') : null
    if (!hero) return
    let pasada = false, enContacto = false, enPie = false
    const pinta = () => setVer(pasada && !enContacto && !enPie)
    const io = new IntersectionObserver((es) => {
      for (const e of es) {
        if (e.target === hero) pasada = !e.isIntersecting
        if (e.target === contacto) enContacto = e.isIntersecting
        if (e.target === pie) enPie = e.isIntersecting
      }
      pinta()
    })
    io.observe(hero)
    if (contacto) io.observe(contacto)
    if (pie) io.observe(pie)
    return () => io.disconnect()
  }, [troncal])
  const [tours, precios, opiniones] = (troncal ? ATAJOS_TRONCAL : ATAJOS)[p.lang] ?? ATAJOS.en
  const atajos: [string, string][] = [[primera, tours], ['precios', precios], ...(conResenas ? [['resenas', opiniones] as [string, string]] : [])]
  // Troncal (portada corta): solo el botón de WhatsApp, a lo ancho y con su texto.
  // Los atajos eran una segunda navegación encima de la cabecera; Clarity pide una
  // barra con un solo botón (estudio del 21-11, mejora 7) y la portada ya es corta.
  if (troncal) {
    return (
      <div className={`v7-barra-movil v7-barra-sola cristal ${ver ? 'ver' : ''}`} aria-hidden={!ver}>
        <a className="v7-boton" href={href} target="_blank" rel="noopener noreferrer" tabIndex={ver ? 0 : -1}><IconoCanal tg={false} /> {p.hero.cta}</a>
      </div>
    )
  }
  return (
    <div className={`v7-barra-movil v7-barra-fila cristal ${ver ? 'ver' : ''}`} aria-hidden={!ver}>
      <nav className="v7-barra-atajos" aria-label={atajos.map(([, t]) => t).join(' · ')}>
        {atajos.map(([id, t]) => <a key={id} href={`#${id}`} tabIndex={ver ? 0 : -1} aria-current={activa === id ? 'true' : undefined}>{t}</a>)}
      </nav>
      <a className={`v7-boton${GUIAS[p.guia].tg ? ' v7-tg' : ''}`} href={href} target="_blank" rel="noopener noreferrer" tabIndex={ver ? 0 : -1} aria-label={`${p.hero.cta} — ${canal(p)}`}><IconoCanal tg={!!GUIAS[p.guia].tg} /></a>
    </div>
  )
}

/** Para Google: el guía (con sus idiomas), la zona y las tres tarifas. */
/** Nota media y TODAS las reseñas reales de Tony (las del Worker entran en el
 *  build con scripts/resenas-worker.mjs) para los datos estructurados. Los
 *  buscadores de IA (ChatGPT tira de Bing) leen el JSON-LD del HTML pregenerado,
 *  no el que pinta React después; por eso va aquí y no en una petición. */
// 19-10-2026: SIN estrellas en el JSON-LD. Son reseñas recogidas por el propio
// negocio en su web, y Google y Bing tratan ese marcado como autoatribuido
// (no da estrellas y puede contar como marcado engañoso). Las reseñas siguen
// visibles en la página; la función queda por si un día hay una fuente externa.
function valoracionTony(): Record<string, unknown> {
  return {}
}
export function valoracionTonyAntigua() {
  const lista = (resenasTony as unknown as { reviews: Resena[] }).reviews
  if (!lista.length) return {}
  const media = lista.reduce((t, r) => t + r.stars, 0) / lista.length
  return {
    aggregateRating: { '@type': 'AggregateRating', ratingValue: media.toFixed(1), reviewCount: lista.length, bestRating: 5, worstRating: 1 },
    review: lista.map((r) => ({
      '@type': 'Review', author: { '@type': 'Person', name: r.name },
      reviewRating: { '@type': 'Rating', ratingValue: r.stars, bestRating: 5 }, reviewBody: r.text,
    })),
  }
}

/** Fecha de la última revisión de contenido de estas páginas (dateModified).
 *  A mano y no la del build: un build sin cambios no es contenido nuevo. */
const ACTUALIZADO = '2026-11-21'

/** El negocio es uno (index.html lo declara con este @id, igual en todas las
 *  rutas); cada página dice qué persona guía y la enlaza a él. Así /ru/ y
 *  /larion/ presentan a Larion y no a Tony con otro teléfono. */
const NEGOCIO_ID = `${BASE}/#negocio`
const PERSONA: Record<string, { id: string; url: string }> = {
  tony: { id: `${BASE}/#tony`, url: `${BASE}/es/` },
  larion: { id: `${BASE}/#larion`, url: `${BASE}/ru/` },
}

function datosEstructurados(p: Pagina) {
  const g = GUIAS[p.guia]
  const idiomas = p.guia === 'larion' ? ['ru', 'en'] : ['es', 'en', 'ar']
  const persona = PERSONA[p.guia] ?? PERSONA.tony
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${BASE}${p.ruta}#servicio`,
    name: p.seo.titulo.split(' | ')[0],
    description: p.seo.descripcion,
    url: `${BASE}${p.ruta}`,
    inLanguage: p.lang,
    serviceType: 'Private tour guide',
    areaServed: p.zona.lugares.map((l) => ({ '@type': 'Place', name: l.nombre, geo: { '@type': 'GeoCoordinates', latitude: l.lat, longitude: l.lon } })),
    availableLanguage: idiomas,
    // El servicio lo vende el negocio y lo guía la persona de esta página.
    brand: { '@id': NEGOCIO_ID },
    provider: {
      '@type': 'Person',
      '@id': persona.id,
      url: persona.url,
      name: g.nombre,
      image: `${BASE}${g.foto}`,
      jobTitle: 'Private tour guide',
      knowsLanguage: idiomas,
      ...contactoLd(p.guia),
      worksFor: { '@id': NEGOCIO_ID },
    },
    offers: p.precios.planes.map((pl) => ({
      '@type': 'Offer', name: pl.nombre, description: pl.detalle,
      priceSpecification: { '@type': 'PriceSpecification', price: pl.yenes, priceCurrency: 'JPY', ...(pl.desde ? { minPrice: pl.yenes } : {}) },
    })),
  }
}

const PUERTA_MONTANA: Record<PaginaId, { ruta: string; titulo: string; sub: string }> = {
  es: { ruta: '/es/montana/', titulo: '¿Ya conoces Kioto? Sube a sus montañas', sub: 'Ocho rutas de montaña con guía: Kongō, Atago, Hiei, Rokkō, Yoshino…' },
  en: { ruta: '/en/hiking/', titulo: 'Already seen Kyoto? Climb its mountains', sub: 'Eight guided mountain routes: Kongō, Atago, Hiei, Rokkō, Yoshino…' },
  ar: { ruta: '/ar/hiking/', titulo: 'زرت كيوتو من قبل؟ اصعد إلى جبالها', sub: 'ثمانية مسارات جبلية مع مرشد: كونغو، أتاغو، هيئي، روكّو، يوشينو…' },
  ru: { ruta: '/ru/hiking/', titulo: 'Киото уже видели? Поднимитесь в его горы', sub: 'Восемь горных маршрутов с гидом: Конго, Атаго, Хиэй, Рокко, Ёсино…' },
  larion: { ruta: '/en/hiking/', titulo: 'Already seen Kyoto? Climb its mountains', sub: 'Eight guided mountain routes: Kongō, Atago, Hiei, Rokkō, Yoshino…' },
}


/** «Por qué conmigo»: tres razones, todas ya dichas en la web (sin agencia,
 *  idiomas del guía, precio por grupo de hasta 6 y cancelación hasta 72 h). */
const RAZONES: Record<PaginaId, { titulo: string; lista: [string, string, string][] }> = {
  es: { titulo: 'Por qué conmigo', lista: [
    ['直', 'Trato directo', 'Contratas con tu guía, sin agencia: quien te contesta por WhatsApp es quien te recoge.'],
    ['語', 'En tu idioma', 'Español, mi lengua materna. También guío en inglés y en árabe.'],
    ['組', 'Solo tu grupo', 'Precio cerrado por grupo de hasta 6 personas y cancelación sin coste hasta 72 horas antes.'],
  ] },
  en: { titulo: 'Why book with me', lista: [
    ['直', 'Direct contact', 'You book with your guide, not an agency: the person who answers on WhatsApp is the one who meets you.'],
    ['語', 'In your language', 'English, plus Spanish (my native language) and Arabic.'],
    ['組', 'Just your party', 'One fixed price per group of up to 6, and free cancellation up to 72 hours before.'],
  ] },
  ar: { titulo: 'لماذا معي', lista: [
    ['直', 'تعامل مباشر', 'تتعامل مع مرشدك بلا وكالة: من يردّ عليك في واتساب هو من يلتقيك.'],
    ['語', 'بلغتك', 'أرشدك بالعربية، وبالإسبانية والإنجليزية أيضاً.'],
    ['組', 'لمجموعتك وحدها', 'سعر ثابت للمجموعة حتى ٦ أشخاص، وإلغاء مجاني حتى ٧٢ ساعة قبل الموعد.'],
  ] },
  ru: { titulo: 'Почему со мной', lista: [
    ['直', 'Напрямую', 'Без агентства: в Telegram вам отвечает сам Ларион, и он же встречает вас в отеле.'],
    ['語', 'На вашем языке', 'Веду туры на русском и на английском.'],
    ['組', 'Только ваша компания', 'Фиксированная цена за группу до 6 человек и бесплатная отмена не позднее чем за 72 часа.'],
  ] },
  larion: { titulo: 'Why book with me', lista: [
    ['直', 'Direct contact', "No agency: Larion answers you himself on Telegram, and he meets you at your hotel."],
    ['語', 'In your language', 'Russian and English.'],
    ['組', 'Just your party', 'One fixed price per group of up to 6, and free cancellation up to 72 hours before.'],
  ] },
}

// ── Página ───────────────────────────────────────────────────────────────────

/** «Desde ¥38.000 por grupo», del precio real del medio día: nunca se desfasa. */
function desdeHero(lang: string): string {
  const n = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'es-ES').format(PRECIO.medio)
  return ({ es: `Desde ¥${n} por grupo`, en: `From ¥${n} per group`, ar: `ابتداءً من ${n} ين للمجموعة`, ru: `От ${n} ¥ за группу` } as Record<string, string>)[lang] ?? `From ¥${n} per group`
}


/** Ficha rápida de Tony: plegada en el precio de la portada troncal. Solo datos
 *  que ya dice la web. 21-11-2026 (Antonio): sin techos a la vista («hasta 6»,
 *  «hasta 14»); esas cifras siguen en el JSON-LD (offers) y en llms.txt. Y
 *  primero «todo Japón», no solo Kansai (Tokio y el Fuji: /es/rutas/). */
const FICHA_RAPIDA: Record<string, [string, string][]> = {
  es: [
    ['Guía', 'Tony Hanma, español, vive en Osaka'],
    ['Idiomas', 'Español (nativo), inglés y árabe'],
    ['Dónde', 'Todo Japón: Kansai (Kioto, Osaka, Nara, Kobe, Himeji), Tokio, el monte Fuji y más'],
    ['Precio', 'Medio día (4 h) ¥38.000 · día completo (8 h) ¥58.000, por grupo, no por persona'],
    ['Tour corto', `2 horas en Kioto, ${yenLocal(PRECIO_CORTO, 'es')} por grupo`],
    ['En bici', 'Kioto en bici con el guía, al precio de medio día o día completo; las bicis se alquilan aparte'],
    ['Grupos', 'Solo tu grupo; grupos grandes, precio a consultar'],
    ['Recogida', 'En el vestíbulo de tu hotel'],
    ['Pago', 'Efectivo el día del tour, o PayPal o Wise por adelantado'],
    ['Cancelación', 'Gratis hasta 72 horas antes'],
    ['Experiencia', 'Más de 25 tours guiados'],
    ['Contacto', 'WhatsApp +34 634 193 106 · tony@tonykansaiguide.com'],
  ],
  en: [
    ['Guide', 'Tony Hanma, from Spain, lives in Osaka'],
    ['Languages', 'Spanish (native), English and Arabic'],
    ['Where', 'All of Japan: Kansai (Kyoto, Osaka, Nara, Kobe, Himeji), Tokyo, Mount Fuji and more'],
    ['Price', 'Half day (4 h) ¥38,000 · full day (8 h) ¥58,000, per group, not per person'],
    ['Short tour', `2 hours in Kyoto, ${yenLocal(PRECIO_CORTO, 'en')} per group`],
    ['By bike', 'Kyoto by bike with your guide, at the half-day or full-day price; bikes are rented separately'],
    ['Groups', 'Your group only; larger groups, price on request'],
    ['Pick-up', 'In your hotel lobby'],
    ['Payment', 'Cash on the day, or PayPal or Wise in advance'],
    ['Cancellation', 'Free up to 72 hours before'],
    ['Experience', 'More than 25 tours guided'],
    ['Contact', 'WhatsApp +34 634 193 106 · tony@tonykansaiguide.com'],
  ],
  ar: [
    ['المرشد', 'طوني هانما، إسباني مسلم يعيش في أوساكا'],
    ['اللغات', 'العربية والإسبانية والإنجليزية'],
    ['الأماكن', 'كل اليابان: كانساي (كيوتو وأوساكا ونارا وكوبي وهيميجي) وطوكيو وجبل فوجي وغيرها'],
    ['السعر', 'نصف يوم (٤ ساعات) ٣٨٬٠٠٠ ين · يوم كامل (٨ ساعات) ٥٨٬٠٠٠ ين، للمجموعة لا للشخص'],
    ['جولة قصيرة', `ساعتان في كيوتو، ${new Intl.NumberFormat('ar-EG').format(PRECIO_CORTO)} ين للمجموعة`],
    ['بالدراجة', 'كيوتو بالدراجة مع المرشد، بسعر نصف اليوم أو اليوم الكامل؛ والدراجات تُستأجر على حدة'],
    ['المجموعات', 'مجموعتك وحدها؛ المجموعات الكبيرة بسعر حسب الطلب'],
    ['الاستقبال', 'في بهو فندقك'],
    ['الدفع', 'نقداً يوم الجولة، أو مسبقاً عبر PayPal أو Wise'],
    ['الإلغاء', 'مجاني حتى ٧٢ ساعة قبل الجولة'],
    ['الخبرة', 'أكثر من ٢٥ جولة'],
    ['التواصل', 'واتساب ‎+34 634 193 106 · tony@tonykansaiguide.com'],
  ],
}

/** Placa de la marca sobre la foto de la portada española (Tony, 25-11-2026:
 *  «que al entrar digan: wow, esto es Japón»). Es el cartel de andén japonés
 *  (駅名標): nombre grande, la franja de la línea y las estaciones vecinas a los
 *  lados. Franja: granate Hankyu y azul Shinkansen. Solo tipografía y CSS
 *  (marca-es.css); la flor es la de UIX (logo-sakura.ts). */
function PlacaEs() {
  return (
    <div className="es-placa" role="img" aria-label="Tony Kansai Guide">
      <span className="es-placa-kana" lang="ja" aria-hidden="true">関西 · 日本</span>
      <span className="es-placa-nombre" aria-hidden="true"><Logo /></span>
      <span className="es-placa-linea" aria-hidden="true" />
      <span className="es-placa-vecinas" aria-hidden="true"><span>← Kioto</span><span>Nara →</span></span>
    </div>
  )
}

/** «Lo que hay» de la portada española: las experiencias (montaña incluida) y,
 *  en la misma sección, el precio cerrado por grupo (#precios sigue existiendo
 *  para los enlaces antiguos /es/#precios). Sin botón propio: el contacto va
 *  justo debajo. Clases de tarjeta: las de Experiencias (§ 18 de estilo-sereno). */
function LoQueHayEs({ p }: { p: Pagina }) {
  const e = p.experiencias
  const r = p.precioRef
  if (!e) return null
  return (
    <section id="experiencias" className="v7-seccion es-loquehay">
      <h2>{e.titulo}</h2>
      <p className="v7-entradilla">{e.sub}</p>
      <ul className="v7-exp-lista">
        {e.lista.map((x) => (
          <li key={x.ruta} data-aparece="">
            <a className="v7-exp" href={x.ruta}>
              <img {...foto(x.foto, '(max-width: 720px) 82vw, 33vw')} alt={x.alt} width={600} height={450} loading="lazy" decoding="async" />
              <h3>{x.titulo}</h3>
              <p>{x.texto}</p>
            </a>
          </li>
        ))}
      </ul>
      {r && (
        <div id="precios" className="es-precio" data-aparece="">
          <p className="es-precio-cifra">{desdeHero(p.lang)}</p>
          <p className="es-precio-texto">{r.texto}</p>
          <a className="v9-enlace" href={r.ruta}>{r.enlace} →</a>
        </div>
      )}
      {e.otras.map((o) => (
        <p key={o.ruta} className="v7-exp-otras"><a href={o.ruta}>{o.texto} →</a></p>
      ))}
    </section>
  )
}

/** Final de la portada española: todo lo que no es «reseñas y lo que hay»,
 *  plegado y en el HTML (los enlaces siguen ahí y el JSON-LD FAQPage sigue
 *  respaldado por el texto visible al abrir). */
function MasEs({ p }: { p: Pagina }) {
  const r = p.precioRef
  // Tras montar (como TemporadaPortada): el HTML pregenerado no lleva fecha.
  const hayTemporada = useTemporadas().length > 0
  return (
    <section className="v7-seccion v7-faq-troncal es-mas">
      {r && hayTemporada && (
        <details className="v7-plegado">
          <summary>Esta temporada en Kansai</summary>
          <TemporadaPortada p={p} />
        </details>
      )}
      {r && FICHA_RAPIDA.es && (
        <details className="v7-plegado">
          <summary>{r.plegado}</summary>
          <dl className="v9-ficha">
            {FICHA_RAPIDA.es.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}
          </dl>
        </details>
      )}
      <details className="v7-faq-plegada">
        <summary><h2>{PREGUNTAS_FRECUENTES.es} <span className="v7-faq-cuantas">({p.faq.items.length})</span></h2></summary>
        <div className="v7-faq">
          {p.faq.items.map((f) => (
            <details key={f.q}>
              <summary>{visible(f.q)}</summary>
              <p>{visible(f.a)}</p>
              {f.enlace && <p><a href={f.enlace.href}>{f.enlace.texto}</a></p>}
            </details>
          ))}
        </div>
      </details>
    </section>
  )
}

const RESPUESTAS_TITULO: Record<string, string> = { es: 'Guías y precios', en: 'Guides and prices', ar: 'أدلة وأسعار' }
/** Título del plegable de preguntas en la portada troncal. */
const PREGUNTAS_FRECUENTES: Record<string, string> = { es: 'Preguntas frecuentes', en: 'Frequently asked questions', ar: 'الأسئلة الشائعة' }
export default function PaginaGuia({ id }: { id: PaginaId }) {
  const p = PAGINAS[id]
  const g = GUIAS[p.guia]
  const { setLang } = useLanguage()
  const resenas = useResenas(!!p.resenas, p.resenas?.fuente)
  // Con 200 reseñas la sección sería un muro: se abren por tandas.
  const [verResenas, setVerResenas] = useState(12)
  const [filtroEstrellas, setFiltroEstrellas] = useState(0)
  const columnasLarion = useColumnas()
  // Portada troncal (rediseño de Antonio, 21-11-2026) solo en las páginas de Tony.
  const troncal = p.guia === 'tony'
  // Portada española: reseñas arriba, con resumen y tarjetas de foto grande (resenas-es.css).
  const esEs = troncal && p.lang === 'es'
  const filaResenas = useRef<HTMLDivElement>(null)
  // Foto de portada sin «.jpg»: base de sus variantes webp (-600, -900, -1200, -retrato…).
  const baseHero = p.hero.foto.replace(/\.jpg$/, '')
  const principal = useRef<HTMLElement>(null)
  useAparicion(principal, troncal)
  // Troncal: todas las reseñas en una fila (así las 28 llegan al HTML que leen
  // las IAs) y las de foto primero (Antonio: «está genial»). sort es estable:
  // dentro de cada grupo se mantiene el orden de reviews.json.
  // Troncal: primero las que se leen en el idioma de la página (en /es/ abría una
  // en inglés) y, entre ellas, las que llevan foto. En /ar/ solo las que están en
  // árabe o traducidas (la entradilla dice «traducidas»); si fueran menos de 3,
  // todas, para que la fila no quede vacía.
  useFotosRotas(resenas)
  const resenasVistas = useMemo(() => {
    if (!troncal) return filtroEstrellas ? resenas.filter((r) => r.stars === filtroEstrellas) : resenas
    const enSuIdioma = (r: Resena) => idiomaTexto(textoEn(r, p.lang)) === p.lang
    const peso = (r: Resena) => (enSuIdioma(r) ? 2 : 0) + (r.photo ? 1 : 0)
    // /es/: a igual peso, el orden del build (reviews.json) y las que solo están en
    // el Worker detrás. Así la fila no cambia de orden al llegar la petición: antes
    // la primera tarjeta pasaba al puesto 11 y Chrome, que mantiene el imán en la
    // tarjeta encajada, desplazaba la fila hasta allí.
    const delBuild = esEs ? new Map(resenasFijas().map((r, i) => [r.id, i])) : null
    const puesto = (r: Resena) => delBuild?.get(r.id) ?? Number.MAX_SAFE_INTEGER
    let lista = [...resenas].sort((a, b) => peso(b) - peso(a) || (delBuild ? puesto(a) - puesto(b) : 0))
    if (p.lang === 'ar') {
      const legibles = lista.filter(enSuIdioma)
      if (legibles.length >= 3) lista = legibles
    }
    return lista
  }, [troncal, esEs, resenas, filtroEstrellas, p.lang])

  useEffect(() => {
    // Las páginas legales siguen usando el contexto de idioma: que coincida.
    setLang(p.lang)
    try { localStorage.setItem('v7-pagina', p.id) } catch { /* bloqueado */ }
  }, [p.lang, setLang])

  useEffect(() => {
    // Ancla al llegar (p. ej. /es/#precios desde la antigua /pricing). Las
    // secciones de abajo se montan tarde, así que se reintenta un poco.
    const id = window.location.hash.slice(1)
    if (!id) return
    let intentos = 0
    const t = window.setInterval(() => {
      const el = document.getElementById(id)
      if (el || ++intentos > 20) { window.clearInterval(t); el?.scrollIntoView({ block: 'start' }) }
    }, 150)
    return () => window.clearInterval(t)
  }, [])

  const hermanas = HERMANAS[p.guia]
  const msgCorto = p.contacto.plantilla(VACIO)

  // Reseñas: en /es/ suben justo tras la portada (Tony, 24-11: «las reseñas son lo
  // importante»); en el resto de idiomas siguen tras el precio, como estaban.
  const seccionResenas = (
    <>
      {/* Reseñas reales, justo después de los tours: el cliente quiere ver pronto que otros quedaron contentos.
        Troncal: una fila que se desliza, sin el resumen de estrellas (todas son de 5★
        y la cifra ya está en la portada) ni «Ver más»: van todas en el HTML. */}
    {p.resenas && resenas.length > 0 && (
      <section className={`v7-seccion${esEs ? ' rs-es' : ''}`} id="resenas">
        <h2>{p.resenas.titulo}</h2>
        {esEs && <ResumenResenas resenas={resenas} lang={p.lang} />}
        {esEs && <FotosViajeros lista={resenasVistas} />}
        {p.resenas.nota && <p className="v7-entradilla">{p.resenas.nota}</p>}
        {!esEs && <p className="v7-opinar"><a href={p.resenas.fuente ? '/ru/otzyv/' : `/opinar.html?lang=${p.lang}`}>{p.resenas.opinar} {p.dir === 'rtl' ? '←' : '→'}</a></p>}
        {!troncal && resenas.length >= 20 && (() => {
          // Resumen con el reparto real de estrellas: que se vea que no todo es 5★.
          const cuenta = [5, 4, 3, 2, 1].map((n) => [n, resenas.filter((r) => r.stars === n).length] as const).filter(([, c]) => c > 0)
          return (
            <div className="v7-resumen tarjeta">
              <div className="v7-resumen-nota">
                <strong>{mediaResenas(resenas, p.lang)}</strong>
                <span className="v7-estrellas" aria-hidden="true">★★★★★</span>
                <small>{resenas.length} {RESENAS_TXT[p.lang] ?? RESENAS_TXT.en}</small>
              </div>
              <div className="v7-resumen-barras" role="group">
                <button type="button" aria-pressed={filtroEstrellas === 0} onClick={() => { setFiltroEstrellas(0); setVerResenas(12) }}>{TODAS[p.lang] ?? TODAS.en}</button>
                {cuenta.map(([n, c]) => (
                  <button type="button" key={n} aria-pressed={filtroEstrellas === n} onClick={() => { setFiltroEstrellas(n); setVerResenas(12) }}>
                    <span>{n}★</span><i style={{ ['--p' as string]: `${(c / resenas.length) * 100}%` }} /><b>{c}</b>
                  </button>
                ))}
              </div>
            </div>
          )
        })()}
        {/* Larion conserva su diseño de antes (columnas sueltas, sin rejilla ni kanji): a Tony le gustaba así. */}
        {p.guia === 'larion' ? (
          <div className="v7-resenas v7-resenas-clasico">
            {repartir(resenasVistas.slice(0, verResenas), columnasLarion).map((col, c) => (
              <div key={c} className="v7-resenas-col">{col.map((r) => <TarjetaClasica key={r.id} r={r} lang={p.lang} />)}</div>
            ))}
          </div>
        ) : (
        <div ref={esEs ? filaResenas : undefined} className={`v7-resenas${troncal ? ' v7-resenas-fila' : ''}`} {...(troncal ? { role: 'region', 'aria-label': p.resenas.titulo, tabIndex: 0 } : {})}>
          {(troncal ? resenasVistas : resenasVistas.slice(0, verResenas)).map((r) => {
            const m = r.meta?.[p.lang]
            const nombre = m?.name ?? r.name, pais = m?.country ?? r.country, lugar = lugarEn(m?.tour ?? r.tour, p.lang, !!m)
            const texto = textoEn(r, p.lang)
            return (
            <figure key={r.id} className={`tarjeta${r.photo ? ' v7-resena-con-foto' : ''}`} {...(esEs ? { id: `resena-${r.id}` } : {})}>
              {/* Foto arriba y siempre del mismo tamaño: antes iba al final con su altura
                  natural y la rejilla quedaba como un puzle mal encajado. */}
              {r.photo
                ? <a href={r.photoFull || (r.photo.startsWith('/') ? r.photo : `/${r.photo}`)} target="_blank" rel="noopener" style={{ cursor: 'zoom-in' }} aria-label={`${FOTO_DE[p.lang] ?? FOTO_DE.en} ${nombre}`}><img className="v7-resena-foto" loading="lazy" src={r.photo.startsWith('/') ? r.photo : `/${r.photo}`} alt="" onError={sinFoto} {...(esEs ? atributosFotoEs(r.photo) : {})} /></a>
                : <div className="v7-resena-sinfoto" aria-hidden="true"><span lang="ja">{kanjiDe(r.tour)}</span></div>}
              <div className="v7-resena-cabeza">
                <div className="v7-estrellas" aria-label={`${r.stars}/5`}>{'★'.repeat(r.stars)}<span className="v7-estrellas-vacias">{'★'.repeat(5 - r.stars)}</span></div>
              </div>
              {/* En /es/ el recorte es más corto (6 líneas en el móvil, resenas-es.css): la tarjeta cabe en una pantalla. */}
              <TextoRecortable largo={texto.length > (esEs ? 220 : 320)} lang={p.lang}>
                <TextoResena r={r} lang={p.lang} />
              </TextoRecortable>
              <figcaption>
                <Inicial nombre={nombre} />
                <span><strong>{nombre}</strong><small>{[lugar, pais].filter(Boolean).join(' · ')}</small></span>
              </figcaption>
            </figure>
            )
          })}
        </div>
        )}
        {esEs && <MandosFila fila={filaResenas} total={resenasVistas.length} />}
        {esEs && <p className="v7-opinar rs-opinar"><a href={`/opinar.html?lang=${p.lang}`}>{p.resenas.opinar} →</a></p>}
        {!troncal && resenasVistas.length > verResenas && (
          <p className="v7-ver-mas"><button type="button" onClick={() => setVerResenas((n) => n + 24)}>
            {VER_MAS[p.lang] ?? VER_MAS.en} ({resenasVistas.length - verResenas})
          </button></p>
        )}
      </section>
    )}
    </>
  )

  return (
    <div className={`v7 v7-pagina lang-${p.lang}${troncal ? ' v7-troncal' : ''}`} lang={p.lang} dir={p.dir}>
      <Helmet>
        <html lang={p.lang} dir={p.dir} />
        <title>{p.seo.titulo}</title>
        <meta name="description" content={p.seo.descripcion} />
        <link rel="canonical" href={`${BASE}${p.ruta}`} />
        {enlacesHreflang(hermanas.map((h) => ({ lang: PAGINAS[h.id].lang, href: `${BASE}${PAGINAS[h.id].ruta}` })))}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={p.seo.titulo} />
        <meta property="og:description" content={p.seo.descripcion} />
        <meta property="og:url" content={`${BASE}${p.ruta}`} />
        <meta property="og:image" content={`${BASE}${p.hero.foto}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#fdfcfa" />
        <script type="application/ld+json">{JSON.stringify(datosEstructurados(p))}</script>
        {/* Las estrellas van en el negocio (LocalBusiness; no TravelAgency: la web dice que no es agencia): Google no admite reseñas dentro de un Service. */}
        {p.guia !== 'larion' && <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'LocalBusiness', '@id': NEGOCIO_ID, name: 'Tony Kansai Guide', url: `${BASE}/`, ...valoracionTony() })}</script>}
        {/* La página en sí: cuándo se revisó, de qué negocio es y qué servicio cuenta. */}
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${BASE}${p.ruta}`, url: `${BASE}${p.ruta}`,
          name: p.seo.titulo, inLanguage: p.lang, dateModified: ACTUALIZADO,
          publisher: { '@id': NEGOCIO_ID }, about: { '@id': `${BASE}${p.ruta}#servicio` },
        })}</script>
        {/* Las preguntas de la página, para que Google pueda enseñarlas en el resultado. */}
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: p.lang,
          mainEntity: (FAQ_LD_PORTADA[p.id] ?? p.faq.items).map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        })}</script>
        {/* Troncal: los planes de venta ya no se pintan en la portada (están en
            /es/precios/#planes), pero su OfferCatalog se queda en el JSON-LD de la
            portada, igual que estaba publicado (regla del rediseño: no tocar el JSON-LD). */}
        {troncal && <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', ...planesLD(p.lang as LangPlan, p.guia, `${BASE}${p.ruta}`) })}</script>}
        <script type="application/ld+json">{JSON.stringify(conToursNuevos(listaTours(p.guia === 'larion' ? CIUDADES_LARION : CIUDADES_TONY, p.lang, p.guia, p.ruta.replace(/\/$/, '')), p))}</script>
      </Helmet>

      <a className="v7-saltar" href="#contacto">{p.nav.contacto}</a>
      {/* Español: la cabecera común de todas las páginas (marca + ☰). EN/AR, la suya. */}
      {esEs ? <CabeceraEs activo="inicio" enPagina={[{ texto: 'Experiencias', ruta: '#experiencias' }, { texto: 'Precio', ruta: '#precios' }, { texto: 'Reseñas', ruta: '#resenas' }]} /> : <Cabecera p={p} troncal={troncal} />}

      <main ref={principal}>
        {/* Portada de revista: texto sobre papel a un lado y la foto vertical al
            otro, a sangre. Sin efectos encima: la foto y el titular bastan.
            Troncal (Tony): titular, una frase, UN botón de WhatsApp y la nota
            de las reseñas (único sitio con la cifra). El precio baja a #precios
            y las ventajas, a su página (enlace de la cabecera y del pie). */}
        <section className="v9-portada">
          <div className="v9-portada-texto">
            {/* El único rojo de la página. 日本 y no 関西 en la de Tony: guías por todo Japón. */}
            {!esEs && <span className="v9-sello" lang="ja" aria-hidden="true">{troncal ? '日本' : '関西'}</span>}
            <h1>{p.hero.titulo}</h1>
            <p>{p.hero.sub}</p>
            <div className="v7-acciones">
              {/* «Reservar» abre WhatsApp con el mensaje listo: es la reserva de verdad. */}
              <a className={`v7-boton${g.tg ? ' v7-tg' : ''}`} href={enlaceGuia(p.guia, msgCorto)} target="_blank" rel="noopener noreferrer" aria-label={`${p.hero.cta} — ${canal(p)}`}><IconoCanal tg={!!g.tg} /> {p.hero.cta}</a>
              {!troncal && <a className="v9-enlace" href="#contacto">{p.hero.cta2}</a>}
            </div>
            {g.tg && <p className="v7-nota-tg">Telegram {TG_LARION_VISIBLE} · {notaTg(p)} · WhatsApp <a href={WA_LARION_URL} target="_blank" rel="noopener noreferrer"><bdi dir="ltr">{WA_LARION_VISIBLE}</bdi></a></p>}
            {/* La nota sale de las reseñas reales; sin reseñas no se enseña nada. */}
            {resenas.length > 0 && (
              <p className="v7-hero-nota"><a href="#resenas">
                <span aria-hidden="true">★</span> {mediaResenas(resenas, p.lang)} · {resenas.length} {RESENAS_TXT[p.lang] ?? RESENAS_TXT.en}
              </a></p>
            )}
            {!troncal && VENTAJAS[p.id] && (
              <p className="v7-hero-ventajas"><Link to={VENTAJAS[p.id].ruta}>
                <span className="v7-hero-ventajas-pila" aria-hidden="true">
                  {MUESTRA_APPS.map((a) => (
                    <span key={a.clave} style={{ background: a.marca.fondo, color: a.marca.tinta }}>
                      {a.marca.logo ? <svg viewBox="0 0 24 24"><path d={LOGOS[a.marca.logo]} fill="currentColor" /></svg> : <b>{(a.marca.palabra ?? a.nombre).charAt(0)}</b>}
                    </span>
                  ))}
                </span>
                <span className="v7-hero-ventajas-texto"><strong>{VENTAJAS[p.id].titulo}</strong><small>{VENTAJAS[p.id].sub}</small></span>
                <span className="v7-hero-ventajas-flecha" aria-hidden="true">{p.dir === 'rtl' ? '←' : '→'}</span>
              </Link></p>
            )}
            {/* Lo que hay que saber antes de escribir: precio, grupo y recogida.
                Troncal: nada, porque la frase de debajo del titular ya dice «solo
                tu grupo» y «te recogemos en tu hotel», y el precio va una sola vez
                en #precios (Antonio: no repetir). */}
            {!troncal && (
              <ul className="v7-hero-datos">
                <li>{desdeHero(p.lang)}</li>
                {p.hero.chips.filter((c) => !/precio|price|سعر|цена/i.test(c)).map((c) => <li key={c}>{c}</li>)}
              </ul>
            )}
          </div>
          <div className="v9-portada-foto">
            {/* Troncal: el castillo de Himeji con cerezos (v7/fotos/portada*). Se veía
                borrosa: el panel de escritorio es vertical (≈ 700 × 900) y recortaba una
                foto apaisada de 900 px, y en el iPhone x3 «70vw» bajaba la de 900.
                Ahora hay un recorte vertical propio para escritorio y en el móvil se
                pide el ancho real (100vw), con un paso de 1200 px para pantallas x3.
                La mancha de tinta (HeroTinta, WebGL) ya no se monta en ninguna
                portada (decisión del 21-11, también /ru/ y /larion/). */}
            {esEs && <PlacaEs />}
            {troncal ? (
              <picture>
                <source media="(min-width: 901px)" srcSet={`${baseHero}-retrato-900.webp 720w, ${baseHero}-retrato.webp 1440w`} sizes={SIZES_PORTADA_ESCRITORIO} />
                <img srcSet={`${baseHero}-600.webp 600w, ${baseHero}-900.webp 900w, ${baseHero}-1200.webp 1200w, ${baseHero}.webp 1800w`} sizes="100vw" src={`${baseHero}.webp`} alt={p.hero.fotoAlt ?? p.hero.titulo} width={1800} height={1200} {...{ fetchpriority: 'high' }} />
              </picture>
            ) : (
              <img {...foto(p.hero.foto, SIZES_PORTADA)} alt={p.hero.fotoAlt ?? p.hero.titulo} width={1800} height={1200} {...{ fetchpriority: 'high' }} />
            )}
          </div>
        </section>

        {/* Troncal: tres experiencias que enlazan a sus páginas (en vez del
            mosaico de 7 ciudades con precio y «Reservar» en cada una). */}
        {esEs && seccionResenas}

        {esEs ? <LoQueHayEs p={p} /> : troncal && <Experiencias p={p} msg={msgCorto} />}

        {/* Las ciudades, cada una con su página (v8). En la troncal están en la
            columna «Destinos» del pie (y el JSON-LD ItemList las sigue listando). */}
        {!troncal && <Mosaico lang={p.lang} guia={p.guia} prefijo={p.ruta.replace(/\/$/, '')} />}

        {/* Tour de 2 h y tour en bici por Kioto (11-11-2026): solo eran de Tony y
            ahora viven en la página de Kioto, en /es/precios/ y en el pie («Guías y precios»). */}

        {/* Precios justo después de los tours: es lo primero que busca quien
            llega desde el móvil (Clarity, 23-10-2026), antes que las reseñas.
            Troncal: un solo precio de referencia; el resto, a dos clics. */}
        {esEs ? null : troncal ? <PrecioReferencia p={p} /> : (
          <section id="precios" className="v7-seccion">
            <h2>{p.precios.titulo}</h2>
            <Precios p={p} resenas={resenas} />
          </section>
        )}

        {/* Viajes a la RPDC del equipo, con Max (KndrVip.tsx, cargada aparte). Larion no va: solo tiene pasaporte japonés. */}
        {(p.id === 'ru' || p.id === 'larion') && (
          <Suspense fallback={<div id="kndr" style={{ minHeight: '100svh' }} />}>
            <KndrVip lang={p.id === 'ru' ? 'ru' : 'en'} tg={`https://t.me/${TG_TONY}`} />
          </Suspense>
        )}

        {/* Portada española: las reseñas van arriba, tras la portada (ver seccionResenas). */}
        {!esEs && seccionResenas}


        {/* Desde aquí hasta las preguntas, solo /ru/ y /larion/. En la troncal de
            Tony cada bloque sigue en su página, a dos clics (plan-contenido.md § 2.6):
            por qué/cómo funciona/qué incluye → /es/guia-espanol-kansai/ y /es/precios/#incluye;
            el guía → /es/guia-espanol-kansai/; Mira dentro → páginas de ciudad;
            montaña → tarjeta «Naturaleza»; herramientas y ventajas → pie y cabecera;
            el mercado (relojes) → guía práctica en «Destinos»; la oración en vivo,
            hoy solo en la portada árabe, queda pendiente de su página (/ar/mosques-kansai/). */}
        {!troncal && (<>
        {/* Así funciona + el guía, en una sola rejilla asimétrica (bento de soft-skill):
            la cara del guía manda, los tres pasos al lado y lo que no hacemos debajo. */}
        {/* Por qué conmigo: tres razones antes de contar cómo funciona. */}
        <section id="porque" className="v7-seccion v7-razones">
          <h2>{RAZONES[p.id].titulo}</h2>
          <ul>
            {RAZONES[p.id].lista.map(([k, t, d]) => (
              <li key={t}>
                <span className="v7-razon-kanji" lang="ja" aria-hidden="true">{k}</span>
                <h3>{t}</h3>
                <p>{visible(d)}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Para el público del Golfo: horarios de oración de hoy y qibla, en vivo. */}
        {p.lang === 'ar' && <Oracion />}

        {/* Quién soy: el guía, en su propia sección, antes de cómo funciona. */}
        <section id="guia" className="v7-seccion v9-guia" aria-label={p.guiaTxt.titulo}>
          <img loading="lazy" className="v9-guia-foto" src={g.foto} alt={NOMBRE_GUIA[p.id]} width={640} height={681} decoding="async" />
          <div className="v9-guia-texto">
            <p className="v9-guia-ante">{p.guiaTxt.titulo}</p>
            <h2>{NOMBRE_GUIA[p.id]}</h2>
            <ul className="v9-guia-idiomas" aria-label={p.guiaTxt.idiomas}>
              {p.guiaTxt.idiomas.split(' · ').map((l) => <li key={l}>{l}</li>)}
            </ul>
            {p.guiaTxt.bio.map((b) => <p key={b} className="v9-guia-bio">{b}</p>)}
            {/* Ficha rápida: los datos que un viajero (y ChatGPT) busca para
                decidir, juntos y en texto. Cuando ChatGPT encontró estos datos
                en la web, puso a Tony el primero (18-10-2026). */}
            {p.guia === 'tony' && FICHA_RAPIDA[p.lang] && (
              <dl className="v9-ficha">
                {FICHA_RAPIDA[p.lang].map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}
              </dl>
            )}
            <a className={`v7-boton${g.tg ? ' v7-tg' : ''}`} href={enlaceGuia(p.guia, msgCorto)} target="_blank" rel="noopener noreferrer"><IconoCanal tg={!!g.tg} /> {p.hero.cta}</a>
            {g.tg && <p className="v7-nota-tg">{notaTg(p)} · WhatsApp <a href={WA_LARION_URL} target="_blank" rel="noopener noreferrer"><bdi dir="ltr">{WA_LARION_VISIBLE}</bdi></a></p>}
            {/* 21-11-2026 (plan-equipo, paso 8): fuera el aviso «conoce a otro guía»;
                cada guía está en la franja del equipo, al final de la página. */}
          </div>
        </section>

        <section id="como" className="v7-seccion">
          <h2>{p.como.titulo}</h2>
          <ol className="v9-pasos">
            {p.como.pasos.map((s, i) => (
              <li key={s.t} className="tarjeta">
                <span className="v9-paso-num" aria-hidden="true">{i + 1}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
          {/* Qué incluye y qué no, juntos en una sola pieza (antes eran dos bloques
              que repetían «sin agencia» y «solo tu grupo» de «Por qué conmigo»). */}
          <div className="v7-bento-incluye tarjeta">
            {p.como.si && (
              <div className="v7-bento-si">
                <h3>{p.como.si.titulo}</h3>
                <ul>{p.como.si.items.map((n) => <li key={n}>{n}</li>)}</ul>
              </div>
            )}
            <div className="v7-bento-no">
              <h3>{p.como.noTitulo}</h3>
              <ul>{p.como.no.map((n) => <li key={n}>{n}</li>)}</ul>
            </div>
          </div>
        </section>

        {/* «Un día conmigo» en manga, justo después de contar cómo funciona. */}
        {HISTORIA_LISTA.includes(`${p.guia}-dia`) && (
          <HistoriaManga
            quien={NOMBRE_GUIA[p.id]}
            sello="旅"
            capitulo={({ es: 'Prólogo', en: 'Prologue', ar: 'تمهيد', ru: 'Пролог' } as Record<string, string>)[p.lang]}
            titulo={DIA[p.lang].titulo}
            poema={DIA[p.lang].poema}
            etiquetaPoema={ROTULOS[p.lang].poema}
            vinetas={DIA[p.lang].vinetas.map((texto, i) => ({ src: `/v8/historia/${p.guia}-dia-${i + 1}.webp`, forma: i === 0 || i === 3 ? 'ancha' : 'alta', texto }))}
          />
        )}

        {/* Rutas con modelo 3D */}
        <MiraDentro lang={p.lang} guia={p.guia} prefijo={p.ruta.replace(/\/$/, '')} />

        {/* Puerta a la página de montaña, para quien ya conoce las ciudades */}
        <section className="v7-seccion">
          <Link to={PUERTA_MONTANA[p.id].ruta} className="v7-puerta-montana">
            <span className="v7-kanji" lang="ja">山</span>
            <span><strong>{PUERTA_MONTANA[p.id].titulo}</strong><small>{PUERTA_MONTANA[p.id].sub}</small></span>
            <span aria-hidden="true">{p.dir === 'rtl' ? '←' : '→'}</span>
          </Link>
        </section>

        {/* Las herramientas gratis y las ventajas de los socios (HerramientasEnGuia,
            VentajasEnGuia) eran solo de Tony: desde el 21-11-2026 viven en sus páginas
            (/es/herramientas/, /es/ventajas/), enlazadas desde la cabecera y el pie. */}

        {/* El mercado: husos, divisas y lo que le importa a ese público */}
        <section className="v7-seccion v7-mercado tarjeta">
          <div>
            <h2>{p.mercado.titulo}</h2>
            {p.mercado.texto.map((t) => <p key={t}>{t}</p>)}
            {p.mercado.enlaces?.map((e) => <p key={e.ruta} className="v7-temporada-enlace"><Link to={e.ruta}>{e.texto} {p.dir === 'rtl' ? '←' : '→'}</Link></p>)}
          </div>
          <Relojes p={p} />
        </section>
        </>)}

        {/* Preguntas. Troncal: todas dentro de un solo plegable (una línea en el
            móvil). Siguen en el DOM, así que el JSON-LD FAQPage sigue respaldado y
            textos-ia.mjs las copia en index.md. El h2 va dentro del <summary>. */}
        {esEs ? null : troncal ? (
          <section className="v7-seccion v7-faq-troncal">
            <details className="v7-faq-plegada">
              <summary><h2>{PREGUNTAS_FRECUENTES[p.lang] ?? p.faq.titulo} <span className="v7-faq-cuantas">({p.faq.items.length})</span></h2></summary>
              <div className="v7-faq">
                {p.faq.items.map((f) => (
                  <details key={f.q}>
                    <summary>{visible(f.q)}</summary>
                    <p>{visible(f.a)}</p>
                    {f.enlace && <p><a href={f.enlace.href}>{f.enlace.texto}</a></p>}
                  </details>
                ))}
              </div>
            </details>
          </section>
        ) : (
          <section className="v7-seccion v7-faq-seccion">
            <h2>{p.faq.titulo}</h2>
            <div className="v7-faq">
              {p.faq.items.map((f) => (
                <details key={f.q}>
                  <summary>{visible(f.q)}</summary>
                  <p>{visible(f.a)}</p>
                  {/* /fr/ y similares son HTML estático, fuera del router: <a>, no <Link>. */}
                  {f.enlace && <p><a href={f.enlace.href}>{f.enlace.texto}</a></p>}
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Libro de sellos y planes de venta: solo /ru/ y /larion/. En la troncal,
            los sellos siguen en cada página de ciudad y los planes (con su
            OfferCatalog) en /es/precios/#planes y /es/ventajas/. */}
        {!troncal && <LibroSellos lang={p.lang} guia={p.guia} prefijo={p.ruta.replace(/\/$/, '')} />}

        {/* Planes de venta: guía + experiencias de los socios (datosPlanes.ts) */}
        {!troncal && <PlanesVenta lang={p.lang} guia={p.guia} url={`${BASE}${p.ruta}`} />}

        {/* Contacto */}
        {/* Español: tras el contacto, lo demás plegado (temporada, ficha, preguntas). */}
        {esEs && <><ContactoTroncal p={p} msg={msgCorto} /><MasEs p={p} /></>}
        {esEs ? null : troncal ? <ContactoTroncal p={p} msg={msgCorto} /> : (
          <section id="contacto" className="v7-seccion">
            <h2>{p.contacto.titulo}</h2>
            <p className="v7-entradilla">{p.contacto.sub}</p>
            <Contacto p={p} />
          </section>
        )}
      </main>
      <BarraMovil p={p} href={enlaceGuia(p.guia, msgCorto)} conResenas={!!p.resenas && resenas.length > 0} troncal={troncal} />

      {/* La franja de descuentos (y sus burbujas) sale de la troncal: las ventajas
          tienen su página, enlazada desde la cabecera y el pie. */}
      {!troncal && <FranjaVentajas lang={p.lang} />}

      {/* Portada española: pie limpio de un solo índice (PieEs). */}
      {esEs ? <PieEs p={p} /> : (
      <footer className="v7-pie">
        <div className="v7-pie-fila">
          <div>
            <strong><Logo /></strong>
            <p>{p.pie.lema}</p>
            <p className="v7-pie-wa"><a href={enlaceGuia(p.guia, msgCorto)} target="_blank" rel="noopener noreferrer"><IconoCanal tg={!!g.tg} /> <bdi dir="ltr">{g.tg ? `Telegram ${TG_LARION_VISIBLE}` : telefono(g.wa ?? '')}</bdi></a></p>
            {g.tg && <p className="v7-nota-tg">{notaTg(p)} · WhatsApp <a href={WA_LARION_URL} target="_blank" rel="noopener noreferrer"><bdi dir="ltr">{WA_LARION_VISIBLE}</bdi></a></p>}
            <p><a href={`mailto:${CORREO}`}>{CORREO}</a></p>
          </div>
          {/* Columnas cortas con título (patrón de nawatravel.ae): en el móvil son
              acordeones cerrados (PieColumna los cierra tras montar); el HTML las
              trae abiertas, así Google y las IAs leen todos los enlaces. */}
          {/* Las páginas de respuesta no salían enlazadas desde ningún sitio (solo el
              sitemap): Google y las IAs dan menos peso a una página huérfana. */}
          {p.guia === 'tony' && RESPUESTAS_PROPIAS.some(([, r]) => r.lang === p.lang) && (
            <PieColumna lang={p.lang} titulo={RESPUESTAS_TITULO[p.lang] ?? 'Guides'}>
              {RESPUESTAS_PROPIAS.filter(([, r]) => r.lang === p.lang).map(([, r]) => (
                <Link key={r.ruta} to={r.ruta}>{r.titulo}</Link>
              ))}
            </PieColumna>
          )}
          {/* Destinos (troncal): las ciudades que antes enseñaba el mosaico de la
              portada, las rutas fuera de Kansai, la montaña, las temporadas y la guía
              práctica. Así cada URL del JSON-LD ItemList sigue enlazada desde la
              portada, y ganan enlace /es/rutas/, la sakura y /es/destinos/. */}
          {troncal && p.destinosTitulo && (
            <PieColumna lang={p.lang} titulo={p.destinosTitulo}>
              {CIUDADES_TONY.map((c) => (
                <Link key={c} to={`${p.ruta}${c}/`}>{CIUDADES[c].nombre[p.lang as Lengua]}</Link>
              ))}
              {DESTINOS_EXTRA[p.lang]?.map((d) => (
                // /es/destinos/ es HTML estático (scripts/destinos.mjs): <a>, no <Link>.
                d.estatica ? <a key={d.ruta} href={d.ruta}>{d.texto}</a> : <Link key={d.ruta} to={d.ruta}>{d.texto}</Link>
              ))}
              {p.mercado.enlaces?.map((e) => <Link key={e.ruta} to={e.ruta}>{e.texto}</Link>)}
            </PieColumna>
          )}
          {/* 21-11-2026 (crítica): «Aviso legal» era la primera columna y llevaba dentro
              Ventajas, Yuru Camp, TikTok… Ahora lo útil va en «Más» y lo legal, al final. */}
          <PieColumna lang={p.lang} titulo={MAS_PIE[p.lang] ?? MAS_PIE.en}>
            {VENTAJAS[p.id] && <Link to={VENTAJAS[p.id].ruta}>{VENTAJAS[p.id].corto}</Link>}
            {/* La guía halal vive fuera de la web; enlazarla aquí ayuda a que Google la descubra. */}
            {p.lang === 'ar' && <a href="https://2troll.github.io/yubisashi/dalil/">دليل الحلال في كانساي</a>}
            {p.id === 'en' && <a href="https://2troll.github.io/yubisashi/panduan/" lang="id">Panduan Halal Kansai</a>}
            {p.id === 'ar' && <a href="https://2troll.github.io/yubisashi/">تطبيق المحادثة للمطاعم</a>}
            {/* App de Yuru Camp△ de Tony: enlazarla desde aquí ayuda a que Bing (y ChatGPT) la descubran. */}
            {p.guia === 'tony' && p.lang === 'es' && <a href="https://2troll.github.io/yurucamp-mapa/guia/">Mapa de Yuru Camp△ (anime)</a>}
            {p.guia === 'tony' && p.lang === 'en' && <a href="https://2troll.github.io/yurucamp-mapa/guia/en.html">Yuru Camp△ anime map</a>}
            {/* Sitios virales de TikTok por temporada + Ruta TikTok (HTML estático, scripts/tiktok.mjs). */}
            {p.guia === 'tony' && (p.lang === 'es' || p.lang === 'en' || p.lang === 'ar') && (
              <a href={p.lang === 'es' ? '/tiktok/' : `/tiktok/${p.lang}/`}>
                {p.lang === 'ar' ? 'يابان تيك توك · سعر خاص' : p.lang === 'es' ? 'Japón de TikTok · precio especial' : 'TikTok Japan · special price'}
              </a>
            )}
            {/* Herramientas gratis (HTML estático, scripts/herramientas*.mjs). */}
            {p.guia === 'tony' && esLenguaKit(p.lang) && (
              <a href={HERRAMIENTAS[p.lang].hub}>
                {p.lang === 'ar' ? 'أدوات مجانية للسفر في كانساي' : p.lang === 'es' ? 'Herramientas gratis para Kansai' : 'Free Kansai travel tools'}
              </a>
            )}
            {/* Calculadora «¿te compensa un guía privado?» (HTML estático, scripts/calculadora.mjs). */}
            {p.guia === 'tony' && (p.lang === 'es' || p.lang === 'en' || p.lang === 'ar') && (
              <a href={p.lang === 'es' ? '/es/calculadora-guia/' : `/${p.lang}/private-guide-calculator/`}>
                {p.lang === 'ar' ? 'هل يستحق المرشد الخاص؟ حاسبة' : p.lang === 'es' ? '¿Te compensa un guía? Calculadora' : 'Is a private guide worth it? Calculator'}
              </a>
            )}
            {/* Perfil de leyendas de Tony (HTML estático, scripts/leyendas.mjs). */}
            {p.guia === 'tony' && (p.lang === 'es' || p.lang === 'en' || p.lang === 'ar') && (
              <a href={p.lang === 'es' ? '/es/leyendas/' : p.lang === 'en' ? '/en/legends/' : '/ar/asatir/'}>
                {p.lang === 'ar' ? 'أساطير اليابان وأماكنها المفقودة' : p.lang === 'es' ? 'Leyendas y lugares perdidos de Japón' : 'Legends and lost places of Japan'}
              </a>
            )}
          </PieColumna>
          <PieColumna lang={p.lang} titulo={p.pie.otrosIdiomas}>
            {(Object.keys(PAGINAS) as PaginaId[]).filter((k) => k !== p.id).map((k) => (
              <Link key={k} to={PAGINAS[k].ruta} lang={PAGINAS[k].lang}>
                {k === 'larion' ? 'English · Larion' : HERMANAS[PAGINAS[k].guia].find((h) => h.id === k)?.etiqueta}
              </Link>
            ))}
            {/* 21-11-2026 (plan-equipo, paso 8): /tr/, /fr/, /private/ y /familias/
                ya no se repiten aquí: los lleva la franja del equipo, justo debajo. */}
            <a href={p.lang === 'ar' ? '/partners/?lang=ar' : p.lang === 'es' ? '/partners/' : '/partners/?lang=en'}>
              {p.lang === 'ar' ? 'للوكالات · Hanma Travel Partners' : p.lang === 'es' ? 'Agencias · Hanma Travel Partners' : 'Agencies · Hanma Travel Partners'}
            </a>
            {/* Presupuesto de guía para agencias: formularios de Fillout (plan gratis), uno por idioma. */}
            {p.guia === 'tony' && (
              <a
                href={p.lang === 'ar' ? 'https://forms.fillout.com/t/encVfQCtzEus' : p.lang === 'es' ? 'https://forms.fillout.com/t/3Pq2Nob6Wkus' : 'https://forms.fillout.com/t/shhKbMZeRtus'}
                target="_blank"
                rel="noopener"
              >
                {p.lang === 'ar' ? 'للوكالات · اطلب عرض سعر' : p.lang === 'es' ? 'Agencias · Pide presupuesto de guía' : 'Agencies · Request a guide quote'}
              </a>
            )}
            {p.guia === 'larion' && <a href="/ru/kndr/" lang="ru">Туры в КНДР · Макс</a>}
            {p.guia === 'larion' && <a href="/ru/otvety/" lang="ru">Гид на русском: ответы · Ларион</a>}
          </PieColumna>
          <PieColumna lang={p.lang} titulo={p.pie.legal}>
            <Link to={`/legal/?lang=${p.lang}`}>{p.pie.legal}</Link>
            <Link to={`/privacy/?lang=${p.lang}`}>{p.pie.privacidad}</Link>
            <Link to={`/terms/?lang=${p.lang}`}>{p.pie.condiciones}</Link>
            <Link to={`/cookies/?lang=${p.lang}`}>{p.pie.cookies}</Link>
          </PieColumna>
          {/* Solo el grupo: cada marca va por separado y únicamente HBH las reúne todas.
              Un cliente de café vio la marca de guía y se confundió (20-11-2026). */}
          <PieColumna lang={p.lang} titulo="HBH Group">
            <a href={`https://hbh.tonykansaiguide.com/${p.lang === 'es' || p.lang === 'ar' ? p.lang + '/' : ''}`}>
              {p.lang === 'ar' ? 'Tony Kansai Guide شركة من مجموعة HBH' : p.lang === 'es' ? 'Tony Kansai Guide es una empresa de HBH Group' : 'Tony Kansai Guide is a company of HBH Group'}
            </a>
          </PieColumna>
        </div>
        <Creditos p={p} />
      </footer>
      )}
    </div>
  )
}
