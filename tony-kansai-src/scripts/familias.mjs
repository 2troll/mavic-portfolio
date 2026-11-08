#!/usr/bin/env node
// Genera public/familias/**: la sección en español de Antonio, coordinador y
// guía en Japón (socio de Tony), para familias y grupos de 6 a 10 personas de
// España, México y Centroamérica, y receptivo para agencias.
//
//   node scripts/familias.mjs
//   FAMILIAS_DATOS=/ruta/datos.mjs FAMILIAS_FOTOS=/ruta/fotos.json node scripts/familias.mjs   (pruebas)
//   FAMILIAS_EXTRA=/ruta/a.mjs,/ruta/b.mjs node scripts/familias.mjs   (páginas extra de prueba)
//
// Mismo patrón que turkce.mjs, francais.mjs y kndr.mjs: HTML estático completo,
// porque GPTBot, ClaudeBot y PerplexityBot no ejecutan JavaScript y el texto
// entero tiene que estar en la primera respuesta del servidor. rutas-estaticas.mjs
// no las pisa (llevan data-estatica en <html>).
//
// Datos: familias-datos.mjs (PAGINAS) + familias-datos-destinos.mjs y
// familias-datos-ocasiones.mjs y familias-datos-latam.mjs (PAGINAS_EXTRA y, opcional,
// FUENTES_EXTRA), si existen.
// Campos opcionales de cada página: categoria, dias, lang ('en'), ruta.
//
// Animación = mejora progresiva. El CSS base no oculta nada; el JS
// (public/familias/familias.js, generado aquí) carga GSAP + ScrollTrigger + SplitText
// (gratis desde la 3.13) + Lenis solo si el usuario no pide «reducir movimiento», y
// es él quien pone los estados iniciales. Si el CDN falla, un temporizador devuelve
// el titular. El configurador funciona siempre que haya JS, con o sin animación;
// sin JS queda un enlace normal de WhatsApp.
//
// Reglas de contenido: el texto vive en los archivos de datos (otros dueños). Aquí
// no se inventa nada sobre Antonio: ni precios, ni títulos, ni reseñas. Sus datos
// (edad, años en Japón, idiomas) vienen de COORDINADOR en familias-datos.mjs.
// Nada de alcohol ni juego. Nunca hebreo. Español neutro (nada de «vosotros»).
//
// Fotos: scripts/familias-fotos.json (autor, lisans, kaynak, w, h, anchos) y
// archivos en public/familias/foto/<clave>-<ancho>.webp. Si falta una foto o su
// archivo, la página no se rompe: sale un degradado.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { equipoHTML, equipoCSS, equipoFuente } from './equipo-estatico.mjs'
import { navHTML, pieHTML, menuCSS } from './menu-estatico.mjs'
import { experienciasHTML, EXPERIENCIAS_CSS } from './experiencias-estatico.mjs'
import { planesBloque, planesCSS } from './planes-estatico.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://tonykansaiguide.com'
const SECCION = '/familias/'

// Número provisional (el de Tony): se cambiará al número de Antonio cuando lo dé.
// 7-11-2026: WhatsApp propio de Antonio (antes iba al de Tony y las familias le escribían a él).
const WA_NUMERO = '817090508554'
const WA_VISIBLE = '+81 70-9050-8554'
const wa = (texto) => `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(texto)}`

const GSAP_V = '3.15.0'
const LENIS_V = '1.3.27'

// ---------------------------------------------------------------- datos
const rutaDatos = process.env.FAMILIAS_DATOS ? pathToFileURL(resolve(process.env.FAMILIAS_DATOS)).href : './familias-datos.mjs'
const D = await import(rutaDatos)
const { PORTADA, CONDICIONES, PAGINAS: PAGINAS_BASE } = D
for (const [k, v] of Object.entries({ PORTADA, CONDICIONES, PAGINAS: PAGINAS_BASE })) if (!v) throw new Error(`familias: familias-datos.mjs no exporta ${k}`)
const HOY = D.HOY ?? new Date().toISOString().slice(0, 10)
const COORDINADOR = typeof D.COORDINADOR === 'string' ? { nombre: D.COORDINADOR } : (D.COORDINADOR ?? {})
const FAQ_GLOBAL = D.FAQ_GLOBAL ?? []
const NOMBRE = COORDINADOR.nombre ?? 'Antonio'
const SLUG_COND = CONDICIONES.slug || 'condiciones'
const WA_GENERAL = wa(`Hola ${NOMBRE}, somos una familia/grupo de __ personas y queremos viajar a Japón. Fechas: `)

// Archivos de datos extra (otros dueños). Si no existen, se sigue sin ellos.
const PAGINAS = [...PAGINAS_BASE]
const FUENTES = [...(D.FUENTES ?? [])]
const extras = [
  ...['familias-datos-destinos.mjs', 'familias-datos-ocasiones.mjs', 'familias-datos-latam.mjs'].map((f) => join(root, 'scripts', f)),
  ...(process.env.FAMILIAS_EXTRA ?? '').split(',').filter(Boolean).map((f) => resolve(f)),
]
for (const f of extras) {
  if (!existsSync(f)) { console.warn(`⚠ familias: no existe ${f.replace(root + '/', '')}; se sigue sin él`); continue }
  const M = await import(pathToFileURL(f).href)
  if (!Array.isArray(M.PAGINAS_EXTRA)) throw new Error(`familias: ${f} no exporta PAGINAS_EXTRA (array)`)
  PAGINAS.push(...M.PAGINAS_EXTRA)
  if (Array.isArray(M.FUENTES_EXTRA)) FUENTES.push(...M.FUENTES_EXTRA)
}
{
  const vistos = new Set()
  for (const p of PAGINAS) {
    if (!p.slug) throw new Error('familias: una página no tiene slug')
    if (vistos.has(p.slug) || p.slug === SLUG_COND) throw new Error(`familias: slug repetido «${p.slug}»`)
    vistos.add(p.slug)
  }
}
// Fuentes repetidas (mismo dato y misma URL) solo una vez.
for (let i = FUENTES.length - 1; i >= 0; i--) if (FUENTES.findIndex((f) => f.url === FUENTES[i].url && f.dato === FUENTES[i].dato) !== i) FUENTES.splice(i, 1)

// Categorías del índice. Las 19 páginas originales no traen `categoria`: mapa por slug.
const CATS = [
  { id: 'destino', es: 'Destinos', en: 'Destinations', lead: 'Ciudades y zonas contadas para familias y grupos: qué ver, cuántos días y dónde dormir.' },
  { id: 'itinerario', es: 'Itinerarios', en: 'Itineraries', lead: 'Rutas de varios días con el ritmo pensado para el grupo.' },
  { id: 'temporada', es: 'Temporadas 2026-27', en: 'Seasons 2026-27', lead: 'Qué cambia en cada época del año y cuándo conviene reservar.' },
  { id: 'ocasion', es: 'Ocasiones especiales', en: 'Special occasions', lead: 'Viajes con motivo: celebraciones, reuniones y varias generaciones juntas.' },
  { id: 'practico', es: 'Guía práctica', en: 'Practical guide', lead: 'Transporte, alojamiento, tasas y lo que conviene saber antes de ir.' },
  { id: 'agencias', es: 'Agencias', en: 'Agencies', lead: 'Receptivo en Japón para agencias de viaje.' },
]
const CAT_POR_SLUG = {
  'organizar-viaje-japon-familia': 'practico', 'viaje-japon-grupo-10-personas': 'practico', 'transporte-privado-japon': 'practico',
  'ryokan-y-montana-en-familia': 'destino', 'itinerario-japon-a-medida': 'itinerario', 'japon-vip-a-medida': 'itinerario',
  'guia-en-espanol-japon': 'practico', 'viaje-japon-desde-espana': 'practico', 'viaje-japon-desde-mexico': 'practico',
  'viaje-japon-desde-centroamerica': 'practico', 'tasas-turisticas-japon': 'practico', 'habitaciones-familia-japon': 'practico',
  'comer-en-japon-en-grupo': 'practico', 'tarjeta-icoca-japon': 'practico', 'aeropuerto-al-hotel-japon': 'practico',
  'shinkansen-en-familia': 'practico', 'viaje-japon-con-ninos': 'ocasion', 'agencias-receptivo-japon': 'agencias',
  'japon-y-corea-del-sur': 'itinerario',
}
for (const p of PAGINAS) {
  p.cat = p.categoria ?? CAT_POR_SLUG[p.slug]
  if (!CATS.some((c) => c.id === p.cat)) { console.warn(`⚠ familias: «${p.slug}» sin categoría válida (${p.categoria}); va a Guía práctica`); p.cat = 'practico' }
  p.lng = p.lang === 'en' ? 'en' : 'es'
}
const catNombre = (id, lang = 'es') => CATS.find((c) => c.id === id)?.[lang] ?? id
const PAGINAS_EN = PAGINAS.filter((p) => p.lng === 'en')

const rutaFotos = process.env.FAMILIAS_FOTOS ? resolve(process.env.FAMILIAS_FOTOS) : join(root, 'scripts/familias-fotos.json')
let FOTOS = {}
if (existsSync(rutaFotos)) FOTOS = JSON.parse(readFileSync(rutaFotos, 'utf8'))
else console.warn('⚠ familias: falta scripts/familias-fotos.json; todas las fotos salen como degradado')

