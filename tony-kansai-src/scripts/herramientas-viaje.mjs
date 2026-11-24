// Dos herramientas de viaje (ES / EN / AR), HTML estático para Google y las IAs:
//   1. Trenes de Kansai: tiempos y precios  → /es/herramientas/transporte-kansai/,
//      /en/tools/kansai-train-times-fares/, /ar/tools/kansai-trains/
//   2. Planificador de días en Kansai       → /es/herramientas/planificador-kansai/,
//      /en/tools/kansai-itinerary-planner/, /ar/tools/kansai-itinerary-planner/
//
// Regla de contenido: NINGUNA cifra inventada.
//   · Tarifas y tiempos de tren: buscador Jorudan, un trayecto por búsqueda,
//     consultado el 16-11-2026 (salida de referencia: martes 17-11-2026, 10:00).
//     Cada trayecto guarda su búsqueda (q) y la página la enlaza como fuente.
//     Keihan subió tarifas el 1-10-2025: Yodoyabashi → Gion-shijō es 490 ¥, no 430
//     (pricey.jp/web/articles/4490). src/v7/datosGuias.ts aún dice «unos 430 ¥».
//   · ICOCA: westjr.co.jp/global/en/howto/icoca/area/ (PiTaPa: Hankyu, Hanshin,
//     Osaka Metro, Keihan, Kintetsu, Nankai; no en el shinkansen). Randen, el
//     funicular de Kōyasan y el autobús del aeropuerto NO constan: «consulta».
//   · JR Pass: japanrailpass.net/en/about_jrp.html (Nozomi/Mizuho, billete especial).
//     Si el JR Pass nacional cubre el Haruka no consta en la web oficial: «consulta».
//   · WEST QR Kansai Area Pass: westjr.co.jp/global/en/ticket/westqr/kansaiarea/
//     (precios, quién lo compra, Haruka sin reserva, sin shinkansen).
//   · Precios del guía: src/v7/datosRutas.ts (PRECIO), src/v7/datosRespuestasNuevas.ts
//     (PRECIO_CORTO), src/lib/data.ts (montaña). Rutas del planificador:
//     src/v7/datosItinerarios.ts (+ itin-en/itin-ar) y TEXTOS de datosRutas.ts.
//     Anclas de la ruta hora a hora: id = ItinId en src/v7/Itinerarios.tsx.
//   · Lo que no consta en la web (p. ej. si el billete de tren del guía va aparte
//     dentro de Kansai) no se dice.
//
// Las funciones del buscador y del planificador viven en crearMotor(): la misma
// función pinta el HTML estático (Node) y corre en la página (se inyecta con toString).
//
// Uso: node scripts/herramientas-viaje.mjs
import { registerHooks } from 'node:module'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { navHTML, pieHTML, menuCSS } from './menu-estatico.mjs'
import { equipoHTML, equipoCSS } from './equipo-estatico.mjs'

