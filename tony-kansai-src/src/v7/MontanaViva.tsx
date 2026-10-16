// La página de montaña «viva»: lo elegido de la demo de efectos (~/projects/demo-efectos)
// llevado a la web real.
//  · Lenis + GSAP ScrollTrigger: scroll con inercia y todo ligado al scroll.
//  · PortadaViva: titular que sube palabra a palabra, rayos de sol de Paper Shaders con
//    el color de la estación y dos crestas con el perfil REAL de Kongō e Hiei que suben
//    al bajar y tapan la foto, como telón hacia la sección siguiente.
//  · Travesia: las ocho montañas en horizontal (sección fijada) con un fondo vivo
//    MeshGradient que cambia de color en cada cima y el corte del terreno que se dibuja.
//  · SelloMetal: el kanji 山 en metal líquido (LiquidMetal) en la llamada final.
//  · useRevelados: títulos, tarjetas y fichas entran al aparecer en pantalla.
// Lienzos WebGL solo en el cliente, montados cerca de pantalla y nunca con
// «reducir movimiento»: el HTML prerenderizado es el mismo con o sin ellos.
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { GodRays, MeshGradient, LiquidMetal } from '@paper-design/shaders-react'
import { MONTES, KANJI, CIMA } from './datosMontana'
import type { MonteId } from './datosMontana'
import { PERFIL } from './datosExpedicion'
import type { TextosExpedicion, Lengua } from './datosExpedicion'
import { CUMBRES } from './datosCumbres'
import { CapaEstacion, SelectorEstacion, useEstacion } from './Estaciones'
import type { Estacion } from './Estaciones'
import { Cuenta, Credito } from './Expedicion'
import { Contador } from './Cocina'
import GradientText from './reactbits/GradientText'
import VariableProximity from './reactbits/VariableProximity'
import ShinyText from './reactbits/ShinyText'
import './montana-viva.css'

gsap.registerPlugin(ScrollTrigger)

const quieto = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const foto = (id: MonteId | 'portada', ancho: 800 | 1600 = 1600) => `/v7/expedicion/${id}${ancho === 800 ? '-800' : ''}.webp`
const NUMEROS = ['一', '二', '三', '四', '五', '六', '七', '八']

/* ───────────── Scroll suave ───────────── */

let lenis: Lenis | null = null

/** Baja hasta `destino` con la misma inercia que la rueda (o de golpe con movimiento reducido). */
export function suaveA(destino: number | HTMLElement | null) {
  if (destino == null) return
  if (lenis) { lenis.scrollTo(destino, { offset: typeof destino === 'number' ? 0 : -70 }); return }
  const top = typeof destino === 'number' ? destino : destino.getBoundingClientRect().top + window.scrollY - 70
  window.scrollTo({ top, behavior: quieto() ? 'auto' : 'smooth' })
}

/** Lenis para esta página, movido por el reloj de GSAP para que ScrollTrigger vaya a la par. */
export function useSuave() {
  useEffect(() => {
    if (quieto()) return
    ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })
    lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.9,
      anchors: { offset: -70 },
      stopInertiaOnNavigate: true,
      // El mapa 3D y los paneles con scroll propio se quedan la rueda.
      prevent: (n: HTMLElement) => !!n.closest?.('.maplibregl-map, .ex-vuelo, [data-lenis-prevent]'),
    })
    const quita = lenis.on('scroll', ScrollTrigger.update)
    const tic = (t: number) => lenis?.raf(t * 1000)
    gsap.ticker.add(tic)
    gsap.ticker.lagSmoothing(0)
    return () => { quita(); gsap.ticker.remove(tic); lenis?.destroy(); lenis = null }
  }, [])
}

/* ───────────── Utilidades ───────────── */

