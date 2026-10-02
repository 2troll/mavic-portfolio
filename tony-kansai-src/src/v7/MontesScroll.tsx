// Las montañas que se transforman con el scroll.
//
// Una escena fija (sticky) y un relieve de 256×256 vértices. Cada capítulo es
// una montaña real (elevación y foto aérea del 国土地理院, horneadas con
// scripts/hornear-montes.py). Al bajar, el relieve se disuelve en partículas
// que suben como bruma y se recompone en la montaña siguiente: las alturas se
// interpolan vértice a vértice y las dos fotos se funden en el shader.

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import * as THREE from 'three'
import type { MonteId } from './datosMontana'
import { movimientoReducido } from './petalos'
import { suena } from './sonido'

interface Meta { min: number; max: number; punto: [number, number]; lado: number }
interface Monte { alturas: Float32Array; foto: THREE.Texture; punto: [number, number] }

const N = 256            // vértices por lado (el DEM horneado es 768 px: uno de cada 3)
const LADO = 10          // lado del relieve en unidades de escena
const EXAGERA = 1.7      // exageración vertical: a escala real, un monte de 1.000 m en 6 km se ve plano

async function cargaMonte(id: MonteId, meta: Meta): Promise<Monte> {
  const [dem, foto] = await Promise.all([
    fetch(`/v7/montes/${id}-dem.png`).then((r) => r.blob()).then((b) => createImageBitmap(b, { colorSpaceConversion: 'none', premultiplyAlpha: 'none' })),
    new THREE.TextureLoader().loadAsync(`/v7/montes/${id}-foto.webp`),
  ])
  const c = document.createElement('canvas')
  c.width = dem.width; c.height = dem.height
  const g = c.getContext('2d', { willReadFrequently: true })!
  g.drawImage(dem, 0, 0)
  const px = g.getImageData(0, 0, c.width, c.height).data
  const paso = c.width / N
  const escala = (LADO / meta.lado) * EXAGERA
  const alturas = new Float32Array(N * N)
  for (let fila = 0; fila < N; fila++) {
    for (let col = 0; col < N; col++) {
      const i = (Math.floor(fila * paso + paso / 2) * c.width + Math.floor(col * paso + paso / 2)) * 4
      const x = px[i] * 65536 + px[i + 1] * 256 + px[i + 2]
      // Codificación del dem_png del GSI: 2^23 = sin dato (mar).
      const m = x === 8388608 ? meta.min : (x > 8388608 ? x - 16777216 : x) * 0.01
      alturas[fila * N + col] = (m - meta.min) * escala
    }
  }
  foto.colorSpace = THREE.NoColorSpace
  foto.anisotropy = 8
  return { alturas, foto, punto: meta.punto }
}

interface Props {
  montes: readonly MonteId[]
  nombres: Record<MonteId, string>
  /** Lo que se lee en cada capítulo: 0 es la portada, 1…N las montañas. */
  capitulo: (i: number) => ReactNode
  etiquetaAria: string
}

