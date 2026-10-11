// Ventajas para el viajero: apps y códigos de amigo que facilitan moverse y
// pagar en Kansai (/es/ventajas/, /en/perks/, /ar/perks/). Solo se ponen
// códigos reales de Tony; si una app no tiene campaña, se enlaza la oficial
// sin código. Cada app va en su panel con sus colores y su logo (datosVentajas.ts);
// la página no usa el tema píxel: tiene su propia hoja, ventajas.css.

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import { GUIAS, CORREO } from './contenido'
import { Logo } from './Logo'
import { IconoWa } from './IconoWa'
import { enlacesHreflang } from '../seo/hreflang'
import { PIE } from './formato'
import { APPS, CATEGORIAS, type Categoria } from './datosVentajas'
import { LOGOS } from './logosMarcas'
import './v7.css'
import './ventajas.css'

export type VentajasId = 'es' | 'en' | 'ar'
const BASE = 'https://tonykansaiguide.com'

export const RUTAS_VENTAJAS: Record<string, VentajasId> = {
  '/es/ventajas': 'es',
  '/en/perks': 'en',
  '/ar/perks': 'ar',
}
const RUTA: Record<VentajasId, string> = { es: '/es/ventajas/', en: '/en/perks/', ar: '/ar/perks/' }



type Textos = {
  titulo: string; descripcion: string; antetitulo: string; h1: string; sub: string
  copiar: string; copiado: string; codigo: string
  consejosTitulo: string; consejos: string[]
  aviso: string; finalTitulo: string; finalTexto: string; finalBoton: string; volver: string; saludo: string
}

const T: Record<VentajasId, Textos> = {
  es: {
    titulo: 'Ventajas para tu viaje a Kansai: apps y códigos | Tony Kansai Guide',
    descripcion: 'Las apps que recomiendo para Kansai: eSIM, entradas, hoteles, taxis, bicis y pagos. Airalo, Klook, GetYourGuide, Trip.com, Agoda, GO, LUUP, ICOCA y Wise.',
    antetitulo: '🎁 Ventajas para mis viajeros',
    h1: 'Las apps para viajar por Kansai como un local',
    sub: 'Las apps que uso y recomiendo en Osaka y Kioto: internet, entradas, hotel, taxi, bici y pagos. Cada una en su ficha, para ir directo a lo que necesitas.',
    copiar: 'Copiar código', copiado: '¡Copiado!', codigo: 'Mi código',
    consejosTitulo: 'Mis consejos',
    consejos: [
      'En patinete, siempre por la calzada y por la izquierda; por la acera está prohibido salvo en modo 6 km/h.',
      'Antes de salir, mira en la app que el punto de llegada tenga hueco: si está lleno, sigues pagando mientras buscas otro.',
      'Paga en yenes, nunca en euros o dólares cuando el datáfono te lo ofrezca: el cambio del comercio es peor.',
    ],
    aviso: 'Algunos enlaces son de invitación: si te registras con ellos, la app puede darme una pequeña recompensa a mí también. No cambia tu precio.',
    finalTitulo: '¿Prefieres no pelearte con apps?', finalTexto: 'En mis tours me ocupo yo de todos los desplazamientos: te recojo en el hotel y vamos juntos.', finalBoton: 'Escríbeme por WhatsApp', volver: 'Volver a la página de Tony',
    saludo: 'Hola Tony, he visto tu página de ventajas y quería preguntarte por un tour.',
  },
  en: {
    titulo: 'Perks for your Kansai trip: apps and invite links | Tony Kansai Guide',
    descripcion: 'The apps I recommend for Kansai: eSIM, tickets, hotels, taxis, bikes and payments. Airalo, Klook, GetYourGuide, Trip.com, Agoda, GO, LUUP, ICOCA and Wise.',
    antetitulo: '🎁 Perks for my travellers',
    h1: 'The apps to travel Kansai like a local',
    sub: 'The apps I use and recommend in Osaka and Kyoto: data, tickets, hotels, taxis, bikes and payments. Each one on its own card, so you go straight to what you need.',
    copiar: 'Copy code', copiado: 'Copied!', codigo: 'My code',
    consejosTitulo: 'My tips',
    consejos: [
      'On a scooter, always ride on the road and keep left; pavements are off-limits except in 6 km/h mode.',
      'Before you set off, check in the app that the drop-off port has space: if it is full you keep paying while you look for another.',
      'Always pay in yen, never in your home currency when the card machine offers it: the shop rate is worse.',
    ],
    aviso: 'Some links are invite links: if you sign up with them the app may give me a small reward too. Your price does not change.',
    finalTitulo: 'Rather not deal with apps?', finalTexto: 'On my tours I handle all the getting around: I pick you up at your hotel and we go together.', finalBoton: 'Message me on WhatsApp', volver: "Back to Tony's page",
    saludo: 'Hi Tony, I saw your perks page and wanted to ask about a tour.',
  },
  ar: {
    titulo: 'مزايا لرحلتك إلى كانساي: تطبيقات وروابط دعوة | Tony Kansai Guide',
    descripcion: 'التطبيقات التي أستخدمها كل يوم في أوساكا وكيوتو للتنقل والدفع، مع روابط الدعوة الخاصة بي: Wise وLUUP وHELLO CYCLING وبطاقة ICOCA على الهاتف.',
    antetitulo: '🎁 مزايا لضيوفي',
    h1: 'تطبيقات السفر في كانساي مثل أهل البلد',
    sub: 'التطبيقات التي أستخدمها وأنصح بها في أوساكا وكيوتو: الإنترنت والتذاكر والفنادق والتاكسي والدراجات والدفع، كلٌّ في بطاقته.',
    copiar: 'نسخ الرمز', copiado: 'تم النسخ!', codigo: 'رمزي',
    consejosTitulo: 'نصائحي',
    consejos: [
      'بالسكوتر، سِر دائمًا على الطريق وفي الجهة اليسرى؛ الرصيف ممنوع إلا في وضع 6 كم/ساعة.',
      'قبل الانطلاق، تأكد في التطبيق أن محطة الوصول فيها مكان؛ إن كانت ممتلئة يستمر العدّاد وأنت تبحث عن غيرها.',
      'ادفع دائمًا بالين، لا بعملة بلدك عندما يعرض جهاز الدفع ذلك؛ سعر المتجر أسوأ.',
    ],
    aviso: 'بعض الروابط روابط دعوة: إذا سجّلت بها قد يمنحني التطبيق مكافأة صغيرة أيضًا. سعرك لا يتغير.',
    finalTitulo: 'تفضّل ألّا تتعب مع التطبيقات؟', finalTexto: 'في جولاتي أتولّى أنا كل التنقلات: آخذك من الفندق ونذهب معًا.', finalBoton: 'راسلني على واتساب', volver: 'العودة إلى صفحة توني',
    saludo: 'السلام عليكم توني، رأيت صفحة المزايا وأريد أن أسأل عن جولة.',
  },
}

