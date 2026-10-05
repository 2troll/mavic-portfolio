// Página de montaña (una por idioma): /es/montana/, /en/hiking/, /ar/hiking/, /ru/hiking/.

import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { HIKING_ROUTES } from '../lib/data'
import { useLanguage } from '../contexts/LanguageContext'
import { GUIAS, CORREO } from './contenido'
import { MONTANA, MONTES, KANJI, CIUDAD, CIMA } from './datosMontana'
import type { MontanaId, MonteId } from './datosMontana'
import { MontesScroll } from './MontesScroll'
import { EfectoEstacion, estacionDeHoy } from './Estacion'
import { BotonSonido } from './BotonSonido'
import { CREDITOS_SONIDO } from './sonido'
import { Logo } from './Logo'
import './v7.css'
import { IconoWa } from './IconoWa'
import { BarraWa } from './BarraWa'
import { BotonTema } from './Tema'
import { enlacesHreflang } from '../seo/hreflang'

const BASE = 'https://tonykansaiguide.com'
const NUMEROS = ['一', '二', '三', '四', '五', '六', '七', '八', '九']
const IDIOMAS: { id: MontanaId; etiqueta: string }[] = [
  { id: 'm-es', etiqueta: 'Español' }, { id: 'm-en', etiqueta: 'English' }, { id: 'm-ar', etiqueta: 'العربية' }, { id: 'm-ru', etiqueta: 'Русский' },
]

type Ruta = (typeof HIKING_ROUTES)[number]
const ruta = (id: MonteId) => HIKING_ROUTES.find((r) => r.id === id) as Ruta