// ---------------------------------------------------------------- utilidades
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
// Texto de datos con unas pocas etiquetas permitidas (enlaces, negrita, cursiva).
const rico = (s) => esc(s)
  .replace(/&lt;a href=&quot;((?:\/|https:\/\/)[^"&<>]*)&quot;&gt;/g, (_, h) => `<a href="${h}">`)
  .replace(/&lt;\/a&gt;/g, '</a>')
  .replace(/&lt;(\/?)(strong|em|b|i)&gt;/g, '<$1$2>')
const sinEtiquetas = (s) => String(s ?? '').replace(/<[^>]+>/g, '')
const ruta = (slug) => (slug ? `${SECCION}${slug}/` : SECCION)
const url = (slug) => `${BASE}${ruta(slug)}`
const norm = (s) => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')
const r1 = (n) => Math.round(n * 10) / 10

// Fotos: solo entran en srcset los anchos cuyo archivo existe.
// (`dir` y `clave` son opcionales y solo sirven para pruebas con fotos de otra sección.)
const avisadas = new Set()
function foto(k) {
  const f = k && FOTOS[k]
  if (!f) { if (k && !avisadas.has(k)) { avisadas.add(k); console.warn(`⚠ familias: sin foto «${k}», sale degradado`) } return null }
  const dir = f.dir ?? '/familias/foto'
  const clave = f.clave ?? k
  const anchos = (f.anchos ?? []).filter((w) => existsSync(join(root, 'public', dir, `${clave}-${w}.webp`))).sort((a, b) => b - a)
  if (!anchos.length) { if (!avisadas.has(k)) { avisadas.add(k); console.warn(`⚠ familias: la foto «${k}» no tiene archivos en public${dir}/, sale degradado`) } return null }
  const src = (w) => `${dir}/${clave}-${w}.webp`
  const grande = anchos.find((w) => w <= 1920) ?? anchos.at(-1)
  return {
    ...f, anchos, src, grande, pequeno: anchos.at(-1),
    srcset: anchos.map((w) => `${src(w)} ${Math.min(w, f.w)}w`).join(', '),
  }
}
const credito = (f, lang = 'es') => `${lang === 'en' ? 'Photo' : 'Foto'}: <a href="${esc(f.kaynak)}" rel="nofollow">${esc(f.autor)}</a> · ${esc(f.lisans)}`
// Crédito plegado en un «©»: a 390 px el texto entero no cabe sobre la tarjeta.
const creditoBoton = (f, lang = 'es') => `<details class="cred"><summary aria-label="${lang === 'en' ? 'Photo credit' : 'Crédito de la foto'}" title="${lang === 'en' ? 'Photo credit' : 'Crédito de la foto'}">©</summary><p>${credito(f, lang)}</p></details>`
function img(k, alt, { sizes = '100vw', hero = false, clase = '' } = {}) {
  const f = foto(k)
  if (!f) return `<div class="sinfoto ${clase}" role="img" aria-label="${esc(alt)}"></div>`
  return `<img class="${clase}" src="${f.src(hero ? f.grande : f.pequeno)}" srcset="${f.srcset}" sizes="${sizes}" alt="${esc(alt)}" width="${f.w}" height="${f.h}"${hero ? ' fetchpriority="high" decoding="async"' : ' loading="lazy" decoding="async"'}>`
}
const imagenOg = (k) => { const f = foto(k); return f ? `${BASE}${f.src(f.grande)}` : `${BASE}/logo-square.svg` }

// Retrato de Antonio: cuadrado, en public/familias/foto/antonio-<ancho>.webp, y la
// cara recortada en antonio-cara-<ancho>.webp para la miniatura. Solo entran los
// anchos cuyo archivo existe; sin ninguno sale el monograma «A» de siempre.
const ALT_RETRATO = `${NOMBRE}, coordinador de viajes en Japón`
const hay = (n) => existsSync(join(root, 'public/familias/foto', `${n}.webp`))
const RETRATO_ANCHOS = [320, 640, 1080].filter((w) => hay(`antonio-${w}`))
const CARA_ANCHOS = [160, 320].filter((w) => hay(`antonio-cara-${w}`))
if (!RETRATO_ANCHOS.length) console.warn('⚠ familias: sin retrato de Antonio en public/familias/foto/, sale el monograma')
const RETRATO_W = RETRATO_ANCHOS.at(-1)
const RETRATO_URL = RETRATO_W ? `${BASE}${SECCION}foto/antonio-${RETRATO_W}.webp` : null
const retratoGrande = () => (RETRATO_W
  ? `<img class="retrato" src="${SECCION}foto/antonio-${RETRATO_ANCHOS.find((w) => w >= 640) ?? RETRATO_W}.webp" srcset="${RETRATO_ANCHOS.map((w) => `${SECCION}foto/antonio-${w}.webp ${w}w`).join(', ')}" sizes="(max-width:640px) 70vw, 300px" alt="${esc(ALT_RETRATO)}" width="${RETRATO_W}" height="${RETRATO_W}" loading="lazy" decoding="async">`
  : `<span class="mono" aria-hidden="true">${esc(NOMBRE[0])}</span>`)
const miniCara = (cls = 'mono', alt = '') => (CARA_ANCHOS.length
  ? `<img class="${cls} cara" src="${SECCION}foto/antonio-cara-${CARA_ANCHOS[0]}.webp"${CARA_ANCHOS.length > 1 ? ` srcset="${CARA_ANCHOS.map((w, i) => `${SECCION}foto/antonio-cara-${w}.webp ${i + 1}x`).join(', ')}"` : ''} alt="${esc(alt)}" width="${CARA_ANCHOS.at(-1)}" height="${CARA_ANCHOS.at(-1)}" decoding="async">`
  : `<span class="${cls}" aria-hidden="true">${esc(NOMBRE[0])}</span>`)

// Reseñas de Antonio: las manda el cliente desde /familias/opiniones/ y el Worker
// las publica solas. Van en el HTML al construir (las IAs no ejecutan JS) y un
// script pide las que lleguen después. Sin AggregateRating mientras no haya.
const SLUG_FORM = 'opiniones'
const SLUG_OPINIONES = 'opiniones-clientes'
let OPINIONES = []
if (process.env.FAMILIAS_SIN_RED !== '1') {
  try {
    const res = await fetch('https://tonykansaiguide.com/api/resenas/publicas?guia=antonio', { signal: AbortSignal.timeout(15000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    OPINIONES = ((await res.json()).reviews ?? []).filter((y) => y?.id && y.text && y.stars)
  } catch (e) { console.warn(`⚠ familias: sin reseñas del Worker (${e.message}); la página sale vacía`) }
}
const MEDIA = OPINIONES.length ? (OPINIONES.reduce((t, y) => t + y.stars, 0) / OPINIONES.length).toFixed(1).replace('.', ',') : ''
const RESUMEN_OP = OPINIONES.length ? `${OPINIONES.length} ${OPINIONES.length === 1 ? 'opinión' : 'opiniones'} de viajeros, media ${MEDIA}/5` : ''
// `sizes` = ancho real de la tarjeta, para que un móvil denso no baje la de 1920.
const SIZES_REJILLA = '(max-width:640px) calc(100vw - 32px), (max-width:1100px) calc(50vw - 48px), 370px'
const SIZES_FILA = '(max-width:640px) calc(100vw - 72px), 340px'

// Iconos de línea, trazo 1.5, 24×24.
const ICONOS = {
  guia: '<path d="M6 21V4"/><path d="M6 4h11l-2.5 4L17 12H6"/>',
  ruta: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6.5a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H16" stroke-dasharray="2.5 2.5"/>',
  furgo: '<path d="M2.5 16V8.5A1.5 1.5 0 0 1 4 7h10.5l4.5 4.5h1A1.5 1.5 0 0 1 21.5 13v3h-2"/><path d="M14.5 7v4.5H19"/><circle cx="7" cy="16.5" r="2"/><circle cx="17" cy="16.5" r="2"/><path d="M9 16.5h6"/>',
  hotel: '<path d="M3 19V6"/><path d="M3 15h18v4"/><path d="M21 15v-2.5A2.5 2.5 0 0 0 18.5 10H11v5"/><circle cx="7" cy="11.5" r="1.8"/>',
  corazon: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
  montana: '<path d="M2.5 19.5 9 8.5l4 6.5 2.5-3.5 6 8z"/><path d="M7.4 11.2 9 12.4l1.4-1.2"/>',
  estrella: '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>',
  tarjeta: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 9.5h18"/><path d="M6.5 14.5h4"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
}
const icono = (n, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[n] ?? ICONOS.estrella}</svg>`
const ICO_WA = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.8z"/><path d="M9 9.5c0 2.8 2.7 5.5 5.5 5.5l1-1.4-2-1-1 .8c-.9-.4-1.6-1.1-2-2l.8-1-1-2z"/></svg>'
const ICO_SI = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>'
const ICO_NO = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg>'
const FLECHA = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'

// Textos de interfaz por idioma (la única página en inglés usa `en`).
const T = {
  es: {
    seccion: 'Familias y grupos', inicio: ['Tony Kansai Guide', `${BASE}/es/`], ariaMiga: 'Ruta', sub: 'Japón para familias y grupos',
    nav: [['Diseña tu viaje', `${SECCION}#disena`, true], ['Guías', `${SECCION}#guias`], ['Cómo funciona', `${SECCION}#como`], ['Qué incluye', ruta(SLUG_COND)], ['Tony Kansai Guide', '/es/']],
    presupuesto: 'Pedir presupuesto', escribir: `Escribir a ${NOMBRE}`,
    cajaT: `${NOMBRE} se lo organiza`, cajaP: 'Viaje a medida para familias y grupos de 6 a 10 personas, con presupuesto por WhatsApp.',
    incluye: 'Qué incluye y qué no', disenar: 'Diseñar el viaje paso a paso', indice: 'En esta página', faq: 'Preguntas frecuentes',
    sigue: 'Sigue leyendo', volver: 'Volver a Familias y grupos', laRuta: 'La ruta', diaADia: 'Día a día',
    waPag: (h) => `Hola ${NOMBRE}, he leído «${h}». Somos una familia/grupo de __ personas y queremos viajar a Japón. Fechas: `,
    pie: `${NOMBRE} es coordinador de viajes profesional en Japón, habla español, japonés, inglés y catalán, y es socio de <a href="/es/">Tony Kansai Guide</a>. Organiza viajes a medida por todo Japón para familias y grupos de España, México y Centroamérica, y trabaja como receptivo para agencias. Corea del Sur, próximamente.`,
    actualizado: 'Última actualización', volverWeb: 'Volver a la web de Tony Kansai Guide', otros: 'Otros idiomas', mapa: 'Mapa de Japón con la ruta',
  },
  en: {
    seccion: 'Families and groups', inicio: ['Tony Kansai Guide', `${BASE}/en/`], ariaMiga: 'Breadcrumb', sub: 'Japan for families and groups',
    nav: [['Plan your trip (ES)', `${SECCION}#disena`, true], ['Guides (ES)', `${SECCION}#guias`], ['Tony Kansai Guide', '/en/']],
    presupuesto: 'Ask for a quote', escribir: `Message ${NOMBRE}`,
    cajaT: `${NOMBRE} organises it`, cajaP: 'Tailor-made trips for families and groups of 6 to 10 people, quoted on WhatsApp.',
    incluye: 'What is included (in Spanish)', disenar: 'Plan the trip step by step (in Spanish)', indice: 'On this page', faq: 'Frequently asked questions',
    sigue: 'Keep reading', volver: 'Back to Families and groups', laRuta: 'The route', diaADia: 'Day by day',
    waPag: (h) => `Hello ${NOMBRE}, I have read «${h}». We are a family/group of __ people and would like to travel to Japan. Dates: `,
    pie: `${NOMBRE} is a professional trip coordinator in Japan who speaks Spanish, Japanese, English and Catalan, and a partner of <a href="/en/">Tony Kansai Guide</a>. He organises tailor-made trips all over Japan for families and groups from Spain, Mexico and Central America, and works as a ground handler for travel agencies. South Korea, coming soon.`,
    actualizado: 'Last updated', volverWeb: 'Back to the Tony Kansai Guide website', otros: 'Other languages', mapa: 'Map of Japan with the route',
  },
}

// Enlaces internos: slug de PAGINAS, el de condiciones o '' (portada).
const porSlug = new Map(PAGINAS.map((p) => [p.slug, p]))
function destino(slug, desde) {
  if (slug === '' || slug === 'familias') return { href: SECCION, h1: PORTADA.h1, desc: PORTADA.entradilla, foto: 'hero' }
  if (slug === SLUG_COND) return { href: ruta(SLUG_COND), h1: CONDICIONES.h1, desc: CONDICIONES.entradilla, foto: 'familia' }
  const p = porSlug.get(slug)
  if (!p) { console.warn(`⚠ familias: ${desde} enlaza a «${slug}», que no existe; se omite`); return null }
  return { href: ruta(p.slug), h1: p.h1, desc: p.descripcion || p.entradilla, foto: p.foto, cat: p.cat }
}

// ---------------------------------------------------------------- mapa de Japón (SVG propio)
// Costa de Natural Earth 1:50m (dominio público), simplificada una vez con
// Douglas-Peucker (0,03°) y guardada aquí: el build no baja nada de la red.
// Proyección equirectangular corregida por cos(36°).
const C36 = Math.cos((36 * Math.PI) / 180)
const px = ([lon, lat]) => [r1((lon - 129.4) * 80 * C36), r1((42 - lat) * 80)]
const COSTA = {"honshu":[[141.23,41.37],[141.45,41.4],[141.4,41.1],[141.43,40.72],[141.46,40.61],[141.8,40.29],[141.99,39.79],[141.98,39.43],[141.9,39.11],[141.66,38.98],[141.55,38.76],[141.47,38.4],[141.11,38.34],[140.96,38.15],[140.93,37.95],[141.04,37.47],[141,37.11],[140.97,37],[140.73,36.73],[140.63,36.5],[140.57,36.23],[140.62,36.06],[140.87,35.72],[140.64,35.66],[140.46,35.51],[140.42,35.27],[140.36,35.18],[140.06,35.04],[139.92,34.9],[139.8,34.96],[139.84,35.01],[139.83,35.3],[140.1,35.59],[139.99,35.67],[139.83,35.66],[139.77,35.49],[139.65,35.41],[139.67,35.32],[139.74,35.25],[139.68,35.15],[139.47,35.3],[139.25,35.28],[139.13,35.15],[139.09,34.84],[138.9,34.63],[138.84,34.62],[138.76,34.7],[138.8,34.97],[138.9,35.02],[138.72,35.12],[138.58,35.09],[138.25,34.73],[138.19,34.6],[137.54,34.66],[137.06,34.58],[137.29,34.7],[137.27,34.77],[137.03,34.77],[136.96,34.84],[136.91,34.71],[136.87,34.73],[136.85,34.98],[136.9,35.03],[136.8,35.05],[136.69,34.98],[136.53,34.68],[136.88,34.43],[136.85,34.32],[136.33,34.18],[135.92,33.56],[135.69,33.49],[135.45,33.55],[135.13,34.01],[135.1,34.29],[135.31,34.42],[135.41,34.55],[135.42,34.62],[135.36,34.65],[135.04,34.63],[134.74,34.77],[134.59,34.77],[134.21,34.7],[133.97,34.53],[133.44,34.43],[133.14,34.3],[133.02,34.33],[132.77,34.26],[132.66,34.25],[132.42,34.35],[132.31,34.32],[132.24,34.23],[132.14,33.84],[131.74,34.05],[131.23,33.95],[131.07,34.02],[130.92,33.98],[130.89,34.26],[130.95,34.35],[131,34.39],[131.35,34.41],[132.26,35.02],[132.7,35.42],[132.92,35.51],[133.27,35.56],[133.38,35.46],[133.62,35.51],[133.98,35.51],[135.18,35.75],[135.27,35.72],[135.23,35.59],[135.33,35.53],[135.68,35.5],[135.8,35.55],[136.09,35.77],[136.01,35.99],[136.07,36.12],[136.36,36.36],[136.7,36.74],[136.75,36.95],[136.72,37.2],[136.84,37.38],[137.32,37.52],[137.34,37.44],[136.9,37.12],[136.99,37.03],[137.02,36.84],[137.25,36.75],[137.34,36.77],[137.51,36.95],[138.32,37.22],[138.63,37.47],[138.88,37.84],[139.25,38.01],[139.4,38.14],[139.52,38.5],[139.8,38.88],[139.91,39.23],[140.04,39.41],[140.06,39.62],[140,39.86],[139.74,39.92],[139.91,40.02],[140.01,40.26],[139.92,40.53],[139.97,40.67],[140.28,40.85],[140.34,41.01],[140.32,41.16],[140.39,41.23],[140.63,41.2],[140.68,40.89],[140.75,40.83],[140.94,40.94],[141.12,40.88],[141.22,40.99],[141.25,41.21],[141.2,41.24],[140.8,41.14],[140.8,41.25],[140.94,41.5]],"hokkaido":[[143.82,44.12],[144.1,44.1],[144.48,43.95],[144.72,43.93],[144.87,43.98],[145.37,44.33],[145.13,43.87],[145.1,43.77],[145.14,43.66],[145.34,43.3],[145.49,43.28],[145.67,43.39],[145.83,43.39],[145.62,43.29],[145.5,43.18],[145.35,43.18],[144.92,43],[144.63,42.95],[144.2,42.97],[143.97,42.88],[143.58,42.6],[143.43,42.42],[143.31,42.08],[143.24,42],[142.51,42.26],[141.85,42.58],[141.41,42.55],[140.99,42.34],[140.71,42.56],[140.48,42.56],[140.35,42.44],[140.33,42.29],[140.53,42.13],[140.73,42.12],[141.15,41.81],[141.08,41.76],[140.91,41.74],[140.66,41.82],[140.39,41.52],[140.09,41.43],[140,41.58],[140.11,41.91],[140.06,42.07],[139.83,42.28],[139.83,42.45],[139.89,42.65],[140.12,42.73],[140.43,42.95],[140.49,43.05],[140.4,43.17],[140.39,43.3],[140.49,43.34],[140.78,43.21],[141.14,43.18],[141.3,43.2],[141.38,43.28],[141.4,43.64],[141.65,44.02],[141.66,44.26],[141.76,44.48],[141.78,44.72],[141.72,44.94],[141.58,45.16],[141.67,45.4],[141.94,45.51],[142.88,44.67],[143.29,44.4]],"kyushu":[[131.18,33.6],[131.37,33.57],[131.58,33.65],[131.69,33.6],[131.71,33.5],[131.54,33.27],[131.9,33.25],[131.85,33.12],[131.95,33.05],[131.91,32.97],[132.01,32.92],[131.66,32.47],[131.46,31.88],[131.46,31.67],[131.34,31.4],[131.07,31.44],[131.04,31.38],[131.1,31.26],[130.69,31.01],[130.79,31.27],[130.7,31.58],[130.78,31.6],[130.8,31.67],[130.65,31.72],[130.56,31.56],[130.54,31.4],[130.64,31.27],[130.59,31.18],[130.2,31.29],[130.15,31.41],[130.29,31.45],[130.32,31.6],[130.19,31.77],[130.2,31.95],[130.19,32.09],[130.4,32.22],[130.64,32.62],[130.5,32.66],[130.57,32.73],[130.55,32.83],[130.38,33.09],[130.24,33.18],[130.13,33.1],[130.18,32.85],[130.33,32.85],[130.34,32.7],[130.24,32.68],[130.05,32.77],[129.77,32.57],[129.83,32.73],[129.69,32.88],[129.68,33.06],[129.83,32.89],[129.99,32.85],[129.9,33.02],[129.58,33.24],[129.61,33.34],[129.84,33.32],[129.83,33.44],[130.17,33.6],[130.37,33.63],[130.49,33.84],[130.72,33.93],[130.95,33.87],[131.06,33.67]],"shikoku":[[134.36,34.26],[134.64,34.23],[134.68,33.85],[134.74,33.82],[134.38,33.61],[134.24,33.44],[134.18,33.25],[133.96,33.45],[133.63,33.51],[133.29,33.36],[133.15,33.08],[133.02,32.98],[132.98,32.84],[132.8,32.75],[132.64,32.76],[132.71,32.9],[132.49,32.92],[132.49,33.01],[132.43,33.06],[132.52,33.26],[132.4,33.33],[132.41,33.43],[132.03,33.34],[132.64,33.69],[132.79,33.99],[132.94,34.1],[133.13,33.93],[133.19,33.93],[133.58,34.02],[133.64,34.13],[133.6,34.24],[133.71,34.24],[133.95,34.35],[134.07,34.36]]}
const ISLAS = [[[128.26,26.65],[127.87,26.44],[127.9,26.33],[127.79,26.26],[127.8,26.15],[127.73,26.1],[127.65,26.09],[127.65,26.16],[127.73,26.31],[127.73,26.43],[127.93,26.56],[127.91,26.69],[128.05,26.64],[128.1,26.67],[128.26,26.88],[128.33,26.81]],[[138.34,37.82],[138.23,37.83],[138.28,37.85],[138.32,37.97],[138.25,37.99],[138.31,38.16],[138.5,38.32],[138.45,38.08],[138.57,38.07],[138.5,37.9]],[[129.45,28.21],[129.37,28.13],[129.16,28.25],[129.58,28.46],[129.69,28.52],[129.71,28.43],[129.46,28.27]],[[130.08,32.23],[130,32.19],[129.96,32.24],[130.02,32.29],[129.98,32.35],[130.01,32.52],[130.17,32.54],[130.2,32.34]],[[134.93,34.29],[134.82,34.2],[134.68,34.25],[134.67,34.29],[134.83,34.47],[135,34.54],[134.91,34.4]],[[130.62,30.26],[130.45,30.26],[130.39,30.39],[130.5,30.47],[130.67,30.37]],[[129.39,34.35],[129.37,34.31],[129.27,34.37],[129.33,34.61],[129.45,34.69],[129.48,34.54],[129.38,34.42]],[[130.96,30.4],[130.87,30.39],[130.87,30.44],[131.04,30.82],[131.08,30.79],[131.06,30.64]],[[128.67,32.78],[128.84,32.76],[128.89,32.65],[128.82,32.65],[128.75,32.59],[128.66,32.63]]]
const poligono = (pts) => 'M' + pts.map(px).map(([x, y]) => `${x},${y}`).join('L') + 'Z'
const TIERRA = [...Object.values(COSTA), ...ISLAS].map((c) => `<path class="tierra" d="${poligono(c)}"/>`).join('')
// pos = dónde va la etiqueta respecto al punto (r, l, t, b, tr, br, tl, bl).
const CIUDADES = {
  tokio: { n: 'Tokio', en: 'Tokyo', ll: [139.69, 35.69], pos: 'r', alias: ['tokyo'] },
  yokohama: { n: 'Yokohama', ll: [139.64, 35.44], pos: 'r' },
  kamakura: { n: 'Kamakura', ll: [139.55, 35.32], pos: 'br' },
  nikko: { n: 'Nikko', ll: [139.6, 36.75], pos: 'r', alias: ['nikko'] },
  hakone: { n: 'Hakone', ll: [139.02, 35.23], pos: 'b' },
  kawaguchiko: { n: 'Kawaguchiko', ll: [138.76, 35.5], pos: 'tl', alias: ['fuji', 'montefuji', 'fujigoko'] },
  matsumoto: { n: 'Matsumoto', ll: [137.97, 36.24], pos: 'tr' },
  nagano: { n: 'Nagano', ll: [138.19, 36.65], pos: 'tr' },
  takayama: { n: 'Takayama', ll: [137.25, 36.14], pos: 'br' },
  shirakawago: { n: 'Shirakawago', ll: [136.91, 36.26], pos: 'tr', alias: ['shirakawa'] },
  kanazawa: { n: 'Kanazawa', ll: [136.65, 36.56], pos: 'tl' },
  tsumago: { n: 'Tsumago', ll: [137.6, 35.58], pos: 'br', alias: ['magome', 'kisoji'] },
  nagoya: { n: 'Nagoya', ll: [136.91, 35.18], pos: 'br' },
  ise: { n: 'Ise', ll: [136.72, 34.46], pos: 'br' },
  kioto: { n: 'Kioto', en: 'Kyoto', ll: [135.77, 35.01], pos: 'tr', alias: ['kyoto'] },
  uji: { n: 'Uji', ll: [135.8, 34.88], pos: 'r' },
  nara: { n: 'Nara', ll: [135.8, 34.68], pos: 'br' },
  osaka: { n: 'Osaka', ll: [135.5, 34.69], pos: 'bl' },
  kobe: { n: 'Kobe', ll: [135.19, 34.69], pos: 'b' },
  koyasan: { n: 'Koyasan', ll: [135.59, 34.21], pos: 'b', alias: ['koya'] },
  kumano: { n: 'Kumano', ll: [135.89, 33.67], pos: 'b', alias: ['kumanokodo', 'nachi'] },
  shirahama: { n: 'Shirahama', ll: [135.35, 33.68], pos: 'l' },
  kinosaki: { n: 'Kinosaki', ll: [134.82, 35.62], pos: 't' },
  himeji: { n: 'Himeji', ll: [134.69, 34.84], pos: 'tl' },
  okayama: { n: 'Okayama', ll: [133.92, 34.66], pos: 't' },
  kurashiki: { n: 'Kurashiki', ll: [133.77, 34.6], pos: 'bl' },
  naoshima: { n: 'Naoshima', ll: [133.99, 34.46], pos: 'b' },
  hiroshima: { n: 'Hiroshima', ll: [132.46, 34.39], pos: 't' },
  miyajima: { n: 'Miyajima', ll: [132.32, 34.3], pos: 'b', alias: ['itsukushima'] },
  fukuoka: { n: 'Fukuoka', ll: [130.4, 33.59], pos: 't' },
  beppu: { n: 'Beppu', ll: [131.49, 33.28], pos: 'r' },
  kumamoto: { n: 'Kumamoto', ll: [130.71, 32.8], pos: 'r' },
  nagasaki: { n: 'Nagasaki', ll: [129.87, 32.75], pos: 'b' },
  kagoshima: { n: 'Kagoshima', ll: [130.56, 31.6], pos: 'r' },
  sendai: { n: 'Sendai', ll: [140.87, 38.27], pos: 'l' },
  hakodate: { n: 'Hakodate', ll: [140.73, 41.77], pos: 'r' },
}
const ALIAS = new Map()
for (const [k, c] of Object.entries(CIUDADES)) { ALIAS.set(k, k); ALIAS.set(norm(c.n), k); for (const a of c.alias ?? []) ALIAS.set(a, k) }
const claveCiudad = (nombre) => ALIAS.get(norm(nombre)) ?? null
const POS = {
  r: ['.75em', '.35em', 'start'], l: ['-.75em', '.35em', 'end'], t: ['0', '-.8em', 'middle'], b: ['0', '1.35em', 'middle'],
  tr: ['.5em', '-.45em', 'start'], br: ['.55em', '1.1em', 'start'], tl: ['-.5em', '-.45em', 'end'], bl: ['-.55em', '1.1em', 'end'],
}
// Página de destino para una ciudad, si existe (para enlazar el punto del mapa).
function paginaCiudad(k) {
  const dest = PAGINAS.filter((p) => p.cat === 'destino' && p.lng === 'es')
  const enRuta = (p) => (p.ruta ?? []).map(claveCiudad)
  return dest.find((p) => enRuta(p)[0] === k) ?? dest.find((p) => enRuta(p).includes(k)) ?? dest.find((p) => p.slug.split('-').includes(k)) ?? null
}
// Caja de vista alrededor de unos puntos, con márgenes y proporción razonable.
function cajaVista(pts) {
  let x0 = Math.min(...pts.map((p) => p[0])), x1 = Math.max(...pts.map((p) => p[0]))
  let y0 = Math.min(...pts.map((p) => p[1])), y1 = Math.max(...pts.map((p) => p[1]))
  const pad = Math.max(110, Math.max(x1 - x0, y1 - y0) * 0.3)
  x0 -= pad; x1 += pad; y0 -= pad * 0.8; y1 += pad * 0.8
  let w = x1 - x0, h = y1 - y0
  if (w / h < 1.4) { const nw = h * 1.4; x0 -= (nw - w) / 2; w = nw } else if (w / h > 2) { const nh = w / 2; y0 -= (nh - h) / 2; h = nh }
  return [r1(x0), r1(y0), r1(w), r1(h)]
}
let idMapa = 0
function mapaSvg({ claves, vb, clase = '', etiquetas = {}, lang = 'es', titulo }) {
  const pts = claves.map((k) => ({ k, c: CIUDADES[k], p: px(CIUDADES[k].ll) }))
  const [vx, vy, vw, vh] = vb ?? cajaVista(pts.map((x) => x.p))
  const R = r1(vw / 95)
  const id = `mapa-t${++idMapa}`
  // Retícula de meridianos y paralelos cada grado.
  let reja = ''
  for (let lon = 129; lon <= 147; lon++) { const x = px([lon, 0])[0]; if (x > vx && x < vx + vw) reja += `M${x},${vy}V${r1(vy + vh)}` }
  for (let lat = 30; lat <= 46; lat++) { const y = px([0, lat])[1]; if (y > vy && y < vy + vh) reja += `M${vx},${y}H${r1(vx + vw)}` }
  // Tramos de la ruta: curvas suaves que se arquean a un lado y a otro.
  const segs = pts.slice(1).map((b, i) => {
    const a = pts[i].p, q = b.p, dx = q[0] - a[0], dy = q[1] - a[1], sg = i % 2 ? 1 : -1
    const cx = r1((a[0] + q[0]) / 2 - dy * 0.18 * sg), cy = r1((a[1] + q[1]) / 2 + dx * 0.18 * sg)
    return `<path class="seg" pathLength="1" d="M${a[0]},${a[1]}Q${cx},${cy} ${q[0]},${q[1]}"/>`
  }).join('')
  const puntos = pts.map(({ k, c, p }, i) => {
    const [dx, dy, anc] = POS[c.pos] ?? POS.r
    const nombre = etiquetas[k] ?? (lang === 'en' ? c.en ?? c.n : c.n)
    const pag = lang === 'es' ? paginaCiudad(k) : null
    const g = `<circle class="halo" cx="${p[0]}" cy="${p[1]}" r="${r1(R * 2.3)}"/><circle class="nucleo" cx="${p[0]}" cy="${p[1]}" r="${R}"/><text x="${p[0]}" y="${p[1]}" dx="${dx}" dy="${dy}" text-anchor="${anc}">${esc(nombre)}</text>`
    return `<g class="punto" data-k="${k}" data-i="${i}">${pag ? `<a href="${ruta(pag.slug)}" aria-label="${esc(nombre)}: ${esc(pag.h1)}">${g}</a>` : g}</g>`
  }).join('')
  const t = titulo ?? `${T[lang].mapa}: ${pts.map((x) => etiquetas[x.k] ?? x.c.n).join(', ')}`
  return `<svg class="${clase}" viewBox="${vx} ${vy} ${vw} ${vh}" style="--fs:${r1(vw / 44)}px;--fsm:${r1(vw / 26)}px" role="img" aria-labelledby="${id}"><title id="${id}">${esc(t)}</title><rect class="mar" x="${vx}" y="${vy}" width="${vw}" height="${vh}"/><path class="reja" d="${reja}"/>${TIERRA}<g class="ruta-l">${segs}</g>${puntos}</svg>`
}
const RUTA_CLASICA = ['tokio', 'hakone', 'takayama', 'shirakawago', 'kanazawa', 'kioto', 'nara', 'osaka', 'himeji', 'hiroshima', 'miyajima']
const ETQ_CLASICA = { hakone: 'Hakone y Fuji' }
// Recorte del centro de Japón (lon 130,6 a 141,2; lat 32,8 a 38): ahí cae toda la ruta.
const VB_CENTRO = (() => { const [x0, y0] = px([130.6, 38.0]), [x1, y1] = px([141.2, 32.8]); return [x0, y0, r1(x1 - x0), r1(y1 - y0)] })()
// Ciudades de la `ruta` de una página que el mapa sabe situar.
function rutaClaves(p) {
  const out = []
  for (const n of p.ruta ?? []) {
    const k = claveCiudad(n)
    if (!k) { console.warn(`⚠ familias: ${p.slug}: el mapa no conoce «${n}»; se omite`); continue }
    if (!out.includes(k)) out.push(k)
  }
  return out
}

// ---------------------------------------------------------------- CSS
const CSS = `
:root{--bg:#f3f2ee;--bg2:#e9e8e2;--kart:#fbfbf8;--tinta:#15211c;--suave:#56625c;--linea:#d9dad2;--acento:#1d5c45;--acento-2:#e8efe9;--ambar:#c9861d;--oro:#f2c46d;--noche:#0e1712;--sobre:#fff;--sombra:20 40 30}
@media (prefers-color-scheme:dark){:root{--bg:#0f1512;--bg2:#141c18;--kart:#18211d;--tinta:#ebefe9;--suave:#a3aea7;--linea:#28332e;--acento:#6cc79d;--acento-2:#1b2b24;--ambar:#e6a948;--sobre:#0f1512;--sombra:0 0 0}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}html.lenis,html.lenis body{height:auto}.lenis.lenis-smooth{scroll-behavior:auto!important}.lenis.lenis-stopped{overflow:hidden}
body{margin:0;background:var(--bg);color:var(--tinta);font:17px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;overflow-x:hidden}
img{max-width:100%}a{color:var(--acento);text-underline-offset:3px}
.kap{width:100%;max-width:1240px;margin:0 auto;padding:0 16px}@media (min-width:768px){.kap{padding:0 32px}}
h1,h2,h3,h4,.serif{font-family:Fraunces,Georgia,serif;font-optical-sizing:auto;font-weight:500;letter-spacing:-.015em;line-height:1.12}
h2{font-size:clamp(32px,5vw,64px);margin:0 0 18px;letter-spacing:-.025em}h3{font-size:21px;margin:0 0 6px}
.lead{font-size:clamp(18px,1.8vw,20px);color:var(--suave);max-width:60ch;margin:0 0 28px}
.seccion{padding:clamp(72px,10vw,128px) 0}.seccion.alt{background:var(--bg2)}
.ceja-o{display:inline-flex;align-items:center;gap:12px;font-size:12.5px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;margin:0 0 18px;color:var(--acento)}.ceja-o::before{content:"";width:28px;height:1px;background:currentColor}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;background:var(--acento);color:var(--sobre);text-decoration:none;font:600 16px/1.2 system-ui,-apple-system,sans-serif;padding:15px 24px;border-radius:999px;border:0;cursor:pointer;white-space:nowrap;transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s}
.btn:hover{transform:translateY(-2px);box-shadow:0 14px 30px -14px rgb(var(--sombra)/.55)}.btn:active{transform:translateY(0) scale(.98)}
.btn.claro{background:#f4f3ee;color:#15211c}.btn.fantasma{background:transparent;color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.45)}.btn.fantasma:hover{box-shadow:inset 0 0 0 1px #fff}
.btn.xl{font-size:18px;padding:19px 30px}
.btn-sec{appearance:none;font:600 15.5px/1.2 system-ui,-apple-system,sans-serif;color:var(--tinta);background:transparent;border:1.5px solid var(--linea);border-radius:999px;padding:13px 20px;cursor:pointer;transition:border-color .2s}.btn-sec:hover{border-color:var(--tinta)}
.enl{display:inline-flex;align-items:center;gap:8px;font-weight:600;text-decoration:none}.enl svg{transition:transform .25s}.enl:hover svg{transform:translateX(4px)}
/* cabecera */
.cab{position:absolute;inset:0 0 auto;z-index:5;color:#fff}.cab .kap{display:flex;justify-content:space-between;align-items:center;gap:16px;height:72px}
.cab a{color:#fff;text-decoration:none}.marca{display:flex;align-items:center;gap:10px;font-weight:600;font-size:15px;line-height:1.2}
.marca .mono{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;font-family:Fraunces,Georgia,serif;font-size:18px;background:rgba(255,255,255,.14);box-shadow:inset 0 0 0 1px rgba(255,255,255,.35)}
.marca small{display:block;font-weight:400;opacity:.8;font-size:12.5px}
.cab nav{display:flex;gap:22px;font-size:14.5px;align-items:center}.cab nav a{opacity:.85}.cab nav a:hover{opacity:1}
.cab nav a.siempre{opacity:1;padding:8px 14px;border-radius:999px;background:rgba(255,255,255,.14);box-shadow:inset 0 0 0 1px rgba(255,255,255,.3);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}

/* hero */
.hero{position:relative;min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;background:#0f1a15;color:#fff;isolation:isolate}
.hero .fondo{position:absolute;inset:-3%;z-index:-2}.hero .fondo img,.hero .fondo .sinfoto{width:100%;height:100%;object-fit:cover;display:block}
.hero::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(8,14,11,.6) 0,rgba(8,14,11,.08) 26%,rgba(8,14,11,.3) 52%,rgba(8,14,11,.9) 100%)}
.hero .kap{padding-top:120px;padding-bottom:clamp(40px,7vh,80px)}
.hero h1{font-size:clamp(40px,6.6vw,88px);font-weight:400;line-height:1.04;margin:0 0 22px;max-width:15ch;text-wrap:balance}
.hero h1 em{font-style:italic;font-weight:300;color:var(--oro)}
.pal-mask{padding:0 .05em .14em;margin:0 -.05em -.14em}
.hero .lead{color:rgba(255,255,255,.88);max-width:46ch;margin-bottom:28px}
.ceja{display:inline-flex;align-items:center;gap:12px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;margin:0 0 22px;color:rgba(255,255,255,.9)}.ceja::before{content:"";width:28px;height:1px;background:currentColor}
.gancho{font-family:Fraunces,Georgia,serif;font-style:italic;font-size:clamp(20px,2.2vw,26px);color:var(--oro);margin:0 0 28px;line-height:1.3}
.g-rot>span+span::before{content:" · "}
.acciones{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.hero .credito{position:absolute;right:12px;top:78px;font-size:11px;color:rgba(255,255,255,.62);max-width:calc(100% - 24px);text-align:right}.hero .credito a{color:inherit}
.hero.sub{min-height:min(76svh,780px)}.hero.sub h1{font-size:clamp(38px,6vw,84px);max-width:17ch;letter-spacing:-.025em}
.miga{font-size:14px;margin:0 0 18px;color:rgba(255,255,255,.8)}.miga a{color:inherit}.miga ol{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px}.miga li+li::before{content:"/";margin-right:6px;opacity:.6}
.sinfoto{background:radial-gradient(120% 90% at 20% 10%,#2f6b54 0,transparent 55%),radial-gradient(90% 80% at 85% 30%,#b0702a 0,transparent 50%),linear-gradient(160deg,#173328,#0d1a14)}
/* hero de portada: titular enorme, fila de cierre y cinta de destinos */
.hero-p .kap{padding-top:112px;padding-bottom:clamp(24px,3.5vh,40px)}
.hero-p h1{font-size:clamp(46px,7.2vw,116px);font-weight:350;line-height:.97;letter-spacing:-.022em;max-width:17ch;margin:0 0 clamp(22px,3.4vw,40px)}
@media (min-width:900px){.hero-fila .lead{font-size:17px;max-width:58ch}}
.hero-fila{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:20px 56px;align-items:end;border-top:1px solid rgba(255,255,255,.22);padding-top:clamp(20px,3vw,32px)}
.hero-fila .lead{margin:0 0 16px}.hero-fila .gancho{margin:0}
@media (max-width:900px){.hero-fila{grid-template-columns:1fr}}
.cinta{position:relative;border-top:1px solid rgba(255,255,255,.18);background:rgba(8,14,11,.35);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);overflow:hidden;padding:16px 0;-webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}
.cinta-pista{display:flex;width:max-content;animation:cinta 60s linear infinite}
.cinta ul{display:flex;list-style:none;margin:0;padding:0}
.cinta li{display:flex;align-items:center;font:400 clamp(26px,3.6vw,52px)/1.1 Fraunces,Georgia,serif;letter-spacing:-.02em;white-space:nowrap;padding-right:.55em}
.cinta li:nth-child(even){color:transparent;-webkit-text-stroke:1px rgba(255,255,255,.8);font-style:italic}
.cinta li::after{content:"";width:.16em;height:.16em;border-radius:50%;background:var(--oro);margin-left:.55em}
.cinta:hover .cinta-pista{animation-play-state:paused}
@keyframes cinta{to{transform:translateX(-50%)}}
/* datos rápidos bajo el hero */
.datos{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid var(--linea)}
.datos div{padding:26px 16px;border-right:1px solid var(--linea)}.datos div:last-child{border-right:0}
.datos strong{display:block;font-family:Fraunces,Georgia,serif;font-weight:500;font-size:clamp(22px,2.6vw,32px);line-height:1.1}.datos span{color:var(--suave);font-size:14.5px}
@media (max-width:640px){.datos{grid-template-columns:1fr}.datos div{border-right:0;border-bottom:1px solid var(--linea);padding:18px 0}.datos div:last-child{border-bottom:0}}
/* configurador */
.cfg-c{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,8fr);gap:clamp(28px,5vw,80px);align-items:start}
.cfg-c .fijo{position:sticky;top:32px}
@media (max-width:960px){.cfg-c{grid-template-columns:minmax(0,1fr)}.cfg-c .fijo{position:static}}
@media (max-width:640px){.cfg-sinjs .btn{width:100%;white-space:normal}}
.cfg h2{font-size:clamp(38px,6vw,80px);line-height:.98;letter-spacing:-.035em}
.cfg-pase{display:none;margin-top:8px;background:var(--noche);color:#eef2ee;border-radius:22px;overflow:hidden;box-shadow:0 30px 60px -40px rgb(var(--sombra)/.9)}
.cfg-js .cfg-pase{display:block}
.cfg-pase header{display:flex;justify-content:space-between;align-items:center;padding:14px 20px;border-bottom:2px dashed rgba(255,255,255,.16);font:600 11.5px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--oro)}
.cfg-pase dl{display:grid;grid-template-columns:1fr 1fr;margin:0}
.cfg-pase dl>div{padding:14px 20px;border-bottom:1px solid rgba(255,255,255,.08)}.cfg-pase dl>div:nth-child(odd){border-right:1px solid rgba(255,255,255,.08)}
.cfg-pase dl>div.ancho{grid-column:1/-1;border-right:0}
.cfg-pase dt{font:600 10.5px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;color:rgba(238,242,238,.55);margin-bottom:6px}
.cfg-pase dd{margin:0;font:400 22px/1.2 Fraunces,Georgia,serif;min-height:1.2em}.cfg-pase dd.vacio{color:rgba(238,242,238,.3)}
.cfg-pase .ancho dd{font-size:16px;font-family:system-ui,-apple-system,sans-serif}
.cfg-caja{background:var(--kart);border:1px solid var(--linea);border-radius:28px;padding:clamp(20px,3.6vw,48px);box-shadow:0 40px 80px -60px rgb(var(--sombra)/.7)}
.cfg-barra{display:none;height:4px;background:var(--linea);border-radius:4px;overflow:hidden;margin-bottom:16px}.cfg-barra span{display:block;height:100%;width:20%;background:var(--acento);border-radius:4px;transition:width .6s cubic-bezier(.16,1,.3,1)}
.cfg-estado{display:none;font:600 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--suave);margin:0 0 20px}
.cfg-js .cfg-barra,.cfg-js .cfg-estado{display:block}
.cfg-paso,.cfg-final,.cfg-nav{display:none}
.cfg-js .cfg-paso:not([hidden]),.cfg-js .cfg-final:not([hidden]){display:block}.cfg-js .cfg-nav{display:flex}.cfg-js .cfg-sinjs{display:none}
.cfg-paso h3,.cfg-final h3{font-size:clamp(28px,3.6vw,46px);letter-spacing:-.025em;margin:0 0 8px;outline:none}
.cfg-ayuda{color:var(--suave);margin:0 0 22px;font-size:15.5px}
.cfg-op{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(min(100%,200px),1fr))}
.cfg-op.num{grid-template-columns:repeat(3,minmax(0,1fr))}.cfg-op.dias{grid-template-columns:repeat(4,minmax(0,1fr))}.cfg-op.mes{grid-template-columns:repeat(auto-fill,minmax(112px,1fr))}
@media (max-width:640px){.cfg-op.dias{grid-template-columns:repeat(2,minmax(0,1fr))}.cfg-op{grid-template-columns:1fr}.cfg-op.num{grid-template-columns:repeat(3,minmax(0,1fr))}.cfg-op.mes{grid-template-columns:repeat(3,minmax(0,1fr))}}
.op{appearance:none;font:600 17px/1.25 system-ui,-apple-system,sans-serif;cursor:pointer;min-height:64px;padding:14px 16px 14px 18px;border-radius:18px;border:1.5px solid var(--linea);background:var(--bg);color:var(--tinta);text-align:left;display:flex;align-items:center;justify-content:space-between;gap:10px;transition:transform .3s cubic-bezier(.16,1,.3,1),border-color .2s,background .25s,color .25s}
.op:hover{border-color:var(--acento);transform:translateY(-2px)}
.op .op-check{flex:none;width:24px;height:24px;border-radius:50%;border:1.5px solid currentColor;opacity:.35;display:grid;place-items:center}.op .op-check svg{width:14px;height:14px;opacity:0}
.op[aria-pressed="true"]{background:var(--acento);border-color:var(--acento);color:var(--sobre)}
.op[aria-pressed="true"] .op-check{opacity:1;background:var(--sobre);color:var(--acento);border-color:var(--sobre)}.op[aria-pressed="true"] .op-check svg{opacity:1}
.op-grande{flex-direction:column;justify-content:center;align-items:center;text-align:center;min-height:clamp(96px,11vw,128px);gap:2px}
.op-grande .op-n{font:300 clamp(40px,5vw,64px)/1 Fraunces,Georgia,serif;letter-spacing:-.03em;color:transparent;-webkit-text-stroke:1.2px var(--tinta)}
.op-grande .op-n.txt{font-size:clamp(22px,2.4vw,28px);-webkit-text-stroke:0;color:inherit;font-weight:400}
.op-grande .op-s{font-size:13px;font-weight:600;color:var(--suave);letter-spacing:.04em}
.op-grande[aria-pressed="true"] .op-n{color:var(--sobre);-webkit-text-stroke:0}.op-grande[aria-pressed="true"] .op-s{color:inherit;opacity:.8}
.op-mes{flex-direction:column;align-items:flex-start;justify-content:center;gap:0;min-height:68px}.op-mes small{font-weight:400;font-size:13px;opacity:.7}
.op-mes.ancho{grid-column:1/-1;align-items:center}
.cfg-nav{justify-content:space-between;align-items:center;gap:12px;margin-top:28px;flex-wrap:wrap}.cfg-nav [data-sig]{margin-left:auto}
.cfg-resumen{display:grid;grid-template-columns:auto 1fr auto;gap:0 18px;margin:18px 0 30px;border-top:1px solid var(--linea)}
.cfg-resumen dt,.cfg-resumen dd,.cfg-resumen .cambiar{padding:13px 0;border-bottom:1px solid var(--linea);margin:0}
.cfg-resumen dt{font:600 11.5px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--suave);padding-top:16px}
.cfg-resumen dd{font-weight:600}.cfg-resumen .cambiar{display:flex;align-items:center}
.cfg-resumen .cambiar button{appearance:none;background:none;border:0;color:var(--acento);font:600 14px/1 system-ui,sans-serif;cursor:pointer;text-decoration:underline;text-underline-offset:3px;padding:6px 0}
.cfg-final h4{font-size:22px;margin:0 0 14px}
.cfg [hidden]{display:none!important}
.cfg-reco{list-style:none;padding:0;margin:0 0 28px;display:grid;gap:12px;grid-template-columns:repeat(3,minmax(0,1fr))}
.cfg-reco a{display:grid;grid-template-rows:auto 1fr;height:100%;text-decoration:none;color:var(--tinta);border:1px solid var(--linea);border-radius:16px;overflow:hidden;background:var(--bg);transition:transform .3s cubic-bezier(.16,1,.3,1)}
.cfg-reco a:hover{transform:translateY(-3px)}
.cfg-reco .im{aspect-ratio:16/10;background:#1d2b25 center/cover}
.cfg-reco .tx{padding:12px 14px 14px}.cfg-reco small{display:block;font-size:11.5px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:var(--acento);margin-bottom:4px}.cfg-reco strong{font:500 17px/1.25 Fraunces,Georgia,serif}
@media (max-width:640px){.cfg-reco{grid-template-columns:minmax(0,1fr)}.cfg-reco a{grid-template-columns:96px minmax(0,1fr);grid-template-rows:auto;align-items:stretch}.cfg-reco .im{grid-column:1;grid-row:1;aspect-ratio:auto;width:96px;min-width:0;min-height:96px;height:100%}.cfg-reco .tx{grid-column:2;grid-row:1;min-width:0;padding:12px 14px;align-self:center;overflow-wrap:anywhere}.cfg-reco strong{font-size:16px;display:block}}
.cfg-envio{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
@media (max-width:640px){.cfg-envio .btn{width:100%;white-space:normal}.cfg-resumen{grid-template-columns:1fr auto}.cfg-resumen dt{grid-column:1/-1;border-bottom:0;padding-bottom:0}}
.cfg-nota{font-size:14px;color:var(--suave);margin:14px 0 0}
.cfg-sinjs p{margin:0 0 20px;font-size:18px}
/* mapa */
.mapa-s{background:var(--noche);color:#eef2ee;overflow:hidden;position:relative}
.mapa-s h2{color:#fff}.mapa-s .lead{color:rgba(238,242,238,.72)}.mapa-s .ceja-o{color:var(--oro)}
.mapa-c{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,7fr);gap:clamp(28px,5vw,72px);align-items:center}
@media (max-width:960px){.mapa-c{grid-template-columns:minmax(0,1fr)}}
.mapa{margin:0}.mapa svg{width:100%;height:auto;display:block;overflow:hidden;font-size:var(--fs)}
@media (max-width:640px){.mapa svg{font-size:var(--fsm)}}
.mapa .mar{fill:transparent}.mapa .reja{fill:none;stroke:rgba(255,255,255,.06);stroke-width:1;vector-effect:non-scaling-stroke}
.mapa .tierra{fill:#1a2b23;stroke:rgba(255,255,255,.3);stroke-width:1;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.mapa .seg{fill:none;stroke:var(--oro);stroke-width:2.5;stroke-linecap:round;vector-effect:non-scaling-stroke;filter:drop-shadow(0 0 6px rgba(242,196,109,.55))}
.mapa .halo{fill:rgba(242,196,109,.16);transition:fill .3s}.mapa .nucleo{fill:var(--oro);stroke:var(--noche);stroke-width:2;vector-effect:non-scaling-stroke}
.mapa text{fill:#eef2ee;font-family:Fraunces,Georgia,serif;font-weight:500;paint-order:stroke;stroke:var(--noche);stroke-width:.3em;stroke-linejoin:round;transition:fill .3s}
.mapa a{cursor:pointer}.mapa a:hover text,.mapa a:focus-visible text,.mapa .foco text{fill:var(--oro)}.mapa a:hover .halo,.mapa .foco .halo{fill:rgba(242,196,109,.45)}
.mapa a:focus-visible{outline:none}.mapa a:focus-visible .nucleo{stroke:#fff;stroke-width:3}
.paradas{list-style:none;padding:0;margin:8px 0 0;display:grid;grid-template-columns:1fr 1fr;gap:0 24px;counter-reset:pr}
.paradas li{border-top:1px solid rgba(255,255,255,.12)}
.paradas a,.paradas span.sin{display:flex;align-items:baseline;gap:12px;padding:11px 0;color:#eef2ee;text-decoration:none;font:400 19px/1.25 Fraunces,Georgia,serif}
.paradas a:hover{color:var(--oro)}.paradas .n{font:600 11.5px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--oro);letter-spacing:.06em}
.paradas a::after{content:"→";margin-left:auto;opacity:.45;font-family:system-ui,sans-serif;font-size:15px}
@media (max-width:420px){.paradas{grid-template-columns:1fr}}
.mapa.mini svg .mar{fill:var(--bg2)}.mapa.mini .reja{stroke:var(--linea)}
.mapa.mini .tierra{fill:var(--kart);stroke:var(--suave);stroke-opacity:.45}
.mapa.mini .seg{stroke:var(--acento);filter:none;stroke-width:3}
.mapa.mini .halo{fill:var(--acento-2)}.mapa.mini .nucleo{fill:var(--acento);stroke:var(--kart)}
.mapa.mini text{fill:var(--tinta);stroke:var(--bg2)}.mapa.mini a:hover text{fill:var(--acento)}
.ruta-fig{margin:0 0 44px;border:1px solid var(--linea);border-radius:22px;overflow:hidden;background:var(--kart)}
.ruta-fig figcaption{padding:14px 18px 16px;display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center}
.ruta-ol{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px 8px;font-weight:600}
.ruta-ol li{display:flex;align-items:center;gap:8px}.ruta-ol li+li::before{content:"→";color:var(--suave);font-weight:400}
/* índice por categorías */
.cats{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0 0}
.cats a{display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:999px;border:1px solid var(--linea);text-decoration:none;color:var(--tinta);font-weight:600;font-size:15px;background:var(--kart);transition:background .2s,color .2s,border-color .2s}
.cats a:hover{background:var(--acento);color:var(--sobre);border-color:var(--acento)}.cats a span{font:500 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;opacity:.6}
.cat-b{scroll-margin-top:24px}
.fila-cab{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin:clamp(48px,6vw,72px) 0 18px;border-top:1px solid var(--linea);padding-top:22px}
.fila-cab h3{font-size:clamp(28px,3.4vw,44px);letter-spacing:-.025em;margin:0}.fila-cab h3 .cnt{font:500 14px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--suave);vertical-align:super;margin-left:8px;letter-spacing:0}
.fila-cab p{margin:6px 0 0;color:var(--suave);font-size:15.5px;max-width:56ch}
.fila-bt{display:flex;gap:8px;flex:none}.fila-bt button{appearance:none;width:46px;height:46px;border-radius:50%;border:1.5px solid var(--linea);background:var(--kart);color:var(--tinta);cursor:pointer;display:grid;place-items:center;transition:border-color .2s,opacity .2s}
.fila-bt button:hover{border-color:var(--tinta)}.fila-bt button:disabled{opacity:.35;cursor:default}.fila-bt button.izq svg{transform:scaleX(-1)}
@media (max-width:640px),(pointer:coarse){.fila-bt{display:none}}
.fila{list-style:none;display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;margin:0 -16px;padding:4px 16px 20px;scroll-padding:0 16px;scrollbar-width:thin;scrollbar-color:var(--linea) transparent;overscroll-behavior-x:contain}
@media (min-width:768px){.fila{margin:0 -32px;padding:4px 32px 20px;scroll-padding:0 32px}}
.fila>li{flex:0 0 min(340px,calc(100vw - 72px));scroll-snap-align:start}
/* tarjetas de páginas */
.guias{list-style:none;padding:0;margin:40px 0 0;display:grid;gap:18px;grid-template-columns:repeat(auto-fill,minmax(min(100%,270px),1fr))}
.tj{position:relative;border-radius:20px;overflow:hidden;background:var(--kart);border:1px solid var(--linea);transition:transform .45s cubic-bezier(.16,1,.3,1),box-shadow .45s}
.tj:hover{transform:translateY(-4px);box-shadow:0 26px 50px -34px rgb(var(--sombra)/.7)}
.tj>a{display:block;color:var(--tinta);text-decoration:none;height:100%}
.tj figure{margin:0;aspect-ratio:4/3;overflow:hidden;background:#1d2b25}.tj figure img,.tj figure .sinfoto{width:100%;height:100%;object-fit:cover;display:block;transition:transform .9s cubic-bezier(.16,1,.3,1)}
.tj:hover figure img{transform:scale(1.06)}
.tj .ki{padding:16px 18px 20px}.tj h3{font-size:20px}.tj p{margin:0;color:var(--suave);font-size:15px}
.pill{display:inline-block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:var(--acento);margin-bottom:8px}
.cred{position:absolute;top:10px;right:10px;z-index:2}
.cred summary{list-style:none;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:rgba(10,16,13,.55);color:#fff;font:600 14px/1 system-ui,sans-serif;cursor:pointer;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.3)}
.cred summary::-webkit-details-marker{display:none}.cred[open] summary{background:#0a100d}
.cred p{position:absolute;right:0;top:36px;width:max-content;max-width:min(280px,calc(100vw - 80px));margin:0;padding:9px 12px;border-radius:12px;background:rgba(10,16,13,.94);color:#fff;font-size:12.5px;line-height:1.45;text-align:left}.cred p a{color:#fff}
/* servicios: rejilla con ritmo */
.servicios{display:grid;gap:14px;grid-template-columns:repeat(12,1fr);list-style:none;padding:0;margin:40px 0 0}
.servicios li{grid-column:span 3;background:var(--kart);border:1px solid var(--linea);border-radius:20px;padding:26px 24px 28px;transition:transform .35s cubic-bezier(.16,1,.3,1),box-shadow .35s}
.servicios li:hover{transform:translateY(-4px);box-shadow:0 22px 40px -28px rgb(var(--sombra)/.6)}
.servicios li:nth-child(1){grid-column:span 6;background:var(--acento);color:var(--sobre);border-color:transparent}.servicios li:nth-child(1) p{color:inherit;opacity:.85}.servicios li:nth-child(1) .ico-c{background:rgba(255,255,255,.14);color:inherit}
.servicios li:nth-child(6){grid-column:span 6;background:var(--acento-2)}
.servicios .ico-c{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:var(--acento-2);color:var(--acento);margin-bottom:22px}
.servicios p{margin:0;color:var(--suave);font-size:15.5px}
@media (max-width:1000px){.servicios li,.servicios li:nth-child(1),.servicios li:nth-child(6){grid-column:span 6}}
@media (max-width:640px){.servicios{gap:10px}.servicios li{grid-column:span 6;padding:18px 16px 20px;border-radius:16px}.servicios li:nth-child(1),.servicios li:nth-child(6){grid-column:1/-1}.servicios .ico-c{width:40px;height:40px;margin-bottom:14px}.servicios h3{font-size:18px}.servicios p{font-size:14.5px}}
.servicios li:nth-child(6) .ico-c{background:var(--kart)}
/* billetes troquelados */
.billetes{list-style:none;padding:0;margin:44px 0 0;display:grid;gap:22px;overflow-x:clip;overflow-y:visible}
.billete{--corte:62%;position:relative;display:grid;grid-template-columns:var(--corte) 1fr;background:var(--kart);border:1px solid var(--linea);border-radius:18px;box-shadow:0 18px 40px -30px rgb(var(--sombra)/.55);transition:transform .45s cubic-bezier(.16,1,.3,1)}
.billete:hover{transform:translateY(-3px) rotate(-.4deg)}
.billete>div{padding:28px clamp(20px,3vw,36px)}
.billete .talon{background:var(--acento-2);border-left:2px dashed var(--linea);border-radius:0 18px 18px 0;position:relative}
.billete::before,.billete::after{content:"";position:absolute;left:var(--corte);width:26px;height:26px;margin-left:-13px;border-radius:50%;background:var(--bg);border:1px solid var(--linea)}
.billete::before{top:-14px;clip-path:inset(50% 0 0 0)}.billete::after{bottom:-14px;clip-path:inset(0 0 50% 0)}
.seccion.alt .billete::before,.seccion.alt .billete::after{background:var(--bg2)}
.b-num{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;color:var(--suave);letter-spacing:.06em}
.billete h3{font-size:clamp(22px,2.4vw,28px);margin:6px 0 12px}
.etq{display:block;font-size:12.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--suave);margin-bottom:6px}
.billete p{margin:0 0 14px}.talon .etq{color:var(--acento)}
.sello{position:absolute;right:18px;top:-16px;width:76px;height:76px;border-radius:50%;display:grid;place-items:center;text-align:center;font:700 10.5px/1.15 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--ambar);border:2px solid currentColor;box-shadow:inset 0 0 0 4px var(--acento-2),inset 0 0 0 5px currentColor;background:var(--acento-2);transform:rotate(-12deg)}
@media (max-width:720px){.billete{grid-template-columns:1fr}.billete .talon{border-left:0;border-top:2px dashed var(--linea);border-radius:0 0 18px 18px}.billete::before,.billete::after{display:none}.sello{top:auto;bottom:16px;width:64px;height:64px;font-size:9.5px}}
/* sí / no gestiona */
.siono{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:40px}
.siono>div{border-radius:20px;padding:30px clamp(20px,3vw,36px);border:1px solid var(--linea);background:var(--kart)}
.siono .si{background:var(--acento);color:var(--sobre);border-color:transparent}.siono .si .ok{background:rgba(255,255,255,.16);color:inherit}.siono .si p{opacity:.85}
.siono h3{font-size:26px;margin-bottom:18px}.siono ul{list-style:none;padding:0;margin:0;display:grid;gap:16px}
.siono li{display:grid;grid-template-columns:30px 1fr;gap:12px;align-items:start}.siono li strong{display:block}
.siono p{margin:2px 0 0;font-size:15.5px;color:inherit;opacity:.8}.siono .consejo{display:block;margin-top:6px;font-size:14.5px;color:var(--acento);opacity:1}
.ok{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--acento-2);color:var(--acento)}
@media (max-width:760px){.siono{grid-template-columns:1fr}}
/* pasos */
.pasos-c{display:grid;grid-template-columns:5fr 7fr;gap:clamp(32px,6vw,96px)}.pasos-c .fijo{position:sticky;top:40px;align-self:start}
.pasos{list-style:none;margin:0;padding:0 0 0 60px;position:relative;counter-reset:p}
.p-linea,.dias-linea{position:absolute;left:21px;top:10px;bottom:10px;width:2px;background:var(--linea);border-radius:2px}.p-linea span,.dias-linea span{position:absolute;inset:0;background:var(--acento);transform-origin:top;border-radius:2px}
.pasos li{position:relative;padding:4px 0 44px;counter-increment:p}.pasos li:last-child{padding-bottom:0}
.pasos li::before{content:counter(p);position:absolute;left:-60px;top:0;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--kart);border:1px solid var(--linea);font-family:Fraunces,Georgia,serif;font-size:19px;color:var(--acento);transition:background .4s,color .4s}
.pasos li.activo::before{background:var(--acento);color:var(--sobre);border-color:var(--acento)}
.pasos h3{font-size:24px;margin-top:6px}.pasos p{margin:0;color:var(--suave)}
@media (max-width:860px){.pasos-c{grid-template-columns:1fr}.pasos-c .fijo{position:static}}
/* día a día */
.dias{list-style:none;margin:24px 0 8px;padding:0 0 0 56px;position:relative}
.dias-linea{left:13px}
.dias>li{position:relative;padding:0 0 38px}.dias>li:last-child{padding-bottom:4px}
.dias>li::before{content:"";position:absolute;left:-50px;top:4px;width:18px;height:18px;border-radius:50%;background:var(--kart);border:2px solid var(--acento);transition:background .4s,box-shadow .4s}
.dias>li.activo::before{background:var(--acento);box-shadow:0 0 0 7px var(--acento-2)}
.dia-n{font:700 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--acento)}
.dias h3{font-size:clamp(22px,2.4vw,27px);margin:8px 0 8px}.dias p{margin:0 0 8px}
.dia-lugar{display:inline-flex;align-items:center;gap:6px;font-size:14px;color:var(--suave);font-weight:600}.dia-lugar svg{width:16px;height:16px}
/* corea */
.corea{position:relative;overflow:hidden;background:#101a16;color:#eef2ee;padding:clamp(64px,9vw,110px) 0}
.corea .kanji{position:absolute;right:-2vw;top:50%;transform:translateY(-50%);font:500 clamp(120px,22vw,300px)/1 "Apple SD Gothic Neo","Noto Sans KR",sans-serif;color:transparent;-webkit-text-stroke:1px rgba(255,255,255,.14);white-space:nowrap;pointer-events:none;user-select:none}
.corea h2{margin-bottom:10px}.corea p{max-width:48ch;color:rgba(238,242,238,.8);margin:0}
.pildora{display:inline-block;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:7px 14px;border-radius:999px;background:rgba(242,196,109,.14);color:var(--oro);margin-bottom:18px}
/* antonio */
.persona{display:grid;grid-template-columns:auto 1fr;gap:clamp(24px,4vw,56px);align-items:start;max-width:900px}
.persona .mono{width:clamp(88px,12vw,140px);aspect-ratio:1;border-radius:50%;display:grid;place-items:center;background:var(--acento);color:var(--sobre);font:400 clamp(44px,6vw,72px)/1 Fraunces,Georgia,serif}
.persona p{margin:0 0 14px;max-width:62ch}
@media (max-width:640px){.persona{grid-template-columns:1fr}}
.persona .retrato{width:clamp(200px,24vw,300px);height:auto;aspect-ratio:1;object-fit:cover;border-radius:24px;display:block;box-shadow:0 24px 50px -28px rgb(var(--sombra)/.6)}
.marca img.mono{object-fit:cover;padding:0}
/* ficha rápida */
.ficha{background:var(--kart);border:1px solid var(--linea);border-radius:20px;padding:22px clamp(18px,3vw,32px) 12px;margin:clamp(32px,5vw,56px) 0 0;max-width:900px}
.cuerpo .ficha{margin:28px 0}
.ficha-cab{display:flex;align-items:center;gap:14px;margin-bottom:6px}
.ficha-cab h2{font-size:clamp(22px,2.6vw,28px)!important;margin:0!important}
.ficha-cara{width:56px;height:56px;border-radius:50%;flex:none;object-fit:cover;display:grid;place-items:center;background:var(--acento);color:var(--sobre);font:400 26px/1 Fraunces,Georgia,serif}
.ficha dl{margin:8px 0 0}
.ficha dl div{display:grid;grid-template-columns:150px 1fr;gap:12px;padding:10px 0;border-top:1px solid var(--linea)}
.ficha dt{font-weight:700;font-size:14.5px;color:var(--suave)}
.ficha dd{margin:0}
@media (max-width:560px){.ficha dl div{grid-template-columns:1fr;gap:2px}}
/* opiniones */
.opiniones{list-style:none;padding:0;margin:24px 0;display:grid;gap:16px;max-width:820px}
.opiniones li{background:var(--kart);border:1px solid var(--linea);border-radius:18px;padding:18px 20px}
.opiniones p{margin:0 0 8px}.opiniones .estrellas{color:var(--ambar);letter-spacing:2px;font-size:18px}.opiniones .autor{color:var(--suave);font-size:14.5px;margin:0}
.op-vacio{background:var(--kart);border:1px dashed var(--linea);border-radius:18px;padding:22px;max-width:820px}
/* faq */
.faq{max-width:820px;margin-top:32px}
.faq details{border-top:1px solid var(--linea);padding:4px 0}.faq details:last-child{border-bottom:1px solid var(--linea)}
.faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:16px;padding:18px 0;font-weight:600;font-size:18px}.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";font:300 26px/1 system-ui;color:var(--acento);transition:transform .3s}.faq details[open] summary::after{transform:rotate(45deg)}
.faq details p{margin:0 0 20px;color:var(--suave);max-width:68ch}
/* cierre */
.cierre h2{max-width:18ch}
/* artículo */
.articulo{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:clamp(32px,5vw,72px);padding-top:clamp(48px,7vw,88px);padding-bottom:clamp(56px,8vw,100px)}
.articulo .cuerpo{max-width:740px;min-width:0}
.articulo .entr{font-size:clamp(20px,2.1vw,24px);line-height:1.5;margin:0 0 40px;font-family:Fraunces,Georgia,serif;font-weight:400}
.articulo h2{font-size:clamp(28px,3.2vw,40px);margin:56px 0 14px;scroll-margin-top:24px}
.articulo ul.lista{padding:0;list-style:none;display:grid;gap:10px;margin:18px 0}
.articulo ul.lista li{position:relative;padding-left:26px}.articulo ul.lista li::before{content:"";position:absolute;left:4px;top:.62em;width:9px;height:9px;border-radius:50%;border:2px solid var(--acento)}
.lateral{position:sticky;top:24px;align-self:start;display:grid;gap:16px}
.caja{background:var(--kart);border:1px solid var(--linea);border-radius:20px;padding:22px}
.caja h3{font-size:20px}.caja p{margin:0 0 14px;color:var(--suave);font-size:15.5px}.caja .btn{width:100%;justify-content:center}
.indice ol{margin:0;padding-left:18px;font-size:15px;display:grid;gap:6px}.indice a{color:var(--tinta);text-decoration:none}.indice a:hover{color:var(--acento)}
@media (max-width:960px){.articulo{grid-template-columns:1fr}.lateral{position:static}.indice{display:none}}
.aviso{border-left:3px solid var(--ambar);background:var(--kart);padding:16px 20px;border-radius:0 14px 14px 0;margin:18px 0}
.aviso ul{margin:0;padding-left:18px}
.fuentes{list-style:none;padding:0;margin:20px 0 0;display:grid;gap:10px}
.fuentes li{display:grid;grid-template-columns:1fr auto;gap:4px 16px;padding:14px 0;border-bottom:1px solid var(--linea)}
.fuentes .dom{font-size:14px;color:var(--suave)}.fuentes time{font-size:13px;color:var(--suave);white-space:nowrap}
.vigencia{font-size:14.5px;color:var(--suave)}
/* pie */
footer{border-top:1px solid var(--linea);padding:44px 0 110px;color:var(--suave);font-size:14.5px}footer a{color:var(--suave)}footer p{margin:0 0 10px;max-width:80ch}
.pie-cats{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px 28px;margin:24px 0}
.pie-cats h4{font:700 12px/1 system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--tinta);margin:0 0 10px}
.pie-cats ul{list-style:none;margin:0;padding:0;display:grid;gap:6px}.pie-cats a{text-decoration:none}.pie-cats a:hover{color:var(--acento)}
/* WhatsApp fijo */
.wa-fijo{position:fixed;right:16px;bottom:16px;z-index:9;display:inline-flex;align-items:center;gap:10px;background:var(--acento);color:var(--sobre);text-decoration:none;font-weight:600;font-size:15px;padding:13px 20px 13px 16px;border-radius:999px;box-shadow:0 14px 34px -12px rgb(var(--sombra)/.7),inset 0 1px 0 rgba(255,255,255,.18);transition:transform .3s cubic-bezier(.16,1,.3,1),opacity .3s}
.wa-fijo:hover{transform:translateY(-2px)}
.wa-fijo.oculto{transform:translateY(140%);opacity:0;pointer-events:none}
@media (max-width:640px){.wa-fijo{right:12px;bottom:12px;padding:14px;font-size:0;gap:0}.wa-fijo span{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}.wa-fijo svg{width:24px;height:24px}footer{padding-bottom:88px}}
:focus-visible{outline:2px solid var(--ambar);outline-offset:3px}
/* estados que pone el JS (solo con animación permitida) */
.js-anim:not(.anim-listo) .hero h1{visibility:hidden}.js-anim:not(.anim-listo) .hero .entra{opacity:0}
.js-anim .g-rot{display:inline-grid;vertical-align:bottom}.js-anim .g-rot>span{grid-area:1/1}.js-anim .g-rot>span+span::before{content:none}
@media (prefers-reduced-motion:reduce){*{transition:none!important}.cinta-pista{animation:none;width:auto}.cinta ul[aria-hidden]{display:none}.cinta ul{flex-wrap:wrap;row-gap:6px;padding:0 16px}}
`

// ---------------------------------------------------------------- JS (se escribe en public/familias/familias.js)
const JS = `// Generado por scripts/familias.mjs. Mejora progresiva: sin esto la página se ve entera.
(function () {
  var html = document.documentElement
  var reducido = matchMedia('(prefers-reduced-motion: reduce)').matches
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }

  // ------------------------------------------------ configurador (siempre que haya JS)
  function configurador() {
    var raiz = document.getElementById('disena'), datosEl = document.getElementById('cfg-datos')
    if (!raiz || !datosEl) return
    var D; try { D = JSON.parse(datosEl.textContent) } catch (e) { console.error('familias: cfg-datos no parsea', e); return }
    var pasos = $$('.cfg-paso', raiz), final = raiz.querySelector('.cfg-final')
    var barra = raiz.querySelector('.cfg-barra span'), estado = raiz.querySelector('.cfg-estado')
    var atras = raiz.querySelector('[data-atras]'), sig = raiz.querySelector('[data-sig]')
    if (!pasos.length || !final || !sig || !atras) return
    raiz.classList.add('cfg-js')
    var total = pasos.length, actual = 0, eleccion = {}, espera = null

    function valores(campo) { return eleccion[campo] || [] }
    function texto(campo) { return valores(campo).map(function (v) { return v.valor }).join(', ') }
    function pase() {
      $$('[data-pase]', raiz).forEach(function (dd) {
        var t = texto(dd.getAttribute('data-pase'))
        dd.textContent = t || dd.getAttribute('data-vacio')
        dd.classList.toggle('vacio', !t)
      })
    }
    function etiquetaSig() {
      if (actual >= total) return
      var hay = valores(pasos[actual].getAttribute('data-campo')).length
      sig.textContent = actual === total - 1 ? 'Ver el resumen' : (hay ? 'Siguiente' : 'Saltar este paso')
    }
    function mostrar(n, enfocar) {
      actual = Math.max(0, Math.min(n, total))
      pasos.forEach(function (p, k) { p.hidden = k !== actual })
      final.hidden = actual !== total
      barra.style.width = (Math.min(actual + 1, total) / total * 100) + '%'
      estado.textContent = actual < total ? 'Paso ' + (actual + 1) + ' de ' + total : 'Resumen del viaje'
      atras.hidden = actual === 0
      sig.hidden = actual === total
      etiquetaSig()
      if (actual === total) pintarFinal()
      var vis = actual < total ? pasos[actual] : final
      if (enfocar) {
        var h = vis.querySelector('h3'); if (h) h.focus({ preventScroll: true })
        var caja = raiz.querySelector('.cfg-caja'), r = caja.getBoundingClientRect()
        if (r.top < 0 || r.top > innerHeight * 0.5) window.scrollTo({ top: scrollY + r.top - 24, behavior: reducido ? 'auto' : 'smooth' })
      }
      if (window.gsap && !reducido) window.gsap.fromTo($$('.op, .cfg-reco li, .cfg-resumen > *', vis), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, ease: 'power3.out', stagger: 0.025, overwrite: true })
    }

    // Puntuación: palabras clave en el texto de cada página (sin acentos).
    var CLAVES = {
      templos: ['templo', 'santuario', 'cultura', 'castillo', 'tradicion', 'historia', 'kioto', 'nara'],
      naturaleza: ['naturaleza', 'montana', 'fuji', 'hakone', 'alpes', 'takayama', 'senderismo', 'bosque', 'kumano', 'lago'],
      ryokan: ['ryokan', 'onsen', 'aguas termales'],
      anime: ['anime', 'manga', 'akihabara', 'ghibli', 'pokemon', 'videojuego', 'otaku', 'nintendo'],
      parques: ['parque tematico', 'parques tematicos', 'universal', 'disney', 'usj', 'atracciones'],
      gastro: ['gastronomia', 'comer', 'comida', 'mercado', 'ramen', 'sushi', 'cocina', 'restaurante'],
      compras: ['compras', 'tiendas', 'shopping', 'artesania', 'mercadillo'],
      ninos: ['ninos', 'pequenos', 'bebe', 'carrito'],
      abuelos: ['abuelos', 'mayores', 'ritmo', 'tranquilo', 'suave', 'movilidad', 'descanso']
    }
    var EPOCA = [
      ['invierno', 'nieve', 'enero', 'febrero', 'diciembre', 'ano nuevo'], ['invierno', 'nieve', 'enero', 'febrero', 'diciembre'], ['primavera', 'sakura', 'cerezo', 'marzo', 'semana santa'],
      ['primavera', 'sakura', 'cerezo', 'abril', 'semana santa'], ['primavera', 'mayo', 'golden week'], ['verano', 'junio', 'lluvias'],
      ['verano', 'julio', 'vacaciones de verano'], ['verano', 'agosto', 'vacaciones de verano'], ['otono', 'septiembre'],
      ['otono', 'octubre', 'momiji'], ['otono', 'noviembre', 'momiji', 'koyo'], ['invierno', 'diciembre', 'nieve', 'navidad']
    ]
    function hits(t, lista) { var n = 0; lista.forEach(function (w) { if (t.indexOf(w) !== -1) n++ }); return n }
    function recomendar() {
      var gustos = valores('gustos').map(function (v) { return v.clave })
      var dias = +((valores('dias')[0] || {}).clave || 0)
      var mes = (valores('mes')[0] || {}).clave
      var mesN = mes && mes !== 'nose' ? +mes : -1
      var lista = D.paginas.map(function (p) {
        var s = { itinerario: 3, destino: 2, temporada: 1, ocasion: 1 }[p.cat] || 0
        gustos.forEach(function (g) { s += 3 * Math.min(2, hits(p.txt, CLAVES[g] || [])) })
        if (dias && p.ndias && Math.abs(p.ndias - dias) <= 3) s += 6
        if (dias && p.txt.indexOf(dias + ' dias') !== -1) s += 4
        if (mesN >= 0 && p.cat === 'temporada') s += hits(p.txt, EPOCA[mesN]) ? 8 : -2
        if (gustos.indexOf('ninos') !== -1 && p.slug === 'viaje-japon-con-ninos') s += 4
        if (gustos.indexOf('abuelos') !== -1 && p.txt.indexOf('abuelos') !== -1) s += 3
        return { p: p, s: s }
      }).filter(function (x) { return ['itinerario', 'destino', 'temporada', 'ocasion'].indexOf(x.p.cat) !== -1 })
      lista.sort(function (a, b) { return b.s - a.s })
      var elegidas = lista.slice(0, 2).map(function (x) { return x.p })
      var origen = (valores('origen')[0] || {}).clave
      var deOrigen = origen && D.paginas.filter(function (p) { return p.slug === 'viaje-japon-desde-' + origen })[0]
      var personas = (valores('personas')[0] || {}).clave
      var grupo = personas === 'mas10' && D.paginas.filter(function (p) { return p.slug === 'viaje-japon-grupo-10-personas' })[0]
      var extra = deOrigen || grupo
      if (extra) elegidas.push(extra)
      else if (lista[2]) elegidas.push(lista[2].p)
      return elegidas
    }
    function pintarFinal() {
      var dl = final.querySelector('.cfg-resumen'); dl.innerHTML = ''
      pasos.forEach(function (p, k) {
        var dt = document.createElement('dt'); dt.textContent = p.getAttribute('data-etiqueta')
        var dd = document.createElement('dd'); dd.textContent = texto(p.getAttribute('data-campo')) || 'Por decidir'
        var c = document.createElement('div'); c.className = 'cambiar'
        var b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-ir', k); b.textContent = 'Cambiar'
        b.setAttribute('aria-label', 'Cambiar: ' + dt.textContent)
        c.appendChild(b); dl.appendChild(dt); dl.appendChild(dd); dl.appendChild(c)
      })
      var reco = recomendar(), ul = final.querySelector('.cfg-reco'); ul.innerHTML = ''
      reco.forEach(function (p) {
        var li = document.createElement('li'), a = document.createElement('a'); a.href = p.href
        var im = document.createElement('span'); im.className = 'im'; if (p.img) im.style.backgroundImage = 'url(' + p.img + ')'
        var tx = document.createElement('span'); tx.className = 'tx'
        var sm = document.createElement('small'); sm.textContent = p.catNombre
        var st = document.createElement('strong'); st.textContent = p.h1
        tx.appendChild(sm); tx.appendChild(st); a.appendChild(im); a.appendChild(tx); li.appendChild(a); ul.appendChild(li)
      })
      var l = ['Hola ' + D.nombre + ', queremos organizar un viaje a Japón.', '']
      pasos.forEach(function (p) { l.push('· ' + p.getAttribute('data-etiqueta') + ': ' + (texto(p.getAttribute('data-campo')) || 'por decidir')) })
      if (reco.length) { l.push('', 'Guías que nos interesan:'); reco.forEach(function (p) { l.push('· ' + p.h1 + ' (' + D.base + p.href + ')') }) }
      l.push('', 'Quedamos a la espera de una propuesta. Gracias.')
      final.querySelector('[data-wa]').href = 'https://wa.me/' + D.wa + '?text=' + encodeURIComponent(l.join('\\n'))
    }

    raiz.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || !raiz.contains(b)) return
      if (b.classList.contains('op')) {
        var paso = b.closest('.cfg-paso'), campo = paso.getAttribute('data-campo'), varios = paso.getAttribute('data-tipo') === 'varios'
        var ops = $$('.op', paso)
        if (varios) b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true')
        else ops.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false') })
        eleccion[campo] = ops.filter(function (o) { return o.getAttribute('aria-pressed') === 'true' }).map(function (o) { return { valor: o.getAttribute('data-valor'), clave: o.getAttribute('data-clave') } })
        pase(); etiquetaSig()
        clearTimeout(espera)
        if (!varios) espera = setTimeout(function () { mostrar(actual + 1, true) }, 380)
      } else if (b.hasAttribute('data-sig')) mostrar(actual + 1, true)
      else if (b.hasAttribute('data-atras')) mostrar(actual - 1, true)
      else if (b.hasAttribute('data-ir')) mostrar(+b.getAttribute('data-ir'), true)
      else if (b.hasAttribute('data-reinicio')) {
        eleccion = {}; $$('.op', raiz).forEach(function (o) { o.setAttribute('aria-pressed', 'false') }); pase(); mostrar(0, true)
      }
    })
    pase(); mostrar(0, false)
  }

  // ------------------------------------------------ filas horizontales: flechas en escritorio
  function filas() {
    $$('.fila').forEach(function (ul) {
      var cab = document.querySelector('[data-fila="' + ul.id + '"]'); if (!cab) return
      var bt = document.createElement('div'); bt.className = 'fila-bt'
      var flecha = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
      bt.innerHTML = '<button type="button" class="izq" aria-label="Anteriores">' + flecha + '</button><button type="button" aria-label="Siguientes">' + flecha + '</button>'
      cab.appendChild(bt)
      var b = bt.querySelectorAll('button')
      function paso() { var li = ul.querySelector('li'); return li ? li.getBoundingClientRect().width + 16 : 300 }
      function estado() { b[0].disabled = ul.scrollLeft < 4; b[1].disabled = ul.scrollLeft + ul.clientWidth >= ul.scrollWidth - 4 }
      b[0].addEventListener('click', function () { ul.scrollBy({ left: -paso(), behavior: reducido ? 'auto' : 'smooth' }) })
      b[1].addEventListener('click', function () { ul.scrollBy({ left: paso(), behavior: reducido ? 'auto' : 'smooth' }) })
      ul.addEventListener('scroll', estado, { passive: true }); addEventListener('resize', estado); estado()
    })
  }

  // ------------------------------------------------ mapa: la lista de paradas ilumina su punto
  function paradas() {
    $$('[data-parada]').forEach(function (li) {
      var p = document.querySelector('.mapa-grande .punto[data-k="' + li.getAttribute('data-parada') + '"]'); if (!p) return
      function on() { p.classList.add('foco') } function off() { p.classList.remove('foco') }
      li.addEventListener('mouseenter', on); li.addEventListener('mouseleave', off); li.addEventListener('focusin', on); li.addEventListener('focusout', off)
    })
  }

  // El botón flotante de WhatsApp se esconde donde ya hay uno propio (configurador, caja lateral, pie) para no tapar nada.
  function waFijo() {
    var b = document.querySelector('.wa-fijo'); if (!b || !('IntersectionObserver' in window)) return
    var zonas = $$('#disena, footer, .lateral .caja'), vistas = new Set()
    if (!zonas.length) return
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) vistas.add(e.target); else vistas.delete(e.target) })
      b.classList.toggle('oculto', vistas.size > 0)
    }, { rootMargin: '0px 0px -60px 0px' })
    zonas.forEach(function (z) { io.observe(z) })
  }
  configurador(); filas(); paradas(); waFijo()
  if (!html.classList.contains('js-anim')) return

  // ------------------------------------------------ animación (GSAP + ScrollTrigger + SplitText + Lenis)
  var CDN = 'https://cdn.jsdelivr.net/npm/', GS = CDN + 'gsap@${GSAP_V}/dist/'
  function cargar(src) { return new Promise(function (ok, mal) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = mal; document.head.appendChild(s) }) }
  Promise.all([cargar(GS + 'gsap.min.js'), cargar(CDN + 'lenis@${LENIS_V}/dist/lenis.min.js')])
    .then(function () { return Promise.all([cargar(GS + 'ScrollTrigger.min.js'), cargar(GS + 'SplitText.min.js')]) })
    .then(iniciar)
    .catch(function () { html.classList.remove('js-anim') })

  function iniciar() {
    window.__famAnim = true
    var gsap = window.gsap, ST = window.ScrollTrigger, Split = window.SplitText
    gsap.registerPlugin(ST, Split)
    var lenis = new window.Lenis({ anchors: { offset: -16 }, stopInertiaOnNavigate: true, allowNestedScroll: true })
    lenis.on('scroll', ST.update)
    gsap.ticker.add(function (t) { lenis.raf(t * 1000) })
    gsap.ticker.lagSmoothing(0)
    var q = function (s) { return gsap.utils.toArray(s) }

    // Hero: la foto se acerca, sigue al ratón y se desplaza con el scroll.
    var hero = document.querySelector('.hero'), foto = document.querySelector('.hero .fondo > *')
    if (foto) {
      gsap.fromTo(foto, { scale: 1.16 }, { scale: 1.05, duration: 2.6, ease: 'expo.out' })
      gsap.to(foto, { yPercent: 14, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
      if (matchMedia('(pointer: fine)').matches) {
        var xTo = gsap.quickTo(foto, 'x', { duration: 1.4, ease: 'power3' }), yTo = gsap.quickTo(foto, 'y', { duration: 1.4, ease: 'power3' })
        hero.addEventListener('pointermove', function (e) {
          var r = hero.getBoundingClientRect()
          xTo(((e.clientX - r.left) / r.width - 0.5) * -34); yTo(((e.clientY - r.top) / r.height - 0.5) * -22)
        })
      }
      gsap.to('.hero .kap', { yPercent: -10, autoAlpha: 0.25, ease: 'none', scrollTrigger: { trigger: hero, start: 'center center', end: 'bottom top', scrub: true } })
    }
    // Titular: letras que suben desde una máscara por palabra (SplitText).
    var h1 = document.querySelector('.hero h1')
    if (h1) Split.create(h1, { type: 'words,chars', wordsClass: 'pal', mask: 'words', autoSplit: true, onSplit: function (self) {
      return gsap.from(self.chars, { yPercent: 118, rotate: 4, duration: 1.25, ease: 'expo.out', stagger: 0.014, delay: 0.15 })
    } })
    var entra = q('.hero .entra')
    gsap.set(entra, { y: 26, autoAlpha: 0 })
    html.classList.add('anim-listo')
    gsap.to(entra, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', stagger: 0.09, delay: 0.6 })
    var cinta = document.querySelector('.cinta')
    if (cinta) gsap.from(cinta, { yPercent: 100, autoAlpha: 0, duration: 1.2, ease: 'expo.out', delay: 0.9 })

    // Gancho rotatorio: una frase cada 2,8 s.
    var g = q('.g-rot > span')
    if (g.length > 1) {
      gsap.set(g.slice(1), { yPercent: 100, autoAlpha: 0 })
      var tl = gsap.timeline({ repeat: -1, delay: 2.4 })
      g.forEach(function (el, i) {
        var sig = g[(i + 1) % g.length]
        tl.to(el, { yPercent: -100, autoAlpha: 0, duration: 0.7, ease: 'power3.in' }, '+=2.1')
          .fromTo(sig, { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', immediateRender: false }, '-=0.25')
      })
    }

    // Titulares de sección: líneas que suben desde una máscara.
    q('.seccion h2, .mapa-s h2, .cfg h2').forEach(function (h) {
      Split.create(h, { type: 'lines', mask: 'lines', autoSplit: true, onSplit: function (self) {
        return gsap.from(self.lines, { yPercent: 105, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: h, start: 'top 88%', once: true } })
      } })
    })

    // Aparición escalonada de tarjetas y bloques.
    function aparecer(sel, extra) {
      var els = q(sel); if (!els.length) return
      gsap.set(els, Object.assign({ y: 40, autoAlpha: 0 }, extra && extra.desde))
      ST.batch(els, { start: 'top 90%', once: true, onEnter: function (b) {
        gsap.to(b, Object.assign({ y: 0, x: 0, rotation: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', stagger: 0.08, overwrite: true }, extra && extra.hasta))
      } })
    }
    aparecer('.servicios > li')
    aparecer('.guias > li', { desde: { y: 30 } })
    aparecer('.fila > li', { desde: { y: 0, x: 80 } })
    aparecer('.siono > div', { desde: { y: 50 } })
    aparecer('.datos > div', { desde: { y: 20 } })
    aparecer('.cfg-caja, .cfg-pase, .cats', { desde: { y: 50 } })
    aparecer('.paradas li', { desde: { y: 0, x: -24 } })
    // Billetes: se reparten sobre la bandeja con un giro leve, y luego cae el sello.
    q('.billete').forEach(function (b, i) {
      gsap.set(b, { y: 70, rotation: i % 2 ? 2.5 : -2.5, autoAlpha: 0 })
      var s = b.querySelector('.sello'); if (s) gsap.set(s, { scale: 1.8, autoAlpha: 0 })
      ST.create({ trigger: b, start: 'top 86%', once: true, onEnter: function () {
        gsap.to(b, { y: 0, rotation: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out' })
        if (s) gsap.to(s, { scale: 1, autoAlpha: 1, rotation: -12, duration: 0.55, ease: 'back.out(2.2)', delay: 0.55 })
      } })
    })

    // Líneas verticales (pasos y día a día): se dibujan con el scroll y cada punto se enciende al pasar.
    function linea(lin, lista, items) {
      var l = document.querySelector(lin); if (!l) return
      gsap.fromTo(l, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: lista, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 } })
      q(items).forEach(function (li) {
        ST.create({ trigger: li, start: 'top 68%', end: 'max', onToggle: function (st) { li.classList.toggle('activo', st.isActive || st.progress === 1) } })
      })
    }
    linea('.p-linea span', '.pasos', '.pasos > li')
    linea('.dias-linea span', '.dias', '.dias > li')
    aparecer('.dias > li', { desde: { y: 0, x: 36 } })

    // Mapas: la ruta se dibuja tramo a tramo (stroke-dashoffset) y cada parada aparece al llegar.
    q('.mapa svg').forEach(function (svg) {
      var segs = svg.querySelectorAll('.seg'), puntos = svg.querySelectorAll('.punto'), grande = svg.classList.contains('mapa-grande')
      gsap.set(segs, { strokeDasharray: 1, strokeDashoffset: 1 })
      gsap.set(svg.querySelectorAll('.punto circle'), { scale: 0, transformOrigin: '50% 50%' })
      gsap.set(svg.querySelectorAll('.punto text'), { autoAlpha: 0 })
      var tl = gsap.timeline({ scrollTrigger: grande
        ? { trigger: svg, start: 'top 80%', end: 'bottom 55%', scrub: 0.8 }
        : { trigger: svg, start: 'top 85%', once: true } })
      Array.prototype.forEach.call(puntos, function (p, i) {
        if (i > 0) tl.to(segs[i - 1], { strokeDashoffset: 0, duration: 1, ease: grande ? 'none' : 'power1.inOut' })
        tl.to(p.querySelectorAll('circle'), { scale: 1, duration: 0.4, ease: 'back.out(3)', stagger: 0.05 }, i > 0 ? '-=0.15' : 0)
          .to(p.querySelector('text'), { autoAlpha: 1, duration: 0.35 }, '<')
      })
      if (!grande) tl.timeScale(Math.max(1, puntos.length / 2.2))
    })

    // Corea: el rótulo de fondo se desliza despacio.
    var k = document.querySelector('.corea .kanji')
    if (k) gsap.fromTo(k, { xPercent: 8 }, { xPercent: -14, ease: 'none', scrollTrigger: { trigger: '.corea', start: 'top bottom', end: 'bottom top', scrub: true } })

    window.addEventListener('load', function () { ST.refresh() })
  }
})()
`
// Script en línea en <head>: decide si hay animación antes de pintar, y si el CDN
// no llega en 4 s devuelve el titular a su sitio.
const HEAD_JS = `<script>(function(){var h=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;h.classList.add('js-anim');setTimeout(function(){if(!window.__famAnim)h.classList.remove('js-anim')},4000)})()</script>`

// ---------------------------------------------------------------- piezas comunes
const NEGOCIO = { '@id': `${BASE}/#negocio`, name: 'Tony Kansai Guide', url: `${BASE}/` }
const IDIOMAS = COORDINADOR.idiomas ?? [['Español', 'es']]
const PERSONA_LD = {
  '@type': 'Person', '@id': `${BASE}${SECCION}#antonio`, name: NOMBRE,
  jobTitle: COORDINADOR.rol ?? 'Coordinador de viajes en Japón',
  ...(RETRATO_URL ? { image: { '@type': 'ImageObject', url: RETRATO_URL, width: RETRATO_W, height: RETRATO_W, caption: ALT_RETRATO } } : {}),
  knowsLanguage: IDIOMAS.map(([name, alternateName]) => ({ '@type': 'Language', name, alternateName })),
  knowsAbout: ['Coordinación de viajes', 'Viajes a Japón en familia', 'Viajes en grupo por Japón', 'Itinerarios a medida por Japón', 'Ryokan', 'Transporte privado en Japón', 'Receptivo en Japón para agencias de viajes'],
  homeLocation: { '@type': 'Country', name: 'Japón' },
  // Mismo @id que el negocio de index.html, para que las IAs unan a Antonio con Tony Kansai Guide.
  worksFor: NEGOCIO, url: url(''),
  description: `Coordinador de viajes profesional que vive en Japón desde hace ${COORDINADOR.anosEnJapon ?? 4} años. Habla español, japonés, inglés y catalán. Ha coordinado familias muy grandes durante muchos días y ha recorrido todo Japón. Organiza viajes a medida para familias y grupos de España, México y Centroamérica, y trabaja como receptivo para agencias. Socio del equipo Tony Kansai Guide.`,
}
const PERSONA_LD_EN = {
  ...PERSONA_LD, jobTitle: 'Professional trip coordinator in Japan',
  ...(PERSONA_LD.image ? { image: { ...PERSONA_LD.image, caption: `${NOMBRE}, trip coordinator in Japan` } } : {}),
  knowsLanguage: PERSONA_LD.knowsLanguage.map((l) => ({ ...l, name: { es: 'Spanish', ja: 'Japanese', en: 'English', ca: 'Catalan' }[l.alternateName] ?? l.name })),
  knowsAbout: ['Trip coordination', 'Family travel in Japan', 'Group travel in Japan', 'Tailor-made Japan itineraries', 'Ryokan', 'Private transport in Japan', 'Ground handling for travel agencies'],
  homeLocation: { '@type': 'Country', name: 'Japan' },
  description: `Professional trip coordinator who has lived in Japan for ${COORDINADOR.anosEnJapon ?? 4} years. Speaks Spanish, Japanese, English and Catalan. Has coordinated very large families over many days and has travelled all over Japan. Plans tailor-made trips for families and groups from Spain, Mexico and Central America and works with travel agencies. Partner in the Tony Kansai Guide team.`,
}
const personaLd = (lang) => (lang === 'en' ? PERSONA_LD_EN : PERSONA_LD)

// Ficha rápida: los datos de Antonio en una lista que una IA puede citar tal cual.
function fichaRapida(lang = 'es') {
  const n = esc(NOMBRE), anos = COORDINADOR.anosEnJapon ?? 4
  const filas = lang === 'en' ? [
    ['Who', `${n}, ${COORDINADOR.edad ? `${COORDINADOR.edad}, ` : ''}a professional trip coordinator and a partner in the Tony Kansai Guide team.`],
    ['In Japan', `He has lived in Japan for ${anos} years and is married to a Japanese woman.`],
    ['Languages', 'Spanish, Japanese (very good), English and Catalan.'],
    ['Experience', 'He has coordinated very large families over many days and has travelled all over Japan.'],
    ['For', 'Families and groups of 6 to 10 from Spain, Mexico and Central America, and travel agencies.'],
    ['Arranges', 'Guides, itinerary, hotels and ryokan, private transport for groups of more than 8.'],
    ['Price', 'Tailor-made, quoted on WhatsApp.'],
    ['Contact', `WhatsApp <a href="${wa(`Hello ${NOMBRE}, we are a family/group of __ people and would like to travel to Japan. Dates: `)}">${WA_VISIBLE}</a>`],
    ['Reviews', `<a href="${ruta(SLUG_OPINIONES)}" hreflang="es">${RESUMEN_OP ? esc(RESUMEN_OP) : 'guest reviews (in Spanish)'}</a>`],
  ] : [
    ['Quién', `${n}, ${COORDINADOR.edad ? `${COORDINADOR.edad} años, ` : ''}coordinador de viajes profesional y socio del equipo Tony Kansai Guide.`],
    ['En Japón', `Vive allí desde hace ${anos} años y está casado con una japonesa.`],
    ['Idiomas', 'Español, japonés (muy bien), inglés y catalán.'],
    ['Experiencia', 'Ha coordinado familias muy grandes durante muchos días y ha recorrido todo Japón.'],
    ['Para quién', 'Familias y grupos de 6 a 10 personas de España, México y Centroamérica, y agencias de viajes.'],
    ['Qué organiza', 'Guías, itinerario, hoteles y ryokan, transporte privado para grupos de más de 8.'],
    ['Presupuesto', 'A medida, por WhatsApp.'],
    ['Contacto', `WhatsApp <a href="${WA_GENERAL}">${WA_VISIBLE}</a>`],
    ['Opiniones', `<a href="${ruta(SLUG_OPINIONES)}">${RESUMEN_OP ? esc(RESUMEN_OP) : 'Opiniones de sus clientes'}</a> · <a href="${ruta(SLUG_FORM)}">Dejar una opinión</a>`],
  ]
  return `<aside class="ficha" aria-labelledby="ficha-rapida">
<div class="ficha-cab">${miniCara('ficha-cara')}<h2 id="ficha-rapida">${lang === 'en' ? `Quick facts: ${n}, trip coordinator in Japan` : `Ficha rápida: ${n}, coordinador de viajes en Japón`}</h2></div>
<dl>${filas.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
</aside>`
}
const SERVICIO_LD = {
  '@type': 'Service', '@id': `${BASE}${SECCION}#servicio`,
  name: 'Viajes a medida a Japón para familias y grupos',
  serviceType: 'Coordinación de viajes y guía en español para familias, grupos y agencias',
  provider: NEGOCIO, broker: { '@id': PERSONA_LD['@id'] }, availableLanguage: ['es'],
  areaServed: { '@type': 'Country', name: 'Japón' },
  audience: [
    { '@type': 'PeopleAudience', audienceType: 'Familias y grupos de 6 a 10 personas de España, México y Centroamérica' },
    { '@type': 'BusinessAudience', audienceType: 'Agencias de viaje' },
  ],
  url: url(''),
}
const faqLd = (faq, lang = 'es') => (faq?.length ? [{ '@type': 'FAQPage', inLanguage: lang, mainEntity: faq.map(({ p, r }) => ({ '@type': 'Question', name: sinEtiquetas(p), acceptedAnswer: { '@type': 'Answer', text: sinEtiquetas(r) } })) }] : [])
const migaLd = (pasos) => ({ '@type': 'BreadcrumbList', itemListElement: pasos.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) })
const migaBase = (lang) => [T[lang].inicio, [T[lang].seccion, url('')]]
const migaHtml = (pasos, lang = 'es') => `<nav class="miga entra" aria-label="${T[lang].ariaMiga}"><ol>${pasos.map(([n, h], i) => (i === pasos.length - 1 ? `<li aria-current="page">${esc(n)}</li>` : `<li><a href="${h.replace(BASE, '')}">${esc(n)}</a></li>`)).join('')}</ol></nav>`
const faqHtml = (faq) => `<div class="faq">${faq.map(({ p, r }) => `<details><summary>${rico(p)}</summary><p>${rico(r)}</p></details>`).join('\n')}</div>`
function tarjeta(d, { sizes = SIZES_REJILLA, lang = 'es', sinCat = false } = {}) {
  const f = foto(d.foto)
  return `<li class="tj"><a href="${d.href}"><figure>${img(d.foto, d.h1, { sizes })}</figure><div class="ki">${d.cat && !sinCat ? `<span class="pill">${esc(catNombre(d.cat, lang))}</span>` : ''}<h3>${esc(d.h1)}</h3><p>${esc(sinEtiquetas(d.desc))}</p></div></a>${f ? creditoBoton(f, lang) : ''}</li>`
}
const tarjetaDe = (p, op) => tarjeta({ href: ruta(p.slug), h1: p.h1, desc: p.descripcion || p.entradilla, foto: p.foto, cat: p.cat }, op)

function pagina({ slug, titulo, desc, image, jsonld, corps, lang = 'es', alternos }) {
  const u = url(slug), t = T[lang]
  const alt = alternos ?? [[lang, u]]
  return `<!doctype html>
<html lang="${lang}" data-estatica="familias">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${u}">
${alt.map(([l, h]) => `<link rel="alternate" hreflang="${l}" href="${h}">`).join('\n')}
<meta name="theme-color" content="#15211c">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Tony Kansai Guide">
<meta property="og:locale" content="${lang === 'en' ? 'en_US' : 'es_ES'}">
<meta property="og:url" content="${u}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${image}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(titulo)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${image}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>
${HEAD_JS}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500&display=swap">
${equipoFuente}
<style>${CSS}${equipoCSS}${menuCSS}${EXPERIENCIAS_CSS}.indice{border-bottom:1px solid var(--linea);padding:12px 0}.indice summary{cursor:pointer;font-weight:600;font-size:18px;display:flex;justify-content:space-between}.indice summary span{opacity:.6;font-size:14px}.indice ul{margin:10px 0 4px;padding-left:18px;columns:2 260px;gap:24px}.indice li{margin:4px 0}.xp{--xp-acento:#2f5d50}${planesCSS}.pl{--pl-acento:#2f5d50}</style>
<link rel="stylesheet" href="/rb/rb.css"><style>:root{--rb-acento:#c9a227;--rb-acento2:#2f5d50}</style>
</head>
<body>
<header class="cab"><div class="kap">
<a class="marca" href="${SECCION}">${miniCara()}<span>${esc(NOMBRE)}<small>${t.sub}</small></span></a>
${navFamilias(lang, t)}
</div></header>
<main>
${corps}
</main>
<footer>${pieFamilias(lang, t)}</footer>
<a class="wa-fijo" href="${lang === 'en' ? wa(`Hello ${NOMBRE}, we are a family/group of __ people and would like to travel to Japan. Dates: `) : WA_GENERAL}">${ICO_WA}<span>${esc(t.escribir)}</span></a>
<script src="${SECCION}familias.js" defer></script>
<script src="/rb/rb.js" defer></script>
</body>
</html>
`
}

// Cabecera y pie (patrón de nawatravel.ae, scripts/menu-estatico.mjs): 3 desplegables
// + botón arriba; abajo columnas cortas con el resto plegado, el equipo y una línea final.
const enlacePag = (p, lang) => ({ t: esc(p.h1), h: ruta(p.slug), hreflang: p.lng !== lang ? p.lng : undefined })
const pagsDe = (cats, lang) => PAGINAS.filter((p) => cats.includes(p.cat)).map((p) => enlacePag(p, lang))
function navFamilias(lang, t) {
  const en = lang === 'en'
  const [cta, ...resto] = t.nav
  const seccion = (h) => (en && h.startsWith(SECCION) ? { hreflang: 'es' } : {})
  return navHTML({ etiqueta: en ? 'Sections' : 'Secciones', abrir: en ? 'Open menu' : 'Abrir menú', variante: 'familias', grupos: [
    { t: en ? 'Destinations' : 'Destinos', enlaces: pagsDe(['destino', 'itinerario'], lang).slice(0, 8) },
    { t: en ? 'Plan' : 'Planificar', enlaces: pagsDe(['practico', 'temporada', 'ocasion'], lang).slice(0, 8) },
    { t: NOMBRE, enlaces: [...resto.map(([n, h]) => ({ t: esc(n), h, ...seccion(h) })), { t: en ? 'Guest reviews (Spanish)' : 'Opiniones de clientes', h: ruta(SLUG_OPINIONES), ...seccion(SECCION) }, { t: en ? 'Our guides' : 'Nuestros guías', h: `#eq-titulo-${lang}` }] },
  ], cta: { t: esc(cta[0]), h: cta[1], cls: 'siempre' } })
}
function pieFamilias(lang, t) {
  const en = lang === 'en'
  const col = (id) => CATS.find((c) => c.id === id)[lang]
  return pieHTML({ variante: 'familias', mas: en ? 'See all' : 'Ver todo',
    intro: `<p>${t.pie}</p>`,
    columnas: [
      { t: `${col('destino')} · ${col('itinerario')}`, enlaces: pagsDe(['destino', 'itinerario'], lang) },
      { t: `${col('temporada')} · ${col('ocasion')}`, enlaces: pagsDe(['temporada', 'ocasion'], lang) },
      { t: col('practico'), enlaces: [{ t: en ? 'Home (Spanish)' : 'Portada', h: SECCION }, { t: en ? 'What is included (Spanish)' : 'Qué incluye y qué no', h: ruta(SLUG_COND) }, { t: en ? 'Guest reviews (Spanish)' : 'Opiniones de clientes', h: ruta(SLUG_OPINIONES) }, ...pagsDe(['practico', 'agencias'], lang)] },
      { t: en ? 'Contact' : 'Contacto', fija: true, html: `<p>WhatsApp: <a href="${WA_GENERAL}">${WA_VISIBLE}</a></p><p><a href="mailto:tony@tonykansaiguide.com">tony@tonykansaiguide.com</a></p><p><a href="${en ? '/en/' : '/es/'}">${t.volverWeb}</a></p><p>${t.otros}: ${en ? '<a href="/es/" hreflang="es">Español</a>' : '<a href="/en/" hreflang="en">English</a>'} · <a href="/ar/" hreflang="ar">العربية</a> · <a href="/fr/" hreflang="fr">Français</a> · <a href="/tr/" hreflang="tr">Türkçe</a> · <a href="/ru/" hreflang="ru">Русский</a></p>` },
    ],
    equipo: equipoHTML({ lang, actual: 'antonio', variante: 'familias' }),
    fin: `<span>© Tony Kansai Guide</span><a href="mailto:tony@tonykansaiguide.com">tony@tonykansaiguide.com</a><span>${t.actualizado}: <time datetime="${HOY}">${HOY}</time></span>`,
  })
}

function hero({ k, alt, corps, sub = false, clase = '', tras = '' }) {
  const f = foto(k)
  return `<section class="hero${sub ? ' sub' : ''} ${clase}">
<div class="fondo">${img(k, alt, { hero: true })}</div>
<div class="kap">${corps}</div>
${tras}
${f ? `<small class="credito">${credito(f)}</small>` : ''}
</section>`
}

// Bloque «Sí gestiona / No gestiona», compartido por la portada y condiciones.
function sionoHtml({ completo }) {
  const si = CONDICIONES.incluye ?? []
  const no = CONDICIONES.noIncluye ?? []
  return `<div class="siono">
<div class="si"><h3>Sí gestiona</h3><ul>${si.map((x) => `<li><span class="ok">${ICO_SI}</span><div><strong>${rico(x.titulo)}</strong>${x.texto ? `<p>${rico(x.texto)}</p>` : ''}</div></li>`).join('')}</ul></div>
<div class="no"><h3>No gestiona</h3><ul>${no.map((x) => `<li><span class="ok">${ICO_NO}</span><div><strong>${rico(x.titulo)}</strong>${x.texto ? `<p>${rico(x.texto)}</p>` : ''}${completo && x.consejo ? `<span class="consejo">${rico(x.consejo)}</span>` : ''}</div></li>`).join('')}</ul></div>
</div>`
}

// ---------------------------------------------------------------- configurador
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
function mesesDesde(hoy) {
  const [y, m] = hoy.split('-').map(Number)
  return Array.from({ length: 12 }, (_, i) => {
    const idx = m + i // mes siguiente a HOY (m es 1..12, idx 0-based desde enero)
    const mm = idx % 12, yy = y + Math.floor(idx / 12)
    return { valor: `${MESES[mm]} de ${yy}`, clave: String(mm), t: MESES[mm][0].toUpperCase() + MESES[mm].slice(1), s: String(yy) }
  })
}
const PASOS_CFG = [
  { campo: 'personas', etiqueta: 'Personas', q: '¿Cuántos son?', ayuda: 'Contando a todos los que viajan, también a los niños.', tipo: 'uno', estilo: 'num',
    ops: ['6', '7', '8', '9', '10'].map((n) => ({ valor: `${n} personas`, clave: n, n, s: 'personas' })).concat([{ valor: 'más de 10 personas', clave: 'mas10', n: 'Más de 10', s: 'personas', txt: true }]) },
  { campo: 'origen', etiqueta: 'Desde', q: '¿De dónde vienen?', ayuda: 'Cambian los vuelos, los horarios de llegada y algún trámite.', tipo: 'uno', estilo: 'lista',
    ops: [{ valor: 'España', clave: 'espana' }, { valor: 'México', clave: 'mexico' }, { valor: 'Centroamérica', clave: 'centroamerica' }, { valor: 'Otro país', clave: 'otro' }] },
  { campo: 'dias', etiqueta: 'Días en Japón', q: '¿Cuántos días tienen en Japón?', ayuda: 'Sin contar los días de vuelo.', tipo: 'uno', estilo: 'dias',
    ops: ['7', '10', '14', '21'].map((n) => ({ valor: `${n} días`, clave: n, n, s: 'días' })) },
  { campo: 'gustos', etiqueta: 'Les gusta', q: '¿Qué les gusta?', ayuda: 'Pueden elegir varias opciones. Se encaja todo en el mismo viaje.', tipo: 'varios', estilo: 'lista',
    ops: [['Templos y cultura', 'templos'], ['Naturaleza y montaña', 'naturaleza'], ['Ryokan y onsen', 'ryokan'], ['Anime y ocio', 'anime'], ['Parques temáticos', 'parques'], ['Gastronomía', 'gastro'], ['Compras', 'compras'], ['Niños pequeños', 'ninos'], ['Abuelos y ritmo suave', 'abuelos']].map(([valor, clave]) => ({ valor, clave })) },
  { campo: 'mes', etiqueta: 'Fechas', q: '¿En qué mes quieren viajar?', ayuda: 'Aproximado. Primavera y otoño se llenan antes: conviene escribir con tiempo.', tipo: 'uno', estilo: 'mes',
    ops: [...mesesDesde(HOY), { valor: 'aún sin fecha', clave: 'nose', t: 'Aún no lo sabemos', ancho: true }] },
]
function botonOp(o, estilo) {
  const attrs = `type="button" aria-pressed="false" data-valor="${esc(o.valor)}" data-clave="${esc(o.clave)}"`
  if (estilo === 'num' || estilo === 'dias') return `<button class="op op-grande" ${attrs}><span class="op-n${o.txt ? ' txt' : ''}">${esc(o.n)}</span><span class="op-s">${esc(o.s)}</span></button>`
  if (estilo === 'mes') return `<button class="op op-mes${o.ancho ? ' ancho' : ''}" ${attrs}><span>${esc(o.t)}</span>${o.s ? `<small>${esc(o.s)}</small>` : ''}</button>`
  return `<button class="op" ${attrs}><span>${esc(o.valor)}</span><span class="op-check">${ICO_SI}</span></button>`
}
function configuradorHtml() {
  const datos = {
    nombre: NOMBRE, wa: WA_NUMERO, base: BASE,
    paginas: PAGINAS.filter((p) => p.lng === 'es').map((p) => {
      const f = foto(p.foto)
      return {
        slug: p.slug, href: ruta(p.slug), h1: sinEtiquetas(p.h1), cat: p.cat, catNombre: catNombre(p.cat), img: f ? f.src(f.pequeno) : '',
        ndias: p.dias?.length ?? 0,
        txt: String(sinEtiquetas([p.slug.replace(/-/g, ' '), p.h1, p.titulo, p.descripcion, p.entradilla, (p.ruta ?? []).join(' '), (p.secciones ?? []).map((s) => s.h2).join(' ')].join(' ')))
          .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      }
    }),
  }
  const pasos = PASOS_CFG.map((p, i) => `<div class="cfg-paso" data-campo="${p.campo}" data-tipo="${p.tipo}" data-etiqueta="${esc(p.etiqueta)}"${i ? ' hidden' : ''}>
<h3 id="cfg-q${i}" tabindex="-1">${esc(p.q)}</h3><p class="cfg-ayuda">${esc(p.ayuda)}</p>
<div class="cfg-op ${p.estilo}" role="group" aria-labelledby="cfg-q${i}">${p.ops.map((o) => botonOp(o, p.estilo)).join('')}</div>
</div>`).join('\n')
  return `<section class="seccion cfg" id="disena" aria-labelledby="t-disena"><div class="kap cfg-c">
<div class="fijo">
<p class="ceja-o">Configurador</p>
<h2 id="t-disena">Diseña el viaje de tu familia</h2>
<p class="lead">Cinco preguntas con un toque cada una. Al final aparece un resumen, las guías que mejor encajan y el mensaje listo para enviar a ${esc(NOMBRE)} por WhatsApp.</p>
<div class="cfg-pase" aria-hidden="true"><header><span>Japón · a medida</span><span>${esc(NOMBRE)}</span></header><dl>
<div><dt>Personas</dt><dd data-pase="personas" data-vacio="?"></dd></div><div><dt>Desde</dt><dd data-pase="origen" data-vacio="?"></dd></div>
<div><dt>Días</dt><dd data-pase="dias" data-vacio="?"></dd></div><div><dt>Fechas</dt><dd data-pase="mes" data-vacio="?"></dd></div>
<div class="ancho"><dt>Les gusta</dt><dd data-pase="gustos" data-vacio="Por elegir"></dd></div></dl></div>
</div>
<div class="cfg-caja">
<div class="cfg-barra" aria-hidden="true"><span></span></div>
<p class="cfg-estado" aria-live="polite">Paso 1 de ${PASOS_CFG.length}</p>
${pasos}
<div class="cfg-final" hidden>
<h3 tabindex="-1">El viaje, resumido</h3>
<dl class="cfg-resumen"></dl>
<h4>Guías que encajan con este viaje</h4>
<ul class="cfg-reco"></ul>
<div class="cfg-envio"><a class="btn xl" data-wa href="${WA_GENERAL}">${ICO_WA}Enviar a ${esc(NOMBRE)} por WhatsApp</a><button type="button" class="btn-sec" data-reinicio>Empezar de nuevo</button></div>
<p class="cfg-nota">El mensaje se abre en WhatsApp ya escrito y se puede revisar antes de enviarlo.</p>
</div>
<div class="cfg-nav"><button type="button" class="btn-sec" data-atras hidden>Atrás</button><button type="button" class="btn" data-sig>Saltar este paso</button></div>
<div class="cfg-sinjs">
<p>Para preparar la propuesta, ${esc(NOMBRE)} necesita saber cuántos son (de 6 a 10 personas, o más), de dónde vienen (España, México, Centroamérica u otro país), cuántos días tienen en Japón (7, 10, 14 o 21), qué les gusta (templos y cultura, naturaleza y montaña, ryokan y onsen, anime y ocio, parques temáticos, gastronomía, compras, niños pequeños, abuelos y ritmo suave) y en qué mes quieren viajar.</p>
<a class="btn xl" href="${WA_GENERAL}">${ICO_WA}Enviar a ${esc(NOMBRE)} por WhatsApp</a>
</div>
</div>
</div>
<script type="application/json" id="cfg-datos">${JSON.stringify(datos).replace(/</g, '\\u003c')}</script>
</section>`
}

// ---------------------------------------------------------------- portada
const generadas = []
const enlacesEn = PAGINAS_EN.map((p) => ['en', url(p.slug)])
{
  const P = PORTADA
  const ganchos = P.gancho ?? []
  const servicios = P.servicios ?? []
  const problemas = P.problemas ?? []
  const pasos = P.pasos ?? []
  // Titular: lo que va tras la primera coma, en cursiva dorada.
  const coma = P.h1.indexOf(',')
  const h1Html = coma > 0 ? `${esc(P.h1.slice(0, coma + 1))} <em>${esc(P.h1.slice(coma + 1).trim())}</em>` : esc(P.h1)
  const destinosCinta = ['Kioto', 'Osaka', 'Tokio', 'Hakone', 'Monte Fuji', 'Takayama', 'Shirakawago', 'Kanazawa', 'Nara', 'Himeji', 'Hiroshima', 'Miyajima']
  const cintaUl = (oculto) => `<ul${oculto ? ' aria-hidden="true"' : ''}>${destinosCinta.map((d) => `<li>${d}</li>`).join('')}</ul>`
  const cinta = `<div class="cinta" role="region" aria-label="Destinos"><div class="cinta-pista">${cintaUl(false)}${cintaUl(true)}</div></div>`
  const paradas = RUTA_CLASICA.map((k, i) => {
    const pag = paginaCiudad(k), n = ETQ_CLASICA[k] ?? CIUDADES[k].n
    const dentro = `<span class="n">${String(i + 1).padStart(2, '0')}</span>${esc(n)}`
    return `<li data-parada="${k}">${pag ? `<a href="${ruta(pag.slug)}">${dentro}</a>` : `<span class="sin">${dentro}</span>`}</li>`
  }).join('')
  const cats = CATS.map((c) => ({ ...c, ps: PAGINAS.filter((p) => p.cat === c.id) })).filter((c) => c.ps.length)
  const corps = `
${hero({ k: 'hero', alt: 'Japón en familia', clase: 'hero-p', corps: `<p class="ceja entra">Japón a medida · 6 a 10 personas</p>
<h1>${h1Html}</h1>
<div class="hero-fila entra"><div><p class="lead">${rico(P.entradilla)}</p>
${ganchos.length ? `<p class="gancho"><span class="g-rot">${ganchos.map((g) => `<span>${esc(g)}</span>`).join(' ')}</span></p>` : ''}</div>
<div class="acciones"><a class="btn claro" href="#disena">Diseñar el viaje ${FLECHA}</a><a class="btn fantasma" href="${WA_GENERAL}">${ICO_WA}Pedir presupuesto</a></div></div>`, tras: cinta })}
<div class="kap"><div class="datos">
<div><strong>Todo Japón</strong><span>Corea del Sur, próximamente</span></div>
<div><strong>6 a 10 personas</strong><span>Familias y grupos, también agencias</span></div>
<div><strong>En español</strong><span>También japonés, inglés y catalán</span></div>
</div>
${fichaRapida('es')}
</div>

<section class="seccion alt" id="servicios" aria-labelledby="t-servicios"><div class="kap">
<h2 id="t-servicios">Qué hace ${esc(NOMBRE)} por su viaje</h2>
<p class="lead">Coordinación y guía en Japón para que el grupo solo tenga que disfrutar.</p>
<ul class="servicios">${servicios.map((s) => `<li><span class="ico-c">${icono(s.icono)}</span><h3>${rico(s.titulo)}</h3><p>${rico(s.texto)}</p></li>`).join('')}</ul>
</div></section>

${planesBloque('es', 'antonio', 'https://tonykansaiguide.com/familias/')}${experienciasHTML('es')}


${configuradorHtml()}

<section class="mapa-s seccion" id="mapa" aria-labelledby="t-mapa"><div class="kap mapa-c">
<div><p class="ceja-o">El mapa</p>
<h2 id="t-mapa">La ruta clásica, de Tokio a Miyajima</h2>
<p class="lead">${RUTA_CLASICA.length} paradas que suelen entrar en un primer viaje por Japón: la capital, el Fuji, los Alpes japoneses, Kioto y Nara, Osaka y la costa de Hiroshima. Cada viaje se adapta al grupo; esta ruta es solo un punto de partida.</p>
<ol class="paradas">${paradas}</ol></div>
<figure class="mapa">${mapaSvg({ claves: RUTA_CLASICA, vb: VB_CENTRO, clase: 'mapa-grande', etiquetas: ETQ_CLASICA, titulo: `Mapa de Japón con la ruta clásica: ${RUTA_CLASICA.map((k) => ETQ_CLASICA[k] ?? CIUDADES[k].n).join(', ')}` })}</figure>
</div></section>

<section class="seccion" id="guias" aria-labelledby="t-guias"><div class="kap">
<h2 id="t-guias">Guías para preparar el viaje</h2>
<p class="lead">${PAGINAS.length} páginas, sin rodeos: elige un tema.</p>
${cats.map((c) => `<details class="indice"><summary>${esc(c.es)} <span>${c.ps.length}</span></summary><ul>${c.ps.map((p) => `<li><a href="${ruta(p.slug)}">${esc(p.h1)}</a></li>`).join('')}</ul></details>`).join('\n')}
</div></section>

<section class="seccion alt" id="gestiona" aria-labelledby="t-gestiona"><div class="kap">
<h2 id="t-gestiona">Lo que sí y lo que no</h2>
<p class="lead">Claro desde el principio, para que no haya sorpresas.</p>
${sionoHtml({ completo: false })}
<p style="margin-top:24px"><a class="enl" href="${ruta(SLUG_COND)}">Ver todas las condiciones ${FLECHA}</a></p>
</div></section>

${pasos.length ? `<section class="seccion" id="como" aria-labelledby="t-como"><div class="kap pasos-c">
<div class="fijo"><h2 id="t-como">Cómo funciona</h2><p class="lead">De la primera conversación al último día en Japón.</p><a class="btn" href="${WA_GENERAL}">${ICO_WA}Pedir presupuesto</a></div>
<ol class="pasos"><span class="p-linea" aria-hidden="true"><span></span></span>${pasos.map((p) => `<li><h3>${rico(p.titulo)}</h3><p>${rico(p.texto)}</p></li>`).join('')}</ol>
</div></section>` : ''}



<section class="seccion alt" id="antonio" aria-labelledby="t-antonio"><div class="kap"><div class="persona">
${retratoGrande()}
<div><h2 id="t-antonio">Quién es ${esc(NOMBRE)}</h2>
${[].concat(COORDINADOR.bio ?? COORDINADOR.texto ?? [`${NOMBRE} es ${(COORDINADOR.rol ?? 'coordinador y guía en Japón').toLowerCase()} y socio de Tony Kansai Guide. Organiza viajes a medida por todo Japón para familias y grupos de España, México y Centroamérica, y trabaja como receptivo para agencias de viaje.`]).map((t) => `<p>${rico(t)}</p>`).join('\n')}
<p><a class="btn" href="${WA_GENERAL}">${ICO_WA}Escribir a ${esc(NOMBRE)}</a></p>
<p><a class="enl" href="${ruta(SLUG_OPINIONES)}">Opiniones de sus clientes ${FLECHA}</a> · <a class="enl" href="/es/">Conocer Tony Kansai Guide ${FLECHA}</a></p></div>
</div></div></section>

${FAQ_GLOBAL.length ? `<section class="seccion" id="preguntas" aria-labelledby="t-faq"><div class="kap">
<h2 id="t-faq">Preguntas frecuentes</h2>
${faqHtml(FAQ_GLOBAL)}
</div></section>` : ''}

<section class="seccion alt cierre"><div class="kap">
<h2>¿Cuántos son y cuándo quieren venir?</h2>
<p class="lead">Cuéntaselo a ${esc(NOMBRE)} por WhatsApp y te prepara una propuesta a medida.</p>
<div class="acciones"><a class="btn" href="${WA_GENERAL}">${ICO_WA}Pedir presupuesto</a><a class="btn-sec" href="#disena" style="text-decoration:none">Diseñar el viaje paso a paso</a></div>
</div></section>`
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    SERVICIO_LD, PERSONA_LD, ...faqLd(FAQ_GLOBAL),
    migaLd(migaBase('es')),
    { '@type': 'WebPage', '@id': `${url('')}#pagina`, url: url(''), inLanguage: 'es', name: P.titulo, description: P.descripcion, dateModified: HOY, about: { '@id': SERVICIO_LD['@id'] }, isPartOf: { '@type': 'WebSite', '@id': `${BASE}/#web`, url: `${BASE}/` }, primaryImageOfPage: imagenOg('hero'), mainEntity: { '@id': `${url('')}#guias` } },
    { '@type': 'ItemList', '@id': `${url('')}#guias`, name: 'Guías de Familias y grupos', numberOfItems: PAGINAS.length + 1,
      itemListElement: [...PAGINAS.map((p) => [p.slug, p.h1]), [SLUG_COND, CONDICIONES.h1]].map(([s, n], i) => ({ '@type': 'ListItem', position: i + 1, url: url(s), name: sinEtiquetas(n) })) },
  ] }
  escribir('', pagina({ slug: '', titulo: P.titulo, desc: P.descripcion, image: imagenOg('hero'), jsonld, corps,
    alternos: [['es', url('')], ...enlacesEn, ['x-default', url('')]] }))
}

// ---------------------------------------------------------------- condiciones
{
  const C = CONDICIONES
  const miga = [...migaBase('es'), [C.h1, url(SLUG_COND)]]
  const corps = `
${hero({ k: 'familia', alt: C.h1, sub: true, corps: `${migaHtml(miga)}
<h1>${esc(C.h1)}</h1>
<p class="lead entra">${rico(C.entradilla)}</p>` })}
<section class="seccion" style="padding-top:clamp(48px,7vw,88px)"><div class="kap">
${sionoHtml({ completo: true })}
${C.avisos?.length ? `<h2 style="margin-top:64px">A tener en cuenta</h2><div class="aviso"><ul>${C.avisos.map((a) => `<li>${rico(a)}</li>`).join('')}</ul></div>` : ''}
${C.vigencia ? `<p class="vigencia">${rico(C.vigencia)}</p>` : ''}
${FUENTES.length ? `<h2 style="margin-top:64px" id="fuentes">Fuentes oficiales</h2>
<p class="lead">Los datos prácticos de estas páginas se comprueban en estas webs oficiales.</p>
<ul class="fuentes">${FUENTES.map((f) => { let dom = ''; try { dom = new URL(f.url).hostname.replace(/^www\./, '') } catch { console.warn(`⚠ familias: URL de fuente rara: ${f.url}`) } return `<li><a href="${esc(f.url)}" rel="nofollow noopener">${rico(f.dato)}</a><time datetime="${esc(f.comprobado)}">Comprobado ${esc(f.comprobado)}</time><span class="dom">${esc(dom)}</span></li>` }).join('')}</ul>` : ''}
<p style="margin-top:40px"><a class="btn" href="${WA_GENERAL}">${ICO_WA}Pedir presupuesto</a></p>
<p><a class="enl" href="${SECCION}">Volver a Familias y grupos ${FLECHA}</a></p>
</div></section>`
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    migaLd(miga),
    { '@type': 'WebPage', url: url(SLUG_COND), inLanguage: 'es', name: C.titulo, description: C.descripcion, dateModified: HOY, about: { '@id': SERVICIO_LD['@id'] }, ...(FUENTES.length ? { citation: FUENTES.map((f) => ({ '@type': 'CreativeWork', name: sinEtiquetas(f.dato), url: f.url })) } : {}) },
    { ...SERVICIO_LD, '@id': SERVICIO_LD['@id'] },
  ] }
  escribir(SLUG_COND, pagina({ slug: SLUG_COND, titulo: C.titulo, desc: C.descripcion, image: imagenOg('familia'), jsonld, corps }))
}

