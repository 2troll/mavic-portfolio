// Páginas de respuesta (PaginaRespuesta.tsx): cada una contesta UNA pregunta
// que la gente hace a Google o a una IA («¿cuánto cuesta un guía privado en
// Kioto?», «¿dónde rezar en Kansai?», «¿dónde comer halal?»). Van aparte, como
// datosGuias.ts, para que la app, las cabeceras estáticas y el sitemap conozcan
// las rutas sin cargar la página.
//
// Por qué así: las IAs leen solo el texto visible y citan frases con cifras,
// fecha y fuente. Por eso la respuesta va en la primera frase, la tabla lleva
// la fecha en que se miraron los precios y cada dato ajeno tiene su enlace.
//
// Regla de contenido: nada que no se haya comprobado. Lo que no se pudo
// verificar en una fuente (dirección de la mezquita de Kioto, estación más
// cercana a cada mezquita, nombres de restaurantes halal de Osaka) NO se pone.
// Sobre Tony solo lo que ya dice la web: precios por grupo, idiomas, recogida
// en el hotel, pago y cancelación. Nunca «licensed» (ver FAQ de la licencia).
//
// Fuentes comprobadas el 2026-10-14:
// - Civitatis, «Tour privado por el Kioto imperial»: 8 h, desde 400 US$, guía en
//   español, recogida a pie en el hotel; aparte transporte (940 ¥/pers.) y
//   entradas (1.200 ¥/pers.); cancelación gratis hasta 7 días antes:
//   https://www.civitatis.com/es/kioto/tour-privado-kioto-imperial/
// - GoWithGuide, guías de Kioto: tours privados de 8 h por grupo de 351 a 632 US$
//   (también hay de 6 h desde 221 US$); casi todos en inglés:
//   https://www.gowithguide.com/japan/kyoto
// - ToursByLocals, tours privados de Kioto de 8 h en transporte público: de 353 a
//   516 US$ en total según el guía, grupos de 1-7 a 1-10 personas:
//   https://www.toursbylocals.com/tours/japan/kyoto/city-highlights-tours
// - Licencia: desde el 4-1-2018 cualquiera puede guiar cobrando; solo el título
//   全国通訳案内士 (y nombres parecidos) está reservado (JNTO):
//   https://www.jnto.go.jp/projects/visitor-support/interpreter-guide-exams/
// - Mezquita de Kobe: 2-25-14 Nakayamate-dori, Chuo-ku, Kobe; «la más antigua de
//   Japón» (web oficial); inaugurada en 1935 (Wikipedia y Arab News Japan):
//   https://www.kobemosque.com · https://en.wikipedia.org/wiki/Kobe_Mosque
// - Osaka Ibaraki Mosque: 4-6-13 Toyokawa, Ibaraki; tel. 072-643-7420; oración
//   del viernes cada semana (hora: preguntar a la mezquita). Web oficial:
//   http://osakamosque.org
// - Mezquita de Kioto (Kyoto Muslim Association): cerca del Palacio Imperial,
//   tel. +81-75-231-3499, oficina de martes a sábado de 12:00 a 18:00, cinco
//   oraciones, viernes y Eid; espacios de oración en el castillo de Nijō, el
//   Museo Internacional del Manga, el Kyoto Handicraft Center y el Kyoto
//   International Community House (web oficial de turismo de Kioto):
//   https://kyoto.travel/en/muslim/
//   https://kyoto.travel/en/muslim/free-spaces-for-muslims-to-perform-prayers/
// - Comida halal en Kioto: categorías Halal / Muslim Friendly / Muslim Welcome /
//   Pork-Free, supervisadas por la KMA y el Kyoto Council for Sharia and Halal
//   Affairs; en la lista, con menú halal: «Halal A5 Wagyu Yakiniku Sudaku Kyoto»
//   y «Kobe Beef Gion Sudaku Teppan»:
//   https://kyoto.travel/en/muslim/finding-halal-food/
// - Aeropuerto de Kansai: salas de oración separadas por sexo y con lugar para
//   las abluciones (Halal Media Japan; la ubicación exacta no se pone porque la
//   fuente es antigua y la web del aeropuerto no deja leerse automáticamente):
//   https://halalmedia.jp/en/archives/5343/prayer-rooms-at-kansai-international-airport/

import { PRECIO_GUIA } from './datosGuias'
import { yenLocal } from './formato'

export type RespuestaId = 'coste-es' | 'coste-en' | 'mezquitas-ar' | 'halal-ar'
  | 'kansai-es' | 'privado-es' | 'arabe-es' | 'kansai-en' | 'arabe-en'
// Las de un mismo grupo son traducciones entre sí (hreflang y selector de idioma).
export type GrupoRespuesta = 'coste' | 'mezquitas' | 'halal' | 'kansai' | 'privado' | 'arabe'
export type LangRespuesta = 'es' | 'en' | 'ar'

/** Fecha de la última revisión: la ven el visitante, el JSON-LD y el sitemap. */
export const REVISADO = '2026-10-14'

export interface Tabla { cabecera: string[]; filas: string[][]; nota: string }
export interface Seccion { titulo: string; parrafos?: string[]; lista?: string[]; tabla?: Tabla }
export interface PaginaRespuesta {
  lang: LangRespuesta; ruta: string; inicio: string; grupo: GrupoRespuesta
  // Foto de portada (clave de creditosZonas.json) y su nombre para los créditos.
  foto: { clave: string; lugar: string }; og: string
  seo: { titulo: string; descripcion: string }
  antetitulo: string; titulo: string
  /** La respuesta directa, en la primera frase: es lo que copia una IA. */
  respuesta: string
  actualizado: string
  cta: string
  secciones: Seccion[]
  precios: { titulo: string; texto: string; medio: string; completo: string; porGrupo: string; notas: string[] }
  faqTitulo: string; faq: { p: string; r: string }[]
  fuentesTitulo: string; fuentes: { texto: string; url: string }[]
  final: { titulo: string; texto: string; boton: string }
  altFoto: string; saludo: string; volver: string
}

const yenEs = (n: number) => yenLocal(n, 'es')
const yenEn = (n: number) => yenLocal(n, 'en')
// Precio por persona con el grupo lleno (6): la cuenta que hace quien compara.
const porPersona = (n: number) => Math.round(n / 6 / 100) * 100

const FUENTES_PRECIOS = [
  { texto: 'Civitatis: Tour privado por el Kioto imperial', url: 'https://www.civitatis.com/es/kioto/tour-privado-kioto-imperial/' },
  { texto: 'GoWithGuide: Kyoto private tour guides', url: 'https://www.gowithguide.com/japan/kyoto' },
  { texto: 'ToursByLocals: Kyoto private tours', url: 'https://www.toursbylocals.com/tours/japan/kyoto/city-highlights-tours' },
  { texto: 'JNTO: 通訳案内士制度 (guide-interpreter system)', url: 'https://www.jnto.go.jp/projects/visitor-support/interpreter-guide-exams/' },
]
const FUENTES_MEZQUITAS = [
  { texto: 'Kobe Muslim Mosque (الموقع الرسمي)', url: 'https://www.kobemosque.com' },
  { texto: 'Kobe Mosque — Wikipedia', url: 'https://en.wikipedia.org/wiki/Kobe_Mosque' },
  { texto: 'Osaka Ibaraki Mosque (الموقع الرسمي)', url: 'http://osakamosque.org' },
  { texto: 'Muslim Friendly Kyoto — kyoto.travel', url: 'https://kyoto.travel/en/muslim/' },
  { texto: 'أماكن الصلاة المجانية في كيوتو — kyoto.travel', url: 'https://kyoto.travel/en/muslim/free-spaces-for-muslims-to-perform-prayers/' },
  { texto: 'مصليات مطار كانساي — Halal Media Japan', url: 'https://halalmedia.jp/en/archives/5343/prayer-rooms-at-kansai-international-airport/' },
]
const FUENTES_HALAL = [
  { texto: 'الطعام الحلال في كيوتو — kyoto.travel', url: 'https://kyoto.travel/en/muslim/finding-halal-food/' },
  { texto: 'Muslim Friendly Kyoto — kyoto.travel', url: 'https://kyoto.travel/en/muslim/' },
  { texto: 'Osaka Ibaraki Mosque', url: 'http://osakamosque.org' },
]

