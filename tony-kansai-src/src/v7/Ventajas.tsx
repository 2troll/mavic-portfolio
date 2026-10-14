// Ventajas para el viajero: apps y códigos de amigo que facilitan moverse y
// pagar en Kansai (/es/ventajas/, /en/perks/, /ar/perks/). Solo se ponen
// códigos reales de Tony; si una app no tiene campaña, se enlaza la oficial
// sin código. Cada app va en su panel con sus colores y su logo (datosVentajas.ts);
// la página no usa el tema píxel: tiene su propia hoja, ventajas.css.

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import { GUIAS, CORREO } from './contenido'
import { Logo } from './Logo'
import { IconoWa } from './IconoWa'
import { enlacesHreflang } from '../seo/hreflang'
import { PIE } from './formato'
import { APPS, CATEGORIAS, SEO_VENTAJAS, cuponDe, esAfiliado, enlaceDe, type Categoria } from './datosVentajas'
import { LOGOS, ICONOS_APP } from './logosMarcas'
import MovilMueve from './MovilMueve'
import { motion, AnimatePresence } from 'framer-motion'
import { AYUDA, type Enlace } from './datosAyudaViaje'
import { FichaApp, textoApp, MAS } from './FichaVentaja'
import './v7.css'
import './ventajas.css'

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
    h1: 'Las apps para viajar por Kansai como un local',
    sub: 'Las apps que uso y recomiendo en Osaka y Kioto: internet, entradas, hotel, taxi, bici y pagos. Cada una en su ficha, para ir directo a lo que necesitas.',
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
    h1: 'The apps to travel Kansai like a local',
    sub: 'The apps I use and recommend in Osaka and Kyoto: data, tickets, hotels, taxis, bikes and payments. Each one on its own card, so you go straight to what you need.',
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
    h1: 'تطبيقات السفر في كانساي مثل أهل البلد',
    sub: 'التطبيقات التي أستخدمها وأنصح بها في أوساكا وكيوتو: الإنترنت والتذاكر والفنادق والتاكسي والدراجات والدفع، كلٌّ في بطاقته.',
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
    h1: 'Приложения, чтобы путешествовать по Кансаю как местный',
    sub: 'Интернет, билеты, отели, такси, велосипеды и оплата в Осаке и Киото. Каждое приложение — на своей карточке, с подробной инструкцией.',
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