// ---------------------------------------------------------------- páginas
for (const p of PAGINAS) {
  const lang = p.lng, t = T[lang]
  const miga = [...migaBase(lang), [p.h1, url(p.slug)]]
  const secciones = (p.secciones ?? []).map((s, i) => ({ ...s, id: `s${i + 1}` }))
  const dias = (p.dias ?? []).filter((d) => d && (d.titulo || d.texto))
  const claves = ['itinerario', 'destino'].includes(p.cat) ? rutaClaves(p) : []
  const enlace = wa(t.waPag(sinEtiquetas(p.h1)))
  const rel = (p.relacionadas ?? []).map((s) => destino(s, p.slug)).filter(Boolean)
  const indice = [...(dias.length ? [{ id: 'dias', h2: t.diaADia }] : []), ...secciones]
  const mapaFig = claves.length ? `<figure class="ruta-fig"><div class="mapa mini">${mapaSvg({ claves, lang })}</div>
<figcaption><span class="etq" style="margin:0">${t.laRuta}</span><ol class="ruta-ol">${claves.map((k) => `<li>${esc(lang === 'en' ? CIUDADES[k].en ?? CIUDADES[k].n : CIUDADES[k].n)}</li>`).join('')}</ol></figcaption></figure>` : ''
  const diasHtml = dias.length ? `<h2 id="dias">${t.diaADia}</h2>
<ol class="dias"><span class="dias-linea" aria-hidden="true"><span></span></span>${dias.map((d, i) => `<li><span class="dia-n">${esc(d.dia || `${lang === 'en' ? 'Day' : 'Día'} ${i + 1}`)}</span><h3>${rico(d.titulo)}</h3>${d.texto ? `<p>${rico(d.texto)}</p>` : ''}${d.lugar ? `<span class="dia-lugar">${icono('pin', '')}${esc(d.lugar)}</span>` : ''}</li>`).join('')}</ol>` : ''
  const corps = `
${hero({ k: p.foto, alt: p.h1, sub: true, corps: `${migaHtml(miga, lang)}
<p class="ceja entra">${esc(catNombre(p.cat, lang))}</p>
<h1>${esc(p.h1)}</h1>` })}
<div class="kap articulo">
<article class="cuerpo">
<p class="entr">${rico(p.entradilla)}</p>
${p.ficha ? fichaRapida(lang) : ''}
${mapaFig}
${diasHtml}
${secciones.map((s) => `<h2 id="${s.id}">${rico(s.h2)}</h2>
${(s.parrafos ?? []).map((x) => `<p>${rico(x)}</p>`).join('\n')}
${s.lista?.length ? `<ul class="lista">${s.lista.map((x) => `<li>${rico(x)}</li>`).join('')}</ul>` : ''}`).join('\n')}
${p.faq?.length ? `<h2 id="preguntas">${t.faq}</h2>${faqHtml(p.faq)}` : ''}
</article>
<aside class="lateral">
<div class="caja"><h3>${esc(t.cajaT)}</h3><p>${esc(t.cajaP)}</p><a class="btn" href="${enlace}">${ICO_WA}${esc(t.presupuesto)}</a><p style="margin:14px 0 0"><a href="${SECCION}#disena"${lang === 'en' ? ' hreflang="es"' : ''}>${esc(t.disenar)}</a><br><a href="${ruta(SLUG_COND)}"${lang === 'en' ? ' hreflang="es"' : ''}>${esc(t.incluye)}</a></p></div>
${indice.length > 1 ? `<nav class="caja indice" aria-label="${esc(t.indice)}"><h3>${esc(t.indice)}</h3><ol>${indice.map((s) => `<li><a href="#${s.id}">${esc(sinEtiquetas(s.h2))}</a></li>`).join('')}</ol></nav>` : ''}
</aside>
</div>
${rel.length ? `<section class="seccion alt" aria-labelledby="t-rel"><div class="kap">
<h2 id="t-rel">${t.sigue}</h2>
<ul class="guias">${rel.map((d) => tarjeta(d, { lang })).join('\n')}</ul>
<p style="margin-top:32px"><a class="enl" href="${SECCION}">${t.volver} ${FLECHA}</a></p>
</div></section>` : ''}`
  // Itinerarios: TouristTrip con la lista de lugares (sin precios ni offers).
  const lugares = claves.length ? claves.map((k) => CIUDADES[k].n) : [...new Set(dias.map((d) => d.lugar).filter(Boolean))]
  const viaje = p.cat === 'itinerario' && lugares.length ? [{
    '@type': 'TouristTrip', name: sinEtiquetas(p.h1), description: p.descripcion, url: url(p.slug), inLanguage: lang,
    touristType: lang === 'en' ? ['Families', 'Groups of 6 to 10 people'] : ['Familias', 'Grupos de 6 a 10 personas'],
    provider: NEGOCIO,
    itinerary: { '@type': 'ItemList', numberOfItems: lugares.length, itemListElement: lugares.map((n, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'Place', name: n } })) },
  }] : []
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    migaLd(miga), ...faqLd(p.faq, lang), ...viaje,
    { '@type': 'WebPage', url: url(p.slug), inLanguage: lang, name: p.titulo, description: p.descripcion, dateModified: HOY, about: { '@id': SERVICIO_LD['@id'] }, primaryImageOfPage: imagenOg(p.foto), author: { '@id': PERSONA_LD['@id'] }, publisher: NEGOCIO },
    personaLd(lang),
  ] }
  escribir(p.slug, pagina({ slug: p.slug, titulo: p.titulo, desc: p.descripcion, image: imagenOg(p.foto), jsonld, corps, lang,
    alternos: lang === 'en' ? [['en', url(p.slug)], ['es', url('')], ['x-default', url('')]] : undefined }))
}

