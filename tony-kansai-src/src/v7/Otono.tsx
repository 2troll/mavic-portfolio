// Página de temporada: el otoño de Kioto (momiji). /es/otono-kioto/ y /en/kyoto-autumn/.
// Es la que se enseña en anuncios y publicaciones de octubre y noviembre, y la
// que busca quien viene a ver los arces rojos. Los textos, en datosOtono.ts.

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import { GUIAS, CORREO, PAYPAL_TONY, PAGAR } from './contenido'
import { foto } from './foto'
import { Logo } from './Logo'
import { IconoWa } from './IconoWa'
import { BarraWa } from './BarraWa'
import { BotonTema } from './Tema'
import { enlacesHreflang } from '../seo/hreflang'
import { yenLocal, PIE } from './formato'
import creditosZonas from '../v8/creditosZonas.json'
import { OTONO, PRECIO_OTONO } from './datosOtono'
import type { OtonoId } from './datosOtono'
import './v7.css'
import './estilo-pixel.css'

const BASE = 'https://tonykansaiguide.com'
const P = OTONO
const PRECIO = PRECIO_OTONO

const HERO = '/v8/zonas/kioto-kiyomizu.jpg'
const CREDITO = (creditosZonas as Record<string, { autor: string; licencia: string; url: string }>)['kioto-kiyomizu']

