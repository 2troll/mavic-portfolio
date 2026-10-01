// Pétalos de sakura dibujados en canvas (sin imágenes). Los usan el corte de
// katana entre páginas y la lluvia suave de la portada de cada página.

export interface Petalo {
  x: number; y: number; vx: number; vy: number
  giro: number; vgiro: number; vuelta: number; vvuelta: number
  tam: number; vida: number; tono: number
}

/** Un pétalo: dos curvas y la muesca de la punta, que es lo que lo hace sakura. */
export function dibujaPetalo(g: CanvasRenderingContext2D, p: Petalo, alfa = 1) {
  g.save()
  g.translate(p.x, p.y)
  g.rotate(p.giro)
  // La «vuelta» aplasta el pétalo en un eje: parece que gira en el aire.
  g.scale(1, 0.35 + 0.65 * Math.abs(Math.cos(p.vuelta)))
  const t = p.tam
  const grad = g.createLinearGradient(0, -t, 0, t)
  grad.addColorStop(0, `hsla(${p.tono}, 85%, 92%, ${alfa})`)
  grad.addColorStop(1, `hsla(${p.tono - 8}, 75%, 78%, ${alfa})`)
  g.fillStyle = grad
  g.beginPath()
  g.moveTo(0, t)
  g.bezierCurveTo(t * 0.9, t * 0.45, t * 0.75, -t * 0.65, t * 0.22, -t)
  g.lineTo(0, -t * 0.72)
  g.lineTo(-t * 0.22, -t)
  g.bezierCurveTo(-t * 0.75, -t * 0.65, -t * 0.9, t * 0.45, 0, t)
  g.fill()
  g.restore()
}

export function nuevoPetalo(x: number, y: number, fuerza = 0): Petalo {
  const a = Math.random() * Math.PI * 2
  return {
    x, y,
    vx: Math.cos(a) * fuerza * Math.random() + 0.3,
    vy: Math.sin(a) * fuerza * Math.random() - fuerza * 0.2,
    giro: Math.random() * Math.PI * 2, vgiro: (Math.random() - 0.5) * 0.06,
    vuelta: Math.random() * Math.PI, vvuelta: 0.02 + Math.random() * 0.05,
    tam: 5 + Math.random() * 6, vida: 1, tono: 340 + Math.random() * 14,
  }
}

/** Un paso de física: gravedad suave, viento que oscila y giro. */
export function mueve(p: Petalo, t: number, gravedad = 0.025) {
  p.vy = Math.min(p.vy + gravedad, 1.6)
  p.vx += Math.sin(t / 900 + p.tono) * 0.008
  p.vx *= 0.995
  p.x += p.vx
  p.y += p.vy
  p.giro += p.vgiro
  p.vuelta += p.vvuelta
}

export const movimientoReducido = () =>
  typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
