// Una página de manga en blanco y negro con un toque de rojo (60 % papel,
// 30 % tinta, 10 % rojo): viñetas enteras, nunca recortadas a pantalla
// completa, con bocadillos en HTML (texto nítido y traducible) y un poema.
// Se anima al entrar en pantalla con IntersectionObserver, que funciona en
// Safari y Firefox igual que en Chrome.

import { useEffect, useRef } from 'react'
import './historia.css'

export interface Vineta { src: string; forma: 'ancha' | 'alta'; texto: string }

export function HistoriaManga({ vinetas, quien, sello, capitulo, titulo, poema, etiquetaPoema }: {
  vinetas: Vineta[]
  /** Nombre del guía que habla, en la etiqueta roja del bocadillo. */
  quien: string
  /** Kanji del sello rojo (la ciudad, o 旅 en «un día»). */
  sello: string
  capitulo: string
  titulo: string
  poema: string
  etiquetaPoema: string
}) {
  const raiz = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = raiz.current
    if (!el) return
    const partes = el.querySelectorAll<HTMLElement>('.hm-cabeza, .hm-vineta, .hm-poema')
    // Sin IntersectionObserver (muy raro) se enseña todo de golpe.
    if (!('IntersectionObserver' in window)) { partes.forEach((p) => p.classList.add('hm-visto')); return }
    const io = new IntersectionObserver((entradas) => {
      for (const e of entradas) if (e.isIntersecting) { e.target.classList.add('hm-visto'); io.unobserve(e.target) }
    }, { threshold: 0.25 })
    partes.forEach((p) => io.observe(p))
    return () => io.disconnect()
  }, [vinetas])

  return (
    <section ref={raiz} className="hm" aria-label={titulo}>
      <header className="hm-cabeza">
        <span className="hm-sello" lang="ja" aria-hidden="true">{sello}</span>
        <p className="hm-capitulo">{capitulo}</p>
        <h2>{titulo}</h2>
      </header>
      <div className="hm-hoja">
        {vinetas.map((v, i) => (
          <figure key={v.src} className={`hm-vineta hm-${v.forma} hm-pos-${i % 3}`}>
            <img loading="lazy" src={v.src} alt="" decoding="async" />
            <figcaption className="hm-bocadillo">
              <span className="hm-quien">{quien}</span>
              {v.texto}
            </figcaption>
          </figure>
        ))}
      </div>
      <blockquote className="hm-poema" aria-label={etiquetaPoema}>
        {poema.split('\n').map((verso, i) => <p key={i} style={{ ['--i' as string]: i }}>{verso}</p>)}
      </blockquote>
    </section>
  )
}
