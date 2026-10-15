// Cumbres exigentes de Kansai, para senderistas con experiencia que ya han hecho
// lo típico y buscan desnivel, rutas largas y montes que casi ningún extranjero
// pisa. Distancia, desnivel y horas son los de la ruta en AllTrails (enlazada en
// cada ficha, consultados el 15-10-2026): si AllTrails cambia la ruta, cambiar aquí.
// Altura solo donde la ruta acaba en una cima concreta.

export type Lengua = 'es' | 'en' | 'ar' | 'ru'
export type Nivel = 'exigente' | 'experto' | 'ultra'

export interface Cumbre {
  id: string
  kanji: string
  nombre: string
  /** Ruta en AllTrails: https://www.alltrails.com/trail/japan/<slug> */
  slug: string
  km: number
  desnivel: number
  horas: string
  cima?: number
  prefectura: Record<Lengua, string>
  nivel: Nivel
  sellos: ('unesco' | 'hyakumeizan' | 'techo' | 'varios-dias')[]
  meses: number[]
  t: Record<Lengua, { sub: string; nota: string; acceso: string }>
}

/** Si Tony entra en el programa de afiliados de AllTrails, su parámetro va aquí
 *  y se añade a todos los enlaces a la vez. */
export const ALLTRAILS_REF = ''
export const alltrails = (slug: string) => `https://www.alltrails.com/trail/japan/${slug}${ALLTRAILS_REF}`
export const YAMAP = 'https://yamap.com/'

const P = {
  shiga: { es: 'Shiga', en: 'Shiga', ar: 'شيغا', ru: 'Сига' },
  nara: { es: 'Nara', en: 'Nara', ar: 'نارا', ru: 'Нара' },
  wakayama: { es: 'Wakayama', en: 'Wakayama', ar: 'واكاياما', ru: 'Вакаяма' },
  hyogo: { es: 'Hyōgo', en: 'Hyōgo', ar: 'هيوغو', ru: 'Хёго' },
  kyoto: { es: 'Kioto', en: 'Kyoto', ar: 'كيوتو', ru: 'Киото' },
  osaka: { es: 'Osaka', en: 'Osaka', ar: 'أوساكا', ru: 'Осака' },
}