// datosItinerarios.ts importa './itin-en' sin extensión (Vite sí, Node no).
registerHooks({
  resolve(spec, ctx, next) {
    try { return next(spec, ctx) } catch (e) {
      if (e.code === 'ERR_MODULE_NOT_FOUND' && /^\.\.?\//.test(spec) && !/\.[a-z]+$/i.test(spec)) return next(`${spec}.ts`, ctx)
      throw e
    }
  },
})

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const { PAGINAS, WA_TONY } = await import('../src/v7/contenido.ts')
const { TEXTOS, PRECIO } = await import('../src/v7/datosRutas.ts')
const { ITINERARIOS } = await import('../src/v7/datosItinerarios.ts')
const { HIKING_ROUTES } = await import('../src/lib/data.ts')
const { MONTES } = await import('../src/v7/datosMontana.ts')

const fuenteCorto = readFileSync(join(root, 'src/v7/datosRespuestasNuevas.ts'), 'utf8')
const mCorto = fuenteCorto.match(/export const PRECIO_CORTO = (\d+)/)
if (!mCorto) throw new Error('herramientas-viaje: no encuentro PRECIO_CORTO en src/v7/datosRespuestasNuevas.ts')
const PRECIO_CORTO = Number(mCorto[1])
const PRECIOS_MONTE = [...new Set(MONTES.map((id) => {
  const r = HIKING_ROUTES.find((x) => x.id === id)
  if (!r) throw new Error(`herramientas-viaje: la ruta de montaña «${id}» no está en HIKING_ROUTES`)
  return Number(String(r.price).replace(/[^0-9]/g, ''))
}).filter((n) => n > 0))]
const MONTE_MIN = Math.min(...PRECIOS_MONTE)
for (const l of ['es', 'en', 'ar']) {
  const pl = PAGINAS[l].precios.planes
  if (pl[0].yenes !== PRECIO.medio || pl[1].yenes !== PRECIO.completo || pl[2].yenes !== PRECIO.lejos) {
    throw new Error(`herramientas-viaje: contenido.ts y datosRutas.ts no coinciden (${l})`)
  }
}

const BASE = 'https://tonykansaiguide.com'
const LANGS = ['es', 'en', 'ar']
const HOY = new Date().toISOString().slice(0, 10)
const COMPROBADO = '2026-11-16'
const FECHA = { es: '16-11-2026', en: '16 Nov 2026', ar: '16-11-2026' }
const SEP = { es: '.', en: ',', ar: ',' }

const RUTA = {
  trenes: { es: '/es/herramientas/transporte-kansai/', en: '/en/tools/kansai-train-times-fares/', ar: '/ar/tools/kansai-trains/' },
  plan: { es: '/es/herramientas/planificador-kansai/', en: '/en/tools/kansai-itinerary-planner/', ar: '/ar/tools/kansai-itinerary-planner/' },
  hub: { es: '/es/herramientas/', en: '/en/tools/', ar: '/ar/tools/' },
  taxi: { es: '/es/herramientas/tarjeta-taxi-japones/', en: '/en/tools/japanese-taxi-card/', ar: '/ar/tools/taxi-card-japanese/' },
  comida: { es: '/es/herramientas/tarjeta-comida-japones/', en: '/en/tools/japanese-food-card/', ar: '/ar/tools/halal-food-card/' },
  precios: { es: '/es/precios/', en: '/en/prices/', ar: '/ar/prices/' },
  rutas: { es: '/es/rutas/', en: '/en/routes/', ar: '/ar/routes/' },
  montana: { es: '/es/montana/', en: '/en/hiking/', ar: '/ar/hiking/' },
  calc: { es: '/es/calculadora-guia/', en: '/en/private-guide-calculator/', ar: '/ar/private-guide-calculator/' },
  osakaKioto: { es: '/es/osaka-kioto/', en: '/en/osaka-to-kyoto/' },
  aeropuerto: { es: '/es/aeropuerto-kansai/', en: '/en/kansai-airport/' },
  inicio: { es: '/es/', en: '/en/', ar: '/ar/' },
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
// En árabe, cada tramo latino o numérico va aislado en <bdi dir="ltr"> para que no se desordene.
const RE_LATIN = /[A-Za-z0-9¥(][A-Za-z0-9¥ .,:'’\-–/()+ōūŌŪ]*[A-Za-z0-9)ōū]|[A-Za-z0-9¥]/g
function tx(s, lang) {
  if (lang !== 'ar') return esc(s)
  let out = ''
  let last = 0
  for (const m of s.matchAll(RE_LATIN)) {
    out += esc(s.slice(last, m.index)) + `<bdi dir="ltr">${esc(m[0])}</bdi>`
    last = m.index + m[0].length
  }
  return out + esc(s.slice(last))
}
const yenTxt = (n, lang) => '¥' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, SEP[lang])
const yen = (n, lang) => `<bdi dir="ltr">${yenTxt(n, lang)}</bdi>`
const flecha = (lang) => (lang === 'ar' ? '←' : '→')
const wa = (msg) => `https://wa.me/${WA_TONY}?text=${encodeURIComponent(msg)}`
const jor = (a, b) => `https://www.jorudan.co.jp/norikae/cgi/nori.cgi?eki1=${encodeURIComponent(a)}&eki2=${encodeURIComponent(b)}&Dym=202611&Ddd=17&Dhh=10&Dmn1=0&Dmn2=0&Cway=0&S=${encodeURIComponent('検索')}`

// ── Lugares del buscador ────────────────────────────────────────────────────
const LUGARES = {
  umeda: { es: 'Osaka (Umeda / estación de Osaka)', en: 'Osaka (Umeda / Osaka Station)', ar: 'أوساكا (أوميدا / محطة أوساكا)', corto: { es: 'Osaka', en: 'Osaka', ar: 'أوساكا' }, o: 1 },
  namba: { es: 'Namba (Osaka)', en: 'Namba (Osaka)', ar: 'نامبا (أوساكا)', corto: { es: 'Namba', en: 'Namba', ar: 'نامبا' }, o: 2 },
  kioto: { es: 'Kioto', en: 'Kyoto', ar: 'كيوتو', o: 3 },
  shinosaka: { es: 'Shin-Osaka', en: 'Shin-Osaka', ar: 'شين أوساكا', o: 4 },
  kix: { es: 'Aeropuerto de Kansai (KIX)', en: 'Kansai Airport (KIX)', ar: 'مطار كانساي (KIX)', corto: { es: 'Aeropuerto de Kansai', en: 'Kansai Airport', ar: 'مطار كانساي' }, o: 5 },
  nara: { es: 'Nara', en: 'Nara', ar: 'نارا' },
  kobe: { es: 'Kobe (Sannomiya)', en: 'Kobe (Sannomiya)', ar: 'كوبي (سانّوميا)', corto: { es: 'Kobe', en: 'Kobe', ar: 'كوبي' } },
  himeji: { es: 'Himeji', en: 'Himeji', ar: 'هيميجي' },
  hiroshima: { es: 'Hiroshima', en: 'Hiroshima', ar: 'هيروشيما' },
  fushimi: { es: 'Fushimi Inari', en: 'Fushimi Inari', ar: 'فوشيمي إيناري' },
  uji: { es: 'Uji', en: 'Uji', ar: 'أوجي' },
  arashiyama: { es: 'Arashiyama', en: 'Arashiyama', ar: 'أراشيياما' },
  koyasan: { es: 'Kōyasan', en: 'Kōyasan', ar: 'كوياسان' },
}
const ORIGENES = ['umeda', 'namba', 'kioto', 'shinosaka', 'kix']
const DESTINOS = ['kioto', 'umeda', 'namba', 'nara', 'kobe', 'himeji', 'hiroshima', 'fushimi', 'uji', 'arashiyama', 'koyasan', 'kix', 'shinosaka']
const nombreCorto = (id, lang) => LUGARES[id].corto?.[lang] ?? LUGARES[id][lang]

// ── Trayectos comprobados ───────────────────────────────────────────────────
// s/e: estación de salida/llegada [latín, japonés]. min: minutos del tren
// consultado. tb: transbordos. yen: total adulto; des: desglose [importe, clase].
// ic: si | base (paga la tarifa; el billete de limited express, aparte) | no | consulta.
// jr: si | no | nozomi | consulta | parcial. pase: 'haruka' (WEST QR Kansai Area Pass).
const LE = 'Limited Express'
const TRAMOS = [
  { id: 'osaka-kioto-jr', de: 'umeda', a: 'kioto', l: { es: 'JR, Special Rapid (línea de Kioto)', en: 'JR Special Rapid (Kyoto Line)', ar: 'JR – قطار Special Rapid (خط كيوتو)' }, s: ['Osaka', '大阪'], e: ['Kyoto', '京都'], min: 29, tb: 0, yen: 580, ic: 'si', jr: 'si', q: ['大阪', '京都'],
    c: { es: 'El más rápido desde la estación de Osaka sin pagar suplemento. Te deja en la estación de Kioto: desde allí, la línea JR Nara va a Fushimi Inari.', en: 'The fastest from Osaka Station with no supplement. It arrives at Kyoto Station, where the JR Nara Line continues to Fushimi Inari.', ar: 'الأسرع من محطة أوساكا من دون رسوم إضافية. يصل إلى محطة كيوتو، ومنها يكمل خط JR Nara إلى فوشيمي إيناري.' } },
  { id: 'osaka-kioto-hankyu', de: 'umeda', a: 'kioto', l: { es: `Hankyu, ${LE} (línea de Kioto)`, en: `Hankyu ${LE} (Kyoto Line)`, ar: `هانكيو – قطار ${LE} (خط كيوتو)` }, s: ['Osaka-umeda (Hankyu)', '大阪梅田'], e: ['Kyoto-kawaramachi', '京都河原町'], min: 43, tb: 0, yen: 410, ic: 'si', jr: 'no', q: ['大阪梅田［阪急］', '京都河原町'],
    c: { es: 'El más barato. Llega al centro de Kioto (Kawaramachi, Shijō, Nishiki); Gion queda a unos 10 minutos a pie cruzando el río.', en: 'The cheapest. It arrives in central Kyoto (Kawaramachi, Shijō, Nishiki); Gion is about a 10-minute walk across the river.', ar: 'الأرخص. يصل إلى وسط كيوتو (Kawaramachi وShijō وسوق Nishiki)، وحي غيون على بُعد نحو 10 دقائق مشياً بعد عبور النهر.' } },
  { id: 'osaka-kioto-keihan', de: 'umeda', a: 'kioto', l: { es: `Keihan, ${LE}`, en: `Keihan ${LE}`, ar: `كيهان – قطار ${LE}` }, s: ['Yodoyabashi', '淀屋橋'], e: ['Gion-shijō', '祇園四条'], min: 50, tb: 0, yen: 490, ic: 'si', jr: 'no', q: ['淀屋橋', '祇園四条'],
    c: { es: 'Directo a Gion y Higashiyama. Yodoyabashi está a 2 minutos de Umeda en el metro Midōsuji. Lleva un coche Premium con asiento reservado y suplemento.', en: 'Straight to Gion and Higashiyama. Yodoyabashi is 2 minutes from Umeda on the Midōsuji subway. It has a Premium Car with reserved seats for a supplement.', ar: 'مباشرة إلى غيون وهيغاشيياما. محطة Yodoyabashi على بُعد دقيقتين من أوميدا بمترو Midōsuji. فيه عربة Premium بمقاعد محجوزة مقابل رسم إضافي.' } },
  { id: 'namba-kioto-jr', de: 'namba', a: 'kioto', l: { es: 'Metro Midōsuji hasta Umeda + JR Special Rapid', en: 'Midōsuji subway to Umeda + JR Special Rapid', ar: 'مترو Midōsuji إلى أوميدا + JR Special Rapid' }, s: ['Namba (Metro)', 'なんば'], e: ['Kyoto', '京都'], min: 50, tb: 1, yen: 820, des: [[240, 'metro'], [580, 'jr']], ic: 'si', jr: 'parcial', q: ['南海難波', '京都'],
    c: { es: 'Cambio en Umeda/Osaka. Te deja en la estación de Kioto.', en: 'Change at Umeda/Osaka. It arrives at Kyoto Station.', ar: 'تبديل في أوميدا/أوساكا. يصل إلى محطة كيوتو.' } },
  { id: 'namba-kioto-keihan', de: 'namba', a: 'kioto', l: { es: 'Metro Midōsuji hasta Yodoyabashi + Keihan', en: 'Midōsuji subway to Yodoyabashi + Keihan', ar: 'مترو Midōsuji إلى Yodoyabashi + كيهان' }, s: ['Namba (Metro)', 'なんば'], e: ['Gion-shijō', '祇園四条'], min: 63, tb: 1, yen: 680, des: [[190, 'metro'], [490, 'keihan']], ic: 'si', jr: 'no', q: ['南海難波', '祇園四条'],
    c: { es: 'Si vas a Gion desde Namba: un solo cambio, en Yodoyabashi.', en: 'If you are going to Gion from Namba: one change, at Yodoyabashi.', ar: 'إن كنت ذاهباً إلى غيون من نامبا: تبديل واحد فقط في Yodoyabashi.' } },
  { id: 'shinosaka-kioto-shinkansen', de: 'shinosaka', a: 'kioto', tipo: 'shinkansen', l: { es: 'Shinkansen Tōkaidō', en: 'Tōkaidō Shinkansen', ar: 'قطار الشينكانسن Tōkaidō' }, s: ['Shin-Osaka', '新大阪'], e: ['Kyoto', '京都'], min: 13, tb: 0, yen: 1450, des: [[580, 'tarifa'], [870, 'sinReserva']], ic: 'no', jr: 'nozomi', q: ['新大阪', '京都'],
    c: { es: 'Solo compensa si duermes en Shin-Osaka o tienes JR Pass. Desde Umeda no merece la pena: el Special Rapid tarda poco más.', en: 'Only worth it if you stay at Shin-Osaka or have a JR Pass. From Umeda it is not worth it: the Special Rapid takes only a little longer.', ar: 'لا يستحق إلا إن كان فندقك في شين أوساكا أو معك JR Pass. ومن أوميدا لا يستحق: قطار Special Rapid أبطأ بقليل فقط.' } },
  { id: 'shinosaka-kioto-jr', de: 'shinosaka', a: 'kioto', l: { es: 'JR, Special Rapid', en: 'JR Special Rapid', ar: 'JR – قطار Special Rapid' }, s: ['Shin-Osaka', '新大阪'], e: ['Kyoto', '京都'], min: 24, tb: 0, yen: 580, ic: 'si', jr: 'si', q: ['新大阪', '京都'],
    c: { es: 'Sin suplemento: 11 minutos más que el shinkansen por menos de la mitad del precio.', en: 'No supplement: 11 minutes more than the shinkansen for less than half the price.', ar: 'بلا رسوم إضافية: أبطأ من الشينكانسن بـ11 دقيقة بأقل من نصف السعر.' } },
  { id: 'osaka-shinosaka-jr', de: 'umeda', a: 'shinosaka', l: { es: 'JR, línea de Kioto', en: 'JR Kyoto Line', ar: 'JR – خط كيوتو' }, s: ['Osaka', '大阪'], e: ['Shin-Osaka', '新大阪'], min: 4, tb: 0, yen: 180, ic: 'si', jr: 'si', q: ['大阪', '新大阪'],
    c: { es: 'Para enlazar con el shinkansen (Himeji, Hiroshima) desde la estación de Osaka.', en: 'To connect with the shinkansen (Himeji, Hiroshima) from Osaka Station.', ar: 'للوصول إلى الشينكانسن (هيميجي وهيروشيما) من محطة أوساكا.' } },
  { id: 'osaka-nara-jr', de: 'umeda', a: 'nara', l: { es: 'JR, Yamatoji Rapid', en: 'JR Yamatoji Rapid', ar: 'JR – قطار Yamatoji Rapid' }, s: ['Osaka', '大阪'], e: ['Nara (JR)', '奈良'], min: 50, tb: 0, yen: 840, ic: 'si', jr: 'si', q: ['大阪', '奈良'],
    c: { es: 'Sin transbordo desde la estación de Osaka. La estación JR de Nara está a unos 16 minutos a pie de la de Kintetsu, que es la más cercana al parque.', en: 'No change from Osaka Station. JR Nara Station is about a 16-minute walk from Kintetsu-Nara, which is the closest to the park.', ar: 'من دون تبديل من محطة أوساكا. محطة JR في نارا على بُعد نحو 16 دقيقة مشياً من محطة Kintetsu-Nara، وهي الأقرب إلى الحديقة.' } },
  { id: 'namba-nara-kintetsu', de: 'namba', a: 'nara', l: { es: 'Kintetsu, Rapid Express (línea de Nara)', en: 'Kintetsu Rapid Express (Nara Line)', ar: 'كينتيتسو – قطار Rapid Express (خط نارا)' }, s: ['Osaka-Namba (Kintetsu)', '大阪難波'], e: ['Kintetsu-Nara', '近鉄奈良'], min: 37, tb: 0, yen: 680, ic: 'si', jr: 'no', q: ['大阪難波', '近鉄奈良'],
    c: { es: 'El mejor si duermes en Namba: llega a unos cinco minutos a pie del parque de Nara.', en: 'The best if you stay in Namba: it arrives about five minutes on foot from Nara Park.', ar: 'الأفضل إن كان فندقك في نامبا: يصل على بُعد نحو خمس دقائق مشياً من حديقة نارا.' } },
  { id: 'kioto-nara-jr', de: 'kioto', a: 'nara', l: { es: 'JR, Miyakoji Rapid (línea de Nara)', en: 'JR Miyakoji Rapid (Nara Line)', ar: 'JR – قطار Miyakoji Rapid (خط نارا)' }, s: ['Kyoto', '京都'], e: ['Nara (JR)', '奈良'], min: 47, tb: 0, yen: 720, ic: 'si', jr: 'si', q: ['京都', '奈良'],
    c: { es: 'Para en Inari y en Uji: se pueden combinar en el mismo viaje.', en: 'It stops at Inari and Uji, so you can combine them on the same trip.', ar: 'يتوقف في Inari وفي أوجي، فيمكن الجمع بينهما في الرحلة نفسها.' } },
  { id: 'kioto-nara-kintetsu', de: 'kioto', a: 'nara', l: { es: 'Kintetsu, Express (línea de Kioto)', en: 'Kintetsu Express (Kyoto Line)', ar: 'كينتيتسو – قطار Express (خط كيوتو)' }, s: ['Kyoto (Kintetsu)', '京都'], e: ['Kintetsu-Nara', '近鉄奈良'], min: 46, tb: 0, yen: 760, ic: 'si', jr: 'no', q: ['京都', '近鉄奈良'],
    c: { es: 'Sale de la misma estación de Kioto. Unos van directos y otros cambian en Yamato-Saidaiji. Llega más cerca del parque.', en: 'It leaves from the same Kyoto Station. Some run direct, others change at Yamato-Saidaiji. It arrives closer to the park.', ar: 'ينطلق من محطة كيوتو نفسها. بعض القطارات مباشرة وبعضها يبدّل في Yamato-Saidaiji. يصل أقرب إلى الحديقة.' } },
  { id: 'kioto-nara-kintetsu-le', de: 'kioto', a: 'nara', l: { es: `Kintetsu, ${LE}`, en: `Kintetsu ${LE}`, ar: `كينتيتسو – قطار ${LE}` }, s: ['Kyoto (Kintetsu)', '京都'], e: ['Kintetsu-Nara', '近鉄奈良'], min: 33, tb: 0, yen: 1280, des: [[760, 'tarifa'], [520, 'le']], ic: 'base', jr: 'no', q: ['京都', '近鉄奈良'],
    c: { es: 'Asiento reservado y el más rápido a Nara desde Kioto.', en: 'Reserved seat and the fastest to Nara from Kyoto.', ar: 'مقعد محجوز، وهو الأسرع إلى نارا من كيوتو.' } },
  { id: 'osaka-kobe-jr', de: 'umeda', a: 'kobe', l: { es: 'JR, Special Rapid (línea de Kobe)', en: 'JR Special Rapid (Kobe Line)', ar: 'JR – قطار Special Rapid (خط كوبي)' }, s: ['Osaka', '大阪'], e: ['Sannomiya', '三ノ宮'], min: 21, tb: 0, yen: 420, ic: 'si', jr: 'si', q: ['大阪', '三ノ宮'],
    c: { es: 'El más rápido a Kobe.', en: 'The fastest to Kobe.', ar: 'الأسرع إلى كوبي.' } },
  { id: 'osaka-kobe-hankyu', de: 'umeda', a: 'kobe', l: { es: `Hankyu, ${LE} (línea de Kobe)`, en: `Hankyu ${LE} (Kobe Line)`, ar: `هانكيو – قطار ${LE} (خط كوبي)` }, s: ['Osaka-umeda (Hankyu)', '大阪梅田'], e: ['Kobe-sannomiya (Hankyu)', '神戸三宮'], min: 28, tb: 0, yen: 330, ic: 'si', jr: 'no', q: ['大阪梅田［阪急］', '神戸三宮［阪急］'],
    c: { es: 'Más barato que JR. Sale de la misma estación que el Hankyu a Kioto.', en: 'Cheaper than JR. It leaves from the same station as the Hankyu to Kyoto.', ar: 'أرخص من JR، وينطلق من المحطة نفسها التي ينطلق منها هانكيو إلى كيوتو.' } },
  { id: 'osaka-kobe-hanshin', de: 'umeda', a: 'kobe', l: { es: `Hanshin, ${LE}`, en: `Hanshin ${LE}`, ar: `هانشين – قطار ${LE}` }, s: ['Osaka-umeda (Hanshin)', '大阪梅田'], e: ['Kobe-sannomiya (Hanshin)', '神戸三宮'], min: 32, tb: 0, yen: 330, ic: 'si', jr: 'no', q: ['大阪梅田［阪神］', '神戸三宮［阪神］'],
    c: { es: 'Mismo precio que Hankyu, por la costa.', en: 'Same price as Hankyu, along the coast.', ar: 'بسعر هانكيو نفسه، على طول الساحل.' } },
  { id: 'namba-kobe-hanshin', de: 'namba', a: 'kobe', l: { es: 'Hanshin, Rapid Express (línea Namba)', en: 'Hanshin Rapid Express (Namba Line)', ar: 'هانشين – قطار Rapid Express (خط نامبا)' }, s: ['Osaka-Namba', '大阪難波'], e: ['Kobe-sannomiya (Hanshin)', '神戸三宮'], min: 41, tb: 0, yen: 420, ic: 'si', jr: 'no', q: ['大阪難波', '神戸三宮［阪神］'],
    c: { es: 'Sin transbordo desde Namba.', en: 'No change from Namba.', ar: 'من دون تبديل من نامبا.' } },
  { id: 'kioto-kobe-jr', de: 'kioto', a: 'kobe', l: { es: 'JR, Special Rapid', en: 'JR Special Rapid', ar: 'JR – قطار Special Rapid' }, s: ['Kyoto', '京都'], e: ['Sannomiya', '三ノ宮'], min: 51, tb: 0, yen: 1110, ic: 'si', jr: 'si', q: ['京都', '三ノ宮'],
    c: { es: 'Directo, pasando por Osaka.', en: 'Direct, via Osaka.', ar: 'مباشر، مروراً بأوساكا.' } },
  { id: 'osaka-himeji-jr', de: 'umeda', a: 'himeji', l: { es: 'JR, Special Rapid (línea de Kobe)', en: 'JR Special Rapid (Kobe Line)', ar: 'JR – قطار Special Rapid (خط كوبي)' }, s: ['Osaka', '大阪'], e: ['Himeji', '姫路'], min: 63, tb: 0, yen: 1460, ic: 'si', jr: 'si', q: ['大阪', '姫路'],
    c: { es: 'Directo y sin suplemento. Algunos trenes llevan el coche A-Seat, con asiento reservado de pago.', en: 'Direct, no supplement. Some trains have an A-Seat car with paid reserved seats.', ar: 'مباشر وبلا رسوم إضافية. بعض القطارات فيها عربة A-Seat بمقاعد محجوزة مدفوعة.' } },
  { id: 'shinosaka-himeji-shinkansen', de: 'shinosaka', a: 'himeji', tipo: 'shinkansen', l: { es: 'Shinkansen Sanyō', en: 'Sanyō Shinkansen', ar: 'قطار الشينكانسن Sanyō' }, s: ['Shin-Osaka', '新大阪'], e: ['Himeji', '姫路'], min: 29, tb: 0, yen: 3220, des: [[1460, 'tarifa'], [1760, 'sinReserva']], ic: 'no', jr: 'nozomi', q: ['新大阪', '姫路'],
    c: { es: 'Media hora. Desde la estación de Osaka, primero 4 minutos de JR hasta Shin-Osaka.', en: 'Half an hour. From Osaka Station, first 4 minutes on JR to Shin-Osaka.', ar: 'نصف ساعة. من محطة أوساكا، أولاً 4 دقائق بقطار JR إلى شين أوساكا.' } },
  { id: 'kioto-himeji-jr', de: 'kioto', a: 'himeji', l: { es: 'JR, Special Rapid', en: 'JR Special Rapid', ar: 'JR – قطار Special Rapid' }, s: ['Kyoto', '京都'], e: ['Himeji', '姫路'], min: 92, tb: 0, yen: 2210, ic: 'si', jr: 'si', q: ['京都', '姫路'],
    c: { es: 'Directo y sin suplemento, pasando por Osaka y Kobe.', en: 'Direct, no supplement, via Osaka and Kobe.', ar: 'مباشر وبلا رسوم إضافية، مروراً بأوساكا وكوبي.' } },
  { id: 'kioto-himeji-shinkansen', de: 'kioto', a: 'himeji', tipo: 'shinkansen', l: { es: 'Shinkansen (Nozomi)', en: 'Shinkansen (Nozomi)', ar: 'شينكانسن (Nozomi)' }, s: ['Kyoto', '京都'], e: ['Himeji', '姫路'], min: 44, tb: 0, yen: 5700, des: [[2210, 'tarifa'], [3490, 'reservado']], ic: 'no', jr: 'nozomi', q: ['京都', '姫路'],
    c: { es: 'La mitad de tiempo, a más del doble de precio.', en: 'Half the time, at more than twice the price.', ar: 'نصف الوقت، بأكثر من ضعف السعر.' } },
  { id: 'shinosaka-hiroshima-nozomi', de: 'shinosaka', a: 'hiroshima', tipo: 'shinkansen', l: { es: 'Shinkansen Nozomi', en: 'Nozomi shinkansen', ar: 'شينكانسن Nozomi' }, s: ['Shin-Osaka', '新大阪'], e: ['Hiroshima', '広島'], min: 85, tb: 0, yen: 10950, des: [[5720, 'tarifa'], [5230, 'reservado']], ic: 'no', jr: 'nozomi', q: ['新大阪', '広島'],
    c: { es: 'Con asiento reservado. El día de Hiroshima y Miyajima empieza aquí.', en: 'With a reserved seat. The Hiroshima and Miyajima day starts here.', ar: 'بمقعد محجوز. من هنا يبدأ يوم هيروشيما وميياجيما.' } },
  { id: 'shinosaka-hiroshima-sakura', de: 'shinosaka', a: 'hiroshima', tipo: 'shinkansen', l: { es: 'Shinkansen Sakura', en: 'Sakura shinkansen', ar: 'شينكانسن Sakura' }, s: ['Shin-Osaka', '新大阪'], e: ['Hiroshima', '広島'], min: 92, tb: 0, yen: 10420, des: [[5720, 'tarifa'], [4700, 'reservado']], ic: 'no', jr: 'si', q: ['新大阪', '広島'],
    c: { es: 'Siete minutos más que el Nozomi, algo más barato y dentro del JR Pass sin billete especial.', en: 'Seven minutes slower than the Nozomi, a little cheaper and covered by the JR Pass without a special ticket.', ar: 'أبطأ من Nozomi بسبع دقائق، وأرخص قليلاً، ويشمله JR Pass من دون تذكرة خاصة.' } },
  { id: 'kioto-hiroshima-nozomi', de: 'kioto', a: 'hiroshima', tipo: 'shinkansen', l: { es: 'Shinkansen Nozomi', en: 'Nozomi shinkansen', ar: 'شينكانسن Nozomi' }, s: ['Kyoto', '京都'], e: ['Hiroshima', '広島'], min: 96, tb: 0, yen: 11940, des: [[6600, 'tarifa'], [5340, 'reservado']], ic: 'no', jr: 'nozomi', q: ['京都', '広島'],
    c: { es: 'Directo desde Kioto, con asiento reservado.', en: 'Direct from Kyoto, with a reserved seat.', ar: 'مباشر من كيوتو، بمقعد محجوز.' } },
  { id: 'kioto-fushimi-jr', de: 'kioto', a: 'fushimi', l: { es: 'JR, línea de Nara', en: 'JR Nara Line', ar: 'JR – خط نارا' }, s: ['Kyoto', '京都'], e: ['Inari', '稲荷'], min: 5, tb: 0, yen: 150, ic: 'si', jr: 'si', q: ['京都', '稲荷'],
    c: { es: 'La estación de Inari está frente a la entrada del santuario. Ve temprano.', en: 'Inari Station is right opposite the shrine entrance. Go early.', ar: 'محطة Inari مقابل مدخل الضريح مباشرة. اذهبوا باكراً.' } },
  { id: 'kioto-fushimi-keihan', de: 'kioto', a: 'fushimi', l: { es: 'Keihan, línea principal', en: 'Keihan Main Line', ar: 'كيهان – الخط الرئيسي' }, s: ['Gion-shijō', '祇園四条'], e: ['Fushimi-inari', '伏見稲荷'], min: 9, tb: 0, yen: 240, ic: 'si', jr: 'no', q: ['祇園四条', '伏見稲荷'],
    c: { es: 'Si duermes en Gion o Higashiyama.', en: 'If you stay in Gion or Higashiyama.', ar: 'إن كان فندقك في غيون أو هيغاشيياما.' } },
  { id: 'osaka-fushimi-keihan', de: 'umeda', a: 'fushimi', l: { es: 'Keihan, línea principal', en: 'Keihan Main Line', ar: 'كيهان – الخط الرئيسي' }, s: ['Yodoyabashi', '淀屋橋'], e: ['Fushimi-inari', '伏見稲荷'], min: 50, tb: 1, yen: 480, ic: 'si', jr: 'no', q: ['淀屋橋', '伏見稲荷'],
    c: { es: 'Limited Express hasta Tambabashi y allí el tren local; o el semi-express directo, en unos 70 minutos.', en: 'Limited Express to Tambabashi, then the local train; or the direct semi-express in about 70 minutes.', ar: 'قطار Limited Express حتى Tambabashi ثم القطار المحلي، أو قطار Semi-Express المباشر في نحو 70 دقيقة.' } },
  { id: 'kioto-uji-jr', de: 'kioto', a: 'uji', l: { es: 'JR, Miyakoji Rapid (línea de Nara)', en: 'JR Miyakoji Rapid (Nara Line)', ar: 'JR – قطار Miyakoji Rapid (خط نارا)' }, s: ['Kyoto', '京都'], e: ['Uji (JR)', '宇治'], min: 17, tb: 0, yen: 240, ic: 'si', jr: 'si', q: ['京都', '宇治（ＪＲ）'],
    c: { es: 'El mismo tren que sigue hasta Nara.', en: 'The same train that continues to Nara.', ar: 'القطار نفسه الذي يكمل إلى نارا.' } },
  { id: 'kioto-uji-keihan', de: 'kioto', a: 'uji', l: { es: 'Keihan, cambio en Chūshojima (línea de Uji)', en: 'Keihan, change at Chūshojima (Uji Line)', ar: 'كيهان، تبديل في Chūshojima (خط أوجي)' }, s: ['Gion-shijō', '祇園四条'], e: ['Uji (Keihan)', '宇治'], min: 38, tb: 1, yen: 360, ic: 'si', jr: 'no', q: ['祇園四条', '宇治（京阪）'],
    c: { es: 'Si sales desde Gion: un solo cambio, en Chūshojima.', en: 'If you leave from Gion: one change, at Chūshojima.', ar: 'إن انطلقت من غيون: تبديل واحد فقط في Chūshojima.' } },
  { id: 'kioto-arashiyama-jr', de: 'kioto', a: 'arashiyama', l: { es: 'JR, línea Sagano', en: 'JR Sagano Line', ar: 'JR – خط Sagano' }, s: ['Kyoto', '京都'], e: ['Saga-Arashiyama', '嵯峨嵐山'], min: 11, tb: 0, yen: 240, ic: 'si', jr: 'si', q: ['京都', '嵯峨嵐山'],
    c: { es: 'Lo más rápido desde la estación de Kioto. El bosque de bambú está a un paseo.', en: 'The fastest from Kyoto Station. The bamboo grove is a short walk away.', ar: 'الأسرع من محطة كيوتو، وغابة الخيزران على بُعد مسافة قصيرة مشياً.' } },
  { id: 'kioto-arashiyama-randen', de: 'kioto', a: 'arashiyama', l: { es: 'Randen (tranvía Keifuku, línea de Arashiyama)', en: 'Randen (Keifuku tram, Arashiyama Line)', ar: 'ترام Randen (Keifuku، خط أراشيياما)' }, s: ['Shijō-Ōmiya', '四条大宮'], e: ['Arashiyama (Randen)', '嵐山'], min: 24, tb: 0, yen: 250, ic: 'consulta', jr: 'no', q: ['四条大宮', '嵐山（京福電気鉄道）'],
    c: { es: 'Un tranvía de barrio que llega al centro de Arashiyama.', en: 'A neighbourhood tram that arrives in central Arashiyama.', ar: 'ترام أحياء يصل إلى وسط أراشيياما.' } },
  { id: 'kioto-arashiyama-hankyu', de: 'kioto', a: 'arashiyama', l: { es: 'Hankyu, cambio en Katsura (línea de Arashiyama)', en: 'Hankyu, change at Katsura (Arashiyama Line)', ar: 'هانكيو، تبديل في Katsura (خط أراشيياما)' }, s: ['Kyoto-kawaramachi', '京都河原町'], e: ['Arashiyama (Hankyu)', '嵐山'], min: 32, tb: 1, yen: 240, ic: 'si', jr: 'no', q: ['京都河原町', '嵐山（阪急）'],
    c: { es: 'Si duermes en Kawaramachi o Gion.', en: 'If you stay in Kawaramachi or Gion.', ar: 'إن كان فندقك في Kawaramachi أو غيون.' } },
  { id: 'osaka-arashiyama-hankyu', de: 'umeda', a: 'arashiyama', l: { es: 'Hankyu, cambio en Katsura', en: 'Hankyu, change at Katsura', ar: 'هانكيو، تبديل في Katsura' }, s: ['Osaka-umeda (Hankyu)', '大阪梅田'], e: ['Arashiyama (Hankyu)', '嵐山'], min: 49, tb: 1, yen: 410, ic: 'si', jr: 'no', q: ['大阪梅田［阪急］', '嵐山（阪急）'],
    c: { es: 'Desde Osaka sin pasar por Kioto ciudad: mismo precio que hasta Kawaramachi.', en: 'From Osaka without going through central Kyoto: the same price as to Kawaramachi.', ar: 'من أوساكا من دون المرور بوسط كيوتو، وبسعر الرحلة إلى Kawaramachi نفسه.' } },
  { id: 'kix-osaka-jr', de: 'kix', a: 'umeda', l: { es: 'JR, Kansai Airport Rapid', en: 'JR Kansai Airport Rapid', ar: 'JR – قطار Kansai Airport Rapid' }, s: ['Kansai Airport', '関西空港'], e: ['Osaka', '大阪'], min: 71, tb: 0, yen: 1180, ic: 'si', jr: 'si', q: ['関西空港', '大阪'],
    c: { es: 'Sin suplemento y sin cambios, pasando por Tennōji.', en: 'No supplement and no changes, via Tennōji.', ar: 'بلا رسوم إضافية وبلا تبديل، مروراً بـTennōji.' } },
  { id: 'kix-osaka-haruka', de: 'kix', a: 'umeda', l: { es: `JR, ${LE} Haruka`, en: `JR ${LE} Haruka`, ar: `JR – قطار ${LE} Haruka` }, s: ['Kansai Airport', '関西空港'], e: ['Osaka (Umekita)', '大阪'], min: 45, tb: 0, yen: 2380, des: [[1180, 'tarifa'], [1200, 'sinReserva']], ic: 'base', jr: 'consulta', pase: 'haruka', q: ['関西空港', '大阪'],
    c: { es: 'Llega a los andenes subterráneos Umekita de la estación de Osaka.', en: 'It arrives at the underground Umekita platforms of Osaka Station.', ar: 'يصل إلى أرصفة Umekita تحت الأرض في محطة أوساكا.' } },
  { id: 'kix-namba-nankai', de: 'kix', a: 'namba', l: { es: 'Nankai, Airport Express', en: 'Nankai Airport Express', ar: 'نانكاي – قطار Airport Express' }, s: ['Kansai Airport', '関西空港'], e: ['Namba (Nankai)', '難波'], min: 45, tb: 0, yen: 970, ic: 'si', jr: 'no', q: ['関西空港', '南海難波'],
    c: { es: 'El más barato hasta Namba, sin suplemento.', en: 'The cheapest to Namba, with no supplement.', ar: 'الأرخص إلى نامبا، بلا رسوم إضافية.' } },
  { id: 'kix-namba-rapit', de: 'kix', a: 'namba', l: { es: `Nankai, ${LE} rapi:t`, en: `Nankai ${LE} rapi:t`, ar: `نانكاي – قطار ${LE} rapi:t` }, s: ['Kansai Airport', '関西空港'], e: ['Namba (Nankai)', '難波'], min: 41, tb: 0, yen: 1670, des: [[970, 'tarifa'], [700, 'le']], ic: 'base', jr: 'no', q: ['関西空港', '南海難波'],
    c: { es: 'Asiento reservado. El que consulté tardaba 41 minutos; Nankai anuncia desde 34 en los más rápidos.', en: 'Reserved seat. The one I checked took 41 minutes; Nankai advertises from 34 on the fastest.', ar: 'مقعد محجوز. القطار الذي راجعته استغرق 41 دقيقة، وتعلن نانكاي عن 34 دقيقة في الأسرع.' } },
  { id: 'kix-shinosaka-haruka', de: 'kix', a: 'shinosaka', l: { es: `JR, ${LE} Haruka`, en: `JR ${LE} Haruka`, ar: `JR – قطار ${LE} Haruka` }, s: ['Kansai Airport', '関西空港'], e: ['Shin-Osaka', '新大阪'], min: 50, tb: 0, yen: 2540, des: [[1340, 'tarifa'], [1200, 'sinReserva']], ic: 'base', jr: 'consulta', pase: 'haruka', q: ['関西空港', '新大阪'],
    c: { es: 'Directo a Shin-Osaka para enlazar con el shinkansen.', en: 'Straight to Shin-Osaka to connect with the shinkansen.', ar: 'مباشر إلى شين أوساكا للوصول إلى الشينكانسن.' } },
  { id: 'kix-kioto-haruka', de: 'kix', a: 'kioto', l: { es: `JR, ${LE} Haruka`, en: `JR ${LE} Haruka`, ar: `JR – قطار ${LE} Haruka` }, s: ['Kansai Airport', '関西空港'], e: ['Kyoto', '京都'], min: 78, tb: 0, yen: 3060, des: [[1860, 'tarifa'], [1200, 'sinReserva']], ic: 'base', jr: 'consulta', pase: 'haruka', q: ['関西空港', '京都'],
    c: { es: 'Directo del aeropuerto a la estación de Kioto, sin cambios.', en: 'Direct from the airport to Kyoto Station, no changes.', ar: 'مباشر من المطار إلى محطة كيوتو، بلا تبديل.' } },
  { id: 'kix-kioto-jr', de: 'kix', a: 'kioto', l: { es: 'JR, Kansai Airport Rapid + Special Rapid', en: 'JR Kansai Airport Rapid + Special Rapid', ar: 'JR – Kansai Airport Rapid + Special Rapid' }, s: ['Kansai Airport', '関西空港'], e: ['Kyoto', '京都'], min: 117, tb: 1, yen: 1860, ic: 'si', jr: 'si', q: ['関西空港', '京都'],
    c: { es: 'Sin suplemento, con un cambio en Osaka. Más barato y bastante más lento.', en: 'No supplement, one change at Osaka. Cheaper and much slower.', ar: 'بلا رسوم إضافية، مع تبديل في أوساكا. أرخص وأبطأ بكثير.' } },
  { id: 'kix-kioto-bus', de: 'kix', a: 'kioto', tipo: 'bus', l: { es: 'Airport Limousine Bus', en: 'Airport Limousine Bus', ar: 'حافلة Airport Limousine' }, s: ['Kansai Airport T1', '関西空港'], e: ['Kyoto Sta. Hachijō exit', '京都駅八条口'], min: 88, tb: 0, yen: 2800, ic: 'consulta', jr: 'no', q: ['関西空港', '京都'],
    c: { es: 'Autobús, no tren: sin cambios con maletas; el tiempo depende del tráfico.', en: 'A bus, not a train: no changes with luggage; the time depends on traffic.', ar: 'حافلة لا قطار: بلا تبديل مع الحقائب، والوقت يتوقف على الزحام.' } },
  { id: 'namba-koyasan', de: 'namba', a: 'koyasan', l: { es: 'Nankai, Express (línea Kōya) + funicular', en: 'Nankai Express (Kōya Line) + cable car', ar: 'نانكاي – قطار Express (خط Kōya) + القطار الجبلي' }, s: ['Namba (Nankai)', '難波'], e: ['Kōyasan (funicular)', '高野山'], min: 111, tb: 1, yen: 1430, des: [[930, 'tarifa'], [500, 'cable']], ic: 'consulta', jr: 'no', q: ['南海難波', '高野山'],
    c: { es: 'El tren sube hasta Gokurakubashi y allí se coge el funicular. Desde la estación de Kōyasan, un autobús sube al pueblo (aparte).', en: 'The train climbs to Gokurakubashi, where you take the cable car. From Kōyasan Station a bus goes up to the town (paid separately).', ar: 'يصعد القطار حتى Gokurakubashi، ومنها القطار الجبلي. ومن محطة كوياسان حافلة تصعد إلى البلدة (تُدفع على حدة).' } },
  { id: 'namba-koyasan-le', de: 'namba', a: 'koyasan', l: { es: `Nankai, ${LE} Kōya + funicular`, en: `Nankai ${LE} Kōya + cable car`, ar: `نانكاي – قطار ${LE} Kōya + القطار الجبلي` }, s: ['Namba (Nankai)', '難波'], e: ['Kōyasan (funicular)', '高野山'], min: 107, tb: 1, yen: 2530, des: [[930, 'tarifa'], [1100, 'le'], [500, 'cable']], ic: 'consulta', jr: 'no', q: ['南海難波', '高野山'],
    c: { es: 'Con asiento reservado; apenas unos minutos más rápido.', en: 'With a reserved seat; only a few minutes faster.', ar: 'بمقعد محجوز، وأسرع ببضع دقائق فقط.' } },
]
const POR_ID = new Map(TRAMOS.map((t) => [t.id, t]))
const tramo = (id) => {
  const t = POR_ID.get(id)
  if (!t) throw new Error(`herramientas-viaje: el trayecto «${id}» no existe`)
  return t
}
for (const t of TRAMOS) {
  if (!LUGARES[t.de] || !LUGARES[t.a]) throw new Error(`herramientas-viaje: lugar desconocido en «${t.id}»`)
  if (t.des && t.des.reduce((s, [n]) => s + n, 0) !== t.yen) throw new Error(`herramientas-viaje: el desglose de «${t.id}» no suma ${t.yen}`)
  for (const l of LANGS) if (!t.l[l] || !t.c[l]) throw new Error(`herramientas-viaje: faltan textos (${l}) en «${t.id}»`)
}

// Fuentes oficiales de las normas (no de las tarifas).
const OFICIALES = [
  { url: 'https://www.westjr.co.jp/global/en/howto/icoca/area/', fecha: COMPROBADO, t: { es: 'JR West: dónde vale la ICOCA (zona PiTaPa: Hankyu, Hanshin, Osaka Metro, Keihan, Kintetsu, Nankai; no en el shinkansen)', en: 'JR West: where ICOCA works (PiTaPa area: Hankyu, Hanshin, Osaka Metro, Keihan, Kintetsu, Nankai; not on the shinkansen)', ar: 'JR West: أين تعمل بطاقة ICOCA (منطقة PiTaPa: Hankyu وHanshin وOsaka Metro وKeihan وKintetsu وNankai، ولا تعمل في الشينكانسن)' } },
  { url: 'https://japanrailpass.net/en/about_jrp.html', fecha: COMPROBADO, t: { es: 'JAPAN RAIL PASS (web oficial): condiciones del Nozomi y el Mizuho', en: 'JAPAN RAIL PASS (official site): conditions for Nozomi and Mizuho', ar: 'JAPAN RAIL PASS (الموقع الرسمي): شروط قطارات Nozomi وMizuho' } },
  { url: 'https://www.westjr.co.jp/global/en/ticket/westqr/kansaiarea/', fecha: COMPROBADO, t: { es: 'JR West: WEST QR Kansai Area Pass (precios, quién lo compra, qué trenes cubre)', en: 'JR West: WEST QR Kansai Area Pass (prices, who can buy it, which trains it covers)', ar: 'JR West: بطاقة WEST QR Kansai Area Pass (الأسعار، ومن يشتريها، والقطارات المشمولة)' } },
  { url: 'https://smart-ex.jp/entraining/iccard/', fecha: '2026-10-08', t: { es: 'smartEX: viajar en shinkansen con la tarjeta IC registrada', en: 'smartEX: riding the shinkansen with a registered IC card', ar: 'smartEX: ركوب الشينكانسن ببطاقة IC مسجّلة' } },
  { url: 'https://www.nankai.co.jp/en_railway/access-fromkix', fecha: '2026-10-08', t: { es: 'Nankai: rapi:t desde 34 minutos hasta Namba', en: 'Nankai: rapi:t from 34 minutes to Namba', ar: 'نانكاي: قطار rapi:t من 34 دقيقة إلى نامبا' } },
]
// WEST QR Kansai Area Pass, adulto (web oficial de JR West, comprobada el 16-11-2026).
const PASE_KANSAI = { d1: 2700, d2: 4700, d3: 5500, d4: 6700 }

// ── Bloques del planificador ────────────────────────────────────────────────
// s: puntuación base según dónde duermes (−999: no se propone). min: días mínimos
// del viaje. orden: posición en el viaje. lejana: excursión lejana (máximo una con
// menos de 6 días). boost: lo que suma cada interés.
const META_PLAN = {
  nara: { s: { osaka: 100, kioto: 100 }, min: 2, orden: 2, boost: { ninos: 20, templos: 10, fotos: 5 } },
  osaka: { s: { osaka: 90, kioto: 60 }, min: 3, orden: 4, boost: { comida: 40, ninos: 15, halal: 10 } },
  arashiyama: { s: { osaka: 60, kioto: 90 }, min: 3, orden: 3, boost: { naturaleza: 25, fotos: 25, templos: 5 } },
  himeji: { s: { osaka: 80, kioto: 80 }, min: 3, orden: 6, boost: { templos: 15, fotos: 10, ninos: 5 } },
  hiroshima: { s: { osaka: 70, kioto: 70 }, min: 4, orden: 8, lejana: true, boost: { fotos: 10, naturaleza: 10, templos: 5 } },
  kobe: { s: { osaka: 50, kioto: 45 }, min: 3, orden: 5, boost: { halal: 60, comida: 15 } },
  uji: { s: { osaka: -999, kioto: 55 }, min: 3, orden: 4, boost: { templos: 10, comida: 10 } },
  koyasan: { s: { osaka: 30, kioto: 20 }, min: 4, orden: 7, lejana: true, boost: { templos: 50, naturaleza: 25 } },
  montana: { s: { osaka: 15, kioto: 15 }, min: 4, orden: 7, boost: { naturaleza: 60 } },
}
// Días «cerca del hotel» que pasan al final si el último sería una excursión lejana.
const CERCA = { osaka: ['osaka', 'kobe'], kioto: ['arashiyama', 'uji', 'osaka'] }
// Tren de cada día según dónde duermes ('-id' = el trayecto en sentido contrario).
const TRENES_PLAN = {
  kioto: { osaka: ['osaka-kioto-jr'], kioto: [] },
  nara: { osaka: ['namba-nara-kintetsu', 'osaka-nara-jr'], kioto: ['kioto-nara-jr', 'kioto-nara-kintetsu'] },
  osaka: { osaka: [], kioto: ['-osaka-kioto-jr'] },
  arashiyama: { osaka: ['osaka-arashiyama-hankyu'], kioto: ['kioto-arashiyama-jr'] },
  uji: { osaka: [], kioto: ['kioto-uji-jr'] },
  kobe: { osaka: ['osaka-kobe-jr'], kioto: ['kioto-kobe-jr'] },
  himeji: { osaka: ['osaka-himeji-jr'], kioto: ['kioto-himeji-jr'] },
  hiroshima: { osaka: ['osaka-shinosaka-jr', 'shinosaka-hiroshima-nozomi'], kioto: ['kioto-hiroshima-nozomi'] },
  koyasan: { osaka: ['namba-koyasan'], kioto: ['-namba-kioto-jr', 'namba-koyasan'] },
  montana: { osaka: [], kioto: [] },
}
const INTERESES = ['templos', 'comida', 'naturaleza', 'ninos', 'halal', 'fotos']
const ITIN_DE = { kioto: 'kioto', osaka: 'osaka', nara: 'nara', himeji: 'himeji', kobe: 'kobe', hiroshima: 'hiroshima' }

// ═════════════════════════════════════════════════════════════════════════════
// Motor: buscador de trenes y planificador. Autocontenido (sin variables de
// fuera) porque se inyecta tal cual en la página con toString().
// ═════════════════════════════════════════════════════════════════════════════
function crearMotor(D) {
  const L = D.L
  const porId = {}
  for (const t of D.tramos) porId[t.id] = t
  const b = (s) => `<bdi dir="ltr">${s}</bdi>`
  const fy = (n) => b('¥' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, L.sep))
  function fm(m) {
    if (!L.rtl) return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}`
    const u = (n) => (n >= 3 && n <= 10 ? 'دقائق' : 'دقيقة')
    if (m < 60) return `${b(m)} ${u(m)}`
    const h = Math.floor(m / 60) === 1 ? 'ساعة' : 'ساعتان'
    return m % 60 ? `${h} و${b(m % 60)} ${u(m % 60)}` : h
  }
  const est = (e) => `<span class="est">${e[0]} <span lang="ja">${e[1]}</span></span>`
  const lugar = (id) => D.lugares[id]
  function trayecto(t, rev) {
    const s = rev ? t.e : t.s
    const e = rev ? t.s : t.e
    return `${est(s)} <span class="fl" aria-hidden="true">${L.flecha}</span><span class="sr">${L.hasta}</span> ${est(e)}`
  }
  const desglose = (t) => (t.des ? t.des.map(([n, k]) => `${fy(n)} ${L.des[k]}`).join(' + ') : '')
  function tarjeta(o, marcas) {
    const t = o.t
    const sello = marcas.map((m) => `<span class="sello">${L[m]}</span>`).join('')
    return `<li class="op${o.rev ? ' op-rev' : ''}">`
      + `<div class="op-q">${sello ? `<p class="sellos">${sello}</p>` : ''}<h3 class="op-l">${t.l}</h3><p class="op-r">${trayecto(t, o.rev)}</p>`
      + `<ul class="op-x"><li>${L.ic[t.ic]}</li><li>${L.jr[t.jr]}</li>${t.pase ? `<li>${L.pase[t.pase]}</li>` : ''}</ul>`
      + `<p class="op-c">${o.rev ? L.vuelta : t.c}</p>`
      + `<p class="op-f"><a href="${t.f}" rel="noopener">${L.fuente}</a> · ${L.comprobado}</p></div>`
      + `<div class="op-p"><p class="op-yen"><b>${fy(t.yen)}</b><span>${L.adulto}</span></p>${t.des ? `<p class="op-des">${desglose(t)}</p>` : ''}`
      + `<p class="op-min"><b>≈ ${fm(t.min)}</b><span>${t.tb ? L.cambios(t.tb) : L.directo}</span></p></div></li>`
  }
  function opciones(de, a) {
    const r = []
    for (const t of D.tramos) {
      if (t.de === de && t.a === a) r.push({ t, rev: false })
      else if (t.de === a && t.a === de) r.push({ t, rev: true })
    }
    return r
  }
  function lista(os) {
    const minT = Math.min(...os.map((o) => o.t.min))
    const minY = Math.min(...os.map((o) => o.t.yen))
    const varias = os.length > 1
    return `<ol class="ops">${os.map((o) => tarjeta(o, varias ? [o.t.min === minT ? 'rapido' : '', o.t.yen === minY ? 'barato' : ''].filter(Boolean) : [])).join('')}</ol>`
  }
  function resultado(de, a) {
    if (de === a) return `<p class="aviso">${L.mismo}</p>`
    const os = opciones(de, a)
    if (os.length) return `<p class="res-t">${lugar(de)} <span aria-hidden="true">${L.flecha}</span><span class="sr">${L.hasta}</span> ${lugar(a)}: <b>${L.nOpciones(os.length)}</b></p>${lista(os)}`
    // Sin trayecto directo comprobado: lo comprobado hasta el destino desde otros puntos.
    const otros = []
    for (const o of D.origenes) if (o !== de && o !== a) { const x = opciones(o, a); if (x.length) otros.push([o, x]) }
    return `<p class="aviso">${L.sinDatos(lugar(de), lugar(a))}</p>`
      + otros.map(([o, x]) => `<p class="res-t">${L.desde(lugar(o))}</p>${lista(x)}`).join('')
  }
  // ── Planificador ──
  function planificar(n, base, ints) {
    const B = D.meta
    if (n <= 1) return ['kioto']
    const puntos = (id) => B[id].s[base] + ints.reduce((s, i) => s + (B[id].boost[i] || 0), 0)
    const cand = Object.keys(B).filter((id) => id !== 'nara' && n >= B[id].min && B[id].s[base] > -100)
      .sort((x, y) => puntos(y) - puntos(x) || B[x].orden - B[y].orden)
    const maxLej = n >= 6 ? 2 : 1
    let lej = 0
    const el = ['nara']
    for (const id of cand) {
      if (el.length >= n - 1) break
      if (B[id].lejana) { if (lej >= maxLej) continue; lej++ }
      el.push(id)
    }
    el.sort((x, y) => B[x].orden - B[y].orden)
    const dias = ['kioto', ...el]
    if (B[dias[dias.length - 1]].lejana) {
      const cerca = D.cerca[base].map((c) => dias.indexOf(c)).find((i) => i > 0)
      if (cerca !== undefined) dias.push(dias.splice(cerca, 1)[0])
    }
    return dias
  }
  function guiaDe(id, ints) {
    const t = (i) => ints.indexOf(i) >= 0
    switch (id) {
      case 'kioto': return 'completo'
      case 'nara': return 'medio'
      case 'osaka': return t('comida') || t('ninos') ? 'completo' : null
      case 'kobe': return t('halal') ? 'medio' : null
      case 'himeji': return t('templos') || t('fotos') ? 'completo' : null
      case 'hiroshima': case 'koyasan': return 'lejos'
      case 'montana': return 'monte'
      default: return null
    }
  }
  function trenCorto(ref) {
    const rev = ref[0] === '-'
    const t = porId[rev ? ref.slice(1) : ref]
    return `<li>${t.l}: ${trayecto(t, rev)} · ≈ ${fm(t.min)} · ${fy(t.yen)}</li>`
  }
  function precioDia(g, p) {
    const y = D.precio[g]
    const desde = D.desde[g] ? `<small>${L.desdeP}</small> ` : ''
    const pp = p > 6 ? `<em>${L.mas6}</em>` : p > 1 ? `<em>${L.porPersona(fy(y / p), p)}</em>` : ''
    return `<p class="dia-p">${desde}<b>${fy(y)}</b><span>${L.porGrupo}</span>${pp}</p>`
  }
  function dias(n, base, p, ints) {
    return planificar(n, base, ints).map((id, i) => {
      const g = guiaDe(id, ints)
      const k = D.bloques[id]
      const v = g ? k.guia : k.libre
      const trenes = D.trenes[id][base]
      const tren = trenes.length ? `<ul class="dia-tren">${trenes.map(trenCorto).join('')}</ul>` : `<p class="dia-hotel">${id === 'montana' ? k.trenTxt : g ? L.hotelAqui : L.hotelLibre}</p>`
      const halal = ints.indexOf('halal') >= 0 && k.comer ? `<p class="dia-comer"><b>${L.comer}</b> ${k.comer}</p>` : ''
      return { id, g, html: `<li class="dia${g ? ' dia-g' : ''}"><div class="dia-n"><span>${L.dia(i + 1)}</span><b class="${g ? 'con' : 'sin'}">${g ? L.conGuia(L.tramo[g]) : L.libre}</b></div>`
        + `<div class="dia-c"><h3>${v.titulo}</h3><p>${v.texto}</p><p class="dia-por">${v.porque}</p>${tren}${halal}`
        + `${k.enlace ? `<a class="dia-l" href="${k.enlace[1]}">${k.enlace[0]} <span aria-hidden="true">${L.flecha}</span></a>` : ''}</div>`
        + `${g ? precioDia(g, p) : `<p class="dia-p dia-p-libre"><span>${L.sinGuia}</span></p>`}</li>`,
        texto: `${L.diaTxt(i + 1)}: ${v.plano}${g ? ` (${L.conGuiaTxt(L.tramoTxt[g])})` : ""}` }
    })
  }
  function plan(n, base, p, ints) {
    const ds = dias(n, base, p, ints)
    const guiados = ds.filter((d) => d.g)
    const total = guiados.reduce((s, d) => s + D.precio[d.g], 0)
    const desde = guiados.some((d) => D.desde[d.g])
    const resumen = guiados.length
      ? `<div class="total"><p><span>${L.total(guiados.length, n)}</span><b>${desde ? `<small>${L.desdeP}</small> ` : ''}${fy(total)}</b><em>${L.porGrupo}${p > 1 && p <= 6 ? ` · ${L.porPersona(fy(total / p), p)}` : ''}</em></p><p class="total-n">${L.totalNota}</p></div>`
      : ''
    const msg = [L.msgHola, L.msgDatos(n, D.baseNombre[base], p <= 6 ? String(p) : '7+'), ints.length ? `${L.msgInt}: ${ints.map((i) => D.intNombre[i]).join(', ')}` : '', ...ds.map((d) => d.texto), L.msgFechas].filter(Boolean).join('\n')
    return { html: `<ol class="dias">${ds.map((d) => d.html).join('')}</ol>${resumen}`, wa: `https://wa.me/${D.wa}?text=${encodeURIComponent(msg)}`, ids: ds.map((d) => d.id), guiados: guiados.length, total, desde }
  }
  return { resultado, planificar, guiaDe, plan, fy, fm, trayecto }
}

// ═════════════════════════════════════════════════════════════════════════════
// Textos
// ═════════════════════════════════════════════════════════════════════════════
const COMUN = {
  es: {
    inicio: 'Tony Kansai Guide', hub: 'Herramientas', nav: { etiqueta: 'Secciones', abrir: 'Abrir menú', g1: 'En esta página', g2: 'Herramientas', g3: 'Más', cta: 'WhatsApp' },
    herramientas: [['Todas las herramientas', 'hub'], ['Trenes de Kansai: tiempos y precios', 'trenes'], ['Planificador de días en Kansai', 'plan'], ['Tarjeta para el taxi en japonés', 'taxi'], ['Tarjeta de comida en japonés', 'comida']],
    mas: [['Página de Tony', 'inicio'], ['Precios del guía', 'precios'], ['Rutas hora a hora', 'rutas'], ['¿Te compensa un guía? Calculadora', 'calc']],
    pie: { intro: 'Tony Hanma es guía privado en español, inglés y árabe en Kioto, Osaka, Nara y Kansai. Te recoge en el vestíbulo de tu hotel y el día es solo para tu grupo.', c1: 'Herramientas', c2: 'Contacto', act: 'Actualizado', mas: 'Ver todo' },
    idioma: { es: 'Español', en: 'English', ar: 'العربية' },
    relH: 'Para seguir planeando', faqH: 'Preguntas', fuentesH: 'Fuentes y fecha', migas: 'Migas de pan',
  },
  en: {
    inicio: 'Tony Kansai Guide', hub: 'Tools', nav: { etiqueta: 'Sections', abrir: 'Open menu', g1: 'On this page', g2: 'Tools', g3: 'More', cta: 'WhatsApp' },
    herramientas: [['All tools', 'hub'], ['Kansai trains: times and fares', 'trenes'], ['Kansai itinerary planner', 'plan'], ['Japanese taxi card', 'taxi'], ['Japanese food card', 'comida']],
    mas: [['Tony’s page', 'inicio'], ['Guide prices', 'precios'], ['Routes hour by hour', 'rutas'], ['Is a guide worth it? Calculator', 'calc']],
    pie: { intro: 'Tony Hanma is a private guide in English, Spanish and Arabic in Kyoto, Osaka, Nara and Kansai. He meets you in your hotel lobby and the day is just for your group.', c1: 'Tools', c2: 'Contact', act: 'Updated', mas: 'See all' },
    idioma: { es: 'Español', en: 'English', ar: 'العربية' },
    relH: 'Keep planning', faqH: 'Questions', fuentesH: 'Sources and date', migas: 'Breadcrumb',
  },
  ar: {
    inicio: 'Tony Kansai Guide', hub: 'الأدوات', nav: { etiqueta: 'الأقسام', abrir: 'افتح القائمة', g1: 'في هذه الصفحة', g2: 'الأدوات', g3: 'المزيد', cta: 'واتساب' },
    herramientas: [['كل الأدوات', 'hub'], ['قطارات كانساي: الأوقات والأسعار', 'trenes'], ['مخطِّط أيام كانساي', 'plan'], ['بطاقة التاكسي باليابانية', 'taxi'], ['بطاقة الطعام الحلال باليابانية', 'comida']],
    mas: [['صفحة طوني', 'inicio'], ['أسعار المرشد', 'precios'], ['المسارات ساعةً بساعة', 'rutas'], ['هل يستحق المرشد؟ حاسبة', 'calc']],
    pie: { intro: 'طوني هانما مرشد خاص بالعربية والإسبانية والإنجليزية في كيوتو وأوساكا ونارا وكانساي. يستقبلكم في بهو الفندق، واليوم لمجموعتكم وحدها.', c1: 'الأدوات', c2: 'التواصل', act: 'آخر تحديث', mas: 'عرض الكل' },
    idioma: { es: 'Español', en: 'English', ar: 'العربية' },
    relH: 'لمواصلة التخطيط', faqH: 'أسئلة', fuentesH: 'المصادر والتاريخ', migas: 'مسار التصفح',
  },
}

// Etiquetas del motor (van a la página como JSON).
function etiquetasMotor(lang) {
  const E = {
    es: {
      flecha: '→', hasta: ' hasta ', adulto: 'adulto, billete normal', directo: 'directo', rapido: 'Más rápido', barato: 'Más barato', fuente: 'Fuente: Jorudan', comprobado: `comprobado el ${FECHA.es}`,
      des: { tarifa: 'tarifa', sinReserva: 'suplemento sin reserva', reservado: 'suplemento con asiento reservado', le: 'billete de limited express', cable: 'funicular', metro: 'metro', jr: 'JR', keihan: 'Keihan' },
      ic: { si: 'ICOCA / Suica: sí', base: 'ICOCA: paga la tarifa; el billete de limited express, aparte', no: 'ICOCA: no con saldo (sí registrando la tarjeta en smartEX)', consulta: 'ICOCA: no confirmado, pregunta en la estación' },
      jr: { si: 'JR Pass: sí', no: 'JR Pass: no (no es de JR)', nozomi: 'JR Pass: el Nozomi solo con un billete especial aparte; Hikari y Kodama, sí', consulta: 'JR Pass: no confirmado en la web oficial', parcial: 'JR Pass: solo el tramo de JR' },
      pase: { haruka: 'WEST QR Kansai Area Pass: sí, en asiento sin reserva' },
      vuelta: 'El mismo tren en sentido contrario: misma tarifa; el tiempo puede variar unos minutos.',
      mismo: 'Elige un destino distinto del origen.',
      nOpciones: (n) => (n === 1 ? '1 opción' : `${n} opciones`),
      cambios: (n) => (n === 1 ? '1 transbordo' : `${n} transbordos`),
      sinDatos: (o, d) => `De ${o} a ${d} no tengo un trayecto comprobado tal cual. Abajo tienes lo comprobado hasta ${d} desde otros puntos; si dudas, pregúntame por WhatsApp.`,
      desde: (o) => `Desde ${o}:`,
      dia: (n) => `Día ${n}`, diaTxt: (n) => `Día ${n}`, conGuia: (t) => `Con guía · ${t}`, conGuiaTxt: (t) => `con guía, ${t}`, libre: 'Por libre', libreTxt: 'por libre', sinGuia: 'Sin guía: solo tus trenes y entradas',
      tramo: { completo: 'día completo', medio: 'medio día', lejos: 'excursión lejana', monte: 'montaña' }, tramoTxt: { completo: 'día completo', medio: 'medio día', lejos: 'excursión lejana', monte: 'montaña' },
      porGrupo: 'por grupo', desdeP: 'desde', porPersona: (y, p) => `≈ ${y} por persona siendo ${p}`, mas6: 'Más de 6: escríbeme y lo organizamos (segundo guía o suplemento)',
      hotelAqui: 'Empieza en tu hotel: te recojo en el vestíbulo.', hotelLibre: 'Desde tu hotel, a pie y en metro.', comer: 'Comer:',
      total: (g, n) => `Guía: ${g} de ${n} días`, totalNota: 'Es la suma de la tarifa de cada día. Para varios días te paso un precio cerrado por todo. Trenes, entradas y comidas, aparte.',
      msgHola: 'Hola, Tony. Vengo del planificador de Kansai y quiero este plan.', msgDatos: (n, b, p) => `Días: ${n} · Duermo en: ${b} · Somos: ${p}`, msgInt: 'Nos gusta', msgFechas: 'Fechas:',
    },
    en: {
      flecha: '→', hasta: ' to ', adulto: 'adult, regular ticket', directo: 'direct', rapido: 'Fastest', barato: 'Cheapest', fuente: 'Source: Jorudan', comprobado: `checked ${FECHA.en}`,
      des: { tarifa: 'fare', sinReserva: 'non-reserved supplement', reservado: 'reserved-seat supplement', le: 'limited express ticket', cable: 'cable car', metro: 'subway', jr: 'JR', keihan: 'Keihan' },
      ic: { si: 'ICOCA / Suica: yes', base: 'ICOCA: pays the fare; the limited express ticket is separate', no: 'ICOCA: not with stored value (yes if registered on smartEX)', consulta: 'ICOCA: not confirmed, ask at the station' },
      jr: { si: 'JR Pass: yes', no: 'JR Pass: no (not a JR line)', nozomi: 'JR Pass: Nozomi only with a separate special ticket; Hikari and Kodama, yes', consulta: 'JR Pass: not confirmed on the official site', parcial: 'JR Pass: only the JR part' },
      pase: { haruka: 'WEST QR Kansai Area Pass: yes, non-reserved seat' },
      vuelta: 'The same train in the opposite direction: same fare; the time may vary by a few minutes.',
      mismo: 'Choose a destination different from the origin.',
      nOpciones: (n) => (n === 1 ? '1 option' : `${n} options`),
      cambios: (n) => (n === 1 ? '1 change' : `${n} changes`),
      sinDatos: (o, d) => `I have no checked route from ${o} to ${d} as such. Below are the checked routes to ${d} from other points; if in doubt, ask me on WhatsApp.`,
      desde: (o) => `From ${o}:`,
      dia: (n) => `Day ${n}`, diaTxt: (n) => `Day ${n}`, conGuia: (t) => `With guide · ${t}`, conGuiaTxt: (t) => `with guide, ${t}`, libre: 'On your own', libreTxt: 'on our own', sinGuia: 'No guide: just your trains and tickets',
      tramo: { completo: 'full day', medio: 'half day', lejos: 'long day trip', monte: 'hiking' }, tramoTxt: { completo: 'full day', medio: 'half day', lejos: 'long day trip', monte: 'hiking' },
      porGrupo: 'per group', desdeP: 'from', porPersona: (y, p) => `≈ ${y} each for ${p}`, mas6: 'More than 6: message me and we organise it (second guide or supplement)',
      hotelAqui: 'Starts at your hotel: I meet you in the lobby.', hotelLibre: 'From your hotel, on foot and by metro.', comer: 'Food:',
      total: (g, n) => `Guide: ${g} of ${n} days`, totalNota: 'This adds up each day’s rate. For several days I send you one fixed price for everything. Trains, tickets and meals extra.',
      msgHola: 'Hi Tony, I’m coming from the Kansai planner and I’d like this plan.', msgDatos: (n, b, p) => `Days: ${n} · Staying in: ${b} · We are: ${p}`, msgInt: 'We like', msgFechas: 'Dates:',
    },
    ar: {
      flecha: '←', hasta: ' إلى ', adulto: 'للبالغ، تذكرة عادية', directo: 'مباشر', rapido: 'الأسرع', barato: 'الأرخص', fuente: 'المصدر: Jorudan', comprobado: `تمت المراجعة في <bdi dir="ltr">${FECHA.ar}</bdi>`,
      des: { tarifa: 'الأجرة', sinReserva: 'رسم المقعد غير المحجوز', reservado: 'رسم المقعد المحجوز', le: 'تذكرة Limited Express', cable: 'القطار الجبلي', metro: 'المترو', jr: 'JR', keihan: 'كيهان' },
      ic: { si: 'ICOCA / Suica: نعم', base: 'ICOCA: تدفع الأجرة فقط، وتذكرة Limited Express على حدة', no: 'ICOCA: لا بالرصيد (نعم إذا سجّلت البطاقة في smartEX)', consulta: 'ICOCA: غير مؤكد، اسأل في المحطة' },
      jr: { si: 'JR Pass: نعم', no: 'JR Pass: لا (ليس خط JR)', nozomi: 'JR Pass: قطار Nozomi فقط بتذكرة خاصة منفصلة، وHikari وKodama نعم', consulta: 'JR Pass: غير مؤكد في الموقع الرسمي', parcial: 'JR Pass: جزء JR فقط' },
      pase: { haruka: 'WEST QR Kansai Area Pass: نعم، بمقعد غير محجوز' },
      vuelta: 'القطار نفسه في الاتجاه المعاكس: الأجرة نفسها، وقد يختلف الوقت ببضع دقائق.',
      mismo: 'اختر وجهة مختلفة عن نقطة الانطلاق.',
      nOpciones: (n) => (n === 1 ? 'خيار واحد' : n === 2 ? 'خياران' : `<bdi dir="ltr">${n}</bdi> ${n <= 10 ? 'خيارات' : 'خياراً'}`),
      cambios: (n) => (n === 1 ? 'تبديل واحد' : 'تبديلان'),
      sinDatos: (o, d) => `لم أراجع رحلة من ${o} إلى ${d} كما هي. في الأسفل الرحلات التي راجعتها إلى ${d} من نقاط أخرى، وإن احترت فاسألني على واتساب.`,
      desde: (o) => `من ${o}:`,
      dia: (n) => `اليوم <bdi dir="ltr">${n}</bdi>`, diaTxt: (n) => `اليوم ${n}`, conGuia: (t) => `مع مرشد · ${t}`, conGuiaTxt: (t) => `مع مرشد، ${t}`, libre: 'على راحتكم', libreTxt: 'من دون مرشد', sinGuia: 'من دون مرشد: قطاراتكم وتذاكركم فقط',
      tramo: { completo: 'يوم كامل', medio: 'نصف يوم', lejos: 'رحلة بعيدة', monte: 'مشي جبلي' }, tramoTxt: { completo: 'يوم كامل', medio: 'نصف يوم', lejos: 'رحلة بعيدة', monte: 'مشي جبلي' },
      porGrupo: 'للمجموعة', desdeP: 'ابتداءً من', porPersona: (y, p) => `≈ ${y} للشخص إن كنتم <bdi dir="ltr">${p}</bdi>`, mas6: 'أكثر من 6: راسلني وننظّمها (مرشد ثانٍ أو مبلغ إضافي)',
      hotelAqui: 'يبدأ من فندقكم: أستقبلكم في البهو.', hotelLibre: 'من فندقكم، مشياً وبالمترو.', comer: 'الطعام:',
      total: (g, n) => `المرشد: <bdi dir="ltr">${g}</bdi> من <bdi dir="ltr">${n}</bdi> أيام`, totalNota: 'هذا مجموع سعر كل يوم. ولعدة أيام أرسل لكم سعراً ثابتاً للرحلة كلها. القطارات والتذاكر والوجبات على حدة.',
      msgHola: 'السلام عليكم يا طوني، جئت من مخطِّط كانساي وأريد هذه الخطة.', msgDatos: (n, b, p) => `الأيام: ${n} · الإقامة في: ${b} · عددنا: ${p}`, msgInt: 'نحب', msgFechas: 'التواريخ:',
    },
  }[lang]
  // En árabe, las etiquetas con nombres latinos (ICOCA, JR Pass…) se aíslan con <bdi>.
  if (lang === 'ar') {
    for (const k of ['ic', 'jr', 'pase', 'des']) E[k] = Object.fromEntries(Object.entries(E[k]).map(([c, v]) => [c, tx(v, lang)]))
    for (const k of ['fuente', 'adulto', 'sinGuia', 'mas6', 'totalNota']) E[k] = tx(E[k], lang)
  }
  return { ...E, sep: SEP[lang], rtl: lang === 'ar' }
}

// El JSON no lleva funciones: las etiquetas-función se reescriben como plantillas.
function etiquetasJS(L) {
  const fns = Object.entries(L).filter(([, v]) => typeof v === 'function').map(([k, v]) => `${JSON.stringify(k)}:${v.toString()}`)
  const datos = Object.fromEntries(Object.entries(L).filter(([, v]) => typeof v !== 'function'))
  return `Object.assign(${JSON.stringify(datos)},{${fns.join(',')}})`
}

// ── Datos del motor por idioma ──────────────────────────────────────────────
function tramosLang(lang) {
  return TRAMOS.map((t) => ({
    id: t.id, de: t.de, a: t.a, min: t.min, tb: t.tb, yen: t.yen, des: t.des ?? null, ic: t.ic, jr: t.jr, pase: t.pase ?? null,
    l: tx(t.l[lang], lang), c: tx(t.c[lang], lang), f: jor(t.q[0], t.q[1]),
    s: [`<bdi dir="ltr">${esc(t.s[0])}</bdi>`, esc(t.s[1])], e: [`<bdi dir="ltr">${esc(t.e[0])}</bdi>`, esc(t.e[1])],
  }))
}

const PLAN_TXT = {
  es: {
    base: { osaka: 'Osaka', kioto: 'Kioto' },
    int: { templos: 'Templos y cultura', comida: 'Comida y barrios', naturaleza: 'Naturaleza y montaña', ninos: 'Viajamos con niños', halal: 'Halal y mezquitas', fotos: 'Fotos' },
    nombre: { kioto: 'Kioto', nara: 'Nara', osaka: 'Osaka', arashiyama: 'Arashiyama', uji: 'Uji', kobe: 'Kobe', himeji: 'Himeji', hiroshima: 'Hiroshima y Miyajima', koyasan: 'Kōyasan', montana: 'montaña' },
    libre: {
      osaka: ['Osaka por libre'], arashiyama: ['Arashiyama por libre', 'El bosque de bambú, el templo Tenryū-ji y el puente Togetsukyō sobre el río. Ve temprano, antes de que llegue la gente.'],
      uji: ['Uji por libre', 'El templo Byōdō-in, el de la moneda de 10 yenes, y las casas de té matcha junto al río.'], kobe: ['Kobe por libre'], himeji: ['Himeji por libre'],
    },
    porque: {
      kioto: 'Con guía: es el día más difícil de organizar (autobuses llenos y colas) y te deja preparado para moverte solo el resto del viaje.',
      nara: 'Con guía, medio día: una mañana bien aprovechada y la tarde libre para ti.',
      osakaG: 'Con guía: se come puesto a puesto y te digo qué lleva cada cosa.', osakaL: 'Por libre: se recorre fácil a pie y en metro.',
      arashiyama: 'Por libre: tren directo y se recorre andando.', uji: 'Por libre: tren directo desde Kioto y un pueblo pequeño.',
      kobeG: 'Con guía: la mezquita con respeto, fuera de las horas de oración, y dónde comer wagyu con certificado halal.', kobeL: 'Por libre: tren directo y una ciudad pequeña.',
      himejiG: 'Con guía: el castillo planta por planta y el monte Shosha en el mismo día.', himejiL: 'Por libre: tren directo, sin transbordos.',
      hiroshima: 'Con guía: shinkansen, tren o tranvía, ferry y mareas en un solo día. Hiroshima y Miyajima, siempre juntos.',
      koyasan: 'Con guía: tren, funicular y autobús resueltos, y cada templo con su historia.', montana: 'Con guía: ruta, horarios de bajada y transporte resueltos.',
    },
    koyasan: ['Kōyasan', 'El monte sagrado del budismo shingon: templos entre cedros y el cementerio de Okunoin. Se sale temprano: son casi dos horas de tren y funicular desde Namba.'],
    montana: ['Montaña con guía', 'Un día de senderismo cerca de Kioto, Osaka o Kobe: Atago, Hiei, Rokko, Kongo…', 'Trenes y autobuses según la ruta, aparte.'],
    tarde: { osaka: 'Por la tarde, libre: Dōtonbori al anochecer.', kioto: 'Por la tarde, libre en Kioto.' },
    enlaceRuta: 'Ver el día hora a hora', enlaceLejos: 'Ver las excursiones lejanas', enlaceMonte: 'Ver las rutas de montaña',
  },
  en: {
    base: { osaka: 'Osaka', kioto: 'Kyoto' },
    int: { templos: 'Temples and culture', comida: 'Food and neighbourhoods', naturaleza: 'Nature and mountains', ninos: 'Travelling with children', halal: 'Halal and mosques', fotos: 'Photos' },
    nombre: { kioto: 'Kyoto', nara: 'Nara', osaka: 'Osaka', arashiyama: 'Arashiyama', uji: 'Uji', kobe: 'Kobe', himeji: 'Himeji', hiroshima: 'Hiroshima and Miyajima', koyasan: 'Kōyasan', montana: 'hiking' },
    libre: {
      osaka: ['Osaka on your own'], arashiyama: ['Arashiyama on your own', 'The bamboo grove, Tenryū-ji temple and the Togetsukyō bridge over the river. Go early, before the crowds.'],
      uji: ['Uji on your own', 'Byōdō-in temple, the one on the 10-yen coin, and matcha tea houses by the river.'], kobe: ['Kobe on your own'], himeji: ['Himeji on your own'],
    },
    porque: {
      kioto: 'With a guide: it is the hardest day to organise (crowded buses and queues) and it sets you up to get around alone for the rest of the trip.',
      nara: 'Half day with a guide: a well-used morning and the afternoon to yourself.',
      osakaG: 'With a guide: you eat stall by stall and I tell you what is in each dish.', osakaL: 'On your own: easy on foot and by metro.',
      arashiyama: 'On your own: a direct train and it is all walkable.', uji: 'On your own: a direct train from Kyoto and a small town.',
      kobeG: 'With a guide: the mosque visited respectfully, outside prayer times, and where to eat halal-certified wagyu.', kobeL: 'On your own: a direct train and a compact city.',
      himejiG: 'With a guide: the castle floor by floor and Mount Shosha on the same day.', himejiL: 'On your own: a direct train, no changes.',
      hiroshima: 'With a guide: shinkansen, train or tram, ferry and tides in one day. Hiroshima and Miyajima always together.',
      koyasan: 'With a guide: train, cable car and bus sorted, and each temple with its story.', montana: 'With a guide: trail, descent times and transport sorted.',
    },
    koyasan: ['Kōyasan', 'The sacred mountain of Shingon Buddhism: temples among cedars and the Okunoin cemetery. An early start: almost two hours by train and cable car from Namba.'],
    montana: ['Guided hiking', 'A hiking day near Kyoto, Osaka or Kobe: Atago, Hiei, Rokko, Kongo…', 'Trains and buses depend on the trail, paid separately.'],
    tarde: { osaka: 'Afternoon free: Dōtonbori as night falls.', kioto: 'Afternoon free in Kyoto.' },
    enlaceRuta: 'See the day hour by hour', enlaceLejos: 'See the long day trips', enlaceMonte: 'See the hiking routes',
  },
  ar: {
    base: { osaka: 'أوساكا', kioto: 'كيوتو' },
    int: { templos: 'المعابد والثقافة', comida: 'الطعام والأحياء', naturaleza: 'الطبيعة والجبال', ninos: 'نسافر مع أطفال', halal: 'الحلال والمساجد', fotos: 'التصوير' },
    nombre: { kioto: 'كيوتو', nara: 'نارا', osaka: 'أوساكا', arashiyama: 'أراشيياما', uji: 'أوجي', kobe: 'كوبي', himeji: 'هيميجي', hiroshima: 'هيروشيما وميياجيما', koyasan: 'كوياسان', montana: 'الجبل' },
    libre: {
      osaka: ['أوساكا على راحتكم'], arashiyama: ['أراشيياما على راحتكم', 'غابة الخيزران ومعبد تينريو-جي وجسر توغيتسوكيو فوق النهر. اذهبوا باكراً قبل الزحام.'],
      uji: ['أوجي على راحتكم', 'معبد بيودو-إن المرسوم على قطعة العشرة ين، وبيوت شاي الماتشا على ضفة النهر.'], kobe: ['كوبي على راحتكم'], himeji: ['هيميجي على راحتكم'],
    },
    porque: {
      kioto: 'مع مرشد: هو أصعب يوم في التنظيم (حافلات مزدحمة وطوابير)، ويجهّزكم للتنقل وحدكم بقية الرحلة.',
      nara: 'نصف يوم مع مرشد: صباح مستثمر جيداً، وبعد الظهر لكم.',
      osakaG: 'مع مرشد: نأكل من كشك إلى كشك، وأخبركم بمكوّنات كل طبق.', osakaL: 'على راحتكم: التنقل سهل مشياً وبالمترو.',
      arashiyama: 'على راحتكم: قطار مباشر وكل شيء قريب مشياً.', uji: 'على راحتكم: قطار مباشر من كيوتو وبلدة صغيرة.',
      kobeG: 'مع مرشد: زيارة المسجد باحترام خارج أوقات الصلاة، وأين تأكلون لحم الواغيو بشهادة حلال.', kobeL: 'على راحتكم: قطار مباشر ومدينة صغيرة.',
      himejiG: 'مع مرشد: القلعة طابقاً طابقاً وجبل شوشا في اليوم نفسه.', himejiL: 'على راحتكم: قطار مباشر من دون تبديل.',
      hiroshima: 'مع مرشد: الشينكانسن والقطار أو الترام والعبّارة والمدّ والجزر في يوم واحد. هيروشيما وميياجيما معاً دائماً.',
      koyasan: 'مع مرشد: القطار والقطار الجبلي والحافلة محسومة، ولكل معبد قصته.', montana: 'مع مرشد: المسار ومواعيد النزول والمواصلات محسومة.',
    },
    koyasan: ['كوياسان', 'الجبل المقدّس للبوذية الشينغونية: معابد بين أشجار الأرز ومقبرة أوكونوين. نخرج باكراً، فالطريق نحو ساعتين بالقطار والقطار الجبلي من نامبا.'],
    montana: ['مشي جبلي مع مرشد', 'يوم مشي جبلي قرب كيوتو أو أوساكا أو كوبي: أتاغو، هيي، روكو، كونغو…', 'القطارات والحافلات حسب المسار، وتُدفع على حدة.'],
    tarde: { osaka: 'بعد الظهر حرّ: دوتونبوري مع حلول المساء.', kioto: 'بعد الظهر حرّ في كيوتو.' },
    enlaceRuta: 'شاهد اليوم ساعةً بساعة', enlaceLejos: 'شاهد الرحلات البعيدة', enlaceMonte: 'شاهد مسارات الجبال',
  },
}

// Bloques del planificador ya en HTML de cada idioma, con los textos reales de la web.
function bloquesLang(lang) {
  const P = PLAN_TXT[lang]
  const It = ITINERARIOS[lang]
  const Tx = TEXTOS[lang]
  const ruta = (id) => [tx(P.enlaceRuta, lang), `${RUTA.rutas[lang]}#${id}`]
  const v = (titulo, texto, porque) => ({ titulo: tx(titulo, lang), texto: tx(texto, lang), porque: tx(porque, lang), plano: titulo })
  for (const id of Object.values(ITIN_DE)) if (!It[id]) throw new Error(`herramientas-viaje: falta el itinerario «${id}» (${lang})`)
  // La tarde libre de Nara depende de dónde duermes: el texto lo pone el motor por base.
  const naraTexto = Tx.nara.opciones[0].texto
  const B = {
    kioto: { guia: v(It.kioto.titulo, It.kioto.resumen, P.porque.kioto), enlace: ruta('kioto'), comer: tx(It.kioto.comer, lang) },
    nara: { guia: v(It.nara.titulo, naraTexto, P.porque.nara), enlace: ruta('nara'), comer: tx(It.nara.comer, lang) },
    osaka: { guia: v(It.osaka.titulo, It.osaka.resumen, P.porque.osakaG), libre: v(P.libre.osaka[0], Tx.osaka.opciones[1].texto, P.porque.osakaL), enlace: ruta('osaka'), comer: tx(It.osaka.comer, lang) },
    arashiyama: { libre: v(P.libre.arashiyama[0], P.libre.arashiyama[1], P.porque.arashiyama) },
    uji: { libre: v(P.libre.uji[0], P.libre.uji[1], P.porque.uji) },
    kobe: { guia: v(It.kobe.titulo, Tx.kobe.opciones[0].texto, P.porque.kobeG), libre: v(P.libre.kobe[0], Tx.kobe.opciones[0].texto, P.porque.kobeL), enlace: ruta('kobe'), comer: tx(It.kobe.comer, lang) },
    himeji: { guia: v(It.himeji.titulo, It.himeji.resumen, P.porque.himejiG), libre: v(P.libre.himeji[0], Tx.himeji.opciones[0].texto, P.porque.himejiL), enlace: ruta('himeji'), comer: tx(It.himeji.comer, lang) },
    hiroshima: { guia: v(It.hiroshima.titulo, It.hiroshima.resumen, P.porque.hiroshima), enlace: ruta('hiroshima'), comer: tx(It.hiroshima.comer, lang) },
    koyasan: { guia: v(P.koyasan[0], P.koyasan[1], P.porque.koyasan), enlace: [tx(P.enlaceLejos, lang), `${RUTA.precios[lang]}#tarifa-lejos`] },
    montana: { guia: v(P.montana[0], P.montana[1], P.porque.montana), enlace: [tx(P.enlaceMonte, lang), RUTA.montana[lang]], trenTxt: tx(P.montana[2], lang) },
  }
  for (const [id, k] of Object.entries(B)) {
    if (!k.guia) k.guia = k.libre
    if (!k.libre) k.libre = k.guia
    if (!META_PLAN[id] && id !== 'kioto') throw new Error(`herramientas-viaje: bloque «${id}» sin META_PLAN`)
  }
  return B
}

function datosMotor(lang) {
  const tramos = tramosLang(lang)
  const bloques = bloquesLang(lang)
  return {
    lang, tramos, origenes: ORIGENES,
    lugares: Object.fromEntries(Object.keys(LUGARES).map((k) => [k, tx(nombreCorto(k, lang), lang)])),
    meta: META_PLAN, cerca: CERCA, trenes: TRENES_PLAN, bloques,
    precio: { completo: PRECIO.completo, medio: PRECIO.medio, lejos: PRECIO.lejos, monte: MONTE_MIN, corto: PRECIO_CORTO },
    desde: { lejos: true, monte: PRECIOS_MONTE.length > 1 },
    baseNombre: PLAN_TXT[lang].base, intNombre: PLAN_TXT[lang].int, wa: WA_TONY,
  }
}

// La tarde libre del día de Nara cambia con la base: se añade al texto aquí.
function conTardeNara(D, lang, base) {
  const P = PLAN_TXT[lang]
  const nara = D.bloques.nara
  const tarde = tx(P.tarde[base], lang)
  return { ...D, bloques: { ...D.bloques, nara: { ...nara, guia: { ...nara.guia, texto: `${nara.guia.texto} ${tarde}` } } } }
}

// ═════════════════════════════════════════════════════════════════════════════
// Página 1: trenes
// ═════════════════════════════════════════════════════════════════════════════
const TR = {
  es: {
    title: 'Trenes de Kansai: tiempos y precios entre Osaka, Kioto y Nara (2026) | Tony Kansai Guide',
    desc: 'Tiempos y tarifas de tren entre Osaka, Kioto, Nara, Kobe, Himeji, Hiroshima, Kōyasan y el aeropuerto de Kansai, con ICOCA y JR Pass. Comprobado el 16-11-2026.',
    nombre: 'Trenes de Kansai: tiempos y precios',
    ceja: `Herramienta gratis · comprobado el <bdi dir="ltr">${FECHA.es}</bdi>`,
    h1: (p) => `Osaka–Kioto en tren: ${p.jrMin} y ${p.jrYen} con JR, o ${p.hkYen} con Hankyu`,
    lead: (p) => `Elige de dónde sales y adónde vas, y te salen todos los trenes que te sirven: línea, estación de salida y de llegada, minutos, tarifa de adulto, si vale la ICOCA y si entra en el JR Pass. Son ${p.n} trayectos entre Osaka, Kioto, Nara, Kobe, Himeji, Hiroshima, Uji, Fushimi Inari, Arashiyama, Kōyasan y el aeropuerto de Kansai, comprobados uno a uno el ${FECHA.es}. Lo más barato de Osaka a Kioto es el Hankyu (${p.hkYen}); lo más rápido, el shinkansen desde Shin-Osaka (${p.skMin}).`,
    datos: (p) => [['Osaka → Kioto, lo más barato', `Hankyu · ${p.hkYen}`], ['Shin-Osaka → Kioto, lo más rápido', `Shinkansen · ≈ ${p.skMin}`], ['Aeropuerto → Kioto sin cambiar', `Haruka · ≈ ${p.hkxMin}`], ['Namba → Nara', `Kintetsu · ${p.naraYen}`]],
    secs: { buscador: 'Buscador', tabla: 'Todos los trayectos', icoca: 'ICOCA', jrpass: 'JR Pass', dormir: 'Dónde duermes', preguntas: 'Preguntas' },
    buscH: 'Busca tu trayecto', de: 'Salgo de', a: 'Voy a', cambiar: 'Cambiar el sentido',
    buscNota: `Tarifa de adulto con billete normal, comprobada el ${FECHA.es}. El tiempo es el de un tren concreto de un martes a las 10:00: según la hora cambia unos minutos.`,
    tablaH: 'Todos los trayectos, en una tabla', tablaP: 'Lo mismo que el buscador, para leerlo de un vistazo. En el móvil, desliza la tabla de lado.',
    cols: ['Tren', 'Sale → llega', 'Tiempo', 'Adulto', 'ICOCA', 'JR Pass', 'Fuente'],
    icCorto: { si: 'Sí', base: 'Solo tarifa', no: 'No*', consulta: 'Consulta' }, jrCorto: { si: 'Sí', no: 'No', nozomi: 'Nozomi: billete especial', consulta: 'Consulta', parcial: 'Solo JR' },
    tablaNota: '* En el shinkansen, la ICOCA no vale con saldo; sí registrándola en smartEX y reservando. «Solo tarifa»: la tarjeta paga la tarifa y el billete de limited express se compra aparte. «Consulta»: no lo he podido confirmar en una fuente oficial.',
    icH: 'ICOCA: la tarjeta que sirve para casi todo',
    icP: [
      'La ICOCA es la tarjeta de transporte de JR West. Se recarga en las máquinas de las estaciones y con ella pasas el torniquete sin comprar billete en JR, Hankyu, Hanshin, Keihan, Kintetsu, Nankai y el metro de Osaka. La Suica de Tokio también sirve aquí.',
      'Lo que no hace: pagar el shinkansen con saldo (ahí necesitas billete, o reservar en smartEX con la tarjeta registrada). En el Haruka, el rapi:t y los limited express de Kintetsu, la tarjeta paga la tarifa, pero el billete de limited express se compra aparte.',
      'En el tranvía Randen de Arashiyama, el funicular de Kōyasan y el autobús del aeropuerto no lo he podido confirmar en una fuente oficial: pregunta en la estación antes de subir.',
    ],
    jrH: 'Cuándo no compensa el JR Pass en Kansai',
    jrP: (p) => [
      `El JR Pass nacional solo vale en trenes de JR. Hankyu, Hanshin, Keihan, Kintetsu y Nankai son otras compañías, y muchas veces son los mejores trenes de Kansai: el Hankyu es el más barato a Kioto y el Kintetsu el que te deja junto al parque de Nara. Además, aquí los trayectos son cortos y baratos: Osaka–Kioto ${p.jr}, Osaka–Nara ${p.nara}, Kioto–Nara ${p.kn}, Osaka–Himeji ${p.hm}.`,
      'Si solo te mueves por Kansai, suma tus trenes con la tabla y compáralo con el precio actual del pase en su web oficial (japanrailpass.net): lo normal es que el pase salga más caro. Empieza a compensar cuando el mismo pase cubre trayectos largos de shinkansen, como Tokio o Hiroshima; y recuerda que el Nozomi solo entra con un billete especial aparte.',
      `Para Kansai existe el WEST QR Kansai Area Pass de JR West. Según su web oficial cuesta ${p.d1} un día, ${p.d2} dos, ${p.d3} tres y ${p.d4} cuatro (adulto); solo lo venden agencias fuera de Japón y solo para turistas con estancia temporal. Cubre los trenes rápidos y locales de JR de su zona y el Haruka en asiento sin reserva; el shinkansen, no.`,
    ],
    puntaH: 'Horas punta',
    puntaP: 'Evita, si puedes, los trenes de los días laborables más o menos de 7:30 a 9:00: van llenos y con maleta se sufre. A la vuelta del trabajo, al final de la tarde, también se llenan. Si quieres ir sentado seguro, mira el coche Premium de Keihan, el A-Seat de JR o un asiento reservado en el shinkansen: todos llevan suplemento.',
    dormirH: 'Qué tren te conviene según dónde duermes',
    dormir: [
      ['Umeda (estación de Osaka)', 'JR para Kioto, Kobe, Himeji y Nara; Hankyu para el centro de Kioto, Arashiyama y Kobe; Hanshin para Kobe. El Keihan sale de Yodoyabashi, a 2 minutos en metro.'],
      ['Namba', 'Kintetsu directo a Nara, Nankai al aeropuerto y a Kōyasan, y Hanshin a Kobe. Para Kioto, metro Midōsuji hasta Umeda o hasta Yodoyabashi.'],
      ['Shin-Osaka', 'El shinkansen a Kioto, Himeji e Hiroshima, y el Haruka al aeropuerto.'],
      ['Estación de Kioto', 'JR a Nara, Fushimi Inari, Uji y Arashiyama, y el Haruka al aeropuerto. El Kintetsu a Nara sale de la misma estación.'],
      ['Gion o Kawaramachi (Kioto)', 'Keihan a Fushimi Inari, Uji y Osaka; Hankyu a Osaka y a Arashiyama.'],
    ],
    tonyH: 'O vamos juntos en tren',
    tonyP: (p) => `Si prefieres no pensar en trenes, te recojo en el vestíbulo de tu hotel en Osaka o en Kioto y nos movemos juntos: te enseño a usar la ICOCA y los trenes, y el resto del viaje vas solo. Soy Tony, guía privado en español, inglés y árabe, y el día es solo para tu grupo. Precio por grupo de hasta 6: 2 horas en Kioto ${p.corto}, medio día ${p.medio}, día completo ${p.completo} y excursión lejana desde ${p.lejos}. Trenes, entradas y comidas los pagáis vosotros en el momento; yo os digo cómo y dónde.`,
    tonyB: 'Ver precios y rutas',
    faq: (p) => [
      ['¿Cuánto cuesta el tren de Osaka a Kioto?', `Por adulto: Hankyu de Osaka-umeda a Kyoto-kawaramachi ${p.hk} (≈ ${p.hkMin}); Keihan de Yodoyabashi a Gion-shijō ${p.kh} (≈ ${p.khMin}); JR de Osaka a Kioto ${p.jr} (≈ ${p.jrMin}). El shinkansen desde Shin-Osaka cuesta ${p.sk} con asiento sin reserva y tarda ≈ ${p.skMin}.`],
      ['¿Cómo voy del aeropuerto de Kansai a Kioto?', `Sin cambiar de tren, en el Haruka: ${p.hkx}, ≈ ${p.hkxMin}. Con un cambio en Osaka y sin suplemento, ${p.kxjr} y ≈ ${p.kxjrMin}. En el autobús Airport Limousine, ${p.bus} y ≈ ${p.busMin}, según el tráfico.`],
      ['¿Y del aeropuerto a Namba?', `Con el Nankai Airport Express, ${p.nk} y ≈ ${p.nkMin}. Con el rapi:t, ${p.rp} con el billete de limited express incluido y asiento reservado.`],
      ['¿Cuál es la forma más rápida de ir a Nara?', `Desde Namba, el Kintetsu: ≈ ${p.knMin} y ${p.knYen}, y te deja junto al parque. Desde la estación de Osaka, el JR Yamatoji Rapid: ≈ ${p.jnMin} y ${p.nara}. Desde Kioto, el limited express de Kintetsu: ≈ ${p.kleMin} y ${p.kle}.`],
      ['¿Puedo usar ICOCA o Suica en todos los trenes?', 'En JR, Hankyu, Hanshin, Keihan, Kintetsu, Nankai y el metro de Osaka, sí. En el shinkansen no con saldo: necesitas billete, o reservar en smartEX con la tarjeta registrada. En el Haruka y el rapi:t, el billete de limited express va aparte.'],
      ['¿Me compensa el JR Pass para Kansai?', 'Casi nunca si solo te mueves por Kansai: los trenes son baratos y los mejores muchas veces no son de JR. Suma tus trayectos con la tabla y compáralo con el precio del pase en japanrailpass.net.'],
      ['¿Cómo se llega a Kōyasan?', `Desde Namba, con el Nankai de la línea Kōya hasta Gokurakubashi y el funicular hasta Kōyasan: ${p.ky} y ≈ ${p.kyMin}. Con el limited express Kōya, ${p.kyle}. Desde la estación, un autobús sube al pueblo.`],
      ['¿Me recoges en el aeropuerto?', 'No: soy guía de día y no hago traslados al aeropuerto. Te recojo en el vestíbulo de tu hotel en Osaka o en Kioto el día del tour.'],
    ],
    fuentesP: `Tarifas y tiempos: buscador de trayectos Jorudan, consultado el ${FECHA.es} para cada trayecto, con un tren de referencia del martes 17-11-2026 a las 10:00 (cada fila de la tabla enlaza su búsqueda). Normas de ICOCA, JR Pass y pases: webs oficiales.`,
    ctaH: 'Dime fechas y dónde duermes', ctaP: 'Te contesto yo, Tony, con la ruta del día y el precio cerrado del guía.', ctaB: 'Escribir por WhatsApp',
    msg: 'Hola, Tony. Vengo de la página de trenes de Kansai.',
  },
  en: {
    title: 'Kansai trains: times and fares between Osaka, Kyoto and Nara (2026) | Tony Kansai Guide',
    desc: 'Train times and fares between Osaka, Kyoto, Nara, Kobe, Himeji, Hiroshima, Kōyasan and Kansai Airport, with ICOCA and JR Pass notes. Checked 16 Nov 2026.',
    nombre: 'Kansai trains: times and fares',
    ceja: `Free tool · checked <bdi dir="ltr">${FECHA.en}</bdi>`,
    h1: (p) => `Osaka to Kyoto by train: ${p.jrMin} and ${p.jrYen} on JR, or ${p.hkYen} on Hankyu`,
    lead: (p) => `Choose where you leave from and where you are going, and you get every train that works: line, departure and arrival station, minutes, adult fare, whether ICOCA works and whether the JR Pass covers it. There are ${p.n} routes between Osaka, Kyoto, Nara, Kobe, Himeji, Hiroshima, Uji, Fushimi Inari, Arashiyama, Kōyasan and Kansai Airport, each checked on ${FECHA.en}. The cheapest from Osaka to Kyoto is Hankyu (${p.hkYen}); the fastest is the shinkansen from Shin-Osaka (${p.skMin}).`,
    datos: (p) => [['Osaka → Kyoto, cheapest', `Hankyu · ${p.hkYen}`], ['Shin-Osaka → Kyoto, fastest', `Shinkansen · ≈ ${p.skMin}`], ['Airport → Kyoto, no change', `Haruka · ≈ ${p.hkxMin}`], ['Namba → Nara', `Kintetsu · ${p.naraYen}`]],
    secs: { buscador: 'Route finder', tabla: 'All routes', icoca: 'ICOCA', jrpass: 'JR Pass', dormir: 'Where you stay', preguntas: 'Questions' },
    buscH: 'Find your route', de: 'From', a: 'To', cambiar: 'Swap direction',
    buscNota: `Adult fare, regular ticket, checked ${FECHA.en}. The time is that of one specific train on a Tuesday at 10:00; it varies by a few minutes with the time of day.`,
    tablaH: 'All routes in one table', tablaP: 'The same as the route finder, at a glance. On a phone, swipe the table sideways.',
    cols: ['Train', 'From → to', 'Time', 'Adult', 'ICOCA', 'JR Pass', 'Source'],
    icCorto: { si: 'Yes', base: 'Fare only', no: 'No*', consulta: 'Ask' }, jrCorto: { si: 'Yes', no: 'No', nozomi: 'Nozomi: special ticket', consulta: 'Ask', parcial: 'JR part only' },
    tablaNota: '* On the shinkansen ICOCA does not work with stored value; it does if registered on smartEX with a booking. “Fare only”: the card pays the fare and the limited express ticket is bought separately. “Ask”: I could not confirm it in an official source.',
    icH: 'ICOCA: the card that works almost everywhere',
    icP: [
      'ICOCA is JR West’s transport card. You top it up at station machines and tap through the gates without buying a ticket on JR, Hankyu, Hanshin, Keihan, Kintetsu, Nankai and the Osaka Metro. Tokyo’s Suica works here too.',
      'What it does not do: pay for the shinkansen with stored value (you need a ticket, or a smartEX booking with your registered card). On the Haruka, the rapi:t and Kintetsu limited expresses, the card pays the fare but the limited express ticket is bought separately.',
      'On the Randen tram to Arashiyama, the Kōyasan cable car and the airport bus I could not confirm it in an official source: ask at the station before boarding.',
    ],
    jrH: 'When the JR Pass is not worth it in Kansai',
    jrP: (p) => [
      `The nationwide JR Pass only works on JR trains. Hankyu, Hanshin, Keihan, Kintetsu and Nankai are other companies, and they are often the best trains in Kansai: Hankyu is the cheapest to Kyoto and Kintetsu drops you next to Nara Park. And trips here are short and cheap: Osaka–Kyoto ${p.jr}, Osaka–Nara ${p.nara}, Kyoto–Nara ${p.kn}, Osaka–Himeji ${p.hm}.`,
      'If you only travel within Kansai, add up your trains with the table and compare with the current pass price on its official site (japanrailpass.net): the pass usually comes out more expensive. It starts to pay off when the same pass covers long shinkansen trips such as Tokyo or Hiroshima; and remember the Nozomi needs a separate special ticket.',
      `For Kansai there is JR West’s WEST QR Kansai Area Pass. According to its official site it costs ${p.d1} for one day, ${p.d2} for two, ${p.d3} for three and ${p.d4} for four (adult); it is only sold by travel agencies outside Japan and only to temporary visitors. It covers JR rapid and local trains in its area and the Haruka in non-reserved seats; not the shinkansen.`,
    ],
    puntaH: 'Rush hour',
    puntaP: 'If you can, avoid weekday trains roughly from 7:30 to 9:00: they are packed and luggage makes it miserable. They also fill up in the early evening when people head home. If you want a guaranteed seat, look at Keihan’s Premium Car, JR’s A-Seat or a reserved seat on the shinkansen: they all cost extra.',
    dormirH: 'Which train suits where you stay',
    dormir: [
      ['Umeda (Osaka Station)', 'JR to Kyoto, Kobe, Himeji and Nara; Hankyu to central Kyoto, Arashiyama and Kobe; Hanshin to Kobe. Keihan leaves from Yodoyabashi, 2 minutes away by subway.'],
      ['Namba', 'Kintetsu direct to Nara, Nankai to the airport and Kōyasan, and Hanshin to Kobe. For Kyoto, the Midōsuji subway to Umeda or Yodoyabashi.'],
      ['Shin-Osaka', 'The shinkansen to Kyoto, Himeji and Hiroshima, and the Haruka to the airport.'],
      ['Kyoto Station', 'JR to Nara, Fushimi Inari, Uji and Arashiyama, and the Haruka to the airport. The Kintetsu to Nara leaves from the same station.'],
      ['Gion or Kawaramachi (Kyoto)', 'Keihan to Fushimi Inari, Uji and Osaka; Hankyu to Osaka and Arashiyama.'],
    ],
    tonyH: 'Or we take the train together',
    tonyP: (p) => `If you would rather not think about trains, I meet you in your hotel lobby in Osaka or Kyoto and we travel together: I show you how to use ICOCA and the trains, and for the rest of the trip you get around on your own. I am Tony, a private guide in English, Spanish and Arabic, and the day is just for your group. Price per group of up to 6: 2 hours in Kyoto ${p.corto}, half day ${p.medio}, full day ${p.completo} and long day trips from ${p.lejos}. You pay for trains, tickets and meals on the day; I tell you how and where.`,
    tonyB: 'See prices and routes',
    faq: (p) => [
      ['How much is the train from Osaka to Kyoto?', `Per adult: Hankyu from Osaka-umeda to Kyoto-kawaramachi ${p.hk} (≈ ${p.hkMin}); Keihan from Yodoyabashi to Gion-shijō ${p.kh} (≈ ${p.khMin}); JR from Osaka to Kyoto ${p.jr} (≈ ${p.jrMin}). The shinkansen from Shin-Osaka costs ${p.sk} in a non-reserved seat and takes ≈ ${p.skMin}.`],
      ['How do I get from Kansai Airport to Kyoto?', `Without changing trains, on the Haruka: ${p.hkx}, ≈ ${p.hkxMin}. With one change at Osaka and no supplement, ${p.kxjr} and ≈ ${p.kxjrMin}. On the Airport Limousine Bus, ${p.bus} and ≈ ${p.busMin}, depending on traffic.`],
      ['And from the airport to Namba?', `On the Nankai Airport Express, ${p.nk} and ≈ ${p.nkMin}. On the rapi:t, ${p.rp} including the limited express ticket, with a reserved seat.`],
      ['What is the fastest way to Nara?', `From Namba, Kintetsu: ≈ ${p.knMin} and ${p.knYen}, and it drops you by the park. From Osaka Station, the JR Yamatoji Rapid: ≈ ${p.jnMin} and ${p.nara}. From Kyoto, the Kintetsu limited express: ≈ ${p.kleMin} and ${p.kle}.`],
      ['Can I use ICOCA or Suica on every train?', 'On JR, Hankyu, Hanshin, Keihan, Kintetsu, Nankai and the Osaka Metro, yes. Not with stored value on the shinkansen: you need a ticket, or a smartEX booking with your registered card. On the Haruka and the rapi:t, the limited express ticket is separate.'],
      ['Is the JR Pass worth it for Kansai?', 'Rarely, if you only travel within Kansai: trains are cheap and the best ones are often not JR. Add up your trips with the table and compare with the pass price on japanrailpass.net.'],
      ['How do I get to Kōyasan?', `From Namba, the Nankai Kōya Line to Gokurakubashi and the cable car up to Kōyasan: ${p.ky} and ≈ ${p.kyMin}. On the Kōya limited express, ${p.kyle}. From the station a bus goes up to the town.`],
      ['Do you pick us up at the airport?', 'No: I am a day guide and I do not do airport transfers. I meet you in your hotel lobby in Osaka or Kyoto on the day of the tour.'],
    ],
    fuentesP: `Fares and times: the Jorudan route finder, checked on ${FECHA.en} for each route, using a reference train on Tuesday 17 Nov 2026 at 10:00 (each table row links to its search). ICOCA, JR Pass and pass rules: official websites.`,
    ctaH: 'Tell me your dates and where you stay', ctaP: 'I, Tony, reply with the day’s route and one fixed guide price.', ctaB: 'Message on WhatsApp',
    msg: 'Hi Tony, I’m coming from the Kansai trains page.',
  },
  ar: {
    title: 'قطارات كانساي: الأوقات والأسعار بين أوساكا وكيوتو ونارا (2026) | Tony Kansai Guide',
    desc: 'أوقات وأسعار القطارات بين أوساكا وكيوتو ونارا وكوبي وهيميجي وهيروشيما وكوياسان ومطار كانساي، مع ICOCA وJR Pass. راجعتها في 16-11-2026.',
    nombre: 'قطارات كانساي: الأوقات والأسعار',
    ceja: `أداة مجانية · تمت المراجعة في <bdi dir="ltr">${FECHA.ar}</bdi>`,
    h1: (p) => `من أوساكا إلى كيوتو بالقطار: ${p.jrMin} و${p.jrYen} مع JR، أو ${p.hkYen} مع هانكيو`,
    lead: (p) => `اختر من أين تنطلق وإلى أين تذهب، فتظهر لك كل القطارات المناسبة: الخط، ومحطة الانطلاق والوصول، والدقائق، وأجرة البالغ، وهل تعمل بطاقة ICOCA، وهل يشمله JR Pass. هنا ${p.n} رحلة بين أوساكا وكيوتو ونارا وكوبي وهيميجي وهيروشيما وأوجي وفوشيمي إيناري وأراشيياما وكوياسان ومطار كانساي، راجعتها واحدةً واحدة في ${p.fecha}. الأرخص من أوساكا إلى كيوتو هو هانكيو (${p.hkYen})، والأسرع هو الشينكانسن من شين أوساكا (${p.skMin}).`,
    datos: (p) => [['أوساكا ← كيوتو، الأرخص', `هانكيو · ${p.hkYen}`], ['شين أوساكا ← كيوتو، الأسرع', `الشينكانسن · ≈ ${p.skMin}`], ['المطار ← كيوتو بلا تبديل', `Haruka · ≈ ${p.hkxMin}`], ['نامبا ← نارا', `كينتيتسو · ${p.naraYen}`]],
    secs: { buscador: 'البحث', tabla: 'كل الرحلات', icoca: 'ICOCA', jrpass: 'JR Pass', dormir: 'مكان إقامتك', preguntas: 'أسئلة' },
    buscH: 'ابحث عن رحلتك', de: 'أنطلق من', a: 'أذهب إلى', cambiar: 'اعكس الاتجاه',
    buscNota: `أجرة البالغ بتذكرة عادية، راجعتها في <bdi dir="ltr">${FECHA.ar}</bdi>. الوقت هو وقت قطار محدد يوم ثلاثاء الساعة <bdi dir="ltr">10:00</bdi>، ويختلف ببضع دقائق حسب الساعة.`,
    tablaH: 'كل الرحلات في جدول واحد', tablaP: 'المعلومات نفسها التي في البحث، لتقرأها بنظرة واحدة. على الهاتف اسحب الجدول جانباً.',
    cols: ['القطار', 'من ← إلى', 'الوقت', 'البالغ', 'ICOCA', 'JR Pass', 'المصدر'],
    icCorto: { si: 'نعم', base: 'الأجرة فقط', no: 'لا*', consulta: 'اسأل' }, jrCorto: { si: 'نعم', no: 'لا', nozomi: 'Nozomi: تذكرة خاصة', consulta: 'اسأل', parcial: 'جزء JR فقط' },
    tablaNota: '* في الشينكانسن لا تعمل ICOCA بالرصيد، وتعمل إذا سجّلتها في smartEX مع حجز. «الأجرة فقط»: البطاقة تدفع الأجرة، وتذكرة Limited Express تُشترى على حدة. «اسأل»: لم أستطع تأكيده من مصدر رسمي.',
    icH: 'بطاقة ICOCA: تنفع في كل مكان تقريباً',
    icP: [
      'بطاقة ICOCA هي بطاقة المواصلات من JR West. تُشحن من أجهزة المحطات، وتعبر بها البوابات من دون شراء تذكرة في JR وهانكيو وهانشين وكيهان وكينتيتسو ونانكاي ومترو أوساكا. وبطاقة Suica من طوكيو تعمل هنا أيضاً.',
      'ما لا تفعله: دفع الشينكانسن بالرصيد (تحتاج تذكرة، أو حجزاً في smartEX ببطاقة مسجّلة). وفي Haruka وrapi:t وقطارات Limited Express من كينتيتسو، تدفع البطاقة الأجرة، أما تذكرة Limited Express فتُشترى على حدة.',
      'في ترام Randen إلى أراشيياما، والقطار الجبلي في كوياسان، وحافلة المطار، لم أستطع تأكيد ذلك من مصدر رسمي: اسأل في المحطة قبل الركوب.',
    ],
    jrH: 'متى لا يستحق JR Pass في كانساي',
    jrP: (p) => [
      `بطاقة JR Pass الوطنية تعمل في قطارات JR فقط. أما هانكيو وهانشين وكيهان وكينتيتسو ونانكاي فشركات أخرى، وكثيراً ما تكون أفضل قطارات كانساي: هانكيو الأرخص إلى كيوتو، وكينتيتسو يوصلك بجوار حديقة نارا. ثم إن الرحلات هنا قصيرة ورخيصة: أوساكا–كيوتو ${p.jr}، أوساكا–نارا ${p.nara}، كيوتو–نارا ${p.kn}، أوساكا–هيميجي ${p.hm}.`,
      'إن كان تنقلك داخل كانساي فقط، فاجمع أسعار قطاراتك من الجدول وقارنها بالسعر الحالي للبطاقة في موقعها الرسمي (japanrailpass.net): في العادة تكون البطاقة أغلى. تبدأ بالاستحقاق حين تغطي البطاقة نفسها رحلات شينكانسن طويلة مثل طوكيو أو هيروشيما، وتذكّر أن قطار Nozomi يحتاج تذكرة خاصة منفصلة.',
      `ولكانساي توجد بطاقة WEST QR Kansai Area Pass من JR West. بحسب موقعها الرسمي سعرها ${p.d1} ليوم، و${p.d2} ليومين، و${p.d3} لثلاثة، و${p.d4} لأربعة (للبالغ)، ولا تبيعها إلا وكالات خارج اليابان، وللسياح بإقامة مؤقتة فقط. تغطي قطارات JR السريعة والمحلية في منطقتها وقطار Haruka بمقعد غير محجوز، ولا تغطي الشينكانسن.`,
    ],
    puntaH: 'ساعات الذروة',
    puntaP: 'تجنّب إن استطعت قطارات أيام العمل من نحو الساعة 7:30 إلى 9:00: تكون مزدحمة، والتنقل بالحقائب متعب. وتزدحم أيضاً في آخر النهار مع عودة الناس من أعمالهم. وإن أردت مقعداً مضموناً فانظر في عربة Premium من كيهان، أو A-Seat من JR، أو مقعد محجوز في الشينكانسن، وكلها برسم إضافي.',
    dormirH: 'أي قطار يناسبك حسب مكان إقامتك',
    dormir: [
      ['أوميدا (محطة أوساكا)', 'JR إلى كيوتو وكوبي وهيميجي ونارا، وهانكيو إلى وسط كيوتو وأراشيياما وكوبي، وهانشين إلى كوبي. وقطار كيهان ينطلق من Yodoyabashi على بُعد دقيقتين بالمترو.'],
      ['نامبا', 'كينتيتسو مباشرة إلى نارا، ونانكاي إلى المطار وكوياسان، وهانشين إلى كوبي. وإلى كيوتو: مترو Midōsuji إلى أوميدا أو إلى Yodoyabashi.'],
      ['شين أوساكا', 'الشينكانسن إلى كيوتو وهيميجي وهيروشيما، وقطار Haruka إلى المطار.'],
      ['محطة كيوتو', 'JR إلى نارا وفوشيمي إيناري وأوجي وأراشيياما، وقطار Haruka إلى المطار. وقطار كينتيتسو إلى نارا ينطلق من المحطة نفسها.'],
      ['غيون أو Kawaramachi (كيوتو)', 'كيهان إلى فوشيمي إيناري وأوجي وأوساكا، وهانكيو إلى أوساكا وأراشيياما.'],
    ],
    tonyH: 'أو نركب القطار معاً',
    tonyP: (p) => `إن كنت تفضّل ألّا تشغل بالك بالقطارات، أستقبلكم في بهو فندقكم في أوساكا أو كيوتو ونتنقل معاً: أعلّمكم استعمال ICOCA والقطارات، وفي بقية الرحلة تتنقلون وحدكم. أنا طوني، مرشد خاص بالعربية والإسبانية والإنجليزية، واليوم لمجموعتكم وحدها. السعر للمجموعة حتى 6 أشخاص: ساعتان في كيوتو ${p.corto}، ونصف يوم ${p.medio}، ويوم كامل ${p.completo}، والرحلات البعيدة ابتداءً من ${p.lejos}. القطارات والتذاكر والوجبات تدفعونها أنتم في وقتها، وأنا أخبركم كيف وأين.`,
    tonyB: 'الأسعار والمسارات',
    faq: (p) => [
      ['كم سعر القطار من أوساكا إلى كيوتو؟', `للبالغ: هانكيو من Osaka-umeda إلى Kyoto-kawaramachi ${p.hk} (≈ ${p.hkMin})، وكيهان من Yodoyabashi إلى Gion-shijō ${p.kh} (≈ ${p.khMin})، وJR من أوساكا إلى كيوتو ${p.jr} (≈ ${p.jrMin}). والشينكانسن من شين أوساكا ${p.sk} بمقعد غير محجوز، ويستغرق ≈ ${p.skMin}.`],
      ['كيف أذهب من مطار كانساي إلى كيوتو؟', `من دون تبديل، بقطار Haruka: ${p.hkx} و≈ ${p.hkxMin}. ومع تبديل واحد في أوساكا وبلا رسوم إضافية: ${p.kxjr} و≈ ${p.kxjrMin}. وبحافلة Airport Limousine: ${p.bus} و≈ ${p.busMin} حسب الزحام.`],
      ['ومن المطار إلى نامبا؟', `بقطار Nankai Airport Express: ${p.nk} و≈ ${p.nkMin}. وبقطار rapi:t: ${p.rp} شاملةً تذكرة Limited Express مع مقعد محجوز.`],
      ['ما أسرع طريقة إلى نارا؟', `من نامبا بقطار كينتيتسو: ≈ ${p.knMin} و${p.knYen}، ويوصلك بجوار الحديقة. ومن محطة أوساكا بقطار JR Yamatoji Rapid: ≈ ${p.jnMin} و${p.nara}. ومن كيوتو بقطار Limited Express من كينتيتسو: ≈ ${p.kleMin} و${p.kle}.`],
      ['هل أستطيع استعمال ICOCA أو Suica في كل القطارات؟', 'في JR وهانكيو وهانشين وكيهان وكينتيتسو ونانكاي ومترو أوساكا، نعم. وفي الشينكانسن لا بالرصيد: تحتاج تذكرة أو حجزاً في smartEX ببطاقة مسجّلة. وفي Haruka وrapi:t تُدفع تذكرة Limited Express على حدة.'],
      ['هل يستحق JR Pass في كانساي؟', 'نادراً إن كان تنقلك داخل كانساي فقط: القطارات رخيصة، وأفضلها كثيراً ليست من JR. اجمع رحلاتك من الجدول وقارنها بسعر البطاقة في japanrailpass.net.'],
      ['كيف أصل إلى كوياسان؟', `من نامبا بقطار نانكاي على خط Kōya حتى Gokurakubashi، ثم القطار الجبلي إلى كوياسان: ${p.ky} و≈ ${p.kyMin}. وبقطار Kōya Limited Express: ${p.kyle}. ومن المحطة حافلة تصعد إلى البلدة.`],
      ['هل تستقبلنا في المطار؟', 'لا: أنا مرشد نهاري ولا أقدّم خدمة النقل من المطار وإليه. أستقبلكم في بهو فندقكم في أوساكا أو كيوتو يوم الجولة.'],
    ],
    fuentesP: `الأسعار والأوقات: باحث الرحلات Jorudan، راجعته في <bdi dir="ltr">${FECHA.ar}</bdi> لكل رحلة، بقطار مرجعي يوم الثلاثاء <bdi dir="ltr">17-11-2026</bdi> الساعة <bdi dir="ltr">10:00</bdi> (كل صف في الجدول يربط ببحثه). قواعد ICOCA وJR Pass والبطاقات: المواقع الرسمية.`,
    ctaH: 'أخبرني بالتواريخ وأين تقيمون', ctaP: 'أردّ عليكم أنا، طوني، بمسار اليوم وسعر ثابت للمرشد.', ctaB: 'راسلني على واتساب',
    msg: 'السلام عليكم يا طوني، جئت من صفحة قطارات كانساي.',
  },
}

// ═════════════════════════════════════════════════════════════════════════════
// Página 2: planificador
// ═════════════════════════════════════════════════════════════════════════════
const PL = {
  es: {
    title: '¿Cuántos días en Kansai? Planificador de Kioto, Osaka y Nara | Tony Kansai Guide',
    desc: 'Dime cuántos días tienes, dónde duermes y qué te gusta, y te doy un plan día a día por Kioto, Nara, Osaka, Himeji e Hiroshima, con o sin guía y con su precio.',
    nombre: 'Planificador de días en Kansai',
    ceja: 'Planificador gratis · Kansai',
    h1: 'Kansai en 3 días: Kioto, Nara y Osaka. Con 5, súmale Himeji y un día en Hiroshima y Miyajima',
    lead: 'Elige cuántos días tienes en Kansai, dónde duermes, cuántos sois y qué os gusta, y te sale un plan día a día con las rutas reales que hago como guía: qué días conviene ir con guía y cuáles por libre, el tren desde tu hotel y el precio del guía de cada día, por grupo y por persona.',
    secs: { plan: 'Tu plan', reglas: 'Cómo se ordena', recomendados: 'Planes de 1 a 7 días', precios: 'Precios', preguntas: 'Preguntas' },
    form: { dias: 'Días en Kansai', base: 'Duermo en', personas: 'Somos', int: 'Nos gusta (opcional)', personasOp: (n) => (n === 7 ? 'Más de 6' : n === 1 ? '1 persona' : `${n} personas`), diasOp: (n) => (n === 7 ? '7 o más' : String(n)) },
    planH: 'Tu plan, día a día', planNota: 'Plan por defecto: 3 días, durmiendo en Osaka, 2 personas. Cámbialo arriba.',
    pedir: 'Pedir este plan a Tony',
    reglasH: 'Cómo ordena el plan',
    reglas: [
      'Kioto va el primer día, completo y con guía: es lo que más cuesta organizar y te deja preparado para moverte solo el resto del viaje.',
      'Nara, medio día: el parque, los ciervos y Tōdai-ji caben en una mañana; la tarde queda libre.',
      'Hiroshima y Miyajima van siempre el mismo día, nunca separados: por la mañana la ciudad y por la tarde la isla, mirando la marea.',
      'Las excursiones lejanas (Hiroshima y Miyajima, Kōyasan) y la montaña solo entran con 4 días o más, para no gastar el viaje en trenes. Con menos de 6 días, como mucho una.',
      'Si el último día iba a ser una excursión lejana, pasa al final un día cerca del hotel, para no ir con prisas.',
      'Con guía solo los días en que de verdad ayuda; Osaka, Arashiyama o Uji se hacen bien por libre. Si marcas comida o niños, Osaka pasa a ir con guía; si marcas halal, Kobe y su mezquita.',
    ],
    recH: 'Planes recomendados de 1 a 7 días', recP: 'Sin marcar intereses y con precio del guía por grupo. Si duermes en Kioto el plan cambia un poco: tienes los dos.',
    recOsaka: 'Durmiendo en Osaka', recKioto: 'Durmiendo en Kioto', recCols: ['Días', 'Plan día a día', 'Con guía', 'Guía, por grupo'],
    recDias: (n) => (n === 1 ? '1 día' : `${n} días`), recGuia: (g, n) => `${g} de ${n}`,
    preciosH: 'Lo que cuesta el guía', preciosP: 'Por grupo, no por persona, hasta 6 personas. Te recojo en el vestíbulo de tu hotel en Osaka o Kioto y el día es solo para tu grupo. Entradas, trenes y comidas, aparte.',
    filas: (p) => [['2 horas en Kioto', p.corto], ['Medio día (4 h)', p.medio], ['Día completo (8 h)', p.completo], ['Excursión lejana (Hiroshima y Miyajima, Kōyasan…)', `desde ${p.lejos}`], ['Senderismo guiado', `${p.monteDesde ? 'desde ' : ''}${p.monte}`]],
    faq: (p) => [
      ['¿Cuántos días necesito en Kansai?', p.cuantos],
      ['¿Es mejor dormir en Osaka o en Kioto?', `Osaka tiene trenes directos a casi todo: Kioto en ≈ ${p.jrMin} por ${p.jr}, Nara, Kobe, Himeji y el aeropuerto. Kioto te deja dentro de los templos a primera hora. Si vas a hacer excursiones, Osaka; si el viaje es sobre todo Kioto, Kioto.`],
      ['¿Qué días conviene ir con guía?', 'El primero, en Kioto; Nara, y los días largos como Hiroshima y Miyajima o Kōyasan. Osaka, Arashiyama y Uji se hacen bien por libre; con niños o si os interesa la comida, Osaka con guía también compensa.'],
      ['¿Cuánto cuesta el guía para varios días?', `Cada día se cobra por grupo, no por persona: medio día ${p.medio}, día completo ${p.completo}, excursión lejana desde ${p.lejos}. Para varios días te paso un precio cerrado por todo el viaje.`],
      ['¿Se pueden hacer Hiroshima y Miyajima en días distintos?', `Mejor no: se hacen juntos en un día, la ciudad por la mañana y la isla por la tarde. Desde Shin-Osaka son ≈ ${p.hiMin} de shinkansen Nozomi (${p.hi} con asiento reservado).`],
      ['¿Y si viajamos con niños?', 'Nara es el día favorito con niños por los ciervos, y Osaka también funciona muy bien. El ritmo se ajusta a ellos y evitamos los autobuses llenos de Kioto.'],
      ['¿Hay comida halal y mezquitas?', 'Sí. Hay restaurantes con certificado halal cerca de Gion en Kioto y en Namba en Osaka, y en Kobe está la mezquita más antigua de Japón, de 1935. Si marcas «Halal y mezquitas», el plan incluye Kobe con guía.'],
      ['¿Me recoges en el aeropuerto?', 'No: soy guía de día y no hago traslados al aeropuerto. Te recojo en el vestíbulo de tu hotel en Osaka o Kioto.'],
    ],
    cuantos: (r) => `Con 1 día, ${r[1]}. Con 2, ${r[2]}. Con 3 ves lo esencial: ${r[3]}. Con 5 añades ${r.extra5}, y con 7 también ${r.extra7}, sin prisas.`,
    ctaH: '¿Te preparo el plan con fechas?', ctaP: 'Dime fechas, dónde duermes y cuántos sois. Te contesto yo, Tony, con el plan y un precio cerrado.', ctaB: 'Escribir por WhatsApp',
    msg: 'Hola, Tony. Vengo del planificador de Kansai.',
    fuentesP: `Rutas y precios: los de esta web (rutas hora a hora y página de precios). Trenes: los del buscador de trenes de Kansai, comprobados el ${FECHA.es}.`,
  },
  en: {
    title: 'How many days in Kansai? Kyoto, Osaka & Nara itinerary planner | Tony Kansai Guide',
    desc: 'Tell me how many days you have, where you stay and what you like, and get a day-by-day plan for Kyoto, Nara, Osaka, Himeji and Hiroshima, with or without a guide.',
    nombre: 'Kansai itinerary planner',
    ceja: 'Free planner · Kansai',
    h1: 'Kansai in 3 days: Kyoto, Nara and Osaka. With 5, add Himeji and a day in Hiroshima and Miyajima',
    lead: 'Choose how many days you have in Kansai, where you are staying, how many of you there are and what you like, and you get a day-by-day plan built on the real routes I guide: which days are worth doing with a guide and which on your own, the train from your hotel and each day’s guide price, per group and per person.',
    secs: { plan: 'Your plan', reglas: 'How it is ordered', recomendados: '1 to 7 days', precios: 'Prices', preguntas: 'Questions' },
    form: { dias: 'Days in Kansai', base: 'Staying in', personas: 'We are', int: 'We like (optional)', personasOp: (n) => (n === 7 ? 'More than 6' : n === 1 ? '1 person' : `${n} people`), diasOp: (n) => (n === 7 ? '7 or more' : String(n)) },
    planH: 'Your plan, day by day', planNota: 'Default plan: 3 days, staying in Osaka, 2 people. Change it above.',
    pedir: 'Ask Tony for this plan',
    reglasH: 'How the plan is ordered',
    reglas: [
      'Kyoto comes first, a full day with a guide: it is the hardest to organise and it sets you up to get around on your own for the rest of the trip.',
      'Nara, half a day: the park, the deer and Tōdai-ji fit into a morning; the afternoon is free.',
      'Hiroshima and Miyajima always go on the same day, never split: the city in the morning and the island in the afternoon, timed to the tide.',
      'Long day trips (Hiroshima and Miyajima, Kōyasan) and hiking only come in with 4 days or more, so the trip is not spent on trains. With fewer than 6 days, one at most.',
      'If the last day would be a long trip, a day near your hotel moves to the end, so you are not rushing.',
      'A guide only on the days where it really helps; Osaka, Arashiyama and Uji are easy on your own. If you tick food or children, Osaka gets a guide; if you tick halal, Kobe and its mosque.',
    ],
    recH: 'Recommended plans from 1 to 7 days', recP: 'With no interests ticked and the guide price per group. If you stay in Kyoto the plan changes a little: here are both.',
    recOsaka: 'Staying in Osaka', recKioto: 'Staying in Kyoto', recCols: ['Days', 'Day by day', 'With guide', 'Guide, per group'],
    recDias: (n) => (n === 1 ? '1 day' : `${n} days`), recGuia: (g, n) => `${g} of ${n}`,
    preciosH: 'What the guide costs', preciosP: 'Per group, not per person, up to 6 people. I meet you in your hotel lobby in Osaka or Kyoto and the day is just for your group. Tickets, trains and meals extra.',
    filas: (p) => [['2 hours in Kyoto', p.corto], ['Half day (4 h)', p.medio], ['Full day (8 h)', p.completo], ['Long day trip (Hiroshima and Miyajima, Kōyasan…)', `from ${p.lejos}`], ['Guided hiking', `${p.monteDesde ? 'from ' : ''}${p.monte}`]],
    faq: (p) => [
      ['How many days do I need in Kansai?', p.cuantos],
      ['Is it better to stay in Osaka or Kyoto?', `Osaka has direct trains to almost everything: Kyoto in ≈ ${p.jrMin} for ${p.jr}, Nara, Kobe, Himeji and the airport. Kyoto puts you inside the temples first thing in the morning. If you plan day trips, Osaka; if the trip is mostly Kyoto, Kyoto.`],
      ['Which days are worth doing with a guide?', 'The first one, in Kyoto; Nara; and the long days such as Hiroshima and Miyajima or Kōyasan. Osaka, Arashiyama and Uji are easy on your own; with children or if you are into food, a guided Osaka day pays off too.'],
      ['How much is the guide for several days?', `Each day is charged per group, not per person: half day ${p.medio}, full day ${p.completo}, long day trip from ${p.lejos}. For several days I send you one fixed price for the whole trip.`],
      ['Can Hiroshima and Miyajima be done on different days?', `Better not: they go together in one day, the city in the morning and the island in the afternoon. From Shin-Osaka it is ≈ ${p.hiMin} on the Nozomi shinkansen (${p.hi} with a reserved seat).`],
      ['What if we travel with children?', 'Nara is the favourite day with children because of the deer, and Osaka works very well too. The pace adapts to them and we skip Kyoto’s crowded buses.'],
      ['Is there halal food and are there mosques?', 'Yes. There are halal-certified restaurants near Gion in Kyoto and in Namba in Osaka, and Kobe has Japan’s oldest mosque, built in 1935. If you tick “Halal and mosques”, the plan includes Kobe with a guide.'],
      ['Do you pick us up at the airport?', 'No: I am a day guide and I do not do airport transfers. I meet you in your hotel lobby in Osaka or Kyoto.'],
    ],
    cuantos: (r) => `With 1 day, ${r[1]}. With 2, ${r[2]}. With 3 you see the essentials: ${r[3]}. With 5 you add ${r.extra5}, and with 7 also ${r.extra7}, without rushing.`,
    ctaH: 'Shall I put the plan together with dates?', ctaP: 'Tell me your dates, where you stay and how many you are. I, Tony, reply with the plan and one fixed price.', ctaB: 'Message on WhatsApp',
    msg: 'Hi Tony, I’m coming from the Kansai planner.',
    fuentesP: `Routes and prices: those on this website (routes hour by hour and the prices page). Trains: those in the Kansai trains tool, checked on ${FECHA.en}.`,
  },
  ar: {
    title: 'كم يوماً تحتاج في كانساي؟ مخطِّط كيوتو وأوساكا ونارا | Tony Kansai Guide',
    desc: 'أخبرني بعدد أيامك ومكان إقامتك وما تحبه، فتحصل على خطة يوماً بيوم في كيوتو ونارا وأوساكا وهيميجي وهيروشيما، مع مرشد أو من دونه، وبسعرها.',
    nombre: 'مخطِّط أيام كانساي',
    ceja: 'مخطِّط مجاني · كانساي',
    h1: 'كانساي في 3 أيام: كيوتو ونارا وأوساكا. وفي 5 أيام أضف هيميجي ويوماً في هيروشيما وميياجيما',
    lead: 'اختر عدد أيامك في كانساي، وأين تقيمون، وعددكم، وما تحبونه، فتظهر لكم خطة يوماً بيوم مبنية على المسارات الحقيقية التي أرشد فيها: أي الأيام تستحق مرشداً وأيها على راحتكم، والقطار من فندقكم، وسعر المرشد لكل يوم للمجموعة وللشخص.',
    secs: { plan: 'خطتكم', reglas: 'كيف ترتَّب', recomendados: 'من يوم إلى 7 أيام', precios: 'الأسعار', preguntas: 'أسئلة' },
    form: { dias: 'الأيام في كانساي', base: 'أقيم في', personas: 'عددنا', int: 'نحب (اختياري)', personasOp: (n) => (n === 7 ? 'أكثر من 6' : n === 1 ? 'شخص واحد' : n === 2 ? 'شخصان' : `${n} أشخاص`), diasOp: (n) => (n === 7 ? '7 أو أكثر' : String(n)) },
    planH: 'خطتكم يوماً بيوم', planNota: 'الخطة الافتراضية: 3 أيام، الإقامة في أوساكا، شخصان. غيّرها في الأعلى.',
    pedir: 'اطلب هذه الخطة من طوني',
    reglasH: 'كيف ترتَّب الخطة',
    reglas: [
      'كيوتو في اليوم الأول، يوماً كاملاً مع مرشد: هي الأصعب في التنظيم، وتجهّزكم للتنقل وحدكم بقية الرحلة.',
      'نارا نصف يوم: الحديقة والغزلان ومعبد توداي-جي تتسع لها صباحية واحدة، وبعد الظهر حرّ.',
      'هيروشيما وميياجيما دائماً في اليوم نفسه، ولا يُفصل بينهما أبداً: المدينة صباحاً والجزيرة بعد الظهر حسب المدّ والجزر.',
      'الرحلات البعيدة (هيروشيما وميياجيما، وكوياسان) والجبال لا تدخل إلا مع 4 أيام أو أكثر، كي لا تضيع الرحلة في القطارات. ومع أقل من 6 أيام، رحلة بعيدة واحدة على الأكثر.',
      'إن كان اليوم الأخير رحلة بعيدة، ينتقل إلى آخر الرحلة يوم قريب من الفندق، كي لا تكونوا على عجل.',
      'المرشد فقط في الأيام التي يفيد فيها فعلاً، أما أوساكا وأراشيياما وأوجي فسهلة على راحتكم. وإن اخترتم الطعام أو الأطفال تصبح أوساكا مع مرشد، وإن اخترتم الحلال تدخل كوبي ومسجدها مع مرشد.',
    ],
    recH: 'خطط مقترحة من يوم إلى 7 أيام', recP: 'من دون اختيار اهتمامات، وبسعر المرشد للمجموعة. وإن كانت إقامتكم في كيوتو تتغير الخطة قليلاً: إليكم الاثنتين.',
    recOsaka: 'الإقامة في أوساكا', recKioto: 'الإقامة في كيوتو', recCols: ['الأيام', 'الخطة يوماً بيوم', 'مع مرشد', 'المرشد، للمجموعة'],
    recDias: (n) => (n === 1 ? 'يوم واحد' : n === 2 ? 'يومان' : `<bdi dir="ltr">${n}</bdi> أيام`), recGuia: (g, n) => `<bdi dir="ltr">${g}</bdi> من <bdi dir="ltr">${n}</bdi>`,
    preciosH: 'كم يكلّف المرشد', preciosP: 'للمجموعة لا للشخص، حتى 6 أشخاص. أستقبلكم في بهو فندقكم في أوساكا أو كيوتو، واليوم لمجموعتكم وحدها. التذاكر والقطارات والوجبات على حدة.',
    filas: (p) => [['ساعتان في كيوتو', p.corto], ['نصف يوم (4 ساعات)', p.medio], ['يوم كامل (8 ساعات)', p.completo], ['رحلة بعيدة (هيروشيما وميياجيما، كوياسان…)', `ابتداءً من ${p.lejos}`], ['مشي جبلي مع مرشد', `${p.monteDesde ? 'ابتداءً من ' : ''}${p.monte}`]],
    faq: (p) => [
      ['كم يوماً أحتاج في كانساي؟', p.cuantos],
      ['هل الأفضل الإقامة في أوساكا أم في كيوتو؟', `من أوساكا قطارات مباشرة إلى كل شيء تقريباً: كيوتو في ≈ ${p.jrMin} بـ${p.jr}، ونارا وكوبي وهيميجي والمطار. أما كيوتو فتضعكم بين المعابد من أول الصباح. إن كانت عندكم رحلات يومية فأوساكا، وإن كانت الرحلة في كيوتو أساساً فكيوتو.`],
      ['أي الأيام تستحق مرشداً؟', 'اليوم الأول في كيوتو، ونارا، والأيام الطويلة مثل هيروشيما وميياجيما أو كوياسان. أما أوساكا وأراشيياما وأوجي فسهلة على راحتكم، ومع الأطفال أو لمحبي الطعام يستحق يوم أوساكا مع مرشد أيضاً.'],
      ['كم يكلّف المرشد لعدة أيام؟', `كل يوم يُحسب للمجموعة لا للشخص: نصف يوم ${p.medio}، ويوم كامل ${p.completo}، والرحلة البعيدة ابتداءً من ${p.lejos}. ولعدة أيام أرسل لكم سعراً ثابتاً للرحلة كلها.`],
      ['هل يمكن زيارة هيروشيما وميياجيما في يومين مختلفين؟', `الأفضل لا: تُزاران معاً في يوم واحد، المدينة صباحاً والجزيرة بعد الظهر. ومن شين أوساكا ≈ ${p.hiMin} بشينكانسن Nozomi (${p.hi} بمقعد محجوز).`],
      ['وإن كنا نسافر مع أطفال؟', 'نارا هي اليوم المفضّل مع الأطفال بسبب الغزلان، وأوساكا مناسبة جداً أيضاً. نضبط الإيقاع عليهم ونتجنب حافلات كيوتو المزدحمة.'],
      ['هل يوجد طعام حلال ومساجد؟', 'نعم. توجد مطاعم بشهادة حلال قرب غيون في كيوتو وفي نامبا في أوساكا، وفي كوبي أقدم مسجد في اليابان، بُني عام 1935. وإن اخترتم «الحلال والمساجد» تتضمن الخطة كوبي مع مرشد.'],
      ['هل تستقبلنا في المطار؟', 'لا: أنا مرشد نهاري ولا أقدّم خدمة النقل من المطار وإليه. أستقبلكم في بهو فندقكم في أوساكا أو كيوتو.'],
    ],
    cuantos: (r) => `في يوم واحد: ${r[1]}. وفي يومين: ${r[2]}. وفي 3 أيام ترون الأساس: ${r[3]}. وفي 5 تضيفون ${r.extra5}، وفي 7 أيضاً ${r.extra7}، من دون عجلة.`,
    ctaH: 'هل أجهّز لكم الخطة بالتواريخ؟', ctaP: 'أخبروني بالتواريخ وأين تقيمون وكم عددكم. أردّ عليكم أنا، طوني، بالخطة وبسعر ثابت.', ctaB: 'راسلني على واتساب',
    msg: 'السلام عليكم يا طوني، جئت من مخطِّط كانساي.',
    fuentesP: `المسارات والأسعار: الموجودة في هذا الموقع (المسارات ساعةً بساعة وصفحة الأسعار). القطارات: من أداة قطارات كانساي، راجعتها في <bdi dir="ltr">${FECHA.ar}</bdi>.`,
  },
}

// ═════════════════════════════════════════════════════════════════════════════
// Armazón común
// ═════════════════════════════════════════════════════════════════════════════
function enlaceRuta(clave, lang) {
  const r = RUTA[clave][lang]
  if (!r) throw new Error(`herramientas-viaje: la ruta «${clave}» no existe en ${lang}`)
  return r
}
const joinY = (xs, lang) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')}${lang === 'ar' ? ' و' : lang === 'en' ? ' and ' : ' y '}${xs[xs.length - 1]}`)

function relacionados(lang, actual) {
  const R = {
    es: [['hub', 'Todas las herramientas de viaje'], ['trenes', 'Trenes de Kansai: tiempos y precios'], ['plan', 'Planificador de días en Kansai'], ['taxi', 'Tarjeta para el taxi en japonés'], ['comida', 'Tarjeta de comida en japonés'], ['osakaKioto', 'Cómo ir de Osaka a Kioto'], ['aeropuerto', 'Del aeropuerto de Kansai a Osaka y Kioto'], ['rutas', 'El día, hora a hora'], ['precios', 'Precios del guía']],
    en: [['hub', 'All travel tools'], ['trenes', 'Kansai trains: times and fares'], ['plan', 'Kansai itinerary planner'], ['taxi', 'Japanese taxi card'], ['comida', 'Japanese food card'], ['osakaKioto', 'How to get from Osaka to Kyoto'], ['aeropuerto', 'Kansai Airport to Osaka and Kyoto'], ['rutas', 'The day, hour by hour'], ['precios', 'Guide prices']],
    ar: [['hub', 'كل أدوات السفر'], ['trenes', 'قطارات كانساي: الأوقات والأسعار'], ['plan', 'مخطِّط أيام كانساي'], ['taxi', 'بطاقة التاكسي باليابانية'], ['comida', 'بطاقة الطعام الحلال باليابانية'], ['rutas', 'اليوم ساعةً بساعة'], ['precios', 'أسعار المرشد'], ['calc', 'هل يستحق المرشد؟ حاسبة']],
  }[lang]
  return `<ul class="rel">${R.filter(([k]) => k !== actual && RUTA[k][lang]).map(([k, t]) => `<li><a href="${RUTA[k][lang]}">${esc(t)} <span aria-hidden="true">${flecha(lang)}</span></a></li>`).join('')}</ul>`
}

function cabecera({ lang, rutas, clave, secciones, t }) {
  const C = COMUN[lang]
  return `<header class="top"><div class="kap"><a class="marca" href="/${lang}/"><span aria-hidden="true">⛩</span> Tony Kansai Guide</a>
${navHTML({ etiqueta: C.nav.etiqueta, abrir: C.nav.abrir, grupos: [
    { t: C.nav.g1, enlaces: secciones.map(([id, n]) => [esc(n), `#${id}`]) },
    { t: C.nav.g2, enlaces: C.herramientas.filter(([, k]) => k !== clave).map(([n, k]) => [esc(n), enlaceRuta(k, lang)]) },
    { t: C.nav.g3, enlaces: [...C.mas.map(([n, k]) => [esc(n), enlaceRuta(k, lang)]), ...LANGS.filter((l) => l !== lang).map((l) => ({ t: C.idioma[l], h: rutas[l], hreflang: l, lang: l }))] },
  ], cta: { t: C.nav.cta, h: wa(t.msg) } })}</div></header>`
}

function migas(lang, nombre) {
  const C = COMUN[lang]
  const sep = `<span aria-hidden="true">${lang === 'ar' ? '‹' : '›'}</span>`
  return `<nav class="migas" aria-label="${esc(C.migas)}"><ol><li><a href="/${lang}/">Tony Kansai Guide</a></li><li>${sep}<a href="${RUTA.hub[lang]}">${esc(C.hub)}</a></li><li aria-current="page">${sep}${tx(nombre, lang)}</li></ol></nav>`
}

function pie(lang, t) {
  const C = COMUN[lang]
  return `<footer>${pieHTML({ mas: C.pie.mas,
    intro: `<p>${esc(C.pie.intro)}</p>`,
    columnas: [
      { t: C.pie.c1, enlaces: C.herramientas.map(([n, k]) => [esc(n), enlaceRuta(k, lang)]) },
      { t: C.nav.g3, enlaces: C.mas.map(([n, k]) => [esc(n), enlaceRuta(k, lang)]) },
      { t: C.pie.c2, fija: true, html: `<p>WhatsApp: <a href="${wa(t.msg)}"><bdi dir="ltr">+34 634 193 106</bdi></a></p><p><a href="mailto:tony@tonykansaiguide.com">tony@tonykansaiguide.com</a></p>` },
    ],
    equipo: equipoHTML({ lang, actual: 'tony' }),
    fin: `<span>© Tony Kansai Guide</span><span>${esc(C.pie.act)}: <bdi dir="ltr">${HOY}</bdi></span>`,
  })}</footer>`
}

function documento({ lang, rutas, t, ld, cuerpo, script }) {
  const rtl = lang === 'ar'
  const url = BASE + rutas[lang]
  const fuentes = rtl ? 'family=IBM+Plex+Sans+Arabic:wght@400;500;600;700' : 'family=Geist:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600'
  return `<!doctype html>
