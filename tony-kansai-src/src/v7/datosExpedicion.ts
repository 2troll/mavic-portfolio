// La página de montaña en clave de revista de naturaleza: portada con foto,
// atlas de Kansai y fichas de campo. Todo con datos reales:
//  · fotos de Wikimedia Commons (licencias libres, autor en CREDITOS);
//  · mapa de Natural Earth (dominio público), con la proyección de abajo;
//  · cortes del terreno sacados de los DEM del 国土地理院 que ya usa el 3D
//    (fila oeste–este que pasa por la cima, ~6 km, 96 muestras).
// Los meses y el nivel salen de bestSeason y grade de HIKING_ROUTES: si cambian allí, cambiar aquí.

import datos from './expedicion.json'
import type { MonteId } from './datosMontana'

export const MAPA = datos.mapa as { ancho: number; alto: number; caja: [number, number, number, number]; tierra: string; lago: string }
export const PERFIL = datos.perfiles as Record<MonteId, number[]>
export const CREDITOS = datos.creditos as Record<MonteId | 'portada', { titulo: string; autor: string; licencia: string; pagina: string }>

/** Lon/lat → coordenadas del SVG del mapa (misma proyección que el horneado). */
export function proyecta(lon: number, lat: number): [number, number] {
  const [o, e, s, n] = MAPA.caja
  return [((lon - o) / (e - o)) * MAPA.ancho, ((n - lat) / (n - s)) * MAPA.alto]
}

export const CIUDADES: { id: 'osaka' | 'kioto' | 'kobe' | 'nara'; lat: number; lon: number }[] = [
  { id: 'osaka', lat: 34.6937, lon: 135.5023 },
  { id: 'kioto', lat: 35.0116, lon: 135.7681 },
  { id: 'kobe', lat: 34.6901, lon: 135.1955 },
  { id: 'nara', lat: 34.6851, lon: 135.8048 },
]

/** Meses buenos (1-12), de bestSeason. */
export const MESES: Record<MonteId, number[]> = {
  'mt-kongo': [4, 5, 6, 9, 10, 11],
  'mt-atago': [4, 5, 6, 9, 10, 11],
  'mt-hiei': [4, 5, 6, 7, 8, 9, 10, 11],
  'mt-rokko': [4, 5, 6, 9, 10, 11],
  'mt-maya': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  'mt-yoshino': [4, 10, 11],
  'ponpon-mountain': [3, 4, 5, 9, 10, 11],
  'hoshi-no-buranko': [3, 4, 5, 6, 9, 10, 11, 12],
}

/** Exigencia de 1 a 5, de grade: Moderate/Medium = 2, Medium–High = 3, Hard = 4. */
export const NIVEL: Record<MonteId, number> = {
  'mt-kongo': 2, 'mt-atago': 4, 'mt-hiei': 2, 'mt-rokko': 2,
  'mt-maya': 2, 'mt-yoshino': 2, 'ponpon-mountain': 3, 'hoshi-no-buranko': 2,
}

export type Lengua = 'es' | 'en' | 'ar' | 'ru'

export interface TextosExpedicion {
  cabecera: string
  portada: { titulo: string; sub: string; cifras: [string, string, string, string]; baja: string; foto: string }
  atlas: { kicker: string; titulo: string; sub: string; alturas: string; calendario: string; ver3d: string; pide: string; mapaNota: string }
  vuelo: { kicker: string; titulo: string; sub: string; cargando: string; girar: string; parar: string; sinWebgl: string }
  ciudades: Record<'osaka' | 'kioto' | 'kobe' | 'nara', string>
  ficha: { corte: string; exigencia: string; meses: string }
  relieve: { titulo: string; sub: string }
  foto: string
}

