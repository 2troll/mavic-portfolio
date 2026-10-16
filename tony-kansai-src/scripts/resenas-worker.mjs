// node scripts/resenas-worker.mjs
//
// Las reseñas aprobadas desde el móvil viven en el Worker (/api/resenas/publicas)
// y la página sólo las pedía con JavaScript: ni Google ni las IAs (ChatGPT,
// Claude, Perplexity) las veían, y el JSON-LD contaba 6 en vez de 8. Antes del
// build se juntan con public/reviews.json (sin repetir id) para que salgan en
// el HTML pregenerado, en el JSON-LD y en llms-full.txt.
// Si el Worker no contesta, el build sigue con las que ya hay y lo dice.
import { readFileSync, writeFileSync } from 'node:fs'

const ARCHIVO = new URL('../public/reviews.json', import.meta.url)
const API = 'https://tonykansaiguide.com/api/resenas/publicas'

const datos = JSON.parse(readFileSync(ARCHIVO, 'utf8'))
let remotas = []
try {
  const r = await fetch(API, { signal: AbortSignal.timeout(15000) })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  remotas = (await r.json()).reviews ?? []
} catch (e) {
  console.warn(`⚠ resenas-worker: el Worker no contestó (${e.message}); sigo con ${datos.reviews.length} reseñas`)
  process.exit(0)
}

const vistos = new Set(datos.reviews.map((r) => r.id))
let nuevas = 0
for (const r of remotas) {
  if (!r?.id || !r.text || !r.stars || vistos.has(r.id)) continue
  const { aprobada, ...limpia } = r
  // Las más nuevas, primero: el Worker sólo guarda las recientes.
  datos.reviews.unshift(limpia)
  vistos.add(r.id)
  nuevas++
}
datos.count = datos.reviews.length
datos.average = Math.round((datos.reviews.reduce((s, r) => s + r.stars, 0) / datos.count) * 10) / 10
writeFileSync(ARCHIVO, JSON.stringify(datos, null, 2) + '\n')
console.log(`✓ resenas-worker: ${nuevas} del Worker + ${datos.count - nuevas} del archivo = ${datos.count} (media ${datos.average})`)
