// Apariciones suaves al bajar por la portada troncal (rediseño de Antonio,
// 21-11-2026): solo opacidad y 16 px, con GSAP (efecto de librería, no a mano).
// Nada que parezca un fallo: ni letras que giran, ni sellos que saltan.
//
// · GSAP se carga aparte y después de pintar: no pesa en la primera pantalla
//   del móvil, que es la que decide si el cliente se queda.
// · Solo se esconde lo que todavía está por debajo de la pantalla al cargar;
//   lo que ya se ve no parpadea. El HTML pregenerado sale siempre visible
//   (Google, las IAs y quien no tiene JavaScript lo leen igual).
// · Con «reducir movimiento» no se anima nada.
// · Opacidad, no visibility: lo que aún no ha aparecido sigue siendo enfocable con el teclado.

import { useEffect } from 'react'
import type { RefObject } from 'react'

export function useAparicion(raiz: RefObject<HTMLElement>, activo: boolean) {
  useEffect(() => {
    const el = raiz.current
    if (!activo || !el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let cancelado = false
    let limpiar = () => {}
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (cancelado) return
        gsap.registerPlugin(ScrollTrigger)
        const alto = window.innerHeight
        const piezas = Array.from(el.querySelectorAll<HTMLElement>('[data-aparece]'))
          .filter((x) => x.getBoundingClientRect().top > alto)
        if (!piezas.length) return
        gsap.set(piezas, { opacity: 0, y: 16 })
        const disparos = ScrollTrigger.batch(piezas, {
          start: 'top 92%',
          once: true,
          onEnter: (lote) => { gsap.to(lote, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08, overwrite: true }) },
        })
        limpiar = () => {
          disparos.forEach((d) => d.kill())
          gsap.set(piezas, { clearProps: 'opacity,transform' })
        }
      })
      // Sin GSAP (bloqueado o sin red) la página se ve igual, quieta.
      .catch(() => {})
    return () => { cancelado = true; limpiar() }
  }, [activo, raiz])
}
