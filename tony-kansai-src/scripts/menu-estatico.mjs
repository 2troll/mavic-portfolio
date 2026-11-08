// Menú de arriba, pie en columnas y filas de «ver también» para las secciones
// estáticas (/tr/, /fr/, /ru/kndr/, /familias/). Patrón tomado de nawatravel.ae:
// arriba como mucho 3 desplegables + 1 botón; abajo 3-4 columnas cortas con
// título, el resto plegado en «Ver todo (N)» (los enlaces siguen en el HTML para
// Google y las IAs), luego la franja del equipo y una línea final fina.
//
//   import { navHTML, pieHTML, tarjetasHTML, menuCSS } from './menu-estatico.mjs'
//   <style>${CSS}${menuCSS}</style>
//   <header …><div class="kap"><a class="marca" …>…</a>${navHTML({ … })}</div></header>
//   <footer>${pieHTML({ … })}</footer>
//
// Un enlace es { t, h, hreflang?, lang?, rel? } o [t, h]. Todo va sin JS: los
// desplegables son <details>; un script mínimo (lo trae pieHTML) cierra al
// pulsar fuera o con Escape, abre el menú del móvil y pliega el pie en el móvil.
// variante: 'tr' | 'fr' | 'kndr' | 'familias' | 'private' toma los colores de esa página
// (/private/ tiene dos juegos: modo FAN de neón y modo EASY claro, por clase en <html>).

const VARIANTES = ['tr', 'fr', 'kndr', 'familias', 'private', 'filipp']
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function norm(e) {
  if (Array.isArray(e)) return { t: e[0], h: e[1] }
  if (!e || !e.t || !e.h) throw new Error(`menu-estatico: enlace incompleto ${JSON.stringify(e)}`)
  return e
}
/** `t` ya puede traer HTML escapado del generador (p. ej. «Osaka &amp; Nara»): no se vuelve a escapar. */
const enlace = (e, cls = '') => {
  const { t, h, hreflang, lang, rel } = norm(e)
  return `<a href="${esc(h)}"${cls ? ` class="${cls}"` : ''}${hreflang ? ` hreflang="${hreflang}"` : ''}${lang ? ` lang="${lang}"` : ''}${rel ? ` rel="${rel}"` : ''}>${t}</a>`
}
const variante = (v) => {
  if (v == null) return ''
  if (!VARIANTES.includes(v)) throw new Error(`menu-estatico: variante «${v}» no existe (hay: ${VARIANTES.join(', ')})`)
  return ` mn--${v}`
}

/** Navegación de la cabecera: hasta 3 grupos desplegables + 1 botón (cta). */
export function navHTML({ grupos, cta, etiqueta = 'Menu', abrir = 'Menu', variante: v = null }) {
  if (!Array.isArray(grupos) || grupos.length < 1 || grupos.length > 3) throw new Error('navHTML: entre 1 y 3 grupos')
  const gs = grupos.map((g, i) => `<details class="mn-g"><summary>${esc(g.t)}</summary><ul class="mn-panel${i === grupos.length - 1 && grupos.length > 1 ? ' mn-panel-fin' : ''}">${g.enlaces.map((e) => `<li>${enlace(e)}</li>`).join('')}</ul></details>`).join('')
  return `<nav class="mn-nav${variante(v)}" aria-label="${esc(etiqueta)}">`
    + `<button type="button" class="mn-hamb" aria-expanded="false" aria-label="${esc(abrir)}"><span></span></button>`
    + `<div class="mn-grupos">${gs}</div>`
    + (cta ? `<a class="mn-cta${cta.cls ? ` ${cta.cls}` : ''}" href="${esc(cta.h)}"${cta.aria ? ` aria-label="${esc(cta.aria)}"` : ''}>${cta.t}</a>` : '')
    + '</nav>'
}

/** Lista con los `visibles` primeros a la vista y el resto en «Ver todo (N)». */
function listaPlegada(enlaces, visibles, mas, claseUl = '', claseA = '') {
  const vis = enlaces.slice(0, visibles), resto = enlaces.slice(visibles)
  const li = (e) => `<li>${enlace(e, claseA)}</li>`
  return `<ul${claseUl ? ` class="${claseUl}"` : ''}>${vis.map(li).join('')}</ul>`
    + (resto.length ? `<details class="mn-mas"><summary>${esc(mas)} (${enlaces.length})</summary><ul${claseUl ? ` class="${claseUl}"` : ''}>${resto.map(li).join('')}</ul></details>` : '')
}

