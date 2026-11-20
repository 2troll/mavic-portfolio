// node scripts/rutas-estaticas.mjs <carpeta-de-despliegue>
//
// GitHub Pages responde 404 a una ruta que no es un fichero real, y Google no
// indexa un 404. Por eso cada ruta del sitemap recibe su propio index.html.
// Además, cada uno lleva SU cabecera (título, descripción, foto para compartir,
// canonical e idiomas hermanos) sacada de src/seo/cabeceras.ts: así Google y
// las vistas previas de WhatsApp ven Osaka en /es/osaka/ y no la portada.
// Las rutas antiguas sin cabecera propia conservan el arreglo de antes
// (canonical propio y fuera los hreflang de la portada).

import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
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
  // Páginas de respuesta (precio de guía en Kioto, mezquitas, halal): su cabecera
  // vive con sus datos, en datosRespuestas.ts.
  Object.assign(cabeceras, (await vite.ssrLoadModule('/src/v7/datosRespuestas.ts')).cabecerasRespuesta())
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
const PRERENDER = /^(es|en|ar|ru|larion)(\/(osaka|kyoto|nara|kobe|himeji|hiroshima|beyond|rutas|routes|montana|hiking|otono-kioto|kyoto-autumn|sakura-kioto|kyoto-cherry-blossom|kyoto-sakura|viajar-a-japon-desde-espana-y-latinoamerica|travel-to-japan-from-uk-and-usa|from-gulf|from-russia|osaka-kioto|osaka-to-kyoto|aeropuerto-kansai|kansai-airport|ventajas|perks|guia-privado-espanol-kioto|guia-espanol-kansai|tour-privado-o-en-grupo-japon|guia-espanol-arabe-japon|spanish-speaking-guide-japan|arabic-speaking-guide-japan|kyoto-private-guide-cost|mosques-kansai|halal-kyoto-osaka|guia-privado-kioto-2-horas|kyoto-private-guide-2-hours|tour-privado-bici-kioto|kyoto-private-bike-tour|kyoto-private-guide-family|osaka-private-guide-hotel-pickup|nara-day-trip-from-osaka|excursion-nara-desde-osaka|excursion-hiroshima-miyajima-desde-osaka|hiroshima-miyajima-day-trip|koyasan-day-trip-private-guide|kobe-private-guide-one-day))?$/

// Nombres con hash de los trozos de página, sacados del build.
import { readdirSync } from 'node:fs'
const trozosJs = readdirSync(join(dest, 'assets')).filter((f) => f.endsWith('.js'))
const CSS_TROZOS = readdirSync(join(dest, 'assets')).filter((f) => f.endsWith('.css') && !f.startsWith('index-'))
const TROZOS = { guia: trozosJs.find((f) => f.startsWith('PaginaGuia-')), ciudad: trozosJs.find((f) => f.startsWith('CiudadPagina-')) }

// og:locale por idioma: árabe del Golfo (ar_SA), como la página /ar/from-gulf/.
const OG_LOCALE = { es: 'es_ES', en: 'en_US', ar: 'ar_SA', ru: 'ru_RU' }
// Las páginas de un país llevan el de ese país (WhatsApp y Facebook lo usan para la vista previa).
const OG_LOCALE_RUTA = { 'es/desde-mexico': 'es_MX', 'es/desde-argentina': 'es_AR', 'en/from-uk': 'en_GB' }

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const base = readFileSync(join(dest, 'index.html'), 'utf8')
const rutas = [...readFileSync(join(dest, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]*)<\/loc>/g)]
  .map((m) => m[1].replace(BASE, '').replace(/^\/+|\/+$/g, ''))
  .filter(Boolean)

