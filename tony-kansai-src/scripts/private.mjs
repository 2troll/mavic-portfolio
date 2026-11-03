#!/usr/bin/env node
// Genera public/private/**: la sección premium en inglés de Mario, guía privado
// de habla inglesa para todo Japón (equipo Tony Kansai Guide).
//
//   node scripts/private.mjs
//
// Clon de la arquitectura de scripts/francais.mjs: HTML estático a propósito,
// sin React, porque GPTBot, ClaudeBot y PerplexityBot no ejecutan JavaScript y
// quien pregunta a una IA «private tour guide Japan» tiene que encontrar el
// texto entero en la primera respuesta. rutas-estaticas.mjs no las pisa
// (llevan data-estatica en <html>).
//
// Regla de contenido: nada que no sea verdad. De Mario solo consta (3-11-2026):
// se llama Mario (solo el nombre), vive en Kansai (Kioto, Osaka, Nara: los tours
// de día por defecto) y guía en el resto de Japón si el cliente cubre su viaje
// (tren y hotel) al coste; lo que más le gusta son los viajes de varios días; lleva 4 años como guía privado profesional
// para viajeros de habla inglesa, habla también español, está casado con una
// japonesa y vive en Japón, organiza el día entero (trenes, traslados, reservas
// en japonés), guía en todo Japón y viaja con los clientes varios días, es del
// equipo Tony Kansai Guide y las reservas van directas a su WhatsApp.
// NO inventar apellido, nacionalidad, edad, licencias, premios, años en Japón,
// hoteles socios, prensa, número de clientes, notas ni reseñas.
// Web halal: nada de alcohol (ni sake, ni bares, ni izakaya, ni vino) ni juego.
//
// Fotos: reutiliza las de /tr/ y /fr/ (Wikimedia Commons con licencia libre,
// autor y licencia en sus manifiestos) y las propias de /private/foto/.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://tonykansaiguide.com'
const HOY = '2026-11-03'
const HOY_EN = 'November 3, 2026'
const PUBLICADO = '2026-11-03'

// WhatsApp de Mario: las reservas le llegan directamente a él.
const WA_NUMERO = '817089968582'
const WA_VISIBLE = '+81 70 8996 8582'
const wa = (texto) => `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(texto)}`
const WA_GENEL = wa('Hello Mario, I would like a private guide in Japan. Dates: ')

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// ---------- Reseñas ----------
// Las del Worker se meten en el HTML al construir (las IAs no ejecutan JS) y un
// script del cliente añade las que lleguen después. Se suman las de
// scripts/private-reviews.json (las que Mario traiga de antes), sin duplicar.
const API_RESENAS = 'https://tonykansaiguide.com/api/resenas/publicas?guia=mario'
let delWorker = []
try {
  const r = await fetch(API_RESENAS, { signal: AbortSignal.timeout(15000) })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  delWorker = (await r.json()).reviews ?? []
} catch (e) {
  console.warn(`⚠ private: sin reseñas del Worker (${e.message}); se usan solo las locales`)
}
let locales = []
const RUTA_LOCALES = join(root, 'scripts/private-reviews.json')
if (existsSync(RUTA_LOCALES)) {
  locales = JSON.parse(readFileSync(RUTA_LOCALES, 'utf8'))
  if (!Array.isArray(locales)) throw new Error('private: scripts/private-reviews.json debe ser un array')
}
const RESENAS = []
for (const y of [...delWorker, ...locales]) {
  if (!y?.id || !y.text || !y.stars || RESENAS.some((z) => z.id === y.id)) continue
  RESENAS.push({ ...y, stars: Math.max(1, Math.min(5, Math.round(+y.stars))) })
}

// ---------- Fotos ----------
// Mapa único clave → datos + carpeta servida. Si una clave falta, el build se para.
const PHOTOS = {}
for (const [archivo, carpeta] of [['scripts/turkce-fotolar.json', '/tr/foto'], ['scripts/francais-photos.json', '/fr/foto'], ['scripts/private-photos.json', '/private/foto']]) {
  const ruta = join(root, archivo)
  if (!existsSync(ruta)) continue
  const datos = JSON.parse(readFileSync(ruta, 'utf8'))
  for (const [k, p] of Object.entries(datos)) {
    if (!p || typeof p !== 'object' || !p.anchos) continue
    if (!PHOTOS[k]) PHOTOS[k] = { ...p, dir: p.dir ?? datos.dir ?? carpeta }
  }
}
const photo = (k) => { if (!PHOTOS[k]) throw new Error(`private: falta la foto ${k}`); return PHOTOS[k] }
const tiene = (k) => Boolean(PHOTOS[k])
// El ancho «grande» es el mayor ≤ 1920; el 3840 solo entra por srcset.
const grande = (k) => photo(k).anchos.find((w) => w <= 1920) ?? photo(k).anchos.at(-1)
const src = (k, w) => `${photo(k).dir}/${k}-${w}.webp`
const srcset = (k) => photo(k).anchos.map((w) => `${src(k, w)} ${Math.min(w, photo(k).w)}w`).join(', ')
const credit = (k) => `Photo: <a rel="nofollow" href="${esc(photo(k).kaynak)}">${esc(photo(k).autor)}</a> · ${esc(photo(k).lisans)}`
const imageDe = (k) => `${BASE}${src(k, grande(k))}`
const imgCarte = (k, alt, sizes = '(max-width:700px) 100vw, 400px') => `<img src="${src(k, photo(k).anchos.at(-1))}" srcset="${srcset(k)}" sizes="${sizes}" alt="${esc(alt)}" loading="lazy" width="${photo(k).w}" height="${photo(k).h}">`

// Las clases .kahraman/.ortu/.kap son las que anima /tr/hareket.js.
const hero = (k, alt, contenu, extra = '') => `<section class="kahraman ${extra}">
<img src="${src(k, grande(k))}" srcset="${srcset(k)}" sizes="100vw" alt="${esc(alt)}" width="${photo(k).w}" height="${photo(k).h}" fetchpriority="high">
<div class="ortu"><div class="kap">${contenu}</div></div>
<small class="kredi">${credit(k)}</small>
</section>`
const heroDuz = (contenu) => `<section class="kahraman duz"><div class="ortu"><div class="kap">${contenu}</div></div></section>`

// Tarjeta clicable: el crédito (con su propio enlace a Commons) va FUERA del <a>,
// porque un <a> dentro de otro es HTML inválido (igual que carteLien en francais).
const carteLien = (href, k, alt, titre, texte) => `<li class="kart"><a href="${href}"><figure class="kf">${imgCarte(k, alt)}</figure><div class="ki"><h3>${esc(titre)}</h3><p>${esc(texte)}</p></div></a><small class="kf-kredi">${credit(k)}</small></li>`

// Retrato de Mario (960×960).
const PORTRAIT_ALT = 'Mario, private English-speaking tour guide in Japan'
const PORTRAIT_URL = `${BASE}/private/foto/mario-960.webp`
const portraitGrand = `<div class="portre-kap"><img class="portre" src="/private/foto/mario-960.webp" srcset="/private/foto/mario-480.webp 480w, /private/foto/mario-960.webp 960w" sizes="(max-width:800px) 86vw, 440px" alt="${PORTRAIT_ALT}" width="960" height="960" loading="lazy"></div>`
const contactCard = (lien, texte = 'Message Mario on WhatsApp') => `<aside class="mario-kart" aria-label="Contact Mario"><img src="/private/foto/mario-480.webp" alt="${PORTRAIT_ALT}" width="96" height="96" loading="lazy"><div><p><strong>Mario</strong> · private English-speaking guide in Japan. Four years of guiding, fluent Spanish too, and the quiet logistics of someone who lives here and married into a Japanese family.</p><p><a class="btn" href="${lien}">${texte}</a></p></div></aside>`

const yen = (n) => `¥${n.toLocaleString('en-US')}`
const PRECIO = { medio: 45600, completo: 69600, largo: 84000, hora: 7200 }

// Ficha rápida: los datos que una IA puede citar sin leer toda la página.
const fiche = (titulo, filas = []) => `<aside class="fiche" aria-label="${esc(titulo)}">
<p class="etiket">${esc(titulo)}</p>
<dl>
${filas.map(([d, v]) => `<dt>${d}</dt><dd>${v}</dd>`).join('\n')}
<dt>Guide</dt><dd>Mario, private English-speaking guide (also speaks Spanish); four years guiding</dd>
<dt>Rates</dt><dd>Half day ${yen(PRECIO.medio)} · full day ${yen(PRECIO.completo)} · long day trips from ${yen(PRECIO.largo)} (per private party)</dd>
<dt>Book</dt><dd><a href="${WA_GENEL}">WhatsApp ${WA_VISIBLE}</a></dd>
</dl>
</aside>`

const faqHtml = (lista) => `<div class="sss">${lista.map(([q, r]) => `<details><summary>${esc(q)}</summary><p>${esc(r)}</p></details>`).join('\n')}</div>`
const faqLd = (lista) => ({ '@type': 'FAQPage', inLanguage: 'en', mainEntity: lista.map(([q, r]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: r } })) })
const migas = (lista) => ({ '@type': 'BreadcrumbList', itemListElement: [['Private guide', `${BASE}/private/`], ...lista].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) })

// ---------- Estilo ----------
const CSS = `
:root{--bg:#f7f3ec;--fg:#1a1714;--muted:#6b635a;--card:#fffdf9;--line:#e7dfd3;--gold:#a9864e;--gold-2:#c9a86a;--ink:#0f0d0b;--iv:#f7f3ec;--wa:#128c4a;--band:#0f0d0b;--serif:"Cormorant Garamond",Georgia,"Times New Roman",serif;--sans:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
@media (prefers-color-scheme:dark){:root{--bg:#0f0d0b;--fg:#efe8dc;--muted:#a59b8e;--card:#171411;--line:#2b261f;--gold:#c9a86a;--band:#171411}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%;overflow-x:clip}
body{margin:0;background:var(--bg);color:var(--fg);font:400 18px/1.7 var(--sans);padding-bottom:80px;overflow-x:clip;-webkit-font-smoothing:antialiased}
img{max-width:100%;height:auto}
a{color:inherit;text-decoration-color:var(--gold);text-decoration-thickness:1px;text-underline-offset:4px}
a:hover{color:var(--gold)}
:focus-visible{outline:2px solid var(--gold);outline-offset:3px}
p{margin:0 0 1.1em}
.kap{max-width:1200px;margin:0 auto;padding:0 16px}
@media (min-width:720px){.kap{padding:0 40px}}
h1,h2,h3{font-family:var(--serif);font-weight:500;line-height:1.08;letter-spacing:-.005em;margin:0;text-wrap:balance}
h2{font-size:clamp(32px,4vw,48px);margin:0 0 22px}
h3{font-size:clamp(24px,2.4vw,28px);font-weight:600;line-height:1.2}
.etiket{display:block;font:600 12px/1.5 var(--sans);letter-spacing:.22em;text-transform:uppercase;color:var(--gold);margin:0 0 16px}
.metin{max-width:720px}
.soluk{color:var(--muted)}
/* Cabecera */
header.ust{position:sticky;top:0;z-index:20;background:var(--bg);border-bottom:1px solid var(--line)}
@supports (backdrop-filter:blur(8px)){header.ust{background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(12px)}}
header.ust .kap{display:flex;align-items:center;gap:24px;min-height:68px}
.marka{font:600 21px/1.1 var(--serif);text-decoration:none;white-space:nowrap;flex:none;padding:12px 0}
.marka i{color:var(--gold);font-weight:500}
header nav{display:flex;margin-left:auto;min-width:0;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
header nav::-webkit-scrollbar{display:none}
header nav a{display:flex;align-items:center;min-height:44px;padding:0 11px;font:500 14px var(--sans);letter-spacing:.02em;white-space:nowrap;text-decoration:none;color:var(--muted)}
header nav a:hover{color:var(--fg)}
@media (max-width:960px){header.ust .kap{flex-wrap:wrap;gap:0;padding-top:6px}header nav{width:100%;margin-left:-11px;margin-right:-16px}.marka{padding:8px 0 0}}
/* Portada */
.kahraman{position:relative;min-height:92vh;min-height:92svh;display:flex;align-items:flex-end;overflow:hidden;background:var(--ink);color:#f7f3ec}
.kahraman.orta{min-height:78vh;min-height:78svh}.kahraman.kisa{min-height:66vh;min-height:66svh}
.kahraman>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;animation:yakin 22s cubic-bezier(.2,.6,.2,1) both}
@keyframes yakin{from{transform:scale(1.08)}to{transform:scale(1)}}
.kahraman .ortu{position:relative;width:100%;padding:180px 0 clamp(56px,10vh,112px);background:linear-gradient(180deg,rgba(15,13,11,0) 0,rgba(15,13,11,.28) 34%,rgba(15,13,11,.86) 100%)}
.kahraman.duz{min-height:auto;background:radial-gradient(120% 90% at 85% 0,#2a2219 0,#0f0d0b 60%)}
.kahraman.duz .ortu{background:none;padding:clamp(96px,14vw,168px) 0 clamp(64px,9vw,104px)}
.kahraman .etiket{color:var(--gold-2);text-shadow:0 1px 12px rgba(0,0,0,.6)}
.kahraman h1,.kahraman .alt{text-shadow:0 2px 24px rgba(0,0,0,.35)}
@media (max-width:720px){.kahraman .ortu{padding-top:120px;background:linear-gradient(180deg,rgba(15,13,11,.05) 0,rgba(15,13,11,.55) 22%,rgba(15,13,11,.9) 100%)}}
.kahraman .etiket::before{content:"";display:block;width:56px;height:1px;background:var(--gold-2);margin-bottom:20px}
.kahraman .etiket a{color:inherit;text-decoration:none}
.kahraman h1{font-size:clamp(40px,7vw,84px);line-height:1.02;font-weight:500;margin:0 0 22px;max-width:13em;color:#f7f3ec}
.kahraman .alt{font-size:clamp(18px,2vw,21px);line-height:1.6;max-width:36em;color:rgba(247,243,236,.88);margin:0}
.kahraman .maj{font-size:14px;color:rgba(247,243,236,.72);margin:18px 0 0;letter-spacing:.02em}
.kredi{position:absolute;right:12px;top:8px;z-index:2;font-size:10px;color:rgba(247,243,236,.6);max-width:calc(100% - 24px);text-align:right}
.kredi a{color:inherit}
/* Botones */
.dugmeler{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px}
.btn,.btn2{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:12px 28px;font:600 14px/1.2 var(--sans);letter-spacing:.08em;text-transform:uppercase;text-decoration:none;border-radius:2px;border:1px solid var(--ink);transition:background .35s,color .35s,border-color .35s;text-align:center}
.btn{background:var(--ink);color:#f7f3ec}.btn:hover{background:var(--gold);border-color:var(--gold);color:#0f0d0b}
.btn2{background:transparent;color:var(--fg);border-color:currentColor}.btn2:hover{color:var(--gold)}
.kahraman .btn,.bant .btn{background:#f7f3ec;color:#0f0d0b;border-color:#f7f3ec}
.kahraman .btn:hover,.bant .btn:hover{background:var(--gold-2);border-color:var(--gold-2)}
.kahraman .btn2,.bant .btn2{color:#f7f3ec;border-color:rgba(247,243,236,.55)}
@media (prefers-color-scheme:dark){.btn{background:var(--gold);border-color:var(--gold);color:#0f0d0b}.btn:hover{background:#f7f3ec;border-color:#f7f3ec}}
/* Secciones */
.blok{padding-block:clamp(48px,7vw,70px)}
.blok+.blok{border-top:1px solid var(--line)}
.blok:first-of-type{padding-top:clamp(64px,9vw,104px)}
.bas{margin-bottom:clamp(36px,5vw,56px);max-width:760px}
.bas p:not(.etiket){color:var(--muted);font-size:19px}
.giris{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:clamp(40px,6vw,80px);align-items:start}
@media (max-width:900px){.giris{grid-template-columns:1fr}}
.cevap{font:500 clamp(23px,2.5vw,29px)/1.45 var(--serif);border-left:1px solid var(--gold);padding:2px 0 2px clamp(20px,3vw,32px);margin:0}
.fiche{background:var(--card);border:1px solid var(--line);border-top:2px solid var(--gold);padding:28px 26px 22px}
.fiche dl{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:12px 20px;margin:0;font-size:15.5px;line-height:1.55}
.fiche dt{font:600 11px/1.9 var(--sans);letter-spacing:.18em;text-transform:uppercase;color:var(--gold)}
.fiche dd{margin:0}
@media (max-width:520px){.fiche dl{grid-template-columns:1fr;gap:2px}.fiche dd{margin-bottom:12px}}
/* Pilares y pasos */
ol.sutun{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:48px 36px}
ol.sutun>li{border-top:1px solid var(--line);padding-top:26px}
.no{display:block;font:italic 500 68px/1 var(--serif);color:var(--gold);margin-bottom:18px}
ol.sutun h3{margin-bottom:12px}ol.sutun p{color:var(--muted);font-size:16.5px;margin:0}
/* Mario */
.tanis{display:grid;grid-template-columns:minmax(0,440px) minmax(0,1fr);gap:clamp(48px,7vw,104px);align-items:center}
.portre-kap{padding:14px}
.portre{display:block;width:100%;aspect-ratio:1;object-fit:cover;outline:1px solid var(--gold);outline-offset:14px}
.imza{font:italic 500 52px/1 var(--serif);color:var(--gold);margin:8px 0 28px}
@media (max-width:820px){.tanis{grid-template-columns:1fr}.portre-kap{max-width:380px}}
/* Tarjetas con foto */
.izgara{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,272px),1fr));gap:24px}
.izgara>li{position:relative;min-width:0}
.kart>a{display:block;color:#f7f3ec;text-decoration:none}
.kf{margin:0;position:relative;aspect-ratio:4/5;overflow:hidden;border-radius:4px;background:#1a1714}
.kf img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 1.6s cubic-bezier(.2,.7,.2,1)}
.kart>a:hover .kf img,.kart>a:focus-visible .kf img{transform:scale(1.06)}
.kart .ki{position:absolute;left:0;right:0;bottom:0;padding:96px 22px 22px;background:linear-gradient(rgba(15,13,11,0),rgba(15,13,11,.88));border-radius:0 0 4px 4px}
.kart h3{font-size:clamp(28px,2.6vw,32px);font-weight:500;color:#f7f3ec}
.kart .ki p{margin:8px 0 0;font-size:14px;line-height:1.5;color:rgba(247,243,236,.84)}
.kf-kredi{position:absolute;left:0;right:0;top:0;padding:6px 10px 18px;font-size:10px;line-height:1.4;color:rgba(255,255,255,.78);background:linear-gradient(rgba(0,0,0,.45),transparent);pointer-events:none;border-radius:4px 4px 0 0}
.kf-kredi a{color:inherit;pointer-events:auto}
.izgara.yerler{grid-template-columns:repeat(auto-fill,minmax(min(100%,330px),1fr));gap:56px 36px}
.yerler .kf{aspect-ratio:4/3}
.yerler figcaption{position:absolute;left:0;right:0;bottom:0;padding:18px 10px 6px;font-size:10px;color:rgba(255,255,255,.8);background:linear-gradient(transparent,rgba(0,0,0,.5))}
.yerler figcaption a{color:inherit}
.yerler h3{margin:22px 0 10px}.yerler p{color:var(--muted);font-size:16.5px;margin:0}
.yerler li.yalin{border-top:2px solid var(--gold);padding-top:4px}
/* Día sugerido */
ol.zaman{list-style:none;padding:0;margin:0;max-width:780px;border-left:1px solid var(--line)}
ol.zaman>li{position:relative;padding:0 0 34px 34px}
ol.zaman>li::before{content:"";position:absolute;left:-5px;top:9px;width:9px;height:9px;border-radius:50%;background:var(--bg);border:1px solid var(--gold)}
.saat{display:block;font:600 12px/1.6 var(--sans);letter-spacing:.2em;text-transform:uppercase;color:var(--gold)}
/* Precios */
.fiyatlar{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;align-items:stretch}
@media (max-width:900px){.fiyatlar{grid-template-columns:1fr}}
.fiyat{background:var(--card);border:1px solid var(--line);border-top:2px solid var(--gold);padding:36px 30px 32px;display:flex;flex-direction:column}
.fiyat h3{font-size:30px;font-weight:500}
.tutar{font:500 clamp(48px,5vw,62px)/1 var(--serif);margin:20px 0 8px;letter-spacing:-.01em}
.birim{font-size:14px;color:var(--muted);margin:0}
.fiyat ul{list-style:none;padding:0;margin:24px 0 0;font-size:15.5px}
.fiyat li{border-top:1px solid var(--line);padding:11px 0}
.fiyat.onerilen{background:var(--ink);color:#f7f3ec;border-color:var(--ink);border-top-color:var(--gold-2)}
.fiyat.onerilen .birim{color:rgba(247,243,236,.7)}.fiyat.onerilen li{border-color:rgba(247,243,236,.16)}
@media (prefers-color-scheme:dark){.fiyat.onerilen{background:#241e17;border-color:#3a3127}}
.rozet{align-self:flex-start;font:600 11px/1 var(--sans);letter-spacing:.2em;text-transform:uppercase;background:var(--gold-2);color:#0f0d0b;padding:8px 11px;margin:0 0 18px}
.notlar{max-width:780px;margin-top:44px;font-size:16.5px;color:var(--muted)}
.notlar strong{color:var(--fg)}
.fiyat-satir{font:500 24px/1.4 var(--serif);border-top:1px solid var(--gold);border-bottom:1px solid var(--line);padding:22px 0;max-width:780px}
/* Reseñas */
ul.yorumlar{list-style:none;padding:0;margin:0;display:grid;gap:60px;max-width:880px}
ul.yorumlar>li{position:relative;padding-left:clamp(44px,6vw,64px)}
ul.yorumlar>li::before{content:"\\201C";position:absolute;left:0;top:-18px;font:500 104px/1 var(--serif);color:var(--gold)}
.yildizlar{color:var(--gold);letter-spacing:5px;font-size:14px;margin:0 0 12px}
.yorum-metin{font:italic 500 clamp(22px,2.6vw,30px)/1.42 var(--serif);margin:0 0 14px}
.kim{font-variant:small-caps;letter-spacing:.08em;color:var(--muted);font-size:17px;margin:0}
.bos{font:italic 500 clamp(24px,2.6vw,30px)/1.4 var(--serif);color:var(--muted);max-width:760px}
/* Preguntas */
.sss{max-width:860px;border-top:1px solid var(--line)}
details{border-bottom:1px solid var(--line)}
summary{list-style:none;cursor:pointer;position:relative;padding:22px 48px 22px 0;font:500 clamp(21px,2.2vw,25px)/1.3 var(--serif);min-height:44px}
summary::-webkit-details-marker{display:none}
summary::after{content:"+";position:absolute;right:6px;top:16px;font:300 30px/1 var(--sans);color:var(--gold);transition:transform .3s}
details[open] summary::after{transform:rotate(45deg)}
details p{margin:0 0 26px;color:var(--muted);max-width:740px}
/* Artículo */
.yazi{max-width:740px}
.yazi h2{margin:72px 0 20px}.yazi h2:first-child{margin-top:0}
.yazi h3{margin:36px 0 12px}
.yazi ul,.yazi ol{padding-left:22px;margin:0 0 1.2em}.yazi li{margin:0 0 .55em}.yazi li::marker{color:var(--gold)}
.tablo{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:8px 0 32px;max-width:100%}
table{border-collapse:collapse;width:100%;min-width:560px;font-size:15.5px;line-height:1.5}
th{font:600 11px/1.5 var(--sans);letter-spacing:.16em;text-transform:uppercase;color:var(--gold);text-align:left;padding:12px 16px 12px 0;border-bottom:1px solid var(--gold);vertical-align:bottom}
td{padding:14px 16px 14px 0;border-bottom:1px solid var(--line);vertical-align:top}
.ipucu{list-style:none;padding:0;margin:0;max-width:780px}
.ipucu li{padding:18px 0 18px 36px;border-bottom:1px solid var(--line);position:relative}
.ipucu li::before{content:"";position:absolute;left:0;top:32px;width:20px;height:1px;background:var(--gold)}
.mario-kart{display:flex;gap:24px;align-items:center;background:var(--card);border:1px solid var(--line);padding:26px;max-width:780px;margin:56px 0 0}
.mario-kart img{width:96px;height:96px;border-radius:50%;object-fit:cover;flex:none;outline:1px solid var(--gold);outline-offset:4px}
.mario-kart p{margin:0 0 6px;font-size:16.5px}.mario-kart .btn{margin-top:10px}
@media (max-width:540px){.mario-kart{flex-direction:column;align-items:flex-start}}
.bagla{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:0 36px}
.bagla li{border-top:1px solid var(--line)}
.bagla a{display:block;padding:16px 0;font:500 21px/1.35 var(--serif);text-decoration:none}
.bagla a::after{content:" →";color:var(--gold)}
.kaynak{font-size:14px;color:var(--muted)}
/* Banda final */
.bant{background:var(--band);color:#f7f3ec;text-align:center;padding:clamp(96px,13vw,160px) 0;margin-top:clamp(48px,7vw,70px)}
.bant .etiket{color:var(--gold-2)}
.bant h2{font-size:clamp(40px,6vw,72px);font-style:italic;margin:0 auto 18px;max-width:14em}
.bant p{color:rgba(247,243,236,.76);max-width:580px;margin:0 auto}
.bant .dugmeler{justify-content:center}
/* Pie */
footer{background:var(--band);color:rgba(247,243,236,.7);padding:72px 0 36px;font-size:15px;border-top:1px solid rgba(201,168,106,.35)}
footer a{color:#f7f3ec;text-decoration-color:rgba(201,168,106,.6)}
footer .marka{color:#f7f3ec;font-size:26px}
.pie-izgara{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:36px;margin:44px 0}
footer h2{font:600 11px/1.5 var(--sans);letter-spacing:.22em;text-transform:uppercase;color:var(--gold-2);margin:0 0 12px}
footer ul{list-style:none;padding:0;margin:0}footer li a{display:inline-block;padding:7px 0;line-height:1.4}
.pie-alt{border-top:1px solid rgba(247,243,236,.14);padding-top:22px;font-size:13.5px}
.wa-sabit{position:fixed;right:16px;bottom:16px;z-index:30;display:inline-flex;align-items:center;gap:10px;min-height:52px;padding:0 22px;background:var(--wa);color:#fff;font:600 15px/1 var(--sans);letter-spacing:.02em;text-decoration:none;border-radius:999px;box-shadow:0 12px 32px -10px rgba(0,0,0,.5)}
.wa-sabit:hover{color:#fff}
.wa-sabit svg{width:20px;height:20px;fill:currentColor}
html.lenis,html.lenis body{height:auto}.lenis.lenis-smooth{scroll-behavior:auto!important}
.hz .gir{opacity:0;transform:translateY(28px)}
@media (prefers-reduced-motion:reduce){.kahraman>img{animation:none}.kf img{transition:none}}`

