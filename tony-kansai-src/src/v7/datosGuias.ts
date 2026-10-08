// Textos de la guía «Cómo ir de Osaka a Kioto» (GuiaTransporte.tsx). Van aparte
// para que la app y las cabeceras SEO conozcan las rutas sin cargar la página.
//
// Regla de contenido: nada que no sea verdad. Los tiempos son aproximados y
// salen de los horarios oficiales; las tarifas NO se ponen porque cambian y no
// todas se han podido comprobar en una página oficial: se remite a la estación
// o a la web de cada compañía.
//
// Fuentes comprobadas el 2026-10-08:
// - JR Special Rapid (新快速) Osaka → Kioto, ~30 min (horario oficial JR West):
//   https://timetable.jr-odekake.net/line-timetable/2834
// - Shinkansen Kioto ↔ Shin-Osaka, 13-14 min entre salida y llegada (JR West):
//   https://timetable.jr-odekake.net/station-timetable/2815002001
// - Hankyu, Limited Express Osaka-umeda 10:00 → Kyoto-kawaramachi 10:43, para en Karasuma:
//   https://www.hankyu.co.jp/en/station/html/HK-01_ky_2_w.html
// - Keihan, Limited Express Yodoyabashi 12:00 → Gion-shijō 12:48, coche Premium [P];
//   los locales paran en Fushimi-Inari (horario de días laborables, cambio del 24-8-2026):
//   https://www.keihan.co.jp/traffic/time-fare/pdf/time01-1.pdf
//   https://www.keihan.co.jp/travel/en/trains/premium-car/
// - JR Pass: Nozomi/Mizuho solo con un billete especial aparte:
//   https://japanrailpass.net/en/about_jrp.html
// - Tarjetas IC (ICOCA, Suica…) en Hankyu, Keihan y JR West:
//   https://www.westjr.co.jp/global/en/howto/icoca/area/
//   https://www.hankyu.co.jp/en/station_guide/faq.html
//   https://www.keihan.co.jp/travel/en/trains/purchasing-tickets/
// - Shinkansen con tarjeta IC solo registrándola en smartEX y reservando:
//   https://smart-ex.jp/entraining/iccard/
// - JR Special Rapid «A-Seat» (coche reservado con suplemento):
//   https://faq.jr-odekake.net/faq_detail.html?id=10198

export type GuiaId = 'g-es' | 'g-en'

export const PRECIO_GUIA = { medio: 38000, completo: 58000 }

interface Opcion { kanji: string; nombre: string; trayecto: string; tiempo: string; para: string }
export interface PaginaGuia {
  lang: 'es' | 'en'; ruta: string; inicio: string
  seo: { titulo: string; descripcion: string }
  antetitulo: string; titulo: string; sub: string; cta: string
  opcionesTitulo: string; opcionesIntro: string; opciones: Opcion[]
  etiquetas: { trayecto: string; tiempo: string; para: string }
  consejosTitulo: string; consejos: string[]
  tour: { titulo: string; texto: string }
  preciosTitulo: string; medio: string; completo: string; porGrupo: string
  notas: string[]
  faqTitulo: string; faq: { p: string; r: string }[]
  final: { titulo: string; texto: string; boton: string }
  altFoto: string; saludo: string; volver: string
}

