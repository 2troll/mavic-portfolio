// Cabecera estática de cada página (título, descripción, foto para compartir,
// idiomas hermanos). La lee scripts/rutas-estaticas.mjs al desplegar y la
// escribe en el index.html de cada carpeta: así Google, Bing y las vistas
// previas de WhatsApp ven el título de esa página, no el de la portada, sin
// esperar a que arranque React. Usa los mismos datos que las páginas.

import { PAGINAS, HERMANAS } from '../v7/contenido'
import { MONTANA } from '../v7/datosMontana'
import { PAGINAS_ITIN, SEO_ITIN } from '../v7/seoItin'
import type { ItinPaginaId } from '../v7/seoItin'
import { CIUDADES, CIUDADES_LARION, CIUDADES_TONY, tituloSeo } from '../v8/ciudades'

export interface Cabecera {
  titulo: string
  descripcion: string
  imagen: string // ruta absoluta en el sitio (/v8/og/...)
  lang: string
  dir: 'ltr' | 'rtl'
  alternos: [string, string][] // [hreflang, ruta]
}

const dirDe = (l: string) => (l === 'ar' ? 'rtl' : 'ltr') as 'ltr' | 'rtl'
const sinBarras = (r: string) => r.replace(/^\/+|\/+$/g, '')

export function cabeceras(): Record<string, Cabecera> {
  const todas: Record<string, Cabecera> = {}

  // Páginas de idioma (Tony es/en/ar, Larion ru/larion).
  for (const p of Object.values(PAGINAS)) {
    todas[sinBarras(p.ruta)] = {
      titulo: p.seo.titulo, descripcion: p.seo.descripcion, imagen: `/v8/og/${p.id}.jpg`, lang: p.lang, dir: dirDe(p.lang),
      alternos: HERMANAS[p.guia].map((h) => [PAGINAS[h.id].lang, PAGINAS[h.id].ruta]),
    }
  }

  // Montaña.
  const montes = Object.values(MONTANA)
  for (const m of montes) {
    todas[sinBarras(m.ruta)] = {
      titulo: m.seo.titulo, descripcion: m.seo.descripcion, imagen: '/v8/og/montana.jpg', lang: m.lang, dir: dirDe(m.lang),
      alternos: montes.map((x) => [x.lang, x.ruta]),
    }
  }

  // El día, hora a hora.
  for (const [id, pg] of Object.entries(PAGINAS_ITIN) as [ItinPaginaId, (typeof PAGINAS_ITIN)[ItinPaginaId]][]) {
    const hermanas = Object.values(PAGINAS_ITIN).filter((x) => x.guia === pg.guia)
    todas[sinBarras(pg.ruta)] = {
      titulo: SEO_ITIN[id].titulo, descripcion: SEO_ITIN[id].descripcion, imagen: '/v8/og/rutas.jpg', lang: pg.lang, dir: dirDe(pg.lang),
      alternos: hermanas.map((x) => [x.lang, x.ruta]),
    }
  }

  // Ciudades (v8).
  const prefijos = [
    { p: 'es', lang: 'es', guia: 'tony' }, { p: 'en', lang: 'en', guia: 'tony' }, { p: 'ar', lang: 'ar', guia: 'tony' },
    { p: 'ru', lang: 'ru', guia: 'larion' }, { p: 'larion', lang: 'en', guia: 'larion' },
  ] as const
  for (const { p, lang, guia } of prefijos) {
    const lista = guia === 'larion' ? CIUDADES_LARION : CIUDADES_TONY
    const hermanos = prefijos.filter((x) => x.guia === guia)
    for (const id of lista) {
      const c = CIUDADES[id]
      todas[`${p}/${id}`] = {
        titulo: tituloSeo(id, lang, guia),
        // Igual que en la página: lema y cuatro zonas (con todas pasaba de 160).
        descripcion: `${c.lema[lang]} ${c.zonas.slice(0, 4).map((z) => z.nombre[lang]).join(', ')}.`,
        imagen: `/v8/og/${id}.jpg`, lang, dir: dirDe(lang),
        alternos: hermanos.map((h) => [h.lang, `/${h.p}/${id}/`]),
      }
    }
  }
  // Páginas legales: cada una con su título (antes todas heredaban el de la
  // portada y Google las veía duplicadas). Están en inglés y cambian con ?lang.
  const LEGALES: [string, string, string][] = [
    ['privacy', 'Privacy Policy', 'How Tony Kansai Guide handles your personal data: what we collect, why, how long we keep it and your rights.'],
    ['terms', 'Terms and Conditions', 'Terms for booking a private tour with Tony Kansai Guide: prices per group, payment, cancellation and responsibilities.'],
    ['cookies', 'Cookie Policy', 'Which cookies tonykansaiguide.com uses, what they do and how to accept, decline or delete them.'],
    ['safety', 'Safety on Tour', 'How we keep private tours in Kansai safe: emergencies, health, weather, hiking and useful numbers in Japan.'],
    ['legal', 'Legal Notice', 'Legal notice of Tony Kansai Guide, a private tour guide service in Kansai, Japan: owner, contact and conditions of use.'],
    ['accessibility', 'Accessibility', 'Accessibility statement for tonykansaiguide.com: what we support, known limits and how to report a problem.'],
  ]
  for (const [ruta, titulo, descripcion] of LEGALES) {
    todas[ruta] = { titulo: `${titulo} | Tony Kansai Guide`, descripcion, imagen: '/v8/og/es.jpg', lang: 'en', dir: 'ltr', alternos: [] }
  }
  return todas
}