const NAV = [['kyoto/', 'Kyoto'], ['tokyo/', 'Tokyo'], ['osaka-nara/', 'Osaka &amp; Nara'], ['mount-fuji-hakone/', 'Fuji &amp; Hakone'], ['multi-day-private-guide-japan/', 'Journeys'], ['#prices', 'Prices'], ['reviews/', 'Reviews'], ['about-mario/', 'About']]
const WA_ICONO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>'

// Se rellena más abajo; el pie enlaza todas las regiones y respuestas.
let REGIONES = []
let RESPUESTAS = []

function page({ yol, titre, desc, image, jsonld, corps }) {
  const url = `${BASE}/private/${yol ? `${yol}/` : ''}`
  // Precios es un ancla de la portada: desde cualquier página vuelve a /private/#prices.
  const navHref = (h) => `/private/${h}`
  return `<!doctype html>
<html lang="en" data-estatica="private">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(titre)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#0f0d0b">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="en" href="${url}">
<link rel="alternate" hreflang="x-default" href="${url}">
<meta property="og:type" content="${yol && !REGIONES.some((r) => r.yol === yol) && yol !== 'reviews' && yol !== 'about-mario' ? 'article' : 'website'}">
<meta property="og:site_name" content="Tony Kansai Guide">
<meta property="og:locale" content="en_US">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(titre)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${image}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600&display=swap">
<style>${CSS}</style>
</head>
<body>
<header class="ust"><div class="kap"><a class="marka" href="/private/">Mario <i>· Private Guide in Japan</i></a>
<nav aria-label="Main">${NAV.map(([h, t]) => `<a href="${navHref(h)}">${t}</a>`).join('')}</nav></div></header>
<main>
${corps}
</main>
<footer><div class="kap">
<a class="marka" href="/private/">Mario <i>· Private Guide in Japan</i></a>
<p style="max-width:720px;margin-top:18px">Mario is the premium English-speaking guide of <a href="/">Tony Kansai Guide</a>, based in Kansai and traveling with private parties across Japan. Tony, the founder, guides in Spanish, English and Arabic in Kansai. Bookings for Mario go directly to him on WhatsApp.</p>
<div class="pie-izgara">
<div><h2>Contact</h2><ul><li><a href="${WA_GENEL}">WhatsApp ${WA_VISIBLE}</a></li><li><a href="mailto:tony@tonykansaiguide.com">tony@tonykansaiguide.com</a></li><li><a href="/private/#prices">Prices</a></li><li><a href="/private/reviews/">Reviews</a></li><li><a href="/private/about-mario/">About Mario</a></li></ul></div>
<div><h2>Journeys</h2><ul>${REGIONES.map((r) => `<li><a href="/private/${r.yol}/">${esc(r.ad)}</a></li>`).join('')}</ul></div>
<div><h2>Plan your trip</h2><ul>${RESPUESTAS.map((c) => `<li><a href="/private/${c.yol}/">${esc(c.kisaBaslik)}</a></li>`).join('')}</ul></div>
<div><h2>Other languages</h2><ul><li><a href="/es/" hreflang="es">Español</a> · <a href="/en/" hreflang="en">English</a> · <a href="/ar/" hreflang="ar">العربية</a> <span>(Tony)</span></li><li><a href="/tr/" hreflang="tr">Türkçe</a> <span>(Ferhat)</span></li><li><a href="/fr/" hreflang="fr">Français</a> <span>(Iheb)</span></li><li><a href="/ru/" hreflang="ru">Русский</a></li></ul></div>
</div>
<p class="pie-alt">Prices in Japanese yen, per private party. Last updated <time datetime="${HOY}">${HOY_EN}</time>.</p>
</div></footer>
<a class="wa-sabit" href="${WA_GENEL}">${WA_ICONO}WhatsApp Mario</a>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.3.27/dist/lenis.min.js" defer></script>
<script src="/tr/hareket.js" defer></script>
</body>
</html>
`
}

// ---------- Datos estructurados comunes ----------
const NEGOCIO_LD = { '@type': 'LocalBusiness', '@id': `${BASE}/#negocio`, name: 'Tony Kansai Guide', url: `${BASE}/`, address: { '@type': 'PostalAddress', addressLocality: 'Osaka', addressRegion: 'Osaka', addressCountry: 'JP' } }
const MARIO_ID = `${BASE}/private/#mario`
const marioLd = {
  '@type': 'Person', '@id': MARIO_ID, name: 'Mario', jobTitle: 'Private tour guide',
  image: { '@type': 'ImageObject', url: PORTRAIT_URL, width: 960, height: 960, caption: PORTRAIT_ALT },
  knowsLanguage: ['en', 'es'],
  homeLocation: { '@type': 'Place', name: 'Kansai (Kyoto, Osaka, Nara), Japan' },
  areaServed: [...['Kyoto', 'Osaka', 'Nara'].map((name) => ({ '@type': 'City', name, containedInPlace: { '@type': 'Country', name: 'Japan' } })), { '@type': 'Country', name: 'Japan' }],
  contactPoint: { '@type': 'ContactPoint', contactType: 'reservations', telephone: `+${WA_NUMERO}`, url: `https://wa.me/${WA_NUMERO}`, availableLanguage: ['en', 'es'] },
  // Mismo @id que el negocio de index.html, para que las IAs unan a Mario con Tony Kansai Guide.
  worksFor: { '@id': `${BASE}/#negocio`, name: 'Tony Kansai Guide', url: `${BASE}/` },
  url: `${BASE}/private/`,
  description: 'Professional private tour guide for English-speaking travelers in Japan for four years; also speaks Spanish. Based in Kansai (Kyoto, Osaka, Nara) and married into a Japanese family. Day tours in Kansai; elsewhere in Japan he travels with guests, with his train fare and hotel nights at cost. Multi-day journeys across Japan are his favorite way to guide. He plans every day and makes Japanese-only restaurant and experience bookings.',
}
const ofertas = [
  { '@type': 'Offer', name: 'Private guide, half day (4 hours)', price: PRECIO.medio, priceCurrency: 'JPY' },
  { '@type': 'Offer', name: 'Private guide, full day (8 hours)', price: PRECIO.completo, priceCurrency: 'JPY' },
  { '@type': 'Offer', name: 'Long private day trip (Hiroshima & Miyajima, Mount Fuji, Nikko, Koyasan)', priceSpecification: { '@type': 'PriceSpecification', minPrice: PRECIO.largo, priceCurrency: 'JPY' }, priceCurrency: 'JPY' },
]
const serviceLd = (nombre, lugar = 'Japan', url = `${BASE}/private/`) => ({
  '@type': 'Service', name: nombre, serviceType: 'Private tour guide', provider: { '@id': MARIO_ID },
  areaServed: lugar === 'Japan' ? { '@type': 'Country', name: 'Japan' } : { '@type': 'Place', name: lugar, containedInPlace: { '@type': 'Country', name: 'Japan' } },
  availableLanguage: ['en', 'es'], offers: ofertas, url,
})
const resenaLd = RESENAS.map((y) => ({ '@type': 'Review', reviewRating: { '@type': 'Rating', ratingValue: y.stars, bestRating: 5 }, author: { '@type': 'Person', name: y.name || 'Guest' }, reviewBody: y.text, inLanguage: y.lang || 'en', ...(y.date ? { datePublished: y.date } : {}), itemReviewed: { '@id': MARIO_ID, '@type': 'Person', name: 'Mario' } }))

// ---------- Reseñas en HTML ----------
const carteResena = (y) => `<li data-id="${esc(y.id)}"><p class="yildizlar" aria-label="${y.stars} out of 5 stars">${'★'.repeat(y.stars)}${'☆'.repeat(5 - y.stars)}</p><p class="yorum-metin">${esc(y.text)}</p><p class="kim">${esc(y.name || 'Guest')}${y.country ? ` · ${esc(y.country)}` : ''}${y.tour ? ` · ${esc(y.tour)}` : ''}${y.date ? ` · ${esc(y.date)}` : ''}</p></li>`
// Con cero reseñas se ve una línea honesta; el script del cliente inserta las
// que lleguen después del build y oculta esa línea.
const RESENA_SCRIPT = `<script>
fetch('/api/resenas/publicas?guia=mario',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(d=>{
  const ul=document.getElementById('resenaLista'); if(!d||!ul) return
  const e=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c])
  for(const y of d.reviews||[]){ if(!y.id||!y.text||!y.stars||ul.querySelector('[data-id="'+CSS.escape(y.id)+'"]')) continue
    const s=Math.max(1,Math.min(5,Math.round(+y.stars)))
    ul.insertAdjacentHTML('afterbegin','<li data-id="'+e(y.id)+'"><p class="yildizlar">'+'★'.repeat(s)+'☆'.repeat(5-s)+'</p><p class="yorum-metin">'+e(y.text)+'</p><p class="kim">'+e(y.name||'Guest')+(y.country?' · '+e(y.country):'')+(y.tour?' · '+e(y.tour):'')+'</p></li>')
    const v=document.getElementById('resenaVacia'); if(v) v.hidden=true }
}).catch(()=>{})
</script>`
const WA_RESENA = wa('Hello Mario, here is my review of our time together in Japan: ')
const listaResenas = (limite) => `<ul class="yorumlar" id="resenaLista">${(limite ? RESENAS.slice(0, limite) : RESENAS).map(carteResena).join('')}</ul>
<p class="bos" id="resenaVacia" ${RESENAS.length ? 'hidden' : ''}>Reviews from Mario’s guests are being added here.</p>
${RESENA_SCRIPT}`

const PAGINAS = new Map()
const ecrire = (yol, html) => { if (PAGINAS.has(yol)) throw new Error(`private: página duplicada ${yol}`); PAGINAS.set(yol, html) }

