#!/usr/bin/env node
// Genera public/sitemap.xml desde src/lib/data.ts.
//
//   npm run sitemap
//
// Antes había que acordarse de añadir a mano cada tour y cada ruta nueva. El
// despliegue crea una carpeta indexable por cada <loc> del sitemap, así que
// una ruta que faltara aquí devolvía 404 en Google aunque existiera en la web.
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://tonykansaiguide.com'
const LANGS = ['en', 'es', 'ar', 'ru']

const data = readFileSync(join(root, 'src/lib/data.ts'), 'utf8')
// Las apps de la página de ventajas (cada una tiene su ficha: /es/ventajas/<clave>/).
const APPS_VENTAJAS = [...readFileSync(join(root, 'src/v7/datosVentajas.ts'), 'utf8').matchAll(/clave: '([a-z0-9-]+)'/g)].map((m) => m[1])

/** Los ids de un bloque `export const X = [ … ]` de data.ts. */
function ids(constName) {
  const bloque = data.split(`export const ${constName} = [`)[1].split('\nexport const')[0]
  return [...bloque.matchAll(/^\s{4}id: '([^']+)'/gm)].map((m) => m[1])
}

const tours = ids('TOURS')
const rutas = ids('HIKING_ROUTES')

const paginas = [
  // La portada (/) no va: con JavaScript redirige al idioma del navegador
  // (Googlebot acaba en /en/ y lee dos canonical, / y /en/). Search Console la
  // marcaba como URL del sitemap que no se puede indexar. Se indexan /es/, /en/…
  // Web v7: una página por idioma y guía. Se declaran entre sí con hreflang
  // (Tony: es/en/ar; Larion: ru/en), no con ?lang=.
  { loc: '/es', priority: '1.0', changefreq: 'weekly', v7: 'tony' },
  { loc: '/en', priority: '1.0', changefreq: 'weekly', v7: 'tony' },
  { loc: '/ar', priority: '1.0', changefreq: 'weekly', v7: 'tony' },
  { loc: '/ru', priority: '1.0', changefreq: 'weekly', v7: 'larion' },
  { loc: '/larion', priority: '0.9', changefreq: 'weekly', v7: 'larion' },
  // Iheb, guía francófono (Tokio, Kanto, Nagano, Shizuoka): HTML estático de scripts/francais.mjs.
  { loc: '/fr', priority: '1.0', changefreq: 'weekly', v7: 'francais' },
  ...['tokyo', 'kamakura', 'nikko', 'hakone-mont-fuji', 'nagano', 'shizuoka', 'guide-francophone-japon', 'que-faire-a-tokyo', 'excursion-mont-fuji-depuis-tokyo', 'aeroport-narita-haneda-tokyo', 'itineraire-japon-2-semaines', 'quand-partir-japon', 'visa-japon', 'halal-mosquees-tokyo', 'jr-pass-ou-suica', 'budget-tokyo', 'argent-liquide-carte-japon', 'nikko-ou-hakone', 'voir-le-mont-fuji', 'guide-prive-tokyo-prix', 'tokyo-en-famille', 'avis-clients', 'french-speaking-guide-japan', 'guide-anime-tokyo', 'acheter-cartes-pokemon-japon', 'boutiques-cartes-pokemon-akihabara', 'pokemon-center-tokyo', 'pokemon-cafe-reservation', 'musee-ghibli-reservation', 'akihabara-que-faire', 'nakano-broadway', 'ikebukuro-anime', 'pelerinage-anime-tokyo'].map((c) => ({ loc: `/fr/${c}`, priority: '0.85', changefreq: 'monthly', v7: 'francais' })),
  // Larion: tours a la RPDC para rusos, HTML estático de scripts/kndr.mjs.
  { loc: '/ru/kndr', priority: '0.9', changefreq: 'weekly', v7: 'kndr' },
  ...['rozhdestvo-v-phenyane', 'masikryon', 'myohyan', 'den-solntsa', 'pektusan', 'vonsan-kalma', 'individualnyj', 'kak-poehat-v-severnuyu-koreyu', 'skolko-stoit-tur-v-kndr', 'pravila-dlya-turistov-v-kndr', 'vonsan-kalma-kurort', 'viza-v-kndr-dlya-rossiyan', 'vip-tur-v-kndr'].map((c) => ({ loc: `/ru/kndr/${c}`, priority: '0.8', changefreq: 'monthly', v7: 'kndr' })),
  // Ferhat, guía turco: HTML estático de scripts/turkce.mjs, sin traducciones (sin hreflang).
  { loc: '/tr', priority: '1.0', changefreq: 'weekly', v7: 'turkce' },
  ...['kyoto', 'osaka', 'nara', 'kobe', 'himeji', 'japonya-vize', 'helal-yemek-cami', 'osakadan-kyotoya-ulasim', 'kansai-havalimani-ulasim', 'japonya-gezi-plani', 'turkce-rehber-japonya', 'japonya-ne-zaman-gidilir', 'japonya-oncesi-bilinmesi-gerekenler', 'kyoto-bir-gunde', 'turkish-speaking-guide-japan'].map((c) => ({ loc: `/tr/${c}`, priority: '0.85', changefreq: 'monthly', v7: 'turkce' })),
  { loc: '/es/montana', priority: '0.9', changefreq: 'monthly', v7: 'montana' },
  { loc: '/en/hiking', priority: '0.9', changefreq: 'monthly', v7: 'montana' },
  { loc: '/ar/hiking', priority: '0.9', changefreq: 'monthly', v7: 'montana' },
  { loc: '/ru/hiking', priority: '0.9', changefreq: 'monthly', v7: 'montana' },
  // Páginas de ciudad (v8).
  ...['osaka', 'kyoto', 'nara', 'kobe', 'himeji', 'hiroshima', 'beyond'].flatMap((c) => ['es', 'en', 'ar'].map((l) => ({ loc: `/${l}/${c}`, priority: '0.9', changefreq: 'monthly', v7: `ciudadTony:${c}` }))),
  ...['hiroshima', 'kyoto', 'nara', 'osaka', 'himeji'].flatMap((c) => ['ru', 'larion'].map((l) => ({ loc: `/${l}/${c}`, priority: '0.85', changefreq: 'monthly', v7: `ciudadLarion:${c}` }))),
  { loc: '/es/viajar-a-japon-desde-espana-y-latinoamerica', priority: '0.8', changefreq: 'monthly', v7: 'hispano' },
  { loc: '/en/travel-to-japan-from-uk-and-usa', priority: '0.8', changefreq: 'monthly', v7: 'anglo' },
  { loc: '/ar/from-gulf', priority: '0.8', changefreq: 'monthly', v7: 'golfo' },
  { loc: '/ru/from-russia', priority: '0.8', changefreq: 'monthly', v7: 'rusia' },
  // Guías prácticas.
  { loc: '/es/osaka-kioto', priority: '0.8', changefreq: 'monthly', v7: 'osakaKioto' },
  { loc: '/en/osaka-to-kyoto', priority: '0.8', changefreq: 'monthly', v7: 'osakaKioto' },
  { loc: '/es/aeropuerto-kansai', priority: '0.8', changefreq: 'monthly', v7: 'aeropuerto' },
  { loc: '/en/kansai-airport', priority: '0.8', changefreq: 'monthly', v7: 'aeropuerto' },
  // Páginas de respuesta (datosRespuestas.ts): mezquitas, halal, Kansai… (el precio
  // de Kioto vive desde el 19-10-2026 dentro de /es/kyoto/ y /en/kyoto/).
  { loc: '/ar/mosques-kansai', priority: '0.8', changefreq: 'monthly', v7: 'mezquitas' },
  { loc: '/en/mosques-kansai', priority: '0.8', changefreq: 'monthly', v7: 'mezquitas' },
  { loc: '/ar/halal-kyoto-osaka', priority: '0.8', changefreq: 'monthly', v7: 'halal' },
  { loc: '/es/guia-espanol-kansai', priority: '0.8', changefreq: 'monthly', v7: 'kansai' },
  { loc: '/es/tour-privado-o-en-grupo-japon', priority: '0.8', changefreq: 'monthly', v7: 'privado' },
  { loc: '/es/guia-espanol-arabe-japon', priority: '0.8', changefreq: 'monthly', v7: 'arabe' },
  { loc: '/en/spanish-speaking-guide-japan', priority: '0.8', changefreq: 'monthly', v7: 'kansai' },
  { loc: '/en/arabic-speaking-guide-japan', priority: '0.8', changefreq: 'monthly', v7: 'arabe' },
  // Ventajas para el viajero.
  { loc: '/es/ventajas', priority: '0.6', changefreq: 'monthly', v7: 'ventajas' },
  { loc: '/en/perks', priority: '0.6', changefreq: 'monthly', v7: 'ventajas' },
  { loc: '/ar/perks', priority: '0.6', changefreq: 'monthly', v7: 'ventajas' },
  { loc: '/ru/perks', priority: '0.6', changefreq: 'monthly', v7: 'ventajas' },
  // Ficha propia de cada app de ventajas, en los cuatro idiomas.
  ...APPS_VENTAJAS.flatMap((c) => ['/es/ventajas', '/en/perks', '/ar/perks', '/ru/perks'].map((b) => ({ loc: `${b}/${c}`, priority: '0.5', changefreq: 'monthly', v7: `ventajaApp:${c}` }))),
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
  // /booking no va: es solo el salto a WhatsApp, sin texto que buscar (noindex).
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
  ventajas: [['es', '/es/ventajas/'], ['en', '/en/perks/'], ['ar', '/ar/perks/'], ['ru', '/ru/perks/']],
  mezquitas: [['ar', '/ar/mosques-kansai/']],
  halal: [['ar', '/ar/halal-kyoto-osaka/']],
}

