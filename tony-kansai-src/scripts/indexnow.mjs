// Avisa a los buscadores de IndexNow (Bing, Yandex, Seznam, Naver…) de que
// las páginas del sitemap han cambiado, para que no esperen a pasar solos.
// Gratis y sin cuenta: la prueba de que el sitio es nuestro es el fichero
// public/<clave>.txt. Uso, DESPUÉS de publicar:
//   node scripts/indexnow.mjs [--recientes] [--anterior=ruta/sitemap.xml]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const CLAVE = '54a09739dfe30b33990862d145390628'
const HOST = 'tonykansaiguide.com'
// --recientes: lee el sitemap YA publicado (lo usa el despliegue automático).
// --anterior=<ruta>: sitemap de la publicación anterior. Si existe, solo se
//   avisa de las URL nuevas o con <lastmod> distinto, y al acabar bien se guarda
//   ahí el sitemap actual para la próxima vez. Sin él, vale lo de los dos
//   últimos días. Antes cada despliegue reenviaba esos dos días enteros: con
//   10-13 publicaciones al día eran ~5.000 avisos diarios para ~600 páginas, y
//   Bing deja de hacer caso a quien repite URL sin cambios.
const recientes = process.argv.includes('--recientes')
const anterior = process.argv.find((a) => a.startsWith('--anterior='))?.slice('--anterior='.length)
const sitemap = recientes
  ? await (await fetch(`https://${HOST}/sitemap.xml?v=${Date.now()}`)).text()
  : readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8')

const leer = (xml) => [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
  .map((m) => ({ loc: m[1].match(/<loc>([^<]*)/)?.[1], mod: m[1].match(/<lastmod>([^<]*)/)?.[1] ?? '' }))
  .filter((u) => u.loc)
const actuales = leer(sitemap)
if (!actuales.length) { console.error('IndexNow: el sitemap publicado no tiene URLs'); process.exit(1) }

const previo = anterior && existsSync(anterior) ? new Map(leer(readFileSync(anterior, 'utf8')).map((u) => [u.loc, u.mod])) : null
const desde = new Date(Date.now() - 2 * 864e5).toISOString().slice(0, 10)
const urls = actuales
  .filter((u) => (previo ? previo.get(u.loc) !== u.mod : !recientes || u.mod.slice(0, 10) >= desde))
  .map((u) => u.loc)
const origen = previo ? 'frente a la publicación anterior' : recientes ? 'últimos 2 días' : 'todo el sitemap'

const guardar = () => {
  if (!anterior) return
  mkdirSync(dirname(anterior), { recursive: true })
  writeFileSync(anterior, sitemap)
}
if (!urls.length) { console.log(`IndexNow: nada cambiado (${origen})`); guardar(); process.exit(0) }

const r = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: CLAVE, keyLocation: `https://${HOST}/${CLAVE}.txt`, urlList: urls }),
})
// 200 y 202 son aceptado; 403 es que el fichero de la clave aún no está publicado.
// Si falla, NO se guarda el sitemap: la próxima publicación vuelve a avisar de lo mismo.
console.log(`IndexNow: ${r.status} ${r.statusText} (${urls.length} URLs, ${origen})`)
if (r.status >= 300) { console.error(await r.text()); process.exit(1) }
guardar()
