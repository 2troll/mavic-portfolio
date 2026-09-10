import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import { LANG_META } from '../lib/i18n'
import type { Lang } from '../lib/i18n'

const BASE = 'https://tonykansaiguide.com'
const OG_IMG = 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&h=630&q=80'

/** Locales completos para Open Graph; `lang` a secas basta para hreflang. */
const OG_LOCALE: Record<Lang, string> = {
  en: 'en_US',
  es: 'es_ES',
  ar: 'ar_SA',
  cs: 'cs_CZ',
  ru: 'ru_RU',
}

interface Props {
  title: string
  description: string
  path?: string
  ogImage?: string
  breadcrumb?: { name: string; path: string }[]
}

export function PageSEO({ title, description, path = '', ogImage = OG_IMG, breadcrumb }: Props) {
  const { lang, dir, tc } = useLanguage()
  const fullTitle = `${title} | Tony Kansai Guide`
  const url = `${BASE}${path}`
  const langs = Object.keys(LANG_META) as Lang[]

  const breadcrumbSchema = breadcrumb && breadcrumb.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: tc('Home'), item: BASE },
      ...breadcrumb.map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: crumb.name,
        item: `${BASE}${crumb.path}`,
      })),
    ],
  } : null

  return (
    <Helmet>
      <html lang={lang} dir={dir} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Una sola URL por página: el idioma va en ?lang= para que Google
          pueda indexar cada versión sin duplicar rutas. */}
      {langs.map((l) => (
        <link key={l} rel="alternate" hrefLang={l} href={`${url}${l === 'en' ? '' : `?lang=${l}`}`} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={OG_LOCALE[lang]} />
      {langs.filter((l) => l !== lang).map((l) => (
        <meta key={l} property="og:locale:alternate" content={OG_LOCALE[l]} />
      ))}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {breadcrumbSchema && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      )}
    </Helmet>
  )
}
