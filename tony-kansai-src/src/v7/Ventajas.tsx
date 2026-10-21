// Ventajas para el viajero (/es/ventajas/, /en/perks/, /ar/perks/, /ru/perks/).
// Rehecha el 19-10-2026: un solo tema de noche con el bermellón del torii como
// único acento, y cada bloque con su propia forma (lista con vista previa,
// billetes, bento, rejilla de iconos, acordeón) en vez de tarjetas iguales.
// Movimiento: Lenis + GSAP (SplitText, ScrollTrigger) cargados en el cliente;
// con «reducir movimiento» la página queda quieta y entera.
// Las fichas de cada app (/es/ventajas/airalo/) siguen en FichaVentaja.tsx con ventajas.css.
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { GUIAS, CORREO } from './contenido'
import { Logo } from './Logo'
import { IconoWa } from './IconoWa'
import { enlacesHreflang } from '../seo/hreflang'
import { PIE } from './formato'
import { APPS, CATEGORIAS, CIUDADES, SEO_VENTAJAS, cuponDe, esAfiliado, enlaceDe, type Categoria, type Ciudad } from './datosVentajas'
import { LOGOS, ICONOS_APP } from './logosMarcas'
import { CodigoCifrado } from './Cocina'
import { AYUDA, type Enlace } from './datosAyudaViaje'
import { FichaApp, textoApp, MAS } from './FichaVentaja'
import { GUIA } from './datosVentajasGuia'
import { ICONO_EXP } from './iconosExperiencia'
import './v7.css'
import './ventajas.css'
import './ventajas-noche.css'

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
    finalTitulo: 'Не хотите разбираться с приложениями?', finalTexto: 'На экскурсии Ларион берёт все поездки на себя: встречает в отеле, и вы едете вместе.', finalBoton: 'Написать в WhatsApp', volver: 'На страницу Лариона',
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
// Índice fijo bajo la barra: la página es larga y cada bloque es de un tipo distinto.
const INDICE: Record<VentajasId, { exp: string; codigos: string; kit: string; apps: string; preguntas: string }> = {
  es: { exp: 'Experiencias', codigos: 'Códigos', kit: 'Kit de viaje', apps: 'Apps', preguntas: 'Preguntas' },
  en: { exp: 'Experiences', codigos: 'Codes', kit: 'Travel kit', apps: 'Apps', preguntas: 'Questions' },
  ar: { exp: 'التجارب', codigos: 'الرموز', kit: 'عُدّة السفر', apps: 'التطبيقات', preguntas: 'أسئلة' },
  ru: { exp: 'Впечатления', codigos: 'Коды', kit: 'Набор', apps: 'Приложения', preguntas: 'Вопросы' },
}
const PORTADA: Record<VentajasId, { verExp: string; verCod: string; exp: string; apps: string; codigos: string }> = {
  es: { verExp: 'Ver experiencias', verCod: 'Mis códigos de descuento', exp: 'experiencias con socios', apps: 'apps probadas', codigos: 'códigos de descuento' },
  en: { verExp: 'See experiences', verCod: 'My discount codes', exp: 'partner experiences', apps: 'tested apps', codigos: 'discount codes' },
  ar: { verExp: 'شاهد التجارب', verCod: 'رموز الخصم', exp: 'تجارب مع شركائي', apps: 'تطبيقات مجرّبة', codigos: 'رموز خصم' },
  ru: { verExp: 'Смотреть впечатления', verCod: 'Коды на скидку', exp: 'впечатлений с партнёрами', apps: 'проверенных приложений', codigos: 'кодов на скидку' },
}
const APPS_T: Record<VentajasId, { titulo: string; sub: string }> = {
  es: { titulo: 'Las apps que uso en Kansai', sub: 'Internet, entradas, hotel, transporte y pagos. Filtra por lo que necesitas y abre la ficha para ver cómo funciona cada una.' },
  en: { titulo: 'The apps I use in Kansai', sub: 'Data, tickets, hotels, transport and payments. Filter by what you need and open each card to see how it works.' },
  ar: { titulo: 'التطبيقات التي أستخدمها في كانساي', sub: 'الإنترنت والتذاكر والفنادق والتنقل والدفع. اختر ما تحتاجه وافتح البطاقة لترى كيف يعمل كل تطبيق.' },
  ru: { titulo: 'Приложения, которыми мы пользуемся в Кансае', sub: 'Интернет, билеты, отели, транспорт и оплата. Выберите нужное и откройте карточку, чтобы узнать подробности.' },
}