// ---------- Regiones ----------
// Datos prácticos redondeados («about») y comprobados para 2026; nada de alcohol.
REGIONES = [
  {
    yol: 'kyoto', ad: 'Kyoto', kapak: 'kinkakuji', kapakAlt: 'Kinkaku-ji, the Golden Pavilion, reflected in its pond in Kyoto',
    titre: 'Luxury Private Guide in Kyoto with Mario | Car & Driver',
    desc: 'A private English-speaking guide in Kyoto: Fushimi Inari before the crowds, Kiyomizu-dera, Arashiyama, Gion, kaiseki and tea ceremony booked in Japanese.',
    h1: 'Kyoto, at the hour it belongs to you',
    alt: 'Temples before the crowds, gardens at their quietest, and a kaiseki table booked in Japanese weeks ahead. Kyoto with Mario is paced, private and entirely arranged.',
    cevap: 'A private day in Kyoto with Mario starts early, at Fushimi Inari or Kiyomizu-dera before the tour groups arrive, then moves through Higashiyama, Arashiyama or Gion at your pace. He books kaiseki lunches, tea ceremonies and a car with driver in Japanese. A full day (8 hours) is ¥69,600 per private party.',
    hizli: [['Best for', 'First visits, couples, families, slow travelers'], ['Ideal time', 'Two or three days; one guided day as a minimum'], ['Getting there', 'About 2 h 15 min from Tokyo by Nozomi shinkansen']],
    yerler: [
      ['Kiyomizu-dera', 'The great wooden stage above the eastern hills opens at 6:00. Arriving early means the view over the city, the maples or the cherry trees, without the shoulder-to-shoulder crowds of mid-morning.', 'kiyomizu-sonbahar'],
      ['Fushimi Inari Taisha', 'Thousands of vermilion torii climb Mount Inari. The shrine never closes, so Mario starts here at first light, when the tunnels are silent and the higher paths are almost empty.', 'fushimi-tunel'],
      ['Arashiyama', 'The bamboo grove, the Togetsukyo bridge and the temple gardens of western Kyoto. Best before 8:00, then a slower walk along the river once the day-trippers arrive.', 'arashiyama'],
      ['Gion', 'Kyoto’s historic geisha district of wooden machiya and lantern-lit lanes. Mario knows which private lanes now forbid photography and how to see Gion respectfully.', 'gion'],
      ['Nishiki Market', 'A narrow, covered market of pickles, tofu, knives and sweets known as Kyoto’s kitchen. A late-morning tasting walk before a proper lunch.', 'nishiki'],
      ['Kiyomizu after dark', 'During the spring and autumn illuminations, the temple and its forest are lit after sunset. A memorable close to a day, timed around dinner.', 'kiyomizu-gece'],
    ],
    gun: [
      ['07:30', 'Hotel lobby pick-up. Car with driver if you prefer, or a short taxi to Fushimi.'],
      ['08:00', 'Fushimi Inari, climbing past the busiest gates while the mountain is still quiet.'],
      ['10:30', 'Kiyomizu-dera, then the stone lanes of Sannenzaka and Ninenzaka before the crowds peak.'],
      ['12:30', 'Kaiseki lunch, reserved in Japanese, with dietary needs explained to the kitchen in advance.'],
      ['14:30', 'A private tea ceremony in a tatami room, with time to ask questions.'],
      ['16:00', 'Gion and Hanamikoji in the late light, then back to your hotel around 17:00 or on to dinner.'],
    ],
    ipuclari: [
      'Kyoto rewards early starts more than any city in Japan: from 7:00 to 9:00 the major sights feel like a different place.',
      'Buses are slow and crowded; a car with driver or well-chosen taxis save an hour or more in a full day.',
      'Several private lanes in Gion now ban photography, with fines posted on signs. Mario keeps you on the public streets.',
      'Kaiseki restaurants and tea ceremony rooms often take reservations only in Japanese, and the best fill weeks ahead in cherry blossom and autumn seasons.',
      'Late November is the peak of autumn color, and the busiest weeks of the year. Book the guide and the restaurants together.',
    ],
    faq: [
      ['How many days do you need in Kyoto?', 'Three or four days is ideal for a first visit, with Nara as a half or full day trip. With one guided day, Mario covers Fushimi Inari, Kiyomizu-dera and Gion; with two, add Arashiyama and Kinkaku-ji.'],
      ['Can Mario arrange a private car and driver in Kyoto?', 'Yes. He arranges a car with driver on request and the cost is paid separately, at cost. A car makes the most sense for families, for guests who prefer less walking, and for days that combine distant areas such as Arashiyama and Fushimi.'],
      ['Can Mario book a tea ceremony and kaiseki lunch?', 'Yes. He reserves in Japanese, explains allergies and dietary needs to the kitchen in advance, and times the bookings around the rest of the day. Meals and fees are paid at cost.'],
    ],
    voir: ['kyoto-private-tour-car-driver', 'best-time-to-visit-japan', 'japan-itinerary-two-weeks'],
  },
  {
    yol: 'tokyo', ad: 'Tokyo', kapak: 'senso-ji-pagode', kapakAlt: 'The five-story pagoda of Senso-ji temple in Asakusa, Tokyo',
    titre: 'English-Speaking Private Guide in Tokyo | Mario',
    desc: 'Private English-speaking guide in Tokyo: Senso-ji at opening, Meiji Jingu, the Imperial Palace gardens and Shibuya, with sushi counters booked in Japanese.',
    h1: 'Tokyo, made simple and personal',
    alt: 'Old Edo and the modern capital in one well-paced day: early temples, quiet gardens, a sushi counter booked in Japanese, and none of the guesswork of the world’s largest rail network.',
    cevap: 'With Mario, a private day in Tokyo links Asakusa, the Imperial Palace gardens, Nihonbashi, Meiji Jingu and Shibuya in a logical order, using trains or a car with driver. He reserves sushi counters and experiences in Japanese and adapts on the spot. A full day (8 hours) is ¥69,600 per private party.',
    hizli: [['Best for', 'Arrival days, first-time visitors, families'], ['Ideal time', 'Three or four days, plus day trips'], ['Day trips', 'Mount Fuji, Hakone, Nikko, Kamakura']],
    yerler: [
      ['Senso-ji and Kaminarimon', 'Tokyo’s oldest temple and its great red lantern. The main hall opens at 6:00, and an early visit sees Asakusa before the shopping street fills.', 'kaminarimon'],
      ['Meiji Jingu', 'The shrine to Emperor Meiji and Empress Shoken, deep in a planted forest beside Harajuku. Its gates open at sunrise, the calmest time to walk in.', 'meiji-jingu'],
      ['Shibuya', 'The famous scramble crossing and the city seen from above at dusk. Mario times the viewpoint so you see the lights come on.', 'shibuya'],
      ['Imperial Palace East Gardens', 'The stone walls and moats of Edo Castle in the heart of the city. The gardens are usually closed on Mondays and Fridays, which Mario plans around.', 'palais-imperial'],
      ['Tokyo Skytree', 'At 634 meters, Japan’s tallest structure, with decks at 350 and 450 meters. Clear winter mornings can show Mount Fuji on the horizon.', 'skytree'],
      ['Nihonbashi', 'The old merchant heart of Tokyo. Takashimaya’s 1933 store was the first department store named an Important Cultural Property, and its food halls are a lesson in Japanese hospitality.', 'takashimaya-nihonbashi'],
      ['Inokashira Park', 'A leafy pond park in Kichijoji, a short walk from the Ghibli Museum, where Tokyo slows down. Ghibli tickets are sold in advance and go quickly.', 'inokashira'],
    ],
    gun: [
      ['08:00', 'Hotel lobby pick-up and a short ride to Asakusa for Senso-ji before the crowds.'],
      ['10:00', 'Imperial Palace East Gardens and the walls of Edo Castle.'],
      ['12:00', 'A sushi counter in Ginza or Nihonbashi, reserved in Japanese.'],
      ['14:00', 'Meiji Jingu and its forest approach, then Omotesando’s architecture.'],
      ['16:30', 'Shibuya crossing and a timed viewpoint at dusk, then a car or train back to your hotel.'],
    ],
    ipuclari: [
      'Tokyo is a cluster of cities; grouping neighborhoods saves hours. East (Asakusa, Ueno), center (Palace, Ginza, Nihonbashi) and west (Harajuku, Shibuya, Shinjuku) each fill a half day well.',
      'A guided first day pays off: Mario sets up IC cards, shows you how the trains and transfers work, and leaves you confident for the free days that follow.',
      'Avoid trains between about 7:30 and 9:30 on weekdays with luggage; send suitcases ahead with luggage forwarding instead.',
      'The best sushi counters seat eight to twelve guests and accept bookings weeks ahead, often in Japanese only.',
    ],
    faq: [
      ['Is a private guide worth it in Tokyo?', 'For a first visit, yes, especially on day one. Tokyo’s rail network, station exits and reservations are where most time is lost. A guided day teaches the system, covers the main neighborhoods efficiently and makes the rest of the trip easier.'],
      ['Can Mario plan day trips from Tokyo?', 'Yes. Mount Fuji and Hakone, Nikko and Kamakura are classic day trips. Long day trips such as Mount Fuji or Nikko start from ¥84,000 per private party, plus Mario’s train fare and hotel from Kansai at cost. Many guests combine Tokyo with a multi-day journey with Mario.'],
      ['Does Mario meet guests at their hotel?', 'Yes. Days usually begin with a hotel lobby pick-up, and Mario can also meet you at a station or at your first sight.'],
    ],
    voir: ['mount-fuji-hakone', 'first-time-japan-tips', 'japan-itinerary-two-weeks'],
  },
  {
    yol: 'osaka-nara', ad: 'Osaka & Nara', kapak: 'osaka-kale-hendek', kapakAlt: 'Osaka Castle above its stone walls and moat',
    titre: 'Private Guide in Osaka & Nara | Mario, English-Speaking',
    desc: 'Private English-speaking guide for Osaka and Nara: Todai-ji before the crowds, Nara’s deer, Kasuga Taisha, Osaka Castle, Kuromon Market and Dotonbori.',
    h1: 'Osaka & Nara, an ancient capital and a city of food',
    alt: 'Japan’s first great capital, with its giant bronze Buddha and gentle deer, paired with Osaka’s castle and its famously generous food culture.',
    cevap: 'Osaka and Nara pair naturally in one private day: Todai-ji, Nara Park and Kasuga Taisha in the morning, then Osaka Castle, Kuromon Market and Dotonbori in the afternoon and evening. Nara is about 35 to 45 minutes from Osaka by train. A full day with Mario is ¥69,600 per private party.',
    hizli: [['Best for', 'Families, food lovers, travelers based in Osaka or Kyoto'], ['Ideal time', 'One full day, or Nara as a half day from Kyoto'], ['Getting there', 'Kyoto to Osaka about 15 min by shinkansen']],
    yerler: [
      ['Osaka Castle', 'The great keep above massive stone walls and moats, rebuilt in 1931 and now a museum of the castle’s story. Lit beautifully after dark.', 'osaka-kale-gece'],
      ['Dotonbori', 'Neon, the canal and Osaka’s street food: takoyaki, okonomiyaki and grilled skewers of seafood. At its liveliest in the early evening.', 'dotonbori'],
      ['Kuromon Market', 'Around 150 stalls of seafood, wagyu, fruit and sweets. Mario steers you to the counters locals use, late morning, before it gets crowded.', 'kuromon'],
      ['Todai-ji', 'The Great Buddha Hall, one of the largest wooden buildings in the world, shelters a bronze Buddha about 15 meters tall. Arrive at opening for the calmest visit.', 'todaiji'],
      ['Nara Park’s deer', 'Over a thousand deer, considered messengers of the gods, roam freely. Mario shows you how to feed them gently and when to keep your distance.', 'nara-geyik'],
      ['Kasuga Taisha', 'A vermilion shrine in an ancient forest, with some 3,000 stone and bronze lanterns lining its paths.', 'kasuga'],
    ],
    gun: [
      ['08:30', 'Hotel lobby pick-up in Osaka or Kyoto and a train or car to Nara.'],
      ['09:30', 'Todai-ji and the Great Buddha, before the school groups and tour buses.'],
      ['11:00', 'Nara Park’s deer and the forest walk to Kasuga Taisha.'],
      ['12:30', 'Lunch in Naramachi’s old merchant quarter, then the train to Osaka.'],
      ['15:00', 'Osaka Castle and its grounds.'],
      ['17:30', 'Dotonbori as the lights come on, with a street-food walk or a reserved wagyu dinner.'],
    ],
    ipuclari: [
      'From Osaka-Namba, the Kintetsu line reaches Nara in about 40 minutes and stops a short walk from the park.',
      'Deer bow when they see deer crackers; keep paper bags and maps out of reach, and do not tease them.',
      'Kuromon is best from late morning; many stalls close by late afternoon.',
      'Osaka is a natural base for Kansai with Kansai International Airport (KIX) about an hour away.',
    ],
    faq: [
      ['Can you see Osaka and Nara in one day?', 'Yes, comfortably, with Nara in the morning and Osaka from mid-afternoon. With more time, Nara deserves a relaxed half day and Osaka a full one.'],
      ['Is Nara a good day trip from Kyoto?', 'Yes. Nara is about 45 minutes from Kyoto by train. Mario often guides it as a half day (4 hours, ¥45,600) from Kyoto.'],
      ['What should we eat in Osaka?', 'Takoyaki, okonomiyaki, kushikatsu skewers, fresh seafood at Kuromon and wagyu. Mario reserves restaurants in Japanese and explains dietary needs to the kitchen.'],
    ],
    voir: ['japan-family-trip-private-guide', 'japan-itinerary-two-weeks', 'first-time-japan-tips'],
  },
  {
    yol: 'mount-fuji-hakone', ad: 'Mount Fuji & Hakone', kapak: 'fuji-chureito', kapakAlt: 'Mount Fuji behind the Chureito pagoda',
    titre: 'Mount Fuji Private Day Trip from Tokyo | Mario',
    desc: 'A private Mount Fuji day trip from Tokyo with an English-speaking guide: Chureito pagoda, Lake Kawaguchi, Oshino Hakkai or Hakone, by car with driver or train.',
    h1: 'Mount Fuji & Hakone, without the coach tour',
    alt: 'The mountain at its clearest in the morning, lakeside shrines, volcanic valleys and a ryokan night if you want one. Planned around the weather, not a bus timetable.',
    cevap: 'A private Mount Fuji day trip with Mario chooses one area well: the Fuji Five Lakes (Chureito pagoda, Lake Kawaguchi, Oshino Hakkai) or Hakone (Lake Ashi, Hakone Shrine, Owakudani), by car with driver or limited express train from Tokyo. Long day trips start from ¥84,000 per private party; car and transport are paid at cost.',
    hizli: [['Best for', 'Couples, photographers, families, honeymooners'], ['Ideal time', 'One long day, or one to two nights in Hakone'], ['Getting there', 'About 2 hours from Shinjuku by train or car']],
    yerler: [
      ['Lake Kawaguchi', 'The easiest of the Fuji Five Lakes to reach, with the mountain reflected on still mornings.', 'kawaguchiko-fuji'],
      ['Oshino Hakkai', 'Eight clear ponds fed by Fuji’s snowmelt, filtered through lava for decades. Best visited early, before the coach groups.', 'oshino-hakkai'],
      ['Lake Ashi', 'A caldera lake with Fuji to the west, crossed by sightseeing boats between Hakone-machi and Togendai.', 'hakone-ashi-torii'],
      ['Owakudani', 'A steaming volcanic valley reached by ropeway, where eggs boiled in the hot springs turn black. Access depends on volcanic activity.', 'owakudani'],
      ['Hakone Shrine', 'A cedar-shaded shrine whose Torii of Peace stands in the water of Lake Ashi.', 'hakone-jinja-torii'],
    ],
    gun: [
      ['07:30', 'Hotel lobby pick-up in Tokyo by car with driver, or a reserved limited express from Shinjuku.'],
      ['09:30', 'The 398 steps to the Chureito pagoda for the classic view of Fuji, while the sky is clearest.'],
      ['11:00', 'Oshino Hakkai’s spring-fed ponds.'],
      ['12:30', 'Lunch by Lake Kawaguchi; hoto noodles are the local specialty.'],
      ['14:00', 'The lakeshore and a viewpoint chosen for the day’s light and cloud.'],
      ['16:00', 'Return to Tokyo, arriving in the early evening, traffic depending.'],
    ],
    ipuclari: [
      'Fuji hides in cloud more often than not, especially in summer. Mario watches the forecast and, if needed, swaps the day with another on your itinerary.',
      'Combining Hakone and the Fuji Five Lakes in one day is possible by car but rushed; choose one, or stay a night.',
      'A night in a Hakone ryokan with a private onsen and kaiseki dinner is one of the great experiences of Japan; the best rooms book months ahead.',
      'Luggage forwarding lets you travel to Hakone with a small bag while suitcases go straight to your Kyoto hotel.',
    ],
    faq: [
      ['How much is a private Mount Fuji day trip from Tokyo?', 'Mario’s long day trips start from ¥84,000 per private party for the guide. Because Mario is based in Kansai, his train fare and hotel night are added at cost; your transport (car with driver or train tickets), admissions and meals are also paid at cost.'],
      ['Hakone or Kawaguchiko: which is better?', 'Kawaguchiko has the closest, most iconic views of Fuji; Hakone has more variety, with the lake, ropeway, art museums and ryokan. For one day focused on the mountain, choose Kawaguchiko.'],
      ['What if Mount Fuji is covered by clouds?', 'It happens often. Mario checks the forecast and webcams, and if the outlook is poor he suggests switching days or adjusting the route toward sights that are beautiful in any weather.'],
    ],
    voir: ['multi-day-private-guide-japan', 'japan-honeymoon-private-guide', 'best-time-to-visit-japan'],
  },
  {
    yol: 'nikko-kamakura', ad: 'Nikko & Kamakura', kapak: 'nikko-yomeimon', kapakAlt: 'The gilded Yomeimon gate of Nikko Toshogu shrine',
    titre: 'Nikko & Kamakura Private Day Trips from Tokyo | Mario',
    desc: 'Two private day trips from Tokyo: Nikko’s Toshogu, Kegon Falls and Lake Chuzenji, or Kamakura’s Great Buddha, Hase-dera and Enoshima.',
    h1: 'Nikko & Kamakura, two days beyond Tokyo',
    alt: 'Gilded shrines and mountain waterfalls to the north, a coastal town of temples and a giant Buddha to the south. Each is its own day, planned with care.',
    cevap: 'Nikko and Kamakura are two separate private day trips from Tokyo. Nikko, about two hours north, has the UNESCO-listed Toshogu shrine, Kegon Falls and Lake Chuzenji; Kamakura, about an hour south, has the Great Buddha, Hase-dera and Enoshima. Nikko is a long day trip from ¥84,000; Kamakura is a full day at ¥69,600.',
    hizli: [['Best for', 'Second visits, history lovers, autumn color'], ['Ideal time', 'One day each; never both in one day'], ['Getting there', 'Nikko about 2 h north; Kamakura about 1 h south']],
    yerler: [
      ['Shinkyo Bridge', 'The sacred vermilion bridge over the Daiya River at the entrance to Nikko’s shrines.', 'shinkyo'],
      ['Kegon Falls', 'A 97-meter waterfall dropping from Lake Chuzenji, seen from a platform reached by elevator.', 'kegon'],
      ['Lake Chuzenji', 'A mountain lake beneath Mount Nantai, reached by the 48 hairpin bends of the Irohazaka road. Autumn color arrives here in October, weeks before Tokyo.', 'chuzenji'],
      ['Kamakura’s Great Buddha', 'A bronze Buddha about 11 meters tall at Kotoku-in, sitting in the open air since its hall was lost centuries ago.', 'kamakura-daibutsu'],
      ['Tsurugaoka Hachimangu', 'Kamakura’s great shrine, at the end of a long approach from the station, founded by the first shogunate.', 'tsurugaoka'],
      ['Hase-dera', 'A hillside temple with views over Sagami Bay and a famous hydrangea path in June.', 'hasedera'],
      ['Enoshima', 'A small island joined to the coast by a bridge, reached on the little Enoden railway.', 'enoshima'],
    ],
    gun: [
      ['07:30', 'Meet at Asakusa for the Tobu Spacia X limited express, about 1 h 50 min to Nikko, or a car with driver from your hotel.'],
      ['10:00', 'Shinkyo Bridge, then Toshogu: the Yomeimon gate, the sleeping cat and the three wise monkeys.'],
      ['13:00', 'Lunch of yuba, Nikko’s delicate tofu skin, prepared in many ways.'],
      ['14:30', 'Up the Irohazaka road to Kegon Falls and Lake Chuzenji.'],
      ['17:00', 'Train or car back to Tokyo, arriving in the evening.'],
    ],
    ipuclari: [
      'Toshogu closes earlier from November to March (around 16:00), so winter days start early.',
      'In October and early November, the Irohazaka road can jam on weekends; Mario plans weekday visits or early starts.',
      'In Kamakura, the Enoden railway links Kamakura station, the Great Buddha (Hase station) and Enoshima.',
      'Hase-dera’s hydrangeas in June draw long queues; weekday mornings are best.',
    ],
    faq: [
      ['Can you do Nikko and Kamakura in one day?', 'No. They lie in opposite directions from Tokyo, about three hours apart. Each deserves its own day.'],
      ['Is Nikko worth a day trip from Tokyo?', 'Yes. Its shrines and temples are a UNESCO World Heritage Site, and the mountain scenery around Lake Chuzenji is among the finest near Tokyo, especially in autumn.'],
      ['How much is a private guide for Nikko?', 'Nikko is a long day trip, from ¥84,000 per private party. Kamakura is a full day, ¥69,600. Mario travels from Kansai, so his train fare and hotel nights are added at cost, as are transport, admissions and meals.'],
    ],
    voir: ['multi-day-private-guide-japan', 'best-time-to-visit-japan', 'japan-itinerary-two-weeks'],
  },
  {
    yol: 'himeji-kobe', ad: 'Himeji & Kobe', kapak: 'himeji', kapakAlt: 'Himeji Castle, the White Heron castle, against a blue sky',
    titre: 'Himeji Castle & Kobe Private Tour | Mario',
    desc: 'A private day to Himeji Castle and Kobe: Japan’s finest original castle, Koko-en garden, Kitano’s old houses, the harbor and a Kobe beef lunch.',
    h1: 'Himeji & Kobe, a castle and a harbor',
    alt: 'Japan’s most beautiful original castle in the morning, its gardens at their calmest, then Kobe’s harbor, hillside merchant houses and a Kobe beef lunch.',
    cevap: 'A private day with Mario reaches Himeji Castle at opening by shinkansen, about 30 minutes from Shin-Osaka, then the gardens of Koko-en, before continuing to Kobe for a Kobe beef lunch, the Kitano district and the harbor. It is a full day (8 hours) at ¥69,600 per private party, from Osaka or Kyoto.',
    hizli: [['Best for', 'Castle and history lovers, wagyu, a second Kansai day'], ['Ideal time', 'One full day'], ['Getting there', 'Himeji about 30 min from Shin-Osaka by shinkansen']],
    yerler: [
      ['Himeji Castle up close', 'The keep is original, not a postwar rebuild, and one of Japan’s first UNESCO World Heritage Sites (1993). Its steep wooden stairs are part of the experience.', 'himeji-yakin'],
      ['Koko-en Garden', 'Nine walled gardens beside the castle, opened in 1992 on the site of samurai residences, with a teahouse serving matcha.', 'kokoen'],
      ['Kitano', 'Western merchant houses from the late 19th and early 20th centuries on Kobe’s hillside, a reminder of the port’s opening to the world in 1868.', 'kitano'],
      ['Kobe Harbor', 'Meriken Park, the red Port Tower and the waterfront, best in the late afternoon.', 'kobe-liman'],
      ['Mount Rokko at night', 'The view over Kobe and Osaka Bay after dark, one of Japan’s classic night views, by ropeway or car.', 'rokko-gece'],
    ],
    gun: [
      ['08:15', 'Hotel lobby pick-up and the shinkansen from Shin-Osaka or Kyoto to Himeji.'],
      ['09:00', 'Himeji Castle at opening, climbing the keep before the queues form.'],
      ['11:00', 'Koko-en garden and a bowl of matcha in its teahouse.'],
      ['12:30', 'Train to Kobe and a teppanyaki lunch of Kobe beef, reserved in advance.'],
      ['15:00', 'Kitano’s hillside houses, then down to the harbor.'],
      ['17:30', 'Return to Osaka or Kyoto, or stay for the night view from Mount Rokko.'],
    ],
    ipuclari: [
      'Himeji Castle opens at 9:00; arriving at opening avoids the long climb in a queue.',
      'Genuine Kobe beef is certified; Mario reserves restaurants that show the certificate.',
      'Shoes come off inside the castle keep; wear socks and comfortable clothes for the steep stairs.',
    ],
    faq: [
      ['Is Himeji Castle worth a day trip?', 'Yes. It is the finest surviving original castle in Japan and only about 30 minutes from Shin-Osaka by shinkansen, so it combines easily with Kobe in one day.'],
      ['Can you visit Himeji and Kobe in one day?', 'Yes. Himeji in the morning and Kobe in the afternoon is a natural pairing; Kobe is on the way back toward Osaka and Kyoto.'],
      ['Where can we eat Kobe beef?', 'In Kobe’s teppanyaki and steak restaurants. Mario books in Japanese, chooses certified Kobe beef, and the meal is paid separately at cost.'],
    ],
    voir: ['luxury-private-tour-guide-japan', 'japan-family-trip-private-guide', 'private-tour-guide-japan-cost'],
  },
  {
    yol: 'hiroshima-miyajima', ad: 'Hiroshima & Miyajima', kapak: tiene('miyajima-torii') ? 'miyajima-torii' : null, kapakAlt: 'The floating torii of Itsukushima Shrine on Miyajima at sunset',
    titre: 'Hiroshima & Miyajima Private Tour | Mario',
    desc: 'Hiroshima and Miyajima in one private day from Kyoto or Osaka: Peace Memorial Park and Museum, then Itsukushima Shrine. From ¥84,000 per party.',
    h1: 'Hiroshima & Miyajima, one unforgettable day',
    alt: 'A morning of remembrance at the Peace Memorial Park and Museum, then a ferry to the island shrine of Itsukushima and its great torii standing in the sea.',
    cevap: 'Hiroshima and Miyajima are always one day together: the Peace Memorial Park and Museum in the morning, then the train and ferry to Miyajima for Itsukushima Shrine in the afternoon. From Kyoto (about 1 h 40 min) or Shin-Osaka (about 1 h 25 min) by shinkansen. With Mario it is a long day trip, from ¥84,000 per private party.',
    hizli: [['Best for', 'Every first visit; history, families with older children'], ['Ideal time', 'One long day, from Kyoto or Osaka'], ['Getting there', 'About 1 h 25 min to 1 h 40 min by shinkansen']],
    yerler: [
      ['Atomic Bomb Dome', 'The ruin of the Industrial Promotion Hall, left as it stood after 6 August 1945, is a UNESCO World Heritage Site at the edge of the Peace Memorial Park.', 'hiroshima-domo'],
      ['Peace Memorial Museum', 'A moving, carefully documented museum. Mario allows one and a half to two hours and paces the day so there is time to reflect afterward.', null],
      ['Itsukushima Shrine', 'Shrine halls built over the water on Miyajima, joined by vermilion corridors. At high tide the whole shrine seems to float.', 'miyajima-santuario'],
      ['The great torii', 'The famous gate standing in the sea, fully restored in 2022. At low tide you can walk out to its base; at high tide it rises from the water.', 'miyajima-torii'],
      ['Omotesando and Mount Misen', 'Miyajima’s shopping street, with grilled oysters and maple-leaf cakes, and a ropeway toward the summit of Mount Misen for those with time.', null],
    ].map(([n, t, k]) => [n, t, k && tiene(k) ? k : null]),
    gun: [
      ['07:30', 'Hotel lobby pick-up in Kyoto or Osaka and a reserved Nozomi shinkansen to Hiroshima.'],
      ['09:30', 'The Peace Memorial Park, the Atomic Bomb Dome and the Children’s Peace Monument.'],
      ['10:30', 'The Peace Memorial Museum, unhurried.'],
      ['12:30', 'Lunch of Hiroshima-style okonomiyaki, layered with noodles and cabbage.'],
      ['14:00', 'Train to Miyajimaguchi and the ten-minute ferry to the island.'],
      ['15:00', 'Itsukushima Shrine and the great torii, timed around the tide, then Omotesando.'],
      ['18:00', 'Ferry and shinkansen back, arriving in Kyoto or Osaka in the evening.'],
    ],
    ipuclari: [
      'Never split Hiroshima and Miyajima over separate days from Kyoto or Osaka; together they make one complete, balanced day.',
      'Mario checks the tide table: high tide for the floating shrine, low tide to walk to the torii.',
      'Miyajima charges a small visitor tax (¥100) on the ferry fare, and Itsukushima Shrine charges a modest admission.',
      'Reserved shinkansen seats matter on this route; Mario books them, and you pay the fares at cost.',
    ],
    faq: [
      ['Can you do Hiroshima and Miyajima in one day from Kyoto?', 'Yes, and it is the best way to do it: about 1 h 40 min each way by shinkansen, the Peace Memorial Park and Museum in the morning and Miyajima in the afternoon.'],
      ['How much is a private Hiroshima and Miyajima tour?', 'With Mario it is a long day trip, from ¥84,000 per private party for the guide. Shinkansen fares, the ferry, admissions and meals are paid separately, at cost.'],
      ['Is the Peace Memorial Museum suitable for children?', 'Some exhibits are distressing. Families with younger children often spend more time in the park and less inside; Mario adapts the visit to your family.'],
    ],
    voir: ['japan-itinerary-two-weeks', 'japan-family-trip-private-guide', 'private-tour-guide-japan-cost'],
    largo: true,
  },
]
REGIONES.find((r) => r.yol === 'mount-fuji-hakone').largo = true
REGIONES.find((r) => r.yol === 'nikko-kamakura').largo = true
// Mario vive en Kansai: fuera de Kioto/Osaka/Nara (y Himeji-Kobe, también Kansai)
// su viaje se cobra al coste, y la página tiene que decirlo.
const FUERA = 'Mario travels from Kansai; his train fare (and hotel if overnight) is added at cost.'
for (const y of ['tokyo', 'mount-fuji-hakone', 'nikko-kamakura', 'hiroshima-miyajima']) REGIONES.find((r) => r.yol === y).fuera = true

