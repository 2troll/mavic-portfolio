// Cabecera común de las páginas en INGLÉS (Tony, 25-11-2026: «la página inglés
// separada, otra cosa» — diseño propio, distinto del español). ESQUELETO: lo
// completa el agente INGLÉS. Firma estable: <CabeceraEn activo? enPagina? idiomas? />.
import { Link } from 'react-router-dom'
import { Logo } from './Logo'

export interface EnlacePaginaEn { texto: string; ruta: string }
export function CabeceraEn({ activo, enPagina, idiomas }: { activo?: string; enPagina?: EnlacePaginaEn[]; idiomas?: { lang: string; ruta: string; texto: string }[] } = {}) {
  void activo; void enPagina; void idiomas
  return (
    <header className="v7-cabecera cristal cab-en">
      <Link to="/en/" className="v7-marca" aria-label="Tony Kansai Guide"><Logo /></Link>
    </header>
  )
}