// ---------------------------------------------------------------- opiniones de clientes
// Página indexable con cada opinión en el HTML; el formulario es /familias/opiniones/
// (scripts/formularios-guias.mjs, noindex). El cron diario de deploy las mete en el HTML.
{
  const miga = [...migaBase('es'), ['Opiniones de clientes', url(SLUG_OPINIONES)]]
  const tarjetaOp = (y) => `<li data-id="${esc(y.id)}"><p class="estrellas" aria-label="${y.stars}/5">${'★'.repeat(y.stars)}${'☆'.repeat(5 - y.stars)}</p><p>${esc(y.text)}</p><p class="autor">${esc(y.name)}${y.country ? ` · ${esc(y.country)}` : ''}${y.tour ? ` · ${esc(y.tour)}` : ''}${y.date ? ` · ${esc(y.date)}` : ''}</p></li>`
  const script = `<script>
fetch('/api/resenas/publicas?guia=antonio',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(d=>{
  const ul=document.getElementById('opLista'); if(!d||!ul) return
  const e=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c])
  for(const y of d.reviews||[]){ if(!y.id||!y.text||!y.stars||ul.querySelector('[data-id="'+CSS.escape(y.id)+'"]')) continue
    ul.insertAdjacentHTML('afterbegin','<li data-id="'+e(y.id)+'"><p class="estrellas">'+'★'.repeat(y.stars)+'☆'.repeat(5-y.stars)+'</p><p>'+e(y.text)+'</p><p class="autor">'+e(y.name)+(y.country?' · '+e(y.country):'')+(y.tour?' · '+e(y.tour):'')+'</p></li>')
    document.getElementById('opVacio').hidden=true }
}).catch(()=>{})
</script>`
  const corps = `
${hero({ k: 'familia', alt: 'Opiniones de clientes de Antonio', sub: true, corps: `${migaHtml(miga)}
<h1>Opiniones de clientes sobre ${esc(NOMBRE)}, coordinador de viajes en Japón</h1>
<p class="lead entra">${RESUMEN_OP ? `${esc(RESUMEN_OP)}.` : 'Lo que cuentan las familias y los grupos que han viajado por Japón con Antonio.'}</p>` })}
<section class="seccion" style="padding-top:clamp(48px,7vw,88px)"><div class="kap">
<p class="lead" style="color:var(--tinta)">${RESUMEN_OP ? `${esc(NOMBRE)}, coordinador de viajes en Japón del equipo Tony Kansai Guide, tiene ${esc(RESUMEN_OP.replace(', media', ', con una media de'))}. Cada opinión la ha dejado un viajero en el formulario de /familias/opiniones/ y se publica tal cual, sin retoques.` : `Todavía no hay opiniones publicadas. Las dejan los propios viajeros en el formulario de /familias/opiniones/ y se publican tal cual, sin retoques; irán apareciendo aquí.`}</p>
<ul class="opiniones" id="opLista">${OPINIONES.map(tarjetaOp).join('')}</ul>
<script src="/resena-foto.js" data-guia="antonio" data-lista="opLista" defer></script>
<p class="op-vacio" id="opVacio"${OPINIONES.length ? ' hidden' : ''}>¿Has viajado por Japón con ${esc(NOMBRE)}? Tu opinión ayuda a otras familias a decidirse.</p>
<p><a class="btn" href="${ruta(SLUG_FORM)}">Dejar una opinión</a></p>
${script}
${fichaRapida('es')}
<p style="margin-top:32px"><a class="btn" href="${wa(`Hola ${NOMBRE}, he leído las opiniones de tu página. Somos una familia/grupo de __ personas y queremos viajar a Japón. Fechas: `)}">${ICO_WA}Escribir a ${esc(NOMBRE)}</a></p>
<p><a class="enl" href="${SECCION}">Volver a Familias y grupos ${FLECHA}</a></p>
</div></section>`
  const negocioLd = { '@type': 'LocalBusiness', ...NEGOCIO, address: { '@type': 'PostalAddress', addressLocality: 'Osaka', addressRegion: 'Osaka', addressCountry: 'JP' } }
  const reviewsLd = OPINIONES.map((y) => ({ '@type': 'Review', reviewRating: { '@type': 'Rating', ratingValue: y.stars, bestRating: 5 }, author: { '@type': 'Person', name: y.name }, reviewBody: y.text, inLanguage: y.lang || 'es', itemReviewed: negocioLd }))
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    PERSONA_LD, ...reviewsLd, migaLd(miga),
    { '@type': 'WebPage', url: url(SLUG_OPINIONES), inLanguage: 'es', name: `Opiniones de clientes sobre ${NOMBRE}`, dateModified: HOY, about: { '@id': PERSONA_LD['@id'] } },
  ] }
  escribir(SLUG_OPINIONES, pagina({ slug: SLUG_OPINIONES, image: RETRATO_URL ?? imagenOg('familia'), jsonld, corps,
    titulo: `Opiniones de clientes sobre ${NOMBRE}, coordinador de viajes en Japón | Tony Kansai Guide`,
    desc: RESUMEN_OP ? `${NOMBRE}, coordinador de viajes en Japón para familias y grupos: ${RESUMEN_OP}. Leer las opiniones, dejar la tuya y escribirle por WhatsApp.` : `Opiniones de las familias y grupos que viajan por Japón con ${NOMBRE}, coordinador de viajes del equipo Tony Kansai Guide. Deja la tuya o escríbele por WhatsApp.` }))
}

