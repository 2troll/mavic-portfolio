// «Cómo funciona con este socio» (20-11-2026): el mismo bloque en la tarjeta de la lista
// (versión corta), en la ficha emergente y en la ficha de cada socio (/es/ventajas/<clave>/).
// Dice el tipo de acuerdo tal como le afecta al viajero (código, te lo reservo yo,
// reservas tú y me mencionas, solo recomendación), las condiciones que puso el socio
// por escrito (datosCanje.ts), la acción que toca y cuándo se actualizó.
// Nunca enseña comisiones, tarifas de agencia ni códigos de agente.
// Aquí viven también el botón que copia (Copiable) y el pase para recepción (PaseTony),
// que usan la lista y la ficha.
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, BadgePercent, CalendarCheck, Check, Copy, Mail, MessageSquareText, Mic, Store, Ticket, UserRoundCheck, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cuponDe, enlaceDe, type App } from './datosVentajas'
import { ACTUALIZADO, CANJE, acuerdoDe, canjeDe, reglasDe, type Acuerdo, type Canje } from './datosCanje'
import { PasosReserva, tienePasos } from './Vistazo'
import { enlaceGuia } from './contenido'
import { IconoCanal } from './IconoWa'
import './acuerdo.css'

type Id = 'es' | 'en' | 'ar' | 'ru'

export const guiaDe = (id: Id) => (id === 'ru' ? 'larion' : 'tony')
/** Socios sin web propia (Onigiri Hiroshima): el botón abre el correo, sin pestaña nueva. */
export const esCorreo = (href: string) => href.startsWith('mailto:')
export const ESCRIBIRLES: Record<Id, string> = { es: 'Escribirles', en: 'Email them', ar: 'راسلهم', ru: 'Написать им' }
/** «10 %» → «−10 %»; sin descuento, cadena vacía. */
export const menosDe = (a: App) => (a.descuento ? (a.descuento.startsWith('−') ? a.descuento : `−${a.descuento}`) : '')

// ── Textos ────────────────────────────────────────────────────────────────

/** Los cuatro acuerdos, como los ve el viajero. */
export const ACU_T: Record<Id, Record<Acuerdo, { t: string; d: string; corto: string }>> = {
  es: {
    codigo: { t: 'Código para ti', d: 'Copia el código y pégalo al pagar en su web: el descuento es para ti.', corto: 'Código para ti' },
    tony: { t: 'Te lo reservo yo', d: 'Escríbeme la fecha y cuántos sois: lo reservo con ellos, lo coordino y te confirmo.', corto: 'Te lo reservo yo' },
    mencion: { t: 'Reservas tú y me mencionas', d: 'Reserva directamente con ellos y di que vienes de parte de Tony Kansai Guide.', corto: 'Me mencionas' },
    lista: { t: 'Solo recomendación', d: 'Sin descuento ni acuerdo: está aquí porque lo conozco. Reserva directamente con ellos.', corto: 'Solo recomendación' },
  },
  en: {
    codigo: { t: 'Code for you', d: 'Copy the code and paste it at checkout on their website: the discount is yours.', corto: 'Code for you' },
    tony: { t: 'I book it for you', d: 'Message me the date and group size: I book it with them, coordinate it and confirm.', corto: 'I book it' },
    mencion: { t: 'Book direct, mention me', d: 'Book directly with them and say Tony Kansai Guide sent you.', corto: 'Mention me' },
    lista: { t: 'Listing only', d: 'No discount or deal: it is here because I know it. Book directly with them.', corto: 'Listing only' },
  },
  ar: {
    codigo: { t: 'رمز لك', d: 'انسخ الرمز والصقه عند الدفع في موقعهم: الخصم لك.', corto: 'رمز لك' },
    tony: { t: 'أحجزه لك أنا', d: 'أرسل لي التاريخ وعددكم: أحجز معهم وأنسّق وأؤكد لك.', corto: 'أحجزه أنا' },
    mencion: { t: 'احجز بنفسك واذكرني', d: 'احجز معهم مباشرة وقل إنك قادم من طرف Tony Kansai Guide.', corto: 'اذكرني' },
    lista: { t: 'توصية فقط', d: 'بلا خصم ولا اتفاق: موجود هنا لأنني أعرفه. احجز معهم مباشرة.', corto: 'توصية فقط' },
  },
  ru: {
    codigo: { t: 'Код для вас', d: 'Скопируйте код и вставьте при оплате на их сайте: скидка ваша.', corto: 'Код для вас' },
    tony: { t: 'Бронируем мы', d: 'Напишите дату и сколько вас: мы забронируем, всё согласуем и подтвердим.', corto: 'Бронируем мы' },
    mencion: { t: 'Бронь напрямую со ссылкой на нас', d: 'Бронируйте у них напрямую и скажите, что вы от Tony Kansai Guide.', corto: 'Ссылка на нас' },
    lista: { t: 'Только рекомендация', d: 'Без скидки и договорённостей: здесь, потому что мы это знаем. Бронируйте у них напрямую.', corto: 'Рекомендация' },
  },
}
export const ICONO_ACUERDO: Record<Acuerdo, LucideIcon> = { codigo: BadgePercent, tony: UserRoundCheck, mencion: MessageSquareText, lista: Store }

