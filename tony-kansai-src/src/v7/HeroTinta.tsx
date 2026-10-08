// Portada en movimiento: pase de fotos 4K del destino con transición de tinta.
//
// La <img> de siempre sigue siendo lo primero que se ve (y lo que mide la
// velocidad de carga). Cuando el navegador está libre, encima aparece este
// lienzo WebGL con la misma foto: se acerca muy despacio, se inclina un poco
// con el ratón y, cada pocos segundos, una mancha de tinta sumi se extiende
// por el papel y deja ver la siguiente. WebGL a pelo: son dos texturas y un
// shader, no hace falta three.js aquí.

import { useEffect, useRef, useState } from 'react'
import { movimientoReducido } from './petalos'

const VERT = `attribute vec2 p; varying vec2 vUv; void main(){ vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`
const FRAG = `precision highp float;
varying vec2 vUv;
uniform sampler2D uA, uB;
uniform vec2 uRes, uTamA, uTamB, uRaton;
uniform float uMezcla, uZoomA, uZoomB, uTiempo;

// Ruido fractal para el borde de la mancha.
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float r(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a * r(p); p *= 2.03; a *= 0.5; } return v; }

// Encaja la foto como object-fit: cover, con zoom lento y paralaje del ratón.
vec2 cubre(vec2 uv, vec2 tam, float zoom){
  float rp = uRes.x / uRes.y, ri = tam.x / tam.y;
  vec2 esc = rp > ri ? vec2(1.0, ri / rp) : vec2(rp / ri, 1.0);
  return (uv - 0.5) * esc / zoom + 0.5 + uRaton * 0.012;
}

void main(){
  vec4 a = texture2D(uA, cubre(vUv, uTamA, uZoomA));
  vec4 b = texture2D(uB, cubre(vUv, uTamB, uZoomB));
  // La mancha nace en un punto y se extiende con borde irregular.
  vec2 q = vUv * vec2(uRes.x / uRes.y, 1.0);
  float n = fbm(q * 2.6 + uTiempo * 0.04) * 0.55 + distance(vUv, vec2(0.62, 0.42)) * 0.75;
  float frente = uMezcla * 1.35;
  float m = smoothstep(frente - 0.04, frente, n);
  vec3 c = mix(b.rgb, a.rgb, m);
  // Borde de la tinta: oscuro y con un punto de bermellón, como pincel cargado.
  float borde = 1.0 - smoothstep(0.0, 0.05, abs(n - frente));
  borde *= step(0.001, uMezcla) * step(uMezcla, 0.999);
  c = mix(c, vec3(0.09, 0.08, 0.07), borde * 0.85);
  c += vec3(0.35, 0.06, 0.02) * borde * smoothstep(0.6, 1.0, fbm(q * 9.0)) ;
  gl_FragColor = vec4(c, 1.0);
}`

/** Según lo que mide el lienzo en píxeles reales: la portada es ahora un panel
 *  de media pantalla y en móvil la de 900 px basta. Cargar de más costaba
 *  tirones de 150-280 ms al subir la textura. */
function urlFoto(jpg: string, anchoPx: number) {
  const base = jpg.replace(/\.jpg$/, '')
  return anchoPx > 1900 ? `${base}-4k.webp` : anchoPx > 1000 ? `${base}.webp` : `${base}-900.webp`
}

/** Descarga y decodifica fuera del hilo principal (createImageBitmap), ya
 *  reducida al ancho del lienzo y volteada para WebGL: subirla luego es casi gratis. */
async function cargaImagen(src: string, anchoPx: number): Promise<ImageBitmap | HTMLImageElement> {
  const blob = await fetch(src).then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
  if ('createImageBitmap' in window) {
    const bruto = await createImageBitmap(blob)
    const ancho = Math.min(bruto.width, Math.max(640, Math.round(anchoPx * 1.1)))
    if (ancho >= bruto.width) { bruto.close(); return createImageBitmap(blob, { imageOrientation: 'flipY' }) }
    const alto = Math.round(bruto.height * ancho / bruto.width); bruto.close()
    return createImageBitmap(blob, { resizeWidth: ancho, resizeHeight: alto, resizeQuality: 'high', imageOrientation: 'flipY' })
  }
  return new Promise<HTMLImageElement>((ok, mal) => {
    const i = new Image(); i.onload = () => i.decode().then(() => ok(i), () => ok(i)); i.onerror = mal; i.src = URL.createObjectURL(blob)
  })
}

