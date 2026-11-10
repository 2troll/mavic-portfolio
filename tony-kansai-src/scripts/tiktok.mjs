#!/usr/bin/env node
// Genera public/tiktok/**: «Kansai de TikTok», guías por temporada de los sitios
// virales de Kioto, Osaka y Nara, con la Ruta TikTok a precio especial.
//
//   node scripts/tiktok.mjs
//
// Mismo patrón que familias.mjs: HTML estático completo (los rastreadores de IA no
// ejecutan JavaScript), data-estatica en <html> para que rutas-estaticas.mjs no lo
// pise, y animación como mejora progresiva (GSAP + Lenis solo si no se pide reducir
// movimiento; sin JS todo se ve igual, solo quieto).
//
// Rutas: /tiktok/ (es), /tiktok/en/, /tiktok/ar/ y cada temporada debajo.
// La oferta de cada temporada desaparece sola al pasar su fecha «hasta».
import { mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UI, TEMPORADAS, PRECIO, WHATSAPP, JOYAS, JOYAS_UI, JOYAS_KANTO } from './tiktok-datos.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://tonykansaiguide.com'
const OUT = join(root, 'public/tiktok')
const FOTOS = JSON.parse(readFileSync(join(root, 'scripts/familias-fotos.json'), 'utf8'))
const HOY = new Date().toISOString().slice(0, 10)
const LANGS = ['es', 'en', 'ar']
const GSAP_V = '3.15.0'
const LENIS_V = '1.3.27'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const sinHtml = (s) => String(s).replace(/<[^>]+>/g, '')
const foto = (id, ancho = 1080) => `/familias/foto/${id}-${ancho}.webp`
const yen = (n) => n.toLocaleString('ja-JP') + ' ¥'
const fecha = (iso, lang) => new Date(iso + 'T12:00:00Z').toLocaleDateString({ es: 'es-ES', en: 'en-GB', ar: 'ar' }[lang], { day: 'numeric', month: 'long', year: 'numeric' })
const ruta = (lang, temp) => UI[lang].base + (temp ? `${temp.slug[lang]}/` : '')
const wa = (lang, temp) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`${UI[lang].msg} ${temp ? temp.t[lang].nombre.toLowerCase() : ''}`.trim())}`
const vigente = (temp) => HOY <= temp.hasta
// La temporada que toca ahora (o la siguiente con oferta vigente) para la portada.
const actual = () => TEMPORADAS.find(vigente) ?? TEMPORADAS[0]

function hreflang(temp) {
  return LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${BASE}${ruta(l, temp)}">`).join('\n') +
    `\n<link rel="alternate" hreflang="x-default" href="${BASE}${ruta('en', temp)}">`
}

function jsonLd(lang, temp, desc) {
  const u = UI[lang]
  const grafo = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: u.inicio, item: `${BASE}/` },
        { '@type': 'ListItem', position: 2, name: u.marca, item: `${BASE}${ruta(lang)}` },
        ...(temp ? [{ '@type': 'ListItem', position: 3, name: temp.t[lang].nombre, item: `${BASE}${ruta(lang, temp)}` }] : []),
      ],
    },
    { '@type': 'FAQPage', inLanguage: lang, mainEntity: u.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ]
  const t = temp ?? actual()
  if (vigente(t)) {
    grafo.push({
      '@type': 'TouristTrip', name: `${u.oferta_t} · ${t.t[lang].nombre}`, description: sinHtml(desc), inLanguage: lang,
      touristType: 'TikTok and social media travellers',
      itinerary: { '@type': 'ItemList', itemListElement: t.sitios.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s[lang][0] })) },
      provider: { '@type': 'Person', name: 'Tony Hanma', url: `${BASE}/`, sameAs: ['https://www.instagram.com/tonykansaiguide/'] },
      offers: { '@type': 'Offer', price: PRECIO.tiktok, priceCurrency: 'JPY', validThrough: t.hasta, url: `${BASE}${ruta(lang, t)}`, availability: 'https://schema.org/InStock' },
    })
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': grafo })
}

