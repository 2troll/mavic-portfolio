// Páginas de ciudad (v8): una por ciudad, para ver más que leer. Cada zona
// lleva una sola línea por idioma; la foto y el movimiento hacen el resto.
// Fotos de zona: public/v8/zonas/{id}.webp (créditos en creditosZonas.json).

import { META, PRECIO } from '../v7/datosRutas'
import type { RutaId, Tramo } from '../v7/datosRutas'
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
    lema: t('La cocina de Japón. Aquí vivo.', 'Japan\'s kitchen. I live here.', 'مطبخ اليابان، وهنا أعيش.', 'Кухня Японии: рынки, неон и уличная еда.'),
    montes: ['minoh-falls', 'mt-ikoma', 'mt-kongo', 'hoshi-no-buranko', 'sky-house-daito'],
    zonas: [
      { id: 'osaka-castillo', kanji: '大阪城', nombre: t('Castillo de Osaka', 'Osaka Castle', 'قلعة أوساكا', 'Осакский замок'), linea: t('Fosos gigantes y el parque de los cerezos.', 'Giant moats and a park full of cherry trees.', 'خنادق عملاقة وحديقة أشجار الكرز.', 'Гигантские рвы и парк сакуры.') },
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

/** Viñetas manga (public/v8/manga/{guia}-{ciudad}.webp). Vacío desde el 7-10:
 *  después de aprobarlas dijo que el manga «no me gusta para nada» y que le
 *  hacía mayor; las ciudades ya usan tinta sacada de fotos reales. */
export const MANGA_APROBADO: string[] = []

/** Figuras manga recortadas (public/v8/figuras/{guia}-{ciudad}.webp) que se
 *  plantan de pie dentro de las fotos de las zonas. Se añaden según se generan. */
// Hiroshima no lleva figura: la pista empieza en la Cúpula de la Bomba y un
// personaje manga sonriendo delante de un memorial no toca.
// Vacío hasta tener las figuras nuevas (Gemini, con su foto de referencia).
export const FIGURAS: string[] = []

// ── SEO de las ciudades (A09/A10, análisis de IA de octubre de 2026) ──────
// La gente (y los asistentes de IA) buscan «guía privado en español en Kioto»,
// «Private guide in Kyoto», «مرشد سياحي يتكلم عربي في كيوتو» o «русский гид в
// Киото», y miran el precio. El lema es para la portada, no para Google: aquí
// va lo que se busca, con el precio sacado de los mismos tramos que las tarjetas.

/** «en Kioto», «в Хиросиме и на Миядзиме»: el ruso declina y no vale el nombre tal cual.
 *  «Más lejos» no es una búsqueda: se nombran sus sitios. */
const EN_LUGAR: Record<CiudadId, T> = {
  osaka: t('en Osaka', 'in Osaka', 'في أوساكا', 'в Осаке'),
  kyoto: t('en Kioto', 'in Kyoto', 'في كيوتو', 'в Киото'),
  nara: t('en Nara', 'in Nara', 'في نارا', 'в Наре'),
  kobe: t('en Kobe', 'in Kobe', 'في كوبي', 'в Кобе'),
  himeji: t('en Himeji', 'in Himeji', 'في هيميجي', 'в Химэдзи'),
  hiroshima: t('en Hiroshima y Miyajima', 'in Hiroshima & Miyajima', 'في هيروشيما وميياجيما', 'в Хиросиме и на Миядзиме'),
  beyond: t('en Kōyasan y Kumano', 'in Kōyasan & Kumano', 'في كوياسان وكومانو', 'на Коясане и в Кумано'),
}

/** Tramos que se ofrecen en cada ciudad (igual que tramos() de Mosaico, que no
 *  se importa aquí para no hacer un círculo ciudades ⇄ Mosaico). */
function tramosCiudad(id: CiudadId): Tramo[] {
  const ruta = CIUDADES[id].diorama
  return [...new Set(ruta ? META[ruta].tramos : (['lejos'] as Tramo[]))]
}

/** Precio más bajo de la ciudad, por grupo. */
export function precioDesde(id: CiudadId): number {
  return Math.min(...tramosCiudad(id).map((x) => PRECIO[x]))
}

/** Mismo formato de yenes que las tarjetas del mosaico. */
function yenes(n: number, lang: Lengua): string {
  const f = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'es-ES').format(n)
  return lang === 'ru' ? `${f} ¥` : lang === 'ar' ? `${f} ين` : lang === 'en' ? `¥${f}` : `${f} ¥`
}

