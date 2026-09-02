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
}

// 2) Constantes de módulo que se traducen por variable, no por literal
for (const extra of ['All', 'Easy', 'Moderate', 'Hard', 'Technical', 'Expert Only',
                     'Transit', 'Hiking', 'At Site', 'April 2026', 'May 2026']) {
  wanted.add(extra)
}

// 3) Todo el texto visible de data.ts
const data = readFileSync(join(root, 'src/lib/data.ts'), 'utf8')
// se saltan URLs, ids, clases de Tailwind y direcciones de correo
const skip = /^(https?:|\/|#|from-|via-|to-|photo-|[a-z0-9]+(-[a-z0-9]+)*$)|@/
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
  if (out && !skip.test(out) && /[A-Za-z]{3}/.test(out)) wanted.add(out)
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

process.exit(failed ? 1 : 0)
