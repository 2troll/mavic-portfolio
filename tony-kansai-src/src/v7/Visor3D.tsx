// Visor de los modelos 3D de las rutas (glTF de Poly Pizza, ver rutas.ts).
// Un solo lienzo WebGL para toda la sección: al cambiar de ruta, el modelo
// viejo se hunde y el nuevo sube girando. Arrastrar con el ratón lo gira;
// en táctil gira solo, para no robar el desplazamiento de la página.

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { MODELOS } from './datosRutas'
import type { ModeloId } from './datosRutas'
import { movimientoReducido } from './petalos'

interface Props { modelo: ModeloId; variante?: 'osaka' | 'agua'; etiqueta: string }

const cache = new Map<string, Promise<THREE.Group>>()
// Los .glb van comprimidos con meshopt (gltf-transform optimize): 2,5 MB → 180 KB.
const cargador = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
function carga(url: string) {
  if (!cache.has(url)) cache.set(url, cargador.loadAsync(url).then((g) => g.scene))
  return cache.get(url)!
}

/** Centra el modelo sobre el suelo y lo escala a una altura fija. */
function prepara(original: THREE.Group, variante?: 'osaka' | 'agua'): THREE.Group {
  const m = original.clone(true)
  m.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    mesh.castShadow = true
    // Cada clon lleva sus materiales: el retoque de Osaka no debe teñir Himeji.
    const mats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map((x) => x.clone())
    for (const mat of mats as THREE.MeshStandardMaterial[]) {
      // Osaka: los tejados del castillo son verde cobre, no grises.
      if (variante === 'osaka' && mat.name === '03___Default') mat.color.set('#5e8f7b')
      mat.envMapIntensity = 0.9
    }
    mesh.material = Array.isArray(mesh.material) ? mats : mats[0]
  })
  const caja = new THREE.Box3().setFromObject(m)
  const tam = caja.getSize(new THREE.Vector3())
  const escala = 2.2 / Math.max(tam.x, tam.y, tam.z)
  m.scale.setScalar(escala)
  const c = new THREE.Box3().setFromObject(m)
  const centro = c.getCenter(new THREE.Vector3())
  m.position.set(-centro.x, -c.min.y, -centro.z)
  const g = new THREE.Group()
  g.add(m)
  // Altura final, para que la cámara mire al centro del modelo y no al aire.
  g.userData.alto = new THREE.Box3().setFromObject(m).getSize(new THREE.Vector3()).y
  if (variante === 'agua') {
    // Miyajima: el torii «flota» sobre agua cuando sube la marea.
    m.position.y -= 0.35
    const agua = new THREE.Mesh(
      new THREE.CircleGeometry(1.9, 64),
      new THREE.MeshStandardMaterial({ color: '#2f6f8f', roughness: 0.15, metalness: 0.2, transparent: true, opacity: 0.85 }),
    )
    agua.rotation.x = -Math.PI / 2
    // Un pelo por encima del suelo de sombras: a la misma altura parpadean.
    agua.position.y = 0.01
    agua.receiveShadow = true
    g.add(agua)
  }
  return g
}