export default function Ventajas({ id, app }: { id: VentajasId; app?: string }) {
  const p = T[id]
  // Ficha propia de una app (/es/ventajas/airalo/); si la clave no existe, se ve la lista.
  const appSel = app ? APPS.find((a) => a.clave === app) : undefined
  const dir = id === 'ar' ? 'rtl' : 'ltr'
  const { setLang } = useLanguage()
  useEffect(() => { setLang(id) }, [id, setLang])
  const url = `${BASE}${RUTA[id]}${appSel ? `${appSel.clave}/` : ''}`
  const inicio = id === 'ru' ? '/ru/' : `/${id}/`
  // La versión rusa es de Larion: el WhatsApp y la vuelta son suyos.
  const wa = `https://wa.me/${(id === 'ru' ? GUIAS.larion : GUIAS.tony).wa}?text=${encodeURIComponent(p.saludo)}`
  const pie = PIE[id]
  const hermanas = (Object.keys(RUTA) as VentajasId[]).map((k) => ({ lang: k, href: `${BASE}${RUTA[k]}${appSel ? `${appSel.clave}/` : ''}` }))
  const NOMBRE_IDIOMA: Record<VentajasId, string> = { es: 'ES', en: 'EN', ar: 'عربي', ru: 'RU' }
  const raiz = useRef<HTMLDivElement>(null)

  // Aparición al bajar: solo con JS activo (la página estática se ve entera sin él).
  useEffect(() => {
    const nodo = raiz.current
    if (!nodo || !('IntersectionObserver' in window)) return
    nodo.classList.add('vt-js')
    const io = new IntersectionObserver((entradas) => {
      for (const e of entradas) if (e.isIntersecting) { e.target.classList.add('vt-visto'); io.unobserve(e.target) }
    }, { threshold: 0.18 })
    nodo.querySelectorAll('.vt-aparece').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [id])

  const categorias = (Object.keys(CATEGORIAS) as Categoria[]).filter((c) => APPS.some((a) => a.cat === c))
  const [filtro, setFiltro] = useState<Categoria | ''>('')
  // Los enlaces #app del kit deben encontrar su tarjeta: al saltar a una, se quitan los filtros.
  useEffect(() => {
    const quita = () => setFiltro('')
    window.addEventListener('hashchange', quita)
    return () => window.removeEventListener('hashchange', quita)
  }, [])
  const cupon0 = APPS.find((a) => a.clave === 'airalo' && cuponDe(a))
  const conCodigo = APPS.filter((a) => cuponDe(a))
  const conEnlace = APPS.filter((a) => esAfiliado(a) && !cuponDe(a))

  return (
    <div ref={raiz} className={`vt lang-${id}`} lang={id} dir={dir}>
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

      <header className="vt-barra">
        <Link to={inicio} className="vt-marca" aria-label="Tony Kansai Guide"><Logo /></Link>
        <nav className="vt-idiomas" aria-label="Language">
          {(Object.keys(RUTA) as VentajasId[]).map((k) => (
            <Link key={k} to={`${RUTA[k]}${appSel ? `${appSel.clave}/` : ''}`} lang={k} aria-current={k === id ? 'page' : undefined}>{NOMBRE_IDIOMA[k]}</Link>
          ))}
        </nav>
        <a className="vt-wa" href={wa} target="_blank" rel="noopener noreferrer" aria-label={p.finalBoton}>
          <IconoWa /><span className="vt-solo-ancho">{p.finalBoton}</span>
        </a>
      </header>

      {appSel ? <FichaApp a={appSel} id={id} lista={RUTA[id]} wa={wa} final={p} /> : <main>
        <section className="vt-portada">
          <div className="vt-portada-texto">
            <p className="vt-antetitulo">{p.antetitulo.replace(/^\p{Extended_Pictographic}\s*/u, '')}</p>
            <h1>{p.h1}</h1>
            <p className="vt-sub">{p.sub}</p>
            <p className="vt-pista"><Dibujo n="sparkles" className="vt-pista-ico" /> {TOCA[id]}</p>
          </div>
          <div className="vt-movil-zona">
            <MovilMueve rtl={id === 'ar'} etiqueta={p.antetitulo}>
              <div className="vt-movil-isla" aria-hidden="true" />
              <span className="vt-movil-boton vt-movil-boton-izq" aria-hidden="true" /><span className="vt-movil-boton vt-movil-boton-der" aria-hidden="true" />
              <div className="vt-movil-hora" aria-hidden="true"><span>9:41</span><span>Kansai</span></div>
              <div className="vt-movil-apps">
                {APPS.map((a, n) => (
                  <Link key={a.clave} to={`${RUTA[id]}${a.clave}/`} className="vt-movil-app" style={{ ['--i' as string]: n }}>
                    <IconoApp a={a} />
                    <span dir="ltr">{a.nombre.replace('Google ', '')}</span>
                  </Link>
                ))}
              </div>
            </MovilMueve>
            {cupon0 && (
              <a href={`#${cupon0.clave}`} className="vt-flotante vt-flotante-1"><IconoApp a={cupon0} /><span><b>−450 ¥</b><small dir="ltr">{cupon0.codigo}</small></span></a>
            )}
            <span className="vt-flotante vt-flotante-2" aria-hidden="true"><Dibujo n="scooter-electric" /></span>
            <span className="vt-flotante vt-flotante-3" aria-hidden="true"><Dibujo n="train" /></span>
          </div>
        </section>

        {conCodigo.length > 0 && (
          <section className="vt-codigos" id="codigos" aria-labelledby="vt-codigos-t">
            <h2 id="vt-codigos-t">{CODIGOS[id].titulo}</h2>
            <p className="vt-codigos-sub">{CODIGOS[id].sub}</p>
            <p className="vt-guarda">
              <a href={`https://wa.me/?text=${encodeURIComponent([GUARDA[id].msg, ...conCodigo.map((a) => `${a.nombre}: ${cuponDe(a)}${a.descuento ? ` (${a.descuento.startsWith('−') ? '' : '−'}${a.descuento})` : ''}`), `${GUARDA[id].todo} ${URL_VENTAJAS[id]}`].join('\n'))}`} target="_blank" rel="noopener noreferrer">
                <IconoWa /> {GUARDA[id].boton}
              </a>
              <small>{GUARDA[id].nota}</small>
            </p>
            <ul>
              {conCodigo.map((a) => (
                <li key={a.clave} style={{ ['--marca-boton' as string]: a.marca.fondo, ['--marca-boton-tinta' as string]: a.marca.tinta }}>
                  <IconoApp a={a} />
                  <div className="vt-codigos-txt">
                    <strong dir="ltr">{a.nombre}</strong>
                    {a.descuento && <span className="vt-codigos-dto" dir="ltr">{a.descuento}</span>}
                    <code dir="ltr">{cuponDe(a)}</code>
                    {a.caduca && <small>{CODIGOS[id].hasta} <bdi dir="ltr">{new Date(`${a.caduca}T12:00:00`).toLocaleDateString(id === 'ar' ? 'ar-EG' : id, { day: 'numeric', month: 'short', year: 'numeric' })}</bdi></small>}
                  </div>
                  <BotonCopiar texto={cuponDe(a)!} copiar={p.copiar} copiado={p.copiado} />
                  <span className="vt-codigos-acc">
                    <a href={enlaceDe(a)} target="_blank" rel="noopener noreferrer sponsored">{CODIGOS[id].ir} {id === 'ar' ? '←' : '→'}</a>
                    <Link to={`${RUTA[id]}${a.clave}/`}>{CODIGOS[id].ver}</Link>
                  </span>
                </li>
              ))}
            </ul>
            {conEnlace.length > 0 && (
              <>
                <h3 className="vt-codigos-h3">{CODIGOS[id].enlaces}</h3>
                <p className="vt-codigos-sub">{CODIGOS[id].enlacesSub}</p>
                <div className="vt-enlaces">
                  {conEnlace.map((a) => (
                    <a key={a.clave} href={enlaceDe(a)} target="_blank" rel="noopener noreferrer sponsored">
                      <IconoApp a={a} /><span><b dir="ltr">{a.nombre}</b><small>{CATEGORIAS[a.cat][id]}</small></span>
                    </a>
                  ))}
                </div>
              </>
            )}
            <aside className="vt-claro"><b>{CODIGOS[id].claro}.</b> {CODIGOS[id].claroTexto}</aside>
          </section>
        )}

        <section className="vt-kit">
          <h2>{PASOS[id].titulo}</h2>
          <ol>
            {PASOS[id].lista.map((paso, n) => (
              <li key={paso.t} className="vt-aparece">
                <span className="vt-kit-num">{n + 1}</span>
                <Dibujo n={paso.n} className="vt-kit-dibujo" />
                <h3>{paso.t}</h3>
                <p>{paso.d}</p>
                <div className="vt-kit-apps">
                  {paso.apps.map((k) => { const ap = APPS.find((x) => x.clave === k); return ap && <a key={k} href={`#${k}`}><IconoApp a={ap} /><span dir="ltr">{ap.nombre.replace('Google ', '')}</span></a> })}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <nav className="vt-chips" aria-label={p.antetitulo}>
          <button type="button" aria-pressed={filtro === ''} onClick={() => setFiltro('')}>{TODAS[id]} <small>{APPS.length}</small></button>
          {categorias.map((c) => (
            <button key={c} type="button" aria-pressed={filtro === c} onClick={() => setFiltro(c)}>
              {CATEGORIAS[c][id]} <small>{APPS.filter((a) => a.cat === c).length}</small>
            </button>
          ))}
        </nav>

        {/* Rejilla compacta: todas las apps a la vista, filtradas por categoría.
            Las tarjetas se recolocan con muelle (framer-motion, layout). */}
        <div className="vt-rejilla">
          <AnimatePresence initial={false} mode="popLayout">
            {APPS.filter((a) => !filtro || a.cat === filtro).map((a) => {
              const cupon = cuponDe(a)
              const href = a.codigo?.startsWith('http') ? a.codigo : a.enlace
              const t = textoApp(a, id)
              return (
                <motion.article key={a.clave} id={a.clave} className="vt-tarjeta" layout
                  initial={{ opacity: 0, scale: 0.92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  style={{ ['--marca' as string]: a.marca.fondo, ['--marca-tinta' as string]: a.marca.tinta, ...colorTarjeta(a) }}>
                  <div className="vt-tarjeta-cab">
                    <IconoApp a={a} />
                    <div>
                      <h3 dir="ltr">{a.nombre}</h3>
                      <p className="vt-tarjeta-cat">{CATEGORIAS[a.cat][id]}</p>
                    </div>
                  </div>
                  <p className="vt-tarjeta-que">{t.que}</p>
                  <p className="vt-tarjeta-ventaja">{t.ventaja}</p>
                  {cupon && (
                    <div className="vt-tarjeta-cupon">
                      <bdi dir="ltr"><code>{cupon}</code></bdi>
                      <BotonCopiar texto={cupon} copiar={p.copiar} copiado={p.copiado} />
                    </div>
                  )}
                  <div className="vt-tarjeta-acciones">
                    <a className="vt-tarjeta-abrir" href={href} target="_blank" rel="noopener noreferrer sponsored">{ABRIR[id]} <span aria-hidden="true">{id === 'ar' ? '←' : '→'}</span></a>
                    <Link className="vt-mas" to={`${RUTA[id]}${a.clave}/`}>{MAS[id]}</Link>
                  </div>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </div>

        <section className="vt-bloque">
          <h2>{p.consejosTitulo}</h2>
          <ol className="vt-consejos">{p.consejos.map((c) => <li key={c}>{c}</li>)}</ol>
          <p className="vt-aviso">{p.aviso}</p>
        </section>

        <section className="vt-ayuda" id="preguntas">
          <h2>{AYUDA[id].titulo}</h2>
          <p className="vt-ayuda-sub">{AYUDA[id].sub}</p>
          <div className="vt-ayuda-lista">
            {AYUDA[id].preguntas.map((q) => (
              <details key={q.q} className="vt-ayuda-item">
                <summary><Dibujo n={q.icono} className="vt-ayuda-ico" /><span>{q.q}</span></summary>
                <p>{q.a}</p>
                <p className="vt-ayuda-enlaces">{q.enlaces.map((e) => <EnlaceAyuda key={e.texto} e={e} lista={RUTA[id]} />)}</p>
              </details>
            ))}
          </div>
        </section>


        <section className="vt-final vt-socios" id="colaborar">
          <h2>{SOCIOS[id].titulo}</h2>
          <p>{SOCIOS[id].texto}</p>
          <a className="vt-wa vt-wa-grande" href={`mailto:${CORREO}?subject=${encodeURIComponent(SOCIOS[id].asunto)}`}>✉️ {SOCIOS[id].boton}</a>
          <p><a href={`mailto:${CORREO}`}>{CORREO}</a></p>
        </section>

        <section className="vt-final">
          <h2>{p.finalTitulo}</h2>
          <p>{p.finalTexto}</p>
          <a className="vt-wa vt-wa-grande" href={wa} target="_blank" rel="noopener noreferrer"><IconoWa /> {p.finalBoton}</a>
          <p><Link to={inicio}>{p.volver}</Link></p>
        </section>
      </main>}

      <footer className="vt-pie">
        <span><Logo /></span>
        <a href={`mailto:${CORREO}`}>{CORREO}</a>
        <nav>
          <Link to={`/legal?lang=${id}`}>{pie.legal}</Link>
          <Link to={`/terms?lang=${id}`}>{pie.condiciones}</Link>
          <Link to={`/privacy?lang=${id}`}>{pie.privacidad}</Link>
        </nav>
      </footer>
    </div>
  )
}
