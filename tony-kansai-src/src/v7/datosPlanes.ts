// Planes de venta: guía + experiencias de los socios, todo en un solo paquete.
// 8-11-2026, Tony: «que las ventajas no sean solo una lista aparte: que se vendan
// como planes (guía + ceremonia del té + kimono…), con los descuentos, en MI
// página y en la de TODOS los guías, y que las IAs lo lean».
//
// Fuente única: la usan la web React (PlanesVenta.tsx: /es /en /ar /ru y las
// páginas de ventajas) y las estáticas (scripts/planes-estatico.mjs: /tr/,
// /private/, /familias/, /ru/filipp/). El HTML sale de planesHTML() para que
// sea idéntico en todas partes y quede en el HTML prerenderizado (los
// rastreadores de las IAs no ejecutan JavaScript).
//
// Reglas: los socios y sus ventajas salen de datosVentajas.ts (si un código
// caduca o se retira, desaparece aquí también). No se inventan precios de los
// socios: el guía tiene su tarifa y la experiencia va «al precio del socio, con
// la ventaja». Nada de alcohol.
import { APPS, cuponDe, RUTA_VENTAJAS, type App } from './datosVentajas.ts'
import { TRAD } from './datosPlanesTrad.ts'

export type LangPlan = 'es' | 'en' | 'ar' | 'ru' | 'tr' | 'fr'
type Duracion = 'medio' | 'completo'

interface TextoPlan { nombre: string; gancho: string; ruta: string[] }

export interface Plan {
  id: string
  icono: string
  duracion: Duracion
  /** Claves de APPS (datosVentajas.ts) que entran en el plan. */
  socios: string[]
  musulman?: boolean
  t: Record<LangPlan, TextoPlan>
}
type PlanBase = Omit<Plan, 't'> & { t: Record<'es' | 'en', TextoPlan> }

/** Tarifa y contacto del guía de la página. Sin `precios` = precio por mensaje. */
export interface GuiaPlan {
  id: string
  /** @id del Person/LocalBusiness del guía en el JSON-LD de su página. */
  ld: string
  precios?: { medio: number; completo: number }
  /** Enlace de contacto: recibe el texto del mensaje (WhatsApp lo rellena; Telegram lo ignora). */
  contacto: (mensaje: string) => string
  canal: 'WhatsApp' | 'Telegram'
}

const wa = (num: string) => (m: string) => `https://wa.me/${num}?text=${encodeURIComponent(m)}`
const tg = (usuario: string) => () => `https://t.me/${usuario}`
const BASE = 'https://tonykansaiguide.com'

// Precios: los publicados en cada página (contenido.ts para Tony/Larion,
// private.mjs para Mario). Ferhat, Antonio y Filipp dan precio por mensaje.
export const GUIAS_PLAN: Record<string, GuiaPlan> = {
  tony: { id: 'tony', ld: `${BASE}/#tony`, precios: { medio: 38000, completo: 58000 }, contacto: wa('34634193106'), canal: 'WhatsApp' },
  larion: { id: 'larion', ld: `${BASE}/#larion`, precios: { medio: 38000, completo: 58000 }, contacto: tg('Larik_Yokota'), canal: 'Telegram' },
  mario: { id: 'mario', ld: `${BASE}/private/#mario`, precios: { medio: 45600, completo: 69600 }, contacto: wa('817089968582'), canal: 'WhatsApp' },
  ferhat: { id: 'ferhat', ld: `${BASE}/tr/#ferhat`, contacto: wa('818024786402'), canal: 'WhatsApp' },
  antonio: { id: 'antonio', ld: `${BASE}/familias/#antonio`, contacto: wa('817090508554'), canal: 'WhatsApp' },
  // Filipp aún no ha dado su Telegram/WhatsApp (8-11-2026): coordina Tony.
  filipp: { id: 'filipp', ld: `${BASE}/ru/filipp/#filipp`, contacto: tg('LUiGi19'), canal: 'Telegram' },
}

