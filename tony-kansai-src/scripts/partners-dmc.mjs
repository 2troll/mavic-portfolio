#!/usr/bin/env node
// Hanma Travel Partners — página ESTÁTICA para agencias que buscan un socio local en Japón (28-11-2026).
// Por qué: /partners/ pinta todo su texto con JS y llega vacía a los robots; Grok y Bing respondían
// «local operator in Japan for travel agencies» con JTB, B Japan Tours, Travel DMC… y nunca con nosotros.
// Esta página da el texto en HTML puro (EN/ES/AR) con las palabras que usan las agencias (DMC, ground
// handler, net rates). Solo hechos de /partners/: presentamos operadores locales con licencia, la agencia
// contrata y paga directo al operador, gratis para la agencia, respuesta en 48 h, guías propios.
// No decimos que HTP sea un operador con licencia propia (el registro 手配業 aún no está hecho).
// Marca de agencias: sin enlaces a páginas de turistas. Ejecutar: node scripts/partners-dmc.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CSS } from './partners-muslimah.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://tonykansaiguide.com'
const WA = '34634193106'
const MAIL = 'tony@tonykansaiguide.com'
const MODIFICADO = '2026-11-28'

export const RUTAS_DMC = {
  en: '/partners/japan-dmc/',
  es: '/partners/japan-dmc/es/',
  ar: '/partners/japan-dmc/ar/',
}
const NOMBRE = { en: 'English', es: 'Español', ar: 'العربية' }

