import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { TRANSLATIONS, LANG_META } from '../lib/i18n'
import type { Lang, Tr } from '../lib/i18n'

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Tr
  dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: TRANSLATIONS.en,
  dir: 'ltr',
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('tony-lang')
      if (saved && saved in TRANSLATIONS) return saved as Lang
    } catch { /* ignore */ }
    return 'en'
  })

  const setLang = (l: Lang) => {
    setLangState(l)
    try { localStorage.setItem('tony-lang', l) } catch { /* ignore */ }
  }

  const dir = LANG_META[lang].dir

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.setAttribute('lang', lang)
  }, [lang, dir])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: TRANSLATIONS[lang], dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
