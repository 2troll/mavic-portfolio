// Estilo «anime» de las páginas de Iheb (/fr/, /ar/tokyo/, /en/tokyo-anime-guide/).
// 4-11-2026 (Tony): que parezca anime y cartas coleccionables, lo que gusta al
// público americano y otaku. Diseño PROPIO: viñetas de manga con contorno grueso,
// sombras duras, tramas de puntos y una «carta coleccionable» con brillo holo para
// presentar a Iheb. Sin logos, Poké Ball ni personajes de Nintendo/The Pokémon
// Company (marca registrada): solo la idea de carta, nunca su diseño.
//
// Se añade DESPUÉS del CSS base de cada generador: redefine las mismas variables
// (--bg, --fg, --kirmizi…) que leen el menú y la franja del equipo (variante 'fr').

export const ANIME_FUENTES = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=M+PLUS+Rounded+1c:wght@500;800&family=Lalezar&family=Tajawal:wght@500;800&display=swap">'

// Scripts de movimiento (mismas versiones que /tr/); van justo antes de </body>.
export const ANIME_JS = `<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.3.27/dist/lenis.min.js" defer></script>
<script src="/iheb/movimiento.js" defer></script>`

export const ANIME_CSS = `
:root{--bg:#fff8ec;--fg:#16132a;--soluk:#4d4866;--kart:#fff;--cizgi:#16132a;--kirmizi:#e8325a;--yesil:#13a05a;--sol:#ffd23f;--gok:#3ec5ff;--mor:#7b5cff;--golge:#16132a;--nokta:rgba(22,19,42,.07)}
@media (prefers-color-scheme:dark){:root{--bg:#14112a;--fg:#f4f1ff;--soluk:#bdb6dc;--kart:#1f1a3d;--cizgi:#f4f1ff;--kirmizi:#ff6d8a;--yesil:#2fd27f;--sol:#ffd23f;--gok:#5fd1ff;--mor:#a48bff;--golge:#000;--nokta:rgba(255,255,255,.06)}}
body{font-family:"M PLUS Rounded 1c",system-ui,-apple-system,"Segoe UI",sans-serif;font-weight:500;background-color:var(--bg);background-image:radial-gradient(var(--nokta) 1.4px,transparent 1.5px);background-size:14px 14px}
h1,h2,h3{font-family:"Dela Gothic One","M PLUS Rounded 1c",system-ui,sans-serif;font-weight:400;letter-spacing:0}
h2{position:relative;display:inline-block;padding:0 .2em;background:linear-gradient(transparent 58%,var(--sol) 58%,var(--sol) 92%,transparent 92%)}
@media (prefers-color-scheme:dark){h2{background:linear-gradient(transparent 58%,var(--mor) 58%,var(--mor) 92%,transparent 92%)}}
header{background:var(--bg);border-bottom:3px solid var(--cizgi)}
header .kap>a:first-child{font-family:"Dela Gothic One",system-ui,sans-serif;font-weight:400}
/* Héroe: viñeta de manga con líneas de velocidad */
.kahraman{border-bottom:4px solid var(--cizgi)}
.kahraman .ortu{background:repeating-conic-gradient(from 0deg at 70% 40%,rgba(255,255,255,.07) 0 2deg,transparent 2deg 9deg),linear-gradient(180deg,transparent 0,rgba(10,8,30,.35) 35%,rgba(10,8,30,.85) 100%)}
.kahraman h1{-webkit-text-stroke:1.5px #16132a;paint-order:stroke fill;text-shadow:4px 4px 0 #16132a,0 0 30px rgba(62,197,255,.35)}
.kahraman .etiket{display:inline-block;background:var(--sol);color:#16132a;border:3px solid #16132a;border-radius:10px;padding:4px 12px;transform:rotate(-2deg);box-shadow:3px 3px 0 #16132a;letter-spacing:.06em}
.kahraman .etiket a{color:#16132a}
/* Botones: pegatina amarilla con sombra dura */
.btn{background:var(--sol);color:#16132a;border:3px solid #16132a;box-shadow:4px 4px 0 #16132a;font-weight:800;transition:transform .15s ease,box-shadow .15s ease}
.btn:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 #16132a}.btn:active{transform:translate(2px,2px);box-shadow:1px 1px 0 #16132a}
.wa-sabit{background:var(--yesil);border:3px solid #16132a;box-shadow:4px 4px 0 #16132a}
/* Tarjetas: viñetas */
.izgara li{border:3px solid var(--cizgi);border-radius:18px;box-shadow:6px 6px 0 var(--golge);transition:transform .18s ease,box-shadow .18s ease}
.izgara li:hover{transform:translate(-3px,-3px) rotate(-.4deg);box-shadow:9px 9px 0 var(--kirmizi)}
.izgara li:nth-child(3n+2):hover{box-shadow:9px 9px 0 var(--gok)}.izgara li:nth-child(3n):hover{box-shadow:9px 9px 0 var(--mor)}
.izgara h3{font-size:19px}
.kf{border-bottom:3px solid var(--cizgi)}
/* Respuesta directa = bocadillo de cómic */
.cevap{position:relative;border:3px solid var(--cizgi);border-left-width:3px;border-radius:22px;box-shadow:5px 5px 0 var(--golge);margin-bottom:34px}
.cevap::after{content:"";position:absolute;left:44px;bottom:-19px;width:26px;height:26px;background:var(--kart);border-right:3px solid var(--cizgi);border-bottom:3px solid var(--cizgi);transform:skewX(30deg) rotate(45deg)}
[dir=rtl] .cevap::after{left:auto;right:44px;transform:skewX(-30deg) rotate(45deg)}
details,.fiche,.iheb-mini,ul.yorumlar li{border:3px solid var(--cizgi);box-shadow:4px 4px 0 var(--golge)}
summary{font-weight:800}
table{border:3px solid var(--cizgi);border-radius:12px;overflow:hidden;background:var(--kart)}th{background:var(--sol);color:#16132a}
/* Retrato de Iheb = carta coleccionable con brillo holo */
.guide .portrait{border:10px solid #fff;outline:3px solid #16132a;border-radius:20px;box-shadow:8px 8px 0 #16132a;transform:rotate(-2deg)}
.tcg{position:relative;max-width:340px;margin:0 auto;padding:12px;border-radius:22px;background:linear-gradient(135deg,var(--sol),#ff9f1c 45%,var(--kirmizi));border:3px solid #16132a;box-shadow:8px 8px 0 #16132a;transform:rotate(-2deg);color:#16132a}
.tcg::before{content:"";position:absolute;inset:0;border-radius:20px;pointer-events:none;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.55) 45%,rgba(62,197,255,.35) 52%,transparent 66%);background-size:250% 250%;animation:holo 6s ease-in-out infinite;mix-blend-mode:soft-light}
@keyframes holo{0%,100%{background-position:100% 100%}50%{background-position:0 0}}
@media (prefers-reduced-motion:reduce){.tcg::before{animation:none}}
.tcg-ust{display:flex;justify-content:space-between;align-items:center;gap:8px;background:#fff;border:3px solid #16132a;border-radius:12px;padding:6px 12px;font-family:"Dela Gothic One",system-ui,sans-serif}
.tcg-ust b{font-size:22px;font-weight:400}.tcg-ust span{font-size:13px;background:var(--gok);border:2px solid #16132a;border-radius:999px;padding:1px 10px}
.tcg img{display:block;width:100%;height:auto;aspect-ratio:1/1;object-fit:cover;margin:10px 0;border:3px solid #16132a;border-radius:12px;background:#fff}
.tcg-kutu{background:#fff;border:3px solid #16132a;border-radius:12px;padding:8px 12px;font-size:14px;line-height:1.5}
.tcg-kutu p{margin:4px 0}.tcg-kutu strong{font-family:"Dela Gothic One",system-ui,sans-serif;font-weight:400}
.tcg-rozet{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 0}.tcg-rozet span{background:var(--sol);border:2px solid #16132a;border-radius:999px;padding:1px 10px;font-size:13px;font-weight:800}
/* Pegatinas y bandas */
.rozetler{display:flex;flex-wrap:wrap;gap:10px;padding:0;list-style:none;margin:18px 0}
html,body{overflow-x:clip}
.btn:active,.wa-sabit:active{transform:scale(.94)!important}
.izgara>li{transition:transform .25s ease-out,opacity .25s}
@media (max-width:640px){.rozetler{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin-inline:-16px;padding:6px 16px 10px}.rozetler>li{flex:none}}
.rozetler li{background:var(--kart);border:3px solid var(--cizgi);border-radius:999px;padding:6px 14px;font-weight:800;box-shadow:3px 3px 0 var(--golge)}
.rozetler li:nth-child(4n+1){background:var(--sol);color:#16132a}.rozetler li:nth-child(4n+3){background:var(--gok);color:#16132a}
.bant{background:var(--fg);color:var(--bg);border-block:4px solid var(--sol);padding:26px 0;margin-top:56px}
.bant h2{background:none;color:var(--sol)!important;margin-top:0!important}.bant p,.bant li{color:var(--bg)}.bant a{color:var(--sol)}
.adimlar{counter-reset:a;list-style:none;padding:0;display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.adimlar li{counter-increment:a;position:relative;background:var(--kart);color:var(--fg);border:3px solid var(--cizgi);border-radius:16px;padding:40px 16px 16px;box-shadow:5px 5px 0 var(--golge)}
.adimlar li::before{content:counter(a);position:absolute;top:-16px;inset-inline-start:14px;width:42px;height:42px;display:grid;place-items:center;font-family:"Dela Gothic One",sans-serif;background:var(--kirmizi);color:#fff;border:3px solid #16132a;border-radius:50%}
/* Árabe: fuentes y dirección */
[lang=ar] body,body[lang=ar],html[lang=ar] body{font-family:Tajawal,"M PLUS Rounded 1c",system-ui,sans-serif}
html[lang=ar] h1,html[lang=ar] h2,html[lang=ar] h3,html[lang=ar] .tcg-ust,html[lang=ar] .tcg-kutu strong,html[lang=ar] header .kap>a:first-child{font-family:Lalezar,Tajawal,system-ui,sans-serif;letter-spacing:0}
html[lang=ar] .wa-sabit{right:auto;left:16px}
html[lang=ar] ul.ozet{padding-left:0;padding-right:20px}
html[lang=ar] td,html[lang=ar] th{text-align:right}
/* ——— Movimiento (public/iheb/movimiento.js) ——— */
html.lenis,html.lenis body{height:auto}.lenis.lenis-smooth{scroll-behavior:auto!important}
.hz .gir{opacity:0}
.ilerleme{position:fixed;top:0;left:0;right:0;height:5px;z-index:50;transform:scaleX(0);transform-origin:0 50%;background:linear-gradient(90deg,var(--sol),var(--kirmizi),var(--mor));pointer-events:none}
[dir=rtl] .ilerleme{transform-origin:100% 50%}
.adimlar li.zipla::before{animation:zipla .7s cubic-bezier(.3,1.8,.5,1) both}
@keyframes zipla{0%{transform:scale(0) rotate(-30deg)}100%{transform:scale(1) rotate(0)}}
.tcg::before{background:radial-gradient(circle at var(--hx,30%) var(--hy,20%),rgba(255,255,255,.6),transparent 40%),linear-gradient(115deg,transparent 30%,rgba(255,255,255,.55) 45%,rgba(62,197,255,.35) 52%,transparent 66%);background-size:100% 100%,250% 250%}
/* Cinta de palabras clave que desfila (estilo opening de anime) */
.serit{overflow:hidden;white-space:nowrap;background:var(--sol);color:#16132a;border-block:3px solid #16132a;padding:12px 0;font-family:"Dela Gothic One",system-ui,sans-serif;font-size:clamp(18px,2.6vw,26px);transform:rotate(-1.2deg);margin:28px -16px}
.serit div{display:inline-block;animation:kay 30s linear infinite}.serit span{margin:0 22px}.serit i{font-style:normal;color:var(--kirmizi);margin-inline-end:10px}
[dir=rtl] .serit div{animation-direction:reverse}
@keyframes kay{to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){.serit div{animation:none}}
/* ——— Móvil ——— */
@media (max-width:640px){
  body{font-size:16px}
  .kahraman{min-height:88svh}.kahraman .ortu{padding:96px 0 104px}
  .kahraman h1{-webkit-text-stroke:1px #16132a;text-shadow:3px 3px 0 #16132a}
  .kahraman .btn{display:block;text-align:center}
  /* Las rejillas largas se deslizan de lado, con imán, en vez de una columna eterna */
  .izgara{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:16px;margin-inline:-16px;padding:6px 16px 22px;scroll-padding-inline:16px;scrollbar-width:none}
  .izgara::-webkit-scrollbar{display:none}
  .izgara>li{flex:0 0 82%;scroll-snap-align:start}
  .izgara li:hover{transform:none}
  /* Tablas: las anchas se deslizan; las de «10 lecciones» (.dersler) pasan a fichas */
  table{display:block;overflow-x:auto;white-space:normal}
  table.dersler,table.dersler tbody,table.dersler tr,table.dersler td,table.dersler th{display:block;width:100%}
  table.dersler{border:0;background:none;overflow:visible;box-shadow:none}
  table.dersler tr:first-child{display:none}
  table.dersler tr{background:var(--kart);border:3px solid var(--cizgi);border-radius:14px;box-shadow:4px 4px 0 var(--golge);padding:10px 14px;margin:0 0 12px}
  table.dersler td{border:0;padding:2px 0}table.dersler td:first-child{font-family:"Dela Gothic One",system-ui,sans-serif;color:var(--kirmizi)}
  .cevap{font-size:16px}
  .adimlar{grid-template-columns:1fr}
  .wa-sabit{left:16px;right:16px;text-align:center;bottom:12px}
  html[lang=ar] .wa-sabit{left:16px;right:16px}
  .guide .portrait,.tcg{transform:none}
}
`

