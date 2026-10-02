// Castillo de Himeji procedural (sin .glb): torre principal blanca de cinco
// tejados sobre su base de piedra en talud, con chidori-hafu (frontones
// triangulares), kara-hafu (frontón curvo), shachihoko en la cumbrera y dos
// torres pequeñas unidas por un pasillo. Estilo low-poly de colores planos,
// como los modelos de Poly Pizza del diorama (ver modelos3d.ts).
//
// Convenciones: origen en el centro de la base, Y arriba, fachada principal
// mirando a +Z. La escala da igual: quien lo usa normaliza el lado mayor.

import * as THREE from 'three'

const COLOR = {
  muro: '#f2efe8',
  tejado: '#6f7f7a',
  cumbrera: '#e9e6df',
  piedra: '#8a8378',
  madera: '#3b3530',
} as const
type Tinte = keyof typeof COLOR

type V = THREE.Vector3
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)

// Triángulos sueltos agrupados por color. Al final cada color de cada pieza
// es un solo Mesh: pocas llamadas de dibujo, y normales planas (no indexado)
// que dan el facetado low-poly sin necesidad de flatShading.
class Cubos {
  private tris: Record<Tinte, number[]> = { muro: [], tejado: [], cumbrera: [], piedra: [], madera: [] }

  /** Añade un triángulo orientado para que su normal mire hacia `fuera`:
   *  así no hay que cuidar el sentido de giro en cada cara a mano. */
  tri(t: Tinte, a: V, b: V, c: V, fuera: V) {
    const n = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a))
    const [p, q] = n.dot(fuera) >= 0 ? [b, c] : [c, b]
    this.tris[t].push(a.x, a.y, a.z, p.x, p.y, p.z, q.x, q.y, q.z)
  }

  quad(t: Tinte, a: V, b: V, c: V, d: V, fuera: V) {
    this.tri(t, a, b, c, fuera)
    this.tri(t, a, c, d, fuera)
  }

  /** Copia una geometría de three (caja, etc.) ya transformada. */
  geo(t: Tinte, g: THREE.BufferGeometry, m: THREE.Matrix4) {
    const s = (g.index ? g.toNonIndexed() : g).applyMatrix4(m)
    const p = s.getAttribute('position')
    for (let i = 0; i < p.count; i++) this.tris[t].push(p.getX(i), p.getY(i), p.getZ(i))
    s.dispose()
    g.dispose()
  }

  /** Listón (caja fina) de `a` a `b`: cumbreras y aristas blancas de los tejados. */
  liston(t: Tinte, a: V, b: V, grosor: number) {
    const largo = a.distanceTo(b)
    if (largo < 1e-5) return
    const m = new THREE.Matrix4().lookAt(a, b, v(0, 1, 0))
    // lookAt falla si el listón es vertical; no ocurre aquí, pero mejor no romper.
    if (Math.abs(b.x - a.x) + Math.abs(b.z - a.z) < 1e-6) m.lookAt(a, b, v(1, 0, 0))
    m.setPosition(a.clone().add(b).multiplyScalar(0.5))
    this.geo(t, new THREE.BoxGeometry(grosor, grosor, largo), m)
  }

  aGrupo(nombre: string): THREE.Group {
    const g = new THREE.Group()
    g.name = nombre
    for (const t of Object.keys(this.tris) as Tinte[]) {
      if (!this.tris[t].length) continue
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute(this.tris[t], 3))
      geo.computeVertexNormals()
      // Un material propio por malla: el diorama los clona y les cambia la opacidad.
      const mat = new THREE.MeshStandardMaterial({ color: COLOR[t], roughness: 0.8, metalness: 0 })
      mat.name = `himeji-${t}`
      const malla = new THREE.Mesh(geo, mat)
      malla.name = `${nombre}-${t}`
      malla.castShadow = true
      malla.receiveShadow = true
      g.add(malla)
    }
    return g
  }
}

/** Anillo de 8 puntos (esquinas y centros de lado) de un rectángulo centrado en (cx, cz). */
function anillo(cx: number, cz: number, w: number, d: number, y: number, alzaEsquina = 0, salidaEsquina = 0): V[] {
  const hx = w / 2, hz = d / 2
  const e = (sx: number, sz: number) => v(cx + sx * (hx + salidaEsquina), y + alzaEsquina, cz + sz * (hz + salidaEsquina))
  return [e(-1, -1), v(cx, y, cz - hz), e(1, -1), v(cx + hx, y, cz), e(1, 1), v(cx, y, cz + hz), e(-1, 1), v(cx - hx, y, cz)]
}

