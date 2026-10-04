// La historia manga en blanco y negro: lo que dice el guía en cada viñeta y un
// poema corto por ciudad. Frases sobre los sitios (verdaderas y comprobables),
// nunca datos inventados sobre los guías.
// Viñetas: public/v8/historia/{guia}-{ciudad}-{a|b|c}.webp y {guia}-dia-{1..4}.webp

import type { CiudadId, Lengua } from './ciudades'

type T = Record<Lengua, string>
const t = (es: string, en: string, ar: string, ru: string): T => ({ es, en, ar, ru })

export interface Capitulo { a: T; b: T; c: T; poema: T }

export const HISTORIA: Record<CiudadId, Capitulo> = {
  osaka: {
    a: t('¡Bienvenidos a Osaka! Aquí se viene a comer.', 'Welcome to Osaka! People come here to eat.', 'أهلاً بكم في أوساكا! هنا يأتي الناس ليأكلوا.', 'Добро пожаловать в Осаку! Сюда приезжают поесть.'),
    b: t('El castillo se empezó en 1583. La torre de hoy se reconstruyó en 1931.', 'The castle was begun in 1583. Today\'s keep was rebuilt in 1931.', 'بدأ بناء القلعة عام 1583، والبرج الحالي أُعيد بناؤه عام 1931.', 'Замок начали строить в 1583 году. Нынешнюю башню восстановили в 1931-м.'),
    c: t('Takoyaki recién hecho: sopla antes de morder.', 'Fresh takoyaki: blow before you bite.', 'تاكوياكي طازج: انفخ قبل أن تعضّ.', 'Такояки прямо с огня: подуйте, прежде чем кусать.'),
    poema: t('Luces sobre el canal —\nel río huele a calle\ny la calle, a fiesta.', 'Lights on the canal —\nthe river smells of the street,\nthe street of a festival.', 'أضواءٌ على القناة —\nالنهر يفوح برائحة الشارع\nوالشارع برائحة العيد.', 'Огни над каналом —\nрека пахнет улицей,\nа улица — праздником.'),
  },
  kyoto: {
    a: t('Fushimi Inari: miles de torii donados, monte arriba.', 'Fushimi Inari: thousands of donated torii, all the way up the mountain.', 'فوشيمي إيناري: آلاف بوابات التوري المُهداة على طول الجبل.', 'Фусими Инари: тысячи подаренных тории до самой вершины.'),
    b: t('Este escenario de madera se sostiene sin un solo clavo.', 'This wooden stage stands without a single nail.', 'هذه المنصة الخشبية قائمة دون مسمار واحد.', 'Эта деревянная сцена держится без единого гвоздя.'),
    c: t('En Gion, sin prisa: estas calles se ven despacio.', 'In Gion, no rush: these streets are seen slowly.', 'في غيون لا عجلة: هذه الشوارع تُرى على مهل.', 'В Гионе не спешим: эти улицы смотрят медленно.'),
    poema: t('Puerta roja tras puerta —\nsubes contando torii\ny pierdes la cuenta.', 'Red gate after red gate —\nyou climb counting torii\nand lose count.', 'بوابةٌ حمراء تلو أخرى —\nتصعد وأنت تعدّها\nثم تنسى العدد.', 'Красные врата за вратами —\nидёшь и считаешь тории\nи сбиваешься со счёта.'),
  },
  nara: {
    a: t('Todai-ji guarda un Buda de bronce de quince metros.', 'Todai-ji houses a fifteen-metre bronze Buddha.', 'يضمّ معبد تودايجي تمثالاً برونزياً لبوذا بطول خمسة عشر متراً.', 'В Тодай-дзи стоит пятнадцатиметровый бронзовый Будда.'),
    b: t('Los ciervos saludan con la cabeza. Salúdales: así piden galleta.', 'The deer bow. Bow back: that\'s how they ask for a cracker.', 'الغزلان تنحني للتحية. انحنِ لها أيضاً: هكذا تطلب البسكويت.', 'Олени кланяются. Поклонитесь в ответ — так они просят печенье.'),
    c: t('Kasuga Taisha: unas tres mil linternas, todas regaladas.', 'Kasuga Taisha: some three thousand lanterns, every one a gift.', 'كاسوغا تايشا: نحو ثلاثة آلاف فانوس، كلّها هدايا.', 'Касуга-тайся: около трёх тысяч фонарей, и все подарены.'),
    poema: t('Un ciervo se inclina —\ny el que venía a mirar\nacaba saludando.', 'A deer bows its head —\nand the one who came to look\nends up bowing too.', 'غزالٌ يحني رأسه —\nومن جاء ليتفرّج\nينحني هو أيضاً.', 'Олень склонил голову —\nи тот, кто пришёл смотреть,\nкланяется в ответ.'),
  },
  kobe: {
    a: t('Kobe vive entre el mar y la montaña.', 'Kobe lives between the sea and the mountains.', 'كوبي تعيش بين البحر والجبل.', 'Кобе живёт между морем и горами.'),
    b: t('La Mezquita de Kobe es de 1935: la más antigua de Japón.', 'The Kobe Mosque dates from 1935: the oldest in Japan.', 'مسجد كوبي بُني عام 1935، وهو أقدم مسجد في اليابان.', 'Мечеть Кобе построена в 1935 году — старейшая в Японии.'),
    c: t('En Kitano vivían los comerciantes extranjeros del puerto.', 'Kitano is where the port\'s foreign merchants once lived.', 'في كيتانو سكن تجّار الميناء الأجانب قديماً.', 'В Китано когда-то жили иностранные купцы порта.'),
    poema: t('Suena un barco —\nla montaña lo devuelve\ncon voz más suave.', 'A ship\'s horn sounds —\nthe mountain sends it back\nin a softer voice.', 'صفّارة سفينة —\nيردّها الجبل\nبصوتٍ أرقّ.', 'Гудок корабля —\nгора возвращает его\nтише и мягче.'),
  },
  himeji: {
    a: t('La Garza Blanca: el castillo original mejor conservado de Japón.', 'The White Heron: Japan\'s best-preserved original castle.', 'مالك الحزين الأبيض: أفضل قلعة أصلية محفوظة في اليابان.', 'Белая цапля — лучше всех сохранившийся подлинный замок Японии.'),
    b: t('Seis pisos de madera original: pisas suelos de 1609.', 'Six floors of original wood: you walk on floors from 1609.', 'ستة طوابق من الخشب الأصلي: تمشي على أرضٍ من عام 1609.', 'Шесть этажей подлинного дерева: вы ступаете по полу 1609 года.'),
    c: t('Al lado, Kōko-en: nueve jardines y sus carpas.', 'Next door, Kōko-en: nine gardens and their koi.', 'وبجانبها حديقة كوكو-إن: تسع حدائق وأسماك الكوي.', 'Рядом — Коко-эн: девять садов и их карпы.'),
    poema: t('Tejados de nieve —\nla garza no echa a volar\nen cuatro siglos.', 'Roofs white as snow —\nthe heron has not flown off\nin four hundred years.', 'سطوحٌ بيضاء كالثلج —\nمالك الحزين لم يطِر\nمنذ أربعة قرون.', 'Крыши белы, как снег, —\nцапля не улетает\nуже четыре века.'),
  },
  hiroshima: {
    a: t('Con la marea alta, el torii de Miyajima parece flotar.', 'At high tide, Miyajima\'s torii seems to float.', 'عند المدّ تبدو بوابة توري في ميياجيما عائمة.', 'В прилив тории Миядзимы словно плывут по воде.'),
    b: t('Aquí se viene en silencio. La Cúpula sigue en pie para recordar.', 'Here we come in silence. The Dome still stands, to remember.', 'هنا نأتي بصمت. ما زالت القبة قائمة لنتذكّر.', 'Сюда приходят молча. Купол стоит, чтобы помнить.'),
    c: t('Okonomiyaki de Hiroshima: por capas y con fideos.', 'Hiroshima okonomiyaki: layered, with noodles.', 'أوكونومياكي هيروشيما: طبقات مع المعكرونة.', 'Окономияки по-хиросимски: слоями и с лапшой.'),
    poema: t('Sube la marea —\nla puerta camina al mar\ny el mar la sostiene.', 'The tide rises —\nthe gate walks into the sea\nand the sea holds it up.', 'يرتفع المدّ —\nتمشي البوابة في البحر\nوالبحر يسندها.', 'Прилив поднялся —\nворота шагнули в море,\nи море их держит.'),
  },
  beyond: {
    a: t('Okunoin, en Kōyasan: cedros de siglos y doscientas mil lápidas.', 'Okunoin on Mount Kōya: centuries-old cedars and two hundred thousand gravestones.', 'أوكونوين في جبل كويا: أرزٌ عمره قرون ومئتا ألف شاهد.', 'Окуноин на горе Коя: вековые криптомерии и двести тысяч надгробий.'),
    b: t('Kumano Kodo: caminos de peregrinos de hace mil años.', 'Kumano Kodo: pilgrim roads a thousand years old.', 'كومانو كودو: دروب مشاةٍ عمرها ألف عام.', 'Кумано Кодо: тропы паломников тысячелетней давности.'),
    c: t('Amanohashidate: un puente de pinos sobre el mar.', 'Amanohashidate: a bridge of pines across the sea.', 'أمانوهاشيداته: جسرٌ من الصنوبر فوق البحر.', 'Аманохасидатэ: мост из сосен через море.'),
    poema: t('Lejos de la ciudad —\nel camino se hace musgo\ny el musgo, silencio.', 'Far from the city —\nthe path turns into moss,\nthe moss into silence.', 'بعيداً عن المدينة —\nيصير الطريق طحلباً\nويصير الطحلب صمتاً.', 'Вдали от города —\nтропа становится мхом,\nа мох — тишиной.'),
  },
}

