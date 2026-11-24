// The English site map (Tony, 25-11-2026: «el inglés separado, otra cosa», but
// the same logic as Spanish: a ☰ that opens as a tree, and the same footer on
// every page). ONE list for the CabeceraEn menu, the PieEn footer and the static
// generators (scripts/cabecera-en.mjs bundles it with esbuild). Data only, from
// the important to the rest. Every route here already exists on the site.
import { PAGINAS, CORREO, enlaceGuia } from './contenido'
import { RESPUESTAS_PROPIAS } from './datosRespuestas'
import { RUTA_INVIERNO } from './datosInvierno'
import { CIUDADES, CIUDADES_TONY } from '../v8/ciudades'
import type { EnlaceArbol, RamaArbol } from './arbolEs'

export type { EnlaceArbol, RamaArbol }
export interface ArbolEn {
  primeros: EnlaceArbol[]; ramas: RamaArbol[]; legal: EnlaceArbol[]
  lema: string; correo: string; creditos: string; otrosIdiomas: string
  whatsapp: { texto: string; href: string }
}

/** Answer pages are titled with a long question: short labels in the tree. */
const RESPUESTA_CORTA: Record<string, string> = {
  '/en/kyoto-private-guide-2-hours/': 'Kyoto in 2 hours',
  '/en/kyoto-private-bike-tour/': 'Kyoto by bike',
  '/en/kyoto-private-guide-family/': 'Kyoto with your family',
  '/en/osaka-private-guide-hotel-pickup/': 'Osaka, from your hotel',
  '/en/nara-day-trip-from-osaka/': 'Day trip to Nara from Osaka',
  '/en/koyasan-day-trip-private-guide/': 'Kōyasan day trip',
  '/en/kobe-private-guide-one-day/': 'Kobe in one day',
  '/en/mosques-kansai/': 'Mosques and prayer rooms in Kansai',
  '/en/halal-kyoto-osaka/': 'Halal food in Kyoto and Osaka',
  '/en/spanish-speaking-guide-japan/': 'Spanish-speaking guide in Japan',
  '/en/arabic-speaking-guide-japan/': 'Arabic-speaking Muslim guide',
}
/** Which branch each answer page grows on. */
const DIAS = new Set(['/en/kyoto-private-guide-2-hours/', '/en/kyoto-private-bike-tour/', '/en/kyoto-private-guide-family/', '/en/osaka-private-guide-hotel-pickup/', '/en/nara-day-trip-from-osaka/', '/en/koyasan-day-trip-private-guide/', '/en/kobe-private-guide-one-day/'])
const VIAJE = new Set(['/en/mosques-kansai/', '/en/halal-kyoto-osaka/'])

