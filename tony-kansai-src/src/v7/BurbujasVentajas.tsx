// Burbujas de cristal (estilo «liquid glass» de Apple) que flotan a un lado de la
// pantalla mientras el cliente navega, una por app con descuento o enlace mío.
// Al tocarla, la burbuja estalla en gotas y se abre una hoja de cristal con el
// código, el botón de copiar y el enlace. Solo CSS para el movimiento (sin
// framer-motion, para no cargar más las páginas); con «reducir movimiento» del
// sistema quedan quietas y sin estallido. La X las esconde durante la visita.
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { APPS, cuponDe, enlaceDe, type App } from './datosVentajas'
import { ICONOS_APP } from './logosMarcas'

type Idioma = 'es' | 'en' | 'ar' | 'ru'

const RUTA: Record<Idioma, string> = { es: '/es/ventajas/', en: '/en/perks/', ar: '/ar/perks/', ru: '/ru/perks/' }
const CLAVE_OCULTAS = 'burbujas-ocultas'

const TEXTO: Record<Idioma, { titulo: string; copiar: string; copiado: string; ir: string; todas: string; cerrar: string; ocultar: string; conmigo: string }> = {
  es: { titulo: 'Descuento para tu viaje', copiar: 'Copiar código', copiado: '¡Copiado!', ir: 'Ir a la web', todas: 'Ver todas las ventajas', cerrar: 'Cerrar', ocultar: 'Ocultar burbujas', conmigo: 'Entra con mi enlace' },
  en: { titulo: 'A discount for your trip', copiar: 'Copy code', copiado: 'Copied!', ir: 'Go to website', todas: 'See all perks', cerrar: 'Close', ocultar: 'Hide bubbles', conmigo: 'Use my link' },
  ar: { titulo: 'خصم لرحلتك', copiar: 'انسخ الرمز', copiado: 'تم النسخ!', ir: 'افتح الموقع', todas: 'كل المزايا', cerrar: 'إغلاق', ocultar: 'إخفاء الفقاعات', conmigo: 'ادخل عبر رابطي' },
  ru: { titulo: 'Скидка для вашей поездки', copiar: 'Скопировать код', copiado: 'Скопировано!', ir: 'Открыть сайт', todas: 'Все предложения', cerrar: 'Закрыть', ocultar: 'Скрыть пузыри', conmigo: 'По моей ссылке' },
}

// Primero las que tienen código; después dos enlaces míos muy útiles.
const EXTRA = ['nomad', 'klook']
function elegidas(): App[] {
  const conCodigo = APPS.filter((a) => cuponDe(a))
  const resto = EXTRA.map((k) => APPS.find((a) => a.clave === k)).filter((a): a is App => !!a && !cuponDe(a))
  return [...conCodigo, ...resto].slice(0, 5)
}

function Icono({ a }: { a: App }) {
  if (ICONOS_APP.has(a.clave)) return <img src={`/v7/apps/${a.clave}.webp`} alt="" width="64" height="64" loading="lazy" decoding="async" />
  const palabra = a.marca.palabra ?? a.nombre.charAt(0)
  return <b style={{ background: a.marca.fondo, color: a.marca.tinta }}>{palabra.length <= 2 ? palabra : palabra.charAt(0)}</b>
}

const sello = (a: App) => (a.descuento ? (a.descuento.startsWith('−') ? a.descuento : `−${a.descuento}`) : '')

