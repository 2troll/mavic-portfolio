// Recorre TODAS las páginas del build local (servido en :5193), mide y captura.
import { createRequire } from 'module'
import { readdirSync, statSync, writeFileSync } from 'fs'
import { join } from 'path'
const require = createRequire('/Users/tonyhanma/.local/share/mise/installs/node/24.22.2/lib/node_modules/@playwright/cli/')
const { chromium } = require('playwright-core')
const [RAIZ, SALIDA, BASE = 'http://localhost:5193'] = process.argv.slice(2)
const rutas = []
;(function rec(d, rel) { for (const f of readdirSync(d)) { const p = join(d, f); if (f === 'assets' || f === 'v7' || f === 'v8') continue
  if (statSync(p).isDirectory()) rec(p, rel + f + '/'); else if (f.endsWith('.html') && f !== '200.html') rutas.push(f === 'index.html' ? '/' + rel : '/' + rel + f) } })(RAIZ, '')
rutas.sort()
console.log(rutas.length, 'rutas')
const b = await chromium.launch({ executablePath: '/Users/tonyhanma/Library/Caches/ms-playwright/chromium_headless_shell-1254/chrome-headless-shell-mac-arm64/chrome-headless-shell' })
const res = []; let i = 0, hechas = 0
async function obrero() {
  const c = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, locale: 'es-ES', reducedMotion: 'reduce' })
  await c.addInitScript(() => { try { localStorage.setItem('tony-cookie-consent', 'declined'); localStorage.setItem('v7-idioma-elegido', '1') } catch (e) {} })
  while (i < rutas.length) {
    const ruta = rutas[i++]; const p = await c.newPage(); const errores = []
    p.on('pageerror', e => errores.push(String(e.message).slice(0, 120)))
    const r = { ruta }
    try {
      const resp = await p.goto(BASE + ruta, { waitUntil: 'load', timeout: 25000 }); r.estado = resp?.status()
      await p.waitForTimeout(900)
      r.ancho = await p.evaluate(medir, 1280)
      await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(500)
      r.movil = await p.evaluate(medir, 390)
      const nombre = ruta.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'raiz'
      await p.screenshot({ path: `${SALIDA}/fotos/${nombre}.jpg`, type: 'jpeg', quality: 50 }); r.foto = `fotos/${nombre}.jpg`
    } catch (e) { r.fallo = String(e.message).slice(0, 160) }
    r.errores = errores; res.push(r); await p.close()
    if (++hechas % 50 === 0) console.log(hechas)
  }
  await c.close()
}
function medir(ancho) {
  const d = document, vis = el => { const s = getComputedStyle(el); const q = el.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && q.width > 0 && q.height > 0 }
  const o = { lang: d.documentElement.lang, titulo: d.title, h1: (d.querySelector('h1')?.textContent || '').trim().slice(0, 90) }
  o.noindex = /noindex/i.test(d.querySelector('meta[name=robots]')?.content || '')
  o.cabecera = d.querySelector('.cab-es') ? 'cab-es' : d.querySelector('.cab-en') ? 'cab-en' : d.querySelector('.v7-cabecera') ? 'v7' : d.querySelector('header') ? 'otra' : 'ninguna'
  o.pie = d.querySelector('.pie-es') ? 'pie-es' : d.querySelector('.pie-en') ? 'pie-en' : d.querySelector('.v7-pie') ? 'v7' : d.querySelector('footer') ? 'otro' : 'ninguno'
  o.letra = getComputedStyle(d.body).fontFamily.split(',')[0].replace(/["']/g, '')
  o.desborda = d.scrollingElement.scrollWidth > ancho + 2
  o.hojas = d.styleSheets.length
  // Texto: ¿pegado a la izquierda?
  const bloques = [...d.querySelectorAll('main p, main h2, main li, article p, section p, body > p, h2, p')].filter(vis).slice(0, 80).map(e => e.getBoundingClientRect())
  if (bloques.length) { const iz = bloques.map(q => q.left).sort((a, b) => a - b), de = bloques.map(q => q.right).sort((a, b) => a - b)
    o.izq = Math.round(iz[Math.floor(iz.length / 2)]); o.der = Math.round(de[Math.floor(de.length / 2)]) }
  // Botones apretados
  const botones = [...d.querySelectorAll('button, [role=button], a')].filter(vis).filter(e => { if (e.tagName !== 'A') return true; const s = getComputedStyle(e); return (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent') || parseFloat(s.borderTopWidth) > 0 && s.borderTopStyle !== 'none' && s.display !== 'inline' })
  const malos = []
  for (const e of botones) { const q = e.getBoundingClientRect(), s = getComputedStyle(e); const txt = (e.textContent || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 40)
    const pi = parseFloat(s.paddingLeft), pd = parseFloat(s.paddingRight); const corto = q.height < 36, justo = txt && (pi < 8 || pd < 8) && q.width < 300 && e.children.length < 3, corta = e.scrollWidth > e.clientWidth + 2 && e.scrollWidth < e.clientWidth * 1.6, oculto = q.width < 30 && q.height < 20
    if (oculto || /^©/.test(txt)) continue
    if (corto || corta) malos.push({ t: txt, h: Math.round(q.height), w: Math.round(q.width), p: Math.round(pi) + '/' + Math.round(pd), m: [corto && 'bajo', justo && 'sin aire', corta && 'texto cortado'].filter(Boolean).join(',') }) }
  o.botones = botones.length; o.malos = malos.slice(0, 12); o.nMalos = malos.length
  o.imgRotas = [...d.images].filter(im => im.complete && im.naturalWidth === 0 && im.src).length
  return o
}
await Promise.all([obrero(), obrero(), obrero(), obrero(), obrero()])
await b.close()
writeFileSync(`${SALIDA}/datos.json`, JSON.stringify(res))
console.log('fin', res.length)
