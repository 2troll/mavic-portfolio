// Detalles de interfaz aprendidos de «The Kitchen» de dqnamo.com, rehechos para
// esta web (sin Tailwind ni librerías nuevas, con el estilo pixel de la casa):
//  · CodigoCifrado: el código de descuento llega «cifrado» y se descifra letra a
//    letra cuando entra en pantalla, para que el ojo se pare en él.
//  · useBilletes: las tarjetas de precio se inclinan un poco hacia el puntero,
//    como un billete en la mano, y el sello holográfico cambia de color con el
//    scroll y el ratón. Todo con variables CSS y un solo requestAnimationFrame.
// Con «reducir movimiento» del sistema no se anima nada: se ve el estado final.
import { useEffect, useRef, useState } from 'react'
import './cocina.css'

const CIFRA = '-_~!@#$%^&*+=<>?/|'
const quieto = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const cifrar = (txt: string, vistas: number) =>
  Array.from(txt, (c, i) => (i < vistas || c.trim() === '' ? c : CIFRA[Math.floor(Math.random() * CIFRA.length)])).join('')

export function CodigoCifrado({ children, className }: { children: string; className?: string }) {
  const caja = useRef<HTMLElement>(null)
  // Sin JS o con movimiento reducido, el código sale tal cual desde el principio.
  const [texto, setTexto] = useState(children)

  useEffect(() => {
    const el = caja.current
    if (!el || quieto() || typeof IntersectionObserver === 'undefined') { setTexto(children); return }
    let reloj = 0
    const mira = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      mira.disconnect()
      let vistas = 0
      setTexto(cifrar(children, 0))
      reloj = window.setInterval(() => {
        vistas += 1
        setTexto(cifrar(children, vistas))
        if (vistas >= children.length) window.clearInterval(reloj)
      }, 55)
    }, { threshold: 0.6 })
    mira.observe(el)
    return () => { mira.disconnect(); window.clearInterval(reloj) }
  }, [children])

  return (
    <code ref={caja} className={className} dir="ltr">
      <span aria-hidden="true">{texto}</span>
      <span className="ck-solo-lector">{children}</span>
    </code>
  )
}

/** Inclinación de billete en `.ck-billete` y brillo holográfico en `.ck-foil`, dentro de `raiz`. */
export function useBilletes(raiz: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const zona = raiz.current
    if (!zona || quieto()) return
    const finos = matchMedia('(hover: hover) and (pointer: fine)').matches
    let marco = 0
    let px = 0.5, py = 0.5

    const pinta = () => {
      marco = 0
      const alto = window.innerHeight
      zona.querySelectorAll<HTMLElement>('.ck-foil').forEach((f) => {
        const r = f.getBoundingClientRect()
        const avance = Math.min(1, Math.max(0, (alto - r.top) / (alto + r.height)))
        f.style.setProperty('--ck-desliza', `${(avance * 160 + (px - 0.5) * 60).toFixed(1)}%`)
        f.style.setProperty('--ck-angulo', `${(110 + avance * 80 + (px - 0.5) * 30).toFixed(1)}deg`)
      })
    }
    const pide = () => { if (!marco) marco = requestAnimationFrame(pinta) }

    // La inclinación solo con ratón: en el móvil, al deslizar, mareaba.
    const mueve = (e: PointerEvent) => {
      px = e.clientX / window.innerWidth; py = e.clientY / window.innerHeight
      const b = (e.target as Element | null)?.closest?.<HTMLElement>('.ck-billete')
      if (finos && b && zona.contains(b)) {
        const r = b.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
        b.style.setProperty('--ck-rx', `${(-y * 5).toFixed(2)}deg`)
        b.style.setProperty('--ck-ry', `${(x * 6).toFixed(2)}deg`)
      }
      pide()
    }
    const sale = (e: PointerEvent) => {
      const b = (e.target as Element | null)?.closest?.<HTMLElement>('.ck-billete')
      if (b && !b.contains(e.relatedTarget as Node | null)) { b.style.setProperty('--ck-rx', '0deg'); b.style.setProperty('--ck-ry', '0deg') }
    }

    window.addEventListener('pointermove', mueve, { passive: true })
    zona.addEventListener('pointerout', sale, { passive: true })
    window.addEventListener('scroll', pide, { passive: true })
    pide()
    return () => {
      window.removeEventListener('pointermove', mueve)
      zona.removeEventListener('pointerout', sale)
      window.removeEventListener('scroll', pide)
      if (marco) cancelAnimationFrame(marco)
    }
  }, [raiz])
}

