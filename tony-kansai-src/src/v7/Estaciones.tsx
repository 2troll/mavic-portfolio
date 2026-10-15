// Las cuatro estaciones de la montaña japonesa sobre la portada y la franja de
// cifras: nieve con cristales de hielo (冬), sakura (春), luciérnagas (夏) y
// hojas de arce (秋). Al entrar sale la estación del mes; el visitante la cambia
// con los botones 春夏秋冬 y la foto se tiñe con la luz de cada una.
// Todo en canvas 2D con «sprites» pintados una vez (nada de shadowBlur por
// partícula), con el píxel limitado a 1,5 y parado fuera de pantalla. Con
// «reducir movimiento» no hay partículas: solo el tinte de la estación.
import { useEffect, useRef, useState } from 'react'
import { dibujaPetalo, movimientoReducido } from './petalos'
import './estaciones.css'

export type Estacion = 'primavera' | 'verano' | 'otono' | 'invierno'
type Lengua = 'es' | 'en' | 'ar' | 'ru'

const ORDEN: Estacion[] = ['primavera', 'verano', 'otono', 'invierno']
const KANJI: Record<Estacion, string> = { primavera: '春', verano: '夏', otono: '秋', invierno: '冬' }
const NOMBRE: Record<Lengua, Record<Estacion, string>> = {
  es: { primavera: 'Primavera', verano: 'Verano', otono: 'Otoño', invierno: 'Invierno' },
  en: { primavera: 'Spring', verano: 'Summer', otono: 'Autumn', invierno: 'Winter' },
  ar: { primavera: 'الربيع', verano: 'الصيف', otono: 'الخريف', invierno: 'الشتاء' },
  ru: { primavera: 'Весна', verano: 'Лето', otono: 'Осень', invierno: 'Зима' },
}
const ETIQUETA: Record<Lengua, string> = { es: 'Ver la montaña en', en: 'See the mountains in', ar: 'شاهد الجبال في', ru: 'Горы в сезон' }

/** La estación de Kansai según el mes (marzo-mayo, junio-agosto, sept.-nov., dic.-feb.). */
function estacionDelMes(m = new Date().getMonth() + 1): Estacion {
  return m >= 3 && m <= 5 ? 'primavera' : m <= 8 && m >= 6 ? 'verano' : m >= 9 && m <= 11 ? 'otono' : 'invierno'
}

// Estado compartido entre la portada y la franja: un valor y un evento.
const EVENTO = 'tkg-estacion'
let actual: Estacion = estacionDelMes()
function fija(e: Estacion) { actual = e; window.dispatchEvent(new CustomEvent(EVENTO)) }
export function useEstacion(): Estacion {
  const [e, setE] = useState(actual)
  useEffect(() => {
    const oye = () => setE(actual)
    window.addEventListener(EVENTO, oye)
    return () => window.removeEventListener(EVENTO, oye)
  }, [])
  return e
}

/** Botones 春夏秋冬 para cambiar de estación. */
export function SelectorEstacion({ lang }: { lang: Lengua }) {
  const e = useEstacion()
  return (
    <div className="es-selector" role="group" aria-label={ETIQUETA[lang]}>
      {ORDEN.map((x) => (
        <button key={x} type="button" aria-pressed={e === x} className={`es-boton es-${x}`} onClick={() => {
          fija(x)
          window.gtag?.('event', 'click', { pagina: `montana-${lang}`, canal: `estacion_${x}` })
        }}>
          <b lang="ja" aria-hidden="true">{KANJI[x]}</b><span>{NOMBRE[lang][x]}</span>
        </button>
      ))}
    </div>
  )
}

