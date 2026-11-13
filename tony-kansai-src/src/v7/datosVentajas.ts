// Apps de la página de ventajas: cada tarjeta lleva los colores y el logo de su
// marca (como una ficha de tienda de apps), para que no se confundan entre sí.
// `codigo`: código de invitación (se copia) o enlace de afiliado (https://…, se usa como enlace).

export type Lang = 'es' | 'en' | 'ar' | 'ru'
export type Categoria = 'experiencias' | 'internet' | 'planes' | 'dormir' | 'moverse' | 'dinero' | 'utiles'

export interface App {
  clave: string
  cat: Categoria
  /** Fondo, tinta del logo y del botón; `logo` es una clave de LOGOS, si no, `palabra`. */
  marca: { fondo: string; tinta: string; boton?: string; botonTinta?: string; logo?: string; palabra?: string; puntos?: string[] }
  nombre: string
  enlace: string
  codigo?: string
  /** Lo que ahorra el código, corto (va en la franja de códigos): '10 %', '−450 ¥'. */
  descuento?: string
  /** Último día del código (AAAA-MM-DD): pasado ese día, la web deja de enseñarlo. */
  caduca?: string
  /** Experiencias: ciudad (se escribe igual en todos los idiomas salvo ar/ru, ver CIUDADES). */
  ciudad?: Ciudad
  /** Apto para familias musulmanas (hiyab, sin alcohol, sala de oración…): sale con sello y filtro propio. */
  musulman?: boolean
  /** Ventaja que solo tienes viniendo conmigo o diciendo mi nombre (no la ve cualquiera en su web). */
  conTony?: boolean
  /** El ruso de las fichas cortas vive en datosVentajasDetalle.ts (T_RU). */
  t: Record<'es' | 'en' | 'ar', { que: string; ventaja: string }> & { ru?: { que: string; ventaja: string } }
}

// Título y descripción de la página de ventajas: los usa la página y también
// src/seo/cabeceras.ts, que los escribe en el HTML estático para Google.
export const SEO_VENTAJAS: Record<Lang, { titulo: string; descripcion: string }> = {
  es: { titulo: 'Ventajas para tu viaje a Kansai: apps y códigos | Tony Kansai Guide', descripcion: 'Las apps que recomiendo para Kansai: eSIM, entradas, hoteles, taxis, bicis y pagos. Airalo, Klook, GetYourGuide, Trip.com, Agoda, GO, LUUP, ICOCA y Wise.' },
  en: { titulo: 'Perks for your Kansai trip: apps and invite links | Tony Kansai Guide', descripcion: 'The apps I recommend for Kansai: eSIM, tickets, hotels, taxis, bikes and payments. Airalo, Klook, GetYourGuide, Trip.com, Agoda, GO, LUUP, ICOCA and Wise.' },
  ar: { titulo: 'مزايا لرحلتك إلى كانساي: تطبيقات وروابط دعوة | Tony Kansai Guide', descripcion: 'التطبيقات التي أستخدمها كل يوم في أوساكا وكيوتو للتنقل والدفع، مع روابط الدعوة الخاصة بي: Wise وLUUP وHELLO CYCLING وبطاقة ICOCA على الهاتف.' },
  ru: { titulo: 'Полезные приложения для поездки в Кансай | Tony Kansai Guide', descripcion: 'Приложения, которые мы советуем для Осаки и Киото: eSIM, билеты, трансфер, такси, велосипеды, хранение багажа и оплата.' },
}

export const RUTA_VENTAJAS: Record<Lang, string> = { es: '/es/ventajas/', en: '/en/perks/', ar: '/ar/perks/', ru: '/ru/perks/' }

export type Ciudad = 'osaka' | 'kioto' | 'nara' | 'kumano' | 'tokio' | 'hiroshima' | 'ishikawa' | 'gifu' | 'nagasaki' | 'amakusa' | 'hokkaido'
export const CIUDADES: Record<Ciudad, Record<Lang, string>> = {
  osaka: { es: 'Osaka', en: 'Osaka', ar: 'أوساكا', ru: 'Осака' },
  kioto: { es: 'Kioto', en: 'Kyoto', ar: 'كيوتو', ru: 'Киото' },
  nara: { es: 'Nara', en: 'Nara', ar: 'نارا', ru: 'Нара' },
  kumano: { es: 'Kumano (Wakayama)', en: 'Kumano (Wakayama)', ar: 'كومانو (واكاياما)', ru: 'Кумано (Вакаяма)' },
  tokio: { es: 'Tokio', en: 'Tokyo', ar: 'طوكيو', ru: 'Токио' },
  hiroshima: { es: 'Hiroshima', en: 'Hiroshima', ar: 'هيروشيما', ru: 'Хиросима' },
  ishikawa: { es: 'Kanazawa y Hakusan (Ishikawa)', en: 'Kanazawa & Hakusan (Ishikawa)', ar: 'كانازاوا وهاكوسان (إيشيكاوا)', ru: 'Канадзава и Хакусан (Исикава)' },
  gifu: { es: 'Seki (Gifu)', en: 'Seki (Gifu)', ar: 'سيكي (غيفو)', ru: 'Сэки (Гифу)' },
  nagasaki: { es: 'Shimabara (Nagasaki)', en: 'Shimabara (Nagasaki)', ar: 'شيمابارا (ناغازاكي)', ru: 'Симабара (Нагасаки)' },
  amakusa: { es: 'Amakusa (Kumamoto)', en: 'Amakusa (Kumamoto)', ar: 'أماكوسا (كوماموتو)', ru: 'Амакуса (Кумамото)' },
  hokkaido: { es: 'Shiretoko (Hokkaido)', en: 'Shiretoko (Hokkaido)', ar: 'شيريتوكو (هوكايدو)', ru: 'Сиретоко (Хоккайдо)' },
}

export const CATEGORIAS: Record<Categoria, Record<Lang, string>> = {
  experiencias: { es: 'Experiencias', en: 'Experiences', ar: 'تجارب', ru: 'Впечатления' },
  internet: { es: 'Internet', en: 'Mobile data', ar: 'الإنترنت', ru: 'Интернет' },
  planes: { es: 'Entradas y planes', en: 'Tickets & activities', ar: 'تذاكر وأنشطة', ru: 'Билеты и экскурсии' },
  dormir: { es: 'Alojamiento', en: 'Where to stay', ar: 'الإقامة', ru: 'Жильё' },
  moverse: { es: 'Moverse', en: 'Getting around', ar: 'التنقل', ru: 'Транспорт' },
  dinero: { es: 'Pagar', en: 'Paying', ar: 'الدفع', ru: 'Оплата' },
  utiles: { es: 'Imprescindibles', en: 'Must-haves', ar: 'أساسيات', ru: 'Самое нужное' },
}

