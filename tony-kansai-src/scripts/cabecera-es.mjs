// Cabecera común en español para las páginas estáticas: el mismo HTML, el mismo
// CSS (src/v7/cabecera-es.css, leído tal cual) y el mismo árbol (src/v7/arbolEs.ts)
// que CabeceraEs.tsx. Menú ☰ con un script mínimo sin dependencias: hoja a la
// derecha (pantalla entera en el móvil), Esc / X / clic fuera cierran, foco
// atrapado, aria-expanded. Sin JS los enlaces siguen en el HTML (y en el pie).
//
//   import { cabeceraEsHTML, cabeceraEsCSS } from './cabecera-es.mjs'
//   <style>…${cabeceraEsCSS}</style> … <body>${cabeceraEsHTML({ actual: '/es/precios/', enPagina, idiomas })}
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** arbolEs.ts importa sin extensión (Vite sí, Node no): se empaqueta con esbuild. */
async function cargarArbol() {
  const r = await build({
    stdin: { contents: "export { arbolEs } from './src/v7/arbolEs.ts'\nexport { SAKURA_D } from './src/v7/logo-sakura.ts'", resolveDir: root, loader: 'ts' },
    bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent',
    loader: { '.json': 'json', '.webp': 'empty', '.jpg': 'empty', '.png': 'empty', '.svg': 'empty', '.css': 'empty' },
  })
  return import(`data:text/javascript;base64,${Buffer.from(r.outputFiles[0].text).toString('base64')}`)
}
const { arbolEs, SAKURA_D } = await cargarArbol()
export const ARBOL = arbolEs()

/** CSS de un archivo de src/v7 en una línea (comentarios fuera). */
export const cssDe = (archivo) => readFileSync(join(root, 'src/v7', archivo), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').trim()
export const cabeceraEsCSS = cssDe('cabecera-es.css')

/** El path del icono de WhatsApp, del propio IconoWa.tsx (una sola fuente). */
const WA_D = readFileSync(join(root, 'src/v7/IconoWa.tsx'), 'utf8').match(/export function IconoWa[\s\S]*?<path d="([^"]+)"/)[1]
export const iconoWa = `<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="${WA_D}"/></svg>`
/** El logo de Logo.tsx en español: flor UIX + nombre. */
export const logoEs = `<span class="v7-logo"><svg class="v7-logo-sakura" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><defs><radialGradient id="tk-petalo" cx="50%" cy="50%" r="58%"><stop offset="0" stop-color="#fbd3de"/><stop offset=".55" stop-color="#f2a9bd"/><stop offset="1" stop-color="#e4849f"/></radialGradient></defs><path fill="url(#tk-petalo)" fill-rule="evenodd" d="${SAKURA_D}"/><circle cx="12" cy="12" r="1.9" fill="#c9577c"/></svg><span class="v7-logo-texto">Tony Kansai <span class="v7-logo-guia">Guide</span></span></span>`

export function enlaceArbol(e, actual, clase = '') {
  const cls = [clase, e.destacado ? 'cab-es-destacado' : ''].filter(Boolean).join(' ')
  const nuevo = e.nuevo ? '<small class="cab-es-nuevo">nuevo</small>' : ''
  return `<a href="${esc(e.ruta)}"${cls ? ` class="${cls}"` : ''}${e.ruta === actual ? ' aria-current="page"' : ''}${e.fuera ? ' target="_blank" rel="noopener"' : ''}>${esc(e.texto)}${nuevo}</a>`
}

export function idiomasHTML(idiomas) {
  if (!idiomas?.length) return '<a href="/international/" lang="en">English · <span lang="ar" dir="rtl">العربية</span></a>'
  return idiomas.map((o) => `<a href="${esc(o.ruta)}" hreflang="${o.lang}" lang="${o.lang}"${o.lang === 'ar' ? ' dir="rtl"' : ''}>${esc(o.texto)}</a>`).join(' · ')
}

