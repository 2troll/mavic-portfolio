// Guía para ir solo a las tiendas y talleres de la página de ventajas: dónde
// están, cómo llegar, qué enseñar al llegar y qué decir en japonés. Así el
// cliente usa cada ventaja sin que Tony tenga que estar con él.
// Direcciones y horarios: sacados de la web oficial de cada sitio (fuente al lado).
// Si un dato no consta, se deja sin poner: nunca se inventa.

export type IdG = 'es' | 'en' | 'ar' | 'ru'

/** Una frase para decir o enseñar: japonés, cómo suena y qué significa. */
export interface Frase { ja: string; romaji: string; t: Record<IdG, string> }

export interface Lugar {
  /** Nombre de la tienda cuando hay más de una. */
  nombre?: string
  dirJa: string
  dirRomaji: string
  /** Estación (o parada de bus) más cercana: kanji, romaji y línea. */
  estacion?: { ja: string; romaji: string; linea: string }
  salida?: string
  minutos?: number
  horario?: string
  /** Días de cierre, por idioma. */
  cierra?: Record<IdG, string>
  reserva?: 'obligatoria' | 'recomendada' | 'no'
  /** Lo que se busca en Google Maps (nombre + dirección en japonés). */
  mapa: string
  fuente: string
}

export interface Guia {
  lugares: Lugar[]
  /** Cómo reservar o preguntar sin pasar por Tony. */
  contacto?: { web?: string; tel?: string; correo?: string }
  /** Lo que se enseña en la tienda, en una sola pantalla. */
  tarjeta: Frase[]
  /** Frases propias de este sitio (las comunes van aparte). */
  frases: Frase[]
  /** Si la ventaja solo funciona reservando a través de Tony, se dice claro. */
  soloConTony?: boolean
}

const IRREG = { es: 'Cierra algunos días sin fijo: llama antes', en: 'Closes on some irregular days: call first', ar: 'يُغلق في أيام غير ثابتة: اتصل قبل الذهاب', ru: 'Иногда закрыто без графика: позвоните заранее' }

const f = (ja: string, romaji: string, es: string, en: string, ar: string, ru: string): Frase => ({ ja, romaji, t: { es, en, ar, ru } })

// Lo primero de cada tarjeta: quién te manda.
const DE_TONY = f(
  'こんにちは。大阪のガイド、ハンマ・トニー（Tony Kansai Guide）の紹介で来ました。',
  'Konnichiwa. Ōsaka no gaido, Hanma Tonī no shōkai de kimashita.',
  'Hola. Vengo recomendado por Tony Hanma, guía de Osaka (Tony Kansai Guide).',
  'Hello. I was sent by Tony Hanma, a guide from Osaka (Tony Kansai Guide).',
  'مرحبًا. جئت بتوصية من توني هانما، المرشد في أوساكا (Tony Kansai Guide).',
  'Здравствуйте. Меня направил Тони Ханма, гид из Осаки (Tony Kansai Guide).',
)
const RESERVA = f(
  '予約しています。名前は ＿＿＿＿ です。',
  'Yoyaku shite imasu. Namae wa ____ desu.',
  'Tengo reserva. Mi nombre es ____.',
  'I have a booking. My name is ____.',
  'لديّ حجز. اسمي ____.',
  'У меня бронь. Моя фамилия ____.',
)
const HIJAB = f(
  'ヒジャブをつけたまま着付けできますか？',
  'Hijabu o tsuketa mama kitsuke dekimasu ka?',
  '¿Me lo podéis poner sin quitarme el hiyab?',
  'Can you dress me while I keep my hijab on?',
  'هل يمكنكم إلباسي دون أن أخلع الحجاب؟',
  'Можно надеть, не снимая хиджаб?',
)
const NINOS = f(
  '子どもも参加できますか？',
  'Kodomo mo sanka dekimasu ka?',
  '¿Pueden participar los niños?',
  'Can children take part?',
  'هل يمكن للأطفال المشاركة؟',
  'Дети тоже могут участвовать?',
)

