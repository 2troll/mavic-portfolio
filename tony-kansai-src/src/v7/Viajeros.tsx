// Página por país de origen (/es/desde-mexico/, /en/from-uk/, /ar/from-gulf/): lo práctico del
// viaje y el tour con precio en su moneda al cambio del día. Los textos están en
// datosViajeros.ts; aquí solo la maqueta, igual para todos los mercados.

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import { GUIAS, CORREO, PAYPAL_TONY, PAGAR, CREDITOS } from './contenido'
import { foto } from './foto'
import { Logo } from './Logo'
import { IconoWa } from './IconoWa'
import { BarraWa } from './BarraWa'
import { BotonTema } from './Tema'
import { useCambio } from './cambio'
import { yenLocal, PIE } from './formato'
import { MERCADOS } from './datosViajeros'
import creditosZonas from '../v8/creditosZonas.json'
import type { MercadoId } from './datosViajeros'
import './v7.css'

const BASE = 'https://tonykansaiguide.com'
const YENES = [38000, 58000] as const
/** Crédito de cada foto de portada (están en CREDITOS de contenido.ts). */
const CREDITO_FOTO: Record<string, string> = { '/v7/fotos/kioto.jpg': 'Kioto: Fushimi Inari', '/v7/fotos/nara.jpg': 'Nara: ciervos' }

