#!/usr/bin/env node
// Guías musulmanas mujeres para clientas y familias musulmanas (24-11-2026, v2).
// Página de CLIENTES (la oferta de empleo es scripts/empleo-guia.mjs). Una página por idioma,
// cada una ENTERA en su idioma (la gente entra desde la IA o Google en el suyo):
//   en /en/muslim-female-guide-japan/      ar /ar/murshida-muslima-yaban/
//   id /id/pemandu-wisata-muslimah-jepang/ ms /ms/pemandu-pelancong-muslimah-jepun/
//   es /es/guia-musulmana-japon/           fr /fr/guide-musulmane-japon/
// Pedido de Tony: minimalista, solo lo básico y las opciones, nada plegado, colores de
// Japón (paleta «Japón sereno» de src/v7/estilo-sereno.css), móvil primero, animación
// con GSAP + SplitText + ScrollTrigger + Lenis (mismo patrón que scripts/familias.mjs).
// HTML estático a propósito: es lo que leen las IAs, y /id/ y /ms/ no existen en la app React.
// Sin nombres de las guías ni precios: solo hechos ciertos (cuatro guías que viven en Osaka
// y Kioto; árabe, francés, indonesio, inglés y japonés). Ejecutar: node scripts/guias-musulmanas.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { E } from './guias-musulmanas-estudio.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://tonykansaiguide.com'
const WA = '34634193106'
const MAIL = 'tony@tonykansaiguide.com'
const MODIFICADO = '2026-11-26'
const GSAP_V = '3.15.0'
const LENIS_V = '1.3.27'

export const RUTAS = {
  en: '/en/muslim-female-guide-japan/',
  ar: '/ar/murshida-muslima-yaban/',
  id: '/id/pemandu-wisata-muslimah-jepang/',
  ms: '/ms/pemandu-pelancong-muslimah-jepun/',
  es: '/es/guia-musulmana-japon/',
  fr: '/fr/guide-musulmane-japon/',
}
const NOMBRE_IDIOMA = { en: 'English', ar: 'العربية', id: 'Bahasa Indonesia', ms: 'Bahasa Melayu', es: 'Español', fr: 'Français' }
const INICIO = { en: '/en/', ar: '/ar/', id: '/en/', ms: '/en/', es: '/es/', fr: '/fr/' }

