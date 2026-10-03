import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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

const pinta = () => createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
// Sólo montaña, legales y /admin traducen con el diccionario. Las páginas de
// guía, de ciudad y del día tienen su texto en el código: esperar la descarga
// del diccionario era una ida y vuelta más antes de pintar el titular (LCP).
const USA_DICCIONARIO = /^\/(es\/montana|(en|ar|ru)\/hiking|terms|privacy|cookies|safety|legal|accessibility|admin)(\/|$)/
if (USA_DICCIONARIO.test(location.pathname)) loadPhrases(idioma).finally(pinta)
else { pinta(); loadPhrases(idioma) }
