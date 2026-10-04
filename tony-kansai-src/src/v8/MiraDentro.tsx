// «Mira dentro»: la foto más reconocible de cada ciudad en 3D real (foto +
// profundidad), a casi toda la pantalla. Sustituye a las maquetas de modelos
// de juguete. Pestañas para cambiar de ciudad; avanza sola hasta que alguien
// toca. Enlaza a la página de la ciudad.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CIUDADES, CIUDADES_LARION, CIUDADES_TONY } from './ciudades'
import type { Lengua } from './ciudades'
import { PORTADA } from './Mosaico'
import { Foto3D } from './Foto3D'
import './v8.css'

const TITULO: Record<Lengua, string> = { es: 'Mira dentro', en: 'Step inside', ar: 'ادخل إلى المشهد', ru: 'Загляните внутрь' }
const PISTA: Record<Lengua, string> = { es: 'Mueve el ratón o el dedo: la foto tiene relieve.', en: 'Move your mouse or finger: the photo has depth.', ar: 'حرّك الفأرة أو إصبعك: للصورة عمق.', ru: 'Подвигайте мышью или пальцем: у фото есть глубина.' }
const VER: Record<Lengua, string> = { es: 'Ver la ciudad', en: 'See the city', ar: 'اكتشف المدينة', ru: 'Подробнее о городе' }

export function MiraDentro({ lang, guia, prefijo }: { lang: Lengua; guia: 'tony' | 'larion'; prefijo: string }) {
  const lista = guia === 'larion' ? CIUDADES_LARION : CIUDADES_TONY
  const [i, setI] = useState(0)
  const [quieto, setQuieto] = useState(false)
  useEffect(() => {
    if (quieto) return
    const t = window.setInterval(() => setI((x) => (x + 1) % lista.length), 7000)
    return () => window.clearInterval(t)
  }, [quieto, lista.length])
  const id = lista[i]
  const c = CIUDADES[id]
  const zona = c.zonas.find((z) => z.id === PORTADA[id]) ?? c.zonas[0]
  return (
    <section id="rutas" className="v9-dentro" aria-label={TITULO[lang]}>
      <Foto3D key={id} className="v9-dentro-foto" foto={`/v8/zonas/${PORTADA[id]}.webp`} prof={`/v8/prof/${PORTADA[id]}.webp`} alt={`${zona.nombre[lang]}, ${c.nombre[lang]}`} />
      <div className="v9-dentro-texto">
        <h2>{TITULO[lang]}</h2>
        <p className="v9-dentro-pista">{PISTA[lang]}</p>
        <div className="v9-dentro-lugar" aria-live="polite">
          <span lang="ja" className="v9-dentro-kanji" aria-hidden="true">{zona.kanji}</span>
          <h3>{zona.nombre[lang]}</h3>
          <p>{zona.linea[lang]}</p>
          <Link className="v9-enlace v9-enlace-claro" to={`${prefijo}/${id}/`}>{VER[lang]}: {c.nombre[lang]}</Link>
        </div>
        <div className="v9-dentro-pestanas" role="tablist" aria-label={TITULO[lang]}>
          {lista.map((x, k) => (
            <button key={x} role="tab" aria-selected={k === i} onClick={() => { setI(k); setQuieto(true) }}>{CIUDADES[x].nombre[lang]}</button>
          ))}
        </div>
      </div>
    </section>
  )
}
