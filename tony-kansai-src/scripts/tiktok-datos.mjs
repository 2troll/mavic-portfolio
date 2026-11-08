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
    marca: 'Japón de TikTok',
    titulo: 'Japón de TikTok: sitios virales y joyas escondidas por temporada',
    desc: 'Los sitios de Japón que más se ven y se guardan en TikTok, temporada a temporada: los clásicos de Kioto, Osaka y Nara a la hora sin gente, y jardines, flores y paisajes de todo Japón que casi nadie visita. Ruta con guía a precio especial.',
    eti: 'Guías por temporada · Kansai y todo Japón',
    h1: 'El Japón que ves en TikTok, sin colas y con guía.',
    intro: 'Los sitios que se hacen virales son preciosos… y a las once de la mañana están llenos. Te llevo a la hora buena y te ayudo a grabar. Y además, los rincones de todo Japón que la gente guarda y casi nadie visita.',
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
    marca: 'TikTok Japan',
    titulo: 'TikTok Japan: viral spots and hidden gems by season',
    desc: 'The Japan spots people watch and save on TikTok, season by season: Kyoto, Osaka and Nara classics without the crowds, plus gardens, flowers and landscapes across Japan that almost nobody visits. Guided route at a special price.',
    eti: 'Seasonal guides · Kansai and all of Japan',
    h1: 'The Japan you see on TikTok, without the queues.',
    intro: 'Viral spots are beautiful… and packed by 11 a.m. I take you at the right time and help you film. Plus the corners of Japan people save and almost nobody visits.',
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
    marca: 'يابان تيك توك',
    titulo: 'يابان تيك توك: الأماكن الأكثر انتشاراً والجواهر المخفية حسب الموسم',
    desc: 'أماكن كيوتو وأوساكا ونارا التي تراها دائماً على تيك توك، موسماً بموسم: ماذا تصوّر، ومتى تذهب دون زحام، وجولة مع مرشد بسعر خاص.',
    eti: 'أدلة حسب الموسم · كانساي وكل اليابان',
    h1: 'اليابان الذي تراه على تيك توك، بلا طوابير ومع مرشد.',
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

// «Joyas de todo Japón»: rincones fotogénicos poco conocidos, fuera del circuito típico.
// Cada joya: [nombre, dónde · cuándo, por qué se guarda, cómo ir / truco]. Fechas = las habituales; varían cada año.
export const JOYAS_UI = {
  es: { eti: 'Joyas de todo Japón', titulo: 'Lo que la gente guarda… y casi nadie visita', intro: 'Jardines, flores y paisajes de todo Japón que salen en los vídeos guardados y no en los circuitos de siempre.', donde: 'Dónde y cuándo', porque: 'Por qué se guarda', ir: 'Cómo ir', cta: 'Te ayudo a meterlo en tu ruta', cta_d: 'En Kansai te guío yo; fuera de Kansai te ayudo con el plan y te pongo en contacto con guías del equipo.' },
  en: { eti: 'Hidden gems across Japan', titulo: 'What people save… and almost nobody visits', intro: 'Gardens, flowers and landscapes from all over Japan that show up in saved videos, not on the usual tours.', donde: 'Where and when', porque: 'Why people save it', ir: 'Getting there', cta: 'I’ll help you fit it into your trip', cta_d: 'In Kansai I guide you myself; elsewhere I help with the plan and connect you with guides from our team.' },
  ar: { eti: 'جواهر من كل اليابان', titulo: 'ما يحفظه الناس… ولا يزوره أحد تقريباً', intro: 'حدائق وزهور ومناظر من كل أنحاء اليابان تظهر في الفيديوهات المحفوظة، لا في الجولات المعتادة.', donde: 'أين ومتى', porque: 'لماذا يحفظه الناس', ir: 'كيف تصل', cta: 'أساعدك على إدخاله في رحلتك', cta_d: 'في كانساي أرشدك بنفسي؛ وخارجها أساعدك في الخطة وأصلك بمرشدين من فريقنا.' },
}

