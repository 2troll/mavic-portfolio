// Páginas de ciudad (v8): una por ciudad, para ver más que leer. Cada zona
// lleva una sola línea por idioma; la foto y el movimiento hacen el resto.
// Fotos de zona: public/v8/zonas/{id}.webp (créditos en creditosZonas.json).

import type { RutaId } from '../v7/datosRutas'
import type { ItinId } from '../v7/datosItinerarios'

export type Lengua = 'es' | 'en' | 'ar' | 'ru'
export type CiudadId = 'osaka' | 'kyoto' | 'nara' | 'kobe' | 'himeji' | 'hiroshima' | 'beyond'
type T = Record<Lengua, string>

export interface Zona { id: string; kanji: string; nombre: T; linea: T; tour?: string }
export interface Ciudad {
  id: CiudadId; kanji: string; nombre: T; lema: T
  diorama?: RutaId; itinerario?: ItinId; montes: string[]; guias: ('tony' | 'larion')[]
  zonas: Zona[]
}

const t = (es: string, en: string, ar: string, ru: string): T => ({ es, en, ar, ru })

export const CIUDADES: Record<CiudadId, Ciudad> = {
  osaka: {
    id: 'osaka', kanji: '大阪', diorama: 'osaka', itinerario: 'osaka', guias: ['tony', 'larion'],
    nombre: t('Osaka', 'Osaka', 'أوساكا', 'Осака'),
    lema: t('La cocina de Japón. Aquí vivo.', 'Japan\'s kitchen. I live here.', 'مطبخ اليابان، وهنا أعيش.', 'Кухня Японии. Здесь я живу.'),
    montes: ['minoh-falls', 'mt-ikoma', 'mt-kongo', 'hoshi-no-buranko', 'sky-house-daito'],
    zonas: [
      { id: 'osaka-castillo', kanji: '大阪城', nombre: t('Castillo de Osaka', 'Osaka Castle', 'قلعة أوساكا', 'Замок Осаки'), linea: t('Fosos gigantes y el parque de los cerezos.', 'Giant moats and a park full of cherry trees.', 'خنادق عملاقة وحديقة أشجار الكرز.', 'Гигантские рвы и парк сакуры.') },
      { id: 'osaka-dotonbori', kanji: '道頓堀', nombre: t('Dōtonbori', 'Dōtonbori', 'دوتونبوري', 'Дотонбори'), linea: t('Neones, canal y takoyaki recién hechos.', 'Neon, canal and fresh takoyaki.', 'أضواء النيون والقناة وتاكوياكي طازج.', 'Неон, канал и горячие такояки.'), tour: 'osaka-food' },
      { id: 'osaka-kuromon', kanji: '黒門市場', nombre: t('Mercado de Kuromon', 'Kuromon Market', 'سوق كورومون', 'Рынок Куромон'), linea: t('Se come de pie, puesto a puesto.', 'You eat standing up, stall by stall.', 'نأكل واقفين من كشك إلى كشك.', 'Едим стоя, от прилавка к прилавку.'), tour: 'osaka-food' },
      { id: 'osaka-shinsekai', kanji: '新世界', nombre: t('Shinsekai', 'Shinsekai', 'شينسيكاي', 'Синсэкай'), linea: t('La Osaka retro bajo la torre Tsūtenkaku.', 'Retro Osaka under Tsūtenkaku Tower.', 'أوساكا القديمة تحت برج تسوتينكاكو.', 'Ретро-Осака под башней Цутэнкаку.'), tour: 'osaka-food' },
      { id: 'osaka-umeda', kanji: '梅田', nombre: t('Umeda Sky', 'Umeda Sky', 'أوميدا سكاي', 'Умэда Скай'), linea: t('La ciudad entera a tus pies al atardecer.', 'The whole city at your feet at sunset.', 'المدينة كلها تحت قدميك عند الغروب.', 'Весь город у ваших ног на закате.') },
      { id: 'osaka-minoh', kanji: '箕面', nombre: t('Minoh', 'Minoh', 'مينو', 'Мино'), linea: t('Bosque, cascada y tempura de hoja de arce.', 'Forest, waterfall and maple-leaf tempura.', 'غابة وشلال وتمبورا أوراق القيقب.', 'Лес, водопад и темпура из кленовых листьев.') },
      { id: 'osaka-sumiyoshi', kanji: '住吉大社', nombre: t('Sumiyoshi Taisha', 'Sumiyoshi Taisha', 'سوميوشي تايشا', 'Сумиёси Тайся'), linea: t('El puente rojo más empinado de Osaka.', 'Osaka\'s steepest red bridge.', 'أشدّ جسور أوساكا الحمراء انحداراً.', 'Самый крутой красный мост Осаки.') },
      { id: 'osaka-nakanoshima', kanji: '中之島', nombre: t('Nakanoshima', 'Nakanoshima', 'ناكانوشيما', 'Наканосима'), linea: t('Una isla entre dos ríos, de ladrillo y rosas.', 'An island between two rivers, with brick buildings and roses.', 'جزيرة بين نهرين، بمبانٍ من الطوب وحدائق ورود.', 'Остров между двух рек: кирпич и розы.') },
    ],
  },
  kyoto: {
    id: 'kyoto', kanji: '京都', diorama: 'kioto', itinerario: 'kioto', guias: ['tony', 'larion'],
    nombre: t('Kioto', 'Kyoto', 'كيوتو', 'Киото'),
    lema: t('Mil años de capital, a 30 minutos.', 'A thousand-year capital, 30 minutes away.', 'عاصمة ألف عام على بُعد ٣٠ دقيقة.', 'Тысячелетняя столица в 30 минутах.'),
    montes: ['fushimi-inari', 'mt-hiei', 'mt-atago', 'mt-daimonji'],
    zonas: [
      { id: 'kioto-fushimi', kanji: '伏見稲荷', nombre: t('Fushimi Inari', 'Fushimi Inari', 'فوشيمي إيناري', 'Фусими Инари'), linea: t('Miles de torii rojos montaña arriba.', 'Thousands of red torii up the mountain.', 'آلاف بوابات توري الحمراء صعوداً.', 'Тысячи красных тории вверх по горе.'), tour: 'hidden-kyoto' },
      { id: 'kioto-kiyomizu', kanji: '清水寺', nombre: t('Kiyomizu-dera', 'Kiyomizu-dera', 'كيوميزو-ديرا', 'Киёмидзу-дэра'), linea: t('Un escenario de madera sin un solo clavo.', 'A wooden stage without a single nail.', 'منصة خشبية بلا مسمار واحد.', 'Деревянная сцена без единого гвоздя.') },
      { id: 'kioto-gion', kanji: '祇園', nombre: t('Gion', 'Gion', 'غيون', 'Гион'), linea: t('Casas de té y calles de piedra al anochecer.', 'Teahouses and stone lanes at dusk.', 'بيوت الشاي وأزقة حجرية عند الغروب.', 'Чайные домики и каменные улочки в сумерках.'), tour: 'hidden-kyoto' },
      { id: 'kioto-arashiyama', kanji: '嵐山', nombre: t('Arashiyama', 'Arashiyama', 'أراشيياما', 'Арасияма'), linea: t('El bosque de bambú y el río Katsura.', 'The bamboo grove and the Katsura River.', 'غابة الخيزران ونهر كاتسورا.', 'Бамбуковая роща и река Кацура.'), tour: 'arashiyama-sagano' },
      { id: 'kioto-kinkakuji', kanji: '金閣寺', nombre: t('Pabellón Dorado', 'Golden Pavilion', 'الجناح الذهبي', 'Золотой павильон'), linea: t('Oro sobre el agua del estanque.', 'Gold reflected in the pond.', 'ذهب ينعكس على ماء البركة.', 'Золото в отражении пруда.') },
      { id: 'kioto-uji', kanji: '宇治', nombre: t('Uji', 'Uji', 'أوجي', 'Удзи'), linea: t('El mejor matcha y el templo del fénix.', 'The finest matcha and the Phoenix Hall.', 'أجود الماتشا وقاعة العنقاء.', 'Лучшая матча и Павильон феникса.'), tour: 'uji-matcha' },
      { id: 'kioto-ginkakuji', kanji: '哲学の道', nombre: t('Camino del Filósofo', 'Philosopher\'s Path', 'درب الفيلسوف', 'Тропа философа'), linea: t('Un canal entre cerezos hasta el Pabellón de Plata.', 'A canal under cherry trees to the Silver Pavilion.', 'قناة تحت أشجار الكرز حتى الجناح الفضي.', 'Канал под сакурой до Серебряного павильона.') },
      { id: 'kioto-nishiki', kanji: '錦市場', nombre: t('Mercado de Nishiki', 'Nishiki Market', 'سوق نيشيكي', 'Рынок Нисики'), linea: t('Cuatrocientos años de cocina de Kioto.', 'Four hundred years of Kyoto cooking.', 'أربعمئة عام من مطبخ كيوتو.', 'Четыреста лет киотской кухни.') },
    ],
  },
  nara: {
    id: 'nara', kanji: '奈良', diorama: 'nara', itinerario: 'nara', guias: ['tony', 'larion'],
    nombre: t('Nara', 'Nara', 'نارا', 'Нара'),
    lema: t('Ciervos sueltos y el Gran Buda.', 'Free-roaming deer and the Great Buddha.', 'غزلان طليقة وتمثال بوذا الكبير.', 'Свободные олени и Большой Будда.'),
    montes: ['mt-wakakusa', 'mt-yoshino', 'mt-kasagi'],
    zonas: [
      { id: 'nara-parque', kanji: '奈良公園', nombre: t('Parque de Nara', 'Nara Park', 'حديقة نارا', 'Парк Нара'), linea: t('Más de mil ciervos que te saludan.', 'Over a thousand deer that bow to you.', 'أكثر من ألف غزال ينحني لك.', 'Больше тысячи оленей, которые кланяются.'), tour: 'nara-sacred' },
      { id: 'nara-todaiji', kanji: '東大寺', nombre: t('Tōdai-ji', 'Tōdai-ji', 'توداي-جي', 'Тодай-дзи'), linea: t('Un Buda de 15 metros bajo un techo de madera.', 'A 15-metre Buddha under a wooden roof.', 'تمثال بارتفاع ١٥ متراً تحت سقف خشبي.', '15-метровый Будда под деревянной крышей.'), tour: 'nara-sacred' },
      { id: 'nara-kasuga', kanji: '春日大社', nombre: t('Kasuga Taisha', 'Kasuga Taisha', 'كاسوغا تايشا', 'Касуга Тайся'), linea: t('Mil faroles de piedra cubiertos de musgo.', 'A thousand moss-covered stone lanterns.', 'ألف فانوس حجري تكسوها الطحالب.', 'Тысяча каменных фонарей во мху.'), tour: 'nara-sacred' },
      { id: 'nara-naramachi', kanji: 'ならまち', nombre: t('Naramachi', 'Naramachi', 'ناراماتشي', 'Нарамати'), linea: t('Casas de comerciantes de hace siglos.', 'Centuries-old merchant houses.', 'بيوت تجار عمرها قرون.', 'Купеческие дома возрастом в века.') },
      { id: 'nara-yoshino', kanji: '吉野山', nombre: t('Yoshino', 'Yoshino', 'يوشينو', 'Ёсино'), linea: t('Treinta mil cerezos en una montaña.', 'Thirty thousand cherry trees on one mountain.', 'ثلاثون ألف شجرة كرز على جبل واحد.', 'Тридцать тысяч сакур на одной горе.') },
    ],
  },
  kobe: {
    id: 'kobe', kanji: '神戸', diorama: 'kobe', itinerario: 'kobe', guias: ['tony'],
    nombre: t('Kobe', 'Kobe', 'كوبي', 'Кобе'),
    lema: t('Puerto, montaña y la mezquita más antigua.', 'Harbour, mountains and Japan\'s oldest mosque.', 'ميناء وجبل وأقدم مسجد في اليابان.', 'Порт, горы и старейшая мечеть Японии.'),
    montes: ['mt-rokko', 'mt-maya', 'nunobiki-falls'],
    zonas: [
      { id: 'kobe-mezquita', kanji: '神戸モスク', nombre: t('Mezquita de Kobe', 'Kobe Mosque', 'مسجد كوبي', 'Мечеть Кобе'), linea: t('1935. Sobrevivió a la guerra y al terremoto.', '1935. It survived the war and the earthquake.', '١٩٣٥. صمد في الحرب والزلزال.', '1935 год. Пережила войну и землетрясение.'), tour: 'kobe-refined' },
      { id: 'kobe-kitano', kanji: '北野', nombre: t('Kitano', 'Kitano', 'كيتانو', 'Китано'), linea: t('Las casas de los comerciantes europeos.', 'The European merchants\' houses.', 'بيوت التجار الأوروبيين.', 'Дома европейских купцов.'), tour: 'kobe-refined' },
      { id: 'kobe-harbor', kanji: '神戸港', nombre: t('El puerto', 'The harbour', 'الميناء', 'Порт'), linea: t('La torre roja encendida sobre el mar.', 'The red tower lit up over the sea.', 'البرج الأحمر المضاء فوق البحر.', 'Красная башня в огнях над морем.'), tour: 'kobe-refined' },
      { id: 'kobe-nankinmachi', kanji: '南京町', nombre: t('Nankinmachi', 'Nankinmachi', 'نانكينماتشي', 'Нанкинмати'), linea: t('Barrio chino para comer andando.', 'Chinatown street food, eaten on the move.', 'الحي الصيني، والأكل أثناء المشي.', 'Чайнатаун: едим на ходу.') },
      { id: 'kobe-nunobiki', kanji: '布引の滝', nombre: t('Cascada Nunobiki', 'Nunobiki Falls', 'شلال نونوبيكي', 'Водопад Нунобики'), linea: t('Una cascada a diez minutos del tren bala.', 'A waterfall ten minutes from the bullet train.', 'شلال على بُعد عشر دقائق من القطار السريع.', 'Водопад в десяти минутах от синкансэна.') },
      { id: 'kobe-arima', kanji: '有馬温泉', nombre: t('Arima Onsen', 'Arima Onsen', 'أريما أونسن', 'Арима Онсэн'), linea: t('Aguas termales de oro y plata.', 'Gold and silver hot springs.', 'ينابيع حارة ذهبية وفضية.', 'Золотые и серебряные источники.') },
      { id: 'kobe-rokko', kanji: '六甲山', nombre: t('Monte Rokko', 'Mount Rokko', 'جبل روكّو', 'Гора Рокко'), linea: t('La bahía entera iluminada de noche.', 'The whole bay lit up at night.', 'الخليج كله مضاء ليلاً.', 'Весь залив в огнях ночью.') },
    ],
  },
  himeji: {
    id: 'himeji', kanji: '姫路', diorama: 'himeji', itinerario: 'himeji', guias: ['tony', 'larion'],
    nombre: t('Himeji', 'Himeji', 'هيميجي', 'Химэдзи'),
    lema: t('El castillo blanco, intacto desde 1609.', 'The white castle, intact since 1609.', 'القلعة البيضاء، كما هي منذ ١٦٠٩.', 'Белый замок, нетронутый с 1609 года.'),
    montes: [],
    zonas: [
      { id: 'himeji-castillo', kanji: '姫路城', nombre: t('Castillo de Himeji', 'Himeji Castle', 'قلعة هيميجي', 'Замок Химэдзи'), linea: t('Seis pisos de madera original, por dentro.', 'Six floors of original wood, inside.', 'ستة طوابق من الخشب الأصلي من الداخل.', 'Шесть этажей подлинного дерева внутри.') },
      { id: 'himeji-kokoen', kanji: '好古園', nombre: t('Jardín Kōko-en', 'Kōko-en Garden', 'حديقة كوكو-إن', 'Сад Кокоэн'), linea: t('Nueve jardines y estanques de carpas.', 'Nine gardens and carp ponds.', 'تسع حدائق وبرك أسماك الكوي.', 'Девять садов и пруды с карпами.') },
      { id: 'himeji-engyoji', kanji: '圓教寺', nombre: t('Engyō-ji', 'Engyō-ji', 'إنغيو-جي', 'Энгё-дзи'), linea: t('El monasterio de «El último samurái».', 'The monastery from "The Last Samurai".', 'دير فيلم «الساموراي الأخير».', 'Монастырь из «Последнего самурая».') },
    ],
  },
  hiroshima: {
    id: 'hiroshima', kanji: '広島', diorama: 'miyajima', itinerario: 'hiroshima', guias: ['tony', 'larion'],
    nombre: t('Hiroshima y Miyajima', 'Hiroshima & Miyajima', 'هيروشيما وميياجيما', 'Хиросима и Миядзима'),
    lema: t('La ciudad de la paz y el torii en el mar.', 'The city of peace and the torii in the sea.', 'مدينة السلام والتوري في البحر.', 'Город мира и тории в море.'),
    montes: [],
    zonas: [
      { id: 'hiroshima-cupula', kanji: '原爆ドーム', nombre: t('Cúpula de la Bomba', 'Atomic Bomb Dome', 'قبة القنبلة الذرية', 'Атомный купол'), linea: t('El edificio que eligió quedarse en pie.', 'The building left standing, on purpose.', 'المبنى الذي أُبقي قائماً عن قصد.', 'Здание, оставленное стоять намеренно.') },
      { id: 'hiroshima-miyajima', kanji: '厳島', nombre: t('Miyajima', 'Miyajima', 'ميياجيما', 'Миядзима'), linea: t('Con marea alta, el torii flota.', 'At high tide the torii floats.', 'مع المدّ تطفو بوابة التوري.', 'В прилив тории словно плывёт по воде.') },
      { id: 'hiroshima-misen', kanji: '弥山', nombre: t('Monte Misen', 'Mount Misen', 'جبل ميسن', 'Гора Мисэн'), linea: t('El mar interior de Seto desde arriba.', 'The Seto Inland Sea from above.', 'بحر سيتو الداخلي من الأعلى.', 'Внутреннее море Сэто сверху.') },
    ],
  },
  beyond: {
    id: 'beyond', kanji: '遠出', guias: ['tony'],
    nombre: t('Más lejos', 'Further afield', 'أبعد من ذلك', 'Дальше'),
    lema: t('Un día entero para lo que pocos ven.', 'A full day for what few people see.', 'يوم كامل لما يراه القليلون.', 'Целый день для того, что видят немногие.'),
    montes: ['mt-kongo', 'fukuchiyama-tunnels', 'zato-valley'],
    zonas: [
      { id: 'lejos-koyasan', kanji: '高野山', nombre: t('Kōyasan', 'Kōyasan', 'كوياسان', 'Коясан'), linea: t('Un bosque de cedros y mil años de calma.', 'A cedar forest and a thousand years of quiet.', 'غابة أرز وألف عام من السكينة.', 'Кедровый лес и тысяча лет тишины.'), tour: 'koyasan' },
      { id: 'lejos-kumano', kanji: '熊野古道', nombre: t('Kumano Kodo', 'Kumano Kodo', 'كومانو كودو', 'Кумано Кодо'), linea: t('El camino antiguo hasta la cascada de Nachi.', 'The ancient trail to Nachi Falls.', 'الدرب القديم حتى شلال ناتشي.', 'Древняя тропа к водопаду Нати.'), tour: 'kumano-kodo' },
      { id: 'lejos-amanohashidate', kanji: '天橋立', nombre: t('Amanohashidate', 'Amanohashidate', 'أمانوهاشيداتي', 'Аманохасидатэ'), linea: t('Un puente de pinos sobre el mar.', 'A bridge of pines across the sea.', 'جسر من الصنوبر فوق البحر.', 'Мост из сосен через море.'), tour: 'amanohashidate-ine' },
      { id: 'lejos-ine', kanji: '伊根', nombre: t('Ine', 'Ine', 'إينه', 'Инэ'), linea: t('Casas de pescadores que flotan.', 'Fishermen\'s houses that float.', 'بيوت صيادين تطفو على الماء.', 'Рыбацкие дома на воде.'), tour: 'amanohashidate-ine' },
      { id: 'lejos-hikone', kanji: '彦根城', nombre: t('Castillo de Hikone', 'Hikone Castle', 'قلعة هيكونه', 'Замок Хиконэ'), linea: t('Uno de los doce castillos originales.', 'One of Japan\'s twelve original castles.', 'واحدة من القلاع الأصلية الاثنتي عشرة.', 'Один из двенадцати подлинных замков.'), tour: 'biwa-hikone' },
      { id: 'lejos-biwa', kanji: '琵琶湖', nombre: t('Lago Biwa', 'Lake Biwa', 'بحيرة بيوا', 'Озеро Бива'), linea: t('Un torii dentro del lago más grande de Japón.', 'A torii in Japan\'s largest lake.', 'بوابة توري في أكبر بحيرة في اليابان.', 'Тории в крупнейшем озере Японии.'), tour: 'biwa-hikone' },
    ],
  },
}

