// «De un vistazo» de cada experiencia (17-11-2026): la ventaja, desde cuánto, cuánto
// dura, para cuántos y cómo se reserva en uno o dos pasos. Lo usan la lista de
// /es/ventajas/ y la ficha de cada socio (/es/ventajas/<clave>/).
// Solo pinta lo que hay en `vistazo` (datosVentajas.ts); lo que no consta no sale.
// Los números se escriben a mano por idioma (no toLocaleString) para que el HTML
// pregenerado y el del navegador sean idénticos al hidratar.
import type { ReactNode } from 'react'
import { Clock, Users, Wallet, CalendarCheck, MapPin } from 'lucide-react'
import { cuponDe, type App, type Nota, type Reserva, type Vistazo as DatosVistazo } from './datosVentajas'
import './vistazo.css'

type Id = 'es' | 'en' | 'ar' | 'ru'

const SEP: Record<Id, string> = { es: '.', en: ',', ar: ',', ru: ' ' }
/** 3500 → «3.500» (es), «3,500» (en/ar), «3500» y «38 000» (ru, como los textos rusos). */
export function miles(n: number, id: Id): string {
  if (id === 'ru' && n < 10000) return String(n)
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, SEP[id])
}
export const yenes = (n: number, id: Id) => (id === 'en' ? `¥${miles(n, id)}` : id === 'ar' ? `${miles(n, id)} ين` : `${miles(n, id)} ¥`)

