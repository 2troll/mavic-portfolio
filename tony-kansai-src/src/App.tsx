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
const GuideDetail = lazy(() => import('./pages/GuideDetail'))
// El panel interno pesa lo que pesa (contratos en PDF incluidos) y sólo lo
// usa Tony: se descarga sólo cuando se entra en /admin.
const Admin = lazy(() => import('./pages/Admin'))
// Web v7: portada con globo y una página por idioma. Van fuera del Navbar y
// del Footer antiguos; three.js sólo se descarga al entrar en ellas.
import Redirige from './v7/Redirige'
const PaginaGuia = lazy(() => import('./v7/PaginaGuia'))
import { Corte } from './v7/Corte'
const RUTAS_V7: Record<string, 'portada' | 'es' | 'en' | 'ar' | 'ru' | 'larion'> = {
  '/': 'portada', '/es': 'es', '/en': 'en', '/ar': 'ar', '/ru': 'ru', '/larion': 'larion',
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
          minHeight: '100vh', background: '#0C0D16',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 20, padding: 24, fontFamily: 'system-ui',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, textAlign: 'center' }}>
            {t('Something went wrong loading the page.')}
          </p>
          <button
            onClick={() => { this.setState({ crashed: false }); window.location.hash = '/'; window.location.reload() }}
            style={{ background: '#E53030', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            {t('Reload')}
          </button>
          <a href="https://wa.me/819024585949" style={{ color: '#E53030', fontSize: 13 }}>
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

  const v7 = RUTAS_V7[pathname.replace(/\/+$/, '') || '/']
  if (v7) {
    return (
      <>
      <Suspense fallback={<div style={{ minHeight: '100vh', background: v7 === 'portada' ? '#05070d' : '#f5f5f7' }} />}>
        {v7 === 'portada' ? <Redirige /> : <PaginaGuia key={v7} id={v7} />}
        <CookieBanner compacto />
      </Suspense>
      <Corte rutas={Object.keys(RUTAS_V7)} />
      </>
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
