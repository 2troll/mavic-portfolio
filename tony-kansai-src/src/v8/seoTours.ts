// Datos estructurados de los tours (schema.org TouristTrip) para Google: una
// lista en la página de cada guía y el tour completo en cada página de ciudad.
// Precios y duraciones salen de los mismos tramos que las tarjetas.
import { GUIAS } from '../v7/contenido'
import { PRECIO } from '../v7/datosRutas'
import type { Tramo } from '../v7/datosRutas'
import { CIUDADES } from './ciudades'
import type { CiudadId, Lengua } from './ciudades'
import { tramos } from './Mosaico'

const BASE = 'https://tonykansaiguide.com'
const NOMBRE_TRAMO: Record<Tramo, string> = { medio: 'Half day (4 h)', completo: 'Full day (8 h)', lejos: 'Long day trip' }

export function viajeTuristico(id: CiudadId, lang: Lengua, guia: 'tony' | 'larion', prefijo: string) {
  const c = CIUDADES[id]
  const g = GUIAS[guia]
  const t = tramos(id)
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: `${c.nombre[lang]} · Tony Kansai Guide`,
    description: c.lema[lang],
    url: `${BASE}${prefijo}/${id}/`,
    inLanguage: lang,
    touristType: 'Private tour',
    image: `${BASE}/v8/zonas/${c.zonas[0].id}.webp`,
    itinerary: {
      '@type': 'ItemList',
      itemListElement: c.zonas.map((z, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'TouristAttraction', name: z.nombre[lang], description: z.linea[lang] } })),
    },
    provider: { '@type': 'Person', name: g.nombre, telephone: `+${g.wa}`, worksFor: { '@type': 'LocalBusiness', name: 'Tony Kansai Guide', url: BASE } },
    offers: t.map((x) => ({
      '@type': 'Offer',
      price: PRECIO[x],
      priceCurrency: 'JPY',
      availability: 'https://schema.org/InStock',
      url: `${BASE}${prefijo}/${id}/`,
      eligibleQuantity: { '@type': 'QuantitativeValue', maxValue: 6, unitText: 'people per group' },
      ...(x === 'lejos' ? { priceSpecification: { '@type': 'PriceSpecification', minPrice: PRECIO[x], priceCurrency: 'JPY' } } : {}),
      name: NOMBRE_TRAMO[x],
    })),
  }
}

/** Lista de tours de un guía, para su página. */
export function listaTours(ids: CiudadId[], lang: Lengua, guia: 'tony' | 'larion', prefijo: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: ids.map((id, i) => {
      const { '@context': _c, ...viaje } = viajeTuristico(id, lang, guia, prefijo)
      return { '@type': 'ListItem', position: i + 1, item: viaje }
    }),
  }
}

/** Migas: guía › ciudad. */
export function migas(lang: Lengua, prefijo: string, inicio: string, id: CiudadId) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: inicio, item: `${BASE}${prefijo}/` },
      { '@type': 'ListItem', position: 2, name: CIUDADES[id].nombre[lang], item: `${BASE}${prefijo}/${id}/` },
    ],
  }
}