/** Cifra que sube desde 0 hasta su valor al entrar en pantalla, como un altímetro. */
export function Contador({ valor, formato, ms = 1600 }: { valor: number; formato: (v: number) => string; ms?: number }) {
  const caja = useRef<HTMLElement>(null)
  const [v, setV] = useState(valor)

  useEffect(() => {
    const el = caja.current
    if (!el || quieto() || typeof IntersectionObserver === 'undefined') return
    let marco = 0
    setV(0)
    const mira = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      mira.disconnect()
      const t0 = performance.now()
      const paso = (t: number) => {
        const k = Math.min(1, (t - t0) / ms)
        // Frena al final (easeOutCubic): los últimos metros cuestan más.
        const x = valor * (1 - Math.pow(1 - k, 3))
        setV(k < 1 ? (Number.isInteger(valor) ? Math.round(x) : Math.round(x * 10) / 10) : valor)
        if (k < 1) marco = requestAnimationFrame(paso)
      }
      marco = requestAnimationFrame(paso)
    }, { threshold: 0.4 })
    mira.observe(el)
    return () => { mira.disconnect(); cancelAnimationFrame(marco) }
  }, [valor, ms])

  return (
    <bdi ref={caja} className="ck-contador">
      <span aria-hidden="true">{formato(v)}</span>
      <span className="ck-solo-lector">{formato(valor)}</span>
    </bdi>
  )
}

/** Borde troquelado de sello de correos, como clip-path (idea del Stamp de dqnamo). */
function troquel(nx: number, ny: number, hondo: number) {
  const p: string[] = []
  const pt = (x: number, y: number) => p.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`)
  const sx = 100 / nx, sy = 100 / ny
  for (let i = 0; i < nx; i++) { const a = i * sx; pt(a + sx * 0.25, 0); pt(a + sx * 0.5, hondo); pt(a + sx * 0.75, 0); pt(a + sx, 0) }
  for (let i = 0; i < ny; i++) { const a = i * sy; pt(100, a + sy * 0.25); pt(100 - hondo, a + sy * 0.5); pt(100, a + sy * 0.75); pt(100, a + sy) }
  for (let i = 0; i < nx; i++) { const a = 100 - i * sx; pt(a - sx * 0.25, 100); pt(a - sx * 0.5, 100 - hondo); pt(a - sx * 0.75, 100); pt(a - sx, 100) }
  for (let i = 0; i < ny; i++) { const a = 100 - i * sy; pt(0, a - sy * 0.25); pt(hondo, a - sy * 0.5); pt(0, a - sy * 0.75); pt(0, a - sy) }
  return `polygon(${p.join(', ')})`
}
const TROQUEL = troquel(6, 7, 4)

/** Sello de cumbre: papel troquelado con tinta roja que «cae» sobre la ficha al verla. */
export function SelloCumbre({ arriba, abajo }: { arriba: string; abajo: string }) {
  return (
    // La sombra va fuera: un clip-path en el mismo elemento se la comería.
    <span className="ck-sello" aria-hidden="true">
      <span className="ck-sello-papel" style={{ clipPath: TROQUEL }}>
        <span className="ck-sello-tinta">
          <b lang="ja">{arriba}</b>
          <small dir="ltr">{abajo}</small>
        </span>
      </span>
    </span>
  )
}

/** Hace «caer» los `.ck-sello` de `raiz` cuando cada uno entra en pantalla. */
export function useSellos(raiz: React.RefObject<HTMLElement | null>, clave: unknown) {
  useEffect(() => {
    const zona = raiz.current
    if (!zona || quieto() || typeof IntersectionObserver === 'undefined') return
    zona.classList.add('ck-sellos-anima')
    // Se mira la tarjeta y no el sello: el sello, agrandado antes de caer, queda
    // recortado por la tarjeta y nunca llegaba a contar como visible.
    const mira = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.querySelector('.ck-sello')?.classList.add('ck-visto'); mira.unobserve(e.target) }
    }), { threshold: 0.55 })
    zona.querySelectorAll('.ck-sello:not(.ck-visto)').forEach((s) => s.parentElement && mira.observe(s.parentElement))
    return () => mira.disconnect()
  }, [raiz, clave])
}
