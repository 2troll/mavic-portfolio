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

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import { GUIAS, CORREO, enlaceGuia, NOTA_TG } from '../v7/contenido'
import { PAGINAS } from '../v7/contenido'
import { CabeceraEs } from '../v7/CabeceraEs'
import { PieEs } from '../v7/PieEs'
import { CabeceraEn } from '../v7/CabeceraEn'
import { PieEn } from '../v7/PieEn'
import { HORAS, ITINERARIOS, META_ITIN } from '../v7/datosItinerarios'
import { PRECIO, ETIQUETAS } from '../v7/datosRutas'
import { foto } from '../v7/foto'
import { Logo } from '../v7/Logo'
import { HIKING_ROUTES } from '../lib/data'
import { CIUDADES, CIUDADES_LARION, CIUDADES_TONY, tituloSeo, h1Ciudad, descripcionSeo, faqCiudadVisible, faqLd, introCiudad, fichaCiudad, precioPortada, tramosCiudad } from './ciudades'
import type { CiudadId, Lengua } from './ciudades'
import creditos from './creditosZonas.json'
import { TiempoCiudad } from './TiempoCiudad'
import { PORTADA, fotoPortada } from './Mosaico'
import { migas, viajeTuristico } from './seoTours'
import '../v7/v7.css'
// La hoja serena directamente (estilo-pixel.css ya solo la reimporta).
import '../v7/estilo-sereno.css'
import './v8.css'
import './ciudad-venta.css'
import resenasTony from '../../public/reviews.json'
import { PRECIO_CORTO } from '../v7/datosRespuestasNuevas'
import { IconoCanal } from '../v7/IconoWa'
import { BarraWa } from '../v7/BarraWa'
import { SelloCiudad } from '../v9/Sellos'
import { enlacesHreflang } from '../seo/hreflang'
import {yenLocal, PIE, nombreMonte } from '../v7/formato'
import { respuestaDeCiudad } from '../v7/datosRespuestas'
import { SeccionesRespuesta } from '../v7/PaginaRespuesta'
import { ToursNuevos } from '../v7/ToursNuevos'
import { VentajasEnGuia, HerramientasEnGuia } from '../v7/KitGuia'

