// Herramientas gratis para viajar por Kansai (ES / EN / AR), HTML estático.
//   · Hub:               /es/herramientas/ · /en/tools/ · /ar/tools/
//   · Tarjeta de comida: halal, sin cerdo, sin alcohol, vegetariano, vegano y alergias, en japonés
//   · Tarjeta de taxi:   destinos de Kansai (y tu hotel) en japonés, con voz y Google Maps
//
// Cada página lleva texto útil FUERA del formulario (las IAs leen el HTML sin JS
// y quitan form/button/script): respuesta, cómo se usa, frases con romaji, FAQ.
// Los precios del guía no se escriben aquí: salen de src/v7/contenido.ts y de
// PRECIO_CORTO (src/v7/datosRespuestasNuevas.ts), igual que en scripts/precios.mjs.
//
// Japonés: registro です/ます, frases cortas. Nombres de las mezquitas comprobados
// (16-11-2026): 大阪茨木モスク (firma «大阪茨木モスク委員会» en osakamosque.org;
// 4-6-13 Toyokawa, Ibaraki) y 神戸ムスリムモスク (kobemosque.com «Kobe Muslim
// Mosque»; 中山手通2-25-14). La de Kioto NO va: no hay fuente fiable de su nombre
// japonés (kyoto.travel solo la llama «Kyoto Mosque»).
//
// Uso: node scripts/herramientas.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { navHTML, pieHTML, menuCSS } from './menu-estatico.mjs'
import { equipoHTML, equipoCSS } from './equipo-estatico.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const { PAGINAS, WA_TONY } = await import('../src/v7/contenido.ts')
const { yenLocal } = await import('../src/v7/formato.ts')

// datosRespuestasNuevas.ts importa sin extensión (Vite sí, Node no): se lee la cifra del fichero.
const mCorto = readFileSync(join(root, 'src/v7/datosRespuestasNuevas.ts'), 'utf8').match(/export const PRECIO_CORTO = (\d+)/)
if (!mCorto) throw new Error('herramientas: no encuentro PRECIO_CORTO en src/v7/datosRespuestasNuevas.ts')
const PRECIO_CORTO = Number(mCorto[1])

const BASE = 'https://tonykansaiguide.com'
const LANGS = ['es', 'en', 'ar']
const HOY = new Date().toISOString().slice(0, 10)

const RUTA = {
  hub: { es: '/es/herramientas/', en: '/en/tools/', ar: '/ar/tools/' },
  comida: { es: '/es/herramientas/tarjeta-comida-japones/', en: '/en/tools/japanese-food-card/', ar: '/ar/tools/halal-food-card/' },
  taxi: { es: '/es/herramientas/tarjeta-taxi-japones/', en: '/en/tools/japanese-taxi-card/', ar: '/ar/tools/taxi-card-japanese/' },
  // Las dos siguientes las genera scripts/herramientas-viaje.mjs (otro script).
  trenes: { es: '/es/herramientas/transporte-kansai/', en: '/en/tools/kansai-train-times-fares/', ar: '/ar/tools/kansai-trains/' },
  planificador: { es: '/es/herramientas/planificador-kansai/', en: '/en/tools/kansai-itinerary-planner/', ar: '/ar/tools/kansai-itinerary-planner/' },
  calculadora: { es: '/es/calculadora-guia/', en: '/en/private-guide-calculator/', ar: '/ar/private-guide-calculator/' },
  precios: { es: '/es/precios/', en: '/en/prices/', ar: '/ar/prices/' },
  rutas: { es: '/es/rutas/', en: '/en/routes/', ar: '/ar/routes/' },
  otono: { es: '/es/otono-kioto/', en: '/en/kyoto-autumn/', ar: '/ar/kyoto-autumn/' },
  sakura: { es: '/es/sakura-kioto/', en: '/en/kyoto-cherry-blossom/', ar: '/ar/kyoto-cherry-blossom/' },
  osakaKioto: { es: '/es/osaka-kioto/', en: '/en/osaka-to-kyoto/', ar: '/en/osaka-to-kyoto/' },
  aeropuerto: { es: '/es/aeropuerto-kansai/', en: '/en/kansai-airport/', ar: '/en/kansai-airport/' },
  ventajas: { es: '/es/ventajas/', en: '/en/perks/', ar: '/ar/perks/' },
  mezquitas: { es: '/en/mosques-kansai/', en: '/en/mosques-kansai/', ar: '/ar/mosques-kansai/' },
  halal: { es: '/ar/halal-kyoto-osaka/', en: '/ar/halal-kyoto-osaka/', ar: '/ar/halal-kyoto-osaka/' },
  inicio: { es: '/es/', en: '/en/', ar: '/ar/' },
}
const YUBISASHI = 'https://2troll.github.io/yubisashi/'

// ── Utilidades ──────────────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
// Tramos de japonés (kana, kanji, signos de ancho completo) → <span lang="ja" dir="ltr">.
const RE_JA = /[　-〿぀-ヿ㐀-䶿一-鿿！-～]+/g
// Los tramos cortos no se parten al final de la línea (en árabe, un japonés partido se lee al revés).
const tx = (s) => esc(s).replace(RE_JA, (m) => `<span lang="ja" dir="ltr"${m.length <= 14 ? ' class="nw"' : ''}>${m}</span>`)
const ja = (s) => `<span lang="ja" dir="ltr">${esc(s)}</span>`
const flecha = (lang) => (lang === 'ar' ? '←' : '→')
const wa = (msg) => `https://wa.me/${WA_TONY}?text=${encodeURIComponent(msg)}`
const mapa = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
const jsonScript = (o) => JSON.stringify(o).replace(/</g, '\\u003c')

function precios(lang) {
  const pl = PAGINAS[lang].precios.planes
  if (pl.length !== 3) throw new Error(`herramientas: contenido.ts (${lang}) ya no tiene 3 tarifas; revisa este script`)
  return { corto: yenLocal(PRECIO_CORTO, lang), medio: yenLocal(pl[0].yenes, lang), completo: yenLocal(pl[1].yenes, lang), lejos: yenLocal(pl[2].yenes, lang) }
}

// ── Textos comunes (menú, pie) ──────────────────────────────────────────────
const COMUN = {
  es: {
    nav: { etiqueta: 'Secciones', abrir: 'Abrir menú', g1: 'Herramientas', g2: 'Tours', g3: 'Más', cta: 'WhatsApp' },
    herr: [['Todas las herramientas', RUTA.hub.es], ['Tarjeta de comida en japonés', RUTA.comida.es], ['Tarjeta para el taxi', RUTA.taxi.es], ['Trenes de Kansai', RUTA.trenes.es], ['Planificador de días', RUTA.planificador.es], ['¿Te compensa un guía?', RUTA.calculadora.es]],
    tours: [['Tour de 2 horas en Kioto', '/es/guia-privado-kioto-2-horas/'], ['Tour en bici por Kioto', '/es/tour-privado-bici-kioto/'], ['Rutas por ciudad', '/es/rutas/'], ['Montaña', '/es/montana/']],
    mas: [['Página de Tony', '/es/'], ['Precios', '/es/precios/'], ['Ventajas para tu viaje', '/es/ventajas/']],
    pie: { intro: 'Tony Hanma es guía privado en español, inglés y árabe en Kansai. Herramientas gratis para tu viaje; precios del guía por grupo, con entradas, trenes y comidas aparte.', c1: 'Herramientas', c2: 'Tours', c3: 'Contacto', act: 'Actualizado', mas: 'Ver todo' },
    migas: 'Herramientas', idioma: 'Español', faqH: 'Preguntas frecuentes', relH: 'Para seguir', ctaB: 'Escribir por WhatsApp', saltar: 'Ir al contenido',
  },
  en: {
    nav: { etiqueta: 'Sections', abrir: 'Open menu', g1: 'Tools', g2: 'Tours', g3: 'More', cta: 'WhatsApp' },
    herr: [['All tools', RUTA.hub.en], ['Japanese food card', RUTA.comida.en], ['Japanese taxi card', RUTA.taxi.en], ['Kansai trains', RUTA.trenes.en], ['Itinerary planner', RUTA.planificador.en], ['Is a guide worth it?', RUTA.calculadora.en]],
    tours: [['2-hour Kyoto tour', '/en/kyoto-private-guide-2-hours/'], ['Kyoto bike tour', '/en/kyoto-private-bike-tour/'], ['Routes by city', '/en/routes/'], ['Hiking', '/en/hiking/']],
    mas: [['Tony’s page', '/en/'], ['Prices', '/en/prices/'], ['Perks for your trip', '/en/perks/']],
    pie: { intro: 'Tony Hanma is a private guide in English, Spanish and Arabic in Kansai. Free tools for your trip; guide prices per group, with tickets, trains and meals extra.', c1: 'Tools', c2: 'Tours', c3: 'Contact', act: 'Updated', mas: 'See all' },
    migas: 'Tools', idioma: 'English', faqH: 'Frequently asked questions', relH: 'Keep going', ctaB: 'Message on WhatsApp', saltar: 'Skip to content',
  },
  ar: {
    nav: { etiqueta: 'الأقسام', abrir: 'افتح القائمة', g1: 'الأدوات', g2: 'الجولات', g3: 'المزيد', cta: 'واتساب' },
    herr: [['كل الأدوات', RUTA.hub.ar], ['بطاقة الطعام الحلال باليابانية', RUTA.comida.ar], ['بطاقة التاكسي باليابانية', RUTA.taxi.ar], ['قطارات كانساي', RUTA.trenes.ar], ['مخطط الأيام', RUTA.planificador.ar], ['هل يستحق المرشد؟', RUTA.calculadora.ar]],
    tours: [['جولة ساعتين في كيوتو', '/ar/kyoto-private-guide-2-hours/'], ['جولة الدراجة في كيوتو', '/ar/kyoto-private-bike-tour/'], ['المسارات حسب المدينة', '/ar/routes/'], ['الجبال', '/ar/hiking/']],
    mas: [['صفحة طوني', '/ar/'], ['الأسعار', '/ar/prices/'], ['مزايا لرحلتك', '/ar/perks/'], ['المساجد في كانساي', '/ar/mosques-kansai/']],
    pie: { intro: 'طوني هانما مرشد خاص بالعربية والإسبانية والإنجليزية في كانساي. أدوات مجانية لرحلتك؛ وأسعار المرشد للمجموعة، والتذاكر والقطارات والوجبات على حدة.', c1: 'الأدوات', c2: 'الجولات', c3: 'التواصل', act: 'آخر تحديث', mas: 'عرض الكل' },
    migas: 'الأدوات', idioma: 'العربية', faqH: 'أسئلة شائعة', relH: 'لمتابعة التخطيط', ctaB: 'راسلني على واتساب', saltar: 'انتقل إلى المحتوى',
  },
}

