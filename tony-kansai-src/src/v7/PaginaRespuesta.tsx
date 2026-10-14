// Páginas de respuesta: contestan una sola pregunta concreta (precio de un guía
// en Kioto, mezquitas de Kansai, comida halal) con la respuesta en la primera
// frase, una tabla o lista con fuentes y fecha, y al final el tour de Tony.
// Textos, fuentes y rutas en datosRespuestas.ts. Misma piel que GuiaTransporte.

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
import { yenLocal, PIE } from './formato'
import { useCambio } from './cambio'
import creditosZonas from '../v8/creditosZonas.json'
import { PRECIO_GUIA } from './datosGuias'
import { PAGINAS_RESPUESTA, REVISADO, hermanasRespuesta } from './datosRespuestas'
import type { RespuestaId } from './datosRespuestas'
import './v7.css'
import './estilo-pixel.css'
import './respuesta.css'
import { FranjaVentajas } from './FranjaVentajas'

const BASE = 'https://tonykansaiguide.com'
const CREDITOS = creditosZonas as Record<string, { autor: string; licencia: string; url: string }>
const NOMBRE_IDIOMA: Record<string, string> = { es: 'Español', en: 'English', ar: 'العربية' }
// Moneda de referencia de cada público: el precio se cobra en yenes, esto es solo orientativo.
const DIVISAS: Record<string, string[]> = { es: ['EUR', 'USD'], en: ['USD', 'EUR'], ar: ['SAR', 'AED'] }
const LOCALE: Record<string, string> = { es: 'es-ES', en: 'en-US', ar: 'ar-SA' }
const APROX: Record<string, string> = { es: 'al cambio de hoy', en: 'at today\'s rate', ar: 'بسعر الصرف اليوم' }

