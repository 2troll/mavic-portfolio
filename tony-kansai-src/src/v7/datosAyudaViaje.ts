// «Lo que siempre me preguntan»: las dudas prácticas que los clientes le hacen a
// Tony por WhatsApp (aeropuerto, taxi, maletas, dinero, emergencias), resueltas
// en la página de ventajas con enlaces a las fichas de apps y a las guías.
// Y el bloque para empresas de servicios al viajero que quieran colaborar.
// Solo datos estables: nada de precios exactos, que cambian y no los controlamos.

import type { Lang } from './datosVentajas'

/** `app`: clave de una ficha de ventajas; `guia`: ruta interna; `href`: web externa. */
export type Enlace = { texto: string; app?: string; guia?: string; href?: string }
export type Pregunta = { icono: string; q: string; a: string; enlaces: Enlace[] }

type Bloque = {
  titulo: string; sub: string; preguntas: Pregunta[]
  socios: { titulo: string; texto: string; tipos: string[]; correo: string; wa: string; saludo: string }
}

const YAMATO = 'https://www.kuronekoyamato.co.jp/ytc/en/'
const JNTO = 'https://www.japan.travel/en/plan/hotline/'

export const AYUDA: Record<Lang, Bloque> = {
  es: {
    titulo: 'Lo que siempre me preguntan',
    sub: 'Las dudas que me llegan cada semana por WhatsApp, resueltas aquí para que tu viaje sea más fácil.',
    preguntas: [
      { icono: 'plane-arrival', q: '¿Cómo voy del aeropuerto de Kansai al hotel?',
        a: 'Tienes tres opciones. Tren: el Nankai Rapi:t te deja en Namba (Osaka) en unos 40 minutos y el JR Haruka va directo a Kioto en algo más de una hora. Autobús limusina: para en los hoteles y estaciones grandes, cómodo con maletas. Traslado privado: un conductor te espera con tu nombre y te lleva puerta a puerta, lo mejor si llegáis de noche, con niños o con mucho equipaje.',
        enlaces: [{ texto: 'Guía completa del aeropuerto', guia: '/es/aeropuerto-kansai/' }, { texto: 'Traslado privado', app: 'welcome' }] },
      { icono: 'car', q: '¿Cómo pido un taxi?',
        a: 'Con la app GO o con Uber, que funcionan en Osaka y Kioto: pones el destino y no hace falta hablar japonés. En la calle también puedes pararlos con la mano. La puerta trasera se abre y se cierra sola, y casi todos aceptan tarjeta.',
        enlaces: [{ texto: 'App GO', app: 'go' }, { texto: 'Uber', app: 'uber' }] },
      { icono: 'luggage', q: '¿Puedo enviar las maletas al siguiente hotel?',
        a: 'Sí, y es de lo mejor de Japón: el envío de equipaje (takkyubin). Lo pides en la recepción del hotel o en un konbini, normalmente llega al día siguiente y viajas en tren con las manos libres. Ideal para Osaka → Kioto. Si las mandas al aeropuerto, hazlo con al menos dos días de margen.',
        enlaces: [{ texto: 'Yamato (oficial)', href: YAMATO }] },
      { icono: 'lock', q: '¿Dónde dejo las maletas unas horas?',
        a: 'En las taquillas de las estaciones, aunque en las grandes suelen estar llenas a media mañana. La alternativa es reservar consigna en una tienda o un hotel cercano desde el móvil: tienes el sitio asegurado.',
        enlaces: [{ texto: 'Consigna con reserva', app: 'radical' }] },
      { icono: 'device-mobile', q: '¿Cómo tengo internet al llegar?',
        a: 'Con una eSIM: la instalas en casa antes de volar y al aterrizar ya tienes datos, sin buscar tienda ni devolver ningún aparato. Comprueba antes que tu móvil admite eSIM.',
        enlaces: [{ texto: 'eSIM con descuento', app: 'airalo' }] },
      { icono: 'credit-card', q: '¿Llevo efectivo o pago con tarjeta?',
        a: 'Las dos cosas. Casi todo se paga con tarjeta, pero templos, puestos de comida y tiendas pequeñas a veces solo aceptan efectivo. Los cajeros de 7-Eleven admiten tarjetas extranjeras y están abiertos siempre. Para el transporte, la tarjeta ICOCA en el móvil.',
        enlaces: [{ texto: 'ICOCA', app: 'icoca' }, { texto: 'Tarjeta Wise', app: 'wise' }] },
      { icono: 'train', q: '¿Cómo voy de Osaka a Kioto o Nara?',
        a: 'En tren, sin reservar: hay varias líneas y todas funcionan con la ICOCA. Te explico cuál coger según dónde duermas.',
        enlaces: [{ texto: 'Guía Osaka → Kioto', guia: '/es/osaka-kioto/' }] },
      { icono: 'phone', q: '¿Y si tengo una emergencia?',
        a: 'Policía: 110. Ambulancia y bomberos: 119. La Japan Visitor Hotline (050-3816-2787) atiende en inglés, chino y coreano las 24 horas, todos los días. Si estás de tour conmigo, llámame a mí primero.',
        enlaces: [{ texto: 'Japan Visitor Hotline', href: JNTO }] },
    ],
    socios: {
      titulo: '¿Tienes una empresa de servicios para viajeros?',
      texto: 'Traslados, taxis, envío o consigna de maletas, eSIM, seguros, restaurantes, experiencias… Mis clientes me preguntan por todo esto cada semana y quiero recomendar a gente de confianza. Si tu servicio encaja, escríbeme y vemos cómo colaborar.',
      tipos: ['Traslados y taxis', 'Maletas', 'Internet', 'Restaurantes', 'Experiencias', 'Alojamiento'],
      correo: 'Escribir un correo', wa: 'WhatsApp',
      saludo: 'Hola Tony, tengo una empresa de servicios para viajeros y me gustaría colaborar contigo.',
    },
  },
  en: {
    titulo: 'What everyone asks me',
    sub: 'The questions I get on WhatsApp every week, answered here to make your trip easier.',
    preguntas: [
      { icono: 'plane-arrival', q: 'How do I get from Kansai Airport to my hotel?',
        a: 'Three options. Train: the Nankai Rapi:t reaches Namba (Osaka) in about 40 minutes, and the JR Haruka goes straight to Kyoto in just over an hour. Limousine bus: it stops at the big hotels and stations, easy with luggage. Private transfer: a driver waits with your name and takes you door to door, best if you land at night, with kids or with lots of bags.',
        enlaces: [{ texto: 'Full airport guide', guia: '/en/kansai-airport/' }, { texto: 'Private transfer', app: 'welcome' }] },
      { icono: 'car', q: 'How do I get a taxi?',
        a: 'Use the GO app or Uber, both work in Osaka and Kyoto: type your destination, no Japanese needed. You can also wave one down in the street. The back door opens and closes by itself, and almost all taxis take cards.',
        enlaces: [{ texto: 'GO app', app: 'go' }, { texto: 'Uber', app: 'uber' }] },
      { icono: 'luggage', q: 'Can I send my luggage to the next hotel?',
        a: "Yes, and it is one of Japan's best tricks: luggage forwarding (takkyubin). Ask at your hotel front desk or a convenience store; it usually arrives the next day and you ride the train hands-free. Perfect for Osaka → Kyoto. If you send it to the airport, allow at least two days.",
        enlaces: [{ texto: 'Yamato (official)', href: YAMATO }] },
      { icono: 'lock', q: 'Where can I leave my bags for a few hours?',
        a: 'Station coin lockers work, but in the big stations they are often full by mid-morning. The alternative is booking storage in a nearby shop or hotel from your phone, so your spot is guaranteed.',
        enlaces: [{ texto: 'Bookable luggage storage', app: 'radical' }] },
      { icono: 'device-mobile', q: 'How do I get mobile data when I land?',
        a: 'With an eSIM: install it at home before you fly and you have data the moment you land, no shop and nothing to return. Check first that your phone supports eSIM.',
        enlaces: [{ texto: 'Discounted eSIM', app: 'airalo' }] },
      { icono: 'credit-card', q: 'Cash or card?',
        a: 'Both. Cards work almost everywhere, but temples, food stalls and small shops sometimes take cash only. 7-Eleven ATMs accept foreign cards and are always open. For transport, an ICOCA card on your phone.',
        enlaces: [{ texto: 'ICOCA', app: 'icoca' }, { texto: 'Wise card', app: 'wise' }] },
      { icono: 'train', q: 'How do I get from Osaka to Kyoto or Nara?',
        a: 'By train, no booking needed: there are several lines and all of them take ICOCA. I explain which one to take depending on where you stay.',
        enlaces: [{ texto: 'Osaka → Kyoto guide', guia: '/en/osaka-to-kyoto/' }] },
      { icono: 'phone', q: 'What if I have an emergency?',
        a: 'Police: 110. Ambulance and fire: 119. The Japan Visitor Hotline (050-3816-2787) answers in English, Chinese and Korean 24 hours a day, every day. If you are on a tour with me, call me first.',
        enlaces: [{ texto: 'Japan Visitor Hotline', href: JNTO }] },
    ],
    socios: {
      titulo: 'Do you run a business for travellers?',
      texto: 'Transfers, taxis, luggage forwarding or storage, eSIMs, insurance, restaurants, experiences… My guests ask me about all of this every week and I want to recommend people I trust. If your service fits, write to me and let us see how we can work together.',
      tipos: ['Transfers & taxis', 'Luggage', 'Mobile data', 'Restaurants', 'Experiences', 'Where to stay'],
      correo: 'Send an email', wa: 'WhatsApp',
      saludo: 'Hi Tony, I run a business for travellers and would like to work with you.',
    },
  },
  ar: {
    titulo: 'ما يسألني عنه الجميع',
    sub: 'الأسئلة التي تصلني كل أسبوع على واتساب، مع إجاباتها هنا لتكون رحلتك أسهل.',
    preguntas: [
      { icono: 'plane-arrival', q: 'كيف أصل من مطار كانساي إلى الفندق؟',
        a: 'لديك ثلاثة خيارات. القطار: قطار نانكاي رابيت يصل إلى نامبا (أوساكا) في نحو 40 دقيقة، وقطار JR هاروكا يذهب مباشرة إلى كيوتو في ما يزيد قليلًا على ساعة. حافلة الليموزين: تتوقف عند الفنادق والمحطات الكبيرة، ومريحة مع الحقائب. التوصيل الخاص: سائق ينتظرك باسمك ويوصلك من الباب إلى الباب، وهو الأفضل إن وصلت ليلًا أو مع أطفال أو حقائب كثيرة.',
        enlaces: [{ texto: 'دليل المطار الكامل', guia: '/en/kansai-airport/' }, { texto: 'توصيل خاص', app: 'welcome' }] },
      { icono: 'car', q: 'كيف أطلب تاكسي؟',
        a: 'بتطبيق GO أو أوبر، وكلاهما يعمل في أوساكا وكيوتو: تكتب وجهتك ولا تحتاج إلى اليابانية. ويمكنك أيضًا إيقافه في الشارع بيدك. الباب الخلفي يُفتح ويُغلق وحده، وتقبل كل السيارات تقريبًا البطاقة.',
        enlaces: [{ texto: 'تطبيق GO', app: 'go' }, { texto: 'أوبر', app: 'uber' }] },
      { icono: 'luggage', q: 'هل أستطيع إرسال حقائبي إلى الفندق التالي؟',
        a: 'نعم، وهذه من أفضل خدمات اليابان: شحن الأمتعة (تاكيوبين). تطلبه من استقبال الفندق أو من متجر كونبيني، وتصل عادةً في اليوم التالي فتسافر بالقطار ويداك فارغتان. مثالي من أوساكا إلى كيوتو. وإن أرسلتها إلى المطار فاترك يومين على الأقل.',
        enlaces: [{ texto: 'ياماتو (الموقع الرسمي)', href: YAMATO }] },
      { icono: 'lock', q: 'أين أترك حقائبي بضع ساعات؟',
        a: 'في خزائن المحطات، لكنها في المحطات الكبيرة تمتلئ غالبًا قبل الظهر. البديل أن تحجز مكانًا لحقائبك في متجر أو فندق قريب من هاتفك، فيكون مكانك مضمونًا.',
        enlaces: [{ texto: 'حفظ الأمتعة بالحجز', app: 'radical' }] },
      { icono: 'device-mobile', q: 'كيف أحصل على الإنترنت عند الوصول؟',
        a: 'بشريحة eSIM: تثبّتها في بيتك قبل السفر فيكون الإنترنت جاهزًا لحظة الهبوط، بلا متجر ولا جهاز تعيده. تأكد أولًا أن هاتفك يدعم eSIM.',
        enlaces: [{ texto: 'eSIM بخصم', app: 'airalo' }] },
      { icono: 'credit-card', q: 'نقدًا أم بالبطاقة؟',
        a: 'الاثنان. البطاقة تعمل في كل مكان تقريبًا، لكن بعض المعابد وأكشاك الطعام والمحلات الصغيرة لا تقبل إلا النقد. صرّافات 7-Eleven تقبل البطاقات الأجنبية ومفتوحة دائمًا. وللمواصلات، بطاقة ICOCA على هاتفك.',
        enlaces: [{ texto: 'ICOCA', app: 'icoca' }, { texto: 'بطاقة Wise', app: 'wise' }] },
      { icono: 'train', q: 'كيف أذهب من أوساكا إلى كيوتو أو نارا؟',
        a: 'بالقطار ومن دون حجز: هناك عدة خطوط وكلها تعمل ببطاقة ICOCA. أشرح لك أيّها تأخذ حسب مكان إقامتك.',
        enlaces: [{ texto: 'دليل أوساكا ← كيوتو', guia: '/en/osaka-to-kyoto/' }] },
      { icono: 'phone', q: 'وماذا لو حدث طارئ؟',
        a: 'الشرطة: 110. الإسعاف والإطفاء: 119. خط Japan Visitor Hotline (050-3816-2787) يجيب بالإنجليزية والصينية والكورية على مدار 24 ساعة كل يوم. وإن كنت في جولة معي، اتصل بي أولًا.',
        enlaces: [{ texto: 'Japan Visitor Hotline', href: JNTO }] },
    ],
    socios: {
      titulo: 'هل لديك شركة تقدّم خدمات للمسافرين؟',
      texto: 'التوصيل والتاكسي، شحن الأمتعة أو حفظها، شرائح eSIM، التأمين، المطاعم الحلال، التجارب… ضيوفي يسألونني عن كل هذا كل أسبوع وأريد أن أوصي بمن أثق بهم. إن كانت خدمتك مناسبة، راسلني لنرى كيف نتعاون.',
      tipos: ['التوصيل والتاكسي', 'الأمتعة', 'الإنترنت', 'المطاعم', 'التجارب', 'الإقامة'],
      correo: 'أرسل بريدًا', wa: 'واتساب',
      saludo: 'السلام عليكم توني، لدي شركة خدمات للمسافرين وأودّ التعاون معك.',
    },
  },
  ru: {
    titulo: 'Частые вопросы гостей',
    sub: 'Вопросы, которые нам каждую неделю задают в WhatsApp, — с ответами, чтобы поездка была проще.',
    preguntas: [
      { icono: 'plane-arrival', q: 'Как добраться из аэропорта Кансай до отеля?',
        a: 'Есть три варианта. Поезд: Nankai Rapi:t довезёт до Намбы (Осака) примерно за 40 минут, а JR Haruka идёт прямо в Киото чуть больше часа. Автобус-лимузин: останавливается у крупных отелей и вокзалов, удобно с багажом. Частный трансфер: водитель встречает с табличкой и везёт от двери до двери — лучше всего, если прилетаете ночью, с детьми или с большим багажом.',
        enlaces: [{ texto: 'Подробно про аэропорт (англ.)', guia: '/en/kansai-airport/' }, { texto: 'Частный трансфер', app: 'welcome' }] },
      { icono: 'car', q: 'Как вызвать такси?',
        a: 'Через приложение GO или Uber — оба работают в Осаке и Киото: вводите адрес, японский не нужен. Можно и просто поднять руку на улице. Задняя дверь открывается и закрывается сама, почти везде принимают карты.',
        enlaces: [{ texto: 'Приложение GO', app: 'go' }, { texto: 'Uber', app: 'uber' }] },
      { icono: 'luggage', q: 'Можно отправить чемоданы в следующий отель?',
        a: 'Да, и это одна из лучших вещей в Японии — доставка багажа (такюбин). Оформляется на ресепшене отеля или в магазине у дома, обычно приходит на следующий день, а вы едете в поезде налегке. Идеально для Осака → Киото. В аэропорт отправляйте минимум за два дня.',
        enlaces: [{ texto: 'Yamato (официальный сайт)', href: YAMATO }] },
      { icono: 'lock', q: 'Где оставить багаж на несколько часов?',
        a: 'В камерах хранения на вокзалах, но на больших станциях к середине утра они обычно заняты. Альтернатива — забронировать хранение в магазине или отеле рядом прямо с телефона: место гарантировано.',
        enlaces: [{ texto: 'Хранение багажа с бронью', app: 'radical' }] },
      { icono: 'device-mobile', q: 'Как сразу получить интернет?',
        a: 'С eSIM: устанавливаете дома до вылета, и после посадки интернет уже работает — без магазинов и возврата устройств. Заранее проверьте, поддерживает ли телефон eSIM.',
        enlaces: [{ texto: 'eSIM со скидкой', app: 'airalo' }] },
      { icono: 'credit-card', q: 'Наличные или карта?',
        a: 'И то и другое. Картой можно платить почти везде, но в храмах, уличных лавках и маленьких магазинах иногда берут только наличные. Банкоматы 7-Eleven принимают иностранные карты и работают круглосуточно. Для транспорта — ICOCA в телефоне.',
        enlaces: [{ texto: 'ICOCA', app: 'icoca' }, { texto: 'Карта Wise', app: 'wise' }] },
      { icono: 'train', q: 'Как доехать из Осаки в Киото или Нару?',
        a: 'На поезде, без брони: линий несколько, и все принимают ICOCA. Какую выбрать, зависит от того, где вы живёте.',
        enlaces: [{ texto: 'Осака → Киото (англ.)', guia: '/en/osaka-to-kyoto/' }] },
      { icono: 'phone', q: 'А если что-то случится?',
        a: 'Полиция: 110. Скорая и пожарные: 119. Japan Visitor Hotline (050-3816-2787) отвечает на английском, китайском и корейском круглосуточно и без выходных. Если вы на экскурсии с нами — сначала звоните гиду.',
        enlaces: [{ texto: 'Japan Visitor Hotline', href: JNTO }] },
    ],
    socios: {
      titulo: 'У вас бизнес для путешественников?',
      texto: 'Трансферы, такси, доставка и хранение багажа, eSIM, страховки, рестораны, впечатления… Гости спрашивают нас об этом каждую неделю, и мы хотим рекомендовать тех, кому доверяем. Если ваш сервис подходит — напишите, обсудим сотрудничество.',
      tipos: ['Трансферы и такси', 'Багаж', 'Интернет', 'Рестораны', 'Впечатления', 'Жильё'],
      correo: 'Написать письмо', wa: 'WhatsApp',
      saludo: 'Hi Tony, I run a business for travellers and would like to work with you.',
    },
  },
}
