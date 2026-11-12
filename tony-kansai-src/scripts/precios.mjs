// Página de PRECIOS de Tony (ES / EN / AR), HTML estático para Google y las IAs.
// Todas las tarifas del guía y todo lo que se puede hacer (rutas por ciudad,
// montaña, planes, experiencias de socios y descuentos de viaje) en una sola página.
//
// Regla de Tony (8-11-2026): NUNCA mezclar el precio del guía con las experiencias
// («la gente cree que el precio incluye las cosas»). Al guía se le paga solo el
// guiado; entradas, trenes, comidas y experiencias se pagan aparte. Las
// experiencias de socios no llevan cifra: «al precio del socio».
//
// Ninguna cifra se escribe aquí: todas salen de los datos de la web.
//   · medio día / día completo / excursión lejana → src/v7/contenido.ts (PAGINAS.*.precios)
//   · tour de 2 h en Kioto → src/v7/datosRespuestasNuevas.ts (PRECIO_CORTO)
//   · senderismo → src/lib/data.ts (HIKING_ROUTES, las 8 rutas de src/v7/datosMontana.ts)
//   · rutas por ciudad → src/v7/datosRutas.ts (TEXTOS, META, PRECIO)
//   · planes → src/v7/datosPlanes.ts · experiencias y descuentos → src/v7/datosVentajas.ts
//
// Uso: node scripts/precios.mjs → public/es/precios/, public/en/prices/, public/ar/prices/
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { navHTML, pieHTML, menuCSS } from './menu-estatico.mjs'
import { equipoHTML, equipoCSS } from './equipo-estatico.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const { PAGINAS, CREDITOS, PAGAR, WA_TONY } = await import('../src/v7/contenido.ts')
const { TEXTOS, META, PRECIO: PRECIO_RUTA, RUTAS_TONY } = await import('../src/v7/datosRutas.ts')
const { HIKING_ROUTES } = await import('../src/lib/data.ts')
const { MONTES, KANJI, CIMA } = await import('../src/v7/datosMontana.ts')
const { PLANES, KIT_LLEGADA } = await import('../src/v7/datosPlanes.ts')
const { APPS, CIUDADES, RUTA_VENTAJAS, cuponDe } = await import('../src/v7/datosVentajas.ts')
const { yenLocal } = await import('../src/v7/formato.ts')

// datosRespuestasNuevas.ts importa sin extensión (Vite sí, Node no): se lee la cifra del fichero.
const fuenteCorto = readFileSync(join(root, 'src/v7/datosRespuestasNuevas.ts'), 'utf8')
const mCorto = fuenteCorto.match(/export const PRECIO_CORTO = (\d+)/)
if (!mCorto) throw new Error('precios: no encuentro PRECIO_CORTO en src/v7/datosRespuestasNuevas.ts')
const PRECIO_CORTO = Number(mCorto[1])

const BASE = 'https://tonykansaiguide.com'
const LANGS = ['es', 'en', 'ar']
const RUTA = { es: '/es/precios/', en: '/en/prices/', ar: '/ar/prices/' }
const HOY = new Date().toISOString().slice(0, 10)
const DIC = { es: JSON.parse(readFileSync(join(root, 'public/i18n/es.json'), 'utf8')), ar: JSON.parse(readFileSync(join(root, 'public/i18n/ar.json'), 'utf8')) }
const tc = (s, lang) => (lang === 'en' ? s : DIC[lang][s] ?? s)

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const yen = (n, lang) => `<bdi dir="ltr">${yenLocal(n, lang)}</bdi>`

// Tarifas base de la página de Tony (contenido.ts): [medio, completo, lejos].
function tarifas(lang) {
  const pl = PAGINAS[lang].precios.planes
  if (pl.length !== 3) throw new Error(`precios: contenido.ts (${lang}) ya no tiene 3 tarifas; revisa este script`)
  return { medio: pl[0], completo: pl[1], lejos: pl[2] }
}
for (const l of LANGS) {
  const t = tarifas(l)
  if (t.medio.yenes !== PRECIO_RUTA.medio || t.completo.yenes !== PRECIO_RUTA.completo || t.lejos.yenes !== PRECIO_RUTA.lejos) {
    throw new Error(`precios: contenido.ts y datosRutas.ts no coinciden (${l}); arregla la fuente antes de publicar`)
  }
}

// Montaña: las 8 rutas de la página de montaña, con su precio de data.ts.
const MONTES_DATOS = MONTES.map((id) => {
  const r = HIKING_ROUTES.find((x) => x.id === id)
  if (!r) throw new Error(`precios: la ruta de montaña «${id}» no está en HIKING_ROUTES`)
  const yenes = Number(String(r.price).replace(/[^0-9]/g, ''))
  return { id, r, yenes }
})
const PRECIOS_MONTE = [...new Set(MONTES_DATOS.map((m) => m.yenes).filter((n) => n > 0))]
const MONTE_MIN = Math.min(...PRECIOS_MONTE)
const MONTE_UNICO = PRECIOS_MONTE.length === 1

// Experiencias de socios (sin precio: se pagan aparte al socio).
const ORDEN_CIUDAD = ['kioto', 'osaka', 'nara', 'kumano']
const EXPERIENCIAS = APPS.filter((a) => a.cat === 'experiencias')
  .sort((a, b) => (ORDEN_CIUDAD.indexOf(a.ciudad) + 1 || 99) - (ORDEN_CIUDAD.indexOf(b.ciudad) + 1 || 99))
const POR_CLAVE = new Map(APPS.map((a) => [a.clave, a]))
const app = (k) => {
  const a = POR_CLAVE.get(k)
  if (!a) throw new Error(`precios: el socio «${k}» no existe en datosVentajas.ts`)
  return a
}
const marca = (a) => a.nombre.replace(/\s*\(.*\)\s*$/, '')
/** Mismo criterio que datosPlanes.ts: el descuento solo sale si el código está vigente. */
const dto = (a) => (a.descuento && cuponDe(a) ? (a.descuento.startsWith('−') ? a.descuento : `−${a.descuento}`) : '')

// Fotos de las rutas por ciudad (créditos de contenido.ts: CC BY / BY-SA obligan a citarlos).
const FOTO_RUTA = { kioto: 0, osaka: 1, nara: 2, kobe: 3, himeji: 4 }

