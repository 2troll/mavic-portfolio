// Libro de sellos (御朱印帳): en los templos de Japón cada visita se lleva un
// sello rojo en una libreta plegada en acordeón. Aquí, cada ciudad que el
// visitante recorre le estampa el suyo (al pasar de media página, no al
// entrar) y la libreta del pie se despliega en 3D con los conseguidos.
// Los dibujos son de Nano Banana sin texto; el kanji va en HTML, con la
// fuente de la web, para que nunca salga japonés inventado.
// Se guarda solo en este navegador (localStorage): es un detalle, no un dato.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CIUDADES, CIUDADES_LARION, CIUDADES_TONY } from '../v8/ciudades'
import type { CiudadId, Lengua } from '../v8/ciudades'
import { movimientoReducido } from '../v7/petalos'
import './sellos.css'

const CLAVE = 'tkg-sellos'
const EVENTO = 'tkg-sello'

function leer(): CiudadId[] {
  try { const v = JSON.parse(localStorage.getItem(CLAVE) || '[]'); return Array.isArray(v) ? v : [] } catch { return [] }
}
function guardar(lista: CiudadId[]) {
  try { localStorage.setItem(CLAVE, JSON.stringify(lista)) } catch { /* modo privado: el sello se ve igual, solo no se recuerda */ }
  window.dispatchEvent(new Event(EVENTO))
}

const TXT: Record<Lengua, {
  libro: string; sub: string; conseguido: (c: string, n: number, t: number) => string
  falta: string; completo: string; abrir: string; cerrar: string; ver: string
}> = {
  es: {
    libro: 'Tu libro de sellos', sub: 'En Japón, cada templo te sella la libreta. Aquí, cada ciudad que recorres.',
    conseguido: (c, n, t) => `Sello de ${c} · ${n} de ${t}`, falta: 'Por visitar', completo: 'Libro completo. Ya solo falta verlo en persona.',
    abrir: 'Abrir el libro', cerrar: 'Cerrar el libro', ver: 'Ir a',
  },
  en: {
    libro: 'Your stamp book', sub: 'In Japan every temple stamps your book. Here, every city you explore does.',
    conseguido: (c, n, t) => `${c} stamp · ${n} of ${t}`, falta: 'Not yet visited', completo: 'Book complete. Now see it in person.',
    abrir: 'Open the book', cerrar: 'Close the book', ver: 'Go to',
  },
  ar: {
    libro: 'دفتر أختامك', sub: 'في اليابان يختم كل معبد دفترك. وهنا تختمه كل مدينة تستكشفها.',
    conseguido: (c, n, t) => `ختم ${c} · ${n} من ${t}`, falta: 'لم تُزر بعد', completo: 'اكتمل الدفتر. بقي أن تراها بنفسك.',
    abrir: 'افتح الدفتر', cerrar: 'أغلق الدفتر', ver: 'اذهب إلى',
  },
  ru: {
    libro: 'Ваша книга печатей', sub: 'В Японии каждый храм ставит печать в вашу книжку. Здесь — каждый город, который вы посмотрели.',
    conseguido: (c, n, t) => `Печать: ${c} · ${n} из ${t}`, falta: 'Ещё не открыт', completo: 'Книга собрана. Осталось увидеть всё вживую.',
    abrir: 'Открыть книгу', cerrar: 'Закрыть книгу', ver: 'Перейти:',
  },
}

const lista = (guia: 'tony' | 'larion') => (guia === 'larion' ? CIUDADES_LARION : CIUDADES_TONY)

/** En la página de una ciudad: estampa su sello cuando el visitante ha
 *  bajado más de media página (ha mirado de verdad, no solo entrado). */
