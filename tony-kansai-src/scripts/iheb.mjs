#!/usr/bin/env node
// Genera las páginas de Iheb en ÁRABE (/ar/tokyo/**) y en INGLÉS para el público
// americano (/en/tokyo-anime-guide/**). Su sección principal, en francés, sale de
// scripts/francais.mjs; esta reutiliza sus fotos (/fr/foto/) y su estilo anime
// (scripts/iheb-estilo.mjs).
//
//   node scripts/iheb.mjs
//
// HTML estático a propósito (como /fr/ y /tr/): los rastreadores de las IAs no
// ejecutan JavaScript. Llevan data-estatica en <html> para que rutas-estaticas.mjs
// no las pise.
//
// Datos de Iheb que constan (Tony, 30-10 y 4-11-2026): se llama Iheb, es tunecino y
// musulmán, vive en Japón, guía en francés, árabe e inglés SOLO en Tokio/Kanto,
// alrededor del Fuji (Shizuoka, lagos del Fuji) y Nagano; es profesional del anime,
// la cultura pop y las cartas Pokémon (siempre como colección, nunca inversión);
// trabaja con agencias y las pone en contacto con otros proveedores (transporte,
// otras agencias…). El precio lo da por WhatsApp. NO inventar apellido, años en
// Japón, licencias, reseñas ni precios.
// Regla del 4-11-2026: NADA de templos, budas, santuarios, torii ni pagodas
// (contradicen su fe). Nada de alcohol. Transporte y hoteles: se dice que CONECTA
// con proveedores con licencia, no que los vende él (en Japón, organizar servicios
// para agencias exige registro de 旅行サービス手配業).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { equipoHTML, equipoCSS, equipoFuente } from './equipo-estatico.mjs'
import { navHTML, pieHTML, menuCSS } from './menu-estatico.mjs'
import { ANIME_CSS, ANIME_FUENTES, ANIME_JS, IHEB_IDIOMAS_CSS, IHEB_PAISES, ihebHreflang, ihebIdiomas } from './iheb-estilo.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://tonykansaiguide.com'
const HOY = '2026-11-06'
const WA_NUMERO = '818080155322'
const WA_VISIBLE = '+81 80 8015 5322'
const wa = (texto) => `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(texto)}`
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const PHOTOS = JSON.parse(readFileSync(join(root, 'scripts/francais-photos.json'), 'utf8'))
const photo = (k) => { if (!PHOTOS[k]) throw new Error(`iheb: falta la foto ${k} en francais-photos.json`); return PHOTOS[k] }
const grande = (k) => photo(k).anchos.find((w) => w <= 1920) ?? photo(k).anchos.at(-1)
const srcset = (k) => photo(k).anchos.map((w) => `/fr/foto/${k}-${w}.webp ${Math.min(w, photo(k).w)}w`).join(', ')
const imageDe = (k) => `${BASE}/fr/foto/${k}-${grande(k)}.webp`

// Textos que cambian con el idioma. Lo demás (estructura, estilo) es común.
const L = {
  ar: {
    dir: 'rtl', locale: 'ar_AR', base: '/ar/tokyo/',
    marca: 'إيهاب · مرشد عربي في طوكيو',
    foto: 'صورة', credito: (k) => `صورة: <a href="${photo(k).kaynak}" rel="nofollow">${esc(photo(k).autor)}</a> · ${esc(photo(k).lisans)}`,
    waGenel: wa('السلام عليكم إيهاب، أبحث عن مرشد في طوكيو. التواريخ: '),
    waAgence: wa('السلام عليكم إيهاب، نحن وكالة سفر ونود التعاون معك في اليابان. '),
    waBoton: 'واتساب: إيهاب', menu: 'القائمة الرئيسية', abrir: 'فتح القائمة', mas: 'عرض الكل',
    alt: 'إيهاب، مرشد سياحي عربي في طوكيو',
  },
  en: {
    dir: 'ltr', locale: 'en_US', base: '/en/tokyo-anime-guide/',
    marca: 'Iheb · Tokyo Anime Guide',
    foto: 'Photo', credito: (k) => `Photo: <a href="${photo(k).kaynak}" rel="nofollow">${esc(photo(k).autor)}</a> · ${esc(photo(k).lisans)}`,
    waGenel: wa('Hi Iheb, I’m looking for an anime / Pokémon guide in Tokyo. Dates: '),
    waAgence: wa('Hi Iheb, we are a travel agency and would like to work with you in Japan. '),
    waBoton: 'WhatsApp: Iheb', menu: 'Main menu', abrir: 'Open menu', mas: 'See all',
    alt: 'Iheb, anime and Pokémon tour guide in Tokyo',
  },
  fr: {
    dir: 'ltr', locale: 'fr_CA', base: '/fr/',
    marca: 'Iheb · Guide francophone à Tokyo',
    foto: 'Photo', credito: (k) => `Photo : <a href="${photo(k).kaynak}" rel="nofollow">${esc(photo(k).autor)}</a> · ${esc(photo(k).lisans)}`,
    waGenel: wa('Bonjour Iheb, nous venons du Canada et cherchons un guide francophone à Tokyo. Dates : '),
    waAgence: wa('Bonjour Iheb, nous sommes une agence de voyages et aimerions travailler avec vous au Japon. '),
    waBoton: 'WhatsApp : Iheb', menu: 'Menu principal', abrir: 'Ouvrir le menu', mas: 'Tout voir',
    alt: 'Iheb, guide francophone privé à Tokyo',
  },
}

const carte = (lang, k, alt, titre, texte, href = null) => {
  const img = `<figure class="kf"><img src="/fr/foto/${k}-${photo(k).anchos.at(-1)}.webp" srcset="${srcset(k)}" sizes="(max-width:700px) 100vw, 380px" alt="${esc(alt)}" loading="lazy" width="${photo(k).w}" height="${photo(k).h}"></figure>`
  const ki = `<div class="ki"><h3>${esc(titre)}</h3><p>${esc(texte)}</p></div>`
  return `<li>${href ? `<a href="${href}">${img}${ki}</a>` : `${img}${ki}`}<small class="kf-kredi">${L[lang].credito(k)}</small></li>`
}
const hero = (lang, k, alt, contenu) => `<section class="kahraman">
<img src="/fr/foto/${k}-${grande(k)}.webp" srcset="${srcset(k)}" sizes="100vw" alt="${esc(alt)}" fetchpriority="high" width="${photo(k).w}" height="${photo(k).h}">
<small class="kredi">${L[lang].credito(k)}</small>
<div class="ortu"><div class="kap">${contenu}</div></div></section>`

// La carta coleccionable de Iheb (diseño propio, ver iheb-estilo.mjs).
const cartaIheb = (lang) => {
  const t = lang === 'ar'
    ? { tipo: 'مرشد', habil: 'المهارات', h1: 'لغات', v1: 'العربية · الفرنسية · الإنجليزية', h2: 'تخصص', v2: 'أنمي، ثقافة البوب اليابانية، بطاقات بوكيمون', h3: 'مناطق', v3: 'طوكيو، كانتو، جبل فوجي، شيزوكا، ناغانو', rozet: ['حلال', 'أوقات الصلاة', 'عائلات', 'وكالات'] }
    : { tipo: 'Guide', habil: 'Abilities', h1: 'Languages', v1: 'English · French · Arabic', h2: 'Specialty', v2: 'Anime, Japanese pop culture, Pokémon cards', h3: 'Area', v3: 'Tokyo, Kanto, Mt. Fuji, Shizuoka, Nagano', rozet: ['Private', 'Families', 'Halal-friendly', 'Agencies'] }
  return `<div class="tcg" role="img" aria-label="${esc(L[lang].alt)}">
<div class="tcg-ust"><b>${lang === 'ar' ? 'إيهاب' : 'Iheb'}</b><span>${t.tipo}</span></div>
<img src="/fr/foto/iheb-640.webp" srcset="/fr/foto/iheb-320.webp 320w, /fr/foto/iheb-640.webp 640w, /fr/foto/iheb-1080.webp 1080w" sizes="320px" alt="${esc(L[lang].alt)}" width="1080" height="1080" loading="lazy">
<div class="tcg-kutu"><p><strong>${t.h1}</strong> · ${t.v1}</p><p><strong>${t.h2}</strong> · ${t.v2}</p><p><strong>${t.h3}</strong> · ${t.v3}</p>
<div class="tcg-rozet">${t.rozet.map((r) => `<span>${r}</span>`).join('')}</div></div></div>`
}

const faqHTML = (faq) => faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${a}</p></details>`).join('\n')
const faqLd = (faq) => ({ '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) })
const PERSON_LD = { '@type': 'Person', '@id': `${BASE}/fr/#iheb`, name: 'Iheb', jobTitle: 'Private tour guide', image: `${BASE}/fr/foto/iheb-1080.webp`, knowsLanguage: ['fr', 'ar', 'en'], knowsAbout: ['Anime', 'Japanese pop culture', 'Pokémon Trading Card Game', 'Halal travel in Tokyo', 'Tokyo', 'Mount Fuji'], areaServed: ['Tokyo', 'Kanto', 'Shizuoka', 'Nagano'], worksFor: { '@type': 'LocalBusiness', '@id': `${BASE}/#negocio`, name: 'Tony Kansai Guide' }, contactPoint: { '@type': 'ContactPoint', telephone: `+${WA_NUMERO}`, contactType: 'customer service', availableLanguage: ['French', 'Arabic', 'English'] } }

// Las versiones de cada página en otros idiomas (hreflang y selector) están en
// IHEB_EQUIVALENTES (iheb-estilo.mjs), compartidas con francais.mjs y el sitemap.

// Para quién es cada página (schema.org audience): lo leen Google y las IAs al decidir a quién recomendarla.
const GOLFO = ['Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Bahrain', 'Oman']
const NORTEAMERICA = ['United States', 'Canada']
const MAGREB = ['Tunisia', 'Algeria', 'Morocco']
const pais = (n) => ({ '@type': 'Country', name: n })
const AUDIENCIA = {
  lujo: { audienceType: 'VIP and affluent Gulf (GCC) and Arab families, and travel agencies serving them', paises: GOLFO },
  primera: { audienceType: 'First-time and senior travelers from the United States and Canada, including French-speaking Québec', paises: NORTEAMERICA },
  otaku: { audienceType: 'Anime, manga and Pokémon fans from the United States and Canada', paises: NORTEAMERICA },
  portada: { audienceType: 'Arabic, French and English speaking travelers to Tokyo', paises: [...GOLFO, ...MAGREB, 'France', 'Belgium', 'Switzerland', ...NORTEAMERICA] },
  agencias: { audienceType: 'Travel agencies and tour operators', paises: [...GOLFO, ...MAGREB, 'France', 'Belgium', ...NORTEAMERICA] },
  musulman: { audienceType: 'Muslim travelers and families from Southeast Asia and the United Kingdom', paises: ['Malaysia', 'Singapore', 'Brunei', 'Indonesia', 'United Kingdom'] },
  halal: { audienceType: 'Muslim travelers', paises: [...GOLFO, ...MAGREB, 'Malaysia', 'Indonesia'] },
  anime: { audienceType: 'Anime and Pokémon fans and their families', paises: [...GOLFO, ...NORTEAMERICA] },
  magreb: { audienceType: 'Arabic and French speaking travelers from the Maghreb and francophone West Africa', paises: [...MAGREB, 'Senegal', 'Côte d’Ivoire'] },
}
// A los países propios de cada página se suman los mercados del idioma (IHEB_PAISES).
const audiencia = (alterna, lang) => {
  const a = AUDIENCIA[alterna] ?? { audienceType: { ar: 'Arabic-speaking travelers from the Gulf (GCC)', en: 'English-speaking travelers', fr: 'French-speaking travelers' }[lang], paises: [] }
  return { audience: { '@type': 'Audience', audienceType: a.audienceType, geographicArea: [...new Set([...a.paises, ...IHEB_PAISES[lang]])].map(pais) } }
}

// Datos estructurados comunes a todas las páginas: miga (portada del idioma → página)
// y el servicio de Iheb con su zona. La miga toma el título hasta « | » o « : ».
const ZONA_LD = ['Tokyo', 'Kanto', 'Shizuoka', 'Nagano'].map((name) => ({ '@type': 'Place', name, containedInPlace: { '@type': 'Country', name: 'Japan' } }))
const HUB = { ar: 'إيهاب في طوكيو', en: 'Iheb · Tokyo anime guide', fr: 'Iheb · Guide francophone' }
function ldComun({ lang, ruta, titre, alterna }) {
  const l = L[lang]
  const nombre = titre.split(/ [|:] /)[0]
  const miga = [{ '@type': 'ListItem', position: 1, name: HUB[lang], item: `${BASE}${l.base}` }]
  if (ruta !== l.base) miga.push({ '@type': 'ListItem', position: 2, name: nombre, item: `${BASE}${ruta}` })
  return [
    { '@type': 'BreadcrumbList', itemListElement: miga },
    { '@type': 'Service', '@id': `${BASE}${ruta}#servicio`, name: nombre, serviceType: 'Private tour guide', provider: { '@id': `${BASE}/fr/#iheb` }, areaServed: ZONA_LD, availableLanguage: ['fr', 'ar', 'en'], ...audiencia(alterna, lang) },
  ]
}