export const GUIAS_TRANSPORTE: Record<GuiaId, PaginaGuia> = {
  'g-es': {
    lang: 'es', ruta: '/es/osaka-kioto/', inicio: '/es/',
    seo: {
      titulo: 'Cómo ir de Osaka a Kioto en tren | Tony Kansai Guide',
      descripcion: 'JR, Hankyu, Keihan o shinkansen: de dónde sale cada tren, cuánto tarda y cuál te conviene según adónde vayas en Kioto. Guía práctica de un guía local.',
    },
    antetitulo: 'Guía práctica · Osaka → Kioto',
    titulo: 'Cómo ir de Osaka a Kioto',
    sub: 'Hay cuatro trenes buenos y ninguno es «el mejor» para todo el mundo: depende de dónde duermas en Osaka y de adónde quieras llegar en Kioto. Aquí tienes cada uno, con tiempos aproximados.',
    cta: 'Pregúntame por WhatsApp',
    opcionesTitulo: 'Las cuatro opciones',
    opcionesIntro: 'Los tiempos son aproximados y salen de los horarios oficiales de cada compañía. Las tarifas cambian, así que consulta la actual en la estación o en la web de la compañía.',
    etiquetas: { trayecto: 'Trayecto', tiempo: 'Tiempo', para: 'Te conviene si…' },
    opciones: [
      {
        kanji: 'JR 新快速', nombre: 'JR Special Rapid (shinkaisoku)',
        trayecto: 'Estación de Osaka (Umeda) → Estación de Kioto. Para también en Shin-Osaka.',
        tiempo: 'Unos 30 minutos.',
        para: 'Vas a la estación de Kioto o a Fushimi Inari (desde Kioto, la línea JR Nara te deja en la estación de Inari). Lo cubre el JR Pass. Algunos trenes llevan un coche «A-Seat» con asiento reservado y suplemento.',
      },
      {
        kanji: '阪急京都線', nombre: 'Hankyu, línea de Kioto',
        trayecto: 'Osaka-umeda → Kyoto-kawaramachi, pasando por Karasuma.',
        tiempo: 'Unos 45 minutos en Limited Express.',
        para: 'Duermes cerca de Umeda y vas al centro de Kioto: Kawaramachi, Shijō y el mercado de Nishiki. Gion está a un paseo cruzando el río Kamo. No lo cubre el JR Pass.',
      },
      {
        kanji: '京阪本線', nombre: 'Keihan, línea principal',
        trayecto: 'Yodoyabashi o Kitahama → Gion-shijō, y sigue hasta Sanjō y Demachiyanagi.',
        tiempo: 'Unos 50 minutos en Limited Express.',
        para: 'Quieres llegar directo a Gion y Higashiyama. Los trenes locales paran en Fushimi-Inari. El Limited Express tiene un coche Premium con asiento reservado y suplemento. No lo cubre el JR Pass.',
      },
      {
        kanji: '新幹線', nombre: 'Shinkansen',
        trayecto: 'Shin-Osaka → Estación de Kioto.',
        tiempo: 'Unos 15 minutos.',
        para: 'Tu hotel está en Shin-Osaka o tienes JR Pass (los Hikari y Kodama entran; los Nozomi piden un billete especial aparte). Desde Umeda no suele compensar: el Special Rapid tarda poco más y no hay que cambiar de tren.',
      },
    ],
    consejosTitulo: 'Consejos',
    consejos: [
      'Con una tarjeta IC (ICOCA, Suica…) pasas el torniquete en JR, Hankyu y Keihan sin comprar billete. El shinkansen es aparte: necesitas billete, o reservar en smartEX con la tarjeta registrada.',
      'Evita la hora punta de los días laborables, más o menos de 7:30 a 9:00: los trenes van llenos y viajar con maleta es incómodo.',
      'Si quieres ir sentado seguro, mira el coche Premium de Keihan, el «A-Seat» de JR o un asiento reservado en el shinkansen. Todos llevan suplemento.',
      'Antes de elegir tren, piensa dónde está tu hotel: muchas veces el mejor tren es el que sale más cerca.',
    ],
    tour: {
      titulo: 'O te recojo en el hotel y vamos juntos',
      texto: 'Si prefieres no pensar en trenes, te recojo en el vestíbulo de tu hotel en Osaka y vamos a Kioto juntos. Soy Tony, guía privado: solo tu grupo, a tu ritmo.',
    },
    preciosTitulo: 'Precio por grupo, hasta 6 personas',
    medio: 'Medio día · 4 horas', completo: 'Día completo · 8 horas', porGrupo: 'por grupo',
    notas: [
      'Trenes, entradas y comidas no están incluidos: se pagan en el momento y yo te digo cómo.',
      'Se paga en efectivo el día del tour o por adelantado con PayPal o Wise.',
      'Cancelación sin coste hasta 72 horas antes.',
    ],
    faqTitulo: 'Preguntas frecuentes',
    faq: [
      { p: '¿Cuál es la forma más rápida de ir de Osaka a Kioto?', r: 'Desde Shin-Osaka, el shinkansen: unos 15 minutos hasta la estación de Kioto. Desde la estación de Osaka (Umeda), el JR Special Rapid: unos 30 minutos.' },
      { p: '¿Qué tren me deja más cerca de Gion?', r: 'El Keihan llega a Gion-shijō en unos 50 minutos desde Yodoyabashi. El Hankyu llega a Kyoto-kawaramachi en unos 45 minutos desde Osaka-umeda, y desde allí Gion está a un paseo cruzando el río.' },
      { p: '¿El JR Pass cubre el trayecto?', r: 'Sí en el JR Special Rapid y en los shinkansen Hikari y Kodama; los Nozomi piden un billete especial aparte. Hankyu y Keihan no entran en el JR Pass.' },
      { p: '¿Puedo usar ICOCA o Suica?', r: 'Sí en JR, Hankyu y Keihan. Para el shinkansen necesitas un billete o reservar en smartEX con la tarjeta registrada.' },
    ],
    final: { titulo: '¿Vamos juntos a Kioto?', texto: 'Dime tus fechas, dónde está tu hotel y cuántas personas vienen. Te contesto yo, Tony, normalmente el mismo día.', boton: 'Escríbeme por WhatsApp' },
    altFoto: 'Camino de torii y farol en Fushimi Inari, Kioto',
    saludo: 'Hola Tony, he leído tu guía para ir de Osaka a Kioto y me interesa ir contigo. Fechas: ',
    volver: 'Volver a la página principal',
  },
  'g-en': {
    lang: 'en', ruta: '/en/osaka-to-kyoto/', inicio: '/en/',
    seo: {
      titulo: 'How to Get from Osaka to Kyoto by Train | Tony Kansai Guide',
      descripcion: 'JR, Hankyu, Keihan or shinkansen: where each train leaves from, how long it takes and which suits where you\'re going in Kyoto. A local guide\'s guide.',
    },
    antetitulo: 'Practical guide · Osaka → Kyoto',
    titulo: 'How to get from Osaka to Kyoto',
    sub: 'There are four good trains and none is "the best" for everyone: it depends on where you stay in Osaka and where you want to be in Kyoto. Here is each one, with approximate times.',
    cta: 'Ask me on WhatsApp',
    opcionesTitulo: 'The four options',
    opcionesIntro: 'Times are approximate and taken from each operator\'s official timetables. Fares change, so check the current fare at the station or on the operator\'s site.',
    etiquetas: { trayecto: 'Route', tiempo: 'Time', para: 'Best if…' },
    opciones: [
      {
        kanji: 'JR 新快速', nombre: 'JR Special Rapid',
        trayecto: 'Osaka Station (Umeda) → Kyoto Station. Also stops at Shin-Osaka.',
        tiempo: 'About 30 minutes.',
        para: 'You\'re heading to Kyoto Station or Fushimi Inari (from Kyoto, the JR Nara Line takes you to Inari Station). Covered by the JR Pass. Some trains have an "A-Seat" carriage with reserved seats for a supplement.',
      },
      {
        kanji: '阪急京都線', nombre: 'Hankyu Kyoto Line',
        trayecto: 'Osaka-umeda → Kyoto-kawaramachi, via Karasuma.',
        tiempo: 'About 45 minutes by Limited Express.',
        para: 'You\'re staying near Umeda and going to central Kyoto: Kawaramachi, Shijō and Nishiki Market. Gion is a short walk across the Kamo river. Not covered by the JR Pass.',
      },
      {
        kanji: '京阪本線', nombre: 'Keihan Main Line',
        trayecto: 'Yodoyabashi or Kitahama → Gion-shijō, continuing to Sanjō and Demachiyanagi.',
        tiempo: 'About 50 minutes by Limited Express.',
        para: 'You want to arrive right in Gion and Higashiyama. Local trains stop at Fushimi-Inari. The Limited Express has a Premium Car with reserved seats for a supplement. Not covered by the JR Pass.',
      },
      {
        kanji: '新幹線', nombre: 'Shinkansen',
        trayecto: 'Shin-Osaka → Kyoto Station.',
        tiempo: 'About 15 minutes.',
        para: 'Your hotel is at Shin-Osaka or you have a JR Pass (Hikari and Kodama are included; Nozomi needs a separate special ticket). From Umeda it rarely pays off: the Special Rapid takes only a little longer with no change of train.',
      },
    ],
    consejosTitulo: 'Tips',
    consejos: [
      'With an IC card (ICOCA, Suica…) you tap through the gates on JR, Hankyu and Keihan without buying a ticket. The shinkansen is separate: you need a ticket, or a smartEX booking with your registered card.',
      'Avoid weekday rush hour, roughly 7:30 to 9:00: trains are packed and travelling with luggage is hard work.',
      'If you want a guaranteed seat, look at Keihan\'s Premium Car, JR\'s "A-Seat" or a reserved seat on the shinkansen. All cost extra.',
      'Before choosing a train, think about where your hotel is: often the best train is simply the one that leaves closest.',
    ],
    tour: {
      titulo: 'Or I pick you up at your hotel and we go together',
      texto: 'If you\'d rather not think about trains, I meet you in your hotel lobby in Osaka and we go to Kyoto together. I\'m Tony, a private guide: just your group, at your pace.',
    },
    preciosTitulo: 'Price per group, up to 6 people',
    medio: 'Half day · 4 hours', completo: 'Full day · 8 hours', porGrupo: 'per group',
    notas: [
      'Trains, admissions and meals aren\'t included: you pay as we go and I show you how.',
      'Pay in cash on the day, or in advance with PayPal or Wise.',
      'Free cancellation up to 72 hours before.',
    ],
    faqTitulo: 'Frequently asked questions',
    faq: [
      { p: 'What is the fastest way from Osaka to Kyoto?', r: 'From Shin-Osaka, the shinkansen: about 15 minutes to Kyoto Station. From Osaka Station (Umeda), the JR Special Rapid: about 30 minutes.' },
      { p: 'Which train gets me closest to Gion?', r: 'Keihan reaches Gion-shijō in about 50 minutes from Yodoyabashi. Hankyu reaches Kyoto-kawaramachi in about 45 minutes from Osaka-umeda, and Gion is a short walk across the river from there.' },
      { p: 'Does the JR Pass cover the trip?', r: 'Yes on the JR Special Rapid and on Hikari and Kodama shinkansen; Nozomi needs a separate special ticket. Hankyu and Keihan are not covered by the JR Pass.' },
      { p: 'Can I use ICOCA or Suica?', r: 'Yes on JR, Hankyu and Keihan. For the shinkansen you need a ticket, or a smartEX booking with your registered card.' },
    ],
    final: { titulo: 'Shall we go to Kyoto together?', texto: 'Tell me your dates, where your hotel is and how many you are. I reply myself, usually the same day.', boton: 'Message me on WhatsApp' },
    altFoto: 'Torii path with a lantern at Fushimi Inari, Kyoto',
    saludo: 'Hi Tony, I read your Osaka to Kyoto guide and I\'d like to go with you. Dates: ',
    volver: 'Back to the main page',
  },
}

export const RUTAS_GUIA: Record<string, GuiaId> = { '/es/osaka-kioto': 'g-es', '/en/osaka-to-kyoto': 'g-en' }
export const SEO_GUIA = Object.fromEntries(Object.values(GUIAS_TRANSPORTE).map((p) => [p.ruta, { ...p.seo, lang: p.lang }]))