export const CUMBRES: Cumbre[] = [
  {
    id: 'hakkyogadake', kanji: '八経ヶ岳', nombre: 'Hakkyōgadake', slug: 'nara/omine-okugakemichi-mount-misen',
    km: 11.6, desnivel: 1102, horas: '6–6,5', cima: 1915, prefectura: P.nara, nivel: 'experto', sellos: ['techo', 'hyakumeizan'], meses: [5, 6, 7, 8, 9, 10, 11],
    t: {
      es: { sub: 'El techo de Kansai, por el monte Misen', nota: 'Bosque de abetos y musgo por el antiguo camino de peregrinos de Ōmine. La cima más alta del oeste de Japón fuera de los Alpes.', acceso: 'Túnel de Gyōjagaeri (oeste), en coche' },
      en: { sub: 'The roof of Kansai, via Mt. Misen', nota: 'Fir and moss forest along the old Ōmine pilgrim path. The highest summit in western Japan outside the Alps.', acceso: 'Gyōjagaeri Tunnel (west), by car' },
      ar: { sub: 'سقف كانساي عبر جبل ميسن', nota: 'غابة تنّوب وطحالب على درب الحجاج القديم في أومينه. أعلى قمة في غرب اليابان خارج الألب اليابانية.', acceso: 'نفق غيوجاغايري (الغربي)، بالسيارة' },
      ru: { sub: 'Крыша Кансая, через гору Мисэн', nota: 'Пихтовый лес и мох на старой тропе паломников Оминэ. Самая высокая вершина западной Японии за пределами Альп.', acceso: 'Тоннель Гёдзягаэри (запад), на машине' },
    },
  },
  {
    id: 'hira-traverse', kanji: '比良山系縦走', nombre: 'Hira Traverse', slug: 'shiga/hira-mountains-half-traverse',
    km: 32.3, desnivel: 2000, horas: '13–14', prefectura: P.shiga, nivel: 'ultra', sellos: [], meses: [5, 6, 9, 10, 11],
    t: {
      es: { sub: 'Media travesía de la cordillera sobre el lago Biwa', nota: 'Cresta tras cresta con el lago más grande de Japón a un lado. Salida con la primera luz y ritmo constante: es un día de ultra.', acceso: 'Línea JR Kosei (estaciones del lago)' },
      en: { sub: 'Half traverse of the range above Lake Biwa', nota: 'Ridge after ridge with Japan\'s largest lake beside you. First-light start and a steady pace: this is an ultra day.', acceso: 'JR Kosei Line (lakeside stations)' },
      ar: { sub: 'نصف عبور السلسلة فوق بحيرة بيوا', nota: 'قمة تلو قمة وأكبر بحيرة في اليابان إلى جانبك. انطلاق مع أول ضوء وإيقاع ثابت: إنه يوم تحمّل طويل.', acceso: 'خط JR كوسَي (محطات البحيرة)' },
      ru: { sub: 'Половина траверса хребта над озером Бива', nota: 'Гребень за гребнем, рядом крупнейшее озеро Японии. Старт с первым светом и ровный темп: это ультра-день.', acceso: 'Линия JR Косэй (станции у озера)' },
    },
  },
  {
    id: 'bunagatake', kanji: '武奈ヶ岳', nombre: 'Bunagatake', slug: 'shiga/mount-bunagatake',
    km: 14, desnivel: 1462, horas: '8–8,5', cima: 1214, prefectura: P.shiga, nivel: 'experto', sellos: [], meses: [1, 2, 4, 5, 6, 9, 10, 11, 12],
    t: {
      es: { sub: 'La cima más alta de los montes Hira', nota: 'Subida seca y larga hasta una cumbre pelada con todo el lago Biwa debajo. En invierno, nieve de verdad: crampones y experiencia.', acceso: 'Bōmura, en autobús desde JR Katata' },
      en: { sub: 'The highest peak of the Hira range', nota: 'A long, steep climb to a bare summit with all of Lake Biwa below. Real snow in winter: crampons and experience.', acceso: 'Bōmura, by bus from JR Katata' },
      ar: { sub: 'أعلى قمة في جبال هيرا', nota: 'صعود طويل وحاد إلى قمة جرداء وبحيرة بيوا كلها تحتك. ثلج حقيقي في الشتاء: مسامير جليد وخبرة.', acceso: 'بومورا، بالحافلة من محطة JR كاتاتا' },
      ru: { sub: 'Высшая точка хребта Хира', nota: 'Долгий крутой подъём на голую вершину, под ногами всё озеро Бива. Зимой настоящий снег: кошки и опыт.', acceso: 'Бомура, автобусом от JR Катата' },
    },
  },
  {
    id: 'rokko-traverse', kanji: '六甲縦走', nombre: 'Rokkō Traverse', slug: 'hyogo/mt-rokko-trail-nunobiki-falls-okamoto',
    km: 26.9, desnivel: 1216, horas: '9–10', prefectura: P.hyogo, nivel: 'ultra', sellos: [], meses: [1, 2, 3, 4, 5, 10, 11, 12],
    t: {
      es: { sub: 'De las cascadas Nunobiki a Okamoto, por la cresta sobre Kobe', nota: 'Medio Rokkō Zenzan, la travesía que los corredores de montaña de Kansai entrenan cada año. Mar a un lado, cordillera al otro.', acceso: 'Shin-Kobe (shinkansen)' },
      en: { sub: 'From Nunobiki Falls to Okamoto along the ridge above Kobe', nota: 'Half of the Rokkō Zenzan traverse that Kansai trail runners train for every year. Sea on one side, mountains on the other.', acceso: 'Shin-Kobe (shinkansen)' },
      ar: { sub: 'من شلالات نونوبيكي إلى أوكاموتو عبر الحافة فوق كوبي', nota: 'نصف عبور روكّو الكامل الذي يتدرّب عليه عدّاؤو الجبال في كانساي كل عام. البحر من جهة والجبال من الأخرى.', acceso: 'شين-كوبي (شينكانسن)' },
      ru: { sub: 'От водопадов Нунобики до Окамото по гребню над Кобе', nota: 'Половина траверса Рокко Дзэндзан, к которому каждый год готовятся трейлраннеры Кансая. С одной стороны море, с другой горы.', acceso: 'Син-Кобе (синкансэн)' },
    },
  },
  {
    id: 'kyoto-isshu', kanji: '京都一周トレイル', nombre: 'Kyoto Isshu Trail', slug: 'kyoto/kyoto-isshu-trail',
    km: 81.8, desnivel: 3583, horas: '24+', prefectura: P.kyoto, nivel: 'ultra', sellos: ['varios-dias'], meses: [3, 4, 5, 10, 11, 12],
    t: {
      es: { sub: 'La vuelta entera a Kioto por sus montañas', nota: 'Fushimi Inari, Daimonji, Hiei, Kurama y Arashiyama enlazados por la cresta. Por etapas de un día: vuelves a dormir a la ciudad.', acceso: 'Fushimi Inari (tren desde Kioto)' },
      en: { sub: 'The full loop around Kyoto through its mountains', nota: 'Fushimi Inari, Daimonji, Hiei, Kurama and Arashiyama linked along the ridges. In one-day stages: you sleep in the city each night.', acceso: 'Fushimi Inari (train from Kyoto)' },
      ar: { sub: 'الدورة الكاملة حول كيوتو عبر جبالها', nota: 'فوشيمي إيناري ودايمونجي وهيئي وكوراما وأراشيياما على حافة واحدة. على مراحل يومية: تنام في المدينة كل ليلة.', acceso: 'فوشيمي إيناري (قطار من كيوتو)' },
      ru: { sub: 'Полный круг вокруг Киото по его горам', nota: 'Фусими Инари, Даймондзи, Хиэй, Курама и Арасияма по одному гребню. Однодневными этапами: ночуете в городе.', acceso: 'Фусими Инари (поезд из Киото)' },
    },
  },
  {
    id: 'ogumotori', kanji: '大雲取越', nombre: 'Kumano Kodō · Ōkumotori-goe', slug: 'wakayama/kumano-kodo-koguchi-kumano-nachi-taisha',
    km: 16.1, desnivel: 1145, horas: '7–7,5', prefectura: P.wakayama, nivel: 'experto', sellos: ['unesco'], meses: [3, 4, 5, 10, 11, 12],
    t: {
      es: { sub: 'El tramo más duro del Kumano Kodō, hasta la cascada de Nachi', nota: 'Escalones de piedra cubiertos de musgo, bosque cerrado y el final ante la cascada más alta de Japón. Patrimonio de la Humanidad.', acceso: 'Koguchi, en autobús desde Hongū' },
      en: { sub: 'The hardest stage of the Kumano Kodō, to Nachi Falls', nota: 'Mossy stone steps, deep forest and a finish facing Japan\'s tallest waterfall. UNESCO World Heritage.', acceso: 'Koguchi, by bus from Hongū' },
      ar: { sub: 'أصعب مرحلة في كومانو كودو حتى شلال ناتشي', nota: 'درجات حجرية مكسوّة بالطحالب وغابة كثيفة، والنهاية أمام أعلى شلال في اليابان. تراث عالمي لليونسكو.', acceso: 'كوغوتشي، بالحافلة من هونغو' },
      ru: { sub: 'Самый трудный участок Кумано Кодо, до водопада Нати', nota: 'Каменные ступени во мху, густой лес и финиш у самого высокого водопада Японии. Всемирное наследие ЮНЕСКО.', acceso: 'Когути, автобусом из Хонгу' },
    },
  },
  {
    id: 'choishi-michi', kanji: '町石道', nombre: 'Kōyasan Chōishi-michi', slug: 'wakayama/koyasan-choishi-michi',
    km: 19.8, desnivel: 1115, horas: '6,5–7', prefectura: P.wakayama, nivel: 'experto', sellos: ['unesco'], meses: [3, 4, 5, 6, 9, 10, 11, 12],
    t: {
      es: { sub: 'Subir a Kōyasan a pie, como se hacía hace mil años', nota: 'De Kudoyama a la Gran Puerta de Kōyasan siguiendo los 180 mojones de piedra que marcan el camino. Patrimonio de la Humanidad.', acceso: 'Kudoyama (línea Nankai desde Namba)' },
      en: { sub: 'Walk up to Kōyasan, as pilgrims did a thousand years ago', nota: 'From Kudoyama to Kōyasan\'s Great Gate following the 180 stone markers along the way. UNESCO World Heritage.', acceso: 'Kudoyama (Nankai Line from Namba)' },
      ar: { sub: 'اصعد إلى كوياسان مشياً كما كان قبل ألف عام', nota: 'من كودوياما إلى البوابة الكبرى في كوياسان على خطى ١٨٠ علامة حجرية. تراث عالمي لليونسكو.', acceso: 'كودوياما (خط نانكاي من نامبا)' },
      ru: { sub: 'Подъём на Коя-сан пешком, как тысячу лет назад', nota: 'От Кудояма до Больших ворот Коя-сан по 180 каменным столбам вдоль пути. Всемирное наследие ЮНЕСКО.', acceso: 'Кудояма (линия Нанкай от Намбы)' },
    },
  },
  {
    id: 'kohechi', kanji: '小辺路', nombre: 'Kumano Kodō · Kohechi', slug: 'nara/kumano-kohechi-omata-miura-guchi',
    km: 13.5, desnivel: 850, horas: '6–7', prefectura: P.nara, nivel: 'exigente', sellos: ['unesco', 'varios-dias'], meses: [4, 5, 6, 10, 11],
    t: {
      es: { sub: 'El Kumano Kodō de montaña: paso de Miura, de Ōmata a Miura-guchi', nota: 'La ruta que une Kōyasan con Kumano por puertos de más de 1.000 m. Muy poca gente: aldeas de montaña y silencio.', acceso: 'Ōmata (sin transporte público; se enlaza a pie o en coche)' },
      en: { sub: 'The mountain Kumano Kodō: Miura Pass, Ōmata to Miura-guchi', nota: 'The route linking Kōyasan with Kumano over passes above 1,000 m. Very few people: mountain villages and silence.', acceso: 'Ōmata (no public transport; reached on foot or by car)' },
      ar: { sub: 'كومانو كودو الجبلي: ممر ميورا من أوماتا إلى ميورا-غوتشي', nota: 'الدرب الذي يصل كوياسان بكومانو عبر ممرات تتجاوز ١٠٠٠ م. قلّة من الناس: قرى جبلية وسكون.', acceso: 'أوماتا (بلا نقل عام؛ مشياً أو بالسيارة)' },
      ru: { sub: 'Горный Кумано Кодо: перевал Миура, от Омата до Миура-гути', nota: 'Путь из Коя-сан в Кумано через перевалы выше 1000 м. Почти никого: горные деревни и тишина.', acceso: 'Омата (без общественного транспорта; пешком или на машине)' },
    },
  },
  {
    id: 'iwawaki', kanji: '岩湧山', nombre: 'Iwawaki · Diamond Trail', slug: 'wakayama/mt-iwawaki-kimitoge-station',
    km: 18.8, desnivel: 973, horas: '6,5–7', cima: 897, prefectura: P.osaka, nivel: 'exigente', sellos: [], meses: [3, 4, 5, 9, 10, 11, 12],
    t: {
      es: { sub: 'La Diamond Trail desde Kimitōge hasta la pradera de Iwawaki', nota: 'Tramo sur de la Diamond Trail, la gran cresta entre Osaka y Nara. En otoño, la cima es un mar de susuki plateado.', acceso: 'Kimitōge (línea Nankai Kōya)' },
      en: { sub: 'The Diamond Trail from Kimitōge to the Iwawaki grassland', nota: 'Southern section of the Diamond Trail, the great ridge between Osaka and Nara. In autumn the summit is a sea of silver susuki grass.', acceso: 'Kimitōge (Nankai Kōya Line)' },
      ar: { sub: 'درب الماس من كيميتوغه إلى مرج إيواواكي', nota: 'الجزء الجنوبي من درب الماس، الحافة الكبرى بين أوساكا ونارا. في الخريف تصير القمة بحراً من عشب سوسوكي الفضي.', acceso: 'كيميتوغه (خط نانكاي كويا)' },
      ru: { sub: 'Diamond Trail от Кимитогэ до луга Иваваки', nota: 'Южный участок Diamond Trail, большого гребня между Осакой и Нарой. Осенью вершина — море серебристой травы сусуки.', acceso: 'Кимитогэ (линия Нанкай Коя)' },
    },
  },
  {
    id: 'odaigahara', kanji: '大台ヶ原', nombre: 'Ōdaigahara', slug: 'nara/odaigahara-b-course',
    km: 6.8, desnivel: 301, horas: '2–2,5', cima: 1695, prefectura: P.nara, nivel: 'exigente', sellos: ['hyakumeizan'], meses: [5, 6, 7, 8, 9, 10, 11],
    t: {
      es: { sub: 'Hidegatake y el acantilado de Daijagura', nota: 'Uno de los sitios más lluviosos de Japón: bosque de niebla, un balcón de roca sobre 800 m de vacío y, con suerte, el mar a lo lejos. Corta, pero se combina con otra ruta.', acceso: 'Autobús de temporada desde Yamato-Kamiichi' },
      en: { sub: 'Hidegatake and the Daijagura cliff', nota: 'One of the rainiest places in Japan: cloud forest, a rock balcony over 800 m of void and, with luck, the sea in the distance. Short, so we pair it with another route.', acceso: 'Seasonal bus from Yamato-Kamiichi' },
      ar: { sub: 'هيديغاتاكه وجرف دايجاغورا', nota: 'من أكثر أماكن اليابان مطراً: غابة ضباب وشرفة صخرية فوق ٨٠٠ م من الفراغ، وربما البحر من بعيد. قصيرة، لذلك نجمعها بمسار آخر.', acceso: 'حافلة موسمية من ياماتو-كاميئيتشي' },
      ru: { sub: 'Хидэгатакэ и утёс Дайдзягура', nota: 'Одно из самых дождливых мест Японии: туманный лес, скальный балкон над 800 м пустоты и, если повезёт, море вдали. Короткий, поэтому совмещаем с другим маршрутом.', acceso: 'Сезонный автобус от Ямато-Камиити' },
    },
  },
]