function page({ lang, ruta, alterna, titre, desc, image, jsonld, corps }) {
  const l = L[lang]
  const url = `${BASE}${ruta}`
  const alts = ihebHreflang(ruta, lang, BASE)
  const grupos = lang === 'ar'
    ? [
        { t: 'إيهاب', enlaces: [['الرئيسية', '/ar/tokyo/'], ['عائلات الخليج', '/ar/tokyo/fakhira/'], ['حلال ومساجد', '/ar/tokyo/halal-masajid/'], ['أنمي وبوكيمون', '/ar/tokyo/anime-pokemon/'], ['رحلات يومية', '/ar/tokyo/rihlat-min-tokyo/'], ['برنامج 3 و5 و7 أيام', '/ar/tokyo/barnamaj-tokyo/'], ['من المغرب العربي', '/ar/tokyo/maghreb/'], ['للوكالات', '/ar/tokyo/wakalat/'], ['اكتب رأيك', '/ar/tokyo/taqyim/']] },
        { t: 'لغات أخرى', enlaces: [{ t: 'Français', h: '/fr/', lang: 'fr', hreflang: 'fr' }, { t: 'English', h: '/en/tokyo-anime-guide/', lang: 'en', hreflang: 'en' }, ['Tony Kansai Guide', '/ar/']] },
      ]
    : lang === 'fr'
    ? [
        { t: 'Iheb', enlaces: [['Accueil', '/fr/'], ['Québec et Canada', '/fr/tokyo-quebec-canada/'], ['Maghreb et Afrique', '/fr/tokyo-maghreb/'], ['Excursions depuis Tokyo', '/fr/excursions-depuis-tokyo/'], ['Itinéraires 3, 5, 7 jours', '/fr/itineraire-tokyo-3-5-7-jours/'], ['Guide anime', '/fr/guide-anime-tokyo/'], ['Pour les agences', '/fr/guide-francophone-agences-voyage/']] },
        { t: 'Autres langues', enlaces: [{ t: 'English', h: '/en/tokyo-anime-guide/first-time-japan/', lang: 'en', hreflang: 'en' }, { t: 'العربية', h: '/ar/tokyo/', lang: 'ar', hreflang: 'ar' }, ['Tony Kansai Guide', '/']] },
      ]
    : [
        { t: 'Iheb', enlaces: [['Home', '/en/tokyo-anime-guide/'], ['The otaku guide', '/en/tokyo-anime-guide/otaku-guide/'], ['Akihabara', '/en/tokyo-anime-guide/akihabara/'], ['Nakano Broadway', '/en/tokyo-anime-guide/nakano-broadway/'], ['Ikebukuro', '/en/tokyo-anime-guide/ikebukuro/'], ['Day trips from Tokyo', '/en/tokyo-anime-guide/day-trips/'], ['Itineraries: 3, 5, 7 days', '/en/tokyo-anime-guide/tokyo-itinerary/'], ['First time in Japan', '/en/tokyo-anime-guide/first-time-japan/'], ['Gulf / GCC agencies', '/en/arabic-speaking-guide-tokyo/'], ['Muslim-friendly Tokyo', '/en/muslim-guide-tokyo/'], ['For travel agencies', '/en/tokyo-anime-guide/travel-agencies/'], ['Leave a review', '/en/tokyo-anime-guide/review/']] },
        { t: 'Other languages', enlaces: [{ t: 'Français', h: '/fr/', lang: 'fr', hreflang: 'fr' }, { t: 'العربية', h: '/ar/tokyo/', lang: 'ar', hreflang: 'ar' }, ['Tony Kansai Guide', '/en/']] },
      ]
  const intro = lang === 'ar'
    ? '<p>إيهاب هو مرشد <a href="/ar/">Tony Kansai Guide</a> في طوكيو وشرق اليابان. أما كيوتو وأوساكا فيرشد فيهما توني من الفريق نفسه، بالعربية والإسبانية والإنجليزية.</p>'
    : lang === 'fr'
    ? '<p>Iheb est le guide de l’équipe <a href="/fr/">Tony Kansai Guide</a> pour Tokyo et l’est du Japon. À Kyoto et Osaka, Tony, de la même équipe, prend le relais.</p>'
    : '<p>Iheb is the <a href="/en/">Tony Kansai Guide</a> team’s guide for Tokyo and eastern Japan. For Kyoto and Osaka, Tony from the same team takes over.</p>'
  return `<!doctype html>
<html lang="${lang}" dir="${l.dir}" data-estatica="iheb">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(titre)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}">
${alts}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Tony Kansai Guide">
<meta property="og:locale" content="${l.locale}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(titre)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${image}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [{ '@type': 'WebPage', '@id': url, url, name: titre, description: desc, inLanguage: lang, dateModified: HOY, about: { '@id': `${BASE}/fr/#iheb` }, ...audiencia(alterna, lang) }, PERSON_LD, ...ldComun({ lang, ruta, titre, alterna }), ...jsonld] })}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${ANIME_FUENTES}
${equipoFuente}
<style>${CSS_BASE}${ANIME_CSS}${equipoCSS}${menuCSS}${IHEB_IDIOMAS_CSS}</style>
</head>
<body>
<header><div class="kap"><a href="${l.base}">${esc(l.marca)}</a>
${ihebIdiomas(ruta, lang)}
${navHTML({ etiqueta: l.menu, abrir: l.abrir, variante: 'fr', grupos, cta: { t: 'WhatsApp', h: l.waGenel, aria: l.waBoton } })}</div></header>
<main>
${corps}
</main>
<footer>${pieHTML({ variante: 'fr', mas: l.mas, intro, columnas: grupos.map((g) => ({ t: g.t, enlaces: g.enlaces })).concat([{ t: lang === 'ar' ? 'تواصل' : 'Contact', fija: true, html: `<p>WhatsApp: <a href="${l.waGenel}" dir="ltr">${WA_VISIBLE}</a></p><p><a href="mailto:tony@tonykansaiguide.com">tony@tonykansaiguide.com</a></p>` }]),
  equipo: equipoHTML({ lang, actual: 'iheb', variante: 'fr' }),
  fin: `<span>© Tony Kansai Guide</span><span>${{ ar: 'آخر تحديث', fr: 'Mise à jour' }[lang] ?? 'Last updated'}: ${HOY}</span>`,
})}</footer>
<a class="wa-sabit" href="${l.waGenel}">${esc(l.waBoton)}</a>
${ANIME_JS}
</body>
</html>
`
}

// Base mínima (la de /fr/ reducida): rejilla, héroe, tarjetas. El aspecto lo da ANIME_CSS.
const CSS_BASE = `
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;color:var(--fg);font-size:17px;line-height:1.7;padding-bottom:76px}
.kap{max-width:1080px;margin:0 auto;padding:0 16px}main>.kap>p,main>.kap>ul.ozet,main>.kap>ol,main>.kap>details,main>.kap>.cevap,main>.kap>table,main>.kap>h3{max-width:760px}
h2{font-size:clamp(26px,3.4vw,34px)!important;margin-top:56px!important}h3{font-size:18px;margin:0 0 4px}
header .kap{display:flex;justify-content:space-between;align-items:center;gap:12px;padding-block:14px;flex-wrap:wrap}
header a{color:var(--fg);text-decoration:none;font-weight:800}
.kahraman{position:relative;min-height:min(82vh,900px);display:flex;align-items:flex-end;overflow:hidden;background:#111;color:#fff}
.kahraman>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;animation:yakin 18s ease-out both}
@keyframes yakin{from{transform:scale(1.08)}to{transform:scale(1)}}@media (prefers-reduced-motion:reduce){.kahraman>img{animation:none}}
.kahraman .ortu{position:relative;width:100%;padding:120px 0 64px}
.kahraman h1{color:#fff;font-size:clamp(32px,6vw,62px);line-height:1.15;margin:14px 0}
.kahraman .alt{color:rgba(255,255,255,.92);font-size:clamp(18px,2.4vw,22px);max-width:34em}
.kredi{position:absolute;inset-inline-end:10px;top:8px;font-size:11px;color:rgba(255,255,255,.7)}.kredi a{color:inherit}
.kf{margin:0;position:relative;aspect-ratio:4/3;overflow:hidden;background:#222}.kf img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease}
.ki{padding:14px 16px 18px}
.btn{display:inline-block;text-decoration:none;padding:13px 22px;border-radius:999px;margin:8px 0}
.etiket{font-size:13px;font-weight:800;text-transform:uppercase}
ul.ozet{padding-inline-start:20px}ul.ozet li{margin:6px 0}
.izgara{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:22px;padding:0;list-style:none}
.izgara li{position:relative;background:var(--kart);overflow:hidden}.izgara li:hover .kf img{transform:scale(1.05)}
.izgara a{color:var(--fg);text-decoration:none}.izgara p{margin:0;color:var(--soluk);font-size:15px}
.kf-kredi{position:absolute;left:0;right:0;top:0;padding:4px 8px 14px;font-size:10px;color:rgba(255,255,255,.85);background:linear-gradient(rgba(0,0,0,.5),transparent);pointer-events:none}.kf-kredi a{color:inherit;pointer-events:auto}
details{background:var(--kart);border-radius:12px;padding:12px 16px;margin:10px 0}summary{cursor:pointer}details p{margin:8px 0 0}
.cevap{background:var(--kart);padding:16px 18px;font-size:18px}
table{border-collapse:collapse;width:100%;font-size:15px}td,th{border-bottom:1px solid var(--cizgi);padding:8px 6px;text-align:start;vertical-align:top}
footer{border-top:3px solid var(--cizgi);margin-top:56px;padding:20px 0 40px;color:var(--soluk);font-size:14px}footer a{color:var(--soluk)}
a{color:var(--kirmizi)}
.wa-sabit{position:fixed;right:16px;bottom:16px;z-index:9;color:#fff;text-decoration:none;font-weight:800;padding:13px 20px;border-radius:999px}
.guide{display:grid;grid-template-columns:minmax(220px,340px) 1fr;gap:40px;align-items:center;margin-top:56px}.guide h2{margin-top:0!important}
@media (max-width:700px){.guide{grid-template-columns:1fr;gap:28px}}
.kaynak{font-size:14px;color:var(--soluk)}`

const ecrire = (ruta, html) => {
  const dir = join(root, 'public', ruta)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
  return ruta
}

// ———————————————————————— ÁRABE ————————————————————————
const AR_LUGARES = [
  ['akihabara', 'شارع أكيهابارا في طوكيو', 'أكيهابارا', 'عاصمة الأنمي والألعاب: بطاقات بوكيمون، مجسّمات، ألعاب فيديو قديمة وجديدة.'],
  ['shibuya', 'تقاطع شيبويا', 'شيبويا', 'التقاطع الأشهر في العالم، ومركز PARCO وفيه متجر نينتندو ومركز بوكيمون.'],
  ['tokyo-camii', 'جامع طوكيو', 'جامع طوكيو', 'أكبر مساجد اليابان على الطراز العثماني، قرب محطة يويوغي-أويهارا. نصلّي فيه أثناء الجولة.'],
  ['skytree', 'برج طوكيو سكاي تري', 'طوكيو سكاي تري', 'أعلى برج في اليابان (634 مترًا)، وتحته مركز بوكيمون في سولاماتشي.'],
  ['odaiba', 'واجهة أوداييبا البحرية', 'أوداييبا', 'الواجهة البحرية وجسر قوس قزح، وأجمل ما تكون عند الغروب.'],
  ['yokohama', 'ميناء يوكوهاما', 'يوكوهاما', 'الميناء وحي ميناتو ميراي، على بعد نصف ساعة تقريبًا من طوكيو.'],
  ['kawaguchiko-fuji', 'جبل فوجي وبحيرة كاواغوتشي', 'جبل فوجي وبحيرة كاواغوتشي', 'رحلة يوم من طوكيو لرؤية فوجي ينعكس على البحيرة في الأيام الصافية.'],
  ['owakudani', 'وادي أواكوداني البركاني في هاكوني', 'هاكوني', 'بحيرة آشي بالقارب، والتلفريك فوق الوادي البركاني أواكوداني.'],
  ['singes-jigokudani', 'قرود الثلج في ناغانو', 'قرود الثلج في ناغانو', 'قرود برّية تستحمّ في ينبوع ساخن وسط الثلج، وتحبّها العائلات كثيرًا.'],
]

const AR_FAQ_PORTADA = [
  ['هل يوجد مرشد سياحي عربي في طوكيو؟', `نعم. إيهاب مرشد تونسي مسلم يعيش في اليابان، ويقدّم جولات خاصة بالعربية (وبالفرنسية والإنجليزية) في طوكيو وحولها. الحجز عبر واتساب: <span dir="ltr">${WA_VISIBLE}</span>.`],
  ['هل الجولة مناسبة للعائلات المسلمة؟', 'نعم. الجولة خاصة بعائلتك فقط، والوجبات في مطاعم حلال أو مناسبة للمسلمين، ونتوقف لأوقات الصلاة، ولا ندخل معابد أو أماكن عبادة غير إسلامية.'],
  ['هل تشمل الجولة زيارة المعابد؟', 'لا. برنامج إيهاب يركّز على المدينة الحديثة، والأنمي والتسوّق، والطبيعة وجبل فوجي، والمساجد. لا معابد ولا تماثيل بوذا.'],
  ['كم سعر الجولة؟', 'يختلف السعر حسب عدد الأشخاص ومدة الجولة والأماكن. يرسله لك إيهاب على واتساب بعد معرفة برنامجك.'],
  ['أين يرشد إيهاب؟', 'في طوكيو ومنطقة كانتو (يوكوهاما، إينوشيما، نيكّو، هاكوني)، وحول جبل فوجي (بحيرات فوجي وشيزوكا)، وفي محافظة ناغانو. كيوتو وأوساكا يرشد فيهما توني من الفريق نفسه.'],
  ['هل يتعامل إيهاب مع وكالات السفر؟', 'نعم. يرشد عملاء الوكالات، ويتعاقد معها، ويصلها بشركاء محليين للنقل وغيره. <a href="/ar/tokyo/wakalat/">التفاصيل للوكالات</a>.'],
]

function arPortada() {
  const corps = `${hero('ar', 'akihabara', 'أكيهابارا في طوكيو', `<p class="etiket">طوكيو · بالعربية · حلال</p>
<h1>إيهاب، مرشدك العربي المسلم في طوكيو</h1>
<p class="alt">جولات خاصة بالعربية لك ولعائلتك: أنمي وبوكيمون، تسوّق، جبل فوجي والطبيعة، طعام حلال ووقت للصلاة. بلا معابد.</p>
<p><a class="btn" href="${L.ar.waGenel}">اكتب لإيهاب على واتساب</a></p>`)}
<div class="kap">
<ul class="rozetler"><li>العربية</li><li>الفرنسية</li><li>الإنجليزية</li><li>طعام حلال</li><li>أوقات الصلاة</li><li>أنمي</li><li>بطاقات بوكيمون</li><li>عائلات</li><li>وكالات السفر</li></ul>
<p class="cevap">إيهاب مرشد سياحي تونسي مسلم يعيش في اليابان، ويقدّم جولات خاصة بالعربية والفرنسية والإنجليزية في طوكيو ومنطقة كانتو، وحول جبل فوجي، وفي شيزوكا وناغانو. يبني يومك حول ما تحبّه: الأنمي وبطاقات بوكيمون، والتسوّق، والطبيعة، مع وجبات حلال ووقفات للصلاة. السعر حسب المجموعة، على واتساب: <span dir="ltr">${WA_VISIBLE}</span>.</p>
<section class="guide"><div>${cartaIheb('ar')}</div><div>
<p class="cevap">للعائلات الخليجية من قطر والإمارات والسعودية والبحرين وعُمان والكويت: سيارة خاصة مع سائق، حلال، وخصوصية تامة. <a href="/ar/tokyo/fakhira/">رحلات خاصة لعائلات الخليج ←</a></p>
<h2>لماذا إيهاب؟</h2>
<ul class="ozet">
<li><strong>مسلم مثلك:</strong> يعرف ما تحتاجه العائلة المسلمة في اليابان، من المطاعم الحلال إلى أماكن الصلاة وصلاة الجمعة.</li>
<li><strong>بلا معابد:</strong> برنامج نظيف من زيارة المعابد وتماثيل بوذا؛ نركّز على اليابان الحديثة والطبيعة.</li>
<li><strong>خبير أنمي وبوكيمون:</strong> محترف في ثقافة البوب اليابانية وبطاقات بوكيمون، يعرف المحلات الجيدة ويحميك من البطاقات المزيّفة.</li>
<li><strong>جولة خاصة:</strong> لك ولعائلتك فقط، على إيقاعكم.</li>
</ul>
<p><a class="btn" href="${L.ar.waGenel}">احجز على واتساب</a></p></div></section>
<h2>أماكن نزورها معًا</h2>
<ul class="izgara">${AR_LUGARES.map(([k, alt, t, p]) => carte('ar', k, alt, t, p)).join('')}</ul>
<h2>يوم مثالي في طوكيو</h2>
<ol class="adimlar">
<li><strong>الصباح:</strong> أكيهابارا، محلات البطاقات والمجسّمات والألعاب.</li>
<li><strong>الظهر:</strong> غداء حلال، ثم صلاة الظهر في جامع طوكيو.</li>
<li><strong>بعد الظهر:</strong> شيبويا، ومتجر نينتندو ومركز بوكيمون في PARCO.</li>
<li><strong>المساء:</strong> أوداييبا وجسر قوس قزح عند الغروب.</li>
</ol>
<p class="kaynak">كل برنامج يُبنى حسب رغبتكم؛ هذا مثال فقط.</p>
<p><a class="btn" href="/ar/tokyo/anime-pokemon/">دليل الأنمي وبوكيمون</a> <a class="btn" href="/ar/tokyo/halal-masajid/">حلال ومساجد طوكيو</a> <a class="btn" href="/ar/tokyo/rihlat-min-tokyo/">رحلات يومية من طوكيو</a> <a class="btn" href="/ar/tokyo/barnamaj-tokyo/">برنامج 3 و5 و7 أيام</a> <a class="btn" href="/ar/tokyo/maghreb/">من المغرب العربي</a></p>
</div>
<section class="bant"><div class="kap">
<h2>وكالات السفر: إيهاب شريككم في اليابان</h2>
<p>يتعاقد إيهاب مع الوكالات، ويرشد عملاءكم بالعربية والفرنسية والإنجليزية، ويصلكم بشركاء محليين للنقل والحافلات والفنادق والمطاعم الحلال ومرشدين آخرين.</p>
<p><a class="btn" href="/ar/tokyo/wakalat/">التعاون مع الوكالات</a></p>
</div></section>
<div class="kap">
<h2>أسئلة شائعة</h2>
${faqHTML(AR_FAQ_PORTADA)}
<p><a class="btn" href="${L.ar.waGenel}">اكتب لإيهاب على واتساب</a></p>
</div>`
  return ecrire('ar/tokyo', page({ lang: 'ar', ruta: '/ar/tokyo/', alterna: 'portada',
    titre: 'مرشد سياحي عربي مسلم في طوكيو: إيهاب | جولات خاصة بالعربية',
    desc: 'إيهاب، مرشد تونسي مسلم في طوكيو: جولات خاصة بالعربية، طعام حلال وأوقات الصلاة، أنمي وبطاقات بوكيمون، جبل فوجي. بلا معابد. السعر على واتساب.',
    image: imageDe('akihabara'), jsonld: [faqLd(AR_FAQ_PORTADA)], corps }))
}

const AR_FAQ_HALAL = [
  ['أين أصلّي الجمعة في طوكيو؟', 'في جامع طوكيو أو مسجد أوتسوكا مثلًا؛ تأكّد من موعد خطبة الجمعة على موقع المسجد.'],
  ['ما أكبر مسجد في طوكيو؟', 'جامع طوكيو (Tokyo Camii) في حي شيبويا، ويُقدَّم غالبًا على أنه أكبر مسجد في اليابان.'],
  ['هل في مطارات طوكيو غرف صلاة؟', 'نعم، في مطاري ناريتا وهانيدا.'],
  ['ما الفرق بين «حلال» و«مناسب للمسلمين»؟', '«حلال» يعني أن المطعم حاصل على شهادة. «Muslim friendly» يعني بلا لحم خنزير ولا كحول في الأطباق، لكن بلا شهادة. اسأل دائمًا إن كان عندك شكّ.'],
]

function arHalal() {
  const corps = `${hero('ar', 'tokyo-camii', 'جامع طوكيو', `<p class="etiket"><a href="/ar/tokyo/">إيهاب</a> · حلال</p>
<h1>طعام حلال ومساجد في طوكيو</h1>
<p class="alt">أين تصلّي، وأين تأكل حلال، وكيف نبني اليوم حول أوقات الصلاة.</p>`)}
<div class="kap">
<p class="cevap">أشهر مسجد في طوكيو هو جامع طوكيو (Tokyo Camii) على الطراز العثماني، على بعد خمس دقائق مشيًا تقريبًا من محطة يويوغي-أويهارا (خطّا أوداكيو وتشيودا). ومسجد أوتسوكا، مقرّ Japan Islamic Trust، على بعد خمس دقائق تقريبًا من محطة أوتسوكا على خط JR ياماناتي. وفي مطاري ناريتا وهانيدا غرف للصلاة، وفي طوكيو مطاعم حلال كثيرة.</p>
<h2>المساجد</h2>
<table><tr><th>المسجد</th><th>الوصول</th><th>معلومة</th></tr>
<tr><td>جامع طوكيو والمركز الثقافي التركي</td><td>1-19 Oyama-cho, Shibuya-ku، نحو 5 دقائق من محطة Yoyogi-Uehara</td><td>يستقبل الزوار خارج أوقات الصلاة؛ المواقيت على موقعه الرسمي.</td></tr>
<tr><td>مسجد أوتسوكا (Japan Islamic Trust)</td><td>Minami-Otsuka, Toshima-ku، نحو 5 دقائق من محطة Otsuka</td><td>تُقام فيه صلاة الجمعة.</td></tr></table>
<h2>كيف تجد طعامًا حلالًا؟</h2>
<p>ابحث عن كلمة «Halal» (مطعم حاصل على شهادة) أو «Muslim friendly» (بلا خنزير ولا كحول، بلا شهادة)، واسأل عند الشكّ. المطاعم الحلال كثيرة حول المحطات الكبرى والأحياء السياحية.</p>
<p>إيهاب مسلم ويتكلّم العربية: يخطّط اليوم حول أوقات الصلاة، ويختار مطاعم حلال أو مناسبة للمسلمين، ويترجم لك في المطعم إن احتجت.</p>
<h2>أسئلة شائعة</h2>
${faqHTML(AR_FAQ_HALAL)}
<p class="kaynak">المصادر: <a href="https://tokyocamii.org/" rel="nofollow">Tokyo Camii</a> · <a href="https://www.islam.or.jp/" rel="nofollow">Japan Islamic Trust</a></p>
<p><a class="btn" href="${L.ar.waGenel}">اكتب لإيهاب على واتساب</a></p>
</div>`
  return ecrire('ar/tokyo/halal-masajid', page({ lang: 'ar', ruta: '/ar/tokyo/halal-masajid/', alterna: 'halal',
    titre: 'طعام حلال ومساجد في طوكيو: جامع طوكيو ومسجد أوتسوكا | إيهاب',
    desc: 'الصلاة والأكل الحلال في طوكيو: جامع طوكيو في يويوغي-أويهارا، مسجد أوتسوكا، غرف الصلاة في المطارات، وكيف تجد مطعمًا حلالًا. مع إيهاب، مرشد عربي مسلم.',
    image: imageDe('tokyo-camii'), jsonld: [faqLd(AR_FAQ_HALAL)], corps }))
}

const AR_FAQ_ANIME = [
  ['أين أشتري بطاقات بوكيمون في طوكيو؟', 'البطاقات الجديدة (العلب والأظرف) في مراكز بوكيمون الرسمية، والبطاقات المفردة الجديدة أو المستعملة في المحلات المتخصّصة في أكيهابارا وناكانو وإيكيبوكورو. اشترِ من محل بفاتورة، وافحص كل بطاقة غالية.'],
  ['هل البطاقات اليابانية مثل البطاقات الإنجليزية أو الفرنسية؟', 'لا. النصوص باليابانية، وبعض الإصدارات تخرج في اليابان أولًا، وغالبًا لا تُقبل في البطولات الرسمية خارج اليابان. للمجموعة هي مطلوبة جدًا.'],
  ['كيف أحجز مقهى بوكيمون؟', 'بالحجز فقط، على الموقع الرسمي. المواعيد تُفتح الساعة 18:00 بتوقيت اليابان، وتنفد بسرعة كبيرة.'],
  ['كيف أشتري تذاكر متحف جيبلي؟', 'لا تُباع في المتحف. تُطرح تذاكر كل شهر يوم 10 من الشهر السابق الساعة 10:00 بتوقيت اليابان على Lawson Ticket.'],
]

function arAnime() {
  const lugares = [
    ['akihabara', 'أكيهابارا', 'أكيهابارا', 'البطاقات، المجسّمات، الألعاب القديمة، وكل ما يخصّ الأنمي.'],
    ['nakano-broadway', 'ناكانو برودواي', 'ناكانو برودواي', 'مركز تجاري للهواة والمجمّعين، وفيه محلات Mandarake.'],
    ['sunshine-city', 'صن شاين سيتي في إيكيبوكورو', 'إيكيبوكورو', 'مركز بوكيمون ميغا طوكيو في صن شاين سيتي، ومحلات Animate.'],
    ['shibuya-parco', 'مركز شيبويا PARCO', 'شيبويا PARCO', 'الطابق السادس: Nintendo TOKYO ومركز بوكيمون شيبويا وJump Shop وCapcom Store.'],
    ['takashimaya-nihonbashi', 'تاكاشيمايا نيهونباشي', 'مقهى بوكيمون', 'في مركز بوكيمون طوكيو DX في نيهونباشي، بالحجز فقط.'],
    ['inokashira', 'حديقة إينوكاشيرا', 'متحف جيبلي', 'في ميتاكا قرب حديقة إينوكاشيرا، بتذاكر محجوزة مسبقًا.'],
  ]
  const corps = `${hero('ar', 'akihabara', 'أكيهابارا', `<p class="etiket"><a href="/ar/tokyo/">إيهاب</a> · أنمي</p>
<h1>طوكيو الأنمي وبطاقات بوكيمون، مع خبير</h1>
<p class="alt">إيهاب محترف في الأنمي وثقافة البوب اليابانية وبطاقات بوكيمون. يوم كامل في عالمك المفضّل، بالعربية.</p>
<p><a class="btn" href="${L.ar.waGenel}">احجز يوم الأنمي</a></p>`)}
<div class="kap">
<p class="cevap">يوم الأنمي النموذجي يربط ثلاثة أحياء بالقطار: أكيهابارا (بطاقات، مجسّمات، ألعاب فيديو)، وناكانو برودواي (مركز المجمّعين مع Mandarake)، وإيكيبوكورو (Animate ومركز بوكيمون ميغا طوكيو). ويُضاف متحف جيبلي ومقهى بوكيمون بالحجز المسبق. جولة خاصة بالعربية، والسعر حسب المجموعة على واتساب.</p>
<ul class="izgara">${lugares.map(([k, alt, t, p]) => carte('ar', k, alt, t, p)).join('')}</ul>
<h2>مراكز بوكيمون في طوكيو</h2>
<ul class="ozet"><li>مركز بوكيمون ميغا طوكيو (صن شاين سيتي، إيكيبوكورو).</li><li>مركز بوكيمون طوكيو DX مع مقهى بوكيمون (تاكاشيمايا، نيهونباشي).</li><li>مركز بوكيمون شيبويا (شيبويا PARCO).</li><li>مركز بوكيمون سكاي تري تاون (سولاماتشي، أوشياغي).</li><li>متجر بوكيمون في محطة طوكيو.</li></ul>
<h2>نصائح إيهاب لشراء البطاقات</h2>
<ol class="adimlar"><li>اشترِ من محل حقيقي يعطيك فاتورة: أفضل حماية من البطاقات المزيّفة.</li><li>افحص كل بطاقة غالية قبل الدفع.</li><li>احتفظ بالفواتير لاسترداد الضريبة عند المغادرة.</li><li>اشترِ للمجموعة والمتعة، لا كاستثمار.</li></ol>
<h2>أسئلة شائعة</h2>
${faqHTML(AR_FAQ_ANIME)}
<p><a class="btn" href="${L.ar.waGenel}">اكتب لإيهاب على واتساب</a></p>
</div>`
  return ecrire('ar/tokyo/anime-pokemon', page({ lang: 'ar', ruta: '/ar/tokyo/anime-pokemon/', alterna: 'anime',
    titre: 'أنمي وبطاقات بوكيمون في طوكيو مع مرشد عربي: إيهاب',
    desc: 'جولة أنمي وبوكيمون في طوكيو بالعربية: أكيهابارا، ناكانو برودواي، إيكيبوكورو، مراكز بوكيمون، مقهى بوكيمون ومتحف جيبلي. مع إيهاب، خبير بطاقات بوكيمون.',
    image: imageDe('akihabara'), jsonld: [faqLd(AR_FAQ_ANIME)], corps }))
}

const AR_FAQ_WAKALAT = [
  ['هل يعمل إيهاب مع وكالات السفر؟', 'نعم. يرشد عملاء الوكالات ومنظّمي الرحلات في طوكيو وحولها بالعربية والفرنسية والإنجليزية، ويتعاقد مع الوكالات مباشرة.'],
  ['هل يساعد في النقل والفنادق؟', 'يصلكم بشركاء محليين مرخّصين للنقل (سيارات خاصة وحافلات) والفنادق والمطاعم الحلال، وينسّق معهم يوم الجولة.'],
  ['هل يمكنه ربطنا بوكالات أخرى في اليابان؟', 'نعم. يعرف وكالات ومرشدين في اليابان ويمكنه أن يعرّفكم بهم حسب حاجتكم، وفي كيوتو وأوساكا يتولّى فريق Tony Kansai Guide.'],
  ['كم سعر الوكالات؟', 'يُرسَل سعر الوكالات والتوفّر عند الطلب، على واتساب.'],
]

function arWakalat() {
  const corps = `${hero('ar', 'shibuya', 'شيبويا', `<p class="etiket"><a href="/ar/tokyo/">إيهاب</a> · للوكالات</p>
<h1>وكالات السفر: شريككم على الأرض في اليابان</h1>
<p class="alt">مرشد مسلم بالعربية والفرنسية والإنجليزية، يتعاقد معكم ويصلكم بالنقل والفنادق والمطاعم الحلال ووكالات أخرى.</p>
<p><a class="btn" href="${L.ar.waAgence}">تواصل كوكالة</a></p>`)}
<div class="kap">
<p class="cevap">نعم، إيهاب يعمل مع وكالات السفر. هو مرشد تونسي مسلم يعيش في اليابان، ضمن فريق Tony Kansai Guide، ويرشد عملاء الوكالات في طوكيو وكانتو وحول جبل فوجي وفي شيزوكا وناغانو. يعرف السوق المحلي جيدًا: يصلكم بشركاء للنقل والفنادق والمطاعم الحلال، وبوكالات ومرشدين آخرين، وينسّق كل شيء يوم الجولة. سعر الوكالات عند الطلب على واتساب: <span dir="ltr">${WA_VISIBLE}</span>.</p>
<h2>ما نقدّمه للوكالات</h2>
<ul class="izgara">
${carte('ar', 'tokyo-camii', 'جامع طوكيو', 'برامج للمسلمين', 'وجبات حلال، وقفات للصلاة، صلاة الجمعة، وبلا معابد. مثالي لعملاء الخليج والمغرب العربي.')}
${carte('ar', 'akihabara', 'أكيهابارا', 'رحلات أنمي ومانغا', 'خبير أنمي وبطاقات بوكيمون للجزء الطوكيوي من رحلات الأنمي.')}
${carte('ar', 'narita', 'مطار ناريتا', 'تنسيق على الأرض', 'التنسيق مع شركاء النقل المرخّصين (سيارات، حافلات) والفنادق والمطاعم.')}
${carte('ar', 'yokohama', 'يوكوهاما', 'شبكة شركاء', 'تعريفكم بوكالات ومرشدين آخرين في اليابان حسب حاجتكم، وكانساي مع فريق توني.')}
</ul>
<h2>كيف نعمل معًا</h2>
<ol class="adimlar"><li>أرسلوا التواريخ وعدد المسافرين والبرنامج على واتساب.</li><li>نؤكّد التوفّر وسعر الوكالات وما يحتاجه البرنامج من نقل وغيره.</li><li>اتفاق تعاون واضح مع وكالتكم.</li><li>إيهاب يستقبل عملاءكم وينسّق اليوم كاملًا.</li></ol>
<h2>أسئلة شائعة</h2>
${faqHTML(AR_FAQ_WAKALAT)}
<p><a class="btn" href="${L.ar.waAgence}">تواصل كوكالة على واتساب</a></p>
</div>`
  return ecrire('ar/tokyo/wakalat', page({ lang: 'ar', ruta: '/ar/tokyo/wakalat/', alterna: 'agencias',
    titre: 'شريك وكالات السفر في اليابان: مرشد عربي مسلم في طوكيو | إيهاب',
    desc: 'للوكالات ومنظّمي الرحلات: إيهاب مرشد مسلم بالعربية والفرنسية والإنجليزية في طوكيو، يتعاقد معكم ويصلكم بالنقل والفنادق والمطاعم الحلال ووكالات أخرى. السعر عند الطلب.',
    image: imageDe('shibuya'), jsonld: [faqLd(AR_FAQ_WAKALAT)], corps }))
}

// ———————————————————————— INGLÉS (público americano) ————————————————————————
const EN_FAQ = [
  ['Is there an anime and Pokémon tour guide in Tokyo?', `Yes. Iheb, who lives in Japan, is a professional in anime, Japanese pop culture and Pokémon card collecting, and runs private tours in English (also French and Arabic) in Tokyo and around. Book on WhatsApp: ${WA_VISIBLE}.`],
  ['Where can I buy Pokémon cards in Tokyo?', 'Sealed products (booster packs, boxes, accessories) at the official Pokémon Centers; single cards, new or used, at specialist shops in Akihabara, Nakano and Ikebukuro. Buy in a real shop that gives you a receipt and check every expensive card before paying.'],
  ['Can I use Japanese Pokémon cards in tournaments back home?', 'Usually not: Japanese-language cards are generally not allowed in official tournaments outside Japan. For collecting, they are hugely popular. Check the current rules before you buy for play.'],
  ['How do I get into the Pokémon Café?', 'Reservation only, on the official website. Slots open at 6 pm Japan time and sell out very fast.'],
  ['How do I get Ghibli Museum tickets?', 'They are not sold at the museum. Tickets for each month go on sale on the 10th of the previous month at 10 am Japan time on Lawson Ticket.'],
  ['How much does the tour cost?', 'It depends on group size, length and places. Iheb sends you a price on WhatsApp once he knows your plan.'],
  ['Is it family friendly?', 'Yes. It is a private tour just for your family, at your pace. Halal-friendly meals and prayer breaks can be added for Muslim travelers.'],
]

function enPortada() {
  const lugares = [
    ['akihabara', 'Akihabara, Tokyo', 'Akihabara', 'Card shops, figures, retro and new video games: the heart of otaku Tokyo.'],
    ['nakano-broadway', 'Nakano Broadway', 'Nakano Broadway', 'A mall for collectors, home to the Mandarake stores.'],
    ['sunshine-city', 'Sunshine City, Ikebukuro', 'Ikebukuro', 'Pokémon Center Mega Tokyo in Sunshine City, plus Animate.'],
    ['shibuya-parco', 'Shibuya PARCO', 'Shibuya PARCO, 6F', 'Nintendo TOKYO, Pokémon Center Shibuya, Jump Shop and Capcom Store on one floor.'],
    ['takashimaya-nihonbashi', 'Takashimaya Nihonbashi', 'Pokémon Café', 'Inside Pokémon Center Tokyo DX in Nihonbashi. Reservation only.'],
    ['inokashira', 'Inokashira Park', 'Ghibli Museum', 'In Mitaka by Inokashira Park, with tickets booked in advance.'],
    ['kawaguchiko-fuji', 'Mount Fuji and Lake Kawaguchi', 'Mt. Fuji day trip', 'Fuji reflected in Lake Kawaguchi on clear days: the classic side quest.'],
    ['kamakura-kokomae', 'Kamakura-Kokomae railway crossing', 'Real anime locations', 'The famous seaside railway crossing from a basketball anime, and more.'],
  ]
  const corps = `${hero('en', 'akihabara', 'Akihabara at night', `<p class="etiket">Tokyo · Anime · Pokémon</p>
<h1>Your Tokyo anime &amp; Pokémon quest, with a real expert</h1>
<p class="alt">Private tours in English with Iheb: card shops he actually knows, Pokémon Centers, Nintendo TOKYO, Ghibli and Mt. Fuji. Just your group, at your pace.</p>
<p><a class="btn" href="${L.en.waGenel}">Message Iheb on WhatsApp</a></p>`)}
<div class="kap">
<div class="serit" aria-hidden="true"><div><span><i>★</i>Akihabara</span><span><i>★</i>Pokémon cards</span><span><i>★</i>Nakano Broadway</span><span><i>★</i>Retro games</span><span><i>★</i>Ikebukuro</span><span><i>★</i>Nintendo TOKYO</span><span><i>★</i>Gundam</span><span><i>★</i>Mt. Fuji</span><span><i>★</i>Akihabara</span><span><i>★</i>Pokémon cards</span><span><i>★</i>Nakano Broadway</span><span><i>★</i>Retro games</span><span><i>★</i>Ikebukuro</span><span><i>★</i>Nintendo TOKYO</span><span><i>★</i>Gundam</span><span><i>★</i>Mt. Fuji</span></div></div>
<ul class="rozetler"><li>English</li><li>Français</li><li>العربية</li><li>Pokémon cards</li><li>Anime</li><li>Retro games</li><li>Families</li><li>Halal-friendly</li></ul>
<p class="cevap">Yes, you can explore Tokyo’s anime and Pokémon world with a specialist guide: Iheb, who lives in Japan, is a professional in anime, Japanese pop culture and Pokémon card collecting. A typical day links three neighborhoods by train: Akihabara (cards, figures, video games), Nakano Broadway (the collectors’ mall, with Mandarake) and Ikebukuro (Animate and Pokémon Center Mega Tokyo). Ghibli Museum, the Pokémon Café and real anime locations can be added with reservations or as a day trip. Private tour; price per group on WhatsApp: ${WA_VISIBLE}.</p>
<section class="guide"><div>${cartaIheb('en')}</div><div>
<h2>Why go with Iheb?</h2>
<ul class="ozet">
<li><strong>He knows the cards:</strong> which shops are worth it, how Japanese sets differ, and how to avoid fakes.</li>
<li><strong>No wasted time:</strong> the right floor, the right shop, the right train between them.</li>
<li><strong>Private:</strong> just your family or friends, never mixed with strangers.</li>
<li><strong>Three languages:</strong> English, French and Arabic.</li>
<li><strong>Made for international fans:</strong> whether you fly in from the US, Canada, the UK or India, or from Switzerland or the Netherlands, the day is planned and explained in clear English.</li>
</ul>
<p><a class="btn" href="${L.en.waGenel}">Plan my day</a></p></div></section>
<h2>Pick your path</h2>
<ul class="izgara">
${carte('en', 'super-potato', 'Super Potato retro games', 'The otaku guide', 'Every district, shop rule and anime location explained.', '/en/tokyo-anime-guide/otaku-guide/')}
${carte('en', 'akihabara-rue', 'Akihabara street', 'Akihabara', 'Card towers, figures and retro games: a half-day plan.', '/en/tokyo-anime-guide/akihabara/')}
${carte('en', 'nakano-broadway', 'Nakano Broadway', 'Nakano Broadway', 'The collectors’ mall and its Mandarake shops, floor by floor.', '/en/tokyo-anime-guide/nakano-broadway/')}
${carte('en', 'sunshine-city', 'Sunshine City, Ikebukuro', 'Ikebukuro', 'Animate, Otome Road and Pokémon Center Mega Tokyo.', '/en/tokyo-anime-guide/ikebukuro/')}
${carte('en', 'kawaguchiko-fuji', 'Mount Fuji and Lake Kawaguchi', 'Day trips', 'Mt. Fuji, Hakone or the coast, one per day.', '/en/tokyo-anime-guide/day-trips/')}
${carte('en', 'shibuya', 'Shibuya crossing', 'Itineraries', 'Tokyo in 3, 5 or 7 days: anime, city and Fuji.', '/en/tokyo-anime-guide/tokyo-itinerary/')}
${carte('en', 'kawaguchiko-sakura', 'Mount Fuji with cherry blossoms', 'First time in Japan', 'A calm private tour for first-timers and seniors, everything explained.', '/en/tokyo-anime-guide/first-time-japan/')}
${carte('en', 'tokyo-camii', 'Tokyo Camii', 'Muslim travelers', 'Halal-friendly food and prayer breaks built into the day.', '/en/muslim-guide-tokyo/')}
${carte('en', 'shibuya', 'Shibuya crossing', 'Travel agencies', 'Ground partner in English, French and Arabic.', '/en/tokyo-anime-guide/travel-agencies/')}
</ul>
<h2>Your quest map</h2>
<ul class="izgara">${lugares.map(([k, alt, t, p]) => carte('en', k, alt, t, p)).join('')}</ul>
<h2>A sample quest day</h2>
<ol class="adimlar">
<li><strong>Morning, Akihabara:</strong> card shops, figures and retro games.</li>
<li><strong>Lunch:</strong> ramen, sushi or a halal-friendly spot, your call.</li>
<li><strong>Afternoon, Shibuya PARCO:</strong> Nintendo TOKYO and Pokémon Center Shibuya.</li>
<li><strong>Evening, Ikebukuro:</strong> Pokémon Center Mega Tokyo and Animate.</li>
</ol>
<p class="kaynak">Every day is built around your group; this is just an example.</p>
<h2>Iheb’s card-buying rules</h2>
<ul class="ozet"><li>Buy in a real shop that gives a receipt: the best protection against fakes.</li><li>Inspect every expensive card before paying.</li><li>Keep your receipts for the tax refund when you leave Japan.</li><li>Buy to collect and enjoy, not as an investment.</li></ul>
</div>
<section class="bant"><div class="kap">
<h2>Travel agencies: your ground partner in Japan</h2>
<p>Iheb works under contract with agencies, guides your clients in English, French and Arabic, and connects you with licensed local partners for transport, hotels, halal restaurants and other agencies.</p>
<p><a class="btn" href="/en/tokyo-anime-guide/travel-agencies/">Work with Iheb</a></p>
</div></section>
<div class="kap">
<h2>FAQ</h2>
${faqHTML(EN_FAQ)}
<p>Pokémon is a trademark of Nintendo, Creatures and GAME FREAK. This is an independent private tour, not affiliated with them.</p>
<p><a class="btn" href="${L.en.waGenel}">Message Iheb on WhatsApp</a></p>
</div>`
  return ecrire('en/tokyo-anime-guide', page({ lang: 'en', ruta: '/en/tokyo-anime-guide/', alterna: 'portada',
    titre: 'Tokyo Anime & Pokémon Tour Guide: Iheb | Private Tours in English',
    desc: 'Private anime and Pokémon tour in Tokyo with Iheb, a Pokémon card and pop-culture expert: Akihabara, Nakano Broadway, Pokémon Centers, Nintendo TOKYO, Ghibli, Mt. Fuji. Price on WhatsApp.',
    image: imageDe('akihabara'), jsonld: [faqLd(EN_FAQ)], corps }))
}

const EN_FAQ_AG = [
  ['Does Iheb work with travel agencies?', 'Yes. He guides agency and tour-operator clients in Tokyo and around in English, French and Arabic, and works with agencies under a direct agreement.'],
  ['Can he help with transport and hotels?', 'He connects you with licensed local partners for transport (private vehicles and coaches), hotels and halal restaurants, and coordinates them on the day.'],
  ['Can he connect us with other agencies in Japan?', 'Yes. He knows agencies and guides in Japan and can introduce you to the right ones. In Kyoto and Osaka, the Tony Kansai Guide team takes over.'],
  ['What is the agency rate?', 'Agency rates and availability are sent on request, on WhatsApp.'],
]

function enAgencias() {
  const corps = `${hero('en', 'shibuya', 'Shibuya crossing', `<p class="etiket"><a href="/en/tokyo-anime-guide/">Iheb</a> · For agencies</p>
<h1>Travel agencies: your ground partner in Japan</h1>
<p class="alt">A guide in English, French and Arabic who works under contract with you and connects you with transport, hotels, halal restaurants and other agencies.</p>
<p><a class="btn" href="${L.en.waAgence}">Contact as an agency</a></p>`)}
<div class="kap">
<p class="cevap">Yes, Iheb works with travel agencies. He lives in Japan, is part of the Tony Kansai Guide team, and guides agency clients in Tokyo, the Kanto region, around Mount Fuji and in Shizuoka and Nagano. He knows the local market: he connects you with licensed partners for transport, hotels and halal restaurants, introduces you to other agencies and guides, and coordinates everything on the day. Agency rates on request on WhatsApp: ${WA_VISIBLE}.</p>
<h2>What we offer agencies</h2>
<ul class="izgara">
${carte('en', 'akihabara', 'Akihabara', 'Anime & manga tours', 'A Pokémon card and anime expert for the Tokyo leg of your pop-culture tours.')}
${carte('en', 'tokyo-camii', 'Tokyo Camii', 'Muslim-friendly programs', 'Halal meals, prayer breaks and Friday prayer, for clients from the Gulf, North Africa and beyond.')}
${carte('en', 'narita', 'Narita Airport', 'Ground coordination', 'Coordination with licensed transport partners (cars, coaches), hotels and restaurants.')}
${carte('en', 'yokohama', 'Yokohama', 'Partner network', 'Introductions to other agencies and guides in Japan; Kansai with Tony’s team.')}
</ul>
<p>Serving Gulf (GCC) clients? See <a href="/en/arabic-speaking-guide-tokyo/">Arabic-speaking guide for GCC agencies</a>.</p>
<h2>How we work together</h2>
<ol class="adimlar"><li>Send dates, group size and the program on WhatsApp.</li><li>We confirm availability, the agency rate and any transport needed.</li><li>A clear cooperation agreement with your agency.</li><li>Iheb meets your clients and runs the day.</li></ol>
<h2>FAQ</h2>
${faqHTML(EN_FAQ_AG)}
<p><a class="btn" href="${L.en.waAgence}">Contact as an agency on WhatsApp</a></p>
</div>`
  return ecrire('en/tokyo-anime-guide/travel-agencies', page({ lang: 'en', ruta: '/en/tokyo-anime-guide/travel-agencies/', alterna: 'agencias',
    titre: 'Japan Ground Partner for Travel Agencies: Tokyo Guide in English, French & Arabic | Iheb',
    desc: 'For travel agencies and tour operators: Iheb guides your clients in Tokyo in English, French and Arabic, works under contract and connects you with licensed transport, hotels, halal restaurants and other agencies.',
    image: imageDe('shibuya'), jsonld: [faqLd(EN_FAQ_AG)], corps }))
}

// ———— 5-11-2026: tres páginas más para el público que paga bien y habla inglés o francés ————
// Otakus americanos (guía completa), gente mayor y primerizos (todo explicado, ritmo cómodo)
// y francófonos de Québec/Canadá. Solo datos generales verificables de Japón; nada inventado de Iheb.

const EN_FAQ_OTAKU = [
  ['What is the best area in Tokyo for anime fans?', 'Akihabara is the classic start (cards, figures, retro games). Collectors also love Nakano Broadway, and Ikebukuro is the hub for anime goods, Animate and Otome Road. Most fans need at least one full day for these three.'],
  ['Can I take photos inside anime and card shops?', 'Often not. Many shops in Akihabara and Nakano ban photos of their display cases. Look for the sign or ask first; Iheb tells you shop by shop.'],
  ['Is tax-free shopping available for tourists?', 'Yes, at shops that display the Tax-Free sign: bring your passport, keep the receipts and do not open the goods before you leave Japan, because the refund is processed on departure.'],
  ['How do I get big purchases home?', 'Many shops pack figures well; for large boxes you can send them home by Japan Post (EMS) or forward your suitcase to the airport with a luggage delivery service.'],
  ['When is Comiket?', 'Comic Market is usually held twice a year, in August and December, at Tokyo Big Sight. It is huge and very crowded; check the official dates first.'],
]

function enOtaku() {
  const barrios = [
    ['akihabara-rue', 'Akihabara street', 'Akihabara', 'Card shops on every floor, figure towers, capsule toys and arcades. Best on a weekday morning, before the crowds.', '/en/tokyo-anime-guide/akihabara/'],
    ['super-potato', 'Super Potato, Akihabara', 'Retro games', 'Floors of classic consoles and cartridges, from the 8-bit era to the 2000s, plus a small retro arcade.'],
    ['nakano-broadway', 'Nakano Broadway', 'Nakano Broadway', 'The collectors’ mall: rare figures, vintage toys, manga and cards, many in Mandarake shops.', '/en/tokyo-anime-guide/nakano-broadway/'],
    ['sunshine-city', 'Sunshine City, Ikebukuro', 'Ikebukuro', 'Pokémon Center Mega Tokyo, the huge Animate flagship and Otome Road, the street for anime goods aimed at women fans.', '/en/tokyo-anime-guide/ikebukuro/'],
    ['shibuya-parco', 'Shibuya PARCO', 'Shibuya PARCO 6F', 'Nintendo TOKYO, Pokémon Center Shibuya, Jump Shop and Capcom Store on one floor.'],
    ['character-street', 'Tokyo Character Street', 'Tokyo Station', 'Character Street: dozens of official character shops underground at Tokyo Station. Perfect on arrival or departure day.'],
    ['odaiba', 'Odaiba', 'Odaiba', 'The life-size Unicorn Gundam statue was retired on 31 August 2026; The Gundam Base Tokyo at DiverCity remains, with Tokyo Bay views.'],
    ['big-sight', 'Tokyo Big Sight', 'Tokyo Big Sight', 'Home of Comic Market and big anime and game events. Check the event calendar for your dates.'],
    ['yotsugi', 'Yotsugi, Katsushika', 'Yotsugi', 'The neighborhood of a famous soccer manga, with character statues around the station area.'],
  ]
  const peregrinaje = [
    ['kamakura-kokomae', 'Kamakura-Kokomae crossing', 'Kamakura-Kokomae', 'The seaside railway crossing from a legendary basketball anime. Go early: it gets busy, and locals live here.'],
    ['fumotoppara', 'Fumotoppara campsite', 'Fumotoppara', 'The Mt. Fuji campsite from a hit camping anime, a day trip from Tokyo by car.'],
    ['awashima', 'Awashima, Numazu', 'Numazu', 'Seaside Numazu in Shizuoka, the setting of a well-known idol anime series.'],
  ]
  const corps = `${hero('en', 'akihabara-rue', 'Akihabara street', `<p class="etiket"><a href="/en/tokyo-anime-guide/">Iheb</a> · The otaku guide</p>
<h1>The complete otaku guide to Tokyo</h1>
<p class="alt">Every anime, manga, card and retro-game district explained: what each one is for, when to go, the shop rules nobody tells you, and how to get it all home.</p>
<p><a class="btn" href="${L.en.waGenel}">Plan my otaku day with Iheb</a></p>`)}
<div class="kap">
<p class="cevap">The best otaku areas in Tokyo are Akihabara (cards, figures, retro games), Nakano Broadway (rare collectibles) and Ikebukuro (Animate, Pokémon Center Mega Tokyo, Otome Road). Add Shibuya PARCO for Nintendo TOKYO, Tokyo Station’s Character Street, and The Gundam Base Tokyo in Odaiba. Iheb, a pop-culture and Pokémon card specialist who lives in Japan, plans the order, the trains and the shops for your group.</p>
<div class="serit" aria-hidden="true"><div><span><i>★</i>Figures</span><span><i>★</i>Manga</span><span><i>★</i>Trading cards</span><span><i>★</i>Capsule toys</span><span><i>★</i>Arcades</span><span><i>★</i>Anime goods</span><span><i>★</i>Retro consoles</span><span><i>★</i>Figures</span><span><i>★</i>Manga</span><span><i>★</i>Trading cards</span><span><i>★</i>Capsule toys</span><span><i>★</i>Arcades</span><span><i>★</i>Anime goods</span><span><i>★</i>Retro consoles</span></div></div>
<h2>The districts, one by one</h2>
<ul class="izgara">${barrios.map(([k, alt, t, p, h]) => carte('en', k, alt, t, p, h)).join('')}</ul>
<h2>Real anime locations (day trips)</h2>
<ul class="izgara">${peregrinaje.map(([k, alt, t, p]) => carte('en', k, alt, t, p)).join('')}</ul>
<h2>Shop rules nobody tells you</h2>
<ul class="ozet">
<li><strong>Photos:</strong> many shops ban photos of their cases. Look for the sign, or ask.</li>
<li><strong>Floors:</strong> the best shops are often on the 4th floor and up. The ground floor is the tourist floor.</li>
<li><strong>Cash:</strong> most big shops take cards, but small stalls and capsule machines need cash and coins.</li>
<li><strong>Tax-free:</strong> bring your passport, keep every receipt, and keep goods sealed until you leave Japan.</li>
<li><strong>Carry less:</strong> leave bags in a station coin locker and shop with your hands free.</li>
<li><strong>Getting it home:</strong> post big boxes home by EMS, or send your suitcase to the airport.</li>
</ul>
<h2>Who comes with Iheb</h2>
<ol class="adimlar">
<li><strong>Serious collectors</strong> hunting Japanese Pokémon cards, vintage figures or retro games.</li>
<li><strong>Families</strong> with kids who love Pokémon, Nintendo and anime, at a kid-friendly pace.</li>
<li><strong>First-timers</strong> who want the whole otaku world in one well-planned day.</li>
<li><strong>Muslim fans:</strong> halal-friendly lunches and prayer breaks built into the day.</li>
</ol>
<h2>FAQ</h2>
${faqHTML(EN_FAQ_OTAKU)}
<p>Pokémon is a trademark of Nintendo, Creatures and GAME FREAK; Gundam and other names belong to their owners. This is an independent private tour, not affiliated with them.</p>
<p><a class="btn" href="${L.en.waGenel}">Message Iheb on WhatsApp</a></p>
</div>`
  return ecrire('en/tokyo-anime-guide/otaku-guide', page({ lang: 'en', ruta: '/en/tokyo-anime-guide/otaku-guide/', alterna: 'otaku',
    titre: 'The Complete Otaku Guide to Tokyo: Akihabara, Nakano, Ikebukuro & More | Iheb',
    desc: 'Every otaku district in Tokyo explained: Akihabara, Nakano Broadway, Ikebukuro, Shibuya PARCO, Character Street, Gundam Base, Big Sight, anime locations. Shop rules, tax-free, shipping home. Private guide in English.',
    image: imageDe('akihabara-rue'), jsonld: [faqLd(EN_FAQ_OTAKU)], corps }))
}

const EN_FAQ_PRIMERA = [
  ['Is Japan easy for older travelers?', 'Yes, with good planning. Japan is very safe and clean, and most stations have elevators. The hard parts are long walks inside big stations, stairs at some exits and crowded rush hours, which a private guide plans around.'],
  ['Do I need to tip in Japan?', 'No. Tipping is not part of the culture, in restaurants, taxis or hotels. Good service is included.'],
  ['Cash or card?', 'Cards work in most hotels, department stores and chains, but small restaurants and shops may be cash only. Convenience-store ATMs (7-Eleven, for example) accept most foreign cards.'],
  ['How do I move my luggage between cities?', 'Use a luggage delivery service (takkyubin): your hotel sends your suitcase to the next hotel or the airport, usually the next day, so you travel light.'],
  ['Can we use a private car instead of trains?', 'Yes. For a more comfortable day, Iheb can arrange a private vehicle with a driver through licensed local partners. Price on request.'],
  ['Do Americans and Canadians need a visa?', 'For short tourist stays, US and Canadian passport holders currently do not need a visa (up to 90 days). Check the official rules before you fly.'],
]

function enPrimera() {
  const corps = `${hero('en', 'kawaguchiko-sakura', 'Mount Fuji with cherry blossoms at Lake Kawaguchi', `<p class="etiket"><a href="/en/tokyo-anime-guide/">Iheb</a> · First time in Japan</p>
<h1>Japan, explained. A calm private tour for first-timers and seniors</h1>
<p class="alt">Tokyo and Mt. Fuji at your pace: fewer stairs, real breaks, a private car if you prefer, and someone who explains every detail before you need to ask.</p>
<p><a class="btn" href="${L.en.waGenel}">Ask Iheb a question</a></p>`)}
<div class="kap">
<p class="cevap">Yes, Japan is a very comfortable country for older and first-time travelers, if the day is planned around walking and crowds. With Iheb, a private English-speaking guide who lives in Japan, you set the pace: later starts, elevators instead of stairs, sit-down breaks and lunch, and a private car with a driver (through licensed partners) when trains are too much. Everything, from paying to bowing, is explained on the way.</p>
<h2>How a comfortable day works</h2>
<ol class="adimlar">
<li><strong>Start after 9:30 am</strong>, after the commuter rush, with pickup at your hotel.</li>
<li><strong>One or two areas per day</strong>, not five. Quality over rushing.</li>
<li><strong>Breaks you can count on:</strong> a café, a bench with a view, a long sit-down lunch.</li>
<li><strong>Elevators and taxis</strong> when they make sense; a private car for Mt. Fuji.</li>
</ol>
<h2>Where we can take you</h2>
<ul class="izgara">
${carte('en', 'palais-imperial', 'Imperial Palace East Gardens', 'Imperial Palace gardens', 'Flat paths, wide lawns and Tokyo’s history, right in the center.')}
${carte('en', 'tsukiji', 'Tsukiji outer market', 'Tsukiji outer market', 'Street food and fresh seafood stalls, best in the morning.')}
${carte('en', 'skytree', 'Tokyo Skytree', 'Tokyo Skytree', 'The whole city from above, by fast elevator. On clear days, Fuji too.')}
${carte('en', 'kawaguchiko-fuji', 'Mount Fuji and Lake Kawaguchi', 'Mt. Fuji by private car', 'Lake Kawaguchi and the Fuji views, with no transfers to worry about.')}
${carte('en', 'oshino-hakkai', 'Oshino Hakkai', 'Oshino Hakkai', 'Crystal-clear spring ponds in a village at the foot of Fuji.')}
${carte('en', 'yokohama', 'Yokohama', 'Yokohama', 'The harbor, Chinatown and the bayfront, an easy half day from Tokyo.')}
</ul>
<h2>Japan in ten short lessons</h2>
<table class="dersler">
<tr><th>Topic</th><th>What to know</th></tr>
<tr><td>Tipping</td><td>Not done. Leaving money can confuse staff.</td></tr>
<tr><td>Paying</td><td>Put cash or card in the small tray at the counter, not in the hand.</td></tr>
<tr><td>Trains</td><td>Quiet cars: no phone calls, speak softly. Priority seats are near the doors.</td></tr>
<tr><td>Train card</td><td>An IC card (Suica or PASMO) or your phone, tapped at the gate. No tickets to figure out.</td></tr>
<tr><td>Shoes</td><td>Off in some restaurants and traditional inns. Wear shoes that slip off easily.</td></tr>
<tr><td>Trash</td><td>Few public bins. Carry a small bag; convenience stores have bins.</td></tr>
<tr><td>Toilets</td><td>Clean and free in stations, malls and convenience stores. The buttons are explained on the day.</td></tr>
<tr><td>Luggage</td><td>Send suitcases hotel to hotel (takkyubin) and travel light.</td></tr>
<tr><td>Internet</td><td>An eSIM or pocket Wi-Fi from day one makes maps and translation easy.</td></tr>
<tr><td>Health</td><td>Pharmacies are everywhere; bring your prescriptions in their original boxes.</td></tr>
</table>
<h2>Coming from the US or Canada</h2>
<ul class="ozet">
<li><strong>Time difference:</strong> Japan is 13 to 14 hours ahead of New York, Toronto and Montréal, and 16 to 17 hours ahead of Los Angeles and Vancouver. Plan an easy first day.</li>
<li><strong>Language:</strong> Iheb guides in English, and in French for Québec and other French-speaking travelers (<a href="/fr/tokyo-quebec-canada/" hreflang="fr">page en français</a>).</li>
<li><strong>Multi-day trips:</strong> Tokyo, Mt. Fuji, Hakone and Nagano with Iheb; Kyoto and Osaka with <a href="/en/">Tony</a> from the same team.</li>
</ul>
<h2>FAQ</h2>
${faqHTML(EN_FAQ_PRIMERA)}
<p><a class="btn" href="${L.en.waGenel}">Message Iheb on WhatsApp</a></p>
</div>`
  return ecrire('en/tokyo-anime-guide/first-time-japan', page({ lang: 'en', ruta: '/en/tokyo-anime-guide/first-time-japan/', alterna: 'primera',
    titre: 'First Time in Japan? A Calm Private Tokyo & Mt. Fuji Tour for Seniors & First-Timers | Iheb',
    desc: 'A comfortable private tour of Tokyo and Mt. Fuji in English, at your pace: fewer stairs, real breaks, private car option. Japan explained for first-timers and seniors from the US and Canada.',
    image: imageDe('kawaguchiko-sakura'), jsonld: [faqLd(EN_FAQ_PRIMERA)], corps }))
}

const FR_FAQ_QC = [
  ['Y a-t-il un guide francophone à Tokyo pour les Québécois ?', `Oui. Iheb, qui vit au Japon, guide en français (et en anglais et en arabe) des visites privées à Tokyo, au mont Fuji et dans les environs. Contact sur WhatsApp : ${WA_VISIBLE}.`],
  ['Faut-il un visa pour un Canadien ?', 'Pour un court séjour touristique, les titulaires d’un passeport canadien n’ont actuellement pas besoin de visa (jusqu’à 90 jours). Vérifiez les règles officielles avant le départ.'],
  ['Quel est le décalage horaire avec le Québec ?', 'Le Japon a 14 heures d’avance sur Montréal et Québec en hiver, et 13 heures en été.'],
  ['Laisse-t-on un pourboire au Japon ?', 'Non. Le pourboire ne fait pas partie de la culture, ni au restaurant, ni en taxi, ni à l’hôtel.'],
  ['Peut-on voyager en voiture privée ?', 'Oui. Pour plus de confort, Iheb peut organiser un véhicule privé avec chauffeur auprès de partenaires locaux licenciés. Prix sur demande.'],
  ['Combien coûte la visite ?', 'Cela dépend du nombre de personnes, de la durée et des lieux. Iheb vous envoie un prix sur WhatsApp une fois votre projet connu.'],
]

function frQuebec() {
  const corps = `${hero('fr', 'kawaguchiko-fuji', 'Le mont Fuji et le lac Kawaguchi', `<p class="etiket"><a href="/fr/">Iheb</a> · Québec et Canada</p>
<h1>Un guide francophone à Tokyo pour les voyageurs du Québec et du Canada</h1>
<p class="alt">Visites privées en français, tout expliqué du début à la fin : Tokyo, le mont Fuji, l’univers anime, à votre rythme et en voiture privée si vous le souhaitez.</p>
<p><a class="btn" href="${L.fr.waGenel}">Écrire à Iheb sur WhatsApp</a></p>`)}
<div class="kap">
<p class="cevap">Oui, il existe un guide francophone privé à Tokyo pour les Québécois et les Canadiens : Iheb, qui vit au Japon, fait partie de l’équipe Tony Kansai Guide. Il guide en français, en anglais et en arabe, à Tokyo, autour du mont Fuji, à Hakone et à Nagano. Rythme confortable, pauses, voiture privée avec chauffeur via des partenaires licenciés, et chaque détail du Japon expliqué en chemin. Prix par groupe sur WhatsApp : ${WA_VISIBLE}.</p>
<h2>Pour qui ?</h2>
<ul class="izgara">
${carte('fr', 'palais-imperial', 'Jardins du palais impérial', 'Premier voyage au Japon', 'Tout est expliqué : payer, prendre le train, les codes de politesse. Aucune question n’est de trop.')}
${carte('fr', 'akihabara', 'Akihabara', 'Fans d’anime et de manga', 'Akihabara, Nakano Broadway, Ikebukuro, cartes Pokémon et jeux rétro, avec un spécialiste.', '/fr/guide-anime-tokyo/')}
${carte('fr', 'kawaguchiko-sakura', 'Le Fuji et les cerisiers', 'Voyage confort', 'Départs après l’heure de pointe, peu d’escaliers, vraies pauses, voiture privée pour le Fuji.')}
${carte('fr', 'tokyo-camii', 'Tokyo Camii', 'Voyageurs musulmans', 'Repas halal et pauses pour la prière intégrés à la journée.', '/fr/halal-mosquees-tokyo/')}
</ul>
<h2>Le Japon en dix leçons courtes</h2>
<table class="dersler">
<tr><th>Sujet</th><th>À savoir</th></tr>
<tr><td>Pourboire</td><td>Ça ne se fait pas. Le service est compris.</td></tr>
<tr><td>Payer</td><td>On pose l’argent ou la carte dans le petit plateau au comptoir.</td></tr>
<tr><td>Argent</td><td>La carte passe presque partout, mais les petits restos aiment encore l’argent comptant. Les guichets des dépanneurs (7-Eleven) acceptent les cartes étrangères.</td></tr>
<tr><td>Train</td><td>Une carte IC (Suica ou PASMO) ou votre téléphone. Pas d’appels dans les wagons.</td></tr>
<tr><td>Chaussures</td><td>On les enlève dans certains restaurants et auberges traditionnelles.</td></tr>
<tr><td>Poubelles</td><td>Rares dans la rue : gardez un petit sac, les dépanneurs en ont.</td></tr>
<tr><td>Toilettes</td><td>Propres et gratuites dans les gares, les centres commerciaux et les dépanneurs.</td></tr>
<tr><td>Valises</td><td>Faites-les envoyer d’un hôtel à l’autre (takkyubin) et voyagez léger.</td></tr>
<tr><td>Internet</td><td>Une eSIM ou un routeur Wi-Fi dès l’arrivée.</td></tr>
<tr><td>Hiver</td><td>Tokyo est plus doux que Montréal, mais le Fuji et Nagano sont froids : prévoyez des couches.</td></tr>
</table>
<h2>Une journée type, sans stress</h2>
<ol class="adimlar">
<li><strong>Vers 9 h 30</strong>, Iheb vous retrouve à l’hôtel, après l’heure de pointe.</li>
<li><strong>Un ou deux quartiers</strong> par jour, pas cinq.</li>
<li><strong>Un vrai dîner</strong> assis (le repas du midi, comme on dit chez vous).</li>
<li><strong>Retour à l’hôtel</strong> en taxi ou en voiture privée si les jambes sont fatiguées.</li>
</ol>
<h2>Plusieurs jours au Japon</h2>
<p>Tokyo, le mont Fuji, Hakone et Nagano avec Iheb ; Kyoto et Osaka avec <a href="/">Tony</a>, de la même équipe. Un seul interlocuteur pour tout le voyage.</p>
<h2>Questions fréquentes</h2>
${faqHTML(FR_FAQ_QC)}
<p><a class="btn" href="${L.fr.waGenel}">Écrire à Iheb sur WhatsApp</a></p>
</div>`
  return ecrire('fr/tokyo-quebec-canada', page({ lang: 'fr', ruta: '/fr/tokyo-quebec-canada/', alterna: 'primera',
    titre: 'Guide francophone à Tokyo pour Québécois et Canadiens | Iheb, visites privées',
    desc: 'Guide privé en français à Tokyo et au mont Fuji pour les voyageurs du Québec et du Canada : tout expliqué, rythme confortable, voiture privée, univers anime, option halal. Prix sur WhatsApp.',
    image: imageDe('kawaguchiko-fuji'), jsonld: [faqLd(FR_FAQ_QC)], corps }))
}

// ———— 5-11-2026: clientes árabes con dinero (familias del Golfo) y agencias que trabajan con ellos ————
// Las tarifas las da Iheb por WhatsApp: aquí no se publica ningún precio.
const WA_FAMILIA_GOLFO = wa('السلام عليكم إيهاب، نحن عائلة من الخليج ونخطط لرحلة خاصة إلى اليابان. التواريخ وعدد الأشخاص: ')
const WA_AGENCIA_GOLFO = wa('Hi Iheb, we are a travel agency with Gulf / Arab clients and need a ground partner in Japan. Dates and group: ')

const AR_FAQ_FAKHIRA = [
  ['هل يوجد مرشد عربي مسلم في طوكيو للعائلات الخليجية؟', `نعم. إيهاب مرشد تونسي مسلم يعيش في اليابان ويتكلّم العربية والفرنسية والإنجليزية. يرافق عائلتكم وحدها في طوكيو وحول جبل فوجي وشيزوكا وناغانو. للتواصل عبر واتساب: <span dir="ltr">${WA_VISIBLE}</span>.`],
  ['هل يمكن التنقّل بسيارة خاصة مع سائق؟', 'نعم، عبر شركاء نقل مرخّصين في اليابان: سيارات خاصة، أو حافلات صغيرة للعائلات الكبيرة. السعر عند الطلب عبر واتساب.'],
  ['هل الطعام الحلال متوفّر في طوكيو؟', 'نعم، في طوكيو مطاعم حلال كثيرة، منها مطاعم لحم واغيو حلال. يختار إيهاب ما يناسب عائلتكم ويرتّب الحجز.'],
  ['كم السعر؟', 'يعتمد على عدد الأشخاص وعدد الأيام ونوع السيارة. يرسل إيهاب الأسعار مباشرة عبر واتساب بعد معرفة برنامجكم.'],
  ['هل يرافقنا في كيوتو وأوساكا؟', 'في كيوتو وأوساكا يستقبلكم توني من الفريق نفسه، وهو يتكلّم العربية أيضًا، فتبقى الرحلة كلها مع فريق واحد.'],
]

function arFakhira() {
  const corps = `${hero('ar', 'kawaguchiko-fuji', 'جبل فوجي وبحيرة كاواغوتشي', `<p class="etiket"><a href="/ar/tokyo/">إيهاب</a> · خاص · حلال</p>
<h1>اليابان بخصوصية تامة لعائلتك</h1>
<p class="alt">إيهاب، مرشد عربي مسلم يعيش في اليابان، يرافق عائلتكم من المطار حتى آخر يوم: سيارة خاصة مع سائق، مطاعم حلال، أوقات الصلاة، وكل التفاصيل بالعربية.</p>
<p><a class="btn" href="${WA_FAMILIA_GOLFO}">اطلب برنامجك والأسعار عبر واتساب</a></p>`)}
<div class="kap">
<ul class="rozetler"><li>عائلات الخليج</li><li>سيارة خاصة</li><li>حلال</li><li>أوقات الصلاة</li><li>تسوّق راقٍ</li><li>شهر العسل</li><li>بالعربية</li></ul>
<p class="cevap">نعم، يوجد مرشد عربي مسلم في طوكيو للعائلات الخليجية: إيهاب، تونسي يعيش في اليابان ويتكلّم العربية والفرنسية والإنجليزية. يرتّب جولة خاصة لعائلتكم وحدها: استقبال في المطار، سيارة خاصة مع سائق عبر شركاء مرخّصين، مطاعم حلال، استراحات للصلاة، تسوّق في غينزا وأوموتيساندو، ورحلة إلى جبل فوجي. الأسعار تُرسل عبر واتساب: <span dir="ltr">${WA_VISIBLE}</span>.</p>
<h2>ما يرتّبه إيهاب لكم</h2>
<ul class="izgara">
${carte('ar', 'narita', 'مطار ناريتا', 'الاستقبال في المطار', 'لقاء في ناريتا أو هانيدا، ثم إلى الفندق بسيارة خاصة.')}
${carte('ar', 'tokyo-camii', 'مسجد طوكيو', 'الصلاة والحلال', 'مسجد طوكيو، مطاعم حلال، وأوقات الصلاة محسوبة في برنامج كل يوم.', '/ar/tokyo/halal-masajid/')}
${carte('ar', 'palais-imperial', 'حدائق القصر الإمبراطوري', 'تسوّق راقٍ', 'غينزا وأوموتيساندو ومتاجر الماركات الكبرى، مع الإعفاء الضريبي للسيّاح بجواز السفر.')}
${carte('ar', 'kawaguchiko-sakura', 'جبل فوجي وأزهار الكرز', 'جبل فوجي بسيارة خاصة', 'بحيرة كاواغوتشي ومناظر فوجي، بلا قطارات ولا تبديل.')}
${carte('ar', 'skytree', 'برج طوكيو سكاي تري', 'طوكيو من الأعلى', 'برج سكاي تري بمصعد سريع، وفي الأيام الصافية يظهر فوجي.')}
${carte('ar', 'akihabara', 'أكيهابارا', 'يوم للأطفال', 'أنمي وبوكيمون وألعاب الفيديو، مع مرشد يعرف هذا العالم جيدًا.', '/ar/tokyo/anime-pokemon/')}
</ul>
<h2>لماذا تختار العائلات الخليجية إيهاب؟</h2>
<ul class="ozet">
<li><strong>خصوصية:</strong> جولة لعائلتكم وحدها، لا تختلطون بسيّاح آخرين.</li>
<li><strong>مسلم يفهم احتياجاتكم:</strong> الحلال، الصلاة، واحترام خصوصية العائلة.</li>
<li><strong>يتكلّم العربية:</strong> لا ترجمة ولا سوء فهم مع المطاعم والفنادق والسائقين.</li>
<li><strong>شبكة محلية:</strong> شركات نقل مرخّصة، فنادق، مطاعم حلال، ووكالات في اليابان.</li>
<li><strong>اليابان كلها:</strong> طوكيو مع إيهاب، وكيوتو وأوساكا مع توني من الفريق نفسه.</li>
</ul>
<h2>برنامج مقترح لخمسة أيام</h2>
<ol class="adimlar">
<li><strong>الوصول:</strong> استقبال في المطار، الفندق، وعشاء حلال قريب.</li>
<li><strong>طوكيو:</strong> مسجد طوكيو، برج سكاي تري، وتسوّق في غينزا.</li>
<li><strong>جبل فوجي بسيارة خاصة:</strong> بحيرة كاواغوتشي وأوشينو هاكاي.</li>
<li><strong>يوم العائلة:</strong> أنمي وبوكيمون للأطفال، أو أوديابا على خليج طوكيو.</li>
<li><strong>إلى كيوتو بالقطار السريع شينكانسن،</strong> حيث يستقبلكم توني.</li>
</ol>
<p class="kaynak">كل برنامج يُصمَّم لعائلتكم، وهذا مجرد مثال.</p>
<h2>أفضل الأوقات للزيارة</h2>
<ul class="ozet">
<li><strong>الخريف (نوفمبر):</strong> أوراق الخريف الحمراء والطقس لطيف للتنزّه.</li>
<li><strong>الشتاء (ديسمبر إلى فبراير):</strong> بارد وصافٍ، وأوضح أيام السنة لرؤية جبل فوجي.</li>
<li><strong>الربيع (أواخر مارس وأبريل):</strong> موسم أزهار الكرز، والطقس معتدل.</li>
</ul>
<h2>شهر العسل في اليابان</h2>
<p>للعرسان: برنامج هادئ وخاص، بإيقاع مريح، مع مطاعم حلال مختارة ومناظر جبل فوجي. يرتّب إيهاب التفاصيل ويرسل الأسعار عبر واتساب.</p>
</div>
<section class="bant"><div class="kap">
<h2>وكالات السفر التي تخدم عملاء الخليج</h2>
<p>إيهاب يعمل مع الوكالات باتفاق مباشر، ويرافق عملاءكم بالعربية، ويربطكم بشركات النقل المرخّصة والفنادق والمطاعم الحلال ووكالات أخرى في اليابان.</p>
<p><a class="btn" href="/ar/tokyo/wakalat/">للوكالات</a></p>
</div></section>
<div class="kap">
<h2>أسئلة شائعة</h2>
${faqHTML(AR_FAQ_FAKHIRA)}
<p><a class="btn" href="${WA_FAMILIA_GOLFO}">تواصل مع إيهاب عبر واتساب</a></p>
</div>`
  return ecrire('ar/tokyo/fakhira', page({ lang: 'ar', ruta: '/ar/tokyo/fakhira/', alterna: 'lujo',
    titre: 'رحلات خاصة في طوكيو واليابان للعائلات الخليجية | مرشد عربي مسلم: إيهاب',
    desc: 'مرشد عربي مسلم في طوكيو لعائلات الخليج: استقبال في المطار، سيارة خاصة مع سائق، مطاعم حلال، أوقات الصلاة، تسوّق في غينزا، وجبل فوجي. الأسعار عبر واتساب.',
    image: imageDe('kawaguchiko-fuji'), jsonld: [faqLd(AR_FAQ_FAKHIRA)], corps }))
}

const EN_FAQ_GCC = [
  ['Is there an Arabic-speaking Muslim guide in Tokyo for agencies?', `Yes. Iheb, a Tunisian Muslim who lives in Japan, guides agency clients in Arabic, French and English in Tokyo, around Mt. Fuji, Shizuoka and Nagano. WhatsApp: ${WA_VISIBLE}.`],
  ['What are the rates?', 'Iheb sends agency rates directly on WhatsApp, based on dates, group size, days and vehicles.'],
  ['Can he arrange private cars and drivers?', 'Yes, through licensed transport partners in Japan: private cars, or minibuses for large families, coordinated on the day.'],
  ['Can he handle large families or several groups at once?', 'He coordinates with other guides and agencies in Japan when a program needs more than one guide. In Kyoto and Osaka, Tony from the same team (who also speaks Arabic) takes over.'],
  ['How do we work together?', 'A direct cooperation agreement with your agency. You keep the client relationship; Iheb runs the days in Japan.'],
]

function enGcc() {
  const corps = `${hero('en', 'tokyo-camii', 'Tokyo Camii mosque', `<p class="etiket"><a href="/en/tokyo-anime-guide/">Iheb</a> · Arabic-speaking · GCC</p>
<h1>Your Arabic-speaking ground partner in Tokyo for Gulf clients</h1>
<p class="alt">For agencies serving GCC and Arab families: a Muslim guide who speaks your clients’ language, plus licensed private cars, halal dining and prayer times built into every day.</p>
<p><a class="btn" href="${WA_AGENCIA_GOLFO}">Ask for agency rates on WhatsApp</a></p>`)}
<div class="kap">
<ul class="rozetler"><li>العربية</li><li>English</li><li>Français</li><li>VIP families</li><li>Private cars</li><li>Halal</li><li>Prayer times</li></ul>
<p class="cevap">Yes, there is an Arabic-speaking Muslim guide in Tokyo who works with travel agencies: Iheb, part of the Tony Kansai Guide team. He guides your Gulf and Arab clients in Arabic, French and English, and connects your agency with licensed transport partners, hotels, halal restaurants and other agencies in Japan. Agency rates are sent on WhatsApp: ${WA_VISIBLE}.</p>
<h2>What your clients get</h2>
<ul class="izgara">
${carte('en', 'narita', 'Narita Airport', 'Airport welcome', 'Met at Narita or Haneda, then to the hotel by private car.')}
${carte('en', 'tokyo-camii', 'Tokyo Camii', 'Halal & prayer', 'Halal restaurants, prayer breaks and Friday prayer at Tokyo Camii.')}
${carte('en', 'palais-imperial', 'Imperial Palace gardens', 'Ginza & luxury shopping', 'Ginza, Omotesando and flagship stores, with tourist tax-free shopping.')}
${carte('en', 'kawaguchiko-fuji', 'Mount Fuji and Lake Kawaguchi', 'Mt. Fuji by private car', 'Lake Kawaguchi and the Fuji views with no train changes.')}
${carte('en', 'akihabara', 'Akihabara', 'Days for the kids', 'Anime, Pokémon and games with a real specialist.', '/en/tokyo-anime-guide/otaku-guide/')}
${carte('en', 'yokohama', 'Yokohama', 'Partner network', 'Introductions to other agencies and guides in Japan; Kyoto and Osaka with Tony.')}
</ul>
<h2>Why agencies with Gulf clients choose Iheb</h2>
<ul class="ozet">
<li><strong>Same language, same values:</strong> an Arabic-speaking Muslim guide; no translation gap with families.</li>
<li><strong>Privacy:</strong> private days for one family, never mixed with other tourists.</li>
<li><strong>Local network:</strong> licensed transport, hotels, halal restaurants and other agencies in Japan.</li>
<li><strong>All of Japan with one team:</strong> Tokyo with Iheb; Kyoto and Osaka with Tony, who also speaks Arabic.</li>
</ul>
<h2>How we work with your agency</h2>
<ol class="adimlar"><li>Send dates, family size and the program on WhatsApp.</li><li>Iheb replies with availability and agency rates.</li><li>A direct cooperation agreement with your agency.</li><li>Iheb welcomes your clients and runs the days in Japan.</li></ol>
<h2>FAQ</h2>
${faqHTML(EN_FAQ_GCC)}
<p><a class="btn" href="${WA_AGENCIA_GOLFO}">Contact Iheb as an agency</a></p>
</div>`
  return ecrire('en/arabic-speaking-guide-tokyo', page({ lang: 'en', ruta: '/en/arabic-speaking-guide-tokyo/', alterna: 'lujo',
    titre: 'Arabic-Speaking Muslim Guide in Tokyo for GCC Travel Agencies & VIP Families | Iheb',
    desc: 'For travel agencies serving Gulf (GCC) and Arab clients: Iheb, an Arabic-speaking Muslim guide in Tokyo, with licensed private cars, halal dining, prayer times and luxury shopping. Agency rates on WhatsApp.',
    image: imageDe('tokyo-camii'), jsonld: [faqLd(EN_FAQ_GCC)], corps }))
}

// ———— 6-11-2026: musulmanes de Malasia, Singapur, Brunéi, Indonesia y Reino Unido (inglés) ————
const WA_MUSULMAN = wa('Assalamualaikum Iheb, we are Muslim travelers planning a private trip to Tokyo. Dates and group size: ')
const EN_FAQ_MUSLIM = [
  ['Is there a Muslim tour guide in Tokyo?', `Yes. Iheb is a Muslim guide from Tunisia who lives in Japan and runs private tours in English, Arabic and French in Tokyo, around Mt. Fuji, Shizuoka and Nagano. WhatsApp: ${WA_VISIBLE}.`],
  ['Is it easy to find halal food in Tokyo?', 'Yes, more and more: halal ramen, halal wagyu, Indian, Turkish and Malaysian restaurants, plus Muslim-friendly menus in some hotels. Iheb picks places that fit your group and books ahead.'],
  ['Where can we pray in Tokyo?', 'Tokyo Camii is the best-known mosque, and there are prayer rooms at Narita and Haneda airports and in some malls and stations. Iheb builds prayer times into the day.'],
  ['Is Tokyo good for Muslim families with children?', 'Yes. It is safe and clean, and the anime, Pokémon and Nintendo shops are a favorite with kids. A private tour lets you set the pace and the breaks.'],
  ['How much does it cost?', 'It depends on group size, days and transport. Iheb sends the price directly on WhatsApp.'],
]

function enMuslim() {
  const corps = `${hero('en', 'tokyo-camii', 'Tokyo Camii mosque', `<p class="etiket"><a href="/en/tokyo-anime-guide/">Iheb</a> · Muslim-friendly Tokyo</p>
<h1>A Muslim guide for your private Tokyo trip</h1>
<p class="alt">For families and friends from Malaysia, Singapore, Brunei, Indonesia, the UK and beyond: halal food, prayer times and Mt. Fuji, planned by a Muslim guide who lives in Japan.</p>
<p><a class="btn" href="${WA_MUSULMAN}">Message Iheb on WhatsApp</a></p>`)}
<div class="kap">
<ul class="rozetler"><li>Halal food</li><li>Prayer times</li><li>Private</li><li>Families</li><li>Mt. Fuji</li><li>Anime &amp; Pokémon</li><li>English · العربية</li></ul>
<p class="cevap">Yes, there is a Muslim tour guide in Tokyo: Iheb, from Tunisia, lives in Japan and guides private groups in English, Arabic and French. He plans every day around halal meals and prayer times, from Tokyo Camii and halal ramen to Mt. Fuji by private car (through licensed partners) and the anime and Pokémon shops kids love. Price on WhatsApp: ${WA_VISIBLE}.</p>
<h2>What a Muslim-friendly day looks like</h2>
<ol class="adimlar">
<li><strong>Morning:</strong> Tokyo Camii, then the city’s highlights at your pace.</li>
<li><strong>Lunch:</strong> halal ramen, wagyu or another halal restaurant, booked ahead.</li>
<li><strong>Afternoon:</strong> shopping, Skytree or the anime districts, with a prayer break.</li>
<li><strong>Evening:</strong> a halal dinner close to your hotel.</li>
</ol>
<h2>Where we go</h2>
<ul class="izgara">
${carte('en', 'tokyo-camii', 'Tokyo Camii', 'Tokyo Camii', 'Tokyo’s best-known mosque, with Ottoman-style architecture.', '/fr/halal-mosquees-tokyo/')}
${carte('en', 'kawaguchiko-fuji', 'Mount Fuji and Lake Kawaguchi', 'Mt. Fuji', 'Lake Kawaguchi and the Fuji views, by private car if you prefer.')}
${carte('en', 'skytree', 'Tokyo Skytree', 'Tokyo Skytree', 'The whole city from above, by fast elevator.')}
${carte('en', 'akihabara', 'Akihabara', 'Anime & Pokémon', 'The district kids ask for, with a real specialist.', '/en/tokyo-anime-guide/otaku-guide/')}
${carte('en', 'odaiba', 'Odaiba', 'Odaiba', 'Tokyo Bay, The Gundam Base and big malls, easy for families.')}
${carte('en', 'oshino-hakkai', 'Oshino Hakkai', 'Oshino Hakkai', 'Clear spring ponds in a village at the foot of Mt. Fuji.')}
</ul>
<h2>Good to know</h2>
<ul class="ozet">
<li><strong>Read labels:</strong> many snacks contain pork extract, lard or mirin. Iheb helps you check in the shop.</li>
<li><strong>Airports:</strong> Narita and Haneda have prayer rooms.</li>
<li><strong>Best seasons:</strong> autumn colors in November, clear Fuji views in winter, cherry blossoms in late March and April.</li>
<li><strong>All of Japan:</strong> Tokyo with Iheb; Kyoto and Osaka with <a href="/en/">Tony</a>, who also speaks Arabic.</li>
</ul>
<h2>FAQ</h2>
${faqHTML(EN_FAQ_MUSLIM)}
<p><a class="btn" href="${WA_MUSULMAN}">Message Iheb on WhatsApp</a></p>
</div>`
  return ecrire('en/muslim-guide-tokyo', page({ lang: 'en', ruta: '/en/muslim-guide-tokyo/', alterna: 'musulman',
    titre: 'Muslim Tour Guide in Tokyo: Halal Food, Prayer Times & Mt. Fuji | Private Tours with Iheb',
    desc: 'Private Muslim-friendly tours in Tokyo and Mt. Fuji with Iheb, a Muslim guide who lives in Japan: halal restaurants, prayer times, Tokyo Camii, families. For travelers from Malaysia, Singapore, Brunei, Indonesia and the UK.',
    image: imageDe('tokyo-camii'), jsonld: [faqLd(EN_FAQ_MUSLIM)], corps }))
}

// ———— 6-11-2026: un barrio por página, en inglés, para otakus americanos ————
// Akihabara, Nakano Broadway e Ikebukuro, cada uno con su equivalente francés
// (IHEB_EQUIVALENTES). Solo datos ya comprobados en francais.mjs (Hareruya 2,
// Mandarake, Super Potato, Animate, Pokémon Center Mega Tokyo) y sus fuentes.
// Ninguna tienda de cartas más (Card Rush, Yuyu-tei… no tienen dirección oficial).
const enBarrio = ({ yol, kapak, alt, etiqueta, h1, sub, cevap, secciones, faq, fuentes, fr, titre, desc, wa: texto }) => {
  const enlace = wa(texto)
  const ruta = `/en/tokyo-anime-guide/${yol}/`
  const corps = `${hero('en', kapak, alt, `<p class="etiket"><a href="/en/tokyo-anime-guide/">Iheb</a> · ${etiqueta}</p>
<h1>${h1}</h1>
<p class="alt">${sub}</p>
<p><a class="btn" href="${enlace}">Plan this day with Iheb</a></p>`)}
<div class="kap">
<p class="cevap">${cevap}</p>
${secciones.map(([t, h]) => `<h2>${t}</h2>\n${h}`).join('\n')}
<h2>FAQ</h2>
${faqHTML(faq)}
<p class="kaynak">Sources: ${fuentes.map(([t, u]) => `<a href="${u}" rel="nofollow">${esc(t)}</a>`).join(' · ')}. Opening hours change: check the official site before you go.</p>
<p>Also on this site: <a href="/en/tokyo-anime-guide/otaku-guide/">the complete otaku guide to Tokyo</a> · <a href="${fr}" hreflang="fr">this page in French</a>.</p>
<p>Pokémon is a trademark of Nintendo, Creatures and GAME FREAK; other names belong to their owners. This is an independent private tour, not affiliated with them.</p>
<p><a class="btn" href="${enlace}">Message Iheb on WhatsApp</a></p>
</div>`
  const jsonld = [faqLd(faq)]
  return ecrire(ruta.slice(1, -1), page({ lang: 'en', ruta, alterna: 'otaku', titre, desc, image: imageDe(kapak), jsonld, corps }))
}

function enAkihabara() {
  return enBarrio({
    yol: 'akihabara', kapak: 'akihabara-rue', alt: 'Akihabara street', etiqueta: 'Akihabara',
    fr: '/fr/akihabara-que-faire/',
    wa: 'Hi Iheb, I read your Akihabara page and would like an otaku tour in Tokyo. Dates and group size: ',
    titre: 'Akihabara Otaku Tour with a Private Guide: Cards, Figures & Retro Games | Iheb',
    desc: 'Akihabara with a private English-speaking otaku guide: Hareruya 2 Pokémon card tower, figure buildings, Super Potato retro games, shop rules, tax-free. Half-day plan and tips. Price on WhatsApp.',
    h1: 'Akihabara otaku tour with a private guide',
    sub: 'Pokémon cards, figures, retro games and manga: the right buildings, the right floors, and someone who reads the Japanese labels for you.',
    cevap: `Akihabara is the place to start an otaku trip to Tokyo: buildings full of figure and anime-goods shops, new and retro video games, manga, trading cards and big electronics stores, all around JR Akihabara Station on the Yamanote loop line. Plan half a day for the highlights and a full day if you are hunting specific cards or figures. Iheb, a private guide who lives in Japan and specializes in anime, Japanese pop culture and Pokémon card collecting, takes you straight to the shops that match your list and explains everything in English. Price per group on WhatsApp: ${WA_VISIBLE}.`,
    secciones: [
      ['What Akihabara is good for', `<ul class="ozet">
<li><strong>Chuo-dori:</strong> the main avenue, lined with multi-story shop buildings.</li>
<li><strong>Figures and anime goods:</strong> new and pre-owned, often sorted floor by floor by series.</li>
<li><strong>Retro video games:</strong> Japanese consoles and cartridges from the 1980s and 1990s.</li>
<li><strong>Trading cards:</strong> dozens of card shops, many of them upstairs with no shop window on the street.</li>
<li><strong>Electronics:</strong> the big stores near the station, for a camera, a lens or accessories.</li>
</ul>`],
      ['Pokémon cards: Hareruya 2 Akihabara Tower Store', `<p>The big name for Pokémon cards in Akihabara is <strong>Hareruya 2 Akihabara Tower Store</strong>: a whole building dedicated to the Pokémon Trading Card Game (sealed product, single cards, accessories, a buy counter and daily events, plus rules lessons for beginners). It moved into the building on 1 February 2026 and stands at Ishimaru Building No. 3, 1-2-13 Sotokanda, about 3 minutes on foot from JR Akihabara Station. Hours announced at the opening were 10 am to 10 pm daily; check the official site before you go.</p>
<p>Around it, many more card shops fill the upper floors of the neighborhood’s buildings. Every single card has its own price tag, and condition grades vary from shop to shop and are written in Japanese. On this site we only name shops whose address we have checked on an official source; on the day, Iheb points you to the ones that fit what you collect.</p>`],
      ['Retro games and figures', `<ul class="ozet">
<li><strong>Super Potato:</strong> the showcase of retro gaming in Akihabara, on the 3rd to 5th floors of its building about 4 minutes from the station, with a small retro arcade on 5F. The most complete selection, not the cheapest.</li>
<li><strong>Book-Off and Sofmap:</strong> used games and consoles, often at lower prices.</li>
<li><strong>Radio Kaikan:</strong> a whole building of figure, trading-card and model-kit shops, right by the Electric Town exit of the station.</li>
<li><strong>Mandarake Complex:</strong> several floors of manga, anime goods, figures and vintage toys.</li>
</ul>
<p><strong>Before you buy a console:</strong> Japan runs on 100 V and uses its own regions. A Japanese Famicom cartridge does not fit an American NES, and Japanese Super Famicom games are not plug-and-play on a US Super Nintendo without an adapter. The simple route is to buy the Japanese console with the games, and check the power needs at home.</p>`],
      ['A half-day in Akihabara', `<ol class="adimlar">
<li>Arrive at JR Akihabara Station, Electric Town exit.</li>
<li>Walk Chuo-dori and the figure buildings.</li>
<li>One or two retro-game shops.</li>
<li>Cards: Hareruya 2 and the upstairs shops.</li>
</ol>
<p>Then continue to <a href="/en/tokyo-anime-guide/nakano-broadway/">Nakano Broadway</a> (about 30 minutes by train) or <a href="/en/tokyo-anime-guide/ikebukuro/">Ikebukuro</a> for the Pokémon Center Mega Tokyo and Animate.</p>`],
      ['Shop rules that save you time', `<ul class="ozet">
<li>The best shops are often not on the ground floor: take the stairs or the small elevator. In Japan, 1F is the ground floor and 2F is one floor up.</li>
<li>Many shops do not allow photos inside; look for the sign or ask.</li>
<li>Do not touch cards in the display case: ask the staff to show them to you, and look at the front, back and edges of an expensive card under the light before paying.</li>
<li>Tax-free: bring your passport and keep every receipt. Under the system in force since 1 November 2026, you pay the price with tax and get the tax back after the customs check when you leave Japan, from 5,000 yen before tax per store per day.</li>
<li>Halal-friendly lunch or a place to pray: ask Iheb to build it into the day (<a href="/en/muslim-guide-tokyo/">Muslim-friendly Tokyo</a>).</li>
</ul>`],
      ['Why go with Iheb', `<p>Akihabara is easy to walk around and hard to read. Iheb knows Pokémon cards and Japanese pop culture professionally: he asks what you collect before you go in, translates labels and your questions to the staff, and keeps you from losing hours on the wrong floors. It is a private tour, just your family or friends, in English (he also guides in French and Arabic).</p>
<p>Whether you fly in from the US, Canada, the UK or India, the whole plan, trains included, is explained in clear English.</p>`],
    ],
    faq: [
      ['How long do I need in Akihabara?', 'Half a day for the essentials; a full day if you are looking for specific cards, figures or games.'],
      ['Where is Hareruya 2 in Akihabara?', 'Hareruya 2 Akihabara Tower Store is at 1-2-13 Sotokanda (Ishimaru Building No. 3), about 3 minutes on foot from JR Akihabara Station. It has used the whole building since 1 February 2026.'],
      ['Will Japanese retro games work in the US?', 'Not always: Famicom and Super Famicom games are not directly compatible with American consoles. Buying the Japanese console with the games is the safest choice.'],
      ['Can I book an Akihabara tour with an English-speaking guide?', `Yes. Iheb guides private anime and Pokémon tours in Akihabara and Tokyo’s other otaku districts in English. Message him on WhatsApp: ${WA_VISIBLE}.`],
    ],
    fuentes: [['Hareruya 2: Akihabara Tower Store (official)', 'https://www.hareruya2.com/pages/lp_hareruya2_tower'], ['Super Potato Akihabara (official)', 'https://superpotatoakiba.jp/'], ['Mandarake (official)', 'https://www.mandarake.co.jp/']],
  })
}

function enNakano() {
  return enBarrio({
    yol: 'nakano-broadway', kapak: 'nakano-broadway', alt: 'Nakano Broadway', etiqueta: 'Nakano Broadway',
    fr: '/fr/nakano-broadway/',
    wa: 'Hi Iheb, I read your Nakano Broadway page and would like a collectors’ tour in Tokyo. Dates and group size: ',
    titre: 'Nakano Broadway Guide: Mandarake, Trading Cards & Vintage Collectibles | Iheb',
    desc: 'Nakano Broadway, Tokyo’s collectors’ mall: the Mandarake shops floor by floor, the Card-kan on 2F, hours, how to get there from Akihabara. Private otaku tour in English with Iheb. Price on WhatsApp.',
    h1: 'Nakano Broadway: the collectors’ mall, floor by floor',
    sub: 'Vintage toys, rare figures, manga and trading cards in one building, many of them in the Mandarake shops. Here is how it works.',
    cevap: `Nakano Broadway is a shopping arcade about 5 minutes on foot from the north exit of JR Nakano Station, west of central Tokyo. Its upper floors are packed with shops for collectors, above all the Mandarake shops: around thirty small specialist stores (manga, anime, figures, vintage toys), including the Card-kan for trading cards on 2F. Mandarake opens every day from noon to 8 pm. From Akihabara it is about 30 minutes by train, so the two fit in the same day. Iheb, a private guide in Tokyo who specializes in anime and Pokémon card collecting, can plan it for your group: ${WA_VISIBLE}.`,
    secciones: [
      ['Mandarake, floor by floor', `<ul class="ozet">
<li><strong>2F:</strong> most of the Mandarake shops, including the Card-kan (trading cards), plus toy, figure and cosplay shops.</li>
<li><strong>3F:</strong> the Mandarake buy counter and the main shop.</li>
<li><strong>4F:</strong> the Anime-kan and other specialist shops, and the service counter.</li>
</ul>
<p>Remember that in Japan 1F is the ground floor, so 2F is one floor up. The ground floor is mostly everyday shops and food; the collectors’ world starts upstairs.</p>`],
      ['Practical info', `<ul class="ozet">
<li><strong>Address:</strong> 5-52-15 Nakano, Nakano-ku, Tokyo.</li>
<li><strong>Getting there:</strong> JR Chuo Line to Nakano Station, north exit, then about 5 minutes on foot through the covered shopping street.</li>
<li><strong>Mandarake hours:</strong> noon to 8 pm, every day; the buy counter takes items until 7:30 pm.</li>
<li><strong>Best time:</strong> arrive around noon, when the shops open, and leave time to go back to a shop after you have compared prices.</li>
</ul>`],
      ['What collectors come for', `<p>Akihabara has the biggest choice of new goods and card shops; Nakano is where older and rarer items turn up. Think vintage toys, out-of-print manga and art books, figures from series that ended years ago, and single trading cards at the Card-kan. Each Mandarake shop has its own specialty, so it pays to know what you are looking for before you go up the escalator.</p>
<p>Prices and condition notes are mostly in Japanese. Iheb reads them for you, explains the grading words, and asks the staff the questions you would not know how to ask: whether a box is complete, whether an item can be taken out of the case, whether the shop ships abroad.</p>`],
      ['Nakano and Akihabara in one day', `<ol class="adimlar">
<li>Morning in <a href="/en/tokyo-anime-guide/akihabara/">Akihabara</a>: cards, figures, retro games.</li>
<li>Lunch on the way (halal-friendly options on request).</li>
<li>About 30 minutes by train west to Nakano.</li>
<li>Afternoon at Nakano Broadway, from noon opening onwards.</li>
</ol>
<p>Prefer something else in the afternoon? <a href="/en/tokyo-anime-guide/ikebukuro/">Ikebukuro</a> has the Pokémon Center Mega Tokyo and the Animate flagship.</p>`],
      ['Shop etiquette', `<ul class="ozet">
<li>Many shops in Nakano Broadway do not allow photos of their cases. Look for the sign or ask first.</li>
<li>Ask staff to take items out of locked cases; do not open boxes yourself.</li>
<li>Keep every receipt for the tax refund at departure (passport needed, from 5,000 yen before tax per store per day).</li>
<li>Big purchases: shops pack figures well, and you can post large boxes home by EMS or send your suitcase ahead to the airport.</li>
</ul>`],
      ['Why go with Iheb', `<p>Iheb lives in Japan and works with anime and Pokémon cards professionally. In a building where everything is small, upstairs and labeled in Japanese, that saves real time. The tour is private (just your group), in English, and also available in French and Arabic. Fans from the US, Canada, the UK, India and Europe get the whole day planned for them, trains included.</p>`],
    ],
    faq: [
      ['How do I get to Nakano Broadway?', 'Take the JR Chuo Line to Nakano Station, use the north exit and walk about 5 minutes. From Akihabara it is about 30 minutes by train.'],
      ['What time does Mandarake open in Nakano?', 'The Mandarake shops in Nakano Broadway are open from noon to 8 pm, every day.'],
      ['Can I find Pokémon cards at Nakano Broadway?', 'Yes, in particular at Mandarake’s Card-kan on 2F, which specializes in trading cards.'],
      ['Is Nakano Broadway worth it if I already did Akihabara?', 'Yes, for collectors: Akihabara is stronger on new goods and card shops, Nakano on older and rarer items. They complement each other well in one day.'],
    ],
    fuentes: [['Mandarake Nakano: shop map (official)', 'https://www.mandarake.co.jp/dir/nkn/']],
  })
}

function enIkebukuro() {
  return enBarrio({
    yol: 'ikebukuro', kapak: 'sunshine-city', alt: 'Sunshine City, Ikebukuro', etiqueta: 'Ikebukuro',
    fr: '/fr/ikebukuro-anime/',
    wa: 'Hi Iheb, I read your Ikebukuro page and would like an anime tour in Tokyo. Dates and group size: ',
    titre: 'Ikebukuro for Anime Fans: Animate, Otome Road & Pokémon Center Mega Tokyo | Iheb',
    desc: 'Ikebukuro for anime fans: the Animate Ikebukuro flagship, Otome Road, Sunshine City with Pokémon Center Mega Tokyo and Pikachu Sweets. Addresses, hours, half-day plan. Private guide in English.',
    h1: 'Ikebukuro for anime fans: Animate, Otome Road and Pokémon Center Mega Tokyo',
    sub: 'Anime goods, manga, Otome Road and Tokyo’s biggest Pokémon Center, all a few minutes from the east exit of Ikebukuro Station.',
    cevap: `In Ikebukuro, anime Tokyo fits into a few streets east of the station: Animate Ikebukuro, a huge anime and manga store at 1-20-7 Higashi-Ikebukuro (10 am to 9 pm); the street nicknamed Otome Road, with manga and anime-goods shops aimed mostly at women fans; and the Sunshine City complex, home to the Pokémon Center Mega Tokyo and Pikachu Sweets (Alpa, 2F). Plan half a day. Iheb, a private guide who lives in Japan and specializes in anime and Pokémon cards, can combine it with Akihabara or Nakano in one day: ${WA_VISIBLE}.`,
    secciones: [
      ['The addresses', `<ul class="ozet">
<li><strong>Animate Ikebukuro:</strong> 1-20-7 Higashi-Ikebukuro, Toshima-ku, 10 am to 9 pm. Presented as the largest Animate store; it reopened in 2023 after renovation and spreads over about ten levels.</li>
<li><strong>Otome Road:</strong> the street along Sunshine City, known for its manga and anime-goods shops aimed mostly at women fans.</li>
<li><strong>Pokémon Center Mega Tokyo and Pikachu Sweets:</strong> Sunshine City Alpa, 2F, 3-1-2 Higashi-Ikebukuro. Often described as the largest Pokémon Center in Tokyo.</li>
</ul>`],
      ['A half-day in Ikebukuro', `<ol class="adimlar">
<li>East exit of Ikebukuro Station.</li>
<li>Animate Ikebukuro, floor by floor.</li>
<li>A walk along Otome Road.</li>
<li>Sunshine City: Pokémon Center Mega Tokyo, then a break at Pikachu Sweets.</li>
</ol>
<p>Ikebukuro pairs well with <a href="/en/tokyo-anime-guide/akihabara/">Akihabara</a> in the morning or <a href="/en/tokyo-anime-guide/nakano-broadway/">Nakano Broadway</a>, which opens at noon.</p>`],
      ['Pokémon Center Mega Tokyo: what to expect', `<p>The Pokémon Centers sell plush, goods and sealed Trading Card Game products (booster packs, boxes, accessories). The most wanted new releases are often limited per person, and sometimes sold by lottery for the right to buy. Single cards are not what the Pokémon Centers are for: for those, go to the specialist shops of Akihabara (Hareruya 2) or Mandarake’s Card-kan in Nakano.</p>
<p>Tokyo has five official Pokémon stores: Mega Tokyo (Ikebukuro), Tokyo DX with the Pokémon Café (Nihonbashi Takashimaya), Shibuya (PARCO 6F), Skytree Town (Solamachi) and the Pokémon Store at Tokyo Station. The Pokémon Café is by reservation only, so book before your trip.</p>`],
      ['Tips for the day', `<ul class="ozet">
<li>Weekday mornings are calmer; weekends and school holidays get very busy at Sunshine City.</li>
<li>In Japan, 1F is the ground floor and 2F is one floor up.</li>
<li>Ask before taking photos inside shops.</li>
<li>Bring your passport for tax-free shopping and keep every receipt: the tax is refunded after the customs check at departure, from 5,000 yen before tax per store per day.</li>
<li>Muslim travelers: Iheb can plan a halal-friendly lunch and prayer breaks (<a href="/en/muslim-guide-tokyo/">Muslim-friendly Tokyo</a>).</li>
</ul>`],
      ['Why go with Iheb', `<p>Animate alone can take hours if you do not know which floor holds your series. Iheb works with anime, Japanese pop culture and Pokémon cards professionally, plans the route between districts, and translates labels and questions. The tour is private, in English (also French and Arabic), and built around what your group loves. It suits families with Pokémon-loving kids as much as serious collectors, from the US and Canada to the UK and India.</p>`],
    ],
    faq: [
      ['Where is Animate Ikebukuro?', 'At 1-20-7 Higashi-Ikebukuro, east of Ikebukuro Station; open 10 am to 9 pm.'],
      ['What is Otome Road?', 'A street in Ikebukuro, along Sunshine City, known for manga and anime-goods shops aimed mostly at women fans.'],
      ['Where is the Pokémon Center Mega Tokyo?', 'In Sunshine City, on 2F of the Alpa shopping mall, 3-1-2 Higashi-Ikebukuro, Ikebukuro.'],
      ['Can I buy single Pokémon cards in Ikebukuro?', 'The Pokémon Center sells sealed products. For single cards, specialist shops in Akihabara (such as Hareruya 2) and Nakano Broadway (Mandarake Card-kan) are the better choice.'],
    ],
    fuentes: [['Animate Ikebukuro (official)', 'https://www.animate.co.jp/shop/ikebukuro/'], ['Pokémon: official store list', 'https://www.pokemon.co.jp/shop/en/']],
  })
}

// ———— 6-11-2026, fase 2: más mercados que pagan ————
// Magreb (fr + ar), excursiones desde Tokio sin lugares de culto (fr/en/ar) e
// itinerarios de 3, 5 y 7 días (fr/en/ar). Solo datos que ya están comprobados
// en francais.mjs (trenes, tiempos, museos, mezquitas, visados). Sin precios.
const TXT = {
  fr: { wa: 'Écrire à Iheb sur WhatsApp', faq: 'Questions fréquentes', otro: 'À lire aussi' },
  ar: { wa: 'اكتب لإيهاب على واتساب', faq: 'أسئلة شائعة', otro: 'اقرأ أيضًا' },
  en: { wa: 'Message Iheb on WhatsApp', faq: 'FAQ', otro: 'Read next' },
}
function generica({ lang, ruta, alterna, kapak, alt, etiqueta, h1, sub, cevap, secciones, faq, ver, titre, desc, wa: texto, ld = [] }) {
  const enlace = wa(texto)
  const t = TXT[lang]
  const corps = `${hero(lang, kapak, alt, `<p class="etiket"><a href="${L[lang].base}">${lang === 'ar' ? 'إيهاب' : 'Iheb'}</a> · ${etiqueta}</p>
<h1>${h1}</h1>
<p class="alt">${sub}</p>
<p><a class="btn" href="${enlace}">${t.wa}</a></p>`)}
<div class="kap">
<p class="cevap">${cevap}</p>
${secciones.map(([h, c]) => `<h2>${h}</h2>\n${c}`).join('\n')}
<h2>${t.faq}</h2>
${faqHTML(faq)}
<h2>${t.otro}</h2>
<ul class="ozet">${ver.map(([x, h]) => `<li><a href="${h}">${x}</a></li>`).join('')}</ul>
<p><a class="btn" href="${enlace}">${t.wa}</a></p>
</div>`
  return ecrire(ruta.slice(1, -1), page({ lang, ruta, alterna, titre, desc, image: imageDe(kapak), jsonld: [faqLd(faq), ...ld], corps }))
}
// Un TouristTrip con sus etapas, para excursiones e itinerarios.
const viajeLd = (name, touristType, etapas) => ({ '@type': 'TouristTrip', name, touristType, provider: { '@id': `${BASE}/fr/#iheb` },
  itinerary: { '@type': 'ItemList', itemListElement: etapas.map((n, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'Place', name: n } })) } })

