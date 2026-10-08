// node scripts/rutas-estaticas.mjs <carpeta-de-despliegue>
//
// GitHub Pages responde 404 a una ruta que no es un fichero real, y Google no
// indexa un 404. Por eso cada ruta del sitemap recibe su propio index.html.
// Además, cada uno lleva SU cabecera (título, descripción, foto para compartir,
// canonical e idiomas hermanos) sacada de src/seo/cabeceras.ts: así Google y
// las vistas previas de WhatsApp ven Osaka en /es/osaka/ y no la portada.
// Las rutas antiguas sin cabecera propia conservan el arreglo de antes
// (canonical propio y fuera los hreflang de la portada).

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createServer } from 'vite'

const BASE = 'https://tonykansaiguide.com'
const dest = process.argv[2]
if (!dest || !existsSync(join(dest, 'index.html'))) {
  console.error('Uso: node scripts/rutas-estaticas.mjs <carpeta con index.html y sitemap.xml>')
  process.exit(1)
}

// Los datos están en TypeScript: Vite los carga sin compilar nada aparte.
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
let cabeceras
try {
  cabeceras = (await vite.ssrLoadModule('/src/seo/cabeceras.ts')).cabeceras()
} finally {
  await vite.close()
}

// Foto de portada que conviene precargar (si no, no se pide hasta que arranca React).
const PRECARGA = { es: '/v7/fotos/kioto', en: '/v7/fotos/nara', ar: '/v7/fotos/osaka', ru: '/v7/fotos/miyajima', larion: '/v7/fotos/miyajima' }
const ZONA_PORTADA = { osaka: 'osaka-castillo', kyoto: 'kioto-fushimi', nara: 'nara-parque', kobe: 'kobe-mezquita', himeji: 'himeji-castillo', hiroshima: 'hiroshima-cupula', beyond: 'lejos-koyasan' }

// Primera pantalla ya pintada: se compila el render de servidor y cada página
// de guía, de ciudad y del día sale con su HTML dentro de #root (main.tsx la
// hidrata). Montaña y legales no: traducen con el diccionario, que aquí no hay.
import { execSync } from 'node:child_process'
execSync('npx vite build --ssr scripts/ssr-entrada.tsx --outDir .ssr --emptyOutDir --logLevel error', { stdio: 'inherit' })
const { pinta } = await import(new URL('../.ssr/ssr-entrada.js', import.meta.url).href)
const PRERENDER = /^(es|en|ar|ru|larion)(\/(osaka|kyoto|nara|kobe|himeji|hiroshima|beyond|rutas|routes|montana|hiking|otono-kioto|kyoto-autumn|desde-mexico|from-uk|desde-espana|from-gulf|from-usa|desde-argentina|osaka-kioto|osaka-to-kyoto|aeropuerto-kansai|kansai-airport))?$/

// Nombres con hash de los trozos de página, sacados del build.
import { readdirSync } from 'node:fs'
const trozosJs = readdirSync(join(dest, 'assets')).filter((f) => f.endsWith('.js'))
const CSS_TROZOS = readdirSync(join(dest, 'assets')).filter((f) => f.endsWith('.css') && !f.startsWith('index-'))
const TROZOS = { guia: trozosJs.find((f) => f.startsWith('PaginaGuia-')), ciudad: trozosJs.find((f) => f.startsWith('CiudadPagina-')) }

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const base = readFileSync(join(dest, 'index.html'), 'utf8')
const rutas = [...readFileSync(join(dest, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]*)<\/loc>/g)]
  .map((m) => m[1].replace(BASE, '').replace(/^\/+|\/+$/g, ''))
  .filter(Boolean)

