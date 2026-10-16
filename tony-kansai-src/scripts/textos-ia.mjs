// node scripts/textos-ia.mjs <carpeta-de-despliegue>
//
// Hoy muchos clientes llegan preguntando a una IA (ChatGPT, Claude, Perplexity,
// Gemini). Esos asistentes leen mejor texto limpio que HTML con React. Tras
// rutas-estaticas.mjs, por cada página pregenerada:
//   1. escribe <ruta>/index.md con su texto (titulares, párrafos, listas,
//      enlaces, reseñas y precios tal cual salen en la web);
//   2. añade en su <head> <link rel="alternate" type="text/markdown">;
//   3. junta llms.txt + todas las páginas en /llms-full.txt.
// Sin dependencias: el HTML es nuestro y conocido, basta con un conversor corto.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const BASE = 'https://tonykansaiguide.com'
const dest = process.argv[2]
if (!dest || !existsSync(join(dest, 'sitemap.xml'))) {
  console.error('Uso: node scripts/textos-ia.mjs <carpeta con sitemap.xml ya desplegable>')
  process.exit(1)
}

const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" }
const descodificar = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) =>
    e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : ENTIDADES[e] ?? m)

function aMarkdown(html) {
  let s = html
    .replace(/<(script|style|svg|noscript|template|canvas|video|iframe|button|form|select)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+aria-hidden="true"[^>]*\/>/gi, '')
  s = s
    .replace(/<h([1-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, n, t) => `\n\n${'#'.repeat(+n)} ${t.replace(/<[^>]+>/g, ' ')}\n\n`)
    .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, h, t) => {
      const texto = t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      if (!texto) return ''
      const url = h.startsWith('/') ? BASE + h : h
      return /^(https?:|mailto:|tel:)/.test(url) ? `[${texto}](${url})` : texto
    })
    .replace(/<img\b[^>]*alt="([^"]+)"[^>]*>/gi, (_, a) => ` (${a}) `)
    .replace(/<li\b[^>]*>/gi, '\n- ')
    .replace(/<(br)\b[^>]*>/gi, '\n')
    .replace(/<\/?(p|div|section|article|header|footer|ul|ol|blockquote|figure|figcaption|dl|dt|dd|tr|table|details|summary)\b[^>]*>/gi, '\n')
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**')
    .replace(/<[^>]+>/g, ' ')
  s = descodificar(s)
  return s
    .split('\n')
    .map((l) => l.replace(/[ \t ]+/g, ' ').trim())
    .filter((l, i, a) => l !== '- ' && l !== '-' && !(l === '' && a[i - 1] === ''))
    .join('\n')
    .replace(/\*\*\s*\*\*/g, '')
    .trim()
}

const sitemap = readFileSync(join(dest, 'sitemap.xml'), 'utf8')
const rutas = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname))]

const paginas = []
for (const ruta of rutas) {
  const archivo = join(dest, ruta, 'index.html')
  if (!existsSync(archivo)) continue
  let html = readFileSync(archivo, 'utf8')
  if (/<meta[^>]+name="robots"[^>]+noindex/i.test(html)) continue
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]
  if (!main) continue
  const cuerpo = aMarkdown(main)
  if (cuerpo.length < 400) continue // la ruta no está pregenerada: sólo cabecera
  const titulo = descodificar(html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? ruta).trim()
  const desc = descodificar(html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] ?? '').trim()
  const idioma = html.match(/<html[^>]*\slang="([^"]+)"/i)?.[1] ?? ''
  const md = `# ${titulo}\n\nURL: ${BASE}${ruta}${idioma ? `\nIdioma: ${idioma}` : ''}${desc ? `\n\n> ${desc}` : ''}\n\n${cuerpo}\n`
  writeFileSync(join(dest, ruta, 'index.md'), md)
  if (!html.includes('type="text/markdown"')) {
    html = html.replace('</head>', `<link rel="alternate" type="text/markdown" href="${ruta}index.md" title="Texto para asistentes de IA"></head>`)
    writeFileSync(archivo, html)
  }
  paginas.push({ ruta, md })
}

if (paginas.length === 0) {
  console.error('✗ textos-ia: ninguna página pregenerada con <main>; algo falló antes')
  process.exit(1)
}

// Primero las páginas de Tony y Larion y las de respuesta; el resto, por ruta.
const peso = (r) => (/^\/(es|en|ar|ru|larion)\/$/.test(r) ? 0 : 1)
paginas.sort((a, b) => peso(a.ruta) - peso(b.ruta) || a.ruta.localeCompare(b.ruta))

const llms = existsSync(join(dest, 'llms.txt')) ? readFileSync(join(dest, 'llms.txt'), 'utf8').trim() : '# Tony Kansai Guide'
const hoy = new Date().toISOString().slice(0, 10)
const completo = `${llms}\n\n---\n\n# Contenido completo de tonykansaiguide.com (${hoy})\n\nTodas las páginas públicas en texto, con reseñas y precios tal como salen en la web.\n\n${paginas.map((p) => p.md).join('\n---\n\n')}`
writeFileSync(join(dest, 'llms-full.txt'), completo)
console.log(`✓ textos-ia: ${paginas.length} páginas en .md · llms-full.txt ${Math.round(completo.length / 1024)} KB`)
