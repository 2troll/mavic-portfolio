// Ventajas para el viajero (/es/ventajas/, /en/perks/, /ar/perks/, /ru/perks/).
// Rehecha el 19-10-2026: un solo tema de noche con el bermellón del torii como
// único acento, y cada bloque con su propia forma (lista con vista previa,
// billetes, bento, rejilla de iconos, acordeón) en vez de tarjetas iguales.
// Movimiento: Lenis + GSAP (SplitText, ScrollTrigger) cargados en el cliente;
// con «reducir movimiento» la página queda quieta y entera.
// Las fichas de cada app (/es/ventajas/airalo/) siguen en FichaVentaja.tsx con ventajas.css.
// 17-11-2026: portada, «cómo se consigue cada ventaja», experiencias en tarjetas con ficha
// emergente, pase para recepción, códigos y «te lo digo claro» pasan a VentajasRB.tsx
// (componentes de React Bits) con las condiciones que pidió cada socio (datosCanje.ts).
// Se juntó con el rediseño paralelo del mismo día: sus cintas de socios y apps, y sus
// datos de un vistazo (Vistazo.tsx: desde, duración, grupo) van dentro de las tarjetas.
// 20-11-2026: la página va en partes numeradas con índice arriba (experiencias por zonas,
// códigos, apps, herramientas, acuerdos con socios y preguntas) y cada parte acaba en una
// sola acción. Cada socio enseña «cómo funciona» con él (Acuerdo.tsx) y la parte de
// acuerdos los junta en una tabla filtrable. Nunca comisiones ni códigos de agente.
import { PlanesVenta } from './PlanesVenta'
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { CORREO, enlaceGuia, NOTA_TG, PAGINAS } from './contenido'
import { CabeceraEs } from './CabeceraEs'
import { PieEs } from './PieEs'
import { Logo } from './Logo'
import { IconoWa, IconoCanal } from './IconoWa'
import { enlacesHreflang } from '../seo/hreflang'
import { PIE } from './formato'
import { APPS, CATEGORIAS, SEO_VENTAJAS, cuponDe, enKansai, esAfiliado, enlaceDe, type Categoria } from './datosVentajas'
import { LOGOS, ICONOS_APP } from './logosMarcas'
import { PortadaRB, ComoFunciona, ExperienciasRB, CodigosRB, ClaroRB, PaseTony, TablaAcuerdos, CON_CODIGO, FILAS_ACUERDOS } from './VentajasRB'
import type { Acuerdo } from './datosCanje'
import { AYUDA, type Enlace } from './datosAyudaViaje'
import { FichaApp, textoApp } from './FichaVentaja'
import { HerramientasEnGuia, HERRAMIENTAS, esLenguaKit } from './KitGuia'
const Pagina404 = lazy(() => import('./Pagina404'))
import { ICONO_EXP } from './iconosExperiencia'
import './v7.css'
import './ventajas.css'
import './ventajas-noche.css'
import './partes.css'

export type VentajasId = 'es' | 'en' | 'ar' | 'ru'
const BASE = 'https://tonykansaiguide.com'

export const RUTAS_VENTAJAS: Record<string, VentajasId> = {
  '/es/ventajas': 'es',
  '/en/perks': 'en',
  '/ar/perks': 'ar',
  '/ru/perks': 'ru',
}
const RUTA: Record<VentajasId, string> = { es: '/es/ventajas/', en: '/en/perks/', ar: '/ar/perks/', ru: '/ru/perks/' }



type Textos = {
  titulo: string; descripcion: string; antetitulo: string; h1: string; sub: string
  copiar: string; copiado: string; codigo: string
  consejosTitulo: string; consejos: string[]
  aviso: string; finalTitulo: string; finalTexto: string; finalBoton: string; volver: string; saludo: string
}

const T: Record<VentajasId, Textos> = {
  es: {
    titulo: SEO_VENTAJAS.es.titulo,
    descripcion: SEO_VENTAJAS.es.descripcion,
    antetitulo: '🎁 Ventajas para mis viajeros',
    h1: 'Experiencias y apps para vivir Kansai como un local',
    sub: 'Primero, las experiencias de mis socios: kimono, samuráis, cuchillos, cocina y talleres, varias con ventaja por venir de mi parte. Después, las apps que uso en Osaka y Kioto: internet, entradas, hotel, taxi, bici y pagos.',
    copiar: 'Copiar código', copiado: '¡Copiado!', codigo: 'Mi código',
    consejosTitulo: 'Mis consejos',
    consejos: [
      'En patinete, siempre por la calzada y por la izquierda; por la acera está prohibido salvo en modo 6 km/h.',
      'Antes de salir, mira en la app que el punto de llegada tenga hueco: si está lleno, sigues pagando mientras buscas otro.',
      'Paga en yenes, nunca en euros o dólares cuando el datáfono te lo ofrezca: el cambio del comercio es peor.',
    ],
    aviso: 'Algunos enlaces son de invitación: si te registras con ellos, la app puede darme una pequeña recompensa a mí también. No cambia tu precio.',
    finalTitulo: '¿Prefieres no pelearte con apps?', finalTexto: 'En mis tours me ocupo yo de todos los desplazamientos: te recojo en el hotel y vamos juntos.', finalBoton: 'Escríbeme por WhatsApp', volver: 'Volver a la página de Tony',
    saludo: 'Hola Tony, he visto tu página de ventajas y quería preguntarte por un tour.',
  },
  en: {
    titulo: SEO_VENTAJAS.en.titulo,
    descripcion: SEO_VENTAJAS.en.descripcion,
    antetitulo: '🎁 Perks for my travellers',
    h1: 'Experiences and apps to live Kansai like a local',
    sub: 'First, my partners’ experiences: kimono, samurai, knives, cooking and workshops, several with a perk for coming through me. Then the apps I use in Osaka and Kyoto: data, tickets, hotels, taxis, bikes and payments.',
    copiar: 'Copy code', copiado: 'Copied!', codigo: 'My code',
    consejosTitulo: 'My tips',
    consejos: [
      'On a scooter, always ride on the road and keep left; pavements are off-limits except in 6 km/h mode.',
      'Before you set off, check in the app that the drop-off port has space: if it is full you keep paying while you look for another.',
      'Always pay in yen, never in your home currency when the card machine offers it: the shop rate is worse.',
    ],
    aviso: 'Some links are invite links: if you sign up with them the app may give me a small reward too. Your price does not change.',
    finalTitulo: 'Rather not deal with apps?', finalTexto: 'On my tours I handle all the getting around: I pick you up at your hotel and we go together.', finalBoton: 'Message me on WhatsApp', volver: "Back to Tony's page",
    saludo: 'Hi Tony, I saw your perks page and wanted to ask about a tour.',
  },
  ar: {
    titulo: SEO_VENTAJAS.ar.titulo,
    descripcion: SEO_VENTAJAS.ar.descripcion,
    antetitulo: '🎁 مزايا لضيوفي',
    h1: 'تجارب وتطبيقات لتعيش كانساي مثل أهل البلد',
    sub: 'أولًا تجارب شركائي: الكيمونو والساموراي والسكاكين والطبخ والورش، وبعضها بميزة لأنك قادم من طرفي. ثم التطبيقات التي أستخدمها في أوساكا وكيوتو: الإنترنت والتذاكر والفنادق والتاكسي والدراجات والدفع.',
    copiar: 'نسخ الرمز', copiado: 'تم النسخ!', codigo: 'رمزي',
    consejosTitulo: 'نصائحي',
    consejos: [
      'بالسكوتر، سِر دائمًا على الطريق وفي الجهة اليسرى؛ الرصيف ممنوع إلا في وضع 6 كم/ساعة.',
      'قبل الانطلاق، تأكد في التطبيق أن محطة الوصول فيها مكان؛ إن كانت ممتلئة يستمر العدّاد وأنت تبحث عن غيرها.',
      'ادفع دائمًا بالين، لا بعملة بلدك عندما يعرض جهاز الدفع ذلك؛ سعر المتجر أسوأ.',
    ],
    aviso: 'بعض الروابط روابط دعوة: إذا سجّلت بها قد يمنحني التطبيق مكافأة صغيرة أيضًا. سعرك لا يتغير.',
    finalTitulo: 'تفضّل ألّا تتعب مع التطبيقات؟', finalTexto: 'في جولاتي أتولّى أنا كل التنقلات: آخذك من الفندق ونذهب معًا.', finalBoton: 'راسلني على واتساب', volver: 'العودة إلى صفحة توني',
    saludo: 'السلام عليكم توني، رأيت صفحة المزايا وأريد أن أسأل عن جولة.',
  },
  ru: {
    titulo: SEO_VENTAJAS.ru.titulo,
    descripcion: SEO_VENTAJAS.ru.descripcion,
    antetitulo: 'Полезное для наших гостей',
    h1: 'Впечатления и приложения, чтобы прожить Кансай как местный',
    sub: 'Сначала — впечатления наших партнёров: кимоно, самураи, ножи, кулинария и мастерские. Затем — приложения для Осаки и Киото: интернет, билеты, отели, такси, велосипеды и оплата.',
    copiar: 'Скопировать код', copiado: 'Скопировано!', codigo: 'Код',
    consejosTitulo: 'Советы',
    consejos: [
      'На самокате ездите только по проезжей части и по левой стороне; по тротуару нельзя, кроме режима 6 км/ч.',
      'Перед поездкой проверьте в приложении, что на месте возврата есть свободное место: иначе счётчик идёт, пока ищете другое.',
      'Всегда платите в иенах, а не в своей валюте, когда терминал предлагает выбор: курс магазина хуже.',
    ],
    aviso: 'Некоторые ссылки партнёрские: если вы покупаете через них, сервис платит нам небольшую комиссию. Для вас цена не меняется.',
    finalTitulo: 'Не хотите разбираться с приложениями?', finalTexto: 'На экскурсии Ларион берёт все поездки на себя: встречает в отеле, и вы едете вместе.', finalBoton: 'Написать в Telegram', volver: 'На страницу Лариона',
    saludo: 'Здравствуйте, Ларион! Увидел страницу с полезными приложениями и хочу спросить об экскурсии.',
  },
}

