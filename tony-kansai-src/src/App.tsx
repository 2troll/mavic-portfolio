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
import Home from './pages/Home'
import Tours from './pages/Tours'
import TourDetail from './pages/TourDetail'
import About from './pages/About'
import Pricing from './pages/Pricing'
import FAQ from './pages/FAQ'
import Booking from './pages/Booking'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Cookies from './pages/Cookies'
import Safety from './pages/Safety'
import Legal from './pages/Legal'
import Accessibility from './pages/Accessibility'
import NotFound from './pages/NotFound'
import GuideDetail from './pages/GuideDetail'
// El panel interno pesa lo que pesa (contratos en PDF incluidos) y sólo lo
// usa Tony: se descarga sólo cuando se entra en /admin.
const Admin = lazy(() => import('./pages/Admin'))
import Hiking from './pages/Hiking'
import Guide from './pages/Guide'
import HikingDetail from './pages/HikingDetail'

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
          <a href="https://wa.me/34634193106" style={{ color: '#E53030', fontSize: 13 }}>
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:id" element={<TourDetail />} />
          <Route path="/hiking" element={<Hiking />} />
          <Route path="/guide" element={<Guide />} />
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
