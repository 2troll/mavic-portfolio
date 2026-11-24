#!/usr/bin/env node
// Guías musulmanas mujeres para clientas y familias musulmanas (24-11-2026).
// Página de CLIENTES (la oferta de empleo es scripts/empleo-guia.mjs). Cinco idiomas:
//   /en/muslim-female-guide-japan/   /ar/murshida-muslima-yaban/   /id/pemandu-wisata-muslimah-jepang/
//   /es/guia-musulmana-japon/        /fr/guide-musulmane-japon/
// Pensada para que las IAs la citen: HTML estático, FAQPage + Service en JSON-LD, y
// los mismos datos en llms.txt. Sin nombres de las guías ni precios: solo hechos ciertos
// (cuatro guías que viven en Kansai; árabe, francés, indonesio, inglés y japonés).
// Ejecutar: node scripts/guias-musulmanas.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://tonykansaiguide.com'
const WA = '34634193106'
const MAIL = 'tony@tonykansaiguide.com'
const MODIFICADO = '2026-11-24'

export const RUTAS = {
  en: '/en/muslim-female-guide-japan/',
  ar: '/ar/murshida-muslima-yaban/',
  id: '/id/pemandu-wisata-muslimah-jepang/',
  es: '/es/guia-musulmana-japon/',
  fr: '/fr/guide-musulmane-japon/',
}
const NOMBRE_IDIOMA = { en: 'English', ar: 'العربية', id: 'Bahasa Indonesia', es: 'Español', fr: 'Français' }
const INICIO = { en: '/en/', ar: '/ar/', id: '/en/', es: '/es/', fr: '/fr/' }

