// Página «el día, hora a hora»: una viñeta a pantalla completa por ruta, como
// un manga. Cada foto entra con un corte diagonal al hacer scroll y, encima,
// sube la hoja de papel con el día paso a paso. Es la respuesta a «el cliente
// no sabe qué va a hacer ese día y se inquieta».
//
// Rutas: Tony /es/rutas/, /en/routes/, /ar/routes/; Larion /ru/routes/, /larion/routes/.

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import { GUIAS, CORREO, CREDITOS } from './contenido'
import { ETIQUETAS, PRECIO } from './datosRutas'
import { ET_ITIN, HORAS, ITINERARIOS, META_ITIN, ORDEN_LARION, ORDEN_TONY } from './datosItinerarios'
import type { ItinId } from './datosItinerarios'
import { foto } from './foto'
import { BASE, PAGINAS_ITIN, SEO_ITIN as SEO } from './seoItin'
import type { ItinPaginaId } from './seoItin'
import { BotonSonido } from './BotonSonido'
import { CREDITOS_SONIDO, suena } from './sonido'
import { Logo } from './Logo'
import { BarraWa } from './BarraWa'
import { MANGA_APROBADO } from '../v8/ciudades'

// Viñeta manga del guía para cada día (la misma que su página de ciudad).
const CIUDAD_DE: Partial<Record<ItinId, string>> = { kioto: 'kyoto', osaka: 'osaka', nara: 'nara', himeji: 'himeji', kobe: 'kobe', hiroshima: 'hiroshima' }
import './v7.css'
import './estilo-pixel.css'
import { IconoWa } from './IconoWa'
import { BotonTema } from './Tema'
import { enlacesHreflang } from '../seo/hreflang'
import {yenLocal, PIE } from './formato'

export type { ItinPaginaId } from './seoItin'
type Lengua = 'es' | 'en' | 'ar' | 'ru'

const SALUDO: Record<Lengua, (guia: string, dia: string) => string> = {
  es: (g, d) => `Hola ${g}, te escribo desde la página de rutas.\n\nMe interesa el día: ${d}\nFechas:\nPersonas:\nHotel:`,
  en: (g, d) => `Hi ${g}, I'm writing from the itineraries page.\n\nI'm interested in: ${d}\nDates:\nPeople:\nHotel:`,
  ar: (g, d) => `السلام عليكم يا ${g}، أراسلك من صفحة البرامج.\n\nيهمني يوم: ${d}\nالتواريخ:\nعدد الأشخاص:\nالفندق:`,
  ru: (g, d) => `Здравствуйте, ${g}! Пишу со страницы маршрутов.\n\nИнтересует день: ${d}\nДаты:\nСколько человек:\nОтель:`,
}

const nombreGuia = (g: 'tony' | 'larion', lang: Lengua) => (lang === 'ar' && g === 'tony' ? 'طوني' : lang === 'ru' ? 'Ларион' : g === 'tony' ? 'Tony' : 'Larion')

