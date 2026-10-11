// Microsoft Clarity: mapas de calor (clics, movimiento, scroll) y grabaciones de
// sesión. Gratis y sin tarjeta. Solo se carga cuando el visitante acepta las
// cookies; si las rechaza, no se descarga nada. Los campos de formulario los
// enmascara Clarity por defecto.
// El ID no es secreto: va visible en el código de cualquier web que use Clarity.
export const CLARITY_ID = ''

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
}
