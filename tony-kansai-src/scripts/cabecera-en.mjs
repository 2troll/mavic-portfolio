// Common English header for the static pages: the same HTML, the same CSS
// (src/v7/cabecera-en.css, read as is) and the same tree (src/v7/arbolEn.ts) as
// CabeceraEn.tsx. ☰ menu with a tiny dependency-free script: sheet on the right
// (full screen on a phone), Esc / X / click outside close it, focus trapped,
// aria-expanded. Without JS the links are still in the HTML (and in the footer).
//
//   import { cabeceraEnHTML, cabeceraEnCSS } from './cabecera-en.mjs'
//   <style>…${cabeceraEnCSS}</style> … <body>${cabeceraEnHTML({ actual: '/en/prices/', enPagina, idiomas })}
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'
import { esc, cssDe, iconoWa } from './cabecera-es.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
export { esc, cssDe, iconoWa }

/** arbolEn.ts imports without extensions (Vite does, Node doesn't): bundled with esbuild. */
async function cargarArbol() {
  const r = await build({
    stdin: { contents: "export { arbolEn } from './src/v7/arbolEn.ts'\nexport { SAKURA_D } from './src/v7/logo-sakura.ts'", resolveDir: root, loader: 'ts' },
    bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent',
    loader: { '.json': 'json', '.webp': 'empty', '.jpg': 'empty', '.png': 'empty', '.svg': 'empty', '.css': 'empty' },
  })
  return import(`data:text/javascript;base64,${Buffer.from(r.outputFiles[0].text).toString('base64')}`)
}
const { arbolEn, SAKURA_D } = await cargarArbol()
export const ARBOL_EN = arbolEn()

/** paleta-en.css is not needed here: the header and footer carry their own colours. */
export const cabeceraEnCSS = cssDe('cabecera-en.css')

/** The Logo.tsx mark in English: UIX flower + name (no torii). */
export const logoEn = `<span class="v7-logo"><svg class="v7-logo-sakura" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="currentColor"/><path style="fill:var(--logo-flor,#fff)" fill-rule="evenodd" transform="translate(4.2 4.4) scale(.65)" d="${SAKURA_D}"/></svg><span class="v7-logo-texto">Tony Kansai Guide</span></span>`

/** Without a translation of this page, the other home pages (as CabeceraEn.tsx). */
export const IDIOMAS_EN = [{ lang: 'es', ruta: '/es/', texto: 'Español' }, { lang: 'ar', ruta: '/ar/', texto: 'العربية' }, { lang: 'ru', ruta: '/ru/', texto: 'Русский' }]

export function enlaceArbolEn(e, actual) {
  const cls = e.destacado ? ' class="cab-en-destacado"' : ''
  const nuevo = e.nuevo ? '<small class="cab-en-nuevo">new</small>' : ''
  return `<a href="${esc(e.ruta)}"${cls}${e.ruta === actual ? ' aria-current="page"' : ''}${e.fuera ? ' target="_blank" rel="noopener"' : ''}>${esc(e.texto)}${nuevo}</a>`
}

export function idiomasEnHTML(idiomas, sep = ' · ') {
  const lista = idiomas?.length ? idiomas : IDIOMAS_EN
  return lista.map((o) => `<a href="${esc(o.ruta)}" hreflang="${o.lang}" lang="${o.lang}"${o.lang === 'ar' ? ' dir="rtl"' : ''}>${esc(o.texto)}</a>`).join(sep)
}