const L: Record<Id, {
  desde: string; dura: string; grupo: string; reserva: string; como: string
  por: Record<'persona' | 'adulto' | 'grupo', string>; hasta: (n: number) => string; personas: (n: number) => string
  reservas: Record<Reserva, string>; antes: (d: number) => string
  notas: Record<Nota, string>
  codigo: string; deMiParte: string; conTony: string
  paso1: Record<Reserva, string>; pegar: (c: string) => [string, string]; mencion: [string, string]; yoReservo: string
  mapa: string
}> = {
  es: {
    desde: 'Desde', dura: 'Duración', grupo: 'Grupo', reserva: 'Reserva', como: 'Cómo reservar',
    por: { persona: 'por persona', adulto: 'por adulto', grupo: 'por grupo' }, hasta: (n) => `de hasta ${n}`, personas: (n) => `hasta ${n} personas`,
    reservas: { web: 'En su web', tablecheck: 'En TableCheck', correo: 'Por correo', formulario: 'En su formulario', tony: 'Conmigo' },
    antes: (d) => (d === 1 ? 'hasta 24 h antes' : d % 30 === 0 ? `${d / 30 === 1 ? '1 mes' : `${d / 30} meses`} antes` : d % 7 === 0 ? `${d / 7 === 1 ? '1 semana' : `${d / 7} semanas`} antes` : `${d} días antes`),
    notas: { halal: 'Opción halal', sinCerdo: 'Sin cerdo a petición', sinAlcohol: 'Sin alcohol a petición', vegetariano: 'Vegetariano a petición', hiyab: 'Con hiyab', oracion: 'Sala de oración', ninos: 'Bien con niños', guiaGratis: 'Tu guía entra gratis' },
    codigo: 'con código', deMiParte: 'de mi parte', conTony: 'Ventaja con Tony',
    paso1: { web: 'Reserva en su web', tablecheck: 'Reserva en TableCheck, desde su web', correo: 'Escríbeles por correo con la fecha y cuántos sois', formulario: 'Reserva en el formulario de su web', tony: 'Escríbeme por WhatsApp con la fecha y cuántos sois' },
    pegar: (c) => [`Antes de pagar, pega el código `, c], mencion: ['Al reservar, escribe o di ', ''], yoReservo: 'Lo reservo yo y te confirmo',
    mapa: 'Ver en el mapa',
  },
  en: {
    desde: 'From', dura: 'Duration', grupo: 'Group', reserva: 'Booking', como: 'How to book',
    por: { persona: 'per person', adulto: 'per adult', grupo: 'per group' }, hasta: (n) => `of up to ${n}`, personas: (n) => `up to ${n} people`,
    reservas: { web: 'On their website', tablecheck: 'On TableCheck', correo: 'By email', formulario: 'On their form', tony: 'Through me' },
    antes: (d) => (d === 1 ? 'up to 24 h before' : d % 30 === 0 ? `${d / 30 === 1 ? '1 month' : `${d / 30} months`} ahead` : d % 7 === 0 ? `${d / 7 === 1 ? '1 week' : `${d / 7} weeks`} ahead` : `${d} days ahead`),
    notas: { halal: 'Halal option', sinCerdo: 'No pork on request', sinAlcohol: 'No alcohol on request', vegetariano: 'Vegetarian on request', hiyab: 'Hijab-friendly', oracion: 'Prayer room', ninos: 'Good with kids', guiaGratis: 'Your guide joins free' },
    codigo: 'with code', deMiParte: 'through me', conTony: 'Perk with Tony',
    paso1: { web: 'Book on their website', tablecheck: 'Book on TableCheck, from their website', correo: 'Email them with the date and group size', formulario: 'Book on the form on their website', tony: 'Message me on WhatsApp with the date and group size' },
    pegar: (c) => ['Before paying, paste the code ', c], mencion: ['When booking, write or say ', ''], yoReservo: 'I book it and confirm with you',
    mapa: 'See on the map',
  },
  ar: {
    desde: 'ابتداءً من', dura: 'المدة', grupo: 'المجموعة', reserva: 'الحجز', como: 'كيف تحجز',
    por: { persona: 'للشخص', adulto: 'للبالغ', grupo: 'للمجموعة' }, hasta: (n) => `حتى ${n}`, personas: (n) => `حتى ${n} ${n >= 3 && n <= 10 ? 'أشخاص' : 'شخصًا'}`,
    reservas: { web: 'من موقعهم', tablecheck: 'عبر TableCheck', correo: 'بالبريد', formulario: 'عبر نموذجهم', tony: 'عن طريقي' },
    antes: (d) => (d === 1 ? 'حتى 24 ساعة قبل الموعد' : d % 30 === 0 ? (d / 30 === 1 ? 'قبل شهر على الأقل' : `قبل ${d / 30} أشهر على الأقل`) : d % 7 === 0 ? (d / 7 === 1 ? 'قبل أسبوع على الأقل' : `قبل ${d / 7} أسابيع على الأقل`) : `قبل ${d} ${d <= 10 ? 'أيام' : 'يومًا'} على الأقل`),
    notas: { halal: 'خيار حلال', sinCerdo: 'بلا خنزير عند الطلب', sinAlcohol: 'بلا كحول عند الطلب', vegetariano: 'نباتي عند الطلب', hiyab: 'مناسب للمحجبات', oracion: 'غرفة صلاة', ninos: 'مناسب للأطفال', guiaGratis: 'مرشدك يدخل مجانًا' },
    codigo: 'بالرمز', deMiParte: 'من طرفي', conTony: 'ميزة مع طوني',
    paso1: { web: 'احجز من موقعهم', tablecheck: 'احجز عبر TableCheck من موقعهم', correo: 'راسلهم بالبريد بالتاريخ وعددكم', formulario: 'احجز عبر النموذج في موقعهم', tony: 'راسلني على واتساب بالتاريخ وعددكم' },
    pegar: (c) => ['قبل الدفع الصق الرمز ', c], mencion: ['عند الحجز اكتب أو قل ', ''], yoReservo: 'أحجزه بنفسي وأؤكد لك',
    mapa: 'على الخريطة',
  },
  ru: {
    desde: 'От', dura: 'Длительность', grupo: 'Группа', reserva: 'Бронь', como: 'Как забронировать',
    por: { persona: 'с человека', adulto: 'со взрослого', grupo: 'за группу' }, hasta: (n) => `до ${n} чел.`, personas: (n) => `до ${n} человек`,
    reservas: { web: 'На их сайте', tablecheck: 'Через TableCheck', correo: 'По почте', formulario: 'Через их форму', tony: 'Через нас' },
    antes: (d) => (d === 1 ? 'до 24 ч до начала' : d % 30 === 0 ? (d / 30 === 1 ? 'минимум за месяц' : `минимум за ${d / 30} мес.`) : d % 7 === 0 ? (d / 7 === 1 ? 'минимум за неделю' : `минимум за ${d / 7} нед.`) : `минимум за ${d} дн.`),
    notas: { halal: 'Есть халяль', sinCerdo: 'Без свинины по запросу', sinAlcohol: 'Без алкоголя по запросу', vegetariano: 'Вегетарианское по запросу', hiyab: 'Можно в хиджабе', oracion: 'Молельная комната', ninos: 'Хорошо с детьми', guiaGratis: 'Гид проходит бесплатно' },
    codigo: 'по коду', deMiParte: 'от нас', conTony: 'Бонус от нас',
    paso1: { web: 'Бронируйте на их сайте', tablecheck: 'Бронируйте через TableCheck на их сайте', correo: 'Напишите им на почту: дата и сколько вас', formulario: 'Бронируйте через форму на их сайте', tony: 'Напишите нам в Telegram: дата и сколько вас' },
    pegar: (c) => ['Перед оплатой вставьте код ', c], mencion: ['При брони напишите или назовите ', ''], yoReservo: 'Мы бронируем и подтверждаем',
    mapa: 'На карте',
  },
}

