// Página de NUEVOS DESTINOS fuera de Japón (ES / EN / AR), HTML estático y solo
// texto para Google y las IAs. Viajes que Tony coordina con operadores locales
// con licencia; Tony atiende y coordina en español, inglés y árabe.
//
// Reglas (13-11-2026):
//   · NUNCA se nombra al operador (no elusión): «operador local con licencia».
//   · Precio mostrado = precio público del operador × 1,10, redondeado HACIA
//     ARRIBA al múltiplo de 5 (la coordinación VIP de Tony). Se calcula aquí
//     desde PUBLICO; no se escribe ninguna cifra final a mano.
//   · Reserva por WhatsApp a Tony con el nombre del viaje en el mensaje.
//   · Texto halal: sin alcohol, sin vida nocturna, sin juego.
//
// Uso: node scripts/destinos.mjs → public/es/destinos/, public/en/destinations/, public/ar/destinations/
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { navHTML, pieHTML, menuCSS } from './menu-estatico.mjs'
import { equipoHTML, equipoCSS } from './equipo-estatico.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const { WA_TONY } = await import('../src/v7/contenido.ts')

const BASE = 'https://tonykansaiguide.com'
const LANGS = ['es', 'en', 'ar']
const RUTA = { es: '/es/destinos/', en: '/en/destinations/', ar: '/ar/destinations/' }
const PRECIOS = { es: '/es/precios/', en: '/en/prices/', ar: '/ar/prices/' }
const HOY = new Date().toISOString().slice(0, 10)
// Fecha en que se copiaron los precios públicos de los operadores.
const FECHA_PRECIOS = '2026-11-13'
const LKR_POR_USD = 300

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * Precio VIP = público × 1,10 redondeado hacia arriba a 5. Se hace con enteros
 * (×110 / 500) porque 3900 × 1.1 en coma flotante da 4290.000000000001 y
 * Math.ceil lo subiría a 4295.
 */
function precioVip({ importe, moneda }) {
  if (!Number.isInteger(importe) || importe <= 0) throw new Error(`destinos: precio público no válido (${importe})`)
  if (moneda === 'LKR') return { precio: Math.ceil((importe * 110) / (100 * 5 * LKR_POR_USD)) * 5, moneda: 'USD', aprox: true }
  if (moneda !== 'EUR' && moneda !== 'USD') throw new Error(`destinos: moneda «${moneda}» no prevista`)
  return { precio: Math.ceil((importe * 110) / (100 * 5)) * 5, moneda, aprox: false }
}

const LOCALE = { es: 'es-ES', en: 'en-US', ar: 'en-US' }
const dinero = (n, moneda, lang) => {
  const num = n.toLocaleString(LOCALE[lang])
  return moneda === 'EUR' ? (lang === 'es' ? `${num} €` : `€${num}`) : (lang === 'es' ? `${num} US$` : `US$${num}`)
}