const ABRIR: Record<VentajasId, string> = { es: 'Abrir', en: 'Open', ar: 'افتح' }

function BotonCopiar({ texto, copiar, copiado }: { texto: string; copiar: string; copiado: string }) {
  const marcar = (b: HTMLButtonElement) => { b.textContent = copiado; setTimeout(() => { b.textContent = copiar }, 1800) }
  return (
    <button type="button" className="vt-copiar" onClick={(e) => {
      const b = e.currentTarget
      navigator.clipboard?.writeText(texto).then(() => marcar(b)).catch(() => window.prompt(copiar, texto))
    }}>{copiar}</button>
  )
}

export default function Ventajas({ id }: { id: VentajasId }) {
  const p = T[id]
  const dir = id === 'ar' ? 'rtl' : 'ltr'
  const { setLang } = useLanguage()
  useEffect(() => { setLang(id) }, [id, setLang])
  const url = `${BASE}${RUTA[id]}`
  const inicio = `/${id}/`
  const wa = `https://wa.me/${GUIAS.tony.wa}?text=${encodeURIComponent(p.saludo)}`
  const pie = PIE[id]
  const hermanas = (Object.keys(RUTA) as VentajasId[]).map((k) => ({ lang: k, href: `${BASE}${RUTA[k]}` }))
  const NOMBRE_IDIOMA: Record<VentajasId, string> = { es: 'ES', en: 'EN', ar: 'عربي' }
  const raiz = useRef<HTMLDivElement>(null)

  // Aparición al bajar: solo con JS activo (la página estática se ve entera sin él).
  useEffect(() => {
    const nodo = raiz.current
    if (!nodo || !('IntersectionObserver' in window)) return
    nodo.classList.add('vt-js')
    const io = new IntersectionObserver((entradas) => {
      for (const e of entradas) if (e.isIntersecting) { e.target.classList.add('vt-visto'); io.unobserve(e.target) }
    }, { threshold: 0.18 })
    nodo.querySelectorAll('.vt-aparece').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [id])

  const categorias = (Object.keys(CATEGORIAS) as Categoria[]).filter((c) => APPS.some((a) => a.cat === c))
  const primeraDe = (c: Categoria) => APPS.find((a) => a.cat === c)?.clave

  return (
    <div ref={raiz} className={`vt lang-${id}`} lang={id} dir={dir}>
      <Helmet>
        <html lang={id} dir={dir} />
        <title>{p.titulo}</title>
        <meta name="description" content={p.descripcion} />
        <link rel="canonical" href={url} />
        {enlacesHreflang(hermanas)}
        <meta property="og:title" content={p.titulo} />
        <meta property="og:description" content={p.descripcion} />
        <meta property="og:url" content={url} />
      </Helmet>

      <header className="vt-barra">
        <Link to={inicio} className="vt-marca" aria-label="Tony Kansai Guide"><Logo /></Link>
        <nav className="vt-idiomas" aria-label="Language">
          {(Object.keys(RUTA) as VentajasId[]).map((k) => (
            <Link key={k} to={RUTA[k]} lang={k} aria-current={k === id ? 'page' : undefined}>{NOMBRE_IDIOMA[k]}</Link>
          ))}
        </nav>
        <a className="vt-wa" href={wa} target="_blank" rel="noopener noreferrer" aria-label={p.finalBoton}>
          <IconoWa /><span className="vt-solo-ancho">{p.finalBoton}</span>
        </a>
      </header>

      <main>
        <section className="vt-portada">
          <p className="vt-antetitulo">{p.antetitulo.replace(/^\p{Extended_Pictographic}\s*/u, '')}</p>
          <h1>{p.h1}</h1>
          <p className="vt-sub">{p.sub}</p>
          <nav className="vt-indice" aria-label={p.antetitulo}>
            {categorias.map((c) => <a key={c} href={`#${primeraDe(c)}`}>{CATEGORIAS[c][id]}</a>)}
          </nav>
        </section>

        <div className="vt-pila">
          {APPS.map((a, n) => {
            const cupon = a.codigo && !a.codigo.startsWith('http') ? a.codigo : undefined
            const href = a.codigo?.startsWith('http') ? a.codigo : a.enlace
            return (
              <section key={a.clave} id={a.clave} className={`vt-panel ${n % 2 ? 'vt-panel-inverso' : ''}`}
                style={{ ['--marca' as string]: a.marca.fondo, ['--marca-tinta' as string]: a.marca.tinta, ['--marca-boton' as string]: a.marca.boton ?? a.marca.tinta, ['--marca-boton-tinta' as string]: a.marca.botonTinta ?? a.marca.fondo, zIndex: n + 1 }}>
                <div className="vt-panel-dentro">
                  <div className="vt-sello vt-aparece" aria-hidden="true">
                    {a.marca.logo
                      ? <svg viewBox="0 0 24 24" className="vt-logo"><path d={LOGOS[a.marca.logo]} fill="currentColor" /></svg>
                      : <span className="vt-palabra" dir="ltr">{a.marca.palabra}{a.marca.puntos && <span className="vt-puntos">{a.marca.puntos.map((c) => <i key={c} style={{ background: c }} />)}</span>}</span>}
                  </div>
                  <div className="vt-texto vt-aparece">
                    <p className="vt-cat"><span>{String(n + 1).padStart(2, '0')}</span> {CATEGORIAS[a.cat][id]}</p>
                    <h2 dir="ltr">{a.nombre}</h2>
                    <p className="vt-que">{a.t[id].que}</p>
                    <p className="vt-ventaja">{a.t[id].ventaja}</p>
                    {cupon && (
                      <div className="vt-cupon">
                        <span>{p.codigo}</span>
                        <bdi dir="ltr"><code>{cupon}</code></bdi>
                        <BotonCopiar texto={cupon} copiar={p.copiar} copiado={p.copiado} />
                      </div>
                    )}
                    <a className="vt-boton" href={href} target="_blank" rel="noopener noreferrer sponsored">{ABRIR[id]} {a.nombre} <span aria-hidden="true">{id === 'ar' ? '←' : '→'}</span></a>
                  </div>
                </div>
              </section>
            )
          })}
        </div>

        <section className="vt-bloque">
          <h2>{p.consejosTitulo}</h2>
          <ol className="vt-consejos">{p.consejos.map((c) => <li key={c}>{c}</li>)}</ol>
          <p className="vt-aviso">{p.aviso}</p>
        </section>

        <section className="vt-final">
          <h2>{p.finalTitulo}</h2>
          <p>{p.finalTexto}</p>
          <a className="vt-wa vt-wa-grande" href={wa} target="_blank" rel="noopener noreferrer"><IconoWa /> {p.finalBoton}</a>
          <p><Link to={inicio}>{p.volver}</Link></p>
        </section>
      </main>

      <footer className="vt-pie">
        <span><Logo /></span>
        <a href={`mailto:${CORREO}`}>{CORREO}</a>
        <nav>
          <Link to={`/legal?lang=${id}`}>{pie.legal}</Link>
          <Link to={`/terms?lang=${id}`}>{pie.condiciones}</Link>
          <Link to={`/privacy?lang=${id}`}>{pie.privacidad}</Link>
        </nav>
      </footer>
    </div>
  )
}