/** 45 → «45 min»; 90 → «1,5 h»; [30, 60] → «30–60 min»; [240, 600] → «4–10 h». */
export function duracionDe(d: NonNullable<DatosVistazo['duracion']>, id: Id): string {
  const [a, b] = d
  const dec = (m: number) => { const h = m / 60; return id === 'es' || id === 'ru' ? String(h).replace('.', ',') : String(h) }
  const uMin = { es: 'min', en: 'min', ar: 'دقيقة', ru: 'мин' }[id]
  const uH = (max: number, rango: boolean) => (id === 'ar' ? (!rango && max === 1 ? 'ساعة' : !rango && max === 2 ? 'ساعتان' : Number.isInteger(max) && max >= 3 && max <= 10 ? 'ساعات' : 'ساعة') : id === 'ru' ? 'ч' : 'h')
  if (b === undefined) {
    if (a < 60) return `${a} ${uMin}`
    if (id === 'ar' && a === 60) return 'ساعة واحدة'
    if (id === 'ar' && a === 120) return 'ساعتان'
    return `${dec(a)} ${uH(a / 60, false)}`
  }
  if (b <= 60) return `${a}–${b} ${uMin}`
  if (a < 60) return `${a} ${uMin} – ${dec(b)} ${uH(b / 60, false)}`
  return `${dec(a)}–${dec(b)} ${uH(b / 60, true)}`
}

/** Precio «desde»: cifra grande y a qué corresponde, por separado (la cifra va en negrita). */
export function precioDe(d: NonNullable<DatosVistazo['desde']>, id: Id): { cifra: string; por: string } {
  const l = L[id]
  return { cifra: yenes(d.yen, id), por: d.por === 'grupo' && d.hasta ? `${l.por.grupo} ${l.hasta(d.hasta)}` : l.por[d.por] }
}

/** El sello de la ventaja: código con descuento, descuento reservando de mi parte o ventaja conmigo. */
export function selloDe(a: App, id: Id): { tipo: 'codigo' | 'descuento' | 'tony'; cifra?: string; texto: string } | undefined {
  const l = L[id]
  const menos = a.descuento ? (a.descuento.startsWith('−') ? a.descuento : `−${a.descuento}`) : ''
  if (cuponDe(a) && a.descuento) return { tipo: 'codigo', cifra: menos, texto: l.codigo }
  if (a.descuento && a.conTony) return { tipo: 'descuento', cifra: menos, texto: l.deMiParte }
  if (a.conTony) return { tipo: 'tony', texto: l.conTony }
  return undefined
}

export function SelloVentaja({ a, id, grande }: { a: App; id: Id; grande?: boolean }) {
  const s = selloDe(a, id)
  if (!s) return null
  return (
    <span className={`vv-sello es-${s.tipo}${grande ? ' es-grande' : ''}`}>
      {s.cifra && <b dir="ltr">{s.cifra}</b>}<span>{s.texto}</span>
    </span>
  )
}

