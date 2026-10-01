// Globo terráqueo que gira y vuela hasta Kansai.
//
// Texturas: NASA Blue Marble (dominio público). La Tierra entera va a 4K y,
// encima, un parche de Japón occidental a 200 px por grado sacado de NASA GIBS
// (public/v7/japon.jpg), para que al acercarse no se vea borroso.
//
// three.js a pelo, sin react-three-fiber: es una escena pequeña y así no
// arrastra otra capa de dependencias.

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export interface PuntoGlobo { nombre: string; lat: number; lon: number; pos?: 'izq' | 'abajo' | 'arriba' }

interface Props {
  lugares: PuntoGlobo[]
  /** Ciudades de origen del público: se dibuja un arco de cada una a Osaka. */
  origenes?: PuntoGlobo[]
  /** Dónde mira la cámara al empezar. Por defecto, la longitud del visitante. */
  inicio?: { lat: number; lon: number }
  final: { lat: number; lon: number; dist: number }
  duracion?: number
  /** Si se pasa, el vuelo lo manda el scroll (0–1) y no el reloj. */
  progreso?: { current: number }
  alTerminar?: () => void
  etiquetaAria: string
  className?: string
}

const GRADO = Math.PI / 180
const ACENTO = new THREE.Color('#ff5a47')
const OSAKA = { lat: 34.6937, lon: 135.5023 }
// Parche de NASA GIBS: lat 30.5–38.5, lon 129.5–141.5 (ver README de v7).
const PARCHE = { latN: 38.5, latS: 30.5, lonO: 129.5, lonE: 141.5 }

/** Misma convención que SphereGeometry de three.js con un equirectangular. */
function punto(lat: number, lon: number, r = 1): THREE.Vector3 {
  const phi = (lon + 180) * GRADO
  const theta = (90 - lat) * GRADO
  return new THREE.Vector3(-r * Math.cos(phi) * Math.sin(theta), r * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta))
}

const suave = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const recorta = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))

/** Longitud aproximada del visitante a partir de su huso horario. */
function longitudVisitante(): number {
  try { return recorta((-new Date().getTimezoneOffset() / 60) * 15, -170, 170) } catch { return 0 }
}

/** El parche de Japón con los bordes fundidos, para que no se note la costura. */
function texturaParche(img: HTMLImageElement): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = img.naturalWidth; c.height = img.naturalHeight
  const g = c.getContext('2d')!
  g.drawImage(img, 0, 0)
  g.globalCompositeOperation = 'destination-in'
  const borde = Math.round(c.width * 0.08)
  const h = g.createLinearGradient(0, 0, c.width, 0)
  h.addColorStop(0, 'rgba(0,0,0,0)'); h.addColorStop(borde / c.width, 'rgba(0,0,0,1)')
  h.addColorStop(1 - borde / c.width, 'rgba(0,0,0,1)'); h.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = h; g.fillRect(0, 0, c.width, c.height)
  const v = g.createLinearGradient(0, 0, 0, c.height)
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(borde / c.height, 'rgba(0,0,0,1)')
  v.addColorStop(1 - borde / c.height, 'rgba(0,0,0,1)'); v.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = v; g.fillRect(0, 0, c.width, c.height)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

function cargaImagen(src: string): Promise<HTMLImageElement> {
  return new Promise((ok, mal) => {
    const i = new Image()
    i.decoding = 'async'
    i.onload = () => ok(i)
    i.onerror = () => mal(new Error(`No carga ${src}`))
    i.src = src
  })
}

