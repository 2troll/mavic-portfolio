// Ventajas para el viajero: apps y códigos de amigo que facilitan moverse y
// pagar en Kansai (/es/ventajas/, /en/perks/, /ar/perks/). Solo se ponen
// códigos reales de Tony; si una app no tiene campaña, se enlaza la oficial
// sin código. Nada de imitar el diseño ni el logo de otras marcas.

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

type Oferta = {
  clave: string
  icono: string
  nombre: string
  que: string
  ventaja: string
  codigo?: string
  enlace: string
  boton: string
}

const WISE = 'https://wise.com/invite/amc/amirk1643'

type Textos = {
  titulo: string; descripcion: string; antetitulo: string; h1: string; sub: string
  copiar: string; copiado: string; codigo: string
  ofertas: Oferta[]; consejosTitulo: string; consejos: string[]
  aviso: string; finalTitulo: string; finalTexto: string; finalBoton: string; volver: string; saludo: string
}

const T: Record<VentajasId, Textos> = {
  es: {
    titulo: 'Ventajas para tu viaje a Kansai: apps y códigos | Tony Kansai Guide',
    descripcion: 'Apps que uso a diario en Osaka y Kioto para moverse y pagar, con mis enlaces de invitación: Wise, LUUP, HELLO CYCLING e ICOCA en el móvil.',
    antetitulo: '🎁 Ventajas para mis viajeros',
    h1: 'Muévete y paga en Kansai como un local',
    sub: 'Las apps que uso cada día en Osaka y Kioto. Donde tengo un enlace de invitación, lo dejo aquí para que te llevéis la ventaja tú y yo.',
    copiar: 'Copiar enlace', copiado: '¡Copiado!', codigo: 'Mi enlace',
    ofertas: [
      { clave: 'wise', icono: '💳', nombre: 'Wise', que: 'Cuenta y tarjeta para pagar en yenes al cambio real, sin las comisiones del banco.', ventaja: 'Con mi enlace, tu primer envío sale sin comisión (según las condiciones de Wise en tu país). También sirve para pagarme el tour.', codigo: WISE, enlace: WISE, boton: 'Abrir Wise' },
      { clave: 'luup', icono: '🛴', nombre: 'LUUP', que: 'Patinetes y bicis eléctricas compartidos por todo Osaka y Kioto. Se cogen y se dejan en sus puntos con la app.', ventaja: 'Cuando LUUP abra su campaña de invitación pondré aquí mi código. Patinete desde 16 años y tras su test de normas; bici sin test.', enlace: 'https://luup.sc/en/', boton: 'Ver LUUP' },
      { clave: 'hello', icono: '🚲', nombre: 'HELLO CYCLING', que: 'Bicis eléctricas compartidas con cientos de estaciones en Kansai. Ideal para Kioto, donde el bus va lleno.', ventaja: 'Se paga por minutos con tarjeta desde la app; no hace falta cuenta japonesa.', enlace: 'https://www.hellocycling.jp/', boton: 'Ver HELLO CYCLING' },
      { clave: 'ic', icono: '🚃', nombre: 'ICOCA / Suica en el móvil', que: 'La tarjeta de transporte dentro del móvil: trenes, metro, buses y konbini sin sacar monedas.', ventaja: 'En iPhone se añade gratis desde la app Cartera; se recarga con tu tarjeta y no tiene depósito.', enlace: 'https://www.jr-odekake.net/icoca/', boton: 'Ver ICOCA' },
    ],
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
    descripcion: 'The apps I use every day in Osaka and Kyoto to get around and pay, with my invite links: Wise, LUUP, HELLO CYCLING and ICOCA on your phone.',
    antetitulo: '🎁 Perks for my travellers',
    h1: 'Get around and pay in Kansai like a local',
    sub: 'The apps I use every day in Osaka and Kyoto. Where I have an invite link, it is here so you get the perk.',
    copiar: 'Copy link', copiado: 'Copied!', codigo: 'My link',
    ofertas: [
      { clave: 'wise', icono: '💳', nombre: 'Wise', que: 'Account and card to pay in yen at the real exchange rate, without bank fees.', ventaja: 'With my link your first transfer is fee-free (subject to Wise terms in your country). You can also use it to pay for your tour.', codigo: WISE, enlace: WISE, boton: 'Open Wise' },
      { clave: 'luup', icono: '🛴', nombre: 'LUUP', que: 'Shared e-scooters and e-bikes all over Osaka and Kyoto. Pick up and drop off at their ports with the app.', ventaja: 'When LUUP opens its invite campaign I will add my code here. Scooters from age 16 after their traffic quiz; bikes need no quiz.', enlace: 'https://luup.sc/en/', boton: 'See LUUP' },
      { clave: 'hello', icono: '🚲', nombre: 'HELLO CYCLING', que: 'Shared e-bikes with hundreds of stations in Kansai. Great for Kyoto, where buses are packed.', ventaja: 'Pay by the minute with a card in the app; no Japanese account needed.', enlace: 'https://www.hellocycling.jp/', boton: 'See HELLO CYCLING' },
      { clave: 'ic', icono: '🚃', nombre: 'ICOCA / Suica on your phone', que: 'Your transport card inside your phone: trains, subway, buses and convenience stores without coins.', ventaja: 'On iPhone you add it free from the Wallet app; top up with your card, no deposit.', enlace: 'https://www.jr-odekake.net/icoca/', boton: 'See ICOCA' },
    ],
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
    h1: 'تنقّل وادفع في كانساي مثل أهل البلد',
    sub: 'التطبيقات التي أستخدمها يوميًا في أوساكا وكيوتو. وحيث يكون لدي رابط دعوة، تجده هنا لتحصل على الميزة.',
    copiar: 'نسخ الرابط', copiado: 'تم النسخ!', codigo: 'رابطي',
    ofertas: [
      { clave: 'wise', icono: '💳', nombre: 'Wise', que: 'حساب وبطاقة للدفع بالين بسعر الصرف الحقيقي، بلا رسوم البنوك.', ventaja: 'مع رابطي يكون أول تحويل لك بلا رسوم (حسب شروط Wise في بلدك). ويمكنك استخدامه أيضًا لدفع ثمن الجولة.', codigo: WISE, enlace: WISE, boton: 'افتح Wise' },
      { clave: 'luup', icono: '🛴', nombre: 'LUUP', que: 'سكوترات ودراجات كهربائية مشتركة في كل أنحاء أوساكا وكيوتو، تأخذها وتعيدها في محطاتها عبر التطبيق.', ventaja: 'عندما تطلق LUUP حملة الدعوة سأضع رمزي هنا. السكوتر من عمر 16 سنة بعد اختبار قواعد المرور، والدراجة بلا اختبار.', enlace: 'https://luup.sc/en/', boton: 'تعرّف على LUUP' },
      { clave: 'hello', icono: '🚲', nombre: 'HELLO CYCLING', que: 'دراجات كهربائية مشتركة بمئات المحطات في كانساي، مثالية لكيوتو حيث الحافلات مزدحمة.', ventaja: 'تدفع بالدقيقة ببطاقتك من التطبيق، ولا تحتاج إلى حساب ياباني.', enlace: 'https://www.hellocycling.jp/', boton: 'تعرّف على HELLO CYCLING' },
      { clave: 'ic', icono: '🚃', nombre: 'ICOCA / Suica على الهاتف', que: 'بطاقة المواصلات داخل هاتفك: القطارات والمترو والحافلات والمتاجر بلا عملات معدنية.', ventaja: 'على الآيفون تضيفها مجانًا من تطبيق المحفظة، وتشحنها ببطاقتك بلا تأمين.', enlace: 'https://www.jr-odekake.net/icoca/', boton: 'تعرّف على ICOCA' },
    ],
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
          <div className="v7-planes">
            {p.ofertas.map((o) => (
              <article key={o.clave} className={`v7-plan tarjeta ${o.codigo ? 'v7-plan-destacado' : ''}`}>
                <p className="v7-otono-kanji" aria-hidden="true">{o.icono}</p>
                <h3>{o.nombre}</h3>
                <p>{o.que}</p>
                <p><strong>{o.ventaja}</strong></p>
                {o.codigo && (
                  <>
                    <p className="v7-plan-grupo">{p.codigo}: <bdi dir="ltr"><code>{o.codigo.replace('https://', '')}</code></bdi></p>
                    <BotonCopiar texto={o.codigo} copiar={p.copiar} copiado={p.copiado} />
                  </>
                )}
                <p><a href={o.enlace} target="_blank" rel="noopener noreferrer sponsored">{o.boton} ↗</a></p>
              </article>
            ))}
          </div>
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
