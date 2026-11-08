// Planes de venta en la web React (páginas de Tony y Larion, y de ventajas).
// El HTML lo genera planesHTML() para que sea idéntico al de las estáticas y
// quede en el prerender; el JSON-LD va en el mismo bloque para Google y las IAs.
import { planesHTML, planesLD, type LangPlan } from './datosPlanes'
import './planes.css'

export function PlanesVenta({ lang, guia, url, titulo = true }: { lang: LangPlan; guia: string; url: string; titulo?: boolean }) {
  const ld = JSON.stringify({ '@context': 'https://schema.org', ...planesLD(lang, guia, url) }).replace(/</g, '\\u003c')
  return (
    <>
      <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: planesHTML(lang, guia, { titulo }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld }} />
    </>
  )
}