const LISTA: App[] = [
  {
    clave: 'airalo', cat: 'internet', nombre: 'Airalo', enlace: 'https://airalo.tpk.ro/KoCqlrDV', codigo: 'PRINCE0661', descuento: '−450 ¥',
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
    clave: 'samurai', cat: 'experiencias', ciudad: 'kioto', conTony: true, nombre: 'Samurai & Ninja Museum', enlace: 'https://mai-ko.com/samurai/', descuento: '10 %',
    marca: { fondo: '#1c1c1c', tinta: '#ffffff', boton: '#c8102e', botonTinta: '#ffffff', palabra: 'SAMURAI' },
    t: {
      es: { que: 'Museo Samurái y Ninja de Kioto: armaduras, katanas y lanzamiento de shuriken, con guía en inglés.', ventaja: 'Te lo reservo yo con un 10 % menos (escríbeme por WhatsApp). Una hora divertida y a cubierto, ideal con niños.' },
      en: { que: 'Kyoto Samurai & Ninja Museum: armour, katanas and shuriken throwing, with an English-speaking guide.', ventaja: 'I book it for you with 10% off (message me on WhatsApp). A fun indoor hour, great with kids.' },
      ar: { que: 'متحف الساموراي والنينجا في كيوتو: دروع وسيوف كاتانا ورمي الشوريكن، مع مرشد بالإنجليزية.', ventaja: 'أحجزه لك بخصم 10% (راسلني عبر واتساب). ساعة ممتعة في مكان مغلق، رائع مع الأطفال.' },
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
    // Afiliado directo (plan híbrido 10 % cliente / 5 % comisión, 13-10-2026); el enlace ya lleva el cupón.
    clave: 'radical', cat: 'utiles', nombre: 'Radical Storage', enlace: 'https://radicalstorage.com/?acc=3d471cfd732601c321ee2622864dff8f&utm_source=aff_link&utm_medium=3d471cfd732601c321ee2622864dff8f&couponCode=TONYKANSAI', codigo: 'TONYKANSAI', descuento: '10 %',
    marca: { fondo: '#FF6A3D', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#d9481c', palabra: 'Radical' },
    t: {
      es: { que: 'Consigna de maletas en tiendas y hoteles de Namba, Umeda y la estación de Kioto.', ventaja: 'Con mi enlace o el código TONYKANSAI, 10 % de descuento. Dejas el equipaje tras el check-out y aprovechas el último día sin cargar.' },
      en: { que: 'Luggage storage in shops and hotels in Namba, Umeda and Kyoto Station.', ventaja: 'My link or the code TONYKANSAI gives you 10% off. Drop your bags after check-out and enjoy your last day hands-free.' },
      ar: { que: 'حفظ الأمتعة في متاجر وفنادق نامبا وأومِيدا ومحطة كيوتو.', ventaja: 'برابطي أو بالرمز TONYKANSAI خصم 10%. اترك حقائبك بعد تسجيل الخروج واستمتع بيومك الأخير بلا حمل.' },
    },
  },
  {
    // Afiliado de Mobal (Post Affiliate Pro, partners.mobal.com): a_aid=tonykansai.
    clave: 'mobal', cat: 'internet', nombre: 'Mobal', enlace: 'https://www.mobal.com/?a_aid=tonykansai',
    marca: { fondo: '#0b2a4a', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#0b2a4a', palabra: 'mobal' },
    t: {
      es: { que: 'SIM y eSIM para Japón, también con número de teléfono japonés para llamar a restaurantes y hoteles.', ventaja: 'Útil si necesitas un número local además de datos durante todo el viaje.' },
      en: { que: 'Japan SIM and eSIM, also with a Japanese phone number for calling restaurants and hotels.', ventaja: 'Handy if you need a local number as well as data for the whole trip.' },
      ar: { que: 'شريحة SIM وeSIM لليابان، ومعها رقم هاتف ياباني للاتصال بالمطاعم والفنادق.', ventaja: 'مفيدة إن احتجت رقمًا محليًا إلى جانب الإنترنت طوال الرحلة.' },
    },
  },
  {
    // Afiliado de Nomad por Impact (contrato 34279 aceptado el 14-10-2026: 15 % cliente nuevo, 10 % existente).
    // Código TONYKANSAI creado por Nomad el 15-10-2026: 20 %, un uso por cliente, ligado a la cuenta de Impact.
    clave: 'nomad', cat: 'internet', nombre: 'Nomad eSIM', enlace: 'https://lotusflareinc.pxf.io/c/7953984/2915870/34279', codigo: 'TONYKANSAI', descuento: '20 %', caduca: '2029-06-01',
    marca: { fondo: '#1a56db', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#1a56db', palabra: 'Nomad' },
    t: {
      es: { que: 'eSIM de datos para Japón y más de 200 países: eliges los GB y los días, y la instalas antes de salir.', ventaja: 'Con mi enlace y el código TONYKANSAI, 20 % de descuento (un uso por persona; no vale en planes de menos de 5 $, ilimitados ni en oferta).' },
      en: { que: 'Data eSIM for Japan and 200+ countries: pick the GB and days, and install it before you leave.', ventaja: 'My link plus the code TONYKANSAI gives you 20% off (one use per person; not on plans under $5, unlimited or sale plans).' },
      ar: { que: 'شريحة eSIM للإنترنت في اليابان وأكثر من 200 دولة: تختار الجيجابايت والأيام وتثبّتها قبل السفر.', ventaja: 'برابطي والرمز TONYKANSAI خصم 20% (مرة واحدة لكل شخص، ولا يسري على الباقات الأقل من 5 دولارات أو غير المحدودة أو المخفّضة).' },
    },
  },
  {
    // Programa Travel Advisor (10 % para el cliente o comisión) pendiente de alta: de momento, web oficial.
    clave: 'flytographer', cat: 'experiencias', nombre: 'Flytographer', enlace: 'https://www.flytographer.com/',
    marca: { fondo: '#111111', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#111111', palabra: 'Flytographer' },
    t: {
      es: { que: 'Fotógrafos locales en Kioto y Osaka: una sesión de fotos de toda la familia junta durante el viaje.', ventaja: 'Por fin salís todos en las fotos; las recibís en una galería online.' },
      en: { que: 'Local photographers in Kyoto and Osaka: a photo session with the whole family together on your trip.', ventaja: 'Everyone finally gets in the photos; you receive them in an online gallery.' },
      ar: { que: 'مصورون محليون في كيوتو وأوساكا: جلسة تصوير للعائلة كلها معًا خلال الرحلة.', ventaja: 'أخيرًا تظهرون جميعًا في الصور، وتصلكم في معرض على الإنترنت.' },
    },
  },
  {
    clave: 'tiqets', cat: 'planes', nombre: 'Tiqets', enlace: 'https://tiqets.tpk.ro/a8lxNiUn',
    marca: { fondo: '#1C1B3A', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#1C1B3A', palabra: 'Tiqets' },
    t: {
      es: { que: 'Entradas a museos y atracciones de Osaka y Kioto, en el móvil y al momento.', ventaja: 'Sin colas para comprar: enseñas el QR en la puerta.' },
      en: { que: 'Tickets to museums and attractions in Osaka and Kyoto, on your phone in seconds.', ventaja: 'No ticket queues: just show the QR code at the door.' },
      ar: { que: 'تذاكر المتاحف والمعالم في أوساكا وكيوتو، على هاتفك فورًا.', ventaja: 'بلا طوابير شراء: تُظهر رمز QR عند الباب.' },
    },
  },
  {
    clave: 'kiwitaxi', cat: 'moverse', nombre: 'Kiwitaxi', enlace: 'https://kiwitaxi.tpk.ro/s5ft3LPj',
    marca: { fondo: '#FFD100', tinta: '#141414', boton: '#141414', botonTinta: '#FFD100', palabra: 'Kiwitaxi' },
    t: {
      es: { que: 'Traslado privado del aeropuerto de Kansai al hotel, reservado antes de volar.', ventaja: 'Precio cerrado al reservar y el conductor te espera en llegadas.' },
      en: { que: 'Private transfer from Kansai Airport to your hotel, booked before you fly.', ventaja: 'Fixed price when you book, and the driver waits for you at arrivals.' },
      ar: { que: 'توصيل خاص من مطار كانساي إلى فندقك، تحجزه قبل السفر.', ventaja: 'سعر ثابت عند الحجز، والسائق ينتظرك في صالة الوصول.' },
    },
  },
  {
    clave: 'intui', cat: 'moverse', nombre: 'intui.travel', enlace: 'https://intui.tpk.ro/iLD1b8ME',
    marca: { fondo: '#E3262B', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#E3262B', palabra: 'intui' },
    t: {
      es: { que: 'Traslados privados desde el aeropuerto o entre ciudades: coche, monovolumen o minibús para grupos.', ventaja: 'Precio cerrado por vehículo antes de pagar; el conductor te espera en llegadas.' },
      en: { que: 'Private transfers from the airport or between cities: car, minivan or minibus for groups.', ventaja: 'Fixed price per vehicle before you pay; the driver waits for you at arrivals.' },
      ar: { que: 'توصيل خاص من المطار أو بين المدن: سيارة أو فان أو حافلة صغيرة للمجموعات.', ventaja: 'سعر ثابت للمركبة قبل الدفع، والسائق ينتظرك في صالة الوصول.' },
    },
  },
  {
    clave: 'yesim', cat: 'internet', nombre: 'Yesim', enlace: 'https://yesim.tpk.ro/hTrigKKQ',
    marca: { fondo: '#111111', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#111111', palabra: 'Yesim' },
    t: {
      es: { que: 'Otra eSIM para Japón, con planes por días o por gigas desde su app.', ventaja: 'Útil si viajas por varios países: una sola app para todo el viaje.' },
      en: { que: 'Another Japan eSIM, with plans by days or by gigabytes from its app.', ventaja: 'Handy if you visit several countries: one app for the whole trip.' },
      ar: { que: 'شريحة eSIM أخرى لليابان، بباقات بالأيام أو بالغيغابايت من تطبيقها.', ventaja: 'مفيدة إن زرت عدة دول: تطبيق واحد للرحلة كلها.' },
    },
  },
  {
    clave: 'ekta', cat: 'utiles', nombre: 'EKTA', enlace: 'https://ektatraveling.tpk.ro/PDbp3NoD',
    marca: { fondo: '#FF5A1F', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#d9430e', palabra: 'EKTA' },
    t: {
      es: { que: 'Seguro de viaje online: lo contratas en unos minutos y recibes la póliza por correo.', ventaja: 'En Japón la sanidad es excelente pero cara para el turista: mejor ir cubierto.' },
      en: { que: 'Online travel insurance: buy it in a few minutes and get the policy by email.', ventaja: 'Healthcare in Japan is excellent but expensive for visitors: better to be covered.' },
      ar: { que: 'تأمين سفر عبر الإنترنت: تشتريه في دقائق وتصلك الوثيقة بالبريد.', ventaja: 'الرعاية الصحية في اليابان ممتازة لكنها مكلفة للزائر: الأفضل أن تكون مؤمَّنًا.' },
    },
  },
  {
    // Afiliado de IATI Seguros (panel myiati.com): ?r=28859190572940.
    clave: 'iati', cat: 'utiles', nombre: 'IATI Seguros', enlace: 'https://www.iatiseguros.com?r=28859190572940',
    marca: { fondo: '#F28C00', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#c96f00', palabra: 'iati' },
    t: {
      es: { que: 'Seguro de viaje de una aseguradora española: lo contratas online y la póliza te llega por correo.', ventaja: 'Asistencia en español las 24 horas: si te pones malo en Japón, hablas con alguien en tu idioma.' },
      en: { que: 'Travel insurance from a Spanish insurer: buy it online and get the policy by email.', ventaja: 'Japanese healthcare is excellent but expensive for visitors: travel covered from day one.' },
      ar: { que: 'تأمين سفر من شركة إسبانية: تشتريه عبر الإنترنت وتصلك الوثيقة بالبريد.', ventaja: 'الرعاية الصحية في اليابان ممتازة لكنها مكلفة للزائر: سافر مؤمَّنًا من اليوم الأول.' },
    },
  },
  {
    clave: 'airhelp', cat: 'utiles', nombre: 'AirHelp', enlace: 'https://airhelp.tpk.ro/xUhwrt3z',
    marca: { fondo: '#0B6CF0', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#0B6CF0', palabra: 'AirHelp' },
    t: {
      es: { que: 'Si tu vuelo se retrasa, se cancela o pierdes la conexión, te ayuda a reclamar la compensación que te corresponda.', ventaja: 'Con mi enlace, 11 % de descuento en AirHelp+ (hasta el 30 de noviembre de 2026; no válido en EE. UU.).' },
      en: { que: 'If your flight is delayed, cancelled or you miss a connection, it helps you claim the compensation you are owed.', ventaja: 'My link gives you 11% off AirHelp+ (until 30 November 2026; not valid in the US).' },
      ar: { que: 'إن تأخرت رحلتك أو أُلغيت أو فاتتك رحلة الربط، يساعدك على المطالبة بالتعويض المستحق لك.', ventaja: 'برابطي خصم 11٪ على AirHelp+ (حتى 30 نوفمبر 2026؛ غير صالح في الولايات المتحدة).' },
    },
  },
  {
    // Chapka (Aon France): afiliado desde el 22-10-2026, app=tonykansaiguide (correo de Sara Sanz, 2-11). Cap Trip = seguro de viaje corto.
    clave: 'chapka', cat: 'utiles', nombre: 'Chapka', enlace: 'https://www.chapkadirect.es/index.php?action=produit&id=956&app=tonykansaiguide',
    marca: { fondo: '#e4572e', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#e4572e', palabra: 'Chapka' },
    t: {
      es: { que: 'Seguro de viaje para Japón: gastos médicos, repatriación, equipaje y anulación. Se contrata online en unos minutos.', ventaja: 'Con mi enlace llegas directo al seguro Cap Trip, pensado para viajes cortos como el tuyo.' },
      en: { que: 'Travel insurance for Japan: medical costs, repatriation, luggage and cancellation. You buy it online in a few minutes.', ventaja: 'My link takes you straight to Cap Trip, their plan for short trips like yours.' },
      ar: { que: 'تأمين سفر لليابان: النفقات الطبية والإعادة إلى الوطن والأمتعة والإلغاء. يُشترى عبر الإنترنت في دقائق.', ventaja: 'رابطي يأخذك مباشرة إلى خطة Cap Trip المخصصة للرحلات القصيرة مثل رحلتك.' },
    },
  },
  {
    clave: 'wargo', cat: 'experiencias', ciudad: 'kioto', conTony: true, nombre: 'Kimono Wargo', enlace: 'https://kyotokimonorental.com/en', codigo: '261013_wgtn', descuento: '10 %', caduca: '2026-12-31',
    marca: { fondo: '#b5274a', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#b5274a', palabra: '着物' },
    t: {
      es: { que: 'Alquiler de kimono y yukata en Kioto: te lo ponen en la tienda y sales a pasear por Higashiyama o Gion.', ventaja: 'Con el código 261013_wgtn, 10 % de descuento al reservar en su web (hasta el 31-12-2026).' },
      en: { que: 'Kimono and yukata rental in Kyoto: they dress you in the shop and you walk out into Higashiyama or Gion.', ventaja: 'Code 261013_wgtn gives 10% off when you book on their website (until 31 Dec 2026).' },
      ar: { que: 'استئجار الكيمونو واليوكاتا في كيوتو: يُلبسونك في المتجر وتخرج للتنزه في هيغاشياما أو غيون.', ventaja: 'بالرمز 261013_wgtn خصم 10% عند الحجز من موقعهم (حتى 31-12-2026).' },
    },
  },
  {
    clave: 'camellia', cat: 'experiencias', ciudad: 'kioto', conTony: true, nombre: 'Camellia Tea Ceremony', enlace: 'https://tea-kyoto.com/', codigo: 'CAMAGENT67', descuento: '10 %',
    marca: { fondo: '#2f4a32', tinta: '#f3ead7', boton: '#f3ead7', botonTinta: '#2f4a32', palabra: '茶' },
    t: {
      es: { que: 'Ceremonia del té en una casa de té de Higashiyama (Kioto), tranquila y apta para familias.', ventaja: 'Código CAMAGENT67: 10 % menos en todas sus casas de té, también en el alquiler de kimono. Se reserva solo en su web, hasta 24 h antes. Si quieres que te traduzca al español o al árabe, reserva una ceremonia privada y entro contigo.' },
      en: { que: 'Tea ceremony in a Higashiyama teahouse in Kyoto: calm and family-friendly.', ventaja: 'Code CAMAGENT67: 10% off at all their teahouses, kimono rental included. Online booking only, up to 24 h before. Want me to translate into Spanish or Arabic? Book a private ceremony and I come in with you.' },
      ar: { que: 'حفل الشاي في بيت شاي في هيغاشياما بكيوتو: هادئ ومناسب للعائلات.', ventaja: 'الرمز CAMAGENT67: خصم 10% في كل بيوت الشاي لديهم، ويشمل تأجير الكيمونو. الحجز عبر موقعهم فقط وحتى 24 ساعة قبل الموعد. إن أردت أن أترجم لك إلى العربية أو الإسبانية، احجز حفلًا خاصًا وأدخل معك.' },
    },
  },
  {
    // SnapKyoto (Matt, fotógrafo freelance): 10 % de comisión por PayPal si el cliente dice mi nombre al reservar (acuerdo por correo, 15-10-2026).
    clave: 'snapkyoto', cat: 'experiencias', ciudad: 'kioto', conTony: true, nombre: 'SnapKyoto', enlace: 'https://snapkyoto.com',
    marca: { fondo: '#0d0d0d', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#0d0d0d', palabra: 'Snap' },
    t: {
      es: { que: 'Matt, fotógrafo en Kioto, Osaka y Nara: sesión de fotos de la familia o la pareja en Gion, Arashiyama o donde vayamos.', ventaja: 'Al reservar, di que vienes de parte de Tony Hanma (Tony Kansai Guide). Si estamos de tour, encajo la sesión en la ruta.' },
      en: { que: 'Matt, a photographer in Kyoto, Osaka and Nara: a family or couple photo session in Gion, Arashiyama or wherever we go.', ventaja: 'When you book, say you come from Tony Hanma (Tony Kansai Guide). If we are touring together, I fit the session into the route.' },
      ar: { que: 'مات، مصوّر في كيوتو وأوساكا ونارا: جلسة تصوير للعائلة أو الزوجين في غيون أو أراشيياما أو حيث نذهب.', ventaja: 'عند الحجز قل إنك من طرف Tony Hanma (Tony Kansai Guide). وإن كنا في جولة معًا، أضع الجلسة في المسار.' },
    },
  },
  {
    // Yumeyakata: registrado como guía nº 1085 el 15-10-2026; el cliente lo escribe al reservar por adelantado.
    clave: 'yumeyakata', cat: 'experiencias', ciudad: 'kioto', conTony: true, musulman: true, nombre: 'Yumeyakata', enlace: 'https://www.kyoto.yumeyakata.com/', codigo: '1085',
    marca: { fondo: '#5b2a6e', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#5b2a6e', palabra: '夢' },
    t: {
      es: { que: 'Alquiler de kimono en Kioto (tiendas de Gojo y Oike), con peinado, maquillaje, ceremonia del té y fotos. Tienen sala de oración para sus clientes.', ventaja: 'Reserva por adelantado y escribe en las notas «ガイド番号1085 (Tony Hanma)»: así saben que vienes conmigo.' },
      en: { que: 'Kimono rental in Kyoto (Gojo and Oike shops), with hair set, make-up, tea ceremony and photos. They have a prayer room for their customers.', ventaja: 'Book in advance and write “Guide number 1085 (Tony Hanma)” in the notes, so they know you come with me.' },
      ar: { que: 'استئجار الكيمونو في كيوتو (فرعا غوجو وأويكي)، مع تصفيف الشعر والمكياج وحفل الشاي والتصوير. لديهم غرفة صلاة لعملائهم.', ventaja: 'احجز مسبقًا واكتب في الملاحظات «Guide number 1085 (Tony Hanma)» ليعرفوا أنك قادم معي.' },
    },
  },
  {
    // Shogun Studio (Yoshi, dueño): 5 % de comisión por reserva pagada de un cliente mío (correo 16-10-2026); falta saber cómo identifica al cliente.
    clave: 'shogun', cat: 'experiencias', ciudad: 'kioto', conTony: true, nombre: 'Shogun Studio Japan', enlace: 'https://shogunstudiojapan.com/',
    marca: { fondo: '#111111', tinta: '#d4a646', boton: '#d4a646', botonTinta: '#111111', palabra: '侍' },
    t: {
      es: { que: 'Ponte una armadura samurái de verdad en su estudio de Arashiyama (Kioto), con fotos para llevarte. También tienen kimono y ninja.', ventaja: 'Si vienes de tour conmigo por Arashiyama, lo encajo en la ruta y lo reservo yo con ellos.' },
      en: { que: 'Wear real samurai armour at their Arashiyama studio in Kyoto, with photos to take home. They also do kimono and ninja.', ventaja: 'Touring Arashiyama with me? I fit it into the route and book it with them for you.' },
      ar: { que: 'ارتدِ درع ساموراي حقيقيًا في استوديوهم في أراشيياما بكيوتو، مع صور تأخذها معك. لديهم أيضًا الكيمونو والنينجا.', ventaja: 'إن كانت جولتك معي في أراشيياما، أضعه في المسار وأحجزه لك معهم.' },
    },
  },
  {
    // Miyabi-yuki: hiyab bajo el junihitoe y solo personal femenino (correo 16-10-2026). Sin tarifa de guía.
    clave: 'miyabi', cat: 'experiencias', ciudad: 'kioto', musulman: true, nombre: 'Emondo Miyabi-yuki', enlace: 'https://www.miyabi-yuki.jp/',
    marca: { fondo: '#7a1f3d', tinta: '#f6e3b4', boton: '#f6e3b4', botonTinta: '#7a1f3d', palabra: '雅' },
    t: {
      es: { que: 'Vístete con el junihitoe, el kimono de doce capas de la corte imperial Heian, en el centro de Kioto. Algo que no verás en ningún otro sitio.', ventaja: 'Puedes llevar el hiyab debajo y todo el personal es femenino: ya han vestido a clientas con hiyab.' },
      en: { que: 'Dress in the junihitoe, the twelve-layer kimono of the Heian imperial court, in central Kyoto. Something you will not see anywhere else.', ventaja: 'You can keep your hijab on underneath and all the staff are women; they have dressed guests in hijab before.' },
      ar: { que: 'ارتدي الجونيهيتوي، كيمونو البلاط الإمبراطوري ذا الطبقات الاثنتي عشرة من عصر هييان، في وسط كيوتو. تجربة لن تجديها في أي مكان آخر.', ventaja: 'يمكنكِ إبقاء الحجاب تحته، وجميع العاملات نساء، وقد ألبسن ضيفات محجبات من قبل.' },
    },
  },
  {
    // Tower Knives: presentación de 15-20 min con cita previa si traigo clientes; sin comisión ni descuento (correo 16-10-2026).
    clave: 'towerknives', cat: 'experiencias', ciudad: 'osaka', conTony: true, nombre: 'Tower Knives Osaka', enlace: 'https://www.towerknives.com/',
    marca: { fondo: '#23282d', tinta: '#e9edf0', boton: '#e9edf0', botonTinta: '#23282d', palabra: '包丁' },
    t: {
      es: { que: 'Tienda de cuchillos japoneses junto a la torre Tsutenkaku (Shinsekai). El regalo que más se llevan mis viajeros de Osaka.', ventaja: 'Si vienes conmigo, pido cita y te hacen una presentación de 15-20 min: historia de los cuchillos de Sakai y demostración de corte.' },
      en: { que: 'Japanese knife shop by Tsutenkaku tower in Shinsekai. The gift my guests most often take home from Osaka.', ventaja: 'Come with me and I book a 15–20 min presentation: the history of Sakai knives and a cutting demonstration.' },
      ar: { que: 'متجر سكاكين يابانية بجانب برج تسوتينكاكو في شينسيكاي. الهدية التي يأخذها ضيوفي من أوساكا أكثر من غيرها.', ventaja: 'إن جئت معي أحجز موعدًا ويقدّمون لك عرضًا لمدة 15-20 دقيقة: تاريخ سكاكين ساكاي وعرض للتقطيع.' },
    },
  },
  {
    // Cooking Sun: menú vegetariano sin alcohol a petición, NO halal certificado; sin comisión (correo 16-10-2026).
    clave: 'cookingsun', cat: 'experiencias', ciudad: 'kioto', musulman: true, nombre: 'Cooking Sun', enlace: 'https://cookingsun.co.jp/',
    marca: { fondo: '#f2a516', tinta: '#2b1d05', boton: '#2b1d05', botonTinta: '#f2a516', palabra: '料理' },
    t: {
      es: { que: 'Clase de cocina casera japonesa en Kioto y en Osaka: cocinas tú y luego coméis juntos.', ventaja: 'Al reservar pide el menú vegetariano sin alcohol (sin sake ni mirin). No es halal certificado, pero no lleva carne ni alcohol.' },
      en: { que: 'Japanese home-cooking class in Kyoto and Osaka: you cook, then you eat together.', ventaja: 'When booking, ask for the vegetarian menu without alcohol (no sake or mirin). Not halal-certified, but no meat and no alcohol.' },
      ar: { que: 'درس طبخ ياباني منزلي في كيوتو وأوساكا: تطبخ بنفسك ثم تأكلون معًا.', ventaja: 'عند الحجز اطلب القائمة النباتية بلا كحول (بلا ساكي ولا ميرين). ليست حلالًا موثقة، لكنها بلا لحم ولا كحول.' },
    },
  },
  {
    // Hamanasu (Sugimoto): 4.000 ¥/persona en efectivo, guía gratis, +15 min de regalo si vienen por mí; reserva por mí ≥3 días antes (≥5 si son 6+). Correo 16-10-2026.
    clave: 'hamanasu', cat: 'experiencias', ciudad: 'kumano', conTony: true, nombre: 'Kibori Hamanasu', enlace: 'https://hamanasu-kibori.raku-uru.jp/',
    marca: { fondo: '#6b4a2b', tinta: '#f4e7d3', boton: '#f4e7d3', botonTinta: '#6b4a2b', palabra: '木彫' },
    t: {
      es: { que: 'Taller de talla en madera con una artesana de Kumano, en Kushimoto (Wakayama). Ideal si vas a hacer el Kumano Kodo. Nuevo: diseño asanoha (patrón geométrico japonés) y portaobjetos con tu nombre. 4.000 ¥ por persona, en efectivo.', ventaja: 'Si lo reservas a través de mí, te regalan 15 minutos más para hacer un diseño más elaborado. Avísame con 3 días de antelación.' },
      en: { que: 'Wood-carving workshop with a Kumano craftswoman in Kushimoto (Wakayama). Perfect if you are walking the Kumano Kodo. New: the asanoha design (a Japanese geometric pattern) and a small tray carved with your name. ¥4,000 per person, cash.', ventaja: 'Book it through me and you get 15 extra minutes free to carve a more detailed design. Tell me 3 days ahead.' },
      ar: { que: 'ورشة نحت على الخشب مع حِرفية من كومانو في كوشيموتو (واكاياما). مثالية إن كنت ستمشي طريق كومانو كودو. جديد: نقش أسانوها (زخرفة هندسية يابانية) وحامل صغير منقوش عليه اسمك. 4,000 ين للشخص نقدًا.', ventaja: 'إن حجزتها عن طريقي تحصل على 15 دقيقة إضافية مجانًا لتصميم أكثر تفصيلًا. أخبرني قبلها بثلاثة أيام.' },
    },
  },
  {
    // Yokoyama Chikuzaiten (TAKENOKO): sin descuento, completo por reserva, 1 grupo cada vez, máx. 15 con guía; cestas desde 8 años; cerrado domingos y festivos (correo 16-10-2026).
    clave: 'yokotake', cat: 'experiencias', ciudad: 'kioto', nombre: 'Yokoyama Bamboo (TAKENOKO)', enlace: 'https://takenoko.co/pages/kyoushitsu240308-03.htm',
    marca: { fondo: '#5d7a2e', tinta: '#f3f0dc', boton: '#f3f0dc', botonTinta: '#5d7a2e', palabra: '竹' },
    t: {
      es: { que: 'Taller de bambú en una tienda de artesanos de Kioto: haces tu propia cesta, tus palillos o una cucharilla de té. De 1,5 a 2 horas.', ventaja: 'Solo un grupo cada vez (hasta 15 personas): perfecto para familias grandes. La cesta, a partir de 8 años. Yo te hago la reserva en japonés.' },
      en: { que: 'Bamboo workshop at a Kyoto craftsmen’s shop: make your own basket, chopsticks or tea scoop. 1.5 to 2 hours.', ventaja: 'Only one group at a time (up to 15 people): perfect for big families. Baskets from age 8. I make the booking for you in Japanese.' },
      ar: { que: 'ورشة خيزران في متجر حِرفيين في كيوتو: تصنع سلتك أو عيدانك أو ملعقة الشاي بنفسك. من ساعة ونصف إلى ساعتين.', ventaja: 'مجموعة واحدة فقط في كل مرة (حتى 15 شخصًا): مثالية للعائلات الكبيرة. السلة من عمر 8 سنوات. أحجز لك باليابانية.' },
    },
  },
  {
    // DOMYO: sin tarifa de guía ni descuento, precios normales de su web (correo 16-10-2026).
    clave: 'domyo', cat: 'experiencias', ciudad: 'kioto', nombre: 'DOMYO Kumihimo', enlace: 'https://kdomyo.com/en',
    marca: { fondo: '#a3324a', tinta: '#fbeef0', boton: '#fbeef0', botonTinta: '#a3324a', palabra: '組紐' },
    t: {
      es: { que: 'Trenza tu propio kumihimo, el cordón de seda tradicional, con la casa DOMYO, que lo hace desde 1652. Taller en inglés.', ventaja: 'Te llevas una pulsera hecha por ti. Va muy bien con niños y no necesita experiencia.' },
      en: { que: 'Braid your own kumihimo, the traditional silk cord, with DOMYO, makers since 1652. Workshop in English.', ventaja: 'You take home a bracelet you made yourself. Great with children, no experience needed.' },
      ar: { que: 'اضفر حبل الكوميهيمو الحريري التقليدي بنفسك مع دار DOMYO التي تصنعه منذ عام 1652. الورشة بالإنجليزية.', ventaja: 'تعود بسوار صنعته بيدك. مناسبة جدًا للأطفال ولا تحتاج إلى خبرة.' },
    },
  },
  {
    // Japan Wireless: cupón TONYKANSAI (10 % en pocket wifi y eSIM) y enlace de afiliado de Rewardful (?via=tony-hanma, 10 % de comisión), ambos del 19-10-2026.
    clave: 'japanwireless', cat: 'internet', conTony: true, nombre: 'Japan Wireless', enlace: 'https://www.japan-wireless.com/?via=tony-hanma', codigo: 'TONYKANSAI', descuento: '10 %',
    marca: { fondo: '#0a4ea2', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#0a4ea2', palabra: 'Wi-Fi' },
    t: {
      es: { que: 'Wifi de bolsillo para Japón: un aparatito da internet a varios móviles a la vez. Te lo mandan al hotel o lo recoges en el aeropuerto.', ventaja: 'Con el código TONYKANSAI, 10 % de descuento en el wifi de bolsillo y en la eSIM. Lo mejor para familias grandes: un solo aparato para todos.' },
      en: { que: 'Pocket wifi for Japan: one small device gives data to several phones at once. Delivered to your hotel or picked up at the airport.', ventaja: 'Code TONYKANSAI gives 10% off pocket wifi and eSIM. Best for big families: one device for everyone.' },
      ar: { que: 'واي فاي متنقل لليابان: جهاز صغير يعطي الإنترنت لعدة هواتف في الوقت نفسه. يصلك إلى الفندق أو تستلمه في المطار.', ventaja: 'بالرمز TONYKANSAI خصم 10% على الواي فاي المتنقل وشريحة eSIM. الأفضل للعائلات الكبيرة: جهاز واحد للجميع.' },
    },
  },
  {
    // Rental Kimono Okamoto (Hiro Hayashi): tarifa de agencia por escrito el 19-10-2026; comisión solo en los planes, no en los extras. 7 tiendas.
    clave: 'okamoto', cat: 'experiencias', ciudad: 'kioto', conTony: true, nombre: 'Kimono Okamoto', enlace: 'https://www.okamoto-kimono.com/',
    marca: { fondo: '#7a1f2b', tinta: '#fbeee6', boton: '#fbeee6', botonTinta: '#7a1f2b', palabra: '岡本' },
    t: {
      es: { que: 'Alquiler de kimono con 7 tiendas en Kioto (Kiyomizu, Gion, Fushimi Inari, Arashiyama…): te vistes junto al templo que vas a visitar.', ventaja: 'Si vienes de tour conmigo, te lo reservo yo. Puedes devolver el kimono en otra de sus tiendas, al día siguiente o en el hotel.' },
      en: { que: 'Kimono rental with 7 shops in Kyoto (Kiyomizu, Gion, Fushimi Inari, Arashiyama…): you get dressed right next to the temple you are visiting.', ventaja: 'Touring with me? I book it for you. You can return the kimono at another of their shops, the next day or at your hotel.' },
      ar: { que: 'استئجار الكيمونو في 7 متاجر في كيوتو (كيوميزو، غيون، فوشيمي إيناري، أراشيياما…): تلبسه بجوار المعبد الذي ستزوره.', ventaja: 'إن كنت في جولة معي، أحجزه لك بنفسي. يمكنك إعادة الكيمونو في متجر آخر من متاجرهم، أو في اليوم التالي، أو في الفندق.' },
    },
  },
  {
    // Nakamura Rosoku (Fushimi, desde la era Meiji): sin descuento ni tarifa de guía; muchos extranjeros, lo explican con Pocketalk; reserva directa por correo (17-10-2026).
    clave: 'nakamura', cat: 'experiencias', ciudad: 'kioto', nombre: 'Nakamura Rosoku', enlace: 'https://www.kyorousoku.jp/',
    marca: { fondo: '#b8452f', tinta: '#fdf1e4', boton: '#fdf1e4', botonTinta: '#b8452f', palabra: '蝋燭' },
    t: {
      es: { que: 'Taller de velas japonesas (warousoku) en un taller de Fushimi que las hace desde la era Meiji: fabricas tu vela, la pintas o las dos cosas.', ventaja: 'Está a pocos minutos de Fushimi Inari: encaja justo después de los torii. Muy bueno con niños. Yo hago la reserva en japonés.' },
      en: { que: 'Japanese candle (warousoku) workshop at a Fushimi maker working since the Meiji era: make your candle, paint it, or both.', ventaja: 'A few minutes from Fushimi Inari, so it fits right after the torii gates. Great with kids. I make the booking in Japanese.' },
      ar: { que: 'ورشة الشموع اليابانية (واروسوكو) لدى صانع في فوشيمي يعمل منذ عصر ميجي: تصنع شمعتك أو ترسم عليها أو الاثنين معًا.', ventaja: 'على بُعد دقائق من فوشيمي إيناري، فتأتي مباشرة بعد بوابات توري. ممتازة مع الأطفال. أحجز لك باليابانية.' },
    },
  },
  {
    // JAPANeid (J-LINE, Minamihorie): aceptan salir en la web y mandaron fotos el 19-10-2026; sin acuerdo para guías individuales todavía. Corrección suya del 21-10: venden productos con certificado halal Y dulces muslim-friendly sin certificado, en estantes rotulados.
    clave: 'japaneid', cat: 'experiencias', ciudad: 'osaka', musulman: true, nombre: 'JAPANeid', enlace: 'https://www.japaneid.com/',
    marca: { fondo: '#1f5a4c', tinta: '#f2ead3', boton: '#f2ead3', botonTinta: '#1f5a4c', palabra: 'Eid' },
    t: {
      es: { que: 'Tienda en Minamihorie (Osaka) pensada para musulmanes: dulces japoneses sin ingredientes animales ni alcohol, hiyab de estilo kimono y alfombras de oración.', ventaja: 'Tienen productos con certificado halal y dulces muslim-friendly, cada uno en su estante rotulado. Si no te da tiempo de ir, piden por su web y te lo pueden mandar al hotel.' },
      en: { que: 'A shop in Minamihorie (Osaka) made for Muslims: Japanese treats with no animal ingredients or alcohol, kimono-style hijabs and prayer mats.', ventaja: 'Halal-certified products and Muslim-friendly sweets, each on its own labelled shelf. No time to visit? Order on their website and they can send it to your hotel.' },
      ar: { que: 'متجر في مينامي هوريه (أوساكا) مخصص للمسلمين: حلويات يابانية بلا مكونات حيوانية ولا كحول، وحجاب بطراز الكيمونو وسجادات صلاة.', ventaja: 'منتجات حاصلة على شهادة حلال وحلويات مناسبة للمسلمين، كلٌّ على رف خاص بلافتة واضحة. ليس لديك وقت للزيارة؟ اطلب من موقعهم ويمكنهم إرساله إلى فندقك.' },
    },
  },
  {
    // Japan Wireless eSIM: alta propia en Rewardful (19-10-2026), 10 % de comisión; el cupón TONYKANSAI también vale para la eSIM.
    clave: 'japanwirelessesim', cat: 'internet', conTony: true, nombre: 'Japan Wireless eSIM', enlace: 'https://www.japan-wireless.com/esim?via=tony', codigo: 'TONYKANSAI', descuento: '10 %',
    marca: { fondo: '#0a4ea2', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#0a4ea2', palabra: 'eSIM' },
    t: {
      es: { que: 'eSIM con datos para Japón: la instalas en el móvil antes de salir y tienes internet nada más aterrizar, sin aparato que cargar.', ventaja: 'Con el código TONYKANSAI, 10 % de descuento. Si viajáis varios con móviles compatibles, cada uno con la suya.' },
      en: { que: 'Data eSIM for Japan: install it on your phone before you leave and you are online the moment you land, with no device to charge.', ventaja: 'Code TONYKANSAI gives 10% off. If several of you have compatible phones, one each.' },
      ar: { que: 'شريحة eSIM للإنترنت في اليابان: تثبّتها على هاتفك قبل السفر فيكون لديك إنترنت فور الوصول، دون جهاز تشحنه.', ventaja: 'بالرمز TONYKANSAI خصم 10%. إن كنتم عدة أشخاص بهواتف متوافقة، لكل واحد شريحته.' },
    },
  },
  {
    // Kobaien (Fukuro-san): taller de nigiri-zumi de octubre a mediados de abril; 1 guía/intérprete gratis; folleto en inglés (correo 21-10-2026). Sin comisión.
    clave: 'kobaien', cat: 'experiencias', ciudad: 'nara', conTony: true, nombre: 'Kobaien (tinta sumi)', enlace: 'https://www.kobaien.jp/',
    marca: { fondo: '#1c1c1c', tinta: '#efe6d2', boton: '#efe6d2', botonTinta: '#1c1c1c', palabra: '墨' },
    t: {
      es: { que: 'La casa de tinta sumi más antigua de Nara (desde 1577): moldeas con tus manos tu propia barra de tinta. Solo de octubre a mediados de abril, que es cuando se fabrica.', ventaja: 'Te lo reservo yo en japonés y entro contigo a traducirte el taller sin coste extra.' },
      en: { que: 'Nara’s oldest sumi ink maker (since 1577): you shape your own ink stick by hand. Only from October to mid-April, the ink-making season.', ventaja: 'I book it for you in Japanese and come in to translate the workshop at no extra cost.' },
      ar: { que: 'أقدم صانع لحبر السومي في نارا (منذ 1577): تشكّل بيديك قطعة الحبر الخاصة بك. فقط من أكتوبر إلى منتصف أبريل، موسم صناعة الحبر.', ventaja: 'أحجزه لك باليابانية وأدخل معك لأترجم الورشة دون تكلفة إضافية.' },
    },
  },
  {
    // MAIKOYA (Keigo/Shoko): 10 % de agencia con código que NO se publica; en plan privado el guía entra gratis, sin té (correo 28-10-2026).
    clave: 'maikoyate', cat: 'experiencias', ciudad: 'kioto', conTony: true, nombre: 'MAIKOYA (ceremonia del té)', enlace: 'https://mai-ko.com/', descuento: '10 %',
    marca: { fondo: '#7a1f2b', tinta: '#f6e9dc', boton: '#f6e9dc', botonTinta: '#7a1f2b', palabra: '舞' },
    t: {
      es: { que: 'Ceremonia del té en Kioto, en grupo o privada, con explicación en inglés.', ventaja: 'Escríbeme por WhatsApp con la fecha y cuántos sois: te la reservo yo con un 10 % menos. En la privada entro contigo a traducir.' },
      en: { que: 'Tea ceremony in Kyoto, shared or private, explained in English.', ventaja: 'Send me the date and group size on WhatsApp: I book it for you with 10% off. For a private one I come in to translate.' },
      ar: { que: 'حفل الشاي في كيوتو، جماعي أو خاص، مع شرح بالإنجليزية.', ventaja: 'أرسل لي التاريخ وعددكم عبر واتساب: أحجزه لك بخصم 10%. في الحفل الخاص أدخل معك لأترجم.' },
    },
  },
  {
    // Osaka Cooking Base (Yuka, junto a Tenmangu): mismo precio para todos, sin código; máx. 8, de 5 a 8 privada sin extra; guía gratis si no cocina; sin cerdo ni alcohol bajo petición, usa dashi (correo 11-11-2026, acepta salir en ventajas).
    clave: 'osakacookingbase', cat: 'experiencias', ciudad: 'osaka', musulman: true, nombre: 'Osaka Cooking Base', enlace: 'https://osakacookingbase.com/',
    marca: { fondo: '#c8442e', tinta: '#fff4e6', boton: '#fff4e6', botonTinta: '#c8442e', palabra: '台所' },
    t: {
      es: { que: 'Clase de cocina casera en Osaka, junto a Tenmangu: okonomiyaki, ramen o gyoza con Yuka, en grupos de hasta 8.', ventaja: 'De 5 a 8 personas la clase es privada sin coste extra. Para familias musulmanas prepara okonomiyaki o ramen sin cerdo ni alcohol (sin mirin ni sake); pregunta antes por el caldo dashi. Yo entro gratis a traducir.' },
      en: { que: 'Home-style cooking class in Osaka, next to Tenmangu: okonomiyaki, ramen or gyoza with Yuka, up to 8 guests.', ventaja: 'For 5 to 8 people the class is private at no extra charge. For Muslim families she makes okonomiyaki or ramen with no pork and no alcohol (no mirin or sake); ask first about the dashi stock. I join free to translate.' },
      ar: { que: 'درس طبخ منزلي في أوساكا قرب تينمانغو: أوكونومياكي أو رامن أو غيوزا مع يوكا، حتى 8 أشخاص.', ventaja: 'من 5 إلى 8 أشخاص يكون الدرس خاصًا دون تكلفة إضافية. للعائلات المسلمة تحضّر أوكونومياكي أو رامن بلا خنزير ولا كحول (بلا ميرين ولا ساكي)؛ اسأل أولًا عن مرق الداشي. أدخل مجانًا لأترجم.' },
      ru: { que: 'Домашний кулинарный класс в Осаке у Тэммангу: окономияки, рамен или гёдза с Юкой, до 8 человек.', ventaja: 'Для 5–8 человек класс частный без доплаты. Без свинины и алкоголя по запросу; про бульон даси уточните заранее.' },
    },
  },
  {
    clave: 'unplugged', cat: 'experiencias', ciudad: 'amakusa', nombre: 'Unplugged (kayak en Amakusa)', enlace: 'https://e-unplugged.jp/',
    marca: { fondo: '#0f6b78', tinta: '#eafcff', boton: '#eafcff', botonTinta: '#0f6b78', palabra: 'SEA' },
    t: {
      es: { que: 'Kayak de mar entre las islas deshabitadas de Amakusa, en el Parque Nacional Unzen-Amakusa, con un guía local. Se acaba en una isla de arena blanca de conchas donde puedes bañarte. Tarde Premium (13:00): 10.000 ¥ por persona entre semana y 11.000 ¥ en fin de semana, con fotos y vídeo del día. Mañana Simple (9:00, desde marzo): 8.000 / 9.000 ¥.', ventaja: '500 ¥ menos por persona: reserva en su formulario al menos 3 días antes y escribe «Tony Kansai Guide\u3000Tony Hanma» en observaciones. A 1 h 30 en coche de Kumamoto; se paga el día (efectivo, PayPay o tarjeta).' },
      en: { que: 'Paddle a sea kayak through the island-dotted waters of Amakusa, weaving between uninhabited islands in Unzen-Amakusa National Park with a local guide, and land on a white shell-sand island to swim and relax. Afternoon Premium (13:00): ¥10,000 per person on weekdays, ¥11,000 at weekends, with same-day photos and video. Morning Simple (9:00, from March): ¥8,000 / ¥9,000.', ventaja: '¥500 off per person: book on their form at least 3 days ahead and write “Tony Kansai Guide\u3000Tony Hanma” in the remarks. About 1.5 h by car from Kumamoto; pay on the day (cash, PayPay or card).' },
      ar: { que: 'تجديف بقوارب الكاياك البحرية بين الجزر غير المأهولة في أماكوسا، داخل منتزه أونزن-أماكوسا الوطني مع مرشد محلي، والنزول على جزيرة رملها من الأصداف البيضاء للسباحة والاسترخاء. برنامج الظهيرة (13:00): 10,000 ين للشخص في أيام الأسبوع و11,000 ين في العطلات، مع صور وفيديو في اليوم نفسه. برنامج الصباح (9:00، من مارس): 8,000 / 9,000 ين.', ventaja: 'خصم 500 ين للشخص: احجز في نموذجهم قبل 3 أيام على الأقل واكتب «Tony Kansai Guide\u3000Tony Hanma» في الملاحظات. على بعد ساعة ونصف بالسيارة من كوماموتو؛ الدفع في اليوم نفسه.' },
      ru: { que: 'Морской каяк между необитаемыми островами Амакусы (нацпарк Унзэн-Амакуса) с местным гидом и высадка на остров с белым ракушечным песком. После обеда: 10 000 ¥ в будни, 11 000 ¥ в выходные, с фото и видео. Утро (с марта): 8000 / 9000 ¥.', ventaja: '−500 ¥ с человека: бронь на их сайте минимум за 3 дня, в примечаниях «Tony Kansai Guide Tony Hanma».' },
    },
  },
  {
    clave: 'hakusan', cat: 'experiencias', ciudad: 'ishikawa', nombre: 'Máscara de león de Kaga (Hakusan)', enlace: 'https://www.urara-hakusanbito.com/',
    marca: { fondo: '#9b1c1c', tinta: '#fff1e0', boton: '#fff1e0', botonTinta: '#9b1c1c', palabra: '獅子' },
    t: {
      es: { que: 'Pinta tu propia cabeza de león de Kaga (shishi-gashira), la artesanía de madera de Hakusan, cerca de Kanazawa. 6.600 ¥ por persona, hasta 20 personas.', ventaja: 'Se reserva con al menos un mes de antelación por correo (hakusan@urara-hakusanbito.com). Si vienes conmigo, traduzco al español o al árabe sin coste.' },
      en: { que: 'Paint your own Kaga lion head (shishi-gashira), the wooden craft of Hakusan near Kanazawa. ¥6,600 per person, up to 20 people.', ventaja: 'Book at least one month ahead by email (hakusan@urara-hakusanbito.com). Coming with me? I translate into Spanish or Arabic at no extra cost.' },
      ar: { que: 'لوّن بنفسك رأس أسد كاغا الخشبي (شيشي-غاشيرا)، حرفة مدينة هاكوسان قرب كانازاوا. 6,600 ين للشخص، حتى 20 شخصًا.', ventaja: 'الحجز قبل شهر على الأقل عبر البريد (hakusan@urara-hakusanbito.com). إن جئت معي أترجم إلى العربية أو الإسبانية دون تكلفة.' },
      ru: { que: 'Роспись деревянной головы льва Кага (сиси-гасира) в Хакусане у Канадзавы. 6600 ¥ с человека, до 20 человек.', ventaja: 'Бронь минимум за месяц по почте hakusan@urara-hakusanbito.com.' },
    },
  },
  {
    clave: 'foodsample', cat: 'experiencias', ciudad: 'tokio', nombre: 'Food Sample Making Cafe (Asakusa)', enlace: 'https://foodsamplecafe.com/',
    marca: { fondo: '#ffd23f', tinta: '#2a2100', boton: '#2a2100', botonTinta: '#ffd23f', palabra: 'FOOD' },
    t: {
      es: { que: 'Haz tus propias réplicas de comida japonesa de plástico (como las de los escaparates) en Asakusa, Tokio. Un recuerdo que te llevas a casa.', ventaja: 'Código TONY10: 10 % menos al reservar en TableCheck (campo «PROMO CODE»). La comida que sirven no es halal: las familias musulmanas eligen el plan sin comida.' },
      en: { que: 'Make your own Japanese plastic food replicas, like the ones in restaurant windows, in Asakusa, Tokyo. A souvenir you take home.', ventaja: 'Code TONY10: 10% off when booking on TableCheck (“PROMO CODE” field). Their meals are not halal: Muslim families choose the plan without a meal.' },
      ar: { que: 'اصنع بنفسك نماذج الطعام الياباني البلاستيكية، مثل التي في واجهات المطاعم، في أساكوسا بطوكيو. تذكار تأخذه معك.', ventaja: 'الرمز TONY10: خصم 10% عند الحجز في TableCheck (خانة «PROMO CODE»). وجباتهم ليست حلالًا: العائلات المسلمة تختار البرنامج بلا وجبة.' },
      ru: { que: 'Сделайте свои муляжи японской еды, как в витринах ресторанов, в Асакусе (Токио).', ventaja: 'Код TONY10: −10 % при брони в TableCheck.' },
    },
  },
  {
    clave: 'koto', cat: 'experiencias', ciudad: 'hiroshima', codigo: 'kotodaisuki', descuento: '15 %', nombre: 'Koto Workshop Hiroshima', enlace: 'https://kotoworkshop.com/',
    marca: { fondo: '#3b2a5a', tinta: '#f5eefc', boton: '#f5eefc', botonTinta: '#3b2a5a', palabra: '琴' },
    t: {
      es: { que: 'Descubre el alma de Japón con el sonido del koto, el arpa tradicional, a un minuto de la Cúpula de la Bomba Atómica de Hiroshima. Hasta 10 personas.', ventaja: 'Código kotodaisuki: 15 % menos al reservar en su web. Si vienes conmigo, entro gratis a traducir.' },
      en: { que: 'Discover the soul of Japan through the timeless sound of the koto, just one minute from Hiroshima’s Atomic Bomb Dome. Up to 10 people.', ventaja: 'Code kotodaisuki: 15% off when you book on their website. Coming with me? I join free to translate.' },
      ar: { que: 'اكتشف روح اليابان عبر صوت آلة الكوتو التقليدية، على بعد دقيقة من قبة القنبلة الذرية في هيروشيما. حتى 10 أشخاص.', ventaja: 'الرمز kotodaisuki: خصم 15% عند الحجز في موقعهم. إن جئت معي أدخل مجانًا لأترجم.' },
      ru: { que: 'Звук японского кото в минуте от Купола атомной бомбы в Хиросиме. До 10 человек.', ventaja: 'Код kotodaisuki: −15 % на их сайте.' },
    },
  },
  {
    clave: 'teaosaka', cat: 'experiencias', ciudad: 'osaka', musulman: true, conTony: true, nombre: 'Tea Ceremony Osaka (Dotonbori)', enlace: 'https://teaceremonyosaka.com/',
    marca: { fondo: '#4d6b3c', tinta: '#f1f5e8', boton: '#f1f5e8', botonTinta: '#4d6b3c', palabra: '茶道' },
    t: {
      es: { que: 'Ceremonia del té de 45 minutos en Dotonbori, en el centro de Osaka. 7.480 ¥ por adulto y 4.980 ¥ de 8 a 11 años; sesiones a las 10, 11, 12, 14, 15 y 16 h, hasta 10 personas.', ventaja: 'Los dulces son halal y nada lleva alcohol. Si vienes conmigo, entro a traducir.' },
      en: { que: '45-minute tea ceremony in Dotonbori, central Osaka. ¥7,480 per adult and ¥4,980 for ages 8 to 11; sessions at 10, 11, 12, 14, 15 and 16 h, up to 10 people.', ventaja: 'The sweets are halal and nothing contains alcohol. Coming with me? I come in to translate.' },
      ar: { que: 'حفل شاي مدته 45 دقيقة في دوتونبوري وسط أوساكا. 7,480 ين للبالغ و4,980 ين من 8 إلى 11 سنة؛ جلسات في 10 و11 و12 و14 و15 و16، حتى 10 أشخاص.', ventaja: 'الحلويات حلال ولا شيء فيها كحول. إن جئت معي أدخل لأترجم.' },
      ru: { que: 'Чайная церемония 45 минут в Дотонбори (Осака). 7480 ¥ взрослый, 4980 ¥ дети 8–11 лет.', ventaja: 'Сладости халяльные, без алкоголя.' },
    },
  },
  {
    clave: 'shaquda', cat: 'experiencias', ciudad: 'hiroshima', conTony: true, descuento: '10 %', nombre: 'SHAQUDA (pinceles de Kumano)', enlace: 'https://shaquda.jp/en/pages/workshop',
    marca: { fondo: '#1d1d1f', tinta: '#f4e4c1', boton: '#f4e4c1', botonTinta: '#1d1d1f', palabra: '筆' },
    t: {
      es: { que: 'Taller de pinceles de maquillaje en Kumano (Hiroshima), el pueblo de los pinceles: montas el tuyo y te lo envían terminado en unas dos semanas (envío aparte).', ventaja: 'Reservando conmigo, 10 % menos y sin los 10.000 ¥ de intérprete, porque traduzco yo. Grupos de 6 se parten en dos de 3.' },
      en: { que: 'Make-up brush workshop in Kumano (Hiroshima), Japan’s brush town: you assemble your own and they ship it finished in about two weeks (shipping extra).', ventaja: 'Booked through me: 10% off and no ¥10,000 interpreter fee, because I translate. Groups of 6 are split into two groups of 3.' },
      ar: { que: 'ورشة فرش المكياج في كومانو (هيروشيما)، بلدة الفرش في اليابان: تركّب فرشاتك ويرسلونها إليك جاهزة خلال أسبوعين تقريبًا (الشحن منفصل).', ventaja: 'بالحجز عن طريقي: خصم 10% وبلا رسوم المترجم (10,000 ين) لأنني أترجم. مجموعات الـ6 تُقسم إلى مجموعتين من 3.' },
      ru: { que: 'Мастер-класс кистей для макияжа в Кумано (Хиросима): собираете свою, её присылают готовой примерно через две недели.', ventaja: 'Через меня: −10 % и без платы за переводчика 10 000 ¥.' },
    },
  },
  {
    clave: 'kuchinotsu', cat: 'experiencias', ciudad: 'nagasaki', nombre: 'Delfines de Kuchinotsu', enlace: 'https://dolwatch.jp/',
    marca: { fondo: '#1565c0', tinta: '#e8f4ff', boton: '#e8f4ff', botonTinta: '#1565c0', palabra: 'IRUKA' },
    t: {
      es: { que: 'Salida en barco para ver delfines salvajes en Kuchinotsu (península de Shimabara, Nagasaki). Adultos 4.000 ¥, de 7 a 12 años 2.000 ¥, de 4 a 6 años 1.000 ¥, menores de 3 gratis.', ventaja: 'Grupos de 10 o más adultos: 10 % menos; de 30 o más: 20 % menos. Se sale de su oficina, a 700 m del puerto, frente al 7-Eleven.' },
      en: { que: 'Boat trip to see wild dolphins at Kuchinotsu (Shimabara Peninsula, Nagasaki). Adults ¥4,000, ages 7–12 ¥2,000, ages 4–6 ¥1,000, 3 and under free.', ventaja: 'Groups of 10+ adults: 10% off; 30+: 20% off. Boarding at their office, 700 m from the port, opposite the 7-Eleven.' },
      ar: { que: 'رحلة بالقارب لمشاهدة الدلافين البرية في كوتشينوتسو (شبه جزيرة شيمابارا، ناغازاكي). البالغون 4,000 ين، من 7 إلى 12 سنة 2,000 ين، من 4 إلى 6 سنوات 1,000 ين، وما دون 3 مجانًا.', ventaja: 'مجموعات من 10 بالغين فأكثر: خصم 10%؛ من 30 فأكثر: خصم 20%. الانطلاق من مكتبهم على بعد 700 م من الميناء، مقابل 7-Eleven.' },
      ru: { que: 'Морская прогулка к диким дельфинам в Кутиноцу (Нагасаки). Взрослые 4000 ¥, 7–12 лет 2000 ¥, 4–6 лет 1000 ¥.', ventaja: 'Группы от 10 взрослых −10 %, от 30 — −20 %.' },
    },
  },
  {
    clave: 'shiretoko', cat: 'experiencias', ciudad: 'hokkaido', nombre: 'Shiretoko: hielo y cruceros (Gojiraiwa)', enlace: 'https://kamuiwakka.jp/utoro/',
    marca: { fondo: '#dfeefa', tinta: '#123247', boton: '#123247', botonTinta: '#dfeefa', palabra: '流氷' },
    t: {
      es: { que: 'Caminata sobre el hielo marino (drift ice) de Shiretoko, del 1 de febrero a mediados de marzo, y cruceros por la costa del Patrimonio Mundial desde Utoro y Rausu.', ventaja: 'Grupos privados de hasta unas 42 personas en el hielo; en los cruceros, 10 % menos desde 15 personas. Hielo: desde primaria hasta 74 años, mínimo 130 cm. Las reservas de hielo abren hacia noviembre.' },
      en: { que: 'Drift ice walk in Shiretoko, 1 February to mid-March, and cruises along the World Heritage coast from Utoro and Rausu.', ventaja: 'Private groups of up to about 42 on the ice; cruises 10% off from 15 people. Ice walk: primary-school age to 74, at least 130 cm. Ice bookings open around November.' },
      ar: { que: 'المشي على الجليد البحري العائم في شيريتوكو من 1 فبراير حتى منتصف مارس، ورحلات بحرية على ساحل التراث العالمي من أوتورو وراوسو.', ventaja: 'مجموعات خاصة حتى نحو 42 شخصًا على الجليد؛ وفي الرحلات البحرية خصم 10% من 15 شخصًا. المشي على الجليد: من سن المرحلة الابتدائية حتى 74 سنة، وطول 130 سم على الأقل.' },
      ru: { que: 'Прогулка по дрейфующему льду в Сиретоко (1 февраля — середина марта) и круизы вдоль побережья всемирного наследия.', ventaja: 'Круизы −10 % от 15 человек.' },
    },
  },
  {
    clave: 'kanemasa', cat: 'experiencias', ciudad: 'gifu', conTony: true, nombre: 'Kanemasa, forjador de katanas (Seki)', enlace: 'https://thekatana.jp/',
    marca: { fondo: '#2b2b2b', tinta: '#e9e4d8', boton: '#b8932e', botonTinta: '#141414', palabra: '刀' },
    t: {
      es: { que: 'Forja tu propio cuchillo con el maestro Kanemasa en Seki (Gifu), la ciudad de las espadas. De 4 a 10 horas, desde 60.000 ¥ por persona.', ventaja: 'Se reserva con 1 o 2 semanas de antelación. Si vienes conmigo, traduzco al español o al árabe y no pago entrada.' },
      en: { que: 'Forge your own knife with Master Kanemasa in Seki (Gifu), Japan’s sword town. 4 to 10 hours, from ¥60,000 per person.', ventaja: 'Book 1 to 2 weeks ahead. Coming with me? I translate into Spanish or Arabic at no extra cost.' },
      ar: { que: 'اصنع سكينك بنفسك مع المعلّم كانيماسا في سيكي (غيفو)، مدينة السيوف في اليابان. من 4 إلى 10 ساعات، ابتداءً من 60,000 ين للشخص.', ventaja: 'الحجز قبل أسبوع أو أسبوعين. إن جئت معي أترجم إلى العربية أو الإسبانية دون تكلفة إضافية.' },
      ru: { que: 'Выкуйте свой нож с мастером Канэмасой в Сэки (Гифу). 4–10 часов, от 60 000 ¥ с человека.', ventaja: 'Бронь за 1–2 недели.' },
    },
  },
  {
    // InKansai (Sam): HANMA = 15 % de agente en cycleosaka/cyclekyoto/cyclehiroshima y eatosaka/eatkyoto; el cliente paga precio web (correo 24-10-2026). NO publicar el código.
    clave: 'inkansai', cat: 'experiencias', ciudad: 'osaka', conTony: true, nombre: 'Cycle & Eat Osaka / Kyoto', enlace: 'https://www.cycleosaka.com/', codigo: 'HANMA', descuento: '15 %',
    marca: { fondo: '#e85d1a', tinta: '#ffffff', boton: '#ffffff', botonTinta: '#e85d1a', palabra: '輪' },
    t: {
      es: { que: 'Tours en bici y tours de comida por Osaka, Kioto e Hiroshima, en grupos pequeños y en inglés.', ventaja: 'Reserva en su web con el código HANMA: 15 % menos. Si quieres, te lo reservo yo y pregunto antes por opciones sin cerdo ni alcohol.' },
      en: { que: 'Bike tours and food tours in Osaka, Kyoto and Hiroshima, in small groups and in English.', ventaja: 'Book on their website with code HANMA: 15% off. Or I book it for you and check no-pork, no-alcohol options first.' },
      ar: { que: 'جولات بالدراجة وجولات طعام في أوساكا وكيوتو وهيروشيما، بمجموعات صغيرة وبالإنجليزية.', ventaja: 'احجز في موقعهم بالرمز HANMA: خصم 15%. أو أحجزها لك وأسأل أولًا عن خيارات بلا لحم خنزير ولا كحول.' },
    },
  },
]

/** El código que se copia (no los enlaces https://), mientras no haya caducado. */
export function cuponDe(a: App): string | undefined {
  if (!a.codigo || a.codigo.startsWith('http')) return undefined
  if (a.caduca && new Date().toISOString().slice(0, 10) > a.caduca) return undefined
  return a.codigo
}

/** Enlace por el que me pagan comisión (Travelpayouts, Mobal, Radical) o código de invitación con premio. */
export function esAfiliado(a: App): boolean {
  return a.clave === 'airalo' || /tpk\.ro|a_aid=|[?&]acc=|[?&]via=|pxf\.io|iatiseguros\.com\?r=/.test(a.codigo?.startsWith('http') ? a.codigo : a.enlace)
}

/** Adónde lleva el botón: el enlace de afiliado si lo hay. */
export const enlaceDe = (a: App) => (a.codigo?.startsWith('http') ? a.codigo : a.enlace)

// Agrupadas por categoría (en el orden de CATEGORIAS) aunque se añadan al final de LISTA.
const ORDEN = Object.keys(CATEGORIAS) as Categoria[]
export const APPS: App[] = [...LISTA].sort((a, b) => ORDEN.indexOf(a.cat) - ORDEN.indexOf(b.cat))