/** Marcas de fondo claro (Agoda, Google…): en la tarjeta blanca el acento y el botón
 *  usan su color de botón, que sí se ve. */
function colorTarjeta(a: (typeof APPS)[number]) {
  const hex = a.marca.fondo.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const claro = 0.299 * r + 0.587 * g + 0.114 * b > 200
  return claro && a.marca.boton
    ? { ['--acento' as string]: a.marca.boton, ['--acento-tinta' as string]: a.marca.botonTinta ?? '#fff' }
    : { ['--acento' as string]: a.marca.fondo, ['--acento-tinta' as string]: a.marca.tinta }
}

const APPS_T: Record<VentajasId, { titulo: string; sub: string }> = {
  es: { titulo: 'Las apps que uso en Kansai', sub: 'Internet, entradas, hotel, transporte y pagos. Filtra por lo que necesitas y abre la ficha para ver cómo funciona cada una.' },
  en: { titulo: 'The apps I use in Kansai', sub: 'Data, tickets, hotels, transport and payments. Filter by what you need and open each card to see how it works.' },
  ar: { titulo: 'التطبيقات التي أستخدمها في كانساي', sub: 'الإنترنت والتذاكر والفنادق والتنقل والدفع. اختر ما تحتاجه وافتح البطاقة لترى كيف يعمل كل تطبيق.' },
  ru: { titulo: 'Приложения, которыми мы пользуемся в Кансае', sub: 'Интернет, билеты, отели, транспорт и оплата. Выберите нужное и откройте карточку, чтобы узнать подробности.' },
}

const TODAS: Record<VentajasId, string> = { es: 'Todas', en: 'All', ar: 'الكل', ru: 'Все' }

// Dibujo de cada app (Tabler Icons, MIT; sprite en /v7/ventajas-dibujos.svg).
const DIBUJO: Record<string, string> = {
  airalo: 'device-mobile', klook: 'ticket', gyg: 'compass', trip: 'plane', agoda: 'bed', booking: 'building-skyscraper',
  icoca: 'train', go: 'car', uber: 'steering-wheel', luup: 'scooter-electric', hello: 'bike', wise: 'credit-card',
  maps: 'map-2', traductor: 'language', kkday: 'camera', welcome: 'plane-arrival', radical: 'luggage',
  tiqets: 'ticket', kiwitaxi: 'car', intui: 'plane-arrival', yesim: 'device-mobile', iati: 'shield-check', airhelp: 'plane', mobal: 'device-mobile', flytographer: 'camera',
}
const Dibujo = ({ n, className }: { n: string; className?: string }) => (
  <svg className={className} aria-hidden="true"><use href={`/v7/ventajas-dibujos.svg#${n}`} /></svg>
)

// Icono pequeño de la app, como en la pantalla de inicio del móvil.
function IconoApp({ a }: { a: (typeof APPS)[number] }) {
  const palabra = a.marca.palabra ?? ''
  const corta = palabra.length <= 4 ? palabra : palabra.charAt(0)
  // Socios sin logo propio: icono Lucide de lo que hacen (kimono, té, cuchillo…), no el kanji.
  const Ico = !ICONOS_APP.has(a.clave) && !a.marca.logo ? ICONO_EXP[a.clave] : undefined
  if (Ico) return (
    <span className="vt-ico vt-ico-lucide" style={{ ['--marca' as string]: a.marca.fondo, ['--marca-tinta' as string]: a.marca.tinta }} aria-hidden="true"><Ico strokeWidth={1.7} /></span>
  )
  return (
    <span className={`vt-ico${ICONOS_APP.has(a.clave) ? ' vt-ico-real' : ''}`} style={{ ['--marca' as string]: a.marca.fondo, ['--marca-tinta' as string]: a.marca.tinta }} aria-hidden="true">
      {ICONOS_APP.has(a.clave) ? <img src={`/v7/apps/${a.clave}.webp`} alt="" width="128" height="128" loading="lazy" decoding="async" /> : a.marca.logo ? <svg viewBox="0 0 24 24"><path d={LOGOS[a.marca.logo]} fill="currentColor" /></svg> : DIBUJO[a.clave] ? <Dibujo n={DIBUJO[a.clave]} className="vt-ico-dibujo" /> : <b dir="ltr">{corta}</b>}
      {!ICONOS_APP.has(a.clave) && !DIBUJO[a.clave] && a.marca.puntos && <span className="vt-ico-puntos">{a.marca.puntos.map((c) => <i key={c} style={{ background: c }} />)}</span>}
    </span>
  )
}