// ——— Magreb ———
function frMaghreb() {
  return generica({
    lang: 'fr', ruta: '/fr/tokyo-maghreb/', alterna: 'magreb', kapak: 'tokyo-camii', alt: 'La Tokyo Camii', etiqueta: 'Maghreb et Afrique francophone',
    wa: 'Bonjour Iheb, nous venons du Maghreb et préparons un voyage privé à Tokyo. Dates et nombre de personnes : ',
    titre: 'Voyage à Tokyo depuis la Tunisie, le Maroc et l’Algérie : guide qui parle arabe et français | Iheb',
    desc: 'Voyageurs de Tunisie, du Maroc, d’Algérie, du Sénégal et de Côte d’Ivoire : visite privée de Tokyo et du mont Fuji en français ou en arabe avec Iheb, repas halal et pauses prière. Visa, mosquées, tarif sur WhatsApp.',
    h1: 'Tokyo depuis le Maghreb : un guide qui parle arabe et français',
    sub: 'Tokyo, le mont Fuji, l’anime et la mer, en visite privée, avec des repas halal et le temps de la prière.',
    cevap: `Oui, on peut visiter Tokyo avec un guide qui parle à la fois arabe et français : Iheb, guide musulman qui vit au Japon, accompagne en visite privée les voyageurs de Tunisie, du Maroc et d’Algérie, et aussi du Sénégal et de Côte d’Ivoire, à Tokyo, dans le Kanto, autour du mont Fuji, à Shizuoka et à Nagano. La journée se construit avec des restaurants halal ou Muslim friendly et des pauses prière, sans lieux de culte non musulmans au programme. Tarif par groupe sur WhatsApp : ${WA_VISIBLE}.`,
    secciones: [
      ['Pourquoi un guide qui parle arabe et français ?', `<ul class="ozet"><li><strong>Votre langue, au choix :</strong> en famille, les grands-parents écoutent en arabe, les enfants en français ; Iheb passe de l’un à l’autre.</li><li><strong>Musulman lui-même :</strong> il sait trouver un repas halal, une mosquée pour la prière du vendredi ou un endroit calme pour prier.</li><li><strong>Visite privée :</strong> uniquement votre famille ou votre groupe, à votre rythme.</li><li><strong>Japonais au quotidien :</strong> il vit au Japon et s’occupe des trains, des menus et des réservations.</li></ul>`],
      ['Visa : selon votre passeport', `<table><tr><th>Passeport</th><th>Séjour touristique</th></tr>
<tr><td>Tunisie</td><td>Exemption de visa jusqu’à 90 jours, selon la liste du ministère japonais des Affaires étrangères ; vérifiez la liste à jour avant de partir.</td></tr>
<tr><td>Maroc, Algérie</td><td>Visa requis : consultez l’ambassade du Japon de votre pays.</td></tr>
<tr><td>Sénégal, Côte d’Ivoire</td><td>Renseignez-vous auprès de l’ambassade du Japon de votre pays avant de réserver.</td></tr></table>
<p>Détails et formalités d’arrivée : <a href="/fr/visa-japon/">visa pour le Japon</a>.</p>`],
      ['Halal et prière à Tokyo', `<ul class="ozet"><li><strong>Tokyo Camii :</strong> mosquée de style ottoman à environ 5 minutes à pied de la gare de Yoyogi-Uehara ; les visiteurs y sont bienvenus en dehors des heures de prière.</li><li><strong>Mosquée d’Otsuka :</strong> siège du Japan Islamic Trust, à environ 5 minutes à pied de la gare d’Otsuka (ligne JR Yamanote), avec la prière du vendredi.</li><li><strong>Aéroports :</strong> Narita et Haneda disposent de salles de prière.</li><li><strong>Repas :</strong> Iheb prévoit des restaurants halal ou Muslim friendly sur votre trajet.</li></ul>
<p>Tout le détail : <a href="/fr/halal-mosquees-tokyo/">halal et mosquées à Tokyo</a>.</p>`],
      ['Que faire ensemble ?', `<ul class="izgara">
${carte('fr', 'shibuya', 'Le carrefour de Shibuya', 'Tokyo moderne', 'Shibuya, Shinjuku, Odaiba : la ville d’aujourd’hui.', '/fr/itineraire-tokyo-3-5-7-jours/')}
${carte('fr', 'akihabara', 'Akihabara', 'Anime et cartes Pokémon', 'Akihabara, Nakano, Ikebukuro avec un passionné.', '/fr/guide-anime-tokyo/')}
${carte('fr', 'kawaguchiko-fuji', 'Le mont Fuji et le lac Kawaguchi', 'Mont Fuji', 'Le lac Kawaguchi ou Hakone, en une journée.', '/fr/excursions-depuis-tokyo/')}
${carte('fr', 'enoshima', 'Enoshima', 'Côté mer', 'Yokohama, le petit train Enoden et Enoshima.', '/fr/kamakura/')}
</ul>`],
      ['Comment réserver ?', `<ol class="adimlar"><li>Écrivez à Iheb sur WhatsApp, en arabe ou en français : dates, nombre de personnes, hôtel.</li><li>Il vous propose un programme et un tarif pour votre groupe.</li><li>Le jour venu, il vous retrouve à votre hôtel ou à une gare.</li></ol>`],
    ],
    faq: [
      ['Y a-t-il un guide qui parle arabe et français à Tokyo ?', `Oui : Iheb, guide qui vit au Japon, guide en arabe, en français et en anglais à Tokyo et autour. WhatsApp : ${WA_VISIBLE}.`],
      ['Les Tunisiens ont-ils besoin d’un visa pour le Japon ?', 'Pour un séjour touristique jusqu’à 90 jours, les Tunisiens sont exemptés de visa selon la liste du ministère japonais des Affaires étrangères ; vérifiez la liste à jour avant de partir. Les Marocains et les Algériens ont besoin d’un visa.'],
      ['Peut-on manger halal et prier pendant la visite ?', 'Oui. Iheb prévoit des restaurants halal ou Muslim friendly et des pauses prière ; la Tokyo Camii et la mosquée d’Otsuka accueillent la prière du vendredi.'],
      ['Quel est le tarif ?', 'Il dépend du nombre de personnes, de la durée et du programme. Iheb vous l’envoie sur WhatsApp.'],
    ],
    ver: [['Excursions depuis Tokyo', '/fr/excursions-depuis-tokyo/'], ['Itinéraires de 3, 5 et 7 jours', '/fr/itineraire-tokyo-3-5-7-jours/'], ['Halal et mosquées à Tokyo', '/fr/halal-mosquees-tokyo/'], ['Visa pour le Japon', '/fr/visa-japon/']],
  })
}
function arMaghreb() {
  return generica({
    lang: 'ar', ruta: '/ar/tokyo/maghreb/', alterna: 'magreb', kapak: 'tokyo-camii', alt: 'جامع طوكيو', etiqueta: 'من المغرب العربي',
    wa: 'السلام عليكم إيهاب، نحن من المغرب العربي ونخطط لرحلة خاصة إلى طوكيو. التواريخ وعدد الأشخاص: ',
    titre: 'رحلة إلى طوكيو من تونس والمغرب والجزائر: مرشد يتكلم العربية والفرنسية | إيهاب',
    desc: 'للمسافرين من تونس والمغرب والجزائر: جولات خاصة في طوكيو وجبل فوجي بالعربية أو بالفرنسية مع إيهاب، طعام حلال ووقت للصلاة. التأشيرة والمساجد، والسعر على واتساب.',
    h1: 'من المغرب العربي إلى طوكيو: مرشد يتكلم لغتك',
    sub: 'طوكيو وجبل فوجي والأنمي والبحر، في جولة خاصة بكم، مع طعام حلال ووقت للصلاة.',
    cevap: `نعم، يمكنكم زيارة طوكيو مع مرشد يتكلم العربية والفرنسية معًا: إيهاب، مرشد تونسي مسلم يعيش في اليابان، يرافق المسافرين من تونس والمغرب والجزائر في جولات خاصة في طوكيو ومنطقة كانتو وحول جبل فوجي وفي شيزوكا وناغانو. يُبنى اليوم حول مطاعم حلال أو مناسبة للمسلمين ووقفات للصلاة، بلا أماكن عبادة غير إسلامية في البرنامج. السعر حسب المجموعة على واتساب: <span dir="ltr">${WA_VISIBLE}</span>.`,
    secciones: [
      ['لماذا مرشد يتكلم العربية والفرنسية؟', `<ul class="ozet"><li><strong>بلغتكم:</strong> بالعربية أو بالفرنسية، أو بالاثنتين معًا داخل العائلة الواحدة.</li><li><strong>مسلم مثلكم:</strong> يعرف أين تجدون الطعام الحلال والمساجد وصلاة الجمعة.</li><li><strong>جولة خاصة:</strong> لعائلتكم أو مجموعتكم فقط، على إيقاعكم.</li><li><strong>يعيش في اليابان:</strong> يتولّى القطارات وقوائم الطعام والحجوزات.</li></ul>`],
      ['التأشيرة حسب جواز السفر', `<table><tr><th>الجواز</th><th>السياحة</th></tr>
<tr><td>تونس</td><td>إعفاء من التأشيرة حتى 90 يومًا حسب قائمة وزارة الخارجية اليابانية؛ تحقّقوا من القائمة المحدّثة قبل السفر.</td></tr>
<tr><td>المغرب، الجزائر</td><td>التأشيرة مطلوبة: راجعوا سفارة اليابان في بلدكم.</td></tr></table>`],
      ['الحلال والصلاة في طوكيو', `<ul class="ozet"><li><strong>جامع طوكيو (Tokyo Camii):</strong> على بعد نحو 5 دقائق سيرًا من محطة يويوغي-أويهارا.</li><li><strong>مسجد أوتسوكا:</strong> مقر Japan Islamic Trust، على بعد نحو 5 دقائق سيرًا من محطة أوتسوكا، وفيه صلاة الجمعة.</li><li><strong>المطارات:</strong> في ناريتا وهانيدا غرف للصلاة.</li><li><strong>الطعام:</strong> يختار إيهاب مطاعم حلال أو مناسبة للمسلمين على طريقكم.</li></ul>
<p>التفاصيل: <a href="/ar/tokyo/halal-masajid/">حلال ومساجد طوكيو</a>.</p>`],
      ['ماذا نزور معًا؟', `<ul class="izgara">
${carte('ar', 'shibuya', 'تقاطع شيبويا', 'طوكيو الحديثة', 'شيبويا وشينجوكو وأوداييبا: مدينة اليوم.', '/ar/tokyo/barnamaj-tokyo/')}
${carte('ar', 'akihabara', 'أكيهابارا', 'أنمي وبطاقات بوكيمون', 'أكيهابارا وناكانو وإيكيبوكورو مع خبير.', '/ar/tokyo/anime-pokemon/')}
${carte('ar', 'kawaguchiko-fuji', 'جبل فوجي وبحيرة كاواغوتشي', 'جبل فوجي', 'بحيرة كاواغوتشي أو هاكوني في يوم واحد.', '/ar/tokyo/rihlat-min-tokyo/')}
</ul>`],
      ['كيف تحجزون؟', `<ol class="adimlar"><li>اكتبوا لإيهاب على واتساب بالعربية أو بالفرنسية: التواريخ وعدد الأشخاص والفندق.</li><li>يقترح عليكم برنامجًا وسعرًا لمجموعتكم.</li><li>في اليوم المحدد يلقاكم في الفندق أو في المحطة.</li></ol>`],
    ],
    faq: [
      ['هل يوجد مرشد في طوكيو يتكلم العربية والفرنسية؟', `نعم: إيهاب، مرشد يعيش في اليابان، يرشد بالعربية والفرنسية والإنجليزية في طوكيو وحولها. واتساب: <span dir="ltr">${WA_VISIBLE}</span>.`],
      ['هل يحتاج التونسيون إلى تأشيرة لليابان؟', 'للسياحة حتى 90 يومًا، التونسيون معفون من التأشيرة حسب قائمة وزارة الخارجية اليابانية؛ تحقّقوا من القائمة المحدّثة قبل السفر. أما المغاربة والجزائريون فيحتاجون إلى تأشيرة.'],
      ['هل نجد طعامًا حلالًا ووقتًا للصلاة؟', 'نعم. يرتّب إيهاب مطاعم حلال أو مناسبة للمسلمين ووقفات للصلاة، وتُقام صلاة الجمعة في جامع طوكيو ومسجد أوتسوكا.'],
      ['كم السعر؟', 'يختلف حسب عدد الأشخاص والمدة والبرنامج، ويرسله لكم إيهاب على واتساب.'],
    ],
    ver: [['رحلات يومية من طوكيو', '/ar/tokyo/rihlat-min-tokyo/'], ['برنامج طوكيو 3 و5 و7 أيام', '/ar/tokyo/barnamaj-tokyo/'], ['حلال ومساجد طوكيو', '/ar/tokyo/halal-masajid/']],
  })
}

