// Pie de empresa para las secciones estáticas (/tr/, /fr/, /ru/kndr/, /familias/,
// /private/…): misma marca y misma hoja que la de React (src/v7/Equipo.tsx +
// src/v7/equipo.css) y mismos datos (scripts/equipo.json). 21-11-2026: sin fotos.
//
//   import { equipoHTML, equipoCSS, equipoFuente } from './equipo-estatico.mjs'
//   <head>…${equipoFuente}<style>${CSS}${equipoCSS}</style></head>
//   …${equipoHTML({ lang: 'tr', actual: 'ferhat', variante: 'tr' })}
//
// lang: idioma de la página (es, en, ar, ru, tr, fr). actual: id del guía de la
// página (marca su enlace con aria-current) o null. variante: toma fondo y tinta
// de esa página ('tr' | 'fr' | 'kndr' | 'familias' | 'private' | 'filipp').

import { readFileSync } from 'node:fs'

const DATOS = JSON.parse(readFileSync(new URL('./equipo.json', import.meta.url), 'utf8'))
const IDIOMAS_UI = Object.keys(DATOS.ui.lema)
const IDS = DATOS.guias.map((g) => g.id)
const VARIANTES = ['tr', 'fr', 'kndr', 'familias', 'private', 'filipp']

/** La hoja de src/v7/equipo.css, sin comentarios ni saltos (va dentro de un <style>). */
export const equipoCSS = readFileSync(new URL('../src/v7/equipo.css', import.meta.url), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .trim()

/** Ya no hay letra propia; se deja vacía para no romper a quien la importa. */
export const equipoFuente = ''

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function version(g, lang) {
  const l = lang in g.versiones ? lang : Object.keys(g.versiones)[0]
  return { lang: l, v: g.versiones[l] }
}

/** Una fila: el servicio en el idioma del guía (texto del enlace) y su nombre, pequeño. */
function fila(g, langPagina, aqui) {
  const { lang, v } = version(g, langPagina)
  return `<li lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}"><a href="${esc(v.ruta)}" hreflang="${lang}"${aqui ? ' aria-current="page"' : ''}>${esc(v.linea)}</a> <span class="eq-quien">${esc(v.nombre)}</span></li>`
}

/** Marca del pie. Falla en voz alta con un idioma, guía o variante que no existen. */
export function equipoHTML({ lang, actual = null, variante = null } = {}) {
  if (!IDIOMAS_UI.includes(lang)) throw new Error(`equipoHTML: idioma «${lang}» no está en scripts/equipo.json (hay: ${IDIOMAS_UI.join(', ')})`)
  if (actual !== null && !IDS.includes(actual)) throw new Error(`equipoHTML: guía «${actual}» no existe (hay: ${IDS.join(', ')})`)
  if (variante !== null && !VARIANTES.includes(variante)) throw new Error(`equipoHTML: variante «${variante}» no existe (hay: ${VARIANTES.join(', ')})`)
  return `<section class="eq${variante ? ` eq--${variante}` : ''}" aria-label="${esc(DATOS.ui.enlace[lang])}" lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}"><div class="eq-kap">`
    + `<p class="eq-marca"><strong>Tony Kansai Guide</strong> · ${esc(DATOS.ui.lema[lang])}</p>`
    + `<details class="eq-guias" id="eq-titulo-${lang}"><summary>${esc(DATOS.ui.enlace[lang])}</summary>`
    + `<ul>${DATOS.guias.map((g) => fila(g, lang, g.id === actual)).join('')}</ul></details>`
    + '</div></section>'
}