export default function Otono({ id }: { id: OtonoId }) {
  const p = P[id]
  const { setLang } = useLanguage()
  useEffect(() => { setLang(p.lang) }, [p.lang, setLang])

  const wa = `https://wa.me/${GUIAS.tony.wa}?text=${encodeURIComponent(p.saludo)}`
  const pagar = PAGAR[p.lang]
  const pie = PIE[p.lang]
  const ld = {
    '@context': 'https://schema.org', '@type': 'TouristTrip',
    name: p.seo.titulo.split(' | ')[0], description: p.seo.descripcion, url: `${BASE}${p.ruta}`, inLanguage: p.lang,
    touristType: p.lang === 'es' ? 'Viajeros de España y México' : 'Travellers from the UK',
    itinerary: { '@type': 'ItemList', itemListElement: p.sitios.map((s, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'TouristAttraction', name: s.nombre } })) },
    offers: [
      { '@type': 'Offer', name: p.medio, price: PRECIO.medio, priceCurrency: 'JPY', url: `${BASE}${p.ruta}` },
      { '@type': 'Offer', name: p.completo, price: PRECIO.completo, priceCurrency: 'JPY', url: `${BASE}${p.ruta}` },
    ],
    provider: { '@type': 'LocalBusiness', name: 'Tony Kansai Guide', url: BASE, telephone: `+${GUIAS.tony.wa}`, email: CORREO },
  }

  return (
    <div className={`v7 v7-pagina v7-otono lang-${p.lang}`} lang={p.lang} dir="ltr">
      <Helmet>
        <html lang={p.lang} dir="ltr" />
        <title>{p.seo.titulo}</title>
        <meta name="description" content={p.seo.descripcion} />
        <link rel="canonical" href={`${BASE}${p.ruta}`} />
        {enlacesHreflang(Object.values(P).map((x) => ({ lang: x.lang, href: `${BASE}${x.ruta}` })))}
        <meta property="og:title" content={p.seo.titulo} />
        <meta property="og:description" content={p.seo.descripcion} />
        <meta property="og:url" content={`${BASE}${p.ruta}`} />
        <meta property="og:image" content={`${BASE}/v8/og/kyoto.jpg`} />
        <script type="application/ld+json">{JSON.stringify(ld)}</script>
      </Helmet>

      <header className="v7-cabecera cristal">
        <Link to={p.inicio} className="v7-marca" aria-label="Tony Kansai Guide"><Logo /></Link>
        <nav className="v7-idiomas" aria-label="Language">
          {Object.entries(P).map(([k, x]) => (
            <Link key={k} to={x.ruta} lang={x.lang} aria-current={k === id ? 'page' : undefined}>{x.lang === 'es' ? 'Español' : 'English'}</Link>
          ))}
        </nav>
        <BotonTema lang={p.lang} />
        <a className="v7-boton v7-boton-peq" href={wa} target="_blank" rel="noopener noreferrer" aria-label={`${p.final.boton}`}>
          <span className="v7-solo-ancho">{p.final.boton}</span><span className="v7-solo-movil"><IconoWa /></span>
        </a>
      </header>

      <main>
        <section className="v7-otono-hero">
          <img {...foto(HERO, '(max-width: 820px) calc(100vw - 32px), 50vw')} alt={p.sitios[0].nombre} {...{ fetchpriority: 'high' }} />
          <div className="v7-otono-hero-texto">
            <p className="v7-antetitulo">🍁 {p.antetitulo}</p>
            <h1>{p.titulo}</h1>
            <p>{p.sub}</p>
            <a className="v7-boton" href={wa} target="_blank" rel="noopener noreferrer"
              onClick={() => window.gtag?.('event', 'generate_lead', { pagina: id, canal: 'whatsapp' })}><IconoWa /> {p.cta}</a>
          </div>
        </section>

        <section className="v7-seccion">
          <h2>{p.cuando.titulo}</h2>
          {p.cuando.texto.map((t) => <p key={t} className="v7-entradilla">{t}</p>)}
        </section>

        <section className="v7-seccion">
          <h2>{p.sitiosTitulo}</h2>
          <ul className="v7-otono-sitios">
            {p.sitios.map((s) => (
              <li key={s.nombre} className="tarjeta">
                <span className="v7-otono-kanji" lang="ja">{s.kanji}</span>
                <h3>{s.nombre}</h3>
                <p>{s.texto}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="v7-seccion">
          <h2>{p.diaTitulo}</h2>
          <ol className="v7-otono-dia">
            {p.dia.map((d) => <li key={d.h}><span>{d.h}</span><p>{d.t}</p></li>)}
          </ol>
          <p className="v7-otono-nota">{p.diaNota}</p>
        </section>

        <section className="v7-seccion" id="precios">
          <h2>{p.preciosTitulo}</h2>
          <div className="v7-planes">
            {([['medio', p.medio], ['completo', p.completo]] as const).map(([k, nombre]) => (
              <article key={k} className={`v7-plan tarjeta ${k === 'completo' ? 'v7-plan-destacado' : ''}`}>
                <h3>{nombre}</h3>
                <p className="v7-plan-precio"><bdi>{yenLocal(PRECIO[k], p.lang)}</bdi></p>
                <p className="v7-plan-grupo">{p.porGrupo}</p>
                <p className="v7-plan-persona">{p.porPersona(yenLocal(PRECIO[k] / 4, p.lang))}</p>
                <a className="v7-plan-pagar" href={`${PAYPAL_TONY}/${PRECIO[k]}JPY`} target="_blank" rel="noopener noreferrer">{pagar.boton}</a>
              </article>
            ))}
          </div>
          <ul className="v7-notas">
            <li>{pagar.nota}</li>
            {p.notas.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </section>

        <section className="v7-seccion">
          <h2>{p.consejosTitulo}</h2>
          <ul className="v7-notas">{p.consejos.map((c) => <li key={c}>{c}</li>)}</ul>
        </section>

        <section className="v7-seccion v7-otono-final">
          <h2>{p.final.titulo}</h2>
          <p className="v7-entradilla">{p.final.texto}</p>
          <a className="v7-boton" href={wa} target="_blank" rel="noopener noreferrer"
            onClick={() => window.gtag?.('event', 'generate_lead', { pagina: id, canal: 'whatsapp' })}><IconoWa /> {p.final.boton}</a>
          <p><Link to={p.inicio}>{p.volver}</Link></p>
        </section>
      </main>
      <BarraWa href={wa} lang={p.lang} pagina={id} />

      <footer className="v7-pie">
        <div className="v7-pie-fila">
          <div><strong><Logo /></strong><p><a href={`mailto:${CORREO}`}>{CORREO}</a></p></div>
          <nav>
            <Link to={p.inicio}>Tony Kansai Guide</Link>
            <Link to={`/legal?lang=${p.lang}`}>{pie.legal}</Link>
            <Link to={`/terms?lang=${p.lang}`}>{pie.condiciones}</Link>
            <Link to={`/privacy?lang=${p.lang}`}>{pie.privacidad}</Link>
          </nav>
        </div>
        <details className="v7-creditos">
          <summary>{pie.creditos}</summary>
          <ul lang="es" dir="ltr">
            <li>Kiyomizu-dera: <a href={CREDITO.url} target="_blank" rel="noopener noreferrer">{CREDITO.autor}</a>, {CREDITO.licencia}</li>
          </ul>
        </details>
      </footer>
    </div>
  )
}