export function Visor3D({ modelo, variante, etiqueta }: Props) {
  const caja = useRef<HTMLDivElement>(null)
  const pedido = useRef({ modelo, variante })
  pedido.current = { modelo, variante }
  const cambia = useRef<() => void>(() => {})
  const [estado, setEstado] = useState<'cargando' | 'listo' | 'fallo'>('cargando')

  useEffect(() => {
    const el = caja.current
    if (!el) return
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) } catch { setEstado('fallo'); return }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.domElement.setAttribute('aria-hidden', 'true')
    el.prepend(renderer.domElement)

    const escena = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    const camara = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
    camara.position.set(0, 1.5, 4.9)
    camara.lookAt(0, 1.05, 0)
    const sol = new THREE.DirectionalLight(0xffffff, 2.2)
    sol.position.set(3, 6, 4)
    sol.castShadow = true
    sol.shadow.mapSize.set(1024, 1024)
    sol.shadow.radius = 6
    Object.assign(sol.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 })
    escena.add(sol, new THREE.HemisphereLight(0xffffff, 0x445566, 0.6))
    const suelo = new THREE.Mesh(new THREE.CircleGeometry(3, 64), new THREE.ShadowMaterial({ opacity: 0.22 }))
    suelo.rotation.x = -Math.PI / 2
    suelo.receiveShadow = true
    escena.add(suelo)

    const peana = new THREE.Group()
    escena.add(peana)
    const reducido = movimientoReducido()
    let actual: THREE.Group | null = null
    let saliente: THREE.Group | null = null
    let entrada = 1, salida = 1
    let giro = 0.6, velGiro = 0, arrastre: number | null = null
    let mira = 1.05, miraObjetivo = 1.05
    let visible = false, raf = 0, vivo = true, turno = 0

    const tam = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1
      renderer.setSize(w, h, false)
      camara.aspect = w / h
      camara.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(tam)
    ro.observe(el)
    tam()

    const ease = (t: number) => 1 - Math.pow(1 - t, 3)
    const cuadro = (t: number) => {
      raf = 0
      if (!vivo) return
      if (arrastre === null) giro += reducido ? 0 : 0.004 + velGiro
      velGiro *= 0.94
      peana.rotation.y = giro
      if (actual && entrada < 1) {
        entrada = Math.min(1, entrada + 0.035)
        const e = ease(entrada)
        actual.scale.setScalar(0.6 + 0.4 * e)
        actual.position.y = -0.8 * (1 - e)
        actual.rotation.y = (1 - e) * -1.6
      }
      if (saliente) {
        salida = Math.min(1, salida + 0.06)
        saliente.scale.setScalar(1 - 0.5 * salida)
        saliente.position.y = -1.2 * salida
        if (salida >= 1) { peana.remove(saliente); saliente = null }
      }
      // Un leve vaivén de cámara para que no parezca una foto girando.
      mira += (miraObjetivo - mira) * 0.06
      camara.position.y = mira + 0.45 + Math.sin(t / 2400) * 0.08
      camara.lookAt(0, mira, 0)
      renderer.render(escena, camara)
      if (visible && !document.hidden) raf = requestAnimationFrame(cuadro)
    }
    const sigue = () => { if (!raf && visible && !document.hidden && vivo) raf = requestAnimationFrame(cuadro) }

    cambia.current = () => {
      const yo = ++turno
      const { modelo: id, variante: v } = pedido.current
      setEstado('cargando')
      carga(MODELOS[id].archivo)
        .then((g) => {
          if (!vivo || yo !== turno) return
          if (actual) { saliente = actual; salida = 0 }
          actual = prepara(g, v)
          miraObjetivo = Math.min(1.1, Math.max(0.45, (actual.userData.alto as number) * 0.5))
          entrada = reducido ? 1 : 0
          if (reducido) actual.scale.setScalar(1)
          peana.add(actual)
          setEstado('listo')
          sigue()
        })
        .catch(() => { if (vivo && yo === turno) setEstado('fallo') })
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      // Los modelos no se descargan hasta que la sección se ve.
      if (visible && !actual && turno === 0) cambia.current()
      sigue()
    }, { rootMargin: '200px' })
    io.observe(el)
    document.addEventListener('visibilitychange', sigue)

    const abajo = (e: PointerEvent) => { if (e.pointerType === 'mouse') { arrastre = e.clientX; el.classList.add('arrastrando') } }
    const mueve = (e: PointerEvent) => {
      if (arrastre === null) return
      const d = (e.clientX - arrastre) * 0.01
      giro += d; velGiro = d * 0.3; arrastre = e.clientX
    }
    const arriba = () => { arrastre = null; el.classList.remove('arrastrando') }
    el.addEventListener('pointerdown', abajo)
    window.addEventListener('pointermove', mueve)
    window.addEventListener('pointerup', arriba)

    return () => {
      vivo = false
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect()
      document.removeEventListener('visibilitychange', sigue)
      el.removeEventListener('pointerdown', abajo)
      window.removeEventListener('pointermove', mueve)
      window.removeEventListener('pointerup', arriba)
      pmrem.dispose(); renderer.dispose(); renderer.domElement.remove()
    }
  }, [])

  // Cambio de ruta: el efecto de arriba ya está montado y sabe hacer la transición.
  const primera = useRef(true)
  useEffect(() => {
    if (primera.current) { primera.current = false; return }
    cambia.current()
  }, [modelo, variante])

  return (
    <div ref={caja} className={`v7-visor ${estado}`} role="img" aria-label={etiqueta}>
      {estado === 'cargando' && <span className="v7-visor-carga" aria-hidden="true" />}
    </div>
  )
}
