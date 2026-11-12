// Genera public/es/leyendas/ y public/en/legends/ (página estática de leyendas de Tony Hanma).
// Uso: node scripts/leyendas.mjs. Los textos viven aquí; la maqueta en leyendas.src.html.
// Las fotos se reutilizan de /tr/foto con el crédito de turkce-fotolar.json (obligatorio por licencia).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import EN from './leyendas-en.mjs'
import AR from './leyendas-ar.mjs'
import { LUGARES } from './leyendas-lugares.mjs'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const fotos = JSON.parse(readFileSync(join(raiz, 'scripts/turkce-fotolar.json'), 'utf8'))
const URL = 'https://tonykansaiguide.com/es/leyendas/'

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function foto(clave, alt, { portada = false, credito = 'Foto' } = {}) {
  const f = fotos[clave]
  if (!f) throw new Error(`Foto desconocida: ${clave}`)
  const srcset = f.anchos.map((w) => `/tr/foto/${clave}-${w}.webp ${w}w`).join(', ')
  const media = f.anchos.includes(1920) ? 1920 : f.anchos[0]
  const carga = portada ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'
  const img = `<img src="/tr/foto/${clave}-${media}.webp" srcset="${srcset}" sizes="${portada ? '100vw' : '(min-width:820px) 50vw, 100vw'}" width="${f.w}" height="${f.h}" alt="${esc(alt)}" ${carga}${f.lqip ? ` style="background:url(${f.lqip}) center/cover"` : ''}>`
  if (portada) return img
  return `<figure>${img}<figcaption>${credito}: <a href="${f.kaynak}" rel="noopener">${esc(f.autor)}</a>, ${f.lisans}</figcaption></figure>`
}

