// La raíz no hace elegir: lleva directo a la página del idioma del navegador
// (español, árabe, ruso y vecinos; el resto, inglés). Desde ahí se cambia de
// idioma con el selector de la cabecera. ?lang= manda sobre el navegador.
import { Navigate, useLocation } from 'react-router-dom'
import { PAGINAS } from './contenido'
import type { PaginaId } from './contenido'
import { ELEGIDO, idiomaPrincipal } from './SugerenciaIdioma'

/** es → es; ar → ar; ruso y vecinos → ru; el resto, inglés. */
export function idiomaSugerido(): PaginaId {
  try {
    for (const tag of navigator.languages ?? [navigator.language]) {
      const b = tag.split('-')[0].toLowerCase()
      if (b === 'es' || b === 'ar' || b === 'en') return b
      if (['ru', 'uk', 'be', 'kk', 'uz', 'hy', 'ka'].includes(b)) return 'ru'
    }
  } catch { /* sin navigator */ }
  return 'en'
}

/** Adónde lleva cada página antigua dentro de la web del idioma elegido. */
export type Destino = 'inicio' | 'precios' | 'rutas' | 'montana'
const DIA: Record<PaginaId, string> = { es: '/es/rutas/', en: '/en/routes/', ar: '/ar/routes/', ru: '/ru/routes/', larion: '/larion/routes/' }
// Larion no tiene página de montaña propia: la inglesa es la que le toca.
const MONTE: Record<PaginaId, string> = { es: '/es/montana/', en: '/en/hiking/', ar: '/ar/hiking/', ru: '/ru/hiking/', larion: '/en/hiking/' }

export default function Redirige({ destino = 'inicio' }: { destino?: Destino }) {
  const { search } = useLocation()
  const pedido = new URLSearchParams(search).get('lang') as PaginaId | null
  // Si ya eligió idioma otra vez, se respeta; si no, el del navegador.
  let guardado: string | null = null
  try { guardado = localStorage.getItem('v7-pagina') } catch { /* bloqueado */ }
  const id: PaginaId = pedido && pedido in PAGINAS ? pedido
    : guardado && guardado in PAGINAS ? (guardado as PaginaId)
    : idiomaSugerido()
  const to = destino === 'rutas' ? DIA[id] : destino === 'montana' ? MONTE[id]
    : destino === 'precios' ? `${PAGINAS[id].ruta}#precios` : PAGINAS[id].ruta
  return <Navigate to={to} replace />
}

/**
 * La raíz «/» es la x-default: Google pide que sea una página para elegir idioma
 * y que no se redirija por el idioma del navegador. Redirigiendo siempre, Google
 * veía «/» y /en/ como la misma página y no indexaba /en/ (Search Console, 17-11-2026:
 * «Duplicada: Google ha elegido una versión canónica diferente», canónica = «/»).
 * Ahora solo se salta la portada quien ya eligió idioma (o llega con ?lang=);
 * los demás ven el equipo y los idiomas, que vienen pintados en el HTML
 * (main#portada-texto, fuera de #root: lo pone scripts/rutas-estaticas.mjs).
 */
export function PortadaRaiz() {
  const { search } = useLocation()
  const pedido = new URLSearchParams(search).get('lang')
  let guardado: string | null = null
  try { guardado = localStorage.getItem('v7-pagina') } catch { /* bloqueado */ }
  if ((pedido && pedido in PAGINAS) || (guardado && guardado in PAGINAS)) return <Redirige />
  // Navegador en español → directo a /es/ (21-11-2026: la mayoría de clientes son
  // hispanohablantes). Google lee la raíz con el navegador en inglés: sigue viendo
  // la página de idiomas, que es lo que pide para la x-default.
  let elegido: string | null = null
  try { elegido = localStorage.getItem(ELEGIDO) } catch { /* bloqueado */ }
  if (!elegido && idiomaPrincipal() === 'es') return <Navigate to="/es/" replace />
  return null
}
