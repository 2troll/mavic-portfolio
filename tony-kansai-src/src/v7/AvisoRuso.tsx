// Quien llega con el navegador en ruso a una página en otro idioma (por un
// enlace directo, Google o una elección antigua) ve un aviso pequeño que le
// lleva a la página de Larion. Solo en el cliente: no toca la hidratación.
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { idiomaSugerido } from './Redirige'

const CERRADO = 'tkg-aviso-ru'

/** La página rusa equivalente a la que se está viendo. */
function destinoRuso(path: string): string {
  if (/\/(rutas|routes)\/?$/.test(path)) return '/ru/routes/'
  if (/\/(montana|hiking)\/?$/.test(path)) return '/ru/hiking/'
  return '/ru/'
}

export default function AvisoRuso() {
  const { pathname } = useLocation()
  const [ver, setVer] = useState(false)

  useEffect(() => {
    let cerrado = false
    try { cerrado = localStorage.getItem(CERRADO) === '1' } catch { /* bloqueado */ }
    const yaEnRuso = /^\/(ru|larion)(\/|$)/.test(pathname) || pathname.startsWith('/admin')
    setVer(!cerrado && !yaEnRuso && idiomaSugerido() === 'ru')
  }, [pathname])

  if (!ver) return null
  const cerrar = () => {
    try { localStorage.setItem(CERRADO, '1') } catch { /* bloqueado */ }
    setVer(false)
  }
  return (
    <div lang="ru" dir="ltr" role="region" aria-label="Русская версия" style={{
      position: 'fixed', zIndex: 60, top: 78, left: 16, right: 16, margin: '0 auto', width: 'fit-content',
      display: 'flex', alignItems: 'center', gap: 4,
      background: '#1d1d1f', color: '#fff', padding: '6px 6px 6px 16px',
      borderRadius: 0, boxShadow: '4px 4px 0 rgba(0,0,0,.25)', fontSize: 14, lineHeight: 1.3,
    }}>
      <a href={destinoRuso(pathname)} style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>
        Есть версия на русском — гид Ларион →
      </a>
      <button type="button" onClick={cerrar} aria-label="Закрыть" style={{
        background: 'transparent', border: 0, color: '#fff', opacity: .7,
        fontSize: 18, lineHeight: 1, padding: '4px 8px', cursor: 'pointer',
      }}>×</button>
    </div>
  )
}