function oferta(lang, temp) {
  const u = UI[lang]
  if (!vigente(temp)) return ''
  return `<aside class="oferta" data-r>
  <div>
    <p class="chip">${esc(u.oferta_eti)} · ${esc(temp.t[lang].nombre)}</p>
    <h2>${esc(u.oferta_t)}</h2>
    <p>${esc(u.oferta_d)}</p>
    <p class="nota">${esc(u.oferta_nota)}</p>
  </div>
  <div class="precio">
    <s>${yen(PRECIO.normal)}</s>
    <b>${yen(PRECIO.tiktok)}</b>
    <span>${esc(u.oferta_precio)} · ${PRECIO.horas} h</span>
    <small>${esc(u.hasta)} ${esc(fecha(temp.hasta, lang))}</small>
    <a class="btn" href="${wa(lang, temp)}" target="_blank" rel="noopener">${esc(u.reservar)}</a>
  </div>
</aside>`
}

function reel(s, lang, i) {
  const u = UI[lang]
  const [nombre, toma, hora, truco] = s[lang]
  const fondo = s.foto
    ? `<img src="${foto(s.foto, 720)}" srcset="${foto(s.foto, 720)} 720w, ${foto(s.foto, 1080)} 1080w" sizes="(max-width:700px) 80vw, 340px" alt="${esc(nombre)}" loading="lazy" decoding="async">`
    : `<div class="sin-foto ${s.tono ?? ''}" aria-hidden="true"></div>`
  return `<article class="reel" data-r>
  <div class="pantalla">${fondo}
    <h3>${esc(nombre)}</h3>
  </div>
  <dl>
    <dt>${esc(u.toma)}</dt><dd>${esc(toma)}</dd>
    <dt>${esc(u.hora)}</dt><dd>${esc(hora)}</dd>
    <dt>${esc(u.truco)}</dt><dd>${esc(truco)}</dd>
  </dl>
</article>`
}


function joyas(lang, temp, cuantas = 6) {
  const J = JOYAS_UI[lang]
  // Kanto primero en la portada: son los «trends chiquitos» que más piden
  const lista = [...(JOYAS_KANTO[temp.id] ?? []), ...(JOYAS[temp.id] ?? [])].slice(0, cuantas)
  if (!lista.length) return ''
  return `<section class="w joyas"><p class="eti">${esc(J.eti)} · ${esc(temp.t[lang].nombre)}</p>
<h2>${esc(J.titulo)}</h2><p class="lead">${esc(J.intro)}</p>
<ol class="joyas-l">${lista.map((j) => { const [n, donde, porque, ir] = j[lang]; return `<li data-r><h3>${esc(n)}</h3><p class="donde">${esc(donde)}</p><dl><dt>${esc(J.porque)}</dt><dd>${esc(porque)}</dd><dt>${esc(J.ir)}</dt><dd>${esc(ir)}</dd></dl></li>` }).join('')}</ol>
<div class="joyas-cta"><div><b>${esc(J.cta)}</b><p>${esc(J.cta_d)}</p></div><a class="btn" href="${wa(lang, temp)}" target="_blank" rel="noopener">WhatsApp</a></div>
</section>`
}

function tarjetaTemporada(t, lang) {
  return `<a class="temp" href="${ruta(lang, t)}" data-r>
  <img src="${foto(t.foto, 720)}" alt="" loading="lazy" decoding="async">
  <span class="temp-t"><b>${esc(t.t[lang].nombre)}</b><small>${esc(t.t[lang].meses)}</small></span>
  ${vigente(t) ? `<span class="temp-p">${yen(PRECIO.tiktok)}</span>` : ''}
</a>`
}

function creditos(ids, lang) {
  const unicos = [...new Set(ids.filter(Boolean))]
  return `<details class="creditos"><summary>${esc(UI[lang].credito)}</summary><ul lang="en" dir="ltr">${unicos.map((id) => {
    const f = FOTOS[id]
    return f ? `<li><a href="${esc(f.kaynak)}" target="_blank" rel="noopener">${esc(f.autor)}</a>, ${esc(f.lisans)}</li>` : ''
  }).join('')}</ul></details>`
}