export default function Itinerarios({ id }: { id: ItinPaginaId }) {
  const pg = PAGINAS_ITIN[id]
  const { lang, guia } = pg
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const et = ET_ITIN[lang]
  const textos = ITINERARIOS[lang]
  const orden = (guia === 'larion' ? ORDEN_LARION : ORDEN_TONY).filter((i) => textos[i])
  const hermanas = (Object.keys(PAGINAS_ITIN) as ItinPaginaId[]).filter((k) => PAGINAS_ITIN[k].guia === guia)
  const g = nombreGuia(guia, lang)
  const { setLang } = useLanguage()
  const flecha = dir === 'rtl' ? '←' : '→'

  useEffect(() => { setLang(lang) }, [lang, setLang])

  // Al llegar desde una ruta de la portada (#kioto…), ir a su viñeta: el
  // router vuelve arriba al cambiar de página y se pierde el ancla.
  useEffect(() => {
    const ancla = decodeURIComponent(window.location.hash.slice(1))
    if (!ancla) return
    const t = window.setTimeout(() => document.getElementById(ancla)?.scrollIntoView(), 60)
    return () => clearTimeout(t)
  }, [id])

  // Cada viñeta que entra suena a fūrin (si el sonido está encendido).
  useEffect(() => {
    const vistas = new Set<Element>()
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting && !vistas.has(e.target)) { vistas.add(e.target); suena('furin') }
    }), { threshold: 0.5 })
    document.querySelectorAll('.v7-itin-panel').forEach((x) => io.observe(x))
    return () => io.disconnect()
  }, [id])

  const yen = (n: number) => yenLocal(n, lang)
  const wa = (texto: string) => `https://wa.me/${GUIAS[guia].wa}?text=${encodeURIComponent(SALUDO[lang](g, texto))}`

  return (
    <div className={`v7 v7-pagina v7-itinerarios lang-${lang}`} lang={lang} dir={dir}>
      <Helmet>
        <html lang={lang} dir={dir} />
        <title>{SEO[id].titulo}</title>
        <meta name="description" content={SEO[id].descripcion} />
        <link rel="canonical" href={`${BASE}${pg.ruta}`} />
        {enlacesHreflang(hermanas.map((k) => ({ lang: PAGINAS_ITIN[k].lang, href: `${BASE}${PAGINAS_ITIN[k].ruta}` })))}
        <meta property="og:title" content={SEO[id].titulo} />
        <meta property="og:description" content={SEO[id].descripcion} />
        <meta property="og:url" content={`${BASE}${pg.ruta}`} />
        <meta property="og:image" content={`${BASE}${META_ITIN[orden[0]].foto}`} />
      </Helmet>

      <header className="v7-cabecera cristal">
        <Link to={pg.ciudad} className="v7-marca" aria-label="Tony Kansai Guide"><Logo /></Link>
        <nav className="v7-anclas">
          <Link to={pg.ciudad}>{flecha === '→' ? '←' : '→'} {et.volver}</Link>
        </nav>
        <nav className="v7-idiomas" aria-label="Language">
          {hermanas.map((k) => (
            <Link key={k} to={PAGINAS_ITIN[k].ruta} lang={PAGINAS_ITIN[k].lang} aria-current={k === id ? 'page' : undefined}>{PAGINAS_ITIN[k].etiqueta}</Link>
          ))}
        </nav>
        <BotonTema lang={lang} />
        <BotonSonido lang={lang} ambiente="ciudad" />
        <a className="v7-boton v7-boton-peq" href={wa('')} target="_blank" rel="noopener noreferrer" aria-label={`${g} — WhatsApp`}>
          <span className="v7-solo-ancho">WhatsApp</span><span className="v7-solo-movil"><IconoWa /></span>
        </a>
      </header>

      <main>
        <section className="v7-seccion v7-itin-intro">
          <h1>{et.titulo}</h1>
          <p className="v7-entradilla">{et.sub}</p>
          <nav className="v7-itin-indice" aria-label={et.titulo}>
            {orden.map((i) => (
              <a key={i} href={`#${i}`}><span lang="ja">{META_ITIN[i].kanji}</span>{textos[i]!.titulo}</a>
            ))}
          </nav>
        </section>

        {orden.map((i, n) => {
          const t = textos[i]!
          const m = META_ITIN[i]
          return (
            <article key={i} id={i} className="v7-itin" aria-labelledby={`t-${i}`}>
              <div className="v7-itin-panel">
                <img loading={n === 0 ? 'eager' : 'lazy'} {...foto(m.foto)} alt="" decoding="async" />
                <span className="v7-itin-trama" aria-hidden="true" />
                <span className="v7-itin-kanji" lang="ja" aria-hidden="true">{m.kanji}</span>
                {CIUDAD_DE[i] && MANGA_APROBADO.includes(`${guia}-${CIUDAD_DE[i]}`) && (
                  <img loading="lazy" className="v7-itin-vineta" src={`/v8/manga/${guia}-${CIUDAD_DE[i]}.webp`} alt="" decoding="async" />
                )}
                <div className="v7-itin-titulo">
                  <p className="v7-itin-num"><bdi>{String(n + 1).padStart(2, '0')} / {String(orden.length).padStart(2, '0')}</bdi></p>
                  <h2 id={`t-${i}`}>{t.titulo}</h2>
                  <p className="v7-itin-llegar">{t.llegar}</p>
                </div>
              </div>

              <div className="v7-itin-hoja">
                <p className="v7-itin-resumen">{t.resumen}</p>
                <h3>{et.dia}</h3>
                <ol className="v7-itin-pasos">
                  {t.pasos.map((p, k) => (
                    <li key={p.lugar}>
                      <time><bdi>{HORAS[i][k]}</bdi></time>
                      <div><strong>{p.lugar}</strong><p>{p.que}</p></div>
                    </li>
                  ))}
                </ol>
                <div className="v7-itin-notas">
                  <div><h3>{et.comer}</h3><p>{t.comer}</p></div>
                  <div><h3>{et.ojo}</h3><p>{t.ojo}</p></div>
                </div>
                <div className="v7-itin-pie">
                  <p className="v7-itin-precio">
                    <span>{ETIQUETAS[lang].nombres[m.tramo]}</span>
                    <strong>{m.tramo === 'lejos' && <small>{ETIQUETAS[lang].desdePrecio} </small>}<bdi>{yen(PRECIO[m.tramo])}</bdi></strong>
                    <small>{et.porGrupo}{m.viajeGuia ? ` ${et.viajeGuia}` : ''}</small>
                  </p>
                  <a className="v7-boton" href={wa(t.titulo)} target="_blank" rel="noopener noreferrer"
                    onClick={() => window.gtag?.('event', 'generate_lead', { pagina: id, ruta: i, canal: 'whatsapp_itinerario' })}>
                    {et.pedir}
                  </a>
                </div>
                {orden[n + 1] && <a className="v7-itin-siguiente" href={`#${orden[n + 1]}`}>{et.siguiente}: {textos[orden[n + 1]]!.titulo} ↓</a>}
              </div>
            </article>
          )
        })}

        <section className="v7-seccion">
          <p className="v7-entradilla">{et.nota}</p>
        </section>
      </main>
      <BarraWa href={wa('')} lang={lang} pagina={`itinerarios-${id}`} />

      <footer className="v7-pie">
        <div className="v7-pie-fila">
          <div><strong>Tony Kansai Guide</strong><p><a href={`mailto:${CORREO}`}>{CORREO}</a></p></div>
          <nav>
            <Link to={`/legal?lang=${lang}`}>{(PIE[lang] ?? PIE.en).legal}</Link>
            <Link to={`/terms?lang=${lang}`}>{(PIE[lang] ?? PIE.en).condiciones}</Link>
            <Link to={`/privacy?lang=${lang}`}>{(PIE[lang] ?? PIE.en).privacidad}</Link>
          </nav>
        </div>
        <details className="v7-creditos">
          <summary>{(PIE[lang] ?? PIE.en).creditos}</summary>
          <ul lang="es" dir="ltr">
            {[...CREDITOS, ...CREDITOS_ITIN].map((c) => <li key={c.url}>{c.foto}: <a href={c.url} target="_blank" rel="noopener noreferrer">{c.autor}</a>, {c.licencia}</li>)}
            {CREDITOS_SONIDO.map((c) => <li key={c.url}>Sonido «{c.sonido}»: <a href={c.url} target="_blank" rel="noopener noreferrer">{c.autor}</a>, {c.licencia}</li>)}
          </ul>
        </details>
      </footer>
    </div>
  )
}

// Fotos de fuera de Kansai; las de Kansai vienen de CREDITOS (contenido.ts).
const CREDITOS_ITIN = [
  { foto: 'Hakone — lago Ashi y monte Fuji', autor: 'Charlie fong', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Lake_Ashi_%26_Mt_Fuji_%26_Hakone_Shrine.jpg' },
  { foto: 'Tokio — Kaminarimon, Asakusa', autor: 'Asanagi', licencia: 'CC0', url: 'https://commons.wikimedia.org/wiki/File:Kaminarimon_2020-04-19.jpg' },
  { foto: 'Nagano — monos de Jigokudani', autor: 'Bryan Ledgard', licencia: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Snow_monkeys,_Jigokudani,_Yudanaka_(6289601359).jpg' },
  { foto: 'Fukuoka — Dazaifu Tenmangū', autor: 'Jakub Hałun', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:20100719_Dazaifu_Tenmangu_Shrine_3328.jpg' },
]