// ——— Idiomas de Iheb: selector visible + hreflang con países (6-11-2026) ———
// Iheb pidió un selector como el de la cabecera de Tony (Français · العربية · English)
// que lleve a la MISMA página en el otro idioma cuando existe; si no, a la portada
// de ese idioma. Las mismas parejas dan los hreflang (página y sitemap), con
// variantes por país para que Google sirva cada idioma en su mercado:
// francés → Francia, Bélgica, Luxemburgo, Suiza, Canadá (Québec);
// árabe → Golfo (Catar, EAU, Arabia Saudí, Baréin, Omán, Kuwait);
// inglés → EE. UU., Canadá, Reino Unido, India, Suiza, Países Bajos.
export const IHEB_IDIOMAS = ['fr', 'ar', 'en']
const NOMBRE_IDIOMA = { fr: 'Français', ar: 'العربية', en: 'English' }
export const IHEB_INICIO = { fr: '/fr/', ar: '/ar/tokyo/', en: '/en/tokyo-anime-guide/' }
export const IHEB_REGIONES = { fr: ['FR', 'BE', 'LU', 'CH', 'CA'], ar: ['QA', 'AE', 'SA', 'BH', 'OM', 'KW'], en: ['US', 'CA', 'GB', 'IN', 'CH', 'NL', 'SG', 'MY'] }
// Los mismos mercados con nombre, para schema.org (audience.geographicArea).
export const IHEB_PAISES = {
  fr: ['France', 'Belgium', 'Luxembourg', 'Switzerland', 'Canada'],
  ar: ['Qatar', 'United Arab Emirates', 'Saudi Arabia', 'Bahrain', 'Oman', 'Kuwait'],
  en: ['United States', 'Canada', 'United Kingdom', 'India', 'Switzerland', 'Netherlands', 'Singapore', 'Malaysia'],
}

