// Apps de la página de ventajas: cada tarjeta lleva los colores y el logo de su
// marca (como una ficha de tienda de apps), para que no se confundan entre sí.
// `codigo`: código de invitación (se copia) o enlace de afiliado (https://…, se usa como enlace).

export type Lang = 'es' | 'en' | 'ar' | 'ru'
export type Categoria = 'internet' | 'planes' | 'dormir' | 'moverse' | 'dinero' | 'utiles'

export interface App {
  clave: string
  cat: Categoria
  /** Fondo, tinta del logo y del botón; `logo` es una clave de LOGOS, si no, `palabra`. */
  marca: { fondo: string; tinta: string; boton?: string; botonTinta?: string; logo?: string; palabra?: string; puntos?: string[] }
  nombre: string
  enlace: string
  codigo?: string
  /** El ruso de las fichas cortas vive en datosVentajasDetalle.ts (T_RU). */
  t: Record<'es' | 'en' | 'ar', { que: string; ventaja: string }> & { ru?: { que: string; ventaja: string } }
}

export const CATEGORIAS: Record<Categoria, Record<Lang, string>> = {
  internet: { es: 'Internet', en: 'Mobile data', ar: 'الإنترنت', ru: 'Интернет' },
  planes: { es: 'Entradas y planes', en: 'Tickets & activities', ar: 'تذاكر وأنشطة', ru: 'Билеты и экскурсии' },
  dormir: { es: 'Alojamiento', en: 'Where to stay', ar: 'الإقامة', ru: 'Жильё' },
  moverse: { es: 'Moverse', en: 'Getting around', ar: 'التنقل', ru: 'Транспорт' },
  dinero: { es: 'Pagar', en: 'Paying', ar: 'الدفع', ru: 'Оплата' },
  utiles: { es: 'Imprescindibles', en: 'Must-haves', ar: 'أساسيات', ru: 'Самое нужное' },
}