/** Cómo se menciona a Tony en cada socio de «reservas tú y me mencionas» (y el resto de formas de canje). */
export const CANJE_T: Record<Id, Record<Canje, { t: string; d: string; corto: string }>> = {
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
export const ICONO_CANJE: Record<Canje, LucideIcon> = { codigo: BadgePercent, comentario: MessageSquareText, nombre: Mic, logo: Ticket, conmigo: UserRoundCheck, directo: CalendarCheck }

const AC_UI: Record<Id, {
  cab: string; cond: string; act: string; pedir: string; web: string; reservarWeb: string; pase: string; copiar: string; copiado: string; msg: string
}> = {
  es: { cab: 'Cómo funciona con este socio', cond: 'Condiciones del socio', act: 'Actualizado el', pedir: 'Pídemelo por WhatsApp', web: 'Su web', reservarWeb: 'Reservar en su web', pase: 'Abrir mi pase', copiar: 'Copiar', copiado: 'Copiado', msg: 'Hola Tony, me interesa {n}. ¿Me ayudas a reservarlo?' },
  en: { cab: 'How it works with this partner', cond: 'Partner conditions', act: 'Updated', pedir: 'Ask me on WhatsApp', web: 'Their website', reservarWeb: 'Book on their website', pase: 'Open my pass', copiar: 'Copy', copiado: 'Copied', msg: 'Hi Tony, I’m interested in {n}. Can you help me book it?' },
  ar: { cab: 'كيف يعمل الاتفاق مع هذا الشريك', cond: 'شروط الشريك', act: 'آخر تحديث', pedir: 'اطلبه مني على واتساب', web: 'موقعهم', reservarWeb: 'احجز من موقعهم', pase: 'افتح بطاقتي', copiar: 'نسخ', copiado: 'تم النسخ', msg: 'مرحبًا طوني، أنا مهتم بـ {n}. هل تساعدني في الحجز؟' },
  ru: { cab: 'Как это работает с партнёром', cond: 'Условия партнёра', act: 'Обновлено', pedir: 'Написать нам в Telegram', web: 'Их сайт', reservarWeb: 'Забронировать на сайте', pase: 'Открыть пропуск', copiar: 'Скопировать', copiado: 'Скопировано', msg: 'Здравствуйте! Меня интересует {n}. Поможете забронировать?' },
}

// Fechas escritas a mano: el HTML pregenerado y el del navegador tienen que ser idénticos al hidratar.
const MESES: Record<Id, string[]> = {
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  ru: ['янв.', 'февр.', 'мар.', 'апр.', 'мая', 'июн.', 'июл.', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'],
}
/** «2026-11-20» → «20 nov 2026» (es), «20 Nov 2026» (en), «20 نوفمبر 2026» (ar), «20 нояб. 2026» (ru). */
export function fechaCorta(iso: string, id: Id): string {
  const [a, m, d] = iso.split('-').map(Number)
  return `${d} ${MESES[id][m - 1]} ${a}`
}
export const actualizadoDe = (clave: string) => ACTUALIZADO[clave]

// ── Botón que copia ──────────────────────────────────────────────────────

/** Copia un texto y lo dice; si el portapapeles falla, lo enseña para copiarlo a mano. */
export function Copiable({ texto, etiqueta, copiado, grande }: { texto: string; etiqueta: string; copiado: string; grande?: boolean }) {
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

// ── Pase para enseñar en recepción ───────────────────────────────────────

const TORII = 'M2.222 3.372a1 1 0 0 1 1.027-.34c1.078.277 2.167.517 3.257.738c1.852.375 4.015.73 5.494.73s3.642-.355 5.494-.73c1.09-.22 2.178-.461 3.256-.738a1 1 0 0 1 1.144 1.415l-2 4c-.15.3-.446.507-.778.546A91 91 0 0 1 16 9.3v1.366a58 58 0 0 0 3.797-.644a1 1 0 0 1 .406 1.958q-.6.123-1.203.23V18a1 1 0 1 1 0 2h-5a1 1 0 1 1 0-2v-5.095c-.692.059-1.374.095-2 .095s-1.308-.037-2-.095V18a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2v-5.79a49 49 0 0 1-1.203-.23a1 1 0 0 1 .406-1.96l.003.002q1.886.382 3.794.643V9.299a91 91 0 0 1-3.116-.306q-.001 0 0 0a1 1 0 0 1-.778-.546l-2-4a1 1 0 0 1 .116-1.075M12 9.5c.617 0 1.304-.024 2-.062v1.459c-.703.063-1.387.103-2 .103s-1.297-.04-2-.103v-1.46c.696.039 1.383.063 2 .063'
// Lo que lee el personal en Japón: va siempre en japonés, sea cual sea el idioma de la página.
const PASE_JA = ['Tony Kansai Guide', '（ハンマ・トニー）の紹介で来ました。']
const PASE_T: Record<Id, { t: string; sub: string; linea: string; brillo: string; de: string; cerrar: string }> = {
  es: { t: 'Pase de Tony Kansai Guide', sub: 'Enséñalo en recepción', linea: 'Vengo de parte de Tony Kansai Guide (Tony Hanma).', brillo: 'Sube el brillo de la pantalla.', de: 'Para', cerrar: 'Cerrar' },
  en: { t: 'Tony Kansai Guide pass', sub: 'Show it at reception', linea: 'I was referred by Tony Kansai Guide (Tony Hanma).', brillo: 'Turn your screen brightness up.', de: 'For', cerrar: 'Close' },
  ar: { t: 'بطاقة Tony Kansai Guide', sub: 'اعرضها في الاستقبال', linea: 'أنا قادم من طرف Tony Kansai Guide (Tony Hanma).', brillo: 'ارفع سطوع الشاشة.', de: 'إلى', cerrar: 'إغلاق' },
  ru: { t: 'Пропуск Tony Kansai Guide', sub: 'Покажите на ресепшене', linea: 'Я от Tony Kansai Guide (Tony Hanma).', brillo: 'Увеличьте яркость экрана.', de: 'Для', cerrar: 'Закрыть' },
}

// Si el pase está abierto encima de una ficha, Escape cierra solo el pase (la ficha lo mira aquí:
// mientras el pase hace su animación de salida sigue en el DOM, así que no vale buscarlo).
let paseVisible = false
export const paseAbierto = () => paseVisible

export function PaseTony({ id, socio, onCerrar: alCerrar }: { id: Id; socio?: App; onCerrar: () => void }) {
  const t = PASE_T[id]
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
    <motion.div className="rb-pase-fondo" role="dialog" aria-modal="true" aria-label={t.t} data-lenis-prevent
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCerrar}>
      <motion.div className="rb-pase" onClick={(e) => e.stopPropagation()}
        initial={{ y: 40, rotateX: 12, opacity: 0 }} animate={{ y: 0, rotateX: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }}>
        <button ref={cerrarRef} type="button" className="rb-pase-cerrar" onClick={onCerrar} aria-label={t.cerrar}><X size={22} /></button>
        <p className="rb-pase-ojo">{t.sub}</p>
        <svg className="rb-pase-torii" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fillRule="evenodd" d={TORII} /></svg>
        <p className="rb-pase-marca" dir="ltr">Tony Kansai Guide</p>
        <p className="rb-pase-ja" lang="ja" dir="ltr">{PASE_JA.map((l) => <span key={l}>{l}</span>)}</p>
        <p className="rb-pase-local">{t.linea}</p>
        {socio && <p className="rb-pase-socio">{t.de} <bdi dir="ltr">{socio.nombre}</bdi></p>}
        <p className="rb-pase-fecha"><bdi>{hoy}</bdi> · <span dir="ltr">tonykansaiguide.com</span></p>
        <p className="rb-pase-brillo">{t.brillo}</p>
      </motion.div>
    </motion.div>
  )
}

// ── La acción de cada acuerdo ────────────────────────────────────────────

/** Un solo paso claro: copiar el código, pedírmelo, copiar la frase o enseñar el pase, o ir a su web.
 *  `corta` (tarjeta de la lista): solo la acción principal. */
function Accion({ a, id, onPase, corta }: { a: App; id: Id; onPase?: () => void; corta?: boolean }) {
  const u = AC_UI[id]
  const tipo = acuerdoDe(a)
  const href = enlaceDe(a)
  const wa = enlaceGuia(guiaDe(id), u.msg.replace('{n}', a.nombre))
  // Su web nunca lleva el acento: el bermellón queda para lo que da ventaja (código, pase).
  const web = (principal: boolean) => esCorreo(href)
    ? <a className="vn-boton vn-boton-linea ac-boton" href={href}><Mail aria-hidden="true" /> {ESCRIBIRLES[id]}</a>
    : <a className="vn-boton vn-boton-linea ac-boton" href={href} target="_blank" rel="noopener noreferrer sponsored">{principal ? u.reservarWeb : u.web} <ArrowUpRight aria-hidden="true" /></a>
  if (tipo === 'codigo') return <>{<Copiable texto={cuponDe(a)!} etiqueta={u.copiar} copiado={u.copiado} grande={!corta} />}{!corta && web(false)}</>
  if (tipo === 'tony') return <><a className="vn-boton vn-boton-wa ac-boton" href={wa} target="_blank" rel="noopener noreferrer"><IconoCanal tg={id === 'ru'} /> {u.pedir}</a>{!corta && web(false)}</>
  if (tipo === 'mencion') {
    const c = canjeDe(a.clave)
    const texto = CANJE[a.clave]?.texto
    const pase = onPase && (c === 'logo' || (c === 'nombre' && !corta))
    return <>
      {texto && <Copiable texto={texto} etiqueta={u.copiar} copiado={u.copiado} grande={!corta} />}
      {pase && <button type="button" className="rb-boton-pase ac-boton-pase" onClick={onPase}><Ticket size={18} aria-hidden="true" /> {u.pase}</button>}
      {(!corta || (!texto && !pase)) && web(!texto && !pase)}
    </>
  }
  return web(true)
}

// ── Versión corta: pie de la tarjeta de la lista ─────────────────────────

export function AcuerdoCorto({ a, id, onPase }: { a: App; id: Id; onPase?: () => void }) {
  const tipo = acuerdoDe(a)
  const Ico = ICONO_ACUERDO[tipo]
  const reglas = reglasDe(a.clave, id).slice(0, 2)
  const menos = menosDe(a)
  return (
    <div className={`ac-corto es-${tipo}`}>
      <p className="ac-corto-tipo"><Ico size={15} aria-hidden="true" /><span>{ACU_T[id][tipo].t}</span>{menos && <em dir="ltr">{menos}</em>}</p>
      {reglas.length > 0 && <ul className="ac-corto-cond">{reglas.map((r) => <li key={r}>{r}</li>)}</ul>}
      <div className="ac-corto-accion"><Accion a={a} id={id} onPase={onPase} corta /></div>
    </div>
  )
}

// ── Versión completa: ficha emergente y ficha del socio ──────────────────

export function AcuerdoSocio({ a, id, onPase, nivel = 'h3', ficha }: { a: App; id: Id; onPase?: () => void; nivel?: 'h2' | 'h3' | 'h4'; ficha?: boolean }) {
  const u = AC_UI[id]
  const tipo = acuerdoDe(a)
  const Ico = ICONO_ACUERDO[tipo]
  const c = canjeDe(a.clave)
  const IcoC = ICONO_CANJE[c]
  const reglas = reglasDe(a.clave, id)
  const iso = actualizadoDe(a.clave)
  const menos = menosDe(a)
  const H = nivel
  return (
    <section className={`ac es-${tipo}${ficha ? ' es-ficha' : ''}`} aria-labelledby={`ac-${a.clave}`}>
      <H id={`ac-${a.clave}`} className="ac-cab">{u.cab}</H>
      <div className="ac-tipo">
        <span className="ac-tipo-ico" aria-hidden="true"><Ico size={24} strokeWidth={1.7} /></span>
        <div className="ac-tipo-txt">
          <p className="ac-tipo-t"><b>{ACU_T[id][tipo].t}</b>{menos && <em dir="ltr">{menos}</em>}</p>
          <p className="ac-tipo-d">{ACU_T[id][tipo].d}</p>
          {tipo === 'mencion' && <p className="ac-como"><IcoC size={16} aria-hidden="true" /> {CANJE_T[id][c].d}</p>}
        </div>
      </div>
      {tienePasos(a) && <div className="ac-pasos"><PasosReserva a={a} id={id} /></div>}
      {reglas.length > 0 && <>
        <p className="ac-sub">{u.cond}</p>
        <ul className="ac-cond">{reglas.map((r) => <li key={r}><Check size={15} aria-hidden="true" /><span>{r}</span></li>)}</ul>
      </>}
      <div className="ac-acciones"><Accion a={a} id={id} onPase={onPase} /></div>
      {iso && <p className="ac-fecha">{u.act} <time dateTime={iso}>{fechaCorta(iso, id)}</time></p>}
    </section>
  )
}