<html lang="${lang}" dir="${rtl ? 'rtl' : 'ltr'}" data-estatica="herramientas-viaje">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="${lang === 'es' ? '#f2e6e7' : '#f3eee4'}" >
<meta name="color-scheme" content="light dark">
<link rel="canonical" href="${url}">
${LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${BASE}${rutas[l]}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${BASE}${rutas.en}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Tony Kansai Guide">
<meta property="og:locale" content="${{ es: 'es_ES', en: 'en_GB', ar: 'ar_AE' }[lang]}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.desc)}">
<meta property="og:image" content="${BASE}/v8/og/kyoto.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fuentes}&display=swap">
<style>${lang === 'es' ? CSS_ES : CSS}${menuCSS}${equipoCSS}</style>
</head>
<body>
<a class="saltar" href="#principal">${esc(lang === 'es' ? 'Ir al contenido' : lang === 'en' ? 'Skip to content' : 'انتقل إلى المحتوى')}</a>
${cuerpo}
${script ? `<script>${script}</script>` : ''}
${lang === 'es' ? '<script src="/caida.js" defer></script>\n' : ''}</body>
</html>
`
}

function jsonLD({ lang, rutas, t, faq, tipo }) {
  const url = BASE + rutas[lang]
  const C = COMUN[lang]
  const tony = { '@id': `${BASE}/#tony` }
  const plano = (s) => String(s).replace(/<[^>]+>/g, '')
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Person', '@id': `${BASE}/#tony`, name: 'Tony Hanma', url: `${BASE}/${lang}/`, jobTitle: 'Private tour guide in Kansai', knowsLanguage: ['es', 'en', 'ar'], email: 'tony@tonykansaiguide.com' },
      {
        '@type': 'WebApplication', '@id': `${url}#app`, name: plano(t.nombre), url, description: t.desc, inLanguage: lang, applicationCategory: 'TravelApplication', applicationSubCategory: tipo,
        operatingSystem: 'Any', browserRequirements: 'Requires JavaScript for the interactive part; all data is also in the page as text.', isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: 0, priceCurrency: 'JPY' }, author: tony, provider: tony, dateModified: HOY,
      },
      { '@type': 'FAQPage', '@id': `${url}#preguntas`, inLanguage: lang, mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: plano(q), acceptedAnswer: { '@type': 'Answer', text: plano(a) } })) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Tony Kansai Guide', item: `${BASE}/${lang}/` },
        { '@type': 'ListItem', position: 2, name: C.hub, item: `${BASE}${RUTA.hub[lang]}` },
        { '@type': 'ListItem', position: 3, name: plano(t.nombre), item: url },
      ] },
    ],
  }
}

