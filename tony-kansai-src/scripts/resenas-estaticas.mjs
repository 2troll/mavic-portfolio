// node scripts/resenas-estaticas.mjs
//
// /resenas.html traía escritas en el HTML solo 6-7 reseñas; el resto llegaba con
// JavaScript. Google y las IAs que no ejecutan JS veían «30 reseñas» pero leían 7
// (Tony, 25-11-2026: «parece que eliminas reseñas»). Aquí se escriben TODAS las de
// public/reviews.json (tras scripts/resenas-worker.mjs, que suma las del buzón)
// entre <!-- REVIEWS-HTML:START --> y <!-- REVIEWS-HTML:END -->, con el mismo
// marcado que pinta el JS de la página. No quita ninguna: si hay menos que antes, falla.
import { readFileSync, writeFileSync } from 'node:fs'

const PAGINA = new URL('../public/resenas.html', import.meta.url)
const DATOS = new URL('../public/reviews.json', import.meta.url)
const html = readFileSync(PAGINA, 'utf8')
const d = JSON.parse(readFileSync(DATOS, 'utf8'))
const lista = (d.reviews ?? d).filter((r) => r && r.text && r.stars)

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const estrellas = (v, label) => {
  let o = `<span class="rateline" role="img" aria-label="${esc(label)}">`
  for (let i = 1; i <= 5; i++) {
    const fill = Math.max(0, Math.min(1, v - (i - 1))) * 100
    o += `<span class="st"><span class="bg" aria-hidden="true">★</span><span class="fg" aria-hidden="true" style="width:${fill}%">★</span></span>`
  }
  return o + '</span>'
}
const tarjeta = (r) => {
  const foto = r.photo
    ? `<figure><img loading="lazy" src="${esc(r.photo)}" alt="Foto de ${esc(r.name)} — ${esc(r.tour || 'Kansai')}" data-full="${esc(r.photoFull || r.photo)}" data-cap="${esc(r.name)}${r.tour ? ' · ' + esc(r.tour) : ''}"></figure>`
    : ''
  const donde = [r.country, r.date].filter(Boolean).map(esc).join(' · ')
  const tour = r.tour ? `<span class="revtour">${esc(r.tour)}</span>` : ''
  return `    <article class="rev">${foto}<div class="body">${estrellas(r.stars, `${r.stars} de 5 estrellas`)}
      <blockquote dir="${r.lang === 'ar' ? 'rtl' : 'auto'}" lang="${esc(r.lang || 'en')}">${esc(r.text)}</blockquote>
      <div class="who"><b>${esc(r.name)}</b>${donde}${tour}</div>
    </div></article>`
}

const ini = html.indexOf('<!-- REVIEWS-HTML:START -->'), fin = html.indexOf('<!-- REVIEWS-HTML:END -->')
if (ini < 0 || fin < 0) { console.error('✗ resenas-estaticas: faltan las marcas REVIEWS-HTML en resenas.html'); process.exit(1) }
const antes = (html.slice(ini, fin).match(/<blockquote/g) || []).length
if (lista.length < antes) { console.error(`✗ resenas-estaticas: reviews.json tiene ${lista.length} y la página ${antes}: no quito reseñas`); process.exit(1) }
const media = lista.reduce((s, r) => s + r.stars, 0) / lista.length
const bloque = `<!-- REVIEWS-HTML:START -->
    <!-- Generado por scripts/resenas-estaticas.mjs: todas las reseñas en el HTML (Google e IAs).
         El script de abajo la sustituye por la lista completa (Worker + reviews.json). -->
    <div class="rev-summary" id="revSummary">
      <div class="rev-score">${media.toFixed(1)}<small> / 5</small></div>
      <div class="grow">
        ${estrellas(media, `${media.toFixed(1)} de 5 estrellas`)}
        <div class="meta" style="margin-top:6px">Sobre ${lista.length} reseñas de clientes</div>
      </div>
    </div>
    <div class="rev-grid" id="revGrid">
${lista.map(tarjeta).join('\n')}
    </div>
    `
writeFileSync(PAGINA, html.slice(0, ini) + bloque + html.slice(fin))
console.log(`✓ resenas-estaticas: ${lista.length} reseñas escritas en resenas.html (antes ${antes}), media ${media.toFixed(1)}`)