/** «Un día con nosotros» en la página de cada guía: lo que pasa, viñeta a viñeta. */
export const DIA: Record<'es' | 'en' | 'ar' | 'ru', { titulo: string; vinetas: [string, string, string, string]; poema: string }> = {
  es: {
    titulo: 'Un día conmigo',
    vinetas: ['Te recojo en el hotel por la mañana. Sin agencias: soy yo.', 'En el tren te cuento lo que vamos viendo por la ventana.', 'Vamos a tu ritmo. Si un sitio te gusta, nos quedamos.', '¡Hasta la próxima! Escríbeme cuando vuelvas.'],
    poema: 'Un día no es un viaje —\npero un buen día\nse queda contigo.',
  },
  en: {
    titulo: 'A day with me',
    vinetas: ['I pick you up at your hotel in the morning. No agency: just me.', 'On the train I tell you what we see out of the window.', 'We go at your pace. If you like a place, we stay.', 'See you next time! Message me when you\'re back.'],
    poema: 'One day is not a trip —\nbut a good day\nstays with you.',
  },
  ar: {
    titulo: 'يومٌ معي',
    vinetas: ['أمرّ عليك في الفندق صباحاً. بلا وكالة: أنا بنفسي.', 'في القطار أحدّثك عمّا نراه من النافذة.', 'نمشي على راحتك. إن أعجبك مكان، نبقى فيه.', 'إلى اللقاء! راسلني حين تعود.'],
    poema: 'يومٌ واحد ليس رحلة —\nلكنّ اليوم الجميل\nيبقى معك.',
  },
  ru: {
    titulo: 'Один день со мной',
    vinetas: ['Встречаю вас утром в отеле. Без агентства — только я.', 'В поезде рассказываю, что мы видим за окном.', 'Идём в вашем темпе. Понравилось место — остаёмся.', 'До встречи! Напишите, когда вернётесь.'],
    poema: 'Один день — не путешествие,\nно хороший день\nостаётся с тобой.',
  },
}