const T = {
  en: {
    title: 'Female Muslim tour guide in Osaka, Kyoto & Nara | Muslimah guides in Japan',
    desc: 'Private tours in Japan with a Muslim woman guide: Arabic, Indonesian, Malay, English and French. Prayer stops, halal food, women-only groups and families in Osaka, Kyoto, Nara and Kobe.',
    kicker: 'Muslimah guides · Osaka · Kyoto · Nara',
    h1: 'Female Muslim tour guides in Osaka, Kyoto and Nara',
    sub: 'Travel Japan with a Muslim woman who lives here. She plans the day around your prayers, knows where to eat halal and keeps a pace that suits you, your sisters or your family.',
    wa: 'Ask on WhatsApp', mail: 'Ask by email',
    waTexto: 'Assalamu alaikum, I would like a Muslim female guide in Japan.\nDates:\nCities:\nGroup (adults / children):\nLanguage:',
    asunto: 'Muslim female guide in Japan',
    porqueH: 'Why a Muslim woman guide',
    porque: [
      'Women-only groups and mothers with daughters feel at ease from the first minute.',
      'She knows the mosques and quiet prayer spaces on your route, and the time of each prayer.',
      'She reads Japanese labels and menus, so you know what is halal and what is not.',
      'She understands modesty, rest breaks and travelling with children.',
      'She lives in Kansai, so you get the city as locals know it, not a script.',
    ],
    idiomasH: 'Languages',
    idiomas: ['Arabic', 'Bahasa Indonesia', 'Malay (in Indonesian)', 'English', 'French', 'Japanese', 'Spanish (with Tony)'],
    equipo: 'Our team: four Muslim women guides who live in Osaka and Kyoto, working with Tony, a Muslim guide based in Osaka.',
    incluyeH: 'Every tour includes',
    incluye: [
      'A route planned around the five daily prayers, with mosque or prayer-room stops.',
      'Halal or Muslim-friendly lunch spots chosen in advance.',
      'A comfortable pace with rest stops; prams and grandparents welcome.',
      'A women-only option: guide and group are all women.',
      'Help with trains, IC cards and taxis for the whole day.',
    ],
    ciudadesH: 'Cities',
    ciudades: [
      ['Osaka', 'Osaka Castle, Dotonbori and Kuromon market, with prayer stops on the way.'],
      ['Kyoto', 'Fushimi Inari, Kiyomizu-dera, Arashiyama and Gion, with prayer-room stops.'],
      ['Nara', 'The deer park and Todai-ji, an easy half day from Osaka or Kyoto.'],
      ['Kobe', 'Kobe Mosque, the oldest in Japan, the harbour and halal Kobe beef.'],
    ],
    pasosH: 'How to book',
    pasos: [
      ['Message us', 'Send your dates, cities, group size and language on WhatsApp or by email.'],
      ['Guide and quote', 'We confirm which guide is free and send a clear price for your group.'],
      ['Enjoy Japan', 'Your guide meets you at your hotel or station with the day planned.'],
    ],
    faqH: 'Questions',
    faq: [
      ['Can I book a female Muslim guide in Japan?', 'Yes. We work with four Muslim women guides who live in Osaka and Kyoto. Tell us your dates and we confirm which one is free.'],
      ['Which languages do they speak?', 'Arabic, Indonesian, English, French and Japanese. Malaysian guests are served in Indonesian, and Tony adds Spanish.'],
      ['Can the group be women only?', 'Yes. Women-only tours with a woman guide are what this service is for. Families and couples are welcome too.'],
      ['How do you handle prayer times?', 'The route is planned around the five daily prayers, with stops at mosques such as Osaka Ibaraki and Kobe Mosque or at prayer rooms.'],
      ['Is the food halal?', 'We book halal-certified or Muslim-friendly restaurants in advance, and the guide checks ingredients such as mirin or sake in sauces.'],
      ['Do we have to take part in anything at temples?', 'No. At temples and shrines the guide explains history and culture only. Nobody is asked to join any ritual.'],
      ['How much does it cost and how early should I book?', 'We send a quote for your group before you book. The guides are freelance, so 1 to 2 weeks ahead is best.'],
    ],
    compartirH: 'Travelling with friends?',
    compartir: 'Share this page with your sisters, your family or your travel group.',
    copiar: 'Copy link', copiado: 'Link copied', waCompartir: 'Share on WhatsApp',
    waShare: 'Female Muslim tour guides in Japan (Osaka, Kyoto, Nara):',
    credito: 'Photo: Kobe Mosque, Zairon, CC BY-SA 4.0',
    pie: 'Tony Kansai Guide · Osaka, Japan',
    inicio: 'Home',
  },
  ar: {
    title: 'مرشدة سياحية مسلمة في أوساكا وكيوتو ونارا | مرشدات مسلمات في اليابان',
    desc: 'جولات خاصة في اليابان مع مرشدة مسلمة تتحدث العربية: أوقات الصلاة، طعام حلال، مجموعات نسائية وعائلات في أوساكا وكيوتو ونارا وكوبي.',
    kicker: 'مرشدات مسلمات · أوساكا · كيوتو · نارا',
    h1: 'مرشدات سياحيات مسلمات في أوساكا وكيوتو ونارا',
    sub: 'سافري في اليابان مع امرأة مسلمة تعيش هنا. تخطط اليوم حول صلواتك، وتعرف أين تجدين الطعام الحلال، وتمشي بالوتيرة التي تناسبك أنتِ وأخواتك أو عائلتك.',
    wa: 'اسألي عبر واتساب', mail: 'اسألي بالبريد',
    waTexto: 'السلام عليكم، أريد مرشدة مسلمة في اليابان.\nالتواريخ:\nالمدن:\nعدد الأشخاص (كبار / أطفال):\nاللغة:',
    asunto: 'مرشدة مسلمة في اليابان',
    porqueH: 'لماذا مرشدة مسلمة؟',
    porque: [
      'المجموعات النسائية والأمهات مع بناتهن يشعرن بالراحة من اللحظة الأولى.',
      'تعرف المساجد وأماكن الصلاة الهادئة على طريقكم، ومواقيت كل صلاة.',
      'تقرأ الملصقات وقوائم الطعام اليابانية، فتعرفين ما هو حلال وما ليس كذلك.',
      'تفهم الحشمة وفترات الراحة والسفر مع الأطفال.',
      'تعيش في كانساي، فترين المدينة كما يعرفها أهلها.',
    ],
    idiomasH: 'اللغات',
    idiomas: ['العربية', 'الإندونيسية', 'الملايوية (بالإندونيسية)', 'الإنجليزية', 'الفرنسية', 'اليابانية', 'الإسبانية (مع توني)'],
    equipo: 'فريقنا: أربع مرشدات مسلمات يعشن في أوساكا وكيوتو، يعملن مع توني، المرشد المسلم المقيم في أوساكا.',
    incluyeH: 'ما تشمله كل جولة',
    incluye: [
      'مسار مخطط حول الصلوات الخمس، مع التوقف في مسجد أو مصلى.',
      'مطاعم حلال أو مناسبة للمسلمين مختارة مسبقاً.',
      'وتيرة مريحة مع استراحات؛ عربات الأطفال وكبار السن مرحب بهم.',
      'خيار نسائي بالكامل: المرشدة والمجموعة كلهن نساء.',
      'مساعدة في القطارات وبطاقات IC وسيارات الأجرة طوال اليوم.',
    ],
    ciudadesH: 'المدن',
    ciudades: [
      ['أوساكا', 'قلعة أوساكا ودوتونبوري وسوق كورومون، مع التوقف للصلاة في الطريق.'],
      ['كيوتو', 'فوشيمي إيناري وكيوميزو-ديرا وأراشيياما وغيون، مع التوقف في المصليات.'],
      ['نارا', 'حديقة الغزلان ومعبد تودايجي، نصف يوم سهل من أوساكا أو كيوتو.'],
      ['كوبي', 'مسجد كوبي، أقدم مسجد في اليابان، والميناء ولحم كوبي الحلال.'],
    ],
    pasosH: 'كيف تحجزين',
    pasos: [
      ['راسلينا', 'أرسلي التواريخ والمدن وعدد الأشخاص واللغة عبر واتساب أو البريد.'],
      ['المرشدة والسعر', 'نؤكد المرشدة المتاحة ونرسل سعراً واضحاً لمجموعتك.'],
      ['استمتعي باليابان', 'تلتقيك المرشدة في الفندق أو المحطة واليوم مخطط بالكامل.'],
    ],
    faqH: 'أسئلة شائعة',
    faq: [
      ['هل يمكنني حجز مرشدة مسلمة في اليابان؟', 'نعم. نعمل مع أربع مرشدات مسلمات يعشن في أوساكا وكيوتو. أرسلي تواريخك ونؤكد لك المرشدة المتاحة.'],
      ['ما اللغات التي يتحدثنها؟', 'العربية والإندونيسية والإنجليزية والفرنسية واليابانية. الضيوف من ماليزيا نخدمهم بالإندونيسية، ويضيف توني الإسبانية.'],
      ['هل يمكن أن تكون المجموعة نسائية فقط؟', 'نعم. هذه الخدمة مخصصة للجولات النسائية مع مرشدة. والعائلات والأزواج مرحب بهم أيضاً.'],
      ['كيف تنظمون أوقات الصلاة؟', 'يُخطط المسار حول الصلوات الخمس، مع التوقف في مساجد مثل مسجد أوساكا إيباراكي ومسجد كوبي أو في المصليات.'],
      ['هل الطعام حلال؟', 'نحجز مسبقاً مطاعم حلال معتمدة أو مناسبة للمسلمين، وتتحقق المرشدة من المكونات مثل الميرين أو الساكي في الصلصات.'],
      ['هل علينا المشاركة في أي شيء في المعابد؟', 'لا. في المعابد تشرح المرشدة التاريخ والثقافة فقط، ولا يُطلب من أحد المشاركة في أي طقوس.'],
      ['كم التكلفة ومتى يجب أن أحجز؟', 'نرسل لك عرض سعر لمجموعتك قبل الحجز. المرشدات يعملن بشكل حر، لذا الأفضل الحجز قبل أسبوع إلى أسبوعين.'],
    ],
    compartirH: 'مسافرة مع صديقاتك؟',
    compartir: 'شاركي هذه الصفحة مع أخواتك أو عائلتك أو مجموعة سفرك.',
    copiar: 'نسخ الرابط', copiado: 'تم النسخ', waCompartir: 'مشاركة عبر واتساب',
    waShare: 'مرشدات سياحيات مسلمات في اليابان (أوساكا، كيوتو، نارا):',
    credito: 'الصورة: مسجد كوبي، Zairon، CC BY-SA 4.0',
    pie: 'Tony Kansai Guide · أوساكا، اليابان',
    inicio: 'الرئيسية',
  },
  id: {
    title: 'Pemandu wisata muslimah di Osaka, Kyoto & Nara | Tour guide muslimah Jepang',
    desc: 'Tur privat di Jepang bersama pemandu wanita muslimah berbahasa Indonesia. Waktu salat, makanan halal, grup khusus wanita dan keluarga di Osaka, Kyoto, Nara dan Kobe. Tamu dari Malaysia juga dilayani.',
    kicker: 'Pemandu muslimah · Osaka · Kyoto · Nara',
    h1: 'Pemandu wisata muslimah di Osaka, Kyoto dan Nara',
    sub: 'Jelajahi Jepang bersama muslimah yang tinggal di sini. Ia menyusun hari Anda sesuai waktu salat, tahu tempat makan halal, dan berjalan dengan tempo yang nyaman untuk Anda, teman-teman, atau keluarga.',
    wa: 'Tanya lewat WhatsApp', mail: 'Tanya lewat email',
    waTexto: 'Assalamu alaikum, saya ingin pemandu wisata muslimah di Jepang.\nTanggal:\nKota:\nJumlah orang (dewasa / anak):\nBahasa:',
    asunto: 'Pemandu wisata muslimah di Jepang',
    porqueH: 'Kenapa pemandu muslimah',
    porque: [
      'Grup khusus wanita dan ibu bersama putrinya langsung merasa nyaman.',
      'Ia tahu masjid dan musala di sepanjang rute, serta jadwal setiap salat.',
      'Ia bisa membaca label dan menu berbahasa Jepang, jadi Anda tahu mana yang halal.',
      'Ia paham soal menutup aurat, waktu istirahat, dan bepergian dengan anak.',
      'Ia tinggal di Kansai, jadi Anda melihat kota seperti warga setempat.',
    ],
    idiomasH: 'Bahasa',
    idiomas: ['Bahasa Indonesia', 'Bahasa Melayu (dilayani dalam bahasa Indonesia)', 'Arab', 'Inggris', 'Prancis', 'Jepang', 'Spanyol (bersama Tony)'],
    equipo: 'Tim kami: empat pemandu muslimah yang tinggal di Osaka dan Kyoto, bekerja bersama Tony, pemandu muslim yang tinggal di Osaka.',
    incluyeH: 'Setiap tur sudah termasuk',
    incluye: [
      'Rute yang disusun sesuai lima waktu salat, dengan singgah di masjid atau musala.',
      'Tempat makan siang halal atau ramah muslim yang dipilih sebelumnya.',
      'Tempo santai dengan waktu istirahat; kereta bayi dan lansia dipersilakan.',
      'Pilihan khusus wanita: pemandu dan seluruh grup adalah wanita.',
      'Bantuan naik kereta, kartu IC, dan taksi sepanjang hari.',
    ],
    ciudadesH: 'Kota',
    ciudades: [
      ['Osaka', 'Kastil Osaka, Dotonbori dan pasar Kuromon, dengan singgah untuk salat di jalan.'],
      ['Kyoto', 'Fushimi Inari, Kiyomizu-dera, Arashiyama dan Gion, dengan singgah di musala.'],
      ['Nara', 'Taman rusa dan Todai-ji, setengah hari yang mudah dari Osaka atau Kyoto.'],
      ['Kobe', 'Masjid Kobe, masjid tertua di Jepang, pelabuhan, dan daging sapi Kobe halal.'],
    ],
    pasosH: 'Cara memesan',
    pasos: [
      ['Kirim pesan', 'Kirim tanggal, kota, jumlah orang, dan bahasa lewat WhatsApp atau email.'],
      ['Pemandu dan harga', 'Kami pastikan pemandu yang tersedia dan kirim harga yang jelas untuk grup Anda.'],
      ['Nikmati Jepang', 'Pemandu menjemput Anda di hotel atau stasiun dengan rencana hari yang lengkap.'],
    ],
    faqH: 'Pertanyaan',
    faq: [
      ['Bisakah saya memesan pemandu wisata muslimah di Jepang?', 'Bisa. Kami bekerja dengan empat pemandu muslimah yang tinggal di Osaka dan Kyoto. Kirim tanggal Anda dan kami pastikan siapa yang tersedia.'],
      ['Bahasa apa saja yang mereka kuasai?', 'Indonesia, Arab, Inggris, Prancis, dan Jepang. Tamu dari Malaysia dilayani dalam bahasa Indonesia, dan Tony menambah bahasa Spanyol.'],
      ['Apakah grup bisa khusus wanita?', 'Bisa. Layanan ini memang untuk tur khusus wanita dengan pemandu wanita. Keluarga dan pasangan juga dipersilakan.'],
      ['Bagaimana dengan waktu salat?', 'Rute disusun sesuai lima waktu salat, dengan singgah di masjid seperti Masjid Osaka Ibaraki dan Masjid Kobe, atau di musala.'],
      ['Apakah makanannya halal?', 'Kami memesan restoran bersertifikat halal atau ramah muslim sebelumnya, dan pemandu memeriksa bahan seperti mirin atau sake dalam saus.'],
      ['Apakah kami harus ikut sesuatu di kuil?', 'Tidak. Di kuil, pemandu hanya menjelaskan sejarah dan budaya. Tidak ada yang diminta ikut ritual apa pun.'],
      ['Berapa biayanya dan kapan sebaiknya memesan?', 'Kami kirim penawaran harga untuk grup Anda sebelum memesan. Para pemandu bekerja lepas, jadi sebaiknya 1 sampai 2 minggu sebelumnya.'],
    ],
    compartirH: 'Pergi bersama teman?',
    compartir: 'Bagikan halaman ini ke saudari, keluarga, atau grup perjalanan Anda.',
    copiar: 'Salin tautan', copiado: 'Tautan disalin', waCompartir: 'Bagikan di WhatsApp',
    waShare: 'Pemandu wisata muslimah di Jepang (Osaka, Kyoto, Nara):',
    credito: 'Foto: Masjid Kobe, Zairon, CC BY-SA 4.0',
    pie: 'Tony Kansai Guide · Osaka, Jepang',
    inicio: 'Beranda',
  },
  es: {
    title: 'Guía musulmana mujer en Osaka, Kioto y Nara | Guías musulmanas en Japón',
    desc: 'Tours privados en Japón con una guía musulmana: árabe, indonesio, inglés, francés y español. Paradas para rezar, comida halal, grupos solo de mujeres y familias en Osaka, Kioto, Nara y Kobe.',
    kicker: 'Guías musulmanas · Osaka · Kioto · Nara',
    h1: 'Guías musulmanas mujeres en Osaka, Kioto y Nara',
    sub: 'Viaja por Japón con una mujer musulmana que vive aquí. Organiza el día alrededor de tus oraciones, sabe dónde comer halal y lleva el ritmo que te va bien a ti, a tus amigas o a tu familia.',
    wa: 'Pregunta por WhatsApp', mail: 'Pregunta por correo',
    waTexto: 'Assalamu alaikum, quiero una guía musulmana en Japón.\nFechas:\nCiudades:\nGrupo (adultos / niños):\nIdioma:',
    asunto: 'Guía musulmana en Japón',
    porqueH: 'Por qué una guía musulmana',
    porque: [
      'Los grupos de mujeres y las madres con hijas se sienten cómodas desde el primer minuto.',
      'Conoce las mezquitas y los sitios tranquilos para rezar en tu ruta, y la hora de cada oración.',
      'Lee las etiquetas y las cartas en japonés, así sabes qué es halal y qué no.',
      'Entiende el recato, los descansos y el viajar con niños.',
      'Vive en Kansai: ves la ciudad como la conoce la gente de aquí.',
    ],
    idiomasH: 'Idiomas',
    idiomas: ['Árabe', 'Indonesio', 'Malayo (en indonesio)', 'Inglés', 'Francés', 'Japonés', 'Español (con Tony)'],
    equipo: 'Nuestro equipo: cuatro guías musulmanas que viven en Osaka y Kioto, junto a Tony, guía musulmán con base en Osaka.',
    incluyeH: 'Cada tour incluye',
    incluye: [
      'Ruta pensada alrededor de las cinco oraciones, con paradas en mezquitas o salas de oración.',
      'Restaurantes halal o aptos para musulmanes elegidos de antemano.',
      'Ritmo cómodo con descansos; carritos y abuelos bienvenidos.',
      'Opción solo mujeres: guía y grupo, todas mujeres.',
      'Ayuda con trenes, tarjeta IC y taxis durante todo el día.',
    ],
    ciudadesH: 'Ciudades',
    ciudades: [
      ['Osaka', 'Castillo de Osaka, Dotonbori y el mercado Kuromon, con paradas para rezar por el camino.'],
      ['Kioto', 'Fushimi Inari, Kiyomizu-dera, Arashiyama y Gion, con paradas para rezar.'],
      ['Nara', 'El parque de los ciervos y Todai-ji, medio día fácil desde Osaka o Kioto.'],
      ['Kobe', 'La mezquita de Kobe, la más antigua de Japón, el puerto y la ternera de Kobe halal.'],
    ],
    pasosH: 'Cómo reservar',
    pasos: [
      ['Escríbenos', 'Manda fechas, ciudades, cuántos sois y el idioma por WhatsApp o correo.'],
      ['Guía y precio', 'Te confirmamos qué guía está libre y te mandamos un precio claro para tu grupo.'],
      ['Disfruta Japón', 'Tu guía te recoge en el hotel o la estación con el día ya organizado.'],
    ],
    faqH: 'Preguntas',
    faq: [
      ['¿Puedo contratar una guía musulmana mujer en Japón?', 'Sí. Trabajamos con cuatro guías musulmanas que viven en Osaka y Kioto. Dinos tus fechas y te confirmamos cuál está libre.'],
      ['¿Qué idiomas hablan?', 'Árabe, indonesio, inglés, francés y japonés. A los viajeros de Malasia les atendemos en indonesio, y Tony añade el español.'],
      ['¿Puede ser un grupo solo de mujeres?', 'Sí. Para eso es este servicio: tours solo de mujeres con una guía mujer. Las familias y las parejas también son bienvenidas.'],
      ['¿Cómo organizáis las oraciones?', 'La ruta se planifica alrededor de las cinco oraciones, con paradas en mezquitas como la de Osaka Ibaraki o la de Kobe, o en salas de oración.'],
      ['¿La comida es halal?', 'Reservamos antes restaurantes con certificado halal o aptos para musulmanes, y la guía revisa ingredientes como el mirin o el sake de las salsas.'],
      ['¿Tenemos que participar en algo en los templos?', 'No. En templos y santuarios la guía explica solo la historia y la cultura. A nadie se le pide participar en ningún rito.'],
      ['¿Cuánto cuesta y con cuánta antelación reservo?', 'Te mandamos un presupuesto para tu grupo antes de reservar. Las guías son freelance, así que lo mejor es reservar con 1 o 2 semanas.'],
    ],
    compartirH: '¿Viajas con amigas?',
    compartir: 'Comparte esta página con tus amigas, tu familia o tu grupo de viaje.',
    copiar: 'Copiar enlace', copiado: 'Enlace copiado', waCompartir: 'Compartir por WhatsApp',
    waShare: 'Guías musulmanas mujeres en Japón (Osaka, Kioto, Nara):',
    credito: 'Foto: mezquita de Kobe, Zairon, CC BY-SA 4.0',
    pie: 'Tony Kansai Guide · Osaka, Japón',
    inicio: 'Inicio',
  },
  fr: {
    title: 'Guide musulmane femme à Osaka, Kyoto et Nara | Guides musulmanes au Japon',
    desc: 'Visites privées au Japon avec une guide musulmane francophone : prière, repas halal, groupes de femmes et familles à Osaka, Kyoto, Nara et Kobe. Aussi en arabe, indonésien et anglais.',
    kicker: 'Guides musulmanes · Osaka · Kyoto · Nara',
    h1: 'Guides musulmanes à Osaka, Kyoto et Nara',
    sub: 'Découvrez le Japon avec une femme musulmane qui vit ici. Elle organise la journée autour de vos prières, sait où manger halal et garde un rythme qui vous convient, à vous, à vos sœurs ou à votre famille.',
    wa: 'Écrire sur WhatsApp', mail: 'Écrire par e-mail',
    waTexto: 'Assalamu alaikum, je souhaite une guide musulmane au Japon.\nDates :\nVilles :\nGroupe (adultes / enfants) :\nLangue :',
    asunto: 'Guide musulmane au Japon',
    porqueH: 'Pourquoi une guide musulmane',
    porque: [
      'Les groupes de femmes et les mères avec leurs filles se sentent à l’aise dès la première minute.',
      'Elle connaît les mosquées et les lieux de prière calmes sur votre parcours, et l’heure de chaque prière.',
      'Elle lit les étiquettes et les menus en japonais : vous savez ce qui est halal ou non.',
      'Elle comprend la pudeur, les pauses et le voyage avec des enfants.',
      'Elle vit dans le Kansai : vous voyez la ville comme ses habitants.',
    ],
    idiomasH: 'Langues',
    idiomas: ['Arabe', 'Français', 'Indonésien', 'Malais (en indonésien)', 'Anglais', 'Japonais', 'Espagnol (avec Tony)'],
    equipo: 'Notre équipe : quatre guides musulmanes qui vivent à Osaka et Kyoto, avec Tony, guide musulman basé à Osaka.',
    incluyeH: 'Chaque visite comprend',
    incluye: [
      'Un itinéraire pensé autour des cinq prières, avec arrêts dans une mosquée ou une salle de prière.',
      'Des restaurants halal ou adaptés aux musulmans choisis à l’avance.',
      'Un rythme confortable avec des pauses ; poussettes et grands-parents bienvenus.',
      'Une option entre femmes : guide et groupe, uniquement des femmes.',
      'De l’aide pour les trains, la carte IC et les taxis toute la journée.',
    ],
    ciudadesH: 'Villes',
    ciudades: [
      ['Osaka', 'Le château d’Osaka, Dotonbori et le marché Kuromon, avec des arrêts pour prier en chemin.'],
      ['Kyoto', 'Fushimi Inari, Kiyomizu-dera, Arashiyama et Gion, avec des arrêts pour prier.'],
      ['Nara', 'Le parc aux daims et le Todai-ji, une demi-journée facile depuis Osaka ou Kyoto.'],
      ['Kobe', 'La mosquée de Kobe, la plus ancienne du Japon, le port et le bœuf de Kobe halal.'],
    ],
    pasosH: 'Comment réserver',
    pasos: [
      ['Écrivez-nous', 'Envoyez vos dates, villes, taille du groupe et langue par WhatsApp ou e-mail.'],
      ['Guide et devis', 'Nous confirmons quelle guide est disponible et envoyons un prix clair pour votre groupe.'],
      ['Profitez du Japon', 'Votre guide vous retrouve à l’hôtel ou à la gare, la journée déjà organisée.'],
    ],
    faqH: 'Questions',
    faq: [
      ['Puis-je réserver une guide musulmane au Japon ?', 'Oui. Nous travaillons avec quatre guides musulmanes qui vivent à Osaka et Kyoto. Donnez-nous vos dates et nous confirmons laquelle est disponible.'],
      ['Quelles langues parlent-elles ?', 'Arabe, français, indonésien, anglais et japonais. Les voyageurs de Malaisie sont accueillis en indonésien, et Tony ajoute l’espagnol.'],
      ['Le groupe peut-il être uniquement féminin ?', 'Oui. C’est le but de ce service : des visites entre femmes avec une guide femme. Les familles et les couples sont aussi les bienvenus.'],
      ['Comment gérez-vous les heures de prière ?', 'L’itinéraire est construit autour des cinq prières, avec des arrêts dans des mosquées comme celles d’Osaka Ibaraki et de Kobe, ou dans des salles de prière.'],
      ['La nourriture est-elle halal ?', 'Nous réservons à l’avance des restaurants certifiés halal ou adaptés aux musulmans, et la guide vérifie les ingrédients comme le mirin ou le saké dans les sauces.'],
      ['Devons-nous participer à quelque chose dans les temples ?', 'Non. Dans les temples et sanctuaires, la guide explique seulement l’histoire et la culture. Personne n’est invité à un rite.'],
      ['Combien ça coûte et quand réserver ?', 'Nous envoyons un devis pour votre groupe avant la réservation. Les guides sont indépendantes : l’idéal est de réserver 1 à 2 semaines avant.'],
    ],
    compartirH: 'Vous voyagez entre amies ?',
    compartir: 'Partagez cette page avec vos sœurs, votre famille ou votre groupe de voyage.',
    copiar: 'Copier le lien', copiado: 'Lien copié', waCompartir: 'Partager sur WhatsApp',
    waShare: 'Guides musulmanes au Japon (Osaka, Kyoto, Nara) :',
    credito: 'Photo : mosquée de Kobe, Zairon, CC BY-SA 4.0',
    pie: 'Tony Kansai Guide · Osaka, Japon',
    inicio: 'Accueil',
  },
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const waLink = (texto) => `https://wa.me/${WA}?text=${encodeURIComponent(texto)}`
// Idiomas que hablan entre todos (código ISO) para availableLanguage del Service.
const LENGUAS = ['ar', 'id', 'ms', 'en', 'fr', 'ja', 'es']

function jsonLd(lang, t) {
  const url = BASE + RUTAS[lang]
  const ciudad = (n) => ({ '@type': 'City', name: n, containedInPlace: { '@type': 'Country', name: 'Japan' } })
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': url + '#pagina', url, name: t.title, description: t.desc, inLanguage: lang, dateModified: MODIFICADO, isPartOf: { '@id': BASE + '/#sitio' }, about: { '@id': url + '#servicio' }, primaryImageOfPage: BASE + '/tr/foto/kobe-camii-1920.webp' },
      {
        '@type': 'Service', '@id': url + '#servicio', name: t.h1, description: t.desc, serviceType: 'Private tour guide',
        provider: { '@id': BASE + '/#negocio' },
        areaServed: ['Osaka', 'Kyoto', 'Nara', 'Kobe'].map(ciudad),
        availableLanguage: LENGUAS,
        audience: { '@type': 'Audience', audienceType: 'Muslim women, women-only groups and Muslim families' },
        termsOfService: 'Price quoted per group before booking',
        availableChannel: { '@type': 'ServiceChannel', serviceUrl: url, servicePhone: '+34634193106', availableLanguage: LENGUAS },
      },
      { '@type': 'FAQPage', '@id': url + '#faq', inLanguage: lang, mainEntity: t.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: t.inicio, item: BASE + INICIO[lang] },
        { '@type': 'ListItem', position: 2, name: t.h1, item: url },
      ] },
    ],
  }
}