// ——— Excursiones de un día (sin santuarios ni templos) ———
const ETAPAS_EXC = ['Lake Kawaguchi', 'Oshino Hakkai', 'Lake Ashi', 'Owakudani', 'Hakone Open-Air Museum', 'Yokohama', 'Kamakura-Kokomae', 'Enoshima']
function frExcursions() {
  return generica({
    lang: 'fr', ruta: '/fr/excursions-depuis-tokyo/', alterna: 'excursiones', kapak: 'kawaguchiko-fuji', alt: 'Le mont Fuji et le lac Kawaguchi', etiqueta: 'Excursions',
    wa: 'Bonjour Iheb, nous cherchons une excursion d’une journée depuis Tokyo (Fuji, Hakone ou la mer). Dates et nombre de personnes : ',
    titre: 'Excursions d’une journée depuis Tokyo : mont Fuji, Hakone, Enoshima | Guide francophone',
    desc: 'Trois excursions d’une journée depuis Tokyo avec un guide francophone : le mont Fuji et le lac Kawaguchi, Hakone (lac Ashi, téléphérique, Owakudani, onsen) et la côte de Yokohama et Enoshima. Trains, durées, conseils.',
    h1: 'Excursions d’une journée depuis Tokyo : Fuji, Hakone ou la mer ?',
    sub: 'Trois journées classiques, nature, lacs et bord de mer, avec les trains, les durées et ce qu’il faut savoir.',
    cevap: 'Depuis Tokyo, trois excursions d’une journée sont faciles : les lacs du Fuji autour de Kawaguchiko, à environ 2 heures de Shinjuku par le train direct Fuji Excursion ; Hakone, avec le lac Ashi, le téléphérique et la vallée volcanique d’Owakudani, à environ 1 h 20 de Shinjuku en Romancecar ; et la côte de Yokohama, Kamakura et Enoshima, à environ une heure de la gare de Tokyo par la ligne JR Yokosuka. Choisissez une région par jour : passer du Fuji à Hakone demande environ 2 heures de bus. Iheb, guide francophone qui vit au Japon, organise la journée en privé pour votre groupe.',
    secciones: [
      ['1. Le mont Fuji et le lac Kawaguchi', `<ul class="ozet"><li><strong>Accès :</strong> train direct Fuji Excursion depuis Shinjuku, environ 2 heures (ou bus express).</li><li><strong>Lac Kawaguchi :</strong> le plus accessible des cinq lacs, avec le Fuji qui s’y reflète par temps calme.</li><li><strong>Oshino Hakkai :</strong> un village de bassins alimentés par les eaux de source du Fuji.</li><li><strong>Fuji-Q Highland :</strong> le parc d’attractions pour les amateurs de montagnes russes.</li></ul>`],
      ['2. Hakone : lac, téléphérique et onsen', `<ul class="ozet"><li><strong>Accès :</strong> Romancecar d’Odakyu depuis Shinjuku, environ 1 h 20 jusqu’à Hakone-Yumoto.</li><li><strong>La boucle :</strong> la traversée du lac Ashi en bateau et le téléphérique au-dessus d’Owakudani, la vallée volcanique fumante (accès parfois restreint selon l’activité volcanique).</li><li><strong>Hakone Open-Air Museum :</strong> un musée de sculptures en plein air.</li><li><strong>Onsen :</strong> Hakone est une région de sources chaudes, idéale pour finir la journée.</li></ul>`],
      ['3. La mer : Yokohama, Kamakura-Kōkōmae et Enoshima', `<ul class="ozet"><li><strong>Accès :</strong> ligne JR Yokosuka depuis la gare de Tokyo, environ une heure jusqu’à Kamakura sans changement, en passant près de Yokohama.</li><li><strong>Yokohama :</strong> le port, Minato Mirai et son front de mer, le Cup Noodles Museum, Chinatown.</li><li><strong>Le petit train Enoden :</strong> il longe la côte, avec la plage de Yuigahama et le passage à niveau de Kamakura-Kōkōmae, rendu célèbre par l’anime Slam Dunk.</li><li><strong>Enoshima :</strong> une petite île reliée à la côte par un pont, avec vue sur la mer et, par temps clair, sur le Fuji.</li></ul>`],
      ['Bien choisir', `<table><tr><th></th><th>Lacs du Fuji</th><th>Hakone</th><th>Côte (Enoshima)</th></tr>
<tr><td>Depuis Tokyo</td><td>Environ 2 h depuis Shinjuku</td><td>Environ 1 h 20 depuis Shinjuku</td><td>Environ 1 h depuis la gare de Tokyo</td></tr>
<tr><td>Pour qui</td><td>Voir le Fuji de près</td><td>Lac, volcan, onsen</td><td>Journée calme, anime, mer</td></tr></table>
<p>Le Fuji est souvent caché par les nuages : les matins d’hiver sont en général les plus dégagés. Sur demande, la journée peut se faire en véhicule privé avec des partenaires agréés.</p>`],
    ],
    faq: [
      ['Peut-on faire le Fuji et Hakone dans la même journée ?', 'C’est déconseillé : il faut environ 2 heures de bus, avec un changement à Gotemba, pour passer de l’un à l’autre. Choisissez une région par jour.'],
      ['Quelle est l’excursion la plus simple depuis Tokyo ?', 'La côte de Yokohama et d’Enoshima : environ une heure de train depuis la gare de Tokyo, sans changement jusqu’à Kamakura.'],
      ['Quand voit-on le mieux le mont Fuji ?', 'Les matins d’hiver sont en général les plus dégagés ; en été, il est souvent dans les nuages.'],
    ],
    ver: [['Hakone et mont Fuji', '/fr/hakone-mont-fuji/'], ['Yokohama et Enoshima', '/fr/kamakura/'], ['Excursion au mont Fuji depuis Tokyo', '/fr/excursion-mont-fuji-depuis-tokyo/'], ['Itinéraires de 3, 5 et 7 jours', '/fr/itineraire-tokyo-3-5-7-jours/'], ['Hakone en famille avec un onsen privé', '/fr/hakone-onsen-prive/'], ['La neige depuis Tokyo', '/fr/neige-depuis-tokyo/']],
    ld: [viajeLd('Excursions d’une journée depuis Tokyo', 'Voyageurs francophones', ETAPAS_EXC)],
  })
}
function enExcursions() {
  return generica({
    lang: 'en', ruta: '/en/tokyo-anime-guide/day-trips/', alterna: 'excursiones', kapak: 'kawaguchiko-fuji', alt: 'Mount Fuji and Lake Kawaguchi', etiqueta: 'Day trips',
    wa: 'Hi Iheb, we would like a private day trip from Tokyo (Mt. Fuji, Hakone or the coast). Dates and group size: ',
    titre: 'Day Trips from Tokyo with a Private Guide: Mt. Fuji, Hakone, Enoshima | Iheb',
    desc: 'Three easy day trips from Tokyo with a private English-speaking guide: Mt. Fuji and Lake Kawaguchi, Hakone (Lake Ashi, ropeway, Owakudani, hot springs) and the Yokohama–Enoshima coast. Trains, times and tips.',
    h1: 'Day trips from Tokyo: Mt. Fuji, Hakone or the coast?',
    sub: 'Three classic days out, lakes, a volcano valley and the seaside, with the trains, the times and what to know.',
    cevap: 'Three day trips from Tokyo are easy: the Fuji Five Lakes around Kawaguchiko, about 2 hours from Shinjuku on the direct Fuji Excursion train; Hakone, with Lake Ashi, the ropeway and the volcanic Owakudani valley, about 1 h 20 from Shinjuku on the Romancecar; and the Yokohama, Kamakura and Enoshima coast, about an hour from Tokyo Station on the JR Yokosuka Line. Pick one area per day: getting from the Fuji lakes to Hakone takes about 2 hours by bus. Iheb, a private guide who lives in Japan, plans the day for your group in English.',
    secciones: [
      ['1. Mt. Fuji and Lake Kawaguchi', `<ul class="ozet"><li><strong>Getting there:</strong> the direct Fuji Excursion train from Shinjuku, about 2 hours (or an express bus).</li><li><strong>Lake Kawaguchi:</strong> the easiest of the five lakes, with Fuji reflected in the water on calm days.</li><li><strong>Oshino Hakkai:</strong> a village of ponds fed by Fuji’s spring water.</li><li><strong>Fuji-Q Highland:</strong> the theme park for roller-coaster fans.</li></ul>`],
      ['2. Hakone: lake, ropeway and hot springs', `<ul class="ozet"><li><strong>Getting there:</strong> the Odakyu Romancecar from Shinjuku, about 1 h 20 to Hakone-Yumoto.</li><li><strong>The loop:</strong> a boat across Lake Ashi and the ropeway over Owakudani, the steaming volcanic valley (access is sometimes restricted depending on volcanic activity).</li><li><strong>Hakone Open-Air Museum:</strong> an outdoor sculpture museum.</li><li><strong>Onsen:</strong> Hakone is a hot-spring area, a good way to end the day.</li></ul>`],
      ['3. The coast: Yokohama, Kamakura-Kokomae and Enoshima', `<ul class="ozet"><li><strong>Getting there:</strong> the JR Yokosuka Line from Tokyo Station, about an hour to Kamakura with no change, passing near Yokohama.</li><li><strong>Yokohama:</strong> the port, the Minato Mirai waterfront, the Cup Noodles Museum and Chinatown.</li><li><strong>The Enoden line:</strong> a small coastal train past Yuigahama beach and the Kamakura-Kokomae railway crossing made famous by the anime Slam Dunk.</li><li><strong>Enoshima:</strong> a small island linked to the shore by a bridge, with sea views and, on clear days, Mt. Fuji.</li></ul>`],
      ['Which one?', `<table><tr><th></th><th>Fuji lakes</th><th>Hakone</th><th>Coast (Enoshima)</th></tr>
<tr><td>From Tokyo</td><td>About 2 h from Shinjuku</td><td>About 1 h 20 from Shinjuku</td><td>About 1 h from Tokyo Station</td></tr>
<tr><td>Best for</td><td>Seeing Fuji up close</td><td>Lake, volcano, onsen</td><td>A calm day, anime, the sea</td></tr></table>
<p>Fuji often hides in the clouds: winter mornings are usually the clearest. On request, the day can be done by private vehicle with licensed partners.</p>`],
    ],
    faq: [
      ['Can I do Mt. Fuji and Hakone in one day?', 'Not recommended: it takes about 2 hours by bus, with a change at Gotemba, to go from one to the other. Pick one area per day.'],
      ['What is the easiest day trip from Tokyo?', 'The Yokohama and Enoshima coast: about an hour by train from Tokyo Station, with no change to Kamakura.'],
      ['When is Mt. Fuji most visible?', 'Winter mornings are usually the clearest; in summer it is often in the clouds.'],
    ],
    ver: [['Tokyo itineraries: 3, 5 and 7 days', '/en/tokyo-anime-guide/tokyo-itinerary/'], ['First time in Japan', '/en/tokyo-anime-guide/first-time-japan/'], ['The otaku guide to Tokyo', '/en/tokyo-anime-guide/otaku-guide/'], ['Hakone with a private onsen', '/en/tokyo-anime-guide/hakone/'], ['Enoshima and the Kamakura coast', '/en/tokyo-anime-guide/enoshima-kamakura/'], ['Snow trips from Tokyo', '/en/tokyo-anime-guide/snow-trips/']],
    ld: [viajeLd('Day trips from Tokyo', 'International travelers', ETAPAS_EXC)],
  })
}
function arExcursions() {
  return generica({
    lang: 'ar', ruta: '/ar/tokyo/rihlat-min-tokyo/', alterna: 'excursiones', kapak: 'kawaguchiko-fuji', alt: 'جبل فوجي وبحيرة كاواغوتشي', etiqueta: 'رحلات يومية',
    wa: 'السلام عليكم إيهاب، نريد رحلة يومية خاصة من طوكيو (فوجي أو هاكوني أو البحر). التواريخ وعدد الأشخاص: ',
    titre: 'رحلات يومية من طوكيو مع مرشد عربي: جبل فوجي وهاكوني وإينوشيما | إيهاب',
    desc: 'ثلاث رحلات يومية من طوكيو مع مرشد عربي مسلم: جبل فوجي وبحيرة كاواغوتشي، هاكوني (بحيرة آشي والتلفريك وأواكوداني والينابيع الحارة)، وساحل يوكوهاما وإينوشيما. القطارات والمدة والنصائح.',
    h1: 'رحلات يومية من طوكيو: فوجي أم هاكوني أم البحر؟',
    sub: 'ثلاثة أيام كلاسيكية بين البحيرات والوادي البركاني والبحر، مع القطارات والمدة وما يجب معرفته.',
    cevap: 'من طوكيو ثلاث رحلات يومية سهلة: بحيرات فوجي حول كاواغوتشيكو، على بعد نحو ساعتين من شينجوكو بقطار Fuji Excursion المباشر؛ وهاكوني، مع بحيرة آشي والتلفريك ووادي أواكوداني البركاني، على بعد نحو ساعة و20 دقيقة من شينجوكو بقطار Romancecar؛ وساحل يوكوهاما وكاماكورا وإينوشيما، على بعد نحو ساعة من محطة طوكيو بخط JR Yokosuka. اختاروا منطقة واحدة في اليوم: الانتقال من بحيرات فوجي إلى هاكوني يأخذ نحو ساعتين بالحافلة. يرتّب إيهاب اليوم لمجموعتكم بالعربية، مع طعام حلال ووقت للصلاة.',
    secciones: [
      ['1. جبل فوجي وبحيرة كاواغوتشي', `<ul class="ozet"><li><strong>الوصول:</strong> قطار Fuji Excursion المباشر من شينجوكو، نحو ساعتين (أو حافلة سريعة).</li><li><strong>بحيرة كاواغوتشي:</strong> أسهل البحيرات الخمس، ويظهر فيها انعكاس فوجي حين يهدأ الماء.</li><li><strong>أوشينو هاكّاي:</strong> قرية من البرك تغذّيها مياه ينابيع فوجي.</li><li><strong>Fuji-Q Highland:</strong> مدينة ألعاب لمحبي الأفعوانيات.</li></ul>`],
      ['2. هاكوني: بحيرة وتلفريك وينابيع حارة', `<ul class="ozet"><li><strong>الوصول:</strong> قطار Romancecar من شينجوكو، نحو ساعة و20 دقيقة إلى هاكوني-يوموتو.</li><li><strong>الجولة:</strong> عبور بحيرة آشي بالقارب، ثم التلفريك فوق أواكوداني، الوادي البركاني الذي يتصاعد منه البخار (قد يُقيَّد الدخول حسب النشاط البركاني).</li><li><strong>متحف هاكوني في الهواء الطلق:</strong> متحف منحوتات مفتوح.</li><li><strong>الينابيع الحارة (أونسن):</strong> هاكوني منطقة ينابيع حارة، ختام جميل لليوم.</li></ul>`],
      ['3. البحر: يوكوهاما وكاماكورا-كوكوماي وإينوشيما', `<ul class="ozet"><li><strong>الوصول:</strong> خط JR Yokosuka من محطة طوكيو، نحو ساعة إلى كاماكورا بلا تبديل، مرورًا بقرب يوكوهاما.</li><li><strong>يوكوهاما:</strong> الميناء وواجهة ميناتو ميراي البحرية ومتحف Cup Noodles والحي الصيني.</li><li><strong>قطار إينودن الصغير:</strong> يسير على الساحل مرورًا بشاطئ يويغاهاما وتقاطع كاماكورا-كوكوماي الشهير من أنمي Slam Dunk.</li><li><strong>إينوشيما:</strong> جزيرة صغيرة يصلها جسر بالساحل، بإطلالة على البحر وعلى فوجي في الأيام الصافية.</li></ul>`],
      ['أيّها تختارون؟', `<table><tr><th></th><th>بحيرات فوجي</th><th>هاكوني</th><th>الساحل</th></tr>
<tr><td>من طوكيو</td><td>نحو ساعتين من شينجوكو</td><td>نحو ساعة و20 دقيقة من شينجوكو</td><td>نحو ساعة من محطة طوكيو</td></tr>
<tr><td>مناسبة لـ</td><td>رؤية فوجي عن قرب</td><td>بحيرة وبركان وينابيع</td><td>يوم هادئ وبحر</td></tr></table>
<p>كثيرًا ما تُخفي الغيوم جبل فوجي، وصباحات الشتاء هي الأصفى عادةً. وعند الطلب تكون الرحلة بسيارة خاصة مع شركاء مرخّصين.</p>`],
    ],
    faq: [
      ['هل يمكن زيارة فوجي وهاكوني في يوم واحد؟', 'لا ننصح بذلك: الانتقال بينهما يأخذ نحو ساعتين بالحافلة مع تبديل في غوتيمبا. اختاروا منطقة واحدة في اليوم.'],
      ['ما أسهل رحلة يومية من طوكيو؟', 'ساحل يوكوهاما وإينوشيما: نحو ساعة بالقطار من محطة طوكيو، بلا تبديل حتى كاماكورا.'],
      ['متى يظهر جبل فوجي بوضوح؟', 'صباحات الشتاء هي الأصفى عادةً، وفي الصيف يختفي كثيرًا خلف الغيوم.'],
    ],
    ver: [['برنامج طوكيو 3 و5 و7 أيام', '/ar/tokyo/barnamaj-tokyo/'], ['رحلات خاصة لعائلات الخليج', '/ar/tokyo/fakhira/'], ['حلال ومساجد طوكيو', '/ar/tokyo/halal-masajid/'], ['هاكوني وأونسن خاص', '/ar/tokyo/hakone/'], ['إينوشيما وساحل كاماكورا', '/ar/tokyo/enoshima/'], ['الثلج قرب طوكيو', '/ar/tokyo/thalj/']],
    ld: [viajeLd('رحلات يومية من طوكيو', 'Arabic-speaking travelers', ETAPAS_EXC)],
  })
}