// Precios públicos por persona tal como los publican los operadores (13-11-2026).
const VIAJES = [
  {
    id: 'balcanes-12-dias', pais: 'balcanes', publico: { importe: 3495, moneda: 'EUR' }, dias: 12,
    t: {
      es: { n: 'Gran ruta por los Balcanes', d: '12 días · 6 países · privado', u: 'Macedonia del Norte, Albania, Montenegro y otros países de la región, en un solo viaje privado.', base: 'por persona, en habitación doble' },
      en: { n: 'Balkans grand tour', d: '12 days · 6 countries · private', u: 'North Macedonia, Albania, Montenegro and other countries of the region, in one private trip.', base: 'per person, twin sharing' },
      ar: { n: 'الجولة الكبرى في البلقان', d: '12 يومًا · 6 دول · خاصة', u: 'مقدونيا الشمالية وألبانيا والجبل الأسود ودول أخرى في المنطقة، في رحلة خاصة واحدة.', base: 'للشخص، في غرفة مزدوجة' },
    },
  },
  {
    id: 'mostar-kravica', pais: 'bosnia', publico: { importe: 69, moneda: 'EUR' }, dias: 1,
    t: {
      es: { n: 'Mostar y las cascadas de Kravica', d: 'Excursión de un día desde Sarajevo · privada', u: 'Herzegovina: el puente de Mostar, su casco otomano y las cascadas de Kravica.', base: 'por persona' },
      en: { n: 'Mostar and Kravica waterfalls', d: 'Day trip from Sarajevo · private', u: 'Herzegovina: the Mostar bridge, its Ottoman old town and the Kravica waterfalls.', base: 'per person' },
      ar: { n: 'موستار وشلالات كرافيتسا', d: 'رحلة يوم من سراييفو · خاصة', u: 'الهرسك: جسر موستار وبلدته العثمانية القديمة وشلالات كرافيتسا.', base: 'للشخص' },
    },
  },
  {
    id: 'tunel-trebevic', pais: 'bosnia', publico: { importe: 73, moneda: 'EUR' }, dias: 1,
    t: {
      es: { n: 'Túnel de la Esperanza y teleférico del Trebević', d: 'Excursión de un día desde Sarajevo · privada', u: 'El túnel que unió Sarajevo con el exterior durante el asedio, y el teleférico al monte Trebević sobre la ciudad.', base: 'por persona' },
      en: { n: 'Tunnel of Hope and Trebević cable car', d: 'Day trip from Sarajevo · private', u: 'The tunnel that linked Sarajevo to the outside during the siege, and the cable car up Mount Trebević above the city.', base: 'per person' },
      ar: { n: 'نفق الأمل وتلفريك تريبيفيتش', d: 'رحلة يوم من سراييفو · خاصة', u: 'النفق الذي ربط سراييفو بالخارج أثناء الحصار، والتلفريك إلى جبل تريبيفيتش المطلّ على المدينة.', base: 'للشخص' },
    },
  },
  {
    id: 'estambul-capadocia-7', pais: 'turquia', publico: { importe: 2730, moneda: 'USD' }, dias: 7,
    t: {
      es: { n: 'Estambul y Capadocia', d: '7 días · privado · con vuelos internos', u: 'Estambul y Capadocia, con los vuelos dentro de Turquía incluidos.', base: 'por persona' },
      en: { n: 'Istanbul and Cappadocia', d: '7 days · private · domestic flights included', u: 'Istanbul and Cappadocia, with the flights inside Türkiye included.', base: 'per person' },
      ar: { n: 'إسطنبول وكابادوكيا', d: '7 أيام · خاصة · مع الرحلات الداخلية', u: 'إسطنبول وكابادوكيا، مع الرحلات الجوية داخل تركيا.', base: 'للشخص' },
    },
  },
  {
    id: 'turquia-clasica-10', pais: 'turquia', publico: { importe: 3900, moneda: 'USD' }, dias: 10,
    t: {
      es: { n: 'Turquía clásica', d: '10 días · privado', u: 'Estambul, Capadocia, Pamukkale y Éfeso.', base: 'por persona' },
      en: { n: 'Classic Türkiye', d: '10 days · private', u: 'Istanbul, Cappadocia, Pamukkale and Ephesus.', base: 'per person' },
      ar: { n: 'تركيا الكلاسيكية', d: '10 أيام · خاصة', u: 'إسطنبول وكابادوكيا وباموكاله وأفسس.', base: 'للشخص' },
    },
  },
  {
    id: 'turquia-oriental-9', pais: 'turquia', publico: { importe: 3510, moneda: 'USD' }, dias: 9,
    t: {
      es: { n: 'Turquía oriental', d: '9 días', u: 'Göbekli Tepe, Karahantepe, Mardin y el monte Nemrut.', base: 'por persona' },
      en: { n: 'Eastern Türkiye', d: '9 days', u: 'Göbekli Tepe, Karahantepe, Mardin and Mount Nemrut.', base: 'per person' },
      ar: { n: 'شرق تركيا', d: '9 أيام', u: 'غوبكلي تبه وكاراهان تبه وماردين وجبل نمرود.', base: 'للشخص' },
    },
  },
  {
    id: 'estambul-capadocia-3', pais: 'turquia', publico: { importe: 990, moneda: 'USD' }, dias: 3,
    t: {
      es: { n: 'Escapada Estambul → Capadocia', d: '3 días · paquete corto', u: 'De Estambul a Capadocia en tres días.', base: 'por persona' },
      en: { n: 'Istanbul → Cappadocia short break', d: '3 days · short package', u: 'From Istanbul to Cappadocia in three days.', base: 'per person' },
      ar: { n: 'رحلة قصيرة من إسطنبول إلى كابادوكيا', d: '3 أيام · باقة قصيرة', u: 'من إسطنبول إلى كابادوكيا في ثلاثة أيام.', base: 'للشخص' },
    },
  },
  {
    id: 'sri-lanka-7', pais: 'srilanka', publico: { importe: 116720, moneda: 'LKR' }, dias: 7,
    t: {
      es: { n: 'Sri Lanka', d: '7 días · privado', u: 'Una semana de viaje privado por Sri Lanka.', base: 'por persona' },
      en: { n: 'Sri Lanka', d: '7 days · private', u: 'A week-long private tour of Sri Lanka.', base: 'per person' },
      ar: { n: 'سريلانكا', d: '7 أيام · خاصة', u: 'أسبوع من الرحلة الخاصة في سريلانكا.', base: 'للشخص' },
    },
  },
].map((v) => ({ ...v, vip: precioVip(v.publico) }))

