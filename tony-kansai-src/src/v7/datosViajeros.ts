// Páginas por país de origen (Viajeros.tsx): lo práctico del viaje y el tour con
// precio en su moneda al cambio del día. Una entrada por mercado.
//
// Regla de contenido: nada que no sea verdad. Lo que cambia con el tiempo
// (visado, vuelos) va dicho en general y con la fuente oficial para comprobarlo.

export type MercadoId = 'mx' | 'uk' | 'es' | 'golfo' | 'us' | 'arg' | 'rusia'

export interface Mercado {
  lang: 'es' | 'en' | 'ar' | 'ru'; ruta: string;
  /** Guía de la página (por defecto Tony). */
  guia?: 'tony' | 'larion'
  inicio: string; locale: string; divisas: string[]
  seo: { titulo: string; descripcion: string }
  bandera: string; antetitulo: string; titulo: string; sub: string; cta: string
  practicoTitulo: string; practico: { icono: string; t: string; d: string }[]
  preciosTitulo: string; planes: [string, string]; porGrupo: string; porPersona: (y: string) => string
  notas: string[]; aprox: string
  ideasTitulo: string; ideas: { t: string; d: string; a: string }[]
  final: { titulo: string; texto: string; boton: string; principal: string }
  saludo: string; escribe: string; foto: string; fotoAlt: string; touristType: string
}

