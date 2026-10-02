// Las rutas de cada guía: qué se ve, cuánto se tarda desde Osaka y qué
// opciones hay, con su modelo 3D. Tiempos de tren aproximados (≈) desde el
// centro de Osaka. Precios: los mismos tramos que contenido.ts.
//
// Modelos 3D descargados de Poly Pizza (no hechos aquí). Licencias y autores
// en MODELOS; las CC-BY obligan a citarlos y se citan en la ficha.

export type ModeloId = 'castillo' | 'pagoda' | 'torii' | 'ciervo' | 'grulla' | 'barco' | 'chochin' | 'toro' | 'cerezo' | 'arce' | 'pino' | 'bonsai' | 'carpa' | 'faro'
export type RutaId = 'kioto' | 'osaka' | 'nara' | 'himeji' | 'kobe' | 'miyajima' | 'hiroshima'
type Lengua = 'es' | 'en' | 'ar' | 'ru'

export const MODELOS: Record<ModeloId, { archivo: string; titulo: string; autor: string; licencia: string; url: string }> = {
  castillo: { archivo: '/v7/modelos/castillo.glb', titulo: 'Pagoda', autor: 'Poly by Google', licencia: 'CC BY 3.0', url: 'https://poly.pizza/m/d1M5ncMBUDi' },
  pagoda: { archivo: '/v7/modelos/pagoda.glb', titulo: 'Pagoda', autor: 'Poly by Google', licencia: 'CC BY 3.0', url: 'https://poly.pizza/m/1zS7ucaAd4J' },
  torii: { archivo: '/v7/modelos/torii.glb', titulo: 'Torii Gate', autor: 'Hattie Stroud', licencia: 'CC BY 3.0', url: 'https://poly.pizza/m/07__lYTDdEH' },
  ciervo: { archivo: '/v7/modelos/ciervo.glb', titulo: 'Deer', autor: 'Poly by Google', licencia: 'CC BY 3.0', url: 'https://poly.pizza/m/0tJzk22c46S' },
  grulla: { archivo: '/v7/modelos/grulla.glb', titulo: 'crane', autor: 'konta johanna', licencia: 'CC BY 3.0', url: 'https://poly.pizza/m/ac2YD5VPryU' },
  barco: { archivo: '/v7/modelos/barco.glb', titulo: 'Container Ship', autor: 'Alex Safayan', licencia: 'CC BY 3.0', url: 'https://poly.pizza/m/3AmDGcCu6Ll' },
  chochin: { archivo: '/v7/modelos/chochin.glb', titulo: 'red lantern', autor: 'Sophie Kim', licencia: 'CC BY 3.0', url: 'https://poly.pizza/m/7PZhxLFiGc2' },
  toro: { archivo: '/v7/modelos/toro.glb', titulo: 'Japanese Stone Lamp', autor: 'Flopsi', licencia: 'CC BY 3.0', url: 'https://poly.pizza/m/5gZfOZIW92k' },
  cerezo: { archivo: '/v7/modelos/cerezo.glb', titulo: 'Cherry tree', autor: 'Poly by Google', licencia: 'CC BY 3.0', url: 'https://poly.pizza/m/1FSDzk-LRdA' },
  arce: { archivo: '/v7/modelos/arce.glb', titulo: 'Autumn Tree', autor: 'Quaternius', licencia: 'Dominio público (CC0)', url: 'https://poly.pizza/m/2lRubrT6Na' },
  pino: { archivo: '/v7/modelos/pino.glb', titulo: 'Pine', autor: 'Quaternius', licencia: 'Dominio público (CC0)', url: 'https://poly.pizza/m/699sFuLCN2' },
  bonsai: { archivo: '/v7/modelos/bonsai.glb', titulo: 'Bonsai', autor: 'Don Carson', licencia: 'CC BY 3.0', url: 'https://poly.pizza/m/44XK5UHTd4Q' },
  carpa: { archivo: '/v7/modelos/carpa.glb', titulo: 'Goldfish', autor: 'Poly by Google', licencia: 'CC BY 3.0', url: 'https://poly.pizza/m/0bOZGc8ONrx' },
  faro: { archivo: '/v7/modelos/faro.glb', titulo: 'Lighthouse', autor: 'Poly by Google', licencia: 'CC BY 3.0', url: 'https://poly.pizza/m/0t2ZYRBsqX-' },
}

