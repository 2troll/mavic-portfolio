// Estudio «qué buscan los viajeros musulmanes en Japón» (26-11-2026) para las páginas de
// guías musulmanas (scripts/guias-musulmanas.mjs). Solo hechos con fuente:
// - GMTI 2026 (Mastercard-CrescentRating): Japón 7.º entre destinos no OCI, 53/100; pilar
//   más bajo «Communication» 31/100, el más alto «Environment» 73/100.
//   https://crescentrating.com/insights/gmti/destinations/japan
// - KIX: salas de oración y abluciones separadas por sexo, T1 3.ª planta y zona de embarque.
//   https://www.kansai-airport.or.jp/en/service/other/prayer-room
// - Kioto: sala de oración en el Kansai Tourist Information Center, junto a la estación.
//   https://kyoto.travel/en/muslim/prayer.html
// Regla de Tony: TODO contacto llega primero a él; él asigna la guía. Nunca nombres ni teléfonos de guías.
export const E = {
  en: {
    viaH: 'You talk to Tony first',
    via: 'Every request comes to Tony, the founder, on WhatsApp or by email. He reads what you need (dates, cities, women only or family, language), checks which guide is free and introduces her to you with a clear price. One contact and one person responsible for your day, before and during the trip.',
    estudioH: 'What Muslim travellers look for in Japan',
    estudio: 'Japan is now 7th among non-Muslim-majority destinations in the Global Muslim Travel Index 2026, but its weakest score is communication (31 out of 100). Clean, safe streets are not the problem; finding halal food, a place to pray and someone who explains things in your language is. This is what our guests ask for most, and how we handle it.',
    neces: [
      ['Prayer on time', 'Japan has few mosques, and Kyoto is full of temples, so the day is planned around Dhuhr, Asr and Maghrib: mosques in Osaka, Kobe and Kyoto, the prayer room next to Kyoto Station, or a quiet clean corner. Your guide carries the prayer times and the qibla.'],
      ['Halal food you can trust', 'Many Japanese dishes hide pork, lard, alcohol or mirin. We choose halal-certified or Muslim-friendly restaurants before the day, and the guide reads labels and asks the kitchen in Japanese.'],
      ['A woman beside you', 'Many sisters prefer a woman guide all day: for photos, shopping, questions about prayer or modesty, and simply for privacy. On women-only tours the guide and the group are all women.'],
      ['Wudu and clean toilets', 'Japanese toilets are clean and many have a bidet function. The guide knows quiet ones near each stop where you can make wudu.'],
      ['Modesty in onsen and kimono', 'Public baths in Japan are shared and without clothes, so we suggest private baths (kashikiri) or skip them. Ask us for kimono rental that works with hijab.'],
      ['Ramadan and Jumu\'ah', 'In Ramadan we plan shorter days and iftar close to a mosque. On a Friday, tell us and the route reaches a mosque for Jumu\'ah.'],
      ['A pace for the whole family', 'Rest stops, lifts, prams and taxis between sites, so grandparents and children enjoy the day too.'],
      ['Respect at temples and shrines', 'The guide explains history and culture only. You are never asked to take part in any ritual.'],
    ],
    airport: 'Landing at Kansai Airport? There are prayer rooms with separate areas for men and women in Terminal 1 (3rd floor and the international gate area).',
    faqExtra: [
      ['Do I contact the guide directly?', 'No. You write to Tony first on WhatsApp or by email. He matches you with the right guide, confirms the day and stays your contact before and during the trip.'],
      ['Is there a Muslim male guide too?', 'Yes. Tony, the founder, is a Muslim guide in Kansai who speaks Arabic, Spanish and English. In Tokyo, Iheb, a Tunisian Muslim guide, guides in Arabic, French and English. Families can book a woman guide and a male guide together.'],
      ['Can you plan a tour during Ramadan?', 'Yes. Shorter days, rest in the afternoon, and iftar at a halal restaurant close to a mosque.'],
      ['Can we pray Jumu\'ah on a Friday?', 'Yes. Tell us when you book and the route includes Friday prayer at a mosque, for example Kobe Mosque or Osaka Ibaraki Mosque.'],
    ],
  },
  ar: {
    viaH: 'تتواصلون مع طوني أولاً',
    via: 'كل طلب يصل أولاً إلى طوني، مؤسس الفريق، عبر واتساب أو البريد الإلكتروني. يقرأ ما تحتاجون إليه (التواريخ، المدن، جولة للنساء فقط أو للعائلة، اللغة)، ويتأكد من المرشدة المتاحة، ثم يعرّفكم بها مع سعر واضح. جهة اتصال واحدة وشخص واحد مسؤول عن يومكم، قبل الرحلة وأثناءها.',
    estudioH: 'ما الذي يبحث عنه المسافر المسلم في اليابان',
    estudio: 'تحتل اليابان اليوم المرتبة السابعة بين الوجهات غير الإسلامية في مؤشر السفر الإسلامي العالمي (GMTI) لعام 2026، لكن أضعف نقاطها هي التواصل (31 من 100). المشكلة ليست في النظافة أو الأمان، بل في إيجاد طعام حلال ومكان للصلاة وشخص يشرح لكم بلغتكم. هذا ما يطلبه ضيوفنا أكثر من غيره، وهكذا نتعامل معه.',
    neces: [
      ['الصلاة في وقتها', 'المساجد في اليابان قليلة، وكيوتو مليئة بالمعابد، لذلك نخطط اليوم حول صلوات الظهر والعصر والمغرب: مساجد في أوساكا وكوبي وكيوتو، أو مصلى بجوار محطة كيوتو، أو ركن هادئ ونظيف. تحمل المرشدة مواقيت الصلاة واتجاه القبلة.'],
      ['طعام حلال موثوق', 'كثير من الأطباق اليابانية تحتوي على لحم الخنزير أو شحمه أو الكحول أو الميرين. نختار مطاعم حلال معتمدة أو صديقة للمسلمين قبل يوم الجولة، وتقرأ المرشدة المكونات وتسأل المطبخ باليابانية.'],
      ['امرأة إلى جانبكِ', 'تفضّل كثير من الأخوات مرشدة امرأة طوال اليوم: للصور والتسوق والأسئلة عن الصلاة أو الحشمة، وببساطة من أجل الخصوصية. في جولات النساء فقط تكون المرشدة والمجموعة كلهن نساء.'],
      ['الوضوء ودورات مياه نظيفة', 'دورات المياه في اليابان نظيفة وكثير منها مزوّد بالشطاف. تعرف المرشدة أماكن هادئة قرب كل محطة يمكنكم الوضوء فيها.'],
      ['الحشمة في الأونسن والكيمونو', 'الحمامات العامة في اليابان مشتركة وبلا ملابس، لذلك نقترح حمامات خاصة (كاشيكيري) أو تجاوزها. اسألونا عن تأجير كيمونو يناسب الحجاب.'],
      ['رمضان وصلاة الجمعة', 'في رمضان نخطط أياماً أقصر وإفطاراً قريباً من مسجد. وإن كان اليوم جمعة فأخبرونا ويمرّ المسار بمسجد لصلاة الجمعة.'],
      ['وتيرة تناسب العائلة كلها', 'استراحات ومصاعد وعربات أطفال وسيارات أجرة بين الأماكن، ليستمتع الأجداد والأطفال باليوم أيضاً.'],
      ['احترام عند المعابد والأضرحة', 'تشرح المرشدة التاريخ والثقافة فقط، ولا يُطلب منكم أبداً المشاركة في أي طقس.'],
    ],
    airport: 'هل تصلون إلى مطار كانساي؟ توجد مصليات بأماكن منفصلة للرجال والنساء في المبنى رقم 1 (الطابق الثالث ومنطقة البوابات الدولية).',
    faqExtra: [
      ['هل أتواصل مع المرشدة مباشرة؟', 'لا. تكتبون أولاً إلى طوني عبر واتساب أو البريد الإلكتروني. يختار لكم المرشدة المناسبة ويؤكد اليوم ويبقى جهة اتصالكم قبل الرحلة وأثناءها.'],
      ['هل يوجد مرشد مسلم رجل أيضاً؟', 'نعم. طوني، مؤسس الفريق، مرشد مسلم في كانساي يتحدث العربية والإسبانية والإنجليزية. وفي طوكيو يرشد إيهاب، وهو مرشد مسلم تونسي، بالعربية والفرنسية والإنجليزية. ويمكن للعائلات حجز مرشدة ومرشد معاً.'],
      ['هل يمكنكم تنظيم جولة في رمضان؟', 'نعم. أيام أقصر، وراحة بعد الظهر، وإفطار في مطعم حلال قريب من مسجد.'],
      ['هل يمكننا أداء صلاة الجمعة؟', 'نعم. أخبرونا عند الحجز ويشمل المسار صلاة الجمعة في مسجد، مثل مسجد كوبي أو مسجد إيباراكي في أوساكا.'],
    ],
  },
  id: {
    viaH: 'Anda menghubungi Tony lebih dulu',
    via: 'Setiap permintaan masuk lebih dulu ke Tony, pendiri tim, lewat WhatsApp atau email. Ia membaca kebutuhan Anda (tanggal, kota, khusus wanita atau keluarga, bahasa), mengecek pemandu yang tersedia, lalu memperkenalkannya kepada Anda dengan harga yang jelas. Satu kontak dan satu orang yang bertanggung jawab atas hari Anda, sebelum dan selama perjalanan.',
    estudioH: 'Apa yang dicari wisatawan muslim di Jepang',
    estudio: 'Jepang kini berada di peringkat ke-7 di antara destinasi non-OKI dalam Global Muslim Travel Index (GMTI) 2026, tetapi nilai terendahnya adalah komunikasi (31 dari 100). Masalahnya bukan kebersihan atau keamanan, melainkan mencari makanan halal, tempat salat, dan orang yang menjelaskan dalam bahasa Anda. Inilah yang paling sering diminta tamu kami, dan cara kami menanganinya.',
    neces: [
      ['Salat tepat waktu', 'Masjid di Jepang sedikit, dan Kyoto penuh kuil, jadi hari Anda direncanakan mengikuti waktu Zuhur, Asar, dan Magrib: masjid di Osaka, Kobe, dan Kyoto, musala di dekat Stasiun Kyoto, atau sudut yang tenang dan bersih. Pemandu membawa jadwal salat dan arah kiblat.'],
      ['Makanan halal yang terpercaya', 'Banyak masakan Jepang mengandung babi, lemak babi, alkohol, atau mirin. Kami memilih restoran bersertifikat halal atau ramah muslim sebelum hari tur, dan pemandu membaca label serta bertanya ke dapur dalam bahasa Jepang.'],
      ['Ditemani sesama wanita', 'Banyak muslimah lebih nyaman dengan pemandu wanita sepanjang hari: untuk foto, belanja, pertanyaan tentang salat atau aurat, dan demi privasi. Pada tur khusus wanita, pemandu dan rombongan semuanya wanita.'],
      ['Wudu dan toilet bersih', 'Toilet di Jepang bersih dan banyak yang punya fungsi bidet. Pemandu tahu toilet yang tenang di dekat setiap tempat untuk berwudu.'],
      ['Menjaga aurat di onsen dan kimono', 'Pemandian umum di Jepang dipakai bersama tanpa busana, jadi kami sarankan pemandian pribadi (kashikiri) atau melewatinya. Tanyakan kepada kami sewa kimono yang cocok dengan hijab.'],
      ['Ramadan dan salat Jumat', 'Saat Ramadan kami merencanakan hari yang lebih singkat dan berbuka dekat masjid. Pada hari Jumat, beri tahu kami dan rute akan melewati masjid untuk salat Jumat.'],
      ['Ritme untuk seluruh keluarga', 'Waktu istirahat, lift, kereta bayi, dan taksi antar tempat, agar kakek-nenek dan anak-anak juga menikmati harinya.'],
      ['Menghormati kuil dan tempat ibadah', 'Pemandu hanya menjelaskan sejarah dan budaya. Anda tidak pernah diminta ikut ritual apa pun.'],
    ],
    airport: 'Mendarat di Bandara Kansai? Ada musala dengan ruang terpisah untuk pria dan wanita di Terminal 1 (lantai 3 dan area gerbang internasional).',
    faqExtra: [
      ['Apakah saya menghubungi pemandu langsung?', 'Tidak. Anda menulis lebih dulu kepada Tony lewat WhatsApp atau email. Ia memilihkan pemandu yang tepat, mengonfirmasi tanggal, dan tetap menjadi kontak Anda sebelum dan selama perjalanan.'],
      ['Apakah ada pemandu muslim pria juga?', 'Ada. Tony, pendiri tim, adalah pemandu muslim di Kansai yang berbahasa Arab, Spanyol, dan Inggris. Di Tokyo, Iheb, pemandu muslim asal Tunisia, memandu dalam bahasa Arab, Prancis, dan Inggris. Keluarga bisa memesan pemandu wanita dan pemandu pria sekaligus.'],
      ['Bisakah Anda menyusun tur saat Ramadan?', 'Bisa. Hari yang lebih singkat, istirahat di siang hari, dan berbuka di restoran halal dekat masjid.'],
      ['Bisakah kami salat Jumat?', 'Bisa. Beri tahu kami saat memesan dan rute akan mencakup salat Jumat di masjid, misalnya Masjid Kobe atau Masjid Ibaraki Osaka.'],
    ],
  },
  ms: {
    viaH: 'Anda berhubung dengan Tony dahulu',
    via: 'Setiap permintaan sampai kepada Tony, pengasas pasukan, dahulu melalui WhatsApp atau e-mel. Beliau membaca keperluan anda (tarikh, bandar, khas wanita atau keluarga, bahasa), menyemak pemandu yang lapang, lalu memperkenalkannya kepada anda dengan harga yang jelas. Satu kenalan dan satu orang yang bertanggungjawab atas hari anda, sebelum dan semasa perjalanan.',
    estudioH: 'Apa yang dicari pelancong Muslim di Jepun',
    estudio: 'Jepun kini di tempat ke-7 antara destinasi bukan OIC dalam Global Muslim Travel Index (GMTI) 2026, tetapi markah terendahnya ialah komunikasi (31 daripada 100). Masalahnya bukan kebersihan atau keselamatan, tetapi mencari makanan halal, tempat solat dan seseorang yang menerangkan dalam bahasa anda. Inilah yang paling kerap diminta tetamu kami, dan cara kami menguruskannya.',
    neces: [
      ['Solat tepat pada waktunya', 'Masjid di Jepun tidak banyak, dan Kyoto penuh dengan kuil, jadi hari anda dirancang mengikut waktu Zohor, Asar dan Maghrib: masjid di Osaka, Kobe dan Kyoto, surau berhampiran Stesen Kyoto, atau sudut yang tenang dan bersih. Pemandu membawa waktu solat dan arah kiblat.'],
      ['Makanan halal yang boleh dipercayai', 'Banyak hidangan Jepun mengandungi babi, lemak babi, alkohol atau mirin. Kami memilih restoran yang diperakui halal atau mesra Muslim sebelum hari lawatan, dan pemandu membaca label serta bertanya kepada dapur dalam bahasa Jepun.'],
      ['Ditemani wanita', 'Ramai muslimah lebih selesa dengan pemandu wanita sepanjang hari: untuk bergambar, membeli-belah, soalan tentang solat atau aurat, dan demi privasi. Dalam lawatan khas wanita, pemandu dan kumpulan semuanya wanita.'],
      ['Wuduk dan tandas yang bersih', 'Tandas di Jepun bersih dan banyak yang mempunyai fungsi bidet. Pemandu tahu tandas yang tenang berhampiran setiap tempat untuk mengambil wuduk.'],
      ['Menjaga aurat di onsen dan kimono', 'Tempat mandi awam di Jepun dikongsi tanpa pakaian, jadi kami cadangkan bilik mandi persendirian (kashikiri) atau tidak pergi. Tanya kami tentang sewaan kimono yang sesuai dengan tudung.'],
      ['Ramadan dan solat Jumaat', 'Pada bulan Ramadan kami merancang hari yang lebih pendek dan berbuka puasa berhampiran masjid. Pada hari Jumaat, beritahu kami dan laluan akan singgah di masjid untuk solat Jumaat.'],
      ['Rentak untuk seluruh keluarga', 'Waktu rehat, lif, kereta sorong bayi dan teksi antara tempat, supaya datuk nenek dan anak-anak turut menikmati hari itu.'],
      ['Menghormati kuil dan tokong', 'Pemandu hanya menerangkan sejarah dan budaya. Anda tidak sekali-kali diminta menyertai sebarang upacara.'],
    ],
    airport: 'Mendarat di Lapangan Terbang Kansai? Ada surau dengan ruang berasingan untuk lelaki dan wanita di Terminal 1 (tingkat 3 dan kawasan pintu berlepas antarabangsa).',
    faqExtra: [
      ['Adakah saya menghubungi pemandu secara terus?', 'Tidak. Anda menulis kepada Tony dahulu melalui WhatsApp atau e-mel. Beliau memilih pemandu yang sesuai, mengesahkan tarikh dan kekal sebagai kenalan anda sebelum dan semasa perjalanan.'],
      ['Adakah pemandu Muslim lelaki juga?', 'Ada. Tony, pengasas pasukan, ialah pemandu Muslim di Kansai yang bertutur dalam bahasa Arab, Sepanyol dan Inggeris. Di Tokyo, Iheb, pemandu Muslim dari Tunisia, memandu dalam bahasa Arab, Perancis dan Inggeris. Keluarga boleh menempah pemandu wanita dan pemandu lelaki bersama.'],
      ['Bolehkah anda merancang lawatan pada bulan Ramadan?', 'Boleh. Hari yang lebih pendek, rehat pada waktu petang, dan berbuka puasa di restoran halal berhampiran masjid.'],
      ['Bolehkah kami menunaikan solat Jumaat?', 'Boleh. Beritahu kami semasa menempah dan laluan akan termasuk solat Jumaat di masjid, contohnya Masjid Kobe atau Masjid Ibaraki Osaka.'],
    ],
  },
  es: {
    viaH: 'Primero hablas con Tony',
    via: 'Toda petición llega primero a Tony, el fundador, por WhatsApp o por correo. Lee lo que necesitas (fechas, ciudades, solo mujeres o en familia, idioma), mira qué guía está libre y te la presenta con un precio claro. Un solo contacto y una persona responsable de tu día, antes y durante el viaje.',
    estudioH: 'Qué buscan los viajeros musulmanes en Japón',
    estudio: 'Japón es ya el 7.º destino de mayoría no musulmana en el Global Muslim Travel Index (GMTI) 2026, pero su nota más baja es la comunicación (31 de 100). El problema no es la limpieza ni la seguridad, sino encontrar comida halal, un sitio para rezar y alguien que te lo explique en tu idioma. Esto es lo que más nos piden y cómo lo resolvemos.',
    neces: [
      ['Rezar a su hora', 'En Japón hay pocas mezquitas, y Kioto está llena de templos, así que el día se organiza alrededor del dhuhr, el asr y el maghrib: mezquitas en Osaka, Kobe y Kioto, la sala de oración junto a la estación de Kioto o un rincón tranquilo y limpio. La guía lleva los horarios de oración y la qibla.'],
      ['Comida halal de confianza', 'Muchos platos japoneses esconden cerdo, manteca, alcohol o mirin. Elegimos restaurantes con certificado halal o aptos para musulmanes antes del día, y la guía lee las etiquetas y pregunta en cocina en japonés.'],
      ['Una mujer a tu lado', 'Muchas hermanas prefieren una guía mujer todo el día: para las fotos, las compras, las dudas sobre la oración o el recato, y por intimidad. En los tours solo para mujeres, guía y grupo son todas mujeres.'],
      ['Wudu y baños limpios', 'Los baños en Japón están limpios y muchos tienen bidé. La guía conoce baños tranquilos cerca de cada parada para hacer el wudu.'],
      ['Recato en onsen y kimono', 'Los baños públicos japoneses son compartidos y sin ropa, así que proponemos baños privados (kashikiri) o saltárnoslos. Pregúntanos por alquiler de kimono compatible con hiyab.'],
      ['Ramadán y oración del viernes', 'En Ramadán planificamos días más cortos y el iftar cerca de una mezquita. Si es viernes, dínoslo y la ruta pasa por una mezquita para el yumu\'a.'],
      ['Un ritmo para toda la familia', 'Paradas para descansar, ascensores, carritos y taxis entre sitios, para que abuelos y niños también disfruten.'],
      ['Respeto en templos y santuarios', 'La guía solo explica historia y cultura. Nunca se os pide participar en ningún ritual.'],
    ],
    airport: '¿Llegas al aeropuerto de Kansai? Hay salas de oración con zonas separadas para hombres y mujeres en la Terminal 1 (3.ª planta y zona de puertas internacionales).',
    faqExtra: [
      ['¿Contacto directamente con la guía?', 'No. Escribes primero a Tony por WhatsApp o por correo. Él te asigna la guía adecuada, confirma el día y sigue siendo tu contacto antes y durante el viaje.'],
      ['¿Hay también guía musulmán hombre?', 'Sí. Tony, el fundador, es guía musulmán en Kansai y habla árabe, español e inglés. En Tokio, Iheb, guía musulmán tunecino, guía en árabe, francés e inglés. Las familias pueden reservar una guía y un guía a la vez.'],
      ['¿Podéis organizar un tour en Ramadán?', 'Sí. Días más cortos, descanso por la tarde e iftar en un restaurante halal cerca de una mezquita.'],
      ['¿Podemos rezar el yumu\'a un viernes?', 'Sí. Avísanos al reservar y la ruta incluye la oración del viernes en una mezquita, por ejemplo la mezquita de Kobe o la de Ibaraki en Osaka.'],
    ],
  },
  fr: {
    viaH: 'Vous parlez d\'abord à Tony',
    via: 'Chaque demande arrive d\'abord à Tony, le fondateur, sur WhatsApp ou par e-mail. Il lit ce dont vous avez besoin (dates, villes, entre femmes ou en famille, langue), vérifie quelle guide est disponible et vous la présente avec un prix clair. Un seul contact et une seule personne responsable de votre journée, avant et pendant le voyage.',
    estudioH: 'Ce que recherchent les voyageurs musulmans au Japon',
    estudio: 'Le Japon est désormais 7e parmi les destinations hors OCI du Global Muslim Travel Index (GMTI) 2026, mais sa note la plus faible est la communication (31 sur 100). Le problème n\'est ni la propreté ni la sécurité, mais de trouver une nourriture halal, un lieu pour prier et quelqu\'un qui explique dans votre langue. Voici ce que nos invités demandent le plus, et comment nous y répondons.',
    neces: [
      ['Prier à l\'heure', 'Les mosquées sont rares au Japon, et Kyoto est remplie de temples : la journée est donc organisée autour de Dhuhr, Asr et Maghrib, avec des mosquées à Osaka, Kobe et Kyoto, la salle de prière près de la gare de Kyoto ou un coin calme et propre. Votre guide a les horaires de prière et la qibla.'],
      ['Une nourriture halal fiable', 'Beaucoup de plats japonais cachent du porc, du saindoux, de l\'alcool ou du mirin. Nous choisissons à l\'avance des restaurants certifiés halal ou adaptés aux musulmans, et la guide lit les étiquettes et interroge la cuisine en japonais.'],
      ['Une femme à vos côtés', 'Beaucoup de sœurs préfèrent une guide femme toute la journée : pour les photos, le shopping, les questions sur la prière ou la pudeur, et tout simplement pour l\'intimité. Lors des visites entre femmes, la guide et le groupe sont toutes des femmes.'],
      ['Ablutions et toilettes propres', 'Les toilettes au Japon sont propres et beaucoup ont une fonction bidet. La guide connaît des toilettes calmes près de chaque étape pour faire vos ablutions.'],
      ['Pudeur à l\'onsen et en kimono', 'Les bains publics japonais sont partagés et sans vêtements : nous proposons des bains privés (kashikiri) ou de les éviter. Demandez-nous une location de kimono compatible avec le hijab.'],
      ['Ramadan et prière du vendredi', 'Pendant le Ramadan, nous prévoyons des journées plus courtes et l\'iftar près d\'une mosquée. Un vendredi, dites-le-nous et l\'itinéraire passe par une mosquée pour la Joumou\'a.'],
      ['Un rythme pour toute la famille', 'Des pauses, des ascenseurs, des poussettes et des taxis entre les sites, pour que les grands-parents et les enfants profitent aussi de la journée.'],
      ['Respect dans les temples et sanctuaires', 'La guide explique uniquement l\'histoire et la culture. On ne vous demande jamais de participer à un rituel.'],
    ],
    airport: 'Vous arrivez à l\'aéroport du Kansai ? Il y a des salles de prière avec des espaces séparés pour les hommes et les femmes dans le Terminal 1 (3e étage et zone des portes internationales).',
    faqExtra: [
      ['Est-ce que je contacte la guide directement ?', 'Non. Vous écrivez d\'abord à Tony sur WhatsApp ou par e-mail. Il vous attribue la bonne guide, confirme la journée et reste votre contact avant et pendant le voyage.'],
      ['Y a-t-il aussi un guide musulman homme ?', 'Oui. Tony, le fondateur, est un guide musulman au Kansai qui parle arabe, espagnol et anglais. À Tokyo, Iheb, guide musulman tunisien, guide en arabe, français et anglais. Les familles peuvent réserver une guide et un guide ensemble.'],
      ['Pouvez-vous organiser une visite pendant le Ramadan ?', 'Oui. Des journées plus courtes, du repos l\'après-midi et l\'iftar dans un restaurant halal près d\'une mosquée.'],
      ['Pouvons-nous faire la prière du vendredi ?', 'Oui. Dites-le-nous à la réservation et l\'itinéraire inclut la Joumou\'a dans une mosquée, par exemple la mosquée de Kobe ou la mosquée d\'Ibaraki à Osaka.'],
    ],
  },
}