// Páginas equivalentes (una por idioma como mucho). Una página que no está aquí
// forma su propio grupo de un solo idioma: hreflang a sí misma con sus países.
// Los formularios de reseñas (noindex) solo usan el selector, sin hreflang.
export const IHEB_EQUIVALENTES = [
  { fr: '/fr/', ar: '/ar/tokyo/', en: '/en/tokyo-anime-guide/' },
  { fr: '/fr/guide-anime-tokyo/', ar: '/ar/tokyo/anime-pokemon/', en: '/en/tokyo-anime-guide/otaku-guide/' },
  { fr: '/fr/halal-mosquees-tokyo/', ar: '/ar/tokyo/halal-masajid/', en: '/en/muslim-guide-tokyo/' },
  { fr: '/fr/guide-francophone-agences-voyage/', ar: '/ar/tokyo/wakalat/', en: '/en/tokyo-anime-guide/travel-agencies/' },
  { fr: '/fr/avis/', ar: '/ar/tokyo/taqyim/', en: '/en/tokyo-anime-guide/review/' },
  { fr: '/fr/tokyo-quebec-canada/', en: '/en/tokyo-anime-guide/first-time-japan/' },
  { ar: '/ar/tokyo/fakhira/', en: '/en/arabic-speaking-guide-tokyo/' },
  { fr: '/fr/akihabara-que-faire/', en: '/en/tokyo-anime-guide/akihabara/' },
  { fr: '/fr/nakano-broadway/', en: '/en/tokyo-anime-guide/nakano-broadway/' },
  { fr: '/fr/ikebukuro-anime/', en: '/en/tokyo-anime-guide/ikebukuro/' },
  // 6-11-2026, fase 2. El Magreb lleva además sus países (solo en este grupo).
  { fr: '/fr/tokyo-maghreb/', ar: '/ar/tokyo/maghreb/', extra: { fr: ['TN', 'MA', 'DZ', 'SN', 'CI'], ar: ['TN', 'MA', 'DZ'] } },
  { fr: '/fr/excursions-depuis-tokyo/', ar: '/ar/tokyo/rihlat-min-tokyo/', en: '/en/tokyo-anime-guide/day-trips/' },
  { fr: '/fr/itineraire-tokyo-3-5-7-jours/', ar: '/ar/tokyo/barnamaj-tokyo/', en: '/en/tokyo-anime-guide/tokyo-itinerary/' },
  // 7-11-2026: Hakone en familia, la costa (la francesa es /fr/kamakura/), actividades y nieve.
  { fr: '/fr/hakone-onsen-prive/', ar: '/ar/tokyo/hakone/', en: '/en/tokyo-anime-guide/hakone/' },
  { fr: '/fr/kamakura/', ar: '/ar/tokyo/enoshima/', en: '/en/tokyo-anime-guide/enoshima-kamakura/' },
  { fr: '/fr/activites-ateliers-tokyo/', ar: '/ar/tokyo/anshita/', en: '/en/tokyo-anime-guide/experiences/' },
  { fr: '/fr/neige-depuis-tokyo/', ar: '/ar/tokyo/thalj/', en: '/en/tokyo-anime-guide/snow-trips/' },
  { fr: '/fr/tarifs-transferts-excursions/', ar: '/ar/tokyo/asaar/', en: '/en/tokyo-anime-guide/prices/' },
]
const rutasDe = (g) => IHEB_IDIOMAS.map((l) => g[l]).filter(Boolean)
{
  // Una ruta en dos grupos rompería la reciprocidad: mejor fallar en el build.
  const vistas = new Set()
  for (const g of IHEB_EQUIVALENTES) for (const r of rutasDe(g)) {
    if (vistas.has(r)) throw new Error(`iheb-estilo: ${r} está en dos grupos de IHEB_EQUIVALENTES`)
    vistas.add(r)
  }
}
const grupoDe = (ruta, lang) => IHEB_EQUIVALENTES.find((g) => rutasDe(g).includes(ruta)) ?? { [lang]: ruta }