/** Una pieza del diorama: modelo, sitio en el suelo (x, z), tamaño (lado mayor), giro y altura. */
export interface Pieza { m: ModeloId; x: number; z: number; tam: number; rot?: number; y?: number; osaka?: boolean }

/** Cada ruta es una pequeña escena compuesta con piezas descargadas. */
export const ESCENAS: Record<RutaId, { piezas: Pieza[]; agua?: boolean }> = {
  kioto: { piezas: [
    { m: 'pagoda', x: 0.1, z: -0.3, tam: 2.3 },
    { m: 'torii', x: -1.15, z: 0.75, tam: 0.95, rot: 0.55 },
    { m: 'arce', x: 1.2, z: -0.35, tam: 1.3 },
    { m: 'toro', x: 0.75, z: 0.95, tam: 0.5 },
  ] },
  osaka: { piezas: [
    { m: 'castillo', x: 0, z: -0.25, tam: 2.1, osaka: true },
    { m: 'cerezo', x: -1.3, z: 0.35, tam: 1.1 },
    { m: 'cerezo', x: 1.35, z: -0.5, tam: 0.9, rot: 1.2 },
    { m: 'chochin', x: 0.8, z: 1.0, tam: 0.32 },
    { m: 'chochin', x: -0.55, z: 1.05, tam: 0.28 },
  ] },
  nara: { piezas: [
    { m: 'ciervo', x: -0.3, z: 0.25, tam: 1.05, rot: 0.6 },
    { m: 'ciervo', x: 0.75, z: 0.55, tam: 0.8, rot: -1.3 },
    { m: 'toro', x: -1.15, z: -0.45, tam: 0.95 },
    { m: 'toro', x: 1.05, z: -0.65, tam: 0.95 },
    { m: 'pino', x: 0.05, z: -1.15, tam: 1.9 },
  ] },
  himeji: { piezas: [
    { m: 'castillo', x: 0, z: -0.25, tam: 2.1 },
    { m: 'pino', x: -1.3, z: -0.35, tam: 1.5 },
    { m: 'pino', x: 1.35, z: 0.1, tam: 1.15, rot: 1 },
    { m: 'bonsai', x: 0.75, z: 1.0, tam: 0.55 },
  ] },
  kobe: { piezas: [
    { m: 'barco', x: 0.25, z: 0.45, tam: 2.4, rot: 0.35 },
    { m: 'faro', x: -1.15, z: -0.7, tam: 1.5 },
  ] },
  miyajima: { agua: true, piezas: [
    { m: 'torii', x: 0, z: 0, tam: 1.9 },
    { m: 'carpa', x: 0.85, z: 0.75, tam: 0.38, rot: 2.2, y: 0.36 },
    { m: 'carpa', x: -0.75, z: 0.95, tam: 0.32, rot: -0.6, y: 0.36 },
    { m: 'pino', x: -1.35, z: -1.25, tam: 1.3 },
    { m: 'pino', x: 1.3, z: -1.35, tam: 1.05 },
  ] },
  hiroshima: { piezas: [
    { m: 'cerezo', x: 0, z: -0.9, tam: 1.7 },
    // Senbazuru: grullas de papel en corro, a distintas alturas.
    ...[0, 1, 2, 3, 4, 5].map((i) => ({ m: 'grulla' as const, x: Math.cos(i * 1.047) * 1.0, z: Math.sin(i * 1.047) * 0.8 + 0.3, tam: 0.42, rot: -i * 1.047, y: 0.35 + (i % 3) * 0.3 })),
  ] },
}

type Tramo = 'medio' | 'completo' | 'lejos'
export const PRECIO: Record<Tramo, number> = { medio: 38000, completo: 58000, lejos: 70000 }

