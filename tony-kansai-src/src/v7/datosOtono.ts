// Textos de la página del otoño de Kioto (Otono.tsx). Van aparte para que la
// app y las cabeceras SEO conozcan las rutas sin cargar la página entera.
//
// Regla de contenido: nada que no sea verdad. Sin horarios ni precios de
// entradas, que cambian cada año; las fechas del otoño son las habituales.

export type OtonoId = 'o-es' | 'o-en'

export const PRECIO_OTONO = { medio: 38000, completo: 58000 }

interface Sitio { kanji: string; nombre: string; texto: string }
export interface PaginaOtono {
  lang: 'es' | 'en'; ruta: string; inicio: string
  seo: { titulo: string; descripcion: string }
  antetitulo: string; titulo: string; sub: string; cta: string
  cuando: { titulo: string; texto: string[] }
  sitiosTitulo: string; sitios: Sitio[]
  diaTitulo: string; dia: { h: string; t: string }[]; diaNota: string
  preciosTitulo: string; medio: string; completo: string; porGrupo: string; porPersona: (y: string) => string
  notas: string[]
  consejosTitulo: string; consejos: string[]
  final: { titulo: string; texto: string; boton: string }
  saludo: string; volver: string
}

export const OTONO: Record<OtonoId, PaginaOtono> = {
  'o-es': {
    lang: 'es', ruta: '/es/otono-kioto/', inicio: '/es/',
    seo: {
      titulo: 'Otoño en Kioto 2026 con guía privado en español | Tony Kansai Guide',
      descripcion: 'Los arces rojos de Kioto con un guía privado en español: te recojo en el hotel y salimos temprano para llegar antes que las multitudes. Día completo ¥58.000 por grupo.',
    },
    antetitulo: 'Temporada de momiji · noviembre y principios de diciembre',
    titulo: 'El otoño de Kioto, con guía en español.',
    sub: 'Los arces de Kioto se ponen rojos cada otoño y la ciudad se llena. Te recojo en el hotel, salimos temprano y organizo el día para que veas los templos antes que las multitudes. Solo tu grupo.',
    cta: 'Reserva tu día de otoño',
    cuando: {
      titulo: '¿Cuándo es el otoño en Kioto?',
      texto: [
        'Normalmente, de mediados de noviembre a principios de diciembre. Cada año cambia unos días según el tiempo: los jardines de montaña se adelantan y los del centro llegan un poco después.',
        'Es la época más bonita del año y también la de más gente. Por eso conviene reservar la fecha con antelación: llevo un solo grupo al día.',
      ],
    },
    sitiosTitulo: 'Dónde se ven los arces',
    sitios: [
      { kanji: '清水寺', nombre: 'Kiyomizu-dera', texto: 'El escenario de madera sobre un mar de arces. Mejor a primera hora.' },
      { kanji: '東福寺', nombre: 'Tōfuku-ji', texto: 'El puente Tsūten-kyō cruza un valle entero de arces. Uno de los más famosos de Japón.' },
      { kanji: '永観堂', nombre: 'Eikandō', texto: 'Un templo conocido como «el de los arces», con iluminación por la noche en temporada.' },
      { kanji: '南禅寺', nombre: 'Nanzen-ji', texto: 'El acueducto de ladrillo y los jardines, a un paseo del Camino del Filósofo.' },
      { kanji: '嵐山', nombre: 'Arashiyama', texto: 'Las montañas que rodean el río Katsura se tiñen de rojo y amarillo.' },
      { kanji: '奈良公園', nombre: 'Nara', texto: 'Si os apetece, los ciervos bajo los arces del parque, a 45 minutos.' },
    ],
    diaTitulo: 'Un día de otoño, por ejemplo',
    dia: [
      { h: '07:30', t: 'Te recojo en el vestíbulo de tu hotel en Osaka o Kioto.' },
      { h: '08:30', t: 'Primer templo antes de que lleguen los grupos.' },
      { h: '11:00', t: 'Paseo por los jardines y las calles de piedra de Higashiyama.' },
      { h: '12:30', t: 'Comida donde come la gente de aquí (halal o vegetariano si lo necesitáis).' },
      { h: '14:00', t: 'Segundo templo con arces, o Arashiyama si preferís río y montaña.' },
      { h: '16:30', t: 'La luz de la tarde, la mejor para las fotos, y vuelta al hotel.' },
    ],
    diaNota: 'Es un ejemplo: el orden lo decidimos juntos según los días que tengáis y cómo vaya el color ese año.',
    preciosTitulo: 'Precio por grupo, hasta 6 personas',
    medio: 'Medio día · 4 horas', completo: 'Día completo · 8 horas', porGrupo: 'por grupo',
    porPersona: (y) => `Siendo 4: ${y} por persona`,
    notas: [
      'Trenes, entradas y comidas no están incluidos: los pagáis en el momento y yo os digo cómo.',
      'Se paga en efectivo el día del tour o por adelantado con PayPal o Wise.',
      'Cancelación sin coste hasta 72 horas antes.',
    ],
    consejosTitulo: 'Consejos para el otoño',
    consejos: [
      'Reserva el hotel cuanto antes: noviembre es temporada alta en Kioto.',
      'Lleva calzado cómodo y una capa: por la mañana hace fresco y al mediodía templado.',
      'Entre semana hay bastante menos gente que en fin de semana.',
    ],
    final: { titulo: '¿Vienes en otoño?', texto: 'Dime tus fechas y cuántos sois. Te contesto yo, Tony, normalmente el mismo día.', boton: 'Escríbeme por WhatsApp' },
    saludo: 'Hola Tony, vengo en otoño y me interesa un día en Kioto. Fechas: ',
    volver: 'Volver a la página principal',
  },
  'o-en': {
    lang: 'en', ruta: '/en/kyoto-autumn/', inicio: '/en/',
    seo: {
      titulo: 'Kyoto Autumn Leaves 2026 with a Private Guide | Tony Kansai Guide',
      descripcion: 'See Kyoto\'s red maples with a private guide: hotel pick-up and an early start to beat the crowds. Full day ¥58,000 per group of up to 6.',
    },
    antetitulo: 'Momiji season · November to early December',
    titulo: 'Kyoto in autumn, with your own guide.',
    sub: 'Every autumn Kyoto\'s maples turn red and the city fills up. I meet you at your hotel, we start early and I plan the day so you reach the temples before the crowds. Just your group.',
    cta: 'Book your autumn day',
    cuando: {
      titulo: 'When is autumn in Kyoto?',
      texto: [
        'Usually from mid-November to early December. It shifts by a few days each year with the weather: gardens in the hills turn first and the city centre a little later.',
        'It\'s the most beautiful time of year and also the busiest, so it\'s worth booking your date early: I take one group a day.',
      ],
    },
    sitiosTitulo: 'Where to see the maples',
    sitios: [
      { kanji: '清水寺', nombre: 'Kiyomizu-dera', texto: 'The wooden stage above a sea of maples. Best first thing in the morning.' },
      { kanji: '東福寺', nombre: 'Tōfuku-ji', texto: 'The Tsūten-kyō bridge spans a whole valley of maples. One of Japan\'s most famous views.' },
      { kanji: '永観堂', nombre: 'Eikandō', texto: 'Known as the temple of maples, with evening illuminations in season.' },
      { kanji: '南禅寺', nombre: 'Nanzen-ji', texto: 'The brick aqueduct and gardens, a short walk from the Philosopher\'s Path.' },
      { kanji: '嵐山', nombre: 'Arashiyama', texto: 'The hills around the Katsura river turn red and gold.' },
      { kanji: '奈良公園', nombre: 'Nara', texto: 'If you like, the deer under the park\'s maples, 45 minutes away.' },
    ],
    diaTitulo: 'An autumn day, for example',
    dia: [
      { h: '07:30', t: 'I meet you in your hotel lobby in Osaka or Kyoto.' },
      { h: '08:30', t: 'First temple before the tour groups arrive.' },
      { h: '11:00', t: 'Gardens and the stone lanes of Higashiyama.' },
      { h: '12:30', t: 'Lunch where locals eat (halal or vegetarian if you need it).' },
      { h: '14:00', t: 'A second maple temple, or Arashiyama if you prefer river and hills.' },
      { h: '16:30', t: 'Late-afternoon light, the best for photos, and back to your hotel.' },
    ],
    diaNota: 'Just an example: we set the order together, depending on your days and how the colour is that year.',
    preciosTitulo: 'Price per group, up to 6 people',
    medio: 'Half day · 4 hours', completo: 'Full day · 8 hours', porGrupo: 'per group',
    porPersona: (y) => `For 4 people: ${y} each`,
    notas: [
      'Trains, admissions and meals aren\'t included: you pay as we go and I show you how.',
      'Pay in cash on the day, or in advance with PayPal or Wise.',
      'Free cancellation up to 72 hours before.',
    ],
    consejosTitulo: 'Autumn tips',
    consejos: [
      'Book your hotel early: November is high season in Kyoto.',
      'Bring comfortable shoes and a layer: mornings are cool and middays mild.',
      'Weekdays are much quieter than weekends.',
    ],
    final: { titulo: 'Coming in autumn?', texto: 'Tell me your dates and how many you are. I reply myself, usually the same day.', boton: 'Message me on WhatsApp' },
    saludo: 'Hi Tony, I\'m coming in autumn and I\'d like a day in Kyoto. Dates: ',
    volver: 'Back to the main page',
  },
}

export const RUTAS_OTONO: Record<string, OtonoId> = { '/es/otono-kioto': 'o-es', '/en/kyoto-autumn': 'o-en' }
export const SEO_OTONO = Object.fromEntries(Object.values(OTONO).map((p) => [p.ruta, { ...p.seo, lang: p.lang }]))

