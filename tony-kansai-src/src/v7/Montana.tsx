// Página de montaña (una por idioma): /es/montana/, /en/hiking/, /ar/hiking/, /ru/hiking/.

import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { HIKING_ROUTES } from '../lib/data'
import { useLanguage } from '../contexts/LanguageContext'
import { GUIAS, CORREO, PAYPAL_TONY, PAGAR } from './contenido'
import { MONTANA, MONTES, KANJI, CIUDAD, CIMA } from './datosMontana'
import type { MontanaId, MonteId } from './datosMontana'
import { MontesScroll } from './MontesScroll'
import { EfectoEstacion, estacionDeHoy } from './Estacion'
import { BotonSonido } from './BotonSonido'
import { CREDITOS_SONIDO } from './sonido'
import { Logo } from './Logo'
import './v7.css'
import './expedicion.css'
import { Portada, Atlas, Corte, Medidor, Meses } from './Expedicion'
import { EXP, CREDITOS as CREDITOS_FOTO } from './datosExpedicion'
import { IconoWa } from './IconoWa'
import { BarraWa } from './BarraWa'
import { enlacesHreflang } from '../seo/hreflang'
import { milesLocal, PIE } from './formato'
import { FranjaVentajas } from './FranjaVentajas'
import { Cumbres, datosCumbres } from './Cumbres'
import { TEXTOS_CUMBRES } from './datosCumbres'

const BASE = 'https://tonykansaiguide.com'
const NUMEROS = ['一', '二', '三', '四', '五', '六', '七', '八', '九']
const IDIOMAS: { id: MontanaId; etiqueta: string }[] = [
  { id: 'm-es', etiqueta: 'Español' }, { id: 'm-en', etiqueta: 'English' }, { id: 'm-ar', etiqueta: 'العربية' }, { id: 'm-ru', etiqueta: 'Русский' },
]

type Ruta = (typeof HIKING_ROUTES)[number]

/** Para Google: las ocho rutas como TouristTrip, con su monte real
 *  (coordenadas y altura) y el precio por grupo. */
