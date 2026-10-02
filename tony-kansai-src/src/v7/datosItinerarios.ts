// Itinerarios hora a hora: lo que el cliente pedía para no sentirse perdido.
// Las horas van aparte (HORAS) para que sean las mismas en todos los idiomas;
// los textos de cada idioma sólo dicen dónde y qué. Son días de ejemplo: el
// orden real se ajusta al grupo, a la luz y a la gente que haya ese día.
//
// Fuentes de tiempos: horarios públicos de JR, Kintetsu, Odakyu y Nishitetsu
// (≈, redondeados). Nada de entradas compradas por nosotros: las paga el cliente.

import type { Tramo } from './datosRutas'
import { ET_EN, ITIN_EN } from './itin-en'
import { ET_AR, ITIN_AR } from './itin-ar'
import { ET_RU, ITIN_RU } from './itin-ru'

export type ItinId = 'kioto' | 'osaka' | 'nara' | 'himeji' | 'kobe' | 'hiroshima' | 'fuji' | 'tokio' | 'nagano' | 'fukuoka'
type Lengua = 'es' | 'en' | 'ar' | 'ru'
type Guia = 'tony' | 'larion'

export const META_ITIN: Record<ItinId, { foto: string; kanji: string; tramo: Tramo; guias: Guia[]; viajeGuia?: boolean }> = {
  kioto: { foto: '/v7/fotos/kioto.jpg', kanji: '京都', tramo: 'completo', guias: ['tony', 'larion'] },
  osaka: { foto: '/v7/fotos/osaka.jpg', kanji: '大阪', tramo: 'completo', guias: ['tony', 'larion'] },
  nara: { foto: '/v7/fotos/nara.jpg', kanji: '奈良', tramo: 'completo', guias: ['tony', 'larion'] },
  himeji: { foto: '/v7/fotos/himeji.jpg', kanji: '姫路', tramo: 'completo', guias: ['tony', 'larion'] },
  kobe: { foto: '/v7/fotos/kobe.jpg', kanji: '神戸', tramo: 'completo', guias: ['tony'] },
  hiroshima: { foto: '/v7/fotos/miyajima.jpg', kanji: '広島', tramo: 'lejos', guias: ['tony', 'larion'] },
  // Fuera de Kansai: el billete del guía se suma al presupuesto cerrado.
  fuji: { foto: '/v7/fotos/fuji.jpg', kanji: '富士', tramo: 'lejos', guias: ['tony'], viajeGuia: true },
  tokio: { foto: '/v7/fotos/tokio.jpg', kanji: '東京', tramo: 'lejos', guias: ['tony'], viajeGuia: true },
  nagano: { foto: '/v7/fotos/nagano.jpg', kanji: '長野', tramo: 'lejos', guias: ['tony'], viajeGuia: true },
  fukuoka: { foto: '/v7/fotos/fukuoka.jpg', kanji: '福岡', tramo: 'lejos', guias: ['tony'], viajeGuia: true },
}

export const ORDEN_TONY: ItinId[] = ['kioto', 'osaka', 'nara', 'himeji', 'kobe', 'hiroshima', 'fuji', 'tokio', 'nagano', 'fukuoka']
export const ORDEN_LARION: ItinId[] = ['hiroshima', 'kioto', 'nara', 'osaka', 'himeji']

export const HORAS: Record<ItinId, string[]> = {
  kioto: ['08:00', '08:45', '10:45', '12:45', '14:00', '15:45', '17:30'],
  osaka: ['09:00', '09:15', '11:30', '13:30', '15:00', '16:30', '18:30'],
  nara: ['08:30', '09:15', '09:45', '10:30', '12:30', '14:00', '15:30'],
  himeji: ['08:00', '09:00', '11:30', '12:30', '14:00', '16:30', '17:30'],
  kobe: ['09:00', '09:30', '10:15', '12:00', '13:30', '15:00', '16:30'],
  hiroshima: ['07:30', '09:15', '11:30', '12:30', '13:45', '15:30', '17:00'],
  fuji: ['08:00', '09:30', '10:30', '12:00', '13:00', '14:15', '16:00'],
  tokio: ['08:00', '09:00', '11:30', '12:30', '13:30', '15:00', '17:00'],
  nagano: ['08:00', '09:30', '11:30', '12:30', '13:30', '15:30', '17:00'],
  fukuoka: ['07:30', '10:15', '11:00', '12:30', '14:00', '16:30', '18:00'],
}

