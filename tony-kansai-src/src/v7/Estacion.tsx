// Las cuatro estaciones sobre la portada, dibujadas en canvas:
//   春 primavera — pétalos de sakura      夏 verano — hanabi (fuegos de festival)
//   秋 otoño     — hojas de momiji        冬 invierno — nieve
// Por defecto, la estación de hoy en Japón. El visitante puede probar las
// otras con el selector: así ve cómo es Kansai en la época en que vendría.

import { useEffect, useRef } from 'react'
import { dibujaPetalo, mueve, movimientoReducido, nuevoPetalo } from './petalos'
import type { Petalo } from './petalos'

export type Estacion = 'haru' | 'natsu' | 'aki' | 'fuyu'

/** Estación de hoy en Japón (por la fecha de Tokio, no la del visitante). */
export function estacionDeHoy(): Estacion {
  let mes = new Date().getMonth() + 1
  try { mes = Number(new Intl.DateTimeFormat('en', { month: 'numeric', timeZone: 'Asia/Tokyo' }).format(new Date())) } catch { /* sin Intl */ }
  return mes >= 3 && mes <= 5 ? 'haru' : mes >= 6 && mes <= 8 ? 'natsu' : mes >= 9 && mes <= 11 ? 'aki' : 'fuyu'
}

// ── Hojas de momiji ──
const ROJOS = ['#c8321f', '#d9481f', '#e2672a', '#b52a1c', '#e8952e']
function dibujaHoja(g: CanvasRenderingContext2D, p: Petalo) {
  g.save()
  g.translate(p.x, p.y)
  g.rotate(p.giro)
  g.scale(1, 0.4 + 0.6 * Math.abs(Math.cos(p.vuelta)))
  const t = p.tam * 1.9
  g.fillStyle = ROJOS[Math.floor(p.tono) % ROJOS.length]
  g.beginPath()
  // Siete puntas, la del centro más larga: la hoja de arce japonés.
  const puntas = 7
  for (let i = 0; i <= puntas * 2; i++) {
    const a = -Math.PI / 2 + (i / (puntas * 2)) * Math.PI * 2
    const centro = Math.abs(i - puntas) <= 1 ? 1 : 0
    const r = i % 2 === 0 ? t * (0.85 + 0.25 * centro) * (i === 0 || i === puntas * 2 ? 1 : 1) : t * 0.38
    g.lineTo(Math.cos(a) * r, Math.sin(a) * r)
  }
  g.closePath()
  g.fill()
  g.strokeStyle = 'rgba(90, 20, 10, 0.35)'
  g.lineWidth = 0.8
  g.beginPath(); g.moveTo(0, t * 0.9); g.lineTo(0, -t * 0.6); g.stroke()
  g.restore()
}

// ── Nieve ──
function dibujaCopo(g: CanvasRenderingContext2D, p: Petalo) {
  const r = p.tam * 0.45
  const grad = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.2)
  grad.addColorStop(0, 'rgba(255,255,255,0.95)')
  grad.addColorStop(0.45, 'rgba(255,255,255,0.55)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.beginPath(); g.arc(p.x, p.y, r * 2.2, 0, Math.PI * 2); g.fill()
}

// ── Hanabi ──
interface Chispa { x: number; y: number; vx: number; vy: number; vida: number; color: string }
const COLORES_HANABI = ['#ffd27a', '#ff7a59', '#ffffff', '#ffb3c7', '#8fd3ff', '#c8ff9a']
function estalla(chispas: Chispa[], w: number, h: number) {
  const x = w * (0.15 + Math.random() * 0.7), y = h * (0.12 + Math.random() * 0.3)
  const color = COLORES_HANABI[Math.floor(Math.random() * COLORES_HANABI.length)]
  const n = w < 600 ? 60 : 110
  const fuerza = 1.6 + Math.random() * 1.6
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const v = fuerza * (0.75 + Math.random() * 0.35)
    chispas.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vida: 1, color: Math.random() < 0.15 ? '#ffffff' : color })
  }
}