export function Globo({ lugares, origenes = [], inicio, final, duracion = 5200, progreso, alTerminar, etiquetaAria, className }: Props) {
  const caja = useRef<HTMLDivElement>(null)
  const capaEtiquetas = useRef<HTMLDivElement>(null)
  const [estado, setEstado] = useState<'cargando' | 'listo' | 'fallo'>('cargando')
  const terminar = useRef(alTerminar)
  terminar.current = alTerminar

  useEffect(() => {
    const el = caja.current
    const capa = capaEtiquetas.current
    if (!el || !capa) return
    let vivo = true
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      setEstado('fallo')
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.setAttribute('aria-hidden', 'true')
    el.prepend(renderer.domElement)

    const escena = new THREE.Scene()
    const camara = new THREE.PerspectiveCamera(35, 1, 0.01, 50)
    const tierra = new THREE.Group()
    escena.add(tierra)
    escena.add(new THREE.AmbientLight(0xffffff, 1.1))
    const sol = new THREE.DirectionalLight(0xffffff, 1.6)
    escena.add(sol)

    // Atmósfera: un halo azul que sólo brilla en el borde (Fresnel).
    const atmosfera = new THREE.Mesh(
      new THREE.SphereGeometry(1.08, 64, 48),
      new THREE.ShaderMaterial({
        side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        vertexShader: 'varying vec3 n; void main(){ n = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
        fragmentShader: 'varying vec3 n; void main(){ float i = pow(0.72 - dot(n, vec3(0.0,0.0,1.0)), 3.0); gl_FragColor = vec4(0.36,0.62,1.0,1.0)*i; }',
      }),
    )
    escena.add(atmosfera)

    // Puntos de los lugares y etiquetas HTML que los siguen.
    const etiquetas: { pos: THREE.Vector3; el: HTMLSpanElement; origen: boolean }[] = []
    const marcas: { m: THREE.Mesh; origen: boolean }[] = []
    const ponerEtiqueta = (p: PuntoGlobo, origen: boolean) => {
      const pos = punto(p.lat, p.lon, 1.002)
      const marca = new THREE.Mesh(
        new THREE.SphereGeometry(origen ? 0.006 : 0.0032, 16, 12),
        new THREE.MeshBasicMaterial({ color: origen ? 0xffffff : ACENTO }),
      )
      marca.position.copy(pos)
      tierra.add(marca)
      marcas.push({ m: marca, origen })
      const span = document.createElement('span')
      span.className = 'v7-globo-etiqueta' + (origen ? ' es-origen' : '') + (p.pos ? ` ${p.pos}` : '')
      span.textContent = p.nombre
      capa.appendChild(span)
      etiquetas.push({ pos, el: span, origen })
    }
    lugares.forEach((p) => ponerEtiqueta(p, false))
    origenes.forEach((p) => ponerEtiqueta(p, true))

    // Arcos de cada origen hasta Osaka, que se dibujan durante el vuelo.
    const arcos: THREE.Mesh[] = []
    for (const o of origenes) {
      const a = punto(o.lat, o.lon).normalize()
      const b = punto(OSAKA.lat, OSAKA.lon).normalize()
      const angulo = a.angleTo(b)
      const q = new THREE.Quaternion().setFromUnitVectors(a, b)
      const pts: THREE.Vector3[] = []
      for (let i = 0; i <= 96; i++) {
        const t = i / 96
        // slerp de verdad: lerp+normalize cambia de velocidad en arcos largos
        const v = a.clone().applyQuaternion(new THREE.Quaternion().slerp(q, t))
        pts.push(v.multiplyScalar(1 + Math.sin(Math.PI * t) * (0.04 + angulo * 0.09)))
      }
      const tubo = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, 0.0016, 6, false),
        new THREE.MeshBasicMaterial({ color: ACENTO, transparent: true, opacity: 0.9, depthWrite: false }),
      )
      tubo.geometry.setDrawRange(0, 0)
      tierra.add(tubo)
      arcos.push(tubo)
    }

    const desde = inicio ?? { lat: 22, lon: longitudVisitante() }
    const dirInicio = punto(desde.lat, desde.lon).normalize()
    const dirFinal = punto(final.lat, final.lon).normalize()
    const giro = new THREE.Quaternion().setFromUnitVectors(dirInicio, dirFinal)
    const reducido = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    let arranque = 0
    // Con scroll: el valor mostrado persigue al del scroll como un muelle,
    // para que la cámara no dé tirones con la rueda del ratón.
    let suavizado = progreso?.current ?? 0
    let visible = false
    let terminado = false
    let raf = 0
    // Arrastre con ratón (en táctil no: robaría el desplazamiento de la página).
    const desvio = { x: 0, y: 0, vx: 0, vy: 0 }
    let arrastrando: { x: number; y: number } | null = null

    const tam = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1
      renderer.setSize(w, h, false)
      camara.aspect = w / h
      // En vertical, alejar un poco para que quepa la zona.
      camara.fov = w / h < 0.8 ? 48 : 35
      camara.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(tam)
    ro.observe(el)
    tam()

    const v = new THREE.Vector3()
    const cuadro = (ahora: number) => {
      raf = 0
      if (!vivo) return
      if (!arranque) arranque = ahora
      let t: number
      if (progreso) {
        suavizado += (recorta(progreso.current) - suavizado) * (reducido ? 1 : 0.09)
        t = suavizado
      } else {
        t = reducido ? 1 : recorta((ahora - arranque) / duracion)
      }
      const giroT = suave(recorta(t / 0.85))
      const zoomT = suave(recorta((t - 0.3) / 0.7))

      const dir = dirInicio.clone().applyQuaternion(new THREE.Quaternion().slerp(giro, giroT))
      // Desvío del arrastre: gira la dirección alrededor de los ejes de la cámara.
      if (!arrastrando) { desvio.x *= 0.94; desvio.y *= 0.94 }
      const eje = new THREE.Vector3(0, 1, 0)
      dir.applyAxisAngle(eje, desvio.x)
      dir.applyAxisAngle(new THREE.Vector3().crossVectors(eje, dir).normalize(), desvio.y)
      // Un balanceo muy lento cuando ha terminado, para que no parezca una foto.
      if (!reducido) dir.applyAxisAngle(eje, Math.sin(ahora / 7000) * 0.012 * recorta((t - 0.9) / 0.1))

      const dist = THREE.MathUtils.lerp(3.6, final.dist, zoomT)
      camara.position.copy(dir).multiplyScalar(dist)
      camara.up.set(0, 1, 0)
      camara.lookAt(0, 0, 0)
      sol.position.copy(camara.position).add(new THREE.Vector3(-1.5, 1.2, 0))

      arcos.forEach((a) => {
        a.geometry.setDrawRange(0, Math.floor(recorta((t - 0.15) / 0.6) * (a.geometry.index?.count ?? 0)))
        // De cerca el tubo sería una franja enorme: cuenta el viaje y se va.
        const op = 0.9 * (1 - recorta((zoomT - 0.2) / 0.3))
        ;(a.material as THREE.MeshBasicMaterial).opacity = op
        a.visible = op > 0.01
      })
      // Los puntos miden lo mismo en pantalla a cualquier distancia.
      for (const { m, origen } of marcas) m.scale.setScalar((dist - 1) * (origen ? 0.9 : 1.6))

      renderer.render(escena, camara)

      // Etiquetas: se proyectan a pantalla y se esconden por detrás del globo.
      const w = el.clientWidth, h = el.clientHeight
      const haciaCamara = camara.position.clone().normalize()
      for (const e of etiquetas) {
        const cara = e.pos.clone().normalize().dot(haciaCamara)
        v.copy(e.pos).project(camara)
        const aparece = e.origen ? recorta((t - 0.05) / 0.2) * (1 - recorta((t - 0.55) / 0.2)) : recorta((t - 0.7) / 0.25)
        const op = cara > 0.2 ? aparece : 0
        e.el.style.opacity = op.toFixed(2)
        e.el.style.transform = `translate(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * h}px)`
      }

      if (t >= 0.98 && !terminado) { terminado = true; terminar.current?.() }
      if (visible && !document.hidden) raf = requestAnimationFrame(cuadro)
    }
    const seguir = () => { if (!raf && visible && !document.hidden && vivo) raf = requestAnimationFrame(cuadro) }

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; seguir() }, { threshold: 0.15 })
    const alCambiarPestana = () => {
      // Al volver a la pestaña, que el vuelo no salte al final de golpe.
      if (!document.hidden && arranque && !terminado) arranque = performance.now() - duracion * 0.3
      seguir()
    }
    document.addEventListener('visibilitychange', alCambiarPestana)

    const abajo = (e: PointerEvent) => { if (e.pointerType === 'mouse') { arrastrando = { x: e.clientX, y: e.clientY }; el.classList.add('arrastrando') } }
    const mueve = (e: PointerEvent) => {
      if (!arrastrando) return
      desvio.x = recorta(desvio.x - (e.clientX - arrastrando.x) * 0.0025, -0.6, 0.6)
      desvio.y = recorta(desvio.y + (e.clientY - arrastrando.y) * 0.0025, -0.4, 0.4)
      arrastrando = { x: e.clientX, y: e.clientY }
    }
    const arriba = () => { arrastrando = null; el.classList.remove('arrastrando') }
    el.addEventListener('pointerdown', abajo)
    window.addEventListener('pointermove', mueve)
    window.addEventListener('pointerup', arriba)

    const texturas: THREE.Texture[] = []
    Promise.all([cargaImagen('/v7/tierra.jpg'), cargaImagen('/v7/japon.jpg')])
      .then(([imgTierra, imgJapon]) => {
        if (!vivo) return
        const tx = new THREE.Texture(imgTierra)
        tx.colorSpace = THREE.SRGBColorSpace
        tx.anisotropy = 8
        tx.needsUpdate = true
        const tp = texturaParche(imgJapon)
        texturas.push(tx, tp)
        tierra.add(new THREE.Mesh(
          new THREE.SphereGeometry(1, 128, 96),
          new THREE.MeshPhongMaterial({ map: tx, shininess: 6, specular: new THREE.Color(0x1a2633) }),
        ))
        tierra.add(new THREE.Mesh(
          new THREE.SphereGeometry(1.0006, 96, 64,
            (PARCHE.lonO + 180) * GRADO, (PARCHE.lonE - PARCHE.lonO) * GRADO,
            (90 - PARCHE.latN) * GRADO, (PARCHE.latN - PARCHE.latS) * GRADO),
          new THREE.MeshPhongMaterial({ map: tp, transparent: true, shininess: 6, depthWrite: false }),
        ))
        setEstado('listo')
        io.observe(el)
      })
      .catch(() => { if (vivo) setEstado('fallo') })

    return () => {
      vivo = false
      cancelAnimationFrame(raf)
      io.disconnect(); ro.disconnect()
      document.removeEventListener('visibilitychange', alCambiarPestana)
      el.removeEventListener('pointerdown', abajo)
      window.removeEventListener('pointermove', mueve)
      window.removeEventListener('pointerup', arriba)
      escena.traverse((o) => {
        const m = o as THREE.Mesh
        m.geometry?.dispose()
        const mat = m.material as THREE.Material | undefined
        mat?.dispose?.()
      })
      texturas.forEach((t) => t.dispose())
      renderer.dispose()
      renderer.domElement.remove()
      capa.replaceChildren()
    }
    // El globo se monta una vez por página: los props no cambian en vida.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={caja} className={`v7-globo ${estado === 'listo' ? 'listo' : ''} ${className ?? ''}`} role="img" aria-label={etiquetaAria}>
      <div ref={capaEtiquetas} className="v7-globo-etiquetas" aria-hidden="true" />
      {estado === 'fallo' && <img className="v7-globo-reserva" src="/v7/japon.jpg" alt="" />}
    </div>
  )
}