/** Frases que sirven en cualquier tienda: salen en todas las fichas. */
export const FRASES_COMUNES: Frase[] = [
  RESERVA,
  f('英語で大丈夫ですか？', 'Eigo de daijōbu desu ka?', '¿Puede ser en inglés?', 'Is English OK?', 'هل يمكن بالإنجليزية؟', 'Можно по-английски?'),
  f('カードで払えますか？', 'Kādo de haraemasu ka?', '¿Puedo pagar con tarjeta?', 'Can I pay by card?', 'هل يمكنني الدفع بالبطاقة؟', 'Можно оплатить картой?'),
  f('写真を撮ってもいいですか？', 'Shashin o tottemo ii desu ka?', '¿Puedo hacer fotos?', 'May I take photos?', 'هل يمكنني التقاط الصور؟', 'Можно фотографировать?'),
  f('トイレはどこですか？', 'Toire wa doko desu ka?', '¿Dónde está el baño?', 'Where is the toilet?', 'أين الحمّام؟', 'Где туалет?'),
  f('ありがとうございました！', 'Arigatō gozaimashita!', '¡Muchas gracias!', 'Thank you very much!', 'شكرًا جزيلًا!', 'Большое спасибо!'),
]

/** Para el taxista: va encima de la dirección en japonés. */
export const AL_TAXI = f(
  'この住所までお願いします。',
  'Kono jūsho made onegai shimasu.',
  'A esta dirección, por favor.',
  'To this address, please.',
  'إلى هذا العنوان من فضلك.',
  'По этому адресу, пожалуйста.',
)