/** Banda entre dos anillos; la normal apunta lejos del eje y hacia `sesgoY`. */
function banda(c: Cubos, t: Tinte, abajo: V[], arriba: V[], cx: number, cz: number, sesgoY: number) {
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    const m = abajo[i].clone().add(abajo[j]).add(arriba[i]).add(arriba[j]).multiplyScalar(0.25)
    const fuera = v(m.x - cx, 0, m.z - cz).normalize().setY(sesgoY)
    c.quad(t, abajo[i], abajo[j], arriba[j], arriba[i], fuera)
  }
}

/** Caja de muro encalado (sin tapa inferior; la tapa superior queda bajo el tejado). */
function muro(c: Cubos, cx: number, cz: number, w: number, d: number, y0: number, h: number) {
  const m = new THREE.Matrix4().makeTranslation(cx, y0 + h / 2, cz)
  c.geo('muro', new THREE.BoxGeometry(w, h, d), m)
}

/** Ventanas: rectángulos oscuros un pelo por fuera del muro, en fila por cada cara. */
function ventanas(c: Cubos, cx: number, cz: number, w: number, d: number, y: number, tam: number) {
  const ancho = tam * 0.8, alto = tam
  const fila = (largo: number, eje: 'x' | 'z', signo: number) => {
    const n = Math.max(1, Math.floor(largo / (tam * 2.6)))
    const paso = largo / n
    for (let k = 0; k < n; k++) {
      const s = -largo / 2 + paso * (k + 0.5)
      const off = 0.004
      if (eje === 'x') {
        const z = cz + signo * (d / 2 + off)
        const f = v(0, 0, signo)
        c.quad('madera', v(cx + s - ancho / 2, y - alto / 2, z), v(cx + s + ancho / 2, y - alto / 2, z), v(cx + s + ancho / 2, y + alto / 2, z), v(cx + s - ancho / 2, y + alto / 2, z), f)
      } else {
        const x = cx + signo * (w / 2 + off)
        const f = v(signo, 0, 0)
        c.quad('madera', v(x, y - alto / 2, cz + s - ancho / 2), v(x, y - alto / 2, cz + s + ancho / 2), v(x, y + alto / 2, cz + s + ancho / 2), v(x, y + alto / 2, cz + s - ancho / 2), f)
      }
    }
  }
  fila(w * 0.8, 'x', 1)
  fila(w * 0.8, 'x', -1)
  fila(d * 0.8, 'z', 1)
  fila(d * 0.8, 'z', -1)
}

interface Faldon {
  cx: number; cz: number
  ancho: number; fondo: number // rectángulo del alero (exterior)
  yAlero: number
  arribaAncho: number; arribaFondo: number; yArriba: number // donde el faldón toca el muro de encima
  muroAncho: number; muroFondo: number // muro de debajo (para el sofito)
  s: number // escala de la torre: grosores proporcionales
}

/** Faldón a cuatro aguas con las esquinas levantadas (sori), canto blanco,
 *  sofito encalado y aristas blancas: lo que hace que Himeji «se lea» blanco. */
function faldon(c: Cubos, f: Faldon) {
  const { cx, cz, s } = f
  const alza = 0.04 * s, salida = 0.02 * s, canto = 0.03 * s
  const alero = anillo(cx, cz, f.ancho, f.fondo, f.yAlero, alza, salida)
  const arriba = anillo(cx, cz, f.arribaAncho, f.arribaFondo, f.yArriba)
  banda(c, 'tejado', alero, arriba, cx, cz, 1.6)
  const bajoCanto = alero.map((p) => p.clone().setY(p.y - canto))
  banda(c, 'cumbrera', bajoCanto, alero, cx, cz, 0)
  const pieMuro = anillo(cx, cz, f.muroAncho, f.muroFondo, f.yAlero - canto)
  banda(c, 'muro', pieMuro, bajoCanto, cx, cz, -3)
  // Aristas de limatesa: de cada esquina del alero a la esquina de arriba.
  for (const i of [0, 2, 4, 6]) c.liston('cumbrera', alero[i], arriba[i], 0.018 * s)
}