/**
 * Contenido del <footer>: intro (HTML, la frase que leen las IAs), columnas,
 * franja del equipo (HTML de equipoHTML) y línea final (HTML).
 * columnas: [{ t, enlaces?, html?, fija? }]; `fija` = abierta también en el móvil (Contacto).
 */
export function pieHTML({ intro = '', columnas, equipo = '', fin, mas = 'See all', visibles = 6, variante: v = null }) {
  if (!Array.isArray(columnas) || columnas.length < 2 || columnas.length > 4) throw new Error('pieHTML: entre 2 y 4 columnas')
  const cols = columnas.map((c) => `<details class="mn-col" open${c.fija ? ' data-fijo' : ''}><summary>${esc(c.t)}</summary>`
    + (c.html ?? '') + (c.enlaces ? listaPlegada(c.enlaces, visibles, mas) : '') + '</details>').join('')
  return `<div class="mn-pie${variante(v)}"><div class="kap mn-cols" style="--mn-n:${columnas.length}">`
    + `<div class="mn-intro">${intro}</div>${cols}</div>`
    + equipo
    + `<div class="kap mn-fin">${fin}</div></div>`
    + `<script>${JS}</script>`
}

/** Fila de tarjetas «ver también»: `visibles` a la vista y el resto plegado. */
export function tarjetasHTML({ t, enlaces, visibles = 4, mas = 'See all', variante: v = null }) {
  if (!enlaces.length) return ''
  return `<nav class="mn-tarjetas${variante(v)}" aria-label="${esc(t.replace(/<[^>]+>/g, ''))}"><p class="mn-tt">${t}</p>${listaPlegada(enlaces, visibles, mas, 'mn-fila')}</nav>`
}

const JS = `(()=>{var d=document,gs=[].slice.call(d.querySelectorAll('.mn-g')),ns=[].slice.call(d.querySelectorAll('.mn-nav'));
function cerrar(){gs.forEach(function(g){g.open=false});ns.forEach(function(n){n.classList.remove('mn-abierto');var b=n.querySelector('.mn-hamb');b&&b.setAttribute('aria-expanded','false')})}
ns.forEach(function(n){n.classList.add('mn-js');var b=n.querySelector('.mn-hamb');b&&b.addEventListener('click',function(){var a=n.classList.toggle('mn-abierto');b.setAttribute('aria-expanded',a?'true':'false')})});
gs.forEach(function(g){g.addEventListener('toggle',function(){if(g.open)gs.forEach(function(o){if(o!==g)o.open=false})})});
d.addEventListener('click',function(e){if(!e.target.closest('.mn-nav'))cerrar()});
d.addEventListener('keydown',function(e){if(e.key==='Escape'){var a=d.querySelector('.mn-g[open]>summary');cerrar();a&&a.focus()}});
if(matchMedia('(max-width:719px)').matches)[].forEach.call(d.querySelectorAll('.mn-col:not([data-fijo])'),function(c){c.open=false})})()`