/** Lo que no depende del idioma: modelo, retoque y precio de cada opción. */
/** Precio de cada opción y pieza principal (la que se cita junto a la ruta). */
export const META: Record<RutaId, { modelo: ModeloId; variante?: 'osaka' | 'agua'; tramos: Tramo[] }> = {
  kioto: { modelo: 'pagoda', tramos: ['medio', 'completo'] },
  osaka: { modelo: 'castillo', variante: 'osaka', tramos: ['medio', 'completo'] },
  nara: { modelo: 'ciervo', tramos: ['medio', 'completo'] },
  himeji: { modelo: 'castillo', tramos: ['completo'] },
  kobe: { modelo: 'barco', tramos: ['medio', 'completo'] },
  miyajima: { modelo: 'torii', variante: 'agua', tramos: ['lejos', 'lejos'] },
  hiroshima: { modelo: 'grulla', tramos: ['lejos', 'lejos'] },
}

export const RUTAS_TONY: RutaId[] = ['kioto', 'osaka', 'nara', 'himeji', 'kobe']
export const RUTAS_LARION: RutaId[] = ['miyajima', 'hiroshima', 'himeji', 'kioto', 'nara', 'osaka']

interface TextoRuta { titulo: string; desde: string; texto: string; opciones: { nombre: string; texto: string }[] }

export const ETIQUETAS: Record<Lengua, { titulo: string; sub: string; desde: string; pedir: string; gira: string; modelo: string; desdePrecio: string; nombres: Record<Tramo, string> }> = {
  es: { titulo: 'Las rutas', sub: 'Elige una y mira qué incluye. Son puntos de partida: el día lo ajustamos a vosotros.', desde: 'Desde Osaka', pedir: 'Quiero esta ruta', gira: 'Arrastra para girar', modelo: 'Modelo 3D', desdePrecio: 'desde', nombres: { medio: 'Medio día', completo: 'Día completo', lejos: 'Día completo' } },
  en: { titulo: 'The routes', sub: 'Pick one and see what it includes. They\'re starting points — we adjust the day to you.', desde: 'From Osaka', pedir: 'I want this route', gira: 'Drag to rotate', modelo: '3D model', desdePrecio: 'from', nombres: { medio: 'Half day', completo: 'Full day', lejos: 'Full day' } },
  ar: { titulo: 'المسارات', sub: 'اختر مساراً وانظر ما يشمله. هي نقاط انطلاق، ونرتّب اليوم على مقاسكم.', desde: 'من أوساكا', pedir: 'أريد هذا المسار', gira: 'اسحب للتدوير', modelo: 'نموذج ثلاثي الأبعاد', desdePrecio: 'ابتداءً من', nombres: { medio: 'نصف يوم', completo: 'يوم كامل', lejos: 'يوم كامل' } },
  ru: { titulo: 'Маршруты', sub: 'Выберите маршрут и посмотрите, что в него входит. Это отправная точка — день подстроим под вас.', desde: 'Из Осаки', pedir: 'Хочу этот маршрут', gira: 'Потяните, чтобы повернуть', modelo: '3D-модель', desdePrecio: 'от', nombres: { medio: 'Полдня', completo: 'Целый день', lejos: 'Целый день' } },
}