// Web antigua: fuera del sitemap, pero sigue respondiendo (enlaces viejos y lo
// que Google ya tenía). La app redirige a la página nueva en el idioma del
// visitante; para Google, noindex y canonical a la equivalente en inglés.
const REGIONES = JSON.parse(readFileSync(new URL('../src/seo/regiones.json', import.meta.url), 'utf8'))
const ANTIGUAS = JSON.parse(readFileSync(new URL('./rutas-antiguas.json', import.meta.url), 'utf8'))
for (const [ruta, nueva] of Object.entries(ANTIGUAS)) {
  const html = base
    .replace(/^\s*<link rel="alternate" hreflang=.*\n/gm, '')
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${BASE}${nueva}$2`)
    .replace(/<meta name="robots" content="[^"]*"\s*\/?>/, '<meta name="robots" content="noindex, follow" />')
  mkdirSync(join(dest, ruta), { recursive: true })
  writeFileSync(join(dest, ruta, 'index.html'), html)
}

let propias = 0
let pintadas = 0
for (const ruta of rutas) {
  // Las que ya son un fichero real (resenas.html, booking.html…) responden 200 solas.
  if (existsSync(join(dest, ruta))) continue
  const url = `${BASE}/${ruta}/`
  let html = base
    .replace(/^\s*<link rel="alternate" hreflang=.*\n/gm, '')
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)

  const c = cabeceras[ruta]
  if (c) {
    propias++
    const img = `${BASE}${c.imagen}`
    html = html
      .replace(/<html lang="[^"]*"[^>]*>/, `<html lang="${c.lang}" dir="${c.dir}">`)
      .replace(/<title>[^<]*<\/title>/, `<title>${esc(c.titulo)}</title>`)
      .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(c.descripcion)}$2`)
      .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(c.titulo)}$2`)
      .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(c.descripcion)}$2`)
      .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${img}$2`)
      .replace(/(<meta property="og:image:alt" content=")[^"]*(")/, `$1${esc(c.titulo)}$2`)
      .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(c.titulo)}$2`)
      .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(c.descripcion)}$2`)
      .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${img}$2`)
    // Cada idioma, más sus países (regiones.json). La página de Larion en inglés
    // no lleva países: los de inglés ya son de la de Tony.
    const alternos = c.alternos.flatMap(([l, r]) => [l, ...(r.startsWith('/larion') ? [] : (REGIONES[l] ?? []))].map((x) => `    <link rel="alternate" hreflang="${x}" href="${BASE}${r}" />`)).join('\n')
    html = html.replace('</head>', `${alternos}\n    <link rel="alternate" hreflang="x-default" href="${BASE}/" />\n  </head>`)
  }

  // Precarga del trozo de JS de la página (si no, se pide cuando ya ha
  // arrancado el principal) y, en las páginas de guía, de su figura manga,
  // (la figura manga ya no está en la portada).
  const esGuia = ruta in PRECARGA
  const esCiudad = /^(es|en|ar|ru|larion)\/[a-z]+$/.test(ruta) && ruta.split('/')[1] in ZONA_PORTADA
  const trozo = esGuia ? TROZOS.guia : esCiudad ? TROZOS.ciudad : null
  if (trozo) html = html.replace('</head>', `  <link rel="modulepreload" crossorigin href="/assets/${trozo}" />\n  </head>`)

  // Precarga de la foto de portada en las páginas de idioma y de ciudad.
  const ciudad = ruta.split('/')[1]
  const foto = PRECARGA[ruta] ?? (ZONA_PORTADA[ciudad] && `/v8/zonas/${ZONA_PORTADA[ciudad]}`)
  // imagesizes igual que el sizes del <img>: si no, en escritorio se precarga la
  // de 1800 px y luego se pinta la de 900 (dos descargas).
  if (foto) {
    html = html.replace('</head>', `  <link rel="preload" as="image" href="${foto}.webp" imagesrcset="${foto}-900.webp 900w, ${foto}.webp 1800w" imagesizes="${PRECARGA[ruta] ? '(max-width: 900px) 100vw, 50vw' : '100vw'}" fetchpriority="high" />\n  </head>`)
  }

  if (PRERENDER.test(ruta)) {
    // El CSS de los trozos perezosos (ciudades, manga, figuras) se enlaza ya en
    // la cabecera: si no, el HTML pintado se ve un instante sin esos estilos y
    // luego todo salta (CLS de 0,4 a 1,1 en Lighthouse).
    html = html.replace('</head>', CSS_TROZOS.map((f) => `  <link rel="stylesheet" href="/assets/${f}" />`).join('\n') + '\n  </head>')
    const idioma = ruta.split('/')[0] === 'larion' ? 'en' : ruta.split('/')[0]
    const ficheroDic = new URL(`../public/i18n/${idioma}.json`, import.meta.url)
    const frases = idioma !== 'en' && existsSync(ficheroDic) ? JSON.parse(readFileSync(ficheroDic, 'utf8')) : undefined
    const { html: cuerpo, ld } = await pinta(`/${ruta}/`, idioma, frases)
    html = html.replace('<div id="root"></div>', `<div id="root">${cuerpo}</div>`)
    if (ld) html = html.replace('</head>', `  ${ld}\n  </head>`)
    pintadas++
  }

  mkdirSync(join(dest, ruta), { recursive: true })
  writeFileSync(join(dest, ruta, 'index.html'), html)
}
console.log(`${rutas.length} rutas; ${propias} con cabecera propia; ${pintadas} ya pintadas; ${Object.keys(ANTIGUAS).length} antiguas con noindex`)