const PAISES = {
  balcanes: {
    es: { n: 'Balcanes', nota: 'Una ruta larga por varios países de la región, en privado.' },
    en: { n: 'The Balkans', nota: 'One long private route through several countries of the region.' },
    ar: { n: 'البلقان', nota: 'مسار طويل وخاص عبر عدة دول في المنطقة.' },
  },
  bosnia: {
    es: { n: 'Bosnia y Herzegovina', nota: 'País de mayoría musulmana: la comida halal se encuentra fácil en todas partes. Cascos otomanos como Baščaršija en Sarajevo y el puente de Mostar. Guías en árabe y en español disponibles bajo petición.' },
    en: { n: 'Bosnia and Herzegovina', nota: 'A Muslim-majority country: halal food is easy to find everywhere. Ottoman old towns such as Baščaršija in Sarajevo and the Mostar bridge. Guides in Arabic and Spanish available on request.' },
    ar: { n: 'البوسنة والهرسك', nota: 'بلد ذو أغلبية مسلمة: الطعام الحلال متوفر بسهولة في كل مكان. بلدات عثمانية قديمة مثل باشتشارشيا في سراييفو وجسر موستار. مرشدون بالعربية والإسبانية عند الطلب.' },
  },
  turquia: {
    es: { n: 'Turquía', nota: 'Los paquetes incluyen comidas y cenas, y lo normal es que la comida sea halal.' },
    en: { n: 'Türkiye', nota: 'Lunches and dinners are included in the packages, and halal food is the norm.' },
    ar: { n: 'تركيا', nota: 'الغداء والعشاء مشمولان في الباقات، والطعام الحلال هو القاعدة.' },
  },
  srilanka: {
    es: { n: 'Sri Lanka', nota: 'Comidas halal y coordinación en árabe disponibles.' },
    en: { n: 'Sri Lanka', nota: 'Halal meals and Arabic-speaking coordination available.' },
    ar: { n: 'سريلانكا', nota: 'وجبات حلال وتنسيق باللغة العربية متاحان.' },
  },
}
const ORDEN_PAISES = ['bosnia', 'turquia', 'balcanes', 'srilanka']

