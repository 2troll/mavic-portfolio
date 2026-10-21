// 404 que ayuda: «¿querías decir…?» con las páginas reales más parecidas (del
// sitemap), accesos a lo que más se busca y un WhatsApp que ya lleva el enlace
// roto, para que el cliente pregunte y Tony se entere. Foto de los torii de
// Fushimi: «te has perdido entre los torii».

import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import { GUIAS } from './contenido'
import { FotoZona } from './FotoZona'
import './figuras.css'
import './pagina404.css'

type L = 'es' | 'en' | 'ar' | 'ru'

const T: Record<L, {
  antes: string; titulo: string; texto: string; quizas: string; buscando: string; nada: string
  atajos: string; inicio: string; wa: string; waTexto: string; ruta: string
}> = {
  es: {
    antes: 'Error 404', titulo: 'Te has perdido entre los torii', texto: 'Esta página no existe o ha cambiado de sitio. Puede que el enlace tenga una errata. Aquí tienes el camino de vuelta.',
    quizas: '¿Querías decir…?', buscando: 'Buscando páginas parecidas…', nada: 'No he encontrado nada parecido. Prueba con los atajos de abajo.',
    atajos: 'Lo que más se busca', inicio: 'Volver al inicio', wa: 'Pregúntame por WhatsApp',
    waTexto: 'Hola Tony, buscaba esta página y no la encuentro: {url}', ruta: '/es/',
  },
  en: {
    antes: 'Error 404', titulo: 'You got lost among the torii', texto: 'This page does not exist or has moved. The link may have a typo. Here is the way back.',
    quizas: 'Did you mean…?', buscando: 'Looking for similar pages…', nada: 'Nothing similar found. Try the shortcuts below.',
    atajos: 'What people look for most', inicio: 'Back to home', wa: 'Ask me on WhatsApp',
    waTexto: 'Hi Tony, I was looking for this page and could not find it: {url}', ruta: '/en/',
  },
  ar: {
    antes: 'خطأ 404', titulo: 'لقد تُهت بين بوابات التوري', texto: 'هذه الصفحة غير موجودة أو نُقلت. ربما في الرابط خطأ مطبعي. إليك طريق العودة.',
    quizas: 'هل تقصد…؟', buscando: 'أبحث عن صفحات مشابهة…', nada: 'لم أجد شيئًا مشابهًا. جرّب الاختصارات أدناه.',
    atajos: 'الأكثر بحثًا', inicio: 'العودة إلى الرئيسية', wa: 'اسألني على واتساب',
    waTexto: 'مرحبًا طوني، كنت أبحث عن هذه الصفحة ولم أجدها: {url}', ruta: '/ar/',
  },
  ru: {
    antes: 'Ошибка 404', titulo: 'Вы заблудились среди тории', texto: 'Такой страницы нет или она переехала. Возможно, в ссылке опечатка. Вот дорога назад.',
    quizas: 'Возможно, вы искали…', buscando: 'Ищу похожие страницы…', nada: 'Ничего похожего не нашлось. Попробуйте ссылки ниже.',
    atajos: 'Чаще всего ищут', inicio: 'На главную', wa: 'Спросить в WhatsApp',
    waTexto: 'Здравствуйте, Ларион! Искал(а) эту страницу и не нашёл(ла): {url}', ruta: '/ru/',
  },
}

