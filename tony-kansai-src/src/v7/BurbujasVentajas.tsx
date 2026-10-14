// Burbujas de cristal (estilo «liquid glass» de Apple) que suben flotando por toda
// la pantalla mientras el cliente navega, como pompas de jabón. Cada una es una app
// distinta con código o enlace mío, en orden aleatorio y sin repetir hasta que han
// salido todas. Si nadie la toca, revienta sola arriba y sale la siguiente; al
// tocarla, estalla en gotas y se abre una hoja de cristal con el código, el botón
// de copiar y el enlace. Movimiento solo con CSS (sin framer-motion, para no cargar
// más las páginas); con «reducir movimiento» del sistema no salen. La X las esconde
// durante la visita.
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { APPS, cuponDe, enlaceDe, esAfiliado, type App } from './datosVentajas'
import { ICONOS_APP } from './logosMarcas'

type Idioma = 'es' | 'en' | 'ar' | 'ru'

const RUTA: Record<Idioma, string> = { es: '/es/ventajas/', en: '/en/perks/', ar: '/ar/perks/', ru: '/ru/perks/' }
const CLAVE_OCULTAS = 'burbujas-ocultas'
/** A la vez como mucho, y cada cuánto nace una nueva (ms). */
const MAX_VIVAS = 2
const CADA = 4200

const TEXTO: Record<Idioma, { titulo: string; copiar: string; copiado: string; ir: string; todas: string; cerrar: string; ocultar: string; conmigo: string }> = {
  es: { titulo: 'Descuento para tu viaje', copiar: 'Copiar código', copiado: '¡Copiado!', ir: 'Ir a la web', todas: 'Ver todas las ventajas', cerrar: 'Cerrar', ocultar: 'Ocultar burbujas', conmigo: 'Entra con mi enlace' },
  en: { titulo: 'A discount for your trip', copiar: 'Copy code', copiado: 'Copied!', ir: 'Go to website', todas: 'See all perks', cerrar: 'Close', ocultar: 'Hide bubbles', conmigo: 'Use my link' },
  ar: { titulo: 'خصم لرحلتك', copiar: 'انسخ الرمز', copiado: 'تم النسخ!', ir: 'افتح الموقع', todas: 'كل المزايا', cerrar: 'إغلاق', ocultar: 'إخفاء الفقاعات', conmigo: 'ادخل عبر رابطي' },
  ru: { titulo: 'Скидка для вашей поездки', copiar: 'Скопировать код', copiado: 'Скопировано!', ir: 'Открыть сайт', todas: 'Все предложения', cerrar: 'Закрыть', ocultar: 'Скрыть пузыри', conmigo: 'По моей ссылке' },
}

/** Las apps que pueden salir: con código o con enlace por el que me pagan. */
const CANDIDATAS = APPS.filter((a) => cuponDe(a) || esAfiliado(a))

/** Baraja nueva cada vuelta; las de código, siempre al principio de la primera. */
function baraja(primera: boolean): App[] {
  const mezcla = (l: App[]) => l.map((a) => [Math.random(), a] as const).sort((x, y) => x[0] - y[0]).map(([, a]) => a)
  if (!primera) return mezcla(CANDIDATAS)
  return [...mezcla(CANDIDATAS.filter((a) => cuponDe(a))), ...mezcla(CANDIDATAS.filter((a) => !cuponDe(a)))]
}

interface Burbuja { id: number; a: App; x: number; t: number; dur: number; vaiven: number; revienta: boolean }

function Icono({ a }: { a: App }) {
  if (ICONOS_APP.has(a.clave)) return <img src={`/v7/apps/${a.clave}.webp`} alt="" width="64" height="64" loading="lazy" decoding="async" />
  const palabra = a.marca.palabra ?? a.nombre.charAt(0)
  return <b style={{ background: a.marca.fondo, color: a.marca.tinta }}>{palabra.length <= 2 ? palabra : palabra.charAt(0)}</b>
}

const sello = (a: App) => (a.descuento ? (a.descuento.startsWith('−') ? a.descuento : `−${a.descuento}`) : '')

