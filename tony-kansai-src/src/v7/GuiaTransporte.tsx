// Guías prácticas para posicionar en buscadores: cómo ir de Osaka a Kioto
// (/es/osaka-kioto/, /en/osaka-to-kyoto/) y del aeropuerto de Kansai a Osaka y
// Kioto (/es/aeropuerto-kansai/, /en/kansai-airport/). Responden a la pregunta
// con datos comprobados y, al final, ofrecen el tour. Textos y fuentes en
// datosGuias.ts; cada guía solo enlaza (hreflang, idiomas) con las de su grupo.

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
import { GUIAS_TRANSPORTE, PRECIO_GUIA, hermanasGuia } from './datosGuias'
import type { GuiaId } from './datosGuias'
import './v7.css'

const BASE = 'https://tonykansaiguide.com'
const P = GUIAS_TRANSPORTE
const PRECIO = PRECIO_GUIA

const CREDITOS = creditosZonas as Record<string, { autor: string; licencia: string; url: string }>

export default function GuiaTransporte({ id }: { id: GuiaId }) {
  const p = P[id]
  const HERO = `/v8/zonas/${p.foto.clave}.jpg`
  const CREDITO = CREDITOS[p.foto.clave]
  const hermanas = hermanasGuia(p.grupo)
  const { setLang } = useLanguage()
  useEffect(() => { setLang(p.lang) }, [p.lang, setLang])

  const wa = `https://wa.me/${GUIAS.tony.wa}?text=${encodeURIComponent(p.saludo)}`
  const pagar = PAGAR[p.lang]
  const pie = PIE[p.lang]
  const url = `${BASE}${p.ruta}`
  const lead = () => window.gtag?.('event', 'generate_lead', { pagina: id, canal: 'whatsapp' })
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage', '@id': url, url, name: p.seo.titulo.split(' | ')[0], description: p.seo.descripcion,
        inLanguage: p.lang, image: `${BASE}${p.og}`,
        publisher: { '@type': 'LocalBusiness', name: 'Tony Kansai Guide', url: BASE, telephone: `+${GUIAS.tony.wa}`, email: CORREO },
      },
      {
        '@type': 'FAQPage', '@id': `${url}#faq`, inLanguage: p.lang,
        mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f.p, acceptedAnswer: { '@type': 'Answer', text: f.r } })),
      },
    ],
  }

  return (
    <div className={`v7 v7-pagina v7-otono lang-${p.lang}`} lang={p.lang} dir="ltr">
      <Helmet>
        <html lang={p.lang} dir="ltr" />
        <title>{p.seo.titulo}</title>
        <meta name="description" content={p.seo.descripcion} />
        <link rel="canonical" href={url} />
        {enlacesHreflang(hermanas.map(([, x]) => ({ lang: x.lang, href: `${BASE}${x.ruta}` })))}
        <meta property="og:title" content={p.seo.titulo} />
        <meta property="og:description" content={p.seo.descripcion} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${BASE}${p.og}`} />
        <script type="application/ld+json">{JSON.stringify(ld)}</script>
      </Helmet>

      <header className="v7-cabecera cristal">
        <Link to={p.inicio} className="v7-marca" aria-label="Tony Kansai Guide"><Logo /></Link>
        <nav className="v7-idiomas" aria-label="Language">
          {hermanas.map(([k, x]) => (
            <Link key={k} to={x.ruta} lang={x.lang} aria-current={k === id ? 'page' : undefined}>{x.lang === 'es' ? 'Español' : 'English'}</Link>
          ))}
        </nav>
        <BotonTema lang={p.lang} />
        <a className="v7-boton v7-boton-peq" href={wa} target="_blank" rel="noopener noreferrer" aria-label={p.final.boton}>
          <span className="v7-solo-ancho">{p.final.boton}</span><span className="v7-solo-movil"><IconoWa /></span>
        </a>
      </header>

      <main>
        <section className="v7-otono-hero">
          <img {...foto(HERO)} alt={p.altFoto} {...{ fetchpriority: 'high' }} />
          <div className="v7-otono-hero-texto">
            <p className="v7-antetitulo">{p.grupo === 'aeropuerto' ? '✈️' : '🚃'} {p.antetitulo}</p>
            <h1>{p.titulo}</h1>
            <p>{p.sub}</p>
            <a className="v7-boton" href={wa} target="_blank" rel="noopener noreferrer" onClick={lead}><IconoWa /> {p.cta}</a>
          </div>
        </section>

        <section className="v7-seccion">
          <h2>{p.opcionesTitulo}</h2>
          <p className="v7-entradilla">{p.opcionesIntro}</p>
          <ul className="v7-otono-sitios">
            {p.opciones.map((o) => (
              <li key={o.nombre} className="tarjeta">
                <span className="v7-otono-kanji" lang="ja">{o.kanji}</span>
                <h3>{o.nombre}</h3>
                <p><strong>{p.etiquetas.trayecto}:</strong> {o.trayecto}</p>
                <p><strong>{p.etiquetas.tiempo}:</strong> {o.tiempo}</p>
                <p><strong>{p.etiquetas.para}</strong> {o.para}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="v7-seccion">
          <h2>{p.consejosTitulo}</h2>
          <ul className="v7-notas">{p.consejos.map((c) => <li key={c}>{c}</li>)}</ul>
        </section>

        <section className="v7-seccion" id="precios">
          <h2>{p.tour.titulo}</h2>
          <p className="v7-entradilla">{p.tour.texto}</p>
          <h3>{p.preciosTitulo}</h3>
          <div className="v7-planes">
            {([['medio', p.medio], ['completo', p.completo]] as const).map(([k, nombre]) => (
              <article key={k} className={`v7-plan tarjeta ${k === 'completo' ? 'v7-plan-destacado' : ''}`}>
                <h3>{nombre}</h3>
                <p className="v7-plan-precio"><bdi>{yenLocal(PRECIO[k], p.lang)}</bdi></p>
                <p className="v7-plan-grupo">{p.porGrupo}</p>
                <a className="v7-plan-pagar" href={`${PAYPAL_TONY}/${PRECIO[k]}JPY`} target="_blank" rel="noopener noreferrer">{pagar.boton}</a>
              </article>
            ))}
          </div>
          <ul className="v7-notas">
            <li>{pagar.nota}</li>
            {p.notas.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </section>

        <section className="v7-seccion v7-faq-seccion">
          <h2>{p.faqTitulo}</h2>
          <div className="v7-faq">
            {p.faq.map((f) => (
              <details key={f.p}>
                <summary>{f.p}</summary>
                <p>{f.r}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="v7-seccion v7-otono-final">
          <h2>{p.final.titulo}</h2>
          <p className="v7-entradilla">{p.final.texto}</p>
          <a className="v7-boton" href={wa} target="_blank" rel="noopener noreferrer" onClick={lead}><IconoWa /> {p.final.boton}</a>
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
            <li>{p.foto.lugar}: <a href={CREDITO.url} target="_blank" rel="noopener noreferrer">{CREDITO.autor}</a>, {CREDITO.licencia}</li>
          </ul>
        </details>
      </footer>
    </div>
  )
}
