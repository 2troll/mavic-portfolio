// Página de montaña: para quien ya conoce Kioto y Osaka y vuelve a Japón
// buscando algo distinto. Una página por idioma, con su propio enlace para
// anuncios. Los datos de cada ruta (altura, horarios, equipo) salen de
// HIKING_ROUTES en data.ts y se traducen con el diccionario de siempre.

import type { GuiaId } from './contenido'

export type MontanaId = 'm-es' | 'm-en' | 'm-ar' | 'm-ru'

/** Las ocho rutas con relieve horneado (scripts/hornear-montes.py). */
export const MONTES = ['mt-kongo', 'mt-atago', 'mt-hiei', 'mt-rokko', 'mt-maya', 'mt-yoshino', 'ponpon-mountain', 'hoshi-no-buranko'] as const
export type MonteId = (typeof MONTES)[number]

/** Nombre del monte en japonés, como acento junto al nombre. */
export const KANJI: Record<MonteId, string> = {
  'mt-kongo': '金剛山', 'mt-atago': '愛宕山', 'mt-hiei': '比叡山', 'mt-rokko': '六甲山',
  'mt-maya': '摩耶山', 'mt-yoshino': '吉野山', 'ponpon-mountain': 'ポンポン山', 'hoshi-no-buranko': '星のブランコ',
}

export interface PaginaMontana {
  id: MontanaId
  lang: 'es' | 'en' | 'ar' | 'ru'
  dir: 'ltr' | 'rtl'
  ruta: string
  guias: GuiaId[]
  seo: { titulo: string; descripcion: string }
  intro: { antetitulo: string; titulo: string; sub: string; baja: string }
  et: { altitud: string; subida: string; total: string; dificultad: string; epoca: string; llevar: string; pedir: string; porGrupo: string; ciudad: string; fuente: string }
  oficio: { titulo: string; puntos: { t: string; d: string }[] }
  final: { titulo: string; sub: string; escribir: (nombre: string) => string }
  saludo: (guia: string, ruta: string) => string
}

