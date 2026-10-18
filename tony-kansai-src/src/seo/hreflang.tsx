// Etiquetas hreflang de una página y de sus hermanas. Solo el idioma (es, en,
// ar, ru), sin países, y x-default a la versión inglesa: así coinciden con el
// HTML pregenerado (scripts/rutas-estaticas.mjs) y con el sitemap. Antes React
// ponía también es-MX, en-GB… y x-default a «/», y los buscadores veían dos
// versiones distintas de la misma página.
// Devuelve una lista de <link> y no un componente: Helmet sólo acepta
// etiquetas directas como hijos.

import { indexable } from './noindex'

export function enlacesHreflang(todas: { lang: string; href: string }[]) {
  const alternas = todas.filter((a) => indexable(a.href))
  if (alternas.length < 2) return []
  const porDefecto = alternas.find((a) => a.lang === 'en')?.href ?? alternas[0]?.href
  return [
    ...alternas.map(({ lang, href }) => <link key={lang + href} rel="alternate" hrefLang={lang} href={href} />),
    ...(porDefecto ? [<link key="x-default" rel="alternate" hrefLang="x-default" href={porDefecto} />] : []),
  ]
}