// Kit para grabar: consejos de TikTok/Reels 2026 (vertical, audio en tendencia, etiqueta de
// lugar para TikTok GO, hashtags de temporada) + descuento por compartir el vídeo del tour.
const HASHTAGS = {
  otono: ['#京都紅葉', '#紅葉', '#momiji', '#kyotoautumn', '#japanautumn', '#tonykansaiguide'],
  invierno: ['#京都雪景色', '#イルミネーション', '#kyotowinter', '#snowyjapan', '#japanwinter', '#tonykansaiguide'],
  primavera: ['#桜', '#お花見', '#sakura', '#kyotosakura', '#cherryblossom', '#tonykansaiguide'],
}
const INSTAGRAM = 'https://www.instagram.com/tonykansaiguide/'
const KIT = {
  es: { eti: 'Tu vídeo, listo para TikTok', t: 'Cómo sacar el vídeo que se guarda',
    pasos: [['Vertical 9:16', 'Graba en vertical y a la hora buena: luz suave y sin gente detrás.'], ['Los 3 primeros segundos', 'Empieza por el plano más bonito; la explicación, después.'], ['Audio en tendencia', 'Elígelo dentro de TikTok al subirlo: da mucha más visibilidad.'], ['Etiqueta el lugar', 'Con la etiqueta de ubicación, quien vea tu vídeo puede encontrar el sitio y reservar desde TikTok (TikTok GO).']],
    tags: 'Hashtags de esta temporada', reels: 'Para Instagram Reels, súbelo sin la marca de agua de TikTok: así no lo esconde.',
    premio: 'Comparte el vídeo de tu tour y menciónanos en Instagram: 10 % menos en tu próximo tour.', ig: 'Instagram de Tony' },
  en: { eti: 'Your video, TikTok-ready', t: 'How to get the video people save',
    pasos: [['Vertical 9:16', 'Film vertically at the right hour: soft light and nobody behind you.'], ['The first 3 seconds', 'Open with the best shot; explain afterwards.'], ['Trending audio', 'Pick it inside TikTok when you upload: it gives far more reach.'], ['Tag the place', 'With a location tag, viewers can find the spot and book from TikTok (TikTok GO).']],
    tags: 'This season’s hashtags', reels: 'For Instagram Reels, upload it without the TikTok watermark so it is not hidden.',
    premio: 'Share your tour video and mention us on Instagram: 10% off your next tour.', ig: 'Tony on Instagram' },
  ar: { eti: 'فيديوك جاهز لتيك توك', t: 'كيف تصوّر الفيديو الذي يحفظه الناس',
    pasos: [['عمودي 9:16', 'صوّر بشكل عمودي وفي الوقت المناسب: ضوء ناعم ولا أحد خلفك.'], ['أول 3 ثوانٍ', 'ابدأ بأجمل لقطة، والشرح بعد ذلك.'], ['صوت رائج', 'اختره داخل تيك توك عند الرفع: يمنحك انتشارًا أكبر بكثير.'], ['أضف الموقع', 'مع وسم الموقع يستطيع من يشاهد الفيديو العثور على المكان والحجز من تيك توك (TikTok GO).']],
    tags: 'وسوم هذا الموسم', reels: 'لإنستغرام ريلز، ارفعه بدون علامة تيك توك المائية حتى لا يُخفى.',
    premio: 'شارك فيديو جولتك واذكرنا على إنستغرام: خصم 10٪ على جولتك القادمة.', ig: 'توني على إنستغرام' },
}
function kit(lang, temp) {
  const k = KIT[lang]
  return `<section class="w kit"><p class="eti">${esc(k.eti)}</p><h2>${esc(k.t)}</h2>
<ol class="kit-pasos">${k.pasos.map(([a, b], i) => `<li><span class="kit-n">${i + 1}</span><b>${esc(a)}</b><p>${esc(b)}</p></li>`).join('')}</ol>
<p class="kit-st">${esc(k.tags)}</p><p class="kit-tags" lang="ja" dir="ltr">${(HASHTAGS[temp.id] ?? []).map((h) => `<span>${esc(h)}</span>`).join(' ')}</p>
<p class="kit-nota">${esc(k.reels)}</p>
<p class="kit-premio">${esc(k.premio)} <a href="${INSTAGRAM}" target="_blank" rel="noopener">${esc(k.ig)} ${lang === 'ar' ? '←' : '→'}</a></p>
</section>`
}