export interface TextoItin {
  titulo: string
  llegar: string
  resumen: string
  pasos: { lugar: string; que: string }[]
  comer: string
  ojo: string
}

export interface EtiquetasItin {
  titulo: string; sub: string; volver: string; ver: string; dia: string; comer: string; ojo: string; pedir: string; precio: string
  viajeGuia: string; porGrupo: string; siguiente: string; nota: string
}

export const ET_ITIN: Record<Lengua, EtiquetasItin> = {
  es: {
    titulo: 'El día, hora a hora', sub: 'Así es un día con nosotros en cada sitio. Son ejemplos reales: el orden lo ajustamos a vuestro ritmo, a la luz y a la gente que haya.',
    volver: 'Volver', ver: 'Ver el día hora a hora', dia: 'El día', comer: 'Comer', ojo: 'A tener en cuenta', pedir: 'Quiero este día',
    precio: 'Precio', viajeGuia: '+ el billete del guía hasta allí, incluido en el presupuesto cerrado', porGrupo: 'por grupo', siguiente: 'Siguiente',
    nota: 'Las entradas, trenes y comidas los pagáis vosotros en el momento; yo os digo cuándo y dónde.',
  },
  en: ET_EN, ar: ET_AR, ru: ET_RU,
}

// El ruso sólo trae los días de Larion (ORDEN_LARION).
export const ITINERARIOS: Record<Lengua, Partial<Record<ItinId, TextoItin>>> = {
  es: {
    kioto: {
      titulo: 'Kioto en un día', llegar: '≈ 45 min en tren desde Osaka',
      resumen: 'Los torii de Fushimi Inari antes de que llegue la gente, el templo de madera de Kiyomizu, las calles de Gion y el Pabellón Dorado al final de la tarde.',
      pasos: [
        { lugar: 'Vuestro hotel en Osaka', que: 'Os recojo en el vestíbulo y vamos juntos en tren. Os enseño a usar la tarjeta IC para todo el día.' },
        { lugar: 'Fushimi Inari Taisha', que: 'Subimos por los túneles de torii rojos hasta el mirador de Yotsutsuji, donde la mayoría se da la vuelta. Fotos sin multitud.' },
        { lugar: 'Kiyomizu-dera', que: 'El escenario de madera sobre la ladera, sin un solo clavo. Bajamos por las cuestas de piedra de Sannenzaka y Ninenzaka.' },
        { lugar: 'Comida en Higashiyama', que: 'Tofu, soba o un menú de fideos en una casa de madera. Si necesitáis halal o vegetariano, elijo el sitio con eso en mente.' },
        { lugar: 'Gion y Hanamikoji', que: 'El barrio de las casas de té, el santuario Yasaka y el canal de Shirakawa, el rincón más fotografiado de Kioto.' },
        { lugar: 'Kinkaku-ji, el Pabellón Dorado', que: 'Taxi o autobús hasta el norte. Con la luz de la tarde el oro se refleja en el estanque. Cierra a las 17:00.' },
        { lugar: 'Vuelta a Osaka', que: 'Os dejo en el tren correcto o volvemos juntos hasta vuestro hotel.' },
      ],
      comer: 'Kioto es de tofu, verduras y fideos. Hay ramen y restaurantes con certificado halal cerca de Gion.',
      ojo: 'Se camina mucho y hay escaleras: calzado cómodo. En otoño (noviembre) y sakura (abril) salimos aún más temprano.',
    },
    osaka: {
      titulo: 'Osaka a pie y comiendo', llegar: 'Empieza en vuestro hotel',
      resumen: 'La ciudad de la comida. El castillo por la mañana, el mercado al mediodía y los neones de Dōtonbori al caer la tarde.',
      pasos: [
        { lugar: 'Vuestro hotel', que: 'Os recojo y vamos en metro. Osaka se entiende mejor a pie y con hambre.' },
        { lugar: 'Castillo de Osaka', que: 'Los fosos y las murallas de piedra gigantes, el parque y, si os apetece, el museo dentro de la torre con vistas desde arriba.' },
        { lugar: 'Mercado de Kuromon', que: '«La cocina de Osaka»: brochetas de marisco, fruta japonesa, tortilla dulce. Se come de pie, puesto a puesto.' },
        { lugar: 'Shinsekai', que: 'El barrio de aire retro bajo la torre Tsūtenkaku. Kushikatsu y juegos de antes.' },
        { lugar: 'Hōzen-ji', que: 'Un templo escondido en un callejón de piedra entre restaurantes, con una estatua cubierta de musgo.' },
        { lugar: 'Dōtonbori', que: 'El canal y los carteles luminosos gigantes. Takoyaki recién hechos y paseo por el río cuando se encienden las luces.' },
        { lugar: 'Fin del día', que: 'Os dejo en vuestro hotel o en el restaurante que hayáis elegido para cenar.' },
      ],
      comer: 'Takoyaki, okonomiyaki y marisco. Para halal, en Namba hay restaurantes certificados; os digo cuáles.',
      ojo: 'El día que más se come: venid con hambre. Domingos y festivos Dōtonbori está lleno; entre semana, mejor.',
    },
    nara: {
      titulo: 'Nara y sus ciervos', llegar: '≈ 40 min en tren desde Osaka',
      resumen: 'La primera capital de Japón: ciervos sueltos por el parque, el Gran Buda de bronce y mil faroles de piedra en el bosque.',
      pasos: [
        { lugar: 'Vuestro hotel en Osaka', que: 'Os recojo y vamos en tren Kintetsu, que deja a cinco minutos del parque.' },
        { lugar: 'Kōfuku-ji', que: 'La pagoda de cinco pisos y la entrada al parque. Aquí empiezan a aparecer los ciervos.' },
        { lugar: 'Parque de Nara', que: 'Más de mil ciervos sueltos que saludan con la cabeza si les dais galletas de ciervo. Os explico cómo, para que no os persigan.' },
        { lugar: 'Tōdai-ji', que: 'El Gran Buda de 15 metros dentro de uno de los mayores edificios de madera del mundo. Y la columna con el agujero para pasar.' },
        { lugar: 'Comida en Naramachi', que: 'El barrio de casas de comerciantes. Fideos, kakinoha-zushi (sushi envuelto en hoja de caqui) o lo que os apetezca.' },
        { lugar: 'Kasuga Taisha', que: 'El camino de faroles de piedra cubiertos de musgo entre cedros, y los faroles de bronce colgados en el santuario.' },
        { lugar: 'Jardín Isui-en y vuelta', que: 'Un jardín japonés con el monte Wakakusa de fondo (cierra los martes). Después, tren de vuelta.' },
      ],
      comer: 'Nara es tranquila para comer: fideos, sushi de hoja de caqui y dulces de té. Hay opciones vegetarianas sin problema.',
      ojo: 'Los ciervos muerden la ropa si escondéis galletas: se dan todas o se enseñan las manos vacías. Ideal con niños.',
    },
    himeji: {
      titulo: 'Himeji, el castillo blanco', llegar: '≈ 1 h en tren rápido desde Osaka',
      resumen: 'El castillo original mejor conservado de Japón, por dentro, planta por planta. Después, su jardín y un templo en lo alto del monte Shosha.',
      pasos: [
        { lugar: 'Vuestro hotel en Osaka', que: 'Os recojo y vamos en tren rápido o shinkansen, según el presupuesto del grupo.' },
        { lugar: 'Castillo de Himeji', que: 'El «Garza Blanca»: subimos los seis pisos de madera original de 1609. Os cuento cómo se defendía y dónde se escondían los arqueros.' },
        { lugar: 'Jardín Kōko-en', que: 'Nueve jardines al pie del castillo, con estanques de carpas y una casa de té.' },
        { lugar: 'Comida en Himeji', que: 'Anago (congrio) o el oden local con salsa de jengibre. Hay sitios con opciones sin cerdo.' },
        { lugar: 'Engyō-ji, monte Shosha', que: 'Teleférico y bosque hasta un monasterio de madera de mil años en la montaña, donde se rodó «El último samurái».' },
        { lugar: 'Vuelta a Osaka', que: 'O una parada en Kobe para ver el puerto iluminado, si os quedan fuerzas.' },
        { lugar: 'Llegada al hotel', que: 'Os dejo en el vestíbulo.' },
      ],
      comer: 'Himeji es de congrio y oden. Os aviso de qué platos llevan cerdo o caldo de cerdo.',
      ojo: 'Dentro del castillo se va descalzo y las escaleras son muy empinadas: calcetines y nada de faldas largas. Abre a las 9:00.',
    },
    kobe: {
      titulo: 'Kobe, puerto y montaña', llegar: '≈ 25 min en tren desde Osaka',
      resumen: 'La ciudad más abierta de Japón: la mezquita más antigua del país, las casas de los comerciantes extranjeros, el barrio chino y el puerto.',
      pasos: [
        { lugar: 'Vuestro hotel en Osaka', que: 'Os recojo y vamos en tren hasta Sannomiya.' },
        { lugar: 'Mezquita de Kobe', que: 'Construida en 1935, la más antigua de Japón: sobrevivió a la guerra y al terremoto de 1995. Se puede visitar con respeto, fuera de las horas de oración.' },
        { lugar: 'Kitano Ijinkan', que: 'Las casas de los comerciantes europeos del siglo XIX en la ladera, con vistas a la bahía.' },
        { lugar: 'Nankinmachi', que: 'El barrio chino: bollos al vapor y comida callejera para comer andando.' },
        { lugar: 'Puerto de Meriken', que: 'La torre roja del puerto y el memorial del terremoto, un trozo del muelle tal y como quedó en 1995.' },
        { lugar: 'Harborland', que: 'Paseo por el muelle al atardecer con la ciudad y la montaña de fondo.' },
        { lugar: 'Teleférico de Shin-Kobe', que: 'Subida al jardín de hierbas de Nunobiki con la bahía iluminada al anochecer. Después, vuelta a Osaka.' },
      ],
      comer: 'Hay restaurantes con wagyu de certificado halal; os digo cuáles y la reserva la hacéis vosotros.',
      ojo: 'Para la mezquita: hombros y piernas cubiertos, y las mujeres con pañuelo (allí lo prestan).',
    },
    hiroshima: {
      titulo: 'Hiroshima y Miyajima', llegar: '≈ 1 h 25 min en shinkansen desde Osaka',
      resumen: 'Por la mañana, la ciudad que eligió la paz. Por la tarde, la isla sagrada del torii que flota sobre el mar con la marea alta.',
      pasos: [
        { lugar: 'Shin-Osaka', que: 'Nos vemos en la estación o en vuestro hotel y cogemos el shinkansen. Os enseño a reservar los asientos.' },
        { lugar: 'Parque de la Paz', que: 'La Cúpula de la Bomba Atómica, el cenotafio y la llama de la paz. Después, el Museo Memorial: duro, pero imprescindible.' },
        { lugar: 'Okonomiyaki de Hiroshima', que: 'La versión local, con capas y fideos. Lo pedimos sin cerdo si hace falta: se hace delante de vosotros.' },
        { lugar: 'Ferry a Miyajima', que: 'Tranvía o tren hasta el puerto y diez minutos de ferry viendo acercarse el gran torii.' },
        { lugar: 'Santuario Itsukushima', que: 'El santuario sobre pilotes y el torii en el mar. Con marea baja se puede caminar hasta él; con marea alta, flota.' },
        { lugar: 'Omotesandō y ciervos', que: 'La calle de tiendas con momiji manjū (pastelitos con forma de hoja de arce) y los ciervos de la isla.' },
        { lugar: 'Vuelta', que: 'Ferry y shinkansen de vuelta: en Osaka sobre las 19:30.' },
      ],
      comer: 'Okonomiyaki, ostras de Miyajima y momiji manjū. Algunos locales lo preparan sin cerdo o con certificado halal; lo miro antes según el día.',
      ojo: 'Miro la tabla de mareas antes y movemos el orden para ver el torii con el agua alta (o caminar hasta él con la baja).',
    },
    fuji: {
      titulo: 'Monte Fuji desde Hakone', llegar: '≈ 1 h 30 min desde Tokio (o 2 días desde Osaka)',
      resumen: 'Volcán, lago y bosque en un solo día: el valle de vapor de Ōwakudani, un barco por el lago Ashi y el torii del santuario de Hakone con el Fuji detrás.',
      pasos: [
        { lugar: 'Shinjuku, Tokio', que: 'Os recojo en vuestro hotel de Tokio y vamos en el tren Romancecar hasta Hakone-Yumoto.' },
        { lugar: 'Tren de montaña de Hakone', que: 'Un tren pequeño que sube en zigzag por la montaña (en junio, entre hortensias), y funicular hasta Sōunzan.' },
        { lugar: 'Ōwakudani', que: 'Teleférico sobre el valle volcánico: fumarolas, olor a azufre y los huevos negros cocidos en el agua termal. Con cielo limpio, el Fuji enfrente.' },
        { lugar: 'Comida en Tōgendai', que: 'A la orilla del lago. Hay curry, fideos y opciones sin cerdo.' },
        { lugar: 'Barco por el lago Ashi', que: 'Unos 40 minutos de travesía hasta Moto-Hakone con el Fuji reflejado en el agua en días claros.' },
        { lugar: 'Santuario de Hakone', que: 'El torii rojo dentro del lago y el camino de cedros centenarios de la antigua ruta de Tōkaidō.' },
        { lugar: 'Vuelta a Tokio', que: 'Autobús y Romancecar de vuelta a Shinjuku, sobre las 18:30.' },
      ],
      comer: 'Comida sencilla de montaña: curry, soba y tofu. Os aviso si un caldo lleva cerdo.',
      ojo: 'El Fuji es tímido: se ve mejor en invierno y por la mañana. Si sopla gas volcánico cierran el teleférico y cambiamos el orden.',
    },
    tokio: {
      titulo: 'Tokio en un día', llegar: '≈ 2 h 30 min en shinkansen desde Osaka',
      resumen: 'Del Tokio antiguo al de las pantallas: Asakusa por la mañana, el bosque de Meiji, Harajuku y el cruce de Shibuya al anochecer.',
      pasos: [
        { lugar: 'Mercado exterior de Tsukiji', que: 'Desayuno de mercado: tortilla dulce, fruta, marisco. Os recojo en vuestro hotel de Tokio.' },
        { lugar: 'Sensō-ji, Asakusa', que: 'La puerta Kaminarimon con su farol gigante, la calle Nakamise y el templo más antiguo de Tokio.' },
        { lugar: 'Comida', que: 'Tempura, fideos o sushi. Si necesitáis halal, Asakusa es de las zonas de Tokio con más restaurantes certificados.' },
        { lugar: 'Santuario Meiji', que: 'Un bosque de unos 100.000 árboles en mitad de la ciudad y el gran torii de madera.' },
        { lugar: 'Harajuku y Omotesandō', que: 'La calle Takeshita, la moda joven y las tiendas de arquitectos de Omotesandō.' },
        { lugar: 'Tokyo Camii', que: 'Opcional: la mayor mezquita de Japón, de estilo otomano, a diez minutos de Shibuya.' },
        { lugar: 'Shibuya', que: 'El cruce más famoso del mundo al encenderse las luces, y la estatua de Hachikō.' },
      ],
      comer: 'Tokio tiene de todo. Para halal, Asakusa y Shibuya; para vegetariano, también hay opciones fáciles.',
      ojo: 'Para Tokio lo mejor es que durmáis allí: yo viajo hasta vuestro hotel y el billete del guía va en el presupuesto.',
    },
    nagano: {
      titulo: 'Nagano y los monos de nieve', llegar: '≈ 1 h 20 min desde Tokio (o 3 h desde Osaka)',
      resumen: 'Un templo de casi 1.400 años con un pasillo a oscuras bajo el altar y los macacos que se bañan en aguas termales en mitad del bosque.',
      pasos: [
        { lugar: 'Vuestro hotel', que: 'Os recojo y vamos en shinkansen hasta Nagano.' },
        { lugar: 'Zenkō-ji', que: 'El templo que acoge a todos. Bajamos al pasillo totalmente a oscuras bajo el altar para buscar a tientas «la llave del paraíso».' },
        { lugar: 'Soba de Shinshu', que: 'Nagano es tierra de fideos de trigo sarraceno. Hay versión vegetariana del caldo.' },
        { lugar: 'Camino a Jigokudani', que: 'Tren y autobús hasta Yudanaka, y treinta minutos de paseo por un sendero llano entre cedros.' },
        { lugar: 'Parque de los Monos de Nieve', que: 'Los macacos japoneses se bañan en el agua termal y se acicalan a un metro de vosotros. No se les toca ni se les mira fijo.' },
        { lugar: 'Shibu Onsen', que: 'Un pueblo de baños con calles de madera de la época Edo y faroles al anochecer.' },
        { lugar: 'Vuelta', que: 'Autobús y shinkansen de vuelta a vuestro hotel.' },
      ],
      comer: 'Soba, verduras de montaña y oyaki (bollos rellenos). Fácil para vegetarianos.',
      ojo: 'Los monos están en el agua sobre todo de diciembre a marzo, con nieve. En verano están, pero se bañan menos. En invierno, botas con suela.',
    },
    fukuoka: {
      titulo: 'Fukuoka y Dazaifu', llegar: '≈ 2 h 30 min en shinkansen desde Osaka',
      resumen: 'La puerta de Japón hacia Asia: santuarios de la época de los samuráis, el lago del parque Ōhori y los puestos de comida del río al anochecer.',
      pasos: [
        { lugar: 'Shin-Osaka', que: 'Nos vemos en la estación o en vuestro hotel de Fukuoka si dormís allí.' },
        { lugar: 'Kushida-jinja', que: 'El santuario de Hakata, con las carrozas gigantes del festival Yamakasa expuestas todo el año.' },
        { lugar: 'Dazaifu Tenmangu', que: 'Treinta minutos de tren. El santuario del dios del estudio, con su jardín de ciruelos y su calle de tiendas.' },
        { lugar: 'Comida en Dazaifu', que: 'Umegae-mochi (pastel de arroz relleno de judía) recién hecho y fideos udon.' },
        { lugar: 'Parque Ōhori y castillo', que: 'Paseo alrededor del lago y subida a las murallas del antiguo castillo de Fukuoka.' },
        { lugar: 'Canal City y Nakasu', que: 'El centro comercial atravesado por un canal y, al caer la noche, los yatai: puestos de comida a la orilla del río.' },
        { lugar: 'Vuelta', que: 'Shinkansen de vuelta a Osaka o a vuestro hotel en Fukuoka.' },
      ],
      comer: 'El ramen de Hakata lleva caldo de cerdo (tonkotsu); si lo evitáis, os llevo a ramen halal o de pollo. En los yatai pregunto yo por vosotros.',
      ojo: 'Si hacéis Hiroshima y Fukuoka, lo ideal son dos días con noche en Fukuoka: lo organizamos juntos.',
    },
  },
  en: ITIN_EN,
  ar: ITIN_AR,
  ru: ITIN_RU,
}
