// Cómo se consigue la ventaja de cada socio y sus condiciones, tal como las pidió
// cada uno por correo (resumen en ~/Documents/Trabajo/Colaboraciones/colaboraciones-2026-11-16.md).
// La página de ventajas las enseña como un paso claro («pon esto en el comentario»,
// «enseña el logo») y como chips de condiciones, en vez de un párrafo suelto.
// NO van aquí los códigos de agencia (Maikoya ag-special, InKansai HANMA, Camellia
// de agente…): esos solo los usa Tony al reservar.
import type { Lang } from './datosVentajas'

/**
 * codigo     → se copia un código y se pega al pagar (sale de `codigo` en datosVentajas.ts)
 * comentario → se escribe una frase en las notas de la reserva
 * nombre     → se dice «Tony Hanma» al reservar
 * logo       → se enseña en recepción el pase de Tony Kansai Guide (desde el móvil)
 * conmigo    → la ventaja solo existe si reserva Tony (tarifa o código de agencia)
 * directo    → sin descuento: se reserva en su web; lo recomiendo igual
 */
export type Canje = 'codigo' | 'comentario' | 'nombre' | 'logo' | 'conmigo' | 'directo'

export const CANJE: Record<string, { tipo: Canje; texto?: string }> = {
  // Código que se pega al pagar
  wargo: { tipo: 'codigo' }, camellia: { tipo: 'codigo' }, ninjacafe: { tipo: 'codigo' },
  foodsample: { tipo: 'codigo' }, koto: { tipo: 'codigo' },
  // Frase en las notas de la reserva (Tea Ceremony Osaka 16-11, Yumeyakata 15-10, Unplugged 13-11)
  teaosaka: { tipo: 'comentario', texto: 'Tony Kansai Guide' },
  yumeyakata: { tipo: 'comentario', texto: 'ガイド番号1085 (Tony Hanma)' },
  unplugged: { tipo: 'comentario', texto: 'Tony Kansai Guide　Tony Hanma' },
  // Decir el nombre (SnapKyoto, Matt, 15-10)
  snapkyoto: { tipo: 'nombre', texto: 'Tony Hanma (Tony Kansai Guide)' },
  // Enseñar el logo en recepción (Kuchinotsu, Fukuda, 14-11)
  kuchinotsu: { tipo: 'logo' },
  // Solo reservando con Tony
  samurai: { tipo: 'conmigo' }, maikoyate: { tipo: 'conmigo' }, shaquda: { tipo: 'conmigo' },
  kobaien: { tipo: 'conmigo' }, okamoto: { tipo: 'conmigo' }, shogun: { tipo: 'conmigo' },
  towerknives: { tipo: 'conmigo' }, hamanasu: { tipo: 'conmigo' }, kanemasa: { tipo: 'conmigo' },
  fujioutdoor: { tipo: 'conmigo' }, // coordino e interpreto; el intérprete entra gratis (correo 16-11)
}

export const canjeDe = (clave: string): Canje => CANJE[clave]?.tipo ?? 'directo'

