// Ventajas para el viajero: apps y códigos de amigo que facilitan moverse y
// pagar en Kansai (/es/ventajas/, /en/perks/, /ar/perks/). Solo se ponen
// códigos reales de Tony; si una app no tiene campaña, se enlaza la oficial
// sin código. Cada app va en su ficha con sus colores y su logo (datosVentajas.ts),
// como en una tienda de apps, para que no se mezclen unas con otras.

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import { GUIAS, CORREO } from './contenido'
import { Logo } from './Logo'
import { IconoWa } from './IconoWa'
import { BarraWa } from './BarraWa'
import { BotonTema } from './Tema'
import { enlacesHreflang } from '../seo/hreflang'
import { PIE } from './formato'
import { APPS, CATEGORIAS, type Categoria } from './datosVentajas'
import { LOGOS } from './logosMarcas'
import './v7.css'
import './estilo-pixel.css'

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
    <button type="button" className="v7-plan-pagar" onClick={(e) => {
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
  const NOMBRE_IDIOMA: Record<VentajasId, string> = { es: 'Español', en: 'English', ar: 'العربية' }

  return (
    <div className={`v7 v7-pagina v7-otono v7-ventajas lang-${id}`} lang={id} dir={dir}>
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

      <header className="v7-cabecera cristal">
        <Link to={inicio} className="v7-marca" aria-label="Tony Kansai Guide"><Logo /></Link>
        <nav className="v7-idiomas" aria-label="Language">
          {(Object.keys(RUTA) as VentajasId[]).map((k) => (
            <Link key={k} to={RUTA[k]} lang={k} aria-current={k === id ? 'page' : undefined}>{NOMBRE_IDIOMA[k]}</Link>
          ))}
        </nav>
        <BotonTema lang={id} />
        <a className="v7-boton v7-boton-peq" href={wa} target="_blank" rel="noopener noreferrer" aria-label={p.finalBoton}>
          <span className="v7-solo-ancho">{p.finalBoton}</span><span className="v7-solo-movil"><IconoWa /></span>
        </a>
      </header>

      <main>
        <section className="v7-seccion v7-ventajas-hero">
          <div className="v7-otono-hero-texto">
            <p className="v7-antetitulo">{p.antetitulo}</p>
            <h1>{p.h1}</h1>
            <p>{p.sub}</p>
            <a className="v7-boton" href={wa} target="_blank" rel="noopener noreferrer"><IconoWa /> {p.finalBoton}</a>
          </div>
        </section>

        <section className="v7-seccion">
          {(Object.keys(CATEGORIAS) as Categoria[]).map((cat) => (
            <div key={cat} className="v7-apps-grupo">
              <h2 className="v7-apps-cat">{CATEGORIAS[cat][id]}</h2>
              <div className="v7-apps">
                {APPS.filter((a) => a.cat === cat).map((a) => (
                  <article key={a.clave} className="v7-app" style={{ ['--marca' as string]: a.marca.fondo, ['--marca-tinta' as string]: a.marca.tinta, ['--marca-boton' as string]: a.marca.boton ?? a.marca.tinta, ['--marca-boton-tinta' as string]: a.marca.botonTinta ?? a.marca.fondo }}>
                    <div className="v7-app-cara" aria-hidden="true">
                      {a.marca.logo
                        ? <svg viewBox="0 0 24 24" className="v7-app-logo"><path d={LOGOS[a.marca.logo]} fill="currentColor" /></svg>
                        : <span className="v7-app-palabra" dir="ltr">{a.marca.palabra}{a.marca.puntos && <span className="v7-app-puntos">{a.marca.puntos.map((c) => <i key={c} style={{ background: c }} />)}</span>}</span>}
                    </div>
                    <div className="v7-app-cuerpo">
                      <h3 dir="ltr">{a.nombre}</h3>
                      <p>{a.t[id].que}</p>
                      <p className="v7-app-ventaja">{a.t[id].ventaja}</p>
                      {a.codigo && (
                        <p className="v7-plan-grupo">{p.codigo}: <bdi dir="ltr"><code>{a.codigo.replace('https://', '')}</code></bdi> <BotonCopiar texto={a.codigo} copiar={p.copiar} copiado={p.copiado} /></p>
                      )}
                      <a className="v7-app-boton" href={a.codigo ?? a.enlace} target="_blank" rel="noopener noreferrer sponsored">{ABRIR[id]} {a.nombre} {id === 'ar' ? '↖' : '↗'}</a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
          <p className="v7-entradilla"><small>{p.aviso}</small></p>
        </section>

        <section className="v7-seccion">
          <h2>{p.consejosTitulo}</h2>
          <ul className="v7-notas">{p.consejos.map((c) => <li key={c}>{c}</li>)}</ul>
        </section>

        <section className="v7-seccion v7-otono-final">
          <h2>{p.finalTitulo}</h2>
          <p className="v7-entradilla">{p.finalTexto}</p>
          <a className="v7-boton" href={wa} target="_blank" rel="noopener noreferrer"><IconoWa /> {p.finalBoton}</a>
          <p><Link to={inicio}>{p.volver}</Link></p>
        </section>
      </main>
      <BarraWa href={wa} lang={id} pagina={`ventajas-${id}`} />

      <footer className="v7-pie">
        <div className="v7-pie-fila">
          <div><strong><Logo /></strong><p><a href={`mailto:${CORREO}`}>{CORREO}</a></p></div>
          <nav>
            <Link to={inicio}>Tony Kansai Guide</Link>
            <Link to={`/legal?lang=${id}`}>{pie.legal}</Link>
            <Link to={`/terms?lang=${id}`}>{pie.condiciones}</Link>
            <Link to={`/privacy?lang=${id}`}>{pie.privacidad}</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