const T = {
  es: {
    title: 'Precios del guía privado en Kioto, Osaka y Nara (2026) | Tony Kansai Guide',
    ceja: 'Precios 2026 · por grupo',
    h1: 'Lo que cuesta un día con Tony',
    respuesta: (p) => `Tony cobra por grupo, no por persona. En la ciudad (hasta 6 personas): 2 horas en Kioto ${p.corto}, medio día (4 h) ${p.medio} y día completo (8 h) ${p.completo}; excursión lejana desde ${p.lejos}. Senderismo guiado: ${p.monte} por grupo. Ese precio es solo el guiado: entradas, trenes, comidas y experiencias se pagan aparte, directamente.`,
    pagaT: 'Al guía le pagas', paga: 'Solo el guiado: la tarifa de su tour, por grupo.',
    aparteT: 'Aparte, directamente', aparte: 'Entradas, trenes, autobuses, comidas y experiencias (kimono, té, talleres). Los pagas tú en el momento o al socio; yo te digo cómo.',
    indice: 'En esta página', secs: { tarifas: 'Tarifas', incluye: 'Qué incluye', ciudades: 'Ciudades', montana: 'Montaña', planes: 'Planes', experiencias: 'Experiencias', preguntas: 'Preguntas' },
    tarifasH: 'Tarifas del guía', tarifasP: 'Precio cerrado por grupo, no por persona: el mismo para 1 que para 6.',
    porGrupo: 'por grupo', desde: 'desde', porPersona: (y) => `Siendo 4: ${y} por persona`,
    filas: {
      corto: { n: 'Tour corto en Kioto', d: '2 horas · hasta 6 personas', u: 'Un barrio o un templo con calma, o el primer paseo al llegar.', enlace: ['Ver el tour de 2 horas', '/es/guia-privado-kioto-2-horas/'] },
      medio: { u: 'Dos o tres sitios importantes de una ciudad.' },
      completo: { u: 'Kioto entero, o Kioto y Nara en un día.' },
      lejos: { d: 'Día completo fuera de las ciudades' },
      monte: { n: 'Senderismo guiado', d: 'Un día de montaña · por grupo', u: 'Ocho rutas cerca de Kioto, Osaka y Kobe: Atago, Hiei, Rokko, Kongo…', enlace: ['Ver las rutas de montaña', '/es/montana/'] },
    },
    notasH: 'Otros casos',
    notas: [
      { t: 'Kioto en bici', d: 'Las mismas tarifas de medio día o día completo. La bici se alquila aparte.', enlace: ['Tour en bici por Kioto', '/es/tour-privado-bici-kioto/'] },
      { t: 'Otoño en Kioto', d: 'De mediados de noviembre a principios de diciembre: mismas tarifas, y llevo un solo grupo al día.', enlaceOtono: true },
      { t: 'Varios días', d: 'El mismo guía todo el viaje. Dime cuántos días tienes y qué quieres ver, y te paso un precio cerrado por todo.' },
      { t: 'Más de 6 personas', d: 'Escríbeme y te digo cómo lo organizamos: un segundo guía o un suplemento.' },
      { t: 'Viaje completo en familia o en grupo', d: 'Hoteles, ryokan, transporte y guías por todo Japón, en español: lo organiza Antonio, con presupuesto a medida.', enlace: ['Viajes en familia y grupo', '/familias/'] },
    ],
    pagoT: 'Cómo se paga',
    incluyeH: 'Qué entra en el precio del guía', siT: 'Incluido', noT: 'No incluido: se paga aparte',
    ciudadesH: 'Qué se hace en cada ciudad', ciudadesP: 'Rutas de partida desde Osaka; el día se ajusta a vosotros. El precio es el del guía, por grupo.', verRutas: ['Ver las rutas hora a hora', '/es/rutas/'],
    foto: 'Foto',
    montanaH: 'Montaña cerca de Kioto y Osaka', montanaP: 'Un día de senderismo con guía, por grupo. Trenes, autobuses y comida, aparte.', altitud: 'Altitud', dificultad: 'Dificultad',
    planesH: 'Planes de guía', planesP: 'Formas de usar el día con el guía. Se cobran como su tour (2 h, medio día o día completo); las experiencias que aparecen se pagan aparte.',
    planPrecio: 'Tarifa del guía', extrasT: 'Extras que coordinamos · se pagan aparte', halal: 'Apto para familias musulmanas',
    expH: 'Experiencias con nuestros socios', expP: 'Kimono, té, talleres, fotos y compras. No entran en el precio del guía: se pagan aparte, al socio y a su precio. Si quieres, te las reservo y vamos juntos.',
    expPrecio: 'Al precio del socio · se paga aparte', ficha: 'Ver ficha', sinCiudad: 'Kansai', conTony: 'Ventaja viniendo con Tony',
    kitH: 'Descuentos para el viaje', kitP: 'Internet y consigna de maletas. Aparte del guía.', todas: ['Ver todas las ventajas y códigos', '/es/ventajas/'],
    faqH: 'Preguntas',
    faq: (p) => [
      ['¿El precio es por persona?', `No, por grupo: el mismo para 1 que para 6 personas. Medio día ${p.medioT}, día completo ${p.completoT} y 2 horas en Kioto ${p.cortoT}.`],
      ['¿El precio del guía incluye entradas, trenes o comidas?', 'No. Al guía le pagas solo el guiado. Entradas, trenes, autobuses, comidas y experiencias se pagan aparte, en el momento o al socio.'],
      ['¿Cuánto cuesta un guía de montaña cerca de Kioto u Osaka?', `${p.monteT} por grupo por un día de senderismo guiado (Atago, Hiei, Rokko, Kongo y otras). Transporte y comida aparte.`],
      ['¿Cuánto cuestan el kimono o la ceremonia del té?', 'Lo que cobre cada socio en su web: se paga aparte, directamente a ellos. Con algunos tienes descuento si vienes conmigo.'],
      ['¿Cómo se paga?', null],
    ],
    ctaH: 'Dime fechas y cuántos sois', ctaP: 'Te contesto con la ruta y el precio cerrado del guía.', ctaB: 'Escribir por WhatsApp',
    msg: 'Hola, Tony. Vengo de la página de precios.',
    nav: { etiqueta: 'Secciones', abrir: 'Abrir menú', g1: 'Precios', g2: 'Tours', g3: 'Más', cta: 'WhatsApp', tours: [['Tour de 2 horas en Kioto', '/es/guia-privado-kioto-2-horas/'], ['Tour en bici por Kioto', '/es/tour-privado-bici-kioto/'], ['Rutas por ciudad', '/es/rutas/'], ['Montaña', '/es/montana/']], mas: [['Página de Tony', '/es/'], ['Ventajas para tu viaje', '/es/ventajas/'], ['¿Te compensa un guía? Calculadora', '/es/calculadora-guia/']] },
    pie: { intro: 'Tony Hanma es guía privado en español, inglés y árabe en Kansai. Precios por grupo; entradas, trenes y comidas aparte.', c1: 'Tours', c2: 'Contacto', act: 'Actualizado', mas: 'Ver todo' },
    inicio: 'Tony Kansai Guide',
  },
  en: {
    title: 'Private guide prices in Kyoto, Osaka & Nara (2026) | Tony Kansai Guide',
    ceja: '2026 prices · per group',
    h1: 'What a day with Tony costs',
    respuesta: (p) => `Tony charges per group, not per person. City tours (up to 6 people): 2 hours in Kyoto ${p.corto}, half day (4 h) ${p.medio} and full day (8 h) ${p.completo}; long day trips from ${p.lejos}. Guided hiking: ${p.monte} per group. That price is the guiding only: tickets, trains, meals and experiences are paid separately, directly.`,
    pagaT: 'You pay the guide', paga: 'Only for the guiding: the tour rate, per group.',
    aparteT: 'Separately, directly', aparte: 'Tickets, trains, buses, meals and experiences (kimono, tea, workshops). You pay them on the spot or to the partner; I show you how.',
    indice: 'On this page', secs: { tarifas: 'Rates', incluye: 'What’s included', ciudades: 'Cities', montana: 'Hiking', planes: 'Plans', experiencias: 'Experiences', preguntas: 'Questions' },
    tarifasH: 'Guide rates', tarifasP: 'One fixed price per group, not per person: the same for 1 as for 6.',
    porGrupo: 'per group', desde: 'from', porPersona: (y) => `For 4 people: ${y} each`,
    filas: {
      corto: { n: 'Short tour in Kyoto', d: '2 hours · up to 6 people', u: 'One district or temple, or a first walk when you arrive.', enlace: ['See the 2-hour tour', '/en/kyoto-private-guide-2-hours/'] },
      medio: { u: 'Two or three of a city’s main sights.' },
      completo: { u: 'All of Kyoto, or Kyoto and Nara in one day.' },
      lejos: { d: 'A full day beyond the cities' },
      monte: { n: 'Guided hiking', d: 'A mountain day · per group', u: 'Eight trails near Kyoto, Osaka and Kobe: Atago, Hiei, Rokko, Kongo…', enlace: ['See the hiking routes', '/en/hiking/'] },
    },
    notasH: 'Other cases',
    notas: [
      { t: 'Kyoto by bike', d: 'Same half-day or full-day rates. Bikes are rented separately.', enlace: ['Kyoto private bike tour', '/en/kyoto-private-bike-tour/'] },
      { t: 'Autumn in Kyoto', d: 'Mid-November to early December: same rates, and I take one group a day.', enlaceOtono: true },
      { t: 'Several days', d: 'The same guide for the whole trip. Tell me how many days you have and what you’d like to see, and I’ll send one fixed price for everything.' },
      { t: 'More than 6 people', d: 'Message me and I’ll tell you how we organise it: a second guide or a supplement.' },
    ],
    pagoT: 'How to pay',
    incluyeH: 'What the guide fee covers', siT: 'Included', noT: 'Not included: paid separately',
    ciudadesH: 'What you can do in each city', ciudadesP: 'Starting points from Osaka; we adjust the day to you. The price is the guide fee, per group.', verRutas: ['See the routes hour by hour', '/en/routes/'],
    foto: 'Photo',
    montanaH: 'Hiking near Kyoto and Osaka', montanaP: 'A guided hiking day, per group. Trains, buses and food are extra.', altitud: 'Altitude', dificultad: 'Difficulty',
    planesH: 'Guide plans', planesP: 'Ways to spend the day with your guide. They are charged as the tour (2 h, half day or full day); the experiences listed are paid separately.',
    planPrecio: 'Guide rate', extrasT: 'Extras we arrange · paid separately', halal: 'Muslim-family friendly',
    expH: 'Experiences with our partners', expP: 'Kimono, tea, workshops, photos and shopping. Not part of the guide fee: paid separately, to the partner, at their price. If you like, I book them and we go together.',
    expPrecio: 'At the partner’s price · paid separately', ficha: 'Details', sinCiudad: 'Kansai', conTony: 'Perk when you come with Tony',
    kitH: 'Discounts for your trip', kitP: 'Mobile data and luggage storage. Separate from the guide.', todas: ['See all perks and codes', '/en/perks/'],
    faqH: 'Questions',
    faq: (p) => [
      ['Is the price per person?', `No, per group: the same for 1 as for 6 people. Half day ${p.medioT}, full day ${p.completoT} and 2 hours in Kyoto ${p.cortoT}.`],
      ['Does the guide fee include tickets, trains or meals?', 'No. You pay the guide only for the guiding. Tickets, trains, buses, meals and experiences are paid separately, on the spot or to the partner.'],
      ['How much is a hiking guide near Kyoto or Osaka?', `${p.monteT} per group for a guided hiking day (Atago, Hiei, Rokko, Kongo and more). Transport and food extra.`],
      ['How much do kimono or the tea ceremony cost?', 'Whatever each partner charges on their website: paid separately, directly to them. Some give you a discount when you come with me.'],
      ['How do I pay?', null],
    ],
    ctaH: 'Tell me your dates and group size', ctaP: 'I reply with a route and one fixed guide price.', ctaB: 'Message on WhatsApp',
    msg: 'Hi Tony, I’m coming from the prices page.',
    nav: { etiqueta: 'Sections', abrir: 'Open menu', g1: 'Prices', g2: 'Tours', g3: 'More', cta: 'WhatsApp', tours: [['2-hour Kyoto tour', '/en/kyoto-private-guide-2-hours/'], ['Kyoto bike tour', '/en/kyoto-private-bike-tour/'], ['Routes by city', '/en/routes/'], ['Hiking', '/en/hiking/']], mas: [['Tony’s page', '/en/'], ['Perks for your trip', '/en/perks/'], ['Is a guide worth it? Calculator', '/en/private-guide-calculator/']] },
    pie: { intro: 'Tony Hanma is a private guide in English, Spanish and Arabic in Kansai. Prices per group; tickets, trains and meals extra.', c1: 'Tours', c2: 'Contact', act: 'Updated', mas: 'See all' },
    inicio: 'Tony Kansai Guide',
  },
  ar: {
    title: 'أسعار المرشد الخاص في كيوتو وأوساكا ونارا (2026) | Tony Kansai Guide',
    ceja: 'أسعار 2026 · للمجموعة',
    h1: 'كم يكلّف يوم مع طوني',
    respuesta: (p) => `يحسب طوني السعر للمجموعة لا للشخص. جولات المدينة (حتى 6 أشخاص): ساعتان في كيوتو ${p.corto}، ونصف يوم (4 ساعات) ${p.medio}، ويوم كامل (8 ساعات) ${p.completo}؛ والرحلات البعيدة ابتداءً من ${p.lejos}. المشي الجبلي مع مرشد: ${p.monte} للمجموعة. هذا السعر للإرشاد فقط: تذاكر الدخول والقطارات والوجبات والتجارب تُدفع على حدة، مباشرةً.`,
    pagaT: 'تدفع للمرشد', paga: 'مقابل الإرشاد فقط: سعر الجولة للمجموعة.',
    aparteT: 'على حدة، مباشرةً', aparte: 'تذاكر الدخول والقطارات والحافلات والوجبات والتجارب (الكيمونو والشاي والورش). تدفعونها بأنفسكم في حينها أو للشريك، وأنا أدلّكم على الطريقة.',
    indice: 'في هذه الصفحة', secs: { tarifas: 'الأسعار', incluye: 'ما يشمله', ciudades: 'المدن', montana: 'الجبال', planes: 'الخطط', experiencias: 'التجارب', preguntas: 'أسئلة' },
    tarifasH: 'أسعار المرشد', tarifasP: 'سعر ثابت للمجموعة لا للشخص: السعر نفسه لشخص واحد أو لستة.',
    porGrupo: 'للمجموعة', desde: 'ابتداءً من', porPersona: (y) => `لأربعة أشخاص: ${y} للشخص`,
    filas: {
      corto: { n: 'جولة قصيرة في كيوتو', d: 'ساعتان · حتى 6 أشخاص', u: 'حي واحد أو معبد واحد بهدوء، أو أول جولة عند الوصول.', enlace: ['جولة الساعتين', '/ar/kyoto-private-guide-2-hours/'] },
      medio: { u: 'مكانان أو ثلاثة من أهم معالم المدينة.' },
      completo: { u: 'كيوتو كاملة، أو كيوتو ونارا في يوم واحد.' },
      lejos: { d: 'يوم كامل خارج المدن' },
      monte: { n: 'مشي جبلي مع مرشد', d: 'يوم في الجبل · للمجموعة', u: 'ثمانية مسارات قرب كيوتو وأوساكا وكوبي: أتاغو، هيي، روكو، كونغو…', enlace: ['مسارات الجبال', '/ar/hiking/'] },
    },
    notasH: 'حالات أخرى',
    notas: [
      { t: 'كيوتو بالدراجة', d: 'الأسعار نفسها لنصف اليوم أو اليوم الكامل. الدراجات تُستأجر على حدة.', enlace: ['جولة الدراجة في كيوتو', '/ar/kyoto-private-bike-tour/'] },
      { t: 'الخريف في كيوتو', d: 'من منتصف نوفمبر حتى أوائل ديسمبر: الأسعار نفسها، وأرافق مجموعة واحدة فقط في اليوم.', enlaceOtono: true },
      { t: 'عدة أيام', d: 'المرشد نفسه طوال الرحلة. أخبرني بعدد الأيام وما تريدون رؤيته، وأرسل لكم سعرًا ثابتًا للرحلة كلها.' },
      { t: 'أكثر من 6 أشخاص', d: 'راسلني وأخبرك كيف ننظّمها: مرشد ثانٍ أو مبلغ إضافي.' },
    ],
    pagoT: 'طريقة الدفع',
    incluyeH: 'ما يشمله سعر المرشد', siT: 'مشمول', noT: 'غير مشمول: يُدفع على حدة',
    ciudadesH: 'ماذا نفعل في كل مدينة', ciudadesP: 'نقاط انطلاق من أوساكا، ونرتّب اليوم على مقاسكم. السعر هو سعر المرشد للمجموعة.', verRutas: ['المسارات ساعة بساعة', '/ar/routes/'],
    foto: 'صورة',
    montanaH: 'الجبال قرب كيوتو وأوساكا', montanaP: 'يوم مشي جبلي مع مرشد، للمجموعة. القطارات والحافلات والطعام على حدة.', altitud: 'الارتفاع', dificultad: 'الصعوبة',
    planesH: 'خطط المرشد', planesP: 'طرق لقضاء اليوم مع المرشد. تُحسب بسعر الجولة (ساعتان أو نصف يوم أو يوم كامل)، والتجارب المذكورة تُدفع على حدة.',
    planPrecio: 'سعر المرشد', extrasT: 'إضافات ننسّقها · تُدفع على حدة', halal: 'مناسب للعائلات المسلمة',
    expH: 'تجارب مع شركائنا', expP: 'الكيمونو والشاي والورش والتصوير والتسوّق. ليست ضمن سعر المرشد: تُدفع على حدة للشريك وبسعره. وإن أردتم أحجزها لكم ونذهب معًا.',
    expPrecio: 'بسعر الشريك · يُدفع على حدة', ficha: 'التفاصيل', sinCiudad: 'كانساي', conTony: 'ميزة عند القدوم مع طوني',
    kitH: 'خصومات لرحلتك', kitP: 'الإنترنت وحفظ الحقائب. منفصلة عن المرشد.', todas: ['كل المزايا والرموز', '/ar/perks/'],
    faqH: 'أسئلة',
    faq: (p) => [
      ['هل السعر للشخص؟', `لا، للمجموعة: السعر نفسه لشخص واحد أو لستة. نصف يوم ${p.medioT}، ويوم كامل ${p.completoT}، وساعتان في كيوتو ${p.cortoT}.`],
      ['هل يشمل سعر المرشد التذاكر أو القطارات أو الوجبات؟', 'لا. تدفع للمرشد مقابل الإرشاد فقط. تذاكر الدخول والقطارات والحافلات والوجبات والتجارب تُدفع على حدة، في حينها أو للشريك.'],
      ['كم يكلّف مرشد المشي الجبلي قرب كيوتو أو أوساكا؟', `${p.monteT} للمجموعة ليوم مشي جبلي مع مرشد (أتاغو وهيي وروكو وكونغو وغيرها). المواصلات والطعام على حدة.`],
      ['كم يكلّف الكيمونو أو حفل الشاي؟', 'ما يطلبه كل شريك في موقعه: يُدفع على حدة ومباشرةً له. بعضهم يمنحكم خصمًا إن جئتم معي.'],
      ['كيف أدفع؟', null],
    ],
    ctaH: 'أخبرني بالتواريخ وعددكم', ctaP: 'أردّ عليكم بالمسار وبسعر ثابت للمرشد.', ctaB: 'راسلني على واتساب',
    msg: 'مرحبًا طوني، جئت من صفحة الأسعار.',
    nav: { etiqueta: 'الأقسام', abrir: 'افتح القائمة', g1: 'الأسعار', g2: 'الجولات', g3: 'المزيد', cta: 'واتساب', tours: [['جولة ساعتين في كيوتو', '/ar/kyoto-private-guide-2-hours/'], ['جولة الدراجة في كيوتو', '/ar/kyoto-private-bike-tour/'], ['المسارات حسب المدينة', '/ar/routes/'], ['الجبال', '/ar/hiking/']], mas: [['صفحة طوني', '/ar/'], ['مزايا لرحلتك', '/ar/perks/'], ['هل يستحق المرشد؟ حاسبة', '/ar/private-guide-calculator/']] },
    pie: { intro: 'طوني هانما مرشد خاص بالعربية والإسبانية والإنجليزية في كانساي. الأسعار للمجموعة؛ التذاكر والقطارات والوجبات على حدة.', c1: 'الجولات', c2: 'التواصل', act: 'آخر تحديث', mas: 'عرض الكل' },
    inicio: 'Tony Kansai Guide',
  },
}

