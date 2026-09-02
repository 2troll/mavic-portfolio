// ─────────────────────────────────────────────────────────────────────────────
// dict — diccionario de contenido (estilo gettext)
//
// `i18n.ts` cubre la interfaz con claves tipadas (t.nav.home, t.hero.badge…).
// Este diccionario cubre el CONTENIDO: los textos que viven en `data.ts`
// (tours, rutas de montaña, guías, tarifas, FAQ) y las etiquetas de las
// páginas de detalle y legales. Se indexa por la cadena inglesa original, así
// que el inglés no necesita fichero y cualquier texto sin traducir cae con
// elegancia al inglés en vez de romper la página.
//
// Cada idioma va en su propio chunk y se descarga sólo el que se usa: son
// ~24 kB comprimidos por idioma, y cargarlos todos sería regalar 90 kB al
// móvil de un cliente que sólo lee uno.
//
// Añadir un idioma: crear el JSON y registrarlo en LOADERS.
// Comprobar qué falta: `node scripts/i18n-check.mjs`
// ─────────────────────────────────────────────────────────────────────────────
import type { Lang } from '../i18n'

type Phrases = Record<string, string>

const LOADERS: Partial<Record<Lang, () => Promise<{ default: Phrases }>>> = {
  es: () => import('./es.json'),
  ar: () => import('./ar.json'),
  cs: () => import('./cs.json'),
  ru: () => import('./ru.json'),
}

const loaded: Partial<Record<Lang, Phrases>> = { en: {} }
const inFlight: Partial<Record<Lang, Promise<void>>> = {}

/** Descarga el diccionario de un idioma (una sola vez). El inglés no tiene. */
export function loadPhrases(lang: Lang): Promise<void> {
  if (loaded[lang]) return Promise.resolve()
  const loader = LOADERS[lang]
  if (!loader) return Promise.resolve()
  if (!inFlight[lang]) {
    inFlight[lang] = loader()
      .then((mod) => { loaded[lang] = mod.default })
      .catch((err) => {
        // Sin diccionario la web sigue en pie, en inglés.
        console.error(`[i18n] no se pudo cargar el diccionario ${lang}:`, err)
        loaded[lang] = {}
      })
  }
  return inFlight[lang]!
}

export function isLoaded(lang: Lang): boolean {
  return !!loaded[lang]
}

const warned = new Set<string>()

/** Traduce una cadena de contenido. Si no hay traducción, devuelve el inglés. */
export function translate(lang: Lang, text: string): string {
  if (!text || lang === 'en') return text
  const hit = loaded[lang]?.[text]
  if (hit) return hit
  if (import.meta.env.DEV && loaded[lang]) {
    const key = `${lang}::${text}`
    if (!warned.has(key)) {
      warned.add(key)
      console.warn(`[i18n] sin traducir (${lang}): ${text}`)
    }
  }
  return text
}
