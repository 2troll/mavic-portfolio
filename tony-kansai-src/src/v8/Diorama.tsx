// Maqueta 3D de la ciudad (las mismas piezas libres de Poly Pizza y el
// castillo procedural de las rutas), a pantalla completa. Gira con el scroll
// y se puede arrastrar. three.js sólo se descarga al llegar aquí (lazy).

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { compone } from '../v7/modelos3d'
import { movimientoReducido } from '../v7/petalos'
import type { RutaId } from '../v7/datosRutas'

export default function Diorama({ ruta, etiqueta }: { ruta: RutaId; etiqueta: string }) {
  const caja = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = caja.current
    if (!el) return
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) } catch { return }
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
    const camara = new THREE.PerspectiveCamera(30, 1, 0.1, 60)
    const sol = new THREE.DirectionalLight(0xffffff, 2.4)
    sol.position.set(3, 7, 4)
    sol.castShadow = true
    sol.shadow.mapSize.set(1024, 1024)
    sol.shadow.radius = 8
    Object.assign(sol.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 })
    escena.add(sol, new THREE.HemisphereLight(0xffffff, 0x8a8f99, 0.8))
    const suelo = new THREE.Mesh(new THREE.CircleGeometry(4, 64), new THREE.ShadowMaterial({ opacity: 0.14 }))
    suelo.rotation.x = -Math.PI / 2
    suelo.receiveShadow = true
    escena.add(suelo)
    const peana = new THREE.Group()
    escena.add(peana)

    let vivo = true, raf = 0, visible = false, alto = 2, nace = 0
    compone(ruta).then((g) => {
      if (!vivo) return
      g.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.castShadow = true })
      alto = (g.userData.alto as number) || 2
      peana.add(g)
      nace = performance.now()
      sigue()
    }).catch((e) => console.error('[Diorama]', ruta, e))

    const tam = () => {
      const w = el.clientWidth, h = el.clientHeight
      renderer.setSize(w, h, false)
      camara.aspect = w / h
      // En móvil (vertical) la cámara se aleja para que quepa la maqueta.
      const lejos = camara.aspect < 0.8 ? 10.5 : 7.6
      camara.position.set(0, alto * 0.55 + 2.1, lejos)
      camara.lookAt(0, alto * 0.42, 0)
      camara.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(tam)
    ro.observe(el)

    // Arrastrar para girar; con inercia.
    let giro = 0, velocidad = 0, arrastre: number | null = null
    const baja = (e: PointerEvent) => { arrastre = e.clientX; el.setPointerCapture(e.pointerId) }
    const mueve = (e: PointerEvent) => {
      if (arrastre === null) return
      velocidad = (e.clientX - arrastre) * 0.006
      giro += velocidad
      arrastre = e.clientX
    }
    const suelta = () => { arrastre = null }
    el.addEventListener('pointerdown', baja)
    el.addEventListener('pointermove', mueve)
    el.addEventListener('pointerup', suelta)
    el.addEventListener('pointercancel', suelta)

    const reducido = movimientoReducido()
    const cuadro = (t: number) => {
      raf = 0
      if (!vivo) return
      tam()
      // Avance del scroll por la sección (0 arriba, 1 al salir), leído del rectángulo.
      const r = el.getBoundingClientRect()
      const avance = Math.min(1, Math.max(0, 1 - (r.top + r.height) / (window.innerHeight + r.height)))
      if (arrastre === null) { velocidad *= 0.94; giro += velocidad + (reducido ? 0 : 0.0015) }
      peana.rotation.y = giro + avance * Math.PI * 1.2
      // Al aparecer, la maqueta crece desde el suelo con un pequeño rebote.
      const k = Math.min(1, (t - nace) / 1400)
      const s = reducido ? 1 : 1 - Math.pow(1 - k, 3) * Math.cos(k * 4.5) * 0.4
      peana.scale.setScalar(Math.max(0.01, nace ? s : 0.01))
      renderer.render(escena, camara)
      if (visible && !document.hidden) raf = requestAnimationFrame(cuadro)
    }
    const sigue = () => { if (!raf && visible && !document.hidden && vivo) raf = requestAnimationFrame(cuadro) }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sigue() })
    io.observe(el)
    document.addEventListener('visibilitychange', sigue)

    return () => {
      vivo = false
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect()
      document.removeEventListener('visibilitychange', sigue)
      el.removeEventListener('pointerdown', baja); el.removeEventListener('pointermove', mueve)
      el.removeEventListener('pointerup', suelta); el.removeEventListener('pointercancel', suelta)
      pmrem.dispose(); renderer.dispose(); renderer.domElement.remove()
    }
  }, [ruta])

  return <div ref={caja} className="v8-diorama" role="img" aria-label={etiqueta} />
}