/** [hreflang, ruta] del grupo de una página: idioma, idioma-país y x-default (la inglesa). */
export function ihebAlternas(ruta, lang) {
  const g = grupoDe(ruta, lang)
  const filas = IHEB_IDIOMAS.filter((l) => g[l]).flatMap((l) => [[l, g[l]], ...[...IHEB_REGIONES[l], ...(g.extra?.[l] ?? [])].map((p) => [`${l}-${p}`, g[l]])])
  return [...filas, ['x-default', g.en ?? g.fr ?? g.ar]]
}
export const ihebHreflang = (ruta, lang, base = 'https://tonykansaiguide.com') =>
  ihebAlternas(ruta, lang).map(([hl, r]) => `<link rel="alternate" hreflang="${hl}" href="${base}${r}">`).join('\n')

/** Selector de idioma: el activo no es enlace (aria-current), los otros llevan a la equivalente. */
export function ihebIdiomas(ruta, lang) {
  const g = grupoDe(ruta, lang)
  const etiqueta = { fr: 'Langue', ar: 'اللغة', en: 'Language' }[lang]
  return `<nav class="idiomas" aria-label="${etiqueta}">${IHEB_IDIOMAS.map((l) => {
    const atr = `lang="${l}"${l === 'ar' ? ' dir="rtl"' : ''}`
    return l === lang
      ? `<span ${atr} aria-current="page">${NOMBRE_IDIOMA[l]}</span>`
      : `<a ${atr} hreflang="${l}" href="${g[l] ?? IHEB_INICIO[l]}">${NOMBRE_IDIOMA[l]}</a>`
  }).join('')}</nav>`
}
// Pastillas con sombra dura (estilo anime). Con colores de reserva para los
// formularios de reseñas, que no cargan ANIME_CSS.
export const IHEB_IDIOMAS_CSS = `
.idiomas{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.idiomas a,.idiomas span{display:inline-block;padding:3px 12px;border:2px solid var(--cizgi,#16132a);border-radius:999px;font-weight:800;font-size:14px;line-height:1.5;text-decoration:none;color:var(--fg,#16132a);background:var(--kart,#fff);white-space:nowrap}
.idiomas a:hover{background:var(--gok,#3ec5ff);color:#16132a}
.idiomas [aria-current]{background:var(--sol,#ffd23f);color:#16132a;box-shadow:2px 2px 0 #16132a}
.idiomas [lang=ar]{font-family:Tajawal,system-ui,sans-serif}
header .idiomas{margin-inline-start:auto}
@media (max-width:640px){header .idiomas{order:3;width:100%;justify-content:center;margin:0}}`