/** Números con las cifras de cada idioma (el árabe de la web usa ٤، ٦…). */
const num = (n: number, lang: Lengua) => (lang === 'ar' ? new Intl.NumberFormat('ar-EG').format(n) : String(n))

/** En mitad de una frase, «Castillo de Osaka» se escribe «castillo de Osaka» y
 *  «Гора Мисэн», «гора Мисэн»: la palabra genérica va en minúscula. */
const GENERICAS: Partial<Record<Lengua, string[]>> = {
  es: ['Castillo', 'Mercado', 'Monte', 'Cascada', 'Lago', 'Jardín', 'Parque', 'Mezquita', 'El'],
  en: ['The'],
  ru: ['Гора', 'Замок', 'Рынок', 'Парк', 'Сад', 'Водопад', 'Озеро', 'Мечеть'],
}
function enFrase(nombre: string, lang: Lengua): string {
  const [primera] = nombre.split(' ')
  return GENERICAS[lang]?.includes(primera) ? primera.toLowerCase() + nombre.slice(primera.length) : nombre
}

/** «a, b y c» en cada idioma. */
function lista(cosas: string[], lang: Lengua): string {
  const y = { es: ' y ', en: ' and ', ar: ' و', ru: ' и ' }[lang]
  return cosas.length < 2 ? cosas.join('') : `${cosas.slice(0, -1).join(lang === 'ar' ? '، ' : ', ')}${y}${cosas[cosas.length - 1]}`
}

/** Mayúscula al empezar frase (para el árabe no cambia nada). */
const mayus = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const zonasEnFrase = (id: CiudadId, lang: Lengua, n: number) => lista(CIUDADES[id].zonas.slice(0, n).map((z) => enFrase(z.nombre[lang], lang)), lang)

/** Título para Google: la búsqueda exacta y el precio desde. */
export function tituloSeo(id: CiudadId, lang: Lengua, guia: 'tony' | 'larion'): string {
  const donde = EN_LUGAR[id][lang]
  const desde = yenes(precioDesde(id), lang)
  const t: Record<Lengua, string> = {
    es: `Guía privado en español ${donde}, desde ${desde}`,
    en: guia === 'larion' ? `Private guide ${donde} (Russian, English), from ${desde}` : `Private guide ${donde}, from ${desde}`,
    ar: `مرشد سياحي يتكلم العربية ${donde}، من ${desde}`,
    ru: `Русскоязычный гид ${donde} — Ларион, от ${desde}`,
  }
  return `${t[lang]} | Tony Kansai Guide`
}

/** Encabezado de la página: lo mismo que se busca, sin el precio. */
export function h1Ciudad(id: CiudadId, lang: Lengua, guia: 'tony' | 'larion'): string {
  const donde = EN_LUGAR[id][lang]
  return {
    es: `Guía privado ${donde} en español`,
    en: guia === 'larion' ? `Private guide ${donde}, in Russian or English` : `Private guide ${donde}`,
    ar: `مرشد خاص ${donde} بالعربية`,
    ru: `Гид ${donde} на русском`,
  }[lang]
}

/** Descripción (~155 caracteres): quién, idioma, qué se ve, recogida, grupo y precio.
 *  En «tú»: la página en español la leen a la vez España y Latinoamérica. */
export function descripcionSeo(id: CiudadId, lang: Lengua, guia: 'tony' | 'larion'): string {
  // Tres zonas si cabe; si pasa de lo que enseña Google, dos.
  const larga = descripcionCon(id, lang, guia, 3)
  return larga.length <= 158 ? larga : descripcionCon(id, lang, guia, 2)
}

function descripcionCon(id: CiudadId, lang: Lengua, guia: 'tony' | 'larion', n: number): string {
  const donde = EN_LUGAR[id][lang]
  const zonas = zonasEnFrase(id, lang, n)
  const desde = yenes(precioDesde(id), lang)
  if (guia === 'larion') {
    return lang === 'ru'
      ? `Русскоязычный гид ${donde}: ${zonas}. Ларион встретит вас в лобби отеля. Только ваша группа (до 6 человек), от ${desde} за группу.`
      : `Private guide ${donde} in Russian or English: ${zonas}. Larion meets you at your hotel. Up to 6 people, from ${desde} per group.`
  }
  return {
    es: `Guía privado en español ${donde}: ${zonas}. Tony te recoge en el hotel, solo tu grupo (hasta 6), desde ${desde} por grupo.`,
    en: `Private guide ${donde}: ${zonas}. Tony picks you up at your hotel, just your group (up to 6), from ${desde} per group.`,
    ar: `مرشد سياحي يتكلم العربية ${donde}: ${zonas}. يستقبلكم طوني في الفندق، لمجموعتكم وحدها (حتى ${num(6, 'ar')} أشخاص)، من ${desde} للمجموعة.`,
    ru: `Гид ${donde}: ${zonas}.`,
  }[lang]
}

