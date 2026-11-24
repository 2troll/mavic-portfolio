// Páginas de temporada en Kioto: otoño (momiji) y primavera (sakura), en es/en/ar/ru,
// y el invierno en Kansai (es/en/ar, solo Tony), que lleva varios tours con precio propio.
// Las rusas serían de Larion (su Telegram, sin PayPal).
// Es la que se enseña en anuncios y publicaciones de octubre y noviembre, y la
// que busca quien viene a ver los arces rojos. Los textos, en datosOtono.ts.

// Texto visible sin «hasta 6» ni primera persona (vozEmpresa.ts); los datos no cambian.
import { visible } from './vozEmpresa'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import { GUIAS, CORREO, PAYPAL_TONY, PAGAR, enlaceGuia, contactoLd } from './contenido'
import { foto } from './foto'
import { Logo } from './Logo'
import { IconoCanal } from './IconoWa'
import { BarraWa } from './BarraWa'
import { enlacesHreflang } from '../seo/hreflang'
import { yenLocal, PIE } from './formato'
import creditosZonas from '../v8/creditosZonas.json'
import { OTONO, PRECIO_OTONO, hermanas } from './datosOtono'
import type { OtonoId, PaginaOtono } from './datosOtono'
import './v7.css'
import './invierno.css'
import './estilo-pixel.css'
import { FranjaVentajas } from './FranjaVentajas'

const BASE = 'https://tonykansaiguide.com'
const P = OTONO
const PRECIO = PRECIO_OTONO

const CREDITOS = creditosZonas as Record<string, { autor: string; licencia: string; url: string }>
const OTRA_TXT: Record<'otono' | 'sakura', Record<string, string>> = {
  otono: { es: '¿Y en primavera? Los cerezos de Kioto en 2027', en: 'Coming in spring? Kyoto cherry blossom 2027', ar: 'هل تأتي في الربيع؟ أزهار الكرز في كيوتو 2027', ru: 'Весной? Сакура в Киото в 2027 году' },
  sakura: { es: '¿Vienes en otoño? Los arces rojos de Kioto', en: 'Coming in autumn? Kyoto\'s red maples', ar: 'هل تأتي في الخريف؟ أوراق القيقب الحمراء في كيوتو', ru: 'Осенью? Красные клёны Киото' },
}
const NOMBRE_LANG: Record<string, string> = { es: 'Español', en: 'English', ar: 'العربية', ru: 'Русский' }
const PUBLICO: Record<string, string> = { es: 'Viajeros de España y México', en: 'Travellers from the UK and USA', ar: 'مسافرون من الخليج', ru: 'Путешественники из России' }

