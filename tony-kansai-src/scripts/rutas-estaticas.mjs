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

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const base = readFileSync(join(dest, 'index.html'), 'utf8')
const rutas = [...readFileSync(join(dest, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]*)<\/loc>/g)]
  .map((m) => m[1].replace(BASE, '').replace(/^\/+|\/+$/g, ''))
  .filter(Boolean)

let propias = 0
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
    const alternos = c.alternos.map(([l, r]) => `    <link rel="alternate" hreflang="${l}" href="${BASE}${r}" />`).join('\n')
    html = html.replace('</head>', `${alternos}\n    <link rel="alternate" hreflang="x-default" href="${BASE}/" />\n  </head>`)
  }

  // Precarga de la foto de portada en las páginas de idioma y de ciudad.
  const ciudad = ruta.split('/')[1]
  const foto = PRECARGA[ruta] ?? (ZONA_PORTADA[ciudad] && `/v8/zonas/${ZONA_PORTADA[ciudad]}`)
  if (foto) {
    html = html.replace('</head>', `  <link rel="preload" as="image" href="${foto}.webp" imagesrcset="${foto}-900.webp 900w, ${foto}.webp 1800w" imagesizes="100vw" fetchpriority="high" />\n  </head>`)
  }

  mkdirSync(join(dest, ruta), { recursive: true })
  writeFileSync(join(dest, ruta, 'index.html'), html)
}
console.log(`${rutas.length} rutas; ${propias} con cabecera propia`)