// <lastmod>: la fecha real del último cambio del archivo del que sale cada
// página (Bing la usa para decidir qué volver a rastrear, y las IAs prefieren
// lo reciente). Si se pusiera la fecha del build en todas, los buscadores
// aprenden que no es fiable y la ignoran. Se saca de git; si el archivo tiene
// cambios sin commit o git no responde, vale la fecha de hoy.
const HOY = new Date().toISOString().slice(0, 10)
const FUENTE = {
  portada: ['src/v7/contenido.ts', 'src/v7/PaginaGuia.tsx'], tony: ['src/v7/contenido.ts', 'src/v7/PaginaGuia.tsx'], larion: ['src/v7/contenido.ts', 'src/v7/PaginaGuia.tsx'],
  turkce: ['scripts/turkce.mjs'],
  francais: ['scripts/francais.mjs'],
  kndr: ['scripts/kndr.mjs'],
  montana: ['src/v7/datosMontana.ts', 'src/v7/Montana.tsx', 'src/v7/datosCumbres.ts'],
  ciudadTony: ['src/v8/ciudades.ts', 'src/v8/CiudadPagina.tsx'], ciudadLarion: ['src/v8/ciudades.ts', 'src/v8/CiudadPagina.tsx'],
  rutasTony: ['src/v7/datosItinerarios.ts', 'src/v7/Itinerarios.tsx'], rutasLarion: ['src/v7/datosItinerarios.ts', 'src/v7/Itinerarios.tsx'],
  otono: ['src/v7/datosOtono.ts', 'src/v7/Otono.tsx'], sakura: ['src/v7/datosOtono.ts', 'src/v7/Otono.tsx'],
  osakaKioto: ['src/v7/datosGuias.ts', 'src/v7/GuiaTransporte.tsx'], aeropuerto: ['src/v7/datosGuias.ts', 'src/v7/GuiaTransporte.tsx'],
  ventajas: ['src/v7/datosVentajas.ts', 'src/v7/Ventajas.tsx'], ventajaApp: ['src/v7/datosVentajas.ts', 'src/v7/datosVentajasDetalle.ts'],
  coste: ['src/v7/datosRespuestas.ts', 'src/v7/PaginaRespuesta.tsx'], mezquitas: ['src/v7/datosRespuestas.ts', 'src/v7/PaginaRespuesta.tsx'], halal: ['src/v7/datosRespuestas.ts', 'src/v7/PaginaRespuesta.tsx'],
  ...Object.fromEntries(['kansai', 'privado', 'arabe'].map((g) => [g, ['src/v7/datosRespuestas.ts', 'src/v7/PaginaRespuesta.tsx']])),
  ...Object.fromEntries(['mexico', 'uk', 'espana', 'golfo', 'usa', 'argentina', 'rusia', 'hispano', 'anglo'].map((m) => [m, ['src/v7/datosViajeros.ts', 'src/v7/Viajeros.tsx']])),
}
const FUENTE_RUTA = {
  '/booking': ['public/booking.html'], '/resenas.html': ['public/resenas.html', 'public/reviews.json'],
  ...Object.fromEntries(['terms', 'privacy', 'cookies', 'safety', 'legal', 'accessibility'].map((r) => [`/${r}`, [`src/pages/${r[0].toUpperCase()}${r.slice(1)}.tsx`]])),
}
const git = (args) => { try { return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() } catch { return '' } }
const cache = new Map()
function lastmod({ loc, v7 }) {
  const ficheros = FUENTE_RUTA[loc] ?? FUENTE[v7 === true ? 'portada' : String(v7 ?? '').split(':')[0]] ?? ['src']
  const clave = ficheros.join('|')
  if (!cache.has(clave)) {
    const sucio = git(['status', '--porcelain', '--', ...ficheros])
    cache.set(clave, sucio ? HOY : (git(['log', '-1', '--format=%cs', '--', ...ficheros]) || HOY))
  }
  return cache.get(clave)
}