// Atajos: rutas que existen en el sitemap de cada idioma.
const ATAJOS: Record<L, [string, string, string][]> = {
  es: [['/es/osaka/', 'Osaka', '大阪'], ['/es/kyoto/', 'Kioto', '京都'], ['/es/nara/', 'Nara', '奈良'], ['/es/ventajas/', 'Ventajas y códigos', '得'], ['/es/montana/', 'Rutas de montaña', '山'], ['/es/aeropuerto-kansai/', 'Desde el aeropuerto', '空']],
  en: [['/en/osaka/', 'Osaka', '大阪'], ['/en/kyoto/', 'Kyoto', '京都'], ['/en/nara/', 'Nara', '奈良'], ['/en/perks/', 'Perks and codes', '得'], ['/en/hiking/', 'Mountain routes', '山'], ['/en/', 'Private tours', '旅']],
  ar: [['/ar/osaka/', 'أوساكا', '大阪'], ['/ar/kyoto/', 'كيوتو', '京都'], ['/ar/nara/', 'نارا', '奈良'], ['/ar/perks/', 'المزايا والرموز', '得'], ['/ar/hiking/', 'مسارات الجبال', '山'], ['/ar/', 'جولات خاصة', '旅']],
  ru: [['/ru/osaka/', 'Осака', '大阪'], ['/ru/kyoto/', 'Киото', '京都'], ['/ru/nara/', 'Нара', '奈良'], ['/ru/perks/', 'Привилегии и коды', '得'], ['/ru/hiking/', 'Горные маршруты', '山'], ['/ru/', 'Частные туры', '旅']],
}

// Para que la sugerencia se lea como un título y no como una URL.
const SECCION: Record<string, Record<L, string>> = {
  ventajas: { es: 'Ventajas', en: 'Perks', ar: 'المزايا', ru: 'Привилегии' },
  perks: { es: 'Ventajas', en: 'Perks', ar: 'المزايا', ru: 'Привилегии' },
  rutas: { es: 'Rutas', en: 'Routes', ar: 'المسارات', ru: 'Маршруты' },
  routes: { es: 'Rutas', en: 'Routes', ar: 'المسارات', ru: 'Маршруты' },
}

function distancia(a: string, b: string) {
  const f = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    let previo = f[0]
    f[0] = i
    for (let j = 1; j <= b.length; j++) {
      const t = f[j]
      f[j] = Math.min(f[j] + 1, f[j - 1] + 1, previo + (a[i - 1] === b[j - 1] ? 0 : 1))
      previo = t
    }
  }
  return f[b.length]
}

/** Parecido entre 0 y 1: por la ruta entera y, sobre todo, por su último trozo. */
function parecido(roto: string, bueno: string) {
  const ultimo = (r: string) => r.split('/').filter(Boolean).pop() ?? ''
  const a = ultimo(roto).toLowerCase(), b = ultimo(bueno).toLowerCase()
  const trozo = a && b ? 1 - distancia(a, b) / Math.max(a.length, b.length) : 0
  const entera = 1 - distancia(roto, bueno) / Math.max(roto.length, bueno.length)
  const contiene = a.length > 2 && b.includes(a) ? 0.25 : 0
  return Math.max(trozo * 0.7 + entera * 0.3 + contiene, entera)
}

const NOMBRES: Record<string, Record<L, string>> = {
  osaka: { es: 'Osaka', en: 'Osaka', ar: 'أوساكا', ru: 'Осака' }, kyoto: { es: 'Kioto', en: 'Kyoto', ar: 'كيوتو', ru: 'Киото' },
  nara: { es: 'Nara', en: 'Nara', ar: 'نارا', ru: 'Нара' }, kobe: { es: 'Kobe', en: 'Kobe', ar: 'كوبي', ru: 'Кобе' },
  himeji: { es: 'Himeji', en: 'Himeji', ar: 'هيميجي', ru: 'Химэдзи' }, hiroshima: { es: 'Hiroshima', en: 'Hiroshima', ar: 'هيروشيما', ru: 'Хиросима' },
  'otono-kioto': { es: 'Otoño en Kioto', en: 'Autumn in Kyoto', ar: 'الخريف في كيوتو', ru: 'Осень в Киото' },
  'sakura-kioto': { es: 'Sakura en Kioto', en: 'Sakura in Kyoto', ar: 'الساكورا في كيوتو', ru: 'Сакура в Киото' },
  montana: { es: 'Rutas de montaña', en: 'Mountain routes', ar: 'مسارات الجبال', ru: 'Горные маршруты' },
  hiking: { es: 'Rutas de montaña', en: 'Mountain routes', ar: 'مسارات الجبال', ru: 'Горные маршруты' },
}

