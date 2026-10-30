#!/usr/bin/env node
// Genera public/ru/kndr/**: tours a Corea del Norte (КНДР) con Larion como
// acompañante, en ruso, para viajeros con pasaporte ruso.
//
//   node scripts/kndr.mjs
//
// HTML estático a propósito, como turkce.mjs: GPTBot, ClaudeBot y PerplexityBot
// no ejecutan JavaScript, y quien pregunta a una IA «тур в Северную Корею»
// tiene que encontrar el texto entero en la primera respuesta del servidor.
// rutas-estaticas.mjs no las pisa (llevan data-estatica en <html>).
//
// Reglas de contenido (30-10-2026, Tony):
// - De Larion solo consta: ciudadano ruso, guía de habla rusa que vive en Japón,
//   equipo Tony Kansai Guide, 201 reseñas de sus tours POR JAPÓN. No decir que
//   ya ha estado en la RPDC.
// - Las reseñas son de Japón y la página lo dice; sin AggregateRating en JSON-LD.
// - En la RPDC cada grupo lleva guías coreanos locales; Larion acompaña desde
//   Vladivostok. El operador es «аккредитованный российский туроператор» (no se
//   nombra). Precios orientativos con Larion incluido, sin el vuelo a Vladivostok.
// - El cliente paga al operador ruso por contrato, nunca a través de Japón.
// - Nada de alcohol ni juego.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://tonykansaiguide.com'
const HOY = '2026-10-30'

const WA_NUMERO = '818085067586'
const WA_VISIBLE = '+81 80 8506 7586'
const wa = (texto) => `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(texto)}`
const WA_GENERAL = wa('Здравствуйте, Ларион! Интересует тур в КНДР. Даты и количество человек: ')

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Reseñas de Larion (de sus tours por Japón).
let OTZYVY = []
let OTZYVY_TOTAL = 0
const rutaOtzyvy = join(root, 'public/reviews-larion.json')
if (existsSync(rutaOtzyvy)) {
  const d = JSON.parse(readFileSync(rutaOtzyvy, 'utf8'))
  OTZYVY_TOTAL = d.count ?? d.reviews?.length ?? 0
  OTZYVY = (d.reviews ?? []).filter((r) => r.stars === 5 && r.text).sort((a, b) => b.text.length - a.text.length).slice(0, 6)
} else {
  console.warn('⚠ kndr: falta public/reviews-larion.json; la página sale sin reseñas')
}

// Fotos de Wikimedia Commons: scripts/kndr-foto.json, archivos en public/ru/kndr/foto/<clave>-<ancho>.webp.
const FOTOS = JSON.parse(readFileSync(join(root, 'scripts/kndr-foto.json'), 'utf8'))
const foto = (k) => { if (!FOTOS[k]) throw new Error(`kndr: falta la foto ${k}`); return FOTOS[k] }
const alto = (k, w) => Math.round((foto(k).h / foto(k).w) * w)
const srcset = (k) => foto(k).anchos.map((w) => `/ru/kndr/foto/${k}-${w}.webp ${w}w`).join(', ')
const credito = (k) => `Фото: <a href="${foto(k).kaynak}" rel="nofollow">${esc(foto(k).autor)}</a> · ${esc(foto(k).lisans)}`
const imagen = (k, alt, sizes, lazy = true) => `<img src="/ru/kndr/foto/${k}-1080.webp" srcset="${srcset(k)}" sizes="${sizes}" alt="${esc(alt)}" width="1920" height="${alto(k, 1920)}"${lazy ? ' loading="lazy"' : ' fetchpriority="high"'}>`
const heroe = (k, alt, contenido) => `<section class="heroe">
${imagen(k, alt, '100vw', false)}
<div class="velo"><div class="kap">${contenido}</div></div>
<small class="credito">${credito(k)}</small>
</section>`