/** Condiciones cortas de cada socio (chips). Solo lo que dijeron por escrito o está en su web. */
export const REGLAS: Record<string, Record<Lang, string[]>> = {
  teaosaka: {
    es: ['Hasta 10 personas', '7.480 ¥ adulto · 4.980 ¥ de 8 a 11 años', 'Dulces halal, sin alcohol'],
    en: ['Up to 10 people', '¥7,480 adult · ¥4,980 ages 8–11', 'Halal sweets, no alcohol'],
    ar: ['حتى 10 أشخاص', '7,480 ين للبالغ · 4,980 ين من 8 إلى 11 سنة', 'حلويات حلال بلا كحول'],
    ru: ['До 10 человек', '7480 ¥ взрослый · 4980 ¥ дети 8–11 лет', 'Халяльные сладости, без алкоголя'],
  },
  ninjacafe: {
    es: ['En todas sus tiendas', 'Grupos privados de 15 a 20: por correo', 'Curry con salsa halal; el café no es halal'],
    en: ['At all their shops', 'Private groups of 15–20: by email', 'Curry with halal sauce; the café is not halal'],
    ar: ['في جميع فروعهم', 'مجموعات خاصة من 15 إلى 20: بالبريد', 'كاري بصلصة حلال؛ المقهى ليس حلالًا'],
    ru: ['Во всех их кафе', 'Частные группы 15–20 человек: по почте', 'Карри с халяльным соусом; кафе не халяль'],
  },
  camellia: {
    es: ['Solo online, hasta 24 h antes', 'Todas sus casas de té y el kimono', 'Traducción solo en ceremonia privada'],
    en: ['Online only, up to 24 h before', 'All their tea houses and kimono', 'Translation only in a private ceremony'],
    ar: ['عبر الإنترنت فقط، حتى 24 ساعة قبل الموعد', 'كل بيوت الشاي والكيمونو', 'الترجمة فقط في الحفل الخاص'],
    ru: ['Только онлайн, до 24 ч до начала', 'Все их чайные дома и кимоно', 'Перевод — только на частной церемонии'],
  },
  wargo: {
    es: ['Hasta el 31-12-2026', 'Todas sus tiendas, también Osaka'],
    en: ['Until 31 Dec 2026', 'All their shops, Osaka too'],
    ar: ['حتى 31 ديسمبر 2026', 'كل الفروع، وأوساكا أيضًا'],
    ru: ['До 31.12.2026', 'Во всех салонах, и в Осаке тоже'],
  },
  foodsample: {
    es: ['En TableCheck, campo «PROMO CODE»', 'La comida no es halal: hay plan sin comida'],
    en: ['On TableCheck, “PROMO CODE” field', 'The food is not halal: there is a no-food plan'],
    ar: ['في TableCheck، خانة «PROMO CODE»', 'الطعام ليس حلالًا: يوجد خيار بلا طعام'],
    ru: ['В TableCheck, поле «PROMO CODE»', 'Еда не халяль: есть вариант без еды'],
  },
  koto: {
    es: ['Hasta 10 personas', 'Conmigo traduzco gratis'],
    en: ['Up to 10 people', 'With me, free translation'],
    ar: ['حتى 10 أشخاص', 'معي، الترجمة مجانًا'],
    ru: ['До 10 человек', 'С нами перевод бесплатно'],
  },
  yumeyakata: {
    es: ['Solo con reserva previa', 'Tienen sala de oración'],
    en: ['Advance booking only', 'They have a prayer room'],
    ar: ['بالحجز المسبق فقط', 'لديهم غرفة للصلاة'],
    ru: ['Только по предварительной записи', 'Есть комната для молитвы'],
  },
  unplugged: {
    es: ['−500 ¥ por persona', 'Reserva al menos 3 días antes', 'Pago el día: efectivo, PayPay o tarjeta'],
    en: ['−¥500 per person', 'Book at least 3 days ahead', 'Pay on the day: cash, PayPay or card'],
    ar: ['خصم 500 ين للشخص', 'احجز قبل 3 أيام على الأقل', 'الدفع يوم النشاط: نقدًا أو PayPay أو بطاقة'],
    ru: ['−500 ¥ с человека', 'Бронируйте минимум за 3 дня', 'Оплата в день тура: наличные, PayPay или карта'],
  },
  snapkyoto: {
    es: ['Kioto, Osaka y Nara', 'Fotos en galería online'],
    en: ['Kyoto, Osaka and Nara', 'Photos in an online gallery'],
    ar: ['كيوتو وأوساكا ونارا', 'الصور في معرض على الإنترنت'],
    ru: ['Киото, Осака и Нара', 'Фото в онлайн-галерее'],
  },
  kuchinotsu: {
    es: ['10 o más adultos: −10 %', '30 o más: −20 %', 'Sin guía: enseña el logo en recepción'],
    en: ['10+ adults: −10%', '30+: −20%', 'No guide: show the logo at reception'],
    ar: ['10 بالغين أو أكثر: خصم 10%', '30 أو أكثر: خصم 20%', 'بلا مرشد: اعرض الشعار في الاستقبال'],
    ru: ['От 10 взрослых: −10 %', 'От 30: −20 %', 'Без гида: покажите логотип на ресепшене'],
  },
  samurai: {
    es: ['10 % menos reservando conmigo', 'Una hora, a cubierto'],
    en: ['10% off when I book', 'One hour, indoors'],
    ar: ['خصم 10% عندما أحجز أنا', 'ساعة واحدة، في مكان مغلق'],
    ru: ['−10 %, если бронируем мы', 'Один час, в помещении'],
  },
  maikoyate: {
    es: ['10 % menos reservando conmigo', 'En la privada entro a traducir'],
    en: ['10% off when I book', 'In a private session I translate'],
    ar: ['خصم 10% عندما أحجز أنا', 'في الجلسة الخاصة أترجم أنا'],
    ru: ['−10 %, если бронируем мы', 'На частной церемонии мы переводим'],
  },
  shaquda: {
    es: ['10 % menos conmigo', 'Sin los 10.000 ¥ de intérprete', 'Envío del pincel aparte'],
    en: ['10% off with me', 'No ¥10,000 interpreter fee', 'Brush shipping extra'],
    ar: ['خصم 10% معي', 'بلا رسوم المترجم (10,000 ين)', 'شحن الفرشاة منفصل'],
    ru: ['−10 % с нами', 'Без оплаты переводчика (10 000 ¥)', 'Доставка кисти отдельно'],
  },
  kobaien: {
    es: ['Solo de octubre a mediados de abril', 'Reservo y traduzco yo'],
    en: ['October to mid-April only', 'I book and translate'],
    ar: ['من أكتوبر إلى منتصف أبريل فقط', 'أحجز وأترجم أنا'],
    ru: ['Только с октября до середины апреля', 'Бронируем и переводим мы'],
  },
  okamoto: {
    es: ['7 tiendas en Kioto', 'Devolución en otra tienda o en el hotel'],
    en: ['7 shops in Kyoto', 'Return at another shop or your hotel'],
    ar: ['7 فروع في كيوتو', 'الإرجاع في فرع آخر أو في الفندق'],
    ru: ['7 салонов в Киото', 'Вернуть можно в другом салоне или в отеле'],
  },
  shogun: {
    es: ['Arashiyama', 'Lo encajo en el tour'],
    en: ['Arashiyama', 'I fit it into the tour'],
    ar: ['أراشيياما', 'أضعه ضمن الجولة'],
    ru: ['Арасияма', 'Впишем в маршрут экскурсии'],
  },
  towerknives: {
    es: ['Presentación de 15-20 min conmigo', 'Junto a la torre Tsutenkaku'],
    en: ['15–20 min presentation with me', 'Next to Tsutenkaku tower'],
    ar: ['عرض من 15 إلى 20 دقيقة معي', 'بجوار برج تسوتنكاكو'],
    ru: ['Презентация 15–20 мин вместе с нами', 'Рядом с башней Цутэнкаку'],
  },
  hamanasu: {
    es: ['4.000 ¥ en efectivo', 'Avisando 3 días antes: 15 min más gratis'],
    en: ['¥4,000 in cash', '3 days’ notice: 15 extra minutes free'],
    ar: ['4,000 ين نقدًا', 'بإشعار قبل 3 أيام: 15 دقيقة إضافية مجانًا'],
    ru: ['4000 ¥ наличными', 'Если предупредить за 3 дня: +15 минут бесплатно'],
  },
  kanemasa: {
    es: ['Desde 60.000 ¥', 'Reserva 1 o 2 semanas antes'],
    en: ['From ¥60,000', 'Book 1–2 weeks ahead'],
    ar: ['من 60,000 ين', 'احجز قبل أسبوع أو أسبوعين'],
    ru: ['От 60 000 ¥', 'Бронируйте за 1–2 недели'],
  },
  osakacookingbase: {
    es: ['Hasta 8 personas', 'Sin cerdo ni alcohol (usa dashi)'],
    en: ['Up to 8 people', 'No pork or alcohol (uses dashi)'],
    ar: ['حتى 8 أشخاص', 'بلا لحم خنزير ولا كحول (يستخدمون الداشي)'],
    ru: ['До 8 человек', 'Без свинины и алкоголя (используют даси)'],
  },
  cookingsun: {
    es: ['Sin carne ni alcohol si lo pides', 'Sin certificado halal'],
    en: ['No meat or alcohol on request', 'Not halal-certified'],
    ar: ['بلا لحم ولا كحول عند الطلب', 'غير حاصل على شهادة حلال'],
    ru: ['Без мяса и алкоголя по запросу', 'Без халяль-сертификата'],
  },
  cookingsunosaka: {
    es: ['Sin cerdo ni alcohol si lo pides', 'La privada se pide por correo'],
    en: ['No pork or alcohol on request', 'Private class by email'],
    ar: ['بلا لحم خنزير ولا كحول عند الطلب', 'الحصة الخاصة تُطلب بالبريد'],
    ru: ['Без свинины и алкоголя по запросу', 'Частный класс — по почте'],
  },
  japaneid: {
    es: ['Productos con certificado halal', 'Te lo envían al hotel'],
    en: ['Halal-certified products', 'They can ship to your hotel'],
    ar: ['منتجات بشهادة حلال', 'يمكنهم الإرسال إلى فندقك'],
    ru: ['Продукты с халяль-сертификатом', 'Могут доставить в отель'],
  },
  inkansai: {
    es: ['Bici y comida en Osaka, Kioto e Hiroshima', 'Clases de cocina sin cerdo'],
    en: ['Bike and food tours in Osaka, Kyoto and Hiroshima', 'Pork-free cooking classes'],
    ar: ['جولات بالدراجة وطعام في أوساكا وكيوتو وهيروشيما', 'دروس طبخ بلا لحم خنزير'],
    ru: ['Велотуры и гастротуры в Осаке, Киото и Хиросиме', 'Кулинарные классы без свинины'],
  },
  miyabi: {
    es: ['Personal solo femenino', 'Puedes llevar el hiyab debajo'],
    en: ['All-female staff', 'You can keep your hijab on underneath'],
    ar: ['طاقم من النساء فقط', 'يمكنك إبقاء الحجاب تحته'],
    ru: ['Только женский персонал', 'Хиджаб можно оставить под нарядом'],
  },
  yokotake: {
    es: ['Un grupo cada vez, hasta 15', 'La cesta, desde 8 años'],
    en: ['One group at a time, up to 15', 'Basket from age 8'],
    ar: ['مجموعة واحدة في كل مرة، حتى 15', 'السلة من عمر 8 سنوات'],
    ru: ['Одна группа за раз, до 15 человек', 'Корзинка — с 8 лет'],
  },
  domyo: {
    es: ['Sin experiencia previa', 'Muy bien con niños'],
    en: ['No experience needed', 'Great with kids'],
    ar: ['لا تحتاج إلى خبرة', 'رائع مع الأطفال'],
    ru: ['Опыт не нужен', 'Отлично для детей'],
  },
  nakamura: {
    es: ['Junto a Fushimi Inari', 'Muy bien con niños'],
    en: ['Next to Fushimi Inari', 'Great with kids'],
    ar: ['بجوار فوشيمي إيناري', 'رائع مع الأطفال'],
    ru: ['Рядом с Фусими Инари', 'Отлично для детей'],
  },
  shiretoko: {
    es: ['Cruceros: −10 % desde 15 personas', 'Hielo: desde 130 cm y hasta 74 años'],
    en: ['Cruises: −10% from 15 people', 'Ice walk: from 130 cm, up to age 74'],
    ar: ['الرحلات البحرية: خصم 10% من 15 شخصًا', 'الجليد: من 130 سم وحتى 74 سنة'],
    ru: ['Круизы: −10 % от 15 человек', 'Лёд: рост от 130 см, возраст до 74 лет'],
  },
  hakusan: {
    es: ['Reserva un mes antes, por correo'],
    en: ['Book a month ahead, by email'],
    ar: ['احجز قبل شهر، بالبريد'],
    ru: ['Бронь за месяц, по почте'],
  },
  hakusansanpai: {
    es: ['18.150 ¥ hasta 4 personas', 'Reserva un mes antes, por correo'],
    en: ['¥18,150 up to 4 people', 'Book a month ahead, by email'],
    ar: ['18,150 ين حتى 4 أشخاص', 'احجز قبل شهر، بالبريد'],
    ru: ['18 150 ¥ до 4 человек', 'Бронь за месяц, по почте'],
  },
  hakusanmisogi: {
    es: ['57.750 ¥ hasta 5 personas', 'Reserva un mes antes, por correo'],
    en: ['¥57,750 up to 5 people', 'Book a month ahead, by email'],
    ar: ['57,750 ين حتى 5 أشخاص', 'احجز قبل شهر، بالبريد'],
    ru: ['57 750 ¥ до 5 человек', 'Бронь за месяц, по почте'],
  },
  fujioutdoor: {
    es: ['Desde 3.500 ¥ por persona', 'Hasta 15 personas', 'Lo coordino e interpreto yo'],
    en: ['From ¥3,500 per person', 'Up to 15 people', 'I coordinate and interpret'],
    ar: ['من 3,500 ين للشخص', 'حتى 15 شخصًا', 'أنسّق وأترجم أنا'],
    ru: ['От 3500 ¥ с человека', 'До 15 человек', 'Координируем и переводим мы'],
  },
  tenchan: {
    es: ['88.000 ¥ el grupo de hasta 4 (surf/SUP)', 'Surf de junio a noviembre; nieve de diciembre a marzo', 'Reserva por correo'],
    en: ['¥88,000 per group of up to 4 (surf/SUP)', 'Surf June–November; snow December–March', 'Book by email'],
    ar: ['88,000 ين للمجموعة حتى 4 (ركوب الأمواج/SUP)', 'الأمواج من يونيو إلى نوفمبر؛ الثلج من ديسمبر إلى مارس', 'الحجز بالبريد'],
    ru: ['88 000 ¥ за группу до 4 человек (сёрф/SUP)', 'Сёрф с июня по ноябрь; сноуборд с декабря по март', 'Бронь по почте'],
  },
  flytographer: {
    es: ['Fotos en galería online'],
    en: ['Photos in an online gallery'],
    ar: ['الصور في معرض على الإنترنت'],
    ru: ['Фото в онлайн-галерее'],
  },
}

export const reglasDe = (clave: string, l: Lang): string[] => {
  const r = REGLAS[clave]
  if (!r) return []
  return r[l]?.length ? r[l] : r.en
}