const flecha = (lang) => (lang === 'ar' ? '←' : '→')
const wa = (msg) => `https://wa.me/${WA_TONY}?text=${encodeURIComponent(msg)}`

function filasTarifas(lang) {
  const t = T[lang]
  const b = tarifas(lang)
  const f = t.filas
  return [
    { id: 'corto', n: f.corto.n, d: f.corto.d, u: f.corto.u, yenes: PRECIO_CORTO, enlace: f.corto.enlace, grupo6: true },
    { id: 'medio', n: b.medio.nombre, d: b.medio.detalle.replace(/[٠-٩]/g, (c) => '٠١٢٣٤٥٦٧٨٩'.indexOf(c)), u: f.medio.u, yenes: b.medio.yenes, grupo6: true },
    { id: 'completo', n: b.completo.nombre, d: b.completo.detalle.replace(/[٠-٩]/g, (c) => '٠١٢٣٤٥٦٧٨٩'.indexOf(c)), u: f.completo.u, yenes: b.completo.yenes, grupo6: true, destacada: true },
    { id: 'lejos', n: b.lejos.nombre, d: f.lejos.d, u: b.lejos.detalle, yenes: b.lejos.yenes, desde: true },
    { id: 'monte', n: f.monte.n, d: f.monte.d, u: f.monte.u, yenes: MONTE_MIN, desde: !MONTE_UNICO, enlace: f.monte.enlace },
  ]
}

