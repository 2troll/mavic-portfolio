// Tres experiencias de la portada troncal de Tony (/es/, /en/, /ar/), según el
// encargo de Antonio (21-11-2026): tarjetas muy genéricas, sin precio, que abren
// la conversación («pregúntanos tú»). Cada tarjeta entera enlaza a una página
// que ya existe; debajo, dos «otras puertas» para no cerrar nada y UN solo
// botón de WhatsApp (antes había 22 en la portada).
// Las clases (.v7-exp-lista, .v7-exp, .v7-exp-otras) son las del § 18 de
// estilo-sereno.css: en el móvil la lista es un carrusel con un trozo de la siguiente.

import type { Pagina } from './contenido'
import { GUIAS, enlaceGuia } from './contenido'
import { foto } from './foto'
import { IconoCanal } from './IconoWa'

export function Experiencias({ p, msg }: { p: Pagina; msg: string }) {
  const e = p.experiencias
  if (!e) return null
  const flecha = p.dir === 'rtl' ? '←' : '→'
  return (
    <section id="experiencias" className="v7-seccion">
      <h2>{e.titulo}</h2>
      <p className="v7-entradilla">{e.sub}</p>
      <ul className="v7-exp-lista">
        {e.lista.map((x) => (
          <li key={x.ruta} data-aparece="">
            {/* Siempre <a> y no <Link>: algunas de estas páginas (y las «otras
                puertas»: /familias/, /ar/tokyo/…) son HTML estático fuera del
                router, y un <Link> daría la 404 de la SPA. */}
            <a className="v7-exp" href={x.ruta}>
              {/* Fotos de /v8/zonas/ (solo WebP a 600, 900 y 1800 px). En el
                  móvil la tarjeta mide ~82 % del ancho. */}
              <img {...foto(x.foto, '(max-width: 720px) 82vw, 33vw')} alt={x.alt} width={600} height={450} loading="lazy" decoding="async" />
              <h3>{x.titulo}</h3>
              <p>{x.texto}</p>
            </a>
          </li>
        ))}
      </ul>
      {e.otras.map((o) => (
        <p key={o.ruta} className="v7-exp-otras"><a href={o.ruta}>{o.texto} {flecha}</a></p>
      ))}
      <p className="v7-exp-cta" data-aparece="">
        <a className={`v7-boton${GUIAS[p.guia].tg ? ' v7-tg' : ''}`} href={enlaceGuia(p.guia, msg)} target="_blank" rel="noopener noreferrer">
          <IconoCanal tg={!!GUIAS[p.guia].tg} /> {e.preguntar}
        </a>
      </p>
    </section>
  )
}
