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

loadPhrases(idioma).finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
