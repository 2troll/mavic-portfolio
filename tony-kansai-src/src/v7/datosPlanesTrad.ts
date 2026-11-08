// Traducciones de los planes (datosPlanes.ts) a ar / ru / tr / fr.
// Marcas de los socios tal cual; nada de alcohol.
type T = { nombre: string; gancho: string; ruta: string[] }
export interface UiTrad {
  ceja: string; h: string; p: string; medio: string; completo: string; guia: string; porGrupo: string
  socio: string; precioMsj: string; extra: string; quiero: string; msj: string
  kitH: string; kitP: string; todas: string; halal: string; codigo: string
}

export const TRAD: Record<'ar' | 'ru' | 'tr' | 'fr', { ui: UiTrad; planes: Record<string, T> }> = {
  ar: {
    ui: {
      ceja: 'برامج مع مرشد', h: 'مرشد + تجارب، كلها في برنامج واحد', p: 'جهة اتصال واحدة تنظّم يومك كاملًا: المرشد والحجوزات وخصومات شركائنا. المزايا لكل ضيوف الفريق، مع أي مرشد تسافرون.',
      medio: 'نصف يوم · 4 ساعات', completo: 'يوم كامل · 8 ساعات', guia: 'المرشد', porGrupo: 'للمجموعة', socio: 'التجارب بسعر الشريك مع تطبيق الميزة', precioMsj: 'سعر المرشد عبر {c}',
      extra: 'ميزة إضافية معنا', quiero: 'أريد هذا البرنامج', msj: 'السلام عليكم، أنا مهتم ببرنامج «{p}». عددنا … أشخاص، والتواريخ: …',
      kitH: 'حزمة الوصول، مجانًا مع أي برنامج', kitP: 'الرموز التي يستخدمها ضيوفنا قبل السفر: الإنترنت وحفظ الأمتعة.', todas: 'كل المزايا', halal: 'مناسب للعائلات المسلمة', codigo: 'رمز',
    },
    planes: {
      'te-kioto': { nombre: 'كيوتو الكلاسيكية + حفل الشاي', gancho: 'أهم معالم كيوتو سيرًا على الأقدام وحفل شاي حقيقي، دون أن تبحثوا أو تحجزوا شيئًا.', ruta: ['فوشيمي إيناري قبل الزحام', 'شموع مرسومة يدويًا في Nakamura Rosoku على بعد دقائق من البوابات (اختياري)', 'معبد كيوميزو ومنحدرات هيغاشياما', 'حفل الشاي في MAIKOYA أو Camellia بخصم 10 %'] },
      'kimono-gion': { nombre: 'غيون بالكيمونو + صور', gancho: 'ارتدوا الكيمونو وتجوّلوا في أجمل أركان كيوتو، ومع مصوّر إن شئتم.', ruta: ['الكيمونو في Wargo (خصم 10 %) أو Okamoto', 'غيون وهانامي كوجي وضريح ياساكا', 'جلسة تصوير مع SnapKyoto (اختياري)', 'مع Okamoto يمكن إعادة الكيمونو في فرع آخر أو في اليوم التالي'] },
      samurai: { nombre: 'يوم الساموراي في كيوتو', gancho: 'أراشيياما، وارتداء درع ساموراي حقيقي، ومتحف يحبه الأطفال.', ruta: ['غابة الخيزران ونهر أراشيياما', 'درع الساموراي في Shogun Studio ضمن المسار', 'Samurai & Ninja Museum بخصم 10 %', 'سوار كوميهيمو تصنعه بيدك في DOMYO (اختياري)'] },
      'osaka-bici': { nombre: 'أوساكا بالدراجة وأطايب الشارع', gancho: 'القلعة، وأحياء لا يصلها السياح، وأكل الشارع، مع خصم على جولة الدراجات.', ruta: ['قلعة أوساكا وحديقتها', 'جولة Cycle & Eat في الأحياء المحلية، أرخص بـ 15 % معنا', 'Tower Knives في شينسيكاي: عرض خاص عن سكاكين ساكاي', 'دوتونبوري عند الغروب'] },
      'familia-musulmana': { nombre: 'العائلة المسلمة: كيوتو وأوساكا براحة بال', gancho: 'كيمونو مع الحجاب، ومكان للصلاة، وطبخ بلا كحول، وتسوّق حلال: كل شيء مرتّب مسبقًا.', ruta: ['كيمونو مع الحجاب في Miyabi-yuki، والطاقم نسائي', 'Yumeyakata في كيوتو، وفيه مصلّى', 'درس طبخ في Cooking Sun بقائمة نباتية بلا كحول', 'تسوّق في JAPANeid بأوساكا: منتجات بشهادة حلال'] },
      artesania: { nombre: 'أيادٍ يابانية: ورش حِرَف في كيوتو', gancho: 'خذوا معكم شيئًا صنعتموه بأيديكم: خيزران أو شموع أو كوميهيمو. اختاروا ورشة أو اثنتين.', ruta: ['سلة خيزران مع TAKENOKO (مجموعة واحدة في كل مرة، حتى 15)', 'شموع يابانية مرسومة يدويًا في Nakamura Rosoku', 'سوار كوميهيمو في DOMYO دون خبرة سابقة', 'المرشد يترجم لكم الورشة'] },
      'nara-sumi': { nombre: 'نارا + ورشة حبر السومي', gancho: 'الغزلان وتمثال بوذا الكبير، ثم قطعة حبر تصنعونها بأنفسكم في ورشة عمرها قرون.', ruta: ['حديقة نارا وغزلانها', 'معبد تودايجي وبوذا الكبير', 'جولة في ناراماتشي', 'ورشة Kobaien: نحجزها باليابانية ونترجمها دون تكلفة إضافية'] },
    },
  },
  ru: {
    ui: {
      ceja: 'Программы с гидом', h: 'Гид + впечатления в одной программе', p: 'Один контакт организует весь день: гид, бронирования и скидки наших партнёров. Привилегии действуют для всех гостей команды, с каким бы гидом вы ни путешествовали.',
      medio: 'Полдня · 4 ч', completo: 'Весь день · 8 ч', guia: 'Гид', porGrupo: 'за группу', socio: 'Впечатления по цене партнёра, со скидкой или бонусом', precioMsj: 'Цена гида — в {c}',
      extra: 'Бонус с нами', quiero: 'Хочу эту программу', msj: 'Здравствуйте! Меня интересует программа «{p}». Нас … человек, даты: …',
      kitH: 'Набор к прилёту — бесплатно к любой программе', kitP: 'Промокоды, которыми наши гости пользуются ещё до вылета: интернет и хранение багажа.', todas: 'Все привилегии', halal: 'Подходит мусульманским семьям', codigo: 'код',
    },
    planes: {
      'te-kioto': { nombre: 'Классический Киото + чайная церемония', gancho: 'Главное в Киото пешком и настоящая чайная церемония — ничего не нужно искать и бронировать самим.', ruta: ['Фусими Инари до наплыва туристов', 'Расписные свечи в Nakamura Rosoku, в паре минут от ворот тории (по желанию)', 'Киёмидзу-дэра и улочки Хигасиямы', 'Чайная церемония в MAIKOYA или Camellia со скидкой 10 %'] },
      'kimono-gion': { nombre: 'Гион в кимоно + фотосессия', gancho: 'Наденьте кимоно и прогуляйтесь по самым красивым уголкам Киото, по желанию — с фотографом.', ruta: ['Кимоно в Wargo (скидка 10 %) или Okamoto', 'Гион, Ханамикодзи и святилище Ясака', 'Фотосессия со SnapKyoto (по желанию)', 'В Okamoto кимоно можно сдать в другом салоне или на следующий день'] },
      samurai: { nombre: 'День самурая в Киото', gancho: 'Арасияма, настоящие самурайские доспехи и музей, от которого в восторге и дети, и взрослые.', ruta: ['Бамбуковая роща и река Арасиямы', 'Самурайские доспехи в Shogun Studio прямо по маршруту', 'Samurai & Ninja Museum со скидкой 10 %', 'Браслет кумихимо своими руками в DOMYO (по желанию)'] },
      'osaka-bici': { nombre: 'Осака на велосипеде и с уличной едой', gancho: 'Замок, кварталы, куда не доходят туристы, и уличная еда — со скидкой на велотур.', ruta: ['Замок Осаки и парк вокруг', 'Маршрут Cycle & Eat по местным кварталам, с нами на 15 % дешевле', 'Tower Knives в Синсэкай: частный рассказ о ножах Сакаи', 'Дотонбори на закате'] },
      'familia-musulmana': { nombre: 'Мусульманская семья: спокойные Киото и Осака', gancho: 'Кимоно с хиджабом, место для молитвы, кулинария без алкоголя и халяльные покупки — всё продумано заранее.', ruta: ['Кимоно с хиджабом в Miyabi-yuki, работают только женщины', 'Yumeyakata в Киото, с молитвенной комнатой', 'Кулинарный класс в Cooking Sun с вегетарианским меню без алкоголя', 'Покупки в JAPANeid (Осака): товары с халяль-сертификатом'] },
      artesania: { nombre: 'Японские ремёсла: мастер-классы в Киото', gancho: 'Увезите домой вещь, сделанную своими руками: бамбук, свечи или кумихимо. Выберите одно или два.', ruta: ['Корзина из бамбука в TAKENOKO (одна группа за раз, до 15 человек)', 'Японские свечи ручной росписи в Nakamura Rosoku', 'Браслет кумихимо в DOMYO, опыт не нужен', 'Гид переводит мастер-класс'] },
      'nara-sumi': { nombre: 'Нара + мастерская туши суми', gancho: 'Олени и Великий Будда, а потом — собственная палочка туши в мастерской с многовековой историей.', ruta: ['Парк Нары и его олени', 'Тодай-дзи и Великий Будда', 'Прогулка по Нарамати', 'Мастерская Kobaien: бронируем по-японски и переводим без доплаты'] },
    },
  },
  tr: {
    ui: {
      ceja: 'Rehberli planlar', h: 'Rehber + deneyimler, hepsi tek planda', p: 'Tek bir kişi bütün günü ayarlar: rehber, rezervasyonlar ve ortaklarımızın indirimleri. Avantajlar, hangi rehberle gelirseniz gelin ekibin tüm misafirleri için geçerli.',
      medio: 'Yarım gün · 4 saat', completo: 'Tam gün · 8 saat', guia: 'Rehber', porGrupo: 'grup başına', socio: 'Deneyimler ortağın fiyatından, avantaj uygulanmış olarak', precioMsj: 'Rehber fiyatı {c} üzerinden',
      extra: 'Bizimle ekstra', quiero: 'Bu planı istiyorum', msj: 'Merhaba, «{p}» planıyla ilgileniyorum. … kişiyiz, tarihler: …',
      kitH: 'Varış paketi, her planla ücretsiz', kitP: 'Misafirlerimizin uçmadan önce kullandığı kodlar: mobil internet ve bavul emaneti.', todas: 'Tüm avantajlar', halal: 'Müslüman ailelere uygun', codigo: 'kod',
    },
    planes: {
      'te-kioto': { nombre: 'Klasik Kyoto + çay seremonisi', gancho: 'Kyoto’nun olmazsa olmazları yürüyerek ve gerçek bir çay seremonisi; hiçbir şey aramanıza ya da ayırtmanıza gerek yok.', ruta: ['Kalabalıktan önce Fushimi Inari', 'Toriilere birkaç dakika mesafede Nakamura Rosoku’da el boyaması mumlar (isteğe bağlı)', 'Kiyomizu-dera ve Higashiyama yokuşları', 'MAIKOYA veya Camellia’da %10 indirimli çay seremonisi'] },
      'kimono-gion': { nombre: 'Kimonoyla Gion + fotoğraf', gancho: 'Kimononuzu giyin ve Kyoto’nun en güzel köşelerini gezin; isterseniz fotoğrafçıyla.', ruta: ['Wargo’da (%10 indirim) veya Okamoto’da kimono', 'Gion, Hanamikoji ve Yasaka Tapınağı', 'SnapKyoto ile fotoğraf çekimi (isteğe bağlı)', 'Okamoto’da kimonoyu başka bir şubede veya ertesi gün iade edebilirsiniz'] },
      samurai: { nombre: 'Kyoto’da samuray günü', gancho: 'Arashiyama, gerçek bir samuray zırhı ve çocukların bayılacağı bir müze.', ruta: ['Arashiyama bambu ormanı ve nehri', 'Rotaya yerleştirilmiş Shogun Studio’da samuray zırhı', '%10 indirimli Samurai & Ninja Museum', 'DOMYO’da kendi kumihimo bilekliğiniz (isteğe bağlı)'] },
      'osaka-bici': { nombre: 'Bisikletle ve lezzetlerle Osaka', gancho: 'Kale, turistlerin gitmediği mahalleler ve sokak lezzetleri; bisiklet turunda indirimle.', ruta: ['Osaka Kalesi ve parkı', 'Yerel mahallelerde Cycle & Eat rotası, bizimle %15 daha ucuz', 'Shinsekai’de Tower Knives: Sakai bıçakları üzerine özel sunum', 'Akşamüstü Dotonbori'] },
      'familia-musulmana': { nombre: 'Müslüman aile: huzurla Kyoto ve Osaka', gancho: 'Başörtüsüyle kimono, namaz için yer, alkolsüz yemek kursu ve helal alışveriş: her şey önceden düşünülmüş.', ruta: ['Miyabi-yuki’de başörtüsüyle kimono, tamamı kadın personel', 'Kyoto’da namaz odalı Yumeyakata', 'Cooking Sun’da alkolsüz vejetaryen menüyle yemek kursu', 'Osaka’da JAPANeid: helal sertifikalı ürünler'] },
      artesania: { nombre: 'Japon elleri: Kyoto’da zanaat atölyeleri', gancho: 'Kendi yaptığınız bir şeyi eve götürün: bambu, mum veya kumihimo. Bir ya da iki tane seçin.', ruta: ['TAKENOKO ile bambu sepet (her seferinde tek grup, 15 kişiye kadar)', 'Nakamura Rosoku’da el boyaması Japon mumları', 'DOMYO’da kumihimo bileklik, deneyim gerekmez', 'Rehberiniz atölyeyi tercüme eder'] },
      'nara-sumi': { nombre: 'Nara + sumi mürekkep atölyesi', gancho: 'Geyikler ve Büyük Buda, ardından asırlık bir atölyede kendi mürekkep çubuğunuz.', ruta: ['Nara Parkı ve geyikleri', 'Todai-ji ve Büyük Buda', 'Naramachi’de yürüyüş', 'Kobaien atölyesi: Japonca rezervasyon ve ücretsiz tercüme'] },
    },
  },
  fr: {
    ui: {
      ceja: 'Formules avec guide', h: 'Guide + expériences, tout en une formule', p: 'Un seul contact organise toute la journée : le guide, les réservations et les remises de nos partenaires. Les avantages valent pour tous les clients de l’équipe, quel que soit votre guide.',
      medio: 'Demi-journée · 4 h', completo: 'Journée · 8 h', guia: 'Guide', porGrupo: 'par groupe', socio: 'Expériences au prix du partenaire, avantage appliqué', precioMsj: 'Prix du guide sur {c}',
      extra: 'Petit plus avec nous', quiero: 'Je veux cette formule', msj: 'Bonjour, la formule « {p} » m’intéresse. Nous sommes … personnes, dates : …',
      kitH: 'Kit d’arrivée, offert avec toute formule', kitP: 'Les codes que nos clients utilisent avant le départ : internet mobile et consigne à bagages.', todas: 'Tous les avantages', halal: 'Adapté aux familles musulmanes', codigo: 'code',
    },
    planes: {
      'te-kioto': { nombre: 'Kyoto classique + cérémonie du thé', gancho: 'L’essentiel de Kyoto à pied et une vraie cérémonie du thé, sans rien chercher ni réserver vous-même.', ruta: ['Fushimi Inari avant la foule', 'Bougies peintes à la main chez Nakamura Rosoku, à quelques minutes des torii (en option)', 'Kiyomizu-dera et les ruelles d’Higashiyama', 'Cérémonie du thé chez MAIKOYA ou Camellia, 10 % de remise'] },
      'kimono-gion': { nombre: 'Gion en kimono + photos', gancho: 'Habillez-vous en kimono et flânez dans les plus beaux coins de Kyoto, avec un photographe si vous le souhaitez.', ruta: ['Kimono chez Wargo (10 % de remise) ou Okamoto', 'Gion, Hanamikoji et le sanctuaire Yasaka', 'Séance photo avec SnapKyoto (en option)', 'Chez Okamoto, rendez le kimono dans une autre boutique ou le lendemain'] },
      samurai: { nombre: 'Journée samouraï à Kyoto', gancho: 'Arashiyama, une vraie armure de samouraï et un musée que les enfants adorent.', ruta: ['Bambouseraie et rivière d’Arashiyama', 'Armure de samouraï au Shogun Studio, intégrée au parcours', 'Samurai & Ninja Museum, 10 % de remise', 'Bracelet kumihimo fait main chez DOMYO (en option)'] },
      'osaka-bici': { nombre: 'Osaka à vélo et en bouchées', gancho: 'Le château, des quartiers où les touristes ne vont pas et la street food, avec une remise sur le tour à vélo.', ruta: ['Château d’Osaka et son parc', 'Parcours Cycle & Eat dans les quartiers locaux, 15 % moins cher avec nous', 'Tower Knives à Shinsekai : présentation privée sur les couteaux de Sakai', 'Dotonbori à la tombée du jour'] },
      'familia-musulmana': { nombre: 'Famille musulmane : Kyoto et Osaka en toute sérénité', gancho: 'Kimono avec hijab, lieu de prière, cuisine sans alcool et achats halal : tout est prévu à l’avance.', ruta: ['Kimono avec hijab chez Miyabi-yuki, personnel féminin', 'Yumeyakata (Kyoto), avec salle de prière', 'Cours chez Cooking Sun avec menu végétarien sans alcool', 'Achats chez JAPANeid (Osaka) : produits certifiés halal'] },
      artesania: { nombre: 'Mains japonaises : ateliers d’artisanat à Kyoto', gancho: 'Repartez avec un objet fait de vos mains : bambou, bougies ou kumihimo. Choisissez-en un ou deux.', ruta: ['Panier en bambou avec TAKENOKO (un seul groupe à la fois, jusqu’à 15)', 'Bougies japonaises peintes à la main chez Nakamura Rosoku', 'Bracelet kumihimo chez DOMYO, sans expérience', 'Votre guide traduit l’atelier'] },
      'nara-sumi': { nombre: 'Nara + atelier d’encre sumi', gancho: 'Les daims et le Grand Bouddha, puis votre propre bâton d’encre dans un atelier séculaire.', ruta: ['Parc de Nara et ses daims', 'Todai-ji et le Grand Bouddha', 'Promenade dans Naramachi', 'Atelier Kobaien : réservé en japonais et traduit sans supplément'] },
    },
  },
}