function pagina(lang, temp) {
  const u = UI[lang]
  const titulo = temp ? `${sinHtml(temp.t[lang].h1)} · ${u.marca}` : u.titulo
  const desc = temp ? sinHtml(temp.t[lang].intro) : u.desc
  const portadaFoto = temp ? temp.foto : 'fushimi'
  const t = temp ?? actual()
  const cuerpo = temp
    ? `<section class="w"><p class="eti">${esc(temp.t[lang].meses)}</p><div class="reels">${temp.sitios.map((s, i) => reel(s, lang, i)).join('')}</div></section>
${joyas(lang, temp, 12)}
${kit(lang, temp)}
<section class="w">${oferta(lang, temp)}</section>
<section class="w"><p class="eti">${esc(u.otras)}</p><div class="temps">${TEMPORADAS.filter((x) => x !== temp).map((x) => tarjetaTemporada(x, lang)).join('')}</div></section>`
    : `<section class="w"><p class="eti">${esc(u.temporadas)}</p><div class="temps">${TEMPORADAS.map((x) => tarjetaTemporada(x, lang)).join('')}</div></section>
<section class="w">${oferta(lang, t)}</section>
${kit(lang, t)}
<section class="w"><p class="eti">${esc(t.t[lang].nombre)} · ${esc(t.t[lang].meses)}</p><div class="reels">${t.sitios.slice(0, 3).map((s, i) => reel(s, lang, i)).join('')}</div><p class="mas"><a href="${ruta(lang, t)}">${esc(t.t[lang].nombre)} →</a></p></section>
${joyas(lang, t, 3)}`
  const fotosUsadas = temp ? [temp.foto, ...temp.sitios.map((s) => s.foto)] : ['fushimi', ...TEMPORADAS.map((x) => x.foto), ...t.sitios.slice(0, 3).map((s) => s.foto)]
  return `<!doctype html>
<html lang="${lang}" dir="${u.dir}" data-estatica="tiktok">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${BASE}${ruta(lang, temp)}">
${hreflang(temp)}
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${BASE}${ruta(lang, temp)}">
<meta property="og:image" content="${BASE}${foto(portadaFoto, 1080)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0a0a0c">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;900&family=Inter:wght@400;500;600&family=Noto+Kufi+Arabic:wght@400;600;800&display=swap" rel="stylesheet">
<script type="application/ld+json">${jsonLd(lang, temp, desc)}</script>
<link rel="stylesheet" href="/tiktok/tiktok.css">
</head>
<body>
<header class="cab"><div class="w bar">
  <a class="marca" href="${ruta(lang)}"><span class="dot" aria-hidden="true"></span>${esc(u.marca)}</a>
  <nav class="idiomas" aria-label="${esc(u.otrosIdiomas)}">${LANGS.map((l) => `<a href="${ruta(l, temp)}" hreflang="${l}" lang="${l}"${l === lang ? ' aria-current="page"' : ''}>${l === 'ar' ? 'عربي' : l.toUpperCase()}</a>`).join('')}</nav>
  <a class="btn chico" href="${wa(lang, t)}" target="_blank" rel="noopener">WhatsApp</a>
</div></header>
<main>
<section class="heroe">
  <img class="heroe-f" src="${foto(portadaFoto, 1920)}" srcset="${foto(portadaFoto, 1080)} 1080w, ${foto(portadaFoto, 1920)} 1920w" sizes="100vw" alt="" fetchpriority="high">
  <div class="w heroe-in">
    ${temp ? `<nav class="miga"><a href="${ruta(lang)}">${esc(u.marca)}</a> / ${esc(temp.t[lang].nombre)}</nav>` : ''}
    <p class="chip">${esc(temp ? temp.t[lang].meses : u.eti)}</p>
    <h1 data-split>${temp ? temp.t[lang].h1 : u.h1}</h1>
    <p class="lead">${esc(temp ? temp.t[lang].intro : u.intro)}</p>
    <div class="ctas"><a class="btn" href="${wa(lang, t)}" target="_blank" rel="noopener">${esc(u.reservar)}</a>${vigente(t) ? `<span class="pill">${esc(u.oferta_eti)}: <b>${yen(PRECIO.tiktok)}</b> <s>${yen(PRECIO.normal)}</s></span>` : ''}</div>
  </div>
</section>
${cuerpo}
<section class="w faq"><p class="eti">${esc(u.faq_t)}</p>${u.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section>
</main>
<footer class="w pie">
  <p><a href="/${lang === 'es' ? 'es/' : lang === 'ar' ? 'ar/' : 'en/'}">${esc(u.inicio)}</a> · <a href="https://hbh.tonykansaiguide.com/">Humble Bumble Hanma</a> · <a href="${INSTAGRAM}" target="_blank" rel="noopener">Instagram</a> · <a href="mailto:tony@tonykansaiguide.com">tony@tonykansaiguide.com</a></p>
  ${creditos(fotosUsadas, lang)}
</footer>
<script src="/tiktok/tiktok.js" defer></script>
</body>
</html>
`
}

