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
/** enlace: va a HTML estático fuera del router (p. ej. /fr/), por eso se pinta con <a>. */
export interface Pregunta { q: string; a: string; enlace?: { texto: string; href: string } }

export interface Pagina {
  id: PaginaId
  lang: 'es' | 'en' | 'ar' | 'ru'
  dir: 'ltr' | 'rtl'
  ruta: string
  guia: GuiaId
  seo: { titulo: string; descripcion: string }
  nav: { como: string; zona: string; precios: string; contacto: string; idioma: string }
  /** fotoAlt: qué se ve en la foto (si falta, se usa el titular). */
  hero: { foto: string; fotoAlt?: string; titulo: string; sub: string; chips: string[]; cta: string; cta2: string }
  como: { titulo: string; pasos: { t: string; d: string }[]; noTitulo: string; no: string[]
    /** Qué incluye el precio: lo primero que compara un cliente entre guías. */
    si?: { titulo: string; items: string[] } }
  guiaTxt: { titulo: string; idiomas: string; bio: string[] }
  // ── Portada troncal de Tony (/es/, /en/, /ar/; rediseño de Antonio, 21-11-2026) ──
  // Opcionales: /ru/ y /larion/ siguen con su portada de siempre y no los usan.
  /** Tres experiencias genéricas, sin precio, que abren la conversación; y
   *  «otras puertas» para no cerrar nada (familias, Tokio, varios días…). */
  experiencias?: {
    titulo: string; sub: string
    lista: { titulo: string; texto: string; foto: string; alt: string; ruta: string }[]
    otras: { texto: string; ruta: string }[]
    preguntar: string
  }
  /** Un solo precio de referencia; la ficha completa va plegada debajo. */
  precioRef?: { titulo: string; texto: string; enlace: string; ruta: string; plegado: string; otono: string }
  /** Contacto con WhatsApp primero y el formulario plegado. */
  contactoWa?: { sub: string; boton: string; formulario: string; correo: string }
  /** Columna «Destinos» del pie. */
  destinosTitulo?: string
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
/** Contacto de Larion: Telegram, no WhatsApp (los clientes rusohablantes no usan
 *  WhatsApp). La cuenta es de Tony, que coordina y contesta por Larion; su nombre
 *  de perfil es «Luigi Prince Torres», de ahí la nota NOTA_TG para no despistar.
 *  t.me/<usuario> no admite texto prellenado. */
// 7-11-2026: Telegram PROPIO de Larion (antes el de Tony, @LUiGi19, que sigue en la RPDC).
export const TG_LARION = 'Larik_Yokota'
export const TG_TONY = 'LUiGi19'
// WhatsApp de Larion como canal SECUNDARIO (Telegram es el principal para rusohablantes).
export const WA_LARION = '818085067586'
export const WA_LARION_URL = `https://wa.me/${WA_LARION}`
export const WA_LARION_VISIBLE = '+81 80-8506-7586'
export const TG_LARION_URL = `https://t.me/${TG_LARION}`
export const TG_LARION_VISIBLE = `@${TG_LARION}`
export const TG_AZUL = '#229ED9'
export const NOTA_TG: Record<'ru' | 'en', string> = {
  ru: 'Ответит сам Ларион',
  en: "Larion answers here himself",
}
export const BOTON_TG: Record<'ru' | 'en', string> = { ru: 'Написать в Telegram', en: 'Message on Telegram' }
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
/** Créditos del pie. `tr` (y `licTr` cuando la licencia es texto) traduce la
 *  etiqueta para /en/, /ar/ y /ru/: un pie en español en la página rusa delata
 *  una traducción a medias. Quien pinta el pie elige `tr[lang] ?? foto`. */
export const CREDITOS = [
  { foto: 'Kioto: Fushimi Inari', tr: { en: 'Kyoto: Fushimi Inari', ar: 'كيوتو: فوشيمي إيناري', ru: 'Киото: Фусими Инари' }, autor: 'Basile Morin', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Double_torii_path_at_Fushimi_Inari_Taisha_Shrine,_Kyoto,_Japan.jpg' },
  { foto: 'Osaka: castillo', tr: { en: 'Osaka: the castle', ar: 'أوساكا: القلعة', ru: 'Осака: замок' }, autor: 'Dick Thomas Johnson', licencia: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Osaka_Castle_2022-04-23.jpg' },
  { foto: 'Nara: ciervos', tr: { en: 'Nara: deer', ar: 'نارا: الغزلان', ru: 'Нара: олени' }, autor: 'Marek Ślusarczyk (Tupungato)', licencia: 'CC BY 3.0', url: 'https://commons.wikimedia.org/wiki/File:003_Nara_deer_in_Japan_-_deer_of_Nara_Park_under_autumn_leaves.jpg' },
  { foto: 'Kobe: puerto', tr: { en: 'Kobe: the port', ar: 'كوبي: الميناء', ru: 'Кобе: порт' }, autor: 'Martin Falbisoner', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Kobe_Port_Tower_and_Maritime_Museum,_November_2016.jpg' },
  { foto: 'Himeji: castillo', tr: { en: 'Himeji: the castle', ar: 'هيميجي: القلعة', ru: 'Химэдзи: замок' }, autor: 'Martin Falbisoner', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Himeji_Castle,_November_2016_-02.jpg' },
  { foto: 'Miyajima: torii', tr: { en: 'Miyajima: the torii', ar: 'ميياجيما: بوابة التوري', ru: 'Миядзима: тории' }, autor: 'Jakub Hałun', licencia: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Itsukushima-jinja_torii,_Miyajima,_Japan,_20240816_1716_4048.jpg' },
  { foto: 'Hiroshima: Cúpula de la Bomba Atómica', tr: { en: 'Hiroshima: Atomic Bomb Dome', ar: 'هيروشيما: قبة القنبلة الذرية', ru: 'Хиросима: Атомный купол' }, autor: 'Jakub Hałun', licencia: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Hiroshima_Peace_Memorial_(Genbaku_Dome),_20240817_0823_4200.jpg' },
  { foto: 'Globo y mapa: Blue Marble', tr: { en: 'Globe and map: Blue Marble', ar: 'الكرة الأرضية والخريطة: Blue Marble', ru: 'Глобус и карта: Blue Marble' }, licTr: { en: 'Public domain', ar: 'ملكية عامة', ru: 'Общественное достояние' }, autor: 'NASA Earth Observatory / GIBS', licencia: 'Dominio público', url: 'https://earthobservatory.nasa.gov/features/BlueMarble' },
  // 21-11-2026: portada de /es/, /en/ y /ar/ (el castillo de Himeji con cerezos, la
  // de abajo: v7/fotos/portada*) y las fotos de las tres experiencias (datos de
  // src/v8/creditosZonas.json). El Fuji salió de la portada (tenía un torii rojo en
  // la orilla); su crédito sigue en /es/rutas/ (CREDITOS_ITIN de Itinerarios.tsx).
  { foto: 'Himeji: castillo con cerezos', tr: { en: 'Himeji: castle with cherry blossoms', ar: 'هيميجي: القلعة وأزهار الكرز', ru: 'Химэдзи: замок и сакура' }, autor: 'Seattleite7', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File%3AHimeji_Castle_with_cherry_blossoms_from_front.jpg' },
  { foto: 'Kioto: Kinkaku-ji', tr: { en: 'Kyoto: Kinkaku-ji', ar: 'كيوتو: كينكاكو-جي', ru: 'Киото: Кинкаку-дзи' }, autor: 'Basile Morin', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File%3AWater_reflection_of_Kinkaku-ji_Temple_a_sunny_day%2C_Kyoto%2C_Japan.jpg' },
  { foto: 'Kioto: Kiyomizu-dera', tr: { en: 'Kyoto: Kiyomizu-dera', ar: 'كيوتو: كيوميزو-ديرا', ru: 'Киото: Киёмидзу-дэра' }, autor: 'Martin Falbisoner', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File%3AKiyomizu-dera%2C_Kyoto%2C_November_2016_-01.jpg' },
  { foto: 'Osaka: mercado de Kuromon', tr: { en: 'Osaka: Kuromon Market', ar: 'أوساكا: سوق كورومون', ru: 'Осака: рынок Куромон' }, autor: 'SungMinSeung', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File%3AOsaka_market.jpg' },
  { foto: 'Nara: monte Yoshino', tr: { en: 'Nara: Mount Yoshino', ar: 'نارا: جبل يوشينو', ru: 'Нара: гора Ёсино' }, autor: 'Nankou Oronain', licencia: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File%3A%E5%90%89%E9%87%8E%E5%B1%B1_%E4%B8%8A%E5%8D%83%E6%9C%AC%E3%81%8B%E3%82%89%E3%81%AE%E7%9C%BA%E3%82%81_Yoshino-yama%2C_view_from_Kami-sembon_2014.4.12_-_panoramio.jpg' },
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
    descripcion: 'Tony, guía privado en español. Te recoge en el hotel y pasáis el día en Kioto, Osaka, Nara o Kobe, con precio cerrado por grupo.',
  },
  // 21-11-2026 (Antonio): voz de empresa («nosotros»), todo Japón y no solo Kansai,
  // y el castillo blanco de Himeji con cerezos y cielo azul (el Japón que imagina el
  // cliente, Antonio puntos 1-2), en vez de los torii rojos de Fushimi.
  nav: { como: 'Cómo funciona', zona: 'Dónde vamos', precios: 'Precios', contacto: 'Escríbenos', idioma: 'Idioma' },
  hero: {
    foto: F + 'portada.jpg',
    fotoAlt: 'El castillo blanco de Himeji entre cerezos en flor, con cielo azul',
    titulo: 'Guías privados en español por todo Japón.',
    sub: 'Te recogemos en tu hotel y pasamos el día donde quieras: Kioto, Tokio, el monte Fuji o ese rincón de Japón que sueñas. Solo tu grupo y un precio cerrado.',
    chips: ['Solo tu grupo', 'Recogida en tu hotel'],
    cta: 'Escríbenos por WhatsApp',
    cta2: 'Ver experiencias',
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
      'Soy Tony, español, y vivo en Osaka. Llevo ya más de 25 tours guiados.',
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
      { texto: 'Guía práctica desde España y Latinoamérica', ruta: '/es/viajar-a-japon-desde-espana-y-latinoamerica/' },
    ],
  },
  resenas: { titulo: 'Lo que dicen', opinar: '¿Hiciste un tour con nosotros? Deja tu opinión' },
  faq: {
    titulo: 'Preguntas',
    items: [
      { q: '¿Cómo se paga?', a: 'En efectivo, en yenes, el día del tour. Si prefieres pagar por adelantado, una vez confirmada la fecha por WhatsApp puedes hacerlo con PayPal o Wise, o con un enlace de pago con tarjeta que te mando.' },
      { q: '¿Necesito el JR Pass?', a: 'Si os movéis dentro de Kansai, normalmente no. Con una tarjeta ICOCA o Suica pagáis cada tren y autobús. Pregúntame antes de comprar nada.' },
      { q: '¿Y si llueve?', a: 'Por ciudad salimos igual: Kansai con lluvia es precioso y hay menos gente. En montaña decido yo por seguridad; si se cancela, cambiamos de fecha o te devuelvo lo pagado.' },
      { q: '¿Podemos ir con niños?', a: 'Claro. Adapto el ritmo y el recorrido a su edad.' },
      { q: '¿Me recoges también en Kioto o en Nara?', a: 'Sí. Quedamos en el vestíbulo de tu hotel, esté en Osaka, Kioto, Nara o Kobe.' },
      // Sin techos (Antonio: «nunca cerrar puertas»): el precio es por grupo y a un
      // grupo grande se le contesta; el «hasta 6» sigue en el JSON-LD y en llms.txt.
      { q: '¿Y si somos un grupo grande?', a: 'El precio publicado es por grupo, no por persona. Si sois un grupo grande, escríbenos: también acompañamos grupos más grandes y te decimos cómo lo organizamos.' },
      { q: '¿Hacéis tours de varios días?', a: 'Sí. Dime cuántos días tienes y qué quieres ver, y te paso un precio cerrado por todo.' },
      // Sustituye a «¿Hay guía en francés?»: el que llega de Latinoamérica entra por
      // Tokio y nadie le contestaba. Todo sale de /es/rutas/ (datosItinerarios.ts).
      { q: '¿Guiáis también en Tokio, el monte Fuji u otras zonas de Japón?', a: 'Sí. Además de Kansai hay días en Tokio, el monte Fuji desde Hakone, Nagano o Fukuoka; el billete del guía hasta allí va incluido en el presupuesto cerrado. En Tokio también guía Iheb, en francés, árabe e inglés (/fr/).', enlace: { texto: 'Rutas por todo Japón, hora a hora', href: '/es/rutas/' } },
      { q: '¿Organizáis viajes para familias o grupos?', a: 'Sí. Antonio, coordinador del equipo, gestiona en español viajes a medida por todo Japón: guías, itinerario, hoteles, ryokan y transporte privado. El presupuesto es a medida.', enlace: { texto: 'Viajes en familia y grupo', href: '/familias/' } },
      { q: '¿Y si alguien tiene movilidad reducida?', a: 'Dímelo al reservar. Adapto el recorrido, el ritmo y el transporte; algunos templos tienen muchas escaleras y te propongo alternativas.' },
      { q: '¿Y si cambian mis planes?', a: 'Escríbeme. Cancelar con más de 72 horas no cuesta nada; si tu vuelo se retrasa, buscamos otro día.' },
    ],
  },
  contacto: {
    titulo: 'Cuéntanos tu viaje',
    sub: 'Rellena lo que sepas y se abrirá WhatsApp con el mensaje listo. Esta web no guarda nada.',
    nombre: 'Tu nombre', pais: '¿De dónde venís?', ciudad: 'Ciudad', fechas: 'Fechas', personas: 'Personas',
    hotel: 'Hotel o zona donde os alojáis', intereses: 'Qué os apetece', notas: 'Algo más (niños, movilidad, comida…)',
    paises: ['España', 'México', 'Argentina', 'Colombia', 'Chile', 'Perú', 'Estados Unidos', 'Otro país'],
    // Las tres experiencias de la portada y lo que no es Kansai, en vez de cinco ciudades de Kansai.
    opcionesIntereses: ['Templos y tradición', 'Gastronomía', 'Naturaleza', 'Tokio / Fuji', 'Varios días', 'Otra zona de Japón'],
    wa: 'Enviar por WhatsApp', mail: 'Prefiero correo', vista: 'Tu mensaje',
    aviso: 'Te respondemos normalmente el mismo día.',
    asuntoMail: 'Tour privado en Japón',
    plantilla: (d) => `Hola Tony, te escribo desde la web.\n\n` + lineas([
      ['Nombre', d.nombre], ['Venimos de', [d.pais, d.ciudad].filter(Boolean).join(', ')], ['Fechas', d.fechas],
      ['Personas', d.personas], ['Alojamiento', d.hotel], ['Nos apetece', d.intereses.join(', ')], ['Más', d.notas],
    ]),
  },
  pie: {
    lema: 'Guías privados por todo Japón. Trato directo.',
    legal: 'Aviso legal', privacidad: 'Privacidad', condiciones: 'Condiciones', cookies: 'Cookies',
    creditos: 'Créditos de las fotos', otrosIdiomas: 'Otros idiomas',
  },
  // Solo lo que la web ya ofrece: páginas de ciudad, planes temáticos (té, kimono,
  // artesanos), comida halal/vegetariana y las rutas de montaña. Sin precio.
  experiencias: {
    titulo: 'Elige tu experiencia',
    sub: 'No son paquetes cerrados: el día lo montamos a tu medida.',
    lista: [
      { titulo: 'Templos, castillos y tradición', texto: 'Kioto, Nara y el castillo blanco de Himeji. Ceremonia del té, kimono o un taller artesano, y la historia de cada lugar.',
        foto: '/v8/zonas/kioto-kinkakuji', alt: 'El Pabellón Dorado de Kioto reflejado en su estanque, con cielo azul', ruta: '/es/kyoto/' },
      { titulo: 'Gastronomía y mercados', texto: 'Mercados como Kuromon y Nishiki, comida callejera en Dōtonbori y dónde comer bien, también halal o vegetariano.',
        foto: '/v8/zonas/osaka-kuromon', alt: 'Puestos del mercado de Kuromon, en Osaka', ruta: '/es/osaka/' },
      { titulo: 'Naturaleza y Japón rural', texto: 'Montañas cerca de Kioto y Nara, los cerezos de Yoshino, Kōyasan o el Kumano Kodo, a tu ritmo.',
        foto: '/v8/zonas/nara-yoshino', alt: 'El monte Yoshino cubierto de cerezos en flor', ruta: '/es/montana/' },
    ],
    otras: [
      { texto: '¿Viajas en familia o en grupo? Organizamos el viaje entero por todo Japón', ruta: '/familias/' },
      { texto: '¿Tokio, el monte Fuji o varios días? Mira las rutas', ruta: '/es/rutas/' },
    ],
    preguntar: '¿Dudas? Pregúntanos por WhatsApp',
  },
  precioRef: {
    titulo: 'Cuánto cuesta',
    texto: 'Medio día con guía privado, por grupo y no por persona. Para tu viaje te damos un precio cerrado por WhatsApp, sin letra pequeña.',
    enlace: 'Ver todos los precios', ruta: '/es/precios/',
    plegado: 'Qué incluye, pago y cancelación',
    otono: 'Otoño en Kioto: los arces siguen rojos hasta principios de diciembre.',
  },
  contactoWa: {
    sub: 'Escríbenos por WhatsApp y te respondemos normalmente el mismo día.',
    boton: 'Escríbenos por WhatsApp', formulario: '¿Prefieres un formulario?', correo: 'o por correo',
  },
  destinosTitulo: 'Destinos',
}

// ── English · Tony · United Kingdom ─────────────────────────────────────────

// Preguntas de /en/ tal como estaban antes del rediseño (21-11-2026): /larion/
// hereda de `en` y se queda con ellas; /en/ cambia tres (CAMBIOS_FAQ_EN).
const FAQ_EN_ANTES: Pregunta[] = [
  { q: 'How do I pay?', a: 'In cash, in yen, on the day. If you prefer to pay in advance, once we have confirmed your date on WhatsApp you can use PayPal or Wise from the buttons under Prices, or a card payment link I\'ll send you.' },
  { q: 'Do I need a JR Pass?', a: 'Not usually, if you\'re staying within Kansai. An ICOCA or Suica card covers almost every train and bus. Ask me before you buy anything.' },
  { q: 'What if it rains?', a: 'City days go ahead: Kansai is lovely in the rain and the crowds thin out. In the mountains I make the call for safety; if we cancel, we move the date or you get your money back.' },
  { q: 'Can we bring children?', a: 'Of course. I adapt the pace and the route to their age.' },
  { q: 'Can you pick us up in Kyoto or Nara too?', a: 'Yes. We meet in your hotel lobby, whether you\'re staying in Osaka, Kyoto, Nara or Kobe.' },
  { q: 'What if there are more than 6 of us?', a: 'Prices are for groups of up to 6. If you\'re more, message me and I\'ll tell you how we can organise it.' },
  { q: 'Do you do multi-day tours?', a: 'Yes. Tell me how many days you have and what you\'d like to see, and I\'ll send you one fixed price for everything.' },
  { q: 'Is there a guide for Tokyo, anime and Pokémon?', a: 'Yes. For Tokyo and the Kanto region, Nagano and Shizuoka there is Iheb, who guides in English, French and Arabic and is a pro in anime, Japanese pop culture and Pokémon cards.', enlace: { texto: 'Iheb\'s page', href: '/en/tokyo-anime-guide/' } },
  { q: 'Do you organise trips for families or groups of 6 to 10?', a: 'Yes. Antonio, the team\'s coordinator, arranges tailor-made trips all over Japan in Spanish: guides, itinerary, hotels, ryokan and private transport for groups of more than 8. Quotes are tailor-made.', enlace: { texto: 'Family and group trips (in Spanish)', href: '/familias/' } },
  { q: 'What if someone has limited mobility?', a: 'Tell me when you book. I adapt the route, the pace and the transport; some temples have a lot of steps and I suggest alternatives.' },
  { q: 'What if my plans change?', a: 'Message me. Cancelling more than 72 hours ahead costs nothing, and if your flight is delayed we find another day.' },
]
// Sin techos en /en/ (Antonio: «nunca cerrar puertas»): el «up to 6» sigue en el JSON-LD y en llms.txt.
const CAMBIOS_FAQ_EN: Record<string, Pregunta> = {
  // Los botones de PayPal y Wise iban en las tarjetas de precio de la portada, que ya no están.
  'How do I pay?': { q: 'How do I pay?', a: 'In cash, in yen, on the day. If you prefer to pay in advance, once we have confirmed your date on WhatsApp you can use PayPal or Wise, or a card payment link I\'ll send you.' },
  'What if there are more than 6 of us?': { q: 'What if we\'re a large group?', a: 'The listed price is per group, not per person. If you\'re a large group, message us: we guide larger groups too and we\'ll tell you how we can organise it.' },
  'Do you organise trips for families or groups of 6 to 10?': { q: 'Do you organise trips for families or groups?', a: 'Yes. Antonio, the team\'s coordinator, arranges tailor-made trips all over Japan in Spanish: guides, itinerary, hotels, ryokan and private transport. Quotes are tailor-made.', enlace: { texto: 'Family and group trips (in Spanish)', href: '/familias/' } },
}

const en: Pagina = {
  id: 'en', lang: 'en', viaje: ['You fly in from London.', 'You land in Kansai.', 'I meet you in your hotel lobby.', 'And we spend the day wherever you like.'], dir: 'ltr', ruta: '/en/', guia: 'tony',
  seo: {
    titulo: 'Private guide in Kyoto, Osaka & Nara | Tony Kansai Guide',
    descripcion: 'Tony is a private guide in Kansai. He meets you at your hotel for a day in Kyoto, Osaka, Nara or Kobe, with one fixed price per group.',
  },
  // 21-11-2026: voz de empresa, todo Japón y el castillo blanco de Himeji con cielo azul.
  nav: { como: 'How it works', zona: 'Where we go', precios: 'Prices', contacto: 'Message us', idioma: 'Language' },
  hero: {
    foto: F + 'portada.jpg',
    fotoAlt: 'The white castle of Himeji among cherry blossoms, under a blue sky',
    titulo: 'Private guides across Japan.',
    sub: 'We meet you at your hotel and spend the day wherever you like: Kyoto, Tokyo, Mount Fuji or the corner of Japan you have always pictured. Just your party, one fixed price.',
    chips: ['Just your party', 'Hotel pick-up'],
    cta: 'Message us on WhatsApp',
    cta2: 'See experiences',
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
      'I\'m Tony. I\'m Spanish and I live in Osaka. I have guided more than 25 tours so far.',
      'I show you Kansai at your own pace: Kyoto, Osaka, Nara, Kobe and Himeji. If your trip goes further, I can come along to the rest of Japan too.',
    ],
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
      { texto: 'Practical guide for travellers from the UK and the US', ruta: '/en/travel-to-japan-from-uk-and-usa/' },
    ],
  },
  resenas: { titulo: 'What guests say', nota: 'Real reviews, translated from Spanish. Tap “See original” to read them as written.', opinar: 'Toured with us? Leave a review' },
  faq: {
    titulo: 'Questions',
    items: FAQ_EN_ANTES.map((f) => CAMBIOS_FAQ_EN[f.q] ?? f),
  },
  contacto: {
    titulo: 'Tell us about your trip',
    sub: 'Fill in what you know and WhatsApp opens with the message ready. Nothing is stored on this site.',
    nombre: 'Your name', pais: 'Where are you travelling from?', ciudad: 'City', fechas: 'Dates', personas: 'People',
    hotel: 'Hotel or area you\'re staying in', intereses: 'What you\'d like', notas: 'Anything else (children, mobility, food…)',
    paises: ['United Kingdom', 'Ireland', 'United States', 'Canada', 'Australia', 'Other country'],
    opcionesIntereses: ['Temples and tradition', 'Food', 'Nature', 'Tokyo / Fuji', 'Several days', 'Elsewhere in Japan'],
    wa: 'Send on WhatsApp', mail: 'I\'d rather email', vista: 'Your message',
    aviso: 'We usually reply the same day.',
    asuntoMail: 'Private tour in Japan',
    plantilla: (d) => `Hi Tony, I'm writing from your website.\n\n` + lineas([
      ['Name', d.nombre], ['Travelling from', [d.ciudad, d.pais].filter(Boolean).join(', ')], ['Dates', d.fechas],
      ['People', d.personas], ['Staying at', d.hotel], ['Interested in', d.intereses.join(', ')], ['Also', d.notas],
    ]),
  },
  pie: {
    lema: 'Private guides across Japan. Direct contact.',
    legal: 'Legal notice', privacidad: 'Privacy', condiciones: 'Terms', cookies: 'Cookies',
    creditos: 'Photo credits', otrosIdiomas: 'Other languages',
  },
  // La portada de /en/ ya es el castillo de Himeji: la primera tarjeta lleva Kiyomizu.
  // El anime (Iheb, en inglés) va como «otra puerta», no como experiencia.
  experiencias: {
    titulo: 'Choose your experience',
    sub: 'These aren\'t fixed packages: we shape the day around you.',
    lista: [
      { titulo: 'Temples, castles and tradition', texto: 'Kyoto, Nara and the white castle of Himeji. Tea ceremony, kimono or a craft workshop, and the story behind each place.',
        foto: '/v8/zonas/kioto-kiyomizu', alt: 'Kiyomizu-dera temple among autumn leaves in Kyoto', ruta: '/en/kyoto/' },
      { titulo: 'Food and markets', texto: 'Markets like Kuromon and Nishiki, street food in Dōtonbori and where to eat well, including halal or vegetarian.',
        foto: '/v8/zonas/osaka-kuromon', alt: 'Stalls at Kuromon Market in Osaka', ruta: '/en/osaka/' },
      { titulo: 'Nature and rural Japan', texto: 'Mountains near Kyoto and Nara, the cherry trees of Yoshino, Kōyasan or the Kumano Kodo, at your own pace.',
        foto: '/v8/zonas/nara-yoshino', alt: 'Mount Yoshino covered in cherry blossom', ruta: '/en/hiking/' },
    ],
    otras: [
      { texto: 'Tokyo, anime and pop culture', ruta: '/en/tokyo-anime-guide/' },
      { texto: 'Tokyo, Mount Fuji or several days: see the routes', ruta: '/en/routes/' },
    ],
    preguntar: 'Questions? Ask us on WhatsApp',
  },
  precioRef: {
    titulo: 'What it costs',
    texto: 'Half day with a private guide, per group, not per person. For your trip you get one fixed price on WhatsApp, no small print.',
    enlace: 'See all prices', ruta: '/en/prices/',
    plegado: 'What\'s included, payment and cancellation',
    otono: 'Autumn in Kyoto: the maples stay red until early December.',
  },
  contactoWa: {
    sub: 'Message us on WhatsApp and we usually reply the same day.',
    boton: 'Message us on WhatsApp', formulario: 'Prefer a form?', correo: 'or by email',
  },
  destinosTitulo: 'Destinations',
}

// ── العربية · Tony · الخليج ─────────────────────────────────────────────────

const ar: Pagina = {
  id: 'ar', lang: 'ar', viaje: ['تنطلق من دبي أو الرياض.', 'تهبط في كانساي.', 'ألتقيك في بهو فندقك.', 'ونقضي اليوم حيثما تحب.'], dir: 'rtl', ruta: '/ar/', guia: 'tony',
  seo: {
    titulo: 'مرشد بالعربية في كيوتو وأوساكا ونارا | Tony Kansai Guide',
    descripcion: 'طوني مرشد خاص بالعربية في كانساي. يلتقيك في فندقك ليوم في كيوتو أو أوساكا أو نارا. بلا وكالة، بسعر ثابت للمجموعة، مع مطاعم حلال وأوقات الصلاة.',
  },
  // 21-11-2026: voz de empresa, todo Japón y el Fuji de día (antes, Kobe de noche).
  // El h1 lleva «مرشد خاص» y «بالعربية», lo que se busca.
  nav: { como: 'كيف نعمل', zona: 'إلى أين نذهب', precios: 'الأسعار', contacto: 'راسلنا', idioma: 'اللغة' },
  hero: {
    foto: F + 'portada.jpg',
    fotoAlt: 'قلعة هيميجي البيضاء بين أزهار الكرز تحت سماء زرقاء',
    titulo: 'مرشد خاص بالعربية في كل أنحاء اليابان.',
    sub: 'نلتقيكم في فندقكم ونقضي اليوم حيثما تحبون: كيوتو أو طوكيو أو جبل فوجي. لعائلتكم وحدها، بسعر ثابت، مع طعام حلال وأوقات الصلاة.',
    chips: ['لعائلتك وحدها', 'نلتقي في فندقك'],
    cta: 'راسلنا عبر واتساب',
    cta2: 'اكتشف التجارب',
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
      'أنا طوني، إسباني مسلم وأعيش في أوساكا. رافقت حتى الآن أكثر من ٢٥ جولة.',
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
      { q: 'كيف أدفع؟', a: 'نقداً بالين في يوم الجولة. وإن فضّلت الدفع مسبقاً، فبعد تأكيد الموعد عبر واتساب يمكنك الدفع عبر PayPal أو Wise، أو برابط دفع بالبطاقة أرسله لك.' },
      { q: 'هل يوجد طعام حلال؟', a: 'نعم. أنا مسلم وأعرف الأماكن الحلال الموثوقة في أوساكا وكيوتو. أخبرني عند الحجز لا في يوم الجولة.' },
      { q: 'أين نصلي أثناء الجولة؟', a: 'في كانساي مسجد أوساكا ومسجد كوبي وجمعية كيوتو الإسلامية، وفي مطار كانساي مصليات في المبنيين. أضع وقفات الصلاة في المسار من البداية.' },
      { q: 'هل أحتاج تذكرة JR Pass؟', a: 'في الغالب لا إذا كانت إقامتك في كانساي. بطاقة ICOCA أو Suica تكفي لمعظم القطارات والحافلات. اسألني قبل أن تشتري.' },
      { q: 'هل تستقبلنا في كيوتو أو نارا أيضاً؟', a: 'نعم. نلتقي في بهو فندقكم، سواء كان في أوساكا أو كيوتو أو نارا أو كوبي.' },
      { q: 'هل الجولة مناسبة للعائلات مع الأطفال وكبار السن؟', a: 'نعم. الجولة خاصة بعائلتكم وحدها، بلا أي شخص من خارجها، وبالإيقاع الذي يناسبكم. أخبرني عند الحجز بأعمار الأطفال وكبار السن، فأختار مساراً أقل مشياً ودرجاً وأضع وقفات للراحة والصلاة.' },
      // Sin techos (Antonio): el «حتى ستة» sigue en el JSON-LD y en llms.txt.
      { q: 'وماذا لو كنا مجموعة كبيرة؟', a: 'السعر للمجموعة كلها لا للشخص، ونرافق المجموعات الأكبر أيضاً. أخبرنا بعددكم ونرسل لكم السعر.' },
      { q: 'هل يمكن زيارة كيوتو في يوم واحد من أوساكا؟', a: 'نعم. كيوتو على بُعد أقل من ساعة بالقطار من أوساكا. ألتقيكم في الفندق صباحاً ونبدأ باكراً بفوشيمي إيناري قبل الزحام، وأضع الغداء الحلال ووقت الصلاة في المسار من البداية.' },
      { q: 'هل يمكن أن نزور مسجد كوبي؟', a: 'نعم، إن أحببتم. مسجد كوبي أقدم مسجد في اليابان، ونجعله جزءاً من يوم في كوبي مع الميناء وحي كيتانو، ونصلي فيه إن وافق وقت الصلاة.' },
      { q: 'هل ترافقنا إلى نارا؟', a: 'نعم. نارا على بُعد أقل من ساعة من أوساكا وكيوتو، ويكفيها نصف يوم: تمثال بوذا الكبير في توداي-جي والغزلان في الحديقة.' },
      { q: 'كم السعر بالريال أو الدرهم؟', a: 'الأسعار بالين وللمجموعة كلها لا للشخص. بجانب كل سعر تجد قيمته التقريبية بالريال والدرهم بسعر الصرف اليوم، وهي للتوضيح فقط، أما الدفع فيكون بالين.' },
      { q: 'هل تنظّم جولات لعدة أيام؟', a: 'نعم. أخبرني بعدد الأيام وما تحبون رؤيته، وأرسل لك سعراً ثابتاً للكل.' },
      { q: 'هل يوجد مرشد عربي في طوكيو؟', a: 'نعم. في طوكيو ومنطقة كانتو وناغانو وشيزوكا يرشد إيهاب، وهو تونسي مسلم، بالعربية والفرنسية والإنجليزية، مع طعام حلال وأوقات الصلاة وبلا معابد.', enlace: { texto: 'صفحة إيهاب', href: '/ar/tokyo/' } },
      { q: 'هل تنظمون رحلات للعائلات أو المجموعات؟', a: 'نعم. ينظم أنطونيو، منسق الفريق، رحلات حسب الطلب في كل أنحاء اليابان بالإسبانية: مرشدون وبرنامج وفنادق وريوكان ونقل خاص. السعر حسب الطلب.', enlace: { texto: 'رحلات العائلات والمجموعات (بالإسبانية)', href: '/familias/' } },
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
    opcionesIntereses: ['القلاع والتقاليد', 'طعام حلال', 'الطبيعة', 'طوكيو / فوجي', 'عدة أيام', 'مكان آخر في اليابان'],
    wa: 'أرسل عبر واتساب', mail: 'أفضّل البريد الإلكتروني', vista: 'رسالتك',
    aviso: 'نردّ عليك عادةً في اليوم نفسه.',
    asuntoMail: 'جولة خاصة في اليابان',
    plantilla: (d) => `السلام عليكم يا طوني، أراسلك من الموقع.\n\n` + lineas([
      ['الاسم', d.nombre], ['قادمون من', [d.ciudad, d.pais].filter(Boolean).join('، ')], ['التواريخ', d.fechas],
      ['عدد الأشخاص', d.personas], ['الإقامة', d.hotel], ['نهتم بـ', d.intereses.join('، ')], ['ملاحظات', d.notas],
    ]),
  },
  pie: {
    lema: 'مرشدون خاصون في كل اليابان. تعامل مباشر.',
    legal: 'إشعار قانوني', privacidad: 'الخصوصية', condiciones: 'الشروط', cookies: 'ملفات تعريف الارتباط',
    creditos: 'مصادر الصور', otrosIdiomas: 'لغات أخرى',
  },
  // Sin «templos» en la primera tarjeta (el público musulmán los evita, igual que
  // /ar/tokyo/), y la gastronomía es halal y lleva a su página.
  experiencias: {
    titulo: 'اختر تجربتك',
    sub: 'ليست باقات جاهزة؛ نرتّب اليوم على مقاسك.',
    lista: [
      { titulo: 'القلاع والتقاليد اليابانية', texto: 'قلعة هيميجي البيضاء، وأزقة غيون في كيوتو، والكيمونو مع الحجاب.',
        foto: '/v8/zonas/kioto-kinkakuji', alt: 'الجناح الذهبي في كيوتو ينعكس على بركته تحت سماء زرقاء', ruta: '/ar/kyoto/' },
      { titulo: 'طعام حلال وأسواق', texto: 'مطاعم حلال موثوقة في أوساكا وكيوتو، وسوق كورومون، ووقفات للصلاة في المسار.',
        foto: '/v8/zonas/osaka-kuromon', alt: 'أكشاك سوق كورومون في أوساكا', ruta: '/ar/halal-kyoto-osaka/' },
      { titulo: 'الطبيعة والجبال', texto: 'جبال قريبة من كيوتو ونارا، وأزهار الكرز في يوشينو، وكوياسان، على راحتكم.',
        foto: '/v8/zonas/nara-yoshino', alt: 'جبل يوشينو تكسوه أزهار الكرز', ruta: '/ar/hiking/' },
    ],
    otras: [
      { texto: 'طوكيو بالعربية', ruta: '/ar/tokyo/' },
      { texto: 'المساجد وأماكن الصلاة في كانساي', ruta: '/ar/mosques-kansai/' },
    ],
    preguntar: 'عندك سؤال؟ اسألنا عبر واتساب',
  },
  precioRef: {
    titulo: 'كم التكلفة',
    texto: 'نصف يوم مع مرشد خاص، للمجموعة لا للشخص. ولرحلتك نرسل لك سعراً ثابتاً عبر واتساب، بلا شروط مخفية.',
    enlace: 'كل الأسعار', ruta: '/ar/prices/',
    plegado: 'ما يشمله السعر والدفع والإلغاء',
    otono: 'الخريف في كيوتو: تبقى أشجار القيقب حمراء حتى أوائل ديسمبر.',
  },
  contactoWa: {
    sub: 'راسلنا عبر واتساب ونردّ عليك عادةً في اليوم نفسه.',
    boton: 'راسلنا عبر واتساب', formulario: 'تفضّل استمارة؟', correo: 'أو بالبريد الإلكتروني',
  },
  destinosTitulo: 'الوجهات',
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
    // Слова, которые реально ищут в Яндексе: «русский гид в Киото», «индивидуальная экскурсия».
    titulo: 'Русский гид в Киото, Осаке и Хиросиме — Ларион | Tony Kansai Guide',
    descripcion: 'Индивидуальные экскурсии на русском: Киото, Осака, Нара, Хиросима и Миядзима; Южная Корея (Сеул, Пусан) — по запросу. Частный гид Ларион встречает вас в отеле. Цена за всю группу.',
  },
  nav: { como: 'Как это работает', zona: 'Куда едем', precios: 'Цены', contacto: 'Написать', idioma: 'Язык' },
  hero: {
    foto: F + 'miyajima.jpg',
    titulo: 'Частный гид в Японии — на русском.',
    sub: 'Меня зовут Ларион. Встречаю вас в лобби отеля, и мы едем туда, куда хотите вы: Киото, Осака, Нара, Хиросима, Миядзима. Южная Корея: Сеул, Пусан — по запросу. Без агентства и без групп — договариваетесь напрямую со мной.',
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
  // Devueltas el 15-10-2026 a petición de Tony (se habían quitado el 14-10 por SEO).
  resenas: { titulo: 'Что говорят гости', nota: 'Отзывы, которые гости присылали Лариону в WhatsApp, собраны здесь.', opinar: 'Были на экскурсии с Ларионом? Оставьте отзыв', fuente: '/reviews-larion.json' },
  faq: {
    titulo: 'Вопросы',
    items: [
      { q: 'Как оплатить?', a: 'Обычно — наличными в иенах в день экскурсии. Российские карты (Visa, Mastercard, «Мир») в Японии не работают, поэтому возьмите наличные с собой. Если хотите заплатить переводом — например, через Wise или картой нероссийского банка, — договоримся об этом при бронировании. Если бронируете больше чем за месяц, могу попросить задаток.' },
      { q: 'Сколько это в рублях?', a: 'Цены на сайте указаны в иенах и за всю группу, а не с человека. Рядом с ценой показана примерная сумма в рублях по сегодняшнему курсу — это только ориентир: курс меняется каждый день, а платите вы в иенах.' },
      { q: 'Сколько ехать из Осаки в Хиросиму?', a: 'Около полутора часов на синкансэне: самые быстрые поезда идут от станции Син-Осака примерно 1 час 25 минут. Хиросиму и Миядзиму можно посмотреть за один день.' },
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
    sub: 'Заполните то, что знаете: мы скопируем готовое сообщение, откроется Telegram — просто вставьте его. Сайт ничего не сохраняет.',
    nombre: 'Ваше имя', pais: 'Откуда вы приезжаете?', ciudad: 'Город', fechas: 'Даты', personas: 'Сколько человек',
    hotel: 'Отель или район, где вы остановились', intereses: 'Что вам интересно', notas: 'Что-то ещё (дети, здоровье, еда…)',
    paises: ['Россия', 'Казахстан', 'Беларусь', 'Узбекистан', 'Армения', 'Грузия', 'Другая страна'],
    opcionesIntereses: ['Киото', 'Осака', 'Нара', 'Хиросима', 'Миядзима', 'Химэдзи', 'Горы и природа', 'Еда'],
    wa: 'Написать в Telegram', mail: 'Лучше по почте', vista: 'Ваше сообщение',
    aviso: 'Ответит сам Ларион, обычно в тот же день.',
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

// Hereda de `en`, pero /larion/ se queda como estaba antes del rediseño de la
// portada de Tony (21-11-2026): por eso fija aquí su nav, héroe, preguntas,
// título del contacto y lema, que en `en` han pasado a la voz de empresa.
const larion: Pagina = {
  ...en,
  nav: { ...en.nav, contacto: 'Message me' },
  como: { ...en.como, pasos: en.como.pasos.map((x) => ({ ...x, d: x.d.replace(' If you prefer to pay in advance, I send you a card payment link.', '') })) },
  faq: { ...en.faq, items: FAQ_EN_ANTES.filter((f) => f.q !== 'How do I pay?') },
  pie: { ...en.pie, lema: 'Private guide in Japan. Booked directly, no agency.' },
  id: 'larion', ruta: '/larion/', guia: 'larion',
  viaje: ['Wherever you fly in from…', 'You land in Kansai.', 'I meet you in your hotel lobby.', 'And we head west, as far as Hiroshima.'],
  seo: {
    titulo: 'Larion, private guide in Kansai | Tony Kansai Guide',
    descripcion: 'Larion, private guide in Russian and English. He meets you at your hotel for Kyoto, Osaka, Nara, Hiroshima or Miyajima; South Korea (Seoul, Busan) on request. One fixed price per group.',
  },
  hero: {
    foto: F + 'miyajima.jpg',
    titulo: 'A private guide in Kansai and Hiroshima.',
    sub: 'I\'m Larion. I meet you in your hotel lobby and we go wherever you\'d like: Kyoto, Osaka, Nara, Hiroshima, Miyajima. South Korea: Seoul and Busan on request. No agency, no group: you deal with me directly.',
    chips: ['Just your party', 'One price per group', 'Hotel pick-up'], cta: 'Book a tour', cta2: 'Plan your day',
  },
  guiaTxt: {
    titulo: 'Your guide',
    idiomas: 'Russian · English',
    bio: [
      'I\'m Larion.',
      'I show you Kansai (Kyoto, Osaka, Nara, Himeji) and the west: Hiroshima and Miyajima.',
      'Mountains, temples and long walking days are my favourite ground.',
    ],
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
    titulo: 'Plan your day',
    sub: 'Fill in what you know: we copy the message for you and Telegram opens, just paste it. Nothing is stored on this site.',
    wa: 'Message on Telegram',
    paises: ['United Kingdom', 'United States', 'Germany', 'Kazakhstan', 'Other country'],
    opcionesIntereses: ['Kyoto', 'Osaka', 'Nara', 'Hiroshima', 'Miyajima', 'Himeji', 'Mountains & nature', 'Food'],
    aviso: "Larion answers here himself, usually the same day.",
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

/** `wa` solo existe para quien atiende por WhatsApp; Larion va por Telegram (`tg`).
 *  Para enlazar a cualquier guía, usar enlaceGuia() y no montar wa.me a mano. */
export const GUIAS: Record<GuiaId, { nombre: string; foto: string; wa?: string; tg?: string }> = {
  tony: { nombre: 'Tony Hanma', foto: '/guides/tony-retrato.webp', wa: WA_TONY },
  larion: { nombre: 'Larion', foto: '/guides/guide-larion.webp', tg: TG_LARION },
}

/** Enlace para escribir al guía: Telegram (sin texto, t.me no lo admite) o WhatsApp con texto. */
export function enlaceGuia(guia: GuiaId, texto?: string): string {
  const g = GUIAS[guia]
  if (g.tg) return `https://t.me/${g.tg}`
  return `https://wa.me/${g.wa}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`
}

/** ¿Este guía atiende por Telegram? (para icono, color y nota del botón). */
export const esTelegram = (guia: GuiaId): boolean => !!GUIAS[guia].tg

/** Campos de contacto para el JSON-LD de un guía (teléfono solo si es WhatsApp). */
export function contactoLd(guia: GuiaId): Record<string, unknown> {
  const g = GUIAS[guia]
  return g.tg
    ? { contactPoint: { '@type': 'ContactPoint', contactType: 'reservations', url: `https://t.me/${g.tg}`, availableLanguage: ['ru', 'en'] } }
    : { telephone: `+${g.wa}` }
}

/** Nombre del guía tal como se escribe en cada idioma. */
export const NOMBRE_GUIA: Record<PaginaId, string> = {
  es: 'Tony Hanma', en: 'Tony Hanma', ar: 'طوني هانما', ru: 'Ларион', larion: 'Larion',
}
