#!/usr/bin/env node
// Comprueba que no queda ni una cadena sin traducir.
//
//   node scripts/i18n-check.mjs
//
// Recorre lo que el código pide con tc(...) y todo el texto visible de
// data.ts, y lo contrasta con src/lib/dict/*.json. Sale con código 1 si
// falta algo, así que sirve tal cual en un hook de pre-commit o en CI.
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const LANGS = ['es', 'ar', 'cs', 'ru']

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  )
}

const sources = walk(join(root, 'src')).filter((f) => /\.tsx?$/.test(f))

// 1) Todo lo que el código pasa por tc('...') / tc("...")
const wanted = new Set()
for (const f of sources) {
  const code = readFileSync(f, 'utf8')
  for (const m of code.matchAll(/tc\(\s*'((?:[^'\\]|\\.)*)'\s*\)/g)) wanted.add(m[1].replace(/\\'/g, "'"))
  for (const m of code.matchAll(/tc\(\s*"((?:[^"\\]|\\.)*)"\s*\)/g)) wanted.add(m[1].replace(/\\"/g, '"'))
  // El fallback del error boundary traduce con t('...') porque no puede usar el hook.
  for (const m of code.matchAll(/\bt\(\s*'((?:[^'\\]|\\.)*)'\s*\)/g)) wanted.add(m[1].replace(/\\'/g, "'"))
}

// 2) Constantes de módulo que se traducen por variable, no por literal
for (const extra of ['All', 'Easy', 'Moderate', 'Hard', 'Technical', 'Expert Only',
                     'Transit', 'Hiking', 'At Site', 'April 2026', 'May 2026']) {
  wanted.add(extra)
}

// 3) Todo el texto visible de data.ts y de la prosa de las fichas de guía
const data = readFileSync(join(root, 'src/lib/data.ts'), 'utf8')
  + '\n' + readFileSync(join(root, 'src/pages/GuideDetail.tsx'), 'utf8')
      .split('export default')[0]
      .split('\n').filter((l) => !l.startsWith('import ')).join('\n')
// se saltan URLs, ids, clases de Tailwind y direcciones de correo
const skip = /^(https?:|\/|#|&|from-|via-|to-|photo-|[a-z0-9]+(-[a-z0-9]+)*$)|@/
for (let i = 0; i < data.length; i++) {
  const q = data[i]
  if (q !== "'" && q !== '"' && q !== '`') continue
  let j = i + 1
  let out = ''
  while (j < data.length && data[j] !== q) {
    if (data[j] === '\\') { out += data[j + 1]; j += 2; continue }
    out += data[j]; j++
  }
  i = j
  // Basta una letra: "~2 h" o "4.7 km one way" también son texto visible.
  // Los códigos de idioma (EN, ES, AR…) se muestran tal cual y no se traducen.
  if (out && !skip.test(out) && /[A-Za-z]/.test(out) && !/^[A-Z]{2,3}$/.test(out)) wanted.add(out)
}

let failed = false
for (const lang of LANGS) {
  const dict = JSON.parse(readFileSync(join(root, `src/lib/dict/${lang}.json`), 'utf8'))
  const missing = [...wanted].filter((k) => !(k in dict)).sort()
  const orphan = Object.keys(dict).filter((k) => !wanted.has(k)).sort()

  if (missing.length) {
    failed = true
    console.error(`\n✗ ${lang}: ${missing.length} sin traducir`)
    for (const m of missing) console.error(`    ${m}`)
  } else {
    console.log(`✓ ${lang}: ${Object.keys(dict).length} cadenas, ninguna sin traducir`)
  }
  if (orphan.length) {
    console.warn(`  · ${lang}: ${orphan.length} traducciones que ya nadie usa (se pueden borrar)`)
    for (const o of orphan.slice(0, 10)) console.warn(`      ${o}`)
    if (orphan.length > 10) console.warn(`      … y ${orphan.length - 10} más`)
  }
}


// 4) Texto en inglés escrito a pelo dentro del JSX (lo que se nos escapó
//    varias veces: párrafos largos que ningún tc() envuelve).
const HARD_TEXT = />\s*([A-Z][^<>{}]{20,600}?)\s*</gs
const CODEY = /=>|\bconst\b|\breturn\b|\bfunction\b|[;()]/
// Un teléfono o un correo no son texto traducible.
const CONTACT = /\+\d[\d\s]{6,}|@/
const hardcoded = []
for (const f of sources) {
  if (f.endsWith('Admin.tsx') || f.endsWith('.ts')) continue
  const code = readFileSync(f, 'utf8')
  for (const m of code.matchAll(HARD_TEXT)) {
    const text = m[1].replace(/\s+/g, ' ').trim()
    if (CODEY.test(text) || CONTACT.test(text)) continue
    if (text.split(' ').length < 4) continue
    hardcoded.push(`${f.replace(root + '/', '')}: ${text.slice(0, 90)}…`)
  }
}
if (hardcoded.length) {
  failed = true
  console.error(`\n✗ ${hardcoded.length} texto(s) sin envolver en tc() dentro del JSX`)
  for (const h of hardcoded) console.error(`    ${h}`)
}

process.exit(failed ? 1 : 0)
