// Bloques de la página de ventajas rehechos el 17-11-2026 con componentes GRATIS de
// React Bits (src/v7/reactbits/, MIT + Commons Clause): RotatingText y CountUp en la
// portada, SpotlightCard en las tarjetas, StarBorder en el botón principal,
// DecryptedText en los códigos y ScrollReveal en «Te lo digo claro».
// Lo nuevo de fondo: cada socio dice CÓMO se consigue su ventaja (datosCanje.ts),
// tal como lo pidió por correo: código, frase en la reserva, decir mi nombre,
// enseñar el pase con el logo, o reservarlo yo. Y sus condiciones, en chips.
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgePercent, CalendarCheck, Check, Copy, MessageSquareText, Mic, Ticket, UserRoundCheck, X, ArrowUpRight, Moon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { APPS, CATEGORIAS, CIUDADES, KANSAI, REGIONES, ciudadesDe, cuponDe, enKansai, enlaceDe, type App, type Ciudad } from './datosVentajas'
import { CANJE, canjeDe, reglasDe, type Canje } from './datosCanje'
import { ICONOS_APP } from './logosMarcas'
import { ICONO_EXP } from './iconosExperiencia'
import { FOTO_EXP, FOTO_SOCIO, GUIA } from './datosVentajasGuia'
import { FotoSocio, FotoZona } from './FotoZona'
import { textoApp, MAS } from './FichaVentaja'
import { enlaceGuia } from './contenido'
import { IconoCanal } from './IconoWa'
import { MetaFila, Vistazo, PasosReserva, tienePasos } from './Vistazo'
import './vistazo.css'
import SpotlightCard from './reactbits/SpotlightCard'
import StarBorder from './reactbits/StarBorder'
import RotatingText from './reactbits/RotatingText'
import CountUp from './reactbits/CountUp'
import DecryptedText from './reactbits/DecryptedText'
import ScrollReveal from './reactbits/ScrollReveal'
import './reactbits/SpotlightCard.css'
import './reactbits/StarBorder.css'
import './reactbits/RotatingText.css'
import './reactbits/ScrollReveal.css'
import './ventajas-rb.css'

type Id = 'es' | 'en' | 'ar' | 'ru'
const TORII = 'M2.222 3.372a1 1 0 0 1 1.027-.34c1.078.277 2.167.517 3.257.738c1.852.375 4.015.73 5.494.73s3.642-.355 5.494-.73c1.09-.22 2.178-.461 3.256-.738a1 1 0 0 1 1.144 1.415l-2 4c-.15.3-.446.507-.778.546A91 91 0 0 1 16 9.3v1.366a58 58 0 0 0 3.797-.644a1 1 0 0 1 .406 1.958q-.6.123-1.203.23V18a1 1 0 1 1 0 2h-5a1 1 0 1 1 0-2v-5.095c-.692.059-1.374.095-2 .095s-1.308-.037-2-.095V18a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2v-5.79a49 49 0 0 1-1.203-.23a1 1 0 0 1 .406-1.96l.003.002q1.886.382 3.794.643V9.299a91 91 0 0 1-3.116-.306q-.001 0 0 0a1 1 0 0 1-.778-.546l-2-4a1 1 0 0 1 .116-1.075M12 9.5c.617 0 1.304-.024 2-.062v1.459c-.703.063-1.387.103-2 .103s-1.297-.04-2-.103v-1.46c.696.039 1.383.063 2 .063'

export const EXPERIENCIAS = APPS.filter((a) => a.cat === 'experiencias')
// Kansai primero; dentro, las que tienen ventaja (código, nota, pase…) y las aptas para musulmanes.
const peso = (a: App) => (enKansai(a) ? 10 : 0) + (canjeDe(a.clave) !== 'directo' ? 2 : 0) + Number(!!a.musulman)
const ORDENADAS = [...EXPERIENCIAS].sort((a, b) => peso(b) - peso(a))
const CONTADAS = 12 // las demás, tras «Ver todas»

const guiaDe = (id: Id) => (id === 'ru' ? 'larion' : 'tony')

// ── Textos ────────────────────────────────────────────────────────────────

