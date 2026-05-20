import { Helmet } from 'react-helmet-async'

const BASE = 'https://tonykansaiguide.surge.sh'
const OG_IMG = 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&h=630&q=80'

interface Props {
  title: string
  description: string
  path?: string
  ogImage?: string
}

export function PageSEO({ title, description, path = '', ogImage = OG_IMG }: Props) {
  const fullTitle = `${title} | Tony Kansai Guide`
  const url = `${BASE}${path}`
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
    </Helmet>
  )
}