export const TEXTOS: Record<Lengua, Record<RutaId, TextoRuta>> = {
  es: {
    kioto: { titulo: 'Kioto', desde: '≈ 30 min en tren', texto: 'La antigua capital: templos, santuarios y calles de madera. Conviene empezar temprano, antes de que lleguen los grupos.', opciones: [
      { nombre: 'Medio día', texto: 'Fushimi Inari y sus miles de torii, y Kiyomizu-dera.' },
      { nombre: 'Día completo', texto: 'Lo anterior, más las calles de Gion y el Pabellón Dorado (Kinkaku-ji).' }] },
    osaka: { titulo: 'Osaka', desde: 'Tu hotel está aquí', texto: 'La ciudad de la comida y del castillo. Se recorre a pie y en metro, al ritmo de la gente de aquí.', opciones: [
      { nombre: 'Medio día', texto: 'El castillo de Osaka y su parque.' },
      { nombre: 'Día completo', texto: 'El castillo, el mercado de Kuromon, Dōtonbori y Shinsekai.' }] },
    nara: { titulo: 'Nara', desde: '≈ 40 min en tren', texto: 'La primera capital de Japón. Los ciervos pasean sueltos por el parque y el Gran Buda está en uno de los mayores edificios de madera del mundo.', opciones: [
      { nombre: 'Medio día', texto: 'El parque de Nara, los ciervos y Tōdai-ji.' },
      { nombre: 'Día completo', texto: 'Lo anterior, más el santuario Kasuga Taisha y el jardín Isui-en.' }] },
    himeji: { titulo: 'Himeji', desde: '≈ 1 h en tren rápido', texto: 'El castillo original mejor conservado de Japón, Patrimonio de la Humanidad desde 1993.', opciones: [
      { nombre: 'Día completo', texto: 'El castillo y el jardín Kōko-en; de vuelta, una parada en Kobe si os apetece.' }] },
    kobe: { titulo: 'Kobe', desde: '≈ 25 min en tren', texto: 'Ciudad portuaria entre el mar y la montaña. Aquí está la Mezquita de Kobe, de 1935, la más antigua de Japón.', opciones: [
      { nombre: 'Medio día', texto: 'El puerto de Meriken, el barrio de Kitano y la mezquita.' },
      { nombre: 'Día completo', texto: 'Lo anterior, más el barrio chino de Nankinmachi y el teleférico de Shin-Kobe.' }] },
    miyajima: { titulo: 'Miyajima', desde: '≈ 2 h 15 min (shinkansen y ferry)', texto: 'La isla del torii que parece flotar con la marea alta y del santuario Itsukushima.', opciones: [
      { nombre: 'Solo Miyajima', texto: 'El torii, el santuario Itsukushima y el teleférico al monte Misen.' },
      { nombre: 'Miyajima e Hiroshima', texto: 'La isla por la mañana y el Parque de la Paz por la tarde.' }] },
    hiroshima: { titulo: 'Hiroshima', desde: '≈ 1 h 30 min en shinkansen', texto: 'La ciudad de la paz: la Cúpula de la Bomba Atómica, el Parque y el Museo Memorial.', opciones: [
      { nombre: 'Hiroshima', texto: 'El Parque y el Museo de la Paz, y el castillo de Hiroshima.' },
      { nombre: 'Hiroshima y Miyajima', texto: 'La ciudad por la mañana y la isla por la tarde.' }] },
  },
  en: {
    kioto: { titulo: 'Kyoto', desde: '≈ 30 min by train', texto: 'The old capital: temples, shrines and wooden streets. Best started early, before the tour groups arrive.', opciones: [
      { nombre: 'Half day', texto: 'Fushimi Inari and its thousands of torii, plus Kiyomizu-dera.' },
      { nombre: 'Full day', texto: 'All of that, plus the lanes of Gion and the Golden Pavilion (Kinkaku-ji).' }] },
    osaka: { titulo: 'Osaka', desde: 'Your hotel is here', texto: 'The city of food and of the castle. We get around on foot and by metro, at the pace locals do.', opciones: [
      { nombre: 'Half day', texto: 'Osaka Castle and its park.' },
      { nombre: 'Full day', texto: 'The castle, Kuromon Market, Dōtonbori and Shinsekai.' }] },
    nara: { titulo: 'Nara', desde: '≈ 40 min by train', texto: 'Japan\'s first capital. Deer roam the park freely, and the Great Buddha sits in one of the largest wooden buildings in the world.', opciones: [
      { nombre: 'Half day', texto: 'Nara Park, the deer and Tōdai-ji.' },
      { nombre: 'Full day', texto: 'All of that, plus Kasuga Taisha shrine and Isui-en garden.' }] },
    himeji: { titulo: 'Himeji', desde: '≈ 1 h by rapid train', texto: 'Japan\'s best-preserved original castle, a UNESCO World Heritage Site since 1993.', opciones: [
      { nombre: 'Full day', texto: 'The castle and Kōko-en garden, with a stop in Kobe on the way back if you like.' }] },
    kobe: { titulo: 'Kobe', desde: '≈ 25 min by train', texto: 'A port city between the sea and the mountains, and home to the Kobe Mosque, built in 1935 — the oldest in Japan.', opciones: [
      { nombre: 'Half day', texto: 'Meriken harbour, the Kitano quarter and the mosque.' },
      { nombre: 'Full day', texto: 'All of that, plus Nankinmachi Chinatown and the Shin-Kobe ropeway.' }] },
    miyajima: { titulo: 'Miyajima', desde: '≈ 2 h 15 min (shinkansen and ferry)', texto: 'The island of the torii that seems to float at high tide, and of Itsukushima Shrine.', opciones: [
      { nombre: 'Miyajima only', texto: 'The torii, Itsukushima Shrine and the ropeway up Mount Misen.' },
      { nombre: 'Miyajima and Hiroshima', texto: 'The island in the morning and the Peace Park in the afternoon.' }] },
    hiroshima: { titulo: 'Hiroshima', desde: '≈ 1 h 30 min by shinkansen', texto: 'The city of peace: the Atomic Bomb Dome, the Peace Memorial Park and Museum.', opciones: [
      { nombre: 'Hiroshima', texto: 'The Peace Park and Museum, and Hiroshima Castle.' },
      { nombre: 'Hiroshima and Miyajima', texto: 'The city in the morning and the island in the afternoon.' }] },
  },
  ar: {
    kioto: { titulo: 'كيوتو', desde: '≈ ٣٠ دقيقة بالقطار', texto: 'العاصمة القديمة: معابد وأضرحة وشوارع خشبية. الأفضل أن نبدأ باكراً قبل وصول المجموعات السياحية.', opciones: [
      { nombre: 'نصف يوم', texto: 'فوشيمي إيناري وآلاف بوابات توري، ومعبد كيوميزو-ديرا.' },
      { nombre: 'يوم كامل', texto: 'كل ما سبق، مع أزقة غيون والجناح الذهبي (كينكاكو-جي).' }] },
    osaka: { titulo: 'أوساكا', desde: 'فندقك هنا', texto: 'مدينة الطعام والقلعة. نتنقل فيها مشياً وبالمترو على إيقاع أهلها، مع مطاعم حلال موثوقة.', opciones: [
      { nombre: 'نصف يوم', texto: 'قلعة أوساكا وحديقتها.' },
      { nombre: 'يوم كامل', texto: 'القلعة وسوق كورومون ودوتونبوري وشينسيكاي.' }] },
    nara: { titulo: 'نارا', desde: '≈ ٤٠ دقيقة بالقطار', texto: 'أول عاصمة لليابان. تتجول الغزلان بحرية في الحديقة، وتمثال بوذا الكبير داخل أحد أكبر المباني الخشبية في العالم.', opciones: [
      { nombre: 'نصف يوم', texto: 'حديقة نارا والغزلان ومعبد توداي-جي.' },
      { nombre: 'يوم كامل', texto: 'كل ما سبق، مع ضريح كاسوغا تايشا وحديقة إيسوي-إن.' }] },
    himeji: { titulo: 'هيميجي', desde: '≈ ساعة بالقطار السريع', texto: 'أفضل قلعة أصلية محفوظة في اليابان، ومن مواقع التراث العالمي لليونسكو منذ ١٩٩٣.', opciones: [
      { nombre: 'يوم كامل', texto: 'القلعة وحديقة كوكو-إن، مع توقف في كوبي في طريق العودة إن رغبتم.' }] },
    kobe: { titulo: 'كوبي', desde: '≈ ٢٥ دقيقة بالقطار', texto: 'مدينة ميناء بين البحر والجبل، وفيها مسجد كوبي الذي بُني عام ١٩٣٥، أقدم مسجد في اليابان.', opciones: [
      { nombre: 'نصف يوم', texto: 'ميناء ميريكين وحي كيتانو والمسجد.' },
      { nombre: 'يوم كامل', texto: 'كل ما سبق، مع الحي الصيني نانكينماتشي وتلفريك شين-كوبي.' }] },
    miyajima: { titulo: 'ميياجيما', desde: '≈ ساعتان و١٥ دقيقة (شينكانسن وعبّارة)', texto: 'جزيرة بوابة توري التي تبدو عائمة عند المد، وضريح إيتسوكوشيما.', opciones: [
      { nombre: 'ميياجيما فقط', texto: 'بوابة توري وضريح إيتسوكوشيما وتلفريك جبل ميسن.' },
      { nombre: 'ميياجيما وهيروشيما', texto: 'الجزيرة صباحاً وحديقة السلام بعد الظهر.' }] },
    hiroshima: { titulo: 'هيروشيما', desde: '≈ ساعة ونصف بالشينكانسن', texto: 'مدينة السلام: قبة القنبلة الذرية وحديقة ومتحف السلام التذكاري.', opciones: [
      { nombre: 'هيروشيما', texto: 'حديقة ومتحف السلام، وقلعة هيروشيما.' },
      { nombre: 'هيروشيما وميياجيما', texto: 'المدينة صباحاً والجزيرة بعد الظهر.' }] },
  },
  ru: {
    kioto: { titulo: 'Киото', desde: '≈ 30 мин на поезде', texto: 'Древняя столица: храмы, святилища и деревянные улочки. Лучше начинать рано, пока не приехали группы.', opciones: [
      { nombre: 'Полдня', texto: 'Фусими Инари с тысячами тории и храм Киёмидзу-дэра.' },
      { nombre: 'Целый день', texto: 'Всё это плюс улочки Гиона и Золотой павильон (Кинкаку-дзи).' }] },
    osaka: { titulo: 'Осака', desde: 'Ваш отель здесь', texto: 'Город еды и замка. Передвигаемся пешком и на метро, в ритме местных.', opciones: [
      { nombre: 'Полдня', texto: 'Замок Осаки и парк вокруг него.' },
      { nombre: 'Целый день', texto: 'Замок, рынок Куромон, Дотонбори и Синсэкай.' }] },
    nara: { titulo: 'Нара', desde: '≈ 40 мин на поезде', texto: 'Первая столица Японии. Олени свободно гуляют по парку, а Большой Будда стоит в одном из крупнейших деревянных зданий мира.', opciones: [
      { nombre: 'Полдня', texto: 'Парк Нары, олени и храм Тодай-дзи.' },
      { nombre: 'Целый день', texto: 'Всё это плюс святилище Касуга-тайся и сад Исуйэн.' }] },
    himeji: { titulo: 'Химэдзи', desde: '≈ 1 ч на скором поезде', texto: 'Лучше всех сохранившийся подлинный замок Японии, объект ЮНЕСКО с 1993 года.', opciones: [
      { nombre: 'Целый день', texto: 'Замок и сад Кокоэн, а на обратном пути — остановка в Кобе, если захотите.' }] },
    kobe: { titulo: 'Кобе', desde: '≈ 25 мин на поезде', texto: 'Портовый город между морем и горами.', opciones: [
      { nombre: 'Полдня', texto: 'Гавань Мэрикэн и квартал Китано.' },
      { nombre: 'Целый день', texto: 'Всё это плюс китайский квартал Нанкинмати и канатная дорога Син-Кобе.' }] },
    miyajima: { titulo: 'Миядзима', desde: '≈ 2 ч 15 мин (синкансэн и паром)', texto: 'Остров «плавучих» тории, которые в прилив будто стоят на воде, и святилища Ицукусима.', opciones: [
      { nombre: 'Только Миядзима', texto: 'Тории, святилище Ицукусима и канатная дорога на гору Мисэн.' },
      { nombre: 'Миядзима и Хиросима', texto: 'Остров утром, Парк мира после обеда.' }] },
    hiroshima: { titulo: 'Хиросима', desde: '≈ 1 ч 30 мин на синкансэне', texto: 'Город мира: Купол Гэмбаку, Мемориальный парк и музей мира.', opciones: [
      { nombre: 'Хиросима', texto: 'Парк и музей мира, замок Хиросимы.' },
      { nombre: 'Хиросима и Миядзима', texto: 'Город утром, остров после обеда.' }] },
  },
}
