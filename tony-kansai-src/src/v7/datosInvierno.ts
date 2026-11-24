// Tours de invierno 2026-27 de Tony (ES / EN / AR) en formato compacto, y
// ventanas de temporada de la portada. Lo usan la portada (PaginaGuia.tsx) y la
// página de precios (scripts/precios.mjs).
//
// LAS CIFRAS NO VIVEN AQUÍ: la única fuente es PRECIO_INVIERNO de
// src/v7/datosTemporadas.ts (página de invierno, con su JSON-LD y validez). Este
// archivo es un adaptador: toursInvierno(PRECIO_INVIERNO) arma la lista. No tiene
// imports para que Node la cargue tal cual desde los .mjs (datosTemporadas.ts
// importa sin extensión y Node no puede; precios.mjs lee PRECIO_INVIERNO del texto).
//
// Fechas de Osaka y Kobe = validez de datosTemporadas.ts (sin viernes: 11-12,
// 25-12 y 29-1 lo son). Precio por grupo de hasta 6; transporte, entradas y
// comida aparte. Larion (/ru/, /larion/) NO lleva estos tours.

export type LangInvierno = 'es' | 'en' | 'ar'
type Tr = Record<LangInvierno, string>

/** Forma de PRECIO_INVIERNO (datosTemporadas.ts). */
export interface PreciosInvierno {
  anoNuevo: number; lucesOsaka: number; lucesKobe: number
  nieveOnsen: number; arimaKobe: number; ciruelos: number; sakuraTemprano: number
}
export const CLAVES_PRECIO_INVIERNO: (keyof PreciosInvierno)[] = ['anoNuevo', 'lucesOsaka', 'lucesKobe', 'nieveOnsen', 'arimaKobe', 'ciruelos', 'sakuraTemprano']

export interface OpcionInvierno {
  /** Duración del día, p. ej. «8 h». */
  horas: string
  yenes: number
  /** Cuándo se aplica (fechas o lugar); vacío si solo hay una opción. */
  cuando: Tr
}

export interface TourInvierno {
  id: 'ano-nuevo' | 'luces' | 'nieve-onsen' | 'ciruelos'
  nombre: Tr
  /** Fechas tal como las da el estudio («sin confirmar» cuando lo está). */
  fechas: Tr
  opciones: OpcionInvierno[]
}

const SIN: Tr = { es: '', en: '', ar: '' }

/** Los 4 tours de invierno con los precios de PRECIO_INVIERNO. */
export function toursInvierno(PI: PreciosInvierno): TourInvierno[] {
  return [
    {
      id: 'ano-nuevo',
      nombre: { es: 'Año Nuevo en Kioto sin multitudes', en: 'New Year in Kyoto without the crowds', ar: 'رأس السنة في كيوتو بعيداً عن الزحام' },
      fechas: { es: '2 y 3 de enero de 2027', en: '2 and 3 January 2027', ar: '2 و3 يناير 2027' },
      opciones: [{ horas: '8 h', yenes: PI.anoNuevo, cuando: SIN }],
    },
    {
      id: 'luces',
      nombre: { es: 'Luces de invierno: Osaka y Kobe', en: 'Winter lights: Osaka and Kobe', ar: 'أضواء الشتاء: أوساكا وكوبي' },
      fechas: { es: 'Osaka: 12–24 dic. 2026 · Kobe: 30 ene.–7 feb. 2027', en: 'Osaka: 12–24 Dec 2026 · Kobe: 30 Jan–7 Feb 2027', ar: 'أوساكا: \u206612–24\u2069 ديسمبر 2026 · كوبي: 30 يناير–7 فبراير 2027' },
      opciones: [
        { horas: '4 h', yenes: PI.lucesOsaka, cuando: { es: 'Osaka · Hikari-Renaissance', en: 'Osaka · Hikari-Renaissance', ar: 'أوساكا · هيكاري رينيسانس' } },
        { horas: '5 h', yenes: PI.lucesKobe, cuando: { es: 'Kobe · Luminarie', en: 'Kobe · Luminarie', ar: 'كوبي · لوميناريه' } },
      ],
    },
    {
      id: 'nieve-onsen',
      nombre: { es: 'Nieve y onsen: Rokko y Arima', en: 'Snow and onsen: Rokko and Arima', ar: 'الثلج والينابيع الحارة: روكّو وأريما' },
      fechas: { es: 'Desde el 5 dic. 2026 (Rokko Snow Park); fecha de cierre sin confirmar', en: 'From 5 Dec 2026 (Rokko Snow Park); closing date not confirmed', ar: 'من 5 ديسمبر 2026 (روكّو سنو بارك)؛ موعد الإغلاق غير مؤكد' },
      opciones: [{ horas: '9–10 h', yenes: PI.nieveOnsen, cuando: SIN }],
    },
    {
      id: 'ciruelos',
      nombre: { es: 'Ciruelos y primer sakura en Kioto', en: 'Plum blossom and first sakura in Kyoto', ar: 'أزهار البرقوق وأول الساكورا في كيوتو' },
      fechas: { es: '15 feb.–31 mar. 2027', en: '15 Feb–31 Mar 2027', ar: '15 فبراير–31 مارس 2027' },
      opciones: [
        { horas: '8 h', yenes: PI.ciruelos, cuando: { es: '15 feb.–19 mar.', en: '15 Feb–19 Mar', ar: '15 فبراير–19 مارس' } },
        { horas: '8 h', yenes: PI.sakuraTemprano, cuando: { es: '20–31 mar.', en: '20–31 Mar', ar: '\u206620–31\u2069 مارس' } },
      ],
    },
  ]
}

