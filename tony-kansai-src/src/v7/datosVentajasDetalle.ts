// Fichas ampliadas de la página de ventajas: una por cada `clave` de APPS
// (datosVentajas.ts), en ES / EN / AR / RU. Los precios solo dicen lo seguro;
// nada de cifras inventadas que mañana cambien.

export type LangDet = 'es' | 'en' | 'ar' | 'ru'
export interface Detalle { intro: string; para: string[]; pasos: string[]; consejos: string[]; precio: string }

export const DETALLE: Record<string, Record<LangDet, Detalle>> = {
  airalo: {
    es: {
      intro: 'Airalo vende eSIM de datos: una SIM virtual que instalas en el móvil antes de viajar. Al aterrizar en Kansai tienes internet para mapas, traductor y trenes, sin buscar tienda ni cargar con un wifi de bolsillo.',
      para: [
        'Pedir taxi o mirar el tren a Namba nada más salir del aeropuerto de Kansai (KIX).',
        'Usar Google Maps entre los miles de toriis de Fushimi Inari sin perderte.',
        'Compartir fotos de los ciervos de Nara o de Dotonbori al momento, sin buscar wifi.',
      ],
      pasos: [
        'Toca el botón de esta página para abrir Airalo: así la app sabe que vienes de mi web.',
        'Descarga la app, crea tu cuenta y elige una eSIM de Japón con los días y gigas que necesites.',
        'Al pagar, escribe el código PRINCE0661 para tener 450 ¥ de descuento en tu primera eSIM.',
        'Instálala en casa con wifi siguiendo las instrucciones de la app.',
        'Al aterrizar, activa la eSIM y la itinerancia de datos para esa línea.',
      ],
      consejos: [
        'Comprueba antes que tu móvil admite eSIM y está libre (no bloqueado por tu operador).',
        'Es solo de datos: para llamar usa WhatsApp o similar.',
        'No borres la eSIM tras instalarla; si la borras, normalmente no se puede recuperar.',
      ],
      precio: 'El precio de cada plan sale en la app antes de pagar; con mi código, 450 ¥ menos en la primera eSIM.',
    },
    en: {
      intro: 'Airalo sells data eSIMs: a virtual SIM you install on your phone before you travel. When you land in Kansai you have data for maps, translation and trains, with no shop to find and no pocket wifi to carry.',
      para: [
        'Booking a taxi or checking the train to Namba as soon as you leave Kansai Airport (KIX).',
        'Using Google Maps among the thousands of torii gates at Fushimi Inari without getting lost.',
        'Sharing photos of the Nara deer or Dotonbori straight away, without hunting for wifi.',
      ],
      pasos: [
        'Tap the button on this page to open Airalo, so the app knows you come from my page.',
        'Download the app, sign up and choose a Japan eSIM with the days and data you need.',
        'At checkout, enter code PRINCE0661 for ¥450 off your first eSIM.',
        'Install it at home on wifi, following the steps in the app.',
        'When you land, switch the eSIM on and enable data roaming for that line.',
      ],
      consejos: [
        'Check first that your phone supports eSIM and is unlocked.',
        'It is data only: use WhatsApp or similar for calls.',
        'Do not delete the eSIM once installed; it usually cannot be reinstalled.',
      ],
      precio: 'Each plan’s price is shown in the app before you pay; my code takes ¥450 off your first eSIM.',
    },
    ar: {
      intro: 'تبيع Airalo شرائح eSIM للبيانات: شريحة افتراضية تثبّتها على هاتفك قبل السفر. عند وصولك إلى كانساي يكون لديك إنترنت للخرائط والترجمة والقطارات، بلا بحث عن متجر ولا حمل جهاز واي فاي.',
      para: [
        'طلب سيارة أجرة أو معرفة قطار نامبا فور خروجك من مطار كانساي (KIX).',
        'استخدام خرائط Google بين آلاف بوابات التوري في فوشيمي إيناري دون أن تضيع.',
        'مشاركة صور غزلان نارا أو شارع دوتونبوري فورًا دون البحث عن واي فاي.',
      ],
      pasos: [
        'اضغط الزر في هذه الصفحة لفتح Airalo، ليعرف التطبيق أنك قادم من صفحتي.',
        'نزّل التطبيق وأنشئ حسابك واختر شريحة لليابان بعدد الأيام والبيانات التي تحتاجها.',
        'عند الدفع اكتب الرمز PRINCE0661 لتحصل على خصم 450 ين على أول شريحة.',
        'ثبّتها في بيتك عبر الواي فاي باتباع خطوات التطبيق.',
        'عند الوصول فعّل الشريحة وفعّل تجوال البيانات لهذا الخط.',
      ],
      consejos: [
        'تأكد مسبقًا أن هاتفك يدعم eSIM وغير مقفل على شركة اتصالات.',
        'الشريحة للبيانات فقط: استخدم واتساب أو ما يشبهه للمكالمات.',
        'لا تحذف الشريحة بعد تثبيتها، فغالبًا لا يمكن استرجاعها.',
      ],
      precio: 'يظهر سعر كل باقة في التطبيق قبل الدفع، وبرمزي تخصم 450 ين من أول شريحة.',
    },
    ru: {
      intro: 'Airalo продаёт eSIM с мобильным интернетом: виртуальную SIM-карту, которую вы ставите на телефон ещё дома. Приземлившись в Кансае, вы сразу на связи — карты, переводчик, поезда — без поиска салона связи и карманного Wi-Fi.',
      para: [
        'Вызвать такси или найти поезд до Намбы сразу после выхода из аэропорта Кансай (KIX).',
        'Не заблудиться с Google Картами среди тысяч ворот тории в Фусими Инари.',
        'Сразу отправлять фото оленей в Наре или Дотонбори, не ища Wi-Fi.',
      ],
      pasos: [
        'Нажмите кнопку на этой странице, чтобы открыть Airalo: так приложение поймёт, что вы пришли с моего сайта.',
        'Скачайте приложение, зарегистрируйтесь и выберите eSIM для Японии с нужным сроком и объёмом.',
        'При оплате введите код PRINCE0661 — скидка 450 иен на первую eSIM.',
        'Установите eSIM дома через Wi-Fi по инструкции в приложении.',
        'После посадки включите eSIM и роуминг данных для этой линии.',
      ],
      consejos: [
        'Заранее проверьте, что телефон поддерживает eSIM и не привязан к оператору.',
        'Это только интернет: звоните через WhatsApp или похожие приложения.',
        'Не удаляйте eSIM после установки — восстановить её обычно нельзя.',
      ],
      precio: 'Цена каждого тарифа видна в приложении до оплаты; с моим кодом — минус 450 иен на первую eSIM.',
    },
  },

  klook: {
    es: {
      intro: 'Klook es una plataforma asiática de entradas, excursiones y pases de tren. En Kansai la usarás para Universal Studios Japan, el acuario Kaiyukan, billetes de Shinkansen y traslados desde el aeropuerto, casi siempre con un QR en el móvil.',
      para: [
        'Comprar con antelación la entrada a Universal Studios Japan (USJ) y evitar la taquilla.',
        'Reservar el traslado o el billete de tren desde el aeropuerto de Kansai a tu hotel.',
        'Conseguir pases de tren o billetes de Shinkansen desde Shin-Osaka.',
      ],
      pasos: [
        'Toca el botón de esta página para abrir Klook: así la app sabe que vienes de mi web.',
        'Descarga la app o sigue en la web y crea tu cuenta.',
        'Busca la entrada o el pase, elige fecha y paga con tu tarjeta.',
        'Guarda el bono en la app: casi siempre es un QR que enseñas en la entrada.',
      ],
      consejos: [
        'Lee las condiciones: algunas entradas tienen fecha fija y no se cancelan.',
        'Mira si el bono se escanea directamente o hay que canjearlo en un mostrador.',
        'Haz captura del QR por si te quedas sin datos en la cola.',
      ],
      precio: 'App gratis; el precio de cada entrada sale antes de pagar.',
    },
    en: {
      intro: 'Klook is an Asian platform for tickets, day trips and rail passes. In Kansai you will use it for Universal Studios Japan, Kaiyukan Aquarium, Shinkansen tickets and airport transfers, usually with a QR code on your phone.',
      para: [
        'Buying your Universal Studios Japan (USJ) ticket ahead and skipping the ticket office.',
        'Booking a transfer or train ticket from Kansai Airport to your hotel.',
        'Getting rail passes or Shinkansen tickets from Shin-Osaka.',
      ],
      pasos: [
        'Tap the button on this page to open Klook, so the app knows you come from my page.',
        'Download the app or carry on in the browser, and sign up.',
        'Find the ticket or pass, pick a date and pay by card.',
        'Keep the voucher in the app: it is usually a QR code you show at the entrance.',
      ],
      consejos: [
        'Read the terms: some tickets are date-specific and non-refundable.',
        'Check whether the voucher is scanned directly or must be exchanged at a counter.',
        'Screenshot the QR code in case you lose signal in the queue.',
      ],
      precio: 'Free app; each ticket’s price is shown before you pay.',
    },
    ar: {
      intro: 'Klook منصة آسيوية للتذاكر والرحلات وبطاقات القطار. في كانساي ستستخدمها لتذاكر يونيفرسال ستوديوز اليابان وحوض كايوكان المائي والشينكانسن والنقل من المطار، وغالبًا برمز QR على هاتفك.',
      para: [
        'شراء تذكرة يونيفرسال ستوديوز اليابان (USJ) مسبقًا وتجنّب شباك التذاكر.',
        'حجز النقل أو تذكرة القطار من مطار كانساي إلى فندقك.',
        'الحصول على بطاقات القطار أو تذاكر الشينكانسن من محطة شين أوساكا.',
      ],
      pasos: [
        'اضغط الزر في هذه الصفحة لفتح Klook، ليعرف التطبيق أنك قادم من صفحتي.',
        'نزّل التطبيق أو تابع من المتصفح، وأنشئ حسابك.',
        'ابحث عن التذكرة أو البطاقة، واختر التاريخ وادفع ببطاقتك.',
        'احتفظ بالقسيمة في التطبيق: غالبًا رمز QR تعرضه عند المدخل.',
      ],
      consejos: [
        'اقرأ الشروط: بعض التذاكر بتاريخ محدد وغير قابلة للاسترداد.',
        'تحقق هل تُمسح القسيمة مباشرة أم يجب استبدالها عند مكتب.',
        'التقط صورة لرمز QR تحسبًا لانقطاع الإنترنت في الطابور.',
      ],
      precio: 'التطبيق مجاني، ويظهر سعر كل تذكرة قبل الدفع.',
    },
    ru: {
      intro: 'Klook — азиатская платформа билетов, экскурсий и железнодорожных проездных. В Кансае она пригодится для Universal Studios Japan, океанариума Кайюкан, билетов на синкансэн и трансферов из аэропорта, обычно с QR-кодом в телефоне.',
      para: [
        'Заранее купить билет в Universal Studios Japan (USJ) и не стоять в кассу.',
        'Забронировать трансфер или билет на поезд из аэропорта Кансай до отеля.',
        'Купить проездной или билет на синкансэн от станции Син-Осака.',
      ],
      pasos: [
        'Нажмите кнопку на этой странице, чтобы открыть Klook: так приложение поймёт, что вы пришли с моего сайта.',
        'Скачайте приложение или продолжите в браузере и зарегистрируйтесь.',
        'Найдите билет или проездной, выберите дату и оплатите картой.',
        'Ваучер хранится в приложении: обычно это QR-код, который показывают на входе.',
      ],
      consejos: [
        'Читайте условия: некоторые билеты привязаны к дате и не возвращаются.',
        'Проверьте, сканируется ли ваучер сразу или его нужно обменять на стойке.',
        'Сделайте скриншот QR-кода на случай, если в очереди пропадёт связь.',
      ],
      precio: 'Приложение бесплатное; цена билета видна до оплаты.',
    },
  },

  gyg: {
    es: {
      intro: 'GetYourGuide reúne actividades y excursiones de grupo de todo el mundo. En Kansai encontrarás clases de cocina, ceremonia del té y salidas a Nara o Kioto, con opiniones de otros viajeros y cancelación gratis en la mayoría.',
      para: [
        'Una clase de cocina japonesa o de wagashi (dulces tradicionales) en Kioto.',
        'Una ceremonia del té en una casa tradicional, cerca de Gion o de Arashiyama.',
        'Una excursión de grupo de un día a Nara y sus ciervos desde Osaka.',
      ],
      pasos: [
        'Descarga la app desde App Store o Google Play (toca el botón).',
        'Busca por ciudad o actividad y lee las opiniones recientes.',
        'Elige fecha y hora y paga con tu tarjeta.',
        'Lleva el bono en el móvil y revisa el punto de encuentro el día antes.',
      ],
      consejos: [
        'Filtra por cancelación gratis para tener margen si cambia el tiempo.',
        'En clases de cocina, pregunta antes por ingredientes si comes halal o tienes alergias.',
      ],
      precio: 'App gratis; el precio de cada actividad sale antes de pagar.',
    },
    en: {
      intro: 'GetYourGuide brings together activities and group tours worldwide. In Kansai you will find cooking classes, tea ceremonies and trips to Nara or Kyoto, with reviews from other travellers and free cancellation on most.',
      para: [
        'A Japanese cooking or wagashi (traditional sweets) class in Kyoto.',
        'A tea ceremony in a traditional house near Gion or Arashiyama.',
        'A group day trip from Osaka to Nara and its deer.',
      ],
      pasos: [
        'Download the app from the App Store or Google Play (tap the button).',
        'Search by city or activity and read recent reviews.',
        'Pick a date and time and pay by card.',
        'Keep the voucher on your phone and check the meeting point the day before.',
      ],
      consejos: [
        'Filter by free cancellation so you have room if the weather changes.',
        'For cooking classes, ask about ingredients first if you eat halal or have allergies.',
      ],
      precio: 'Free app; each activity’s price is shown before you pay.',
    },
    ar: {
      intro: 'تجمع GetYourGuide الأنشطة والجولات الجماعية حول العالم. في كانساي تجد دروس الطبخ ومراسم الشاي ورحلات إلى نارا أو كيوتو، مع تقييمات المسافرين وإلغاء مجاني في معظمها.',
      para: [
        'درس طبخ ياباني أو حلويات تقليدية (واغاشي) في كيوتو.',
        'مراسم شاي في بيت تقليدي قرب غيون أو أراشيياما.',
        'رحلة جماعية ليوم واحد من أوساكا إلى نارا وغزلانها.',
      ],
      pasos: [
        'نزّل التطبيق من App Store أو Google Play (اضغط الزر).',
        'ابحث حسب المدينة أو النشاط واقرأ التقييمات الحديثة.',
        'اختر التاريخ والوقت وادفع ببطاقتك.',
        'احتفظ بالقسيمة على هاتفك وراجع نقطة اللقاء في اليوم السابق.',
      ],
      consejos: [
        'اختر الأنشطة ذات الإلغاء المجاني لتبقى مرنًا إن تغيّر الطقس.',
        'في دروس الطبخ اسأل مسبقًا عن المكونات إن كنت تأكل حلالًا أو لديك حساسية.',
      ],
      precio: 'التطبيق مجاني، ويظهر سعر كل نشاط قبل الدفع.',
    },
    ru: {
      intro: 'GetYourGuide собирает занятия и групповые экскурсии по всему миру. В Кансае это кулинарные мастер-классы, чайные церемонии и поездки в Нару или Киото — с отзывами путешественников и бесплатной отменой у большинства.',
      para: [
        'Мастер-класс японской кухни или вагаси (традиционных сладостей) в Киото.',
        'Чайная церемония в традиционном доме рядом с Гионом или Арасиямой.',
        'Групповая поездка на день из Осаки в Нару к оленям.',
      ],
      pasos: [
        'Скачайте приложение в App Store или Google Play (нажмите кнопку).',
        'Ищите по городу или занятию и читайте свежие отзывы.',
        'Выберите дату и время и оплатите картой.',
        'Держите ваучер в телефоне и накануне проверьте место встречи.',
      ],
      consejos: [
        'Фильтруйте по бесплатной отмене — на случай плохой погоды.',
        'На кулинарных курсах заранее уточните состав, если вы едите халяль или у вас аллергия.',
      ],
      precio: 'Приложение бесплатное; цена занятия видна до оплаты.',
    },
  },

  kkday: {
    es: {
      intro: 'KKday es una plataforma taiwanesa de excursiones, entradas y pases de tren, muy fuerte en Asia. Desde Osaka ofrece salidas de un día a Nara, Kobe o Amanohashidate, alquiler de kimono y pases, muchas veces con bono QR.',
      para: [
        'Una excursión de un día desde Osaka a Amanohashidate o a Kobe sin organizar trenes.',
        'Alquilar un kimono para pasear por Higashiyama o Arashiyama en Kioto.',
        'Comprar pases de tren o entradas para el acuario Kaiyukan.',
      ],
      pasos: [
        'Toca el botón de esta página para abrir KKday: así la app sabe que vienes de mi web.',
        'Descarga la app o sigue en la web y crea tu cuenta.',
        'Elige la excursión o entrada, la fecha y paga con tu tarjeta.',
        'Guarda el bono en la app; en muchos casos es un QR que enseñas el día de la actividad.',
      ],
      consejos: [
        'Compara con Klook: a veces el mismo tour sale más barato en una u otra.',
        'Revisa la hora y el punto de salida de las excursiones; suelen ser muy puntuales.',
      ],
      precio: 'App gratis; el precio de cada producto sale antes de pagar.',
    },
    en: {
      intro: 'KKday is a Taiwanese platform for day trips, tickets and rail passes, very strong in Asia. From Osaka it offers day trips to Nara, Kobe or Amanohashidate, kimono rental and passes, often with a QR voucher.',
      para: [
        'A day trip from Osaka to Amanohashidate or Kobe without planning the trains.',
        'Renting a kimono to stroll Higashiyama or Arashiyama in Kyoto.',
        'Buying rail passes or tickets for Kaiyukan Aquarium.',
      ],
      pasos: [
        'Tap the button on this page to open KKday, so the app knows you come from my page.',
        'Download the app or carry on in the browser, and sign up.',
        'Choose the trip or ticket, pick a date and pay by card.',
        'Keep the voucher in the app; it is often a QR code you show on the day.',
      ],
      consejos: [
        'Compare with Klook: the same tour is sometimes cheaper on one or the other.',
        'Check the departure time and meeting point; day trips leave very punctually.',
      ],
      precio: 'Free app; each product’s price is shown before you pay.',
    },
    ar: {
      intro: 'KKday منصة تايوانية للرحلات والتذاكر وبطاقات القطار، قوية جدًا في آسيا. من أوساكا تقدّم رحلات يوم واحد إلى نارا وكوبي وأمانوهاشيداتي، وتأجير الكيمونو، وغالبًا بقسيمة QR.',
      para: [
        'رحلة يوم من أوساكا إلى أمانوهاشيداتي أو كوبي دون عناء ترتيب القطارات.',
        'استئجار كيمونو للتجول في هيغاشيياما أو أراشيياما في كيوتو.',
        'شراء بطاقات القطار أو تذاكر حوض كايوكان المائي.',
      ],
      pasos: [
        'اضغط الزر في هذه الصفحة لفتح KKday، ليعرف التطبيق أنك قادم من صفحتي.',
        'نزّل التطبيق أو تابع من المتصفح، وأنشئ حسابك.',
        'اختر الرحلة أو التذكرة والتاريخ وادفع ببطاقتك.',
        'احتفظ بالقسيمة في التطبيق؛ وغالبًا هي رمز QR تعرضه يوم النشاط.',
      ],
      consejos: [
        'قارن مع Klook: أحيانًا تكون الجولة نفسها أرخص في إحداهما.',
        'تحقق من وقت الانطلاق ونقطة اللقاء، فالرحلات تنطلق في موعدها بدقة.',
      ],
      precio: 'التطبيق مجاني، ويظهر سعر كل منتج قبل الدفع.',
    },
    ru: {
      intro: 'KKday — тайваньская платформа экскурсий, билетов и проездных, очень сильная в Азии. Из Осаки предлагает однодневные поездки в Нару, Кобе или Аманохасидате, прокат кимоно и проездные, часто с QR-ваучером.',
      para: [
        'Однодневная поездка из Осаки в Аманохасидате или Кобе без возни с поездами.',
        'Прокат кимоно для прогулки по Хигасияме или Арасияме в Киото.',
        'Покупка проездных или билетов в океанариум Кайюкан.',
      ],
      pasos: [
        'Нажмите кнопку на этой странице, чтобы открыть KKday: так приложение поймёт, что вы пришли с моего сайта.',
        'Скачайте приложение или продолжите в браузере и зарегистрируйтесь.',
        'Выберите экскурсию или билет, дату и оплатите картой.',
        'Ваучер хранится в приложении; часто это QR-код, который показывают в день поездки.',
      ],
      consejos: [
        'Сравнивайте с Klook: одна и та же экскурсия иногда дешевле на одной из платформ.',
        'Проверьте время и место отправления — экскурсии уходят строго по расписанию.',
      ],
      precio: 'Приложение бесплатное; цена видна до оплаты.',
    },
  },

  trip: {
    es: {
      intro: 'Trip.com junta hoteles, vuelos y billetes de tren en una sola app. En Japón es práctica para reservar alojamiento en Osaka o Kioto y comprar billetes de Shinkansen que llegan al móvil.',
      para: [
        'Reservar hotel cerca de la estación de Namba, Umeda o Kioto.',
        'Comprar el Shinkansen desde Shin-Osaka a Tokio o Hiroshima.',
        'Tener vuelos, hotel y trenes del viaje en un solo sitio.',
      ],
      pasos: [
        'Descarga la app desde App Store o Google Play (toca el botón).',
        'Crea tu cuenta y busca hotel, vuelo o tren con tus fechas.',
        'Revisa las condiciones de cancelación y paga con tu tarjeta.',
        'Sigue las instrucciones de la reserva para recoger o usar el billete de tren.',
      ],
      consejos: [
        'En billetes de Shinkansen, lee cómo se recogen o se usan antes del día del viaje.',
        'Compara el precio final con impuestos incluidos antes de pagar.',
      ],
      precio: 'App gratis; el precio final sale antes de pagar.',
    },
    en: {
      intro: 'Trip.com puts hotels, flights and train tickets in one app. In Japan it is handy for booking a place to stay in Osaka or Kyoto and buying Shinkansen tickets straight to your phone.',
      para: [
        'Booking a hotel near Namba, Umeda or Kyoto Station.',
        'Buying Shinkansen tickets from Shin-Osaka to Tokyo or Hiroshima.',
        'Keeping your flights, hotel and trains in one place.',
      ],
      pasos: [
        'Download the app from the App Store or Google Play (tap the button).',
        'Sign up and search hotels, flights or trains for your dates.',
        'Check the cancellation terms and pay by card.',
        'Follow the booking instructions to collect or use your train ticket.',
      ],
      consejos: [
        'For Shinkansen tickets, read how to collect or use them before your travel day.',
        'Compare the final price including taxes before you pay.',
      ],
      precio: 'Free app; the final price is shown before you pay.',
    },
    ar: {
      intro: 'يجمع Trip.com الفنادق ورحلات الطيران وتذاكر القطار في تطبيق واحد. في اليابان هو عملي لحجز الإقامة في أوساكا أو كيوتو وشراء تذاكر الشينكانسن التي تصل إلى هاتفك.',
      para: [
        'حجز فندق قرب محطة نامبا أو أومِيدا أو كيوتو.',
        'شراء تذاكر الشينكانسن من شين أوساكا إلى طوكيو أو هيروشيما.',
        'جمع رحلات الطيران والفندق والقطارات في مكان واحد.',
      ],
      pasos: [
        'نزّل التطبيق من App Store أو Google Play (اضغط الزر).',
        'أنشئ حسابك وابحث عن فندق أو رحلة أو قطار بتواريخك.',
        'راجع شروط الإلغاء وادفع ببطاقتك.',
        'اتبع تعليمات الحجز لاستلام تذكرة القطار أو استخدامها.',
      ],
      consejos: [
        'في تذاكر الشينكانسن اقرأ طريقة الاستلام أو الاستخدام قبل يوم السفر.',
        'قارن السعر النهائي شاملًا الضرائب قبل الدفع.',
      ],
      precio: 'التطبيق مجاني، ويظهر السعر النهائي قبل الدفع.',
    },
    ru: {
      intro: 'Trip.com объединяет отели, авиабилеты и билеты на поезда в одном приложении. В Японии удобно бронировать жильё в Осаке или Киото и покупать билеты на синкансэн прямо в телефон.',
      para: [
        'Забронировать отель рядом со станциями Намба, Умэда или Киото.',
        'Купить билет на синкансэн от Син-Осаки до Токио или Хиросимы.',
        'Держать перелёты, отель и поезда в одном месте.',
      ],
      pasos: [
        'Скачайте приложение в App Store или Google Play (нажмите кнопку).',
        'Зарегистрируйтесь и ищите отель, рейс или поезд на свои даты.',
        'Проверьте условия отмены и оплатите картой.',
        'Следуйте инструкциям в брони, чтобы получить или использовать билет на поезд.',
      ],
      consejos: [
        'Для синкансэна заранее прочитайте, как получить или использовать билет.',
        'Перед оплатой сравните итоговую цену с налогами.',
      ],
      precio: 'Приложение бесплатное; итоговая цена видна до оплаты.',
    },
  },

  agoda: {
    es: {
      intro: 'Agoda es una web de reservas nacida en Asia, con muchísimos hoteles y apartamentos en Japón: desde hoteles cápsula hasta ryokan tradicionales. Suele tener precios muy competitivos en Osaka y Kioto.',
      para: [
        'Encontrar un ryokan con tatami y baño tradicional en Kioto.',
        'Buscar apartamentos para familias o grupos cerca de Namba o Shin-Osaka.',
        'Comparar precios de hoteles junto a la estación de Nara o Kobe.',
      ],
      pasos: [
        'Descarga la app desde App Store o Google Play (toca el botón).',
        'Busca por ciudad o barrio y filtra por precio y valoración.',
        'Elige una tarifa con cancelación gratis si no tienes las fechas cerradas.',
        'Paga y guarda la confirmación para enseñarla en recepción.',
      ],
      consejos: [
        'Fíjate si la tarifa se paga ahora o en el hotel, y si es reembolsable.',
        'Mira la distancia real a la estación: en Kioto ahorra mucho tiempo.',
      ],
      precio: 'App gratis; el precio final con impuestos sale antes de pagar.',
    },
    en: {
      intro: 'Agoda is a booking site born in Asia, with a huge range of hotels and apartments in Japan, from capsule hotels to traditional ryokan. Its prices in Osaka and Kyoto are often very competitive.',
      para: [
        'Finding a ryokan with tatami rooms and a traditional bath in Kyoto.',
        'Looking for family or group apartments near Namba or Shin-Osaka.',
        'Comparing hotel prices by Nara or Kobe stations.',
      ],
      pasos: [
        'Download the app from the App Store or Google Play (tap the button).',
        'Search by city or area and filter by price and rating.',
        'Choose a free-cancellation rate if your dates are not fixed.',
        'Pay and keep the confirmation to show at reception.',
      ],
      consejos: [
        'Check whether you pay now or at the hotel, and whether the rate is refundable.',
        'Look at the real distance to the station; in Kyoto it saves a lot of time.',
      ],
      precio: 'Free app; the final price with taxes is shown before you pay.',
    },
    ar: {
      intro: 'Agoda موقع حجز نشأ في آسيا، فيه عدد ضخم من الفنادق والشقق في اليابان، من فنادق الكبسولات إلى الريوكان التقليدي. أسعاره في أوساكا وكيوتو تنافسية جدًا في الغالب.',
      para: [
        'العثور على ريوكان بغرف تاتامي وحمّام تقليدي في كيوتو.',
        'البحث عن شقق للعائلات أو المجموعات قرب نامبا أو شين أوساكا.',
        'مقارنة أسعار الفنادق قرب محطة نارا أو كوبي.',
      ],
      pasos: [
        'نزّل التطبيق من App Store أو Google Play (اضغط الزر).',
        'ابحث حسب المدينة أو الحي، ورتّب حسب السعر والتقييم.',
        'اختر سعرًا بإلغاء مجاني إن لم تكن تواريخك نهائية.',
        'ادفع واحتفظ بالتأكيد لتعرضه في الاستقبال.',
      ],
      consejos: [
        'انتبه هل الدفع الآن أم في الفندق، وهل السعر قابل للاسترداد.',
        'انظر إلى المسافة الحقيقية حتى المحطة؛ في كيوتو توفّر وقتًا كثيرًا.',
      ],
      precio: 'التطبيق مجاني، ويظهر السعر النهائي شاملًا الضرائب قبل الدفع.',
    },
    ru: {
      intro: 'Agoda — сервис бронирования из Азии с огромным выбором отелей и апартаментов в Японии, от капсульных отелей до традиционных рёканов. Цены в Осаке и Киото часто очень выгодные.',
      para: [
        'Найти рёкан с татами и традиционной баней в Киото.',
        'Подобрать апартаменты для семьи или группы рядом с Намбой или Син-Осакой.',
        'Сравнить цены отелей у станций Нара или Кобе.',
      ],
      pasos: [
        'Скачайте приложение в App Store или Google Play (нажмите кнопку).',
        'Ищите по городу или району, фильтруйте по цене и оценке.',
        'Если даты не точные, выбирайте тариф с бесплатной отменой.',
        'Оплатите и сохраните подтверждение для стойки регистрации.',
      ],
      consejos: [
        'Смотрите, платите вы сейчас или в отеле, и возвращается ли тариф.',
        'Проверяйте реальное расстояние до станции — в Киото это экономит много времени.',
      ],
      precio: 'Приложение бесплатное; итоговая цена с налогами видна до оплаты.',
    },
  },

  booking: {
    es: {
      intro: 'Booking.com es la web de reservas de alojamiento más conocida. En Kansai tiene hoteles en todas las zonas útiles, y muchas tarifas se pagan en el hotel y se cancelan gratis, lo que da margen si cambian los planes.',
      para: [
        'Dormir en Namba para tener Dotonbori y el metro a un paso.',
        'Alojarte junto a la estación de Kioto para salir temprano a Fushimi Inari o Nara.',
        'Una noche cerca de Shin-Osaka si al día siguiente tomas el Shinkansen.',
      ],
      pasos: [
        'Descarga la app desde App Store o Google Play (toca el botón).',
        'Busca por ciudad o barrio y filtra por «cancelación gratis» y valoración.',
        'Reserva y revisa si pagas ahora o al llegar al hotel.',
        'Guarda la confirmación en la app para el check-in.',
      ],
      consejos: [
        'En Japón las habitaciones suelen ser pequeñas: mira los metros si viajas con maletas grandes.',
        'Comprueba la hora de check-in; muchos hoteles guardan el equipaje si llegas antes.',
      ],
      precio: 'App gratis; el precio final sale antes de reservar.',
    },
    en: {
      intro: 'Booking.com is the best-known accommodation site. In Kansai it has hotels in every useful area, and many rates are paid at the hotel and cancel for free, which gives you room if plans change.',
      para: [
        'Staying in Namba with Dotonbori and the subway on your doorstep.',
        'Staying by Kyoto Station for early starts to Fushimi Inari or Nara.',
        'A night near Shin-Osaka if you catch the Shinkansen the next day.',
      ],
      pasos: [
        'Download the app from the App Store or Google Play (tap the button).',
        'Search by city or area and filter by "free cancellation" and rating.',
        'Book and check whether you pay now or at the hotel.',
        'Keep the confirmation in the app for check-in.',
      ],
      consejos: [
        'Rooms in Japan are often small: check the size if you travel with big suitcases.',
        'Check the check-in time; many hotels will hold your bags if you arrive early.',
      ],
      precio: 'Free app; the final price is shown before you book.',
    },
    ar: {
      intro: 'Booking.com أشهر موقع لحجز الإقامة. في كانساي فيه فنادق في كل المناطق المفيدة، وكثير من الأسعار تُدفع في الفندق ويمكن إلغاؤها مجانًا، ما يمنحك مرونة إن تغيّرت خططك.',
      para: [
        'الإقامة في نامبا حيث دوتونبوري والمترو على بعد خطوات.',
        'الإقامة قرب محطة كيوتو للانطلاق باكرًا إلى فوشيمي إيناري أو نارا.',
        'ليلة قرب شين أوساكا إن كنت ستركب الشينكانسن في اليوم التالي.',
      ],
      pasos: [
        'نزّل التطبيق من App Store أو Google Play (اضغط الزر).',
        'ابحث حسب المدينة أو الحي، واختر «إلغاء مجاني» والتقييم.',
        'احجز وتحقق هل تدفع الآن أم عند الوصول إلى الفندق.',
        'احتفظ بالتأكيد في التطبيق لتسجيل الوصول.',
      ],
      consejos: [
        'الغرف في اليابان صغيرة غالبًا: راجع المساحة إن كانت حقائبك كبيرة.',
        'تحقق من وقت تسجيل الوصول؛ كثير من الفنادق تحفظ حقائبك إن وصلت باكرًا.',
      ],
      precio: 'التطبيق مجاني، ويظهر السعر النهائي قبل الحجز.',
    },
    ru: {
      intro: 'Booking.com — самый известный сервис бронирования жилья. В Кансае есть отели во всех удобных районах, а многие тарифы оплачиваются в отеле и отменяются бесплатно — это запас на случай смены планов.',
      para: [
        'Жить в Намбе, где Дотонбори и метро в двух шагах.',
        'Остановиться у станции Киото, чтобы рано выезжать в Фусими Инари или Нару.',
        'Переночевать у Син-Осаки, если на следующий день едете на синкансэне.',
      ],
      pasos: [
        'Скачайте приложение в App Store или Google Play (нажмите кнопку).',
        'Ищите по городу или району, фильтруйте по «бесплатной отмене» и оценке.',
        'Бронируйте и проверьте, платите вы сейчас или в отеле.',
        'Сохраните подтверждение в приложении для заселения.',
      ],
      consejos: [
        'Номера в Японии обычно маленькие: смотрите площадь, если у вас большие чемоданы.',
        'Уточните время заселения; многие отели хранят багаж, если вы приехали раньше.',
      ],
      precio: 'Приложение бесплатное; итоговая цена видна до бронирования.',
    },
  },

  welcome: {
    es: {
      intro: 'Welcome Pickups es un traslado privado que reservas antes del viaje. Un conductor te espera en llegadas del aeropuerto de Kansai con un cartel con tu nombre y te lleva directo al hotel, a precio cerrado.',
      para: [
        'Llegar a KIX de noche, cuando ya no te apetece buscar trenes ni hacer transbordos.',
        'Viajar con niños, carrito o muchas maletas hasta tu hotel en Osaka o Kioto.',
        'Volver al aeropuerto el último día sin preocuparte por horarios.',
      ],
      pasos: [
        'Toca el botón de esta página para reservar: así Welcome sabe que vienes de mi web.',
        'Indica aeropuerto, dirección del hotel, número de pasajeros y maletas.',
        'Añade tu número de vuelo y paga: el precio queda cerrado al reservar.',
        'Al salir a llegadas, busca al conductor con el cartel con tu nombre.',
      ],
      consejos: [
        'Pon bien el número de vuelo para que tengan en cuenta los retrasos.',
        'Si necesitas silla infantil, pídela al reservar.',
      ],
      precio: 'Precio cerrado que ves antes de pagar; no hay taxímetro.',
    },
    en: {
      intro: 'Welcome Pickups is a private transfer you book before your trip. A driver waits at Kansai Airport arrivals with a sign bearing your name and takes you straight to your hotel at a fixed price.',
      para: [
        'Landing at KIX late at night, when you do not fancy trains and changes.',
        'Travelling with children, a pushchair or lots of luggage to your Osaka or Kyoto hotel.',
        'Getting back to the airport on your last day without worrying about timetables.',
      ],
      pasos: [
        'Tap the button on this page to book, so Welcome knows you come from my page.',
        'Enter the airport, your hotel address, number of passengers and bags.',
        'Add your flight number and pay: the price is fixed when you book.',
        'At arrivals, look for the driver holding the sign with your name.',
      ],
      consejos: [
        'Enter your flight number correctly so delays are taken into account.',
        'If you need a child seat, request it when you book.',
      ],
      precio: 'Fixed price shown before you pay; no meter.',
    },
    ar: {
      intro: 'Welcome Pickups خدمة نقل خاص تحجزها قبل السفر. ينتظرك السائق في صالة الوصول بمطار كانساي حاملًا لافتة باسمك ويوصلك مباشرة إلى الفندق بسعر ثابت.',
      para: [
        'الوصول إلى مطار KIX ليلًا حين لا ترغب في البحث عن القطارات والتبديل بينها.',
        'السفر مع أطفال أو عربة أطفال أو حقائب كثيرة إلى فندقك في أوساكا أو كيوتو.',
        'العودة إلى المطار في يومك الأخير دون قلق من المواعيد.',
      ],
      pasos: [
        'اضغط الزر في هذه الصفحة للحجز، ليعرف Welcome أنك قادم من صفحتي.',
        'أدخل المطار وعنوان الفندق وعدد الركاب والحقائب.',
        'أضف رقم رحلتك وادفع: السعر ثابت عند الحجز.',
        'في صالة الوصول ابحث عن السائق الذي يحمل لافتة باسمك.',
      ],
      consejos: [
        'اكتب رقم الرحلة بدقة ليُؤخذ أي تأخير في الحسبان.',
        'إن احتجت مقعد طفل فاطلبه عند الحجز.',
      ],
      precio: 'سعر ثابت يظهر قبل الدفع، بلا عدّاد.',
    },
    ru: {
      intro: 'Welcome Pickups — частный трансфер, который бронируют до поездки. Водитель встречает вас в зоне прилёта аэропорта Кансай с табличкой с вашим именем и везёт прямо в отель по фиксированной цене.',
      para: [
        'Прилёт в KIX поздно вечером, когда не хочется разбираться с поездами и пересадками.',
        'Поездка с детьми, коляской или кучей багажа до отеля в Осаке или Киото.',
        'Дорога в аэропорт в последний день без беспокойства о расписании.',
      ],
      pasos: [
        'Нажмите кнопку на этой странице, чтобы забронировать: так Welcome поймёт, что вы пришли с моего сайта.',
        'Укажите аэропорт, адрес отеля, число пассажиров и чемоданов.',
        'Добавьте номер рейса и оплатите: цена фиксируется при бронировании.',
        'В зоне прилёта найдите водителя с табличкой с вашим именем.',
      ],
      consejos: [
        'Указывайте номер рейса точно, чтобы учли возможную задержку.',
        'Если нужно детское кресло, попросите при бронировании.',
      ],
      precio: 'Фиксированная цена видна до оплаты; без счётчика.',
    },
  },

  icoca: {
    es: {
      intro: 'ICOCA es la tarjeta de transporte de JR West para Kansai. En iPhone la añades a la app Cartera y pagas tren, metro y bus acercando el móvil, sin comprar billetes. También sirve en konbinis y máquinas expendedoras.',
      para: [
        'Ir del aeropuerto de Kansai a Osaka o Kioto sin pelearte con las máquinas de billetes.',
        'Tomar la línea JR Nara hasta la estación de Inari, junto a Fushimi Inari.',
        'Pagar el bus en Kioto o un agua en el konbini con solo acercar el iPhone.',
      ],
      pasos: [
        'Abre la app Cartera de tu iPhone (o toca el botón para ver la info oficial).',
        'Pulsa «+», elige «Tarjeta de transporte» y luego ICOCA.',
        'Elige el importe y recarga con la tarjeta que tengas en Apple Pay.',
        'En los tornos, acerca el iPhone al lector; no hace falta desbloquearlo.',
      ],
      consejos: [
        'Si tu tarjeta extranjera no deja recargar, recarga en efectivo en una máquina de la estación o en un konbini.',
        'Funciona también en otras zonas de Japón con tarjetas IC, como Tokio.',
        'Para el Shinkansen necesitas billete aparte.',
      ],
      precio: 'ICOCA en Cartera del iPhone: sin depósito; solo pagas los viajes que recargas.',
    },
    en: {
      intro: 'ICOCA is JR West’s transport card for Kansai. On iPhone you add it to the Wallet app and pay for trains, subway and buses by tapping your phone, with no tickets to buy. It also works in konbini and vending machines.',
      para: [
        'Getting from Kansai Airport to Osaka or Kyoto without battling ticket machines.',
        'Taking the JR Nara Line to Inari Station, right by Fushimi Inari.',
        'Paying for a Kyoto bus or a bottle of water at a konbini with a tap of your iPhone.',
      ],
      pasos: [
        'Open the Wallet app on your iPhone (or tap the button for the official info).',
        'Tap "+", choose "Transit Card" and then ICOCA.',
        'Choose an amount and top up with a card in Apple Pay.',
        'At the gates, hold your iPhone to the reader; no need to unlock it.',
      ],
      consejos: [
        'If your foreign card will not top up, add cash at a station machine or a konbini till.',
        'It also works in other IC card areas of Japan, such as Tokyo.',
        'The Shinkansen needs a separate ticket.',
      ],
      precio: 'ICOCA in iPhone Wallet: no deposit; you only pay the fares you load.',
    },
    ar: {
      intro: 'ICOCA هي بطاقة المواصلات من JR West لمنطقة كانساي. على الآيفون تضيفها إلى تطبيق المحفظة وتدفع أجرة القطار والمترو والحافلة بتقريب هاتفك، دون شراء تذاكر. وتعمل أيضًا في المتاجر الصغيرة وآلات البيع.',
      para: [
        'الانتقال من مطار كانساي إلى أوساكا أو كيوتو دون عناء آلات التذاكر.',
        'ركوب خط JR نارا إلى محطة إيناري بجوار فوشيمي إيناري.',
        'دفع أجرة حافلة كيوتو أو ثمن ماء في متجر كونبيني بلمسة من الآيفون.',
      ],
      pasos: [
        'افتح تطبيق المحفظة في الآيفون (أو اضغط الزر لرؤية المعلومات الرسمية).',
        'اضغط «+» واختر «بطاقة مواصلات» ثم ICOCA.',
        'اختر المبلغ واشحن بالبطاقة المضافة إلى Apple Pay.',
        'عند البوابات قرّب الآيفون من القارئ، ولا حاجة لفتح القفل.',
      ],
      consejos: [
        'إن رفضت بطاقتك الأجنبية الشحن، فاشحن نقدًا من آلة في المحطة أو عند صندوق الكونبيني.',
        'تعمل أيضًا في مناطق أخرى من اليابان تقبل بطاقات IC مثل طوكيو.',
        'الشينكانسن يحتاج تذكرة منفصلة.',
      ],
      precio: 'ICOCA في محفظة الآيفون: بلا تأمين، وتدفع فقط ما تشحنه للرحلات.',
    },
    ru: {
      intro: 'ICOCA — транспортная карта JR West для Кансая. На iPhone её добавляют в приложение Wallet и платят за поезд, метро и автобус, просто поднося телефон, без покупки билетов. Работает и в комбини, и в торговых автоматах.',
      para: [
        'Доехать из аэропорта Кансай до Осаки или Киото, не воюя с билетными автоматами.',
        'Проехать по линии JR Нара до станции Инари рядом с Фусими Инари.',
        'Оплатить автобус в Киото или воду в комбини одним касанием iPhone.',
      ],
      pasos: [
        'Откройте приложение Wallet на iPhone (или нажмите кнопку для официальной информации).',
        'Нажмите «+», выберите «Транспортная карта», затем ICOCA.',
        'Выберите сумму и пополните картой из Apple Pay.',
        'На турникете поднесите iPhone к считывателю — разблокировать не нужно.',
      ],
      consejos: [
        'Если иностранная карта не пополняет баланс, пополните наличными в автомате на станции или на кассе комбини.',
        'Карта работает и в других регионах Японии с IC-картами, например в Токио.',
        'На синкансэн нужен отдельный билет.',
      ],
      precio: 'ICOCA в Wallet на iPhone: без залога; платите только за поездки, на которые пополнили.',
    },
  },

  go: {
    es: {
      intro: 'GO es la app de taxis más usada en Japón. Pides un taxi oficial desde el móvil, ves por dónde viene y el precio aproximado, y puedes pagar en la app. Tiene versión en inglés.',
      para: [
        'Volver al hotel en Osaka tras un día largo en USJ, cuando las piernas ya no dan más.',
        'Ir de un templo a otro en Kioto cuando no pasa ningún taxi libre por la calle.',
        'Moverte con personas mayores o niños pequeños sin cuestas ni transbordos.',
      ],
      pasos: [
        'Descarga GO desde App Store o Google Play (toca el botón).',
        'Regístrate con tu número de teléfono y pon la app en inglés.',
        'Añade tu tarjeta para pagar en la app.',
        'Marca el destino, pide el taxi y comprueba la matrícula al llegar.',
      ],
      consejos: [
        'Las puertas de los taxis en Japón se abren y cierran solas: no las toques.',
        'En horas punta o con lluvia tarda más; pídelo con unos minutos de margen.',
      ],
      precio: 'App gratis; pagas la tarifa del taxi, con el importe aproximado visible antes.',
    },
    en: {
      intro: 'GO is Japan’s most used taxi app. You book a licensed taxi from your phone, watch it arrive, see the approximate fare and can pay in the app. It has an English version.',
      para: [
        'Getting back to your Osaka hotel after a long day at USJ, when your legs are done.',
        'Hopping between temples in Kyoto when no free taxi passes in the street.',
        'Moving around with older relatives or small children, avoiding hills and changes.',
      ],
      pasos: [
        'Download GO from the App Store or Google Play (tap the button).',
        'Sign up with your phone number and switch the app to English.',
        'Add your card to pay in the app.',
        'Set your destination, request the taxi and check the number plate when it arrives.',
      ],
      consejos: [
        'Taxi doors in Japan open and close automatically: leave them alone.',
        'At rush hour or in the rain it takes longer; book a few minutes early.',
      ],
      precio: 'Free app; you pay the taxi fare, with an approximate amount shown first.',
    },
    ar: {
      intro: 'GO هو أكثر تطبيقات سيارات الأجرة استخدامًا في اليابان. تطلب تاكسي مرخّصًا من هاتفك، وترى طريقه والسعر التقريبي، ويمكنك الدفع داخل التطبيق. ويتوفر بالإنجليزية.',
      para: [
        'العودة إلى فندقك في أوساكا بعد يوم طويل في يونيفرسال حين تتعب قدماك.',
        'التنقل بين المعابد في كيوتو حين لا يمر أي تاكسي فارغ في الشارع.',
        'التنقل مع كبار السن أو الأطفال الصغار دون منحدرات أو تبديل قطارات.',
      ],
      pasos: [
        'نزّل GO من App Store أو Google Play (اضغط الزر).',
        'سجّل برقم هاتفك واجعل لغة التطبيق الإنجليزية.',
        'أضف بطاقتك للدفع داخل التطبيق.',
        'حدّد وجهتك واطلب التاكسي وتحقق من رقم اللوحة عند وصوله.',
      ],
      consejos: [
        'أبواب التاكسي في اليابان تُفتح وتُغلق تلقائيًا، فلا تلمسها.',
        'في أوقات الذروة أو المطر يتأخر أكثر، فاطلبه قبل بضع دقائق.',
      ],
      precio: 'التطبيق مجاني، وتدفع أجرة التاكسي مع سعر تقريبي يظهر مسبقًا.',
    },
    ru: {
      intro: 'GO — самое популярное приложение такси в Японии. Вы вызываете лицензированное такси с телефона, видите, где оно, и примерную цену, а оплатить можно в приложении. Есть английская версия.',
      para: [
        'Вернуться в отель в Осаке после долгого дня в USJ, когда ноги уже не идут.',
        'Переезжать между храмами Киото, когда на улице нет свободных такси.',
        'Передвигаться с пожилыми родственниками или маленькими детьми без подъёмов и пересадок.',
      ],
      pasos: [
        'Скачайте GO в App Store или Google Play (нажмите кнопку).',
        'Зарегистрируйтесь по номеру телефона и переключите приложение на английский.',
        'Добавьте карту для оплаты в приложении.',
        'Укажите адрес, вызовите такси и проверьте номер машины при посадке.',
      ],
      consejos: [
        'Двери такси в Японии открываются и закрываются сами — не трогайте их.',
        'В час пик и в дождь ждать дольше — вызывайте с запасом.',
      ],
      precio: 'Приложение бесплатное; вы платите за такси, примерная сумма видна заранее.',
    },
  },

  uber: {
    es: {
      intro: 'En Osaka y Kioto, Uber no tiene coches particulares: pide taxis normales con licencia. Si ya usas Uber en casa, es cómodo porque la app, el idioma y el pago son los de siempre.',
      para: [
        'Pedir un taxi desde Dotonbori o Namba sin explicar la dirección en japonés.',
        'Llegar a Arashiyama temprano, antes de que se llene, desde tu hotel en Kioto.',
        'Ir a la estación de Shin-Osaka con maletas para tomar el Shinkansen.',
      ],
      pasos: [
        'Descarga Uber desde App Store o Google Play (toca el botón), o usa tu cuenta de siempre.',
        'Comprueba que tu tarjeta sigue activa en la app.',
        'Escribe el destino y pide el taxi.',
        'Comprueba la matrícula antes de subir; el pago se hace solo en la app.',
      ],
      consejos: [
        'Escribe el nombre del hotel tal como sale en tu reserva para que el conductor lo encuentre.',
        'Compara con GO: según la zona, una de las dos encuentra taxi antes.',
      ],
      precio: 'App gratis; la tarifa y los posibles cargos salen en la app.',
    },
    en: {
      intro: 'In Osaka and Kyoto, Uber has no private cars: it books regular licensed taxis. If you already use Uber at home, it is easy because the app, language and payment are the ones you know.',
      para: [
        'Getting a taxi from Dotonbori or Namba without explaining the address in Japanese.',
        'Reaching Arashiyama early, before the crowds, from your Kyoto hotel.',
        'Getting to Shin-Osaka Station with luggage to catch the Shinkansen.',
      ],
      pasos: [
        'Download Uber from the App Store or Google Play (tap the button), or use your usual account.',
        'Check your card is still active in the app.',
        'Enter your destination and request the taxi.',
        'Check the number plate before getting in; payment happens in the app.',
      ],
      consejos: [
        'Type your hotel name exactly as it appears in your booking so the driver finds it.',
        'Compare with GO: depending on the area, one of them finds a taxi faster.',
      ],
      precio: 'Free app; the fare and any fees are shown in the app.',
    },
    ar: {
      intro: 'في أوساكا وكيوتو لا يوفّر أوبر سيارات خاصة، بل يطلب سيارات أجرة عادية مرخّصة. إن كنت تستخدم أوبر في بلدك فالأمر سهل، فالتطبيق واللغة وطريقة الدفع هي نفسها.',
      para: [
        'طلب تاكسي من دوتونبوري أو نامبا دون شرح العنوان باليابانية.',
        'الوصول إلى أراشيياما باكرًا قبل الزحام انطلاقًا من فندقك في كيوتو.',
        'الذهاب إلى محطة شين أوساكا مع الحقائب لركوب الشينكانسن.',
      ],
      pasos: [
        'نزّل أوبر من App Store أو Google Play (اضغط الزر)، أو استخدم حسابك المعتاد.',
        'تأكد أن بطاقتك ما زالت مفعّلة في التطبيق.',
        'اكتب وجهتك واطلب التاكسي.',
        'تحقق من رقم اللوحة قبل الركوب؛ الدفع يتم داخل التطبيق.',
      ],
      consejos: [
        'اكتب اسم الفندق كما يظهر في حجزك ليجده السائق بسهولة.',
        'قارن مع GO: بحسب المنطقة قد يجد أحدهما تاكسي أسرع.',
      ],
      precio: 'التطبيق مجاني، والأجرة وأي رسوم تظهر في التطبيق.',
    },
    ru: {
      intro: 'В Осаке и Киото у Uber нет частных машин: приложение вызывает обычные лицензированные такси. Если вы уже пользуетесь Uber дома, это удобно — то же приложение, язык и оплата.',
      para: [
        'Вызвать такси из Дотонбори или Намбы, не объясняя адрес по-японски.',
        'Добраться из отеля в Киото до Арасиямы рано утром, пока нет толп.',
        'Доехать с чемоданами до станции Син-Осака к синкансэну.',
      ],
      pasos: [
        'Скачайте Uber в App Store или Google Play (нажмите кнопку) или используйте свой аккаунт.',
        'Проверьте, что карта в приложении действует.',
        'Укажите адрес и вызовите такси.',
        'Перед посадкой сверьте номер машины; оплата проходит в приложении.',
      ],
      consejos: [
        'Пишите название отеля так же, как в брони, чтобы водитель его нашёл.',
        'Сравнивайте с GO: в зависимости от района одно из приложений находит такси быстрее.',
      ],
      precio: 'Приложение бесплатное; стоимость и возможные сборы видны в приложении.',
    },
  },

  luup: {
    es: {
      intro: 'LUUP es un servicio de patinetes y bicis eléctricas compartidos con «puertos» repartidos por Osaka y Kioto. Lo coges en un puerto, lo dejas en otro y pagas desde la app. Ideal para trayectos cortos.',
      para: [
        'Recorrer la orilla del río Kamo en Kioto en bici eléctrica.',
        'Ir de Namba a Shinsaibashi o Umeda sin bajar al metro.',
        'Moverte por zonas de templos donde el bus va lleno.',
      ],
      pasos: [
        'Descarga LUUP desde App Store o Google Play (toca el botón).',
        'Regístrate y añade tu tarjeta.',
        'Para el patinete: tener 16 años o más y aprobar el test corto de normas de tráfico en la app.',
        'Escanea el QR del vehículo, circula y aparca solo en un puerto LUUP para terminar.',
      ],
      consejos: [
        'En Japón se circula por la izquierda: ve por la calzada, pegado al lado izquierdo.',
        'Nada de ir dos personas, usar el móvil ni circular por la acera con el patinete.',
        'Reserva el puerto de destino en la app si es una zona concurrida.',
      ],
      precio: 'App gratis; el precio del trayecto sale en la app antes de empezar.',
    },
    en: {
      intro: 'LUUP is a shared e-scooter and e-bike service with “ports” all over Osaka and Kyoto. Pick one up at a port, leave it at another and pay in the app. Ideal for short hops.',
      para: [
        'Riding along the Kamo River in Kyoto on an e-bike.',
        'Getting from Namba to Shinsaibashi or Umeda without going underground.',
        'Moving between temple areas where buses are packed.',
      ],
      pasos: [
        'Download LUUP from the App Store or Google Play (tap the button).',
        'Sign up and add your card.',
        'For scooters: be 16 or over and pass the short traffic-rules quiz in the app.',
        'Scan the vehicle’s QR code, ride, and park only at a LUUP port to finish.',
      ],
      consejos: [
        'Japan drives on the left: ride on the road, keeping to the left-hand side.',
        'No passengers, no phone in hand and no riding the scooter on the pavement.',
        'Reserve your destination port in the app in busy areas.',
      ],
      precio: 'Free app; the ride price is shown in the app before you start.',
    },
    ar: {
      intro: 'LUUP خدمة سكوترات ودراجات كهربائية مشتركة، لها «محطات» منتشرة في أوساكا وكيوتو. تأخذ المركبة من محطة وتتركها في أخرى وتدفع من التطبيق. مثالية للمسافات القصيرة.',
      para: [
        'التجول على ضفة نهر كامو في كيوتو بدراجة كهربائية.',
        'الانتقال من نامبا إلى شينسايباشي أو أومِيدا دون نزول المترو.',
        'التنقل بين مناطق المعابد حيث الحافلات مزدحمة.',
      ],
      pasos: [
        'نزّل LUUP من App Store أو Google Play (اضغط الزر).',
        'سجّل وأضف بطاقتك.',
        'للسكوتر: يجب أن يكون عمرك 16 سنة فأكثر وأن تجتاز اختبار قواعد المرور القصير في التطبيق.',
        'امسح رمز QR على المركبة، وانطلق، ثم اركنها في محطة LUUP فقط لإنهاء الرحلة.',
      ],
      consejos: [
        'السير في اليابان على اليسار: قُد على الطريق ملتزمًا بالجانب الأيسر.',
        'لا راكب ثانيًا، ولا هاتف في اليد، ولا قيادة السكوتر على الرصيف.',
        'احجز محطة الوصول في التطبيق إن كانت المنطقة مزدحمة.',
      ],
      precio: 'التطبيق مجاني، ويظهر سعر الرحلة في التطبيق قبل البدء.',
    },
    ru: {
      intro: 'LUUP — прокат электросамокатов и электровелосипедов с «портами» по всей Осаке и Киото. Берёте транспорт в одном порту, оставляете в другом и платите в приложении. Идеально для коротких поездок.',
      para: [
        'Прокатиться вдоль реки Камо в Киото на электровелосипеде.',
        'Доехать от Намбы до Синсайбаси или Умэды, не спускаясь в метро.',
        'Перемещаться между храмами, когда автобусы переполнены.',
      ],
      pasos: [
        'Скачайте LUUP в App Store или Google Play (нажмите кнопку).',
        'Зарегистрируйтесь и добавьте карту.',
        'Для самоката: вам должно быть 16+ и нужно пройти короткий тест по ПДД в приложении.',
        'Отсканируйте QR-код, поезжайте и паркуйтесь только в порту LUUP, чтобы завершить поездку.',
      ],
      consejos: [
        'В Японии левостороннее движение: езжайте по дороге, держась левого края.',
        'Без пассажиров, без телефона в руке и без езды на самокате по тротуару.',
        'В оживлённых районах бронируйте порт назначения в приложении.',
      ],
      precio: 'Приложение бесплатное; стоимость поездки видна до старта.',
    },
  },

  hello: {
    es: {
      intro: 'HELLO CYCLING es una red de bicis eléctricas compartidas con cientos de estaciones en Kansai. En Kioto, donde los buses van llenos, es la forma más agradable de ir de un templo a otro.',
      para: [
        'Recorrer Arashiyama y llegar al bosque de bambú a tu ritmo.',
        'Ir de la estación de Kioto a Higashiyama o Gion sin esperar el bus.',
        'Dar una vuelta por el parque de Nara y sus alrededores.',
      ],
      pasos: [
        'Descarga HELLO CYCLING desde App Store o Google Play (toca el botón).',
        'Crea tu cuenta y añade tu tarjeta para pagar en la app.',
        'Busca una estación cercana en el mapa y reserva una bici.',
        'Desbloquéala, pedalea y devuélvela en cualquier estación con hueco.',
      ],
      consejos: [
        'Mira antes en el mapa que la estación de destino tiene sitio libre.',
        'Circula por la izquierda y aparca solo en estaciones: en Kioto se retiran bicis mal aparcadas.',
      ],
      precio: 'Pagas por tiempo de uso con tarjeta en la app; la tarifa sale antes de alquilar.',
    },
    en: {
      intro: 'HELLO CYCLING is a shared e-bike network with hundreds of stations across Kansai. In Kyoto, where buses are packed, it is the most pleasant way to get from one temple to the next.',
      para: [
        'Exploring Arashiyama and reaching the bamboo grove at your own pace.',
        'Riding from Kyoto Station to Higashiyama or Gion without waiting for a bus.',
        'A ride around Nara Park and the surrounding area.',
      ],
      pasos: [
        'Download HELLO CYCLING from the App Store or Google Play (tap the button).',
        'Sign up and add your card to pay in the app.',
        'Find a nearby station on the map and reserve a bike.',
        'Unlock it, ride, and return it to any station with a free space.',
      ],
      consejos: [
        'Check on the map that your destination station has free spaces.',
        'Keep left and park only at stations: badly parked bikes in Kyoto get removed.',
      ],
      precio: 'Pay by time used, by card in the app; the rate is shown before you rent.',
    },
    ar: {
      intro: 'HELLO CYCLING شبكة دراجات كهربائية مشتركة بمئات المحطات في كانساي. في كيوتو، حيث الحافلات مزدحمة، هي أمتع وسيلة للانتقال من معبد إلى آخر.',
      para: [
        'التجول في أراشيياما والوصول إلى غابة الخيزران على راحتك.',
        'الانتقال من محطة كيوتو إلى هيغاشيياما أو غيون دون انتظار الحافلة.',
        'جولة حول حديقة نارا وما حولها.',
      ],
      pasos: [
        'نزّل HELLO CYCLING من App Store أو Google Play (اضغط الزر).',
        'أنشئ حسابك وأضف بطاقتك للدفع داخل التطبيق.',
        'ابحث عن محطة قريبة على الخريطة واحجز دراجة.',
        'افتح قفلها وانطلق، ثم أعدها إلى أي محطة فيها مكان فارغ.',
      ],
      consejos: [
        'تأكد على الخريطة أن محطة الوصول فيها أماكن فارغة.',
        'التزم باليسار واركن في المحطات فقط، ففي كيوتو تُزال الدراجات المركونة خطأً.',
      ],
      precio: 'تدفع حسب مدة الاستخدام بالبطاقة في التطبيق، ويظهر السعر قبل الاستئجار.',
    },
    ru: {
      intro: 'HELLO CYCLING — сеть проката электровелосипедов с сотнями станций по Кансаю. В Киото, где автобусы переполнены, это самый приятный способ добираться от храма к храму.',
      para: [
        'Объехать Арасияму и спокойно доехать до бамбуковой рощи.',
        'Доехать от станции Киото до Хигасиямы или Гиона, не дожидаясь автобуса.',
        'Прокатиться по парку Нара и окрестностям.',
      ],
      pasos: [
        'Скачайте HELLO CYCLING в App Store или Google Play (нажмите кнопку).',
        'Зарегистрируйтесь и добавьте карту для оплаты в приложении.',
        'Найдите ближайшую станцию на карте и забронируйте велосипед.',
        'Разблокируйте его, катайтесь и верните на любую станцию со свободным местом.',
      ],
      consejos: [
        'Заранее проверьте на карте, есть ли места на станции назначения.',
        'Держитесь левой стороны и паркуйтесь только на станциях: в Киото неправильно оставленные велосипеды увозят.',
      ],
      precio: 'Оплата за время поездки картой в приложении; тариф виден до аренды.',
    },
  },

  wise: {
    es: {
      intro: 'Wise es una cuenta con tarjeta para pagar en otras monedas al cambio real, con comisiones claras. En Japón pagas en yenes en tiendas, restaurantes y taxis, y también sirve para pagarme el tour.',
      para: [
        'Pagar en yenes en el konbini, el restaurante o el taxi sin la comisión de tu banco.',
        'Sacar yenes en los cajeros de 7-Eleven, que aceptan tarjetas extranjeras.',
        'Pagar tu tour conmigo o una reserva en Japón sin sorpresas en el cambio.',
      ],
      pasos: [
        'Descarga Wise desde App Store o Google Play (toca el botón).',
        'Abre tu cuenta y verifica tu identidad en la app.',
        'Pide la tarjeta (o usa la virtual en Apple Pay o Google Pay) y añade dinero.',
        'Cambia a yenes en la app o deja que convierta al pagar.',
      ],
      consejos: [
        'Si el datáfono o el cajero te ofrece cobrar en tu moneda, elige siempre pagar en YENES.',
        'Pide la tarjeta física con tiempo antes del viaje; tarda unos días en llegar.',
        'Revisa en la app cuántas retiradas gratis en cajero tienes al mes.',
      ],
      precio: 'Las comisiones se ven en la app antes de cada cambio.',
    },
    en: {
      intro: 'Wise is an account with a card for paying in other currencies at the real exchange rate, with clear fees. In Japan you pay in yen in shops, restaurants and taxis, and you can use it to pay for your tour with me.',
      para: [
        'Paying in yen at a konbini, restaurant or taxi without your bank’s fees.',
        'Withdrawing yen at 7-Eleven ATMs, which accept foreign cards.',
        'Paying for your tour with me or a booking in Japan with no exchange-rate surprises.',
      ],
      pasos: [
        'Download Wise from the App Store or Google Play (tap the button).',
        'Open your account and verify your identity in the app.',
        'Order the card (or use the virtual one in Apple Pay or Google Pay) and add money.',
        'Convert to yen in the app, or let it convert when you pay.',
      ],
      consejos: [
        'If a card terminal or ATM offers to charge you in your home currency, always choose YEN.',
        'Order the physical card well before you travel; it takes a few days to arrive.',
        'Check in the app how many free ATM withdrawals you get each month.',
      ],
      precio: 'Fees are shown in the app before each conversion.',
    },
    ar: {
      intro: 'Wise حساب مع بطاقة للدفع بعملات أخرى بسعر الصرف الحقيقي ورسوم واضحة. في اليابان تدفع بالين في المتاجر والمطاعم وسيارات الأجرة، ويمكنك الدفع بها ثمن جولتك معي أيضًا.',
      para: [
        'الدفع بالين في الكونبيني أو المطعم أو التاكسي دون رسوم بنكك.',
        'سحب الين من صرافات 7-Eleven التي تقبل البطاقات الأجنبية.',
        'دفع ثمن جولتك معي أو حجز في اليابان دون مفاجآت في سعر الصرف.',
      ],
      pasos: [
        'نزّل Wise من App Store أو Google Play (اضغط الزر).',
        'افتح حسابك وأكمل التحقق من هويتك في التطبيق.',
        'اطلب البطاقة (أو استخدم البطاقة الافتراضية في Apple Pay أو Google Pay) وأضف رصيدًا.',
        'حوّل إلى الين في التطبيق أو اتركه يحوّل عند الدفع.',
      ],
      consejos: [
        'إن عرض عليك جهاز الدفع أو الصراف الدفع بعملة بلدك، فاختر دائمًا الدفع بالين.',
        'اطلب البطاقة المادية قبل السفر بوقت كافٍ، فوصولها يستغرق أيامًا.',
        'راجع في التطبيق عدد عمليات السحب المجانية الشهرية من الصراف.',
      ],
      precio: 'تظهر الرسوم في التطبيق قبل كل عملية تحويل.',
    },
    ru: {
      intro: 'Wise — счёт с картой для оплаты в других валютах по реальному курсу и с понятными комиссиями. В Японии вы платите в иенах в магазинах, ресторанах и такси, а ещё можно оплатить экскурсию со мной.',
      para: [
        'Платить в иенах в комбини, ресторане или такси без комиссий вашего банка.',
        'Снимать иены в банкоматах 7-Eleven, которые принимают иностранные карты.',
        'Оплатить экскурсию со мной или бронь в Японии без сюрпризов с курсом.',
      ],
      pasos: [
        'Скачайте Wise в App Store или Google Play (нажмите кнопку).',
        'Откройте счёт и подтвердите личность в приложении.',
        'Закажите карту (или используйте виртуальную в Apple Pay или Google Pay) и пополните счёт.',
        'Обменяйте деньги на иены в приложении или пусть конвертация идёт при оплате.',
      ],
      consejos: [
        'Если терминал или банкомат предлагает списать в вашей валюте — всегда выбирайте ИЕНЫ.',
        'Закажите пластиковую карту заранее: доставка занимает несколько дней.',
        'Посмотрите в приложении, сколько бесплатных снятий в банкомате у вас в месяц.',
      ],
      precio: 'Комиссии видны в приложении перед каждым обменом.',
    },
  },

  maps: {
    es: {
      intro: 'Google Maps funciona de maravilla en Japón: te dice el andén, la línea, la hora exacta del tren y hasta en qué vagón subir para salir cerca de la salida buena. Es la herramienta que más usarás en Kansai.',
      para: [
        'Saber qué tren tomar desde el aeropuerto de Kansai hasta tu hotel.',
        'Encontrar la salida correcta en estaciones laberínticas como Umeda o Namba.',
        'Ver horarios de bus en Kioto y la ruta a pie hasta Fushimi Inari o Kiyomizu-dera.',
      ],
      pasos: [
        'Descarga Google Maps desde App Store o Google Play (toca el botón).',
        'Inicia sesión con tu cuenta de Google para guardar sitios.',
        'Busca el destino y elige «Transporte público» para ver trenes y buses.',
        'Sigue las indicaciones paso a paso, con andén y salida.',
      ],
      consejos: [
        'Guarda en una lista tu hotel, restaurantes halal y sitios que quieras ver.',
        'Fíjate en el número o letra de salida de la estación: ahorra mucho caminar.',
        'Busca «halal» o «prayer room» en el mapa para encontrar restaurantes y salas de oración.',
      ],
      precio: 'App gratis.',
    },
    en: {
      intro: 'Google Maps works brilliantly in Japan: it tells you the platform, line, exact train time and even which car to board to step out near the right exit. It is the tool you will use most in Kansai.',
      para: [
        'Knowing which train to take from Kansai Airport to your hotel.',
        'Finding the right exit in maze-like stations such as Umeda or Namba.',
        'Checking Kyoto bus times and the walking route to Fushimi Inari or Kiyomizu-dera.',
      ],
      pasos: [
        'Download Google Maps from the App Store or Google Play (tap the button).',
        'Sign in with your Google account to save places.',
        'Search your destination and choose "Transit" to see trains and buses.',
        'Follow the step-by-step directions, with platform and exit.',
      ],
      consejos: [
        'Save your hotel, halal restaurants and places to visit in a list.',
        'Note the station exit number or letter: it saves a lot of walking.',
        'Search "halal" or "prayer room" on the map to find restaurants and prayer spaces.',
      ],
      precio: 'Free app.',
    },
    ar: {
      intro: 'تعمل خرائط Google بشكل ممتاز في اليابان: تخبرك بالرصيف والخط والوقت الدقيق للقطار، بل وبالعربة التي تركبها لتنزل قرب المخرج المناسب. إنها الأداة التي ستستخدمها أكثر في كانساي.',
      para: [
        'معرفة القطار المناسب من مطار كانساي إلى فندقك.',
        'إيجاد المخرج الصحيح في محطات متشعبة مثل أومِيدا ونامبا.',
        'رؤية مواعيد حافلات كيوتو وطريق المشي إلى فوشيمي إيناري أو كيوميزو-ديرا.',
      ],
      pasos: [
        'نزّل خرائط Google من App Store أو Google Play (اضغط الزر).',
        'سجّل الدخول بحساب Google لحفظ الأماكن.',
        'ابحث عن وجهتك واختر «المواصلات العامة» لرؤية القطارات والحافلات.',
        'اتبع الإرشادات خطوة بخطوة مع الرصيف والمخرج.',
      ],
      consejos: [
        'احفظ في قائمة فندقك والمطاعم الحلال والأماكن التي تريد زيارتها.',
        'انتبه إلى رقم أو حرف مخرج المحطة، فهذا يوفّر عليك مشيًا كثيرًا.',
        'ابحث عن «halal» أو «prayer room» على الخريطة لتجد المطاعم وأماكن الصلاة.',
      ],
      precio: 'التطبيق مجاني.',
    },
    ru: {
      intro: 'Google Карты отлично работают в Японии: показывают платформу, линию, точное время поезда и даже вагон, из которого ближе к нужному выходу. В Кансае это будет ваш главный инструмент.',
      para: [
        'Понять, на какой поезд сесть из аэропорта Кансай до отеля.',
        'Найти нужный выход на запутанных станциях вроде Умэды или Намбы.',
        'Смотреть расписание автобусов в Киото и пеший маршрут до Фусими Инари или Киёмидзу-дэры.',
      ],
      pasos: [
        'Скачайте Google Карты в App Store или Google Play (нажмите кнопку).',
        'Войдите в аккаунт Google, чтобы сохранять места.',
        'Найдите пункт назначения и выберите «Общественный транспорт».',
        'Следуйте пошаговым подсказкам с платформой и выходом.',
      ],
      consejos: [
        'Сохраните в список отель, халяльные рестораны и места, которые хотите увидеть.',
        'Обращайте внимание на номер или букву выхода со станции — это экономит много ходьбы.',
        'Ищите на карте «halal» или «prayer room», чтобы найти рестораны и места для намаза.',
      ],
      precio: 'Приложение бесплатное.',
    },
  },

  traductor: {
    es: {
      intro: 'Google Translate te permite leer japonés apuntando con la cámara y hablar con quien sea en modo conversación. En Kansai muchos carteles, cartas y etiquetas solo están en japonés, y aquí es donde te salva.',
      para: [
        'Leer la carta de un restaurante o los ingredientes de un producto en el konbini.',
        'Entender avisos en estaciones, templos o en la máquina de billetes.',
        'Preguntar algo al personal del hotel o de una tienda en modo conversación.',
      ],
      pasos: [
        'Descarga Google Translate desde App Store o Google Play (toca el botón).',
        'Descarga el idioma japonés para usarlo sin conexión.',
        'Usa «Cámara» para leer textos y «Conversación» para hablar.',
        'Guarda las frases que más uses con la estrella.',
      ],
      consejos: [
        'Para comprobar ingredientes, apunta la cámara a la etiqueta y busca palabras como 豚 (cerdo) o ゼラチン (gelatina).',
        'Habla despacio y con frases cortas: la traducción sale mucho mejor.',
      ],
      precio: 'App gratis.',
    },
    en: {
      intro: 'Google Translate lets you read Japanese by pointing your camera and talk to anyone in conversation mode. In Kansai many signs, menus and labels are only in Japanese, and that is where it saves you.',
      para: [
        'Reading a restaurant menu or the ingredients on a konbini product.',
        'Understanding notices at stations, temples or ticket machines.',
        'Asking hotel or shop staff a question in conversation mode.',
      ],
      pasos: [
        'Download Google Translate from the App Store or Google Play (tap the button).',
        'Download Japanese for offline use.',
        'Use "Camera" to read text and "Conversation" to talk.',
        'Star the phrases you use most to save them.',
      ],
      consejos: [
        'To check ingredients, point the camera at the label and look for words like 豚 (pork) or ゼラチン (gelatine).',
        'Speak slowly in short sentences: the translation comes out much better.',
      ],
      precio: 'Free app.',
    },
    ar: {
      intro: 'يتيح لك ترجمة Google قراءة اليابانية بتوجيه الكاميرا والتحدث مع أي شخص في وضع المحادثة. في كانساي كثير من اللافتات والقوائم والملصقات باليابانية فقط، وهنا ينقذك التطبيق.',
      para: [
        'قراءة قائمة مطعم أو مكونات منتج في الكونبيني.',
        'فهم التنبيهات في المحطات والمعابد وآلات التذاكر.',
        'سؤال موظفي الفندق أو المتجر في وضع المحادثة.',
      ],
      pasos: [
        'نزّل ترجمة Google من App Store أو Google Play (اضغط الزر).',
        'نزّل اللغة اليابانية لاستخدامها دون اتصال.',
        'استخدم «الكاميرا» لقراءة النصوص و«المحادثة» للتحدث.',
        'احفظ العبارات التي تستخدمها كثيرًا بالنجمة.',
      ],
      consejos: [
        'للتحقق من المكونات وجّه الكاميرا إلى الملصق وابحث عن كلمات مثل 豚 (لحم خنزير) أو ゼラチン (جيلاتين).',
        'تكلّم ببطء وبجمل قصيرة، فتأتي الترجمة أفضل بكثير.',
      ],
      precio: 'التطبيق مجاني.',
    },
    ru: {
      intro: 'Google Переводчик позволяет читать японский, наведя камеру, и разговаривать с кем угодно в режиме диалога. В Кансае многие вывески, меню и этикетки только на японском — тут он и выручает.',
      para: [
        'Прочитать меню в ресторане или состав продукта в комбини.',
        'Понять объявления на станциях, в храмах или на билетном автомате.',
        'Задать вопрос персоналу отеля или магазина в режиме разговора.',
      ],
      pasos: [
        'Скачайте Google Переводчик в App Store или Google Play (нажмите кнопку).',
        'Загрузите японский язык для работы без интернета.',
        'Используйте «Камеру» для текста и «Разговор» для общения.',
        'Отмечайте звёздочкой фразы, которые нужны чаще всего.',
      ],
      consejos: [
        'Чтобы проверить состав, наведите камеру на этикетку и ищите слова 豚 (свинина) или ゼラチン (желатин).',
        'Говорите медленно и короткими фразами — перевод получится гораздо точнее.',
      ],
      precio: 'Приложение бесплатное.',
    },
  },

  radical: {
    es: {
      intro: 'Radical Storage es una red de consignas en tiendas y hoteles asociados. Reservas online, dejas las maletas y te mueves libre. Perfecto para el último día tras el check-out o al llegar antes de poder entrar al hotel.',
      para: [
        'Dejar las maletas en Namba o Umeda y pasar la tarde en Dotonbori sin cargar.',
        'Visitar Kioto el día que cambias de hotel, con el equipaje cerca de la estación.',
        'Aprovechar las horas antes del vuelo sin depender de taquillas llenas.',
      ],
      pasos: [
        'Toca el botón de esta página para abrir Radical Storage: así sabe que vienes de mi web.',
        'Busca la zona (Namba, Umeda, estación de Kioto…) y elige un punto con buenas opiniones.',
        'Indica el número de maletas y las fechas, y paga online.',
        'Enseña la reserva en el local al dejar y al recoger el equipaje.',
      ],
      consejos: [
        'Mira el horario del local: si cierra pronto, no podrás recoger las maletas.',
        'En temporada alta las taquillas de las estaciones se llenan: reserva antes.',
      ],
      precio: 'Pagas por maleta y por día; con mi enlace o el código TONYKANSAI te descuenta un 10 %.',
    },
    en: {
      intro: 'Radical Storage is a network of luggage storage points in partner shops and hotels. Book online, drop your bags and move around freely. Perfect for your last day after check-out, or when you arrive before check-in.',
      para: [
        'Leaving your bags in Namba or Umeda and spending the afternoon in Dotonbori hands-free.',
        'Visiting Kyoto on the day you change hotels, with your luggage near the station.',
        'Making the most of the hours before your flight without hunting for free lockers.',
      ],
      pasos: [
        'Tap the button on this page to open Radical Storage, so it knows you come from my page.',
        'Search the area (Namba, Umeda, Kyoto Station…) and pick a well-reviewed spot.',
        'Enter the number of bags and dates, and pay online.',
        'Show your booking at the shop when you drop off and collect your bags.',
      ],
      consejos: [
        'Check the shop’s opening hours: if it closes early, you cannot collect your bags.',
        'Station lockers fill up in peak season, so book ahead.',
      ],
      precio: 'You pay per bag per day; my link or the code TONYKANSAI takes 10% off.',
    },
    ar: {
      intro: 'Radical Storage شبكة لحفظ الأمتعة في متاجر وفنادق شريكة. تحجز عبر الإنترنت، وتترك حقائبك، وتتنقل بحرية. مثالية ليومك الأخير بعد تسجيل الخروج أو عند وصولك قبل موعد الدخول.',
      para: [
        'ترك حقائبك في نامبا أو أومِيدا وقضاء العصر في دوتونبوري دون حمل.',
        'زيارة كيوتو يوم تغيير الفندق مع بقاء أمتعتك قرب المحطة.',
        'الاستفادة من الساعات قبل رحلتك دون البحث عن خزائن فارغة.',
      ],
      pasos: [
        'اضغط الزر في هذه الصفحة لفتح Radical Storage، ليعرف أنك قادم من صفحتي.',
        'ابحث عن المنطقة (نامبا، أومِيدا، محطة كيوتو…) واختر مكانًا بتقييمات جيدة.',
        'أدخل عدد الحقائب والتواريخ وادفع عبر الإنترنت.',
        'اعرض حجزك في المتجر عند ترك الحقائب وعند استلامها.',
      ],
      consejos: [
        'راجع ساعات عمل المتجر: إن أغلق باكرًا فلن تستطيع استلام حقائبك.',
        'خزائن المحطات تمتلئ في المواسم المزدحمة، فاحجز مسبقًا.',
      ],
      precio: 'تدفع لكل حقيبة عن كل يوم، وبرابطي أو بالرمز TONYKANSAI تحصل على خصم 10%.',
    },
    ru: {
      intro: 'Radical Storage — сеть камер хранения в партнёрских магазинах и отелях. Бронируете онлайн, оставляете чемоданы и гуляете налегке. Идеально в последний день после выезда или если приехали раньше заселения.',
      para: [
        'Оставить чемоданы в Намбе или Умэде и провести вечер в Дотонбори налегке.',
        'Посмотреть Киото в день смены отеля, оставив багаж рядом со станцией.',
        'Использовать часы до вылета, не ища свободные ячейки.',
      ],
      pasos: [
        'Нажмите кнопку на этой странице, чтобы открыть Radical Storage: так сервис поймёт, что вы пришли с моего сайта.',
        'Выберите район (Намба, Умэда, станция Киото…) и точку с хорошими отзывами.',
        'Укажите число сумок и даты и оплатите онлайн.',
        'Покажите бронь в точке, когда сдаёте и забираете багаж.',
      ],
      consejos: [
        'Проверьте часы работы точки: если она закроется рано, багаж не забрать.',
        'В высокий сезон ячейки на станциях заняты — бронируйте заранее.',
      ],
      precio: 'Оплата за каждую сумку за день; с моей ссылкой или кодом TONYKANSAI — скидка 10 %.',
    },
  },
  samurai: {
    es: {
      intro: 'El Museo Samurái y Ninja de Kioto, junto a Nishiki, enseña armaduras, espadas y la historia real de samuráis y ninjas. La visita es guiada y práctica: los niños se ponen el traje y prueban a lanzar shuriken.',
      para: [
        'Familias con niños que buscan algo divertido y activo en Kioto.',
        'Una hora a cubierto los días de lluvia o de mucho calor.',
        'Encaja bien antes o después del mercado de Nishiki.',
      ],
      pasos: [
        'Toca el botón de esta página para abrir la web del museo.',
        'Elige la experiencia, el día y la hora.',
        'Paga en su web y guarda la confirmación.',
        'Enseña la reserva en la entrada.',
      ],
      consejos: [
        'Si vienes de tour conmigo, dímelo y lo encajamos en la ruta por Kioto.',
      ],
      precio: 'El precio sale en su web antes de pagar.',
    },
    en: {
      intro: 'The Kyoto Samurai & Ninja Museum, next to Nishiki, shows armour, swords and the real history of samurai and ninja. The visit is guided and hands-on: kids put on the costume and try throwing shuriken.',
      para: [
        'Families with children looking for something fun and active in Kyoto.',
        'An indoor hour on rainy or very hot days.',
        'Fits well before or after Nishiki Market.',
      ],
      pasos: [
        'Tap the button on this page to open the museum website.',
        'Choose the experience, the day and the time.',
        'Pay on their website and keep the confirmation.',
        'Show your booking at the entrance.',
      ],
      consejos: [
        'If you are touring with me, tell me and we will fit it into the Kyoto route.',
      ],
      precio: 'The price is shown on their website before you pay.',
    },
    ar: {
      intro: 'متحف الساموراي والنينجا في كيوتو، قرب سوق نيشيكي، يعرض الدروع والسيوف والتاريخ الحقيقي للساموراي والنينجا. الزيارة مع مرشد وتفاعلية: يرتدي الأطفال الزي ويجرّبون رمي الشوريكن.',
      para: [
        'العائلات مع الأطفال الباحثة عن نشاط ممتع في كيوتو.',
        'ساعة داخل مكان مغلق في أيام المطر أو الحر الشديد.',
        'يناسب قبل زيارة سوق نيشيكي أو بعدها.',
      ],
      pasos: [
        'اضغط الزر في هذه الصفحة لفتح موقع المتحف.',
        'اختر التجربة واليوم والساعة.',
        'ادفع في موقعهم واحتفظ بالتأكيد.',
        'اعرض الحجز عند المدخل.',
      ],
      consejos: [
        'إن كنت في جولة معي فأخبرني وسنضيفه إلى مسار كيوتو.',
      ],
      precio: 'يظهر السعر في موقعهم قبل الدفع.',
    },
    ru: {
      intro: 'Музей самураев и ниндзя в Киото, рядом с рынком Нисики, показывает доспехи, мечи и настоящую историю самураев и ниндзя. Экскурсия с гидом и практикой: дети надевают костюм и пробуют метать сюрикены.',
      para: [
        'Семьи с детьми, которые ищут что-то весёлое и активное в Киото.',
        'Час под крышей в дождь или сильную жару.',
        'Удобно до или после рынка Нисики.',
      ],
      pasos: [
        'Нажмите кнопку на этой странице, чтобы открыть сайт музея.',
        'Выберите программу, день и время.',
        'Оплатите на их сайте и сохраните подтверждение.',
        'Покажите бронь на входе.',
      ],
      consejos: [
      ],
      precio: 'Цена видна на сайте до оплаты.',
    },
  },
  wargo: {
    es: { intro: 'Wargo alquila kimonos y yukatas en Kioto. Eliges el modelo en la tienda, te lo ponen allí mismo y sales a pasear con él todo el día.', para: ['Fotos en Higashiyama, Gion o Kiyomizu-dera.', 'Parejas y familias que quieren un recuerdo distinto del viaje.'], pasos: ['Toca el botón de esta página para abrir la web de Wargo.', 'Elige tienda, plan, día y hora.', 'Al pagar, escribe el código 261013_wgtn para que se aplique el 10 %.', 'Ve a la tienda a la hora reservada; ellos te visten.'], consejos: ['El código vale hasta el 31 de diciembre de 2026.', 'Si vienes de tour conmigo, dímelo y lo encajamos en la ruta por Kioto.'], precio: 'El precio de cada plan sale en su web; el código descuenta un 10 %.' },
    en: { intro: 'Wargo rents kimonos and yukatas in Kyoto. You pick one in the shop, they dress you there and you wear it around the city all day.', para: ['Photos in Higashiyama, Gion or Kiyomizu-dera.', 'Couples and families who want a different memory of the trip.'], pasos: ['Tap the button on this page to open the Wargo website.', 'Choose the shop, plan, day and time.', 'At checkout, enter the code 261013_wgtn to get 10% off.', 'Go to the shop at your time; they dress you.'], consejos: ['The code is valid until 31 December 2026.', 'If you are touring with me, tell me and we will fit it into the Kyoto route.'], precio: 'Each plan’s price is on their website; the code takes 10% off.' },
    ar: { intro: 'تؤجّر Wargo الكيمونو واليوكاتا في كيوتو. تختار القطعة في المتجر، ويُلبسونك هناك، وتتجول بها طوال اليوم.', para: ['صور في هيغاشياما أو غيون أو معبد كيوميزو.', 'الأزواج والعائلات الذين يريدون ذكرى مختلفة من الرحلة.'], pasos: ['اضغط الزر في هذه الصفحة لفتح موقع Wargo.', 'اختر المتجر والباقة واليوم والساعة.', 'عند الدفع اكتب الرمز 261013_wgtn ليُطبَّق خصم 10%.', 'اذهب إلى المتجر في موعدك، وهم يُلبسونك.'], consejos: ['الرمز صالح حتى 31 ديسمبر 2026.', 'إن كنت في جولة معي، أخبرني لنضعه في مسار كيوتو.'], precio: 'سعر كل باقة في موقعهم، والرمز يخصم 10%.' },
    ru: { intro: 'Wargo сдаёт напрокат кимоно и юкаты в Киото. Вы выбираете наряд в магазине, вас там же одевают, и вы гуляете в нём весь день.', para: ['Фото в Хигасияме, Гионе или у храма Киёмидзу.', 'Парам и семьям, которым хочется особого воспоминания о поездке.'], pasos: ['Нажмите кнопку на этой странице, чтобы открыть сайт Wargo.', 'Выберите магазин, тариф, день и время.', 'При оплате введите код 261013_wgtn — скидка 10 %.', 'Приходите в магазин к своему времени — вас оденут.'], consejos: ['Код действует до 31 декабря 2026 года.', 'Если вы на экскурсии со мной, скажите — впишем это в маршрут по Киото.'], precio: 'Цена каждого тарифа — на их сайте; код даёт скидку 10 %.' },
  },
  tiqets: {
    es: { intro: 'Tiqets vende entradas oficiales a museos y atracciones. Compras desde el móvil, recibes el QR al momento y entras sin pasar por taquilla.', para: ['Reservar el acuario Kaiyukan o el castillo de Osaka para una hora concreta.', 'Tener las entradas listas antes de llegar y no perder tiempo en colas.'], pasos: ['Toca el botón de esta página para abrir Tiqets: así sabe que vienes de mi web.', 'Busca Osaka o Kioto y elige la atracción y la fecha.', 'Paga y guarda el QR en el móvil (también llega por correo).', 'Enséñalo en la entrada el día de la visita.'], consejos: ['Mira la política de cancelación de cada entrada antes de pagar: no todas se pueden devolver.'], precio: 'El precio de cada entrada sale antes de pagar.' },
    en: { intro: 'Tiqets sells official tickets to museums and attractions. Buy on your phone, get the QR code instantly and walk in without the ticket office.', para: ['Booking the Kaiyukan aquarium or Osaka Castle for a set time.', 'Having tickets ready before you arrive instead of queuing.'], pasos: ['Tap the button on this page to open Tiqets, so it knows you come from my page.', 'Search Osaka or Kyoto and choose the attraction and date.', 'Pay and save the QR code on your phone (it also arrives by email).', 'Show it at the entrance on the day.'], consejos: ['Check each ticket’s cancellation policy before paying: not all are refundable.'], precio: 'Each ticket’s price is shown before you pay.' },
    ar: { intro: 'تبيع Tiqets تذاكر رسمية للمتاحف والمعالم. تشتري من هاتفك، ويصلك رمز QR فورًا، وتدخل بلا شباك تذاكر.', para: ['حجز حوض كايوكان أو قلعة أوساكا في ساعة محددة.', 'تجهيز التذاكر قبل الوصول بدل الوقوف في الطابور.'], pasos: ['اضغط الزر في هذه الصفحة لفتح Tiqets، ليعرف أنك قادم من موقعي.', 'ابحث عن أوساكا أو كيوتو واختر المعلم والتاريخ.', 'ادفع واحفظ رمز QR على هاتفك (يصلك بالبريد أيضًا).', 'أظهره عند المدخل يوم الزيارة.'], consejos: ['راجع سياسة الإلغاء لكل تذكرة قبل الدفع: ليست كلها قابلة للاسترداد.'], precio: 'يظهر سعر كل تذكرة قبل الدفع.' },
    ru: { intro: 'Tiqets продаёт официальные билеты в музеи и на достопримечательности. Покупаете в телефоне, сразу получаете QR-код и проходите без кассы.', para: ['Забронировать океанариум Кайюкан или замок Осаки на конкретное время.', 'Иметь билеты заранее и не стоять в очереди.'], pasos: ['Нажмите кнопку на этой странице, чтобы открыть Tiqets.', 'Найдите Осаку или Киото, выберите место и дату.', 'Оплатите и сохраните QR-код (он также придёт на почту).', 'Покажите его на входе в день визита.'], consejos: ['Перед оплатой проверьте условия отмены: не все билеты возвратные.'], precio: 'Цена каждого билета видна до оплаты.' },
  },
  kiwitaxi: {
    es: { intro: 'Kiwitaxi reserva traslados privados con conductor local. Eliges el coche según el número de personas y maletas, y el precio queda cerrado al reservar.', para: ['Llegar de noche al aeropuerto de Kansai y no pensar en trenes.', 'Viajar en familia o en grupo con mucho equipaje.'], pasos: ['Toca el botón de esta página para abrir Kiwitaxi.', 'Pon «Kansai International Airport» como origen y tu hotel como destino.', 'Elige el tipo de coche, añade tu número de vuelo y paga.', 'Al llegar, el conductor te espera en la salida con tu nombre.'], consejos: ['Pon siempre el número de vuelo: si se retrasa, el conductor lo sabe.'], precio: 'Precio cerrado por coche, no por persona; sale antes de pagar.' },
    en: { intro: 'Kiwitaxi books private transfers with local drivers. Pick the car for your group and luggage, and the price is fixed when you book.', para: ['Landing at Kansai Airport late at night without thinking about trains.', 'Travelling as a family or group with lots of luggage.'], pasos: ['Tap the button on this page to open Kiwitaxi.', 'Enter “Kansai International Airport” as pick-up and your hotel as drop-off.', 'Choose the car type, add your flight number and pay.', 'When you land, the driver waits at arrivals with your name.'], consejos: ['Always add your flight number: if it is delayed, the driver knows.'], precio: 'Fixed price per car, not per person; shown before you pay.' },
    ar: { intro: 'يحجز Kiwitaxi توصيلًا خاصًا مع سائقين محليين. تختار السيارة حسب عدد الأشخاص والحقائب، ويثبت السعر عند الحجز.', para: ['الوصول ليلًا إلى مطار كانساي دون التفكير في القطارات.', 'السفر مع العائلة أو مجموعة بحقائب كثيرة.'], pasos: ['اضغط الزر في هذه الصفحة لفتح Kiwitaxi.', 'اكتب «Kansai International Airport» نقطةَ انطلاق وفندقك وجهةً.', 'اختر نوع السيارة وأضف رقم رحلتك وادفع.', 'عند الوصول ينتظرك السائق في صالة الوصول باسمك.'], consejos: ['أضف رقم الرحلة دائمًا: إن تأخرت يعرف السائق.'], precio: 'سعر ثابت للسيارة لا للشخص، يظهر قبل الدفع.' },
    ru: { intro: 'Kiwitaxi бронирует частные трансферы с местными водителями. Машину выбираете по числу людей и багажа, цена фиксируется при бронировании.', para: ['Прилететь в Кансай поздно вечером и не думать о поездах.', 'Ехать семьёй или группой с большим багажом.'], pasos: ['Нажмите кнопку на этой странице, чтобы открыть Kiwitaxi.', 'Укажите «Kansai International Airport» как точку подачи и отель как пункт назначения.', 'Выберите класс машины, добавьте номер рейса и оплатите.', 'После прилёта водитель ждёт в зоне прилёта с табличкой.'], consejos: ['Всегда указывайте номер рейса: при задержке водитель будет в курсе.'], precio: 'Фиксированная цена за машину, а не за человека.' },
  },
  intui: {
    es: { intro: 'intui.travel reserva traslados privados en todo el mundo, también en Kansai: aeropuerto, hotel o entre ciudades, con coches para grupos grandes.', para: ['Ir del aeropuerto de Kansai a Kioto puerta a puerta.', 'Grupos de 6 o más personas que necesitan monovolumen o minibús.'], pasos: ['Toca el botón de esta página: el enlace lleva el descuento de la promoción.', 'Indica origen, destino, fecha y número de personas.', 'Elige el vehículo y paga online.', 'Recibes los datos del conductor antes del viaje.'], consejos: ['La promoción del 5 % es hasta el 31 de octubre de 2026: comprueba el precio final antes de pagar.'], precio: 'Precio cerrado por vehículo, visible antes de pagar.' },
    en: { intro: 'intui.travel books private transfers worldwide, Kansai included: airport, hotel or between cities, with vehicles for large groups.', para: ['Going door to door from Kansai Airport to Kyoto.', 'Groups of 6 or more who need a minivan or minibus.'], pasos: ['Tap the button on this page: the link carries the promo discount.', 'Enter pick-up, drop-off, date and number of people.', 'Choose the vehicle and pay online.', 'You get the driver’s details before the trip.'], consejos: ['The 5% offer runs until 31 October 2026: check the final price before paying.'], precio: 'Fixed price per vehicle, shown before you pay.' },
    ar: { intro: 'يحجز intui.travel توصيلًا خاصًا حول العالم، ومنه كانساي: المطار أو الفندق أو بين المدن، مع مركبات للمجموعات الكبيرة.', para: ['الذهاب من مطار كانساي إلى كيوتو من الباب إلى الباب.', 'مجموعات من 6 أشخاص أو أكثر تحتاج فانًا أو حافلة صغيرة.'], pasos: ['اضغط الزر في هذه الصفحة: الرابط يحمل خصم العرض.', 'أدخل نقطة الانطلاق والوجهة والتاريخ وعدد الأشخاص.', 'اختر المركبة وادفع عبر الإنترنت.', 'تصلك بيانات السائق قبل الرحلة.'], consejos: ['عرض الـ5٪ حتى 31 أكتوبر 2026: تحقق من السعر النهائي قبل الدفع.'], precio: 'سعر ثابت للمركبة يظهر قبل الدفع.' },
    ru: { intro: 'intui.travel бронирует частные трансферы по всему миру, в том числе в Кансае: аэропорт, отель или между городами, есть машины для больших групп.', para: ['Доехать из аэропорта Кансай в Киото от двери до двери.', 'Группы от 6 человек, которым нужен минивэн или микроавтобус.'], pasos: ['Нажмите кнопку на этой странице: ссылка уже со скидкой акции.', 'Укажите откуда, куда, дату и число пассажиров.', 'Выберите машину и оплатите онлайн.', 'Данные водителя придут до поездки.'], consejos: ['Скидка 5 % действует до 31 октября 2026 г.: проверьте итоговую цену.'], precio: 'Фиксированная цена за машину, видна до оплаты.' },
  },
  yesim: {
    es: { intro: 'Yesim es una app de eSIM: compras datos para Japón y los activas en el móvil sin cambiar tu tarjeta SIM.', para: ['Viajes que combinan Japón con otros países de Asia.', 'Quien prefiere gestionarlo todo desde una sola app.'], pasos: ['Toca el botón de esta página para abrir Yesim.', 'Elige un plan para Japón y págalo.', 'Instala la eSIM en casa, con wifi, siguiendo la app.', 'Al aterrizar, activa los datos de esa línea.'], consejos: ['Antes de comprar, comprueba que tu móvil admite eSIM y no está bloqueado por tu operador.'], precio: 'El precio depende del plan; lo ves en la app antes de pagar.' },
    en: { intro: 'Yesim is an eSIM app: buy data for Japan and switch it on without changing your SIM card.', para: ['Trips that combine Japan with other Asian countries.', 'Anyone who prefers to manage everything from one app.'], pasos: ['Tap the button on this page to open Yesim.', 'Choose a Japan plan and pay.', 'Install the eSIM at home, on wifi, following the app.', 'When you land, turn on data for that line.'], consejos: ['Before buying, check your phone supports eSIM and is not carrier-locked.'], precio: 'Price depends on the plan; you see it in the app before paying.' },
    ar: { intro: 'Yesim تطبيق eSIM: تشتري إنترنت لليابان وتفعّله على هاتفك دون تغيير شريحتك.', para: ['رحلات تجمع اليابان مع دول آسيوية أخرى.', 'من يفضّل إدارة كل شيء من تطبيق واحد.'], pasos: ['اضغط الزر في هذه الصفحة لفتح Yesim.', 'اختر باقة لليابان وادفع.', 'ثبّت الشريحة في بيتك على الواي فاي باتباع التطبيق.', 'عند الوصول فعّل البيانات لهذا الخط.'], consejos: ['قبل الشراء تأكد أن هاتفك يدعم eSIM وغير مقفل على شركتك.'], precio: 'السعر حسب الباقة ويظهر في التطبيق قبل الدفع.' },
    ru: { intro: 'Yesim — приложение eSIM: покупаете интернет для Японии и включаете его, не меняя SIM-карту.', para: ['Поездки, где Япония сочетается с другими странами Азии.', 'Тем, кто хочет всё в одном приложении.'], pasos: ['Нажмите кнопку на этой странице, чтобы открыть Yesim.', 'Выберите тариф для Японии и оплатите.', 'Установите eSIM дома по Wi-Fi, следуя приложению.', 'После прилёта включите передачу данных на этой линии.'], consejos: ['Перед покупкой убедитесь, что телефон поддерживает eSIM и не залочен оператором.'], precio: 'Цена зависит от тарифа и видна до оплаты.' },
  },
  ekta: {
    es: { intro: 'EKTA vende seguros de viaje online. Indicas fechas y país, eliges la cobertura y la póliza te llega por correo en minutos.', para: ['Cubrir médicos y hospital en Japón, donde la atención es muy cara para turistas.', 'Contratarlo a última hora, incluso ya de viaje.'], pasos: ['Toca el botón de esta página para abrir EKTA.', 'Pon Japón como destino, las fechas y los viajeros.', 'Compara coberturas, elige y paga.', 'Guarda la póliza en el móvil y el teléfono de asistencia.'], consejos: ['Lee qué cubre y qué no (deportes, equipaje, enfermedades previas) antes de pagar.'], precio: 'Depende de días, edad y cobertura; lo ves antes de pagar.' },
    en: { intro: 'EKTA sells travel insurance online. Enter dates and country, pick the cover and the policy reaches your email in minutes.', para: ['Covering doctors and hospital in Japan, where care is very expensive for visitors.', 'Buying it at the last minute, even once you are travelling.'], pasos: ['Tap the button on this page to open EKTA.', 'Set Japan as destination, your dates and travellers.', 'Compare covers, choose and pay.', 'Save the policy and the assistance phone number on your phone.'], consejos: ['Read what is and is not covered (sports, luggage, pre-existing conditions) before paying.'], precio: 'Depends on days, age and cover; shown before you pay.' },
    ar: { intro: 'تبيع EKTA تأمين السفر عبر الإنترنت. تُدخل التواريخ والبلد، وتختار التغطية، وتصلك الوثيقة بالبريد خلال دقائق.', para: ['تغطية الأطباء والمستشفى في اليابان، حيث العلاج مكلف جدًا للزائر.', 'شراؤه في آخر لحظة، حتى أثناء السفر.'], pasos: ['اضغط الزر في هذه الصفحة لفتح EKTA.', 'اختر اليابان وجهةً وأدخل التواريخ والمسافرين.', 'قارن التغطيات واختر وادفع.', 'احفظ الوثيقة ورقم المساعدة على هاتفك.'], consejos: ['اقرأ ما يغطيه وما لا يغطيه (الرياضات، الأمتعة، الأمراض السابقة) قبل الدفع.'], precio: 'حسب الأيام والعمر والتغطية، ويظهر قبل الدفع.' },
    ru: { intro: 'EKTA продаёт туристические страховки онлайн. Указываете даты и страну, выбираете покрытие — полис приходит на почту за минуты.', para: ['Покрыть врачей и больницу в Японии, где лечение для туриста очень дорогое.', 'Оформить в последний момент, даже уже в поездке.'], pasos: ['Нажмите кнопку на этой странице, чтобы открыть EKTA.', 'Укажите Японию, даты и путешественников.', 'Сравните варианты, выберите и оплатите.', 'Сохраните полис и телефон ассистанса в телефоне.'], consejos: ['Перед оплатой прочитайте, что покрывается, а что нет (спорт, багаж, хронические болезни).'], precio: 'Зависит от дней, возраста и покрытия; видно до оплаты.' },
  },
  iati: {
    es: { intro: 'IATI es una aseguradora de viaje española. Eliges destino, fechas y tipo de seguro, pagas online y la póliza te llega por correo con el teléfono de asistencia.', para: ['Cubrir médicos y hospital en Japón, donde la atención es muy cara para turistas.', 'Quien quiere asistencia en español si algo sale mal.'], pasos: ['Toca el botón de esta página para abrir IATI.', 'Pon Japón como destino, las fechas y los viajeros.', 'Compara los seguros, elige y paga.', 'Guarda la póliza en el móvil y el teléfono de asistencia.'], consejos: ['Lee qué cubre y qué no (deportes, equipaje, enfermedades previas) antes de pagar.'], precio: 'Depende de días, edad y cobertura; lo ves antes de pagar.' },
    en: { intro: 'IATI is a Spanish travel insurer. Choose destination, dates and type of cover, pay online and the policy reaches your email with the assistance phone number.', para: ['Covering doctors and hospital in Japan, where care is very expensive for visitors.', 'Anyone who wants 24-hour assistance if something goes wrong.'], pasos: ['Tap the button on this page to open IATI.', 'Set Japan as destination, your dates and travellers.', 'Compare the plans, choose and pay.', 'Save the policy and the assistance phone number on your phone.'], consejos: ['Read what is and is not covered (sports, luggage, pre-existing conditions) before paying.'], precio: 'Depends on days, age and cover; shown before you pay.' },
    ar: { intro: 'IATI شركة تأمين سفر إسبانية. تختار الوجهة والتواريخ ونوع التأمين، وتدفع عبر الإنترنت، وتصلك الوثيقة بالبريد مع رقم المساعدة.', para: ['تغطية الأطباء والمستشفى في اليابان، حيث العلاج مكلف جدًا للزائر.', 'من يريد مساعدة على مدار الساعة إن حدث طارئ.'], pasos: ['اضغط الزر في هذه الصفحة لفتح IATI.', 'اختر اليابان وجهةً وأدخل التواريخ والمسافرين.', 'قارن أنواع التأمين واختر وادفع.', 'احفظ الوثيقة ورقم المساعدة على هاتفك.'], consejos: ['اقرأ ما يغطيه وما لا يغطيه (الرياضات، الأمتعة، الأمراض السابقة) قبل الدفع.'], precio: 'حسب الأيام والعمر والتغطية، ويظهر قبل الدفع.' },
    ru: { intro: 'IATI — испанская компания туристического страхования. Выбираете страну, даты и тип полиса, платите онлайн — полис с телефоном ассистанса приходит на почту.', para: ['Покрыть врачей и больницу в Японии, где лечение для туриста очень дорогое.', 'Тем, кому нужна круглосуточная помощь, если что-то случится.'], pasos: ['Нажмите кнопку на этой странице, чтобы открыть IATI.', 'Укажите Японию, даты и путешественников.', 'Сравните варианты, выберите и оплатите.', 'Сохраните полис и телефон ассистанса в телефоне.'], consejos: ['Перед оплатой прочитайте, что покрывается, а что нет (спорт, багаж, хронические болезни).'], precio: 'Зависит от дней, возраста и покрытия; видно до оплаты.' },
  },
  airhelp: {
    es: { intro: 'AirHelp te ayuda a reclamar la compensación que te corresponde por un vuelo retrasado, cancelado o con conexión perdida. Con AirHelp+ lo gestionan por ti sin quedarse comisión.', para: ['Vuelos que salen de Europa o con aerolínea europea, cubiertos por la normativa de la UE.', 'Quien no quiere pelearse con la aerolínea en otro idioma.'], pasos: ['Toca el botón de esta página: el enlace lleva el 11 % de descuento en AirHelp+.', 'Introduce tu vuelo y comprueba si tienes derecho a compensación.', 'Si lo tienes, AirHelp gestiona la reclamación.'], consejos: ['Guarda tarjetas de embarque y recibos: te los pedirán.', 'La promoción vale hasta el 30 de noviembre de 2026 y no en EE. UU.'], precio: 'Comprobar si tienes derecho no cuesta nada; AirHelp+ es una suscripción.' },
    en: { intro: 'AirHelp helps you claim the compensation you are owed for a delayed, cancelled or missed-connection flight. With AirHelp+ they handle it for you without taking a commission.', para: ['Flights departing Europe or on European airlines, covered by EU rules.', 'Anyone who does not want to fight an airline in another language.'], pasos: ['Tap the button on this page: the link carries 11% off AirHelp+.', 'Enter your flight and check if you are entitled to compensation.', 'If you are, AirHelp handles the claim.'], consejos: ['Keep boarding passes and receipts: you will be asked for them.', 'The offer runs until 30 November 2026 and is not valid in the US.'], precio: 'Checking your eligibility is free; AirHelp+ is a subscription.' },
    ar: { intro: 'يساعدك AirHelp على المطالبة بالتعويض المستحق عن رحلة متأخرة أو ملغاة أو فاتتك فيها رحلة الربط. ومع AirHelp+ يتولّون الأمر دون أخذ عمولة.', para: ['الرحلات المغادرة من أوروبا أو على شركات طيران أوروبية، المشمولة بقواعد الاتحاد الأوروبي.', 'من لا يريد مجادلة شركة الطيران بلغة أخرى.'], pasos: ['اضغط الزر في هذه الصفحة: الرابط يحمل خصم 11٪ على AirHelp+.', 'أدخل رحلتك وتحقق إن كان لك حق في التعويض.', 'إن كان لك، يتولى AirHelp المطالبة.'], consejos: ['احتفظ ببطاقات الصعود والإيصالات: ستُطلب منك.', 'العرض حتى 30 نوفمبر 2026 وغير صالح في الولايات المتحدة.'], precio: 'التحقق من أحقيتك مجاني؛ وAirHelp+ اشتراك.' },
    ru: { intro: 'AirHelp помогает получить положенную компенсацию за задержанный, отменённый рейс или пропущенную стыковку. С AirHelp+ всё оформят за вас без комиссии.', para: ['Рейсы из Европы или европейских авиакомпаний, подпадающие под правила ЕС.', 'Тем, кто не хочет спорить с авиакомпанией на чужом языке.'], pasos: ['Нажмите кнопку на этой странице: ссылка со скидкой 11 % на AirHelp+.', 'Введите рейс и проверьте, положена ли компенсация.', 'Если да, AirHelp оформит заявку.'], consejos: ['Сохраняйте посадочные талоны и чеки — их попросят.', 'Акция до 30 ноября 2026 г., не действует в США.'], precio: 'Проверка бесплатна; AirHelp+ — подписка.' },
  },
  mobal: {
    es: { intro: 'Mobal vende SIM y eSIM para viajar por Japón. Además de datos, tiene planes con número de teléfono japonés, algo que pocas eSIM ofrecen.', para: ['Quien necesita llamar a restaurantes, hoteles o taxis con un número local.', 'Viajes largos en los que quieres datos todo el tiempo sin depender del wifi.'], pasos: ['Toca el botón de esta página para abrir Mobal.', 'Elige eSIM o SIM física, y si quieres número japonés.', 'Sigue sus instrucciones para activarla al llegar.'], consejos: ['Comprueba antes que tu móvil admite eSIM y está libre.', 'Si solo necesitas datos, compara también con Airalo o Yesim en esta página.'], precio: 'El precio depende del plan y de los días; lo ves antes de pagar.' },
    en: { intro: 'Mobal sells SIM cards and eSIMs for travelling in Japan. As well as data, it has plans with a Japanese phone number, which few eSIMs offer.', para: ['Anyone who needs to call restaurants, hotels or taxis with a local number.', 'Longer trips where you want data all the time without relying on wifi.'], pasos: ['Tap the button on this page to open Mobal.', 'Choose eSIM or physical SIM, and whether you want a Japanese number.', 'Follow their instructions to activate it when you arrive.'], consejos: ['Check first that your phone supports eSIM and is unlocked.', 'If you only need data, compare with Airalo or Yesim on this page too.'], precio: 'The price depends on the plan and the number of days; you see it before paying.' },
    ar: { intro: 'تبيع Mobal شرائح SIM وeSIM للسفر في اليابان. وإلى جانب الإنترنت، لديها باقات برقم هاتف ياباني، وهذا نادر في شرائح eSIM.', para: ['من يحتاج إلى الاتصال بالمطاعم أو الفنادق أو سيارات الأجرة برقم محلي.', 'الرحلات الطويلة التي تريد فيها الإنترنت دائمًا دون الاعتماد على الواي فاي.'], pasos: ['اضغط الزر في هذه الصفحة لفتح Mobal.', 'اختر eSIM أو شريحة فعلية، وهل تريد رقمًا يابانيًا.', 'اتبع تعليماتهم لتفعيلها عند الوصول.'], consejos: ['تأكد أولًا أن هاتفك يدعم eSIM وغير مقفل.', 'إن كنت تحتاج الإنترنت فقط، قارن أيضًا مع Airalo أو Yesim في هذه الصفحة.'], precio: 'السعر حسب الباقة وعدد الأيام، وتراه قبل الدفع.' },
    ru: { intro: 'Mobal продаёт SIM-карты и eSIM для поездок по Японии. Кроме интернета, есть тарифы с японским номером телефона — такое у eSIM встречается редко.', para: ['Тем, кому нужно звонить в рестораны, отели или такси с местного номера.', 'Долгим поездкам, где интернет нужен всё время, без зависимости от Wi-Fi.'], pasos: ['Нажмите кнопку на этой странице, чтобы открыть Mobal.', 'Выберите eSIM или обычную SIM и нужен ли японский номер.', 'Активируйте по их инструкции после прилёта.'], consejos: ['Заранее проверьте, что телефон поддерживает eSIM и не залочен.', 'Если нужен только интернет, сравните с Airalo или Yesim на этой странице.'], precio: 'Цена зависит от тарифа и числа дней; вы видите её до оплаты.' },
  },
  flytographer: {
    es: { intro: 'Flytographer te pone en contacto con fotógrafos locales para una sesión durante el viaje. En Kioto y Osaka es la forma de tener fotos de toda la familia junta, sin que nadie se quede detrás de la cámara.', para: ['Familias y parejas que quieren un recuerdo cuidado del viaje.', 'Celebraciones: aniversarios, lunas de miel o un viaje especial con los padres.'], pasos: ['Toca el botón de esta página para abrir Flytographer.', 'Elige ciudad, duración y fecha; puedes indicar el lugar y el estilo que prefieres.', 'Tras la sesión recibes las fotos en una galería online.'], consejos: ['A primera hora hay menos gente en los templos y la luz es más suave.', 'Si hacemos tour juntos, dime la hora de la sesión y organizo el día alrededor.'], precio: 'El precio depende de la duración de la sesión; lo ves antes de reservar.' },
    en: { intro: 'Flytographer connects you with local photographers for a session during your trip. In Kyoto and Osaka it is the way to get photos of the whole family together, with nobody stuck behind the camera.', para: ['Families and couples who want a beautiful keepsake of the trip.', 'Celebrations: anniversaries, honeymoons or a special trip with your parents.'], pasos: ['Tap the button on this page to open Flytographer.', 'Choose the city, length and date; you can say which place and style you prefer.', 'After the session you receive your photos in an online gallery.'], consejos: ['Early morning means fewer people at the temples and softer light.', 'If we tour together, tell me the time of your session and I will plan the day around it.'], precio: 'The price depends on the length of the session; you see it before booking.' },
    ar: { intro: 'تربطك Flytographer بمصورين محليين لجلسة تصوير خلال رحلتك. في كيوتو وأوساكا هي الطريقة لتحصلوا على صور للعائلة كلها معًا، دون أن يبقى أحد خلف الكاميرا.', para: ['العائلات والأزواج الذين يريدون ذكرى جميلة من الرحلة.', 'المناسبات: ذكرى الزواج أو شهر العسل أو رحلة خاصة مع الوالدين.'], pasos: ['اضغط الزر في هذه الصفحة لفتح Flytographer.', 'اختر المدينة والمدة والتاريخ، ويمكنك تحديد المكان والأسلوب المفضّل.', 'بعد الجلسة تصلك الصور في معرض على الإنترنت.'], consejos: ['في الصباح الباكر يقل الزحام في المعابد ويكون الضوء أنعم.', 'إن كانت جولتنا معًا، أخبرني بموعد الجلسة وأنظّم اليوم حوله.'], precio: 'السعر حسب مدة الجلسة، وتراه قبل الحجز.' },
    ru: { intro: 'Flytographer подбирает местных фотографов для съёмки во время поездки. В Киото и Осаке это способ получить фото всей семьи вместе, чтобы никто не оставался за камерой.', para: ['Семьям и парам, которым нужна красивая память о поездке.', 'Особым случаям: годовщина, медовый месяц или поездка с родителями.'], pasos: ['Нажмите кнопку на этой странице, чтобы открыть Flytographer.', 'Выберите город, длительность и дату; можно указать место и стиль.', 'После съёмки фото придут в онлайн-галерею.'], consejos: ['Рано утром в храмах меньше людей и мягче свет.', 'Если гуляем вместе, скажите время съёмки — я спланирую день вокруг неё.'], precio: 'Цена зависит от длительности съёмки; вы видите её до бронирования.' },
  },
  snapkyoto: {
    es: { intro: 'Matt es un fotógrafo profesional que vive en Kioto y hace sesiones en Kioto, Osaka, Nara y Tokio. Es la forma de tener fotos buenas de toda la familia junta durante el viaje.', para: ['Familias y parejas que quieren un recuerdo cuidado del viaje.', 'Una sesión en Gion, Arashiyama o Fushimi Inari durante nuestro tour.'], pasos: ['Toca el botón de esta página para abrir la web de SnapKyoto.', 'Escríbele por su web o por WhatsApp con la fecha, la ciudad y cuántas personas sois.', 'Dile que vienes de parte de Tony Hanma (Tony Kansai Guide).'], consejos: ['A primera hora hay menos gente en los templos y la luz es más suave.', 'Si hacemos tour juntos, dime la hora de la sesión y organizo el día alrededor.'], precio: 'Sus sesiones empiezan en 40.000 ¥; el precio exacto te lo da él según el paquete.' },
    en: { intro: 'Matt is a professional photographer based in Kyoto who shoots in Kyoto, Osaka, Nara and Tokyo. It is the way to get great photos of the whole family together on your trip.', para: ['Families and couples who want a beautiful keepsake of the trip.', 'A session in Gion, Arashiyama or Fushimi Inari during our tour.'], pasos: ['Tap the button on this page to open the SnapKyoto website.', 'Message him through his site or WhatsApp with the date, city and number of people.', 'Tell him you come from Tony Hanma (Tony Kansai Guide).'], consejos: ['Early morning means fewer people at the temples and softer light.', 'If we tour together, tell me the time of your session and I will plan the day around it.'], precio: 'Sessions start at ¥40,000; he gives you the exact price for each package.' },
    ar: { intro: 'مات مصوّر محترف يعيش في كيوتو ويصوّر في كيوتو وأوساكا ونارا وطوكيو. هي الطريقة لتحصلوا على صور جميلة للعائلة كلها معًا خلال الرحلة.', para: ['العائلات والأزواج الذين يريدون ذكرى جميلة من الرحلة.', 'جلسة في غيون أو أراشيياما أو فوشيمي إيناري خلال جولتنا.'], pasos: ['اضغط الزر في هذه الصفحة لفتح موقع SnapKyoto.', 'راسله عبر موقعه أو واتساب بالتاريخ والمدينة وعدد الأشخاص.', 'قل له إنك من طرف Tony Hanma (Tony Kansai Guide).'], consejos: ['في الصباح الباكر يقل الزحام في المعابد ويكون الضوء أنعم.', 'إن كانت جولتنا معًا، أخبرني بموعد الجلسة وأنظّم اليوم حوله.'], precio: 'تبدأ الجلسات من 40,000 ين، ويعطيك السعر الدقيق لكل باقة.' },
    ru: { intro: 'Мэтт — профессиональный фотограф из Киото, снимает в Киото, Осаке, Наре и Токио. Так у вас будут хорошие фото всей семьи вместе.', para: ['Семьям и парам, которым нужна красивая память о поездке.', 'Съёмка в Гионе, Арасияме или Фусими Инари во время нашей экскурсии.'], pasos: ['Нажмите кнопку на этой странице, чтобы открыть сайт SnapKyoto.', 'Напишите ему на сайте или в WhatsApp дату, город и число людей.', 'Скажите, что вы от Tony Hanma (Tony Kansai Guide).'], consejos: ['Рано утром в храмах меньше людей и мягче свет.', 'Если гуляем вместе, скажите время съёмки — я спланирую день вокруг неё.'], precio: 'Съёмки от 40 000 иен; точную цену он назовёт для каждого пакета.' },
  },
  yumeyakata: {
    es: { intro: 'Yumeyakata alquila kimonos en Kioto, con tiendas en Gojo y Oike. Te visten allí mismo y puedes añadir peinado, maquillaje, ceremonia del té o sesión de fotos. Tienen una sala de oración para sus clientes.', para: ['Familias musulmanas que quieren rezar a tiempo durante el día en kimono.', 'Fotos en Higashiyama, Gion o Kiyomizu-dera.'], pasos: ['Toca el botón de esta página para abrir la web de Yumeyakata.', 'Reserva por adelantado el plan, el día y la hora.', 'En las notas de la reserva escribe «ガイド番号1085 (Tony Hanma)» o «Guide number 1085 (Tony Hanma)».', 'Ve a la tienda a la hora reservada; ellos te visten.'], consejos: ['Solo cuentan las reservas hechas por adelantado, no las que se hacen en la tienda.', 'Si vienes de tour conmigo, dímelo y lo encajamos en la ruta por Kioto.'], precio: 'El precio de cada plan sale en su web antes de pagar.' },
    en: { intro: 'Yumeyakata rents kimonos in Kyoto, with shops in Gojo and Oike. They dress you there and you can add hair set, make-up, a tea ceremony or a photo session. They have a prayer room for their customers.', para: ['Muslim families who want to pray on time during a day in kimono.', 'Photos in Higashiyama, Gion or Kiyomizu-dera.'], pasos: ['Tap the button on this page to open the Yumeyakata website.', 'Book your plan, day and time in advance.', 'In the booking notes write “Guide number 1085 (Tony Hanma)”.', 'Go to the shop at your time; they dress you.'], consejos: ['Only advance bookings count, not walk-ins.', 'If you are touring with me, tell me and we will fit it into the Kyoto route.'], precio: 'Each plan’s price is on their website before you pay.' },
    ar: { intro: 'تؤجّر Yumeyakata الكيمونو في كيوتو، ولها فرعان في غوجو وأويكي. يُلبسونك هناك، ويمكنك إضافة تصفيف الشعر والمكياج وحفل الشاي أو جلسة تصوير. لديهم غرفة صلاة لعملائهم.', para: ['العائلات المسلمة التي تريد الصلاة في وقتها خلال يوم بالكيمونو.', 'صور في هيغاشياما أو غيون أو معبد كيوميزو.'], pasos: ['اضغط الزر في هذه الصفحة لفتح موقع Yumeyakata.', 'احجز الباقة واليوم والساعة مسبقًا.', 'اكتب في ملاحظات الحجز «Guide number 1085 (Tony Hanma)».', 'اذهب إلى المتجر في موعدك، وهم يُلبسونك.'], consejos: ['تُحتسب الحجوزات المسبقة فقط، لا الحجز عند الوصول.', 'إن كنت في جولة معي، أخبرني لنضعه في مسار كيوتو.'], precio: 'سعر كل باقة في موقعهم قبل الدفع.' },
    ru: { intro: 'Yumeyakata сдаёт напрокат кимоно в Киото, магазины в Годзё и Оикэ. Вас одевают на месте; можно добавить причёску, макияж, чайную церемонию или фотосессию. Для клиентов есть комната для молитвы.', para: ['Мусульманским семьям, которым важно молиться вовремя в течение дня.', 'Фото в Хигасияме, Гионе или у храма Киёмидзу.'], pasos: ['Нажмите кнопку на этой странице, чтобы открыть сайт Yumeyakata.', 'Забронируйте тариф, день и время заранее.', 'В примечаниях напишите «Guide number 1085 (Tony Hanma)».', 'Приходите в магазин к своему времени — вас оденут.'], consejos: ['Учитываются только предварительные брони.', 'Если вы на экскурсии со мной, скажите — впишем это в маршрут по Киото.'], precio: 'Цена каждого тарифа — на их сайте до оплаты.' },
  },
}

