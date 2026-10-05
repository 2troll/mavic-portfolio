// Barra fija de WhatsApp en el móvil para las páginas de ciudad y de montaña:
// aparece en cuanto se deja atrás la primera pantalla, para que reservar
// esté siempre a un toque. La portada de cada guía tiene la suya (BarraMovil).
import { useEffect, useState } from 'react'
import { IconoWa } from './IconoWa'

const TEXTO = { es: 'Reservar por WhatsApp', en: 'Book on WhatsApp', ar: 'احجز عبر واتساب', ru: 'Забронировать в WhatsApp' }

/** `ocultaEn`: selector de una sección con botones propios de reservar (las
 *  fichas de montaña); mientras ocupa la pantalla, la barra se aparta. */
export function BarraWa({ href, lang, pagina, ocultaEn }: { href: string; lang: keyof typeof TEXTO; pagina: string; ocultaEn?: string }) {
  const [ver, setVer] = useState(false)
  useEffect(() => {
    let raf = 0
    const mide = () => {
      raf = 0
      const fin = document.documentElement.scrollHeight - innerHeight - scrollY < 240
      const r = ocultaEn ? document.querySelector(ocultaEn)?.getBoundingClientRect() : undefined
      const dentro = !!r && r.top < innerHeight * 0.5 && r.bottom > innerHeight * 0.5
      setVer(scrollY > innerHeight * 0.6 && !fin && !dentro)
    }
    const al = () => { if (!raf) raf = requestAnimationFrame(mide) }
    mide()
    addEventListener('scroll', al, { passive: true })
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', al) }
  }, [ocultaEn])
  return (
    <div className={`v7-barra-movil cristal ${ver ? 'ver' : ''}`} aria-hidden={!ver}>
      <a className="v7-boton" href={href} target="_blank" rel="noopener noreferrer" tabIndex={ver ? 0 : -1}
        onClick={() => window.gtag?.('event', 'generate_lead', { pagina, canal: 'whatsapp_barra' })}>
        <IconoWa /> {TEXTO[lang]}
      </a>
    </div>
  )
}
