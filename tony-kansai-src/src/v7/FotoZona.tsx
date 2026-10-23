// Foto de la zona de una experiencia, con srcset hasta 4K y su crédito (CC).
import creditosZonas from '../v8/creditosZonas.json'

const CREDITOS = creditosZonas as Record<string, { autor: string; licencia: string; url: string }>
const CON_4K = new Set(Object.keys(CREDITOS).filter((k) => k !== 'kioto-sakura'))

export function FotoZona({ zona, className, sizes }: { zona: string; className?: string; sizes: string }) {
  const c = CREDITOS[zona]
  const base = `/v8/zonas/${zona}`
  const srcSet = `${base}-600.webp 600w, ${base}-900.webp 900w, ${base}.webp 1800w${CON_4K.has(zona) ? `, ${base}-4k.webp 3840w` : ''}`
  return (
    <>
      <img className={className} src={`${base}-900.webp`} srcSet={srcSet} sizes={sizes} alt="" loading="lazy" decoding="async" />
      {c && (
        <a className="vz-credito" href={c.url} target="_blank" rel="noopener noreferrer" dir="ltr">
          © {c.autor} · {c.licencia}
        </a>
      )}
    </>
  )
}
