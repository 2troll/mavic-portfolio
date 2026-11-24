// Common English footer for the static pages: the same HTML, CSS
// (src/v7/pie-en.css, read as is) and tree (src/v7/arbolEn.ts) as PieEn.tsx.
//
//   import { pieEnHTML, pieEnCSS } from './pie-en.mjs'
//   <style>…${pieEnCSS}</style> … ${pieEnHTML({ idiomas, creditos, extra, equipo })}
import { ARBOL_EN, cssDe, esc, iconoWa, logoEn, idiomasEnHTML } from './cabecera-en.mjs'

const { CREDITOS } = await import('../src/v7/contenido.ts')
export const pieEnCSS = cssDe('pie-en.css')
const VISIBLES = 6

function enlace(e) {
  const nuevo = e.nuevo ? '<small class="pie-en-nuevo">new</small>' : ''
  return `<a href="${esc(e.ruta)}"${e.fuera ? ' target="_blank" rel="noopener"' : ''}>${esc(e.texto)}${nuevo}</a>`
}
const li = (e) => `<li>${enlace(e)}</li>`

// On a phone, accordions closed on load (open in the HTML: Google).
const JS = `(()=>{if(matchMedia('(max-width:720px)').matches)[].forEach.call(document.querySelectorAll('.pie-en-cols>details'),function(d){d.open=false})})()`

/**
 * idiomas: [{ lang, ruta, texto }] this page in other languages; without it, the home pages.
 * creditos: HTML <li> with the page's own photos (added to the common ones).
 * extra: small HTML for the last line (e.g. «Updated: …»).
 * equipo: HTML of the team strip (equipoHTML), after the footer.
 */
export function pieEnHTML({ idiomas = [], creditos = '', extra = '', equipo = '' } = {}) {
  const cols = ARBOL_EN.ramas.map((r) => {
    const orden = [...r.enlaces.filter((e) => e.destacado), ...r.enlaces.filter((e) => !e.destacado)]
    const vis = orden.slice(0, VISIBLES), resto = orden.slice(VISIBLES)
    return `<details class="pie-en-col" open><summary>${esc(r.titulo)}</summary><ul>${vis.map(li).join('')}</ul>`
      + (resto.length ? `<details class="pie-en-mas"><summary>See all (${orden.length})</summary><ul>${resto.map(li).join('')}</ul></details>` : '')
      + '</details>'
  }).join('')
  const comunes = CREDITOS.map((c) => `<li>${esc(c.tr?.en ?? c.foto)}: <a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(c.autor)}</a>, ${esc(c.licencia)}</li>`).join('')
  return `<footer class="pie-en"><div class="pie-en-in">`
    + `<div class="pie-en-cabeza"><a href="/en/" class="pie-en-marca" aria-label="Tony Kansai Guide, home">${logoEn}</a><p class="pie-en-lema">${esc(ARBOL_EN.lema)}</p>`
    + `<p class="pie-en-contacto"><a href="${esc(ARBOL_EN.whatsapp.href)}" target="_blank" rel="noopener noreferrer">${iconoWa} WhatsApp</a><a href="mailto:${ARBOL_EN.correo}">${ARBOL_EN.correo}</a></p></div>`
    + `<nav class="pie-en-primeros" aria-label="Main">${ARBOL_EN.primeros.map(enlace).join('')}</nav>`
    + `<div class="pie-en-cols">${cols}</div>`
    + `<div class="pie-en-base"><nav class="pie-en-idiomas" aria-label="${esc(ARBOL_EN.otrosIdiomas)}">${idiomasEnHTML(idiomas, '')}</nav>`
    + `<nav class="pie-en-legal" aria-label="${esc(ARBOL_EN.legal[0].texto)}">${ARBOL_EN.legal.map((e) => `<a href="${esc(e.ruta)}">${esc(e.texto)}</a>`).join('')}</nav>`
    + `<details class="pie-en-creditos"><summary>${esc(ARBOL_EN.creditos)}</summary><ul dir="ltr">${creditos}${comunes}</ul></details>`
    + `${extra ? `<span class="pie-en-extra">${extra}</span>` : ''}<span class="pie-en-copy">© Tony Kansai Guide</span></div>`
    + `</div>${equipo}</footer><script>${JS}</script>`
}
