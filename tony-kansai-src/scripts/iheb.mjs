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
import { ANIME_CSS, ANIME_FUENTES } from './iheb-estilo.mjs'

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
  agencias: { ar: '/ar/tokyo/wakalat/', en: '/en/tokyo-anime-guide/travel-agencies/', fr: '/fr/guide-francophone-agences-voyage/' },
}

function page({ lang, ruta, alterna, titre, desc, image, jsonld, corps }) {
  const l = L[lang]
  const url = `${BASE}${ruta}`
  const alts = Object.entries(ALTERNAS[alterna] ?? {}).map(([hl, r]) => `<link rel="alternate" hreflang="${hl}" href="${BASE}${r}">`).join('\n')
  const grupos = lang === 'ar'
    ? [
        { t: 'إيهاب', enlaces: [['الرئيسية', '/ar/tokyo/'], ['حلال ومساجد', '/ar/tokyo/halal-masajid/'], ['أنمي وبوكيمون', '/ar/tokyo/anime-pokemon/'], ['للوكالات', '/ar/tokyo/wakalat/']] },
        { t: 'لغات أخرى', enlaces: [{ t: 'Français', h: '/fr/', lang: 'fr', hreflang: 'fr' }, { t: 'English', h: '/en/tokyo-anime-guide/', lang: 'en', hreflang: 'en' }, ['Tony Kansai Guide', '/ar/']] },
      ]
    : [
        { t: 'Iheb', enlaces: [['Home', '/en/tokyo-anime-guide/'], ['For travel agencies', '/en/tokyo-anime-guide/travel-agencies/'], ['Pokémon Centers (FR)', '/fr/pokemon-center-tokyo/']] },
        { t: 'Other languages', enlaces: [{ t: 'Français', h: '/fr/', lang: 'fr', hreflang: 'fr' }, { t: 'العربية', h: '/ar/tokyo/', lang: 'ar', hreflang: 'ar' }, ['Tony Kansai Guide', '/en/']] },
      ]
  const intro = lang === 'ar'
    ? '<p>إيهاب هو مرشد <a href="/ar/">Tony Kansai Guide</a> في طوكيو وشرق اليابان. أما كيوتو وأوساكا فيرشد فيهما توني من الفريق نفسه، بالعربية والإسبانية والإنجليزية.</p>'
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
  fin: `<span>© Tony Kansai Guide</span><span>${lang === 'ar' ? 'آخر تحديث' : 'Last updated'}: ${HOY}</span>`,
})}</footer>
<a class="wa-sabit" href="${l.waGenel}">${esc(l.waBoton)}</a>
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

const hechas = [arPortada(), arHalal(), arAnime(), arWakalat(), enPortada(), enAgencias()]
console.log(`iheb: ${hechas.length} páginas → ${hechas.map((r) => `/${r}/`).join(' ')}`)