function datosEstructurados(p: (typeof MONTANA)[MontanaId], tc: (t: string) => string) {
  const g = GUIAS[p.guias[0]]
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: p.seo.titulo,
    itemListElement: MONTES.map((m, i) => {
      const r = ruta(m)
      const precio = Number(String(r.price).replace(/[^0-9]/g, ''))
      return {
        '@type': 'ListItem', position: i + 1,
        item: {
          '@type': 'TouristTrip',
          name: tc(r.title),
          description: tc(r.note),
          inLanguage: p.lang,
          touristType: 'Guided hiking',
          url: `${BASE}${p.ruta}`,
          itinerary: {
            '@type': 'Mountain', name: `${tc(r.title)} (${KANJI[m]})`,
            geo: { '@type': 'GeoCoordinates', latitude: CIMA[m].lat, longitude: CIMA[m].lon, elevation: CIMA[m].m },
          },
          provider: { '@type': 'Person', name: g.nombre, telephone: `+${g.wa}`, worksFor: { '@id': `${BASE}/#negocio` } },
          ...(precio > 0 ? { offers: { '@type': 'Offer', price: precio, priceCurrency: 'JPY', availability: 'https://schema.org/InStock', url: `${BASE}${p.ruta}`,
            eligibleQuantity: { '@type': 'QuantitativeValue', maxValue: 6, unitText: 'people per group' } } } : {}),
        },
      }
    }),
  }
}
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
  const t = EXP[p.lang]
  const MAX_GRUPO = 6
  const wa = (g: 'tony' | 'larion', texto: string) => `https://wa.me/${GUIAS[g].wa}?text=${encodeURIComponent(p.saludo(nombreGuia(g), texto))}`

  // Salta al capítulo i del relieve 3D (0 = portada del relieve): el progreso
  // de MontesScroll es lineal con el scroll de su sección.
  const irA3d = (i: number) => {
    const el = document.querySelector<HTMLElement>('.v7-montes')
    if (!el) return
    const recorrido = el.offsetHeight - window.innerHeight
    const top = el.getBoundingClientRect().top + window.scrollY + (recorrido * i) / MONTES.length
    window.scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }
  const precioDe = (m: MonteId) => `${milesLocal(ruta(m).price, p.lang)} ${p.et.porGrupo}`

  const capitulo = (i: number) => {
    if (i === 0) {
      return (
        <div className="v7-montes-intro">
          <p className="ex-kicker"><span className="ex-regla" aria-hidden="true" />{p.intro.antetitulo}</p>
          <h2>{t.relieve.titulo}</h2>
          <p>{t.relieve.sub}</p>
          <p className="v7-montes-baja">{p.intro.baja} ↓</p>
        </div>
      )
    }
    const m = MONTES[i - 1]
    const r = ruta(m)
    const yenes = Number(String(r.price).replace(/[^0-9]/g, ''))
    const pagar = p.guias[0] === 'tony' && yenes > 0 ? PAGAR[p.lang] : undefined
    return (
      <article className="v7-monte-ficha">
        <p className="v7-monte-num"><span lang="ja">{NUMEROS[i - 1]}</span> {i} / {MONTES.length}</p>
        <h2><span className="v7-kanji" lang="ja">{KANJI[m]}</span>{tc(r.title)}</h2>
        <p className="v7-monte-sub">{tc(r.subtitle)}</p>
        <dl className="v7-monte-datos">
          {r.altitude && <div><dt>{p.et.altitud}</dt><dd><bdi>{milesLocal(r.altitude, p.lang)}</bdi></dd></div>}
          <div><dt>{p.et.subida}</dt><dd>{tc(r.duration)}</dd></div>
        </dl>
        <Corte id={m} etiqueta={t.ficha.corte} compacto />
        <Medidor id={m} etiqueta={t.ficha.exigencia} grado={tc(r.grade)} />
        <Meses id={m} lang={p.lang} etiqueta={t.ficha.meses} />
        <p className="v7-monte-nota">{tc(r.note)}</p>
        {/* Coordenadas reales: quien dude de que el monte existe, lo abre en el mapa. */}
        <a className="v7-monte-mapa" href={`https://www.google.com/maps/search/?api=1&query=${CIMA[m].lat},${CIMA[m].lon}`} target="_blank" rel="noopener noreferrer">
          <bdi dir="ltr">{CIMA[m].lat.toFixed(4)}° N, {CIMA[m].lon.toFixed(4)}° E</bdi> <span>{p.et.mapa}</span>
        </a>
        <div className="v7-monte-pie">
          <span className="v7-monte-precio"><bdi>{milesLocal(r.price, p.lang)}</bdi> <small>{p.et.porGrupo}</small></span>
          <a className="v7-boton v7-boton-peq" href={wa(p.guias[0], tc(r.title))} target="_blank" rel="noopener noreferrer"
            onClick={() => window.gtag?.('event', 'generate_lead', { pagina: p.id, ruta: m, canal: 'whatsapp_montana' })}>
            {p.et.pedir}
          </a>
        </div>
        {pagar && (
          <p className="v7-monte-pagar">
            <a href={`${PAYPAL_TONY}/${yenes}JPY`} target="_blank" rel="noopener noreferrer"
              onClick={() => window.gtag?.('event', 'begin_checkout', { pagina: p.id, ruta: m, valor: yenes, canal: 'paypal' })}>{pagar.boton}</a>
            <span>{pagar.nota}</span>
          </p>
        )}
      </article>
    )
  }

  return (
    <div className={`v7 v7-pagina v7-montana v7-expedicion lang-${p.lang}`} lang={p.lang} dir={p.dir}>
      <Helmet>
        <html lang={p.lang} dir={p.dir} />
        <title>{p.seo.titulo}</title>
        <meta name="description" content={p.seo.descripcion} />
        <link rel="canonical" href={`${BASE}${p.ruta}`} />
        {enlacesHreflang(IDIOMAS.map((x) => ({ lang: MONTANA[x.id].lang, href: `${BASE}${MONTANA[x.id].ruta}` })))}
        <meta property="og:title" content={p.seo.titulo} />
        <meta property="og:description" content={p.seo.descripcion} />
        <meta property="og:url" content={`${BASE}${p.ruta}`} />
        <meta property="og:image" content={`${BASE}/v7/expedicion/portada.webp`} />
        <script type="application/ld+json">{JSON.stringify(datosEstructurados(p, tc))}</script>
        {datosCumbres(p.lang, `${BASE}${p.ruta}`).map((d) => <script key={d['@type']} type="application/ld+json">{JSON.stringify(d)}</script>)}
      </Helmet>

      <header className="v7-cabecera cristal">
        <Link to={CIUDAD[id]} className="v7-marca" aria-label="Tony Kansai Guide"> <Logo />
        </Link>
        <nav className="v7-anclas">
          <Link to={CIUDAD[id]}>{p.et.ciudad}</Link>
          <a href="#cumbres">{TEXTOS_CUMBRES[p.lang].menu}</a>
          <a href="#oficio">{p.oficio.titulo}</a>
        </nav>
        <nav className="v7-idiomas" aria-label="Language">
          {IDIOMAS.map((x) => (
            <Link key={x.id} to={MONTANA[x.id].ruta} lang={MONTANA[x.id].lang} aria-current={x.id === id ? 'page' : undefined}>{x.etiqueta}</Link>
          ))}
        </nav>
        <BotonSonido lang={p.lang} ambiente="montana" />
        <a className="v7-boton v7-boton-peq" href={wa(p.guias[0], '')} target="_blank" rel="noopener noreferrer" aria-label={`${p.final.escribir(nombreGuia(p.guias[0]))} — WhatsApp`}>
          <span className="v7-solo-ancho">{p.final.escribir(nombreGuia(p.guias[0]))}</span><span className="v7-solo-movil"><IconoWa /></span>
        </a>
      </header>

      <main>
        <Portada t={t} lang={p.lang} maxGrupo={MAX_GRUPO} onBaja={() => document.getElementById('atlas')?.scrollIntoView({ behavior: 'smooth' })} />
        <Atlas t={t} lang={p.lang} nombre={(m) => tc(ruta(m).title)} sub={(m) => tc(ruta(m).subtitle)} grado={(m) => tc(ruta(m).grade)}
          precio={precioDe} wa={(m) => wa(p.guias[0], tc(ruta(m).title))} onVer3d={(i) => irA3d(i + 1)} />
        <MontesScroll tinta="#e8b23a" bruma={[0.93, 0.89, 0.8]} montes={MONTES} nombres={nombres} capitulo={capitulo} etiquetaAria={p.intro.titulo} />

        <Cumbres lang={p.lang} waNumero={GUIAS[p.guias[0]].wa} />

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

      <FranjaVentajas lang={p.lang} />

      <footer className="v7-pie">
        <div className="v7-pie-fila">
          <div><strong>Tony Kansai Guide</strong><p><a href={`mailto:${CORREO}`}>{CORREO}</a></p></div>
          <nav>
            <Link to={`/legal?lang=${p.lang}`}>{(PIE[p.lang] ?? PIE.en).legal}</Link>
            <Link to={`/terms?lang=${p.lang}`}>{(PIE[p.lang] ?? PIE.en).condiciones}</Link>
            <Link to={`/safety?lang=${p.lang}`}>{(PIE[p.lang] ?? PIE.en).seguridad}</Link>
          </nav>
          <p className="v7-fuente-gsi">{p.et.fuente}</p>
        </div>
        <details className="v7-creditos">
          <summary>{(PIE[p.lang] ?? PIE.en).creditos}</summary>
          <ul lang="es" dir="ltr">
            {Object.entries(CREDITOS_FOTO).map(([k, c]) => <li key={k}>Foto «{c.titulo}»: <a href={c.pagina} target="_blank" rel="noopener noreferrer">{c.autor}</a>, {c.licencia}</li>)}
            <li>Previsión: <a href="https://api.met.no/" target="_blank" rel="noopener noreferrer">MET Norway</a>, CC BY 4.0 · iconos <a href="https://github.com/metno/weathericons" target="_blank" rel="noopener noreferrer">metno/weathericons</a>, MIT</li>
            <li>Vuelo 3D: MapLibre GL (BSD-3), foto aérea 出典 国土地理院, relieve AWS Terrain Tiles, senderos OpenFreeMap © OpenStreetMap</li>
            <li>Mapa: <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer">Natural Earth</a>, dominio público</li>
            {CREDITOS_SONIDO.map((c) => <li key={c.url}>Sonido «{c.sonido}»: <a href={c.url} target="_blank" rel="noopener noreferrer">{c.autor}</a>, {c.licencia}</li>)}
          </ul>
        </details>
      </footer>
    </div>
  )
}
