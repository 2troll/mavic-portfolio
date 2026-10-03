import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Component, useEffect, lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { MotionConfig } from 'framer-motion'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { LanguageProvider, detectLang } from './contexts/LanguageContext'
import { translate } from './lib/dict'
import { WhatsAppFloat } from './components/WhatsAppFloat'
import { CookieBanner } from './components/CookieBanner'
const Tours = lazy(() => import('./pages/Tours'))
const TourDetail = lazy(() => import('./pages/TourDetail'))
const About = lazy(() => import('./pages/About'))
const Pricing = lazy(() => import('./pages/Pricing'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Booking = lazy(() => import('./pages/Booking'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const Cookies = lazy(() => import('./pages/Cookies'))
const Safety = lazy(() => import('./pages/Safety'))
const Legal = lazy(() => import('./pages/Legal'))
const Accessibility = lazy(() => import('./pages/Accessibility'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Pagina404 = lazy(() => import('./v7/Pagina404'))
const GuideDetail = lazy(() => import('./pages/GuideDetail'))
// El panel interno pesa lo que pesa (contratos en PDF incluidos) y sólo lo
// usa Tony: se descarga sólo cuando se entra en /admin.
const Admin = lazy(() => import('./pages/Admin'))
// Web v7: portada con globo y una página por idioma. Van fuera del Navbar y
// del Footer antiguos; three.js sólo se descarga al entrar en ellas.
import Redirige from './v7/Redirige'
import type { Destino } from './v7/Redirige'
const PaginaGuia = lazy(() => import('./v7/PaginaGuia'))
const Montana = lazy(() => import('./v7/Montana'))
const Itinerarios = lazy(() => import('./v7/Itinerarios'))
const CiudadPagina = lazy(() => import('./v8/CiudadPagina'))
import { CIUDADES_LARION, CIUDADES_TONY } from './v8/ciudades'
import type { PaginaCiudad } from './v8/CiudadPagina'

// Páginas de ciudad (v8): /es|en|ar/{ciudad}/ de Tony y /ru|larion/{ciudad}/ de Larion.
function paginaCiudad(ruta: string): PaginaCiudad | null {
  const m = ruta.match(/^\/(es|en|ar|ru|larion)\/([a-z]+)$/)
  if (!m) return null
  const prefijo = `/${m[1]}` as PaginaCiudad['prefijo']
  const guia = m[1] === 'ru' || m[1] === 'larion' ? 'larion' : 'tony'
  const lista: string[] = guia === 'larion' ? CIUDADES_LARION : CIUDADES_TONY
  if (!lista.includes(m[2])) return null
  return { prefijo, guia, lang: m[1] === 'larion' ? 'en' : (m[1] as PaginaCiudad['lang']), ciudad: m[2] as PaginaCiudad['ciudad'] }
}
const RUTAS_CIUDAD = [
  ...['/es', '/en', '/ar'].flatMap((p) => CIUDADES_TONY.map((c) => `${p}/${c}`)),
  ...['/ru', '/larion'].flatMap((p) => CIUDADES_LARION.map((c) => `${p}/${c}`)),
]
import { Corte } from './v7/Corte'
import { MarcoLegal } from './v7/MarcoLegal'

// Páginas legales: el contenido de siempre dentro del marco nuevo de papel y tinta.
// Rutas que aún sirve la web antigua; cualquier otra cosa es un 404 con el marco claro v7.
const RUTA_ANTIGUA = /^\/(tours|hiking|guide|guides|book|booking|about|pricing|faq)(\/|$)/
const DESTINO_ANTIGUA: Record<string, Destino> = { pricing: 'precios', book: 'precios', booking: 'precios', tours: 'rutas', hiking: 'montana' }
const LEGALES = ['/terms', '/privacy', '/cookies', '/safety', '/legal', '/accessibility']
const RUTAS_V7: Record<string, 'portada' | 'es' | 'en' | 'ar' | 'ru' | 'larion' | 'm-es' | 'm-en' | 'm-ar' | 'm-ru' | 'i-es' | 'i-en' | 'i-ar' | 'i-ru' | 'i-larion'> = {
  '/': 'portada', '/es': 'es', '/en': 'en', '/ar': 'ar', '/ru': 'ru', '/larion': 'larion',
  // Montaña: página aparte para quien vuelve a Japón (y para anuncios propios).
  '/es/montana': 'm-es', '/en/hiking': 'm-en', '/ar/hiking': 'm-ar', '/ru/hiking': 'm-ru',
  // El día hora a hora de cada ruta.
  '/es/rutas': 'i-es', '/en/routes': 'i-en', '/ar/routes': 'i-ar', '/ru/routes': 'i-ru', '/larion/routes': 'i-larion',
}
const Hiking = lazy(() => import('./pages/Hiking'))
const Guide = lazy(() => import('./pages/Guide'))
const Book = lazy(() => import('./pages/Book'))
const HikingDetail = lazy(() => import('./pages/HikingDetail'))

class AppErrorBoundary extends Component<{ children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false }
  static getDerivedStateFromError() { return { crashed: true } }
  componentDidCatch(err: Error) { console.error('[App] Unhandled crash:', err.message) }
  render() {
    if (this.state.crashed) {
      // Este fallback se pinta por encima del LanguageProvider (si la app se
      // ha caído, el contexto puede no existir), así que traduce a mano.
      const t = (s: string) => translate(detectLang(), s)
      return (
        <div style={{
          minHeight: '100vh', background: '#f5f5f7', // claro como el resto de la web: un fallo no debe parecer otra página
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 20, padding: 24, fontFamily: 'system-ui',
        }}>
          <p style={{ color: '#6e6e73', fontSize: 15, textAlign: 'center' }}>
            {t('Something went wrong loading the page.')}
          </p>
          <button
            onClick={() => { this.setState({ crashed: false }); window.location.hash = '/'; window.location.reload() }}
            style={{ background: '#c0392b', color: '#fff', border: 'none', borderRadius: 999, padding: '12px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            {t('Reload')}
          </button>
          <a href="https://wa.me/819024585949" style={{ color: '#b0301f', fontSize: 13 }}>
            {t('Contact Tony directly on WhatsApp')}
          </a>
        </div>
      )
    }
    return this.props.children
  }
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Layout() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  const ciudad = paginaCiudad(pathname.replace(/\/+$/, ''))
  if (ciudad) {
    return (
      <>
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f5f5f7' }} />}>
        <CiudadPagina key={pathname} pg={ciudad} />
        <CookieBanner compacto />
      </Suspense>
      <Corte rutas={[...Object.keys(RUTAS_V7), ...RUTAS_CIUDAD]} />
      </>
    )
  }

  const v7 = RUTAS_V7[pathname.replace(/\/+$/, '') || '/']
  if (v7) {
    return (
      <>
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f5f5f7' }} />}>
        {v7 === 'portada' ? <Redirige /> : v7.startsWith('m-') ? <Montana key={v7} id={v7 as 'm-es' | 'm-en' | 'm-ar' | 'm-ru'} /> : v7.startsWith('i-') ? <Itinerarios key={v7} id={v7 as 'i-es' | 'i-en' | 'i-ar' | 'i-ru' | 'i-larion'} /> : <PaginaGuia key={v7} id={v7 as 'es' | 'en' | 'ar' | 'ru' | 'larion'} />}
        <CookieBanner compacto />
      </Suspense>
      <Corte rutas={[...Object.keys(RUTAS_V7), ...RUTAS_CIUDAD]} />
      </>
    )
  }

  if (LEGALES.includes(pathname.replace(/\/+$/, ''))) {
    return (
      <MarcoLegal>
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/accessibility" element={<Accessibility />} />
          </Routes>
        </Suspense>
        <CookieBanner compacto />
      </MarcoLegal>
    )
  }

  // La web antigua se quedó con datos viejos (idiomas, equipo, marca): cada
  // página suya lleva ahora a su equivalente nuevo, en el idioma del visitante.
  const antigua = pathname.match(RUTA_ANTIGUA)?.[1]
  if (antigua) {
    return <Redirige destino={DESTINO_ANTIGUA[antigua] ?? 'inicio'} />
  }

  if (!isAdmin && !RUTA_ANTIGUA.test(pathname)) {
    return (
      <MarcoLegal>
        <Suspense fallback={<div className="min-h-screen" />}><Pagina404 /></Suspense>
      </MarcoLegal>
    )
  }

  if (isAdmin) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-japan-dark" />}>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </Suspense>
    )
  }

  return (
    <div className="min-h-screen bg-japan-dark font-sans">
      <Navbar />
      <main>
        {/* Las páginas antiguas se descargan sólo al visitarlas: la página de
            cada idioma (v7) no carga ninguna. */}
        <Suspense fallback={<div className="min-h-screen" />}>
        <Routes>
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:id" element={<TourDetail />} />
          <Route path="/hiking" element={<Hiking />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/book" element={<Book />} />
          <Route path="/hiking/:id" element={<HikingDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/guides/:id" element={<GuideDetail />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </main>
      <Footer />
      <WhatsAppFloat />
      <CookieBanner />
    </div>
  )
}

export default function App() {
  return (
    <AppErrorBoundary>
      <HelmetProvider>
        {/* reducedMotion="user" hace que todos los motion.* del sitio respeten
            la preferencia del sistema. Sin esto, el CSS de arriba no basta:
            Framer anima con JavaScript. */}
        <MotionConfig reducedMotion="user">
        <LanguageProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Layout />
          </BrowserRouter>
        </LanguageProvider>
        </MotionConfig>
      </HelmetProvider>
    </AppErrorBoundary>
  )
}