// ════════════════════════════════════════════════════════════════════════════
// 1. HUB
// ════════════════════════════════════════════════════════════════════════════
const HUB = {
  es: {
    title: 'Herramientas gratis para viajar por Kansai (Kioto, Osaka, Nara) | Tony Kansai Guide',
    desc: 'Tarjetas en japonés para el restaurante y el taxi, trenes, precios, rutas y previsión del otoño y la sakura en Kioto, Osaka y Nara. Gratis y sin registro.',
    ceja: 'Herramientas gratis · Kansai',
    h1: 'Herramientas gratis para viajar por Kansai: Kioto, Osaka y Nara',
    lead: 'Para los problemas de verdad de un viaje por Kansai: explicar en japonés lo que no puedes comer, decirle al taxista adónde vas, saber qué tren coger y cuánto cuesta, y repartir los días. Todo es gratis, no pide registro y está pensado para el móvil. Las prepara Tony Hanma, guía privado en español, inglés y árabe en Kioto, Osaka y Nara.',
    grupos: { calle: ['Para la calle', 'Lo que se usa en el momento: en la mesa, en el taxi, en el andén.'], planear: ['Para planear el viaje', 'Antes de salir de casa: días, rutas, fechas y precios.'], musulman: null },
    t: {
      comida: ['Tarjeta de comida en japonés', 'Halal, sin cerdo, sin alcohol, vegetariano, vegano o con alergias: marcas lo tuyo y se lo enseñas al camarero a pantalla completa, con voz en japonés.', 'Para quien no puede arriesgarse con lo que come.'],
      taxi: ['Tarjeta para el taxi', 'Eliges el destino o escribes tu hotel, y el taxista lo lee en japonés y en grande. Con botón para abrirlo en Google Maps.', 'Para moverte en taxi sin hablar japonés.'],
      trenes: ['Trenes de Kansai: tiempos y precios', 'Qué tren coger entre Kioto, Osaka, Nara, Kobe y el aeropuerto, cuánto tarda y cuánto cuesta.', 'Para quien va por su cuenta de una ciudad a otra.'],
      yubisashi: ['Yubisashi: señalar para pedir', 'Hojas para señalar con el dedo en restaurantes y hoteles, pensadas para clientes musulmanes y para el personal japonés. App externa y gratis.', 'Para pedir sin hablar, solo señalando.'],
      planificador: ['Planificador de días en Kansai', 'Organiza qué ver cada día en Kioto, Osaka, Nara y alrededores según los días que tengas.', 'Para quien aún está montando el viaje.'],
      rutas: ['Rutas hora a hora', 'Días en Kioto, Osaka, Nara, Kobe y Himeji, hora a hora, saliendo desde Osaka.', 'Para quien quiere un plan ya hecho.'],
      calculadora: ['¿Te compensa un guía?', 'Cuatro preguntas y te dice si te conviene un guía privado o ir por tu cuenta, con el precio por persona.', 'Para decidir con números, no a ojo.'],
      precios: ['Precios del guía', 'Lo que cuesta un día con Tony, por grupo, y qué se paga aparte.', 'Para saber el precio cerrado antes de escribir.'],
      otono: ['Previsión del otoño en Kioto', 'Cuándo se ponen rojos los arces de Kioto, para elegir bien las fechas.', 'Para viajes de noviembre y diciembre.'],
      sakura: ['Previsión de la sakura en Kioto', 'Cuándo florecen los cerezos en Kioto, para acertar con las fechas.', 'Para viajes de marzo y abril.'],
      osakaKioto: ['De Osaka a Kioto en tren', 'Las formas de ir en tren de Osaka a Kioto y cuál te conviene.', 'Para quien duerme en Osaka y visita Kioto.'],
      aeropuerto: ['Aeropuerto de Kansai', 'Cómo llegar del aeropuerto de Kansai (KIX) a Osaka y a Kioto.', 'Para el día que aterrizas.'],
      ventajas: ['Ventajas y descuentos', 'Códigos de descuento para internet, consigna de maletas y experiencias con nuestros socios.', 'Para ahorrar en lo que vas a pagar igualmente.'],
    },
    muestra: { comida: 'ハラール', taxi: 'この場所までお願いします。' },
    externa: 'App externa',
    guiaH: 'Cuándo te conviene un guía',
    guiaP: 'Las herramientas te sacan de un apuro. Un guía te ahorra el día entero cuando:',
    guiaL: [
      'Tienes uno o dos días en Kioto y no quieres perderlos en autobuses llenos y colas.',
      'Viajas con niños o con personas mayores, o es tu primera vez en Japón.',
      'Comes halal o rezas, y quieres que la ruta pase por sitios para comer y para rezar a su hora.',
      'Quieres ver Kioto y Nara en un mismo día sin pelearte con trenes y horarios.',
    ],
    guiaPrecio: (p) => `Tony te recoge en tu hotel y el día es solo para tu grupo. Precio por grupo de hasta 6 personas; hasta 14, bajo consulta. Entradas, trenes y comidas, aparte.`,
    tarifas: (p) => [['2 horas en Kioto', p.corto], ['Medio día (4 h)', p.medio], ['Día completo (8 h)', p.completo], ['Excursión lejana', `desde ${p.lejos}`]],
    guiaB: ['Ver la página de Tony', RUTA.inicio.es],
    msg: 'Hola, Tony. Vengo de las herramientas gratis y me gustaría un tour. Fechas: … Personas: …',
    faq: (p) => [
      ['¿Las herramientas son gratis?', 'Sí. Todas son gratis y no piden registro, correo ni pago. Las tarjetas en japonés funcionan en el navegador del móvil.'],
      ['¿Qué hago en un restaurante si no hablo japonés?', 'Usa la tarjeta de comida: marcas si comes halal, sin cerdo, sin alcohol, vegetariano, vegano o qué alergias tienes, y se la enseñas al camarero a pantalla completa. Si prefieres señalar, la app Yubisashi tiene hojas para pedir con el dedo.'],
      ['¿Cómo le digo al taxista adónde voy?', 'Con la tarjeta para el taxi: eliges el destino (sitios de Kioto, Osaka, Nara, Kobe y Himeji, el aeropuerto o una mezquita) o escribes tu hotel, y el taxista lo ve en japonés y en grande.'],
      ['¿Se guarda lo que escribo?', 'Solo en tu propio móvil, en el almacenamiento del navegador, para que no tengas que marcarlo otra vez. No se envía a ningún sitio.'],
      ['¿Las frases en japonés son correctas?', 'Son frases cortas en japonés educado (el registro です/ます que usa un cliente con el camarero o con el taxista), con su lectura en romaji y su traducción en la misma página.'],
      ['¿Cuánto cuesta un guía privado en Kansai?', `Por grupo de hasta 6 personas: 2 horas en Kioto ${p.corto}, medio día (4 h) ${p.medio}, día completo (8 h) ${p.completo} y excursiones lejanas desde ${p.lejos}. Entradas, trenes y comidas, aparte.`],
      ['¿Hay herramientas para viajeros musulmanes?', 'Sí: la tarjeta de comida tiene la opción halal, la de taxi incluye las mezquitas de Osaka Ibaraki y de Kobe, y hay páginas en árabe sobre mezquitas y comida halal en Kioto y Osaka.'],
    ],
  },
  en: {
    title: 'Free travel tools for Kansai (Kyoto, Osaka, Nara) | Tony Kansai Guide',
    desc: 'Japanese cards for restaurants and taxis, train times and fares, prices, routes and autumn and cherry blossom forecasts for Kyoto, Osaka and Nara. Free.',
    ceja: 'Free tools · Kansai',
    h1: 'Free tools for travelling in Kansai: Kyoto, Osaka and Nara',
    lead: 'For the real problems of a Kansai trip: explaining in Japanese what you can’t eat, telling the taxi driver where you’re going, knowing which train to take and what it costs, and planning your days. Everything is free, needs no sign-up and is built for your phone. Made by Tony Hanma, a private guide in English, Spanish and Arabic in Kyoto, Osaka and Nara.',
    grupos: { calle: ['On the street', 'What you use in the moment: at the table, in the taxi, on the platform.'], planear: ['Planning the trip', 'Before you leave home: days, routes, dates and prices.'], musulman: null },
    t: {
      comida: ['Japanese food card', 'Halal, no pork, no alcohol, vegetarian, vegan or allergies: tick yours and show the waiter a full-screen card, with a Japanese voice.', 'For anyone who can’t take chances with food.'],
      taxi: ['Japanese taxi card', 'Pick a destination or type your hotel, and the driver reads it in large Japanese. With a button to open it in Google Maps.', 'For getting around by taxi without speaking Japanese.'],
      trenes: ['Kansai trains: times and fares', 'Which train to take between Kyoto, Osaka, Nara, Kobe and the airport, how long it takes and what it costs.', 'For travelling between cities on your own.'],
      yubisashi: ['Yubisashi: point to order', 'Pointing sheets for restaurants and hotels, made for Muslim guests and Japanese staff. External app, free.', 'For ordering without talking, just pointing.'],
      planificador: ['Kansai itinerary planner', 'Organise what to see each day in Kyoto, Osaka, Nara and around, based on the days you have.', 'For anyone still putting the trip together.'],
      rutas: ['Routes hour by hour', 'Days in Kyoto, Osaka, Nara, Kobe and Himeji, hour by hour, starting from Osaka.', 'For anyone who wants a ready-made plan.'],
      calculadora: ['Is a guide worth it?', 'Four questions tell you whether a private guide makes sense or you’re better off alone, with the price per person.', 'For deciding with numbers, not guesswork.'],
      precios: ['Guide prices', 'What a day with Tony costs, per group, and what is paid separately.', 'For knowing the fixed price before you write.'],
      otono: ['Kyoto autumn forecast', 'When Kyoto’s maples turn red, so you can pick the right dates.', 'For November and December trips.'],
      sakura: ['Kyoto cherry blossom forecast', 'When the cherry trees bloom in Kyoto, so your dates hit the season.', 'For March and April trips.'],
      osakaKioto: ['Osaka to Kyoto by train', 'The ways to get from Osaka to Kyoto by train and which one suits you.', 'For anyone staying in Osaka and visiting Kyoto.'],
      aeropuerto: ['Kansai Airport', 'How to get from Kansai Airport (KIX) to Osaka and Kyoto.', 'For the day you land.'],
      ventajas: ['Perks and discounts', 'Discount codes for mobile data, luggage storage and experiences with our partners.', 'For saving on things you’ll pay for anyway.'],
    },
    muestra: { comida: 'ハラール', taxi: 'この場所までお願いします。' },
    externa: 'External app',
    guiaH: 'When a guide is worth it',
    guiaP: 'The tools get you out of a jam. A guide saves you the whole day when:',
    guiaL: [
      'You have one or two days in Kyoto and don’t want to lose them to crowded buses and queues.',
      'You’re travelling with children or older relatives, or it’s your first time in Japan.',
      'You eat halal or pray, and want the route to pass places to eat and to pray on time.',
      'You want Kyoto and Nara in one day without fighting trains and timetables.',
    ],
    guiaPrecio: () => 'Tony picks you up at your hotel and the day is for your group only. Price per group of up to 6; up to 14 on request. Tickets, trains and meals extra.',
    tarifas: (p) => [['2 hours in Kyoto', p.corto], ['Half day (4 h)', p.medio], ['Full day (8 h)', p.completo], ['Long day trip', `from ${p.lejos}`]],
    guiaB: ['See Tony’s page', RUTA.inicio.en],
    msg: 'Hi Tony, I’m coming from the free tools and I’d like a tour. Dates: … People: …',
    faq: (p) => [
      ['Are the tools free?', 'Yes. They are all free and ask for no sign-up, email or payment. The Japanese cards work in your phone’s browser.'],
      ['What do I do in a restaurant if I don’t speak Japanese?', 'Use the food card: tick whether you eat halal, no pork, no alcohol, vegetarian, vegan or which allergies you have, and show the waiter the full-screen card. If you’d rather point, the Yubisashi app has sheets for ordering with your finger.'],
      ['How do I tell a taxi driver where I’m going?', 'With the taxi card: pick the destination (sights in Kyoto, Osaka, Nara, Kobe and Himeji, the airport or a mosque) or type your hotel, and the driver sees it in large Japanese.'],
      ['Is what I type saved?', 'Only on your own phone, in the browser’s storage, so you don’t have to tick it again. It is not sent anywhere.'],
      ['Is the Japanese correct?', 'They are short sentences in polite Japanese (the です/ます register a customer uses with a waiter or a taxi driver), with romaji and a translation on the same page.'],
      ['How much does a private guide in Kansai cost?', `Per group of up to 6: 2 hours in Kyoto ${p.corto}, half day (4 h) ${p.medio}, full day (8 h) ${p.completo} and long day trips from ${p.lejos}. Tickets, trains and meals extra.`],
      ['Are there tools for Muslim travellers?', 'Yes: the food card has a halal option, the taxi card includes the Osaka Ibaraki and Kobe mosques, and there are Arabic pages on mosques and halal food in Kyoto and Osaka.'],
    ],
  },
  ar: {
    title: 'أدوات مجانية للسفر في كانساي (كيوتو وأوساكا ونارا) | Tony Kansai Guide',
    desc: 'بطاقات باليابانية للمطعم والتاكسي، والقطارات وأسعارها، ومخطط الأيام، والمساجد والطعام الحلال في كيوتو وأوساكا ونارا. كلها مجانية ودون تسجيل.',
    ceja: 'أدوات مجانية · كانساي',
    h1: 'أدوات مجانية للسفر في كانساي: كيوتو وأوساكا ونارا',
    lead: 'للمواقف الحقيقية في رحلتك إلى كانساي: أن تشرح باليابانية أنك تأكل حلالًا، وأن تخبر سائق التاكسي إلى أين تذهب، وأن تعرف أي قطار تركب وكم يكلّف، وأن ترتّب أيامك. كلها مجانية، ولا تحتاج إلى تسجيل، ومصمّمة للجوال. يعدّها طوني هانما، المرشد الخاص بالعربية والإسبانية والإنجليزية في كيوتو وأوساكا ونارا.',
    grupos: { calle: ['في الطريق', 'ما تستعمله في اللحظة نفسها: على المائدة، وفي التاكسي، وعلى رصيف المحطة.'], planear: ['لتخطيط الرحلة', 'قبل أن تغادر بيتك: الأيام والمسارات والتواريخ والأسعار.'], musulman: ['للمسافر المسلم', 'الصلاة والطعام الحلال في كانساي.'] },
    t: {
      comida: ['بطاقة الطعام الحلال باليابانية', 'حلال، أو بلا خنزير، أو بلا كحول، أو نباتي، أو حساسية من أطعمة: تختار ما يناسبك وتعرضه على النادل بملء الشاشة، مع صوت ياباني.', 'لمن لا يقبل المجازفة فيما يأكل.'],
      taxi: ['بطاقة التاكسي باليابانية', 'تختار وجهتك أو تكتب اسم فندقك، فيقرؤها السائق باليابانية وبخط كبير. وفيها زر يفتح المكان في خرائط Google.', 'للتنقل بالتاكسي دون أن تتكلم اليابانية.'],
      trenes: ['قطارات كانساي: المدة والأسعار', 'أي قطار تركب بين كيوتو وأوساكا ونارا وكوبي والمطار، وكم يستغرق، وكم يكلّف.', 'لمن يتنقل وحده بين المدن.'],
      yubisashi: ['Yubisashi: أشِر لتطلب', 'صفحات تشير فيها بإصبعك في المطاعم والفنادق، مصمّمة للضيوف المسلمين وللعاملين اليابانيين. تطبيق خارجي ومجاني.', 'لتطلب دون كلام، بالإشارة فقط.'],
      planificador: ['مخطط الأيام في كانساي', 'رتّب ما تزوره كل يوم في كيوتو وأوساكا ونارا وما حولها حسب عدد أيامك.', 'لمن ما زال يجهّز رحلته.'],
      rutas: ['المسارات ساعة بساعة', 'أيام في كيوتو وأوساكا ونارا وكوبي وهيميجي، ساعة بساعة، انطلاقًا من أوساكا.', 'لمن يريد خطة جاهزة.'],
      calculadora: ['هل يستحق المرشد؟', 'أربعة أسئلة تعرف بعدها إن كان المرشد الخاص مناسبًا لك أم الأفضل أن تذهب وحدك، مع السعر للشخص.', 'لتقرّر بالأرقام لا بالتخمين.'],
      precios: ['أسعار المرشد', 'كم يكلّف يوم مع طوني للمجموعة، وما الذي يُدفع على حدة.', 'لتعرف السعر الثابت قبل أن تراسلني.'],
      otono: ['توقعات الخريف في كيوتو', 'متى تحمرّ أوراق القيقب في كيوتو، لتختار التواريخ المناسبة.', 'لرحلات نوفمبر وديسمبر.'],
      sakura: ['توقعات أزهار الكرز في كيوتو', 'متى تتفتح أزهار الساكورا في كيوتو، لتصيب موسمها.', 'لرحلات مارس وأبريل.'],
      osakaKioto: ['من أوساكا إلى كيوتو بالقطار', 'طرق الذهاب بالقطار من أوساكا إلى كيوتو وأيها يناسبك (الصفحة بالإنجليزية).', 'لمن يقيم في أوساكا ويزور كيوتو.'],
      aeropuerto: ['مطار كانساي', 'كيف تصل من مطار كانساي (KIX) إلى أوساكا وكيوتو (الصفحة بالإنجليزية).', 'ليوم وصولك.'],
      ventajas: ['مزايا وخصومات', 'رموز خصم للإنترنت وحفظ الحقائب وتجارب مع شركائنا.', 'لتوفّر فيما ستدفعه على أي حال.'],
      mezquitas: ['المساجد في كانساي', 'أين تصلي في كيوتو وأوساكا وكوبي: المساجد، ومصليات مجانية في بعض المعالم.', 'لتحافظ على الصلاة في وقتها أثناء الرحلة.'],
      halal: ['الطعام الحلال في كيوتو وأوساكا', 'أين تأكل حلالًا في كيوتو وأوساكا.', 'للعائلات والمسافرين المسلمين.'],
    },
    muestra: { comida: 'ハラール', taxi: 'この場所までお願いします。' },
    externa: 'تطبيق خارجي',
    guiaH: 'متى يناسبك المرشد؟',
    guiaP: 'الأدوات تُخرجك من موقف صعب، أما المرشد فيوفّر عليك اليوم كله عندما:',
    guiaL: [
      'يكون لديك يوم أو يومان في كيوتو ولا تريد أن تضيّعهما في الحافلات المزدحمة والطوابير.',
      'تسافر مع أطفال أو كبار في السن، أو إنها أول مرة لك في اليابان.',
      'تأكل حلالًا وتصلي، وتريد أن يمرّ المسار بأماكن للأكل وللصلاة في وقتها.',
      'تريد كيوتو ونارا في يوم واحد دون عناء القطارات والمواعيد.',
    ],
    guiaPrecio: () => 'يأتيك طوني إلى الفندق، واليوم لمجموعتك وحدها. السعر للمجموعة حتى 6 أشخاص، وحتى 14 شخصًا عند الطلب. تذاكر الدخول والقطارات والوجبات على حدة.',
    tarifas: (p) => [['ساعتان في كيوتو', p.corto], ['نصف يوم (4 ساعات)', p.medio], ['يوم كامل (8 ساعات)', p.completo], ['رحلة بعيدة', `ابتداءً من ${p.lejos}`]],
    guiaB: ['صفحة طوني', RUTA.inicio.ar],
    msg: 'مرحبًا طوني، جئت من صفحة الأدوات المجانية وأودّ حجز جولة. التواريخ: … عدد الأشخاص: …',
    faq: (p) => [
      ['هل الأدوات مجانية؟', 'نعم، كلها مجانية ولا تطلب تسجيلًا ولا بريدًا إلكترونيًا ولا دفعًا. وبطاقات اليابانية تعمل في متصفح الجوال.'],
      ['ماذا أفعل في المطعم إن لم أكن أتكلم اليابانية؟', 'استخدم بطاقة الطعام: تختار أنك تأكل حلالًا، أو بلا خنزير، أو بلا كحول، أو نباتيًا، أو ما عندك من حساسية، ثم تعرضها على النادل بملء الشاشة. وإن فضّلت الإشارة، ففي تطبيق Yubisashi صفحات تطلب منها بإصبعك.'],
      ['كيف أخبر سائق التاكسي إلى أين أذهب؟', 'ببطاقة التاكسي: تختار الوجهة (معالم كيوتو وأوساكا ونارا وكوبي وهيميجي، أو المطار، أو مسجدًا) أو تكتب اسم فندقك، فيراها السائق باليابانية وبخط كبير.'],
      ['هل يُحفظ ما أكتبه؟', 'يُحفظ في جوالك فقط، في ذاكرة المتصفح، حتى لا تعيد الاختيار كل مرة. ولا يُرسَل إلى أي مكان.'],
      ['هل الجمل اليابانية صحيحة؟', 'هي جمل قصيرة بيابانية مهذبة (صيغة です/ます التي يستعملها الزبون مع النادل أو السائق)، ومعها النطق بالحروف اللاتينية والترجمة في الصفحة نفسها.'],
      ['كم يكلّف المرشد الخاص في كانساي؟', `للمجموعة حتى 6 أشخاص: ساعتان في كيوتو ${p.corto}، ونصف يوم (4 ساعات) ${p.medio}، ويوم كامل (8 ساعات) ${p.completo}، والرحلات البعيدة ابتداءً من ${p.lejos}. التذاكر والقطارات والوجبات على حدة.`],
      ['هل هناك أدوات خاصة بالمسافر المسلم؟', 'نعم: بطاقة الطعام فيها خيار الحلال، وبطاقة التاكسي فيها مسجد أوساكا إيباراكي ومسجد كوبي، وهناك صفحتان بالعربية عن المساجد والطعام الحلال في كيوتو وأوساكا.'],
    ],
  },
}

const ORDEN_HUB = {
  calle: ['comida', 'taxi', 'trenes', 'yubisashi'],
  planear: ['planificador', 'rutas', 'calculadora', 'precios', 'otono', 'sakura', 'osakaKioto', 'aeropuerto', 'ventajas'],
  musulman: ['mezquitas', 'halal'],
}

function hub(lang) {
  const t = HUB[lang], c = COMUN[lang], p = precios(lang)
  const url = BASE + RUTA.hub[lang]
  const href = (k) => (k === 'yubisashi' ? YUBISASHI : RUTA[k][lang])
  const tarjeta = (k) => {
    const [n, d, para] = t.t[k]
    const grande = k === 'comida' || k === 'taxi'
    const ext = k === 'yubisashi'
    return `<li class="${grande ? 'bt bt-g' : 'bt'}"><a href="${href(k)}"${ext ? ' rel="noopener"' : ''}>
${grande ? `<span class="bt-ja" lang="ja" dir="ltr">${esc(t.muestra[k])}</span>` : ''}<h3>${esc(n)}</h3><p>${esc(d)}</p><p class="bt-para">${esc(para)}${ext ? ` · ${esc(t.externa)}` : ''}</p><span class="bt-f" aria-hidden="true">${flecha(lang)}</span></a></li>`
  }
  const grupos = Object.entries(ORDEN_HUB).filter(([g]) => t.grupos[g]).map(([g, ks], i) => `<section class="bloque${i === 0 ? ' bloque-1' : ''}" id="${g}" aria-labelledby="h-${g}"><div class="kap">
<h2 id="h-${g}">${esc(t.grupos[g][0])}</h2><p class="sub">${esc(t.grupos[g][1])}</p>
<ul class="bento">${ks.map(tarjeta).join('')}</ul></div></section>`).join('')
  const faq = t.faq(p)
  const guia = `<section class="bloque bloque-claro" id="guia"><div class="kap guia">
<div><h2>${esc(t.guiaH)}</h2><p class="sub">${esc(t.guiaP)}</p><ul class="lista">${t.guiaL.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
<div class="guia-p"><dl>${t.tarifas(p).map(([n, y]) => `<div><dt>${esc(n)}</dt><dd><bdi dir="ltr">${esc(y)}</bdi></dd></div>`).join('')}</dl><p>${esc(t.guiaPrecio(p))}</p>
<div class="guia-b"><a class="btn" href="${wa(t.msg)}" rel="noopener">${esc(c.ctaB)} <span aria-hidden="true">${flecha(lang)}</span></a><a class="btn2" href="${t.guiaB[1]}">${esc(t.guiaB[0])}</a></div></div>
</div></section>`
  const herramientasLD = Object.values(ORDEN_HUB).flat().filter((k) => t.t[k])
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Person', '@id': `${BASE}/#tony`, name: 'Tony Hanma', url: `${BASE}/${lang}/`, jobTitle: 'Private tour guide in Kansai', knowsLanguage: ['es', 'en', 'ar'] },
      { '@type': 'CollectionPage', '@id': `${url}#pagina`, url, name: t.title, description: t.desc, inLanguage: lang, dateModified: HOY, author: { '@id': `${BASE}/#tony` }, mainEntity: { '@id': `${url}#lista` } },
      {
        '@type': 'ItemList', '@id': `${url}#lista`, name: t.h1,
        itemListElement: herramientasLD.map((k, i) => ({
          '@type': 'ListItem', position: i + 1,
          item: { '@type': 'WebApplication', name: t.t[k][0], description: t.t[k][1], url: k === 'yubisashi' ? YUBISASHI : BASE + RUTA[k][lang], applicationCategory: 'TravelApplication', operatingSystem: 'Any', isAccessibleForFree: true, offers: { '@type': 'Offer', price: 0, priceCurrency: 'JPY' } },
        })),
      },
      ldFaq(url, lang, faq),
      ldMigas(lang, [[c.migas, url]]),
    ],
  }
  // Muestra de lo que sale en las dos tarjetas (el mismo japonés que usan las herramientas).
  const muestra = `<div class="hm" aria-hidden="true" lang="ja" dir="ltr"><div class="carta hm-a"><div class="ln"><p class="ln-ja">${esc(JA_COMIDA.abre)}</p></div><div class="ln"><p class="ln-ja">${esc(JA_COMIDA.halal[0])}</p></div><div class="ln"><p class="ln-ja">${esc(JA_COMIDA.cierra)}</p></div></div>
<div class="carta hm-b"><div class="ln"><p class="ln-ja">${esc(JA_TAXI.abre)}</p></div><div class="dest"><p class="dest-ja">${esc(DESTINOS[0].ja)}</p></div></div></div>`
  const cuerpo = `<section class="heroe"><div class="kap heroe-k">
<div><p class="ceja">${esc(t.ceja)}</p><h1>${esc(t.h1)}</h1><p class="respuesta">${tx(t.lead)}</p>
<nav class="indice-h" aria-label="${esc(c.nav.g1)}"><ul>${Object.keys(ORDEN_HUB).filter((g) => t.grupos[g]).map((g) => `<li><a href="#${g}">${esc(t.grupos[g][0])}</a></li>`).join('')}<li><a href="#guia">${esc(t.guiaH)}</a></li></ul></nav></div>
${muestra}
</div></section>
${grupos}
${guia}
${faqHTML(c.faqH, faq)}`
  return envoltorio({ lang, clave: 'hub', title: t.title, desc: t.desc, ld, cuerpo, msg: t.msg })
}

// ════════════════════════════════════════════════════════════════════════════
// 2. TARJETA DE COMIDA
// ════════════════════════════════════════════════════════════════════════════
// Frases en japonés: una sola fuente para la tarjeta, la vista previa y la voz.
const JA_COMIDA = {
  abre: 'すみません。食事について、お願いがあります。',
  halal: ['イスラム教徒なので、ハラールの食事が必要です。', '豚肉と、豚由来のもの（ラード・ゼラチン・とんこつスープ・ポークエキスなど）は食べられません。', 'お酒・みりん・料理酒など、アルコールの入ったものも食べられません。', '肉は、ハラール認証のものしか食べられません。'],
  halalOk: '魚や野菜の料理なら食べられます。',
  cerdo: ['豚肉は食べられません。', 'とんこつスープ・ラード・ベーコン・ハムなど、豚を使ったものも食べられません。'],
  alcohol: ['お酒・みりん・料理酒など、アルコールの入ったものは食べられません。'],
  vegetariano: ['ベジタリアンです。肉と魚は食べられません。', 'かつおだしや鶏ガラスープなど、肉や魚のだしも食べられません。'],
  vegOk: { ambos: '卵と乳製品は食べられます。', huevo: '卵は食べられます。', leche: '乳製品は食べられます。' },
  vegano: ['ヴィーガン（完全菜食）です。', '肉・魚・卵・乳製品・はちみつは食べられません。', 'かつおだしや鶏ガラスープなど、肉や魚のだしも食べられません。'],
  alergia: '食物アレルギーがあります。次のものは食べられません。',
  alergenos: { marisco: 'えび・かに・貝類', pescado: '魚（魚のだしも）', huevo: '卵', leche: '乳製品（牛乳・バター・チーズなど）', trigo: '小麦・グルテン（しょうゆにも入っています）', cacahuete: '落花生（ピーナッツ）', frutos: 'ナッツ類（くるみ・アーモンド・カシューナッツなど）', sesamo: 'ごま（ごま油も）', soja: '大豆（しょうゆ・みそ・豆腐にも入っています）' },
  grave: ['重いアレルギーで、少しでも食べると命に関わります。', '同じ油や調理器具を使った料理も危険です。'],
  pregunta: 'この料理に、上に書いたものは入っていますか？',
  nosabe: 'わからない場合は、そう教えていただけると助かります。',
  cierra: 'ありがとうございます。',
}
const DIETAS = ['halal', 'cerdo', 'alcohol', 'vegetariano', 'vegano']
const ALERGENOS = ['marisco', 'pescado', 'huevo', 'leche', 'trigo', 'cacahuete', 'frutos', 'sesamo', 'soja']
const ETIQUETA_JA = { halal: 'ハラール', cerdo: '豚肉なし', alcohol: 'アルコールなし', vegetariano: 'ベジタリアン', vegano: 'ヴィーガン', marisco: 'えび・かに・貝', pescado: '魚', huevo: '卵', leche: '乳製品', trigo: '小麦', cacahuete: '落花生', frutos: 'ナッツ', sesamo: 'ごま', soja: '大豆', grave: '命に関わる' }