// ── Franja de venta (25-11-2026) ─────────────────────────────────────────────
// Clarity: ChatGPT manda la gente a /es/kyoto/ y /en/kyoto/; llegan informados y
// solo quieren ver confianza y escribir. Debajo del titular: nota y número real de
// reseñas, dos o tres reseñas cortas de esa ciudad, precio cerrado por grupo y el
// WhatsApp con la ciudad ya escrita. Solo Tony en /es/ y /en/.
// Las reseñas salen de las mismas dos fuentes que PaginaGuia (reviews.json del build
// + las aprobadas desde el móvil en /api/resenas/publicas), sin copiar datos.
interface ResenaC { id: string; stars: number; name: string; country: string; tour: string; text: string; lang?: string; traducciones?: Record<string, string> }
const resenasBuild = (): ResenaC[] => ((resenasTony as unknown as { reviews: ResenaC[] }).reviews ?? []).filter((r) => r?.text && r.stars)
function useResenasTony(activas: boolean): ResenaC[] {
  const [lista, setLista] = useState<ResenaC[]>(() => (activas ? resenasBuild() : []))
  useEffect(() => {
    if (!activas) return
    let vivo = true
    fetch('/api/resenas/publicas', { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null)).catch(() => null).then((d) => {
      const nuevas = ((d?.reviews ?? []) as ResenaC[]).filter((r) => r?.text && r.stars)
      if (!vivo || !nuevas.length) return
      const vistos = new Set<string>()
      setLista([...nuevas, ...resenasBuild()].filter((r) => (vistos.has(r.id) ? false : (vistos.add(r.id), true))))
    })
    return () => { vivo = false }
  }, [activas])
  return lista
}
/** Qué reseñas hablan de cada ciudad (campo «tour» o el propio texto). */
const CIUDAD_RE: Partial<Record<CiudadId, RegExp>> = {
  kyoto: /kio|kyo|gion|fushimi|kinkaku|arashiyama/i, osaka: /osaka|dotonbori|kuromon/i, nara: /nara|tōdai|todai/i,
  kobe: /kob/i, himeji: /himeji/i, hiroshima: /hiroshima|miyajima/i, beyond: /koya|kōya|kumano/i,
}
/** ¿El texto original está en inglés? (reviews.json marca alguna inglesa como «es»). */
const pareceIngles = (t: string) => (t.match(/\b(the|and|was|we|with|our|you|very|had|it)\b/gi) ?? []).length > (t.match(/\b(el|la|que|muy|con|por|nos|fue|una|del)\b|[ñáéíóú]/gi) ?? []).length
type Cita = { r: ResenaC; texto: string; traducida: boolean }
function citasCiudad(lista: ResenaC[], ciudad: CiudadId, lang: 'es' | 'en'): Cita[] {
  const re = CIUDAD_RE[ciudad]
  const citas: (Cita & { puntos: number })[] = []
  for (const r of lista) {
    const ingles = pareceIngles(r.text)
    const texto = lang === 'en' ? (ingles ? r.text : r.traducciones?.en) : (ingles ? undefined : r.text)
    if (!texto || texto.length < 40 || texto.length > 280) continue
    const deAqui = !!re && (re.test(r.tour ?? '') || re.test(r.text))
    citas.push({ r, texto, traducida: lang === 'en' && !ingles, puntos: (deAqui ? 1000 : 0) + r.stars * 100 + Math.min(texto.length, 200) / 10 })
  }
  // Si la ciudad tiene al menos dos reseñas propias, solo esas (en /en/osaka/ salía una de Kioto).
  const propias = citas.filter((x) => x.puntos >= 1000)
  return (propias.length >= 2 ? propias : citas).sort((a, b) => b.puntos - a.puntos).slice(0, 3)
}
const PAIS_EN: Record<string, string> = { 'España': 'Spain', 'México': 'Mexico', 'Perú': 'Peru', 'Panamá': 'Panama' }
const VENTA = {
  es: { resenas: 'reseñas', leer: 'Leer todas las reseñas', titulo: 'Lo que dicen quienes ya vinieron', precio: 'Precio cerrado por grupo, no por persona', corto: 'Kioto, 2 horas', medio: 'Medio día', completo: 'Día completo', traducida: '', nota: 'Guía privado solo para vosotros. Recogida en el hotel.' },
  en: { resenas: 'reviews', leer: 'Read all reviews', titulo: 'What guests say', precio: 'One fixed price per group, not per person', corto: 'Kyoto, 2 hours', medio: 'Half day', completo: 'Full day', traducida: 'Translated from Spanish', nota: 'A private guide just for your group. Hotel pick-up.' },
} as const
/** Mensaje de WhatsApp ya escrito con la ciudad: el cliente solo añade fechas y personas. */
function mensajeCiudad(lang: 'es' | 'en', ciudad: string) {
  return lang === 'es'
    ? `Hola, me interesa un guía privado en ${ciudad}.\nFechas: \nPersonas: `
    : `Hi, I'd like a private guide in ${ciudad}.\nDates: \nGroup size: `
}
const RESENAS_PAG: Record<'es' | 'en', string> = { es: '/es/#resenas', en: '/en/#resenas' }

function FranjaNota({ lang, lista }: { lang: 'es' | 'en'; lista: ResenaC[] }) {
  if (!lista.length) return null
  const media = lista.reduce((t, r) => t + r.stars, 0) / lista.length
  const nota = media.toFixed(1).replace('.', lang === 'es' ? ',' : '.')
  return (
    <a className="cv-nota" href={RESENAS_PAG[lang]}>
      <span className="cv-estrellas" aria-hidden="true">★★★★★</span>
      <strong>{nota}</strong><span>· {lista.length} {VENTA[lang].resenas}</span>
    </a>
  )
}

