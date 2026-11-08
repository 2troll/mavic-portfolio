// Datos de la sección «Kansai de TikTok» (scripts/tiktok.mjs).
// Temporadas: solo de noviembre a abril (Tony quiere empujar viajes antes de abril).
// Fotos: las de /familias/foto (Wikimedia Commons, con su crédito en familias-fotos.json).
// Precio especial: SOLO el guiado; entradas, transporte y comidas aparte (regla del 8-11-2026).
// Nada de alcohol. Nada inventado: sin cifras de visitas de TikTok ni rankings.

export const PRECIO = { normal: 38000, tiktok: 30000, horas: 4 }
export const WHATSAPP = '34634193106'

export const UI = {
  es: {
    lang: 'es', dir: 'ltr', base: '/tiktok/',
    marca: 'Kansai de TikTok',
    titulo: 'Kansai de TikTok: los sitios virales de Kioto, Osaka y Nara por temporada',
    desc: 'Los sitios de Kioto, Osaka y Nara que más se ven en TikTok, temporada a temporada: qué grabar, a qué hora ir sin gente y una ruta con guía en español a precio especial.',
    eti: 'Guías por temporada · Kioto · Osaka · Nara',
    h1: 'El Kansai que ves en TikTok, sin colas y con guía.',
    intro: 'Los sitios que se hacen virales en TikTok son preciosos… y a las once de la mañana están llenos. Te llevo a la hora buena, te enseño el ángulo y te ayudo a grabar las tomas en las que sales tú.',
    temporadas: 'Elige temporada',
    oferta_eti: 'Precio especial TikTok',
    oferta_t: 'Ruta TikTok con guía',
    oferta_d: 'Media jornada de unas 4 horas por los sitios virales de la temporada, a la hora con menos gente. Te ayudo con los ángulos y te grabo las tomas en las que sales tú.',
    oferta_precio: 'por grupo',
    oferta_nota: 'Precio del guía. Entradas, transporte y comidas, aparte. Di «TikTok» al reservar.',
    hasta: 'Válido para viajes hasta el',
    reservar: 'Reservar por WhatsApp',
    msg: 'Hola, Tony. Vengo de la página de TikTok y quiero la Ruta TikTok de',
    toma: 'La toma', hora: 'Cuándo ir', truco: 'Truco de guía',
    otras: 'Otras temporadas',
    volver: 'Todas las temporadas',
    faq_t: 'Preguntas',
    faq: [
      ['¿Me grabas tú los vídeos?', 'Te ayudo con los ángulos y las horas, y grabo las tomas en las que sales tú con tu móvil. La edición y la publicación son tuyas.'],
      ['¿Qué incluye el precio especial?', 'El guiado: unas 4 horas de guía privado en español, para tu grupo. Las entradas, el transporte y las comidas se pagan aparte.'],
      ['¿Se puede combinar con otros sitios?', 'Sí. La ruta se adapta a lo que quieras grabar. Si quieres un día completo, te digo el precio al reservar.'],
      ['¿Hay comida halal en la ruta?', 'Sí. Puedo organizar la ruta con paradas de comida halal y lugares para rezar.'],
    ],
    credito: 'Fotos', inicio: 'Tony Kansai Guide', otrosIdiomas: 'Otros idiomas',
  },
  en: {
    lang: 'en', dir: 'ltr', base: '/tiktok/en/',
    marca: 'TikTok Kansai',
    titulo: 'TikTok Kansai: viral spots in Kyoto, Osaka and Nara by season',
    desc: 'The Kyoto, Osaka and Nara spots you keep seeing on TikTok, season by season: what to film, when to go without crowds, and a guided route at a special price.',
    eti: 'Seasonal guides · Kyoto · Osaka · Nara',
    h1: 'The Kansai you see on TikTok, without the queues.',
    intro: 'The spots that go viral on TikTok are beautiful… and packed by 11 a.m. I take you at the right time, show you the angle and help you film the shots you are in.',
    temporadas: 'Choose a season',
    oferta_eti: 'TikTok special price',
    oferta_t: 'Guided TikTok route',
    oferta_d: 'A half day of about 4 hours through the season’s viral spots, at the least crowded time. I help with angles and film the shots you appear in.',
    oferta_precio: 'per group',
    oferta_nota: 'Guide fee only. Tickets, transport and meals are extra. Mention “TikTok” when you book.',
    hasta: 'Valid for trips until',
    reservar: 'Book on WhatsApp',
    msg: 'Hi Tony, I found you through the TikTok page and would like the TikTok route for',
    toma: 'The shot', hora: 'When to go', truco: 'Guide’s tip',
    otras: 'Other seasons',
    volver: 'All seasons',
    faq_t: 'Questions',
    faq: [
      ['Will you film the videos for me?', 'I help with angles and timing, and film the shots you appear in on your phone. Editing and posting are up to you.'],
      ['What does the special price include?', 'The guiding: about 4 hours of private guide for your group. Tickets, transport and meals are paid separately.'],
      ['Can we add other places?', 'Yes. The route adapts to what you want to film. For a full day, I’ll give you the price when you book.'],
      ['Is there halal food on the route?', 'Yes. I can plan the route with halal food stops and places to pray.'],
    ],
    credito: 'Photos', inicio: 'Tony Kansai Guide', otrosIdiomas: 'Other languages',
  },
  ar: {
    lang: 'ar', dir: 'rtl', base: '/tiktok/ar/',
    marca: 'كانساي تيك توك',
    titulo: 'كانساي تيك توك: الأماكن الأكثر انتشاراً في كيوتو وأوساكا ونارا حسب الموسم',
    desc: 'أماكن كيوتو وأوساكا ونارا التي تراها دائماً على تيك توك، موسماً بموسم: ماذا تصوّر، ومتى تذهب دون زحام، وجولة مع مرشد بسعر خاص.',
    eti: 'أدلة حسب الموسم · كيوتو · أوساكا · نارا',
    h1: 'كانساي الذي تراه على تيك توك، بلا طوابير ومع مرشد.',
    intro: 'الأماكن التي تنتشر على تيك توك جميلة… لكنها تمتلئ بحلول الحادية عشرة صباحاً. آخذك في الوقت المناسب، وأريك الزاوية، وأساعدك في تصوير اللقطات التي تظهر فيها.',
    temporadas: 'اختر الموسم',
    oferta_eti: 'سعر خاص لتيك توك',
    oferta_t: 'جولة تيك توك مع مرشد',
    oferta_d: 'نصف يوم لنحو 4 ساعات في أماكن الموسم الأكثر انتشاراً، في أقل الأوقات ازدحاماً. أساعدك في الزوايا وأصوّر اللقطات التي تظهر فيها.',
    oferta_precio: 'للمجموعة',
    oferta_nota: 'أجرة المرشد فقط. التذاكر والمواصلات والوجبات على حسابك. اذكر «تيك توك» عند الحجز.',
    hasta: 'صالح للرحلات حتى',
    reservar: 'احجز عبر واتساب',
    msg: 'مرحباً توني، وصلت من صفحة تيك توك وأريد جولة تيك توك في موسم',
    toma: 'اللقطة', hora: 'متى تذهب', truco: 'نصيحة المرشد',
    otras: 'مواسم أخرى',
    volver: 'كل المواسم',
    faq_t: 'أسئلة',
    faq: [
      ['هل تصوّر الفيديوهات بدلاً مني؟', 'أساعدك في الزوايا والتوقيت، وأصوّر بهاتفك اللقطات التي تظهر فيها. أما المونتاج والنشر فعليك.'],
      ['ماذا يشمل السعر الخاص؟', 'الإرشاد: نحو 4 ساعات مع مرشد خاص لمجموعتك. التذاكر والمواصلات والوجبات تُدفع على حدة.'],
      ['هل يمكن إضافة أماكن أخرى؟', 'نعم. تتكيّف الجولة مع ما تريد تصويره. وإن أردت يوماً كاملاً أخبرك بالسعر عند الحجز.'],
      ['هل يوجد طعام حلال في الجولة؟', 'نعم. يمكنني تنظيم الجولة مع محطات طعام حلال وأماكن للصلاة.'],
    ],
    credito: 'الصور', inicio: 'Tony Kansai Guide', otrosIdiomas: 'لغات أخرى',
  },
}