const M = PRECIO_GUIA

export const PAGINAS_RESPUESTA: Record<RespuestaId, PaginaRespuesta> = {
  'coste-es': {
    lang: 'es', ruta: '/es/guia-privado-espanol-kioto/', inicio: '/es/', grupo: 'coste',
    foto: { clave: 'kioto-kiyomizu', lugar: 'Kiyomizu-dera' }, og: '/v8/og/kyoto.jpg',
    seo: {
      titulo: 'Guía privado en español en Kioto: precio y si merece la pena | Tony Kansai Guide',
      descripcion: `Cuánto cuesta un guía privado en Kioto en 2026: Civitatis, GoWithGuide y ToursByLocals frente a Tony (${yenEs(M.medio)} medio día, ${yenEs(M.completo)} día completo, por grupo).`,
    },
    antetitulo: 'Kioto · Precios revisados en oct. 2026',
    titulo: '¿Cuánto cuesta un guía privado en español en Kioto?',
    respuesta: `En octubre de 2026, un día completo (8 horas) con guía privado en Kioto cuesta entre unos 350 y 630 US$ por grupo en las plataformas grandes; Civitatis lo ofrece en español desde 400 US$. Con Tony, guía en español que vive en Osaka, cuesta ${yenEs(M.medio)} el medio día (4 horas) y ${yenEs(M.completo)} el día completo, por grupo de hasta 6 personas y sin intermediarios.`,
    actualizado: 'Actualizado: oct. 2026',
    cta: 'Pregúntame por WhatsApp',
    secciones: [
      {
        titulo: 'Comparativa de precios (oct. 2026)',
        tabla: {
          cabecera: ['Opción', 'Duración y precio', 'Grupo', 'Idioma', 'Cancelación'],
          filas: [
            ['Tony Kansai Guide (directo)', `4 h: ${yenEs(M.medio)} · 8 h: ${yenEs(M.completo)}`, 'Por grupo, hasta 6 personas', 'Español, inglés y árabe', 'Gratis hasta 72 h antes'],
            ['Civitatis · Tour privado por el Kioto imperial', '8 h: desde 400 US$', 'Privado', 'Español', 'Gratis hasta 7 días antes'],
            ['GoWithGuide · tours privados de 8 h', '351-632 US$', 'Por grupo', 'Sobre todo inglés', 'Según el guía'],
            ['ToursByLocals · tours privados de 8 h', '353-516 US$', 'Total para 1-7 o 1-10 personas, según el guía', 'Sobre todo inglés', 'Según el guía'],
          ],
          nota: 'Precios orientativos, mirados en cada web el 14-10-2026; pueden cambiar según la fecha y el número de personas. En todos los casos, trenes, entradas y comidas van aparte.',
        },
      },
      {
        titulo: '¿Merece la pena un guía privado en Kioto?',
        lista: [
          `Sí, en grupo de 3 o más: con el grupo lleno de 6, el día completo sale a unos ${yenEs(porPersona(M.completo))} por persona.`,
          'Sí, si es tu primera vez en Japón, vas con niños o mayores, o no quieres perder la mañana descifrando trenes y colas: el guía elige el orden para llegar antes que la gente a Fushimi Inari o Kiyomizu.',
          'Sí, si quieres entender lo que ves en tu idioma, preguntar sin vergüenza y comer donde come la gente de aquí.',
          'Quizá no, si viajas solo con poco presupuesto: ir por tu cuenta con una buena guía o un free tour cubre lo básico.',
        ],
      },
      {
        titulo: 'Plataforma o guía directo',
        parrafos: [
          'Las plataformas te dan un catálogo grande y un pago a través de ellas, y se quedan una comisión. Reservando directo hablas con el guía antes de pagar nada, ajustas el recorrido con él y el precio es el del guía.',
          'Con Tony puedes pagar en efectivo el día del tour, o por adelantado con PayPal o Wise cuando la fecha está confirmada por WhatsApp.',
        ],
      },
    ],
    precios: {
      titulo: 'Precio de Tony, por grupo',
      texto: 'Te recojo en el vestíbulo de tu hotel en Osaka, Kioto o Nara. Solo tu grupo, a tu ritmo.',
      medio: 'Medio día · 4 horas', completo: 'Día completo · 8 horas', porGrupo: 'por grupo, hasta 6 personas',
      notas: [
        'Trenes, entradas y comidas no están incluidos: se pagan en el momento y yo te digo cómo.',
        'Se paga en efectivo el día del tour o por adelantado con PayPal o Wise.',
        'Cancelación sin coste hasta 72 horas antes.',
      ],
    },
    faqTitulo: 'Preguntas frecuentes',
    faq: [
      { p: '¿Cuánto cuesta un guía privado en español en Kioto?', r: `En las plataformas, un día de 8 horas va de unos 350 a 630 US$ por grupo (oct. 2026). Con Tony, ${yenEs(M.medio)} medio día y ${yenEs(M.completo)} día completo, por grupo de hasta 6 personas.` },
      { p: '¿El precio es por persona o por grupo?', r: 'Por grupo. El mismo precio para 1 que para 6 personas.' },
      { p: '¿Y si somos más de 6?', r: 'Acompaño grupos de hasta 14 personas. Dime el número de personas y te digo el precio.' },
      { p: '¿Qué no está incluido?', r: 'Trenes, entradas y comidas. Se pagan en el momento; te digo antes cuánto llevar.' },
      { p: '¿Me recoges en el hotel?', r: 'Sí, en el vestíbulo de tu hotel en Osaka, Kioto o Nara.' },
      { p: '¿Cómo se paga y hasta cuándo puedo cancelar?', r: 'En efectivo el día del tour, o por adelantado con PayPal o Wise una vez confirmada la fecha. Cancelación gratis hasta 72 horas antes.' },
      { p: '¿Un guía en Japón necesita licencia?', r: 'No. Desde el 4 de enero de 2018 cualquier persona puede guiar cobrando; solo el título oficial 全国通訳案内士 (guía-intérprete nacional) está reservado a quien aprueba su examen (JNTO).' },
    ],
    fuentesTitulo: 'Fuentes',
    fuentes: FUENTES_PRECIOS,
    final: { titulo: '¿Te cuadra?', texto: 'Dime fechas, número de personas y qué te apetece ver, y te contesto con un plan y el precio cerrado.', boton: 'Escribir a Tony' },
    altFoto: 'El templo Kiyomizu-dera, en Kioto', saludo: 'Hola Tony, he visto la página de precios de guía en Kioto y quería preguntarte por un tour.',
    volver: '← Volver a la página de Tony',
  },

  'coste-en': {
    lang: 'en', ruta: '/en/kyoto-private-guide-cost/', inicio: '/en/', grupo: 'coste',
    foto: { clave: 'kioto-kiyomizu', lugar: 'Kiyomizu-dera' }, og: '/v8/og/kyoto.jpg',
    seo: {
      titulo: 'How Much Does a Private Guide in Kyoto Cost? (2026) | Tony Kansai Guide',
      descripcion: `Kyoto private guide prices in Oct 2026: GoWithGuide, ToursByLocals and Civitatis compared with booking direct (${yenEn(M.medio)} half day, ${yenEn(M.completo)} full day, per group).`,
    },
    antetitulo: 'Kyoto · Prices checked Oct 2026',
    titulo: 'How much does a private guide in Kyoto cost?',
    respuesta: `In October 2026, a full day (8 hours) with a private guide in Kyoto costs roughly US$350-630 per group on the big platforms (GoWithGuide, ToursByLocals). Booking Tony directly costs ${yenEn(M.medio)} for a half day (4 hours) and ${yenEn(M.completo)} for a full day, per group of up to 6, with no middleman.`,
    actualizado: 'Updated: Oct 2026',
    cta: 'Ask me on WhatsApp',
    secciones: [
      {
        titulo: 'Price comparison (Oct 2026)',
        tabla: {
          cabecera: ['Option', 'Length and price', 'Group', 'Language', 'Cancellation'],
          filas: [
            ['Tony Kansai Guide (direct)', `4 h: ${yenEn(M.medio)} · 8 h: ${yenEn(M.completo)}`, 'Per group, up to 6', 'English, Spanish, Arabic', 'Free up to 72 h before'],
            ['GoWithGuide · 8-hour private tours', 'US$351-632', 'Per group', 'Mostly English', 'Depends on the guide'],
            ['ToursByLocals · 8-hour private tours', 'US$353-516', 'Total for 1-7 or 1-10 people, by guide', 'Mostly English', 'Depends on the guide'],
            ['Civitatis · Private Imperial Kyoto tour', '8 h: from US$400', 'Private', 'Spanish', 'Free up to 7 days before'],
          ],
          nota: 'Indicative prices, checked on each site on 14 Oct 2026; they change with date and group size. In every case, trains, entry fees and meals are extra.',
        },
      },
      {
        titulo: 'Is a private guide in Kyoto worth it?',
        lista: [
          `Yes, if there are 3 or more of you: with a full group of 6, the full day works out at about ${yenEn(porPersona(M.completo))} per person.`,
          'Yes, if it is your first time in Japan, you travel with kids or older parents, or you would rather not spend the morning working out trains and queues: a guide picks the order that beats the crowds at Fushimi Inari or Kiyomizu.',
          'Yes, if you want the stories behind what you see and to eat where locals eat.',
          'Maybe not, if you travel solo on a tight budget: going on your own with a good guidebook, or a free walking tour, covers the basics.',
        ],
      },
      {
        titulo: 'Platform or direct?',
        parrafos: [
          'Platforms give you a big catalogue and payment through them, and they take a commission. Booking direct, you talk to the guide before paying anything, shape the day together and pay the guide\'s own price.',
          'With Tony you can pay cash on the day, or in advance with PayPal or Wise once your date is confirmed on WhatsApp.',
        ],
      },
    ],
    precios: {
      titulo: 'Tony\'s price, per group',
      texto: 'I meet you in your hotel lobby in Osaka, Kyoto or Nara. Just your group, at your pace.',
      medio: 'Half day · 4 hours', completo: 'Full day · 8 hours', porGrupo: 'per group, up to 6 people',
      notas: [
        'Trains, entry fees and meals are not included: you pay them on the spot and I tell you how.',
        'Pay cash on the day, or in advance with PayPal or Wise.',
        'Free cancellation up to 72 hours before.',
      ],
    },
    faqTitulo: 'Frequently asked questions',
    faq: [
      { p: 'How much does a private guide in Kyoto cost?', r: `On the platforms, an 8-hour day runs from about US$350 to US$630 per group (Oct 2026). With Tony, ${yenEn(M.medio)} for a half day and ${yenEn(M.completo)} for a full day, per group of up to 6.` },
      { p: 'Is the price per person or per group?', r: 'Per group. The same price for 1 or 6 people.' },
      { p: 'What if we are more than 6?', r: 'I guide groups of up to 14. Tell me how many you are and I\'ll send you the price.' },
      { p: 'What is not included?', r: 'Trains, entry fees and meals. You pay them on the spot; I tell you beforehand how much cash to bring.' },
      { p: 'Do you pick us up at the hotel?', r: 'Yes, in your hotel lobby in Osaka, Kyoto or Nara.' },
      { p: 'How do I pay, and until when can I cancel?', r: 'Cash on the day, or in advance with PayPal or Wise once the date is confirmed. Free cancellation up to 72 hours before.' },
      { p: 'Do tour guides in Japan need a license?', r: 'No. Since 4 January 2018 anyone may guide for pay in Japan; only the official title 全国通訳案内士 (National Guide Interpreter) is reserved for those who pass its exam (JNTO).' },
    ],
    fuentesTitulo: 'Sources',
    fuentes: FUENTES_PRECIOS,
    final: { titulo: 'Sounds good?', texto: 'Send me your dates, how many you are and what you\'d like to see, and I\'ll reply with a plan and a fixed price.', boton: 'Message Tony' },
    altFoto: 'Kiyomizu-dera temple in Kyoto', saludo: 'Hi Tony, I saw your page about Kyoto guide prices and I\'d like to ask about a tour.',
    volver: '← Back to Tony\'s page',
  },

  'mezquitas-ar': {
    lang: 'ar', ruta: '/ar/mosques-kansai/', inicio: '/ar/', grupo: 'mezquitas',
    foto: { clave: 'kobe-mezquita', lugar: 'مسجد كوبي' }, og: '/v8/og/kobe.jpg',
    seo: {
      titulo: 'المساجد وأماكن الصلاة في كانساي: كوبي وأوساكا وكيوتو | Tony Kansai Guide',
      descripcion: 'أين تصلي في كيوتو وأوساكا وكوبي: مسجد كوبي أقدم مسجد في اليابان، ومسجد أوساكا إيباراكي، ومسجد كيوتو، ومصليات في معالم كيوتو. مع مرشد مسلم يتكلم العربية.',
    },
    antetitulo: 'كانساي · معلومات محدّثة في أكتوبر ٢٠٢٦',
    titulo: 'أين نصلي في كانساي؟ المساجد وأماكن الصلاة',
    respuesta: 'في كانساي ثلاثة مساجد رئيسية: مسجد كوبي، أقدم مسجد في اليابان (افتُتح عام ١٩٣٥)، ومسجد أوساكا في مدينة إيباراكي شمال أوساكا، ومسجد كيوتو قرب القصر الإمبراطوري. وفي كيوتو مصليات مجانية في أماكن سياحية مثل قلعة نيجو. أنا طوني، مرشد مسلم أتكلم العربية، وأضع وقفات الصلاة في مسار الجولة من البداية.',
    actualizado: 'آخر تحديث: أكتوبر ٢٠٢٦',
    cta: 'اسألني عبر واتساب',
    secciones: [
      {
        titulo: 'المساجد',
        lista: [
          'مسجد كوبي (Kobe Muslim Mosque): أقدم مسجد في اليابان، افتُتح عام ١٩٣٥ وصمد في الحرب وفي زلزال ١٩٩٥. العنوان: 2-25-14 Nakayamate-dori, Chuo-ku, Kobe. نجعله جزءاً من يوم في كوبي مع الميناء وحي كيتانو.',
          'مسجد أوساكا إيباراكي (Osaka Ibaraki Mosque): في مدينة إيباراكي شمال أوساكا. العنوان: 4-6-13 Toyokawa, Ibaraki-shi, Osaka. الهاتف: 072-643-7420. تُقام فيه صلاة الجمعة كل أسبوع؛ اسألوا المسجد عن وقتها.',
          'مسجد كيوتو والمركز الثقافي الإسلامي: تديره جمعية كيوتو الإسلامية (KMA)، قرب القصر الإمبراطوري. تُقام فيه الصلوات الخمس والجمعة والعيدان، والزوار مرحَّب بهم. المكتب مفتوح من الثلاثاء إلى السبت من ١٢:٠٠ إلى ١٨:٠٠، ومغلق يوم الأحد. الهاتف: ‎+81-75-231-3499.',
        ],
      },
      {
        titulo: 'مصليات في كيوتو',
        parrafos: ['حسب موقع السياحة الرسمي لمدينة كيوتو، توجد أماكن مجانية للصلاة في عدة معالم، منها:'],
        lista: [
          'قلعة نيجو (Nijo-jo Castle)',
          'متحف كيوتو الدولي للمانغا (Kyoto International Manga Museum)',
          'مركز كيوتو للحِرف (Kyoto Handicraft Center)',
          'دار كيوتو الدولية للمجتمع (Kyoto International Community House)',
        ],
      },
      {
        titulo: 'في مطار كانساي',
        parrafos: ['في مطار كانساي الدولي مصليات منفصلة للرجال والنساء، مع مكان للوضوء. تأكدوا من موقعها عند الوصول من لوحات الإرشاد في المطار.'],
      },
      {
        titulo: 'نصائح قبل الزيارة',
        lista: [
          'في المسجد: لباس ساتر للرجال والنساء، وغطاء الرأس للنساء.',
          'مسجد كيوتو ليس بجانب محطة كيوتو، بل في شمال وسط المدينة؛ إن كانت الجولة في كيوتو أرتّب المسار بحيث نمرّ به أو بأحد المصليات وقت الصلاة.',
          'يوم الجمعة: أخبروني عند الحجز، فأبني اليوم حول صلاة الجمعة.',
        ],
      },
    ],
    precios: {
      titulo: 'جولة خاصة بالعربية، والسعر للمجموعة',
      texto: 'ألتقيكم في بهو فندقكم في أوساكا أو كيوتو أو نارا أو كوبي. الجولة لعائلتكم وحدها، وبالإيقاع الذي يناسبكم.',
      medio: 'نصف يوم · ٤ ساعات', completo: 'يوم كامل · ٨ ساعات', porGrupo: 'للمجموعة، حتى ٦ أشخاص',
      notas: [
        'القطارات وتذاكر الدخول والطعام غير مشمولة، وتُدفع في مكانها.',
        'الدفع نقداً بالين يوم الجولة، أو مسبقاً عبر PayPal أو Wise.',
        'الإلغاء مجاني حتى ٧٢ ساعة قبل الجولة.',
      ],
    },
    faqTitulo: 'أسئلة شائعة',
    faq: [
      { p: 'أين أصلي في كيوتو؟', r: 'في مسجد كيوتو قرب القصر الإمبراطوري، أو في المصليات المجانية في معالم مثل قلعة نيجو ومتحف كيوتو الدولي للمانغا.' },
      { p: 'ما أقرب مسجد من محطة كيوتو؟', r: 'مسجد كيوتو في شمال وسط المدينة قرب القصر الإمبراطوري، لا بجانب المحطة. في الجولة أرتّب المسار ليمرّ به أو بأحد المصليات وقت الصلاة.' },
      { p: 'هل يمكن زيارة مسجد كوبي؟', r: 'نعم. مسجد كوبي أقدم مسجد في اليابان (١٩٣٥)، في 2-25-14 Nakayamate-dori. نزوره مع الميناء وحي كيتانو، ونصلي فيه إن وافق وقت الصلاة.' },
      { p: 'أين مسجد أوساكا؟', r: 'مسجد أوساكا إيباراكي في 4-6-13 Toyokawa بمدينة إيباراكي، شمال أوساكا. تُقام فيه صلاة الجمعة كل أسبوع.' },
      { p: 'هل في مطار كانساي مصلى؟', r: 'نعم، مصليات منفصلة للرجال والنساء مع مكان للوضوء.' },
      { p: 'هل المرشد مسلم ويتكلم العربية؟', r: 'نعم. أنا طوني، مسلم وأتكلم العربية والإسبانية والإنجليزية، وأضع أوقات الصلاة في المسار من البداية.' },
    ],
    fuentesTitulo: 'المصادر',
    fuentes: FUENTES_MEZQUITAS,
    final: { titulo: 'نرتّب يومكم مع أوقات الصلاة؟', texto: 'أخبرني بالتاريخ وعددكم وما تحبون رؤيته، وأرسل لكم مساراً وسعراً ثابتاً للمجموعة.', boton: 'راسل طوني' },
    altFoto: 'مسجد كوبي، أقدم مسجد في اليابان', saludo: 'السلام عليكم طوني، رأيت صفحة المساجد في كانساي وأريد أن أسأل عن جولة.',
    volver: '← العودة إلى صفحة طوني',
  },

  'halal-ar': {
    lang: 'ar', ruta: '/ar/halal-kyoto-osaka/', inicio: '/ar/', grupo: 'halal',
    foto: { clave: 'osaka-dotonbori', lugar: 'دوتونبوري، أوساكا' }, og: '/v8/og/osaka.jpg',
    seo: {
      titulo: 'الطعام الحلال في كيوتو وأوساكا: كيف تختار المطعم | Tony Kansai Guide',
      descripcion: 'دليل الطعام الحلال في كيوتو وأوساكا: معنى «حلال» و«Muslim Friendly» في قوائم كيوتو الرسمية، وواغيو حلال، وما تسأل عنه في المطعم. مع مرشد مسلم يتكلم العربية.',
    },
    antetitulo: 'كيوتو وأوساكا · معلومات محدّثة في أكتوبر ٢٠٢٦',
    titulo: 'الطعام الحلال في كيوتو وأوساكا',
    respuesta: 'نعم، تجد طعاماً حلالاً في كيوتو وأوساكا، حتى الواغيو. في كيوتو تراجع جمعية كيوتو الإسلامية ومجلس كيوتو للشريعة والحلال المطاعم المدرجة في قائمة المدينة الرسمية، وتصنّفها في أربع درجات. وفي نامبا وشينسايباشي بأوساكا مطاعم حاصلة على شهادة حلال. أنا طوني، مرشد مسلم، وأختار مطعم الغداء معكم قبل يوم الجولة.',
    actualizado: 'آخر تحديث: أكتوبر ٢٠٢٦',
    cta: 'اسألني عبر واتساب',
    secciones: [
      {
        titulo: 'ماذا تعني التصنيفات في كيوتو؟',
        parrafos: ['هذه درجات قائمة «Muslim Friendly Kyoto» الرسمية:'],
        lista: [
          'Halal: مطعم أو مقهى كل طعامه حلال.',
          'Muslim Friendly: عنده قائمة حلال خاصة بشعار حلال، لكن قائمته العادية فيها أطباق غير حلال.',
          'Muslim Welcome: لا لحم خنزير ولا مشتقاته ولا نكهات كحولية في المكان كله، لكن بلا قائمة حلال خاصة.',
          'Pork-Free: بلا خنزير وبلا لحوم، وقد تُستعمل نكهات كحولية في الطبخ.',
        ],
      },
      {
        titulo: 'واغيو حلال',
        parrafos: ['في قائمة كيوتو الرسمية مطاعم لحم بقري ياباني بقائمة حلال، منها «Halal A5 Wagyu Yakiniku Sudaku Kyoto» و«Kobe Beef Gion Sudaku Teppan» في حي غيون. القوائم تتغير، فأتأكد من المطعم قبل يومكم وتحجزونه أنتم.'],
      },
      {
        titulo: 'ما تسأل عنه في المطعم الياباني',
        lista: [
          'كثير من الصلصات اليابانية فيها «ميرين» أو ساكي للطبخ، وهما من الكحول، حتى في أطباق تبدو بسيطة. اسألوا عنها أو اختاروا مطعماً حلالاً.',
          'مرق الرامن التقليدي «تونكوتسو» من عظم الخنزير؛ اطلبوا رامن حلال أو رامن الدجاج من مطعم موثوق.',
          'شعار الحلال على الباب لا يكفي وحده: اسألوا هل القائمة كلها حلال أم جزء منها.',
        ],
      },
      {
        titulo: 'في أوساكا',
        parrafos: ['في نامبا وشينسايباشي وحولهما مطاعم حاصلة على شهادة حلال، ومنها ما فيه مكان للصلاة. أختار المطعم حسب مسار اليوم وعددكم، وأضع وقت الغداء والصلاة في المسار من البداية.'],
      },
    ],
    precios: {
      titulo: 'جولة خاصة بالعربية، والسعر للمجموعة',
      texto: 'ألتقيكم في بهو فندقكم في أوساكا أو كيوتو أو نارا أو كوبي. الجولة لعائلتكم وحدها، وبالإيقاع الذي يناسبكم.',
      medio: 'نصف يوم · ٤ ساعات', completo: 'يوم كامل · ٨ ساعات', porGrupo: 'للمجموعة، حتى ٦ أشخاص',
      notas: [
        'القطارات وتذاكر الدخول والطعام غير مشمولة، وتُدفع في مكانها.',
        'الدفع نقداً بالين يوم الجولة، أو مسبقاً عبر PayPal أو Wise.',
        'الإلغاء مجاني حتى ٧٢ ساعة قبل الجولة.',
      ],
    },
    faqTitulo: 'أسئلة شائعة',
    faq: [
      { p: 'هل يوجد طعام حلال في كيوتو؟', r: 'نعم. في قائمة «Muslim Friendly Kyoto» الرسمية مطاعم حلال ومطاعم بقائمة حلال، تراجعها جمعية كيوتو الإسلامية ومجلس كيوتو للشريعة والحلال.' },
      { p: 'هل يوجد واغيو حلال؟', r: 'نعم. في كيوتو مطاعم واغيو بقائمة حلال، منها «Halal A5 Wagyu Yakiniku Sudaku Kyoto» و«Kobe Beef Gion Sudaku Teppan». أتأكد منها قبل يومكم وتحجزونها أنتم.' },
      { p: 'أين آكل حلالاً في أوساكا؟', r: 'في نامبا وشينسايباشي مطاعم حاصلة على شهادة حلال. أختار لكم واحداً على طريق الجولة.' },
      { p: 'ما الفرق بين Halal وMuslim Friendly؟', r: 'Halal: كل الطعام حلال. Muslim Friendly: قائمة حلال خاصة، والقائمة العادية فيها غير الحلال.' },
      { p: 'هل المرشد مسلم؟', r: 'نعم. أنا طوني، مسلم وأتكلم العربية، وأعرف المطاعم الحلال الموثوقة في أوساكا وكيوتو. أخبروني عند الحجز لا في يوم الجولة.' },
      { p: 'وماذا لو كنا أكثر من ستة؟', r: 'الأسعار الثابتة لمجموعات حتى ستة أشخاص، وأرافق مجموعات أكبر حتى ١٤ شخصاً. أخبرني بعددكم وأرسل لك السعر.' },
    ],
    fuentesTitulo: 'المصادر',
    fuentes: FUENTES_HALAL,
    final: { titulo: 'نخطط ليومكم مع غداء حلال؟', texto: 'أخبرني بالتاريخ وعددكم وما تحبون رؤيته، وأرسل لكم مساراً وسعراً ثابتاً للمجموعة.', boton: 'راسل طوني' },
    altFoto: 'شارع دوتونبوري في أوساكا', saludo: 'السلام عليكم طوني، رأيت صفحة الطعام الحلال وأريد أن أسأل عن جولة.',
    volver: '← العودة إلى صفحة طوني',
  },
  // ── Páginas de oct. 2026 (auditoría SEO): cada una responde a una búsqueda
  // distinta y enlaza a la página de ciudad o de rutas que ya existe. Solo datos
  // que ya publica la web: precios por grupo, idiomas, recogida, pago,
  // cancelación e itinerarios de datosItinerarios.ts. Sin precios ajenos nuevos.
  'kansai-es': {
    lang: 'es', ruta: '/es/guia-espanol-kansai/', inicio: '/es/', grupo: 'kansai',
    foto: { clave: 'kioto-fushimi', lugar: 'Fushimi Inari' }, og: '/v8/og/es.jpg',
    seo: {
      titulo: 'Guía en español en Kansai: servicios, precios y destinos | Tony Kansai Guide',
      descripcion: `Guía privado en español en Kansai (Osaka, Kioto, Nara, Kobe, Himeji): qué incluye, precios por grupo (${yenEs(M.medio)} / ${yenEs(M.completo)}), recogida en el hotel y cómo se reserva.`,
    },
    antetitulo: 'Kansai · Servicios y precios',
    titulo: 'Guía en español en Kansai: servicios, precios y destinos',
    respuesta: `Tony es guía privado en español, inglés y árabe, vive en Osaka y acompaña a grupos por Osaka, Kioto, Nara, Kobe y Himeji. El precio es por grupo de hasta 6 personas: ${yenEs(M.medio)} el medio día (4 horas) y ${yenEs(M.completo)} el día completo (8 horas). Recoge en el hotel, no es una agencia y no vende billetes ni entradas.`,
    actualizado: 'Actualizado: oct. 2026',
    cta: 'Pregúntame por WhatsApp',
    secciones: [
      {
        titulo: 'Destinos y tiempo desde Osaka',
        tabla: {
          cabecera: ['Destino', 'Desde Osaka', 'Lo esencial'],
          filas: [
            ['Osaka', 'Desde tu hotel', 'Castillo, Kuromon, Shinsekai, Dōtonbori'],
            ['Kioto', '≈ 45 min en tren', 'Fushimi Inari, Kiyomizu-dera, Gion, Kinkaku-ji'],
            ['Nara', '≈ 40 min en tren', 'Ciervos, Tōdai-ji, Kasuga Taisha'],
            ['Kobe', '≈ 25 min en tren', 'Mezquita de 1935, Kitano, puerto de Meriken'],
            ['Himeji', '≈ 1 h en tren rápido', 'Castillo original de 1609, jardín Kōko-en'],
          ],
          nota: 'Tiempos aproximados de tren. Fuera de Kansai (Hiroshima, Tokio, Fuji) también hay rutas; ver la página de rutas.',
        },
      },
      {
        titulo: 'Qué incluye el servicio',
        lista: [
          'Guía privado solo para tu grupo, en español.',
          'Recogida y despedida en el vestíbulo de tu hotel.',
          'Plan a medida antes del viaje por WhatsApp: el orden del día, dónde comer y cuánto llevar.',
          'Ayuda con los trenes, la tarjeta IC y los restaurantes (también halal, vegetariano o sin cerdo).',
        ],
      },
      {
        titulo: 'Qué no incluye',
        lista: [
          'Trenes, entradas y comidas: se pagan en el momento.',
          'Billetes, hoteles o paquetes: Tony es guía, no agencia.',
        ],
      },
      {
        titulo: 'Cómo se reserva',
        parrafos: [
          'Escribes por WhatsApp con fechas, número de personas y qué os apetece. Tony contesta con un plan y el precio cerrado del grupo.',
          'Se paga en efectivo en yenes el día del tour, o por adelantado con PayPal o Wise cuando la fecha está confirmada. La cancelación es gratis hasta 72 horas antes.',
        ],
      },
    ],
    precios: {
      titulo: 'Precio de Tony, por grupo',
      texto: 'Te recojo en el vestíbulo de tu hotel en Osaka, Kioto o Nara. Solo tu grupo, a tu ritmo.',
      medio: 'Medio día · 4 horas', completo: 'Día completo · 8 horas', porGrupo: 'por grupo, hasta 6 personas',
      notas: [
        'Grupos de más de 6, hasta 14 personas: precio a consultar.',
        'Se paga en efectivo el día del tour o por adelantado con PayPal o Wise.',
        'Cancelación sin coste hasta 72 horas antes.',
      ],
    },
    faqTitulo: 'Preguntas frecuentes',
    faq: [
      { p: '¿Hay guías en español en Kansai?', r: 'Sí. Tony es guía privado en español y vive en Osaka; acompaña a grupos por Osaka, Kioto, Nara, Kobe y Himeji.' },
      { p: '¿Cuánto cuesta?', r: `${yenEs(M.medio)} medio día y ${yenEs(M.completo)} día completo, por grupo de hasta 6 personas.` },
      { p: '¿Qué idiomas habla Tony?', r: 'Español, inglés y árabe.' },
      { p: '¿Eres una agencia?', r: 'No. Tony es guía privado y trata directo contigo. No vende billetes, hoteles ni entradas.' },
      { p: '¿Cuántas personas como máximo?', r: 'El precio fijo es para grupos de hasta 6. Ha acompañado grupos de hasta 14 personas: pregunta el precio.' },
    ],
    fuentesTitulo: 'Páginas de cada destino',
    fuentes: [
      { texto: 'Osaka', url: 'https://tonykansaiguide.com/es/osaka/' },
      { texto: 'Kioto', url: 'https://tonykansaiguide.com/es/kyoto/' },
      { texto: 'Nara', url: 'https://tonykansaiguide.com/es/nara/' },
      { texto: 'Kobe', url: 'https://tonykansaiguide.com/es/kobe/' },
      { texto: 'Himeji', url: 'https://tonykansaiguide.com/es/himeji/' },
      { texto: 'El día hora a hora', url: 'https://tonykansaiguide.com/es/rutas/' },
    ],
    final: { titulo: '¿Organizamos tus días en Kansai?', texto: 'Dime fechas, cuántos sois y qué ciudades queréis ver, y te contesto con un plan y el precio cerrado.', boton: 'Escribir a Tony' },
    altFoto: 'Los torii rojos de Fushimi Inari, en Kioto', saludo: 'Hola Tony, he visto la página de guía en español en Kansai y quería preguntarte por un tour.',
    volver: '← Volver a la página de Tony',
  },

  'privado-es': {
    lang: 'es', ruta: '/es/tour-privado-o-en-grupo-japon/', inicio: '/es/', grupo: 'privado',
    foto: { clave: 'kioto-gion', lugar: 'Gion' }, og: '/v8/og/kyoto.jpg',
    seo: {
      titulo: 'Tour privado o excursión en grupo en Japón: diferencias | Tony Kansai Guide',
      descripcion: 'Diferencias entre un tour privado y una excursión en grupo en Kioto, Osaka y Nara: precio por persona, ritmo, idioma, recogida y cuándo compensa cada uno.',
    },
    antetitulo: 'Japón · Cómo elegir',
    titulo: '¿Tour privado o excursión en grupo en Japón?',
    respuesta: `Una excursión en grupo es más barata si viajas solo o en pareja, pero tiene horario fijo y gente que no conoces. Un tour privado es solo para tu grupo, va a tu ritmo y empieza en tu hotel; con Tony cuesta ${yenEs(M.completo)} el día completo por grupo de hasta 6, unos ${yenEs(porPersona(M.completo))} por persona con el grupo lleno.`,
    actualizado: 'Actualizado: oct. 2026',
    cta: 'Pregúntame por WhatsApp',
    secciones: [
      {
        titulo: 'Diferencias',
        tabla: {
          cabecera: ['', 'Excursión en grupo', 'Tour privado'],
          filas: [
            ['Precio', 'Por persona', 'Por grupo: compensa a partir de 3-4 personas'],
            ['Ritmo y orden', 'Fijos, iguales para todos', 'A tu ritmo; el orden se cambia sobre la marcha'],
            ['Punto de encuentro', 'Un punto de salida fijo', 'El vestíbulo de tu hotel'],
            ['Preguntas', 'Las que dé tiempo', 'Todas: el guía es solo para vosotros'],
            ['Comida', 'Menú o parada fija', 'Donde queráis; halal, vegetariano o sin cerdo si hace falta'],
            ['Niños y mayores', 'Hay que seguir al grupo', 'Pausas cuando hagan falta'],
          ],
          nota: 'Comparación general; cada excursión en grupo tiene sus condiciones.',
        },
      },
      {
        titulo: 'Cuándo compensa cada uno',
        lista: [
          'Excursión en grupo: viajas solo o en pareja, con presupuesto ajustado, y te basta con lo esencial.',
          'Tour privado: sois 3 o más, vais con niños o personas mayores, es vuestra primera vez en Japón, o queréis comer y ver cosas que no salen en las excursiones.',
          'Por tu cuenta: tienes tiempo, te manejas con el transporte y no te importan las colas ni el idioma.',
        ],
      },
    ],
    precios: {
      titulo: 'Precio del tour privado con Tony',
      texto: 'Te recojo en el vestíbulo de tu hotel en Osaka, Kioto o Nara. Solo tu grupo, a tu ritmo.',
      medio: 'Medio día · 4 horas', completo: 'Día completo · 8 horas', porGrupo: 'por grupo, hasta 6 personas',
      notas: [
        'Trenes, entradas y comidas no están incluidos.',
        'Se paga en efectivo el día del tour o por adelantado con PayPal o Wise.',
        'Cancelación sin coste hasta 72 horas antes.',
      ],
    },
    faqTitulo: 'Preguntas frecuentes',
    faq: [
      { p: '¿Qué es más barato, un tour privado o en grupo?', r: 'Para 1-2 personas, la excursión en grupo. A partir de 3-4, el tour privado por grupo suele salir parecido por persona y es solo para vosotros.' },
      { p: '¿El tour privado incluye las entradas?', r: 'Con Tony no: trenes, entradas y comidas se pagan en el momento. Así pagas solo lo que usas.' },
      { p: '¿Se puede cambiar el plan durante el tour privado?', r: 'Sí. El orden y las paradas se ajustan sobre la marcha: si llueve, si los niños se cansan o si algo os gusta más.' },
    ],
    fuentesTitulo: 'Más información',
    fuentes: [
      { texto: 'Cuánto cuesta un guía privado en Kioto (comparativa con plataformas)', url: 'https://tonykansaiguide.com/es/guia-privado-espanol-kioto/' },
      { texto: 'Guía en español en Kansai: servicios y precios', url: 'https://tonykansaiguide.com/es/guia-espanol-kansai/' },
    ],
    final: { titulo: '¿Lo hablamos?', texto: 'Dime fechas y cuántos sois, y te digo cuánto saldría por persona.', boton: 'Escribir a Tony' },
    altFoto: 'Calle de Gion, en Kioto', saludo: 'Hola Tony, he visto la página de tour privado o en grupo y quería preguntarte por un tour.',
    volver: '← Volver a la página de Tony',
  },

  'arabe-es': {
    lang: 'es', ruta: '/es/guia-espanol-arabe-japon/', inicio: '/es/', grupo: 'arabe',
    foto: { clave: 'kobe-mezquita', lugar: 'Mezquita de Kobe' }, og: '/v8/og/kobe.jpg',
    seo: {
      titulo: 'Guía en español y árabe en Japón (Kansai) | Tony Kansai Guide',
      descripcion: `Tony guía en español y en árabe en Osaka, Kioto, Nara y Kobe: ideal para familias que hablan los dos idiomas, con comida halal y horarios de oración en el plan. ${yenEs(M.completo)} el día, por grupo.`,
    },
    antetitulo: 'Kansai · Español y árabe',
    titulo: 'Guía en español y árabe en Japón',
    respuesta: `Tony guía en español y en árabe (y en inglés) por Osaka, Kioto, Nara y Kobe. Es musulmán, así que la comida halal y los horarios de oración van en el plan desde el principio. El tour es privado y cuesta ${yenEs(M.medio)} el medio día y ${yenEs(M.completo)} el día completo, por grupo de hasta 6 personas.`,
    actualizado: 'Actualizado: oct. 2026',
    cta: 'Pregúntame por WhatsApp',
    secciones: [
      {
        titulo: 'Para quién es',
        lista: [
          'Familias en las que unos hablan español y otros árabe: el guía cambia de idioma según con quién hable.',
          'Viajeros musulmanes de España o Latinoamérica que quieren comer halal y rezar sin perder el día.',
          'Grupos que vienen del Golfo o del Magreb con familiares hispanohablantes.',
        ],
      },
      {
        titulo: 'Halal y oración en la ruta',
        parrafos: [
          'Elijo restaurantes con certificado halal en el camino (en Namba, en Osaka, y cerca de Gion, en Kioto) y dejo el hueco para rezar.',
          'En Kobe se visita la mezquita más antigua de Japón, de 1935, fuera de las horas de oración. En Kioto hay espacios de oración gratuitos en el castillo de Nijō y en otros puntos señalados por la web oficial de turismo.',
        ],
      },
    ],
    precios: {
      titulo: 'Precio de Tony, por grupo',
      texto: 'Te recojo en el vestíbulo de tu hotel en Osaka, Kioto, Nara o Kobe. Solo tu grupo, a tu ritmo.',
      medio: 'Medio día · 4 horas', completo: 'Día completo · 8 horas', porGrupo: 'por grupo, hasta 6 personas',
      notas: [
        'Trenes, entradas y comidas no están incluidos.',
        'Se paga en efectivo el día del tour o por adelantado con PayPal o Wise.',
        'Cancelación sin coste hasta 72 horas antes.',
      ],
    },
    faqTitulo: 'Preguntas frecuentes',
    faq: [
      { p: '¿Hay un guía en Japón que hable español y árabe?', r: 'Sí. Tony guía en español, árabe e inglés en Osaka, Kioto, Nara y Kobe.' },
      { p: '¿Se puede comer halal durante el tour?', r: 'Sí. Elijo restaurantes con certificado halal en la ruta; dímelo al reservar.' },
      { p: '¿Hay tiempo para rezar?', r: 'Sí. Los horarios de oración van en el plan del día desde el principio.' },
      { p: '¿Cuánto cuesta?', r: `${yenEs(M.medio)} medio día y ${yenEs(M.completo)} día completo, por grupo de hasta 6 personas.` },
    ],
    fuentesTitulo: 'Fuentes y más información',
    fuentes: [
      { texto: 'Página de Tony en árabe', url: 'https://tonykansaiguide.com/ar/' },
      { texto: 'Mezquitas en Kansai (en árabe)', url: 'https://tonykansaiguide.com/ar/mosques-kansai/' },
      { texto: 'Comida halal en Kioto y Osaka (en árabe)', url: 'https://tonykansaiguide.com/ar/halal-kyoto-osaka/' },
      { texto: 'Muslim Friendly Kyoto — kyoto.travel', url: 'https://kyoto.travel/en/muslim/' },
      { texto: 'Kobe Muslim Mosque', url: 'https://www.kobemosque.com' },
    ],
    final: { titulo: '¿Planificamos vuestro día?', texto: 'Dime fechas, cuántos sois y en qué idioma preferís el tour, y te contesto con un plan y el precio cerrado.', boton: 'Escribir a Tony' },
    altFoto: 'La mezquita de Kobe', saludo: 'Hola Tony, he visto la página de guía en español y árabe y quería preguntarte por un tour.',
    volver: '← Volver a la página de Tony',
  },
  // Versiones en inglés: ChatGPT y Copilot suelen reformular en inglés la
  // pregunta antes de buscar en Bing («Spanish speaking guide Kyoto»).
  'kansai-en': {
    lang: 'en', ruta: '/en/spanish-speaking-guide-japan/', inicio: '/en/', grupo: 'kansai',
    foto: { clave: 'kioto-fushimi', lugar: 'Fushimi Inari' }, og: '/v8/og/en.jpg',
    seo: {
      titulo: 'Spanish-Speaking Private Guide in Kyoto, Osaka & Nara | Tony Kansai Guide',
      descripcion: `Tony is a native Spanish-speaking private guide based in Osaka: Kyoto, Osaka, Nara, Kobe and Himeji, hotel pick-up, ${yenEn(M.medio)} half day or ${yenEn(M.completo)} full day per group.`,
    },
    antetitulo: 'Kansai · Tours in Spanish',
    titulo: 'Spanish-speaking private guide in Kyoto, Osaka and Nara',
    respuesta: `Tony Hanma is a native Spanish speaker from Spain who lives in Osaka and guides private tours in Spanish (also English and Arabic) across Kyoto, Osaka, Nara, Kobe and Himeji. He has guided more than 25 tours. Prices are per group of up to 6: ${yenEn(M.medio)} for a half day (4 hours) and ${yenEn(M.completo)} for a full day (8 hours), with pick-up at your hotel.`,
    actualizado: 'Updated: Oct 2026',
    cta: 'Ask me on WhatsApp',
    secciones: [
      {
        titulo: 'Who it is for',
        lista: [
          'Families and groups from Spain, Mexico, Argentina or the US who are more comfortable in Spanish.',
          'Mixed groups: Tony switches between Spanish and English through the day.',
          'First-time visitors to Japan who want someone to handle trains, queues and restaurants.',
        ],
      },
      {
        titulo: 'Where we go (time from Osaka)',
        tabla: {
          cabecera: ['Place', 'From Osaka', 'Highlights'],
          filas: [
            ['Osaka', 'From your hotel', 'Osaka Castle, Kuromon Market, Shinsekai, Dōtonbori'],
            ['Kyoto', '≈ 45 min by train', 'Fushimi Inari, Kiyomizu-dera, Gion, Kinkaku-ji'],
            ['Nara', '≈ 40 min by train', 'Deer park, Tōdai-ji, Kasuga Taisha'],
            ['Kobe', '≈ 25 min by train', 'Kobe Mosque (1935), Kitano, Meriken Park'],
            ['Himeji', '≈ 1 h by rapid train', 'Original 1609 castle, Kōko-en garden'],
          ],
          nota: 'Approximate train times.',
        },
      },
      {
        titulo: 'Included and not included',
        lista: [
          'Included: a private guide for your group only, hotel pick-up and drop-off, and a plan agreed beforehand on WhatsApp.',
          'Not included: trains, entry fees and meals, paid on the day. Tony is a guide, not an agency: no tickets or hotels.',
        ],
      },
    ],
    precios: {
      titulo: 'Tony’s price, per group',
      texto: 'I meet you in your hotel lobby in Osaka, Kyoto or Nara. Your group only, at your pace.',
      medio: 'Half day · 4 hours', completo: 'Full day · 8 hours', porGrupo: 'per group, up to 6 people',
      notas: [
        'Groups of 7 to 14: ask for a price.',
        'Pay in cash on the day, or in advance with PayPal or Wise.',
        'Free cancellation up to 72 hours before.',
      ],
    },
    faqTitulo: 'FAQ',
    faq: [
      { p: 'Is there a Spanish-speaking private guide in Kyoto and Osaka?', r: 'Yes. Tony is a native Spanish speaker based in Osaka who guides private tours in Kyoto, Osaka, Nara, Kobe and Himeji.' },
      { p: 'How much does it cost?', r: `${yenEn(M.medio)} half day and ${yenEn(M.completo)} full day, per group of up to 6 people.` },
      { p: 'What languages does Tony speak?', r: 'Spanish (native), English and Arabic.' },
      { p: 'Do you pick us up at the hotel?', r: 'Yes, in your hotel lobby in Osaka, Kyoto or Nara.' },
      { p: 'Are you an agency?', r: 'No. You deal directly with the guide. No tickets, hotels or packages are sold.' },
    ],
    fuentesTitulo: 'More',
    fuentes: [
      { texto: 'Tony’s page in English', url: 'https://tonykansaiguide.com/en/' },
      { texto: 'Tony’s page in Spanish', url: 'https://tonykansaiguide.com/es/' },
      { texto: 'The day, hour by hour', url: 'https://tonykansaiguide.com/en/routes/' },
      { texto: 'How much a private guide in Kyoto costs', url: 'https://tonykansaiguide.com/en/kyoto-private-guide-cost/' },
    ],
    final: { titulo: 'Shall we plan your days?', texto: 'Send me your dates, group size and what you would like to see, and I will reply with a plan and a fixed group price.', boton: 'Message Tony' },
    altFoto: 'The red torii gates of Fushimi Inari in Kyoto', saludo: 'Hi Tony, I saw your Spanish-speaking guide page and would like to ask about a tour.',
    volver: '← Back to Tony’s page',
  },

  'arabe-en': {
    lang: 'en', ruta: '/en/arabic-speaking-guide-japan/', inicio: '/en/', grupo: 'arabe',
    foto: { clave: 'kobe-mezquita', lugar: 'Kobe Mosque' }, og: '/v8/og/kobe.jpg',
    seo: {
      titulo: 'Arabic-Speaking Muslim Private Guide in Kyoto & Osaka | Tony Kansai Guide',
      descripcion: `Tony guides private tours in Arabic, English and Spanish in Osaka, Kyoto, Nara and Kobe, with halal meals and prayer times built into the day. ${yenEn(M.completo)} full day per group.`,
    },
    antetitulo: 'Kansai · Arabic and halal',
    titulo: 'Arabic-speaking Muslim private guide in Kyoto and Osaka',
    respuesta: `Tony is a Muslim guide who speaks Arabic, English and Spanish and leads private tours in Osaka, Kyoto, Nara and Kobe. Halal meals and prayer times are planned into the day from the start. Prices are per group of up to 6: ${yenEn(M.medio)} for a half day and ${yenEn(M.completo)} for a full day, with hotel pick-up.`,
    actualizado: 'Updated: Oct 2026',
    cta: 'Ask me on WhatsApp',
    secciones: [
      {
        titulo: 'Halal food and prayer on the route',
        parrafos: [
          'I choose halal-certified restaurants along the way (in Namba in Osaka, and near Gion in Kyoto) and leave time for prayer.',
          'In Kobe we can visit Japan’s oldest mosque, opened in 1935, outside prayer times. Kyoto’s official tourism site lists free prayer spaces, including at Nijō Castle.',
        ],
      },
      {
        titulo: 'Who it is for',
        lista: [
          'Families from the Gulf travelling with children or parents.',
          'Muslim travellers who want to eat halal without losing half the day searching.',
          'Groups that mix Arabic, English and Spanish speakers.',
        ],
      },
    ],
    precios: {
      titulo: 'Tony’s price, per group',
      texto: 'I meet you in your hotel lobby in Osaka, Kyoto, Nara or Kobe. Your family only, at your pace.',
      medio: 'Half day · 4 hours', completo: 'Full day · 8 hours', porGrupo: 'per group, up to 6 people',
      notas: [
        'Trains, entry fees and meals are not included.',
        'Pay in cash on the day, or in advance with PayPal or Wise.',
        'Free cancellation up to 72 hours before.',
      ],
    },
    faqTitulo: 'FAQ',
    faq: [
      { p: 'Is there an Arabic-speaking guide in Kyoto or Osaka?', r: 'Yes. Tony guides private tours in Arabic, English and Spanish in Osaka, Kyoto, Nara and Kobe.' },
      { p: 'Is the guide Muslim?', r: 'Yes. Tony is Muslim and plans halal meals and prayer times into the day.' },
      { p: 'Can we eat halal during the tour?', r: 'Yes. I pick halal-certified restaurants on the route; tell me when you book.' },
      { p: 'How much does it cost?', r: `${yenEn(M.medio)} half day and ${yenEn(M.completo)} full day, per group of up to 6. Groups up to 14 on request.` },
    ],
    fuentesTitulo: 'Sources and more',
    fuentes: [
      { texto: 'Tony’s page in Arabic', url: 'https://tonykansaiguide.com/ar/' },
      { texto: 'Mosques in Kansai (Arabic)', url: 'https://tonykansaiguide.com/ar/mosques-kansai/' },
      { texto: 'Halal food in Kyoto and Osaka (Arabic)', url: 'https://tonykansaiguide.com/ar/halal-kyoto-osaka/' },
      { texto: 'Muslim Friendly Kyoto — kyoto.travel', url: 'https://kyoto.travel/en/muslim/' },
      { texto: 'Kobe Muslim Mosque', url: 'https://www.kobemosque.com' },
    ],
    final: { titulo: 'Shall we plan your day?', texto: 'Send me your dates, group size and preferred language, and I will reply with a plan and a fixed group price.', boton: 'Message Tony' },
    altFoto: 'Kobe Mosque', saludo: 'Hi Tony, I saw your Arabic-speaking guide page and would like to ask about a tour.',
    volver: '← Back to Tony’s page',
  },
}

