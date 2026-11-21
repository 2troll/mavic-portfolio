// Página de una ciudad (v8). Rediseño «Japón sereno» (21-11-2026, encargo de Antonio):
//   1. portada: foto fija y, en el móvil, debajo de ella nombre, precio y WhatsApp
//      en la primera pantalla; el tiempo, una píldora dentro de la foto;
//   2. resumen (lo que lee la IA), las zonas en un carrusel con imán (rejilla en
//      escritorio), el día por horas, montañas, preguntas y otras ciudades.
// Fuera lo que en el móvil parecía un fallo (auditoría P5, P6, P8): la mancha de
// tinta, la pista fijada de 8 pantallas, la viñeta manga con su poema, la foto 3D
// que pedía «mueve el ratón», el sello que saltaba encima de los botones (sigue
// apuntándose para el libro, pero su estampa no se ve: v8.css) y el sonido.
// Rutas: Tony /es|en|ar/{ciudad}/; Larion /ru/{ciudad}/ y /larion/{ciudad}/.

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import { GUIAS, CORREO, enlaceGuia, NOTA_TG } from '../v7/contenido'
import { HORAS, ITINERARIOS, META_ITIN } from '../v7/datosItinerarios'
import { PRECIO, ETIQUETAS } from '../v7/datosRutas'
import { foto } from '../v7/foto'
import { Logo } from '../v7/Logo'
import { HIKING_ROUTES } from '../lib/data'
import { CIUDADES, CIUDADES_LARION, CIUDADES_TONY, tituloSeo, h1Ciudad, descripcionSeo, faqCiudadVisible, faqLd, introCiudad, fichaCiudad, precioPortada } from './ciudades'
import type { CiudadId, Lengua } from './ciudades'
import creditos from './creditosZonas.json'
import { TiempoCiudad } from './TiempoCiudad'
import { PORTADA, fotoPortada } from './Mosaico'
import { migas, viajeTuristico } from './seoTours'
import '../v7/v7.css'
// La hoja serena directamente (estilo-pixel.css ya solo la reimporta).
import '../v7/estilo-sereno.css'
import './v8.css'
import { IconoCanal } from '../v7/IconoWa'
import { BarraWa } from '../v7/BarraWa'
import { SelloCiudad } from '../v9/Sellos'
import { enlacesHreflang } from '../seo/hreflang'
import {yenLocal, PIE, nombreMonte } from '../v7/formato'
import { respuestaDeCiudad } from '../v7/datosRespuestas'
import { SeccionesRespuesta } from '../v7/PaginaRespuesta'
import { ToursNuevos } from '../v7/ToursNuevos'
import { VentajasEnGuia, HerramientasEnGuia } from '../v7/KitGuia'

const BASE = 'https://tonykansaiguide.com'

export type PaginaCiudad = { lang: Lengua; guia: 'tony' | 'larion'; prefijo: '/es' | '/en' | '/ar' | '/ru' | '/larion'; ciudad: CiudadId }

const ET: Record<Lengua, { zonas: string; dia: string; verDia: string; montes: string; escribe: (g: string) => string; otras: string; volver: string; desde: string; porGrupo: string }> = {
  es: { zonas: 'Zonas', dia: 'Un día aquí', verDia: 'El día completo', montes: 'Montañas cerca', escribe: (g) => `Escribe a ${g}`, otras: 'Otras ciudades', volver: 'Inicio', desde: 'desde', porGrupo: 'por grupo' },
  en: { zonas: 'Areas', dia: 'A day here', verDia: 'The full day', montes: 'Mountains nearby', escribe: (g) => `Message ${g}`, otras: 'Other cities', volver: 'Home', desde: 'from', porGrupo: 'per group' },
  ar: { zonas: 'المناطق', dia: 'يوم هنا', verDia: 'اليوم كاملاً', montes: 'جبال قريبة', escribe: (g) => `راسل ${g}`, otras: 'مدن أخرى', volver: 'الرئيسية', desde: 'ابتداءً من', porGrupo: 'للمجموعة' },
  ru: { zonas: 'Районы', dia: 'Один день здесь', verDia: 'Весь день', montes: 'Горы рядом', escribe: (g) => `Написать: ${g}`, otras: 'Другие города', volver: 'Главная', desde: 'от', porGrupo: 'за группу' },
}
// Tony habla como empresa («nosotros», rediseño 21-11-2026): el botón invita a
// escribirnos, no a una persona. Larion conserva su nombre (su marca es él).
const CTA_EMPRESA: Record<Lengua, string> = { es: 'Escríbenos por WhatsApp', en: 'Message us on WhatsApp', ar: 'راسلنا عبر واتساب', ru: 'Напишите нам в WhatsApp' }
// Cierre de la página sin la foto del guía («empresa, no caras»). Frase de plan-contenido §2.5.
const RESPONDEMOS: Record<Lengua, string> = { es: 'Te respondemos normalmente el mismo día.', en: 'We usually reply the same day.', ar: 'نرد عادةً في اليوم نفسه.', ru: 'Обычно отвечаем в тот же день.' }