// Fotos de /v8/zonas (créditos en src/v8/creditosZonas.json). Héroe: santuario Heian con cerezos.
const HEROE = 'kioto-sakura'
const FOTOS_CIUDAD = ['osaka-castillo', 'kioto-fushimi', 'nara-parque', 'kobe-mezquita']
const CREDITOS = [
  ['Heian Shrine', 'KimonBerlin', 'CC BY-SA 2.0', 'https://commons.wikimedia.org/wiki/File:Heian_Shrine_(5766625459).jpg'],
  ['Osaka Castle', 'Luka Peternel', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Osaka-Castle-cherry-blossom-2018-Luka-Peternel.jpg'],
  ['Fushimi Inari', 'Basile Morin', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Torii_path_with_lantern_at_Fushimi_Inari_Taisha_Shrine,_Kyoto,_Japan.jpg'],
  ['Nara', 'Daniel Lu (dllu)', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Sika_deer_doe_and_fawn_Nara_2026_dllu.jpg'],
  ['Kobe Mosque', 'Zairon', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Kobe_Kobe-Moschee_Fassade_1.jpg'],
]

const T = {
  en: {
    title: 'Female Muslim tour guide in Osaka, Kyoto & Nara | Muslimah guides in Japan',
    desc: 'Private tours in Japan with a Muslim woman guide. Prayer stops, halal lunch, women-only groups and families in Osaka, Kyoto, Nara and Kobe.',
    h1: 'A Muslim woman guide for your trip to Japan',
    sub: 'Private tours in Osaka, Kyoto, Nara and Kobe, planned around your prayers, with halal food and an easy pace.',
    lengua: 'Our guides speak English, Arabic, Indonesian and French.',
    wa: 'Ask on WhatsApp', mail: 'or write to',
    waTexto: 'Assalamu alaikum, I would like a Muslim female guide in Japan.\nDates:\nCities:\nGroup (adults / children):',
    asunto: 'Muslim female guide in Japan',
    datos: [['4', 'Muslim women guides living in Osaka and Kyoto'], ['5', 'daily prayers built into the route'], ['Halal', 'lunch chosen before your day']],
    opcionesH: 'Choose your tour',
    opciones: [['Women only', 'Guide and group, all women.'], ['Family', 'Parents, children and grandparents, with rest stops.'], ['Half day or full day', 'One city or two, at your pace.']],
    ciudadesH: 'Where we guide',
    ciudades: [['Osaka', 'Castle, Dotonbori and street food.'], ['Kyoto', 'Fushimi Inari, Kiyomizu-dera, Arashiyama.'], ['Nara', 'The deer park and Todai-ji.'], ['Kobe', 'Kobe Mosque, the oldest in Japan.']],
    pasosH: 'How to book',
    pasos: ['Send your dates, cities and group size.', 'We confirm your guide and send a clear price.', 'Your guide meets you at your hotel.'],
    faqH: 'Good to know',
    faq: [
      ['Can I book a female Muslim guide in Japan?', 'Yes. We work with four Muslim women guides who live in Osaka and Kyoto. Send your dates and we confirm who is free.'],
      ['Which languages do they speak?', 'English, Arabic, Indonesian, French and Japanese.'],
      ['How do you handle prayer times?', 'The route is planned around the five prayers, with stops at mosques such as Kobe Mosque or at prayer rooms.'],
      ['Is the food halal?', 'We choose halal-certified or Muslim-friendly restaurants in advance, and the guide checks ingredients such as mirin.'],
      ['Do we take part in anything at temples?', 'No. At temples and shrines the guide only explains history and culture.'],
      ['How much is it and when should I book?', 'We send a price for your group before you book. Book 1 to 2 weeks ahead if you can.'],
    ],
    masH: 'Plan the rest of your trip',
    mas: 'Read about <a href="/en/mosques-kansai/">mosques and prayer rooms in Kansai</a> and <a href="/en/halal-kyoto-osaka/">halal food in Kyoto and Osaka</a>. Day trips our guests like: <a href="/en/kobe-private-guide-one-day/">Kobe in one day</a> and <a href="/en/nara-day-trip-from-osaka/">Nara from Osaka</a>. Prefer an Arabic-speaking guide? See <a href="/en/arabic-speaking-guide-japan/">Tony, Arabic-speaking guide in Japan</a>. Are you a Muslim woman guide? <a href="/en/careers/muslim-female-guide/">Guide with us</a>.',
    finalH: 'Tell us your dates',
    final: 'We reply on WhatsApp with a guide and a price.',
    pie: 'Tony Kansai Guide · Osaka, Japan', idiomas: 'Other languages', fotos: 'Photos', inicio: 'Home',
  },
  ar: {
    title: 'مرشدة سياحية مسلمة في أوساكا وكيوتو ونارا | مرشدات مسلمات في اليابان',
    desc: 'جولات خاصة في اليابان مع مرشدة مسلمة تتحدث العربية: أوقات الصلاة، غداء حلال، مجموعات نسائية وعائلات في أوساكا وكيوتو ونارا وكوبي.',
    h1: 'مرشدة مسلمة لرحلتك إلى اليابان',
    sub: 'جولات خاصة في أوساكا وكيوتو ونارا وكوبي، مخططة حول صلواتك، مع طعام حلال ووتيرة مريحة.',
    lengua: 'مرشدة تتحدث العربية.',
    wa: 'اسألي عبر واتساب', mail: 'أو راسلينا على',
    waTexto: 'السلام عليكم، أريد مرشدة مسلمة في اليابان.\nالتواريخ:\nالمدن:\nعدد الأشخاص (كبار / أطفال):',
    asunto: 'مرشدة مسلمة في اليابان',
    datos: [['4', 'مرشدات مسلمات يعشن في أوساكا وكيوتو'], ['5', 'صلوات يومية ضمن المسار'], ['حلال', 'غداء مختار قبل يومك']],
    opcionesH: 'اختاري جولتك',
    opciones: [['نساء فقط', 'المرشدة والمجموعة، كلهن نساء.'], ['عائلة', 'الوالدان والأطفال وكبار السن، مع استراحات.'], ['نصف يوم أو يوم كامل', 'مدينة واحدة أو مدينتان، على راحتك.']],
    ciudadesH: 'أين نرشدكم',
    ciudades: [['أوساكا', 'القلعة ودوتونبوري وأكل الشارع.'], ['كيوتو', 'فوشيمي إيناري وكيوميزو-ديرا وأراشيياما.'], ['نارا', 'حديقة الغزلان ومعبد تودايجي.'], ['كوبي', 'مسجد كوبي، أقدم مسجد في اليابان.']],
    pasosH: 'كيف تحجزين',
    pasos: ['أرسلي التواريخ والمدن وعدد الأشخاص.', 'نؤكد المرشدة ونرسل سعراً واضحاً.', 'تلتقيك المرشدة في الفندق.'],
    faqH: 'معلومات مهمة',
    faq: [
      ['هل يمكنني حجز مرشدة مسلمة في اليابان؟', 'نعم. نعمل مع أربع مرشدات مسلمات يعشن في أوساكا وكيوتو. أرسلي تواريخك ونؤكد لك المرشدة المتاحة.'],
      ['هل تتحدث المرشدة العربية؟', 'نعم، لدينا مرشدة تتحدث العربية، والفريق يتحدث أيضاً الإنجليزية والفرنسية والإندونيسية واليابانية.'],
      ['كيف تنظمون أوقات الصلاة؟', 'يُخطط المسار حول الصلوات الخمس، مع التوقف في مساجد مثل مسجد كوبي أو في المصليات.'],
      ['هل الطعام حلال؟', 'نختار مسبقاً مطاعم حلال معتمدة أو مناسبة للمسلمين، وتتحقق المرشدة من المكونات مثل الميرين.'],
      ['هل نشارك في أي شيء في المعابد؟', 'لا. في المعابد تشرح المرشدة التاريخ والثقافة فقط.'],
      ['كم السعر ومتى أحجز؟', 'نرسل لك سعراً لمجموعتك قبل الحجز. الأفضل الحجز قبل أسبوع إلى أسبوعين.'],
    ],
    masH: 'خطّطي لبقية رحلتك',
    mas: 'اقرئي عن <a href="/ar/mosques-kansai/">المساجد والمصليات في كانساي</a> و<a href="/ar/halal-kyoto-osaka/">الطعام الحلال في كيوتو وأوساكا</a>، وعن <a href="/ar/hiroshima-miyajima-day-trip/">رحلة يوم إلى هيروشيما وميياجيما</a>. وإن كنتِ قادمة من الخليج: <a href="/ar/from-gulf/">ما تحتاجينه قبل السفر إلى اليابان</a>. هل أنتِ مرشدة مسلمة؟ <a href="/ar/wazaif/murshida-muslima/">انضمي إلينا</a>.',
    finalH: 'أرسلي لنا تواريخك',
    final: 'نرد عليك عبر واتساب بالمرشدة والسعر.',
    pie: 'Tony Kansai Guide · أوساكا، اليابان', idiomas: 'لغات أخرى', fotos: 'الصور', inicio: 'الرئيسية',
  },
  id: {
    title: 'Pemandu wisata muslimah di Osaka, Kyoto & Nara | Tour guide muslimah Jepang',
    desc: 'Tur privat di Jepang bersama pemandu muslimah berbahasa Indonesia. Waktu salat, makan siang halal, grup khusus wanita dan keluarga di Osaka, Kyoto, Nara dan Kobe.',
    h1: 'Pemandu muslimah untuk perjalanan Anda ke Jepang',
    sub: 'Tur privat di Osaka, Kyoto, Nara dan Kobe, disusun sesuai waktu salat, dengan makanan halal dan tempo yang santai.',
    lengua: 'Pemandu berbahasa Indonesia.',
    wa: 'Tanya lewat WhatsApp', mail: 'atau email ke',
    waTexto: 'Assalamu alaikum, saya ingin pemandu wisata muslimah di Jepang.\nTanggal:\nKota:\nJumlah orang (dewasa / anak):',
    asunto: 'Pemandu wisata muslimah di Jepang',
    datos: [['4', 'pemandu muslimah yang tinggal di Osaka dan Kyoto'], ['5', 'waktu salat masuk dalam rute'], ['Halal', 'makan siang dipilih sebelum hari tur']],
    opcionesH: 'Pilih tur Anda',
    opciones: [['Khusus wanita', 'Pemandu dan grup, semuanya wanita.'], ['Keluarga', 'Orang tua, anak dan lansia, dengan waktu istirahat.'], ['Setengah hari atau sehari penuh', 'Satu atau dua kota, sesuai tempo Anda.']],
    ciudadesH: 'Kota tujuan',
    ciudades: [['Osaka', 'Kastil, Dotonbori dan jajanan kaki lima.'], ['Kyoto', 'Fushimi Inari, Kiyomizu-dera, Arashiyama.'], ['Nara', 'Taman rusa dan Todai-ji.'], ['Kobe', 'Masjid Kobe, masjid tertua di Jepang.']],
    pasosH: 'Cara memesan',
    pasos: ['Kirim tanggal, kota dan jumlah orang.', 'Kami pastikan pemandu dan kirim harga yang jelas.', 'Pemandu menjemput Anda di hotel.'],
    faqH: 'Perlu diketahui',
    faq: [
      ['Bisakah saya memesan pemandu wisata muslimah di Jepang?', 'Bisa. Kami bekerja dengan empat pemandu muslimah yang tinggal di Osaka dan Kyoto. Kirim tanggal Anda dan kami pastikan siapa yang tersedia.'],
      ['Apakah pemandunya berbahasa Indonesia?', 'Ya. Ada pemandu yang berbahasa Indonesia, dan tim kami juga berbahasa Inggris, Arab, Prancis dan Jepang.'],
      ['Bagaimana dengan waktu salat?', 'Rute disusun sesuai lima waktu salat, dengan singgah di masjid seperti Masjid Kobe atau di musala.'],
      ['Apakah makanannya halal?', 'Kami memilih restoran bersertifikat halal atau ramah muslim sebelumnya, dan pemandu memeriksa bahan seperti mirin.'],
      ['Apakah kami harus ikut sesuatu di kuil?', 'Tidak. Di kuil, pemandu hanya menjelaskan sejarah dan budaya.'],
      ['Berapa biayanya dan kapan sebaiknya memesan?', 'Kami kirim harga untuk grup Anda sebelum memesan. Sebaiknya pesan 1 sampai 2 minggu sebelumnya.'],
    ],
    finalH: 'Kirim tanggal perjalanan Anda',
    final: 'Kami balas lewat WhatsApp dengan pemandu dan harga.',
    pie: 'Tony Kansai Guide · Osaka, Jepang', idiomas: 'Bahasa lain', fotos: 'Foto', inicio: 'Beranda',
  },
  ms: {
    title: 'Pemandu pelancong muslimah di Osaka, Kyoto & Nara | Tour guide muslimah Jepun',
    desc: 'Lawatan persendirian di Jepun bersama pemandu wanita muslimah. Waktu solat, makan tengah hari halal, kumpulan wanita sahaja dan keluarga di Osaka, Kyoto, Nara dan Kobe.',
    h1: 'Pemandu muslimah untuk percutian anda ke Jepun',
    sub: 'Lawatan persendirian di Osaka, Kyoto, Nara dan Kobe, dirancang mengikut waktu solat, dengan makanan halal dan rentak yang santai.',
    lengua: 'Pemandu berbahasa Indonesia, mudah difahami oleh tetamu dari Malaysia.',
    wa: 'Tanya melalui WhatsApp', mail: 'atau e-mel ke',
    waTexto: 'Assalamualaikum, saya mahu pemandu pelancong muslimah di Jepun.\nTarikh:\nBandar:\nBilangan orang (dewasa / kanak-kanak):',
    asunto: 'Pemandu pelancong muslimah di Jepun',
    datos: [['4', 'pemandu muslimah yang tinggal di Osaka dan Kyoto'], ['5', 'waktu solat dalam laluan'], ['Halal', 'makan tengah hari dipilih lebih awal']],
    opcionesH: 'Pilih lawatan anda',
    opciones: [['Wanita sahaja', 'Pemandu dan kumpulan, semuanya wanita.'], ['Keluarga', 'Ibu bapa, kanak-kanak dan warga emas, dengan masa rehat.'], ['Separuh hari atau sehari penuh', 'Satu atau dua bandar, ikut rentak anda.']],
    ciudadesH: 'Destinasi',
    ciudades: [['Osaka', 'Istana, Dotonbori dan makanan jalanan.'], ['Kyoto', 'Fushimi Inari, Kiyomizu-dera, Arashiyama.'], ['Nara', 'Taman rusa dan Todai-ji.'], ['Kobe', 'Masjid Kobe, masjid tertua di Jepun.']],
    pasosH: 'Cara menempah',
    pasos: ['Hantar tarikh, bandar dan bilangan orang.', 'Kami sahkan pemandu dan hantar harga yang jelas.', 'Pemandu berjumpa anda di hotel.'],
    faqH: 'Perlu tahu',
    faq: [
      ['Bolehkah saya menempah pemandu pelancong muslimah di Jepun?', 'Boleh. Kami bekerja dengan empat pemandu muslimah yang tinggal di Osaka dan Kyoto. Hantar tarikh anda dan kami sahkan siapa yang ada.'],
      ['Adakah pemandu boleh berbahasa Melayu?', 'Pemandu kami berbahasa Indonesia, yang mudah difahami oleh tetamu Malaysia. Pasukan kami juga berbahasa Inggeris, Arab, Perancis dan Jepun.'],
      ['Bagaimana dengan waktu solat?', 'Laluan dirancang mengikut lima waktu solat, dengan singgah di masjid seperti Masjid Kobe atau di surau.'],
      ['Adakah makanannya halal?', 'Kami memilih restoran yang diperakui halal atau mesra muslim lebih awal, dan pemandu memeriksa bahan seperti mirin.'],
      ['Adakah kami perlu menyertai apa-apa di kuil?', 'Tidak. Di kuil, pemandu hanya menerangkan sejarah dan budaya.'],
      ['Berapa harganya dan bila perlu menempah?', 'Kami hantar harga untuk kumpulan anda sebelum menempah. Sebaiknya tempah 1 hingga 2 minggu lebih awal.'],
    ],
    finalH: 'Hantar tarikh percutian anda',
    final: 'Kami balas melalui WhatsApp dengan pemandu dan harga.',
    pie: 'Tony Kansai Guide · Osaka, Jepun', idiomas: 'Bahasa lain', fotos: 'Foto', inicio: 'Laman utama',
  },
  es: {
    title: 'Guía musulmana mujer en Osaka, Kioto y Nara | Guías musulmanas en Japón',
    desc: 'Tours privados en Japón con una guía musulmana. Paradas para rezar, comida halal, grupos solo de mujeres y familias en Osaka, Kioto, Nara y Kobe.',
    h1: 'Una guía musulmana para tu viaje a Japón',
    sub: 'Tours privados en Osaka, Kioto, Nara y Kobe, organizados alrededor de tus oraciones, con comida halal y a tu ritmo.',
    lengua: 'Te atendemos en español. Las guías hablan inglés, árabe, francés e indonesio.',
    wa: 'Pregunta por WhatsApp', mail: 'o escribe a',
    waTexto: 'Assalamu alaikum, quiero una guía musulmana en Japón.\nFechas:\nCiudades:\nGrupo (adultos / niños):',
    asunto: 'Guía musulmana en Japón',
    datos: [['4', 'guías musulmanas que viven en Osaka y Kioto'], ['5', 'oraciones del día dentro de la ruta'], ['Halal', 'comida elegida antes de tu día']],
    opcionesH: 'Elige tu tour',
    opciones: [['Solo mujeres', 'Guía y grupo, todas mujeres.'], ['En familia', 'Padres, niños y abuelos, con descansos.'], ['Medio día o día completo', 'Una ciudad o dos, a tu ritmo.']],
    ciudadesH: 'Dónde guiamos',
    ciudades: [['Osaka', 'Castillo, Dotonbori y comida callejera.'], ['Kioto', 'Fushimi Inari, Kiyomizu-dera, Arashiyama.'], ['Nara', 'El parque de los ciervos y Todai-ji.'], ['Kobe', 'La mezquita de Kobe, la más antigua de Japón.']],
    pasosH: 'Cómo reservar',
    pasos: ['Mándanos fechas, ciudades y cuántos sois.', 'Te confirmamos la guía y un precio claro.', 'Tu guía te recoge en el hotel.'],
    faqH: 'Lo que conviene saber',
    faq: [
      ['¿Puedo contratar una guía musulmana mujer en Japón?', 'Sí. Trabajamos con cuatro guías musulmanas que viven en Osaka y Kioto. Dinos tus fechas y te confirmamos cuál está libre.'],
      ['¿En qué idioma?', 'Las guías hablan inglés, árabe, francés, indonesio y japonés. La reserva te la llevamos en español.'],
      ['¿Cómo organizáis las oraciones?', 'La ruta se planifica alrededor de las cinco oraciones, con paradas en mezquitas como la de Kobe o en salas de oración.'],
      ['¿La comida es halal?', 'Elegimos antes restaurantes con certificado halal o aptos para musulmanes, y la guía revisa ingredientes como el mirin.'],
      ['¿Hay que participar en algo en los templos?', 'No. En templos y santuarios la guía solo explica la historia y la cultura.'],
      ['¿Cuánto cuesta y con cuánta antelación reservo?', 'Te mandamos el precio para tu grupo antes de reservar. Mejor con 1 o 2 semanas de antelación.'],
    ],
    masH: 'Para preparar el resto del viaje',
    mas: 'Excursiones de un día: <a href="/es/excursion-nara-desde-osaka/">Nara desde Osaka</a> y <a href="/es/excursion-hiroshima-miyajima-desde-osaka/">Hiroshima y Miyajima</a>. Si viajáis desde España o Latinoamérica, <a href="/es/viajar-a-japon-desde-espana-y-latinoamerica/">lo práctico antes de volar</a>. Si os vale un guía hombre, Tony es <a href="/es/guia-espanol-arabe-japon/">guía en español y árabe en Japón</a>. ¿Eres guía musulmana? <a href="/es/empleo/guia-musulmana/">Trabaja con nosotros</a>.',
    finalH: 'Dinos tus fechas',
    final: 'Te contestamos por WhatsApp con la guía y el precio.',
    pie: 'Tony Kansai Guide · Osaka, Japón', idiomas: 'Otros idiomas', fotos: 'Fotos', inicio: 'Inicio',
  },
  fr: {
    title: 'Guide musulmane femme à Osaka, Kyoto et Nara | Guides musulmanes au Japon',
    desc: 'Visites privées au Japon avec une guide musulmane francophone : prière, déjeuner halal, groupes de femmes et familles à Osaka, Kyoto, Nara et Kobe.',
    h1: 'Une guide musulmane pour votre voyage au Japon',
    sub: 'Visites privées à Osaka, Kyoto, Nara et Kobe, organisées autour de vos prières, avec repas halal et un rythme tranquille.',
    lengua: 'Guide francophone.',
    wa: 'Écrire sur WhatsApp', mail: 'ou écrivez à',
    waTexto: 'Assalamu alaikum, je souhaite une guide musulmane au Japon.\nDates :\nVilles :\nGroupe (adultes / enfants) :',
    asunto: 'Guide musulmane au Japon',
    datos: [['4', 'guides musulmanes qui vivent à Osaka et Kyoto'], ['5', 'prières de la journée dans l’itinéraire'], ['Halal', 'déjeuner choisi avant votre journée']],
    opcionesH: 'Choisissez votre visite',
    opciones: [['Entre femmes', 'Guide et groupe, uniquement des femmes.'], ['En famille', 'Parents, enfants et grands-parents, avec des pauses.'], ['Demi-journée ou journée', 'Une ville ou deux, à votre rythme.']],
    ciudadesH: 'Où nous guidons',
    ciudades: [['Osaka', 'Le château, Dotonbori et la cuisine de rue.'], ['Kyoto', 'Fushimi Inari, Kiyomizu-dera, Arashiyama.'], ['Nara', 'Le parc aux daims et le Todai-ji.'], ['Kobe', 'La mosquée de Kobe, la plus ancienne du Japon.']],
    pasosH: 'Comment réserver',
    pasos: ['Envoyez vos dates, villes et taille du groupe.', 'Nous confirmons votre guide et un prix clair.', 'Votre guide vous retrouve à l’hôtel.'],
    faqH: 'Bon à savoir',
    faq: [
      ['Puis-je réserver une guide musulmane au Japon ?', 'Oui. Nous travaillons avec quatre guides musulmanes qui vivent à Osaka et Kyoto. Donnez-nous vos dates et nous confirmons laquelle est disponible.'],
      ['La guide parle-t-elle français ?', 'Oui, nous avons une guide francophone. L’équipe parle aussi arabe, anglais, indonésien et japonais.'],
      ['Comment gérez-vous les heures de prière ?', 'L’itinéraire est construit autour des cinq prières, avec des arrêts dans des mosquées comme celle de Kobe ou dans des salles de prière.'],
      ['La nourriture est-elle halal ?', 'Nous choisissons à l’avance des restaurants certifiés halal ou adaptés aux musulmans, et la guide vérifie les ingrédients comme le mirin.'],
      ['Devons-nous participer à quelque chose dans les temples ?', 'Non. Dans les temples et sanctuaires, la guide explique seulement l’histoire et la culture.'],
      ['Combien ça coûte et quand réserver ?', 'Nous envoyons un prix pour votre groupe avant la réservation. Idéalement 1 à 2 semaines avant.'],
    ],
    finalH: 'Envoyez-nous vos dates',
    final: 'Nous répondons sur WhatsApp avec une guide et un prix.',
    pie: 'Tony Kansai Guide · Osaka, Japon', idiomas: 'Autres langues', fotos: 'Photos', inicio: 'Accueil',
  },
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const waLink = (texto) => `https://wa.me/${WA}?text=${encodeURIComponent(texto)}`
const LENGUAS = ['ar', 'id', 'ms', 'en', 'fr', 'ja', 'es']
const srcset = (f) => `/v8/zonas/${f}-600.webp 600w, /v8/zonas/${f}-900.webp 900w, /v8/zonas/${f}.webp 1800w`

function jsonLd(lang, t) {
  const url = BASE + RUTAS[lang]
  const ciudad = (n) => ({ '@type': 'City', name: n, containedInPlace: { '@type': 'Country', name: 'Japan' } })
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': url + '#pagina', url, name: t.title, description: t.desc, inLanguage: lang, dateModified: MODIFICADO, isPartOf: { '@id': BASE + '/#sitio' }, about: { '@id': url + '#servicio' }, primaryImageOfPage: `${BASE}/v8/zonas/${HEROE}.webp` },
      {
        '@type': 'Service', '@id': url + '#servicio', name: t.h1, description: t.desc, serviceType: 'Private tour guide',
        provider: { '@id': BASE + '/#negocio' },
        areaServed: ['Osaka', 'Kyoto', 'Nara', 'Kobe'].map(ciudad),
        availableLanguage: LENGUAS,
        audience: { '@type': 'Audience', audienceType: 'Muslim women, women-only groups and Muslim families' },
        termsOfService: 'Price quoted per group before booking',
        availableChannel: { '@type': 'ServiceChannel', serviceUrl: url, servicePhone: '+34634193106', availableLanguage: LENGUAS },
      },
      { '@type': 'FAQPage', '@id': url + '#faq', inLanguage: lang, mainEntity: [...t.faq, ...E[lang].faqExtra].map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: t.inicio, item: BASE + INICIO[lang] },
        { '@type': 'ListItem', position: 2, name: t.h1, item: url },
      ] },
    ],
  }
}

const CSS = `
:root{--washi:#fdfcfa;--sakura-velo:#fbf1f4;--sakura:#f6d9e0;--sakura-hondo:#e8a9b9;--cielo-velo:#edf4fa;--cielo:#d6e8f5;--verde:#2a7352;--verde-hondo:#1f5c41;--sello:#a63a3f;--tinta:#1e2a36;--tenue:#56606c;--linea:#e8e2da;--radio:22px;--titular:'Zen Old Mincho',Georgia,serif}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}html.lenis,html.lenis body{height:auto}.lenis.lenis-smooth{scroll-behavior:auto!important}
body{margin:0;background:var(--washi);color:var(--tinta);font:17px/1.65 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;overflow-wrap:break-word;-webkit-font-smoothing:antialiased}
[dir=rtl] body{font-family:'IBM Plex Sans Arabic',system-ui,sans-serif;--titular:'Amiri','Noto Naskh Arabic',serif}
h1,h2,h3{font-family:var(--titular);font-weight:500;line-height:1.15;margin:0;text-wrap:balance}
[dir=rtl] h1,[dir=rtl] h2,[dir=rtl] h3{font-weight:700;line-height:1.35}
p{margin:0}a{color:var(--verde)}
.kap{width:100%;max-width:1080px;margin:0 auto;padding:0 22px}
.cab{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;max-width:1080px;margin:0 auto}
.marca{font-weight:700;color:var(--tinta);text-decoration:none;font-size:16px}
.sello{display:inline-grid;place-items:center;width:38px;height:38px;border:2px solid var(--sello);color:var(--sello);border-radius:6px;font:700 13px/1 'Zen Old Mincho',serif;writing-mode:vertical-rl;letter-spacing:2px;transform:rotate(-4deg)}
.heroe{padding:8px 0 40px}
.heroe .kap{display:grid;gap:26px}
.heroe h1{font-size:clamp(38px,10.5vw,76px);letter-spacing:-.015em}
[dir=rtl] .heroe h1{letter-spacing:0}
.heroe .sub{font-size:clamp(18px,4.6vw,21px);color:var(--tenue);max-width:34em;margin-top:16px}
.lengua{display:flex;align-items:flex-start;gap:12px;margin-top:18px;font-weight:600;font-size:16px}
.lengua::before{content:"";width:10px;height:10px;border-radius:50%;background:var(--verde);box-shadow:0 0 0 5px var(--verde-velo,#e8f3ec);flex:none;margin-top:.55em}
.cta{margin-top:26px;display:grid;gap:12px;justify-items:start}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:56px;padding:0 28px;border-radius:999px;background:var(--verde);color:#fff;font-weight:700;font-size:17px;text-decoration:none;box-shadow:0 10px 24px -12px rgba(31,92,65,.6);transition:background .2s}
.btn:hover{background:var(--verde-hondo)}.btn svg{width:22px;height:22px;flex:none}
.correo{font-size:15px;color:var(--tenue)}.correo a{color:var(--tinta)}
.foto{position:relative;border-radius:var(--radio);overflow:hidden;aspect-ratio:4/5;background:var(--sakura);isolation:isolate}
.foto img{width:100%;height:100%;object-fit:cover;display:block}
.foto::after{content:"";position:absolute;inset:auto 0 0;height:30%;background:linear-gradient(transparent,rgba(30,42,54,.35));pointer-events:none}
.datos{background:var(--sakura-velo);padding:44px 0}
.datos ul{list-style:none;margin:0;padding:0;display:grid;gap:26px}
.datos li{display:grid;grid-template-columns:auto 1fr;gap:18px;align-items:center}
.datos b{font:500 clamp(52px,15vw,84px)/1 var(--titular);color:transparent;-webkit-text-stroke:1.5px var(--tinta);min-width:1.3em;font-variant-numeric:tabular-nums}
[dir=rtl] .datos b{font-weight:700}
.datos li:nth-child(3) b{font-size:clamp(34px,10vw,52px);-webkit-text-stroke:0;color:var(--sello)}
.datos span{font-size:18px;font-weight:600}
.bloque{padding-top:56px;padding-bottom:8px}
.bloque h2{font-size:clamp(30px,8vw,46px);margin-bottom:24px}
.opciones{display:grid;gap:14px}
.op{background:#fff;border:1px solid var(--linea);border-radius:var(--radio);padding:22px 22px 24px;border-top:4px solid var(--sakura-hondo)}
.op:nth-child(2){border-top-color:var(--cielo)}.op:nth-child(3){border-top-color:var(--verde)}
.op h3{font-size:24px;margin-bottom:6px}.op p{color:var(--tenue)}
.via{margin-top:28px;background:#fff;border:1px solid var(--linea);border-radius:var(--radio);padding:22px;border-inline-start:4px solid var(--sakura-hondo)}.via h2{font-size:clamp(24px,6vw,32px);margin-bottom:8px}.via p{color:var(--tenue)}
.intro{max-width:62ch;color:var(--tenue);margin:-8px 0 22px}
.neces{display:grid;gap:0;counter-reset:n}.nec{padding:18px 0;border-bottom:1px solid var(--linea)}.nec h3{font-family:inherit;font-weight:700;font-size:18px;line-height:1.4;margin-bottom:4px}.nec h3::before{counter-increment:n;content:counter(n,decimal-leading-zero) '  ';color:var(--sakura-hondo)}.nec p{color:var(--tenue)}
.aero{margin-top:18px;font-size:15px;color:var(--tenue)}
.ciudades{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:22px;padding:0 22px 8px;margin:0 -22px;scrollbar-width:none}
.ciudades::-webkit-scrollbar{display:none}
.ciudad{flex:0 0 76%;scroll-snap-align:start;margin:0}
.ciudad .foto{aspect-ratio:3/4}
.ciudad figcaption{padding:12px 4px 0}.ciudad h3{font-size:24px}.ciudad p{color:var(--tenue);font-size:16px}
ol.pasos{list-style:none;margin:0;padding:0;display:grid;gap:4px;counter-reset:p}
ol.pasos li{counter-increment:p;display:grid;grid-template-columns:48px 1fr;gap:14px;align-items:baseline;padding:16px 0;border-bottom:1px solid var(--linea);font-size:18px}
ol.pasos li::before{content:counter(p);font:500 34px/1 var(--titular);color:var(--sello)}
.faq{display:grid;gap:0}.bloque.dos>div+div{margin-top:48px}
.faq div{padding:20px 0;border-bottom:1px solid var(--linea)}
.faq h3{font-family:inherit;font-weight:700;font-size:18px;line-height:1.4;margin-bottom:6px}
.faq p{color:var(--tenue)}
.final{margin-top:64px;background:var(--cielo-velo);padding:56px 0 64px;text-align:center}
.final .kap{display:grid;gap:14px;justify-items:center}
.final h2{font-size:clamp(32px,8.5vw,52px)}.final p{color:var(--tenue);font-size:18px}
footer{padding:28px 0 110px;font-size:14px;color:var(--tenue)}
footer .kap{display:grid;gap:12px}
footer nav{display:flex;flex-wrap:wrap;gap:6px 14px}footer a{color:var(--tenue)}
.creditos{font-size:12px}
.wa-fijo{position:fixed;inset:auto 14px 14px;z-index:5;display:flex;justify-content:center;transition:transform .35s,opacity .35s}
.wa-fijo .btn{width:100%;max-width:460px}
.wa-fijo.oculto{transform:translateY(130%);opacity:0;pointer-events:none}
.js-anim .entra,.js-anim .rev{visibility:hidden}
@media (min-width:760px){
  body{font-size:18px}.kap{padding:0 32px}.cab{padding:22px 32px}
  .heroe .kap{grid-template-columns:1.1fr .9fr;align-items:center;gap:56px}.heroe{padding:24px 0 72px}
  .datos ul{grid-template-columns:repeat(3,1fr)}.datos li{grid-template-columns:1fr;gap:8px}
  .opciones{grid-template-columns:repeat(3,1fr)}
  .neces{grid-template-columns:1fr 1fr;column-gap:48px}
  .ciudades{display:grid;grid-template-columns:repeat(4,1fr);overflow:visible;margin:0;padding:0}
  .bloque.dos{display:grid;grid-template-columns:1fr 1.2fr;gap:56px}.bloque.dos>div+div{margin-top:0}
  .wa-fijo{display:none}footer{padding-bottom:40px}
}
@media (prefers-reduced-motion:reduce){.js-anim .entra,.js-anim .rev{visibility:visible}}
`

const ICONO_WA = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>'

// Animación: GSAP + ScrollTrigger + SplitText + Lenis por jsdelivr (versión fijada), como familias.mjs.
// Sin JS o si falla la carga, todo se ve (la clase js-anim se quita). En árabe NO SplitText:
// aun con type 'lines' rompía las ligaduras de los titulares (comprobado el 24-11).
const JS = `
(function(){var h=document.documentElement;
var b=document.querySelector('.wa-fijo'),z=document.querySelectorAll('.heroe .cta,.final');
if(b&&'IntersectionObserver' in window){var v=new Set();var io=new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting?v.add(e.target):v.delete(e.target)});b.classList.toggle('oculto',v.size>0)});z.forEach(function(x){io.observe(x)})}
if(!h.classList.contains('js-anim'))return;
var CDN='https://cdn.jsdelivr.net/npm/',GS=CDN+'gsap@${GSAP_V}/dist/';
function c(s){return new Promise(function(ok,mal){var e=document.createElement('script');e.src=s;e.onload=ok;e.onerror=mal;document.head.appendChild(e)})}
var corte=setTimeout(function(){h.classList.remove('js-anim')},4000);
Promise.all([c(GS+'gsap.min.js'),c(CDN+'lenis@${LENIS_V}/dist/lenis.min.js')]).then(function(){return Promise.all([c(GS+'ScrollTrigger.min.js'),c(GS+'SplitText.min.js')])}).then(function(){clearTimeout(corte);iniciar()}).catch(function(){h.classList.remove('js-anim')});
function iniciar(){var g=window.gsap,ST=window.ScrollTrigger,Sp=window.SplitText;g.registerPlugin(ST,Sp);
var lenis=new window.Lenis({stopInertiaOnNavigate:true});lenis.on('scroll',ST.update);g.ticker.add(function(t){lenis.raf(t*1000)});g.ticker.lagSmoothing(0);
var mm=g.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)',function(){
 var ar=h.dir==='rtl',h1=document.querySelector('.heroe h1');
 g.set('.entra',{visibility:'visible'});g.set('.rev',{autoAlpha:0,y:34});
 if(h1&&ar)g.from(h1,{y:30,autoAlpha:0,duration:1.1,ease:'expo.out',delay:.1});
 if(h1&&!ar)Sp.create(h1,{type:'words,lines',mask:'lines',autoSplit:true,onSplit:function(s){return g.from(s.lines,{yPercent:110,duration:1.1,ease:'expo.out',stagger:.09,delay:.1})}});
 g.from('.heroe .entra',{y:22,autoAlpha:0,duration:.9,ease:'power3.out',stagger:.08,delay:.45});
 g.fromTo('.heroe .foto',{clipPath:'inset(18% 10% 18% 10% round 22px)'},{clipPath:'inset(0% 0% 0% 0% round 22px)',duration:1.5,ease:'expo.inOut',delay:.2});
 g.fromTo('.heroe .foto img',{scale:1.25},{scale:1.04,duration:2.4,ease:'expo.out',delay:.2});
 g.to('.heroe .foto img',{yPercent:8,ease:'none',scrollTrigger:{trigger:'.heroe',start:'top top',end:'bottom top',scrub:true}});
 g.utils.toArray('.datos b').forEach(function(n){var f=parseInt(n.textContent,10);if(!isNaN(f)){var o={v:0};g.to(o,{v:f,duration:1.4,ease:'power2.out',scrollTrigger:{trigger:n,start:'top 88%'},onUpdate:function(){n.textContent=Math.round(o.v)}})}});
 ST.batch('.rev',{start:'top 92%',once:true,onEnter:function(els){g.to(els,{y:0,autoAlpha:1,duration:.9,ease:'power3.out',stagger:.08,overwrite:true})}});
 g.utils.toArray('.bloque h2,.final h2').forEach(function(t){if(ar){g.from(t,{y:24,autoAlpha:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:t,start:'top 90%',once:true}});return}Sp.create(t,{type:'lines',mask:'lines',autoSplit:true,onSplit:function(s){return g.from(s.lines,{yPercent:105,duration:1,ease:'expo.out',stagger:.08,scrollTrigger:{trigger:t,start:'top 88%',once:true}})}})});
 g.utils.toArray('.ciudad .foto img').forEach(function(i){g.fromTo(i,{scale:1.18},{scale:1,ease:'none',scrollTrigger:{trigger:i,start:'top bottom',end:'bottom top',scrub:true}})});
});
mm.add('(prefers-reduced-motion: reduce)',function(){g.set('.entra,.rev',{visibility:'visible'})});
}})();
`

function pagina(lang) {
  const t = T[lang]
  const e = E[lang]
  const rtl = lang === 'ar'
  const url = BASE + RUTAS[lang]
  const alternos = Object.entries(RUTAS).map(([l, r]) => `<link rel="alternate" hreflang="${l}" href="${BASE + r}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${BASE + RUTAS.en}">`
  const otros = Object.entries(RUTAS).filter(([l]) => l !== lang).map(([l, r]) => `<a href="${r}" hreflang="${l}" lang="${l}">${NOMBRE_IDIOMA[l]}</a>`).join('')
  const mailto = `mailto:${MAIL}?subject=${encodeURIComponent(t.asunto)}&body=${encodeURIComponent(t.waTexto)}`
  const fuentes = rtl
    ? 'family=Amiri:wght@700&family=IBM+Plex+Sans+Arabic:wght@400;600;700'
    : 'family=Zen+Old+Mincho:wght@500;700'
  const boton = (extra = '') => `<a class="btn${extra}" href="${waLink(t.waTexto)}" target="_blank" rel="noopener">${ICONO_WA}${t.wa}</a>`
  return `<!doctype html>
<html lang="${lang}"${rtl ? ' dir="rtl"' : ''} data-estatica="guias-musulmanas">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}">
${alternos}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Tony Kansai Guide">
<meta property="og:locale" content="${lang}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(t.h1)}">
<meta property="og:description" content="${esc(t.desc)}">
<meta property="og:image" content="${BASE}/v8/zonas/${HEROE}.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#fdfcfa">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" as="image" href="/v8/zonas/${HEROE}-900.webp" imagesrcset="${srcset(HEROE)}" imagesizes="(min-width:760px) 45vw, 100vw" fetchpriority="high">
<script type="application/ld+json">${JSON.stringify(jsonLd(lang, t))}</script>
<script>if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-anim')</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fuentes}&display=swap">
<style>${CSS}</style>
</head>
<body>
<header class="cab"><a class="marca" href="${INICIO[lang]}">Tony Kansai Guide</a><span class="sello" aria-hidden="true">日本</span></header>
<main>
<section class="heroe">
  <div class="kap">
    <div>
      <h1>${t.h1}</h1>
      <p class="sub entra">${t.sub}</p>
      <p class="lengua entra">${t.lengua}</p>
      <div class="cta entra">${boton()}<span class="correo">${t.mail} <a href="${esc(mailto)}">${MAIL}</a></span></div>
    </div>
    <div class="foto"><img src="/v8/zonas/${HEROE}-900.webp" srcset="${srcset(HEROE)}" sizes="(min-width:760px) 45vw, 100vw" width="900" height="1125" alt="" fetchpriority="high"></div>
  </div>
</section>
<section class="datos"><div class="kap"><ul>${t.datos.map(([n, d]) => `<li class="rev"><b>${n}</b><span>${d}</span></li>`).join('')}</ul></div></section>
<section class="kap bloque">
  <h2>${t.opcionesH}</h2>
  <div class="opciones">${t.opciones.map(([a, b]) => `<article class="op rev"><h3>${a}</h3><p>${b}</p></article>`).join('')}</div>
  <div class="via rev"><h2>${e.viaH}</h2><p>${e.via}</p></div>
</section>
<section class="kap bloque" id="estudio">
  <h2>${e.estudioH}</h2>
  <p class="intro rev">${e.estudio}</p>
  <div class="neces">${e.neces.map(([a, b]) => `<div class="nec rev"><h3>${a}</h3><p>${b}</p></div>`).join('')}</div>
  <p class="aero rev">${e.airport}</p>
</section>
<section class="kap bloque">
  <h2>${t.ciudadesH}</h2>
  <div class="ciudades">${t.ciudades.map(([c, d], i) => `<figure class="ciudad rev"><div class="foto"><img src="/v8/zonas/${FOTOS_CIUDAD[i]}-600.webp" srcset="${srcset(FOTOS_CIUDAD[i])}" sizes="(min-width:760px) 25vw, 76vw" width="600" height="800" alt="${c}" loading="lazy" decoding="async"></div><figcaption><h3>${c}</h3><p>${d}</p></figcaption></figure>`).join('')}</div>
</section>
<section class="kap bloque dos">
  <div><h2>${t.pasosH}</h2><ol class="pasos">${t.pasos.map((p) => `<li class="rev">${p}</li>`).join('')}</ol></div>
  <div><h2>${t.faqH}</h2><div class="faq">${[...t.faq, ...e.faqExtra].map(([q, a]) => `<div class="rev"><h3>${q}</h3><p>${a}</p></div>`).join('')}${t.mas ? `<div class="rev"><h3>${t.masH}</h3><p>${t.mas}</p></div>` : ''}</div></div>
</section>
<section class="final"><div class="kap"><h2>${t.finalH}</h2><p>${t.final}</p>${boton()}</div></section>
</main>
<footer><div class="kap">
  <span>${t.pie} · <a href="mailto:${MAIL}">${MAIL}</a></span>
  <nav aria-label="${esc(t.idiomas)}"><span>${t.idiomas}:</span>${otros}</nav>
  <span class="creditos">${t.fotos}: ${CREDITOS.map(([l, a, li, u]) => `<a href="${u}" rel="noopener" target="_blank">${l}</a>, ${a}, ${li}`).join(' · ')}</span>
</div></footer>
<div class="wa-fijo">${boton()}</div>
<script>${JS}</script>
</body>
</html>
`
}

// Solo escribe al ejecutarse directamente: build-sitemap.mjs importa RUTAS sin regenerar.
if (import.meta.url === `file://${process.argv[1]}`) {
  for (const lang of Object.keys(RUTAS)) {
    const dir = join(root, 'public', RUTAS[lang])
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'index.html'), pagina(lang))
    console.log('ok', RUTAS[lang])
  }
}
