// Páginas por país de origen (Viajeros.tsx): lo práctico del viaje y el tour con
// precio en su moneda al cambio del día. Una entrada por mercado.
//
// Regla de contenido: nada que no sea verdad. Lo que cambia con el tiempo
// (visado, vuelos) va dicho en general y con la fuente oficial para comprobarlo.

export type MercadoId = 'mx' | 'uk' | 'es'

export interface Mercado {
  lang: 'es' | 'en'; ruta: string; inicio: string; locale: string; divisas: string[]
  seo: { titulo: string; descripcion: string }
  bandera: string; antetitulo: string; titulo: string; sub: string; cta: string
  practicoTitulo: string; practico: { icono: string; t: string; d: string }[]
  preciosTitulo: string; planes: [string, string]; porGrupo: string; porPersona: (y: string) => string
  notas: string[]; aprox: string
  ideasTitulo: string; ideas: { t: string; d: string; a: string }[]
  final: { titulo: string; texto: string; boton: string; principal: string }
  saludo: string; escribe: string; foto: string; fotoAlt: string; touristType: string
}

export const MERCADOS: Record<MercadoId, Mercado> = {
  mx: {
    lang: 'es', ruta: '/es/desde-mexico/', inicio: '/es/', locale: 'es-MX', divisas: ['MXN', 'USD'],
    seo: {
      titulo: 'Viajar a Japón desde México con guía privado en español | Tony Kansai Guide',
      descripcion: 'Guía privado en español en Kioto, Osaka y Nara para viajeros de México: diferencia horaria, visado, cómo llegar a Kansai, dinero y precios en pesos al cambio de hoy.',
    },
    bandera: '🇲🇽', antetitulo: 'Para viajeros de México',
    titulo: 'Japón desde México, con guía en español.',
    sub: 'Soy Tony. Te recojo en el hotel y pasamos el día en Kioto, Osaka o Nara, solo con tu grupo. Sin agencia: hablas directamente conmigo, por WhatsApp, en tu idioma.',
    cta: 'Cuéntame tu viaje',
    practicoTitulo: 'Lo práctico, antes de volar',
    practico: [
      { icono: '🕐', t: 'Horario', d: 'Japón va 15 horas por delante de Ciudad de México y 14 por delante de Cancún. Escríbeme cuando quieras: te contesto en cuanto amanezca aquí.' },
      { icono: '🛂', t: 'Visado', d: 'Para turismo de corta estancia, los mexicanos no necesitan visado para entrar en Japón. Antes de viajar, confírmalo en la web de la Embajada de Japón en México.' },
      { icono: '✈️', t: 'Cómo llegar a Kansai', d: 'Hay vuelos directos de Ciudad de México a Tokio. Desde Tokio, el shinkansen llega a Kioto en unas dos horas y cuarto; también hay vuelos con escala al aeropuerto de Kansai.' },
      { icono: '💴', t: 'Dinero', d: 'En Japón el efectivo sigue siendo útil. Los cajeros de 7-Eleven aceptan tarjetas extranjeras. Y no se dejan propinas: en ningún sitio, tampoco conmigo.' },
      { icono: '🔌', t: 'Enchufes', d: 'Son de tipo A, como en México, a 100 voltios. Los cargadores de móvil y portátil funcionan sin adaptador.' },
      { icono: '💳', t: 'Pagar el tour', d: 'En efectivo, en yenes, el día del tour. O por adelantado desde México con PayPal y tu tarjeta, cuando ya tengamos la fecha.' },
    ],
    preciosTitulo: 'Precio por grupo, en pesos al cambio de hoy',
    planes: ['Medio día · 4 horas', 'Día completo · 8 horas'], porGrupo: 'por grupo, hasta 6 personas',
    porPersona: (y) => `Siendo 4: ${y} por persona`,
    notas: ['Trenes, entradas y comidas no están incluidos: los pagáis en el momento y yo os digo cómo.', 'Cancelación sin coste hasta 72 horas antes.'],
    aprox: 'al cambio de hoy',
    ideasTitulo: 'Ideas para tu día',
    ideas: [
      { t: 'Kioto en un día', d: 'Fushimi Inari antes de la gente, Kiyomizu, Gion y el Pabellón Dorado.', a: '/es/kyoto/' },
      { t: 'Osaka comiendo', d: 'El castillo, el mercado de Kuromon y los neones de Dōtonbori.', a: '/es/osaka/' },
      { t: 'Nara y sus ciervos', d: 'El Gran Buda de Tōdai-ji y el parque, a 45 minutos de Osaka.', a: '/es/nara/' },
      { t: 'Otoño en Kioto', d: 'Los arces rojos de noviembre, saliendo temprano.', a: '/es/otono-kioto/' },
    ],
    final: { titulo: '¿Cuándo venís?', texto: 'Dime fechas, cuántos sois y dónde os alojáis. Te contesto yo, Tony, normalmente el mismo día.', boton: 'Escríbeme por WhatsApp', principal: 'Ver la página principal' },
    saludo: 'Hola Tony, venimos de México y nos interesa un tour. Fechas: ', escribe: 'Escríbeme',
    foto: '/v7/fotos/kioto.jpg', fotoAlt: 'Fushimi Inari, Kioto', touristType: 'Viajeros de México',
  },
  uk: {
    lang: 'en', ruta: '/en/from-uk/', inicio: '/en/', locale: 'en-GB', divisas: ['GBP', 'EUR'],
    seo: {
      titulo: 'Japan from the UK: Private Guide in Kyoto, Osaka & Nara | Tony Kansai Guide',
      descripcion: 'A private guide in Kyoto, Osaka and Nara for travellers from the UK: time difference, entry, getting to Kansai, money, plugs and prices in pounds at today\'s rate.',
    },
    bandera: '🇬🇧', antetitulo: 'For travellers from the UK',
    titulo: 'Japan from the UK, with your own guide.',
    sub: 'I\'m Tony. I meet you at your hotel and we spend the day in Kyoto, Osaka or Nara, just your group. No agency: you deal with me directly, on WhatsApp.',
    cta: 'Tell me about your trip',
    practicoTitulo: 'The practical bits, before you fly',
    practico: [
      { icono: '🕐', t: 'Time difference', d: 'Japan is 9 hours ahead of London in winter and 8 in summer. Message me whenever suits you: I reply as soon as it\'s morning here.' },
      { icono: '🛂', t: 'Entry', d: 'British citizens don\'t need a visa for short tourist stays in Japan. Check the latest on GOV.UK\'s Japan travel advice before you go.' },
      { icono: '✈️', t: 'Getting to Kansai', d: 'There are direct flights from London to Tokyo. From Tokyo the shinkansen reaches Kyoto in about two and a quarter hours; there are also flights with one stop to Kansai Airport.' },
      { icono: '💴', t: 'Money', d: 'Cash is still handy in Japan. 7-Eleven cash machines take foreign cards. And there\'s no tipping anywhere, including with me.' },
      { icono: '🔌', t: 'Plugs', d: 'Japan uses two flat pins (type A) at 100 volts, so bring a UK-to-Japan adapter. Phone and laptop chargers work fine with it.' },
      { icono: '💳', t: 'Paying for the tour', d: 'In cash, in yen, on the day. Or in advance from the UK with PayPal and your card, once your date is confirmed.' },
    ],
    preciosTitulo: 'Price per group, in pounds at today\'s rate',
    planes: ['Half day · 4 hours', 'Full day · 8 hours'], porGrupo: 'per group, up to 6 people',
    porPersona: (y) => `For 4 people: ${y} each`,
    notas: ['Trains, admissions and meals aren\'t included: you pay as we go and I show you how.', 'Free cancellation up to 72 hours before.'],
    aprox: 'at today\'s rate',
    ideasTitulo: 'Ideas for your day',
    ideas: [
      { t: 'Kyoto in a day', d: 'Fushimi Inari before the crowds, Kiyomizu, Gion and the Golden Pavilion.', a: '/en/kyoto/' },
      { t: 'Osaka, eating', d: 'The castle, Kuromon market and the neon of Dōtonbori.', a: '/en/osaka/' },
      { t: 'Nara and its deer', d: 'The Great Buddha of Tōdai-ji and the park, 45 minutes from Osaka.', a: '/en/nara/' },
      { t: 'Kyoto in autumn', d: 'The red maples of November, starting early.', a: '/en/kyoto-autumn/' },
    ],
    final: { titulo: 'When are you coming?', texto: 'Tell me your dates, how many you are and where you\'re staying. I reply myself, usually the same day.', boton: 'Message me on WhatsApp', principal: 'See the main page' },
    saludo: 'Hi Tony, we\'re coming from the UK and we\'d like a tour. Dates: ', escribe: 'Message me',
    foto: '/v7/fotos/nara.jpg', fotoAlt: 'Deer in Nara Park under autumn leaves', touristType: 'Travellers from the UK',
  },
  es: {
    lang: 'es', ruta: '/es/desde-espana/', inicio: '/es/', locale: 'es-ES', divisas: ['EUR'],
    seo: {
      titulo: 'Viajar a Japón desde España con guía privado en español | Tony Kansai Guide',
      descripcion: 'Guía privado español en Kioto, Osaka y Nara: diferencia horaria con la Península y Canarias, visado, vuelos, enchufes, dinero y precios en euros al cambio de hoy.',
    },
    bandera: '🇪🇸', antetitulo: 'Para viajeros de España',
    titulo: 'Japón desde España, con un guía español.',
    sub: 'Soy Tony, español, y vivo en Osaka. Te recojo en el hotel y pasamos el día en Kioto, Osaka o Nara, solo con tu grupo. Sin agencia: hablas directamente conmigo, por WhatsApp.',
    cta: 'Cuéntame tu viaje',
    practicoTitulo: 'Lo práctico, antes de volar',
    practico: [
      { icono: '🕐', t: 'Horario', d: 'Japón va 8 horas por delante de la Península en invierno y 7 en verano; de Canarias, una hora más. Escríbeme cuando quieras: te contesto en cuanto amanezca aquí.' },
      { icono: '🛂', t: 'Visado', d: 'Para turismo de corta estancia, los españoles no necesitan visado para entrar en Japón. Antes de viajar, revisa las recomendaciones de viaje del Ministerio de Asuntos Exteriores.' },
      { icono: '✈️', t: 'Cómo llegar a Kansai', d: 'Hay vuelos directos de Madrid a Tokio. Desde Tokio, el shinkansen llega a Kioto en unas dos horas y cuarto; también hay vuelos con una escala al aeropuerto de Kansai.' },
      { icono: '💴', t: 'Dinero', d: 'En Japón el efectivo sigue siendo útil. Los cajeros de 7-Eleven aceptan tarjetas extranjeras. Y no se dejan propinas: en ningún sitio, tampoco conmigo.' },
      { icono: '🔌', t: 'Enchufes', d: 'Son de dos clavijas planas (tipo A) a 100 voltios: trae un adaptador. Los cargadores de móvil y portátil funcionan con él; los secadores y planchas de pelo españoles, no.' },
      { icono: '💳', t: 'Pagar el tour', d: 'En efectivo, en yenes, el día del tour. O por adelantado en euros, por transferencia a una cuenta española, por PayPal o por Wise, cuando ya tengamos la fecha.' },
    ],
    preciosTitulo: 'Precio por grupo, en euros al cambio de hoy',
    planes: ['Medio día · 4 horas', 'Día completo · 8 horas'], porGrupo: 'por grupo, hasta 6 personas',
    porPersona: (y) => `Siendo 4: ${y} por persona`,
    notas: ['Trenes, entradas y comidas no están incluidos: los pagáis en el momento y yo os digo cómo.', 'Cancelación sin coste hasta 72 horas antes.'],
    aprox: 'al cambio de hoy',
    ideasTitulo: 'Ideas para tu día',
    ideas: [
      { t: 'Kioto en un día', d: 'Fushimi Inari antes de la gente, Kiyomizu, Gion y el Pabellón Dorado.', a: '/es/kyoto/' },
      { t: 'Osaka comiendo', d: 'El castillo, el mercado de Kuromon y los neones de Dōtonbori.', a: '/es/osaka/' },
      { t: 'Nara y sus ciervos', d: 'El Gran Buda de Tōdai-ji y el parque, a 45 minutos de Osaka.', a: '/es/nara/' },
      { t: 'Otoño en Kioto', d: 'Los arces rojos de noviembre, saliendo temprano.', a: '/es/otono-kioto/' },
    ],
    final: { titulo: '¿Cuándo venís?', texto: 'Dime fechas, cuántos sois y dónde os alojáis. Te contesto yo, Tony, normalmente el mismo día.', boton: 'Escríbeme por WhatsApp', principal: 'Ver la página principal' },
    saludo: 'Hola Tony, venimos de España y nos interesa un tour. Fechas: ', escribe: 'Escríbeme',
    foto: '/v8/zonas/kioto-kiyomizu.jpg', fotoAlt: 'Kiyomizu-dera en otoño, Kioto', touristType: 'Viajeros de España',
  },
}

export const RUTAS_VIAJEROS: Record<string, MercadoId> = Object.fromEntries(
  Object.entries(MERCADOS).map(([id, m]) => [m.ruta.replace(/\/+$/, ''), id as MercadoId]),
)