// El kit en tres momentos del viaje: qué instalar y cuándo.
const PASOS: Record<VentajasId, { titulo: string; lista: { n: string; t: string; d: string; apps: string[] }[] }> = {
  es: { titulo: 'Tu kit en 3 pasos', lista: [
    { n: 'plane', t: 'Antes de volar', d: 'Instala la eSIM y la tarjeta en casa, con wifi y sin prisas.', apps: ['airalo', 'wise', 'klook'] },
    { n: 'plane-arrival', t: 'Al aterrizar', d: 'Traslado al hotel, ICOCA en el móvil y tus sitios guardados en Maps.', apps: ['welcome', 'icoca', 'maps'] },
    { n: 'route', t: 'Por la ciudad', d: 'Taxi con un toque, patinete o bici para lo que el tren no cubre.', apps: ['go', 'luup', 'hello'] },
  ] },
  en: { titulo: 'Your kit in 3 steps', lista: [
    { n: 'plane', t: 'Before you fly', d: 'Install the eSIM and the card at home, on wifi, no rush.', apps: ['airalo', 'wise', 'klook'] },
    { n: 'plane-arrival', t: 'When you land', d: 'Transfer to your hotel, ICOCA on your phone and your places saved in Maps.', apps: ['welcome', 'icoca', 'maps'] },
    { n: 'route', t: 'Around the city', d: 'One-tap taxis, scooters or bikes for what the train misses.', apps: ['go', 'luup', 'hello'] },
  ] },
  ar: { titulo: 'عُدّتك في 3 خطوات', lista: [
    { n: 'plane', t: 'قبل السفر', d: 'ثبّت شريحة eSIM والبطاقة في بيتك، على الواي فاي وبلا عجلة.', apps: ['airalo', 'wise', 'klook'] },
    { n: 'plane-arrival', t: 'عند الوصول', d: 'التوصيل إلى الفندق وICOCA على هاتفك وأماكنك محفوظة في الخرائط.', apps: ['welcome', 'icoca', 'maps'] },
    { n: 'route', t: 'في المدينة', d: 'تاكسي بلمسة، وسكوتر أو دراجة لما لا يصل إليه القطار.', apps: ['go', 'luup', 'hello'] },
  ] },
  ru: { titulo: 'Ваш набор в 3 шага', lista: [
    { n: 'plane', t: 'До вылета', d: 'Установите eSIM и карту дома, по Wi-Fi и без спешки.', apps: ['airalo', 'wise', 'klook'] },
    { n: 'plane-arrival', t: 'После посадки', d: 'Трансфер из аэропорта Кансай, ICOCA в телефоне и сохранённые места в Google Картах.', apps: ['welcome', 'icoca', 'maps'] },
    { n: 'route', t: 'По городу', d: 'Такси в одно касание, самокат или велосипед туда, куда не идёт поезд.', apps: ['go', 'luup', 'hello'] },
  ] },
}

// Enlace de una respuesta: a la ficha de una app, a una guía de la web o fuera.
function EnlaceAyuda({ e, lista }: { e: Enlace; lista: string }) {
  if (e.app) return <Link to={`${lista}${e.app}/`}>{e.texto}</Link>
  if (e.guia) return <Link to={e.guia}>{e.texto}</Link>
  return <a href={e.href} target="_blank" rel="noopener noreferrer">{e.texto}</a>
}

// Franja de códigos arriba del todo: el cliente los tiene a mano sin buscar tarjeta por tarjeta.
const SOCIOS: Record<VentajasId, { titulo: string; texto: string; boton: string; asunto: string }> = {
  es: { titulo: '¿Tienes un negocio en Kansai?', texto: 'Busco colaboraciones con empresas pequeñas y medianas de Osaka, Kioto, Nara y Kobe: talleres, tiendas, cafés, experiencias. Si tu negocio puede interesar a mis viajeros, escríbeme y lo presento aquí y en mis tours.', boton: 'Proponer una colaboración', asunto: 'Colaboración con Tony Kansai Guide' },
  en: { titulo: 'Do you run a business in Kansai?', texto: "I'm looking to collaborate with small and medium businesses in Osaka, Kyoto, Nara and Kobe: workshops, shops, cafés, experiences. If your business could interest my travellers, email me and I'll feature it here and on my tours.", boton: 'Propose a collaboration', asunto: 'Collaboration with Tony Kansai Guide' },
  ar: { titulo: 'هل لديك نشاط تجاري في كانساي؟', texto: 'أبحث عن تعاون مع الشركات الصغيرة والمتوسطة في أوساكا وكيوتو ونارا وكوبي: ورش، متاجر، مقاهٍ، تجارب. إذا كان نشاطك يهمّ ضيوفي، راسلني وسأعرّف به هنا وفي جولاتي.', boton: 'اقترح تعاونًا', asunto: 'تعاون مع Tony Kansai Guide' },
  ru: { titulo: 'У вас бизнес в Кансае?', texto: 'Ищу сотрудничество с небольшими и средними компаниями Осаки, Киото, Нары и Кобе: мастерские, магазины, кафе, впечатления. Если ваш бизнес может заинтересовать моих гостей, напишите мне — я расскажу о нём здесь и на своих турах.', boton: 'Предложить сотрудничество', asunto: 'Сотрудничество с Tony Kansai Guide' },
}

const CODIGOS: Record<VentajasId, { titulo: string; sub: string; hasta: string; ver: string; ir: string; enlaces: string; enlacesSub: string; claro: string; claroTexto: string }> = {
  es: { titulo: 'Tus códigos de descuento', sub: 'Cópialo y pégalo al pagar en la web o la app de cada uno.', hasta: 'hasta el', ver: 'Cómo usarlo', ir: 'Ir a la web', enlaces: 'Reserva con mis enlaces', enlacesSub: 'Entra desde aquí y la web sabe que vienes de mi parte.', claro: 'Te lo digo claro', claroTexto: 'Cuando reservas con mis enlaces o códigos, la empresa me paga una pequeña comisión. A ti no te cuesta nada más: el precio es el mismo y, con código, incluso menor. Solo recomiendo lo que uso yo con mis clientes, y así me ayudas a mantener esta guía gratis.' },
  en: { titulo: 'Your discount codes', sub: 'Copy one and paste it at checkout on their website or app.', hasta: 'until', ver: 'How to use it', ir: 'Go to website', enlaces: 'Book with my links', enlacesSub: 'Come in from here and the site knows I sent you.', claro: 'To be clear', claroTexto: 'When you book with my links or codes, the company pays me a small commission. It costs you nothing extra: the price is the same, and with a code it is even lower. I only recommend what I use with my own guests, and it helps me keep this guide free.' },
  ar: { titulo: 'رموز الخصم الخاصة بك', sub: 'انسخ الرمز والصقه عند الدفع في موقعهم أو تطبيقهم.', hasta: 'حتى', ver: 'طريقة الاستخدام', ir: 'افتح الموقع', enlaces: 'احجز عبر روابطي', enlacesSub: 'ادخل من هنا ليعرف الموقع أنك قادم من طرفي.', claro: 'بكل وضوح', claroTexto: 'عندما تحجز عبر روابطي أو رموزي، تدفع لي الشركة عمولة صغيرة. لا يكلّفك ذلك شيئًا إضافيًا: السعر نفسه، ومع الرمز يكون أقل. لا أنصح إلا بما أستخدمه مع ضيوفي، وبذلك تساعدني على إبقاء هذا الدليل مجانيًا.' },
  ru: { titulo: 'Ваши коды на скидку', sub: 'Скопируйте код и вставьте при оплате на их сайте или в приложении.', hasta: 'до', ver: 'Как использовать', ir: 'Открыть сайт', enlaces: 'Бронируйте по моим ссылкам', enlacesSub: 'Заходите отсюда — сайт поймёт, что вы от меня.', claro: 'Честно', claroTexto: 'Когда вы бронируете по моим ссылкам или кодам, компания платит мне небольшую комиссию. Для вас это ничего не стоит: цена та же, а с кодом даже ниже. Я советую только то, чем пользуюсь со своими гостями, и так вы помогаете сохранить этот гид бесплатным.' },
}


const GUARDA: Record<VentajasId, { boton: string; nota: string; msg: string; todo: string }> = {
  es: { boton: 'Mándatelos a tu WhatsApp', nota: 'Así los tienes a mano durante todo el viaje por Japón.', msg: 'Mis descuentos para Japón (Tony Kansai Guide):', todo: 'Todo aquí:' },
  en: { boton: 'Send them to your WhatsApp', nota: 'Keep them at hand for your whole trip in Japan.', msg: 'My discounts for Japan (Tony Kansai Guide):', todo: 'Everything here:' },
  ar: { boton: 'أرسلها إلى واتساب الخاص بك', nota: 'لتبقى في متناولك طوال رحلتك في اليابان.', msg: 'خصوماتي لرحلة اليابان (Tony Kansai Guide):', todo: 'كل شيء هنا:' },
  ru: { boton: 'Отправить себе в WhatsApp', nota: 'Пусть будут под рукой всю поездку по Японии.', msg: 'Мои скидки для Японии (Tony Kansai Guide):', todo: 'Всё здесь:' },
}
const URL_VENTAJAS: Record<VentajasId, string> = { es: 'https://tonykansaiguide.com/es/ventajas/', en: 'https://tonykansaiguide.com/en/perks/', ar: 'https://tonykansaiguide.com/ar/perks/', ru: 'https://tonykansaiguide.com/ru/perks/' }