function IndiceFijo({ id }: { id: VentajasId }) {
  const t = INDICE[id]
  const secciones = [['experiencias', t.exp], ['codigos', t.codigos], ['kit', t.kit], ['apps', t.apps], ['preguntas', t.preguntas]] as const
  const [activa, setActiva] = useState('')
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) setActiva(e.target.id) }, { rootMargin: '-45% 0px -50% 0px' })
    secciones.forEach(([k]) => { const el = document.getElementById(k); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [id])
  return (
    <nav className="vt-indice-fijo" aria-label="Índice">
      {secciones.map(([k, txt]) => <a key={k} href={`#${k}`} aria-current={activa === k ? 'true' : undefined}>{txt}</a>)}
    </nav>
  )
}

const TODAS: Record<VentajasId, string> = { es: 'Todas', en: 'All', ar: 'الكل', ru: 'Все' }
const ABRIR: Record<VentajasId, string> = { es: 'Abrir', en: 'Open', ar: 'افتح', ru: 'Открыть' }

// Dibujo de cada app (Tabler Icons, MIT; sprite en /v7/ventajas-dibujos.svg).
const DIBUJO: Record<string, string> = {
  airalo: 'device-mobile', klook: 'ticket', gyg: 'compass', trip: 'plane', agoda: 'bed', booking: 'building-skyscraper',
  icoca: 'train', go: 'car', uber: 'steering-wheel', luup: 'scooter-electric', hello: 'bike', wise: 'credit-card',
  maps: 'map-2', traductor: 'language', kkday: 'camera', welcome: 'plane-arrival', radical: 'luggage',
  tiqets: 'ticket', kiwitaxi: 'car', intui: 'plane-arrival', yesim: 'device-mobile', ekta: 'shield-check', iati: 'shield-check', airhelp: 'plane', mobal: 'device-mobile', flytographer: 'camera',
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
const TOCA: Record<VentajasId, string> = { es: 'Toca una app para ver cómo funciona', en: 'Tap an app to see how it works', ar: 'اضغط على تطبيق لترى كيف يعمل', ru: 'Нажмите на приложение, чтобы узнать подробности' }

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

/** Botón «mándatela a tu WhatsApp»: el cliente se envía a sí mismo los códigos y el
 *  enlace, y así los tiene en su chat durante todo el viaje sin buscar la web. */
const GUARDA: Record<VentajasId, { boton: string; nota: string; msg: string; todo: string }> = {
  es: { boton: 'Mándatelos a tu WhatsApp', nota: 'Así los tienes a mano durante todo el viaje por Japón.', msg: 'Mis descuentos para Japón (Tony Kansai Guide):', todo: 'Todo aquí:' },
  en: { boton: 'Send them to your WhatsApp', nota: 'Keep them at hand for your whole trip in Japan.', msg: 'My discounts for Japan (Tony Kansai Guide):', todo: 'Everything here:' },
  ar: { boton: 'أرسلها إلى واتساب الخاص بك', nota: 'لتبقى في متناولك طوال رحلتك في اليابان.', msg: 'خصوماتي لرحلة اليابان (Tony Kansai Guide):', todo: 'كل شيء هنا:' },
  ru: { boton: 'Отправить себе в WhatsApp', nota: 'Пусть будут под рукой всю поездку по Японии.', msg: 'Мои скидки для Японии (Tony Kansai Guide):', todo: 'Всё здесь:' },
}
const URL_VENTAJAS: Record<VentajasId, string> = { es: 'https://tonykansaiguide.com/es/ventajas/', en: 'https://tonykansaiguide.com/en/perks/', ar: 'https://tonykansaiguide.com/ar/perks/', ru: 'https://tonykansaiguide.com/ru/perks/' }

function BotonCopiar({ texto, copiar, copiado }: { texto: string; copiar: string; copiado: string }) {
  const marcar = (b: HTMLButtonElement) => { b.textContent = copiado; setTimeout(() => { b.textContent = copiar }, 1800) }
  return (
    <button type="button" className="vt-copiar" onClick={(e) => {
      const b = e.currentTarget
      navigator.clipboard?.writeText(texto).then(() => marcar(b)).catch(() => window.prompt(copiar, texto))
    }}>{copiar}</button>
  )
}

// ── Textos nuevos de la página rehecha ─────────────────────────────────────

const HERO: Record<VentajasId, { h1: string; sub: string; exp: string; cod: string; foto: string }> = {
  es: { h1: 'Lo mejor de Kansai, de mi parte', sub: 'Experiencias de socios que conozco, con ventaja por venir de mi parte, y las apps que uso cada día.', exp: 'Ver experiencias', cod: 'Mis códigos', foto: 'Torii rojos de Fushimi Inari, en Kioto' },
  en: { h1: 'The best of Kansai, through me', sub: 'Experiences from partners I know, with a perk for coming through me, and the apps I use every day.', exp: 'See experiences', cod: 'My codes', foto: 'Red torii gates at Fushimi Inari, Kyoto' },
  ar: { h1: 'أفضل ما في كانساي، من طرفي', sub: 'تجارب من شركاء أعرفهم، مع ميزة لأنك قادم من طرفي، والتطبيقات التي أستخدمها كل يوم.', exp: 'شاهد التجارب', cod: 'رموزي', foto: 'بوابات توري الحمراء في فوشيمي إيناري، كيوتو' },
  ru: { h1: 'Лучшее в Кансае от нас', sub: 'Впечатления от партнёров, которых мы знаем лично, с бонусом от нас, и приложения на каждый день.', exp: 'Смотреть впечатления', cod: 'Коды', foto: 'Красные ворота тории в Фусими Инари, Киото' },
}

const EXP_T: Record<VentajasId, { titulo: string; sub: string; todas: string; musulman: string; conTony: string; abrir: string; reservar: string; msg: string; solo: string }> = {
  es: { titulo: 'Experiencias que no encuentras en una app', sub: 'Talleres, kimonos, samuráis y cocina que conozco en persona. Si estamos de tour, lo encajo en la ruta.', todas: 'Todas', musulman: 'Apto para musulmanes', conTony: 'Ventaja con Tony', abrir: 'Ver su web', reservar: 'Resérvalo conmigo', msg: 'Hola Tony, me interesa {n}. ¿Me ayudas a reservarlo?', solo: 'Ve solo: cómo llegar y qué decir' },
  en: { titulo: 'Experiences you won’t find in an app', sub: 'Workshops, kimono, samurai and cooking I know in person. If we tour together, I fit it into the route.', todas: 'All', musulman: 'Muslim-friendly', conTony: 'Perk with Tony', abrir: 'Their website', reservar: 'Book it with me', msg: 'Hi Tony, I’m interested in {n}. Can you help me book it?', solo: 'Go on your own: getting there and what to say' },
  ar: { titulo: 'تجارب لن تجدها في أي تطبيق', sub: 'ورش وكيمونو وساموراي وطبخ أعرفها شخصيًا. إن كنا في جولة معًا أضعها في المسار.', todas: 'الكل', musulman: 'مناسب للمسلمين', conTony: 'ميزة مع طوني', abrir: 'موقعهم', reservar: 'احجزه معي', msg: 'مرحبًا طوني، أنا مهتم بـ {n}. هل تساعدني في الحجز؟', solo: 'اذهب وحدك: كيف تصل وماذا تقول' },
  ru: { titulo: 'Впечатления, которых нет в приложениях', sub: 'Мастерские, кимоно, самураи и кулинария, которые мы знаем лично. На экскурсии впишем это в маршрут.', todas: 'Все', musulman: 'Подходит мусульманам', conTony: 'Бонус от нас', abrir: 'Их сайт', reservar: 'Забронировать с нами', msg: 'Здравствуйте! Меня интересует {n}. Поможете забронировать?', solo: 'Самостоятельно: как добраться и что сказать' },
}

// Foto de cada momento del kit (la grande y la tercera llevan foto; la del medio, el color de acento).
const FOTO_KIT = ['/v8/zonas/kioto-kiyomizu-900.webp', '', '/v8/zonas/osaka-dotonbori-900.webp']

const EXPERIENCIAS = APPS.filter((a) => a.cat === 'experiencias')
// Las de ventaja propia y las aptas para musulmanes, primero: es lo que más vende.
const ORDENADAS = [...EXPERIENCIAS].sort((a, b) => Number(!!b.conTony) + Number(!!b.musulman) - (Number(!!a.conTony) + Number(!!a.musulman)))
const APPS_REJILLA = APPS.filter((a) => a.cat !== 'experiencias')

type App = (typeof APPS)[number]
type FiltroExp = '' | 'musulman' | 'conTony' | Ciudad

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
        <IconoWa /><span className="vt-solo-ancho">{boton}</span>
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
        <Link to={`/legal?lang=${id}`}>{pie.legal}</Link>
        <Link to={`/terms?lang=${id}`}>{pie.condiciones}</Link>
        <Link to={`/privacy?lang=${id}`}>{pie.privacidad}</Link>
      </nav>
    </footer>
  )
}