/** Página de invierno (la crea el agente INVIERNO). */
export const RUTA_INVIERNO: Record<LangInvierno, string> = {
  es: '/es/invierno-kansai/', en: '/en/kansai-winter/', ar: '/ar/kansai-winter/',
}

/** Textos comunes de la tarjeta de la portada y de la sección de precios. */
export const TXT_INVIERNO: Record<LangInvierno, { titulo: string; entradilla: string; nota: string; enlace: string; desde: string; porGrupo: string }> = {
  es: {
    titulo: 'Invierno 2026-27',
    entradilla: 'Año Nuevo, luces, nieve y los primeros ciruelos. Se reserva ya: un solo grupo al día.',
    nota: 'Precio por grupo de hasta 6. Transporte, entradas y comida, aparte. No guío los viernes.',
    enlace: 'Ver los tours de invierno', desde: 'desde', porGrupo: 'por grupo',
  },
  en: {
    titulo: 'Winter 2026-27',
    entradilla: 'New Year, winter lights, snow and the first plum blossom. Booking now: one group a day.',
    nota: 'Price per group of up to 6. Transport, tickets and meals extra. No tours on Fridays.',
    enlace: 'See the winter tours', desde: 'from', porGrupo: 'per group',
  },
  ar: {
    titulo: 'شتاء \u20662026-27\u2069',
    entradilla: 'رأس السنة والأضواء والثلج وأول أزهار البرقوق. الحجز مفتوح الآن: مجموعة واحدة في اليوم.',
    nota: 'السعر للمجموعة حتى 6 أشخاص. المواصلات والتذاكر والطعام على حدة. لا جولات يوم الجمعة.',
    enlace: 'شاهد جولات الشتاء', desde: 'من', porGrupo: 'للمجموعة',
  },
}

/** Duración legible: en árabe «ساعات» y el número aislado (si no, «9–10» se lee «10–9»). */
export const horasTexto = (h: string, lang: LangInvierno) => (lang === 'ar' ? `\u2066${h.replace(/ h$/, '')}\u2069 ساعات` : h)

/** Precio más bajo del tour (para el formato compacto «desde …»). */
export const yenesDesde = (t: TourInvierno) => Math.min(...t.opciones.map((o) => o.yenes))
/** ¿Tiene precios distintos según fecha o lugar? */
export const variosPrecios = (t: TourInvierno) => new Set(t.opciones.map((o) => o.yenes)).size > 1

// ── Temporadas de la portada (fechas en Asia/Tokyo, «MM-DD», ambos incluidos) ──
// Otoño hasta el 12-12; invierno desde el 20-11 (Año Nuevo se reserva ya) hasta
// el 14-3; sakura del 15-2 al 25-4. Si coinciden dos, primero la que termina antes
// (la que está pasando ahora) y la otra como enlace.
export type Temporada = 'otono' | 'invierno' | 'sakura'
export const VENTANAS: Record<Temporada, { desde: string; hasta: string; emoji: string }> = {
  otono: { desde: '10-01', hasta: '12-12', emoji: '🍁' },
  invierno: { desde: '11-20', hasta: '03-14', emoji: '❄️' },
  sakura: { desde: '02-15', hasta: '04-25', emoji: '🌸' },
}

/** Mes y día de una fecha en hora de Japón. */
export function mesDiaTokio(fecha: Date): { m: number; d: number; y: number } {
  const [y, m, d] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo', year: 'numeric', month: 'numeric', day: 'numeric' })
    .formatToParts(fecha).filter((x) => x.type !== 'literal').map((x) => Number(x.value))
  return { y, m, d }
}

const num = (md: string) => Number(md.replace('-', ''))

/** Temporadas activas en esa fecha, ordenadas: la que termina antes, primero. */
export function temporadasActivas(fecha: Date): Temporada[] {
  const { y, m, d } = mesDiaTokio(fecha)
  const hoy = m * 100 + d
  const activas: { t: Temporada; faltan: number }[] = []
  for (const t of Object.keys(VENTANAS) as Temporada[]) {
    const a = num(VENTANAS[t].desde), b = num(VENTANAS[t].hasta)
    const dentro = a <= b ? hoy >= a && hoy <= b : hoy >= a || hoy <= b
    if (!dentro) continue
    // Días hasta el fin de la ventana (si cruza el año y aún no hemos llegado a enero, el fin es el año que viene).
    const finAno = a > b && hoy >= a ? y + 1 : y
    const fin = Date.UTC(finAno, Math.floor(b / 100) - 1, b % 100)
    activas.push({ t, faltan: Math.round((fin - Date.UTC(y, m - 1, d)) / 86400000) })
  }
  return activas.sort((x, z) => x.faltan - z.faltan).map((x) => x.t)
}
