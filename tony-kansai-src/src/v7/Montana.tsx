// Página de montaña (una por idioma): /es/montana/, /en/hiking/, /ar/hiking/, /ru/hiking/.

import { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { HIKING_ROUTES } from '../lib/data'
import { useLanguage } from '../contexts/LanguageContext'
import { GUIAS, CORREO, PAGAR, PAGINAS, enlaceGuia, contactoLd, NOTA_TG } from './contenido'
import { PagosAdelantado } from './Pagos'
import { CabeceraEs } from './CabeceraEs'
import { PieEs } from './PieEs'
import { CabeceraEn } from './CabeceraEn'
import { PieEn } from './PieEn'
import resenasTony from '../../public/reviews.json'
import { MONTANA, MONTES, KANJI, CIUDAD, CIMA, VENTA_ES } from './datosMontana'
import type { MontanaId, MonteId } from './datosMontana'
import { MontesScroll } from './MontesScroll'
import { EfectoEstacion, estacionDeHoy } from './Estacion'
import { useEstacion } from './Estaciones'
import { BotonSonido } from './BotonSonido'
import { CREDITOS_SONIDO } from './sonido'
import { Logo } from './Logo'
import './v7.css'
import './expedicion.css'
import { Atlas, Corte, Medidor, Meses } from './Expedicion'
import { PortadaViva, Travesia, SelloMetal, Altimetro, CintaMontes, useSuave, useRevelados, usePila, suaveA } from './MontanaViva'
import { EXP, CREDITOS as CREDITOS_FOTO } from './datosExpedicion'
import { IconoCanal } from './IconoWa'
import { BarraWa } from './BarraWa'
import { enlacesHreflang } from '../seo/hreflang'
import { milesLocal, yenLocal, PIE } from './formato'
import { FranjaVentajas } from './FranjaVentajas'
import { Cumbres, Banda, datosCumbres } from './Cumbres'
import '@fontsource-variable/oswald'
import '@fontsource-variable/source-serif-4'
import './montana-pro.css'
import './montana-neon.css'
import './montana-movil.css'
import './montana-venta.css'
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
          provider: { '@type': 'Person', name: g.nombre, ...contactoLd(p.guias[0]), worksFor: { '@id': `${BASE}/#negocio` } },
          ...(precio > 0 ? { offers: { '@type': 'Offer', price: precio, priceCurrency: 'JPY', availability: 'https://schema.org/InStock', url: `${BASE}${p.ruta}`,
            eligibleQuantity: { '@type': 'QuantitativeValue', maxValue: 6, unitText: 'people per group' } } } : {}),
        },
      }
    }),
  }
}
const ruta = (id: MonteId) => HIKING_ROUTES.find((r) => r.id === id) as Ruta

/** Reseñas reales de Tony (public/reviews.json): nota media, total y tres citas.
 *  No son de senderismo en concreto y así se dice en el título. */
type ResenaTony = { id: string; stars: number; name: string; country?: string; tour?: string; text: string }
const RESENAS_TONY = ((resenasTony as unknown as { reviews: ResenaTony[] }).reviews ?? []).filter((r) => r?.text && r.stars)
const CITAS_ES = ['mvg2jpb2-551fd9ca', 'mw1u2lxq-6143f264', 'mw20iy6v-9646e097']