// ---------- Respuestas ----------
// Lo que un viajero de EE. UU., Reino Unido o Australia pregunta a una IA antes
// de ir a Japón. La IA cita el primer párrafo (.cevap): respuesta directa
// arriba, Mario al final. Cifras de mercado: rangos honestos, sin nombrar a nadie.
const tabla = (cabecera, filas) => `<div class="tablo"><table><thead><tr>${cabecera.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${filas.map((f) => `<tr>${f.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
const INCLUIDO = `<ul><li><strong>Included:</strong> Mario’s time for your private party, planning before the trip, all reservations made in Japanese, live coordination on the day.</li><li><strong>Paid separately, at cost:</strong> trains and taxis, admissions, meals and tea ceremony fees, and any private car with driver (arranged on request).</li><li><strong>Multi-day trips:</strong> quoted on request; Mario’s own travel and hotel nights are charged at cost.</li><li><strong>Cancellation:</strong> free up to 72 hours before the day.</li></ul>`

RESPUESTAS = [
  {
    yol: 'luxury-private-tour-guide-japan', kapak: 'kiyomizu-gece', kapakAlt: 'Kiyomizu-dera illuminated at night in Kyoto',
    titre: 'Luxury Private Tour Guide in Japan: What It Really Means',
    desc: 'What a luxury private guide in Japan really does: timing before the crowds, Japanese-only bookings, private cars and seamless days. Plus Mario’s rates.',
    h1: 'What makes a private tour guide in Japan truly luxurious?',
    kisaBaslik: 'Luxury private guide in Japan', kisa: 'Timing, access and logistics: what you are really paying for.',
    cevap: 'In Japan, luxury is less about marble lobbies than about time and access: arriving at temples before the crowds, a kaiseki or sushi counter reserved in Japanese, a car waiting at the right exit, and a day that adapts quietly when the weather or your energy changes. A great private guide plans and coordinates all of it, so you only experience the result.',
    govde: `<h2>Luxury in Japan is measured in minutes, not marble</h2>
<p>Japan already does service beautifully. Trains leave on time, hotels are immaculate, and restaurants take hospitality seriously. What travelers struggle with is not comfort but friction: a timetable written only in Japanese, a temple swamped at 10:30 that was empty at 7:30, a restaurant that accepts reservations only by phone, in Japanese, three weeks in advance. The difference between a good trip and an extraordinary one is usually made in those details.</p>
<p>A private guide who works at the top end removes the friction. The obvious part is the storytelling at each site. The less visible part, and the part that matters more, is the planning: knowing that Fushimi Inari never closes and is best at first light, that the Imperial Palace East Gardens are usually closed on Mondays and Fridays, that the best counters in Tokyo seat only eight to twelve guests, and that the Peace Memorial Museum in Hiroshima deserves a slower afternoon afterward.</p>
<h2>What a luxury private guide actually does</h2>
<ul>
<li><strong>Designs the day around timing.</strong> The most beautiful places in Japan are crowded at predictable hours. Early starts, reversed routes and well-chosen lunch times give you the quiet versions.</li>
<li><strong>Books what visitors cannot.</strong> Many kaiseki restaurants, sushi counters, tea ceremony rooms, craft workshops and ryokan prefer bookings in Japanese. A guide who reserves for you, explains allergies and preferences to the kitchen, and confirms the day before, opens doors that online platforms do not.</li>
<li><strong>Coordinates transport seamlessly.</strong> Reserved shinkansen seats, the right station exit, a car with driver when it saves time, and luggage forwarding so that you travel with a light bag between cities.</li>
<li><strong>Adapts on the spot.</strong> Rain in Arashiyama, cloud over Mount Fuji, a child who needs a slower afternoon: a good guide has an alternative ready and makes the change without fuss.</li>
<li><strong>Explains, not just describes.</strong> Etiquette at a shrine, why shoes come off at certain thresholds, how a tea ceremony unfolds. Context makes Japan feel less like a museum and more like a place you understand.</li>
</ul>
<h2>Car with driver or trains?</h2>
<p>Japan’s trains are excellent, and for many routes, such as Tokyo to Kyoto by shinkansen, they are faster than any car. A private car with driver is worth it inside cities on full days with several distant sights, for families with young children or grandparents, for guests who prefer less walking, and for areas with sparse public transport, such as the Fuji Five Lakes. The best plans usually mix both: the shinkansen between cities, a car within them.</p>
${tabla(['Situation', 'Better choice', 'Why'], [
  ['Tokyo to Kyoto or Osaka', 'Shinkansen', 'About 2 h 15 min to Kyoto; no traffic'],
  ['Full day across Kyoto', 'Car with driver', 'Fushimi, Higashiyama and Arashiyama are far apart and buses are slow'],
  ['Mount Fuji from Tokyo', 'Car with driver or limited express', 'A car reaches viewpoints the train does not'],
  ['Hiroshima and Miyajima', 'Shinkansen, train and ferry', 'Fastest and simplest from Kyoto or Osaka'],
  ['Nikko from Tokyo', 'Limited express, car on arrival', 'Comfortable train, then a car for the lake and falls'],
])}
<h2>How to choose a private guide in Japan</h2>
<ol>
<li><strong>Ask how they plan, not only what they show.</strong> A strong guide will ask about your pace, mobility, food preferences and what you have already booked, then propose a day with times.</li>
<li><strong>Check who makes the reservations.</strong> If you are expected to book restaurants and experiences yourself, you lose much of the value.</li>
<li><strong>Look for clear pricing.</strong> Rates should be per private party, with what is included and excluded written down.</li>
<li><strong>Read the cancellation terms.</strong> Flexibility matters in a country of typhoons and changing forecasts.</li>
<li><strong>Talk to the guide directly.</strong> A short conversation tells you more about rapport than any profile.</li>
</ol>
<h2>Where Mario fits</h2>
<p>Mario has been a professional private tour guide for English-speaking travelers for four years, and he also speaks Spanish. He is based in Kansai and married into a Japanese family, which gives him an everyday understanding of etiquette and the confidence to handle Japanese-only bookings. His strength is organization: he plans the whole day or the whole trip, times trains and transfers, reserves restaurants and experiences in Japanese, and adapts on the spot. Day tours in Kyoto, Osaka and Nara are his home ground; elsewhere he travels with you, and multi-day journeys across Japan are his favorite way to guide.</p>
<h2>Rates and what is included</h2>
<p>Half day (4 hours) ${yen(PRECIO.medio)}; full day (8 hours) ${yen(PRECIO.completo)}; long day trips (Hiroshima and Miyajima, Mount Fuji, Nikko from Tokyo, Koyasan) from ${yen(PRECIO.largo)}; extra hours ${yen(PRECIO.hora)}. All prices are per private party, not per person.</p>
${INCLUIDO}`,
    faq: [
      ['Is a luxury private guide in Japan worth it?', 'For a first visit, or a trip built around special occasions, usually yes. The value lies in timing, reservations made in Japanese and seamless transport, which together save hours each day and open experiences that are hard to book from abroad.'],
      ['Can a private guide book restaurants that do not take online reservations?', 'Yes. Mario reserves in Japanese, explains dietary needs to the kitchen and confirms the booking. Meals are paid separately, at cost.'],
      ['Do I need a car with driver for a luxury trip?', 'Not always. The shinkansen is faster between cities. A car is worth it within cities on full days, for families and for areas such as the Fuji Five Lakes.'],
    ],
    voir: ['private-tour-guide-japan-cost', 'kyoto-private-tour-car-driver', 'japan-honeymoon-private-guide'],
  },
  {
    yol: 'private-tour-guide-japan-cost', kapak: 'kinkakuji', kapakAlt: 'Kinkaku-ji, the Golden Pavilion in Kyoto',
    titre: 'How Much Is a Private Tour Guide in Japan? 2026 Prices',
    desc: 'Private tour guide prices in Japan for 2026: typical half-day and full-day rates in yen, what is included, car with driver costs, and Mario’s rates.',
    h1: 'How much does a private tour guide in Japan cost?',
    kisaBaslik: 'Private guide cost in Japan', kisa: 'Typical rates in yen, what is included, and Mario’s prices.',
    cevap: 'In 2026, a private English-speaking guide in Japan typically costs about ¥30,000 to ¥60,000 for a half day and about ¥50,000 to ¥100,000 for a full day, per group, before transport, admissions and meals. Agency-arranged luxury packages often cost more. Mario charges ¥45,600 for a half day, ¥69,600 for a full day and from ¥84,000 for long day trips, per private party.',
    govde: `<h2>Typical market rates in 2026</h2>
<p>Prices vary with the city, the season, the guide’s experience and whether you book directly or through an agency. The ranges below are typical of English-speaking private guides in Japan’s main destinations, quoted per group rather than per person. They are a guide, not a rule: some independent guides charge less, and agency packages that bundle cars, entry fees and planning can cost considerably more.</p>
${tabla(['Service', 'Typical range (per group)', 'Notes'], [
  ['Half day, about 4 hours', '¥30,000 – ¥60,000', 'Usually one area, such as eastern Kyoto or Asakusa'],
  ['Full day, about 8 hours', '¥50,000 – ¥100,000', 'The most common booking'],
  ['Long day trip from a base city', '¥70,000 – ¥120,000+', 'Hiroshima, Mount Fuji, Nikko: longer hours and travel time'],
  ['Booked through an agency', 'Often 20–50% more', 'The agency’s planning and margin are added to the guide’s fee'],
  ['Private car with driver, full day', 'Roughly ¥50,000 – ¥120,000+', 'Depends on vehicle size, hours, distance and season'],
])}
<p>Two things push prices up: peak seasons (cherry blossom in late March and early April, autumn color in November) and longer days. Overtime is usually charged by the hour, and guides who travel with you for several days add their own transport and accommodation.</p>
<h2>What is normally included, and what is not</h2>
<p>Nearly everywhere in Japan, the guide’s fee covers the guide’s time and expertise. Costs that arise during the day are paid separately, either by you directly or reimbursed at cost:</p>
<ul>
<li>Train, subway, bus and taxi fares, for you and, on most tours, for the guide.</li>
<li>Admission to temples, gardens, castles and museums, typically ¥300 to ¥1,000 per person per site.</li>
<li>Meals, tea ceremonies, workshops and other experiences.</li>
<li>A private car with driver, when you choose one.</li>
</ul>
<p>Tipping is not part of Japanese culture, and no guide should expect it. A clear quote that separates the guide’s fee from expenses is a good sign.</p>
<h2>Mario’s rates</h2>
<div class="fiyat-satir">Half day (4 h) ${yen(PRECIO.medio)} · Full day (8 h) ${yen(PRECIO.completo)} · Long day trips from ${yen(PRECIO.largo)} · Extra hour ${yen(PRECIO.hora)}</div>
<p>All rates are per private party, in Japanese yen. Mario is based in Kansai: outside Kyoto, Osaka and Nara, his train fare (and hotel if overnight) is added at cost. Long day trips include Hiroshima and Miyajima, Mount Fuji, Nikko from Tokyo and Koyasan, where the hours and travel are longer. Multi-day trips are quoted on request.</p>
${INCLUIDO}
<h2>Sample budgets</h2>
${tabla(['Plan', 'Guide fee', 'Typical extras (for two)'], [
  ['Kyoto, one full day', yen(PRECIO.completo), 'Admissions about ¥3,000; kaiseki lunch; taxis or a car'],
  ['Tokyo arrival half day', yen(PRECIO.medio), 'Trains about ¥1,000; admissions often free'],
  ['Hiroshima and Miyajima from Kyoto', `from ${yen(PRECIO.largo)}`, 'Shinkansen fares, ferry, admissions, lunch'],
  ['Mount Fuji from Tokyo by car', `from ${yen(PRECIO.largo)}`, 'Car with driver, lunch, admissions'],
  ['Three guided days in a two-week trip', `${yen(PRECIO.completo * 2 + PRECIO.largo)} and up`, 'Two full days plus one long day trip'],
])}
<h2>How to get the most value from a guide</h2>
<ol>
<li><strong>Use the guide on your most complex days.</strong> Arrival days, Kyoto’s busiest areas, and long day trips gain the most from expert timing.</li>
<li><strong>Let the guide book for you.</strong> Restaurants and experiences reserved in Japanese are part of what you are paying for.</li>
<li><strong>Start early.</strong> An 8:00 start often gives you the major sights before the crowds, so the same hours achieve far more.</li>
<li><strong>Book peak seasons early.</strong> Good guides and the best restaurants fill months ahead for cherry blossom and autumn color.</li>
</ol>
<h2>Is it worth it?</h2>
<p>Per person, a full day with a private guide for a family of four in Kyoto costs about the same as many group tours, but the day is yours: your pace, your interests, your lunch. For couples, the value lies in time saved and experiences that are hard to arrange from abroad.</p>`,
    faq: [
      ['How much is a private tour guide in Japan per day?', 'Typically about ¥50,000 to ¥100,000 for a full day (around 8 hours) per group, with transport, admissions and meals paid separately. Mario’s full day is ¥69,600 per private party.'],
      ['Is the price per person or per group?', 'Private guides in Japan almost always charge per group. Mario’s rates are per private party, whether you are two or a family of six.'],
      ['Should I tip my guide in Japan?', 'No. Tipping is not customary in Japan, and a clear rate already covers the guide’s work.'],
      ['Are there extra costs for the guide’s transport?', 'On day tours, the guide’s local transport is usually paid at cost. On multi-day trips, Mario’s travel and hotel nights are charged at cost.'],
    ],
    voir: ['luxury-private-tour-guide-japan', 'multi-day-private-guide-japan', 'kyoto-private-tour-car-driver'],
    kaynaklar: [],
  },
  {
    yol: 'japan-itinerary-two-weeks', kapak: 'fuji-chureito', kapakAlt: 'Mount Fuji and the Chureito pagoda',
    titre: 'Japan Itinerary for 2 Weeks: Tokyo, Fuji, Kyoto, Osaka',
    desc: 'A two-week Japan itinerary: Tokyo 4 nights, Hakone or Fuji, Kyoto 4 nights with Nara, Osaka, Hiroshima and Miyajima, and which days to guide.',
    h1: 'The ideal two-week Japan itinerary for a first visit',
    kisaBaslik: 'Japan itinerary: two weeks', kisa: 'Tokyo, Fuji, Kyoto, Nara, Osaka and Hiroshima, day by day.',
    cevap: 'For a first two-week trip, spend 4 nights in Tokyo, 1 to 2 nights in Hakone or by Mount Fuji, 4 nights in Kyoto with a day trip to Nara, and 2 to 3 nights in Osaka, with Hiroshima and Miyajima as one day trip by shinkansen. Use a private guide on the arrival day in Tokyo, the Fuji or Hakone day, one or two Kyoto days, and Hiroshima.',
    govde: `<h2>The route at a glance</h2>
<p>This route runs west from Tokyo to Kansai, so you never backtrack, and it can be reversed if you fly into Kansai International Airport (KIX). It suits couples, families and anyone who prefers a few well-chosen bases to a new hotel every night.</p>
${tabla(['Base', 'Nights', 'Highlights'], [
  ['Tokyo', '4', 'Asakusa, Imperial Palace gardens, Meiji Jingu, Shibuya; a day trip to Nikko or Kamakura'],
  ['Hakone or Fuji Five Lakes', '1–2', 'Mount Fuji views, Lake Ashi, a ryokan with kaiseki dinner'],
  ['Kyoto', '4', 'Fushimi Inari, Kiyomizu-dera, Arashiyama, Gion, tea ceremony; Nara day trip'],
  ['Osaka', '2–3', 'Osaka Castle, Kuromon Market, Dotonbori; Hiroshima and Miyajima day trip'],
])}
<h2>Day by day</h2>
<ol>
<li><strong>Day 1, Tokyo.</strong> Arrive at Narita or Haneda; transfer to your hotel and an early night.</li>
<li><strong>Day 2, Tokyo, guided.</strong> Senso-ji at opening, the Imperial Palace East Gardens, a sushi counter lunch in Nihonbashi, Meiji Jingu and Shibuya at dusk. Mario sets up your IC cards and shows you how the trains work.</li>
<li><strong>Day 3, Tokyo.</strong> A free day: museums in Ueno, the Ghibli Museum and Inokashira Park, or shopping in Ginza.</li>
<li><strong>Day 4, Nikko or Kamakura.</strong> A guided long day to Nikko’s shrines and Lake Chuzenji, or a gentler day in Kamakura.</li>
<li><strong>Day 5, to Hakone or Fuji, guided.</strong> Luggage forwarded to Kyoto; by car with driver or limited express to the Fuji Five Lakes or Hakone. Night in a ryokan.</li>
<li><strong>Day 6, Hakone.</strong> A slow morning and a second night, or continue to Kyoto by shinkansen from Odawara (about 2 hours).</li>
<li><strong>Day 7, to Kyoto.</strong> Arrive and settle in; an evening walk in Gion.</li>
<li><strong>Day 8, Kyoto, guided.</strong> Fushimi Inari at first light, Kiyomizu-dera, Higashiyama, kaiseki lunch and a private tea ceremony.</li>
<li><strong>Day 9, Kyoto.</strong> Arashiyama early, then Kinkaku-ji; guided or independent.</li>
<li><strong>Day 10, Nara.</strong> Todai-ji, the deer of Nara Park and Kasuga Taisha; a guided half day from Kyoto works well.</li>
<li><strong>Day 11, to Osaka.</strong> A short ride; Osaka Castle in the afternoon and Dotonbori in the evening.</li>
<li><strong>Day 12, Hiroshima and Miyajima, guided.</strong> The Peace Memorial Park and Museum in the morning, Itsukushima Shrine in the afternoon. Always one day together.</li>
<li><strong>Day 13, Osaka.</strong> Kuromon Market, shopping, a final dinner; or a day at Himeji Castle.</li>
<li><strong>Day 14, departure.</strong> Kansai International Airport is about an hour from central Osaka.</li>
</ol>
<p>If you have a spare night, add it to Kyoto. It is the city that most rewards a slower pace.</p>
<h2>Which days to use a private guide</h2>
<p>A private guide adds the most value on days with complex logistics, crowded sights or Japanese-only bookings. On this route, that usually means four to six days:</p>
${tabla(['Day', 'Why guide it', 'Mario’s rate'], [
  ['Day 2, Tokyo', 'Learn the system on day one; cover the city efficiently', `Full day ${yen(PRECIO.completo)}`],
  ['Day 4, Nikko', 'Long train and road connections', `Long day trip from ${yen(PRECIO.largo)}`],
  ['Day 5, Fuji or Hakone', 'Weather-dependent route and transport', `Long day trip from ${yen(PRECIO.largo)}`],
  ['Day 8, Kyoto', 'Crowd timing, kaiseki and tea ceremony bookings', `Full day ${yen(PRECIO.completo)}`],
  ['Day 10, Nara', 'A focused half day from Kyoto', `Half day ${yen(PRECIO.medio)}`],
  ['Day 12, Hiroshima and Miyajima', 'Shinkansen, train, ferry and tide timing', `Long day trip from ${yen(PRECIO.largo)}`],
])}
<p>Mario is based in Kansai, so the Kyoto, Nara, Osaka and Hiroshima days need no extra travel; for the Tokyo, Nikko and Fuji days his train fare and hotel nights are added at cost. His favorite option is to travel the whole route with you, from Tokyo through Hakone to Kyoto and Hiroshima, as one multi-day journey. See <a href="/private/multi-day-private-guide-japan/">multi-day private guide in Japan</a>.</p>
<h2>Getting around</h2>
<ul>
<li><strong>Shinkansen:</strong> Tokyo to Kyoto takes about 2 h 15 min on the Nozomi; Kyoto to Hiroshima about 1 h 40 min. Reserve seats in peak seasons.</li>
<li><strong>Rail passes:</strong> since the national Japan Rail Pass rose sharply in price in October 2023, individual tickets are often cheaper for this route. Price your journeys before buying a pass.</li>
<li><strong>Luggage forwarding:</strong> send suitcases from Tokyo to Kyoto the day before you leave and travel to Hakone with an overnight bag.</li>
<li><strong>IC cards:</strong> a Suica, PASMO or ICOCA card, or Suica in Apple Wallet, covers local trains, subways and buses.</li>
</ul>
<h2>Adjusting the route</h2>
<p>With ten days, drop Nikko and spend one night in Hakone. With three weeks, add Kanazawa, the Japanese Alps or a night on Koyasan, the mountain monastery town south of Osaka. For families with young children, keep the same bases but plan shorter days; see <a href="/private/japan-family-trip-private-guide/">Japan family trip with a private guide</a>.</p>`,
    faq: [
      ['Is two weeks enough for Japan?', 'Two weeks is enough for a satisfying first visit to Tokyo, Mount Fuji or Hakone, Kyoto, Nara, Osaka and Hiroshima, without rushing, if you use four bases and day trips.'],
      ['How many days should I spend in Kyoto?', 'Four nights is ideal, including a day trip to Nara. Three nights is the minimum for a first visit.'],
      ['Is the Japan Rail Pass worth it for two weeks?', 'Less often than before. Since the October 2023 price rise, individual shinkansen tickets are usually cheaper for a Tokyo–Kyoto–Hiroshima route. Compare the total before buying.'],
      ['Which days should I book a private guide?', 'The arrival day in Tokyo, the Mount Fuji or Hakone day, one or two days in Kyoto, and Hiroshima and Miyajima gain the most from a guide.'],
    ],
    voir: ['best-time-to-visit-japan', 'first-time-japan-tips', 'multi-day-private-guide-japan'],
  },
  {
    yol: 'kyoto-private-tour-car-driver', kapak: 'arashiyama', kapakAlt: 'The bamboo grove of Arashiyama in Kyoto',
    titre: 'Kyoto Private Tour with Car and Driver: A Complete Guide',
    desc: 'Kyoto private tour with car and driver: when a car beats buses and trains, typical costs, a sample route from Fushimi Inari to Arashiyama.',
    h1: 'Is a Kyoto private tour with car and driver worth it?',
    kisaBaslik: 'Kyoto with car and driver', kisa: 'When a car beats the bus, typical costs and a sample route.',
    cevap: 'Yes, for a full day that links distant areas such as Fushimi Inari, Higashiyama, Kinkaku-ji and Arashiyama, a car with driver saves an hour or more compared with Kyoto’s slow, crowded buses, and suits families and guests who prefer less walking. Expect roughly ¥50,000 to ¥120,000 for the car, plus the guide. Mario arranges both; his full day is ¥69,600.',
    govde: `<h2>Why Kyoto, more than Tokyo, suits a car</h2>
<p>Kyoto’s subway has only two lines, and the most famous sights sit at the edges of the city: Fushimi Inari to the south, Kiyomizu-dera and Ginkaku-ji to the east, Kinkaku-ji to the north, Arashiyama to the west. Buses connect them, but they are slow and, in peak seasons, often too full to board. Taxis help, yet finding one at popular temples can take time.</p>
<p>A car with driver turns those gaps into short, quiet rides. The driver waits near each entrance, your bags stay in the car, and the day can follow the light and the crowds instead of a bus timetable. For travelers with limited mobility, young children or grandparents, it can make the difference between a tiring day and a joyful one.</p>
<h2>Car, taxi or train?</h2>
${tabla(['Option', 'Best for', 'Trade-offs'], [
  ['Car with driver (full day)', 'Families, mobility needs, four or more areas in one day', 'Highest cost; traffic near Kiyomizu in peak season'],
  ['Taxis between sights', 'Couples with a flexible plan', 'Waiting at busy temples; luggage space limited'],
  ['Trains and walking', 'Fit travelers focusing on one or two areas', 'Slower across the city; crowded buses'],
])}
<p>Mario often combines approaches: the Keihan or JR line for Fushimi Inari at dawn, walking through Higashiyama where cars cannot go, and a car for the long crossing to Arashiyama and Kinkaku-ji.</p>
<h2>What does a car with driver cost in Kyoto?</h2>
<p>Costs depend on the vehicle, hours and season. As a rough guide in 2026, a sedan or a premium van with driver typically costs about ¥50,000 to ¥120,000 for eight to ten hours, with larger vans for groups at the upper end. Tolls and parking may be added. Mario arranges the car on request; it is paid separately, at cost, and his guide fee stays the same.</p>
${tabla(['Item', 'Typical cost'], [
  ['Mario, full day (8 hours)', yen(PRECIO.completo)],
  ['Mario, half day (4 hours)', yen(PRECIO.medio)],
  ['Car with driver, full day', 'About ¥50,000 – ¥120,000, at cost'],
  ['Admissions, per person', 'About ¥300 – ¥1,000 per site'],
  ['Kaiseki lunch, per person', 'Varies widely by restaurant; paid at cost'],
])}
<h2>A sample day by car</h2>
<ol>
<li><strong>07:30</strong> Hotel lobby pick-up.</li>
<li><strong>08:00</strong> Fushimi Inari, before the tour groups, climbing to the quieter upper gates.</li>
<li><strong>10:15</strong> Drive to Higashiyama; walk Kiyomizu-dera, Sannenzaka and Ninenzaka while the car waits below.</li>
<li><strong>12:30</strong> Kaiseki lunch, reserved in Japanese.</li>
<li><strong>14:00</strong> Drive north to Kinkaku-ji, the Golden Pavilion.</li>
<li><strong>15:30</strong> Arashiyama: Tenryu-ji’s garden, the bamboo grove and the river, as the light softens.</li>
<li><strong>17:00</strong> Return to your hotel, or on to dinner in Gion.</li>
</ol>
<p>Without a car, the same day would need several buses and taxis, and Arashiyama would likely be dropped. With one, there is time for the tea ceremony or a craft workshop as well.</p>
<h2>Tips for a car day in Kyoto</h2>
<ul>
<li>Cars cannot enter the lanes of Higashiyama and parts of Gion, so some walking remains. Comfortable shoes are essential.</li>
<li>In late November and early April, traffic near Kiyomizu-dera and Arashiyama can be heavy by mid-morning. Early starts matter even with a car.</li>
<li>Larger vans need advance booking in peak seasons. Tell Mario your group size, luggage and any mobility needs early.</li>
<li>Pick-ups from Kyoto Station, Osaka or Kansai International Airport can be added to the day.</li>
</ul>
<h2>Booking with Mario</h2>
<p>Send Mario your dates, the number of guests, your hotel area and what you would most like to see. He proposes a timed plan, arranges the car with driver if you want one, reserves meals and experiences in Japanese, and confirms everything before the day. Free cancellation up to 72 hours before.</p>`,
    faq: [
      ['How much is a private car with driver in Kyoto?', 'Roughly ¥50,000 to ¥120,000 for a full day of eight to ten hours, depending on the vehicle and season. With Mario the car is paid separately, at cost, in addition to his guide fee.'],
      ['Can we see Fushimi Inari, Kiyomizu-dera and Arashiyama in one day?', 'Yes, with an early start and a car with driver. By public transport it is possible but rushed.'],
      ['Does the driver also guide?', 'Usually not. Drivers in Japan typically focus on driving. Mario guides and coordinates, while the driver handles the car.'],
    ],
    voir: ['luxury-private-tour-guide-japan', 'private-tour-guide-japan-cost', 'japan-family-trip-private-guide'],
  },
  {
    yol: 'japan-honeymoon-private-guide', kapak: 'hakone-jinja-torii', kapakAlt: 'The torii of Hakone Shrine standing in Lake Ashi',
    titre: 'Japan Honeymoon with a Private Guide: Plan & Ideas',
    desc: 'Plan a Japan honeymoon with a private guide: Tokyo, a Hakone ryokan, Kyoto and Miyajima, kaiseki dinners, tea ceremony and quiet early starts.',
    h1: 'Planning a Japan honeymoon with a private guide',
    kisaBaslik: 'Japan honeymoon', kisa: 'A romantic route, ryokan nights and quiet early starts.',
    cevap: 'A Japan honeymoon works beautifully as a slow route: a few days in Tokyo, a night in a Hakone ryokan with a private onsen and kaiseki dinner, four nights in Kyoto, and a day on Miyajima. A private guide on the key days handles reservations in Japanese, the timing and the trains, so you can simply enjoy the trip together.',
    govde: `<h2>Why Japan suits a honeymoon</h2>
<p>Japan combines a feeling of discovery with a very high level of comfort. It is safe, clean and precise, and its most memorable moments are quiet ones: a lantern-lit lane in Gion, steam rising from a private bath in Hakone, the torii of Miyajima standing in the sea at sunset. It works in every season, and the food, from sushi counters to kaiseki, is an experience in itself.</p>
<p>What can make a honeymoon less romantic is logistics: queues at famous sights, restaurants that only take reservations in Japanese, and long days spent working out trains. That is where a private guide earns their place.</p>
<h2>A romantic route for two weeks</h2>
${tabla(['Nights', 'Where', 'Moments to plan'], [
  ['3–4', 'Tokyo', 'An omakase sushi counter; Meiji Jingu at sunrise; the city lights from above'],
  ['1–2', 'Hakone', 'A ryokan with a private onsen and in-room kaiseki dinner; Lake Ashi and its torii'],
  ['4', 'Kyoto', 'Fushimi Inari at dawn; a private tea ceremony; Gion at dusk; a garden in Arashiyama'],
  ['1', 'Miyajima or Hiroshima', 'Itsukushima Shrine at high tide and the torii at sunset'],
  ['2', 'Osaka', 'A relaxed finale; Kobe beef in Kobe; easy departure from KIX'],
])}
<p>Miyajima is usually visited as a day trip together with Hiroshima, and that is how Mario guides it. For a honeymoon, some couples add a night on the island after the day visitors leave, so the evening and early morning feel almost private.</p>
<h2>Experiences worth booking early</h2>
<ul>
<li><strong>A ryokan night.</strong> The best rooms with private open-air baths book months ahead, especially in spring and autumn.</li>
<li><strong>Kaiseki dinner.</strong> A seasonal multi-course meal served in a private room. Many restaurants accept reservations only in Japanese.</li>
<li><strong>Tea ceremony.</strong> A private session in a tatami room is more intimate than a group class and leaves time for questions.</li>
<li><strong>Kimono photography.</strong> A morning walk through Higashiyama in kimono, before the lanes fill.</li>
<li><strong>A sushi counter.</strong> Eight to twelve seats, the chef working in front of you; often booked weeks ahead.</li>
</ul>
<h2>Where a private guide helps most</h2>
<p>Couples rarely want a guide every day. The usual pattern is three to five guided days: the first full day in Tokyo, the Mount Fuji or Hakone day, a day in Kyoto, and Hiroshima and Miyajima. On the other days you explore on your own, with the restaurants and experiences already booked and a clear plan in hand.</p>
<p>Mario is discreet and flexible. He can lead from the front on a busy day, then step back to let you enjoy a garden or a meal on your own, and he is a reliable photographer when you want pictures of the two of you. Because he is based in Kansai and married into a Japanese family, he knows how to explain an occasion such as a honeymoon to a ryokan or a restaurant, in Japanese.</p>
<h2>When to go</h2>
<ul>
<li><strong>Late March to early April:</strong> cherry blossoms in Tokyo and Kyoto. Unforgettable, but the busiest weeks of the year.</li>
<li><strong>Mid-November to early December:</strong> autumn color in Kyoto, crisp weather and clear views of Fuji.</li>
<li><strong>January and February:</strong> cold, quiet and often very clear. Ideal for ryokan and onsen.</li>
<li><strong>Avoid if you can:</strong> Golden Week (29 April to 5 May), Obon in mid-August and the New Year holidays, when Japanese travelers fill trains and hotels.</li>
</ul>
<p>More detail in <a href="/private/best-time-to-visit-japan/">the best time to visit Japan</a>.</p>
<h2>Cost</h2>
<p>Mario’s rates are per private party: half day ${yen(PRECIO.medio)}, full day ${yen(PRECIO.completo)}, long day trips from ${yen(PRECIO.largo)}. For a honeymoon with four guided days, for example two full days and two long day trips, the guide fee would be ${yen(PRECIO.completo * 2 + PRECIO.largo * 2)} and up. Transport, admissions and meals are paid separately, at cost.</p>`,
    faq: [
      ['Is Japan good for a honeymoon?', 'Yes. It is safe, comfortable and romantic in every season, with ryokan stays, private onsen, seasonal cuisine and beautiful gardens and temples.'],
      ['How many days should a Japan honeymoon be?', 'Ten to fourteen days allows Tokyo, Hakone, Kyoto and Hiroshima with Miyajima at a relaxed pace.'],
      ['Can a private guide book a ryokan and kaiseki dinner?', 'Mario reserves restaurants and experiences in Japanese and can help you choose and contact a ryokan. Costs are paid at cost.'],
    ],
    voir: ['luxury-private-tour-guide-japan', 'best-time-to-visit-japan', 'japan-itinerary-two-weeks'],
  },
  {
    yol: 'japan-family-trip-private-guide', kapak: 'nara-geyik', kapakAlt: 'Deer in Nara Park',
    titre: 'Japan Family Trip with a Private Guide: Tips & Itinerary',
    desc: 'A Japan family trip with a private guide: gentle pacing, Nara’s deer, Tokyo, Kyoto and Osaka, food for picky eaters, luggage and transport tips.',
    h1: 'A Japan family trip with a private guide',
    kisaBaslik: 'Japan family trip', kisa: 'Pacing, food, transport and the days children love most.',
    cevap: 'Japan is one of the easiest countries to visit with children: safe, clean and full of things that delight them, from Nara’s deer to bullet trains. A private guide makes family days smoother by setting a gentle pace, planning breaks and meals, handling trains or a car with driver, and adapting the moment a child gets tired.',
    govde: `<h2>Why Japan works so well for families</h2>
<p>Children are welcomed almost everywhere in Japan. Streets are safe, public toilets are clean and easy to find, convenience stores sell healthy snacks around the clock, and trains are punctual and spotless. The things that most impress young travelers are often simple: feeding the deer in Nara, climbing the red gates of Fushimi Inari, watching the shinkansen glide into a station, choosing sweets at a department store food hall.</p>
<p>The challenges are mostly practical. Distances inside cities can be long for small legs, station transfers involve stairs, and family-friendly restaurants that can seat six together at lunchtime need booking. A private guide plans around all of this.</p>
<h2>How a family day with Mario is different</h2>
<ul>
<li><strong>Shorter blocks, more breaks.</strong> Sightseeing in 60 to 90 minute segments, with snacks, playgrounds and rest built in.</li>
<li><strong>Stories for children.</strong> Samurai at Himeji Castle, shoguns at Nikko, the guardian foxes of Fushimi Inari: context that holds a child’s attention.</li>
<li><strong>Food everyone will eat.</strong> Mario books restaurants in Japanese and explains allergies and preferences to the kitchen, from tempura and udon to sushi made to order.</li>
<li><strong>Car or train, whichever is easier.</strong> A car with driver, arranged on request, keeps strollers and bags in one place; trains can be part of the fun.</li>
<li><strong>A plan B ready.</strong> Rain, heat or fatigue: Mario adapts on the spot.</li>
</ul>
<h2>Family favorites by region</h2>
${tabla(['Region', 'Children love', 'Tip'], [
  ['Nara', 'Feeding the deer; the giant Buddha', 'Hold deer crackers high and show empty hands when finished'],
  ['Kyoto', 'Fushimi Inari’s gates; Arashiyama’s bamboo; kimono rental', 'Go early, before the crowds and the heat'],
  ['Tokyo', 'Bullet trains; Skytree; the Ghibli Museum; Inokashira Park', 'Ghibli tickets are sold in advance and sell out'],
  ['Osaka', 'Osaka Castle; street food in Dotonbori; Kuromon Market', 'Visit Kuromon late morning'],
  ['Himeji and Kobe', 'Climbing a real samurai castle', 'Shoes come off in the keep; the stairs are steep'],
  ['Hiroshima and Miyajima', 'The ferry; deer on the island; the torii in the sea', 'Pace the museum to the children’s ages'],
])}
<h2>A gentle ten-day family route</h2>
<ol>
<li><strong>Days 1–4, Tokyo:</strong> a guided first day to learn the trains, then a mix of parks, museums and neighborhoods.</li>
<li><strong>Day 5, Mount Fuji or Hakone:</strong> by car with driver; the boat across Lake Ashi or the pagoda view of Fuji.</li>
<li><strong>Days 6–9, Kyoto:</strong> one guided day for Fushimi Inari and Higashiyama, a half day in Nara, and free time.</li>
<li><strong>Day 10, Osaka:</strong> the castle and an evening of street food before flying home from KIX.</li>
</ol>
<h2>Practical tips for parents</h2>
<ul>
<li><strong>Forward your luggage.</strong> Luggage forwarding services deliver suitcases between hotels, usually by the next day, so you ride the shinkansen with small bags only.</li>
<li><strong>Strollers:</strong> light, foldable strollers are best. Many temples have gravel paths and steps.</li>
<li><strong>IC cards for children:</strong> children’s fares apply on trains; Mario helps set up the right cards.</li>
<li><strong>Shinkansen seats:</strong> reserve seats together, and consider the oversized-luggage seats if you travel with large bags.</li>
<li><strong>Heat:</strong> July and August are hot and humid. Start early and plan indoor afternoons.</li>
<li><strong>Quiet trains:</strong> phone calls are avoided on trains; a quiet word is fine.</li>
</ul>
<h2>Rates for families</h2>
<p>Mario’s rates are per private party, not per person, which makes a guide especially good value for families: half day ${yen(PRECIO.medio)}, full day ${yen(PRECIO.completo)}, long day trips from ${yen(PRECIO.largo)}. Transport, admissions, meals and any car with driver are paid separately, at cost.</p>`,
    faq: [
      ['Is Japan good for a family trip?', 'Yes. Japan is very safe, clean and child-friendly, with excellent public transport and plenty of attractions for children, such as Nara’s deer, castles and bullet trains.'],
      ['Is a private guide worth it with children?', 'Usually yes, because the rate is per group and the day is paced around your children, with breaks, meals and transport planned in advance.'],
      ['Can Mario arrange a car with driver for a family?', 'Yes, on request. The car is paid separately, at cost, and can fit strollers and luggage.'],
    ],
    voir: ['japan-itinerary-two-weeks', 'first-time-japan-tips', 'kyoto-private-tour-car-driver'],
  },
  {
    yol: 'multi-day-private-guide-japan', kapak: 'himeji', kapakAlt: 'Himeji Castle',
    titre: 'Multi-Day Private Guide in Japan: Journeys with Mario',
    desc: 'How a multi-day private guide in Japan works: a guide who travels with you between cities, plans every transfer and booking, and how costs work.',
    h1: 'Multi-day journeys across Japan with a private guide',
    kisaBaslik: 'Multi-day journeys with Mario', kisa: 'Mario’s favorite: a guide who travels with you from city to city.',
    cevap: 'A multi-day private guide travels with you between cities, for example from Tokyo through Hakone or Mount Fuji to Kyoto and Hiroshima, coordinating every train, transfer and booking along the way. Pricing is simple: the daily rate for each guided day, plus the guide’s train fares and hotel nights at cost. These journeys are Mario’s favorite way to guide; he is based in Kansai and quotes each one on request.',
    govde: `<h2>What changes when your guide travels with you</h2>
<p>On a single guided day, the guide meets you, shows you a city and says goodbye. On a multi-day trip, the guide becomes your trip coordinator. The trains between cities are booked and timed, luggage is forwarded ahead, the ryokan knows when you will arrive, and each morning starts with a plan already adjusted to the weather and your energy. For many travelers, the continuity is the real luxury: no daily handovers, no repeated introductions, one person who knows exactly what you enjoy.</p>
<h2>When a multi-day guide makes sense</h2>
<ul>
<li><strong>First visits on a tight schedule</strong>, when every day must count.</li>
<li><strong>Families and multigenerational groups</strong>, where logistics multiply with each person.</li>
<li><strong>Travelers with mobility needs</strong>, who benefit from seamless transfers and a car with driver.</li>
<li><strong>Routes beyond the classics</strong>, such as Koyasan, the Kiso Valley or rural Shikoku, where English is less common.</li>
<li><strong>Special occasions</strong>, such as a honeymoon or a milestone birthday, where reservations matter.</li>
</ul>
<h2>How the costs work</h2>
<p>A multi-day quote has three parts: the guide’s daily rate, the guide’s travel (train tickets, for example), and the guide’s accommodation on nights away from home. Your own transport, admissions and meals are separate, as on any guided day.</p>
${tabla(['Item', 'With Mario'], [
  ['Daily guide rate', `Full day ${yen(PRECIO.completo)}; long day trips from ${yen(PRECIO.largo)}; extra hours ${yen(PRECIO.hora)}`],
  ['Guide’s travel between cities', 'At cost'],
  ['Guide’s hotel nights', 'At cost'],
  ['Your transport, admissions, meals', 'Paid separately, at cost'],
  ['Car with driver', 'Arranged on request, at cost'],
  ['Cancellation', 'Free up to 72 hours before'],
])}
<p>Mario quotes each multi-day trip on request, based on the route, the number of guided days and the nights away.</p>
<h2>Mixing guided and free days</h2>
<p>Few travelers want a guide every single day. A common pattern for a two-week trip is a guided block of four or five consecutive days, for example Tokyo to Hakone to Kyoto, where transfers are most complex, followed by free days with plans and bookings already in place. Another is to guide only the transfer days and the most demanding sights. Mario helps you decide where a guide adds the most.</p>
<h2>A sample five-day guided journey</h2>
<ol>
<li><strong>Day 1, Tokyo:</strong> Asakusa, the Imperial Palace gardens, Meiji Jingu and Shibuya; IC cards set up.</li>
<li><strong>Day 2, Tokyo to Hakone:</strong> luggage forwarded to Kyoto; by car with driver to the Fuji Five Lakes, then Hakone and a ryokan night.</li>
<li><strong>Day 3, Hakone to Kyoto:</strong> Lake Ashi in the morning, the shinkansen from Odawara, Gion in the evening.</li>
<li><strong>Day 4, Kyoto:</strong> Fushimi Inari at dawn, Kiyomizu-dera, kaiseki lunch and a tea ceremony.</li>
<li><strong>Day 5, Hiroshima and Miyajima:</strong> the Peace Memorial Park and Museum, then Itsukushima Shrine.</li>
</ol>
<p>After this, you might continue on your own to Nara and Osaka, with restaurants already booked.</p>
<h2>Planning before you arrive</h2>
<p>Much of a multi-day guide’s value is delivered before the trip. Mario discusses your interests, pace and dietary needs, proposes a route with realistic travel times, and books restaurants and experiences in Japanese. He also advises on hotel locations that make the days easier, such as staying near Kyoto Station on a day you will travel early.</p>
<h2>Why Mario</h2>
<p>Mario has guided English-speaking travelers privately for four years and also speaks Spanish. He is based in Kansai and married into a Japanese family, which gives him an insider’s feel for etiquette and everyday life, and he is, above all, an outstanding organizer. Of everything he does, traveling with guests across Japan for several days is what he enjoys most: the trip becomes one continuous story rather than a series of separate tours.</p>`,
    faq: [
      ['Can a private guide travel with us across Japan?', 'Yes, and it is Mario’s favorite way to guide. He is based in Kansai and travels with you anywhere in Japan for several days; his train fares and hotel nights are charged at cost.'],
      ['How much does a multi-day private guide cost?', 'The daily guide rate plus the guide’s travel and accommodation at cost. With Mario, a full day is ¥69,600 and long day trips start from ¥84,000; multi-day trips are quoted on request.'],
      ['Do we need a guide every day?', 'No. Many travelers guide the transfer days and the busiest sights, then explore on their own with the plan and bookings in place.'],
    ],
    voir: ['japan-itinerary-two-weeks', 'private-tour-guide-japan-cost', 'luxury-private-tour-guide-japan'],
  },
  {
    yol: 'best-time-to-visit-japan', kapak: 'kawaguchiko-sakura', kapakAlt: 'Cherry blossoms by Lake Kawaguchi with Mount Fuji',
    titre: 'Best Time to Visit Japan in 2027: Season by Season',
    desc: 'Best time to visit Japan: cherry blossoms late March to early April, autumn color mid-November to early December, clear winters, holidays to avoid.',
    h1: 'When is the best time to visit Japan?',
    kisaBaslik: 'Best time to visit Japan', kisa: 'Cherry blossoms, autumn color and the weeks to avoid.',
    cevap: 'Spring and autumn are the best times to visit Japan. Cherry blossoms usually peak in Tokyo and Kyoto in late March and early April, and autumn color peaks in Kyoto from mid-November to early December. Winter brings the clearest views of Mount Fuji. Avoid Golden Week (29 April to 5 May), Obon in mid-August and the New Year holidays if you can.',
    govde: `<h2>Japan through the year</h2>
${tabla(['Months', 'Weather', 'Highlights', 'Crowds'], [
  ['January – February', 'Cold, dry, clear', 'Clear views of Fuji; snow in the mountains; plum blossoms in late February', 'Quiet, except Chinese New Year'],
  ['March – early April', 'Mild', 'Cherry blossoms: typically late March to early April in Tokyo and Kyoto', 'Very busy'],
  ['Late April – May', 'Warm, pleasant', 'Fresh green, wisteria and azaleas', 'Golden Week (29 Apr – 5 May) is extremely busy'],
  ['June – mid-July', 'Rainy season', 'Hydrangeas in Kamakura and Kyoto; lush gardens', 'Moderate'],
  ['Mid-July – August', 'Hot and humid', 'Summer festivals; Fuji climbing season', 'Obon (mid-August) is very busy'],
  ['September', 'Hot, typhoon risk', 'Quieter sights; warm evenings', 'Moderate'],
  ['October – November', 'Mild, clear', 'Autumn color: Nikko in October, Kyoto mid-November to early December', 'Busy in late November'],
  ['December', 'Cool, clear', 'Late autumn color early in the month; winter illuminations', 'New Year holidays are busy'],
])}
<h2>Cherry blossom season 2027</h2>
<p>Cherry blossoms usually open in Tokyo and Kyoto in late March, reaching full bloom about a week later and lasting roughly a week, depending on rain and wind. Official forecasts for 2027 will be published from early in the year, and the exact peak can shift by a week or more. To be safe, plan for the last days of March and the first days of April, and book hotels, restaurants and guides months ahead: this is the busiest season of the year.</p>
<ul>
<li><strong>Early starts are essential.</strong> Famous spots such as the Philosopher’s Path, Maruyama Park and Chidorigafuchi are calmest at sunrise.</li>
<li><strong>Follow the bloom north and up.</strong> If you miss the peak in Kyoto, the Fuji Five Lakes and the mountains bloom a little later.</li>
</ul>
<h2>Autumn color</h2>
<p>Autumn color arrives first in the mountains and the north. Around Lake Chuzenji in Nikko it peaks in October; in Hakone in early to mid-November; and in Kyoto and Tokyo from mid-November to early December. Kyoto in the last two weeks of November is one of the most beautiful sights in Japan, and also among the busiest. Temples such as Tofuku-ji, Eikan-do and Kiyomizu-dera hold evening illuminations, and Mario plans the day so you see the best of both morning and night.</p>
<h2>Winter: the quiet, clear season</h2>
<p>From December to February, the air is dry and the skies are often clear. Mount Fuji is most likely to be visible on winter mornings, gardens are calm, and onsen and ryokan feel at their best. Kyoto in January is quiet, with occasional snow on temple roofs. It is an underrated time for a first visit, especially for couples.</p>
<h2>Summer</h2>
<p>July and August are hot and humid across most of Japan, often above 33°C in Tokyo and Kyoto. With early starts, indoor afternoons and evening walks, summer can still be enjoyable, and it is the season for festivals and climbing Mount Fuji. The rainy season, from early June to mid-July, brings frequent showers but also beautiful hydrangeas and fewer visitors.</p>
<h2>Japanese holidays to avoid</h2>
<ul>
<li><strong>Golden Week, 29 April to 5 May:</strong> a cluster of public holidays when much of Japan travels. Trains and hotels fill and prices rise.</li>
<li><strong>Obon, mid-August:</strong> families return to their hometowns; the shinkansen is crowded around 13 to 16 August.</li>
<li><strong>New Year, about 29 December to 3 January:</strong> many restaurants and some sights close, and shrines are extremely busy in the first days of January.</li>
</ul>
<h2>Our recommendation</h2>
<p>For a first visit, aim for late March to mid-April, or mid-October to early December. If you prefer fewer crowds and clear skies, consider January, February or late May. Whatever the season, the same rule applies: start early, book the best restaurants and experiences well ahead, and leave room to adapt to the weather.</p>
<p>Mario plans around the season: early starts at the busiest sights, evening illuminations in autumn, indoor alternatives in summer, and the clearest morning for Mount Fuji. Rates are per private party: half day ${yen(PRECIO.medio)}, full day ${yen(PRECIO.completo)}, long day trips from ${yen(PRECIO.largo)}.</p>`,
    faq: [
      ['When do cherry blossoms bloom in Japan in 2027?', 'In Tokyo and Kyoto they typically bloom from late March to early April. Official 2027 forecasts are published early in the year, and the exact dates vary with the weather.'],
      ['When is the best time to see autumn leaves in Kyoto?', 'From mid-November to early December, with the peak usually in the last two weeks of November.'],
      ['When is Mount Fuji most visible?', 'In late autumn and winter, especially on clear early mornings. In summer it is often hidden by cloud.'],
      ['What are the busiest times to visit Japan?', 'Cherry blossom season, Golden Week (29 April to 5 May), Obon in mid-August, late November in Kyoto and the New Year holidays.'],
    ],
    voir: ['japan-itinerary-two-weeks', 'japan-honeymoon-private-guide', 'first-time-japan-tips'],
  },
  {
    yol: 'first-time-japan-tips', kapak: 'kaminarimon', kapakAlt: 'The Kaminarimon gate and its great lantern at Senso-ji, Tokyo',
    titre: 'First Time in Japan: 15 Essential Tips for 2026',
    desc: 'First trip to Japan: IC cards, cash, no tipping, shoes off, quiet trains, Visit Japan Web, luggage forwarding, and when the JR Pass is worth it.',
    h1: 'First time in Japan? The essential tips',
    kisaBaslik: 'First-time Japan tips', kisa: 'IC cards, cash, etiquette, luggage and rail passes.',
    cevap: 'On a first trip to Japan, get an IC card (or Suica in Apple Wallet) for trains, carry some cash, never tip, take your shoes off where you see a step up or slippers, keep quiet on trains, register on Visit Japan Web before you fly, and forward your luggage between cities. Since the October 2023 price rise, the Japan Rail Pass is less often worth it.',
    govde: `<h2>Before you fly</h2>
<ol>
<li><strong>Register on Visit Japan Web.</strong> The official online service lets you complete immigration and customs information before arrival and show QR codes at the airport, which speeds things up.</li>
<li><strong>Check your passport and entry rules.</strong> Visitors from the United States, the United Kingdom, Australia and New Zealand can currently enter Japan visa-free for short tourist stays; confirm the latest rules before you travel.</li>
<li><strong>Book the special things early.</strong> Ryokan, popular sushi counters, kaiseki restaurants, the Ghibli Museum and peak-season hotels can fill weeks or months ahead.</li>
<li><strong>Think about the rail pass carefully.</strong> The national Japan Rail Pass rose sharply in price in October 2023. For a typical Tokyo–Kyoto–Hiroshima trip, individual shinkansen tickets are now often cheaper. Add up your journeys before buying.</li>
</ol>
<h2>Money</h2>
<ol start="5">
<li><strong>Carry some cash.</strong> Cards are widely accepted in cities, but small restaurants, shrines, temples and markets may be cash-only. ATMs at convenience stores (7-Eleven in particular) and post offices accept most foreign cards.</li>
<li><strong>Do not tip.</strong> Tipping is not customary in Japan and can cause confusion. Excellent service is simply expected.</li>
<li><strong>Use an IC card.</strong> Suica, PASMO or ICOCA cards pay for trains, subways, buses and convenience stores. On iPhone, you can add Suica to Apple Wallet in minutes. Physical cards are sold at airports and major stations.</li>
</ol>
<h2>Getting around</h2>
<ol start="8">
<li><strong>Forward your luggage.</strong> Luggage forwarding services, known as takkyubin, send suitcases from hotel to hotel, usually by the next day. Ask at your hotel reception. It makes shinkansen days far easier.</li>
<li><strong>Reserve shinkansen seats in busy periods.</strong> Large suitcases on the Tokaido Shinkansen need a seat with an oversized-luggage area, booked in advance.</li>
<li><strong>Allow time for big stations.</strong> Tokyo, Shinjuku, Kyoto and Osaka stations are vast. Choosing the right exit can save twenty minutes.</li>
</ol>
<h2>Etiquette</h2>
<ol start="11">
<li><strong>Shoes off.</strong> Remove shoes when you see a raised entrance, a shoe rack or slippers: in ryokan, homes, some restaurants, temple halls and castle keeps. Never wear slippers on tatami.</li>
<li><strong>Quiet on trains.</strong> Avoid phone calls and keep conversations low. Priority seats are for older passengers, pregnant women and people with disabilities.</li>
<li><strong>At shrines and temples.</strong> Bow at the gate, rinse your hands at the water basin if you wish, and follow posted photography rules, especially inside halls.</li>
<li><strong>Carry your trash.</strong> Public bins are rare. Keep a small bag and dispose of rubbish at your hotel or a convenience store.</li>
<li><strong>Respect neighborhoods.</strong> In Kyoto’s Gion, some private lanes ban photography. Do not photograph geiko and maiko without permission.</li>
</ol>
<h2>Food</h2>
<p>Japan is a superb place to eat. Some useful habits: say “itadakimasu” before you eat; do not stick chopsticks upright in rice or pass food chopstick to chopstick; eating while walking is frowned upon in some places, so stand near the stall. Many top restaurants seat few guests and take reservations far in advance, often only in Japanese. If you have allergies or dietary needs, have them written in Japanese or ask someone to call ahead.</p>
<h2>Health and safety</h2>
<p>Japan is one of the safest countries in the world. Tap water is drinkable, pharmacies are everywhere, and lost items are often returned. Earthquakes happen: follow your hotel’s guidance and any alerts on your phone. In summer, heat is the main risk; drink water and plan indoor afternoons.</p>
<h2>How a guide helps on a first visit</h2>
<p>A guided first day is the fastest way to feel at home. Mario sets up your IC cards, shows you how trains, exits and transfers work, explains etiquette as it comes up, and reserves restaurants and experiences in Japanese for the rest of your trip. Having married into a Japanese family and made his home in Kansai, he explains everyday customs from the inside. Half day ${yen(PRECIO.medio)}, full day ${yen(PRECIO.completo)}, per private party.</p>`,
    faq: [
      ['Do I need cash in Japan?', 'Some. Cards are common in cities, but small restaurants, temples and markets may take cash only. Convenience store ATMs accept most foreign cards.'],
      ['Is the Japan Rail Pass still worth it?', 'Less often since the October 2023 price rise. For many first trips, individual tickets are cheaper. Add up your planned journeys and compare.'],
      ['Should I tip in Japan?', 'No. Tipping is not part of Japanese culture.'],
      ['What is Visit Japan Web?', 'The official online service for completing immigration and customs information before arrival, so you can show QR codes at the airport.'],
    ],
    voir: ['japan-itinerary-two-weeks', 'best-time-to-visit-japan', 'japan-family-trip-private-guide'],
  },
]

// La página insignia (viajes de varios días) va la primera en listas y pie.
RESPUESTAS.sort((a, b) => (b.yol === 'multi-day-private-guide-japan') - (a.yol === 'multi-day-private-guide-japan'))

// ---------- Piezas comunes de página ----------
const todas = () => [...REGIONES, ...RESPUESTAS]
const buscar = (y) => todas().find((r) => r.yol === y) ?? (() => { throw new Error(`private: enlace a ${y}, que no existe`) })()
const tituloDe = (y) => { const r = buscar(y); return r.h1 && RESPUESTAS.includes(r) ? r.h1 : `Private guide: ${r.ad}` }
const bant = (lien, texto = 'Send your dates, the size of your party and where you are staying. Mario replies with a plan, and every reservation is made for you, in Japanese.') => `<section class="bant"><div class="kap">
<p class="etiket">Begin</p>
<h2>Let Mario plan your Japan</h2>
<p>${texto}</p>
<div class="dugmeler"><a class="btn" href="${lien}">Message Mario on WhatsApp</a><a class="btn2" href="/private/#prices">See prices</a></div>
</div></section>`
const kartRegion = (r) => carteLien(`/private/${r.yol}/`, r.kapak, r.kapakAlt, r.ad, r.yerler.slice(0, 3).map((y) => y[0]).join(' · '))
const regionesConFoto = () => REGIONES.filter((r) => r.kapak)

const FAQ_HOME = [
  ['How much does a private guide with Mario cost?', `Rates are per private party, not per person, for day tours from his base in Kansai: half day (4 hours) ${yen(PRECIO.medio)}, full day (8 hours) ${yen(PRECIO.completo)}, long day trips such as Hiroshima and Miyajima, Mount Fuji, Nikko from Tokyo or Koyasan from ${yen(PRECIO.largo)}, and extra hours ${yen(PRECIO.hora)}. Outside Kansai, his train fare (and hotel if overnight) is added at cost. Multi-day journeys are quoted on request.`],
  ['What is included in the price?', 'Mario’s time for your private party, planning before the trip, reservations made in Japanese and coordination on the day. Trains, admissions, meals and any private car with driver are paid separately, at cost. Cancellation is free up to 72 hours before.'],
  ['Can Mario book restaurants and a tea ceremony?', 'Yes. He reserves kaiseki restaurants, sushi counters, tea ceremonies and other experiences in Japanese, explains dietary needs to the kitchen in advance, and times each booking around the day.'],
  ['Can we have a private car with driver?', 'Yes. Mario arranges a car with driver on request, paid separately at cost. It is ideal for full days in Kyoto, Mount Fuji from Tokyo, families and guests who prefer less walking.'],
  ['Can Mario travel with us for several days?', 'Yes, it is his favorite way to guide. Mario is based in Kansai and travels with you between cities anywhere in Japan. You pay the daily rate for each guided day, plus his train fares and hotel nights at cost; each journey is quoted on request.'],
  ['Is Mario a good guide for families with children?', 'Yes. Days are paced in shorter blocks with breaks and meals planned in advance, and because rates are per private party, a guide is especially good value for families.'],
  ['We prefer a slower pace. Is that possible?', 'Of course. Every day is private and planned around you: fewer sights, longer lunches, gardens instead of crowds. Mario adapts on the spot if you want to slow down further.'],
  ['How do we book?', `Message Mario directly on WhatsApp (${WA_VISIBLE}) with your dates, the number of guests, your hotel area and your interests. He replies with a plan and confirms the details.`],
]

// ---------- Portada ----------
{
  const lien = WA_GENEL
  const corps = `
${hero('kiyomizu-sonbahar', 'Kiyomizu-dera in autumn above the maples of Kyoto', `<span class="etiket">Private guide · All of Japan</span>
<h1>Japan, privately guided by Mario</h1>
<p class="alt">Early starts before the crowds, kaiseki and tea ceremony booked in Japanese, trains and cars timed to the minute. Kansai-based, Mario travels with you across Japan: day tours in Kyoto, Osaka and Nara, and multi-day journeys from Tokyo to Hiroshima.</p>
<div class="dugmeler"><a class="btn" href="${lien}">Message Mario on WhatsApp</a><a class="btn2" href="#journeys">Explore the journeys</a></div>`)}
<section class="blok"><div class="kap giris">
<div>
<p class="etiket">In brief</p>
<p class="cevap">Mario is a private English-speaking tour guide in Japan with four years of experience guiding travelers from around the world. He also speaks Spanish, is based in Kansai and married into a Japanese family. Day tours in Kyoto, Osaka and Nara start from ${yen(PRECIO.medio)} per private party; elsewhere he travels with you, his fare and hotel at cost, and multi-day journeys across Japan are his favorite.</p>
</div>
${fiche('Quick facts', [['Based in', 'Kansai: Kyoto, Osaka, Nara (day tours)'], ['Travels to', 'Anywhere in Japan; his train fare and hotel at cost'], ['Favorite', 'Multi-day journeys across Japan'], ['Languages', 'English; also Spanish']])}
</div></section>
<section class="blok" id="multi-day"><div class="kap">
<div class="bas"><p class="etiket">Mario’s favorite</p><h2>Multi-day journeys with Mario</h2><p>Mario is based in Kansai, but what he loves most is traveling with you across Japan: one guide, one continuous story, and every train, transfer and table arranged from the first morning to the last.</p></div>
<div class="giris">
<div>
<p class="etiket">A sample ten-day journey</p>
<ol class="zaman">
<li><span class="saat">Days 1–3 · Tokyo</span>Senso-ji at opening, the Imperial Palace gardens, Meiji Jingu, a sushi counter booked in Japanese; IC cards and trains explained on day one.</li>
<li><span class="saat">Day 4 · Hakone or Mount Fuji</span>Suitcases forwarded to Kyoto; Lake Ashi or the Chureito pagoda, then a ryokan night with kaiseki dinner.</li>
<li><span class="saat">Days 5–7 · Kyoto and Nara</span>Fushimi Inari at first light, Kiyomizu-dera, a private tea ceremony, Arashiyama, and a morning with Nara’s deer and the Great Buddha.</li>
<li><span class="saat">Day 8 · Hiroshima and Miyajima</span>The Peace Memorial Park and Museum, then Itsukushima Shrine, timed around the tide.</li>
<li><span class="saat">Days 9–10 · Osaka or Himeji</span>Osaka Castle and Kuromon Market, or Himeji Castle and Kobe, before departure from Kansai International Airport.</li>
</ol>
</div>
<aside class="fiche" aria-label="How journey pricing works">
<p class="etiket">How pricing works</p>
<dl>
<dt>Guide</dt><dd>The daily rate × guided days: ${yen(PRECIO.completo)} per full day; long days such as Hiroshima or Mount Fuji from ${yen(PRECIO.largo)}</dd>
<dt>Travel</dt><dd>Mario’s train fares and hotel nights, at cost</dd>
<dt>Yours</dt><dd>Your trains, admissions, meals and any car with driver, at cost</dd>
<dt>Quote</dt><dd>Each journey is quoted in writing on request</dd>
</dl>
<div class="dugmeler"><a class="btn" href="${wa('Hello Mario, I would like a multi-day journey across Japan with you. Dates: ')}">Plan a journey</a><a class="btn2" href="/private/multi-day-private-guide-japan/">How journeys work</a></div>
</aside>
</div>
</div></section>
<section class="blok"><div class="kap">
<div class="bas"><p class="etiket">Why travelers choose Mario</p><h2>The difference is in the details you never see</h2></div>
<ol class="sutun">
<li><span class="no">01</span><h3>Kansai-based, travels with you</h3><p>Home is Kyoto, Osaka and Nara. From there Mario travels with you across Japan, for a day or a whole journey: reserved seats, the right station exit, a car waiting when it saves time.</p></li>
<li><span class="no">02</span><h3>Doors that open in Japanese</h3><p>Kaiseki rooms, sushi counters, tea ceremonies and craft workshops that accept bookings only in Japanese, reserved and confirmed for you, with dietary needs explained in advance.</p></li>
<li><span class="no">03</span><h3>An insider’s understanding</h3><p>Having married into a Japanese family and made his life in Kansai, Mario knows the etiquette, the rhythms and the small courtesies that make Japan feel welcoming rather than foreign.</p></li>
<li><span class="no">04</span><h3>Seamless, at your pace</h3><p>Mario plans the whole day, or the whole trip, and every day is private, adapting on the spot to weather, energy and curiosity.</p></li>
</ol>
</div></section>
<section class="blok"><div class="kap tanis">
${portraitGrand}
<div class="metin">
<p class="etiket">Meet Mario</p>
<h2>Your guide, and the person who makes it all run</h2>
<p>For four years, Mario has guided English-speaking travelers privately through Japan. He also speaks Spanish, so mixed-language families are at ease.</p>
<p>He is based in Kansai and married into a Japanese family. That gives him something no guidebook can: an everyday feel for how things are done, and the confidence to call a restaurant, a ryokan or a tea master in Japanese on your behalf.</p>
<p>Above all, Mario is an outstanding organizer. He times trains and transfers, books what needs booking, and quietly changes the plan when the weather or your mood suggests something better.</p>
<p class="imza">Mario</p>
<div class="dugmeler"><a class="btn2" href="/private/about-mario/">More about Mario</a></div>
</div>
</div></section>
<section class="blok" id="journeys"><div class="kap">
<div class="bas"><p class="etiket">Signature journeys</p><h2>Where Mario can take you</h2><p>Kyoto, Osaka and Nara are Mario’s home ground; beyond Kansai he travels with you. These are the journeys guests ask for most, each planned around the best hours of the day.</p></div>
<ul class="izgara">
${regionesConFoto().map(kartRegion).join('\n')}
</ul>
</div></section>
<section class="blok"><div class="kap">
<div class="bas"><p class="etiket">How it works</p><h2>How a day with Mario works</h2></div>
<ol class="sutun">
<li><span class="no">01</span><h3>Message Mario</h3><p>Send your dates, the number of guests, your hotel area and what you would love to see, on WhatsApp.</p></li>
<li><span class="no">02</span><h3>A plan, timed and booked</h3><p>Mario proposes a day with times, then reserves restaurants, experiences and, if you wish, a car with driver, in Japanese.</p></li>
<li><span class="no">03</span><h3>The day itself</h3><p>A hotel lobby pick-up, an early start at the busiest sight, and a day that adapts on the spot.</p></li>
<li><span class="no">04</span><h3>Onward with confidence</h3><p>Trains, IC cards and etiquette explained along the way, so your free days feel as easy as the guided ones.</p></li>
</ol>
</div></section>
<section class="blok" id="prices"><div class="kap">
<div class="bas"><p class="etiket">Prices</p><h2>Clear rates, per private party</h2><p>Prices are in Japanese yen for your whole party, not per person.</p></div>
<div class="fiyatlar">
<div class="fiyat"><h3>Half day</h3><p class="tutar">${yen(PRECIO.medio)}</p><p class="birim">4 hours · per private party</p><ul><li>One area explored in depth</li><li>Ideal for arrival days or Nara from Kyoto</li><li>Extra hours ${yen(PRECIO.hora)}</li></ul></div>
<div class="fiyat onerilen"><span class="rozet">Recommended</span><h3>Full day</h3><p class="tutar">${yen(PRECIO.completo)}</p><p class="birim">8 hours · per private party</p><ul><li>A fully planned day with timed transfers</li><li>Restaurants and experiences booked in Japanese</li><li>Hotel lobby pick-up</li></ul></div>
<div class="fiyat"><h3>Long day trips</h3><p class="tutar"><small style="font-size:.45em">from</small> ${yen(PRECIO.largo)}</p><p class="birim">per private party</p><ul><li>Hiroshima &amp; Miyajima, Mount Fuji</li><li>Nikko from Tokyo, Koyasan</li><li>Shinkansen and connections coordinated</li></ul></div>
</div>
<div class="notlar">
<p><strong>Paid separately, at cost:</strong> trains, admissions, meals and tea ceremony fees, and a private car with driver, which Mario arranges on request.</p>
<p><strong>Outside Kansai:</strong> Mario is based in Kyoto, Osaka and Nara; elsewhere his train fare (and hotel if overnight) is added at cost.</p>
<p><strong>Multi-day journeys:</strong> quoted on request; Mario’s travel and hotel nights are charged at cost. <a href="/private/multi-day-private-guide-japan/">How multi-day trips work</a>.</p>
<p><strong>Cancellation:</strong> free up to 72 hours before the day.</p>
</div>
</div></section>
<section class="blok" id="reviews"><div class="kap">
<div class="bas"><p class="etiket">Guests</p><h2>In their words</h2></div>
${listaResenas(3)}
<p style="margin-top:36px"><a href="/private/reviews/">All reviews</a> · <a href="${WA_RESENA}">Leave a review</a></p>
</div></section>
<section class="blok"><div class="kap">
<div class="bas"><p class="etiket">Plan your trip</p><h2>Answers before you go</h2></div>
<ul class="bagla">${RESPUESTAS.map((c) => `<li><a href="/private/${c.yol}/">${esc(c.h1)}</a></li>`).join('')}</ul>
</div></section>
<section class="blok"><div class="kap">
<div class="bas"><p class="etiket">Questions</p><h2>Frequently asked</h2></div>
${faqHtml(FAQ_HOME)}
</div></section>
${bant(lien)}`
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      marioLd, NEGOCIO_LD,
      serviceLd('Private English-speaking tour guide in Japan'),
      faqLd(FAQ_HOME),
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Private guide', item: `${BASE}/private/` }] },
      { '@type': 'WebPage', url: `${BASE}/private/`, inLanguage: 'en', name: 'Mario — Private English-Speaking Tour Guide in Japan', dateModified: HOY, about: { '@id': MARIO_ID }, primaryImageOfPage: imageDe('kiyomizu-sonbahar') },
      ...resenaLd,
    ],
  }
  ecrire('', page({
    yol: '', image: imageDe('kiyomizu-sonbahar'), jsonld, corps,
    titre: 'Mario — Private English-Speaking Tour Guide in Japan',
    desc: 'Mario, private English-speaking tour guide in Japan: Kyoto, Tokyo, Mount Fuji, Hiroshima and multi-day trips, with every booking made in Japanese.',
  }))
}

