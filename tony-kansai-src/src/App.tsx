import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Component, useEffect, useState, lazy, Suspense } from 'react'
import { trasCarga } from './lib/trasCarga'
import type { ReactNode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { LanguageProvider, detectLang } from './contexts/LanguageContext'
import { translate } from './lib/dict'
// Perezoso: es lo único del arranque que usaba framer-motion (38 KB).
const CookieBanner = lazy(() => import('./components/CookieBanner').then((m) => ({ default: m.CookieBanner })))
/** El aviso de cookies (y framer-motion con él) se pide cuando la página ya ha cargado. */
function CookieTardio({ compacto }: { compacto?: boolean }) {
  const [ya, setYa] = useState(false)
  useEffect(() => trasCarga(() => setYa(true)), [])
  return ya ? <Suspense fallback={null}><CookieBanner compacto={compacto} /></Suspense> : null
}
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const Cookies = lazy(() => import('./pages/Cookies'))
const Safety = lazy(() => import('./pages/Safety'))
const Legal = lazy(() => import('./pages/Legal'))
const Accessibility = lazy(() => import('./pages/Accessibility'))
const Pagina404 = lazy(() => import('./v7/Pagina404'))
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
const Otono = lazy(() => import('./v7/Otono'))
const Viajeros = lazy(() => import('./v7/Viajeros'))
import { RUTAS_VIAJEROS } from './v7/datosViajeros'
import { RUTAS_OTONO } from './v7/datosOtono'
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
          <a href="https://wa.me/34634193106" style={{ color: '#b0301f', fontSize: 13 }}>
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

export function Layout() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  const ciudad = paginaCiudad(pathname.replace(/\/+$/, ''))
  if (ciudad) {
    return (
      <>
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f5f5f7' }} />}>
        <CiudadPagina key={pathname} pg={ciudad} />
        <CookieTardio compacto />
      </Suspense>
      <Corte rutas={[...Object.keys(RUTAS_V7), ...RUTAS_CIUDAD]} />
      </>
    )
  }

  // Páginas por país de origen (México, Reino Unido).
  const mercado = RUTAS_VIAJEROS[pathname.replace(/\/+$/, '')]
  if (mercado) {
    return (
      <>
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f5f5f7' }} />}>
        <Viajeros key={mercado} id={mercado} />
        <CookieTardio compacto />
      </Suspense>
      <Corte rutas={[...Object.keys(RUTAS_V7), ...RUTAS_CIUDAD, ...Object.keys(RUTAS_OTONO)]} />
      </>
    )
  }

  // Temporada: el otoño de Kioto.
  const otono = RUTAS_OTONO[pathname.replace(/\/+$/, '')]
  if (otono) {
    return (
      <>
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f5f5f7' }} />}>
        <Otono key={otono} id={otono} />
        <CookieTardio compacto />
      </Suspense>
      <Corte rutas={[...Object.keys(RUTAS_V7), ...RUTAS_CIUDAD, ...Object.keys(RUTAS_OTONO)]} />
      </>
    )
  }

  const v7 = RUTAS_V7[pathname.replace(/\/+$/, '') || '/']
  if (v7) {
    return (
      <>
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f5f5f7' }} />}>
        {v7 === 'portada' ? <Redirige /> : v7.startsWith('m-') ? <Montana key={v7} id={v7 as 'm-es' | 'm-en' | 'm-ar' | 'm-ru'} /> : v7.startsWith('i-') ? <Itinerarios key={v7} id={v7 as 'i-es' | 'i-en' | 'i-ar' | 'i-ru' | 'i-larion'} /> : <PaginaGuia key={v7} id={v7 as 'es' | 'en' | 'ar' | 'ru' | 'larion'} />}
        <CookieTardio compacto />
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
        <CookieTardio compacto />
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

  // La web antigua ya no se sirve: sus rutas redirigen (más arriba) y lo
  // demás es la 404 v7. Aquí sólo se llega por /admin, ya atendido.
  return null
}

export default function App() {
  return (
    <AppErrorBoundary>
      <HelmetProvider>
        <LanguageProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Layout />
          </BrowserRouter>
        </LanguageProvider>
      </HelmetProvider>
    </AppErrorBoundary>
  )
}
