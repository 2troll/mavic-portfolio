// Planes de guía + extras que coordinamos (se pagan aparte).
// 8-11-2026, Tony (2.ª versión): NADA de «paquete con precio». La gente creía
// que el precio del guía incluía el té, el kimono… Ahora:
//   · los planes son TIPOS DE SERVICIO DE GUÍA (primer día, día temático,
//     familia musulmana, ritmo tranquilo…), sin precio en la tarjeta;
//   · las experiencias de los socios salen como «extras que coordinamos y
//     se pagan aparte», con su descuento;
//   · arriba, un aviso claro: al guía se le paga el guiado; lo demás, aparte.
//
// Fuente única: React (PlanesVenta.tsx) y estáticas (scripts/planes-estatico.mjs).
// Los socios y descuentos salen de datosVentajas.ts. Nada de alcohol.
import { APPS, cuponDe, RUTA_VENTAJAS, type App } from './datosVentajas.ts'
import { TRAD } from './datosPlanesTrad.ts'

export type LangPlan = 'es' | 'en' | 'ar' | 'ru' | 'tr' | 'fr'
interface TextoPlan { nombre: string; gancho: string; puntos: string[] }

export interface Plan {
  id: string
  icono: string
  /** Experiencias de socios (claves de APPS) que el guía puede coordinar. Se pagan aparte. */
  extras: string[]
  musulman?: boolean
  t: Record<LangPlan, TextoPlan>
}
type PlanBase = Omit<Plan, 't'> & { t: Record<'es' | 'en', TextoPlan> }

/** Contacto del guía de la página (WhatsApp rellena el mensaje; Telegram no). */
export interface GuiaPlan { id: string; ld: string; contacto: (mensaje: string) => string }
const wa = (num: string) => (m: string) => `https://wa.me/${num}?text=${encodeURIComponent(m)}`
const tg = (usuario: string) => () => `https://t.me/${usuario}`
const BASE = 'https://tonykansaiguide.com'

export const GUIAS_PLAN: Record<string, GuiaPlan> = {
  tony: { id: 'tony', ld: `${BASE}/#tony`, contacto: wa('34634193106') },
  larion: { id: 'larion', ld: `${BASE}/#larion`, contacto: tg('Larik_Yokota') },
  mario: { id: 'mario', ld: `${BASE}/private/#mario`, contacto: wa('817089968582') },
  ferhat: { id: 'ferhat', ld: `${BASE}/tr/#ferhat`, contacto: wa('818024786402') },
  antonio: { id: 'antonio', ld: `${BASE}/familias/#antonio`, contacto: wa('817090508554') },
  // Filipp aún no ha dado su Telegram/WhatsApp (8-11-2026): coordina Tony.
  filipp: { id: 'filipp', ld: `${BASE}/ru/filipp/#filipp`, contacto: tg('LUiGi19') },
}

