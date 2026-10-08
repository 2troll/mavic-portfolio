// Marco v7 (papel y tinta) para las seis páginas legales. El contenido es el
// de siempre (ya traducido en los cuatro idiomas); sólo cambian la cabecera,
// el pie y los colores, que se ajustan desde v7.css (.v7-legal).

import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { CORREO } from './contenido'
import { Logo } from './Logo'
import { BotonTema } from './Tema'
import './v7.css'

const VUELTA: Record<string, { ruta: string; texto: string }> = {
  es: { ruta: '/es/', texto: 'Volver' }, en: { ruta: '/en/', texto: 'Back' },
  ar: { ruta: '/ar/', texto: 'رجوع' }, ru: { ruta: '/ru/', texto: 'Назад' },
}

export function MarcoLegal({ children }: { children: ReactNode }) {
  const { lang, dir } = useLanguage()
  // Quien vino de la página de Larion en inglés vuelve a ella, no a la de Tony.
  let ultima: string | null = null
  try { ultima = localStorage.getItem('v7-pagina') } catch { /* bloqueado */ }
  const v = VUELTA[lang] ?? VUELTA.en
  const ruta = ultima === 'larion' && lang === 'en' ? '/larion/' : v.ruta
  return (
    <div className={`v7 v7-legal lang-${lang}`} lang={lang} dir={dir}>
      <header className="v7-cabecera cristal">
        <Link to={ruta} className="v7-marca" aria-label="Tony Kansai Guide"> <Logo />
        </Link>
        <nav className="v7-anclas">
          <Link to={ruta}>{dir === 'rtl' ? '→' : '←'} {v.texto}</Link>
        </nav>
        <BotonTema lang={lang} />
      </header>
      <main>{children}</main>
      <footer className="v7-pie">
        <strong>Tony Kansai Guide</strong>
        <p><a href={`mailto:${CORREO}`}>{CORREO}</a></p>
      </footer>
    </div>
  )
}