// Cada temporada: slug por idioma, foto de portada, fecha límite de la oferta y 6 sitios.
export const TEMPORADAS = [
  {
    id: 'otono', slug: { es: 'otono', en: 'autumn', ar: 'autumn' }, foto: 'momiji', hasta: '2026-12-07',
    t: {
      es: { nombre: 'Otoño', meses: 'Noviembre · principios de diciembre', h1: 'Arces rojos de TikTok: el otoño de Kioto', intro: 'El momiji es el momento estrella del año en Kioto. Los arces se encienden de rojo de mediados de noviembre a principios de diciembre, y en TikTok no se habla de otra cosa.' },
      en: { nombre: 'Autumn', meses: 'November · early December', h1: 'TikTok’s red maples: Kyoto in autumn', intro: 'Momiji is Kyoto’s headline season. Maples turn red from mid-November to early December, and it is all over TikTok.' },
      ar: { nombre: 'الخريف', meses: 'نوفمبر · أوائل ديسمبر', h1: 'أشجار القيقب الحمراء على تيك توك: خريف كيوتو', intro: 'موسم المومِجي هو نجم العام في كيوتو. تحمرّ أشجار القيقب من منتصف نوفمبر إلى أوائل ديسمبر، ويمتلئ تيك توك بصورها.' },
    },
    sitios: [
      { foto: 'momiji', es: ['Eikan-dō de noche', 'El estanque que refleja los arces iluminados: el plano espejo.', 'Iluminación nocturna de otoño; entra nada más abrir.', 'Graba el reflejo agachado, con el móvil casi tocando el agua.'], en: ['Eikan-dō at night', 'The pond reflecting the lit-up maples: the mirror shot.', 'Autumn night illumination; go right at opening.', 'Crouch and film the reflection with your phone almost touching the water.'], ar: ['إيكان-دو ليلاً', 'البركة التي تعكس أشجار القيقب المضاءة: لقطة المرآة.', 'إضاءة الخريف الليلية؛ ادخل فور الافتتاح.', 'انحنِ وصوّر الانعكاس والهاتف يكاد يلامس الماء.'] },
      { foto: 'kioto', es: ['Kiyomizu-dera', 'La terraza de madera flotando sobre un mar de arces.', 'A primera hora o en la iluminación nocturna de otoño.', 'El plano bueno es desde el mirador de enfrente, no desde la terraza.'], en: ['Kiyomizu-dera', 'The wooden stage floating over a sea of maples.', 'First thing in the morning or at the autumn night illumination.', 'The best shot is from the viewpoint opposite, not from the stage itself.'], ar: ['كيوميزو-ديرا', 'الشرفة الخشبية تطفو فوق بحر من القيقب.', 'في الصباح الباكر أو في إضاءة الخريف الليلية.', 'أفضل لقطة من نقطة المشاهدة المقابلة، لا من الشرفة نفسها.'] },
      { foto: 'arashiyama', es: ['Bosque de bambú de Arashiyama', 'El túnel de bambú y el río con los montes rojos.', 'Antes de las 8:00; después es un pasillo de gente.', 'Combínalo con el puente Togetsukyō: arces detrás y río delante.'], en: ['Arashiyama bamboo grove', 'The bamboo tunnel, and the river with red hills.', 'Before 8:00; after that it is a corridor of people.', 'Pair it with Togetsukyō Bridge: maples behind, river in front.'], ar: ['غابة الخيزران في أراشيياما', 'نفق الخيزران، والنهر مع التلال الحمراء.', 'قبل الثامنة صباحاً؛ بعدها يصبح ممراً مزدحماً.', 'اجمعها مع جسر توغيتسوكيو: القيقب خلفك والنهر أمامك.'] },
      { foto: 'nara', es: ['Ciervos de Nara', 'El ciervo que te hace la reverencia… entre hojas rojas.', 'Por la mañana, cuando los ciervos están más tranquilos.', 'Inclina tú la cabeza despacio y muchos ciervos te la devuelven.'], en: ['Nara’s deer', 'The deer that bows to you… among red leaves.', 'In the morning, when the deer are calmest.', 'Bow your head slowly and many deer bow back.'], ar: ['غزلان نارا', 'الغزال الذي ينحني لك… بين الأوراق الحمراء.', 'في الصباح حين تكون الغزلان أهدأ.', 'انحنِ برأسك ببطء، وكثير من الغزلان تردّ الانحناءة.'] },
      { foto: 'fushimi', es: ['Fushimi Inari', 'El túnel infinito de torii naranjas.', 'Al amanecer o al anochecer; sube más allá de la mitad.', 'A partir del mirador de Yotsutsuji casi no queda gente.'], en: ['Fushimi Inari', 'The endless tunnel of orange torii gates.', 'At sunrise or dusk; climb past the halfway point.', 'Beyond the Yotsutsuji viewpoint the crowds almost disappear.'], ar: ['فوشيمي إيناري', 'نفق لا ينتهي من بوابات التوري البرتقالية.', 'عند الشروق أو الغروب؛ اصعد إلى ما بعد منتصف الطريق.', 'بعد نقطة يوتسوتسوجي يكاد الزحام يختفي.'] },
      { foto: 'calle-tradicional', es: ['Sannenzaka y Ninenzaka', 'La cuesta de casas de madera con la pagoda Yasaka al fondo.', 'Muy temprano, antes de que abran las tiendas.', 'Es el sitio clásico para el vídeo en kimono: te digo dónde alquilarlo.'], en: ['Sannenzaka and Ninenzaka', 'The slope of wooden houses with Yasaka Pagoda behind.', 'Very early, before the shops open.', 'The classic spot for a kimono video: I’ll tell you where to rent one.'], ar: ['سانينزاكا ونينينزاكا', 'المنحدر ذو البيوت الخشبية وخلفه باغودا ياساكا.', 'في وقت مبكر جداً قبل أن تفتح المحلات.', 'المكان الكلاسيكي لفيديو الكيمونو: أدلّك على مكان استئجاره.'] },
    ],
  },
  {
    id: 'invierno', slug: { es: 'invierno', en: 'winter', ar: 'winter' }, foto: 'fushimi', hasta: '2027-02-28',
    t: {
      es: { nombre: 'Invierno', meses: 'Diciembre · enero · febrero', h1: 'Luces, nieve y matcha: el invierno de TikTok', intro: 'El invierno es la temporada secreta de Kansai: menos gente, iluminaciones por la noche y, si hay suerte, Kioto nevado. Los vídeos de templos con nieve son de lo más buscado.' },
      en: { nombre: 'Winter', meses: 'December · January · February', h1: 'Lights, snow and matcha: TikTok’s winter', intro: 'Winter is Kansai’s secret season: fewer people, night illuminations and, with luck, snowy Kyoto. Snowy temple videos are among the most searched.' },
      ar: { nombre: 'الشتاء', meses: 'ديسمبر · يناير · فبراير', h1: 'أضواء وثلج وماتشا: شتاء تيك توك', intro: 'الشتاء هو الموسم السري في كانساي: زحام أقل، وإضاءات ليلية، ومع بعض الحظ كيوتو تحت الثلج. فيديوهات المعابد المغطاة بالثلج من أكثر ما يُبحث عنه.' },
    },
    sitios: [
      { foto: null, tono: 'nieve', es: ['Kioto nevado', 'El Pabellón Dorado o Kiyomizu con nieve: la toma más buscada del invierno.', 'La mañana después de una nevada; no nieva todos los años.', 'Sigo el pronóstico contigo y, si nieva, cambiamos la ruta esa misma mañana.'], en: ['Snowy Kyoto', 'The Golden Pavilion or Kiyomizu under snow: winter’s most wanted shot.', 'The morning after snowfall; it does not snow every year.', 'I watch the forecast with you and, if it snows, we switch the route that morning.'], ar: ['كيوتو تحت الثلج', 'الجناح الذهبي أو كيوميزو مغطّى بالثلج: أكثر لقطة مطلوبة في الشتاء.', 'صباح اليوم التالي لتساقط الثلج؛ لا يتساقط كل عام.', 'أتابع معك التوقعات، وإن نزل الثلج نغيّر الجولة في الصباح نفسه.'] },
      { foto: 'fushimi', es: ['Fushimi Inari al anochecer', 'Los torii iluminados por los farolillos, casi sin nadie.', 'Al caer la tarde: en invierno anochece pronto.', 'Lleva ropa de abrigo: arriba hace bastante más frío.'], en: ['Fushimi Inari at dusk', 'The torii lit by lanterns, almost empty.', 'Late afternoon: in winter it gets dark early.', 'Wrap up warm: it is much colder higher up.'], ar: ['فوشيمي إيناري عند الغروب', 'بوابات التوري المضاءة بالفوانيس، شبه خالية.', 'آخر النهار: في الشتاء يحلّ الظلام مبكراً.', 'ارتدِ ملابس دافئة: الجو أبرد بكثير في الأعلى.'] },
      { foto: 'osaka', es: ['Osaka iluminada', 'Iluminaciones de invierno y el castillo de Osaka de noche.', 'Diciembre por la noche; te digo las fechas de cada año.', 'Termina en Dōtonbori con takoyaki recién hecho: el vídeo de comida perfecto.'], en: ['Osaka lit up', 'Winter illuminations and Osaka Castle at night.', 'December evenings; I’ll confirm each year’s dates.', 'Finish in Dōtonbori with fresh takoyaki: the perfect food video.'], ar: ['أوساكا المضاءة', 'إضاءات الشتاء وقلعة أوساكا ليلاً.', 'أمسيات ديسمبر؛ أؤكد لك مواعيد كل عام.', 'اختم في دوتونبوري مع تاكوياكي طازج: فيديو الطعام المثالي.'] },
      { foto: 'arashiyama', es: ['Arashiyama sin gente', 'El bambú en silencio, sin la multitud del otoño.', 'Por la mañana; en invierno la luz es suave todo el día.', 'Es la mejor época para grabar el bambú solo: aprovecha.'], en: ['Arashiyama without crowds', 'The bamboo in silence, without the autumn crowds.', 'In the morning; winter light is soft all day.', 'The best time of year to film the bamboo empty: make the most of it.'], ar: ['أراشيياما بلا زحام', 'الخيزران في صمت، بعيداً عن زحام الخريف.', 'في الصباح؛ ضوء الشتاء ناعم طوال اليوم.', 'أفضل وقت في السنة لتصوير الخيزران خالياً: استغلّه.'] },
      { foto: null, tono: 'matcha', es: ['Matcha en Uji', 'El matcha caliente de Uji, la cuna del té japonés.', 'Cualquier día de invierno, mejor entre semana.', 'El matcha escasea y está de moda: te llevo a casas de té de verdad.'], en: ['Matcha in Uji', 'Hot matcha in Uji, the home of Japanese tea.', 'Any winter day, ideally a weekday.', 'Matcha is scarce and trending: I take you to real tea houses.'], ar: ['ماتشا في أوجي', 'ماتشا ساخنة في أوجي، موطن الشاي الياباني.', 'أي يوم شتوي، والأفضل في أيام الأسبوع.', 'الماتشا نادرة ورائجة الآن: آخذك إلى بيوت شاي حقيقية.'] },
      { foto: 'nara', es: ['Nara en invierno', 'Los ciervos con su pelaje de invierno frente al Tōdai-ji.', 'Por la mañana, con el parque tranquilo.', 'Compra las galletas para ciervos y guárdalas: si las ven, te rodean.'], en: ['Nara in winter', 'The deer in their winter coats in front of Tōdai-ji.', 'In the morning, when the park is quiet.', 'Buy deer crackers and keep them hidden: if the deer see them, they surround you.'], ar: ['نارا في الشتاء', 'الغزلان بفرائها الشتوي أمام معبد تودائي-جي.', 'في الصباح حين تكون الحديقة هادئة.', 'اشترِ بسكويت الغزلان وأخفِه: إن رأته الغزلان ستحيط بك.'] },
    ],
  },
  {
    id: 'primavera', slug: { es: 'primavera', en: 'spring', ar: 'spring' }, foto: 'sakura', hasta: '2027-04-15',
    t: {
      es: { nombre: 'Primavera', meses: 'Finales de marzo · principios de abril', h1: 'Sakura de TikTok: la primavera de Kioto y Osaka', intro: 'La floración del cerezo dura apenas dos semanas y es el momento más grabado del año en Japón. Hay que saber dónde ir y a qué hora para no salir rodeado de gente.' },
      en: { nombre: 'Spring', meses: 'Late March · early April', h1: 'TikTok’s sakura: Kyoto and Osaka in spring', intro: 'Cherry blossom lasts barely two weeks and is the most filmed moment of the year in Japan. You need to know where and when to go to avoid crowds.' },
      ar: { nombre: 'الربيع', meses: 'أواخر مارس · أوائل أبريل', h1: 'ساكورا تيك توك: ربيع كيوتو وأوساكا', intro: 'يدوم تفتّح أزهار الكرز أسبوعين بالكاد، وهو أكثر لحظة تُصوَّر في اليابان. عليك أن تعرف أين ومتى تذهب لتتجنّب الزحام.' },
    },
    sitios: [
      { foto: 'sakura', es: ['Canal de Okazaki', 'Los cerezos sobre el agua del canal, a veces con barcas.', 'Primera hora de la mañana en plena floración.', 'Desde el puente se graba el túnel de flores sobre el agua.'], en: ['Okazaki Canal', 'Cherry trees over the canal, sometimes with boats.', 'Early morning at full bloom.', 'From the bridge you can film the tunnel of blossom over the water.'], ar: ['قناة أوكازاكي', 'أشجار الكرز فوق مياه القناة، وأحياناً مع القوارب.', 'الصباح الباكر في ذروة التفتّح.', 'من الجسر يمكنك تصوير نفق الأزهار فوق الماء.'] },
      { foto: 'osaka', es: ['Castillo de Osaka', 'El castillo blanco y dorado rodeado de cerezos.', 'Al abrir el parque o al atardecer.', 'Busca el ángulo desde el foso: castillo arriba, flores abajo.'], en: ['Osaka Castle', 'The white and gold castle surrounded by cherry trees.', 'At park opening or at sunset.', 'Shoot from the moat: castle above, blossoms below.'], ar: ['قلعة أوساكا', 'القلعة البيضاء والذهبية محاطة بأشجار الكرز.', 'عند افتتاح الحديقة أو عند الغروب.', 'صوّر من جهة الخندق: القلعة فوق والأزهار تحت.'] },
      { foto: 'kioto', es: ['Kiyomizu-dera en flor', 'La terraza sobre las copas rosas de los cerezos.', 'A primera hora o en la iluminación nocturna de primavera.', 'Ven entre semana: el fin de semana de floración es imposible.'], en: ['Kiyomizu-dera in bloom', 'The stage above pink cherry treetops.', 'First thing or at the spring night illumination.', 'Come on a weekday: peak-bloom weekends are impossible.'], ar: ['كيوميزو-ديرا مزهراً', 'الشرفة فوق قمم أشجار الكرز الوردية.', 'في الصباح الباكر أو في إضاءة الربيع الليلية.', 'تعال في أيام الأسبوع: عطلات ذروة التفتّح مستحيلة.'] },
      { foto: 'calle-tradicional', es: ['Kimono entre cerezos', 'Paseo en kimono por las cuestas de Higashiyama con flores.', 'Muy temprano; reserva el kimono con antelación.', 'En primavera los alquileres de kimono se llenan: te ayudo a reservar.'], en: ['Kimono among cherry blossoms', 'A kimono walk through Higashiyama’s slopes in bloom.', 'Very early; book the kimono in advance.', 'Kimono rentals fill up in spring: I’ll help you book.'], ar: ['الكيمونو بين أزهار الكرز', 'نزهة بالكيمونو في منحدرات هيغاشيياما المزهرة.', 'في وقت مبكر جداً؛ احجز الكيمونو مسبقاً.', 'تمتلئ محلات تأجير الكيمونو في الربيع: أساعدك في الحجز.'] },
      { foto: 'nara', es: ['Ciervos y sakura en Nara', 'Ciervos tumbados bajo los cerezos del parque.', 'Por la mañana, antes de los grupos.', 'La toma ganadora: un ciervo y un pétalo cayendo. Paciencia.'], en: ['Deer and sakura in Nara', 'Deer lying under the park’s cherry trees.', 'In the morning, before tour groups.', 'The winning shot: a deer and a falling petal. Patience.'], ar: ['الغزلان والساكورا في نارا', 'غزلان مستلقية تحت أشجار الكرز في الحديقة.', 'في الصباح قبل المجموعات السياحية.', 'اللقطة الرابحة: غزال وبتلة تتساقط. الصبر.'] },
      { foto: 'arashiyama', es: ['Arashiyama en primavera', 'Los montes salpicados de cerezos sobre el río Katsura.', 'Por la mañana; el bambú, antes de las 8:00.', 'Las barcas del río dan un plano distinto al de todo el mundo.'], en: ['Arashiyama in spring', 'Hills dotted with cherry trees above the Katsura River.', 'In the morning; the bamboo before 8:00.', 'The river boats give you a shot nobody else has.'], ar: ['أراشيياما في الربيع', 'تلال تتناثر فيها أشجار الكرز فوق نهر كاتسورا.', 'في الصباح؛ والخيزران قبل الثامنة.', 'قوارب النهر تمنحك لقطة مختلفة عن الجميع.'] },
    ],
  },
]