const JS = `(()=>{var h=document.querySelector('.cab-en[data-estatica]');if(!h)return;var b=h.querySelector('.cab-en-boton'),p=h.querySelector('.cab-en-panel'),r=document.documentElement;
function f(){return[].slice.call(p.querySelectorAll('a[href],button,summary')).filter(function(e){return e.offsetParent!==null})}
function abrir(){h.setAttribute('data-abierto','');b.setAttribute('aria-expanded','true');r.classList.add('cab-en-bloqueo');var l=f();l[0]&&l[0].focus()}
function cerrar(v){h.removeAttribute('data-abierto');b.setAttribute('aria-expanded','false');r.classList.remove('cab-en-bloqueo');v&&b.focus()}
b.addEventListener('click',function(){h.hasAttribute('data-abierto')?cerrar(1):abrir()});
h.querySelector('.cab-en-cerrar').addEventListener('click',function(){cerrar(1)});h.querySelector('.cab-en-velo').addEventListener('click',function(){cerrar(1)});
p.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');a&&cerrar(0)});
document.addEventListener('keydown',function(e){if(!h.hasAttribute('data-abierto'))return;if(e.key==='Escape'){e.preventDefault();cerrar(1);return}
if(e.key!=='Tab')return;var l=f();if(!l.length)return;var a=l[0],z=l[l.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}})})()`

/**
 * actual: route of this page (marked in the menu).
 * enPagina: [[text, '#anchor'], …] shortcuts to this page's sections.
 * tituloPagina: label of that branch (e.g. «Tools»).
 * ramasPagina: [{ titulo, enlaces: [[text, route], …] }] extra branches of the page.
 * idiomas: [{ lang, ruta, texto }] this page in other languages; without it, the home pages.
 */
export function cabeceraEnHTML({ actual = '', enPagina = [], tituloPagina = 'On this page', ramasPagina = [], idiomas = [] } = {}) {
  // Page branches only keep what the tree doesn't already carry (no link twice).
  const enArbol = new Set([...ARBOL_EN.primeros, ...ARBOL_EN.ramas.flatMap((r) => r.enlaces)].map((e) => e.ruta))
  const solas = ramasPagina.map((r) => ({ ...r, enlaces: r.enlaces.filter(([, h]) => !enArbol.has(h) && !(h.endsWith('/') ? false : enArbol.has(`${h}/`))) }))
  const propias = [...(enPagina.length ? [{ titulo: tituloPagina, enlaces: enPagina }] : []), ...solas].filter((r) => r.enlaces.length)
  const ramaPagina = propias.map((r) => `<details class="cab-en-rama"><summary>${esc(r.titulo)}</summary><ul>${r.enlaces.map(([t, h]) => `<li><a href="${esc(h)}">${esc(t)}</a></li>`).join('')}</ul></details>`).join('')
  const ramas = ARBOL_EN.ramas.map((r) => `<details class="cab-en-rama cab-en-rama-${r.id}"${r.id === 'experiencias' ? ' open' : ''}><summary>${esc(r.titulo)}</summary><ul>${r.enlaces.map((e) => `<li>${enlaceArbolEn(e, actual)}</li>`).join('')}</ul></details>`).join('')
  return `<header class="cab-en" data-estatica><div class="cab-en-in">`
    + `<a href="/en/" class="cab-en-marca" aria-label="Tony Kansai Guide, home">${logoEn}</a>`
    + `<button type="button" class="cab-en-boton" aria-expanded="false" aria-controls="cab-en-menu"><span class="cab-en-rayas" aria-hidden="true"><i></i><i></i><i></i></span><span class="cab-en-boton-txt">Menu</span></button></div>`
    + `<div class="cab-en-velo" aria-hidden="true"></div>`
    + `<div id="cab-en-menu" class="cab-en-panel" role="dialog" aria-modal="true" aria-label="Site menu">`
    + `<div class="cab-en-panel-cab"><span class="cab-en-panel-marca">${logoEn}</span><button type="button" class="cab-en-cerrar" aria-label="Close the menu"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg></button></div>`
    + `<nav class="cab-en-arbol" aria-label="Menu"><ul class="cab-en-primeros">${ARBOL_EN.primeros.map((e) => `<li>${enlaceArbolEn(e, actual)}</li>`).join('')}</ul>${ramaPagina}${ramas}</nav>`
    + `<a class="cab-en-wa" href="${esc(ARBOL_EN.whatsapp.href)}" target="_blank" rel="noopener noreferrer">${iconoWa} ${esc(ARBOL_EN.whatsapp.texto)}</a>`
    + `<p class="cab-en-idiomas">${idiomasEnHTML(idiomas)}</p>`
    + `</div></header><script>${JS}</script>`
}