/** Línea corta para la fila de la lista: «desde 3.500 ¥ · 30–60 min · hasta 15». */
export function MetaFila({ a, id }: { a: App; id: Id }) {
  const v = a.vistazo
  if (!v || !(v.desde || v.duracion || v.grupo)) return null
  const l = L[id]
  return (
    <span className="vv-meta">
      {v.desde && <span><small>{l.desde}</small> <b>{precioDe(v.desde, id).cifra}</b></span>}
      {v.duracion && <span><Clock aria-hidden="true" />{duracionDe(v.duracion, id)}</span>}
      {v.grupo && <span><Users aria-hidden="true" />{l.personas(v.grupo)}</span>}
    </span>
  )
}

/** Rejilla de datos (desde, duración, grupo, reserva) y notas, para el panel y la ficha. */
export function Vistazo({ a, id }: { a: App; id: Id }) {
  const v = a.vistazo
  if (!v) return null
  const l = L[id]
  const celdas: { k: string; ico: typeof Clock; t: string; v: string; s?: string }[] = []
  if (v.desde) { const p = precioDe(v.desde, id); celdas.push({ k: 'desde', ico: Wallet, t: l.desde, v: p.cifra, s: p.por }) }
  if (v.duracion) celdas.push({ k: 'dura', ico: Clock, t: l.dura, v: duracionDe(v.duracion, id) })
  if (v.grupo) celdas.push({ k: 'grupo', ico: Users, t: l.grupo, v: l.personas(v.grupo) })
  if (v.reserva || v.antelacion) celdas.push({ k: 'reserva', ico: CalendarCheck, t: l.reserva, v: v.reserva ? l.reservas[v.reserva] : l.antes(v.antelacion!), s: v.reserva && v.antelacion ? l.antes(v.antelacion) : undefined })
  if (!celdas.length && !v.notas?.length) return null
  return (
    <div className="vv">
      {celdas.length > 0 && (
        <dl className="vv-datos">
          {celdas.map(({ k, ico: Ico, t, v: valor, s }) => (
            <div key={k} className={`vv-dato es-${k}`}>
              <dt><Ico aria-hidden="true" />{t}</dt>
              <dd><b>{valor}</b>{s && <small>{s}</small>}</dd>
            </div>
          ))}
        </dl>
      )}
      {v.notas && v.notas.length > 0 && (
        <ul className="vv-notas">{v.notas.map((n) => <li key={n} className={`es-${n}`}>{l.notas[n]}</li>)}</ul>
      )}
    </div>
  )
}

/** ¿Hay algo que decir de cómo reservar? (para no pintar un título sin pasos). */
export const tienePasos = (a: App) => !!(a.vistazo?.reserva || a.vistazo?.mencion || a.vistazo?.direccion || (a.descuento && cuponDe(a)))

/** «Cómo reservar» en uno o dos pasos, sacados de `reserva`, el código y la mención. */
export function PasosReserva({ a, id, titulo = true }: { a: App; id: Id; titulo?: boolean }) {
  const v = a.vistazo
  const l = L[id]
  const cupon = a.descuento ? cuponDe(a) : undefined
  const pasos: ReactNode[] = []
  if (v?.reserva) pasos.push(<>{l.paso1[v.reserva]}{v.antelacion ? <small> · {l.antes(v.antelacion)}</small> : null}</>)
  if (cupon) { const [antes, c] = l.pegar(cupon); pasos.push(<>{antes}<bdi dir="ltr"><code>{c}</code></bdi>{v?.reserva === 'tablecheck' ? <small> («PROMO CODE»)</small> : null}</>) }
  else if (v?.mencion) pasos.push(<>{l.mencion[0]}<bdi dir="ltr"><q>{v.mencion}</q></bdi></>)
  else if (v?.reserva === 'tony') pasos.push(<>{l.yoReservo}</>)
  if (!pasos.length && !v?.direccion) return null
  return (
    <div className="vv-pasos">
      {titulo && pasos.length > 0 && <p className="vv-pasos-t">{l.como}</p>}
      {pasos.length > 0 && <ol>{pasos.map((p, n) => <li key={n}><span>{p}</span></li>)}</ol>}
      {v?.direccion && (
        <p className="vv-dir"><MapPin aria-hidden="true" /><bdi dir="ltr">{v.direccion}</bdi>{' '}
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${a.nombre} ${v.direccion}`)}`} target="_blank" rel="noopener noreferrer">{l.mapa}</a>
        </p>
      )}
    </div>
  )
}