function pagina(lang) {
  const t = T[lang]
  const P = PAGINAS[lang]
  const rtl = lang === 'ar'
  const url = BASE + RUTA[lang]
  const filas = filasTarifas(lang)
  const precioTxt = { corto: yen(PRECIO_CORTO, lang), medio: yen(tarifas(lang).medio.yenes, lang), completo: yen(tarifas(lang).completo.yenes, lang), lejos: yen(tarifas(lang).lejos.yenes, lang), monte: yen(MONTE_MIN, lang) }
  const plano = { cortoT: yenLocal(PRECIO_CORTO, lang), medioT: yenLocal(tarifas(lang).medio.yenes, lang), completoT: yenLocal(tarifas(lang).completo.yenes, lang), monteT: yenLocal(MONTE_MIN, lang) }
  const pagoTexto = [...P.precios.notas, PAGAR[lang].nota].join(' ')
  const faq = t.faq(plano).map(([q, a]) => [q, a ?? pagoTexto])
  const otono = P.precios.temporada?.enlace
  const desc = t.respuesta({ corto: plano.cortoT, medio: plano.medioT, completo: plano.completoT, lejos: yenLocal(tarifas(lang).lejos.yenes, lang), monte: plano.monteT }).slice(0, 300)

  // ── Tarifas ────────────────────────────────────────────────────────────
  const tarifasHTML = `<ol class="tf">${filas.map((f) => `<li class="tf-f${f.destacada ? ' tf-dest' : ''}" id="tarifa-${f.id}">
<div class="tf-q"><h3>${esc(f.n)}</h3><p class="tf-d">${esc(f.d)}</p><p class="tf-u">${esc(f.u)}</p>${f.enlace ? `<a class="tf-l" href="${f.enlace[1]}">${esc(f.enlace[0])} <span aria-hidden="true">${flecha(lang)}</span></a>` : ''}</div>
<div class="tf-p">${f.desde ? `<small>${esc(t.desde)}</small>` : ''}<b>${yen(f.yenes, lang)}</b><span>${esc(t.porGrupo)}</span>${f.grupo6 ? `<em>${t.porPersona(yen(f.yenes / 4, lang))}</em>` : ''}</div>
</li>`).join('')}</ol>`

  const notasHTML = `<div class="nt"><h3>${esc(t.notasH)}</h3><dl>${t.notas.map((n) => {
    const enl = n.enlaceOtono ? (otono ? [otono.texto, otono.ruta] : null) : n.enlace
    return `<div><dt>${esc(n.t)}</dt><dd>${esc(n.d)}${enl ? ` <a href="${enl[1]}">${esc(enl[0])} <span aria-hidden="true">${flecha(lang)}</span></a>` : ''}</dd></div>`
  }).join('')}<div><dt>${esc(t.pagoT)}</dt><dd>${esc(pagoTexto)}</dd></div></dl></div>`

  // ── Qué incluye ────────────────────────────────────────────────────────
  const incluyeHTML = `<div class="inc"><div class="inc-si"><h3>${esc(t.siT)}</h3><ul>${P.como.si.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>
<div class="inc-no"><h3>${esc(t.noT)}</h3><ul>${P.como.no.map((i) => `<li>${esc(i)}</li>`).join('')}<li>${esc(t.aparte)}</li></ul></div></div>`

  // ── Ciudades ───────────────────────────────────────────────────────────
  const nombresTramo = { medio: tarifas(lang).medio.nombre, completo: tarifas(lang).completo.nombre, lejos: tarifas(lang).lejos.nombre }
  const ciudadesHTML = `<ul class="cd">${RUTAS_TONY.map((id) => {
    const tx = TEXTOS[lang][id]
    const meta = META[id]
    const cr = CREDITOS[FOTO_RUTA[id]]
    if (!tx || !meta || !cr) throw new Error(`precios: faltan datos de la ruta «${id}» (${lang})`)
    const opciones = tx.opciones.map((o, i) => {
      const tramo = meta.tramos[i]
      if (!tramo) throw new Error(`precios: la ruta «${id}» tiene más opciones que tramos en META`)
      return `<li><div><b>${esc(nombresTramo[tramo] ?? o.nombre)}</b><span>${esc(o.texto)}</span></div><i>${yen(PRECIO_RUTA[tramo], lang)}</i></li>`
    }).join('')
    return `<li class="cd-c"><figure><img src="/v7/fotos/${id}-600.webp" alt="${esc(tx.titulo)}" width="600" height="400" loading="lazy" decoding="async"><figcaption>${esc(t.foto)}: <a href="${cr.url}" rel="noopener">${esc(cr.autor)}</a>, ${esc(cr.licencia)}</figcaption></figure>
<div class="cd-t"><h3>${esc(tx.titulo)}</h3><p class="cd-desde">${esc(tx.desde)}</p><p>${esc(tx.texto)}</p><ul class="cd-o">${opciones}</ul></div></li>`
  }).join('')}</ul><p class="mas"><a href="${t.verRutas[1]}">${esc(t.verRutas[0])} <span aria-hidden="true">${flecha(lang)}</span></a></p>`

  // ── Montaña ────────────────────────────────────────────────────────────
  const montanaHTML = `<ul class="mt">${MONTES_DATOS.map(({ id, r, yenes }) => `<li><span class="mt-k" lang="ja">${KANJI[id]}</span><div class="mt-t"><h3>${esc(tc(r.title, lang))}</h3><p>${esc(tc(r.subtitle, lang))}</p><p class="mt-m">${esc(t.altitud)} <bdi dir="ltr">${CIMA[id].m.toLocaleString(lang === 'es' ? 'es-ES' : 'en-US')} m</bdi> · ${esc(t.dificultad)}: ${esc(tc(r.grade, lang))}</p></div><div class="mt-p">${yenes > 0 ? `<b>${yen(yenes, lang)}</b><span>${esc(t.porGrupo)}</span>` : ''}</div></li>`).join('')}</ul><p class="mas"><a href="${t.filas.monte.enlace[1]}">${esc(t.filas.monte.enlace[0])} <span aria-hidden="true">${flecha(lang)}</span></a></p>`

  // ── Planes ─────────────────────────────────────────────────────────────
  const planesHTML = `<ul class="pn">${PLANES.map((p) => {
    const tp = p.t[lang]
    const extras = p.extras.map(app)
    return `<li id="plan-${p.id}"><h3>${esc(tp.nombre)}</h3><p>${esc(tp.gancho)}</p><ul class="pn-r">${tp.puntos.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
${p.musulman ? `<p class="sello">${esc(t.halal)}</p>` : ''}
<p class="pn-p"><span>${esc(t.planPrecio)}</span> <bdi dir="ltr">2 h</bdi> ${precioTxt.corto} · <bdi dir="ltr">4 h</bdi> ${precioTxt.medio} · <bdi dir="ltr">8 h</bdi> ${precioTxt.completo}</p>
${extras.length ? `<div class="pn-x"><p>${esc(t.extrasT)}</p><div>${extras.map((a) => `<span><bdi dir="ltr">${esc(marca(a))}</bdi>${dto(a) ? ` <b dir="ltr">${esc(dto(a))}</b>` : ''}</span>`).join('')}</div></div>` : ''}</li>`
  }).join('')}</ul>`

  // ── Experiencias ───────────────────────────────────────────────────────
  const expHTML = `<ul class="ex">${EXPERIENCIAS.map((a) => {
    const tx = a.t[lang]
    const ciudad = a.ciudad ? CIUDADES[a.ciudad][lang] : t.sinCiudad
    return `<li><p class="ex-c">${esc(ciudad)}${a.musulman ? ` · <span class="ex-m">${esc(t.halal)}</span>` : ''}</p><h3><bdi dir="ltr">${esc(marca(a))}</bdi></h3><p>${esc(tx.que)}</p>
<p class="ex-p"><span>${esc(t.expPrecio)}</span>${dto(a) ? ` <b dir="ltr">${esc(dto(a))}</b>` : ''}</p><a href="${RUTA_VENTAJAS[lang]}${a.clave}/">${esc(t.ficha)} <span aria-hidden="true">${flecha(lang)}</span></a></li>`
  }).join('')}</ul>`

  const kit = KIT_LLEGADA.map(app).filter((a) => dto(a))
  const kitHTML = `<div class="kit"><div><h3>${esc(t.kitH)}</h3><p>${esc(t.kitP)}</p></div><ul>${kit.map((a) => `<li><bdi dir="ltr">${esc(a.nombre)}</bdi> <b dir="ltr">${esc(dto(a))}</b></li>`).join('')}</ul><a href="${t.todas[1]}#codigos">${esc(t.todas[0])} <span aria-hidden="true">${flecha(lang)}</span></a></div>`

  // ── JSON-LD ────────────────────────────────────────────────────────────
  const tony = { '@id': `${BASE}/#tony` }
  const ofertaGuia = (f) => ({
    '@type': 'Offer',
    '@id': `${url}#tarifa-${f.id}`,
    name: f.n,
    description: `${f.d}. ${f.u} ${t.paga} ${t.aparteT}: ${t.aparte}`,
    url: `${url}#tarifa-${f.id}`,
    price: f.yenes,
    priceCurrency: 'JPY',
    ...(f.desde ? { priceSpecification: { '@type': 'PriceSpecification', minPrice: f.yenes, priceCurrency: 'JPY' } } : {}),
    ...(f.grupo6 ? { eligibleQuantity: { '@type': 'QuantitativeValue', maxValue: 6, unitText: 'people per group' } } : {}),
    availability: 'https://schema.org/InStock',
    offeredBy: tony,
    itemOffered: { '@type': 'Service', serviceType: 'Private tour guide', name: f.n, provider: tony, areaServed: ['Kyoto', 'Osaka', 'Nara', 'Kobe', 'Himeji'] },
  })
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Person', '@id': `${BASE}/#tony`, name: 'Tony Hanma', url: `${BASE}/${lang}/`, jobTitle: 'Private tour guide in Kansai', knowsLanguage: ['es', 'en', 'ar'] },
      { '@type': 'WebPage', '@id': `${url}#pagina`, url, name: t.title, description: desc, inLanguage: lang, dateModified: HOY, about: tony, mainEntity: { '@id': `${url}#tarifas` } },
      {
        '@type': 'OfferCatalog', '@id': `${url}#tarifas`, name: t.tarifasH, description: `${t.tarifasP} ${t.paga} ${t.aparteT}: ${t.aparte}`,
        itemListElement: [
          ...filas.map(ofertaGuia),
          ...RUTAS_TONY.flatMap((id) => TEXTOS[lang][id].opciones.map((o, i) => ({
            '@type': 'Offer', name: `${TEXTOS[lang][id].titulo} · ${nombresTramo[META[id].tramos[i]] ?? o.nombre}`, description: o.texto,
            price: PRECIO_RUTA[META[id].tramos[i]], priceCurrency: 'JPY', url: `${url}#ciudades`, offeredBy: tony,
            itemOffered: { '@type': 'TouristTrip', name: `${TEXTOS[lang][id].titulo}: ${o.nombre}`, description: o.texto, provider: tony },
          }))),
          ...MONTES_DATOS.filter((m) => m.yenes > 0).map(({ id, r, yenes }) => ({
            '@type': 'Offer', name: `${t.filas.monte.n}: ${tc(r.title, lang)} (${KANJI[id]})`, price: yenes, priceCurrency: 'JPY', url: `${url}#montana`, offeredBy: tony,
            itemOffered: { '@type': 'TouristTrip', name: tc(r.title, lang), description: tc(r.subtitle, lang), provider: tony },
          })),
        ],
      },
      {
        '@type': 'ItemList', '@id': `${url}#experiencias`, name: t.expH, description: t.expP,
        itemListElement: EXPERIENCIAS.map((a, i) => ({
          '@type': 'ListItem', position: i + 1,
          item: { '@type': 'TouristAttraction', name: marca(a), description: `${a.t[lang].que} ${t.expPrecio}.`, url: `${BASE}${RUTA_VENTAJAS[lang]}${a.clave}/`, isAccessibleForFree: false },
        })),
      },
      {
        '@type': 'ItemList', '@id': `${url}#planes`, name: t.planesH, description: t.planesP,
        itemListElement: PLANES.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'Service', serviceType: 'Private tour guide', name: p.t[lang].nombre, description: `${p.t[lang].gancho} ${p.t[lang].puntos.join('. ')}.`, provider: tony } })),
      },
      { '@type': 'FAQPage', '@id': `${url}#preguntas`, inLanguage: lang, mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Tony Kansai Guide', item: `${BASE}/${lang}/` }, { '@type': 'ListItem', position: 2, name: t.nav.g1, item: url }] },
    ],
  }

  const secciones = Object.entries(t.secs)
  const fuentes = rtl
    ? 'family=IBM+Plex+Sans+Arabic:wght@400;500;600;700'
    : 'family=Geist:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600'

  return `<!doctype html>
<html lang="${lang}" dir="${rtl ? 'rtl' : 'ltr'}" data-estatica="precios">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#f3eee4">
<link rel="canonical" href="${url}">
${LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${BASE}${RUTA[l]}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${BASE}${RUTA.en}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Tony Kansai Guide">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${BASE}/v8/og/kyoto.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fuentes}&display=swap">
<link rel="preload" as="image" href="/v7/fotos/kioto-900.webp" imagesrcset="/v7/fotos/kioto-600.webp 600w, /v7/fotos/kioto-900.webp 900w" imagesizes="(min-width:960px) 44vw, 100vw">
<style>${CSS}${menuCSS}${equipoCSS}</style>
</head>
<body>
<a class="saltar" href="#tarifas">${esc(t.secs.tarifas)}</a>
<header class="top"><div class="kap"><a class="marca" href="/${lang}/"><span aria-hidden="true">⛩</span> Tony Kansai Guide</a>
${navHTML({ etiqueta: t.nav.etiqueta, abrir: t.nav.abrir, grupos: [
  { t: t.nav.g1, enlaces: secciones.map(([id, n]) => [esc(n), `#${id}`]) },
  { t: t.nav.g2, enlaces: t.nav.tours.map(([n, h]) => [esc(n), h]) },
  { t: t.nav.g3, enlaces: [...t.nav.mas.map(([n, h]) => [esc(n), h]), ...LANGS.filter((l) => l !== lang).map((l) => ({ t: l === 'ar' ? 'العربية' : l === 'es' ? 'Español' : 'English', h: RUTA[l], hreflang: l, lang: l }))] },
], cta: { t: t.nav.cta, h: wa(t.msg) } })}</div></header>
<main>
<section class="heroe"><div class="kap heroe-k">
<div class="heroe-t">
<p class="ceja">${esc(t.ceja)}</p>
<h1>${esc(t.h1)}</h1>
<p class="respuesta">${t.respuesta(precioTxt)}</p>
<ul class="resumen" aria-label="${esc(t.tarifasH)}">${filas.map((f) => `<li><a href="#tarifa-${f.id}"><span>${esc(f.n)}</span><b>${f.desde ? `<small>${esc(t.desde)}</small> ` : ''}${yen(f.yenes, lang)}</b></a></li>`).join('')}</ul>
</div>
<figure class="heroe-f"><img src="/v7/fotos/kioto-900.webp" srcset="/v7/fotos/kioto-600.webp 600w, /v7/fotos/kioto-900.webp 900w" sizes="(min-width:960px) 44vw, 100vw" alt="${esc(CREDITOS[0].tr?.[lang] ?? CREDITOS[0].foto)}" width="900" height="600" fetchpriority="high"><figcaption>${esc(t.foto)}: <a href="${CREDITOS[0].url}" rel="noopener">${esc(CREDITOS[0].autor)}</a>, ${esc(CREDITOS[0].licencia)}</figcaption></figure>
</div></section>