export const JOYAS = {
  otono: [
    { es: ['Rurikō-in', 'Kioto (Yase) · solo abre en temporadas especiales, el otoño es la más buscada', 'El reflejo de los arces rojos sobre una mesa lacada negra: parece un cuadro.', 'Tren Eizan desde Demachiyanagi. Hay que reservar turno: se agotan.'], en: ['Rurikō-in', 'Kyoto (Yase) · opens only in special seasons; autumn is the most wanted', 'Red maples reflected on a black lacquered desk: it looks like a painting.', 'Eizan line from Demachiyanagi. Timed tickets sell out — book ahead.'], ar: ['روريكو-إن', 'كيوتو (ياسيه) · يفتح في مواسم خاصة فقط، والخريف أكثرها طلباً', 'انعكاس القيقب الأحمر على طاولة مطليّة سوداء: كأنها لوحة.', 'قطار إيزان من ديماتشيياناغي. التذاكر بمواعيد وتنفد سريعاً: احجز مسبقاً.'] },
    { es: ['Kōrankei', 'Aichi (Toyota) · segunda quincena de noviembre', 'Un valle entero de arces junto a un puente rojo, iluminado por la noche.', 'Bus desde Nagoya; a primera hora para evitar los atascos del fin de semana.'], en: ['Kōrankei', 'Aichi (Toyota) · second half of November', 'A whole valley of maples beside a red bridge, lit up at night.', 'Bus from Nagoya; go early to avoid weekend traffic jams.'], ar: ['كورانكي', 'آيتشي (تويوتا) · النصف الثاني من نوفمبر', 'وادٍ كامل من القيقب بجانب جسر أحمر، مضاء ليلاً.', 'حافلة من ناغويا؛ اذهب مبكراً لتجنّب زحام نهاية الأسبوع.'] },
    { es: ['Kenroku-en con yukitsuri', 'Kanazawa (Ishikawa) · desde noviembre', 'Las cuerdas en forma de paraguas que protegen los pinos de la nieve: una imagen única.', 'Shinkansen o tren Thunderbird desde Osaka; combínalo con el barrio de geishas Higashi Chaya.'], en: ['Kenroku-en with yukitsuri', 'Kanazawa (Ishikawa) · from November', 'Umbrella-shaped ropes protecting the pines from snow: a one-of-a-kind image.', 'Train from Osaka; pair it with the Higashi Chaya geisha district.'], ar: ['كينروكو-إن مع يوكيتسوري', 'كانازاوا (إيشيكاوا) · من نوفمبر', 'حبال على شكل مظلّة تحمي أشجار الصنوبر من الثلج: مشهد فريد.', 'قطار من أوساكا؛ واجمعها مع حي الغيشا هيغاشي تشايا.'] },
    { es: ['Daigo-ji y su puente Bentendō', 'Kioto (Fushimi) · mediados y finales de noviembre', 'El puente rojo y el pabellón reflejados en un estanque rodeado de arces.', 'Metro Tōzai hasta Daigo. Mucha menos gente que en el centro de Kioto.'], en: ['Daigo-ji and the Bentendō bridge', 'Kyoto (Fushimi) · mid to late November', 'The red bridge and hall reflected in a pond ringed with maples.', 'Tōzai subway to Daigo. Far fewer people than central Kyoto.'], ar: ['دايغو-جي وجسر بنتندو', 'كيوتو (فوشيمي) · منتصف وأواخر نوفمبر', 'الجسر الأحمر والجناح ينعكسان في بركة تحيط بها أشجار القيقب.', 'مترو توزاي حتى دايغو. زحام أقل بكثير من وسط كيوتو.'] },
    { es: ['Hōkyō-in', 'Kioto (Arashiyama) · noviembre', 'Una alfombra de hojas rojas en un jardín pequeño y silencioso, a pocos minutos del bambú.', 'Desde la estación de Saga-Arashiyama, a pie. Ideal después del bosque de bambú.'], en: ['Hōkyō-in', 'Kyoto (Arashiyama) · November', 'A carpet of red leaves in a small, silent garden, minutes from the bamboo.', 'Walk from Saga-Arashiyama station. Perfect after the bamboo grove.'], ar: ['هوكيو-إن', 'كيوتو (أراشيياما) · نوفمبر', 'سجادة من الأوراق الحمراء في حديقة صغيرة هادئة، على بعد دقائق من الخيزران.', 'سيراً من محطة ساغا-أراشيياما. مثالية بعد غابة الخيزران.'] },
    { es: ['Momijidani en Miyajima', 'Hiroshima · mediados y finales de noviembre', 'El valle de arces detrás del torii flotante, con ciervos paseando.', 'Ferry desde Miyajimaguchi. Hazlo en el mismo día que Hiroshima: museo por la mañana, isla por la tarde.'], en: ['Momijidani on Miyajima', 'Hiroshima · mid to late November', 'The maple valley behind the floating torii, with deer wandering around.', 'Ferry from Miyajimaguchi. Same day as Hiroshima: museum in the morning, island in the afternoon.'], ar: ['موميجيداني في مياجيما', 'هيروشيما · منتصف وأواخر نوفمبر', 'وادي القيقب خلف بوابة التوري العائمة، والغزلان تتجول.', 'عبّارة من مياجيماغوتشي. في اليوم نفسه مع هيروشيما: المتحف صباحاً والجزيرة بعد الظهر.'] },
  ],
  invierno: [
    { es: ['Ginzan Onsen', 'Yamagata · diciembre a febrero', 'Ryokan de madera, nieve y farolas de gas a lo largo de un río: el pueblo de los vídeos de invierno.', 'Por la tarde-noche el acceso para quien no se aloja suele estar limitado: duerme allí o ve de día. Compruébalo antes.'], en: ['Ginzan Onsen', 'Yamagata · December to February', 'Wooden ryokan, snow and gas lamps along a river: the village from all the winter videos.', 'Evening access for non-guests is usually restricted: stay overnight or go by day. Check before going.'], ar: ['غينزان أونسن', 'ياماغاتا · من ديسمبر إلى فبراير', 'نُزُل خشبية وثلج ومصابيح غاز على ضفّة نهر: قرية فيديوهات الشتاء.', 'الدخول مساءً لغير النزلاء محدود عادةً: ابقَ فيها ليلة أو اذهب نهاراً. تحقّق قبل الذهاب.'] },
    { es: ['Nabana no Sato', 'Mie (Kuwana) · iluminación de otoño a primavera', 'Un túnel de luces de 200 metros y paisajes enteros hechos con LED.', 'Unas 2 horas desde Osaka por Nagoya. Ve al anochecer para ver el cambio de luz.'], en: ['Nabana no Sato', 'Mie (Kuwana) · illumination from autumn to spring', 'A 200-metre tunnel of lights and whole landscapes made of LEDs.', 'About 2 hours from Osaka via Nagoya. Go at dusk to see the light change.'], ar: ['نابانا نو ساتو', 'مييه (كوانا) · إضاءة من الخريف إلى الربيع', 'نفق أضواء بطول 200 متر ومناظر كاملة مصنوعة من الأضواء.', 'نحو ساعتين من أوساكا عبر ناغويا. اذهب عند الغروب لترى تبدّل الضوء.'] },
    { es: ['Shirakawa-go iluminado', 'Gifu · algunos días de enero y febrero', 'Las casas de tejado de paja bajo la nieve, iluminadas de noche.', 'Solo unas pocas noches al año y con reserva previa: hay que organizarlo con meses.'], en: ['Shirakawa-go lit up', 'Gifu · a few days in January and February', 'Thatched-roof houses under snow, lit up at night.', 'Only a few nights a year and by prior reservation: plan months ahead.'], ar: ['شيراكاوا-غو المضاءة', 'غيفو · بضعة أيام في يناير وفبراير', 'بيوت بأسقف من القش تحت الثلج، مضاءة ليلاً.', 'بضع ليالٍ فقط في السنة وبحجز مسبق: خطّط قبلها بأشهر.'] },
    { es: ['Los «monstruos de nieve» de Zaō', 'Yamagata · enero y febrero', 'Árboles cubiertos de hielo que parecen criaturas: el juhyō.', 'Teleférico desde Zaō Onsen; abrígate mucho, arriba hace muchísimo frío.'], en: ['Zaō’s “snow monsters”', 'Yamagata · January and February', 'Ice-covered trees that look like creatures: the juhyō.', 'Ropeway from Zaō Onsen; dress very warmly, it is bitterly cold at the top.'], ar: ['«وحوش الثلج» في زاو', 'ياماغاتا · يناير وفبراير', 'أشجار يغطيها الجليد فتبدو كالمخلوقات: الجوهيو.', 'تلفريك من زاو أونسن؛ البس ملابس دافئة جداً، فالبرد قارس في الأعلى.'] },
    { es: ['Kawazu-zakura', 'Shizuoka (península de Izu) · febrero y principios de marzo', 'Los primeros cerezos del año, rosa intenso, junto a un río con flores amarillas de colza.', 'Tren desde Atami. Es sakura en febrero: perfecto si no puedes venir en abril.'], en: ['Kawazu-zakura', 'Shizuoka (Izu Peninsula) · February and early March', 'The year’s first cherry blossoms, deep pink, by a river lined with yellow rapeseed.', 'Train from Atami. Sakura in February: perfect if you can’t come in April.'], ar: ['كاوازو-زاكورا', 'شيزوكا (شبه جزيرة إيزو) · فبراير وأوائل مارس', 'أولى أزهار الكرز في العام، وردية داكنة، بجانب نهر تحفّه أزهار اللفت الصفراء.', 'قطار من أتامي. ساكورا في فبراير: مثالية إن لم تستطع المجيء في أبريل.'] },
    { es: ['Ciruelos de Kitano Tenmangū', 'Kioto · febrero y marzo', 'Unos 1.500 ciruelos en flor alrededor de un santuario, antes que los cerezos.', 'Bus desde la estación de Kioto. Combínalo con el Pabellón Dorado, que está cerca.'], en: ['Kitano Tenmangū plum blossoms', 'Kyoto · February and March', 'Around 1,500 plum trees in bloom around a shrine, before the cherries.', 'Bus from Kyoto Station. Pair it with the nearby Golden Pavilion.'], ar: ['أزهار البرقوق في كيتانو تينمانغو', 'كيوتو · فبراير ومارس', 'نحو 1500 شجرة برقوق مزهرة حول ضريح، قبل أزهار الكرز.', 'حافلة من محطة كيوتو. واجمعها مع الجناح الذهبي القريب.'] },
  ],
  primavera: [
    { es: ['Pagoda Chūreitō y el Fuji', 'Yamanashi · principios y mediados de abril', 'La pagoda roja, los cerezos y el monte Fuji en la misma foto.', 'Sube los casi 400 escalones al amanecer: el Fuji se ve más despejado por la mañana.'], en: ['Chūreitō Pagoda and Mt Fuji', 'Yamanashi · early to mid April', 'The red pagoda, cherry blossoms and Mount Fuji in one shot.', 'Climb the nearly 400 steps at sunrise: Fuji is usually clearest in the morning.'], ar: ['باغودا تشوريتو وجبل فوجي', 'ياماناشي · أوائل ومنتصف أبريل', 'الباغودا الحمراء وأزهار الكرز وجبل فوجي في صورة واحدة.', 'اصعد نحو 400 درجة عند الشروق: يكون فوجي أوضح عادةً في الصباح.'] },
    { es: ['Monte Yoshino', 'Nara · principios y mediados de abril', 'Miles de cerezos que florecen montaña arriba en varias capas.', 'Tren Kintetsu desde Osaka. Llega pronto: las flores suben de abajo a arriba en dos semanas.'], en: ['Mount Yoshino', 'Nara · early to mid April', 'Thousands of cherry trees blooming up the mountain in layers.', 'Kintetsu train from Osaka. Arrive early: blossoms climb from bottom to top over two weeks.'], ar: ['جبل يوشينو', 'نارا · أوائل ومنتصف أبريل', 'آلاف أشجار الكرز تتفتّح صعوداً في الجبل على طبقات.', 'قطار كينتيتسو من أوساكا. تعال مبكراً: تصعد الأزهار من الأسفل إلى الأعلى خلال أسبوعين.'] },
    { es: ['Torii en el lago de Shirahige', 'Shiga (lago Biwa) · todo el año, mejor al amanecer', 'Un torii rojo dentro del agua del lago más grande de Japón.', 'Tren JR Kosei desde Kioto. No cruces la carretera para la foto: hay mirador seguro.'], en: ['Shirahige’s lake torii', 'Shiga (Lake Biwa) · all year, best at sunrise', 'A red torii standing in the water of Japan’s largest lake.', 'JR Kosei line from Kyoto. Don’t cross the road for the photo: there is a safe viewpoint.'], ar: ['بوابة توري شيراهيغه في البحيرة', 'شيغا (بحيرة بيوا) · طوال العام، والأفضل عند الشروق', 'بوابة توري حمراء وسط مياه أكبر بحيرة في اليابان.', 'خط JR كوسي من كيوتو. لا تعبر الطريق من أجل الصورة: هناك نقطة مشاهدة آمنة.'] },
    { es: ['Motonosumi Inari', 'Yamaguchi · todo el año', 'Más de cien torii rojos que bajan hasta acantilados sobre el mar.', 'Mejor en coche; está lejos de todo, por eso casi no hay gente.'], en: ['Motonosumi Inari', 'Yamaguchi · all year', 'Over a hundred red torii running down to cliffs above the sea.', 'Best by car; it is far from everything, which is why it is nearly empty.'], ar: ['موتونوسومي إيناري', 'ياماغوتشي · طوال العام', 'أكثر من مئة بوابة توري حمراء تنحدر حتى منحدرات فوق البحر.', 'الأفضل بالسيارة؛ بعيدة عن كل شيء، ولهذا تكاد تخلو من الناس.'] },
    { es: ['Garganta de Takachiho', 'Miyazaki · todo el año', 'Una cascada que cae a un río verde esmeralda entre paredes de roca, vista desde una barca.', 'Las barcas se reservan y se llenan pronto; reserva en cuanto sepas la fecha.'], en: ['Takachiho Gorge', 'Miyazaki · all year', 'A waterfall dropping into an emerald river between rock walls, seen from a rowing boat.', 'Boats are booked and fill up fast; reserve as soon as you know your date.'], ar: ['وادي تاكاتشيهو', 'ميازاكي · طوال العام', 'شلال يسقط في نهر زمردي بين جدران صخرية، تراه من قارب تجديف.', 'القوارب بالحجز وتمتلئ سريعاً؛ احجز فور معرفة موعدك.'] },
    { es: ['Ine no funaya', 'Kioto (norte) · todo el año', 'Casas de madera construidas sobre el agua, con las barcas debajo.', 'Ve con Amanohashidate en el mismo día; desde Kioto son unas 2-3 horas.'], en: ['Ine no Funaya', 'Northern Kyoto · all year', 'Wooden boathouses built over the water, with boats parked underneath.', 'Pair it with Amanohashidate on the same day; about 2–3 hours from Kyoto.'], ar: ['إينه نو فونايا', 'شمال كيوتو · طوال العام', 'بيوت خشبية مبنية فوق الماء، تحتها القوارب.', 'اجمعها مع أمانوهاشيداته في اليوم نفسه؛ نحو 2-3 ساعات من كيوتو.'] },
  ],
}