export const T_RU: Record<string, { que: string; ventaja: string }> = {
  yokotake: { que: 'Мастерская бамбука в лавке мастеров в Киото: своя корзинка, палочки или ложечка для чая. 1,5–2 часа.', ventaja: 'Только одна группа за раз (до 15 человек) — идеально для больших семей. Корзинка — с 8 лет. Забронирую на японском за вас.' },
  domyo: { que: 'Сплетите свой кумихимо — традиционный шёлковый шнур — с домом DOMYO, который делает его с 1652 года. Занятие на английском.', ventaja: 'Увезёте браслет, сделанный своими руками. Отлично с детьми, опыт не нужен.' },
  shogun: { que: 'Настоящие доспехи самурая в студии в Арасияме (Киото), с фотографиями на память. Есть также кимоно и ниндзя.', ventaja: 'Если гуляем по Арасияме вместе, я впишу это в маршрут и забронирую сам.' },
  miyabi: { que: 'Дзюнихитоэ — двенадцатислойное кимоно императорского двора эпохи Хэйан, в центре Киото. Такого больше нигде не увидите.', ventaja: 'Хиджаб можно оставить под кимоно, весь персонал — женщины.' },
  towerknives: { que: 'Магазин японских ножей у башни Цутэнкаку (Синсэкай). Самый популярный подарок из Осаки.', ventaja: 'Если вы со мной, я договорюсь о показе на 15–20 минут: история ножей Сакаи и демонстрация нарезки.' },
  cookingsun: { que: 'Мастер-класс японской домашней кухни в Киото и Осаке: готовите сами, потом едите вместе.', ventaja: 'При бронировании попросите вегетарианское меню без алкоголя (без сакэ и мирина). Не халяль-сертифицировано, но без мяса и алкоголя.' },
  hamanasu: { que: 'Мастерская резьбы по дереву с мастерицей из Кумано, в Кусимото (Вакаяма). Идеально к маршруту Кумано Кодо. 4000 иен с человека, наличными.', ventaja: 'При бронировании через меня — 15 минут бесплатно сверху для более сложного узора. Сообщите мне за 3 дня.' },
  japanwireless: { que: 'Карманный Wi-Fi для Японии: одно устройство раздаёт интернет на несколько телефонов. Доставка в отель или выдача в аэропорту.', ventaja: 'Лучше всего для больших семей: одно устройство на всех, ничего не нужно устанавливать.' },
  nomad: { que: 'eSIM с интернетом для Японии и 200+ стран: выбираете гигабайты и дни и устанавливаете до вылета.', ventaja: 'По моей ссылке и с кодом TONYKANSAI — скидка 20 % (один раз на человека; не действует на тарифы дешевле 5 $, безлимитные и акционные).' },
  snapkyoto: { que: 'Мэтт, фотограф в Киото, Осаке и Наре: фотосессия семьи или пары в Гионе, Арасияме или по нашему маршруту.', ventaja: 'При бронировании скажите, что вы от Tony Hanma (Tony Kansai Guide). Если мы на экскурсии, я впишу съёмку в маршрут.' },
  yumeyakata: { que: 'Прокат кимоно в Киото (магазины Годзё и Оикэ), с причёской, макияжем, чайной церемонией и фото. Для клиентов есть комната для молитвы.', ventaja: 'Бронируйте заранее и напишите в примечаниях «Guide number 1085 (Tony Hanma)».' },
  wargo: { que: 'Прокат кимоно и юкаты в Киото: вас одевают в магазине, и вы гуляете по Хигасияме или Гиону.', ventaja: 'С кодом 261013_wgtn — скидка 10 % при бронировании на их сайте (до 31.12.2026).' },
  camellia: { que: 'Чайная церемония в чайном домике в Хигасияме (Киото): спокойно и подходит для семей.', ventaja: 'Если вы на экскурсии со мной, я забронирую её по тарифу гида и переведу.' },
  mobal: { que: 'SIM и eSIM для Японии, в том числе с японским номером — звонить в рестораны и отели.', ventaja: 'Удобно, если кроме интернета нужен местный номер на всю поездку.' },
  flytographer: { que: 'Местные фотографы в Киото и Осаке: фотосессия всей семьёй во время поездки.', ventaja: 'Наконец все в кадре; фото приходят в онлайн-галерею.' },
  airalo: { que: 'eSIM для Японии: интернет в телефоне сразу после посадки, без салона связи и карманного Wi-Fi.', ventaja: 'С моим кодом — скидка 450 иен на первую eSIM. Установите дома, в Кансае она включится сама.' },
  klook: { que: 'Билеты в Universal, Кайюкан и на синкансэн, проездные и трансферы из аэропорта Кансай.', ventaja: 'Часто дешевле, чем в кассе, а многие билеты работают по QR-коду.' },
  gyg: { que: 'Кулинарные мастер-классы, чайные церемонии и групповые поездки по Осаке, Киото и Наре.', ventaja: 'Бесплатная отмена за 24 часа у большинства занятий.' },
  kkday: { que: 'Однодневные поездки из Осаки (Нара, Кобе, Аманохасидате), прокат кимоно и проездные.', ventaja: 'Сильна в Азии: часто здесь самая дешёвая экскурсия или билет.' },
  trip: { que: 'Отели, авиабилеты и билеты на синкансэн в одном приложении, с круглосуточной поддержкой.', ventaja: 'Хорошие цены на отели в Японии и билеты на поезд прямо в телефон.' },
  agoda: { que: 'Самый большой выбор отелей и апартаментов в Японии — от капсул до рёканов.', ventaja: 'Очень выгодные цены в Азии; проверяйте, что тариф с бесплатной отменой.' },
  booking: { que: 'Классика: отели в Намбе, Умэде или у станции Киото.', ventaja: 'Многие тарифы оплачиваются в отеле и отменяются бесплатно.' },
  welcome: { que: 'Водитель встречает вас в аэропорту Кансай с табличкой и везёт в отель.', ventaja: 'Фиксированная цена при бронировании; идеально, если прилетаете ночью или с детьми и багажом.' },
  icoca: { que: 'Транспортная карта Кансая в вашем iPhone: поезд, метро, автобус и комбини.', ventaja: 'Добавляется бесплатно в Wallet и пополняется картой, без залога.' },
  go: { que: 'Приложение такси, которым пользуются японцы: вызов машины и примерная цена.', ventaja: 'Работает на английском, оплата в приложении — говорить с водителем не нужно.' },
  uber: { que: 'В Осаке и Киото Uber вызывает обычные такси; удобно, если приложение уже есть.', ventaja: 'Цена как по счётчику, оплата с вашего обычного аккаунта.' },
  luup: { que: 'Прокатные электросамокаты и электровелосипеды по всей Осаке и Киото.', ventaja: 'Самокат с 16 лет после короткого теста по правилам; для велосипеда тест не нужен.' },
  hello: { que: 'Электровелосипеды с сотнями станций в Кансае. Отлично для Киото, где автобусы переполнены.', ventaja: 'Оплата поминутно картой; японский счёт не нужен.' },
  wise: { que: 'Карта для оплаты в иенах по реальному курсу, без банковских комиссий.', ventaja: 'Я сам ей пользуюсь, и ею можно оплатить экскурсию со мной.' },
  maps: { que: 'В Японии показывает платформу, вагон и точное время каждого поезда.', ventaja: 'Сохраните нужные места в список: они будут под рукой в одно касание.' },
  traductor: { que: 'Наведите камеру на меню, вывески и этикетки — и сразу читайте японский.', ventaja: 'Скачайте японский офлайн: работает в метро без интернета.' },
  samurai: { que: 'Музей самураев и ниндзя в Киото: доспехи, катаны и метание сюрикенов, с гидом на английском.', ventaja: 'Весёлый час под крышей в центре Киото. Отлично с детьми.' },
  radical: { que: 'Камеры хранения в магазинах и отелях Намбы, Умэды и у станции Киото.', ventaja: 'С моей ссылкой или кодом TONYKANSAI — скидка 10 %. Оставьте багаж после выезда и гуляйте налегке.' },
  tiqets: { que: 'Билеты в музеи и на достопримечательности Осаки и Киото — сразу в телефоне.', ventaja: 'Без очередей в кассу: показываете QR-код на входе.' },
  kiwitaxi: { que: 'Частный трансфер из аэропорта Кансай в отель, бронируется до вылета.', ventaja: 'Цена фиксируется при бронировании, водитель встречает в зоне прилёта.' },
  intui: { que: 'Частные трансферы из аэропорта или между городами: легковая, минивэн или микроавтобус для групп.', ventaja: 'По нашей ссылке скидка 5 % на трансферы (акция до 31 октября 2026 г.).' },
  yesim: { que: 'Ещё одна eSIM для Японии: тарифы по дням или по гигабайтам в приложении.', ventaja: 'Удобно, если едете в несколько стран: одно приложение на всю поездку.' },
  iati: { que: 'Туристическая страховка испанской компании: оформление онлайн, полис приходит на почту.', ventaja: 'Медицина в Японии отличная, но дорогая для туриста — лучше быть застрахованным с первого дня.' },
  ekta: { que: 'Туристическая страховка онлайн: оформление за несколько минут, полис приходит на почту.', ventaja: 'Медицина в Японии отличная, но дорогая для туриста — лучше быть застрахованным.' },
  airhelp: { que: 'Если рейс задержали, отменили или вы опоздали на стыковку, сервис помогает получить положенную компенсацию.', ventaja: 'По нашей ссылке скидка 11 % на AirHelp+ (до 30 ноября 2026 г.; не действует в США).' },
}
