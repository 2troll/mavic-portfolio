// Pie común en español para las páginas estáticas: el mismo HTML, CSS
// (src/v7/pie-es.css, leído tal cual) y árbol (src/v7/arbolEs.ts) que PieEs.tsx.
//
//   import { pieEsHTML, pieEsCSS } from './pie-es.mjs'
//   <style>…${pieEsCSS}</style> … ${pieEsHTML({ idiomas, creditos, extra, equipo })}
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ARBOL, cssDe, esc, iconoWa, logoEs, idiomasHTML, cabeceraEsHTML, cabeceraEsCSS } from './cabecera-es.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const { CREDITOS } = await import('../src/v7/contenido.ts')
export const pieEsCSS = cssDe('pie-es.css')
const VISIBLES = 6

function enlace(e) {
  const nuevo = e.nuevo ? '<small class="pie-es-nuevo">nuevo</small>' : ''
  return `<a href="${esc(e.ruta)}"${e.fuera ? ' target="_blank" rel="noopener"' : ''}>${esc(e.texto)}${nuevo}</a>`
}
const li = (e) => `<li>${enlace(e)}</li>`

// En el móvil, acordeones cerrados al cargar (en el HTML van abiertos: Google).
const JS = `(()=>{if(matchMedia('(max-width:720px)').matches)[].forEach.call(document.querySelectorAll('.pie-es-cols>details'),function(d){d.open=false})})()`

/**
 * idiomas: [{ lang, ruta, texto }] esta página en otros idiomas; si no, /international/.
 * creditos: HTML de <li> con las fotos propias de la página (se suman a las comunes).
 * extra: HTML pequeño para la línea final (p. ej. «Actualizado: …»).
 * equipo: HTML de la franja del equipo (equipoHTML), tras el pie.
 */
export function pieEsHTML({ idiomas = [], creditos = '', extra = '', equipo = '' } = {}) {
  const cols = ARBOL.ramas.map((r) => {
    const orden = [...r.enlaces.filter((e) => e.destacado), ...r.enlaces.filter((e) => !e.destacado)]
    const vis = orden.slice(0, VISIBLES), resto = orden.slice(VISIBLES)
    return `<details class="pie-es-col" open><summary>${esc(r.titulo)}</summary><ul>${vis.map(li).join('')}</ul>`
      + (resto.length ? `<details class="pie-es-mas"><summary>Ver todo (${orden.length})</summary><ul>${resto.map(li).join('')}</ul></details>` : '')
      + '</details>'
  }).join('')
  const comunes = CREDITOS.map((c) => `<li>${esc(c.tr?.es ?? c.foto)}: <a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(c.autor)}</a>, ${esc(c.licencia)}</li>`).join('')
  return `<footer class="pie-es"><div class="pie-es-in">`
    + `<div class="pie-es-cabeza"><a href="/es/" class="pie-es-marca" aria-label="Tony Kansai Guide, inicio">${logoEs}</a><p class="pie-es-lema">${esc(ARBOL.lema)}</p>`
    + `<p class="pie-es-contacto"><a href="${esc(ARBOL.whatsapp.href)}" target="_blank" rel="noopener noreferrer">${iconoWa} WhatsApp</a><a href="mailto:${ARBOL.correo}">${ARBOL.correo}</a></p></div>`
    + `<nav class="pie-es-primeros" aria-label="Lo principal">${ARBOL.primeros.map(enlace).join('')}</nav>`
    + `<div class="pie-es-cols">${cols}</div>`
    + `<div class="pie-es-base"><nav class="pie-es-idiomas" aria-label="${esc(ARBOL.otrosIdiomas)}">${idiomasHTML(idiomas)}</nav>`
    + `<nav class="pie-es-legal" aria-label="${esc(ARBOL.legal[0].texto)}">${ARBOL.legal.map((e) => `<a href="${esc(e.ruta)}">${esc(e.texto)}</a>`).join('')}</nav>`
    + `<details class="pie-es-creditos"><summary>${esc(ARBOL.creditos)}</summary><ul dir="ltr">${creditos}${comunes}</ul></details>`
    + `${extra ? `<span class="pie-es-extra">${extra}</span>` : ''}<span class="pie-es-copy">© Tony Kansai Guide</span></div>`
    + `</div>${equipo}</footer><script>${JS}</script>`
}

// ── Páginas españolas escritas a mano (no tienen generador) ─────────────────────
// `node scripts/pie-es.mjs` pone (o pone al día) la cabecera y el pie comunes
// entre marcas <!-- ARBOL-ES:… --> en public/resenas.html. Idempotente.
const A_MANO = [
  { archivo: 'public/resenas.html', actual: '/resenas.html', extra: '<a href="/opinar.html">Deja tu reseña</a>' },
]
async function ponerEnPaginasAMano() {
  const marca = (n, html) => `<!-- ARBOL-ES:${n} -->${html}<!-- /ARBOL-ES:${n} -->`
  const poner = (html, n, nuevo, donde) => {
    const re = new RegExp(`<!-- ARBOL-ES:${n} -->[\\s\\S]*?<!-- /ARBOL-ES:${n} -->`)
    return re.test(html) ? html.replace(re, () => marca(n, nuevo)) : donde(html, marca(n, nuevo))
  }
  for (const p of A_MANO) {
    const ruta = join(root, p.archivo)
    let html = readFileSync(ruta, 'utf8')
    if (!/<html lang="es"/.test(html)) throw new Error(`${p.archivo}: no es una página en español`)
    html = poner(html, 'css', `<style>${cabeceraEsCSS}${pieEsCSS}</style>`, (h, x) => h.replace('</head>', `${x}\n</head>`))
    html = poner(html, 'cabecera', cabeceraEsHTML({ actual: p.actual }), (h, x) => h.replace(/<body([^>]*)>/, (m) => `${m}\n${x}`))
    // El <footer> propio se sustituye la primera vez (sus enlaces van en «extra»).
    html = poner(html, 'pie', pieEsHTML({ extra: p.extra }), (h, x) => {
      const sin = h.replace(/<footer>[\s\S]*?<\/footer>/, x)
      if (sin === h) throw new Error(`${p.archivo}: no encuentro su <footer>`)
      return sin
    })
    writeFileSync(ruta, html)
    console.log(`pie-es: ${p.archivo} con cabecera y pie comunes`)
  }
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await ponerEnPaginasAMano()
