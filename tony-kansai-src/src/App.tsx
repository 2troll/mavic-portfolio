import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Component, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import Home from './pages/Home'
import Tours from './pages/Tours'
import TourDetail from './pages/TourDetail'
import About from './pages/About'
import Pricing from './pages/Pricing'
import FAQ from './pages/FAQ'

// Top-level safety net: if anything crashes past a component-level boundary,
// show a minimal functional page instead of a blank black screen.
class AppErrorBoundary extends Component<{ children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false }
  static getDerivedStateFromError() { return { crashed: true } }
  componentDidCatch(err: Error) { console.error('[App] Unhandled crash:', err.message) }
  render() {
    if (this.state.crashed) {
      return (
        <div style={{
          minHeight: '100vh', background: '#0C0D16',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 20, padding: 24, fontFamily: 'system-ui',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, textAlign: 'center' }}>
            Something went wrong loading the page.
          </p>
          <button
            onClick={() => { this.setState({ crashed: false }); window.location.hash = '/'; window.location.reload() }}
            style={{ background: '#E53030', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Reload
          </button>
          <a href="https://wa.me/34634193106" style={{ color: '#E53030', fontSize: 13 }}>
            Contact Tony directly on WhatsApp
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
  return (
    <div className="min-h-screen bg-japan-dark font-sans">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:id" element={<TourDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AppErrorBoundary>
      <HashRouter>
        <ScrollToTop />
        <Layout />
      </HashRouter>
    </AppErrorBoundary>
  )
}
