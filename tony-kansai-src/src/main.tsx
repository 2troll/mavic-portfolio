import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { detectLang } from './contexts/LanguageContext'
import { loadPhrases } from './lib/dict'
import { cargaFuenteArabe } from './lib/arabicFont'

// El idioma se conoce antes de pintar, así que se espera su diccionario:
// evita el parpadeo de ver la web en inglés durante un instante. Si falla,
// `loadPhrases` ya resuelve igualmente y la web sale en inglés.
const idioma = detectLang()
// En árabe la fuente se pide ya, antes de pintar: si esperase al efecto de
// React se vería un instante con la tipografía de sistema.
if (idioma === 'ar') cargaFuenteArabe()

const raiz = document.getElementById('root')!
const arbol = (
  <StrictMode>
    <App />
  </StrictMode>
)
// Si el HTML ya trae la página pintada (rutas-estaticas.mjs), se hidrata: el
// titular se ve sin esperar a React. Si no, se pinta desde cero.
const pinta = () => (raiz.hasChildNodes() ? hydrateRoot(raiz, arbol) : createRoot(raiz).render(arbol))
// Sólo montaña, legales y /admin traducen con el diccionario. Las páginas de
// guía, de ciudad y del día tienen su texto en el código: esperar la descarga
// del diccionario era una ida y vuelta más antes de pintar el titular (LCP).
const USA_DICCIONARIO = /^\/(es\/montana|(en|ar|ru)\/hiking|terms|privacy|cookies|safety|legal|accessibility|admin)(\/|$)/
if (USA_DICCIONARIO.test(location.pathname)) loadPhrases(idioma).finally(pinta)
else pinta()  // el diccionario lo pide LanguageContext cuando la página ya ha cargado
