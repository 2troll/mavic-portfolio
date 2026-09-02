import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { detectLang } from './contexts/LanguageContext'
import { loadPhrases } from './lib/dict'

// El idioma se conoce antes de pintar, así que se espera su diccionario:
// evita el parpadeo de ver la web en inglés durante un instante. Si falla,
// `loadPhrases` ya resuelve igualmente y la web sale en inglés.
loadPhrases(detectLang()).finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