const CANJE_T: Record<Id, Record<Canje, { t: string; d: string; corto: string }>> = {
  es: {
    codigo: { t: 'Código de descuento', d: 'Copia el código y pégalo al pagar en su web.', corto: 'Código' },
    comentario: { t: 'Una frase en la reserva', d: 'Escribe la frase en las notas o comentarios al reservar en su web.', corto: 'Nota al reservar' },
    nombre: { t: 'Di mi nombre', d: 'Al reservar, di que vienes de parte de Tony Hanma.', corto: 'Di «Tony Hanma»' },
    logo: { t: 'Enseña mi pase', d: 'Abre el pase de Tony Kansai Guide en el móvil y enséñalo en recepción.', corto: 'Enseña mi pase' },
    conmigo: { t: 'Te lo reservo yo', d: 'La ventaja solo vale si lo reservo yo: escríbeme la fecha y cuántos sois.', corto: 'Te lo reservo yo' },
    directo: { t: 'Reserva directa', d: 'Sin descuento: está aquí porque lo conozco y lo recomiendo.', corto: 'Reserva directa' },
  },
  en: {
    codigo: { t: 'Discount code', d: 'Copy the code and paste it at checkout on their website.', corto: 'Code' },
    comentario: { t: 'A line in your booking', d: 'Write the line in the notes or comments when you book on their website.', corto: 'Booking note' },
    nombre: { t: 'Say my name', d: 'When you book, say Tony Hanma sent you.', corto: 'Say “Tony Hanma”' },
    logo: { t: 'Show my pass', d: 'Open the Tony Kansai Guide pass on your phone and show it at reception.', corto: 'Show my pass' },
    conmigo: { t: 'I book it for you', d: 'The perk only applies when I book it: message me the date and how many you are.', corto: 'I book it' },
    directo: { t: 'Book direct', d: 'No discount: it is here because I know it and recommend it.', corto: 'Book direct' },
  },
  ar: {
    codigo: { t: 'رمز خصم', d: 'انسخ الرمز والصقه عند الدفع في موقعهم.', corto: 'رمز' },
    comentario: { t: 'جملة في الحجز', d: 'اكتب الجملة في خانة الملاحظات عند الحجز في موقعهم.', corto: 'ملاحظة في الحجز' },
    nombre: { t: 'اذكر اسمي', d: 'عند الحجز، قل إنك قادم من طرف Tony Hanma.', corto: 'قل «Tony Hanma»' },
    logo: { t: 'اعرض بطاقتي', d: 'افتح بطاقة Tony Kansai Guide على هاتفك واعرضها في الاستقبال.', corto: 'اعرض بطاقتي' },
    conmigo: { t: 'أحجزه لك أنا', d: 'الميزة تسري فقط عندما أحجز أنا: أرسل لي التاريخ وعددكم.', corto: 'أحجزه أنا' },
    directo: { t: 'حجز مباشر', d: 'بلا خصم: موجود هنا لأنني أعرفه وأنصح به.', corto: 'حجز مباشر' },
  },
  ru: {
    codigo: { t: 'Промокод', d: 'Скопируйте код и вставьте при оплате на их сайте.', corto: 'Код' },
    comentario: { t: 'Фраза в бронировании', d: 'Напишите фразу в примечании или комментарии при бронировании на их сайте.', corto: 'Фраза в брони' },
    nombre: { t: 'Назовите имя', d: 'При бронировании скажите, что вы от Tony Hanma.', corto: 'Скажите «Tony Hanma»' },
    logo: { t: 'Покажите пропуск', d: 'Откройте пропуск Tony Kansai Guide в телефоне и покажите на ресепшене.', corto: 'Покажите пропуск' },
    conmigo: { t: 'Забронируем мы', d: 'Бонус действует, только если бронируем мы: напишите дату и сколько вас.', corto: 'Бронируем мы' },
    directo: { t: 'Прямое бронирование', d: 'Без скидки: здесь, потому что мы это знаем и советуем.', corto: 'Напрямую' },
  },
}
const ICONO_CANJE: Record<Canje, LucideIcon> = { codigo: BadgePercent, comentario: MessageSquareText, nombre: Mic, logo: Ticket, conmigo: UserRoundCheck, directo: CalendarCheck }
const ORDEN_CANJE: Canje[] = ['codigo', 'comentario', 'nombre', 'logo', 'conmigo']