<section class="regla" aria-label="${esc(t.pagaT)} / ${esc(t.aparteT)}"><div class="kap regla-k">
<div><h2>${esc(t.pagaT)}</h2><p>${esc(t.paga)}</p></div>
<div><h2>${esc(t.aparteT)}</h2><p>${esc(t.aparte)}</p></div>
</div></section>

<nav class="indice" aria-label="${esc(t.indice)}"><div class="kap"><ul>${secciones.map(([id, n]) => `<li><a href="#${id}">${esc(n)}</a></li>`).join('')}</ul></div></nav>

<section class="bloque" id="tarifas"><div class="kap">
<h2>${esc(t.tarifasH)}</h2><p class="sub">${esc(t.tarifasP)}</p>
${tarifasHTML}
${notasHTML}
</div></section>

<section class="bloque bloque-claro" id="incluye"><div class="kap">
<h2>${esc(t.incluyeH)}</h2>
${incluyeHTML}
</div></section>

<section class="bloque" id="ciudades"><div class="kap">
<h2>${esc(t.ciudadesH)}</h2><p class="sub">${esc(t.ciudadesP)}</p>
${ciudadesHTML}
</div></section>

<section class="bloque bloque-claro" id="montana"><div class="kap">
<h2>${esc(t.montanaH)}</h2><p class="sub">${esc(t.montanaP)}</p>
${montanaHTML}
</div></section>