export const menuCSS = `
.mn--tr,.mn--fr{--mn-tarjeta:var(--kart);--mn-texto:var(--fg);--mn-linea:var(--cizgi);--mn-suave:var(--bg);--mn-acento:var(--yesil)}
.mn--filipp{--mn-tarjeta:var(--papel);--mn-texto:var(--tinta);--mn-linea:var(--linea);--mn-suave:var(--chip);--mn-acento:var(--acento)}
.mn--kndr{--mn-tarjeta:var(--papel);--mn-texto:var(--tinta);--mn-linea:var(--linea);--mn-suave:var(--chip);--mn-acento:#229ED9}
.mn--private{--mn-tarjeta:#15152e;--mn-texto:#f4f4ff;--mn-linea:#ffffff;--mn-suave:#1e1e40;--mn-acento:#128c4a}
html.easy .mn--private{--mn-tarjeta:#ffffff;--mn-texto:#15131a;--mn-linea:#15131a;--mn-suave:#f3ecdc;--mn-acento:#128c4a}
.mn--familias{--mn-tarjeta:var(--kart);--mn-texto:var(--tinta);--mn-linea:var(--linea);--mn-suave:var(--acento-2);--mn-acento:var(--acento)}
.mn-nav{display:flex!important;align-items:center;gap:6px!important;flex-wrap:nowrap!important;font-size:15px!important;opacity:1!important;position:relative;z-index:80;margin-inline-start:auto}
.mn-g,.mn-col,.mn-mas{background:none!important;border:0!important;border-radius:0!important;padding:0!important;margin:0!important;box-shadow:none!important;max-width:none!important}
.mn-grupos{display:flex;align-items:center;gap:2px}
.mn-g{position:relative}
.mn-g>summary{list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 12px;font-weight:500;color:inherit;border-radius:8px;white-space:nowrap;user-select:none}
.mn-g>summary::-webkit-details-marker{display:none}
.mn-g>summary::after,.mn-col>summary::after{content:"";width:7px;height:7px;border:solid currentColor;border-width:0 1.6px 1.6px 0;transform:translateY(-2px) rotate(45deg);transition:transform .2s;opacity:.7}
.mn-g[open]>summary::after{transform:translateY(1px) rotate(-135deg)}
.mn-g>summary:hover,.mn-g[open]>summary{background:rgba(127,127,127,.14)}
.mn-g>summary:focus-visible,.mn-cta:focus-visible,.mn-hamb:focus-visible{outline:2px solid currentColor;outline-offset:2px}
.mn-panel{position:absolute;top:calc(100% + 8px);left:0;z-index:60;min-width:250px;max-width:min(340px,86vw);margin:0;padding:8px;list-style:none;background:var(--mn-tarjeta,#fff);color:var(--mn-texto,#111);border:1px solid var(--mn-linea,#ddd);border-radius:10px;box-shadow:0 22px 44px -20px rgba(0,0,0,.4)}
.mn-panel-fin{left:auto;right:0}
.mn-panel li{margin:0;padding:0}
.mn-nav .mn-panel a{display:flex!important;align-items:center;min-height:44px;padding:8px 12px;border-radius:6px;color:var(--mn-texto,#111)!important;text-decoration:none;font-weight:500;font-size:15px;line-height:1.3;opacity:1!important}
.mn-nav .mn-panel a:hover,.mn-nav .mn-panel a:focus-visible{background:var(--mn-suave,#f2f2f2)}
.mn-cta{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 16px;border-radius:10px;background:var(--mn-acento,#128c4a);color:#fff!important;font-weight:600;text-decoration:none;white-space:nowrap;opacity:1!important}
.mn-hamb{display:none;width:44px;height:44px;padding:0;border:0;background:transparent;color:inherit;cursor:pointer;align-items:center;justify-content:center}
.mn-hamb span,.mn-hamb span::before,.mn-hamb span::after{display:block;width:22px;height:2px;background:currentColor;position:relative;transition:transform .2s}
.mn-hamb span::before,.mn-hamb span::after{content:"";position:absolute;left:0}.mn-hamb span::before{top:-7px}.mn-hamb span::after{top:7px}
.mn-abierto .mn-hamb span{background:transparent}.mn-abierto .mn-hamb span::before{transform:translateY(7px) rotate(45deg)}.mn-abierto .mn-hamb span::after{transform:translateY(-7px) rotate(-45deg)}
@media (max-width:860px){
.mn-js .mn-hamb{display:inline-flex;order:2}
.mn-js .mn-cta{order:1;padding:0 12px;font-size:14px}
.mn-js .mn-grupos{display:none;position:absolute;top:calc(100% + 8px);right:0;z-index:60;width:min(340px,calc(100vw - 32px));flex-direction:column;align-items:stretch;gap:0;padding:6px;background:var(--mn-tarjeta,#fff);color:var(--mn-texto,#111);border:1px solid var(--mn-linea,#ddd);border-radius:10px;box-shadow:0 22px 44px -20px rgba(0,0,0,.4)}
.mn-js.mn-abierto .mn-grupos{display:flex}
.mn-js .mn-g>summary{display:flex;justify-content:space-between;width:100%;color:var(--mn-texto,#111)}
.mn-js .mn-panel{position:static;min-width:0;max-width:none;box-shadow:none;border:0;padding:0 0 6px 10px;background:transparent}
.mn-grupos{flex-wrap:wrap}
}
.mn-pie{text-align:start}
.mn-cols{display:grid!important;grid-template-columns:minmax(0,1.5fr) repeat(var(--mn-n),minmax(0,1fr));gap:28px 32px!important;padding-bottom:32px}
.mn-intro p{margin:0 0 10px;font-size:14px;line-height:1.6;max-width:48ch}
.mn-col>summary{list-style:none;display:flex;align-items:center;justify-content:space-between;font:700 12px/1.2 system-ui,-apple-system,sans-serif;letter-spacing:.12em;text-transform:uppercase;margin:0 0 14px;pointer-events:none;color:inherit}
.mn-col>summary::-webkit-details-marker{display:none}
.mn-col>summary::after{display:none}
.mn-col ul{list-style:none;margin:0;padding:0;display:grid;gap:9px}
.mn-col li{margin:0}
.mn-col a{color:inherit;text-decoration:none;font-size:14px;line-height:1.35;opacity:.86}
.mn-col a:hover{opacity:1;text-decoration:underline}
.mn-col p{margin:0 0 9px!important;font-size:14px;line-height:1.45;color:inherit!important}
.mn-mas{margin-top:10px!important}.mn-mas>summary{cursor:pointer;font-size:13px;text-decoration:underline;text-underline-offset:3px;opacity:.85;list-style:none;display:inline-flex;align-items:center;min-height:32px}
.mn-mas>summary::-webkit-details-marker{display:none}.mn-mas[open]>summary{margin-bottom:9px}
.mn-fin{display:flex!important;flex-wrap:wrap;justify-content:space-between;gap:6px 18px!important;padding-block:18px;margin-top:8px;border-top:1px solid rgba(127,127,127,.3);font-size:13px;opacity:.9}
.mn-fin a{color:inherit}
.mn-pie .eq{margin:0}
@media (max-width:719px){
.mn-cols{grid-template-columns:1fr;gap:0!important;padding-bottom:20px}
.mn-intro{padding-bottom:12px}
.mn-col{border-top:1px solid rgba(127,127,127,.28)!important}
.mn-col>summary{pointer-events:auto;cursor:pointer;min-height:52px;margin:0}
.mn-col>summary::after{display:block}
.mn-col[open]>summary::after{transform:translateY(1px) rotate(-135deg)}
.mn-col>ul,.mn-col>.mn-mas,.mn-col>p{padding-bottom:12px}
.mn-col ul{gap:0}
.mn-col li>a{display:flex;align-items:center;min-height:44px}
.mn-col p a{display:inline-block;padding-block:10px}
.mn-mas>summary{min-height:44px}
}
.mn-tarjetas{margin:40px 0 8px}
.mn-tt{font-weight:700;font-size:13px;letter-spacing:.1em;text-transform:uppercase;margin:0 0 12px;opacity:.75}
.mn-fila{list-style:none!important;margin:0!important;padding:0!important;display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px}
.mn-fila li{margin:0;padding:0}.mn-fila li::before{content:none!important}
.mn-fila a{display:flex;align-items:center;justify-content:space-between;gap:12px;height:100%;min-height:64px;padding:14px 16px;border:1px solid var(--mn-linea,rgba(127,127,127,.3));border-radius:12px;background:var(--mn-tarjeta,transparent);color:var(--mn-texto,inherit);text-decoration:none;font-weight:600;font-size:15px;line-height:1.3;transition:border-color .2s,transform .2s}
.mn-fila a::after{content:"→";opacity:.5;flex:none}
.mn-fila a:hover{border-color:currentColor;transform:translateY(-2px)}
.mn-tarjetas .mn-mas>summary{min-height:44px}.mn-tarjetas .mn-mas .mn-fila{margin-top:4px!important}
@media (prefers-reduced-motion:reduce){.mn-fila a,.mn-g>summary::after{transition:none}}
`.replace(/\s*\n\s*/g, '')