// Foto de cada momento del kit (la grande y la tercera llevan foto; la del medio, el color de acento).
const FOTO_KIT = ['/v8/zonas/kioto-kiyomizu-900.webp', '', '/v8/zonas/osaka-dotonbori-900.webp']

const EXPERIENCIAS = APPS.filter((a) => a.cat === 'experiencias')
// Kansai primero (es donde guiamos) y, dentro de cada zona, las de ventaja propia
// y las aptas para musulmanes delante: es lo que más vende.
const peso = (a: App) => (enKansai(a) ? 10 : 0) + Number(!!a.conTony) + Number(!!a.musulman)
const ORDENADAS = [...EXPERIENCIAS].sort((a, b) => peso(b) - peso(a))
const APPS_REJILLA = APPS.filter((a) => a.cat !== 'experiencias')

type App = (typeof APPS)[number]

function Barra({ id, sufijo, wa, boton }: { id: VentajasId; sufijo: string; wa: string; boton: string }) {
  const NOMBRE: Record<VentajasId, string> = { es: 'ES', en: 'EN', ar: 'عربي', ru: 'RU' }
  return (
    <header className="vt-barra">
      <Link to={id === 'ru' ? '/ru/' : `/${id}/`} className="vt-marca" aria-label="Tony Kansai Guide"><Logo /></Link>
      <nav className="vt-idiomas" aria-label="Language">
        {(Object.keys(RUTA) as VentajasId[]).map((k) => (
          <Link key={k} to={`${RUTA[k]}${sufijo}`} lang={k} aria-current={k === id ? 'page' : undefined}>{NOMBRE[k]}</Link>
        ))}
      </nav>
      <a className="vt-wa" href={wa} target="_blank" rel="noopener noreferrer" aria-label={boton}>
        <IconoCanal tg={id === 'ru'} /><span className="vt-solo-ancho">{boton}</span>
      </a>
    </header>
  )
}

function Pie({ id }: { id: VentajasId }) {
  const pie = PIE[id]
  return (
    <footer className="vt-pie">
      <span><Logo /></span>
      <a href={`mailto:${CORREO}`}>{CORREO}</a>
      <nav>
        <Link to={`/legal/?lang=${id}`}>{pie.legal}</Link>
        <Link to={`/terms/?lang=${id}`}>{pie.condiciones}</Link>
        <Link to={`/privacy/?lang=${id}`}>{pie.privacidad}</Link>
      </nav>
    </footer>
  )
}


// ── Partes de la página (20-11-2026) ─────────────────────────────────────
// Seis partes numeradas, cada una con su cifra y una sola acción al final. El ruso
// (página de Larion) no tiene herramientas gratis: allí son cinco y se renumeran.

type ParteK = 'exp' | 'cod' | 'apps' | 'herr' | 'acu' | 'faq'
const ORDEN_PARTES: ParteK[] = ['exp', 'cod', 'apps', 'herr', 'acu', 'faq']
const ID_PARTE: Record<ParteK, string> = { exp: 'experiencias', cod: 'codigos', apps: 'apps', herr: 'herramientas', acu: 'acuerdos', faq: 'preguntas' }
type Parte = { k: ParteK; id: string; t: string; corto: string; d: string; cuenta: number }

const PARTES_T: Record<VentajasId, Record<ParteK, { t: string; corto: string; d: string }>> = {
  es: {
    exp: { t: 'Experiencias con mis socios', corto: 'Experiencias', d: 'Talleres, kimono, té y cocina por zonas, con lo que acordé con cada socio.' },
    cod: { t: 'Códigos de descuento', corto: 'Códigos', d: 'Cópialos y pégalos al pagar: el descuento es para ti.' },
    apps: { t: 'Apps y servicios para el viaje', corto: 'Apps', d: 'Internet, traslados, hotel, transporte y pagos que uso en Kansai.' },
    herr: { t: 'Herramientas gratis', corto: 'Herramientas', d: 'Tarjetas en japonés, trenes y planificador, sin registrarte.' },
    acu: { t: 'Acuerdos con mis socios', corto: 'Acuerdos', d: 'Todos los socios en una tabla: qué acordamos, qué te toca hacer y cuándo se actualizó.' },
    faq: { t: 'Preguntas frecuentes', corto: 'Preguntas', d: 'Aeropuerto, taxi, maletas, dinero y emergencias.' },
  },
  en: {
    exp: { t: 'Experiences with my partners', corto: 'Experiences', d: 'Workshops, kimono, tea and cooking by area, with what I agreed with each partner.' },
    cod: { t: 'Discount codes', corto: 'Codes', d: 'Copy and paste them at checkout: the discount is yours.' },
    apps: { t: 'Apps and services for your trip', corto: 'Apps', d: 'Data, transfers, hotels, transport and payments I use in Kansai.' },
    herr: { t: 'Free tools', corto: 'Tools', d: 'Japanese cards, train times and a planner, no sign-up.' },
    acu: { t: 'Partner agreements', corto: 'Agreements', d: 'Every partner in one table: what we agreed, what you do and when it was updated.' },
    faq: { t: 'Frequently asked questions', corto: 'Questions', d: 'Airport, taxis, luggage, money and emergencies.' },
  },
  ar: {
    exp: { t: 'تجارب مع شركائي', corto: 'التجارب', d: 'ورش وكيمونو وشاي وطبخ حسب المنطقة، مع ما اتفقت عليه مع كل شريك.' },
    cod: { t: 'رموز الخصم', corto: 'الرموز', d: 'انسخها والصقها عند الدفع: الخصم لك.' },
    apps: { t: 'تطبيقات وخدمات لرحلتك', corto: 'التطبيقات', d: 'الإنترنت والتوصيل والفنادق والتنقل والدفع التي أستخدمها في كانساي.' },
    herr: { t: 'أدوات مجانية', corto: 'الأدوات', d: 'بطاقات باليابانية ومواعيد القطارات ومخطط للرحلة، بلا تسجيل.' },
    acu: { t: 'الاتفاقات مع شركائي', corto: 'الاتفاقات', d: 'كل الشركاء في جدول واحد: ما اتفقنا عليه وما عليك فعله ومتى حُدّث.' },
    faq: { t: 'أسئلة شائعة', corto: 'أسئلة', d: 'المطار والتاكسي والحقائب والمال والطوارئ.' },
  },
  ru: {
    exp: { t: 'Впечатления с нашими партнёрами', corto: 'Впечатления', d: 'Мастер-классы, кимоно, чай и кухня по регионам — с условиями каждого партнёра.' },
    cod: { t: 'Коды на скидку', corto: 'Коды', d: 'Скопируйте и вставьте при оплате: скидка ваша.' },
    apps: { t: 'Приложения и сервисы для поездки', corto: 'Приложения', d: 'Интернет, трансферы, отели, транспорт и оплата в Кансае.' },
    herr: { t: 'Бесплатные инструменты', corto: 'Инструменты', d: '' },
    acu: { t: 'Договорённости с партнёрами', corto: 'Партнёры', d: 'Все партнёры в одной таблице: о чём договорились, что сделать вам и когда обновлено.' },
    faq: { t: 'Частые вопросы', corto: 'Вопросы', d: 'Аэропорт, такси, багаж, деньги и экстренные случаи.' },
  },
}

