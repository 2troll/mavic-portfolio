// Etiquetas hreflang de una página y de sus hermanas: el idioma y sus países
// (regiones.json), para que Google muestre en cada país la versión adecuada.
// Devuelve una lista de <link> y no un componente: Helmet sólo acepta
// etiquetas directas como hijos.
import regiones from './regiones.json'

const R = regiones as unknown as Record<string, string[]>

export function enlacesHreflang(alternas: { lang: string; href: string }[]) {
  return [
    ...alternas.flatMap(({ lang, href }) =>
      [lang, ...(href.includes('/larion') ? [] : (R[lang] ?? []))].map((x) => <link key={x + href} rel="alternate" hrefLang={x} href={href} />)),
    <link key="x-default" rel="alternate" hrefLang="x-default" href="https://tonykansaiguide.com/" />,
  ]
}