// Cabecera de Tony: «guías por todo Japón» (Antonio) y no cuatro ciudades de Kansai.
// Destinos (todas las ciudades), rutas (Tokio, el Fuji y varios días) y precios.
const NAV_TONY: Record<'/es' | '/en' | '/ar', [string, string][]> = {
  '/es': [['/es/destinos/', 'Destinos'], ['/es/rutas/', 'Tokio, Fuji y rutas'], ['/es/precios/', 'Precios']],
  '/en': [['/en/destinations/', 'Destinations'], ['/en/routes/', 'Tokyo, Fuji & routes'], ['/en/prices/', 'Prices']],
  '/ar': [['/ar/destinations/', 'الوجهات'], ['/ar/routes/', 'طوكيو وفوجي والمسارات'], ['/ar/prices/', 'الأسعار']],
}
// Lema que se ve. El de ciudades.ts va también en el JSON-LD (seoTours.ts) y no se
// toca; aquí se quita lo que centraba la página en Osaka («a 30 minutos», «aquí vivo»).
const LEMA_VISIBLE: Partial<Record<CiudadId, Partial<Record<Lengua, string>>>> = {
  kyoto: { es: 'Mil años de capital imperial.', en: 'A thousand years as the imperial capital.', ar: 'عاصمة إمبراطورية لألف عام.' },
  osaka: { es: 'La cocina de Japón.', en: 'Japan\'s kitchen.', ar: 'مطبخ اليابان.' },
}
/** Orden de las zonas en la página: la de la portada primero y los torii rojos de
 *  Fushimi no delante (Antonio: el rojo de santuario es «Japón barato»). El orden de
 *  ciudades.ts no se toca: zonas[0] es la imagen del JSON-LD. */
function zonasVisibles(c: (typeof CIUDADES)[CiudadId]) {
  const primera = c.zonas.find((z) => z.id === c.portada)
  const resto = c.zonas.filter((z) => z !== primera && z.id !== 'kioto-fushimi')
  const fushimi = c.zonas.find((z) => z.id === 'kioto-fushimi')
  const lista = [...(primera ? [primera] : []), ...resto]
  if (fushimi) lista.splice(Math.min(2, lista.length), 0, fushimi)
  return lista
}
const MAS: Record<Lengua, string> = {
  es: 'Más sobre esta ciudad: ventajas, herramientas, montañas y precios comparados',
  en: 'More about this city: perks, tools, mountains and price comparison',
  ar: 'المزيد عن هذه المدينة: مزايا وأدوات وجبال ومقارنة الأسعار',
  ru: 'Ещё об этом городе: скидки, инструменты, горы и сравнение цен',
}

const PAGINA_DIA: Record<string, string> = { '/es': '/es/rutas/', '/en': '/en/routes/', '/ar': '/ar/routes/', '/ru': '/ru/routes/', '/larion': '/larion/routes/' }
const PAGINA_MONTE: Record<string, string> = { '/es': '/es/montana/', '/en': '/en/hiking/', '/ar': '/ar/hiking/', '/ru': '/ru/hiking/', '/larion': '/en/hiking/' }