/** Monta los hijos solo cuando el bloque está cerca de pantalla (el navegador aguanta pocos contextos WebGL). */
function Perezoso({ children, className, margen = '200px' }: { children: ReactNode; className?: string; margen?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [cerca, setCerca] = useState(false)
  useEffect(() => {
    if (quieto() || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setCerca(e.isIntersecting), { rootMargin: margen })
    io.observe(ref.current!)
    return () => io.disconnect()
  }, [margen])
  return <div ref={ref} className={className} aria-hidden="true">{cerca ? children : null}</div>
}

/** Perfil real del terreno como silueta rellena (viewBox 1000 × 200). */
function silueta(id: MonteId, espejo = false) {
  const d = PERFIL[id]
  const bajo = Math.min(...d), alto = Math.max(...d)
  const pts = d.map((v, i) => {
    const x = (i / (d.length - 1)) * 1000
    return [espejo ? 1000 - x : x, 200 - 70 - ((v - bajo) / (alto - bajo)) * 120] as const
  })
  if (espejo) pts.reverse()
  return `M0 200L${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}L1000 200Z`
}

/* ───────────── Portada ───────────── */

const RAYOS: Record<Estacion, { colors: string[]; bloom: string }> = {
  invierno: { colors: ['#dff1ffcc', '#9fd0ffaa', '#ffffff'], bloom: '#cfe8ff' },
  otono: { colors: ['#ffb35ccc', '#ff7a1aa0', '#fff1d6'], bloom: '#ff9a3c' },
  primavera: { colors: ['#ffd1e3cc', '#ff9ec4a0', '#ffffff'], bloom: '#ffb8d2' },
  verano: { colors: ['#ffe9a8b0', '#b6f25a80', '#fffbe6'], bloom: '#ffd36b' },
}

function Rayos() {
  const e = useEstacion()
  const r = RAYOS[e]
  return (
    <Perezoso className="mv-rayos" margen="0px">
      <GodRays style={{ width: '100%', height: '100%' }} colorBack="#000000" colors={r.colors} colorBloom={r.bloom}
        offsetX={0.42} offsetY={-0.62} density={0.32} spotty={0.45} midIntensity={0.45} midSize={0.22}
        intensity={0.7} bloom={0.45} speed={0.35} minPixelRatio={1} maxPixelCount={1280 * 720} />
    </Perezoso>
  )
}

// Paleta del titular por estación (GradientText de React Bits en modo «flow»).
const TINTAS: Record<Estacion, string[]> = {
  invierno: ['#ffffff', '#d6f1ff', '#8fd0ff', '#f2fbff'],
  primavera: ['#ffffff', '#ffe0ec', '#ff9cc6', '#fff4f8'],
  verano: ['#fff6cc', '#ffd23f', '#ff8a1f', '#fff1b3'],
  otono: ['#ffe6a6', '#ffa135', '#e9472a', '#ffd27a'],
}

export function PortadaViva({ t, lang, maxGrupo, onBaja }: { t: TextosExpedicion; lang: Lengua; maxGrupo: number; onBaja: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const prefecturas = new Set([...CUMBRES.map((c) => c.prefectura.en), 'Osaka', 'Kyoto', 'Hyōgo', 'Nara'])
  const cifras = [MONTES.length + CUMBRES.length, Math.max(...MONTES.map((m) => CIMA[m].m), ...CUMBRES.map((c) => c.cima ?? 0)), prefecturas.size, maxGrupo]

  useEffect(() => {
    const raiz = ref.current
    if (!raiz || quieto()) return
    const ctx = gsap.context(() => {
      // Entrada: cada palabra sube desde detrás de su máscara (palabras, no letras: el árabe se liga).
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('.mv-palabra > span', { yPercent: 118, rotate: 5, duration: 1.3, stagger: 0.09 }, 0.15)
        .from('.ex-kicker, .ex-entradilla, .ex-cifras > div, .ex-baja', { y: 34, opacity: 0, duration: 1, stagger: 0.07 }, 0.55)
        .from('.mv-cresta', { yPercent: 100, duration: 1.8, stagger: 0.15 }, 0.2)

      // Al bajar: la foto se aleja, el texto se va y las crestas suben a tapar la foto.
      // scrub con retardo: el efecto sigue al scroll con medio segundo de suavizado y no da tirones.
      const st = { trigger: raiz, start: 'top top', end: 'bottom top', scrub: 0.6 }
      gsap.to('.ex-portada-foto', { scale: 1.18, yPercent: 14, ease: 'none', scrollTrigger: st })
      gsap.to('.ex-portada-texto', { yPercent: -28, opacity: 0, ease: 'none', scrollTrigger: { ...st, end: '75% top' } })
      gsap.to('.mv-cresta-atras', { yPercent: -38, ease: 'none', scrollTrigger: st })
      gsap.to('.mv-cresta-delante', { yPercent: -78, ease: 'none', scrollTrigger: st })
    }, raiz)
    return () => ctx.revert()
  }, [])

  // Al cambiar de estación, las letras se rehacen con la textura nueva (hielo, flores, calor, hojas).
  const estacion = useEstacion()
  const previa = useRef(estacion)
  useEffect(() => {
    if (previa.current === estacion || quieto()) return
    previa.current = estacion
    const palabras = ref.current?.querySelectorAll('.mv-palabra > span')
    if (palabras?.length) gsap.fromTo(palabras, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.06, overwrite: true })
  }, [estacion])

  return (
    <section ref={ref} className="ex-portada mv-portada" aria-labelledby="ex-titulo">
      <div className="ex-portada-foto">
        <img src={foto('portada')} srcSet={`${foto('portada', 800)} 800w, ${foto('portada')} 1920w`} sizes="100vw" alt={t.portada.foto} fetchPriority="high" />
      </div>
      <div className="ex-portada-velo" aria-hidden="true" />
      <Rayos />
      <CapaEstacion />
      <SelectorEstacion lang={lang} />
      <div className="ex-portada-texto">
        <p className="ex-kicker"><span className="ex-regla" aria-hidden="true" />
          <ShinyText text={t.cabecera} color={TINTAS[estacion][2]} shineColor="#ffffff" speed={3.2} delay={1.2} /> <span lang="ja">関西の山</span></p>
        <h1 id="ex-titulo" className="mv-titulo">
          {t.portada.titulo.split(' ').map((w, i) => (
            <span key={i}><span className="mv-palabra"><span>
              <GradientText colors={TINTAS[estacion]} variant="flow" animationSpeed={9} scale={2.4}>
                {/* El árabe va entero: partirlo en letras rompe las ligaduras. */}
                {lang === 'ar' ? w : <VariableProximity label={w} containerRef={ref} radius={190} falloff="gaussian"
                  fromFontVariationSettings="'wght' 900, 'wdth' 72" toFontVariationSettings="'wght' 420, 'wdth' 100" />}
              </GradientText>
            </span></span>{' '}</span>
          ))}
        </h1>
        <p className="ex-entradilla">{t.portada.sub}</p>
        <dl className="ex-cifras">
          {cifras.map((n, i) => (
            <div key={i}>
              <dt><Cuenta valor={n} lang={lang} /></dt>
              <dd>{t.portada.cifras[i]}</dd>
            </div>
          ))}
        </dl>
        <button type="button" className="ex-baja" onClick={onBaja}>{t.portada.baja} <span aria-hidden="true">↓</span></button>
      </div>
      <svg className="mv-cresta mv-cresta-atras" viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true"><path d={silueta('mt-hiei', true)} /></svg>
      <svg className="mv-cresta mv-cresta-delante" viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true"><path d={silueta('mt-kongo')} /></svg>
      <p className="ex-portada-coord" dir="ltr" aria-hidden="true">
        <span>{KANJI['mt-atago']}</span> {CIMA['mt-atago'].lat.toFixed(4)}° N · {CIMA['mt-atago'].lon.toFixed(4)}° E · {CIMA['mt-atago'].m} m
      </p>
      <Credito id="portada" t={t} />
    </section>
  )
}

/* ───────────── Travesía horizontal ───────────── */

const TXT: Record<Lengua, { kicker: string; titulo: string; sub: string; movil: string; mas: string }> = {
  es: { kicker: 'La travesía', titulo: 'Ocho cumbres, una detrás de otra', sub: 'Sigue bajando: la cordillera pasa de lado y el cielo cambia de color en cada cima.', movil: 'Desliza de lado: el cielo cambia de color en cada cima.', mas: 'Verla en 3D' },
  en: { kicker: 'The traverse', titulo: 'Eight summits, one after another', sub: 'Keep scrolling: the range slides past and the sky changes colour at every summit.', movil: 'Swipe sideways: the sky changes colour at every summit.', mas: 'See it in 3D' },
  ar: { kicker: 'الرحلة', titulo: 'ثماني قمم، واحدة تلو الأخرى', sub: 'واصل النزول: تمرّ السلسلة الجبلية جانبيًا ويتغيّر لون السماء عند كل قمة.', movil: 'اسحب جانبيًا: يتغيّر لون السماء عند كل قمة.', mas: 'شاهدها ثلاثية الأبعاد' },
  ru: { kicker: 'Траверс', titulo: 'Восемь вершин — одна за другой', sub: 'Листайте дальше: хребет проходит мимо, а небо меняет цвет на каждой вершине.', movil: 'Листайте вбок: небо меняет цвет на каждой вершине.', mas: 'Смотреть в 3D' },
}

// Un cielo por cumbre: bosque, cedro, lago, puerto, noche, sakura, río y estrellas.
const CIELOS: Record<MonteId, string[]> = {
  'mt-kongo': ['#0e2a1c', '#2f6b45', '#c9a24a', '#0b0d0a'],
  'mt-atago': ['#3a1d0b', '#b8541a', '#f0b33a', '#120c08'],
  'mt-hiei': ['#0b1e2e', '#2f6d8f', '#d8c48a', '#081018'],
  'mt-rokko': ['#10233a', '#3d7fb8', '#f2c46d', '#0a0f18'],
  'mt-maya': ['#120f2a', '#4b3a9a', '#ff9a5a', '#07060f'],
  'mt-yoshino': ['#2a0f1e', '#c25a86', '#ffd1e3', '#12070d'],
  'ponpon-mountain': ['#0f2a26', '#2a8f7a', '#e9d36b', '#08120f'],
  'hoshi-no-buranko': ['#060a1a', '#24306b', '#9fb8ff', '#03040a'],
}

export interface ParadaTravesia { id: MonteId; nombre: string; sub: string; altura: number; duracion: string; precio: string; pedir: string; wa: string }

/** Corte del terreno que se dibuja cuando su tarjeta llega al centro. */
function Linea({ id }: { id: MonteId }) {
  const d = PERFIL[id]
  const bajo = Math.min(...d), alto = Math.max(...d)
  const linea = d.map((v, i) => `${i ? 'L' : 'M'}${((i / (d.length - 1)) * 300).toFixed(1)} ${(66 - ((v - bajo) / (alto - bajo)) * 58).toFixed(1)}`).join('')
  return (
    <svg className="mv-linea" viewBox="0 0 300 70" preserveAspectRatio="none" aria-hidden="true">
      <path d={`${linea}L300 70L0 70Z`} className="mv-linea-area" />
      <path d={linea} className="mv-linea-trazo" pathLength={1} />
    </svg>
  )
}

export function Travesia({ lang, paradas, onVer3d }: { lang: Lengua; paradas: ParadaTravesia[]; onVer3d: (i: number) => void }) {
  const raiz = useRef<HTMLElement>(null)
  const pista = useRef<HTMLDivElement>(null)
  const [activa, setActiva] = useState(0)
  const tx = TXT[lang]

  useEffect(() => {
    const zona = raiz.current, carril = pista.current
    if (!zona || !carril || quieto()) return
    const mm = gsap.matchMedia()
    // En móvil se queda como carrusel de deslizar (nativo): fijar la sección marea con el dedo.
    mm.add('(min-width: 860px)', () => {
      const rtl = getComputedStyle(zona).direction === 'rtl'
      const distancia = () => carril.scrollWidth - window.innerWidth
      const mov = gsap.to(carril, {
        x: () => (rtl ? 1 : -1) * distancia(), ease: 'none',
        scrollTrigger: {
          trigger: zona, pin: true, scrub: 1, anticipatePin: 1, end: () => `+=${distancia()}`, invalidateOnRefresh: true,
          onUpdate: (s) => setActiva(Math.min(paradas.length - 1, Math.floor(s.progress * paradas.length))),
        },
      })
      // Cada foto se acerca y su corte se dibuja al cruzar la pantalla.
      gsap.utils.toArray<HTMLElement>('.mv-parada', carril).forEach((p) => {
        const anim = { containerAnimation: mov, trigger: p, start: rtl ? 'right right' : 'left right', end: rtl ? 'left left' : 'right left', scrub: true }
        gsap.fromTo(p.querySelector('.mv-parada-foto img'), { scale: 1.2, xPercent: rtl ? 6 : -6 }, { scale: 1, xPercent: rtl ? -6 : 6, ease: 'none', scrollTrigger: anim })
        gsap.fromTo(p.querySelector('.mv-linea-trazo'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { ...anim, end: rtl ? 'center center' : 'center center' } })
        gsap.from(p.querySelector('.mv-parada-kanji'), { yPercent: 40, opacity: 0, ease: 'none', scrollTrigger: { ...anim, end: 'center center' } })
      })
      return () => gsap.set(carril, { clearProps: 'transform' })
    })
    return () => mm.revert()
  }, [paradas.length])

  return (
    <section ref={raiz} className="mv-travesia" aria-labelledby="mv-travesia-titulo">
      <Perezoso className="mv-cielo" margen="400px">
        <MeshGradient style={{ width: '100%', height: '100%' }} colors={CIELOS[paradas[activa].id]} distortion={0.85} swirl={0.55} speed={0.25} minPixelRatio={1} maxPixelCount={960 * 540} />
      </Perezoso>
      <div className="mv-pista" ref={pista}>
        <header className="mv-travesia-intro">
          <p className="ex-kicker"><span className="ex-regla" aria-hidden="true" />{tx.kicker} <span lang="ja">縦走</span></p>
          <h2 id="mv-travesia-titulo">{tx.titulo}</h2>
          <p className="ex-entradilla"><span className="mv-solo-ancho">{tx.sub}</span><span className="mv-solo-movil">{tx.movil}</span></p>
          <span className="mv-flecha" aria-hidden="true">{lang === 'ar' ? '←' : '→'}</span>
        </header>
        {paradas.map((p, i) => (
          <article key={p.id} className="mv-parada">
            <div className="mv-parada-foto"><img src={foto(p.id, 800)} srcSet={`${foto(p.id, 800)} 800w, ${foto(p.id)} 1600w`} sizes="(min-width: 860px) 46vw, 86vw" alt="" loading="lazy" /></div>
            <span className="mv-parada-kanji" lang="ja" aria-hidden="true">{KANJI[p.id]}</span>
            <div className="mv-parada-texto">
              <p className="mv-parada-num"><span lang="ja">{NUMEROS[i]}</span> {String(i + 1).padStart(2, '0')} / {String(paradas.length).padStart(2, '0')}</p>
              <h3>{p.nombre}</h3>
              <p className="mv-parada-sub">{p.sub}</p>
              <p className="mv-parada-altura"><Contador valor={p.altura} formato={(v) => `${Math.round(v).toLocaleString(lang === 'ar' ? 'ar-EG' : lang)}`} /> <small>m</small></p>
              <Linea id={p.id} />
              <p className="mv-parada-datos"><span>{p.duracion}</span><span><bdi>{p.precio}</bdi></span></p>
              <div className="mv-parada-botones">
                <a className="v7-boton v7-boton-peq" href={p.wa} target="_blank" rel="noopener noreferrer">{p.pedir}</a>
                <button type="button" className="mv-3d" onClick={() => onVer3d(i)}>{tx.mas} ↓</button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <ol className="mv-progreso" aria-hidden="true">
        {paradas.map((p, i) => <li key={p.id} className={i === activa ? 'activa' : i < activa ? 'hecha' : ''}><span lang="ja">{KANJI[p.id]}</span></li>)}
      </ol>
    </section>
  )
}

/* ───────────── Sello de metal ───────────── */

export function SelloMetal() {
  // Paper Shaders solo acepta direcciones absolutas para la imagen.
  const [src, setSrc] = useState('')
  useEffect(() => setSrc(new URL('/v7/yama.svg', location.href).href), [])
  return (
    <Perezoso className="mv-metal">
      {src && <LiquidMetal style={{ width: '100%', height: '100%' }} image={src} colorBack="#00000000" colorTint="#ffd98a"
        repetition={3} softness={0.3} shiftRed={0.25} shiftBlue={0.2} distortion={0.1} contour={0.6} angle={70} speed={0.8} fit="contain" scale={0.8} minPixelRatio={1} maxPixelCount={500 * 500} />}
    </Perezoso>
  )
}

/* ───────────── Apariciones al bajar ───────────── */

const REVELA = [
  '.v7-montana main > section:not(.ex-portada):not(.mv-travesia):not(.v7-montes) :is(h2, .ex-kicker, .v7-entradilla)',
  '.cu-ficha', '.v7-montana-guia', '.ex-atlas-rejilla', '.ex-vuelo', '.ex-banda > *',
].join(', ')

/** Títulos y tarjetas suben y se destapan al entrar en pantalla, de una en una. */
export function useRevelados(raiz: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const zona = raiz.current
    if (!zona || quieto()) return
    const ctx = gsap.context(() => {
      const piezas = gsap.utils.toArray<HTMLElement>(REVELA, zona)
      gsap.set(piezas, { y: 70, opacity: 0, clipPath: 'inset(0 0 100% 0)' })
      ScrollTrigger.batch(piezas, {
        start: 'top 90%', once: true,
        onEnter: (lote) => gsap.to(lote, { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'expo.out', stagger: 0.09, clearProps: 'transform,clipPath' }),
      })
      // Las fotos que cargan tarde mueven la página: recalcular al terminar.
      window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
    }, zona)
    return () => ctx.revert()
  }, [raiz])
}

/* ───────────── Altímetro ───────────── */

const ALT_TXT: Record<Lengua, string> = { es: 'Altitud', en: 'Altitude', ar: 'الارتفاع', ru: 'Высота' }

/** Barra fija al lado: según bajas por la página, «subes» de 0 m a la cima más alta. */
export function Altimetro({ lang }: { lang: Lengua }) {
  const caja = useRef<HTMLDivElement>(null)
  const cifra = useRef<HTMLSpanElement>(null)
  const cima = Math.max(...MONTES.map((m) => CIMA[m].m))
  useEffect(() => {
    const el = caja.current
    if (!el || quieto()) return
    const fmt = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : lang)
    const marca = gsap.quickSetter(el, '--mv-alt')
    const st = ScrollTrigger.create({
      trigger: document.documentElement, start: 'top top', end: 'bottom bottom',
      onUpdate: (s) => {
        marca(s.progress.toFixed(4))
        // nodeValue y no textContent: cambiar el nodo de texto obligaba a recalcular los estilos de toda la página
        // (index.css usa html:has(#root .v7) y cada nodo nuevo lo vuelve a evaluar).
        const txt = cifra.current?.firstChild
        if (txt) txt.nodeValue = fmt.format(Math.round(s.progress * cima))
        el.classList.toggle('mv-alt-visible', s.scroll() > window.innerHeight * 0.6)
      },
    })
    return () => st.kill()
  }, [lang, cima])
  return (
    <div ref={caja} className="mv-altimetro" aria-hidden="true">
      <span className="mv-alt-et">{ALT_TXT[lang]}</span>
      <div className="mv-alt-carril">
        {Array.from({ length: 12 }, (_, i) => <i key={i} />)}
        <b className="mv-alt-marca"><span ref={cifra}>0</span> m</b>
      </div>
      <span className="mv-alt-cima" lang="ja">頂 <bdi>{cima}</bdi></span>
    </div>
  )
}

/* ───────────── Cinta de montañas ───────────── */

/** Dos filas de nombres que corren en sentidos opuestos y aceleran con la velocidad del scroll. */
export function CintaMontes({ nombres }: { nombres: string[] }) {
  const raiz = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const zona = raiz.current
    if (!zona || quieto()) return
    const filas = gsap.utils.toArray<HTMLElement>('.mv-cinta-fila', zona)
    const bucles = filas.map((f, i) => gsap.fromTo(f, { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: 38, ease: 'none', repeat: -1 }))
    // Un golpe de rueda acelera la cinta y luego vuelve sola a su ritmo, en el sentido del scroll.
    let empuje = 1, sentido = 1
    const st = ScrollTrigger.create({
      trigger: zona, start: 'top bottom', end: 'bottom top',
      onUpdate: (s) => {
        sentido = s.direction
        const v = gsap.utils.clamp(-7, 7, s.getVelocity() / 220)
        if (Math.abs(v) > Math.abs(empuje)) empuje = v
      },
    })
    const tic = () => { empuje += (sentido - empuje) * 0.05; bucles.forEach((b) => b.timeScale(empuje)) }
    gsap.ticker.add(tic)
    return () => { st.kill(); gsap.ticker.remove(tic); bucles.forEach((b) => b.kill()) }
  }, [])
  const tira = (k: number) => nombres.map((n, i) => <span key={`${k}-${i}`}>{n}<em aria-hidden="true">✦</em></span>)
  return (
    <div ref={raiz} className="mv-cinta" dir="ltr" aria-hidden="true">
      <div className="mv-cinta-fila">{tira(0)}{tira(1)}</div>
      <div className="mv-cinta-fila mv-cinta-hueca">{tira(2)}{tira(3)}</div>
    </div>
  )
}

/* ───────────── Pila de tarjetas ───────────── */

/** Las tarjetas de `.v7-oficio` se quedan pegadas arriba y la anterior se hunde al llegar la siguiente. */
export function usePila(raiz: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const zona = raiz.current
    if (!zona || quieto()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 860px)', () => {
      const tarjetas = gsap.utils.toArray<HTMLElement>('.v7-oficio > li', zona)
      tarjetas.slice(0, -1).forEach((t, i) => {
        gsap.to(t, {
          scale: 0.9, transformOrigin: '50% 0%', ease: 'none',
          scrollTrigger: { trigger: tarjetas[i + 1], start: 'top bottom', end: 'top 25%', scrub: true },
        })
      })
    })
    return () => mm.revert()
  }, [raiz])
}