function titulo(ruta: string, l: L) {
  const partes = ruta.split('/').filter(Boolean)
  const ultimo = partes[partes.length - 1] ?? ''
  const bonito = NOMBRES[ultimo]?.[l] ?? ultimo.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())
  const sec = partes.length > 2 ? SECCION[partes[1]]?.[l] : undefined
  return sec ? `${sec} · ${bonito}` : bonito
}

export default function Pagina404() {
  const { lang } = useLanguage()
  const { pathname } = useLocation()
  // El idioma de la ruta manda: /es/loquesea es español aunque el navegador esté en inglés.
  const primero = pathname.split('/')[1]
  const l: L = primero === 'larion' ? 'ru' : (['es', 'en', 'ar', 'ru'] as const).includes(primero as L) ? (primero as L)
    : (['es', 'en', 'ar', 'ru'] as const).includes(lang as L) ? (lang as L) : 'en'
  const t = T[l]
  const [rutas, setRutas] = useState<string[] | null>(null)

  useEffect(() => {
    let vivo = true
    fetch('/sitemap.xml').then((r) => (r.ok ? r.text() : '')).then((xml) => {
      if (!vivo) return
      setRutas([...xml.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]))
    }).catch(() => vivo && setRutas([]))
    return () => { vivo = false }
  }, [])

  const sugeridas = useMemo(() => {
    if (!rutas) return null
    const prefijo = l === 'ru' ? /^\/(ru|larion)\// : new RegExp(`^/${l}/`)
    const candidatas = rutas.filter((r) => prefijo.test(r) && r !== t.ruta)
    return candidatas
      .map((r) => ({ r, p: parecido(pathname.toLowerCase(), r) }))
      .filter((x) => x.p > 0.45)
      .sort((a, b) => b.p - a.p)
      .slice(0, 3)
  }, [rutas, pathname, l, t.ruta])

  const url = typeof window !== 'undefined' ? window.location.href : pathname
  const wa = `https://wa.me/${(l === 'ru' ? GUIAS.larion : GUIAS.tony).wa}?text=${encodeURIComponent(t.waTexto.replace('{url}', url))}`

  return (
    <main className="p404" lang={l} dir={l === 'ar' ? 'rtl' : 'ltr'}>
      <Helmet><title>404 · Tony Kansai Guide</title><meta name="robots" content="noindex" /></Helmet>

      <section className="p404-portada">
        <FotoZona zona="kioto-fushimi" className="p404-foto" sizes="100vw" />
        <div className="p404-dentro">
          <div className="p404-texto">
            <p className="p404-antes">{t.antes}</p>
            <h1>{t.titulo}</h1>
            <p className="p404-lema">{t.texto}</p>
            <div className="p404-botones">
              <Link className="p404-boton p404-boton-claro" to={t.ruta}>{t.inicio}</Link>
              <a className="p404-boton p404-boton-wa" href={wa} target="_blank" rel="noopener noreferrer">{t.wa}</a>
            </div>
          </div>
          <div className="p404-figura" aria-hidden="true">
            <span className="p404-num">404</span>
            <img src={l === 'ru' ? '/v8/figuras/larion-kyoto.webp' : '/v8/figuras/tony-beyond.webp'} alt="" decoding="async" />
          </div>
        </div>
      </section>

      <section className="p404-cuerpo">
        <div className="p404-quizas" aria-live="polite">
          <h2>{t.quizas}</h2>
          {sugeridas === null ? <p className="p404-nota">{t.buscando}</p>
            : sugeridas.length === 0 ? <p className="p404-nota">{t.nada}</p>
            : (
              <ul>
                {sugeridas.map(({ r }) => (
                  <li key={r}><Link to={r}><b>{titulo(r, l)}</b><span dir="ltr">tonykansaiguide.com{r}</span></Link></li>
                ))}
              </ul>
            )}
        </div>

        <h2 className="p404-sub">{t.atajos}</h2>
        <nav className="p404-atajos" aria-label={t.atajos}>
          {ATAJOS[l].map(([ruta, nombre, kanji]) => (
            <Link key={ruta} to={ruta}><span lang="ja" aria-hidden="true">{kanji}</span><b>{nombre}</b></Link>
          ))}
        </nav>
      </section>
    </main>
  )
}
