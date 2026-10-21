// 404 que ayuda, con un radar que barre Kansai: las páginas reales más
// parecidas a la dirección rota (del sitemap) son los puntos que se encienden
// al pasar el barrido. Buscador en vivo sobre todas las páginas del idioma,
// atajos a lo más buscado y un WhatsApp que ya lleva el enlace roto, para que el
// cliente pregunte y Tony se entere. Idea del bloque «404 7» de React Bits Pro
// (de pago): rehecho desde cero, sin su código.

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import { GUIAS } from './contenido'
import './pagina404.css'

type L = 'es' | 'en' | 'ar' | 'ru'

const T: Record<L, {
  barrido: string; sector: string; tu: string; titulo: string; texto: string; perdida: string
  quizas: string; buscando: string; nada: string; buscar: string; sinResultados: string
  atajos: string; inicio: string; wa: string; waTexto: string; ruta: string
}> = {
  es: {
    barrido: 'BARRIDO', sector: 'SECTOR KANSAI', tu: 'Tú', titulo: 'Nada en el radar.',
    texto: 'He barrido todas las rutas de Kansai dos veces y esta dirección no responde. Puede que el enlace tenga una errata: busca lo que necesitas o vuelve al inicio.',
    perdida: 'Señal perdida', quizas: '¿Querías decir…?', buscando: 'Barriendo páginas parecidas…', nada: 'Nada parecido en el radar. Prueba el buscador o los atajos.',
    buscar: 'Busca una página: Kioto, aeropuerto, sakura…', sinResultados: 'Sin resultados. Pregúntame por WhatsApp y te lo digo yo.',
    atajos: 'Lo que más se busca', inicio: 'Volver al inicio', wa: 'Pregúntame por WhatsApp',
    waTexto: 'Hola Tony, buscaba esta página y no la encuentro: {url}', ruta: '/es/',
  },
  en: {
    barrido: 'SWEEP', sector: 'SECTOR KANSAI', tu: 'You', titulo: 'Nothing on the radar.',
    texto: 'I swept every route in Kansai twice and this address is not answering. The link may have a typo: search for what you need or head back home.',
    perdida: 'Signal lost', quizas: 'Did you mean…?', buscando: 'Sweeping for similar pages…', nada: 'Nothing similar on the radar. Try the search or the shortcuts.',
    buscar: 'Search a page: Kyoto, airport, sakura…', sinResultados: 'No results. Ask me on WhatsApp and I will tell you.',
    atajos: 'What people look for most', inicio: 'Back to home', wa: 'Ask me on WhatsApp',
    waTexto: 'Hi Tony, I was looking for this page and could not find it: {url}', ruta: '/en/',
  },
  ar: {
    barrido: 'مسح', sector: 'قطاع كانساي', tu: 'أنت', titulo: 'لا شيء على الرادار.',
    texto: 'مسحتُ كل طرق كانساي مرتين وهذا العنوان لا يستجيب. ربما في الرابط خطأ مطبعي: ابحث عمّا تحتاجه أو عُد إلى الرئيسية.',
    perdida: 'فُقدت الإشارة', quizas: 'هل تقصد…؟', buscando: 'أبحث عن صفحات مشابهة…', nada: 'لا شيء مشابه على الرادار. جرّب البحث أو الاختصارات.',
    buscar: 'ابحث عن صفحة: كيوتو، المطار، الساكورا…', sinResultados: 'لا نتائج. اسألني على واتساب وسأخبرك.',
    atajos: 'الأكثر بحثًا', inicio: 'العودة إلى الرئيسية', wa: 'اسألني على واتساب',
    waTexto: 'مرحبًا طوني، كنت أبحث عن هذه الصفحة ولم أجدها: {url}', ruta: '/ar/',
  },
  ru: {
    barrido: 'РАЗВЁРТКА', sector: 'СЕКТОР КАНСАЙ', tu: 'Вы', titulo: 'На радаре пусто.',
    texto: 'Я дважды прочесал все маршруты Кансая, а этот адрес не отвечает. Возможно, в ссылке опечатка: найдите нужное или вернитесь на главную.',
    perdida: 'Сигнал потерян', quizas: 'Возможно, вы искали…', buscando: 'Ищу похожие страницы…', nada: 'Ничего похожего на радаре. Попробуйте поиск или ссылки ниже.',
    buscar: 'Найти страницу: Киото, аэропорт, сакура…', sinResultados: 'Ничего не нашлось. Спросите в WhatsApp, я подскажу.',
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
  beyond: { es: 'Más allá de Kansai', en: 'Beyond Kansai', ar: 'ما وراء كانساي', ru: 'За пределами Кансая' },
  rutas: { es: 'Planes por horas', en: 'Day plans', ar: 'خطط اليوم', ru: 'Маршруты по часам' },
  routes: { es: 'Planes por horas', en: 'Day plans hour by hour', ar: 'خطط اليوم ساعة بساعة', ru: 'Маршруты по часам' },
  'osaka-kioto': { es: 'De Osaka a Kioto en tren', en: '', ar: '', ru: '' },
  'osaka-to-kyoto': { es: '', en: 'Osaka to Kyoto by train', ar: '', ru: '' },
  'aeropuerto-kansai': { es: 'Desde el aeropuerto de Kansai', en: '', ar: '', ru: '' },
  'kansai-airport': { es: '', en: 'From Kansai Airport', ar: '', ru: '' },
  'kyoto-autumn': { es: '', en: 'Autumn in Kyoto', ar: 'الخريف في كيوتو', ru: 'Осень в Киото' },
  'kyoto-cherry-blossom': { es: '', en: 'Cherry blossom in Kyoto', ar: 'أزهار الكرز في كيوتو', ru: '' },
  'kyoto-sakura': { es: '', en: '', ar: '', ru: 'Сакура в Киото' },
  'mosques-kansai': { es: '', en: '', ar: 'المساجد في كانساي', ru: '' },
  'halal-kyoto-osaka': { es: '', en: '', ar: 'الطعام الحلال في كيوتو وأوساكا', ru: '' },
}

function titulo(ruta: string, l: L, nombres: Record<string, string>) {
  const partes = ruta.split('/').filter(Boolean)
  const ultimo = partes[partes.length - 1] ?? ''
  const bonito = NOMBRES[ultimo]?.[l] || nombres[ultimo] || ultimo.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())
  const sec = partes.length > 2 ? SECCION[partes[1]]?.[l] : undefined
  return sec ? `${sec} · ${bonito}` : bonito
}