export function MontesScroll({ montes, nombres, capitulo, etiquetaAria }: Props) {
  const seccion = useRef<HTMLElement>(null)
  const lienzo = useRef<HTMLDivElement>(null)
  const etiqueta = useRef<HTMLSpanElement>(null)
  const progreso = useRef(0)
  const [cap, setCap] = useState(0)
  const [listo, setListo] = useState(false)
  const capitulos = montes.length + 1

  // Scroll → progreso 0 … capitulos-1.
  // Un fūrin en cada cambio (si el visitante encendió el sonido).
  const inicio = useRef(true)
  useEffect(() => {
    if (inicio.current) { inicio.current = false; return }
    suena('furin')
  }, [cap])

  useEffect(() => {
    const el = seccion.current
    if (!el) return
    let raf = 0
    const medir = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const recorrido = r.height - window.innerHeight
      const v = recorrido > 0 ? Math.min(1, Math.max(0, -r.top / recorrido)) : 0
      progreso.current = v * (capitulos - 1)
      setCap(Math.min(capitulos - 1, Math.round(progreso.current)))
    }
    const alScroll = () => { if (!raf) raf = requestAnimationFrame(medir) }
    medir()
    window.addEventListener('scroll', alScroll, { passive: true })
    window.addEventListener('resize', alScroll)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', alScroll); window.removeEventListener('resize', alScroll) }
  }, [capitulos])

  // La escena 3D.
  useEffect(() => {
    const caja = lienzo.current
    if (!caja) return
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) } catch { return }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.domElement.setAttribute('aria-hidden', 'true')
    caja.prepend(renderer.domElement)
    const escena = new THREE.Scene()
    const camara = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
    const reducido = movimientoReducido()

    const geo = new THREE.PlaneGeometry(LADO, LADO, N - 1, N - 1)
    geo.rotateX(-Math.PI / 2)
    const pos = geo.attributes.position as THREE.BufferAttribute
    const azar = new Float32Array(N * N)
    for (let i = 0; i < azar.length; i++) azar[i] = Math.random()
    geo.setAttribute('aAzar', new THREE.BufferAttribute(azar, 1))

    const vacia = new THREE.DataTexture(new Uint8Array([236, 230, 218, 255]), 1, 1)
    vacia.needsUpdate = true
    const uniforms = {
      uA: { value: vacia as THREE.Texture }, uB: { value: vacia as THREE.Texture },
      uMezcla: { value: 0 }, uOpacidad: { value: 1 }, uLuz: { value: new THREE.Vector3(-0.5, 0.8, 0.4).normalize() },
    }
    const relieve = new THREE.Mesh(geo, new THREE.ShaderMaterial({
      uniforms, transparent: true,
      vertexShader: `varying vec2 vUv; varying vec3 vN;
        void main(){ vUv = uv; vN = normalize(normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform sampler2D uA; uniform sampler2D uB; uniform float uMezcla; uniform float uOpacidad; uniform vec3 uLuz;
        varying vec2 vUv; varying vec3 vN;
        void main(){
          vec3 c = mix(texture2D(uA, vUv).rgb, texture2D(uB, vUv).rgb, uMezcla);
          float luz = 0.62 + 0.55 * max(dot(normalize(vN), uLuz), 0.0);
          // Bordes en bruma: el relieve flota como una isla sobre el papel.
          float borde = smoothstep(0.5, 0.33, distance(vUv, vec2(0.5)));
          gl_FragColor = vec4(c * luz, borde * uOpacidad);
        }`,
    }))
    escena.add(relieve)

    const uP = { uDisuelve: { value: 0 }, uTiempo: { value: 0 }, uTam: { value: 26 * renderer.getPixelRatio() } }
    const puntos = new THREE.Points(geo, new THREE.ShaderMaterial({
      uniforms: uP, transparent: true, depthWrite: false,
      vertexShader: `attribute float aAzar; uniform float uDisuelve; uniform float uTiempo; uniform float uTam; varying float vA; varying float vAzar;
        void main(){
          vec3 p = position;
          // Al disolverse, cada punto sube y se aparta un poco: bruma de montaña.
          p.y += uDisuelve * (0.4 + aAzar * 1.8) + sin(uTiempo * 0.8 + aAzar * 40.0) * 0.06 * uDisuelve;
          p.x += (aAzar - 0.5) * uDisuelve * 0.9;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uTam * (0.35 + aAzar) / -mv.z;
          float borde = smoothstep(${(LADO / 2).toFixed(1)}, ${(LADO * 0.33).toFixed(1)}, length(position.xz));
          vA = uDisuelve * borde * step(0.55, aAzar); vAzar = aAzar;
        }`,
      fragmentShader: `varying float vA; varying float vAzar;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          // Tinta sumi con algún punto bermellón.
          vec3 c = vAzar > 0.93 ? vec3(0.78, 0.27, 0.18) : vec3(0.16, 0.15, 0.13);
          gl_FragColor = vec4(c, vA * (1.0 - d * 2.0) * 0.8);
        }`,
    }))
    escena.add(puntos)

    // Marcador del punto de la ruta: un hilo bermellón que baja a la cima.
    const hilo = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.4, 6), new THREE.MeshBasicMaterial({ color: '#c8442d', transparent: true }))
    const gota = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), new THREE.MeshBasicMaterial({ color: '#c8442d', transparent: true }))
    escena.add(hilo, gota)

    const datos: (Monte | null)[] = montes.map(() => null)
    let mostrado = -1, actualA = -1, actualB = -1, raf = 0, vivo = true, visible = false
    let q = 0

    const alturaEn = (m: Monte, u: number, v: number) => {
      const col = Math.min(N - 1, Math.max(0, Math.round(u * (N - 1))))
      const fila = Math.min(N - 1, Math.max(0, Math.round(v * (N - 1))))
      return m.alturas[fila * N + col]
    }

    const tam = () => {
      const w = caja.clientWidth || 1, h = caja.clientHeight || 1
      renderer.setSize(w, h, false)
      camara.aspect = w / h
      camara.fov = w / h < 0.8 ? 52 : 36
      // En pantalla ancha el texto ocupa la izquierda: el relieve se pinta
      // desplazado a la derecha (sin mover la cámara, sólo el encuadre).
      if (w / h > 1.1) camara.setViewOffset(w, h, (document.dir === 'rtl' || caja.closest('[dir="rtl"]') ? 1 : -1) * w * 0.2, 0, w, h)
      else camara.clearViewOffset()
      camara.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(tam)
    ro.observe(caja)
    tam()

    const cuadro = (t: number) => {
      raf = 0
      if (!vivo) return
      const objetivo = Math.min(montes.length - 1, Math.max(0, progreso.current - 1))
      q += (objetivo - q) * (reducido ? 1 : 0.08)
      const a = Math.floor(q), b = Math.min(montes.length - 1, a + 1)
      const crudo = q - a
      // Cada tramo: quieto, transformación en el centro, quieto.
      const f = THREE.MathUtils.smoothstep(crudo, 0.18, 0.82)
      const A = datos[a], B = datos[b] ?? A
      if (A && B) {
        if (a !== actualA || b !== actualB || f !== mostrado) {
          for (let i = 0; i < N * N; i++) pos.setY(i, A.alturas[i] + (B.alturas[i] - A.alturas[i]) * f)
          pos.needsUpdate = true
          geo.computeVertexNormals()
          uniforms.uA.value = A.foto; uniforms.uB.value = B.foto
          actualA = a; actualB = b; mostrado = f
        }
        uniforms.uMezcla.value = f
        const dis = Math.sin(Math.PI * f)
        uniforms.uOpacidad.value = 1 - 0.8 * dis
        uP.uDisuelve.value = dis
        uP.uTiempo.value = t / 1000

        // Cámara: gira despacio alrededor del punto de la ruta.
        const pu = A.punto[0] + (B.punto[0] - A.punto[0]) * f
        const pv = A.punto[1] + (B.punto[1] - A.punto[1]) * f
        const x = (pu - 0.5) * LADO, z = (pv - 0.5) * LADO
        const y = alturaEn(A, A.punto[0], A.punto[1]) * (1 - f) + alturaEn(B, B.punto[0], B.punto[1]) * f
        const ang = 0.6 + q * 0.7 + (reducido ? 0 : t / 1000 * 0.035)
        const objetivoCam = new THREE.Vector3(x * 0.35, y * 0.45, z * 0.35)
        camara.position.set(objetivoCam.x + Math.sin(ang) * 11.5, objetivoCam.y + 6.4, objetivoCam.z + Math.cos(ang) * 11.5)
        camara.lookAt(objetivoCam)
        hilo.position.set(x, y + 0.7 + 0.05, z)
        gota.position.set(x, y + 0.05, z)
        ;(hilo.material as THREE.MeshBasicMaterial).opacity = 1 - dis
        ;(gota.material as THREE.MeshBasicMaterial).opacity = 1 - dis

        // Etiqueta HTML sobre la cima.
        if (etiqueta.current) {
          const v = new THREE.Vector3(x, y + 1.45, z).project(camara)
          etiqueta.current.style.transform = `translate(${((v.x + 1) / 2) * caja.clientWidth}px, ${((1 - v.y) / 2) * caja.clientHeight}px)`
          etiqueta.current.style.opacity = String(1 - dis)
          const nombre = nombres[montes[f < 0.5 ? a : b]]
          if (etiqueta.current.textContent !== nombre) etiqueta.current.textContent = nombre
        }
      }
      renderer.render(escena, camara)
      if (visible && !document.hidden) raf = requestAnimationFrame(cuadro)
    }
    const sigue = () => { if (!raf && visible && !document.hidden && vivo) raf = requestAnimationFrame(cuadro) }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sigue() })
    io.observe(caja)
    document.addEventListener('visibilitychange', sigue)

    // Carga: la primera montaña cuanto antes; el resto, en orden, detrás.
    fetch('/v7/montes/montes.json').then((r) => r.json()).then(async (meta: Record<MonteId, Meta>) => {
      for (let i = 0; i < montes.length && vivo; i++) {
        try {
          datos[i] = await cargaMonte(montes[i], meta[montes[i]])
          if (i === 0) setListo(true)
          actualA = -1
          sigue()
        } catch { /* una montaña que no carga se salta: se queda la anterior */ }
      }
    }).catch(() => { /* sin datos, la página se lee igual: el texto no depende del 3D */ })

    return () => {
      vivo = false
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect()
      document.removeEventListener('visibilitychange', sigue)
      datos.forEach((d) => d?.foto.dispose())
      geo.dispose(); renderer.dispose(); renderer.domElement.remove()
    }
  }, [montes, nombres])

  return (
    <section ref={seccion} className="v7-montes" style={{ height: `${capitulos * 100}vh` }} aria-label={etiquetaAria}>
      <div className="v7-montes-fijo">
        <div ref={lienzo} className={`v7-montes-lienzo ${listo ? 'listo' : ''}`}>
          <span ref={etiqueta} className="v7-montes-etiqueta" aria-hidden="true" />
        </div>
        <div className="v7-montes-texto">
          {Array.from({ length: capitulos }, (_, i) => (
            <div key={i} className={`v7-montes-cap ${i === cap ? 'activo' : ''}`} aria-hidden={i !== cap}>
              {capitulo(i)}
            </div>
          ))}
        </div>
        <ol className="v7-montes-indice" aria-hidden="true">
          {Array.from({ length: capitulos }, (_, i) => <li key={i} className={i === cap ? 'activo' : ''} />)}
        </ol>
      </div>
    </section>
  )
}
