#!/usr/bin/env node
// Genera public/sitemap.xml desde src/lib/data.ts.
//
//   npm run sitemap
//
// Antes había que acordarse de añadir a mano cada tour y cada ruta nueva. El
// despliegue crea una carpeta indexable por cada <loc> del sitemap, así que
// una ruta que faltara aquí devolvía 404 en Google aunque existiera en la web.
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://tonykansaiguide.com'
const REGIONES = JSON.parse(readFileSync(join(root, 'src/seo/regiones.json'), 'utf8'))
const LANGS = ['en', 'es', 'ar', 'ru']

const data = readFileSync(join(root, 'src/lib/data.ts'), 'utf8')

/** Los ids de un bloque `export const X = [ … ]` de data.ts. */
function ids(constName) {
  const bloque = data.split(`export const ${constName} = [`)[1].split('\nexport const')[0]
  return [...bloque.matchAll(/^\s{4}id: '([^']+)'/gm)].map((m) => m[1])
}

const tours = ids('TOURS')
const rutas = ids('HIKING_ROUTES')

const paginas = [
  { loc: '/', priority: '1.0', changefreq: 'weekly', v7: true },
  // Web v7: una página por idioma y guía. Se declaran entre sí con hreflang
  // (Tony: es/en/ar; Larion: ru/en), no con ?lang=.
  { loc: '/es', priority: '1.0', changefreq: 'weekly', v7: 'tony' },
  { loc: '/en', priority: '1.0', changefreq: 'weekly', v7: 'tony' },
  { loc: '/ar', priority: '1.0', changefreq: 'weekly', v7: 'tony' },
  { loc: '/ru', priority: '1.0', changefreq: 'weekly', v7: 'larion' },
  { loc: '/larion', priority: '0.9', changefreq: 'weekly', v7: 'larion' },
  { loc: '/es/montana', priority: '0.9', changefreq: 'monthly', v7: 'montana' },
  { loc: '/en/hiking', priority: '0.9', changefreq: 'monthly', v7: 'montana' },
  { loc: '/ar/hiking', priority: '0.9', changefreq: 'monthly', v7: 'montana' },
  { loc: '/ru/hiking', priority: '0.9', changefreq: 'monthly', v7: 'montana' },
  // Páginas de ciudad (v8).
  ...['osaka', 'kyoto', 'nara', 'kobe', 'himeji', 'hiroshima', 'beyond'].flatMap((c) => ['es', 'en', 'ar'].map((l) => ({ loc: `/${l}/${c}`, priority: '0.9', changefreq: 'monthly', v7: `ciudadTony:${c}` }))),
  ...['hiroshima', 'kyoto', 'nara', 'osaka', 'himeji'].flatMap((c) => ['ru', 'larion'].map((l) => ({ loc: `/${l}/${c}`, priority: '0.85', changefreq: 'monthly', v7: `ciudadLarion:${c}` }))),
  { loc: '/es/desde-mexico', priority: '0.8', changefreq: 'monthly', v7: 'mexico' },
  { loc: '/en/from-uk', priority: '0.8', changefreq: 'monthly', v7: 'uk' },
  { loc: '/es/desde-espana', priority: '0.8', changefreq: 'monthly', v7: 'espana' },
  { loc: '/ar/from-gulf', priority: '0.8', changefreq: 'monthly', v7: 'golfo' },
  { loc: '/en/from-usa', priority: '0.8', changefreq: 'monthly', v7: 'usa' },
  { loc: '/es/desde-argentina', priority: '0.8', changefreq: 'monthly', v7: 'argentina' },
  { loc: '/ru/from-russia', priority: '0.8', changefreq: 'monthly', v7: 'rusia' },
  // Guías prácticas.
  { loc: '/es/osaka-kioto', priority: '0.8', changefreq: 'monthly', v7: 'osakaKioto' },
  { loc: '/en/osaka-to-kyoto', priority: '0.8', changefreq: 'monthly', v7: 'osakaKioto' },
  { loc: '/es/aeropuerto-kansai', priority: '0.8', changefreq: 'monthly', v7: 'aeropuerto' },
  { loc: '/en/kansai-airport', priority: '0.8', changefreq: 'monthly', v7: 'aeropuerto' },
  // Temporada: otoño de Kioto.
  { loc: '/es/otono-kioto', priority: '0.9', changefreq: 'weekly', v7: 'otono' },
  { loc: '/en/kyoto-autumn', priority: '0.9', changefreq: 'weekly', v7: 'otono' },
  { loc: '/ar/kyoto-autumn', priority: '0.9', changefreq: 'weekly', v7: 'otono' },
  { loc: '/ru/kyoto-autumn', priority: '0.9', changefreq: 'weekly', v7: 'otono' },
  { loc: '/es/sakura-kioto', priority: '0.9', changefreq: 'weekly', v7: 'sakura' },
  { loc: '/en/kyoto-cherry-blossom', priority: '0.9', changefreq: 'weekly', v7: 'sakura' },
  { loc: '/ar/kyoto-cherry-blossom', priority: '0.9', changefreq: 'weekly', v7: 'sakura' },
  { loc: '/ru/kyoto-sakura', priority: '0.9', changefreq: 'weekly', v7: 'sakura' },
  { loc: '/es/rutas', priority: '0.9', changefreq: 'monthly', v7: 'rutasTony' },
  { loc: '/en/routes', priority: '0.9', changefreq: 'monthly', v7: 'rutasTony' },
  { loc: '/ar/routes', priority: '0.9', changefreq: 'monthly', v7: 'rutasTony' },
  { loc: '/ru/routes', priority: '0.9', changefreq: 'monthly', v7: 'rutasLarion' },
  { loc: '/larion/routes', priority: '0.8', changefreq: 'monthly', v7: 'rutasLarion' },
  // La web antigua (/tours, /hiking, /pricing…) ya no va aquí: redirige a la
  // nueva y sus páginas llevan noindex + canonical (rutas-estaticas.mjs).
  { loc: '/booking', priority: '0.9', changefreq: 'weekly' },
  { loc: '/resenas.html', priority: '0.7', changefreq: 'weekly' },
  { loc: '/terms', priority: '0.4', changefreq: 'yearly' },
  { loc: '/privacy', priority: '0.4', changefreq: 'yearly' },
  { loc: '/cookies', priority: '0.3', changefreq: 'yearly' },
  { loc: '/safety', priority: '0.6', changefreq: 'monthly' },
  { loc: '/legal', priority: '0.3', changefreq: 'yearly' },
  { loc: '/accessibility', priority: '0.3', changefreq: 'yearly' },
]