export function BurbujasVentajas({ lang }: { lang: Idioma }) {
  const t = TEXTO[lang]
  const [ver, setVer] = useState(false)
  const [oculto, setOculto] = useState(() => { try { return sessionStorage.getItem(CLAVE_OCULTAS) === '1' } catch { return false } })
  const [estalla, setEstalla] = useState<string | null>(null)
  const [abierta, setAbierta] = useState<App | null>(null)
  const [copiado, setCopiado] = useState(false)
  const hoja = useRef<HTMLDivElement>(null)
  const lista = elegidas()

  // Salen cuando el cliente ya ha bajado un poco: no tapan la portada al entrar.
  useEffect(() => {
    const mira = () => setVer(window.scrollY > window.innerHeight * 0.35)
    mira()
    window.addEventListener('scroll', mira, { passive: true })
    return () => window.removeEventListener('scroll', mira)
  }, [])

  useEffect(() => {
    if (!abierta) return
    hoja.current?.focus()
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierta(null) }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [abierta])

  if (oculto || lista.length === 0) return null

  const quieto = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  const toca = (a: App) => {
    if (estalla) return
    setCopiado(false)
    if (quieto) { setAbierta(a); return }
    setEstalla(a.clave)
    // La hoja se abre cuando la burbuja ya ha reventado.
    setTimeout(() => { setAbierta(a); setEstalla(null) }, 380)
  }
  const ocultar = () => { setOculto(true); try { sessionStorage.setItem(CLAVE_OCULTAS, '1') } catch { /* sin almacenamiento: solo esta vista */ } }
  const copiar = async (codigo: string) => {
    try { await navigator.clipboard.writeText(codigo); setCopiado(true); setTimeout(() => setCopiado(false), 1800) } catch { /* el código sigue a la vista para copiarlo a mano */ }
  }

  const cupon = abierta ? cuponDe(abierta) : undefined
  const flecha = lang === 'ar' ? '←' : '→'

  return (
    <>
      <div className={`v7-burbujas${ver && !abierta ? ' v7-burbujas-ver' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {lista.map((a, n) => (
          <button key={a.clave} type="button" className={`v7-burbuja${estalla === a.clave ? ' v7-burbuja-estalla' : ''}`}
            style={{ ['--n' as string]: n }} onClick={() => toca(a)} aria-label={`${a.nombre}${sello(a) ? ` ${sello(a)}` : ''}`}>
            <span className="v7-burbuja-cristal"><Icono a={a} /></span>
            {sello(a) && <span className="v7-burbuja-sello" dir="ltr">{sello(a)}</span>}
            {/* Gotas del estallido. */}
            <span className="v7-burbuja-gotas" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i} style={{ ['--g' as string]: i }} />)}</span>
          </button>
        ))}
        <button type="button" className="v7-burbujas-x" onClick={ocultar} aria-label={t.ocultar} title={t.ocultar}>×</button>
      </div>

      {abierta && (
        <div className="v7-hoja-fondo" onClick={() => setAbierta(null)}>
          <div ref={hoja} className="v7-hoja" role="dialog" aria-modal="true" aria-label={abierta.nombre} tabIndex={-1}
            dir={lang === 'ar' ? 'rtl' : 'ltr'} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="v7-hoja-x" onClick={() => setAbierta(null)} aria-label={t.cerrar}>×</button>
            <div className="v7-hoja-cab">
              <span className="v7-hoja-ico"><Icono a={abierta} /></span>
              <div>
                <small>{cupon ? t.titulo : t.conmigo}</small>
                <strong dir="ltr">{abierta.nombre} {sello(abierta) && <em>{sello(abierta)}</em>}</strong>
              </div>
            </div>
            <p>{(abierta.t[lang] ?? abierta.t.en).ventaja}</p>
            {cupon && (
              <div className="v7-hoja-codigo">
                <code dir="ltr">{cupon}</code>
                <button type="button" onClick={() => copiar(cupon)}>{copiado ? t.copiado : t.copiar}</button>
              </div>
            )}
            <a className="v7-hoja-ir" href={enlaceDe(abierta)} target="_blank" rel="noopener noreferrer sponsored">{t.ir} <span aria-hidden="true">{flecha}</span></a>
            <Link className="v7-hoja-todas" to={`${RUTA[lang]}#codigos`} onClick={() => setAbierta(null)}>{t.todas}</Link>
          </div>
        </div>
      )}
    </>
  )
}
