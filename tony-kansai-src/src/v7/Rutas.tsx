// «Las rutas» con transformación al hacer scroll.
//
// Escenario fijo: cada capítulo es una ruta con su modelo 3D (Poly Pizza).
// Al bajar, el modelo se deshace en partículas de tinta tomadas de su propia
// superficie, que vuelan como hojas y se recomponen en el modelo siguiente.
// A la izquierda, qué se ve, tiempo desde Osaka y opciones con precio.

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { ESCENAS, META, MODELOS, PRECIO, RUTAS_LARION, RUTAS_TONY, ETIQUETAS, TEXTOS } from './datosRutas'
import type { RutaId } from './datosRutas'
import { ET_ITIN } from './datosItinerarios'

// Página del día hora a hora de cada portada; Miyajima va dentro del día de Hiroshima.
const PAGINA_DIA: Record<string, string> = { es: '/es/rutas/', en: '/en/routes/', ar: '/ar/routes/', ru: '/ru/routes/', larion: '/larion/routes/' }
import type { Pagina } from './contenido'
import { GUIAS } from './contenido'
import { compone, opacidad, muestrea } from './modelos3d'
import { movimientoReducido } from './petalos'
import { suena } from './sonido'

const KANJI_RUTA: Record<RutaId, string> = { kioto: '京都', osaka: '大阪', nara: '奈良', himeji: '姫路', kobe: '神戸', miyajima: '宮島', hiroshima: '広島' }

const PARTICULAS = typeof window !== 'undefined' && window.innerWidth < 700 ? 3500 : 6000