// Frases sueltas para la tabla de la página: [japonés, romaji, clave de traducción].
const FRASES_COMIDA = [
  ['すみません。食事について、お願いがあります。', 'Sumimasen. Shokuji ni tsuite, onegai ga arimasu.', 'abre'],
  ['イスラム教徒なので、ハラールの食事が必要です。', 'Isuramu-kyōto na node, harāru no shokuji ga hitsuyō desu.', 'halal'],
  ['豚肉は食べられません。', 'Butaniku wa taberaremasen.', 'cerdo'],
  ['お酒・みりん・料理酒など、アルコールの入ったものは食べられません。', 'O-sake, mirin, ryōrishu nado, arukōru no haitta mono wa taberaremasen.', 'alcohol'],
  ['ベジタリアンです。肉と魚は食べられません。', 'Bejitarian desu. Niku to sakana wa taberaremasen.', 'vegetariano'],
  ['ヴィーガン（完全菜食）です。', 'Vīgan (kanzen saishoku) desu.', 'vegano'],
  ['卵アレルギーがあります。', 'Tamago arerugī ga arimasu.', 'huevo'],
  ['重いアレルギーで、少しでも食べると命に関わります。', 'Omoi arerugī de, sukoshi demo taberu to inochi ni kakawarimasu.', 'grave'],
  ['この料理に豚肉は入っていますか？', 'Kono ryōri ni butaniku wa haitte imasu ka?', 'pCerdo'],
  ['だしは何を使っていますか？', 'Dashi wa nani o tsukatte imasu ka?', 'pDashi'],
  ['ハラールのメニューはありますか？', 'Harāru no menyū wa arimasu ka?', 'pHalal'],
  ['豚肉を使っていない料理はありますか？', 'Butaniku o tsukatte inai ryōri wa arimasu ka?', 'pSinCerdo'],
  ['ありがとうございます。', 'Arigatō gozaimasu.', 'cierra'],
]

