// Página de una ciudad (v8). Se ve más de lo que se lee:
//   1. portada a pantalla completa con las fotos de sus zonas y tinta entre ellas,
//   2. las zonas en una pista horizontal que avanza al bajar (scroll-driven, sin JS),
//   3. la maqueta 3D de la ciudad, que gira con el scroll,
//   4. el día en una línea por hora, montañas cerca y el botón de WhatsApp.
// Rutas: Tony /es|en|ar/{ciudad}/; Larion /ru/{ciudad}/ y /larion/{ciudad}/.

import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import { GUIAS, CORREO } from '../v7/contenido'
import { HORAS, ITINERARIOS, META_ITIN } from '../v7/datosItinerarios'
import { PRECIO, ETIQUETAS } from '../v7/datosRutas'
import { HeroTinta } from '../v7/HeroTinta'
import { foto } from '../v7/foto'
import { BotonSonido } from '../v7/BotonSonido'
import { CREDITOS_SONIDO } from '../v7/sonido'
import { Logo } from '../v7/Logo'
import { HIKING_ROUTES } from '../lib/data'
import { CIUDADES, CIUDADES_LARION, CIUDADES_TONY, FIGURAS, tituloSeo } from './ciudades'
import type { CiudadId, Lengua } from './ciudades'
import creditos from './creditosZonas.json'
import { TiempoCiudad } from './TiempoCiudad'
import { HistoriaManga } from './HistoriaManga'
import { PORTADA } from './Mosaico'
import { Foto3D } from './Foto3D'
import { migas, viajeTuristico } from './seoTours'
import { HISTORIA, HISTORIA_LISTA, ROTULOS } from './historia'
import '../v7/v7.css'
import '../v7/estilo-pixel.css'
import './v8.css'
import './figura.css'
import { IconoWa } from '../v7/IconoWa'
import { BarraWa } from '../v7/BarraWa'
import { SelloCiudad, LibroSellos } from '../v9/Sellos'
import { BotonTema } from '../v7/Tema'
import { enlacesHreflang } from '../seo/hreflang'
import {yenLocal, PIE, nombreMonte } from '../v7/formato'

const BASE = 'https://tonykansaiguide.com'
// Orden de los capítulos de la historia (el mismo que el menú de Tony).
const CIUDADES_ORDEN: CiudadId[] = ['osaka', 'kyoto', 'nara', 'kobe', 'himeji', 'hiroshima', 'beyond']

export type PaginaCiudad = { lang: Lengua; guia: 'tony' | 'larion'; prefijo: '/es' | '/en' | '/ar' | '/ru' | '/larion'; ciudad: CiudadId }

const ET: Record<Lengua, { arrastra3d: string; zonas: string; arrastra: string; dia: string; verDia: string; montes: string; escribe: (g: string) => string; otras: string; tour: string; volver: string; desde: string; porGrupo: string }> = {
  es: { arrastra3d: 'Mueve el ratón o el dedo', zonas: 'Zonas', arrastra: 'Arrastra para girar', dia: 'Un día aquí', verDia: 'El día completo', montes: 'Montañas cerca', escribe: (g) => `Escribe a ${g}`, otras: 'Otras ciudades', tour: 'Tour', volver: 'Inicio', desde: 'desde', porGrupo: 'por grupo' },
  en: { arrastra3d: 'Move your mouse or finger', zonas: 'Areas', arrastra: 'Drag to rotate', dia: 'A day here', verDia: 'The full day', montes: 'Mountains nearby', escribe: (g) => `Message ${g}`, otras: 'Other cities', tour: 'Tour', volver: 'Home', desde: 'from', porGrupo: 'per group' },
  ar: { arrastra3d: 'حرّك الفأرة أو إصبعك', zonas: 'المناطق', arrastra: 'اسحب للتدوير', dia: 'يوم هنا', verDia: 'اليوم كاملاً', montes: 'جبال قريبة', escribe: (g) => `راسل ${g}`, otras: 'مدن أخرى', tour: 'جولة', volver: 'الرئيسية', desde: 'ابتداءً من', porGrupo: 'للمجموعة' },
  ru: { arrastra3d: 'Подвигайте мышью или пальцем', zonas: 'Районы', arrastra: 'Потяните, чтобы повернуть', dia: 'Один день здесь', verDia: 'Весь день', montes: 'Горы рядом', escribe: (g) => `Написать: ${g}`, otras: 'Другие города', tour: 'Тур', volver: 'Главная', desde: 'от', porGrupo: 'за группу' },
}

const PAGINA_DIA: Record<string, string> = { '/es': '/es/rutas/', '/en': '/en/routes/', '/ar': '/ar/routes/', '/ru': '/ru/routes/', '/larion': '/larion/routes/' }
const PAGINA_MONTE: Record<string, string> = { '/es': '/es/montana/', '/en': '/en/hiking/', '/ar': '/ar/hiking/', '/ru': '/ru/hiking/', '/larion': '/en/hiking/' }