/** Arriba del todo en /es/montana/: qué es, cuánto cuesta, qué incluye y el botón. */
function VentaEs({ onRutas }: { onRutas: () => void }) {
  const v = VENTA_ES
  const wa = enlaceGuia('tony', v.saludo)
  const media = RESENAS_TONY.length ? RESENAS_TONY.reduce((a, r) => a + r.stars, 0) / RESENAS_TONY.length : 0
  const citas = CITAS_ES.map((id) => RESENAS_TONY.find((r) => r.id === id)).filter((r): r is ResenaTony => !!r)
  const yen = (n: number) => yenLocal(n, 'es')
  return (
    <section className="mv-venta" aria-labelledby="mv-venta-titulo">
      <div className="mv-venta-cuerpo">
        <p className="ex-kicker"><span className="ex-regla" aria-hidden="true" />{v.kicker}</p>
        <h2 id="mv-venta-titulo">{v.titulo}</h2>
        <p className="mv-venta-sub">{v.sub}</p>
        <div className="mv-venta-acciones">
          <a className="v7-boton" href={wa} target="_blank" rel="noopener noreferrer"
            onClick={() => window.gtag?.('event', 'generate_lead', { pagina: 'm-es', canal: 'whatsapp_montana', sitio: 'venta' })}>
            <IconoCanal tg={false} /> {v.boton}</a>
          <button type="button" className="mv-venta-rutas" onClick={onRutas}>{v.verRutas} <span aria-hidden="true">↓</span></button>
        </div>
      </div>
      <div className="mv-venta-ficha">
        <p className="mv-venta-precio"><strong>{yen(v.precio.yen)}</strong> <span>{v.precio.etiqueta}</span></p>
        <p className="mv-venta-nota">{v.precio.nota}</p>
        <p className="mv-venta-nota">{v.corto.texto}: <b>{yen(v.corto.yen)}</b>.</p>
        <h3>Incluye</h3>
        <ul className="mv-venta-incluye">{v.incluye.map((x) => <li key={x}>{x}</li>)}</ul>
        <p className="mv-venta-nota">{v.noIncluye}</p>
        <p className="mv-venta-nota">{v.pago}</p>
      </div>
      {citas.length > 0 && (
        <div className="mv-venta-resenas">
          <h3>{v.resenas.titulo} <span className="mv-venta-media"><span aria-hidden="true">★</span> {media.toFixed(1).replace('.', ',')} · {RESENAS_TONY.length} {v.resenas.de}</span></h3>
          <ul>
            {citas.map((r) => (
              <li key={r.id}>
                <blockquote>«{r.text.trim()}»</blockquote>
                <p>{r.name.trim()}{r.country ? `, ${r.country.trim()}` : ''}{r.tour ? ` · ${r.tour}` : ''}</p>
              </li>
            ))}
          </ul>
          <p><Link to="/es/#resenas">{v.resenas.todas} →</Link></p>
        </div>
      )}
    </section>
  )
}

