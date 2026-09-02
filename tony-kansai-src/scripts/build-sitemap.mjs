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
const LANGS = ['en', 'es', 'ar', 'cs', 'ru']

const data = readFileSync(join(root, 'src/lib/data.ts'), 'utf8')

/** Los ids de un bloque `export const X = [ … ]` de data.ts. */
function ids(constName) {
  const bloque = data.split(`export const ${constName} = [`)[1].split('\nexport const')[0]
  return [...bloque.matchAll(/^\s{4}id: '([^']+)'/gm)].map((m) => m[1])
}

const tours = ids('TOURS')
const rutas = ids('HIKING_ROUTES')

const paginas = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/tours', priority: '0.9', changefreq: 'weekly' },
  ...tours.map((id) => ({ loc: `/tours/${id}`, priority: '0.85', changefreq: 'monthly' })),
  { loc: '/hiking', priority: '0.9', changefreq: 'weekly' },
  ...rutas.map((id) => ({ loc: `/hiking/${id}`, priority: '0.8', changefreq: 'monthly' })),
  { loc: '/about', priority: '0.8', changefreq: 'monthly' },
  { loc: '/pricing', priority: '0.85', changefreq: 'monthly' },
  { loc: '/faq', priority: '0.7', changefreq: 'monthly' },
  { loc: '/booking', priority: '0.9', changefreq: 'weekly' },
  { loc: '/resenas.html', priority: '0.7', changefreq: 'weekly' },
  { loc: '/terms', priority: '0.4', changefreq: 'yearly' },
  { loc: '/privacy', priority: '0.4', changefreq: 'yearly' },
  { loc: '/cookies', priority: '0.3', changefreq: 'yearly' },
  { loc: '/safety', priority: '0.6', changefreq: 'monthly' },
  { loc: '/legal', priority: '0.3', changefreq: 'yearly' },
  { loc: '/accessibility', priority: '0.3', changefreq: 'yearly' },
]

const url = ({ loc, priority, changefreq }) => {
  const abs = `${BASE}${loc}`
  // Las páginas .html llevan su propio selector de idioma dentro; el resto
  // usan ?lang= y se declaran con hreflang para que Google indexe cada versión.
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