/** Qué capítulos tienen ya sus viñetas generadas y revisadas. */
/** Capítulos con viñeta: la foto real de la ciudad pasada a tinta (public/v8/historia/tinta-{ciudad}.webp),
 *  sin personas inventadas. «Un día conmigo» (tony-dia / larion-dia) queda fuera. */
export const HISTORIA_LISTA: string[] = [
  'tony-osaka', 'tony-kyoto', 'tony-nara', 'tony-kobe', 'tony-himeji', 'tony-hiroshima', 'tony-beyond',
  'larion-hiroshima', 'larion-kyoto', 'larion-nara', 'larion-osaka', 'larion-himeji',
]

/** Rótulos de la sección en cada idioma. */
export const ROTULOS: Record<Lengua, { capitulo: string; enCiudad: (c: string) => string; poema: string }> = {
  es: { capitulo: 'Capítulo', enCiudad: (c) => `Un día en ${c}`, poema: 'Poema' },
  en: { capitulo: 'Chapter', enCiudad: (c) => `A day in ${c}`, poema: 'Poem' },
  ar: { capitulo: 'الفصل', enCiudad: (c) => `يومٌ في ${c}`, poema: 'قصيدة' },
  ru: { capitulo: 'Глава', enCiudad: (c) => `Один день: ${c}`, poema: 'Стихотворение' },
}
