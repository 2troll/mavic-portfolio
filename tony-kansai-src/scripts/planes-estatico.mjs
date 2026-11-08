// Planes de venta (guía + experiencias) para las páginas estáticas de los guías.
// Misma fuente y mismo HTML que la web React: src/v7/datosPlanes.ts.
//
//   import { planesHTML, planesLD, planesCSS } from './planes-estatico.mjs'
//   <style>…${planesCSS}</style> … ${planesHTML('tr', 'ferhat')}
//   JSON-LD: planesLD('tr', 'ferhat', 'https://tonykansaiguide.com/tr/')
import { readFileSync } from 'node:fs'

export const { planesHTML, planesLD, PLANES } = await import('../src/v7/datosPlanes.ts')

export const planesCSS = readFileSync(new URL('../src/v7/planes.css', import.meta.url), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .trim()

const { planesHTML: _html, planesLD: _ld } = await import('../src/v7/datosPlanes.ts')

/** Bloque + su JSON-LD (OfferCatalog) en un solo trozo de HTML. */
export function planesBloque(lang, guia, url) {
  const ld = JSON.stringify({ '@context': 'https://schema.org', ..._ld(lang, guia, url) }).replace(/</g, '\\u003c')
  return `${_html(lang, guia)}<script type="application/ld+json">${ld}</script>`
}