const T = {
  es: {
    title: 'Nuevos destinos: Bosnia, Turquía, Balcanes y Sri Lanka, con precios | Tony Kansai Guide',
    ceja: 'Viajes fuera de Japón · precios por persona',
    h1: 'Nuevos destinos con Tony',
    respuesta: 'Viajes privados que organiza un operador local con licencia en cada país, y que Tony coordina contigo en español, inglés o árabe: Bosnia y Herzegovina, Turquía, los Balcanes y Sri Lanka. Precios por persona; los vuelos internacionales no están incluidos.',
    desde: 'desde', aprox: 'aprox.', indice: 'Destinos',
    reservar: 'Reservar por WhatsApp', msg: (n) => `Hola, Tony. Me interesa el viaje «${n}» de la página de destinos.`,
    reglaT: 'Cómo funciona',
    regla: [
      ['Lo organiza', 'Un operador local con licencia en cada país.'],
      ['Te atiende', 'Tony, en español, inglés o árabe, de la primera pregunta al regreso.'],
      ['No incluye', 'Los vuelos internacionales, salvo que se diga lo contrario.'],
    ],
    lkr: (usd) => `Precio de referencia convertido de rupias de Sri Lanka a ${LKR_POR_USD} LKR por dólar; el importe final puede variar con el cambio.`,
    actualizado: (f) => `Precios revisados el ${f}. Pueden cambiar según fechas y temporada; Tony te confirma el precio cerrado antes de reservar.`,
    faqH: 'Preguntas',
    faq: [
      ['¿Qué incluye el precio?', 'Lo que pone en cada viaje. Todos son privados salvo que se indique; en Turquía los paquetes incluyen comidas y cenas, y el de 7 días incluye los vuelos internos. Los vuelos internacionales no están incluidos. Antes de reservar, Tony te manda el itinerario y la lista completa de lo incluido.'],
      ['¿Cómo se reserva?', 'Escribe a Tony por WhatsApp (+34 634 193 106) con el viaje, las fechas y cuántos sois. Te confirma disponibilidad y precio cerrado, y te explica el pago.'],
      ['¿Hay comida halal?', 'Sí. En Bosnia y Herzegovina y en Turquía la comida halal es lo normal; en Sri Lanka hay comidas halal disponibles. En el resto de rutas, dile a Tony lo que necesitas y lo consulta antes de reservar.'],
      ['¿Quién organiza el viaje?', 'Un operador local con licencia en cada país. Tony lo coordina contigo en tu idioma (español, inglés o árabe) y es tu contacto durante todo el viaje.'],
    ],
    ctaH: '¿Te interesa alguno?', ctaP: 'Dime el viaje, las fechas y cuántos sois, y te contesto con el precio cerrado.', ctaB: 'Escribir por WhatsApp',
    msgGeneral: 'Hola, Tony. Vengo de la página de nuevos destinos.',
    nav: { etiqueta: 'Secciones', abrir: 'Abrir menú', g1: 'Destinos', g2: 'Japón', g3: 'Más', cta: 'WhatsApp', japon: [['Precios en Japón', PRECIOS.es], ['Rutas por ciudad', '/es/rutas/'], ['Montaña', '/es/montana/']], mas: [['Página de Tony', '/es/'], ['Ventajas para tu viaje', '/es/ventajas/']] },
    pie: { intro: 'Tony Hanma es guía privado en español, inglés y árabe en Kansai, y coordina viajes fuera de Japón con operadores locales con licencia.', c1: 'Japón', c2: 'Contacto', act: 'Actualizado', mas: 'Ver todo' },
  },
  en: {
    title: 'New destinations: Bosnia, Türkiye, the Balkans and Sri Lanka, with prices | Tony Kansai Guide',
    ceja: 'Trips beyond Japan · prices per person',
    h1: 'New destinations with Tony',
    respuesta: 'Private trips run by a licensed local partner operator in each country, coordinated with you by Tony in English, Spanish or Arabic: Bosnia and Herzegovina, Türkiye, the Balkans and Sri Lanka. Prices per person; international flights are not included.',
    desde: 'from', aprox: 'approx.', indice: 'Destinations',
    reservar: 'Book on WhatsApp', msg: (n) => `Hi Tony, I’m interested in the “${n}” trip from the destinations page.`,
    reglaT: 'How it works',
    regla: [
      ['Run by', 'A licensed local partner operator in each country.'],
      ['Your contact', 'Tony, in English, Spanish or Arabic, from the first question until you are home.'],
      ['Not included', 'International flights, unless stated otherwise.'],
    ],
    lkr: () => `Reference price converted from Sri Lankan rupees at ${LKR_POR_USD} LKR per US dollar; the final amount may vary with the exchange rate.`,
    actualizado: (f) => `Prices checked on ${f}. They may change with dates and season; Tony confirms one fixed price before you book.`,
    faqH: 'Questions',
    faq: [
      ['What does the price include?', 'What each trip lists. All are private unless stated; in Türkiye the packages include lunches and dinners, and the 7-day trip includes domestic flights. International flights are not included. Before you book, Tony sends you the itinerary and the full list of inclusions.'],
      ['How do I book?', 'Message Tony on WhatsApp (+34 634 193 106) with the trip, your dates and group size. He confirms availability and a fixed price, and explains how to pay.'],
      ['Is there halal food?', 'Yes. In Bosnia and Herzegovina and in Türkiye halal food is the norm; in Sri Lanka halal meals are available. For the other routes, tell Tony what you need and he checks before you book.'],
      ['Who runs the trip?', 'A licensed local operator in each country. Tony coordinates it with you in your language (English, Spanish or Arabic) and is your contact for the whole trip.'],
    ],
    ctaH: 'Interested in one of them?', ctaP: 'Tell me the trip, your dates and group size, and I’ll reply with a fixed price.', ctaB: 'Message on WhatsApp',
    msgGeneral: 'Hi Tony, I’m coming from the new destinations page.',
    nav: { etiqueta: 'Sections', abrir: 'Open menu', g1: 'Destinations', g2: 'Japan', g3: 'More', cta: 'WhatsApp', japon: [['Prices in Japan', PRECIOS.en], ['Routes by city', '/en/routes/'], ['Hiking', '/en/hiking/']], mas: [['Tony’s page', '/en/'], ['Perks for your trip', '/en/perks/']] },
    pie: { intro: 'Tony Hanma is a private guide in English, Spanish and Arabic in Kansai, and coordinates trips beyond Japan with licensed local partner operators.', c1: 'Japan', c2: 'Contact', act: 'Updated', mas: 'See all' },
  },
  ar: {
    title: 'وجهات جديدة: البوسنة وتركيا والبلقان وسريلانكا، مع الأسعار | Tony Kansai Guide',
    ceja: 'رحلات خارج اليابان · الأسعار للشخص',
    h1: 'وجهات جديدة مع طوني',
    respuesta: 'رحلات خاصة ينظّمها مشغّل محلي مرخّص في كل بلد، ويتولّى طوني التنسيق معكم بالعربية أو الإنجليزية أو الإسبانية: البوسنة والهرسك وتركيا والبلقان وسريلانكا. الأسعار للشخص، والرحلات الجوية الدولية غير مشمولة.',
    desde: 'ابتداءً من', aprox: 'تقريبًا', indice: 'الوجهات',
    reservar: 'احجز عبر واتساب', msg: (n) => `مرحبًا طوني، أنا مهتم برحلة «${n}» من صفحة الوجهات.`,
    reglaT: 'كيف تعمل',
    regla: [
      ['المنظِّم', 'مشغّل محلي مرخّص في كل بلد.'],
      ['جهة تواصلكم', 'طوني، بالعربية أو الإنجليزية أو الإسبانية، من أول سؤال حتى العودة.'],
      ['غير مشمول', 'الرحلات الجوية الدولية، ما لم يُذكر خلاف ذلك.'],
    ],
    lkr: () => `سعر مرجعي محوَّل من الروبية السريلانكية بسعر ${LKR_POR_USD} روبية للدولار؛ وقد يتغيّر المبلغ النهائي مع سعر الصرف.`,
    actualizado: (f) => `رُوجعت الأسعار في ${f}. قد تتغيّر حسب التواريخ والموسم، ويؤكّد لكم طوني سعرًا ثابتًا قبل الحجز.`,
    faqH: 'أسئلة',
    faq: [
      ['ماذا يشمل السعر؟', 'ما هو مذكور في كل رحلة. كل الرحلات خاصة ما لم يُذكر غير ذلك؛ وفي تركيا تشمل الباقات الغداء والعشاء، وتشمل رحلة الأيام السبعة الرحلات الداخلية. الرحلات الجوية الدولية غير مشمولة. قبل الحجز يرسل لكم طوني البرنامج والقائمة الكاملة لما هو مشمول.'],
      ['كيف أحجز؟', 'راسلوا طوني على واتساب (+34 634 193 106) باسم الرحلة والتواريخ وعددكم. يؤكّد لكم التوفّر وسعرًا ثابتًا ويشرح طريقة الدفع.'],
      ['هل يتوفر طعام حلال؟', 'نعم. في البوسنة والهرسك وتركيا الطعام الحلال هو القاعدة، وفي سريلانكا تتوفر وجبات حلال. وفي المسارات الأخرى أخبروا طوني بما تحتاجونه ليتحقق قبل الحجز.'],
      ['من ينظّم الرحلة؟', 'مشغّل محلي مرخّص في كل بلد. ويتولّى طوني التنسيق معكم بلغتكم (العربية أو الإنجليزية أو الإسبانية) ويبقى جهة تواصلكم طوال الرحلة.'],
    ],
    ctaH: 'هل تهمّكم إحدى هذه الرحلات؟', ctaP: 'أخبروني بالرحلة والتواريخ وعددكم، وأردّ عليكم بسعر ثابت.', ctaB: 'راسلني على واتساب',
    msgGeneral: 'مرحبًا طوني، جئت من صفحة الوجهات الجديدة.',
    nav: { etiqueta: 'الأقسام', abrir: 'افتح القائمة', g1: 'الوجهات', g2: 'اليابان', g3: 'المزيد', cta: 'واتساب', japon: [['الأسعار في اليابان', PRECIOS.ar], ['المسارات حسب المدينة', '/ar/routes/'], ['الجبال', '/ar/hiking/']], mas: [['صفحة طوني', '/ar/'], ['مزايا لرحلتك', '/ar/perks/']] },
    pie: { intro: 'طوني هانما مرشد خاص بالعربية والإسبانية والإنجليزية في كانساي، وينسّق رحلات خارج اليابان مع مشغّلين محليين مرخّصين.', c1: 'اليابان', c2: 'التواصل', act: 'آخر تحديث', mas: 'عرض الكل' },
  },
}