// ---------- Regiones ----------
for (const r of REGIONES) {
  const lien = wa(`Hello Mario, I would like a private guide for ${r.ad}. Dates: `)
  const contenu = `<span class="etiket"><a href="/private/">Private guide</a> · ${esc(r.ad)}</span>
<h1>${esc(r.h1)}</h1>
<p class="alt">${esc(r.alt)}</p>
<div class="dugmeler"><a class="btn" href="${lien}">Plan ${esc(r.ad)} with Mario</a><a class="btn2" href="#highlights">Highlights</a></div>`
  const precio = r.largo
    ? `Long day trip from ${yen(PRECIO.largo)} per private party · extra hours ${yen(PRECIO.hora)}`
    : `Half day ${yen(PRECIO.medio)} · full day ${yen(PRECIO.completo)} · per private party`
  const otras = REGIONES.filter((o) => o !== r && o.kapak).slice(0, 3)
  const corps = `
${r.kapak ? hero(r.kapak, r.kapakAlt, contenu, 'orta') : heroDuz(contenu)}
<section class="blok"><div class="kap giris">
<div><p class="etiket">In brief</p><p class="cevap">${esc(r.cevap)}${r.fuera ? ` ${FUERA}` : ' Kansai is Mario’s home ground, so no guide travel costs are added.'}</p></div>
${fiche(`${r.ad}: quick facts`, [...r.hizli, ...(r.fuera ? [['Guide travel', FUERA]] : [['Guide travel', 'None: Mario is based in Kansai']])])}
</div></section>
<section class="blok" id="highlights"><div class="kap">
<div class="bas"><p class="etiket">${esc(r.ad)}</p><h2>Highlights with Mario</h2></div>
<ul class="izgara yerler">
${r.yerler.map(([n, t, k]) => k
    ? `<li><figure class="kf">${imgCarte(k, n)}<figcaption>${credit(k)}</figcaption></figure><h3>${esc(n)}</h3><p>${esc(t)}</p></li>`
    : `<li class="yalin"><h3>${esc(n)}</h3><p>${esc(t)}</p></li>`).join('\n')}
</ul>
</div></section>
<section class="blok"><div class="kap">
<div class="bas"><p class="etiket">A suggested day</p><h2>How the day could unfold</h2><p>A starting point, not a script: Mario adjusts the order and pace to the season, the crowds and your interests.</p></div>
<ol class="zaman">${r.gun.map(([s, t]) => `<li><span class="saat">${s}</span>${esc(t)}</li>`).join('')}</ol>
</div></section>
<section class="blok"><div class="kap">
<div class="bas"><p class="etiket">Insider tips</p><h2>What Mario wants you to know</h2></div>
<ul class="ipucu">${r.ipuclari.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
<p class="fiyat-satir" style="margin-top:48px">${precio}</p>
<p class="soluk" style="font-size:16px;max-width:780px">${r.fuera ? `${FUERA} ` : ''}Trains, admissions, meals and any private car with driver are paid separately, at cost. Free cancellation up to 72 hours before. <a href="/private/#prices">All prices</a></p>
</div></section>
<section class="blok"><div class="kap">
<div class="bas"><p class="etiket">Questions</p><h2>${esc(r.ad)}: frequently asked</h2></div>
${faqHtml(r.faq)}
${contactCard(lien)}
</div></section>
<section class="blok"><div class="kap">
<div class="bas"><p class="etiket">Plan ahead</p><h2>Read next</h2></div>
<ul class="bagla">${r.voir.map((y) => `<li><a href="/private/${y}/">${esc(tituloDe(y))}</a></li>`).join('')}</ul>
<div class="bas" style="margin-top:72px"><p class="etiket">More journeys</p><h2>Other places Mario guides</h2></div>
<ul class="izgara">${otras.map(kartRegion).join('\n')}</ul>
</div></section>
${bant(lien)}`
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      marioLd,
      serviceLd(`Private English-speaking guide: ${r.ad}`, r.ad, `${BASE}/private/${r.yol}/`),
      { '@type': 'TouristTrip', name: `A private day in ${r.ad} with Mario`, inLanguage: 'en', provider: { '@id': MARIO_ID }, itinerary: { '@type': 'ItemList', itemListElement: r.yerler.map(([n], i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'TouristAttraction', name: n } })) } },
      faqLd(r.faq),
      migas([[r.ad, `${BASE}/private/${r.yol}/`]]),
    ],
  }
  ecrire(r.yol, page({ yol: r.yol, titre: r.titre, desc: r.desc, image: r.kapak ? imageDe(r.kapak) : PORTRAIT_URL, jsonld, corps }))
}