/** hreflang de un grupo de traducciones: solo idiomas (es/en/ar/ru, sin países)
 *  y x-default a la versión inglesa. Una página sin traducciones no lleva. */
function hreflangs(grupo) {
  if (!grupo || grupo.length < 2) return ''
  const en = grupo.find(([l]) => l === 'en')
  return grupo.map(([l, r]) => `\n    <xhtml:link rel="alternate" hreflang="${l}" href="${BASE}${r}"/>`).join('')
    + (en ? `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}${en[1]}"/>` : '')
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
      : tipo === 'ventajaApp' ? [['es', `/es/ventajas/${ciudad}/`], ['en', `/en/perks/${ciudad}/`], ['ar', `/ar/perks/${ciudad}/`], ['ru', `/ru/perks/${ciudad}/`]]
      : V7[v7 === true ? 'portada' : v7]
    return `  <url>\n    <loc>${abs}</loc>${hreflangs(grupo)}\n    <lastmod>${lastmod({ loc, v7 })}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
  }
  const alternates = loc.endsWith('.html') ? '' : LANGS.map((l) =>
    `\n    <xhtml:link rel="alternate" hreflang="${l}" href="${abs}${l === 'en' ? '' : `?lang=${l}`}"/>`
  ).join('') + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${abs}"/>`
  return `  <url>\n    <loc>${abs}</loc>${alternates}\n    <lastmod>${lastmod({ loc, v7 })}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paginas.map(url).join('\n')}
</urlset>
`

writeFileSync(join(root, 'public/sitemap.xml'), xml)
console.log(`sitemap.xml: ${paginas.length} URLs (${tours.length} tours, ${rutas.length} rutas)`)
