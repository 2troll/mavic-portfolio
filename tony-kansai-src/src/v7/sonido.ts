// Sonido de la web: apagado por defecto (los navegadores no dejan sonar sin
// un toque, y un móvil que suena solo en el metro espanta al cliente). Al
// encenderlo: campana de templo de bienvenida, un arroyo de fondo y, de vez
// en cuando, un shishi-odoshi (ciudad) o un hototogisu (montaña). El corte de
// katana suena al cambiar de página y un fūrin en cada transformación.
//
// Sonidos de Wikimedia Commons; autores y licencias en CREDITOS_SONIDO.

type Nombre = 'katana' | 'furin' | 'campana' | 'shishiodoshi' | 'hototogisu' | 'arroyo'
export type Ambiente = 'ciudad' | 'montana'

export const CREDITOS_SONIDO = [
  { sonido: 'Campana de templo (bonshō)', autor: 'Jnn', licencia: 'CC BY 2.1 JP', url: 'https://commons.wikimedia.org/wiki/File:Bonsyou5599.ogg' },
  { sonido: 'Hototogisu', autor: 'ISAKA Yoji', licencia: 'CC BY 2.1 JP', url: 'https://commons.wikimedia.org/wiki/File:Hototogisu_07b8051.ogg' },
  { sonido: 'Shishi-odoshi', autor: 'Fg2', licencia: 'Dominio público', url: 'https://commons.wikimedia.org/wiki/File:Shishiodoshi-LS100103.ogg' },
  { sonido: 'Arroyo', autor: 'stephan', licencia: 'Dominio público', url: 'https://commons.wikimedia.org/wiki/File:Shallow_small_river_with_stony_riverbed.ogg' },
  { sonido: 'Campanillas de viento', autor: 'Esc861', licencia: 'Dominio público', url: 'https://commons.wikimedia.org/wiki/File:Windchimes.ogg' },
  { sonido: 'Espada', autor: 'Gravity Sound', licencia: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Sword_9_(Gravity_Sound).mp3' },
]

const VOLUMEN: Record<Nombre, number> = { katana: 0.55, furin: 0.35, campana: 0.5, shishiodoshi: 0.45, hototogisu: 0.4, arroyo: 0.22 }
const CLAVE = 'v7-sonido'

let ctx: AudioContext | null = null
let general: GainNode | null = null
const buffers = new Map<Nombre, Promise<AudioBuffer | null>>()
let encendido = false
let ambiente: Ambiente | null = null
let fondo: AudioBufferSourceNode | null = null
let reloj = 0
const oyentes = new Set<(on: boolean) => void>()

function buffer(n: Nombre) {
  if (!buffers.has(n)) {
    buffers.set(n, fetch(`/v7/sonidos/${n}.m4a`)
      .then((r) => r.arrayBuffer())
      .then((a) => ctx!.decodeAudioData(a))
      .catch(() => null))
  }
  return buffers.get(n)!
}

/** Toca un sonido una vez, si el sonido está encendido. */
export async function suena(n: Exclude<Nombre, 'arroyo'>) {
  if (!encendido || !ctx || !general || document.hidden) return
  const b = await buffer(n)
  if (!b || !encendido) return
  const s = ctx.createBufferSource()
  const g = ctx.createGain()
  g.gain.value = VOLUMEN[n]
  s.buffer = b
  s.connect(g).connect(general)
  s.start()
}

async function arrancaFondo() {
  if (!ctx || !general || fondo || !ambiente) return
  const b = await buffer('arroyo')
  if (!b || !encendido || fondo) return
  fondo = ctx.createBufferSource()
  fondo.buffer = b
  fondo.loop = true // el archivo ya viene con el final fundido en el principio
  const g = ctx.createGain()
  g.gain.setValueAtTime(0, ctx.currentTime)
  g.gain.linearRampToValueAtTime(VOLUMEN.arroyo, ctx.currentTime + 3)
  fondo.connect(g).connect(general)
  fondo.start()
  programa()
}

/** Cada 25–45 s, el sonido propio del lugar. */
function programa() {
  clearTimeout(reloj)
  reloj = window.setTimeout(() => {
    if (encendido) suena(ambiente === 'montana' ? 'hototogisu' : 'shishiodoshi')
    if (encendido) programa()
  }, 25000 + Math.random() * 20000)
}

function paraFondo() {
  clearTimeout(reloj)
  try { fondo?.stop() } catch { /* ya parado */ }
  fondo = null
}

export function estaEncendido() { return encendido }

export function alCambiar(f: (on: boolean) => void) {
  oyentes.add(f)
  return () => { oyentes.delete(f) }
}

/** Se llama desde un clic: es lo que permite crear el AudioContext. */
export async function enciende(on: boolean) {
  encendido = on
  try { localStorage.setItem(CLAVE, on ? '1' : '0') } catch { /* bloqueado */ }
  oyentes.forEach((f) => f(on))
  if (!on) { paraFondo(); await ctx?.suspend(); return }
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new AC()
    general = ctx.createGain()
    general.connect(ctx.destination)
  }
  await ctx.resume()
  suena('campana')
  arrancaFondo()
}

/** Cada página dice qué ambiente le toca. */
export function ponAmbiente(a: Ambiente) {
  if (ambiente === a) return
  ambiente = a
  paraFondo()
  if (encendido) arrancaFondo()
}

/** Si lo dejó encendido otra vez, se reactiva con su primer toque en la página. */
export function recuerda() {
  let quiere = false
  try { quiere = localStorage.getItem(CLAVE) === '1' } catch { /* bloqueado */ }
  if (!quiere || encendido) return
  const primerToque = () => { enciende(true) }
  window.addEventListener('pointerdown', primerToque, { once: true })
  window.addEventListener('keydown', primerToque, { once: true })
}

// Pestaña en segundo plano: silencio. Al volver, sigue.
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!ctx || !encendido) return
    if (document.hidden) ctx.suspend()
    else ctx.resume()
  })
}