export function SelloCiudad({ id, lang, guia }: { id: CiudadId; lang: Lengua; guia: 'tony' | 'larion' }) {
  const [estampa, setEstampa] = useState<{ n: number; t: number } | null>(null)
  useEffect(() => {
    if (leer().includes(id)) return
    let hecho = false, raf = 0
    const mira = () => {
      raf = 0
      const recorrido = document.documentElement.scrollHeight - innerHeight
      if (hecho || recorrido <= 0 || scrollY / recorrido < 0.45) return
      hecho = true
      const nueva = [...new Set([...leer(), id])]
      guardar(nueva)
      const mias = lista(guia)
      setEstampa({ n: mias.filter((c) => nueva.includes(c)).length, t: mias.length })
      window.gtag?.('event', 'sello', { ciudad: id })
    }
    const al = () => { if (!raf) raf = requestAnimationFrame(mira) }
    addEventListener('scroll', al, { passive: true })
    return () => { removeEventListener('scroll', al); cancelAnimationFrame(raf) }
  }, [id, guia])

  useEffect(() => {
    if (!estampa) return
    const t = setTimeout(() => setEstampa(null), movimientoReducido() ? 3500 : 4200)
    return () => clearTimeout(t)
  }, [estampa])

  if (!estampa) return null
  const c = CIUDADES[id]
  return (
    <div className="sl-estampa" role="status" onClick={() => setEstampa(null)}>
      <div className="sl-estampa-sello">
        <img src={`/v9/sellos/${id}.webp`} alt="" width={160} height={160} />
        <span className="sl-kanji" lang="ja" aria-hidden="true">{c.kanji}</span>
      </div>
      <p>{TXT[lang].conseguido(c.nombre[lang], estampa.n, estampa.t)}</p>
    </div>
  )
}

/** La libreta: cerrada, una tapa; abierta, las páginas se despliegan en acordeón. */
export function LibroSellos({ lang, guia, prefijo }: { lang: Lengua; guia: 'tony' | 'larion'; prefijo: string }) {
  const [tengo, setTengo] = useState<CiudadId[]>([])
  const [abierto, setAbierto] = useState(false)
  useEffect(() => {
    const lee = () => setTengo(leer())
    lee()
    addEventListener(EVENTO, lee); addEventListener('storage', lee)
    return () => { removeEventListener(EVENTO, lee); removeEventListener('storage', lee) }
  }, [])
  const mias = lista(guia)
  const n = mias.filter((c) => tengo.includes(c)).length
  const t = TXT[lang]
  return (
    <section className="v7-seccion sl-libro" aria-label={t.libro}>
      <div className="sl-cabeza">
        <h2>{t.libro} <span className="sl-cuenta"><bdi>{n} / {mias.length}</bdi></span></h2>
        <p className="v7-entradilla">{n === mias.length ? t.completo : t.sub}</p>
        <button type="button" className="v7-boton v7-boton-peq" aria-expanded={abierto} onClick={() => setAbierto((a) => !a)}>
          {abierto ? t.cerrar : t.abrir}
        </button>
      </div>
      <ol className={`sl-acordeon ${abierto ? 'abierto' : ''}`} style={{ ['--n' as string]: mias.length }}>
        {mias.map((id, i) => {
          const c = CIUDADES[id]
          const lo = tengo.includes(id)
          return (
            <li key={id} className={`sl-pagina ${lo ? 'sellada' : ''}`} style={{ ['--i' as string]: i }}>
              <Link to={`${prefijo}/${id}/`} tabIndex={abierto ? 0 : -1} aria-label={`${t.ver} ${c.nombre[lang]}${lo ? '' : ` (${t.falta})`}`}>
                {lo
                  ? <span className="sl-sello"><img loading="lazy" src={`/v9/sellos/${id}.webp`} alt="" decoding="async" /><span className="sl-kanji" lang="ja" aria-hidden="true">{c.kanji}</span></span>
                  : <span className="sl-hueco" aria-hidden="true"><span lang="ja">{c.kanji}</span></span>}
                <span className="sl-nombre">{c.nombre[lang]}</span>
              </Link>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