// ── Sprites: cada forma se pinta una vez en un canvas pequeño y luego se copia.
function sprite(tam: number, pinta: (g: CanvasRenderingContext2D, t: number) => void) {
  const c = document.createElement('canvas')
  c.width = c.height = tam
  const g = c.getContext('2d')!
  pinta(g, tam)
  return c
}
/** Copo: punto con halo suave. */
const copo = () => sprite(64, (g, t) => {
  const r = g.createRadialGradient(t / 2, t / 2, 0, t / 2, t / 2, t / 2)
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.35, 'rgba(240,248,255,0.85)'); r.addColorStop(1, 'rgba(220,235,255,0)')
  g.fillStyle = r; g.fillRect(0, 0, t, t)
})
/** Cristal de hielo: seis brazos con ramas, con un halo azulado debajo. */
const cristal = () => sprite(128, (g, t) => {
  const c = t / 2
  const halo = g.createRadialGradient(c, c, 0, c, c, c)
  halo.addColorStop(0, 'rgba(200,230,255,0.35)'); halo.addColorStop(1, 'rgba(200,230,255,0)')
  g.fillStyle = halo; g.fillRect(0, 0, t, t)
  g.translate(c, c); g.lineCap = 'round'
  for (const [ancho, color] of [[5, 'rgba(170,215,255,0.35)'], [1.8, 'rgba(255,255,255,0.95)']] as const) {
    g.strokeStyle = color; g.lineWidth = ancho
    for (let i = 0; i < 6; i++) {
      g.save(); g.rotate((i * Math.PI) / 3)
      g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -c * 0.82)
      for (const [y, l] of [[0.32, 0.22], [0.52, 0.17], [0.68, 0.1]]) {
        g.moveTo(0, -c * y); g.lineTo(c * l, -c * (y + l * 0.9))
        g.moveTo(0, -c * y); g.lineTo(-c * l, -c * (y + l * 0.9))
      }
      g.stroke(); g.restore()
    }
  }
  g.fillStyle = 'rgba(255,255,255,0.95)'; g.beginPath(); g.arc(0, 0, 3, 0, Math.PI * 2); g.fill()
})
/** Luciérnaga: núcleo verde limón y halo amplio, para mezclar en «lighter». */
const luz = () => sprite(64, (g, t) => {
  const r = g.createRadialGradient(t / 2, t / 2, 0, t / 2, t / 2, t / 2)
  r.addColorStop(0, 'rgba(250,255,190,1)'); r.addColorStop(0.18, 'rgba(210,255,90,0.9)'); r.addColorStop(0.5, 'rgba(160,230,60,0.25)'); r.addColorStop(1, 'rgba(120,200,40,0)')
  g.fillStyle = r; g.fillRect(0, 0, t, t)
})
/** Hoja de arce (momiji): siete lóbulos anchos en punta, tallo y nervios. */
function momiji(color: string, vena: string) {
  return sprite(128, (g, t) => {
    const R = t * 0.46
    g.translate(t / 2, t * 0.56)
    // Lóbulos de abajo a la izquierda hasta abajo a la derecha, en un abanico de 260°;
    // el central es el más largo, los de la base, cortos: así es la hoja de arce japonesa.
    const largos = [0.42, 0.72, 0.92, 1, 0.92, 0.72, 0.42]
    const ang = largos.map((_, i) => -Math.PI / 2 + ((i - 3) / 3) * (Math.PI * 0.72))
    const ancho = 0.2
    const valle = (a: number) => [Math.cos(a) * R * 0.3, Math.sin(a) * R * 0.3] as const
    g.beginPath()
    g.moveTo(0, R * 0.12)
    largos.forEach((l, i) => {
      const a = ang[i], L = R * l
      const v0 = valle(a - Math.PI * 0.12), v1 = valle(a + Math.PI * 0.12)
      if (i === 0) g.lineTo(...v0)
      // Borde del lóbulo: curva hacia fuera y punta afilada, con un diente a media altura.
      g.quadraticCurveTo(Math.cos(a - ancho) * L * 0.78, Math.sin(a - ancho) * L * 0.78, Math.cos(a - 0.05) * L * 0.86, Math.sin(a - 0.05) * L * 0.86)
      g.lineTo(Math.cos(a) * L, Math.sin(a) * L)
      g.lineTo(Math.cos(a + 0.05) * L * 0.86, Math.sin(a + 0.05) * L * 0.86)
      g.quadraticCurveTo(Math.cos(a + ancho) * L * 0.78, Math.sin(a + ancho) * L * 0.78, ...v1)
    })
    g.lineTo(0, R * 0.12)
    g.closePath()
    const gr = g.createRadialGradient(0, 0, R * 0.1, 0, 0, R)
    gr.addColorStop(0, vena); gr.addColorStop(0.55, color); gr.addColorStop(1, color)
    g.fillStyle = gr; g.fill()
    // Brillo de un lado: la hoja tiene volumen y no parece una pegatina.
    const brillo = g.createLinearGradient(-R, -R, R, R)
    brillo.addColorStop(0, 'rgba(255,240,200,0.28)'); brillo.addColorStop(0.5, 'rgba(255,255,255,0)')
    g.fillStyle = brillo; g.fill()
    g.strokeStyle = 'rgba(70,8,0,0.4)'; g.lineWidth = 1.1
    ang.forEach((a, i) => { g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * R * largos[i] * 0.85, Math.sin(a) * R * largos[i] * 0.85); g.stroke() })
    g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(R * 0.06, R * 0.35, R * 0.02, R * 0.52); g.lineWidth = 2.2; g.strokeStyle = vena; g.stroke()
  })
}