const UI: Record<Id, {
  ojo: string; h1: string; con: string; rota: string[]; sub: string; exp: string; cod: string; foto: string
  stats: [string, string, string, string]
  comoOjo: string; comoT: string; comoSub: string; socios: string; abrirPase: string
  expT: string; expSub: string; todas: string; musulman: string; verTodas: string; verMenos: string; ninguna: string
  condiciones: string; comoSe: string; copiar: string; copiado: string; reservar: string; web: string; solo: string; cerrar: string; msg: string
  paseT: string; paseSub: string; paseLinea: string; paseBrillo: string; paseDe: string
  codT: string; codSub: string; hasta: string; ir: string; ver: string
  claro: string
}> = {
  es: {
    ojo: 'Ventajas para mis viajeros', h1: 'Lo mejor de Japón, de mi parte', con: 'Con ventaja en', rota: ['kimono', 'ceremonia del té', 'samuráis', 'cocina japonesa', 'internet', 'talleres'],
    sub: 'Socios que conozco en persona. Cada uno me dijo por escrito qué ventaja te da y cómo pedirla: aquí lo tienes, sin letra pequeña.',
    exp: 'Ver experiencias', cod: 'Mis códigos', foto: 'Torii rojos de Fushimi Inari, en Kioto',
    stats: ['experiencias', 'con ventaja', 'códigos', 'aptas para musulmanes'],
    comoOjo: 'Cómo funciona', comoT: 'Cada socio pide una cosa distinta', comoSub: 'Unos dan un código, otros quieren una frase en la reserva o ver mi pase. Toca una forma para ver qué socios la usan.', socios: 'socios', abrirPase: 'Abrir mi pase',
    expT: 'Experiencias que no encuentras en una app', expSub: 'Talleres, kimonos, samuráis y cocina. Toca una tarjeta para ver las condiciones completas y cómo conseguir la ventaja.',
    todas: 'Todas', musulman: 'Apto para musulmanes', verTodas: 'Ver las {n} experiencias', verMenos: 'Ver menos', ninguna: 'No hay experiencias con este filtro.',
    condiciones: 'Condiciones del socio', comoSe: 'Cómo conseguir la ventaja', copiar: 'Copiar', copiado: 'Copiado', reservar: 'Resérvalo conmigo', web: 'Su web', solo: 'Ve por tu cuenta: cómo llegar', cerrar: 'Cerrar', msg: 'Hola Tony, me interesa {n}. ¿Me ayudas a reservarlo?',
    paseT: 'Pase de Tony Kansai Guide', paseSub: 'Enséñalo en recepción', paseLinea: 'Vengo de parte de Tony Kansai Guide (Tony Hanma).', paseBrillo: 'Sube el brillo de la pantalla.', paseDe: 'Para',
    codT: 'Tus códigos de descuento', codSub: 'Toca para copiar y pégalo al pagar, en el campo de código promocional o cupón.', hasta: 'hasta el', ir: 'Ir a la web', ver: 'Cómo usarlo',
    claro: 'Te lo digo claro: cuando reservas con mis enlaces o códigos, la empresa me paga una pequeña comisión. Tu precio es el mismo, y con código, menor. Solo pongo aquí lo que uso con mis clientes.',
  },
  en: {
    ojo: 'Perks for my travellers', h1: 'The best of Japan, through me', con: 'Perks on', rota: ['kimono', 'tea ceremony', 'samurai', 'Japanese cooking', 'mobile data', 'workshops'],
    sub: 'Partners I know in person. Each one told me in writing what perk you get and how to ask for it: here it is, no small print.',
    exp: 'See experiences', cod: 'My codes', foto: 'Red torii gates at Fushimi Inari, Kyoto',
    stats: ['experiences', 'with a perk', 'codes', 'Muslim-friendly'],
    comoOjo: 'How it works', comoT: 'Each partner asks for something different', comoSub: 'Some give a code, others want a line in your booking or to see my pass. Tap one to see which partners use it.', socios: 'partners', abrirPase: 'Open my pass',
    expT: 'Experiences you won’t find in an app', expSub: 'Workshops, kimono, samurai and cooking. Tap a card for the full conditions and how to get the perk.',
    todas: 'All', musulman: 'Muslim-friendly', verTodas: 'See all {n} experiences', verMenos: 'Show fewer', ninguna: 'No experiences match this filter.',
    condiciones: 'Partner conditions', comoSe: 'How to get the perk', copiar: 'Copy', copiado: 'Copied', reservar: 'Book it with me', web: 'Their website', solo: 'Go on your own: getting there', cerrar: 'Close', msg: 'Hi Tony, I’m interested in {n}. Can you help me book it?',
    paseT: 'Tony Kansai Guide pass', paseSub: 'Show it at reception', paseLinea: 'I was referred by Tony Kansai Guide (Tony Hanma).', paseBrillo: 'Turn your screen brightness up.', paseDe: 'For',
    codT: 'Your discount codes', codSub: 'Tap to copy and paste it at checkout, in the promo code or coupon field.', hasta: 'until', ir: 'Go to website', ver: 'How to use it',
    claro: 'To be clear: when you book with my links or codes, the company pays me a small commission. Your price is the same, and with a code, lower. I only list what I use with my own guests.',
  },
  ar: {
    ojo: 'مزايا لضيوفي', h1: 'أفضل ما في اليابان، من طرفي', con: 'مزايا على', rota: ['الكيمونو', 'حفل الشاي', 'الساموراي', 'الطبخ الياباني', 'الإنترنت', 'الورش'],
    sub: 'شركاء أعرفهم شخصيًا. كلٌّ منهم أخبرني كتابةً بالميزة التي تحصل عليها وكيف تطلبها: هذه هي، بلا شروط مخفية.',
    exp: 'شاهد التجارب', cod: 'رموزي', foto: 'بوابات توري الحمراء في فوشيمي إيناري، كيوتو',
    stats: ['تجربة', 'بميزة', 'رموز', 'مناسبة للمسلمين'],
    comoOjo: 'كيف يعمل', comoT: 'كل شريك يطلب شيئًا مختلفًا', comoSub: 'بعضهم يعطي رمزًا، وآخرون يريدون جملة في الحجز أو رؤية بطاقتي. اضغط على طريقة لترى الشركاء الذين يستخدمونها.', socios: 'شركاء', abrirPase: 'افتح بطاقتي',
    expT: 'تجارب لن تجدها في أي تطبيق', expSub: 'ورش وكيمونو وساموراي وطبخ. اضغط على بطاقة لترى الشروط كاملة وكيف تحصل على الميزة.',
    todas: 'الكل', musulman: 'مناسب للمسلمين', verTodas: 'شاهد كل التجارب ({n})', verMenos: 'عرض أقل', ninguna: 'لا توجد تجارب بهذا الاختيار.',
    condiciones: 'شروط الشريك', comoSe: 'كيف تحصل على الميزة', copiar: 'نسخ', copiado: 'تم النسخ', reservar: 'احجزه معي', web: 'موقعهم', solo: 'اذهب وحدك: كيف تصل', cerrar: 'إغلاق', msg: 'مرحبًا طوني، أنا مهتم بـ {n}. هل تساعدني في الحجز؟',
    paseT: 'بطاقة Tony Kansai Guide', paseSub: 'اعرضها في الاستقبال', paseLinea: 'أنا قادم من طرف Tony Kansai Guide (Tony Hanma).', paseBrillo: 'ارفع سطوع الشاشة.', paseDe: 'إلى',
    codT: 'رموز الخصم الخاصة بك', codSub: 'اضغط للنسخ والصقه عند الدفع في خانة الرمز الترويجي أو القسيمة.', hasta: 'حتى', ir: 'افتح الموقع', ver: 'طريقة الاستخدام',
    claro: 'بكل وضوح: عندما تحجز عبر روابطي أو رموزي، تدفع لي الشركة عمولة صغيرة. سعرك نفسه، ومع الرمز أقل. لا أضع هنا إلا ما أستخدمه مع ضيوفي.',
  },
  ru: {
    ojo: 'Полезное для наших гостей', h1: 'Лучшее в Японии — от нас', con: 'Скидки на', rota: ['кимоно', 'чайную церемонию', 'самураев', 'японскую кухню', 'интернет', 'мастер-классы'],
    sub: 'Партнёры, которых мы знаем лично. Каждый письменно подтвердил, какой бонус вы получаете и как его попросить: всё здесь, без мелкого шрифта.',
    exp: 'Смотреть впечатления', cod: 'Коды', foto: 'Красные ворота тории в Фусими Инари, Киото',
    stats: ['впечатлений', 'с бонусом', 'кодов', 'подходят мусульманам'],
    comoOjo: 'Как это работает', comoT: 'Каждый партнёр просит своё', comoSub: 'Одни дают код, другие просят фразу в бронировании или показать наш пропуск. Нажмите на способ, чтобы увидеть партнёров.', socios: 'партнёров', abrirPase: 'Открыть пропуск',
    expT: 'Впечатления, которых нет в приложениях', expSub: 'Мастер-классы, кимоно, самураи и кухня. Нажмите на карточку, чтобы увидеть все условия и как получить бонус.',
    todas: 'Все', musulman: 'Подходит мусульманам', verTodas: 'Все впечатления ({n})', verMenos: 'Свернуть', ninguna: 'Нет впечатлений с этим фильтром.',
    condiciones: 'Условия партнёра', comoSe: 'Как получить бонус', copiar: 'Скопировать', copiado: 'Скопировано', reservar: 'Забронировать с нами', web: 'Их сайт', solo: 'Самостоятельно: как добраться', cerrar: 'Закрыть', msg: 'Здравствуйте! Меня интересует {n}. Поможете забронировать?',
    paseT: 'Пропуск Tony Kansai Guide', paseSub: 'Покажите на ресепшене', paseLinea: 'Я от Tony Kansai Guide (Tony Hanma).', paseBrillo: 'Увеличьте яркость экрана.', paseDe: 'Для',
    codT: 'Ваши коды на скидку', codSub: 'Нажмите, чтобы скопировать, и вставьте при оплате в поле промокода или купона.', hasta: 'до', ir: 'Открыть сайт', ver: 'Как использовать',
    claro: 'Честно: когда вы бронируете по нашим ссылкам или кодам, компания платит нам небольшую комиссию. Ваша цена та же, а с кодом ниже. Здесь только то, чем мы пользуемся с гостями.',
  },
}
// Lo que lee el personal en Japón: va siempre en japonés, sea cual sea el idioma de la página.
const PASE_JA = ['Tony Kansai Guide', '（ハンマ・トニー）の紹介で来ました。']

