// Foto real con relieve 3D: la foto y su mapa de profundidad (Depth Anything V2,
// calculado en local, public/v8/prof/) en un shader de paralaje. Lo cercano se
// mueve más que lo lejano al mover el ratón, el dedo o el scroll; sin nadie
// tocando, un vaivén lento. WebGL a pelo (sin three.js): pesa unos pocos KB.
// Sin WebGL o con «reducir movimiento», se queda la foto quieta.
import { useEffect, useRef } from 'react'
import { movimientoReducido } from '../v7/petalos'

const VERT = `attribute vec2 p; varying vec2 uv;
void main() { uv = vec2(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5); gl_Position = vec4(p, 0.0, 1.0); }`
// Paralaje con varias muestras a lo largo del desplazamiento: evita el «estirado»
// de los bordes de los objetos que da un solo desplazamiento.
const FRAG = `precision mediump float; varying vec2 uv;
uniform sampler2D foto; uniform sampler2D prof; uniform vec2 mov; uniform vec2 escala; uniform float fuerza;
void main() {
  vec2 c = (uv - 0.5) * escala + 0.5;
  vec2 d = vec2(0.0);
  for (int i = 0; i < 6; i++) {
    float z = texture2D(prof, c + d).r;
    d = mov * (z - 0.45) * fuerza;
  }
  gl_FragColor = texture2D(foto, c + d);
}`

/** Descarga y decodifica fuera del hilo principal, reducida al ancho que hace
 *  falta: decodificar la foto de 1800 px en el hilo principal daba un tirón de
 *  ~120 ms en móvil al bajar hasta la sección. */
async function carga(src: string, ancho: number): Promise<ImageBitmap | HTMLImageElement> {
  const blob = await fetch(src).then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
  if ('createImageBitmap' in window) {
    const b = await createImageBitmap(blob)
    if (b.width <= ancho) return b
    const alto = Math.round(b.height * ancho / b.width); b.close()
    return createImageBitmap(blob, { resizeWidth: ancho, resizeHeight: alto, resizeQuality: 'high' })
  }
  return new Promise((ok, mal) => { const i = new Image(); i.onload = () => ok(i); i.onerror = mal; i.src = URL.createObjectURL(blob) })
}
const anchoDe = (x: ImageBitmap | HTMLImageElement) => (x instanceof ImageBitmap ? x.width : x.naturalWidth)
const altoDe = (x: ImageBitmap | HTMLImageElement) => (x instanceof ImageBitmap ? x.height : x.naturalHeight)

export function Foto3D({ foto, prof, alt, className, fuerza = 0.035 }: { foto: string; prof: string; alt: string; className?: string; fuerza?: number }) {
  const caja = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = caja.current
    if (!el || movimientoReducido()) return
    const lienzo = document.createElement('canvas')
    const gl = lienzo.getContext('webgl', { antialias: false, premultipliedAlpha: false })
    if (!gl) return
    let vivo = true, raf = 0, visible = false
    let mx = 0, my = 0, tx = 0, ty = 0, ultimoToque = 0
    const ancho = { foto: 1, alto: 1 }

    const sh = (tipo: number, src: string) => { const s = gl.createShader(tipo)!; gl.shaderSource(s, src); gl.compileShader(s); return s }
    const prog = gl.createProgram()!
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const textura = (img: ImageBitmap | HTMLImageElement, unidad: number) => {
      const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unidad); gl.bindTexture(gl.TEXTURE_2D, t)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      if (img instanceof ImageBitmap) img.close()
    }
    const uMov = gl.getUniformLocation(prog, 'mov'), uEsc = gl.getUniformLocation(prog, 'escala')
    gl.uniform1i(gl.getUniformLocation(prog, 'foto'), 0); gl.uniform1i(gl.getUniformLocation(prog, 'prof'), 1)
    gl.uniform1f(gl.getUniformLocation(prog, 'fuerza'), fuerza)

    // «object-fit: cover» en el shader, con un 6 % de margen para que el
    // desplazamiento nunca enseñe el borde de la foto.
    const tam = () => {
      const r = el.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2)
      lienzo.width = Math.round(r.width * dpr); lienzo.height = Math.round(r.height * dpr)
      gl.viewport(0, 0, lienzo.width, lienzo.height)
      const rc = r.width / r.height, rf = ancho.foto / ancho.alto
      gl.uniform2f(uEsc, (rc > rf ? 1 : rc / rf) * 0.94, (rc > rf ? rf / rc : 1) * 0.94)
    }
    const pinta = (t: number) => {
      raf = 0
      if (!vivo) return
      // Sin interacción reciente, vaivén lento en ocho.
      if (t - ultimoToque > 2500) { tx = Math.sin(t / 2600) * 0.8; ty = Math.sin(t / 1900) * 0.35 }
      mx += (tx - mx) * 0.06; my += (ty - my) * 0.06
      gl.uniform2f(uMov, mx, my)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      if (visible && !document.hidden) raf = requestAnimationFrame(pinta)
    }
    const sigue = () => { if (!raf && visible && vivo) raf = requestAnimationFrame(pinta) }
    const mueve = (x: number, y: number) => {
      const r = el.getBoundingClientRect()
      tx = ((x - r.left) / r.width - 0.5) * 2; ty = ((y - r.top) / r.height - 0.5) * 2; ultimoToque = performance.now()
    }
    const raton = (e: PointerEvent) => mueve(e.clientX, e.clientY)
    el.addEventListener('pointermove', raton)

    // Ancho real del bloque en píxeles de pantalla (máx. 2x): ni más ni menos.
    // Se descarga solo cuando el bloque se acerca a la pantalla: antes bajaba
    // la foto grande y la decodificaba en plena carga de la página (~400 ms de
    // CPU en móvil y 285 KB que competían con la foto de portada).
    const empieza = () => {
    const px = Math.round(el.getBoundingClientRect().width * Math.min(window.devicePixelRatio || 1, 2) * 1.08)
    Promise.all([carga(foto, Math.max(640, px)), carga(prof, 640)]).then(([f, d]) => {
      if (!vivo) return
      ancho.foto = anchoDe(f); ancho.alto = altoDe(f)
      textura(f, 0); textura(d, 1)
      lienzo.className = 'f3d-lienzo'
      el.appendChild(lienzo); tam()
      el.classList.add('f3d-listo')
      sigue()
    }).catch(() => { /* se queda la foto quieta */ })
    }
    const cerca = new IntersectionObserver(([e]) => { if (e.isIntersecting) { cerca.disconnect(); empieza() } }, { rootMargin: '600px 0px' })
    cerca.observe(el)
    const ro = new ResizeObserver(tam); ro.observe(el)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sigue() }); io.observe(el)
    return () => {
      vivo = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); cerca.disconnect()
      el.removeEventListener('pointermove', raton); lienzo.remove()
    }
  }, [foto, prof, fuerza])

  return (
    <div ref={caja} className={`f3d ${className ?? ''}`}>
      <img loading="lazy" src={foto} alt={alt} decoding="async" />
    </div>
  )
}