// ---------- Respuestas ----------
for (const c of RESPUESTAS) {
  const lien = wa(`Hello Mario, I read "${c.h1}". I would like a private guide in Japan. Dates: `)
  const corps = `
${hero(c.kapak, c.kapakAlt, `<span class="etiket"><a href="/private/">Private guide</a> · Plan your trip</span>
<h1>${esc(c.h1)}</h1>
<p class="maj">Updated <time datetime="${HOY}">${HOY_EN}</time> · by Mario, private guide in Japan</p>`, 'kisa')}
<section class="blok"><div class="kap giris">
<div><p class="etiket">The short answer</p><p class="cevap">${esc(c.cevap)}</p></div>
${fiche('Quick facts', [['Topic', esc(c.kisaBaslik)]])}
</div></section>
<section class="blok"><div class="kap"><article class="yazi">
${c.govde}
</article></div></section>
<section class="blok"><div class="kap">
<div class="bas"><p class="etiket">Questions</p><h2>Frequently asked</h2></div>
${faqHtml(c.faq)}
${contactCard(lien)}
</div></section>
<section class="blok"><div class="kap">
<div class="bas"><p class="etiket">Plan ahead</p><h2>Read next</h2></div>
<ul class="bagla">${c.voir.map((y) => `<li><a href="/private/${y}/">${esc(tituloDe(y))}</a></li>`).join('')}${REGIONES.slice(0, 3).map((r) => `<li><a href="/private/${r.yol}/">Private guide: ${esc(r.ad)}</a></li>`).join('')}</ul>
</div></section>
${bant(lien)}`
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', headline: c.h1, inLanguage: 'en', datePublished: PUBLICADO, dateModified: HOY, author: { '@id': MARIO_ID }, publisher: { '@id': `${BASE}/#negocio` }, mainEntityOfPage: `${BASE}/private/${c.yol}/`, description: c.desc, image: imageDe(c.kapak) },
      marioLd,
      faqLd([[c.h1, c.cevap], ...c.faq]),
      migas([[c.kisaBaslik, `${BASE}/private/${c.yol}/`]]),
    ],
  }
  ecrire(c.yol, page({ yol: c.yol, titre: c.titre, desc: c.desc, image: imageDe(c.kapak), jsonld, corps }))
}

