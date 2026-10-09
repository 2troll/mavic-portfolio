// Páginas de temporada nuevas (otoño en árabe y ruso; sakura 2027 en 4 idiomas).
// Mismas reglas que datosOtono.ts: nada que no sea verdad, sin horarios ni precios de entradas.
import type { PaginaOtono } from './datosOtono'

export const NUEVAS: Record<'o-ar' | 'o-ru' | 's-es' | 's-en' | 's-ar' | 's-ru', PaginaOtono> = {
  'o-ar': {
    temporada: 'otono',
    guia: 'tony',
    foto: 'kioto-kiyomizu',
    lang: 'ar',
    ruta: '/ar/kyoto-autumn/',
    inicio: '/ar/',
    seo: {
      titulo: 'خريف كيوتو مع مرشد سياحي خاص بالعربية | Tony Kansai Guide',
      descripcion: 'جولة خاصة لمشاهدة ألوان الخريف المذهلة في كيوتو برفقة توني. تنظيم مريح للخيارات الحلال ومسار مخصص لعائلتك.'
    },
    antetitulo: 'موسم الموميجي في كيوتو',
    titulo: 'خريف كيوتو بألوانه الساحرة مع مرشدك الخاص',
    sub: 'رحلة عائلية خاصة ومريحة بين أوراق القيقب الحمراء والمعالم التاريخية، مع اهتمام كامل باحتياجاتكم الغذائية الحلال.',
    cta: 'تواصل عبر واتساب',
    cuando: {
      titulo: 'متى تتألق ألوان الخريف في كيوتو؟',
      texto: [
        'يبدأ تحول أوراق القيقب (الموميجي) في كيوتو عادةً من منتصف نوفمبر ويستمر حتى أوائل ديسمبر.',
        'تصل ذروة الألوان الخلابة في أغلب المعابد والحدائق التاريخية خلال النصف الثاني من شهر نوفمبر.',
        'نظراً لكونه من أكثر المواسم إقبالاً، ننصح بتحديد المواعيد وحجز الجولة مبكراً لضمان توفر اليوم المناسب لكم.'
      ]
    },
    sitiosTitulo: 'أبرز معالم الخريف المختارة',
    sitios: [
      {
        kanji: '清水寺',
        nombre: 'معبد كيوميزو-ديرا',
        texto: 'تطل منصته الخشبية الشهيرة على بحر من أشجار القيقب الحمراء التي تغطي الوادي تحته.'
      },
      {
        kanji: '東福寺',
        nombre: 'معبد توفوكو-جي',
        texto: 'يشتهر بجسر تسوتينكيو الذي يوفر إطلالة بانورامية لا مثيل لها على أودية القيقب.'
      },
      {
        kanji: '永観堂',
        nombre: 'معبد إيكاندو (زينرين-جي)',
        texto: 'يُعرف تاريخياً بمعبد أوراق الخريف حيث تحتضن بركته وحدائقه آلاف أشجار القيقب.'
      },
      {
        kanji: '南禅寺',
        nombre: 'معبد نانزين-جي',
        texto: 'مجمع معابد تاريخي واسع تحيط بقنواته الحجرية القديمة وبوابته الضخمة ألوان الخريف البديعة.'
      },
      {
        kanji: '嵐山',
        nombre: 'أراشيياما',
        texto: 'تتلون سفوح جباله وغابات الخيزران بظلال الخريف الدافئة على ضفاف نهر أوي.'
      },
      {
        kanji: '奈良',
        nombre: 'حديقة نارا',
        texto: 'تتجول الغزلان اللطيفة بحرية تحت ظلال أشجار الجنكة الذهبية والقيقب الأحمر في أرجاء الحديقة.'
      }
    ],
    diaTitulo: 'نموذج لمسار يوم كامل في الخريف',
    dia: [
      {
        h: '07:30',
        t: 'اللقاء في بهو فندقكم في أوساكا أو كيوتو والانطلاق مبكراً لتجنب الازدحام.'
      },
      {
        h: '08:30',
        t: 'زيارة أحد معابد القيقب الرئيسية في الصباح الباكر للاستمتاع بالأجواء الهادئة والتقاط أجمل الصور.'
      },
      {
        h: '11:00',
        t: 'الانتقال إلى حديقة تاريخية أو ممر هادئ غني بألوان الخريف الطبيعية.'
      },
      {
        h: '12:30',
        t: 'استراحة غداء يتم ترتيبها وفق رغبتكم في مطاعم تقدم أطعمة حلال أو خيارات ملائمة.'
      },
      {
        h: '14:00',
        t: 'جولة مشي بعد الظهر بين المعالم التراثية والأسواق التقليدية المحاطة بالطبيعة.'
      },
      {
        h: '16:30',
        t: 'موقع مميز للاستمتاع بإضاءة الغروب على الأشجار الملونة قبل اختتام الجولة والعودة للفندق.'
      }
    ],
    diaNota: 'هذا مجرد نموذج قابل للتعديل بالكامل حسب وتيرة عائلتكم ورغباتكم الخاصة.',
    preciosTitulo: 'الأسعار الخاصة بالجولة',
    medio: 'نصف يوم (4 ساعات)',
    completo: 'يوم كامل (8 ساعات)',
    porGrupo: 'السعر للمجموعة بأكملها (حتى 6 أشخاص)',
    porPersona: (y) => `لأربعة أشخاص: ${y} للشخص`,
    notas: [
      'الأسعار للمجموعة كاملة (حتى 6 أشخاص كحد أقصى) وليست للشخص الواحد.',
      'المواصلات وتذاكر الدخول والوجبات غير مشمولة في سعر الجولة.',
      'جولة خاصة بالكامل لكم، ولا توجد أي مجموعات أخرى مشاركة.',
      'مرشد مستقل وليس وكالة سياحية؛ لا أبيع تذاكر.',
      'إلغاء مجاني حتى 72 ساعة قبل موعد الجولة.'
    ],
    consejosTitulo: 'نصائح لرحلة خريف مريحة',
    consejos: [
      'المشي في الصباح الباكر يتيح لكم تجربة معالم كيوتو الرائعة قبل وصول الحشود السياحية.',
      'طقس أواخر الخريف يميل للبرودة صباحاً ومساءً، لذا يُنصح بارتداء ملابس دافئة متعددة الطبقات.',
      'نحرص على التخطيط المسبق لوجبات الطعام بما يضمن خيارات حلال مريحة لكم ولعائلتكم.'
    ],
    final: {
      titulo: 'هل تخططون لزيارة كيوتو هذا الخريف؟',
      texto: 'يسعدني مساعدتكم في تنسيق مسار ممتع وخاص يناسبكم ويجعل رحلتكم ذكرى لا تُنسى.',
      boton: 'تواصل معي عبر واتساب'
    },
    saludo: 'مرحباً توني، أخطط لزيارة كيوتو في فصل الخريف لرؤية ألوان الخريف. التواريخ المقترحة: ',
    volver: 'العودة للرئيسية'
  },
  'o-ru': {
    temporada: 'otono',
    guia: 'larion',
    foto: 'kioto-kiyomizu',
    lang: 'ru',
    ruta: '/ru/kyoto-autumn/',
    inicio: '/ru/',
    seo: {
      titulo: 'Осень в Киото с частным гидом на русском языке | Tony Kansai Guide',
      descripcion: 'Индивидуальные экскурсии по осеннему Киото с Ларионом. Сезон красных клёнов момидзи в комфортном для вас темпе.'
    },
    antetitulo: 'Сезон момидзи в Киото',
    titulo: 'Осенний Киото: клёны и храмы с частным гидом',
    sub: 'Я, Ларион, покажу вам самые выразительные осенние места Киото без спешки и туристической суеты.',
    cta: 'Написать в WhatsApp',
    cuando: {
      titulo: 'Когда цветут осенние клёны в Киото?',
      texto: [
        'Сезон красных клёнов (момидзи) в Киото обычно длится с середины ноября до начала декабря.',
        'Пик насыщенных красок в большинстве долин и храмовых садов приходится на вторую половину ноября.',
        'Это один из самых востребованных периодов года в Японии, поэтому даты лучше бронировать заранее.'
      ]
    },
    sitiosTitulo: 'Шесть знаковых мест осени',
    sitios: [
      {
        kanji: '清水寺',
        nombre: 'Храм Киёмидзу-дэра',
        texto: 'Деревянная терраса храма парит над морем ярко-красных кленовых крон в горном ущелье.'
      },
      {
        kanji: '東福寺',
        nombre: 'Храм Тофуку-дзи',
        texto: 'Знаменитый мост Цутэнке открывает классический вид на покрытую багрянцем долину.'
      },
      {
        kanji: '永観堂',
        nombre: 'Храм Эйкан-до (Дзэнрин-дзи)',
        texto: 'Храм издавна называют храмом осенней листвы за отражение клёнов в зеркале пруда.'
      },
      {
        kanji: '南禅寺',
        nombre: 'Храм Нандзэн-дзи',
        texto: 'Просторный дзэнский комплекс с массивными воротами и старинным акведуком в окружении осенних деревьев.'
      },
      {
        kanji: '嵐山',
        nombre: 'Арасияма',
        texto: 'Склоны лесистых гор окрашиваются в тёплые тона вдоль течения реки Ои.'
      },
      {
        kanji: '奈良',
        nombre: 'Парк Нара',
        texto: 'Свободно гуляющие олени на фоне золотых гинкго и алых клёнов древней столицы.'
      }
    ],
    diaTitulo: 'Пример маршрута на полный день',
    dia: [
      {
        h: '07:30',
        t: 'Встреча в лобби вашего отеля в Киото или Осаке и спокойный ранний выезд.'
      },
      {
        h: '08:30',
        t: 'Первый храмовый сад в утренние часы, пока на дорожках мало людей и мягкий свет.'
      },
      {
        h: '11:00',
        t: 'Переезд ко второму живописному месту или тихой кленовой аллее.'
      },
      {
        h: '12:30',
        t: 'Обед в аутентичном японском ресторанчике по вашим предпочтениям.'
      },
      {
        h: '14:00',
        t: 'Прогулка по историческим кварталам с осмотром традиционной архитектуры.'
      },
      {
        h: '16:30',
        t: 'Финальная точка с красивым вечерним светом на листве и возвращение в отель.'
      }
    ],
    diaNota: 'Маршрут составляется индивидуально под ваши пожелания и комфортный для вас темп шага.',
    preciosTitulo: 'Стоимость экскурсий',
    medio: 'Полдня (4 часа)',
    completo: 'Полный день (8 часов)',
    porGrupo: 'Стоимость за всю вашу группу (до 6 человек)',
    porPersona: (y) => `Если вас четверо: ${y} с человека`,
    notas: [
      'Цена указана за всю группу целиком (до 6 человек), а не с каждого участника.',
      'Поезда, входные билеты и питание оплачиваются отдельно по факту.',
      'Тур строго индивидуальный: только вы и ваша семья или компания.',
      'Я частный независимый гид, а не агентство; не продаю билеты.',
      'Бесплатная отмена за 72 часа до начала тура.',
      'Оплата наличными в иенах в день тура или заранее — уточним в WhatsApp.'
    ],
    consejosTitulo: 'Советы для осенней поездки',
    consejos: [
      'Ранний старт позволяет увидеть главные храмы в тишине до основного потока туристов.',
      'В конце ноября утра и вечера бывают прохладными, поэтому пригодится тёплая многослойная одежда.',
      'Удобная обувь обязательна: храмовые комплексы Киото предполагают много пеших прогулок.'
    ],
    final: {
      titulo: 'Планируете приехать в Киото осенью?',
      texto: 'Напишите мне даты вашей поездки, и мы составим удобную программу с учётом пика сезона клёнов.',
      boton: 'Написать в WhatsApp'
    },
    saludo: 'Здравствуйте, Ларион! Планируем поездку в Киото на осенние клёны (момидзи). Наши даты: ',
    volver: 'На главную'
  },
  's-es': {
    temporada: 'sakura',
    guia: 'tony',
    foto: 'kioto-sakura',
    lang: 'es',
    ruta: '/es/sakura-kioto/',
    inicio: '/es/',
    seo: {
      titulo: 'Sakura 2027 en Kioto con guía privado en español | Tony Kansai Guide',
      descripcion: 'Guía privado en español para vivir la floración de los cerezos en Kioto en primavera de 2027. Itinerario exclusivo a tu ritmo.'
    },
    antetitulo: 'Primavera 2027 en Kioto',
    titulo: 'Sakura 2027 en Kioto: los cerezos en flor con guía privado',
    sub: 'Descubre los rincones más hermosos de la floración en Kioto con un itinerario pensado exclusivamente para tu grupo.',
    cta: 'Escríbeme por WhatsApp',
    cuando: {
      titulo: '¿Cuándo florecen los cerezos en Kioto?',
      texto: [
        'La floración del cerezo en Kioto ocurre habitualmente entre finales de marzo y principios de abril, y la plena floración dura cerca de una semana.',
        'Los pronósticos oficiales para 2027 de Japan Meteorological Corporation (JMC) y Weathernews se publican a partir de enero o febrero de 2027; en cuanto salgan te avisaré para ajustar los días clave.',
        'Es la temporada de mayor demanda turística en Japón y además la Semana Santa de 2027 coincide con estas fechas (el Domingo de Resurrección es el 28 de marzo de 2027), por lo que conviene reservar con bastante antelación.'
      ]
    },
    sitiosTitulo: 'Seis lugares emblemáticos del sakura',
    sitios: [
      {
        kanji: '哲学の道',
        nombre: 'Camino de la Filosofía',
        texto: 'Un sendero peatonal junto al canal escoltado por cientos de cerezos que forman un túnel blanco y rosado.'
      },
      {
        kanji: '円山公園',
        nombre: 'Parque Maruyama',
        texto: 'Alberga el legendario cerezo llorón gigante (shidarezakura), icono indiscutible de la primavera en Kioto.'
      },
      {
        kanji: '平安神宮',
        nombre: 'Santuario Heian',
        texto: 'Su jardín interior destaca por los cerezos llorones de ramas rosas que caen sobre los estanques tradicionales.'
      },
      {
        kanji: '醍醐寺',
        nombre: 'Templo Daigo-ji',
        texto: 'Histórico recinto budista célebre por su extensa colección de cerezos de floración temprana y tardía.'
      },
      {
        kanji: '嵐山',
        nombre: 'Arashiyama',
        texto: 'Cerezos en flor alineados a orillas del río Katsura con las colinas verdes de fondo.'
      },
      {
        kanji: '二条城',
        nombre: 'Castillo de Nijō',
        texto: 'Amplios jardines amurallados que reúnen decenas de variedades de cerezos con distintas fases de floración.'
      }
    ],
    diaTitulo: 'Ejemplo de un día durante el sakura',
    dia: [
      {
        h: '07:30',
        t: 'Encuentro en el lobby de vuestro hotel en Osaka o Kioto para aprovechar las primeras horas.'
      },
      {
        h: '08:30',
        t: 'Paseo tranquilo por un túnel de cerezos antes de que lleguen los grupos grandes.'
      },
      {
        h: '11:00',
        t: 'Visita a un templo o parque con variedades destacadas de sakura en plena flor.'
      },
      {
        h: '12:30',
        t: 'Pausa para almorzar en un restaurante local adaptado a vuestras preferencias gastronómicas.'
      },
      {
        h: '14:00',
        t: 'Recorrido por jardines históricos o distritos tradicionales cubiertos de pétalos.'
      },
      {
        h: '16:30',
        t: 'Última parada escénica para disfrutar de la luz suave de la tarde sobre los árboles y despedida.'
      }
    ],
    diaNota: 'El recorrido se adapta el mismo día al estado exacto de apertura de los cerezos en cada zona.',
    preciosTitulo: 'Tarifas del tour privado',
    medio: 'Medio día (4 horas)',
    completo: 'Día completo (8 horas)',
    porGrupo: 'Precio total por grupo (hasta 6 personas)',
    porPersona: (y) => `Siendo 4: ${y} por persona`,
    notas: [
      'Tarifa fija por grupo (máximo 6 personas), no por pasajero.',
      'Transportes locales, entradas a templos y comidas corren por cuenta del cliente.',
      'Servicio 100% privado: un único grupo al día.',
      'Soy guía independiente, no una agencia; no vendo entradas.',
      'Cancelación gratuita hasta 72 horas antes de la fecha reservada.'
    ],
    consejosTitulo: 'Consejos para el sakura',
    consejos: [
      'Madrugar marca una diferencia enorme para contemplar los cerezos con calma y sin aglomeraciones.',
      'La floración óptima dura pocos días, por lo que la flexibilidad diaria es la mejor aliada.',
      'Trae calzado cómodo para caminar sin prisas por senderos de piedra y jardines.'
    ],
    final: {
      titulo: '¿Vienes a Kioto en el sakura 2027?',
      texto: 'Escríbeme indicando tus posibles fechas y planificaremos juntos una ruta adaptada a tu grupo.',
      boton: 'Escríbeme por WhatsApp'
    },
    saludo: 'Hola Tony, vengo en primavera de 2027 para ver los cerezos en Kioto. Fechas: ',
    volver: 'Volver al inicio'
  },
  's-en': {
    temporada: 'sakura',
    guia: 'tony',
    foto: 'kioto-sakura',
    lang: 'en',
    ruta: '/en/kyoto-cherry-blossom/',
    inicio: '/en/',
    seo: {
      titulo: 'Kyoto Cherry Blossom 2027 with Private Guide | Tony Kansai Guide',
      descripcion: 'Experience Kyoto sakura 2027 with a dedicated private guide. Flexible pace, iconic blossom spots, and tailored private day tours.'
    },
    antetitulo: 'Kyoto Spring 2027',
    titulo: 'Kyoto Cherry Blossom 2027 with Your Private Guide',
    sub: 'Explore Kyoto in full bloom with an exclusive itinerary shaped around your group and genuine blossom timing.',
    cta: 'Message me on WhatsApp',
    cuando: {
      titulo: 'When do the cherry blossoms bloom in Kyoto?',
      texto: [
        'Cherry blossom in Kyoto typically occurs between late March and early April, with full bloom lasting about one week.',
        'Official 2027 forecasts from the Japan Meteorological Corporation and Weathernews are published starting January or February 2027; I will share the updates with you as soon as they are released.',
        'This is the busiest travel season in Japan, so booking your preferred tour dates well in advance is highly recommended.'
      ]
    },
    sitiosTitulo: 'Six Iconic Blossom Locations',
    sitios: [
      {
        kanji: '哲学の道',
        nombre: "Philosopher's Path",
        texto: 'A stone canal-side walkway lined with hundreds of cherry trees forming a continuous pink canopy.'
      },
      {
        kanji: '円山公園',
        nombre: 'Maruyama Park',
        texto: 'Home to Kyoto’s famed giant weeping cherry tree (shidarezakura) towering at the heart of the park.'
      },
      {
        kanji: '平安神宮',
        nombre: 'Heian Shrine',
        texto: 'Extensive stroll gardens highlighted by graceful pink weeping cherries arching over classical ponds.'
      },
      {
        kanji: '醍醐寺',
        nombre: 'Daigo-ji Temple',
        texto: 'A sprawling hillside sanctuary renowned historically for its dense grove of early and late blooming cherries.'
      },
      {
        kanji: '嵐山',
        nombre: 'Arashiyama',
        texto: 'Cherry trees bordering the scenic riverbanks against the backdrop of forested western hills.'
      },
      {
        kanji: '二条城',
        nombre: 'Nijō Castle',
        texto: 'Expansive historic castle grounds featuring numerous cherry varieties that blossom across successive weeks.'
      }
    ],
    diaTitulo: 'Sample Full-Day Sakura Itinerary',
    dia: [
      {
        h: '07:30',
        t: 'Meet at your hotel lobby in Osaka or Kyoto for an early start before peak morning crowds.'
      },
      {
        h: '08:30',
        t: 'Morning stroll along quiet blossom avenues during the softest morning light.'
      },
      {
        h: '11:00',
        t: 'Visit a celebrated temple garden showcasing trees currently at their bloom peak.'
      },
      {
        h: '12:30',
        t: 'Lunch break at a hand-picked local restaurant matching your party’s preferences.'
      },
      {
        h: '14:00',
        t: 'Explore historic preservation quarters and scenic paths blanketed by fallen petals.'
      },
      {
        h: '16:30',
        t: 'Final scenic spot with afternoon light on the branches before returning to your hotel.'
      }
    ],
    diaNota: 'We adjust stops dynamically on the tour day to match where blossoms are looking their best.',
    preciosTitulo: 'Private Tour Pricing',
    medio: 'Half day (4 hours)',
    completo: 'Full day (8 hours)',
    porGrupo: 'Total rate per group (up to 6 guests)',
    porPersona: (y) => `For 4 people: ${y} each`,
    notas: [
      'Flat rate per private group (up to 6 guests maximum), not per individual.',
      'Train fares, temple entrance tickets, and meals are not included.',
      'Fully private tour: only your party, never joined by strangers.',
      'Independent guide, not an agency; I do not sell tickets.',
      'Free cancellation up to 72 hours before the tour date.'
    ],
    consejosTitulo: 'Tips for Blossom Season',
    consejos: [
      'Starting early in the morning makes a world of difference for enjoying sights without heavy crowds.',
      'Full bloom is fleeting, so keeping a flexible order of stops yields the best experience.',
      'Wear comfortable walking shoes suitable for stone stairs and unpaved garden trails.'
    ],
    final: {
      titulo: 'Visiting Kyoto for Sakura 2027?',
      texto: 'Send me a message with your expected travel dates and let us plan an unforgettable private day.',
      boton: 'Message me on WhatsApp'
    },
    saludo: 'Hello Tony, I am planning a trip for cherry blossom season 2027 in Kyoto. Dates: ',
    volver: 'Back to home'
  },
  's-ar': {
    temporada: 'sakura',
    guia: 'tony',
    foto: 'kioto-sakura',
    lang: 'ar',
    ruta: '/ar/kyoto-cherry-blossom/',
    inicio: '/ar/',
    seo: {
      titulo: 'موسم الساكورا 2027 في كيوتو مع مرشد خاص بالعربية | Tony Kansai Guide',
      descripcion: 'استمتع بموسم أزهار الكرز (الساكورا) 2027 في كيوتو مع مرشدك الخاص توني. جولة عائلية خاصة مع ترتيبات طعام حلال.'
    },
    antetitulo: 'ربيع 2027 في كيوتو',
    titulo: 'موسم أزهار الكرز (الساكورا) 2027 مع مرشد خاص',
    sub: 'عش سحر الربيع الياباني برحلة خاصة ومريحة تضمن خصوصية عائلتك وخيارات طعام حلال متكاملة.',
    cta: 'تواصل عبر واتساب',
    cuando: {
      titulo: 'متى تتفتح أزهار الكرز في كيوتو؟',
      texto: [
        'تتفتح أزهار الكرز في كيوتو عادةً بين أواخر شهر مارس وبداية أبريل، وتستمر ذروة التفتح لحوالي أسبوع واحد فقط.',
        'تصدر التوقعات الرسمية لعام 2027 من شركتي Japan Meteorological Corporation وWeathernews في شهري يناير وفبراير 2027، وسأوافيكم بالتحديث فور صدوره لتحديد الأيام الأنسب.',
        'يعد هذا الموسم الأكثر ازدحاماً وإقبالاً على الإطلاق في اليابان، لذا يُنصح بشدة بالحجز والتنسيق المسبق.'
      ]
    },
    sitiosTitulo: 'أشهر معالم أزهار الكرز',
    sitios: [
      {
        kanji: '哲学の道',
        nombre: 'طريق الفلسفة',
        texto: 'ممشى حجري بمحاذاة قناة مائية تصطف على جانبيه مئات أشجار الساكورا مشكّلة نفقاً زهرياً ساحراً.'
      },
      {
        kanji: '円山公園',
        nombre: 'حديقة ماروياما',
        texto: 'تحتضن شجرة الكرز المتدلية العملاقة الشهيرة (شيداري-زاكورا) التي تعد رمزاً لربيع كيوتو.'
      },
      {
        kanji: '平安神宮',
        nombre: 'ضريح هيان',
        texto: 'تتميز حدائقه بأشجار الكرز الباكية ذات الأغصان الوردية المتدلية فوق برك المياه.'
      },
      {
        kanji: '醍醐寺',
        nombre: 'معبد دايغو-جي',
        texto: 'معلم تاريخي بارز يشتهر منذ قرون بأشجار الكرز المتنوعة التي تتفتح عبر فترات متتالية.'
      },
      {
        kanji: '嵐山',
        nombre: 'أراشيياما',
        texto: 'تنتشر أزهار الكرز على ضفاف النهر مع خلفية الجبال الخضراء الخلابة.'
      },
      {
        kanji: '二条城',
        nombre: 'قلعة نيجو',
        texto: 'حدائق واسعة تضم أصنافاً متعددة من أشجار الكرز التي تزهر على مراحل طوال الموسم.'
      }
    ],
    diaTitulo: 'نموذج لمسار يوم كامل لمشاهدة الساكورا',
    dia: [
      {
        h: '07:30',
        t: 'اللقاء في بهو فندقكم في أوساكا أو كيوتو للانطلاق في ساعات الصباح الباكرة المريحة.'
      },
      {
        h: '08:30',
        t: 'زيارة أحد ممرات الكرز الجميلة قبل وصول وفود الزوار والاستمتاع بالتصوير الهادئ.'
      },
      {
        h: '11:00',
        t: 'التوجه إلى حديقة تاريخية تشهد ذروة تفتح الزهور للاستمتاع بالطبيعة الخلابة.'
      },
      {
        h: '12:30',
        t: 'استراحة غداء نختار فيها مطاعم ملائمة تقدم أطعمة حلال وتناسب ذوق عائلتكم.'
      },
      {
        h: '14:00',
        t: 'جولة بين المعالم التراثية والحدائق اليابانية التقليدية المحاطة بالأزهار.'
      },
      {
        h: '16:30',
        t: 'محطة ختامية للاستمتاع بمنظر بتلات الساكورا مع إضاءة العصر قبل العودة للفندق.'
      }
    ],
    diaNota: 'نقوم بتكييف المسار في يوم الجولة ليتوافق مع المواقع التي تشهد أفضل حالة تفتح في تلك اللحظة.',
    preciosTitulo: 'أسعار الجولات الخاصة',
    medio: 'نصف يوم (4 ساعات)',
    completo: 'يوم كامل (8 ساعات)',
    porGrupo: 'السعر الإجمالي للمجموعة (حتى 6 أشخاص)',
    porPersona: (y) => `لأربعة أشخاص: ${y} للشخص`,
    notas: [
      'السعر محدد للمجموعة كاملة (بحد أقصى 6 أشخاص) وليس للفرد.',
      'المواصلات وتذاكر الدخول والوجبات غير مشمولة في سعر الجولة.',
      'جولة خاصة بالكامل لكم، دون وجود أي ركاب أو سياح آخرين.',
      'مرشد سياحي مستقل ولست شركة سياحية؛ لا أبيع تذاكر.',
      'إمكانية الإلغاء مجاناً حتى 72 ساعة قبل موعد الجولة المحدد.'
    ],
    consejosTitulo: 'إرشادات لموسم الساكورا',
    consejos: [
      'البدء مبكراً يضمن لكم فرصة تأمل الأزهار بهدوء وتفادي الازدحامات الكبيرة.',
      'ذروة الأزهار قصيرة وسريعة، لذا فإن المرونة في توقيت زيارة المواقع هي مفتاح التجربة الناجحة.',
      'نحرص دائماً على تنظيم أوقات وجبات الغداء بما يضمن توفر وجبات حلال ملائمة لعائلتكم.'
    ],
    final: {
      titulo: 'هل تنوون زيارة كيوتو في موسم ساكورا 2027؟',
      texto: 'تواصلوا معي عبر واتساب بالتواريخ المتوقعة لنقوم بترتيب يوم استثنائي لا يُنسى.',
      boton: 'تواصل معي عبر واتساب'
    },
    saludo: 'مرحباً توني، أخطط لزيارة كيوتو في موسم الساكورا لعام 2027. التواريخ المقترحة: ',
    volver: 'العودة للرئيسية'
  },
  's-ru': {
    temporada: 'sakura',
    guia: 'larion',
    foto: 'kioto-sakura',
    lang: 'ru',
    ruta: '/ru/kyoto-sakura/',
    inicio: '/ru/',
    seo: {
      titulo: 'Сакура 2027 в Киото с индивидуальным гидом на русском языке | Tony Kansai Guide',
      descripcion: 'Цветение сакуры в Киото весной 2027 года с Ларионом. Персональный маршрут, гибкий темп и лучшие цветущие локации.'
    },
    antetitulo: 'Весна 2027 в Киото',
    titulo: 'Сакура 2027 в Киото: цветение с частным гидом',
    sub: 'Я, Ларион, проведу для вас персональную экскурсию по Киото в пору цветения сакуры в удобном для вас ритме.',
    cta: 'Написать в WhatsApp',
    cuando: {
      titulo: 'Когда цветёт сакура в Киото?',
      texto: [
        'Цветение сакуры в Киото обычно происходит с конца марта по начало апреля, а пик цветения длится около одной недели.',
        'Официальные прогнозы на 2027 год от Японской метеорологической корпорации (JMC) и Weathernews появляются с января–февраля 2027 года; я сообщу вам прогноз, как только он выйдет.',
        'Это самый популярный сезон года в Киото, поэтому бронировать экскурсионные дни рекомендуется заблаговременно.'
      ]
    },
    sitiosTitulo: 'Шесть мест для любования сакурой',
    sitios: [
      {
        kanji: '哲学の道',
        nombre: 'Философская тропа',
        texto: 'Пешеходная дорожка вдоль канала под сомкнувшимися ветвями сотен цветущих вишен.'
      },
      {
        kanji: '円山公園',
        nombre: 'Парк Маруяма',
        texto: 'Здесь растёт легендарная исполинская плакучая сакура (сидарэдзакура), главный весенний символ парка.'
      },
      {
        kanji: '平安神宮',
        nombre: 'Святилище Хэйан',
        texto: 'Сад святилища знаменит густыми розовыми плакучими сакурами над тихими прудами.'
      },
      {
        kanji: '醍醐寺',
        nombre: 'Храм Дайго-дзи',
        texto: 'Древний храмовый комплекс с богатой историей весеннего любования множеством сортов вишни.'
      },
      {
        kanji: '嵐山',
        nombre: 'Арасияма',
        texto: 'Берега горной реки украшены цветущими деревьями на фоне лесистых склонов.'
      },
      {
        kanji: '二条城',
        nombre: 'Замок Нидзё',
        texto: 'На территории замка высажены разнообразные сорта сакуры, зацветающие в разное время.'
      }
    ],
    diaTitulo: 'Пример маршрута на день сакуры',
    dia: [
      {
        h: '07:30',
        t: 'Встреча в лобби вашего отеля в Киото или Осаке и спокойный ранний старт.'
      },
      {
        h: '08:30',
        t: 'Прогулка под цветущими кронами ранним утром, пока в городе мало туристов.'
      },
      {
        h: '11:00',
        t: 'Посещение исторического храма или сада с деревьями в фазе максимального цветения.'
      },
      {
        h: '12:30',
        t: 'Обед в аутентичном японском ресторане с учётом ваших вкусов и пожеланий.'
      },
      {
        h: '14:00',
        t: 'Прогулка по живописным историческим кварталам с ковром из лепестков сакуры.'
      },
      {
        h: '16:30',
        t: 'Заключительная панорамная точка в лучах вечернего солнца и возвращение в отель.'
      }
    ],
    diaNota: 'Маршрут гибко подстраивается прямо в день экскурсии под фактическое состояние цветения в разных районах.',
    preciosTitulo: 'Стоимость экскурсий',
    medio: 'Полдня (4 часа)',
    completo: 'Полный день (8 часов)',
    porGrupo: 'Стоимость за всю группу (до 6 человек)',
    porPersona: (y) => `Если вас четверо: ${y} с человека`,
    notas: [
      'Цена указана за всю группу целиком (до 6 человек максимум), а не за одного участника.',
      'Транспорт, входные билеты в храмы и питание оплачиваются отдельно.',
      'Экскурсия полностью приватная: только вы и ваши близкие.',
      'Я независимый частный гид, а не агентство; не продаю билеты.',
      'Бесплатная отмена за 72 часа до даты тура.',
      'Оплата наличными в иенах в день тура или заранее — уточним в WhatsApp.'
    ],
    consejosTitulo: 'Советы для сезона сакуры',
    consejos: [
      'Ранний выезд позволяет застать цветение без плотных туристических очередей.',
      'Период полного цветения краток, поэтому гибкость в выборе точек даёт лучший результат.',
      'Выбирайте удобную обувь без каблуков для долгих прогулок по каменным дорожкам и садам.'
    ],
    final: {
      titulo: 'Планируете увидеть сакуру в Киото в 2027 году?',
      texto: 'Напишите мне даты вашего визита, и мы заранее согласуем удобный маршрут для вашей компании.',
      boton: 'Написать в WhatsApp'
    },
    saludo: 'Здравствуйте, Ларион! Планируем поездку в Киото на цветение сакуры 2027 года. Наши даты: ',
    volver: 'На главную'
  }
}
