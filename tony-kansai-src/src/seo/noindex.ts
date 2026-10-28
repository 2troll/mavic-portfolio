// Páginas que siguen abiertas pero no se indexan (scripts/rutas-estaticas.mjs
// les pone noindex y las saca del sitemap): fichas de afiliado de ventajas y
// las de Larion en inglés, casi iguales a las de Tony. Un hreflang no puede
// apuntar a ellas. Avisos legales y lista de ventajas, tampoco. Mantener igual
// que NOINDEX de rutas-estaticas.mjs.
export const NOINDEX = /^larion(\/|$)|^(terms|privacy|cookies|safety|legal|accessibility)$/

export const indexable = (href: string) =>
  !NOINDEX.test(href.replace(/^https?:\/\/[^/]+/, '').replace(/^\/+|\/+$/g, ''))
