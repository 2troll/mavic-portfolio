// Piezas de la página de montaña en clave de revista de naturaleza (ver datosExpedicion.ts):
// portada con foto a sangre, atlas interactivo y los gráficos de cada ficha.
// Animaciones con framer-motion (la librería ya compartida del sitio), nunca a mano.

import { useEffect, useRef, useState } from 'react'
import { LazyMotion, domMax, m as motion, AnimatePresence, animate, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { MONTES, KANJI, CIMA } from './datosMontana'
import type { MonteId } from './datosMontana'
import { MAPA, PERFIL, CREDITOS, CIUDADES, MESES, NIVEL, proyecta } from './datosExpedicion'
import type { TextosExpedicion, Lengua } from './datosExpedicion'
import { Vuelo3d } from './Vuelo3d'
import { CUMBRES } from './datosCumbres'
import { CimaAhora } from './CimaAhora'
import { CapaEstacion, SelectorEstacion } from './Estaciones'

const foto = (id: MonteId | 'portada', ancho: 800 | 1600 = 1600) => `/v7/expedicion/${id}${ancho === 800 ? '-800' : ''}.webp`

/** Número que cuenta hasta su valor cuando entra en pantalla. */
function Cuenta({ valor, lang }: { valor: number; lang: Lengua }) {
  const ref = useRef<HTMLSpanElement>(null)
  const visto = useInView(ref, { once: true })
  const quieto = useReducedMotion()
  const fmt = (n: number) => Math.round(n).toLocaleString(lang === 'ar' ? 'ar-EG' : lang)
  useEffect(() => {
    if (!visto || !ref.current) return
    if (quieto) { ref.current.textContent = fmt(valor); return }
    const c = animate(0, valor, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => { if (ref.current) ref.current.textContent = fmt(v) } })
    return () => c.stop()
  }, [visto, valor, quieto]) // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref}>{fmt(quieto ? valor : 0)}</span>
}

function Credito({ id, t }: { id: MonteId | 'portada'; t: TextosExpedicion }) {
  const c = CREDITOS[id]
  return (
    <a className="ex-credito" href={c.pagina} target="_blank" rel="noopener noreferrer" lang="en" dir="ltr">
      {t.foto}: {c.autor} · {c.licencia}
    </a>
  )
}

export function Portada({ t, lang, maxGrupo, onBaja }: { t: TextosExpedicion; lang: Lengua; maxGrupo: number; onBaja: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const opacidad = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  // Las 8 del relieve más las 10 de nivel pro; cima y prefecturas de las dos listas.
  const prefecturas = new Set([...CUMBRES.map((c) => c.prefectura.en), 'Osaka', 'Kyoto', 'Hyōgo', 'Nara'])
  const cifras = [MONTES.length + CUMBRES.length, Math.max(...MONTES.map((m) => CIMA[m].m), ...CUMBRES.map((c) => c.cima ?? 0)), prefecturas.size, maxGrupo]
  return (
    <LazyMotion features={domMax} strict>
      <section ref={ref} className="ex-portada" aria-labelledby="ex-titulo">
        <motion.div className="ex-portada-foto" style={{ y }}>
          <img src={foto('portada')} srcSet={`${foto('portada', 800)} 800w, ${foto('portada')} 1920w`} sizes="100vw" alt={t.portada.foto} fetchPriority="high" />
        </motion.div>
        <div className="ex-portada-velo" aria-hidden="true" />
        <CapaEstacion />
        <SelectorEstacion lang={lang} />
        <motion.div className="ex-portada-texto" style={{ opacity: opacidad }}>
          <motion.p className="ex-kicker" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <span className="ex-regla" aria-hidden="true" />{t.cabecera} <span lang="ja">関西の山</span>
          </motion.p>
          <motion.h1 id="ex-titulo" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            {t.portada.titulo}
          </motion.h1>
          <motion.p className="ex-entradilla" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.8 }}>
            {t.portada.sub}
          </motion.p>
          <dl className="ex-cifras">
            {cifras.map((n, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 + i * 0.1 }}>
                <dt><Cuenta valor={n} lang={lang} /></dt>
                <dd>{t.portada.cifras[i]}</dd>
              </motion.div>
            ))}
          </dl>
          <button type="button" className="ex-baja" onClick={onBaja}>{t.portada.baja} <span aria-hidden="true">↓</span></button>
        </motion.div>
        {/* Coordenadas de la cima de la foto (Atago), como pie de foto de expedición. */}
        <p className="ex-portada-coord" dir="ltr" aria-hidden="true">
          <span>{KANJI['mt-atago']}</span> {CIMA['mt-atago'].lat.toFixed(4)}° N · {CIMA['mt-atago'].lon.toFixed(4)}° E · {CIMA['mt-atago'].m} m
        </p>
        <Credito id="portada" t={t} />
      </section>
    </LazyMotion>
  )
}