export const GUIA: Record<string, Guia> = {
  samurai: {
    lugares: [{ dirJa: '京都市中京区堀之内町109', dirRomaji: '109 Horinouchi-chō, Nakagyō-ku, Kyoto', estacion: { ja: '河原町', romaji: 'Kawaramachi', linea: 'Hankyu Kyoto Line' }, minutos: 7, mapa: 'Samurai Ninja Museum Kyoto 京都市中京区堀之内町109', fuente: 'https://mai-ko.com/samurai/' }],
    contacto: { web: 'https://mai-ko.com/samurai/', tel: '075-366-5250' },
    tarjeta: [DE_TONY, RESERVA],
    frases: [f('子ども用の衣装はありますか？', 'Kodomo-yō no ishō wa arimasu ka?', '¿Tenéis trajes para niños?', 'Do you have costumes for children?', 'هل لديكم أزياء للأطفال؟', 'Есть костюмы для детей?')],
  },
  wargo: {
    lugares: [
      { nombre: 'Kyoto Station (Kyoto Tower 3F)', dirJa: '京都市下京区東塩小路町721-1 京都タワー3階', dirRomaji: 'Kyoto Tower 3F, 721-1 Higashi-shiokōji-chō, Shimogyō-ku, Kyoto', estacion: { ja: '京都駅', romaji: 'Kyōto', linea: 'JR / Kintetsu / Subway' }, minutos: 2, horario: '10:00-17:30', reserva: 'recomendada', mapa: 'Kimono Rental Wargo Kyoto Station 京都タワー', fuente: 'https://kyotokimonorental.com/en/shop/5' },
      { nombre: 'Gion', dirJa: '京都市東山区中之町216 祇園OKIビル2階', dirRomaji: 'Gion OKI Bldg 2F, 216 Nakano-chō, Higashiyama-ku, Kyoto', estacion: { ja: '祇園四条', romaji: 'Gion-Shijō', linea: 'Keihan Line' }, minutos: 1, horario: '10:00-17:30', reserva: 'recomendada', mapa: 'Kimono Rental Wargo Gion 祇園OKIビル', fuente: 'https://kyotokimonorental.com/en/shop/6' },
    ],
    contacto: { web: 'https://kyotokimonorental.com/en' },
    tarjeta: [DE_TONY, f('割引コード「261013_wgtn」で予約しました。', 'Waribiki kōdo "261013_wgtn" de yoyaku shimashita.', 'Reservé con el código de descuento 261013_wgtn.', 'I booked with the discount code 261013_wgtn.', 'حجزت برمز الخصم 261013_wgtn.', 'Я бронировал(а) с кодом скидки 261013_wgtn.')],
    frases: [HIJAB, f('何時までに返せばいいですか？', 'Nanji made ni kaeseba ii desu ka?', '¿Hasta qué hora tengo que devolverlo?', 'By what time do I return it?', 'متى يجب أن أعيده؟', 'До какого времени нужно вернуть?')],
  },
  camellia: {
    lugares: [
      { nombre: 'Camellia GARDEN (Ryōan-ji)', dirJa: '京都市右京区龍安寺池ノ下町18', dirRomaji: '18 Ryōanji Ikenoshita-chō, Ukyō-ku, Kyoto', estacion: { ja: '龍安寺', romaji: 'Ryōanji', linea: 'Keifuku Randen (Kitano Line)' }, reserva: 'obligatoria', mapa: 'Camellia Garden tea ceremony 京都市右京区龍安寺池ノ下町18', fuente: 'https://tea-kyoto.com/' },
      { nombre: 'Camellia FLOWER (Ninenzaka)', dirJa: '京都市東山区桝屋町349-12', dirRomaji: '349-12 Masuya-chō, Higashiyama-ku, Kyoto', estacion: { ja: '祇園四条', romaji: 'Gion-Shijō', linea: 'Keihan Line' }, reserva: 'obligatoria', mapa: 'Camellia Flower tea ceremony 京都市東山区桝屋町349-12', fuente: 'https://tea-kyoto.com/' },
    ],
    contacto: { web: 'https://tea-kyoto.com/', correo: 'contact@camelliakyoto.com' },
    soloConTony: true,
    tarjeta: [DE_TONY, RESERVA],
    frases: [f('正座が苦手です。椅子はありますか？', 'Seiza ga nigate desu. Isu wa arimasu ka?', 'Me cuesta sentarme de rodillas. ¿Hay silla?', 'Kneeling is hard for me. Is there a chair?', 'يصعب عليّ الجلوس على الركبتين. هل يوجد كرسي؟', 'Мне трудно сидеть на коленях. Есть стул?')],
  },
  yumeyakata: {
    lugares: [{ dirJa: '京都市下京区塩竈町353 豊彩ビル2階', dirRomaji: 'Hōsai Bldg 2F, 353 Shiogama-chō, Shimogyō-ku, Kyoto', estacion: { ja: '五条', romaji: 'Gojō', linea: 'Subway Karasuma Line' }, minutos: 3, horario: '10:00-17:30', reserva: 'recomendada', mapa: 'Yumeyakata Gojo 京都市下京区塩竈町353', fuente: 'https://www.kyoto.yumeyakata.com/' }],
    contacto: { web: 'https://book.yumeyakata.com/', tel: '075-354-8515', correo: 'info@yumeyakata.com' },
    tarjeta: [DE_TONY, f('ガイド番号1085（ハンマ・トニー）で予約しました。', 'Gaido bangō 1085 (Hanma Tonī) de yoyaku shimashita.', 'Reservé con el número de guía 1085 (Tony Hanma).', 'I booked with guide number 1085 (Tony Hanma).', 'حجزت برقم المرشد 1085 (توني هانما).', 'Я бронировал(а) с номером гида 1085 (Тони Ханма).')],
    frases: [HIJAB],
  },
  shogun: {
    lugares: [{ dirJa: '京都市右京区嵯峨天龍寺今堀町4-1 2階', dirRomaji: '2F, 4-1 Saga-Tenryūji Imahori-chō, Ukyō-ku, Kyoto', horario: '10:00-17:00', mapa: 'Shogun Studio Japan 京都市右京区嵯峨天龍寺今堀町4-1', fuente: 'https://shogunstudiojapan.com/' }],
    contacto: { web: 'https://shogunstudiojapan.com/reserve/', tel: '075-366-6665' },
    tarjeta: [DE_TONY, RESERVA],
    frases: [f('子ども用の衣装はありますか？', 'Kodomo-yō no ishō wa arimasu ka?', '¿Tenéis trajes para niños?', 'Do you have costumes for children?', 'هل لديكم أزياء للأطفال؟', 'Есть костюмы для детей?')],
  },
  miyabi: {
    lugares: [{ dirJa: '京都市中京区釜座通三条上ル突抜町807', dirRomaji: '807 Tsukinuke-chō, Kamanza-dōri Sanjō-agaru, Nakagyō-ku, Kyoto', estacion: { ja: '烏丸御池', romaji: 'Karasuma-Oike', linea: 'Subway Karasuma / Tōzai Line' }, salida: '4-1 / 6', minutos: 5, horario: '10:00-18:00', cierra: IRREG, reserva: 'obligatoria', mapa: 'Emondo Miyabi-yuki 京都市中京区突抜町807', fuente: 'https://www.miyabi-yuki.jp/access/' }],
    contacto: { web: 'https://www.miyabi-yuki.jp/contact/', tel: '075-254-8883', correo: 'info@miyabi-yuki.jp' },
    tarjeta: [DE_TONY, RESERVA, HIJAB],
    frases: [f('女性のスタッフにお願いできますか？', 'Josei no sutaffu ni onegai dekimasu ka?', '¿Me puede atender una mujer?', 'Could a woman member of staff help me?', 'هل يمكن أن تساعدني موظفة؟', 'Можно, чтобы мне помогала женщина?')],
  },
  towerknives: {
    lugares: [{ dirJa: '大阪市浪速区恵美須東1-4-7', dirRomaji: '1-4-7 Ebisu-higashi, Naniwa-ku, Osaka', estacion: { ja: '恵美須町', romaji: 'Ebisuchō', linea: 'Subway Sakaisuji Line / Nankai' }, salida: '3', minutos: 4, horario: '10:00-18:00', reserva: 'no', mapa: 'Tower Knives Osaka 大阪市浪速区恵美須東1-4-7', fuente: 'https://www.towerknives.com/' }],
    contacto: { tel: '06-4301-7860', correo: 'info@towerknives.com' },
    soloConTony: true,
    tarjeta: [DE_TONY],
    frases: [
      f('海外に持って帰ります。梱包をお願いします。', 'Kaigai ni motte kaerimasu. Konpō o onegai shimasu.', 'Me lo llevo fuera de Japón. ¿Me lo envolvéis bien?', 'I am taking it abroad. Could you pack it well?', 'سآخذه خارج اليابان. هل يمكنكم تغليفه جيدًا؟', 'Я везу его за границу. Упакуйте, пожалуйста, надёжно.'),
      f('名前を彫ってもらえますか？', 'Namae o hotte moraemasu ka?', '¿Me podéis grabar el nombre?', 'Could you engrave my name on it?', 'هل يمكنكم نقش اسمي عليه؟', 'Можете выгравировать имя?'),
      f('免税でお願いします。', 'Menzei de onegai shimasu.', 'Sin impuestos, por favor (enseña el pasaporte).', 'Tax-free, please (show your passport).', 'من دون ضريبة من فضلك (أظهر جواز السفر).', 'Без налога, пожалуйста (покажите паспорт).'),
      f('初心者におすすめの包丁はどれですか？', 'Shoshinsha ni osusume no hōchō wa dore desu ka?', '¿Qué cuchillo me recomienda para empezar?', 'Which knife do you recommend for a beginner?', 'أي سكين تنصح به للمبتدئين؟', 'Какой нож посоветуете новичку?'),
    ],
  },
  cookingsun: {
    lugares: [],
    contacto: { web: 'https://cookingsun.co.jp/' },
    tarjeta: [DE_TONY, f('ベジタリアンメニューで、お酒（酒・みりん）を使わないでください。', 'Bejitarian menyū de, osake (sake, mirin) o tsukawanaide kudasai.', 'Menú vegetariano y sin alcohol (sin sake ni mirin), por favor.', 'Vegetarian menu with no alcohol (no sake or mirin), please.', 'قائمة نباتية وبدون كحول (بدون ساكي أو ميرين) من فضلك.', 'Вегетарианское меню без алкоголя (без сакэ и мирина), пожалуйста.')],
    frases: [f('豚肉とお酒は食べられません。', 'Butaniku to osake wa taberaremasen.', 'No puedo tomar cerdo ni alcohol.', 'I cannot eat pork or alcohol.', 'لا أستطيع تناول لحم الخنزير أو الكحول.', 'Мне нельзя свинину и алкоголь.')],
  },
  hamanasu: {
    lugares: [],
    contacto: { web: 'https://hamanasu-kibori.raku-uru.jp/', correo: 'hamanasu-kibori@outlook.jp' },
    soloConTony: true,
    tarjeta: [DE_TONY, RESERVA],
    frases: [NINOS],
  },
  yokotake: {
    lugares: [],
    contacto: { tel: '075-441-3981' },
    tarjeta: [DE_TONY, RESERVA],
    frases: [NINOS],
  },
  domyo: {
    lugares: [],
    contacto: { tel: '075-748-1639', correo: 'info@kdomyo.com' },
    tarjeta: [DE_TONY, RESERVA],
    frases: [NINOS],
  },
  okamoto: {
    lugares: [
      { nombre: 'Kiyomizu', dirJa: '京都市東山区清水2丁目237-1-1', dirRomaji: '2-237-1-1 Kiyomizu, Higashiyama-ku, Kyoto', estacion: { ja: '五条坂', romaji: 'Gojōzaka', linea: 'Kyoto City Bus' }, minutos: 5, horario: '9:00-18:00', reserva: 'recomendada', mapa: 'Rental Kimono Okamoto Kiyomizu 京都市東山区清水2丁目237-1-1', fuente: 'https://www.okamoto-kimono.com/' },
      { nombre: 'Gion', dirJa: '京都市東山区鷲尾町523', dirRomaji: '523 Washio-chō, Higashiyama-ku, Kyoto', estacion: { ja: '祇園', romaji: 'Gion', linea: 'Kyoto City Bus' }, minutos: 5, horario: '9:00-18:00', reserva: 'recomendada', mapa: 'Rental Kimono Okamoto Gion 京都市東山区鷲尾町523', fuente: 'https://www.okamoto-kimono.com/' },
    ],
    contacto: { web: 'https://www.okamoto-kimono.com/reserve/form/', tel: '075-525-7115' },
    tarjeta: [DE_TONY, RESERVA],
    frases: [HIJAB, f('着物は別のお店に返してもいいですか？', 'Kimono wa betsu no omise ni kaeshitemo ii desu ka?', '¿Puedo devolver el kimono en otra de vuestras tiendas?', 'Can I return the kimono at another of your shops?', 'هل يمكنني إعادة الكيمونو في متجر آخر لكم؟', 'Можно вернуть кимоно в другом вашем магазине?')],
  },
  nakamura: {
    lugares: [{ dirJa: '京都市伏見区竹田三ッ杭町57-8', dirRomaji: '57-8 Takeda Mitsugui-chō, Fushimi-ku, Kyoto', estacion: { ja: '竹田', romaji: 'Takeda', linea: 'Subway Karasuma Line / Kintetsu Kyoto Line' }, salida: '3', horario: '9:00-17:30', cierra: IRREG, reserva: 'recomendada', mapa: 'Nakamura Rosoku 京都市伏見区竹田三ッ杭町57-8', fuente: 'https://www.kyorousoku.jp/' }],
    contacto: { tel: '075-641-9381', correo: 'info@kyorousoku.jp' },
    tarjeta: [DE_TONY, RESERVA],
    frases: [NINOS],
  },
  japaneid: {
    lugares: [{ dirJa: '大阪市西区南堀江1-11-1 9階', dirRomaji: '9F, 1-11-1 Minami-horie, Nishi-ku, Osaka', estacion: { ja: '四ツ橋', romaji: 'Yotsubashi', linea: 'Subway Yotsubashi Line' }, minutos: 4, horario: '11:30-18:45', mapa: 'JAPANeid 大阪市西区南堀江1-11-1', fuente: 'https://www.japaneid.com/pages/access-guide' }],
    contacto: { web: 'https://www.japaneid.com/pages/access-guide' },
    tarjeta: [DE_TONY],
    frases: [f('ホテルに届けてもらえますか？', 'Hoteru ni todokete moraemasu ka?', '¿Me lo podéis enviar al hotel?', 'Could you deliver it to my hotel?', 'هل يمكنكم توصيله إلى الفندق؟', 'Можете доставить в отель?')],
  },
  kobaien: {
    lugares: [],
    contacto: { web: 'https://www.kobaien.jp/', correo: 'nara@kobaien.jp' },
    soloConTony: true,
    tarjeta: [DE_TONY, RESERVA],
    frases: [NINOS],
  },
  maikoyate: {
    lugares: [],
    contacto: { web: 'https://mai-ko.com/what-to-do-in-japan/for-agencies-kyoto/', correo: 'agency@maikoya.com' },
    tarjeta: [DE_TONY, RESERVA],
    frases: [NINOS],
  },
  inkansai: {
    lugares: [{ dirJa: '大阪市北区天満1-10-7', dirRomaji: '1-10-7 Tenma, Kita-ku, Osaka 530-0043', mapa: 'Cycle Osaka 大阪市北区天満1-10-7', fuente: 'https://www.cycleosaka.com/' }],
    contacto: { web: 'https://www.cycleosaka.com/', tel: '+81 50-8896-7292', correo: 'info@inkansai.com' },
    tarjeta: [DE_TONY, RESERVA],
    frases: [f('豚肉とお酒は食べられません。', 'Butaniku to osake wa taberaremasen.', 'No puedo tomar cerdo ni alcohol.', 'I cannot eat pork or alcohol.', 'لا أستطيع تناول لحم الخنزير أو الكحول.', 'Мне нельзя свинину и алкоголь.')],
  },
}

/** Foto de la zona de cada experiencia (public/v8/zonas, créditos en creditosZonas.json). */
export const FOTO_EXP: Record<string, string> = {
  samurai: 'kioto-nishiki', wargo: 'kioto-gion', camellia: 'kioto-kiyomizu', snapkyoto: 'kioto-fushimi',
  yumeyakata: 'kioto-sakura', shogun: 'kioto-arashiyama', miyabi: 'kioto-gion', towerknives: 'osaka-shinsekai',
  cookingsun: 'kioto-nishiki', hamanasu: 'lejos-kumano', yokotake: 'kioto-arashiyama', domyo: 'kioto-kinkakuji',
  okamoto: 'kioto-kiyomizu', nakamura: 'kioto-fushimi', japaneid: 'osaka-dotonbori', flytographer: 'kioto-gion',
  kobaien: 'nara-naramachi', maikoyate: 'kioto-gion', inkansai: 'osaka-castillo',
}
