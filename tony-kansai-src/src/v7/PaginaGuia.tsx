// Página de un idioma: un público, un guía, todo en una sola página.
// Orden pensado para quien llega sin saber nada: qué es → cómo funciona →
// quién → dónde → cuánto → de dónde vienes → preguntas → escribir.

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Globo } from './Globo'
import { PAGINAS, HERMANAS, GUIAS, NOMBRE_GUIA, CREDITOS, CORREO } from './contenido'
import type { PaginaId, Pagina, DatosContacto } from './contenido'
import { useLanguage } from '../contexts/LanguageContext'
import { cargaFuenteArabe } from '../lib/arabicFont'
import './v7.css'

const BASE = 'https://tonykansaiguide.com'

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

// ── Utilidades ───────────────────────────────────────────────────────────────

function enlaceWa(numero: string, texto: string) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
}

const VACIO: DatosContacto = { nombre: '', pais: '', ciudad: '', fechas: '', personas: '', hotel: '', intereses: [], notas: '' }

/** Tipos de cambio del día (open.er-api.com: gratis, sin clave, CORS abierto).
 *  Si falla, no se enseña nada: el precio en yenes es el que vale. */
function useCambio(divisas: string[]) {
  const [tasas, setTasas] = useState<Record<string, number> | null>(null)
  useEffect(() => {
    const CLAVE = 'v7-cambio-jpy'
    try {
      const guardado = JSON.parse(sessionStorage.getItem(CLAVE) || 'null')
      if (guardado?.rates) { setTasas(guardado.rates); return }
    } catch { /* almacenamiento bloqueado */ }
    const ctrl = new AbortController()
    fetch('https://open.er-api.com/v6/latest/JPY', { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => {
        if (d?.result !== 'success') return
        setTasas(d.rates)
        try { sessionStorage.setItem(CLAVE, JSON.stringify({ rates: d.rates })) } catch { /* nada */ }
      })
      .catch(() => { /* sin cambio: se queda sólo en yenes */ })
    return () => ctrl.abort()
  }, [])
  return tasas ? divisas.filter((d) => tasas[d]).map((d) => ({ divisa: d, tasa: tasas[d] })) : []
}

function useAhora(cadaMs = 20000) {
  const [ahora, setAhora] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setAhora(new Date()), cadaMs)
    return () => window.clearInterval(id)
  }, [cadaMs])
  return ahora
}

interface Resena { id: string; stars: number; name: string; country: string; tour: string; text: string; photo?: string; date: string }

function useResenas(activas: boolean) {
  const [lista, setLista] = useState<Resena[]>([])
  useEffect(() => {
    if (!activas) return
    fetch('/reviews.json').then((r) => r.json()).then((d) => setLista(d.reviews ?? [])).catch(() => setLista([]))
  }, [activas])
  return lista
}

// ── Piezas ───────────────────────────────────────────────────────────────────

function Cabecera({ p }: { p: Pagina }) {
  const g = GUIAS[p.guia]
  const msg = p.contacto.plantilla(VACIO)
  return (
    <header className="v7-cabecera cristal">
      <Link to="/" className="v7-marca" aria-label="Tony Kansai Guide">
        <img src="/logo-square.svg" alt="" width={24} height={24} />
        <span>Tony Kansai Guide</span>
      </Link>
      <nav className="v7-anclas" aria-label={p.nav.idioma}>
        <a href="#como">{p.nav.como}</a>
        <a href="#zona">{p.nav.zona}</a>
        <a href="#precios">{p.nav.precios}</a>
      </nav>
      <nav className="v7-idiomas" aria-label={p.nav.idioma}>
        {HERMANAS[p.guia].map((h) => (
          <Link key={h.id} to={PAGINAS[h.id].ruta} lang={PAGINAS[h.id].lang} aria-current={h.id === p.id ? 'page' : undefined}>
            {h.etiqueta}
          </Link>
        ))}
      </nav>
      <a className="v7-boton v7-boton-peq" href={enlaceWa(g.wa, msg)} target="_blank" rel="noopener noreferrer">
        <IconoWa /> <span className="v7-solo-ancho">{p.nav.contacto}</span>
      </a>
    </header>
  )
}

function IconoWa() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.6 11.6 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  )
}

function Relojes({ p }: { p: Pagina }) {
  const ahora = useAhora()
  const hora = (tz?: string) => {
    try {
      return new Intl.DateTimeFormat(p.lang === 'ar' ? 'ar-u-nu-latn' : p.lang, { hour: '2-digit', minute: '2-digit', timeZone: tz }).format(ahora)
    } catch { return '' }
  }
  const tzVisitante = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone } catch { return '' } })()
  const yaEsta = p.mercado.relojes.some((r) => r.tz === tzVisitante)
  return (
    <ul className="v7-relojes">
      {p.mercado.relojes.map((r) => (
        <li key={r.tz}><span className="v7-reloj-hora">{hora(r.tz)}</span><span className="v7-reloj-sitio">{r.ciudad}</span></li>
      ))}
      {!yaEsta && tzVisitante && (
        <li className="tuyo"><span className="v7-reloj-hora">{hora()}</span><span className="v7-reloj-sitio">{p.mercado.tuHora}</span></li>
      )}
    </ul>
  )
}

