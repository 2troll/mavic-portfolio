// Contenido de las páginas por idioma (versión 7 de la web).
//
// Cada página es para UN público y UN guía: Tony lleva español, inglés y árabe;
// Larion, ruso e inglés. El texto va escrito entero aquí, por idioma, y no
// pasa por el diccionario de tc(): así cada mercado lee un texto pensado para
// él y no una traducción del inglés.
//
// Regla de contenido: nada que no sea verdad. Ni cifras de clientes, ni
// "años de experiencia", ni sitios secretos. Precios y condiciones salen de
// data.ts y de las condiciones (/terms).

export type PaginaId = 'es' | 'en' | 'ar' | 'ru' | 'larion'
export type GuiaId = 'tony' | 'larion'

/** pos: dónde va la etiqueta en el globo, para que no se pisen ciudades vecinas. */
export interface Lugar { nombre: string; lat: number; lon: number; pos?: 'izq' | 'abajo' | 'arriba' }
export interface Plan { nombre: string; detalle: string; precio: string; yenes: number; desde?: boolean }
export interface Tarjeta { foto: string; titulo: string; texto: string }
export interface Pregunta { q: string; a: string }

export interface Pagina {
  id: PaginaId
  lang: 'es' | 'en' | 'ar' | 'ru'
  dir: 'ltr' | 'rtl'
  ruta: string
  guia: GuiaId
  seo: { titulo: string; descripcion: string }
  nav: { como: string; zona: string; precios: string; contacto: string; idioma: string }
  hero: { foto: string; titulo: string; sub: string; chips: string[]; cta: string; cta2: string }
  como: { titulo: string; pasos: { t: string; d: string }[]; noTitulo: string; no: string[]
    /** Qué incluye el precio: lo primero que compara un cliente entre guías. */
    si?: { titulo: string; items: string[] } }
  guiaTxt: { titulo: string; idiomas: string; bio: string[]; otro?: { texto: string; enlace: string; ruta: string } }
  zona: { titulo: string; sub: string; lugares: Lugar[]; origenes: Lugar[] }
  /** Las cuatro frases del globo con scroll: origen → Kansai → hotel → destino. */
  viaje: string[]
  ideas: { titulo: string; sub: string; tarjetas: Tarjeta[] }
  precios: {
    titulo: string; planes: Plan[]; notas: string[]; aprox: string; porGrupo: string; desde: string
    /** Lo que sale por cabeza en un grupo típico: el precio por grupo asusta menos así. */
    porPersona?: (yenes: number) => string
    /** Aviso de temporada (otoño de Kioto); se enseña solo en esas fechas. */
    temporada?: { titulo: string; texto: string; enlace?: { texto: string; ruta: string } }
  }
  mercado: { titulo: string; texto: string[]; relojes: { ciudad: string; tz: string }[]; tuHora: string; divisas: string[]; enlaces?: { texto: string; ruta: string }[] }
  /** `fuente`: archivo propio de reseñas (las de Larion); sin él, las de Tony. */
  resenas?: { titulo: string; nota?: string; opinar: string; fuente?: string }
  faq: { titulo: string; items: Pregunta[] }
  contacto: {
    titulo: string; sub: string
    nombre: string; pais: string; ciudad: string; fechas: string; personas: string
    hotel: string; intereses: string; notas: string
    paises: string[]; opcionesIntereses: string[]
    wa: string; mail: string; vista: string; aviso: string
    plantilla: (d: DatosContacto) => string
    asuntoMail: string
  }
  pie: { lema: string; legal: string; privacidad: string; condiciones: string; cookies: string; creditos: string; otrosIdiomas: string }
}

export interface DatosContacto {
  nombre: string; pais: string; ciudad: string; fechas: string
  personas: string; hotel: string; intereses: string[]; notas: string
}

// ── Datos comunes ────────────────────────────────────────────────────────────

/** WhatsApp de Tony (el de las facturas, perfil.json). */
export const WA_TONY = '34634193106'
/** PayPal.Me de Tony: enlace fijo que no caduca y admite muchos pagos (los de
 *  Wise son de un solo uso y caducan a los 30 días). /<importe>JPY lo deja puesto. */
export const PAYPAL_TONY = 'https://paypal.me/2troll'
/** Wisetag de Tony: fijo, pero solo paga quien ya tiene cuenta de Wise. */
export const WISE_TONY = 'https://wise.com/pay/me/amirk1643'
export const PAGAR: Record<string, { boton: string; wise: string; nota: string }> = {
  es: { boton: 'Pagar con PayPal', wise: 'Wise (con cuenta Wise)', nota: 'Si pagas por adelantado, hazlo solo cuando hayamos confirmado la fecha por WhatsApp.' },
  en: { boton: 'Pay with PayPal', wise: 'Wise (Wise account)', nota: 'If you pay in advance, do it only once we have confirmed your date on WhatsApp.' },
  ar: { boton: 'ادفع عبر PayPal', wise: 'Wise (لأصحاب حساب Wise)', nota: 'إن دفعت مسبقاً، فادفع فقط بعد تأكيد الموعد عبر واتساب.' },
}
/** WhatsApp de Larion (+81 80 8506 7586). */
export const WA_LARION = '818085067586'
export const CORREO = 'tony@tonykansaiguide.com'

const F = '/v7/fotos/'

const L = {
  osaka: { lat: 34.6937, lon: 135.5023, pos: 'abajo' as const },
  kioto: { lat: 35.0116, lon: 135.7681, pos: 'arriba' as const },
  nara: { lat: 34.6851, lon: 135.8048 },
  kobe: { lat: 34.6901, lon: 135.1955, pos: 'izq' as const },
  himeji: { lat: 34.8394, lon: 134.6939, pos: 'arriba' as const },
  uji: { lat: 34.8844, lon: 135.7997 },
  koyasan: { lat: 34.213, lon: 135.586 },
  amanohashidate: { lat: 35.569, lon: 135.1913 },
  okayama: { lat: 34.6551, lon: 133.9195 },
  hiroshima: { lat: 34.3853, lon: 132.4553, pos: 'arriba' as const },
  miyajima: { lat: 34.296, lon: 132.3198, pos: 'izq' as const },
}
const O = {
  madrid: { lat: 40.4168, lon: -3.7038 },
  cancun: { lat: 21.1619, lon: -86.8515 },
  londres: { lat: 51.5072, lon: -0.1276 },
  dubai: { lat: 25.2048, lon: 55.2708 },
  riad: { lat: 24.7136, lon: 46.6753 },
  moscu: { lat: 55.7558, lon: 37.6173 },
}

/** Precios de data.ts (PRICING). Si cambian allí, cambiarlos aquí. */
// Media del mercado en Japón (2026): medio día ¥18.000–35.000 y día de 8 h
// ¥35.000–60.000 por grupo. Nos ponemos algo por encima: español, árabe y
// ruso son idiomas de guía escasos.
const YEN = { medio: 38000, completo: 58000, lejos: 70000 }

