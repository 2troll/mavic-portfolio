// Enlaces a los tours añadidos el 11-11-2026 (2 horas en Kioto y Kioto en bici)
// desde las páginas que ya listaban tours: página de ciudad de Kioto, rutas y
// las demás páginas de respuesta. Antes solo los enlazaba una línea bajo los
// precios de Tony y el pie: Google y las IAs dan poco peso a una página casi huérfana.
// Precios: los mismos que las páginas (PRECIO_CORTO y PRECIO_GUIA); nada inventado.

import { Link } from 'react-router-dom'
import { GUIAS, contactoLd } from './contenido'
import { PRECIO_GUIA } from './datosGuias'
import { NUEVAS_RESPUESTAS, PRECIO_CORTO } from './datosRespuestasNuevas'
import { yenLocal } from './formato'

const BASE = 'https://tonykansaiguide.com'
type Lengua = 'es' | 'en' | 'ar'
type Tour = 'corto' | 'bici'

const TITULO: Record<Lengua, string> = {
  es: 'Más tours de Tony en Kioto',
  en: 'More Kyoto tours with Tony',
  ar: 'جولات أخرى مع طوني في كيوتو',
}

const y = (n: number, lang: Lengua) => yenLocal(n, lang)

/** Texto de cada tarjeta, sacado de lo que ya dicen las páginas de cada tour. */
const TARJETA: Record<Lengua, Record<Tour, { kanji: string; titulo: string; sub: string }>> = {
  es: {
    corto: { kanji: '時', titulo: 'Tour privado de 2 horas en Kioto', sub: `${y(PRECIO_CORTO, 'es')} por grupo de hasta 6 · Gion, Fushimi Inari o Kiyomizu` },
    bici: { kanji: '輪', titulo: 'Kioto en bici con guía privado', sub: `Medio día ${y(PRECIO_GUIA.medio, 'es')} o día completo ${y(PRECIO_GUIA.completo, 'es')} por grupo · bicis aparte` },
  },
  en: {
    corto: { kanji: '時', titulo: '2-hour private tour in Kyoto', sub: `${y(PRECIO_CORTO, 'en')} per group of up to 6 · Gion, Fushimi Inari or Kiyomizu-dera` },
    bici: { kanji: '輪', titulo: 'Private guided bike tour in Kyoto', sub: `Half day ${y(PRECIO_GUIA.medio, 'en')} or full day ${y(PRECIO_GUIA.completo, 'en')} per group · bikes extra` },
  },
  ar: {
    corto: { kanji: '時', titulo: 'جولة خاصة لمدة ساعتين في كيوتو', sub: `${y(PRECIO_CORTO, 'ar')} للمجموعة حتى 6 أشخاص · غيون أو فوشيمي إيناري أو كيوميزو-ديرا` },
    bici: { kanji: '輪', titulo: 'جولة خاصة بالدراجة في كيوتو', sub: `نصف يوم ${y(PRECIO_GUIA.medio, 'ar')} أو يوم كامل ${y(PRECIO_GUIA.completo, 'ar')} للمجموعة · الدراجات على حدة` },
  },
}

const ID: Record<Lengua, Record<Tour, keyof typeof NUEVAS_RESPUESTAS>> = {
  es: { corto: 'corto-es', bici: 'bici-es' },
  en: { corto: 'corto-en', bici: 'bici-en' },
  ar: { corto: 'corto-ar', bici: 'bici-ar' },
}

export const esLenguaTours = (lang: string): lang is Lengua => lang === 'es' || lang === 'en' || lang === 'ar'

/** Tarjetas a los dos tours nuevos; `sin` quita la de la página en la que se está. */
export function ToursNuevos({ lang, sin }: { lang: string; sin?: string }) {
  if (!esLenguaTours(lang)) return null
  const tours = (['corto', 'bici'] as const).filter((t) => NUEVAS_RESPUESTAS[ID[lang][t]].ruta !== sin)
  if (tours.length === 0) return null
  const flecha = lang === 'ar' ? '←' : '→'
  return (
    <section className="v7-seccion v7-tours-nuevos">
      <h2>{TITULO[lang]}</h2>
      <div className="v7-tours-nuevos-rejilla">
        {tours.map((t) => (
          <Link key={t} to={NUEVAS_RESPUESTAS[ID[lang][t]].ruta} className="v7-puerta-montana">
            <span className="v7-kanji" lang="ja" aria-hidden="true">{TARJETA[lang][t].kanji}</span>
            <span><strong>{TARJETA[lang][t].titulo}</strong><small>{TARJETA[lang][t].sub}</small></span>
            <span aria-hidden="true">{flecha}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

/** schema.org TouristTrip de la página de un tour nuevo (corto o bici), con sus
 *  ofertas reales. Las demás páginas de respuesta no son tours: devuelve null. */
export function viajeTourNuevo(id: string) {
  const p = (NUEVAS_RESPUESTAS as Record<string, (typeof NUEVAS_RESPUESTAS)[keyof typeof NUEVAS_RESPUESTAS]>)[id]
  if (!p || !esLenguaTours(p.lang)) return null
  const url = `${BASE}${p.ruta}`
  const grupo = { '@type': 'QuantitativeValue', maxValue: 6, unitText: 'people per group' }
  const oferta = (name: string, price: number) => ({
    '@type': 'Offer', name, price, priceCurrency: 'JPY', availability: 'https://schema.org/InStock', url, eligibleQuantity: grupo,
  })
  const offers = p.grupo === 'corto'
    ? [oferta('2 hours', PRECIO_CORTO)]
    : [oferta('Half day (4 h), bike rental not included', PRECIO_GUIA.medio), oferta('Full day (8 h), bike rental not included', PRECIO_GUIA.completo)]
  return {
    '@type': 'TouristTrip',
    '@id': `${url}#tour`,
    name: TARJETA[p.lang][p.grupo as Tour].titulo,
    description: p.seo.descripcion,
    url,
    inLanguage: p.lang,
    touristType: 'Private tour',
    image: `${BASE}${p.og}`,
    provider: { '@type': 'Person', '@id': `${BASE}/#tony`, name: GUIAS.tony.nombre, ...contactoLd('tony'), worksFor: { '@id': `${BASE}/#negocio` } },
    offers,
  }
}

/** Los dos tours nuevos de un idioma, para la lista de tours (ItemList) de la página de Tony. */
export function viajesToursNuevos(lang: string) {
  if (!esLenguaTours(lang)) return []
  return (['corto', 'bici'] as const).map((t) => viajeTourNuevo(ID[lang][t])!).filter(Boolean)
}