// ——— Itinerarios de 3, 5 y 7 días (otaku + ciudad + Fuji) ———
const ETAPAS_IT = ['Akihabara', 'Nakano Broadway', 'Ikebukuro', 'Shibuya', 'Shinjuku', 'Lake Kawaguchi', 'Ueno', 'Tokyo Skytree', 'Odaiba', 'Enoshima', 'Ghibli Museum', 'Nikko']
function frItineraire() {
  return generica({
    lang: 'fr', ruta: '/fr/itineraire-tokyo-3-5-7-jours/', alterna: 'itinerario', kapak: 'shibuya', alt: 'Le carrefour de Shibuya', etiqueta: 'Itinéraires',
    wa: 'Bonjour Iheb, nous préparons un séjour à Tokyo et aimerions votre aide pour l’itinéraire. Dates et nombre de personnes : ',
    titre: 'Itinéraire Tokyo en 3, 5 ou 7 jours : anime, ville et mont Fuji | Guide francophone',
    desc: 'Trois programmes jour par jour pour Tokyo : 3 jours (anime, ville, mont Fuji), 5 jours (avec l’est de Tokyo et la mer) et 7 jours (musée Ghibli, Nikko). Trains, réservations et où loger, avec un guide francophone.',
    h1: 'Tokyo en 3, 5 ou 7 jours : quel programme ?',
    sub: 'Anime, ville moderne et mont Fuji, jour par jour, avec les trains et les réservations à prévoir.',
    cevap: 'En 3 jours, on peut voir l’essentiel de Tokyo en trois thèmes : une journée anime (Akihabara, Nakano Broadway, Ikebukuro), une journée ville (Harajuku, Shibuya, Shinjuku) et une excursion au mont Fuji ou à Hakone. Avec 5 jours, ajoutez l’est et la baie (Ueno, la Tokyo Skytree, Tsukiji, Odaiba) et la côte de Yokohama et Enoshima. Avec 7 jours, ajoutez le musée Ghibli (sur réservation) et la nature de Nikko. Iheb, guide francophone qui vit au Japon, adapte le programme à votre groupe et vous guide les jours que vous choisissez.',
    secciones: [
      ['Tokyo en 3 jours', `<ol class="adimlar"><li><strong>Jour 1, anime :</strong> Akihabara le matin (figurines, jeux rétro, cartes Pokémon chez Hareruya 2), Nakano Broadway à l’ouverture de Mandarake à midi, puis Ikebukuro : Animate et le Pokémon Center Mega Tokyo.</li><li><strong>Jour 2, la ville :</strong> Harajuku et la rue Takeshita, Omotesando, le carrefour de Shibuya et Shibuya PARCO (Nintendo TOKYO, Pokémon Center), le jardin de Shinjuku Gyoen, puis l’observatoire gratuit de la mairie de Tokyo. La Tokyo Camii, à Yoyogi-Uehara, se glisse facilement dans cette journée.</li><li><strong>Jour 3, le mont Fuji :</strong> le lac Kawaguchi (environ 2 heures de Shinjuku en Fuji Excursion) ou Hakone (environ 1 h 20 en Romancecar).</li></ol>`],
      ['Tokyo en 5 jours', `<p>Les trois jours ci-dessus, plus :</p><ol class="adimlar"><li><strong>Jour 4, l’est et la baie :</strong> le parc d’Ueno avec son zoo et le Musée national de Tokyo, la Tokyo Skytree, puis le marché extérieur de Tsukiji, Ginza et Odaiba au coucher du soleil.</li><li><strong>Jour 5, la mer :</strong> Yokohama, le petit train Enoden, le passage à niveau de Kamakura-Kōkōmae et l’île d’Enoshima (environ une heure de la gare de Tokyo).</li></ol>`],
      ['Tokyo en 7 jours', `<p>Les cinq jours ci-dessus, plus :</p><ol class="adimlar"><li><strong>Jour 6, Ghibli et Pokémon :</strong> le musée Ghibli à Mitaka, près du parc d’Inokashira (billets mis en vente le 10 du mois précédent, à 10 h heure du Japon, rien sur place), puis le Pokémon Center Tokyo DX à Nihonbashi, avec le Pokémon Café sur réservation, et Character Street à la gare de Tokyo.</li><li><strong>Jour 7, la nature à Nikko :</strong> la cascade de Kegon (environ 97 mètres) et le lac Chuzenji par la route Irohazaka, à environ 1 h 50 d’Asakusa en Tobu Spacia X. Ou une journée libre pour les derniers achats.</li></ol>`],
      ['Réservations et logement', `<ul class="ozet"><li><strong>Musée Ghibli :</strong> le 10 du mois précédent, à 10 h heure du Japon (<a href="/fr/musee-ghibli-reservation/">comment réserver</a>).</li><li><strong>Pokémon Café :</strong> uniquement sur réservation, à 18 h heure du Japon le jour d’ouverture des créneaux (<a href="/fr/pokemon-cafe-reservation/">comment réserver</a>).</li><li><strong>Où loger :</strong> près d’une gare de la ligne JR Yamanote. Shinjuku ou Shibuya pour l’ouest et les départs vers Hakone et le Fuji ; la gare de Tokyo ou Ueno pour l’est, Nikko, Narita et le Shinkansen.</li></ul>`],
    ],
    faq: [
      ['Combien de jours faut-il pour Tokyo ?', 'Au moins 3 jours pour l’essentiel ; 5 jours pour ajouter l’est de la ville et la mer ; 7 jours pour le musée Ghibli et une journée nature.'],
      ['Peut-on faire le mont Fuji en une journée depuis Tokyo ?', 'Oui : environ 2 heures de Shinjuku jusqu’au lac Kawaguchi en Fuji Excursion, ou 1 h 20 jusqu’à Hakone en Romancecar. Choisissez l’un des deux.'],
      ['Iheb peut-il guider seulement certains jours ?', 'Oui. Il guide les jours que vous choisissez, et vous conseille pour les autres. Tarif sur WhatsApp selon le groupe.'],
    ],
    ver: [['Excursions depuis Tokyo', '/fr/excursions-depuis-tokyo/'], ['Guide anime à Tokyo', '/fr/guide-anime-tokyo/'], ['Que faire à Tokyo', '/fr/que-faire-a-tokyo/'], ['Tokyo depuis le Maghreb', '/fr/tokyo-maghreb/']],
    ld: [viajeLd('Itinéraire Tokyo en 3, 5 ou 7 jours', 'Voyageurs francophones', ETAPAS_IT)],
  })
}
function enItinerary() {
  return generica({
    lang: 'en', ruta: '/en/tokyo-anime-guide/tokyo-itinerary/', alterna: 'itinerario', kapak: 'shibuya', alt: 'Shibuya crossing', etiqueta: 'Itineraries',
    wa: 'Hi Iheb, we are planning a trip to Tokyo and would like help with the itinerary. Dates and group size: ',
    titre: 'Tokyo Itinerary for 3, 5 or 7 Days: Anime, City & Mt. Fuji | Iheb',
    desc: 'Day-by-day Tokyo itineraries: 3 days (anime, city, Mt. Fuji), 5 days (add east Tokyo and the coast) and 7 days (Ghibli Museum, Nikko). Trains, bookings and where to stay, with a private English-speaking guide.',
    h1: 'Tokyo in 3, 5 or 7 days: anime, city and Mt. Fuji',
    sub: 'Day-by-day plans with the trains and the bookings you need, built around what anime fans and first-timers love.',
    cevap: 'In 3 days you can cover Tokyo in three themes: an anime day (Akihabara, Nakano Broadway, Ikebukuro), a city day (Harajuku, Shibuya, Shinjuku) and a Mt. Fuji or Hakone day trip. With 5 days, add the east and the bay (Ueno, Tokyo Skytree, Tsukiji, Odaiba) and the Yokohama–Enoshima coast. With 7 days, add the Ghibli Museum (booked in advance) and the nature of Nikko. Iheb, a private guide who lives in Japan, adapts the plan to your group and guides the days you choose.',
    secciones: [
      ['Tokyo in 3 days', `<ol class="adimlar"><li><strong>Day 1, anime:</strong> Akihabara in the morning (figures, retro games, Pokémon cards at Hareruya 2), Nakano Broadway when Mandarake opens at noon, then Ikebukuro: Animate and Pokémon Center Mega Tokyo. <a href="/en/tokyo-anime-guide/akihabara/">Akihabara</a> · <a href="/en/tokyo-anime-guide/nakano-broadway/">Nakano</a> · <a href="/en/tokyo-anime-guide/ikebukuro/">Ikebukuro</a>.</li><li><strong>Day 2, the city:</strong> Harajuku and Takeshita Street, Omotesando, Shibuya crossing and Shibuya PARCO (Nintendo TOKYO, Pokémon Center), Shinjuku Gyoen garden, then the free observatory at the Tokyo Metropolitan Government Building. Muslim travelers can fit in Tokyo Camii at Yoyogi-Uehara.</li><li><strong>Day 3, Mt. Fuji:</strong> Lake Kawaguchi (about 2 hours from Shinjuku on the Fuji Excursion) or Hakone (about 1 h 20 on the Romancecar). <a href="/en/tokyo-anime-guide/day-trips/">Day trips</a>.</li></ol>`],
      ['Tokyo in 5 days', `<p>The three days above, plus:</p><ol class="adimlar"><li><strong>Day 4, east and the bay:</strong> Ueno Park with its zoo and the Tokyo National Museum, Tokyo Skytree, then the Tsukiji outer market, Ginza and Odaiba at sunset.</li><li><strong>Day 5, the coast:</strong> Yokohama, the Enoden line, the Kamakura-Kokomae crossing and Enoshima island (about an hour from Tokyo Station).</li></ol>`],
      ['Tokyo in 7 days', `<p>The five days above, plus:</p><ol class="adimlar"><li><strong>Day 6, Ghibli and Pokémon:</strong> the Ghibli Museum in Mitaka by Inokashira Park (tickets go on sale on the 10th of the previous month at 10 am Japan time on Lawson Ticket; none at the door), then Pokémon Center Tokyo DX in Nihonbashi, with the Pokémon Café by reservation, and Character Street at Tokyo Station.</li><li><strong>Day 7, nature in Nikko:</strong> Kegon Falls (about 97 m) and Lake Chuzenji up the Irohazaka road, about 1 h 50 from Asakusa on the Tobu Spacia X. Or a free day for last-minute shopping.</li></ol>`],
      ['Bookings and where to stay', `<ul class="ozet"><li><strong>Ghibli Museum:</strong> the 10th of the previous month, 10 am Japan time.</li><li><strong>Pokémon Café:</strong> reservation only, slots open at 6 pm Japan time and go fast.</li><li><strong>Where to stay:</strong> near a JR Yamanote Line station. Shinjuku or Shibuya for the west side and departures to Hakone and Fuji; Tokyo Station or Ueno for the east side, Nikko, Narita and the Shinkansen.</li><li><strong>Tax-free:</strong> bring your passport and keep receipts; the tax is refunded after customs at departure.</li></ul>`],
    ],
    faq: [
      ['How many days do I need in Tokyo?', 'At least 3 days for the essentials; 5 days to add east Tokyo and the coast; 7 days for the Ghibli Museum and a nature day.'],
      ['Can I see Mt. Fuji on a day trip from Tokyo?', 'Yes: about 2 hours from Shinjuku to Lake Kawaguchi on the Fuji Excursion, or 1 h 20 to Hakone on the Romancecar. Pick one of the two.'],
      ['Can Iheb guide only some of the days?', 'Yes. He guides the days you choose and helps you plan the rest. Price per group on WhatsApp.'],
    ],
    ver: [['Day trips from Tokyo', '/en/tokyo-anime-guide/day-trips/'], ['The otaku guide to Tokyo', '/en/tokyo-anime-guide/otaku-guide/'], ['First time in Japan', '/en/tokyo-anime-guide/first-time-japan/'], ['Muslim-friendly Tokyo', '/en/muslim-guide-tokyo/']],
    ld: [viajeLd('Tokyo itinerary: 3, 5 or 7 days', 'Anime fans and first-time travelers', ETAPAS_IT)],
  })
}
function arBarnamaj() {
  return generica({
    lang: 'ar', ruta: '/ar/tokyo/barnamaj-tokyo/', alterna: 'itinerario', kapak: 'shibuya', alt: 'تقاطع شيبويا', etiqueta: 'برامج الرحلة',
    wa: 'السلام عليكم إيهاب، نخطط لرحلة إلى طوكيو ونريد مساعدتك في البرنامج. التواريخ وعدد الأشخاص: ',
    titre: 'برنامج طوكيو 3 أو 5 أو 7 أيام: أنمي ومدينة وجبل فوجي | إيهاب',
    desc: 'برامج يومًا بيوم لطوكيو: 3 أيام (أنمي، مدينة، جبل فوجي)، 5 أيام (شرق طوكيو والبحر)، 7 أيام (متحف جيبلي ونيكّو). القطارات والحجوزات وأين تقيمون، مع مرشد عربي مسلم.',
    h1: 'طوكيو في 3 أو 5 أو 7 أيام: أي برنامج؟',
    sub: 'أنمي ومدينة حديثة وجبل فوجي، يومًا بيوم، مع القطارات والحجوزات، ووقت للصلاة وطعام حلال.',
    cevap: 'في 3 أيام ترون أهم ما في طوكيو في ثلاثة محاور: يوم للأنمي (أكيهابارا، ناكانو برودواي، إيكيبوكورو)، ويوم للمدينة (هاراجوكو، شيبويا، شينجوكو)، ورحلة إلى جبل فوجي أو هاكوني. ومع 5 أيام أضيفوا شرق المدينة والخليج (أوينو، برج طوكيو سكاي تري، تسوكيجي، أوداييبا) وساحل يوكوهاما وإينوشيما. ومع 7 أيام أضيفوا متحف جيبلي (بحجز مسبق) وطبيعة نيكّو. يكيّف إيهاب البرنامج لمجموعتكم ويرافقكم في الأيام التي تختارونها.',
    secciones: [
      ['طوكيو في 3 أيام', `<ol class="adimlar"><li><strong>اليوم 1، الأنمي:</strong> أكيهابارا صباحًا (مجسّمات، ألعاب قديمة، بطاقات بوكيمون في Hareruya 2)، ثم ناكانو برودواي عند افتتاح محلات Mandarake ظهرًا، ثم إيكيبوكورو: Animate ومركز بوكيمون ميغا طوكيو.</li><li><strong>اليوم 2، المدينة:</strong> هاراجوكو وشارع تاكيشيتا، أوموتيساندو، تقاطع شيبويا وShibuya PARCO (Nintendo TOKYO ومركز بوكيمون)، حديقة شينجوكو غيوين، ثم المرصد المجاني في مبنى حكومة طوكيو. ويسهل إدخال جامع طوكيو في يويوغي-أويهارا في هذا اليوم.</li><li><strong>اليوم 3، جبل فوجي:</strong> بحيرة كاواغوتشي (نحو ساعتين من شينجوكو بقطار Fuji Excursion) أو هاكوني (نحو ساعة و20 دقيقة بقطار Romancecar).</li></ol>`],
      ['طوكيو في 5 أيام', `<p>الأيام الثلاثة السابقة، ثم:</p><ol class="adimlar"><li><strong>اليوم 4، الشرق والخليج:</strong> حديقة أوينو مع حديقة الحيوان والمتحف الوطني في طوكيو، ثم برج سكاي تري، ثم سوق تسوكيجي الخارجي وغينزا وأوداييبا عند الغروب.</li><li><strong>اليوم 5، البحر:</strong> يوكوهاما وقطار إينودن وتقاطع كاماكورا-كوكوماي وجزيرة إينوشيما (نحو ساعة من محطة طوكيو).</li></ol>`],
      ['طوكيو في 7 أيام', `<p>الأيام الخمسة السابقة، ثم:</p><ol class="adimlar"><li><strong>اليوم 6، جيبلي وبوكيمون:</strong> متحف جيبلي في ميتاكا قرب حديقة إينوكاشيرا (تُطرح التذاكر يوم 10 من الشهر السابق الساعة 10 صباحًا بتوقيت اليابان، ولا تُباع عند الباب)، ثم مركز بوكيمون طوكيو DX في نيهونباشي مع مقهى بوكيمون بالحجز، وشارع الشخصيات في محطة طوكيو.</li><li><strong>اليوم 7، طبيعة نيكّو:</strong> شلال كيغون (نحو 97 مترًا) وبحيرة تشوزنجي عبر طريق إيروهازاكا، على بعد نحو ساعة و50 دقيقة من أساكوسا بقطار Tobu Spacia X. أو يوم حرّ للتسوّق.</li></ol>`],
      ['الحجوزات والإقامة', `<ul class="ozet"><li><strong>متحف جيبلي:</strong> يوم 10 من الشهر السابق، الساعة 10 صباحًا بتوقيت اليابان.</li><li><strong>مقهى بوكيمون:</strong> بالحجز فقط، وتُفتح المواعيد الساعة 6 مساءً بتوقيت اليابان.</li><li><strong>أين تقيمون:</strong> قرب محطة على خط JR Yamanote الدائري: شينجوكو أو شيبويا للغرب وللانطلاق إلى هاكوني وفوجي؛ محطة طوكيو أو أوينو للشرق ونيكّو وناريتا والقطار السريع.</li></ul>`],
    ],
    faq: [
      ['كم يومًا تحتاج طوكيو؟', '3 أيام على الأقل للأساسيات، و5 أيام لإضافة شرق المدينة والبحر، و7 أيام لمتحف جيبلي ويوم في الطبيعة.'],
      ['هل يمكن زيارة جبل فوجي في يوم واحد من طوكيو؟', 'نعم: نحو ساعتين من شينجوكو إلى بحيرة كاواغوتشي بقطار Fuji Excursion، أو ساعة و20 دقيقة إلى هاكوني بقطار Romancecar. اختاروا واحدة منهما.'],
      ['هل يرافقنا إيهاب في بعض الأيام فقط؟', 'نعم. يرافقكم في الأيام التي تختارونها ويساعدكم في التخطيط لبقية الأيام. السعر على واتساب حسب المجموعة.'],
    ],
    ver: [['رحلات يومية من طوكيو', '/ar/tokyo/rihlat-min-tokyo/'], ['دليل الأنمي وبوكيمون', '/ar/tokyo/anime-pokemon/'], ['من المغرب العربي إلى طوكيو', '/ar/tokyo/maghreb/']],
    ld: [viajeLd('برنامج طوكيو 3 أو 5 أو 7 أيام', 'Arabic-speaking travelers', ETAPAS_IT)],
  })
}