export default function Montana({ id }: { id: MontanaId }) {
  const p = MONTANA[id]
  const { setLang, tc } = useLanguage()
  const nombreGuia = (g: 'tony' | 'larion') => (p.lang === 'ar' && g === 'tony' ? 'طوني' : p.lang === 'ru' ? 'Ларион' : g === 'tony' ? 'Tony' : 'Larion')

  useEffect(() => {
    setLang(p.lang)
    try { localStorage.setItem('v7-pagina', p.lang === 'ru' ? 'ru' : p.lang) } catch { /* bloqueado */ }
  }, [p.lang, setLang])

  // Memorizado: la escena 3D se rehace si cambia esta referencia.
  const nombres = useMemo(() => Object.fromEntries(MONTES.map((m) => [m, `${KANJI[m]} ${tc(ruta(m).title)}  ${CIMA[m].m} m`])) as Record<MonteId, string>, [tc])
  const wa = (g: 'tony' | 'larion', texto: string) => `https://wa.me/${GUIAS[g].wa}?text=${encodeURIComponent(p.saludo(nombreGuia(g), texto))}`

  const capitulo = (i: number) => {
    if (i === 0) {
      return (
        <div className="v7-montes-intro">
          <p className="v7-antetitulo">{p.intro.antetitulo}</p>
          <h1>{p.intro.titulo}</h1>
          <p>{p.intro.sub}</p>
          <p className="v7-montes-baja">{p.intro.baja} ↓</p>
        </div>
      )
    }
    const m = MONTES[i - 1]
    const r = ruta(m)
    return (
      <article className="v7-monte-ficha">
        <p className="v7-monte-num"><span lang="ja">{NUMEROS[i - 1]}</span> {i} / {MONTES.length}</p>
        <h2><span className="v7-kanji" lang="ja">{KANJI[m]}</span>{tc(r.title)}</h2>
        <p className="v7-monte-sub">{tc(r.subtitle)}</p>
        <dl className="v7-monte-datos">
          {r.altitude && <div><dt>{p.et.altitud}</dt><dd><bdi>{r.altitude}</bdi></dd></div>}
          <div><dt>{p.et.subida}</dt><dd>{tc(r.duration)}</dd></div>
          <div><dt>{p.et.dificultad}</dt><dd>{tc(r.grade)}</dd></div>
          <div><dt>{p.et.epoca}</dt><dd>{tc(r.bestSeason)}</dd></div>
        </dl>
        <p className="v7-monte-nota">{tc(r.note)}</p>
        {/* Coordenadas reales: quien dude de que el monte existe, lo abre en el mapa. */}
        <a className="v7-monte-mapa" href={`https://www.google.com/maps/search/?api=1&query=${CIMA[m].lat},${CIMA[m].lon}`} target="_blank" rel="noopener noreferrer">
          <bdi dir="ltr">{CIMA[m].lat.toFixed(4)}° N, {CIMA[m].lon.toFixed(4)}° E</bdi> <span>{p.et.mapa}</span>
        </a>
        <div className="v7-monte-pie">
          <span className="v7-monte-precio"><bdi>{r.price}</bdi> <small>{p.et.porGrupo}</small></span>
          <a className="v7-boton v7-boton-peq" href={wa(p.guias[0], tc(r.title))} target="_blank" rel="noopener noreferrer"
            onClick={() => window.gtag?.('event', 'generate_lead', { pagina: p.id, ruta: m, canal: 'whatsapp_montana' })}>
            {p.et.pedir}
          </a>
        </div>
      </article>
    )
  }

  return (
    <div className={`v7 v7-pagina v7-montana lang-${p.lang}`} lang={p.lang} dir={p.dir}>
      <Helmet>
        <html lang={p.lang} dir={p.dir} />
        <title>{p.seo.titulo}</title>
        <meta name="description" content={p.seo.descripcion} />
        <link rel="canonical" href={`${BASE}${p.ruta}`} />
        {enlacesHreflang(IDIOMAS.map((x) => ({ lang: MONTANA[x.id].lang, href: `${BASE}${MONTANA[x.id].ruta}` })))}
        <meta property="og:title" content={p.seo.titulo} />
        <meta property="og:description" content={p.seo.descripcion} />
        <meta property="og:url" content={`${BASE}${p.ruta}`} />
        <meta property="og:image" content={`${BASE}/v7/fotos/kioto.jpg`} />
      </Helmet>

      <header className="v7-cabecera cristal">
        <Link to={CIUDAD[id]} className="v7-marca" aria-label="Tony Kansai Guide"> <Logo />
        </Link>
        <nav className="v7-anclas">
          <Link to={CIUDAD[id]}>{p.et.ciudad}</Link>
          <a href="#oficio">{p.oficio.titulo}</a>
        </nav>
        <nav className="v7-idiomas" aria-label="Language">
          {IDIOMAS.map((x) => (
            <Link key={x.id} to={MONTANA[x.id].ruta} lang={MONTANA[x.id].lang} aria-current={x.id === id ? 'page' : undefined}>{x.etiqueta}</Link>
          ))}
        </nav>
        <BotonTema lang={p.lang} />
        <BotonSonido lang={p.lang} ambiente="montana" />
        <a className="v7-boton v7-boton-peq" href={wa(p.guias[0], '')} target="_blank" rel="noopener noreferrer" aria-label={`${p.final.escribir(nombreGuia(p.guias[0]))} — WhatsApp`}>
          <span className="v7-solo-ancho">{p.final.escribir(nombreGuia(p.guias[0]))}</span><span className="v7-solo-movil"><IconoWa /></span>
        </a>
      </header>

      <main>
        <MontesScroll montes={MONTES} nombres={nombres} capitulo={capitulo} etiquetaAria={p.intro.titulo} />

        <section id="oficio" className="v7-seccion">
          <h2><span className="v7-kanji" lang="ja">山</span>{p.oficio.titulo}</h2>
          <ol className="v7-oficio">
            {p.oficio.puntos.map((o, i) => (
              <li key={o.t} className="tarjeta">
                <span className="v7-oficio-num" lang="ja" aria-hidden="true">{NUMEROS[i]}</span>
                <h3>{o.t}</h3>
                <p>{o.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="v7-seccion v7-montana-final">
          <EfectoEstacion estacion={estacionDeHoy()} cantidad={10} />
          <h2>{p.final.titulo}</h2>
          <p className="v7-entradilla">{p.final.sub}</p>
          <div className="v7-montana-guias">
            {p.guias.map((g) => (
              <a key={g} className="v7-montana-guia tarjeta" href={wa(g, '')} target="_blank" rel="noopener noreferrer">
                <img loading="lazy" src={GUIAS[g].foto} alt="" width={72} height={72} />
                <span><strong>{nombreGuia(g)}</strong><small>{g === 'tony' ? 'Español · English · العربية' : 'Русский · English'}</small></span>
                <span className="v7-boton v7-boton-peq">{p.final.escribir(nombreGuia(g))}</span>
              </a>
            ))}
          </div>
        </section>
      </main>
      <BarraWa href={wa(p.guias[0], '')} lang={p.lang} pagina={p.id} ocultaEn=".v7-montes" />

      <footer className="v7-pie">
        <div className="v7-pie-fila">
          <div><strong>Tony Kansai Guide</strong><p><a href={`mailto:${CORREO}`}>{CORREO}</a></p></div>
          <nav>
            <Link to={`/legal?lang=${p.lang}`}>Legal</Link>
            <Link to={`/terms?lang=${p.lang}`}>Terms</Link>
            <Link to={`/safety?lang=${p.lang}`}>Safety</Link>
          </nav>
          <p className="v7-fuente-gsi">{p.et.fuente}</p>
        </div>
        <details className="v7-creditos">
          <summary>Créditos · Credits</summary>
          <ul lang="es" dir="ltr">
            {CREDITOS_SONIDO.map((c) => <li key={c.url}>Sonido «{c.sonido}»: <a href={c.url} target="_blank" rel="noopener noreferrer">{c.autor}</a>, {c.licencia}</li>)}
          </ul>
        </details>
      </footer>
    </div>
  )
}