/** Chidori-hafu: frontón triangular que asoma del faldón. `lado` es la normal de la fachada. */
function chidori(c: Cubos, base: V, lado: V, ancho: number, alto: number, fondo: number, s: number) {
  const lat = v(lado.z, 0, -lado.x) // horizontal, paralelo a la fachada
  const vuelo = 1.18
  const p = (u: number, h: number, atras: number, k = 1) =>
    base.clone().addScaledVector(lat, u * k).addScaledVector(lado, -atras).add(v(0, h, 0))
  const cima = p(0, alto, 0), cimaFondo = p(0, alto, fondo)
  const izq = p(-ancho / 2, 0, 0, vuelo), der = p(ancho / 2, 0, 0, vuelo)
  const izqF = p(-ancho / 2, 0, fondo, vuelo), derF = p(ancho / 2, 0, fondo, vuelo)
  // Las dos aguas del frontón; la normal sube y se aparta del caballete.
  c.quad('tejado', izq, cima, cimaFondo, izqF, lat.clone().multiplyScalar(-1).setY(1.2))
  c.quad('tejado', der, cima, cimaFondo, derF, lat.clone().setY(1.2))
  // Tímpano encalado, un poco metido bajo el vuelo de las aguas.
  const r = 0.012 * s
  c.tri('muro', p(-ancho / 2, 0.004, r), p(ancho / 2, 0.004, r), p(0, alto - 0.012 * s, r), lado)
  // Bajo el vuelo, para que el frontón no se vea hueco desde abajo.
  c.quad('muro', izq, der, derF, izqF, v(0, -1, 0))
  // Tablas de canto blancas a lo largo de las aguas (hafu-ita).
  c.liston('cumbrera', izq, cima, 0.016 * s)
  c.liston('cumbrera', der, cima, 0.016 * s)
}

/** Kara-hafu: frontón de perfil curvo (campana con las puntas levantadas). */
function karahafu(c: Cubos, base: V, lado: V, ancho: number, alto: number, fondo: number, s: number) {
  const lat = v(lado.z, 0, -lado.x)
  const n = 10
  const perfil: [number, number][] = []
  for (let k = 0; k <= n; k++) {
    const u = -1 + (2 * k) / n
    const h = alto * (0.5 * (1 + Math.cos(Math.PI * u)) * 0.85 + 0.2 * u ** 6)
    perfil.push([(u * ancho) / 2, h])
  }
  const pt = (x: number, h: number, atras: number) =>
    base.clone().addScaledVector(lat, x).addScaledVector(lado, -atras).add(v(0, h, 0))
  const canto = 0.02 * s, r = 0.012 * s
  for (let k = 0; k < n; k++) {
    const [x0, h0] = perfil[k], [x1, h1] = perfil[k + 1]
    const sube = v(0, 1, 0).addScaledVector(lat, -(h1 - h0) / Math.max(1e-6, x1 - x0))
    c.quad('tejado', pt(x0, h0, -0.01 * s), pt(x1, h1, -0.01 * s), pt(x1, h1, fondo), pt(x0, h0, fondo), sube)
    c.quad('cumbrera', pt(x0, h0 - canto, -0.01 * s), pt(x1, h1 - canto, -0.01 * s), pt(x1, h1, -0.01 * s), pt(x0, h0, -0.01 * s), lado)
    c.quad('muro', pt(x0, 0, r), pt(x1, 0, r), pt(x1, h1 - canto, r), pt(x0, h0 - canto, r), lado)
  }
}

/** Shachihoko estilizado: cuerpo inclinado y cola levantada, mirando hacia dentro. */
function shachihoko(c: Cubos, p: V, haciaDentro: number, s: number) {
  const m = new THREE.Matrix4().makeTranslation(p.x, p.y + 0.03 * s, p.z)
  m.multiply(new THREE.Matrix4().makeRotationX(0.35 * haciaDentro))
  c.geo('madera', new THREE.BoxGeometry(0.022 * s, 0.05 * s, 0.03 * s), m)
  const cola = new THREE.Matrix4().makeTranslation(p.x, p.y + 0.065 * s, p.z - haciaDentro * 0.012 * s)
  cola.multiply(new THREE.Matrix4().makeRotationX(-0.6 * haciaDentro))
  c.geo('madera', new THREE.BoxGeometry(0.03 * s, 0.03 * s, 0.01 * s), cola)
}

type Frontones = Partial<Record<'frente' | 'atras' | 'izq' | 'der', ('chidori' | 'doble' | 'kara')[]>>

interface Planta { w: number; d: number; h: number; frontones?: Frontones }