// ── Piezas pequeñas ──────────────────────────────────────────────────────

const estiloMarca = (a: App) => ({ ['--marca' as string]: a.marca.fondo, ['--marca-tinta' as string]: a.marca.tinta })

function IconoSocio({ a, size = 22 }: { a: App; size?: number }) {
  const Ico = ICONO_EXP[a.clave]
  return (
    <span className={`rb-ico${ICONOS_APP.has(a.clave) ? ' es-real' : ''}`} style={estiloMarca(a)} aria-hidden="true">
      {ICONOS_APP.has(a.clave) ? <img src={`/v7/apps/${a.clave}.webp`} alt="" width="64" height="64" loading="lazy" decoding="async" />
        : Ico ? <Ico size={size} strokeWidth={1.6} /> : <b>{(a.marca.palabra ?? a.nombre).charAt(0)}</b>}
    </span>
  )
}

/** Botón que copia un texto y lo dice; si el portapapeles falla, lo enseña para copiarlo a mano. */
function Copiable({ texto, etiqueta, copiado, grande }: { texto: string; etiqueta: string; copiado: string; grande?: boolean }) {
  const [hecho, setHecho] = useState(false)
  const copiar = () => {
    const ok = () => { setHecho(true); setTimeout(() => setHecho(false), 1800) }
    if (navigator.clipboard) navigator.clipboard.writeText(texto).then(ok).catch(() => window.prompt(etiqueta, texto))
    else window.prompt(etiqueta, texto)
  }
  return (
    <button type="button" className={`rb-copiable${grande ? ' es-grande' : ''}${hecho ? ' es-hecho' : ''}`} onClick={copiar} aria-label={`${etiqueta}: ${texto}`}>
      <bdi dir="ltr" className="rb-copiable-txt">{texto}</bdi>
      <span className="rb-copiable-accion" aria-live="polite">{hecho ? <><Check size={16} /> {copiado}</> : <><Copy size={16} /> {etiqueta}</>}</span>
    </button>
  )
}

/** Foto de la tarjeta: la del socio, la de su zona o, si no hay, su color con el icono. Sin enlaces dentro (va en un botón). */
function FotoTarjeta({ a }: { a: App }) {
  const socio = FOTO_SOCIO[a.clave]
  const zona = FOTO_EXP[a.clave]
  const src = socio ? `/v7/socios/${socio.foto}-600.webp` : zona ? `/v8/zonas/${zona}-600.webp` : ''
  return (
    <span className="rb-exp-foto" style={estiloMarca(a)} aria-hidden="true">
      {src && <img src={src} alt="" width="600" height="400" loading="lazy" decoding="async" />}
      {a.marca.palabra && <span className="rb-exp-kanji">{a.marca.palabra}</span>}
      <IconoSocio a={a} />
    </span>
  )
}

// ── Pase para enseñar en recepción ───────────────────────────────────────