const COMIDA = {
  es: {
    title: 'Tarjeta de comida en japonés: halal, vegetariano y alergias | Tony Kansai Guide',
    desc: 'Marca halal, sin cerdo, sin alcohol, vegetariano, vegano o tus alergias y enséñale al camarero una tarjeta en japonés educado, con voz. Gratis.',
    ceja: 'Herramienta gratis · en japonés',
    h1: 'Así le explicas al camarero, en japonés, lo que no puedes comer',
    lead: 'Marca lo que no puedes comer: halal, sin cerdo, sin alcohol, vegetariano, vegano o alergias. Pulsa «Enseñar al camarero» y sale una tarjeta a pantalla completa en japonés educado, con una línea en español debajo de cada frase y un botón para que el móvil la lea en voz alta. Es gratis y no tienes que registrarte.',
    dietaH: 'Qué comes y qué no', alergiaH: 'Alergias',
    op: {
      halal: ['Halal', 'Sin cerdo ni derivados, sin alcohol; carne solo con certificado halal.'],
      cerdo: ['Sin cerdo', 'Ni cerdo ni nada hecho con cerdo: caldo tonkotsu, manteca, beicon, jamón.'],
      alcohol: ['Sin alcohol', 'Tampoco en la cocina: mirin y sake de cocinar.'],
      vegetariano: ['Vegetariano', 'Sin carne ni pescado, y sin caldo dashi de bonito.'],
      vegano: ['Vegano', 'Nada de origen animal: tampoco huevo, lácteos ni miel.'],
      marisco: ['Marisco', 'Gambas, cangrejo y moluscos'], pescado: ['Pescado', 'También el caldo dashi'], huevo: ['Huevo'], leche: ['Leche y lácteos'], trigo: ['Trigo y gluten'], cacahuete: ['Cacahuete'], frutos: ['Frutos secos'], sesamo: ['Sésamo'], soja: ['Soja'],
      grave: ['Mi alergia es grave', 'Puede ser mortal: la tarjeta lo dice y avisa del aceite y los utensilios compartidos.'],
    },
    incl: { halal: 'Ya va dentro de halal', vegano: 'Ya va dentro de vegano' },
    ui: { vista: 'Así lo verá el camarero', vacio: 'Marca al menos una opción y aquí sale tu tarjeta.', ver: 'Enseñar al camarero', copiar: 'Copiar el japonés', copiado: 'Copiado', noCopia: 'No se pudo copiar', voz: 'Leer en voz alta', parar: 'Parar la voz', cerrar: 'Cerrar', borrar: 'Borrar todo', graveSin: 'Marca también qué te da alergia.', ptTitulo: 'Tarjeta de comida', guardado: 'Tu selección se queda guardada en este móvil.' },
    tr: {
      abre: 'Perdone. Tengo una petición sobre la comida.',
      halal: ['Soy de religión musulmana y necesito comida halal.', 'No puedo comer cerdo ni nada que venga del cerdo (manteca, gelatina, caldo tonkotsu, extracto de cerdo…).', 'Tampoco nada con alcohol, como sake, mirin o sake de cocinar.', 'Solo puedo comer carne con certificado halal.'],
      halalOk: 'Platos de pescado o de verduras, sí.',
      cerdo: ['No puedo comer cerdo.', 'Ni nada hecho con cerdo: caldo tonkotsu, manteca, beicon, jamón…'],
      alcohol: ['No puedo comer nada con alcohol, como sake, mirin o sake de cocinar.'],
      vegetariano: ['Dieta vegetariana: no como carne ni pescado.', 'Tampoco caldos de carne o de pescado, como el dashi de bonito o el caldo de pollo.'],
      vegOk: { ambos: 'Huevo y lácteos, sí.', huevo: 'Huevo, sí.', leche: 'Lácteos, sí.' },
      vegano: ['Dieta vegana: nada de origen animal.', 'No como carne, pescado, huevo, lácteos ni miel.', 'Tampoco caldos de carne o de pescado, como el dashi de bonito o el caldo de pollo.'],
      alergia: 'Tengo alergia alimentaria. No puedo comer:',
      alergenos: { marisco: 'gambas, cangrejo y moluscos', pescado: 'pescado (también su caldo)', huevo: 'huevo', leche: 'lácteos (leche, mantequilla, queso…)', trigo: 'trigo y gluten (la salsa de soja también lo lleva)', cacahuete: 'cacahuete', frutos: 'frutos secos (nueces, almendras, anacardos…)', sesamo: 'sésamo (también el aceite)', soja: 'soja (también la salsa de soja, el miso y el tofu)' },
      grave: ['Es una alergia grave: aunque sea un poco, puede ser mortal.', 'También es peligroso lo cocinado con el mismo aceite o los mismos utensilios.'],
      pregunta: '¿Este plato lleva algo de lo de arriba?',
      nosabe: 'Si no lo sabe, me ayuda mucho que me lo diga.',
      cierra: 'Muchas gracias.',
    },
    frases: { abre: 'Perdone. Tengo una petición sobre la comida.', halal: 'Soy de religión musulmana y necesito comida halal.', cerdo: 'No puedo comer cerdo.', alcohol: 'No puedo comer nada con alcohol, como sake, mirin o sake de cocinar.', vegetariano: 'Soy vegetariano: no como carne ni pescado.', vegano: 'Soy vegano: nada de origen animal.', huevo: 'Tengo alergia al huevo.', grave: 'Es una alergia grave: un poco puede ser mortal.', pCerdo: '¿Este plato lleva cerdo?', pDashi: '¿Con qué está hecho el caldo (dashi)?', pHalal: '¿Tienen menú halal?', pSinCerdo: '¿Tienen platos sin cerdo?', cierra: 'Muchas gracias.' },
    comoH: 'Cómo se usa',
    como: [
      'Marca lo que no puedes comer. Si comes halal, no hace falta marcar «sin cerdo» ni «sin alcohol»: ya van dentro.',
      'Mira la vista previa: cada frase en japonés lleva debajo su traducción, para que sepas qué estás enseñando.',
      'En el restaurante, pulsa «Enseñar al camarero» y gira el móvil hacia él. Si tu móvil tiene voz japonesa, «Leer en voz alta» lo dice por ti.',
      'Si te dice que no lo sabe o que no puede asegurarlo, créetelo: pide otra cosa o busca otro sitio.',
    ],
    realH: 'Lo que de verdad pasa en las cocinas de Japón',
    realP: 'En Japón casi nadie te va a servir un plato con algo que has dicho que no comes. El problema es lo que no se ve: caldos, salsas y grasas que van dentro de platos que parecen inocentes.',
    real: [
      ['El dashi lleva pescado', 'El caldo base de la cocina japonesa se hace casi siempre con bonito seco (katsuobushi, かつおぶし) y a veces con sardinas secas (niboshi). Va en la sopa de miso, en el caldo del udon y del soba, en muchas salsas y en la tortilla japonesa. Un plato de verduras puede no ser vegetariano por el caldo. El dashi hecho solo con alga kombu y setas shiitake sí lo es: pregunta 「だしは何を使っていますか？」.'],
      ['La salsa de soja y muchas salsas llevan alcohol', 'La salsa de soja fermentada tiene algo de alcohol de la propia fermentación, y la cocina japonesa usa mucho mirin (un condimento dulce de arroz que lleva alcohol) y sake de cocinar (料理酒): en el teriyaki, el sukiyaki, los guisos (nimono) y los adobos. Si no tomas nada de alcohol, dilo claro: la tarjeta pide expresamente sin mirin y sin sake de cocinar.'],
      ['Tonkotsu es cerdo', 'El ramen tonkotsu (豚骨) es caldo de huesos de cerdo, y muchos otros ramen mezclan cerdo o pollo en el caldo y llevan chashu (cerdo asado) encima. Un ramen «de pollo» puede llevar grasa de cerdo. Busca ramen con certificado halal o ramen vegano.'],
      ['Manteca de cerdo (ラード) y gelatina (ゼラチン)', 'La manteca de cerdo se usa en las gyoza, el arroz frito (chahan) y algunos panes y frituras. La gelatina de postres, gominolas y mousses es a menudo de cerdo, y la etiqueta rara vez dice de qué animal sale. En las tiendas de conveniencia (konbini), busca en la etiqueta 豚 (cerdo), ポーク (pork), ラード y ゼラチン.'],
      ['Muchas cocinas no pueden garantizar nada', 'En una cocina pequeña se comparten el aceite, la plancha y los utensilios, y muchas salsas llegan ya hechas de fábrica. Un camarero amable puede decirte que no pasa nada sin saberlo de verdad. Si te contesta 「わかりません」 (no lo sé) o 「保証できません」 (no lo podemos garantizar), es una respuesta honesta: tómatela en serio.'],
    ],
    seguroH: 'Lo seguro: restaurantes con certificado halal',
    seguroP: 'Si comes halal estricto, lo seguro es ir a restaurantes con certificado halal y preguntar si el certificado está en vigor. En Kioto hay categorías de restaurantes supervisadas por organismos musulmanes de la ciudad, como la Kyoto Muslim Association (KMA), entre ellas «Halal», «Muslim Friendly» y «Pork-Free». Si eres vegetariano o vegano, busca shōjin ryōri (精進料理), la cocina de los templos budistas, basada en verduras, tofu y algas, o restaurantes con carta vegana, y pregunta igualmente por el dashi.',
    seguroL: ['Restaurantes y comida halal en Kioto y Osaka (página en árabe)', RUTA.halal.es],
    alergH: 'Alergias: lo que conviene saber',
    alergP: 'La salsa de soja lleva trigo y soja; la ごま (sésamo) y su aceite están en muchos aliños, y el marisco aparece en caldos y en las galletas de arroz con gamba (えびせんべい). En los productos envasados de Japón, los alérgenos principales (gamba, cangrejo, nuez, trigo, alforfón o soba, huevo, leche y cacahuete) tienen que ir en la etiqueta, pero un restaurante no está obligado a decírtelo. Si tu alergia es grave, lleva tu medicación y un informe médico. En Japón, la ambulancia es el 119.',
    frasesH: 'Frases para el restaurante', frasesP: 'Las mismas frases de la tarjeta, para leerlas, copiarlas o decirlas tú.', cols: ['Japonés', 'Cómo se lee', 'Qué significa'],
    faq: [
      ['¿Cómo se dice «halal» en japonés?', 'Se escribe ハラール (harāru) y en Japón se entiende cada vez más. Para que no haya dudas, la tarjeta dice además que no comes cerdo ni nada que venga del cerdo, nada con alcohol (tampoco mirin ni sake de cocinar) y que la carne tiene que tener certificado halal.'],
      ['¿Cómo digo que soy vegetariano en japonés?', '「ベジタリアンです。肉と魚は食べられません。」 (Bejitarian desu. Niku to sakana wa taberaremasen). Añade siempre la frase del caldo, 「かつおだしや鶏ガラスープなど、肉や魚のだしも食べられません。」, porque el dashi de bonito está en casi todo.'],
      ['¿La salsa de soja es halal?', 'La salsa de soja fermentada tiene algo de alcohol de la propia fermentación, y muchas recetas le añaden mirin o sake. Hay salsa de soja con certificado halal, pero en un restaurante normal no sabrás cuál usan. Si comes halal estricto, pregunta o elige un restaurante con certificado.'],
      ['¿El ramen lleva cerdo?', 'El tonkotsu (豚骨) es caldo de huesos de cerdo, y muchos ramen llevan chashu (cerdo) encima o grasa de cerdo en el caldo, aunque la carta no lo diga. Busca ramen con certificado halal o ramen vegano.'],
      ['¿Me puedo fiar si el camarero dice que no lleva nada?', 'La tarjeta es una ayuda, no una garantía: explica bien lo que necesitas y la cocina decide si puede hacerlo. Las salsas de fábrica y el aceite compartido pueden escapársele al camarero. Para comer halal, lo seguro es un restaurante con certificado en vigor.'],
      ['¿Sirve para una alergia grave?', 'Marca «Mi alergia es grave» y la tarjeta dice que incluso un poco puede ser mortal y que también es peligroso cocinar con el mismo aceite o los mismos utensilios. Aun así, lleva tu medicación y un informe médico; si pasa algo, llama al 119, el número de ambulancias en Japón.'],
      ['¿Funciona sin internet?', 'Hay que cargar la página una vez. Si temes quedarte sin datos en el restaurante, haz antes una captura de la tarjeta o copia el texto japonés en tus notas.'],
      ['¿Se guarda lo que marco?', 'Sí, solo en el navegador de tu móvil, para la próxima comida. No se envía a ningún sitio. Con «Borrar todo» lo quitas.'],
      ['¿Me ayuda Tony a comer halal o vegetariano durante el tour?', 'Sí: en un tour con Tony elegís juntos dónde comer y él te ayuda a preguntar en el restaurante. La comida se paga aparte del guía.'],
    ],
    rel: [['Tarjeta para el taxi en japonés', RUTA.taxi.es], ['Restaurantes halal en Kioto y Osaka (en árabe)', RUTA.halal.es], ['Mezquitas de Kansai (en inglés)', RUTA.mezquitas.es], ['Yubisashi: señalar para pedir', YUBISASHI], ['Todas las herramientas gratis', RUTA.hub.es], ['Precios del guía', RUTA.precios.es]],
    ctaH: '¿Vienes a Kansai y comes halal o vegetariano?', ctaP: 'Dime fechas y cuántos sois, y te propongo una ruta con sitios para comer que os encajen.',
    msg: 'Hola, Tony. Vengo de la tarjeta de comida en japonés y me gustaría un tour. Fechas: … Personas: …',
  },
  en: {
    title: 'Japanese food card: halal, vegetarian and allergies | Tony Kansai Guide',
    desc: 'Tick halal, no pork, no alcohol, vegetarian, vegan or your allergies and show the waiter a card in polite Japanese, with a voice button. Free.',
    ceja: 'Free tool · in Japanese',
    h1: 'How to tell a waiter in Japanese what you can’t eat',
    lead: 'Tick what you can’t eat: halal, no pork, no alcohol, vegetarian, vegan or allergies. Press “Show the waiter” and a full-screen card appears in polite Japanese, with an English line under each sentence and a button so your phone reads it aloud. It’s free and there’s nothing to sign up for.',
    dietaH: 'What you eat and don’t eat', alergiaH: 'Allergies',
    op: {
      halal: ['Halal', 'No pork or pork products, no alcohol; only halal-certified meat.'],
      cerdo: ['No pork', 'No pork or anything made with it: tonkotsu broth, lard, bacon, ham.'],
      alcohol: ['No alcohol', 'Not in the cooking either: mirin and cooking sake.'],
      vegetariano: ['Vegetarian', 'No meat or fish, and no bonito dashi stock.'],
      vegano: ['Vegan', 'Nothing from animals: no eggs, dairy or honey either.'],
      marisco: ['Shellfish', 'Shrimp, crab and molluscs'], pescado: ['Fish', 'Including dashi stock'], huevo: ['Egg'], leche: ['Milk and dairy'], trigo: ['Wheat and gluten'], cacahuete: ['Peanut'], frutos: ['Tree nuts'], sesamo: ['Sesame'], soja: ['Soy'],
      grave: ['My allergy is severe', 'It can be life-threatening: the card says so and warns about shared oil and utensils.'],
    },
    incl: { halal: 'Already part of halal', vegano: 'Already part of vegan' },
    ui: { vista: 'What the waiter will see', vacio: 'Tick at least one option and your card appears here.', ver: 'Show the waiter', copiar: 'Copy the Japanese', copiado: 'Copied', noCopia: 'Could not copy', voz: 'Read aloud', parar: 'Stop the voice', cerrar: 'Close', borrar: 'Clear all', graveSin: 'Tick what you are allergic to as well.', ptTitulo: 'Food card', guardado: 'Your choices stay saved on this phone.' },
    tr: {
      abre: 'Excuse me. I have a request about my food.',
      halal: ['I’m Muslim, so I need halal food.', 'I can’t eat pork or anything made from pork (lard, gelatin, tonkotsu broth, pork extract…).', 'I also can’t eat anything with alcohol, such as sake, mirin or cooking sake.', 'I can only eat halal-certified meat.'],
      halalOk: 'Fish or vegetable dishes are fine.',
      cerdo: ['I can’t eat pork.', 'Or anything made with pork: tonkotsu broth, lard, bacon, ham…'],
      alcohol: ['I can’t eat anything with alcohol, such as sake, mirin or cooking sake.'],
      vegetariano: ['I’m vegetarian: no meat and no fish.', 'No meat or fish stock either, such as bonito dashi or chicken broth.'],
      vegOk: { ambos: 'Eggs and dairy are fine.', huevo: 'Eggs are fine.', leche: 'Dairy is fine.' },
      vegano: ['I’m vegan: nothing from animals.', 'No meat, fish, eggs, dairy or honey.', 'No meat or fish stock either, such as bonito dashi or chicken broth.'],
      alergia: 'I have a food allergy. I can’t eat:',
      alergenos: { marisco: 'shrimp, crab and shellfish', pescado: 'fish (including fish stock)', huevo: 'egg', leche: 'dairy (milk, butter, cheese…)', trigo: 'wheat and gluten (soy sauce contains it too)', cacahuete: 'peanuts', frutos: 'tree nuts (walnuts, almonds, cashews…)', sesamo: 'sesame (including sesame oil)', soja: 'soy (also in soy sauce, miso and tofu)' },
      grave: ['It’s a severe allergy: even a small amount can be life-threatening.', 'Food cooked in the same oil or with the same utensils is dangerous too.'],
      pregunta: 'Does this dish contain anything listed above?',
      nosabe: 'If you’re not sure, it really helps if you tell me.',
      cierra: 'Thank you very much.',
    },
    frases: { abre: 'Excuse me. I have a request about my food.', halal: 'I’m Muslim, so I need halal food.', cerdo: 'I can’t eat pork.', alcohol: 'I can’t eat anything with alcohol, such as sake, mirin or cooking sake.', vegetariano: 'I’m vegetarian: no meat and no fish.', vegano: 'I’m vegan: nothing from animals.', huevo: 'I’m allergic to eggs.', grave: 'It’s a severe allergy: even a little can be life-threatening.', pCerdo: 'Does this dish contain pork?', pDashi: 'What is the stock (dashi) made with?', pHalal: 'Do you have a halal menu?', pSinCerdo: 'Do you have dishes without pork?', cierra: 'Thank you very much.' },
    comoH: 'How to use it',
    como: [
      'Tick what you can’t eat. If you eat halal, you don’t need to tick “no pork” or “no alcohol”: they’re already included.',
      'Check the preview: every Japanese sentence has its translation underneath, so you know exactly what you’re showing.',
      'At the restaurant, press “Show the waiter” and turn the phone towards them. If your phone has a Japanese voice, “Read aloud” says it for you.',
      'If they say they don’t know or can’t guarantee it, believe them: order something else or find another place.',
    ],
    realH: 'What really happens in Japanese kitchens',
    realP: 'In Japan almost nobody will serve you a dish with something you said you don’t eat. The problem is what you can’t see: stocks, sauces and fats inside dishes that look harmless.',
    real: [
      ['Dashi contains fish', 'The base stock of Japanese cooking is almost always made with dried bonito (katsuobushi, かつおぶし) and sometimes dried sardines (niboshi). It goes into miso soup, udon and soba broth, many sauces and Japanese rolled omelette. A vegetable dish may not be vegetarian because of the stock. Dashi made only with kombu seaweed and shiitake mushrooms is: ask 「だしは何を使っていますか？」.'],
      ['Soy sauce and many sauces contain alcohol', 'Brewed soy sauce has a little alcohol from the fermentation itself, and Japanese cooking uses a lot of mirin (a sweet rice seasoning that contains alcohol) and cooking sake (料理酒): in teriyaki, sukiyaki, simmered dishes (nimono) and marinades. If you take no alcohol at all, say so clearly: the card asks specifically for no mirin and no cooking sake.'],
      ['Tonkotsu means pork', 'Tonkotsu ramen (豚骨) is pork-bone broth, and many other ramen mix pork or chicken into the broth and come topped with chashu (roast pork). A “chicken” ramen can still contain pork fat. Look for halal-certified ramen or vegan ramen.'],
      ['Lard (ラード) and gelatin (ゼラチン)', 'Lard is used in gyoza, fried rice (chahan) and some breads and fried foods. The gelatin in desserts, gummies and mousses is often pork, and the label rarely says which animal it comes from. In convenience stores (konbini), look on the label for 豚 (pork), ポーク (pork), ラード and ゼラチン.'],
      ['Many kitchens can’t guarantee anything', 'Small kitchens share oil, griddles and utensils, and many sauces arrive ready-made from a factory. A kind waiter may tell you it’s fine without really knowing. If the answer is 「わかりません」 (I don’t know) or 「保証できません」 (we can’t guarantee it), that is an honest answer: take it seriously.'],
    ],
    seguroH: 'The safe option: halal-certified restaurants',
    seguroP: 'If you eat strictly halal, the safe option is a halal-certified restaurant, and asking whether the certificate is current. In Kyoto there are restaurant categories supervised by Muslim bodies in the city, such as the Kyoto Muslim Association (KMA), including “Halal”, “Muslim Friendly” and “Pork-Free”. If you are vegetarian or vegan, look for shōjin ryōri (精進料理), Buddhist temple cooking based on vegetables, tofu and seaweed, or restaurants with a vegan menu, and still ask about the dashi.',
    seguroL: ['Halal restaurants and food in Kyoto and Osaka (page in Arabic)', RUTA.halal.en],
    alergH: 'Allergies: what to know',
    alergP: 'Soy sauce contains wheat and soy; ごま (sesame) and sesame oil are in many dressings, and shellfish turns up in stocks and in shrimp rice crackers (えびせんべい). On packaged food in Japan the main allergens (shrimp, crab, walnut, wheat, buckwheat or soba, egg, milk and peanut) must be on the label, but a restaurant is not required to tell you. If your allergy is severe, carry your medication and a doctor’s letter. In Japan, the ambulance number is 119.',
    frasesH: 'Restaurant phrases', frasesP: 'The same sentences as the card, to read, copy or say yourself.', cols: ['Japanese', 'How to say it', 'What it means'],
    faq: [
      ['How do you say “halal” in Japanese?', 'It is written ハラール (harāru) and is more and more widely understood in Japan. To leave no doubt, the card also says you don’t eat pork or anything from pork, nothing with alcohol (no mirin or cooking sake either) and that meat must be halal-certified.'],
      ['How do I say I’m vegetarian in Japanese?', '「ベジタリアンです。肉と魚は食べられません。」 (Bejitarian desu. Niku to sakana wa taberaremasen). Always add the stock sentence, 「かつおだしや鶏ガラスープなど、肉や魚のだしも食べられません。」, because bonito dashi is in almost everything.'],
      ['Is soy sauce halal?', 'Brewed soy sauce has a little alcohol from the fermentation itself, and many recipes add mirin or sake. Halal-certified soy sauce exists, but in an ordinary restaurant you won’t know which one they use. If you eat strictly halal, ask or choose a certified restaurant.'],
      ['Does ramen contain pork?', 'Tonkotsu (豚骨) is pork-bone broth, and many ramen come with chashu (pork) on top or pork fat in the broth, even when the menu doesn’t say so. Look for halal-certified or vegan ramen.'],
      ['Can I trust the waiter if they say it’s fine?', 'The card is a help, not a guarantee: it explains clearly what you need and the kitchen decides whether it can do it. Factory sauces and shared oil can slip past the waiter. For halal, the safe option is a restaurant with a current certificate.'],
      ['Does it work for a severe allergy?', 'Tick “My allergy is severe” and the card says even a small amount can be life-threatening and that cooking with the same oil or utensils is dangerous too. Still carry your medication and a doctor’s letter; if something happens, call 119, the ambulance number in Japan.'],
      ['Does it work offline?', 'You need to load the page once. If you’re worried about losing signal in the restaurant, take a screenshot of the card or copy the Japanese text into your notes beforehand.'],
      ['Are my choices saved?', 'Yes, only in your phone’s browser, for the next meal. Nothing is sent anywhere. “Clear all” removes them.'],
      ['Will Tony help me eat halal or vegetarian on the tour?', 'Yes: on a tour with Tony you choose together where to eat and he helps you ask at the restaurant. Meals are paid separately from the guide.'],
    ],
    rel: [['Japanese taxi card', RUTA.taxi.en], ['Halal restaurants in Kyoto and Osaka (in Arabic)', RUTA.halal.en], ['Mosques in Kansai', RUTA.mezquitas.en], ['Yubisashi: point to order', YUBISASHI], ['All free tools', RUTA.hub.en], ['Guide prices', RUTA.precios.en]],
    ctaH: 'Coming to Kansai and eating halal or vegetarian?', ctaP: 'Tell me your dates and group size, and I’ll suggest a route with places to eat that suit you.',
    msg: 'Hi Tony, I’m coming from the Japanese food card and I’d like a tour. Dates: … People: …',
  },
  ar: {
    title: 'بطاقة الطعام الحلال باليابانية: اعرضها في المطعم | Tony Kansai Guide',
    desc: 'اختر حلال، أو بلا خنزير، أو بلا كحول، أو نباتي، أو حساسيتك، واعرض على النادل في اليابان بطاقة بيابانية مهذبة مع صوت ياباني. مجانية ودون تسجيل.',
    ceja: 'أداة مجانية · باليابانية',
    h1: 'هكذا تقول للنادل باليابانية إنك تأكل حلالًا',
    lead: 'اختر ما لا تأكله: حلال، أو بلا خنزير، أو بلا كحول، أو نباتي، أو حساسية من أطعمة. اضغط «اعرضها على النادل» فتظهر بطاقة بملء الشاشة بيابانية مهذبة، وتحت كل جملة ترجمتها بالعربية، ومعها زر يجعل الجوال يقرؤها بصوت ياباني. مجانية ودون تسجيل.',
    dietaH: 'ماذا تأكل وماذا لا تأكل', alergiaH: 'الحساسية',
    op: {
      halal: ['حلال', 'بلا خنزير ولا مشتقاته، وبلا كحول؛ واللحم بشهادة حلال فقط.'],
      cerdo: ['بلا خنزير', 'لا لحم خنزير ولا ما يُصنع منه: مرق التونكوتسو والشحم والبيكون والهام.'],
      alcohol: ['بلا كحول', 'ولا في الطبخ أيضًا: الميرين وساكي الطبخ.'],
      vegetariano: ['نباتي', 'بلا لحم ولا سمك، وبلا مرق الداشي المصنوع من سمك البونيتو.'],
      vegano: ['نباتي صِرف (فيغان)', 'لا شيء من مصدر حيواني: ولا بيض ولا حليب ولا عسل.'],
      marisco: ['المأكولات البحرية', 'الروبيان والسلطعون والمحار'], pescado: ['السمك', 'ومرق الداشي أيضًا'], huevo: ['البيض'], leche: ['الحليب ومنتجاته'], trigo: ['القمح والغلوتين'], cacahuete: ['الفول السوداني'], frutos: ['المكسرات'], sesamo: ['السمسم'], soja: ['فول الصويا'],
      grave: ['حساسيتي شديدة', 'قد تهدد الحياة: البطاقة تقول ذلك، وتنبّه إلى الزيت والأدوات المشتركة.'],
    },
    incl: { halal: 'مشمول في الحلال', vegano: 'مشمول في النباتي الصِّرف' },
    ui: { vista: 'هكذا سيراها النادل', vacio: 'اختر خيارًا واحدًا على الأقل لتظهر بطاقتك هنا.', ver: 'اعرضها على النادل', copiar: 'انسخ النص الياباني', copiado: 'تم النسخ', noCopia: 'تعذّر النسخ', voz: 'اقرأها بصوت ياباني', parar: 'أوقف الصوت', cerrar: 'إغلاق', borrar: 'امسح الاختيارات', graveSin: 'اختر أيضًا ما يسبب لك الحساسية.', ptTitulo: 'بطاقة الطعام', guardado: 'يبقى اختيارك محفوظًا في هذا الجوال.' },
    tr: {
      abre: 'عفوًا، لديّ طلب بخصوص الطعام.',
      halal: ['أنا مسلم، وأحتاج إلى طعام حلال.', 'لا آكل لحم الخنزير ولا أي شيء مصنوع منه (الشحم والجيلاتين ومرق التونكوتسو وخلاصة الخنزير…).', 'ولا آكل أي شيء فيه كحول، مثل الساكي والميرين وساكي الطبخ.', 'لا آكل من اللحوم إلا ما عليه شهادة حلال.'],
      halalOk: 'أطباق السمك أو الخضار لا مشكلة فيها.',
      cerdo: ['لا آكل لحم الخنزير.', 'ولا أي شيء مصنوع منه: مرق التونكوتسو والشحم والبيكون والهام…'],
      alcohol: ['لا آكل أي شيء فيه كحول، مثل الساكي والميرين وساكي الطبخ.'],
      vegetariano: ['طعامي نباتي: لا آكل اللحم ولا السمك.', 'ولا المرق المصنوع من اللحم أو السمك، مثل داشي البونيتو أو مرق الدجاج.'],
      vegOk: { ambos: 'البيض ومنتجات الحليب لا مشكلة فيها.', huevo: 'البيض لا مشكلة فيه.', leche: 'منتجات الحليب لا مشكلة فيها.' },
      vegano: ['طعامي نباتي صِرف: لا شيء من مصدر حيواني.', 'لا لحم ولا سمك ولا بيض ولا منتجات حليب ولا عسل.', 'ولا المرق المصنوع من اللحم أو السمك، مثل داشي البونيتو أو مرق الدجاج.'],
      alergia: 'عندي حساسية من بعض الأطعمة. لا أستطيع أكل:',
      alergenos: { marisco: 'الروبيان والسلطعون والمحار', pescado: 'السمك (ومرقه أيضًا)', huevo: 'البيض', leche: 'منتجات الحليب (الحليب والزبدة والجبن…)', trigo: 'القمح والغلوتين (وهو في صلصة الصويا أيضًا)', cacahuete: 'الفول السوداني', frutos: 'المكسرات (الجوز واللوز والكاجو…)', sesamo: 'السمسم (وزيت السمسم أيضًا)', soja: 'فول الصويا (وهو في صلصة الصويا والميسو والتوفو أيضًا)' },
      grave: ['حساسيتي شديدة: حتى القليل منه قد يهدد حياتي.', 'والطعام المطبوخ في الزيت نفسه أو بالأدوات نفسها خطر أيضًا.'],
      pregunta: 'هل في هذا الطبق شيء مما ذُكر أعلاه؟',
      nosabe: 'إن لم تكن متأكدًا، فأرجو أن تخبرني بذلك.',
      cierra: 'شكرًا جزيلًا.',
    },
    frases: { abre: 'عفوًا، لديّ طلب بخصوص الطعام.', halal: 'أنا مسلم، وأحتاج إلى طعام حلال.', cerdo: 'لا آكل لحم الخنزير.', alcohol: 'لا آكل أي شيء فيه كحول، مثل الساكي والميرين وساكي الطبخ.', vegetariano: 'طعامي نباتي: لا آكل اللحم ولا السمك.', vegano: 'طعامي نباتي صِرف: لا شيء من مصدر حيواني.', huevo: 'عندي حساسية من البيض.', grave: 'حساسيتي شديدة: حتى القليل قد يهدد حياتي.', pCerdo: 'هل في هذا الطبق لحم خنزير؟', pDashi: 'من أي شيء صنعتم المرق (الداشي)؟', pHalal: 'هل عندكم قائمة طعام حلال؟', pSinCerdo: 'هل عندكم أطباق بلا لحم خنزير؟', cierra: 'شكرًا جزيلًا.' },
    comoH: 'طريقة الاستعمال',
    como: [
      'اختر ما لا تأكله. إن اخترت «حلال» فلا داعي لاختيار «بلا خنزير» و«بلا كحول»: هما ضمنه.',
      'انظر إلى المعاينة: تحت كل جملة يابانية ترجمتها، لتعرف ما الذي تعرضه بالضبط.',
      'في المطعم، اضغط «اعرضها على النادل» ووجّه الشاشة إليه. وإن كان في جوالك صوت ياباني، فزر «اقرأها بصوت ياباني» يقولها عنك.',
      'إن قال إنه لا يعرف أو لا يستطيع أن يضمن، فصدّقه: اطلب شيئًا آخر أو ابحث عن مطعم آخر.',
    ],
    realH: 'ما الذي يحدث فعلًا في مطابخ اليابان',
    realP: 'نادرًا ما يقدّم لك أحد في اليابان طبقًا فيه شيء قلت إنك لا تأكله. المشكلة فيما لا يُرى: مرق وصلصات ودهون داخل أطباق تبدو بريئة.',
    real: [
      ['الداشي فيه سمك', 'المرق الأساسي في المطبخ الياباني يُصنع في الغالب من سمك البونيتو المجفف (كاتسوبوشي، かつおぶし) وأحيانًا من السردين المجفف (نيبوشي). وهو موجود في حساء الميسو، ومرق الأودون والسوبا، وكثير من الصلصات، والعجة اليابانية. لذلك قد لا يكون طبق الخضار نباتيًا بسبب المرق. أما الداشي المصنوع من طحلب الكومبو وفطر الشيتاكي فقط فهو نباتي: اسأل 「だしは何を使っていますか？」.'],
      ['صلصة الصويا وكثير من الصلصات فيها كحول', 'صلصة الصويا المخمّرة فيها قليل من الكحول الناتج عن التخمير نفسه، والمطبخ الياباني يستعمل كثيرًا الميرين (منكّه حلو من الأرز فيه كحول) وساكي الطبخ (料理酒) في التيرياكي والسوكيياكي والأطباق المطهوّة (نيمونو) والتتبيلات. إن كنت لا تأكل أي شيء فيه كحول فقلها صراحة: البطاقة تطلب بالتحديد ألّا يُستعمل الميرين ولا ساكي الطبخ.'],
      ['التونكوتسو خنزير', 'رامن التونكوتسو (豚骨) مرقه من عظام الخنزير، وكثير من أنواع الرامن الأخرى تخلط الخنزير أو الدجاج في المرق ويوضع فوقها التشاشو (لحم خنزير مشوي). حتى الرامن «بالدجاج» قد يكون فيه دهن خنزير. ابحث عن رامن بشهادة حلال أو رامن نباتي.'],
      ['شحم الخنزير (ラード) والجيلاتين (ゼラチン)', 'يُستعمل شحم الخنزير في الغيوزا والأرز المقلي (تشاهان) وبعض المخبوزات والمقليات. والجيلاتين في الحلويات والحلوى المطاطية والموس كثيرًا ما يكون من الخنزير، ونادرًا ما يذكر الملصق مصدره. في متاجر الكونبيني اقرأ الملصق وابحث عن 豚 (خنزير) و ポーク (لحم خنزير) و ラード و ゼラチン.'],
      ['كثير من المطابخ لا تستطيع أن تضمن شيئًا', 'في المطبخ الصغير يُستعمل الزيت والصاج والأدوات نفسها لكل شيء، وكثير من الصلصات تأتي جاهزة من المصنع. وقد يقول لك نادل لطيف إنه لا مشكلة دون أن يعرف حقًا. فإن قال 「わかりません」 (لا أعرف) أو 「保証できません」 (لا نستطيع الضمان)، فهذا جواب صادق: خذه بجدية.'],
    ],
    seguroH: 'الأضمن: مطاعم بشهادة حلال',
    seguroP: 'إن كنت تلتزم بالحلال التزامًا تامًا، فالأضمن أن تأكل في مطعم حاصل على شهادة حلال، وأن تسأل إن كانت الشهادة سارية. في كيوتو تصنيفات للمطاعم تشرف عليها هيئات إسلامية في المدينة، مثل رابطة مسلمي كيوتو (KMA)، منها «Halal» و«Muslim Friendly» و«Pork-Free». وإن كنت نباتيًا، فابحث عن «شوجين ريوري» (精進料理)، مطبخ المعابد البوذية القائم على الخضار والتوفو والطحالب، أو عن مطاعم فيها قائمة نباتية صِرفة، واسأل عن الداشي في كل الأحوال.',
    seguroL: ['المطاعم والطعام الحلال في كيوتو وأوساكا', RUTA.halal.ar],
    alergH: 'الحساسية: ما ينبغي معرفته',
    alergP: 'صلصة الصويا فيها قمح وصويا، والسمسم (ごま) وزيته موجودان في كثير من الصلصات والتتبيلات، والمأكولات البحرية تظهر في المرق وفي رقائق الأرز بالروبيان (えびせんべい). في المنتجات المعبّأة في اليابان يجب أن تُكتب المسببات الرئيسية للحساسية على الملصق (الروبيان والسلطعون والجوز والقمح والحنطة السوداء أو السوبا والبيض والحليب والفول السوداني)، لكن المطعم غير ملزم بإخبارك. إن كانت حساسيتك شديدة فاحمل دواءك وتقريرًا طبيًا. ورقم الإسعاف في اليابان 119.',
    frasesH: 'جمل للمطعم', frasesP: 'الجمل نفسها التي في البطاقة، لتقرأها أو تنسخها أو تقولها بنفسك.', cols: ['اليابانية', 'النطق', 'المعنى'],
    faq: [
      ['كيف أقول «حلال» باليابانية؟', 'تُكتب ハラール وتُنطق «هاراآرو»، وصارت مفهومة أكثر فأكثر في اليابان. ولكي لا يبقى أي لبس، تقول البطاقة أيضًا إنك لا تأكل الخنزير ولا ما يُصنع منه، ولا أي شيء فيه كحول (ولا الميرين ولا ساكي الطبخ)، وإن اللحم يجب أن يكون بشهادة حلال.'],
      ['كيف أقول إني نباتي باليابانية؟', 'قل 「ベジタリアンです。肉と魚は食べられません。」، وأضف دائمًا جملة المرق: 「かつおだしや鶏ガラスープなど、肉や魚のだしも食べられません。」، لأن داشي البونيتو موجود في كل شيء تقريبًا.'],
      ['هل صلصة الصويا حلال؟', 'صلصة الصويا المخمّرة فيها قليل من الكحول الناتج عن التخمير نفسه، وكثير من الوصفات يُضاف إليها الميرين أو الساكي. توجد صلصة صويا بشهادة حلال، لكنك في مطعم عادي لن تعرف أي صلصة يستعملون. إن كنت تلتزم بالحلال التزامًا تامًا فاسأل، أو اختر مطعمًا بشهادة حلال.'],
      ['هل في الرامن لحم خنزير؟', 'التونكوتسو (豚骨) مرق من عظام الخنزير، وكثير من أنواع الرامن يوضع فوقها التشاشو (خنزير) أو يكون في مرقها دهن خنزير، حتى لو لم تذكر القائمة ذلك. ابحث عن رامن بشهادة حلال أو رامن نباتي.'],
      ['هل أثق بالنادل إن قال إن الطبق خالٍ مما ذكرت؟', 'البطاقة مساعدة لا ضمان: تشرح ما تحتاجه بوضوح، والمطبخ يقرر إن كان يستطيع. الصلصات الجاهزة والزيت المشترك قد تفوت النادل. وللحلال، الأضمن مطعم بشهادة حلال سارية.'],
      ['هل تنفع مع الحساسية الشديدة؟', 'اختر «حساسيتي شديدة» فتقول البطاقة إن القليل قد يهدد الحياة، وإن الطبخ بالزيت نفسه أو بالأدوات نفسها خطر أيضًا. ومع ذلك احمل دواءك وتقريرًا طبيًا، وإن حدث طارئ فاتصل بالرقم 119، رقم الإسعاف في اليابان.'],
      ['هل تعمل دون إنترنت؟', 'تحتاج إلى فتح الصفحة مرة واحدة. وإن خشيت أن ينقطع الإنترنت في المطعم، فخذ لقطة شاشة للبطاقة أو انسخ النص الياباني في ملاحظاتك قبل الخروج.'],
      ['هل يُحفظ ما أختاره؟', 'نعم، في متصفح جوالك فقط، للوجبة التالية، ولا يُرسَل إلى أي مكان. وزر «امسح الاختيارات» يحذفه.'],
      ['هل يساعدني طوني في الأكل الحلال أثناء الجولة؟', 'نعم: في الجولة مع طوني تختارون معًا أين تأكلون، وهو يساعدك في السؤال داخل المطعم. ثمن الطعام منفصل عن أجر المرشد.'],
    ],
    rel: [['بطاقة التاكسي باليابانية', RUTA.taxi.ar], ['المطاعم والطعام الحلال في كيوتو وأوساكا', RUTA.halal.ar], ['المساجد في كانساي', RUTA.mezquitas.ar], ['Yubisashi: أشِر لتطلب', YUBISASHI], ['كل الأدوات المجانية', RUTA.hub.ar], ['أسعار المرشد', RUTA.precios.ar]],
    ctaH: 'قادم إلى كانساي وتأكل حلالًا؟', ctaP: 'أخبرني بالتواريخ وعددكم، وأقترح عليكم مسارًا فيه أماكن للأكل تناسبكم وأوقات للصلاة.',
    msg: 'مرحبًا طوني، جئت من بطاقة الطعام الحلال باليابانية وأودّ حجز جولة. التواريخ: … عدد الأشخاص: …',
  },
}