export default function Otono({ id }: { id: OtonoId }) {
  const p = P[id]
  const { setLang } = useLanguage()
  useEffect(() => { setLang(p.lang) }, [p.lang, setLang])

  // Larion: Telegram (t.me no prellena texto); Tony: WhatsApp con el saludo.
  const wa = enlaceGuia(p.guia, p.saludo)
  const tg = !!GUIAS[p.guia].tg
  const claseBoton = tg ? ' v7-tg' : ''
  const canal = tg ? 'telegram' : 'whatsapp'
  // El PayPal es de Tony: en las páginas de Larion no se ofrece.
  const pagar = p.guia === 'tony' ? PAGAR[p.lang] : undefined
  const dir = p.lang === 'ar' ? 'rtl' : 'ltr'
  const hero = `/v8/zonas/${p.foto}.jpg`
  const credito = CREDITOS[p.foto]
  const lugar = p.invierno?.fotoLugar ?? (p.foto === 'kioto-sakura' ? 'Heian-jingū' : 'Kiyomizu-dera')
  const emoji = p.temporada === 'invierno' ? '❄️' : p.temporada === 'sakura' ? '🌸' : '🍁'
  const familia = hermanas(p)
  // La otra estación en el mismo idioma: del otoño se salta a la sakura y al revés.
  // (El invierno no entra aquí: desde él se enlazan las dos, abajo.)
  const otra = p.temporada === 'invierno' ? undefined : Object.values(P).find((x) => x.lang === p.lang && x.temporada !== p.temporada && x.temporada !== 'invierno')
  const otrasInvierno = p.temporada === 'invierno' ? (['otono', 'sakura'] as const).map((t) => Object.values(P).find((x) => x.lang === p.lang && x.temporada === t)).filter((x): x is PaginaOtono => !!x) : []
  const pie = PIE[p.lang]
  const ld = p.productos && p.invierno ? ldInvierno(p) : {
    '@context': 'https://schema.org', '@type': 'TouristTrip',
    name: p.seo.titulo.split(' | ')[0], description: p.seo.descripcion, url: `${BASE}${p.ruta}`, inLanguage: p.lang,
    touristType: PUBLICO[p.lang],
    itinerary: { '@type': 'ItemList', itemListElement: p.sitios.map((s, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'TouristAttraction', name: s.nombre } })) },
    offers: [
      { '@type': 'Offer', name: p.medio, price: PRECIO.medio, priceCurrency: 'JPY', url: `${BASE}${p.ruta}` },
      { '@type': 'Offer', name: p.completo, price: PRECIO.completo, priceCurrency: 'JPY', url: `${BASE}${p.ruta}` },
    ],
    // El negocio es el #negocio común del index.html; el teléfono va en la persona de cada guía.
    provider: { '@type': 'Person', name: p.guia === 'larion' ? 'Larion' : GUIAS.tony.nombre, ...contactoLd(p.guia), worksFor: { '@id': `${BASE}/#negocio` } },
  }

  return (
    <div className={`v7 v7-pagina v7-otono lang-${p.lang}`} lang={p.lang} dir={dir}>
      <Helmet>
        <html lang={p.lang} dir={dir} />
        <title>{p.seo.titulo}</title>
        <meta name="description" content={p.seo.descripcion} />
        <link rel="canonical" href={`${BASE}${p.ruta}`} />
        {enlacesHreflang(familia.map((x) => ({ lang: x.lang, href: `${BASE}${x.ruta}` })))}
        <meta property="og:title" content={p.seo.titulo} />
        <meta property="og:description" content={p.seo.descripcion} />
        <meta property="og:url" content={`${BASE}${p.ruta}`} />
        <meta property="og:image" content={`${BASE}/v8/og/kyoto.jpg`} />
        <script type="application/ld+json">{JSON.stringify(ld)}</script>
      </Helmet>

      <header className="v7-cabecera cristal">
        <Link to={p.inicio} className="v7-marca" aria-label="Tony Kansai Guide"><Logo /></Link>
        <nav className="v7-idiomas" aria-label="Language">
          {familia.map((x) => (
            <Link key={x.ruta} to={x.ruta} lang={x.lang} aria-current={x === p ? 'page' : undefined}>{NOMBRE_LANG[x.lang]}</Link>
          ))}
        </nav>
        <a className={`v7-boton v7-boton-peq${claseBoton}`} href={wa} target="_blank" rel="noopener noreferrer" aria-label={`${visible(p.final.boton)}`}>
          <span className="v7-solo-ancho">{visible(p.final.boton)}</span><span className="v7-solo-movil"><IconoCanal tg={tg} /></span>
        </a>
      </header>

      <main>
        <section className="v7-otono-hero">
          <img {...foto(hero, '(max-width: 820px) calc(100vw - 32px), 50vw')} alt={p.sitios[0]?.nombre ?? lugar} {...{ fetchpriority: 'high' }} />
          <div className="v7-otono-hero-texto">
            <p className="v7-antetitulo">{emoji} {p.antetitulo}</p>
            <h1>{p.titulo}</h1>
            <p>{p.sub}</p>
            <a className={`v7-boton${claseBoton}`} href={wa} target="_blank" rel="noopener noreferrer"
              onClick={() => window.gtag?.('event', 'generate_lead', { pagina: id, canal })}><IconoCanal tg={tg} /> {visible(p.cta)}</a>
          </div>
        </section>

        {p.invierno && (
          <section className="v7-seccion v7-invierno-esencial" aria-labelledby="esencial">
            <h2 id="esencial">{p.invierno.esencial.titulo}</h2>
            <dl>
              {p.invierno.esencial.puntos.map((x) => <div key={x.k}><dt>{x.k}</dt><dd>{x.v}</dd></div>)}
            </dl>
          </section>
        )}

        <section className="v7-seccion">
          <h2>{p.cuando.titulo}</h2>
          {p.cuando.texto.map((t) => <p key={t} className="v7-entradilla">{t}</p>)}
        </section>

        {p.sitios.length > 0 && <section className="v7-seccion">
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
        </section>}

        {p.dia.length > 0 && <section className="v7-seccion">
          <h2>{p.diaTitulo}</h2>
          <ol className="v7-otono-dia">
            {p.dia.map((d) => <li key={d.h}><span>{d.h}</span><p>{d.t}</p></li>)}
          </ol>
          <p className="v7-otono-nota">{p.diaNota}</p>
        </section>}

        {p.productos && p.invierno && <Tours p={p} productos={p.productos} pagar={pagar} id={id} />}

        {!p.productos && <section className="v7-seccion" id="precios">
          <h2>{visible(p.preciosTitulo)}</h2>
          <div className="v7-planes">
            {([['medio', p.medio], ['completo', p.completo]] as const).map(([k, nombre]) => (
              <article key={k} className={`v7-plan tarjeta ${k === 'completo' ? 'v7-plan-destacado' : ''}`}>
                <h3>{nombre}</h3>
                <p className="v7-plan-precio"><bdi>{yenLocal(PRECIO[k], p.lang)}</bdi></p>
                <p className="v7-plan-grupo">{visible(p.porGrupo)}</p>
                <p className="v7-plan-persona">{p.porPersona(yenLocal(PRECIO[k] / 4, p.lang))}</p>
                {pagar && <a className="v7-plan-pagar" href={`${PAYPAL_TONY}/${PRECIO[k]}JPY`} target="_blank" rel="noopener noreferrer">{pagar.boton}</a>}
              </article>
            ))}
          </div>
          <ul className="v7-notas">
            {pagar && <li>{pagar.nota}</li>}
            {p.notas.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </section>}

        {p.invierno && (
          <section className="v7-seccion" id="calendario">
            <h2>{p.invierno.calendario.titulo}</h2>
            <p className="v7-entradilla">{p.invierno.calendario.intro}</p>
            <ol className="v7-invierno-cal">
              {p.invierno.calendario.eventos.map((e) => (
                <li key={e.nombre}>
                  <span className="v7-invierno-fecha">{e.fecha}</span>
                  <div>
                    <h3>{e.nombre}</h3>
                    <p>{e.texto}</p>
                  </div>
                  <span className={`v7-invierno-estado${e.confirmado ? ' ok' : ''}`}>{e.confirmado ? p.invierno!.calendario.confirmado : p.invierno!.calendario.sinConfirmar}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="v7-seccion">
          <h2>{p.consejosTitulo}</h2>
          <ul className="v7-notas">{p.consejos.map((c) => <li key={c}>{c}</li>)}</ul>
        </section>

        {p.invierno && (
          <section className="v7-seccion" id="preguntas">
            <h2>{p.invierno.faq.titulo}</h2>
            <div className="v7-faq">
              {p.invierno.faq.preguntas.map((f) => (
                <details key={f.p} className="tarjeta"><summary>{f.p}</summary><p>{f.r}</p></details>
              ))}
            </div>
          </section>
        )}

        <section className="v7-seccion v7-otono-final">
          <h2>{p.final.titulo}</h2>
          <p className="v7-entradilla">{p.final.texto}</p>
          <a className={`v7-boton${claseBoton}`} href={wa} target="_blank" rel="noopener noreferrer"
            onClick={() => window.gtag?.('event', 'generate_lead', { pagina: id, canal })}><IconoCanal tg={tg} /> {visible(p.final.boton)}</a>
          {otra && p.temporada !== 'invierno' && <p className="v7-temporada-enlace"><Link to={otra.ruta}>{OTRA_TXT[p.temporada][p.lang]} →</Link></p>}
          {otrasInvierno.length > 0 && (
            <nav className="v7-invierno-hermanas" aria-label={p.invierno?.hermanasTitulo}>
              <h3>{p.invierno?.hermanasTitulo}</h3>
              {/* El texto de OTRA_TXT «al revés»: el de la sakura invita al otoño y viceversa. */}
              {otrasInvierno.map((x) => <p key={x.ruta} className="v7-temporada-enlace"><Link to={x.ruta}>{OTRA_TXT[x.temporada === 'otono' ? 'sakura' : 'otono'][p.lang]} →</Link></p>)}
            </nav>
          )}
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
            <Link to={`/legal/?lang=${p.lang}`}>{pie.legal}</Link>
            <Link to={`/terms/?lang=${p.lang}`}>{pie.condiciones}</Link>
            <Link to={`/privacy/?lang=${p.lang}`}>{pie.privacidad}</Link>
          </nav>
        </div>
        <details className="v7-creditos">
          <summary>{pie.creditos}</summary>
          <ul lang="es" dir="ltr">
            <li>{lugar}: <a href={credito.url} target="_blank" rel="noopener noreferrer">{credito.autor}</a>, {credito.licencia}</li>
          </ul>
        </details>
      </footer>
    </div>
  )
}

/** Los tours de invierno: cada uno con su precio por grupo, fechas, ruta y qué incluye. */
function Tours({ p, productos, pagar, id }: { p: PaginaOtono; productos: NonNullable<PaginaOtono['productos']>; pagar?: { boton: string; nota: string }; id: OtonoId }) {
  const ex = p.invierno!
  const et = ex.tours.etiquetas
  return (
    <section className="v7-seccion" id="precios">
      <h2>{ex.tours.titulo}</h2>
      <p className="v7-entradilla">{ex.tours.intro}</p>
      <div className="v7-invierno-tours">
        {productos.map((pr, i) => (
          <article key={pr.id} id={pr.id} className="v7-invierno-tour tarjeta">
            <p className="v7-invierno-letra" aria-hidden="true">{String.fromCharCode(65 + i)}</p>
            <h3>{pr.nombre}</h3>
            <p className="v7-invierno-resumen">{pr.resumen}</p>
            <div className="v7-invierno-precios">
              {pr.precios.map((t) => (
                <div key={t.etiqueta}>
                  <span className="v7-invierno-etiqueta">{t.etiqueta}</span>
                  <span className="v7-plan-precio"><bdi>{yenLocal(t.yen, p.lang)}</bdi></span>
                  <span className="v7-plan-grupo">{visible(p.porGrupo)} · {p.porPersona(yenLocal(t.yen / 4, p.lang))}</span>
                  {pagar && <a className="v7-invierno-pagar" href={`${PAYPAL_TONY}/${t.yen}JPY`} target="_blank" rel="noopener noreferrer">{pagar.boton}</a>}
                </div>
              ))}
            </div>
            <dl className="v7-invierno-datos">
              <div><dt>{et.duracion}</dt><dd>{pr.duracion}</dd></div>
              <div><dt>{et.fechas}</dt><dd>{pr.fechas}</dd></div>
              <div><dt>{et.para}</dt><dd>{pr.para}</dd></div>
            </dl>
            <details className="v7-invierno-ruta">
              <summary>{et.ruta}</summary>
              <ol className="v7-otono-dia">
                {pr.ruta.map((d) => <li key={d.h + d.t}><span>{d.h}</span><p>{d.t}</p></li>)}
              </ol>
            </details>
            <div className="v7-invierno-incluye">
              <div><h4>{et.incluye}</h4><ul className="v7-notas">{pr.incluye.map((x) => <li key={x}>{x}</li>)}</ul></div>
              <div><h4>{et.noIncluye}</h4><ul className="v7-invierno-no">{pr.noIncluye.map((x) => <li key={x}>{x}</li>)}</ul></div>
            </div>
            <a className="v7-boton" href={enlaceGuia(p.guia, ex.saludoTour(pr.nombre))} target="_blank" rel="noopener noreferrer"
              onClick={() => window.gtag?.('event', 'generate_lead', { pagina: id, canal: 'whatsapp', tour: pr.id })}><IconoCanal tg={false} /> {et.reservar}</a>
          </article>
        ))}
      </div>
      <ul className="v7-notas">
        {pagar && <li>{pagar.nota}</li>}
        {p.notas.map((n) => <li key={n}>{n}</li>)}
      </ul>
    </section>
  )
}

/** JSON-LD del invierno: la página, las migas, las preguntas y cada tour con sus
 *  ofertas en yenes por grupo (con fechas de validez), como PaginaRespuesta. */
function ldInvierno(p: PaginaOtono) {
  const ex = p.invierno!
  const url = `${BASE}${p.ruta}`
  const proveedor = { '@type': 'Person', '@id': `${BASE}/#tony`, name: GUIAS.tony.nombre, ...contactoLd('tony'), worksFor: { '@id': `${BASE}/#negocio` } }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage', '@id': url, url, name: p.seo.titulo.split(' | ')[0], description: p.seo.descripcion,
        inLanguage: p.lang, image: `${BASE}/v8/og/kyoto.jpg`,
        publisher: { '@id': `${BASE}/#negocio` }, author: { '@id': `${BASE}/#tony` },
        breadcrumb: { '@id': `${url}#migas` },
      },
      {
        '@type': 'BreadcrumbList', '@id': `${url}#migas`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Tony Kansai Guide', item: `${BASE}${p.inicio}` },
          { '@type': 'ListItem', position: 2, name: p.titulo.replace(/\.$/, ''), item: url },
        ],
      },
      {
        '@type': 'FAQPage', '@id': `${url}#faq`, inLanguage: p.lang,
        mainEntity: ex.faq.preguntas.map((f) => ({ '@type': 'Question', name: f.p, acceptedAnswer: { '@type': 'Answer', text: f.r } })),
      },
      ...p.productos!.map((pr) => ({
        '@type': ['TouristTrip', 'Product'], '@id': `${url}#${pr.id}`, name: pr.nombre, description: pr.resumen,
        url: `${url}#${pr.id}`, image: `${BASE}/v8/og/kyoto.jpg`, inLanguage: p.lang, touristType: ex.touristType,
        brand: { '@id': `${BASE}/#negocio` },
        itinerary: { '@type': 'ItemList', itemListElement: pr.paradas.map((n, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'TouristAttraction', name: n } })) },
        provider: proveedor,
        offers: pr.precios.map((t) => ({
          '@type': 'Offer', name: `${pr.nombre} · ${t.etiqueta}`, price: t.yen, priceCurrency: 'JPY',
          validFrom: t.desde, priceValidUntil: t.hasta, availability: 'https://schema.org/InStock', url: `${url}#${pr.id}`,
          // Precio por grupo privado (hasta 6), no por persona.
          eligibleQuantity: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 6, unitText: 'people per private group' },
        })),
      })),
    ],
  }
}
