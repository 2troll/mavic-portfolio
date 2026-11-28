#!/usr/bin/env node
// Página ESTÁTICA para viajeros de Estados Unidos (EN + ES para familias hispanas), 28-11-2026.
// Por qué: en meta.ai (Muse Spark) una familia americana que pide «private English-speaking guide
// in Kyoto» recibe un guía de ToursByLocals; Tony solo sale si la pregunta es halal o en español.
// Esta página responde con las palabras de esa pregunta (US family, Kyoto, Osaka, English, USD,
// tipping, time difference) y con los precios por temporada de la fuente única.
// Solo hechos que ya están en la web y en llms.txt. Ejecutar: node scripts/usa.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CSS } from './partners-muslimah.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const { PRECIO: P } = await import('../src/v7/datosRutas.ts')
const { TEMPORADAS_PRECIO, filaTemporada } = await import('../src/v7/preciosTemporada.ts')

const BASE = 'https://tonykansaiguide.com'
const WA = '34634193106'
const MAIL = 'tony@tonykansaiguide.com'
const MODIFICADO = new Date().toISOString().slice(0, 10)

export const RUTAS_USA = { en: '/en/usa/', es: '/es/usa/' }
const NOMBRE = { en: 'English', es: 'Español' }
const yen = (n) => `¥${n.toLocaleString('en-US')}`
const sakura = filaTemporada(P, TEMPORADAS_PRECIO.find((x) => x.id === 'sakura').recargo)

