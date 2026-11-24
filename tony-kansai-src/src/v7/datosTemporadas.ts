// Páginas de temporada nuevas (otoño en árabe y ruso; sakura 2027 en 4 idiomas).
// Mismas reglas que datosOtono.ts: nada que no sea verdad, sin horarios ni precios de entradas.
import type { PaginaOtono } from './datosOtono'
import { yenLocal } from './formato'

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
        'في عام 2026 تتأخر الألوان: تتوقع Japan Meteorological Corporation (توقعات 1 أكتوبر 2026) اصفرار أشجار الجنكة في كيوتو نحو 27 نوفمبر واحمرار القيقب في وسط المدينة نحو 11 ديسمبر، بينما تتلون أراشياما ومعابد التلال أبكر، منذ منتصف نوفمبر.',
        'وإن كانت زيارتكم في ديسمبر، فالنصف الأول منه هذا العام ما زال يحمل الألوان في كيوتو، مع زحام أقل من نوفمبر.',
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
    cta: 'Написать в Telegram',
    cuando: {
      titulo: 'Когда цветут осенние клёны в Киото?',
      texto: [
        'Сезон красных клёнов (момидзи) в Киото обычно длится с середины ноября до начала декабря.',
        'В 2026 году сезон запаздывает: по прогнозу Japan Meteorological Corporation от 1 октября 2026 года гинкго в Киото пожелтеют около 27 ноября, а клёны в центре города покраснеют около 11 декабря. Арасияма и храмы на холмах окрашиваются раньше, с середины ноября.',
        'Если вы едете в декабре: в этом году в первой половине декабря в Киото ещё будут краски, а людей меньше, чем в ноябре.',
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
      'Оплата наличными в иенах в день тура или заранее — уточним в Telegram.'
    ],
    consejosTitulo: 'Советы для осенней поездки',
    consejos: [
      'Ранний старт позволяет увидеть главные храмы в тишине до основного потока туристов.',
      'В конце ноября утра и вечера бывают прохладными, поэтому пригодится тёплая многослойная одежда.',
      'Удобная обувь обязательна: храмовые комплексы Киото предполагают много пеших прогулок.'
    ],
    final: {
      titulo: 'Планируете приехать в Киото осенью?',
      texto: 'Напишите даты вашей поездки в Telegram @Larik_Yokota (ответит сам Ларион), и мы составим удобную программу с учётом пика сезона клёнов.',
      boton: 'Написать в Telegram'
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
    cta: 'Написать в Telegram',
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
      'Оплата наличными в иенах в день тура или заранее — уточним в Telegram.'
    ],
    consejosTitulo: 'Советы для сезона сакуры',
    consejos: [
      'Ранний выезд позволяет застать цветение без плотных туристических очередей.',
      'Период полного цветения краток, поэтому гибкость в выборе точек даёт лучший результат.',
      'Выбирайте удобную обувь без каблуков для долгих прогулок по каменным дорожкам и садам.'
    ],
    final: {
      titulo: 'Планируете увидеть сакуру в Киото в 2027 году?',
      texto: 'Напишите даты вашего визита в Telegram @Larik_Yokota (ответит сам Ларион), и мы заранее согласуем удобный маршрут для вашей компании.',
      boton: 'Написать в Telegram'
    },
    saludo: 'Здравствуйте, Ларион! Планируем поездку в Киото на цветение сакуры 2027 года. Наши даты: ',
    volver: 'На главную'
  }
}

// ─── Invierno 2026-27 en Kansai (solo Tony: es/en/ar) ────────────────────────
// Fuente: ~/Documents/Guias/estudio-invierno-2026-27.md (§1.2 calendario, §3 tours).
// Precio siempre por grupo. Sin viernes (1-1, 11-12, 18-12, 25-12, 29-1 y 5-2 lo son),
// sin alcohol ni Nada (sake), sin Hanatōro (ya no se celebran). Lo que el estudio
// marca como provisional o de fuentes no oficiales va como «sin confirmar».

/** Precios de invierno por grupo (yenes). Los usan los textos y el JSON-LD. */
export const PRECIO_INVIERNO = {
  anoNuevo: 66000, lucesOsaka: 38000, lucesKobe: 45000,
  nieveOnsen: 78000, arimaKobe: 70000, ciruelos: 58000, sakuraTemprano: 64000,
}
const PI = PRECIO_INVIERNO
/** Validez de cada tarifa (Offer.validFrom / priceValidUntil). */
const VALIDEZ = {
  anoNuevo: ['2027-01-02', '2027-01-03'], lucesOsaka: ['2026-12-12', '2026-12-24'], lucesKobe: ['2027-01-30', '2027-02-07'],
  nieveOnsen: ['2026-12-05', '2027-03-20'], ciruelos: ['2027-02-15', '2027-03-19'], sakuraTemprano: ['2027-03-20', '2027-03-31'],
} as const
const tarifa = (k: keyof typeof VALIDEZ, etiqueta: string) => ({ etiqueta, yen: PI[k], desde: VALIDEZ[k][0], hasta: VALIDEZ[k][1] })
/** Campos de las páginas de un solo precio que el invierno no usa (sus tours van en productos). */
const SIN_PLAN_FIJO = { sitiosTitulo: '', sitios: [], diaTitulo: '', dia: [], diaNota: '', medio: '', completo: '' }

const PARADAS = {
  anoNuevo: ['Fushimi Inari-taisha', 'Tōfuku-ji', 'Shimogamo-jinja', 'Ninenzaka', 'Gion'],
  luces: ['Osaka Castle', 'Nakanoshima', 'Midōsuji', 'Kitano Ijinkan', 'Nankinmachi', 'Kobe Luminarie', 'Meriken Park', 'Harborland'],
  nieve: ['Rokko Snow Park', 'Rokko Arima Ropeway', 'Arima Onsen'],
  ciruelos: ['Kitano Tenmangū', 'Kinkaku-ji', 'Jōnan-gū', 'Philosopher\'s Path', 'Nijō Castle'],
}

const yES = (n: number) => yenLocal(n, 'es')
const yEN = (n: number) => yenLocal(n, 'en')