export function BurbujasVentajas({ lang }: { lang: Idioma }) {
  const t = TEXTO[lang]
  const [activo, setActivo] = useState(false)
  const [oculto, setOculto] = useState(() => { try { return sessionStorage.getItem(CLAVE_OCULTAS) === '1' } catch { return false } })
  const [vivas, setVivas] = useState<Burbuja[]>([])
  const [abierta, setAbierta] = useState<App | null>(null)
  const [copiado, setCopiado] = useState(false)
  const hoja = useRef<HTMLDivElement>(null)
  const cola = useRef<App[]>(baraja(true))
  const contador = useRef(0)
  const quieto = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

  // Empiezan cuando el cliente ya ha bajado un poco: no tapan la portada al entrar.
  useEffect(() => {
    const mira = () => { if (window.scrollY > window.innerHeight * 0.35) setActivo(true) }
    mira()
    window.addEventListener('scroll', mira, { passive: true })
    return () => window.removeEventListener('scroll', mira)
  }, [])

  const nace = useCallback(() => {
    setVivas((v) => {
      if (v.length >= MAX_VIVAS) return v
      if (cola.current.length === 0) cola.current = baraja(false)
      // Que no salga la misma que ya está subiendo.
      let a = cola.current.shift()!
      if (v.some((b) => b.a.clave === a.clave) && cola.current.length) { cola.current.push(a); a = cola.current.shift()! }
      // Solo por los bordes de la pantalla: por el centro tapaban las reseñas y
      // el texto, y costaba pulsar lo que había debajo. Si ya sube una por un
      // lado, la nueva sale por el otro, para que no se pisen.
      const otra = v[0]?.x
      const izquierda = otra === undefined ? Math.random() < 0.5 : otra > 50
      const x = izquierda ? 1 + Math.random() * 3 : 90 + Math.random() * 3
      return [...v, { id: ++contador.current, a, x, t: 50 + Math.round(Math.random() * 20), dur: 13 + Math.random() * 6, vaiven: 2.6 + Math.random() * 1.8, revienta: false }]
    })
  }, [])

  useEffect(() => {
    if (!activo || oculto || quieto || abierta || CANDIDATAS.length === 0) return
    const primera = setTimeout(nace, 600)
    const reloj = setInterval(() => { if (!document.hidden) nace() }, CADA)
    return () => { clearTimeout(primera); clearInterval(reloj) }
  }, [activo, oculto, quieto, abierta, nace])

  useEffect(() => {
    if (!abierta) return
    hoja.current?.focus()
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierta(null) }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [abierta])

  if (oculto || quieto || CANDIDATAS.length === 0) return null

  const revienta = (id: number) => {
    setVivas((v) => v.map((b) => (b.id === id ? { ...b, revienta: true } : b)))
    setTimeout(() => setVivas((v) => v.filter((b) => b.id !== id)), 460)
  }
  const toca = (b: Burbuja) => {
    if (b.revienta) return
    setCopiado(false)
    revienta(b.id)
    // La hoja se abre cuando la burbuja ya ha reventado.
    setTimeout(() => setAbierta(b.a), 380)
  }
  const ocultar = () => { setOculto(true); try { sessionStorage.setItem(CLAVE_OCULTAS, '1') } catch { /* sin almacenamiento: solo esta vista */ } }
  const copiar = async (codigo: string) => {
    try { await navigator.clipboard.writeText(codigo); setCopiado(true); setTimeout(() => setCopiado(false), 1800) } catch { /* el código sigue a la vista para copiarlo a mano */ }
  }

  const cupon = abierta ? cuponDe(abierta) : undefined
  const flecha = lang === 'ar' ? '←' : '→'

  return (
    <>
      <div className="v7-burbujas" aria-label={t.titulo} role="region">
        {vivas.map((b) => (
          // Capa que sube (y revienta sola al llegar arriba) → capa que se mece → la pompa.
          <div key={b.id} className={`v7-burbuja-sube${b.revienta ? ' v7-burbuja-estalla' : ''}`}
            style={{ left: `min(${b.x}%, calc(100% - ${b.t + 24}px))`, ['--t' as string]: `${b.t}px`, ['--dur' as string]: `${b.dur}s`, ['--vaiven' as string]: `${b.vaiven}s` }}
            onAnimationEnd={(e) => { if (e.animationName === 'v7-sube') revienta(b.id) }}>
            <button type="button" className="v7-burbuja" onClick={() => toca(b)} aria-label={`${b.a.nombre}${sello(b.a) ? ` ${sello(b.a)}` : ''}`}>
              <span className="v7-burbuja-cristal"><Icono a={b.a} /></span>
              {sello(b.a) && <span className="v7-burbuja-sello" dir="ltr">{sello(b.a)}</span>}
              <span className="v7-burbuja-gotas" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i} style={{ ['--g' as string]: i }} />)}</span>
            </button>
          </div>
        ))}
      </div>
      {activo && !abierta && <button type="button" className="v7-burbujas-x" onClick={ocultar} aria-label={t.ocultar} title={t.ocultar}>×</button>}

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
