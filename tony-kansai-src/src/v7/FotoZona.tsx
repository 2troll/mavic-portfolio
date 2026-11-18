// Foto de la zona de una experiencia, con srcset hasta 4K y su crédito (CC).
import creditosZonas from '../v8/creditosZonas.json'
import { CIUDADES, type Lengua } from '../v8/ciudades'

const CREDITOS = creditosZonas as Record<string, { autor: string; licencia: string; url: string }>
const CON_4K = new Set(Object.keys(CREDITOS).filter((k) => k !== 'kioto-sakura'))

/** «Gion, Kioto»: Bing marca las fotos sin alt y no sabe de qué son. Si la zona
 *  no está en CIUDADES, alt vacío (decorativa) en vez de inventar un nombre. */
export function nombreZona(zona: string, lang: Lengua): string {
  for (const c of Object.values(CIUDADES)) {
    const z = c.zonas.find((x) => x.id === zona)
    if (!z) continue
    // «Kumano Kodo, Más lejos» o «Miyajima, Hiroshima y Miyajima» no dicen nada: solo la zona.
    return c.id === 'beyond' || c.nombre[lang].includes(z.nombre[lang]) ? z.nombre[lang] : `${z.nombre[lang]}, ${c.nombre[lang]}`
  }
  return ''
}

export function FotoZona({ zona, lang, className, sizes }: { zona: string; lang: Lengua; className?: string; sizes: string }) {
  const c = CREDITOS[zona]
  const base = `/v8/zonas/${zona}`
  const srcSet = `${base}-600.webp 600w, ${base}-900.webp 900w, ${base}.webp 1800w${CON_4K.has(zona) ? `, ${base}-4k.webp 3840w` : ''}`
  return (
    <>
      <img className={className} src={`${base}-900.webp`} srcSet={srcSet} sizes={sizes} alt={nombreZona(zona, lang)} loading="lazy" decoding="async" />
      {c && (
        <a className="vz-credito" href={c.url} target="_blank" rel="noopener noreferrer" dir="ltr">
          © {c.autor} · {c.licencia}
        </a>
      )}
    </>
  )
}

/** Foto propia de un socio (FOTO_SOCIO), con el mismo marco y crédito que las de zona. */
export function FotoSocio({ foto, ancho, credito, web, alt, className, sizes }: { foto: string; ancho: number; credito: string; web: string; alt: string; className?: string; sizes: string }) {
  const base = `/v7/socios/${foto}`
  return (
    <>
      <img className={className} src={`${base}-900.webp`} srcSet={`${base}-600.webp 600w, ${base}-900.webp 900w, ${base}.webp ${ancho}w`} sizes={sizes} alt={alt} loading="lazy" decoding="async" />
      <a className="vz-credito" href={web} target="_blank" rel="noopener noreferrer" dir="ltr">© {credito}</a>
    </>
  )
}