interface P { x: number; y: number; z: number; vx: number; vy: number; giro: number; vg: number; fase: number; tipo: number }

/** Lienzo de partículas de la estación, a todo lo ancho de su contenedor. */
export function LluviaEstacion({ densidad = 1 }: { densidad?: number }) {
  const lienzo = useRef<HTMLCanvasElement>(null)
  const estacion = useEstacion()

  useEffect(() => {
    const cv = lienzo.current
    if (!cv || movimientoReducido()) return
    const g = cv.getContext('2d')
    if (!g) return
    const dpr = Math.min(1.5, window.devicePixelRatio || 1)
    let W = 0, H = 0, marco = 0, visible = true, vivo = true
    const movil = window.innerWidth < 700
    const S = {
      copo: copo(), cristal: cristal(), luz: luz(),
      hojas: [momiji('#e8361c', '#a3170b'), momiji('#f07a12', '#b4430a'), momiji('#f2b51c', '#b37a0c'), momiji('#c9281f', '#7c1208')],
    }
    const cuantas = Math.round((estacion === 'invierno' ? 150 : estacion === 'verano' ? 46 : 54) * densidad * (movil ? 0.55 : 1))
    const ps: P[] = []
    const nace = (arriba: boolean): P => {
      const z = Math.random() // 0 = lejos, 1 = cerca: tamaño, velocidad y desenfoque
      return {
        x: Math.random() * W, y: arriba ? -40 - Math.random() * H * 0.3 : Math.random() * H, z,
        vx: (Math.random() - 0.3) * 0.4, vy: 0.35 + z * 1.1,
        giro: Math.random() * Math.PI * 2, vg: (Math.random() - 0.5) * 0.04, fase: Math.random() * 1000,
        tipo: estacion === 'invierno' ? (Math.random() < 0.07 ? 1 : 0) : Math.floor(Math.random() * 4),
      }
    }
    const mide = () => {
      const r = cv.getBoundingClientRect()
      W = r.width; H = r.height
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr)
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    mide()
    for (let i = 0; i < cuantas; i++) ps.push(nace(false))

    const pinta = (t: number) => {
      marco = 0
      if (!vivo) return
      g.clearRect(0, 0, W, H)
      const viento = Math.sin(t / 2600) * 0.5
      g.globalCompositeOperation = estacion === 'verano' ? 'lighter' : 'source-over'
      for (const p of ps) {
        if (estacion === 'verano') {
          // Luciérnagas: vagan despacio en la mitad baja y laten.
          p.x += Math.sin((t + p.fase * 7) / 1400) * 0.35 + p.vx * 0.3
          p.y += Math.cos((t + p.fase * 5) / 1700) * 0.25
          if (p.y < H * 0.35) p.y += 0.6
          if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20
          const late = 0.25 + 0.75 * Math.max(0, Math.sin((t + p.fase * 13) / 520))
          const s = 10 + p.z * 26
          g.globalAlpha = late * (0.5 + p.z * 0.5)
          g.drawImage(S.luz, p.x - s / 2, p.y - s / 2, s, s)
          continue
        }
        p.x += p.vx + viento * (0.4 + p.z) + Math.sin((t + p.fase) / 900) * (estacion === 'invierno' ? 0.25 : 0.6)
        p.y += p.vy * (estacion === 'invierno' ? 1 : 0.85)
        p.giro += p.vg
        if (p.y > H + 40 || p.x < -60 || p.x > W + 60) Object.assign(p, nace(true), { x: Math.random() * W })
        if (estacion === 'invierno') {
          if (p.tipo === 1) {
            // Cristal grande: gira despacio y destella cuando le da la luz.
            const s = 26 + p.z * 34
            g.globalAlpha = 0.55 + 0.45 * Math.abs(Math.sin((t + p.fase * 9) / 700))
            g.save(); g.translate(p.x, p.y); g.rotate(p.giro * 0.4); g.drawImage(S.cristal, -s / 2, -s / 2, s, s); g.restore()
          } else {
            const s = 3 + p.z * p.z * 13
            g.globalAlpha = 0.35 + p.z * 0.6
            g.drawImage(S.copo, p.x - s / 2, p.y - s / 2, s, s)
          }
        } else if (estacion === 'otono') {
          const s = 20 + p.z * p.z * 34
          g.globalAlpha = 0.7 + p.z * 0.3
          g.save(); g.translate(p.x, p.y); g.rotate(p.giro * 2)
          g.scale(1, 0.4 + 0.6 * Math.abs(Math.cos((t + p.fase) / 600)))
          g.drawImage(S.hojas[p.tipo], -s / 2, -s / 2, s, s); g.restore()
        } else {
          g.globalAlpha = 1
          dibujaPetalo(g, { x: p.x, y: p.y, vx: 0, vy: 0, giro: p.giro * 2, vgiro: 0, vuelta: (t + p.fase) / 380, vvuelta: 0, tam: 4 + p.z * 7, vida: 1, tono: 340 + p.tipo * 4 }, 0.55 + p.z * 0.45)
        }
      }
      g.globalAlpha = 1
      if (visible && !document.hidden) marco = requestAnimationFrame(pinta)
    }
    const arranca = () => { if (!marco && visible) marco = requestAnimationFrame(pinta) }
    const mira = new IntersectionObserver(([e]) => { visible = e.isIntersecting; arranca() })
    mira.observe(cv)
    const vuelve = () => arranca()
    document.addEventListener('visibilitychange', vuelve)
    const ro = new ResizeObserver(mide)
    ro.observe(cv)
    arranca()
    return () => {
      vivo = false
      cancelAnimationFrame(marco); mira.disconnect(); ro.disconnect()
      document.removeEventListener('visibilitychange', vuelve)
    }
  }, [estacion, densidad])

  return <canvas ref={lienzo} className="es-lienzo" aria-hidden="true" />
}

/** Capa de la estación para meter dentro de una sección con foto: tinte, escarcha y partículas. */
export function CapaEstacion({ densidad }: { densidad?: number }) {
  const e = useEstacion()
  return (
    <div className={`es-capa es-capa-${e}`} aria-hidden="true">
      <span className="es-tinte" />
      {e === 'invierno' && <span className="es-escarcha" />}
      <LluviaEstacion densidad={densidad} />
    </div>
  )
}
