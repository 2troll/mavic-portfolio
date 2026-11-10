// Cloudflare («Email Obfuscation») cambia tony@tonykansaiguide.com por un enlace a
// /cdn-cgi/l/email-protection que, sin JavaScript, da 404: Google y los asistentes
// de IA no veían el correo en ninguna página. Cloudflare respeta las marcas
// <!--email_off--> … <!--/email_off-->, así que se envuelve el <body> de cada HTML.
// Uso (en el deploy, después de textos-ia): node scripts/correo-visible.mjs ../deploy
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const raiz = process.argv[2]
if (!raiz) { console.error('Uso: node scripts/correo-visible.mjs <carpeta>'); process.exit(1) }

let cambiadas = 0
function recorrer(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n)
    if (statSync(p).isDirectory()) { recorrer(p); continue }
    if (!n.endsWith('.html')) continue
    const html = readFileSync(p, 'utf8')
    if (html.includes('<!--email_off-->') || !/<body[^>]*>/i.test(html)) continue
    writeFileSync(p, html.replace(/(<body[^>]*>)/i, '$1<!--email_off-->').replace(/<\/body>/i, '<!--/email_off--></body>'))
    cambiadas++
  }
}
recorrer(raiz)
console.log(`✓ correo-visible: ${cambiadas} páginas con el correo sin ofuscar`)