function FranjaVenta({ lang, ciudad, lista, wa }: { lang: 'es' | 'en'; ciudad: CiudadId; lista: ResenaC[]; wa: string }) {
  const t = VENTA[lang]
  const citas = useMemo(() => citasCiudad(lista, ciudad, lang), [lista, ciudad, lang])
  const yen = (n: number) => '¥' + n.toLocaleString(lang === 'es' ? 'de-DE' : 'en-US')
  const tramos = tramosCiudad(ciudad)
  const precios: [string, number][] = [
    ...(ciudad === 'kyoto' ? [[t.corto, PRECIO_CORTO] as [string, number]] : []),
    ...(tramos.includes('medio') ? [[t.medio, PRECIO.medio] as [string, number]] : []),
    ...(tramos.includes('completo') ? [[t.completo, PRECIO.completo] as [string, number]] : []),
    ...(tramos.includes('lejos') ? [[t.completo, PRECIO.lejos] as [string, number]] : []),
  ]
  return (
    <section className="cv-franja" aria-label={t.titulo}>
      <div className="cv-precios">
        <p className="cv-precios-tit">{t.precio}</p>
        <ul>{precios.map(([n, v]) => <li key={n + v}><span>{n}</span><strong><bdi>{yen(v)}</bdi></strong></li>)}</ul>
        <p className="cv-precios-nota">{t.nota}</p>
        <a className="v7-boton cv-wa" href={wa} target="_blank" rel="noopener noreferrer"
          onClick={() => window.gtag?.('event', 'generate_lead', { pagina: `ciudad-${ciudad}`, canal: 'whatsapp_franja' })}>
          <IconoCanal tg={false} /> {CTA_EMPRESA[lang]}
        </a>
      </div>
      {citas.length > 0 && (
        <div className="cv-citas">
          <h2>{t.titulo}</h2>
          <ul>
            {citas.map(({ r, texto, traducida }) => (
              <li key={r.id}>
                <span className="cv-estrellas" aria-label={`${r.stars}/5`}>{'★'.repeat(r.stars)}</span>
                <blockquote lang={traducida || lang === 'es' ? lang : 'en'}>{lang === 'es' ? `«${texto.trim()}»` : `“${texto.trim()}”`}</blockquote>
                <p className="cv-quien">{r.name}{r.country ? ` · ${lang === 'en' ? PAIS_EN[r.country] ?? r.country : r.country}` : ''}{traducida ? <small> · {t.traducida}</small> : null}</p>
              </li>
            ))}
          </ul>
          <a className="cv-leer" href={RESENAS_PAG[lang]}>{t.leer} →</a>
        </div>
      )}
    </section>
  )
}

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
/** La página de respuesta de cada ciudad, enlazada desde el texto (25-11-2026): antes
 *  solo se llegaba a ellas por el menú. Clave: ruta de la ciudad. Solo páginas de Tony. */