/** Torre de pisos apilados con faldones entre ellos y tejado irimoya arriba.
 *  La cumbrera superior va en Z para que el gran frontón mire a la fachada. */
function torre(nombre: string, cx: number, cz: number, y0: number, pisos: Planta[], s: number, cumbreraEnX = false): THREE.Group {
  const c = new Cubos()
  const vuelo = 0.11 * s, subida = 0.125 * s
  let y = y0
  for (let i = 0; i < pisos.length; i++) {
    const p = pisos[i]
    const alto = p.h + (i > 0 ? subida : 0) // el faldón de abajo tapa el arranque del muro
    muro(c, cx, cz, p.w, p.d, y, alto)
    ventanas(c, cx, cz, p.w, p.d, y + alto - p.h * 0.5, 0.045 * s)
    y += alto
    const sig = pisos[i + 1]
    const ultimo = !sig
    // En el último piso el faldón sube hasta el arranque del irimoya.
    const arribaW = ultimo ? p.w * 0.62 : sig.w
    const arribaD = ultimo ? p.d * 0.92 : sig.d
    const f: Faldon = {
      cx, cz, s, ancho: p.w + 2 * vuelo, fondo: p.d + 2 * vuelo, yAlero: y,
      arribaAncho: arribaW, arribaFondo: arribaD, yArriba: y + subida, muroAncho: p.w, muroFondo: p.d,
    }
    if (cumbreraEnX && ultimo) [f.arribaAncho, f.arribaFondo] = [p.w * 0.92, p.d * 0.62]
    faldon(c, f)
    for (const [cara, lista] of Object.entries(p.frontones ?? {}) as [keyof Frontones, NonNullable<Frontones['frente']>][]) {
      const lado = { frente: v(0, 0, 1), atras: v(0, 0, -1), izq: v(-1, 0, 0), der: v(1, 0, 0) }[cara]
      const mitad = lado.x !== 0 ? f.ancho / 2 : f.fondo / 2
      const largoCara = lado.x !== 0 ? f.fondo : f.ancho
      const lat = v(lado.z, 0, -lado.x)
      const base = v(cx, y + 0.004 * s, cz).addScaledVector(lado, mitad)
      const fondoF = vuelo + (lado.x !== 0 ? p.w - arribaW : p.d - arribaD) / 2 + 0.06 * s
      for (const tipo of lista) {
        if (tipo === 'kara') karahafu(c, base, lado, largoCara * 0.34, 0.16 * s, fondoF, s)
        else if (tipo === 'doble') {
          // Hiyoku-chidori: dos frontones gemelos lado a lado.
          for (const k of [-1, 1]) chidori(c, base.clone().addScaledVector(lat, (k * largoCara) / 5.2), lado, largoCara * 0.24, 0.15 * s, fondoF, s)
        } else chidori(c, base, lado, largoCara * 0.34, 0.19 * s, fondoF, s)
      }
    }
    y += sig ? 0 : subida
  }
  // Irimoya: hastial triangular sobre el último faldón.
  const ult = pisos[pisos.length - 1]
  const gw = cumbreraEnX ? ult.w * 0.92 : ult.w * 0.62
  const gd = cumbreraEnX ? ult.d * 0.62 : ult.d * 0.92
  const alto = 0.17 * s
  const ejeZ = !cumbreraEnX
  const L = ejeZ ? gd / 2 + 0.035 * s : gw / 2 + 0.035 * s // las aguas vuelan sobre el tímpano
  const R = ejeZ ? gw / 2 : gd / 2
  const P = (lat: number, h: number, a: number) => (ejeZ ? v(cx + lat, y + h, cz + a) : v(cx + a, y + h, cz + lat))
  for (const sg of [-1, 1]) {
    const fuera = ejeZ ? v(sg, 1.3, 0) : v(0, 1.3, sg)
    c.quad('tejado', P(sg * (R + 0.03 * s), -0.02 * s, -L), P(0, alto, -L), P(0, alto, L), P(sg * (R + 0.03 * s), -0.02 * s, L), fuera)
    // Tímpanos en los dos extremos, metidos bajo el vuelo.
    const a = sg * (L - 0.035 * s)
    const fT = ejeZ ? v(0, 0, sg) : v(sg, 0, 0)
    c.tri('muro', P(-R, 0, a), P(R, 0, a), P(0, alto - 0.01 * s, a), fT)
    c.liston('cumbrera', P(-R - 0.03 * s, -0.02 * s, sg * L), P(0, alto, sg * L), 0.018 * s)
    c.liston('cumbrera', P(R + 0.03 * s, -0.02 * s, sg * L), P(0, alto, sg * L), 0.018 * s)
    shachihoko(c, P(0, alto, sg * (L - 0.01 * s)), -sg, s)
  }
  c.liston('cumbrera', P(0, alto + 0.008 * s, -L), P(0, alto + 0.008 * s, L), 0.026 * s)
  return c.aGrupo(nombre)
}

