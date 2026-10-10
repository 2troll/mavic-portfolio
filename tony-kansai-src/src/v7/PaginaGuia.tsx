// Página de un idioma: un público, un guía, todo en una sola página.
// Orden pensado para quien llega sin saber nada: qué es → cómo funciona →
// quién → dónde → cuánto → de dónde vienes → preguntas → escribir.

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Mosaico } from '../v8/Mosaico'
import { LibroSellos } from '../v9/Sellos'
import { PAGINAS, HERMANAS, GUIAS, NOMBRE_GUIA, CREDITOS, CORREO, PAYPAL_TONY, PAGAR } from './contenido'
import type { PaginaId, Pagina, DatosContacto } from './contenido'
import { useLanguage } from '../contexts/LanguageContext'
import { foto } from './foto'
import { BotonSonido } from './BotonSonido'
import { HeroTinta } from './HeroTinta'
import { CREDITOS_SONIDO } from './sonido'
import { Logo } from './Logo'
import { useCambio } from './cambio'
import './v7.css'
import './estilo-pixel.css'
import { IconoWa } from './IconoWa'
import './figuras.css'
import { HistoriaManga } from '../v8/HistoriaManga'
import { DIA, HISTORIA_LISTA, ROTULOS } from '../v8/historia'
import { BotonTema } from './Tema'
import { PRECIO } from './datosRutas'
import { listaTours } from '../v8/seoTours'
import { CIUDADES_LARION, CIUDADES_TONY } from '../v8/ciudades'
import { CuandoCerca } from './CuandoCerca'
import { MiraDentro } from '../v8/MiraDentro'
import { Oracion } from '../v8/Oracion'
import { enlacesHreflang } from '../seo/hreflang'

// El 3D (three.js) llega después de pintar la foto de portada.

const BASE = 'https://tonykansaiguide.com'

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

// ── Utilidades ───────────────────────────────────────────────────────────────

/** Número legible según el país: España +34 634 193 106; Japón +81 80 8506 7586. */
function telefono(n: string) {
  return n.startsWith('34') ? `+34 ${n.slice(2, 5)} ${n.slice(5, 8)} ${n.slice(8)}` : `+${n.slice(0, 2)} ${n.slice(2, 4)} ${n.slice(4, 8)} ${n.slice(8)}`
}

function enlaceWa(numero: string, texto: string) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
}

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

interface Resena { id: string; stars: number; name: string; country: string; tour: string; text: string; photo?: string; date: string
  lang?: string; traducciones?: Record<string, string>
  /** Nombre, procedencia y lugar ya escritos en otro idioma (las de Larion, en inglés). */
  meta?: Record<string, { name: string; country: string; tour: string }> }

// Bandera por país (en ruso o inglés, como venga): da a cada tarjeta algo propio.
const BANDERAS: [RegExp, string][] = [
  [/Росси|Russia/, '🇷🇺'], [/Казахстан|Kazakhstan/, '🇰🇿'], [/Беларусь|Belarus/, '🇧🇾'], [/Украин|Ukrain/, '🇺🇦'],
  [/Узбекистан|Uzbekistan/, '🇺🇿'], [/Кыргызстан|Kyrgyz/, '🇰🇬'], [/Армени|Armenia/, '🇦🇲'], [/Молдов|Moldova/, '🇲🇩'],
  [/Грузи|Georgia/, '🇬🇪'], [/Азербайджан|Azerbaijan/, '🇦🇿'], [/Литв|Lithuania/, '🇱🇹'], [/Латви|Latvia/, '🇱🇻'],
  [/Эстони|Estonia/, '🇪🇪'], [/España|Spain|Испани/, '🇪🇸'], [/México|Mexico/, '🇲🇽'],
]
const bandera = (pais: string) => BANDERAS.find(([re]) => re.test(pais))?.[1] ?? ''
// Color del círculo por nombre: estable entre visitas y distinto entre vecinos.
const hashNombre = (n: string) => [...n].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
// Cada cliente, una foto de perfil propia, como en redes: 240 avatares de DiceBear
// (18 estilos mezclados al azar, generados en local) en /v7/avatares/a000…a239.svg.
// Se reparten sin repetir y sin orden visible: el punto de partida sale del id.
const AVATARES = 240
function repartoIconos(lista: { id: string }[]) {
  const usados = new Set<number>()
  const reparto = new Map<string, string>()
  for (const r of lista) {
    // Mezcla el hash: ids casi iguales (larion-001, -002…) deben caer lejos.
    let h = hashNombre(r.id)
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0
    let i = h % AVATARES
    if (usados.size >= AVATARES) usados.clear()
    while (usados.has(i)) i = (i + 1) % AVATARES
    usados.add(i)
    reparto.set(r.id, `/v7/avatares/a${String(i).padStart(3, '0')}.svg`)
  }
  return reparto
}
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