const PLANES_BASE: PlanBase[] = [
  {
    id: 'primer-dia', icono: '🧭', extras: ['nomad', 'japanwireless', 'radical'],
    t: {
      es: { nombre: 'Primer día sin estrés', gancho: 'Te recogemos en el hotel y te enseñamos a moverte por Japón desde el primer momento.', puntos: ['Recogida en tu hotel', 'Tarjeta ICOCA, trenes y apps útiles', 'Cómo pagar y pedir en restaurantes', 'Primer paseo por la ciudad'] },
      en: { nombre: 'Stress-free first day', gancho: 'We meet you at your hotel and show you how to get around Japan from day one.', puntos: ['Pick-up at your hotel', 'ICOCA card, trains and useful apps', 'How to pay and order in restaurants', 'A first walk around the city'] },
    },
  },
  {
    id: 'tematico', icono: '🍵', extras: ['maikoyate', 'camellia', 'wargo', 'okamoto', 'shogun', 'samurai'],
    t: {
      es: { nombre: 'Día temático: té, kimono o samuráis', gancho: 'Eliges el tema y el guía organiza el día alrededor: reserva la experiencia y va contigo.', puntos: ['Elegimos juntos el tema', 'El guía reserva y cuadra los horarios', 'Te acompaña y te traduce', 'Paseo por la zona antes o después'] },
      en: { nombre: 'Theme day: tea, kimono or samurai', gancho: 'You pick the theme and your guide plans the day around it: books the experience and goes with you.', puntos: ['We choose the theme together', 'Your guide books it and plans the timing', 'Goes with you and translates', 'A walk around the area before or after'] },
    },
  },
  {
    id: 'familia-musulmana', icono: '🕌', musulman: true, extras: ['miyabi', 'yumeyakata', 'cookingsun', 'japaneid'],
    t: {
      es: { nombre: 'Familia musulmana', gancho: 'Comida halal, tiempo para rezar y actividades adaptadas, todo pensado de antemano.', puntos: ['Restaurantes halal o sin cerdo ni alcohol', 'Pausas para la oración', 'Ruta pensada para la familia', 'Actividades aptas, como kimono con hiyab'] },
      en: { nombre: 'Muslim family', gancho: 'Halal food, time to pray and suitable activities, all planned ahead.', puntos: ['Halal restaurants, or no pork and no alcohol', 'Breaks for prayer', 'A route built around the family', 'Suitable activities, like kimono with hijab'] },
    },
  },
  {
    id: 'ritmo-tranquilo', icono: '🌿', extras: [],
    t: {
      es: { nombre: 'Ritmo tranquilo', gancho: 'Para mayores o para quien prefiere ir sin prisa: menos escaleras, más pausas.', puntos: ['Ruta con pocas escaleras', 'Pausas y cafeterías', 'Taxi entre visitas si hace falta', 'Horario flexible'] },
      en: { nombre: 'Gentle pace', gancho: 'For older travellers or anyone who prefers no rush: fewer stairs, more breaks.', puntos: ['A route with few stairs', 'Breaks and cafés', 'Taxi between stops if needed', 'Flexible timing'] },
    },
  },
  {
    id: 'artesania', icono: '🎋', extras: ['yokotake', 'nakamura', 'domyo', 'kobaien'],
    t: {
      es: { nombre: 'Japón artesano', gancho: 'Talleres donde te llevas algo hecho por ti; el guía los reserva en japonés y te traduce.', puntos: ['Elegimos el taller que te guste', 'Reserva en japonés', 'Traducción durante el taller', 'Barrios tradicionales alrededor'] },
      en: { nombre: 'Craft Japan', gancho: 'Workshops where you make something to take home; your guide books them in Japanese and translates.', puntos: ['We pick the workshop you like', 'Booked in Japanese', 'Translation during the workshop', 'Traditional streets around it'] },
    },
  },
  {
    id: 'comer-comprar', icono: '🍜', extras: ['inkansai', 'towerknives'],
    t: {
      es: { nombre: 'Osaka para comer y comprar', gancho: 'Mercados, comida callejera y tiendas: el guía te lleva a lo bueno y te traduce.', puntos: ['Mercados como Kuromon', 'Comida callejera en Dotonbori', 'Cuchillos, artesanía o electrónica', 'Compras sin impuestos y cómo pedir'] },
      en: { nombre: 'Osaka to eat and shop', gancho: 'Markets, street food and shops: your guide takes you to the good places and translates.', puntos: ['Markets like Kuromon', 'Street food in Dotonbori', 'Knives, crafts or electronics', 'Tax-free shopping and how to order'] },
    },
  },
  {
    id: 'varios-dias', icono: '🗺️', extras: [],
    t: {
      es: { nombre: 'Varios días con el mismo guía', gancho: 'Un solo guía para todo el viaje: planifica, coordina y te acompaña cada día.', puntos: ['Plan del viaje a tu medida', 'Trenes y reservas coordinados', 'El mismo guía todos los días', 'Kansai y excursiones largas'] },
      en: { nombre: 'Several days, same guide', gancho: 'One guide for the whole trip: plans, coordinates and goes with you every day.', puntos: ['A trip plan made for you', 'Trains and bookings coordinated', 'The same guide every day', 'Kansai and long day trips'] },
    },
  },
]

