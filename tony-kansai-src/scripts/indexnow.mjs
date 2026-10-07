// Avisa a los buscadores de IndexNow (Bing, Yandex, Seznam, Naver…) de que
// las páginas del sitemap han cambiado, para que no esperen a pasar solos.
// Gratis y sin cuenta: la prueba de que el sitio es nuestro es el fichero
// public/<clave>.txt. Uso, DESPUÉS de publicar:  node scripts/indexnow.mjs
import { readFileSync } from 'node:fs'

const CLAVE = '54a09739dfe30b33990862d145390628'
const HOST = 'tonykansaiguide.com'
const urls = [...readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8').matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1])

const r = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: CLAVE, keyLocation: `https://${HOST}/${CLAVE}.txt`, urlList: urls }),
})
// 200 y 202 son aceptado; 403 es que el fichero de la clave aún no está publicado.
console.log(`IndexNow: ${r.status} ${r.statusText} (${urls.length} URLs)`)
if (r.status >= 300) { console.error(await r.text()); process.exit(1) }