// Si el pase está abierto encima de una ficha, Escape cierra solo el pase (la ficha lo mira aquí:
// mientras el pase hace su animación de salida sigue en el DOM, así que no vale buscarlo).
let paseVisible = false

export function PaseTony({ id, socio, onCerrar: alCerrar }: { id: Id; socio?: App; onCerrar: () => void }) {
  const t = UI[id]
  const cerrarRef = useRef<HTMLButtonElement>(null)
  const onCerrar = useCallback(() => { paseVisible = false; alCerrar() }, [alCerrar])
  useEffect(() => {
    paseVisible = true
    cerrarRef.current?.focus()
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') onCerrar() }
    window.addEventListener('keydown', tecla)
    return () => { window.removeEventListener('keydown', tecla); paseVisible = false }
  }, [onCerrar])
  const hoy = new Date().toLocaleDateString(id === 'ar' ? 'ar-EG' : id === 'en' ? 'en-GB' : id, { day: 'numeric', month: 'long', year: 'numeric' })
  return (
    <motion.div className="rb-pase-fondo" role="dialog" aria-modal="true" aria-label={t.paseT} data-lenis-prevent
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCerrar}>
      <motion.div className="rb-pase" onClick={(e) => e.stopPropagation()}
        initial={{ y: 40, rotateX: 12, opacity: 0 }} animate={{ y: 0, rotateX: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }}>
        <button ref={cerrarRef} type="button" className="rb-pase-cerrar" onClick={onCerrar} aria-label={t.cerrar}><X size={22} /></button>
        <p className="rb-pase-ojo">{t.paseSub}</p>
        <svg className="rb-pase-torii" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fillRule="evenodd" d={TORII} /></svg>
        <p className="rb-pase-marca" dir="ltr">Tony Kansai Guide</p>
        <p className="rb-pase-ja" lang="ja" dir="ltr">{PASE_JA.map((l) => <span key={l}>{l}</span>)}</p>
        <p className="rb-pase-local">{t.paseLinea}</p>
        {socio && <p className="rb-pase-socio">{t.paseDe} <bdi dir="ltr">{socio.nombre}</bdi></p>}
        <p className="rb-pase-fecha"><bdi>{hoy}</bdi> · <span dir="ltr">tonykansaiguide.com</span></p>
        <p className="rb-pase-brillo">{t.paseBrillo}</p>
      </motion.div>
    </motion.div>
  )
}

// ── Portada ──────────────────────────────────────────────────────────────