export default function Montana({ id }: { id: MontanaId }) {
  const p = MONTANA[id]
  const raiz = useRef<HTMLDivElement>(null)
  useSuave()
  useRevelados(raiz)
  const temporada = useEstacion()
  usePila(raiz)
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
  // Larion va por Telegram (enlaceGuia lo decide; t.me no lleva texto).
  const wa = (g: 'tony' | 'larion', texto: string) => enlaceGuia(g, p.saludo(nombreGuia(g), texto))
  const tg = !!GUIAS[p.guias[0]].tg
  const es = p.lang === 'es'
  // /en/hiking/ (de Tony): la cabecera y el pie ingleses comunes, como en español.
  const en = p.lang === 'en'

  // Salta al capítulo i del relieve 3D (0 = portada del relieve): el progreso
  // de MontesScroll es lineal con el scroll de su sección.
  const irA3d = (i: number) => {
    const el = document.querySelector<HTMLElement>('.v7-montes')
    if (!el) return
    const recorrido = el.offsetHeight - window.innerHeight
    const top = el.getBoundingClientRect().top + window.scrollY + (recorrido * i) / MONTES.length
    suaveA(top)
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
          <a className={`v7-boton v7-boton-peq${tg ? ' v7-tg' : ''}`} href={wa(p.guias[0], tc(r.title))} target="_blank" rel="noopener noreferrer"
            onClick={() => window.gtag?.('event', 'generate_lead', { pagina: p.id, ruta: m, canal: tg ? 'telegram_montana' : 'whatsapp_montana' })}>
            {p.et.pedir}
          </a>
        </div>
        {pagar && (
          <p className="v7-monte-pagar">
            <PagosAdelantado lang={p.lang} pagina={p.id} valor={yenes} className="v7-pagos-linea" />
            <span>{pagar.nota}</span>
          </p>
        )}
      </article>
    )
  }

  return (
    <div ref={raiz} className={`v7 v7-pagina v7-montana v7-expedicion lang-${p.lang} tp-${temporada}`} lang={p.lang} dir={p.dir}>
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

      {/* En español, la cabecera común; envuelta en un .v7 claro porque su estilo
          (y el del pie) va fuera de .v7-expedicion. */}
      {es ? <div className="v7 lang-es mv-comun"><CabeceraEs enPagina={[{ texto: 'Cumbres', ruta: '#cumbres' }, { texto: 'El oficio', ruta: '#oficio' }]} /></div>
        : en ? <div className="v7 lang-en mv-comun"><CabeceraEn activo={p.ruta} enPagina={[{ texto: TEXTOS_CUMBRES.en.menu, ruta: '#cumbres' }, { texto: p.oficio.titulo, ruta: '#oficio' }]} idiomas={IDIOMAS.filter((x) => x.id !== id).map((x) => ({ lang: MONTANA[x.id].lang, ruta: MONTANA[x.id].ruta, texto: x.etiqueta }))} /></div> : <header className="v7-cabecera cristal">
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
        <a className={`v7-boton v7-boton-peq${tg ? ' v7-tg' : ''}`} href={wa(p.guias[0], '')} target="_blank" rel="noopener noreferrer" aria-label={`${p.final.escribir(nombreGuia(p.guias[0]))} — ${tg ? 'Telegram' : 'WhatsApp'}`}>
          <span className="v7-solo-ancho">{p.final.escribir(nombreGuia(p.guias[0]))}</span><span className="v7-solo-movil"><IconoCanal tg={tg} /></span>
        </a>
      </header>}

      <main>
        <PortadaViva t={t} lang={p.lang} maxGrupo={MAX_GRUPO} onBaja={() => suaveA(document.getElementById('atlas'))} />
        {es && <VentaEs onRutas={() => suaveA(document.getElementById('atlas'))} />}
        <Travesia lang={p.lang} onVer3d={(i) => irA3d(i + 1)} paradas={MONTES.map((m) => {
          const r = ruta(m)
          return { id: m, nombre: tc(r.title), sub: tc(r.subtitle), altura: CIMA[m].m, duracion: tc(r.duration), precio: precioDe(m), pedir: p.et.pedir, wa: wa(p.guias[0], tc(r.title)) }
        })} />
        <CintaMontes nombres={MONTES.map((m) => `${KANJI[m]} ${tc(ruta(m).title)} ${CIMA[m].m} m`)} />
        <Atlas t={t} lang={p.lang} nombre={(m) => tc(ruta(m).title)} sub={(m) => tc(ruta(m).subtitle)} grado={(m) => tc(ruta(m).grade)}
          precio={precioDe} wa={(m) => wa(p.guias[0], tc(ruta(m).title))} onVer3d={(i) => irA3d(i + 1)} />
        <MontesScroll tinta="#e8b23a" bruma={[0.93, 0.89, 0.8]} montes={MONTES} nombres={nombres} capitulo={capitulo} etiquetaAria={p.intro.titulo} />

        <Banda lang={p.lang} />
        <Cumbres lang={p.lang} guia={p.guias[0]} />

        <section id="oficio" className="v7-seccion">
          <h2><span className="v7-kanji" lang="ja">山</span>{p.oficio.titulo}</h2>
          <ol className="v7-oficio">
            {p.oficio.puntos.map((o, i) => (
              <li key={o.t} className="tarjeta" style={{ '--i': i } as React.CSSProperties}>
                <span className="v7-oficio-num" lang="ja" aria-hidden="true">{NUMEROS[i]}</span>
                <h3>{o.t}</h3>
                <p>{o.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="v7-seccion v7-montana-final">
          <EfectoEstacion estacion={estacionDeHoy()} cantidad={10} />
          <SelloMetal />
          <h2>{p.final.titulo}</h2>
          <p className="v7-entradilla">{p.final.sub}</p>
          <div className="v7-montana-guias">
            {p.guias.map((g) => (
              <a key={g} className="v7-montana-guia tarjeta" href={wa(g, '')} target="_blank" rel="noopener noreferrer">
                <img loading="lazy" src={GUIAS[g].foto} alt="" width={72} height={72} />
                <span><strong>{nombreGuia(g)}</strong><small>{g === 'tony' ? 'Español · English · العربية' : 'Русский · English'}</small>
                  {GUIAS[g].tg && <small>Telegram · {NOTA_TG[p.lang === 'ru' ? 'ru' : 'en']}</small>}</span>
                <span className={`v7-boton v7-boton-peq${GUIAS[g].tg ? ' v7-tg' : ''}`}>{p.final.escribir(nombreGuia(g))}</span>
              </a>
            ))}
          </div>
        </section>
      </main>
      <Altimetro lang={p.lang} />
      <BarraWa href={wa(p.guias[0], '')} lang={p.lang} pagina={p.id} ocultaEn=".v7-montes" />

      <FranjaVentajas lang={p.lang} />

      {es ? (
        <>
          {/* Lo que el pie común no lleva: idiomas, seguridad y los créditos de fotos, datos y sonido. */}
          <aside className="mv-es-extra">
            <nav aria-label="Otros idiomas">
              {IDIOMAS.filter((x) => x.id !== id).map((x) => <Link key={x.id} to={MONTANA[x.id].ruta} lang={MONTANA[x.id].lang}>{x.etiqueta}</Link>)}
              <Link to="/safety/?lang=es">{PIE.es.seguridad}</Link>
            </nav>
            <p>{p.et.fuente}</p>
            <details>
              <summary>{PIE.es.creditos}</summary>
              <ul>
                {Object.entries(CREDITOS_FOTO).map(([k, c]) => <li key={k}>Foto «{c.titulo}»: <a href={c.pagina} target="_blank" rel="noopener noreferrer">{c.autor}</a>, {c.licencia}</li>)}
                <li>Previsión: <a href="https://api.met.no/" target="_blank" rel="noopener noreferrer">MET Norway</a>, CC BY 4.0 · iconos <a href="https://github.com/metno/weathericons" target="_blank" rel="noopener noreferrer">metno/weathericons</a>, MIT</li>
                <li>Vuelo 3D: MapLibre GL (BSD-3), foto aérea 出典 国土地理院, relieve AWS Terrain Tiles, senderos OpenFreeMap © OpenStreetMap</li>
                <li>Mapa: <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer">Natural Earth</a>, dominio público</li>
                {CREDITOS_SONIDO.map((c) => <li key={c.url}>Sonido «{c.sonido}»: <a href={c.url} target="_blank" rel="noopener noreferrer">{c.autor}</a>, {c.licencia}</li>)}
              </ul>
            </details>
          </aside>
          <div className="v7 lang-es mv-comun"><PieEs p={PAGINAS.es} /></div>
        </>
      ) : en ? (
        <>
          {/* What the common footer doesn't carry: safety, the map source and the data/sound credits. */}
          <aside className="mv-es-extra">
            <nav aria-label="Other languages">
              {IDIOMAS.filter((x) => x.id !== id).map((x) => <Link key={x.id} to={MONTANA[x.id].ruta} lang={MONTANA[x.id].lang}>{x.etiqueta}</Link>)}
              <Link to="/safety/?lang=en">{PIE.en.seguridad}</Link>
            </nav>
            <p>{p.et.fuente}</p>
            <p>3D flight: MapLibre GL (BSD-3), aerial photo 出典 国土地理院, terrain AWS Terrain Tiles, trails OpenFreeMap © OpenStreetMap</p>
          </aside>
          <div className="v7 lang-en mv-comun"><PieEn p={PAGINAS.en}
            creditos={[
              ...Object.entries(CREDITOS_FOTO).map(([, c]) => ({ foto: `Photo “${c.titulo}”`, autor: c.autor, licencia: c.licencia, url: c.pagina })),
              { foto: 'Forecast', autor: 'MET Norway', licencia: 'CC BY 4.0', url: 'https://api.met.no/' },
              { foto: 'Weather icons', autor: 'metno/weathericons', licencia: 'MIT', url: 'https://github.com/metno/weathericons' },
              { foto: 'Map', autor: 'Natural Earth', licencia: 'public domain', url: 'https://www.naturalearthdata.com/' },
            ]}
            idiomas={IDIOMAS.filter((x) => x.id !== id).map((x) => ({ lang: MONTANA[x.id].lang, ruta: MONTANA[x.id].ruta, texto: x.etiqueta }))} /></div>
        </>
      ) : <footer className="v7-pie">
        <div className="v7-pie-fila">
          <div><strong>Tony Kansai Guide</strong><p><a href={`mailto:${CORREO}`}>{CORREO}</a></p></div>
          <nav>
            <Link to={`/legal/?lang=${p.lang}`}>{(PIE[p.lang] ?? PIE.en).legal}</Link>
            <Link to={`/terms/?lang=${p.lang}`}>{(PIE[p.lang] ?? PIE.en).condiciones}</Link>
            <Link to={`/safety/?lang=${p.lang}`}>{(PIE[p.lang] ?? PIE.en).seguridad}</Link>
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
      </footer>}
    </div>
  )
}