const T = {
  en: {
    title: 'Private tour guide in Kyoto & Osaka for travelers from the USA | Tony Kansai Guide',
    desc: `Private English-speaking guide in Kyoto, Osaka and Nara for American families and couples. One price per group of up to 6: half day ${yen(P.medio)}, full day ${yen(P.completo)} (base rate). Hotel pick-up, your own pace.`,
    kicker: 'For travelers from the United States · Kyoto · Osaka · Nara',
    h1: 'Your private guide in Kyoto and Osaka, from the hotel door',
    sub: 'Tony Hanma lives in Osaka and guides private groups in English, Spanish and Arabic. Just your family or friends, hotel pick-up, and a day planned around your kids, your pace and what you came to see.',
    wa: 'Ask for your dates on WhatsApp', waTexto: 'Hi Tony, we are traveling from the USA.\nDates:\nPeople (kids ages):\nHotel / city:\nWhat we want to see:',
    mail: 'or email',
    datos: [[yen(P.completo), 'full day for your whole group (base rate)'], ['6', 'people per price, groups of up to 14 on request'], ['3', 'languages: English, Spanish, Arabic']],
    porqueH: 'Why a private guide works for US families',
    porque: 'Kyoto is busy, signs are mostly in Japanese, and train transfers eat time. With a private guide you skip the guesswork: Tony meets you at the hotel, handles the trains and IC cards with you, picks the order that avoids the worst crowds, and changes the plan when the kids need a break.',
    preciosH: 'Prices by season (per group of up to 6, not per person)',
    preciosNota: 'The tour date decides the season. Trains, admissions and meals are paid separately as you go. Prices are in Japanese yen.',
    cols: ['Season', 'Half day (4 h)', 'Full day (8 h)', 'Day trip (from)'],
    ofreceH: 'Popular days',
    ofrece: [
      ['Kyoto classics', 'Fushimi Inari early, Kiyomizu-dera, Gion at dusk. Or Arashiyama bamboo grove and the Golden Pavilion.'],
      ['Osaka', 'Osaka Castle, Dotonbori and street food, with time for the kids to run around.'],
      ['Nara', 'The deer park and Todai-ji, an easy half day from Kyoto or Osaka.'],
      ['Muslim families', 'Halal meals and prayer times planned into the day from the start.'],
      ['Spanish-speaking families', 'Tony is a native Spanish speaker: the whole day can be in Spanish.'],
      ['All of Japan in English', 'For Tokyo, Hiroshima or multi-day trips, Mario guides English-speaking travelers anywhere in Japan.'],
    ],
    faqH: 'Questions from US travelers',
    faq: [
      ['How much does a private guide in Kyoto cost?', `One price for your whole group of up to 6 people: half day ${yen(P.medio)}, full day ${yen(P.completo)}, long day trips from ${yen(P.lejos)} (base rate). In cherry blossom season (15 March - 25 April) it is ${yen(sakura.medio)} / ${yen(sakura.completo)} / from ${yen(sakura.lejos)}.`],
      ['Can I pay from the US?', 'Yes. Pay in cash in yen on the day, or in advance with Wise, Revolut, PayPay or bank transfer once the date is confirmed on WhatsApp.'],
      ['Do I need to tip?', 'No. Tipping is not customary in Japan, and the price is the full guide fee.'],
      ['What is the time difference for planning calls?', 'Japan is 14 hours ahead of New York in winter (13 in summer) and 17 hours ahead of Los Angeles (16 in summer). WhatsApp messages are answered in Japan time.'],
      ['When should I book for cherry blossom season?', 'As early as you can. Late March and early April is the busiest time of the year in Kyoto and the first dates fill up months ahead.'],
      ['Is it OK with small kids or grandparents?', 'Yes. It is a private tour, so the pace, breaks and walking distance are set for your group.'],
      ['What is the cancellation policy?', 'Free up to 72 hours before. With less than 72 hours notice, half the price is charged.'],
    ],
    finalH: 'Tell Tony your dates',
    final: 'Send your dates, group size and hotel on WhatsApp. You get a plan and the price for your season.',
    precios: ['All prices', '/en/prices/'], inicio: ['Tony Kansai Guide', '/en/'], idiomas: 'Languages',
  },
  es: {
    title: 'Guía privado en Kioto y Osaka para viajeros de Estados Unidos | Tony Kansai Guide',
    desc: `Guía privado en español en Kioto, Osaka y Nara para familias de Estados Unidos. Un precio por grupo de hasta 6: medio día ${yen(P.medio)}, día completo ${yen(P.completo)} (tarifa base). Recogida en el hotel.`,
    kicker: 'Para viajeros de Estados Unidos · Kioto · Osaka · Nara',
    h1: 'Tu guía privado en Kioto y Osaka, en español y desde el hotel',
    sub: 'Tony Hanma es español, vive en Osaka y guía grupos privados en español, inglés y árabe. Solo tu familia, recogida en el hotel y un día pensado para tus hijos, tu ritmo y lo que quieres ver.',
    wa: 'Pregunta por tus fechas en WhatsApp', waTexto: 'Hola Tony, viajamos desde Estados Unidos.\nFechas:\nPersonas (edades de los niños):\nHotel / ciudad:\nQué queremos ver:',
    mail: 'o por correo',
    datos: [[yen(P.completo), 'día completo para todo el grupo (tarifa base)'], ['6', 'personas por precio; grupos de hasta 14 bajo petición'], ['3', 'idiomas: español, inglés y árabe']],
    porqueH: 'Por qué un guía privado para familias de EE. UU.',
    porque: 'Kioto está lleno de gente, los carteles están casi todos en japonés y los trenes hacen perder tiempo. Con un guía privado no hay que adivinar: Tony os recoge en el hotel, os ayuda con los trenes y la tarjeta IC, elige el orden para evitar las multitudes y cambia el plan cuando los niños necesitan descansar.',
    preciosH: 'Precios por temporada (por grupo de hasta 6, no por persona)',
    preciosNota: 'Cuenta la fecha del tour. Trenes, entradas y comidas se pagan aparte, sobre la marcha. Precios en yenes.',
    cols: ['Temporada', 'Medio día (4 h)', 'Día completo (8 h)', 'Excursión (desde)'],
    ofreceH: 'Días más pedidos',
    ofrece: [
      ['Kioto clásico', 'Fushimi Inari temprano, Kiyomizu-dera y Gion al atardecer. O el bosque de bambú de Arashiyama y el Pabellón Dorado.'],
      ['Osaka', 'El castillo, Dotonbori y la comida callejera, con tiempo para que los niños corran.'],
      ['Nara', 'El parque de los ciervos y Todai-ji, medio día fácil desde Kioto u Osaka.'],
      ['Familias musulmanas', 'Comidas halal y horas de oración planificadas desde el principio.'],
    ],
    faqH: 'Preguntas de viajeros de EE. UU.',
    faq: [
      ['¿Cuánto cuesta un guía privado en Kioto?', `Un precio para todo el grupo de hasta 6 personas: medio día ${yen(P.medio)}, día completo ${yen(P.completo)}, excursiones lejanas desde ${yen(P.lejos)} (tarifa base). En sakura (15 de marzo - 25 de abril): ${yen(sakura.medio)} / ${yen(sakura.completo)} / desde ${yen(sakura.lejos)}.`],
      ['¿Puedo pagar desde Estados Unidos?', 'Sí. En efectivo en yenes el mismo día, o por adelantado con Wise, Revolut, PayPay o transferencia cuando la fecha esté confirmada por WhatsApp.'],
      ['¿Hay que dejar propina?', 'No. En Japón no se da propina y el precio es el total del guía.'],
      ['¿Qué diferencia horaria hay?', 'Japón va 14 horas por delante de Nueva York y Miami en invierno (13 en verano) y 17 por delante de Los Ángeles (16 en verano).'],
      ['¿Cuándo reservar para el sakura?', 'Cuanto antes. Finales de marzo y principios de abril es la época más llena del año en Kioto.'],
      ['¿Y la cancelación?', 'Gratis hasta 72 horas antes. Con menos de 72 horas se cobra la mitad.'],
    ],
    finalH: 'Cuéntale a Tony tus fechas',
    final: 'Manda por WhatsApp las fechas, cuántos sois y el hotel. Recibes un plan y el precio de tu temporada.',
    precios: ['Todos los precios', '/es/precios/'], inicio: ['Tony Kansai Guide', '/es/'], idiomas: 'Idiomas',
  },
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const wa = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`

function tabla(lang, t) {
  const filas = TEMPORADAS_PRECIO.map((x) => {
    const f = filaTemporada(P, x.recargo)
    return `<tr><th scope="row">${esc(x.nombre[lang])}<br><small>${esc(x.fechas[lang])}</small></th><td>${yen(f.medio)}</td><td>${yen(f.completo)}</td><td>${yen(f.lejos)}</td></tr>`
  }).join('')
  return `<div class="tabla"><table><thead><tr>${t.cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${filas}</tbody></table></div>`
}

function jsonLd(lang, t) {
  const url = BASE + RUTAS_USA[lang]
  const tony = { '@id': `${BASE}/#tony` }
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Person', '@id': `${BASE}/#tony`, name: 'Tony Hanma', url: `${BASE}/${lang}/`, jobTitle: 'Private tour guide in Kansai', knowsLanguage: ['es', 'en', 'ar'], homeLocation: { '@type': 'Place', name: 'Osaka, Japan' } },
    { '@type': 'WebPage', '@id': url + '#pagina', url, name: t.title, description: t.desc, inLanguage: lang, dateModified: MODIFICADO, about: { '@id': url + '#servicio' } },
    { '@type': 'Service', '@id': url + '#servicio', name: t.h1, description: t.desc, serviceType: 'Private tour guide', provider: tony,
      areaServed: ['Kyoto', 'Osaka', 'Nara'].map((n) => ({ '@type': 'City', name: n, containedInPlace: { '@type': 'Country', name: 'Japan' } })),
      audience: { '@type': 'Audience', audienceType: 'Travelers from the United States', geographicArea: { '@type': 'Country', name: 'United States' } },
      availableLanguage: ['en', 'es', 'ar'],
      offers: TEMPORADAS_PRECIO.flatMap((x) => {
        const f = filaTemporada(P, x.recargo)
        return [['Half day (4 h)', f.medio], ['Full day (8 h)', f.completo]].map(([n, p]) => ({ '@type': 'Offer', name: `${n} · ${x.nombre.en} (${x.fechas.en})`, price: p, priceCurrency: 'JPY', eligibleQuantity: { '@type': 'QuantitativeValue', maxValue: 6, unitText: 'people per group' }, offeredBy: tony }))
      }) },
    { '@type': 'FAQPage', inLanguage: lang, mainEntity: t.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ] }
}

