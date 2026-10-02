// Mosaico de ciudades de la portada: la puerta visual a cada página de ciudad.
import { Link } from 'react-router-dom'
import { foto } from '../v7/foto'
import { CIUDADES, CIUDADES_LARION, CIUDADES_TONY } from './ciudades'
import type { Lengua } from './ciudades'
import './v8.css'

const TITULO: Record<Lengua, string> = { es: 'Elige ciudad', en: 'Pick a city', ar: 'اختر مدينة', ru: 'Выберите город' }

export function Mosaico({ lang, guia, prefijo }: { lang: Lengua; guia: 'tony' | 'larion'; prefijo: string }) {
  const lista = guia === 'larion' ? CIUDADES_LARION : CIUDADES_TONY
  return (
    <section id="ciudades" className="v7-seccion v8-otras v8-mosaico">
      <h2>{TITULO[lang]}</h2>
      <div className="v8-otras-rejilla">
        {lista.map((id) => {
          const c = CIUDADES[id]
          return (
            <Link key={id} to={`${prefijo}/${id}/`} className="v8-otra">
              <img {...foto(`/v8/zonas/${c.zonas[0].id}.jpg`, '(max-width: 700px) 100vw, 50vw')} alt="" loading="lazy" />
              <span><span lang="ja">{c.kanji}</span>{c.nombre[lang]}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