const nombreGuia = (g: 'tony' | 'larion', lang: Lengua) => (lang === 'ar' && g === 'tony' ? 'طوني' : lang === 'ru' ? 'Ларион' : g === 'tony' ? 'Tony' : 'Larion')
const RESUMEN: Record<Lengua, string> = { es: 'En resumen', en: 'In short', ar: 'باختصار', ru: 'Коротко' }
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

  const respuesta = guia === 'tony' ? respuestaDeCiudad(`${prefijo}/${c.id}/`) : undefined
  const itin = c.itinerario ? ITINERARIOS[lang][c.itinerario] : undefined
  const tramo = c.itinerario ? META_ITIN[c.itinerario].tramo : 'lejos'
  const otras = (guia === 'larion' ? CIUDADES_LARION : CIUDADES_TONY).filter((x) => x !== c.id)
  const hermanas = guia === 'larion' ? (['/ru', '/larion'] as const) : (['/es', '/en', '/ar'] as const)
  const etiquetaIdioma: Record<string, string> = { '/es': 'Español', '/en': 'English', '/ar': 'العربية', '/ru': 'Русский', '/larion': 'English' }
  const langDe = (p: string): Lengua => (p === '/larion' ? 'en' : (p.slice(1) as Lengua))
  const titulo = tituloSeo(c.id, lang, guia)
  const tg = !!GUIAS[guia].tg
  const wa = enlaceGuia(guia, `${lang === 'ar' ? 'السلام عليكم يا' : lang === 'ru' ? 'Здравствуйте,' : lang === 'es' ? 'Hola' : 'Hi'} ${g}. ${c.nombre[lang]}:\n`)
  const cta = guia === 'tony' ? CTA_EMPRESA[lang] : et.escribe(g)

  return (
    <div className={`v7 v7-pagina v8-ciudad lang-${lang}`} lang={lang} dir={dir}>
      <Helmet>
        <html lang={lang} dir={dir} />
        <title>{titulo}</title>
        {/* La misma descripción que el HTML pregenerado (consulta + precio); si no, React la pisaba al cargar. */}
        <meta name="description" content={descripcionSeo(c.id, lang, guia)} />
        <link rel="canonical" href={`${BASE}${prefijo}/${c.id}/`} />
        {enlacesHreflang(hermanas.map((h) => ({ lang: langDe(h), href: `${BASE}${h}/${c.id}/` })))}
        <meta property="og:title" content={titulo} />
        <meta property="og:image" content={`${BASE}/v8/zonas/${PORTADA[c.id]}.webp`} />
        <script type="application/ld+json">{JSON.stringify(viajeTuristico(c.id, lang, guia, prefijo))}</script>
        <script type="application/ld+json">{JSON.stringify(migas(lang, prefijo, et.volver, c.id))}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd(c.id, lang, guia))}</script>
      </Helmet>

      <header className="v7-cabecera cristal">
        <Link to={`${prefijo}/`} className="v7-marca" aria-label="Tony Kansai Guide"><Logo /></Link>
        <nav className="v7-anclas" aria-label={et.otras}>
          {guia === 'tony' && prefijo in NAV_TONY
            ? NAV_TONY[prefijo as '/es' | '/en' | '/ar'].map(([ruta, txt]) => <a key={ruta} href={ruta}>{txt}</a>)
            : otras.slice(0, 4).map((o) => <Link key={o} to={`${prefijo}/${o}/`}>{CIUDADES[o].nombre[lang]}</Link>)}
        </nav>
        <nav className="v7-idiomas" aria-label="Language">
          {hermanas.map((h) => <Link key={h} to={`${h}/${c.id}/`} lang={langDe(h)} aria-current={h === prefijo ? 'page' : undefined}>{etiquetaIdioma[h]}</Link>)}
        </nav>
        <a className="v7-boton v7-boton-peq" href={wa} target="_blank" rel="noopener noreferrer" aria-label={`${g} WhatsApp`}>
          <span className="v7-solo-ancho">{tg ? 'Telegram' : 'WhatsApp'}</span><span className="v7-solo-movil"><IconoCanal tg={tg} /></span>
        </a>
      </header>

      <main>
        {/* 1. Portada. La foto, el velo, el kanji y el tiempo van juntos en una caja:
            en escritorio la caja cubre la sección (texto blanco encima, como antes);
            en el móvil es una banda de alto fijo y el texto va DEBAJO, sobre papel.
            Así nada se pone delante del nombre, el precio y el WhatsApp (auditoría P5)
            y la banda reserva su alto antes de que lleguen foto y tiempo (P11). */}
        <section className="v8-portada">
          <div className="v8-portada-foto">
            <img className="v7-hero-foto" {...foto(fotoZona(c.portada ?? c.zonas[0].id))} alt="" {...{ fetchpriority: 'high' }} />
            <div className="v7-hero-velo" />
            {/* Fuera el kanji vertical (京都) y el tiempo de encima de la foto: adorno que
                el público hispano no lee y datos delante del mensaje (crítica y BRIEF). */}
          </div>
          <div className="v8-portada-texto">
            <h1>{c.nombre[lang]}</h1>
            {/* La frase que la gente escribe en el buscador o en la IA («guía privado en Kioto en español»). */}
            <p className="v8-portada-guia"><strong>{h1Ciudad(c.id, lang, guia)}</strong></p>
            <p>{LEMA_VISIBLE[c.id]?.[lang] ?? c.lema[lang]}</p>
            <p className="v8-portada-precio">{precioPortada(c.id, lang, guia)}</p>
            <a className="v7-boton" href={wa} target="_blank" rel="noopener noreferrer"
              onClick={() => window.gtag?.('event', 'generate_lead', { pagina: `ciudad-${c.id}`, canal: 'whatsapp_ciudad' })}>
              <IconoCanal tg={tg} /> {cta}
            </a>
          </div>
        </section>

        {/* Ficha rápida (ciudades.ts): qué es, cuánto cuesta y cómo se reserva, antes
            de la galería. Es lo primero que lee una IA y lo que busca el cliente. */}
        <section className="v7-seccion v8-ficha">
          <h2>{RESUMEN[lang]}</h2>
          <p className="v7-entradilla">{introCiudad(c.id, lang, guia)}</p>
          <dl className="v9-ficha">
            {fichaCiudad(c.id, lang, guia).map((f) => <div key={f.q}><dt>{f.q}</dt><dd>{f.a}</dd></div>)}
          </dl>
          <a className="v7-boton" href={wa} target="_blank" rel="noopener noreferrer"
            onClick={() => window.gtag?.('event', 'generate_lead', { pagina: `ciudad-${c.id}`, canal: 'whatsapp_ficha' })}>
            <IconoCanal tg={tg} /> {cta}
          </a>
          {tg && <p className="v7-nota-tg">Telegram @{GUIAS[guia].tg} · {NOTA_TG[lang === 'ru' ? 'ru' : 'en']}</p>}
          {/* El tiempo de hoy (y un tifón, si lo hay) en una línea, ya debajo del mensaje. */}
          <TiempoCiudad ciudad={c.id} lang={lang} linea nombre={c.nombre[lang]} />
        </section>

        {/* 2. Zonas: carrusel horizontal con imán en el móvil (una tarjeta y asoma la
            siguiente) y rejilla en escritorio. Antes era una pista fijada que convertía
            8 pantallas de scroll en un desplazamiento lateral y dejaba los títulos debajo
            de las cookies y de la barra de WhatsApp (auditoría P6). Ahora el título va
            bajo la foto, en el flujo normal, y la foto reserva su alto (aspect-ratio). */}
        <section className="v7-seccion v8-zonas">
          <h2>{et.zonas}</h2>
          <ol className="v8-zonas-pista">
            {zonasVisibles(c).map((z, i) => (
              <li key={z.id} className="v8-sitio">
                <div className="v8-zona-foto">
                  <img loading="lazy" decoding="async" {...foto(fotoZona(z.id), '(max-width: 760px) 80vw, 560px')} alt={z.nombre[lang]} />
                </div>
                <p className="v8-zona-num"><bdi>{String(i + 1).padStart(2, '0')} / {String(c.zonas.length).padStart(2, '0')}</bdi></p>
                <h3>{z.nombre[lang]}</h3>
                <p>{z.linea[lang]}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 3. El día, una línea por hora */}
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

        {/* Tour de 2 h y tour en bici por Kioto (11-11-2026), solo en las páginas de Kioto de Tony. */}
        {c.id === 'kyoto' && guia === 'tony' && <ToursNuevos lang={lang} />}

        {/* Preguntas frecuentes: las del FAQPage, sin techos ni primera persona en lo
            que se ve (faqCiudadVisible); el JSON-LD conserva el texto de siempre. */}
        <section className="v7-seccion v7-faq-seccion">
          <h2>{({ es: 'Preguntas', en: 'Questions', ar: 'أسئلة', ru: 'Вопросы' } as Record<Lengua, string>)[lang]}</h2>
          <div className="v7-faq">
            {faqCiudadVisible(c.id, lang, guia).map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Lo demás, plegado en un solo bloque (crítica del 21-11: 16 secciones y 14
            pantallas). Ventajas, herramientas, montañas y la comparativa con las
            plataformas siguen en el DOM y en el HTML pregenerado para Google y las IAs;
            solo dejan de cansar a quien viene a reservar. El libro de sellos (御朱印帳)
            sale de la ciudad: el sello se sigue apuntando (SelloCiudad). */}
        <details className="v7-seccion v8-mas">
          <summary>{MAS[lang]}</summary>
          {guia === 'tony' && <VentajasEnGuia lang={lang} ciudad={c.id} />}
          {guia === 'tony' && <HerramientasEnGuia lang={lang} ciudad={c.id} nombreCiudad={c.id === 'beyond' ? undefined : c.nombre[lang]} />}
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
          {respuesta && <SeccionesRespuesta id={respuesta} fuentes />}
        </details>

        {/* 5. Otras ciudades: mosaico de fotos */}
        <section className="v7-seccion v8-otras">
          <h2>{et.otras}</h2>
          <div className="v8-otras-rejilla">
            {otras.map((o) => (
              <Link key={o} to={`${prefijo}/${o}/`} className="v8-otra">
                <img loading="lazy" {...foto(fotoZona(fotoPortada(o)), '(max-width: 700px) 100vw, 33vw')} alt="" />
                <span>{CIUDADES[o].nombre[lang]}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. Final. Tony cierra como empresa, sin su foto («empresa, no caras»);
            Larion es su propia marca y conserva la suya. */}
        <section className="v7-seccion v8-final">
          {guia === 'tony'
            ? <p className="v7-entradilla">{RESPONDEMOS[lang]}</p>
            : <img loading="lazy" src={GUIAS[guia].foto} alt={GUIAS[guia].nombre} width={160} height={170} />}
          <a className="v7-boton" href={wa} target="_blank" rel="noopener noreferrer"><IconoCanal tg={tg} /> {cta}</a>
        </section>
      </main>
      <BarraWa href={wa} lang={lang} pagina={`ciudad-${c.id}`} />
      {/* Apunta la ciudad en el libro de sellos (y el evento «sello»); la estampa
          flotante que saltaba encima de los botones va oculta en v8.css (auditoría P8). */}
      <SelloCiudad id={c.id} lang={lang} guia={guia} />

      <footer className="v7-pie">
        <div className="v7-pie-fila">
          <div><strong>Tony Kansai Guide</strong><p><a href={`mailto:${CORREO}`}>{CORREO}</a></p></div>
          <nav>
            <Link to={`${prefijo}/`}>{et.volver}</Link>
            <Link to={`/legal/?lang=${lang}`}>{(PIE[lang] ?? PIE.en).legal}</Link>
            <Link to={`/privacy/?lang=${lang}`}>{(PIE[lang] ?? PIE.en).privacidad}</Link>
          </nav>
        </div>
        <details className="v7-creditos">
          <summary>{(PIE[lang] ?? PIE.en).creditos}</summary>
          <ul lang="es" dir="ltr">
            {c.zonas.map((z) => CREDITOS[z.id] && <li key={z.id}>{z.nombre.en}: <a href={CREDITOS[z.id].url} target="_blank" rel="noopener noreferrer">{CREDITOS[z.id].autor}</a>, {CREDITOS[z.id].licencia}</li>)}
            <li>Tiempo: <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a> (CC BY 4.0); tifones: <a href="https://www.jma.go.jp/bosai/map.html#contents=typhoon" target="_blank" rel="noopener noreferrer">Agencia Meteorológica de Japón</a></li>
          </ul>
        </details>
      </footer>
    </div>
  )
}