export const EXP: Record<Lengua, TextosExpedicion> = {
  es: {
    cabecera: 'Expediciones · Kansai',
    portada: {
      titulo: 'Kansai, en vertical',
      sub: 'Dieciocho rutas de montaña entre Osaka, Kioto, Nara y Kobe, de la cima sagrada al ultra de 32 km. Desnivel real, senderos que casi ningún extranjero pisa y guía privado en español.',
      cifras: ['rutas', 'metros, la cima más alta', 'prefecturas', 'personas por grupo, máx.'],
      baja: 'Abrir el atlas',
      foto: 'Monte Atago desde el sur',
    },
    atlas: {
      kicker: 'Atlas de campo',
      titulo: 'Dónde está cada cumbre',
      sub: 'Toca un monte en el mapa o en el gráfico: verás su foto, su corte del terreno y cuándo conviene subir.',
      alturas: 'Altura de cada cima',
      calendario: 'Mejores meses',
      ver3d: 'Verlo en relieve 3D',
      pide: 'Pedir esta ruta',
      mapaNota: 'Costa: Natural Earth · cimas: OpenStreetMap',
    },
    vuelo: { kicker: 'Vuelo sobre la cima', titulo: 'Sobrevuela la montaña antes de subirla', sub: 'Foto aérea del Instituto Geográfico de Japón sobre el relieve real. En dorado, los senderos de OpenStreetMap. Arrastra para girar; con dos dedos, inclina.', cargando: 'Cargando el relieve…', girar: 'Girar', parar: 'Parar giro', sinWebgl: 'Tu navegador no puede mostrar el mapa 3D.' },
    ciudades: { osaka: 'Osaka', kioto: 'Kioto', kobe: 'Kobe', nara: 'Nara' },
    ficha: { corte: 'Corte del terreno oeste–este por la cima · 6 km', exigencia: 'Exigencia', meses: 'Mejores meses' },
    relieve: { titulo: 'Ocho cumbres en relieve real', sub: 'Elevación y foto aérea del Instituto Geográfico de Japón. Baja y cada montaña se deshace en bruma y se convierte en la siguiente.' },
    foto: 'Foto',
  },
  en: {
    cabecera: 'Expeditions · Kansai',
    portada: {
      titulo: 'Kansai, vertical',
      sub: 'Eighteen mountain routes between Osaka, Kyoto, Nara and Kobe, from sacred summits to a 32 km ultra. Real elevation gain, trails almost no foreigner walks, and a private guide.',
      cifras: ['routes', 'metres, the highest summit', 'prefectures', 'people per group, max.'],
      baja: 'Open the atlas',
      foto: 'Mount Atago from the south',
    },
    atlas: {
      kicker: 'Field atlas',
      titulo: 'Where every summit is',
      sub: 'Tap a mountain on the map or the chart to see its photo, its terrain cross-section and the best time to climb.',
      alturas: 'Summit height',
      calendario: 'Best months',
      ver3d: 'See it in 3D relief',
      pide: 'Ask for this route',
      mapaNota: 'Coastline: Natural Earth · summits: OpenStreetMap',
    },
    vuelo: { kicker: 'Summit flyover', titulo: 'Fly over the mountain before you climb it', sub: 'Aerial imagery from the Geospatial Information Authority of Japan on real terrain. In gold, the trails from OpenStreetMap. Drag to rotate; tilt with two fingers.', cargando: 'Loading terrain…', girar: 'Rotate', parar: 'Stop rotating', sinWebgl: 'Your browser cannot show the 3D map.' },
    ciudades: { osaka: 'Osaka', kioto: 'Kyoto', kobe: 'Kobe', nara: 'Nara' },
    ficha: { corte: 'West–east terrain cross-section through the summit · 6 km', exigencia: 'Effort', meses: 'Best months' },
    relieve: { titulo: 'Eight summits in real relief', sub: 'Elevation and aerial imagery from the Geospatial Information Authority of Japan. Scroll and each mountain dissolves into mist and becomes the next.' },
    foto: 'Photo',
  },
  ar: {
    cabecera: 'رحلات استكشافية · كانساي',
    portada: {
      titulo: 'كانساي عمودياً',
      sub: 'ثمانية عشر مساراً جبلياً بين أوساكا وكيوتو ونارا وكوبي، من القمم المقدسة إلى عبور ٣٢ كم. صعود حقيقي، ودروب لا يكاد يسلكها أجنبي، ومرشد خاص يتحدث العربية.',
      cifras: ['مساراً', 'مترًا أعلى قمة', 'محافظات', 'أشخاص في المجموعة كحد أقصى'],
      baja: 'افتح الأطلس',
      foto: 'جبل أتاغو من الجنوب',
    },
    atlas: {
      kicker: 'أطلس ميداني',
      titulo: 'أين تقع كل قمة',
      sub: 'اضغط على جبل في الخريطة أو في الرسم لترى صورته ومقطع تضاريسه وأفضل وقت لصعوده.',
      alturas: 'ارتفاع كل قمة',
      calendario: 'أفضل الأشهر',
      ver3d: 'شاهده بتضاريس ثلاثية الأبعاد',
      pide: 'أريد هذا المسار',
      mapaNota: 'الساحل: Natural Earth · القمم: OpenStreetMap',
    },
    vuelo: { kicker: 'تحليق فوق القمة', titulo: 'حلّق فوق الجبل قبل أن تصعده', sub: 'صور جوية من هيئة المعلومات الجغرافية اليابانية فوق التضاريس الحقيقية. باللون الذهبي، دروب OpenStreetMap. اسحب للتدوير، وبإصبعين للإمالة.', cargando: 'جارٍ تحميل التضاريس…', girar: 'تدوير', parar: 'إيقاف التدوير', sinWebgl: 'متصفحك لا يستطيع عرض الخريطة ثلاثية الأبعاد.' },
    ciudades: { osaka: 'أوساكا', kioto: 'كيوتو', kobe: 'كوبي', nara: 'نارا' },
    ficha: { corte: 'مقطع التضاريس من الغرب إلى الشرق عبر القمة · 6 كم', exigencia: 'الجهد', meses: 'أفضل الأشهر' },
    relieve: { titulo: 'ثماني قمم بتضاريسها الحقيقية', sub: 'الارتفاعات والصور الجوية من هيئة المعلومات الجغرافية اليابانية. انزل وسيتحول كل جبل إلى ضباب ثم إلى الجبل التالي.' },
    foto: 'صورة',
  },
  ru: {
    cabecera: 'Экспедиции · Кансай',
    portada: {
      titulo: 'Кансай по вертикали',
      sub: 'Восемнадцать горных маршрутов между Осакой, Киото, Нарой и Кобе — от священных вершин до ультра на 32 км. Настоящий набор высоты, тропы без иностранцев и частный гид на русском.',
      cifras: ['маршрутов', 'метров — самая высокая', 'префектур', 'человек в группе, макс.'],
      baja: 'Открыть атлас',
      foto: 'Гора Атаго с юга',
    },
    atlas: {
      kicker: 'Полевой атлас',
      titulo: 'Где каждая вершина',
      sub: 'Нажмите на гору на карте или на графике: фото, разрез рельефа и лучшее время для восхождения.',
      alturas: 'Высота вершин',
      calendario: 'Лучшие месяцы',
      ver3d: 'Смотреть в 3D-рельефе',
      pide: 'Хочу этот маршрут',
      mapaNota: 'Берег: Natural Earth · вершины: OpenStreetMap',
    },
    vuelo: { kicker: 'Полёт над вершиной', titulo: 'Облетите гору, прежде чем подняться', sub: 'Аэрофото Геопространственного управления Японии на настоящем рельефе. Золотом — тропы из OpenStreetMap. Перетащите, чтобы повернуть; двумя пальцами — наклон.', cargando: 'Загружаем рельеф…', girar: 'Вращать', parar: 'Остановить', sinWebgl: 'Ваш браузер не может показать 3D-карту.' },
    ciudades: { osaka: 'Осака', kioto: 'Киото', kobe: 'Кобе', nara: 'Нара' },
    ficha: { corte: 'Разрез рельефа с запада на восток через вершину · 6 км', exigencia: 'Нагрузка', meses: 'Лучшие месяцы' },
    relieve: { titulo: 'Восемь вершин в настоящем рельефе', sub: 'Высоты и аэрофото Геопространственного управления Японии. Листайте: каждая гора рассеивается туманом и становится следующей.' },
    foto: 'Фото',
  },
}