export function arbolEn(): ArbolEn {
  const p = PAGINAS.en
  const respuestas = RESPUESTAS_PROPIAS.filter(([, r]) => r.lang === 'en').map(([, r]) => ({ texto: RESPUESTA_CORTA[r.ruta] ?? r.titulo, ruta: r.ruta, app: true }))
  const ramas: RamaArbol[] = [
    { id: 'experiencias', titulo: 'Experiences', enlaces: [
      { texto: 'All experiences', ruta: '/en/#experiencias' },
      ...CIUDADES_TONY.map((c) => ({ texto: CIUDADES[c].nombre.en, ruta: `/en/${c}/`, app: true })),
      { texto: 'Hiking and mountains', ruta: '/en/hiking/', app: true, destacado: true },
      { texto: 'Tokyo, Mount Fuji and more: routes', ruta: '/en/routes/', app: true },
      ...respuestas.filter((r) => DIAS.has(r.ruta)),
      { texto: 'All destinations', ruta: '/en/destinations/' },
    ] },
    { id: 'temporadas', titulo: 'Seasons', enlaces: [
      { texto: 'Winter in Kansai', ruta: RUTA_INVIERNO.en, app: true, nuevo: true },
      { texto: 'Autumn in Kyoto', ruta: '/en/kyoto-autumn/', app: true },
      { texto: 'Cherry blossom in Kyoto', ruta: '/en/kyoto-cherry-blossom/', app: true },
    ] },
    { id: 'viaje', titulo: 'Plan your trip', enlaces: [
      ...(p.mercado.enlaces ?? []).map((e) => ({ texto: e.texto, ruta: e.ruta, app: true })),
      { texto: 'Travelling from the UK', ruta: '/en/from-uk/', app: true },
      { texto: 'Travelling from the US', ruta: '/en/from-usa/', app: true },
      { texto: 'Perks and discounts', ruta: '/en/perks/', app: true },
      { texto: 'Kansai Airport', ruta: '/en/kansai-airport/', app: true },
      { texto: 'Osaka to Kyoto', ruta: '/en/osaka-to-kyoto/', app: true },
      ...respuestas.filter((r) => VIAJE.has(r.ruta)),
      { texto: 'Free Kansai travel tools', ruta: '/en/tools/' },
      { texto: 'Is a private guide worth it? Calculator', ruta: '/en/private-guide-calculator/' },
      { texto: 'Legends and lost places of Japan', ruta: '/en/legends/' },
      { texto: 'TikTok Japan · special price', ruta: '/tiktok/en/' },
      { texto: 'Yuru Camp△ anime map', ruta: 'https://2troll.github.io/yurucamp-mapa/guia/en.html', fuera: true },
      { texto: 'Panduan Halal Kansai', ruta: 'https://2troll.github.io/yubisashi/panduan/', fuera: true },
    ] },
    { id: 'tony', titulo: 'About us', enlaces: [
      ...respuestas.filter((r) => !DIAS.has(r.ruta) && !VIAJE.has(r.ruta)),
      { texto: 'What a private guide in Kyoto costs', ruta: '/en/kyoto-private-guide-cost/', app: true },
      { texto: 'Tokyo, anime and pop culture · Iheb', ruta: '/en/tokyo-anime-guide/' },
      { texto: 'Muslim guide in Tokyo', ruta: '/en/muslim-guide-tokyo/' },
      { texto: 'Muslim female guides', ruta: '/en/muslim-female-guide-japan/' },
      { texto: 'Larion · private guide in Kansai and Hiroshima', ruta: '/larion/' },
      { texto: 'Family and group trips (in Spanish)', ruta: '/familias/' },
      { texto: 'Agencies · Hanma Travel Partners', ruta: '/partners/?lang=en' },
      { texto: 'Agencies · Request a guide quote', ruta: 'https://forms.fillout.com/t/shhKbMZeRtus', fuera: true },
      { texto: 'Tony Kansai Guide is a company of HBH Group', ruta: 'https://hbh.tonykansaiguide.com/', fuera: true },
    ] },
  ]
  // Each link appears once.
  const visto = new Set<string>(['/en/', '/en/prices/'])
  for (const r of ramas) r.enlaces = r.enlaces.filter((e) => !visto.has(e.ruta) && !!visto.add(e.ruta))
  return {
    primeros: [
      { texto: 'Home', ruta: '/en/', app: true },
      { texto: 'Reviews', ruta: '/en/#resenas' },
      { texto: 'Prices', ruta: '/en/prices/' },
    ],
    ramas,
    legal: [
      { texto: p.pie.legal, ruta: '/legal/?lang=en', app: true },
      { texto: p.pie.privacidad, ruta: '/privacy/?lang=en', app: true },
      { texto: p.pie.condiciones, ruta: '/terms/?lang=en', app: true },
      { texto: p.pie.cookies, ruta: '/cookies/?lang=en', app: true },
    ],
    lema: p.pie.lema, correo: CORREO, creditos: p.pie.creditos, otrosIdiomas: p.pie.otrosIdiomas,
    // The same greeting the home page contact template starts with.
    whatsapp: { texto: 'Message Tony on WhatsApp', href: enlaceGuia('tony', 'Hi Tony, I\'m writing from your website.') },
  }
}
