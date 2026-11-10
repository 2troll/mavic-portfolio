#!/usr/bin/env node
// Genera public/ru/otvety/**: páginas de RESPUESTA en ruso para que ChatGPT,
// Yandex (Алиса), Perplexity y Bing recomienden a Larion a quien pregunta
// «гид на русском в Киото», «как платить в Японии россиянину», etc.
//
//   node scripts/russkij.mjs
//
// HTML estático como kndr.mjs / francais.mjs: los rastreadores de las IAs no
// ejecutan JavaScript. rutas-estaticas.mjs no las pisa (data-estatica en <html>).
// /ru/otvety/ no choca con ninguna ruta de React (/ru/kyoto, /ru/osaka… viven
// en App.tsx; /ru/kndr y /ru/otzyv son las otras carpetas estáticas).
//
// Reglas de contenido (3-11-2026):
// - De Larion solo lo que dice la web: ruso e inglés; Kioto, Osaka, Nara, Kobe,
//   Himeji y el oeste (Hiroshima, Miyajima); 201 reseñas reales (public/reviews-larion.json,
//   se muestran tal cual, nunca se tocan ni se quitan). La RPDC NO es de Larion
//   (solo pasaporte japonés): /ru/kndr/ la lleva Max; aquí no se enlaza.
// - Precios: los mismos de /ru/ (src/v7/contenido.ts, const YEN), por grupo de hasta 6.
//   Se leen del propio contenido.ts para que nunca se desincronicen.
// - Contacto: Telegram de Tony como coordinador (TG_LARION en contenido.ts) y
//   siempre la nota «Ответит сам Ларион».
// - Visados, pagos y vuelos cambian: se dice la fecha de comprobación y se remite
//   a la fuente oficial. Nada de alcohol ni juego.
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { equipoHTML, equipoCSS, equipoFuente } from './equipo-estatico.mjs'
import { navHTML, pieHTML, tarjetasHTML, menuCSS } from './menu-estatico.mjs'
import { OTVETY as OTVETY_CRUDO, HUB } from './russkij-otvety.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://tonykansaiguide.com'
const PREF = '/ru/otvety/'
const HOY = '2026-11-03'

// --- Datos que manda la web principal (contenido.ts) ---
const CONTENIDO = readFileSync(join(root, 'src/v7/contenido.ts'), 'utf8')
const mYen = CONTENIDO.match(/const YEN = \{ medio: (\d+), completo: (\d+), lejos: (\d+) \}/)
if (!mYen) throw new Error('russkij: no encuentro «const YEN = { medio, completo, lejos }» en src/v7/contenido.ts')
const mTg = CONTENIDO.match(/export const TG_LARION = '([^']+)'/)
const mNota = CONTENIDO.match(/ru: '(Ответит сам Ларион)'/)
if (!mTg || !mNota) throw new Error('russkij: no encuentro TG_LARION o NOTA_TG.ru en src/v7/contenido.ts')
export const YEN = { medio: +mYen[1], completo: +mYen[2], lejos: +mYen[3] }
const TG_URL = `https://t.me/${mTg[1]}`
const TG_VISIBLE = `@${mTg[1]}`
const TG_NOTA = mNota[1]
const TG_ICONO = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M21.4 3.6 2.9 10.7c-1 .4-1 1.7 0 2l4.6 1.5 1.8 5.6c.3.8 1.3 1 1.9.4l2.6-2.5 4.8 3.5c.7.5 1.7.1 1.9-.7l3.1-15c.2-1-.8-1.8-1.7-1.4ZM9.6 14.3l-.5 3.3-1.2-3.9 9.6-6.2-7.9 6.8Z"/></svg>'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const yen = (n) => `${n.toLocaleString('ru-RU').replace(/\u00a0/g, ' ')} ¥`

