// Páginas de destino, itinerario y prácticas de /familias/ (Antonio, coordinador en Japón).
// Mismo esquema que PAGINAS en familias-datos.mjs. Datos de terceros comprobados
// el 1-11-2026 (ver FUENTES_EXTRA al final); lo que no se pudo verificar va sin cifra.
// Regla: ningún precio de Antonio; él cotiza a medida por WhatsApp.

export const PAGINAS_EXTRA = [
  // ---------------------------------------------------------------- DESTINOS
  {
    slug: 'kioto-en-familia',
    titulo: 'Kioto en familia: qué ver, cuántos días y dónde dormir',
    descripcion: 'Kioto con niños, adolescentes y abuelos: templos que les gustan, 3 o 4 días, zonas para alojarse siendo 6 a 10 y cómo moverse sin perder horas.',
    h1: 'Kioto en familia o en grupo',
    entradilla: 'Para Kioto en familia reserva 3 o 4 días, empieza las visitas famosas temprano (Fushimi Inari y Arashiyama antes de las 9) y duerme cerca de la estación de Kioto o de Shijo para no depender de los autobuses llenos. Con 6 a 10 personas, lo que más tiempo ahorra es agrupar los templos por zonas y usar transporte privado el día de los templos alejados.',
    secciones: [
      {
        h2: 'Qué ver según quién viaja',
        parrafos: ['Kioto tiene más de mil templos; con un grupo familiar basta con elegir bien cuatro o cinco zonas y no intentar verlo todo.'],
        lista: [
          'Niños: las miles de puertas rojas de Fushimi Inari (subir solo un tramo ya merece la pena), el bosque de bambú y los monos de Arashiyama, y vestirse con kimono una mañana.',
          'Adolescentes: Gion al atardecer, las calles empedradas de Ninenzaka y Sannenzaka, y el mercado de Nishiki para probar dulces y comida callejera.',
          'Abuelos: el Pabellón Dorado (Kinkaku-ji, de 9:00 a 17:00), los jardines de los templos zen y el paseo del Filósofo, llano y tranquilo.',
          'Todos: Kiyomizu-dera con sus vistas sobre la ciudad.',
        ],
      },
      {
        h2: 'Cuántos días',
        parrafos: ['Con 3 días ves lo esencial: un día al sur y este (Fushimi Inari, Kiyomizu, Gion), uno al oeste (Arashiyama) y uno al norte (Kinkaku-ji y alrededores). Con 4 días añades una mañana tranquila o la excursión de medio día a Nara. Si tienes poco tiempo en total, mejor 2 días bien aprovechados que 4 corriendo.'],
      },
      {
        h2: 'Dónde alojarse siendo 6 a 10',
        parrafos: ['Los hoteles del centro tienen habitaciones pequeñas; para un grupo suelen funcionar mejor los apartamentos completos o las casas tradicionales (machiya) para varias personas.'],
        lista: [
          'Estación de Kioto: lo más práctico si llegas en shinkansen o haces excursiones a Nara y Osaka.',
          'Shijo y Karasuma: céntrico, con metro, tiendas y muchos sitios para comer.',
          'Gion e Higashiyama: precioso para pasear de noche, pero más caro y con calles estrechas para maletas.',
        ],
      },
      {
        h2: 'Cómo moverse en grupo',
        parrafos: ['Los autobuses urbanos van muy llenos en temporada alta y con 10 personas es fácil que no quepan todos en el mismo. El metro y los trenes (JR y Keihan) son más fiables. Para un día con varios templos alejados, el transporte privado para más de 8 que gestiona Antonio ahorra horas y piernas. Recuerda que Kioto cobra una tasa de alojamiento por persona y noche (te lo explicamos en <a href="/familias/tasas-turisticas-japon/">tasas turísticas</a>).'],
      },
      {
        h2: 'Errores típicos',
        parrafos: [],
        lista: [
          'Llegar a Fushimi Inari o Arashiyama a media mañana, cuando ya está lleno.',
          'Encadenar cinco templos al día: los niños y los mayores se cansan y todo acaba pareciendo igual.',
          'Cambiar de hotel en Kioto para ir a Osaka: están a menos de media hora en tren y puedes hacer excursiones desde la misma base.',
          'No reservar con mucha antelación el alojamiento en primavera (cerezos) y en otoño (hojas rojas).',
        ],
      },
    ],
    faq: [
      { p: '¿Cuántos días necesito en Kioto con niños?', r: 'Entre 3 y 4. Con menos de 3 tendrás que elegir entre Arashiyama y el norte de la ciudad.' },
      { p: '¿Es mejor dormir en Kioto o en Osaka?', r: 'Si te interesan sobre todo los templos, Kioto. Si viajas con adolescentes que quieren ciudad, compras o Universal Studios, Osaka. Se puede visitar una desde la otra sin cambiar de hotel.' },
      { p: '¿Hay guías en español en Kioto?', r: 'Sí. Antonio coordina guías en español para las visitas que elijas, organizados por zonas para no perder tiempo.' },
      { p: '¿Se puede ver Fushimi Inari con abuelos?', r: 'Sí. La zona de las primeras puertas es accesible y bonita; no hace falta subir la montaña entera.' },
    ],
    foto: 'kioto',
    ruta: ['Kioto'],
    relacionadas: ['nara-en-familia', 'osaka-en-familia', 'habitaciones-familia-japon', 'guia-en-espanol-japon'],
    categoria: 'destino',
  },
  {
    slug: 'osaka-en-familia',
    titulo: 'Osaka en familia: qué hacer, zonas y cuántos días',
    descripcion: 'Osaka con niños y abuelos: castillo, acuario, comida callejera y Universal Studios; cuántos días, en qué zona dormir y excursiones a Kioto, Nara y Himeji.',
    h1: 'Osaka en familia o en grupo',
    entradilla: 'Osaka es la mejor base para una familia en Kansai: tiene buenos alojamientos para grupos, comida para todos los gustos y está a menos de una hora de Kioto, Nara y Himeji. Calcula 2 días para la ciudad y suma uno más si van a Universal Studios Japan; para dormir, Namba y Umeda son las zonas más cómodas.',
    secciones: [
      {
        h2: 'Qué ver según quién viaja',
        parrafos: [],
        lista: [
          'Niños: el acuario Kaiyukan, uno de los más grandes de Japón, y la noria y el puerto de Tempozan al lado.',
          'Adolescentes: Shinsekai y su torre Tsutenkaku, las tiendas de anime y videojuegos de Den Den Town y las luces de Dotonbori para cenar comida callejera (takoyaki, okonomiyaki).',
          'Abuelos: el castillo de Osaka y su parque, y los jardines del santuario Sumiyoshi Taisha.',
          'Todos: Universal Studios Japan, si encaja (ver <a href="/familias/universal-studios-japan-en-familia/">USJ en familia</a>).',
        ],
      },
      {
        h2: 'Cuántos días',
        parrafos: ['Dos días bastan para Osaka ciudad. Lo habitual es dormir 4 o 5 noches en Osaka y hacer desde allí excursiones de un día a Kioto, Nara o Himeji, sin mover maletas.'],
      },
      {
        h2: 'Dónde alojarse siendo 6 a 10',
        parrafos: [],
        lista: [
          'Namba: cerca de Dotonbori, con tren directo al aeropuerto de Kansai y a Nara.',
          'Umeda (estación de Osaka): el gran nudo de trenes; cómodo para ir a Kioto y Shin-Osaka (shinkansen).',
          'Bahía de Osaka: práctico solo si el viaje gira en torno a Universal Studios.',
        ],
      },
      {
        h2: 'Cómo moverse en grupo',
        parrafos: ['El metro de Osaka es rápido y con tarjeta ICOCA cada uno paga lo suyo al pasar. En las horas punta de la mañana los vagones van llenos; con carritos o abuelos, empieza después de las 9:30. Osaka también tiene una tasa de alojamiento por persona y noche.'],
      },
      {
        h2: 'Errores típicos',
        parrafos: [],
        lista: [
          'Dormir en Kioto y Osaka a la vez sin necesidad: elige una base.',
          'Ir a Dotonbori a la hora de cenar un fin de semana con 10 personas sin plan: cuesta encontrar mesa; elige comida callejera o un sitio grande.',
          'Dejar Universal Studios para el último día del viaje sin margen por si llueve.',
        ],
      },
    ],
    faq: [
      { p: '¿Merece la pena Osaka con niños?', r: 'Sí. El acuario, el castillo, la comida callejera y Universal Studios suelen ser de lo que más les gusta del viaje.' },
      { p: '¿Se puede ir de Osaka a Kioto en el día?', r: 'Sí, en tren se tarda menos de una hora según la línea y la estación de salida.' },
      { p: '¿Gestiona Antonio las cenas en Osaka?', r: 'No gestiona comidas ni reservas de restaurantes, pero te orienta sobre dónde comer en grupo. Lo tienes en <a href="/familias/comer-en-japon-en-grupo/">comer en Japón en grupo</a>.' },
    ],
    foto: 'osaka',
    ruta: ['Osaka'],
    relacionadas: ['universal-studios-japan-en-familia', 'kioto-en-familia', 'nara-en-familia', 'comer-en-japon-en-grupo'],
    categoria: 'destino',
  },
  {
    slug: 'tokio-en-familia',
    titulo: 'Tokio en familia: barrios, qué ver y dónde dormir',
    descripcion: 'Tokio con niños, adolescentes y abuelos: barrios que gustan a cada uno, 3 o 4 días, dónde dormir siendo 6 a 10, y qué entradas reservar antes (Ghibli).',
    h1: 'Tokio en familia o en grupo',
    entradilla: 'Tokio en familia se disfruta con 3 o 4 días, organizando cada jornada por barrios cercanos entre sí (Asakusa con Ueno, Shibuya con Harajuku) en lugar de cruzar la ciudad varias veces. Duerme cerca de una estación de la línea Yamanote y compra con antelación lo que se agota, como el Museo Ghibli.',
    secciones: [
      {
        h2: 'Qué ver según quién viaja',
        parrafos: [],
        lista: [
          'Niños: el Museo Ghibli en Mitaka (solo con reserva previa), el zoo y los museos de Ueno, y Odaiba con su robot gigante.',
          'Adolescentes: el cruce de Shibuya, la calle Takeshita de Harajuku, Akihabara para anime y videojuegos, y un mirador como el Shibuya Sky.',
          'Abuelos: el templo Senso-ji de Asakusa, el santuario Meiji y los jardines del Palacio Imperial.',
          'Todos: un paseo en barco por el río Sumida o una tarde en Tokyo Disney (ver <a href="/familias/tokyo-disney-en-familia/">Tokyo Disney en familia</a>).',
        ],
      },
      {
        h2: 'Entradas que hay que reservar antes',
        parrafos: ['El Museo Ghibli solo admite visitantes con entrada comprada antes: no se vende en la puerta. Las entradas de cada mes salen el día 10 del mes anterior a las 10:00 (hora de Japón) en Lawson Ticket, y para fechas populares se acaban pronto. Los miradores como el Shibuya Sky venden por franjas horarias en su web; las del atardecer son las que antes se agotan.'],
      },
      {
        h2: 'Dónde alojarse siendo 6 a 10',
        parrafos: ['Busca apartamentos o habitaciones conectadas cerca de una estación de la línea Yamanote, que da la vuelta al centro.'],
        lista: [
          'Tokio Estación y Ginza: cómodo para el shinkansen y para salir hacia Hakone o el Fuji.',
          'Shinjuku: muchas opciones y salida directa hacia Hakone y Kawaguchiko.',
          'Asakusa y Ueno: más tranquilo y con buenas opciones para familias.',
        ],
      },
      {
        h2: 'Cómo moverse en grupo',
        parrafos: ['El metro y la línea Yamanote llegan a todo, con ICOCA (sirve también en Tokio). Las estaciones grandes como Shinjuku son laberintos: decide un punto de encuentro por si alguien se pierde. Evita las horas punta de 7:30 a 9:30 con carritos o maletas.'],
      },
      {
        h2: 'Errores típicos',
        parrafos: [],
        lista: [
          'Cruzar Tokio de punta a punta varias veces al día.',
          'Contar con comprar entradas del Museo Ghibli al llegar.',
          'Dejar Tokio para el final sin un día de margen antes del vuelo.',
        ],
      },
    ],
    faq: [
      { p: '¿Cuántos días necesito en Tokio con niños?', r: 'Entre 3 y 4 días para la ciudad, más uno por cada día de parque (Disneyland o DisneySea).' },
      { p: '¿Cómo consigo entradas para el Museo Ghibli?', r: 'Solo con antelación, en Lawson Ticket, a partir del día 10 del mes anterior a las 10:00 hora de Japón. No se venden en el museo.' },
      { p: '¿Antonio organiza Tokio o solo Kansai?', r: 'Todo Japón. Coordina guías, itinerario y hoteles en Tokio igual que en Kioto u Osaka.' },
    ],
    foto: 'tokio',
    ruta: ['Tokio'],
    relacionadas: ['tokyo-disney-en-familia', 'hakone-y-monte-fuji-en-familia', 'habitaciones-familia-japon', 'tarjeta-icoca-japon'],
    categoria: 'destino',
  },
  {
    slug: 'nara-en-familia',
    titulo: 'Nara en familia: ciervos, Gran Buda y cómo ir en el día',
    descripcion: 'Nara con niños y abuelos: los ciervos del parque, el Gran Buda de Todai-ji, cuánto tiempo dedicarle y cómo llegar desde Kioto u Osaka en grupo.',
    h1: 'Nara en familia o en grupo',
    entradilla: 'Nara se ve muy bien en un día, o incluso en media jornada, desde Kioto u Osaka. Lo esencial está concentrado en un parque llano: los ciervos que se acercan a pedir galletas, el Gran Buda del templo Todai-ji y el santuario Kasuga Taisha con sus faroles. Es de los días favoritos de los niños y cómodo para los abuelos.',
    secciones: [
      {
        h2: 'Qué ver según quién viaja',
        parrafos: [],
        lista: [
          'Niños: dar de comer a los ciervos con las galletas especiales que se venden en el parque (shika senbei). Los ciervos hacen una reverencia antes de comer.',
          'Adolescentes: el Gran Buda de bronce dentro del Daibutsuden de Todai-ji y el agujero en una columna por el que, según la tradición, trae suerte pasar.',
          'Abuelos: el paseo entre faroles de piedra hasta Kasuga Taisha y el jardín Isuien.',
          'Todos: la calle comercial de Naramachi, con casas antiguas de comerciantes.',
        ],
      },
      {
        h2: 'Cuánto tiempo y cómo llegar',
        parrafos: ['Medio día basta para el parque, Todai-ji y Kasuga Taisha; un día entero si quieres ir sin prisa o añadir Naramachi. Desde Kioto y desde Osaka hay trenes directos (de Kintetsu y de JR); la estación Kintetsu Nara queda más cerca del parque. El Daibutsuden abre a las 8:00; llegar a primera hora evita los grupos de excursiones escolares.'],
      },
      {
        h2: 'Dónde alojarse',
        parrafos: ['La mayoría de las familias no duermen en Nara: se visita desde Kioto u Osaka. Si quieres el parque casi para ti al amanecer, hay ryokan y hoteles cerca del parque.'],
      },
      {
        h2: 'Cómo moverse siendo 6 a 10',
        parrafos: ['Una vez en el parque todo se recorre a pie. Para el grupo, lo práctico es ir en tren con ICOCA. Si vienes desde Kioto y quieres combinar Nara con Fushimi Inari, que queda de camino, el transporte privado para más de 8 permite hacer las dos cosas el mismo día sin transbordos.'],
      },
      {
        h2: 'Errores típicos',
        parrafos: [],
        lista: [
          'Llevar comida a la vista: los ciervos son muy insistentes y pueden dar algún empujón o mordisquito, sobre todo a niños pequeños.',
          'Dar a los ciervos otra comida que no sean sus galletas.',
          'Dedicarle dos días: con uno sobra para casi todas las familias.',
        ],
      },
    ],
    faq: [
      { p: '¿Los ciervos de Nara son peligrosos para los niños?', r: 'No suelen serlo, pero son animales salvajes. Enseña a los niños a dar la galleta con la mano abierta y a no esconderla; en época de cría y de celo pueden estar más nerviosos.' },
      { p: '¿Nara o Kioto?', r: 'Las dos. Nara es una excursión de un día desde Kioto u Osaka, así que no hay que elegir.' },
      { p: '¿Hay guía en español en Nara?', r: 'Sí, Antonio coordina guías en español también para Nara.' },
    ],
    foto: 'nara',
    ruta: ['Nara'],
    relacionadas: ['kioto-en-familia', 'osaka-en-familia', 'viaje-japon-con-ninos'],
    categoria: 'destino',
  },
  {
    slug: 'hakone-y-monte-fuji-en-familia',
    titulo: 'Hakone y el monte Fuji en familia: ryokan y ruta',
    descripcion: 'Hakone y Kawaguchiko con niños y abuelos: ruta en tren, barco y teleférico, cuántas noches, ryokan con onsen y cuándo se ve mejor el Fuji.',
    h1: 'Hakone y el monte Fuji en familia',
    entradilla: 'Hakone y la zona de los cinco lagos del Fuji (Kawaguchiko) son la escapada de montaña más cómoda desde Tokio: con 1 o 2 noches en un ryokan con aguas termales, tu familia vive la parte tradicional de Japón. El Fuji no siempre se ve; las mañanas frías y despejadas de otoño e invierno son las mejores, así que conviene no dejarlo todo a un único día.',
    secciones: [
      {
        h2: 'Qué ver según quién viaja',
        parrafos: [],
        lista: [
          'Niños: el barco pirata del lago Ashi y el teleférico sobre el valle volcánico de Owakudani, con sus huevos negros cocidos en las aguas sulfurosas.',
          'Adolescentes: el museo al aire libre de Hakone, con esculturas para tocar y escalar, y la pagoda Chureito de Kawaguchiko con el Fuji detrás.',
          'Abuelos: el santuario de Hakone junto al lago y una tarde de onsen en el ryokan.',
          'Todos: dormir en futones y cenar comida tradicional de la casa.',
        ],
      },
      {
        h2: 'Hakone o Kawaguchiko',
        parrafos: ['Hakone tiene más variedad (lago, volcán, museos) y muchos ryokan con onsen; el Fuji se ve de lejos. Kawaguchiko ofrece las vistas más famosas del Fuji, pero menos que hacer si está nublado. Con 2 noches puedes hacer una en cada zona; con transporte privado para más de 8, el traslado entre ambas es sencillo.'],
      },
      {
        h2: 'Cómo moverse',
        parrafos: ['El circuito clásico de Hakone combina tren de montaña, funicular, teleférico y barco, y el Hakone Freepass de Odakyu los cubre; el tren Romancecar desde Shinjuku necesita un suplemento aparte. Ojo a las obras: Odakyu anuncia el teleférico cerrado entre Owakudani y Sounzan del 7 al 24 de diciembre de 2026, y entre Togendai y Owakudani del 12 de enero al 26 de febrero de 2027, con autobuses de sustitución que suelen ir llenos. Owakudani también puede cerrar por gases volcánicos.'],
      },
      {
        h2: 'Dónde alojarse siendo 6 a 10',
        parrafos: ['Un ryokan es la mejor opción: las habitaciones de tatami admiten a varias personas y muchos tienen baños privados (kashikiri) para reservar en familia. Antonio gestiona ryokan en montaña y el transporte privado para llegar. Más detalles en <a href="/familias/ryokan-y-montana-en-familia/">ryokan y montaña en familia</a>.'],
      },
      {
        h2: 'Errores típicos',
        parrafos: [],
        lista: [
          'Hacer Hakone como excursión de un día desde Tokio: es posible, pero se pierde el ryokan y se corre.',
          'Subir con todas las maletas: mejor enviarlas al siguiente hotel y llevar una bolsa pequeña.',
          'Ir solo por ver el Fuji en un día nublado sin plan alternativo.',
        ],
      },
    ],
    faq: [
      { p: '¿Cuántas noches en Hakone con niños?', r: 'Una o dos. Una noche da para el circuito y el ryokan; dos, para hacerlo con calma o combinar con Kawaguchiko.' },
      { p: '¿Cuándo se ve mejor el monte Fuji?', r: 'En los meses fríos y por la mañana temprano. En verano suele estar cubierto por nubes.' },
      { p: '¿Se puede subir al Fuji con niños?', r: 'La temporada de ascenso es corta, en verano, y es una caminata exigente. Para la mayoría de las familias es mejor verlo desde Hakone o Kawaguchiko.' },
    ],
    foto: 'hakone',
    ruta: ['Hakone', 'Kawaguchiko'],
    relacionadas: ['ryokan-y-montana-en-familia', 'tokio-en-familia', 'transporte-privado-japon', 'japon-vip-a-medida'],
    categoria: 'destino',
  },
  {
    slug: 'takayama-y-shirakawago-en-familia',
    titulo: 'Takayama y Shirakawa-go en familia: Alpes japoneses',
    descripcion: 'Takayama y Shirakawa-go con niños y abuelos: casco antiguo, mercados, casas gassho, cuántas noches, ryokan y cómo llegar siendo un grupo de 6 a 10.',
    h1: 'Takayama y Shirakawa-go en familia',
    entradilla: 'Takayama y Shirakawa-go son el Japón rural de montaña: un casco antiguo de casas de madera, mercados por la mañana y una aldea de tejados de paja en forma de manos en oración. Para una familia, lo ideal son 2 noches en Takayama con una visita a Shirakawa-go, sabiendo que el autobús entre ambos pide reserva y que en invierno hay nieve.',
    secciones: [
      {
        h2: 'Qué ver según quién viaja',
        parrafos: [],
        lista: [
          'Niños: los mercados matutinos junto al río, el pueblo de Hida no Sato con casas antiguas y la nieve en Shirakawa-go en invierno.',
          'Adolescentes: el mirador de Shirakawa-go sobre la aldea y las calles de Sanmachi Suji para probar ternera de Hida en brocheta.',
          'Abuelos: el antiguo edificio de gobierno Takayama Jinya y el museo de las carrozas del festival.',
          'Todos: dormir en un ryokan con onsen de montaña.',
        ],
      },
      {
        h2: 'Cómo llegar',
        parrafos: ['A Takayama se llega con el expreso limitado Hida desde Nagoya, en algo más de dos horas según el tren. De Takayama a Shirakawa-go hay unos 50 minutos en el autobús de Nohi, que en la mayoría de horarios exige reserva previa. Desde Shirakawa-go se puede seguir hacia Kanazawa. Para un grupo de más de 8, el transporte privado que gestiona Antonio resuelve los tramos sin depender del autobús y con el equipaje dentro.'],
      },
      {
        h2: 'Cuántas noches y dónde dormir',
        parrafos: ['Dos noches en Takayama, en ryokan o en un hotel con habitaciones grandes. Dormir en una casa gassho de Shirakawa-go es posible en pocos alojamientos y con plazas muy limitadas; para 6 a 10 personas casi siempre es mejor hacer la aldea de día.'],
      },
      {
        h2: 'Estaciones',
        parrafos: ['En invierno la aldea nevada es preciosa, pero hay que llevar calzado para nieve y contar con posibles retrasos por carreteras cortadas. En primavera y otoño hay festivales en Takayama que llenan los hoteles; reserva pronto.'],
      },
      {
        h2: 'Errores típicos',
        parrafos: [],
        lista: [
          'Ir a Shirakawa-go sin reserva de autobús en temporada alta.',
          'Hacer Takayama y Shirakawa-go en un solo día desde Kioto u Osaka: son muchas horas de transporte.',
          'Olvidar que en invierno anochece temprano en la montaña.',
        ],
      },
    ],
    faq: [
      { p: '¿Cuántos días para Takayama y Shirakawa-go?', r: 'Dos noches en Takayama permiten ver la ciudad con calma y dedicar un día a Shirakawa-go.' },
      { p: '¿Hay que reservar el autobús a Shirakawa-go?', r: 'En la mayoría de los horarios de Nohi, sí. Con un grupo grande, el transporte privado evita depender de las plazas.' },
      { p: '¿Es buena idea ir en invierno con niños?', r: 'Sí, si van bien abrigados y con margen en el itinerario por si la nieve retrasa algún traslado.' },
    ],
    foto: 'shirakawago',
    ruta: ['Takayama', 'Shirakawa-go'],
    relacionadas: ['ryokan-y-montana-en-familia', 'transporte-privado-japon', 'itinerario-japon-14-dias-familia'],
    categoria: 'destino',
  },
  {
    slug: 'kanazawa-en-familia',
    titulo: 'Kanazawa en familia: Kenroku-en, Higashi Chaya y más',
    descripcion: 'Kanazawa con niños, adolescentes y abuelos: el jardín Kenroku-en, el barrio de Higashi Chaya, el museo del siglo XXI, cuántos días y cómo llegar.',
    h1: 'Kanazawa en familia o en grupo',
    entradilla: 'Kanazawa es la ciudad tradicional de la costa del mar de Japón: uno de los jardines más famosos del país, un barrio de casas de té de madera y un museo de arte contemporáneo que encanta a los niños. Con 1 o 2 noches se ve con calma, y encaja de maravilla entre los Alpes japoneses (Takayama y Shirakawa-go) y Kioto.',
    secciones: [
      {
        h2: 'Qué ver según quién viaja',
        parrafos: [],
        lista: [
          'Niños: el museo de Arte Contemporáneo del Siglo XXI, con obras que se tocan y se recorren, y el mercado de Omicho con su pescado y su fruta.',
          'Adolescentes: Higashi Chaya, el barrio de casas de té de madera, y probar un helado cubierto de pan de oro, que es la especialidad de la ciudad.',
          'Abuelos: el jardín Kenroku-en, amplio y con caminos cómodos, y el parque del castillo de Kanazawa justo al lado.',
          'Todos: el barrio samurái de Nagamachi, con sus muros de barro y sus canales.',
        ],
      },
      {
        h2: 'Kenroku-en y el museo del siglo XXI',
        parrafos: [
          'Kenroku-en abre todo el año: de 7:00 a 18:00 del 1 de marzo al 15 de octubre, y de 8:00 a 17:00 del 16 de octubre a finales de febrero. La entrada cuesta 320 ¥ para adultos y 100 ¥ de 6 a 17 años. Muy temprano por la mañana se puede entrar gratis por algunas puertas, una buena opción si la familia madruga.',
          'El museo del siglo XXI tiene una zona pública gratuita abierta de 9:00 a 22:00, y salas de exposición de pago de 10:00 a 18:00 (hasta las 20:00 viernes y sábados) que cierran los lunes. Está cerca de Kenroku-en, así que se pueden ver los dos en la misma mañana. Ojo: el museo cierra por reforma del 6 de mayo de 2027 a marzo de 2028, así que para viajes en esas fechas conviene sustituirlo por otra visita.',
        ],
      },
      {
        h2: 'Cómo llegar',
        parrafos: ['Desde Tokio, el shinkansen de Hokuriku llega a Kanazawa en unas 2 horas y media. Desde Kioto u Osaka se va en el expreso limitado Thunderbird hasta Tsuruga y allí se cambia al shinkansen, en total unas 2 horas desde Kioto. Desde Takayama hay autobús pasando por Shirakawa-go. Para un grupo de más de 8, el transporte privado que gestiona Antonio permite hacer Shirakawa-go y Kanazawa el mismo día con el equipaje dentro.'],
      },
      {
        h2: 'Cuántas noches y dónde dormir',
        parrafos: ['Una noche basta para Kenroku-en, el museo y Higashi Chaya; con dos se añade Nagamachi, el mercado y una tarde tranquila. Para 6 a 10 personas, lo más cómodo es dormir cerca de la estación de Kanazawa o en la zona de Korinbo, a pocos minutos en autobús de todo.'],
      },
      {
        h2: 'Errores típicos',
        parrafos: [],
        lista: [
          'Ir al museo del siglo XXI un lunes esperando ver las exposiciones: ese día solo abre la zona gratuita.',
          'Dejar Kenroku-en para última hora de la tarde en invierno, cuando cierra a las 17:00.',
          'No contar con el cambio de tren en Tsuruga al venir desde Kioto u Osaka con maletas y niños.',
        ],
      },
    ],
    faq: [
      { p: '¿Cuántos días necesito en Kanazawa con niños?', r: 'Entre 1 y 2 noches. Con una se ve lo principal; con dos se va sin prisas.' },
      { p: '¿Cómo se combina Kanazawa con Takayama y Shirakawa-go?', r: 'Es la ruta clásica: Takayama, la aldea de Shirakawa-go de camino y Kanazawa al final, para seguir después hacia Kioto.' },
      { p: '¿Hay guías en español en Kanazawa?', r: 'Sí. Antonio coordina guías en español por todo Japón, también en Kanazawa.' },
    ],
    foto: 'kanazawa',
    ruta: ['Kanazawa'],
    relacionadas: ['takayama-y-shirakawago-en-familia', 'itinerario-japon-14-dias-familia', 'kioto-en-familia', 'transporte-privado-japon'],
    categoria: 'destino',
  },
  {
    slug: 'hiroshima-y-miyajima-en-familia',
    titulo: 'Hiroshima y Miyajima en familia: qué ver y cómo ir',
    descripcion: 'Hiroshima y Miyajima con niños, adolescentes y abuelos: museo de la Paz, el torii en el mar, cuántos días, dónde dormir y cómo llegar en shinkansen.',
    h1: 'Hiroshima y Miyajima en familia',
    entradilla: 'Hiroshima y la isla de Miyajima se ven bien en un día largo desde Osaka o Kioto, pero con una noche en Hiroshima la familia va sin prisas. El Parque de la Paz y su museo son una visita intensa y valiosa para adolescentes y adultos; Miyajima, con su torii en el mar y sus ciervos, encanta a los más pequeños.',
    secciones: [
      {
        h2: 'Qué ver según quién viaja',
        parrafos: [],
        lista: [
          'Niños: el ferri a Miyajima, los ciervos de la isla y el gran torii que con la marea alta parece flotar.',
          'Adolescentes: el Museo Conmemorativo de la Paz y la Cúpula de la Bomba Atómica, que ayudan a entender la historia del siglo XX.',
          'Abuelos: el santuario Itsukushima y el jardín Shukkei-en en Hiroshima.',
          'Todos: probar el okonomiyaki al estilo de Hiroshima, con fideos.',
        ],
      },
      {
        h2: 'El museo de la Paz con niños',
        parrafos: ['Algunas salas muestran objetos y fotografías duros. Con niños pequeños, valora visitar el parque y dejar que entren al museo solo los mayores, o hacer un recorrido corto. La entrada cuesta 200 ¥ para adultos y es gratis hasta secundaria; abre a las 7:30 y de septiembre a noviembre cierra a las 19:00 (a las 18:00 de diciembre a febrero). El museo recomienda comprar la entrada en su web para no hacer cola.'],
      },
      {
        h2: 'Cómo llegar y moverse',
        parrafos: ['Desde Shin-Osaka el shinkansen tarda en torno a 1 hora y media, según el tren. Del centro de Hiroshima a Miyajima se va en tren hasta Miyajimaguchi y de allí en ferri, unos 10 minutos. Al cruzar se paga la tasa de visitante de Miyajima, de 100 ¥ por persona, que va incluida en el billete del ferri. Los billetes de shinkansen los compras tú; Antonio puede coordinar transporte privado en Hiroshima para grupos de más de 8.'],
      },
      {
        h2: 'Dónde alojarse',
        parrafos: ['Cerca de la estación de Hiroshima o del Parque de la Paz. Dormir en Miyajima es especial (la isla se vacía al atardecer), pero hay menos plazas para grupos grandes.'],
      },
      {
        h2: 'Errores típicos',
        parrafos: [],
        lista: [
          'No mirar la tabla de mareas: el torii se ve distinto con marea alta y baja.',
          'Querer hacer Hiroshima, Miyajima y volver a Tokio en el mismo día.',
          'Llevar a niños pequeños a todas las salas del museo sin preparación.',
        ],
      },
    ],
    faq: [
      { p: '¿Hiroshima en el día desde Osaka o Kioto?', r: 'Se puede, en shinkansen, pero es un día muy largo con niños. Con una noche en Hiroshima, se disfruta más.' },
      { p: '¿Cuánto cuesta entrar en Miyajima?', r: 'Hay una tasa de visitante de 100 ¥ por persona que se paga junto al billete del ferri. Los niños en edad preescolar están exentos.' },
      { p: '¿Es apropiado el museo de la Paz para niños?', r: 'Para adolescentes, sí, y es muy recomendable. Con niños pequeños, mejor un recorrido corto o solo el parque.' },
    ],
    foto: 'miyajima',
    ruta: ['Hiroshima', 'Miyajima'],
    relacionadas: ['shinkansen-en-familia', 'osaka-en-familia', 'itinerario-japon-10-dias-familia'],
    categoria: 'destino',
  },
  // ------------------------------------------------------------ ITINERARIOS
  {
    slug: 'itinerario-japon-7-dias-familia',
    titulo: 'Itinerario de Japón en 7 días en familia (ejemplo)',
    descripcion: 'Ejemplo de itinerario de 7 días por Japón en familia: Osaka, Kioto y Nara con una sola base y ritmo tranquilo. Antonio lo adapta a tu grupo.',
    h1: 'Japón en 7 días en familia: itinerario de ejemplo',
    entradilla: 'Con 7 días en familia lo más sensato es quedarse en Kansai: una sola base en Osaka o Kioto y excursiones a Kioto, Nara y, si quieres, Himeji, sin cargar maletas. Este itinerario es un ejemplo; Antonio lo adapta a las edades, los gustos y las fechas de tu grupo.',
    secciones: [
      {
        h2: 'Por qué solo Kansai en 7 días',
        parrafos: ['Añadir Tokio a una semana obliga a perder casi un día en traslados y cambios de hotel. Si llegas y sales por el aeropuerto de Kansai, en 7 días ves Osaka, Kioto y Nara con calma y te queda un día libre o de parque.'],
      },
      {
        h2: 'Qué se puede cambiar',
        parrafos: ['El día 6 puede ser Universal Studios Japan, Himeji o un día tranquilo. Si prefieres dormir en Kioto, se invierte la base y Osaka pasa a ser la excursión.'],
        lista: [
          'Con niños pequeños: más tiempo en Nara y el acuario.',
          'Con abuelos: menos templos por día y transporte privado el día de Kioto.',
          'Con adolescentes: tarde libre en Den Den Town o Universal Studios.',
        ],
      },
    ],
    dias: [
      { dia: 'Día 1', titulo: 'Llegada a Osaka', texto: 'Llegada al aeropuerto de Kansai y traslado al hotel (lo organizas tú; ver la guía del aeropuerto). Paseo corto y cena temprana para combatir el jet lag.', lugar: 'Osaka' },
      { dia: 'Día 2', titulo: 'Osaka clásica', texto: 'Castillo de Osaka por la mañana, acuario Kaiyukan por la tarde y luces de Dotonbori para cenar comida callejera.', lugar: 'Osaka' },
      { dia: 'Día 3', titulo: 'Kioto sur y este', texto: 'Fushimi Inari a primera hora, Kiyomizu-dera y las calles de Ninenzaka y Sannenzaka, atardecer en Gion.', lugar: 'Kioto' },
      { dia: 'Día 4', titulo: 'Nara', texto: 'Ciervos del parque, el Gran Buda de Todai-ji y Kasuga Taisha. Tarde libre para descansar.', lugar: 'Nara' },
      { dia: 'Día 5', titulo: 'Kioto oeste y norte', texto: 'Bosque de bambú de Arashiyama temprano, Pabellón Dorado por la tarde. Buen día para transporte privado si son más de 8.', lugar: 'Kioto' },
      { dia: 'Día 6', titulo: 'Día a elegir', texto: 'Universal Studios Japan, castillo de Himeji (abre de 9:00 a 17:00; gratis para menores de 18) o mañana tranquila y compras.', lugar: 'Osaka' },
      { dia: 'Día 7', titulo: 'Salida', texto: 'Últimas compras y traslado al aeropuerto con tiempo de sobra.', lugar: 'Osaka' },
    ],
    faq: [
      { p: '¿Se puede ver Tokio y Kioto en 7 días?', r: 'Se puede, pero con niños o abuelos se pasa mucho tiempo en trenes. Si es tu primera vez, mejor Kansai en 7 días y Tokio en otro viaje o en uno más largo.' },
      { p: '¿Este itinerario está cerrado?', r: 'No, es un ejemplo. Antonio lo adapta a tu familia, tus fechas y lo que quiere ver cada uno.' },
      { p: '¿Incluye vuelos y traslado del aeropuerto?', r: 'No. Antonio gestiona guías, itinerario, hoteles y transporte privado para más de 8; vuelos y traslado aeropuerto-hotel los resuelves tú.' },
    ],
    foto: 'fushimi',
    ruta: ['Osaka', 'Kioto', 'Nara'],
    relacionadas: ['itinerario-japon-10-dias-familia', 'osaka-en-familia', 'kioto-en-familia', 'itinerario-japon-a-medida'],
    categoria: 'itinerario',
  },
  {
    slug: 'itinerario-japon-10-dias-familia',
    titulo: 'Itinerario de Japón en 10 días en familia (ejemplo)',
    descripcion: 'Ejemplo de 10 días por Japón en familia: Tokio, Hakone con ryokan, Kioto, Nara y Osaka, con dos bases grandes. Antonio lo adapta a tu grupo.',
    h1: 'Japón en 10 días en familia: itinerario de ejemplo',
    entradilla: 'En 10 días una familia puede ver Tokio, dormir una noche en un ryokan de Hakone y terminar en Kansai (Kioto, Nara y Osaka) con solo tres cambios de alojamiento. Lo ideal es volar a Tokio y salir por Kansai, o al revés, para no deshacer camino. Es un ejemplo: Antonio ajusta ritmo, hoteles y visitas a tu grupo.',
    secciones: [
      {
        h2: 'Claves de esta ruta',
        parrafos: ['Entrar por un aeropuerto y salir por otro ahorra medio día. El tramo Tokio-Hakone-Kioto es el único con equipaje pesado; lo más cómodo es enviar las maletas grandes de un hotel a otro y llevar una bolsa pequeña para la noche en el ryokan.'],
      },
      {
        h2: 'Variantes',
        parrafos: [],
        lista: [
          'Cambiar Hakone por Kawaguchiko si la prioridad es ver el Fuji de cerca.',
          'Añadir Tokyo Disney o Universal Studios a costa de un día de ciudad.',
          'Cambiar el día de Osaka por Hiroshima y Miyajima en un día largo en shinkansen.',
        ],
      },
    ],
    dias: [
      { dia: 'Día 1', titulo: 'Llegada a Tokio', texto: 'Llegada a Narita o Haneda y traslado al hotel por tu cuenta. Tarde tranquila.', lugar: 'Tokio' },
      { dia: 'Día 2', titulo: 'Tokio tradicional', texto: 'Senso-ji en Asakusa por la mañana, paseo en barco por el río Sumida y tarde en Ueno.', lugar: 'Tokio' },
      { dia: 'Día 3', titulo: 'Tokio moderno', texto: 'Santuario Meiji, Harajuku, cruce de Shibuya y un mirador al atardecer con entrada comprada antes.', lugar: 'Tokio' },
      { dia: 'Día 4', titulo: 'Día a elegir en Tokio', texto: 'Museo Ghibli (con entrada previa), Akihabara, Odaiba o un día de Tokyo Disney.', lugar: 'Tokio' },
      { dia: 'Día 5', titulo: 'Hakone y ryokan', texto: 'Circuito de Hakone en tren de montaña, teleférico y barco por el lago Ashi (comprueba obras del teleférico). Noche en ryokan con onsen.', lugar: 'Hakone' },
      { dia: 'Día 6', titulo: 'Hacia Kioto', texto: 'Mañana tranquila en el ryokan y shinkansen a Kioto. Paseo por Gion al atardecer.', lugar: 'Kioto' },
      { dia: 'Día 7', titulo: 'Kioto sur y este', texto: 'Fushimi Inari temprano, Kiyomizu-dera y las calles de Higashiyama.', lugar: 'Kioto' },
      { dia: 'Día 8', titulo: 'Arashiyama y norte', texto: 'Bosque de bambú temprano, Pabellón Dorado por la tarde. Transporte privado si son más de 8.', lugar: 'Kioto' },
      { dia: 'Día 9', titulo: 'Nara y Osaka', texto: 'Mañana en Nara con los ciervos y el Gran Buda, tarde y noche en Osaka (castillo o Dotonbori).', lugar: 'Nara' },
      { dia: 'Día 10', titulo: 'Salida desde Kansai', texto: 'Traslado al aeropuerto de Kansai con tiempo de margen.', lugar: 'Osaka' },
    ],
    faq: [
      { p: '¿Mejor empezar por Tokio o por Kioto?', r: 'Da igual; depende de los vuelos. Lo importante es entrar por un aeropuerto y salir por el otro.' },
      { p: '¿Quién compra el shinkansen?', r: 'Tú, en smartEX o en las taquillas de JR. Antonio te dice qué tren encaja en el itinerario. Mira <a href="/familias/shinkansen-en-familia/">shinkansen en familia</a>.' },
      { p: '¿Se puede hacer con abuelos?', r: 'Sí. Se reduce el número de visitas por día y se usa transporte privado en los días de muchas paradas.' },
    ],
    foto: 'hakone',
    ruta: ['Tokio', 'Hakone', 'Kioto', 'Nara', 'Osaka'],
    relacionadas: ['itinerario-japon-7-dias-familia', 'itinerario-japon-14-dias-familia', 'hakone-y-monte-fuji-en-familia', 'shinkansen-en-familia'],
    categoria: 'itinerario',
  },
  {
    slug: 'itinerario-japon-14-dias-familia',
    titulo: 'Itinerario de Japón en 14 días en familia (ejemplo)',
    descripcion: 'Ejemplo de 14 días por Japón en familia: Tokio, Hakone, Takayama, Shirakawa-go, Kioto, Nara, Hiroshima y Osaka, con días de descanso.',
    h1: 'Japón en 14 días en familia: itinerario de ejemplo',
    entradilla: 'Con 14 días tu familia puede sumar a Tokio y Kansai los Alpes japoneses (Takayama y Shirakawa-go) y un día en Hiroshima y Miyajima, con un par de mañanas libres para descansar. Es el viaje más completo sin ir con prisas. Es un ejemplo: Antonio lo adapta a tu grupo, a la estación y a lo que quiere ver cada uno.',
    secciones: [
      {
        h2: 'Por qué funciona esta ruta',
        parrafos: ['Va de este a oeste sin volver atrás: entras por Tokio y sales por Kansai. Los tramos de montaña, donde el tren es menos práctico para un grupo con equipaje, son los mejores para el transporte privado que gestiona Antonio para más de 8.'],
      },
      {
        h2: 'Ritmo y descanso',
        parrafos: ['Hay dos días con poca actividad (el 4 y el 11). Con niños o abuelos no son un lujo: son lo que hace que el resto del viaje salga bien. En invierno, deja margen en el tramo de Takayama por la nieve.'],
      },
    ],
    dias: [
      { dia: 'Día 1', titulo: 'Llegada a Tokio', texto: 'Llegada y traslado al hotel por tu cuenta. Tarde tranquila.', lugar: 'Tokio' },
      { dia: 'Día 2', titulo: 'Asakusa y Ueno', texto: 'Senso-ji, barco por el río Sumida y el parque de Ueno.', lugar: 'Tokio' },
      { dia: 'Día 3', titulo: 'Shibuya y Harajuku', texto: 'Santuario Meiji, calle Takeshita y cruce de Shibuya; mirador al atardecer con entrada previa.', lugar: 'Tokio' },
      { dia: 'Día 4', titulo: 'Día libre o de parque', texto: 'Tokyo Disney, Museo Ghibli con entrada previa o un día suave de compras.', lugar: 'Tokio' },
      { dia: 'Día 5', titulo: 'Hakone', texto: 'Circuito de Hakone y noche en ryokan con onsen.', lugar: 'Hakone' },
      { dia: 'Día 6', titulo: 'Hacia los Alpes', texto: 'Shinkansen hasta Nagoya y expreso limitado Hida hasta Takayama, o transporte privado si son más de 8.', lugar: 'Takayama' },
      { dia: 'Día 7', titulo: 'Takayama', texto: 'Mercado de la mañana, casco antiguo de Sanmachi y Hida no Sato.', lugar: 'Takayama' },
      { dia: 'Día 8', titulo: 'Shirakawa-go y Kanazawa', texto: 'Aldea de Shirakawa-go por la mañana y llegada a Kanazawa por la tarde.', lugar: 'Shirakawa-go' },
      { dia: 'Día 9', titulo: 'Kanazawa y llegada a Kioto', texto: 'Jardín Kenroku-en y barrio de casas de té por la mañana; tren a Kioto por la tarde.', lugar: 'Kanazawa' },
      { dia: 'Día 10', titulo: 'Kioto sur y este', texto: 'Fushimi Inari temprano, Kiyomizu-dera y Gion.', lugar: 'Kioto' },
      { dia: 'Día 11', titulo: 'Arashiyama con calma', texto: 'Bosque de bambú temprano y tarde libre para descansar.', lugar: 'Kioto' },
      { dia: 'Día 12', titulo: 'Nara', texto: 'Ciervos, el Gran Buda y Kasuga Taisha; noche en Osaka.', lugar: 'Nara' },
      { dia: 'Día 13', titulo: 'Hiroshima y Miyajima', texto: 'Shinkansen a Hiroshima, Parque de la Paz y ferri a Miyajima; regreso a Osaka por la noche, o noche en Hiroshima si prefieres sin prisas.', lugar: 'Hiroshima' },
      { dia: 'Día 14', titulo: 'Salida desde Kansai', texto: 'Mañana en Osaka y traslado al aeropuerto de Kansai.', lugar: 'Osaka' },
    ],
    faq: [
      { p: '¿Es mucho cambio de hotel?', r: 'Son cinco o seis bases en 14 días. Para que no pese, se envían las maletas grandes entre hoteles y en la montaña se viaja con bolsa pequeña.' },
      { p: '¿Funciona en invierno?', r: 'Sí, y Shirakawa-go nevado es precioso, pero hay que dejar margen por si la nieve retrasa algún traslado.' },
      { p: '¿Puede Antonio quitar o añadir ciudades?', r: 'Sí. Este itinerario es un ejemplo; él lo rehace según tu familia, tus fechas y tus vuelos.' },
    ],
    foto: 'takayama',
    ruta: ['Tokio', 'Hakone', 'Takayama', 'Shirakawa-go', 'Kanazawa', 'Kioto', 'Nara', 'Hiroshima', 'Osaka'],
    relacionadas: ['itinerario-japon-10-dias-familia', 'takayama-y-shirakawago-en-familia', 'hiroshima-y-miyajima-en-familia', 'transporte-privado-japon'],
    categoria: 'itinerario',
  },
  // -------------------------------------------------------------- PRÁCTICOS
  {
    slug: 'universal-studios-japan-en-familia',
    titulo: 'Universal Studios Japan en familia: entradas y Express',
    descripcion: 'Cómo encajar Universal Studios Japan en tu viaje en familia: entradas en la web oficial, Express Pass, acceso con hora a Super Nintendo World y qué día ir.',
    h1: 'Universal Studios Japan en familia',
    entradilla: 'Universal Studios Japan (USJ) está en Osaka y pide un día entero. Compra las entradas en la web oficial con fecha, descarga la app oficial antes de ir (desde enero de 2026 la necesitas para el acceso con hora a Super Nintendo World) y, si el grupo no quiere pasar el día en colas, valora el Express Pass. Las entradas las compra la familia; Antonio encaja el día en el itinerario y deja margen por si llueve.',
    secciones: [
      {
        h2: 'Cómo encajarlo en el itinerario',
        parrafos: ['Lo más cómodo es ir desde una base en Osaka, a mitad del viaje y no el último día. Así, si llueve o alguien se encuentra mal, puedes cambiarlo por otro día sin perder el vuelo. Al día siguiente, plan suave: después de 10 o 12 horas de parque, los niños y los mayores lo agradecen.'],
      },
      {
        h2: 'Entradas: en la web oficial',
        parrafos: ['Las entradas de un día (Studio Pass) se compran en la web oficial de USJ para una fecha concreta. Las compra la propia familia; ojo con webs de reventa que no son oficiales. Revisa el calendario de precios: varía según el día.'],
      },
      {
        h2: 'Super Nintendo World y la app',
        parrafos: ['Para entrar en la zona de Super Nintendo World suele hacer falta un ticket de acceso con hora (Area Timed Entry). Hay dos formas de conseguirlo: comprar por adelantado ciertos Express Pass que lo incluyen, o pedirlo gratis en la app oficial una vez dentro del parque, sujeto a disponibilidad. Registra en la app la entrada de cada miembro del grupo antes de llegar; con 10 personas ahorra mucho tiempo en la puerta.'],
      },
      {
        h2: 'Express Pass: cuándo compensa',
        parrafos: ['El Express Pass es un complemento de pago que se suma a la entrada y permite saltar la cola normal en las atracciones que incluye. Hay varias modalidades y no todas incluyen las mismas atracciones ni el acceso a Super Nintendo World: lee qué incluye cada una antes de comprar. Compensa sobre todo en fines de semana, vacaciones y temporadas altas, o si el grupo tiene solo un día.'],
      },
      {
        h2: 'Días con menos colas',
        parrafos: ['De martes a jueves fuera de vacaciones escolares japonesas suelen ser los días más tranquilos. Evita fines de semana, festivos japoneses, la Golden Week (finales de abril y principios de mayo), las vacaciones de verano y las de fin de año. Llega antes de la apertura: la primera hora es la mejor del día.'],
      },
    ],
    faq: [
      { p: '¿Compra Antonio las entradas de USJ?', r: 'No. Las entradas y el Express Pass los compra la familia en la web oficial. Antonio encaja el día en el itinerario y te aconseja qué día elegir.' },
      { p: '¿Es imprescindible el Express Pass?', r: 'No, pero en días de mucha gente puede ser la diferencia entre subir a cinco atracciones o a diez. Compara precio y atracciones incluidas.' },
      { p: '¿Por qué dejar un día de margen?', r: 'Porque el clima o un niño cansado pueden obligar a moverlo. Si USJ es el último día del viaje, no hay plan B.' },
    ],
    foto: 'osaka',
    relacionadas: ['osaka-en-familia', 'viaje-japon-con-ninos', 'itinerario-japon-7-dias-familia'],
    categoria: 'practico',
  },
  {
    slug: 'tokyo-disney-en-familia',
    titulo: 'Tokyo Disney en familia: entradas, Premier Access y días',
    descripcion: 'Cómo encajar Tokyo Disneyland o DisneySea en tu viaje en familia: entradas con fecha en la web oficial, Premier Access, qué día ir y por qué dejar margen.',
    h1: 'Tokyo Disneyland y DisneySea en familia',
    entradilla: 'Tokyo Disney Resort tiene dos parques, Disneyland y DisneySea, y cada uno pide un día completo. Las entradas tienen fecha, precio variable según el día y se venden online desde las 14:00 (hora de Japón) dos meses antes de la visita; no cuentes con comprarlas en la puerta. Las compra la familia; Antonio encaja el día en el itinerario con margen por si cambia el tiempo.',
    secciones: [
      {
        h2: 'Disneyland o DisneySea',
        parrafos: ['Con niños pequeños, Disneyland suele encajar mejor. DisneySea es único en el mundo y gusta mucho a adolescentes y adultos. Si solo hay un día, elige según la edad de la mayoría del grupo; si hay dos, uno en cada parque.'],
      },
      {
        h2: 'Entradas: en la web oficial',
        parrafos: ['Se compran en la web o la app oficial de Tokyo Disney Resort para un día y un parque concretos. Salen a la venta cada día a las 14:00, hora de Japón, para la misma fecha dos meses después, y se pueden comprar hasta diez entradas a la vez. El precio cambia según la demanda del día. Las compra la propia familia.'],
      },
      {
        h2: 'Disney Premier Access',
        parrafos: ['Es un sistema de pago, por atracción, que se compra en la app oficial ya dentro del parque y da una hora de acceso con menos espera. Las atracciones incluidas y los precios cambian; revísalos en la app el mismo día. Para un grupo de 6 a 10, pagarlo solo en una o dos atracciones muy demandadas suele ser suficiente.'],
      },
      {
        h2: 'Cómo encajarlo y qué día ir',
        parrafos: ['El resort está en Maihama, cerca del centro de Tokio. Los días laborables fuera de vacaciones japonesas suelen tener menos gente que los fines de semana y festivos. No lo pongas el día antes del vuelo de vuelta: si llueve o hay que cambiarlo, necesitas otro día disponible.'],
      },
    ],
    faq: [
      { p: '¿Compra Antonio las entradas de Disney?', r: 'No. Las entradas y la Premier Access los compra la familia en la web y la app oficiales. Antonio te ayuda a elegir el día y lo encaja en el itinerario.' },
      { p: '¿Con cuánta antelación se compran?', r: 'Desde las 14:00, hora de Japón, dos meses antes de la fecha de visita. Para fechas de mucha demanda, cómpralas en cuanto salgan.' },
      { p: '¿Merece la pena ir a los dos parques?', r: 'Si tienes 10 días o más y a los niños les ilusiona, sí. Si tienes una semana, uno basta.' },
    ],
    foto: 'tokio',
    relacionadas: ['tokio-en-familia', 'viaje-japon-con-ninos', 'itinerario-japon-10-dias-familia'],
    categoria: 'practico',
  },
]

