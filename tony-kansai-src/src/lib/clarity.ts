// Microsoft Clarity: mapas de calor (clics, movimiento, scroll) y grabaciones de
// sesión. Gratis y sin tarjeta. Se carga en TODAS las visitas al arrancar la
// app; lo que cambia con el banner es el consentimiento (Consent API v2):
// - «denied» (por defecto): Clarity graba sin cookies, que es lo que Microsoft
//   permite para visitantes de la UE sin consentimiento.
// - «granted»: solo si el visitante ha pulsado «Aceptar».
// Los campos de formulario los enmascara Clarity por defecto.
// El ID no es secreto: va visible en el código de cualquier web que use Clarity.
export const CLARITY_ID = 'yw7l1mlvxu'
export const CONSENT_KEY = 'tony-cookie-consent'

type Clarity = { (...a: unknown[]): void; q?: unknown[] }
type Estado = 'granted' | 'denied'

let cargado = false

const hayNavegador = () => typeof window !== 'undefined' && typeof document !== 'undefined'

function clarity(): Clarity | undefined {
  return hayNavegador() ? (window as unknown as { clarity?: Clarity }).clarity : undefined
}

// localStorage puede lanzar (Safari privado, cookies bloqueadas, iframe).
function leeConsentimiento(): string | null {
  try {
    return window.localStorage.getItem(CONSENT_KEY)
  } catch {
    return null
  }
}

function enviaConsentimiento(estado: Estado) {
  clarity()?.('consentv2', { ad_Storage: estado, analytics_Storage: estado })
}

/** Se llama una vez al arrancar la app, sin esperar al banner. */
export function cargarClarity() {
  if (cargado || !CLARITY_ID || !hayNavegador()) return
  cargado = true
  const w = window as unknown as { clarity?: Clarity }
  // Cola provisional: lo que se llame antes de que llegue el script se guarda
  // en `q` y Clarity lo procesa al cargar.
  w.clarity = w.clarity || function (...a: unknown[]) { (w.clarity!.q = w.clarity!.q || []).push(a) }
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.clarity.ms/tag/${CLARITY_ID}`
  document.head.appendChild(s)
  enviaConsentimiento(leeConsentimiento() === 'accepted' ? 'granted' : 'denied')
  etiquetar(w.clarity)
}

/** Lo llama el banner de cookies al aceptar (true) o rechazar (false). */
export function ponerConsentimiento(aceptado: boolean) {
  enviaConsentimiento(aceptado ? 'granted' : 'denied')
}

// Qué contacto es cada clic, o null si no interesa.
function tipoDeClic(el: Element): string | null {
  if (el instanceof HTMLButtonElement) {
    const texto = el.textContent || ''
    if (/paypal/i.test(texto)) return 'paypal'
    // El botón del formulario de contacto envía por WhatsApp. Su texto cambia
    // con el idioma, así que se reconoce por ser el «submit» del formulario.
    if (el.closest('form.v7-formulario') && (el.type === 'submit' || /whatsapp|واتساب/i.test(texto))) {
      return 'whatsapp_formulario'
    }
    return null
  }
  const href = (el as HTMLAnchorElement).href || ''
  if (href.includes('paypal.me/')) return 'paypal'
  if (href.includes('wa.me/')) return href.includes('818085067586') ? 'whatsapp_larion' : 'whatsapp_tony'
  if (href.startsWith('mailto:')) return 'correo'
  if (href.startsWith('tel:')) return 'telefono'
  // Después de WhatsApp: un enlace a wa.me cuyo texto nombre PayPal sigue siendo WhatsApp.
  if (/paypal/i.test(el.textContent || '')) return 'paypal'
  if (/reserv|book|precios|prices|#precios/.test(href)) return 'mira_precios_o_reserva'
  return null
}

// Etiquetas para filtrar en Clarity: de qué zona horaria e idioma viene cada
// visita y a qué sección entró. Nada que identifique a la persona.
function etiquetar(c: Clarity) {
  try {
    c('set', 'zona_horaria', Intl.DateTimeFormat().resolvedOptions().timeZone)
  } catch { /* navegador viejo */ }
  c('set', 'idioma_navegador', navigator.language || '?')
  c('set', 'seccion', location.pathname.split('/')[1] || 'raiz')
  c('set', 'hora_visitante', String(new Date().getHours()))

  // Lo que de verdad importa: quién llega a escribir o a pagar. Cada contacto
  // se marca como evento y su grabación se guarda siempre («upgrade»), aunque
  // Clarity esté recortando grabaciones por volumen.
  document.addEventListener('click', (e) => {
    const el = (e.target as Element | null)?.closest?.('a[href], button')
    if (!el) return
    const tipo = tipoDeClic(el)
    if (!tipo) return
    const cl = clarity()
    if (!cl) return
    cl('event', tipo)
    if (tipo !== 'mira_precios_o_reserva') {
      cl('set', 'contacto', tipo)
      cl('upgrade', tipo)
    }
  }, { capture: true, passive: true })
}