// Leyendas reales: folclore documentado, sin adornos inventados.
const LEYENDAS = [
  { t: 'Los zorros que guardan la llave del arroz', l: 'Fushimi Inari Taisha, Kioto', f: 'fushimi-orman', alt: 'Túnel de torii rojos en Fushimi Inari',
    p: 'Las estatuas de zorro (kitsune) de Fushimi Inari no son el dios: son sus mensajeros. Muchas llevan en la boca una llave, la del granero de arroz, o una joya que concede deseos. En el folclore japonés el zorro vive mucho, gana una cola por cada siglo y puede tomar forma humana.',
    y: 'Lo que cuento allí: por qué los torii los pagan empresas y qué escriben en la parte de atrás.' },
  { t: 'El pozo de Okiku, la sirvienta que cuenta platos', l: 'Castillo de Himeji', f: 'himeji', alt: 'Castillo de Himeji',
    p: 'Dentro del recinto del castillo de Himeji hay un pozo con nombre propio: el Okiku-ido. La leyenda de Banchō Sarayashiki cuenta que la sirvienta Okiku fue acusada de perder uno de diez platos valiosos y arrojada a ese pozo. Desde entonces, de noche, se la oye contar: «uno, dos… nueve», y grita al no encontrar el décimo.',
    y: 'Lo que cuento allí: cómo esta historia inspiró a los fantasmas de pelo largo del cine de terror japonés.' },
  { t: 'Yoshitsune y el rey de los tengu', l: 'Monte Kurama, norte de Kioto', f: 'arashiyama', alt: 'Bosque de bambú cerca de Kioto',
    p: 'De niño, Minamoto no Yoshitsune, el samurái más famoso de Japón, vivía escondido en el templo de Kurama. Según la leyenda, de noche bajaba al bosque y Sōjōbō, el rey de los tengu (espíritus de la montaña con nariz larga y alas), le enseñaba a manejar la espada.',
    y: 'Lo que cuento allí: dónde están las raíces que, según dicen, usaban como pista de entrenamiento.' },
  { t: 'El funcionario que trabajaba de noche en el infierno', l: 'Rokudō Chinnō-ji, Kioto', f: 'gion', alt: 'Calle de madera en Gion, Kioto',
    p: 'Ono no Takamura (802-853) fue poeta y funcionario de la corte. La leyenda dice que cada noche bajaba por el pozo de este pequeño templo al mundo de los muertos para ayudar al rey Enma a juzgar almas, y volvía por la mañana a su trabajo en palacio. El pozo sigue allí.',
    y: 'Lo que cuento allí: por qué este barrio se llamaba «la frontera entre los dos mundos».' },
  { t: 'El puente donde volvían los muertos', l: 'Ichijō Modoribashi, Kioto', f: 'kiyomizu-gece', alt: 'Kioto de noche',
    p: 'Según la tradición, en el año 918 el sabio Miyoshi Kiyoyuki volvió a la vida un momento sobre este puente, cuando el cortejo fúnebre de su padre lo cruzaba. Desde entonces se llama Modoribashi, «el puente del regreso». Hoy muchas novias evitan cruzarlo, para no «volver» a casa de sus padres.',
    y: 'Lo que cuento allí: el demonio que, según otra leyenda, perdió el brazo junto a este puente.' },
  { t: 'El astrólogo hijo de una zorra', l: 'Santuario Seimei (Kioto) y bosque de Shinoda (Izumi, Osaka)', f: 'osaka-kale-gece', alt: 'Castillo de Osaka de noche',
    p: 'Abe no Seimei fue el onmyōji (astrólogo y adivino) más famoso del Japón antiguo. La leyenda dice que su madre era Kuzunoha, una zorra blanca del bosque de Shinoda, en Osaka, que tomó forma de mujer y huyó cuando su hijo descubrió quién era.',
    y: 'Lo que cuento allí: la estrella de cinco puntas que verás en todo el santuario.' },
  { t: 'Los ciervos que trajeron a un dios', l: 'Kasuga Taisha y parque de Nara', f: 'nara-fener-geyik', alt: 'Ciervo entre linternas de piedra en Kasuga Taisha',
    p: 'Cuando se fundó el santuario de Kasuga, en el siglo VIII, el dios Takemikazuchi llegó a Nara montado en un ciervo blanco. Por eso los ciervos de Nara se consideran mensajeros divinos. Durante siglos, matar uno estaba castigado con la muerte.',
    y: 'Lo que cuento allí: por qué los ciervos «hacen reverencias» y qué pasa si les enseñas las manos vacías.' },
  { t: 'Saltar desde el escenario de Kiyomizu', l: 'Kiyomizu-dera, Kioto', f: 'kiyomizu-sonbahar', alt: 'Templo Kiyomizu en otoño',
    p: 'En japonés, «saltar desde el escenario de Kiyomizu» significa tomar una decisión arriesgada. No es una metáfora: en la época Edo se creía que quien saltaba los 13 metros y sobrevivía vería cumplido su deseo. Los registros del templo cuentan 234 saltos entre 1694 y 1864, y sobrevivió la gran mayoría. Se prohibió en 1872.',
    y: 'Lo que cuento allí: dónde caían y por qué la ladera estaba llena de árboles.' },
  { t: 'La maldición del Coronel', l: 'Dōtonbori, Osaka', f: 'dotonbori', alt: 'Canal de Dōtonbori en Osaka',
    p: 'En 1985 los Hanshin Tigers ganaron la liga y sus aficionados, celebrando en el puente Ebisu, lanzaron al canal una estatua del Coronel Sanders. El equipo pasó décadas sin ganar otra Serie de Japón y Osaka lo llamó «la maldición del Coronel». La estatua apareció en el fondo del canal en 2009; los Tigers volvieron a ganar la Serie de Japón en 2023.',
    y: 'Lo que cuento allí: la leyenda urbana más moderna de Japón, en el sitio exacto donde nació.' },
  { t: 'Shuten-dōji, el rey de los demonios', l: 'Monte Ōe, norte de Kioto', f: 'kasuga', alt: 'Linternas de piedra',
    p: 'Shuten-dōji era el jefe de los oni (demonios) que secuestraban gente en Kioto hacia el año 1000. El guerrero Minamoto no Raikō subió al monte Ōe disfrazado de monje con sus cuatro guardianes y lo venció. Uno de ellos, Watanabe no Tsuna, ya había cortado el brazo al demonio Ibaraki-dōji, que da nombre a la ciudad de Ibaraki, en Osaka.',
    y: 'Lo que cuento allí: por qué en Japón se tiran judías a los demonios cada febrero.' },
  { t: 'Kiyohime, la mujer que se convirtió en serpiente', l: 'Dōjō-ji, Wakayama', f: 'gion', alt: 'Calle de madera en Kioto',
    p: 'Un joven monje, Anchin, prometió volver a por Kiyohime y la engañó. Ella lo persiguió hasta el río Hidaka, se lanzó al agua y salió convertida en una gran serpiente. El monje se escondió bajo la campana del templo Dōjō-ji; la serpiente se enroscó a la campana y la calentó con su furia hasta que el monje murió dentro. El templo sigue contando la historia con rollos ilustrados.',
    y: 'Lo que cuento allí: por qué esta historia acabó en el teatro nō y el kabuki, y qué pasó con la campana.' },
  { t: 'Hashihime, la princesa del puente de Uji', l: 'Puente de Uji y santuario Hashihime, Uji', f: 'kinkakuji', alt: 'Templo junto al agua en Kioto',
    p: 'Según una de las versiones más antiguas, una mujer enloquecida por los celos se sumergió veintiún días en el río Uji para convertirse en demonio y vengarse. Desde entonces se dice que la princesa del puente protege el cruce y no soporta los amores ajenos: por eso muchas parejas evitan pasear juntas por el puente de Uji.',
    y: 'Lo que cuento allí: el pequeño santuario de Hashihime, a dos minutos del puente, que casi nadie visita.' },
  { t: 'Uneme y el santuario que da la espalda al estanque', l: 'Estanque Sarusawa, Nara', f: 'todaiji', alt: 'Templo Tōdai-ji en Nara',
    p: 'Una dama de la corte, Uneme, perdió el favor del emperador y se ahogó en el estanque Sarusawa. Cuentan que su espíritu no soportaba ver el agua donde murió, y el pequeño santuario Uneme, junto al estanque, se giró en una sola noche para darle la espalda. Hoy sigue mirando hacia el lado contrario.',
    y: 'Lo que cuento allí: cómo encontrar el santuario girado sin que nadie te lo señale.' },
  { t: 'Osakabe-hime, la princesa del último piso', l: 'Torre del castillo de Himeji', f: 'himeji-yakin', alt: 'Castillo de Himeji visto desde lejos',
    p: 'En lo más alto de la torre del castillo de Himeji vive, según la leyenda, Osakabe-hime, una princesa yokai que solo se deja ver por el señor del castillo una vez al año. Quien sube sin permiso a su piso pierde el camino de vuelta. En el último piso de la torre hay un pequeño santuario que la recuerda.',
    y: 'Lo que cuento allí: la historia del samurái que subió de noche a verla.' },
  { t: 'Urashima Tarō y los trescientos años', l: 'Santuario Urashima, Ine (norte de Kioto)', f: 'rokko-gece', alt: 'El mar de noche',
    p: 'Un pescador salvó a una tortuga y fue invitado al palacio del dios del mar. Pasó allí lo que creyó que eran tres días. Al volver, habían pasado trescientos años y nadie lo conocía. Abrió la caja que le habían prohibido abrir y envejeció de golpe. El santuario Urashima, en la bahía de Ine, guarda la caja que según la tradición es la original.',
    y: 'Lo que cuento allí: por qué es una de las historias de viajes en el tiempo más antiguas del mundo.' },
]