export default function PaginaRespuesta({ id }: { id: RespuestaId }) {
  const p = PAGINAS_RESPUESTA[id]
  const dir = p.lang === 'ar' ? 'rtl' : 'ltr'
  const HERO = `/v8/zonas/${p.foto.clave}.jpg`
  const CREDITO = CREDITOS[p.foto.clave]
  const hermanas = hermanasRespuesta(p.grupo)
  const { setLang } = useLanguage()
  useEffect(() => { setLang(p.lang) }, [p.lang, setLang])
  // El cambio llega tras cargar (null en el servidor y en la hidratación: no descuadra el HTML).
  const cambios = useCambio(DIVISAS[p.lang])
  const enDivisa = (yenes: number) => cambios.map(({ divisa, tasa }) =>
    new Intl.NumberFormat(LOCALE[p.lang], { style: 'currency', currency: divisa, maximumFractionDigits: 0 }).format(yenes * tasa)).join(' · ')

  const wa = `https://wa.me/${GUIAS.tony.wa}?text=${encodeURIComponent(p.saludo)}`
  const pagar = PAGAR[p.lang]
  const pie = PIE[p.lang]
  const url = `${BASE}${p.ruta}`
  const lead = () => window.gtag?.('event', 'generate_lead', { pagina: id, canal: 'whatsapp' })
  // hreflang: solo los idiomas (sin países) y x-default a la versión inglesa si
  // la hay; una página sin traducciones no declara ninguno.
  const enIngles = hermanas.find(([, x]) => x.lang === 'en')?.[1]
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage', '@id': url, url, name: p.titulo, description: p.seo.descripcion,
        inLanguage: p.lang, image: `${BASE}${p.og}`, dateModified: REVISADO,
        // El negocio lo declara index.html con este @id (A04): uno solo en todo el sitio.
        publisher: { '@id': `${BASE}/#negocio` },
      },
      {
        '@type': 'FAQPage', '@id': `${url}#faq`, inLanguage: p.lang,
        mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f.p, acceptedAnswer: { '@type': 'Answer', text: f.r } })),
      },
    ],
  }

  return (
    <div className={`v7 v7-pagina v7-otono lang-${p.lang}`} lang={p.lang} dir={dir}>
      <Helmet>
        <html lang={p.lang} dir={dir} />
        <title>{p.seo.titulo}</title>
        <meta name="description" content={p.seo.descripcion} />
        <link rel="canonical" href={url} />
        {hermanas.length > 1 && hermanas.map(([k, x]) => <link key={k} rel="alternate" hrefLang={x.lang} href={`${BASE}${x.ruta}`} />)}
        {hermanas.length > 1 && enIngles && <link rel="alternate" hrefLang="x-default" href={`${BASE}${enIngles.ruta}`} />}
        <meta property="og:title" content={p.seo.titulo} />
        <meta property="og:description" content={p.seo.descripcion} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${BASE}${p.og}`} />
        <script type="application/ld+json">{JSON.stringify(ld)}</script>
      </Helmet>

      <header className="v7-cabecera cristal">
        <Link to={p.inicio} className="v7-marca" aria-label="Tony Kansai Guide"><Logo /></Link>
        <nav className="v7-idiomas" aria-label="Language">
          {hermanas.length > 1
            ? hermanas.map(([k, x]) => <Link key={k} to={x.ruta} lang={x.lang} aria-current={k === id ? 'page' : undefined}>{NOMBRE_IDIOMA[x.lang]}</Link>)
            : <Link to={p.inicio} lang={p.lang}>{NOMBRE_IDIOMA[p.lang]}</Link>}
        </nav>
        <BotonTema lang={p.lang} />
        <a className="v7-boton v7-boton-peq" href={wa} target="_blank" rel="noopener noreferrer" aria-label={p.final.boton}>
          <span className="v7-solo-ancho">{p.final.boton}</span><span className="v7-solo-movil"><IconoWa /></span>
        </a>
      </header>

      <main>
        <section className="v7-otono-hero">
          <img {...foto(HERO, '(max-width: 820px) calc(100vw - 32px), 50vw')} alt={p.altFoto} {...{ fetchpriority: 'high' }} />
          <div className="v7-otono-hero-texto">
            <p className="v7-antetitulo">{p.antetitulo}</p>
            <h1>{p.titulo}</h1>
            <p className="v7-respuesta-directa">{p.respuesta}</p>
            <p className="v7-actualizado"><time dateTime={REVISADO}>{p.actualizado}</time></p>
            <a className="v7-boton" href={wa} target="_blank" rel="noopener noreferrer" onClick={lead}><IconoWa /> {p.cta}</a>
          </div>
        </section>

        {p.secciones.map((s) => (
          <section key={s.titulo} className="v7-seccion">
            <h2>{s.titulo}</h2>
            {s.parrafos?.map((t) => <p key={t} className="v7-entradilla">{t}</p>)}
            {s.lista && <ul className="v7-lista-respuesta">{s.lista.map((t) => <li key={t}>{t}</li>)}</ul>}
            {s.tabla && (
              <>
                <div className="v7-tabla-marco tarjeta">
                  <table className="v7-tabla">
                    <thead><tr>{s.tabla.cabecera.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
                    <tbody>
                      {s.tabla.filas.map((f) => (
                        <tr key={f[0]}>{f.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="v7-tabla-nota">{s.tabla.nota}</p>
              </>
            )}
          </section>
        ))}

        <section className="v7-seccion" id="precios">
          <h2>{p.precios.titulo}</h2>
          <p className="v7-entradilla">{p.precios.texto}</p>
          <div className="v7-planes">
            {([['medio', p.precios.medio], ['completo', p.precios.completo]] as const).map(([k, nombre]) => (
              <article key={k} className={`v7-plan tarjeta ${k === 'completo' ? 'v7-plan-destacado' : ''}`}>
                <h3>{nombre}</h3>
                <p className="v7-plan-precio"><bdi>{yenLocal(PRECIO_GUIA[k], p.lang)}</bdi></p>
                <p className="v7-plan-grupo">{p.precios.porGrupo}</p>
                {cambios.length > 0 && <p className="v7-cambio"><bdi>≈ {enDivisa(PRECIO_GUIA[k])}</bdi> {APROX[p.lang]}</p>}
                <a className="v7-plan-pagar" href={`${PAYPAL_TONY}/${PRECIO_GUIA[k]}JPY`} target="_blank" rel="noopener noreferrer">{pagar.boton}</a>
              </article>
            ))}
          </div>
          <ul className="v7-notas">
            <li>{pagar.nota}</li>
            {p.precios.notas.map((n) => <li key={n}>{n}</li>)}
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

        <section className="v7-seccion">
          <h2>{p.fuentesTitulo}</h2>
          <ul className="v7-fuentes">
            {p.fuentes.map((f) => <li key={f.url}><a href={f.url} target="_blank" rel="noopener noreferrer"><bdi>{f.texto}</bdi></a></li>)}
          </ul>
        </section>

        <section className="v7-seccion v7-otono-final">
          <h2>{p.final.titulo}</h2>
          <p className="v7-entradilla">{p.final.texto}</p>
          <a className="v7-boton" href={wa} target="_blank" rel="noopener noreferrer" onClick={lead}><IconoWa /> {p.final.boton}</a>
          <p><Link to={p.inicio}>{p.volver}</Link></p>
        </section>
      </main>
      <BarraWa href={wa} lang={p.lang} pagina={id} />

      <FranjaVentajas lang={p.lang} />

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
        {CREDITO && (
          <details className="v7-creditos">
            <summary>{pie.creditos}</summary>
            <ul lang="es" dir="ltr">
              <li>{p.foto.lugar}: <a href={CREDITO.url} target="_blank" rel="noopener noreferrer">{CREDITO.autor}</a>, {CREDITO.licencia}</li>
            </ul>
          </details>
        )}
      </footer>
    </div>
  )
}
