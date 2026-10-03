// Monta a sus hijos sólo cuando la sección se acerca a la pantalla. Para el 3D
// (globo, rutas, maquetas): three.js y los modelos no se descargan al abrir la
// página, sino al bajar hacia ellos. El hueco reserva su alto: no hay saltos.
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export function CuandoCerca({ children, alto, id, className }: { children: ReactNode; alto: number | string; id?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [cerca, setCerca] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || cerca) return
    if (!('IntersectionObserver' in window)) { setCerca(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setCerca(true); io.disconnect() } }, { rootMargin: '800px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [cerca])
  if (cerca) return <>{children}</>
  return <div ref={ref} id={id} className={className} style={{ minHeight: alto }} aria-hidden="true" />
}