export function EfectoEstacion({ estacion, cantidad = 18 }: { estacion: Estacion; cantidad?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = ref.current
    if (!c || movimientoReducido()) return
    const g = c.getContext('2d')
    if (!g) return
    let w = 0, h = 0, raf = 0, visible = false, proximo = 0
    const tam = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = c.clientWidth; h = c.clientHeight
      c.width = w * dpr; c.height = h * dpr
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    tam()
    const n = Math.ceil((w < 600 ? 0.6 : 1) * cantidad * (estacion === 'fuyu' ? 3 : 1))
    const nace = (arriba: boolean): Petalo => {
      const p = nuevoPetalo(Math.random() * w * 1.1 - w * 0.1, arriba ? -20 : Math.random() * h, 0)
      p.vy = estacion === 'fuyu' ? 0.35 + Math.random() * 0.6 : 0.3 + Math.random() * 0.5
      p.vx = estacion === 'fuyu' ? (Math.random() - 0.5) * 0.3 : 0.15 + Math.random() * 0.35
      if (estacion === 'aki') p.tono = Math.random() * 10
      if (estacion === 'fuyu') p.tam = 2 + Math.random() * 6
      return p
    }
    const caen = estacion === 'natsu' ? [] : Array.from({ length: n }, () => nace(false))
    const chispas: Chispa[] = []

    const paso = (t: number) => {
      raf = 0
      if (estacion === 'natsu') {
        // Estela: en vez de borrar, se oscurece un poco lo anterior.
        g.globalCompositeOperation = 'destination-out'
        g.fillStyle = 'rgba(0,0,0,0.22)'
        g.fillRect(0, 0, w, h)
        g.globalCompositeOperation = 'lighter'
        if (t > proximo) { estalla(chispas, w, h); proximo = t + 1400 + Math.random() * 1800 }
        for (let i = chispas.length - 1; i >= 0; i--) {
          const s = chispas[i]
          s.vx *= 0.985; s.vy = s.vy * 0.985 + 0.025
          s.x += s.vx; s.y += s.vy
          s.vida -= 0.011
          if (s.vida <= 0) { chispas.splice(i, 1); continue }
          g.globalAlpha = Math.min(1, s.vida * 1.4)
          g.fillStyle = s.color
          g.beginPath(); g.arc(s.x, s.y, 1.6, 0, Math.PI * 2); g.fill()
        }
        g.globalAlpha = 1
        g.globalCompositeOperation = 'source-over'
      } else {
        g.clearRect(0, 0, w, h)
        for (let i = 0; i < caen.length; i++) {
          const p = caen[i]
          mueve(p, t, estacion === 'fuyu' ? 0.001 : 0.002)
          p.vy = Math.min(p.vy, estacion === 'fuyu' ? 1.1 : 0.9)
          if (p.y > h + 20 || p.x > w + 20 || p.x < -40) caen[i] = nace(true)
          if (estacion === 'haru') dibujaPetalo(g, p, 0.85)
          else if (estacion === 'aki') dibujaHoja(g, p)
          else dibujaCopo(g, p)
        }
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(paso)
    }
    const sigue = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(paso) }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sigue() })
    io.observe(c)
    const ro = new ResizeObserver(tam)
    ro.observe(c)
    document.addEventListener('visibilitychange', sigue)
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect()
      document.removeEventListener('visibilitychange', sigue)
      g.clearRect(0, 0, w, h)
    }
  }, [estacion, cantidad])

  return <canvas ref={ref} className="v7-sakura" aria-hidden="true" />
}

const NOMBRES: Record<string, Record<Estacion, string>> = {
  es: { haru: 'Primavera', natsu: 'Verano', aki: 'Otoño', fuyu: 'Invierno' },
  en: { haru: 'Spring', natsu: 'Summer', aki: 'Autumn', fuyu: 'Winter' },
  ar: { haru: 'الربيع', natsu: 'الصيف', aki: 'الخريف', fuyu: 'الشتاء' },
  ru: { haru: 'Весна', natsu: 'Лето', aki: 'Осень', fuyu: 'Зима' },
}
const KANJI: Record<Estacion, string> = { haru: '春', natsu: '夏', aki: '秋', fuyu: '冬' }

/** Selector 春 夏 秋 冬 de la portada. */
export function SelectorEstacion({ lang, valor, alCambiar }: { lang: string; valor: Estacion; alCambiar: (e: Estacion) => void }) {
  const nombres = NOMBRES[lang] ?? NOMBRES.en
  return (
    <div className="v7-estaciones cristal" role="radiogroup" aria-label={Object.values(nombres).join(' · ')}>
      {(['haru', 'natsu', 'aki', 'fuyu'] as Estacion[]).map((e) => (
        <button key={e} type="button" role="radio" aria-checked={e === valor} aria-label={nombres[e]} title={nombres[e]} onClick={() => alCambiar(e)}>
          <span lang="ja">{KANJI[e]}</span>
        </button>
      ))}
    </div>
  )
}