/** «36 experiencias», «41 شريكًا», «41 партнёр»: la palabra que va con cada cifra. */
const UNIDAD: Record<VentajasId, Record<ParteK, string[]>> = {
  es: { exp: ['experiencia', 'experiencias'], cod: ['código', 'códigos'], apps: ['app', 'apps'], herr: ['herramienta', 'herramientas'], acu: ['socio', 'socios'], faq: ['respuesta', 'respuestas'] },
  en: { exp: ['experience', 'experiences'], cod: ['code', 'codes'], apps: ['app', 'apps'], herr: ['tool', 'tools'], acu: ['partner', 'partners'], faq: ['answer', 'answers'] },
  // Árabe: de 3 a 10, plural; de 11 en adelante, singular.
  ar: { exp: ['تجربة', 'تجارب'], cod: ['رمزًا', 'رموز'], apps: ['تطبيقًا', 'تطبيقات'], herr: ['أداة', 'أدوات'], acu: ['شريكًا', 'شركاء'], faq: ['سؤالًا', 'أسئلة'] },
  // Ruso: 1 партнёр, 2–4 партнёра, 5–20 партнёров.
  ru: { exp: ['впечатление', 'впечатления', 'впечатлений'], cod: ['код', 'кода', 'кодов'], apps: ['приложение', 'приложения', 'приложений'], herr: ['инструмент', 'инструмента', 'инструментов'], acu: ['партнёр', 'партнёра', 'партнёров'], faq: ['ответ', 'ответа', 'ответов'] },
}
function unidad(k: ParteK, n: number, id: VentajasId): string {
  const f = UNIDAD[id][k]
  if (id === 'ar') return n >= 3 && n <= 10 ? f[1] : f[0]
  if (id === 'ru') { const d = n % 10, c = n % 100; return d === 1 && c !== 11 ? f[0] : d >= 2 && d <= 4 && (c < 12 || c > 14) ? f[1] : f[2] }
  return n === 1 ? f[0] : f[1]
}

const EN_ESTA: Record<VentajasId, string> = { es: 'En esta página', en: 'On this page', ar: 'في هذه الصفحة', ru: 'На этой странице' }
const PARTE_DE: Record<VentajasId, (n: number, t: number) => string> = {
  es: (n, t) => `Parte ${n} de ${t}`, en: (n, t) => `Part ${n} of ${t}`, ar: (n, t) => `الجزء ${n} من ${t}`, ru: (n, t) => `Часть ${n} из ${t}`,
}
const PARTES_EN: Record<VentajasId, (n: number) => string> = {
  es: (n) => `${n} partes`, en: (n) => `${n} parts`, ar: (n) => `${n} أجزاء`, ru: (n) => `${n} частей`,
}

// Entradillas de cada parte (la de apps y la de preguntas ya existían: APPS_T y AYUDA).
const LEAD: Record<VentajasId, { exp: string; cod: string; herr: string; acu: string }> = {
  es: {
    exp: 'Talleres, kimonos, samuráis y cocina que conozco en persona, ordenados por zonas. Cada tarjeta dice qué acordé con el socio, sus condiciones y qué tienes que hacer tú.',
    cod: 'Toca un código para copiarlo y pégalo al pagar, en el campo de código promocional o cupón. El descuento es para ti.',
    herr: 'Tarjetas en japonés para el restaurante y el taxi, horarios y precios de tren y un planificador de Kansai. Para usarlas en la calle, desde el móvil.',
    acu: 'Lo que acordé con cada socio, tal como te afecta a ti: el tipo de acuerdo, sus condiciones y cuándo las confirmó. Filtra por tipo o por zona, o busca un nombre.',
  },
  en: {
    exp: 'Workshops, kimono, samurai and cooking I know in person, sorted by area. Each card says what I agreed with the partner, their conditions and what you need to do.',
    cod: 'Tap a code to copy it and paste it at checkout, in the promo code or coupon field. The discount is yours.',
    herr: 'Japanese cards for restaurants and taxis, train times and fares, and a Kansai planner. Made to use on the street, on your phone.',
    acu: 'What I agreed with each partner, as it affects you: the type of agreement, their conditions and when they confirmed them. Filter by type or area, or search for a name.',
  },
  ar: {
    exp: 'ورش وكيمونو وساموراي وطبخ أعرفها شخصيًا، مرتبة حسب المنطقة. كل بطاقة تقول ما اتفقت عليه مع الشريك وشروطه وما عليك فعله.',
    cod: 'اضغط على الرمز لنسخه والصقه عند الدفع في خانة الرمز الترويجي أو القسيمة. الخصم لك.',
    herr: 'بطاقات باليابانية للمطعم والتاكسي، ومواعيد القطارات وأسعارها، ومخطط لرحلتك في كانساي. لتستخدمها في الشارع من هاتفك.',
    acu: 'ما اتفقت عليه مع كل شريك كما يخصّك: نوع الاتفاق وشروطهم ومتى أكّدوها. صفِّ حسب النوع أو المنطقة، أو ابحث عن اسم.',
  },
  ru: {
    exp: 'Мастер-классы, кимоно, самураи и кухня, которые мы знаем лично, по регионам. На каждой карточке — о чём договорились с партнёром, его условия и что сделать вам.',
    cod: 'Нажмите на код, чтобы скопировать, и вставьте при оплате в поле промокода или купона. Скидка ваша.',
    herr: '',
    acu: 'О чём мы договорились с каждым партнёром — так, как это касается вас: формат, их условия и когда они их подтвердили. Фильтруйте по формату или региону или ищите по названию.',
  },
}

// La acción con la que acaba cada parte.
const CIERRE: Record<VentajasId, { exp: string; expBoton: string; expMsg: string; cod: string; apps: string; appsBoton: string; appsMsg: string; herr: string; herrBoton: string }> = {
  es: {
    exp: '¿Te encajo una en tu día? Te la reservo, la coordino y entro a traducir.', expBoton: 'Pídemelo por WhatsApp', expMsg: 'Hola Tony, he visto las experiencias de tus socios y quiero reservar una.',
    cod: 'Guárdalos para todo el viaje: mándatelos a tu propio WhatsApp.',
    apps: '¿No sabes qué app te hace falta? Dime tu plan y te digo cuáles instalar.', appsBoton: 'Pregúntame por WhatsApp', appsMsg: 'Hola Tony, ¿qué apps me recomiendas para mi viaje a Kansai?',
    herr: 'Funcionan en el móvil, gratis y sin registrarte.', herrBoton: 'Abrir las herramientas',
  },
  en: {
    exp: 'Want one in your day? I book it, coordinate it and come in to interpret.', expBoton: 'Ask me on WhatsApp', expMsg: 'Hi Tony, I saw your partners’ experiences and want to book one.',
    cod: 'Keep them for the whole trip: send them to your own WhatsApp.',
    apps: 'Not sure which app you need? Tell me your plan and I’ll tell you what to install.', appsBoton: 'Ask me on WhatsApp', appsMsg: 'Hi Tony, which apps do you recommend for my Kansai trip?',
    herr: 'They work on your phone, free and with no sign-up.', herrBoton: 'Open the tools',
  },
  ar: {
    exp: 'تريد إحداها في يومك؟ أحجزها وأنسّقها وأدخل لأترجم.', expBoton: 'اطلبها مني على واتساب', expMsg: 'السلام عليكم توني، رأيت تجارب شركائك وأريد حجز إحداها.',
    cod: 'احتفظ بها طوال الرحلة: أرسلها إلى واتساب الخاص بك.',
    apps: 'لا تعرف أي تطبيق تحتاج؟ أخبرني بخطتك وأقول لك ماذا تثبّت.', appsBoton: 'اسألني على واتساب', appsMsg: 'السلام عليكم توني، ما التطبيقات التي تنصحني بها لرحلتي إلى كانساي؟',
    herr: 'تعمل على هاتفك، مجانًا وبلا تسجيل.', herrBoton: 'افتح الأدوات',
  },
  ru: {
    exp: 'Хотите вписать что-то в свой день? Забронируем, всё согласуем и поможем с переводом.', expBoton: 'Написать в Telegram', expMsg: 'Здравствуйте! Увидел впечатления ваших партнёров и хочу забронировать.',
    cod: 'Сохраните их на всю поездку: отправьте себе в WhatsApp.',
    apps: 'Не знаете, какое приложение нужно? Расскажите о планах — подскажем, что установить.', appsBoton: 'Написать в Telegram', appsMsg: 'Здравствуйте! Какие приложения посоветуете для поездки в Кансай?',
    herr: '', herrBoton: '',
  },
}