/** Sin tildes ni mayúsculas, para que «kioto», «Kioto» y «kiotó» coincidan. */
const llano = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// Dónde cae cada punto del radar (ángulo en grados desde las 12, radio 0-1):
// repartidos para que no se pisen las etiquetas.
const POSICIONES: [number, number][] = [[52, 0.5], [205, 0.74], [295, 0.45]]
const VUELTA = 6 // segundos por vuelta del barrido; = animation de .p404-barrido

export default function Pagina404() {
  const { lang } = useLanguage()
  const { pathname } = useLocation()
  const navegar = useNavigate()
  // El idioma de la ruta manda: /es/loquesea es español aunque el navegador esté en inglés.
  const primero = pathname.split('/')[1]
  const l: L = primero === 'larion' ? 'ru' : (['es', 'en', 'ar', 'ru'] as const).includes(primero as L) ? (primero as L)
    : (['es', 'en', 'ar', 'ru'] as const).includes(lang as L) ? (lang as L) : 'en'
  const t = T[l]
  const [rutas, setRutas] = useState<string[] | null>(null)
  const [consulta, setConsulta] = useState('')

  const [nombres, setNombres] = useState<Record<string, string>>({})
  useEffect(() => {
    let vivo = true
    // El sitemap publicado no lleva las fichas de ventajas (noindex desde el
    // 18-10-2026, por Bing): se añaden desde sus propios datos, con su nombre.
    Promise.all([
      fetch('/sitemap.xml').then((r) => (r.ok ? r.text() : '')).catch(() => ''),
      import('./datosVentajas').then((m) => m.APPS).catch(() => []),
    ]).then(([xml, apps]) => {
      if (!vivo) return
      const delMapa = [...xml.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1])
      const base = { es: '/es/ventajas/', en: '/en/perks/', ar: '/ar/perks/', ru: '/ru/perks/' }
      const fichas = Object.values(base).flatMap((b) => apps.map((a) => `${b}${a.clave}/`))
      setNombres(Object.fromEntries(apps.map((a) => [a.clave, a.nombre])))
      setRutas([...new Set([...delMapa, ...fichas])])
    })
    return () => { vivo = false }
  }, [])

  // Las páginas del idioma, con el título con el que se enseñan y se buscan.
  const paginas = useMemo(() => {
    if (!rutas) return null
    const prefijo = l === 'ru' ? /^\/(ru|larion)\// : new RegExp(`^/${l}/`)
    return rutas.filter((r) => prefijo.test(r)).map((r) => ({ r, nombre: titulo(r, l, nombres) }))
  }, [rutas, l, nombres])

  const sugeridas = useMemo(() => {
    if (!paginas) return null
    return paginas
      .filter((x) => x.r !== t.ruta)
      .map((x) => ({ ...x, p: parecido(pathname.toLowerCase(), x.r) }))
      .filter((x) => x.p > 0.45)
      .sort((a, b) => b.p - a.p)
      .slice(0, 3)
  }, [paginas, pathname, t.ruta])

  // Buscador: primero lo que empieza por lo escrito, luego lo que lo contiene
  // (en el título o en la dirección) y, si nada, lo más parecido con erratas.
  const resultados = useMemo(() => {
    const q = llano(consulta.trim())
    if (!paginas || q.length < 2) return []
    const puntuadas = paginas.map((x) => {
      const n = llano(x.nombre), r = llano(x.r)
      const p = n.startsWith(q) ? 3 : n.includes(q) ? 2 : r.includes(q.replace(/\s+/g, '-')) ? 1.5
        : Math.max(...n.split(/[\s·]+/).map((w) => 1 - distancia(q, w.slice(0, q.length + 1)) / Math.max(q.length, 1)))
      return { ...x, p }
    })
    return puntuadas.filter((x) => x.p > 0.6).sort((a, b) => b.p - a.p || a.nombre.length - b.nombre.length).slice(0, 5)
  }, [consulta, paginas])

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    if (resultados[0]) navegar(resultados[0].r)
  }

  const url = typeof window !== 'undefined' ? window.location.href : pathname
  const wa = `https://wa.me/${(l === 'ru' ? GUIAS.larion : GUIAS.tony).wa}?text=${encodeURIComponent(t.waTexto.replace('{url}', url))}`

  return (
    <main className="p404" lang={l} dir={l === 'ar' ? 'rtl' : 'ltr'}>
      <Helmet><title>404 · Tony Kansai Guide</title><meta name="robots" content="noindex" /></Helmet>

      <div className="p404-dentro">
        <section className="p404-panel" aria-label={t.quizas} dir="ltr">
          <div className="p404-panel-cabeza" aria-hidden="true">
            <span>{t.barrido} 0{VUELTA}.0S</span>
            <span>{t.sector} · 34.69N 135.50E</span>
          </div>
          <div className="p404-radar">
            <svg viewBox="0 0 400 400" aria-hidden="true">
              {[66, 133, 199].map((r) => <circle key={r} cx="200" cy="200" r={r} />)}
              <line x1="0" y1="200" x2="400" y2="200" /><line x1="200" y1="0" x2="200" y2="400" />
              {Array.from({ length: 36 }, (_, i) => {
                const a = (i * 10 * Math.PI) / 180, largo = i % 3 === 0 ? 12 : 6
                return <line key={i} className="p404-marca" x1={200 + Math.sin(a) * 199} y1={200 - Math.cos(a) * 199}
                  x2={200 + Math.sin(a) * (199 - largo)} y2={200 - Math.cos(a) * (199 - largo)} />
              })}
            </svg>
            <div className="p404-barrido" aria-hidden="true" />
            <span className="p404-centro" aria-hidden="true"><i />{t.tu}</span>
            {(sugeridas ?? []).map(({ r, nombre }, i) => {
              const [ang, rad] = POSICIONES[i]
              const a = (ang * Math.PI) / 180
              return (
                <Link key={r} to={r} className={`p404-punto${ang > 180 ? ' p404-punto-izq' : ''}`}
                  style={{ left: `${50 + Math.sin(a) * rad * 50}%`, top: `${50 - Math.cos(a) * rad * 50}%`, animationDelay: `${(ang / 360) * VUELTA - VUELTA}s` }}>
                  <i /><b>{nombre.split(' · ').pop()}</b>
                </Link>
              )
            })}
          </div>
          <p className="p404-perdida"><span>{t.perdida}</span> <code>{pathname}</code></p>
        </section>

        <section className="p404-texto">
          <p className="p404-num" aria-label="404"><span>4</span><span className="p404-cero">0<i /></span><span>4</span></p>
          <h1>{t.titulo}</h1>
          <p className="p404-lema">{t.texto}</p>

          <form className="p404-busca" role="search" onSubmit={enviar}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input type="search" value={consulta} onChange={(e) => setConsulta(e.target.value)} placeholder={t.buscar}
              aria-label={t.buscar} autoComplete="off" enterKeyHint="go" />
            <button type="submit" aria-label={t.buscar}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </form>
          {consulta.trim().length >= 2 && (
            <ul className="p404-resultados" aria-live="polite">
              {resultados.length === 0 ? <li className="p404-nota">{t.sinResultados}</li>
                : resultados.map(({ r, nombre }) => (
                  <li key={r}><Link to={r}><b>{nombre}</b><span dir="ltr">{r}</span></Link></li>
                ))}
            </ul>
          )}

          <div className="p404-quizas" aria-live="polite">
            <h2>{t.quizas}</h2>
            {sugeridas === null ? <p className="p404-nota">{t.buscando}</p>
              : sugeridas.length === 0 ? <p className="p404-nota">{t.nada}</p>
              : (
                <ul>
                  {sugeridas.map(({ r, nombre }) => (
                    <li key={r}><Link to={r}><b>{nombre}</b><span dir="ltr">tonykansaiguide.com{r}</span></Link></li>
                  ))}
                </ul>
              )}
          </div>

          <div className="p404-botones">
            <Link className="p404-boton p404-boton-claro" to={t.ruta}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg>{t.inicio}
            </Link>
            <a className="p404-boton p404-boton-wa" href={wa} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z" /></svg>{t.wa}
            </a>
          </div>
        </section>
      </div>

      <nav className="p404-atajos" aria-label={t.atajos}>
        <h2>{t.atajos}</h2>
        <div>
          {ATAJOS[l].map(([ruta, nombre, kanji]) => (
            <Link key={ruta} to={ruta}><span lang="ja" aria-hidden="true">{kanji}</span><b>{nombre}</b></Link>
          ))}
        </div>
      </nav>
    </main>
  )
}
