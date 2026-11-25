// Páginas de respuesta: contestan una sola pregunta concreta (precio de un guía
// en Kioto, mezquitas de Kansai, comida halal) con la respuesta en la primera
// frase, una tabla o lista con fuentes y fecha, y al final el tour de Tony.
// Textos, fuentes y rutas en datosRespuestas.ts. Misma piel que GuiaTransporte.

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import { GUIAS, CORREO, PAYPAL_TONY, PAGAR } from './contenido'
import { PAGINAS } from './contenido'
import { CabeceraEs } from './CabeceraEs'
import { PieEs } from './PieEs'
import { CabeceraEn } from './CabeceraEn'
import { PieEn } from './PieEn'
import { visible, CIERRE_EMPRESA } from './vozEmpresa'
import { Oracion } from '../v8/Oracion'
import { foto } from './foto'
import { Logo } from './Logo'
import { IconoWa } from './IconoWa'
import { BarraWa } from './BarraWa'
import { yenLocal, PIE } from './formato'
import { useCambio } from './cambio'
import creditosZonas from '../v8/creditosZonas.json'
import { PRECIO_GUIA } from './datosGuias'
import { PRECIO } from './datosRutas'
import { PAGINAS_RESPUESTA, REVISADO, SEGUIR, hermanasRespuesta } from './datosRespuestas'
import type { RespuestaId, Tabla } from './datosRespuestas'
import './v7.css'
// La hoja serena directamente (estilo-pixel.css ya solo la reimporta).
import './estilo-sereno.css'
import './respuesta.css'
import { FranjaVentajas } from './FranjaVentajas'
import { ToursNuevos, viajeTourNuevo } from './ToursNuevos'
import { HerramientasEnGuia } from './KitGuia'

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
        // Autor con nombre y fecha: las IAs de búsqueda prefieren citar texto
        // firmado y fechado. Tony está declarado en index.html con este @id.
        author: { '@id': `${BASE}/#tony` },
        breadcrumb: { '@id': `${url}#migas` },
      },
      {
        '@type': 'BreadcrumbList', '@id': `${url}#migas`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Tony Kansai Guide', item: `${BASE}${p.inicio}` },
          { '@type': 'ListItem', position: 2, name: p.titulo, item: url },
        ],
      },
      {
        '@type': 'FAQPage', '@id': `${url}#faq`, inLanguage: p.lang,
        mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f.p, acceptedAnswer: { '@type': 'Answer', text: f.r } })),
      },
      // Tour de 2 h y tour en bici (11-11-2026): el tour con sus precios reales.
      ...[viajeTourNuevo(id)].filter((v) => v !== null),
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

      {/* En español e inglés (Tony), la cabecera y el pie comunes (árbol de la web, 25-11-2026). */}
      {p.lang === 'es' ? <CabeceraEs activo={p.ruta} idiomas={hermanas.filter(([k]) => k !== id).map(([, x]) => ({ lang: x.lang, ruta: x.ruta, texto: NOMBRE_IDIOMA[x.lang] }))} /> : p.lang === 'en' ? <CabeceraEn activo={p.ruta} idiomas={hermanas.filter(([k]) => k !== id).map(([, x]) => ({ lang: x.lang, ruta: x.ruta, texto: NOMBRE_IDIOMA[x.lang] }))} /> : <header className="v7-cabecera cristal">
        <Link to={p.inicio} className="v7-marca" aria-label="Tony Kansai Guide"><Logo /></Link>
        <nav className="v7-idiomas" aria-label="Language">
          {hermanas.length > 1
            ? hermanas.map(([k, x]) => <Link key={k} to={x.ruta} lang={x.lang} aria-current={k === id ? 'page' : undefined}>{NOMBRE_IDIOMA[x.lang]}</Link>)
            : <Link to={p.inicio} lang={p.lang}>{NOMBRE_IDIOMA[p.lang]}</Link>}
        </nav>
        <a className="v7-boton v7-boton-peq" href={wa} target="_blank" rel="noopener noreferrer" aria-label={visible(p.final.boton)}>
          <span className="v7-solo-ancho">{visible(p.final.boton)}</span><span className="v7-solo-movil"><IconoWa /></span>
        </a>
      </header>}

      <main>
        <section className="v7-otono-hero v7-respuesta-hero">
          <img {...foto(HERO, '(max-width: 820px) calc(100vw - 32px), 50vw')} alt={p.altFoto} {...{ fetchpriority: 'high' }} />
          <div className="v7-otono-hero-texto">
            <p className="v7-antetitulo">{p.antetitulo}</p>
            <h1>{p.titulo}</h1>
            {/* Lo visible pasa por visible(): sin «hasta 6» ni «pregúntame» (vozEmpresa.ts). */}
            <p className="v7-respuesta-directa">{visible(p.respuesta)}</p>
            <p className="v7-actualizado"><time dateTime={REVISADO}>{p.actualizado}</time></p>
            <a className="v7-boton" href={wa} target="_blank" rel="noopener noreferrer" onClick={lead}><IconoWa /> {visible(p.cta)}</a>
          </div>
        </section>

        <SeccionesRespuesta id={id} />

        {/* Horas de oración de hoy y qibla en vivo: solo salían en la portada árabe,
            que ya no las lleva (portada corta). Su sitio es la página de mezquitas. */}
        {id === 'mezquitas-ar' && <Oracion />}

        {/* Precios: las tarjetas informan y ya no llevan botón. Antes cada una tenía
            «Pagar con PayPal» (o «Pedir precio cerrado»), y con el WhatsApp eran dos
            botones principales iguales (crítica del 21-11). PayPal queda como enlace
            secundario debajo de las notas; reservar sigue siendo WhatsApp. */}
        <section className="v7-seccion" id="precios">
          <h2>{visible(p.precios.titulo)}</h2>
          <p className="v7-entradilla">{visible(p.precios.texto)}</p>
          <div className="v7-planes">
            {p.precios.lejos ? (
              <article className="v7-plan tarjeta v7-plan-destacado">
                <h3>{p.precios.lejos.nombre}</h3>
                <p className="v7-plan-precio"><bdi>{p.precios.lejos.desde} {yenLocal(PRECIO.lejos, p.lang)}</bdi></p>
                <p className="v7-plan-grupo">{visible(p.precios.porGrupo)}</p>
                {cambios.length > 0 && <p className="v7-cambio"><bdi>≈ {enDivisa(PRECIO.lejos)}</bdi> {APROX[p.lang]}</p>}
              </article>
            ) : ([['medio', p.precios.medio], ['completo', p.precios.completo]] as const).map(([k, nombre]) => (
              <article key={k} className={`v7-plan tarjeta ${k === 'completo' ? 'v7-plan-destacado' : ''}`}>
                <h3>{nombre}</h3>
                <p className="v7-plan-precio"><bdi>{yenLocal(PRECIO_GUIA[k], p.lang)}</bdi></p>
                <p className="v7-plan-grupo">{visible(p.precios.porGrupo)}</p>
                {cambios.length > 0 && <p className="v7-cambio"><bdi>≈ {enDivisa(PRECIO_GUIA[k])}</bdi> {APROX[p.lang]}</p>}
              </article>
            ))}
          </div>
          <ul className="v7-notas">
            {p.precios.notas.map((n) => <li key={n}>{visible(n)}</li>)}
          </ul>
          {!p.precios.lejos && (
            <p className="v7-pagar-antes">{pagar.nota} <a className="v9-enlace" href={`${PAYPAL_TONY}/${PRECIO_GUIA.medio}JPY`} target="_blank" rel="noopener noreferrer">{pagar.boton}</a></p>
          )}
        </section>

        <section className="v7-seccion v7-faq-seccion">
          <h2>{p.faqTitulo}</h2>
          <div className="v7-faq">
            {p.faq.map((f) => (
              <details key={f.p}>
                <summary>{visible(f.p)}</summary>
                <p>{visible(f.r)}</p>
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

        <ToursNuevos lang={p.lang} sin={p.ruta} />
        <HerramientasEnGuia lang={p.lang} />

        <section className="v7-seccion v7-otono-final">
          <h2>{p.final.titulo}</h2>
          <p className="v7-entradilla">{CIERRE_EMPRESA[p.lang] ?? p.final.texto}</p>
          <a className="v7-boton" href={wa} target="_blank" rel="noopener noreferrer" onClick={lead}><IconoWa /> {visible(p.final.boton)}</a>
          <p><Link to={p.inicio}>{visible(p.volver)}</Link></p>
        </section>
      </main>
      <BarraWa href={wa} lang={p.lang} pagina={id} />

      <FranjaVentajas lang={p.lang} />

      {p.lang === 'es' ? <PieEs p={PAGINAS.es} creditos={CREDITO ? [{ foto: p.foto.lugar, ...CREDITO }] : undefined} idiomas={hermanas.filter(([k]) => k !== id).map(([, x]) => ({ lang: x.lang, ruta: x.ruta, texto: NOMBRE_IDIOMA[x.lang] }))} /> : p.lang === 'en' ? <PieEn p={PAGINAS.en} creditos={CREDITO ? [{ foto: p.foto.lugar, ...CREDITO }] : undefined} idiomas={hermanas.filter(([k]) => k !== id).map(([, x]) => ({ lang: x.lang, ruta: x.ruta, texto: NOMBRE_IDIOMA[x.lang] }))} /> : <footer className="v7-pie">
        <div className="v7-pie-fila">
          <div><strong><Logo /></strong><p><a href={`mailto:${CORREO}`}>{CORREO}</a></p></div>
          <nav>
            <Link to={p.inicio}>Tony Kansai Guide</Link>
            <Link to={`/legal/?lang=${p.lang}`}>{pie.legal}</Link>
            <Link to={`/terms/?lang=${p.lang}`}>{pie.condiciones}</Link>
            <Link to={`/privacy/?lang=${p.lang}`}>{pie.privacidad}</Link>
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
      </footer>}
    </div>
  )
}

/** Las secciones de una respuesta (tabla, listas, párrafos) y sus fuentes. Las
 *  usa también la página de su ciudad cuando la respuesta vive dentro de ella. */
export function SeccionesRespuesta({ id, fuentes = false }: { id: RespuestaId; fuentes?: boolean }) {
  const p = PAGINAS_RESPUESTA[id]
  const seguir = SEGUIR[id]
  return (
    <>
      {p.secciones.map((s) => (
        <section key={s.titulo} className="v7-seccion">
          <h2>{s.titulo}</h2>
          {s.parrafos?.map((t) => <p key={t} className="v7-entradilla">{visible(t)}</p>)}
          {s.lista && <ul className="v7-lista-respuesta">{s.lista.map((t) => <li key={t}>{visible(t)}</li>)}</ul>}
          {s.tabla && <TablaRespuesta tabla={s.tabla} />}
        </section>
      ))}
      {seguir && (
        <section className="v7-seccion">
          <h2>{seguir.titulo}</h2>
          <ul className="v7-seguir">
            {seguir.enlaces.map((e) => <li key={e.ruta}><Link to={e.ruta}>{e.texto}</Link></li>)}
          </ul>
        </section>
      )}
      {fuentes && (
        <section className="v7-seccion">
          <h2>{p.fuentesTitulo}</h2>
          <ul className="v7-fuentes">
            {p.fuentes.map((f) => <li key={f.url}><a href={f.url} target="_blank" rel="noopener noreferrer"><bdi>{f.texto}</bdi></a></li>)}
          </ul>
        </section>
      )}
    </>
  )
}

/** Tabla comparativa de una respuesta. Es una <table> de verdad en el HTML (la
 *  leen Google y las IAs); en el móvil respuesta.css la pinta como tarjetas, una
 *  por fila, y cada dato lleva delante su cabecera (data-etiqueta). Antes era una
 *  tabla de 640 px en una caja de 352 que cortaba la última columna (auditoría P10). */
function TablaRespuesta({ tabla }: { tabla: Tabla }) {
  return (
    <>
      <div className="v7-tabla-caja">
        <table className="v7-tabla">
          <thead><tr>{tabla.cabecera.map((c, i) => <th key={i} scope="col">{visible(c)}</th>)}</tr></thead>
          <tbody>
            {tabla.filas.map((f) => (
              <tr key={f[0]}>{f.map((c, i) => (i === 0
                ? <th key={i} scope="row">{visible(c)}</th>
                : <td key={i} data-etiqueta={tabla.cabecera[i] ?? ''}>{visible(c)}</td>))}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="v7-tabla-nota">{visible(tabla.nota)}</p>
    </>
  )
}