// ——— 7-11-2026: Hakone en familia, la costa de Enoshima, actividades y nieve ———
// Sin santuarios ni templos (Iheb es musulmán): solo naturaleza, mar, talleres y nieve.
const ETAPAS_HAKONE = ['Hakone-Yumoto', 'Hakone Open-Air Museum', 'Owakudani', 'Hakone Ropeway', 'Lake Ashi']
const ETAPAS_COSTA = ['Yokohama', 'Fujisawa', 'Enoshima', 'Kamakura-Kokomae']
const ETAPAS_NIEVE = ['Karuizawa', 'Jigokudani (Nagano)', 'Gotemba (Shizuoka)', 'Lake Kawaguchi']

function frHakone() {
  return generica({
    lang: 'fr', ruta: '/fr/hakone-onsen-prive/', alterna: 'hakone', kapak: 'owakudani', alt: 'La vallée volcanique d’Owakudani et le téléphérique de Hakone', etiqueta: 'Hakone',
    wa: 'Bonjour Iheb, nous voulons passer une ou deux journées à Hakone en famille, avec un onsen privé. Dates et nombre de personnes : ',
    titre: 'Hakone en famille avec un onsen privé : lac Ashi, Owakudani, ryokan | Guide francophone',
    desc: 'Hakone depuis Tokyo avec un guide francophone : la boucle lac Ashi, téléphérique et Owakudani, le musée en plein air, et le choix d’un onsen privé (kashikiri) pour les familles et la pudeur. Trains, pass, conseils.',
    h1: 'Hakone en famille : la boucle du lac et un onsen privé',
    sub: 'Lac, volcan, musée en plein air, et un bain chaud rien que pour vous : la journée la plus douce depuis Tokyo.',
    cevap: 'Hakone est à environ 1 h 20 de Shinjuku en Romancecar. En une journée, on fait la boucle : le petit train de montagne, le funiculaire, le téléphérique au-dessus de la vallée volcanique d’Owakudani, puis le bateau sur le lac Ashi avec le Fuji par temps clair. Pour le bain, les familles et les voyageurs qui tiennent à la pudeur choisissent un onsen privé (kashikiri) ou une chambre avec bain : personne d’autre n’entre. Iheb organise le parcours, les repas halal ou adaptés et les pauses pour la prière.',
    secciones: [
      ['La boucle de Hakone en une journée', `<ol class="adimlar"><li><strong>Hakone-Yumoto :</strong> arrivée en Romancecar depuis Shinjuku (environ 1 h 20, supplément de train express).</li><li><strong>Musée en plein air de Hakone :</strong> des sculptures dans un grand parc, un pavillon Picasso et un bain de pieds chaud. Idéal avec des enfants.</li><li><strong>Téléphérique et Owakudani :</strong> on survole la vallée qui fume ; en bas, les fameux œufs noirs cuits dans la source chaude.</li><li><strong>Lac Ashi :</strong> la traversée en bateau jusqu’au bout du lac, avec le Fuji en face par temps dégagé.</li></ol>
<p>L’accès à Owakudani peut être restreint selon l’activité volcanique : Iheb vérifie le jour même. Le Hakone Freepass d’Odakyu couvre le train de montagne, le funiculaire, le téléphérique, le bateau et les bus de la boucle ; la Romancecar demande un supplément.</p>`],
      ['L’onsen privé : la bonne solution pour les familles', `<ul class="ozet"><li><strong>Kashikiri :</strong> un bain réservé pour 40 à 60 minutes pour votre famille seule, dans beaucoup de ryokans et d’hôtels de Hakone.</li><li><strong>Chambre avec bain :</strong> un bain en plein air sur la terrasse de la chambre, sans horaire.</li><li><strong>Pudeur :</strong> dans les bains communs, on se baigne nu et séparés par sexe ; le bain privé évite la question.</li><li><strong>Repas :</strong> le dîner des ryokans contient souvent du saké, du mirin ou du porc : Iheb demande à l’avance un menu halal ou sans alcool, ou propose un restaurant adapté.</li></ul>`],
      ['Une journée ou une nuit ?', `<table><tr><th></th><th>Journée</th><th>Une nuit en ryokan</th></tr>
<tr><td>Rythme</td><td>Boucle complète, retour le soir</td><td>Boucle le premier jour, musée et lac le second</td></tr>
<tr><td>Onsen</td><td>Bain privé à l’heure dans un hôtel</td><td>Chambre avec bain ou kashikiri le soir</td></tr>
<tr><td>Pour qui</td><td>Séjour court à Tokyo</td><td>Familles, couples, voyage de noces</td></tr></table>
<p>Sur demande, la journée se fait en véhicule privé avec des partenaires agréés, très pratique avec des enfants ou des bagages.</p>`],
    ],
    faq: [
      ['Peut-on aller aux onsen avec des tatouages ou quand on tient à la pudeur ?', 'Le plus simple est un onsen privé (kashikiri) ou une chambre avec bain : vous êtes entre vous, sans règle de tenue ni regard des autres.'],
      ['Combien de temps faut-il pour Hakone ?', 'Une journée suffit pour la boucle depuis Tokyo ; une nuit en ryokan permet de profiter du bain et de ne pas courir.'],
      ['Voit-on le mont Fuji depuis Hakone ?', 'Par temps clair, oui, depuis le lac Ashi et le téléphérique. Les matins d’hiver sont en général les plus dégagés.'],
    ],
    ver: [['Hakone et mont Fuji', '/fr/hakone-mont-fuji/'], ['Excursions d’une journée depuis Tokyo', '/fr/excursions-depuis-tokyo/'], ['La neige depuis Tokyo', '/fr/neige-depuis-tokyo/'], ['Halal et mosquées à Tokyo', '/fr/halal-mosquees-tokyo/']],
    ld: [viajeLd('Hakone en famille avec un onsen privé', 'Familles francophones', ETAPAS_HAKONE)],
  })
}
function enHakone() {
  return generica({
    lang: 'en', ruta: '/en/tokyo-anime-guide/hakone/', alterna: 'hakone', kapak: 'owakudani', alt: 'Owakudani volcanic valley and the Hakone Ropeway', etiqueta: 'Hakone',
    wa: 'Hi Iheb, we would like a private day (or one night) in Hakone with a private onsen. Dates and group size: ',
    titre: 'Hakone with a Private Guide: Lake Ashi, Owakudani and Private Onsen for Families | Iheb',
    desc: 'Hakone from Tokyo with a private guide: the Lake Ashi, ropeway and Owakudani loop, the Open-Air Museum, and how to book a private onsen (kashikiri) for families and modesty. Trains, passes and tips.',
    h1: 'Hakone with your family: the lake loop and a private onsen',
    sub: 'A lake, a volcano valley, an open-air museum and a hot bath just for you: the gentlest day out from Tokyo.',
    cevap: 'Hakone is about 1 h 20 from Shinjuku on the Odakyu Romancecar. In one day you ride the loop: the mountain train, the cable car, the ropeway over the steaming Owakudani valley, then a boat across Lake Ashi with Mt. Fuji on clear days. For bathing, families and modest travelers book a private onsen (kashikiri) or a room with its own bath, so nobody else comes in. Iheb plans the route, halal or Muslim-friendly meals and prayer stops.',
    secciones: [
      ['The Hakone loop in one day', `<ol class="adimlar"><li><strong>Hakone-Yumoto:</strong> arrive on the Romancecar from Shinjuku (about 1 h 20, limited-express surcharge).</li><li><strong>Hakone Open-Air Museum:</strong> sculptures in a big park, a Picasso pavilion and a warm foot bath. Great with kids.</li><li><strong>Ropeway and Owakudani:</strong> fly over the smoking valley and try the black eggs boiled in the hot spring.</li><li><strong>Lake Ashi:</strong> a boat to the far end of the lake, facing Fuji on clear days.</li></ol>
<p>Access to Owakudani can be restricted depending on volcanic activity; Iheb checks on the day. Odakyu’s Hakone Freepass covers the mountain train, cable car, ropeway, boat and loop buses; the Romancecar costs extra.</p>`],
      ['Private onsen: the easy answer for families', `<ul class="ozet"><li><strong>Kashikiri:</strong> a bath reserved for your family alone for 40 to 60 minutes, offered by many Hakone ryokan and hotels.</li><li><strong>Room with a bath:</strong> an open-air tub on your own terrace, any time.</li><li><strong>Modesty:</strong> public baths are nude and separated by gender; a private bath avoids the question, and tattoos are not an issue.</li><li><strong>Dinner:</strong> ryokan meals often use sake, mirin or pork, so Iheb asks ahead for a halal or alcohol-free menu, or books a suitable restaurant.</li></ul>`],
      ['Day trip or one night?', `<table><tr><th></th><th>Day trip</th><th>One night in a ryokan</th></tr>
<tr><td>Pace</td><td>Full loop, back in Tokyo at night</td><td>Loop on day one, museum and lake on day two</td></tr>
<tr><td>Onsen</td><td>A private bath booked by the hour</td><td>Room bath or kashikiri in the evening</td></tr>
<tr><td>Best for</td><td>Short Tokyo stays</td><td>Families, couples, honeymoons</td></tr></table>
<p>On request the day runs by private car with licensed partners, which helps a lot with children or luggage.</p>`],
    ],
    faq: [
      ['Can I use an onsen with tattoos or if I prefer privacy?', 'Yes: book a private onsen (kashikiri) or a room with its own bath. It is just your group, with no dress rules and no one watching.'],
      ['How long do I need in Hakone?', 'One day covers the loop from Tokyo; one night in a ryokan lets you enjoy the bath without rushing.'],
      ['Can you see Mt. Fuji from Hakone?', 'On clear days, yes, from Lake Ashi and the ropeway. Winter mornings are usually the clearest.'],
    ],
    ver: [['Day trips from Tokyo', '/en/tokyo-anime-guide/day-trips/'], ['Snow trips from Tokyo', '/en/tokyo-anime-guide/snow-trips/'], ['Muslim guide in Tokyo', '/en/muslim-guide-tokyo/'], ['Tokyo itinerary: 3, 5 or 7 days', '/en/tokyo-anime-guide/tokyo-itinerary/']],
    ld: [viajeLd('Hakone with a private onsen', 'Families and couples', ETAPAS_HAKONE)],
  })
}
function arHakone() {
  return generica({
    lang: 'ar', ruta: '/ar/tokyo/hakone/', alterna: 'hakone', kapak: 'owakudani', alt: 'وادي أواكوداني البركاني وتلفريك هاكوني', etiqueta: 'هاكوني',
    wa: 'السلام عليكم إيهاب، نريد يومًا أو ليلة في هاكوني مع العائلة وأونسن خاص. التواريخ وعدد الأشخاص: ',
    titre: 'هاكوني مع العائلة وأونسن خاص: بحيرة آشي ووادي أواكوداني | إيهاب مرشد عربي',
    desc: 'هاكوني من طوكيو مع مرشد عربي مسلم: جولة بحيرة آشي والتلفريك ووادي أواكوداني، ومتحف الهواء الطلق، وحجز أونسن خاص (كاشيكيري) للعائلات وللستر. القطارات والتذاكر والطعام الحلال.',
    h1: 'هاكوني مع العائلة: جولة البحيرة وأونسن خاص بكم',
    sub: 'بحيرة ووادٍ بركاني ومتحف في الهواء الطلق، وحمّام ساخن لعائلتكم وحدها: أهدأ يوم من طوكيو.',
    cevap: 'تبعد هاكوني نحو ساعة و20 دقيقة عن شينجوكو بقطار Romancecar. في يوم واحد تكتمل الجولة: قطار الجبل، ثم القطار المعلّق، ثم التلفريك فوق وادي أواكوداني البركاني، ثم القارب في بحيرة آشي مع جبل فوجي في الأيام الصافية. وللاستحمام تختار العائلات أونسن خاصًا (كاشيكيري) أو غرفة فيها حمّامها الخاص، فلا يدخل عليكم أحد. يرتّب إيهاب البرنامج والطعام الحلال ووقفات الصلاة.',
    secciones: [
      ['جولة هاكوني في يوم واحد', `<ol class="adimlar"><li><strong>هاكوني-يوموتو:</strong> الوصول بقطار Romancecar من شينجوكو (نحو ساعة و20 دقيقة، برسوم إضافية للقطار السريع).</li><li><strong>متحف هاكوني في الهواء الطلق:</strong> منحوتات في حديقة واسعة، وجناح بيكاسو، وحوض دافئ للقدمين. ممتاز للأطفال.</li><li><strong>التلفريك ووادي أواكوداني:</strong> تمرّون فوق الوادي الذي يتصاعد منه البخار، وتتذوقون البيض الأسود المسلوق في الينابيع الحارة.</li><li><strong>بحيرة آشي:</strong> رحلة بالقارب إلى طرف البحيرة، وجبل فوجي أمامكم في الأيام الصافية.</li></ol>
<p>قد يُقيَّد الوصول إلى أواكوداني بحسب النشاط البركاني، ويتحقق إيهاب من ذلك في اليوم نفسه. تذكرة Hakone Freepass من Odakyu تشمل قطار الجبل والقطار المعلّق والتلفريك والقارب وحافلات الجولة؛ أما Romancecar فبرسوم إضافية.</p>`],
      ['الأونسن الخاص: الحل الأنسب للعائلة', `<ul class="ozet"><li><strong>كاشيكيري:</strong> حمّام ساخن محجوز لعائلتكم وحدها لمدة 40 إلى 60 دقيقة، متوفّر في كثير من فنادق هاكوني ونُزُل الريوكان.</li><li><strong>غرفة بحمّام خاص:</strong> حوض في الهواء الطلق على شرفة غرفتكم، في أي وقت.</li><li><strong>الستر:</strong> في الحمّامات العامة يستحم الناس عراة مع الفصل بين الرجال والنساء؛ والحمّام الخاص يغنيكم عن ذلك.</li><li><strong>العشاء:</strong> وجبات الريوكان فيها غالبًا ساكي أو ميرين أو لحم خنزير، لذلك يطلب إيهاب مسبقًا وجبة حلال بلا كحول، أو يحجز مطعمًا مناسبًا.</li></ul>`],
      ['يوم واحد أم ليلة؟', `<table><tr><th></th><th>يوم واحد</th><th>ليلة في ريوكان</th></tr>
<tr><td>الإيقاع</td><td>الجولة كاملة والعودة مساءً</td><td>الجولة في اليوم الأول، والمتحف والبحيرة في الثاني</td></tr>
<tr><td>الأونسن</td><td>حمّام خاص بالساعة في فندق</td><td>حمّام الغرفة أو كاشيكيري في المساء</td></tr>
<tr><td>يناسب</td><td>الإقامات القصيرة في طوكيو</td><td>العائلات والأزواج وشهر العسل</td></tr></table>
<p>وعند الطلب يكون اليوم بسيارة خاصة مع شركاء مرخّصين، وهذا مريح جدًا مع الأطفال والحقائب.</p>`],
    ],
    faq: [
      ['هل يمكن الاستمتاع بالأونسن مع الحفاظ على الستر؟', 'نعم: احجزوا أونسن خاصًا (كاشيكيري) أو غرفة فيها حمّامها، فتكونون وحدكم بلا أي إحراج.'],
      ['كم يومًا تحتاج هاكوني؟', 'يوم واحد يكفي للجولة من طوكيو، وليلة في ريوكان تتيح لكم الاستمتاع بالحمّام دون استعجال.'],
      ['هل يُرى جبل فوجي من هاكوني؟', 'نعم في الأيام الصافية، من بحيرة آشي ومن التلفريك. صباحات الشتاء هي الأصفى عادةً.'],
    ],
    ver: [['رحلات يومية من طوكيو', '/ar/tokyo/rihlat-min-tokyo/'], ['الثلج قرب طوكيو', '/ar/tokyo/thalj/'], ['حلال ومساجد طوكيو', '/ar/tokyo/halal-masajid/'], ['طوكيو الفاخرة للعائلات', '/ar/tokyo/fakhira/']],
    ld: [viajeLd('هاكوني مع العائلة وأونسن خاص', 'Arab families', ETAPAS_HAKONE)],
  })
}