// Kanto (cerca de Tokio): «trends chiquitos» que pidió Tony el 9-11-2026 a partir del Hitachi Seaside Park.
export const JOYAS_KANTO = {
  otono: [
    { es: ['Avenida de ginkgos del parque Shōwa Kinen', 'Tokio (Tachikawa) · mediados y finales de noviembre', 'Un túnel de ginkgos amarillos y un suelo dorado de hojas: el amarillo que se guarda en otoño.', 'Tren JR desde Shinjuku hasta Tachikawa, unos 30-40 minutos. Entre semana, a primera hora.'], en: ['Shōwa Kinen Park ginkgo avenue', 'Tokyo (Tachikawa) · mid to late November', 'A tunnel of yellow ginkgo trees over a golden carpet of leaves: autumn’s most-saved yellow.', 'JR train from Shinjuku to Tachikawa, about 30–40 minutes. Weekday mornings are best.'], ar: ['جادة الجنكة في حديقة شووا كينين', 'طوكيو (تاتشيكاوا) · منتصف وأواخر نوفمبر', 'نفق من أشجار الجنكة الصفراء فوق بساط ذهبي من الأوراق: أكثر لون أصفر يُحفظ في الخريف.', 'قطار JR من شينجوكو إلى تاتشيكاوا، نحو 30-40 دقيقة. الأفضل صباح أيام الأسبوع.'] },
    { es: ['Pasillo de arces del lago Kawaguchi', 'Yamanashi · principios y mediados de noviembre', 'Arces rojos iluminados de noche con el monte Fuji detrás.', 'Bus desde Shinjuku. Ve por la mañana para ver el Fuji despejado y vuelve al anochecer a la iluminación.'], en: ['Lake Kawaguchi Momiji Corridor', 'Yamanashi · early to mid November', 'Red maples lit up at night with Mount Fuji behind.', 'Bus from Shinjuku. Go in the morning for a clear Fuji and come back at dusk for the lights.'], ar: ['ممرّ القيقب في بحيرة كاواغوتشي', 'ياماناشي · أوائل ومنتصف نوفمبر', 'أشجار قيقب حمراء مضاءة ليلاً وخلفها جبل فوجي.', 'حافلة من شينجوكو. اذهب صباحاً لترى فوجي صافياً وعُد عند الغروب للإضاءة.'] },
  ],
  invierno: [
    { es: ['Iluminación de Ashikaga Flower Park', 'Tochigi · de finales de octubre a febrero', 'Millones de luces que imitan las glicinias del parque, reflejadas en el estanque.', 'Unas 2 horas desde Tokio en tren; estación propia (Ashikaga Flower Park). Ve al anochecer.'], en: ['Ashikaga Flower Park illumination', 'Tochigi · late October to February', 'Millions of lights imitating the park’s wisteria, reflected in the pond.', 'About 2 hours from Tokyo by train; it has its own station (Ashikaga Flower Park). Go at dusk.'], ar: ['إضاءة حديقة أشيكاغا للزهور', 'توتشيغي · من أواخر أكتوبر إلى فبراير', 'ملايين الأضواء تحاكي أزهار الوستارية في الحديقة، وتنعكس في البركة.', 'نحو ساعتين من طوكيو بالقطار؛ لها محطة خاصة (Ashikaga Flower Park). اذهب عند الغروب.'] },
    { es: ['Torii en la roca de Ōarai', 'Ibaraki · todo el año, mejor al amanecer de invierno', 'Un torii sobre una roca en medio de las olas del Pacífico, con el sol saliendo detrás.', 'Combínalo con el Hitachi Seaside Park, a unos 20-30 minutos. El aire frío de invierno da los amaneceres más limpios.'], en: ['Ōarai’s torii on the rocks', 'Ibaraki · all year, best at a winter sunrise', 'A torii on a rock amid Pacific waves, with the sun rising behind it.', 'Pair it with Hitachi Seaside Park, about 20–30 minutes away. Cold winter air gives the clearest sunrises.'], ar: ['بوابة توري على صخرة أوأراي', 'إيباراكي · طوال العام، والأفضل عند شروق الشتاء', 'بوابة توري على صخرة وسط أمواج المحيط الهادئ، والشمس تشرق خلفها.', 'اجمعها مع حديقة هيتاتشي الساحلية، على بعد 20-30 دقيقة. هواء الشتاء البارد يمنح أصفى شروق.'] },
    { es: ['Jardín de ciruelos de Atami', 'Shizuoka (Atami) · enero a principios de marzo', 'Ciruelos en flor, uno de los primeros del país, en un valle con cascada y puentes.', 'Shinkansen desde Tokio en unos 40-50 minutos. Combínalo con el baño en un onsen.'], en: ['Atami plum garden', 'Shizuoka (Atami) · January to early March', 'Plum trees in bloom — among the earliest in Japan — in a valley with a waterfall and bridges.', 'Shinkansen from Tokyo in about 40–50 minutes. Pair it with an onsen.'], ar: ['حديقة البرقوق في أتامي', 'شيزوكا (أتامي) · من يناير إلى أوائل مارس', 'أشجار برقوق مزهرة، من أوائلها في اليابان، في وادٍ فيه شلال وجسور.', 'شينكانسن من طوكيو في نحو 40-50 دقيقة. واجمعها مع حمّام أونسن.'] },
  ],
  primavera: [
    { es: ['Hitachi Seaside Park', 'Ibaraki (Hitachinaka) · narcisos y tulipanes en primavera; las nemófilas azules llegan a finales de abril', 'Colinas enteras que cambian de color con cada flor; la más guardada es la «colina azul» de nemófilas.', 'Bus desde la estación de Katsuta. Llega a la apertura: a mediodía hay mucha gente. Combínalo con el torii de Ōarai.'], en: ['Hitachi Seaside Park', 'Ibaraki (Hitachinaka) · daffodils and tulips in spring; blue nemophila arrive in late April', 'Whole hills that change colour with each flower; the most-saved is the nemophila “blue hill”.', 'Bus from Katsuta Station. Arrive at opening: it gets crowded by midday. Pair it with Ōarai’s torii.'], ar: ['حديقة هيتاتشي الساحلية', 'إيباراكي (هيتاتشيناكا) · نرجس وتوليب في الربيع؛ وأزهار النيموفيلا الزرقاء تأتي أواخر أبريل', 'تلال كاملة يتغيّر لونها مع كل زهرة؛ وأكثرها حفظاً «التلّة الزرقاء» من النيموفيلا.', 'حافلة من محطة كاتسوتا. تعال عند الافتتاح: يزدحم المكان ظهراً. واجمعها مع توري أوأراي.'] },
    { es: ['Sakura-zutsumi de Kumagaya', 'Saitama · finales de marzo y principios de abril', 'Dos kilómetros de cerezos junto a un río, con un camino de colza amarilla debajo: rosa y amarillo en la misma foto.', 'Shinkansen o tren JR desde Tokio hasta Kumagaya; a pie desde la estación.'], en: ['Kumagaya Sakura-zutsumi', 'Saitama · late March and early April', 'Two kilometres of cherry trees along a river with a path of yellow rapeseed below: pink and yellow in one shot.', 'Shinkansen or JR train from Tokyo to Kumagaya; walk from the station.'], ar: ['ساكورا-زوتسومي في كوماغايا', 'سايتاما · أواخر مارس وأوائل أبريل', 'كيلومتران من أشجار الكرز بجانب نهر، وتحتها ممرّ من اللفت الأصفر: الوردي والأصفر في صورة واحدة.', 'شينكانسن أو قطار JR من طوكيو إلى كوماغايا؛ ثم سيراً من المحطة.'] },
    { es: ['Tulipanes del parque Shōwa Kinen', 'Tokio (Tachikawa) · principios y mediados de abril', 'Campos de tulipanes de colores alrededor de un estanque, como un cuadro holandés en Tokio.', 'Tren JR desde Shinjuku; el mismo parque de los ginkgos de otoño.'], en: ['Shōwa Kinen Park tulips', 'Tokyo (Tachikawa) · early to mid April', 'Fields of colourful tulips around a pond, like a Dutch painting in Tokyo.', 'JR train from Shinjuku; the same park as the autumn ginkgos.'], ar: ['توليب حديقة شووا كينين', 'طوكيو (تاتشيكاوا) · أوائل ومنتصف أبريل', 'حقول توليب ملوّنة حول بركة، كلوحة هولندية في طوكيو.', 'قطار JR من شينجوكو؛ الحديقة نفسها التي فيها أشجار الجنكة الخريفية.'] },
  ],
}