// 7-11-2026: «a tu medida». Opciones flexibles en las tres portadas de Iheb, cada una
// enlazando a su página; en el móvil es un carrusel de pegatinas.
const OPC = {
  fr: { h: 'À votre façon : les options', p: 'Chaque journée se construit pour votre groupe. Choisissez, Iheb s’occupe du reste.', items: [
    ['⏱️', 'Demi-journée, journée ou plusieurs jours', '/fr/itineraire-tokyo-3-5-7-jours/'], ['🗻', 'Excursions : Fuji, Hakone, la mer', '/fr/excursions-depuis-tokyo/'],
    ['♨️', 'Onsen privé en famille à Hakone', '/fr/hakone-onsen-prive/'], ['❄️', 'La neige depuis Tokyo', '/fr/neige-depuis-tokyo/'],
    ['🍣', 'Ateliers, sumo, teamLab', '/fr/activites-ateliers-tokyo/'], ['⚡', 'Anime et cartes Pokémon', '/fr/guide-anime-tokyo/'],
    ['🕌', 'Halal et pauses prière', '/fr/halal-mosquees-tokyo/'], ['🚐', 'Transferts aéroport et tarifs', '/fr/tarifs-transferts-excursions/']] },
  en: { h: 'Your trip, your way: options', p: 'Every day is built around your group. Pick what you like, Iheb handles the rest.', items: [
    ['⏱️', 'Half day, full day or several days', '/en/tokyo-anime-guide/tokyo-itinerary/'], ['🗻', 'Day trips: Fuji, Hakone, the coast', '/en/tokyo-anime-guide/day-trips/'],
    ['♨️', 'Private family onsen in Hakone', '/en/tokyo-anime-guide/hakone/'], ['❄️', 'Snow trips from Tokyo', '/en/tokyo-anime-guide/snow-trips/'],
    ['🍣', 'Classes, sumo, teamLab', '/en/tokyo-anime-guide/experiences/'], ['⚡', 'Anime and Pokémon cards', '/en/tokyo-anime-guide/otaku-guide/'],
    ['🕌', 'Halal food and prayer breaks', '/en/muslim-guide-tokyo/'], ['🚐', 'Airport transfers and prices', '/en/tokyo-anime-guide/prices/']] },
  ar: { h: 'رحلتكم كما تريدون: الخيارات', p: 'كل يوم يُصمَّم لمجموعتكم. اختاروا ما يعجبكم، والباقي على إيهاب.', items: [
    ['⏱️', 'نصف يوم أو يوم كامل أو عدة أيام', '/ar/tokyo/barnamaj-tokyo/'], ['🗻', 'رحلات يومية: فوجي وهاكوني والبحر', '/ar/tokyo/rihlat-min-tokyo/'],
    ['♨️', 'أونسن خاص للعائلة في هاكوني', '/ar/tokyo/hakone/'], ['❄️', 'الثلج قرب طوكيو', '/ar/tokyo/thalj/'],
    ['🍣', 'ورش وسومو وتيم لاب', '/ar/tokyo/anshita/'], ['⚡', 'الأنمي وبطاقات بوكيمون', '/ar/tokyo/anime-pokemon/'],
    ['🕌', 'طعام حلال ووقت للصلاة', '/ar/tokyo/halal-masajid/'], ['🚐', 'الاستقبال من المطار والأسعار', '/ar/tokyo/asaar/']] },
}
export const ihebOpciones = (lang) => {
  const o = OPC[lang]
  return `<h2>${o.h}</h2>
<p>${o.p}</p>
<ul class="opciones">${o.items.map(([i, t, h]) => `<li><a href="${h}"><span class="oi" aria-hidden="true">${i}</span><b>${t}</b></a></li>`).join('')}</ul>`
}
export const IHEB_OPCIONES_CSS = `
/* 7-11-2026 limpieza móvil: botón de agencias legible, WhatsApp fijo compacto en la esquina,
   sin la fila de pegatinas repetida (los idiomas ya están arriba). */
.bant a.btn{color:#16132a!important}
@media (max-width:640px){
.wa-sabit{left:auto!important;right:14px!important;bottom:14px!important;width:auto!important;padding:11px 18px!important;font-size:15px!important;border-radius:999px!important}
[dir=rtl] .wa-sabit{right:auto!important;left:14px!important}
body{padding-bottom:0!important}
.rozetler{display:none!important}
}
.iheb-masjid{margin:18px 0 24px;max-width:520px}.iheb-masjid img{width:100%;height:auto;display:block;border:3px solid var(--cizgi,#16132a);border-radius:22px;box-shadow:6px 6px 0 var(--golge,#16132a)}.iheb-masjid figcaption{font-size:14px;color:var(--soluk,#555);margin-top:8px}
ul.opciones{list-style:none;padding:0;margin:18px 0 8px;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px}
ul.opciones a{display:flex;flex-direction:column;gap:10px;height:100%;padding:16px;border:3px solid var(--cizgi,#16132a);border-radius:18px;background:var(--kart,#fff);color:var(--fg,#16132a);text-decoration:none;box-shadow:5px 5px 0 var(--golge,#16132a);transition:transform .2s,box-shadow .2s}
ul.opciones li:nth-child(4n+1) a{background:#fff3c4}ul.opciones li:nth-child(4n+2) a{background:#d9f3ff}ul.opciones li:nth-child(4n+3) a{background:#ffe0e8}ul.opciones li:nth-child(4n) a{background:#e6ddff}
@media (prefers-color-scheme:dark){ul.opciones a{background:var(--kart)!important;color:var(--fg)}}
ul.opciones a:hover{transform:translate(-2px,-2px) rotate(-1deg);box-shadow:8px 8px 0 var(--golge,#16132a)}
ul.opciones a:active{transform:scale(.95)}
ul.opciones .oi{font-size:30px;line-height:1}
ul.opciones b{font-weight:800;line-height:1.3}
@media (max-width:640px){ul.opciones{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:12px;margin-inline:-16px;padding:6px 16px 18px;scrollbar-width:none}ul.opciones li{flex:0 0 46%;scroll-snap-align:start}}`