/** Planes con los seis idiomas: es/en aquí, ar/ru/tr/fr en datosPlanesTrad.ts. */
export const PLANES: Plan[] = PLANES_BASE.map((p) => {
  const t = { ...p.t } as Record<LangPlan, TextoPlan>
  for (const l of ['ar', 'ru', 'tr', 'fr'] as const) {
    const x = TRAD[l].planes[p.id]
    if (!x) throw new Error(`datosPlanes: falta la traducción «${l}» del plan «${p.id}»`)
    t[l] = x
  }
  return { ...p, t }
})

/** Descuentos para el viaje (internet y maletas): también aparte del guía. */
export const KIT_LLEGADA = ['nomad', 'japanwireless', 'airalo', 'radical']

export interface UiPlan {
  ceja: string; h: string; p: string
  pagaGuiaT: string; pagaGuia: string; apartT: string; aparte: string
  extrasT: string; pedir: string; msj: string
  kitH: string; kitP: string; todas: string; halal: string
}
const UI_BASE: Record<'es' | 'en', UiPlan> = {
  es: {
    ceja: 'Planes de guía', h: 'Elige cómo quieres tu día', p: 'Cada plan es un servicio de guía. Las experiencias, entradas, transporte y comidas no están incluidos: se pagan aparte, y si quieres las coordinamos y vamos contigo.',
    pagaGuiaT: 'Al guía le pagas', pagaGuia: 'Solo el guiado: su tarifa de medio día o de día completo.', apartT: 'Aparte, directamente', aparte: 'Entradas, trenes, comidas y experiencias. Con nuestros socios, con descuento.',
    extrasT: 'Extras que coordinamos · se pagan aparte', pedir: 'Pedir este plan', msj: 'Hola, me interesa el plan «{p}». Somos … personas, fechas: …',
    kitH: 'Descuentos para tu viaje', kitP: 'Códigos de internet y consigna de maletas. Aparte del guía.', todas: 'Ver todas las ventajas', halal: 'Apto para familias musulmanas',
  },
  en: {
    ceja: 'Guide plans', h: 'Choose how you want your day', p: 'Each plan is a guiding service. Experiences, tickets, transport and meals are not included: they are paid separately, and if you like we arrange them and go with you.',
    pagaGuiaT: 'You pay the guide', pagaGuia: 'Only the guiding: their half-day or full-day rate.', apartT: 'Separately, directly', aparte: 'Tickets, trains, meals and experiences. With our partners, at a discount.',
    extrasT: 'Extras we arrange · paid separately', pedir: 'Ask for this plan', msj: 'Hello, I’m interested in the “{p}” plan. We are … people, dates: …',
    kitH: 'Discounts for your trip', kitP: 'Codes for mobile data and luggage storage. Separate from the guide.', todas: 'See all perks', halal: 'Muslim-family friendly',
  },
}
const UI: Record<LangPlan, UiPlan> = { ...UI_BASE, ar: TRAD.ar.ui, ru: TRAD.ru.ui, tr: TRAD.tr.ui, fr: TRAD.fr.ui }

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const POR_CLAVE = new Map(APPS.map((a) => [a.clave, a]))
const app = (k: string): App => {
  const a = POR_CLAVE.get(k)
  if (!a) throw new Error(`datosPlanes: el socio «${k}» no existe en datosVentajas.ts`)
  return a
}
/** Nombre de marca sin la aclaración en español: «MAIKOYA (ceremonia del té)» → «MAIKOYA». */
const marca = (a: App) => a.nombre.replace(/\s*\(.*\)\s*$/, '')
const dto = (a: App) => (a.descuento && cuponDe(a) ? ` <b dir="ltr">${esc(a.descuento.startsWith('−') ? a.descuento : `−${a.descuento}`)}</b>` : '')
const rutaVentajas = (lang: LangPlan) => (RUTA_VENTAJAS as Record<string, string>)[lang] ?? RUTA_VENTAJAS.en

