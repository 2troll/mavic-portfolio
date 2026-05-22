import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageCircle, Star, Globe, Quote } from 'lucide-react'
import { GUIDES, TOURS } from '../lib/data'
import { PageSEO } from '../components/PageSEO'

const DETAIL: Record<string, {
  paragraphs: string[]
  quote: string
  approach: string
  funFacts: string[]
}> = {
  tony: {
    paragraphs: [
      "Tony came to Japan the way most people do — as a traveller. He never left.",
      "What started as a year-long adventure in Osaka became a complete obsession with Kansai's hidden layers: the izakayas tucked down unmarked alleys, the temples that don't appear on any map, the market vendors who know your face by the third visit.",
      "He speaks English, Spanish and Arabic, bringing a uniquely international perspective to Japanese culture. Every tour is 100% private — no groups, ever. His rule: every guest deserves undivided attention, every day should feel like exploring with a friend who happens to know where every secret is.",
    ],
    quote: "Japan rewards curiosity. My job is to give you the curiosity of someone who has lived here for years — in a single day.",
    approach: "Tony's tours move at your pace. No rushing between checkpoints, no ticking boxes. If you want to sit in a temple garden for an hour, you sit. If you find a noodle shop you want to try, you try it. The itinerary is a starting point — the day belongs to you.",
    funFacts: [
      "Has eaten at hundreds of different izakayas in Osaka",
      "Speaks Arabic after years living in the Middle East before Japan",
      "Once walked the Kumano Kodo solo for three days straight",
      "Personally knows owners of several hidden restaurants he takes guests to",
    ],
  },
  johnny: {
    paragraphs: [
      "Johnny Coletta arrived in Japan as a student of architectural history and discovered that Kyoto was his life's subject.",
      "Every street in the old city is a timeline. Johnny reads it like a book — pointing out the Edo-period tea house hidden behind a convenience store, the private garden accessible through an unmarked gate, the way morning light hits Kinkakuji in a way no photograph can capture.",
      "Fluent in Czech and English, Johnny specialises in guests from Central Europe and the English-speaking world who want depth over breadth. His tours are slower, more observant — you leave with a completely different understanding of what Kyoto actually is.",
    ],
    quote: "Kyoto isn't a museum — it's a living city that breathes. I want to show you the parts that are still alive.",
    approach: "Johnny's tours are visually driven. Expect to stop often, look closely, and ask a lot of questions. He encourages curiosity and never makes guests feel rushed. Bring comfortable shoes — you will walk, but every step will mean something.",
    funFacts: [
      "Studied architectural history in Prague before moving to Japan",
      "Has documented hundreds of lesser-known machiya townhouses in Kyoto",
      "Speaks Czech, English and conversational Japanese",
      "Wakes at 5am before tours to scout the best light at each location",
    ],
  },
  larion: {
    paragraphs: [
      "Born to a Russian-Japanese family, Larion grew up between two worlds — and two languages. Russia and Japan shaped him equally, giving him a perspective that is genuinely rare.",
      "Native in both Russian and Japanese, he has built deep relationships with temple priests, mountain monks and shrine keepers over years of walking Japan's sacred routes. He accesses places and ceremonies that are simply not open to most visitors.",
      "His Kōyasan pilgrimage tour has been described as 'the most spiritual experience of my life' by guests from across the world. He doesn't just show you the temples — he opens the door.",
    ],
    quote: "The mountains of Japan have been walked by pilgrims for a thousand years. I want you to feel that weight — and that freedom — under your feet.",
    approach: "Larion's tours are slower and more meditative. He creates space for silence and reflection. Guests often say they leave feeling genuinely transformed, not just informed. There is no rush. The mountain waits.",
    funFacts: [
      "Born to a Russian-Japanese family — native in both languages",
      "Has completed the 88-temple Shikoku pilgrimage on foot",
      "Studies traditional Japanese Buddhism and Shinto practices",
      "Has a relationship with a monk at Kōyasan who occasionally joins private tours",
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
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-japan-dark to-japan-surface pointer-events-none" />
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[160px] opacity-10 pointer-events-none"
          style={{ background: guide.accent }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <Link to="/about" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors mb-10">
            <ArrowLeft size={15} /> Back to team
          </Link>

          <div className="grid md:grid-cols-5 gap-10 md:gap-14 items-start">

            {/* ── Portrait photo ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2"
            >
              <div
                className="rounded-3xl overflow-hidden border border-white/8 shadow-2xl"
                style={{ aspectRatio: '3/4', boxShadow: `0 32px 80px ${guide.accent}25` }}
              >
                <img
                  src={guide.photo}
                  alt={guide.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* ── Text ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="md:col-span-3 pt-2"
            >
              <div
                className="text-xs font-semibold tracking-[0.22em] uppercase mb-3"
                style={{ color: guide.accent }}
              >
                {guide.specialty}
              </div>
              <h1 className="font-serif text-5xl md:text-6xl font-semibold text-white mb-2 leading-tight">
                {guide.name}
              </h1>
              <p className="text-white/45 text-lg mb-6">{guide.role}</p>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mb-6">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={15} className="text-japan-gold" fill="currentColor" />
                ))}
                <span className="text-white/40 text-sm ml-1">{guide.rating}</span>
              </div>

              {/* Languages */}
              <div className="flex items-center gap-2 mb-8">
                <Globe size={14} className="text-white/25" />
                {guide.languages.map((flag, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <span className="text-xl leading-none">{flag}</span>
                    <span className="text-white/40 text-xs font-medium">{guide.langLabels[i]}</span>
                    {i < guide.languages.length - 1 && <span className="text-white/15 text-xs">·</span>}
                  </span>
                ))}
              </div>

              {/* Short bio */}
              <p className="text-white/55 leading-relaxed mb-8 text-[15px]">{guide.bio}</p>

              {/* CTA */}
              <a
                href={`https://wa.me/34634193106?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-semibold text-white text-sm transition-opacity hover:opacity-85"
                style={{ background: guide.accent, boxShadow: `0 8px 24px ${guide.accent}40` }}
              >
                <MessageCircle size={17} />
                Book with {guide.name.split(' ')[0]}
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CONTENT ───────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-14">

          {/* Left: bio + quote + approach + testimonials */}
          <div className="lg:col-span-2 space-y-10">

            {/* Full bio */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-serif text-2xl font-semibold text-white mb-5">
                About {guide.name.split(' ')[0]}
              </h2>
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
                <Quote size={16} className="absolute -left-0.5 -top-1 opacity-25" style={{ color: guide.accent }} />
                <p className="font-serif text-xl italic text-white/75 leading-relaxed">"{detail.quote}"</p>
                <p className="text-sm text-white/30 mt-3">— {guide.name}</p>
              </motion.blockquote>
            )}

            {/* Guide style */}
            {detail.approach && (
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h3 className="font-semibold text-white mb-3">Guide Style</h3>
                <p className="text-white/60 leading-relaxed">{detail.approach}</p>
              </motion.div>
            )}

          </div>

          {/* Right: sidebar */}
          <div className="space-y-5">

            {/* Fun facts */}
            {detail.funFacts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="glass rounded-2xl border border-white/6 p-5"
              >
                <h3 className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-4">Quick Facts</h3>
                <ul className="space-y-3">
                  {detail.funFacts.map((f, i) => (
                    <li key={i} className="flex gap-3 text-sm text-white/55 leading-relaxed">
                      <span
                        className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5"
                        style={{ background: `${guide.accent}20`, color: guide.accent }}
                      >{i + 1}</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Signature tours */}
            {signatureTours.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="glass rounded-2xl border border-white/6 p-5"
              >
                <h3 className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-4">Signature Tours</h3>
                <div className="space-y-3">
                  {signatureTours.map(tour => (
                    <Link
                      key={tour.id}
                      to={`/tours/${tour.id}`}
                      className="flex items-center justify-between gap-2 group"
                    >
                      <div className="min-w-0">
                        <p className="text-white/70 text-sm font-medium group-hover:text-white transition-colors truncate">{tour.title}</p>
                        <p className="text-white/25 text-xs">{tour.price}</p>
                      </div>
                      <span className="text-white/15 group-hover:text-white/40 text-lg leading-none flex-shrink-0 transition-colors">›</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Languages */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="glass rounded-2xl border border-white/6 p-5"
            >
              <h3 className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-4">Languages</h3>
              <div className="space-y-2.5">
                {guide.languages.map((flag, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-2xl leading-none">{flag}</span>
                    <span className="text-white/65 text-sm font-medium">{guide.langLabels[i]}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── OTHER GUIDES ──────────────────────────────────────────── */}
      <section className="border-t border-white/6 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="font-serif text-2xl font-semibold text-white mb-8">Meet the rest of the team</h3>
          <div className="grid md:grid-cols-2 gap-5">
            {GUIDES.filter(g => g.id !== guide.id).map(g => (
              <Link
                key={g.id}
                to={`/guides/${g.id}`}
                className="group glass rounded-2xl border border-white/6 overflow-hidden flex hover:border-white/12 transition-colors"
              >
                <div className="w-24 flex-shrink-0 overflow-hidden">
                  <img
                    src={g.photo}
                    alt={g.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
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
