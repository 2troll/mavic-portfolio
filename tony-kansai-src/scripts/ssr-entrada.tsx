// Render en el build (sin navegador) de cada ruta, para que el HTML ya traiga
// la página pintada y el titular no espere a que arranque React (LCP).
// Espera a los trozos perezosos (onAllReady); lo que sólo existe en el
// navegador (3D, globo) se queda en su hueco reservado, como en la primera carga.
import { renderToPipeableStream } from 'react-dom/server'
import { Writable } from 'node:stream'
import { StaticRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { LanguageProvider } from '../src/contexts/LanguageContext'
import { Layout } from '../src/App'
import { setPhrases } from '../src/lib/dict'
import type { Lang } from '../src/lib/i18n'

/** HTML del cuerpo y los <script type="application/ld+json"> que la página pone
 *  con Helmet: así los datos estructurados van en el HTML y Google no tiene que
 *  ejecutar JavaScript para leerlos. */
export function pinta(url: string, idioma?: Lang, frases?: Record<string, string>): Promise<{ html: string; ld: string }> {
  // Las páginas que traducen con el diccionario (montaña) necesitan el suyo ya
  // cargado: el cliente lo espera antes de hidratar y tienen que coincidir.
  if (idioma && frases) setPhrases(idioma, frases)
  const ctx: { helmet?: { script: { toString(): string } } } = {}
  return new Promise((resolve, reject) => {
    let html = ''
    const destino = new Writable({ write(trozo, _c, listo) { html += trozo.toString(); listo() } })
    destino.on('finish', () => resolve({ html, ld: ctx.helmet?.script.toString() ?? '' }))
    const { pipe } = renderToPipeableStream(
      <HelmetProvider context={ctx}>
        <LanguageProvider inicial={idioma}>
          <StaticRouter location={url}>
            <Layout />
          </StaticRouter>
        </LanguageProvider>
      </HelmetProvider>,
      { onAllReady() { pipe(destino) }, onShellError: reject, onError(e) { reject(e) } },
    )
  })
}