export function PortadaRB({ id }: { id: Id }) {
  const t = UI[id]
  const conVentaja = EXPERIENCIAS.filter((a) => canjeDe(a.clave) !== 'directo').length
  const codigos = APPS.filter((a) => cuponDe(a) && a.descuento).length
  const musulman = EXPERIENCIAS.filter((a) => a.musulman).length
  const cifras: [number, string][] = [[EXPERIENCIAS.length, t.stats[0]], [conVentaja, t.stats[1]], [codigos, t.stats[2]], [musulman, t.stats[3]]]
  return (
    <section className="vn-portada rb-portada">
      <figure className="vn-portada-foto rb-portada-foto">
        <img src="/v8/zonas/kioto-fushimi-900.webp" srcSet="/v8/zonas/kioto-fushimi-900.webp 900w, /v8/zonas/kioto-fushimi-4k.webp 2400w"
          sizes="100vw" alt={t.foto} width="900" height="1125" fetchPriority="high" decoding="async" />
      </figure>
      <div className="vn-ancho rb-portada-txt">
        <p className="rb-ojo"><span className="rb-ojo-punto" />{t.ojo}</p>
        <h1>{t.h1}</h1>
        <p className="rb-rota" aria-hidden="true">
          <span>{t.con}</span>
          <RotatingText texts={t.rota} mainClassName="rb-rota-caja" effect="blur" transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }} highlight highlightColor="#e5533d" staggerDuration={0.008} rotationInterval={2600} splitBy={id === 'ar' ? 'words' : 'characters'} />
        </p>
        <p className="vn-lead rb-portada-sub">{t.sub}</p>
        <div className="vn-ctas rb-ctas">
          <StarBorder as="a" href="#experiencias" className="rb-cta" color="#ffb4a6" backgroundColor="#e5533d" textColor="#fff" radius={999} duration={5}>{t.exp}</StarBorder>
          <a className="vn-boton vn-boton-linea" href="#codigos">{t.cod}</a>
        </div>
        <dl className="rb-cifras">
          {cifras.map(([n, txt]) => (
            <div key={txt}>
              <dt>{txt}</dt>
              <dd><CountUp to={n} duration={1.6} className="rb-cifra" /></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

// ── Cómo se consigue cada ventaja ────────────────────────────────────────

export function ComoFunciona({ id, onElegir, onPase }: { id: Id; onElegir: (c: Canje) => void; onPase: () => void }) {
  const t = UI[id]
  return (
    <section className="rb-como" id="como" aria-labelledby="rb-como-t">
      <div className="vn-ancho">
        <p className="rb-ojo"><span className="rb-ojo-punto" />{t.comoOjo}</p>
        <h2 id="rb-como-t" className="vn-h2 vn-sube">{t.comoT}</h2>
        <p className="vn-lead vn-sube">{t.comoSub}</p>
        <ol className="rb-como-grid">
          {ORDEN_CANJE.map((c, n) => {
            const socios = EXPERIENCIAS.filter((a) => canjeDe(a.clave) === c)
            const Ico = ICONO_CANJE[c]
            return (
              <li key={c} className="vn-sube">
                <SpotlightCard className="rb-como-tarjeta" spotlightColor="#e5533d" proximity={0} intensity={0.55}>
                  <span className="rb-como-n" aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>
                  <Ico className="rb-como-ico" size={30} strokeWidth={1.5} aria-hidden="true" />
                  <h3>{CANJE_T[id][c].t}</h3>
                  <p>{CANJE_T[id][c].d}</p>
                  <div className="rb-como-socios" aria-hidden="true">{socios.slice(0, 5).map((a) => <IconoSocio key={a.clave} a={a} size={16} />)}</div>
                  <div className="rb-como-acciones">
                    <button type="button" className="rb-como-ver" onClick={() => onElegir(c)}>{socios.length} {t.socios} <ArrowUpRight size={16} aria-hidden="true" /></button>
                    {c === 'logo' && <button type="button" className="rb-como-pase" onClick={onPase}><Ticket size={16} aria-hidden="true" /> {t.abrirPase}</button>}
                  </div>
                </SpotlightCard>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

// ── Ficha emergente de una experiencia ───────────────────────────────────

function PasoCanje({ a, id, onPase }: { a: App; id: Id; onPase: () => void }) {
  const t = UI[id]
  const c = canjeDe(a.clave)
  const Ico = ICONO_CANJE[c]
  const cupon = cuponDe(a)
  const texto = CANJE[a.clave]?.texto
  return (
    <div className={`rb-paso es-${c}`}>
      <p className="rb-paso-titulo"><Ico size={18} aria-hidden="true" /> {t.comoSe}: <b>{CANJE_T[id][c].t}</b></p>
      <p className="rb-paso-d">{CANJE_T[id][c].d}</p>
      {c === 'codigo' && cupon && <Copiable texto={cupon} etiqueta={t.copiar} copiado={t.copiado} grande />}
      {(c === 'comentario' || c === 'nombre') && texto && <Copiable texto={texto} etiqueta={t.copiar} copiado={t.copiado} grande />}
      {(c === 'logo' || c === 'nombre') && <button type="button" className="rb-boton-pase" onClick={onPase}><Ticket size={18} aria-hidden="true" /> {t.abrirPase}</button>}
    </div>
  )
}

function FichaEmergente({ a, id, ruta, onCerrar, onPase }: { a: App; id: Id; ruta: string; onCerrar: () => void; onPase: () => void }) {
  const t = UI[id]
  const tx = textoApp(a, id)
  const reglas = reglasDe(a.clave, id)
  const wa = enlaceGuia(guiaDe(id), t.msg.replace('{n}', a.nombre))
  const cerrarRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    cerrarRef.current?.focus()
    // Con el pase abierto encima, Escape cierra solo el pase.
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape' && !paseVisible) onCerrar() }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [onCerrar])
  return (
    <motion.div className="rb-modal-fondo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCerrar}>
      <motion.div className="rb-modal" role="dialog" aria-modal="true" aria-labelledby={`rb-m-${a.clave}`} data-lenis-prevent style={estiloMarca(a)}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 60, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 30 }}>
        <button ref={cerrarRef} type="button" className="rb-modal-cerrar" onClick={onCerrar} aria-label={t.cerrar}><X size={20} /></button>
        <div className="rb-modal-cara">
          {FOTO_SOCIO[a.clave] ? <FotoSocio {...FOTO_SOCIO[a.clave]} alt={FOTO_SOCIO[a.clave].alt[id]} className="rb-modal-foto" sizes="(max-width: 760px) 100vw, 720px" />
            : FOTO_EXP[a.clave] && <FotoZona zona={FOTO_EXP[a.clave]} className="rb-modal-foto" sizes="(max-width: 760px) 100vw, 720px" />}
          {a.marca.palabra && <span className="rb-exp-kanji" aria-hidden="true">{a.marca.palabra}</span>}
          <IconoSocio a={a} size={34} />
        </div>
        <div className="rb-modal-cuerpo">
          <p className="rb-modal-lugar">{a.ciudad ? ciudadesDe(a).map((c) => CIUDADES[c][id]).join(' · ') : 'Kansai'}{a.musulman && <span className="rb-sello-musulman"><Moon size={13} aria-hidden="true" /> {t.musulman}</span>}</p>
          <h3 id={`rb-m-${a.clave}`}><bdi dir="ltr">{a.nombre}</bdi></h3>
          <p className="rb-modal-que">{tx.que}</p>
          <PasoCanje a={a} id={id} onPase={onPase} />
          {a.vistazo && <div className="rb-modal-vistazo"><Vistazo a={a} id={id} /></div>}
          <h4 className="rb-modal-h4">{t.condiciones}</h4>
          {reglas.length > 0 && <ul className="rb-reglas">{reglas.map((r) => <li key={r}><Check size={14} aria-hidden="true" /> {r}</li>)}</ul>}
          <p className="rb-modal-ventaja">{tx.ventaja}</p>
          {tienePasos(a) && <div className="rb-modal-pasos"><PasosReserva a={a} id={id} /></div>}
          <div className="rb-modal-acciones">
            <a className="vn-boton vn-boton-wa" href={wa} target="_blank" rel="noopener noreferrer"><IconoCanal tg={id === 'ru'} /> {t.reservar}</a>
            <a className="vn-boton vn-boton-linea" href={enlaceDe(a)} target="_blank" rel="noopener noreferrer sponsored">{t.web} <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
          <Link className="vn-enlace rb-modal-ficha" to={`${ruta}${a.clave}/`}>{GUIA[a.clave] ? t.solo : MAS[id]} →</Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Experiencias: rejilla de tarjetas con filtros ────────────────────────

type Filtro = '' | 'musulman' | Canje | Ciudad

export function ExperienciasRB({ id, ruta, filtroInicial, onPase }: { id: Id; ruta: string; filtroInicial: { canje: Canje | ''; n: number }; onPase: (a?: App) => void }) {
  const t = UI[id]
  const [filtro, setFiltro] = useState<Filtro>('')
  const [todas, setTodas] = useState(false)
  const [abierta, setAbierta] = useState<App | null>(null)
  const volverA = useRef<HTMLElement | null>(null)

  // «Cómo funciona» elige una forma de canje: se filtra aquí.
  useEffect(() => { if (filtroInicial.canje) { setFiltro(filtroInicial.canje); setTodas(true) } }, [filtroInicial])

  const abrir = useCallback((a: App) => {
    volverA.current = document.activeElement as HTMLElement | null
    setAbierta(a)
    ;(window as unknown as { __vnLenis?: { stop: () => void } }).__vnLenis?.stop()
    document.documentElement.classList.add('rb-sin-scroll')
    if (location.hash.slice(1) !== a.clave) history.replaceState(null, '', `#${a.clave}`)
  }, [])
  const cerrar = useCallback(() => {
    setAbierta(null)
    ;(window as unknown as { __vnLenis?: { start: () => void } }).__vnLenis?.start()
    document.documentElement.classList.remove('rb-sin-scroll')
    if (location.hash) history.replaceState(null, '', location.pathname + location.search)
    volverA.current?.focus?.()
  }, [])
  // Llegar con #clave (desde el kit, otra página o WhatsApp) abre esa experiencia.
  useEffect(() => {
    const desdeHash = () => { const a = EXPERIENCIAS.find((x) => x.clave === location.hash.slice(1)); if (a) abrir(a) }
    desdeHash()
    window.addEventListener('hashchange', desdeHash)
    return () => { window.removeEventListener('hashchange', desdeHash); document.documentElement.classList.remove('rb-sin-scroll') }
  }, [abrir])

  const enCiudad = (a: App, c: Ciudad) => ciudadesDe(a).includes(c)
  const esCanje = (f: Filtro): f is Canje => (ORDEN_CANJE as string[]).includes(f) || f === 'directo'
  const pasa = (a: App) => !filtro || (filtro === 'musulman' ? !!a.musulman : esCanje(filtro) ? canjeDe(a.clave) === filtro : enCiudad(a, filtro))
  const lista = ORDENADAS.filter(pasa)
  const plegada = !todas && !filtro && lista.length > CONTADAS

  const ciudades = (Object.keys(CIUDADES) as Ciudad[]).filter((c) => EXPERIENCIAS.some((a) => enCiudad(a, c)))
  const chip = (k: Filtro, txt: string, n: number) => (
    <button key={k || 'todas'} type="button" aria-pressed={filtro === k} onClick={() => setFiltro(filtro === k && k ? '' : k)}>{txt} <small>{n}</small></button>
  )
  return (
    <section className="vn-exp rb-exp" id="experiencias" aria-labelledby="rb-exp-t">
      <div className="vn-ancho">
        <h2 id="rb-exp-t" className="vn-h2 vn-sube">{t.expT}</h2>
        <p className="vn-lead vn-sube">{t.expSub}</p>
        <div className="vn-chips rb-chips" role="group" aria-label={t.expT}>
          {chip('', t.todas, EXPERIENCIAS.length)}
          {chip('musulman', t.musulman, EXPERIENCIAS.filter((a) => a.musulman).length)}
          {[...ORDEN_CANJE, 'directo' as Canje].map((c) => chip(c, CANJE_T[id][c].corto, EXPERIENCIAS.filter((a) => canjeDe(a.clave) === c).length))}
        </div>
        {[
          { k: 'kansai', txt: REGIONES.kansai[id], cs: ciudades.filter((c) => KANSAI.includes(c)) },
          { k: 'japon', txt: REGIONES.japon[id], cs: ciudades.filter((c) => !KANSAI.includes(c)) },
        ].filter((g) => g.cs.length).map((g) => (
          <div key={g.k} className="vn-chips vn-chips-region rb-chips" role="group" aria-label={g.txt}>
            <span className="vn-chips-titulo">{g.txt}</span>
            {g.cs.map((c) => chip(c, CIUDADES[c][id], EXPERIENCIAS.filter((a) => enCiudad(a, c)).length))}
          </div>
        ))}

        {lista.length === 0 && <p className="rb-vacio">{t.ninguna}</p>}
        <ul className="rb-exp-grid">
          {lista.map((a, n) => {
            const c = canjeDe(a.clave)
            const Ico = ICONO_CANJE[c]
            const cupon = cuponDe(a)
            const texto = CANJE[a.clave]?.texto
            const reglas = reglasDe(a.clave, id).slice(0, 2)
            return (
              <li key={a.clave} id={a.clave} className={plegada && n >= CONTADAS ? 'es-plegada' : undefined}>
                <SpotlightCard className="rb-exp-tarjeta" spotlightColor={a.marca.fondo === '#ffffff' || a.marca.fondo.toLowerCase() === '#fff' ? '#e5533d' : a.marca.fondo} proximity={0} intensity={0.7} style={estiloMarca(a)}>
                  <button type="button" className="rb-exp-boton" onClick={() => abrir(a)} aria-haspopup="dialog">
                    <FotoTarjeta a={a} />
                    <span className="rb-exp-cuerpo">
                      <span className="rb-exp-lugar">{a.ciudad ? CIUDADES[a.ciudad][id] : 'Kansai'}{a.musulman && <span className="rb-sello-musulman" title={t.musulman}><Moon size={12} aria-hidden="true" /> {t.musulman}</span>}</span>
                      <b className="rb-exp-nombre"><bdi dir="ltr">{a.nombre}</bdi></b>
                      <span className="rb-exp-que">{textoApp(a, id).que}</span>
                      <span className={`rb-canje es-${c}`}>
                        <Ico size={15} aria-hidden="true" />
                        <span>{CANJE_T[id][c].corto}</span>
                        {c === 'codigo' && cupon && <code dir="ltr">{cupon}</code>}
                        {c === 'comentario' && texto && <code dir="ltr">{texto.length > 22 ? `${texto.slice(0, 20)}…` : texto}</code>}
                        {a.descuento && c !== 'codigo' && <code dir="ltr">−{a.descuento}</code>}
                        {a.descuento && c === 'codigo' && <em dir="ltr">−{a.descuento}</em>}
                      </span>
                      {a.vistazo ? <span className="rb-exp-meta"><MetaFila a={a} id={id} /></span>
                        : reglas.length > 0 && <span className="rb-exp-reglas">{reglas.map((r) => <span key={r}>{r}</span>)}</span>}
                    </span>
                  </button>
                </SpotlightCard>
              </li>
            )
          })}
        </ul>
        {(plegada || (todas && !filtro && lista.length > CONTADAS)) && (
          <p className="rb-mas">
            <button type="button" className="vn-boton vn-boton-linea" onClick={() => { setTodas(!todas); if (todas) document.getElementById('experiencias')?.scrollIntoView({ behavior: 'smooth' }) }}>
              {todas ? t.verMenos : t.verTodas.replace('{n}', String(lista.length))}
            </button>
          </p>
        )}
      </div>
      <AnimatePresence>
        {abierta && <FichaEmergente key={abierta.clave} a={abierta} id={id} ruta={ruta} onCerrar={cerrar} onPase={() => onPase(abierta)} />}
      </AnimatePresence>
    </section>
  )
}

// ── Códigos ──────────────────────────────────────────────────────────────

export function CodigosRB({ id, ruta, children }: { id: Id; ruta: string; children?: React.ReactNode }) {
  const t = UI[id]
  const conCodigo = APPS.filter((a) => cuponDe(a) && a.descuento)
  if (!conCodigo.length) return null
  return (
    <section className="vn-cod rb-cod" id="codigos" aria-labelledby="rb-cod-t">
      <div className="vn-ancho">
        <h2 id="rb-cod-t" className="vn-h2 vn-sube">{t.codT}</h2>
        <p className="vn-lead vn-sube">{t.codSub}</p>
        <ul className="rb-billetes">
          {conCodigo.map((a) => {
            const cupon = cuponDe(a)!
            const reglas = reglasDe(a.clave, id).slice(0, 1)
            return (
              <li key={a.clave} className="rb-billete vn-sube" style={estiloMarca(a)}>
                <div className="rb-billete-cab">
                  <IconoSocio a={a} />
                  <span><b dir="ltr">{a.nombre}</b><small>{CATEGORIAS[a.cat][id]}</small></span>
                </div>
                <p className="rb-billete-dto" dir="ltr">{a.descuento!.startsWith('−') ? a.descuento : `−${a.descuento}`}</p>
                <div className="rb-billete-corte" aria-hidden="true" />
                <button type="button" className="rb-billete-cod" onClick={(e) => {
                  const b = e.currentTarget
                  navigator.clipboard?.writeText(cupon).then(() => { b.dataset.hecho = '1'; setTimeout(() => { delete b.dataset.hecho }, 1800) }).catch(() => window.prompt(t.copiar, cupon))
                }} aria-label={`${t.copiar}: ${cupon}`}>
                  <DecryptedText text={cupon} animateOn="view" sequential revealDirection="start" speed={45} className="rb-billete-txt" encryptedClassName="rb-billete-cifrado" />
                  <span className="rb-billete-copiar"><Copy size={15} aria-hidden="true" /><span className="rb-no-hecho">{t.copiar}</span><span className="rb-si-hecho">{t.copiado}</span></span>
                </button>
                <p className="rb-billete-pie">
                  {a.caduca ? <small>{t.hasta} <bdi dir="ltr">{new Date(`${a.caduca}T12:00:00`).toLocaleDateString(id === 'ar' ? 'ar-EG' : id, { day: 'numeric', month: 'short', year: 'numeric' })}</bdi></small>
                    : reglas[0] ? <small>{reglas[0]}</small> : <small />}
                  <a href={enlaceDe(a)} target="_blank" rel="noopener noreferrer sponsored">{t.ir}</a>
                  <Link to={a.cat === 'experiencias' ? `#${a.clave}` : `${ruta}${a.clave}/`}>{t.ver}</Link>
                </p>
              </li>
            )
          })}
        </ul>
        {children}
      </div>
    </section>
  )
}

// ── Te lo digo claro ─────────────────────────────────────────────────────

export function ClaroRB({ id }: { id: Id }) {
  return (
    <section className="rb-claro" aria-label={UI[id].claro.split(':')[0]}>
      <div className="vn-ancho">
        <ScrollReveal baseOpacity={0.12} enableBlur baseRotation={2} blurStrength={6} containerClassName="rb-claro-caja" textClassName="rb-claro-txt">
          {UI[id].claro}
        </ScrollReveal>
      </div>
    </section>
  )
}
