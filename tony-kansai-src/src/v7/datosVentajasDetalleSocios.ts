// Fichas ampliadas de los socios de experiencias que entraron del 13 al 17-11-2026.
// Sin este texto su página (/es/ventajas/<clave>/) era casi solo la plantilla, y
// Google las dejaba en «Rastreada: actualmente sin indexar» (Search Console, 17-11).
// Todo sale de lo que cada socio confirmó por correo (datosVentajas.ts y datosCanje.ts):
// nada de horarios, precios ni promesas que no estén allí.

import type { Detalle, LangDet } from './datosVentajasDetalle'

export const DETALLE_SOCIOS: Record<string, Record<LangDet, Detalle>> = {
  osakacookingbase: {
    es: {
      intro: 'Osaka Cooking Base es la cocina de Yuka, junto al santuario Tenmangu de Osaka. Enseña a hacer comida casera japonesa (okonomiyaki, ramen o gyoza) en grupos pequeños, de hasta 8 personas, y luego os la coméis juntos.',
      para: [
        'Familias o grupos de amigos de 5 a 8 personas: la clase pasa a ser privada sin coste extra.',
        'Familias musulmanas: prepara okonomiyaki o ramen sin cerdo y sin alcohol (sin mirin ni sake).',
        'Un día tranquilo en Osaka entre visita y visita, aprendiendo algo que podrás repetir en casa.',
      ],
      pasos: [
        'Abre su web con el botón de esta página y elige plato y fecha.',
        'Si sois de 5 a 8, pide la clase privada: no cuesta más.',
        'Si necesitas comida sin cerdo ni alcohol, dilo al reservar y pregunta por el caldo dashi.',
        'Si vienes de tour conmigo, avísame: entro gratis a traducir.',
      ],
      consejos: [
        'El dashi (caldo japonés) puede llevar pescado: pregúntalo antes si te importa.',
        'Máximo 8 personas por clase; para grupos más grandes, escríbeme y lo hablamos con Yuka.',
      ],
      precio: 'El precio de cada clase sale en su web al reservar; de 5 a 8 personas, la clase privada no tiene recargo.',
    },
    en: {
      intro: 'Osaka Cooking Base is Yuka’s kitchen next to Tenmangu Shrine in Osaka. She teaches home-style Japanese cooking (okonomiyaki, ramen or gyoza) in small groups of up to 8, and then you eat what you made together.',
      para: [
        'Families or groups of friends of 5 to 8: the class becomes private at no extra charge.',
        'Muslim families: she makes okonomiyaki or ramen with no pork and no alcohol (no mirin or sake).',
        'A relaxed break in Osaka between sights, learning a dish you can cook again at home.',
      ],
      pasos: [
        'Open their website with the button on this page and choose a dish and date.',
        'If you are 5 to 8 people, ask for the private class: it costs the same.',
        'If you need food with no pork or alcohol, say so when booking and ask about the dashi stock.',
        'If you are on a tour with me, tell me: I join free to translate.',
      ],
      consejos: [
        'Dashi (Japanese stock) can contain fish: ask in advance if it matters to you.',
        'Up to 8 people per class; for bigger groups, message me and we will ask Yuka.',
      ],
      precio: 'Each class price is shown on their website when you book; for 5 to 8 people the private class has no surcharge.',
    },
    ar: {
      intro: 'Osaka Cooking Base هو مطبخ يوكا بجانب ضريح تينمانغو في أوساكا. تعلّم الطبخ الياباني المنزلي (أوكونومياكي أو رامن أو غيوزا) في مجموعات صغيرة حتى 8 أشخاص، ثم تأكلون معاً ما حضّرتموه.',
      para: [
        'العائلات أو مجموعات الأصدقاء من 5 إلى 8 أشخاص: يصبح الدرس خاصاً دون تكلفة إضافية.',
        'العائلات المسلمة: تحضّر أوكونومياكي أو رامن بلا لحم خنزير وبلا كحول (بلا ميرين ولا ساكي).',
        'استراحة هادئة في أوساكا بين الزيارات، وتتعلّم طبقاً تعيد طبخه في البيت.',
      ],
      pasos: [
        'افتح موقعهم من زر هذه الصفحة واختر الطبق والتاريخ.',
        'إن كنتم من 5 إلى 8 أشخاص، اطلبوا الدرس الخاص: السعر نفسه.',
        'إن احتجت طعاماً بلا خنزير ولا كحول، اذكر ذلك عند الحجز واسأل عن مرق الداشي.',
        'إن كنت في جولة معي، أخبرني: أدخل مجاناً للترجمة.',
      ],
      consejos: [
        'الداشي (المرق الياباني) قد يحتوي على سمك: اسأل مسبقاً إن كان ذلك يهمّك.',
        'الحد الأقصى 8 أشخاص في الدرس؛ للمجموعات الأكبر راسلني ونسأل يوكا.',
      ],
      precio: 'سعر كل درس يظهر في موقعهم عند الحجز؛ من 5 إلى 8 أشخاص الدرس الخاص بلا زيادة.',
    },
    ru: {
      intro: 'Osaka Cooking Base — кухня Юки рядом со святилищем Тэммангу в Осаке. Она учит готовить японскую домашнюю еду (окономияки, рамен или гёдза) в маленьких группах до 8 человек, а потом всё приготовленное едят вместе.',
      para: [
        'Семьи и компании из 5–8 человек: занятие становится частным без доплаты.',
        'Мусульманские семьи: окономияки или рамен без свинины и без алкоголя (без мирина и сакэ).',
        'Спокойная пауза в Осаке между прогулками и блюдо, которое можно повторить дома.',
      ],
      pasos: [
        'Откройте их сайт кнопкой на этой странице и выберите блюдо и дату.',
        'Если вас 5–8 человек, попросите частное занятие — цена та же.',
        'Если нужна еда без свинины и алкоголя, напишите об этом при бронировании и спросите про бульон даси.',
        'Если вы на экскурсии с нами, скажите — переводим бесплатно.',
      ],
      consejos: [
        'Даси (японский бульон) может быть на рыбе — уточните заранее, если это важно.',
        'До 8 человек на занятии; для больших групп напишите нам, спросим у Юки.',
      ],
      precio: 'Цена занятия видна на их сайте при бронировании; для 5–8 человек частное занятие без доплаты.',
    },
  },

  unplugged: {
    es: {
      intro: 'Unplugged organiza salidas en kayak de mar por Amakusa (Kumamoto), entre islas deshabitadas del Parque Nacional Unzen-Amakusa, con un guía local. La ruta termina en una isla de arena blanca hecha de conchas, donde puedes bañarte.',
      para: [
        'Quien viaja por Kyushu y quiere un día de naturaleza y mar, lejos de las ciudades.',
        'Parejas y familias que buscan una actividad tranquila con fotos del día incluidas (Tarde Premium).',
        'Quien ya ha visto templos de sobra y quiere otra cara de Japón.',
      ],
      pasos: [
        'Abre su formulario de reserva con el botón de esta página.',
        'Reserva con al menos 3 días de antelación.',
        'En observaciones escribe «Tony Kansai Guide　Tony Hanma»: así tienes 500 ¥ menos por persona.',
        'El día de la salida pagas allí, en efectivo, con PayPay o con tarjeta.',
      ],
      consejos: [
        'Está a 1 h 30 en coche de Kumamoto: calcula el trayecto.',
        'La Mañana Simple empieza en marzo; la Tarde Premium sale a las 13:00.',
      ],
      precio: 'Tarde Premium (13:00): 10.000 ¥ por persona entre semana y 11.000 ¥ en fin de semana, con fotos y vídeo. Mañana Simple (9:00, desde marzo): 8.000 / 9.000 ¥. Con mi nombre, 500 ¥ menos por persona.',
    },
    en: {
      intro: 'Unplugged runs sea kayak trips in Amakusa (Kumamoto), between uninhabited islands of Unzen-Amakusa National Park, with a local guide. The route ends on a white shell-sand island where you can swim.',
      para: [
        'Travellers in Kyushu who want a day of nature and sea, away from the cities.',
        'Couples and families looking for a calm activity with photos of the day included (Afternoon Premium).',
        'Anyone who has seen plenty of temples and wants another side of Japan.',
      ],
      pasos: [
        'Open their booking form with the button on this page.',
        'Book at least 3 days ahead.',
        'In the remarks write “Tony Kansai Guide　Tony Hanma” to get ¥500 off per person.',
        'Pay on the day: cash, PayPay or card.',
      ],
      consejos: [
        'It is about 1.5 h by car from Kumamoto: plan the drive.',
        'Morning Simple starts in March; Afternoon Premium leaves at 13:00.',
      ],
      precio: 'Afternoon Premium (13:00): ¥10,000 per person on weekdays, ¥11,000 at weekends, with photos and video. Morning Simple (9:00, from March): ¥8,000 / ¥9,000. With my name, ¥500 off per person.',
    },
    ar: {
      intro: 'تنظّم Unplugged رحلات كاياك بحري في أماكوسا (كوماموتو)، بين جزر غير مأهولة في حديقة أونزن-أماكوسا الوطنية، مع مرشد محلي. وتنتهي الرحلة على جزيرة رملها أبيض من الأصداف، يمكنك السباحة فيها.',
      para: [
        'من يزور كيوشو ويريد يوماً في الطبيعة والبحر بعيداً عن المدن.',
        'الأزواج والعائلات الباحثون عن نشاط هادئ مع صور اليوم (برنامج بعد الظهر Premium).',
        'من رأى ما يكفي من المعابد ويريد وجهاً آخر لليابان.',
      ],
      pasos: [
        'افتح استمارة الحجز من زر هذه الصفحة.',
        'احجز قبل 3 أيام على الأقل.',
        'في خانة الملاحظات اكتب «Tony Kansai Guide　Tony Hanma» لتحصل على خصم 500 ين للشخص.',
        'تدفع يوم الرحلة: نقداً أو PayPay أو بالبطاقة.',
      ],
      consejos: [
        'تبعد ساعة ونصف بالسيارة عن كوماموتو: احسب الطريق.',
        'البرنامج الصباحي Simple يبدأ في مارس؛ وبرنامج بعد الظهر Premium ينطلق الساعة 13:00.',
      ],
      precio: 'بعد الظهر Premium (13:00): 10,000 ين للشخص في أيام الأسبوع و11,000 ين في عطلة نهاية الأسبوع، مع صور وفيديو. الصباح Simple (9:00، من مارس): 8,000 / 9,000 ين. وباسمي خصم 500 ين للشخص.',
    },
    ru: {
      intro: 'Unplugged проводит прогулки на морских каяках в Амакусе (Кумамото) между необитаемыми островами национального парка Ундзэн-Амакуса с местным гидом. Маршрут заканчивается на острове с белым песком из ракушек, где можно искупаться.',
      para: [
        'Тем, кто едет по Кюсю и хочет день природы и моря вдали от городов.',
        'Парам и семьям, которым нужна спокойная активность с фото дня (Afternoon Premium).',
        'Тем, кто уже видел много храмов и хочет другую Японию.',
      ],
      pasos: [
        'Откройте их форму бронирования кнопкой на этой странице.',
        'Бронируйте минимум за 3 дня.',
        'В примечаниях напишите «Tony Kansai Guide　Tony Hanma» — скидка 500 иен с человека.',
        'Оплата на месте: наличными, PayPay или картой.',
      ],
      consejos: [
        'Около 1,5 ч на машине от Кумамото — учтите дорогу.',
        'Утренний Simple — с марта; Afternoon Premium стартует в 13:00.',
      ],
      precio: 'Afternoon Premium (13:00): 10 000 иен с человека в будни и 11 000 иен в выходные, с фото и видео. Morning Simple (9:00, с марта): 8000 / 9000 иен. С нашим именем — минус 500 иен с человека.',
    },
  },

  hakusan: {
    es: {
      intro: 'En Hakusan, cerca de Kanazawa (Ishikawa), un artesano te enseña a hacer y pintar una cabeza de león de Kaga (shishi-gashira) en miniatura, una tradición de 400 años. Es tan pequeña que te la llevas colgada, como un netsuke.',
      para: [
        'Quien va a Kanazawa y quiere llevarse un recuerdo hecho con sus manos.',
        'Grupos de hasta 20 personas, familias incluidas.',
        'Quien busca artesanía japonesa de verdad, explicada por quien la hace.',
      ],
      pasos: [
        'Escribe a hakusan@urara-hakusanbito.com con la fecha y cuántos sois.',
        'Hazlo con al menos un mes de antelación.',
        'Si vienes conmigo, dímelo: traduzco al español o al árabe sin coste.',
      ],
      consejos: [
        'Un mes de antelación es el mínimo: en temporada alta, escribe antes.',
        'Combínalo con la visita al santuario Shirayama Hime, también en Hakusan.',
      ],
      precio: '6.600 ¥ por persona, hasta 20 personas.',
    },
    en: {
      intro: 'In Hakusan, near Kanazawa (Ishikawa), a craftsperson shows you how to make and paint a small Kaga lion head (shishi-gashira), a 400-year-old tradition. It is small enough to carry with you, like a netsuke.',
      para: [
        'Visitors to Kanazawa who want a souvenir made with their own hands.',
        'Groups of up to 20, families included.',
        'Anyone looking for real Japanese craft, explained by the person who makes it.',
      ],
      pasos: [
        'Email hakusan@urara-hakusanbito.com with your date and group size.',
        'Do it at least one month ahead.',
        'Coming with me? Tell me: I translate into Spanish or Arabic at no cost.',
      ],
      consejos: [
        'One month ahead is the minimum: in high season, write earlier.',
        'Combine it with the visit to Shirayama Hime Shrine, also in Hakusan.',
      ],
      precio: '¥6,600 per person, up to 20 people.',
    },
    ar: {
      intro: 'في هاكوسان، قرب كانازاوا (إيشيكاوا)، يعلّمك حِرَفي كيف تصنع وتلوّن رأس أسد كاغا (شيشي-غاشيرا) صغيراً، وهي حرفة عمرها 400 عام. حجمه صغير تحمله معك كتعليقة (نِتسوكي).',
      para: [
        'من يزور كانازاوا ويريد تذكاراً صنعه بيديه.',
        'مجموعات حتى 20 شخصاً، والعائلات مرحّب بها.',
        'من يبحث عن حرفة يابانية حقيقية يشرحها صانعها.',
      ],
      pasos: [
        'راسل hakusan@urara-hakusanbito.com بالتاريخ وعدد الأشخاص.',
        'افعل ذلك قبل شهر على الأقل.',
        'إن كنت قادماً معي أخبرني: أترجم إلى العربية أو الإسبانية مجاناً.',
      ],
      consejos: [
        'الشهر هو الحد الأدنى: في الموسم المزدحم راسلهم قبل ذلك.',
        'اجمعها مع زيارة ضريح شيراياما هيمي في هاكوسان أيضاً.',
      ],
      precio: '6,600 ين للشخص، حتى 20 شخصاً.',
    },
    ru: {
      intro: 'В Хакусане, рядом с Канадзавой (Исикава), мастер покажет, как сделать и расписать маленькую голову льва Кага (сиси-гасира) — традиции 400 лет. Она настолько маленькая, что её можно носить с собой, как нэцкэ.',
      para: [
        'Тем, кто едет в Канадзаву и хочет сувенир своими руками.',
        'Группам до 20 человек, с детьми тоже.',
        'Тем, кто ищет настоящее японское ремесло из первых рук.',
      ],
      pasos: [
        'Напишите на hakusan@urara-hakusanbito.com дату и число участников.',
        'Минимум за месяц.',
        'Если вы с нами — скажите, переведём бесплатно.',
      ],
      consejos: [
        'Месяц — это минимум: в сезон пишите раньше.',
        'Совместите с визитом в святилище Сираяма-химэ, тоже в Хакусане.',
      ],
      precio: '6600 иен с человека, до 20 человек.',
    },
  },

  hakusansanpai: {
    es: {
      intro: 'Visita guiada de una hora al santuario Shirayama Hime, en Hakusan (cerca de Kanazawa), con más de 2.000 años de historia. Entras en el pabellón principal, donde normalmente no pasa el visitante, y ves la danza tradicional de una miko, la doncella del santuario.',
      para: [
        'Quien quiere entender el sintoísmo desde dentro y no solo hacer fotos desde fuera.',
        'Grupos pequeños: hasta 4 personas pagan un precio cerrado por grupo.',
        'Un plan tranquilo de una hora para un día en Kanazawa.',
      ],
      pasos: [
        'Escribe a hakusan@urara-hakusanbito.com con la fecha y cuántos sois.',
        'Reserva con al menos un mes de antelación.',
        'Si vienes de viaje conmigo, lo encajo en la ruta y traduzco yo.',
      ],
      consejos: [
        'Es un lugar de culto activo: ropa discreta y silencio en el pabellón.',
        'Si os interesa vivir un ritual, mira también el misogi privado del mismo santuario.',
      ],
      precio: 'Hasta 4 personas: 18.150 ¥ por grupo. Desde 5: 3.630 ¥ por persona.',
    },
    en: {
      intro: 'A one-hour guided visit to Shirayama Hime Shrine in Hakusan, near Kanazawa, with over 2,000 years of history. You enter the main hall and watch a traditional dance by a miko, a shrine maiden.',
      para: [
        'Anyone who wants to understand Shinto from the inside, not just take photos outside.',
        'Small groups: up to 4 people pay one fixed price per group.',
        'A calm one-hour plan for a day in Kanazawa.',
      ],
      pasos: [
        'Email hakusan@urara-hakusanbito.com with your date and group size.',
        'Book at least one month ahead.',
        'Travelling with me? I fit it into the route and translate.',
      ],
      consejos: [
        'It is an active place of worship: modest clothing and quiet in the hall.',
        'If you want to take part in a ritual, see the private misogi at the same shrine.',
      ],
      precio: 'Up to 4 people: ¥18,150 per group. 5 or more: ¥3,630 per person.',
    },
    ar: {
      intro: 'زيارة بإرشاد لمدة ساعة إلى ضريح شيراياما هيمي في هاكوسان قرب كانازاوا، وتاريخه يتجاوز 2000 عام. تدخل القاعة الرئيسية وتشاهد رقصة تقليدية تؤديها «ميكو»، خادمة الضريح.',
      para: [
        'من يريد فهم الشنتو من الداخل لا التصوير من الخارج فقط.',
        'المجموعات الصغيرة: حتى 4 أشخاص بسعر ثابت للمجموعة.',
        'برنامج هادئ لساعة واحدة ضمن يوم في كانازاوا.',
      ],
      pasos: [
        'راسل hakusan@urara-hakusanbito.com بالتاريخ وعدد الأشخاص.',
        'احجز قبل شهر على الأقل.',
        'إن كنت مسافراً معي، أضعها في المسار وأترجم بنفسي.',
      ],
      consejos: [
        'إنه مكان عبادة قائم: لباس محتشم وهدوء داخل القاعة.',
        'هذه زيارة ثقافية للمشاهدة والتعرّف، دون أي مشاركة في الطقوس.',
      ],
      precio: 'حتى 4 أشخاص: 18,150 ين للمجموعة. من 5 فأكثر: 3,630 ين للشخص.',
    },
    ru: {
      intro: 'Часовая экскурсия по святилищу Сираяма-химэ в Хакусане, рядом с Канадзавой, которому больше 2000 лет. Вы заходите в главный зал и смотрите традиционный танец мико — жрицы святилища.',
      para: [
        'Тем, кто хочет понять синтоизм изнутри, а не только фотографировать снаружи.',
        'Небольшим группам: до 4 человек — одна цена за группу.',
        'Спокойный план на час в день поездки в Канадзаву.',
      ],
      pasos: [
        'Напишите на hakusan@urara-hakusanbito.com дату и число участников.',
        'Бронируйте минимум за месяц.',
        'Если вы путешествуете с нами, впишем в маршрут и переведём.',
      ],
      consejos: [
        'Это действующее святилище: скромная одежда и тишина в зале.',
        'Хотите участвовать в обряде — посмотрите частный мисоги в том же святилище.',
      ],
      precio: 'До 4 человек: 18 150 иен за группу. От 5: 3630 иен с человека.',
    },
  },

  hakusanmisogi: {
    es: {
      intro: 'El misogi es el ritual sintoísta de purificación con agua. En el santuario Shirayama Hime de Hakusan (cerca de Kanazawa) se hace en privado: un sacerdote te explica la tradición y después lo vives tú. Dura 2 h 30 min.',
      para: [
        'Viajeros que buscan una experiencia espiritual japonesa auténtica, no un espectáculo.',
        'Grupos de hasta 5 personas con precio cerrado (ampliable).',
        'Quien ya conoce Kioto y busca algo que casi nadie hace.',
      ],
      pasos: [
        'Escribe a hakusan@urara-hakusanbito.com con la fecha y cuántos sois.',
        'Reserva con al menos un mes de antelación.',
        'Si viajas conmigo, organizo el día y traduzco al español o al árabe.',
      ],
      consejos: [
        'La ropa para el ritual, el guía, el seguro y los impuestos van incluidos.',
        'Es un rito religioso sintoísta: valora si encaja con tus creencias antes de reservar.',
      ],
      precio: '57.750 ¥ hasta 5 personas y 11.550 ¥ por cada persona más, con guía, ropa, seguro e impuestos incluidos.',
    },
    en: {
      intro: 'Misogi is the Shinto purification ritual with water. At Shirayama Hime Shrine in Hakusan, near Kanazawa, it is held privately: a Shinto priest explains the tradition and then you take part yourself. It lasts 2 h 30 min.',
      para: [
        'Travellers looking for an authentic Japanese spiritual experience, not a show.',
        'Groups of up to 5 at a fixed price (more can join).',
        'Anyone who already knows Kyoto and wants something almost nobody does.',
      ],
      pasos: [
        'Email hakusan@urara-hakusanbito.com with your date and group size.',
        'Book at least one month ahead.',
        'Travelling with me? I plan the day and translate into Spanish or Arabic.',
      ],
      consejos: [
        'Ritual clothing, guide, insurance and taxes are included.',
        'It is a Shinto religious rite: consider whether it suits your beliefs before booking.',
      ],
      precio: '¥57,750 for up to 5 people and ¥11,550 for each extra person, including guide, clothing, insurance and taxes.',
    },
    ar: {
      intro: 'الميسوغي طقس تطهير بالماء في ديانة الشنتو. في ضريح شيراياما هيمي في هاكوسان قرب كانازاوا يُقام بشكل خاص: يشرح كاهن التقليد ثم يشارك فيه الزائر. مدته ساعتان ونصف.',
      para: [
        'المسافرون المهتمون بمعرفة الثقافة الدينية اليابانية عن قرب.',
        'مجموعات حتى 5 أشخاص بسعر ثابت (ويمكن إضافة المزيد).',
        'من يعرف كيوتو ويبحث عن تجربة نادرة.',
      ],
      pasos: [
        'راسل hakusan@urara-hakusanbito.com بالتاريخ وعدد الأشخاص.',
        'احجز قبل شهر على الأقل.',
        'إن كنت مسافراً معي، أنظّم اليوم وأترجم.',
      ],
      consejos: [
        'الملابس والمرشد والتأمين والضرائب مشمولة.',
        'إنه طقس ديني شنتوي وليس نشاطاً سياحياً عادياً: إن كان لا يناسب معتقدك فاختر زيارة الضريح بإرشاد بدلاً منه.',
      ],
      precio: '57,750 ين حتى 5 أشخاص و11,550 ين لكل شخص إضافي، شاملة المرشد والملابس والتأمين والضرائب.',
    },
    ru: {
      intro: 'Мисоги — синтоистский обряд очищения водой. В святилище Сираяма-химэ в Хакусане, рядом с Канадзавой, его проводят частно: священник объясняет традицию, а затем вы участвуете сами. Длительность — 2 ч 30 мин.',
      para: [
        'Тем, кто ищет настоящий японский духовный опыт, а не шоу.',
        'Группам до 5 человек по фиксированной цене (можно больше).',
        'Тем, кто уже знает Киото и хочет то, что почти никто не делает.',
      ],
      pasos: [
        'Напишите на hakusan@urara-hakusanbito.com дату и число участников.',
        'Бронируйте минимум за месяц.',
        'Если вы путешествуете с нами, организуем день и переведём.',
      ],
      consejos: [
        'Одежда для обряда, гид, страховка и налоги включены.',
        'Это религиозный синтоистский обряд — решите заранее, подходит ли он вам.',
      ],
      precio: '57 750 иен до 5 человек и 11 550 иен за каждого следующего, включая гида, одежду, страховку и налоги.',
    },
  },

  foodsample: {
    es: {
      intro: 'En el Food Sample Making Cafe de Asakusa (Tokio) haces tus propias réplicas de comida japonesa de plástico, como las de los escaparates de los restaurantes. Te las llevas a casa como recuerdo.',
      para: [
        'Familias con niños: es manual, divertido y el resultado se lo llevan.',
        'Un plan a cubierto para un día de lluvia en Tokio.',
        'Quien quiere un recuerdo de Japón que no se compra en cualquier tienda.',
      ],
      pasos: [
        'Abre su web con el botón de esta página y reserva en TableCheck.',
        'En el campo «PROMO CODE» escribe TONY10 para tener un 10 % menos.',
        'Si sois familia musulmana, elige el plan sin comida.',
      ],
      consejos: [
        'La comida que sirven no es halal: por eso existe el plan sin comida.',
        'Está en Asakusa: combínalo con el templo Senso-ji.',
      ],
      precio: 'El precio de cada plan sale en TableCheck al reservar; con TONY10, un 10 % menos.',
    },
    en: {
      intro: 'At the Food Sample Making Cafe in Asakusa (Tokyo) you make your own Japanese plastic food replicas, like the ones in restaurant windows. You take them home as a souvenir.',
      para: [
        'Families with children: hands-on, fun, and they keep what they make.',
        'An indoor plan for a rainy day in Tokyo.',
        'Anyone who wants a Japan souvenir you cannot buy in any shop.',
      ],
      pasos: [
        'Open their website with the button on this page and book on TableCheck.',
        'In the “PROMO CODE” field enter TONY10 for 10% off.',
        'Muslim families: choose the plan without a meal.',
      ],
      consejos: [
        'The meals they serve are not halal: that is why there is a no-meal plan.',
        'It is in Asakusa: combine it with Senso-ji Temple.',
      ],
      precio: 'Each plan’s price is shown on TableCheck when you book; with TONY10, 10% off.',
    },
    ar: {
      intro: 'في Food Sample Making Cafe في أساكوسا (طوكيو) تصنع بنفسك مجسّمات الطعام الياباني البلاستيكية، مثل التي تراها في واجهات المطاعم، وتأخذها معك تذكاراً.',
      para: [
        'العائلات مع الأطفال: عمل يدوي ممتع ويأخذون ما صنعوه.',
        'برنامج داخلي ليوم ممطر في طوكيو.',
        'من يريد تذكاراً من اليابان لا يُشترى من أي متجر.',
      ],
      pasos: [
        'افتح موقعهم من زر هذه الصفحة واحجز عبر TableCheck.',
        'في خانة «PROMO CODE» اكتب TONY10 لخصم 10 %.',
        'للعائلات المسلمة: اختاروا البرنامج بدون وجبة.',
      ],
      consejos: [
        'الوجبات التي يقدّمونها ليست حلالاً، ولهذا يوجد برنامج بدون وجبة.',
        'المكان في أساكوسا: اجمعه مع معبد سينسو-جي.',
      ],
      precio: 'سعر كل برنامج يظهر في TableCheck عند الحجز؛ ومع TONY10 خصم 10 %.',
    },
    ru: {
      intro: 'В Food Sample Making Cafe в Асакусе (Токио) вы сами делаете пластиковые копии японских блюд, как в витринах ресторанов, и забираете их домой на память.',
      para: [
        'Семьям с детьми: руками, весело, и всё сделанное — с собой.',
        'План под крышей на дождливый день в Токио.',
        'Тем, кто хочет сувенир из Японии, которого нет в магазинах.',
      ],
      pasos: [
        'Откройте их сайт кнопкой на этой странице и бронируйте в TableCheck.',
        'В поле «PROMO CODE» введите TONY10 — скидка 10 %.',
        'Мусульманским семьям — тариф без еды.',
      ],
      consejos: [
        'Еда у них не халяль, поэтому есть тариф без еды.',
        'Это Асакуса: совместите с храмом Сэнсо-дзи.',
      ],
      precio: 'Цена тарифа видна в TableCheck при бронировании; с TONY10 — минус 10 %.',
    },
  },

  ninjacafe: {
    es: {
      intro: 'Ninja Experience Cafe es un café-taller donde te vistes de ninja y aprendes a usar sus armas, como el shuriken y la cerbatana. Tiene tiendas en Dotonbori (Osaka), Gion (Kioto) y en Harajuku y Asakusa (Tokio).',
      para: [
        'Familias con niños que quieren algo activo y muy japonés.',
        'Grupos grandes: hacen sesiones privadas de 15 a 20 personas.',
        'Un plan de una tarde en el centro de Osaka, Kioto o Tokio.',
      ],
      pasos: [
        'Abre su web con el botón de esta página y elige la tienda.',
        'Reserva en TableCheck y escribe TONY10 en el campo «PROMO CODE»: 10 % menos.',
        'Para un grupo privado de 15 a 20, pídelo por correo.',
        'Si vienes conmigo, entro gratis a traducir al español o al árabe.',
      ],
      consejos: [
        'Su curry ninja lleva salsa con certificado halal, pero el café en sí no es halal.',
        'El código vale en todas sus tiendas.',
      ],
      precio: 'El precio de cada plan sale en TableCheck; con TONY10, un 10 % menos en todas las tiendas.',
    },
    en: {
      intro: 'Ninja Experience Cafe is a café-workshop where you dress as a ninja and learn their weapons, such as the shuriken and the blowgun. It has stores in Dotonbori (Osaka), Gion (Kyoto) and Harajuku and Asakusa (Tokyo).',
      para: [
        'Families with children who want something active and very Japanese.',
        'Large groups: private sessions for 15 to 20 people.',
        'An afternoon plan in central Osaka, Kyoto or Tokyo.',
      ],
      pasos: [
        'Open their website with the button on this page and choose a store.',
        'Book on TableCheck and enter TONY10 in the “PROMO CODE” field: 10% off.',
        'For a private group of 15 to 20, ask by email.',
        'Coming with me? I join free to translate into Spanish or Arabic.',
      ],
      consejos: [
        'Their Ninja Curry uses a halal-certified sauce, but the café itself is not halal-certified.',
        'The code works at all their stores.',
      ],
      precio: 'Each plan’s price is shown on TableCheck; with TONY10, 10% off at every store.',
    },
    ar: {
      intro: 'Ninja Experience Cafe مقهى وورشة ترتدي فيه زيّ النينجا وتتعلّم أسلحتهم مثل الشوريكن والنفّاخة. له فروع في دوتونبوري (أوساكا) وغيون (كيوتو) وهاراجوكو وأساكوسا (طوكيو).',
      para: [
        'العائلات مع الأطفال الباحثة عن نشاط حركي ياباني جداً.',
        'المجموعات الكبيرة: جلسات خاصة من 15 إلى 20 شخصاً.',
        'برنامج لبعد الظهر في وسط أوساكا أو كيوتو أو طوكيو.',
      ],
      pasos: [
        'افتح موقعهم من زر هذه الصفحة واختر الفرع.',
        'احجز عبر TableCheck واكتب TONY10 في خانة «PROMO CODE»: خصم 10 %.',
        'للمجموعة الخاصة من 15 إلى 20 شخصاً، اطلبها بالبريد.',
        'إن كنت قادماً معي، أدخل مجاناً للترجمة إلى العربية أو الإسبانية.',
      ],
      consejos: [
        'كاري النينجا عندهم بصلصة حاصلة على شهادة حلال، لكن المقهى نفسه غير حاصل على شهادة حلال.',
        'الرمز صالح في كل فروعهم.',
      ],
      precio: 'سعر كل برنامج يظهر في TableCheck؛ ومع TONY10 خصم 10 % في كل الفروع.',
    },
    ru: {
      intro: 'Ninja Experience Cafe — кафе-мастерская, где вы переодеваетесь в ниндзя и учитесь обращаться с их оружием: сюрикенами и духовой трубкой. Есть филиалы в Дотонбори (Осака), Гионе (Киото), Харадзюку и Асакусе (Токио).',
      para: [
        'Семьям с детьми, которым нужно что-то активное и очень японское.',
        'Большим группам: частные сессии на 15–20 человек.',
        'План на полдня в центре Осаки, Киото или Токио.',
      ],
      pasos: [
        'Откройте их сайт кнопкой на этой странице и выберите филиал.',
        'Бронируйте в TableCheck и введите TONY10 в поле «PROMO CODE» — минус 10 %.',
        'Частную группу на 15–20 человек заказывают по почте.',
        'Если вы с нами — переводим бесплатно.',
      ],
      consejos: [
        'Их карри ниндзя — с халяль-сертифицированным соусом, но само кафе не халяль.',
        'Код действует во всех филиалах.',
      ],
      precio: 'Цена видна в TableCheck; с TONY10 — минус 10 % во всех филиалах.',
    },
  },

  koto: {
    es: {
      intro: 'Koto Workshop Hiroshima es un taller para descubrir el koto, el arpa tradicional japonesa, a un minuto de la Cúpula de la Bomba Atómica. Escuchas su sonido, entiendes su historia y lo tocas tú, en grupos de hasta 10 personas.',
      para: [
        'Quien visita Hiroshima y quiere un momento sereno después del Parque de la Paz.',
        'Familias y grupos de hasta 10 personas.',
        'Amantes de la música que quieren tocar un instrumento japonés de verdad.',
      ],
      pasos: [
        'Abre su web con el botón de esta página y elige fecha.',
        'Al reservar, escribe el código kotodaisuki: 15 % menos.',
        'Si vienes de tour conmigo, entro gratis a traducir.',
      ],
      consejos: [
        'Está junto al Parque de la Paz: encaja en el mismo día que el museo.',
        'Hiroshima y Miyajima se ven mejor en un solo día; el taller cabe entre las dos visitas.',
      ],
      precio: 'El precio sale en su web al reservar; con el código kotodaisuki, un 15 % menos.',
    },
    en: {
      intro: 'Koto Workshop Hiroshima lets you discover the koto, Japan’s traditional harp, one minute from the Atomic Bomb Dome. You hear its sound, learn its story and play it yourself, in groups of up to 10.',
      para: [
        'Visitors to Hiroshima who want a calm moment after the Peace Park.',
        'Families and groups of up to 10.',
        'Music lovers who want to play a real Japanese instrument.',
      ],
      pasos: [
        'Open their website with the button on this page and choose a date.',
        'When booking, enter the code kotodaisuki: 15% off.',
        'On a tour with me? I join free to translate.',
      ],
      consejos: [
        'It is next to the Peace Park: it fits the same day as the museum.',
        'Hiroshima and Miyajima work best in a single day; the workshop fits between the two.',
      ],
      precio: 'The price is shown on their website when you book; with the code kotodaisuki, 15% off.',
    },
    ar: {
      intro: 'Koto Workshop Hiroshima ورشة لاكتشاف الكوتو، الآلة الوترية اليابانية التقليدية، على بُعد دقيقة من قبة القنبلة الذرية. تسمع صوتها وتعرف تاريخها وتعزف عليها بنفسك، في مجموعات حتى 10 أشخاص.',
      para: [
        'من يزور هيروشيما ويريد لحظة هادئة بعد حديقة السلام.',
        'العائلات والمجموعات حتى 10 أشخاص.',
        'محبّو الموسيقى الراغبون في تجربة آلة يابانية حقيقية.',
      ],
      pasos: [
        'افتح موقعهم من زر هذه الصفحة واختر التاريخ.',
        'عند الحجز اكتب الرمز kotodaisuki: خصم 15 %.',
        'إن كنت في جولة معي، أدخل مجاناً للترجمة.',
      ],
      consejos: [
        'تقع بجانب حديقة السلام: تناسب اليوم نفسه مع المتحف.',
        'هيروشيما وميياجيما أفضل في يوم واحد، والورشة تأتي بين الزيارتين.',
      ],
      precio: 'السعر يظهر في موقعهم عند الحجز؛ ومع الرمز kotodaisuki خصم 15 %.',
    },
    ru: {
      intro: 'Koto Workshop Hiroshima — мастерская, где знакомятся с кото, традиционной японской арфой, в минуте от Купола атомной бомбы. Вы слушаете её звучание, узнаёте историю и играете сами, в группах до 10 человек.',
      para: [
        'Тем, кто в Хиросиме и хочет спокойную паузу после Парка мира.',
        'Семьям и группам до 10 человек.',
        'Любителям музыки, которые хотят поиграть на настоящем японском инструменте.',
      ],
      pasos: [
        'Откройте их сайт кнопкой на этой странице и выберите дату.',
        'При бронировании введите код kotodaisuki — минус 15 %.',
        'Если вы на экскурсии с нами — переводим бесплатно.',
      ],
      consejos: [
        'Рядом с Парком мира — легко совместить с музеем в тот же день.',
        'Хиросиму и Миядзиму лучше смотреть за один день; мастерская помещается между ними.',
      ],
      precio: 'Цена видна на их сайте при бронировании; с кодом kotodaisuki — минус 15 %.',
    },
  },

  teaosaka: {
    es: {
      intro: 'Tea Ceremony Osaka ofrece una ceremonia del té de 45 minutos en Dotonbori, en pleno centro de Osaka. Te explican cada gesto, preparas tu matcha y lo tomas con dulces japoneses.',
      para: [
        'Quien está en Osaka y no tiene tiempo de ir a Kioto para una ceremonia del té.',
        'Familias musulmanas: los dulces son halal y nada lleva alcohol.',
        'Niños desde 8 años, con precio reducido de 8 a 11.',
      ],
      pasos: [
        'Abre su web con el botón de esta página y elige sesión (10, 11, 12, 14, 15 o 16 h).',
        'En el comentario de la reserva escribe «Tony Kansai Guide».',
        'Si vienes conmigo, entro contigo a traducir.',
      ],
      consejos: [
        'Hasta 10 personas por sesión: para grupos, reserva pronto.',
        'Está en Dotonbori: encaja antes o después de pasear por Namba.',
      ],
      precio: '7.480 ¥ por adulto y 4.980 ¥ de 8 a 11 años.',
    },
    en: {
      intro: 'Tea Ceremony Osaka offers a 45-minute tea ceremony in Dotonbori, right in central Osaka. They explain every gesture, you whisk your own matcha and drink it with Japanese sweets.',
      para: [
        'Anyone in Osaka without time to go to Kyoto for a tea ceremony.',
        'Muslim families: the sweets are halal and nothing contains alcohol.',
        'Children from 8, with a reduced price for ages 8 to 11.',
      ],
      pasos: [
        'Open their website with the button on this page and choose a session (10, 11, 12, 14, 15 or 16 h).',
        'In the booking comment write “Tony Kansai Guide”.',
        'Coming with me? I come in with you to translate.',
      ],
      consejos: [
        'Up to 10 people per session: groups should book early.',
        'It is in Dotonbori: fits before or after a walk around Namba.',
      ],
      precio: '¥7,480 per adult and ¥4,980 for ages 8 to 11.',
    },
    ar: {
      intro: 'تقدّم Tea Ceremony Osaka مراسم شاي لمدة 45 دقيقة في دوتونبوري، في قلب أوساكا. يشرحون كل حركة، وتحضّر الماتشا بنفسك وتشربه مع حلويات يابانية.',
      para: [
        'من هو في أوساكا وليس لديه وقت للذهاب إلى كيوتو لمراسم الشاي.',
        'العائلات المسلمة: الحلويات حلال ولا شيء يحتوي على كحول.',
        'الأطفال من 8 سنوات، بسعر مخفّض من 8 إلى 11 سنة.',
      ],
      pasos: [
        'افتح موقعهم من زر هذه الصفحة واختر الجلسة (10 أو 11 أو 12 أو 14 أو 15 أو 16).',
        'في تعليق الحجز اكتب «Tony Kansai Guide».',
        'إن كنت قادماً معي، أدخل معك للترجمة.',
      ],
      consejos: [
        'حتى 10 أشخاص في الجلسة: احجز مبكراً للمجموعات.',
        'المكان في دوتونبوري: يناسب قبل جولة في نامبا أو بعدها.',
      ],
      precio: '7,480 ين للبالغ و4,980 ين من 8 إلى 11 سنة.',
    },
    ru: {
      intro: 'Tea Ceremony Osaka проводит 45-минутную чайную церемонию в Дотонбори, в самом центре Осаки. Объясняют каждый жест, вы сами взбиваете матча и пьёте его с японскими сладостями.',
      para: [
        'Тем, кто в Осаке и не успевает в Киото на чайную церемонию.',
        'Мусульманским семьям: сладости халяль, ничего с алкоголем.',
        'Детям от 8 лет, для 8–11 лет цена ниже.',
      ],
      pasos: [
        'Откройте их сайт кнопкой на этой странице и выберите сеанс (10, 11, 12, 14, 15 или 16 ч).',
        'В комментарии к брони напишите «Tony Kansai Guide».',
        'Если вы с нами — заходим вместе и переводим.',
      ],
      consejos: [
        'До 10 человек на сеанс: группам лучше бронировать заранее.',
        'Это Дотонбори: удобно до или после прогулки по Намбе.',
      ],
      precio: '7480 иен за взрослого и 4980 иен для детей 8–11 лет.',
    },
  },

  shaquda: {
    es: {
      intro: 'SHAQUDA tiene un taller de pinceles de maquillaje en Kumano (Hiroshima), el pueblo de los pinceles de Japón. Montas tu propio pincel con sus artesanos y te lo envían terminado en unas dos semanas.',
      para: [
        'Quien quiere un regalo útil hecho a mano en Japón.',
        'Amantes del maquillaje y de la artesanía japonesa.',
        'Grupos pequeños: los de 6 se dividen en dos de 3.',
      ],
      pasos: [
        'Escríbeme por WhatsApp con la fecha y cuántos sois: lo reservo yo.',
        'Así tienes un 10 % menos y no pagas los 10.000 ¥ de intérprete, porque traduzco yo.',
        'Después del taller, te envían el pincel terminado (el envío va aparte).',
      ],
      consejos: [
        'El pincel no te lo llevas ese día: llega en unas dos semanas.',
        'Kumano está cerca de la ciudad de Hiroshima: encaja en un viaje a Hiroshima.',
      ],
      precio: 'El precio del taller lo confirmo al reservar; conmigo, 10 % menos y sin los 10.000 ¥ de intérprete. El envío se paga aparte.',
    },
    en: {
      intro: 'SHAQUDA runs a make-up brush workshop in Kumano (Hiroshima), Japan’s brush town. You assemble your own brush with their craftspeople and they ship it finished in about two weeks.',
      para: [
        'Anyone who wants a useful, handmade gift from Japan.',
        'Make-up lovers and fans of Japanese craft.',
        'Small groups: groups of 6 are split into two of 3.',
      ],
      pasos: [
        'Message me on WhatsApp with your date and group size: I book it.',
        'That way you get 10% off and skip the ¥10,000 interpreter fee, because I translate.',
        'After the workshop they ship the finished brush (shipping extra).',
      ],
      consejos: [
        'You do not take the brush home that day: it arrives in about two weeks.',
        'Kumano is close to Hiroshima city: it fits a Hiroshima trip.',
      ],
      precio: 'I confirm the workshop price when booking; through me, 10% off and no ¥10,000 interpreter fee. Shipping is paid separately.',
    },
    ar: {
      intro: 'تدير SHAQUDA ورشة فُرَش مكياج في كومانو (هيروشيما)، بلدة الفُرَش في اليابان. تركّب فرشاتك بنفسك مع حرفييهم ويرسلونها إليك جاهزة خلال أسبوعين تقريباً.',
      para: [
        'من يريد هدية مفيدة مصنوعة يدوياً في اليابان.',
        'محبّو المكياج والحرف اليابانية.',
        'المجموعات الصغيرة: مجموعة الستة تُقسم إلى مجموعتين من ثلاثة.',
      ],
      pasos: [
        'راسلني على واتساب بالتاريخ وعدد الأشخاص: أحجز لك بنفسي.',
        'هكذا تحصل على خصم 10 % ولا تدفع 10,000 ين للمترجم، لأنني أترجم.',
        'بعد الورشة يرسلون الفرشاة جاهزة (الشحن على حدة).',
      ],
      consejos: [
        'لا تأخذ الفرشاة في اليوم نفسه: تصلك خلال أسبوعين تقريباً.',
        'كومانو قريبة من مدينة هيروشيما: تناسب رحلة إلى هيروشيما.',
      ],
      precio: 'أؤكد سعر الورشة عند الحجز؛ ومعي خصم 10 % وبدون 10,000 ين للمترجم. الشحن يُدفع على حدة.',
    },
    ru: {
      intro: 'SHAQUDA проводит мастер-класс по кистям для макияжа в Кумано (Хиросима) — японском городе кистей. Вы собираете свою кисть вместе с мастерами, а готовую её присылают примерно через две недели.',
      para: [
        'Тем, кто хочет полезный подарок ручной работы из Японии.',
        'Любителям макияжа и японских ремёсел.',
        'Небольшим группам: группу из 6 делят на две по 3.',
      ],
      pasos: [
        'Напишите нам в WhatsApp дату и число участников — забронируем сами.',
        'Так вы получаете скидку 10 % и не платите 10 000 иен за переводчика — переводим мы.',
        'После мастер-класса готовую кисть присылают (доставка отдельно).',
      ],
      consejos: [
        'Кисть не забираете в тот же день: она придёт примерно через две недели.',
        'Кумано рядом с Хиросимой — удобно в поездку в Хиросиму.',
      ],
      precio: 'Цену подтверждаем при бронировании; через нас — минус 10 % и без 10 000 иен за переводчика. Доставка оплачивается отдельно.',
    },
  },

  kuchinotsu: {
    es: {
      intro: 'En Kuchinotsu, en la península de Shimabara (Nagasaki), salen en barco a ver delfines salvajes. Se embarca en su oficina, a 700 m del puerto, frente al 7-Eleven.',
      para: [
        'Familias con niños: hay precio reducido por edades y los menores de 3 van gratis.',
        'Grupos grandes: desde 10 adultos hay descuento.',
        'Quien recorre Kyushu y quiere un plan de naturaleza en el mar.',
      ],
      pasos: [
        'Abre su web con el botón de esta página y elige la salida.',
        'Si vas por tu cuenta, enseña en la recepción el logo de Tony Kansai Guide de esta web.',
        'Si sois 10 adultos o más, pide el descuento de grupo al reservar.',
      ],
      consejos: [
        'Se sale de su oficina, no del puerto: está a 700 m, frente al 7-Eleven.',
        'Lleva el móvil con esta página abierta para enseñar el logo.',
      ],
      precio: 'Adultos 4.000 ¥, de 7 a 12 años 2.000 ¥, de 4 a 6 años 1.000 ¥, menores de 3 gratis. Grupos de 10 o más adultos: 10 % menos; de 30 o más: 20 % menos.',
    },
    en: {
      intro: 'At Kuchinotsu, on the Shimabara Peninsula (Nagasaki), boats go out to see wild dolphins. You board at their office, 700 m from the port, opposite the 7-Eleven.',
      para: [
        'Families with children: reduced prices by age, and under-3s go free.',
        'Large groups: discounts from 10 adults.',
        'Travellers in Kyushu who want a nature plan at sea.',
      ],
      pasos: [
        'Open their website with the button on this page and choose a trip.',
        'Going on your own? Show the Tony Kansai Guide logo from this website at reception.',
        'If you are 10 adults or more, ask for the group discount when booking.',
      ],
      consejos: [
        'You leave from their office, not the port: 700 m away, opposite the 7-Eleven.',
        'Keep this page open on your phone to show the logo.',
      ],
      precio: 'Adults ¥4,000, ages 7–12 ¥2,000, ages 4–6 ¥1,000, 3 and under free. Groups of 10+ adults: 10% off; 30+: 20% off.',
    },
    ar: {
      intro: 'في كوتشينوتسو، في شبه جزيرة شيمابارا (ناغاساكي)، تنطلق قوارب لمشاهدة الدلافين البرية. الصعود من مكتبهم، على بُعد 700 متر من الميناء، مقابل متجر 7-Eleven.',
      para: [
        'العائلات مع الأطفال: أسعار مخفّضة حسب العمر، ومن هم دون 3 سنوات مجاناً.',
        'المجموعات الكبيرة: خصم ابتداءً من 10 بالغين.',
        'من يجول في كيوشو ويريد نشاطاً في الطبيعة والبحر.',
      ],
      pasos: [
        'افتح موقعهم من زر هذه الصفحة واختر الرحلة.',
        'إن ذهبت وحدك، أظهر في الاستقبال شعار Tony Kansai Guide من هذا الموقع.',
        'إن كنتم 10 بالغين أو أكثر، اطلبوا خصم المجموعة عند الحجز.',
      ],
      consejos: [
        'الانطلاق من مكتبهم لا من الميناء: على بُعد 700 متر، مقابل 7-Eleven.',
        'أبقِ هذه الصفحة مفتوحة في هاتفك لإظهار الشعار.',
      ],
      precio: 'البالغ 4,000 ين، من 7 إلى 12 سنة 2,000 ين، من 4 إلى 6 سنوات 1,000 ين، ودون 3 سنوات مجاناً. 10 بالغين فأكثر: خصم 10 %؛ 30 فأكثر: خصم 20 %.',
    },
    ru: {
      intro: 'В Кутиноцу, на полуострове Симабара (Нагасаки), выходят в море на лодке смотреть диких дельфинов. Посадка у их офиса, в 700 м от порта, напротив 7-Eleven.',
      para: [
        'Семьям с детьми: цены ниже по возрасту, до 3 лет бесплатно.',
        'Большим группам: скидка от 10 взрослых.',
        'Тем, кто едет по Кюсю и хочет природу и море.',
      ],
      pasos: [
        'Откройте их сайт кнопкой на этой странице и выберите выход.',
        'Если едете сами, покажите на ресепшене логотип Tony Kansai Guide с этого сайта.',
        'Если вас 10 взрослых и больше, попросите групповую скидку при бронировании.',
      ],
      consejos: [
        'Отправление от их офиса, не из порта: 700 м, напротив 7-Eleven.',
        'Держите эту страницу открытой в телефоне, чтобы показать логотип.',
      ],
      precio: 'Взрослые 4000 иен, 7–12 лет 2000 иен, 4–6 лет 1000 иен, до 3 лет бесплатно. От 10 взрослых — минус 10 %, от 30 — минус 20 %.',
    },
  },

  shiretoko: {
    es: {
      intro: 'En Shiretoko (Hokkaido), Patrimonio Mundial, organizan caminatas sobre el hielo marino a la deriva (drift ice) del 1 de febrero a mediados de marzo, y cruceros por la costa desde Utoro y Rausu.',
      para: [
        'Quien viaja a Hokkaido en invierno y quiere algo que solo existe allí.',
        'Grupos grandes: en el hielo, grupos privados de hasta unas 42 personas.',
        'Grupos desde 15 personas en los cruceros, con descuento.',
      ],
      pasos: [
        'Abre su web con el botón de esta página y elige hielo o crucero.',
        'Las reservas del hielo abren hacia noviembre: reserva pronto.',
        'Si sois 15 o más en un crucero, pide el 10 % de descuento de grupo.',
      ],
      consejos: [
        'Para caminar sobre el hielo: desde edad de primaria hasta 74 años y mínimo 130 cm de altura.',
        'La temporada del hielo es corta (del 1 de febrero a mediados de marzo).',
      ],
      precio: 'El precio de cada salida sale en su web; en los cruceros, 10 % menos desde 15 personas.',
    },
    en: {
      intro: 'In Shiretoko (Hokkaido), a World Heritage Site, they run walks on the drift ice from 1 February to mid-March, and cruises along the coast from Utoro and Rausu.',
      para: [
        'Winter travellers to Hokkaido who want something that only exists there.',
        'Large groups: private groups of up to about 42 on the ice.',
        'Groups of 15 or more on the cruises, with a discount.',
      ],
      pasos: [
        'Open their website with the button on this page and choose ice walk or cruise.',
        'Ice walk bookings open around November: book early.',
        'If you are 15 or more on a cruise, ask for the 10% group discount.',
      ],
      consejos: [
        'Ice walk: from primary-school age to 74, and at least 130 cm tall.',
        'The ice season is short (1 February to mid-March).',
      ],
      precio: 'Each trip’s price is on their website; cruises are 10% off from 15 people.',
    },
    ar: {
      intro: 'في شيريتوكو (هوكايدو)، المدرجة في التراث العالمي، تُنظَّم جولات مشي على الجليد البحري العائم من 1 فبراير حتى منتصف مارس، ورحلات بحرية على الساحل من أوتورو وراوسو.',
      para: [
        'من يزور هوكايدو في الشتاء ويريد تجربة لا توجد إلا هناك.',
        'المجموعات الكبيرة: مجموعات خاصة على الجليد حتى نحو 42 شخصاً.',
        'المجموعات من 15 شخصاً في الرحلات البحرية، مع خصم.',
      ],
      pasos: [
        'افتح موقعهم من زر هذه الصفحة واختر المشي على الجليد أو الرحلة البحرية.',
        'حجوزات الجليد تُفتح نحو نوفمبر: احجز مبكراً.',
        'إن كنتم 15 أو أكثر في رحلة بحرية، اطلبوا خصم المجموعة 10 %.',
      ],
      consejos: [
        'المشي على الجليد: من سنّ المرحلة الابتدائية حتى 74 عاماً، وبطول 130 سم على الأقل.',
        'موسم الجليد قصير (من 1 فبراير حتى منتصف مارس).',
      ],
      precio: 'سعر كل رحلة في موقعهم؛ والرحلات البحرية بخصم 10 % ابتداءً من 15 شخصاً.',
    },
    ru: {
      intro: 'В Сиретоко (Хоккайдо), объекте Всемирного наследия, проводят прогулки по дрейфующему морскому льду с 1 февраля до середины марта и морские круизы вдоль побережья из Уторо и Раусу.',
      para: [
        'Тем, кто едет на Хоккайдо зимой и хочет то, что есть только там.',
        'Большим группам: частные группы на льду примерно до 42 человек.',
        'Группам от 15 человек на круизах — со скидкой.',
      ],
      pasos: [
        'Откройте их сайт кнопкой на этой странице и выберите лёд или круиз.',
        'Бронь на лёд открывается примерно в ноябре — бронируйте заранее.',
        'Если вас 15 и больше на круизе, попросите групповую скидку 10 %.',
      ],
      consejos: [
        'Прогулка по льду: от младшего школьного возраста до 74 лет и рост от 130 см.',
        'Сезон льда короткий (с 1 февраля до середины марта).',
      ],
      precio: 'Цены на их сайте; на круизах — минус 10 % от 15 человек.',
    },
  },

  kanemasa: {
    es: {
      intro: 'En Seki (Gifu), la ciudad japonesa de las espadas, el maestro forjador Kanemasa te enseña a forjar tu propio cuchillo. La experiencia dura de 4 a 10 horas, según lo que quieras hacer.',
      para: [
        'Amantes de los cuchillos japoneses y de la tradición de las katanas.',
        'Quien quiere llevarse una pieza forjada por sus propias manos.',
        'Un día completo fuera de las rutas habituales, entre Kioto y Tokio.',
      ],
      pasos: [
        'Escríbeme por WhatsApp con la fecha y cuántos sois.',
        'Reserva con 1 o 2 semanas de antelación.',
        'Si vienes conmigo, traduzco al español o al árabe y lo organizo con el maestro.',
      ],
      consejos: [
        'Calcula el día entero: de 4 a 10 horas de forja más el viaje a Seki.',
        'Para sacar el cuchillo de Japón, mételo en la maleta facturada, nunca en la de mano.',
      ],
      precio: 'Desde 60.000 ¥ por persona, según la duración y la pieza.',
    },
    en: {
      intro: 'In Seki (Gifu), Japan’s sword town, master swordsmith Kanemasa teaches you to forge your own knife. The experience lasts 4 to 10 hours, depending on what you want to make.',
      para: [
        'Lovers of Japanese knives and the katana tradition.',
        'Anyone who wants to take home a piece forged with their own hands.',
        'A full day off the usual routes, between Kyoto and Tokyo.',
      ],
      pasos: [
        'Message me on WhatsApp with your date and group size.',
        'Book 1 to 2 weeks ahead.',
        'Coming with me? I translate into Spanish or Arabic and arrange it with the master.',
      ],
      consejos: [
        'Plan the whole day: 4 to 10 hours of forging plus the trip to Seki.',
        'To take the knife out of Japan, pack it in checked luggage, never in your carry-on.',
      ],
      precio: 'From ¥60,000 per person, depending on duration and the piece.',
    },
    ar: {
      intro: 'في سيكي (غيفو)، مدينة السيوف اليابانية، يعلّمك الحدّاد المعلّم كانيماسا كيف تطرق سكينك بنفسك. تستغرق التجربة من 4 إلى 10 ساعات حسب ما تريد صنعه.',
      para: [
        'محبّو السكاكين اليابانية وتقاليد الكاتانا.',
        'من يريد أن يعود بقطعة طرقها بيديه.',
        'يوم كامل بعيداً عن المسارات المعتادة، بين كيوتو وطوكيو.',
      ],
      pasos: [
        'راسلني على واتساب بالتاريخ وعدد الأشخاص.',
        'احجز قبل أسبوع إلى أسبوعين.',
        'إن كنت قادماً معي، أترجم إلى العربية أو الإسبانية وأنسّق مع المعلّم.',
      ],
      consejos: [
        'خصّص اليوم كله: من 4 إلى 10 ساعات من الطرق إضافة إلى الطريق إلى سيكي.',
        'لإخراج السكين من اليابان ضعها في الحقيبة المشحونة، لا في حقيبة اليد.',
      ],
      precio: 'من 60,000 ين للشخص، حسب المدة والقطعة.',
    },
    ru: {
      intro: 'В Сэки (Гифу), японском городе мечей, мастер-кузнец Канэмаса научит вас выковать собственный нож. Длительность — от 4 до 10 часов, в зависимости от изделия.',
      para: [
        'Любителям японских ножей и традиции катаны.',
        'Тем, кто хочет увезти вещь, выкованную своими руками.',
        'Полный день вне привычных маршрутов, между Киото и Токио.',
      ],
      pasos: [
        'Напишите нам в WhatsApp дату и число участников.',
        'Бронируйте за 1–2 недели.',
        'Если вы с нами — переводим и договариваемся с мастером.',
      ],
      consejos: [
        'Закладывайте весь день: 4–10 часов ковки плюс дорога до Сэки.',
        'Нож вывозите только в сдаваемом багаже, не в ручной клади.',
      ],
      precio: 'От 60 000 иен с человека, в зависимости от длительности и изделия.',
    },
  },

  cookingsunosaka: {
    es: {
      intro: 'Cooking Sun Osaka da clases de cocina japonesa en inglés junto a Namba (Osaka). Hay clase compartida de hasta 8 personas, clase privada de 1 a 8 y clase privada de grupo de hasta 12.',
      para: [
        'Quien se aloja en Namba y quiere aprender cocina japonesa sin desplazarse.',
        'Familias musulmanas: cocinan sin cerdo ni alcohol (ni sake ni mirin) si se pide antes.',
        'Vegetarianos: hay opción vegetariana si se pide con antelación.',
      ],
      pasos: [
        'La clase compartida se reserva en su web, con el botón de esta página.',
        'La privada (de 1 a 8, o de grupo hasta 12) se pide por correo.',
        'Si necesitas comida sin cerdo ni alcohol o vegetariana, dilo al reservar.',
        'Si quieres que entre a traducir, dímelo y se lo pido yo en cada reserva.',
      ],
      consejos: [
        'Los ingredientes no tienen certificado halal, aunque cocinan sin cerdo ni alcohol si lo pides.',
        'Dirección: 1-2-4 Shiokusa, Naniwa-ku, Osaka (SUNREGIS NAMBA 202).',
      ],
      precio: 'El precio de cada clase sale en su web o te lo dan por correo para las privadas.',
    },
    en: {
      intro: 'Cooking Sun Osaka teaches Japanese cooking classes in English near Namba (Osaka). There is a shared class of up to 8, a private class for 1 to 8 and a private group class of up to 12.',
      para: [
        'Anyone staying in Namba who wants to learn Japanese cooking without travelling far.',
        'Muslim families: they cook with no pork and no alcohol (no sake or mirin) if asked in advance.',
        'Vegetarians: a vegetarian option is available on request.',
      ],
      pasos: [
        'Shared classes are booked on their website, with the button on this page.',
        'Private classes (1 to 8, or groups up to 12) are requested by email.',
        'If you need no pork, no alcohol or vegetarian food, say so when booking.',
        'If you want me inside to translate, tell me and I ask them for each booking.',
      ],
      consejos: [
        'Ingredients are not halal-certified, although they cook with no pork or alcohol on request.',
        'Address: 1-2-4 Shiokusa, Naniwa-ku, Osaka (SUNREGIS NAMBA 202).',
      ],
      precio: 'Each class price is on their website, or sent by email for private classes.',
    },
    ar: {
      intro: 'تقدّم Cooking Sun Osaka دروس طبخ ياباني بالإنجليزية بجانب نامبا (أوساكا): درس مشترك حتى 8 أشخاص، ودرس خاص من 1 إلى 8، ودرس خاص للمجموعات حتى 12.',
      para: [
        'من يقيم في نامبا ويريد تعلّم الطبخ الياباني دون تنقّل بعيد.',
        'العائلات المسلمة: يطبخون بلا خنزير وبلا كحول (بلا ساكي ولا ميرين) إن طُلب ذلك مسبقاً.',
        'النباتيون: يوجد خيار نباتي عند الطلب.',
      ],
      pasos: [
        'الدرس المشترك يُحجز من موقعهم عبر زر هذه الصفحة.',
        'الدرس الخاص (من 1 إلى 8، أو مجموعة حتى 12) يُطلب بالبريد.',
        'إن احتجت طعاماً بلا خنزير ولا كحول أو نباتياً، اذكر ذلك عند الحجز.',
        'إن أردت أن أدخل للترجمة أخبرني، وأطلب ذلك منهم في كل حجز.',
      ],
      consejos: [
        'المكوّنات غير حاصلة على شهادة حلال، مع أنهم يطبخون بلا خنزير ولا كحول عند الطلب.',
        'العنوان: 1-2-4 Shiokusa, Naniwa-ku, Osaka (SUNREGIS NAMBA 202).',
      ],
      precio: 'سعر كل درس في موقعهم، أو يرسلونه بالبريد للدروس الخاصة.',
    },
    ru: {
      intro: 'Cooking Sun Osaka проводит кулинарные классы японской кухни на английском рядом с Намбой (Осака): общий класс до 8 человек, частный на 1–8 и частный групповой до 12.',
      para: [
        'Тем, кто живёт в Намбе и хочет научиться японской кухне без дальних поездок.',
        'Мусульманским семьям: готовят без свинины и алкоголя (без сакэ и мирина), если попросить заранее.',
        'Вегетарианцам: есть вегетарианский вариант по запросу.',
      ],
      pasos: [
        'Общий класс бронируется на их сайте кнопкой на этой странице.',
        'Частный (1–8 человек или группа до 12) заказывается по почте.',
        'Если нужна еда без свинины и алкоголя или вегетарианская — напишите при бронировании.',
        'Хотите, чтобы мы переводили внутри, — скажите, попросим при каждой брони.',
      ],
      consejos: [
        'Продукты без халяль-сертификата, хотя без свинины и алкоголя по запросу готовят.',
        'Адрес: 1-2-4 Shiokusa, Naniwa-ku, Osaka (SUNREGIS NAMBA 202).',
      ],
      precio: 'Цена класса — на их сайте или по почте для частных занятий.',
    },
  },
}