const CSS = `:root{--f:#0a0a0c;--f2:#141418;--t:#f4f4f6;--g:#9a9aa6;--b:#26262e;--rosa:#fe2c55;--cian:#25f4ee}
*{box-sizing:border-box;margin:0}html{-webkit-text-size-adjust:100%;overflow-x:clip}
body{background:var(--f);color:var(--t);font:400 16px/1.6 Inter,system-ui,sans-serif;overflow-x:clip}
[dir=rtl] body{font-family:"Noto Kufi Arabic",system-ui,sans-serif}
a{color:inherit}img{display:block;max-width:100%}
.w{width:min(1180px,100% - 32px);margin-inline:auto}
h1,h2,h3{font-family:Archivo,system-ui,sans-serif;font-weight:900;letter-spacing:-.03em;line-height:.98}
[dir=rtl] h1,[dir=rtl] h2,[dir=rtl] h3{font-family:"Noto Kufi Arabic",sans-serif;font-weight:800;letter-spacing:0;line-height:1.35}
.eti{font:600 12px/1 Inter,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--g);margin:0 0 22px}
[dir=rtl] .eti{letter-spacing:0;font-size:14px}
.chip{display:inline-block;font:600 12px/1 Inter,sans-serif;letter-spacing:.1em;text-transform:uppercase;padding:8px 12px;border-radius:999px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18)}
[dir=rtl] .chip{letter-spacing:0;font-size:13px}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:0 24px;border-radius:999px;background:var(--rosa);color:#fff;text-decoration:none;font:700 15px/1 Inter,sans-serif;transition:background .2s}
.btn:hover{background:#e0213f}
.btn.chico{min-height:38px;padding:0 16px;font-size:14px}
:focus-visible{outline:2px solid var(--cian);outline-offset:3px}
.cab{position:fixed;inset:0 0 auto;z-index:20;background:linear-gradient(rgba(10,10,12,.85),rgba(10,10,12,0))}
.bar{display:flex;align-items:center;gap:18px;height:66px}
.marca{display:flex;gap:10px;align-items:center;text-decoration:none;font:900 18px/1 Archivo,sans-serif;letter-spacing:-.02em}
.dot{width:14px;height:14px;border-radius:50%;background:var(--rosa)}
.idiomas{display:flex;gap:2px;margin-inline-start:auto;font-size:13px}
.idiomas a{text-decoration:none;padding:6px 9px;border-radius:999px;color:var(--g)}
.idiomas a[aria-current]{background:#fff;color:#000}
.heroe{position:relative;min-height:92svh;display:flex;align-items:flex-end;padding:120px 0 70px;overflow:hidden}
.heroe-f{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55}
.heroe::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,10,12,.2),var(--f) 92%)}
.heroe-in{position:relative;z-index:1;max-width:900px}
.heroe h1{font-size:clamp(46px,8vw,116px);margin:20px 0 22px}
.lead{font-size:clamp(17px,1.7vw,21px);color:#d6d6de;max-width:58ch}
.ctas{display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-top:30px}
.pill{font-size:14px;color:#d6d6de;background:rgba(0,0,0,.45);border:1px solid var(--b);padding:10px 14px;border-radius:999px}
.pill b{color:#fff}.pill s,.precio s{color:var(--g)}
.miga{font-size:13px;color:var(--g);margin-bottom:18px}.miga a{text-decoration:none}
section.w{padding:70px 0}
.temps{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.temp{position:relative;aspect-ratio:4/5;border-radius:22px;overflow:hidden;text-decoration:none;border:1px solid var(--b)}
.temp img{width:100%;height:100%;object-fit:cover;transition:transform .6s}
.temp:hover img{transform:scale(1.05)}
.temp::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.85))}
.temp-t{position:absolute;inset-inline:20px;bottom:20px;z-index:1;display:grid}
.temp-t b{font:900 34px/1 Archivo,sans-serif}[dir=rtl] .temp-t b{font-family:"Noto Kufi Arabic",sans-serif}
.temp-t small{color:#d6d6de}
.temp-p{position:absolute;top:16px;inset-inline-end:16px;z-index:1;background:var(--rosa);color:#fff;font:700 13px/1 Inter,sans-serif;padding:8px 10px;border-radius:999px}
.reels{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.reel{background:var(--f2);border:1px solid var(--b);border-radius:24px;overflow:hidden}
.pantalla{position:relative;aspect-ratio:9/13;overflow:hidden}
.pantalla img,.sin-foto{width:100%;height:100%;object-fit:cover}
.sin-foto{background:radial-gradient(circle at 30% 30%,#9bd36a,#2f5a1f 60%,#13240c)}
.sin-foto.nieve{background:radial-gradient(circle at 70% 20%,#fff,#cfe3f5 35%,#6f8fb3 75%,#2a3c55)}
.pantalla::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.35),transparent 30%,transparent 55%,rgba(0,0,0,.85))}
.barras{position:absolute;inset:12px 12px auto;display:flex;gap:4px;z-index:1}
.barras i{flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.35)}
.barras i:first-child{background:#fff}
.num{position:absolute;top:26px;inset-inline-start:14px;z-index:1;font:900 14px/1 Archivo,sans-serif;background:rgba(0,0,0,.4);padding:6px 8px;border-radius:8px}
.pantalla h3{position:absolute;inset-inline:18px;bottom:18px;z-index:1;font-size:28px}
.reel dl{padding:18px 20px 22px;display:grid;gap:4px}
.reel dt{font:600 11px/1 Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--cian);margin-top:10px}
[dir=rtl] .reel dt{letter-spacing:0;font-size:13px}
.reel dt:nth-of-type(3){color:var(--rosa)}
.reel dd{color:#d6d6de;font-size:15px}
.mas{margin-top:22px}.mas a{color:var(--cian);font-weight:600;text-decoration:none}
.oferta{display:grid;grid-template-columns:1.4fr .8fr;gap:30px;align-items:center;background:linear-gradient(135deg,rgba(254,44,85,.16),rgba(37,244,238,.08));border:1px solid var(--b);border-radius:28px;padding:clamp(26px,4vw,48px)}
.oferta h2{font-size:clamp(32px,4vw,52px);margin:16px 0 12px}
.oferta p{color:#d6d6de}.oferta .nota{color:var(--g);font-size:14px;margin-top:12px}
.precio{display:grid;gap:4px;justify-items:start;background:var(--f);border:1px solid var(--b);border-radius:22px;padding:26px}
.precio b{font:900 clamp(40px,5vw,60px)/1 Archivo,sans-serif;letter-spacing:-.03em}
.precio span{color:#d6d6de}.precio small{color:var(--g);margin-bottom:14px}
.kit h2{font:900 clamp(26px,4vw,40px)/1.05 Archivo,Inter,sans-serif;margin:6px 0 22px;text-wrap:balance}
.kit-pasos{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:12px}
.kit-pasos li{background:var(--f2);border:1px solid var(--b);border-radius:16px;padding:18px}
.kit-pasos b{display:block;font-size:17px;margin:8px 0 4px}.kit-pasos p{margin:0;color:var(--g);line-height:1.5}
.kit-n{display:inline-grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--rosa);color:#fff;font:700 14px/1 Inter,sans-serif;font-variant-numeric:tabular-nums}
.kit-st{margin:26px 0 8px;color:var(--g);font-size:14px}
.kit-tags{display:flex;flex-wrap:wrap;gap:8px;margin:0}[dir=rtl] .kit-tags{justify-content:flex-end}.kit-tags span{padding:7px 12px;border-radius:999px;border:1px solid var(--b);font-size:14px;user-select:all}
.kit-nota{color:var(--g);margin:18px 0 0}
.kit-premio{margin:18px 0 0;padding:16px 18px;border-radius:14px;border:1px solid var(--rosa);font-weight:600}.kit-premio a{color:var(--cian);white-space:nowrap}
.faq details{border-bottom:1px solid var(--b)}
.faq summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:16px;padding:20px 0;font:700 clamp(18px,2vw,22px)/1.3 Archivo,sans-serif}
[dir=rtl] .faq summary{font-family:"Noto Kufi Arabic",sans-serif}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";color:var(--rosa);font-size:24px}
.faq details[open] summary::after{content:"−"}
.faq p{color:#d6d6de;padding-bottom:20px;max-width:64ch}
.pie{border-top:1px solid var(--b);padding:30px 0 40px;font-size:14px;color:var(--g)}
.pie a{text-decoration:none}.pie a:hover{color:#fff}
.creditos{margin-top:12px}.creditos ul{padding-inline-start:18px;margin-top:8px;font-size:12px}
@media (max-width:900px){.reels,.temps{grid-template-columns:1fr 1fr}.oferta{grid-template-columns:1fr}}
@media (max-width:600px){.reels,.temps{grid-template-columns:1fr}.idiomas{display:none}.pantalla{aspect-ratio:4/5}}
.joyas h2{font-size:clamp(30px,4vw,52px);margin:0 0 12px}
.joyas .lead{margin-bottom:30px}
.joyas-l{list-style:none;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;counter-reset:j}
.joyas-l li{counter-increment:j;background:var(--f2);border:1px solid var(--b);border-radius:20px;padding:22px}
.joyas-l li::before{content:counter(j,decimal-leading-zero);display:block;font:700 13px/1 Inter,sans-serif;color:var(--rosa);margin-bottom:12px;font-variant-numeric:tabular-nums}
.joyas-l h3{font-size:24px;margin-bottom:6px}
.joyas-l .donde{color:var(--cian);font-size:14px;margin-bottom:10px}
.joyas-l dt{font:600 11px/1 Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--g);margin-top:10px}
[dir=rtl] .joyas-l dt{letter-spacing:0;font-size:13px}
.joyas-l dd{color:#d6d6de;font-size:15px}
.joyas-cta{display:flex;gap:20px;align-items:center;justify-content:space-between;margin-top:22px;padding:22px;border:1px solid var(--b);border-radius:20px}
.joyas-cta p{color:var(--g);font-size:14px}
@media (max-width:900px){.joyas-l{grid-template-columns:1fr 1fr}}
@media (max-width:600px){.joyas-l{grid-template-columns:1fr}.joyas-cta{flex-direction:column;align-items:flex-start}}
h1,h2,h3{text-wrap:balance}
p,dd{text-wrap:pretty}
.precio,.pill,.temp-p{font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`