function useResenas(activas: boolean, fuente?: string) {
  const [lista, setLista] = useState<Resena[]>([])
  useEffect(() => {
    if (!activas) return
    // Dos fuentes, como resenas.html: las aprobadas desde el móvil (Worker) y las
    // de reviews.json (Mac). Se unen quitando repetidas por id.
    const traer = (u: string) => fetch(u, { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null)).catch(() => null)
    Promise.all(fuente ? [traer(fuente)] : [traer('/api/resenas/publicas'), traer('/reviews.json')]).then((fuentes) => {
      const vistos = new Set<string>()
      const todas: Resena[] = []
      for (const d of fuentes) for (const r of (d?.reviews ?? []) as Resena[]) {
        if (!r?.text || !r.stars || vistos.has(r.id)) continue
        vistos.add(r.id); todas.push(r)
      }
      setLista(todas)
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

function Cabecera({ p }: { p: Pagina }) {
  const activa = useSeccionActiva(['zona', 'ciudades', 'rutas', 'como', 'precios', 'contacto'])
  const g = GUIAS[p.guia]
  const msg = p.contacto.plantilla(VACIO)
  return (
    <header className="v7-cabecera cristal">
      <Link to="/" className="v7-marca" aria-label="Tony Kansai Guide"> <Logo />
      </Link>
      <nav className="v7-anclas" aria-label={p.nav.idioma}>
        {([['ciudades', p.nav.zona], ['rutas', ({ es: 'Mira dentro', en: 'Step inside', ar: 'ادخل إلى المشهد', ru: 'Загляните внутрь' } as Record<string, string>)[p.lang]], ['como', p.nav.como], ['precios', p.nav.precios]] as const).map(([id, txt]) => (
          <a key={id} href={`#${id}`} aria-current={activa === id ? 'location' : undefined}>{txt}</a>
        ))}
      </nav>
      <nav className="v7-idiomas" aria-label={p.nav.idioma}>
        {HERMANAS[p.guia].map((h) => (
          <Link key={h.id} to={PAGINAS[h.id].ruta} lang={PAGINAS[h.id].lang} aria-current={h.id === p.id ? 'page' : undefined}>
            {h.etiqueta}
          </Link>
        ))}
      </nav>
      <BotonTema lang={p.lang} />
      <BotonSonido lang={p.lang} ambiente="ciudad" />
      <a className="v7-boton v7-boton-peq" href={enlaceWa(g.wa, msg)} target="_blank" rel="noopener noreferrer" aria-label={`${p.nav.contacto} — WhatsApp`}>
        <IconoWa /> <span className="v7-solo-ancho">{p.nav.contacto}</span>
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

/** Ejemplo de fechas en el formulario: noviembre, que es la temporada que vendemos. */
const EJ_FECHAS: Record<string, string> = { es: '18–21 nov.', en: '18–21 Nov', ar: '18–21 نوفمبر', ru: '18–21 нояб.' }

const VER_MAS: Record<string, string> = { es: 'Ver más reseñas', en: 'More reviews', ar: 'المزيد من التقييمات', ru: 'Показать ещё' }
const RESENAS_TXT: Record<string, string> = { es: 'reseñas de clientes', en: 'guest reviews', ar: 'تقييمات العملاء', ru: 'отзывы гостей' }
const mediaResenas = (l: Resena[], lang: string) =>
  (l.reduce((a, r) => a + r.stars, 0) / l.length).toLocaleString(lang === 'ar' ? 'ar-u-nu-latn' : lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })

const RESERVAR_PLAN: Record<string, string> = { es: 'Reservar por WhatsApp', en: 'Book on WhatsApp', ar: 'احجز عبر واتساب', ru: 'Забронировать в WhatsApp' }
const PAGO_ADELANTADO: Record<string, string> = { es: 'o paga por adelantado con PayPal', en: 'or pay in advance with PayPal', ar: 'أو ادفع مسبقاً عبر PayPal', ru: 'или оплатить заранее через PayPal' }

const RECOMENDADO: Record<string, string> = { es: 'Recomendado', en: 'Recommended', ar: 'ننصح به', ru: 'Рекомендуем' }

function Precios({ p }: { p: Pagina }) {
  // Solo en las páginas de Tony: el PayPal es suyo.
  const pagar = p.guia === 'tony' ? PAGAR[p.lang] : undefined
  const cambios = useCambio(p.mercado.divisas)
  const otono = useEsOtono()
  const fmt = (n: number, divisa: string) => {
    try {
      return new Intl.NumberFormat(p.lang === 'ar' ? 'ar-u-nu-latn' : p.lang, { style: 'currency', currency: divisa, maximumFractionDigits: 0, useGrouping: 'always' } as unknown as Intl.NumberFormatOptions).format(n)
    } catch { return `${Math.round(n)} ${divisa}` }
  }
  return (
    <>
      {otono && p.precios.temporada && (
        <aside className="v7-temporada tarjeta">
          <h3>🍁 {p.precios.temporada.titulo}</h3>
          <p>{p.precios.temporada.texto}</p>
          {p.precios.temporada.enlace && p.id !== 'larion' && <p className="v7-temporada-enlace"><Link to={p.precios.temporada.enlace.ruta}>{p.precios.temporada.enlace.texto} →</Link></p>}
        </aside>
      )}
      <div className="v7-planes">
        {p.precios.planes.map((plan, i) => (
          // El día completo es lo que más rinde al cliente: se destaca con tinta, no con altura.
          <article key={plan.nombre} className={`v7-plan tarjeta ${i === 1 ? 'v7-plan-destacado' : ''}`}>
            {i === 1 && <p className="v7-plan-sello">{RECOMENDADO[p.lang] ?? RECOMENDADO.en}</p>}
            <h3>{plan.nombre}</h3>
            <p className="v7-plan-detalle">{plan.detalle}</p>
            <p className="v7-plan-precio">{plan.desde && <span className="v7-plan-desde">{p.precios.desde} </span>}<bdi>{plan.precio}</bdi></p>
            <p className="v7-plan-grupo">{p.precios.porGrupo}</p>
            {p.precios.porPersona && !plan.desde && <p className="v7-plan-persona">{p.precios.porPersona(plan.yenes)}</p>}
            {/* Primero se habla (WhatsApp con el plan ya escrito) y luego se paga:
                el botón grande de pagar antes de escribir echaba para atrás. */}
            <a className="v7-plan-pagar" href={enlaceWa(GUIAS[p.guia].wa, p.contacto.plantilla({ ...VACIO, intereses: [plan.nombre] }))} target="_blank" rel="noopener noreferrer"
              onClick={() => window.gtag?.('event', 'generate_lead', { pagina: p.id, valor: plan.yenes, canal: 'whatsapp-precio' })}>
              {RESERVAR_PLAN[p.lang] ?? RESERVAR_PLAN.en}
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
      <form className="v7-formulario tarjeta" onSubmit={(e) => { e.preventDefault(); avisaAnalytics('whatsapp'); window.open(enlaceWa(g.wa, msg), '_blank', 'noopener') }}>
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
          <button type="submit" className="v7-boton"><IconoWa /> {p.contacto.wa}</button>
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

/** En móvil, el botón de WhatsApp se queda abajo en cuanto se deja atrás la portada. */
function BarraMovil({ p, href }: { p: Pagina; href: string }) {
  const [ver, setVer] = useState(false)
  useEffect(() => {
    const hero = document.querySelector('.v7-hero')
    const contacto = document.getElementById('contacto')
    if (!hero) return
    let pasada = false, enContacto = false
    const pinta = () => setVer(pasada && !enContacto)
    const io = new IntersectionObserver((es) => {
      for (const e of es) {
        if (e.target === hero) pasada = !e.isIntersecting
        if (e.target === contacto) enContacto = e.isIntersecting
      }
      pinta()
    })
    io.observe(hero)
    if (contacto) io.observe(contacto)
    return () => io.disconnect()
  }, [])
  return (
    <div className={`v7-barra-movil cristal ${ver ? 'ver' : ''}`} aria-hidden={!ver}>
      <a className="v7-boton" href={href} target="_blank" rel="noopener noreferrer" tabIndex={ver ? 0 : -1}><IconoWa /> {p.hero.cta}</a>
    </div>
  )
}

/** Para Google: el guía (con sus idiomas), la zona y las tres tarifas. */
function datosEstructurados(p: Pagina) {
  const g = GUIAS[p.guia]
  const idiomas = p.guia === 'larion' ? ['ru', 'en'] : ['es', 'en', 'ar']
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: p.seo.titulo.split(' | ')[0],
    description: p.seo.descripcion,
    url: `${BASE}${p.ruta}`,
    inLanguage: p.lang,
    serviceType: 'Private tour guide',
    areaServed: p.zona.lugares.map((l) => ({ '@type': 'Place', name: l.nombre, geo: { '@type': 'GeoCoordinates', latitude: l.lat, longitude: l.lon } })),
    availableLanguage: idiomas,
    provider: {
      '@type': 'Person',
      name: g.nombre,
      image: `${BASE}${g.foto}`,
      jobTitle: 'Private tour guide',
      knowsLanguage: idiomas,
      telephone: `+${g.wa}`,
      worksFor: { '@type': 'LocalBusiness', name: 'Tony Kansai Guide', url: BASE, email: CORREO },
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

/** Pase de la portada: la foto de siempre primero y dos destinos más de ese público. */
const FOTOS_HERO: Record<PaginaId, string[]> = {
  es: ['/v7/fotos/kioto.jpg', '/v7/fotos/osaka.jpg', '/v7/fotos/nara.jpg'],
  en: ['/v7/fotos/nara.jpg', '/v7/fotos/kioto.jpg', '/v7/fotos/himeji.jpg'],
  ar: ['/v7/fotos/osaka.jpg', '/v7/fotos/kobe.jpg', '/v7/fotos/kioto.jpg'],
  // Sin la Cúpula de la Bomba: en la portada pasan el guía en manga y las hojas
  // de la estación, y delante de un memorial no tocan. Se ve en la página de Hiroshima.
  ru: ['/v7/fotos/miyajima.jpg', '/v7/fotos/kioto.jpg', '/v7/fotos/himeji.jpg'],
  larion: ['/v7/fotos/miyajima.jpg', '/v7/fotos/himeji.jpg', '/v7/fotos/kioto.jpg'],
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
    ['直', 'Напрямую', 'Вы договариваетесь с гидом, без агентства: кто отвечает в WhatsApp, тот и встречает вас.'],
    ['語', 'На вашем языке', 'Веду туры на русском и на английском.'],
    ['組', 'Только ваша компания', 'Фиксированная цена за группу до 6 человек и бесплатная отмена не позднее чем за 72 часа.'],
  ] },
  larion: { titulo: 'Why book with me', lista: [
    ['直', 'Direct contact', 'You book with your guide, not an agency: the person who answers on WhatsApp is the one who meets you.'],
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

export default function PaginaGuia({ id }: { id: PaginaId }) {
  const p = PAGINAS[id]
  const g = GUIAS[p.guia]
  const { setLang } = useLanguage()
  const resenas = useResenas(!!p.resenas, p.resenas?.fuente)
  // Con 200 reseñas la sección sería un muro: se abren por tandas.
  const [verResenas, setVerResenas] = useState(12)
  const [filtroEstrellas, setFiltroEstrellas] = useState(0)
  const iconos = useMemo(() => repartoIconos(resenas), [resenas])
  const resenasVistas = filtroEstrellas ? resenas.filter((r) => r.stars === filtroEstrellas) : resenas

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

  return (
    <div className={`v7 v7-pagina lang-${p.lang}`} lang={p.lang} dir={p.dir}>
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
        <meta name="theme-color" content="#f5f5f7" />
        <script type="application/ld+json">{JSON.stringify(datosEstructurados(p))}</script>
        {/* Las preguntas de la página, para que Google pueda enseñarlas en el resultado. */}
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: p.lang,
          mainEntity: p.faq.items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        })}</script>
        <script type="application/ld+json">{JSON.stringify(listaTours(p.guia === 'larion' ? CIUDADES_LARION : CIUDADES_TONY, p.lang, p.guia, p.ruta.replace(/\/$/, '')))}</script>
      </Helmet>

      <a className="v7-saltar" href="#contacto">{p.nav.contacto}</a>
      <Cabecera p={p} />

      <main>
        {/* Portada de revista: texto sobre papel a un lado y la foto vertical al
            otro, a sangre. Sin efectos encima: la foto y el titular bastan. */}
        <section className="v9-portada">
          <div className="v9-portada-texto">
            <span className="v9-sello" lang="ja" aria-hidden="true">関西</span>
            <h1>{p.hero.titulo}</h1>
            <p>{p.hero.sub}</p>
            <div className="v7-acciones">
              {/* «Reservar» abre WhatsApp con el mensaje listo: es la reserva de verdad. */}
              <a className="v7-boton" href={enlaceWa(g.wa, msgCorto)} target="_blank" rel="noopener noreferrer" aria-label={`${p.hero.cta} — WhatsApp`}><IconoWa /> {p.hero.cta}</a>
              <a className="v9-enlace" href="#contacto">{p.hero.cta2}</a>
            </div>
            {/* La nota sale de las reseñas reales; sin reseñas no se enseña nada. */}
            {resenas.length > 0 && (
              <p className="v7-hero-nota"><a href="#resenas">
                <span aria-hidden="true">★</span> {mediaResenas(resenas, p.lang)} · {resenas.length} {RESENAS_TXT[p.lang] ?? RESENAS_TXT.en}
              </a></p>
            )}
            {/* Lo que hay que saber antes de escribir: precio, grupo y recogida. */}
            <ul className="v7-hero-datos">
              <li>{desdeHero(p.lang)}</li>
              {p.hero.chips.filter((c) => !/precio|price|سعر|цена/i.test(c)).map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
          <div className="v9-portada-foto">
            <img {...foto(p.hero.foto, '(max-width: 900px) 100vw, 50vw')} alt="" width={1800} height={1200} {...{ fetchpriority: 'high' }} />
            <HeroTinta fotos={FOTOS_HERO[p.id]} />
          </div>
        </section>

        {/* Cómo funciona */}
        {/* Las ciudades, cada una con su página (v8) */}
        <Mosaico lang={p.lang} guia={p.guia} prefijo={p.ruta.replace(/\/$/, '')} />

        {/* Reseñas reales, justo después de los tours: el cliente quiere ver pronto que otros quedaron contentos. */}
        {p.resenas && resenas.length > 0 && (
          <section className="v7-seccion" id="resenas">
            <h2>{p.resenas.titulo}</h2>
            {p.resenas.nota && <p className="v7-entradilla">{p.resenas.nota}</p>}
            <p className="v7-opinar"><a href={`/opinar.html?lang=${p.lang}`}>{p.resenas.opinar} {p.dir === 'rtl' ? '←' : '→'}</a></p>
            {resenas.length >= 20 && (() => {
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
            <div className="v7-resenas">
              {resenasVistas.slice(0, verResenas).map((r) => {
                const m = r.meta?.[p.lang]
                const nombre = m?.name ?? r.name, pais = m?.country ?? r.country, lugar = m?.tour ?? r.tour
                const texto = r.traducciones?.[p.lang] ?? r.text
                return (
                <figure key={r.id} className={`tarjeta${texto.length < 110 ? ' v7-resena-corta' : ''}`}>
                  <div className="v7-resena-cabeza">
                    <div className="v7-estrellas" aria-label={`${r.stars}/5`}>{'★'.repeat(r.stars)}<span className="v7-estrellas-vacias">{'★'.repeat(5 - r.stars)}</span></div>
                    {lugar && <span className="v7-resena-lugar">{lugar}</span>}
                  </div>
                  <TextoResena r={r} lang={p.lang} />
                  <figcaption>
                    <img className="v7-resena-avatar" src={iconos.get(r.id)} alt="" loading="lazy" width="52" height="52" />
                    <span><strong>{nombre}</strong><small>{bandera(pais)} {pais}</small></span>
                  </figcaption>
                  {r.photo && <img loading="lazy" src={r.photo.startsWith('/') ? r.photo : `/${r.photo}`} alt="" />}
                </figure>
                )
              })}
            </div>
            {resenasVistas.length > verResenas && (
              <p className="v7-ver-mas"><button type="button" onClick={() => setVerResenas((n) => n + 24)}>
                {VER_MAS[p.lang] ?? VER_MAS.en} ({resenasVistas.length - verResenas})
              </button></p>
            )}
          </section>
        )}


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
                <p>{d}</p>
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
            <a className="v7-boton" href={enlaceWa(g.wa, msgCorto)} target="_blank" rel="noopener noreferrer"><IconoWa /> {p.hero.cta}</a>
            {p.guiaTxt.otro && (
              <p className="v7-otro-guia">{p.guiaTxt.otro.texto} <Link to={p.guiaTxt.otro.ruta}>{p.guiaTxt.otro.enlace} {p.dir === 'rtl' ? '←' : '→'}</Link></p>
            )}
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

        {/* Precios */}
        <section id="precios" className="v7-seccion">
          <h2>{p.precios.titulo}</h2>
          <Precios p={p} />
        </section>

        {/* El mercado: husos, divisas y lo que le importa a ese público */}
        <section className="v7-seccion v7-mercado tarjeta">
          <div>
            <h2>{p.mercado.titulo}</h2>
            {p.mercado.texto.map((t) => <p key={t}>{t}</p>)}
            {p.mercado.enlaces?.map((e) => <p key={e.ruta} className="v7-temporada-enlace"><Link to={e.ruta}>{e.texto} {p.dir === 'rtl' ? '←' : '→'}</Link></p>)}
          </div>
          <Relojes p={p} />
        </section>

        {/* Preguntas */}
        <section className="v7-seccion v7-faq-seccion">
          <h2>{p.faq.titulo}</h2>
          <div className="v7-faq">
            {p.faq.items.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <LibroSellos lang={p.lang} guia={p.guia} prefijo={p.ruta.replace(/\/$/, '')} />

        {/* Contacto */}
        <section id="contacto" className="v7-seccion">
          <h2>{p.contacto.titulo}</h2>
          <p className="v7-entradilla">{p.contacto.sub}</p>
          <Contacto p={p} />
        </section>
      </main>
      <BarraMovil p={p} href={enlaceWa(g.wa, msgCorto)} />

      <footer className="v7-pie">
        <div className="v7-pie-fila">
          <div>
            <strong><Logo /></strong>
            <p>{p.pie.lema}</p>
            <p className="v7-pie-wa"><a href={enlaceWa(g.wa, msgCorto)} target="_blank" rel="noopener noreferrer"><IconoWa /> <bdi dir="ltr">{telefono(g.wa)}</bdi></a></p>
            <p><a href={`mailto:${CORREO}`}>{CORREO}</a></p>
          </div>
          <nav aria-label={p.pie.legal}>
            <Link to={`/legal?lang=${p.lang}`}>{p.pie.legal}</Link>
            <Link to={`/privacy?lang=${p.lang}`}>{p.pie.privacidad}</Link>
            <Link to={`/terms?lang=${p.lang}`}>{p.pie.condiciones}</Link>
            <Link to={`/cookies?lang=${p.lang}`}>{p.pie.cookies}</Link>
            {/* La guía halal vive fuera de la web; enlazarla aquí ayuda a que Google la descubra. */}
            {p.lang === 'ar' && <a href="https://2troll.github.io/yubisashi/dalil/">دليل الحلال في كانساي</a>}
            {p.id === 'en' && <a href="https://2troll.github.io/yubisashi/panduan/" lang="id">Panduan Halal Kansai</a>}
            {p.id === 'ar' && <a href="https://2troll.github.io/yubisashi/">تطبيق المحادثة للمطاعم</a>}
          </nav>
          <nav aria-label={p.pie.otrosIdiomas}>
            <span className="v7-pie-titulo">{p.pie.otrosIdiomas}</span>
            {(Object.keys(PAGINAS) as PaginaId[]).filter((k) => k !== p.id).map((k) => (
              <Link key={k} to={PAGINAS[k].ruta} lang={PAGINAS[k].lang}>
                {k === 'larion' ? 'English · Larion' : HERMANAS[PAGINAS[k].guia].find((h) => h.id === k)?.etiqueta}
              </Link>
            ))}
          </nav>
        </div>
        <details className="v7-creditos">
          <summary>{p.pie.creditos}</summary>
          <ul lang="es" dir="ltr">
            {CREDITOS.map((c) => (
              <li key={c.url}>{c.foto}: <a href={c.url} target="_blank" rel="noopener noreferrer">{c.autor}</a>, {c.licencia}</li>
            ))}
            {CREDITOS_SONIDO.map((c) => (
              <li key={c.url}>Sonido «{c.sonido}»: <a href={c.url} target="_blank" rel="noopener noreferrer">{c.autor}</a>, {c.licencia} (Wikimedia Commons)</li>
            ))}
          </ul>
        </details>
      </footer>
    </div>
  )
}
