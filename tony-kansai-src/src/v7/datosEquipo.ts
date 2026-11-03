// Equipo de guías: la franja «Nuestros guías» del final de cada página.
// Los datos viven en scripts/equipo.json, que también lee scripts/equipo-estatico.mjs
// para las secciones estáticas: un solo sitio que tocar si cambia un guía.

import datos from '../../scripts/equipo.json'
import { TG_LARION, WA_TONY } from './contenido'

export type IdiomaEquipo = 'es' | 'en' | 'ar' | 'ru' | 'tr' | 'fr'
export type GuiaEquipoId = 'tony' | 'larion' | 'ferhat' | 'iheb' | 'antonio' | 'mario'

export interface VersionGuia { ruta: string; nombre: string; linea: string; boton: string; oculto: string; alt?: string; desc: string }
export interface GuiaEquipo {
  id: GuiaEquipoId
  ld: string
  idiomas: string[]
  zona: string
  foto?: string
  emblema?: string
  contacto: { wa?: string; tg?: string }
  versiones: Partial<Record<IdiomaEquipo, VersionGuia>>
  extra?: { ruta: string; lang: string; texto: string }
}

export const UI_EQUIPO = datos.ui as Record<'titulo' | 'sub' | 'aqui' | 'equipo', Record<IdiomaEquipo, string>>
export const NOMBRE_IDIOMA = datos.idiomas as Record<string, string>
export const EQUIPO = datos.guias as GuiaEquipo[]

// El JSON no puede importar constantes: si cambia el Telegram de Larion o el
// WhatsApp de Tony en contenido.ts y no aquí, que el build lo diga.
const larion = EQUIPO.find((g) => g.id === 'larion')
const tony = EQUIPO.find((g) => g.id === 'tony')
if (larion?.contacto.tg !== TG_LARION) throw new Error(`equipo.json: el Telegram de Larion no es ${TG_LARION}`)
if (tony?.contacto.wa !== WA_TONY) throw new Error(`equipo.json: el WhatsApp de Tony no es ${WA_TONY}`)

/** Versión del guía que se enseña en una página de idioma `lang`: la del mismo
 *  idioma si el guía la tiene (Tony en /en/ sale en inglés) y, si no, la suya propia. */
export function versionGuia(g: GuiaEquipo, lang: string): { lang: IdiomaEquipo; v: VersionGuia } {
  const propia = (Object.keys(g.versiones) as IdiomaEquipo[])[0]
  const l = (lang in g.versiones ? lang : propia) as IdiomaEquipo
  return { lang: l, v: g.versiones[l] as VersionGuia }
}