const RESPUESTA_HERMANA: Record<string, { antes: string; texto: string; ruta: string }> = {
  '/en/kyoto/': { antes: 'Travelling with children or grandparents?', texto: 'Kyoto private guide for families', ruta: '/en/kyoto-private-guide-family/' },
  '/en/osaka/': { antes: 'Staying in Osaka?', texto: 'Private guide with hotel pickup', ruta: '/en/osaka-private-guide-hotel-pickup/' },
  '/en/nara/': { antes: 'Coming from Osaka?', texto: 'Nara day trip from Osaka with a private guide', ruta: '/en/nara-day-trip-from-osaka/' },
  '/en/kobe/': { antes: 'Only one day?', texto: 'Kobe in one day with a private guide', ruta: '/en/kobe-private-guide-one-day/' },
  '/en/beyond/': { antes: 'Kōyasan in one day from Osaka?', texto: 'Kōyasan day trip with a private guide', ruta: '/en/koyasan-day-trip-private-guide/' },
  '/es/nara/': { antes: '¿Os alojáis en Osaka?', texto: 'Excursión a Nara desde Osaka', ruta: '/es/excursion-nara-desde-osaka/' },
  '/es/hiroshima/': { antes: '¿Desde Osaka y en un solo día?', texto: 'Hiroshima y Miyajima en un día', ruta: '/es/excursion-hiroshima-miyajima-desde-osaka/' },
  '/ar/hiroshima/': { antes: 'من أوساكا وفي يوم واحد:', texto: 'رحلة يوم إلى هيروشيما وميياجيما', ruta: '/ar/hiroshima-miyajima-day-trip/' },
}

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
  const idiomasOtros = hermanas.filter((h) => h !== prefijo).map((h) => ({ lang: langDe(h), ruta: `${h}/${c.id}/`, texto: etiquetaIdioma[h] }))
  const titulo = tituloSeo(c.id, lang, guia)
  const tg = !!GUIAS[guia].tg
  const venta = guia === 'tony' && (lang === 'es' || lang === 'en') && (prefijo === '/es' || prefijo === '/en') ? (lang as 'es' | 'en') : null
  const resenas = useResenasTony(!!venta)
  const wa = venta ? enlaceGuia(guia, mensajeCiudad(venta, c.nombre[venta])) : enlaceGuia(guia, `${lang === 'ar' ? 'السلام عليكم يا' : lang === 'ru' ? 'Здравствуйте,' : lang === 'es' ? 'Hola' : 'Hi'} ${g}. ${c.nombre[lang]}:\n`)
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

      {/* En español, la cabecera y el pie comunes (árbol de la web, 25-11-2026). */}
      {prefijo === '/es' ? <CabeceraEs activo={`/es/${c.id}/`} idiomas={idiomasOtros} /> : prefijo === '/en' ? <CabeceraEn activo={`/en/${c.id}/`} idiomas={idiomasOtros} /> : <header className="v7-cabecera cristal">
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
      </header>}

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
            {venta && <FranjaNota lang={venta} lista={resenas} />}
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

        {venta && <FranjaVenta lang={venta} ciudad={c.id} lista={resenas} wa={wa} />}

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

        {guia === 'tony' && RESPUESTA_HERMANA[`${prefijo}/${c.id}/`] && (() => {
          const h = RESPUESTA_HERMANA[`${prefijo}/${c.id}/`]
          return <p className="v7-entradilla v7-seccion">{h.antes} <Link to={h.ruta}>{h.texto} {lang === 'ar' ? '←' : '→'}</Link></p>
        })()}

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

      {/* /en/: el pie inglés común (PieEn) no lleva créditos; los de las fotos (CC BY)
          y los idiomas hermanos se quedan aquí encima para no perder atribución ni enlaces. */}
      {prefijo === '/en' && (
        <div className="v7-seccion cv-creditos-en">
          <nav aria-label="Language">{idiomasOtros.map((i) => <Link key={i.ruta} to={i.ruta} lang={i.lang}>{i.texto}</Link>)}</nav>
          <details className="v7-creditos">
            <summary>{PIE.en.creditos}</summary>
            <ul lang="en" dir="ltr">
              {c.zonas.map((z) => CREDITOS[z.id] && <li key={z.id}>{z.nombre.en}: <a href={CREDITOS[z.id].url} target="_blank" rel="noopener noreferrer">{CREDITOS[z.id].autor}</a>, {CREDITOS[z.id].licencia}</li>)}
              <li>Weather: <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a> (CC BY 4.0); typhoons: <a href="https://www.jma.go.jp/bosai/map.html#contents=typhoon" target="_blank" rel="noopener noreferrer">Japan Meteorological Agency</a></li>
            </ul>
          </details>
        </div>
      )}
      {prefijo === '/es' ? <PieEs p={PAGINAS.es} creditos={[...c.zonas.flatMap((z) => CREDITOS[z.id] ? [{ foto: z.nombre.es, ...CREDITOS[z.id] }] : []), { foto: 'Tiempo', autor: 'Open-Meteo', licencia: 'CC BY 4.0', url: 'https://open-meteo.com/' }, { foto: 'Tifones', autor: 'Agencia Meteorológica de Japón', url: 'https://www.jma.go.jp/bosai/map.html#contents=typhoon' }]} idiomas={idiomasOtros} /> : prefijo === '/en' ? <PieEn p={PAGINAS.en} /> : <footer className="v7-pie">
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
      </footer>}
    </div>
  )
}