/** Ishigaki: muro de piedra en talud con la curva típica (tendido abajo, casi
 *  vertical arriba), hecho con tres troncos de pirámide apilados. */
function ishigaki(cx: number, cz: number, w: number, d: number, alto: number): THREE.Group {
  const c = new Cubos()
  // [altura relativa, ensanche a cada lado]: el talud se suaviza al subir.
  const perfil: [number, number][] = [[0, 0.2], [0.35, 0.09], [0.7, 0.03], [1, 0]]
  const ani = perfil.map(([h, e]) => anillo(cx, cz, w + 2 * e * alto * 2.2, d + 2 * e * alto * 2.2, h * alto))
  for (let i = 0; i < ani.length - 1; i++) banda(c, 'piedra', ani[i], ani[i + 1], cx, cz, 0.3)
  const top = ani[ani.length - 1]
  const centro = v(cx, alto, cz)
  for (let i = 0; i < 8; i++) c.tri('piedra', centro, top[i], top[(i + 1) % 8], v(0, 1, 0))
  return c.aGrupo('ishigaki')
}

export function creaCastilloHimeji(): THREE.Group {
  const raiz = new THREE.Group()
  raiz.name = 'castillo-himeji'
  const yBase = 0.62
  raiz.add(ishigaki(-0.1, -0.05, 2.06, 1.04, yBase))

  // Torre principal (tenshu): seis plantas y cinco tejados visibles. Los
  // frontones siguen la fachada sur real (kara-hafu en el 2.º tejado, frontones
  // gemelos en el 3.º) y en las caras ocultas se reparten a ojo.
  raiz.add(torre('tenshu', 0.42, 0, yBase, [
    { w: 1.0, d: 0.84, h: 0.25, frontones: { frente: ['chidori'], atras: ['chidori'], izq: ['chidori'], der: ['chidori'] } },
    { w: 0.88, d: 0.72, h: 0.2, frontones: { frente: ['kara'], atras: ['doble'], izq: ['doble'], der: ['doble'] } },
    { w: 0.76, d: 0.6, h: 0.18, frontones: { frente: ['doble'], atras: ['chidori'], izq: ['chidori'], der: ['chidori'] } },
    { w: 0.64, d: 0.5, h: 0.16, frontones: { frente: ['chidori'], atras: ['chidori'] } },
    { w: 0.54, d: 0.42, h: 0.2 },
  ], 1))

  // Torres pequeñas del oeste (ko-tenshu), más bajas y con la cumbrera girada.
  raiz.add(torre('ko-tenshu-oeste', -0.85, 0.16, yBase, [
    { w: 0.46, d: 0.4, h: 0.17, frontones: { frente: ['chidori'] } },
    { w: 0.38, d: 0.32, h: 0.13 },
    { w: 0.3, d: 0.25, h: 0.13 },
  ], 0.62))
  raiz.add(torre('ko-tenshu-noroeste', -0.42, -0.36, yBase, [
    { w: 0.42, d: 0.36, h: 0.16, frontones: { izq: ['chidori'] } },
    { w: 0.32, d: 0.27, h: 0.13 },
  ], 0.55))

  // Watari-yagura: pasillos de dos plantas que unen las torres.
  raiz.add(torre('watari-oeste', -0.3, 0.2, yBase, [
    { w: 0.66, d: 0.32, h: 0.15, frontones: { frente: ['chidori'] } },
    { w: 0.54, d: 0.24, h: 0.11 },
  ], 0.55, true))
  raiz.add(torre('watari-norte', -0.72, -0.26, yBase, [{ w: 0.36, d: 0.26, h: 0.14 }], 0.5, true))

  // Origen en el centro de la base (el diorama apoya el modelo en el suelo).
  const caja = new THREE.Box3().setFromObject(raiz)
  const centro = caja.getCenter(new THREE.Vector3())
  raiz.position.set(-centro.x, -caja.min.y, -centro.z)
  const g = new THREE.Group()
  g.name = 'himeji'
  g.add(raiz)
  return g
}