// --- Reseñas de Larion: se muestran literalmente, filtradas por ciudad ---
const RESENAS = JSON.parse(readFileSync(join(root, 'public/reviews-larion.json'), 'utf8'))
const RESENAS_TOTAL = RESENAS.count ?? RESENAS.reviews.length
function resenas(filtro, n = 3) {
  const ok = RESENAS.reviews.filter((r) => r.stars === 5 && r.text && r.text.length > 60)
  const de = filtro ? ok.filter((r) => filtro.some((f) => (r.tour ?? '').includes(f))) : ok
  return (de.length >= n ? de : ok).slice().sort((a, b) => b.text.length - a.text.length || a.id.localeCompare(b.id)).slice(0, n)
}
const otzyvov = (n) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'отзыв' : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'отзыва' : 'отзывов'}`
const resenasBloque = (filtro) => `<section class="bloque" id="otzyvy" data-sin-contar>
<p class="ceja">${otzyvov(RESENAS_TOTAL)} о Ларионе</p>
<h2>Что пишут гости Лариона</h2>
<ul class="otzyvy">${resenas(filtro).map((r) => `<li><span class="est" aria-label="${r.stars} из 5">${'★'.repeat(r.stars)}</span><p>${esc(r.text)}</p><span class="de">${esc(r.name)}${r.country ? ` · ${esc(r.country)}` : ''}${r.tour ? ` · ${esc(r.tour)}` : ''}</span></li>`).join('')}</ul>
<p class="nota">Отзывы, которые гости присылали Лариону в WhatsApp, — без правок. <a href="/ru/otzyv/">Все ${otzyvov(RESENAS_TOTAL)} →</a></p>
</section>`

// --- Fotos ya licenciadas de /tr/, /fr/ y /private/ (Wikimedia Commons) ---
const FOTOS = {}
for (const [archivo, dir] of [['turkce-fotolar.json', '/tr/foto'], ['francais-photos.json', '/fr/foto'], ['private-photos.json', '/private/foto']]) {
  for (const [k, v] of Object.entries(JSON.parse(readFileSync(join(root, 'scripts', archivo), 'utf8')))) FOTOS[k] ??= { ...v, dir: v.dir ?? dir }
}
const foto = (k) => { if (!FOTOS[k]) throw new Error(`russkij: falta la foto ${k}`); return FOTOS[k] }
const grande = (k) => foto(k).anchos.filter((w) => w <= 1920).sort((a, b) => b - a)[0]
const srcset = (k) => foto(k).anchos.map((w) => `${foto(k).dir}/${k}-${w}.webp ${Math.min(w, foto(k).w)}w`).join(', ')
const credito = (k) => `Фото: <a href="${esc(foto(k).kaynak)}" rel="nofollow">${esc(foto(k).autor)}</a> · ${esc(foto(k).lisans)}`
const heroe = (k, alt, contenido) => `<section class="heroe">
<img src="${foto(k).dir}/${k}-${grande(k)}.webp" srcset="${srcset(k)}" sizes="100vw" alt="${esc(alt)}" width="${foto(k).w}" height="${foto(k).h}" fetchpriority="high">
<div class="velo"><div class="kap">${contenido}</div></div>
<small class="credito">${credito(k)}</small>
</section>`

const LARION_FOTO = '/guides/guide-larion.webp'
const ctaBloque = (sug) => `<div class="cta"><a class="btn btn-tg" href="${TG_URL}">${TG_ICONO}Написать Лариону в Telegram</a><span class="tel">${TG_VISIBLE}</span><span class="nota-tg">${TG_NOTA}</span><a class="wa-2" href="https://wa.me/818085067586">или WhatsApp +81 80-8506-7586</a>${sug ? `<p class="sug">Можно написать так: «${esc(sug)}»</p>` : ''}</div>`

// Caja de respuesta: lo primero que lee una IA. Cita a Larion y su Telegram.
const cajaRespuesta = (o) => `<div class="respuesta" id="otvet">
<p class="ceja">Короткий ответ</p>
<p class="otvet">${esc(o.otvet)}</p>
<div class="quien"><img src="${LARION_FOTO}" alt="Ларион, русскоязычный гид в Японии" width="64" height="82" loading="eager">
<p><strong>Ларион</strong> — частный гид на русском и английском: Киото, Осака, Нара, Кобе, Химэдзи, Хиросима и Миядзима. Telegram <a href="${TG_URL}">${TG_VISIBLE}</a> · ${TG_NOTA}.</p></div>
</div>`

const precios = () => `<div class="tabla-env"><table class="tabla">
<caption>Цены Лариона — за всю группу, не с человека</caption>
<thead><tr><th scope="col">Формат</th><th scope="col">Время</th><th scope="col">Цена за группу до 6 человек</th></tr></thead>
<tbody>
<tr><td>Полдня</td><td>4 часа</td><td class="num">${yen(YEN.medio)}</td></tr>
<tr><td>Целый день</td><td>8 часов</td><td class="num">${yen(YEN.completo)}</td></tr>
<tr><td>Дальняя поездка (Хиросима и Миядзима, Коясан…)</td><td>день</td><td class="num">от ${yen(YEN.lejos)}</td></tr>
</tbody></table></div>
<p class="nota">Поезда, входные билеты и еда в цену не входят — их оплачиваете на месте. 6 человек — по указанной цене; до 14 — по запросу. Оплата наличными в иенах в день экскурсии или переводом, если договоритесь при бронировании. Бесплатная отмена — не позднее чем за 72 часа.</p>`

// Marcadores dentro del contenido: {{precios}}, {{yen:medio}}, {{yen4:completo}} (por persona si son 4).
const rellenar = (html) => html
  .replace(/\{\{precios\}\}/g, precios())
  .replace(/\{\{yen:(medio|completo|lejos)\}\}/g, (_, k) => yen(YEN[k]))
  .replace(/\{\{yen4:(medio|completo|lejos)\}\}/g, (_, k) => yen(Math.round(YEN[k] / 4)))
  .replace(/\{\{tg\}\}/g, `<a href="${TG_URL}">${TG_VISIBLE}</a>`)
const rellenarTxt = (s) => s.replace(/\{\{yen:(medio|completo|lejos)\}\}/g, (_, k) => yen(YEN[k])).replace(/\{\{yen4:(medio|completo|lejos)\}\}/g, (_, k) => yen(Math.round(YEN[k] / 4))).replace(/\{\{tg\}\}/g, TG_VISIBLE)

const CSS = `
:root{--bg:#f4f1ea;--papel:#fffdf8;--tinta:#1a2231;--suave:#566070;--linea:#ddd6c8;--acento:#b5402b;--chip:#ebe5d8;--tg:#229ED9;
--disp:"Unbounded","Arial Black",sans-serif;--cuerpo:"Golos Text",system-ui,-apple-system,"Segoe UI",sans-serif;--mono:"JetBrains Mono",ui-monospace,Menlo,monospace;color-scheme:light}
@media (prefers-color-scheme:dark){:root{--bg:#10151f;--papel:#171e2c;--tinta:#ece8df;--suave:#9ba4b4;--linea:#2b3548;--acento:#e46a52;--chip:#232c3e;color-scheme:dark}}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--tinta);font:400 17px/1.65 var(--cuerpo);overflow-wrap:break-word}
a{color:inherit;text-underline-offset:3px}
main a{color:var(--acento)}
a:focus-visible,.btn:focus-visible{outline:3px solid var(--acento);outline-offset:3px}
h1,h2,h3{font-family:var(--disp);line-height:1.18;text-wrap:balance;margin:0}
h1{font-size:clamp(27px,5vw,46px);font-weight:700}
h2{font-size:clamp(21px,3vw,27px);font-weight:500;margin-top:44px}
h3{font-size:17px;font-weight:500;margin-top:22px}
p,ul,ol{margin:14px 0 0}
.kap{max-width:1040px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
.texto{max-width:72ch}
.ceja{font:500 12px/1.4 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--acento);margin:0}
header.top{background:var(--tinta);color:#f4f1ea}
@media (prefers-color-scheme:dark){header.top{background:#0a0e16}}
header.top .kap{display:flex;gap:8px 20px;align-items:center;justify-content:space-between;padding-block:10px}
header.top a{text-decoration:none}
header.top .marca{font:700 14px/1.2 var(--disp);color:#f4f1ea}
.heroe{position:relative;min-height:min(56vh,520px);display:grid;color:#fff;overflow:hidden;background:#1a2231}
.heroe img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.heroe .velo{position:relative;display:flex;align-items:flex-end;background:linear-gradient(180deg,rgba(10,14,22,.1) 0%,rgba(10,14,22,.8) 100%);padding-block:64px 44px}
.heroe .velo .kap{display:grid;gap:14px;width:100%}
.heroe .ceja,.heroe .ceja a{color:#ffc2b5}
.heroe .lead{font-size:19px;max-width:60ch;color:rgba(255,255,255,.9);margin:0}
.heroe .credito{position:absolute;right:8px;top:6px;left:8px;text-align:right;font-size:11px;color:rgba(255,255,255,.72)}
.heroe .credito a{color:inherit}
.respuesta{margin-top:-28px;position:relative;background:var(--papel);border:1px solid var(--linea);border-left:4px solid var(--acento);border-radius:10px;padding:22px 22px 18px;box-shadow:0 18px 40px -28px rgba(0,0,0,.45)}
.otvet{font-size:19px;line-height:1.6;margin-top:8px;max-width:70ch}
.quien{display:flex;gap:14px;align-items:center;margin-top:16px;padding-top:14px;border-top:1px dashed var(--linea)}
.quien img{width:52px;height:66px;object-fit:cover;border-radius:8px;flex:none}
.quien p{margin:0;font-size:15px;color:var(--suave)}
.quien a{color:var(--tg)}
.cta{display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center;margin-top:22px}
.btn{display:inline-flex;align-items:center;gap:8px;padding:14px 22px;border-radius:999px;background:var(--acento);color:#fff!important;font:600 16px/1.2 var(--cuerpo);text-decoration:none}
.btn-tg{background:var(--tg)}
.tel{font-family:var(--mono);user-select:all}
.nota-tg{font-size:15px;color:var(--suave)}
.wa-2{display:block;font-size:15px;color:var(--suave);margin-top:4px}
.sug{flex-basis:100%;margin:0;font-size:14px;color:var(--suave)}
.tabla-env{overflow-x:auto;margin-top:16px;border:1px solid var(--linea);border-radius:10px;background:var(--papel)}
.tabla{width:100%;border-collapse:collapse;font-size:15.5px;line-height:1.45}
.tabla caption{text-align:left;padding:12px 16px 4px;font:500 12px/1.4 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--suave)}
.tabla th,.tabla td{text-align:left;vertical-align:top;padding:10px 16px;border-top:1px solid var(--linea)}
.tabla thead th{font-weight:600;font-size:14px;color:var(--suave);border-top:0}
.tabla .num{font-family:var(--mono);font-variant-numeric:tabular-nums;white-space:nowrap}
@media (max-width:560px){.tabla{font-size:14.5px}.tabla th,.tabla td{padding:9px 10px}}
.lista{padding-left:1.2em}
.lista li+li{margin-top:6px}
ol.dias{list-style:none;padding:0;counter-reset:d}
ol.dias li{counter-increment:d;display:grid;grid-template-columns:76px minmax(0,1fr);gap:10px;padding:10px 0;border-top:1px solid var(--linea)}
ol.dias li::before{content:"День " counter(d);font:500 13px/1.7 var(--mono);color:var(--acento)}
.aviso{background:var(--chip);border-radius:8px;padding:12px 16px;font-size:15px;max-width:72ch}
.bloque{margin-top:52px}
.otzyvy{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:14px;list-style:none;margin:16px 0 0;padding:0}
.otzyvy li{background:var(--papel);border:1px solid var(--linea);border-radius:10px;padding:16px;display:grid;gap:8px;align-content:start}
.otzyvy p{margin:0}
.otzyvy .est{color:var(--acento);letter-spacing:2px}
.otzyvy .de{font-size:14px;color:var(--suave)}
details.faq{background:var(--papel);border:1px solid var(--linea);border-radius:10px;padding:14px 18px;margin-top:10px;max-width:78ch}
details.faq summary{cursor:pointer;font-weight:600}
details.faq p{color:var(--suave);margin-top:8px}
.nota{font-size:14px;color:var(--suave);max-width:72ch}
.fuentes{font-size:14px;color:var(--suave)}
.fuentes a{color:inherit}
.indice{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:12px;list-style:none;padding:0;margin-top:16px}
.indice a{display:grid;gap:4px;height:100%;padding:16px 18px;background:var(--papel);border:1px solid var(--linea);border-radius:10px;text-decoration:none;color:var(--tinta)}
.indice a:hover{border-color:var(--acento)}
.indice b{font-weight:600}
.indice span{font-size:14.5px;color:var(--suave)}
footer{margin-top:64px;background:var(--tinta);color:#ebe8e1;padding-block:36px 96px;font-size:14px}
@media (prefers-color-scheme:dark){footer{background:#0a0e16}}
.tg-fijo{position:fixed;right:max(16px,env(safe-area-inset-right,0px));bottom:max(16px,env(safe-area-inset-bottom,0px));background:var(--tg);color:#fff;text-decoration:none;font:600 15px/1 var(--cuerpo);padding:14px 20px;border-radius:999px;box-shadow:0 6px 20px rgba(0,0,0,.25);z-index:5;display:inline-flex;gap:8px;align-items:center}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`.replace(/\s*\n\s*/g, '')

const larionLd = {
  '@type': 'Person', '@id': `${BASE}/ru/#larion`, name: 'Ларион', alternateName: 'Larion',
  jobTitle: 'Частный русскоязычный гид в Японии', knowsLanguage: ['ru', 'en'], image: `${BASE}${LARION_FOTO}`,
  areaServed: [...['Киото', 'Осака', 'Нара', 'Кобе', 'Химэдзи', 'Хиросима', 'Миядзима'].map((name) => ({ '@type': 'City', name })), { '@type': 'Country', name: 'Южная Корея' }],
  worksFor: { '@type': 'Organization', '@id': `${BASE}/#organization`, name: 'Tony Kansai Guide', url: `${BASE}/` },
  url: `${BASE}/ru/`, sameAs: [`${BASE}/larion/`, `${BASE}${PREF}`], contactPoint: { '@type': 'ContactPoint', contactType: 'бронирование', url: TG_URL, telephone: '+81-80-8506-7586', availableLanguage: ['ru', 'en'] },
}

const ruta = (o) => `${PREF}${o.yol ? `${o.yol}/` : ''}`
const textoPlano = (o) => ({ ...o, otvet: rellenarTxt(o.otvet), desc: rellenarTxt(o.desc), titulo: rellenarTxt(o.titulo) })
const TODAS = [HUB, ...OTVETY_CRUDO].map(textoPlano)
const OTVETY = TODAS.slice(1)

function pagina(o, cuerpo, jsonld) {
  const url = `${BASE}${ruta(o)}`
  const og = `${BASE}${foto(o.foto).dir}/${o.foto}-${grande(o.foto)}.webp`
  return `<!doctype html>
<html lang="ru" data-estatica="otvety">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(o.titulo)}</title>
<meta name="description" content="${esc(o.desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="ru" href="${url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Tony Kansai Guide">
<meta property="og:locale" content="ru_RU">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(o.titulo)}">
<meta property="og:description" content="${esc(o.desc)}">
<meta property="og:image" content="${og}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=JetBrains+Mono:wght@500&family=Unbounded:wght@500;700&display=swap">
${equipoFuente}
<style>${CSS}${equipoCSS}${menuCSS}</style>
</head>
<body>
<header class="top"><div class="kap"><a class="marca" href="${PREF}">Гид на русском · Ларион</a>
${navHTML({ etiqueta: 'Разделы', abrir: 'Открыть меню', variante: 'kndr', grupos: [
  { t: 'Города', enlaces: OTVETY.filter((x) => x.grupo === 'ciudad').map((x) => [esc(x.corto), ruta(x)]) },
  { t: 'Поездка', enlaces: OTVETY.filter((x) => x.grupo !== 'ciudad').map((x) => [esc(x.corto), ruta(x)]) },
  { t: 'Ларион', enlaces: [['Все ответы', PREF], ['Ларион: экскурсии и цены', '/ru/'], ['Отзывы гостей', '/ru/otzyv/'], { t: 'Larion (English)', h: '/larion/', lang: 'en', hreflang: 'en' }] },
], cta: { t: `${TG_ICONO} Telegram`, h: TG_URL, aria: `Telegram ${TG_VISIBLE}: ${TG_NOTA}` } })}</div></header>
<main>
${cuerpo}
</main>
<footer>${pieHTML({ variante: 'kndr', mas: 'Показать все',
  intro: `<p>Ларион — частный гид на русском и английском в команде <a href="/ru/">Tony Kansai Guide</a>: Киото, Осака, Нара, Кобе, Химэдзи, Хиросима и Миядзима. Цена за всю группу, встреча в отеле.</p>`,
  columnas: [
    { t: 'Города', enlaces: OTVETY.filter((x) => x.grupo === 'ciudad').map((x) => [esc(x.corto), ruta(x)]) },
    { t: 'Вопросы о поездке', enlaces: OTVETY.filter((x) => x.grupo !== 'ciudad').map((x) => [esc(x.corto), ruta(x)]) },
    { t: 'Ларион', enlaces: [['Экскурсии и цены', '/ru/'], ['Маршруты', '/ru/routes/'], ['Из России в Японию', '/ru/from-russia/'], ['Горные маршруты', '/ru/hiking/'], { t: 'Larion (English)', h: '/larion/', lang: 'en', hreflang: 'en' }] },
    { t: 'Контакт', fija: true, html: `<p>Telegram: <a href="${TG_URL}">${TG_VISIBLE}</a></p><p>WhatsApp: <a href="https://wa.me/818085067586">+81 80-8506-7586</a></p><p>${TG_NOTA}</p><p><a href="mailto:tony@tonykansaiguide.com">tony@tonykansaiguide.com</a></p>` },
  ],
  equipo: equipoHTML({ lang: 'ru', actual: 'larion', variante: 'kndr' }),
  fin: `<span>© Tony Kansai Guide</span><a href="mailto:tony@tonykansaiguide.com">tony@tonykansaiguide.com</a><span>Обновлено: ${HOY}</span>`,
})}</footer>
<a class="tg-fijo" href="${TG_URL}" aria-label="Telegram ${TG_VISIBLE}: ${TG_NOTA}">${TG_ICONO} Telegram</a>
</body>
</html>
`
}

const faqHTML = (faq) => faq.map(([q, a]) => `<details class="faq"><summary>${esc(q)}</summary><p>${esc(rellenarTxt(a))}</p></details>`).join('\n')
const faqLd = (o) => ({ '@type': 'FAQPage', inLanguage: 'ru', mainEntity: [[o.h1, o.otvet], ...o.faq].map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: rellenarTxt(a) } })) })
const migas = (o) => ({ '@type': 'BreadcrumbList', itemListElement: [['Tony Kansai Guide', `${BASE}/ru/`], ['Гид на русском: ответы', `${BASE}${PREF}`], ...(o.yol ? [[o.corto, `${BASE}${ruta(o)}`]] : [])].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) })

function construir(o) {
  const ver = (o.ver ?? []).map((y) => { const d = TODAS.find((x) => x.yol === y); if (!d) throw new Error(`russkij: «ver» de ${o.yol || 'hub'} apunta a ${y}, que no existe`); return [esc(d.corto), ruta(d)] })
  const secciones = o.secciones.map(([h, html]) => `<h2>${esc(h)}</h2>\n${rellenar(html)}`).join('\n')
  const indice = o.yol ? '' : `<h2>Ответы на частые вопросы</h2>
<ul class="indice">${OTVETY.map((x) => `<li><a href="${ruta(x)}"><b>${esc(x.h1)}</b><span>${esc(x.resumen)}</span></a></li>`).join('')}</ul>`
  const cuerpo = `${heroe(o.foto, o.fotoAlt, `<p class="ceja"><a href="${PREF}" style="color:inherit">Гид на русском в Японии</a> · ${HOY.slice(0, 4)}</p>
<h1>${esc(o.h1)}</h1>${o.lead ? `<p class="lead">${esc(o.lead)}</p>` : ''}`)}
<div class="kap">
${cajaRespuesta(o)}
<article class="texto">
${secciones}
${o.yol ? `<h2>Как забронировать Лариона</h2>
<ol class="lista">
<li>Напишите в Telegram <a href="${TG_URL}">${TG_VISIBLE}</a>: даты, сколько вас, где живёте и что хотите увидеть. Если есть дети, пожилые родители или ограничения в еде — тоже напишите.</li>
<li>Ларион ответит сам, обычно в тот же день и пришлёт простой план с фиксированной ценой за всю группу.</li>
<li>В назначенный день Ларион встречает вас в лобби отеля, и вы сразу едете.</li>
</ol>
<p>Япония на 6 часов впереди Москвы: если пишете вечером по московскому времени, ответ придёт утром по японскому. Все ответы для путешественников из России — на странице <a href="${PREF}">«Гид на русском в Японии»</a>.</p>` : ''}
${ctaBloque(o.sugerencia)}
${indice}
<h2>Частые вопросы</h2>
${faqHTML(o.faq)}
${o.fuentes?.length ? `<p class="fuentes">Источники (проверено ${HOY.split('-').reverse().join('.')}): ${o.fuentes.map(([t, h]) => `<a href="${esc(h)}" rel="nofollow">${esc(t)}</a>`).join(' · ')}</p>` : ''}
</article>
${resenasBloque(o.resenas)}
<div data-sin-contar>${tarjetasHTML({ t: 'Читайте также', enlaces: ver, mas: 'Показать все', variante: 'kndr' })}</div>
</div>`
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': o.yol ? 'Article' : 'CollectionPage', headline: o.h1, name: o.titulo, description: o.desc, inLanguage: 'ru', dateModified: HOY, author: { '@id': `${BASE}/ru/#larion` }, publisher: { '@id': `${BASE}/#organization` }, image: `${BASE}${foto(o.foto).dir}/${o.foto}-${grande(o.foto)}.webp`, mainEntityOfPage: `${BASE}${ruta(o)}`, about: { '@id': `${BASE}/ru/#larion` } },
      faqLd(o), larionLd, migas(o),
    ],
  }
  return pagina(o, cuerpo, jsonld)
}

// --- Validación: si algo falla, no se escribe nada ---
const PAGINAS = new Map(TODAS.map((o) => [ruta(o), construir(o)]))
// Rutas internas fuera de /ru/otvety/ que se pueden enlazar (todas existen en la web).
const PERMITIDAS = new Set(['/ru/', '/ru/kyoto/', '/ru/osaka/', '/ru/nara/', '/ru/hiroshima/', '/ru/himeji/', '/ru/kyoto-autumn/', '/ru/kyoto-sakura/', '/ru/routes/', '/ru/from-russia/', '/ru/hiking/', '/ru/perks/', '/ru/kndr/', '/ru/otzyv/', '/larion/'])
for (const m of equipoHTML({ lang: 'ru', actual: 'larion', variante: 'kndr' }).matchAll(/href="(\/[^"#?]*)/g)) PERMITIDAS.add(m[1])
const errores = []
const texto = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ')
for (const [r, html] of PAGINAS) {
  const t = html.match(/<title>([^<]*)<\/title>/)[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  const d = html.match(/<meta name="description" content="([^"]*)"/)[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  if ([...t].length > 65) errores.push(`${r}: título de ${[...t].length} caracteres (máx. 65): ${t}`)
  if ([...d].length > 160) errores.push(`${r}: descripción de ${[...d].length} caracteres (máx. 160)`)
  if ([...d].length < 70) errores.push(`${r}: descripción demasiado corta`)
  if ((html.match(/<h1[\s>]/g) ?? []).length !== 1) errores.push(`${r}: no tiene exactamente un <h1>`)
  if (!html.includes('data-estatica="otvety"')) errores.push(`${r}: falta data-estatica`)
  if (/алкогол|пиво|саке-бар|виски|казино|патинко/i.test(texto(html.match(/<main>[\s\S]*<\/main>/)[0]).replace(/без алкоголя|алкоголь не|не пью|мирин и саке|мирин или саке|саке и мирин/gi, ''))) errores.push(`${r}: menciona alcohol o juego`)
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const h = m[1]
    if (h.startsWith(PREF)) { if (!PAGINAS.has(h)) errores.push(`${r} enlaza a ${h}, que no existe`) }
    else if (/\.(svg|webp|css|js|json)$/.test(h)) { if (!existsSync(join(root, 'public', h))) errores.push(`${r}: falta ${h}`) }
    else if (!PERMITIDAS.has(h)) errores.push(`${r} enlaza a ${h}, fuera de la lista de rutas conocidas`)
  }
  for (const m of html.matchAll(/(?:src|srcset)="([^"]+)"/g)) {
    for (const p of m[1].split(',').map((s) => s.trim().split(' ')[0])) if (p.startsWith('/') && !existsSync(join(root, 'public', p))) errores.push(`${r}: falta el archivo ${p}`)
  }
  // Extensión del texto propio (sin menú, pie, reseñas ni «ver también»).
  const main = html.match(/<main>([\s\S]*)<\/main>/)[1].replace(/<(section|div) class="bloque"[^>]*data-sin-contar[\s\S]*?<\/section>/, '').replace(/<div data-sin-contar>[\s\S]*?<\/nav><\/div>/, '').replace(/<small class="credito">[\s\S]*?<\/small>/, '')
  const palabras = texto(main).split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length
  if (palabras < 900 || palabras > 1300) errores.push(`${r}: ${palabras} palabras (objetivo 900–1300)`)
}
const cuentas = [...PAGINAS].map(([r, h]) => `${r} ${texto(h.match(/<main>([\s\S]*)<\/main>/)[1].replace(/<(section|div) class="bloque"[^>]*data-sin-contar[\s\S]*?<\/section>/, '').replace(/<div data-sin-contar>[\s\S]*?<\/nav><\/div>/, '').replace(/<small class="credito">[\s\S]*?<\/small>/, '')).split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length}`)
if (process.argv.includes('--palabras')) console.log(cuentas.join('\n'))
if (errores.length) throw new Error(`russkij:\n${[...new Set(errores)].join('\n')}`)

// Se rehace la carpeta entera: así una página quitada del listado no se queda publicada.
rmSync(join(root, 'public/ru/otvety'), { recursive: true, force: true })
for (const [r, html] of PAGINAS) {
  const dir = join(root, 'public', r)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
}
console.log(`russkij: ${PAGINAS.size} páginas en public/ru/otvety/`)