const nombreGuia = (g: 'tony' | 'larion', lang: Lengua) => (lang === 'ar' && g === 'tony' ? 'طوني' : lang === 'ru' ? 'Ларион' : g === 'tony' ? 'Tony' : 'Larion')
const fotoZona = (id: string) => `/v8/zonas/${id}.jpg`
const CREDITOS = creditos as Record<string, { url: string; autor: string; licencia: string }>

export default function CiudadPagina({ pg }: { pg: PaginaCiudad }) {
  const c = CIUDADES[pg.ciudad]
  const { lang, guia, prefijo } = pg
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const et = ET[lang]
  const g = nombreGuia(guia, lang)
  const { setLang } = useLanguage()
  useEffect(() => { setLang(lang) }, [lang, setLang])

  // Respaldo para navegadores sin animaciones ligadas al scroll (Firefox):
  // la pista se mueve leyendo la posición de la sección en cada fotograma
  // mientras está en pantalla. En Chrome y Safari lo hace el CSS solo.
  const pan = useRef<HTMLElement>(null)
  const [panCerca, setPanCerca] = useState(false)
  useEffect(() => {
    const el = pan.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setPanCerca(true); io.disconnect() } }, { rootMargin: '400px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [pg.ciudad])
  useEffect(() => {
    const sec = pan.current
    if (!sec || CSS.supports('animation-timeline: view()')) return
    const pista = sec.querySelector<HTMLElement>('.v8-pan-pista')
    if (!pista) return
    const n = c.zonas.length, sentido = dir === 'rtl' ? 1 : -1
    let raf = 0, visible = false
    const cuadro = () => {
      raf = 0
      const r = sec.getBoundingClientRect()
      const t = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)))
      pista.style.transform = `translateX(${t * (n - 1) * 100 * sentido}vw)`
      if (visible) raf = requestAnimationFrame(cuadro)
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(cuadro) })
    io.observe(sec)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [c.zonas.length, dir])

  const itin = c.itinerario ? ITINERARIOS[lang][c.itinerario] : undefined
  const tramo = c.itinerario ? META_ITIN[c.itinerario].tramo : 'lejos'
  const otras = (guia === 'larion' ? CIUDADES_LARION : CIUDADES_TONY).filter((x) => x !== c.id)
  const hermanas = guia === 'larion' ? (['/ru', '/larion'] as const) : (['/es', '/en', '/ar'] as const)
  const etiquetaIdioma: Record<string, string> = { '/es': 'Español', '/en': 'English', '/ar': 'العربية', '/ru': 'Русский', '/larion': 'English' }
  const langDe = (p: string): Lengua => (p === '/larion' ? 'en' : (p.slice(1) as Lengua))
  const titulo = tituloSeo(c.id, lang, guia)
  const wa = `https://wa.me/${GUIAS[guia].wa}?text=${encodeURIComponent(`${lang === 'ar' ? 'السلام عليكم يا' : lang === 'ru' ? 'Здравствуйте,' : lang === 'es' ? 'Hola' : 'Hi'} ${g}. ${c.nombre[lang]}:\n`)}`

  return (
    <div className={`v7 v7-pagina v8-ciudad lang-${lang}`} lang={lang} dir={dir}>
      <Helmet>
        <html lang={lang} dir={dir} />
        <title>{titulo}</title>
        {/* Lema y las cuatro zonas más conocidas: con todas pasaba de los ~155 caracteres que enseña Google. */}
        <meta name="description" content={`${c.lema[lang]} ${c.zonas.slice(0, 4).map((z) => z.nombre[lang]).join(', ')}.`} />
        <link rel="canonical" href={`${BASE}${prefijo}/${c.id}/`} />
        {enlacesHreflang(hermanas.map((h) => ({ lang: langDe(h), href: `${BASE}${h}/${c.id}/` })))}
        <meta property="og:title" content={titulo} />
        <meta property="og:image" content={`${BASE}/v8/zonas/${PORTADA[c.id]}.webp`} />
        <script type="application/ld+json">{JSON.stringify(viajeTuristico(c.id, lang, guia, prefijo))}</script>
        <script type="application/ld+json">{JSON.stringify(migas(lang, prefijo, et.volver, c.id))}</script>
      </Helmet>

      <header className="v7-cabecera cristal">
        <Link to={`${prefijo}/`} className="v7-marca" aria-label="Tony Kansai Guide"><Logo /></Link>
        <nav className="v7-anclas" aria-label={et.otras}>
          {otras.slice(0, 4).map((o) => <Link key={o} to={`${prefijo}/${o}/`}>{CIUDADES[o].nombre[lang]}</Link>)}
        </nav>
        <nav className="v7-idiomas" aria-label="Language">
          {hermanas.map((h) => <Link key={h} to={`${h}/${c.id}/`} lang={langDe(h)} aria-current={h === prefijo ? 'page' : undefined}>{etiquetaIdioma[h]}</Link>)}
        </nav>
        <BotonTema lang={lang} />
        <BotonSonido lang={lang} ambiente="ciudad" />
        <a className="v7-boton v7-boton-peq" href={wa} target="_blank" rel="noopener noreferrer" aria-label={`${g} WhatsApp`}>
          <span className="v7-solo-ancho">WhatsApp</span><span className="v7-solo-movil"><IconoWa /></span>
        </a>
      </header>

      <main>
        {/* 1. Portada */}
        <section className="v8-portada">
          <img className="v7-hero-foto" {...foto(fotoZona(c.zonas[0].id))} alt="" {...{ fetchpriority: 'high' }} />
          <HeroTinta fotos={c.zonas.slice(0, 5).map((z) => fotoZona(z.id))} />
          <div className="v7-hero-velo" />
          <span className="v8-portada-kanji" lang="ja" aria-hidden="true">{c.kanji}</span>
          <TiempoCiudad ciudad={c.id} lang={lang} />
          <div className="v8-portada-texto">
            <h1>{c.nombre[lang]}</h1>
            <p>{c.lema[lang]}</p>
            <a className="v7-boton" href={wa} target="_blank" rel="noopener noreferrer"
              onClick={() => window.gtag?.('event', 'generate_lead', { pagina: `ciudad-${c.id}`, canal: 'whatsapp_ciudad' })}>
              {et.escribe(g)}
            </a>
          </div>
        </section>

        {/* 2. Zonas: pista horizontal que avanza con el scroll vertical */}
        <section ref={pan} className="v8-pan" style={{ ['--n' as string]: c.zonas.length }} aria-label={et.zonas}>
          {/* Puntos de parada: al soltar el scroll, cada zona queda encuadrada. */}
          {c.zonas.map((z, i) => <span key={z.id} className="v8-pan-parada" style={{ top: `calc(${i} * 100svh)` }} aria-hidden="true" />)}
          <div className="v8-pan-fijo">
            <ol className="v8-pan-pista">
              {c.zonas.map((z, i) => (
                <li key={z.id} className="v8-zona">
                  {/* La pista es horizontal: el «lazy» del navegador las veía todas cerca y
                      bajaba las ocho al cargar. Solo la primera va siempre; el resto, al llegar. */}
                  {(i === 0 || panCerca) && <img loading={i === 0 ? 'eager' : 'lazy'} {...foto(fotoZona(z.id), '100vw')} alt={z.nombre[lang]} decoding="async" />}
                  <span className="v8-zona-kanji" lang="ja" aria-hidden="true">{z.kanji}</span>
                  <div className="v8-zona-texto">
                    <p className="v8-zona-num"><bdi>{String(i + 1).padStart(2, '0')} / {String(c.zonas.length).padStart(2, '0')}</bdi></p>
                    <h2>{z.nombre[lang]}</h2>
                    <p>{z.linea[lang]}</p>
                  </div>
                </li>
              ))}
            </ol>
            {/* El guía, dibujado y recortado, de pie dentro de las fotos: acompaña toda la pista. */}
            {FIGURAS.includes(`${guia}-${c.id}`) && (
              <img className="v8-figura" src={`/v8/figuras/${guia}-${c.id}.webp`} alt="" aria-hidden="true" decoding="async" />
            )}
          </div>
        </section>

        {/* Una viñeta en blanco y negro del guía en el sitio más conocido, con su bocadillo y un poema.
            Dibujo = la foto real de la ciudad pasada a tinta. Nara (ciervos) y Más lejos
            (Kumano) usan la frase b, que es la de lo que se ve. */}
        {HISTORIA_LISTA.includes(`${guia}-${c.id}`) && (
          <HistoriaManga
            quien={g}
            sello={c.kanji}
            capitulo={`${ROTULOS[lang].capitulo} ${String(CIUDADES_ORDEN.indexOf(c.id) + 1).padStart(2, '0')}`}
            titulo={ROTULOS[lang].enCiudad(c.nombre[lang])}
            poema={HISTORIA[c.id].poema[lang]}
            etiquetaPoema={ROTULOS[lang].poema}
            vinetas={[{ src: `/v8/historia/tinta-${c.id}.webp`, forma: 'ancha', texto: HISTORIA[c.id][c.id === 'nara' || c.id === 'beyond' ? 'b' : 'a'][lang] }]}
          />
        )}

        {/* 3. La ciudad en 3D: su foto más conocida con relieve real (foto + profundidad). */}
        <section className="v9-maqueta3d" aria-label={c.nombre[lang]}>
          <Foto3D foto={`/v8/zonas/${PORTADA[c.id]}.webp`} prof={`/v8/prof/${PORTADA[c.id]}.webp`} alt={c.nombre[lang]} />
          <span className="v9-maqueta3d-kanji" lang="ja" aria-hidden="true">{c.kanji}</span>
          <p className="v9-maqueta3d-pista">{et.arrastra3d}</p>
        </section>

        {/* 4. El día, una línea por hora */}
        {itin && c.itinerario && (
          <section className="v7-seccion v8-dia">
            <h2>{et.dia}</h2>
            <ol>
              {itin.pasos.map((p, k) => (
                <li key={p.lugar}><time><bdi>{HORAS[c.itinerario!][k]}</bdi></time><span>{p.lugar}</span></li>
              ))}
            </ol>
            <div className="v8-dia-pie">
              <p className="v8-precio"><small>{tramo === 'lejos' ? et.desde : ETIQUETAS[lang].nombres[tramo]}</small><strong><bdi>{yenLocal(PRECIO[tramo], lang)}</bdi></strong><small>{et.porGrupo}</small></p>
              <Link className="v7-boton v7-boton-sec" to={`${PAGINA_DIA[prefijo]}#${c.itinerario}`}>{et.verDia}</Link>
            </div>
          </section>
        )}

        {/* 5. Montañas cerca */}
        {c.montes.length > 0 && (
          <section className="v7-seccion v8-montes">
            <h2>{et.montes}</h2>
            <div>
              {c.montes.map((m) => {
                const r = HIKING_ROUTES.find((x) => x.id === m)
                return r ? <Link key={m} to={PAGINA_MONTE[prefijo]} className="v8-monte">{nombreMonte(r.title, lang)}</Link> : null
              })}
            </div>
          </section>
        )}

        {/* 6. Otras ciudades: mosaico de fotos */}
        <section className="v7-seccion v8-otras">
          <h2>{et.otras}</h2>
          <div className="v8-otras-rejilla">
            {otras.map((o) => (
              <Link key={o} to={`${prefijo}/${o}/`} className="v8-otra">
                <img loading="lazy" {...foto(fotoZona(PORTADA[o]), '(max-width: 700px) 100vw, 33vw')} alt="" />
                <span><span lang="ja">{CIUDADES[o].kanji}</span>{CIUDADES[o].nombre[lang]}</span>
              </Link>
            ))}
          </div>
        </section>

        <LibroSellos lang={lang} guia={guia} prefijo={prefijo} />

        {/* 7. Final */}
        <section className="v7-seccion v8-final">
          <img loading="lazy" src={GUIAS[guia].foto} alt={GUIAS[guia].nombre} width={160} height={170} />
          <a className="v7-boton" href={wa} target="_blank" rel="noopener noreferrer">{et.escribe(g)}</a>
        </section>
      </main>
      <BarraWa href={wa} lang={lang} pagina={`ciudad-${c.id}`} />
      <SelloCiudad id={c.id} lang={lang} guia={guia} />

      <footer className="v7-pie">
        <div className="v7-pie-fila">
          <div><strong>Tony Kansai Guide</strong><p><a href={`mailto:${CORREO}`}>{CORREO}</a></p></div>
          <nav>
            <Link to={`${prefijo}/`}>{et.volver}</Link>
            <Link to={`/legal?lang=${lang}`}>{(PIE[lang] ?? PIE.en).legal}</Link>
            <Link to={`/privacy?lang=${lang}`}>{(PIE[lang] ?? PIE.en).privacidad}</Link>
          </nav>
        </div>
        <details className="v7-creditos">
          <summary>{(PIE[lang] ?? PIE.en).creditos}</summary>
          <ul lang="es" dir="ltr">
            {c.zonas.map((z) => CREDITOS[z.id] && <li key={z.id}>{z.nombre.en}: <a href={CREDITOS[z.id].url} target="_blank" rel="noopener noreferrer">{CREDITOS[z.id].autor}</a>, {CREDITOS[z.id].licencia}</li>)}
            <li>Tiempo: <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a> (CC BY 4.0); tifones: <a href="https://www.jma.go.jp/bosai/map.html#contents=typhoon" target="_blank" rel="noopener noreferrer">Agencia Meteorológica de Japón</a></li>
            {CREDITOS_SONIDO.map((s) => <li key={s.url}>Sonido «{s.sonido}»: <a href={s.url} target="_blank" rel="noopener noreferrer">{s.autor}</a>, {s.licencia}</li>)}
          </ul>
        </details>
      </footer>
    </div>
  )
}