// ---------- Reseñas ----------
{
  const media = RESENAS.length ? (RESENAS.reduce((t, y) => t + y.stars, 0) / RESENAS.length).toFixed(1) : ''
  const resumen = RESENAS.length
    ? `Mario has ${RESENAS.length} published guest review${RESENAS.length === 1 ? '' : 's'}, with an average of ${media} out of 5. Each review below was left by a guest and is published as written.`
    : 'Reviews from Mario’s guests are being added here. Every review on this page is left by a guest and published as written; none are edited or invented.'
  const corps = `
${heroDuz(`<span class="etiket"><a href="/private/">Private guide</a> · Reviews</span>
<h1>Guest reviews of Mario</h1>
<p class="alt">What travelers say after a day, or a week, in Japan with Mario.</p>
<div class="dugmeler"><a class="btn" href="${WA_RESENA}">Leave a review</a><a class="btn2" href="${WA_GENEL}">Book Mario</a></div>`)}
<section class="blok"><div class="kap">
<p class="cevap" style="max-width:820px">${esc(resumen)}</p>
</div></section>
<section class="blok"><div class="kap">
<div class="bas"><p class="etiket">Guests</p><h2>All reviews</h2></div>
${listaResenas(0)}
</div></section>
<section class="blok"><div class="kap">
<div class="bas"><p class="etiket">Traveled with Mario?</p><h2>Leave a review</h2><p>Send your review to Mario on WhatsApp, with your name, country and the day or trip you shared. It will be published here as written.</p></div>
<div class="dugmeler"><a class="btn" href="${WA_RESENA}">Leave a review on WhatsApp</a></div>
${contactCard(WA_GENEL)}
</div></section>
${bant(WA_GENEL)}`
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      marioLd, ...resenaLd,
      { '@type': 'WebPage', url: `${BASE}/private/reviews/`, inLanguage: 'en', name: 'Guest reviews of Mario, private guide in Japan', dateModified: HOY, about: { '@id': MARIO_ID } },
      migas([['Reviews', `${BASE}/private/reviews/`]]),
    ],
  }
  ecrire('reviews', page({
    yol: 'reviews', image: PORTRAIT_URL, jsonld, corps,
    titre: 'Guest Reviews of Mario, Private Guide in Japan',
    desc: RESENAS.length
      ? `Guest reviews of Mario, private English-speaking guide in Japan: ${RESENAS.length} review${RESENAS.length === 1 ? '' : 's'}, average ${media}/5. Read them or leave yours on WhatsApp.`
      : 'Guest reviews of Mario, private English-speaking guide in Japan, published as written. Traveled with Mario? Leave your review on WhatsApp.',
  }))
}

