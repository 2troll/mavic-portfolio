// Página para viajeros de México: lo práctico del viaje y el tour con precio en
// pesos al cambio del día. Regla de contenido: nada que no sea verdad; lo que
// cambia (visado, vuelos) se dice con su fuente para que lo comprueben.

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import { GUIAS, CORREO, PAYPAL_TONY, PAGAR } from './contenido'
import { foto } from './foto'
import { Logo } from './Logo'
import { IconoWa } from './IconoWa'
import { BarraWa } from './BarraWa'
import { BotonTema } from './Tema'
import { useCambio } from './cambio'
import { yenLocal, PIE } from './formato'
import { RUTA_MEXICO, SEO_MEXICO } from './datosMexico'
import './v7.css'

const BASE = 'https://tonykansaiguide.com'
const HERO = '/v7/fotos/kioto.jpg'
const PRECIOS = [
  { nombre: 'Medio día · 4 horas', yenes: 38000 },
  { nombre: 'Día completo · 8 horas', yenes: 58000 },
]

const PRACTICO = [
  { icono: '🕐', t: 'Horario', d: 'Japón va 15 horas por delante de Ciudad de México y 14 por delante de Cancún. Escríbeme cuando quieras: te contesto en cuanto amanezca aquí.' },
  { icono: '🛂', t: 'Visado', d: 'Para turismo de corta estancia, los mexicanos no necesitan visado para entrar en Japón. Antes de viajar, confírmalo en la web de la Embajada de Japón en México.' },
  { icono: '✈️', t: 'Cómo llegar a Kansai', d: 'Hay vuelos directos de Ciudad de México a Tokio. Desde Tokio, el shinkansen llega a Kioto en unas dos horas y cuarto; también hay vuelos con escala al aeropuerto de Kansai.' },
  { icono: '💴', t: 'Dinero', d: 'En Japón el efectivo sigue siendo útil. Los cajeros de 7-Eleven aceptan tarjetas extranjeras. Y no se dejan propinas: en ningún sitio, tampoco conmigo.' },
  { icono: '🔌', t: 'Enchufes', d: 'Son de tipo A, como en México, a 100 voltios. Los cargadores de móvil y portátil funcionan sin adaptador.' },
  { icono: '💳', t: 'Pagar el tour', d: 'En efectivo, en yenes, el día del tour. O por adelantado desde México con PayPal y tu tarjeta, cuando ya tengamos la fecha.' },
]

const IDEAS = [
  { t: 'Kioto en un día', d: 'Fushimi Inari antes de la gente, Kiyomizu, Gion y el Pabellón Dorado.', a: '/es/kyoto/' },
  { t: 'Osaka comiendo', d: 'El castillo, el mercado de Kuromon y los neones de Dōtonbori.', a: '/es/osaka/' },
  { t: 'Nara y sus ciervos', d: 'El Gran Buda de Tōdai-ji y el parque, a 45 minutos de Osaka.', a: '/es/nara/' },
  { t: 'Otoño en Kioto', d: 'Los arces rojos de noviembre, saliendo temprano.', a: '/es/otono-kioto/' },
]