// Relatos ORIGINALES de Tony Hanma: ficción declarada como tal.
const RELATOS = [
  { k: '五', t: 'El zorro que cobraba en monedas de cinco yenes', d: 'Fushimi Inari, Kioto',
    p: 'En japonés, cinco yenes se dice go-en, igual que «buena relación». Dicen en la montaña que un zorro sin estatua espera a los que suben solos después del atardecer. No pide nada, solo una moneda de cinco yenes. Al que se la da, le devuelve el camino de bajada más corto. Al que no, le devuelve el camino largo… y a una persona que no conocía, al pie de la montaña, que acabará siendo su amigo. Por eso Tony siempre sube con dos monedas.' },
  { k: '灯', t: 'La linterna que se enciende sola', d: 'Kasuga Taisha, Nara',
    p: 'Kasuga tiene unas tres mil linternas y casi todas llevan grabado el nombre de quien la donó. Una no tiene nombre. Según el relato de Tony, se enciende sola la noche en que alguien de Nara recupera algo que había perdido: una carta, un anillo, a una persona. Los ciervos lo saben antes que nadie y se reúnen alrededor de ella en silencio.' },
  { k: '面', t: 'La máscara del último tren', d: 'Línea Keihan, entre Osaka y Kioto',
    p: 'En el último tren de la noche siempre viaja una mujer con máscara de teatro nō. No duerme ni mira el móvil. Tony escribió que es la dueña de todas las caras que la gente deja olvidadas en el trabajo: la cara del jefe amable, la del empleado sonriente. Cuando llegas a tu estación, te devuelve la tuya. Si te bajas sin mirarla, vuelves a casa con la cara del día.' },
  { k: '竹', t: 'El bambú que cuenta pasos', d: 'Bosque de bambú de Arashiyama, Kioto',
    p: 'El bambú crece hasta un metro al día y, según este relato, también escucha. Cuenta los pasos de cada visitante y, al salir del bosque, el viento suena en un número de golpes. Quien coincide con sus propios pasos volverá a Kioto. Tony dice que nadie ha contado bien jamás, porque al entrar todos se olvidan de contar.' },
  { k: '傘', t: 'El paraguas que volvía solo', d: 'Calles de Gion, Kioto',
    p: 'En Japón se dice que un objeto que cumple cien años gana alma; hay hasta un yokai paraguas, el kasa-obake. En el relato de Tony, en Gion hay un paraguas de papel que nadie compró nunca. Aparece en la puerta de quien se ha olvidado el suyo el día que va a llover, y desaparece cuando escampa. Solo pide una cosa: que lo dejes abierto un momento antes de devolverlo, para que vea la calle.' },
  { k: '駅', t: 'La estación que no está en el mapa', d: 'Línea circular JR de Osaka',
    p: 'La línea circular de Osaka tiene diecinueve estaciones. Tony escribió que, para quien se queda dormido en la última vuelta de la noche, hay una vigésima. Allí siempre es la hora en que más feliz fuiste en Osaka, y el andén huele a lo que comiste ese día. Puedes bajar, pero el tren solo espera lo que dura una canción. Quien vuelve a subir a tiempo, regresa a Osaka antes de un año.' },
  { k: '鹿', t: 'El ciervo que cobraba comisión', d: 'Parque de Nara',
    p: 'Todo el mundo sabe que los ciervos de Nara hacen reverencias para pedir galletas. Lo que nadie cuenta, según Tony, es que hay uno, viejo y con una oreja doblada, que no se inclina ante nadie. Se planta delante del puesto de galletas y espera. Cada turista que compra un paquete, sin saber por qué, le da la primera galleta a él. Tony lleva meses intentando no hacerlo. Todavía no lo ha conseguido.' },
  { k: '蛸', t: 'El takoyaki número nueve', d: 'Dōtonbori, Osaka',
    p: 'Las bandejas de takoyaki traen ocho bolas. Tony asegura que, muy de vez en cuando, en un puesto de Dōtonbori cuyo nombre se niega a decir, sale una bandeja con nueve. Quien se come la novena dice exactamente lo que piensa durante una hora, sin poder evitarlo. Por eso, cuenta Tony, en Osaka nadie acepta takoyaki de un desconocido antes de una reunión importante.' },
  { k: '鐘', t: 'La campanada ciento nueve', d: 'Templos de Kioto en Nochevieja',
    p: 'En Nochevieja, los templos de Kioto tocan la campana 108 veces, una por cada deseo terrenal que hay que dejar atrás. Tony escribió que, si te quedas solo cuando se van todos, a veces suena una más. La campanada 109 no es para olvidar: es para recordar algo que perdiste. Nadie sabe quién la toca. A la mañana siguiente, el mazo de la campana siempre está húmedo, como si hubiera llovido solo sobre él.' },
  { k: '影', t: 'La sombra que llegó tarde', d: 'Castillo de Osaka',
    p: 'Un viajero se hizo una foto delante del castillo de Osaka y, al mirarla, vio que su sombra no estaba. Volvió al día siguiente: en la foto nueva había dos. Tony dice que las sombras de quienes llegan con prisa se quedan atrás, paseando por los jardines del castillo, y vuelven cuando su dueño por fin se sienta a mirar. Así que, si alguna vez vas, siéntate un rato frente al foso antes de irte. Por si acaso tu sombra todavía está paseando.' },
]

