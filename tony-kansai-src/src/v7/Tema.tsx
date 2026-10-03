// Botón de tema: claro ⇄ oscuro. Sin elección, la web sigue al sistema; al
// pulsar se fija en <html data-tema> y se recuerda en este navegador.
import { useEffect, useState } from 'react'

type Tema = 'claro' | 'oscuro'
const ETIQUETA: Record<string, [string, string]> = {
  es: ['Cambiar a modo oscuro', 'Cambiar a modo claro'], en: ['Switch to dark mode', 'Switch to light mode'],
  ar: ['التبديل إلى الوضع الداكن', 'التبديل إلى الوضع الفاتح'], ru: ['Тёмная тема', 'Светлая тема'],
}

function actual(): Tema {
  const fijado = document.documentElement.getAttribute('data-tema')
  if (fijado === 'claro' || fijado === 'oscuro') return fijado
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'
}

export function BotonTema({ lang }: { lang: string }) {
  const [tema, setTema] = useState<Tema>('claro')
  useEffect(() => {
    setTema(actual())
    // Si cambia el del sistema y nadie fijó uno, se sigue.
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    const sigue = () => setTema(actual())
    mq?.addEventListener('change', sigue)
    return () => mq?.removeEventListener('change', sigue)
  }, [])
  const cambia = () => {
    const nuevo: Tema = tema === 'oscuro' ? 'claro' : 'oscuro'
    document.documentElement.setAttribute('data-tema', nuevo)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', nuevo === 'oscuro' ? '#0d0d0d' : '#ffffff')
    try { localStorage.setItem('tema', nuevo) } catch { /* bloqueado */ }
    setTema(nuevo)
  }
  const [aOscuro, aClaro] = ETIQUETA[lang] ?? ETIQUETA.en
  return (
    <button type="button" className="v7-tema" onClick={cambia} aria-label={tema === 'oscuro' ? aClaro : aOscuro} title={tema === 'oscuro' ? aClaro : aOscuro}>
      {tema === 'oscuro'
        ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" /></svg>
        : <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1Z" /></svg>}
    </button>
  )
}