function opcion(t, k, tipo = 'checkbox') {
  const [n, d] = t.op[k]
  const incl = k === 'cerdo' || k === 'alcohol' ? t.incl.halal : k === 'vegetariano' ? t.incl.vegano : ''
  return `<label class="op-f"><input type="${tipo}" name="c" value="${k}"><span class="op-t"><b>${esc(n)}</b>${d ? `<small>${esc(d)}</small>` : ''}${incl ? `<em class="op-incl">${esc(incl)}</em>` : ''}</span><span class="op-ja" lang="ja" dir="ltr">${esc(ETIQUETA_JA[k])}</span></label>`
}

function comida(lang) {
  const t = COMIDA[lang], c = COMUN[lang]
  const url = BASE + RUTA.comida[lang]
  const rtl = lang === 'ar'
  const datos = { lang, dir: rtl ? 'rtl' : 'ltr', ja: JA_COMIDA, tr: t.tr, ui: t.ui, dietas: DIETAS, alergenos: ALERGENOS }
  const herramienta = `<section class="herr" id="tarjeta" aria-label="${esc(t.ui.ptTitulo)}"><div class="kap herr-k">
<form class="op" id="tc-form" onsubmit="return false">
<fieldset><legend>${esc(t.dietaH)}</legend><div class="op-l">${DIETAS.map((k) => opcion(t, k)).join('')}</div></fieldset>
<fieldset><legend>${esc(t.alergiaH)}</legend><div class="op-l op-dos">${ALERGENOS.map((k) => opcion(t, k)).join('')}</div>
<div class="op-l op-grave">${opcion(t, 'grave')}</div><p class="aviso" id="tc-aviso" aria-live="polite" hidden>${esc(t.ui.graveSin)}</p></fieldset>
<p class="nota">${esc(t.ui.guardado)} <button type="button" class="enlace" id="tc-borrar">${esc(t.ui.borrar)}</button></p>
</form>
<aside class="vista"><p class="vista-e">${esc(t.ui.vista)}</p>
<div class="carta" id="tc-vista" lang="ja" dir="ltr" aria-live="polite"><p class="carta-vacia" lang="${lang}" dir="${rtl ? 'rtl' : 'ltr'}">${esc(t.ui.vacio)}</p></div>
<div class="acc"><button type="button" class="btn b-ver" disabled>${esc(t.ui.ver)}</button><button type="button" class="btn2 b-copiar" disabled>${esc(t.ui.copiar)}</button><button type="button" class="btn2 b-voz" hidden aria-pressed="false">${esc(t.ui.voz)}</button></div>
</aside>
<div class="acc-movil"><button type="button" class="btn b-ver" disabled>${esc(t.ui.ver)}</button></div>
</div></section>
${pantallaHTML('tc', t.ui)}`
  const frasesHTML = tablaFrases(t, FRASES_COMIDA.map(([j, r, k]) => [j, r, t.frases[k]]))
  const textos = `<section class="bloque" id="como"><div class="kap estrecho">
<h2>${esc(t.comoH)}</h2><ol class="pasos">${t.como.map((x) => `<li>${tx(x)}</li>`).join('')}</ol>
</div></section>
<section class="bloque bloque-claro" id="cocinas"><div class="kap">
<h2>${esc(t.realH)}</h2><p class="sub">${esc(t.realP)}</p>
<div class="hechos">${t.real.map(([h, p]) => `<article><h3>${tx(h)}</h3><p>${tx(p)}</p></article>`).join('')}</div>
<div class="seguro"><h3>${esc(t.seguroH)}</h3><p>${tx(t.seguroP)}</p><p><a class="enlace-f" href="${t.seguroL[1]}" hreflang="ar">${esc(t.seguroL[0])} <span aria-hidden="true">${flecha(lang)}</span></a></p></div>
<div class="seguro seguro-b"><h3>${esc(t.alergH)}</h3><p>${tx(t.alergP)}</p></div>
</div></section>
<section class="bloque" id="frases"><div class="kap">
<h2>${esc(t.frasesH)}</h2><p class="sub">${esc(t.frasesP)}</p>${frasesHTML}
</div></section>`
  const ld = ldHerramienta({ lang, url, name: t.h1, desc: t.desc, faq: t.faq, migas: [[c.migas, BASE + RUTA.hub[lang]], [t.ui.ptTitulo, url]] })
  const cuerpo = `${heroe(t)}
${herramienta}
${textos}
${faqHTML(c.faqH, t.faq)}
${relHTML(lang, c.relH, t.rel)}
${ctaHTML(lang, t)}`
  const js = `(function(){var D=${jsonScript(datos)};var B=(${clienteBase.toString()})(D.ui);(${clienteComida.toString()})(D,B)})()`
  return envoltorio({ lang, clave: 'comida', title: t.title, desc: t.desc, ld, cuerpo, msg: t.msg, js })
}

// ════════════════════════════════════════════════════════════════════════════
// 3. TARJETA DE TAXI
// ════════════════════════════════════════════════════════════════════════════
// ja: lo que lee el taxista · q: búsqueda de Google Maps · dir: dirección (solo mezquitas).
const DESTINOS = [
  { g: 'kioto', id: 'kyoto-eki', ja: '京都駅', q: '京都駅', rom: 'Kyōto-eki', n: { es: 'Estación de Kioto', en: 'Kyoto Station', ar: 'محطة كيوتو' } },
  { g: 'kioto', id: 'fushimi-inari', ja: '伏見稲荷大社', q: '伏見稲荷大社', rom: 'Fushimi Inari Taisha', n: { es: 'Santuario Fushimi Inari', en: 'Fushimi Inari Shrine', ar: 'مزار فوشيمي إيناري' } },
  { g: 'kioto', id: 'kiyomizu', ja: '清水寺', q: '清水寺', rom: 'Kiyomizu-dera', n: { es: 'Templo Kiyomizu-dera', en: 'Kiyomizu-dera Temple', ar: 'معبد كيوميزو-ديرا' } },
  { g: 'kioto', id: 'kinkaku', ja: '金閣寺（鹿苑寺）', q: '金閣寺', rom: 'Kinkaku-ji (Rokuon-ji)', n: { es: 'Pabellón Dorado (Kinkaku-ji)', en: 'Golden Pavilion (Kinkaku-ji)', ar: 'الجناح الذهبي (كينكاكو-جي)' } },
  { g: 'kioto', id: 'ginkaku', ja: '銀閣寺（慈照寺）', q: '銀閣寺', rom: 'Ginkaku-ji (Jishō-ji)', n: { es: 'Pabellón de Plata (Ginkaku-ji)', en: 'Silver Pavilion (Ginkaku-ji)', ar: 'الجناح الفضي (غينكاكو-جي)' } },
  { g: 'kioto', id: 'nijo', ja: '二条城', q: '二条城', rom: 'Nijō-jō', n: { es: 'Castillo de Nijō', en: 'Nijō Castle', ar: 'قلعة نيجو' } },
  { g: 'kioto', id: 'gion', ja: '祇園（八坂神社）', q: '八坂神社', rom: 'Gion (Yasaka-jinja)', n: { es: 'Gion (santuario Yasaka)', en: 'Gion (Yasaka Shrine)', ar: 'غيون (مزار ياساكا)' } },
  { g: 'kioto', id: 'arashiyama', ja: '嵐山・渡月橋', q: '渡月橋', rom: 'Arashiyama · Togetsu-kyō', n: { es: 'Arashiyama (puente Togetsukyō)', en: 'Arashiyama (Togetsukyō Bridge)', ar: 'أراشيياما (جسر توغيتسوكيو)' } },
  { g: 'osaka', id: 'osaka-eki', ja: '大阪駅', q: '大阪駅', rom: 'Ōsaka-eki', n: { es: 'Estación de Osaka (Umeda)', en: 'Osaka Station (Umeda)', ar: 'محطة أوساكا (أوميدا)' } },
  { g: 'osaka', id: 'shin-osaka', ja: '新大阪駅', q: '新大阪駅', rom: 'Shin-Ōsaka-eki', n: { es: 'Estación de Shin-Osaka (shinkansen)', en: 'Shin-Osaka Station (shinkansen)', ar: 'محطة شين أوساكا (القطار السريع)' } },
  { g: 'osaka', id: 'osaka-jo', ja: '大阪城', q: '大阪城', rom: 'Ōsaka-jō', n: { es: 'Castillo de Osaka', en: 'Osaka Castle', ar: 'قلعة أوساكا' } },
  { g: 'osaka', id: 'dotonbori', ja: '道頓堀', q: '道頓堀', rom: 'Dōtonbori', n: { es: 'Dotonbori', en: 'Dotonbori', ar: 'دوتونبوري' } },
  { g: 'osaka', id: 'tsutenkaku', ja: '通天閣', q: '通天閣', rom: 'Tsūtenkaku', n: { es: 'Torre Tsutenkaku (Shinsekai)', en: 'Tsutenkaku Tower (Shinsekai)', ar: 'برج تسوتينكاكو (شينسيكاي)' } },
  { g: 'osaka', id: 'namba', ja: 'なんば駅', q: 'なんば駅', rom: 'Nanba-eki', n: { es: 'Estación de Namba', en: 'Namba Station', ar: 'محطة نامبا' } },
  { g: 'osaka', id: 'kix', ja: '関西国際空港', q: '関西国際空港', rom: 'Kansai Kokusai Kūkō', n: { es: 'Aeropuerto de Kansai (KIX)', en: 'Kansai Airport (KIX)', ar: 'مطار كانساي الدولي (KIX)' } },
  { g: 'nara', id: 'nara-koen', ja: '奈良公園', q: '奈良公園', rom: 'Nara Kōen', n: { es: 'Parque de Nara (los ciervos)', en: 'Nara Park (the deer)', ar: 'حديقة نارا (الغزلان)' } },
  { g: 'nara', id: 'todaiji', ja: '東大寺', q: '東大寺', rom: 'Tōdai-ji', n: { es: 'Templo Tōdai-ji', en: 'Tōdai-ji Temple', ar: 'معبد توداي-جي' } },
  { g: 'lejos', id: 'himeji', ja: '姫路城', q: '姫路城', rom: 'Himeji-jō', n: { es: 'Castillo de Himeji', en: 'Himeji Castle', ar: 'قلعة هيميجي' } },
  { g: 'lejos', id: 'sannomiya', ja: '三ノ宮駅（神戸）', q: '三ノ宮駅', rom: 'Sannomiya-eki (Kōbe)', n: { es: 'Estación de Sannomiya (Kobe)', en: 'Sannomiya Station (Kobe)', ar: 'محطة سانّوميا (كوبي)' } },
  { g: 'lejos', id: 'byodoin', ja: '平等院（宇治）', q: '平等院', rom: 'Byōdō-in (Uji)', n: { es: 'Templo Byōdō-in (Uji)', en: 'Byōdō-in Temple (Uji)', ar: 'معبد بيودو-إن (أوجي)' } },
  { g: 'mezquitas', id: 'osaka-ibaraki', ja: '大阪茨木モスク', dir: '大阪府茨木市豊川4-6-13', q: '大阪茨木モスク 大阪府茨木市豊川4-6-13', rom: 'Ōsaka Ibaraki Mosuku', n: { es: 'Mezquita de Osaka Ibaraki', en: 'Osaka Ibaraki Mosque', ar: 'مسجد أوساكا إيباراكي' } },
  { g: 'mezquitas', id: 'kobe-mezquita', ja: '神戸ムスリムモスク', dir: '兵庫県神戸市中央区中山手通2-25-14', q: '神戸ムスリムモスク 兵庫県神戸市中央区中山手通2-25-14', rom: 'Kōbe Musurimu Mosuku', n: { es: 'Mezquita de Kobe', en: 'Kobe Muslim Mosque', ar: 'مسجد كوبي' } },
]
const JA_TAXI = { abre: 'この場所までお願いします。', cierra: 'ありがとうございます。' }
const FRASES_TAXI = [
  ['この場所までお願いします。', 'Kono basho made onegai shimasu.', 'lugar'],
  ['この住所までお願いします。', 'Kono jūsho made onegai shimasu.', 'direccion'],
  ['ここまでお願いします。', 'Koko made onegai shimasu.', 'aqui'],
  ['ここで止めてください。', 'Koko de tomete kudasai.', 'pare'],
  ['何分くらいかかりますか？', 'Nanpun kurai kakarimasu ka?', 'tiempo'],
  ['カードで払えますか？', 'Kādo de haraemasu ka?', 'puedoTarjeta'],
  ['カードでお願いします。', 'Kādo de onegai shimasu.', 'tarjeta'],
  ['領収書をお願いします。', 'Ryōshūsho o onegai shimasu.', 'recibo'],
  ['トランクを開けていただけますか？', 'Toranku o akete itadakemasu ka?', 'maletero'],
  ['ありがとうございます。', 'Arigatō gozaimasu.', 'gracias'],
]

