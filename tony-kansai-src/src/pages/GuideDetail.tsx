import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageCircle, Star, Globe, Quote, MapPin } from 'lucide-react'
import { GUIDES, TOURS, TESTIMONIALS, WHATSAPP } from '../lib/data'
import { PageSEO } from '../components/PageSEO'

// Extended per-guide content (display-only, not needed in the shared data layer)
const DETAIL: Record<string, {
  paragraphs: string[]
  quote: string
  approach: string
  funFacts: string[]
}> = {
  tony: {
    paragraphs: [
      "Tony came to Japan the way most people do — as a traveller. He never left.",
      "What started as a year-long adventure in Osaka in 2018 became a complete obsession with the Kansai region's hidden layers: the izakayas tucked down unmarked alleys, the temples that don't appear on any map, the market vendors who know your face by the third visit.",
      "Since founding Tony Kansai Guide, he has led over 200 private tours — zero group bookings, ever. His rule: every guest deserves undivided attention, every day should feel like exploring with a friend who happens to know where every secret is. He speaks English, Spanish and Arabic, bringing a uniquely international perspective to Japanese culture.",
    ],
    quote: "Japan rewards curiosity. My job is to give you the curiosity of someone who has lived here for years — in a single day.",
    approach: "Tony's tours move at your pace. No rushing between checkpoints, no ticking boxes. If you want to sit in a temple garden for two hours, you sit. If you discover a noodle shop you'd like to try, you try it. The itinerary is a starting point — the day belongs to you.",
    funFacts: [
      "Has eaten at over 300 different izakayas in Osaka",
      "Speaks Arabic after years living in the Middle East before coming to Japan",
      "Once walked the Kumano Kodo solo for three days straight",
      "Personally knows owners of several hidden local restaurants he takes guests to",
    ],
  },
  johnny: {
    paragraphs: [
      "Johnny Coletta arrived in Japan as a student of architectural history and discovered that Kyoto was his life's subject.",
      "Every street in the old city is a timeline. Johnny reads it like a book — pointing out the Edo-period tea house hidden behind a convenience store, the private garden accessible through an unmarked gate, the way morning light hits Kinkakuji at 7am in a way that no photograph can capture.",
      "Fluent in Czech and English, Johnny specialises in guests from Central Europe and the English-speaking world who want depth over breadth. His tours are slower, more observant — you leave with a completely different understanding of what Kyoto actually is.",
    ],
    quote: "Kyoto isn't a museum — it's a living city that breathes. I want to show you the parts that are still alive.",
    approach: "Johnny's tours are visually driven. Expect to stop often, look closely, and ask a lot of questions. He encourages curiosity and never makes guests feel rushed. Bring comfortable shoes — you will walk, but every step will mean something.",
    funFacts: [
      "Studied architectural history in Prague before moving to Japan",
      "Has documented over 200 lesser-known machiya townhouses in Kyoto",
      "Speaks Czech, English and conversational Japanese",
      "Wakes up at 5am before tours to scout the best light at each location",
    ],
  },
  larion: {
    paragraphs: [
      "Larion first came to Japan to walk the ancient pilgrimage routes of the Kii Peninsula. He planned to stay three months.",
      "Seven years later, he is fluent in Japanese, has completed the Shikoku 88-temple pilgrimage twice on foot, and has built a network of temple priests, mountain monks, and shrine keepers that takes decades to cultivate.",
      "His Kōyasan overnight tour has been described as 'the most spiritual experience of my life' by guests from six countries. He doesn't just show you the temples — he opens the door. Larion speaks Russian, Japanese, English and Spanish, making him the most multilingual guide in the team.",
    ],
    quote: "The mountains of Japan have been walked by pilgrims for a thousand years. I want you to feel that weight — and that freedom — under your feet.",
    approach: "Larion's tours are slower and more meditative. He creates space for silence and reflection. Guests often say they leave feeling genuinely transformed, not just informed. There is no rush. The mountain waits.",
    funFacts: [
      "Completed the 1,200 km Shikoku 88-temple pilgrimage twice on foot",
      "Studies traditional Japanese Buddhism and Shinto practices",
      "Speaks Russian, Japanese, English and Spanish",
      "Has a personal relationship with a monk at Kōyasan who occasionally joins private tours",
    ],
  },
}