/** Corte real del terreno: área bajo el perfil, cima marcada. */
export function Corte({ id, etiqueta, compacto = false }: { id: MonteId; etiqueta: string; compacto?: boolean }) {
  const datos = PERFIL[id]
  const A = 300, H = compacto ? 54 : 90
  const bajo = Math.min(...datos) - 30, alto = Math.max(...datos, CIMA[id].m)
  const xy = datos.map((v, i) => [(i / (datos.length - 1)) * A, H - ((v - bajo) / (alto - bajo)) * (H - 10)] as const)
  const linea = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('')
  const cima = xy.reduce((a, b) => (b[1] < a[1] ? b : a))
  return (
    <figure className="ex-corte">
      <svg viewBox={`0 0 ${A} ${H}`} preserveAspectRatio="none" role="img" aria-label={`${etiqueta}: ${Math.round(Math.min(...datos))}–${Math.round(Math.max(...datos))} m`}>
        <path d={`${linea}L${A} ${H}L0 ${H}Z`} className="ex-corte-area" />
        <path d={linea} className="ex-corte-linea" vectorEffect="non-scaling-stroke" />
        <line x1={cima[0]} x2={cima[0]} y1={cima[1]} y2={H} className="ex-corte-cima" vectorEffect="non-scaling-stroke" />
      </svg>
      <figcaption>{etiqueta}</figcaption>
    </figure>
  )
}

export function Medidor({ id, etiqueta, grado }: { id: MonteId; etiqueta: string; grado: string }) {
  return (
    <div className="ex-medidor" role="img" aria-label={`${etiqueta}: ${NIVEL[id]} / 5 · ${grado}`}>
      <span className="ex-medidor-et">{etiqueta}</span>
      <span className="ex-medidor-barras" aria-hidden="true">{[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= NIVEL[id] ? 'si' : ''} />)}</span>
      <span className="ex-medidor-grado">{grado}</span>
    </div>
  )
}

const mesesCortos = (lang: Lengua) => Array.from({ length: 12 }, (_, i) => new Intl.DateTimeFormat(lang, { month: 'short' }).format(new Date(2026, i, 15)))

export function Meses({ id, lang, etiqueta }: { id: MonteId; lang: Lengua; etiqueta: string }) {
  const nombres = mesesCortos(lang)
  const buenos = MESES[id]
  return (
    <div className="ex-meses" role="img" aria-label={`${etiqueta}: ${buenos.map((m) => nombres[m - 1]).join(', ')}`}>
      <span className="ex-medidor-et">{etiqueta}</span>
      <span className="ex-meses-tira" aria-hidden="true">
        {nombres.map((n, i) => <i key={n} className={buenos.includes(i + 1) ? 'si' : ''} title={n}>{lang === 'ar' ? i + 1 : n.slice(0, 1)}</i>)}
      </span>
    </div>
  )
}

interface PropsAtlas {
  t: TextosExpedicion
  lang: Lengua
  nombre: (m: MonteId) => string
  sub: (m: MonteId) => string
  grado: (m: MonteId) => string
  precio: (m: MonteId) => string
  wa: (m: MonteId) => string
  onVer3d: (i: number) => void
}