const JS = `(()=>{var h=document.querySelector('.cab-es[data-estatica]');if(!h)return;var b=h.querySelector('.cab-es-boton'),p=h.querySelector('.cab-es-panel'),r=document.documentElement;
function f(){return[].slice.call(p.querySelectorAll('a[href],button,summary')).filter(function(e){return e.offsetParent!==null})}
function abrir(){h.setAttribute('data-abierto','');b.setAttribute('aria-expanded','true');r.classList.add('cab-es-bloqueo');var l=f();l[0]&&l[0].focus()}
function cerrar(v){h.removeAttribute('data-abierto');b.setAttribute('aria-expanded','false');r.classList.remove('cab-es-bloqueo');v&&b.focus()}
b.addEventListener('click',function(){h.hasAttribute('data-abierto')?cerrar(1):abrir()});
h.querySelector('.cab-es-cerrar').addEventListener('click',function(){cerrar(1)});h.querySelector('.cab-es-velo').addEventListener('click',function(){cerrar(1)});
p.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');a&&cerrar(0)});
document.addEventListener('keydown',function(e){if(!h.hasAttribute('data-abierto'))return;if(e.key==='Escape'){e.preventDefault();cerrar(1);return}
if(e.key!=='Tab')return;var l=f();if(!l.length)return;var a=l[0],z=l[l.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}})})()`

/**
 * actual: ruta de esta página (se marca en el menú).
 * enPagina: [[texto, '#ancla'], …] atajos a las secciones de esta página.
 * tituloPagina: rótulo de esa rama (p. ej. «Herramientas» en las herramientas).
 * ramasPagina: [{ titulo, enlaces: [[texto, ruta], …] }] más ramas propias de la página.
 * idiomas: [{ lang, ruta, texto }] esta página en otros idiomas; si no, /international/.
 */
export function cabeceraEsHTML({ actual = '', enPagina = [], tituloPagina = 'En esta página', ramasPagina = [], idiomas = [] } = {}) {
  const propias = [...(enPagina.length ? [{ titulo: tituloPagina, enlaces: enPagina }] : []), ...ramasPagina].filter((r) => r.enlaces.length)
  const ramaPagina = propias.map((r) => `<details class="cab-es-rama"><summary>${esc(r.titulo)}</summary><ul>${r.enlaces.map(([t, h]) => `<li><a href="${esc(h)}">${esc(t)}</a></li>`).join('')}</ul></details>`).join('')
  const ramas = ARBOL.ramas.map((r) => `<details class="cab-es-rama cab-es-rama-${r.id}"${r.id === 'experiencias' ? ' open' : ''}><summary>${esc(r.titulo)}</summary><ul>${r.enlaces.map((e) => `<li>${enlaceArbol(e, actual)}</li>`).join('')}</ul></details>`).join('')
  return `<header class="cab-es" data-estatica><div class="cab-es-in">`
    + `<a href="/es/" class="cab-es-marca" aria-label="Tony Kansai Guide, inicio">${logoEs}</a>`
    + `<button type="button" class="cab-es-boton" aria-expanded="false" aria-controls="cab-es-menu"><span class="cab-es-rayas" aria-hidden="true"><i></i><i></i><i></i></span><span class="cab-es-boton-txt">Menú</span></button></div>`
    + `<div class="cab-es-velo" aria-hidden="true"></div>`
    + `<div id="cab-es-menu" class="cab-es-panel" role="dialog" aria-modal="true" aria-label="Menú de la web">`
    + `<div class="cab-es-panel-cab"><span class="cab-es-panel-marca">${logoEs}</span><button type="button" class="cab-es-cerrar" aria-label="Cerrar el menú"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg></button></div>`
    + `<nav class="cab-es-arbol" aria-label="Menú"><ul class="cab-es-primeros">${ARBOL.primeros.map((e) => `<li>${enlaceArbol(e, actual)}</li>`).join('')}</ul>${ramaPagina}${ramas}</nav>`
    + `<a class="cab-es-wa" href="${esc(ARBOL.whatsapp.href)}" target="_blank" rel="noopener noreferrer">${iconoWa} ${esc(ARBOL.whatsapp.texto)}</a>`
    + `<p class="cab-es-idiomas">${idiomasHTML(idiomas)}</p>`
    + `</div></header><script>${JS}</script>`
}