const faqHTML = (faq) => faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')

// ── Trenes ──────────────────────────────────────────────────────────────────
function paginaTrenes(lang) {
  const t = TR[lang]
  const C = COMUN[lang]
  const D = datosMotor(lang)
  const L = etiquetasMotor(lang)
  const M = crearMotor({ ...D, L })
  const Y = (id) => yen(tramo(id).yen, lang)
  const Mi = (id) => M.fm(tramo(id).min)
  const p = {
    n: TRAMOS.length, fecha: `<bdi dir="ltr">${FECHA.ar}</bdi>`,
    jrMin: Mi('osaka-kioto-jr'), jrYen: Y('osaka-kioto-jr'), hkYen: Y('osaka-kioto-hankyu'), skMin: Mi('shinosaka-kioto-shinkansen'), hkxMin: Mi('kix-kioto-haruka'), naraYen: Y('namba-nara-kintetsu'),
    jr: Y('osaka-kioto-jr'), hk: Y('osaka-kioto-hankyu'), hkMin: Mi('osaka-kioto-hankyu'), kh: Y('osaka-kioto-keihan'), khMin: Mi('osaka-kioto-keihan'), sk: Y('shinosaka-kioto-shinkansen'),
    hkx: Y('kix-kioto-haruka'), kxjr: Y('kix-kioto-jr'), kxjrMin: Mi('kix-kioto-jr'), bus: Y('kix-kioto-bus'), busMin: Mi('kix-kioto-bus'),
    nk: Y('kix-namba-nankai'), nkMin: Mi('kix-namba-nankai'), rp: Y('kix-namba-rapit'),
    knMin: Mi('namba-nara-kintetsu'), knYen: Y('namba-nara-kintetsu'), jnMin: Mi('osaka-nara-jr'), nara: Y('osaka-nara-jr'), kle: Y('kioto-nara-kintetsu-le'), kleMin: Mi('kioto-nara-kintetsu-le'),
    kn: Y('kioto-nara-jr'), hm: Y('osaka-himeji-jr'), ky: Y('namba-koyasan'), kyMin: Mi('namba-koyasan'), kyle: Y('namba-koyasan-le'),
    d1: yen(PASE_KANSAI.d1, lang), d2: yen(PASE_KANSAI.d2, lang), d3: yen(PASE_KANSAI.d3, lang), d4: yen(PASE_KANSAI.d4, lang),
    corto: yen(PRECIO_CORTO, lang), medio: yen(PRECIO.medio, lang), completo: yen(PRECIO.completo, lang), lejos: yen(PRECIO.lejos, lang),
  }
  // Las respuestas llevan HTML (bdi); las preguntas se escapan.
  const faq = t.faq(p).map(([q, a]) => [tx(q, lang), lang === 'ar' ? a : a])
  const secciones = Object.entries(t.secs)

  const opcionesSel = (lista, sel) => lista.map((k) => `<option value="${k}"${k === sel ? ' selected' : ''}>${esc(LUGARES[k][lang])}</option>`).join('')
  const buscador = `<section class="bloque" id="buscador"><div class="kap">
<h2>${esc(t.buscH)}</h2>
<form class="busc" id="busc" onsubmit="return false">
<label><span>${esc(t.de)}</span><select name="de">${opcionesSel(ORIGENES, 'umeda')}</select></label>
<button type="button" class="giro" id="giro" aria-label="${esc(t.cambiar)}" title="${esc(t.cambiar)}"><span aria-hidden="true">⇄</span></button>
<label><span>${esc(t.a)}</span><select name="a">${opcionesSel(DESTINOS, 'kioto')}</select></label>
</form>
<p class="nota">${lang === 'ar' ? t.buscNota : esc(t.buscNota)}</p>
<div id="resultado" aria-live="polite">${M.resultado('umeda', 'kioto')}</div>
</div></section>`

  // Tabla: una fila por trayecto, agrupada por origen → destino.
  const grupos = []
  for (const tr of D.tramos) {
    const k = `${tr.de}>${tr.a}`
    let g = grupos.find((x) => x.k === k)
    if (!g) grupos.push(g = { k, de: tr.de, a: tr.a, filas: [] })
    g.filas.push(tr)
  }
  const tabla = `<section class="bloque bloque-claro" id="tabla"><div class="kap">
<h2>${esc(t.tablaH)}</h2><p class="sub">${esc(t.tablaP)}</p>
<div class="tabla-scroll" role="region" aria-label="${esc(t.tablaH)}" tabindex="0"><table class="tabla">
<thead><tr>${t.cols.map((c) => `<th scope="col">${tx(c, lang)}</th>`).join('')}</tr></thead>
${grupos.map((g) => `<tbody><tr class="grupo"><th colspan="7" scope="rowgroup">${tx(nombreCorto(g.de, lang), lang)} <span aria-hidden="true">${flecha(lang)}</span><span class="sr">${esc(L.hasta)}</span> ${tx(nombreCorto(g.a, lang), lang)}</th></tr>
${g.filas.map((f) => `<tr><th scope="row">${f.l}</th><td>${M.trayecto(f, false)}</td><td class="num">≈ ${M.fm(f.min)}${f.tb ? `<br><small>${esc(L.cambios(f.tb))}</small>` : ''}</td><td class="num"><b>${yen(f.yen, lang)}</b>${f.des ? `<br><small>${f.des.map(([n, k]) => `${yen(n, lang)} ${esc(L.des[k])}`).join(' + ')}</small>` : ''}</td><td>${tx(t.icCorto[f.ic], lang)}</td><td>${tx(t.jrCorto[f.jr], lang)}${f.pase ? `<br><small>${tx('WEST QR Kansai Area Pass', lang)}</small>` : ''}</td><td><a href="${f.f}" rel="noopener">Jorudan</a><br><small><bdi dir="ltr">${FECHA[lang]}</bdi></small></td></tr>`).join('')}</tbody>`).join('')}
</table></div>
<p class="nota">${tx(t.tablaNota, lang)}</p>
</div></section>`

  const texto = `<section class="bloque" id="icoca"><div class="kap estrecho">
<h2>${tx(t.icH, lang)}</h2>${t.icP.map((x) => `<p class="parr">${tx(x, lang)}</p>`).join('')}
</div></section>
<section class="bloque bloque-claro" id="jrpass"><div class="kap estrecho">
<h2>${tx(t.jrH, lang)}</h2>${t.jrP(p).map((x) => `<p class="parr">${lang === 'ar' ? bidiFrases(x) : x}</p>`).join('')}
<h3 class="h3">${tx(t.puntaH, lang)}</h3><p class="parr">${tx(t.puntaP, lang)}</p>
</div></section>
<section class="bloque" id="dormir"><div class="kap">
<h2>${tx(t.dormirH, lang)}</h2>
<dl class="dormir">${t.dormir.map(([a, b]) => `<div><dt>${tx(a, lang)}</dt><dd>${tx(b, lang)}</dd></div>`).join('')}</dl>
<div class="tony"><div><h3>${tx(t.tonyH, lang)}</h3><p>${lang === 'ar' ? bidiFrases(t.tonyP(p)) : t.tonyP(p)}</p></div><a class="btn btn-sec" href="${RUTA.precios[lang]}">${esc(t.tonyB)} <span aria-hidden="true">${flecha(lang)}</span></a></div>
</div></section>`

  const faqSec = `<section class="bloque bloque-claro" id="preguntas"><div class="kap estrecho">
<h2>${esc(C.faqH)}</h2>${faqHTML(faq.map(([q, a]) => [q, lang === 'ar' ? bidiFrases(a) : a]))}
</div></section>`

  const cierre = `<section class="bloque" id="relacionados"><div class="kap">
<h2>${esc(C.relH)}</h2>${relacionados(lang, 'trenes')}
<h2 class="h-fuentes">${esc(C.fuentesH)}</h2><p class="parr">${lang === 'ar' ? t.fuentesP : esc(t.fuentesP)}</p>
<ul class="fuentes">${OFICIALES.map((o) => `<li><a href="${o.url}" rel="noopener">${tx(o.t[lang], lang)}</a> <small>· <bdi dir="ltr">${o.fecha}</bdi></small></li>`).join('')}<li>${tx(lang === 'es' ? `Jorudan (jorudan.co.jp), una búsqueda por trayecto: ${TRAMOS.length} trayectos, enlazados en la tabla` : lang === 'en' ? `Jorudan (jorudan.co.jp), one search per route: ${TRAMOS.length} routes, linked in the table` : `Jorudan (jorudan.co.jp)، بحث لكل رحلة: ${TRAMOS.length} رحلة، روابطها في الجدول`, lang)} <small>· <bdi dir="ltr">${COMPROBADO}</bdi></small></li></ul>
</div></section>
<section class="cierre"><div class="kap">
<h2>${esc(t.ctaH)}</h2><p>${esc(t.ctaP)}</p>
<a class="btn" href="${wa(t.msg)}" rel="noopener">${esc(t.ctaB)} <span aria-hidden="true">${flecha(lang)}</span></a>
</div></section>`

  const heroe = `<section class="heroe"><div class="kap">
${migas(lang, t.nombre)}
<p class="ceja">${t.ceja}</p>
<h1>${lang === 'ar' ? bidiFrases(t.h1(p)) : t.h1(p)}</h1>
<p class="respuesta">${lang === 'ar' ? bidiFrases(t.lead(p)) : t.lead(p)}</p>
<ul class="datos">${t.datos(p).map(([a, b]) => `<li><span>${tx(a, lang)}</span><b>${lang === 'ar' ? bidiFrases(b) : b}</b></li>`).join('')}</ul>
</div></section>
<nav class="indice" aria-label="${esc(C.nav.g1)}"><div class="kap"><ul>${secciones.map(([id, n]) => `<li><a href="#${id}">${tx(n, lang)}</a></li>`).join('')}</ul></div></nav>`

  const cuerpo = `${cabecera({ lang, rutas: RUTA.trenes, clave: 'trenes', secciones, t })}
<main id="principal">
${heroe}
${buscador}
${tabla}
${texto}
${faqSec}
${cierre}
</main>
${pie(lang, t)}`

  const script = `(()=>{const D=${JSON.stringify({ tramos: D.tramos, origenes: D.origenes, lugares: D.lugares }).replace(/</g, '\\u003c')};D.L=${etiquetasJS(L).replace(/<\/script/gi, '<\\/script')};const M=(${crearMotor.toString()})(D);
const f=document.getElementById('busc'),out=document.getElementById('resultado');if(!f||!out)return;const de=f.elements.de,a=f.elements.a;
function pinta(){out.innerHTML=M.resultado(de.value,a.value)}
de.addEventListener('change',pinta);a.addEventListener('change',pinta);
document.getElementById('giro').addEventListener('click',()=>{const o=de.value,d=a.value;if(![...de.options].some(x=>x.value===d)||![...a.options].some(x=>x.value===o))return;de.value=d;a.value=o;pinta()});
const q=new URLSearchParams(location.search);if(q.get('de')&&q.get('a')){de.value=q.get('de');a.value=q.get('a');if(de.value&&a.value)pinta()}})()`

  return documento({ lang, rutas: RUTA.trenes, t, ld: jsonLD({ lang, rutas: RUTA.trenes, t, faq, tipo: 'Train times and fares' }), cuerpo, script })
}