export interface TextosCumbres {
  menu: string
  banda: { titulo: string; cifras: [string, string, string] }
  kicker: string
  titulo: string
  sub: string
  filtros: Record<'todas' | Nivel, string>
  et: { km: string; desnivel: string; horas: string; cima: string; acceso: string; meses: string; alltrails: string; pedir: string; precio: string }
  sellos: Record<Cumbre['sellos'][number], string>
  nivelDesc: Record<Nivel, string>
  apps: { titulo: string; sub: string; alltrails: string; yamap: string }
  equipo: { titulo: string; sub: string; seguro: string; alquiler: string; aviso: string }
  fuente: string
  faq: { titulo: string; items: { q: string; a: string }[] }
  saludo: (ruta: string) => string
}

const MESES: Record<Lengua, string[]> = {
  es: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  en: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  ar: ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠', '١١', '١٢'],
  ru: ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д'],
}
export const letraMes = (lang: Lengua, m: number) => MESES[lang][m - 1]

export const TEXTOS_CUMBRES: Record<Lengua, TextosCumbres> = {
  es: {
    menu: 'Rutas pro',
    banda: { titulo: 'Más alto. Más lejos. Más duro.', cifras: ['metros: el techo de Kansai', 'km: la vuelta a Kioto por la montaña', 'm de desnivel en un solo día'] },
    kicker: 'Nivel pro · Kansai',
    titulo: 'Diez cumbres para quien ya lo ha hecho todo',
    sub: 'Desnivel de verdad, travesías de un día entero y montes que casi ningún extranjero pisa. Datos de cada ruta en AllTrails; nosotros ponemos el guía, la logística y el ritmo.',
    filtros: { todas: 'Todas', exigente: 'Exigente', experto: 'Experto', ultra: 'Ultra' },
    et: { km: 'km', desnivel: 'D+ m', horas: 'horas', cima: 'Cima', acceso: 'Salida', meses: 'Temporada', alltrails: 'Ruta en AllTrails', pedir: 'La quiero con guía', precio: 'Precio cerrado por WhatsApp' },
    sellos: { unesco: 'UNESCO', hyakumeizan: '百名山 · 100 montes de Japón', techo: 'Techo de Kansai', 'varios-dias': 'Por etapas' },
    nivelDesc: { exigente: 'Rutas largas o con mucho desnivel. Buena forma física.', experto: 'Más de 1.000 m de desnivel y 6 h o más. Experiencia en montaña.', ultra: 'Más de 25 km o varios días. Solo para gente muy entrenada.' },
    apps: {
      titulo: 'Con la ruta en el móvil',
      sub: 'Antes de venir, mira la ruta en AllTrails: perfil, fotos y opiniones de quien la ha hecho. En Japón, el guía navega además con YAMAP, la app que usan los montañeros japoneses.',
      alltrails: 'Abrir AllTrails',
      yamap: 'Abrir YAMAP',
    },
    equipo: {
      titulo: 'Seguro y equipo',
      sub: 'En la montaña japonesa un rescate puede costar miles de euros: ven con un seguro que cubra senderismo. Si no quieres cargar con botas, crampones o mochila, alquílalos en Japón y te los mandan al hotel.',
      seguro: 'Seguro de viaje',
      alquiler: 'Alquiler de equipo',
      aviso: 'Algunos enlaces son de afiliado: si contratas, recibo una pequeña comisión sin coste para ti.',
    },
    fuente: 'Distancia, desnivel y horas: AllTrails, octubre de 2026.',
    faq: {
      titulo: 'Preguntas de senderistas con experiencia',
      items: [
        { q: '¿Cuál es la montaña más alta de Kansai?', a: 'El Hakkyōgadake (八経ヶ岳), con 1.915 m, en los montes Ōmine de Nara. Es uno de los 100 montes célebres de Japón. La ruta por el monte Misen tiene 11,6 km y 1.102 m de desnivel positivo.' },
        { q: '¿Qué rutas exigentes hay cerca de Osaka y Kioto?', a: 'La media travesía de Hira (32 km, 2.000 m D+), el Bunagatake (14 km, 1.462 m D+), la travesía de Rokkō sobre Kobe (27 km), el Kyoto Isshu Trail (82 km por etapas), el Ōkumotori-goe del Kumano Kodō y la subida a Kōyasan por el Chōishi-michi.' },
        { q: '¿Qué app usar para hacer senderismo en Japón?', a: 'AllTrails para preparar la ruta desde casa, en español o en inglés. En Japón, YAMAP es la más usada: mapas sin conexión, avisos de cierres y los registros de miles de montañeros japoneses.' },
        { q: '¿Hace falta guía en la montaña japonesa?', a: 'No es obligatorio, pero ayuda: las señales y avisos de cierre están en japonés, los últimos autobuses de montaña salen pronto y en Kii y Hira hay osos. El guía organiza el transporte, el horario y el plan B si cambia el tiempo.' },
        { q: '¿Cuándo es la mejor época para el senderismo en Kansai?', a: 'De octubre a noviembre y de abril a mayo. En verano hace mucho calor y humedad por debajo de 1.000 m; en invierno, el Bunagatake y Hira tienen nieve y piden material de invierno.' },
      ],
    },
    saludo: (r) => `Hola Tony, te escribo desde la página de montaña (nivel pro).\n\nRuta: ${r}\nFechas:\nPersonas:\nExperiencia en montaña:`,
  },
  en: {
    menu: 'Pro routes',
    banda: { titulo: 'Higher. Further. Harder.', cifras: ['metres: the roof of Kansai', 'km: the loop around Kyoto by its peaks', 'm of gain in a single day'] },
    kicker: 'Pro level · Kansai',
    titulo: 'Ten summits for hikers who have done it all',
    sub: 'Real elevation gain, full-day traverses and mountains almost no foreigner sets foot on. Route data from AllTrails; we bring the guide, the logistics and the pace.',
    filtros: { todas: 'All', exigente: 'Demanding', experto: 'Expert', ultra: 'Ultra' },
    et: { km: 'km', desnivel: 'gain m', horas: 'hours', cima: 'Summit', acceso: 'Start', meses: 'Season', alltrails: 'Route on AllTrails', pedir: 'I want it guided', precio: 'Fixed price on WhatsApp' },
    sellos: { unesco: 'UNESCO', hyakumeizan: '百名山 · 100 Famous Mountains', techo: 'Roof of Kansai', 'varios-dias': 'In stages' },
    nivelDesc: { exigente: 'Long routes or a lot of climbing. Good fitness.', experto: 'Over 1,000 m of gain and 6 h or more. Mountain experience.', ultra: 'Over 25 km or several days. For very fit hikers only.' },
    apps: {
      titulo: 'The route on your phone',
      sub: 'Before you come, check the route on AllTrails: profile, photos and reviews from people who have done it. In Japan the guide also navigates with YAMAP, the app Japanese mountaineers use.',
      alltrails: 'Open AllTrails',
      yamap: 'Open YAMAP',
    },
    equipo: {
      titulo: 'Insurance and gear',
      sub: 'A mountain rescue in Japan can cost thousands: come with travel insurance that covers hiking. If you would rather not carry boots, crampons or a pack, rent them in Japan and have them sent to your hotel.',
      seguro: 'Travel insurance',
      alquiler: 'Gear rental',
      aviso: 'Some links are affiliate links: if you buy, I get a small commission at no cost to you.',
    },
    fuente: 'Distance, gain and time: AllTrails, October 2026.',
    faq: {
      titulo: 'Questions from experienced hikers',
      items: [
        { q: 'What is the highest mountain in Kansai?', a: 'Hakkyōgadake (八経ヶ岳), 1,915 m, in the Ōmine range of Nara. It is one of Japan\'s 100 Famous Mountains. The route via Mt. Misen is 11.6 km with 1,102 m of elevation gain.' },
        { q: 'What are the hardest hikes near Osaka and Kyoto?', a: 'The Hira half traverse (32 km, 2,000 m gain), Bunagatake (14 km, 1,462 m gain), the Rokkō traverse above Kobe (27 km), the Kyoto Isshu Trail (82 km in stages), the Ōkumotori-goe on the Kumano Kodō and the Chōishi-michi climb to Kōyasan.' },
        { q: 'Which app should I use for hiking in Japan?', a: 'AllTrails to plan the route from home in English. In Japan, YAMAP is the most used: offline maps, closure alerts and the tracks of thousands of Japanese hikers.' },
        { q: 'Do I need a guide in the Japanese mountains?', a: 'It is not required, but it helps: signs and closure notices are in Japanese, the last mountain buses leave early, and there are bears in the Kii and Hira ranges. The guide handles transport, timing and plan B if the weather turns.' },
        { q: 'When is the best season for hiking in Kansai?', a: 'October to November and April to May. Summer is very hot and humid below 1,000 m; in winter Bunagatake and Hira have snow and need winter gear.' },
      ],
    },
    saludo: (r) => `Hi Tony, I'm writing from the hiking page (pro level).\n\nRoute: ${r}\nDates:\nPeople:\nMountain experience:`,
  },
  ar: {
    menu: 'مسارات المحترفين',
    banda: { titulo: 'أعلى. أبعد. أصعب.', cifras: ['متراً: سقف كانساي', 'كم: الدورة حول كيوتو عبر قممها', 'م صعوداً في يوم واحد'] },
    kicker: 'مستوى المحترفين · كانساي',
    titulo: 'عشر قمم لمن جرّب كل شيء',
    sub: 'ارتفاع حقيقي، وعبور يوم كامل، وجبال لا يكاد يطؤها أجنبي. بيانات كل مسار من AllTrails، ونحن نوفّر المرشد والتنظيم والإيقاع.',
    filtros: { todas: 'الكل', exigente: 'شاق', experto: 'خبير', ultra: 'تحمّل' },
    et: { km: 'كم', desnivel: 'صعود م', horas: 'ساعات', cima: 'القمة', acceso: 'الانطلاق', meses: 'الموسم', alltrails: 'المسار على AllTrails', pedir: 'أريده مع مرشد', precio: 'سعر ثابت عبر واتساب' },
    sellos: { unesco: 'اليونسكو', hyakumeizan: '百名山 · جبال اليابان المئة', techo: 'سقف كانساي', 'varios-dias': 'على مراحل' },
    nivelDesc: { exigente: 'مسارات طويلة أو كثيرة الصعود. لياقة جيدة.', experto: 'أكثر من ١٠٠٠ م صعوداً و٦ ساعات أو أكثر. خبرة جبلية.', ultra: 'أكثر من ٢٥ كم أو عدة أيام. للمتدرّبين جيداً فقط.' },
    apps: {
      titulo: 'المسار في هاتفك',
      sub: 'قبل أن تأتي، اطّلع على المسار في AllTrails: المقطع والصور وآراء من سلكوه. وفي اليابان يستخدم المرشد أيضاً YAMAP، تطبيق متسلّقي الجبال اليابانيين.',
      alltrails: 'افتح AllTrails',
      yamap: 'افتح YAMAP',
    },
    equipo: {
      titulo: 'التأمين والمعدات',
      sub: 'قد تكلّف عملية إنقاذ في جبال اليابان آلاف اليوروهات: تعال بتأمين سفر يغطي المشي الجبلي. وإن لم ترغب في حمل الأحذية أو المسامير الثلجية أو الحقيبة، استأجرها في اليابان وتصلك إلى الفندق.',
      seguro: 'تأمين السفر',
      alquiler: 'استئجار المعدات',
      aviso: 'بعض الروابط روابط تسويق: إن اشتريت عبرها أحصل على عمولة صغيرة دون أي كلفة عليك.',
    },
    fuente: 'المسافة والصعود والوقت: AllTrails، أكتوبر ٢٠٢٦.',
    faq: {
      titulo: 'أسئلة المتنزّهين ذوي الخبرة',
      items: [
        { q: 'ما أعلى جبل في كانساي؟', a: 'هاكّيوغاداكه (八経ヶ岳) بارتفاع ١٩١٥ م في سلسلة أومينه في نارا، وهو من جبال اليابان المئة الشهيرة. المسار عبر جبل ميسن ١١٫٦ كم بصعود ١١٠٢ م.' },
        { q: 'ما أصعب المسارات قرب أوساكا وكيوتو؟', a: 'نصف عبور هيرا (٣٢ كم، ٢٠٠٠ م صعوداً)، وبوناغاتاكه (١٤ كم، ١٤٦٢ م)، وعبور روكّو فوق كوبي (٢٧ كم)، ودرب كيوتو الدائري (٨٢ كم على مراحل)، وأوكوموتوري-غوي في كومانو كودو، والصعود إلى كوياسان عبر تشوئيشي-ميتشي.' },
        { q: 'أي تطبيق أستخدم للمشي الجبلي في اليابان؟', a: 'AllTrails لتحضير المسار من بيتك. وفي اليابان YAMAP هو الأكثر استخداماً: خرائط بلا إنترنت، وتنبيهات الإغلاق، ومسارات آلاف المتسلّقين اليابانيين.' },
        { q: 'هل أحتاج مرشداً في جبال اليابان؟', a: 'ليس إلزامياً لكنه يفيد: اللافتات وإعلانات الإغلاق باليابانية، وآخر حافلات الجبل تغادر باكراً، وفي جبال كي وهيرا دببة. المرشد يرتّب النقل والتوقيت والخطة البديلة إن تغيّر الطقس.' },
        { q: 'ما أفضل موسم للمشي في كانساي؟', a: 'من أكتوبر إلى نوفمبر ومن أبريل إلى مايو. الصيف حار ورطب جداً تحت ١٠٠٠ م، وفي الشتاء يغطي الثلج بوناغاتاكه وهيرا ويلزم عتاد شتوي.' },
      ],
    },
    saludo: (r) => `السلام عليكم يا طوني، أراسلك من صفحة الجبال (مستوى المحترفين).\n\nالمسار: ${r}\nالتواريخ:\nعدد الأشخاص:\nالخبرة الجبلية:`,
  },
  ru: {
    menu: 'Про-маршруты',
    banda: { titulo: 'Выше. Дальше. Труднее.', cifras: ['метров: крыша Кансая', 'км: круг вокруг Киото по вершинам', 'м набора за один день'] },
    kicker: 'Уровень про · Кансай',
    titulo: 'Десять вершин для тех, кто уже прошёл всё',
    sub: 'Настоящий набор высоты, траверсы на целый день и горы, где почти не бывает иностранцев. Данные маршрутов — из AllTrails; от нас гид, логистика и темп.',
    filtros: { todas: 'Все', exigente: 'Сложные', experto: 'Эксперт', ultra: 'Ультра' },
    et: { km: 'км', desnivel: 'набор м', horas: 'часов', cima: 'Вершина', acceso: 'Старт', meses: 'Сезон', alltrails: 'Маршрут в AllTrails', pedir: 'Хочу с гидом', precio: 'Цена в WhatsApp' },
    sellos: { unesco: 'ЮНЕСКО', hyakumeizan: '百名山 · 100 знаменитых гор', techo: 'Крыша Кансая', 'varios-dias': 'По этапам' },
    nivelDesc: { exigente: 'Длинные маршруты или большой набор. Хорошая форма.', experto: 'Больше 1000 м набора и от 6 часов. Опыт в горах.', ultra: 'Больше 25 км или несколько дней. Только для хорошо подготовленных.' },
    apps: {
      titulo: 'Маршрут в телефоне',
      sub: 'До поездки посмотрите маршрут в AllTrails: профиль, фото и отзывы тех, кто его прошёл. В Японии гид ведёт ещё и по YAMAP — приложению японских альпинистов.',
      alltrails: 'Открыть AllTrails',
      yamap: 'Открыть YAMAP',
    },
    equipo: {
      titulo: 'Страховка и снаряжение',
      sub: 'Спасательная операция в горах Японии может стоить тысячи евро: приезжайте со страховкой, которая покрывает треккинг. Не хотите везти ботинки, кошки или рюкзак — возьмите их в аренду в Японии с доставкой в отель.',
      seguro: 'Страховка для поездки',
      alquiler: 'Аренда снаряжения',
      aviso: 'Часть ссылок партнёрские: если вы оформите покупку, я получу небольшую комиссию без доплаты с вашей стороны.',
    },
    fuente: 'Расстояние, набор и время: AllTrails, октябрь 2026.',
    faq: {
      titulo: 'Вопросы опытных туристов',
      items: [
        { q: 'Какая самая высокая гора Кансая?', a: 'Хаккёгатакэ (八経ヶ岳), 1915 м, хребет Оминэ в префектуре Нара. Входит в список 100 знаменитых гор Японии. Маршрут через гору Мисэн — 11,6 км и 1102 м набора.' },
        { q: 'Какие сложные маршруты есть рядом с Осакой и Киото?', a: 'Половина траверса Хира (32 км, 2000 м набора), Бунагатакэ (14 км, 1462 м), траверс Рокко над Кобе (27 км), Kyoto Isshu Trail (82 км по этапам), Окумотори-гоэ на Кумано Кодо и подъём на Коя-сан по Тёиси-мити.' },
        { q: 'Какое приложение нужно для походов в Японии?', a: 'AllTrails — чтобы подготовить маршрут из дома. В Японии чаще всего используют YAMAP: офлайн-карты, сообщения о закрытиях и треки тысяч японских туристов.' },
        { q: 'Нужен ли гид в японских горах?', a: 'Не обязательно, но помогает: указатели и объявления о закрытии на японском, последние горные автобусы уходят рано, а в горах Кии и Хира водятся медведи. Гид берёт на себя транспорт, время и запасной план при смене погоды.' },
        { q: 'Когда лучший сезон для походов в Кансае?', a: 'С октября по ноябрь и с апреля по май. Летом ниже 1000 м очень жарко и влажно; зимой на Бунагатакэ и Хира снег и нужно зимнее снаряжение.' },
      ],
    },
    saludo: (r) => `Здравствуйте, Ларион! Пишу со страницы походов (уровень про).\n\nМаршрут: ${r}\nДаты:\nСколько человек:\nОпыт в горах:`,
  },
}