const PLANES_BASE: PlanBase[] = [
  {
    id: 'te-kioto', icono: '🍵', duracion: 'completo', socios: ['maikoyate', 'camellia', 'nakamura'],
    t: {
      es: { nombre: 'Kioto clásico + ceremonia del té', gancho: 'Los imprescindibles de Kioto a pie y una ceremonia del té de verdad, sin buscar ni reservar nada.', ruta: ['Fushimi Inari antes de las multitudes', 'Velas pintadas a mano en Nakamura Rosoku, a pocos minutos de los torii (opcional)', 'Kiyomizu-dera y las cuestas de Higashiyama', 'Ceremonia del té en MAIKOYA o Camellia, con 10 % de descuento'] },
      en: { nombre: 'Classic Kyoto + tea ceremony', gancho: 'Kyoto’s must-sees on foot and a real tea ceremony, with nothing for you to search or book.', ruta: ['Fushimi Inari before the crowds', 'Hand-painted candles at Nakamura Rosoku, minutes from the torii (optional)', 'Kiyomizu-dera and the slopes of Higashiyama', 'Tea ceremony at MAIKOYA or Camellia, 10 % off'] },
    },
  },
  {
    id: 'kimono-gion', icono: '👘', duracion: 'medio', socios: ['wargo', 'okamoto', 'snapkyoto'],
    t: {
      es: { nombre: 'Gion en kimono + fotos', gancho: 'Te vistes de kimono y paseamos por el Kioto más bonito; si quieres, con fotógrafo.', ruta: ['Kimono en Wargo (10 % de descuento) u Okamoto', 'Gion, Hanamikoji y el santuario Yasaka', 'Sesión de fotos con SnapKyoto (opcional)', 'Con Okamoto puedes devolver el kimono en otra tienda o al día siguiente'] },
      en: { nombre: 'Gion in kimono + photos', gancho: 'Dress in kimono and walk the prettiest corners of Kyoto, with a photographer if you like.', ruta: ['Kimono at Wargo (10 % off) or Okamoto', 'Gion, Hanamikoji and Yasaka Shrine', 'Photo session with SnapKyoto (optional)', 'With Okamoto you can return the kimono at another shop or the next day'] },
    },
  },
  {
    id: 'samurai', icono: '⚔️', duracion: 'completo', socios: ['shogun', 'samurai', 'domyo'],
    t: {
      es: { nombre: 'Día samurái en Kioto', gancho: 'Arashiyama, una armadura samurái de verdad y un museo para reír con los niños.', ruta: ['Bosque de bambú y río de Arashiyama', 'Armadura samurái en Shogun Studio, encajada en la ruta', 'Samurai & Ninja Museum, con 10 % de descuento', 'Pulsera kumihimo hecha por ti en DOMYO (opcional)'] },
      en: { nombre: 'Samurai day in Kyoto', gancho: 'Arashiyama, a real samurai armour fitting and a museum the kids will love.', ruta: ['Arashiyama bamboo grove and river', 'Samurai armour at Shogun Studio, fitted into the route', 'Samurai & Ninja Museum, 10 % off', 'Make your own kumihimo bracelet at DOMYO (optional)'] },
    },
  },
  {
    id: 'osaka-bici', icono: '🚲', duracion: 'completo', socios: ['inkansai', 'towerknives'],
    t: {
      es: { nombre: 'Osaka en bici y a bocados', gancho: 'El castillo, barrios donde no van los turistas y comida callejera, con descuento en la ruta en bici.', ruta: ['Castillo de Osaka y su parque', 'Ruta Cycle & Eat por barrios locales, 15 % más barata con nosotros', 'Tower Knives en Shinsekai: presentación privada sobre los cuchillos de Sakai', 'Dotonbori al caer la tarde'] },
      en: { nombre: 'Osaka by bike and bites', gancho: 'The castle, neighbourhoods tourists never see and street food, with a discount on the bike tour.', ruta: ['Osaka Castle and its park', 'Cycle & Eat route through local neighbourhoods, 15 % cheaper with us', 'Tower Knives in Shinsekai: a private talk on Sakai knives', 'Dotonbori at dusk'] },
    },
  },
  {
    id: 'familia-musulmana', icono: '🕌', duracion: 'completo', musulman: true, socios: ['miyabi', 'yumeyakata', 'cookingsun', 'japaneid'],
    t: {
      es: { nombre: 'Familia musulmana: Kioto y Osaka tranquilos', gancho: 'Kimono con hiyab, sitio para rezar, cocina sin alcohol y compras halal: todo pensado de antemano.', ruta: ['Kimono con hiyab en Miyabi-yuki, con personal femenino', 'Yumeyakata (Kioto), con sala de oración', 'Clase en Cooking Sun con menú vegetariano sin alcohol', 'Compras en JAPANeid (Osaka): productos con certificado halal'] },
      en: { nombre: 'Muslim family: Kyoto and Osaka with peace of mind', gancho: 'Kimono with hijab, a place to pray, alcohol-free cooking and halal shopping, all planned ahead.', ruta: ['Kimono with hijab at Miyabi-yuki, all-female staff', 'Yumeyakata (Kyoto), with a prayer room', 'Cooking Sun class with an alcohol-free vegetarian menu', 'Shopping at JAPANeid (Osaka): halal-certified products'] },
    },
  },
  {
    id: 'artesania', icono: '🎋', duracion: 'medio', socios: ['yokotake', 'nakamura', 'domyo'],
    t: {
      es: { nombre: 'Manos japonesas: talleres en Kioto', gancho: 'Te llevas algo hecho por ti: bambú, velas o kumihimo. Elige uno o dos.', ruta: ['Cesta de bambú con TAKENOKO (un solo grupo cada vez, hasta 15)', 'Velas japonesas pintadas a mano en Nakamura Rosoku', 'Pulsera kumihimo en DOMYO, sin experiencia', 'El guía te traduce el taller'] },
      en: { nombre: 'Japanese hands: craft workshops in Kyoto', gancho: 'Take home something you made: bamboo, candles or kumihimo. Pick one or two.', ruta: ['Bamboo basket with TAKENOKO (one group at a time, up to 15)', 'Hand-painted Japanese candles at Nakamura Rosoku', 'Kumihimo bracelet at DOMYO, no experience needed', 'Your guide translates the workshop'] },
    },
  },
  {
    id: 'nara-sumi', icono: '🦌', duracion: 'completo', socios: ['kobaien'],
    t: {
      es: { nombre: 'Nara + taller de tinta sumi', gancho: 'Los ciervos y el Gran Buda, y tu propia barra de tinta en un taller con siglos de historia.', ruta: ['Parque de Nara y sus ciervos', 'Todai-ji y el Gran Buda', 'Paseo por Naramachi', 'Taller en Kobaien: reserva en japonés y traducción sin coste extra'] },
      en: { nombre: 'Nara + sumi ink workshop', gancho: 'The deer and the Great Buddha, then your own ink stick in a centuries-old workshop.', ruta: ['Nara Park and its deer', 'Todai-ji and the Great Buddha', 'A walk through Naramachi', 'Kobaien workshop: booked in Japanese and translated at no extra cost'] },
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

/** Kit de llegada: los códigos de internet y maletas, gratis con cualquier plan. */
export const KIT_LLEGADA = ['nomad', 'japanwireless', 'airalo', 'radical']

const UI: Record<LangPlan, {
  ceja: string; h: string; p: string; medio: string; completo: string; guia: string; porGrupo: string
  socio: string; precioMsj: (canal: string) => string; extra: string; quiero: string; msj: (plan: string) => string
  kitH: string; kitP: string; todas: string; halal: string; codigo: string
}> = {
  es: {
    ceja: 'Planes con guía', h: 'Guía + experiencias, todo en un solo plan', p: 'Un solo contacto organiza el día entero: el guía, las reservas y los descuentos de nuestros socios. Las ventajas son para todos los clientes del equipo, vayas con el guía que vayas.',
    medio: 'Medio día · 4 h', completo: 'Día completo · 8 h', guia: 'Guía', porGrupo: 'por grupo', socio: 'Experiencias al precio del socio, con la ventaja aplicada', precioMsj: (c) => `Precio del guía por ${c}`,
    extra: 'Extra con nosotros', quiero: 'Quiero este plan', msj: (p) => `Hola, me interesa el plan «${p}». Somos … personas, fechas: …`,
    kitH: 'Kit de llegada, gratis con cualquier plan', kitP: 'Los códigos que usan nuestros clientes antes de volar: internet y consigna de maletas.', todas: 'Ver todas las ventajas', halal: 'Apto para familias musulmanas', codigo: 'código',
  },
  en: {
    ceja: 'Guided plans', h: 'Guide + experiences, all in one plan', p: 'One contact arranges the whole day: the guide, the bookings and our partners’ discounts. The perks are for every guest of the team, whichever guide you travel with.',
    medio: 'Half day · 4 h', completo: 'Full day · 8 h', guia: 'Guide', porGrupo: 'per group', socio: 'Experiences at the partner’s price, with the perk applied', precioMsj: (c) => `Guide’s price on ${c}`,
    extra: 'Extra with us', quiero: 'I want this plan', msj: (p) => `Hello, I’m interested in the “${p}” plan. We are … people, dates: …`,
    kitH: 'Arrival kit, free with any plan', kitP: 'The codes our guests use before flying: mobile data and luggage storage.', todas: 'See all perks', halal: 'Muslim-family friendly', codigo: 'code',
  },
  ...Object.fromEntries((['ar', 'ru', 'tr', 'fr'] as const).map((l) => {
    const u = TRAD[l].ui
    return [l, { ...u, precioMsj: (c: string) => u.precioMsj.replace('{c}', c), msj: (p: string) => u.msj.replace('{p}', p) }]
  })) as Record<'ar' | 'ru' | 'tr' | 'fr', never>,
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const POR_CLAVE = new Map(APPS.map((a) => [a.clave, a]))
const app = (k: string): App => {
  const a = POR_CLAVE.get(k)
  if (!a) throw new Error(`datosPlanes: el socio «${k}» no existe en datosVentajas.ts`)
  return a
}
const formatoYen = (n: number, lang: LangPlan) => `${new Intl.NumberFormat(lang === 'ar' ? 'en-US' : lang === 'ru' ? 'ru-RU' : lang).format(n).replace(/ | /g, ' ')} ¥`
/** Nombre de marca sin la aclaración en español: «MAIKOYA (ceremonia del té)» → «MAIKOYA». */
const marca = (a: App) => a.nombre.replace(/\s*\(.*\)\s*$/, '')
const rutaVentajas = (lang: LangPlan) => (RUTA_VENTAJAS as Record<string, string>)[lang] ?? RUTA_VENTAJAS.en

/** Sellos de ventaja de un plan: descuentos vigentes y «extra con nosotros». */
function sellos(p: Plan, lang: LangPlan) {
  const u = UI[lang]
  const out: string[] = []
  for (const k of p.socios) {
    const a = app(k)
    if (a.descuento && cuponDe(a)) out.push(`<span class="pl-s pl-s--dto"><bdi dir="ltr">${esc(marca(a))}</bdi> <b dir="ltr">${esc(a.descuento.startsWith('−') ? a.descuento : `−${a.descuento}`)}</b></span>`)
    else if (a.conTony) out.push(`<span class="pl-s"><bdi dir="ltr">${esc(marca(a))}</bdi> · ${esc(u.extra)}</span>`)
  }
  return out.join('')
}

/** Bloque de planes, idéntico en React y en las páginas estáticas. */
export function planesHTML(lang: LangPlan, guiaId: string, { titulo = true }: { titulo?: boolean } = {}): string {
  const u = UI[lang]
  const g = GUIAS_PLAN[guiaId]
  if (!u?.h) throw new Error(`planesHTML: faltan los textos en «${lang}»`)
  if (!g) throw new Error(`planesHTML: guía «${guiaId}» no está en GUIAS_PLAN`)
  const tarjetas = PLANES.map((p) => {
    const t = p.t[lang]
    if (!t?.nombre) throw new Error(`planesHTML: el plan «${p.id}» no tiene texto en «${lang}»`)
    const precio = g.precios
      ? `<p class="pl-precio"><span>${esc(u.guia)}</span> <b dir="ltr">${formatoYen(g.precios[p.duracion], lang)}</b> <small>${esc(u.porGrupo)}</small></p>`
      : `<p class="pl-precio"><b>${esc(u.precioMsj(g.canal))}</b></p>`
    return `<li class="pl-t" id="plan-${p.id}">
<div class="pl-cab"><span class="pl-i" aria-hidden="true">${p.icono}</span><span class="pl-d">${esc(p.duracion === 'medio' ? u.medio : u.completo)}</span></div>
<h3>${esc(t.nombre)}</h3>
<p class="pl-g">${esc(t.gancho)}</p>
<ol class="pl-r">${t.ruta.map((r) => `<li>${esc(r)}</li>`).join('')}</ol>
<div class="pl-ss">${sellos(p, lang)}${p.musulman ? `<span class="pl-s pl-s--h">✓ ${esc(u.halal)}</span>` : ''}</div>
${precio}<p class="pl-nota">+ ${esc(u.socio)}</p>
<a class="pl-b" href="${esc(g.contacto(u.msj(t.nombre)))}" rel="noopener">${esc(u.quiero)} <span aria-hidden="true">${lang === 'ar' ? '←' : '→'}</span></a>
</li>`
  }).join('')
  const kit = KIT_LLEGADA.map(app).filter((a) => cuponDe(a)).map((a) => `<li><bdi dir="ltr">${esc(a.nombre)}</bdi>${a.descuento ? ` <b dir="ltr">${esc(a.descuento.startsWith('−') ? a.descuento : `−${a.descuento}`)}</b>` : ''}</li>`).join('')
  return `<section class="pl" id="planes" aria-labelledby="pl-h-${lang}" lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}"><div class="pl-k">
${titulo ? `<p class="pl-ceja">${esc(u.ceja)}</p><h2 id="pl-h-${lang}">${esc(u.h)}</h2><p class="pl-p">${esc(u.p)}</p>` : `<h2 id="pl-h-${lang}" class="pl-oculto">${esc(u.h)}</h2>`}
<ul class="pl-l">${tarjetas}</ul>
<div class="pl-kit"><div><b>${esc(u.kitH)}</b><p>${esc(u.kitP)}</p></div><ul>${kit}</ul><a href="${rutaVentajas(lang)}#codigos">${esc(u.todas)} <span aria-hidden="true">${lang === 'ar' ? '←' : '→'}</span></a></div>
</div></section>`
}

/** JSON-LD: catálogo de ofertas (TouristTrip) del guía, para Google y las IAs. */
export function planesLD(lang: LangPlan, guiaId: string, paginaUrl: string) {
  const g = GUIAS_PLAN[guiaId]
  const u = UI[lang]
  return {
    '@type': 'OfferCatalog',
    '@id': `${paginaUrl}#planes`,
    name: u.h,
    description: u.p,
    itemListElement: PLANES.map((p) => {
      const t = p.t[lang]
      return {
        '@type': 'Offer',
        url: `${paginaUrl}#plan-${p.id}`,
        ...(g.precios ? { price: g.precios[p.duracion], priceCurrency: 'JPY' } : {}),
        description: `${t.gancho} ${u.socio}.`,
        offeredBy: { '@id': g.ld },
        itemOffered: {
          '@type': 'TouristTrip',
          name: t.nombre,
          description: t.gancho,
          inLanguage: lang,
          provider: { '@id': g.ld },
          itinerary: { '@type': 'ItemList', itemListElement: t.ruta.map((r, i) => ({ '@type': 'ListItem', position: i + 1, name: r })) },
        },
      }
    }),
  }
}
