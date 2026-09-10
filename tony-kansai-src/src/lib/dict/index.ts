// ─────────────────────────────────────────────────────────────────────────────
// dict — diccionario de contenido (estilo gettext)
//
// `i18n.ts` cubre la interfaz con claves tipadas (t.nav.home, t.hero.badge…).
// Este diccionario cubre el CONTENIDO: los textos que viven en `data.ts`
// (tours, rutas de montaña, guías, tarifas, FAQ), las páginas de detalle y las
// legales. Se indexa por la cadena inglesa original, así que el inglés no
// necesita fichero y cualquier texto sin traducir cae con elegancia al inglés
// en vez de romper la página.
//
// Los JSON viven en `public/i18n/` y se piden por red, NO se importan. El
// despliegue compila con `vite-plugin-singlefile`, que mete todo lo importado
// dentro del index.html: importarlos obligaría a cada visitante a descargar
// los cinco idiomas (unos 170 kB comprimidos de más) para leer uno solo. Así
// se baja únicamente el suyo, ~24 kB, y además se pueden corregir traducciones
// sin recompilar la web.
//
// Añadir un idioma: crear public/i18n/<código>.json y registrarlo en LANG_META.
// Comprobar qué falta: `npm run i18n`
// ─────────────────────────────────────────────────────────────────────────────
import type { Lang } from '../i18n'

type Phrases = Record<string, string>

const loaded: Partial<Record<Lang, Phrases>> = { en: {} }
const inFlight: Partial<Record<Lang, Promise<void>>> = {}

/** Descarga el diccionario de un idioma (una sola vez). El inglés no tiene. */
export function loadPhrases(lang: Lang): Promise<void> {
  if (loaded[lang]) return Promise.resolve()
  if (!inFlight[lang]) {
    const url = `${import.meta.env.BASE_URL}i18n/${lang}.json`
    inFlight[lang] = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<Phrases>
      })
      .then((data) => { loaded[lang] = data })
      .catch((err) => {
        // Sin diccionario la web sigue en pie, en inglés.
        console.error(`[i18n] no se pudo cargar ${url}:`, err)
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