const V7 = {
  tony: [['es', '/es/'], ['en', '/en/'], ['ar', '/ar/']],
  larion: [['ru', '/ru/'], ['en', '/larion/']],
  portada: [['es', '/es/'], ['en', '/en/'], ['ar', '/ar/'], ['ru', '/ru/']],
  montana: [['es', '/es/montana/'], ['en', '/en/hiking/'], ['ar', '/ar/hiking/'], ['ru', '/ru/hiking/']],
  rutasTony: [['es', '/es/rutas/'], ['en', '/en/routes/'], ['ar', '/ar/routes/']],
  rutasLarion: [['ru', '/ru/routes/'], ['en', '/larion/routes/']],
  otono: [['es', '/es/otono-kioto/'], ['en', '/en/kyoto-autumn/'], ['ar', '/ar/kyoto-autumn/'], ['ru', '/ru/kyoto-autumn/']],
  sakura: [['es', '/es/sakura-kioto/'], ['en', '/en/kyoto-cherry-blossom/'], ['ar', '/ar/kyoto-cherry-blossom/'], ['ru', '/ru/kyoto-sakura/']],
  mexico: [['es', '/es/desde-mexico/']],
  uk: [['en', '/en/from-uk/']],
  espana: [['es', '/es/desde-espana/']],
  golfo: [['ar', '/ar/from-gulf/']],
  usa: [['en', '/en/from-usa/']],
  argentina: [['es', '/es/desde-argentina/']],
  rusia: [['ru', '/ru/from-russia/']],
  osakaKioto: [['es', '/es/osaka-kioto/'], ['en', '/en/osaka-to-kyoto/']],
  aeropuerto: [['es', '/es/aeropuerto-kansai/'], ['en', '/en/kansai-airport/']],
}

const url = ({ loc, priority, changefreq, v7 }) => {
  // GitHub Pages sirve cada ruta como carpeta: sin barra final responde 301 y
  // Search Console no indexa URLs que redirigen. /booking es un .html real.
  const conBarra = loc === '/' || loc === '/booking' || loc.endsWith('.html') ? loc : `${loc}/`
  const abs = `${BASE}${conBarra}`
  // Las páginas .html llevan su propio selector de idioma dentro; el resto
  // usan ?lang= y se declaran con hreflang para que Google indexe cada versión.
  if (v7) {
    const [tipo, ciudad] = String(v7).split(':')
    const grupo = tipo === 'ciudadTony' ? [['es', `/es/${ciudad}/`], ['en', `/en/${ciudad}/`], ['ar', `/ar/${ciudad}/`]]
      : tipo === 'ciudadLarion' ? [['ru', `/ru/${ciudad}/`], ['en', `/larion/${ciudad}/`]]
      : V7[v7 === true ? 'portada' : v7]
    const alt = grupo.flatMap(([l, r]) => [l, ...(r.startsWith('/larion') ? [] : (REGIONES[l] ?? []))].map((x) => `\n    <xhtml:link rel="alternate" hreflang="${x}" href="${BASE}${r}"/>`)).join('')
      + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}/"/>`
    return `  <url>\n    <loc>${abs}</loc>${alt}\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
  }
  const alternates = loc.endsWith('.html') ? '' : LANGS.map((l) =>
    `\n    <xhtml:link rel="alternate" hreflang="${l}" href="${abs}${l === 'en' ? '' : `?lang=${l}`}"/>`
  ).join('') + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${abs}"/>`
  return `  <url>\n    <loc>${abs}</loc>${alternates}\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paginas.map(url).join('\n')}
</urlset>
`

writeFileSync(join(root, 'public/sitemap.xml'), xml)
console.log(`sitemap.xml: ${paginas.length} URLs (${tours.length} tours, ${rutas.length} rutas)`)
