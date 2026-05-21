// ─────────────────────────────────────────────────────────────────────────────
// i18n.ts — Tony Hanma | Private Kansai Guide
// Languages: English · Spanish · Arabic · Czech · Russian
// ─────────────────────────────────────────────────────────────────────────────

export type Lang = 'en' | 'es' | 'ar' | 'cs' | 'ru';

export const LANG_META: Record<Lang, { label: string; flag: string; dir: 'ltr' | 'rtl' }> = {
  en: { label: 'EN', flag: '🇬🇧', dir: 'ltr' },
  es: { label: 'ES', flag: '🇪🇸', dir: 'ltr' },
  ar: { label: 'AR', flag: '🇸🇦', dir: 'rtl' },
  cs: { label: 'CS', flag: '🇨🇿', dir: 'ltr' },
  ru: { label: 'РУ', flag: '🇷🇺', dir: 'ltr' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Shape of one language's translations
// ─────────────────────────────────────────────────────────────────────────────

export interface Tr {
  nav: {
    home: string;
    tours: string;
    about: string;
    pricing: string;
    faq: string;
    booking: string;
  };

  hero: {
    badge: string;
    headline: string;
    sub: string;
    cta_wa: string;
    cta_tours: string;
  };

  stats: {
    destinations: string;
    languages: string;
    private: string;
  };

  discover: {
    label: string;
    heading: string;
    body: string;
    tag1: string;
    tag2: string;
    tag3: string;
    caption: string;
  };

  fortress: {
    label: string;
    heading: string;
    headingAccent: string;
    body: string;
    cta: string;
    caption: string;
  };

  tours_section: {
    label: string;
    heading: string;
    sub: string;
    view: string;
  };

  cta_section: {
    heading: string;
    sub: string;
    cta_wa: string;
    cta_pricing: string;
  };

  tours_page: {
    label: string;
    heading: string;
    sub: string;
  };

  about_page: {
    label: string;
    heading: string;
    sub: string;
    story_label: string;
    story_heading: string;
    private_guide: string;
    based: string;
    guiding: string;
    rating: string;
    speaks: string;
    cta_wa: string;
    cta_tours: string;
    cta_pricing: string;
    coverage_label: string;
  };

  pricing_page: {
    label: string;
    heading: string;
    sub: string;
    included_label: string;
    faq_link: string;
    reply_note: string;
  };

  faq_page: {
    label: string;
    heading: string;
    sub: string;
    still_q: string;
    still_sub: string;
    cta_wa: string;
    cta_pricing: string;
  };

  booking_page: {
    label: string;
    heading: string;
    sub: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    guests_label: string;
    notes_placeholder: string;
    per_group: string;
    duration: string;
    cta: string;
    note: string;
    today: string;
    prev_month: string;
    next_month: string;
    days: string[];
    months: string[];
    wa_msg: (tour: string, date: string, guests: number, notes: string) => string;
  };

  footer: {
    about: string;
    based: string;
    nav_label: string;
    contact_label: string;
    rights: string;
    replies: string;
    privacy: string;
  };

  cookie: {
    title: string;
    body: string;
    accept: string;
    decline: string;
    learn: string;
  };

  common: {
    book_now: string;
    book_wa: string;
    per_group: string;
    replies: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ENGLISH
// ─────────────────────────────────────────────────────────────────────────────

const en: Tr = {
  nav: {
    home: 'Home',
    tours: 'Tours',
    about: 'About',
    pricing: 'Pricing',
    faq: 'FAQ',
    booking: 'Book Now',
  },

  hero: {
    badge: 'Private Kansai Guide',
    headline: "Discover Japan's True Soul",
    sub: 'Intimate, private tours through Osaka, Kyoto, Nara, and beyond — guided by Tony Hanma, a passionate local who brings every hidden story to life.',
    cta_wa: 'Chat on WhatsApp',
    cta_tours: 'Explore Tours',
  },

  stats: {
    destinations: '7 Destinations',
    languages: '5 Languages',
    private: '100% Private',
  },

  discover: {
    label: 'Kansai Awaits',
    heading: 'Where Every Street Holds a Secret',
    body: 'Kansai is the beating heart of traditional Japan. From the lantern-lit alleys of Gion to the towering gates of Fushimi Inari, every corner whispers centuries of history. Let Tony guide you beyond the guidebooks.',
    tag1: 'Hidden Temples',
    tag2: 'Local Markets',
    tag3: 'Ancient History',
    caption: 'Fushimi Inari torii gates at dawn, Kyoto',
  },

  fortress: {
    label: 'Osaka Highlights',
    heading: 'Osaka Castle &',
    headingAccent: 'the City Below',
    body: "Osaka Castle isn't just a monument — it's a gateway into Japan's turbulent feudal era. Tony pairs the castle with the vibrant streets of Osaka, where modern takoyaki stalls meet 16th-century fortifications. A full-day adventure no guidebook can replicate.",
    cta: 'See Osaka Tour',
    caption: 'Osaka Castle with cherry blossoms, spring',
  },

  tours_section: {
    label: 'Handcrafted Itineraries',
    heading: 'Tours for Every Curiosity',
    sub: 'Each tour is private, paced at your speed, and led personally by Tony. No strangers, no rushed groups — just you, your travel companions, and the real Japan.',
    view: 'View Full Details',
  },

  cta_section: {
    heading: 'Ready to Experience Kansai?',
    sub: 'Send Tony a message on WhatsApp to check availability, ask questions, or book your private tour. He replies within a few hours.',
    cta_wa: 'Message Tony on WhatsApp',
    cta_pricing: 'See Pricing',
  },

  tours_page: {
    label: 'All Experiences',
    heading: 'Private Tours Across Kansai',
    sub: 'Seven destinations, seven stories. Every tour is private, fully guided, and tailored to move at your pace.',
  },

  about_page: {
    label: 'Your Guide',
    heading: 'Meet Tony Hanma',
    sub: 'Osaka-based guide, storyteller, and relentless enthusiast of everything Kansai.',
    story_label: 'The Story',
    story_heading: "A Local's Passion, Shared With the World",
    private_guide: 'Private Guide',
    based: 'Based in Osaka',
    guiding: '',
    rating: '5-Star Rated',
    speaks: 'Speaks 5 Languages',
    cta_wa: 'Message Tony',
    cta_tours: 'View Tours',
    cta_pricing: 'See Pricing',
    coverage_label: 'Coverage Area',
  },

  pricing_page: {
    label: 'Transparent Pricing',
    heading: 'Simple, Flat-Rate Pricing',
    sub: 'One price per group — no hidden fees, no per-person calculations. The entire day is yours.',
    included_label: "What's Included",
    faq_link: 'Read the FAQ',
    reply_note: 'Tony typically replies within a few hours via WhatsApp.',
  },

  faq_page: {
    label: 'Your Questions',
    heading: 'Frequently Asked Questions',
    sub: 'Everything you need to know before booking your private Kansai tour.',
    still_q: 'Still Have Questions?',
    still_sub: "Tony is happy to answer anything before you book. Reach out on WhatsApp — he'll reply within a few hours.",
    cta_wa: 'Ask Tony on WhatsApp',
    cta_pricing: 'View Pricing',
  },

  booking_page: {
    label: 'Secure Your Day',
    heading: 'Book Your Private Tour',
    sub: 'Choose your tour, pick a date, and send Tony your details via WhatsApp. He will confirm availability and get everything sorted.',
    step1: 'Choose a Tour',
    step2: 'Pick a Date',
    step3: 'Select Guests',
    step4: 'Send via WhatsApp',
    guests_label: 'Number of Guests',
    notes_placeholder: 'Any special requests, accessibility needs, or questions for Tony…',
    per_group: 'per group',
    duration: 'Full day',
    cta: 'Send Booking Request on WhatsApp',
    note: 'Tony will confirm your booking manually. No payment is taken online.',
    today: 'Today',
    prev_month: 'Previous month',
    next_month: 'Next month',
    days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
    wa_msg: (tour, date, guests, notes) =>
      `Hello Tony! I'd like to book a private tour.\n\n` +
      `Tour: ${tour}\n` +
      `Date: ${date}\n` +
      `Guests: ${guests}\n` +
      (notes ? `Notes: ${notes}\n` : '') +
      `\nPlease let me know if this date is available. Thank you!`,
  },

  footer: {
    about: 'Private guided tours through the heart of Kansai — Osaka, Kyoto, Nara, and beyond.',
    based: 'Based in Osaka, Japan',
    nav_label: 'Navigation',
    contact_label: 'Get in Touch',
    rights: 'All rights reserved.',
    replies: 'Replies within a few hours',
    privacy: 'Privacy Policy',
  },

  cookie: {
    title: 'We use cookies',
    body: 'We use Google Analytics to understand how visitors use this site. No personal data is sold or shared with third parties.',
    accept: 'Accept',
    decline: 'Decline',
    learn: 'Privacy Policy',
  },

  common: {
    book_now: 'Book Now',
    book_wa: 'Book via WhatsApp',
    per_group: 'per group',
    replies: 'Replies within a few hours',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SPANISH
// ─────────────────────────────────────────────────────────────────────────────

const es: Tr = {
  nav: {
    home: 'Inicio',
    tours: 'Tours',
    about: 'Sobre Tony',
    pricing: 'Precios',
    faq: 'Preguntas',
    booking: 'Reservar',
  },

  hero: {
    badge: 'Guía Privado de Kansai',
    headline: 'Descubre el Alma Verdadera de Japón',
    sub: 'Tours privados e íntimos por Osaka, Kioto, Nara y más allá — guiados por Tony Hanma, un apasionado local que da vida a cada historia oculta.',
    cta_wa: 'Chatear por WhatsApp',
    cta_tours: 'Explorar Tours',
  },

  stats: {
    destinations: '7 Destinos',
    languages: '5 Idiomas',
    private: '100% Privado',
  },

  discover: {
    label: 'Kansai te Espera',
    heading: 'Donde Cada Calle Guarda un Secreto',
    body: 'Kansai es el corazón latiente del Japón tradicional. Desde los callejones iluminados con farolillos de Gion hasta las imponentes puertas de Fushimi Inari, cada rincón susurra siglos de historia. Deja que Tony te lleve más allá de las guías de viaje.',
    tag1: 'Templos Ocultos',
    tag2: 'Mercados Locales',
    tag3: 'Historia Antigua',
    caption: 'Puertas torii de Fushimi Inari al amanecer, Kioto',
  },

  fortress: {
    label: 'Lo Mejor de Osaka',
    heading: 'El Castillo de Osaka y',
    headingAccent: 'la Ciudad a sus Pies',
    body: 'El castillo de Osaka no es solo un monumento — es una puerta de entrada a la turbulenta era feudal de Japón. Tony combina el castillo con las vibrantes calles de Osaka, donde los puestos modernos de takoyaki se encuentran con las fortificaciones del siglo XVI. Una aventura de día completo que ninguna guía puede replicar.',
    cta: 'Ver Tour de Osaka',
    caption: 'Castillo de Osaka con cerezos en flor, primavera',
  },

  tours_section: {
    label: 'Itinerarios Artesanales',
    heading: 'Tours para Cada Curiosidad',
    sub: 'Cada tour es privado, a tu ritmo, y guiado personalmente por Tony. Sin desconocidos, sin grupos apresurados — solo tú, tus compañeros de viaje y el Japón real.',
    view: 'Ver Detalles Completos',
  },

  cta_section: {
    heading: '¿Listo para Vivir Kansai?',
    sub: 'Envía un mensaje a Tony por WhatsApp para comprobar disponibilidad, hacer preguntas o reservar tu tour privado. Responde en pocas horas.',
    cta_wa: 'Escribir a Tony por WhatsApp',
    cta_pricing: 'Ver Precios',
  },

  tours_page: {
    label: 'Todas las Experiencias',
    heading: 'Tours Privados por Kansai',
    sub: 'Siete destinos, siete historias. Cada tour es privado, con guía completo y adaptado a tu ritmo.',
  },

  about_page: {
    label: 'Tu Guía',
    heading: 'Conoce a Tony Hanma',
    sub: 'Guía con base en Osaka, narrador y apasionado sin límites de todo lo que es Kansai.',
    story_label: 'La Historia',
    story_heading: 'La Pasión de un Local, Compartida con el Mundo',
    private_guide: 'Guía Privado',
    based: 'Con base en Osaka',
    guiding: '',
    rating: 'Valoración 5 Estrellas',
    speaks: 'Habla 5 Idiomas',
    cta_wa: 'Escribir a Tony',
    cta_tours: 'Ver Tours',
    cta_pricing: 'Ver Precios',
    coverage_label: 'Área de Cobertura',
  },

  pricing_page: {
    label: 'Precios Transparentes',
    heading: 'Tarifa Plana y Sencilla',
    sub: 'Un precio por grupo — sin cargos ocultos ni cálculos por persona. Todo el día es tuyo.',
    included_label: 'Qué Incluye',
    faq_link: 'Leer las Preguntas Frecuentes',
    reply_note: 'Tony suele responder en pocas horas por WhatsApp.',
  },

  faq_page: {
    label: 'Tus Preguntas',
    heading: 'Preguntas Frecuentes',
    sub: 'Todo lo que necesitas saber antes de reservar tu tour privado por Kansai.',
    still_q: '¿Aún Tienes Preguntas?',
    still_sub: 'Tony está encantado de responder cualquier duda antes de que reserves. Escríbele por WhatsApp — responderá en pocas horas.',
    cta_wa: 'Preguntar a Tony por WhatsApp',
    cta_pricing: 'Ver Precios',
  },

  booking_page: {
    label: 'Asegura tu Día',
    heading: 'Reserva tu Tour Privado',
    sub: 'Elige tu tour, selecciona una fecha y envía tus datos a Tony por WhatsApp. Él confirmará la disponibilidad y lo organizará todo.',
    step1: 'Elige un Tour',
    step2: 'Elige una Fecha',
    step3: 'Selecciona Huéspedes',
    step4: 'Enviar por WhatsApp',
    guests_label: 'Número de Personas',
    notes_placeholder: 'Peticiones especiales, necesidades de accesibilidad o preguntas para Tony…',
    per_group: 'por grupo',
    duration: 'Día completo',
    cta: 'Enviar Solicitud de Reserva por WhatsApp',
    note: 'Tony confirmará tu reserva manualmente. No se realiza ningún pago en línea.',
    today: 'Hoy',
    prev_month: 'Mes anterior',
    next_month: 'Mes siguiente',
    days: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
    months: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ],
    wa_msg: (tour, date, guests, notes) =>
      `¡Hola Tony! Me gustaría reservar un tour privado.\n\n` +
      `Tour: ${tour}\n` +
      `Fecha: ${date}\n` +
      `Personas: ${guests}\n` +
      (notes ? `Notas: ${notes}\n` : '') +
      `\nPor favor, indícame si esa fecha está disponible. ¡Muchas gracias!`,
  },

  footer: {
    about: 'Tours guiados privados por el corazón de Kansai — Osaka, Kioto, Nara y más allá.',
    based: 'Con base en Osaka, Japón',
    nav_label: 'Navegación',
    contact_label: 'Ponerse en Contacto',
    rights: 'Todos los derechos reservados.',
    replies: 'Responde en pocas horas',
    privacy: 'Política de Privacidad',
  },

  cookie: {
    title: 'Usamos cookies',
    body: 'Usamos Google Analytics para entender cómo se usa el sitio. No vendemos ni compartimos datos personales con terceros.',
    accept: 'Aceptar',
    decline: 'Rechazar',
    learn: 'Política de Privacidad',
  },

  common: {
    book_now: 'Reservar',
    book_wa: 'Reservar por WhatsApp',
    per_group: 'por grupo',
    replies: 'Responde en pocas horas',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ARABIC (RTL)
// ─────────────────────────────────────────────────────────────────────────────

const ar: Tr = {
  nav: {
    home: 'الرئيسية',
    tours: 'الجولات',
    about: 'عن توني',
    pricing: 'الأسعار',
    faq: 'الأسئلة الشائعة',
    booking: 'احجز الآن',
  },

  hero: {
    badge: 'مرشد كانساي الخاص',
    headline: 'اكتشف الروح الحقيقية لليابان',
    sub: 'جولات خاصة وحميمة عبر أوساكا وكيوتو ونارا وما وراءها — بقيادة توني هانما، المحلي الشغوف الذي يُحيي كل قصة مخفية.',
    cta_wa: 'تواصل عبر واتساب',
    cta_tours: 'استكشف الجولات',
  },

  stats: {
    destinations: '٧ وجهات',
    languages: '٥ لغات',
    private: '١٠٠٪ خاص',
  },

  discover: {
    label: 'كانساي تنتظرك',
    heading: 'حيث تحمل كل شارع سراً',
    body: 'كانساي هو القلب النابض لليابان التقليدية. من أزقة غيون المضاءة بالفوانيس إلى بوابات فوشيمي إيناري الشاهقة، يهمس كل ركن بقرون من التاريخ. دع توني يقودك إلى ما هو أبعد من كتب السفر.',
    tag1: 'معابد خفية',
    tag2: 'أسواق محلية',
    tag3: 'تاريخ عريق',
    caption: 'بوابات توري في فوشيمي إيناري عند الفجر، كيوتو',
  },

  fortress: {
    label: 'أبرز معالم أوساكا',
    heading: 'قلعة أوساكا و',
    headingAccent: 'المدينة تحتها',
    body: 'قلعة أوساكا ليست مجرد نصب تذكاري — بل هي بوابة إلى الحقبة الإقطاعية المضطربة في اليابان. يجمع توني بين القلعة وشوارع أوساكا النابضة بالحياة، حيث تلتقي أكشاك التاكوياكي الحديثة بالتحصينات المنحدرة من القرن السادس عشر. مغامرة ليوم كامل لا يمكن لأي كتاب سفر أن يضاهيها.',
    cta: 'شاهد جولة أوساكا',
    caption: 'قلعة أوساكا مع أزهار الكرز، الربيع',
  },

  tours_section: {
    label: 'مسارات مصنوعة بعناية',
    heading: 'جولات لكل فضول',
    sub: 'كل جولة خاصة، تسير بوتيرتك، ويقودها توني شخصياً. لا غرباء، لا مجموعات متسرعة — فقط أنت ورفاق رحلتك واليابان الحقيقية.',
    view: 'عرض التفاصيل الكاملة',
  },

  cta_section: {
    heading: 'هل أنت مستعد لتجربة كانساي؟',
    sub: 'أرسل لتوني رسالة على واتساب للاستفسار عن التوفر أو طرح الأسئلة أو حجز جولتك الخاصة. يرد خلال ساعات قليلة.',
    cta_wa: 'راسل توني على واتساب',
    cta_pricing: 'عرض الأسعار',
  },

  tours_page: {
    label: 'جميع التجارب',
    heading: 'جولات خاصة عبر كانساي',
    sub: 'سبع وجهات، سبع قصص. كل جولة خاصة، بمرشد كامل، ومُصممة لتسير بوتيرتك.',
  },

  about_page: {
    label: 'مرشدك',
    heading: 'تعرف على توني هانما',
    sub: 'مرشد مقيم في أوساكا، وراوٍ للقصص، ومتحمس لا حدود لحماسه لكل ما يتعلق بكانساي.',
    story_label: 'القصة',
    story_heading: 'شغف المحلي، يُشارك مع العالم',
    private_guide: 'مرشد خاص',
    based: 'مقيم في أوساكا',
    guiding: '',
    rating: 'تقييم 5 نجوم',
    speaks: 'يتحدث 5 لغات',
    cta_wa: 'راسل توني',
    cta_tours: 'عرض الجولات',
    cta_pricing: 'عرض الأسعار',
    coverage_label: 'منطقة التغطية',
  },

  pricing_page: {
    label: 'أسعار شفافة',
    heading: 'أسعار ثابتة وبسيطة',
    sub: 'سعر واحد للمجموعة — بدون رسوم خفية أو حسابات فردية. اليوم بأكمله لك.',
    included_label: 'ما يشمله السعر',
    faq_link: 'اقرأ الأسئلة الشائعة',
    reply_note: 'يرد توني عادةً خلال ساعات قليلة عبر واتساب.',
  },

  faq_page: {
    label: 'أسئلتك',
    heading: 'الأسئلة الشائعة',
    sub: 'كل ما تحتاج معرفته قبل حجز جولتك الخاصة في كانساي.',
    still_q: 'هل لا تزال لديك أسئلة؟',
    still_sub: 'يسعد توني بالإجابة على أي شيء قبل أن تحجز. تواصل معه على واتساب — سيرد خلال ساعات قليلة.',
    cta_wa: 'اسأل توني على واتساب',
    cta_pricing: 'عرض الأسعار',
  },

  booking_page: {
    label: 'احجز يومك',
    heading: 'احجز جولتك الخاصة',
    sub: 'اختر جولتك، وحدد تاريخاً، وأرسل تفاصيلك لتوني عبر واتساب. سيؤكد التوفر ويرتب كل شيء.',
    step1: 'اختر جولة',
    step2: 'اختر تاريخاً',
    step3: 'حدد عدد الضيوف',
    step4: 'أرسل عبر واتساب',
    guests_label: 'عدد الضيوف',
    notes_placeholder: 'أي طلبات خاصة، احتياجات إمكانية الوصول، أو أسئلة لتوني…',
    per_group: 'للمجموعة',
    duration: 'يوم كامل',
    cta: 'إرسال طلب الحجز عبر واتساب',
    note: 'سيؤكد توني حجزك يدوياً. لا يتم أي دفع عبر الإنترنت.',
    today: 'اليوم',
    prev_month: 'الشهر السابق',
    next_month: 'الشهر التالي',
    days: ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
    months: [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
    ],
    wa_msg: (tour, date, guests, notes) =>
      `مرحباً توني! أرغب في حجز جولة خاصة.\n\n` +
      `الجولة: ${tour}\n` +
      `التاريخ: ${date}\n` +
      `عدد الضيوف: ${guests}\n` +
      (notes ? `ملاحظات: ${notes}\n` : '') +
      `\nأرجو إعلامي إذا كان هذا التاريخ متاحاً. شكراً جزيلاً!`,
  },

  footer: {
    about: 'جولات مُرشَدة خاصة عبر قلب كانساي — أوساكا وكيوتو ونارا وما وراءها.',
    based: 'مقيم في أوساكا، اليابان',
    nav_label: 'التنقل',
    contact_label: 'تواصل معنا',
    rights: 'جميع الحقوق محفوظة.',
    replies: 'يرد خلال ساعات قليلة',
    privacy: 'سياسة الخصوصية',
  },

  cookie: {
    title: 'نستخدم ملفات تعريف الارتباط',
    body: 'نستخدم Google Analytics لفهم كيفية استخدام الموقع. لا يتم بيع أو مشاركة البيانات الشخصية مع أطراف ثالثة.',
    accept: 'قبول',
    decline: 'رفض',
    learn: 'سياسة الخصوصية',
  },

  common: {
    book_now: 'احجز الآن',
    book_wa: 'احجز عبر واتساب',
    per_group: 'للمجموعة',
    replies: 'يرد خلال ساعات قليلة',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CZECH
// ─────────────────────────────────────────────────────────────────────────────

const cs: Tr = {
  nav: {
    home: 'Domů',
    tours: 'Výlety',
    about: 'O Tonym',
    pricing: 'Ceník',
    faq: 'Otázky',
    booking: 'Rezervovat',
  },

  hero: {
    badge: 'Soukromý průvodce Kansai',
    headline: 'Objevte pravou duši Japonska',
    sub: 'Soukromé a intimní výlety přes Ósaku, Kjóto, Naru a dál — vedené Tonym Hanmou, vášnivým místním průvodcem, který dává každý skrytý příběh k životu.',
    cta_wa: 'Napsat přes WhatsApp',
    cta_tours: 'Prozkoumat výlety',
  },

  stats: {
    destinations: '7 destinací',
    languages: '5 jazyků',
    private: '100% soukromé',
  },

  discover: {
    label: 'Kansai čeká',
    heading: 'Kde každá ulice skrývá tajemství',
    body: 'Kansai je bijící srdce tradičního Japonska. Od lucernami osvětlených uliček Gionu po tyčící se brány Fušimi Inari — každý kout šeptá staletí historie. Nechte Tonyho, aby vás zavedl za hranice cestovních průvodců.',
    tag1: 'Skryté chrámy',
    tag2: 'Místní trhy',
    tag3: 'Dávná historie',
    caption: 'Brány torii ve Fušimi Inari za úsvitu, Kjóto',
  },

  fortress: {
    label: 'Nejlepší z Ósaky',
    heading: 'Hrad Ósaka a',
    headingAccent: 'město pod ním',
    body: 'Hrad Ósaka není jen památník — je to brána do bouřlivého feudálního období Japonska. Tony spojuje hrad s živými ulicemi Ósaky, kde moderní stánky takoyaki sousedí s opevněními ze 16. století. Celodenní dobrodružství, které žádný průvodce nedokáže napodobit.',
    cta: 'Zobrazit výlet do Ósaky',
    caption: 'Hrad Ósaka s třešňovými květy, jaro',
  },

  tours_section: {
    label: 'Ručně sestavené itineráře',
    heading: 'Výlety pro každou zvědavost',
    sub: 'Každý výlet je soukromý, probíhá vaším tempem a Tony ho vede osobně. Žádní cizí lidé, žádné uspěchané skupiny — jen vy, vaši cestovní společníci a skutečné Japonsko.',
    view: 'Zobrazit podrobnosti',
  },

  cta_section: {
    heading: 'Připraveni zažít Kansai?',
    sub: 'Pošlete Tonymu zprávu přes WhatsApp, abyste ověřili dostupnost, položili otázky nebo rezervovali soukromý výlet. Odpoví během několika hodin.',
    cta_wa: 'Napsat Tonymu přes WhatsApp',
    cta_pricing: 'Zobrazit ceník',
  },

  tours_page: {
    label: 'Všechny zážitky',
    heading: 'Soukromé výlety po Kansai',
    sub: 'Sedm destinací, sedm příběhů. Každý výlet je soukromý, plně průvodcovský a uzpůsobený vašemu tempu.',
  },

  about_page: {
    label: 'Váš průvodce',
    heading: 'Poznejte Tonyho Hanmu',
    sub: 'Průvodce sídlící v Ósace, vypravěč a neúnavný nadšenec pro vše, co Kansai nabízí.',
    story_label: 'Příběh',
    story_heading: 'Vášeň místního, sdílená s celým světem',
    private_guide: 'Soukromý průvodce',
    based: 'Sídlí v Ósace',
    guiding: '',
    rating: 'Hodnocení 5 hvězd',
    speaks: 'Mluví 5 jazyky',
    cta_wa: 'Napsat Tonymu',
    cta_tours: 'Zobrazit výlety',
    cta_pricing: 'Zobrazit ceník',
    coverage_label: 'Oblast pokrytí',
  },

  pricing_page: {
    label: 'Transparentní ceny',
    heading: 'Jednoduchá paušální cena',
    sub: 'Jedna cena za skupinu — žádné skryté poplatky, žádné výpočty na osobu. Celý den je váš.',
    included_label: 'Co je zahrnuto',
    faq_link: 'Přečíst časté otázky',
    reply_note: 'Tony obvykle odpoví přes WhatsApp do několika hodin.',
  },

  faq_page: {
    label: 'Vaše otázky',
    heading: 'Často kladené otázky',
    sub: 'Vše, co potřebujete vědět před rezervací soukromého výletu po Kansai.',
    still_q: 'Stále máte otázky?',
    still_sub: 'Tony rád zodpoví cokoli před rezervací. Napište mu přes WhatsApp — odpoví během několika hodin.',
    cta_wa: 'Zeptat se Tonyho přes WhatsApp',
    cta_pricing: 'Zobrazit ceník',
  },

  booking_page: {
    label: 'Zajistěte si svůj den',
    heading: 'Rezervujte soukromý výlet',
    sub: 'Vyberte výlet, zvolte datum a pošlete Tonymu své údaje přes WhatsApp. Tony potvrdí dostupnost a vše zařídí.',
    step1: 'Vyberte výlet',
    step2: 'Vyberte datum',
    step3: 'Zvolte počet hostů',
    step4: 'Odeslat přes WhatsApp',
    guests_label: 'Počet osob',
    notes_placeholder: 'Zvláštní přání, potřeby přístupnosti nebo dotazy pro Tonyho…',
    per_group: 'za skupinu',
    duration: 'Celý den',
    cta: 'Odeslat žádost o rezervaci přes WhatsApp',
    note: 'Tony potvrdí vaši rezervaci ručně. Online se neplatí.',
    today: 'Dnes',
    prev_month: 'Předchozí měsíc',
    next_month: 'Následující měsíc',
    days: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'],
    months: [
      'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
      'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec',
    ],
    wa_msg: (tour, date, guests, notes) =>
      `Ahoj Tony! Chtěl/a bych rezervovat soukromý výlet.\n\n` +
      `Výlet: ${tour}\n` +
      `Datum: ${date}\n` +
      `Počet osob: ${guests}\n` +
      (notes ? `Poznámky: ${notes}\n` : '') +
      `\nProsím, dej mi vědět, zda je toto datum volné. Děkuji!`,
  },

  footer: {
    about: 'Soukromě vedené výlety srdcem Kansai — Ósaka, Kjóto, Nara a dál.',
    based: 'Sídlí v Ósace, Japonsko',
    nav_label: 'Navigace',
    contact_label: 'Kontakt',
    rights: 'Všechna práva vyhrazena.',
    replies: 'Odpoví během několika hodin',
    privacy: 'Zásady ochrany osobních údajů',
  },

  cookie: {
    title: 'Používáme cookies',
    body: 'Používáme Google Analytics, abychom pochopili, jak návštěvníci web používají. Žádné osobní údaje nejsou prodávány ani sdíleny s třetími stranami.',
    accept: 'Přijmout',
    decline: 'Odmítnout',
    learn: 'Zásady ochrany osobních údajů',
  },

  common: {
    book_now: 'Rezervovat',
    book_wa: 'Rezervovat přes WhatsApp',
    per_group: 'za skupinu',
    replies: 'Odpoví během několika hodin',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// RUSSIAN
// ─────────────────────────────────────────────────────────────────────────────

const ru: Tr = {
  nav: {
    home: 'Главная',
    tours: 'Туры',
    about: 'О Тони',
    pricing: 'Цены',
    faq: 'Вопросы',
    booking: 'Забронировать',
  },

  hero: {
    badge: 'Личный гид по Кансай',
    headline: 'Откройте истинную душу Японии',
    sub: 'Частные, камерные туры по Осаке, Киото, Наре и не только — под руководством Тони Ханмы, страстного местного гида, который оживляет каждую скрытую историю.',
    cta_wa: 'Написать в WhatsApp',
    cta_tours: 'Смотреть туры',
  },

  stats: {
    destinations: '7 направлений',
    languages: '5 языков',
    private: '100% приватно',
  },

  discover: {
    label: 'Кансай ждёт вас',
    heading: 'Где каждая улица хранит тайну',
    body: 'Кансай — бьющееся сердце традиционной Японии. От освещённых фонарями переулков Гиона до величественных ворот Фусими Инари — каждый уголок шепчет о столетиях истории. Позвольте Тони провести вас туда, куда не доберётся ни один путеводитель.',
    tag1: 'Скрытые храмы',
    tag2: 'Местные рынки',
    tag3: 'Древняя история',
    caption: 'Ворота тории Фусими Инари на рассвете, Киото',
  },

  fortress: {
    label: 'Лучшее из Осаки',
    heading: 'Замок Осака и',
    headingAccent: 'город у его подножия',
    body: 'Замок Осака — это не просто памятник, это врата в бурную феодальную эпоху Японии. Тони совмещает посещение замка с прогулкой по живым улицам Осаки, где современные лотки с такояки соседствуют с укреплениями XVI века. Приключение на целый день, которое не воспроизведёт ни один путеводитель.',
    cta: 'Смотреть тур по Осаке',
    caption: 'Замок Осака в цвету сакуры, весна',
  },

  tours_section: {
    label: 'Авторские маршруты',
    heading: 'Туры для любого интереса',
    sub: 'Каждый тур частный, идёт в вашем темпе и ведётся лично Тони. Никаких незнакомцев, никаких спешащих групп — только вы, ваши спутники и настоящая Япония.',
    view: 'Посмотреть подробности',
  },

  cta_section: {
    heading: 'Готовы открыть Кансай?',
    sub: 'Напишите Тони в WhatsApp, чтобы уточнить наличие мест, задать вопросы или забронировать частный тур. Он отвечает в течение нескольких часов.',
    cta_wa: 'Написать Тони в WhatsApp',
    cta_pricing: 'Посмотреть цены',
  },

  tours_page: {
    label: 'Все впечатления',
    heading: 'Частные туры по Кансай',
    sub: 'Семь направлений, семь историй. Каждый тур частный, с полноценным гидом и подстроен под ваш темп.',
  },

  about_page: {
    label: 'Ваш гид',
    heading: 'Познакомьтесь с Тони Ханмой',
    sub: 'Гид из Осаки, рассказчик и неугомонный энтузиаст всего, что связано с Кансай.',
    story_label: 'История',
    story_heading: 'Страсть местного жителя, открытая миру',
    private_guide: 'Личный гид',
    based: 'Базируется в Осаке',
    guiding: '',
    rating: 'Оценка 5 звёзд',
    speaks: 'Говорит на 5 языках',
    cta_wa: 'Написать Тони',
    cta_tours: 'Смотреть туры',
    cta_pricing: 'Посмотреть цены',
    coverage_label: 'Зона охвата',
  },

  pricing_page: {
    label: 'Прозрачные цены',
    heading: 'Простая фиксированная цена',
    sub: 'Одна цена за группу — никаких скрытых сборов и расчётов на человека. Весь день — ваш.',
    included_label: 'Что входит в стоимость',
    faq_link: 'Читать часто задаваемые вопросы',
    reply_note: 'Тони, как правило, отвечает в течение нескольких часов через WhatsApp.',
  },

  faq_page: {
    label: 'Ваши вопросы',
    heading: 'Часто задаваемые вопросы',
    sub: 'Всё, что нужно знать перед бронированием частного тура по Кансай.',
    still_q: 'Остались вопросы?',
    still_sub: 'Тони рад ответить на любой вопрос до бронирования. Напишите ему в WhatsApp — он ответит в течение нескольких часов.',
    cta_wa: 'Спросить Тони в WhatsApp',
    cta_pricing: 'Посмотреть цены',
  },

  booking_page: {
    label: 'Забронируйте свой день',
    heading: 'Забронировать частный тур',
    sub: 'Выберите тур, выберите дату и отправьте Тони свои данные через WhatsApp. Он подтвердит наличие мест и всё организует.',
    step1: 'Выберите тур',
    step2: 'Выберите дату',
    step3: 'Укажите гостей',
    step4: 'Отправить через WhatsApp',
    guests_label: 'Количество гостей',
    notes_placeholder: 'Особые пожелания, потребности в доступности или вопросы для Тони…',
    per_group: 'за группу',
    duration: 'Полный день',
    cta: 'Отправить запрос на бронирование через WhatsApp',
    note: 'Тони подтвердит бронирование вручную. Оплата онлайн не производится.',
    today: 'Сегодня',
    prev_month: 'Предыдущий месяц',
    next_month: 'Следующий месяц',
    days: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    months: [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
    ],
    wa_msg: (tour, date, guests, notes) =>
      `Здравствуйте, Тони! Я хотел(а) бы забронировать частный тур.\n\n` +
      `Тур: ${tour}\n` +
      `Дата: ${date}\n` +
      `Количество гостей: ${guests}\n` +
      (notes ? `Примечания: ${notes}\n` : '') +
      `\nПожалуйста, сообщите, доступна ли эта дата. Спасибо!`,
  },

  footer: {
    about: 'Частные экскурсии по сердцу Кансай — Осака, Киото, Нара и не только.',
    based: 'Базируется в Осаке, Япония',
    nav_label: 'Навигация',
    contact_label: 'Связаться',
    rights: 'Все права защищены.',
    replies: 'Отвечает в течение нескольких часов',
    privacy: 'Политика конфиденциальности',
  },

  cookie: {
    title: 'Мы используем cookies',
    body: 'Мы используем Google Analytics, чтобы понять, как посетители пользуются сайтом. Личные данные не продаются и не передаются третьим лицам.',
    accept: 'Принять',
    decline: 'Отклонить',
    learn: 'Политика конфиденциальности',
  },

  common: {
    book_now: 'Забронировать',
    book_wa: 'Забронировать через WhatsApp',
    per_group: 'за группу',
    replies: 'Отвечает в течение нескольких часов',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Assembled export
// ─────────────────────────────────────────────────────────────────────────────

export const TRANSLATIONS: Record<Lang, Tr> = { en, es, ar, cs, ru };