/** Qué ciudades enseña cada guía y en qué orden. */
export const CIUDADES_TONY: CiudadId[] = ['osaka', 'kyoto', 'nara', 'kobe', 'himeji', 'hiroshima', 'beyond']
export const CIUDADES_LARION: CiudadId[] = ['hiroshima', 'kyoto', 'nara', 'osaka', 'himeji']

/** Viñetas manga aprobadas por él (public/v8/manga/{guia}-{ciudad}.webp).
 *  Sólo se enseñan las que estén aquí: nunca una imagen sin su visto bueno. */
export const MANGA_APROBADO: string[] = [
  'tony-kyoto', 'tony-osaka', 'tony-nara', 'tony-kobe', 'tony-himeji', 'tony-hiroshima', 'tony-beyond',
  'larion-hiroshima', 'larion-kyoto', 'larion-nara', 'larion-osaka', 'larion-himeji',
]

/** Figuras manga recortadas (public/v8/figuras/{guia}-{ciudad}.webp) que se
 *  plantan de pie dentro de las fotos de las zonas. Se añaden según se generan. */
// Hiroshima no lleva figura: la pista empieza en la Cúpula de la Bomba y un
// personaje manga sonriendo delante de un memorial no toca.
// Vacío hasta tener las figuras nuevas (Gemini, con su foto de referencia).
export const FIGURAS: string[] = []

/** Título para Google: lo que la gente busca («guía privado en Kioto en
 *  español»), no el lema. «Más lejos» no es una búsqueda: se nombran sus sitios. */
export function tituloSeo(id: CiudadId, lang: Lengua, guia: 'tony' | 'larion'): string {
  const c = CIUDADES[id]
  const lugar = id === 'beyond'
    ? ({ es: 'Kōyasan y Kumano', en: 'Kōyasan & Kumano', ar: 'كوياسان وكومانو', ru: 'Коя-сан и Кумано' } as Record<Lengua, string>)[lang]
    : c.nombre[lang]
  const t: Record<Lengua, string> = {
    es: `Guía privado en ${lugar} en español`,
    en: guia === 'larion' ? `Private guide in ${lugar} (Russian, English)` : `Private tour guide in ${lugar}`,
    ar: `مرشد سياحي خاص في ${lugar} بالعربية`,
    ru: `${lugar}: частный гид на русском`,
  }
  return `${t[lang]} | Tony Kansai Guide`
}
