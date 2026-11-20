// Quien llega desde ChatGPT a una página en inglés con el móvil en español o en
// árabe ve una línea para pasar a su idioma (Clarity, 30 días hasta el 21-11-2026:
// gente de España y México entraba en /en/kyoto/ y casi nadie cambiaba).
// No redirige: Google tiene que poder ver cada versión por separado.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type Opcion = { lang: string; href: string }

const TEXTO: Record<string, { pregunta: string; ir: string; cerrar: string }> = {
  es: { pregunta: '¿Prefieres leerlo en español?', ir: 'Ver en español', cerrar: 'Cerrar' },
  ar: { pregunta: 'هل تفضّل القراءة بالعربية؟', ir: 'اقرأ بالعربية', cerrar: 'إغلاق' },
}
const CLAVE = 'v7-sin-sugerencia-idioma'

export function SugerenciaIdioma({ actual, opciones }: { actual: string; opciones: Opcion[] }) {
  const [destino, setDestino] = useState<Opcion | null>(null)
  // Las páginas pasan un array nuevo en cada render: el efecto depende de su
  // contenido, no de la referencia (si no, se repetiría sin fin).
  const clave = opciones.map((o) => `${o.lang}${o.href}`).join('|')

  useEffect(() => {
    try { if (sessionStorage.getItem(CLAVE)) return } catch { /* bloqueado */ }
    // Solo el idioma principal del navegador: a quien tiene el español de
    // segunda opción no hay que molestarle en una página en inglés.
    const principal = (navigator.languages?.[0] ?? navigator.language ?? '').split('-')[0].toLowerCase()
    if (!principal || principal === actual || !(principal in TEXTO)) { setDestino(null); return }
    setDestino(opciones.find((o) => o.lang === principal) ?? null)
  }, [actual, clave]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!destino) return null
  const t = TEXTO[destino.lang]
  const cerrar = () => {
    try { sessionStorage.setItem(CLAVE, '1') } catch { /* bloqueado */ }
    setDestino(null)
  }
  return (
    <div className="v7-sugerencia-idioma cristal" lang={destino.lang} dir={destino.lang === 'ar' ? 'rtl' : 'ltr'} role="note">
      <span>{t.pregunta}</span>
      <Link to={destino.href} onClick={() => (window as unknown as { clarity?: (...a: string[]) => void }).clarity?.('event', 'cambia_idioma_sugerido')}>{t.ir}</Link>
      <button type="button" onClick={cerrar} aria-label={t.cerrar}>×</button>
    </div>
  )
}