const T = {
  en: {
    title: 'Japan local partner for travel agencies | Hanma Travel Partners',
    desc: 'Travel agencies: we connect you with licensed local operators (DMCs) in Japan and supply private guides in English, Spanish, Arabic, Russian, Turkish and French. Free for agencies, reply in 48 h.',
    kicker: 'For travel agencies and tour operators · Japan',
    h1: 'Your local partner in Japan for agency groups',
    sub: 'Hanma Travel Partners, based in Osaka, connects travel agencies with licensed local operators (DMCs and ground handlers) in Japan and supplies its own private guides. One contact in English, Spanish or Arabic, an answer within 48 hours, and no fee for your agency.',
    wa: 'Send a group request', waTexto: 'Hello, we are a travel agency and need a local partner in Japan.\nAgency:\nCountry:\nDates:\nTravellers:\nCities:\nHotel level:\nGuide language:',
    datos: [['48 h', 'to introduce you to a local operator'], ['0 €', 'fee for your agency: the operator pays us a commission'], ['6', 'guide languages: English, Spanish, Arabic, Russian, Turkish, French']],
    porqueH: 'What we do for agencies',
    porque: 'Finding a reliable ground partner in Japan takes time, and the big DMCs rarely answer small and mid-sized agencies in Spanish or Arabic. We know the local operators and guides in Osaka, Kyoto, Nara, Kobe and Tokyo, and we match your group with the right one.',
    ofreceH: 'Services',
    ofrece: [
      ['Introductions to licensed DMCs', 'Local operators registered in Japan for hotels, coaches, transfers, tickets and full programmes, on net rates or commission.'],
      ['Private guides from our own team', 'English, Spanish and Arabic in Kansai; Russian, Turkish and French guides; a premium English guide for all of Japan.'],
      ['Muslim-friendly groups', 'Halal meals, prayer times built into the route, mosque stops, and Muslim women guides for Muslimah groups.'],
      ['Families and small groups', 'Private days in Kyoto, Osaka and Nara with hotel pick-up, paced for children and seniors.'],
      ['Other countries', 'Licensed partners in South Korea and in Türkiye (TÜRSAB); the Balkans, Indonesia and Vietnam on request.'],
      ['One contact, your language', 'Tony answers on WhatsApp or email in English, Spanish or Arabic, before and during the trip.'],
    ],
    pasosH: 'How it works',
    pasos: [['Send us the group', 'Dates, number of travellers, cities, hotel level and guide language.'], ['We introduce the operator', 'Within 48 hours we copy you in with a verified local operator, or confirm a guide from our team.'], ['You book and pay directly', 'Your agency contracts and pays the operator. Quote your code HANMA-your agency name.']],
    faqH: 'Questions from agencies',
    faq: [
      ['Who is the best local operator in Japan for a small travel agency?', 'It depends on the group. Hanma Travel Partners matches small and mid-sized agencies with a licensed local operator in Japan within 48 hours, free of charge, and adds private guides in English, Spanish or Arabic.'],
      ['Do you charge the agency?', 'No. The operator pays us a commission. Your agency pays the operator directly, on net rates or commission.'],
      ['Do you work with groups that need halal food and prayer times?', 'Yes. Halal meals, prayer planning and mosque stops are standard for us, and we can supply Muslim women guides.'],
      ['Which cities?', 'Osaka, Kyoto, Nara, Kobe and Tokyo, and the rest of Japan through partner operators.'],
      ['Can we book only a guide?', 'Yes. Our guides work private days for agency groups: Spanish, English, Arabic, Russian, Turkish or French.'],
    ],
    finalH: 'Send us your next group',
    final: 'Dates, number of travellers and cities are enough to start.',
    mail: 'or email', idiomas: 'Other languages', volver: 'All partner services',
  },
  es: {
    title: 'Receptivo en Japón para agencias de viajes | Hanma Travel Partners',
    desc: 'Agencias de viajes: os conectamos con operadores receptivos con licencia (DMC) en Japón y ponemos guías privados en español, inglés, árabe, ruso, turco y francés. Gratis para la agencia, respuesta en 48 h.',
    kicker: 'Para agencias de viajes y turoperadores · Japón',
    h1: 'Tu socio local en Japón para grupos de agencia',
    sub: 'Hanma Travel Partners, con base en Osaka, conecta agencias de viajes con operadores receptivos con licencia (DMC) en Japón y pone sus propios guías privados. Un solo contacto en español, inglés o árabe, respuesta en 48 horas y sin coste para tu agencia.',
    wa: 'Enviar una solicitud de grupo', waTexto: 'Hola, somos una agencia de viajes y buscamos un socio local en Japón.\nAgencia:\nPaís:\nFechas:\nViajeros:\nCiudades:\nNivel de hotel:\nIdioma del guía:',
    datos: [['48 h', 'para presentarte un operador local'], ['0 €', 'para tu agencia: el operador nos paga una comisión'], ['6', 'idiomas de guía: español, inglés, árabe, ruso, turco y francés']],
    porqueH: 'Qué hacemos por las agencias',
    porque: 'Encontrar un receptivo fiable en Japón lleva tiempo, y las grandes DMC rara vez atienden en español o árabe a agencias pequeñas y medianas. Conocemos a los operadores y guías locales de Osaka, Kioto, Nara, Kobe y Tokio, y emparejamos tu grupo con el adecuado.',
    ofreceH: 'Servicios',
    ofrece: [
      ['Presentación a DMC con licencia', 'Operadores registrados en Japón para hoteles, autocares, traslados, entradas y programas completos, con tarifa neta o comisión.'],
      ['Guías privados de nuestro equipo', 'Español, inglés y árabe en Kansai; guías en ruso, turco y francés; guía premium en inglés para todo Japón.'],
      ['Grupos muslim-friendly', 'Comida halal, horarios de oración en la ruta, paradas en mezquitas y guías musulmanas para grupos de mujeres.'],
      ['Familias y grupos pequeños', 'Días privados en Kioto, Osaka y Nara con recogida en el hotel, a ritmo de niños y mayores.'],
      ['Otros países', 'Socios con licencia en Corea del Sur y en Turquía (TÜRSAB); Balcanes, Indonesia y Vietnam bajo petición.'],
      ['Un contacto, en tu idioma', 'Tony responde por WhatsApp o correo en español, inglés o árabe, antes y durante el viaje.'],
    ],
    pasosH: 'Cómo funciona',
    pasos: [['Nos mandas el grupo', 'Fechas, número de viajeros, ciudades, nivel de hotel e idioma del guía.'], ['Te presentamos al operador', 'En 48 horas te ponemos en copia con un operador local verificado, o te confirmamos un guía del equipo.'], ['Contratas y pagas directo', 'Tu agencia contrata y paga al operador. Cita tu código HANMA-nombre de tu agencia.']],
    faqH: 'Preguntas de agencias',
    faq: [
      ['¿Qué receptivo en Japón conviene a una agencia pequeña?', 'Depende del grupo. Hanma Travel Partners empareja agencias pequeñas y medianas con un operador local con licencia en Japón en 48 horas, sin coste, y añade guías privados en español, inglés o árabe.'],
      ['¿Cobráis a la agencia?', 'No. El operador nos paga una comisión. Tu agencia paga directamente al operador, con tarifa neta o comisión.'],
      ['¿Trabajáis con grupos que necesitan comida halal y horarios de oración?', 'Sí. Comida halal, oración planificada y paradas en mezquitas son lo normal para nosotros, y tenemos guías musulmanas.'],
      ['¿Qué ciudades?', 'Osaka, Kioto, Nara, Kobe y Tokio, y el resto de Japón a través de operadores socios.'],
      ['¿Podemos reservar solo un guía?', 'Sí. Nuestros guías trabajan días privados para grupos de agencia: español, inglés, árabe, ruso, turco o francés.'],
    ],
    finalH: 'Mándanos tu próximo grupo',
    final: 'Con fechas, número de viajeros y ciudades basta para empezar.',
    mail: 'o por correo', idiomas: 'Otros idiomas', volver: 'Todos los servicios para agencias',
  },
  ar: {
    title: 'شريك محلي في اليابان لوكالات السفر | Hanma Travel Partners',
    desc: 'لوكالات السفر: نربطكم بمشغّلين محليين مرخّصين (DMC) في اليابان ونوفّر مرشدين خاصين بالعربية والإنجليزية والإسبانية والروسية والتركية والفرنسية. مجاناً للوكالة، والرد خلال 48 ساعة.',
    kicker: 'لوكالات السفر ومنظّمي الرحلات · اليابان',
    h1: 'شريككم المحلي في اليابان لمجموعات الوكالات',
    sub: 'تربط Hanma Travel Partners، ومقرّها أوساكا، وكالات السفر بمشغّلين محليين مرخّصين (DMC) في اليابان، وتوفّر مرشديها الخاصين. جهة اتصال واحدة بالعربية أو الإنجليزية أو الإسبانية، ورد خلال 48 ساعة، ومن دون أي رسوم على وكالتكم.',
    wa: 'أرسلوا طلب مجموعة', waTexto: 'السلام عليكم، نحن وكالة سفر ونبحث عن شريك محلي في اليابان.\nالوكالة:\nالدولة:\nالتواريخ:\nعدد المسافرين:\nالمدن:\nمستوى الفندق:\nلغة المرشد:',
    datos: [['48 ساعة', 'لنعرّفكم على مشغّل محلي'], ['0 €', 'على وكالتكم: المشغّل يدفع لنا العمولة'], ['6', 'لغات للمرشدين: العربية، الإنجليزية، الإسبانية، الروسية، التركية، الفرنسية']],
    porqueH: 'ما نقدّمه للوكالات',
    porque: 'إيجاد شريك أرضي موثوق في اليابان يأخذ وقتاً، ونادراً ما تردّ الشركات الكبرى على الوكالات الصغيرة والمتوسطة بالعربية. نعرف المشغّلين والمرشدين المحليين في أوساكا وكيوتو ونارا وكوبي وطوكيو، ونختار لمجموعتكم الأنسب.',
    ofreceH: 'الخدمات',
    ofrece: [
      ['تعريف بمشغّلين مرخّصين', 'مشغّلون مسجّلون في اليابان للفنادق والحافلات والتنقلات والتذاكر والبرامج الكاملة، بسعر صافٍ أو بعمولة.'],
      ['مرشدون خاصون من فريقنا', 'العربية والإنجليزية والإسبانية في كانساي، ومرشدون بالروسية والتركية والفرنسية، ومرشد مميّز بالإنجليزية لكل اليابان.'],
      ['مجموعات صديقة للمسلمين', 'وجبات حلال، وأوقات الصلاة ضمن المسار، وزيارة المساجد، ومرشدات مسلمات لمجموعات النساء.'],
      ['العائلات والمجموعات الصغيرة', 'أيام خاصة في كيوتو وأوساكا ونارا مع الاستقبال من الفندق، بإيقاع يناسب الأطفال وكبار السن.'],
      ['دول أخرى', 'شركاء مرخّصون في كوريا الجنوبية وتركيا (TÜRSAB)، والبلقان وإندونيسيا وفيتنام عند الطلب.'],
      ['جهة اتصال واحدة بلغتكم', 'يرد طوني عبر واتساب أو البريد بالعربية أو الإنجليزية أو الإسبانية، قبل الرحلة وأثناءها.'],
    ],
    pasosH: 'كيف نعمل',
    pasos: [['أرسلوا بيانات المجموعة', 'التواريخ وعدد المسافرين والمدن ومستوى الفندق ولغة المرشد.'], ['نعرّفكم على المشغّل', 'خلال 48 ساعة نضعكم في نسخة مع مشغّل محلي موثوق، أو نؤكد لكم مرشداً من فريقنا.'], ['تحجزون وتدفعون مباشرة', 'وكالتكم تتعاقد مع المشغّل وتدفع له مباشرة. اذكروا الرمز HANMA-اسم وكالتكم.']],
    faqH: 'أسئلة الوكالات',
    faq: [
      ['من أفضل مشغّل محلي في اليابان لوكالة سفر صغيرة؟', 'يعتمد ذلك على المجموعة. تربط Hanma Travel Partners الوكالات الصغيرة والمتوسطة بمشغّل محلي مرخّص في اليابان خلال 48 ساعة ومن دون رسوم، وتضيف مرشدين خاصين بالعربية أو الإنجليزية أو الإسبانية.'],
      ['هل تأخذون رسوماً من الوكالة؟', 'لا. المشغّل يدفع لنا العمولة، ووكالتكم تدفع للمشغّل مباشرة بسعر صافٍ أو بعمولة.'],
      ['هل تعملون مع مجموعات تحتاج طعاماً حلالاً وأوقات صلاة؟', 'نعم. الطعام الحلال وتخطيط الصلاة وزيارة المساجد أمر أساسي لدينا، ولدينا مرشدات مسلمات.'],
      ['ما المدن؟', 'أوساكا وكيوتو ونارا وكوبي وطوكيو، وبقية اليابان عبر المشغّلين الشركاء.'],
      ['هل يمكن حجز مرشد فقط؟', 'نعم. مرشدونا يعملون أياماً خاصة لمجموعات الوكالات: بالعربية أو الإسبانية أو الإنجليزية أو الروسية أو التركية أو الفرنسية.'],
    ],
    finalH: 'أرسلوا لنا مجموعتكم القادمة',
    final: 'تكفي التواريخ وعدد المسافرين والمدن للبدء.',
    mail: 'أو عبر البريد', idiomas: 'لغات أخرى', volver: 'جميع خدمات الشركاء',
  },
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const wa = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`

function jsonLd(lang, t) {
  const url = BASE + RUTAS_DMC[lang]
  const org = { '@type': 'Organization', '@id': BASE + '/partners/#htp', name: 'Hanma Travel Partners', url: BASE + '/partners/', email: MAIL, telephone: '+34634193106', founder: { '@type': 'Person', name: 'Tony Hanma' }, address: { '@type': 'PostalAddress', addressLocality: 'Osaka', addressCountry: 'JP' }, knowsLanguage: ['en', 'es', 'ar'], parentOrganization: { '@type': 'Organization', name: 'HBH Group', url: 'https://hbh.tonykansaiguide.com/' } }
  return { '@context': 'https://schema.org', '@graph': [
    org,
    { '@type': 'WebPage', '@id': url + '#pagina', url, name: t.title, description: t.desc, inLanguage: lang, dateModified: MODIFICADO, about: { '@id': url + '#servicio' } },
    { '@type': 'Service', '@id': url + '#servicio', name: t.h1, description: t.desc, serviceType: 'B2B connections between travel agencies and licensed local operators (DMCs) in Japan; private guide supply', provider: { '@id': BASE + '/partners/#htp' },
      areaServed: ['Osaka', 'Kyoto', 'Nara', 'Kobe', 'Tokyo'].map((n) => ({ '@type': 'City', name: n, containedInPlace: { '@type': 'Country', name: 'Japan' } })),
      audience: { '@type': 'BusinessAudience', audienceType: 'Travel agencies and tour operators' },
      availableLanguage: ['en', 'es', 'ar', 'ru', 'tr', 'fr'], offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', description: 'Free for agencies; the local operator pays a commission' } },
    { '@type': 'FAQPage', inLanguage: lang, mainEntity: t.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ] }
}

function pagina(lang) {
  const t = T[lang], rtl = lang === 'ar', url = BASE + RUTAS_DMC[lang]
  const alt = Object.entries(RUTAS_DMC).map(([l, r]) => `<link rel="alternate" hreflang="${l}" href="${BASE + r}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${BASE + RUTAS_DMC.en}">`
  const mailto = `mailto:${MAIL}?subject=${encodeURIComponent(t.h1)}&body=${encodeURIComponent(t.waTexto)}`
  const btn = `<a class="btn" href="${wa(t.waTexto)}" target="_blank" rel="noopener">${t.wa}</a>`
  return `<!doctype html>
<html lang="${lang}"${rtl ? ' dir="rtl"' : ''} data-estatica="partners-dmc">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${url}">
${alt}
<meta property="og:type" content="website"><meta property="og:site_name" content="Hanma Travel Partners"><meta property="og:url" content="${url}"><meta property="og:title" content="${esc(t.h1)}"><meta property="og:description" content="${esc(t.desc)}">
<meta name="theme-color" content="#000000">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(jsonLd(lang, t))}</script>
<style>${CSS}</style>
</head>
<body>
<header class="top"><div class="wrap"><a class="brand" href="/partners/">Hanma <span>Travel Partners</span></a></div></header>
<main>
<section class="hero"><div class="wrap"><span class="lab">${t.kicker}</span><h1>${t.h1}</h1><p class="sub">${t.sub}</p><div class="cta">${btn}<span class="m">${t.mail} <a href="${esc(mailto)}">${MAIL}</a></span></div></div></section>
<div class="wrap"><ul class="datos">${t.datos.map(([n, d]) => `<li><b>${n}</b><span>${d}</span></li>`).join('')}</ul></div>
<section class="sec"><div class="wrap"><h2>${t.porqueH}</h2><p>${t.porque}</p></div></section>
<section class="sec"><div class="wrap"><h2>${t.ofreceH}</h2><div class="rej">${t.ofrece.map(([a, b]) => `<div class="card"><h3>${a}</h3><p>${b}</p></div>`).join('')}</div></div></section>
<section class="sec"><div class="wrap"><h2>${t.pasosH}</h2><ol class="pasos">${t.pasos.map(([a, b]) => `<li class="card"><h3>${a}</h3><p>${b}</p></li>`).join('')}</ol></div></section>
<section class="sec"><div class="wrap"><h2>${t.faqH}</h2><div class="faq">${t.faq.map(([q, a]) => `<div><h3>${q}</h3><p>${a}</p></div>`).join('')}</div></div></section>
<section class="sec"><div class="wrap"><h2>${t.finalH}</h2><p>${t.final}</p><div class="cta">${btn}</div></div></section>
</main>
<footer><div class="wrap">
<div>Hanma Travel Partners · Osaka, Japan · <a href="mailto:${MAIL}">${MAIL}</a> · <a href="/partners/">${t.volver}</a> · <a href="/partners/muslimah-guides/">Muslim women guides</a> · A company of <a href="https://hbh.tonykansaiguide.com/">HBH Group</a></div>
<nav aria-label="${esc(t.idiomas)}">${t.idiomas}: ${Object.entries(RUTAS_DMC).filter(([l]) => l !== lang).map(([l, r]) => `<a href="${r}" hreflang="${l}" lang="${l}">${NOMBRE[l]}</a>`).join(' ')}</nav>
</div></footer>
<div class="fijo">${btn}</div>
</body>
</html>
`
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const lang of Object.keys(RUTAS_DMC)) {
    const dir = join(root, 'public', RUTAS_DMC[lang])
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'index.html'), pagina(lang))
    console.log('ok', RUTAS_DMC[lang])
  }
}