// Índice bajo la barra: marca la sección que se está leyendo.
function Indice({ id }: { id: VentajasId }) {
  const t = INDICE[id]
  const secciones = [['experiencias', t.exp], ['codigos', t.codigos], ['kit', t.kit], ['apps', t.apps], ['preguntas', t.preguntas]] as const
  const [activa, setActiva] = useState('')
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) setActiva(e.target.id) }, { rootMargin: '-40% 0px -55% 0px' })
    secciones.forEach(([k]) => { const el = document.getElementById(k); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [id])
  return (
    <nav className="vn-indice" aria-label="Índice">
      {secciones.map(([k, txt]) => <a key={k} href={`#${k}`} aria-current={activa === k ? 'true' : undefined}>{txt}</a>)}
    </nav>
  )
}

// Icono de una experiencia: el dibujo de lo que se hace sobre el color de la marca.
function IconoExp({ a, grande }: { a: App; grande?: boolean }) {
  const Ico = ICONO_EXP[a.clave]
  return (
    <span className={`vn-ico-exp${grande ? ' es-grande' : ''}`} style={{ ['--marca' as string]: a.marca.fondo, ['--marca-tinta' as string]: a.marca.tinta }} aria-hidden="true">
      {Ico ? <Ico size={grande ? 44 : 20} strokeWidth={1.6} /> : ICONOS_APP.has(a.clave) ? <img src={`/v7/apps/${a.clave}.webp`} alt="" width="64" height="64" loading="lazy" decoding="async" /> : <b>{(a.marca.palabra ?? a.nombre).charAt(0)}</b>}
    </span>
  )
}

