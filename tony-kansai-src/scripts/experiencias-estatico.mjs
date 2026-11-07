// Bloque «Experiencias con ventaja» para las páginas estáticas de los guías
// (Ferhat /tr/, Mario /private/, Antonio /familias/). 7-11-2026, Tony: que cada
// guía enseñe las experiencias de los socios (kimono, samuráis, cuchillos, bici,
// cocina…) con la ventaja a la vista, simple y bien en el móvil.
// Fuente única: src/v7/datosVentajas.ts (la misma de /es/ventajas/), importada
// con el soporte de TypeScript de Node. La letra pequeña de cada ventaja vive en
// la página de ventajas: aquí solo qué es y que hay ventaja, sin frases en
// primera persona de Tony.
const { APPS, CIUDADES, RUTA_VENTAJAS } = await import('../src/v7/datosVentajas.ts')

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Icono por palabra clave del nombre o de la clave (sin logos ni fotos: limpio).
const ICONOS = [[/kimono|wargo|okamoto|yumeyakata|miyabi/i, '👘'], [/samurai|shogun|ninja/i, '⚔️'], [/knive|cuchill/i, '🔪'],
  [/tea|camellia|maikoyate|té/i, '🍵'], [/cook|cocina/i, '🍳'], [/cycle|bici|inkansai/i, '🚲'], [/photo|snap|flyto/i, '📸'],
  [/kibori|hamanasu|madera/i, '🪵'], [/bamboo|yokotake/i, '🎋'], [/kumihimo|domyo/i, '🧶'], [/rosoku|vela/i, '🕯️'],
  [/japaneid|halal/i, '🛍️'], [/kobaien|sumi/i, '🖌️']]
const icono = (a) => (ICONOS.find(([re]) => re.test(a.clave + ' ' + a.nombre)) ?? [null, '✨'])[1]

const T = {
  es: { h: 'Experiencias con ventaja', p: 'Añádelas a cualquier día del viaje. Con nosotros tienen descuento o un extra que no da su web.', badge: 'Ventaja', mas: 'Ver todas las ventajas y cómo reservarlas', base: 'es' },
  en: { h: 'Experiences with a perk', p: 'Add them to any day of your trip. Through us they come with a discount or an extra their website does not give.', badge: 'Perk', mas: 'See every perk and how to book it', base: 'en' },
  ar: { h: 'تجارب بمزايا خاصة', p: 'أضيفوها إلى أي يوم من رحلتكم. معنا تحصلون على خصم أو ميزة إضافية لا يقدّمها موقعهم.', badge: 'ميزة', mas: 'كل المزايا وطريقة الحجز', base: 'ar' },
  tr: { h: 'Avantajlı deneyimler', p: 'Gezinizin herhangi bir gününe ekleyin. Bizimle gelince indirim veya sitelerinde olmayan bir ekstra var.', badge: 'Avantaj', mas: 'Tüm avantajlar ve nasıl rezervasyon yapılır', base: 'en' },
  fr: { h: 'Expériences avec avantage', p: 'Ajoutez-les à n’importe quel jour du voyage. Avec nous : une remise ou un petit plus que leur site ne donne pas.', badge: 'Avantage', mas: 'Tous les avantages et comment réserver', base: 'en' },
}

/** Lista de experiencias (las de Kansai, Nara y Kumano: donde guían Tony, Ferhat, Mario y Antonio). */
export const EXPERIENCIAS = APPS.filter((a) => a.cat === 'experiencias')

export function experienciasHTML(lang = 'es', { max = 12 } = {}) {
  const t = T[lang] ?? T.en
  const rutaV = RUTA_VENTAJAS[lang] ?? RUTA_VENTAJAS.en
  const items = EXPERIENCIAS.slice(0, max).map((a) => {
    const tx = a.t[t.base] ?? a.t.en
    const ciudad = a.ciudad ? (CIUDADES[a.ciudad][lang] ?? CIUDADES[a.ciudad].en) : ''
    const extra = a.descuento ? `${t.badge} · ${esc(a.descuento)}` : t.badge
    const halal = a.musulman ? '<span class="xp-h">Halal ✓</span>' : ''
    return `<li><a href="${rutaV}"><span class="xp-i" aria-hidden="true">${icono(a)}</span><span class="xp-t"><b>${esc(a.nombre)}</b>${ciudad ? `<small>${esc(ciudad)}</small>` : ''}<span class="xp-q">${esc(tx.que)}</span><span class="xp-b">${extra}</span>${halal}</span></a></li>`
  }).join('')
  return `<section class="xp" aria-labelledby="xp-${lang}"><div class="xp-k">
<h2 id="xp-${lang}">${t.h}</h2>
<p class="xp-p">${t.p}</p>
<ul class="xp-l">${items}</ul>
<p class="xp-m"><a href="${rutaV}">${t.mas} →</a></p>
</div></section>`
}

// Estilo neutro: hereda la tipografía y los colores de cada sección (currentColor),
// con un acento propio por guía vía --xp-acento.
export const EXPERIENCIAS_CSS = `
.xp{padding:40px 0}.xp-k{max-width:1080px;margin:0 auto;padding:0 16px}
.xp h2{margin:0 0 6px}.xp-p{margin:0 0 18px;opacity:.8;max-width:60ch}
.xp-l{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
.xp-l a{display:flex;gap:12px;align-items:flex-start;height:100%;padding:14px;border-radius:16px;border:1px solid color-mix(in srgb,currentColor 16%,transparent);background:color-mix(in srgb,currentColor 4%,transparent);color:inherit;text-decoration:none;transition:transform .2s,border-color .2s}
.xp-l a:hover{transform:translateY(-2px);border-color:var(--xp-acento,currentColor)}
.xp-l a:active{transform:scale(.97)}
.xp-i{flex:none;display:grid;place-items:center;width:44px;height:44px;border-radius:12px;font-size:24px;background:color-mix(in srgb,var(--xp-acento,#c8402c) 14%,transparent)}
.xp-t{display:grid;gap:3px;min-width:0}.xp-t b{font-size:16px;line-height:1.25}.xp-t small{font-size:12px;opacity:.65;text-transform:uppercase;letter-spacing:.06em}
.xp-q{font-size:14px;line-height:1.45;opacity:.85;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.xp-b{justify-self:start;margin-top:4px;font-size:12px;font-weight:700;padding:3px 9px;border-radius:999px;background:var(--xp-acento,#c8402c);color:#fff}
.xp-h{justify-self:start;font-size:11px;font-weight:700;color:#13a05a}
.xp-m{margin:16px 0 0}.xp-m a{color:var(--xp-acento,inherit);font-weight:700}
@media (max-width:700px){.xp-l{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;margin-inline:-16px;padding:4px 16px 14px;scrollbar-width:none}.xp-l li{flex:0 0 78%;scroll-snap-align:start}}`