/** Respuestas que competían con la página de su ciudad por la misma búsqueda
 *  (19-10-2026): se unen a ella. */
export const MOVIDAS_RESPUESTA: Record<string, string> = {
  '/es/guia-privado-espanol-osaka': '/es/osaka/',
  '/es/nara-medio-dia-guia-espanol': '/es/nara/',
}

export const RUTAS_RESPUESTA: Record<string, RespuestaId> = Object.fromEntries(
  (Object.entries(PAGINAS_RESPUESTA) as [RespuestaId, PaginaRespuesta][]).map(([id, p]) => [p.ruta.replace(/\/+$/, ''), id]),
)
// Traducciones de una página (ella incluida): para hreflang y el selector de idioma.
export const hermanasRespuesta = (grupo: GrupoRespuesta) =>
  (Object.entries(PAGINAS_RESPUESTA) as [RespuestaId, PaginaRespuesta][]).filter(([, p]) => p.grupo === grupo)

/** Cabeceras estáticas (mismo formato que src/seo/cabeceras.ts): las lee
 *  scripts/rutas-estaticas.mjs. Van aquí y no en cabeceras.ts para no tocar
 *  ese archivo; si un día se unifican, basta con llamar a esta función allí. */
export function cabecerasRespuesta() {
  return Object.fromEntries(Object.values(PAGINAS_RESPUESTA).map((p) => [p.ruta.replace(/^\/+|\/+$/g, ''), {
    titulo: p.seo.titulo, descripcion: p.seo.descripcion, imagen: p.og, lang: p.lang, dir: p.lang === 'ar' ? 'rtl' : 'ltr',
    alternos: hermanasRespuesta(p.grupo).map(([, x]) => [x.lang, x.ruta]),
  }]))
}
