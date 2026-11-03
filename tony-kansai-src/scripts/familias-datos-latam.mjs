// Páginas extra de /familias/ para familias y grupos de Sudamérica, Colombia y
// familias hispanas de Estados Unidos (3-11-2026). Mismo esquema que PAGINAS en
// familias-datos.mjs. Español neutro latinoamericano (tú, boleto, celular).
// Ningún precio de Antonio: él cotiza a medida por WhatsApp. De Antonio solo lo
// que consta en COORDINADOR y CONDICIONES (familias-datos.mjs).
// Visados: lista oficial del MOFA (copia de archive.org del 27-10-2026, la web
// del MOFA bloquea robots). Colombia NO está en la lista: el MOFA aconseja pedir
// visa. Perú está exento desde el 1-7-2025 solo con pasaporte electrónico.

const IATI = '<a href="https://www.iatiseguros.com/?r=28859190572940">IATI Seguros</a>'
const MOFA = '<a href="https://www.mofa.go.jp/j_info/visit/visa/short/novisa.html">lista oficial del Ministerio de Asuntos Exteriores de Japón</a>'
const QUE_HACE = 'Antonio gestiona guías en español, itinerario día a día, hoteles adecuados al tamaño del grupo, transporte privado para grupos de más de 8, noches en ryokan de montaña y una tarjeta ICOCA con 5.000 ¥ por viajero. Vuelos, seguro, traslado aeropuerto-hotel, billetes de shinkansen y comidas los resuelves tú; te orienta en cada cosa.'