function enCosta() {
  return generica({
    lang: 'en', ruta: '/en/tokyo-anime-guide/enoshima-kamakura/', alterna: 'costa', kapak: 'enoshima', alt: 'The harbor of Enoshima Island', etiqueta: 'Enoshima',
    wa: 'Hi Iheb, we would like a day on the coast: Yokohama, Enoshima and the Kamakura-Kokomae crossing. Dates and group size: ',
    titre: 'Enoshima and the Kamakura Coast from Tokyo: Enoden, Slam Dunk Crossing, Sea Candle | Iheb',
    desc: 'A seaside day from Tokyo with a private guide: the Enoden train, the Kamakura-Kokomae crossing from Slam Dunk, Enoshima Island with the Sea Candle and the Iwaya caves, the aquarium and Yokohama on the way back.',
    h1: 'Enoshima and the Kamakura coast: the seaside day out',
    sub: 'An old coastal tram, an anime crossing, an island with caves and a lighthouse, and the sea all day.',
    cevap: 'The coast is the easiest day trip from Tokyo: about an hour by train to Fujisawa or Kamakura, then the small Enoden train that runs along the sea. You stop at the Kamakura-Kokomae crossing made famous by the opening of Slam Dunk, walk across the bridge to Enoshima Island for the Sea Candle observation tower and the Iwaya sea caves, and end at the aquarium or in Yokohama at sunset. A calm day by the sea from start to finish.',
    secciones: [
      ['The route', `<ol class="adimlar"><li><strong>Tokyo → Fujisawa:</strong> about an hour on the JR Tokaido line, or the Odakyu line from Shinjuku to Katase-Enoshima.</li><li><strong>Enoden:</strong> the little green-and-cream train between Fujisawa and Kamakura, often a few meters from the waves.</li><li><strong>Kamakura-Kokomae:</strong> the railway crossing by the sea from the anime. It is a residential street: we stay on the sidewalk and keep it quick.</li><li><strong>Enoshima:</strong> the bridge to the island, the Sea Candle tower (Fuji on clear days), the Iwaya caves at the cliff’s edge and fresh seafood.</li><li><strong>Back:</strong> the New Enoshima Aquarium with its dolphin show, or Minato Mirai in Yokohama at night.</li></ol>`],
      ['Good to know', `<ul class="ozet"><li><strong>Food:</strong> Enoshima is famous for shirasu (tiny white fish) and grilled seafood, a natural fit for a halal-conscious day.</li><li><strong>Prayer:</strong> Iheb plans a quiet stop for the prayer times.</li><li><strong>Crowds:</strong> weekends and summer are busy; a weekday morning is the calmest.</li><li><strong>Stairs:</strong> the island is steep; there are paid outdoor escalators halfway up.</li></ul>`],
    ],
    faq: [
      ['Where is the Slam Dunk crossing?', 'At Kamakura-Kokomae station on the Enoden line, between Fujisawa and Kamakura. Please be quick and polite: people live there.'],
      ['Is Enoshima good with kids?', 'Yes: the aquarium, the caves and the beach are all close to each other, and the train ride itself is fun.'],
      ['Can we combine Enoshima and Yokohama?', 'Yes, they are on the same side of Tokyo: the coast in the day, Yokohama in the evening.'],
    ],
    ver: [['Day trips from Tokyo', '/en/tokyo-anime-guide/day-trips/'], ['Anime pilgrimage and otaku guide', '/en/tokyo-anime-guide/otaku-guide/'], ['Hakone with a private onsen', '/en/tokyo-anime-guide/hakone/']],
    ld: [viajeLd('Enoshima and the Kamakura coast', 'Anime fans and families', ETAPAS_COSTA)],
  })
}
function arCosta() {
  return generica({
    lang: 'ar', ruta: '/ar/tokyo/enoshima/', alterna: 'costa', kapak: 'enoshima', alt: 'ميناء جزيرة إينوشيما', etiqueta: 'إينوشيما',
    wa: 'السلام عليكم إيهاب، نريد يومًا على البحر: يوكوهاما وإينوشيما ومعبر كاماكورا-كوكوماي. التواريخ وعدد الأشخاص: ',
    titre: 'إينوشيما وساحل كاماكورا من طوكيو: قطار إينودين ومعبر سلام دانك والكهوف | إيهاب',
    desc: 'يوم على البحر من طوكيو مع مرشد عربي مسلم: قطار إينودين على الساحل، ومعبر كاماكورا-كوكوماي من أنمي سلام دانك، وجزيرة إينوشيما مع برج Sea Candle وكهوف إيوايا، والأكواريوم ويوكوهاما في المساء.',
    h1: 'إينوشيما وساحل كاماكورا: يوم كامل على البحر',
    sub: 'قطار قديم على الشاطئ، ومعبر من الأنمي، وجزيرة فيها كهوف ومنارة، والبحر طوال اليوم.',
    cevap: 'الساحل هو أسهل رحلة يومية من طوكيو: نحو ساعة بالقطار إلى فوجيساوا أو كاماكورا، ثم قطار إينودين الصغير الذي يسير بمحاذاة البحر. تتوقفون عند معبر كاماكورا-كوكوماي الذي اشتهر في مقدمة أنمي سلام دانك، ثم تعبرون الجسر إلى جزيرة إينوشيما لبرج Sea Candle وكهوف إيوايا البحرية، وتختمون بالأكواريوم أو بيوكوهاما عند الغروب. يوم هادئ على البحر بلا زيارة للمعابد.',
    secciones: [
      ['البرنامج', `<ol class="adimlar"><li><strong>طوكيو ← فوجيساوا:</strong> نحو ساعة بخط JR Tokaido، أو بخط Odakyu من شينجوكو إلى كاتاسي-إينوشيما.</li><li><strong>قطار إينودين:</strong> القطار الأخضر الصغير بين فوجيساوا وكاماكورا، وأحيانًا على بعد أمتار من الأمواج.</li><li><strong>كاماكورا-كوكوماي:</strong> معبر السكة الحديدية على البحر من الأنمي. الشارع سكني، فنقف على الرصيف ولا نطيل.</li><li><strong>إينوشيما:</strong> الجسر إلى الجزيرة، وبرج Sea Candle (وفوجي في الأيام الصافية)، وكهوف إيوايا عند حافة الجرف، والمأكولات البحرية الطازجة.</li><li><strong>العودة:</strong> أكواريوم إينوشيما الجديد مع عرض الدلافين، أو ميناتو ميراي في يوكوهاما ليلًا.</li></ol>`],
      ['معلومات مفيدة', `<ul class="ozet"><li><strong>الطعام:</strong> تشتهر إينوشيما بالشيراسو (سمك أبيض صغير) والمأكولات البحرية المشوية، وهي مناسبة ليوم حلال.</li><li><strong>الصلاة:</strong> يرتّب إيهاب وقفة هادئة في أوقات الصلاة.</li><li><strong>الزحام:</strong> عطلة نهاية الأسبوع والصيف مزدحمة؛ وصباح أيام الأسبوع أهدأ.</li><li><strong>الدرج:</strong> الجزيرة مرتفعة، وفي منتصف الطريق سلالم كهربائية مدفوعة.</li></ul>`],
    ],
    faq: [
      ['أين معبر سلام دانك؟', 'عند محطة كاماكورا-كوكوماي على خط إينودين بين فوجيساوا وكاماكورا. نرجو الهدوء والاحترام، فالناس يسكنون هناك.'],
      ['هل إينوشيما مناسبة للأطفال؟', 'نعم: الأكواريوم والكهوف والشاطئ قريبة من بعضها، وركوب القطار نفسه ممتع.'],
      ['هل نجمع إينوشيما ويوكوهاما في يوم واحد؟', 'نعم، فهما في الجهة نفسها من طوكيو: الساحل نهارًا ويوكوهاما مساءً.'],
    ],
    ver: [['رحلات يومية من طوكيو', '/ar/tokyo/rihlat-min-tokyo/'], ['دليل الأنمي وبوكيمون', '/ar/tokyo/anime-pokemon/'], ['هاكوني وأونسن خاص', '/ar/tokyo/hakone/']],
    ld: [viajeLd('إينوشيما وساحل كاماكورا', 'Arab families and anime fans', ETAPAS_COSTA)],
  })
}