// ---------------------------------------------------------------- salida y comprobación
function escribir(slug, html) {
  const dir = join(root, 'public/familias', slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
  generadas.push([slug, html])
}
writeFileSync(join(root, 'public/familias/familias.js'), JS)

// Cada página: un title, un h1, canonical, JSON-LD que parsea, nada de hebreo,
// nada de rayas largas en el texto y nada de «vosotros».
const fallos = []
for (const [slug, html] of generadas) {
  const quien = ruta(slug)
  if ((html.match(/<h1[\s>]/g) ?? []).length !== 1) fallos.push(`${quien}: no tiene exactamente un h1`)
  if (!/<title>[^<]+<\/title>/.test(html)) fallos.push(`${quien}: sin title`)
  if (!html.includes(`<link rel="canonical" href="${url(slug)}">`)) fallos.push(`${quien}: canonical mal`)
  for (const m of html.matchAll(/<script type="application\/(?:ld\+)?json"[^>]*>([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]) } catch (e) { fallos.push(`${quien}: JSON no parsea (${e.message})`) } }
  if (/[\u0590-\u05FF]/.test(html)) fallos.push(`${quien}: contiene hebreo`)
  if (html.includes('\u2014')) fallos.push(`${quien}: contiene una raya larga (\u2014)`)
  const visible = html.replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ')
  const vos = visible.match(/\b(vosotros|vosotras|vuestr[oa]s?|tenéis|podéis|queréis|sabéis|habéis|estáis|venís|vais)\b/i)
  if (vos) fallos.push(`${quien}: usa «${vos[0]}» (español neutro, sin vosotros)`)
}
if (fallos.length) { console.error(fallos.join('\n')); process.exit(1) }
const porCat = CATS.map((c) => `${c.id} ${PAGINAS.filter((p) => p.cat === c.id).length}`).join(', ')
console.log(`familias: ${generadas.length} páginas en public/familias/ (1 portada + 1 condiciones + ${PAGINAS.length} guías: ${porCat}; ${PAGINAS_EN.length} en inglés; ${FUENTES.length} fuentes)`)