function Precios({ p }: { p: Pagina }) {
  const cambios = useCambio(p.mercado.divisas)
  const fmt = (n: number, divisa: string) => {
    try {
      return new Intl.NumberFormat(p.lang === 'ar' ? 'ar-u-nu-latn' : p.lang, { style: 'currency', currency: divisa, maximumFractionDigits: 0 }).format(n)
    } catch { return `${Math.round(n)} ${divisa}` }
  }
  return (
    <>
      <div className="v7-planes">
        {p.precios.planes.map((plan) => (
          <article key={plan.nombre} className="v7-plan tarjeta">
            <h3>{plan.nombre}</h3>
            <p className="v7-plan-detalle">{plan.detalle}</p>
            <p className="v7-plan-precio">{plan.desde && <span className="v7-plan-desde">{p.precios.desde} </span>}<bdi>{plan.precio}</bdi></p>
            <p className="v7-plan-grupo">{p.precios.porGrupo}</p>
            {cambios.length > 0 && (
              <p className="v7-plan-aprox">
                ≈ {cambios.map((c) => fmt(plan.yenes * c.tasa, c.divisa)).join(' · ')}{plan.desde ? '+' : ''}
              </p>
            )}
          </article>
        ))}
      </div>
      <ul className="v7-notas">
        {p.precios.notas.map((n) => <li key={n}>{n}</li>)}
      </ul>
      {cambios.length > 0 && (
        <p className="v7-fuente-cambio">
          ≈ {p.precios.aprox} · <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer">Rates by Exchange Rate API</a>
        </p>
      )}
    </>
  )
}

