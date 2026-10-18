// Páginas que siguen abiertas pero no se indexan (scripts/rutas-estaticas.mjs
// les pone noindex y las saca del sitemap): fichas de afiliado de ventajas y
// las de Larion en inglés, casi iguales a las de Tony. Un hreflang no puede
// apuntar a ellas. Mantener igual que NOINDEX de rutas-estaticas.mjs.
export const NOINDEX = /^(es\/ventajas|en\/perks|ar\/perks|ru\/perks)\/[^/]+$|^larion(\/|$)/

export const indexable = (href: string) =>
  !NOINDEX.test(href.replace(/^https?:\/\/[^/]+/, '').replace(/^\/+|\/+$/g, ''))
