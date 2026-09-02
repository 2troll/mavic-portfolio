// ─────────────────────────────────────────────────────────────────────────────
// dict — diccionario de contenido (estilo gettext)
//
// `i18n.ts` cubre la interfaz con claves tipadas (t.nav.home, t.hero.badge…).
// Este diccionario cubre el CONTENIDO: los textos que viven en `data.ts`
// (tours, rutas de montaña, guías, tarifas, FAQ) y las etiquetas largas de las
// páginas de detalle. Se indexa por la cadena inglesa original, así que el
// inglés no necesita fichero y cualquier texto sin traducir cae con elegancia
// al inglés en vez de romper la página.
//
// Añadir un idioma: crear el JSON y registrarlo en PHRASES.
// Comprobar qué falta: `node scripts/i18n-check.mjs`
// ─────────────────────────────────────────────────────────────────────────────
import type { Lang } from '../i18n'
import es from './es.json'
import ar from './ar.json'
import cs from './cs.json'
import ru from './ru.json'

type Phrases = Record<string, string>

export const PHRASES: Record<Lang, Phrases> = {
  en: {},
  es: es as Phrases,
  ar: ar as Phrases,
  cs: cs as Phrases,
  ru: ru as Phrases,
}

const warned = new Set<string>()

/** Traduce una cadena de contenido. Si no hay traducción, devuelve el inglés. */
export function translate(lang: Lang, text: string): string {
  if (!text || lang === 'en') return text
  const hit = PHRASES[lang][text]
  if (hit) return hit
  if (import.meta.env.DEV) {
    const key = `${lang}::${text}`
    if (!warned.has(key)) {
      warned.add(key)
      console.warn(`[i18n] sin traducir (${lang}): ${text}`)
    }
  }
  return text
}
