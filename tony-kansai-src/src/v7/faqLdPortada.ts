// FAQPage de las portadas /es/, /en/ y /ar/ TAL COMO ESTÁ PUBLICADO (capturado de la web el
// 21-11-2026). El rediseño cambió el texto visible de algunas preguntas (voz de empresa, sin
// «hasta 6», Tokio y el Fuji), pero el JSON-LD es lo que citan Google y las IAs y la regla del
// rediseño es no tocarlo: la prueba de SEO (seo/comparar.mjs) lo marca como cambio crítico.
// Si Tony decide publicar las preguntas nuevas también aquí, basta con dejar de usar este
// archivo en PaginaGuia.tsx (p.faq.items) y aceptar el cambio en la prueba.
// Ojo: si cambian los precios o las condiciones, hay que cambiarlos aquí también.

export const FAQ_LD_PORTADA: Partial<Record<string, { q: string; a: string }[]>> = {
  "es": [
    {
      "q": "¿Cómo se paga?",
      "a": "En efectivo, en yenes, el día del tour. Si prefieres pagar por adelantado, una vez confirmada la fecha por WhatsApp puedes hacerlo con PayPal o Wise desde los botones de Precios, o con un enlace de pago con tarjeta que te mando."
    },
    {
      "q": "¿Necesito el JR Pass?",
      "a": "Si os movéis dentro de Kansai, normalmente no. Con una tarjeta ICOCA o Suica pagáis cada tren y autobús. Pregúntame antes de comprar nada."
    },
    {
      "q": "¿Y si llueve?",
      "a": "Por ciudad salimos igual: Kansai con lluvia es precioso y hay menos gente. En montaña decido yo por seguridad; si se cancela, cambiamos de fecha o te devuelvo lo pagado."
    },
    {
      "q": "¿Podemos ir con niños?",
      "a": "Claro. Adapto el ritmo y el recorrido a su edad."
    },
    {
      "q": "¿Me recoges también en Kioto o en Nara?",
      "a": "Sí. Quedamos en el vestíbulo de tu hotel, esté en Osaka, Kioto, Nara o Kobe."
    },
    {
      "q": "¿Y si somos más de 6?",
      "a": "Los precios son para grupos de hasta 6 personas. Si sois más, escríbeme y te digo cómo lo organizamos."
    },
    {
      "q": "¿Hacéis tours de varios días?",
      "a": "Sí. Dime cuántos días tienes y qué quieres ver, y te paso un precio cerrado por todo."
    },
    {
      "q": "¿Hay guía en francés?",
      "a": "Sí. En Tokio y la región de Kanto, Nagano y Shizuoka guía Iheb, en francés; también habla árabe e inglés."
    },
    {
      "q": "¿Organizáis viajes para familias o grupos de 6 a 10 personas?",
      "a": "Sí. Antonio, coordinador del equipo, gestiona en español viajes a medida por todo Japón: guías, itinerario, hoteles, ryokan y transporte privado para grupos de más de 8. El presupuesto es a medida."
    },
    {
      "q": "¿Y si alguien tiene movilidad reducida?",
      "a": "Dímelo al reservar. Adapto el recorrido, el ritmo y el transporte; algunos templos tienen muchas escaleras y te propongo alternativas."
    },
    {
      "q": "¿Y si cambian mis planes?",
      "a": "Escríbeme. Cancelar con más de 72 horas no cuesta nada; si tu vuelo se retrasa, buscamos otro día."
    }
  ],
  "en": [
    {
      "q": "How do I pay?",
      "a": "In cash, in yen, on the day. If you prefer to pay in advance, once we have confirmed your date on WhatsApp you can use PayPal or Wise from the buttons under Prices, or a card payment link I'll send you."
    },
    {
      "q": "Do I need a JR Pass?",
      "a": "Not usually, if you're staying within Kansai. An ICOCA or Suica card covers almost every train and bus. Ask me before you buy anything."
    },
    {
      "q": "What if it rains?",
      "a": "City days go ahead: Kansai is lovely in the rain and the crowds thin out. In the mountains I make the call for safety; if we cancel, we move the date or you get your money back."
    },
    {
      "q": "Can we bring children?",
      "a": "Of course. I adapt the pace and the route to their age."
    },
    {
      "q": "Can you pick us up in Kyoto or Nara too?",
      "a": "Yes. We meet in your hotel lobby, whether you're staying in Osaka, Kyoto, Nara or Kobe."
    },
    {
      "q": "What if there are more than 6 of us?",
      "a": "Prices are for groups of up to 6. If you're more, message me and I'll tell you how we can organise it."
    },
    {
      "q": "Do you do multi-day tours?",
      "a": "Yes. Tell me how many days you have and what you'd like to see, and I'll send you one fixed price for everything."
    },
    {
      "q": "Is there a guide for Tokyo, anime and Pokémon?",
      "a": "Yes. For Tokyo and the Kanto region, Nagano and Shizuoka there is Iheb, who guides in English, French and Arabic and is a pro in anime, Japanese pop culture and Pokémon cards."
    },
    {
      "q": "Do you organise trips for families or groups of 6 to 10?",
      "a": "Yes. Antonio, the team's coordinator, arranges tailor-made trips all over Japan in Spanish: guides, itinerary, hotels, ryokan and private transport for groups of more than 8. Quotes are tailor-made."
    },
    {
      "q": "What if someone has limited mobility?",
      "a": "Tell me when you book. I adapt the route, the pace and the transport; some temples have a lot of steps and I suggest alternatives."
    },
    {
      "q": "What if my plans change?",
      "a": "Message me. Cancelling more than 72 hours ahead costs nothing, and if your flight is delayed we find another day."
    }
  ],
  "ar": [
    {
      "q": "كيف أدفع؟",
      "a": "نقداً بالين في يوم الجولة. وإن فضّلت الدفع مسبقاً، فبعد تأكيد الموعد عبر واتساب يمكنك الدفع عبر PayPal أو Wise من أزرار قسم الأسعار، أو برابط دفع بالبطاقة أرسله لك."
    },
    {
      "q": "هل يوجد طعام حلال؟",
      "a": "نعم. أنا مسلم وأعرف الأماكن الحلال الموثوقة في أوساكا وكيوتو. أخبرني عند الحجز لا في يوم الجولة."
    },
    {
      "q": "أين نصلي أثناء الجولة؟",
      "a": "في كانساي مسجد أوساكا ومسجد كوبي وجمعية كيوتو الإسلامية، وفي مطار كانساي مصليات في المبنيين. أضع وقفات الصلاة في المسار من البداية."
    },
    {
      "q": "هل أحتاج تذكرة JR Pass؟",
      "a": "في الغالب لا إذا كانت إقامتك في كانساي. بطاقة ICOCA أو Suica تكفي لمعظم القطارات والحافلات. اسألني قبل أن تشتري."
    },
    {
      "q": "هل تستقبلنا في كيوتو أو نارا أيضاً؟",
      "a": "نعم. نلتقي في بهو فندقكم، سواء كان في أوساكا أو كيوتو أو نارا أو كوبي."
    },
    {
      "q": "هل الجولة مناسبة للعائلات مع الأطفال وكبار السن؟",
      "a": "نعم. الجولة خاصة بعائلتكم وحدها، بلا أي شخص من خارجها، وبالإيقاع الذي يناسبكم. أخبرني عند الحجز بأعمار الأطفال وكبار السن، فأختار مساراً أقل مشياً ودرجاً وأضع وقفات للراحة والصلاة."
    },
    {
      "q": "وماذا لو كنا أكثر من ستة؟",
      "a": "الأسعار الثابتة لمجموعات حتى ستة أشخاص، وأرافق مجموعات أكبر حتى ١٤ شخصاً. أخبرني بعددكم وأرسل لك السعر."
    },
    {
      "q": "هل يمكن زيارة كيوتو في يوم واحد من أوساكا؟",
      "a": "نعم. كيوتو على بُعد أقل من ساعة بالقطار من أوساكا. ألتقيكم في الفندق صباحاً ونبدأ باكراً بفوشيمي إيناري قبل الزحام، وأضع الغداء الحلال ووقت الصلاة في المسار من البداية."
    },
    {
      "q": "هل يمكن أن نزور مسجد كوبي؟",
      "a": "نعم، إن أحببتم. مسجد كوبي أقدم مسجد في اليابان، ونجعله جزءاً من يوم في كوبي مع الميناء وحي كيتانو، ونصلي فيه إن وافق وقت الصلاة."
    },
    {
      "q": "هل ترافقنا إلى نارا؟",
      "a": "نعم. نارا على بُعد أقل من ساعة من أوساكا وكيوتو، ويكفيها نصف يوم: تمثال بوذا الكبير في توداي-جي والغزلان في الحديقة."
    },
    {
      "q": "كم السعر بالريال أو الدرهم؟",
      "a": "الأسعار بالين وللمجموعة كلها لا للشخص. بجانب كل سعر تجد قيمته التقريبية بالريال والدرهم بسعر الصرف اليوم، وهي للتوضيح فقط، أما الدفع فيكون بالين."
    },
    {
      "q": "هل تنظّم جولات لعدة أيام؟",
      "a": "نعم. أخبرني بعدد الأيام وما تحبون رؤيته، وأرسل لك سعراً ثابتاً للكل."
    },
    {
      "q": "هل يوجد مرشد عربي في طوكيو؟",
      "a": "نعم. في طوكيو ومنطقة كانتو وناغانو وشيزوكا يرشد إيهاب، وهو تونسي مسلم، بالعربية والفرنسية والإنجليزية، مع طعام حلال وأوقات الصلاة وبلا معابد."
    },
    {
      "q": "هل تنظمون رحلات للعائلات أو المجموعات من 6 إلى 10 أشخاص؟",
      "a": "نعم. ينظم أنطونيو، منسق الفريق، رحلات حسب الطلب في كل أنحاء اليابان بالإسبانية: مرشدون وبرنامج وفنادق وريوكان ونقل خاص للمجموعات من أكثر من 8 أشخاص. السعر حسب الطلب."
    },
    {
      "q": "وماذا لو كان أحدنا محدود الحركة؟",
      "a": "أخبرني عند الحجز. أكيّف المسار والوتيرة والمواصلات؛ بعض المعابد فيها درج كثير وأقترح بدائل."
    },
    {
      "q": "وماذا لو تغيّرت خططي؟",
      "a": "راسلني. الإلغاء قبل أكثر من ٧٢ ساعة مجاني، وإن تأخرت رحلتك نجد يوماً آخر."
    }
  ]
}
