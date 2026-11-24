// Pie común de las páginas en INGLÉS. ESQUELETO: lo completa el agente INGLÉS.
// Firma estable: <PieEn p={PAGINAS.en} />.
import type { Pagina } from './contenido'

export function PieEn({ p }: { p: Pagina }) {
  return <footer className="v7-pie pie-en"><p>{p.pie.lema}</p></footer>
}
