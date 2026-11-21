// La mayoría de clientes son hispanohablantes, y muchos entran por una página en
// inglés que les manda Google o ChatGPT y cambian a mano al español (Clarity,
// 30 días hasta el 21-11-2026). Tony: «quiero que la página siempre se abra en
// español».
//
// - Navegador en español → se pasa sola a la versión española de la MISMA página
//   (la que la propia página declara en <link rel="alternate" hreflang="es">).
//   Una sola vez por visita, y nunca si la persona eligió otro idioma a mano.
// - Navegador en árabe → una línea para cambiar, sin moverla.
//
// Google, Bing y los robots de las IAs leen la web con el navegador en inglés (o
// sin JavaScript), así que siguen viendo cada versión igual que antes: esto no
// toca títulos, canonical ni hreflang.
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const AUTO_HECHO = 'v7-auto-es-hecho'        // sessionStorage: ya se cambió una vez en esta visita
export const ELEGIDO = 'v7-idioma-elegido'    // localStorage: idioma que la persona eligió a mano
const CERRADO = 'v7-sin-sugerencia-idioma'    // sessionStorage: cerró la línea de sugerencia

const TEXTO: Record<string, { pregunta: string; ir: string; cerrar: string }> = {
  ar: { pregunta: 'هل تفضّل القراءة بالعربية؟', ir: 'اقرأ بالعربية', cerrar: 'إغلاق' },
}

type Clarity = (...a: string[]) => void
const clarity = () => (window as unknown as { clarity?: Clarity }).clarity

const lee = (s: Storage | undefined, k: string) => { try { return s?.getItem(k) ?? null } catch { return null } }
const guarda = (s: Storage | undefined, k: string, v: string) => { try { s?.setItem(k, v) } catch { /* bloqueado */ } }

/** Idioma principal del navegador («es», «en», «ar»…). */
export function idiomaPrincipal(): string {
  try { return (navigator.languages?.[0] ?? navigator.language ?? '').split('-')[0].toLowerCase() } catch { return '' }
}

/** Ruta de la versión en `lang` que declara la página, si la hay. Mientras
 *  Helmet no ha escrito los hreflang de ESTA página, en el <head> siguen los de
 *  la portada (index.html): solo se fían los enlaces si uno apunta a la propia
 *  página (el hreflang de sí misma). */
function alternativa(lang: string): string | null {
  const ruta = (href: string) => {
    try {
      const u = new URL(href, location.origin)
      // Las páginas declaran la dirección completa (https://tonykansaiguide.com/…):
      // vale esa o la del propio servidor (vista previa local).
      return u.origin === location.origin || u.hostname.endsWith('tonykansaiguide.com') ? u.pathname : null
    } catch { return null }
  }
  const sinBarra = (p: string) => p.replace(/\/+$/, '')
  const enlaces = [...document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]')]
    .map((l) => ({ lang: l.hreflang.toLowerCase().split('-')[0], ruta: ruta(l.href) }))
  if (!enlaces.some((e) => e.ruta && sinBarra(e.ruta) === sinBarra(location.pathname))) return null
  return enlaces.find((e) => e.lang === lang)?.ruta ?? null
}

export function SugerenciaIdioma() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [sugerida, setSugerida] = useState<{ lang: string; href: string } | null>(null)

  // Quien toca un idioma en el selector lo ha elegido: se respeta siempre.
  useEffect(() => {
    const alClic = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('.v7-idiomas a[lang], a[hreflang]') as HTMLAnchorElement | null
      const lang = (a?.getAttribute('lang') || a?.getAttribute('hreflang') || '').split('-')[0].toLowerCase()
      if (lang) guarda(window.localStorage, ELEGIDO, lang)
    }
    document.addEventListener('click', alClic, { capture: true })
    return () => document.removeEventListener('click', alClic, { capture: true })
  }, [])

  useEffect(() => {
    setSugerida(null)
    // En la raíz decide PortadaRaiz (Redirige.tsx): aquí no se toca.
    if (pathname.startsWith('/admin') || pathname === '/') return
    const principal = idiomaPrincipal()
    // El idioma de la página se saca de la dirección (/en/…, /es/…); si no lleva
    // prefijo, del <html lang>. La versión española la declara la página en su
    // <head>, que Helmet escribe después de pintar (y las páginas se cargan por
    // partes): se mira cada vez que cambia el <head>, durante 4 s como mucho.
    const prefijo = pathname.split('/')[1] || ''
    const actualDe = () => (/^(es|en|ar|ru|tr|fr|ja|ko|zh)$/.test(prefijo) ? prefijo : (document.documentElement.lang || '').split('-')[0].toLowerCase())
    const mira = () => {
      const actual = actualDe()
      if (!principal || actual === principal) return true
      const elegido = lee(window.localStorage, ELEGIDO)
      if (principal === 'es') {
        if (elegido && elegido !== 'es') return true
        if (lee(window.sessionStorage, AUTO_HECHO)) return true
        const destino = alternativa('es')
        if (!destino) return false
        if (destino === pathname) return true
        guarda(window.sessionStorage, AUTO_HECHO, '1')
        clarity()?.('event', 'idioma_auto_es')
        navigate(destino + location.hash, { replace: true })
        return true
      }
      if (principal in TEXTO && !lee(window.sessionStorage, CERRADO) && !(elegido && elegido !== principal)) {
        const href = alternativa(principal)
        if (href && href !== pathname) { setSugerida({ lang: principal, href }); return true }
      }
      return false
    }
    if (mira()) return
    const obs = new MutationObserver(() => { if (mira()) fin() })
    const t = window.setTimeout(() => fin(), 4000)
    const fin = () => { obs.disconnect(); window.clearTimeout(t) }
    obs.observe(document.head, { childList: true, subtree: true, attributes: true })
    return fin
  }, [pathname, navigate])

  if (!sugerida) return null
  const t = TEXTO[sugerida.lang]
  const cerrar = () => { guarda(window.sessionStorage, CERRADO, '1'); setSugerida(null) }
  return (
    <div className="v7-sugerencia-idioma cristal" lang={sugerida.lang} dir={sugerida.lang === 'ar' ? 'rtl' : 'ltr'} role="note">
      <span>{t.pregunta}</span>
      <Link to={sugerida.href} onClick={() => { guarda(window.localStorage, ELEGIDO, sugerida.lang); clarity()?.('event', 'cambia_idioma_sugerido') }}>{t.ir}</Link>
      <button type="button" onClick={cerrar} aria-label={t.cerrar}>×</button>
    </div>
  )
}