for (const l of LANGS) {
  for (const v of VIAJES) if (!v.t[l]) throw new Error(`destinos: falta el texto ${l} del viaje «${v.id}»`)
  for (const p of ORDEN_PAISES) if (!PAISES[p][l]) throw new Error(`destinos: falta el texto ${l} del país «${p}»`)
}

const wa = (msg) => `https://wa.me/${WA_TONY}?text=${encodeURIComponent(msg)}`
const flecha = (lang) => (lang === 'ar' ? '←' : '→')

function pagina(lang) {
  const t = T[lang]
  const rtl = lang === 'ar'
  const url = BASE + RUTA[lang]
  const precio = (v) => `<bdi dir="ltr">${dinero(v.vip.precio, v.vip.moneda, lang)}</bdi>`

  const tarjeta = (v) => {
    const tx = v.t[lang]
    return `<li class="tf-f" id="${v.id}">
<div class="tf-q"><h3>${esc(tx.n)}</h3><p class="tf-d">${esc(tx.d)}</p><p class="tf-u">${esc(tx.u)}</p>${v.vip.aprox ? `<p class="tf-x">${esc(t.lkr())}</p>` : ''}
<a class="tf-l" href="${esc(wa(t.msg(tx.n)))}" rel="noopener">${esc(t.reservar)} <span aria-hidden="true">${flecha(lang)}</span></a></div>
<div class="tf-p"><small>${esc(t.desde)}${v.vip.aprox ? ` · ${esc(t.aprox)}` : ''}</small><b>${precio(v)}</b><span>${esc(tx.base)}</span></div>
</li>`
  }

  const paisesHTML = ORDEN_PAISES.map((p) => {
    const pt = PAISES[p][lang]
    return `<section class="bloque" id="${p}"><div class="kap">
<h2>${esc(pt.n)}</h2><p class="sub">${esc(pt.nota)}</p>
<ol class="tf">${VIAJES.filter((v) => v.pais === p).map(tarjeta).join('')}</ol>
</div></section>`
  }).join('\n')

  const tony = { '@id': `${BASE}/#tony` }
  const desc = t.respuesta.slice(0, 300)
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Person', '@id': `${BASE}/#tony`, name: 'Tony Hanma', url: `${BASE}/${lang}/`, knowsLanguage: ['es', 'en', 'ar'] },
      { '@type': 'WebPage', '@id': `${url}#pagina`, url, name: t.title, description: desc, inLanguage: lang, dateModified: HOY, about: tony, mainEntity: { '@id': `${url}#viajes` } },
      {
        '@type': 'ItemList', '@id': `${url}#viajes`, name: t.h1, description: desc,
        itemListElement: VIAJES.map((v, i) => ({
          '@type': 'ListItem', position: i + 1,
          item: {
            '@type': 'TouristTrip', '@id': `${url}#${v.id}`, name: v.t[lang].n, description: `${v.t[lang].d}. ${v.t[lang].u} ${PAISES[v.pais][lang].nota}`,
            url: `${url}#${v.id}`, inLanguage: lang, provider: tony,
            offers: {
              '@type': 'Offer', price: v.vip.precio, priceCurrency: v.vip.moneda, url: `${url}#${v.id}`, availability: 'https://schema.org/InStock', offeredBy: tony,
              priceSpecification: { '@type': 'UnitPriceSpecification', minPrice: v.vip.precio, price: v.vip.precio, priceCurrency: v.vip.moneda, referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitText: 'person' } },
            },
          },
        })),
      },
      { '@type': 'FAQPage', '@id': `${url}#preguntas`, inLanguage: lang, mainEntity: t.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Tony Kansai Guide', item: `${BASE}/${lang}/` }, { '@type': 'ListItem', position: 2, name: t.nav.g1, item: url }] },
    ],
  }

  const fuentes = rtl
    ? 'family=IBM+Plex+Sans+Arabic:wght@400;500;600;700'
    : 'family=Geist:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600'
  const idiomas = LANGS.filter((l) => l !== lang).map((l) => ({ t: l === 'ar' ? 'العربية' : l === 'es' ? 'Español' : 'English', h: RUTA[l], hreflang: l, lang: l }))

  return `<!doctype html>
<html lang="${lang}" dir="${rtl ? 'rtl' : 'ltr'}" data-estatica="destinos">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#f3eee4">
<link rel="canonical" href="${url}">
${LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${BASE}${RUTA[l]}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${BASE}${RUTA.en}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Tony Kansai Guide">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(desc)}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fuentes}&display=swap">
<style>${CSS}${menuCSS}${equipoCSS}</style>
</head>
<body>
<a class="saltar" href="#${ORDEN_PAISES[0]}">${esc(t.indice)}</a>
<header class="top"><div class="kap"><a class="marca" href="/${lang}/"><span aria-hidden="true">⛩</span> Tony Kansai Guide</a>
${navHTML({ etiqueta: t.nav.etiqueta, abrir: t.nav.abrir, grupos: [
  { t: t.nav.g1, enlaces: ORDEN_PAISES.map((p) => [esc(PAISES[p][lang].n), `#${p}`]) },
  { t: t.nav.g2, enlaces: t.nav.japon.map(([n, h]) => [esc(n), h]) },
  { t: t.nav.g3, enlaces: [...t.nav.mas.map(([n, h]) => [esc(n), h]), ...idiomas] },
], cta: { t: t.nav.cta, h: wa(t.msgGeneral) } })}</div></header>
<main>
<section class="heroe"><div class="kap">
<p class="ceja">${esc(t.ceja)}</p>
<h1>${esc(t.h1)}</h1>
<p class="respuesta">${esc(t.respuesta)}</p>
<ul class="resumen" aria-label="${esc(t.indice)}">${VIAJES.map((v) => `<li><a href="#${v.id}"><span>${esc(v.t[lang].n)} · ${esc(v.t[lang].d.split(' · ')[0])}</span><b><small>${esc(t.desde)}</small> ${precio(v)}</b></a></li>`).join('')}</ul>
</div></section>

