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
import { ANIME_CSS, ANIME_FUENTES, ANIME_JS } from './iheb-estilo.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://tonykansaiguide.com'
const HOY = '2026-11-04'
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

// Versiones de cada página para hreflang (la francesa equivalente, si existe).
const ALTERNAS = {
  portada: { ar: '/ar/tokyo/', en: '/en/tokyo-anime-guide/', fr: '/fr/' },
  anime: { ar: '/ar/tokyo/anime-pokemon/', en: '/en/tokyo-anime-guide/', fr: '/fr/guide-anime-tokyo/' },
  halal: { ar: '/ar/tokyo/halal-masajid/', fr: '/fr/halal-mosquees-tokyo/' },
  primera: { en: '/en/tokyo-anime-guide/first-time-japan/', fr: '/fr/tokyo-quebec-canada/' },
  lujo: { ar: '/ar/tokyo/fakhira/', en: '/en/arabic-speaking-guide-tokyo/' },
  otaku: { en: '/en/tokyo-anime-guide/otaku-guide/' },
  agencias: { ar: '/ar/tokyo/wakalat/', en: '/en/tokyo-anime-guide/travel-agencies/', fr: '/fr/guide-francophone-agences-voyage/' },
}

function page({ lang, ruta, alterna, titre, desc, image, jsonld, corps }) {
  const l = L[lang]
  const url = `${BASE}${ruta}`
  const alts = Object.entries(ALTERNAS[alterna] ?? {}).map(([hl, r]) => `<link rel="alternate" hreflang="${hl}" href="${BASE}${r}">`).join('\n')
  const grupos = lang === 'ar'
    ? [
        { t: 'إيهاب', enlaces: [['الرئيسية', '/ar/tokyo/'], ['عائلات الخليج', '/ar/tokyo/fakhira/'], ['حلال ومساجد', '/ar/tokyo/halal-masajid/'], ['أنمي وبوكيمون', '/ar/tokyo/anime-pokemon/'], ['للوكالات', '/ar/tokyo/wakalat/']] },
        { t: 'لغات أخرى', enlaces: [{ t: 'Français', h: '/fr/', lang: 'fr', hreflang: 'fr' }, { t: 'English', h: '/en/tokyo-anime-guide/', lang: 'en', hreflang: 'en' }, ['Tony Kansai Guide', '/ar/']] },
      ]
    : lang === 'fr'
    ? [
        { t: 'Iheb', enlaces: [['Accueil', '/fr/'], ['Québec et Canada', '/fr/tokyo-quebec-canada/'], ['Guide anime', '/fr/guide-anime-tokyo/'], ['Pour les agences', '/fr/guide-francophone-agences-voyage/']] },
        { t: 'Autres langues', enlaces: [{ t: 'English', h: '/en/tokyo-anime-guide/first-time-japan/', lang: 'en', hreflang: 'en' }, { t: 'العربية', h: '/ar/tokyo/', lang: 'ar', hreflang: 'ar' }, ['Tony Kansai Guide', '/']] },
      ]
    : [
        { t: 'Iheb', enlaces: [['Home', '/en/tokyo-anime-guide/'], ['The otaku guide', '/en/tokyo-anime-guide/otaku-guide/'], ['First time in Japan', '/en/tokyo-anime-guide/first-time-japan/'], ['Gulf / GCC agencies', '/en/arabic-speaking-guide-tokyo/'], ['For travel agencies', '/en/tokyo-anime-guide/travel-agencies/']] },
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
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [{ '@type': 'WebPage', '@id': url, url, name: titre, description: desc, inLanguage: lang, dateModified: HOY, about: { '@id': `${BASE}/fr/#iheb` } }, PERSON_LD, ...jsonld] })}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${ANIME_FUENTES}
${equipoFuente}
<style>${CSS_BASE}${ANIME_CSS}${equipoCSS}${menuCSS}</style>
</head>
<body>
<header><div class="kap"><a href="${l.base}">${esc(l.marca)}</a>
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
<p class="cevap">للعائلات الخليجية: سيارة خاصة مع سائق، حلال، وخصوصية تامة. <a href="/ar/tokyo/fakhira/">رحلات خاصة لعائلات الخليج ←</a></p>
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
<p><a class="btn" href="/ar/tokyo/anime-pokemon/">دليل الأنمي وبوكيمون</a> <a class="btn" href="/ar/tokyo/halal-masajid/">حلال ومساجد طوكيو</a></p>
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
</ul>
<p><a class="btn" href="${L.en.waGenel}">Plan my day</a></p></div></section>
<h2>Pick your path</h2>
<ul class="izgara">
${carte('en', 'super-potato', 'Super Potato retro games', 'The otaku guide', 'Every district, shop rule and anime location explained.', '/en/tokyo-anime-guide/otaku-guide/')}
${carte('en', 'kawaguchiko-sakura', 'Mount Fuji with cherry blossoms', 'First time in Japan', 'A calm private tour for first-timers and seniors, everything explained.', '/en/tokyo-anime-guide/first-time-japan/')}
${carte('en', 'tokyo-camii', 'Tokyo Camii', 'Muslim travelers', 'Halal-friendly food and prayer breaks built into the day.', '/fr/halal-mosquees-tokyo/')}
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
    ['akihabara-rue', 'Akihabara street', 'Akihabara', 'Card shops on every floor, figure towers, capsule toys and arcades. Best on a weekday morning, before the crowds.'],
    ['super-potato', 'Super Potato, Akihabara', 'Retro games', 'Floors of classic consoles and cartridges, from the 8-bit era to the 2000s, plus a small retro arcade.'],
    ['nakano-broadway', 'Nakano Broadway', 'Nakano Broadway', 'The collectors’ mall: rare figures, vintage toys, manga and cards, many in Mandarake shops.'],
    ['sunshine-city', 'Sunshine City, Ikebukuro', 'Ikebukuro', 'Pokémon Center Mega Tokyo, the huge Animate flagship and Otome Road, the street for anime goods aimed at women fans.'],
    ['shibuya-parco', 'Shibuya PARCO', 'Shibuya PARCO 6F', 'Nintendo TOKYO, Pokémon Center Shibuya, Jump Shop and Capcom Store on one floor.'],
    ['character-street', 'Tokyo Character Street', 'Tokyo Station', 'Character Street: dozens of official character shops underground at Tokyo Station. Perfect on arrival or departure day.'],
    ['odaiba', 'Odaiba', 'Odaiba', 'The life-size Unicorn Gundam statue at DiverCity Tokyo Plaza, with Tokyo Bay views.'],
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
<p class="cevap">The best otaku areas in Tokyo are Akihabara (cards, figures, retro games), Nakano Broadway (rare collectibles) and Ikebukuro (Animate, Pokémon Center Mega Tokyo, Otome Road). Add Shibuya PARCO for Nintendo TOKYO, Tokyo Station’s Character Street, and Odaiba for the life-size Gundam. Iheb, a pop-culture and Pokémon card specialist who lives in Japan, plans the order, the trains and the shops for your group.</p>
<div class="serit" aria-hidden="true"><div><span><i>★</i>Figures</span><span><i>★</i>Manga</span><span><i>★</i>Trading cards</span><span><i>★</i>Capsule toys</span><span><i>★</i>Arcades</span><span><i>★</i>Anime goods</span><span><i>★</i>Retro consoles</span><span><i>★</i>Figures</span><span><i>★</i>Manga</span><span><i>★</i>Trading cards</span><span><i>★</i>Capsule toys</span><span><i>★</i>Arcades</span><span><i>★</i>Anime goods</span><span><i>★</i>Retro consoles</span></div></div>
<h2>The districts, one by one</h2>
<ul class="izgara">${barrios.map(([k, alt, t, p]) => carte('en', k, alt, t, p)).join('')}</ul>
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
    desc: 'Every otaku district in Tokyo explained: Akihabara, Nakano Broadway, Ikebukuro, Shibuya PARCO, Character Street, Odaiba Gundam, Big Sight, anime locations. Shop rules, tax-free, shipping home. Private guide in English.',
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

const hechas = [arFakhira(), enGcc(), arPortada(), arHalal(), arAnime(), arWakalat(), enPortada(), enAgencias(), enOtaku(), enPrimera(), frQuebec()]
console.log(`iheb: ${hechas.length} páginas → ${hechas.map((r) => `/${r}/`).join(' ')}`)