export function HeroTinta({ fotos }: { fotos: string[] }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [activo, setActivo] = useState(false)

  useEffect(() => {
    const c = ref.current
    if (!c || movimientoReducido() || fotos.length < 2) return
    const gl = c.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' })
    if (!gl) return
    let vivo = true, raf = 0, visible = true

    const sh = (tipo: number, src: string) => { const s = gl.createShader(tipo)!; gl.shaderSource(s, src); gl.compileShader(s); return s }
    const prog = gl.createProgram()!
    const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG)
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      // Sin efecto no pasa nada grave (queda la foto fija), pero que se vea por qué.
      console.error('[HeroTinta] shader:', gl.getShaderInfoLog(vs), gl.getShaderInfoLog(fs), gl.getProgramInfoLog(prog), gl.isContextLost())
      return
    }
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const u = (n: string) => gl.getUniformLocation(prog, n)
    const U = { A: u('uA'), B: u('uB'), res: u('uRes'), tamA: u('uTamA'), tamB: u('uTamB'), raton: u('uRaton'), mezcla: u('uMezcla'), zA: u('uZoomA'), zB: u('uZoomB'), t: u('uTiempo') }
    gl.uniform1i(U.A, 0)
    gl.uniform1i(U.B, 1)

    const texturas: { tex: WebGLTexture; w: number; h: number }[] = []
    const sube = (img: ImageBitmap | HTMLImageElement) => {
      const tex = gl.createTexture()!
      gl.bindTexture(gl.TEXTURE_2D, tex)
      // WebGL lee las imágenes de abajo arriba: el ImageBitmap ya viene volteado;
      // la <img> de respaldo se voltea aquí.
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !(img instanceof ImageBitmap))
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      const w = img instanceof ImageBitmap ? img.width : img.naturalWidth, h = img instanceof ImageBitmap ? img.height : img.naturalHeight
      if (img instanceof ImageBitmap) img.close()
      return { tex, w, h }
    }

    const tam = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      c.width = Math.round(c.clientWidth * dpr); c.height = Math.round(c.clientHeight * dpr)
      gl.viewport(0, 0, c.width, c.height)
    }
    const ro = new ResizeObserver(tam)
    ro.observe(c)
    tam()

    const raton = { x: 0, y: 0, ox: 0, oy: 0 }
    const alMover = (e: PointerEvent) => {
      raton.ox = (e.clientX / window.innerWidth - 0.5) * 2
      raton.oy = (e.clientY / window.innerHeight - 0.5) * -2
    }
    window.addEventListener('pointermove', alMover, { passive: true })

    const QUIETO = 6500, CAMBIO = 1900
    let actual = 0, inicio = 0
    // El lienzo es opaco (alpha: false): si se enseña antes de pintar, se ve NEGRO
    // (pestaña en segundo plano, o se entra con #ancla más abajo). Se muestra tras
    // el primer dibujo; hasta entonces queda la <img> de debajo.
    let pintado = false
    const cuadro = (t: number) => {
      raf = 0
      if (!vivo) return
      if (!inicio) inicio = t
      const n = texturas.length
      const ciclo = QUIETO + CAMBIO
      let e = t - inicio
      // Si aún no ha llegado la siguiente foto, se queda quieto en la actual.
      if (n < 2) e = Math.min(e, QUIETO - 1)
      actual = Math.floor(e / ciclo) % Math.max(n, 1)
      const dentro = e % ciclo
      const mezcla = dentro < QUIETO ? 0 : (dentro - QUIETO) / CAMBIO
      const A = texturas[actual], B = texturas[(actual + 1) % Math.max(n, 1)]
      if (A && B) {
        raton.x += (raton.ox - raton.x) * 0.04
        raton.y += (raton.oy - raton.y) * 0.04
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, A.tex)
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, B.tex)
        gl.uniform2f(U.res, c.width, c.height)
        gl.uniform2f(U.tamA, A.w, A.h)
        gl.uniform2f(U.tamB, B.w, B.h)
        gl.uniform2f(U.raton, raton.x, raton.y)
        gl.uniform1f(U.mezcla, mezcla * mezcla * (3 - 2 * mezcla))
        // Zoom lento continuo: la foto saliente sigue acercándose mientras se va.
        gl.uniform1f(U.zA, 1.04 + (dentro / ciclo) * 0.08)
        gl.uniform1f(U.zB, 1.04 + Math.max(0, dentro - QUIETO) / ciclo * 0.08)
        gl.uniform1f(U.t, t / 1000)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        if (!pintado) { pintado = true; setActivo(true) }
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(cuadro)
    }
    const sigue = () => { if (!raf && visible && !document.hidden && vivo) raf = requestAnimationFrame(cuadro) }
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; sigue() })
    io.observe(c)
    document.addEventListener('visibilitychange', sigue)

    // Arranca cuando el navegador está libre, para no competir con la carga.
    const empieza = async () => {
      for (const f of fotos) {
        if (!vivo) return
        try {
          const anchoPx = c.clientWidth * Math.min(window.devicePixelRatio || 1, 2)
          texturas.push(sube(await cargaImagen(urlFoto(f, anchoPx), anchoPx)))
          if (texturas.length === 1) sigue()
        } catch (err) { console.error('[HeroTinta] no carga', f, err) }
      }
    }
    const ric = (window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number }).requestIdleCallback
    const id = ric ? ric(empieza, { timeout: 2500 }) : window.setTimeout(empieza, 1200)
    const cancela = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback

    return () => {
      vivo = false
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect()
      if (ric) cancela?.(id); else clearTimeout(id)
      window.removeEventListener('pointermove', alMover)
      document.removeEventListener('visibilitychange', sigue)
      // No se pierde el contexto a propósito: React (en desarrollo) vuelve a
      // montar el mismo lienzo y recibiría un contexto muerto.
      texturas.forEach((x) => gl.deleteTexture(x.tex))
      gl.deleteProgram(prog); gl.deleteBuffer(buf)
    }
  }, [fotos])

  return <canvas ref={ref} className={`v7-hero-tinta ${activo ? 'activo' : ''}`} aria-hidden="true" />
}