/** Créditos de las fotos (las CC BY / BY-SA obligan a citarlos). */
export const CREDITOS = [
  { foto: 'Kioto: Fushimi Inari', autor: 'Basile Morin', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Double_torii_path_at_Fushimi_Inari_Taisha_Shrine,_Kyoto,_Japan.jpg' },
  { foto: 'Osaka: castillo', autor: 'Dick Thomas Johnson', licencia: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Osaka_Castle_2022-04-23.jpg' },
  { foto: 'Nara: ciervos', autor: 'Marek Ślusarczyk (Tupungato)', licencia: 'CC BY 3.0', url: 'https://commons.wikimedia.org/wiki/File:003_Nara_deer_in_Japan_-_deer_of_Nara_Park_under_autumn_leaves.jpg' },
  { foto: 'Kobe: puerto', autor: 'Martin Falbisoner', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Kobe_Port_Tower_and_Maritime_Museum,_November_2016.jpg' },
  { foto: 'Himeji: castillo', autor: 'Martin Falbisoner', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Himeji_Castle,_November_2016_-02.jpg' },
  { foto: 'Miyajima: torii', autor: 'Jakub Hałun', licencia: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Itsukushima-jinja_torii,_Miyajima,_Japan,_20240816_1716_4048.jpg' },
  { foto: 'Hiroshima: Cúpula de la Bomba Atómica', autor: 'Jakub Hałun', licencia: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Hiroshima_Peace_Memorial_(Genbaku_Dome),_20240817_0823_4200.jpg' },
  { foto: 'Globo y mapa: Blue Marble', autor: 'NASA Earth Observatory / GIBS', licencia: 'Dominio público', url: 'https://earthobservatory.nasa.gov/features/BlueMarble' },
]

const fmtYen = (n: number, sep: string) => '¥' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep)

function lineas(campos: [string, string][]): string {
  return campos.filter(([, v]) => v.trim()).map(([k, v]) => `${k}: ${v.trim()}`).join('\n')
}

// ── Español · Tony · España y México ─────────────────────────────────────────

const es: Pagina = {
  id: 'es', lang: 'es', viaje: ['Sales de Madrid o de Cancún.', 'Aterrizas en Kansai.', 'Te recojo en el vestíbulo de tu hotel.', 'Y pasamos el día donde quieras.'], dir: 'ltr', ruta: '/es/', guia: 'tony',
  seo: {
    titulo: 'Guía en español en Kioto, Osaka y Nara | Tony Kansai Guide',
    descripcion: 'Tony, guía privado en español. Te recoge en el hotel y pasáis el día en Kioto, Osaka, Nara o Kobe. Sin agencia y con precio cerrado por grupo.',
  },
  nav: { como: 'Cómo funciona', zona: 'Dónde vamos', precios: 'Precios', contacto: 'Escríbeme', idioma: 'Idioma' },
  hero: {
    foto: F + 'kioto.jpg',
    titulo: 'Tu guía privado en Japón, en español.',
    sub: 'Soy Tony. Te recojo en el hotel y pasamos el día en Kioto, Osaka, Nara o donde te apetezca. Sin agencia y sin grupo: hablas directamente conmigo.',
    chips: ['Solo tu grupo', 'Precio cerrado por grupo', 'Recogida en tu hotel'],
    cta: 'Reserva tu tour',
    cta2: 'Cuéntame tu viaje',
  },
  como: {
    titulo: 'Así funciona',
    pasos: [
      { t: 'Me escribes', d: 'Dime las fechas, cuántos sois, dónde os alojáis, de dónde venís y qué os apetece ver.' },
      { t: 'Te propongo el día', d: 'Te respondo con una ruta sencilla y un precio cerrado para todo el grupo. Sin letra pequeña. Si prefieres pagar por adelantado, te mando un enlace de pago con tarjeta.' },
      { t: 'Te recojo en el hotel', d: 'Ese día quedamos en el vestíbulo de tu hotel y salimos directos al destino.' },
    ],
    si: {
      titulo: 'Qué incluye el precio',
      items: [
        'Un día preparado para vosotros: ruta, horarios y paradas pensados antes de salir.',
        'Recogida en el vestíbulo de tu hotel.',
        'Te enseño a moverte: tarjeta IC, trenes y autobuses.',
        'Dónde comer bien, también halal o vegetariano si lo necesitáis.',
      ],
    },
    noTitulo: 'Lo que no incluye',
    no: [
      'No vendemos billetes de tren, hoteles ni entradas.',
      'Trenes, entradas y comidas los pagáis vosotros en el momento. Yo os digo cómo y dónde.',
    ],
  },
  guiaTxt: {
    titulo: 'Tu guía',
    idiomas: 'Español · Inglés · Árabe',
    bio: [
      'Soy Tony, español, y vivo en Osaka.',
      'Te enseño Kansai a tu ritmo: Kioto, Osaka, Nara, Kobe y Himeji. Y si tu viaje sigue, te acompaño por el resto de Japón.',
    ],
  },
  zona: {
    titulo: 'Dónde vamos',
    sub: 'Desde Osaka casi todo Kansai queda a menos de una hora en tren. ¿Otro rincón de Japón? Pregúntame.',
    lugares: [
      { nombre: 'Osaka', ...L.osaka }, { nombre: 'Kioto', ...L.kioto }, { nombre: 'Nara', ...L.nara },
      { nombre: 'Kobe', ...L.kobe }, { nombre: 'Himeji', ...L.himeji }, { nombre: 'Uji', ...L.uji },
      { nombre: 'Kōyasan', ...L.koyasan }, { nombre: 'Amanohashidate', ...L.amanohashidate },
    ],
    origenes: [{ nombre: 'Madrid', ...O.madrid }, { nombre: 'Cancún', ...O.cancun }],
  },
  ideas: {
    titulo: 'Ideas para tu día',
    sub: 'No son paquetes cerrados. Son sitios que conozco bien; el día lo montamos a tu medida.',
    tarjetas: [
      { foto: F + 'kioto.jpg', titulo: 'Kioto', texto: 'Fushimi Inari, Kiyomizu y las calles de Gion. Mejor temprano, antes de las multitudes.' },
      { foto: F + 'osaka.jpg', titulo: 'Osaka', texto: 'El castillo, Dōtonbori y los mercados donde come la gente de aquí.' },
      { foto: F + 'nara.jpg', titulo: 'Nara', texto: 'El Gran Buda de Tōdai-ji y los ciervos que pasean por el parque.' },
      { foto: F + 'himeji.jpg', titulo: 'Himeji', texto: 'El castillo blanco original, Patrimonio de la Humanidad.' },
      { foto: F + 'kobe.jpg', titulo: 'Kobe', texto: 'El puerto, el barrio de Kitano y la mezquita más antigua de Japón.' },
    ],
  },
  precios: {
    titulo: 'Precios claros',
    porGrupo: 'por grupo', desde: 'desde',
    planes: [
      { nombre: 'Medio día', detalle: '4 horas · hasta 6 personas', precio: fmtYen(YEN.medio, '.'), yenes: YEN.medio },
      { nombre: 'Día completo', detalle: '8 horas · hasta 6 personas', precio: fmtYen(YEN.completo, '.'), yenes: YEN.completo },
      { nombre: 'Excursión lejana', detalle: 'Kōyasan, Amanohashidate, Kumano…', precio: fmtYen(YEN.lejos, '.'), yenes: YEN.lejos, desde: true },
    ],
    notas: [
      'Se paga en efectivo, en yenes, el día del tour, o por adelantado con PayPal, Wise o transferencia.',
    ],
    aprox: 'al cambio de hoy',
    porPersona: (n) => `Siendo 4: ${fmtYen(n / 4, '.')} por persona`,
    temporada: {
      titulo: 'Otoño en Kioto',
      texto: 'De mediados de noviembre a principios de diciembre los arces de Kioto se ponen rojos. Llevo un solo grupo al día: reserva tu fecha con antelación.',
      enlace: { texto: 'Ver el día de otoño en Kioto', ruta: '/es/otono-kioto/' },
    },
  },
  mercado: {
    titulo: 'Si vienes de España o de México',
    texto: [
      'Japón va 7 horas por delante de España (8 en invierno) y 14 por delante de Cancún.',
      'Escríbeme cuando quieras: te contesto en cuanto amanezca aquí.',
    ],
    relojes: [
      { ciudad: 'Osaka', tz: 'Asia/Tokyo' }, { ciudad: 'Madrid', tz: 'Europe/Madrid' },
      { ciudad: 'Cancún', tz: 'America/Cancun' }, { ciudad: 'Ciudad de México', tz: 'America/Mexico_City' },
    ],
    tuHora: 'Tu hora',
    divisas: ['EUR', 'MXN', 'USD'],
    enlaces: [
      { texto: 'Guía práctica desde España', ruta: '/es/desde-espana/' },
      { texto: 'Guía práctica desde México', ruta: '/es/desde-mexico/' },
      { texto: 'Guía práctica desde Argentina', ruta: '/es/desde-argentina/' },
    ],
  },
  resenas: { titulo: 'Lo que dicen', opinar: '¿Hiciste un tour con nosotros? Deja tu opinión' },
  faq: {
    titulo: 'Preguntas',
    items: [
      { q: '¿Cómo se paga?', a: 'En efectivo, en yenes, el día del tour. Si prefieres pagar por adelantado, una vez confirmada la fecha por WhatsApp puedes hacerlo con PayPal o Wise desde los botones de Precios, o con un enlace de pago con tarjeta que te mando.' },
      { q: '¿Necesito el JR Pass?', a: 'Si os movéis dentro de Kansai, normalmente no. Con una tarjeta ICOCA o Suica pagáis cada tren y autobús. Pregúntame antes de comprar nada.' },
      { q: '¿Y si llueve?', a: 'Por ciudad salimos igual: Kansai con lluvia es precioso y hay menos gente. En montaña decido yo por seguridad; si se cancela, cambiamos de fecha o te devuelvo lo pagado.' },
      { q: '¿Podemos ir con niños?', a: 'Claro. Adapto el ritmo y el recorrido a su edad.' },
      { q: '¿Me recoges también en Kioto o en Nara?', a: 'Sí. Quedamos en el vestíbulo de tu hotel, esté en Osaka, Kioto, Nara o Kobe.' },
      { q: '¿Y si somos más de 6?', a: 'Los precios son para grupos de hasta 6 personas. Si sois más, escríbeme y te digo cómo lo organizamos.' },
      { q: '¿Hacéis tours de varios días?', a: 'Sí. Dime cuántos días tienes y qué quieres ver, y te paso un precio cerrado por todo.' },
      { q: '¿Y si alguien tiene movilidad reducida?', a: 'Dímelo al reservar. Adapto el recorrido, el ritmo y el transporte; algunos templos tienen muchas escaleras y te propongo alternativas.' },
      { q: '¿Y si cambian mis planes?', a: 'Escríbeme. Cancelar con más de 72 horas no cuesta nada; si tu vuelo se retrasa, buscamos otro día.' },
    ],
  },
  contacto: {
    titulo: 'Cuéntame tu viaje',
    sub: 'Rellena lo que sepas y se abrirá WhatsApp con el mensaje listo. Esta web no guarda nada.',
    nombre: 'Tu nombre', pais: '¿De dónde venís?', ciudad: 'Ciudad', fechas: 'Fechas', personas: 'Personas',
    hotel: 'Hotel o zona donde os alojáis', intereses: 'Qué os apetece', notas: 'Algo más (niños, movilidad, comida…)',
    paises: ['España', 'México', 'Argentina', 'Colombia', 'Chile', 'Perú', 'Estados Unidos', 'Otro país'],
    opcionesIntereses: ['Kioto', 'Osaka', 'Nara', 'Kobe', 'Himeji', 'Comida', 'Naturaleza', 'Otra zona de Japón'],
    wa: 'Enviar por WhatsApp', mail: 'Prefiero correo', vista: 'Tu mensaje',
    aviso: 'Te respondo yo, Tony, normalmente el mismo día.',
    asuntoMail: 'Tour privado en Japón',
    plantilla: (d) => `Hola Tony, te escribo desde la web.\n\n` + lineas([
      ['Nombre', d.nombre], ['Venimos de', [d.pais, d.ciudad].filter(Boolean).join(', ')], ['Fechas', d.fechas],
      ['Personas', d.personas], ['Alojamiento', d.hotel], ['Nos apetece', d.intereses.join(', ')], ['Más', d.notas],
    ]),
  },
  pie: {
    lema: 'Guía privado en Japón. Trato directo, sin agencia.',
    legal: 'Aviso legal', privacidad: 'Privacidad', condiciones: 'Condiciones', cookies: 'Cookies',
    creditos: 'Créditos de las fotos', otrosIdiomas: 'Otros idiomas',
  },
}

// ── English · Tony · United Kingdom ─────────────────────────────────────────

const en: Pagina = {
  id: 'en', lang: 'en', viaje: ['You fly in from London.', 'You land in Kansai.', 'I meet you in your hotel lobby.', 'And we spend the day wherever you like.'], dir: 'ltr', ruta: '/en/', guia: 'tony',
  seo: {
    titulo: 'Private guide in Kyoto, Osaka & Nara | Tony Kansai Guide',
    descripcion: 'Tony is a private guide in Kansai. He meets you at your hotel for a day in Kyoto, Osaka, Nara or Kobe. No agency, one fixed price per group.',
  },
  nav: { como: 'How it works', zona: 'Where we go', precios: 'Prices', contacto: 'Message me', idioma: 'Language' },
  hero: {
    foto: F + 'nara.jpg',
    titulo: 'Your private guide in Japan.',
    sub: 'I\'m Tony. I meet you in your hotel lobby and we spend the day in Kyoto, Osaka, Nara, or wherever you\'d like to go. No agency, no group: you deal with me directly.',
    chips: ['Just your party', 'One price per group', 'Hotel pick-up'],
    cta: 'Book a tour',
    cta2: 'Plan your day',
  },
  como: {
    titulo: 'How it works',
    pasos: [
      { t: 'You message me', d: 'Tell me your dates, how many of you there are, where you\'re staying, where you\'re travelling from and what you\'d like to see.' },
      { t: 'I suggest a plan', d: 'You get a simple route and one fixed price for the whole group. No small print. If you prefer to pay in advance, I send you a card payment link.' },
      { t: 'I meet you at your hotel', d: 'On the day we meet in your hotel lobby and head straight out.' },
    ],
    si: {
      titulo: 'What the price includes',
      items: [
        'A day planned for you: route, timings and stops worked out before we set off.',
        'Pick-up in your hotel lobby.',
        'I show you how to get around: IC card, trains and buses.',
        'Where to eat well, including halal or vegetarian if you need it.',
      ],
    },
    noTitulo: 'What it doesn\'t include',
    no: [
      'I don\'t sell train tickets, hotel rooms or admission tickets.',
      'Trains, admissions and meals are paid by you as we go. I\'ll show you how.',
    ],
  },
  guiaTxt: {
    titulo: 'Your guide',
    idiomas: 'English · Spanish · Arabic',
    bio: [
      'I\'m Tony. I\'m Spanish and I live in Osaka.',
      'I show you Kansai at your own pace: Kyoto, Osaka, Nara, Kobe and Himeji. If your trip goes further, I can come along to the rest of Japan too.',
    ],
    otro: { texto: 'Heading to Hiroshima? Larion also guides in English and covers the west.', enlace: 'Meet Larion', ruta: '/larion/' },
  },
  zona: {
    titulo: 'Where we go',
    sub: 'From Osaka, almost all of Kansai is under an hour by train. Somewhere else in Japan? Just ask.',
    lugares: [
      { nombre: 'Osaka', ...L.osaka }, { nombre: 'Kyoto', ...L.kioto }, { nombre: 'Nara', ...L.nara },
      { nombre: 'Kobe', ...L.kobe }, { nombre: 'Himeji', ...L.himeji }, { nombre: 'Uji', ...L.uji },
      { nombre: 'Kōyasan', ...L.koyasan }, { nombre: 'Amanohashidate', ...L.amanohashidate },
    ],
    origenes: [{ nombre: 'London', ...O.londres }],
  },
  ideas: {
    titulo: 'Ideas for your day',
    sub: 'These aren\'t fixed packages. They\'re places I know well; we shape the day around you.',
    tarjetas: [
      { foto: F + 'kioto.jpg', titulo: 'Kyoto', texto: 'Fushimi Inari, Kiyomizu and the lanes of Gion. Best early, before the crowds.' },
      { foto: F + 'osaka.jpg', titulo: 'Osaka', texto: 'The castle, Dōtonbori and the markets where locals actually eat.' },
      { foto: F + 'nara.jpg', titulo: 'Nara', texto: 'The Great Buddha of Tōdai-ji and the deer that wander the park.' },
      { foto: F + 'himeji.jpg', titulo: 'Himeji', texto: 'The original white castle, a UNESCO World Heritage Site.' },
      { foto: F + 'kobe.jpg', titulo: 'Kobe', texto: 'The harbour, the Kitano quarter and the oldest mosque in Japan.' },
    ],
  },
  precios: {
    titulo: 'Clear prices',
    porGrupo: 'per group', desde: 'from',
    planes: [
      { nombre: 'Half day', detalle: '4 hours · up to 6 people', precio: fmtYen(YEN.medio, ','), yenes: YEN.medio },
      { nombre: 'Full day', detalle: '8 hours · up to 6 people', precio: fmtYen(YEN.completo, ','), yenes: YEN.completo },
      { nombre: 'Long day trip', detalle: 'Kōyasan, Amanohashidate, Kumano…', precio: fmtYen(YEN.lejos, ','), yenes: YEN.lejos, desde: true },
    ],
    notas: [
      'Payment is in cash, in yen, on the day, or in advance with PayPal, Wise or bank transfer.',
    ],
    aprox: 'at today\'s rate',
    porPersona: (n) => `For 4 people: ${fmtYen(n / 4, ',')} each`,
    temporada: {
      titulo: 'Autumn in Kyoto',
      texto: 'From mid-November to early December, Kyoto\'s maples turn red. I take one group a day, so book your date early.',
      enlace: { texto: 'See the Kyoto autumn day', ruta: '/en/kyoto-autumn/' },
    },
  },
  mercado: {
    titulo: 'Coming from the UK',
    texto: [
      'Japan is 8 hours ahead of London in summer and 9 in winter.',
      'Message me whenever it suits you. I reply as soon as it\'s morning here. Tipping isn\'t expected in Japan, and that includes me.',
    ],
    relojes: [{ ciudad: 'Osaka', tz: 'Asia/Tokyo' }, { ciudad: 'London', tz: 'Europe/London' }],
    tuHora: 'Your time',
    divisas: ['GBP'],
    enlaces: [
      { texto: 'Practical guide for travellers from the UK', ruta: '/en/from-uk/' },
      { texto: 'Practical guide for travellers from the USA', ruta: '/en/from-usa/' },
    ],
  },
  resenas: { titulo: 'What guests say', nota: 'Real reviews, translated from Spanish. Tap “See original” to read them as written.', opinar: 'Toured with us? Leave a review' },
  faq: {
    titulo: 'Questions',
    items: [
      { q: 'How do I pay?', a: 'In cash, in yen, on the day. If you prefer to pay in advance, once we have confirmed your date on WhatsApp you can use PayPal or Wise from the buttons under Prices, or a card payment link I\'ll send you.' },
      { q: 'Do I need a JR Pass?', a: 'Not usually, if you\'re staying within Kansai. An ICOCA or Suica card covers almost every train and bus. Ask me before you buy anything.' },
      { q: 'What if it rains?', a: 'City days go ahead: Kansai is lovely in the rain and the crowds thin out. In the mountains I make the call for safety; if we cancel, we move the date or you get your money back.' },
      { q: 'Can we bring children?', a: 'Of course. I adapt the pace and the route to their age.' },
      { q: 'Can you pick us up in Kyoto or Nara too?', a: 'Yes. We meet in your hotel lobby, whether you\'re staying in Osaka, Kyoto, Nara or Kobe.' },
      { q: 'What if there are more than 6 of us?', a: 'Prices are for groups of up to 6. If you\'re more, message me and I\'ll tell you how we can organise it.' },
      { q: 'Do you do multi-day tours?', a: 'Yes. Tell me how many days you have and what you\'d like to see, and I\'ll send you one fixed price for everything.' },
      { q: 'What if someone has limited mobility?', a: 'Tell me when you book. I adapt the route, the pace and the transport; some temples have a lot of steps and I suggest alternatives.' },
      { q: 'What if my plans change?', a: 'Message me. Cancelling more than 72 hours ahead costs nothing, and if your flight is delayed we find another day.' },
    ],
  },
  contacto: {
    titulo: 'Plan your day',
    sub: 'Fill in what you know and WhatsApp opens with the message ready. Nothing is stored on this site.',
    nombre: 'Your name', pais: 'Where are you travelling from?', ciudad: 'City', fechas: 'Dates', personas: 'People',
    hotel: 'Hotel or area you\'re staying in', intereses: 'What you\'d like', notas: 'Anything else (children, mobility, food…)',
    paises: ['United Kingdom', 'Ireland', 'United States', 'Canada', 'Australia', 'Other country'],
    opcionesIntereses: ['Kyoto', 'Osaka', 'Nara', 'Kobe', 'Himeji', 'Food', 'Nature', 'Elsewhere in Japan'],
    wa: 'Send on WhatsApp', mail: 'I\'d rather email', vista: 'Your message',
    aviso: 'Tony replies personally, usually the same day.',
    asuntoMail: 'Private tour in Japan',
    plantilla: (d) => `Hi Tony, I'm writing from your website.\n\n` + lineas([
      ['Name', d.nombre], ['Travelling from', [d.ciudad, d.pais].filter(Boolean).join(', ')], ['Dates', d.fechas],
      ['People', d.personas], ['Staying at', d.hotel], ['Interested in', d.intereses.join(', ')], ['Also', d.notas],
    ]),
  },
  pie: {
    lema: 'Private guide in Japan. Booked directly, no agency.',
    legal: 'Legal notice', privacidad: 'Privacy', condiciones: 'Terms', cookies: 'Cookies',
    creditos: 'Photo credits', otrosIdiomas: 'Other languages',
  },
}

// ── العربية · Tony · الخليج ─────────────────────────────────────────────────

const ar: Pagina = {
  id: 'ar', lang: 'ar', viaje: ['تنطلق من دبي أو الرياض.', 'تهبط في كانساي.', 'ألتقيك في بهو فندقك.', 'ونقضي اليوم حيثما تحب.'], dir: 'rtl', ruta: '/ar/', guia: 'tony',
  seo: {
    titulo: 'مرشد بالعربية في كيوتو وأوساكا ونارا | Tony Kansai Guide',
    descripcion: 'طوني مرشد خاص بالعربية في كانساي. يلتقيك في فندقك ليوم في كيوتو أو أوساكا أو نارا. بلا وكالة، بسعر ثابت للمجموعة، مع مطاعم حلال وأوقات الصلاة.',
  },
  nav: { como: 'كيف نعمل', zona: 'إلى أين نذهب', precios: 'الأسعار', contacto: 'راسلني', idioma: 'اللغة' },
  hero: {
    foto: F + 'osaka.jpg',
    titulo: 'مرشدك الخاص في اليابان، بالعربية.',
    sub: 'أنا طوني. ألتقيك في بهو فندقك ونقضي اليوم في كيوتو أو أوساكا أو نارا أو حيثما تحب. بلا وكالة ولا مجموعات: تتعامل معي مباشرة.',
    chips: ['لعائلتك وحدها', 'سعر واحد للمجموعة', 'نلتقي في فندقك'],
    cta: 'احجز جولتك',
    cta2: 'خطّط ليومك',
  },
  como: {
    titulo: 'كيف نعمل',
    pasos: [
      { t: 'تراسلني', d: 'أخبرني بالتواريخ وعددكم ومكان إقامتكم ومن أين تأتون وما الذي تحبون رؤيته.' },
      { t: 'أقترح عليك خطة اليوم', d: 'يصلك مسار بسيط وسعر ثابت للمجموعة كلها، بلا شروط مخفية. وإن فضّلت الدفع مسبقاً أرسل لك رابط دفع بالبطاقة.' },
      { t: 'ألتقيك في الفندق', d: 'في اليوم المحدد نلتقي في بهو الفندق وننطلق مباشرة.' },
    ],
    si: {
      titulo: 'ما يشمله السعر',
      items: [
        'يوم مُعدّ لكم: المسار والمواعيد والمحطات مدروسة قبل الانطلاق.',
        'الاستقبال في بهو الفندق.',
        'أعلّمكم التنقل: بطاقة IC والقطارات والحافلات.',
        'أين تأكلون جيداً، مع مطاعم حلال موثوقة.',
      ],
    },
    noTitulo: 'ما لا يشمله السعر',
    no: [
      'لا نبيع تذاكر القطار ولا حجوزات الفنادق ولا تذاكر الدخول.',
      'القطارات وتذاكر الدخول والوجبات تدفعونها بأنفسكم في حينها، وأنا أدلّكم على الطريقة.',
    ],
  },
  guiaTxt: {
    titulo: 'مرشدك',
    idiomas: 'العربية · الإسبانية · الإنجليزية',
    bio: [
      'أنا طوني، إسباني مسلم وأعيش في أوساكا.',
      'أريك كانساي على راحتك: كيوتو وأوساكا ونارا وكوبي وهيميجي. وإن امتدت رحلتك أرافقك إلى بقية اليابان.',
    ],
  },
  zona: {
    titulo: 'إلى أين نذهب',
    sub: 'تقع معظم مناطق كانساي على بُعد أقل من ساعة بالقطار من أوساكا. مكان آخر في اليابان؟ اسألني.',
    lugares: [
      { nombre: 'أوساكا', ...L.osaka }, { nombre: 'كيوتو', ...L.kioto }, { nombre: 'نارا', ...L.nara },
      { nombre: 'كوبي', ...L.kobe }, { nombre: 'هيميجي', ...L.himeji }, { nombre: 'أوجي', ...L.uji },
      { nombre: 'كوياسان', ...L.koyasan }, { nombre: 'أمانوهاشيداتي', ...L.amanohashidate },
    ],
    origenes: [{ nombre: 'دبي', ...O.dubai }, { nombre: 'الرياض', ...O.riad }],
  },
  ideas: {
    titulo: 'أفكار ليومك',
    sub: 'ليست باقات جاهزة، بل أماكن أعرفها جيداً؛ نرتّب اليوم على مقاسك.',
    tarjetas: [
      { foto: F + 'kobe.jpg', titulo: 'كوبي', texto: 'الميناء وحي كيتانو، ومسجد كوبي، أقدم مسجد في اليابان.' },
      { foto: F + 'kioto.jpg', titulo: 'كيوتو', texto: 'فوشيمي إيناري وكيوميزو وأزقة غيون. الأفضل باكراً قبل الزحام.' },
      { foto: F + 'osaka.jpg', titulo: 'أوساكا', texto: 'القلعة ودوتونبوري والأسواق التي يأكل فيها أهل المدينة.' },
      { foto: F + 'nara.jpg', titulo: 'نارا', texto: 'تمثال بوذا الكبير في توداي-جي والغزلان التي تتجول في الحديقة.' },
      { foto: F + 'himeji.jpg', titulo: 'هيميجي', texto: 'القلعة البيضاء الأصلية، من مواقع التراث العالمي لليونسكو.' },
    ],
  },
  precios: {
    titulo: 'أسعار واضحة',
    porGrupo: 'للمجموعة', desde: 'ابتداءً من',
    planes: [
      { nombre: 'نصف يوم', detalle: '٤ ساعات · حتى ٦ أشخاص', precio: fmtYen(YEN.medio, ','), yenes: YEN.medio },
      { nombre: 'يوم كامل', detalle: '٨ ساعات · حتى ٦ أشخاص', precio: fmtYen(YEN.completo, ','), yenes: YEN.completo },
      { nombre: 'رحلة بعيدة', detalle: 'كوياسان، أمانوهاشيداتي، كومانو…', precio: fmtYen(YEN.lejos, ','), yenes: YEN.lejos, desde: true },
    ],
    notas: [
      'الدفع نقداً بالين في يوم الجولة، أو مسبقاً عبر PayPal أو Wise أو تحويل بنكي.',
    ],
    aprox: 'بسعر الصرف اليوم',
    temporada: {
      titulo: 'الخريف في كيوتو',
      texto: 'من منتصف نوفمبر حتى أوائل ديسمبر تتلوّن أشجار القيقب في كيوتو بالأحمر. أرافق مجموعة واحدة فقط في اليوم، فاحجز موعدك مبكراً.',
      enlace: { texto: 'شاهد يوم الخريف في كيوتو', ruta: '/ar/kyoto-autumn/' },
    },
  },
  mercado: {
    titulo: 'إن كنت قادماً من الخليج',
    texto: [
      'اليابان تسبق الإمارات وعُمان بخمس ساعات، والسعودية وقطر والكويت والبحرين بست ساعات.',
      'أعرف المطاعم الحلال الموثوقة في أوساكا وكيوتو، وأضع أوقات الصلاة في المسار من البداية: مسجد أوساكا، ومسجد كوبي، ومصليات مطار كانساي.',
      'الجولة خاصة بعائلتك وحدها، وبالإيقاع الذي يناسبكم.',
    ],
    relojes: [{ ciudad: 'أوساكا', tz: 'Asia/Tokyo' }, { ciudad: 'دبي', tz: 'Asia/Dubai' }, { ciudad: 'الرياض', tz: 'Asia/Riyadh' }],
    tuHora: 'توقيتك',
    divisas: ['AED', 'SAR'],
    enlaces: [{ texto: 'دليل المسافر من الخليج', ruta: '/ar/from-gulf/' }],
  },
  resenas: { titulo: 'ماذا يقول الضيوف', nota: 'مراجعات حقيقية مترجمة من الإسبانية. اضغط «عرض النص الأصلي» لقراءتها كما كُتبت.', opinar: 'هل قمت بجولة معنا؟ اترك رأيك' },
  faq: {
    titulo: 'أسئلة',
    items: [
      { q: 'كيف أدفع؟', a: 'نقداً بالين في يوم الجولة. وإن فضّلت الدفع مسبقاً، فبعد تأكيد الموعد عبر واتساب يمكنك الدفع عبر PayPal أو Wise من أزرار قسم الأسعار، أو برابط دفع بالبطاقة أرسله لك.' },
      { q: 'هل يوجد طعام حلال؟', a: 'نعم. أنا مسلم وأعرف الأماكن الحلال الموثوقة في أوساكا وكيوتو. أخبرني عند الحجز لا في يوم الجولة.' },
      { q: 'أين نصلي أثناء الجولة؟', a: 'في كانساي مسجد أوساكا ومسجد كوبي وجمعية كيوتو الإسلامية، وفي مطار كانساي مصليات في المبنيين. أضع وقفات الصلاة في المسار من البداية.' },
      { q: 'هل أحتاج تذكرة JR Pass؟', a: 'في الغالب لا إذا كانت إقامتك في كانساي. بطاقة ICOCA أو Suica تكفي لمعظم القطارات والحافلات. اسألني قبل أن تشتري.' },
      { q: 'هل تستقبلنا في كيوتو أو نارا أيضاً؟', a: 'نعم. نلتقي في بهو فندقكم، سواء كان في أوساكا أو كيوتو أو نارا أو كوبي.' },
      { q: 'وماذا لو كنا أكثر من ستة؟', a: 'الأسعار لمجموعات حتى ستة أشخاص. إن كنتم أكثر فراسلني وأخبرك كيف ننظّم الأمر.' },
      { q: 'هل تنظّم جولات لعدة أيام؟', a: 'نعم. أخبرني بعدد الأيام وما تحبون رؤيته، وأرسل لك سعراً ثابتاً للكل.' },
      { q: 'وماذا لو كان أحدنا محدود الحركة؟', a: 'أخبرني عند الحجز. أكيّف المسار والوتيرة والمواصلات؛ بعض المعابد فيها درج كثير وأقترح بدائل.' },
      { q: 'وماذا لو تغيّرت خططي؟', a: 'راسلني. الإلغاء قبل أكثر من ٧٢ ساعة مجاني، وإن تأخرت رحلتك نجد يوماً آخر.' },
    ],
  },
  contacto: {
    titulo: 'خطّط ليومك',
    sub: 'املأ ما تعرفه وسيُفتح واتساب والرسالة جاهزة. لا يحفظ هذا الموقع أي شيء.',
    nombre: 'اسمك', pais: 'من أين تأتون؟', ciudad: 'المدينة', fechas: 'التواريخ', personas: 'عدد الأشخاص',
    hotel: 'الفندق أو المنطقة التي تقيمون فيها', intereses: 'ما الذي تحبونه', notas: 'شيء آخر (أطفال، حركة، طعام…)',
    paises: ['الإمارات', 'السعودية', 'قطر', 'الكويت', 'البحرين', 'عُمان', 'مصر', 'الأردن', 'المغرب', 'دولة أخرى'],
    opcionesIntereses: ['كيوتو', 'أوساكا', 'نارا', 'كوبي', 'هيميجي', 'طعام حلال', 'الطبيعة', 'مكان آخر في اليابان'],
    wa: 'أرسل عبر واتساب', mail: 'أفضّل البريد الإلكتروني', vista: 'رسالتك',
    aviso: 'يرد عليك طوني شخصياً، عادةً في اليوم نفسه.',
    asuntoMail: 'جولة خاصة في اليابان',
    plantilla: (d) => `السلام عليكم يا طوني، أراسلك من الموقع.\n\n` + lineas([
      ['الاسم', d.nombre], ['قادمون من', [d.ciudad, d.pais].filter(Boolean).join('، ')], ['التواريخ', d.fechas],
      ['عدد الأشخاص', d.personas], ['الإقامة', d.hotel], ['نهتم بـ', d.intereses.join('، ')], ['ملاحظات', d.notas],
    ]),
  },
  pie: {
    lema: 'مرشد خاص في اليابان. تعامل مباشر بلا وكالة.',
    legal: 'إشعار قانوني', privacidad: 'الخصوصية', condiciones: 'الشروط', cookies: 'ملفات تعريف الارتباط',
    creditos: 'مصادر الصور', otrosIdiomas: 'لغات أخرى',
  },
}

// ── Русский · Larion · Россия и СНГ ─────────────────────────────────────────

const lugaresLarion = (n: Record<string, string>): Lugar[] => [
  { nombre: n.osaka, ...L.osaka }, { nombre: n.kioto, ...L.kioto }, { nombre: n.nara, ...L.nara },
  { nombre: n.kobe, ...L.kobe }, { nombre: n.himeji, ...L.himeji }, { nombre: n.okayama, ...L.okayama },
  { nombre: n.hiroshima, ...L.hiroshima }, { nombre: n.miyajima, ...L.miyajima },
]

const ru: Pagina = {
  id: 'ru', lang: 'ru', viaje: ['Вы вылетаете из Москвы.', 'Прилетаете в Кансай.', 'Я встречаю вас в лобби отеля.', 'И мы проводим день там, где вам хочется.'], dir: 'ltr', ruta: '/ru/', guia: 'larion',
  seo: {
    titulo: 'Гид на русском: Киото, Осака, Хиросима | Tony Kansai Guide',
    descripcion: 'Ларион — частный гид на русском. Встречает в отеле и везёт в Киото, Осаку, Нару, Хиросиму или на Миядзиму. Без агентства, цена за группу.',
  },
  nav: { como: 'Как это работает', zona: 'Куда едем', precios: 'Цены', contacto: 'Написать', idioma: 'Язык' },
  hero: {
    foto: F + 'miyajima.jpg',
    titulo: 'Частный гид в Японии — на русском.',
    sub: 'Меня зовут Ларион. Встречаю вас в лобби отеля, и мы едем туда, куда хотите вы: Киото, Осака, Нара, Хиросима, Миядзима. Без агентства и без групп — договариваетесь напрямую со мной.',
    chips: ['Только ваша компания', 'Цена за группу', 'Встреча в отеле'],
    cta: 'Забронировать тур',
    cta2: 'Рассказать о поездке',
  },
  como: {
    titulo: 'Как это работает',
    pasos: [
      { t: 'Вы пишете мне', d: 'Даты, сколько вас, где вы остановились, откуда приезжаете и что хотите увидеть.' },
      { t: 'Я предлагаю план', d: 'Простой маршрут и фиксированная цена за всю группу. Без мелкого шрифта.' },
      { t: 'Встречаю в отеле', d: 'В назначенный день встречаемся в лобби отеля и сразу едем.' },
    ],
    si: {
      titulo: 'Что входит в цену',
      items: [
        'День, спланированный для вас: маршрут, время и остановки продуманы заранее.',
        'Встреча в лобби вашего отеля.',
        'Покажу, как передвигаться: карта IC, поезда и автобусы.',
        'Где хорошо поесть, в том числе халяль или вегетарианское.',
      ],
    },
    noTitulo: 'Что не входит в цену',
    no: [
      'Не продаём билеты на поезда и входные билеты и не бронируем отели.',
      'Поезда, входные билеты и еду вы оплачиваете сами на месте. Я подскажу, как и где.',
    ],
  },
  guiaTxt: {
    titulo: 'Ваш гид',
    idiomas: 'Русский · Английский',
    bio: [
      'Меня зовут Ларион.',
      'Показываю Кансай — Киото, Осаку, Нару, Химэдзи — и запад: Хиросиму и Миядзиму.',
      'Горы, храмы и долгие пешие дни — моя стихия.',
    ],
  },
  zona: {
    titulo: 'Куда едем',
    sub: 'Кансай и запад Японии — от Киото до Хиросимы. Из Осаки до Хиросимы около полутора часов на синкансэне.',
    lugares: lugaresLarion({ osaka: 'Осака', kioto: 'Киото', nara: 'Нара', kobe: 'Кобе', himeji: 'Химэдзи', okayama: 'Окаяма', hiroshima: 'Хиросима', miyajima: 'Миядзима' }),
    origenes: [{ nombre: 'Москва', ...O.moscu }],
  },
  ideas: {
    titulo: 'Идеи для вашего дня',
    sub: 'Это не готовые туры, а места, которые я хорошо знаю. День собираем под вас.',
    tarjetas: [
      { foto: F + 'miyajima.jpg', titulo: 'Миядзима', texto: '«Плавучие» тории святилища Ицукусима и остров, где гуляют олени.' },
      { foto: F + 'hiroshima.jpg', titulo: 'Хиросима', texto: 'Купол Гэмбаку и Мемориальный парк мира.' },
      { foto: F + 'himeji.jpg', titulo: 'Химэдзи', texto: 'Белый замок, сохранившийся в первозданном виде, — объект ЮНЕСКО.' },
      { foto: F + 'kioto.jpg', titulo: 'Киото', texto: 'Фусими Инари, Киёмидзу и улочки Гиона. Лучше рано утром, до толп.' },
      { foto: F + 'nara.jpg', titulo: 'Нара', texto: 'Большой Будда храма Тодай-дзи и олени в парке.' },
      { foto: F + 'osaka.jpg', titulo: 'Осака', texto: 'Замок, Дотонбори и рынки, где едят местные.' },
    ],
  },
  precios: {
    titulo: 'Понятные цены',
    porGrupo: 'за группу', desde: 'от',
    planes: [
      { nombre: 'Полдня', detalle: '4 часа · до 6 человек', precio: fmtYen(YEN.medio, ' '), yenes: YEN.medio },
      { nombre: 'Целый день', detalle: '8 часов · до 6 человек', precio: fmtYen(YEN.completo, ' '), yenes: YEN.completo },
      { nombre: 'Дальняя поездка', detalle: 'Хиросима и Миядзима, Коясан…', precio: fmtYen(YEN.lejos, ' '), yenes: YEN.lejos, desde: true },
    ],
    notas: [
      'Оплата наличными в иенах в день экскурсии или переводом, если договоримся при бронировании.',
    ],
    aprox: 'по сегодняшнему курсу',
    temporada: {
      titulo: 'Осень в Киото',
      texto: 'С середины ноября до начала декабря клёны Киото становятся красными. Я беру одну группу в день — забронируйте дату заранее.',
      enlace: { texto: 'День осени в Киото', ruta: '/ru/kyoto-autumn/' },
    },
  },
  mercado: {
    titulo: 'Если вы летите из России',
    texto: [
      'Япония на 6 часов впереди Москвы.',
      'Российские карты Visa и Mastercard в Японии не работают — возьмите с собой наличные.',
      'Пишите в любое время: отвечу, как только здесь наступит утро.',
    ],
    relojes: [{ ciudad: 'Осака', tz: 'Asia/Tokyo' }, { ciudad: 'Москва', tz: 'Europe/Moscow' }],
    tuHora: 'Ваше время',
    divisas: ['RUB'],
    enlaces: [{ texto: 'Практичное для поездки из России', ruta: '/ru/from-russia/' }],
  },
  resenas: { titulo: 'Что говорят гости', nota: 'Отзывы, которые гости присылали Лариону в WhatsApp, собраны здесь.', opinar: 'Были на экскурсии с Ларионом? Оставьте отзыв', fuente: '/reviews-larion.json' },
  faq: {
    titulo: 'Вопросы',
    items: [
      { q: 'Нужен ли JR Pass?', a: 'Если вы ездите в пределах Кансая, обычно нет: карта ICOCA или Suica подходит почти для всех поездов и автобусов. Для поездки в Хиросиму посчитаем вместе. Спросите меня, прежде чем что-то покупать.' },
      { q: 'А если дождь?', a: 'По городу идём в любую погоду: в дождь Кансай красив, а людей меньше. В горах решаю я, ради безопасности; если отменяем, переносим дату или возвращаю оплату.' },
      { q: 'Можно с детьми?', a: 'Конечно. Подстрою темп и маршрут под возраст.' },
      { q: 'Вас больше шести?', a: 'Цены рассчитаны на группу до 6 человек. Если вас больше, напишите мне, и я расскажу, как это организовать.' },
      { q: 'Бывают туры на несколько дней?', a: 'Да. Напишите, сколько у вас дней и что хотите увидеть, и я пришлю одну фиксированную цену за всё.' },
      { q: 'А если планы изменятся?', a: 'Напишите мне. Отмена более чем за 72 часа бесплатна, а если задержали рейс — найдём другой день.' },
    ],
  },
  contacto: {
    titulo: 'Расскажите о поездке',
    sub: 'Заполните то, что знаете, — откроется WhatsApp с готовым сообщением. Сайт ничего не сохраняет.',
    nombre: 'Ваше имя', pais: 'Откуда вы приезжаете?', ciudad: 'Город', fechas: 'Даты', personas: 'Сколько человек',
    hotel: 'Отель или район, где вы остановились', intereses: 'Что вам интересно', notas: 'Что-то ещё (дети, здоровье, еда…)',
    paises: ['Россия', 'Казахстан', 'Беларусь', 'Узбекистан', 'Армения', 'Грузия', 'Другая страна'],
    opcionesIntereses: ['Киото', 'Осака', 'Нара', 'Хиросима', 'Миядзима', 'Химэдзи', 'Горы и природа', 'Еда'],
    wa: 'Отправить в WhatsApp', mail: 'Лучше по почте', vista: 'Ваше сообщение',
    aviso: 'Ларион ответит лично, обычно в тот же день.',
    asuntoMail: 'Частная экскурсия в Японии',
    plantilla: (d) => `Здравствуйте, Ларион! Пишу с сайта.\n\n` + lineas([
      ['Имя', d.nombre], ['Откуда', [d.ciudad, d.pais].filter(Boolean).join(', ')], ['Даты', d.fechas],
      ['Сколько человек', d.personas], ['Где живём', d.hotel], ['Интересно', d.intereses.join(', ')], ['Ещё', d.notas],
    ]),
  },
  pie: {
    lema: 'Частный гид в Японии. Напрямую, без агентства.',
    legal: 'Правовая информация', privacidad: 'Конфиденциальность', condiciones: 'Условия', cookies: 'Cookies',
    creditos: 'Авторы фотографий', otrosIdiomas: 'Другие языки',
  },
}

// ── English · Larion ─────────────────────────────────────────────────────────

const larion: Pagina = {
  ...en,
  como: { ...en.como, pasos: en.como.pasos.map((x) => ({ ...x, d: x.d.replace(' If you prefer to pay in advance, I send you a card payment link.', '') })) },
  faq: { ...en.faq, items: en.faq.items.filter((f) => f.q !== 'How do I pay?') },
  id: 'larion', ruta: '/larion/', guia: 'larion',
  viaje: ['Wherever you fly in from…', 'You land in Kansai.', 'I meet you in your hotel lobby.', 'And we head west, as far as Hiroshima.'],
  seo: {
    titulo: 'Larion, private guide in Kansai | Tony Kansai Guide',
    descripcion: 'Larion, private guide in Russian and English. He meets you at your hotel for Kyoto, Osaka, Nara, Hiroshima or Miyajima. One fixed price per group.',
  },
  hero: {
    foto: F + 'miyajima.jpg',
    titulo: 'A private guide in Kansai and Hiroshima.',
    sub: 'I\'m Larion. I meet you in your hotel lobby and we go wherever you\'d like: Kyoto, Osaka, Nara, Hiroshima, Miyajima. No agency, no group: you deal with me directly.',
    chips: en.hero.chips, cta: en.hero.cta, cta2: en.hero.cta2,
  },
  guiaTxt: {
    titulo: 'Your guide',
    idiomas: 'Russian · English',
    bio: [
      'I\'m Larion.',
      'I show you Kansai (Kyoto, Osaka, Nara, Himeji) and the west: Hiroshima and Miyajima.',
      'Mountains, temples and long walking days are my favourite ground.',
    ],
    otro: { texto: 'Prefer Spanish or Arabic? Tony guides in both, as well as English.', enlace: 'Meet Tony', ruta: '/en/' },
  },
  zona: {
    titulo: 'Where we go',
    sub: 'Kansai and western Japan, from Kyoto to Hiroshima. Osaka to Hiroshima is about an hour and a half by shinkansen.',
    lugares: lugaresLarion({ osaka: 'Osaka', kioto: 'Kyoto', nara: 'Nara', kobe: 'Kobe', himeji: 'Himeji', okayama: 'Okayama', hiroshima: 'Hiroshima', miyajima: 'Miyajima' }),
    origenes: [{ nombre: 'London', ...O.londres }],
  },
  ideas: {
    titulo: en.ideas.titulo, sub: en.ideas.sub,
    tarjetas: [
      { foto: F + 'miyajima.jpg', titulo: 'Miyajima', texto: 'The "floating" torii of Itsukushima Shrine, on an island where deer roam free.' },
      { foto: F + 'hiroshima.jpg', titulo: 'Hiroshima', texto: 'The Atomic Bomb Dome and the Peace Memorial Park.' },
      { foto: F + 'himeji.jpg', titulo: 'Himeji', texto: 'The original white castle, a UNESCO World Heritage Site.' },
      { foto: F + 'kioto.jpg', titulo: 'Kyoto', texto: 'Fushimi Inari, Kiyomizu and the lanes of Gion. Best early, before the crowds.' },
      { foto: F + 'nara.jpg', titulo: 'Nara', texto: 'The Great Buddha of Tōdai-ji and the deer that wander the park.' },
      { foto: F + 'osaka.jpg', titulo: 'Osaka', texto: 'The castle, Dōtonbori and the markets where locals actually eat.' },
    ],
  },
  precios: {
    ...en.precios,
    planes: en.precios.planes.map((p, i) => (i === 2 ? { ...p, detalle: 'Hiroshima & Miyajima, Kōyasan…' } : p)),
    // PayPal y Wise son de Tony: Larion cobra como siempre.
    notas: en.precios.notas.map((n) => (n.startsWith('Payment is in cash') ? 'Payment is in cash, in yen, on the day, or by bank transfer if we agree on it when you book.' : n)),
  },
  mercado: {
    titulo: 'Wherever you\'re flying in from',
    texto: ['Message me whenever it suits you. I reply as soon as it\'s morning here in Japan.'],
    relojes: [{ ciudad: 'Osaka', tz: 'Asia/Tokyo' }],
    tuHora: 'Your time',
    divisas: ['GBP', 'USD', 'EUR'],
  },
  resenas: { titulo: 'What guests say', nota: 'Messages guests sent Larion on WhatsApp, gathered here and translated from Russian. Tap “See original” to read them as written.', opinar: 'Toured with Larion? Leave a review', fuente: '/reviews-larion.json' },
  contacto: {
    ...en.contacto,
    paises: ['United Kingdom', 'United States', 'Germany', 'Kazakhstan', 'Other country'],
    opcionesIntereses: ['Kyoto', 'Osaka', 'Nara', 'Hiroshima', 'Miyajima', 'Himeji', 'Mountains & nature', 'Food'],
    aviso: 'Larion replies personally, usually the same day.',
    plantilla: (d) => `Hi Larion, I'm writing from the website.\n\n` + lineas([
      ['Name', d.nombre], ['Travelling from', [d.ciudad, d.pais].filter(Boolean).join(', ')], ['Dates', d.fechas],
      ['People', d.personas], ['Staying at', d.hotel], ['Interested in', d.intereses.join(', ')], ['Also', d.notas],
    ]),
  },
}

export const PAGINAS: Record<PaginaId, Pagina> = { es, en, ar, ru, larion }

/** Para el selector de idioma de cada página: sólo los idiomas de ESE guía. */
export const HERMANAS: Record<GuiaId, { id: PaginaId; etiqueta: string }[]> = {
  tony: [{ id: 'es', etiqueta: 'Español' }, { id: 'en', etiqueta: 'English' }, { id: 'ar', etiqueta: 'العربية' }],
  larion: [{ id: 'ru', etiqueta: 'Русский' }, { id: 'larion', etiqueta: 'English' }],
}

export const GUIAS: Record<GuiaId, { nombre: string; foto: string; wa: string }> = {
  tony: { nombre: 'Tony Hanma', foto: '/guides/tony-retrato.webp', wa: WA_TONY },
  larion: { nombre: 'Larion', foto: '/guides/guide-larion.webp', wa: WA_LARION },
}

/** Nombre del guía tal como se escribe en cada idioma. */
export const NOMBRE_GUIA: Record<PaginaId, string> = {
  es: 'Tony Hanma', en: 'Tony Hanma', ar: 'طوني هانما', ru: 'Ларион', larion: 'Larion',
}
