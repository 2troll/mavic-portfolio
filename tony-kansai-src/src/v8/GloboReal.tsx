// Globo terráqueo realista que vuela hasta Kansai (sustituye al sumi-e de v7).
//
// Misma receta que el globo del estudio del Golfo: Blue Marble de día, Black
// Marble de noche con el sol de este momento, nubes reales de ayer (NASA VIIRS
// vía GIBS) en una esfera aparte que deriva despacio, reflejo del sol en el mar
// y halo de atmósfera. Lienzo transparente: se posa sobre el gris claro de la
// página sin cuadro negro detrás.
//
// Las props son las mismas que src/v7/Globo.tsx: es un recambio directo.

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type { PuntoGlobo } from '../v7/Globo'
import { VERT_MUNDO, FRAG_TIERRA, FRAG_NUBES, FRAG_HALO } from './globo-shaders'

export type { PuntoGlobo }

export const CREDITOS_GLOBO = [
  { capa: 'Tierra de día', fuente: 'NASA Visible Earth — Blue Marble: Next Generation', licencia: 'Dominio público (NASA)', url: 'https://visibleearth.nasa.gov/collection/1484/blue-marble' },
  { capa: 'Japón de cerca', fuente: 'NASA GIBS / Worldview', licencia: 'Dominio público (NASA)', url: 'https://earthdata.nasa.gov/gibs' },
  { capa: 'Luces nocturnas (globo y parche de Japón a 500 m)', fuente: 'NASA Black Marble 2016 (VIIRS_Black_Marble, NASA GIBS)', licencia: 'Dominio público (NASA)', url: 'https://earthobservatory.nasa.gov/features/NightLights' },
  { capa: 'Nubes de ayer', fuente: 'NOAA-20 VIIRS Corrected Reflectance, NASA GIBS (en vivo)', licencia: 'Dominio público (NASA/NOAA)', url: 'https://earthdata.nasa.gov/gibs' },
  { capa: 'Nubes de reserva', fuente: 'Máscara propia de 3 días de NOAA-20 VIIRS (28–30-9-2026), NASA GIBS', licencia: 'Dominio público (NASA/NOAA)', url: 'https://earthdata.nasa.gov/gibs' },
] as const

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
const ACENTO = new THREE.Color('#c8442d')
const OSAKA = { lat: 34.6937, lon: 135.5023 }
// Parche de NASA GIBS: lat 30.5–38.5, lon 129.5–141.5 (ver README de v7).
const PARCHE = { latN: 38.5, latS: 30.5, lonO: 129.5, lonE: 141.5 }
const GIBS = 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0'
  + '&CRS=EPSG:4326&BBOX=-90,-180,90,180&FORMAT=image/jpeg&LAYERS=VIIRS_NOAA20_CorrectedReflectance_TrueColor'
const R_NUBES = 1.0045
/** Deriva de la esfera de nubes, en radianes por segundo. */
const DERIVA_NUBES = 0.0025

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

/** Punto subsolar (Cooper + ecuación del tiempo): dónde es mediodía ahora mismo. */
function subsolar(d = new Date()): [number, number] {
  const dia = (d.getTime() - Date.UTC(d.getUTCFullYear(), 0, 0)) / 864e5
  const decl = -23.44 * Math.cos((2 * Math.PI / 365) * (dia + 10))
  const b = (2 * Math.PI * (dia - 81)) / 364
  const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b) // minutos
  const horas = d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600
  let lon = -15 * (horas - 12 + eot / 60)
  lon = ((lon + 540) % 360) - 180
  return [decl, lon]
}

/** Fecha UTC de hace n días (AAAA-MM-DD): la imagen VIIRS de hoy aún está a medias. */
const diaUTC = (n: number) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10)

function cargaImagen(src: string, ms = 0): Promise<HTMLImageElement> {
  return new Promise((ok, mal) => {
    const i = new Image()
    i.crossOrigin = 'anonymous'
    i.decoding = 'async'
    const reloj = ms ? window.setTimeout(() => { i.src = ''; mal(new Error(`Tarda demasiado: ${src}`)) }, ms) : 0
    i.onload = () => { clearTimeout(reloj); ok(i) }
    i.onerror = () => { clearTimeout(reloj); mal(new Error(`No carga ${src}`)) }
    i.src = src
  })
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
  return t
}