<section class="regla" aria-label="${esc(t.reglaT)}"><div class="kap regla-k">
${t.regla.map(([h, p]) => `<div><h2>${esc(h)}</h2><p>${esc(p)}</p></div>`).join('')}
</div></section>

<nav class="indice" aria-label="${esc(t.indice)}"><div class="kap"><ul>${ORDEN_PAISES.map((p) => `<li><a href="#${p}">${esc(PAISES[p][lang].n)}</a></li>`).join('')}<li><a href="#preguntas">${esc(t.faqH)}</a></li></ul></div></nav>

${paisesHTML}

<section class="bloque bloque-claro" id="preguntas"><div class="kap estrecho">
<h2>${esc(t.faqH)}</h2>
${t.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}
<p class="nota">${esc(t.actualizado(FECHA_PRECIOS))}</p>
</div></section>

<section class="cierre"><div class="kap">
<h2>${esc(t.ctaH)}</h2><p>${esc(t.ctaP)}</p>
<a class="btn" href="${esc(wa(t.msgGeneral))}" rel="noopener">${esc(t.ctaB)} <span aria-hidden="true">${flecha(lang)}</span></a>
</div></section>
</main>
<footer>${pieHTML({ mas: t.pie.mas,
  intro: `<p>${esc(t.pie.intro)}</p>`,
  columnas: [
    { t: t.pie.c1, enlaces: t.nav.japon.map(([n, h]) => [esc(n), h]) },
    { t: t.nav.g3, enlaces: t.nav.mas.map(([n, h]) => [esc(n), h]) },
    { t: t.pie.c2, fija: true, html: `<p>WhatsApp: <a href="${esc(wa(t.msgGeneral))}"><bdi dir="ltr">+34 634 193 106</bdi></a></p><p><a href="mailto:tony@tonykansaiguide.com">tony@tonykansaiguide.com</a></p>` },
  ],
  equipo: equipoHTML({ lang, actual: 'tony' }),
  fin: `<span>© Tony Kansai Guide</span><span>${esc(t.pie.act)}: <bdi dir="ltr">${HOY}</bdi></span>`,
})}</footer>
</body>
</html>
`
}

// Mismo papel y tinta que la página de precios (scripts/precios.mjs), solo texto.
const CSS = `
:root{--papel:#f3eee4;--papel2:#ebe4d6;--tarjeta:#fbf8f2;--tinta:#1d1b18;--gris:#5c574f;--linea:rgba(29,27,24,.14);--acento:#b8381f;--acento-t:#fff;
--mn-tarjeta:#fbf8f2;--mn-texto:#1d1b18;--mn-linea:rgba(29,27,24,.18);--mn-suave:#ebe4d6;--mn-acento:#b8381f;
--sans:'Geist',system-ui,-apple-system,'Segoe UI',sans-serif;--serif:'Source Serif 4',Georgia,serif;--r:14px}
html[dir=rtl]{--sans:'IBM Plex Sans Arabic',system-ui,sans-serif;--serif:'IBM Plex Sans Arabic',system-ui,sans-serif}
*{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{margin:0;background:var(--papel);color:var(--tinta);font:400 16px/1.6 var(--sans);overflow-x:hidden}
a{color:inherit;text-underline-offset:3px}
h1,h2,h3{font-family:var(--serif);font-weight:600;line-height:1.12;margin:0;text-wrap:balance;letter-spacing:-.01em}
html[dir=rtl] h1,html[dir=rtl] h2,html[dir=rtl] h3{letter-spacing:0;line-height:1.35;font-weight:700}
p{margin:0}
[dir=ltr]{unicode-bidi:isolate}
bdi,.tf-p b,.resumen b{font-variant-numeric:tabular-nums}
.kap{max-width:1120px;margin:0 auto;padding:0 16px}
@media (min-width:720px){.kap{padding:0 28px}}
.saltar{position:absolute;top:8px;inset-inline-start:16px;z-index:100;background:var(--tarjeta);padding:8px 12px;border-radius:8px;clip-path:inset(50%);width:1px;height:1px;overflow:hidden;white-space:nowrap}.saltar:focus{clip-path:none;width:auto;height:auto}
:focus-visible{outline:2px solid var(--acento);outline-offset:2px}
.top{position:sticky;top:0;z-index:50;background:color-mix(in srgb,var(--papel) 92%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--linea)}
.top .kap{display:flex;align-items:center;gap:12px;min-height:60px}
.marca{font:600 17px/1 var(--sans);text-decoration:none;white-space:nowrap;display:flex;gap:8px;align-items:center}
.marca span{color:var(--acento)}
@media (max-width:420px){.marca{font-size:15px}}
.heroe{padding:28px 0 36px}
@media (min-width:960px){.heroe{padding:56px 0 64px}}
.ceja{font:600 12px/1.2 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--acento);margin-bottom:12px}
html[dir=rtl] .ceja{letter-spacing:0;font-size:14px}
h1{font-size:clamp(34px,7.4vw,64px)}
.respuesta{margin-top:16px;font-size:17px;line-height:1.65;color:var(--gris);max-width:68ch}
.resumen{list-style:none;margin:24px 0 0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
@media (min-width:720px){.resumen{grid-template-columns:repeat(4,minmax(0,1fr))}}
.resumen a{display:flex;flex-direction:column;justify-content:space-between;gap:6px;height:100%;padding:12px 14px;border:1px solid var(--linea);border-radius:12px;background:var(--tarjeta);text-decoration:none;transition:border-color .2s}
.resumen a:hover{border-color:var(--tinta)}
.resumen span{font-size:13px;color:var(--gris);line-height:1.3}
.resumen b{font-size:20px;font-weight:600;letter-spacing:-.01em}
.resumen small{font-size:12px;font-weight:500;color:var(--gris)}
.regla{background:var(--tinta);color:var(--papel)}
.regla-k{display:grid;gap:0;padding-top:4px;padding-bottom:4px}
@media (min-width:720px){.regla-k{grid-template-columns:repeat(3,1fr)}}
.regla-k>div{padding:20px 0}
.regla-k>div+div{border-top:1px solid rgba(243,238,228,.2)}
@media (min-width:720px){.regla-k>div{padding:28px 0}.regla-k>div+div{border-top:0;border-inline-start:1px solid rgba(243,238,228,.2);padding-inline-start:28px}}
.regla h2{font-size:clamp(20px,2.8vw,26px);margin-bottom:6px;color:#f0a48f}
.regla p{color:rgba(243,238,228,.82);max-width:46ch}
.indice{position:sticky;top:60px;z-index:40;background:var(--papel);border-bottom:1px solid var(--linea)}
.indice ul{list-style:none;margin:0;padding:10px 0;display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}
.indice ul::-webkit-scrollbar{display:none}
.indice a{display:inline-flex;align-items:center;min-height:36px;padding:0 14px;border-radius:999px;border:1px solid var(--linea);text-decoration:none;font-size:14px;white-space:nowrap;background:var(--tarjeta)}
.indice a:hover{border-color:var(--tinta)}
.bloque{padding:44px 0;scroll-margin-top:112px}
@media (min-width:720px){.bloque{padding:64px 0}}
.bloque+.bloque:not(.bloque-claro){border-top:1px solid var(--linea)}
.bloque-claro{background:var(--papel2)}
.bloque>.kap>h2{font-size:clamp(28px,5vw,44px)}
.sub{color:var(--gris);margin:10px 0 24px;max-width:68ch;font-size:16.5px}
.estrecho{max-width:820px}
.tf{list-style:none;margin:0;padding:0;border-top:2px solid var(--tinta)}
.tf-f{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px 20px;padding:22px 0;border-bottom:1px solid var(--linea);scroll-margin-top:120px}
.tf-q h3{font-size:clamp(21px,3vw,27px)}
.tf-d{font-weight:600;font-size:14px;margin-top:4px}
.tf-u{color:var(--gris);margin-top:4px;max-width:60ch}
.tf-x{color:var(--gris);font-size:13px;margin-top:6px;max-width:60ch}
.tf-l{display:inline-flex;align-items:center;gap:6px;margin-top:10px;font-weight:600;font-size:15px;min-height:44px;color:var(--acento)}
.tf-p{text-align:end;display:flex;flex-direction:column;align-items:flex-end;gap:2px}
.tf-p small{font-size:13px;color:var(--gris)}
.tf-p b{font-family:var(--sans);font-size:clamp(26px,4.4vw,38px);font-weight:600;letter-spacing:-.02em;line-height:1;white-space:nowrap}
.tf-p span{font-size:13px;color:var(--gris)}
@media (max-width:519px){.tf-f{grid-template-columns:1fr}.tf-p{order:-1;text-align:start;flex-direction:row;flex-wrap:wrap;align-items:baseline;gap:4px 10px;margin:4px 0}.tf-q{order:0}}
#preguntas details{border-top:1px solid var(--linea);padding:4px 0}
#preguntas details:last-of-type{border-bottom:1px solid var(--linea)}
#preguntas summary{cursor:pointer;font-weight:600;font-size:17px;min-height:52px;display:flex;align-items:center;list-style:none;gap:12px;justify-content:space-between}
#preguntas summary::-webkit-details-marker{display:none}
#preguntas summary::after{content:"+";font-size:22px;color:var(--acento);flex:none}
#preguntas details[open] summary::after{content:"−"}
#preguntas details p{color:var(--gris);padding:0 0 16px;max-width:68ch}
#preguntas h2{margin-bottom:20px}
.nota{margin-top:20px!important;font-size:14px;color:var(--gris)}
.cierre{padding:64px 0;background:var(--tinta);color:var(--papel);text-align:center}
.cierre h2{font-size:clamp(28px,5vw,44px)}
.cierre p{color:rgba(243,238,228,.8);margin:10px auto 24px;max-width:48ch}
.btn{display:inline-flex;align-items:center;gap:10px;min-height:52px;padding:0 26px;border-radius:999px;background:var(--acento);color:var(--acento-t);font-weight:600;font-size:17px;text-decoration:none;transition:transform .15s}
.btn:active{transform:scale(.97)}
footer{background:var(--papel2);padding-top:48px;color:var(--tinta)}
`.replace(/\s*\n\s*/g, '')

for (const lang of LANGS) {
  const dir = join(root, 'public', RUTA[lang])
  mkdirSync(dir, { recursive: true })
  const html = pagina(lang)
  writeFileSync(join(dir, 'index.html'), html)
  console.log(`destinos: ${RUTA[lang]} (${Math.round(html.length / 1024)} KB)`)
}
console.log(`destinos: ${VIAJES.map((v) => `${v.id}=${v.vip.precio} ${v.vip.moneda}`).join(', ')}`)