const TAXI = {
  es: {
    title: 'Tarjeta para el taxi en japonés: Kioto, Osaka y Nara | Tony Kansai Guide',
    desc: 'Elige tu destino en Kansai o escribe tu hotel y enséñale al taxista una tarjeta en japonés, en grande, con voz y Google Maps. Gratis y sin registro.',
    ceja: 'Herramienta gratis · en japonés',
    h1: 'Así le dices al taxista adónde vas, en japonés',
    lead: 'Elige el destino entre los sitios más visitados de Kioto, Osaka, Nara, Kobe y Himeji, o una mezquita, o escribe el nombre o la dirección de tu hotel. Pulsa «Enseñar al taxista» y sale en grande, en japonés, entre dos frases educadas. Con un botón lo abres en Google Maps y con otro el móvil lo lee en voz alta.',
    destH: 'Adónde vas',
    grupos: { kioto: 'Kioto', osaka: 'Osaka', nara: 'Nara', lejos: 'Kobe, Himeji y Uji', mezquitas: 'Mezquitas' },
    hotelL: 'O escribe tu hotel o una dirección', hotelA: 'Mejor en japonés: cópialo de la reserva o pídeselo a recepción. Si no lo tienes, escríbelo en letras latinas.',
    ui: { vista: 'Así lo verá el taxista', vacio: 'Elige un destino o escribe tu hotel.', ver: 'Enseñar al taxista', mapa: 'Abrir en Google Maps', copiar: 'Copiar el japonés', copiado: 'Copiado', noCopia: 'No se pudo copiar', voz: 'Leer en voz alta', parar: 'Parar la voz', cerrar: 'Cerrar', ptTitulo: 'Tarjeta para el taxi', hotel: 'Tu hotel o dirección', guardado: 'El destino y tu hotel se quedan guardados en este móvil.' },
    tr: { abre: 'A este sitio, por favor.', cierra: 'Muchas gracias.' },
    frases: { lugar: 'A este sitio, por favor.', direccion: 'A esta dirección, por favor.', aqui: 'Hasta aquí, por favor (señalando el mapa).', pare: 'Pare aquí, por favor.', tiempo: '¿Cuántos minutos se tarda, más o menos?', puedoTarjeta: '¿Puedo pagar con tarjeta?', tarjeta: 'Con tarjeta, por favor.', recibo: 'El recibo, por favor.', maletero: '¿Me abre el maletero, por favor?', gracias: 'Muchas gracias.' },
    comoH: 'Cómo se coge un taxi en Japón',
    como: [
      ['Dónde se para', 'En las estaciones y en los hoteles hay paradas de taxi (タクシー乗り場). En la calle basta con levantar la mano. El cartel junto al parabrisas dice 空車 cuando está libre; 賃走 o 実車, ocupado; 迎車, que va a recoger a alguien, y 回送, que no coge clientes.'],
      ['La puerta se abre sola', 'La puerta trasera izquierda la abre y la cierra el conductor con una palanca. Espera a que se abra y no la cierres tú al bajar.'],
      ['Enséñale el destino', 'Muchos taxistas hablan poco inglés, y un nombre dicho con acento extranjero se entiende mal. Con el nombre en japonés (o el mapa) no hay dudas. El cinturón es obligatorio también en los asientos de atrás.'],
      ['Cómo se paga', 'Pagas lo que marca el taxímetro: no se regatea y no se da propina. La mayoría de los taxis de las ciudades aceptan tarjeta, y muchos también tarjetas IC como ICOCA o Suica; mira las pegatinas de la ventanilla o pregúntalo al subir, y lleva algo de efectivo por si acaso. A partir de las 22:00 la tarifa sube.'],
      ['Grupos y maletas', 'En un taxi normal caben cuatro pasajeros; si sois más, coged dos. Las maletas van en el maletero: lo abre el conductor, que suele ayudarte a cargarlas.'],
      ['Apps de taxi', 'GO es la app de taxis más usada en Japón: está en inglés, permite registrarse con un número de teléfono extranjero y pagar dentro de la app. Comprueba antes del viaje que tu tarjeta funciona en ella.'],
      ['¿Taxi o tren?', 'Para trayectos cortos dentro de Kioto o de Osaka, sobre todo si sois tres o cuatro, el taxi es cómodo. Para ir de una ciudad a otra o al aeropuerto, el tren suele ser más rápido y mucho más barato.'],
    ],
    trenesL: ['Trenes de Kansai: tiempos y precios', RUTA.trenes.es],
    frasesH: 'Frases para el taxi', frasesP: 'Japonés, cómo se lee y qué significa.', cols: ['Japonés', 'Cómo se lee', 'Qué significa'],
    destTH: 'Los destinos en japonés', destTP: 'El nombre exacto que entiende el taxista, con enlace al mapa.', destCols: ['Japonés', 'Cómo se lee', 'Qué es', 'Mapa'], verMapa: 'Mapa',
    faq: [
      ['¿Se da propina al taxista en Japón?', 'No. Se paga lo que marca el taxímetro y ya está. Si dejas de más, lo normal es que te devuelvan el cambio.'],
      ['¿Puedo pagar el taxi con tarjeta?', 'En la mayoría de los taxis de Kioto, Osaka y Kobe, sí, y muchos aceptan también ICOCA o Suica. Míralo en las pegatinas de la ventanilla o pregunta 「カードで払えますか？」 antes de salir, y lleva algo de efectivo por si acaso.'],
      ['¿Por qué no basta con decir el nombre en inglés?', 'Porque muchos sitios tienen un nombre japonés que no se parece al inglés (el Pabellón Dorado es 金閣寺, Kinkaku-ji) y porque hay nombres parecidos: en Osaka hay varias estaciones de Namba, de compañías distintas. Leído en japonés, el taxista no duda.'],
      ['¿Qué escribo si mi hotel no está en la lista?', 'El nombre o la dirección del hotel, a ser posible en japonés: viene en la confirmación de la reserva, en la web del hotel en japonés o en la tarjeta del hotel que te dan en recepción. Si solo lo tienes en letras latinas, escríbelo igual y enséñale también el mapa.'],
      ['¿Cuántas personas caben en un taxi?', 'En un taxi normal, cuatro pasajeros. Si sois cinco o seis, lo más sencillo es coger dos taxis.'],
      ['¿Funciona la app GO para turistas?', 'Sí: está en inglés y permite registrarse con un número de teléfono extranjero y pagar con tarjeta dentro de la app. Algunas tarjetas extranjeras fallan, así que pruébala antes de depender de ella.'],
      ['¿Cómo voy en taxi a la mezquita?', 'En la lista están la mezquita de Osaka Ibaraki (大阪茨木モスク) y la de Kobe (神戸ムスリムモスク), con su dirección en japonés. Para la de Kioto y los espacios para rezar en los monumentos, mira la página de mezquitas de Kansai.'],
      ['¿Taxi o tren para ir de Kioto a Nara o al aeropuerto?', 'Tren. En trayectos largos suele ser más rápido y mucho más barato que el taxi. El taxi compensa en distancias cortas dentro de la ciudad.'],
    ],
    rel: [['Tarjeta de comida en japonés', RUTA.comida.es], ['Trenes de Kansai: tiempos y precios', RUTA.trenes.es], ['Aeropuerto de Kansai', RUTA.aeropuerto.es], ['De Osaka a Kioto en tren', RUTA.osakaKioto.es], ['Mezquitas de Kansai (en inglés)', RUTA.mezquitas.es], ['Todas las herramientas gratis', RUTA.hub.es]],
    ctaH: '¿Prefieres que te recojan en el hotel?', ctaP: 'Con Tony no necesitas tarjetas: te recojo en tu hotel y nos movemos juntos en tren, autobús o taxi. Dime fechas y cuántos sois.',
    msg: 'Hola, Tony. Vengo de la tarjeta para el taxi y me gustaría un tour. Fechas: … Personas: … Hotel: …',
  },
  en: {
    title: 'Japanese taxi card: Kyoto, Osaka and Nara | Tony Kansai Guide',
    desc: 'Pick your Kansai destination or type your hotel and show the driver a large card in Japanese, with a voice button and Google Maps. Free, no sign-up.',
    ceja: 'Free tool · in Japanese',
    h1: 'How to tell a taxi driver in Japanese where you’re going',
    lead: 'Pick a destination from the most visited places in Kyoto, Osaka, Nara, Kobe and Himeji, or a mosque, or type the name or address of your hotel. Press “Show the driver” and it appears in large Japanese between two polite sentences. One button opens it in Google Maps, another has your phone read it aloud.',
    destH: 'Where are you going?',
    grupos: { kioto: 'Kyoto', osaka: 'Osaka', nara: 'Nara', lejos: 'Kobe, Himeji and Uji', mezquitas: 'Mosques' },
    hotelL: 'Or type your hotel or an address', hotelA: 'Japanese is best: copy it from your booking or ask the front desk. If you don’t have it, type it in Latin letters.',
    ui: { vista: 'What the driver will see', vacio: 'Pick a destination or type your hotel.', ver: 'Show the driver', mapa: 'Open in Google Maps', copiar: 'Copy the Japanese', copiado: 'Copied', noCopia: 'Could not copy', voz: 'Read aloud', parar: 'Stop the voice', cerrar: 'Close', ptTitulo: 'Taxi card', hotel: 'Your hotel or address', guardado: 'Your destination and hotel stay saved on this phone.' },
    tr: { abre: 'To this place, please.', cierra: 'Thank you very much.' },
    frases: { lugar: 'To this place, please.', direccion: 'To this address, please.', aqui: 'To here, please (pointing at the map).', pare: 'Please stop here.', tiempo: 'About how many minutes will it take?', puedoTarjeta: 'Can I pay by card?', tarjeta: 'By card, please.', recibo: 'A receipt, please.', maletero: 'Could you open the trunk, please?', gracias: 'Thank you very much.' },
    comoH: 'How to take a taxi in Japan',
    como: [
      ['Where to get one', 'Stations and hotels have taxi ranks (タクシー乗り場). On the street, just raise your hand. The sign by the windscreen says 空車 when the taxi is free; 賃走 or 実車, taken; 迎車, on its way to pick someone up; and 回送, not taking passengers.'],
      ['The door opens by itself', 'The driver opens and closes the rear left door with a lever. Wait for it to open, and don’t shut it yourself when you get out.'],
      ['Show the destination', 'Many drivers speak little English, and a name said with a foreign accent is easy to misunderstand. With the name in Japanese (or the map) there’s no doubt. Seat belts are compulsory in the back seats too.'],
      ['How to pay', 'You pay what the meter shows: no haggling and no tipping. Most city taxis take cards, and many also take IC cards such as ICOCA or Suica; check the stickers on the window or ask when you get in, and carry some cash just in case. From 22:00 the fare goes up.'],
      ['Groups and luggage', 'A standard taxi takes four passengers; if you’re more, take two. Suitcases go in the trunk: the driver opens it and usually helps you load them.'],
      ['Taxi apps', 'GO is Japan’s most used taxi app: it’s in English, lets you sign up with a foreign phone number and pay in the app. Check before the trip that your card works with it.'],
      ['Taxi or train?', 'For short rides within Kyoto or Osaka, especially for three or four people, a taxi is comfortable. Between cities or to the airport, the train is usually faster and much cheaper.'],
    ],
    trenesL: ['Kansai trains: times and fares', RUTA.trenes.en],
    frasesH: 'Taxi phrases', frasesP: 'Japanese, how to say it and what it means.', cols: ['Japanese', 'How to say it', 'What it means'],
    destTH: 'The destinations in Japanese', destTP: 'The exact name a driver understands, with a link to the map.', destCols: ['Japanese', 'How to say it', 'What it is', 'Map'], verMapa: 'Map',
    faq: [
      ['Do you tip taxi drivers in Japan?', 'No. You pay what the meter shows and that’s it. If you leave extra, you’ll normally be given the change back.'],
      ['Can I pay for a taxi by card?', 'In most taxis in Kyoto, Osaka and Kobe, yes, and many take ICOCA or Suica too. Check the stickers on the window or ask 「カードで払えますか？」 before you set off, and carry some cash just in case.'],
      ['Why isn’t saying the name in English enough?', 'Because many places have a Japanese name that sounds nothing like the English one (the Golden Pavilion is 金閣寺, Kinkaku-ji), and because some names are alike: Osaka has several Namba stations run by different companies. Read in Japanese, the driver doesn’t hesitate.'],
      ['What do I type if my hotel isn’t on the list?', 'The hotel’s name or address, in Japanese if possible: it’s in your booking confirmation, on the hotel’s Japanese website or on the hotel card from the front desk. If you only have it in Latin letters, type it anyway and show the map too.'],
      ['How many people fit in a taxi?', 'A standard taxi takes four passengers. If you’re five or six, the simplest option is two taxis.'],
      ['Does the GO app work for tourists?', 'Yes: it’s in English and lets you sign up with a foreign phone number and pay by card in the app. Some foreign cards fail, so test it before you rely on it.'],
      ['How do I get to a mosque by taxi?', 'The list includes the Osaka Ibaraki mosque (大阪茨木モスク) and the Kobe mosque (神戸ムスリムモスク), with their addresses in Japanese. For the Kyoto mosque and prayer spaces at the sights, see the Kansai mosques page.'],
      ['Taxi or train from Kyoto to Nara or the airport?', 'Train. On long trips it’s usually faster and much cheaper than a taxi. A taxi pays off for short distances within the city.'],
    ],
    rel: [['Japanese food card', RUTA.comida.en], ['Kansai trains: times and fares', RUTA.trenes.en], ['Kansai Airport', RUTA.aeropuerto.en], ['Osaka to Kyoto by train', RUTA.osakaKioto.en], ['Mosques in Kansai', RUTA.mezquitas.en], ['All free tools', RUTA.hub.en]],
    ctaH: 'Rather be picked up at your hotel?', ctaP: 'With Tony you don’t need cards: I pick you up at your hotel and we get around together by train, bus or taxi. Tell me your dates and group size.',
    msg: 'Hi Tony, I’m coming from the taxi card and I’d like a tour. Dates: … People: … Hotel: …',
  },
  ar: {
    title: 'بطاقة التاكسي باليابانية: كيوتو وأوساكا ونارا | Tony Kansai Guide',
    desc: 'اختر وجهتك في كانساي أو اكتب اسم فندقك، واعرض على سائق التاكسي بطاقة باليابانية بخط كبير، مع صوت ياباني وخرائط Google. مجانية ودون تسجيل.',
    ceja: 'أداة مجانية · باليابانية',
    h1: 'هكذا تخبر سائق التاكسي باليابانية إلى أين تذهب',
    lead: 'اختر وجهتك من أشهر الأماكن في كيوتو وأوساكا ونارا وكوبي وهيميجي، أو مسجدًا، أو اكتب اسم فندقك أو عنوانه. اضغط «اعرضها على السائق» فتظهر الوجهة باليابانية وبخط كبير بين جملتين مهذبتين. وبزرّ تفتحها في خرائط Google، وبزرّ آخر يقرؤها الجوال بصوت ياباني.',
    destH: 'إلى أين تذهب؟',
    grupos: { kioto: 'كيوتو', osaka: 'أوساكا', nara: 'نارا', lejos: 'كوبي وهيميجي وأوجي', mezquitas: 'المساجد' },
    hotelL: 'أو اكتب اسم فندقك أو عنوانًا', hotelA: 'الأفضل باليابانية: انسخه من تأكيد الحجز أو اطلبه من الاستقبال. وإن لم يكن عندك، فاكتبه بالحروف اللاتينية.',
    ui: { vista: 'هكذا سيراها السائق', vacio: 'اختر وجهة أو اكتب اسم فندقك.', ver: 'اعرضها على السائق', mapa: 'افتحها في خرائط Google', copiar: 'انسخ النص الياباني', copiado: 'تم النسخ', noCopia: 'تعذّر النسخ', voz: 'اقرأها بصوت ياباني', parar: 'أوقف الصوت', cerrar: 'إغلاق', ptTitulo: 'بطاقة التاكسي', hotel: 'فندقك أو العنوان', guardado: 'تبقى الوجهة واسم فندقك محفوظين في هذا الجوال.' },
    tr: { abre: 'إلى هذا المكان من فضلك.', cierra: 'شكرًا جزيلًا.' },
    frases: { lugar: 'إلى هذا المكان من فضلك.', direccion: 'إلى هذا العنوان من فضلك.', aqui: 'إلى هنا من فضلك (مع الإشارة إلى الخريطة).', pare: 'توقّف هنا من فضلك.', tiempo: 'كم دقيقة تقريبًا يستغرق الطريق؟', puedoTarjeta: 'هل أستطيع الدفع بالبطاقة؟', tarjeta: 'بالبطاقة من فضلك.', recibo: 'الإيصال من فضلك.', maletero: 'هل يمكنك فتح صندوق السيارة من فضلك؟', gracias: 'شكرًا جزيلًا.' },
    comoH: 'كيف تركب التاكسي في اليابان',
    como: [
      ['أين تجده', 'في المحطات والفنادق مواقف للتاكسي (タクシー乗り場)، وفي الشارع يكفي أن ترفع يدك. اللوحة بجانب الزجاج الأمامي تقول 空車 إذا كان فارغًا، و 賃走 أو 実車 إذا كان مشغولًا، و 迎車 إذا كان في طريقه لأخذ راكب، و 回送 إذا كان لا يأخذ ركابًا.'],
      ['الباب يُفتح وحده', 'الباب الخلفي الأيسر يفتحه السائق ويغلقه بذراع عنده. انتظر حتى يُفتح، ولا تغلقه بنفسك عند النزول.'],
      ['أرِه الوجهة', 'كثير من السائقين لا يتكلمون الإنجليزية إلا قليلًا، والاسم الذي يُنطق بلكنة أجنبية يُفهم بصعوبة. أما بالاسم الياباني (أو بالخريطة) فلا يبقى شك. وحزام الأمان إلزامي في المقاعد الخلفية أيضًا.'],
      ['كيف تدفع', 'تدفع ما يظهر في العدّاد: لا مساومة ولا بقشيش. أغلب سيارات التاكسي في المدن تقبل البطاقات، وكثير منها يقبل بطاقات IC مثل ICOCA وSuica؛ انظر إلى الملصقات على النافذة أو اسأل عند الركوب، واحمل بعض النقود احتياطًا. وبعد الساعة 22:00 ترتفع التعرفة.'],
      ['المجموعات والحقائب', 'يتسع التاكسي العادي لأربعة ركاب، فإن كنتم أكثر فخذوا سيارتين. والحقائب في صندوق السيارة: يفتحه السائق، وغالبًا يساعدك في وضعها.'],
      ['تطبيقات التاكسي', 'GO هو أكثر تطبيقات التاكسي استخدامًا في اليابان: متوفر بالإنجليزية، ويسمح بالتسجيل برقم هاتف أجنبي والدفع من داخله. تأكد قبل السفر أن بطاقتك تعمل فيه.'],
      ['تاكسي أم قطار؟', 'للمسافات القصيرة داخل كيوتو أو أوساكا، خصوصًا إن كنتم ثلاثة أو أربعة، التاكسي مريح. أما بين المدن أو إلى المطار فالقطار في العادة أسرع وأرخص بكثير.'],
    ],
    trenesL: ['قطارات كانساي: المدة والأسعار', RUTA.trenes.ar],
    frasesH: 'جمل للتاكسي', frasesP: 'اليابانية، وطريقة نطقها، ومعناها.', cols: ['اليابانية', 'النطق', 'المعنى'],
    destTH: 'الوجهات باليابانية', destTP: 'الاسم الدقيق الذي يفهمه السائق، مع رابط الخريطة.', destCols: ['اليابانية', 'النطق', 'ما هو', 'الخريطة'], verMapa: 'الخريطة',
    faq: [
      ['هل يُعطى سائق التاكسي بقشيشًا في اليابان؟', 'لا. تدفع ما يظهر في العدّاد وانتهى الأمر. وإن تركت زيادة، فالمعتاد أن يردّ لك الباقي.'],
      ['هل أستطيع دفع أجرة التاكسي بالبطاقة؟', 'في أغلب سيارات التاكسي في كيوتو وأوساكا وكوبي نعم، وكثير منها يقبل ICOCA أو Suica أيضًا. انظر إلى الملصقات على النافذة أو اسأل 「カードで払えますか？」 قبل الانطلاق، واحمل بعض النقود احتياطًا.'],
      ['لماذا لا يكفي أن أقول الاسم بالإنجليزية؟', 'لأن كثيرًا من الأماكن اسمها الياباني لا يشبه الإنجليزي (الجناح الذهبي اسمه 金閣寺، كينكاكو-جي)، ولأن هناك أسماء متشابهة: في أوساكا عدة محطات باسم نامبا تتبع شركات مختلفة. وحين يقرأ السائق الاسم باليابانية لا يتردد.'],
      ['ماذا أكتب إن لم يكن فندقي في القائمة؟', 'اسم الفندق أو عنوانه، وباليابانية إن أمكن: تجده في تأكيد الحجز، أو في موقع الفندق باليابانية، أو في بطاقة الفندق التي تأخذها من الاستقبال. وإن لم يكن عندك إلا بالحروف اللاتينية فاكتبه كذلك، وأرِ السائق الخريطة أيضًا.'],
      ['كم شخصًا يتسع التاكسي؟', 'التاكسي العادي يتسع لأربعة ركاب. وإن كنتم خمسة أو ستة فالأسهل أن تأخذوا سيارتين.'],
      ['هل يعمل تطبيق GO للسياح؟', 'نعم: هو بالإنجليزية، ويسمح بالتسجيل برقم هاتف أجنبي والدفع بالبطاقة من داخل التطبيق. بعض البطاقات الأجنبية لا تعمل فيه، فجرّبه قبل أن تعتمد عليه.'],
      ['كيف أذهب بالتاكسي إلى المسجد؟', 'في القائمة مسجد أوساكا إيباراكي (大阪茨木モスク) ومسجد كوبي (神戸ムスリムモスク) مع عنوانيهما باليابانية. أما مسجد كيوتو وأماكن الصلاة في المعالم، فانظر صفحة المساجد في كانساي.'],
      ['تاكسي أم قطار من كيوتو إلى نارا أو إلى المطار؟', 'القطار. في المسافات الطويلة هو في العادة أسرع وأرخص بكثير من التاكسي. والتاكسي مناسب للمسافات القصيرة داخل المدينة.'],
    ],
    rel: [['بطاقة الطعام الحلال باليابانية', RUTA.comida.ar], ['قطارات كانساي: المدة والأسعار', RUTA.trenes.ar], ['المساجد في كانساي', RUTA.mezquitas.ar], ['الطعام الحلال في كيوتو وأوساكا', RUTA.halal.ar], ['مطار كانساي (بالإنجليزية)', RUTA.aeropuerto.ar], ['كل الأدوات المجانية', RUTA.hub.ar]],
    ctaH: 'تفضّل أن نأتيك إلى الفندق؟', ctaP: 'مع طوني لا تحتاج إلى بطاقات: آتيك إلى فندقك ونتنقل معًا بالقطار أو الحافلة أو التاكسي. أخبرني بالتواريخ وعددكم.',
    msg: 'مرحبًا طوني، جئت من بطاقة التاكسي وأودّ حجز جولة. التواريخ: … عدد الأشخاص: … الفندق: …',
  },
}

function taxi(lang) {
  const t = TAXI[lang], c = COMUN[lang]
  const url = BASE + RUTA.taxi[lang]
  const rtl = lang === 'ar'
  const grupos = Object.keys(t.grupos)
  const destinos = DESTINOS.map((d) => ({ id: d.id, ja: d.ja, q: d.q, dir: d.dir || '', rom: d.rom, n: d.n[lang] }))
  const datos = { lang, dir: rtl ? 'rtl' : 'ltr', ja: JA_TAXI, tr: t.tr, ui: t.ui, destinos }
  const chip = (d) => `<label class="dt"><input type="radio" name="d" value="${d.id}"><span class="dt-ja" lang="ja" dir="ltr">${esc(d.ja)}</span><span class="dt-n">${esc(d.n[lang])}</span></label>`
  const herramienta = `<section class="herr" id="tarjeta" aria-label="${esc(t.ui.ptTitulo)}"><div class="kap herr-k">
<form class="op" id="tx-form" onsubmit="return false">
<fieldset><legend>${esc(t.destH)}</legend>
${grupos.map((g) => `<div class="dt-g"><p class="dt-gt">${esc(t.grupos[g])}</p><div class="dt-l">${DESTINOS.filter((d) => d.g === g).map(chip).join('')}</div></div>`).join('')}
</fieldset>
<div class="hotel"><label for="tx-hotel">${esc(t.hotelL)}</label><p id="tx-hotel-a">${esc(t.hotelA)}</p><input id="tx-hotel" type="text" autocomplete="off" maxlength="160" placeholder="ホテル名 / Hotel" aria-describedby="tx-hotel-a"></div>
<p class="nota">${esc(t.ui.guardado)}</p>
</form>
<aside class="vista"><p class="vista-e">${esc(t.ui.vista)}</p>
<div class="carta" id="tx-vista" lang="ja" dir="ltr" aria-live="polite"><p class="carta-vacia" lang="${lang}" dir="${rtl ? 'rtl' : 'ltr'}">${esc(t.ui.vacio)}</p></div>
<div class="acc"><button type="button" class="btn b-ver" disabled>${esc(t.ui.ver)}</button><a class="btn2 b-mapa" href="https://www.google.com/maps" target="_blank" rel="noopener" aria-disabled="true">${esc(t.ui.mapa)}</a><button type="button" class="btn2 b-copiar" disabled>${esc(t.ui.copiar)}</button><button type="button" class="btn2 b-voz" hidden aria-pressed="false">${esc(t.ui.voz)}</button></div>
</aside>
<div class="acc-movil"><button type="button" class="btn b-ver" disabled>${esc(t.ui.ver)}</button></div>
</div></section>
${pantallaHTML('tx', t.ui, true)}`
  const frasesHTML = tablaFrases(t, FRASES_TAXI.map(([j, r, k]) => [j, r, t.frases[k]]))
  const destinosHTML = `<table class="fr fr-dest"><thead><tr>${t.destCols.map((x) => `<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${DESTINOS.map((d) => `<tr><td class="fr-ja" lang="ja" dir="ltr">${esc(d.ja)}${d.dir ? `<small>${esc(d.dir)}</small>` : ''}</td><td class="fr-ro" dir="ltr" lang="ja-Latn">${esc(d.rom)}</td><td>${esc(d.n[lang])}</td><td><a href="${mapa(d.q)}" rel="noopener" target="_blank">${esc(t.verMapa)}<span class="oculto"> · ${esc(d.n[lang])}</span></a></td></tr>`).join('')}</tbody></table>`
  const textos = `<section class="bloque bloque-claro" id="como"><div class="kap">
<h2>${esc(t.comoH)}</h2>
<div class="hechos">${t.como.map(([h, p]) => `<article><h3>${tx(h)}</h3><p>${tx(p)}</p></article>`).join('')}</div>
<p class="mas"><a class="enlace-f" href="${t.trenesL[1]}">${esc(t.trenesL[0])} <span aria-hidden="true">${flecha(lang)}</span></a></p>
</div></section>
<section class="bloque" id="frases"><div class="kap">
<h2>${esc(t.frasesH)}</h2><p class="sub">${esc(t.frasesP)}</p>${frasesHTML}
</div></section>
<section class="bloque bloque-claro" id="destinos"><div class="kap">
<h2>${esc(t.destTH)}</h2><p class="sub">${esc(t.destTP)}</p>${destinosHTML}
</div></section>`
  const ld = ldHerramienta({ lang, url, name: t.h1, desc: t.desc, faq: t.faq, migas: [[c.migas, BASE + RUTA.hub[lang]], [t.ui.ptTitulo, url]] })
  const cuerpo = `${heroe(t)}
${herramienta}
${textos}
${faqHTML(c.faqH, t.faq)}
${relHTML(lang, c.relH, t.rel)}
${ctaHTML(lang, t)}`
  const js = `(function(){var D=${jsonScript(datos)};var B=(${clienteBase.toString()})(D.ui);(${clienteTaxi.toString()})(D,B)})()`
  return envoltorio({ lang, clave: 'taxi', title: t.title, desc: t.desc, ld, cuerpo, msg: t.msg, js })
}

// ════════════════════════════════════════════════════════════════════════════
// Piezas comunes de HTML y JSON-LD
// ════════════════════════════════════════════════════════════════════════════
function heroe(t) {
  return `<section class="heroe heroe-h"><div class="kap"><p class="ceja">${esc(t.ceja)}</p><h1>${esc(t.h1)}</h1><p class="respuesta">${tx(t.lead)}</p></div></section>`
}

function tablaFrases(t, filas) {
  return `<table class="fr"><thead><tr>${t.cols.map((x) => `<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${filas.map(([j, r, s]) => `<tr><td class="fr-ja" lang="ja" dir="ltr">${esc(j)}</td><td class="fr-ro" dir="ltr" lang="ja-Latn">${esc(r)}</td><td>${esc(s)}</td></tr>`).join('')}</tbody></table>`
}

/** Cartel a pantalla completa (un <dialog>): lo rellena el JS de cada herramienta. */
function pantallaHTML(p, ui, conMapa = false) {
  return `<dialog class="pt" id="${p}-pt" aria-labelledby="${p}-pt-t">
<div class="pt-barra"><p id="${p}-pt-t">${esc(ui.ptTitulo)}</p><button type="button" class="pt-x" id="${p}-cerrar">${esc(ui.cerrar)} <span aria-hidden="true">×</span></button></div>
<div class="pt-c" id="${p}-pt-c" lang="ja" dir="ltr"></div>
<div class="pt-acc"><button type="button" class="btn b-voz" hidden aria-pressed="false">${esc(ui.voz)}</button>${conMapa ? `<a class="btn2 b-mapa" href="https://www.google.com/maps" target="_blank" rel="noopener">${esc(ui.mapa)}</a>` : ''}<button type="button" class="btn2 b-copiar">${esc(ui.copiar)}</button></div>
</dialog>`
}

function faqHTML(h, faq) {
  return `<section class="bloque" id="preguntas"><div class="kap estrecho"><h2>${esc(h)}</h2>${faq.map(([q, a]) => `<details><summary>${tx(q)}</summary><p>${tx(a)}</p></details>`).join('')}</div></section>`
}

function relHTML(lang, h, rel) {
  return `<nav class="bloque bloque-claro rel" aria-labelledby="rel-h"><div class="kap"><h2 id="rel-h">${esc(h)}</h2><ul>${rel.map(([n, href]) => `<li><a href="${href}"${href.startsWith('http') ? ' rel="noopener"' : ''}><span>${esc(n)}</span><span aria-hidden="true">${flecha(lang)}</span></a></li>`).join('')}</ul></div></nav>`
}

function ctaHTML(lang, t) {
  return `<section class="cierre"><div class="kap"><h2>${esc(t.ctaH)}</h2><p>${esc(t.ctaP)}</p><a class="btn" href="${wa(t.msg)}" rel="noopener">${esc(COMUN[lang].ctaB)} <span aria-hidden="true">${flecha(lang)}</span></a></div></section>`
}

const ldFaq = (url, lang, faq) => ({ '@type': 'FAQPage', '@id': `${url}#preguntas`, inLanguage: lang, mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) })
const ldMigas = (lang, pasos) => ({ '@type': 'BreadcrumbList', itemListElement: [['Tony Kansai Guide', `${BASE}/${lang}/`], ...pasos].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) })

