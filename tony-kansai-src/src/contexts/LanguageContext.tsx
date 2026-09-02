import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import { TRANSLATIONS, LANG_META } from '../lib/i18n'
import type { Lang, Tr } from '../lib/i18n'
import { translate, loadPhrases, isLoaded } from '../lib/dict'

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  /** Interfaz: claves tipadas (t.nav.home). */
  t: Tr
  /** Contenido: traduce la cadena inglesa original (tours, rutas, textos largos). */
  tc: (text: string) => string
  dir: 'ltr' | 'rtl'
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: TRANSLATIONS.en,
  tc: (s) => s,
  dir: 'ltr',
  isRTL: false,
})

const STORAGE_KEY = 'tony-lang'

function isLang(value: string | null | undefined): value is Lang {
  return !!value && value in LANG_META
}

/** ?lang=ar  →  localStorage  →  idioma del navegador  →  inglés */
export function detectLang(): Lang {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang')?.toLowerCase()
    if (isLang(fromUrl)) return fromUrl
  } catch { /* ignore */ }

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isLang(saved)) return saved
  } catch { /* ignore */ }

  try {
    for (const tag of navigator.languages ?? [navigator.language]) {
      const base = tag.split('-')[0].toLowerCase()
      if (isLang(base)) return base
    }
  } catch { /* ignore */ }

  return 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)
  // Se incrementa cuando llega el diccionario de un idioma, para repintar.
  const [dictReady, setDictReady] = useState(() => (isLoaded(lang) ? 1 : 0))

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try { localStorage.setItem(STORAGE_KEY, l) } catch { /* ignore */ }
  }, [])

  const dir = LANG_META[lang].dir

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('dir', dir)
    root.setAttribute('lang', lang)
    // Marca la raíz para que la tipografía árabe y los ajustes RTL del CSS
    // se apliquen sin tocar cada componente.
    root.classList.toggle('lang-ar', lang === 'ar')
  }, [lang, dir])

  useEffect(() => {
    if (isLoaded(lang)) { setDictReady((n) => n + 1); return }
    let alive = true
    loadPhrases(lang).then(() => { if (alive) setDictReady((n) => n + 1) })
    return () => { alive = false }
  }, [lang])

  // dictReady entra en las dependencias a propósito: al llegar el diccionario
  // hay que devolver un `tc` nuevo para que React vuelva a pintar los textos.
  const tc = useCallback((text: string) => translate(lang, text), [lang, dictReady])

  const value = useMemo(
    () => ({ lang, setLang, t: TRANSLATIONS[lang], tc, dir, isRTL: dir === 'rtl' }),
    [lang, setLang, tc, dir],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}