export default function GuideDetail() {
  const { id } = useParams<{ id: string }>()
  const guide = GUIDES.find(g => g.id === id)

  if (!guide) return <Navigate to="/about" replace />

  const detail = DETAIL[guide.id] ?? { paragraphs: [guide.bio], quote: '', approach: '', funFacts: [] }
  const signatureTours = guide.highlights
    .map(h => TOURS.find(t => t.title === h))
    .filter(Boolean) as typeof TOURS

  const guideTestimonials = TESTIMONIALS.filter(t => guide.highlights.includes(t.tour))

  const waMsg = encodeURIComponent(
    `Hi! I'd like to book a private tour with ${guide.name}. Could you tell me about availability?`
  )

  return (
    <>
      <PageSEO
        title={`${guide.name} · ${guide.specialty}`}
        description={`Meet ${guide.name} — ${guide.role}. ${guide.bio}`}
        path={`/guides/${guide.id}`}
      />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
        <img
          src={guide.photo}
          alt={guide.name}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-japan-dark via-japan-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-japan-dark/40 to-transparent" />

        {/* Back */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28">
          <Link to="/about" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
            <ArrowLeft size={16} /> Back to team
          </Link>
        </div>

        {/* Guide info overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-5xl mx-auto px-6 pb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div
                className="text-xs font-semibold tracking-[0.22em] uppercase mb-2"
                style={{ color: guide.accent }}
              >
                {guide.specialty}
              </div>
              <h1 className="font-serif text-5xl md:text-6xl font-semibold text-white mb-2">{guide.name}</h1>
              <p className="text-white/55 text-lg mb-5">{guide.role}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
                <span className="flex items-center gap-1.5"><Star size={13} className="text-japan-gold" fill="currentColor" /> {guide.rating} rating</span>
                <span className="w-px h-4 bg-white/15" />
                <span>{guide.tours} private tours</span>
                <span className="w-px h-4 bg-white/15" />
                <span>Since {guide.since}</span>
                <span className="w-px h-4 bg-white/15" />
                <span className="flex items-center gap-1.5">
                  <Globe size={13} />
                  {guide.langLabels.join(' · ')}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CONTENT ───────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-14">

          {/* Left: bio + quote + approach */}
          <div className="lg:col-span-2 space-y-10">

            {/* Bio */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-serif text-2xl font-semibold text-white mb-5">About {guide.name.split(' ')[0]}</h2>
              <div className="space-y-4">
                {detail.paragraphs.map((p, i) => (
                  <p key={i} className="text-white/60 leading-relaxed">{p}</p>
                ))}
              </div>
            </motion.div>

            {/* Quote */}
            {detail.quote && (
              <motion.blockquote
                initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="relative pl-6 border-l-2"
                style={{ borderColor: guide.accent }}
              >
                <Quote size={18} className="absolute -left-1 -top-1 opacity-30" style={{ color: guide.accent }} />
                <p className="font-serif text-xl italic text-white/80 leading-relaxed">"{detail.quote}"</p>
                <p className="text-sm text-white/35 mt-3">— {guide.name}</p>
              </motion.blockquote>
            )}

            {/* Approach */}
            {detail.approach && (
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h3 className="font-semibold text-white mb-3">Guide Style</h3>
                <p className="text-white/60 leading-relaxed">{detail.approach}</p>
              </motion.div>
            )}

            {/* Testimonials */}
            {guideTestimonials.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h3 className="font-semibold text-white mb-5">What Guests Say</h3>
                <div className="space-y-4">
                  {guideTestimonials.slice(0, 2).map((t, i) => (
                    <div key={i} className="glass rounded-2xl border border-white/6 p-5">
                      <div className="flex gap-0.5 mb-3">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <Star key={j} size={12} className="text-japan-gold" fill="currentColor" />
                        ))}
                      </div>
                      <p className="text-white/65 text-sm leading-relaxed mb-4">"{t.text}"</p>
                      <div className="flex items-center justify-between text-xs text-white/30">
                        <span className="font-medium text-white/50">{t.name}</span>
                        <span>{t.country} · {t.tour}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: sidebar */}
          <div className="space-y-6">

            {/* Fun facts */}
            {detail.funFacts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="glass rounded-2xl border border-white/6 p-5"
              >
                <h3 className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-4">Quick Facts</h3>
                <ul className="space-y-3">
                  {detail.funFacts.map((f, i) => (
                    <li key={i} className="flex gap-3 text-sm text-white/60 leading-relaxed">
                      <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5" style={{ background: `${guide.accent}20`, color: guide.accent }}>{i + 1}</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Languages */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="glass rounded-2xl border border-white/6 p-5"
            >
              <h3 className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-4">Languages</h3>
              <div className="space-y-2">
                {guide.languages.map((flag, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-2xl leading-none">{flag}</span>
                    <span className="text-white/70 text-sm font-medium">{guide.langLabels[i]}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Signature tours */}
            {signatureTours.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="glass rounded-2xl border border-white/6 p-5"
              >
                <h3 className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-4">Signature Tours</h3>
                <div className="space-y-2">
                  {signatureTours.map(tour => (
                    <Link
                      key={tour.id}
                      to={`/tours/${tour.id}`}
                      className="flex items-center justify-between gap-2 group"
                    >
                      <div className="min-w-0">
                        <p className="text-white/75 text-sm font-medium group-hover:text-white transition-colors truncate">{tour.title}</p>
                        <p className="text-white/30 text-xs">{tour.price}</p>
                      </div>
                      <span className="text-white/20 group-hover:text-white/50 text-lg leading-none flex-shrink-0">›</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="glass rounded-2xl border border-white/6 p-5"
            >
              <h3 className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-3">Base</h3>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin size={13} style={{ color: guide.accent }} />
                {guide.role.split('·')[1]?.trim() || 'Kansai, Japan'}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <a
                href={`https://wa.me/34634193106?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-semibold text-white text-sm shadow-lg transition-opacity hover:opacity-90"
                style={{ background: guide.accent, boxShadow: `0 8px 24px ${guide.accent}40` }}
              >
                <MessageCircle size={18} />
                Book with {guide.name.split(' ')[0]}
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── OTHER GUIDES ──────────────────────────────────────────── */}
      <section className="border-t border-white/6 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="font-serif text-2xl font-semibold text-white mb-8">Meet the rest of the team</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {GUIDES.filter(g => g.id !== guide.id).map(g => (
              <Link key={g.id} to={`/guides/${g.id}`} className="group glass rounded-2xl border border-white/6 overflow-hidden flex hover:border-white/12 transition-colors">
                <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
                  <img src={g.photo} alt={g.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 min-w-0">
                  <p className="text-white font-semibold truncate">{g.name}</p>
                  <p className="text-xs mb-2" style={{ color: g.accent }}>{g.specialty}</p>
                  <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{g.bio}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