function frActivites() {
  return generica({
    lang: 'fr', ruta: '/fr/activites-ateliers-tokyo/', alterna: 'actividades', kapak: 'odaiba', alt: 'Le Rainbow Bridge et la baie de Tokyo à Odaiba', etiqueta: 'Activités',
    wa: 'Bonjour Iheb, nous cherchons des activités à Tokyo (atelier, sumo, art numérique, cueillette…). Dates, âges et nombre de personnes : ',
    titre: 'Activités et ateliers à Tokyo : sushi, ninja, sumo, teamLab, cueillette de fraises | Guide francophone',
    desc: 'Les activités qui marquent un séjour à Tokyo, choisies par un guide francophone musulman : atelier de sushi sans alcool, initiation ninja, sumo, musées d’art numérique teamLab, kimono adapté au hijab, cueillette de fraises en hiver.',
    h1: 'Activités à Tokyo : ce qu’on fait de ses mains',
    sub: 'Ateliers, sport, art numérique et nature : les souvenirs qu’on raconte en rentrant, avec un guide qui parle votre langue.',
    cevap: 'À Tokyo, les activités qui plaisent le plus aux familles et aux groupes sont : un atelier de sushi ou de pâtisserie japonaise (wagashi), une initiation ninja ou samouraï, un tournoi ou un entraînement de sumo, les musées d’art numérique teamLab, la location de kimono avec un style adapté au hijab et, de janvier à mai, la cueillette de fraises près de Tokyo. Iheb réserve, traduit et vérifie avec chaque atelier les ingrédients (sans porc ni alcool) et les horaires de prière.',
    secciones: [
      ['Ateliers et expériences', `<ul class="ozet"><li><strong>Sushi et wagashi :</strong> on apprend à rouler des sushis ou à modeler des pâtisseries japonaises ; Iheb demande une préparation sans mirin ni saké.</li><li><strong>Ninja et samouraï :</strong> une heure d’initiation au sabre, aux shurikens et à la discrétion, très aimée des enfants.</li><li><strong>Kimono :</strong> location à la journée ; certaines boutiques coiffent avec le hijab et proposent des modèles longs.</li><li><strong>Dessin manga :</strong> un cours avec un illustrateur, pour les fans d’anime.</li></ul>`],
      ['Sumo, art numérique et grands parcs', `<ul class="ozet"><li><strong>Sumo :</strong> les tournois de Tokyo ont lieu au Ryōgoku Kokugikan en janvier, mai et septembre ; hors tournoi, certaines écuries acceptent des visiteurs à l’entraînement du matin.</li><li><strong>teamLab :</strong> Planets à Toyosu (on marche pieds nus dans l’eau, jusqu’aux genoux) et Borderless à Azabudai Hills.</li><li><strong>Parcs :</strong> Tokyo Disneyland et DisneySea à Urayasu, Sanrio Puroland à Tama.</li><li><strong>Vues :</strong> Shibuya Sky au coucher du soleil, le Skytree et la baie d’Odaiba le soir.</li></ul>`],
      ['Cueillette de fraises (janvier à mai)', `<p>L’ichigo-gari, la cueillette de fraises à volonté dans des serres, est une sortie d’hiver très japonaise et parfaite avec des enfants. On la trouve autour de Tokyo, dans la péninsule d’Izu (Shizuoka) et vers le Fuji. Les créneaux se réservent, surtout le week-end.</p>`],
    ],
    faq: [
      ['Les ateliers de cuisine sont-ils halal ?', 'Pas automatiquement : la cuisine japonaise utilise souvent du mirin et du saké. Iheb choisit des ateliers qui acceptent une préparation sans alcool ni porc, et le confirme à l’avance.'],
      ['Quand voir le sumo à Tokyo ?', 'Pendant les tournois de janvier, mai et septembre au Ryōgoku Kokugikan. Le reste de l’année, on peut parfois assister à un entraînement du matin.'],
      ['Quelles activités pour de jeunes enfants ?', 'L’initiation ninja, teamLab, la cueillette de fraises et l’aquarium d’Enoshima sont les favoris des familles.'],
    ],
    ver: [['Que faire à Tokyo', '/fr/que-faire-a-tokyo/'], ['Tokyo en famille', '/fr/tokyo-en-famille/'], ['Guide anime et Pokémon', '/fr/guide-anime-tokyo/'], ['La neige depuis Tokyo', '/fr/neige-depuis-tokyo/']],
  })
}
function enActividades() {
  return generica({
    lang: 'en', ruta: '/en/tokyo-anime-guide/experiences/', alterna: 'actividades', kapak: 'odaiba', alt: 'Rainbow Bridge and Tokyo Bay in Odaiba', etiqueta: 'Experiences',
    wa: 'Hi Iheb, we are looking for experiences in Tokyo (a class, sumo, teamLab, strawberry picking…). Dates, ages and group size: ',
    titre: 'Things to Do in Tokyo: Sushi Class, Ninja, Sumo, teamLab, Strawberry Picking | Private Guide Iheb',
    desc: 'Hands-on Tokyo experiences picked by a Muslim private guide: an alcohol-free sushi class, ninja training, sumo, teamLab digital art, hijab-friendly kimono and winter strawberry picking. Booked and translated for you.',
    h1: 'Tokyo experiences: the things you do, not just see',
    sub: 'Classes, sport, digital art and the outdoors: the memories people talk about back home.',
    cevap: 'The Tokyo experiences families and groups love most are a sushi or wagashi (Japanese sweets) class, a ninja or samurai lesson, a sumo tournament or morning practice, the teamLab digital art museums, kimono rental with hijab-friendly styling and, from January to May, strawberry picking near Tokyo. Iheb books them, translates and checks ingredients (no pork, no alcohol) and prayer times with each provider.',
    secciones: [
      ['Classes and experiences', `<ul class="ozet"><li><strong>Sushi and wagashi:</strong> roll your own sushi or shape Japanese sweets; Iheb asks for a version without mirin or sake.</li><li><strong>Ninja and samurai:</strong> an hour of sword moves, throwing stars and stealth, a favorite with kids.</li><li><strong>Kimono:</strong> rent one for the day; some shops style it with a hijab and offer longer sleeves.</li><li><strong>Manga drawing:</strong> a lesson with an illustrator, for anime fans.</li></ul>`],
      ['Sumo, digital art and theme parks', `<ul class="ozet"><li><strong>Sumo:</strong> Tokyo tournaments are held at the Ryogoku Kokugikan in January, May and September; outside them, some stables accept visitors at morning practice.</li><li><strong>teamLab:</strong> Planets in Toyosu (barefoot, knee-deep water) and Borderless at Azabudai Hills.</li><li><strong>Theme parks:</strong> Tokyo Disneyland and DisneySea in Urayasu, Sanrio Puroland in Tama.</li><li><strong>Views:</strong> Shibuya Sky at sunset, the Skytree and Odaiba bay at night.</li></ul>`],
      ['Strawberry picking (January to May)', `<p>Ichigo-gari, all-you-can-eat strawberry picking in greenhouses, is a very Japanese winter outing and perfect with children. You find it around Tokyo, on the Izu Peninsula (Shizuoka) and near Fuji. Slots need booking, especially on weekends.</p>`],
    ],
    faq: [
      ['Are Tokyo cooking classes halal?', 'Not by default: Japanese cooking often uses mirin and sake. Iheb picks classes that agree to cook without alcohol or pork and confirms it in advance.'],
      ['When can I see sumo in Tokyo?', 'During the January, May and September tournaments at the Ryogoku Kokugikan; the rest of the year, sometimes at a stable’s morning practice.'],
      ['What is best for young kids?', 'Ninja lessons, teamLab, strawberry picking and the Enoshima aquarium are family favorites.'],
    ],
    ver: [['Otaku guide to Tokyo', '/en/tokyo-anime-guide/otaku-guide/'], ['First time in Japan', '/en/tokyo-anime-guide/first-time-japan/'], ['Snow trips from Tokyo', '/en/tokyo-anime-guide/snow-trips/'], ['Muslim guide in Tokyo', '/en/muslim-guide-tokyo/']],
  })
}
function arActividades() {
  return generica({
    lang: 'ar', ruta: '/ar/tokyo/anshita/', alterna: 'actividades', kapak: 'odaiba', alt: 'جسر قوس قزح وخليج طوكيو في أوداييبا', etiqueta: 'أنشطة',
    wa: 'السلام عليكم إيهاب، نبحث عن أنشطة في طوكيو (ورشة، سومو، تيم لاب، قطف الفراولة…). التواريخ وأعمار الأطفال وعدد الأشخاص: ',
    titre: 'أنشطة طوكيو للعائلات: ورشة سوشي، نينجا، سومو، تيم لاب، قطف الفراولة | إيهاب',
    desc: 'أنشطة طوكيو التي يختارها مرشد عربي مسلم: ورشة سوشي بلا كحول، تدريب نينجا، السومو، متاحف تيم لاب الرقمية، كيمونو مع الحجاب، وقطف الفراولة في الشتاء. الحجز والترجمة عليه.',
    h1: 'أنشطة طوكيو: تجارب تعيشونها لا تكتفون بمشاهدتها',
    sub: 'ورش ورياضة وفن رقمي وطبيعة: الذكريات التي تحكونها عند العودة.',
    cevap: 'أكثر ما تحبه العائلات والمجموعات في طوكيو: ورشة سوشي أو حلويات يابانية (واغاشي)، ودرس نينجا أو ساموراي، ومباراة سومو أو تدريبه الصباحي، ومتاحف تيم لاب للفن الرقمي، واستئجار الكيمونو بتنسيق يناسب الحجاب، ومن يناير إلى مايو قطف الفراولة قرب طوكيو. يحجز إيهاب ويترجم ويتأكد مع كل جهة من المكونات (بلا خنزير ولا كحول) ومن أوقات الصلاة.',
    secciones: [
      ['ورش وتجارب', `<ul class="ozet"><li><strong>السوشي والواغاشي:</strong> تلفّون السوشي بأيديكم أو تشكّلون الحلويات اليابانية، ويطلب إيهاب تحضيرها بلا ميرين ولا ساكي.</li><li><strong>النينجا والساموراي:</strong> ساعة من حركات السيف ونجوم الرمي والتخفّي، يحبها الأطفال كثيرًا.</li><li><strong>الكيمونو:</strong> استئجار ليوم كامل؛ وبعض المحلات تنسّقه مع الحجاب وتوفّر أكمامًا طويلة.</li><li><strong>رسم المانغا:</strong> درس مع رسّام، لعشّاق الأنمي.</li></ul>`],
      ['السومو والفن الرقمي والمدن الترفيهية', `<ul class="ozet"><li><strong>السومو:</strong> تُقام بطولات طوكيو في قاعة ريوغوكو كوكوغيكان في يناير ومايو وسبتمبر؛ وفي غيرها تستقبل بعض الأندية الزوار في التدريب الصباحي.</li><li><strong>تيم لاب:</strong> Planets في تويوسو (حفاة في ماء يصل إلى الركبة) وBorderless في أزابوداي هيلز.</li><li><strong>المدن الترفيهية:</strong> ديزني لاند وديزني سي في أوراياسو، وسانريو بيورولاند في تاما.</li><li><strong>الإطلالات:</strong> Shibuya Sky عند الغروب، وسكاي تري، وخليج أوداييبا ليلًا.</li></ul>`],
      ['قطف الفراولة (من يناير إلى مايو)', `<p>«إيتشيغو-غاري»، أي قطف الفراولة والأكل منها بلا حدود داخل البيوت الزراعية، نزهة شتوية يابانية ممتعة جدًا للأطفال. تجدونها حول طوكيو، وفي شبه جزيرة إيزو (شيزوؤكا) وقرب جبل فوجي. المواعيد بالحجز، خاصة في عطلة نهاية الأسبوع.</p>`],
    ],
    faq: [
      ['هل ورش الطبخ في طوكيو حلال؟', 'ليس تلقائيًا، فالمطبخ الياباني يستعمل الميرين والساكي كثيرًا. يختار إيهاب ورشًا تقبل الطبخ بلا كحول ولا خنزير ويتأكد من ذلك مسبقًا.'],
      ['متى نشاهد السومو في طوكيو؟', 'في بطولات يناير ومايو وسبتمبر في ريوغوكو كوكوغيكان، وفي بقية السنة أحيانًا في التدريب الصباحي لأحد الأندية.'],
      ['ما الأنسب للأطفال الصغار؟', 'درس النينجا وتيم لاب وقطف الفراولة وأكواريوم إينوشيما هي المفضّلة لدى العائلات.'],
    ],
    ver: [['طوكيو الفاخرة للعائلات', '/ar/tokyo/fakhira/'], ['دليل الأنمي وبوكيمون', '/ar/tokyo/anime-pokemon/'], ['الثلج قرب طوكيو', '/ar/tokyo/thalj/'], ['حلال ومساجد طوكيو', '/ar/tokyo/halal-masajid/']],
  })
}

function frNeige() {
  return generica({
    lang: 'fr', ruta: '/fr/neige-depuis-tokyo/', alterna: 'nieve', kapak: 'singes-jigokudani', alt: 'Un singe des neiges dans une source chaude à Jigokudani', etiqueta: 'Neige',
    wa: 'Bonjour Iheb, nous voulons voir la neige depuis Tokyo (luge, ski ou singes des neiges). Dates, âges et nombre de personnes : ',
    titre: 'La neige depuis Tokyo : Karuizawa, singes des neiges de Nagano, luge près du Fuji | Guide francophone',
    desc: 'Voir la neige en hiver depuis Tokyo avec un guide francophone : ski et luge à Karuizawa (environ 1 h en shinkansen), les singes des neiges de Jigokudani à Nagano, la neige près du Fuji. Saisons, trains, vêtements.',
    h1: 'La neige depuis Tokyo : luge, ski et singes des neiges',
    sub: 'Il neige rarement à Tokyo, mais la neige est à une heure de train. De décembre à mars, la journée préférée des familles.',
    cevap: 'Depuis Tokyo, trois sorties neige sont simples : Karuizawa, à environ 1 h 10 en shinkansen, avec une station de ski collée à la gare et un grand centre commercial ; les singes des neiges de Jigokudani, qui se baignent dans les sources chaudes près de Nagano (environ 1 h 20 de shinkansen, puis bus et 30 minutes de marche en forêt) ; et la neige au pied du Fuji, côté Shizuoka ou Kawaguchiko, avec luge pour les enfants. La meilleure période va de janvier à février.',
    secciones: [
      ['1. Karuizawa : ski, luge et shopping', `<ul class="ozet"><li><strong>Accès :</strong> shinkansen Hokuriku depuis Tokyo ou Ueno, environ 1 h 10.</li><li><strong>Sur place :</strong> la station de ski du Karuizawa Prince Hotel est juste à côté de la gare, avec des pentes douces pour débuter et un espace pour les enfants.</li><li><strong>Shopping :</strong> le grand centre Karuizawa Prince Shopping Plaza est au même endroit.</li></ul>`],
      ['2. Les singes des neiges de Nagano', `<ul class="ozet"><li><strong>Accès :</strong> shinkansen jusqu’à Nagano (environ 1 h 20), puis bus et une marche de 30 minutes sur un chemin en forêt, souvent enneigé.</li><li><strong>Le spectacle :</strong> des macaques qui se réchauffent dans une source chaude au milieu de la neige.</li><li><strong>Conseil :</strong> chaussures avec crampons ou bottes de neige ; Iheb vous dit où en louer.</li></ul>`],
      ['3. La neige au pied du Fuji', `<p>Côté Shizuoka (près de Gotemba) et côté Kawaguchiko, de petites stations ouvrent de la fin de l’automne au début du printemps, avec luge et neige pour les enfants, et le Fuji tout près. On peut le combiner avec Hakone ou les lacs.</p>`],
      ['S’habiller et prier', `<ul class="ozet"><li><strong>Vêtements :</strong> on loue sur place combinaisons, gants et bottes ; venez avec des sous-vêtements chauds.</li><li><strong>Prière :</strong> Iheb prévoit un endroit chauffé et calme pour les prières de la journée.</li><li><strong>Repas :</strong> plats de poisson, de légumes ou halal, choisis à l’avance.</li></ul>`],
    ],
    faq: [
      ['Neige-t-il à Tokyo ?', 'Rarement, et ça ne tient pas. Pour la vraie neige, il faut aller à Karuizawa, à Nagano ou vers le Fuji, à une ou deux heures de train.'],
      ['Quand voit-on les singes des neiges ?', 'Toute l’année, mais avec de la neige surtout de janvier à février.'],
      ['Faut-il savoir skier ?', 'Non : la luge et les jeux dans la neige suffisent aux enfants, et des moniteurs donnent des cours pour débutants.'],
    ],
    ver: [['Hakone en famille avec un onsen privé', '/fr/hakone-onsen-prive/'], ['Nagano', '/fr/nagano/'], ['Quand partir au Japon', '/fr/quand-partir-japon/'], ['Activités et ateliers à Tokyo', '/fr/activites-ateliers-tokyo/']],
    ld: [viajeLd('La neige depuis Tokyo', 'Familles francophones', ETAPAS_NIEVE)],
  })
}
function enNieve() {
  return generica({
    lang: 'en', ruta: '/en/tokyo-anime-guide/snow-trips/', alterna: 'nieve', kapak: 'singes-jigokudani', alt: 'A snow monkey in a hot spring at Jigokudani', etiqueta: 'Snow',
    wa: 'Hi Iheb, we would like to see snow from Tokyo (sledding, skiing or the snow monkeys). Dates, ages and group size: ',
    titre: 'Snow Trips from Tokyo: Karuizawa, Nagano Snow Monkeys, Sledding near Mt. Fuji | Private Guide',
    desc: 'See real snow on a day trip from Tokyo with a private guide: skiing and sledding in Karuizawa (about an hour by shinkansen), the Jigokudani snow monkeys in Nagano and snow at the foot of Mt. Fuji. Seasons, trains and what to wear.',
    h1: 'Snow from Tokyo: sledding, skiing and snow monkeys',
    sub: 'Tokyo rarely gets snow, but it is an hour away by train. From December to March, the families’ favorite day.',
    cevap: 'Three snow days from Tokyo are easy: Karuizawa, about 1 h 10 by shinkansen, with a ski slope next to the station and a big outlet mall; the Jigokudani snow monkeys bathing in hot springs near Nagano (about 1 h 20 by shinkansen, then a bus and a 30-minute forest walk); and snow at the foot of Mt. Fuji on the Shizuoka or Kawaguchiko side, with sledding for kids. January and February are the best months.',
    secciones: [
      ['1. Karuizawa: skiing, sledding and shopping', `<ul class="ozet"><li><strong>Getting there:</strong> Hokuriku shinkansen from Tokyo or Ueno, about 1 h 10.</li><li><strong>On site:</strong> the Karuizawa Prince Hotel ski area sits right by the station, with gentle beginner slopes and a kids’ snow area.</li><li><strong>Shopping:</strong> the large Karuizawa Prince Shopping Plaza is in the same place.</li></ul>`],
      ['2. The Nagano snow monkeys', `<ul class="ozet"><li><strong>Getting there:</strong> shinkansen to Nagano (about 1 h 20), then a bus and a 30-minute walk on a forest trail that is often snowy.</li><li><strong>The scene:</strong> wild macaques warming up in a hot spring surrounded by snow.</li><li><strong>Tip:</strong> boots with grip or snow boots; Iheb tells you where to rent them.</li></ul>`],
      ['3. Snow at the foot of Mt. Fuji', `<p>On the Shizuoka side (near Gotemba) and the Kawaguchiko side, small snow parks open from late autumn to early spring, with sledding and snow play for kids and Fuji right above you. It pairs well with Hakone or the lakes.</p>`],
      ['What to wear, where to pray', `<ul class="ozet"><li><strong>Clothes:</strong> snow suits, gloves and boots can be rented on site; bring warm base layers.</li><li><strong>Prayer:</strong> Iheb plans a warm, quiet place for the day’s prayers.</li><li><strong>Meals:</strong> fish, vegetable or halal dishes, chosen in advance.</li></ul>`],
    ],
    faq: [
      ['Does it snow in Tokyo?', 'Rarely, and it melts fast. For real snow go to Karuizawa, Nagano or the Fuji area, one to two hours by train.'],
      ['When can you see the snow monkeys?', 'All year, but with snow mostly in January and February.'],
      ['Do we need to know how to ski?', 'No: sledding and snow play are plenty for kids, and instructors teach beginners.'],
    ],
    ver: [['Hakone with a private onsen', '/en/tokyo-anime-guide/hakone/'], ['Day trips from Tokyo', '/en/tokyo-anime-guide/day-trips/'], ['Arabic-speaking guide for Gulf families', '/en/arabic-speaking-guide-tokyo/'], ['Tokyo experiences', '/en/tokyo-anime-guide/experiences/']],
    ld: [viajeLd('Snow trips from Tokyo', 'Families', ETAPAS_NIEVE)],
  })
}
function arNieve() {
  return generica({
    lang: 'ar', ruta: '/ar/tokyo/thalj/', alterna: 'nieve', kapak: 'singes-jigokudani', alt: 'قرد الثلج في نبع ساخن في جيغوكوداني', etiqueta: 'الثلج',
    wa: 'السلام عليكم إيهاب، نريد أن نرى الثلج قرب طوكيو مع العائلة (تزلّج أو زلّاجات أو قرود الثلج). التواريخ وأعمار الأطفال وعدد الأشخاص: ',
    titre: 'الثلج قرب طوكيو للعائلات: كارويزاوا وقرود الثلج في ناغانو والتزلّج عند جبل فوجي | إيهاب',
    desc: 'شاهدوا الثلج الحقيقي في رحلة يومية من طوكيو مع مرشد عربي مسلم: التزلّج والزلّاجات في كارويزاوا (نحو ساعة بالشينكانسن)، وقرود الثلج في جيغوكوداني بناغانو، والثلج عند سفح جبل فوجي. المواسم والقطارات والملابس والصلاة.',
    h1: 'الثلج قرب طوكيو: زلّاجات وتزلّج وقرود الثلج',
    sub: 'نادرًا ما تثلج في طوكيو، لكن الثلج على بعد ساعة بالقطار. من ديسمبر إلى مارس، اليوم المفضّل لدى العائلات الخليجية.',
    cevap: 'من طوكيو ثلاث رحلات ثلج سهلة: كارويزاوا على بعد نحو ساعة و10 دقائق بالشينكانسن، وفيها منحدر تزلّج بجانب المحطة ومركز تسوّق كبير؛ وقرود الثلج في جيغوكوداني التي تستحم في الينابيع الحارة قرب ناغانو (نحو ساعة و20 دقيقة بالشينكانسن، ثم حافلة ومشي 30 دقيقة في الغابة)؛ والثلج عند سفح جبل فوجي من جهة شيزوؤكا أو كاواغوتشيكو مع الزلّاجات للأطفال. أفضل وقت يناير وفبراير.',
    secciones: [
      ['1. كارويزاوا: تزلّج وزلّاجات وتسوّق', `<ul class="ozet"><li><strong>الوصول:</strong> شينكانسن هوكوريكو من طوكيو أو أوينو، نحو ساعة و10 دقائق.</li><li><strong>هناك:</strong> منتجع التزلّج في فندق Karuizawa Prince بجوار المحطة، بمنحدرات سهلة للمبتدئين ومنطقة ثلج للأطفال.</li><li><strong>التسوّق:</strong> مركز Karuizawa Prince Shopping Plaza الكبير في المكان نفسه.</li></ul>`],
      ['2. قرود الثلج في ناغانو', `<ul class="ozet"><li><strong>الوصول:</strong> الشينكانسن إلى ناغانو (نحو ساعة و20 دقيقة)، ثم حافلة ومشي 30 دقيقة في طريق غابة يغطيه الثلج غالبًا.</li><li><strong>المشهد:</strong> قرود برية تتدفأ في نبع ساخن وسط الثلج.</li><li><strong>نصيحة:</strong> أحذية مانعة للانزلاق أو أحذية ثلج، ويخبركم إيهاب أين تستأجرونها.</li></ul>`],
      ['3. الثلج عند سفح جبل فوجي', `<p>من جهة شيزوؤكا (قرب غوتيمبا) ومن جهة كاواغوتشيكو، تفتح حدائق ثلج صغيرة من أواخر الخريف إلى بداية الربيع، فيها زلّاجات ولعب بالثلج للأطفال وجبل فوجي فوقكم. ويمكن جمعها مع هاكوني أو البحيرات.</p>`],
      ['الملابس والصلاة والطعام', `<ul class="ozet"><li><strong>الملابس:</strong> تُستأجر بدلات الثلج والقفازات والأحذية في المكان؛ أحضروا ملابس داخلية دافئة.</li><li><strong>الصلاة:</strong> يرتّب إيهاب مكانًا دافئًا وهادئًا لصلوات اليوم.</li><li><strong>الطعام:</strong> أطباق سمك أو خضار أو حلال، نختارها مسبقًا.</li></ul>`],
    ],
    faq: [
      ['هل تثلج في طوكيو؟', 'نادرًا، ويذوب الثلج بسرعة. للثلج الحقيقي اذهبوا إلى كارويزاوا أو ناغانو أو منطقة فوجي، على بعد ساعة أو ساعتين بالقطار.'],
      ['متى نرى قرود الثلج؟', 'طوال السنة، لكن مع الثلج غالبًا في يناير وفبراير.'],
      ['هل يجب أن نعرف التزلّج؟', 'لا: الزلّاجات واللعب بالثلج يكفيان للأطفال، وهناك مدرّبون يعلّمون المبتدئين.'],
    ],
    ver: [['هاكوني وأونسن خاص', '/ar/tokyo/hakone/'], ['طوكيو الفاخرة للعائلات', '/ar/tokyo/fakhira/'], ['رحلات يومية من طوكيو', '/ar/tokyo/rihlat-min-tokyo/'], ['أنشطة طوكيو للعائلات', '/ar/tokyo/anshita/']],
    ld: [viajeLd('الثلج قرب طوكيو', 'Gulf Arab families', ETAPAS_NIEVE)],
  })
}

const hechas = [frHakone(), enHakone(), arHakone(), enCosta(), arCosta(), frActivites(), enActividades(), arActividades(), frNeige(), enNieve(), arNieve(), frMaghreb(), arMaghreb(), frExcursions(), enExcursions(), arExcursions(), frItineraire(), enItinerary(), arBarnamaj(), enAkihabara(), enNakano(), enIkebukuro(), enMuslim(), arFakhira(), enGcc(), arPortada(), arHalal(), arAnime(), arWakalat(), enPortada(), enAgencias(), enOtaku(), enPrimera(), frQuebec()]
console.log(`iheb: ${hechas.length} páginas → ${hechas.map((r) => `/${r}/`).join(' ')}`)