export default function Mexico() {
  const { setLang } = useLanguage()
  useEffect(() => { setLang('es') }, [setLang])
  const cambios = useCambio(['MXN', 'USD'])
  const wa = `https://wa.me/${GUIAS.tony.wa}?text=${encodeURIComponent('Hola Tony, venimos de México y nos interesa un tour. Fechas: ')}`
  const pie = PIE.es
  const mxn = (y: number) => {
    const c = cambios.find((x) => x.divisa === 'MXN')
    return c ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(y * c.tasa) + ' MXN' : ''
  }
  const usd = (y: number) => {
    const c = cambios.find((x) => x.divisa === 'USD')
    return c ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(y * c.tasa) + ' USD' : ''
  }
  const ld = {
    '@context': 'https://schema.org', '@type': 'TouristTrip', name: 'Tour privado en español por Kansai para viajeros de México',
    description: SEO_MEXICO.descripcion, url: `${BASE}${RUTA_MEXICO}`, inLanguage: 'es', touristType: 'Viajeros de México',
    offers: PRECIOS.map((x) => ({ '@type': 'Offer', name: x.nombre, price: x.yenes, priceCurrency: 'JPY', url: `${BASE}${RUTA_MEXICO}` })),
    provider: { '@type': 'LocalBusiness', name: 'Tony Kansai Guide', url: BASE, telephone: `+${GUIAS.tony.wa}`, email: CORREO },
  }

  return (
    <div className="v7 v7-pagina v7-otono lang-es" lang="es" dir="ltr">
      <Helmet>
        <html lang="es" dir="ltr" />
        <title>{SEO_MEXICO.titulo}</title>
        <meta name="description" content={SEO_MEXICO.descripcion} />
        <link rel="canonical" href={`${BASE}${RUTA_MEXICO}`} />
        <meta property="og:title" content={SEO_MEXICO.titulo} />
        <meta property="og:description" content={SEO_MEXICO.descripcion} />
        <meta property="og:url" content={`${BASE}${RUTA_MEXICO}`} />
        <meta property="og:image" content={`${BASE}${HERO}`} />
        <script type="application/ld+json">{JSON.stringify(ld)}</script>
      </Helmet>

      <header className="v7-cabecera cristal">
        <Link to="/es/" className="v7-marca" aria-label="Tony Kansai Guide"><Logo /></Link>
        {/* Sin selector de idiomas: el hueco empuja los botones a la derecha. */}
        <span aria-hidden="true" style={{ flex: 1 }} />
        <BotonTema lang="es" />
        <a className="v7-boton v7-boton-peq" href={wa} target="_blank" rel="noopener noreferrer" aria-label="Escríbeme por WhatsApp">
          <span className="v7-solo-ancho">Escríbeme</span><span className="v7-solo-movil"><IconoWa /></span>
        </a>
      </header>

      <main>
        <section className="v7-otono-hero">
          <img {...foto(HERO)} alt="Fushimi Inari, Kioto" {...{ fetchpriority: 'high' }} />
          <div className="v7-otono-hero-texto">
            <p className="v7-antetitulo">🇲🇽 Para viajeros de México</p>
            <h1>Japón desde México, con guía en español.</h1>
            <p>Soy Tony. Te recojo en el hotel y pasamos el día en Kioto, Osaka o Nara, solo con tu grupo. Sin agencia: hablas directamente conmigo, por WhatsApp, en tu idioma.</p>
            <a className="v7-boton" href={wa} target="_blank" rel="noopener noreferrer"
              onClick={() => window.gtag?.('event', 'generate_lead', { pagina: 'mexico', canal: 'whatsapp' })}><IconoWa /> Cuéntame tu viaje</a>
          </div>
        </section>

        <section className="v7-seccion">
          <h2>Lo práctico, antes de volar</h2>
          <ul className="v7-otono-sitios">
            {PRACTICO.map((x) => (
              <li key={x.t} className="tarjeta">
                <span className="v7-otono-kanji" aria-hidden="true">{x.icono}</span>
                <h3>{x.t}</h3>
                <p>{x.d}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="v7-seccion" id="precios">
          <h2>Precio por grupo, en pesos al cambio de hoy</h2>
          <div className="v7-planes">
            {PRECIOS.map((x, i) => (
              <article key={x.nombre} className={`v7-plan tarjeta ${i === 1 ? 'v7-plan-destacado' : ''}`}>
                <h3>{x.nombre}</h3>
                <p className="v7-plan-precio"><bdi>{yenLocal(x.yenes, 'es')}</bdi></p>
                <p className="v7-plan-grupo">por grupo, hasta 6 personas</p>
                <p className="v7-plan-persona">Siendo 4: {yenLocal(x.yenes / 4, 'es')} por persona</p>
                {cambios.length > 0 && <p className="v7-plan-aprox">≈ {mxn(x.yenes)} · {usd(x.yenes)}</p>}
                <a className="v7-plan-pagar" href={`${PAYPAL_TONY}/${x.yenes}JPY`} target="_blank" rel="noopener noreferrer">{PAGAR.es.boton}</a>
              </article>
            ))}
          </div>
          <ul className="v7-notas">
            <li>{PAGAR.es.nota}</li>
            <li>Trenes, entradas y comidas no están incluidos: los pagáis en el momento y yo os digo cómo.</li>
            <li>Cancelación sin coste hasta 72 horas antes.</li>
          </ul>
          {cambios.length > 0 && <p className="v7-fuente-cambio">≈ al cambio de hoy · <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer">Rates by Exchange Rate API</a></p>}
        </section>

        <section className="v7-seccion">
          <h2>Ideas para tu día</h2>
          <ul className="v7-otono-sitios">
            {IDEAS.map((x) => (
              <li key={x.t} className="tarjeta">
                <h3><Link to={x.a}>{x.t} →</Link></h3>
                <p>{x.d}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="v7-seccion v7-otono-final">
          <h2>¿Cuándo venís?</h2>
          <p className="v7-entradilla">Dime fechas, cuántos sois y dónde os alojáis. Te contesto yo, Tony, normalmente el mismo día.</p>
          <a className="v7-boton" href={wa} target="_blank" rel="noopener noreferrer"
            onClick={() => window.gtag?.('event', 'generate_lead', { pagina: 'mexico', canal: 'whatsapp' })}><IconoWa /> Escríbeme por WhatsApp</a>
          <p><Link to="/es/">Ver la página principal</Link></p>
        </section>
      </main>
      <BarraWa href={wa} lang="es" pagina="mexico" />

      <footer className="v7-pie">
        <div className="v7-pie-fila">
          <div><strong><Logo /></strong><p><a href={`mailto:${CORREO}`}>{CORREO}</a></p></div>
          <nav>
            <Link to="/es/">Tony Kansai Guide</Link>
            <Link to="/legal?lang=es">{pie.legal}</Link>
            <Link to="/terms?lang=es">{pie.condiciones}</Link>
            <Link to="/privacy?lang=es">{pie.privacidad}</Link>
          </nav>
        </div>
        <details className="v7-creditos">
          <summary>{pie.creditos}</summary>
          <ul lang="es"><li>Kioto: Fushimi Inari: <a href="https://commons.wikimedia.org/wiki/File:Double_torii_path_at_Fushimi_Inari_Taisha_Shrine,_Kyoto,_Japan.jpg" target="_blank" rel="noopener noreferrer">Basile Morin</a>, CC BY-SA 4.0</li></ul>
        </details>
      </footer>
    </div>
  )
}