// Web antigua: fuera del sitemap, pero sigue respondiendo (enlaces viejos y lo
// que Google ya tenía). La app redirige a la página nueva en el idioma del
// visitante; para Google, noindex y canonical a la equivalente en inglés.
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
let fichasAfiliado = 0
const FICHA_AFILIADO = /^(es\/ventajas|en\/perks|ar\/perks|ru\/perks)\/[^/]+$/
// Las páginas de Larion en inglés repetían del 55 al 96 % del texto de las de
// Tony en inglés (19-10-2026). Siguen abiertas para quien las visite, pero no
// se indexan; su versión en ruso (/ru/…) sí. Igual en src/seo/noindex.ts.
const LARION_EN = /^larion(\/|$)/
// Páginas que no traen clientes desde un buscador (avisos legales y la lista de
// apps con enlaces de afiliado): fuera del índice para que Bing y las IAs vean
// solo lo que responde a quien busca guía (19-10-2026).
const SIN_BUSQUEDA = /^(terms|privacy|cookies|safety|legal|accessibility)$/
const NOINDEX = new RegExp(`${LARION_EN.source}|${SIN_BUSQUEDA.source}`)
let pintadas = 0
for (const ruta of rutas) {
  // Las que ya son un fichero real (resenas.html, booking.html…) responden 200 solas.
  // (Solo ficheros: una carpeta ya creada, p. ej. es/ por una ruta antigua es/desde-…, no cuenta.)
  if (existsSync(join(dest, ruta)) && statSync(join(dest, ruta)).isFile()) continue
  // Las páginas en turco y francés (scripts/turkce.mjs, francais.mjs) ya son HTML completo sin React: no se pisan.
  if (existsSync(join(dest, ruta, 'index.html')) && readFileSync(join(dest, ruta, 'index.html'), 'utf8').includes('data-estatica=')) continue
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
    // hreflang: solo los idiomas (es/en/ar/ru; con los países de regiones.json
    // salían hasta 14 líneas por página que Google no necesita) y x-default a la
    // versión inglesa, no a la raíz, que solo redirige. Una página sin
    // traducciones (las de cada país, las árabes de mezquitas y halal) no
    // declara ninguno: un x-default suelto apuntando a otra página confunde.
    // Sin las páginas noindex (un hreflang no puede apuntar a una página que no
    // se indexa). data-rh: así Helmet las reemplaza al cargar en vez de
    // añadir una segunda copia de cada una.
    const alt = c.alternos.filter(([, r]) => !NOINDEX.test(r.replace(/^\/+|\/+$/g, '')))
    if (alt.length > 1) {
      const en = alt.find(([l]) => l === 'en')
      const alternos = alt.map(([l, r]) => `    <link data-rh="true" rel="alternate" hreflang="${l}" href="${BASE}${r}" />`)
      // Portada de Tony (/es/, /en/, /ar/): la x-default es la raíz «/», que elige
      // idioma. Con x-default en /en/, Google juntaba /en/ y / y no indexaba /en/.
      if (en) alternos.push(`    <link data-rh="true" rel="alternate" hreflang="x-default" href="${BASE}${en[1] === '/en/' ? '/' : en[1]}" />`)
      html = html.replace('</head>', `${alternos.join('\n')}\n  </head>`)
    }
    // og:locale del idioma de la página (antes todas decían en_US) y, como
    // alternativos, los de sus traducciones.
    const locales = [...new Set(c.alternos.map(([l]) => OG_LOCALE[l]).filter((x) => x && x !== OG_LOCALE[c.lang]))]
    html = html
      .replace(/^\s*<meta property="og:locale:alternate" [^>]*>\n/gm, '')
      .replace(/(<meta property="og:locale" content=")[^"]*("[^>]*>)/, `$1${OG_LOCALE_RUTA[ruta] ?? OG_LOCALE[c.lang] ?? 'en_US'}$2${locales.map((x) => `\n    <meta property="og:locale:alternate" content="${x}" />`).join('')}`)
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
    html = html.replace('</head>', `  <link rel="preload" as="image" href="${foto}.webp" imagesrcset="${foto}-600.webp 600w, ${foto}-900.webp 900w, ${foto}.webp 1800w" imagesizes="${PRECARGA[ruta] ? '(max-width: 900px) 70vw, 50vw' : '100vw'}" fetchpriority="high" />\n  </head>`)
  }

  // Las fichas de ventajas también se pintan: sin esto, en el HTML que leen
  // Bing y las IAs las ~150 eran la misma plantilla y solo cambiaba el título
  // (el contenido lo ponía React), justo lo que hizo que Bing bloqueara la web
  // en octubre de 2026. Indexables desde el 29-10, así que tienen que llevar su texto.
  if (PRERENDER.test(ruta) || FICHA_AFILIADO.test(ruta)) {
    // El CSS de los trozos perezosos (ciudades, manga, figuras) se enlaza ya en
    // la cabecera: si no, el HTML pintado se ve un instante sin esos estilos y
    // luego todo salta (CLS de 0,4 a 1,1 en Lighthouse).
    // Menos el de la 404 (nunca se pinta aquí) y el del mapa (70 KB, solo en
    // las de montaña): en el móvil cada hoja bloquea el primer pintado.
    const cssPagina = CSS_TROZOS.filter((f) => !f.startsWith('Pagina404-') && (!f.startsWith('maplibre-gl-') || /\/(montana|hiking)$/.test(ruta)))
    html = html.replace('</head>', cssPagina.map((f) => `  <link rel="stylesheet" href="/assets/${f}" />`).join('\n') + '\n  </head>')
    const idioma = ruta.split('/')[0] === 'larion' ? 'en' : ruta.split('/')[0]
    const ficheroDic = new URL(`../public/i18n/${idioma}.json`, import.meta.url)
    const frases = idioma !== 'en' && existsSync(ficheroDic) ? JSON.parse(readFileSync(ficheroDic, 'utf8')) : undefined
    const { html: cuerpo, ld } = await pinta(`/${ruta}/`, idioma, frases)
    html = html.replace('<div id="root"></div>', `<div id="root">${cuerpo}</div>`)
    // Páginas sin foto en PRECARGA (otoño, países, guías): se precarga la imagen
    // que la propia página marca como prioritaria, con su mismo srcset y sizes.
    if (!foto) {
      const img = cuerpo.match(/<img\b[^>]*fetchpriority="high"[^>]*>/)?.[0]
      const attr = (n) => img?.match(new RegExp(`\\b${n}="([^"]*)"`, 'i'))?.[1] // React escribe srcSet
      if (img && attr('srcset')) {
        html = html.replace('</head>', `  <link rel="preload" as="image" href="${attr('src')}" imagesrcset="${attr('srcset')}" imagesizes="${attr('sizes') ?? '100vw'}" fetchpriority="high" />\n  </head>`)
      }
    }
    if (ld) html = html.replace('</head>', `  ${ld}\n  </head>`)
    pintadas++
  }

  // Fichas de cada app de descuentos: útiles para el cliente, pero son 160
  // páginas de afiliado con muy poco texto. Bing bloqueaba la web entera
  // («URL cannot appear on Bing», 18-10-2026) y lo más parecido a sus normas
  // contra «thin affiliate» eran ellas: siguen funcionando, pero noindex y
  // fuera del sitemap. La lista general de ventajas, tampoco (SIN_BUSQUEDA).
  if (NOINDEX.test(ruta)) {
    html = html.replace(/<meta name="robots" content="[^"]*"\s*\/?>/, '<meta name="robots" content="noindex, follow" />')
    fichasAfiliado++
  }
  mkdirSync(join(dest, ruta), { recursive: true })
  writeFileSync(join(dest, ruta, 'index.html'), html)
}
// 404.html es una copia del índice con «index, follow»: Google no indexa un 404,
// pero Bing y los bots sin JavaScript leían esa etiqueta sin el noindex que pone React.
const p404 = join(dest, '404.html')
if (existsSync(p404)) writeFileSync(p404, readFileSync(p404, 'utf8').replace(/<meta name="robots" content="[^"]*"\s*\/?>/, '<meta name="robots" content="noindex, follow" />'))
// El sitemap publicado no las lista: a un buscador no se le piden páginas noindex.
const mapa = join(dest, 'sitemap.xml')
writeFileSync(mapa, readFileSync(mapa, 'utf8')
  .replace(/\s*<url>\s*<loc>([^<]*)<\/loc>[\s\S]*?<\/url>/g, (u, loc) => NOINDEX.test(loc.replace(BASE, '').replace(/^\/+|\/+$/g, '')) ? '' : u)
  .replace(/\s*<xhtml:link[^>]*href="https:\/\/tonykansaiguide\.com\/larion\/[^"]*"[^>]*\/>/g, ''))
// Portada (/): es la x-default y la de más prioridad, pero React solo la usa
// para redirigir al idioma del navegador, así que su HTML era un div vacío y
// los bots que no ejecutan JavaScript (GPTBot, ClaudeBot, PerplexityBot) leían
// 8 palabras. Se le pone, FUERA de #root para que React no intente hidratarlo,
// un resumen en texto con los datos de la web (precios de contenido.ts) y los
// enlaces a cada idioma. Quien tiene JavaScript no lo ve: el script de debajo
// lo quita antes de pintar y la app redirige como siempre. 404.html y 200.html
// ya se copiaron antes del índice limpio, así que no lo heredan.
const yen = (n) => '¥' + n.toLocaleString('en-US')
const P = { medio: 38000, completo: 58000, lejos: 70000 } // = YEN de src/v7/contenido.ts
const WA = (n) => `https://wa.me/${n}`
// 17-11-2026: la raíz deja de redirigir siempre (ver PortadaRaiz en src/v7/Redirige.tsx).
// Google la veía igual que /en/ y elegía «/» como canónica de /en/. Ahora es la
// página del equipo y de los idiomas: solo se quita (y la app redirige) si el
// visitante ya eligió idioma antes o llega con ?lang=. Los datos de cada guía
// son los mismos de public/llms.txt: si cambian allí, cambiarlos aquí.
const portada = `
    <main id="portada-texto" lang="en">
      <style>
        #portada-texto{--t:#16161a;--s:#55555f;--l:#e3e3e8;--f:#fff;--a:#b4232c;max-width:68rem;margin:0 auto;padding:clamp(1.5rem,5vw,4rem) 16px 4rem;font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--t);background:var(--f)}
        @media (prefers-color-scheme:dark){#portada-texto{--t:#f2f2f5;--s:#a9a9b3;--l:#2c2c33;--f:#111114;--a:#ff6b6b}}
        html:has(#portada-texto),body:has(#portada-texto){background:var(--f,#fff)}
        #portada-texto h1{font-size:clamp(1.9rem,4.5vw,3rem);line-height:1.1;letter-spacing:-.02em;margin:0 0 .6rem;max-width:22ch}
        #portada-texto h2{font-size:1.15rem;margin:2.4rem 0 .9rem}
        #portada-texto p{color:var(--s);max-width:62ch;margin:.4rem 0}
        #portada-texto a{color:inherit}
        #portada-texto .eq{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(min(100%,19rem),1fr));padding:0;margin:0;list-style:none}
        #portada-texto .eq li{border:1px solid var(--l);border-radius:14px;padding:1rem 1.1rem}
        #portada-texto .eq b{display:block;font-size:1.05rem}
        #portada-texto .eq small{display:block;color:var(--a);font-weight:600;margin:.1rem 0 .4rem}
        #portada-texto .eq span{display:block;color:var(--s);font-size:.95rem}
        #portada-texto .eq a.ir{display:inline-block;margin-top:.55rem;font-weight:600;text-decoration:none;border-bottom:2px solid var(--a)}
        #portada-texto .idi{display:flex;flex-wrap:wrap;gap:8px;padding:0;margin:0;list-style:none}
        #portada-texto .idi a{display:inline-block;padding:.5rem .95rem;border:1px solid var(--l);border-radius:999px;text-decoration:none;font-weight:600}
        #portada-texto .pie{margin-top:2.4rem;font-size:.95rem}
      </style>
      <h1>Tony Kansai Guide: private guides in Japan, in six languages</h1>
      <p>A small team of private guides who live in Japan. Tours are for your group only: your guide meets you at your hotel and the day goes at your pace. Choose your guide and your language.</p>

      <h2>The team</h2>
      <ul class="eq">
        <li><b>Tony Hanma</b><small>Spanish · English · Arabic — Kyoto, Osaka, Nara, Kobe, Himeji</small><span>Spanish guide who lives in Osaka. Half day (4 h) ${yen(P.medio)}, full day (8 h) ${yen(P.completo)}, long day trips from ${yen(P.lejos)}, per group of up to 6. WhatsApp <a href="${WA('34634193106')}">+34 634 193 106</a>.</span><a class="ir" href="/es/" lang="es">Español</a> · <a class="ir" href="/en/">English</a> · <a class="ir" href="/ar/" lang="ar">العربية</a></li>
        <li><b>Larion</b><small>Russian · English — Kyoto, Osaka, Hiroshima</small><span>Private tours in Russian across Kansai and beyond. Telegram <a href="https://t.me/Larik_Yokota">@Larik_Yokota</a> (Larion answers himself).</span><a class="ir" href="/ru/" lang="ru">Русский</a></li>
        <li><b>Mario</b><small>Premium English — anywhere in Japan</small><span>Professional private guide for English-speaking travellers, multi-day trips possible; also speaks Spanish. WhatsApp <a href="${WA('817089968582')}">+81 70 8996 8582</a>.</span><a class="ir" href="/private/">Mario, all of Japan</a></li>
        <li><b>Iheb</b><small>French · Arabic · English — Tokyo, Kanto, Hakone, Nagano</small><span>French-speaking guide in Tokyo; also anime and Pokémon tours and Muslim-friendly days. WhatsApp <a href="${WA('818080155322')}">+81 80 8015 5322</a>.</span><a class="ir" href="/fr/" lang="fr">Français</a> · <a class="ir" href="/ar/tokyo/" lang="ar">طوكيو بالعربية</a> · <a class="ir" href="/en/tokyo-anime-guide/">Tokyo anime guide</a></li>
        <li><b>Ferhat</b><small>Turkish — Kyoto, Osaka, Nara, Kobe, Himeji</small><span>Turkish guide who has lived in Japan for 4 years; private tours in Turkish, halal food tips and honeymoon plans.</span><a class="ir" href="/tr/" lang="tr">Türkçe</a></li>
        <li><b>Antonio</b><small>Spanish — family and group trips, all of Japan</small><span>Trip coordinator who designs whole Japan trips for families and groups of 6 to 10. WhatsApp <a href="${WA('817090508554')}">+81 70 9050 8554</a>.</span><a class="ir" href="/familias/" lang="es">Viajes en familia</a></li>
      </ul>

      <h2>Choose your language</h2>
      <ul class="idi">
        <li lang="es"><a href="/es/">Español</a></li>
        <li><a href="/en/">English</a></li>
        <li lang="ar" dir="rtl"><a href="/ar/">العربية</a></li>
        <li lang="ru"><a href="/ru/">Русский</a></li>
        <li lang="tr"><a href="/tr/">Türkçe</a></li>
        <li lang="fr"><a href="/fr/">Français</a></li>
      </ul>

      <p class="pie">Useful: <a href="/en/prices/">Prices</a> · <a href="/en/kyoto/">Private guide in Kyoto</a> · <a href="/en/osaka-to-kyoto/">Osaka to Kyoto by train</a> · <a href="/en/kansai-airport/">Kansai Airport</a> · <a href="/en/tools/">Free travel tools</a> · <a href="/en/perks/">Partner perks</a> · <a href="/resenas.html">Reviews</a> · <a href="mailto:tony@tonykansaiguide.com">tony@tonykansaiguide.com</a></p>
    </main>
    <script>try{if(localStorage.getItem('v7-pagina')||/[?&]lang=/.test(location.search))document.getElementById('portada-texto').remove()}catch(e){}</script>`
const indice = readFileSync(join(dest, 'index.html'), 'utf8')
if (!indice.includes('id="portada-texto"')) {
  if (!indice.includes('<div id="root"></div>')) throw new Error('index.html sin <div id="root"></div>: no se puede poner el texto de la portada')
  const TITULO = 'Tony Kansai Guide — private guides in Japan in 6 languages'
  const DESC = 'Choose your guide and language: Tony (Spanish, English, Arabic) in Kyoto, Osaka and Nara; Larion (Russian); Mario (premium English, all Japan); Iheb (French, Tokyo); Ferhat (Turkish); Antonio (family trips in Spanish).'
  writeFileSync(join(dest, 'index.html'), indice
    .replace('<div id="root"></div>', `<div id="root"></div>${portada}`)
    .replace(/<title>[^<]*<\/title>/, `<title>${TITULO}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${DESC}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${TITULO}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${TITULO}`))
}

console.log(`${rutas.length} rutas; ${propias} con cabecera propia; ${pintadas} ya pintadas; ${Object.keys(ANTIGUAS).length} antiguas con noindex; ${fichasAfiliado} con noindex (afiliado y Larion en inglés)`)
