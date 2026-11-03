// Franja «Nuestros guías» para las secciones estáticas (/tr/, /fr/, /ru/kndr/,
// /familias/, /private/). Misma marca y misma hoja que la de React
// (src/v7/Equipo.tsx + src/v7/equipo.css) y mismos datos (scripts/equipo.json).
//
//   import { equipoHTML, equipoCSS, equipoFuente } from './equipo-estatico.mjs'
//   <head>…${equipoFuente}<style>${CSS}${equipoCSS}</style></head>
//   …</footer>\n${equipoHTML({ lang: 'tr', actual: 'ferhat', variante: 'tr' })}
//
// lang: idioma de la página (es, en, ar, ru, tr, fr). actual: id del guía de
// la página (tony, larion, ferhat, iheb, antonio, mario) o null. variante:
// 'tr' | 'fr' | 'kndr' | 'familias' toma fondo y acento de esa página (lee sus
// variables CSS); sin variante, los colores píxel de la web principal.

import { readFileSync } from 'node:fs'

const DATOS = JSON.parse(readFileSync(new URL('./equipo.json', import.meta.url), 'utf8'))
const IDIOMAS_UI = Object.keys(DATOS.ui.titulo)
const IDS = DATOS.guias.map((g) => g.id)
const VARIANTES = ['tr', 'fr', 'kndr', 'familias']

/** La hoja de src/v7/equipo.css, sin comentarios ni saltos (va dentro de un <style>). */
export const equipoCSS = readFileSync(new URL('../src/v7/equipo.css', import.meta.url), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .trim()

/** DotGothic16 (OFL) de Google Fonts, solo latín: para el <head> de cada página estática. */
export const equipoFuente = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap">'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function version(g, lang) {
  const l = lang in g.versiones ? lang : Object.keys(g.versiones)[0]
  return { lang: l, v: g.versiones[l] }
}

function tarjeta(g, langPagina, aqui) {
  const { lang, v } = version(g, langPagina)
  const rtl = lang === 'ar'
  const nombresIdiomas = g.idiomas.map((i) => DATOS.idiomas[i]).join(', ')
  const cara = g.foto
    ? `<img class="eq-foto" src="${esc(g.foto)}" alt="${esc(v.alt ?? v.nombre)}" width="72" height="72" loading="lazy" decoding="async">`
    : `<span class="eq-emblema" aria-hidden="true"><span>${esc(g.emblema)}</span></span>`
  return `<li class="eq-tarjeta${aqui ? ' eq-aqui' : ''}" lang="${lang}" dir="${rtl ? 'rtl' : 'ltr'}">`
    + (aqui ? `<span class="eq-sello" lang="${langPagina}" dir="${langPagina === 'ar' ? 'rtl' : 'ltr'}">${esc(DATOS.ui.aqui[langPagina])}</span>` : '')
    + `<div class="eq-cabeza">${cara}<div><h3 class="eq-nombre">${esc(v.nombre)}</h3>`
    + `<ul class="eq-idiomas" aria-label="${esc(nombresIdiomas)}">${g.idiomas.map((i) => `<li title="${esc(DATOS.idiomas[i])}" aria-hidden="true">${i.toUpperCase()}</li>`).join('')}</ul></div></div>`
    + `<p class="eq-linea">${esc(v.linea)}</p><p class="eq-desc">${esc(v.desc)}</p>`
    + `<div class="eq-acciones"><a href="${esc(v.ruta)}" class="eq-boton" hreflang="${lang}"${aqui ? ' aria-current="page"' : ''}>${esc(v.boton)}<span class="eq-oculto">${esc(v.oculto)}</span> <span aria-hidden="true">${rtl ? '←' : '→'}</span></a>`
    + (g.extra ? `<a href="${esc(g.extra.ruta)}" class="eq-extra" hreflang="${g.extra.lang}" lang="${g.extra.lang}">${esc(g.extra.texto)}</a>` : '')
    + '</div></li>'
}

/** Marca de la franja. Falla en voz alta con un idioma, guía o variante que no existen. */
export function equipoHTML({ lang, actual = null, variante = null } = {}) {
  if (!IDIOMAS_UI.includes(lang)) throw new Error(`equipoHTML: idioma «${lang}» no está en scripts/equipo.json (hay: ${IDIOMAS_UI.join(', ')})`)
  if (actual !== null && !IDS.includes(actual)) throw new Error(`equipoHTML: guía «${actual}» no existe (hay: ${IDS.join(', ')})`)
  if (variante !== null && !VARIANTES.includes(variante)) throw new Error(`equipoHTML: variante «${variante}» no existe (hay: ${VARIANTES.join(', ')})`)
  const id = `eq-titulo-${lang}`
  return `<section class="eq${variante ? ` eq--${variante}` : ''}" aria-labelledby="${id}" lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}"><div class="eq-kap">`
    + `<p class="eq-ante"><span aria-hidden="true">案内人</span> ${esc(DATOS.ui.equipo[lang])}</p>`
    + `<h2 class="eq-titulo" id="${id}">${esc(DATOS.ui.titulo[lang])}</h2>`
    + `<p class="eq-sub">${esc(DATOS.ui.sub[lang])}</p>`
    + `<ul class="eq-fila">${DATOS.guias.map((g) => tarjeta(g, lang, g.id === actual)).join('')}</ul>`
    + '</div></section>'
}