export const FUENTES_EXTRA = [
  { dato: 'Kenroku-en: 7:00-18:00 (1-3 a 15-10) y 8:00-17:00 (16-10 a fin de febrero), 320 ¥ adultos y 100 ¥ de 6 a 17 años, entrada gratis de madrugada', url: 'https://shiro-niwa.pref.ishikawa.lg.jp/kenrokuen-garden/info.html', comprobado: '2026-11-01' },
  { dato: 'Museo del Siglo XXI de Kanazawa: zona pública 9:00-22:00; exposiciones 10:00-18:00 (20:00 vie y sáb), cierra los lunes; cerrado por reforma del 6-5-2027 a marzo de 2028', url: 'https://www.kanazawa21.jp/data_list.php?g=7&d=5', comprobado: '2026-11-01' },
  { dato: 'Tokio-Kanazawa en shinkansen Kagayaki: unas 2 h 35 min; Kioto-Kanazawa con cambio en Tsuruga (Thunderbird + shinkansen) desde el 16-3-2024', url: 'https://www.japan-experience.com/plan-your-trip/travel-by-train/itineraries-for-japan/how-to-get-from-kyoto-to-kanazawa', comprobado: '2026-11-01' },
  { dato: 'Museo Ghibli: solo con reserva previa; venta en Lawson Ticket el día 10 a las 10:00 para el mes siguiente', url: 'https://www.ghibli-museum.jp/en/tickets/', comprobado: '2026-11-01' },
  { dato: 'Museo de la Paz de Hiroshima: horarios por temporada, 200 ¥ adultos, gratis hasta secundaria, entrada web recomendada', url: 'https://hpmmuseum.jp/?lang=eng', comprobado: '2026-11-01' },
  { dato: 'Castillo de Himeji: 2.500 ¥ adultos no residentes desde el 1-3-2026, gratis menores de 18, de 9:00 a 17:00', url: 'https://www.himejicastle.jp/en/', comprobado: '2026-11-01' },
  { dato: 'Todai-ji: Daibutsuden de 8:00 a 17:00 (noviembre)', url: 'https://www.todaiji.or.jp/en/information/', comprobado: '2026-11-01' },
  { dato: 'Kinkaku-ji: de 9:00 a 17:00', url: 'https://www.shokoku-ji.jp/en/kinkakuji/', comprobado: '2026-11-01' },
  { dato: 'Tokio-Kioto en shinkansen Nozomi: 2 h 8 min a 2 h 21 min', url: 'https://kyoto.travel/en/', comprobado: '2026-11-01' },
  { dato: 'Teleférico de Hakone: cierres del 7 al 24-12-2026 (Owakudani-Sounzan) y del 12-1 al 26-2-2027 (Togendai-Owakudani)', url: 'https://hakonetrip.odakyu-global.com/news/5949/', comprobado: '2026-11-01' },
  { dato: 'Hakone Freepass no incluye el suplemento del Romancecar', url: 'https://hakonetrip.odakyu-global.com/feature/the-complete-guide-to-the-hakone-freepass/', comprobado: '2026-11-01' },
  { dato: 'Tasa de visitante de Miyajima: 100 ¥ por persona desde el 1-10-2023, cobrada con el ferri', url: 'https://gethiroshima.com/news/miyajima-visitor-tax-starts-october-1/', comprobado: '2026-11-01' },
  { dato: 'USJ: Area Timed Entry de Super Nintendo World por app oficial dentro del parque o con ciertos Express Pass; app obligatoria desde el 5-1-2026', url: 'https://www.usj.co.jp/web/en/us/enjoy/numbered-ticket/timed-entry-ticket', comprobado: '2026-11-01' },
  { dato: 'Tokyo Disney Resort: venta online desde las 14:00 dos meses antes; hasta 10 entradas por compra', url: 'https://www.tokyodisneyresort.jp/en/ticket/purchase', comprobado: '2026-11-01' },
]