function ldHerramienta({ lang, url, name, desc, faq, migas }) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Person', '@id': `${BASE}/#tony`, name: 'Tony Hanma', url: `${BASE}/${lang}/`, jobTitle: 'Private tour guide in Kansai', knowsLanguage: ['es', 'en', 'ar'] },
      {
        '@type': 'WebApplication', '@id': `${url}#app`, name, description: desc, url, inLanguage: [lang, 'ja'],
        applicationCategory: 'TravelApplication', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript', isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: 0, priceCurrency: 'JPY' }, author: { '@id': `${BASE}/#tony` }, dateModified: HOY,
      },
      ldFaq(url, lang, faq),
      ldMigas(lang, migas),
    ],
  }
}

/** <html>…</html> con cabecera, menú, pie y franja del equipo, igual que precios.mjs. */
function envoltorio({ lang, clave, title, desc, ld, cuerpo, msg, js = '' }) {
  const c = COMUN[lang]
  const rtl = lang === 'ar'
  const url = BASE + RUTA[clave][lang]
  const fuentes = rtl
    ? 'family=IBM+Plex+Sans+Arabic:wght@400;500;600;700'
    : 'family=Geist:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600'
  const otros = LANGS.filter((l) => l !== lang).map((l) => ({ t: COMUN[l].idioma, h: RUTA[clave][l], hreflang: l, lang: l }))
  return `<!doctype html>
<html lang="${lang}" dir="${rtl ? 'rtl' : 'ltr'}" data-estatica="herramientas">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#f3eee4" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#15130f" media="(prefers-color-scheme: dark)">
<meta name="color-scheme" content="light dark">
<link rel="canonical" href="${url}">
${LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${BASE}${RUTA[clave][l]}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${BASE}${RUTA[clave].en}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Tony Kansai Guide">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${BASE}/v8/og/${lang}.jpg">
<meta property="og:locale" content="${{ es: 'es_ES', en: 'en_US', ar: 'ar_AR' }[lang]}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${jsonScript(ld)}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fuentes}&display=swap">
<style>${CSS}${menuCSS}${equipoCSS}</style>
</head>
<body>
<a class="saltar" href="#contenido">${esc(c.saltar)}</a>
<header class="top"><div class="kap"><a class="marca" href="/${lang}/"><span aria-hidden="true">⛩</span> Tony Kansai Guide</a>
${navHTML({ etiqueta: c.nav.etiqueta, abrir: c.nav.abrir, grupos: [
  { t: c.nav.g1, enlaces: c.herr.map(([n, h]) => [esc(n), h]) },
  { t: c.nav.g2, enlaces: c.tours.map(([n, h]) => [esc(n), h]) },
  { t: c.nav.g3, enlaces: [...c.mas.map(([n, h]) => [esc(n), h]), ...otros] },
], cta: { t: c.nav.cta, h: wa(msg) } })}</div></header>
<main id="contenido">
${cuerpo}
</main>
<footer>${pieHTML({ mas: c.pie.mas,
  intro: `<p>${esc(c.pie.intro)}</p>`,
  columnas: [
    { t: c.pie.c1, enlaces: c.herr.map(([n, h]) => [esc(n), h]) },
    { t: c.pie.c2, enlaces: c.tours.map(([n, h]) => [esc(n), h]) },
    { t: c.pie.c3, fija: true, html: `<p>WhatsApp: <a href="${wa(msg)}"><bdi dir="ltr">+34 634 193 106</bdi></a></p><p><a href="mailto:tony@tonykansaiguide.com">tony@tonykansaiguide.com</a></p>` },
  ],
  equipo: equipoHTML({ lang, actual: 'tony' }),
  fin: `<span>© Tony Kansai Guide</span><span>${esc(c.pie.act)}: <bdi dir="ltr">${HOY}</bdi></span>`,
})}</footer>
${js ? `<script>${js}</script>` : ''}
</body>
</html>
`
}

// ════════════════════════════════════════════════════════════════════════════
// JS del navegador. Se inserta con Function.prototype.toString(): estas
// funciones NO pueden usar nada de este módulo (solo sus argumentos).
// ════════════════════════════════════════════════════════════════════════════
function clienteBase(ui) {
  var d = document, ss = window.speechSynthesis, voz = null, luz = null, hablando = false
  var botonesVoz = [].slice.call(d.querySelectorAll('.b-voz'))
  function buscarVoz() {
    try { voz = ss.getVoices().filter(function (v) { return /^ja([-_]|$)/i.test(v.lang) })[0] || null } catch (e) { voz = null }
    botonesVoz.forEach(function (b) { b.hidden = !voz })
  }
  if (ss && window.SpeechSynthesisUtterance) {
    buscarVoz()
    if (ss.addEventListener) ss.addEventListener('voiceschanged', buscarVoz); else ss.onvoiceschanged = buscarVoz
  }
  function marcar(on) { hablando = on; botonesVoz.forEach(function (b) { b.textContent = on ? ui.parar : ui.voz; b.setAttribute('aria-pressed', on ? 'true' : 'false') }) }
  function parar() { try { if (ss) ss.cancel() } catch (e) {} marcar(false) }
  function hablar(texto) {
    if (!voz) return
    if (hablando) { parar(); return }
    try {
      ss.cancel()
      var u = new SpeechSynthesisUtterance(texto)
      u.lang = 'ja-JP'; u.voice = voz; u.rate = 0.9
      u.onend = u.onerror = function () { marcar(false) }
      ss.speak(u); marcar(true)
    } catch (e) { marcar(false) }
  }
  function copiar(texto, boton, dentro) {
    var antes = boton.textContent
    function fin(ok) { boton.textContent = ok ? ui.copiado : ui.noCopia; setTimeout(function () { boton.textContent = antes }, 1800) }
    function aMano() {
      try {
        var a = d.createElement('textarea'); a.value = texto; a.setAttribute('readonly', ''); a.style.position = 'fixed'; a.style.opacity = '0'
        ;(dentro || d.body).appendChild(a); a.select(); var ok = d.execCommand('copy'); a.remove(); fin(ok)
      } catch (e) { fin(false) }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texto).then(function () { fin(true) }, aMano)
    else aMano()
  }
  function alCerrar() { d.documentElement.classList.remove('pt-on'); parar(); try { if (luz) luz.release() } catch (e) {} luz = null }
  function abrir(pt) {
    if (typeof pt.showModal === 'function') { if (!pt.open) pt.showModal() } else pt.setAttribute('open', '')
    d.documentElement.classList.add('pt-on')
    // Que la pantalla no se apague mientras el camarero o el taxista la lee.
    try { if (navigator.wakeLock) navigator.wakeLock.request('screen').then(function (l) { luz = l }, function () {}) } catch (e) {}
    pt.addEventListener('close', alCerrar, { once: true })
  }
  function cerrar(pt) { if (typeof pt.close === 'function' && pt.open) pt.close(); else { pt.removeAttribute('open'); alCerrar() } }
  function leer(k) { try { return JSON.parse(localStorage.getItem(k)) } catch (e) { return null } }
  function guardar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  return { hablar: hablar, parar: parar, copiar: copiar, abrir: abrir, cerrar: cerrar, leer: leer, guardar: guardar, esc: esc }
}

function clienteComida(D, B) {
  var d = document, CLAVE = 'tk-tarjeta-comida'
  var f = d.getElementById('tc-form'), vista = d.getElementById('tc-vista'), pt = d.getElementById('tc-pt'), ptc = d.getElementById('tc-pt-c')
  var aviso = d.getElementById('tc-aviso'), ver = [].slice.call(d.querySelectorAll('.b-ver'))
  var inputs = [].slice.call(f.querySelectorAll('input[type=checkbox]')), por = {}
  inputs.forEach(function (i) { por[i.value] = i })
  var J = D.ja, T = D.tr, actual = []
  // Halal ya incluye «sin cerdo» y «sin alcohol»; vegano incluye «vegetariano».
  function incluir() {
    [['halal', ['cerdo', 'alcohol']], ['vegano', ['vegetariano']]].forEach(function (r) {
      var on = por[r[0]].checked
      r[1].forEach(function (k) { por[k].disabled = on; por[k].closest('label').classList.toggle('incl', on) })
    })
  }
  function sel() { var s = {}; inputs.forEach(function (i) { if (i.checked && !i.disabled) s[i.value] = true }); return s }
  function lineas(s) {
    var L = [], alg = D.alergenos.filter(function (k) { return s[k] })
    var dieta = D.dietas.some(function (k) { return s[k] }), veg = s.vegano || s.vegetariano
    if (!dieta && !alg.length) return L
    function p(j, t, item) { L.push({ j: j, t: t, item: !!item }) }
    function todas(k, saltar) { J[k].forEach(function (j, i) { if (saltar !== i) p(j, T[k][i]) }) }
    p(J.abre, T.abre)
    if (s.halal) {
      todas('halal', veg ? 3 : -1)
      if (!veg && !s.pescado) p(J.halalOk, T.halalOk)
    } else {
      if (s.cerdo) todas('cerdo')
      if (s.alcohol) todas('alcohol')
    }
    if (s.vegano) todas('vegano')
    else if (s.vegetariano) {
      todas('vegetariano')
      var k = !s.huevo && !s.leche ? 'ambos' : !s.huevo ? 'huevo' : !s.leche ? 'leche' : ''
      if (k) p(J.vegOk[k], T.vegOk[k])
    }
    if (alg.length) {
      p(J.alergia, T.alergia)
      alg.forEach(function (k) { p(J.alergenos[k], T.alergenos[k], true) })
      if (s.grave) todas('grave')
    }
    p(J.pregunta, T.pregunta); p(J.nosabe, T.nosabe); p(J.cierra, T.cierra)
    return L
  }
  function html(L) {
    return L.map(function (x) { return '<div class="ln' + (x.item ? ' ln-it' : '') + '"><p class="ln-ja">' + B.esc(x.j) + '</p><p class="ln-tr" lang="' + D.lang + '" dir="' + D.dir + '">' + B.esc(x.t) + '</p></div>' }).join('')
  }
  function texto(L) { return L.map(function (x) { return (x.item ? '・' : '') + x.j }).join('\n') }
  function pintar() {
    incluir()
    var s = sel()
    actual = lineas(s)
    aviso.hidden = !(s.grave && !D.alergenos.some(function (k) { return s[k] }))
    vista.innerHTML = actual.length ? html(actual) : '<p class="carta-vacia" lang="' + D.lang + '" dir="' + D.dir + '">' + B.esc(D.ui.vacio) + '</p>'
    ver.forEach(function (b) { b.disabled = !actual.length })
    ;[].forEach.call(d.querySelectorAll('.vista .b-copiar'), function (b) { b.disabled = !actual.length })
    if (pt.open) ptc.innerHTML = html(actual)
  }
  function guardar() { B.guardar(CLAVE, inputs.filter(function (i) { return i.checked }).map(function (i) { return i.value })) }
  var previo = B.leer(CLAVE)
  if (Array.isArray(previo)) previo.forEach(function (v) { if (por[v]) por[v].checked = true })
  f.addEventListener('change', function () { pintar(); guardar() })
  d.getElementById('tc-borrar').addEventListener('click', function () { inputs.forEach(function (i) { i.checked = false }); pintar(); guardar() })
  ver.forEach(function (b) { b.addEventListener('click', function () { if (!actual.length) return; ptc.innerHTML = html(actual); B.abrir(pt) }) })
  d.getElementById('tc-cerrar').addEventListener('click', function () { B.cerrar(pt) })
  ;[].forEach.call(d.querySelectorAll('.b-copiar'), function (b) { b.addEventListener('click', function () { if (actual.length) B.copiar(texto(actual), b, pt.open ? pt : null) }) })
  ;[].forEach.call(d.querySelectorAll('.b-voz'), function (b) { b.addEventListener('click', function () { if (actual.length) B.hablar(actual.map(function (x) { return x.j }).join('\n')) }) })
  pintar()
}

function clienteTaxi(D, B) {
  var d = document, CLAVE = 'tk-tarjeta-taxi'
  var f = d.getElementById('tx-form'), vista = d.getElementById('tx-vista'), pt = d.getElementById('tx-pt'), ptc = d.getElementById('tx-pt-c')
  var hotel = d.getElementById('tx-hotel'), ver = [].slice.call(d.querySelectorAll('.b-ver'))
  var radios = [].slice.call(f.querySelectorAll('input[name=d]'))
  var por = {}; D.destinos.forEach(function (x) { por[x.id] = x })
  var RE_JA = /[぀-ヿ㐀-鿿]/
  var actual = null, modoHotel = false
  function destino() {
    var h = hotel.value.trim()
    if (modoHotel && h) return { ja: h, sub: D.ui.hotel, dir: '', q: h, esJa: RE_JA.test(h) }
    var r = radios.filter(function (x) { return x.checked })[0]
    if (!r) return null
    var x = por[r.value]
    return { ja: x.ja, sub: x.n + ' · ' + x.rom, dir: x.dir, q: x.q, esJa: true }
  }
  function html(x, grande) {
    var largo = x.ja.length > 26 ? ' dest-xl' : x.ja.length > 12 ? ' dest-l' : ''
    return '<div class="ln"><p class="ln-ja">' + B.esc(D.ja.abre) + '</p><p class="ln-tr" lang="' + D.lang + '" dir="' + D.dir + '">' + B.esc(D.tr.abre) + '</p></div>'
      + '<div class="dest' + largo + '"><p class="dest-ja"' + (x.esJa ? ' lang="ja"' : ' lang="und" dir="auto"') + '>' + B.esc(x.ja) + '</p>'
      + (x.dir ? '<p class="dest-dir">' + B.esc(x.dir) + '</p>' : '')
      + '<p class="dest-sub" lang="' + D.lang + '" dir="' + D.dir + '">' + B.esc(x.sub) + '</p></div>'
      + '<div class="ln"><p class="ln-ja">' + B.esc(D.ja.cierra) + '</p><p class="ln-tr" lang="' + D.lang + '" dir="' + D.dir + '">' + B.esc(D.tr.cierra) + '</p></div>'
  }
  function texto(x) { return D.ja.abre + '\n' + x.ja + (x.dir ? '\n' + x.dir : '') + '\n' + D.ja.cierra }
  function pintar() {
    actual = destino()
    vista.innerHTML = actual ? html(actual) : '<p class="carta-vacia" lang="' + D.lang + '" dir="' + D.dir + '">' + B.esc(D.ui.vacio) + '</p>'
    ver.forEach(function (b) { b.disabled = !actual })
    ;[].forEach.call(d.querySelectorAll('.vista .b-copiar'), function (b) { b.disabled = !actual })
    ;[].forEach.call(d.querySelectorAll('.b-mapa'), function (a) {
      if (actual) { a.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(actual.q); a.removeAttribute('aria-disabled') } else a.setAttribute('aria-disabled', 'true')
    })
    if (pt.open && actual) ptc.innerHTML = html(actual)
  }
  function guardar() { var r = radios.filter(function (x) { return x.checked })[0]; B.guardar(CLAVE, { d: r ? r.value : '', h: hotel.value, m: modoHotel }) }
  var previo = B.leer(CLAVE)
  if (previo && typeof previo === 'object') {
    if (typeof previo.h === 'string') hotel.value = previo.h
    modoHotel = !!previo.m && !!hotel.value.trim()
    if (!modoHotel && previo.d) radios.forEach(function (x) { x.checked = x.value === previo.d })
  }
  radios.forEach(function (x) { x.addEventListener('change', function () { modoHotel = false; pintar(); guardar() }) })
  hotel.addEventListener('input', function () {
    modoHotel = !!hotel.value.trim()
    if (modoHotel) radios.forEach(function (x) { x.checked = false })
    pintar(); guardar()
  })
  hotel.addEventListener('focus', function () { if (hotel.value.trim()) { modoHotel = true; radios.forEach(function (x) { x.checked = false }); pintar(); guardar() } })
  ver.forEach(function (b) { b.addEventListener('click', function () { if (!actual) return; ptc.innerHTML = html(actual); B.abrir(pt) }) })
  d.getElementById('tx-cerrar').addEventListener('click', function () { B.cerrar(pt) })
  ;[].forEach.call(d.querySelectorAll('.b-mapa'), function (a) { a.addEventListener('click', function (e) { if (!actual) e.preventDefault() }) })
  ;[].forEach.call(d.querySelectorAll('.b-copiar'), function (b) { b.addEventListener('click', function () { if (actual) B.copiar(texto(actual), b, pt.open ? pt : null) }) })
  ;[].forEach.call(d.querySelectorAll('.b-voz'), function (b) { b.addEventListener('click', function () { if (actual) B.hablar(texto(actual)) }) })
  pintar()
}

