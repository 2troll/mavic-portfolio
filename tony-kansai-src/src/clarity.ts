// Microsoft Clarity: mapas de calor (clics, movimiento, scroll) y grabaciones de
// sesión. Gratis y sin tarjeta. Solo se carga cuando el visitante acepta las
// cookies; si las rechaza, no se descarga nada. Los campos de formulario los
// enmascara Clarity por defecto.
// El ID no es secreto: va visible en el código de cualquier web que use Clarity.
export const CLARITY_ID = 'yw7l1mlvxu'

let cargado = false

export function cargarClarity() {
  if (cargado || !CLARITY_ID) return
  cargado = true
  const w = window as unknown as { clarity?: { (...a: unknown[]): void; q?: unknown[] } }
  w.clarity = w.clarity || function (...a: unknown[]) { (w.clarity!.q = w.clarity!.q || []).push(a) }
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.clarity.ms/tag/${CLARITY_ID}`
  document.head.appendChild(s)
  // Consentimiento explícito (Consent API de Clarity): ya ha pulsado «Aceptar».
  w.clarity('consent')
  etiquetar(w.clarity)
}

// Etiquetas para filtrar en Clarity: de qué zona horaria e idioma viene cada
// visita y a qué sección entró. Nada que identifique a la persona.
function etiquetar(clarity: (...a: unknown[]) => void) {
  try {
    clarity('set', 'zona_horaria', Intl.DateTimeFormat().resolvedOptions().timeZone)
  } catch { /* navegador viejo */ }
  clarity('set', 'idioma_navegador', navigator.language || '?')
  clarity('set', 'seccion', location.pathname.split('/')[1] || 'raiz')
  clarity('set', 'hora_visitante', String(new Date().getHours()))

  // Lo que de verdad importa: quién llega a escribir. Cada contacto se marca
  // como evento y su grabación se guarda siempre («upgrade»), aunque Clarity
  // esté recortando grabaciones por volumen.
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
    if (!a) return
    const href = a.href
    const tipo = href.includes('wa.me/') ? (href.includes('818085067586') ? 'whatsapp_larion' : 'whatsapp_tony')
      : href.startsWith('mailto:') ? 'correo'
      : href.startsWith('tel:') ? 'telefono'
      : /reserv|book|precios|prices|#precios/.test(href) ? 'mira_precios_o_reserva'
      : null
    if (!tipo) return
    clarity('event', tipo)
    if (tipo !== 'mira_precios_o_reserva') {
      clarity('set', 'contacto', tipo)
      clarity('upgrade', tipo)
    }
  }, { capture: true, passive: true })
}
