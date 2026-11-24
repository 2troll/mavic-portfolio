// Cabecera común de TODAS las páginas en español (Tony, 25-11-2026: «en la barra
// del menú no hace falta que pongas nada, con tres rayitas… que sea básico… y eso
// va creciendo como roots»). Marca a la izquierda y ☰ a la derecha; al tocarlo se
// abre el árbol de la web. ESQUELETO: lo completa el agente «Estructura».
// Firma estable: <CabeceraEs /> sin props obligatorias.
import { Link } from 'react-router-dom'
import { Logo } from './Logo'

export function CabeceraEs({ activo }: { activo?: string } = {}) {
  void activo
  return (
    <header className="v7-cabecera cristal cab-es">
      <Link to="/es/" className="v7-marca" aria-label="Tony Kansai Guide"><Logo /></Link>
    </header>
  )
}
