// Miniaturas webp de las fotos de las reseñas, para la portada española.
// Las fotos completas las sirve el Worker (/api/resenas/fotopub?id=…) sin
// redimensionar (90–460 KB cada una); en una tarjeta de 340 px sobran.
//
// Uso (a mano, NO va en `npm run build` ni en el despliegue; los webp se commitean):
//   node scripts/miniaturas-resenas.mjs
// Necesita red y `cwebp` (brew install webp). Es idempotente: no rehace las que ya existen.
//
// Salida:
//   public/resenas/min/<clave>-640.webp   tarjeta (≤ 640 px de ancho, calidad 72)
//   public/resenas/min/<clave>-160.webp   fila «Fotos de nuestros viajeros»
//   src/v7/resenas-min.json               { "<photo tal cual en la reseña>": { src, w, h, mini } }
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const WEB = 'https://tonykansaiguide.com'
const SALIDA = join(RAIZ, 'public/resenas/min')
const LISTA = join(RAIZ, 'src/v7/resenas-min.json')
// Cloudflare bloquea agentes genéricos (error 1010): uno propio.
const CABECERAS = { 'User-Agent': 'tk-miniaturas/1.0' }

function falla(msg) { console.error(`✗ ${msg}`); process.exit(1) }

try { execFileSync('cwebp', ['-version'], { stdio: 'ignore' }) } catch { falla('falta cwebp: instálalo con `brew install webp`') }

/** La clave del archivo: el id del Worker o el nombre del archivo local. */
const claveDe = (photo) => (photo.match(/[?&]id=([\w-]+)/)?.[1] ?? photo.split('/').pop().replace(/\.\w+$/, '')).replace(/[^\w-]/g, '')

async function bajar(url) {
  let r
  try { r = await fetch(url, { headers: CABECERAS }) } catch (e) { falla(`sin red o ${WEB} no contesta (${e.cause?.code ?? e.message}). Conéctate y vuelve a lanzarlo.`) }
  if (!r.ok) throw new Error(`${r.status} en ${url}`)
  return Buffer.from(await r.arrayBuffer())
}

function medidas(archivo) {
  const o = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', archivo], { encoding: 'utf8' })
  return [Number(o.match(/pixelWidth: (\d+)/)?.[1]), Number(o.match(/pixelHeight: (\d+)/)?.[1])]
}

/** Las verticales se recortan a cuadrado (centrado al 40 % de alto, como el
 *  object-position de resenas-es.css): la tarjeta solo enseña un 5:4 y el resto
 *  de la altura era peso. Si pasa de 50 KB, se repite con menos calidad. */
function aWebp(origen, destino, ancho, [w, h], calidad) {
  const lado = Math.min(w, h)
  const recorte = h > w ? ['-crop', '0', String(Math.round((h - lado) * 0.4)), String(w), String(lado)] : []
  const final = Math.min(ancho, w)
  for (const q of [calidad, calidad - 10, calidad - 18]) {
    execFileSync('cwebp', ['-quiet', '-q', String(q), '-m', '6', '-metadata', 'none', ...recorte, ...(w > final ? ['-resize', String(final), '0'] : []), origen, '-o', destino])
    if (ancho < 640 || readFileSync(destino).length <= 50 * 1024) return
  }
}

// Fotos de reviews.json y, si contesta, de las aprobadas en el Worker (no están en el archivo).
const fotos = new Set()
for (const r of JSON.parse(readFileSync(join(RAIZ, 'public/reviews.json'), 'utf8')).reviews ?? []) if (r.photo) fotos.add(r.photo)
try {
  const pub = JSON.parse((await bajar(`${WEB}/api/resenas/publicas`)).toString())
  for (const r of pub.reviews ?? []) if (r.photo) fotos.add(r.photo)
} catch (e) { console.warn(`! sin las del Worker (${e.message}); sigo con reviews.json`) }

mkdirSync(SALIDA, { recursive: true })
const previa = existsSync(LISTA) ? JSON.parse(readFileSync(LISTA, 'utf8')) : {}
const lista = {}
const tmp = mkdtempSync(join(tmpdir(), 'mini-resenas-'))
let nuevas = 0, errores = 0
for (const photo of [...fotos].sort()) {
  const clave = claveDe(photo)
  const tarjeta = join(SALIDA, `${clave}-640.webp`), mini = join(SALIDA, `${clave}-160.webp`)
  try {
    if (!existsSync(tarjeta) || !existsSync(mini) || !previa[photo]) {
      const local = join(RAIZ, 'public', photo.replace(/^\//, ''))
      let origen = local
      if (photo.includes('/api/') || !existsSync(local)) {
        origen = join(tmp, `${clave}.jpg`)
        writeFileSync(origen, await bajar(WEB + (photo.startsWith('/') ? photo : `/${photo}`)))
      }
      const tam = medidas(origen)
      if (!existsSync(tarjeta)) aWebp(origen, tarjeta, 640, tam, 72)
      if (!existsSync(mini)) aWebp(origen, mini, 160, tam, 70)
      nuevas++
    }
    const [w, h] = medidas(tarjeta)
    lista[photo] = { src: `/resenas/min/${clave}-640.webp`, w, h, mini: `/resenas/min/${clave}-160.webp` }
    const kb = Math.round(readFileSync(tarjeta).length / 1024)
    console.log(`${kb > 50 ? '!' : '✓'} ${clave}  ${w}×${h}  ${kb} KB${kb > 50 ? ' (más de 50 KB)' : ''}`)
  } catch (e) { errores++; console.error(`✗ ${photo}: ${e.message}`) }
}
rmSync(tmp, { recursive: true, force: true })
writeFileSync(LISTA, JSON.stringify(lista, null, 1) + '\n')
console.log(`${Object.keys(lista).length} miniaturas en la lista (${nuevas} nuevas, ${errores} errores) → ${LISTA.replace(RAIZ + '/', '')}`)
if (errores) process.exit(1)
