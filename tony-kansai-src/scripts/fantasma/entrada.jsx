// Monta el GhostCursor de React Bits (https://reactbits.dev, MIT + Commons Clause)
// en la portada de las páginas de leyendas. Se compila con esbuild a public/es/leyendas/fantasma.js.
import { createRoot } from 'react-dom/client'
import GhostCursor from './GhostCursor.jsx'

const sitio = document.getElementById('fantasma')
const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches
if (sitio && !reducir) {
  createRoot(sitio).render(
    <GhostCursor color="#7FA3C4" brightness={0.65} size={70} trailLength={55} turbulence={0.6} drift={0.4} bloomStrength={0.45} zIndex={1} />
  )
}
