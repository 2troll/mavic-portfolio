// Páginas de temporada en Kioto: otoño (momiji) y primavera (sakura), en es/en/ar/ru.
// Las rusas son de Larion (su WhatsApp, sin PayPal).
// Es la que se enseña en anuncios y publicaciones de octubre y noviembre, y la
// que busca quien viene a ver los arces rojos. Los textos, en datosOtono.ts.

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import { GUIAS, CORREO, PAYPAL_TONY, PAGAR, WA_LARION } from './contenido'
import { foto } from './foto'
import { Logo } from './Logo'
import { IconoWa } from './IconoWa'
import { BarraWa } from './BarraWa'
import { BotonTema } from './Tema'
import { enlacesHreflang } from '../seo/hreflang'
import { yenLocal, PIE } from './formato'
import creditosZonas from '../v8/creditosZonas.json'
import { OTONO, PRECIO_OTONO, hermanas } from './datosOtono'
import type { OtonoId } from './datosOtono'
import './v7.css'
import './estilo-pixel.css'

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

  const wa = `https://wa.me/${p.guia === 'larion' ? WA_LARION : GUIAS.tony.wa}?text=${encodeURIComponent(p.saludo)}`
  // El PayPal es de Tony: en las páginas de Larion no se ofrece.
  const pagar = p.guia === 'tony' ? PAGAR[p.lang] : undefined
  const dir = p.lang === 'ar' ? 'rtl' : 'ltr'
  const hero = `/v8/zonas/${p.foto}.jpg`
  const credito = CREDITOS[p.foto]
  const lugar = p.foto === 'kioto-sakura' ? 'Heian-jingū' : 'Kiyomizu-dera'
  const emoji = p.temporada === 'sakura' ? '🌸' : '🍁'
  const familia = hermanas(p)
  // La otra estación en el mismo idioma: del otoño se salta a la sakura y al revés.
  const otra = Object.values(P).find((x) => x.lang === p.lang && x.temporada !== p.temporada)
  const pie = PIE[p.lang]
  const ld = {
    '@context': 'https://schema.org', '@type': 'TouristTrip',
    name: p.seo.titulo.split(' | ')[0], description: p.seo.descripcion, url: `${BASE}${p.ruta}`, inLanguage: p.lang,
    touristType: PUBLICO[p.lang],
    itinerary: { '@type': 'ItemList', itemListElement: p.sitios.map((s, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'TouristAttraction', name: s.nombre } })) },
    offers: [
      { '@type': 'Offer', name: p.medio, price: PRECIO.medio, priceCurrency: 'JPY', url: `${BASE}${p.ruta}` },
      { '@type': 'Offer', name: p.completo, price: PRECIO.completo, priceCurrency: 'JPY', url: `${BASE}${p.ruta}` },
    ],
    provider: { '@type': 'LocalBusiness', name: 'Tony Kansai Guide', url: BASE, telephone: `+${p.guia === 'larion' ? WA_LARION : GUIAS.tony.wa}`, email: CORREO },
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
        <BotonTema lang={p.lang} />
        <a className="v7-boton v7-boton-peq" href={wa} target="_blank" rel="noopener noreferrer" aria-label={`${p.final.boton}`}>
          <span className="v7-solo-ancho">{p.final.boton}</span><span className="v7-solo-movil"><IconoWa /></span>
        </a>
      </header>

      <main>
        <section className="v7-otono-hero">
          <img {...foto(hero, '(max-width: 820px) calc(100vw - 32px), 50vw')} alt={p.sitios[0].nombre} {...{ fetchpriority: 'high' }} />
          <div className="v7-otono-hero-texto">
            <p className="v7-antetitulo">{emoji} {p.antetitulo}</p>
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
                {pagar && <a className="v7-plan-pagar" href={`${PAYPAL_TONY}/${PRECIO[k]}JPY`} target="_blank" rel="noopener noreferrer">{pagar.boton}</a>}
              </article>
            ))}
          </div>
          <ul className="v7-notas">
            {pagar && <li>{pagar.nota}</li>}
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
          {otra && <p className="v7-temporada-enlace"><Link to={otra.ruta}>{OTRA_TXT[p.temporada][p.lang]} →</Link></p>}
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
            <li>{lugar}: <a href={credito.url} target="_blank" rel="noopener noreferrer">{credito.autor}</a>, {credito.licencia}</li>
          </ul>
        </details>
      </footer>
    </div>
  )
}