export const MONTANA: Record<MontanaId, PaginaMontana> = {
  'm-es': {
    id: 'm-es', lang: 'es', dir: 'ltr', ruta: '/es/montana/', guias: ['tony'],
    seo: {
      titulo: 'Rutas de montaña con guía en Kansai — para quien vuelve a Japón | Tony Kansai Guide',
      descripcion: 'Ocho rutas de montaña con guía privado en español alrededor de Osaka, Kioto, Nara y Kobe: Kongō, Atago, Hiei, Rokkō, Yoshino… Para quien ya conoce las ciudades y quiere algo distinto.',
    },
    intro: {
      antetitulo: 'Para quien vuelve a Japón',
      titulo: 'Ya conoces Kioto. Ahora, sube a sus montañas.',
      sub: 'Ocho rutas con guía alrededor de Osaka, Kioto, Nara y Kobe. Santuarios en la cima, senderos casi vacíos entre semana y la ciudad entera a tus pies.',
      baja: 'Baja para recorrerlas',
    },
    et: { altitud: 'Altitud', subida: 'Subida', total: 'Día completo', dificultad: 'Dificultad', epoca: 'Mejor época', llevar: 'Qué llevar', pedir: 'Quiero esta ruta', porGrupo: 'por grupo', ciudad: 'Tours por la ciudad', fuente: 'Relieve y foto aérea: 出典 国土地理院 (Instituto Geográfico de Japón)' },
    oficio: {
      titulo: 'Cómo trabajamos en la montaña',
      puntos: [
        { t: 'Miramos el tiempo la víspera', d: 'Si la montaña no es segura, cambiamos la fecha o te devolvemos la señal. Decide el guía, sin discusión.' },
        { t: 'Rutas que ya hemos caminado', d: 'Cada ficha dice cómo se llega, cuánto se tarda en cada tramo y qué llevar. Sin improvisar.' },
        { t: 'Botiquín y navegación', d: 'El guía lleva botiquín y la ruta cargada. Vamos al ritmo del más lento del grupo.' },
        { t: 'Dificultad honesta', d: 'Las rutas Difícil, Técnica y Solo expertos son para mayores de 18. Si dudas, empieza por una Moderada.' },
        { t: 'Por escrito', d: 'Para rutas difíciles o grupos de más de 4 firmamos un contrato sencillo: ruta, fecha y precio.' },
        { t: 'Seguro de viaje', d: 'Te recomendamos uno que cubra senderismo. Es barato y en la montaña es lo sensato.' },
      ],
    },
    final: { titulo: '¿Cuál te llama?', sub: 'Escríbenos con la ruta, la fecha y cuántos sois. Te contestamos con el plan y el precio cerrado.', escribir: (n) => `Escribir a ${n}` },
    saludo: (g, r) => `Hola ${g}, te escribo desde la página de montaña.\n\nMe interesa: ${r}\nFechas:\nPersonas:\nVenimos de:`,
  },
  'm-en': {
    id: 'm-en', lang: 'en', dir: 'ltr', ruta: '/en/hiking/', guias: ['tony', 'larion'],
    seo: {
      titulo: 'Guided mountain hikes in Kansai — for your second trip to Japan | Tony Kansai Guide',
      descripcion: 'Eight guided mountain routes around Osaka, Kyoto, Nara and Kobe: Kongō, Atago, Hiei, Rokkō, Yoshino and more. For travellers who already know the cities and want something new.',
    },
    intro: {
      antetitulo: 'For your second trip to Japan',
      titulo: 'You know Kyoto. Now climb its mountains.',
      sub: 'Eight guided routes around Osaka, Kyoto, Nara and Kobe. Shrines on the summits, trails that are nearly empty on weekdays, and the whole city at your feet.',
      baja: 'Scroll to walk them',
    },
    et: { altitud: 'Altitude', subida: 'Ascent', total: 'Full day', dificultad: 'Difficulty', epoca: 'Best season', llevar: 'What to bring', pedir: 'I want this route', porGrupo: 'per group', ciudad: 'City tours', fuente: 'Terrain and aerial photo: 出典 国土地理院 (Geospatial Information Authority of Japan)' },
    oficio: {
      titulo: 'How we work in the mountains',
      puntos: [
        { t: 'We check the weather the day before', d: 'If the mountain isn\'t safe, we move the date or refund your deposit. The guide decides — no debate.' },
        { t: 'Routes we have walked', d: 'Each route sheet says how to get there, how long each stretch takes and what to bring. Nothing improvised.' },
        { t: 'First-aid kit and navigation', d: 'The guide carries a first-aid kit and the route loaded. We go at the pace of the slowest in the group.' },
        { t: 'Honest grading', d: 'Hard, Technical and Expert Only routes are for over-18s. If in doubt, start with a Moderate one.' },
        { t: 'In writing', d: 'For hard routes or groups of more than 4, we sign a simple contract: route, date and price.' },
        { t: 'Travel insurance', d: 'We recommend one that covers hiking. It\'s cheap, and in the mountains it\'s the sensible thing.' },
      ],
    },
    final: { titulo: 'Which one calls you?', sub: 'Send us the route, the date and how many of you there are. We reply with the plan and a fixed price.', escribir: (n) => `Message ${n}` },
    saludo: (g, r) => `Hi ${g}, I'm writing from the hiking page.\n\nInterested in: ${r}\nDates:\nPeople:\nTravelling from:`,
  },
  'm-ar': {
    id: 'm-ar', lang: 'ar', dir: 'rtl', ruta: '/ar/hiking/', guias: ['tony'],
    seo: {
      titulo: 'رحلات جبلية مع مرشد في كانساي — لزيارتك الثانية لليابان | Tony Kansai Guide',
      descripcion: 'ثمانية مسارات جبلية مع مرشد خاص يتحدث العربية حول أوساكا وكيوتو ونارا وكوبي: كونغو وأتاغو وهيئي وروكّو ويوشينو. لمن يعرف المدن ويريد شيئاً جديداً.',
    },
    intro: {
      antetitulo: 'لزيارتك الثانية لليابان',
      titulo: 'تعرف كيوتو. الآن اصعد إلى جبالها.',
      sub: 'ثمانية مسارات مع مرشد حول أوساكا وكيوتو ونارا وكوبي. أضرحة على القمم، ودروب شبه خالية في أيام الأسبوع، والمدينة كلها تحت قدميك.',
      baja: 'مرّر للأسفل لتسلكها',
    },
    et: { altitud: 'الارتفاع', subida: 'الصعود', total: 'يوم كامل', dificultad: 'الصعوبة', epoca: 'أفضل موسم', llevar: 'ماذا تحمل', pedir: 'أريد هذا المسار', porGrupo: 'للمجموعة', ciudad: 'جولات المدينة', fuente: 'التضاريس والصورة الجوية: 出典 国土地理院 (هيئة المعلومات الجغرافية اليابانية)' },
    oficio: {
      titulo: 'كيف نعمل في الجبل',
      puntos: [
        { t: 'نراجع الطقس قبل يوم', d: 'إن لم يكن الجبل آمناً نغيّر الموعد أو نعيد العربون. القرار للمرشد بلا نقاش.' },
        { t: 'مسارات سلكناها بأنفسنا', d: 'كل بطاقة تقول كيف نصل، وكم يستغرق كل جزء، وماذا نحمل. بلا ارتجال.' },
        { t: 'حقيبة إسعاف وملاحة', d: 'يحمل المرشد حقيبة إسعافات أولية والمسار محمّلاً. نسير بإيقاع أبطأ شخص في المجموعة.' },
        { t: 'تصنيف صادق للصعوبة', d: 'المسارات الصعبة والتقنية ولِلخبراء فقط لمن تجاوزوا ١٨ عاماً. إن تردّدت فابدأ بمسار متوسط.' },
        { t: 'كتابةً', d: 'للمسارات الصعبة أو المجموعات الأكبر من ٤ نوقّع عقداً بسيطاً: المسار والتاريخ والسعر.' },
        { t: 'تأمين السفر', d: 'ننصحك بتأمين يغطي المشي في الجبال. سعره زهيد، وفي الجبل هو التصرّف الحكيم.' },
      ],
    },
    final: { titulo: 'أيّها يناديك؟', sub: 'أرسل لنا المسار والتاريخ وعددكم، ونرد عليك بالخطة وسعر ثابت.', escribir: (n) => `راسل ${n}` },
    saludo: (g, r) => `السلام عليكم يا ${g}، أراسلك من صفحة الجبال.\n\nأهتم بـ: ${r}\nالتواريخ:\nعدد الأشخاص:\nقادمون من:`,
  },
  'm-ru': {
    id: 'm-ru', lang: 'ru', dir: 'ltr', ruta: '/ru/hiking/', guias: ['larion'],
    seo: {
      titulo: 'Горные походы с гидом в Кансае — для второй поездки в Японию | Tony Kansai Guide',
      descripcion: 'Восемь горных маршрутов с частным гидом на русском вокруг Осаки, Киото, Нары и Кобе: Конго, Атаго, Хиэй, Рокко, Ёсино. Для тех, кто уже видел города и хочет нового.',
    },
    intro: {
      antetitulo: 'Для второй поездки в Японию',
      titulo: 'Киото вы уже видели. Теперь поднимитесь в его горы.',
      sub: 'Восемь маршрутов с гидом вокруг Осаки, Киото, Нары и Кобе. Святилища на вершинах, почти пустые тропы в будни и весь город у ваших ног.',
      baja: 'Листайте вниз, чтобы пройти их',
    },
    et: { altitud: 'Высота', subida: 'Подъём', total: 'Целый день', dificultad: 'Сложность', epoca: 'Лучший сезон', llevar: 'Что взять', pedir: 'Хочу этот маршрут', porGrupo: 'за группу', ciudad: 'Экскурсии по городу', fuente: 'Рельеф и аэрофото: 出典 国土地理院 (Институт геоинформации Японии)' },
    oficio: {
      titulo: 'Как мы работаем в горах',
      puntos: [
        { t: 'Смотрим погоду накануне', d: 'Если в горах небезопасно, переносим дату или возвращаем предоплату. Решает гид, без споров.' },
        { t: 'Маршруты, которые мы прошли сами', d: 'В каждой карточке — как добраться, сколько идти каждый участок и что взять. Без импровизации.' },
        { t: 'Аптечка и навигация', d: 'У гида с собой аптечка и загруженный маршрут. Идём в темпе самого медленного в группе.' },
        { t: 'Честная сложность', d: 'Сложные, технические маршруты и «только для опытных» — с 18 лет. Если сомневаетесь, начните со средней.' },
        { t: 'Письменно', d: 'Для сложных маршрутов или групп больше 4 человек подписываем простой договор: маршрут, дата и цена.' },
        { t: 'Страховка', d: 'Советуем страховку, покрывающую походы. Она недорогая, а в горах это разумно.' },
      ],
    },
    final: { titulo: 'Какой маршрут ваш?', sub: 'Напишите маршрут, дату и сколько вас. Ответим планом и фиксированной ценой.', escribir: (n) => `Написать: ${n}` },
    saludo: (g, r) => `Здравствуйте, ${g}! Пишу со страницы походов.\n\nИнтересует: ${r}\nДаты:\nСколько человек:\nОткуда:`,
  },
}

/** La página de ciudad de cada idioma, para el enlace de vuelta. */
export const CIUDAD: Record<MontanaId, string> = { 'm-es': '/es/', 'm-en': '/en/', 'm-ar': '/ar/', 'm-ru': '/ru/' }