/** Bloque de planes, idéntico en React y en las páginas estáticas. */
export function planesHTML(lang: LangPlan, guiaId: string): string {
  const u = UI[lang]
  const g = GUIAS_PLAN[guiaId]
  if (!u?.h) throw new Error(`planesHTML: faltan los textos en «${lang}»`)
  if (!g) throw new Error(`planesHTML: guía «${guiaId}» no está en GUIAS_PLAN`)
  const flecha = lang === 'ar' ? '←' : '→'
  const tarjetas = PLANES.map((p) => {
    const t = p.t[lang]
    const extras = p.extras.map(app)
    return `<li class="pl-t" id="plan-${p.id}">
<span class="pl-i" aria-hidden="true">${p.icono}</span>
<h3>${esc(t.nombre)}</h3>
<p class="pl-g">${esc(t.gancho)}</p>
<ul class="pl-r">${t.puntos.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
${p.musulman ? `<p class="pl-h">✓ ${esc(u.halal)}</p>` : ''}
${extras.length ? `<div class="pl-x"><p>${esc(u.extrasT)}</p><div>${extras.map((a) => `<span><bdi dir="ltr">${esc(marca(a))}</bdi>${dto(a)}</span>`).join('')}</div></div>` : ''}
<a class="pl-b" href="${esc(g.contacto(u.msj.replace('{p}', t.nombre)))}" rel="noopener">${esc(u.pedir)} <span aria-hidden="true">${flecha}</span></a>
</li>`
  }).join('')
  const kit = KIT_LLEGADA.map(app).filter((a) => cuponDe(a)).map((a) => `<li><bdi dir="ltr">${esc(a.nombre)}</bdi>${dto(a)}</li>`).join('')
  return `<section class="pl" id="planes" aria-labelledby="pl-h-${lang}" lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}"><div class="pl-k">
<p class="pl-ceja">${esc(u.ceja)}</p><h2 id="pl-h-${lang}">${esc(u.h)}</h2><p class="pl-p">${esc(u.p)}</p>
<div class="pl-pago"><div><b>💴 ${esc(u.pagaGuiaT)}</b><p>${esc(u.pagaGuia)}</p></div><div><b>🎟️ ${esc(u.apartT)}</b><p>${esc(u.aparte)}</p></div></div>
<ul class="pl-l">${tarjetas}</ul>
<div class="pl-kit"><div><b>${esc(u.kitH)}</b><p>${esc(u.kitP)}</p></div><ul>${kit}</ul><a href="${rutaVentajas(lang)}#codigos">${esc(u.todas)} <span aria-hidden="true">${flecha}</span></a></div>
</div></section>`
}

/** JSON-LD: servicios de guía (sin precio: el precio del guía va en su página). */
export function planesLD(lang: LangPlan, guiaId: string, paginaUrl: string) {
  const g = GUIAS_PLAN[guiaId]
  const u = UI[lang]
  return {
    '@type': 'OfferCatalog',
    '@id': `${paginaUrl}#planes`,
    name: u.h,
    description: `${u.p} ${u.pagaGuiaT}: ${u.pagaGuia} ${u.apartT}: ${u.aparte}`,
    itemListElement: PLANES.map((p) => {
      const t = p.t[lang]
      return {
        '@type': 'Offer',
        url: `${paginaUrl}#plan-${p.id}`,
        offeredBy: { '@id': g.ld },
        itemOffered: { '@type': 'Service', serviceType: 'Private tour guide', name: t.nombre, description: `${t.gancho} ${t.puntos.join('. ')}.`, provider: { '@id': g.ld } },
      }
    }),
  }
}