const PREGUNTAS = [
  ['¿Cuál es la leyenda más famosa de Japón?', 'Entre las más conocidas están la del cortador de bambú y la princesa Kaguya, la de Urashima Tarō, la de Momotarō y las de los kitsune (zorros). En Kansai, las más visitables son los zorros de Fushimi Inari, el pozo de Okiku en el castillo de Himeji y los ciervos sagrados de Nara.'],
  ['¿Qué son los yokai?', 'Son los seres sobrenaturales del folclore japonés: zorros que cambian de forma (kitsune), tengu de la montaña, kappa de los ríos, oni (demonios) y fantasmas (yūrei). Muchos tienen un lugar concreto asociado, y en Kioto hay calles enteras ligadas a ellos, como la de Ichijō.'],
  ['¿Dónde ver leyendas japonesas en Kioto?', 'Fushimi Inari (zorros), Rokudō Chinnō-ji (el pozo al inframundo), el puente Ichijō Modoribashi, el santuario Seimei, el templo Kiyomizu y el monte Kurama (tengu). Se pueden unir en un día con tren y a pie.'],
  ['¿Quién es Tony Hanma?', 'Tony Hanma es un guía privado español que vive en Osaka desde abril de 2026. Hace tours en español, inglés y árabe por Kioto, Osaka, Nara, Kobe y Himeji, es autor del libro «Detrás del Rostro» y ha escrito relatos originales sobre lugares de Kansai, como «El zorro que cobraba en monedas de cinco yenes» y «La máscara del último tren».'],
  ['¿Hay un tour de leyendas y misterios en Kioto en español?', 'Sí. Tony Hanma hace un tour privado de leyendas por Kioto (o Kioto y Nara) en español, con recogida en el hotel: medio día 38.000 ¥ y día completo 58.000 ¥ por grupo de hasta 6 personas. Se reserva por WhatsApp en el +34 634 193 106.'],
  ['¿Es verdad que se saltaba desde Kiyomizu-dera?', 'Sí. En la época Edo se creía que sobrevivir al salto desde el escenario de Kiyomizu cumplía un deseo. Los registros del templo anotan 234 saltos entre 1694 y 1864 y la mayoría sobrevivió. El gobierno lo prohibió en 1872.'],
]