// En árabe, las respuestas con cifras ya traen <bdi>; aquí se aíslan además los
// nombres latinos sueltos (estaciones, trenes) sin tocar lo que ya va en <bdi>.
function bidiFrases(html) {
  return html.split(/(<bdi[^>]*>.*?<\/bdi>)/g).map((seg) => (seg.startsWith('<bdi') ? seg : seg.replace(RE_LATIN, (m) => `<bdi dir="ltr">${m}</bdi>`))).join('')
}

// ── Planificador ────────────────────────────────────────────────────────────
function paginaPlan(lang) {
  const t = PL[lang]
  const C = COMUN[lang]
  const L = etiquetasMotor(lang)
  const D0 = datosMotor(lang)
  const motor = (base) => crearMotor({ ...conTardeNara(D0, lang, base), L })
  const Mo = motor('osaka')
  const Mk = motor('kioto')
  const nombres = PLAN_TXT[lang].nombre
  const ids = (n, base) => (base === 'osaka' ? Mo : Mk).planificar(n, base, [])
  // El H1 está escrito a mano: se comprueba que dice lo mismo que el motor.
  const d3 = ids(3, 'osaka')
  const d5 = ids(5, 'osaka')
  if (d3.join() !== 'kioto,nara,osaka' || !d5.includes('himeji') || !d5.includes('hiroshima') || d5.length !== 5) {
    throw new Error(`herramientas-viaje: el H1 del planificador ya no coincide con el motor (3: ${d3}, 5: ${d5})`)
  }
  const d7 = ids(7, 'osaka')
  const nom = (xs) => joinY(xs.map((i) => nombres[i]), lang)
  const r = { 1: nom(ids(1, 'osaka')), 2: nom(ids(2, 'osaka')), 3: nom(d3), extra5: nom(d5.filter((i) => !d3.includes(i))), extra7: nom(d7.filter((i) => !d5.includes(i))) }
  const p = {
    cuantos: t.cuantos(r), jrMin: Mo.fm(tramo('osaka-kioto-jr').min), jr: yen(tramo('osaka-kioto-jr').yen, lang), hiMin: Mo.fm(tramo('shinosaka-hiroshima-nozomi').min), hi: yen(tramo('shinosaka-hiroshima-nozomi').yen, lang),
    corto: yen(PRECIO_CORTO, lang), medio: yen(PRECIO.medio, lang), completo: yen(PRECIO.completo, lang), lejos: yen(PRECIO.lejos, lang), monte: yen(MONTE_MIN, lang), monteDesde: PRECIOS_MONTE.length > 1,
  }
  const faq = t.faq(p).map(([q, a]) => [tx(q, lang), lang === 'ar' ? bidiFrases(a) : a])
  const secciones = Object.entries(t.secs)
  const F = t.form

  const form = `<form class="planf" id="planf" onsubmit="return false">
<fieldset><legend>${tx(F.dias, lang)}</legend><div class="chips">${[1, 2, 3, 4, 5, 6, 7].map((n) => `<label class="chip"><input type="radio" name="dias" value="${n}"${n === 3 ? ' checked' : ''}><span>${tx(F.diasOp(n), lang)}</span></label>`).join('')}</div></fieldset>
<fieldset><legend>${tx(F.base, lang)}</legend><div class="chips">${['osaka', 'kioto'].map((b) => `<label class="chip"><input type="radio" name="base" value="${b}"${b === 'osaka' ? ' checked' : ''}><span>${esc(PLAN_TXT[lang].base[b])}</span></label>`).join('')}</div></fieldset>
<fieldset><legend>${tx(F.personas, lang)}</legend><div class="chips">${[1, 2, 3, 4, 5, 6, 7].map((n) => `<label class="chip"><input type="radio" name="personas" value="${n}"${n === 2 ? ' checked' : ''}><span>${tx(F.personasOp(n), lang)}</span></label>`).join('')}</div></fieldset>
<fieldset><legend>${tx(F.int, lang)}</legend><div class="chips">${INTERESES.map((i) => `<label class="chip"><input type="checkbox" name="int" value="${i}"><span>${esc(PLAN_TXT[lang].int[i])}</span></label>`).join('')}</div></fieldset>
</form>`
  const inicial = Mo.plan(3, 'osaka', 2, [])
  const planSec = `<section class="bloque" id="plan"><div class="kap">
${form}
<h2 class="h-plan">${tx(t.planH, lang)}</h2>
<p class="nota" id="plan-nota">${tx(t.planNota, lang)}</p>
<div id="plan-res" aria-live="polite">${inicial.html}</div>
<p class="pedir"><a class="btn" id="plan-wa" href="${inicial.wa}" rel="noopener">${esc(t.pedir)} <span aria-hidden="true">${flecha(lang)}</span></a></p>
</div></section>`

  const reglas = `<section class="bloque bloque-claro" id="reglas"><div class="kap estrecho">
<h2>${tx(t.reglasH, lang)}</h2><ol class="reglas">${t.reglas.map((x) => `<li>${tx(x, lang)}</li>`).join('')}</ol>
</div></section>`

  const fila = (n, base) => {
    const M = base === 'osaka' ? Mo : Mk
    const pl = M.plan(n, base, 2, [])
    const diasTxt = M.planificar(n, base, []).map((id, i) => {
      const g = M.guiaDe(id, [])
      const k = D0.bloques[id]
      const titulo = (g ? k.guia : k.libre).titulo
      return `<li><span class="rn">${L.dia(i + 1)}</span> ${titulo} <small>· ${esc(g ? L.conGuiaTxt(L.tramoTxt[g]) : L.libreTxt)}</small></li>`
    }).join('')
    return `<tr><th scope="row">${t.recDias(n)}</th><td><ol class="rec-d">${diasTxt}</ol></td><td class="num">${t.recGuia(pl.guiados, n)}</td><td class="num">${pl.desde ? `${esc(L.desdeP)} ` : ''}<b>${yen(pl.total, lang)}</b></td></tr>`
  }
  const tablaRec = (base, titulo) => `<h3 class="h3">${tx(titulo, lang)}</h3><div class="tabla-scroll" role="region" aria-label="${esc(titulo)}" tabindex="0"><table class="tabla tabla-rec"><thead><tr>${t.recCols.map((c) => `<th scope="col">${tx(c, lang)}</th>`).join('')}</tr></thead><tbody>${[1, 2, 3, 4, 5, 7].map((n) => fila(n, base)).join('')}</tbody></table></div>`
  const rec = `<section class="bloque" id="recomendados"><div class="kap">
<h2>${tx(t.recH, lang)}</h2><p class="sub">${tx(t.recP, lang)}</p>
${tablaRec('osaka', t.recOsaka)}
${tablaRec('kioto', t.recKioto)}
</div></section>`

  const precios = `<section class="bloque bloque-claro" id="precios"><div class="kap estrecho">
<h2>${tx(t.preciosH, lang)}</h2><p class="sub">${tx(t.preciosP, lang)}</p>
<dl class="tarifas">${t.filas(p).map(([a, b]) => `<div><dt>${tx(a, lang)}</dt><dd>${lang === 'ar' ? bidiFrases(b) : b} <small>${esc(L.porGrupo)}</small></dd></div>`).join('')}</dl>
<p class="mas"><a href="${RUTA.precios[lang]}">${esc(COMUN[lang].mas[1][0])} <span aria-hidden="true">${flecha(lang)}</span></a> · <a href="${RUTA.rutas[lang]}">${esc(COMUN[lang].mas[2][0])} <span aria-hidden="true">${flecha(lang)}</span></a></p>
</div></section>`

  const faqSec = `<section class="bloque" id="preguntas"><div class="kap estrecho"><h2>${esc(C.faqH)}</h2>${faqHTML(faq)}</div></section>`
  const cierre = `<section class="bloque bloque-claro" id="relacionados"><div class="kap">
<h2>${esc(C.relH)}</h2>${relacionados(lang, 'plan')}
<h2 class="h-fuentes">${esc(C.fuentesH)}</h2><p class="parr">${lang === 'ar' ? t.fuentesP : esc(t.fuentesP)} <a href="${RUTA.trenes[lang]}#tabla">${esc(COMUN[lang].herramientas[1][0])}</a></p>
</div></section>
<section class="cierre"><div class="kap">
<h2>${esc(t.ctaH)}</h2><p>${esc(t.ctaP)}</p>
<a class="btn" href="${wa(t.msg)}" rel="noopener">${esc(t.ctaB)} <span aria-hidden="true">${flecha(lang)}</span></a>
</div></section>`

  const heroe = `<section class="heroe"><div class="kap">
${migas(lang, t.nombre)}
<p class="ceja">${esc(t.ceja)}</p>
<h1>${tx(t.h1, lang)}</h1>
<p class="respuesta">${tx(t.lead, lang)}</p>
</div></section>
<nav class="indice" aria-label="${esc(C.nav.g1)}"><div class="kap"><ul>${secciones.map(([id, n]) => `<li><a href="#${id}">${tx(n, lang)}</a></li>`).join('')}</ul></div></nav>`

  const cuerpo = `${cabecera({ lang, rutas: RUTA.plan, clave: 'plan', secciones, t })}
<main id="principal">
${heroe}
${planSec}
${reglas}
${rec}
${precios}
${faqSec}
${cierre}
</main>
${pie(lang, t)}`

  // En la página: los datos de las dos bases (cambia el texto de la tarde de Nara).
  const datos = { osaka: conTardeNara(D0, lang, 'osaka').bloques.nara.guia.texto, kioto: conTardeNara(D0, lang, 'kioto').bloques.nara.guia.texto }
  const D0json = D0
  const script = `(()=>{const D=${JSON.stringify(D0json).replace(/</g, '\\u003c')};D.L=${etiquetasJS(L).replace(/<\/script/gi, '<\\/script')};const NARA=${JSON.stringify(datos).replace(/</g, '\\u003c')};const crear=${crearMotor.toString()};
const f=document.getElementById('planf'),out=document.getElementById('plan-res'),btn=document.getElementById('plan-wa'),nota=document.getElementById('plan-nota');if(!f||!out)return;
function pinta(){const n=+f.querySelector('[name=dias]:checked').value,b=f.querySelector('[name=base]:checked').value,p=+f.querySelector('[name=personas]:checked').value,ints=[...f.querySelectorAll('[name=int]:checked')].map(x=>x.value);
D.bloques.nara.guia.texto=NARA[b];const M=crear(D);const r=M.plan(n,b,p,ints);out.innerHTML=r.html;btn.href=r.wa;if(nota)nota.hidden=true}
f.addEventListener('change',pinta)})()`

  return documento({ lang, rutas: RUTA.plan, t, ld: jsonLD({ lang, rutas: RUTA.plan, t, faq, tipo: 'Itinerary planner' }), cuerpo, script })
}