export default function Viajeros({ id }: { id: MercadoId }) {
  const m = MERCADOS[id]
  const { setLang } = useLanguage()
  useEffect(() => { setLang(m.lang) }, [m.lang, setLang])
  const cambios = useCambio([...m.divisas])
  const wa = `https://wa.me/${GUIAS.tony.wa}?text=${encodeURIComponent(m.saludo)}`
  const pie = PIE[m.lang]
  const pagar = PAGAR[m.lang]
  const zona = (creditosZonas as Record<string, { autor: string; licencia: string; url: string }>)[m.foto.match(/zonas\/([a-z-]+)\.jpg$/)?.[1] ?? '']
  const credito = CREDITOS.find((c) => c.foto === CREDITO_FOTO[m.foto]) ?? (zona && { foto: m.fotoAlt, ...zona })
  // Cada moneda con su símbolo y su código detrás: «$6,607 MXN · $367 USD», «£276 · €326».
  const enDivisa = (yenes: number) => cambios.map(({ divisa, tasa }) => {
    const n = new Intl.NumberFormat(divisa === 'USD' ? 'en-US' : m.locale, { style: 'currency', currency: divisa, maximumFractionDigits: 0 }).format(yenes * tasa)
    return n.startsWith('$') ? `${n} ${divisa}` : n
  }).join(' · ')
  const dir = m.lang === 'ar' ? 'rtl' : 'ltr'
  const flecha = dir === 'rtl' ? '←' : '→'
  const lead = () => window.gtag?.('event', 'generate_lead', { pagina: `viajeros-${id}`, canal: 'whatsapp' })
  const ld = {
    '@context': 'https://schema.org', '@type': 'TouristTrip', name: m.seo.titulo.split(' | ')[0],
    description: m.seo.descripcion, url: `${BASE}${m.ruta}`, inLanguage: m.lang, touristType: m.touristType,
    offers: YENES.map((y, i) => ({ '@type': 'Offer', name: m.planes[i], price: y, priceCurrency: 'JPY', url: `${BASE}${m.ruta}` })),
    provider: { '@type': 'LocalBusiness', name: 'Tony Kansai Guide', url: BASE, telephone: `+${GUIAS.tony.wa}`, email: CORREO },
  }

  return (
    <div className={`v7 v7-pagina v7-otono lang-${m.lang}`} lang={m.lang} dir={dir}>
      <Helmet>
        <html lang={m.lang} dir={dir} />
        <title>{m.seo.titulo}</title>
        <meta name="description" content={m.seo.descripcion} />
        <link rel="canonical" href={`${BASE}${m.ruta}`} />
        <meta property="og:title" content={m.seo.titulo} />
        <meta property="og:description" content={m.seo.descripcion} />
        <meta property="og:url" content={`${BASE}${m.ruta}`} />
        <meta property="og:image" content={`${BASE}/v8/og/${m.lang}.jpg`} />
        <script type="application/ld+json">{JSON.stringify(ld)}</script>
      </Helmet>

      <header className="v7-cabecera cristal">
        <Link to={m.inicio} className="v7-marca" aria-label="Tony Kansai Guide"><Logo /></Link>
        {/* Sin selector de idiomas: el hueco empuja los botones a la derecha. */}
        <span aria-hidden="true" style={{ flex: 1 }} />
        <BotonTema lang={m.lang} />
        <a className="v7-boton v7-boton-peq" href={wa} target="_blank" rel="noopener noreferrer" aria-label={m.final.boton}>
          <span className="v7-solo-ancho">{m.escribe}</span><span className="v7-solo-movil"><IconoWa /></span>
        </a>
      </header>

      <main>
        <section className="v7-otono-hero">
          <img {...foto(m.foto)} alt={m.fotoAlt} {...{ fetchpriority: 'high' }} />
          <div className="v7-otono-hero-texto">
            <p className="v7-antetitulo">{m.bandera} {m.antetitulo}</p>
            <h1>{m.titulo}</h1>
            <p>{m.sub}</p>
            <a className="v7-boton" href={wa} target="_blank" rel="noopener noreferrer" onClick={lead}><IconoWa /> {m.cta}</a>
          </div>
        </section>

        <section className="v7-seccion">
          <h2>{m.practicoTitulo}</h2>
          <ul className="v7-otono-sitios">
            {m.practico.map((x) => (
              <li key={x.t} className="tarjeta">
                <span className="v7-otono-kanji" aria-hidden="true">{x.icono}</span>
                <h3>{x.t}</h3>
                <p>{x.d}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="v7-seccion" id="precios">
          <h2>{m.preciosTitulo}</h2>
          <div className="v7-planes">
            {YENES.map((y, i) => (
              <article key={y} className={`v7-plan tarjeta ${i === 1 ? 'v7-plan-destacado' : ''}`}>
                <h3>{m.planes[i]}</h3>
                <p className="v7-plan-precio"><bdi>{yenLocal(y, m.lang)}</bdi></p>
                <p className="v7-plan-grupo">{m.porGrupo}</p>
                <p className="v7-plan-persona">{m.porPersona(yenLocal(y / 4, m.lang))}</p>
                {cambios.length > 0 && <p className="v7-plan-aprox">≈ {enDivisa(y)}</p>}
                <a className="v7-plan-pagar" href={`${PAYPAL_TONY}/${y}JPY`} target="_blank" rel="noopener noreferrer">{pagar.boton}</a>
              </article>
            ))}
          </div>
          <ul className="v7-notas">
            <li>{pagar.nota}</li>
            {m.notas.map((n) => <li key={n}>{n}</li>)}
          </ul>
          {cambios.length > 0 && <p className="v7-fuente-cambio">≈ {m.aprox} · <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer">Rates by Exchange Rate API</a></p>}
        </section>

        <section className="v7-seccion">
          <h2>{m.ideasTitulo}</h2>
          <ul className="v7-otono-sitios">
            {m.ideas.map((x) => (
              <li key={x.t} className="tarjeta">
                <h3><Link to={x.a}>{x.t} {flecha}</Link></h3>
                <p>{x.d}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="v7-seccion v7-otono-final">
          <h2>{m.final.titulo}</h2>
          <p className="v7-entradilla">{m.final.texto}</p>
          <a className="v7-boton" href={wa} target="_blank" rel="noopener noreferrer" onClick={lead}><IconoWa /> {m.final.boton}</a>
          <p><Link to={m.inicio}>{m.final.principal}</Link></p>
        </section>
      </main>
      <BarraWa href={wa} lang={m.lang} pagina={`viajeros-${id}`} />

      <footer className="v7-pie">
        <div className="v7-pie-fila">
          <div><strong><Logo /></strong><p><a href={`mailto:${CORREO}`}>{CORREO}</a></p></div>
          <nav>
            <Link to={m.inicio}>Tony Kansai Guide</Link>
            <Link to={`/legal?lang=${m.lang}`}>{pie.legal}</Link>
            <Link to={`/terms?lang=${m.lang}`}>{pie.condiciones}</Link>
            <Link to={`/privacy?lang=${m.lang}`}>{pie.privacidad}</Link>
          </nav>
        </div>
        {credito && (
          <details className="v7-creditos">
            <summary>{pie.creditos}</summary>
            <ul lang="es"><li>{credito.foto}: <a href={credito.url} target="_blank" rel="noopener noreferrer">{credito.autor}</a>, {credito.licencia}</li></ul>
          </details>
        )}
      </footer>
    </div>
  )
}