export function Rutas({ p }: { p: Pagina }) {
  const ids = p.guia === 'larion' ? RUTAS_LARION : RUTAS_TONY
  const seccion = useRef<HTMLElement>(null)
  const lienzo = useRef<HTMLDivElement>(null)
  const progreso = useRef(0)
  const [cap, setCap] = useState(0)
  const et = ETIQUETAS[p.lang]
  const sel = ids[cap]
  const r = TEXTOS[p.lang][sel]
  const meta = META[sel]
  const sep = p.lang === 'es' ? '.' : p.lang === 'ru' ? ' ' : ','
  const yen = (n: number) => '¥' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep)
  const pedir = (opcion: string) => {
    const texto = p.contacto.plantilla({ nombre: '', pais: '', ciudad: '', fechas: '', personas: '', hotel: '', intereses: [`${r.titulo} — ${opcion}`], notas: '' })
    return `https://wa.me/${GUIAS[p.guia].wa}?text=${encodeURIComponent(texto)}`
  }

  // Scroll → progreso 0 … n-1.
  useEffect(() => {
    const el = seccion.current
    if (!el) return
    let raf = 0
    const medir = () => {
      raf = 0
      const rc = el.getBoundingClientRect()
      const recorrido = rc.height - window.innerHeight
      const v = recorrido > 0 ? Math.min(1, Math.max(0, -rc.top / recorrido)) : 0
      progreso.current = v * (ids.length - 1)
      setCap(Math.min(ids.length - 1, Math.round(progreso.current)))
    }
    const alScroll = () => { if (!raf) raf = requestAnimationFrame(medir) }
    medir()
    window.addEventListener('scroll', alScroll, { passive: true })
    window.addEventListener('resize', alScroll)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', alScroll); window.removeEventListener('resize', alScroll) }
  }, [ids.length])

  // Cada cambio de ruta suena (si el visitante encendió el sonido).
  const primera = useRef(true)
  useEffect(() => {
    if (primera.current) { primera.current = false; return }
    suena('furin')
  }, [cap])

  /** Al pulsar una ruta del índice, se baja hasta su capítulo. */
  const irA = (i: number) => {
    const el = seccion.current
    if (!el) return
    const recorrido = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: el.offsetTop + (recorrido * i) / (ids.length - 1) + 2, behavior: movimientoReducido() ? 'auto' : 'smooth' })
  }

  // La escena.
  useEffect(() => {
    const caja = lienzo.current
    if (!caja) return
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) } catch { return }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.domElement.setAttribute('aria-hidden', 'true')
    caja.prepend(renderer.domElement)

    const escena = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    const camara = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
    const sol = new THREE.DirectionalLight(0xffffff, 2.2)
    sol.position.set(3, 6, 4)
    sol.castShadow = true
    sol.shadow.mapSize.set(1024, 1024)
    sol.shadow.radius = 6
    Object.assign(sol.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 })
    escena.add(sol, new THREE.HemisphereLight(0xfff8ee, 0x5a5040, 0.7))
    const suelo = new THREE.Mesh(new THREE.CircleGeometry(3, 64), new THREE.ShadowMaterial({ opacity: 0.16 }))
    suelo.rotation.x = -Math.PI / 2
    suelo.receiveShadow = true
    escena.add(suelo)
    const peana = new THREE.Group()
    escena.add(peana)

    // Partículas: cada una sabe dónde está en el modelo A y en el B.
    const geo = new THREE.BufferGeometry()
    const aA = new THREE.BufferAttribute(new Float32Array(PARTICULAS * 3), 3)
    const aB = new THREE.BufferAttribute(new Float32Array(PARTICULAS * 3), 3)
    const azar = new Float32Array(PARTICULAS)
    for (let i = 0; i < PARTICULAS; i++) azar[i] = Math.random()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PARTICULAS * 3), 3))
    geo.setAttribute('aA', aA)
    geo.setAttribute('aB', aB)
    geo.setAttribute('aAzar', new THREE.BufferAttribute(azar, 1))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 1, 0), 4)
    const uP = { uF: { value: 0 }, uVis: { value: 0 }, uTiempo: { value: 0 }, uTam: { value: 22 * renderer.getPixelRatio() } }
    const puntos = new THREE.Points(geo, new THREE.ShaderMaterial({
      uniforms: uP, transparent: true, depthWrite: false,
      vertexShader: `attribute vec3 aA; attribute vec3 aB; attribute float aAzar;
        uniform float uF; uniform float uVis; uniform float uTiempo; uniform float uTam; varying float vA; varying float vAzar;
        void main(){
          // Cada partícula sale a su hora: el cambio barre el modelo, no salta de golpe.
          float t = clamp((uF - aAzar * 0.35) / 0.65, 0.0, 1.0);
          float e = t * t * (3.0 - 2.0 * t);
          vec3 p = mix(aA, aB, e);
          float vuelo = sin(3.14159 * e);
          // Vuelan como hojas: suben, giran alrededor del eje y oscilan.
          float ang = vuelo * (aAzar - 0.5) * 2.4;
          p.xz = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * p.xz;
          p.y += vuelo * (0.35 + aAzar * 0.9);
          p.x += sin(uTiempo * 1.3 + aAzar * 50.0) * 0.07 * vuelo;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uTam * (0.45 + aAzar * 0.8) / -mv.z;
          vA = uVis; vAzar = aAzar;
        }`,
      fragmentShader: `varying float vA; varying float vAzar;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          vec3 c = vAzar > 0.9 ? vec3(0.78, 0.27, 0.18) : vec3(0.15, 0.14, 0.12);
          gl_FragColor = vec4(c, vA * (1.0 - d * 1.6));
        }`,
    }))
    peana.add(puntos)

    const reducido = movimientoReducido()
    const modelos: ({ grupo: THREE.Group; puntos: Float32Array } | null)[] = ids.map(() => null)
    let a0 = -1, b0 = -1, q = 0, mira = 1.05, raf = 0, vivo = true, visible = false

    const tam = () => {
      const w = caja.clientWidth || 1, h = caja.clientHeight || 1
      renderer.setSize(w, h, false)
      camara.aspect = w / h
      camara.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(tam)
    ro.observe(caja)
    tam()

    const cuadro = (t: number) => {
      raf = 0
      if (!vivo) return
      q += (progreso.current - q) * (reducido ? 1 : 0.075)
      const a = Math.min(ids.length - 1, Math.floor(q)), b = Math.min(ids.length - 1, a + 1)
      // Cada tramo: quieto un rato, transformación en medio, quieto otra vez.
      const f = THREE.MathUtils.smoothstep(q - a, 0.15, 0.85)
      const A = modelos[a], B = modelos[b] ?? A
      if (A && B) {
        if (a !== a0 || b !== b0) {
          for (const m of modelos) if (m) peana.remove(m.grupo)
          peana.add(A.grupo)
          if (B !== A) peana.add(B.grupo)
          aA.array.set(A.puntos); aA.needsUpdate = true
          aB.array.set(B.puntos); aB.needsUpdate = true
          a0 = a; b0 = b
        }
        opacidad(A.grupo, 1 - THREE.MathUtils.smoothstep(f, 0.02, 0.22))
        if (B !== A) opacidad(B.grupo, THREE.MathUtils.smoothstep(f, 0.78, 0.98))
        uP.uF.value = f
        uP.uVis.value = THREE.MathUtils.smoothstep(f, 0.0, 0.12) * (1 - THREE.MathUtils.smoothstep(f, 0.88, 1.0))
        uP.uTiempo.value = t / 1000
        const altoObjetivo = Math.min(1.1, Math.max(0.45, ((A.grupo.userData.alto as number) * (1 - f) + (B.grupo.userData.alto as number) * f) * 0.5))
        mira += (altoObjetivo - mira) * 0.08
      }
      // El scroll también gira el modelo: se ve por todos lados al bajar.
      peana.rotation.y = 0.5 + q * 1.4 + (reducido ? 0 : (t / 1000) * 0.12)
      camara.position.set(0, mira + 1.1, 7.4)
      camara.lookAt(0, mira, 0)
      renderer.render(escena, camara)
      if (visible && !document.hidden) raf = requestAnimationFrame(cuadro)
    }
    const sigue = () => { if (!raf && visible && !document.hidden && vivo) raf = requestAnimationFrame(cuadro) }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sigue() }, { rootMargin: '200px' })
    io.observe(caja)
    document.addEventListener('visibilitychange', sigue)

    // Carga en orden: el primero cuanto antes, los demás detrás.
    ;(async () => {
      for (let i = 0; i < ids.length && vivo; i++) {
        try {
          const grupo = await compone(ids[i])
          modelos[i] = { grupo, puntos: muestrea(grupo, PARTICULAS) }
          a0 = -1
          sigue()
        } catch { /* un modelo que no carga: se queda el anterior */ }
      }
    })()

    return () => {
      vivo = false
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect()
      document.removeEventListener('visibilitychange', sigue)
      geo.dispose(); pmrem.dispose(); renderer.dispose(); renderer.domElement.remove()
    }
  }, [ids])

  return (
    <section id="rutas" ref={seccion} className="v7-rutas-scroll" style={{ height: `${ids.length * 85 + 15}vh` }}>
      <div className="v7-rutas-fijo">
        <span className="v7-rutas-marca" lang="ja" aria-hidden="true">{KANJI_RUTA[sel]}</span>
        <div ref={lienzo} className="v7-rutas-lienzo" role="img" aria-label={`${et.modelo}: ${r.titulo}`} />
        <div className="v7-rutas-panel">
          <p className="v7-antetitulo">{et.titulo}</p>
          <nav className="v7-rutas-indice" aria-label={et.titulo}>
            {ids.map((id, i) => (
              <button key={id} type="button" aria-current={i === cap ? 'step' : undefined} onClick={() => irA(i)}>
                {TEXTOS[p.lang][id].titulo}
              </button>
            ))}
          </nav>
          <div className="v7-ruta-info" key={sel}>
            <h3><span className="v7-kanji" lang="ja">{KANJI_RUTA[sel]}</span>{r.titulo}</h3>
            <p className="v7-ruta-desde"><span>{et.desde}</span> {r.desde}</p>
            <p className="v7-ruta-texto">{r.texto}</p>
            <ul className="v7-ruta-opciones">
              {r.opciones.map((o, i) => {
                const tramo = meta.tramos[i] ?? 'completo'
                return (
                  <li key={o.nombre}>
                    <div className="v7-ruta-opcion-cabeza">
                      <strong>{o.nombre}</strong>
                      <span className="v7-ruta-precio">{tramo === 'lejos' ? `${et.desdePrecio} ` : ''}<bdi>{yen(PRECIO[tramo])}</bdi></span>
                    </div>
                    <p>{o.texto}</p>
                    <a className="v7-ruta-pedir" href={pedir(o.nombre)} target="_blank" rel="noopener noreferrer"
                      onClick={() => window.gtag?.('event', 'generate_lead', { pagina: p.id, ruta: sel, canal: 'whatsapp_ruta' })}>{et.pedir} {p.dir === 'rtl' ? '←' : '→'}</a>
                  </li>
                )
              })}
            </ul>
            <a className="v7-ver-dia" href={`${PAGINA_DIA[p.id]}#${sel === 'miyajima' ? 'hiroshima' : sel}`}>
              {ET_ITIN[p.lang].ver} {p.dir === 'rtl' ? '←' : '→'}
            </a>
          </div>
          <p className="v7-ruta-credito" lang="en" dir="ltr">
            {et.modelo}: {[...new Set(ESCENAS[sel].piezas.map((x) => x.m))].map((m, i) => (
              <span key={m}>{i > 0 ? ' · ' : ''}<a href={MODELOS[m].url} target="_blank" rel="noopener noreferrer">{MODELOS[m].titulo}</a> ({MODELOS[m].autor}, {MODELOS[m].licencia})</span>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}