export const PAGINAS_EXTRA = [
  {
    slug: 'viaje-japon-desde-colombia',
    titulo: 'Viaje a Japón desde Colombia: visa, vuelos y familia 2026',
    descripcion: 'Viajar a Japón desde Colombia en familia: por qué conviene tramitar la visa, vuelos con escala, diferencia horaria y cómo organiza Antonio el viaje.',
    h1: 'Viajar a Japón desde Colombia en familia o en grupo',
    entradilla: 'Colombia no figura en la lista de países exentos de visa de Japón, y el Ministerio de Asuntos Exteriores japonés aconseja a los colombianos tramitar la visa antes de viajar: sin ella pueden ser examinados con rigor en la frontera y se les puede negar la entrada. Por eso, para una familia o grupo colombiano, el primer paso es la visa en la Embajada de Japón en Bogotá, con meses de margen. Antonio, coordinador de viajes que vive en Japón desde hace cuatro años, organiza a medida el viaje del grupo dentro de Japón y te prepara el presupuesto por WhatsApp.',
    secciones: [
      {
        h2: '¿Los colombianos necesitan visa para Japón?',
        parrafos: [
          `En la práctica, sí. En la ${MOFA} (revisada en octubre de 2026) Colombia no aparece entre los países exentos, y una nota específica indica que se aconseja a los nacionales de Colombia obtener la visa por adelantado, porque de lo contrario serán examinados estrictamente y se les puede negar la entrada. En internet circulan textos que dicen lo contrario; la referencia que vale es la de Japón.`,
          'La visa de turismo de corta duración se tramita en la Embajada de Japón en Colombia. Los requisitos, el costo y los plazos los fija la embajada y pueden cambiar, así que consúltalos allí antes de comprar boletos. Con un grupo, revisa el pasaporte de cada persona por separado: si alguien tiene otra nacionalidad (por ejemplo, española o mexicana), puede entrar con las reglas de ese pasaporte.',
        ],
        lista: [
          'Empieza el trámite con meses de margen, sobre todo si viajan niños o varias familias.',
          'Prepara para cada viajero el itinerario, las reservas de hotel y los datos del viaje: suelen pedirse.',
          'Cuando tengas la visa, registra a todos en Visit Japan Web para pasar migración y aduana con código QR.',
        ],
      },
      {
        h2: 'Vuelos desde Bogotá y Medellín',
        parrafos: [
          'No hay vuelos directos entre Colombia y Japón. Lo habitual es una o dos escalas: en Estados Unidos, en Ciudad de México (desde donde hay vuelos directos a Tokio), en Europa o en el Golfo. El viaje total suele pasar de 20 horas.',
          'Ojo con las escalas: para hacer escala en Estados Unidos un colombiano necesita visa estadounidense, y cada país de tránsito tiene sus reglas. Elige la ruta según los documentos que ya tiene cada miembro del grupo. Si el viaje se centra en Kioto, Osaka y Nara, compara llegar a Kansai (KIX) con entrar por Tokio y bajar en shinkansen; tienes más detalles en <a href="/familias/vuelos-latinoamerica-japon-escalas/">vuelos de Latinoamérica a Japón</a>.',
        ],
      },
      {
        h2: 'Diferencia horaria y mejores fechas',
        parrafos: [
          'Japón va 14 horas por delante de Colombia todo el año (ninguno de los dos cambia la hora). Cuando en Bogotá son las 8 de la noche, en Tokio ya son las 10 de la mañana del día siguiente. Planea un primer día suave para que niños y mayores se adapten.',
          'Las vacaciones escolares de diciembre y enero coinciden con el invierno japonés: frío, pero con nieve en los Alpes japoneses y menos gente en Kioto fuera de Año Nuevo. Las de mitad de año (junio y julio) caen en la temporada de lluvias y el comienzo del verano caluroso. Si pueden elegir, la primavera (finales de marzo y abril) y el otoño (noviembre) son las épocas más bonitas, también las más llenas.',
        ],
      },
      {
        h2: 'Qué hace Antonio por tu grupo',
        parrafos: [
          QUE_HACE,
          'Antonio habla español, japonés muy bien, inglés y catalán: prepara el viaje contigo en español y trata en japonés con hoteles, ryokan, conductores y guías. Ha coordinado familias muy grandes durante muchos días. Revisa qué entra y qué no en las <a href="/familias/condiciones/">condiciones</a>.',
        ],
      },
      {
        h2: 'Seguro y dinero',
        parrafos: [
          `En Japón la atención médica para turistas se paga y puede ser cara. Contrata un seguro con buena cobertura médica para cada viajero; nosotros recomendamos ${IATI}. Lleva una tarjeta internacional y algo de efectivo en yenes: se paga mucho con tarjeta, pero templos pequeños y puestos de comida a menudo solo aceptan efectivo. Los cajeros de 7-Eleven aceptan tarjetas extranjeras.`,
        ],
      },
    ],
    faq: [
      { p: '¿Los colombianos necesitan visa para ir a Japón?', r: 'Colombia no está en la lista de exención y el Ministerio de Asuntos Exteriores de Japón aconseja a los colombianos tramitar la visa antes de viajar. Consulta requisitos y costo en la Embajada de Japón en Colombia.' },
      { p: '¿Hay vuelos directos de Colombia a Japón?', r: 'No. Se viaja con escala en Estados Unidos, México, Europa o el Golfo. Revisa si necesitas visa de tránsito en el país de escala.' },
      { p: '¿Cuántas horas de diferencia hay entre Colombia y Japón?', r: 'Japón va 14 horas por delante de Colombia todo el año.' },
      { p: '¿Antonio tramita la visa?', r: 'No. La visa la tramita cada viajero en la embajada. Antonio organiza el viaje dentro de Japón: guías, itinerario, hoteles, transporte privado para más de 8 y ryokan.' },
      { p: '¿Cuánto cuesta el viaje con Antonio?', r: 'Cada viaje se cotiza a medida. Escríbele por WhatsApp con fechas, número de personas y edades.' },
    ],
    foto: 'kioto',
    relacionadas: ['vuelos-latinoamerica-japon-escalas', 'presupuesto-viaje-japon-familia-dolares', 'viaje-japon-desde-peru', 'organizar-viaje-japon-familia'],
    categoria: 'practico',
  },
  {
    slug: 'viaje-japon-desde-argentina',
    titulo: 'Viaje a Japón desde Argentina: sin visa, vuelos y familia',
    descripcion: 'Argentinos a Japón sin visa hasta 90 días: escalas desde Buenos Aires, diferencia de 12 horas, cuándo ir según las vacaciones y cómo organiza Antonio el grupo.',
    h1: 'Viajar a Japón desde Argentina en familia o en grupo',
    entradilla: 'Los argentinos no necesitan visa para viajar a Japón como turistas: Argentina está en la lista de exención para estancias cortas de hasta 90 días, con pasaporte vigente. No hay vuelos directos, así que el viaje desde Buenos Aires se hace con una o dos escalas y Japón va 12 horas por delante. Antonio, coordinador de viajes que vive en Japón desde hace cuatro años, organiza a medida el viaje de tu familia o grupo dentro de Japón y te prepara el presupuesto por WhatsApp.',
    secciones: [
      {
        h2: 'Documentación',
        parrafos: [
          `Argentina figura en la ${MOFA}: no hace falta visa para turismo, visitas familiares o reuniones breves sin actividad remunerada, hasta 90 días. Lleva el pasaporte vigente para toda la estancia y registra a cada viajero en Visit Japan Web antes de salir para pasar migración y aduana con código QR.`,
          'Si en el grupo hay personas con otra nacionalidad, revisa cada pasaporte por separado. Y recuerda que el país de escala puede pedir su propia autorización: para hacer escala en Estados Unidos, un argentino necesita visa estadounidense, porque Argentina no está en el programa de exención de visas de ese país.',
        ],
      },
      {
        h2: 'Vuelos desde Buenos Aires',
        parrafos: [
          'Desde Ezeiza no hay vuelos directos a Japón. Las rutas más usadas pasan por Estados Unidos, Europa o el Golfo, y el viaje total suele estar entre 25 y 35 horas según las escalas. Con niños o mayores, una escala larga con noche en hotel puede hacer el viaje mucho más llevadero.',
          'Si el viaje se centra en Kioto, Osaka y Nara, compara llegar a Kansai (KIX) con entrar por Tokio. Una opción cómoda es entrar por un aeropuerto y salir por el otro. Más ideas en <a href="/familias/vuelos-latinoamerica-japon-escalas/">vuelos de Latinoamérica a Japón</a>.',
        ],
      },
      {
        h2: 'Cuándo ir según las vacaciones argentinas',
        parrafos: [
          'Las estaciones van al revés. Las vacaciones de verano de enero y febrero caen en pleno invierno japonés: frío seco en Tokio y Kioto, nieve en Takayama y Shirakawa-go, y menos turistas que en primavera. Las vacaciones de invierno de julio coinciden con el verano japonés: calor húmedo y fin de la temporada de lluvias, con festivales como el Gion Matsuri de Kioto.',
          'Si pueden elegir, la primavera japonesa (finales de marzo y abril, con los cerezos) y el otoño (noviembre, con los arces rojos) son las épocas más bonitas. Son también las más llenas: con un grupo, conviene reservar hoteles con mucha antelación.',
        ],
        lista: [
          'Enero y febrero: invierno, nieve en la montaña. Ver <a href="/familias/japon-en-invierno-con-ninos/">Japón en invierno con niños</a>.',
          'Fines de marzo y abril: sakura. Ver <a href="/familias/sakura-2027-en-familia/">sakura 2027 en familia</a>.',
          'Julio: verano, calor y festivales. Ver <a href="/familias/vacaciones-de-verano-japon-familia/">vacaciones de verano</a>.',
          'Noviembre: otoño y momiji. Ver <a href="/familias/otono-momiji-japon-familia/">otoño en familia</a>.',
        ],
      },
      {
        h2: 'Diferencia horaria y dinero',
        parrafos: [
          'Japón va 12 horas por delante de Argentina todo el año: cuando en Buenos Aires son las 9 de la noche, en Japón son las 9 de la mañana del día siguiente. Planea un primer día suave.',
          'En Japón se paga en yenes. Se usa mucho la tarjeta, pero lleva efectivo para templos pequeños, mercados y algunos restaurantes; los cajeros de 7-Eleven aceptan tarjetas extranjeras.',
        ],
      },
      {
        h2: 'Qué hace Antonio por tu grupo',
        parrafos: [
          QUE_HACE,
          `Antonio habla español, japonés muy bien, inglés y catalán, y ha coordinado familias muy grandes durante muchos días. Para el seguro de viaje recomendamos ${IATI}: en Japón la atención médica para turistas se paga. Revisa qué entra y qué no en las <a href="/familias/condiciones/">condiciones</a>.`,
        ],
      },
    ],
    faq: [
      { p: '¿Los argentinos necesitan visa para Japón?', r: 'No para turismo hasta 90 días. Argentina está en la lista de exención de visado de Japón.' },
      { p: '¿Hay vuelo directo de Buenos Aires a Japón?', r: 'No. Se viaja con escala en Estados Unidos, Europa o el Golfo. Para la escala en Estados Unidos necesitas visa estadounidense.' },
      { p: '¿Cuántas horas de diferencia hay con Japón?', r: 'Japón va 12 horas por delante de Argentina todo el año.' },
      { p: '¿Conviene ir en enero con las vacaciones?', r: 'Es invierno en Japón: frío pero con nieve en la montaña y menos gente. Es una buena época si el grupo lleva ropa de abrigo.' },
      { p: '¿Cuánto cuesta organizar el viaje con Antonio?', r: 'Se cotiza a medida por WhatsApp según fechas, número de personas y lo que quiera ver el grupo.' },
    ],
    foto: 'shirakawago',
    relacionadas: ['viaje-japon-desde-chile', 'vuelos-latinoamerica-japon-escalas', 'japon-en-invierno-con-ninos', 'presupuesto-viaje-japon-familia-dolares'],
    categoria: 'practico',
  },
  {
    slug: 'viaje-japon-desde-chile',
    titulo: 'Viaje a Japón desde Chile: sin visa, vuelos y familia 2026',
    descripcion: 'Chilenos a Japón sin visa hasta 90 días: escalas desde Santiago, ESTA para la escala en EE. UU., diferencia horaria y cómo organiza Antonio tu grupo.',
    h1: 'Viajar a Japón desde Chile en familia o en grupo',
    entradilla: 'Los chilenos no necesitan visa para viajar a Japón como turistas: Chile está en la lista de exención para estancias de hasta 90 días. Desde Santiago no hay vuelo directo; muchas familias hacen escala en Estados Unidos, donde a los chilenos les basta la autorización electrónica ESTA. Japón va 12 o 13 horas por delante según la época. Antonio, coordinador de viajes que vive en Japón desde hace cuatro años, organiza a medida el viaje de tu familia o grupo dentro de Japón y te prepara el presupuesto por WhatsApp.',
    secciones: [
      {
        h2: 'Documentación',
        parrafos: [
          `Chile figura en la ${MOFA}: no hace falta visa para turismo o visitas familiares sin actividad remunerada, hasta 90 días. Lleva el pasaporte vigente para toda la estancia y registra a cada viajero en Visit Japan Web antes de salir.`,
          'Para la escala: Chile forma parte del programa de exención de visas de Estados Unidos, así que en lugar de visa estadounidense basta con la ESTA aprobada antes de volar. Si en tu grupo hay personas con otra nacionalidad, revisa cada pasaporte por separado, tanto para Japón como para el país de escala.',
        ],
      },
      {
        h2: 'Vuelos desde Santiago',
        parrafos: [
          'No hay vuelos directos entre Chile y Japón. Las rutas habituales pasan por Estados Unidos, por Europa o por el Golfo, y el viaje total suele superar las 25 horas. Con niños pequeños o abuelos, valora una escala larga con noche en un hotel.',
          'Si el viaje se centra en Kioto, Osaka y Nara, compara llegar a Kansai (KIX) con entrar por Tokio. Una ruta eficiente es entrar por Tokio y salir por Osaka, o al revés, para no repetir camino. Más detalles en <a href="/familias/vuelos-latinoamerica-japon-escalas/">vuelos de Latinoamérica a Japón</a>.',
        ],
      },
      {
        h2: 'Diferencia horaria',
        parrafos: [
          'Chile continental cambia la hora y Japón no, así que la diferencia varía: Japón va 13 horas por delante de Santiago durante el horario de invierno chileno y 12 horas durante el horario de verano. Revisa la diferencia exacta para tus fechas y planea un primer día suave para que todo el grupo se adapte.',
        ],
      },
      {
        h2: 'Cuándo ir según las vacaciones chilenas',
        parrafos: [
          'Las vacaciones de verano chilenas (enero y febrero) caen en el invierno japonés: frío seco, nieve en los Alpes japoneses y ciudades más tranquilas. Las vacaciones de invierno de julio coinciden con el verano japonés, caluroso y húmedo. Las fiestas patrias de septiembre son una buena ventana: el calor empieza a bajar, aunque es temporada de tifones.',
          'La primavera (fines de marzo y abril, con los cerezos) y el otoño (noviembre) son las épocas más bonitas y más llenas. Con un grupo, reserva hoteles con mucha antelación.',
        ],
        lista: [
          'Enero-febrero: invierno y nieve. Ver <a href="/familias/japon-en-invierno-con-ninos/">Japón en invierno con niños</a>.',
          'Fines de marzo-abril: sakura. Ver <a href="/familias/sakura-2027-en-familia/">sakura 2027</a>.',
          'Noviembre: momiji. Ver <a href="/familias/otono-momiji-japon-familia/">otoño en familia</a>.',
        ],
      },
      {
        h2: 'Qué hace Antonio por tu grupo',
        parrafos: [
          QUE_HACE,
          `Antonio habla español, japonés muy bien, inglés y catalán, y ha coordinado familias muy grandes durante muchos días. Para el seguro recomendamos ${IATI}. Revisa qué entra y qué no en las <a href="/familias/condiciones/">condiciones</a>.`,
        ],
      },
    ],
    faq: [
      { p: '¿Los chilenos necesitan visa para Japón?', r: 'No para turismo hasta 90 días. Chile está en la lista de exención de visado de Japón.' },
      { p: '¿Necesito visa de Estados Unidos para la escala?', r: 'Los chilenos están en el programa de exención de visas de Estados Unidos: basta con la ESTA aprobada antes de volar.' },
      { p: '¿Cuántas horas de diferencia hay con Japón?', r: 'Japón va 12 o 13 horas por delante de Santiago, según el horario de verano o invierno chileno.' },
      { p: '¿Hay vuelo directo de Santiago a Tokio?', r: 'No. Se vuela con una o dos escalas en Estados Unidos, Europa o el Golfo.' },
      { p: '¿Antonio reserva los vuelos?', r: 'No. Los vuelos los reservas tú. Antonio organiza el viaje dentro de Japón y lo cotiza a medida por WhatsApp.' },
    ],
    foto: 'fuji',
    relacionadas: ['viaje-japon-desde-argentina', 'vuelos-latinoamerica-japon-escalas', 'itinerario-japon-10-dias-familia', 'presupuesto-viaje-japon-familia-dolares'],
    categoria: 'practico',
  },
  {
    slug: 'viaje-japon-desde-peru',
    titulo: 'Viaje a Japón desde Perú: sin visa con pasaporte electrónico',
    descripcion: 'Desde el 1-7-2025 los peruanos con pasaporte electrónico entran a Japón sin visa hasta 90 días. Vuelos, diferencia horaria y cómo organiza Antonio tu grupo.',
    h1: 'Viajar a Japón desde Perú en familia o en grupo',
    entradilla: 'Desde el 1 de julio de 2025, los peruanos con pasaporte electrónico (con chip, según la norma OACI) no necesitan visa para viajar a Japón como turistas hasta 90 días. Quien tenga un pasaporte sin chip debe tramitar la visa en la Embajada de Japón. No hay vuelos directos desde Lima y Japón va 14 horas por delante. Antonio, coordinador de viajes que vive en Japón desde hace cuatro años, organiza a medida el viaje de tu familia o grupo dentro de Japón y te prepara el presupuesto por WhatsApp.',
    secciones: [
      {
        h2: 'Visa: el pasaporte electrónico es la clave',
        parrafos: [
          `Según la ${MOFA}, para los nacionales de Perú (desde el 1 de julio de 2025) la exención de visa vale solo para quien tiene pasaporte electrónico conforme a la OACI. A quien no lo tenga se le aconseja obtener la visa por adelantado; si no, será examinado con rigor y se le puede negar la entrada.`,
          'En un grupo familiar, revisa el pasaporte de cada persona: es frecuente que los adultos tengan pasaporte electrónico y algún niño o abuelo conserve uno antiguo. El pasaporte electrónico lleva el símbolo del chip en la portada.',
        ],
        lista: [
          'Con pasaporte electrónico vigente: sin visa, hasta 90 días, para turismo o visitas sin actividad remunerada.',
          'Sin pasaporte electrónico: tramitar visa en la Embajada de Japón en Lima o renovar el pasaporte antes.',
          'Para trabajar, estudiar o quedarse más de 90 días: visa específica.',
          'Todos: registro en Visit Japan Web antes de salir.',
        ],
      },
      {
        h2: 'Vuelos desde Lima',
        parrafos: [
          'No hay vuelos directos entre Perú y Japón. Las rutas habituales pasan por Estados Unidos, por México, por Europa o por el Golfo. Atención a la escala: un peruano necesita visa estadounidense para hacer escala en Estados Unidos, y México también tiene sus propios requisitos para peruanos. Elige la ruta según los documentos que ya tenga cada viajero.',
          'Si el viaje se centra en Kioto, Osaka y Nara, compara llegar a Kansai (KIX) con entrar por Tokio. Más detalles en <a href="/familias/vuelos-latinoamerica-japon-escalas/">vuelos de Latinoamérica a Japón</a>.',
        ],
      },
      {
        h2: 'Diferencia horaria y fechas',
        parrafos: [
          'Japón va 14 horas por delante de Perú todo el año. Las vacaciones escolares de enero a marzo caen en el invierno japonés y en el inicio de la primavera: en enero y febrero hay frío y nieve en la montaña; a finales de marzo empiezan los cerezos. Fiestas Patrias, a finales de julio, coincide con el verano japonés, caluroso y húmedo.',
          'Muchas familias peruanas tienen parientes nikkei y aprovechan el viaje para visitar a la familia en Japón. Antonio puede combinar esas visitas con la parte turística del itinerario.',
        ],
      },
      {
        h2: 'Qué hace Antonio por tu grupo',
        parrafos: [
          QUE_HACE,
          `Antonio habla español, japonés muy bien, inglés y catalán, y ha coordinado familias muy grandes durante muchos días. Para el seguro recomendamos ${IATI}: en Japón la atención médica para turistas se paga. Revisa qué entra y qué no en las <a href="/familias/condiciones/">condiciones</a>.`,
        ],
      },
    ],
    faq: [
      { p: '¿Los peruanos necesitan visa para Japón?', r: 'Desde el 1 de julio de 2025, no, si tienen pasaporte electrónico: pueden entrar como turistas hasta 90 días. Con pasaporte sin chip, se aconseja tramitar visa.' },
      { p: '¿Cómo sé si mi pasaporte es electrónico?', r: 'El pasaporte electrónico tiene el símbolo del chip en la portada.' },
      { p: '¿Cuántas horas de diferencia hay entre Perú y Japón?', r: 'Japón va 14 horas por delante de Perú todo el año.' },
      { p: '¿Hay vuelos directos de Lima a Tokio?', r: 'No. Se viaja con escala; revisa la visa de tránsito del país de escala.' },
      { p: '¿Antonio puede incluir una visita a familiares en Japón?', r: 'Sí. El itinerario se diseña a medida y puede dejar días libres o rutas para visitar a la familia.' },
    ],
    foto: 'fushimi',
    relacionadas: ['viaje-japon-desde-colombia', 'vuelos-latinoamerica-japon-escalas', 'reunion-familiar-japon', 'presupuesto-viaje-japon-familia-dolares'],
    categoria: 'practico',
  },
  {
    slug: 'viaje-japon-desde-estados-unidos',
    titulo: 'Viaje a Japón desde EE. UU. para familias hispanas',
    descripcion: 'Familias hispanas en Estados Unidos: visa según el pasaporte de cada uno, vuelos directos a Tokio y Osaka, diferencia horaria y un coordinador en español.',
    h1: 'Viajar a Japón desde Estados Unidos con tu familia hispana',
    entradilla: 'Los ciudadanos estadounidenses no necesitan visa para viajar a Japón como turistas hasta 90 días. En familias hispanas de Estados Unidos, lo decisivo es el pasaporte de cada persona: un residente con pasaporte mexicano o salvadoreño tampoco necesita visa, pero con pasaporte colombiano, venezolano, cubano o nicaragüense hay que tramitarla antes. Hay vuelos directos a Tokio desde muchas ciudades. Antonio, coordinador de viajes que vive en Japón y habla español, organiza a medida el viaje del grupo dentro de Japón y te prepara el presupuesto por WhatsApp.',
    secciones: [
      {
        h2: 'Visa: cuenta el pasaporte, no la residencia',
        parrafos: [
          `Japón decide por la nacionalidad del pasaporte con el que entras, no por dónde vives. La green card no sirve como exención. Según la ${MOFA}:`,
        ],
        lista: [
          'Estados Unidos: sin visa, hasta 90 días de turismo.',
          'México, Guatemala, El Salvador, Honduras, Costa Rica, República Dominicana, Argentina, Chile: sin visa, hasta 90 días.',
          'Panamá, Brasil, Paraguay y Perú: sin visa solo con pasaporte electrónico.',
          'Colombia: no está en la lista; se aconseja tramitar visa.',
          'Venezuela, Cuba, Nicaragua, Ecuador o Bolivia: no figuran en la lista de exención; hay que tramitar visa.',
        ],
      },
      {
        h2: 'Dónde tramitar la visa si vives en EE. UU.',
        parrafos: [
          'Si un miembro de la familia necesita visa y reside en Estados Unidos, normalmente la tramita en el consulado general de Japón que corresponde a su zona de residencia. Cada consulado publica sus requisitos y plazos; empieza con tiempo, sobre todo en primavera y otoño. Mientras, organiza el resto del viaje con la condición de que esa persona obtenga su visa.',
        ],
      },
      {
        h2: 'Vuelos directos y diferencia horaria',
        parrafos: [
          'Hay vuelos directos a Tokio (Narita o Haneda) desde muchas ciudades de Estados Unidos, y algunas tienen vuelo directo a Osaka (Kansai). Si el viaje se centra en Kioto, Osaka y Nara, compara llegar directo a Kansai con entrar por Tokio y bajar en shinkansen, unas 2 horas y cuarto hasta Kioto.',
          'La diferencia horaria es grande: Japón va 14 horas por delante de la costa este en invierno (13 con el horario de verano) y 17 horas por delante de la costa oeste en invierno (16 en verano). Un vuelo que sale de Los Ángeles por la mañana llega a Tokio por la tarde del día siguiente. Planea un primer día suave.',
        ],
      },
      {
        h2: 'Cuándo ir con niños',
        parrafos: [
          'Las vacaciones de primavera (spring break) pueden coincidir con el inicio de los cerezos a finales de marzo; Thanksgiving coincide con el mejor momento del otoño en Kioto, a finales de noviembre; y el verano es caluroso y húmedo pero ideal para Universal Studios Japan o el Monte Fuji. Con un grupo, reserva hoteles con mucha antelación en primavera y otoño.',
        ],
        lista: [
          'Fines de marzo-abril: <a href="/familias/sakura-2027-en-familia/">sakura 2027</a>.',
          'Fines de noviembre: <a href="/familias/otono-momiji-japon-familia/">otoño y momiji</a>.',
          'Verano: <a href="/familias/universal-studios-japan-en-familia/">Universal Studios Japan</a>.',
        ],
      },
      {
        h2: 'Un coordinador en español para toda la familia',
        parrafos: [
          'En muchas familias hispanas de Estados Unidos los hijos hablan inglés y los abuelos español. Antonio habla los dos, además de japonés muy bien y catalán: prepara el viaje con quien organiza, y en Japón trata en japonés con hoteles, ryokan, conductores y guías.',
          QUE_HACE,
          `Para el seguro de viaje recomendamos ${IATI}; revisa que cubra la atención médica en Japón, que se paga. Detalles en las <a href="/familias/condiciones/">condiciones</a>.`,
        ],
      },
    ],
    faq: [
      { p: '¿Un ciudadano estadounidense necesita visa para Japón?', r: 'No para turismo hasta 90 días.' },
      { p: 'Tengo green card y pasaporte mexicano, ¿necesito visa?', r: 'No: cuenta tu pasaporte mexicano, y México está exento de visado para turismo en Japón.' },
      { p: '¿Y si tengo pasaporte venezolano o colombiano?', r: 'Venezuela no figura en la lista de exención y a Colombia se le aconseja visa. Tramítala en el consulado de Japón de tu zona antes de viajar.' },
      { p: '¿Cuántas horas de diferencia hay con Japón?', r: 'Desde la costa este, 13 o 14 horas; desde la costa oeste, 16 o 17, según el horario de verano estadounidense.' },
      { p: '¿Antonio habla inglés?', r: 'Sí. Habla español, japonés, inglés y catalán.' },
    ],
    foto: 'tokio',
    relacionadas: ['viaje-japon-desde-mexico', 'viaje-japon-con-abuelos', 'itinerario-japon-10-dias-familia', 'presupuesto-viaje-japon-familia-dolares'],
    categoria: 'practico',
  },
  {
    slug: 'japon-grupo-amigos-jubilados',
    titulo: 'Japón para un grupo de amigos jubilados: viaje a medida',
    descripcion: 'Cómo organizar Japón para un grupo de amigos jubilados de 6 a 10: ritmo, hoteles con cama, ryokan, transporte privado y seguro. Antonio lo coordina en español.',
    h1: 'Japón para un grupo de amigos jubilados',
    entradilla: 'Japón es uno de los destinos más cómodos para un grupo de amigos jubilados: es seguro, limpio, puntual y con baños y ascensores en casi todas partes. Lo que más cuenta es el ritmo: pocas mudanzas de hotel, caminatas cortas, transporte privado entre templos y una noche en ryokan con cama o silla si alguien no quiere sentarse en el suelo. Antonio, coordinador de viajes que vive en Japón desde hace cuatro años, organiza a medida viajes para grupos de 6 a 10 y te prepara el presupuesto por WhatsApp.',
    secciones: [
      {
        h2: 'Por qué Japón funciona con mayores',
        parrafos: [
          'Las estaciones grandes tienen ascensores y escaleras mecánicas, los trenes son puntuales, los baños públicos están limpios y casi siempre hay un sitio para sentarse a tomar un té. La sensación de seguridad, también de noche, es muy alta.',
          'Lo que cansa es otra cosa: las distancias dentro de las estaciones, las escaleras de muchos templos y los días en los que se camina 15.000 pasos sin darse cuenta. Un buen itinerario para mayores no quita sitios importantes; los ordena para que se caminen menos.',
        ],
      },
      {
        h2: 'El ritmo ideal',
        lista: [
          'Dos o tres bases de alojamiento en lugar de cambiar de hotel cada noche.',
          'Una visita fuerte por la mañana y algo tranquilo por la tarde.',
          'Un día libre o de descanso cada tres o cuatro días.',
          'Transporte privado entre templos y en zonas de montaña, sin cargar maletas por los andenes.',
          'Envío de maletas entre hoteles (takkyubin) en los cambios de ciudad.',
          'Alternativas a cubierto si llueve o hace mucho calor.',
        ],
        parrafos: [
          'Con este ritmo, Kioto, Nara, Osaka, Tokio, el Monte Fuji y una noche en ryokan entran sin prisas en 10 a 14 días. Tienes ejemplos en los itinerarios de <a href="/familias/itinerario-japon-10-dias-familia/">10 días</a> y <a href="/familias/itinerario-japon-14-dias-familia/">14 días</a>.',
        ],
      },
      {
        h2: 'Hoteles y ryokan',
        parrafos: [
          'Pide habitaciones con camas occidentales: en los ryokan tradicionales se duerme en futón sobre el tatami y se cena sentado en el suelo. Muchos ryokan tienen habitaciones de estilo mixto con camas, o sillas bajas para la cena. Antonio busca hoteles y ryokan adecuados al tamaño del grupo y a lo que cada uno necesita.',
          'En los baños termales (onsen) públicos se entra sin ropa y separados por sexo. Si alguien no se siente cómodo, existen habitaciones con baño termal privado.',
        ],
      },
      {
        h2: 'Salud, medicinas y seguro',
        parrafos: [
          `Elige un seguro con buena cobertura médica y revisa los límites de edad de la póliza; en Japón la atención médica para turistas se paga y puede ser cara. Nosotros recomendamos ${IATI}. Lleva las medicinas en su envase original con la receta; Japón restringe algunos medicamentos comunes en otros países, así que revisa la lista oficial antes de viajar si alguien toma tratamientos con estimulantes o codeína.`,
          'Lleva escritas en japonés las alergias y condiciones importantes de cada persona; Antonio te ayuda a comunicarlas en restaurantes y hoteles.',
        ],
      },
      {
        h2: 'Qué hace Antonio por tu grupo',
        parrafos: [
          QUE_HACE,
          'Antonio habla español, japonés muy bien, inglés y catalán, y ha coordinado familias muy grandes durante muchos días, cuadrando edades, ritmos y gustos distintos. A los grupos de amigos les ayuda a encajar lo que quiere cada uno: jardines, historia, gastronomía, compras o naturaleza. Revisa qué entra y qué no en las <a href="/familias/condiciones/">condiciones</a>.',
        ],
      },
    ],
    faq: [
      { p: '¿Japón es buen destino para jubilados?', r: 'Sí: es seguro, limpio y cómodo. La clave es un ritmo sin prisas y transporte privado en los tramos difíciles.' },
      { p: '¿Hay que dormir en el suelo en un ryokan?', r: 'En los tradicionales, sí, en futón. Muchos tienen habitaciones con camas o sillas bajas; se pide al reservar.' },
      { p: '¿Cuántos días necesita un grupo de jubilados?', r: 'Entre 10 y 14 días permiten ver lo esencial sin cansarse.' },
      { p: '¿Antonio acompaña al grupo todo el viaje?', r: 'Antonio coordina el viaje y es tu referencia en Japón; los detalles de guías y acompañamiento se acuerdan en la propuesta por WhatsApp.' },
      { p: '¿El seguro va incluido?', r: 'No. Contrátalo tú, revisando los límites de edad. Recomendamos IATI Seguros.' },
    ],
    foto: 'jardin',
    relacionadas: ['viaje-japon-con-abuelos', 'ryokan-y-montana-en-familia', 'transporte-privado-japon', 'itinerario-japon-10-dias-familia'],
    categoria: 'ocasion',
  },
  {
    slug: 'presupuesto-viaje-japon-familia-dolares',
    titulo: 'Presupuesto de un viaje a Japón en familia, en dólares',
    descripcion: 'Cuánto cuesta Japón para una familia o grupo: hoteles, comidas, trenes, entradas y tasas en yenes y en dólares, con ejemplos y dónde se ahorra.',
    h1: 'Cuánto cuesta un viaje a Japón en familia, en dólares',
    entradilla: 'Como orientación, una familia que viaja por Japón a un nivel medio gasta por persona y día unos 6.000 a 12.000 yenes en comidas, transporte urbano y entradas, sin contar alojamiento ni trenes de larga distancia; a 155 yenes por dólar, unos 40 a 80 dólares. El alojamiento para familias y los trenes bala son las partidas grandes. El tipo de cambio se mueve mucho, así que conviene presupuestar en yenes y convertir el día que se reserva. Antonio, coordinador de viajes en Japón, te prepara por WhatsApp un presupuesto a medida con lo que él gestiona.',
    secciones: [
      {
        h2: 'Presupuestar en yenes',
        parrafos: [
          'En 2026 el dólar ha estado por encima de los 150 yenes y en verano llegó a superar los 160. Por eso todos los precios de esta página están en yenes y los dólares se dan solo como ejemplo, a 155 yenes por dólar. Antes de reservar, recalcula con el cambio del día y deja un margen del 10 % para variaciones.',
        ],
      },
      {
        h2: 'Partidas de cada día, por persona',
        lista: [
          'Desayuno en tienda de conveniencia o cafetería: 500 a 1.500 ¥ (3 a 10 USD).',
          'Almuerzo de menú del día (teishoku, ramen, curry): 1.000 a 2.000 ¥ (7 a 13 USD).',
          'Cena en restaurante familiar: 2.000 a 5.000 ¥ (13 a 32 USD).',
          'Metro y autobús en la ciudad: 800 a 1.500 ¥ (5 a 10 USD).',
          'Templos y castillos: Kiyomizu-dera y Kinkaku-ji, unos 500 ¥ cada uno; el castillo de Himeji, 2.500 ¥ para no residentes desde marzo de 2026 (gratis para menores de 18).',
        ],
        parrafos: [
          'Los niños pagan menos en casi todo: en los trenes JR, los de 6 a 11 años pagan la mitad y los menores de 6 no pagan acompañados de un adulto (con límite por adulto).',
        ],
      },
      {
        h2: 'Las partidas grandes',
        lista: [
          'Alojamiento: el precio depende muchísimo de la temporada. En Kioto, en sakura y en otoño, puede doblarse. Para 6 a 10 personas suele salir mejor un apartamento completo o un ryokan con habitaciones grandes que varias habitaciones de hotel (ver <a href="/familias/habitaciones-familia-japon/">habitaciones para familias</a>).',
          'Shinkansen Tokio-Kioto: en torno a 14.000 ¥ por adulto con asiento reservado (unos 90 USD), la mitad para niños.',
          'Japan Rail Pass de 7 días: 50.000 ¥ por adulto (unos 320 USD). Solo compensa si se hacen varios trayectos largos.',
          'Parques: Universal Studios Japan y Tokyo Disney Resort tienen precio variable según el día; consulta su web oficial.',
          'Noche en ryokan con cena y desayuno: es de lo más caro del viaje, pero para muchas familias es el recuerdo principal.',
        ],
      },
      {
        h2: 'Tasas que conviene tener en cuenta',
        parrafos: [
          'La tasa de turista internacional (salida) es de 3.000 ¥ por persona desde el 1 de julio de 2026 y suele ir incluida en el boleto de avión. Kioto cobra desde marzo de 2026 una tasa de alojamiento de 200 a 10.000 ¥ por persona y noche según el precio de la habitación, y Osaka tiene la suya. Desde el 1 de noviembre de 2026 las compras libres de impuestos se pagan con impuesto y se reembolsan al salir. Todo explicado en <a href="/familias/tasas-turisticas-japon/">tasas turísticas de Japón</a>.',
        ],
      },
      {
        h2: 'Ejemplo: familia de 4, 10 días',
        parrafos: [
          'Dos adultos y dos niños de 8 y 12 años, a un nivel medio, sin vuelos ni alojamiento: comidas, transporte urbano y entradas, unos 25.000 a 35.000 ¥ al día para los cuatro, es decir, 250.000 a 350.000 ¥ en 10 días (unos 1.600 a 2.250 USD). A eso se suman el alojamiento, el shinkansen Tokio-Kioto de ida, algún parque temático y lo que cada uno quiera comprar. Es una estimación para orientarse, no un presupuesto.',
        ],
      },
      {
        h2: 'Dónde se ahorra y qué hace Antonio',
        lista: [
          'Comer en restaurantes familiares y patios de comida de centros comerciales.',
          'Usar tarjetas IC (ICOCA o Suica) en lugar de billetes sueltos.',
          'Agua del grifo: en Japón se puede beber.',
          'Muchos sitios son gratis: Fushimi Inari, el parque de Nara o el bosque de bambú de Arashiyama.',
        ],
        parrafos: [
          `${QUE_HACE} Cada viajero recibe la ICOCA con 5.000 ¥ cargados, que cubre los primeros días de metro y autobús. El precio de Antonio se cotiza a medida por WhatsApp. Para el seguro recomendamos ${IATI}.`,
        ],
      },
    ],
    faq: [
      { p: '¿Cuánto cuesta un viaje a Japón en familia?', r: 'Sin vuelos ni alojamiento, una familia de 4 a nivel medio gasta unos 25.000 a 35.000 ¥ al día en comidas, transporte urbano y entradas (unos 160 a 225 USD a 155 ¥ por dólar).' },
      { p: '¿Japón es caro para una familia?', r: 'El alojamiento y los trenes bala son caros; la comida diaria y el transporte urbano son razonables. Los niños pagan menos en trenes y entradas.' },
      { p: '¿Conviene el Japan Rail Pass?', r: 'Solo si se hacen varios trayectos largos. El pase de 7 días cuesta 50.000 ¥ por adulto.' },
      { p: '¿En qué moneda presupuesto?', r: 'En yenes. El cambio con el dólar varía mucho; convierte el día que reserves.' },
      { p: '¿Cuánto cobra Antonio?', r: 'Cada viaje se cotiza a medida por WhatsApp según fechas, personas y lo que gestiona.' },
    ],
    foto: 'tren',
    relacionadas: ['tasas-turisticas-japon', 'habitaciones-familia-japon', 'comer-en-japon-en-grupo', 'shinkansen-en-familia'],
    categoria: 'practico',
  },
  {
    slug: 'vuelos-latinoamerica-japon-escalas',
    titulo: 'Vuelos de Latinoamérica a Japón: escalas y aeropuerto',
    descripcion: 'Cómo volar a Japón desde Latinoamérica con la familia: rutas con escala, visas de tránsito, Tokio o Osaka, maletas y cómo llegar descansados.',
    h1: 'Vuelos de Latinoamérica a Japón: escalas, aeropuertos y consejos',
    entradilla: 'Desde Latinoamérica, el único vuelo directo habitual a Japón sale de Ciudad de México hacia Tokio; desde Bogotá, Lima, Santiago o Buenos Aires se vuela con una o dos escalas en Estados Unidos, México, Europa o el Golfo. Lo que más cuenta para una familia es elegir una escala para la que todos tengan los documentos, y un aeropuerto de llegada que encaje con el itinerario: Tokio (Narita o Haneda) o Osaka (Kansai). Antonio, coordinador de viajes en Japón, organiza el viaje del grupo desde que aterrizan; los vuelos los reservas tú.',
    secciones: [
      {
        h2: 'Rutas habituales',
        lista: [
          'Vía Estados Unidos: la más corta desde muchos países, pero exige visa estadounidense o, para chilenos, ESTA.',
          'Vía Ciudad de México: vuelo directo a Tokio. Revisa los requisitos de tránsito de México para tu nacionalidad.',
          'Vía Europa (Madrid, París, Fráncfort, Ámsterdam y otras): más larga, útil para quien tiene pasaporte europeo o no necesita visa en el país de escala.',
          'Vía el Golfo (Doha o Dubái): conexiones a Tokio y Osaka; viaje largo con escalas cómodas.',
        ],
        parrafos: [
          'Las rutas y frecuencias cambian cada temporada. Compara en buscadores de vuelos y, si viajan en grupo, intenta tener a todos en la misma reserva: si un vuelo se retrasa, la aerolínea reubica al grupo junto.',
        ],
      },
      {
        h2: 'Documentos para la escala',
        parrafos: [
          'Cada país de escala aplica sus propias reglas, aunque no salgas del aeropuerto. Antes de comprar, revisa para cada pasaporte del grupo: si necesita visa o autorización electrónica en el país de escala, y si entra a Japón sin visa. Para Japón tienes el detalle por país en <a href="/familias/viaje-japon-desde-colombia/">Colombia</a>, <a href="/familias/viaje-japon-desde-peru/">Perú</a>, <a href="/familias/viaje-japon-desde-argentina/">Argentina</a>, <a href="/familias/viaje-japon-desde-chile/">Chile</a>, <a href="/familias/viaje-japon-desde-mexico/">México</a> y <a href="/familias/viaje-japon-desde-centroamerica/">Centroamérica</a>.',
        ],
      },
      {
        h2: '¿Llegar a Tokio o a Osaka?',
        parrafos: [
          'Si el viaje se centra en Kioto, Osaka y Nara, llegar a Kansai (KIX) ahorra un día de traslado. Si empieza en Tokio, Narita o Haneda. Para recorrer los dos, lo más eficiente suele ser un boleto multidestino: entrar por Tokio y salir por Osaka, o al revés, para no repetir el trayecto en shinkansen (unas 2 horas y cuarto entre Tokio y Kioto).',
          'El traslado del aeropuerto al hotel lo organizas tú; tienes las opciones de cada aeropuerto para grupos en <a href="/familias/aeropuerto-al-hotel-japon/">del aeropuerto al hotel</a>.',
        ],
      },
      {
        h2: 'Llegar descansados',
        lista: [
          'Con niños o mayores, una escala larga con noche de hotel hace el viaje más llevadero.',
          'Elige asientos juntos al reservar; en vuelos largos se agotan pronto.',
          'Japón va entre 12 y 15 horas por delante de casi toda Latinoamérica: el primer día en Japón, plan suave.',
          'Registra a todos en Visit Japan Web antes de salir para pasar migración y aduana con código QR.',
          'Con mucho equipaje, envía las maletas grandes del aeropuerto al hotel con servicio de mensajería.',
        ],
      },
      {
        h2: 'Qué hace Antonio desde que aterrizan',
        parrafos: [
          QUE_HACE,
          `Para el seguro, que conviene contratar antes de volar y que cubra también los retrasos y el equipaje, recomendamos ${IATI}. Revisa las <a href="/familias/condiciones/">condiciones</a>.`,
        ],
      },
    ],
    faq: [
      { p: '¿Hay vuelos directos de Latinoamérica a Japón?', r: 'Desde Ciudad de México hay vuelo directo a Tokio. Desde Sudamérica y Colombia se vuela con escala.' },
      { p: '¿Necesito visa para hacer escala en Estados Unidos?', r: 'Sí, salvo que tu país esté en el programa de exención de visas de Estados Unidos (como Chile), en cuyo caso basta la ESTA.' },
      { p: '¿Es mejor llegar a Tokio o a Osaka?', r: 'Depende del itinerario. Para Kioto, Osaka y Nara, Kansai; para recorrer los dos, entrar por uno y salir por el otro.' },
      { p: '¿Antonio reserva los vuelos?', r: 'No. Los vuelos y el traslado del aeropuerto los organizas tú; Antonio se ocupa del viaje dentro de Japón.' },
    ],
    foto: 'hero',
    relacionadas: ['aeropuerto-al-hotel-japon', 'viaje-japon-desde-colombia', 'viaje-japon-desde-argentina', 'presupuesto-viaje-japon-familia-dolares'],
    categoria: 'practico',
  },
]

export const FUENTES_EXTRA = [
  { dato: 'Lista de exención de visado del MOFA (copia del 27-10-2026): Argentina, Chile y EE. UU. exentos; Perú desde el 1-7-2025 solo con pasaporte electrónico; a Colombia se le aconseja visa', url: 'https://web.archive.org/web/20261027160512/https://www.mofa.go.jp/j_info/visit/visa/short/novisa.html', comprobado: '2026-11-03' },
  { dato: 'Exención de visa para peruanos desde el 1-7-2025 (Embajada de Japón en Lima, vía prensa)', url: 'https://www.americatv.com.pe/noticias/actualidad/japon-eximira-visa-peruanos-desde-julio-2025-n507179', comprobado: '2026-11-03' },
  { dato: 'Castillo de Himeji: 2.500 ¥ para no residentes desde el 1-3-2026', url: 'https://www.japantimes.co.jp/news/2025/02/16/japan/himeji-castle-fee-rise', comprobado: '2026-11-03' },
  { dato: 'Japan Rail Pass: precios oficiales', url: 'https://japanrailpass.net/en/', comprobado: '2026-11-03' },
]