export const MERCADOS: Record<MercadoId, Mercado> = {
  mx: {
    lang: 'es', ruta: '/es/desde-mexico/', inicio: '/es/', locale: 'es-MX', divisas: ['MXN', 'USD'],
    seo: {
      titulo: 'Viajar a Japón desde México con guía privado en español | Tony Kansai Guide',
      descripcion: 'Guía privado en español en Kioto, Osaka y Nara para viajeros de México: diferencia horaria, visado, cómo llegar a Kansai, dinero y precios en pesos al cambio de hoy.',
    },
    bandera: '🇲🇽', antetitulo: 'Para viajeros de México',
    titulo: 'Japón desde México, con guía en español.',
    sub: 'Soy Tony. Te recojo en el hotel y pasamos el día en Kioto, Osaka o Nara, solo con tu grupo. Sin agencia: hablas directamente conmigo, por WhatsApp, en tu idioma.',
    cta: 'Cuéntame tu viaje',
    practicoTitulo: 'Lo práctico, antes de volar',
    practico: [
      { icono: '🕐', t: 'Horario', d: 'Japón va 15 horas por delante de Ciudad de México y 14 por delante de Cancún. Escríbeme cuando quieras: te contesto en cuanto amanezca aquí.' },
      { icono: '🛂', t: 'Visado', d: 'Para turismo de corta estancia, los mexicanos no necesitan visado para entrar en Japón. Antes de viajar, confírmalo en la web de la Embajada de Japón en México.' },
      { icono: '✈️', t: 'Cómo llegar a Kansai', d: 'Hay vuelos directos de Ciudad de México a Tokio. Desde Tokio, el shinkansen llega a Kioto en unas dos horas y cuarto; también hay vuelos con escala al aeropuerto de Kansai.' },
      { icono: '💴', t: 'Dinero', d: 'En Japón el efectivo sigue siendo útil. Los cajeros de 7-Eleven aceptan tarjetas extranjeras. Y no se dejan propinas: en ningún sitio, tampoco conmigo.' },
      { icono: '🔌', t: 'Enchufes', d: 'Son de tipo A, como en México, a 100 voltios. Los cargadores de móvil y portátil funcionan sin adaptador.' },
      { icono: '💳', t: 'Pagar el tour', d: 'En efectivo, en yenes, el día del tour. O por adelantado desde México con PayPal y tu tarjeta, cuando ya tengamos la fecha.' },
    ],
    preciosTitulo: 'Precio por grupo, en pesos al cambio de hoy',
    planes: ['Medio día · 4 horas', 'Día completo · 8 horas'], porGrupo: 'por grupo, hasta 6 personas',
    porPersona: (y) => `Siendo 4: ${y} por persona`,
    notas: ['Trenes, entradas y comidas no están incluidos: los pagáis en el momento y yo os digo cómo.', 'Cancelación sin coste hasta 72 horas antes.'],
    aprox: 'al cambio de hoy',
    ideasTitulo: 'Ideas para tu día',
    ideas: [
      { t: 'Kioto en un día', d: 'Fushimi Inari antes de la gente, Kiyomizu, Gion y el Pabellón Dorado.', a: '/es/kyoto/' },
      { t: 'Osaka comiendo', d: 'El castillo, el mercado de Kuromon y los neones de Dōtonbori.', a: '/es/osaka/' },
      { t: 'Nara y sus ciervos', d: 'El Gran Buda de Tōdai-ji y el parque, a 45 minutos de Osaka.', a: '/es/nara/' },
      { t: 'Otoño en Kioto', d: 'Los arces rojos de noviembre, saliendo temprano.', a: '/es/otono-kioto/' },
    ],
    final: { titulo: '¿Cuándo venís?', texto: 'Dime fechas, cuántos sois y dónde os alojáis. Te contesto yo, Tony, normalmente el mismo día.', boton: 'Escríbeme por WhatsApp', principal: 'Ver la página principal' },
    saludo: 'Hola Tony, venimos de México y nos interesa un tour. Fechas: ', escribe: 'Escríbeme',
    foto: '/v7/fotos/kioto.jpg', fotoAlt: 'Fushimi Inari, Kioto', touristType: 'Viajeros de México',
  },
  uk: {
    lang: 'en', ruta: '/en/from-uk/', inicio: '/en/', locale: 'en-GB', divisas: ['GBP', 'EUR'],
    seo: {
      titulo: 'Japan from the UK: Private Guide in Kyoto, Osaka & Nara | Tony Kansai Guide',
      descripcion: 'A private guide in Kyoto, Osaka and Nara for travellers from the UK: time difference, entry, getting to Kansai, money, plugs and prices in pounds at today\'s rate.',
    },
    bandera: '🇬🇧', antetitulo: 'For travellers from the UK',
    titulo: 'Japan from the UK, with your own guide.',
    sub: 'I\'m Tony. I meet you at your hotel and we spend the day in Kyoto, Osaka or Nara, just your group. No agency: you deal with me directly, on WhatsApp.',
    cta: 'Tell me about your trip',
    practicoTitulo: 'The practical bits, before you fly',
    practico: [
      { icono: '🕐', t: 'Time difference', d: 'Japan is 9 hours ahead of London in winter and 8 in summer. Message me whenever suits you: I reply as soon as it\'s morning here.' },
      { icono: '🛂', t: 'Entry', d: 'British citizens don\'t need a visa for short tourist stays in Japan. Check the latest on GOV.UK\'s Japan travel advice before you go.' },
      { icono: '✈️', t: 'Getting to Kansai', d: 'There are direct flights from London to Tokyo. From Tokyo the shinkansen reaches Kyoto in about two and a quarter hours; there are also flights with one stop to Kansai Airport.' },
      { icono: '💴', t: 'Money', d: 'Cash is still handy in Japan. 7-Eleven cash machines take foreign cards. And there\'s no tipping anywhere, including with me.' },
      { icono: '🔌', t: 'Plugs', d: 'Japan uses two flat pins (type A) at 100 volts, so bring a UK-to-Japan adapter. Phone and laptop chargers work fine with it.' },
      { icono: '💳', t: 'Paying for the tour', d: 'In cash, in yen, on the day. Or in advance from the UK with PayPal and your card, once your date is confirmed.' },
    ],
    preciosTitulo: 'Price per group, in pounds at today\'s rate',
    planes: ['Half day · 4 hours', 'Full day · 8 hours'], porGrupo: 'per group, up to 6 people',
    porPersona: (y) => `For 4 people: ${y} each`,
    notas: ['Trains, admissions and meals aren\'t included: you pay as we go and I show you how.', 'Free cancellation up to 72 hours before.'],
    aprox: 'at today\'s rate',
    ideasTitulo: 'Ideas for your day',
    ideas: [
      { t: 'Kyoto in a day', d: 'Fushimi Inari before the crowds, Kiyomizu, Gion and the Golden Pavilion.', a: '/en/kyoto/' },
      { t: 'Osaka, eating', d: 'The castle, Kuromon market and the neon of Dōtonbori.', a: '/en/osaka/' },
      { t: 'Nara and its deer', d: 'The Great Buddha of Tōdai-ji and the park, 45 minutes from Osaka.', a: '/en/nara/' },
      { t: 'Kyoto in autumn', d: 'The red maples of November, starting early.', a: '/en/kyoto-autumn/' },
    ],
    final: { titulo: 'When are you coming?', texto: 'Tell me your dates, how many you are and where you\'re staying. I reply myself, usually the same day.', boton: 'Message me on WhatsApp', principal: 'See the main page' },
    saludo: 'Hi Tony, we\'re coming from the UK and we\'d like a tour. Dates: ', escribe: 'Message me',
    foto: '/v7/fotos/nara.jpg', fotoAlt: 'Deer in Nara Park under autumn leaves', touristType: 'Travellers from the UK',
  },
  es: {
    lang: 'es', ruta: '/es/desde-espana/', inicio: '/es/', locale: 'es-ES', divisas: ['EUR'],
    seo: {
      titulo: 'Viajar a Japón desde España con guía privado en español | Tony Kansai Guide',
      descripcion: 'Guía privado español en Kioto, Osaka y Nara: diferencia horaria con la Península y Canarias, visado, vuelos, enchufes, dinero y precios en euros al cambio de hoy.',
    },
    bandera: '🇪🇸', antetitulo: 'Para viajeros de España',
    titulo: 'Japón desde España, con un guía español.',
    sub: 'Soy Tony, español, y vivo en Osaka. Te recojo en el hotel y pasamos el día en Kioto, Osaka o Nara, solo con tu grupo. Sin agencia: hablas directamente conmigo, por WhatsApp.',
    cta: 'Cuéntame tu viaje',
    practicoTitulo: 'Lo práctico, antes de volar',
    practico: [
      { icono: '🕐', t: 'Horario', d: 'Japón va 8 horas por delante de la Península en invierno y 7 en verano; de Canarias, una hora más. Escríbeme cuando quieras: te contesto en cuanto amanezca aquí.' },
      { icono: '🛂', t: 'Visado', d: 'Para turismo de corta estancia, los españoles no necesitan visado para entrar en Japón. Antes de viajar, revisa las recomendaciones de viaje del Ministerio de Asuntos Exteriores.' },
      { icono: '✈️', t: 'Cómo llegar a Kansai', d: 'Hay vuelos directos de Madrid a Tokio. Desde Tokio, el shinkansen llega a Kioto en unas dos horas y cuarto; también hay vuelos con una escala al aeropuerto de Kansai.' },
      { icono: '💴', t: 'Dinero', d: 'En Japón el efectivo sigue siendo útil. Los cajeros de 7-Eleven aceptan tarjetas extranjeras. Y no se dejan propinas: en ningún sitio, tampoco conmigo.' },
      { icono: '🔌', t: 'Enchufes', d: 'Son de dos clavijas planas (tipo A) a 100 voltios: trae un adaptador. Los cargadores de móvil y portátil funcionan con él; los secadores y planchas de pelo españoles, no.' },
      { icono: '💳', t: 'Pagar el tour', d: 'En efectivo, en yenes, el día del tour. O por adelantado en euros, por transferencia a una cuenta española, por PayPal o por Wise, cuando ya tengamos la fecha.' },
    ],
    preciosTitulo: 'Precio por grupo, en euros al cambio de hoy',
    planes: ['Medio día · 4 horas', 'Día completo · 8 horas'], porGrupo: 'por grupo, hasta 6 personas',
    porPersona: (y) => `Siendo 4: ${y} por persona`,
    notas: ['Trenes, entradas y comidas no están incluidos: los pagáis en el momento y yo os digo cómo.', 'Cancelación sin coste hasta 72 horas antes.'],
    aprox: 'al cambio de hoy',
    ideasTitulo: 'Ideas para tu día',
    ideas: [
      { t: 'Kioto en un día', d: 'Fushimi Inari antes de la gente, Kiyomizu, Gion y el Pabellón Dorado.', a: '/es/kyoto/' },
      { t: 'Osaka comiendo', d: 'El castillo, el mercado de Kuromon y los neones de Dōtonbori.', a: '/es/osaka/' },
      { t: 'Nara y sus ciervos', d: 'El Gran Buda de Tōdai-ji y el parque, a 45 minutos de Osaka.', a: '/es/nara/' },
      { t: 'Otoño en Kioto', d: 'Los arces rojos de noviembre, saliendo temprano.', a: '/es/otono-kioto/' },
    ],
    final: { titulo: '¿Cuándo venís?', texto: 'Dime fechas, cuántos sois y dónde os alojáis. Te contesto yo, Tony, normalmente el mismo día.', boton: 'Escríbeme por WhatsApp', principal: 'Ver la página principal' },
    saludo: 'Hola Tony, venimos de España y nos interesa un tour. Fechas: ', escribe: 'Escríbeme',
    foto: '/v8/zonas/kioto-kiyomizu.jpg', fotoAlt: 'Kiyomizu-dera en otoño, Kioto', touristType: 'Viajeros de España',
  },
  golfo: {
    lang: 'ar', ruta: '/ar/from-gulf/', inicio: '/ar/', locale: 'ar-u-nu-latn', divisas: ['AED', 'SAR'],
    seo: {
      titulo: 'السفر إلى اليابان من الخليج مع مرشد خاص بالعربية | Tony Kansai Guide',
      descripcion: 'مرشد خاص بالعربية في كيوتو وأوساكا ونارا للمسافرين من الخليج: فارق التوقيت، والدخول إلى اليابان، والوصول إلى كانساي، والطعام الحلال والصلاة، والأسعار بالدرهم والريال بسعر الصرف اليوم.',
    },
    bandera: '🇦🇪 🇸🇦 🇶🇦', antetitulo: 'للمسافرين من الخليج',
    titulo: 'اليابان من الخليج، مع مرشد يتحدث العربية.',
    sub: 'أنا طوني، إسباني مسلم وأعيش في أوساكا. ألتقيك في بهو فندقك ونقضي اليوم في كيوتو أو أوساكا أو نارا، مع عائلتك وحدها. بلا وكالة: تتعامل معي مباشرة عبر واتساب.',
    cta: 'أخبرني عن رحلتك',
    practicoTitulo: 'أمور عملية قبل السفر',
    practico: [
      { icono: '🕐', t: 'فارق التوقيت', d: 'اليابان تسبق الإمارات بخمس ساعات، والسعودية وقطر بست ساعات، طوال العام. راسلني متى شئت، وأردّ عليك حين يبدأ الصباح هنا.' },
      { icono: '🛂', t: 'الدخول إلى اليابان', d: 'تختلف شروط الدخول باختلاف الجنسية: بعض جوازات الخليج معفاة من التأشيرة أو تحتاج إلى تسجيل مسبق عبر الإنترنت، وبعضها يحتاج إلى تأشيرة. تحقّق قبل السفر من موقع سفارة اليابان في بلدك.' },
      { icono: '✈️', t: 'الوصول إلى كانساي', d: 'توجد رحلات من مطارات الخليج إلى اليابان، وبعضها مباشر إلى مطار كانساي الدولي، مثل طيران الإمارات من دبي. ومن طوكيو يصل القطار السريع شينكانسن إلى كيوتو في نحو ساعتين وربع.' },
      { icono: '🕌', t: 'الطعام الحلال والصلاة', d: 'أنا مسلم وأعرف المطاعم الحلال الموثوقة في أوساكا وكيوتو، وأضع وقفات الصلاة في المسار من البداية: مسجد أوساكا، ومسجد كوبي، وجمعية كيوتو الإسلامية، ومصليات مطار كانساي.' },
      { icono: '🔌', t: 'المقابس الكهربائية', d: 'تستخدم اليابان مقابس بدبوسين مسطحين (النوع A) بجهد 100 فولت، فأحضر محوّلاً لمقابس الخليج (النوع G). شواحن الهاتف والحاسوب تعمل معه دون مشكلة.' },
      { icono: '💳', t: 'دفع ثمن الجولة', d: 'نقداً بالين في يوم الجولة، أو مسبقاً عبر PayPal أو Wise بعد تأكيد الموعد. ولا توجد إكراميات في اليابان، لا في المطاعم ولا معي.' },
    ],
    preciosTitulo: 'السعر للمجموعة، بالدرهم والريال بسعر الصرف اليوم',
    planes: ['نصف يوم · 4 ساعات', 'يوم كامل · 8 ساعات'], porGrupo: 'للمجموعة، حتى 6 أشخاص',
    porPersona: (y) => `لأربعة أشخاص: ${y} للشخص`,
    notas: ['القطارات وتذاكر الدخول والوجبات غير مشمولة: تدفعونها في حينها وأنا أدلّكم على الطريقة.', 'الإلغاء مجاني حتى 72 ساعة قبل الموعد.'],
    aprox: 'بسعر الصرف اليوم',
    ideasTitulo: 'أفكار ليومك',
    ideas: [
      { t: 'كيوتو في يوم', d: 'فوشيمي إيناري قبل الزحام، وكيوميزو، وأزقة غيون.', a: '/ar/kyoto/' },
      { t: 'أوساكا', d: 'القلعة ودوتونبوري والأسواق التي يأكل فيها أهل المدينة.', a: '/ar/osaka/' },
      { t: 'نارا وغزلانها', d: 'تمثال بوذا الكبير في توداي-جي والحديقة، على بُعد 45 دقيقة من أوساكا.', a: '/ar/nara/' },
      { t: 'كوبي ومسجدها', d: 'الميناء وحي كيتانو، ومسجد كوبي، أقدم مسجد في اليابان.', a: '/ar/kobe/' },
    ],
    final: { titulo: 'متى تصلون؟', texto: 'أخبرني بالتواريخ وعددكم ومكان إقامتكم. أردّ عليك بنفسي، عادةً في اليوم نفسه.', boton: 'راسلني عبر واتساب', principal: 'الصفحة الرئيسية' },
    saludo: 'السلام عليكم طوني، نحن قادمون من الخليج ونرغب في جولة. التواريخ: ', escribe: 'راسلني',
    foto: '/v7/fotos/kioto.jpg', fotoAlt: 'بوابات فوشيمي إيناري، كيوتو', touristType: 'المسافرون من الخليج',
  },
  us: {
    lang: 'en', ruta: '/en/from-usa/', inicio: '/en/', locale: 'en-US', divisas: ['USD'],
    seo: {
      titulo: 'Japan from the USA: Private Guide in Kyoto | Tony Kansai Guide',
      descripcion: 'A private guide in Kyoto, Osaka and Nara for travelers from the US: time difference, entry, getting to Kansai, money, plugs and prices in dollars.',
    },
    bandera: '🇺🇸', antetitulo: 'For travelers from the US',
    titulo: 'Japan from the US, with your own guide.',
    sub: 'I\'m Tony. I pick you up at your hotel and we spend the day in Kyoto, Osaka or Nara, just your group. No agency: you deal with me directly, on WhatsApp.',
    cta: 'Tell me about your trip',
    practicoTitulo: 'The practical stuff, before you fly',
    practico: [
      { icono: '🕐', t: 'Time difference', d: 'Japan is 14 hours ahead of New York and 17 ahead of Los Angeles in winter; in summer, 13 and 16. Message me whenever works for you: I reply as soon as it\'s morning here.' },
      { icono: '🛂', t: 'Entry', d: 'US citizens don\'t need a visa for short tourist stays in Japan. Check the State Department\'s Japan page before you go.' },
      { icono: '✈️', t: 'Getting to Kansai', d: 'Many US cities have nonstop flights to Tokyo. From Tokyo the shinkansen reaches Kyoto in about two and a quarter hours; there are also flights to Kansai Airport, near Osaka, so check what leaves from your city.' },
      { icono: '💴', t: 'Money', d: 'Cash is still handy in Japan. 7-Eleven ATMs take foreign cards. And there\'s no tipping anywhere, including with me.' },
      { icono: '🔌', t: 'Plugs', d: 'Japan uses two flat pins (type A) at 100 volts, so most US chargers just plug in. Three-prong plugs, and some with one wider pin, need a simple adapter.' },
      { icono: '💳', t: 'Paying for the tour', d: 'In cash, in yen, on the day. Or in advance from the US with PayPal or Wise, once your date is confirmed.' },
    ],
    preciosTitulo: 'Price per group, in dollars at today\'s rate',
    planes: ['Half day · 4 hours', 'Full day · 8 hours'], porGrupo: 'per group, up to 6 people',
    porPersona: (y) => `For 4 people: ${y} each`,
    notas: ['Trains, admissions and meals aren\'t included: you pay as we go and I show you how.', 'Free cancellation up to 72 hours before.'],
    aprox: 'at today\'s rate',
    ideasTitulo: 'Ideas for your day',
    ideas: [
      { t: 'Kyoto in a day', d: 'Fushimi Inari before the crowds, Kiyomizu, Gion and the Golden Pavilion.', a: '/en/kyoto/' },
      { t: 'Osaka, eating', d: 'The castle, Kuromon market and the neon of Dōtonbori.', a: '/en/osaka/' },
      { t: 'Nara and its deer', d: 'The Great Buddha of Tōdai-ji and the park, 45 minutes from Osaka.', a: '/en/nara/' },
      { t: 'Kyoto in the fall', d: 'The red maples of November, starting early.', a: '/en/kyoto-autumn/' },
    ],
    final: { titulo: 'When are you coming?', texto: 'Tell me your dates, how many of you there are and where you\'re staying. I reply myself, usually the same day.', boton: 'Message me on WhatsApp', principal: 'See the main page' },
    saludo: 'Hi Tony, we\'re coming from the US and we\'d like a tour. Dates: ', escribe: 'Message me',
    foto: '/v8/zonas/osaka-dotonbori.jpg', fotoAlt: 'Dōtonbori canal at night, Osaka', touristType: 'Travelers from the United States',
  },
  arg: {
    lang: 'es', ruta: '/es/desde-argentina/', inicio: '/es/', locale: 'es-AR', divisas: ['ARS', 'USD'],
    seo: {
      titulo: 'Japón desde Argentina con guía en español | Tony Kansai Guide',
      descripcion: 'Guía en español en Kioto, Osaka y Nara para viajeros de Argentina: diferencia horaria, visa, cómo llegar a Kansai, enchufes y precios en pesos y dólares.',
    },
    bandera: '🇦🇷', antetitulo: 'Para viajeros de Argentina',
    titulo: 'Japón desde Argentina, con guía en español.',
    sub: 'Soy Tony. Te busco en el hotel y pasamos el día en Kioto, Osaka o Nara, solo con tu grupo. Sin agencia: hablás directamente conmigo, por WhatsApp, en tu idioma.',
    cta: 'Contame tu viaje',
    practicoTitulo: 'Lo práctico, antes de volar',
    practico: [
      { icono: '🕐', t: 'Horario', d: 'Japón va 12 horas adelante de Buenos Aires, todo el año. Escribime cuando quieras: te contesto apenas amanece acá.' },
      { icono: '🛂', t: 'Visa', d: 'Para turismo de corta estadía, los argentinos no necesitan visa para entrar en Japón. Antes de viajar, confirmalo en la web de la Embajada de Japón en Argentina.' },
      { icono: '✈️', t: 'Cómo llegar a Kansai', d: 'Desde Argentina se llega con al menos una escala, a Tokio o directo al aeropuerto de Kansai. Desde Tokio, el shinkansen llega a Kioto en unas dos horas y cuarto.' },
      { icono: '💴', t: 'Plata', d: 'En Japón el efectivo sigue siendo útil. Los cajeros de 7-Eleven aceptan tarjetas extranjeras. Y no se deja propina: en ningún lado, tampoco conmigo.' },
      { icono: '🔌', t: 'Enchufes', d: 'En Japón son de tipo A, de dos patas planas, a 100 voltios: el enchufe argentino no entra, así que traé adaptador. Y fijate que el cargador diga 100-240 V; los de celular y notebook casi siempre lo dicen.' },
      { icono: '💳', t: 'Pagar el tour', d: 'En efectivo, en yenes, el día del tour. O por adelantado con PayPal o Wise, cuando ya tengamos la fecha.' },
    ],
    preciosTitulo: 'Precio por grupo, al cambio de hoy',
    planes: ['Medio día · 4 horas', 'Día completo · 8 horas'], porGrupo: 'por grupo, hasta 6 personas',
    porPersona: (y) => `Siendo 4: ${y} por persona`,
    notas: ['Trenes, entradas y comidas no están incluidos: los pagan en el momento y yo les explico cómo.', 'Cancelación sin costo hasta 72 horas antes.'],
    aprox: 'al cambio de hoy',
    ideasTitulo: 'Ideas para tu día',
    ideas: [
      { t: 'Kioto en un día', d: 'Fushimi Inari antes de la gente, Kiyomizu, Gion y el Pabellón Dorado.', a: '/es/kyoto/' },
      { t: 'Osaka comiendo', d: 'El castillo, el mercado de Kuromon y los neones de Dōtonbori.', a: '/es/osaka/' },
      { t: 'Nara y sus ciervos', d: 'El Gran Buda de Tōdai-ji y el parque, a 45 minutos de Osaka.', a: '/es/nara/' },
      { t: 'Otoño en Kioto', d: 'Los arces rojos de noviembre, saliendo temprano.', a: '/es/otono-kioto/' },
    ],
    final: { titulo: '¿Cuándo vienen?', texto: 'Decime fechas, cuántos son y dónde se alojan. Te contesto yo, Tony, normalmente el mismo día.', boton: 'Escribime por WhatsApp', principal: 'Ver la página principal' },
    saludo: 'Hola Tony, ¿cómo andás? Vamos desde Argentina y nos interesa un tour. Fechas: ', escribe: 'Escribime',
    foto: '/v8/zonas/kioto-arashiyama.jpg', fotoAlt: 'Bosque de bambú de Arashiyama, Kioto', touristType: 'Viajeros de Argentina',
  },
  rusia: {
    lang: 'ru', guia: 'larion', ruta: '/ru/from-russia/', inicio: '/ru/', locale: 'ru-RU', divisas: ['RUB'],
    seo: {
      titulo: 'Япония из России: частный гид на русском | Tony Kansai Guide',
      descripcion: 'Частный гид на русском в Киото, Осаке, Наре и Хиросиме: разница во времени, виза, перелёт, деньги, розетки и цены в рублях по сегодняшнему курсу.',
    },
    bandera: '🇷🇺', antetitulo: 'Для путешественников из России',
    titulo: 'Япония из России — с гидом на русском.',
    sub: 'Меня зовут Ларион. Встречаю вас в лобби отеля, и мы проводим день в Киото, Осаке, Наре или Хиросиме — только ваша группа. Без агентства: договариваетесь напрямую со мной в WhatsApp.',
    cta: 'Расскажите о поездке',
    practicoTitulo: 'Практичное — до вылета',
    practico: [
      { icono: '🕐', t: 'Время', d: 'Япония на 6 часов впереди Москвы, круглый год. Пишите в любое время: отвечу, как только здесь наступит утро.' },
      { icono: '🛂', t: 'Виза', d: 'Гражданам России для поездки в Японию нужна виза. Актуальные правила и документы уточняйте на сайте Посольства Японии в России до покупки билетов.' },
      { icono: '✈️', t: 'Как добраться до Кансая', d: 'Обычно летят с пересадкой — уточняйте маршруты у авиакомпаний. Из Токио синкансэн довезёт до Киото примерно за 2 часа 15 минут.' },
      { icono: '💴', t: 'Деньги', d: 'Российские карты Visa и Mastercard в Японии не работают — возьмите с собой наличные. Чаевые в Японии не оставляют нигде, в том числе гиду.' },
      { icono: '🔌', t: 'Розетки', d: 'В Японии вилки с двумя плоскими штырями (тип A) и 100 вольт: российская вилка не подойдёт, возьмите переходник. Зарядки телефонов и ноутбуков обычно рассчитаны на 100–240 В — проверьте надпись на блоке.' },
      { icono: '💳', t: 'Оплата экскурсии', d: 'Наличными в иенах в день экскурсии или переводом, если договоримся при бронировании.' },
    ],
    preciosTitulo: 'Цена за группу — в рублях по сегодняшнему курсу',
    planes: ['Полдня · 4 часа', 'Целый день · 8 часов'], porGrupo: 'за группу до 6 человек',
    porPersona: (y) => `Если вас четверо: ${y} с человека`,
    notas: ['Поезда, входные билеты и еда не включены — их вы оплачиваете на месте, я подскажу как.', 'Бесплатная отмена — не позднее чем за 72 часа.'],
    aprox: 'по сегодняшнему курсу',
    ideasTitulo: 'Идеи для вашего дня',
    ideas: [
      { t: 'Киото за один день', d: 'Фусими Инари до толп, Киёмидзу, Гион и Золотой павильон.', a: '/ru/kyoto/' },
      { t: 'Осака', d: 'Замок, рынок Куромон и неоновые вывески Дотонбори.', a: '/ru/osaka/' },
      { t: 'Нара и олени', d: 'Большой Будда в Тодай-дзи и парк, в 45 минутах от Осаки.', a: '/ru/nara/' },
      { t: 'Хиросима и Миядзима', d: 'Мемориал мира и знаменитые ворота тории в море.', a: '/ru/hiroshima/' },
    ],
    final: { titulo: 'Когда вы прилетаете?', texto: 'Напишите даты, сколько вас и где остановитесь. Отвечаю сам, обычно в тот же день.', boton: 'Написать в WhatsApp', principal: 'Главная страница' },
    saludo: 'Здравствуйте, Ларион! Мы летим из России и хотим экскурсию. Даты: ', escribe: 'Написать',
    foto: '/v7/fotos/miyajima.jpg', fotoAlt: 'Тории святилища Ицукусима, Миядзима', touristType: 'Путешественники из России',
  },
}

export const RUTAS_VIAJEROS: Record<string, MercadoId> = Object.fromEntries(
  Object.entries(MERCADOS).map(([id, m]) => [m.ruta.replace(/\/+$/, ''), id as MercadoId]),
)