// ---------- Sobre Mario ----------
{
  const FAQ_MARIO = [
    ['Who is Mario?', 'Mario is a professional private tour guide who has guided English-speaking travelers in Japan for four years. He also speaks Spanish, is based in Kansai (Kyoto, Osaka, Nara), married into a Japanese family, and is part of the Tony Kansai Guide team.'],
    ['What languages does Mario speak?', 'English, for all his tours, and Spanish. He also handles reservations in Japanese on your behalf.'],
    ['Where does Mario guide?', 'He is based in Kansai, where day tours in Kyoto, Osaka and Nara are the default. He also guides anywhere else in Japan, including Tokyo, Mount Fuji and Hakone, Nikko, Kamakura and Hiroshima, with his train fare and hotel nights at cost. Multi-day journeys across Japan are his favorite.'],
    ['How do I contact Mario?', `Directly on WhatsApp at ${WA_VISIBLE}. Bookings go straight to him.`],
  ]
  const corps = `
${heroDuz(`<span class="etiket"><a href="/private/">Private guide</a> · About</span>
<h1>About Mario</h1>
<p class="alt">A Kansai-based private English-speaking guide, married into a Japanese family, and plans every day as if it were his own.</p>
<div class="dugmeler"><a class="btn" href="${WA_GENEL}">Message Mario on WhatsApp</a></div>`)}
<section class="blok"><div class="kap tanis">
${portraitGrand}
<div class="metin">
<p class="etiket">Meet Mario</p>
<p class="cevap" style="margin-bottom:28px">Mario is a professional private tour guide who has guided English-speaking travelers in Japan for four years. He also speaks Spanish, is based in Kansai and married into a Japanese family. Day tours in Kyoto, Osaka and Nara are his home ground; beyond Kansai he travels with you, and multi-day journeys across Japan are his favorite way to guide.</p>
<p>Being part of a Japanese family has given Mario an understanding of daily life that goes beyond sightseeing: how a household marks the seasons, what is polite at a shrine or a dinner table, and how to ask for something in a way that is gladly received. He shares that with guests naturally, as the day goes on.</p>
<p>His great strength is organization. Mario plans the whole day, or the whole trip; he times trains and transfers, reserves restaurants and experiences in Japanese, and adapts on the spot when the weather turns or a sight is busier than expected.</p>
<p class="imza">Mario</p>
</div>
</div></section>
<section class="blok"><div class="kap">
<div class="bas"><p class="etiket">What Mario does</p><h2>A guide, a planner and a fixer</h2></div>
<ol class="sutun">
<li><span class="no">01</span><h3>Plans</h3><p>Routes built around the best hours at each sight, realistic travel times and the pace you prefer.</p></li>
<li><span class="no">02</span><h3>Books</h3><p>Kaiseki, sushi counters, tea ceremonies and experiences, reserved in Japanese, with dietary needs explained.</p></li>
<li><span class="no">03</span><h3>Coordinates</h3><p>Reserved shinkansen seats, station exits, cars with drivers on request and luggage sent ahead.</p></li>
<li><span class="no">04</span><h3>Adapts</h3><p>Rain, cloud over Mount Fuji, a tired child: a better plan, offered quietly and without fuss.</p></li>
</ol>
</div></section>
<section class="blok"><div class="kap giris">
<div class="metin">
<p class="etiket">The team</p>
<h2>Part of Tony Kansai Guide</h2>
<p>Mario is the premium English-speaking guide of <a href="/">Tony Kansai Guide</a>. Tony, the team’s founder, guides in Spanish, English and Arabic in Kansai. Bookings for Mario are made directly with him on WhatsApp.</p>
</div>
${fiche('Mario at a glance', [['Languages', 'English; also Spanish'], ['Based in', 'Kansai: Kyoto, Osaka, Nara'], ['Travels to', 'Anywhere in Japan; train fare and hotel at cost'], ['Favorite', 'Multi-day journeys'], ['Experience', 'Four years as a professional private guide']])}
</div></section>
<section class="blok"><div class="kap">
<div class="bas"><p class="etiket">Questions</p><h2>About Mario: frequently asked</h2></div>
${faqHtml(FAQ_MARIO)}
</div></section>
${bant(WA_GENEL)}`
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'ProfilePage', url: `${BASE}/private/about-mario/`, inLanguage: 'en', name: 'About Mario, private guide in Japan', dateModified: HOY, mainEntity: { '@id': MARIO_ID } },
      marioLd, NEGOCIO_LD, faqLd(FAQ_MARIO),
      migas([['About Mario', `${BASE}/private/about-mario/`]]),
    ],
  }
  ecrire('about-mario', page({
    yol: 'about-mario', image: PORTRAIT_URL, jsonld, corps,
    titre: 'About Mario, Private English-Speaking Guide in Japan',
    desc: 'Mario, a Kansai-based private guide, has guided English-speaking travelers for four years. He speaks Spanish too and loves multi-day journeys across Japan.',
  }))
}

// ---------- Validación y escritura ----------
// Todo enlace interno /private/... tiene que existir, y toda foto servida tiene
// que estar en disco: si no, el build se para antes de escribir nada.
const errores = []
for (const [yol, html] of PAGINAS) {
  for (const m of html.matchAll(/href="\/private\/([^"#?]*)/g)) {
    const destino = m[1].replace(/\/$/, '')
    if (!PAGINAS.has(destino)) errores.push(`/private/${yol} enlaza a /private/${m[1]}, que no existe`)
  }
  for (const m of html.matchAll(/\/(?:tr|fr|private)\/foto\/[\w.-]+\.webp/g)) {
    if (!existsSync(join(root, 'public', m[0]))) errores.push(`/private/${yol}: falta el archivo ${m[0]}`)
  }
  if (!/<html lang="en" data-estatica="private">/.test(html)) errores.push(`/private/${yol}: falta data-estatica`)
  if ((html.match(/<h1[\s>]/g) ?? []).length !== 1) errores.push(`/private/${yol}: no tiene exactamente un <h1>`)
}
if (errores.length) throw new Error(`private:\n${[...new Set(errores)].join('\n')}`)
for (const [yol, html] of PAGINAS) {
  const dir = join(root, 'public/private', yol)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
}
console.log(`private: ${PAGINAS.size} pages en public/private/`)