export const INVIERNO: Record<'w-es' | 'w-en' | 'w-ar', PaginaOtono> = {
  'w-es': {
    lang: 'es', ruta: '/es/invierno-kansai/', inicio: '/es/', temporada: 'invierno', guia: 'tony', foto: 'kioto-fushimi',
    seo: {
      titulo: 'Invierno en Kansai 2026-27: Año Nuevo en Kioto, luces de Kobe, nieve y onsen | Tony Kansai Guide',
      descripcion: `Tours privados de invierno con guía en español: Año Nuevo en Kioto sin multitudes, Kobe Luminarie, nieve en Rokko y onsen en Arima, ciruelos. Desde ${yES(PI.lucesOsaka)} por grupo.`,
    },
    antetitulo: 'Invierno 2026-27 · de diciembre a marzo',
    titulo: 'Invierno en Kansai, con guía privado en español.',
    sub: 'Año Nuevo en Kioto antes que las multitudes, las luces de Osaka y Kobe, nieve y onsen en Rokko y Arima, y los primeros ciruelos y cerezos. Solo tu grupo, a tu ritmo.',
    cta: 'Pide tu tour de invierno',
    cuando: {
      titulo: '¿Cómo es el invierno en Kansai?',
      texto: [
        'Frío seco y cielos casi siempre despejados. En Kioto y Osaka apenas nieva, así que para ver nieve hay que subir a la montaña: el Rokko Snow Park, en Kobe, abre el 5 de diciembre de 2026.',
        'Anochece hacia las 17:00. Por eso el invierno es la temporada de las iluminaciones: la tarde da para una segunda actividad.',
        'Las mejores ventanas: Navidad y Año Nuevo (del 20 de diciembre al 6 de enero), febrero con poca gente y Semana Santa (del 21 al 28 de marzo de 2027), que coincide con los primeros cerezos.',
      ],
    },
    ...SIN_PLAN_FIJO,
    preciosTitulo: 'Precios de invierno, por grupo', porGrupo: 'por grupo',
    porPersona: (y) => `Siendo 4: ${y} por persona`,
    notas: [
      'Se paga en efectivo el día del tour o por adelantado con PayPal o Wise.',
      'Cancelación sin coste hasta 72 horas antes.',
      'No hay tours los viernes.',
    ],
    consejosTitulo: 'Consejos para el invierno',
    consejos: [
      'Abrígate por capas y lleva calzado que no resbale: el frío es seco y en el monte Rokko hace bastante más frío que en la ciudad.',
      'Anochece hacia las 17:00: el día se organiza para aprovechar la luz y las iluminaciones quedan para la tarde.',
      'Del 1 al 3 de enero muchos restaurantes y tiendas cierran: la comida se reserva de antemano.',
      'La comida halal no se improvisa en invierno: la dejamos reservada y confirmada por escrito, o con un bento halal desde Osaka.',
      'Para bañarse en familia en Arima, el baño privado (kashikiri) se reserva con antelación: solo vuestra familia, con toda la intimidad.',
      'Las fechas que aún no se han anunciado se confirman en la web oficial antes de cerrar el itinerario.',
    ],
    final: { titulo: '¿Vienes en invierno?', texto: 'Dinos tus fechas, cuántos sois y qué tour te interesa. Te respondemos directamente, normalmente el mismo día.', boton: 'Escríbenos por WhatsApp' },
    saludo: 'Hola, venimos a Kansai en invierno y nos interesa un tour. Fechas: ',
    volver: 'Volver a la página principal',
    productos: [
      {
        id: 'ano-nuevo', nombre: 'Año Nuevo en Kioto sin multitudes',
        resumen: 'Fushimi Inari antes de la hora punta, templos tranquilos y las costumbres del Año Nuevo japonés explicadas, con la comida ya reservada.',
        duracion: '8 horas', fechas: '2 y 3 de enero de 2027 (sábado y domingo).',
        para: 'Familias en vacaciones de Navidad y parejas. Se vive como cultura: se observa sin participar en los ritos.',
        precios: [tarifa('anoNuevo', 'Día completo · 8 h')],
        ruta: [
          { h: '06:45', t: 'Encuentro en la estación JR Inari (Kioto).' },
          { h: '07:00', t: 'Fushimi Inari antes de la hora punta: subida entre los torii hasta Yotsutsuji.' },
          { h: '09:45', t: 'Tōfuku-ji y sus subtemplos, con poca gente en Año Nuevo.' },
          { h: '11:45', t: 'Comida reservada de antemano (halal confirmada por escrito si la necesitáis).' },
          { h: '13:15', t: 'Bosque de Tadasu y Shimogamo, o el exterior del Palacio Imperial, con el omikuji, el osechi y el kadomatsu explicados.' },
          { h: '15:15', t: 'Ninenzaka y Gion, cuando la gente ya baja.' },
          { h: '16:30', t: 'Té o dulces japoneses (wagashi) y despedida.' },
        ],
        paradas: PARADAS.anoNuevo,
        incluye: ['Guía 8 horas en español', 'Ruta pensada para esquivar las multitudes', 'Reserva de la comida', 'Fotos del día'],
        noIncluye: ['Transporte', 'Comida', 'Entradas y amuletos'],
      },
      {
        id: 'luces', nombre: 'Luces de invierno: Osaka o Kobe',
        resumen: 'Las iluminaciones de invierno con un guía que conoce las calles sin cola: Osaka en diciembre o Kobe Luminarie entre enero y febrero.',
        duracion: 'Osaka 4 h · Kobe 5 h', fechas: 'Osaka: del 12 al 24 de diciembre de 2026. Kobe: del 30 de enero al 7 de febrero de 2027. Sin viernes.',
        para: 'Familias, parejas y quien tiene un día de escala o la tarde libre.',
        precios: [tarifa('lucesOsaka', 'Osaka · 4 h'), tarifa('lucesKobe', 'Kobe · 5 h')],
        ruta: [
          { h: 'Osaka', t: '16:00 Castillo de Osaka al atardecer (exterior) · 17:30 proyecciones en el Ayuntamiento Central de Nakanoshima · 19:00 Midosuji iluminado hacia Namba y cena halal (aparte).' },
          { h: 'Kobe', t: '15:30 Encuentro en Sannomiya · 15:45 Kitano Ijinkan, las casas occidentales · 17:00 Chinatown de Nankinmachi, algo ligero a vuestra elección (halal, vegetariano o marisco) · 17:45 Kobe Luminarie por calles que evitan la cola principal · 19:30 Paseo por el puerto (Harborland) y despedida.' },
        ],
        paradas: PARADAS.luces,
        incluye: ['Guía en español', 'Ruta para esquivar las colas', 'Recomendaciones de cena halal'],
        noIncluye: ['Transporte', 'Zona de pago de Meriken Park (Luminarie)', 'Comida y cena'],
      },
      {
        id: 'nieve-onsen', nombre: 'Nieve y onsen: Rokko y Arima',
        resumen: 'Por la mañana, nieve en el monte Rokko. Por la tarde, un baño termal privado solo para tu familia en Arima. Todo en un día y sin conducir.',
        duracion: '9–10 horas', fechas: `Desde el 5 de diciembre de 2026, mientras abra el Rokko Snow Park (fecha de cierre sin confirmar). Si cierra antes, el día se hace en Arima y Kobe por ${yES(PI.arimaKobe)}.`,
        para: 'Familias con niños que nunca han visto la nieve y mayores que quieren onsen sin el cansancio de Kioto.',
        precios: [tarifa('nieveOnsen', 'Jornada · 9–10 h')],
        ruta: [
          { h: '08:30', t: 'Encuentro en Umeda (Osaka).' },
          { h: '09:00', t: 'Tren a Rokko y funicular (Rokko Cable).' },
          { h: '10:15', t: 'Rokko Snow Park: trineos, zona de nieve para niños y alquiler de ropa.' },
          { h: '13:00', t: 'Comida en la montaña: halal o vegetariana preparada de antemano, o bento halal desde Osaka.' },
          { h: '14:00', t: 'Teleférico Rokko–Arima, con vistas nevadas si hay suerte.' },
          { h: '14:30', t: 'Arima Onsen: baño familiar privado (kashikiri) reservado, o baño de pies gratuito; paseo y galletas tansan senbei.' },
          { h: '17:00', t: 'Vuelta a Sannomiya o Umeda.' },
        ],
        paradas: PARADAS.nieve,
        incluye: ['Guía en español', 'Reserva del baño privado (el baño se paga aparte)', 'Plan de comida halal', 'Transporte del guía'],
        noIncluye: ['Trenes y teleféricos', 'Entrada al parque de nieve y alquileres', 'Onsen y comida'],
      },
      {
        id: 'ciruelos-sakura', nombre: 'Ciruelos y primer sakura en Kioto',
        resumen: 'Antes del sakura, Kioto florece en rosa y blanco con los ciruelos, y sin multitudes. A finales de marzo, buscamos los primeros cerezos del año.',
        duracion: '8 horas', fechas: 'Ciruelos: del 15 de febrero al 19 de marzo de 2027. Primer sakura: del 20 al 31 de marzo, con la ruta según la previsión oficial.',
        para: 'Mayores (paso tranquilo y taxi para quien camina poco) y familias en Semana Santa.',
        precios: [tarifa('ciruelos', 'Ciruelos · 8 h'), tarifa('sakuraTemprano', 'Primer sakura · 8 h')],
        ruta: [
          { h: '08:30', t: 'Encuentro en Kioto.' },
          { h: '09:00', t: 'Jardín de ciruelos de Kitano Tenmangū, antes de que se llene.' },
          { h: '10:45', t: 'Kinkaku-ji, el Pabellón Dorado.' },
          { h: '12:00', t: 'Comida halal.' },
          { h: '13:30', t: 'Ciruelos llorones y camelias de Jōnangū (en taxi).' },
          { h: '15:30', t: 'Un templo con apertura especial de invierno, de los abiertos ese día.' },
          { h: 'Sakura', t: 'Del 20 al 31 de marzo cambia la tarde: canal de Okazaki y Camino del Filósofo, o el Castillo de Nijō.' },
        ],
        paradas: PARADAS.ciruelos,
        incluye: ['Guía en español', 'Ruta según la floración del día', 'Reserva de la comida', 'Plan con taxi para quien camina poco (el taxi va aparte)'],
        noIncluye: ['Entradas (jardín de ciruelos, templos, Jōnangū)', 'Transporte y taxi', 'Comida'],
      },
    ],
    invierno: {
      fotoLugar: 'Fushimi Inari-taisha',
      touristType: 'Familias y parejas de España y México',
      esencial: {
        titulo: 'Lo esencial',
        puntos: [
          { k: 'Qué es', v: 'Cuatro tours privados de invierno por Kioto, Osaka, Kobe y Arima, con guía en español. Solo tu grupo, sin desconocidos.' },
          { k: 'Para quién', v: 'Familias en vacaciones de Navidad, parejas, mayores y quien quiera ver nieve, luces o ciruelos sin multitudes.' },
          { k: 'Precio', v: `Desde ${yES(PI.lucesOsaka)} por grupo (4 horas); día completo desde ${yES(PI.ciruelos)}. Es por grupo, no por persona.` },
          { k: 'Cuándo', v: 'Del 5 de diciembre de 2026 al 31 de marzo de 2027. No hay tours los viernes.' },
          { k: 'Reserva', v: 'Por WhatsApp: dinos fechas y cuántos sois y te respondemos normalmente el mismo día.' },
        ],
      },
      tours: {
        titulo: 'Cuatro tours de invierno',
        intro: 'Precio por grupo, no por persona. Trenes, entradas y comidas van aparte: los pagáis en el momento y os decimos cómo.',
        etiquetas: { duracion: 'Duración', fechas: 'Fechas', para: 'Ideal para', ruta: 'La ruta', incluye: 'Incluye', noIncluye: 'No incluye', reservar: 'Pedir este tour' },
      },
      calendario: {
        titulo: 'Calendario del invierno 2026-27',
        intro: 'Lo que pasa en Kansai de diciembre a marzo. Lo marcado «sin confirmar» aún no tiene fecha oficial: lo comprobamos antes de cerrar tu ruta.',
        confirmado: 'Confirmado', sinConfirmar: 'Sin confirmar',
        eventos: [
          { fecha: '5 dic 2026', nombre: 'Abre el Rokko Snow Park', texto: 'Nieve artificial en Kobe, a una hora de Osaka. La fecha de cierre aún no se ha anunciado.', confirmado: true },
          { fecha: '11–25 dic 2026', nombre: 'Osaka Hikari-Renaissance', texto: 'Proyecciones en el Ayuntamiento Central de Nakanoshima, de 17:30 a 21:30. Gratis.', confirmado: true },
          { fecha: 'Hasta fin de dic', nombre: 'Iluminación de Midosuji', texto: 'La gran avenida de Osaka, iluminada. Las fuentes no coinciden en las fechas exactas.', confirmado: false },
          { fecha: '1–3 ene 2027', nombre: 'Hatsumōde, la primera visita del año', texto: 'Los santuarios se llenan de 10:00 a 16:00. Nuestro tour va el 2 y el 3, temprano.', confirmado: true },
          { fecha: 'Ene – mediados de mar', nombre: 'Aperturas especiales de invierno en Kioto', texto: 'Templos que suelen estar cerrados (Kyō no Fuyu no Tabi). La edición 2027 aún no se ha anunciado.', confirmado: false },
          { fecha: 'Sáb 23 ene 2027', nombre: 'Wakakusa Yamayaki (Nara)', texto: 'La quema de la hierba del monte Wakakusa. Fecha calculada, sin confirmar.', confirmado: false },
          { fecha: '29 ene – 7 feb 2027', nombre: 'Kobe Luminarie', texto: 'Del anochecer a las 21:30 en Meriken Park, Higashi Yuenchi y el antiguo barrio extranjero.', confirmado: true },
          { fecha: 'Mié 3 feb 2027', nombre: 'Setsubun', texto: 'Lanzamiento de judías en los santuarios: Yasaka el 2 y el 3, Yoshida del 2 al 4. Horarios por confirmar.', confirmado: true },
          { fecha: 'Desde principios de feb', nombre: 'Jardín de ciruelos de Kitano Tenmangū', texto: 'Lo mejor suele ser a finales de febrero y en la primera quincena de marzo. Apertura aún sin anunciar.', confirmado: false },
          { fecha: 'Jue 25 feb 2027', nombre: 'Baikasai en Kitano Tenmangū', texto: 'La fiesta de los ciruelos: siempre el 25 de febrero.', confirmado: true },
          { fecha: '18 feb – 22 mar 2027', nombre: 'Ciruelos de Jōnangū', texto: 'Ciruelos llorones y camelias. Fechas publicadas por fuentes no oficiales.', confirmado: false },
          { fecha: 'Finales de mar 2027', nombre: 'Primeros cerezos en Kioto y Osaka', texto: 'Puede empezar hacia el 24–28 de marzo; la plena floración media es hacia el 4 de abril. La previsión oficial sale a mediados de diciembre.', confirmado: false },
        ],
      },
      faq: {
        titulo: 'Preguntas frecuentes del invierno',
        preguntas: [
          { p: '¿Nieva en Kioto y Osaka en invierno?', r: `Muy poco. Para ver nieve segura está el Rokko Snow Park (nieve artificial), en Kobe, que abre el 5 de diciembre de 2026 y está a una hora de Osaka. Nuestro tour de nieve y onsen cuesta ${yES(PI.nieveOnsen)} por grupo; si el parque cierra antes de tu viaje, el día se hace en Arima y Kobe por ${yES(PI.arimaKobe)}.` },
          { p: '¿Merece la pena Kioto en Año Nuevo?', r: `Sí, si se evita la hora punta del hatsumōde, de 10:00 a 16:00. El tour de Año Nuevo es el 2 y el 3 de enero de 2027: empieza a las 06:45 en Fushimi Inari, la comida va reservada porque muchos locales cierran, y cuesta ${yES(PI.anoNuevo)} por grupo (8 horas). El 1 de enero no hay tour.` },
          { p: '¿Cuándo es Kobe Luminarie 2027?', r: `Del 29 de enero al 7 de febrero de 2027, del anochecer a las 21:30. Nuestro tour de 5 horas con la Luminarie cuesta ${yES(PI.lucesKobe)} por grupo, del 30 de enero al 7 de febrero (sin viernes). La zona de pago de Meriken Park va aparte.` },
          { p: '¿Se puede ir a un onsen en familia y con intimidad?', r: 'Sí. En Arima hay baños familiares privados (kashikiri) que se reservan de antemano: solo entra vuestra familia. Si no os apetece bañaros, hay baños de pies gratuitos en el pueblo.' },
          { p: '¿Cuándo florecen los ciruelos y el primer sakura en 2027?', r: `Los ciruelos, de mediados de febrero a mediados de marzo; el Baikasai de Kitano Tenmangū es el jueves 25 de febrero. El primer sakura puede llegar hacia el 24–28 de marzo, justo en Semana Santa. El tour de ciruelos cuesta ${yES(PI.ciruelos)} por grupo y el del primer sakura (20–31 de marzo), ${yES(PI.sakuraTemprano)}.` },
        ],
      },
      hermanasTitulo: 'Otras temporadas en Kioto',
      saludoTour: (n) => `Hola, nos interesa el tour «${n}». Fechas: `,
    },
  },

  'w-en': {
    lang: 'en', ruta: '/en/kansai-winter/', inicio: '/en/', temporada: 'invierno', guia: 'tony', foto: 'kioto-fushimi',
    seo: {
      titulo: 'Kansai in Winter 2026-27: Kyoto New Year, Kobe Luminarie, Snow & Onsen Tours | Tony Kansai Guide',
      descripcion: `Private winter tours with a local guide: Kyoto New Year without the crowds, Kobe Luminarie, snow on Mount Rokko, Arima onsen and plum blossom. From ${yEN(PI.lucesOsaka)} per group.`,
    },
    antetitulo: 'Winter 2026-27 · December to March',
    titulo: 'Kansai in winter, with your own private guide.',
    sub: 'Kyoto\'s New Year before the crowds, the winter lights of Osaka and Kobe, snow and hot springs at Rokko and Arima, and the first plum and cherry blossom. Just your group, at your pace.',
    cta: 'Ask about a winter tour',
    cuando: {
      titulo: 'What is winter like in Kansai?',
      texto: [
        'Cold, dry and mostly clear. It rarely snows in Kyoto or Osaka, so for snow you head up the mountain: Rokko Snow Park in Kobe opens on 5 December 2026.',
        'It gets dark around 5pm, which is why winter is illumination season: the evening is free for a second activity.',
        'The best windows: Christmas and New Year (20 December to 6 January), a quiet February, and late March, when the first cherry blossom usually arrives.',
      ],
    },
    ...SIN_PLAN_FIJO,
    preciosTitulo: 'Winter prices, per group', porGrupo: 'per group',
    porPersona: (y) => `For 4 people: ${y} each`,
    notas: [
      'Pay in cash on the day, or in advance with PayPal or Wise.',
      'Free cancellation up to 72 hours before.',
      'No tours on Fridays.',
    ],
    consejosTitulo: 'Winter tips',
    consejos: [
      'Dress in layers and wear shoes with good grip: the cold is dry, and Mount Rokko is much colder than the city.',
      'It gets dark around 5pm, so the day is planned around the daylight and the illuminations are kept for the evening.',
      'From 1 to 3 January many restaurants and shops close, so lunch is booked in advance.',
      'Halal food can\'t be left to chance in winter: we book it and confirm it in writing, or bring a halal bento from Osaka.',
      'For a family soak in Arima, a private bath (kashikiri) is booked ahead: just your family, with complete privacy.',
      'Dates not yet announced are checked on the official sites before your itinerary is fixed.',
    ],
    final: { titulo: 'Coming in winter?', texto: 'Tell us your dates, how many you are and which tour you like. We reply directly, usually the same day.', boton: 'Message us on WhatsApp' },
    saludo: 'Hi, we\'re visiting Kansai this winter and would like a tour. Dates: ',
    volver: 'Back to the main page',
    productos: [
      {
        id: 'new-year', nombre: 'Kyoto New Year, Crowd-Smart',
        resumen: 'Fushimi Inari before the rush, quiet temples and Japan\'s New Year customs explained, with lunch already booked.',
        duracion: '8 hours', fechas: '2 and 3 January 2027 (Saturday and Sunday).',
        para: 'Families on Christmas holidays and couples. Experienced as culture: you watch without taking part in the rites.',
        precios: [tarifa('anoNuevo', 'Full day · 8 h')],
        ruta: [
          { h: '06:45', t: 'Meet at JR Inari Station (Kyoto).' },
          { h: '07:00', t: 'Fushimi Inari before the rush: up through the torii to Yotsutsuji.' },
          { h: '09:45', t: 'Tōfuku-ji and its sub-temples, quiet at New Year.' },
          { h: '11:45', t: 'Lunch booked in advance (halal, confirmed in writing, if you need it).' },
          { h: '13:15', t: 'Tadasu Forest and Shimogamo, or the outside of the Imperial Palace, with omikuji, osechi and kadomatsu explained.' },
          { h: '15:15', t: 'Ninenzaka and Gion as the crowds thin out.' },
          { h: '16:30', t: 'Tea or Japanese sweets (wagashi) and goodbye.' },
        ],
        paradas: PARADAS.anoNuevo,
        incluye: ['8-hour guide in English', 'A route planned to avoid the crowds', 'Lunch reservation', 'Photos of the day'],
        noIncluye: ['Transport', 'Meals', 'Admissions and charms'],
      },
      {
        id: 'winter-lights', nombre: 'Winter Lights: Osaka or Kobe',
        resumen: 'The winter illuminations with a guide who knows the streets without queues: Osaka in December or Kobe Luminarie from late January.',
        duracion: 'Osaka 4 h · Kobe 5 h', fechas: 'Osaka: 12 to 24 December 2026. Kobe: 30 January to 7 February 2027. No Fridays.',
        para: 'Families, couples and anyone with a layover day or a free evening.',
        precios: [tarifa('lucesOsaka', 'Osaka · 4 h'), tarifa('lucesKobe', 'Kobe · 5 h')],
        ruta: [
          { h: 'Osaka', t: '16:00 Osaka Castle at sunset (outside) · 17:30 projection mapping on Nakanoshima\'s Central Public Hall · 19:00 the lit-up Midosuji towards Namba, with a halal dinner (extra).' },
          { h: 'Kobe', t: '15:30 Meet at Sannomiya · 15:45 Kitano Ijinkan, the old Western houses · 17:00 Nankinmachi Chinatown, a light bite of your choice (halal, vegetarian or seafood) · 17:45 Kobe Luminarie via side streets that skip the main queue · 19:30 harbour walk at Harborland and goodbye.' },
        ],
        paradas: PARADAS.luces,
        incluye: ['Guide in English', 'A route that skips the queues', 'Halal dinner recommendations'],
        noIncluye: ['Transport', 'Meriken Park paid area (Luminarie)', 'Food and dinner'],
      },
      {
        id: 'snow-onsen', nombre: 'Snow & Hot Springs: Rokko and Arima',
        resumen: 'Morning snow play on Mount Rokko, then an afternoon in a private family hot-spring bath in Arima. One day, no driving.',
        duracion: '9–10 hours', fechas: `From 5 December 2026, while Rokko Snow Park is open (closing date not yet confirmed). If it closes earlier, the day becomes Arima and Kobe for ${yEN(PI.arimaKobe)}.`,
        para: 'Families with children who have never seen snow, and older travellers who want an onsen without Kyoto\'s walking.',
        precios: [tarifa('nieveOnsen', 'Long day · 9–10 h')],
        ruta: [
          { h: '08:30', t: 'Meet in Umeda (Osaka).' },
          { h: '09:00', t: 'Train to Rokko and the Rokko Cable funicular.' },
          { h: '10:15', t: 'Rokko Snow Park: sledging, a children\'s snow area and clothing hire.' },
          { h: '13:00', t: 'Lunch on the mountain: halal or vegetarian arranged ahead, or a halal bento from Osaka.' },
          { h: '14:00', t: 'Rokko–Arima Ropeway, with snowy views if we\'re lucky.' },
          { h: '14:30', t: 'Arima Onsen: a booked private family bath (kashikiri) or the free foot bath, then a stroll and tansan senbei crackers.' },
          { h: '17:00', t: 'Back to Sannomiya or Umeda.' },
        ],
        paradas: PARADAS.nieve,
        incluye: ['Guide in English', 'Private bath booking (the bath is paid separately)', 'Halal meal plan', 'Guide\'s transport'],
        noIncluye: ['Trains and ropeways', 'Snow park entry and hire', 'Onsen and meals'],
      },
      {
        id: 'plum-sakura', nombre: 'Kyoto Plum Blossom & First Sakura',
        resumen: 'Before the cherry blossom, Kyoto blooms pink and white with plum trees, without the crowds. In late March, we chase the first sakura of the year.',
        duracion: '8 hours', fechas: 'Plum blossom: 15 February to 19 March 2027. First sakura: 20 to 31 March, with the route set by the official forecast.',
        para: 'Older travellers (gentle pace, taxis for those who walk less) and families over Easter or Eid.',
        precios: [tarifa('ciruelos', 'Plum blossom · 8 h'), tarifa('sakuraTemprano', 'First sakura · 8 h')],
        ruta: [
          { h: '08:30', t: 'Meet in Kyoto.' },
          { h: '09:00', t: 'Kitano Tenmangū\'s plum garden, before it fills up.' },
          { h: '10:45', t: 'Kinkaku-ji, the Golden Pavilion.' },
          { h: '12:00', t: 'Halal lunch.' },
          { h: '13:30', t: 'Weeping plums and camellias at Jōnangū (by taxi).' },
          { h: '15:30', t: 'A temple on its special winter opening, chosen from those open that day.' },
          { h: 'Sakura', t: 'From 20 to 31 March the afternoon changes: Okazaki Canal and the Philosopher\'s Path, or Nijō Castle.' },
        ],
        paradas: PARADAS.ciruelos,
        incluye: ['Guide in English', 'A route set by what\'s in bloom that day', 'Lunch reservation', 'A taxi plan for those who walk less (taxi extra)'],
        noIncluye: ['Admissions (plum garden, temples, Jōnangū)', 'Transport and taxis', 'Meals'],
      },
    ],
    invierno: {
      fotoLugar: 'Fushimi Inari-taisha',
      touristType: 'Families and couples from the UK and USA',
      esencial: {
        titulo: 'At a glance',
        puntos: [
          { k: 'What', v: 'Four private winter tours in Kyoto, Osaka, Kobe and Arima with an English-speaking guide. Just your group, no strangers.' },
          { k: 'Who for', v: 'Families on Christmas holidays, couples, older travellers and anyone who wants snow, lights or plum blossom without the crowds.' },
          { k: 'Price', v: `From ${yEN(PI.lucesOsaka)} per group (4 hours); full day from ${yEN(PI.ciruelos)}. Per group, not per person.` },
          { k: 'When', v: '5 December 2026 to 31 March 2027. No tours on Fridays.' },
          { k: 'Booking', v: 'On WhatsApp: tell us your dates and group size and we usually reply the same day.' },
        ],
      },
      tours: {
        titulo: 'Four winter tours',
        intro: 'Prices are per group, not per person. Trains, admissions and meals are extra: you pay as you go and we show you how.',
        etiquetas: { duracion: 'Duration', fechas: 'Dates', para: 'Best for', ruta: 'The route', incluye: 'Included', noIncluye: 'Not included', reservar: 'Ask about this tour' },
      },
      calendario: {
        titulo: 'Winter calendar 2026-27',
        intro: 'What\'s on in Kansai from December to March. Anything marked "not yet confirmed" has no official date yet: we check it before fixing your route.',
        confirmado: 'Confirmed', sinConfirmar: 'Not yet confirmed',
        eventos: [
          { fecha: '5 Dec 2026', nombre: 'Rokko Snow Park opens', texto: 'Machine-made snow in Kobe, an hour from Osaka. The closing date hasn\'t been announced.', confirmado: true },
          { fecha: '11–25 Dec 2026', nombre: 'Osaka Hikari-Renaissance', texto: 'Projection mapping on Nakanoshima\'s Central Public Hall, 5:30pm to 9:30pm. Free.', confirmado: true },
          { fecha: 'Until late Dec', nombre: 'Midosuji illuminations', texto: 'Osaka\'s main boulevard lit up. Sources disagree on the exact dates.', confirmado: false },
          { fecha: '1–3 Jan 2027', nombre: 'Hatsumōde, the first shrine visit of the year', texto: 'Shrines are packed from 10am to 4pm. Our tour runs on the 2nd and 3rd, early.', confirmado: true },
          { fecha: 'Jan – mid-Mar', nombre: 'Kyoto\'s special winter openings', texto: 'Temples that are usually closed (Kyō no Fuyu no Tabi). The 2027 edition hasn\'t been announced yet.', confirmado: false },
          { fecha: 'Sat 23 Jan 2027', nombre: 'Wakakusa Yamayaki (Nara)', texto: 'The burning of the grass on Mount Wakakusa. Calculated date, not yet confirmed.', confirmado: false },
          { fecha: '29 Jan – 7 Feb 2027', nombre: 'Kobe Luminarie', texto: 'From dusk to 9:30pm at Meriken Park, Higashi Yuenchi and the former foreign settlement.', confirmado: true },
          { fecha: 'Wed 3 Feb 2027', nombre: 'Setsubun', texto: 'Bean-throwing at the shrines: Yasaka on the 2nd and 3rd, Yoshida from the 2nd to the 4th. Times to be confirmed.', confirmado: true },
          { fecha: 'From early Feb', nombre: 'Kitano Tenmangū plum garden', texto: 'Usually best in late February and the first half of March. Opening not yet announced.', confirmado: false },
          { fecha: 'Thu 25 Feb 2027', nombre: 'Baikasai at Kitano Tenmangū', texto: 'The plum blossom festival, always on 25 February.', confirmado: true },
          { fecha: '18 Feb – 22 Mar 2027', nombre: 'Jōnangū plum blossom', texto: 'Weeping plums and camellias. Dates from unofficial sources.', confirmado: false },
          { fecha: 'Late Mar 2027', nombre: 'First cherry blossom in Kyoto and Osaka', texto: 'It may start around 24–28 March; average full bloom is around 4 April. The official forecast comes out in mid-December.', confirmado: false },
        ],
      },
      faq: {
        titulo: 'Winter questions',
        preguntas: [
          { p: 'Does it snow in Kyoto and Osaka in winter?', r: `Very little. For guaranteed snow there's Rokko Snow Park (machine-made snow) in Kobe, opening on 5 December 2026, an hour from Osaka. Our snow and onsen tour is ${yEN(PI.nieveOnsen)} per group; if the park closes before your trip, the day becomes Arima and Kobe for ${yEN(PI.arimaKobe)}.` },
          { p: 'Is Kyoto worth visiting at New Year?', r: `Yes, if you avoid the hatsumōde rush between 10am and 4pm. Our New Year tour runs on 2 and 3 January 2027: it starts at 6:45am at Fushimi Inari, lunch is pre-booked because many places close, and it costs ${yEN(PI.anoNuevo)} per group for 8 hours. There is no tour on 1 January.` },
          { p: 'When is Kobe Luminarie 2027?', r: `From 29 January to 7 February 2027, from dusk to 9:30pm. Our 5-hour tour with the Luminarie is ${yEN(PI.lucesKobe)} per group, from 30 January to 7 February (no Fridays). The paid area at Meriken Park is extra.` },
          { p: 'Can a family use an onsen privately?', r: 'Yes. Arima has private family baths (kashikiri), booked in advance, where only your family goes in. If you\'d rather not bathe, there are free foot baths in the village.' },
          { p: 'When are the plum and first cherry blossoms in 2027?', r: `Plum blossom runs from mid-February to mid-March; the Baikasai festival at Kitano Tenmangū is on Thursday 25 February. The first sakura may arrive around 24–28 March. The plum tour is ${yEN(PI.ciruelos)} per group and the first-sakura tour (20–31 March) ${yEN(PI.sakuraTemprano)}.` },
        ],
      },
      hermanasTitulo: 'Other seasons in Kyoto',
      saludoTour: (n) => `Hi, we're interested in the "${n}" tour. Dates: `,
    },
  },

  'w-ar': {
    lang: 'ar', ruta: '/ar/kansai-winter/', inicio: '/ar/', temporada: 'invierno', guia: 'tony', foto: 'kioto-fushimi',
    seo: {
      titulo: 'شتاء كانساي 2026-27: الثلج والينابيع الحارة وأضواء كوبي مع مرشد بالعربية | Tony Kansai Guide',
      descripcion: `جولات شتوية خاصة لعائلتك بالعربية: ثلج جبل روكو وحمّام عائلي خاص في أريما، وأضواء كوبي لومينيري، وأزهار البرقوق في كيوتو، مع طعام حلال محجوز. من ${yEN(PI.lucesOsaka)} للمجموعة.`,
    },
    antetitulo: 'شتاء 2026-27 · من ديسمبر إلى مارس',
    titulo: 'شتاء كانساي مع مرشد خاص يتحدث العربية',
    sub: 'ثلج ولعب للأطفال على جبل روكو، وحمّام ينابيع حارة خاص بعائلتك في أريما، وأضواء أوساكا وكوبي، وأولى أزهار البرقوق والكرز في كيوتو. لمجموعتكم وحدها، وعلى راحتكم.',
    cta: 'اطلب جولتك الشتوية',
    cuando: {
      titulo: 'كيف يكون الشتاء في كانساي؟',
      texto: [
        'برد جاف وسماء صافية في أغلب الأيام. نادراً ما يتساقط الثلج في كيوتو وأوساكا، ولذلك نصعد إلى الجبل لرؤيته: تفتح حديقة روكو للثلج في كوبي يوم 5 ديسمبر 2026.',
        'تغيب الشمس نحو الساعة الخامسة مساءً، ولهذا يُعرف الشتاء بموسم الإضاءات: يتسع المساء لنشاط ثانٍ بعد جولة النهار.',
        'أنسب الفترات للعائلات: عطلة ديسمبر ويناير، وأضواء كوبي من 29 يناير إلى 7 فبراير قبل رمضان، ثم عطلة عيد الفطر وما بعدها (نحو 9–20 مارس 2027 حسب رؤية الهلال)، حين تتفتح أزهار البرقوق ويبدأ الكرز.',
      ],
    },
    ...SIN_PLAN_FIJO,
    preciosTitulo: 'أسعار الشتاء للمجموعة', porGrupo: 'للمجموعة',
    porPersona: (y) => `لأربعة أشخاص: ${y} للشخص`,
    notas: [
      'الدفع نقداً يوم الجولة، أو مسبقاً عبر PayPal أو Wise.',
      'الإلغاء مجاني حتى 72 ساعة قبل الموعد.',
      'لا جولات يوم الجمعة.',
    ],
    consejosTitulo: 'نصائح للشتاء',
    consejos: [
      'البسوا طبقات دافئة وأحذية لا تنزلق: البرد جاف، وجبل روكو أبرد بكثير من المدينة.',
      'تغيب الشمس نحو الخامسة مساءً، فنرتّب اليوم للاستفادة من ضوء النهار ونترك الإضاءات للمساء.',
      'من 1 إلى 3 يناير تُغلق مطاعم ومتاجر كثيرة، لذلك نحجز الغداء مسبقاً.',
      'الطعام الحلال في الشتاء لا يُترك للصدفة: نحجزه ونؤكده كتابياً، أو نحمل معنا بينتو حلال من أوساكا.',
      'في أريما نحجز مسبقاً حمّاماً عائلياً خاصاً (كاشيكيري): لعائلتكم وحدها، مع كامل الخصوصية والستر.',
      'المواعيد التي لم تُعلن بعد نتحقق منها في المواقع الرسمية قبل تثبيت برنامجكم.',
    ],
    final: { titulo: 'هل تزوروننا في الشتاء؟', texto: 'أخبرونا بالتواريخ وعدد الأشخاص والجولة التي تهمكم. نرد عليكم مباشرة، وعادةً في اليوم نفسه.', boton: 'راسلنا على واتساب' },
    saludo: 'السلام عليكم، نخطط لزيارة كانساي في الشتاء ونرغب في جولة. التواريخ: ',
    volver: 'العودة إلى الصفحة الرئيسية',
    // Para el Golfo, primero la nieve y las luces; Año Nuevo, al final y como cultura.
    productos: [
      {
        id: 'snow-onsen', nombre: 'الثلج والينابيع الحارة: روكو وأريما',
        resumen: 'في الصباح ثلج ولعب على جبل روكو، وبعد الظهر حمّام ينابيع حارة خاص بعائلتك وحدها في أريما. كل ذلك في يوم واحد ودون قيادة سيارة.',
        duracion: '9–10 ساعات', fechas: `من 5 ديسمبر 2026 ما دامت حديقة روكو للثلج مفتوحة (لم يُعلن موعد الإغلاق بعد). وإن أغلقت قبل زيارتكم، يصبح اليوم في أريما وكوبي بسعر ${yEN(PI.arimaKobe)}.`,
        para: 'العائلات التي لم يرَ أطفالها الثلج من قبل، وكبار السن الذين يريدون الينابيع الحارة دون مشي كيوتو المتعب.',
        precios: [tarifa('nieveOnsen', 'يوم طويل · 9–10 ساعات')],
        ruta: [
          { h: '08:30', t: 'اللقاء في أوميدا (أوساكا).' },
          { h: '09:00', t: 'القطار إلى روكو ثم القطار الجبلي (روكو كيبل).' },
          { h: '10:15', t: 'حديقة روكو للثلج: زلاجات، ومنطقة ثلج للأطفال، وتأجير ملابس الثلج.' },
          { h: '13:00', t: 'غداء على الجبل: وجبة حلال أو نباتية محضّرة مسبقاً، أو بينتو حلال نحمله من أوساكا.' },
          { h: '14:00', t: 'التلفريك من روكو إلى أريما، مع مناظر ثلجية إن حالفنا الحظ.' },
          { h: '14:30', t: 'أريما أونسن: حمّام عائلي خاص (كاشيكيري) محجوز مسبقاً أو حمّام القدمين المجاني، ثم جولة في البلدة وبسكويت تانسان سنبي.' },
          { h: '17:00', t: 'العودة إلى سانوميا أو أوميدا.' },
        ],
        paradas: PARADAS.nieve,
        incluye: ['مرشد يتحدث العربية', 'حجز الحمّام العائلي الخاص (تُدفع رسومه على حدة)', 'خطة وجبات حلال', 'مواصلات المرشد'],
        noIncluye: ['القطارات والتلفريك', 'دخول حديقة الثلج والتأجير', 'الحمّام والوجبات'],
      },
      {
        id: 'winter-lights', nombre: 'أضواء الشتاء: أوساكا أو كوبي',
        resumen: 'إضاءات الشتاء مع مرشد يعرف الطرق الجانبية بعيداً عن الطوابير: أوساكا في ديسمبر، أو كوبي لومينيري من أواخر يناير.',
        duracion: 'أوساكا 4 ساعات · كوبي 5 ساعات', fechas: 'أوساكا: من 12 إلى 24 ديسمبر 2026. كوبي: من 30 يناير إلى 7 فبراير 2027. ما عدا أيام الجمعة.',
        para: 'العائلات والأزواج، ومن لديه يوم ترانزيت أو مساء بلا برنامج.',
        precios: [tarifa('lucesOsaka', 'أوساكا · 4 ساعات'), tarifa('lucesKobe', 'كوبي · 5 ساعات')],
        ruta: [
          { h: 'أوساكا', t: '16:00 قلعة أوساكا عند الغروب (من الخارج) · 17:30 عروض الإسقاط الضوئي على القاعة العامة المركزية في ناكانوشيما · 19:00 شارع ميدوسوجي المضاء باتجاه نامبا، مع عشاء حلال (على حدة).' },
          { h: 'كوبي', t: '15:30 اللقاء في سانوميا · 15:45 بيوت كيتانو الغربية القديمة · 17:00 الحي الصيني نانكينماتشي ووجبة خفيفة من اختياركم (حلال أو نباتية أو مأكولات بحرية) · 17:45 كوبي لومينيري عبر طرق تتجنب الطابور الرئيسي · 19:30 نزهة في الميناء (هاربورلاند) والوداع.' },
        ],
        paradas: PARADAS.luces,
        incluye: ['مرشد يتحدث العربية', 'مسار يتجنب الطوابير', 'اقتراحات لمطاعم عشاء حلال'],
        noIncluye: ['المواصلات', 'المنطقة المدفوعة في حديقة ميريكن (لومينيري)', 'الطعام والعشاء'],
      },
      {
        id: 'plum-sakura', nombre: 'أزهار البرقوق وأول الكرز في كيوتو',
        resumen: 'قبل الكرز تتزين كيوتو بأزهار البرقوق الوردية والبيضاء، وبزحام أقل. وفي أواخر مارس نبحث معكم عن أولى أزهار الكرز في العام.',
        duracion: '8 ساعات', fechas: 'البرقوق: من 15 فبراير إلى 19 مارس 2027. أول الكرز: من 20 إلى 31 مارس، والمسار حسب التوقعات الرسمية.',
        para: 'كبار السن (بإيقاع هادئ وسيارة أجرة لمن يمشي قليلاً)، والعائلات في عطلة العيد.',
        precios: [tarifa('ciruelos', 'البرقوق · 8 ساعات'), tarifa('sakuraTemprano', 'أول الكرز · 8 ساعات')],
        ruta: [
          { h: '08:30', t: 'اللقاء في كيوتو.' },
          { h: '09:00', t: 'حديقة البرقوق في كيتانو تنمانغو قبل أن تزدحم.' },
          { h: '10:45', t: 'كينكاكو-جي، الجناح الذهبي.' },
          { h: '12:00', t: 'غداء حلال.' },
          { h: '13:30', t: 'أشجار البرقوق المتدلية وأزهار الكاميليا في جونانغو (بسيارة أجرة).' },
          { h: '15:30', t: 'معبد من المعابد التي تفتح أبوابها استثنائياً في الشتاء، نختاره مما يكون مفتوحاً ذلك اليوم.' },
          { h: 'الكرز', t: 'من 20 إلى 31 مارس يتغير مسار ما بعد الظهر: قناة أوكازاكي وممشى الفيلسوف، أو قلعة نيجو.' },
        ],
        paradas: PARADAS.ciruelos,
        incluye: ['مرشد يتحدث العربية', 'مسار حسب الأزهار المتفتحة ذلك اليوم', 'حجز الغداء', 'خطة بسيارة أجرة لمن يمشي قليلاً (الأجرة على حدة)'],
        noIncluye: ['تذاكر الدخول (حديقة البرقوق والمعابد وجونانغو)', 'المواصلات وسيارة الأجرة', 'الطعام'],
      },
      {
        id: 'new-year', nombre: 'رأس السنة في كيوتو بعيداً عن الزحام',
        resumen: 'فوشيمي إناري قبل ساعات الذروة، ومعابد هادئة، وشرح لعادات رأس السنة اليابانية، مع غداء محجوز مسبقاً. نشاهدها بوصفها ثقافة، دون المشاركة في الطقوس.',
        duracion: '8 ساعات', fechas: '2 و3 يناير 2027 (السبت والأحد).',
        para: 'العائلات والأزواج الذين يريدون رؤية اليابان في مناسبة لا تتكرر إلا مرة في العام.',
        precios: [tarifa('anoNuevo', 'يوم كامل · 8 ساعات')],
        ruta: [
          { h: '06:45', t: 'اللقاء في محطة JR إناري (كيوتو).' },
          { h: '07:00', t: 'فوشيمي إناري قبل الذروة: صعود بين بوابات التوري حتى يوتسوتسوجي.' },
          { h: '09:45', t: 'معبد توفوكو-جي ومعابده الفرعية، وهي هادئة في رأس السنة.' },
          { h: '11:45', t: 'غداء محجوز مسبقاً، حلال ومؤكَّد كتابياً.' },
          { h: '13:15', t: 'غابة تاداسو وشيموغامو، أو القصر الإمبراطوري من الخارج، مع شرح لعادات العام الجديد.' },
          { h: '15:15', t: 'نينينزاكا وجيون حين يخف الزحام.' },
          { h: '16:30', t: 'شاي أو حلويات يابانية (واغاشي) ثم الوداع.' },
        ],
        paradas: PARADAS.anoNuevo,
        incluye: ['مرشد 8 ساعات يتحدث العربية', 'مسار مصمم لتجنب الزحام', 'حجز الغداء', 'صور اليوم'],
        noIncluye: ['المواصلات', 'الطعام', 'تذاكر الدخول والتمائم'],
      },
    ],
    invierno: {
      fotoLugar: 'Fushimi Inari-taisha',
      touristType: 'عائلات من الخليج',
      esencial: {
        titulo: 'باختصار',
        puntos: [
          { k: 'ما هي', v: 'أربع جولات شتوية خاصة في كيوتو وأوساكا وكوبي وأريما مع مرشد يتحدث العربية. لمجموعتكم وحدها، دون غرباء.' },
          { k: 'لمن', v: 'للعائلات التي تريد أن يرى أطفالها الثلج، وللأزواج وكبار السن، ولمن يحب الأضواء والأزهار بعيداً عن الزحام.' },
          { k: 'السعر', v: `من ${yEN(PI.lucesOsaka)} للمجموعة (4 ساعات)، واليوم الكامل من ${yEN(PI.ciruelos)}. السعر للمجموعة لا للفرد.` },
          { k: 'متى', v: 'من 5 ديسمبر 2026 إلى 31 مارس 2027. لا جولات يوم الجمعة.' },
          { k: 'الحجز', v: 'عبر واتساب: أخبرونا بالتواريخ وعدد الأشخاص، ونرد عليكم عادةً في اليوم نفسه.' },
        ],
      },
      tours: {
        titulo: 'أربع جولات شتوية',
        intro: 'السعر للمجموعة لا للفرد. القطارات وتذاكر الدخول والوجبات تُدفع على حدة في وقتها، ونرشدكم إلى طريقة الدفع.',
        etiquetas: { duracion: 'المدة', fechas: 'التواريخ', para: 'مناسبة لـ', ruta: 'المسار', incluye: 'يشمل', noIncluye: 'لا يشمل', reservar: 'اسأل عن هذه الجولة' },
      },
      calendario: {
        titulo: 'تقويم شتاء 2026-27',
        intro: 'ما يحدث في كانساي من ديسمبر إلى مارس. ما كُتب عليه «غير مؤكد» لم يُعلن موعده الرسمي بعد، ونتحقق منه قبل تثبيت مساركم.',
        confirmado: 'مؤكد', sinConfirmar: 'غير مؤكد',
        eventos: [
          { fecha: '5 ديسمبر 2026', nombre: 'افتتاح حديقة روكو للثلج', texto: 'ثلج صناعي في كوبي، على بعد ساعة من أوساكا. لم يُعلن موعد الإغلاق بعد.', confirmado: true },
          { fecha: '11–25 ديسمبر 2026', nombre: 'أوساكا هيكاري رينيسانس', texto: 'عروض إسقاط ضوئي على القاعة العامة المركزية في ناكانوشيما، من 17:30 إلى 21:30، مجاناً.', confirmado: true },
          { fecha: 'حتى أواخر ديسمبر', nombre: 'إضاءة شارع ميدوسوجي', texto: 'الشارع الرئيسي في أوساكا مضاءً. المصادر لا تتفق على التواريخ الدقيقة.', confirmado: false },
          { fecha: '1–3 يناير 2027', nombre: 'هاتسومودي، أول زيارة للمعابد في العام', texto: 'تزدحم المعابد من 10:00 إلى 16:00. جولتنا يومي 2 و3 يناير، في الصباح الباكر.', confirmado: true },
          { fecha: 'يناير – منتصف مارس', nombre: 'الفتح الاستثنائي لمعابد كيوتو في الشتاء', texto: 'معابد تكون مغلقة عادةً (كيو نو فويو نو تابي). لم تُعلن دورة 2027 بعد.', confirmado: false },
          { fecha: 'السبت 23 يناير 2027', nombre: 'واكاكوسا ياماياكي (نارا)', texto: 'حرق عشب جبل واكاكوسا. موعد محسوب، غير مؤكد.', confirmado: false },
          { fecha: '29 يناير – 7 فبراير 2027', nombre: 'كوبي لومينيري', texto: 'من الغروب حتى 21:30 في حديقة ميريكن وهيغاشي يوينتشي والحي الأجنبي القديم.', confirmado: true },
          { fecha: 'الأربعاء 3 فبراير 2027', nombre: 'سيتسوبون', texto: 'رمي حبوب الفول في المعابد: ياساكا يومي 2 و3، ويوشيدا من 2 إلى 4. الأوقات بانتظار التأكيد.', confirmado: true },
          { fecha: 'من أوائل فبراير', nombre: 'حديقة البرقوق في كيتانو تنمانغو', texto: 'أجمل ما تكون عادةً في أواخر فبراير والنصف الأول من مارس. لم يُعلن موعد الافتتاح بعد.', confirmado: false },
          { fecha: 'الخميس 25 فبراير 2027', nombre: 'مهرجان بايكاساي في كيتانو تنمانغو', texto: 'مهرجان أزهار البرقوق، في 25 فبراير من كل عام.', confirmado: true },
          { fecha: '18 فبراير – 22 مارس 2027', nombre: 'أزهار البرقوق في جونانغو', texto: 'أشجار البرقوق المتدلية والكاميليا. التواريخ من مصادر غير رسمية.', confirmado: false },
          { fecha: 'أواخر مارس 2027', nombre: 'أولى أزهار الكرز في كيوتو وأوساكا', texto: 'قد تبدأ نحو 24–28 مارس، ومتوسط ذروة التفتح نحو 4 أبريل. تصدر أول التوقعات الرسمية في منتصف ديسمبر.', confirmado: false },
        ],
      },
      faq: {
        titulo: 'أسئلة شائعة عن الشتاء',
        preguntas: [
          { p: 'هل يتساقط الثلج في كيوتو وأوساكا في الشتاء؟', r: `قليلاً جداً. لرؤية الثلج بالتأكيد هناك حديقة روكو للثلج (ثلج صناعي) في كوبي، تفتح يوم 5 ديسمبر 2026 وتبعد ساعة عن أوساكا. سعر جولة الثلج والينابيع الحارة ${yEN(PI.nieveOnsen)} للمجموعة، وإن أغلقت الحديقة قبل زيارتكم يصبح اليوم في أريما وكوبي بسعر ${yEN(PI.arimaKobe)}.` },
          { p: 'هل يمكن للعائلة الاستحمام في الينابيع الحارة بخصوصية؟', r: 'نعم. في أريما حمّامات عائلية خاصة (كاشيكيري) تُحجز مسبقاً ولا يدخلها إلا أفراد عائلتكم. وإن لم ترغبوا في الاستحمام، ففي البلدة أحواض مجانية لغمر القدمين.' },
          { p: 'هل يتوفر طعام حلال في جولات الشتاء؟', r: 'نعم، لكنه يُرتّب مسبقاً: نحجز مطعماً حلالاً ونؤكده كتابياً، أو نحمل بينتو حلال من أوساكا في يوم الثلج. ومن 1 إلى 3 يناير تُغلق مطاعم كثيرة، لذلك يكون الحجز المسبق ضرورياً.' },
          { p: 'متى يقام كوبي لومينيري 2027؟', r: `من 29 يناير إلى 7 فبراير 2027، من الغروب حتى 21:30، أي قبل رمضان. سعر جولتنا لمدة 5 ساعات مع اللومينيري ${yEN(PI.lucesKobe)} للمجموعة، من 30 يناير إلى 7 فبراير (ما عدا الجمعة). المنطقة المدفوعة في حديقة ميريكن على حدة.` },
          { p: 'ماذا نرى في كيوتو خلال عطلة عيد الفطر 2027؟', r: `عيد الفطر متوقع نحو 9–11 مارس 2027 حسب رؤية الهلال، وهو موسم أزهار البرقوق، وقد تبدأ أولى أزهار الكرز نحو 24–28 مارس. سعر جولة البرقوق ${yEN(PI.ciruelos)} للمجموعة حتى 19 مارس، وجولة أول الكرز (20–31 مارس) ${yEN(PI.sakuraTemprano)}.` },
        ],
      },
      hermanasTitulo: 'مواسم أخرى في كيوتو',
      saludoTour: (n) => `السلام عليكم، تهمنا جولة «${n}». التواريخ: `,
    },
  },
}