const TURY = [
  {
    yol: 'rozhdestvo-v-phenyane', nombre: 'Рождество и Новый год в Пхеньяне', fechas: '04–08.01.2027', dias: 5, precio: 4900, foto: 'plaza',
    resumen: 'Праздничная столица зимой: площадь Ким Ир Сена, новогодние огни, город Нампхо.',
    programa: ['Сбор группы во Владивостоке, перелёт в Пхеньян', 'Обзорная экскурсия по столице, площадь Ким Ир Сена', 'Метро Пхеньяна и праздничный город', 'Поездка в Нампхо и к Западному морскому шлюзу', 'Свободное время с гидом, перелёт во Владивосток'],
  },
  {
    yol: 'masikryon', nombre: 'Горнолыжный курорт Масикрён + Пхеньян', fechas: '19–26.02.2027', dias: 8, precio: 6400, foto: 'masikryong',
    resumen: 'Пять дней на склонах Масикрёна и экскурсии по Пхеньяну. Прокат снаряжения на курорте.',
    programa: ['Сбор во Владивостоке, перелёт в Пхеньян', 'Экскурсии по Пхеньяну', 'Переезд на курорт Масикрён', 'Катание на лыжах и сноуборде', 'Возвращение в Пхеньян', 'Перелёт во Владивосток'],
  },
  {
    yol: 'myohyan', nombre: 'От Пхеньяна до гор Мёхян', fechas: '26–31.03.2027', dias: 6, precio: 4900, foto: 'myohyang',
    resumen: 'Весенние горы Мёхян, буддийский монастырь Похёнса и Международная выставка дружбы.',
    programa: ['Сбор во Владивостоке, перелёт в Пхеньян', 'Обзорная экскурсия по столице', 'Переезд в горы Мёхян, монастырь Похёнса', 'Международная выставка дружбы', 'Возвращение в Пхеньян, перелёт во Владивосток'],
  },
  {
    yol: 'den-solntsa', nombre: 'День Солнца в Пхеньяне', fechas: '12–16.04.2027', dias: 5, precio: 5400, foto: 'pyongyang',
    resumen: 'Главный праздник страны 15 апреля: торжества, массовые танцы, праздничный город.',
    programa: ['Сбор во Владивостоке, перелёт в Пхеньян', 'Обзорная экскурсия по столице', 'Праздничные мероприятия Дня Солнца', 'Музеи и парки Пхеньяна', 'Перелёт во Владивосток'],
  },
  {
    yol: 'pektusan', nombre: 'Пхеньян и гора Пэктусан', fechas: 'даты по запросу', dias: 8, precio: 7900, foto: 'paektu',
    resumen: 'Священная гора Пэктусан и кратерное озеро Чхонджи на высоте 2 189 м. Внутренние перелёты.',
    programa: ['Сбор во Владивостоке, перелёт в Пхеньян', 'Экскурсии по Пхеньяну', 'Перелёт к горе Пэктусан', 'Подъём к озеру Чхонджи', 'Самджиён', 'Возвращение в Пхеньян, перелёт во Владивосток'],
  },
  {
    yol: 'vonsan-kalma', nombre: 'Пляжный курорт Вонсан-Кальма', fechas: 'лето 2027', dias: 7, precio: 6900, foto: 'wonsan',
    resumen: 'Новый курорт на Японском море, открыт в июле 2025 года. Принимает только туристов из России.',
    programa: ['Сбор во Владивостоке, перелёт в Пхеньян', 'Переезд в Вонсан', 'Отдых на пляже Кальма', 'Экскурсии по Вонсану', 'Возвращение в Пхеньян', 'Перелёт во Владивосток'],
  },
  {
    yol: 'individualnyj', nombre: 'Индивидуальный VIP-тур в КНДР', fechas: 'любые даты', dias: '4+', precio: 9900, foto: 'pyongyang',
    resumen: 'Только ваша семья или компания. Своя программа, свои даты, Ларион с вами всю поездку.',
    programa: ['Даты и маршрут под вас', 'Программу согласует туроператор', 'Ларион сопровождает от Владивостока', 'Местные гиды на всех экскурсиях'],
  },
]
const VKLYUCHENO = ['Ларион лично с вами от Владивостока и обратно, на связи 24/7', 'Перелёт Владивосток — Пхеньян — Владивосток, бизнес-класс при наличии мест', 'Лучшие отели по программе, номера повышенной категории', 'Отдельный автомобиль с водителем и местные гиды', 'Банкетные ужины и лучшие рестораны по программе', 'VIP-трансфер во Владивостоке: аэропорт — отель — аэропорт', 'Виза КНДР (оформляет туроператор)', 'Медицинская страховка']
// VIP (31-10-2026): Tony quiere el viaje como producto de lujo. Lo que se promete es lo que
// un operador acreditado puede dar en la RPDC; lo que depende de plazas va «при наличии».
const VIP = [
  ['Группа до 6 человек', 'Или только ваша семья. Никаких автобусов на 40 человек: отдельный автомобиль с водителем.'],
  ['Бизнес-класс', 'Перелёт Air Koryo Владивосток — Пхеньян в бизнес-классе при наличии мест, без очередей на регистрации.'],
  ['Лучшие отели', 'Отель «Корё» в Пхеньяне, «Масикрён» на курорте, лучшие корпуса Вонсан-Кальмы. Номера повышенной категории.'],
  ['Ларион 24/7', 'Один русскоязычный человек решает всё: документы, деньги, вопросы на месте. Вы просто отдыхаете.'],
  ['Банкеты и рестораны', 'Пхеньянский холодный нэнмён, королевская кухня, ужин на вращающейся башне — лучшие столы по программе.'],
  ['Встреча во Владивостоке', 'Трансфер из аэропорта, отель накануне вылета и брифинг о правилах поездки за ужином.'],
]
const vipBloque = `<section id="vip"><div class="kap">
<span class="ceja">Что значит VIP</span>
<h2>Северная Корея без толпы</h2>
<ul class="regiones vip">${VIP.map(([b, t]) => `<li><b>${esc(b)}</b><span>${esc(t)}</span></li>`).join('')}</ul>
<p class="nota">Бизнес-класс, номера и рестораны зависят от наличия и подтверждаются туроператором при бронировании.</p>
</div></section>`
const NE_VKLYUCHENO = ['Дорога до Владивостока', 'Личные расходы и сувениры', 'Дополнительные мероприятия вне программы']
// 201 отзыв, 25 отзывов, 3 отзыва
const otzyvov = (n) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'отзыв' : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'отзыва' : 'отзывов'}`
const usd = (n) => `$${n.toLocaleString('ru-RU').replace(/\u00a0/g, ' ')}`

const OTVETY = [
  {
    yol: 'vip-tur-v-kndr', foto: 'plaza', h1: 'VIP-тур в Северную Корею: что входит и сколько стоит',
    titulo: 'VIP-тур в КНДР 2027: бизнес-класс, лучшие отели, личный сопровождающий',
    desc: 'Что такое VIP-тур в Северную Корею для россиян: группа до 6 человек, отдельный автомобиль, лучшие отели, бизнес-класс при наличии мест и Ларион 24/7. Цены 2027.',
    otvet: 'VIP-тур в КНДР — это поездка малой группой до 6 человек или только вашей семьёй, с отдельным автомобилем, лучшими отелями по программе и личным русскоязычным сопровождающим Ларионом от Владивостока и обратно. Перелёт в бизнес-классе Air Koryo — при наличии мест. Цены 2027 года — от $4 900 на человека за 5 дней, индивидуальный тур — от $9 900.',
    secciones: [
      ['Чем VIP отличается от обычного тура', 'В обычном туре группа до 30–40 человек, общий автобус и стандартные отели, а на вопросы отвечает только местный гид. В VIP-туре — отдельный автомобиль с водителем, номера повышенной категории, лучшие рестораны и один человек, который отвечает за вас всю поездку.'],
      ['Цены VIP-туров 2027', null],
      ['Где вы живёте', 'В Пхеньяне — отель «Корё» в центре города, на курорте — отель «Масикрён», на море — лучшие корпуса Вонсан-Кальмы. Категорию номеров туроператор подтверждает при бронировании.'],
      ['Что остаётся как у всех', 'Правила КНДР одинаковы для всех туристов: по стране вы передвигаетесь с местными гидами, программу согласует туроператор. VIP меняет комфорт и внимание к вам, а не правила страны.'],
    ],
  },
  {
    yol: 'kak-dobratsya-do-phenyana', foto: 'pyongyang', h1: 'Как добраться до Пхеньяна из Москвы и других городов',
    titulo: 'Как добраться до Пхеньяна в 2027: самолёт из Владивостока, рейс из Москвы, поезд',
    desc: 'Все способы попасть в Пхеньян из России: Air Koryo из Владивостока, рейс Nordwind из Москвы, поезд Москва — Пхеньян. Что выбрать для тура с Ларионом.',
    otvet: 'Чаще всего в Пхеньян летят из Владивостока рейсами Air Koryo — около 1,5 часа в пути, через этот рейс едет большинство российских туристов. Из Москвы есть редкий прямой рейс Nordwind (около 8 часов, примерно раз в месяц), но места на него продаются через туроператоров. Поезд из Москвы идёт около 8 дней. В VIP-туре с Ларионом группа собирается во Владивостоке.',
    secciones: [
      ['Владивосток — Пхеньян (Air Koryo)', 'Основной путь: короткий перелёт, на который приходится подавляющая часть туристов. В VIP-туре — бизнес-класс при наличии мест. До Владивостока из Москвы, Петербурга, Новосибирска, Екатеринбурга и Казани летают прямые или стыковочные рейсы.'],
      ['Прямой рейс Москва — Пхеньян (Nordwind)', 'Рейс запущен в 2025 году, летает примерно раз в месяц, около 8 часов без посадок. Спрос на него небольшой, а билет обычно продаётся только вместе с туром, поэтому даты не всегда совпадают с программами.'],
      ['Поезд Москва — Пхеньян', 'Прямой вагон ходит с 2025 года, дорога занимает около 8 дней. Это скорее приключение, чем удобный способ: для VIP-тура мы советуем самолёт.'],
      ['Особая зона Расон', 'Отдельное направление у границы с Приморьем: туда ездят из Владивостока по суше. Это не Пхеньян и не горы — спросите Лариона, если интересует именно Расон.'],
    ],
  },
  {
    yol: 'kndr-s-detmi', foto: 'wonsan', h1: 'Можно ли поехать в КНДР с детьми',
    titulo: 'КНДР с детьми: можно ли, какие документы, какой тур выбрать',
    desc: 'Можно ли ехать в Северную Корею с ребёнком: виза, документы, какие туры подходят семьям. Семейный VIP-тур с Ларионом.',
    otvet: 'Да, с детьми в КНДР ездят. Ребёнку нужен свой загранпаспорт и виза, которую туроператор оформляет вместе с визами родителей. Семьям больше всего подходят пляжный курорт Вонсан-Кальма летом и индивидуальный VIP-тур, где темп программы подстраивают под ребёнка. Медицина в стране ограничена, поэтому нужна страховка и запас лекарств.',
    secciones: [
      ['Документы', 'Загранпаспорт ребёнка, действующий ещё 6 месяцев после поездки. Если ребёнок едет с одним из родителей или с родственниками, уточните у туроператора, нужно ли согласие второго родителя.'],
      ['Какой тур выбрать', 'Вонсан-Кальма — пляж, аквапарк и спокойный темп. Индивидуальный VIP-тур — свои даты, своя машина и программа без долгих переездов. Длинные туры с внутренними перелётами (Пэктусан) маленьким детям тяжелее.'],
      ['Здоровье', 'Возьмите аптечку и все лекарства, которые принимает ребёнок: в КНДР их не купить. Медицинская страховка входит в тур, но лучше обсудить с Ларионом особые случаи заранее.'],
    ],
  },
  {
    yol: 'otzyvy-turistov-o-kndr', foto: 'plaza', h1: 'Отзывы туристов о поездке в КНДР: что нравится и что удивляет',
    titulo: 'Отзывы о туре в Северную Корею: впечатления российских туристов 2025–2026',
    desc: 'Что российские туристы рассказывают о поездке в КНДР: гостеприимство, гиды, правила, связь. Честно о плюсах и минусах и как их сглаживает VIP-тур.',
    otvet: 'Российские туристы чаще всего хвалят гостеприимство, старательных гидов, чистоту и ощущение «путешествия во времени». Чаще всего удивляют правила: без гида никуда, у памятников — особый этикет, связи с домом почти нет. В 2025 году в КНДР съездили, по разным оценкам, от 3 до 7 тысяч россиян, и спрос в 2026 году продолжает расти.',
    secciones: [
      ['Что хвалят', 'Доброжелательных местных жителей и гидов, которые стараются; сервис на новом курорте Вонсан-Кальма; безопасность; необычность страны, которую мало кто видел.'],
      ['Что удивляет или не нравится', 'Гид всегда рядом, гулять одному нельзя; у памятников принято возлагать цветы и кланяться; интернета практически нет; в больших группах много времени уходит на ожидание автобуса и других туристов.'],
      ['Как это меняет VIP-тур', 'Правила страны одинаковы для всех, но в малой группе с отдельной машиной нет ожиданий, программа идёт в вашем темпе, а Ларион заранее объясняет этикет, чтобы ничего не застало врасплох.'],
      ['Отзывы о Ларионе', 'Туры в КНДР — новое направление Лариона; о его экскурсиях по Японии оставлено больше 200 отзывов. Отзывы о поездках в КНДР появятся после первых групп.'],
    ],
  },
  {
    yol: 'svadebnoe-puteshestvie-v-kndr', foto: 'paektu', h1: 'Свадебное путешествие в КНДР: медовый месяц, которого нет ни у кого',
    titulo: 'Свадебное путешествие и медовый месяц в КНДР — VIP-тур для двоих',
    desc: 'Медовый месяц в Северной Корее: индивидуальный VIP-тур для пары с отдельной машиной, лучшими отелями и сопровождающим Ларионом. Пхеньян, горы, море.',
    otvet: 'Свадебное путешествие в КНДР — это индивидуальный VIP-тур только для вас двоих: отдельная машина с водителем, лучшие отели, фотосессии в Пхеньяне, горы Мёхян или Пэктусан, летом — море в Вонсан-Кальме. Ларион сопровождает пару от Владивостока и решает всё на месте. Цена — от $9 900 на человека, даты любые.',
    secciones: [
      ['Как это выглядит', 'Своя программа без группы, торжественный ужин, фотосъёмка на самых красивых видовых точках (где снимать разрешено), отдельный автомобиль и номера повышенной категории.'],
      ['Когда ехать', 'Весна (апрель — май) и осень (сентябрь — октябрь) — лучшие сезоны для гор; июль — август — для моря в Вонсане.'],
      ['Подарок', 'Тур можно подарить паре: Ларион согласует даты с молодожёнами и подготовит документы.'],
    ],
  },
  {
    yol: 'kak-poehat-v-severnuyu-koreyu', foto: 'pyongyang', h1: 'Как поехать в Северную Корею из России в 2027 году',
    titulo: 'Как поехать в Северную Корею из России в 2027 году — пошагово',
    desc: 'Можно ли россиянам в КНДР, как оформить визу, откуда летят группы и сколько стоит. Пошаговая инструкция и туры с сопровождающим Ларионом.',
    otvet: 'Да, гражданам России можно поехать в Северную Корею в 2027 году. Въезд возможен только в составе организованной группы через аккредитованного российского туроператора, который оформляет визу. Группы собираются во Владивостоке и летят в Пхеньян. Цены на VIP-туры с сопровождающим Ларионом — от $4 900 на человека.',
    secciones: [
      ['Шаг 1. Выберите тур и даты', 'Туры привязаны к датам: Новый год, горнолыжный сезон в феврале, весна в горах Мёхян, День Солнца 15 апреля, летний пляжный сезон в Вонсане. Индивидуальный тур возможен в любые даты.'],
      ['Шаг 2. Паспорт и документы', 'Нужен заграничный паспорт РФ, действующий ещё минимум 6 месяцев после поездки. Копию паспорта отправляют туроператору примерно за месяц до выезда для оформления визы. Ларион собирает документы группы и следит за сроками.'],
      ['Шаг 3. Дорога до Владивостока', 'Из Москвы, Санкт-Петербурга, Новосибирска, Екатеринбурга и Казани удобнее всего долететь до Владивостока. С июня 2025 года также ходит прямой поезд Москва — Пхеньян.'],
      ['Шаг 4. Поездка', 'Во Владивостоке группу встречает Ларион. В КНДР с группой всегда работают местные гиды: туристы не ходят по стране самостоятельно. Ларион остаётся с группой до возвращения во Владивосток.'],
    ],
  },
  {
    yol: 'skolko-stoit-tur-v-kndr', foto: 'plaza', h1: 'Сколько стоит тур в КНДР в 2027 году',
    titulo: 'Сколько стоит тур в Северную Корею в 2027 году: цены для россиян',
    desc: 'Цены на туры в КНДР в 2027 году: обычные групповые туры и VIP с личным сопровождающим. Что входит в стоимость и что оплачивается отдельно.',
    otvet: 'Обычный групповой тур в КНДР от российских туроператоров стоит примерно от $1 000 до $2 000 на человека, в зависимости от программы и длительности. VIP-туры с личным сопровождающим Ларионом и малой группой до 6 человек — от $4 900 (5 дней) до $7 900 (Пэктусан, 8 дней). Индивидуальный VIP-тур — от $9 900 на человека.',
    secciones: [
      ['Цены на VIP-туры 2027', null],
      ['Что входит в стоимость', VKLYUCHENO.join('. ') + '.'],
      ['Что оплачивается отдельно', NE_VKLYUCHENO.join('. ') + '. Для личных расходов возьмите наличные доллары, евро или юани: российские и международные карты в КНДР не работают.'],
      ['Почему VIP дороже', 'В обычном туре группа большая, а на вопросы отвечает только местный гид. В VIP-туре с вами весь путь один русскоязычный сопровождающий: он готовит документы, решает вопросы на месте и отвечает за группу до возвращения.'],
    ],
  },
  {
    yol: 'pravila-dlya-turistov-v-kndr', foto: 'myohyang', h1: 'Правила для туристов в КНДР: что можно и нельзя',
    titulo: 'Правила для туристов в Северной Корее: фото, связь, поведение',
    desc: 'Что можно и нельзя туристу в КНДР: фотосъёмка, связь и интернет, прогулки, поведение у памятников. Советы перед поездкой.',
    otvet: 'В КНДР туристы всегда передвигаются с местными гидами и не гуляют самостоятельно. Фотографировать можно почти везде, кроме военных, военных объектов и строек. Мобильного интернета у туристов обычно нет. У памятников ведут себя сдержанно и уважительно. Ларион объясняет правила до поездки и напоминает о них на месте.',
    secciones: [
      ['Фотосъёмка', 'Снимать на телефон и фотоаппарат можно. Нельзя снимать военных, военные объекты и стройки. Если не уверены, спросите гида. Памятники принято фотографировать целиком, не обрезая фигуры.'],
      ['Связь и интернет', 'Российские сим-карты в КНДР обычно не работают, мобильного интернета у туристов, как правило, нет. Предупредите родных, что несколько дней будете без связи.'],
      ['Прогулки и поведение', 'Выходить из гостиницы без гида нельзя. У памятников и в мемориальных местах ведут себя спокойно и уважительно. Не стоит обсуждать политику и шутить о руководстве страны.'],
      ['Что взять с собой', 'Наличные (доллары, евро или юани), лекарства, которые вы принимаете, переходник для розеток, тёплую одежду зимой. Литературу и электронику с материалами о Южной Корее лучше не брать.'],
      ['Что нельзя ввозить', 'Дроны, GPS-навигаторы, спутниковые телефоны и рации; религиозную, политическую и эротическую литературу; карты, на которых КНДР изображена неправильно; флешки и диски с непроверенными файлами. Полный список туроператор присылает перед поездкой.'],
      ['Деньги и обмен', 'Меняйте деньги только в гостинице или официальных пунктах — уличный обмен грозит потерей денег и депортацией. Северокорейские воны вывозить нельзя: потратьте их до отъезда или сдайте.'],
      ['Соцсети и прошлые публикации', 'Во въезде могут отказать тем, кто публично выкладывал материалы, порочащие КНДР. Журналистам туристическую визу обычно не дают — нужна отдельная аккредитация. Если сомневаетесь, скажите Лариону заранее.'],
    ],
  },
  {
    yol: 'vonsan-kalma-kurort', foto: 'wonsan', h1: 'Курорт Вонсан-Кальма: как попасть россиянам',
    titulo: 'Вонсан-Кальма 2027: как россиянам попасть на курорт в КНДР',
    desc: 'Курорт Вонсан-Кальма в Северной Корее открыт в июле 2025 года и принимает только россиян. Как попасть, сколько стоит, когда ехать.',
    otvet: 'Курорт Вонсан-Кальма на Японском море открылся в июле 2025 года. Иностранцев из других стран туда пока не пускают: курорт принимает туристов только из России. Попасть можно в составе тура через российского туроператора. Тур на 7 дней с сопровождающим Ларионом — от $6 900 на человека, летний сезон 2027 года.',
    secciones: [
      ['Где находится курорт', 'Кальма — песчаная коса у города Вонсан на восточном побережье КНДР. Здесь построены гостиницы, пляжи и аквапарк. Из Пхеньяна до Вонсана группа едет на транспорте туроператора или летит.'],
      ['Когда ехать', 'Пляжный сезон — лето, с июля по август. Даты групп на 2027 год туроператор публикует ближе к сезону; оставьте заявку Лариону, и он сообщит их первым.'],
      ['Как устроен тур', 'Сбор во Владивостоке, перелёт в Пхеньян, переезд в Вонсан, отдых на пляже и экскурсии по городу, возвращение через Пхеньян.'],
    ],
  },
  {
    yol: 'viza-v-kndr-dlya-rossiyan', foto: 'paektu', h1: 'Виза в КНДР для россиян',
    titulo: 'Виза в Северную Корею для россиян в 2027 году',
    desc: 'Нужна ли россиянам виза в КНДР, как её оформляют и какие нужны документы. Визу оформляет туроператор в составе тура.',
    otvet: 'Да, россиянам нужна виза в КНДР. Самостоятельно её не оформляют: визу делает аккредитованный туроператор в составе тура. Нужен заграничный паспорт РФ, действующий ещё 6 месяцев после поездки. Копию паспорта отправляют туроператору примерно за 30 дней до выезда; стоимость визы входит в цену тура.',
    secciones: [
      ['Документы', 'Скан или фото главной страницы загранпаспорта. Иногда туроператор просит сведения о месте работы. Ларион собирает документы всей группы и отправляет их вовремя.'],
      ['Сроки', 'Подавайте документы не позже чем за месяц до выезда. На праздничные даты (Новый год, День Солнца) места заканчиваются раньше, поэтому бронировать лучше за 2–3 месяца.'],
      ['Граждане других стран', 'Сейчас КНДР принимает туристов только с паспортом РФ. Граждане ЕС, США и других стран пока не могут поехать по туристической визе.'],
    ],
  },
]

const FAQ = [
  ['Можно ли россиянам поехать в Северную Корею?', 'Да. Сейчас КНДР принимает туристов только с паспортом РФ, в составе организованной группы через аккредитованного туроператора.'],
  ['Нужна ли виза в КНДР?', 'Да. Визу оформляет туроператор, её стоимость входит в цену тура. Нужен загранпаспорт, действующий ещё 6 месяцев после поездки.'],
  ['Сколько стоит тур в КНДР с Ларионом?', `От ${usd(4900)} на человека за 5 дней до ${usd(7900)} за 8 дней с горой Пэктусан. Индивидуальный VIP-тур — от ${usd(9900)}. Перелёт до Владивостока не входит.`],
  ['Можно ли снимать на телефон?', 'Да, кроме военных, военных объектов и строек. Если сомневаетесь, гид подскажет.'],
  ['Есть ли в КНДР интернет и связь?', 'У туристов обычно нет мобильного интернета, российские сим-карты, как правило, не работают. Связь ограничена.'],
  ['Можно ли гулять по городу одному?', 'Нет. Туристы передвигаются только с местными гидами, это правило для всех групп.'],
  ['Что взять с собой?', 'Наличные доллары, евро или юани для личных расходов, переходник для розеток, свои лекарства, тёплую одежду зимой.'],
  ['Можно ли поехать в КНДР самостоятельно?', 'Нет. Только в организованной группе или индивидуальном туре через аккредитованного туроператора; по стране вас всегда сопровождают местные гиды.'],
  ['Есть ли прямой рейс из Москвы в Пхеньян?', 'Да, Nordwind летает примерно раз в месяц (около 8 часов), но билеты продаются вместе с туром. Основной путь — Air Koryo из Владивостока.'],
  ['Сколько стоит обычный тур и чем VIP отличается?', 'Базовый групповой тур на 5 дней — примерно от 85 000 ₽ без дороги до Владивостока. VIP — это группа до 6 человек, отдельная машина, лучшие отели и Ларион 24/7.'],
  ['Можно ли поехать с детьми?', 'Да. Ребёнку нужен свой загранпаспорт, визу оформляют вместе с родителями. Семьям лучше всего подходят Вонсан-Кальма и индивидуальный тур.'],
  ['Можно ли вывезти воны и где менять деньги?', 'Воны вывозить нельзя. Меняйте только в гостинице или официальных пунктах.'],
  ['Могут ли отказать в визе?', 'Да: журналистам без аккредитации и тем, кто публично выкладывал материалы, порочащие КНДР. Расскажите Лариону заранее, если сомневаетесь.'],
  ['Что нельзя ввозить?', 'Дроны, GPS, спутниковые телефоны, рации, религиозную и политическую литературу, неправильные карты, флешки с непроверенными файлами.'],
  ['Почему ехать с Ларионом?', 'Один русскоязычный человек отвечает за всё: документы, перелёт, вопросы на месте. Группы маленькие, до 6 человек.'],
]

const CSS = `
:root{--bg:#f3f1ec;--papel:#fff;--tinta:#14213a;--suave:#5b6475;--linea:#ddd8cc;--acento:#b8322a;--chip:#e9e4d8;
--disp:"Unbounded","Arial Black",sans-serif;--cuerpo:"Golos Text",system-ui,-apple-system,"Segoe UI",sans-serif;--mono:"JetBrains Mono",ui-monospace,Menlo,monospace;color-scheme:light}
@media (prefers-color-scheme:dark){:root{--bg:#0f1524;--papel:#151d30;--tinta:#ebe8e1;--suave:#9aa3b5;--linea:#2a3550;--acento:#e0574d;--chip:#222c44;color-scheme:dark}}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--tinta);font:400 17px/1.65 var(--cuerpo)}
a{color:inherit}
a:focus-visible,.btn:focus-visible{outline:3px solid var(--acento);outline-offset:3px}
h1,h2,h3{font-family:var(--disp);line-height:1.15;text-wrap:balance;margin:0}
h1{font-size:clamp(28px,5vw,48px);font-weight:700}
h2{font-size:clamp(21px,3vw,28px);font-weight:500}
h3{font-size:17px;font-weight:500}
p{margin:0}
.kap{max-width:1040px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
.mono{font-family:var(--mono);font-variant-numeric:tabular-nums}
.ceja{font:500 12px/1.4 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--acento)}
header.top{background:var(--tinta);color:#f3f1ec}
@media (prefers-color-scheme:dark){header.top{background:#0a0f1b}}
header.top .kap{display:flex;flex-wrap:wrap;gap:8px 20px;align-items:center;justify-content:space-between;padding-block:12px}
header.top a{text-decoration:none}
header.top .marca{font:700 14px/1.2 var(--disp)}
header.top nav{display:flex;flex-wrap:wrap;gap:4px 16px;font-size:14px;opacity:.85}
.heroe{position:relative;min-height:min(72vh,640px);display:grid;color:#fff;overflow:hidden;background:#14213a}
.heroe img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.heroe .velo{position:relative;display:flex;align-items:flex-end;background:linear-gradient(180deg,rgba(10,15,27,.15) 0%,rgba(10,15,27,.82) 100%);padding-block:64px 48px}
.heroe .velo .kap{display:grid;gap:18px;width:100%}
.heroe .ceja{color:#ffb3ad}
.heroe .lead{font-size:19px;max-width:60ch;color:rgba(255,255,255,.88)}
.heroe .credito{position:absolute;right:8px;bottom:6px;font-size:11px;color:rgba(255,255,255,.7)}
.ruta{display:flex;align-items:center;gap:12px;font:500 13px/1 var(--mono);letter-spacing:.1em;color:rgba(255,255,255,.75)}
.ruta i{flex:0 1 120px;height:2px;background:repeating-linear-gradient(90deg,#ffb3ad 0 8px,transparent 8px 14px)}
.cta{display:flex;flex-wrap:wrap;gap:12px 18px;align-items:center}
.btn{display:inline-flex;align-items:center;padding:14px 24px;border-radius:999px;background:var(--acento);color:#fff;font:600 16px/1 var(--cuerpo);text-decoration:none}
.tel{font-family:var(--mono);user-select:all}
main section{padding-block:48px 0}
main section > .kap{display:grid;gap:20px}
.otvet{font-size:19px;line-height:1.6;max-width:68ch;border-left:3px solid var(--acento);padding-left:18px}
.tablo{background:var(--papel);border:1px solid var(--linea);border-radius:8px;overflow:hidden}
.tablo-cab,.tablo a{display:grid;grid-template-columns:130px minmax(0,1fr) 64px 120px;gap:16px;align-items:baseline;padding:16px 20px}
.tablo-cab{font:500 11px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--suave);border-bottom:1px solid var(--linea)}
.tablo a{text-decoration:none;border-bottom:1px solid var(--linea);transition:background .2s}
.tablo a:last-child{border-bottom:0}
.tablo a:hover{background:var(--chip)}
.tablo .f{font:500 14px/1.3 var(--mono);font-variant-numeric:tabular-nums}
.tablo .f.abierta{color:var(--acento)}
.tablo .r{font-size:14px;color:var(--suave);display:block;margin-top:2px}
.tablo .d{font:500 14px/1 var(--mono);color:var(--suave)}
.tablo .p{text-align:right;font:700 18px/1.2 var(--disp)}
@media (max-width:680px){.tablo-cab{display:none}.tablo a{grid-template-columns:1fr auto;gap:6px 12px}.tablo .n{grid-column:1/-1;order:-1}.tablo .d{text-align:right}.tablo .p{grid-column:1/-1;text-align:left}}
.dos{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:28px}
.lista{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.lista li{display:grid;grid-template-columns:22px minmax(0,1fr);gap:8px}
.lista li::before{content:"—";color:var(--acento);font-family:var(--mono)}
.regiones{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:14px;list-style:none;margin:0;padding:0}
.regiones li{background:var(--papel);border:1px solid var(--linea);border-radius:8px;padding:16px;display:grid;gap:6px}
.regiones.vip{grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))}
.regiones b{font-family:var(--disp);font-weight:500}
.regiones span{font-size:15px;color:var(--suave)}
.tarjetas{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:20px;list-style:none;margin:0;padding:0}
.tarjetas li{display:grid;gap:6px;align-content:start}
.tarjetas a{display:grid;text-decoration:none;background:var(--papel);border:1px solid var(--linea);border-radius:8px;overflow:hidden}
.tarjetas img{width:100%;height:auto;aspect-ratio:16/10;object-fit:cover;display:block}
.tarjetas .ti{padding:14px 16px;display:grid;gap:6px}
.tarjetas .ti p{font-size:15px;color:var(--suave)}
.tarjetas .ti .mono{color:var(--acento);font-size:14px}
.tarjetas small,.credito-txt{font-size:11px;color:var(--suave)}
.otzyvy{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:16px;list-style:none;margin:0;padding:0}
.otzyvy li{background:var(--papel);border:1px solid var(--linea);border-radius:8px;padding:18px;display:grid;gap:10px;align-content:start}
.otzyvy .est{color:var(--acento);letter-spacing:2px}
.otzyvy .de{font-size:14px;color:var(--suave)}
.datos{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr));gap:12px;list-style:none;margin:0;padding:0}
.datos li{background:var(--papel);border:1px solid var(--linea);border-radius:8px;padding:14px 16px;display:grid;gap:4px}
.datos span{font:500 11px/1.3 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--suave)}
.datos b{font:500 17px/1.3 var(--disp)}
ol.prog{margin:0;padding:0;list-style:none;display:grid;gap:10px;counter-reset:d}
ol.prog li{counter-increment:d;display:grid;grid-template-columns:72px minmax(0,1fr);gap:12px}
ol.prog li::before{content:"День " counter(d);font:500 13px/1.6 var(--mono);color:var(--acento)}
details{background:var(--papel);border:1px solid var(--linea);border-radius:8px;padding:14px 18px}
details+details{margin-top:10px}
summary{cursor:pointer;font-weight:600}
details p{margin-top:8px;color:var(--suave)}
.nota{font-size:14px;color:var(--suave);max-width:70ch}
.chip{display:inline-block;background:var(--chip);border-radius:4px;padding:1px 8px;font:500 13px/1.6 var(--mono)}
footer{margin-top:64px;background:var(--tinta);color:#e9e6df;padding-block:36px 96px;font-size:14px}
@media (prefers-color-scheme:dark){footer{background:#0a0f1b}}
footer .kap{display:grid;gap:10px}
.wa-fijo{position:fixed;right:max(16px,env(safe-area-inset-right,0px));bottom:max(16px,env(safe-area-inset-bottom,0px));background:#1f8f4e;color:#fff;text-decoration:none;font:600 15px/1 var(--cuerpo);padding:14px 20px;border-radius:999px;box-shadow:0 6px 20px rgba(0,0,0,.25);z-index:5}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`

const larion = {
  '@type': 'Person', '@id': `${BASE}/ru/kndr/#larion`, name: 'Ларион', alternateName: 'Larion',
  jobTitle: 'Сопровождающий туров в КНДР, русскоязычный гид', nationality: { '@type': 'Country', name: 'Россия' },
  knowsLanguage: ['ru', 'en'], homeLocation: { '@type': 'Place', name: 'Кансай, Япония' },
  worksFor: { '@type': 'Organization', '@id': `${BASE}/#organization`, name: 'Tony Kansai Guide', url: `${BASE}/` },
  url: `${BASE}/ru/kndr/`, sameAs: [`${BASE}/ru/`, `${BASE}/larion/`],
}

const NAV = [['Туры', '/ru/kndr/#tury'], ['VIP', '/ru/kndr/vip-tur-v-kndr/'], ['Цены', '/ru/kndr/skolko-stoit-tur-v-kndr/'], ['Виза', '/ru/kndr/viza-v-kndr-dlya-rossiyan/'], ['Правила', '/ru/kndr/pravila-dlya-turistov-v-kndr/'], ['Вонсан-Кальма', '/ru/kndr/vonsan-kalma-kurort/'], ['Как добраться', '/ru/kndr/kak-dobratsya-do-phenyana/'], ['Ларион в Японии', '/ru/']]

function pagina({ yol, titulo, desc, fotoOg, jsonld, cuerpo }) {
  const url = `${BASE}/ru/kndr/${yol ? `${yol}/` : ''}`
  return `<!doctype html>
<html lang="ru" data-estatica="kndr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="ru" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Tony Kansai Guide">
<meta property="og:locale" content="ru_RU">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${BASE}/ru/kndr/foto/${fotoOg}-1920.webp">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=JetBrains+Mono:wght@500&family=Unbounded:wght@500;700&display=swap">
<style>${CSS}</style>
</head>
<body>
<header class="top"><div class="kap"><a class="marca" href="/ru/kndr/">КНДР с Ларионом</a>
<nav aria-label="Разделы">${NAV.map(([t, h]) => `<a href="${h}">${t}</a>`).join('')}</nav></div></header>
<main>
${cuerpo}
</main>
<footer><div class="kap">
<p>Ларион — русскоязычный гид команды <a href="/ru/">Tony Kansai Guide</a> (Япония), гражданин России. Туры в КНДР проводит аккредитованный российский туроператор; в КНДР с группой работают местные гиды.</p>
<p>WhatsApp: <a href="${WA_GENERAL}">${WA_VISIBLE}</a> · <a href="mailto:tony@tonykansaiguide.com">tony@tonykansaiguide.com</a></p>
<p>Туры: ${TURY.map((t) => `<a href="/ru/kndr/${t.yol}/">${esc(t.nombre)}</a>`).join(' · ')}</p>
<p>Вопросы: ${OTVETY.map((o) => `<a href="/ru/kndr/${o.yol}/">${esc(o.h1)}</a>`).join(' · ')}</p>
<p>Ларион в Японии: <a href="/ru/">экскурсии по Киото, Осаке и Наре</a> · <a href="/larion/">Larion (English)</a> · Обновлено: ${HOY}</p>
</div></footer>
<a class="wa-fijo" href="${WA_GENERAL}">WhatsApp: Ларион</a>
</body>
</html>
`
}

const ctaBloque = (href = WA_GENERAL, texto = 'Написать Лариону в WhatsApp') => `<div class="cta"><a class="btn" href="${href}">${texto}</a><span class="tel">${WA_VISIBLE}</span></div>`

const tablo = `<div class="tablo" role="table" aria-label="Туры в КНДР 2027">
<div class="tablo-cab" role="row"><span>Даты</span><span>Тур</span><span>Дней</span><span style="text-align:right">Цена</span></div>
${TURY.map((t) => `<a role="row" href="/ru/kndr/${t.yol}/"><span class="f${/\d/.test(t.fechas) ? '' : ' abierta'}">${esc(t.fechas)}</span><div class="n"><h3>${esc(t.nombre)}</h3><span class="r">${esc(t.resumen)}</span></div><span class="d">${t.dias}</span><span class="p">от ${usd(t.precio)}</span></a>`).join('\n')}
</div>`

const otzyvyBloque = OTZYVY.length ? `<section id="otzyvy"><div class="kap">
<span class="ceja">${otzyvov(OTZYVY_TOTAL)} о Ларионе</span>
<h2>Что говорят туристы о Ларионе</h2>
<p class="nota">Это отзывы о турах Лариона по Японии (Киото, Осака, Нара). Туры в КНДР — новое направление; отзывы о них появятся после первых групп.</p>
<ul class="otzyvy">${OTZYVY.map((r) => `<li><span class="est" aria-label="${r.stars} из 5">${'★'.repeat(r.stars)}</span><p>${esc(r.text)}</p><span class="de">${esc(r.name)}${r.country ? ` · ${esc(r.country)}` : ''}${r.tour ? ` · ${esc(r.tour)}` : ''}</span></li>`).join('')}</ul>
<p><a href="/ru/#otzyvy">Все ${OTZYVY_TOTAL} отзывов →</a></p>
</div></section>` : ''

const oplata = `<section id="oplata"><div class="kap">
<span class="ceja">Оплата</span>
<h2>Как оплатить тур</h2>
<ul class="lista">
<li>Вы заключаете договор с российским туроператором.</li>
<li>Оплата в рублях российской картой или по счёту; валютная часть — по условиям программы. Зарубежные карты не нужны.</li>
<li>После подтверждения дат Ларион пришлёт договор и реквизиты.</li>
<li>Предоплата бронирует места в группе. На праздничные даты места заканчиваются за 2–3 месяца.</li>
</ul>
</div></section>`

// --- Portada ---
function portada() {
  const cuerpo = `${heroe('pyongyang', 'Панорама Пхеньяна', `<span class="ceja">VIP · группы до 6 человек · 2027</span>
<div class="ruta" aria-label="Маршрут Владивосток — Пхеньян"><span>VVO Владивосток</span><i></i><span>FNJ Пхеньян</span></div>
<h1>VIP-тур в Северную Корею с личным сопровождающим</h1>
<p class="lead">Ларион — русскоязычный гид, гражданин России, ${OTZYVY_TOTAL ? otzyvov(OTZYVY_TOTAL) : 'более 200 отзывов'} о его турах по Японии. Он встречает группу во Владивостоке, летит с вами в Пхеньян и отвечает за всё до возвращения домой.</p>
${ctaBloque()}`)}
<section><div class="kap">
<p class="otvet"><strong>Можно ли поехать в Северную Корею из России в 2027 году?</strong> Да. Сейчас КНДР принимает туристов только с паспортом РФ, в организованных группах через аккредитованного российского туроператора. Группы летят из Владивостока в Пхеньян. VIP-туры с сопровождающим Ларионом — от ${usd(4900)} на человека, визу оформляет туроператор.</p>
</div></section>
<section id="tury"><div class="kap">
<span class="ceja">Табло отправлений 2027</span>
<h2>Ближайшие выезды</h2>
${tablo}
<p class="nota">Цены ориентировочные, на человека, включают сопровождение Лариона. Перелёт до Владивостока не входит. Точные даты и программу подтверждает туроператор при бронировании.</p>
</div></section>
${vipBloque}
<section><div class="kap dos">
<div style="display:grid;gap:14px"><span class="ceja">Что делает Ларион</span><h2>Один человек отвечает за всё</h2>
<ul class="lista">
<li>Собирает документы группы и вовремя отправляет их на визу.</li>
<li>Встречает группу во Владивостоке и летит вместе с вами.</li>
<li>Объясняет правила поведения в КНДР до поездки и на месте.</li>
<li>Решает вопросы в поездке, пока вы отдыхаете.</li>
<li>Ведёт общий чат группы и остаётся на связи до возвращения.</li>
</ul></div>
<div style="display:grid;gap:14px"><span class="ceja">Кто может поехать</span><h2>Только с паспортом РФ</h2>
<p>Туристов из других стран КНДР пока не принимает. Нужен загранпаспорт, действующий ещё 6 месяцев после поездки. Въезд — только в группе; по стране туристы передвигаются с местными гидами.</p>
<p><a href="/ru/kndr/viza-v-kndr-dlya-rossiyan/">Как оформляется виза →</a></p></div>
</div></section>
<section id="otkuda"><div class="kap">
<span class="ceja">Откуда вы летите</span>
<h2>Сбор группы — во Владивостоке</h2>
<ul class="regiones">
<li><b>Москва и Санкт-Петербург</b><span>Перелёт до Владивостока или прямой поезд Москва — Пхеньян (ходит с июня 2025 года).</span></li>
<li><b>Новосибирск, Екатеринбург, Казань</b><span>Прямые или стыковочные рейсы до Владивостока.</span></li>
<li><b>Хабаровск и Владивосток</b><span>Ближе всего: сбор группы рядом с домом.</span></li>
</ul>
</div></section>
${oplata}
${otzyvyBloque}
<section id="voprosy"><div class="kap">
<span class="ceja">Вопросы</span><h2>Частые вопросы о поездке в КНДР</h2>
<div>${FAQ.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
<ul class="tarjetas">${OTVETY.map((o) => `<li><a href="/ru/kndr/${o.yol}/">${imagen(o.foto, o.h1, '(max-width:700px) 100vw, 340px')}<div class="ti"><h3>${esc(o.h1)}</h3></div></a><small>${credito(o.foto)}</small></li>`).join('')}</ul>
</div></section>
<section><div class="kap">
<h2>Ларион в Японии</h2>
<p>В остальное время Ларион проводит частные экскурсии по Японии на русском: Киото, Осака, Нара, Хиросима. <a href="/ru/">Страница Лариона →</a></p>
${ctaBloque()}
</div></section>`
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      larion,
      ...TURY.map(trip),
      { '@type': 'FAQPage', inLanguage: 'ru', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
  }
  yaz('', pagina({
    yol: '', fotoOg: 'pyongyang', jsonld, cuerpo,
    titulo: 'Туры в Северную Корею (КНДР) 2027 с сопровождающим из России — Ларион',
    desc: `VIP-туры в КНДР для россиян: Пхеньян, Масикрён, Пэктусан, Вонсан-Кальма. Малые группы до 6 человек, русскоязычный сопровождающий Ларион от Владивостока. От ${usd(4900)}.`,
  }))
}

function trip(t) {
  return {
    '@type': 'TouristTrip', '@id': `${BASE}/ru/kndr/${t.yol}/#tur`, name: t.nombre, description: t.resumen, inLanguage: 'ru',
    url: `${BASE}/ru/kndr/${t.yol}/`, image: `${BASE}/ru/kndr/foto/${t.foto}-1920.webp`,
    touristType: 'Граждане России', provider: { '@id': `${BASE}/ru/kndr/#larion` },
    itinerary: { '@type': 'Place', name: 'КНДР', address: { '@type': 'PostalAddress', addressCountry: 'KP' } },
    offers: { '@type': 'Offer', price: t.precio, priceCurrency: 'USD', availability: 'https://schema.org/PreOrder', url: `${BASE}/ru/kndr/${t.yol}/`, description: 'Ориентировочная цена на человека, включает сопровождение Лариона' },
  }
}

// --- Páginas de tour ---
function paginaTur(t) {
  const waTur = wa(`Здравствуйте, Ларион! Интересует тур «${t.nombre}» (${t.fechas}). Нас: `)
  const otros = TURY.filter((x) => x.yol !== t.yol).slice(0, 3)
  const cuerpo = `${heroe(t.foto, t.nombre, `<span class="ceja"><a href="/ru/kndr/" style="color:inherit">Туры в КНДР</a> · ${esc(t.fechas)}</span>
<h1>${esc(t.nombre)}</h1>
<p class="lead">${esc(t.resumen)}</p>
${ctaBloque(waTur, 'Забронировать место')}`)}
<section><div class="kap">
<p class="otvet">${esc(t.nombre)}: ${esc(t.fechas)}, ${t.dias} дн., от ${usd(t.precio)} на человека с русскоязычным сопровождающим Ларионом. Сбор группы во Владивостоке, только для граждан России. Визу оформляет туроператор.</p>
<ul class="datos">
<li><span>Даты</span><b class="mono">${esc(t.fechas)}</b></li>
<li><span>Дней</span><b>${t.dias}</b></li>
<li><span>Цена</span><b>от ${usd(t.precio)}</b></li>
<li><span>Сбор</span><b>Владивосток</b></li>
<li><span>Группа</span><b>до 6 человек</b></li>
<li><span>Класс</span><b>VIP</b></li>
</ul>
</div></section>
${vipBloque}
<section><div class="kap dos">
<div style="display:grid;gap:14px"><h2>Программа</h2><ol class="prog">${t.programa.map((p) => `<li>${esc(p)}</li>`).join('')}</ol>
<p class="nota">Программу по дням подтверждает туроператор; порядок экскурсий может меняться.</p></div>
<div style="display:grid;gap:14px"><h2>Что входит</h2><ul class="lista">${VKLYUCHENO.map((v) => `<li>${esc(v)}</li>`).join('')}</ul>
<h3>Не входит</h3><ul class="lista">${NE_VKLYUCHENO.map((v) => `<li>${esc(v)}</li>`).join('')}</ul></div>
</div></section>
${oplata}
<section><div class="kap">
<h2>Другие туры</h2>
<ul class="tarjetas">${otros.map((o) => `<li><a href="/ru/kndr/${o.yol}/">${imagen(o.foto, o.nombre, '(max-width:700px) 100vw, 340px')}<div class="ti"><span class="mono">${esc(o.fechas)} · от ${usd(o.precio)}</span><h3>${esc(o.nombre)}</h3></div></a><small>${credito(o.foto)}</small></li>`).join('')}</ul>
${ctaBloque(waTur, 'Спросить Лариона про этот тур')}
</div></section>`
  yaz(t.yol, pagina({
    yol: t.yol, fotoOg: t.foto, cuerpo,
    jsonld: { '@context': 'https://schema.org', '@graph': [larion, trip(t)] },
    titulo: `${t.nombre} — тур в КНДР ${t.fechas.includes('2027') ? t.fechas : '2027'} с сопровождающим`,
    desc: `${t.resumen} ${t.dias} дн., от ${usd(t.precio)}. Сбор во Владивостоке, сопровождающий Ларион, только для граждан России.`,
  }))
}

// --- Páginas de respuesta ---
function paginaOtvet(o) {
  const precios = `<ul class="datos">${TURY.map((t) => `<li><span>${esc(t.fechas)} · ${t.dias} дн.</span><b>${esc(t.nombre)}</b><a href="/ru/kndr/${t.yol}/">от ${usd(t.precio)}</a></li>`).join('')}</ul>`
  const cuerpo = `${heroe(o.foto, o.h1, `<span class="ceja"><a href="/ru/kndr/" style="color:inherit">Туры в КНДР</a> · ${HOY.slice(0, 4)}</span>
<h1>${esc(o.h1)}</h1>`)}
<section><div class="kap">
<p class="otvet">${esc(o.otvet)}</p>
${o.secciones.map(([h, txt]) => `<h2>${esc(h)}</h2>${txt === null ? precios : `<p style="max-width:68ch">${esc(txt)}</p>`}`).join('\n')}
<h2>Ближайшие туры с Ларионом</h2>
${tablo}
${ctaBloque()}
</div></section>`
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', headline: o.h1, inLanguage: 'ru', dateModified: HOY, author: { '@id': `${BASE}/ru/kndr/#larion` }, image: `${BASE}/ru/kndr/foto/${o.foto}-1920.webp`, mainEntityOfPage: `${BASE}/ru/kndr/${o.yol}/` },
      { '@type': 'FAQPage', inLanguage: 'ru', mainEntity: [{ '@type': 'Question', name: o.h1, acceptedAnswer: { '@type': 'Answer', text: o.otvet } }] },
      larion,
    ],
  }
  yaz(o.yol, pagina({ yol: o.yol, fotoOg: o.foto, jsonld, cuerpo, titulo: o.titulo, desc: o.desc }))
}

function yaz(yol, html) {
  const dir = join(root, 'public/ru/kndr', yol)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
}

portada()
TURY.forEach(paginaTur)
OTVETY.forEach(paginaOtvet)
console.log(`kndr: ${1 + TURY.length + OTVETY.length} páginas en public/ru/kndr/`)