<section class="bloque" id="planes"><div class="kap">
<h2>${esc(t.planesH)}</h2><p class="sub">${esc(t.planesP)}</p>
${planesHTML}
</div></section>

<section class="bloque bloque-claro" id="experiencias"><div class="kap">
<h2>${esc(t.expH)}</h2><p class="sub">${esc(t.expP)}</p>
${expHTML}
${kitHTML}
</div></section>

<section class="bloque" id="preguntas"><div class="kap estrecho">
<h2>${esc(t.faqH)}</h2>
${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}
</div></section>

<section class="cierre"><div class="kap">
<h2>${esc(t.ctaH)}</h2><p>${esc(t.ctaP)}</p>
<a class="btn" href="${wa(t.msg)}" rel="noopener">${esc(t.ctaB)} <span aria-hidden="true">${flecha(lang)}</span></a>
</div></section>
</main>
<footer>${pieHTML({ mas: t.pie.mas,
  intro: `<p>${esc(t.pie.intro)}</p>`,
  columnas: [
    { t: t.pie.c1, enlaces: t.nav.tours.map(([n, h]) => [esc(n), h]) },
    { t: t.nav.g3, enlaces: t.nav.mas.map(([n, h]) => [esc(n), h]) },
    { t: t.pie.c2, fija: true, html: `<p>WhatsApp: <a href="${wa(t.msg)}"><bdi dir="ltr">+34 634 193 106</bdi></a></p><p><a href="mailto:tony@tonykansaiguide.com">tony@tonykansaiguide.com</a></p>` },
  ],
  equipo: equipoHTML({ lang, actual: 'tony' }),
  fin: `<span>© Tony Kansai Guide</span><span>${esc(t.pie.act)}: <bdi dir="ltr">${HOY}</bdi></span>`,
})}</footer>
</body>
</html>
`
}

// Papel y tinta, un solo acento (bermellón del torii). Precios en cifras tabulares.
const CSS = `
:root{--papel:#f3eee4;--papel2:#ebe4d6;--tarjeta:#fbf8f2;--tinta:#1d1b18;--gris:#5c574f;--linea:rgba(29,27,24,.14);--acento:#b8381f;--acento-t:#fff;
--mn-tarjeta:#fbf8f2;--mn-texto:#1d1b18;--mn-linea:rgba(29,27,24,.18);--mn-suave:#ebe4d6;--mn-acento:#b8381f;
--sans:'Geist',system-ui,-apple-system,'Segoe UI',sans-serif;--serif:'Source Serif 4',Georgia,serif;--r:14px}
html[dir=rtl]{--sans:'IBM Plex Sans Arabic',system-ui,sans-serif;--serif:'IBM Plex Sans Arabic',system-ui,sans-serif}
*{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{margin:0;background:var(--papel);color:var(--tinta);font:400 16px/1.6 var(--sans);overflow-x:hidden}
img{max-width:100%;height:auto;display:block}
a{color:inherit;text-underline-offset:3px}
h1,h2,h3{font-family:var(--serif);font-weight:600;line-height:1.12;margin:0;text-wrap:balance;letter-spacing:-.01em}
html[dir=rtl] h1,html[dir=rtl] h2,html[dir=rtl] h3{letter-spacing:0;line-height:1.35;font-weight:700}
p{margin:0}
[dir=ltr]{unicode-bidi:isolate}
bdi,.tf-p b,.resumen b,.mt-p b,.cd-o i{font-variant-numeric:tabular-nums}
.kap{max-width:1120px;margin:0 auto;padding:0 16px}
@media (min-width:720px){.kap{padding:0 28px}}
.saltar{position:absolute;top:8px;inset-inline-start:16px;z-index:100;background:var(--tarjeta);padding:8px 12px;border-radius:8px;clip-path:inset(50%);width:1px;height:1px;overflow:hidden;white-space:nowrap}.saltar:focus{clip-path:none;width:auto;height:auto}
:focus-visible{outline:2px solid var(--acento);outline-offset:2px}
/* Cabecera */
.top{position:sticky;top:0;z-index:50;background:color-mix(in srgb,var(--papel) 92%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--linea)}
.top .kap{display:flex;align-items:center;gap:12px;min-height:60px}
.marca{font:600 17px/1 var(--sans);text-decoration:none;white-space:nowrap;display:flex;gap:8px;align-items:center}
.marca span{color:var(--acento)}
@media (max-width:420px){.marca{font-size:15px}}
/* Portada */
.heroe{padding:28px 0 36px}
.heroe-k{display:grid;gap:24px}
@media (min-width:960px){.heroe{padding:56px 0 64px}.heroe-k{grid-template-columns:1.1fr .9fr;gap:48px;align-items:center}}
.ceja{font:600 12px/1.2 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--acento);margin-bottom:12px}
html[dir=rtl] .ceja{letter-spacing:0;font-size:14px}
h1{font-size:clamp(34px,7.4vw,64px)}
.respuesta{margin-top:16px;font-size:17px;line-height:1.65;color:var(--gris);max-width:62ch}
.respuesta bdi{color:var(--tinta);font-weight:600}
.resumen{list-style:none;margin:24px 0 0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
@media (max-width:559px){.resumen li:last-child:nth-child(odd){grid-column:1/-1}}@media (min-width:560px){.resumen{grid-template-columns:repeat(6,minmax(0,1fr))}.resumen li{grid-column:span 2}.resumen li:nth-child(n+4){grid-column:span 3}}
.resumen a{display:flex;flex-direction:column;gap:4px;height:100%;padding:12px 14px;border:1px solid var(--linea);border-radius:12px;background:var(--tarjeta);text-decoration:none;transition:border-color .2s}
.resumen a:hover{border-color:var(--tinta)}
.resumen span{font-size:13px;color:var(--gris);line-height:1.3}
.resumen b{font-size:21px;font-weight:600;letter-spacing:-.01em}
.resumen small{font-size:12px;font-weight:500;color:var(--gris)}
.heroe-f{margin:0}
.heroe-f img{width:100%;aspect-ratio:3/2;object-fit:cover;border-radius:var(--r)}
figcaption{font-size:11px;color:var(--gris);margin-top:6px}
figcaption a{color:inherit}
/* La regla de oro: guía aparte de todo lo demás */
.regla{background:var(--tinta);color:var(--papel)}
.regla-k{display:grid;gap:0;padding-top:4px;padding-bottom:4px}
@media (min-width:720px){.regla-k{grid-template-columns:1fr 1fr}}
.regla-k>div{padding:22px 0}
.regla-k>div+div{border-top:1px solid rgba(243,238,228,.2)}
@media (min-width:720px){.regla-k>div{padding:30px 0}.regla-k>div+div{border-top:0;border-inline-start:1px solid rgba(243,238,228,.2);padding-inline-start:32px}}
.regla h2{font-size:clamp(22px,3.2vw,30px);margin-bottom:6px}
.regla-k>div:first-child h2{color:#f0a48f}
.regla p{color:rgba(243,238,228,.82);max-width:52ch}
/* Índice de secciones (se desliza en el móvil) */
.indice{position:sticky;top:60px;z-index:40;background:var(--papel);border-bottom:1px solid var(--linea)}
.indice ul{list-style:none;margin:0;padding:10px 0;display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}
.indice ul::-webkit-scrollbar{display:none}
.indice a{display:inline-flex;align-items:center;min-height:36px;padding:0 14px;border-radius:999px;border:1px solid var(--linea);text-decoration:none;font-size:14px;white-space:nowrap;background:var(--tarjeta)}
.indice a:hover{border-color:var(--tinta)}
/* Bloques */
.bloque{padding:52px 0;scroll-margin-top:112px}
@media (min-width:720px){.bloque{padding:80px 0}}
.bloque-claro{background:var(--papel2)}
.bloque>.kap>h2{font-size:clamp(28px,5vw,44px)}
.sub{color:var(--gris);margin:10px 0 28px;max-width:64ch;font-size:16.5px}
.estrecho{max-width:820px}
.mas{margin-top:18px}.mas a{font-weight:600}
/* Tarifario */
.tf{list-style:none;margin:0;padding:0;border-top:2px solid var(--tinta)}
.tf-f{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px 20px;padding:22px 0;border-bottom:1px solid var(--linea);scroll-margin-top:120px}
.tf-dest{position:relative}
.tf-dest::before{content:"";position:absolute;inset-block:14px;inset-inline-start:-14px;width:3px;border-radius:3px;background:var(--acento)}
@media (max-width:719px){.tf-dest::before{inset-inline-start:-10px}}
.tf-q h3{font-size:clamp(21px,3vw,27px)}
.tf-d{font-weight:600;font-size:14px;margin-top:4px}
.tf-u{color:var(--gris);margin-top:4px;max-width:56ch}
.tf-l{display:inline-flex;align-items:center;gap:6px;margin-top:8px;font-weight:600;font-size:15px;min-height:32px}
.tf-p{text-align:end;display:flex;flex-direction:column;align-items:flex-end;gap:2px}
.tf-p small{font-size:13px;color:var(--gris)}
.tf-p b{font-family:var(--sans);font-size:clamp(26px,4.4vw,38px);font-weight:600;letter-spacing:-.02em;line-height:1}
.tf-p span{font-size:13px;color:var(--gris)}
.tf-p em{font-style:normal;font-size:12.5px;color:var(--gris);margin-top:4px}
@media (max-width:519px){.tf-f{grid-template-columns:1fr}.tf-p{align-items:flex-start;text-align:start;flex-direction:row;flex-wrap:wrap;align-items:baseline;gap:4px 10px;margin-top:6px}.tf-p em{flex-basis:100%;margin-top:0}}
.nt{margin-top:36px}
.nt h3{font-size:22px;margin-bottom:8px}
.nt dl{margin:0;display:grid;gap:0}
.nt dl>div{padding:14px 0;border-bottom:1px solid var(--linea);display:grid;gap:4px}
@media (min-width:720px){.nt dl>div{grid-template-columns:240px minmax(0,1fr);gap:24px}}
.nt dt{font-weight:600}
.nt dd{margin:0;color:var(--gris)}
.nt dd a{color:var(--tinta);font-weight:600;white-space:nowrap}
/* Qué incluye */
.inc{display:grid;gap:14px;margin-top:24px}
@media (min-width:720px){.inc{grid-template-columns:1fr 1fr;gap:20px}}
.inc>div{padding:22px;border-radius:var(--r);background:var(--tarjeta);border:1px solid var(--linea)}
.inc h3{font-size:20px;margin-bottom:12px}
.inc ul{margin:0;padding:0;list-style:none;display:grid;gap:10px}
.inc li{position:relative;padding-inline-start:26px}
.inc li::before{position:absolute;inset-inline-start:0;top:0;font-weight:700}
.inc-si li::before{content:"✓";color:#2f6b3a}
.inc-no{border-color:var(--tinta)!important}
.inc-no li::before{content:"✕";color:var(--acento)}
/* Ciudades */
.cd{list-style:none;margin:0;padding:0;display:grid;gap:18px}
.cd-c{display:grid;gap:16px;padding:16px;border-radius:var(--r);background:var(--tarjeta);border:1px solid var(--linea)}
@media (min-width:720px){.cd-c{grid-template-columns:280px minmax(0,1fr);gap:24px;padding:20px}}
.cd-c figure{margin:0}
.cd-c img{width:100%;aspect-ratio:3/2;object-fit:cover;border-radius:calc(var(--r) - 6px)}
.cd-t h3{font-size:26px}
.cd-desde{font-size:13px;font-weight:600;color:var(--acento);margin:4px 0 8px}
.cd-t>p:not(.cd-desde){color:var(--gris)}
.cd-o{list-style:none;margin:14px 0 0;padding:0;border-top:1px solid var(--linea)}
.cd-o li{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;padding:12px 0;border-bottom:1px solid var(--linea)}
.cd-o li div{display:grid;gap:2px}
.cd-o span{color:var(--gris);font-size:15px}
.cd-o i{font-style:normal;font-weight:600;font-size:18px;white-space:nowrap}
/* Montaña */
.mt{list-style:none;margin:0;padding:0;display:grid;gap:0;border-top:2px solid var(--tinta)}
@media (min-width:860px){.mt{grid-template-columns:1fr 1fr;column-gap:40px}}
.mt li{display:grid;grid-template-columns:52px minmax(0,1fr) auto;gap:14px;align-items:start;padding:16px 0;border-bottom:1px solid var(--linea)}
.mt-k{font:500 15px/1.2 'Hiragino Mincho ProN','Yu Mincho',serif;writing-mode:vertical-rl;color:var(--acento);justify-self:center;max-height:96px}
.mt-t h3{font-size:19px}
.mt-t p{color:var(--gris);font-size:14.5px;margin-top:2px}
.mt-m{font-size:13px!important}
.mt-p{text-align:end;display:grid;gap:2px}
.mt-p b{font-size:20px;font-weight:600}
.mt-p span{font-size:12px;color:var(--gris)}
/* Planes */
.pn{list-style:none;margin:0;padding:0;display:grid;gap:14px}
@media (min-width:720px){.pn{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (min-width:1040px){.pn{grid-template-columns:repeat(3,minmax(0,1fr))}}
.pn>li{display:flex;flex-direction:column;gap:10px;padding:20px;border-radius:var(--r);background:var(--tarjeta);border:1px solid var(--linea);scroll-margin-top:120px}
.pn h3{font-size:21px}
.pn>li>p{color:var(--gris)}
.pn-r{margin:0;padding-inline-start:18px;display:grid;gap:4px;font-size:15px}
.sello{align-self:flex-start;font-size:13px;font-weight:600;color:#2f6b3a;border:1px solid currentColor;border-radius:999px;padding:3px 10px}
.pn-p{margin-top:auto!important;padding-top:12px;border-top:1px solid var(--linea);font-size:14.5px;color:var(--tinta)!important}
.pn-p span{color:var(--gris)}
.pn-x p{font-size:12.5px;font-weight:600;color:var(--gris);margin-bottom:6px}
.pn-x div{display:flex;flex-wrap:wrap;gap:6px}
.pn-x span{font-size:13px;padding:4px 10px;border-radius:999px;background:var(--papel2)}
.pn-x b,.ex-p b,.kit b{color:var(--acento);font-weight:700}
/* Experiencias */
.ex{list-style:none;margin:0;padding:0;display:grid;gap:12px}
@media (min-width:640px){.ex{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (min-width:1000px){.ex{grid-template-columns:repeat(3,minmax(0,1fr))}}
.ex>li{display:flex;flex-direction:column;gap:8px;padding:18px;border-radius:var(--r);background:var(--tarjeta);border:1px solid var(--linea)}
.ex-c{font-size:12.5px;font-weight:600;color:var(--gris);letter-spacing:.04em}
.ex-m{color:#2f6b3a}
.ex h3{font-size:19px;font-family:var(--sans)}
.ex>li>p:not(.ex-c):not(.ex-p){color:var(--gris);font-size:15px}
.ex-p{margin-top:auto!important;padding-top:10px;border-top:1px dashed var(--linea);font-size:13.5px}
.ex>li>a{font-weight:600;font-size:14.5px;min-height:32px;display:inline-flex;align-items:center;gap:6px}
.kit{margin-top:28px;padding:20px;border-radius:var(--r);border:1px solid var(--tinta);display:grid;gap:14px;background:var(--tarjeta)}
@media (min-width:860px){.kit{grid-template-columns:1fr auto auto;align-items:center;gap:28px}}
.kit h3{font-size:20px}.kit p{color:var(--gris);font-size:15px;margin-top:2px}
.kit ul{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px}
.kit li{font-size:14px;padding:6px 12px;border-radius:999px;background:var(--papel2)}
.kit>a{font-weight:600;white-space:nowrap}
/* Preguntas */
#preguntas details{border-top:1px solid var(--linea);padding:4px 0}
#preguntas details:last-of-type{border-bottom:1px solid var(--linea)}
#preguntas summary{cursor:pointer;font-weight:600;font-size:17px;min-height:52px;display:flex;align-items:center;list-style:none;gap:12px;justify-content:space-between}
#preguntas summary::-webkit-details-marker{display:none}
#preguntas summary::after{content:"+";font-size:22px;color:var(--acento);flex:none}
#preguntas details[open] summary::after{content:"−"}
#preguntas details p{color:var(--gris);padding:0 0 16px;max-width:68ch}
#preguntas h2{margin-bottom:20px}
/* Cierre */
.cierre{padding:64px 0;background:var(--tinta);color:var(--papel);text-align:center}
.cierre h2{font-size:clamp(28px,5vw,44px)}
.cierre p{color:rgba(243,238,228,.8);margin:10px auto 24px;max-width:48ch}
.btn{display:inline-flex;align-items:center;gap:10px;min-height:52px;padding:0 26px;border-radius:999px;background:var(--acento);color:var(--acento-t);font-weight:600;font-size:17px;text-decoration:none;transition:transform .15s}
.btn:active{transform:scale(.97)}
footer{background:var(--papel2);padding-top:48px;color:var(--tinta)}
`.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '')

for (const lang of LANGS) {
  const dir = join(root, 'public', RUTA[lang])
  mkdirSync(dir, { recursive: true })
  const html = pagina(lang)
  writeFileSync(join(dir, 'index.html'), html)
  console.log(`precios: ${RUTA[lang]} (${Math.round(html.length / 1024)} KB)`)
}
