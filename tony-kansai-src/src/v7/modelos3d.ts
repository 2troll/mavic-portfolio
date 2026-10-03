// Carga y preparación de los modelos 3D de las rutas (glTF de Poly Pizza,
// ver datosRutas.ts), y muestreo de su superficie en partículas para las
// transformaciones con scroll.

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { ESCENAS, MODELOS } from './datosRutas'
import { creaCastilloHimeji } from './castilloHimeji'
import type { RutaId } from './datosRutas'

// Los .glb van comprimidos con meshopt (gltf-transform optimize): 2,5 MB → 180 KB.
const cargador = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
const cache = new Map<string, Promise<THREE.Group>>()
export function carga(url: string) {
  // 'procedural:…' = modelo hecho por código, sin archivo que descargar.
  if (!cache.has(url)) cache.set(url, url === 'procedural:himeji' ? Promise.resolve(creaCastilloHimeji()) : cargador.loadAsync(url).then((g) => g.scene))
  return cache.get(url)!
}

/** Centra el modelo sobre el suelo, lo escala (lado mayor = tam) y aplica el retoque de la ruta. */
export function prepara(original: THREE.Group, variante?: 'osaka' | 'agua', tam_ = 2.2, tinte?: string): THREE.Group {
  const m = original.clone(true)
  m.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    mesh.castShadow = true
    // Cada clon lleva sus materiales: el retoque de Osaka no debe teñir Himeji,
    // y la opacidad de la transición no debe afectar a otro modelo.
    const mats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map((x) => x.clone())
    for (const mat of mats as THREE.MeshStandardMaterial[]) {
      // Osaka: los tejados del castillo son verde cobre, no grises.
      if (variante === 'osaka' && mat.name === '03___Default') mat.color.set('#5e8f7b')
      if (tinte) mat.color.set(tinte)
      mat.envMapIntensity = 0.9
      mat.transparent = true
    }
    mesh.material = Array.isArray(mesh.material) ? mats : mats[0]
  })
  const caja = new THREE.Box3().setFromObject(m)
  const tam = caja.getSize(new THREE.Vector3())
  m.scale.setScalar(tam_ / Math.max(tam.x, tam.y, tam.z))
  const c = new THREE.Box3().setFromObject(m)
  const centro = c.getCenter(new THREE.Vector3())
  m.position.set(-centro.x, -c.min.y, -centro.z)
  const g = new THREE.Group()
  g.add(m)
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
    agua.userData.agua = true
    agua.userData.opacidadBase = 0.85
    g.add(agua)
  }
  g.updateMatrixWorld(true)
  g.userData.alto = new THREE.Box3().setFromObject(m).getSize(new THREE.Vector3()).y
  return g
}

/** Opacidad de todo el modelo (para fundirlo con las partículas). */
export function opacidad(g: THREE.Group, a: number) {
  g.visible = a > 0.01
  g.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    for (const mat of (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as THREE.Material[]) {
      mat.opacity = a * ((mesh.userData.opacidadBase as number) ?? 1)
      // Con opacidad total escribe profundidad: si no, el modelo se ve «hueco».
      mat.depthWrite = a > 0.98
    }
  })
}

/** n puntos repartidos por la superficie del modelo, proporcionales al área. */
export function muestrea(g: THREE.Group, n: number): Float32Array {
  const geos: THREE.BufferGeometry[] = []
  g.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh || mesh.userData.agua || mesh.userData.suelo) return
    let geo = mesh.geometry.clone()
    geo = geo.index ? geo.toNonIndexed() : geo
    for (const k of Object.keys(geo.attributes)) if (k !== 'position') geo.deleteAttribute(k)
    // Los .glb llegan cuantizados (enteros) y el castillo procedural en float:
    // mergeGeometries exige el mismo tipo, y aplicar la matriz sobre enteros perdería precisión.
    const pos = geo.getAttribute('position')
    const f32 = new Float32Array(pos.count * 3)
    for (let i = 0; i < pos.count; i++) f32.set([pos.getX(i), pos.getY(i), pos.getZ(i)], i * 3)
    geo.setAttribute('position', new THREE.BufferAttribute(f32, 3))
    geo.applyMatrix4(mesh.matrixWorld)
    geos.push(geo)
  })
  const salida = new Float32Array(n * 3)
  if (!geos.length) return salida
  const unida = mergeGeometries(geos, false)
  if (!unida) return salida
  const sampler = new MeshSurfaceSampler(new THREE.Mesh(unida)).build()
  const p = new THREE.Vector3()
  for (let i = 0; i < n; i++) {
    sampler.sample(p)
    salida.set([p.x, p.y, p.z], i * 3)
  }
  unida.dispose()
  geos.forEach((x) => x.dispose())
  return salida
}

/** La isla sobre la que se monta la maqueta: sin ella las piezas flotan en el
 *  blanco y no se lee como diorama. Canto de tierra, cara de arriba del color
 *  de la ruta. No se convierte en partículas (userData.suelo). */
function peana(color: string): THREE.Mesh {
  const alto = 0.2
  const geo = new THREE.CylinderGeometry(2.05, 1.95, alto, 72)
  const canto = new THREE.MeshStandardMaterial({ color: '#8a7a66', roughness: 0.95, transparent: true })
  const cara = new THREE.MeshStandardMaterial({ color, roughness: 0.9, transparent: true })
  // CylinderGeometry: material 0 = lateral, 1 = arriba, 2 = abajo.
  const m = new THREE.Mesh(geo, [canto, cara, canto])
  // La cara de arriba un pelo por encima de y=0, donde está el suelo de sombras:
  // así éste queda oculto y la sombra no se pinta dos veces. Las piezas apenas se hunden.
  m.position.y = -alto / 2 + 0.004
  m.receiveShadow = true
  m.userData.suelo = true
  return m
}

/** Monta el diorama de una ruta con sus piezas descargadas. */
export async function compone(ruta: RutaId): Promise<THREE.Group> {
  const e = ESCENAS[ruta]
  const raiz = new THREE.Group()
  const piezas = await Promise.all(e.piezas.map(async (p) => {
    const g = prepara(await carga(MODELOS[p.m].archivo), p.osaka ? 'osaka' : undefined, p.tam, p.tinte)
    g.position.set(p.x, p.y ?? 0, p.z)
    g.rotation.y = p.rot ?? 0
    return g
  }))
  piezas.forEach((g) => raiz.add(g))
  if (e.suelo) raiz.add(peana(e.suelo))
  if (e.agua) {
    // Miyajima: todo lo que no es pez se hunde un poco: el torii y la orilla
    // «flotan» en la marea alta.
    piezas.forEach((g, i) => { if (e.piezas[i].m === 'torii') g.position.y -= 0.35 })
    const agua = new THREE.Mesh(
      // Con peana, el agua deja un anillo de arena donde arraigan los pinos.
      new THREE.CircleGeometry(e.suelo ? 1.55 : 1.75, 64),
      new THREE.MeshStandardMaterial({ color: '#2f6f8f', roughness: 0.15, metalness: 0.2, transparent: true, opacity: 0.85 }),
    )
    agua.rotation.x = -Math.PI / 2
    agua.position.y = 0.01
    agua.receiveShadow = true
    agua.userData.agua = true
    agua.userData.opacidadBase = 0.85
    raiz.add(agua)
  }
  raiz.updateMatrixWorld(true)
  raiz.userData.alto = new THREE.Box3().setFromObject(raiz).getSize(new THREE.Vector3()).y
  return raiz
}