export function GloboReal({ lugares, origenes = [], inicio, final, duracion = 5200, progreso, alTerminar, etiquetaAria, className }: Props) {
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
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.setAttribute('aria-hidden', 'true')
    el.prepend(renderer.domElement)
    const movil = window.innerWidth < 900
    const anisotropia = Math.min(8, renderer.capabilities.getMaxAnisotropy())

    const escena = new THREE.Scene()
    const camara = new THREE.PerspectiveCamera(35, 1, 0.01, 50)
    const tierra = new THREE.Group()
    escena.add(tierra)

    // Uniformes compartidos: el sol y las nubes son los mismos para todas las capas.
    const vacia = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1)
    vacia.needsUpdate = true
    const comunes = {
      uSol: { value: new THREE.Vector3(1, 0, 0) },
      uNubes: { value: vacia as THREE.Texture }, uNubes2: { value: vacia as THREE.Texture },
      uReserva: { value: vacia as THREE.Texture }, uDiaG: { value: vacia as THREE.Texture },
      uModoNubes: { value: 0 }, uNubesOp: { value: 0 }, uGiroNubes: { value: 0 },
    }
    const materialTierra = (mapa: THREE.Texture, noche: THREE.Texture, caja4: [number, number, number, number], parche: boolean) =>
      new THREE.ShaderMaterial({
        transparent: parche, depthWrite: !parche,
        uniforms: { ...comunes, uDia: { value: mapa }, uNoche: { value: noche }, uCaja: { value: new THREE.Vector4(...caja4) }, uParche: { value: parche ? 1 : 0 }, uNocheLocal: { value: parche ? 1 : 0 } },
        vertexShader: VERT_MUNDO, fragmentShader: FRAG_TIERRA,
      })

    const nubes = new THREE.Mesh(
      new THREE.SphereGeometry(R_NUBES, 128, 96),
      new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: comunes, vertexShader: VERT_MUNDO, fragmentShader: FRAG_NUBES }),
    )
    nubes.renderOrder = 2
    nubes.visible = false
    escena.add(nubes)

    const uHalo = { uSol: comunes.uSol, uOp: { value: 1 } }
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(1.08, 96, 64),
      new THREE.ShaderMaterial({ side: THREE.BackSide, transparent: true, depthWrite: false, uniforms: uHalo, vertexShader: VERT_MUNDO, fragmentShader: FRAG_HALO }),
    )
    halo.renderOrder = 3
    escena.add(halo)

    // Puntos de los lugares y etiquetas HTML que los siguen.
    const etiquetas: { pos: THREE.Vector3; el: HTMLSpanElement; origen: boolean }[] = []
    const marcas: { m: THREE.Mesh; origen: boolean }[] = []
    const ponerEtiqueta = (p: PuntoGlobo, origen: boolean) => {
      const pos = punto(p.lat, p.lon, 1.002)
      const marca = new THREE.Mesh(
        new THREE.SphereGeometry(origen ? 0.006 : 0.0032, 16, 12),
        new THREE.MeshBasicMaterial({ color: origen ? new THREE.Color('#ffffff') : ACENTO }),
      )
      marca.position.copy(pos)
      // Encima de las nubes (que no escriben profundidad), tapadas sólo por la Tierra.
      marca.renderOrder = 4
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
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, 0.0018, 6, false),
        new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff8a3d'), transparent: true, opacity: 0.95, depthWrite: false }),
      )
      tubo.geometry.setDrawRange(0, 0)
      tubo.renderOrder = 4
      tierra.add(tubo)
      arcos.push(tubo)
    }

    const desde = inicio ?? { lat: 22, lon: longitudVisitante() }
    const dirInicio = punto(desde.lat, desde.lon).normalize()
    const dirFinal = punto(final.lat, final.lon).normalize()
    const giro = new THREE.Quaternion().setFromUnitVectors(dirInicio, dirFinal)
    const reducido = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    let arranque = 0
    let anterior = 0
    // Con scroll: el valor mostrado persigue al del scroll como un muelle,
    // para que la cámara no dé tirones con la rueda del ratón.
    let suavizado = progreso?.current ?? 0
    let visible = false
    let terminado = false
    let raf = 0
    let ultimoSol = -1e9
    let nubesListas = 0 // instante en que llegaron las nubes, para fundirlas
    // Arrastre con ratón (en táctil no: robaría el desplazamiento de la página).
    const desvio = { x: 0, y: 0 }
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
    const ejeY = new THREE.Vector3(0, 1, 0)
    const cuadro = (ahora: number) => {
      raf = 0
      if (!vivo) return
      if (!arranque) arranque = ahora
      const dt = anterior ? Math.min(0.1, (ahora - anterior) / 1000) : 0
      anterior = ahora
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
      dir.applyAxisAngle(ejeY, desvio.x)
      dir.applyAxisAngle(new THREE.Vector3().crossVectors(ejeY, dir).normalize(), desvio.y)
      // Un balanceo muy lento cuando ha terminado, para que no parezca una foto.
      if (!reducido) dir.applyAxisAngle(ejeY, Math.sin(ahora / 7000) * 0.012 * recorta((t - 0.9) / 0.1))

      const dist = THREE.MathUtils.lerp(3.6, final.dist, zoomT)
      camara.position.copy(dir).multiplyScalar(dist)
      camara.up.set(0, 1, 0)
      camara.lookAt(0, 0, 0)

      // El sol real; basta con recalcularlo cada pocos segundos.
      if (ahora - ultimoSol > 5000) {
        ultimoSol = ahora
        const [la, lo] = subsolar()
        comunes.uSol.value.copy(punto(la, lo)).normalize()
      }

      // Nubes: derivan despacio y se apartan al acercarse (de cerca serían un borrón).
      if (!reducido) comunes.uGiroNubes.value += dt * DERIVA_NUBES
      nubes.rotation.y = comunes.uGiroNubes.value
      const entrada = nubesListas ? (reducido ? 1 : recorta((ahora - nubesListas) / 1200)) : 0
      comunes.uNubesOp.value = entrada * (1 - recorta((zoomT - 0.35) / 0.5))
      nubes.visible = comunes.uNubesOp.value > 0.01
      uHalo.uOp.value = 1 - 0.5 * zoomT

      arcos.forEach((a) => {
        a.geometry.setDrawRange(0, Math.floor(recorta((t - 0.15) / 0.6) * (a.geometry.index?.count ?? 0)))
        // De cerca el tubo sería una franja enorme: cuenta el viaje y se va.
        const op = 0.95 * (1 - recorta((zoomT - 0.2) / 0.3))
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
      // Mientras las nubes derivan o el balanceo sigue, el bucle continúa; fuera de pantalla o en otra pestaña, no.
      if (visible && !document.hidden) raf = requestAnimationFrame(cuadro)
    }
    const seguir = () => {
      if (!raf && visible && !document.hidden && vivo) { anterior = 0; raf = requestAnimationFrame(cuadro) }
    }

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

    const texturas: THREE.Texture[] = [vacia]
    const textura = (img: HTMLImageElement, color: boolean) => {
      const t = new THREE.Texture(img)
      // Las máscaras y las fotos VIIRS se leen tal cual (los umbrales están en sRGB).
      t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace
      t.anisotropy = anisotropia
      t.needsUpdate = true
      texturas.push(t)
      return t
    }

    // Nubes reales de ayer y anteayer (anteayer rellena los huecos entre
    // pasadas). Si NASA no responde, la máscara empaquetada.
    const cargaNubes = () => {
      const lado = movil ? '&WIDTH=1024&HEIGHT=512' : '&WIDTH=2048&HEIGHT=1024'
      Promise.all([cargaImagen(`${GIBS}${lado}&TIME=${diaUTC(1)}`, 12000), cargaImagen(`${GIBS}${lado}&TIME=${diaUTC(2)}`, 12000)])
        .then(([a, b]) => {
          if (!vivo) return
          comunes.uNubes.value = textura(a, false)
          comunes.uNubes2.value = textura(b, false)
          comunes.uModoNubes.value = 1
          nubesListas = performance.now()
        })
        .catch(() => cargaImagen('/v8/tierra/nubes-2k.webp').then((img) => {
          if (!vivo) return
          comunes.uReserva.value = textura(img, false)
          comunes.uModoNubes.value = 2
          nubesListas = performance.now()
        }))
        .catch(() => { /* sin nubes: el globo sigue siendo válido */ })
    }

    // Las texturas no se piden hasta que el globo está cerca de verse.
    const cerca = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      cerca.disconnect()
      cargaTexturas()
    }, { rootMargin: '100% 0px' })
    cerca.observe(el)
    const cargaTexturas = () => Promise.all([
      cargaImagen(movil ? '/v7/tierra-2k.jpg' : '/v7/tierra.jpg'),
      cargaImagen(movil ? '/v8/tierra/noche-2k.jpg' : '/v8/tierra/noche-4k.jpg'),
      cargaImagen('/v7/japon.jpg'),
      cargaImagen(movil ? '/v8/tierra/noche-japon-m.jpg' : '/v8/tierra/noche-japon.jpg'),
    ])
      .then(([imgDia, imgNoche, imgJapon, imgNocheJapon]) => {
        if (!vivo) return
        const tDia = textura(imgDia, true)
        const tNoche = textura(imgNoche, true)
        const tJapon = texturaParche(imgJapon)
        tJapon.anisotropy = anisotropia
        texturas.push(tJapon)
        const tNocheJapon = textura(imgNocheJapon, true)
        comunes.uDiaG.value = tDia
        const mundo = new THREE.Mesh(new THREE.SphereGeometry(1, 160, 120), materialTierra(tDia, tNoche, [-180, 180, -90, 90], false))
        mundo.renderOrder = 0
        tierra.add(mundo)
        const parche = new THREE.Mesh(
          new THREE.SphereGeometry(1.0006, 96, 64,
            (PARCHE.lonO + 180) * GRADO, (PARCHE.lonE - PARCHE.lonO) * GRADO,
            (90 - PARCHE.latN) * GRADO, (PARCHE.latN - PARCHE.latS) * GRADO),
          materialTierra(tJapon, tNocheJapon, [PARCHE.lonO, PARCHE.lonE, PARCHE.latS, PARCHE.latN], true),
        )
        parche.renderOrder = 1
        tierra.add(parche)
        setEstado('listo')
        io.observe(el)
        cargaNubes()
      })
      .catch(() => { if (vivo) setEstado('fallo') })

    return () => {
      vivo = false
      cancelAnimationFrame(raf)
      io.disconnect(); ro.disconnect(); cerca.disconnect()
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