function pagina(lang) {
  const t = T[lang], url = BASE + RUTAS_USA[lang]
  const alt = Object.entries(RUTAS_USA).map(([l, r]) => `<link rel="alternate" hreflang="${l}" href="${BASE + r}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${BASE + RUTAS_USA.en}">`
  const mailto = `mailto:${MAIL}?subject=${encodeURIComponent(t.h1)}&body=${encodeURIComponent(t.waTexto)}`
  const btn = `<a class="btn" href="${wa(t.waTexto)}" target="_blank" rel="noopener">${esc(t.wa)}</a>`
  return `<!doctype html>
<html lang="${lang}" data-estatica="usa">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${url}">
${alt}
<meta property="og:type" content="website"><meta property="og:site_name" content="Tony Kansai Guide"><meta property="og:url" content="${url}"><meta property="og:title" content="${esc(t.h1)}"><meta property="og:description" content="${esc(t.desc)}">
<meta name="theme-color" content="#000000">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(jsonLd(lang, t)).replace(/</g, '\\u003c')}</script>
<style>${CSS}
.tabla{overflow-x:auto}.tabla table{width:100%;border-collapse:collapse;margin-top:12px}.tabla th,.tabla td{padding:12px 10px;border-bottom:1px solid rgba(255,255,255,.15);text-align:start;vertical-align:top}.tabla td{white-space:nowrap;font-variant-numeric:tabular-nums}.tabla small{opacity:.7;font-weight:400}.nota{opacity:.75;margin-top:12px}</style>
</head>
<body>
<header class="top"><div class="wrap"><a class="brand" href="${t.inicio[1]}">Tony <span>Kansai Guide</span></a></div></header>
<main>
<section class="hero"><div class="wrap"><span class="lab">${esc(t.kicker)}</span><h1>${esc(t.h1)}</h1><p class="sub">${esc(t.sub)}</p><div class="cta">${btn}<span class="m">${esc(t.mail)} <a href="${esc(mailto)}">${MAIL}</a></span></div></div></section>
<div class="wrap"><ul class="datos">${t.datos.map(([n, d]) => `<li><b>${esc(n)}</b><span>${esc(d)}</span></li>`).join('')}</ul></div>
<section class="sec"><div class="wrap"><h2>${esc(t.porqueH)}</h2><p>${esc(t.porque)}</p></div></section>
<section class="sec" id="prices"><div class="wrap"><h2>${esc(t.preciosH)}</h2>${tabla(lang, t)}<p class="nota">${esc(t.preciosNota)} <a href="${t.precios[1]}">${esc(t.precios[0])}</a></p></div></section>
<section class="sec"><div class="wrap"><h2>${esc(t.ofreceH)}</h2><div class="rej">${t.ofrece.map(([a, b]) => `<div class="card"><h3>${esc(a)}</h3><p>${esc(b)}</p></div>`).join('')}</div></div></section>
<section class="sec"><div class="wrap"><h2>${esc(t.faqH)}</h2><div class="faq">${t.faq.map(([q, a]) => `<div><h3>${esc(q)}</h3><p>${esc(a)}</p></div>`).join('')}</div></div></section>
<section class="sec"><div class="wrap"><h2>${esc(t.finalH)}</h2><p>${esc(t.final)}</p><div class="cta">${btn}</div></div></section>
</main>
<footer><div class="wrap">
<div>Tony Kansai Guide · Osaka, Japan · <a href="mailto:${MAIL}">${MAIL}</a> · <a href="${t.inicio[1]}">${esc(t.inicio[0])}</a> · <a href="${t.precios[1]}">${esc(t.precios[0])}</a></div>
<nav aria-label="${esc(t.idiomas)}">${esc(t.idiomas)}: ${Object.entries(RUTAS_USA).filter(([l]) => l !== lang).map(([l, r]) => `<a href="${r}" hreflang="${l}" lang="${l}">${NOMBRE[l]}</a>`).join(' ')}</nav>
</div></footer>
<div class="fijo">${btn}</div>
</body>
</html>
`
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const lang of Object.keys(RUTAS_USA)) {
    const dir = join(root, 'public', RUTAS_USA[lang])
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'index.html'), pagina(lang))
    console.log('ok', RUTAS_USA[lang])
  }
}
