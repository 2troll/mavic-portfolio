import { Helmet } from 'react-helmet-async'

const BASE = 'https://tonykansaiguide.com'
const OG_IMG = 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&h=630&q=80'

interface Props {
  title: string
  description: string
  path?: string
  ogImage?: string
  breadcrumb?: { name: string; path: string }[]
}

export function PageSEO({ title, description, path = '', ogImage = OG_IMG, breadcrumb }: Props) {
  const fullTitle = `${title} | Tony Kansai Guide`
  const url = `${BASE}${path}`

  const breadcrumbSchema = breadcrumb && breadcrumb.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
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
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="es_ES" />
      <meta property="og:locale:alternate" content="ar_SA" />
      <meta property="og:locale:alternate" content="cs_CZ" />
      <meta property="og:locale:alternate" content="ru_RU" />
      {breadcrumbSchema && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      )}
    </Helmet>
  )
}