export const APPS: App[] = [
  {
    clave: 'airalo', cat: 'internet', nombre: 'Airalo', enlace: 'https://airalo.tpk.ro/KoCqlrDV', codigo: 'PRINCE0661',
    marca: { fondo: '#141414', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#141414', palabra: 'airalo' },
    t: {
      es: { que: 'eSIM de Japón: datos en el móvil nada más aterrizar, sin buscar tienda ni wifi de bolsillo.', ventaja: 'Con mi código, 450 ¥ de descuento en tu primera eSIM. La instalas en casa y se activa sola en Kansai.' },
      en: { que: 'Japan eSIM: data on your phone the moment you land, no shop or pocket wifi needed.', ventaja: 'My code gives you ¥450 off your first eSIM. Install it at home; it switches on by itself in Kansai.' },
      ar: { que: 'شريحة eSIM لليابان: إنترنت على هاتفك فور الوصول، بلا متجر ولا واي فاي متنقل.', ventaja: 'برمزي تحصل على خصم 450 ين على أول شريحة. ثبّتها في بيتك وتعمل تلقائيًا في كانساي.' },
    },
  },
  {
    clave: 'klook', cat: 'planes', nombre: 'Klook', enlace: 'https://klook.tpk.ro/S2N5sxbl',
    marca: { fondo: '#FF5722', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#FF5722', logo: 'klook' },
    t: {
      es: { que: 'Entradas a Universal, Kaiyukan y Shinkansen, pases de tren y traslados desde el aeropuerto de Kansai.', ventaja: 'Suele salir más barato que en taquilla y muchas entradas se canjean con QR.' },
      en: { que: 'Universal, Kaiyukan and Shinkansen tickets, rail passes and Kansai airport transfers.', ventaja: 'Often cheaper than the ticket office, and many tickets work with a QR code.' },
      ar: { que: 'تذاكر يونيفرسال وكايوكان والشينكانسن، وبطاقات القطار والنقل من مطار كانساي.', ventaja: 'غالبًا أرخص من شباك التذاكر، وكثير منها يعمل برمز QR.' },
    },
  },
  {
    clave: 'gyg', cat: 'planes', nombre: 'GetYourGuide', enlace: 'https://www.getyourguide.com/',
    marca: { fondo: '#FF5533', tinta: '#ffffff', boton: '#1a1a1a', botonTinta: '#ffffff', palabra: 'GetYourGuide' },
    t: {
      es: { que: 'Clases de cocina, ceremonia del té y excursiones de grupo por Osaka, Kioto y Nara.', ventaja: 'Cancelación gratis hasta 24 h antes en la mayoría de actividades.' },
      en: { que: 'Cooking classes, tea ceremonies and group trips around Osaka, Kyoto and Nara.', ventaja: 'Free cancellation up to 24 h before on most activities.' },
      ar: { que: 'دروس طبخ ومراسم شاي ورحلات جماعية في أوساكا وكيوتو ونارا.', ventaja: 'إلغاء مجاني حتى 24 ساعة قبل الموعد في معظم الأنشطة.' },
    },
  },
  {
    clave: 'kkday', cat: 'planes', nombre: 'KKday', enlace: 'https://kkday.tpk.ro/wpimoorw',
    marca: { fondo: '#26BEC9', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#1b8f98', palabra: 'KKday' },
    t: {
      es: { que: 'Excursiones de un día desde Osaka (Nara, Kobe, Amanohashidate), kimonos y pases de tren.', ventaja: 'Muy fuerte en Asia: a menudo tiene el tour o la entrada más barata.' },
      en: { que: 'Day trips from Osaka (Nara, Kobe, Amanohashidate), kimono rental and rail passes.', ventaja: 'Strong in Asia: often has the cheapest tour or ticket.' },
      ar: { que: 'رحلات يوم واحد من أوساكا (نارا وكوبي وأمانوهاشيداتي) وتأجير الكيمونو وبطاقات القطار.', ventaja: 'قوي في آسيا: كثيرًا ما يقدّم أرخص جولة أو تذكرة.' },
    },
  },
  {
    clave: 'samurai', cat: 'planes', nombre: 'Samurai & Ninja Museum', enlace: 'https://mai-ko.com/samurai/', codigo: 'ag-special',
    marca: { fondo: '#1c1c1c', tinta: '#ffffff', boton: '#c8102e', botonTinta: '#ffffff', palabra: 'SAMURAI' },
    t: {
      es: { que: 'Museo Samurái y Ninja de Kioto: armaduras, katanas y lanzamiento de shuriken, con guía en inglés.', ventaja: 'Con el código ag-special, 10 % de descuento al reservar en su web. Ideal con niños.' },
      en: { que: 'Kyoto Samurai & Ninja Museum: armour, katanas and shuriken throwing, with an English-speaking guide.', ventaja: 'Code ag-special gives 10% off when you book on their website. Great with kids.' },
      ar: { que: 'متحف الساموراي والنينجا في كيوتو: دروع وسيوف كاتانا ورمي الشوريكن، مع مرشد بالإنجليزية.', ventaja: 'بالرمز ag-special تحصل على خصم 10% عند الحجز من موقعهم. رائع مع الأطفال.' },
    },
  },
  {
    clave: 'trip', cat: 'dormir', nombre: 'Trip.com', enlace: 'https://www.trip.com/',
    marca: { fondo: '#287DFA', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#287DFA', logo: 'trip' },
    t: {
      es: { que: 'Hoteles, vuelos y billetes de Shinkansen en una sola app, con atención en español.', ventaja: 'Buenos precios en hoteles de Japón y billetes de tren que llegan al móvil.' },
      en: { que: 'Hotels, flights and Shinkansen tickets in one app, with 24/7 support.', ventaja: 'Good prices on Japanese hotels, and train tickets straight to your phone.' },
      ar: { que: 'فنادق ورحلات طيران وتذاكر شينكانسن في تطبيق واحد، مع دعم على مدار الساعة.', ventaja: 'أسعار جيدة للفنادق في اليابان وتذاكر قطار تصل إلى هاتفك.' },
    },
  },
  {
    clave: 'agoda', cat: 'dormir', nombre: 'Agoda', enlace: 'https://www.agoda.com/',
    marca: { fondo: '#ffffff', tinta: '#2a2a2e', boton: '#5392F9', botonTinta: '#ffffff', palabra: 'agoda', puntos: ['#E32A2A', '#F9A11B', '#7FB539', '#7B4FC7', '#2C96DC'] },
    t: {
      es: { que: 'La web con más hoteles y apartamentos de Japón, de cápsulas a ryokan.', ventaja: 'Precios muy fuertes en Asia; mira bien que la tarifa sea con cancelación.' },
      en: { que: 'The widest choice of hotels and apartments in Japan, from capsules to ryokan.', ventaja: 'Very strong prices in Asia; check the rate includes free cancellation.' },
      ar: { que: 'أكبر خيار من الفنادق والشقق في اليابان، من الكبسولات إلى الريوكان.', ventaja: 'أسعار قوية جدًا في آسيا؛ تأكد أن السعر يشمل الإلغاء المجاني.' },
    },
  },
  {
    clave: 'booking', cat: 'dormir', nombre: 'Booking.com', enlace: 'https://www.booking.com/',
    marca: { fondo: '#003580', tinta: '#ffffff', boton: '#0071C2', botonTinta: '#ffffff', palabra: 'Booking.com' },
    t: {
      es: { que: 'La de siempre: hoteles en Namba, Umeda o junto a la estación de Kioto.', ventaja: 'Muchas tarifas se pagan en el hotel y se cancelan gratis.' },
      en: { que: 'The classic: hotels in Namba, Umeda or next to Kyoto Station.', ventaja: 'Many rates are paid at the hotel and cancel for free.' },
      ar: { que: 'الخيار المعروف: فنادق في نامبا أو أومِيدا أو قرب محطة كيوتو.', ventaja: 'كثير من الأسعار تُدفع في الفندق ويمكن إلغاؤها مجانًا.' },
    },
  },
  {
    clave: 'welcome', cat: 'moverse', nombre: 'Welcome Pickups', enlace: 'https://tpk.ro/cy86mOVf',
    marca: { fondo: '#14C38E', tinta: '#ffffff', boton: '#0F2A3A', botonTinta: '#ffffff', palabra: 'Welcome' },
    t: {
      es: { que: 'Un conductor te espera en el aeropuerto de Kansai con tu nombre y te lleva al hotel.', ventaja: 'Precio cerrado al reservar; ideal si llegas de noche o con niños y maletas.' },
      en: { que: 'A driver waits for you at Kansai Airport with your name and takes you to your hotel.', ventaja: 'Fixed price when you book; ideal if you land at night or with kids and bags.' },
      ar: { que: 'سائق ينتظرك في مطار كانساي حاملًا اسمك ويوصلك إلى الفندق.', ventaja: 'سعر ثابت عند الحجز؛ مثالي إن وصلت ليلًا أو مع أطفال وحقائب.' },
    },
  },
  {
    clave: 'icoca', cat: 'moverse', nombre: 'ICOCA', enlace: 'https://www.jr-odekake.net/icoca/',
    marca: { fondo: '#0A6CB8', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#0A6CB8', palabra: 'ICOCA' },
    t: {
      es: { que: 'La tarjeta de transporte de Kansai dentro del iPhone: tren, metro, bus y konbini.', ventaja: 'Se añade gratis en la app Cartera y se recarga con tu tarjeta, sin depósito.' },
      en: { que: "Kansai's transport card inside your iPhone: train, subway, bus and konbini.", ventaja: 'Add it free in the Wallet app and top up with your card, no deposit.' },
      ar: { que: 'بطاقة مواصلات كانساي داخل الآيفون: القطار والمترو والحافلة والمتاجر.', ventaja: 'تضيفها مجانًا من تطبيق المحفظة وتشحنها ببطاقتك بلا تأمين.' },
    },
  },
  {
    clave: 'go', cat: 'moverse', nombre: 'GO', enlace: 'https://go.goinc.jp/',
    marca: { fondo: '#1C1C1C', tinta: '#ffffff', boton: '#F5C400', botonTinta: '#1C1C1C', palabra: 'GO' },
    t: {
      es: { que: 'La app de taxis que usan los japoneses: pides el taxi y te dice el precio aproximado.', ventaja: 'Funciona en inglés y se paga en la app, sin hablar con el conductor.' },
      en: { que: 'The taxi app locals use: book a cab and see the approximate fare.', ventaja: 'Works in English and you pay in the app, no need to talk to the driver.' },
      ar: { que: 'تطبيق سيارات الأجرة الذي يستخدمه اليابانيون: تطلب التاكسي وترى السعر التقريبي.', ventaja: 'يعمل بالإنجليزية والدفع داخل التطبيق، بلا حاجة للحديث مع السائق.' },
    },
  },
  {
    clave: 'uber', cat: 'moverse', nombre: 'Uber', enlace: 'https://www.uber.com/jp/en/',
    marca: { fondo: '#000000', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#000000', logo: 'uber' },
    t: {
      es: { que: 'En Osaka y Kioto Uber pide taxis normales; útil si ya tienes la app.', ventaja: 'Mismo precio que el taxímetro y pagas con tu cuenta de siempre.' },
      en: { que: 'In Osaka and Kyoto Uber books regular taxis; handy if you already have the app.', ventaja: 'Same price as the meter, paid with your usual account.' },
      ar: { que: 'في أوساكا وكيوتو يطلب أوبر سيارات أجرة عادية؛ مفيد إن كان التطبيق لديك.', ventaja: 'نفس سعر العدّاد وتدفع بحسابك المعتاد.' },
    },
  },
  {
    clave: 'luup', cat: 'moverse', nombre: 'LUUP', enlace: 'https://luup.sc/en/',
    marca: { fondo: '#26292D', tinta: '#00ADA8', boton: '#00ADA8', botonTinta: '#ffffff', palabra: 'LUUP' },
    t: {
      es: { que: 'Patinetes y bicis eléctricas compartidos por Osaka y Kioto.', ventaja: 'Patinete desde 16 años tras su test de normas; la bici no pide test.' },
      en: { que: 'Shared e-scooters and e-bikes all over Osaka and Kyoto.', ventaja: 'Scooters from age 16 after a short rules quiz; bikes need no quiz.' },
      ar: { que: 'سكوترات ودراجات كهربائية مشتركة في أوساكا وكيوتو.', ventaja: 'السكوتر من عمر 16 بعد اختبار قصير للقواعد؛ الدراجة بلا اختبار.' },
    },
  },
  {
    clave: 'hello', cat: 'moverse', nombre: 'HELLO CYCLING', enlace: 'https://www.hellocycling.jp/',
    marca: { fondo: '#FFE000', tinta: '#1a1a1a', boton: '#1a1a1a', botonTinta: '#FFE000', palabra: 'HELLO CYCLING' },
    t: {
      es: { que: 'Bicis eléctricas con cientos de estaciones en Kansai. Ideal para Kioto, donde el bus va lleno.', ventaja: 'Se paga por minutos con tarjeta; no hace falta cuenta japonesa.' },
      en: { que: 'E-bikes with hundreds of stations in Kansai. Great for Kyoto, where buses are packed.', ventaja: 'Pay by the minute by card; no Japanese account needed.' },
      ar: { que: 'دراجات كهربائية بمئات المحطات في كانساي، مثالية لكيوتو حيث الحافلات مزدحمة.', ventaja: 'الدفع بالدقيقة بالبطاقة، بلا حاجة إلى حساب ياباني.' },
    },
  },
  {
    clave: 'wise', cat: 'dinero', nombre: 'Wise', enlace: 'https://wise.com/',
    marca: { fondo: '#9FE870', tinta: '#163300', boton: '#163300', botonTinta: '#9FE870', logo: 'wise' },
    t: {
      es: { que: 'Tarjeta para pagar en yenes al cambio real, sin las comisiones del banco.', ventaja: 'La que uso yo; también sirve para pagarme el tour sin comisiones.' },
      en: { que: 'A card to pay in yen at the real exchange rate, without bank fees.', ventaja: 'It is what I use, and you can pay for your tour with it too.' },
      ar: { que: 'بطاقة للدفع بالين بسعر الصرف الحقيقي، بلا رسوم البنوك.', ventaja: 'هي ما أستخدمه، ويمكنك الدفع بها ثمن الجولة أيضًا.' },
    },
  },
  {
    clave: 'maps', cat: 'utiles', nombre: 'Google Maps', enlace: 'https://www.google.com/maps',
    marca: { fondo: '#ffffff', tinta: '#4285F4', boton: '#1A73E8', botonTinta: '#ffffff', logo: 'maps' },
    t: {
      es: { que: 'En Japón da el andén, el vagón y la hora exacta de cada tren.', ventaja: 'Guarda en una lista los sitios que quieres ver: los tienes a un toque con datos.' },
      en: { que: 'In Japan it gives the platform, the car and the exact time of every train.', ventaja: 'Save the places you want to see in a list: one tap away once you have data.' },
      ar: { que: 'في اليابان يعطيك الرصيف والعربة والوقت الدقيق لكل قطار.', ventaja: 'احفظ الأماكن التي تريد زيارتها في قائمة لتصل إليها بلمسة.' },
    },
  },
  {
    clave: 'traductor', cat: 'utiles', nombre: 'Google Translate', enlace: 'https://translate.google.com/',
    marca: { fondo: '#E8F0FE', tinta: '#1A73E8', boton: '#1A73E8', botonTinta: '#ffffff', logo: 'traductor' },
    t: {
      es: { que: 'Con la cámara lees cartas, carteles y etiquetas en japonés al momento.', ventaja: 'Descarga el japonés sin conexión: funciona en el metro sin datos.' },
      en: { que: 'Point the camera at menus, signs and labels to read Japanese instantly.', ventaja: 'Download Japanese offline: it works in the subway without data.' },
      ar: { que: 'وجّه الكاميرا إلى القوائم واللافتات والملصقات لتقرأ اليابانية فورًا.', ventaja: 'حمّل اللغة اليابانية دون اتصال لتعمل في المترو بلا إنترنت.' },
    },
  },
  {
    clave: 'radical', cat: 'utiles', nombre: 'Radical Storage', enlace: 'https://radicalstorage.tpk.ro/EgagwQA7',
    marca: { fondo: '#FF6A3D', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#d9481c', palabra: 'Radical' },
    t: {
      es: { que: 'Consigna de maletas en tiendas y hoteles de Namba, Umeda y la estación de Kioto.', ventaja: 'Dejas el equipaje tras el check-out y aprovechas el último día sin cargar.' },
      en: { que: 'Luggage storage in shops and hotels in Namba, Umeda and Kyoto Station.', ventaja: 'Drop your bags after check-out and enjoy your last day hands-free.' },
      ar: { que: 'حفظ الأمتعة في متاجر وفنادق نامبا وأومِيدا ومحطة كيوتو.', ventaja: 'اترك حقائبك بعد تسجيل الخروج واستمتع بيومك الأخير بلا حمل.' },
    },
  },
]