// Animación progresiva: si GSAP no carga o se pide reducir movimiento, todo queda visible.
const JS = `(function(){
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
function cargar(src){return new Promise(function(ok,ko){var s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=ko;document.head.appendChild(s)})}
var g='https://cdn.jsdelivr.net/npm/gsap@${GSAP_V}/dist/';
Promise.all([cargar(g+'gsap.min.js')]).then(function(){return Promise.all([cargar(g+'ScrollTrigger.min.js'),cargar(g+'SplitText.min.js'),cargar('https://unpkg.com/lenis@${LENIS_V}/dist/lenis.min.js')])}).then(function(){
  gsap.registerPlugin(ScrollTrigger,SplitText);
  var lenis=new Lenis({lerp:.14});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0);
  document.querySelectorAll('[data-split]').forEach(function(el){var s=new SplitText(el,{type:'lines,words',mask:'lines'});gsap.from(s.words,{yPercent:110,duration:1,ease:'expo.out',stagger:.04})});
  gsap.utils.toArray('[data-r]').forEach(function(el){gsap.from(el,{y:40,opacity:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%'}})});
  gsap.to('.heroe-f',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.heroe',start:'top top',end:'bottom top',scrub:true}});
}).catch(function(){});
})();`

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })
writeFileSync(join(OUT, 'tiktok.css'), CSS)
writeFileSync(join(OUT, 'tiktok.js'), JS)
let n = 0
for (const lang of LANGS) {
  for (const temp of [null, ...TEMPORADAS]) {
    const dir = join(root, 'public', ruta(lang, temp))
    mkdirSync(dir, { recursive: true })
    const html = pagina(lang, temp)
    if (!html.includes('data-estatica="tiktok"')) throw new Error(`${ruta(lang, temp)}: falta data-estatica`)
    writeFileSync(join(dir, 'index.html'), html)
    n++
  }
}
console.log(`tiktok: ${n} páginas en public/tiktok/`)

/** Rutas para el sitemap (las importa build-sitemap.mjs). */
export const RUTAS_TIKTOK = LANGS.flatMap((l) => [null, ...TEMPORADAS].map((t) => ruta(l, t)))