// Índice fijo bajo la barra: las partes numeradas; marca la que se está leyendo.
function Indice({ id, partes }: { id: VentajasId; partes: Parte[] }) {
  const [activa, setActiva] = useState('')
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) setActiva(e.target.id) }, { rootMargin: '-40% 0px -55% 0px' })
    partes.forEach((p) => { const el = document.getElementById(p.id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [id, partes])
  return (
    <nav className="vn-indice pt-indice-fijo" aria-label={EN_ESTA[id]}>
      {partes.map((p, n) => (
        <a key={p.id} href={`#${p.id}`} aria-current={activa === p.id ? 'true' : undefined}><span className="pt-indice-fijo-n" aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>{p.corto}</a>
      ))}
    </nav>
  )
}

/** Índice grande de partes, justo debajo de la portada: número, qué hay y cuántas cosas. */
function IndicePartes({ id, partes }: { id: VentajasId; partes: Parte[] }) {
  return (
    <nav className="pt-indice" aria-labelledby="pt-indice-t">
      <div className="vn-ancho">
        <h2 id="pt-indice-t" className="pt-indice-t">{EN_ESTA[id]} <span>{PARTES_EN[id](partes.length)}</span></h2>
        <ol className="pt-indice-lista">
          {partes.map((p, n) => (
            <li key={p.k} className="vn-sube">
              <a href={`#${p.id}`}>
                <span className="pt-indice-n" aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>
                <span className="pt-indice-txt"><b>{p.t}</b><small>{p.d}</small></span>
                <span className="pt-indice-cuenta"><b className="pt-indice-cifra" data-n={p.cuenta}>{p.cuenta}</b> <small>{unidad(p.k, p.cuenta, id)}</small></span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}

/** Cabecera de cada parte: número hueco enorme, «Parte 2 de 6 · 10 códigos», título y entradilla. */
function CabezaParte({ id, p, n, total, lead }: { id: VentajasId; p: Parte; n: number; total: number; lead?: string }) {
  return (
    <header className="pt-cab vn-ancho">
      <span className="pt-n" aria-hidden="true">{String(n).padStart(2, '0')}</span>
      <div className="pt-cab-txt">
        <p className="pt-ojo"><span className="rb-ojo-punto" />{PARTE_DE[id](n, total)} · <b>{p.cuenta}</b> {unidad(p.k, p.cuenta, id)}</p>
        <h2 id={`${p.id}-t`} className="pt-h2">{p.t}</h2>
        {lead && <p className="vn-lead">{lead}</p>}
      </div>
    </header>
  )
}

/** Final de cada parte: una frase y una sola acción. */
function Cierre({ texto, children, final }: { texto: ReactNode; children: ReactNode; final?: boolean }) {
  return (
    <div className={`pt-cierre vn-ancho vn-sube${final ? ' es-final' : ''}`}>
      <div className="pt-cierre-txt">{texto}</div>
      <div className="pt-cierre-accion">{children}</div>
    </div>
  )
}


// Icono de una experiencia: el dibujo de lo que se hace sobre el color de la marca.
function IconoExp({ a, grande }: { a: App; grande?: boolean }) {
  const Ico = ICONO_EXP[a.clave]
  return (
    <span className={`vn-ico-exp${grande ? ' es-grande' : ''}${ICONOS_APP.has(a.clave) ? ' es-real' : ''}`} style={{ ['--marca' as string]: a.marca.fondo, ['--marca-tinta' as string]: a.marca.tinta }} aria-hidden="true">
      {ICONOS_APP.has(a.clave) ? <img src={`/v7/apps/${a.clave}.webp`} alt="" width="64" height="64" loading="lazy" decoding="async" /> : Ico ? <Ico size={grande ? 44 : 20} strokeWidth={1.6} /> : <b>{(a.marca.palabra ?? a.nombre).charAt(0)}</b>}
    </span>
  )
}


export default function Ventajas({ id, app }: { id: VentajasId; app?: string }) {
  const p = T[id]
  // Ficha propia de una app (/es/ventajas/airalo/); si la clave no existe, 404.
  const appSel = app ? APPS.find((a) => a.clave === app) : undefined
  const dir = id === 'ar' ? 'rtl' : 'ltr'
  const { setLang } = useLanguage()
  useEffect(() => { setLang(id) }, [id, setLang])
  const sufijo = appSel ? `${appSel.clave}/` : ''
  const url = `${BASE}${RUTA[id]}${sufijo}`
  const inicio = id === 'ru' ? '/ru/' : `/${id}/`
  // La versión rusa es de Larion: el contacto (Telegram, lo lleva Tony) y la vuelta son suyos.
  const guia = id === 'ru' ? 'larion' : 'tony'
  const wa = enlaceGuia(guia, p.saludo)
  const hermanas = (Object.keys(RUTA) as VentajasId[]).map((k) => ({ lang: k, href: `${BASE}${RUTA[k]}${sufijo}` }))
  const raiz = useRef<HTMLDivElement>(null)
  // «Cuatro formas de acuerdo» filtra las experiencias; el pase se abre desde cualquier sitio.
  const [filtroExp, setFiltroExp] = useState<{ acuerdo: Acuerdo | ''; n: number }>({ acuerdo: '', n: 0 })
  const [pase, setPase] = useState<{ abierto: boolean; socio?: (typeof APPS)[number] }>({ abierto: false })
  const elegirAcuerdo = (c: Acuerdo) => {
    setFiltroExp((f) => ({ acuerdo: c, n: f.n + 1 }))
    document.getElementById('experiencias-zonas')?.scrollIntoView({ behavior: 'smooth' })
  }

  const categorias = (Object.keys(CATEGORIAS) as Categoria[]).filter((c) => APPS_REJILLA.some((a) => a.cat === c))
  const [filtro, setFiltro] = useState<Categoria | ''>('')
  // Los enlaces #app del kit deben encontrar su icono: al saltar a uno, se quitan los filtros.
  useEffect(() => {
    const quita = () => setFiltro('')
    window.addEventListener('hashchange', quita)
    return () => window.removeEventListener('hashchange', quita)
  }, [])
  const conEnlace = APPS.filter((a) => esAfiliado(a) && !cuponDe(a))
  const marquesina = APPS_REJILLA.filter((a) => ICONOS_APP.has(a.clave))

  // Las partes y sus cifras (en ruso no hay herramientas gratis).
  const cuentas: Record<ParteK, number> = {
    exp: EXPERIENCIAS.length, cod: CON_CODIGO.length, apps: APPS_REJILLA.length,
    herr: esLenguaKit(id) ? Object.keys(HERRAMIENTAS[id]).filter((k) => k !== 'hub').length : 0,
    acu: FILAS_ACUERDOS.length, faq: AYUDA[id].preguntas.length,
  }
  const partes: Parte[] = ORDEN_PARTES.filter((k) => cuentas[k] > 0).map((k) => ({ k, id: ID_PARTE[k], ...PARTES_T[id][k], cuenta: cuentas[k] }))
  const cabeza = (k: ParteK, lead?: string) => {
    const n = partes.findIndex((x) => x.k === k)
    return <CabezaParte id={id} p={partes[n]} n={n + 1} total={partes.length} lead={lead} />
  }
  const guardaHref = `https://wa.me/?text=${encodeURIComponent([GUARDA[id].msg, ...CON_CODIGO.map((a) => `${a.nombre}: ${cuponDe(a)}${a.descuento ? ` (${a.descuento.startsWith('−') ? '' : '−'}${a.descuento})` : ''}`), `${GUARDA[id].todo} ${URL_VENTAJAS[id]}`].join('\n'))}`

  // Movimiento (solo en el cliente y sin «reducir movimiento»; matchMedia se lee aquí,
  // nunca al pintar: la página va pregenerada y si no, React da el error #418).
  // Lenis para el scroll, SplitText para el titular, las dos cintas en bucle (GSAP, se
  // frenan al pasar el ratón), los números de cada parte que entran de lado, las cifras
  // del índice que cuentan desde 0 y bloques que suben.
  useEffect(() => {
    const nodo = raiz.current
    if (appSel || !nodo || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let cancelado = false
    let limpiar = () => {}
    ;(async () => {
      const [{ gsap }, { ScrollTrigger }, { SplitText }, { default: Lenis }] = await Promise.all([
        import('gsap'), import('gsap/ScrollTrigger'), import('gsap/SplitText'), import('lenis'),
      ])
      if (cancelado) return
      gsap.registerPlugin(ScrollTrigger, SplitText)
      const lenis = new Lenis({ anchors: { offset: -120 } })
      ;(window as unknown as { __vnLenis?: unknown }).__vnLenis = lenis
      lenis.on('scroll', ScrollTrigger.update)
      const tic = (t: number) => lenis.raf(t * 1000)
      gsap.ticker.add(tic)
      gsap.ticker.lagSmoothing(0)
      const rtl = nodo.dir === 'rtl'
      const quitar: (() => void)[] = []
      const ctx = gsap.context(() => {
        const titular = nodo.querySelector('.rb-portada h1')
        if (titular) {
          const partido = SplitText.create(titular, { type: 'words', mask: 'words' })
          gsap.from(partido.words, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.08 })
        }
        gsap.from('.rb-portada .vn-lead, .rb-portada .vn-ctas, .rb-ojo, .rb-rota', { y: 22, opacity: 0, duration: 0.9, ease: 'expo.out', delay: 0.35, stagger: 0.1 })
        gsap.from('.rb-portada-foto img', { scale: 1.15, duration: 2.2, ease: 'expo.out' })
        // La foto se queda atrás al bajar: separa la portada del resto sin cortar en seco.
        gsap.to('.rb-portada-foto img', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.rb-portada', start: 'top top', end: 'bottom top', scrub: true } })
        gsap.from('.rb-cifras > div', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', delay: 0.45, stagger: 0.1 })
        // Cintas: la de socios hacia un lado y la de apps hacia el otro; en árabe, al revés.
        gsap.utils.toArray<HTMLElement>('.vn-cinta-pista').forEach((pista, n) => {
          const haciaFuera = (n % 2 === 0) !== rtl
          const bucle = gsap.fromTo(pista, { xPercent: haciaFuera ? 0 : (rtl ? 50 : -50) }, { xPercent: haciaFuera ? (rtl ? 50 : -50) : 0, duration: n % 2 === 0 ? 70 : 55, ease: 'none', repeat: -1 })
          const fila = pista.parentElement!
          const lento = () => gsap.to(bucle, { timeScale: 0.15, duration: 0.6, overwrite: true })
          const normal = () => gsap.to(bucle, { timeScale: 1, duration: 0.6, overwrite: true })
          fila.addEventListener('pointerenter', lento)
          fila.addEventListener('pointerleave', normal)
          quitar.push(() => { fila.removeEventListener('pointerenter', lento); fila.removeEventListener('pointerleave', normal) })
        })
        // El número hueco de cada parte entra desde su lado: marca dónde empieza una parte nueva.
        gsap.utils.toArray<HTMLElement>('.pt-n').forEach((n) => {
          gsap.from(n, { xPercent: rtl ? 18 : -18, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: n, start: 'top 88%', once: true } })
        })
        // Cifras del índice: cuentan hasta su valor al aparecer (en el HTML ya está el número real).
        gsap.utils.toArray<HTMLElement>('.pt-indice-cifra').forEach((el) => {
          const fin = Number(el.dataset.n) || 0
          ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => {
            const o = { v: 0 }
            gsap.to(o, { v: fin, duration: 1.3, ease: 'power3.out', onUpdate: () => { el.textContent = String(Math.round(o.v)) } })
          } })
        })
        gsap.set('.vn-sube', { y: 28, opacity: 0 })
        ScrollTrigger.batch('.vn-sube', { once: true, start: 'top 88%', onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.07 }) })
      }, nodo)
      limpiar = () => { quitar.forEach((f) => f()); ctx.revert(); gsap.ticker.remove(tic); lenis.destroy(); delete (window as unknown as { __vnLenis?: unknown }).__vnLenis }
    })()
    return () => { cancelado = true; limpiar() }
  }, [id, appSel])

  // Una clave que no existe (/es/ventajas/loquesea/) es un 404, no la lista sin avisar.
  if (app && !appSel) return <Suspense fallback={null}><Pagina404 /></Suspense>

  const canal = <IconoCanal tg={id === 'ru'} />
  return (
    <div ref={raiz} className={`vt lang-${id}${appSel ? '' : ' vn'}`} lang={id} dir={dir}>
      <Helmet>
        <html lang={id} dir={dir} />
        <title>{appSel ? `${appSel.nombre} · ${p.titulo}` : p.titulo}</title>
        <meta name="description" content={appSel ? textoApp(appSel, id).que : p.descripcion} />
        <link rel="canonical" href={url} />
        {enlacesHreflang(hermanas)}
        <meta property="og:title" content={p.titulo} />
        <meta property="og:description" content={p.descripcion} />
        <meta property="og:url" content={url} />
      </Helmet>
      {!appSel && <Helmet><script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: AYUDA[id].preguntas.map((q) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a } })) })}</script></Helmet>}

      {/* En español, la cabecera y el pie comunes (árbol de la web, 25-11-2026). */}
      {id === 'es'
        ? <CabeceraEs activo={`${RUTA.es}${sufijo}`} idiomas={(['en', 'ar'] as const).map((k) => ({ lang: k, ruta: `${RUTA[k]}${sufijo}`, texto: k === 'en' ? 'English' : 'العربية' }))} />
        : <Barra id={id} sufijo={sufijo} wa={wa} boton={p.finalBoton} />}

      {appSel ? <FichaApp a={appSel} id={id} lista={RUTA[id]} wa={wa} final={p} /> : <main>
        <Indice id={id} partes={partes} />

        <PortadaRB id={id} />

        <IndicePartes id={id} partes={partes} />

        {/* Dos cintas: los socios (abren su ficha) y los iconos reales de las apps. */}
        <div className="vn-cinta" aria-hidden="true">
          <div className="vn-cinta-fila">
            <div className="vn-cinta-pista">
              {[...ORDENADAS, ...ORDENADAS].map((a, n) => (
                <a key={`${a.clave}-${n}`} href={`#${a.clave}`} tabIndex={-1} className="vn-cinta-socio"><IconoExp a={a} /><bdi dir="ltr">{a.nombre}</bdi></a>
              ))}
            </div>
          </div>
          <div className="vn-cinta-fila es-apps">
            <div className="vn-cinta-pista">
              {[...marquesina, ...marquesina].map((a, n) => <Link key={`${a.clave}-${n}`} to={`${RUTA[id]}${a.clave}/`} tabIndex={-1} title={a.nombre}><img src={`/v7/apps/${a.clave}.webp`} alt="" width="56" height="56" loading="lazy" decoding="async" /></Link>)}
            </div>
          </div>
        </div>

        {/* ① Experiencias con socios, por zonas */}
        <section className="pt pt-exp" id="experiencias" aria-labelledby="experiencias-t">
          {cabeza('exp', LEAD[id].exp)}
          <div className="vn-ancho">
            <ComoFunciona id={id} onElegir={elegirAcuerdo} onPase={() => setPase({ abierto: true })} />
            <div id="experiencias-zonas" className="pt-ancla">
              <ExperienciasRB id={id} ruta={RUTA[id]} filtroInicial={filtroExp} onPase={(socio) => setPase({ abierto: true, socio })} />
            </div>
          </div>
          {/* Planes: guía + experiencias, con las ventajas aplicadas (datosPlanes.ts) */}
          <div style={{ ['--pl-acento' as string]: '#e8452c' }}><PlanesVenta lang={id} guia={guia} url={`${BASE}${RUTA[id]}`} /></div>
          <Cierre texto={<p>{CIERRE[id].exp}</p>}>
            <a className="vn-boton vn-boton-wa" href={enlaceGuia(guia, CIERRE[id].expMsg)} target="_blank" rel="noopener noreferrer">{canal} {CIERRE[id].expBoton}</a>
          </Cierre>
        </section>

        {/* ② Códigos de descuento */}
        <section className="pt pt-cod" id="codigos" aria-labelledby="codigos-t">
          {cabeza('cod', LEAD[id].cod)}
          <div className="vn-ancho">
            <CodigosRB id={id} ruta={RUTA[id]}>
              {conEnlace.length > 0 && (
                <div className="vn-enlaces-bloque">
                  <h3>{CODIGOS[id].enlaces}</h3>
                  <p>{CODIGOS[id].enlacesSub}</p>
                  <div className="vn-enlaces">
                    {conEnlace.map((a) => (
                      <a key={a.clave} href={enlaceDe(a)} target="_blank" rel="noopener noreferrer sponsored"><IconoApp a={a} /><b dir="ltr">{a.nombre}</b></a>
                    ))}
                  </div>
                </div>
              )}
            </CodigosRB>
          </div>
          <Cierre texto={<p>{CIERRE[id].cod} <small>{GUARDA[id].nota}</small></p>}>
            <a className="vn-boton vn-boton-wa" href={guardaHref} target="_blank" rel="noopener noreferrer"><IconoWa /> {GUARDA[id].boton}</a>
          </Cierre>
        </section>

        {/* ③ Apps y servicios para el viaje */}
        <section className="pt pt-apps" id="apps" aria-labelledby="apps-t">
          {cabeza('apps', APPS_T[id].sub)}
          <div className="vn-ancho">
            <div className="vn-kit" id="kit">
              <h3 className="vn-h3 vn-sube">{PASOS[id].titulo}</h3>
              <div className="vn-bento">
                {PASOS[id].lista.map((paso, n) => (
                  <div key={paso.t} className={`vn-celda vn-celda-${n} vn-sube`}>
                    {FOTO_KIT[n] && <img className="vn-celda-foto" src={FOTO_KIT[n]} alt="" loading="lazy" decoding="async" />}
                    <div className="vn-celda-txt">
                      <Dibujo n={paso.n} className="vn-celda-ico" />
                      <h4>{paso.t}</h4>
                      <p>{paso.d}</p>
                      <div className="vn-celda-apps">
                        {paso.apps.map((k) => { const ap = APPS.find((x) => x.clave === k); return ap && <a key={k} href={`#${k}`}><IconoApp a={ap} /><span dir="ltr">{ap.nombre.replace('Google ', '')}</span></a> })}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="vn-celda vn-celda-consejos vn-sube">
                  <h4>{p.consejosTitulo}</h4>
                  <ol>{p.consejos.map((c) => <li key={c}>{c}</li>)}</ol>
                </div>
              </div>
            </div>

            <div className="vn-apps">
              <h3 className="vn-h3">{APPS_T[id].titulo}</h3>
              <div className="vn-chips" role="group" aria-label={APPS_T[id].titulo}>
                <button type="button" aria-pressed={filtro === ''} onClick={() => setFiltro('')}>{TODAS[id]} <small>{APPS_REJILLA.length}</small></button>
                {categorias.map((c) => (
                  <button key={c} type="button" aria-pressed={filtro === c} onClick={() => setFiltro(c)}>
                    {CATEGORIAS[c][id]} <small>{APPS_REJILLA.filter((a) => a.cat === c).length}</small>
                  </button>
                ))}
              </div>
              <ul className="vn-dock">
                <AnimatePresence initial={false} mode="popLayout">
                  {APPS_REJILLA.filter((a) => !filtro || a.cat === filtro).map((a) => {
                    const cupon = cuponDe(a)
                    return (
                      <motion.li key={a.clave} id={a.clave} layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 30 }}>
                        <Link to={`${RUTA[id]}${a.clave}/`} className="vn-app">
                          <IconoApp a={a} />
                          <span className="vn-app-txt"><b dir="ltr">{a.nombre}</b><small>{textoApp(a, id).que}</small></span>
                          {cupon && <code className="vn-app-cod" dir="ltr">{cupon}</code>}
                        </Link>
                      </motion.li>
                    )
                  })}
                </AnimatePresence>
              </ul>
            </div>
          </div>
          <Cierre texto={<p>{CIERRE[id].apps}</p>}>
            <a className="vn-boton vn-boton-wa" href={enlaceGuia(guia, CIERRE[id].appsMsg)} target="_blank" rel="noopener noreferrer">{canal} {CIERRE[id].appsBoton}</a>
          </Cierre>
        </section>

        {/* ④ Herramientas gratis (tarjetas en japonés, trenes, planificador); no hay en ruso */}
        {esLenguaKit(id) && (
          <section className="pt pt-herr" id="herramientas" aria-labelledby="herramientas-t">
            {cabeza('herr', LEAD[id].herr)}
            <div className="vn-ancho"><HerramientasEnGuia lang={id} sinCabecera /></div>
            <Cierre texto={<p>{CIERRE[id].herr}</p>}>
              <a className="vn-boton vn-boton-acento" href={HERRAMIENTAS[id].hub}>{CIERRE[id].herrBoton} <span aria-hidden="true">{id === 'ar' ? '←' : '→'}</span></a>
            </Cierre>
          </section>
        )}

        {/* ⑤ Acuerdos con socios: todos en una tabla, sin comisiones ni códigos de agente */}
        <section className="pt pt-acu" id="acuerdos" aria-labelledby="acuerdos-t">
          {cabeza('acu', LEAD[id].acu)}
          <ClaroRB id={id} />
          <div className="vn-ancho"><TablaAcuerdos id={id} ruta={RUTA[id]} /></div>
          <Cierre texto={<><h3 className="pt-cierre-t">{SOCIOS[id].titulo}</h3><p>{SOCIOS[id].texto}</p></>}>
            <a className="vn-boton vn-boton-linea" href={`mailto:${CORREO}?subject=${encodeURIComponent(SOCIOS[id].asunto)}`}>{SOCIOS[id].boton}</a>
          </Cierre>
        </section>

        {/* ⑥ Preguntas, y la última acción: escribirme */}
        <section className="pt pt-faq vn-faq" id="preguntas" aria-labelledby="preguntas-t">
          {cabeza('faq', AYUDA[id].sub)}
          <div className="vn-ancho">
            <div className="vn-faq-lista">
              {AYUDA[id].preguntas.map((q) => (
                <details key={q.q}>
                  <summary><Dibujo n={q.icono} className="vn-faq-ico" /><span>{q.q}</span></summary>
                  <p>{q.a}</p>
                  <p className="vn-faq-enlaces">{q.enlaces.map((e) => <EnlaceAyuda key={e.texto} e={e} lista={RUTA[id]} />)}</p>
                </details>
              ))}
            </div>
          </div>
          <Cierre final texto={<><h3 className="pt-cierre-t">{p.finalTitulo}</h3><p>{p.finalTexto}</p></>}>
            <a className="vn-boton vn-boton-wa" href={wa} target="_blank" rel="noopener noreferrer">{canal} {p.finalBoton}</a>
            {id === 'ru' && <small className="v7-nota-tg">Telegram @Larik_Yokota · {NOTA_TG.ru} · WhatsApp +81 80-8506-7586</small>}
            <Link className="vn-enlace" to={inicio}>{p.volver}</Link>
          </Cierre>
        </section>
      </main>}

      {id === 'es'
        ? <PieEs p={PAGINAS.es} idiomas={(['en', 'ar', 'ru'] as const).map((k) => ({ lang: k, ruta: `${RUTA[k]}${sufijo}`, texto: k === 'en' ? 'English' : k === 'ar' ? 'العربية' : 'Русский' }))} />
        : <Pie id={id} />}
      <AnimatePresence>{pase.abierto && <PaseTony id={id} socio={pase.socio} onCerrar={() => setPase({ abierto: false })} />}</AnimatePresence>
    </div>
  )
}