function pagina(lang) {
  const t = T[lang]
  const rtl = lang === 'ar'
  const url = BASE + RUTAS[lang]
  const alternos = Object.entries(RUTAS).map(([l, r]) => `<link rel="alternate" hreflang="${l}" href="${BASE + r}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${BASE + RUTAS.en}">`
  const idiomas = Object.entries(RUTAS).map(([l, r]) => l === lang ? `<b>${NOMBRE_IDIOMA[l]}</b>` : `<a href="${r}" hreflang="${l}" lang="${l}">${NOMBRE_IDIOMA[l]}</a>`).join('<span aria-hidden="true">·</span>')
  const mailto = `mailto:${MAIL}?subject=${encodeURIComponent(t.asunto)}&body=${encodeURIComponent(t.waTexto)}`
  return `<!doctype html>
<html lang="${lang}"${rtl ? ' dir="rtl"' : ''} data-estatica="guias-musulmanas">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}">
${alternos}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Tony Kansai Guide">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(t.h1)}">
<meta property="og:description" content="${esc(t.desc)}">
<meta property="og:image" content="${BASE}/tr/foto/kobe-camii-1920.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#123f3a">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(jsonLd(lang, t))}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Source+Sans+3:wght@400;600;700&family=Tajawal:wght@400;500;800&display=swap">
<style>
:root{--fg:#1d2422;--suave:#56605d;--fondo:#f6f1e8;--verde:#123f3a;--bermellon:#c4472f;--linea:#e2d9c8}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--fondo);color:var(--fg);font:18px/1.7 'Source Sans 3',system-ui,sans-serif;overflow-wrap:break-word}
[dir=rtl] body{font-family:Tajawal,system-ui,sans-serif}
h1,h2,h3{font-family:Fraunces,Georgia,serif;font-weight:700;line-height:1.15;letter-spacing:-.01em}
[dir=rtl] h1,[dir=rtl] h2,[dir=rtl] h3{font-family:Tajawal,system-ui,sans-serif;font-weight:800;letter-spacing:0}
a{color:var(--verde)}
.kap{max-width:1040px;margin:0 auto;padding:0 20px}
header{position:absolute;inset:0 0 auto;z-index:2}
header .kap{display:flex;justify-content:space-between;align-items:center;gap:12px;padding-block:16px;flex-wrap:wrap}
header a,header b{color:#fff;text-decoration:none;font-weight:700}
.idiomas{display:flex;flex-wrap:wrap;gap:8px;font-size:15px;color:rgba(255,255,255,.75)}.idiomas a{font-weight:600;color:rgba(255,255,255,.85)}
.heroe{position:relative;min-height:min(88vh,860px);display:flex;align-items:flex-end;color:#fff;background:#0c2724;overflow:hidden}
.heroe img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55}
.heroe::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(12,39,36,.35),rgba(12,39,36,.92))}
.heroe .kap{position:relative;z-index:1;padding-block:150px 72px;width:100%}
.kicker{display:inline-block;font-size:14px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#f3c9a8}
[dir=rtl] .kicker{letter-spacing:0}
.heroe h1{font-size:clamp(34px,6.2vw,66px);margin:12px 0 18px;max-width:15em}
.heroe p{font-size:clamp(18px,2.2vw,22px);max-width:36em;color:rgba(255,255,255,.92);margin:0 0 30px}
.btns{display:flex;gap:12px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:0 24px;border-radius:999px;font-weight:700;text-decoration:none;border:2px solid transparent;font-size:17px;cursor:pointer;font-family:inherit;text-align:center}
.btn.wa{background:var(--bermellon);color:#fff}.btn.wa:hover{background:#a93a25}
.btn.borde{border-color:currentColor;color:inherit;background:transparent}
.heroe .btn.borde{color:#fff}
.credito{position:absolute;z-index:1;inset-inline-end:12px;bottom:8px;font-size:12px;color:rgba(255,255,255,.65)}
.bloque{padding-block:64px 8px}
.bloque h2{font-size:clamp(28px,3.6vw,40px);margin:0 0 22px;color:var(--verde)}
.dos{display:grid;grid-template-columns:1fr 1fr;gap:56px}
ul.lista{list-style:none;margin:0;padding:0}
ul.lista li{position:relative;padding-inline-start:30px;margin-bottom:14px}
ul.lista li::before{content:"";position:absolute;inset-inline-start:0;top:.8em;width:12px;height:2px;background:var(--bermellon)}
.chips{display:flex;flex-wrap:wrap;gap:10px;margin:0 0 18px;padding:0;list-style:none}
.chips li{border:1.5px solid var(--verde);border-radius:999px;padding:6px 16px;font-weight:600;font-size:16px;color:var(--verde);background:#fff}
.equipo{color:var(--suave);margin:0}
.ciudades{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.ciudades div{border-top:2px solid var(--verde);padding-top:14px}
.ciudades h3{margin:0 0 6px;font-size:22px;color:var(--verde)}
.ciudades p{margin:0;color:var(--suave);font-size:16px}
ol.pasos{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:28px;counter-reset:paso}
ol.pasos li{counter-increment:paso;border-top:2px solid var(--verde);padding-top:16px}
ol.pasos li::before{content:counter(paso,decimal-leading-zero);display:block;font-family:Fraunces,Georgia,serif;font-size:34px;color:var(--bermellon);line-height:1;margin-bottom:10px}
ol.pasos b{display:block;font-size:19px;margin-bottom:4px}
ol.pasos p{margin:0;color:var(--suave)}
.faq details{border-bottom:1px solid var(--linea);padding:16px 0}
.faq summary{cursor:pointer;font-weight:700;font-size:19px;list-style:none;display:flex;justify-content:space-between;gap:16px}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";color:var(--bermellon);font-size:24px;line-height:1}
.faq details[open] summary::after{content:"−"}
.faq p{margin:10px 0 0;color:var(--suave)}
.final{margin-top:72px;background:var(--verde);color:#fff;padding-block:64px}
.final h2{color:#fff}.final p{color:rgba(255,255,255,.88);max-width:34em}
.final .btn.borde{color:#fff}
footer{padding-block:28px;font-size:15px;color:var(--suave)}
footer a{color:var(--suave)}
.rev{opacity:0;transform:translateY(18px);transition:opacity .7s ease,transform .7s ease}.rev.vis{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.rev{opacity:1;transform:none;transition:none}}
@media (max-width:900px){.ciudades{grid-template-columns:1fr 1fr}}
@media (max-width:760px){body{font-size:17px}.dos{grid-template-columns:1fr;gap:8px}ol.pasos,.ciudades{grid-template-columns:1fr}.btn{width:100%}.heroe .kap{padding-block:130px 56px}.bloque{padding-block:48px 0}header .kap{flex-direction:column;align-items:flex-start}}
</style>
</head>
<body>
<header><div class="kap"><a href="${INICIO[lang]}">Tony Kansai Guide</a><nav class="idiomas" aria-label="Language">${idiomas}</nav></div></header>
<main>
<section class="heroe">
  <img src="/tr/foto/kobe-camii-1920.webp" srcset="/tr/foto/kobe-camii-1080.webp 1080w, /tr/foto/kobe-camii-1920.webp 1920w, /tr/foto/kobe-camii-3840.webp 3840w" sizes="100vw" alt="" fetchpriority="high">
  <div class="kap">
    <span class="kicker">${t.kicker}</span>
    <h1>${t.h1}</h1>
    <p>${t.sub}</p>
    <div class="btns">
      <a class="btn wa" href="${waLink(t.waTexto)}" target="_blank" rel="noopener">${t.wa}</a>
      <a class="btn borde" href="${esc(mailto)}">${t.mail}</a>
    </div>
  </div>
  <a class="credito" href="https://commons.wikimedia.org/wiki/File:Kobe_Kobe-Moschee_Innen_Gebetsraum_2.jpg" rel="noopener" target="_blank">${t.credito}</a>
</section>
<section class="kap bloque dos">
  <div class="rev"><h2>${t.porqueH}</h2><ul class="lista">${t.porque.map((x) => `<li>${x}</li>`).join('')}</ul></div>
  <div class="rev"><h2>${t.idiomasH}</h2><ul class="chips">${t.idiomas.map((x) => `<li>${x}</li>`).join('')}</ul><p class="equipo">${t.equipo}</p></div>
</section>
<section class="kap bloque rev">
  <h2>${t.incluyeH}</h2>
  <ul class="lista">${t.incluye.map((x) => `<li>${x}</li>`).join('')}</ul>
</section>
<section class="kap bloque rev">
  <h2>${t.ciudadesH}</h2>
  <div class="ciudades">${t.ciudades.map(([c, d]) => `<div><h3>${c}</h3><p>${d}</p></div>`).join('')}</div>
</section>
<section class="kap bloque rev">
  <h2>${t.pasosH}</h2>
  <ol class="pasos">${t.pasos.map(([a, b]) => `<li><b>${a}</b><p>${b}</p></li>`).join('')}</ol>
  <div class="btns" style="margin-top:28px"><a class="btn wa" href="${waLink(t.waTexto)}" target="_blank" rel="noopener">${t.wa}</a></div>
</section>
<section class="kap bloque faq">
  <h2>${t.faqH}</h2>
  ${t.faq.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${q}</summary><p>${a}</p></details>`).join('\n  ')}
</section>
<section class="final">
  <div class="kap rev">
    <h2>${t.compartirH}</h2>
    <p>${t.compartir}</p>
    <div class="btns">
      <a class="btn wa" href="https://wa.me/?text=${encodeURIComponent(t.waShare + ' ' + url)}" target="_blank" rel="noopener">${t.waCompartir}</a>
      <button class="btn borde" type="button" id="copiar" data-ok="${esc(t.copiado)}">${t.copiar}</button>
    </div>
  </div>
</section>
</main>
<footer><div class="kap">${t.pie} · <a href="mailto:${MAIL}">${MAIL}</a></div></footer>
<script>
document.getElementById('copiar').addEventListener('click',function(e){var b=e.currentTarget;navigator.clipboard&&navigator.clipboard.writeText(${JSON.stringify(url)}).then(function(){b.textContent=b.dataset.ok})});
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('vis');io.unobserve(x.target)}})},{threshold:.15});document.querySelectorAll('.rev').forEach(function(el){io.observe(el)})}else{document.querySelectorAll('.rev').forEach(function(el){el.classList.add('vis')})}
</script>
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