function Contacto({ p }: { p: Pagina }) {
  const [d, setD] = useState<DatosContacto>(VACIO)
  const g = GUIAS[p.guia]
  const msg = useMemo(() => p.contacto.plantilla(d), [d, p])
  const cambia = (k: keyof DatosContacto) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setD((x) => ({ ...x, [k]: e.target.value }))
  const alterna = (i: string) => setD((x) => ({ ...x, intereses: x.intereses.includes(i) ? x.intereses.filter((y) => y !== i) : [...x.intereses, i] }))
  // De dónde viene la gente es lo que más necesitamos saber: va en el mensaje
  // y, si el visitante aceptó las cookies, también a Analytics.
  const avisaAnalytics = (canal: string) => window.gtag?.('event', 'generate_lead', { pagina: p.id, pais: d.pais || 'sin_decir', canal })

  return (
    <div className="v7-contacto">
      <form className="v7-formulario tarjeta" onSubmit={(e) => { e.preventDefault(); avisaAnalytics('whatsapp'); window.open(enlaceWa(g.wa, msg), '_blank', 'noopener') }}>
        <div className="v7-campos">
          <label><span>{p.contacto.nombre}</span><input value={d.nombre} onChange={cambia('nombre')} autoComplete="name" /></label>
          <label><span>{p.contacto.pais}</span>
            <select value={d.pais} onChange={cambia('pais')}>
              <option value="">—</option>
              {p.contacto.paises.map((x) => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label><span>{p.contacto.ciudad}</span><input value={d.ciudad} onChange={cambia('ciudad')} autoComplete="address-level2" /></label>
          <label><span>{p.contacto.fechas}</span><input value={d.fechas} onChange={cambia('fechas')} placeholder="12–14 / 04" /></label>
          <label><span>{p.contacto.personas}</span>
            <select value={d.personas} onChange={cambia('personas')}>
              <option value="">—</option>
              {['1', '2', '3', '4', '5', '6', '7+'].map((x) => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label><span>{p.contacto.hotel}</span><input value={d.hotel} onChange={cambia('hotel')} /></label>
        </div>
        <fieldset className="v7-intereses">
          <legend>{p.contacto.intereses}</legend>
          {p.contacto.opcionesIntereses.map((i) => (
            <button type="button" key={i} aria-pressed={d.intereses.includes(i)} onClick={() => alterna(i)}>{i}</button>
          ))}
        </fieldset>
        <label className="v7-ancho"><span>{p.contacto.notas}</span><textarea rows={2} value={d.notas} onChange={cambia('notas')} /></label>
        <div className="v7-acciones">
          <button type="submit" className="v7-boton"><IconoWa /> {p.contacto.wa}</button>
          <a className="v7-boton v7-boton-sec" href={`mailto:${CORREO}?subject=${encodeURIComponent(p.contacto.asuntoMail)}&body=${encodeURIComponent(msg)}`} onClick={() => avisaAnalytics('email')}>
            {p.contacto.mail}
          </a>
        </div>
        <p className="v7-aviso">{p.contacto.aviso}</p>
      </form>
      <aside className="v7-vista tarjeta" aria-live="polite">
        <h3>{p.contacto.vista}</h3>
        <pre>{msg}</pre>
      </aside>
    </div>
  )
}

// ── Página ───────────────────────────────────────────────────────────────────

export default function PaginaGuia({ id }: { id: PaginaId }) {
  const p = PAGINAS[id]
  const g = GUIAS[p.guia]
  const { setLang } = useLanguage()
  const resenas = useResenas(!!p.resenas)
  const [zonaLista, setZonaLista] = useState(false)

  useEffect(() => {
    // Las páginas legales siguen usando el contexto de idioma: que coincida.
    setLang(p.lang)
    if (p.lang === 'ar') cargaFuenteArabe()
  }, [p.lang, setLang])

  const hermanas = HERMANAS[p.guia]
  const msgCorto = p.contacto.plantilla(VACIO)
  const centroZona = p.guia === 'larion' ? { lat: 34.62, lon: 134.15, dist: 1.155 } : { lat: 34.82, lon: 135.42, dist: 1.1 }

  return (
    <div className={`v7 v7-pagina lang-${p.lang}`} lang={p.lang} dir={p.dir}>
      <Helmet>
        <html lang={p.lang} dir={p.dir} />
        <title>{p.seo.titulo}</title>
        <meta name="description" content={p.seo.descripcion} />
        <link rel="canonical" href={`${BASE}${p.ruta}`} />
        {hermanas.map((h) => <link key={h.id} rel="alternate" hrefLang={PAGINAS[h.id].lang} href={`${BASE}${PAGINAS[h.id].ruta}`} />)}
        <link rel="alternate" hrefLang="x-default" href={`${BASE}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={p.seo.titulo} />
        <meta property="og:description" content={p.seo.descripcion} />
        <meta property="og:url" content={`${BASE}${p.ruta}`} />
        <meta property="og:image" content={`${BASE}${p.hero.foto}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#f5f5f7" />
      </Helmet>

      <a className="v7-saltar" href="#contacto">{p.nav.contacto}</a>
      <Cabecera p={p} />

      <main>
        {/* Portada de la página */}
        <section className="v7-hero">
          <img className="v7-hero-foto" src={p.hero.foto} alt="" fetchPriority="high" />
          <div className="v7-hero-velo" />
          <div className="v7-hero-texto">
            <h1>{p.hero.titulo}</h1>
            <p>{p.hero.sub}</p>
            <ul className="v7-chips">{p.hero.chips.map((c) => <li key={c} className="cristal">{c}</li>)}</ul>
            <div className="v7-acciones">
              <a className="v7-boton" href={enlaceWa(g.wa, msgCorto)} target="_blank" rel="noopener noreferrer"><IconoWa /> {p.hero.cta}</a>
              <a className="v7-boton v7-boton-cristal cristal" href="#contacto">{p.hero.cta2}</a>
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section id="como" className="v7-seccion">
          <h2>{p.como.titulo}</h2>
          <ol className="v7-pasos">
            {p.como.pasos.map((s, i) => (
              <li key={s.t} className="tarjeta">
                <span className="v7-paso-num" aria-hidden="true">{i + 1}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="v7-no tarjeta">
            <h3>{p.como.noTitulo}</h3>
            <ul>{p.como.no.map((n) => <li key={n}>{n}</li>)}</ul>
          </div>
        </section>

        {/* El guía */}
        <section className="v7-seccion v7-guia">
          <img src={g.foto} alt={NOMBRE_GUIA[p.id]} width={320} height={340} loading="lazy" />
          <div>
            <p className="v7-antetitulo">{p.guiaTxt.titulo}</p>
            <h2>{NOMBRE_GUIA[p.id]}</h2>
            <p className="v7-idiomas-guia">{p.guiaTxt.idiomas}</p>
            {p.guiaTxt.bio.map((b) => <p key={b}>{b}</p>)}
            {p.guiaTxt.otro && (
              <p className="v7-otro-guia">{p.guiaTxt.otro.texto} <Link to={p.guiaTxt.otro.ruta}>{p.guiaTxt.otro.enlace} →</Link></p>
            )}
          </div>
        </section>

        {/* Zona, con el globo */}
        <section id="zona" className="v7-seccion v7-zona">
          <div className="v7-zona-texto">
            <h2>{p.zona.titulo}</h2>
            <p>{p.zona.sub}</p>
            <ul className={`v7-lugares ${zonaLista ? 'listo' : ''}`}>
              {p.zona.lugares.map((l) => <li key={l.nombre}>{l.nombre}</li>)}
            </ul>
          </div>
          <Globo
            className="v7-globo-zona"
            lugares={p.zona.lugares}
            origenes={p.zona.origenes}
            inicio={p.zona.origenes[0] ? { lat: p.zona.origenes[0].lat, lon: p.zona.origenes[0].lon } : undefined}
            final={centroZona}
            duracion={6000}
            alTerminar={() => setZonaLista(true)}
            etiquetaAria={`${p.zona.titulo}: ${p.zona.lugares.map((l) => l.nombre).join(', ')}`}
          />
        </section>

        {/* Ideas */}
        <section className="v7-seccion">
          <h2>{p.ideas.titulo}</h2>
          <p className="v7-entradilla">{p.ideas.sub}</p>
          <div className="v7-ideas">
            {p.ideas.tarjetas.map((t) => (
              <article key={t.titulo} className="v7-idea">
                <img src={t.foto} alt="" loading="lazy" />
                <div className="v7-idea-texto">
                  <h3>{t.titulo}</h3>
                  <p>{t.texto}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Precios */}
        <section id="precios" className="v7-seccion">
          <h2>{p.precios.titulo}</h2>
          <Precios p={p} />
        </section>

        {/* El mercado: husos, divisas y lo que le importa a ese público */}
        <section className="v7-seccion v7-mercado tarjeta">
          <div>
            <h2>{p.mercado.titulo}</h2>
            {p.mercado.texto.map((t) => <p key={t}>{t}</p>)}
          </div>
          <Relojes p={p} />
        </section>

        {/* Reseñas reales (de reviews.json; las publica resenas.py) */}
        {p.resenas && resenas.length > 0 && (
          <section className="v7-seccion">
            <h2>{p.resenas.titulo}</h2>
            {p.resenas.nota && <p className="v7-entradilla">{p.resenas.nota}</p>}
            <div className="v7-resenas">
              {resenas.map((r) => (
                <figure key={r.id} className="tarjeta" lang="es" dir="ltr">
                  <div className="v7-estrellas" aria-label={`${r.stars}/5`}>{'★'.repeat(r.stars)}</div>
                  <blockquote>{r.text}</blockquote>
                  <figcaption>{r.name} · {r.country} · {r.tour}</figcaption>
                  {r.photo && <img src={`/${r.photo}`} alt="" loading="lazy" />}
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Preguntas */}
        <section className="v7-seccion">
          <h2>{p.faq.titulo}</h2>
          <div className="v7-faq">
            {p.faq.items.map((f) => (
              <details key={f.q} className="tarjeta">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Contacto */}
        <section id="contacto" className="v7-seccion">
          <h2>{p.contacto.titulo}</h2>
          <p className="v7-entradilla">{p.contacto.sub}</p>
          <Contacto p={p} />
        </section>
      </main>

      <footer className="v7-pie">
        <div className="v7-pie-fila">
          <div>
            <strong>Tony Kansai Guide</strong>
            <p>{p.pie.lema}</p>
            <p><a href={`mailto:${CORREO}`}>{CORREO}</a></p>
          </div>
          <nav aria-label={p.pie.legal}>
            <Link to={`/legal?lang=${p.lang}`}>{p.pie.legal}</Link>
            <Link to={`/privacy?lang=${p.lang}`}>{p.pie.privacidad}</Link>
            <Link to={`/terms?lang=${p.lang}`}>{p.pie.condiciones}</Link>
            <Link to={`/cookies?lang=${p.lang}`}>{p.pie.cookies}</Link>
          </nav>
          <nav aria-label={p.pie.otrosIdiomas}>
            <span className="v7-pie-titulo">{p.pie.otrosIdiomas}</span>
            {(Object.keys(PAGINAS) as PaginaId[]).filter((k) => k !== p.id).map((k) => (
              <Link key={k} to={PAGINAS[k].ruta} lang={PAGINAS[k].lang}>
                {k === 'larion' ? 'English · Larion' : HERMANAS[PAGINAS[k].guia].find((h) => h.id === k)?.etiqueta}
              </Link>
            ))}
          </nav>
        </div>
        <details className="v7-creditos">
          <summary>{p.pie.creditos}</summary>
          <ul lang="es" dir="ltr">
            {CREDITOS.map((c) => (
              <li key={c.url}>{c.foto}: <a href={c.url} target="_blank" rel="noopener noreferrer">{c.autor}</a>, {c.licencia}</li>
            ))}
          </ul>
        </details>
      </footer>
    </div>
  )
}
