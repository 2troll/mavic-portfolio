// Las fotos van en WebP a dos anchos (900 y 1800 px): el móvil baja la
// pequeña. El JPG original se queda para Open Graph, que no siempre lee WebP.
export function foto(jpg: string, sizes = '100vw') {
  const base = jpg.replace(/\.jpg$/, '')
  // srcSet y sizes ANTES que src: React 18 pone los atributos en este orden y,
  // con src primero, el navegador ya ha empezado a bajar la de 1800 px.
  return { srcSet: `${base}-900.webp 900w, ${base}.webp 1800w`, sizes, src: `${base}.webp` }
}
