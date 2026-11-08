// Traducciones de los planes de guía (datosPlanes.ts) a ar / ru / tr / fr.
// Marcas de los socios tal cual; nada de alcohol. {p} = nombre del plan.
import type { UiPlan } from './datosPlanes.ts'

type T = { nombre: string; gancho: string; puntos: string[] }

export const TRAD: Record<'ar' | 'ru' | 'tr' | 'fr', { ui: UiPlan; planes: Record<string, T> }> = {
  ar: {
    ui: {
      ceja: 'برامج المرشد', h: 'اختر كيف تريد يومك', p: 'كل برنامج هو خدمة إرشاد. التجارب والتذاكر والمواصلات والوجبات غير مشمولة: تُدفع على حدة، وإن رغبتم ننسّقها ونرافقكم.',
      pagaGuiaT: 'للمرشد تدفع', pagaGuia: 'الإرشاد فقط: سعر نصف اليوم أو اليوم الكامل.', apartT: 'على حدة، مباشرة', aparte: 'التذاكر والقطارات والوجبات والتجارب. مع شركائنا وبخصم.',
      extrasT: 'إضافات ننسّقها · تُدفع على حدة', pedir: 'اطلب هذا البرنامج', msj: 'السلام عليكم، أنا مهتم ببرنامج «{p}». عددنا … أشخاص، والتواريخ: …',
      kitH: 'خصومات لرحلتك', kitP: 'رموز للإنترنت وحفظ الأمتعة. منفصلة عن المرشد.', todas: 'كل المزايا', halal: 'مناسب للعائلات المسلمة',
    },
    planes: {
      'primer-dia': { nombre: 'يوم أول بلا توتر', gancho: 'نلتقيكم في الفندق ونعلّمكم التنقل في اليابان من اللحظة الأولى.', puntos: ['الاستقبال من فندقكم', 'بطاقة ICOCA والقطارات والتطبيقات المفيدة', 'كيف تدفعون وتطلبون في المطاعم', 'أول جولة في المدينة'] },
      tematico: { nombre: 'يوم بموضوع: الشاي أو الكيمونو أو الساموراي', gancho: 'تختارون الموضوع ويرتّب المرشد اليوم حوله: يحجز التجربة ويرافقكم.', puntos: ['نختار الموضوع معًا', 'المرشد يحجز وينسّق المواعيد', 'يرافقكم ويترجم لكم', 'جولة في المنطقة قبلها أو بعدها'] },
      'familia-musulmana': { nombre: 'العائلة المسلمة', gancho: 'طعام حلال، ووقت للصلاة، وأنشطة مناسبة، وكل شيء مرتّب مسبقًا.', puntos: ['مطاعم حلال أو بلا خنزير ولا كحول', 'استراحات للصلاة', 'مسار مصمّم للعائلة', 'أنشطة مناسبة مثل الكيمونو مع الحجاب'] },
      'ritmo-tranquilo': { nombre: 'إيقاع هادئ', gancho: 'لكبار السن أو لمن يفضّل عدم الاستعجال: درج أقل واستراحات أكثر.', puntos: ['مسار بدرج قليل', 'استراحات ومقاهٍ', 'تاكسي بين المحطات عند الحاجة', 'مواعيد مرنة'] },
      artesania: { nombre: 'اليابان الحِرَفية', gancho: 'ورش تصنعون فيها شيئًا تأخذونه معكم؛ المرشد يحجزها باليابانية ويترجم.', puntos: ['نختار الورشة التي تعجبكم', 'الحجز باليابانية', 'ترجمة أثناء الورشة', 'أحياء تقليدية حولها'] },
      'comer-comprar': { nombre: 'أوساكا للأكل والتسوّق', gancho: 'أسواق وأكل الشارع ومتاجر: المرشد يأخذكم إلى الأماكن الجيدة ويترجم.', puntos: ['أسواق مثل كورومون', 'أكل الشارع في دوتونبوري', 'سكاكين وحِرَف أو إلكترونيات', 'التسوّق المعفى من الضريبة وكيف تطلبون'] },
      'varios-dias': { nombre: 'عدة أيام مع المرشد نفسه', gancho: 'مرشد واحد للرحلة كلها: يخطّط وينسّق ويرافقكم كل يوم.', puntos: ['خطة رحلة على مقاسكم', 'تنسيق القطارات والحجوزات', 'المرشد نفسه كل يوم', 'كانساي والرحلات الطويلة'] },
    },
  },
  ru: {
    ui: {
      ceja: 'Программы с гидом', h: 'Выберите, каким будет ваш день', p: 'Каждая программа — это услуги гида. Впечатления, входные билеты, транспорт и еда не включены: они оплачиваются отдельно, а мы по желанию всё организуем и пойдём с вами.',
      pagaGuiaT: 'Гиду вы платите', pagaGuia: 'Только за работу гида: его тариф за полдня или за весь день.', apartT: 'Отдельно, напрямую', aparte: 'Билеты, поезда, еда и впечатления. У наших партнёров — со скидкой.',
      extrasT: 'Организуем дополнительно · оплата отдельно', pedir: 'Запросить программу', msj: 'Здравствуйте! Меня интересует программа «{p}». Нас … человек, даты: …',
      kitH: 'Скидки для поездки', kitP: 'Промокоды на интернет и хранение багажа. Отдельно от гида.', todas: 'Все привилегии', halal: 'Подходит мусульманским семьям',
    },
    planes: {
      'primer-dia': { nombre: 'Первый день без стресса', gancho: 'Встретим вас в отеле и с первого дня научим свободно передвигаться по Японии.', puntos: ['Встреча в вашем отеле', 'Карта ICOCA, поезда и полезные приложения', 'Как платить и заказывать в ресторанах', 'Первая прогулка по городу'] },
      tematico: { nombre: 'Тематический день: чай, кимоно или самураи', gancho: 'Вы выбираете тему, а гид строит вокруг неё день: бронирует и идёт с вами.', puntos: ['Вместе выбираем тему', 'Гид бронирует и согласует время', 'Сопровождает и переводит', 'Прогулка по району до или после'] },
      'familia-musulmana': { nombre: 'Мусульманская семья', gancho: 'Халяльная еда, время для молитвы и подходящие занятия — всё продумано заранее.', puntos: ['Халяльные рестораны или без свинины и алкоголя', 'Перерывы на молитву', 'Маршрут под семью', 'Подходящие занятия, например кимоно с хиджабом'] },
      'ritmo-tranquilo': { nombre: 'Спокойный темп', gancho: 'Для старшего поколения и всех, кто не любит спешить: меньше лестниц, больше пауз.', puntos: ['Маршрут с минимумом лестниц', 'Паузы и кафе', 'Такси между точками при необходимости', 'Гибкое расписание'] },
      artesania: { nombre: 'Япония ремёсел', gancho: 'Мастер-классы, где вы делаете вещь на память; гид бронирует их по-японски и переводит.', puntos: ['Выбираем мастер-класс по душе', 'Бронирование по-японски', 'Перевод на мастер-классе', 'Старые кварталы вокруг'] },
      'comer-comprar': { nombre: 'Осака: еда и покупки', gancho: 'Рынки, уличная еда и магазины: гид приведёт в хорошие места и поможет объясниться.', puntos: ['Рынки вроде Куромон', 'Уличная еда на Дотонбори', 'Ножи, ремёсла или электроника', 'Tax-free и как заказывать'] },
      'varios-dias': { nombre: 'Несколько дней с одним гидом', gancho: 'Один гид на всю поездку: планирует, координирует и сопровождает каждый день.', puntos: ['План поездки под вас', 'Поезда и бронирования согласованы', 'Один и тот же гид каждый день', 'Кансай и дальние поездки'] },
    },
  },
  tr: {
    ui: {
      ceja: 'Rehber planları', h: 'Gününüzü nasıl istediğinizi seçin', p: 'Her plan bir rehberlik hizmetidir. Deneyimler, giriş biletleri, ulaşım ve yemekler dahil değildir: ayrıca ödenir; isterseniz biz ayarlarız ve sizinle geliriz.',
      pagaGuiaT: 'Rehbere ödediğiniz', pagaGuia: 'Sadece rehberlik: yarım gün veya tam gün ücreti.', apartT: 'Ayrıca, doğrudan', aparte: 'Biletler, trenler, yemekler ve deneyimler. Ortaklarımızda indirimli.',
      extrasT: 'Ayarladığımız ekstralar · ayrıca ödenir', pedir: 'Bu planı iste', msj: 'Merhaba, «{p}» planıyla ilgileniyorum. … kişiyiz, tarihler: …',
      kitH: 'Geziniz için indirimler', kitP: 'Mobil internet ve bavul emaneti kodları. Rehberden ayrı.', todas: 'Tüm avantajlar', halal: 'Müslüman ailelere uygun',
    },
    planes: {
      'primer-dia': { nombre: 'Stressiz ilk gün', gancho: 'Sizi otelinizden alır, ilk günden Japonya’da nasıl dolaşılacağını gösteririz.', puntos: ['Otelinizden karşılama', 'ICOCA kart, trenler ve faydalı uygulamalar', 'Restoranlarda ödeme ve sipariş', 'Şehirde ilk yürüyüş'] },
      tematico: { nombre: 'Temalı gün: çay, kimono veya samuray', gancho: 'Temayı siz seçersiniz, rehber günü ona göre kurar: rezervasyonu yapar ve sizinle gelir.', puntos: ['Temayı birlikte seçeriz', 'Rehber rezervasyonu ve saatleri ayarlar', 'Size eşlik eder ve tercüme eder', 'Öncesinde veya sonrasında bölgede gezinti'] },
      'familia-musulmana': { nombre: 'Müslüman aile', gancho: 'Helal yemek, namaz vakti ve uygun etkinlikler; hepsi önceden düşünülmüş.', puntos: ['Helal ya da domuz ve alkol içermeyen restoranlar', 'Namaz molaları', 'Aileye göre rota', 'Başörtüsüyle kimono gibi uygun etkinlikler'] },
      'ritmo-tranquilo': { nombre: 'Sakin tempo', gancho: 'Yaşlılar ya da acele etmek istemeyenler için: daha az merdiven, daha çok mola.', puntos: ['Az merdivenli rota', 'Molalar ve kafeler', 'Gerekirse duraklar arası taksi', 'Esnek saatler'] },
      artesania: { nombre: 'Zanaat Japonyası', gancho: 'Kendi yaptığınızı götürdüğünüz atölyeler; rehber Japonca rezervasyon yapar ve tercüme eder.', puntos: ['Sevdiğiniz atölyeyi seçeriz', 'Japonca rezervasyon', 'Atölyede tercüme', 'Çevredeki eski sokaklar'] },
      'comer-comprar': { nombre: 'Yemek ve alışveriş için Osaka', gancho: 'Pazarlar, sokak lezzetleri ve dükkanlar: rehber sizi iyi yerlere götürür ve tercüme eder.', puntos: ['Kuromon gibi pazarlar', 'Dotonbori’de sokak lezzetleri', 'Bıçak, el sanatı veya elektronik', 'Tax-free alışveriş ve sipariş'] },
      'varios-dias': { nombre: 'Aynı rehberle birkaç gün', gancho: 'Tüm gezi için tek rehber: planlar, koordine eder ve her gün sizinle olur.', puntos: ['Size özel gezi planı', 'Trenler ve rezervasyonlar ayarlanır', 'Her gün aynı rehber', 'Kansai ve uzun günübirlik geziler'] },
    },
  },
  fr: {
    ui: {
      ceja: 'Formules de guide', h: 'Choisissez votre journée', p: 'Chaque formule est un service de guide. Les expériences, entrées, transports et repas ne sont pas inclus : ils se paient à part, et si vous le souhaitez nous les organisons et vous accompagnons.',
      pagaGuiaT: 'Au guide, vous payez', pagaGuia: 'Seulement le guidage : son tarif demi-journée ou journée.', apartT: 'À part, directement', aparte: 'Entrées, trains, repas et expériences. Chez nos partenaires, avec remise.',
      extrasT: 'Extras que nous organisons · payés à part', pedir: 'Demander cette formule', msj: 'Bonjour, la formule « {p} » m’intéresse. Nous sommes … personnes, dates : …',
      kitH: 'Remises pour votre voyage', kitP: 'Codes pour internet mobile et consigne à bagages. À part du guide.', todas: 'Tous les avantages', halal: 'Adapté aux familles musulmanes',
    },
    planes: {
      'primer-dia': { nombre: 'Premier jour sans stress', gancho: 'Nous venons vous chercher à l’hôtel et vous apprenons à circuler au Japon dès le premier jour.', puntos: ['Prise en charge à votre hôtel', 'Carte ICOCA, trains et applis utiles', 'Payer et commander au restaurant', 'Une première balade en ville'] },
      tematico: { nombre: 'Journée à thème : thé, kimono ou samouraïs', gancho: 'Vous choisissez le thème et le guide organise la journée autour : il réserve et vous accompagne.', puntos: ['On choisit le thème ensemble', 'Le guide réserve et cale les horaires', 'Il vous accompagne et traduit', 'Balade dans le quartier avant ou après'] },
      'familia-musulmana': { nombre: 'Famille musulmane', gancho: 'Repas halal, temps pour la prière et activités adaptées, tout prévu à l’avance.', puntos: ['Restaurants halal, ou sans porc ni alcool', 'Pauses pour la prière', 'Itinéraire pensé pour la famille', 'Activités adaptées, comme le kimono avec hijab'] },
      'ritmo-tranquilo': { nombre: 'Rythme tranquille', gancho: 'Pour les seniors ou ceux qui préfèrent prendre leur temps : moins d’escaliers, plus de pauses.', puntos: ['Itinéraire avec peu d’escaliers', 'Pauses et cafés', 'Taxi entre les étapes si besoin', 'Horaires souples'] },
      artesania: { nombre: 'Japon artisan', gancho: 'Des ateliers où vous fabriquez un objet à emporter ; le guide réserve en japonais et traduit.', puntos: ['On choisit l’atelier qui vous plaît', 'Réservation en japonais', 'Traduction pendant l’atelier', 'Ruelles traditionnelles autour'] },
      'comer-comprar': { nombre: 'Osaka pour manger et shopper', gancho: 'Marchés, street food et boutiques : le guide vous emmène aux bonnes adresses et traduit.', puntos: ['Marchés comme Kuromon', 'Street food à Dotonbori', 'Couteaux, artisanat ou électronique', 'Détaxe et comment commander'] },
      'varios-dias': { nombre: 'Plusieurs jours, même guide', gancho: 'Un seul guide pour tout le voyage : il planifie, coordonne et vous accompagne chaque jour.', puntos: ['Un voyage sur mesure', 'Trains et réservations coordonnés', 'Le même guide chaque jour', 'Kansai et longues excursions'] },
    },
  },
}