// ════════════════════════════════════════════════════════════════════════════
// CSS: papel y tinta, un solo acento (el bermellón del torii de precios.mjs).
// La tarjeta que se enseña es siempre clara, también en modo oscuro: es lo que
// mejor lee un camarero o un taxista.
// ════════════════════════════════════════════════════════════════════════════
const CSS = `
:root{--papel:#f3eee4;--papel2:#ebe4d6;--tarjeta:#fbf8f2;--tinta:#1d1b18;--gris:#5c574f;--linea:rgba(29,27,24,.14);--acento:#b8381f;--acento-t:#fff;--suave:rgba(184,56,31,.08);
--noche:#1d1b18;--noche-t:#f3eee4;--carta:#fffdf8;--carta-t:#141210;--carta-g:#5c574f;
--mn-tarjeta:#fbf8f2;--mn-texto:#1d1b18;--mn-linea:rgba(29,27,24,.18);--mn-suave:#ebe4d6;--mn-acento:#b8381f;
--sans:'Geist',system-ui,-apple-system,'Segoe UI',sans-serif;--serif:'Source Serif 4',Georgia,serif;
--ja:'Hiragino Sans','Hiragino Kaku Gothic ProN','Noto Sans JP','Noto Sans CJK JP','Yu Gothic UI','Yu Gothic',Meiryo,sans-serif;--r:14px;color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-tema=claro]){--papel:#15130f;--papel2:#1c1a16;--tarjeta:#221f1a;--tinta:#efe9dd;--gris:#ada596;--linea:rgba(239,233,221,.14);--acento:#ec6a4b;--acento-t:#190b06;--suave:rgba(236,106,75,.12);
--noche:#0c0b09;--noche-t:#efe9dd;--mn-tarjeta:#221f1a;--mn-texto:#efe9dd;--mn-linea:rgba(239,233,221,.2);--mn-suave:#2c2822;--mn-acento:#c8432a;color-scheme:dark}}
html[dir=rtl]{--sans:'IBM Plex Sans Arabic',system-ui,sans-serif;--serif:'IBM Plex Sans Arabic',system-ui,sans-serif}
*{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
html.pt-on{overflow:hidden}
body{margin:0;background:var(--papel);color:var(--tinta);font:400 16px/1.6 var(--sans);overflow-x:hidden}
img{max-width:100%;height:auto;display:block}
a{color:inherit;text-underline-offset:3px}
h1,h2,h3{font-family:var(--serif);font-weight:600;line-height:1.12;margin:0;text-wrap:balance;letter-spacing:-.01em}
html[dir=rtl] h1,html[dir=rtl] h2,html[dir=rtl] h3{letter-spacing:0;line-height:1.35;font-weight:700}
p{margin:0}
[lang=ja]{font-family:var(--ja);letter-spacing:0}
[dir=ltr]{unicode-bidi:isolate}
bdi{font-variant-numeric:tabular-nums}
.nw{white-space:nowrap}
.kap{max-width:1120px;margin:0 auto;padding:0 16px}
@media (min-width:720px){.kap{padding:0 28px}}
.saltar{position:absolute;top:8px;inset-inline-start:16px;z-index:100;background:var(--tarjeta);padding:8px 12px;border-radius:8px;clip-path:inset(50%);width:1px;height:1px;overflow:hidden;white-space:nowrap}.saltar:focus{clip-path:none;width:auto;height:auto}
.oculto{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
:focus-visible{outline:2px solid var(--acento);outline-offset:2px}
.top{position:sticky;top:0;z-index:50;background:color-mix(in srgb,var(--papel) 92%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--linea)}
.top .kap{display:flex;align-items:center;gap:12px;min-height:60px}
.marca{font:600 17px/1 var(--sans);text-decoration:none;white-space:nowrap;display:flex;gap:8px;align-items:center}
.marca span{color:var(--acento)}
@media (max-width:420px){.marca{font-size:15px}}
/* Portada */
.heroe{padding:36px 0 32px}
@media (min-width:960px){.heroe{padding:72px 0 48px}}
.heroe-h{padding-bottom:20px}
@media (min-width:960px){.heroe-h{padding-bottom:28px}}
.ceja{font:600 12px/1.2 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--acento);margin-bottom:14px}
html[dir=rtl] .ceja{letter-spacing:0;font-size:14px}
h1{font-size:clamp(34px,6.6vw,68px);max-width:20ch}
.respuesta{margin-top:18px;font-size:clamp(17px,1.6vw,19px);line-height:1.65;color:var(--gris);max-width:66ch}
.heroe-k{display:grid;gap:36px}
@media (min-width:1000px){.heroe-k{grid-template-columns:minmax(0,1.25fr) minmax(0,.75fr);gap:56px;align-items:center}}
.hm{position:relative;display:grid;gap:14px;max-width:420px;text-align:left}
@media (max-width:999px){.hm{display:none}}
.hm .carta{min-height:0;padding:18px 20px}
.hm-b{margin-inline-start:44px}
.hm .dest{border-bottom:0;padding-bottom:0}
.bloque.bloque-1{padding-top:16px}
@media (min-width:720px){.bloque.bloque-1{padding-top:24px}}
.indice-h ul{list-style:none;margin:26px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.indice-h a{display:inline-flex;align-items:center;min-height:40px;padding:0 16px;border-radius:999px;border:1px solid var(--linea);background:var(--tarjeta);text-decoration:none;font-size:15px}
.indice-h a:hover{border-color:var(--tinta)}
/* Bloques */
.bloque{padding:52px 0;scroll-margin-top:72px}
@media (min-width:720px){.bloque{padding:80px 0}}
.bloque-claro{background:var(--papel2)}
.bloque h2{font-size:clamp(28px,4.6vw,44px)}
.sub{color:var(--gris);margin:12px 0 28px;max-width:64ch;font-size:16.5px}
.estrecho{max-width:820px}
.mas{margin-top:24px}
.enlace-f{font-weight:600;display:inline-flex;gap:8px;align-items:center;min-height:44px}
/* Bento del hub */
.bento{list-style:none;margin:0;padding:0;display:grid;gap:14px;grid-template-columns:minmax(0,1fr)}
@media (min-width:640px){.bento{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (min-width:1000px){.bento{grid-template-columns:repeat(6,minmax(0,1fr))}.bento>li{grid-column:span 2}.bento>.bt-g{grid-column:span 3}}
.bt a{position:relative;display:flex;flex-direction:column;gap:10px;height:100%;padding:22px 22px 54px;border-radius:var(--r);background:var(--tarjeta);border:1px solid var(--linea);text-decoration:none;transition:border-color .2s,transform .2s}
.bt a:hover{border-color:var(--tinta);transform:translateY(-2px)}
.bt h3{font-size:clamp(21px,2.2vw,25px)}
.bt p{color:var(--gris);font-size:15.5px}
.bt .bt-para{font-size:14px;font-weight:600;color:var(--tinta);margin-top:auto;padding-top:6px}
.bt-f{position:absolute;bottom:18px;inset-inline-end:22px;font-size:20px;color:var(--acento)}
.bt-g a{background:var(--noche);color:var(--noche-t);border-color:var(--noche);min-height:280px;padding-top:26px}
.bt-g a:hover{border-color:var(--acento)}
.bt-g p{color:color-mix(in srgb,var(--noche-t) 76%,transparent)}
.bt-g .bt-para{color:var(--noche-t)}
.bt-ja{font:700 clamp(30px,4.4vw,46px)/1.25 var(--ja);color:#f0a48f;margin-bottom:auto;padding-bottom:18px;overflow-wrap:anywhere}
.bt-g .bt-f{color:#f0a48f}
/* Cuándo te conviene un guía */
.guia{display:grid;gap:28px}
@media (min-width:900px){.guia{grid-template-columns:1.1fr .9fr;gap:56px;align-items:start}}
.lista{margin:0;padding:0;list-style:none;display:grid;gap:12px}
.lista li{position:relative;padding-inline-start:22px;font-size:17px}
.lista li::before{content:"";position:absolute;inset-inline-start:0;top:.62em;width:9px;height:9px;border-radius:2px;background:var(--acento)}
.guia-p{padding:24px;border-radius:var(--r);background:var(--tarjeta);border:1px solid var(--linea)}
.guia-p dl{margin:0 0 16px;border-top:2px solid var(--tinta)}
.guia-p dl>div{display:flex;justify-content:space-between;align-items:baseline;gap:16px;padding:12px 0;border-bottom:1px solid var(--linea)}
.guia-p dd{margin:0;font-weight:600;font-size:21px;white-space:nowrap;font-variant-numeric:tabular-nums}
.guia-p>p{color:var(--gris);font-size:15px}
.guia-b{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}
/* Herramienta */
.herr{padding:8px 0 56px}
.herr-k{display:grid;gap:28px}
@media (min-width:960px){.herr-k{grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:44px;align-items:start}}
.op fieldset{border:0;margin:0 0 30px;padding:0;min-width:0}
.op legend{font:600 clamp(22px,2.6vw,28px)/1.2 var(--serif);margin:0 0 14px;padding:0}
html[dir=rtl] .op legend{font-weight:700}
.op-l{display:grid;gap:8px}
@media (min-width:560px){.op-dos{grid-template-columns:repeat(2,minmax(0,1fr))}}
.op-grave{margin-top:8px}
.op-f{display:grid;grid-template-columns:26px minmax(0,1fr) auto;gap:12px;align-items:center;min-height:60px;padding:12px 16px;border:1px solid var(--linea);border-radius:12px;background:var(--tarjeta);cursor:pointer;transition:border-color .15s,background-color .15s}
.op-f:hover{border-color:var(--gris)}
.op-f input{appearance:none;-webkit-appearance:none;width:24px;height:24px;margin:0;border:2px solid var(--gris);border-radius:7px;display:grid;place-content:center;background:transparent;cursor:pointer}
.op-f input::before{content:"";width:12px;height:12px;transform:scale(0);transition:transform .12s;background:var(--acento-t);clip-path:polygon(14% 44%,0 65%,50% 100%,100% 16%,80% 0,43% 62%)}
.op-f input:checked,.op-f.incl input{background:var(--acento);border-color:var(--acento)}
.op-f input:checked::before,.op-f.incl input::before{transform:scale(1)}
.op-f:has(input:checked),.op-f.incl{border-color:var(--acento);background:var(--suave)}
.op-f.incl{cursor:default;opacity:.72}
.op-f input:focus-visible{outline:2px solid var(--acento);outline-offset:3px}
.op-t{min-width:0}
.op-t b{display:block;font-weight:600;font-size:17px;line-height:1.3}
.op-t small{display:block;color:var(--gris);font-size:14px;line-height:1.4;margin-top:2px}
.op-incl{display:none;font-style:normal;font-size:13px;font-weight:600;color:var(--acento);margin-top:2px}
.incl .op-incl{display:block}
.op-ja{font-size:14px;color:var(--gris);white-space:nowrap}
.aviso{margin-top:10px;font-weight:600;color:var(--acento)}
.nota{font-size:14px;color:var(--gris)}
.enlace{background:none;border:0;padding:0 2px;font:inherit;color:var(--tinta);text-decoration:underline;text-underline-offset:3px;cursor:pointer;min-height:32px}
/* Destinos del taxi */
.dt-g+.dt-g{margin-top:18px}
.dt-gt{font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--gris);margin-bottom:8px}
html[dir=rtl] .dt-gt{letter-spacing:0;font-size:14px}
.dt-l{display:grid;gap:8px;grid-template-columns:repeat(auto-fill,minmax(min(100%,150px),1fr))}
.dt{position:relative;display:flex;flex-direction:column;gap:3px;min-height:68px;padding:12px 14px;border:1px solid var(--linea);border-radius:12px;background:var(--tarjeta);cursor:pointer;transition:border-color .15s,background-color .15s}
.dt:hover{border-color:var(--gris)}
.dt input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}
.dt:has(input:checked){border-color:var(--acento);background:var(--suave);box-shadow:inset 0 0 0 1px var(--acento)}
.dt:has(input:focus-visible){outline:2px solid var(--acento);outline-offset:2px}
.dt-ja{font-size:18px;font-weight:700;line-height:1.3}
.dt-n{font-size:13.5px;color:var(--gris);line-height:1.3}
.hotel{margin:0 0 18px;padding:18px;border-radius:var(--r);border:1px dashed var(--gris)}
.hotel label{display:block;font:600 19px/1.3 var(--serif)}
html[dir=rtl] .hotel label{font-weight:700}
.hotel p{color:var(--gris);font-size:14.5px;margin:4px 0 12px}
.hotel input{width:100%;min-height:52px;padding:0 14px;border-radius:10px;border:1px solid var(--linea);background:var(--tarjeta);color:var(--tinta);font:500 18px/1.3 var(--ja)}
.hotel input:focus{outline:2px solid var(--acento);outline-offset:1px;border-color:var(--acento)}
/* Vista previa: la tarjeta tal cual la verá el camarero o el taxista */
.vista{display:grid;gap:12px}
@media (min-width:960px){.vista{position:sticky;top:84px}}
.vista-e{font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--gris)}
html[dir=rtl] .vista-e{letter-spacing:0;font-size:14px}
.carta{background:var(--carta);color:var(--carta-t);border:1px solid rgba(20,18,16,.14);border-top:6px solid #b8381f;border-radius:var(--r);padding:20px 20px 22px;display:grid;gap:12px;min-height:180px;align-content:start;box-shadow:0 18px 40px -28px rgba(0,0,0,.45);overflow-wrap:anywhere}
.carta-vacia{color:var(--carta-g);font-family:var(--sans);font-size:15.5px;align-self:center}
.ln-ja{font:700 clamp(18px,2vw,21px)/1.5 var(--ja)}
.ln-tr{font:400 13.5px/1.45 var(--sans);color:var(--carta-g);margin-top:2px}
.carta .ln-tr[dir=rtl],.pt .ln-tr[dir=rtl],.carta .dest-sub[dir=rtl],.pt .dest-sub[dir=rtl]{text-align:left}
.ln-it .ln-ja::before{content:"・"}
.dest{padding:14px 0;border-block:1px solid rgba(20,18,16,.12)}
.dest-ja{font:800 clamp(34px,5vw,46px)/1.2 var(--ja);color:#141210}
.dest-l .dest-ja{font-size:clamp(26px,3.6vw,34px)}
.dest-xl .dest-ja{font-size:clamp(20px,2.6vw,24px)}
.dest-dir{font:600 16px/1.4 var(--ja);margin-top:6px}
.dest-sub{font:400 13.5px/1.4 var(--sans);color:var(--carta-g);margin-top:6px}
.acc{display:flex;flex-wrap:wrap;gap:10px}
@media (min-width:960px){.carta{max-height:calc(100vh - 250px);overflow:auto}}
.acc-movil{display:none}
@media (max-width:959px){.acc-movil{display:block;position:sticky;bottom:0;z-index:5;margin-top:-8px;padding:14px 0 calc(12px + env(safe-area-inset-bottom));background:linear-gradient(to bottom,transparent,var(--papel) 30%)}.acc-movil .btn{width:100%}.acc .b-ver{display:none}}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:52px;padding:0 24px;border-radius:999px;border:0;background:var(--acento);color:var(--acento-t);font:600 17px/1.2 var(--sans);text-decoration:none;cursor:pointer;transition:transform .15s,opacity .15s}
.btn:active{transform:scale(.97)}
.btn2{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:0 20px;border-radius:999px;border:1px solid var(--tinta);background:transparent;color:var(--tinta);font:600 16px/1.2 var(--sans);text-decoration:none;cursor:pointer}
.btn:disabled,.btn2:disabled,.btn2[aria-disabled=true]{opacity:.42;cursor:not-allowed}
.acc .btn{flex:1 1 220px}
.acc .btn2{flex:1 1 auto}
/* Pantalla completa */
.pt{position:fixed;inset:0;width:100%;height:100%;max-width:none;max-height:none;margin:0;padding:0;border:0;background:var(--carta);color:var(--carta-t);color-scheme:light;--tinta:#141210;--acento:#b8381f;--acento-t:#fff}
.pt[open]{display:flex;flex-direction:column}
.pt::backdrop{background:#141210}
.pt-barra{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 16px;padding-top:max(10px,env(safe-area-inset-top));border-bottom:6px solid #b8381f}
.pt-barra p{font:600 14px/1.2 var(--sans);color:var(--carta-g)}
.pt-x{min-height:48px;padding:0 16px;border-radius:999px;border:1px solid rgba(20,18,16,.3);background:transparent;color:#141210;font:600 16px/1 var(--sans);cursor:pointer}
.pt-c{flex:1;width:100%;max-width:1240px;margin-inline:auto;overflow:auto;padding:24px 20px 32px;display:grid;gap:22px;align-content:start;overflow-wrap:anywhere;-webkit-overflow-scrolling:touch}
@media (min-width:720px){.pt-c{padding:44px 6vw 48px}}
.pt .ln-ja{font-size:clamp(26px,6.4vw,58px);line-height:1.42}
.pt .ln-tr{font-size:clamp(14px,1.6vw,18px)}
.pt .ln-it .ln-ja{font-size:clamp(24px,5.6vw,50px)}
.pt .dest{padding:22px 0}
.pt .dest-ja{font-size:clamp(48px,13vw,120px);line-height:1.15}
.pt .dest-l .dest-ja{font-size:clamp(36px,9vw,84px)}
.pt .dest-xl .dest-ja{font-size:clamp(26px,6vw,52px)}
.pt .dest-dir{font-size:clamp(20px,4.4vw,34px)}
.pt-acc{display:flex;flex-wrap:wrap;gap:10px;padding:12px 16px calc(12px + env(safe-area-inset-bottom));border-top:1px solid rgba(20,18,16,.12)}
.pt-acc>*{flex:1 1 150px;font-size:15.5px;padding:0 14px;text-align:center}
/* Pasos, hechos y frases */
.pasos{margin:24px 0 0;padding:0;list-style:none;counter-reset:p;display:grid;gap:16px}
.pasos li{counter-increment:p;display:grid;grid-template-columns:40px minmax(0,1fr);gap:14px;font-size:17px;align-items:baseline}
.pasos li::before{content:counter(p);font:600 26px/1 var(--serif);color:var(--acento);font-variant-numeric:tabular-nums}
.hechos{display:grid;gap:14px}
@media (min-width:760px){.hechos{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (min-width:1080px){.hechos{grid-template-columns:repeat(3,minmax(0,1fr))}}
.hechos article{padding:22px;border-radius:var(--r);background:var(--tarjeta);border:1px solid var(--linea)}
.hechos h3{font-size:21px;margin-bottom:8px}
.hechos p{color:var(--gris);font-size:15.5px}
.seguro{margin-top:18px;padding:24px;border-radius:var(--r);background:var(--noche);color:var(--noche-t)}
.seguro h3{font-size:clamp(21px,2.4vw,26px);margin-bottom:8px}
.seguro p{color:color-mix(in srgb,var(--noche-t) 82%,transparent);max-width:78ch}
.seguro a{color:#f0a48f}
.seguro-b{background:var(--tarjeta);color:var(--tinta);border:1px solid var(--linea)}
.seguro-b p{color:var(--gris)}
.fr{width:100%;border-collapse:collapse;border-top:2px solid var(--tinta)}
.fr th{font-size:13px;font-weight:600;color:var(--gris);text-align:start;padding:10px 12px 10px 0;border-bottom:1px solid var(--linea)}
html[dir=rtl] .fr th{padding:10px 0 10px 12px}
.fr td{padding:14px 12px 14px 0;border-bottom:1px solid var(--linea);vertical-align:top}
html[dir=rtl] .fr td{padding:14px 0 14px 12px}
.fr-ja{font:600 19px/1.5 var(--ja);text-align:start}
.fr-ja small{display:block;font-size:14px;font-weight:500;color:var(--gris)}
.fr-ro{color:var(--gris);font-style:italic;font-size:15px;text-align:start}
.fr td a{font-weight:600;white-space:nowrap}
@media (max-width:719px){
.fr thead{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
.fr,.fr tbody,.fr tr,.fr td{display:block;width:100%}
.fr tr{padding:14px 0;border-bottom:1px solid var(--linea)}
.fr td,html[dir=rtl] .fr td{padding:2px 0;border:0}
.fr-ja{font-size:20px}
}
/* Preguntas */
#preguntas details{border-top:1px solid var(--linea);padding:4px 0}
#preguntas details:last-of-type{border-bottom:1px solid var(--linea)}
#preguntas summary{cursor:pointer;font-weight:600;font-size:17px;min-height:56px;display:flex;align-items:center;list-style:none;gap:12px;justify-content:space-between}
#preguntas summary::-webkit-details-marker{display:none}
#preguntas summary::after{content:"+";font-size:24px;color:var(--acento);flex:none}
#preguntas details[open] summary::after{content:"−"}
#preguntas details p{color:var(--gris);padding:0 0 18px;max-width:70ch}
#preguntas h2{margin-bottom:22px}
/* Enlaces relacionados */
.rel ul{list-style:none;margin:24px 0 0;padding:0;display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(min(100%,260px),1fr))}
.rel a{display:flex;align-items:center;justify-content:space-between;gap:14px;min-height:64px;height:100%;padding:14px 18px;border:1px solid var(--linea);border-radius:12px;background:var(--tarjeta);text-decoration:none;font-weight:600;transition:border-color .2s}
.rel a:hover{border-color:var(--tinta)}
.rel a span:last-child{color:var(--acento);flex:none}
/* Cierre */
.cierre{padding:72px 0;background:var(--noche);color:var(--noche-t);text-align:center}
.cierre h2{font-size:clamp(28px,5vw,46px);max-width:24ch;margin-inline:auto}
.cierre p{color:color-mix(in srgb,var(--noche-t) 80%,transparent);margin:12px auto 26px;max-width:52ch}
.cierre .btn{background:#b8381f;color:#fff}
footer{background:var(--papel2);padding-top:48px;color:var(--tinta)}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{transition:none!important;animation:none!important}}
`.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '')

// ── Escritura ───────────────────────────────────────────────────────────────
const PAGINAS_HERR = { hub, comida, taxi }
for (const [clave, fn] of Object.entries(PAGINAS_HERR)) {
  for (const lang of LANGS) {
    const dir = join(root, 'public', RUTA[clave][lang])
    mkdirSync(dir, { recursive: true })
    const html = fn(lang)
    writeFileSync(join(dir, 'index.html'), html)
    console.log(`herramientas: ${RUTA[clave][lang]} (${Math.round(html.length / 1024)} KB)`)
  }
}
