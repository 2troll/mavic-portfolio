import { useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { BookOpen, Download, FileText, Languages, MapPin } from 'lucide-react'
import { HeroTextKinetic } from '../components/HeroTextKinetic'
import { PageSEO } from '../components/PageSEO'
import { FadeUp } from '../components/FadeUp'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * El libro de Tony, leíble entero desde la web.
 *
 * El PDF pesa 16 MB: el visor NO se monta hasta que el visitante pulsa, para
 * no arrastrar esa descarga a quien sólo pasa por la página desde el móvil.
 *
 * El título, el subtítulo y el nombre del autor van en constantes, no como
 * texto suelto en el JSX, porque son castellano original: no se traducen, y
 * escritos a pelo entre etiquetas harían saltar el comprobador de i18n.
 */

const PDF = '/libro/detras-del-rostro.pdf'
const PORTADA = '/libro/portada.jpg'
const TITULO = 'Detrás del Rostro'
const SUBTITULO_ES = 'Japón como laboratorio del capitalismo tardío'
const AUTOR = 'Tony Hanma'
const LUGAR_ANO = 'Osaka, 2026'
const PAGINAS = '362'

export default function Book() {
  const { tc, isRTL } = useLanguage()
  const [abierto, setAbierto] = useState(false)

  /**
   * Abre el visor y baja hasta él. Sin el desplazamiento, pulsar «Léelo aquí»
   * en la portada no parecía hacer nada: el lector se monta tres pantallas
   * más abajo y el visitante se queda mirando la misma portada.
   */
  function abrirLector() {
    setAbierto(true)
    requestAnimationFrame(() => {
      document.getElementById('lector')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const partes = [
    { n: tc('The Culture of Evasion'), d: tc('Flight from a reality that cannot be sustained.') },
    { n: tc('The Culture of Shame'), d: tc('The subject held under the judgement of everyone around them.') },
    { n: tc('The Culture of the Mask'), d: tc('The split between the face shown and the face kept back.') },
    { n: tc('The Culture of Silence'), d: tc('Making invisible whatever would compromise the image of the country.') },
    { n: tc('The Culture of Exhaustion'), d: tc('The body and the soul underneath everything else.') },
    { n: tc('The Culture of Exactitude'), d: tc('The perfect figure as the last face of all.') },
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: TITULO,
    alternativeHeadline: SUBTITULO_ES,
    author: { '@type': 'Person', name: AUTOR },
    inLanguage: 'es',
    numberOfPages: Number(PAGINAS),
    bookFormat: 'https://schema.org/EBook',
    datePublished: '2026',
    image: 'https://tonykansaiguide.com/libro/portada.jpg',
    url: 'https://tonykansaiguide.com/book',
    isAccessibleForFree: true,
  }

  return (
    <>
      <PageSEO
        title={tc('The Book')}
        description={tc('Detrás del Rostro, the book by Tony Hanma: six theses on evasion, shame, the mask, silence, exhaustion and exactitude, reading Japan as a laboratory of late capitalism. 362 pages, free to read online.')}
        path="/book"
        ogImage="https://tonykansaiguide.com/libro/portada.jpg"
        breadcrumb={[{ name: tc('The Book'), path: '/book' }]}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      {/* ── Portada y descarga ───────────────────────────────── */}
      <section className="relative pt-28 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-japan-dark to-japan-surface" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 grid md:grid-cols-[minmax(0,300px)_1fr] gap-10 items-center">

          <motion.img
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            src={PORTADA}
            alt={`${TITULO} — ${AUTOR}`}
            width={1000}
            height={1500}
            className="w-full max-w-[280px] mx-auto rounded-xl shadow-2xl shadow-black/60 border border-white/10"
          />

          <div className={isRTL ? 'text-right' : ''}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-4"
            >
              {tc('The Book')}
            </motion.div>

            <div className="mb-3">
              <HeroTextKinetic
                text={TITULO}
                className="text-4xl md:text-5xl font-serif font-semibold"
                delay={0.1}
              />
            </div>

            <p className="text-white/70 text-lg font-light">{SUBTITULO_ES}</p>
            {/* En castellano la glosa sería idéntica al subtítulo: no se repite. */}
            {tc('Japan as a laboratory of late capitalism') !== SUBTITULO_ES && (
              <p className="text-white/40 text-sm mt-1">{tc('Japan as a laboratory of late capitalism')}</p>
            )}

            <p className="text-white/50 mt-5 leading-relaxed">
              {tc('Six theses on evasion, shame, the mask, silence, exhaustion and exactitude.')}
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 text-sm text-white/45">
              <span className="flex items-center gap-1.5">
                <FileText size={14} className="text-japan-gold" />
                <span className="ltr-num">{PAGINAS}</span> {tc('pages')}
              </span>
              <span className="flex items-center gap-1.5">
                <Languages size={14} className="text-japan-gold" />
                {tc('Written in Spanish')}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-japan-gold" />
                {LUGAR_ANO}
              </span>
            </div>

            <div className="flex flex-wrap gap-3 mt-7">
              <button
                onClick={abrirLector}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white text-sm font-semibold shadow-lg shadow-japan-red/30 hover:shadow-japan-red/50 transition-shadow"
              >
                <BookOpen size={16} />
                {tc('Read it here')}
              </button>
              <a
                href={PDF}
                download
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/15 text-white/80 text-sm font-semibold hover:bg-white/5 transition-colors"
              >
                <Download size={16} />
                {tc('Download the PDF')}
              </a>
            </div>

            <p className="text-xs text-white/35 mt-3">
              {tc('Free, whole and with nothing to fill in. The file weighs 16 MB.')}
            </p>
          </div>
        </div>
      </section>

      {/* ── De qué trata ─────────────────────────────────────── */}
      <section className="pb-4">
        <div className="max-w-3xl mx-auto px-6">
          <FadeUp>
            <h2 className="font-serif text-2xl font-semibold text-white mb-5">{tc('What it is about')}</h2>
            <div className="text-white/60 leading-relaxed space-y-4">
              <p>{tc('The book was born in Japan, out of living there and out of the impressions that anyone who watches that society closely ends up forming. It begins with what the foreigner sees — the inscrutable, submissive, cold, soulless Japanese of the cliché — and says so openly, in order to take it apart afterwards.')}</p>
              <p>{tc('Its central thesis is that Japan is not an exotic Other, radically different from the West, but a laboratory where processes that are global can be read with unusual clarity. Evasion, shame, the mask, silence, exhaustion and exactitude are not Japanese defects: they are mechanisms of late capitalism that in Japan have reached a particularly pure form.')}</p>
              <p>{tc('What the book is after is the opposite of exoticism. If the reader recognises, in the Japanese mirror, something that also works in their own society under milder forms, it has done its job.')}</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Las seis partes ──────────────────────────────────── */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-6">
          <FadeUp>
            <h2 className="font-serif text-2xl font-semibold text-white mb-6">{tc('The six parts')}</h2>
          </FadeUp>
          <div className="grid md:grid-cols-2 gap-4">
            {partes.map((p, i) => (
              <FadeUp key={p.n} delay={i * 0.05}>
                <div className="glass rounded-2xl border border-white/6 p-5 h-full flex gap-4">
                  <span className="font-serif text-2xl text-japan-red/60 ltr-num leading-none pt-0.5">{i + 1}</span>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-white leading-snug">{p.n}</h3>
                    <p className="text-sm text-white/50 mt-1.5 leading-relaxed">{p.d}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lector ───────────────────────────────────────────── */}
      <section id="lector" className="pb-20 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6">
          <FadeUp>
            <h2 className="font-serif text-2xl font-semibold text-white mb-4">{tc('Read it here')}</h2>
            {abierto ? (
              <>
                {/* dir="ltr": el PDF es castellano y no debe invertirse en árabe. */}
                <div dir="ltr" className="rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                  <object data={PDF} type="application/pdf" className="w-full h-[78vh] min-h-[420px]">
                    <iframe src={PDF} title={TITULO} className="w-full h-[78vh] min-h-[420px]" />
                  </object>
                </div>
                <p className="text-xs text-white/35 mt-3">
                  {tc('If the reader does not open on your device, download the PDF and read it in your usual app.')}
                </p>
              </>
            ) : (
              <button
                onClick={() => setAbierto(true)}
                className="w-full glass rounded-2xl border border-white/10 border-dashed py-14 flex flex-col items-center gap-3 text-white/60 hover:text-white hover:border-white/25 transition-colors"
              >
                <BookOpen size={26} className="text-japan-red" />
                <span className="text-sm font-semibold">{tc('Open the reader')}</span>
                <span className="text-xs text-white/35">{tc('Nothing is downloaded until you press here.')}</span>
              </button>
            )}
          </FadeUp>
        </div>
      </section>
    </>
  )
}