// Genera una página (un idioma) a partir de sus datos y su plantilla.
function generar(c) {
  const capitulos = c.LEYENDAS.map((x, i) => `    <article class="cap" id="leyenda-${i + 1}">
      ${foto(x.f, x.alt, { credito: c.credito })}
      <div class="ent">
        <p class="num">${String(i + 1).padStart(2, '0')} / ${c.LEYENDAS.length}</p>
        <h3>${esc(x.t)}</h3>
        <p class="lugar">${esc(x.l)}</p>
        <p>${esc(x.p)}</p>
        <p class="tony">${esc(x.y)}</p>
      </div>
    </article>`).join('\n')

  const relatos = c.RELATOS.map((r, i) => `      <li class="rel ent" id="relato-${i + 1}">
        <span class="kanji" aria-hidden="true">${r.k}</span>
        <h3>${esc(r.t)}</h3>
        <p class="donde">${esc(r.d)}</p>
        <p>${esc(r.p)}</p>
        <p class="autor">${esc(c.firmaRelato)}</p>
      </li>`).join('\n')

  const lugares = LUGARES.map((x, i) => {
    const t = x[c.lang]
    return `      <li class="lugar-perdido ent" id="lugar-${i + 1}">
        <span class="kanji" aria-hidden="true">${x.k}</span>
        <p class="estado">${esc(t.e)}</p>
        <h3>${esc(t.t)}</h3>
        <p class="donde">${esc(t.l)}</p>
        <p>${esc(t.p)}</p>
        <p class="visita">${esc(t.v)}</p>
      </li>`
  }).join('\n')

  const preguntas = c.PREGUNTAS.map(([q, a]) => `      <details class="ent"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n')

  const persona = {
    '@type': 'Person', '@id': 'https://tonykansaiguide.com/#tony', name: 'Tony Hanma', alternateName: 'ハンマ・トニー',
    jobTitle: c.cargo, nationality: { '@type': 'Country', name: c.pais },
    homeLocation: { '@type': 'Place', name: c.base }, url: c.url,
    knowsLanguage: ['es', 'en', 'ar'],
    knowsAbout: c.sabe,
    sameAs: ['https://www.instagram.com/tonykansaiguide/', 'https://tonykansaiguide.com/es/leyendas/', 'https://tonykansaiguide.com/en/legends/', 'https://tonykansaiguide.com/ar/asatir/'],
    worksFor: { '@id': 'https://tonykansaiguide.com/#negocio' },
  }
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'ProfilePage', '@id': c.url + '#pagina', url: c.url, name: c.titulo, inLanguage: c.lang, dateModified: new Date().toISOString().slice(0, 19) + 'Z', mainEntity: persona },
      { '@type': 'Book', name: 'Detrás del Rostro', author: { '@id': persona['@id'] }, inLanguage: 'es', url: 'https://tonykansaiguide.com/libro/' },
      ...c.RELATOS.map((r, i) => ({ '@type': 'ShortStory', '@id': `${c.url}#relato-${i + 1}`, name: r.t, author: { '@id': persona['@id'] }, genre: c.genero, inLanguage: c.lang, datePublished: '2026', contentLocation: { '@type': 'Place', name: r.d }, text: r.p })),
      { '@type': 'ItemList', name: c.lista, itemListElement: c.LEYENDAS.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.t, url: `${c.url}#leyenda-${i + 1}` })) },
      { '@type': 'ItemList', name: c.listaLugares, itemListElement: LUGARES.map((x, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'TouristAttraction', name: x[c.lang].t, description: x[c.lang].p, address: x[c.lang].l, url: `${c.url}#lugar-${i + 1}` } })) },
      { '@type': 'FAQPage', mainEntity: c.PREGUNTAS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
  }

  const html = readFileSync(join(raiz, 'scripts', c.plantilla), 'utf8')
    .replace('{{JSONLD}}', `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>`)
    .replace('{{FOTO_PORTADA}}', foto('fushimi-tunel', c.altPortada, { portada: true }))
    .replace('{{CAPITULOS}}', capitulos)
    .replace('{{RELATOS}}', relatos)
    .replace('{{PREGUNTAS}}', preguntas)
    .replace('{{LUGARES}}', lugares)
  if (/\{\{[A-Z_]+\}\}/.test(html)) throw new Error(`Quedan huecos sin rellenar en ${c.plantilla}`)

  const dest = join(raiz, 'public', c.ruta)
  mkdirSync(dest, { recursive: true })
  writeFileSync(join(dest, 'index.html'), html)
  console.log(`leyendas ${c.lang}: ${c.LEYENDAS.length} leyendas, ${LUGARES.length} lugares, ${c.RELATOS.length} relatos, ${c.PREGUNTAS.length} preguntas → public/${c.ruta}/index.html`)
}

generar({
  lang: 'es', url: URL, ruta: 'es/leyendas', plantilla: 'leyendas.src.html', LEYENDAS, RELATOS, PREGUNTAS,
  credito: 'Foto', firmaRelato: 'Relato original de Tony Hanma, 2026', cargo: 'Guía privado y escritor', pais: 'España', base: 'Osaka, Japón',
  sabe: ['Leyendas de Japón', 'Folclore japonés', 'Yokai', 'Kioto', 'Osaka', 'Nara', 'Himeji'],
  titulo: 'Tony Hanma, el guía de las leyendas de Japón', genero: 'Leyenda original', lista: 'Leyendas reales de Kansai', listaLugares: 'Lugares perdidos de Japón',
  altPortada: 'Túnel de torii de Fushimi Inari al anochecer',
})
generar(EN)
generar(AR)