// ═════════════════════════════════════════════════════════════════════════════
// Estilo: papel y tinta, un solo acento (bermellón del torii, el de precios.mjs),
// siempre en claro (21-11-2026: sin modo oscuro automático, como el resto de la web), cifras tabulares.
// ═════════════════════════════════════════════════════════════════════════════
// 24-11-2026: la paleta «sakura empolvado» solo va en español; EN/AR siguen con la hoja de siempre.
const CSS_ES = `html[lang=es] section.eq:not([class*="eq--"]){--eq-fondo:#e9d5d8;--eq-tenue:#515b67;--eq-acento:#2d684c}

:root{--papel:#f2e6e7;--papel2:#e9d5d8;--tarjeta:#ffffff;--tinta:#1e2a36;--gris:#515b67;--linea:rgba(30,42,54,.12);--linea2:#6b7683;--acento:#2d684c;--acento-t:#fff;--acento-suave:#e9d5d8;--hondo:#ffffff;--hondo-t:#1e2a36;--hondo-g:#515b67;--rosa:#8e3b55;
--mn-tarjeta:var(--tarjeta);--mn-texto:var(--tinta);--mn-linea:var(--linea2);--mn-suave:var(--papel2);--mn-acento:var(--acento);
--sans:'Geist',system-ui,-apple-system,'Segoe UI',sans-serif;--serif:'Source Serif 4',Georgia,serif;--r:14px;color-scheme:light}
html[dir=rtl]{--sans:'IBM Plex Sans Arabic',system-ui,sans-serif;--serif:'IBM Plex Sans Arabic',system-ui,sans-serif}
*{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{transition:none!important;animation:none!important}}
body{margin:0;background:var(--papel);color:var(--tinta);font:400 16px/1.6 var(--sans);overflow-x:hidden}
a{color:inherit;text-underline-offset:3px}
h1,h2,h3{font-family:var(--serif);font-weight:600;line-height:1.12;margin:0;text-wrap:balance;letter-spacing:-.01em}
html[dir=rtl] h1,html[dir=rtl] h2,html[dir=rtl] h3{letter-spacing:0;line-height:1.4;font-weight:700}
p{margin:0}
bdi,.est,.fl{unicode-bidi:isolate}
.num,bdi,.op-p b,.dia-p b,.total b,.datos b{font-variant-numeric:tabular-nums}
[lang=ja]{font-family:'Hiragino Sans','Yu Gothic','Noto Sans JP',sans-serif;font-size:.86em;color:var(--gris);white-space:nowrap}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.kap{max-width:1120px;margin:0 auto;padding:0 16px}
@media (min-width:720px){.kap{padding:0 28px}}
.estrecho{max-width:860px}
.saltar{position:absolute;top:8px;inset-inline-start:16px;z-index:100;background:var(--tarjeta);padding:8px 12px;border-radius:8px;clip-path:inset(50%);width:1px;height:1px;overflow:hidden;white-space:nowrap}.saltar:focus{clip-path:none;width:auto;height:auto}
:focus-visible{outline:2px solid var(--acento);outline-offset:2px}
.top{position:sticky;top:0;z-index:50;background:color-mix(in srgb,var(--tarjeta) 94%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--linea)}
.top .kap{display:flex;align-items:center;gap:12px;min-height:60px}
.marca{font:600 17px/1 var(--sans);text-decoration:none;white-space:nowrap;display:flex;gap:8px;align-items:center}
.marca span{color:var(--rosa)}
@media (max-width:420px){.marca{font-size:15px}}
.migas ol{list-style:none;margin:0 0 18px;padding:0;display:flex;flex-wrap:wrap;gap:4px 8px;font-size:13.5px;color:var(--gris)}
.migas li{display:flex;gap:8px;align-items:center}.migas a{color:var(--gris)}
.heroe{padding:28px 0 36px}
@media (min-width:960px){.heroe{padding:52px 0 56px}}
.ceja{font:600 12px/1.3 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--rosa);margin-bottom:14px}
html[dir=rtl] .ceja{letter-spacing:0;font-size:14px}
h1{font-size:clamp(32px,6.2vw,62px);max-width:20ch}
html[dir=rtl] h1{max-width:24ch}
.respuesta{margin-top:18px;font-size:17.5px;line-height:1.65;color:var(--gris);max-width:70ch}
.respuesta bdi{color:var(--tinta);font-weight:600}
.datos{list-style:none;margin:28px 0 0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
@media (min-width:860px){.datos{grid-template-columns:repeat(4,minmax(0,1fr))}}
.datos li{display:flex;flex-direction:column;gap:4px;padding:14px;border:1px solid var(--linea);border-radius:12px;background:var(--tarjeta)}
.datos span{font-size:13px;color:var(--gris);line-height:1.35}
.datos b{font-size:19px;font-weight:600;letter-spacing:-.01em;line-height:1.25}
.indice{position:sticky;top:60px;z-index:40;background:var(--papel);border-bottom:1px solid var(--linea)}
.indice ul{list-style:none;margin:0;padding:10px 0;display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}
.indice ul::-webkit-scrollbar{display:none}
.indice a{display:inline-flex;align-items:center;min-height:36px;padding:0 14px;border-radius:999px;border:1px solid var(--linea);text-decoration:none;font-size:14px;white-space:nowrap;background:var(--tarjeta)}
.indice a:hover{border-color:var(--tinta)}
.bloque{padding:52px 0;scroll-margin-top:112px}
@media (min-width:720px){.bloque{padding:76px 0}}
.bloque-claro{background:var(--papel2)}
.bloque h2{font-size:clamp(28px,4.6vw,42px)}
.h3{font-size:22px;margin:28px 0 10px}
.sub{color:var(--gris);margin:10px 0 26px;max-width:66ch;font-size:16.5px}
.nota{color:var(--gris);font-size:14px;margin:14px 0 0;max-width:80ch}
.parr{margin-top:14px;font-size:17px;line-height:1.7;max-width:70ch}
.parr bdi{font-weight:600}
.mas{margin-top:18px}.mas a{font-weight:600}
/* Buscador */
.busc{display:grid;grid-template-columns:minmax(0,1fr) 48px minmax(0,1fr);gap:10px;align-items:end;margin-top:22px;padding:18px;border-radius:18px;background:var(--tarjeta);border:1px solid var(--linea)}
@media (max-width:559px){.busc{grid-template-columns:minmax(0,1fr) 48px}.busc label:last-of-type{grid-column:1/-1}.giro{grid-row:1;grid-column:2;align-self:end}}
.busc label{display:grid;gap:6px;min-width:0}
.busc label>span{font-size:13px;font-weight:600;color:var(--gris);letter-spacing:.02em}
select{appearance:none;-webkit-appearance:none;width:100%;min-height:54px;padding:0 40px 0 14px;border:1px solid var(--linea2);border-radius:12px;background:var(--papel) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23888' stroke-width='1.8'/%3E%3C/svg%3E") no-repeat right 14px center;color:var(--tinta);font:500 17px/1.2 var(--sans)}
html[dir=rtl] select{padding:0 14px 0 40px;background-position:left 14px center}
.giro{width:48px;height:54px;border-radius:12px;border:1px solid var(--linea2);background:var(--papel);color:var(--tinta);font-size:20px;cursor:pointer}
.giro:hover{border-color:var(--tinta)}
.res-t{margin:26px 0 12px;font-weight:600;font-size:17px}
.res-t b{color:var(--acento)}
.aviso{margin:22px 0 0;padding:14px 16px;border-radius:12px;background:var(--acento-suave);border:1px solid var(--linea);max-width:80ch}
.ops{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.op{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px 22px;padding:18px;border-radius:var(--r);background:var(--tarjeta);border:1px solid var(--linea)}
@media (max-width:599px){.op{grid-template-columns:1fr}}
.sellos{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}
.sello{font-size:12px;font-weight:600;letter-spacing:.04em;padding:3px 10px;border-radius:999px;border:1px solid var(--rosa);color:var(--rosa)}
.op-l{font-family:var(--sans);font-size:19px;font-weight:600;line-height:1.3}
.op-r{margin-top:6px;font-size:15.5px;display:flex;flex-wrap:wrap;gap:4px 8px;align-items:baseline}
.fl{color:var(--acento);font-weight:700}
.op-x{list-style:none;margin:10px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:6px}
.op-x li{font-size:13px;padding:4px 10px;border-radius:8px;background:var(--papel2);line-height:1.4}
.op-c{margin-top:10px;color:var(--gris);font-size:15px;max-width:64ch}
.op-f{margin-top:8px;font-size:12.5px;color:var(--gris)}
.op-p{display:flex;flex-direction:column;align-items:flex-end;text-align:end;gap:8px;min-width:150px}
@media (max-width:599px){.op-p{flex-direction:row;flex-wrap:wrap;align-items:baseline;justify-content:space-between;text-align:start;border-top:1px solid var(--linea);padding-top:12px;min-width:0}}
.op-yen,.op-min{display:flex;flex-direction:column;gap:1px}
@media (max-width:599px){.op-yen,.op-min{align-items:flex-start}.op-min{align-items:flex-end;text-align:end}}
.op-yen b{font-size:30px;font-weight:600;letter-spacing:-.02em;line-height:1}
.op-min b{font-size:19px;font-weight:600}
.op-p span{font-size:12.5px;color:var(--gris)}
.op-des{font-size:12.5px;color:var(--gris);max-width:220px}
@media (max-width:599px){.op-des{flex-basis:100%;max-width:none;order:3}}
/* Tablas */
.tabla-scroll{overflow-x:auto;border:1px solid var(--linea);border-radius:var(--r);background:var(--tarjeta);-webkit-overflow-scrolling:touch}
.tabla{border-collapse:collapse;width:100%;min-width:860px;font-size:14.5px}
.tabla-rec{min-width:640px}
.tabla th,.tabla td{padding:12px 14px;text-align:start;vertical-align:top;border-bottom:1px solid var(--linea)}
.tabla thead th{font-size:12.5px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--gris);background:var(--papel2);position:sticky;top:0}
html[dir=rtl] .tabla thead th{letter-spacing:0;text-transform:none;font-size:13.5px}
.tabla tbody th{font-weight:600;max-width:240px}
.tabla .grupo th{background:var(--acento-suave);font-family:var(--serif);font-size:17px;font-weight:600;padding:10px 14px}
.tabla td.num{white-space:nowrap}
.tabla small{color:var(--gris);font-size:12px;white-space:normal}.tabla td:last-child small,.ceja bdi{white-space:nowrap}
.tabla .est{display:inline}
.rec-d{list-style:none;margin:0;padding:0;display:grid;gap:4px}
.rec-d small{color:var(--gris)}
.rn{display:inline-block;min-width:56px;font-weight:600;color:var(--acento);font-size:13px}
/* Texto */
.dormir{margin:22px 0 0;display:grid;gap:0;border-top:2px solid var(--tinta)}
.dormir>div{padding:16px 0;border-bottom:1px solid var(--linea);display:grid;gap:4px}
@media (min-width:720px){.dormir>div{grid-template-columns:260px minmax(0,1fr);gap:24px}}
.dormir dt{font-weight:600;font-size:17px}.dormir dd{margin:0;color:var(--gris)}
.tony{margin-top:34px;padding:22px;border-radius:18px;border:1px solid var(--tinta);background:var(--tarjeta);display:grid;gap:18px}
@media (min-width:860px){.tony{grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:32px}}
.tony h3{font-size:24px;margin-bottom:8px}.tony p{color:var(--gris);max-width:72ch}.tony p bdi{color:var(--tinta);font-weight:600}
.reglas{margin:22px 0 0;padding:0;list-style:none;counter-reset:r;display:grid;gap:14px}
.reglas li{counter-increment:r;position:relative;padding-inline-start:44px;font-size:16.5px;line-height:1.6}
.reglas li::before{content:counter(r);position:absolute;inset-inline-start:0;top:0;width:30px;height:30px;border-radius:50%;border:1.5px solid var(--acento);color:var(--acento);font-weight:600;font-size:14px;display:grid;place-items:center}
.tarifas{margin:0;border-top:2px solid var(--tinta)}
.tarifas>div{display:flex;justify-content:space-between;gap:16px;align-items:baseline;padding:14px 0;border-bottom:1px solid var(--linea)}
.tarifas dt{font-weight:500}.tarifas dd{margin:0;font-weight:600;font-size:19px;white-space:nowrap;text-align:end}.tarifas small{font-size:12.5px;font-weight:400;color:var(--gris)}
.rel{list-style:none;margin:20px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}
.rel a{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:58px;height:100%;padding:12px 16px;border:1px solid var(--linea2);border-radius:12px;background:var(--tarjeta);text-decoration:none;font-weight:600;line-height:1.3}
.rel a:hover{border-color:var(--tinta)}
.rel a span{color:var(--acento);flex:none}
.h-fuentes{margin-top:44px;font-size:clamp(22px,3vw,28px)!important}
.fuentes{margin:14px 0 0;padding-inline-start:18px;display:grid;gap:8px;font-size:14.5px;color:var(--gris);max-width:90ch}
.fuentes a{color:var(--tinta)}
/* Planificador */
.planf{display:grid;gap:18px;padding:20px;border-radius:18px;background:var(--tarjeta);border:1px solid var(--linea)}
@media (min-width:860px){.planf{grid-template-columns:1fr 1fr;gap:22px 32px}}
fieldset{border:0;margin:0;padding:0;min-width:0}
legend{font-size:13px;font-weight:600;color:var(--gris);margin-bottom:8px;letter-spacing:.02em;padding:0}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{position:relative;display:inline-flex}
.chip input{position:absolute;opacity:0;inset:0;margin:0;cursor:pointer}
.chip span{display:inline-flex;align-items:center;min-height:44px;padding:0 15px;border-radius:999px;border:1px solid var(--linea2);background:var(--papel);font-size:15px;font-weight:500;cursor:pointer;transition:background .15s,border-color .15s,color .15s;user-select:none}
.chip input:checked+span{background:var(--tinta);border-color:var(--tinta);color:#fff}
.chip input:focus-visible+span{outline:2px solid var(--acento);outline-offset:2px}
.chip:hover span{border-color:var(--tinta)}
.h-plan{margin-top:40px}
.dias{list-style:none;margin:18px 0 0;padding:0;display:grid;gap:12px}
.dia{display:grid;grid-template-columns:168px minmax(0,1fr) 210px;gap:16px 22px;padding:20px;border-radius:var(--r);background:var(--tarjeta);border:1px solid var(--linea)}
.dia-g{border-color:var(--linea2)}
@media (max-width:859px){.dia{grid-template-columns:1fr}}
.dia-n{display:flex;flex-direction:column;gap:8px}
@media (max-width:859px){.dia-n{flex-direction:row;align-items:center;justify-content:space-between;flex-wrap:wrap}}
.dia-n>span{font-family:var(--serif);font-size:26px;font-weight:600;line-height:1}
.dia-n b{align-self:flex-start;font-size:12.5px;font-weight:600;padding:4px 10px;border-radius:999px;line-height:1.3}
.dia-n b.con{background:var(--acento);color:var(--acento-t)}
.dia-n b.sin{border:1px solid var(--linea2);color:var(--gris)}
.dia-c h3{font-size:22px}
.dia-c>p{color:var(--gris);margin-top:6px;max-width:66ch}
.dia-c .dia-por{color:var(--tinta);font-size:15px}
.dia-tren{list-style:none;margin:10px 0 0;padding:10px 0 0;border-top:1px dashed var(--linea2);display:grid;gap:6px;font-size:14px}
.dia-hotel{margin-top:10px!important;padding-top:10px;border-top:1px dashed var(--linea2);font-size:14px}
.dia-comer{font-size:14px!important}
.dia-l{display:inline-flex;gap:6px;margin-top:12px;font-weight:600;font-size:15px;min-height:32px;align-items:center}
.dia-p{display:flex;flex-direction:column;align-items:flex-end;text-align:end;gap:2px}
@media (max-width:859px){.dia-p{align-items:flex-start;text-align:start;flex-direction:row;flex-wrap:wrap;align-items:baseline;gap:4px 10px;border-top:1px solid var(--linea);padding-top:12px}}
.dia-p b{font-size:28px;font-weight:600;letter-spacing:-.02em;line-height:1}
.dia-p span,.dia-p small{font-size:13px;color:var(--gris)}
.dia-p em{font-style:normal;font-size:13px;color:var(--gris);margin-top:4px}
@media (max-width:859px){.dia-p em{flex-basis:100%;margin-top:0}}
.dia-p-libre span{font-size:14px}
.total{margin-top:16px;padding:20px;border-radius:var(--r);background:var(--hondo);color:var(--hondo-t);border:1px solid var(--linea)}
.total p:first-child{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 14px}
.total span{font-weight:600}
.total b{font-size:30px;font-weight:600;letter-spacing:-.02em}
.total small{font-size:13px;font-weight:400}
.total em{font-style:normal;color:var(--hondo-g);font-size:14px}
.total-n{margin-top:8px!important;color:var(--hondo-g);font-size:14px;max-width:70ch}
.pedir{margin-top:22px}
/* Preguntas */
#preguntas details{border-top:1px solid var(--linea);padding:4px 0}
#preguntas details:last-of-type{border-bottom:1px solid var(--linea)}
#preguntas summary{cursor:pointer;font-weight:600;font-size:17px;min-height:54px;display:flex;align-items:center;list-style:none;gap:12px;justify-content:space-between}
#preguntas summary::-webkit-details-marker{display:none}
#preguntas summary::after{content:"+";font-size:22px;color:var(--acento);flex:none}
#preguntas details[open] summary::after{content:"−"}
#preguntas details p{color:var(--gris);padding:0 0 16px;max-width:70ch}
#preguntas details p bdi{color:var(--tinta)}
#preguntas h2{margin-bottom:20px}
/* Cierre */
.cierre{padding:64px 0;background:var(--hondo);color:var(--hondo-t);text-align:center}
.cierre h2{font-size:clamp(28px,5vw,44px)}
.cierre p{color:var(--hondo-g);margin:10px auto 24px;max-width:50ch}
.btn{display:inline-flex;align-items:center;gap:10px;min-height:52px;padding:0 26px;border-radius:999px;background:var(--acento);color:var(--acento-t);font-weight:600;font-size:17px;text-decoration:none;transition:transform .15s;text-align:center}
.btn:active{transform:scale(.97)}
.btn-sec{background:transparent;color:var(--tinta);border:1.5px solid var(--tinta);white-space:nowrap}
@media (max-width:420px){.btn-sec{white-space:normal}}
footer{background:var(--papel2);padding-top:48px;color:var(--tinta)}
/* Móvil 24-11: la cabecera cabe en 320 px (antes el menú se salía 2 px) */
@media (max-width:400px){
.top .kap{gap:8px}
.top .marca{font-size:14px;gap:6px;min-width:0;flex:0 1 auto;white-space:normal;line-height:1.15}
.top .mn-nav{gap:4px!important;flex:0 0 auto}
.top .mn-js .mn-cta{padding:0 12px;font-size:14px}
}
main h1,main h2,main h3,main dt,main td,main th{overflow-wrap:break-word}
.indice a{min-height:44px}
.tarifas>div{flex-wrap:wrap;row-gap:4px}
.tarifas dt{flex:1 1 11em;min-width:0}
.tabla-scroll{contain:paint}
`.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '')
const CSS = `
:root{--papel:#f3eee4;--papel2:#ebe4d6;--tarjeta:#fbf8f2;--tinta:#1d1b18;--gris:#5c574f;--linea:rgba(29,27,24,.14);--linea2:rgba(29,27,24,.28);--acento:#b8381f;--acento-t:#fff;--acento-suave:rgba(184,56,31,.09);--hondo:#1d1b18;--hondo-t:#f3eee4;--hondo-g:rgba(243,238,228,.78);
--mn-tarjeta:var(--tarjeta);--mn-texto:var(--tinta);--mn-linea:var(--linea2);--mn-suave:var(--papel2);--mn-acento:var(--acento);
--sans:'Geist',system-ui,-apple-system,'Segoe UI',sans-serif;--serif:'Source Serif 4',Georgia,serif;--r:14px;color-scheme:light}
html[dir=rtl]{--sans:'IBM Plex Sans Arabic',system-ui,sans-serif;--serif:'IBM Plex Sans Arabic',system-ui,sans-serif}
*{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{transition:none!important;animation:none!important}}
body{margin:0;background:var(--papel);color:var(--tinta);font:400 16px/1.6 var(--sans);overflow-x:hidden}
a{color:inherit;text-underline-offset:3px}
h1,h2,h3{font-family:var(--serif);font-weight:600;line-height:1.12;margin:0;text-wrap:balance;letter-spacing:-.01em}
html[dir=rtl] h1,html[dir=rtl] h2,html[dir=rtl] h3{letter-spacing:0;line-height:1.4;font-weight:700}
p{margin:0}
bdi,.est,.fl{unicode-bidi:isolate}
.num,bdi,.op-p b,.dia-p b,.total b,.datos b{font-variant-numeric:tabular-nums}
[lang=ja]{font-family:'Hiragino Sans','Yu Gothic','Noto Sans JP',sans-serif;font-size:.86em;color:var(--gris);white-space:nowrap}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.kap{max-width:1120px;margin:0 auto;padding:0 16px}
@media (min-width:720px){.kap{padding:0 28px}}
.estrecho{max-width:860px}
.saltar{position:absolute;top:8px;inset-inline-start:16px;z-index:100;background:var(--tarjeta);padding:8px 12px;border-radius:8px;clip-path:inset(50%);width:1px;height:1px;overflow:hidden;white-space:nowrap}.saltar:focus{clip-path:none;width:auto;height:auto}
:focus-visible{outline:2px solid var(--acento);outline-offset:2px}
.top{position:sticky;top:0;z-index:50;background:color-mix(in srgb,var(--papel) 92%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--linea)}
.top .kap{display:flex;align-items:center;gap:12px;min-height:60px}
.marca{font:600 17px/1 var(--sans);text-decoration:none;white-space:nowrap;display:flex;gap:8px;align-items:center}
.marca span{color:var(--acento)}
@media (max-width:420px){.marca{font-size:15px}}
.migas ol{list-style:none;margin:0 0 18px;padding:0;display:flex;flex-wrap:wrap;gap:4px 8px;font-size:13.5px;color:var(--gris)}
.migas li{display:flex;gap:8px;align-items:center}.migas a{color:var(--gris)}
.heroe{padding:28px 0 36px}
@media (min-width:960px){.heroe{padding:52px 0 56px}}
.ceja{font:600 12px/1.3 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--acento);margin-bottom:14px}
html[dir=rtl] .ceja{letter-spacing:0;font-size:14px}
h1{font-size:clamp(32px,6.2vw,62px);max-width:20ch}
html[dir=rtl] h1{max-width:24ch}
.respuesta{margin-top:18px;font-size:17.5px;line-height:1.65;color:var(--gris);max-width:70ch}
.respuesta bdi{color:var(--tinta);font-weight:600}
.datos{list-style:none;margin:28px 0 0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
@media (min-width:860px){.datos{grid-template-columns:repeat(4,minmax(0,1fr))}}
.datos li{display:flex;flex-direction:column;gap:4px;padding:14px;border:1px solid var(--linea);border-radius:12px;background:var(--tarjeta)}
.datos span{font-size:13px;color:var(--gris);line-height:1.35}
.datos b{font-size:19px;font-weight:600;letter-spacing:-.01em;line-height:1.25}
.indice{position:sticky;top:60px;z-index:40;background:var(--papel);border-bottom:1px solid var(--linea)}
.indice ul{list-style:none;margin:0;padding:10px 0;display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}
.indice ul::-webkit-scrollbar{display:none}
.indice a{display:inline-flex;align-items:center;min-height:36px;padding:0 14px;border-radius:999px;border:1px solid var(--linea);text-decoration:none;font-size:14px;white-space:nowrap;background:var(--tarjeta)}
.indice a:hover{border-color:var(--tinta)}
.bloque{padding:52px 0;scroll-margin-top:112px}
@media (min-width:720px){.bloque{padding:76px 0}}
.bloque-claro{background:var(--papel2)}
.bloque h2{font-size:clamp(28px,4.6vw,42px)}
.h3{font-size:22px;margin:28px 0 10px}
.sub{color:var(--gris);margin:10px 0 26px;max-width:66ch;font-size:16.5px}
.nota{color:var(--gris);font-size:14px;margin:14px 0 0;max-width:80ch}
.parr{margin-top:14px;font-size:17px;line-height:1.7;max-width:70ch}
.parr bdi{font-weight:600}
.mas{margin-top:18px}.mas a{font-weight:600}
/* Buscador */
.busc{display:grid;grid-template-columns:minmax(0,1fr) 48px minmax(0,1fr);gap:10px;align-items:end;margin-top:22px;padding:18px;border-radius:18px;background:var(--tarjeta);border:1px solid var(--linea)}
@media (max-width:559px){.busc{grid-template-columns:minmax(0,1fr) 48px}.busc label:last-of-type{grid-column:1/-1}.giro{grid-row:1;grid-column:2;align-self:end}}
.busc label{display:grid;gap:6px;min-width:0}
.busc label>span{font-size:13px;font-weight:600;color:var(--gris);letter-spacing:.02em}
select{appearance:none;-webkit-appearance:none;width:100%;min-height:54px;padding:0 40px 0 14px;border:1px solid var(--linea2);border-radius:12px;background:var(--papel) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23888' stroke-width='1.8'/%3E%3C/svg%3E") no-repeat right 14px center;color:var(--tinta);font:500 17px/1.2 var(--sans)}
html[dir=rtl] select{padding:0 14px 0 40px;background-position:left 14px center}
.giro{width:48px;height:54px;border-radius:12px;border:1px solid var(--linea2);background:var(--papel);color:var(--tinta);font-size:20px;cursor:pointer}
.giro:hover{border-color:var(--tinta)}
.res-t{margin:26px 0 12px;font-weight:600;font-size:17px}
.res-t b{color:var(--acento)}
.aviso{margin:22px 0 0;padding:14px 16px;border-radius:12px;background:var(--acento-suave);border:1px solid var(--linea);max-width:80ch}
.ops{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.op{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px 22px;padding:18px;border-radius:var(--r);background:var(--tarjeta);border:1px solid var(--linea)}
@media (max-width:599px){.op{grid-template-columns:1fr}}
.sellos{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}
.sello{font-size:12px;font-weight:600;letter-spacing:.04em;padding:3px 10px;border-radius:999px;border:1px solid var(--acento);color:var(--acento)}
.op-l{font-family:var(--sans);font-size:19px;font-weight:600;line-height:1.3}
.op-r{margin-top:6px;font-size:15.5px;display:flex;flex-wrap:wrap;gap:4px 8px;align-items:baseline}
.fl{color:var(--acento);font-weight:700}
.op-x{list-style:none;margin:10px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:6px}
.op-x li{font-size:13px;padding:4px 10px;border-radius:8px;background:var(--papel2);line-height:1.4}
.op-c{margin-top:10px;color:var(--gris);font-size:15px;max-width:64ch}
.op-f{margin-top:8px;font-size:12.5px;color:var(--gris)}
.op-p{display:flex;flex-direction:column;align-items:flex-end;text-align:end;gap:8px;min-width:150px}
@media (max-width:599px){.op-p{flex-direction:row;flex-wrap:wrap;align-items:baseline;justify-content:space-between;text-align:start;border-top:1px solid var(--linea);padding-top:12px;min-width:0}}
.op-yen,.op-min{display:flex;flex-direction:column;gap:1px}
@media (max-width:599px){.op-yen,.op-min{align-items:flex-start}.op-min{align-items:flex-end;text-align:end}}
.op-yen b{font-size:30px;font-weight:600;letter-spacing:-.02em;line-height:1}
.op-min b{font-size:19px;font-weight:600}
.op-p span{font-size:12.5px;color:var(--gris)}
.op-des{font-size:12.5px;color:var(--gris);max-width:220px}
@media (max-width:599px){.op-des{flex-basis:100%;max-width:none;order:3}}
/* Tablas */
.tabla-scroll{overflow-x:auto;border:1px solid var(--linea);border-radius:var(--r);background:var(--tarjeta);-webkit-overflow-scrolling:touch}
.tabla{border-collapse:collapse;width:100%;min-width:860px;font-size:14.5px}
.tabla-rec{min-width:640px}
.tabla th,.tabla td{padding:12px 14px;text-align:start;vertical-align:top;border-bottom:1px solid var(--linea)}
.tabla thead th{font-size:12.5px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--gris);background:var(--papel2);position:sticky;top:0}
html[dir=rtl] .tabla thead th{letter-spacing:0;text-transform:none;font-size:13.5px}
.tabla tbody th{font-weight:600;max-width:240px}
.tabla .grupo th{background:var(--acento-suave);font-family:var(--serif);font-size:17px;font-weight:600;padding:10px 14px}
.tabla td.num{white-space:nowrap}
.tabla small{color:var(--gris);font-size:12px;white-space:normal}.tabla td:last-child small,.ceja bdi{white-space:nowrap}
.tabla .est{display:inline}
.rec-d{list-style:none;margin:0;padding:0;display:grid;gap:4px}
.rec-d small{color:var(--gris)}
.rn{display:inline-block;min-width:56px;font-weight:600;color:var(--acento);font-size:13px}
/* Texto */
.dormir{margin:22px 0 0;display:grid;gap:0;border-top:2px solid var(--tinta)}
.dormir>div{padding:16px 0;border-bottom:1px solid var(--linea);display:grid;gap:4px}
@media (min-width:720px){.dormir>div{grid-template-columns:260px minmax(0,1fr);gap:24px}}
.dormir dt{font-weight:600;font-size:17px}.dormir dd{margin:0;color:var(--gris)}
.tony{margin-top:34px;padding:22px;border-radius:18px;border:1px solid var(--tinta);background:var(--tarjeta);display:grid;gap:18px}
@media (min-width:860px){.tony{grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:32px}}
.tony h3{font-size:24px;margin-bottom:8px}.tony p{color:var(--gris);max-width:72ch}.tony p bdi{color:var(--tinta);font-weight:600}
.reglas{margin:22px 0 0;padding:0;list-style:none;counter-reset:r;display:grid;gap:14px}
.reglas li{counter-increment:r;position:relative;padding-inline-start:44px;font-size:16.5px;line-height:1.6}
.reglas li::before{content:counter(r);position:absolute;inset-inline-start:0;top:0;width:30px;height:30px;border-radius:50%;border:1.5px solid var(--acento);color:var(--acento);font-weight:600;font-size:14px;display:grid;place-items:center}
.tarifas{margin:0;border-top:2px solid var(--tinta)}
.tarifas>div{display:flex;justify-content:space-between;gap:16px;align-items:baseline;padding:14px 0;border-bottom:1px solid var(--linea)}
.tarifas dt{font-weight:500}.tarifas dd{margin:0;font-weight:600;font-size:19px;white-space:nowrap;text-align:end}.tarifas small{font-size:12.5px;font-weight:400;color:var(--gris)}
.rel{list-style:none;margin:20px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}
.rel a{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:58px;height:100%;padding:12px 16px;border:1px solid var(--linea2);border-radius:12px;background:var(--tarjeta);text-decoration:none;font-weight:600;line-height:1.3}
.rel a:hover{border-color:var(--tinta)}
.rel a span{color:var(--acento);flex:none}
.h-fuentes{margin-top:44px;font-size:clamp(22px,3vw,28px)!important}
.fuentes{margin:14px 0 0;padding-inline-start:18px;display:grid;gap:8px;font-size:14.5px;color:var(--gris);max-width:90ch}
.fuentes a{color:var(--tinta)}
/* Planificador */
.planf{display:grid;gap:18px;padding:20px;border-radius:18px;background:var(--tarjeta);border:1px solid var(--linea)}
@media (min-width:860px){.planf{grid-template-columns:1fr 1fr;gap:22px 32px}}
fieldset{border:0;margin:0;padding:0;min-width:0}
legend{font-size:13px;font-weight:600;color:var(--gris);margin-bottom:8px;letter-spacing:.02em;padding:0}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{position:relative;display:inline-flex}
.chip input{position:absolute;opacity:0;inset:0;margin:0;cursor:pointer}
.chip span{display:inline-flex;align-items:center;min-height:44px;padding:0 15px;border-radius:999px;border:1px solid var(--linea2);background:var(--papel);font-size:15px;font-weight:500;cursor:pointer;transition:background .15s,border-color .15s,color .15s;user-select:none}
.chip input:checked+span{background:var(--tinta);border-color:var(--tinta);color:var(--papel)}
.chip input:focus-visible+span{outline:2px solid var(--acento);outline-offset:2px}
.chip:hover span{border-color:var(--tinta)}
.h-plan{margin-top:40px}
.dias{list-style:none;margin:18px 0 0;padding:0;display:grid;gap:12px}
.dia{display:grid;grid-template-columns:168px minmax(0,1fr) 210px;gap:16px 22px;padding:20px;border-radius:var(--r);background:var(--tarjeta);border:1px solid var(--linea)}
.dia-g{border-color:var(--linea2)}
@media (max-width:859px){.dia{grid-template-columns:1fr}}
.dia-n{display:flex;flex-direction:column;gap:8px}
@media (max-width:859px){.dia-n{flex-direction:row;align-items:center;justify-content:space-between;flex-wrap:wrap}}
.dia-n>span{font-family:var(--serif);font-size:26px;font-weight:600;line-height:1}
.dia-n b{align-self:flex-start;font-size:12.5px;font-weight:600;padding:4px 10px;border-radius:999px;line-height:1.3}
.dia-n b.con{background:var(--acento);color:var(--acento-t)}
.dia-n b.sin{border:1px solid var(--linea2);color:var(--gris)}
.dia-c h3{font-size:22px}
.dia-c>p{color:var(--gris);margin-top:6px;max-width:66ch}
.dia-c .dia-por{color:var(--tinta);font-size:15px}
.dia-tren{list-style:none;margin:10px 0 0;padding:10px 0 0;border-top:1px dashed var(--linea2);display:grid;gap:6px;font-size:14px}
.dia-hotel{margin-top:10px!important;padding-top:10px;border-top:1px dashed var(--linea2);font-size:14px}
.dia-comer{font-size:14px!important}
.dia-l{display:inline-flex;gap:6px;margin-top:12px;font-weight:600;font-size:15px;min-height:32px;align-items:center}
.dia-p{display:flex;flex-direction:column;align-items:flex-end;text-align:end;gap:2px}
@media (max-width:859px){.dia-p{align-items:flex-start;text-align:start;flex-direction:row;flex-wrap:wrap;align-items:baseline;gap:4px 10px;border-top:1px solid var(--linea);padding-top:12px}}
.dia-p b{font-size:28px;font-weight:600;letter-spacing:-.02em;line-height:1}
.dia-p span,.dia-p small{font-size:13px;color:var(--gris)}
.dia-p em{font-style:normal;font-size:13px;color:var(--gris);margin-top:4px}
@media (max-width:859px){.dia-p em{flex-basis:100%;margin-top:0}}
.dia-p-libre span{font-size:14px}
.total{margin-top:16px;padding:20px;border-radius:var(--r);background:var(--hondo);color:var(--hondo-t)}
.total p:first-child{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 14px}
.total span{font-weight:600}
.total b{font-size:30px;font-weight:600;letter-spacing:-.02em}
.total small{font-size:13px;font-weight:400}
.total em{font-style:normal;color:var(--hondo-g);font-size:14px}
.total-n{margin-top:8px!important;color:var(--hondo-g);font-size:14px;max-width:70ch}
.pedir{margin-top:22px}
/* Preguntas */
#preguntas details{border-top:1px solid var(--linea);padding:4px 0}
#preguntas details:last-of-type{border-bottom:1px solid var(--linea)}
#preguntas summary{cursor:pointer;font-weight:600;font-size:17px;min-height:54px;display:flex;align-items:center;list-style:none;gap:12px;justify-content:space-between}
#preguntas summary::-webkit-details-marker{display:none}
#preguntas summary::after{content:"+";font-size:22px;color:var(--acento);flex:none}
#preguntas details[open] summary::after{content:"−"}
#preguntas details p{color:var(--gris);padding:0 0 16px;max-width:70ch}
#preguntas details p bdi{color:var(--tinta)}
#preguntas h2{margin-bottom:20px}
/* Cierre */
.cierre{padding:64px 0;background:var(--hondo);color:var(--hondo-t);text-align:center}
.cierre h2{font-size:clamp(28px,5vw,44px)}
.cierre p{color:var(--hondo-g);margin:10px auto 24px;max-width:50ch}
.btn{display:inline-flex;align-items:center;gap:10px;min-height:52px;padding:0 26px;border-radius:999px;background:var(--acento);color:var(--acento-t);font-weight:600;font-size:17px;text-decoration:none;transition:transform .15s;text-align:center}
.btn:active{transform:scale(.97)}
.btn-sec{background:transparent;color:var(--tinta);border:1.5px solid var(--tinta);white-space:nowrap}
@media (max-width:420px){.btn-sec{white-space:normal}}
footer{background:var(--papel2);padding-top:48px;color:var(--tinta)}
`.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '')

// ═════════════════════════════════════════════════════════════════════════════
for (const lang of LANGS) {
  for (const [clave, fn] of [['trenes', paginaTrenes], ['plan', paginaPlan]]) {
    const dir = join(root, 'public', RUTA[clave][lang])
    mkdirSync(dir, { recursive: true })
    const html = fn(lang)
    writeFileSync(join(dir, 'index.html'), html)
    console.log(`herramientas-viaje: ${RUTA[clave][lang]} (${Math.round(html.length / 1024)} KB)`)
  }
}