export interface PreguntaCiudad { q: string; a: string }

/** 6 preguntas frecuentes por ciudad (para la sección visible y el FAQPage).
 *  Solo datos que ya están en la web: precios y horas de los tramos, grupo de
 *  hasta 6 al precio estándar (Tony organiza hasta 14), recogida en el hotel,
 *  pago y cancelación de contenido.ts. Nada de años, licencias ni nº de tours. */
export function faqCiudad(id: CiudadId, lang: Lengua, guia: 'tony' | 'larion'): PreguntaCiudad[] {
  const donde = EN_LUGAR[id][lang]
  const tr = tramosCiudad(id)
  const zonas = zonasEnFrase(id, lang, 5)
  const y = (x: Tramo) => yenes(PRECIO[x], lang)
  const n = (k: number) => num(k, lang)

  // Precio: medio día y día completo, o «desde» en los viajes largos.
  const precio: Record<Lengua, string> = {
    es: tr.includes('lejos')
      ? `Desde ${y('lejos')} por grupo, el día entero; te paso un precio cerrado según la ruta. Es por grupo de hasta 6 personas, no por persona. Trenes, entradas y comidas aparte.`
      : `${mayus([tr.includes('medio') && `Medio día (4 horas): ${y('medio')}`, tr.includes('completo') && `día completo (8 horas): ${y('completo')}`].filter(Boolean).join('; '))}. Es el precio por grupo de hasta 6 personas, no por persona. Trenes, entradas y comidas aparte.`,
    en: tr.includes('lejos')
      ? `From ${y('lejos')} per group for the full day; I send you a fixed price for your route. That is per group of up to 6, not per person. Trains, tickets and meals are extra.`
      : `${mayus([tr.includes('medio') && `Half day (4 hours): ${y('medio')}`, tr.includes('completo') && `full day (8 hours): ${y('completo')}`].filter(Boolean).join('; '))}. That is per group of up to 6, not per person. Trains, tickets and meals are extra.`,
    ar: tr.includes('lejos')
      ? `من ${y('lejos')} للمجموعة لليوم كاملاً، وأرسل لك سعراً ثابتاً حسب المسار. السعر للمجموعة حتى ${n(6)} أشخاص لا للفرد، والقطارات والتذاكر والطعام على حسابكم.`
      : `${[tr.includes('medio') && `نصف يوم (${n(4)} ساعات): ${y('medio')}`, tr.includes('completo') && `يوم كامل (${n(8)} ساعات): ${y('completo')}`].filter(Boolean).join('، ')}. السعر للمجموعة حتى ${n(6)} أشخاص لا للفرد، والقطارات والتذاكر والطعام على حسابكم.`,
    ru: tr.includes('lejos')
      ? `От ${y('lejos')} за группу на целый день; точную цену назову под ваш маршрут. Это цена за группу до 6 человек, а не с человека. Поезда, входные билеты и еда оплачиваются отдельно.`
      : `${mayus([tr.includes('medio') && `Полдня (4 часа): ${y('medio')}`, tr.includes('completo') && `целый день (8 часов): ${y('completo')}`].filter(Boolean).join('; '))}. Это цена за группу до 6 человек, а не с человека. Поезда, входные билеты и еда оплачиваются отдельно.`,
  }

  if (guia === 'larion') {
    if (lang === 'ru') return [
      { q: `Сколько стоит частный гид ${donde}?`, a: precio.ru },
      { q: 'Вы встречаете в отеле?', a: 'Да. Встречаю вас в лобби отеля, и дальше едем вместе.' },
      { q: `Что посмотрим ${donde}?`, a: `${mayus(zonas)}. Маршрут подстрою под вас: скажите, что хотите увидеть.` },
      { q: 'Как оплатить?', a: 'Наличными в иенах в день экскурсии или переводом, если договоримся при бронировании.' },
      { q: 'А если нас больше шести?', a: 'Цены рассчитаны на группу до 6 человек. Если вас больше, напишите мне, и я расскажу, как это организовать.' },
      { q: 'А если планы изменятся?', a: 'Напишите мне. Отмена более чем за 72 часа бесплатна, а если задержали рейс — найдём другой день.' },
    ]
    return [
      { q: `How much is a private guide ${donde}?`, a: precio.en },
      { q: 'Do you meet us at the hotel?', a: 'Yes. Larion meets you in your hotel lobby and you set off together.' },
      { q: `What will we see ${donde}?`, a: `${mayus(zonas)}. The route is adapted to you: tell Larion what you would like to see.` },
      { q: 'How do I pay?', a: 'In cash, in yen, on the day, or by bank transfer if you agree it when booking.' },
      { q: 'What if there are more than 6 of us?', a: 'Prices are for groups of up to 6. If you are more, message Larion and he will tell you how to organise it.' },
      { q: 'What if my plans change?', a: 'Message Larion. Cancelling more than 72 hours ahead costs nothing, and if your flight is delayed he finds you another day.' },
    ]
  }

  const tony: Record<Lengua, PreguntaCiudad[]> = {
    es: [
      { q: `¿Cuánto cuesta un guía privado en español ${donde}?`, a: precio.es },
      { q: '¿Me recoges en el hotel?', a: 'Sí. Quedamos en el vestíbulo de tu hotel, esté en Osaka, Kioto, Nara o Kobe, y salimos juntos.' },
      { q: `¿Qué vemos ${donde}?`, a: `${mayus(zonas)}. El recorrido lo ajusto a ti: dime qué quieres ver.` },
      { q: '¿Cómo se paga?', a: 'En efectivo, en yenes, el día del tour. Si prefieres pagar por adelantado, cuando confirmemos la fecha puedes hacerlo con PayPal o Wise. Cancelar con más de 72 horas no cuesta nada.' },
      { q: '¿Y si somos más de 6?', a: 'Los precios son para grupos de hasta 6 personas. Hasta 14 también se puede: escríbeme y te digo cómo lo organizamos.' },
      { q: '¿Podemos ir con niños o con personas mayores?', a: 'Claro. Adapto el ritmo y el recorrido; algunos templos tienen muchas escaleras y te propongo alternativas.' },
    ],
    en: [
      { q: `How much is a private guide ${donde}?`, a: precio.en },
      { q: 'Do you pick us up at the hotel?', a: 'Yes. We meet in your hotel lobby, whether you are staying in Osaka, Kyoto, Nara or Kobe, and set off together.' },
      { q: `What will we see ${donde}?`, a: `${mayus(zonas)}. I adapt the route to you: tell me what you would like to see.` },
      { q: 'How do I pay?', a: 'In cash, in yen, on the day. If you prefer to pay in advance, once we confirm the date you can use PayPal or Wise. Cancelling more than 72 hours ahead costs nothing.' },
      { q: 'What if there are more than 6 of us?', a: 'Prices are for groups of up to 6. Groups of up to 14 are possible too: message me and I will tell you how we organise it.' },
      { q: 'Can we bring children or older relatives?', a: 'Of course. I adapt the pace and the route; some temples have a lot of steps and I suggest alternatives.' },
    ],
    ar: [
      { q: `كم سعر المرشد الخاص الذي يتكلم العربية ${donde}؟`, a: precio.ar },
      { q: 'هل تستقبلنا في الفندق؟', a: 'نعم. نلتقي في بهو فندقكم، سواء كان في أوساكا أو كيوتو أو نارا أو كوبي، وننطلق معاً.' },
      { q: `ماذا نزور ${donde}؟`, a: `${zonas}. وأرتّب المسار على ذوقكم: أخبروني بما تحبون رؤيته.` },
      { q: 'كيف أدفع؟', a: 'نقداً بالين في يوم الجولة. وإن فضّلت الدفع مسبقاً فبعد تأكيد الموعد يمكنك الدفع عبر PayPal أو Wise. والإلغاء قبل أكثر من ٧٢ ساعة مجاني.' },
      { q: 'هل يوجد طعام حلال ووقت للصلاة؟', a: 'نعم. أنا مسلم وأعرف الأماكن الحلال الموثوقة، وأضع وقفات الصلاة في المسار من البداية. أخبرني عند الحجز.' },
      { q: 'وماذا لو كنا أكثر من ستة؟', a: `الأسعار لمجموعات حتى ${n(6)} أشخاص، ويمكن أن تصل المجموعة إلى ${n(14)} شخصاً: راسلني وأخبرك كيف ننظّم الأمر.` },
    ],
    ru: [],
  }
  return tony[lang].length ? tony[lang] : tony.en
}

/** FAQPage para Google y los asistentes: las mismas preguntas que se ven en la página. */
export function faqLd(id: CiudadId, lang: Lengua, guia: 'tony' | 'larion') {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: faqCiudad(id, lang, guia).map((p) => ({ '@type': 'Question', name: p.q, acceptedAnswer: { '@type': 'Answer', text: p.a } })),
  }
}