export function Atlas({ t, lang, nombre, sub, grado, precio, wa, onVer3d }: PropsAtlas) {
  const [sel, setSel] = useState<MonteId>('mt-kongo')
  const quieto = useReducedMotion()
  const maxM = Math.max(...MONTES.map((m) => CIMA[m].m))
  const porAltura = [...MONTES].sort((a, b) => CIMA[b].m - CIMA[a].m)
  const i = MONTES.indexOf(sel)
  const [sx, sy] = proyecta(CIMA[sel].lon, CIMA[sel].lat)
  const nombres = mesesCortos(lang)

  return (
    <LazyMotion features={domMax} strict>
      <section id="atlas" className="ex-atlas" aria-labelledby="ex-atlas-t">
        <header className="ex-atlas-cab">
          <p className="ex-kicker"><span className="ex-regla" aria-hidden="true" />{t.atlas.kicker}</p>
          <h2 id="ex-atlas-t">{t.atlas.titulo}</h2>
          <p className="ex-entradilla">{t.atlas.sub}</p>
        </header>

        <div className="ex-atlas-rejilla">
          {/* Mapa: costa real y las ocho cimas en sus coordenadas. */}
          <figure className="ex-mapa">
            <svg viewBox={`0 0 ${MAPA.ancho} ${MAPA.alto}`} role="group" aria-label={t.atlas.titulo}>
              <defs>
                <pattern id="ex-reticula" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M100 0H0V100" className="ex-mapa-reticula" /></pattern>
                <clipPath id="ex-caja"><rect width={MAPA.ancho} height={MAPA.alto} /></clipPath>
              </defs>
              <rect width={MAPA.ancho} height={MAPA.alto} className="ex-mapa-mar" />
              <g clipPath="url(#ex-caja)">
                <path d={MAPA.tierra} className="ex-mapa-tierra" />
                <path d={MAPA.lago} className="ex-mapa-mar" />
                <rect width={MAPA.ancho} height={MAPA.alto} fill="url(#ex-reticula)" />
              </g>
              {CIUDADES.map((c) => {
                const [x, y] = proyecta(c.lon, c.lat)
                return (
                  <g key={c.id} className="ex-mapa-ciudad" transform={`translate(${x} ${y})`}>
                    <rect x="-6" y="-6" width="12" height="12" />
                    <text x={c.id === 'kobe' ? -14 : 14} y={c.id === 'kobe' ? 26 : 6} textAnchor={c.id === 'kobe' ? 'end' : 'start'}>{t.ciudades[c.id]}</text>
                  </g>
                )
              })}
              {/* Hilo de la cima elegida a los bordes: el «punto de mira» del atlas. */}
              <g className="ex-mapa-mira" style={{ transform: `translate(${sx}px, ${sy}px)` }} aria-hidden="true">
                <line x1={-2000} x2={2000} y1={0} y2={0} /><line x1={0} x2={0} y1={-2000} y2={2000} />
                <circle r="34" />
              </g>
              {MONTES.map((m) => {
                const [x, y] = proyecta(CIMA[m].lon, CIMA[m].lat)
                const activo = m === sel
                return (
                  <g key={m} className={`ex-mapa-cima${activo ? ' activo' : ''}`} transform={`translate(${x} ${y})`}
                    role="button" tabIndex={0} aria-pressed={activo} aria-label={`${nombre(m)} ${CIMA[m].m} m`}
                    onClick={() => setSel(m)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(m) } }}>
                    <circle r="26" className="ex-mapa-toque" />
                    <path d="M0 -18L15 9H-15Z" />
                    <text y="34" textAnchor="middle">{CIMA[m].m}</text>
                  </g>
                )
              })}
            </svg>
            <figcaption>{t.atlas.mapaNota}</figcaption>
          </figure>

          {/* Panel de la cima elegida. */}
          <div className="ex-panel" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.article key={sel} className="ex-panel-ficha"
                initial={quieto ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={quieto ? undefined : { opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
                <div className="ex-panel-foto">
                  <img src={foto(sel, 800)} srcSet={`${foto(sel, 800)} 800w, ${foto(sel)} 1600w`} sizes="(min-width: 900px) 40vw, 100vw" alt={nombre(sel)} loading="lazy" />
                  <span className="ex-panel-num" lang="ja">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <Credito id={sel} t={t} />
                <h3><span lang="ja">{KANJI[sel]}</span>{nombre(sel)}</h3>
                <p className="ex-panel-sub">{sub(sel)}</p>
                <p className="ex-panel-altura"><bdi dir="ltr">{CIMA[sel].m.toLocaleString(lang === 'ar' ? 'ar-EG' : lang)} m</bdi> · <bdi dir="ltr">{CIMA[sel].lat.toFixed(3)}° N {CIMA[sel].lon.toFixed(3)}° E</bdi></p>
                <Corte id={sel} etiqueta={t.ficha.corte} />
                <div className="ex-panel-indicadores">
                  <Medidor id={sel} etiqueta={t.ficha.exigencia} grado={grado(sel)} />
                  <Meses id={sel} lang={lang} etiqueta={t.ficha.meses} />
                </div>
                <div className="ex-panel-acciones">
                  <strong className="ex-panel-precio"><bdi>{precio(sel)}</bdi></strong>
                  <button type="button" className="ex-boton-linea" onClick={() => onVer3d(i)}>{t.atlas.ver3d}</button>
                  <a className="ex-boton" href={wa(sel)} target="_blank" rel="noopener noreferrer"
                    onClick={() => window.gtag?.('event', 'generate_lead', { ruta: sel, canal: 'whatsapp_atlas' })}>{t.atlas.pide}</a>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        {/* Vuelo 3D sobre la cima elegida, con el tiempo de arriba encima. */}
        <div className="ex-vuelo-bloque">
          <header className="ex-atlas-cab">
            <p className="ex-kicker"><span className="ex-regla" aria-hidden="true" />{t.vuelo.kicker} · {nombre(sel)}</p>
            <h2>{t.vuelo.titulo}</h2>
            <p className="ex-entradilla">{t.vuelo.sub}</p>
          </header>
          <div className="ex-vuelo-rejilla">
            <Vuelo3d monte={sel} etiqueta={`${t.vuelo.kicker}: ${nombre(sel)}`} textos={t.vuelo} />
            <CimaAhora monte={sel} lang={lang} />
          </div>
          <div className="ex-vuelo-selector" role="group" aria-label={t.atlas.titulo}>
            {MONTES.map((m) => <button key={m} type="button" aria-pressed={m === sel} className={m === sel ? 'activo' : ''} onClick={() => setSel(m)}>{nombre(m)}</button>)}
          </div>
        </div>

        {/* Infografía: las cimas ordenadas por altura, como siluetas a escala. */}
        <div className="ex-graficos">
          <figure className="ex-alturas">
            <figcaption className="ex-medidor-et">{t.atlas.alturas}</figcaption>
            <ol>
              {porAltura.map((m, k) => (
                <li key={m}>
                  <button type="button" className={m === sel ? 'activo' : ''} aria-pressed={m === sel} onClick={() => setSel(m)}>
                    <motion.span className="ex-silueta" style={{ height: `${(CIMA[m].m / maxM) * 100}%` }}
                      initial={quieto ? false : { scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }}
                      transition={{ delay: k * 0.07, type: 'spring', stiffness: 90, damping: 16 }} />
                    <span className="ex-alturas-m"><bdi dir="ltr">{CIMA[m].m}</bdi></span>
                    <span className="ex-alturas-n">{nombre(m)}</span>
                  </button>
                </li>
              ))}
            </ol>
          </figure>

          <figure className="ex-calendario">
            <figcaption className="ex-medidor-et">{t.atlas.calendario}</figcaption>
            <table>
              <thead><tr><th scope="col" /> {nombres.map((n, k) => <th key={n} scope="col" title={n}>{lang === 'ar' ? k + 1 : n.slice(0, 1)}</th>)}</tr></thead>
              <tbody>
                {MONTES.map((m) => (
                  <tr key={m} className={m === sel ? 'activo' : ''} onClick={() => setSel(m)}>
                    <th scope="row">{nombre(m)}</th>
                    {nombres.map((n, k) => <td key={n} className={MESES[m].includes(k + 1) ? 'si' : ''} aria-label={MESES[m].includes(k + 1) ? n : undefined} />)}
                  </tr>
                ))}
              </tbody>
            </table>
          </figure>
        </div>
      </section>
    </LazyMotion>
  )
}
