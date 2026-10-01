// Las fotos van en WebP a dos anchos (900 y 1800 px): el móvil baja la
// pequeña. El JPG original se queda para Open Graph, que no siempre lee WebP.
export function foto(jpg: string, sizes = '100vw') {
  const base = jpg.replace(/\.jpg$/, '')
  return { src: `${base}.webp`, srcSet: `${base}-900.webp 900w, ${base}.webp 1800w`, sizes }
}
