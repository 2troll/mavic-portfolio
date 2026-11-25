// Pago por adelantado de Tony: Wise, Revolut y PayPay (25-11-2026: «quita PayPal»).
// Siempre después del WhatsApp: primero se confirma la fecha, luego se paga.
// Si falta el enlace de un medio (REVOLUT_TONY / PAYPAY_TONY vacíos en contenido.ts),
// el botón abre WhatsApp pidiendo los datos de ese medio: nunca un enlace inventado.
import { WISE_TONY, REVOLUT_TONY, PAYPAY_TONY, WA_TONY } from './contenido'

const TXT: Record<string, { antes: string; pedir: (m: string) => string }> = {
  es: { antes: 'o paga por adelantado con', pedir: (m) => `Hola, Tony. Quiero pagar el tour por ${m}.` },
  en: { antes: 'or pay in advance with', pedir: (m) => `Hi Tony, I'd like to pay for the tour with ${m}.` },
  ar: { antes: 'أو ادفع مسبقاً عبر', pedir: (m) => `مرحباً توني، أريد دفع ثمن الجولة عبر ${m}.` },
}

const MEDIOS = [
  { nombre: 'Wise', url: WISE_TONY },
  { nombre: 'Revolut', url: REVOLUT_TONY },
  { nombre: 'PayPay', url: PAYPAY_TONY },
]

export function PagosAdelantado({ lang, pagina, valor, className = 'v7-plan-pagar-enlace' }: { lang: string; pagina?: string; valor?: number; className?: string }) {
  const t = TXT[lang] ?? TXT.en
  return (
    <span className={`${className} v7-pagos`}>
      {t.antes}{' '}
      {MEDIOS.map((m, i) => (
        <span key={m.nombre}>
          {i > 0 && ' · '}
          <a href={m.url || `https://wa.me/${WA_TONY}?text=${encodeURIComponent(t.pedir(m.nombre))}`} target="_blank" rel="noopener noreferrer"
            onClick={() => window.gtag?.('event', 'begin_checkout', { pagina, valor, canal: m.nombre.toLowerCase() })}>{m.nombre}</a>
        </span>
      ))}
    </span>
  )
}