function DetalleExp({ a, id, ruta }: { a: App; id: VentajasId; ruta: string }) {
  const t = EXP_T[id]
  const tx = textoApp(a, id)
  const cupon = cuponDe(a)
  const numero = (id === 'ru' ? GUIAS.larion : GUIAS.tony).wa
  const wa = `https://wa.me/${numero}?text=${encodeURIComponent(t.msg.replace('{n}', a.nombre))}`
  return (
    <div className="vn-det" style={{ ['--marca' as string]: a.marca.fondo, ['--marca-tinta' as string]: a.marca.tinta }}>
      <div className="vn-det-cara">
        {a.marca.palabra && <span className="vn-det-kanji" aria-hidden="true">{a.marca.palabra}</span>}
        <IconoExp a={a} grande />
      </div>
      <div className="vn-det-cuerpo">
        <p className="vn-det-lugar">{a.ciudad ? CIUDADES[a.ciudad][id] : 'Kansai'}</p>
        <h3><bdi dir="ltr">{a.nombre}</bdi></h3>
        <p className="vn-det-que">{tx.que}</p>
        <p className="vn-det-ventaja">{tx.ventaja}</p>
        {(a.musulman || a.conTony) && (
          <p className="vn-sellos">
            {a.musulman && <span className="es-musulman">{t.musulman}</span>}
            {a.conTony && <span className="es-tony">{t.conTony}</span>}
          </p>
        )}
        {cupon && <p className="vn-det-cupon"><bdi dir="ltr"><code>{cupon}</code></bdi></p>}
        <div className="vn-det-acciones">
          <a className="vn-boton vn-boton-wa" href={wa} target="_blank" rel="noopener noreferrer"><IconoWa /> {t.reservar}</a>
          <a className="vn-boton vn-boton-linea" href={enlaceDe(a)} target="_blank" rel="noopener noreferrer sponsored">{t.abrir}</a>
          <Link className={`vn-enlace${GUIA[a.clave] ? ' vn-enlace-solo' : ''}`} to={`${ruta}${a.clave}/`}>{GUIA[a.clave] ? t.solo : MAS[id]}</Link>
        </div>
      </div>
    </div>
  )
}

