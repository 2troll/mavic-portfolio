// La raíz no hace elegir: lleva directo a la página del idioma del navegador
// (español, árabe, ruso y vecinos; el resto, inglés). Desde ahí se cambia de
// idioma con el selector de la cabecera. ?lang= manda sobre el navegador.
import { Navigate, useLocation } from 'react-router-dom'
import { PAGINAS } from './contenido'
import type { PaginaId } from './contenido'

/** es → es; ar → ar; ruso y vecinos → ru; el resto, inglés. */
function idiomaSugerido(): PaginaId {
  try {
    for (const tag of navigator.languages ?? [navigator.language]) {
      const b = tag.split('-')[0].toLowerCase()
      if (b === 'es' || b === 'ar' || b === 'en') return b
      if (['ru', 'uk', 'be', 'kk', 'uz', 'hy', 'ka'].includes(b)) return 'ru'
    }
  } catch { /* sin navigator */ }
  return 'en'
}

export default function Redirige() {
  const { search } = useLocation()
  const pedido = new URLSearchParams(search).get('lang') as PaginaId | null
  // Si ya eligió idioma otra vez, se respeta; si no, el del navegador.
  let guardado: string | null = null
  try { guardado = localStorage.getItem('v7-pagina') } catch { /* bloqueado */ }
  const id: PaginaId = pedido && pedido in PAGINAS ? pedido
    : guardado && guardado in PAGINAS ? (guardado as PaginaId)
    : idiomaSugerido()
  return <Navigate to={PAGINAS[id].ruta} replace />
}
