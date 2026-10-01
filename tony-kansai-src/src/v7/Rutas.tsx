// Sección «Las rutas»: pestañas con cada destino del guía; a un lado el
// modelo 3D (Visor3D) sobre la foto del sitio, al otro qué se ve, cuánto se
// tarda desde Osaka y las opciones con su precio. Cada opción abre WhatsApp
// con la ruta ya escrita.

import { useState } from 'react'
import { Visor3D } from './Visor3D'
import { META, MODELOS, PRECIO, RUTAS_LARION, RUTAS_TONY, ETIQUETAS, TEXTOS } from './datosRutas'
import type { RutaId } from './datosRutas'
import type { Pagina } from './contenido'
import { GUIAS } from './contenido'
import { foto } from './foto'

const KANJI_RUTA: Record<RutaId, string> = { kioto: '京都', osaka: '大阪', nara: '奈良', himeji: '姫路', kobe: '神戸', miyajima: '宮島', hiroshima: '広島' }

const FOTO: Record<RutaId, string> = {
  kioto: '/v7/fotos/kioto.jpg', osaka: '/v7/fotos/osaka.jpg', nara: '/v7/fotos/nara.jpg', himeji: '/v7/fotos/himeji.jpg',
  kobe: '/v7/fotos/kobe.jpg', miyajima: '/v7/fotos/miyajima.jpg', hiroshima: '/v7/fotos/hiroshima.jpg',
}

export function Rutas({ p }: { p: Pagina }) {
  const ids = p.guia === 'larion' ? RUTAS_LARION : RUTAS_TONY
  const [sel, setSel] = useState<RutaId>(ids[0])
  const et = ETIQUETAS[p.lang]
  const r = TEXTOS[p.lang][sel]
  const meta = META[sel]
  const modelo = MODELOS[meta.modelo]
  const sep = p.lang === 'es' ? '.' : p.lang === 'ru' ? ' ' : ','
  const yen = (n: number) => '¥' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep)
  const pedir = (opcion: string) => {
    const texto = p.contacto.plantilla({ nombre: '', pais: '', ciudad: '', fechas: '', personas: '', hotel: '', intereses: [`${r.titulo} — ${opcion}`], notas: '' })
    return `https://wa.me/${GUIAS[p.guia].wa}?text=${encodeURIComponent(texto)}`
  }

  return (
    <section id="rutas" className="v7-seccion v7-rutas">
      <h2>{et.titulo}</h2>
      <p className="v7-entradilla">{et.sub}</p>

      <div className="v7-rutas-pestanas" role="tablist" aria-label={et.titulo}>
        {ids.map((id) => (
          <button key={id} type="button" role="tab" aria-selected={id === sel} aria-controls="v7-ruta-panel" onClick={() => setSel(id)}>
            <img src={foto(FOTO[id]).src.replace('.webp', '-900.webp')} alt="" width={34} height={34} loading="lazy" />
            <span>{TEXTOS[p.lang][id].titulo}</span>
          </button>
        ))}
      </div>

      <div id="v7-ruta-panel" className="v7-ruta" role="tabpanel">
        <div className="v7-ruta-escena">
          <img key={sel} className="v7-ruta-fondo" {...foto(FOTO[sel], '(max-width: 820px) 100vw, 55vw')} alt="" width={1800} height={1200} />
          <Visor3D modelo={meta.modelo} variante={meta.variante} etiqueta={`${et.modelo}: ${r.titulo}`} />
          <p className="v7-ruta-gira" aria-hidden="true">{et.gira}</p>
          <a className="v7-ruta-credito" href={modelo.url} target="_blank" rel="noopener noreferrer" lang="en" dir="ltr">
            {et.modelo}: {modelo.titulo} · {modelo.autor} · {modelo.licencia}
          </a>
        </div>
        <div className="v7-ruta-info" key={sel}>
          <p className="v7-ruta-desde"><span>{et.desde}</span> {r.desde}</p>
          <h3><span className="v7-kanji" lang="ja">{KANJI_RUTA[sel]}</span>{r.titulo}</h3>
          <p className="v7-ruta-texto">{r.texto}</p>
          <ul className="v7-ruta-opciones">
            {r.opciones.map((o, i) => {
              const tramo = meta.tramos[i] ?? 'completo'
              return (
                <li key={o.nombre} className="tarjeta">
                  <div className="v7-ruta-opcion-cabeza">
                    <strong>{o.nombre}</strong>
                    <span className="v7-ruta-precio">{tramo === 'lejos' ? `${et.desdePrecio} ` : ''}<bdi>{yen(PRECIO[tramo])}</bdi></span>
                  </div>
                  <p>{o.texto}</p>
                  <a className="v7-ruta-pedir" href={pedir(o.nombre)} target="_blank" rel="noopener noreferrer"
                    onClick={() => window.gtag?.('event', 'generate_lead', { pagina: p.id, ruta: sel, canal: 'whatsapp_ruta' })}>{et.pedir} {p.dir === 'rtl' ? '←' : '→'}</a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