// Experiencias: lista a la izquierda y vista previa fija a la derecha (en el móvil,
// la ficha se abre bajo su fila). Sustituye a las 16 tarjetas iguales.
function Experiencias({ id, ruta }: { id: VentajasId; ruta: string }) {
  const t = EXP_T[id]
  const [filtro, setFiltro] = useState<FiltroExp>('')
  const [sel, setSel] = useState(ORDENADAS[0]?.clave ?? '')
  const ciudades = (Object.keys(CIUDADES) as Ciudad[]).filter((c) => EXPERIENCIAS.some((a) => a.ciudad === c))
  const pasa = (a: App) => !filtro || (filtro === 'musulman' ? a.musulman : filtro === 'conTony' ? a.conTony : a.ciudad === filtro)
  const lista = ORDENADAS.filter(pasa)
  const actual = lista.find((a) => a.clave === sel) ?? lista[0]
  // Llegar con #clave (desde el kit, otra página o WhatsApp) abre esa experiencia.
  useEffect(() => {
    const abrir = () => { const k = location.hash.slice(1); if (EXPERIENCIAS.some((a) => a.clave === k)) { setFiltro(''); setSel(k) } }
    abrir()
    window.addEventListener('hashchange', abrir)
    return () => window.removeEventListener('hashchange', abrir)
  }, [])
  const chips: { k: FiltroExp; txt: string; n: number }[] = [
    { k: '', txt: t.todas, n: EXPERIENCIAS.length },
    { k: 'musulman', txt: t.musulman, n: EXPERIENCIAS.filter((a) => a.musulman).length },
    { k: 'conTony', txt: t.conTony, n: EXPERIENCIAS.filter((a) => a.conTony).length },
    ...ciudades.map((c) => ({ k: c as FiltroExp, txt: CIUDADES[c][id], n: EXPERIENCIAS.filter((a) => a.ciudad === c).length })),
  ]
  return (
    <section className="vn-exp" id="experiencias" aria-labelledby="vn-exp-t">
      <div className="vn-ancho">
        <h2 id="vn-exp-t" className="vn-h2 vn-sube">{t.titulo}</h2>
        <p className="vn-lead vn-sube">{t.sub}</p>
        <div className="vn-chips" role="group" aria-label={t.titulo}>
          {chips.map((c) => (
            <button key={c.k || 'todas'} type="button" aria-pressed={filtro === c.k} onClick={() => setFiltro(c.k)}>
              {c.txt} <small>{c.n}</small>
            </button>
          ))}
        </div>
        <div className="vn-exp-grid">
          <ol className="vn-exp-lista">
            {lista.map((a) => {
              const abierta = a === actual
              return (
                <li key={a.clave} id={a.clave} className={abierta ? 'es-sel' : undefined}>
                  <button type="button" className="vn-exp-fila" aria-expanded={abierta}
                    onMouseEnter={() => setSel(a.clave)} onFocus={() => setSel(a.clave)} onClick={() => setSel(a.clave)}>
                    <IconoExp a={a} />
                    <span className="vn-exp-txt">
                      <b><bdi dir="ltr">{a.nombre}</bdi></b>
                      <small>{textoApp(a, id).que}</small>
                    </span>
                    <span className="vn-exp-marcas" aria-hidden="true">
                      {a.musulman && <i className="es-musulman" title={t.musulman} />}
                      {a.conTony && <i className="es-tony" title={t.conTony} />}
                    </span>
                  </button>
                  {abierta && <div className="vn-exp-movil"><DetalleExp a={a} id={id} ruta={ruta} /></div>}
                </li>
              )
            })}
          </ol>
          <div className="vn-exp-panel">
            <AnimatePresence mode="wait" initial={false}>
              {actual && (
                <motion.div key={actual.clave} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>
                  <DetalleExp a={actual} id={id} ruta={ruta} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Ventajas({ id, app }: { id: VentajasId; app?: string }) {
  const p = T[id]
  // Ficha propia de una app (/es/ventajas/airalo/); si la clave no existe, se ve la lista.
  const appSel = app ? APPS.find((a) => a.clave === app) : undefined
  const dir = id === 'ar' ? 'rtl' : 'ltr'
  const { setLang } = useLanguage()
  useEffect(() => { setLang(id) }, [id, setLang])
  const sufijo = appSel ? `${appSel.clave}/` : ''
  const url = `${BASE}${RUTA[id]}${sufijo}`
  const inicio = id === 'ru' ? '/ru/' : `/${id}/`
  // La versión rusa es de Larion: el WhatsApp y la vuelta son suyos.
  const wa = `https://wa.me/${(id === 'ru' ? GUIAS.larion : GUIAS.tony).wa}?text=${encodeURIComponent(p.saludo)}`
  const hermanas = (Object.keys(RUTA) as VentajasId[]).map((k) => ({ lang: k, href: `${BASE}${RUTA[k]}${sufijo}` }))
  const raiz = useRef<HTMLDivElement>(null)
  const H = HERO[id]

  const categorias = (Object.keys(CATEGORIAS) as Categoria[]).filter((c) => APPS_REJILLA.some((a) => a.cat === c))
  const [filtro, setFiltro] = useState<Categoria | ''>('')
  // Los enlaces #app del kit deben encontrar su icono: al saltar a uno, se quitan los filtros.
  useEffect(() => {
    const quita = () => setFiltro('')
    window.addEventListener('hashchange', quita)
    return () => window.removeEventListener('hashchange', quita)
  }, [])
  // Solo códigos que ahorran dinero: el nº de guía de Yumeyakata no es un descuento.
  const conCodigo = APPS.filter((a) => cuponDe(a) && a.descuento)
  const conEnlace = APPS.filter((a) => esAfiliado(a) && !cuponDe(a))
  const destacado = APPS.find((a) => a.clave === 'nomad' && cuponDe(a)) ?? conCodigo[0]
  const marquesina = APPS_REJILLA.filter((a) => ICONOS_APP.has(a.clave))

  // Movimiento (solo en el cliente y sin «reducir movimiento»): scroll suave con Lenis,
  // titular que entra palabra a palabra y bloques que suben al aparecer.
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
      lenis.on('scroll', ScrollTrigger.update)
      const tic = (t: number) => lenis.raf(t * 1000)
      gsap.ticker.add(tic)
      gsap.ticker.lagSmoothing(0)
      const ctx = gsap.context(() => {
        const titular = nodo.querySelector('.vn-portada h1')
        if (titular) {
          const partido = SplitText.create(titular, { type: 'words', mask: 'words' })
          gsap.from(partido.words, { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.07 })
        }
        gsap.from('.vn-portada .vn-lead, .vn-portada .vn-ctas', { y: 18, opacity: 0, duration: 0.9, ease: 'expo.out', delay: 0.35, stagger: 0.1 })
        gsap.from('.vn-portada-foto img', { scale: 1.18, duration: 1.8, ease: 'expo.out' })
        gsap.from('.vn-portada-billete', { y: 50, rotate: -8, opacity: 0, duration: 1.1, delay: 0.6, ease: 'back.out(1.5)' })
        // La foto se queda atrás al bajar: separa la portada del resto sin cortar en seco.
        gsap.to('.vn-portada-foto img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.vn-portada', start: 'top top', end: 'bottom top', scrub: true } })
        gsap.set('.vn-sube', { y: 28, opacity: 0 })
        ScrollTrigger.batch('.vn-sube', { once: true, start: 'top 88%', onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.07 }) })
      }, nodo)
      limpiar = () => { ctx.revert(); gsap.ticker.remove(tic); lenis.destroy() }
    })()
    return () => { cancelado = true; limpiar() }
  }, [id, appSel])

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

      <Barra id={id} sufijo={sufijo} wa={wa} boton={p.finalBoton} />

      {appSel ? <FichaApp a={appSel} id={id} lista={RUTA[id]} wa={wa} final={p} /> : <main>
        <Indice id={id} />

        <section className="vn-portada">
          <div className="vn-ancho vn-portada-grid">
            <div className="vn-portada-txt">
              <h1>{H.h1}</h1>
              <p className="vn-lead">{H.sub}</p>
              <div className="vn-ctas">
                <a className="vn-boton vn-boton-acento" href="#experiencias">{H.exp}</a>
                <a className="vn-boton vn-boton-linea" href="#codigos">{H.cod}</a>
              </div>
            </div>
            <figure className="vn-portada-foto">
              <div className="vn-portada-marco">
                <img src="/v8/zonas/kioto-fushimi-900.webp" srcSet="/v8/zonas/kioto-fushimi-900.webp 900w, /v8/zonas/kioto-fushimi-4k.webp 2400w"
                  sizes="(max-width: 900px) 100vw, 46vw" alt={H.foto} width="900" height="1125" fetchPriority="high" decoding="async" />
              </div>
              {destacado && (
                <a className="vn-portada-billete" href="#codigos" style={{ ['--marca' as string]: destacado.marca.fondo }}>
                  <IconoApp a={destacado} />
                  <span><b dir="ltr">{destacado.descuento?.startsWith('−') ? destacado.descuento : `−${destacado.descuento}`}</b><small dir="ltr">{destacado.nombre} · {cuponDe(destacado)}</small></span>
                </a>
              )}
            </figure>
          </div>
        </section>

        {/* Una sola marquesina en la página: los iconos reales de las apps que recomiendo. */}
        <div className="vn-marquesina" aria-hidden="true">
          <div className="vn-marquesina-pista">
            {[...marquesina, ...marquesina].map((a, n) => <img key={`${a.clave}-${n}`} src={`/v7/apps/${a.clave}.webp`} alt="" width="56" height="56" loading="lazy" decoding="async" />)}
          </div>
        </div>

        <Experiencias id={id} ruta={RUTA[id]} />

        {conCodigo.length > 0 && (
          <section className="vn-cod" id="codigos" aria-labelledby="vn-cod-t">
            <div className="vn-ancho">
              <h2 id="vn-cod-t" className="vn-h2 vn-sube">{CODIGOS[id].titulo}</h2>
              <p className="vn-lead vn-sube">{CODIGOS[id].sub}</p>
            </div>
            <div className="vn-billetes">
              {conCodigo.map((a) => (
                <article key={a.clave} className="vn-billete" style={{ ['--marca' as string]: a.marca.fondo, ['--marca-tinta' as string]: a.marca.tinta }}>
                  <div className="vn-billete-cab">
                    <IconoApp a={a} />
                    <span><b dir="ltr">{a.nombre}</b><small>{CATEGORIAS[a.cat][id]}</small></span>
                  </div>
                  <p className="vn-billete-dto" dir="ltr">{a.descuento}</p>
                  <div className="vn-billete-corte" aria-hidden="true" />
                  <div className="vn-billete-cod">
                    <CodigoCifrado>{cuponDe(a)!}</CodigoCifrado>
                    <BotonCopiar texto={cuponDe(a)!} copiar={p.copiar} copiado={p.copiado} />
                  </div>
                  <p className="vn-billete-pie">
                    {a.caduca ? <small>{CODIGOS[id].hasta} <bdi dir="ltr">{new Date(`${a.caduca}T12:00:00`).toLocaleDateString(id === 'ar' ? 'ar-EG' : id, { day: 'numeric', month: 'short', year: 'numeric' })}</bdi></small> : <small />}
                    <a href={enlaceDe(a)} target="_blank" rel="noopener noreferrer sponsored">{CODIGOS[id].ir}</a>
                    <Link to={`${RUTA[id]}${a.clave}/`}>{CODIGOS[id].ver}</Link>
                  </p>
                </article>
              ))}
            </div>
            <div className="vn-ancho vn-cod-pie">
              <p className="vn-guarda">
                <a className="vn-boton vn-boton-wa" href={`https://wa.me/?text=${encodeURIComponent([GUARDA[id].msg, ...conCodigo.map((a) => `${a.nombre}: ${cuponDe(a)}${a.descuento ? ` (${a.descuento.startsWith('−') ? '' : '−'}${a.descuento})` : ''}`), `${GUARDA[id].todo} ${URL_VENTAJAS[id]}`].join('\n'))}`} target="_blank" rel="noopener noreferrer">
                  <IconoWa /> {GUARDA[id].boton}
                </a>
                <small>{GUARDA[id].nota}</small>
              </p>
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
              <aside className="vn-claro"><b>{CODIGOS[id].claro}.</b> {CODIGOS[id].claroTexto}</aside>
            </div>
          </section>
        )}

        <section className="vn-kit" id="kit" aria-labelledby="vn-kit-t">
          <div className="vn-ancho">
            <h2 id="vn-kit-t" className="vn-h2 vn-sube">{PASOS[id].titulo}</h2>
            <div className="vn-bento">
              {PASOS[id].lista.map((paso, n) => (
                <div key={paso.t} className={`vn-celda vn-celda-${n} vn-sube`}>
                  {FOTO_KIT[n] && <img className="vn-celda-foto" src={FOTO_KIT[n]} alt="" loading="lazy" decoding="async" />}
                  <div className="vn-celda-txt">
                    <Dibujo n={paso.n} className="vn-celda-ico" />
                    <h3>{paso.t}</h3>
                    <p>{paso.d}</p>
                    <div className="vn-celda-apps">
                      {paso.apps.map((k) => { const ap = APPS.find((x) => x.clave === k); return ap && <a key={k} href={`#${k}`}><IconoApp a={ap} /><span dir="ltr">{ap.nombre.replace('Google ', '')}</span></a> })}
                    </div>
                  </div>
                </div>
              ))}
              <div className="vn-celda vn-celda-consejos vn-sube">
                <h3>{p.consejosTitulo}</h3>
                <ol>{p.consejos.map((c) => <li key={c}>{c}</li>)}</ol>
              </div>
            </div>
          </div>
        </section>

        <section className="vn-apps" id="apps" aria-labelledby="vn-apps-t">
          <div className="vn-ancho">
            <h2 id="vn-apps-t" className="vn-h2 vn-sube">{APPS_T[id].titulo}</h2>
            <p className="vn-lead vn-sube">{APPS_T[id].sub}</p>
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
        </section>

        <section className="vn-faq" id="preguntas" aria-labelledby="vn-faq-t">
          <div className="vn-ancho vn-faq-grid">
            <div className="vn-faq-cab">
              <h2 id="vn-faq-t" className="vn-h2">{AYUDA[id].titulo}</h2>
              <p className="vn-lead">{AYUDA[id].sub}</p>
            </div>
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
        </section>

        <section className="vn-final">
          <div className="vn-ancho vn-final-grid">
            <div className="vn-final-tour vn-sube">
              <h2 className="vn-h2">{p.finalTitulo}</h2>
              <p>{p.finalTexto}</p>
              <a className="vn-boton vn-boton-wa" href={wa} target="_blank" rel="noopener noreferrer"><IconoWa /> {p.finalBoton}</a>
              <Link className="vn-enlace" to={inicio}>{p.volver}</Link>
            </div>
            <div className="vn-final-socios vn-sube" id="colaborar">
              <h3>{SOCIOS[id].titulo}</h3>
              <p>{SOCIOS[id].texto}</p>
              <a className="vn-boton vn-boton-linea" href={`mailto:${CORREO}?subject=${encodeURIComponent(SOCIOS[id].asunto)}`}>{SOCIOS[id].boton}</a>
            </div>
          </div>
        </section>
      </main>}

      <Pie id={id} />
    </div>
  )
}
