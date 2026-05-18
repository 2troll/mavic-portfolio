import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Check, MessageCircle, MapPin, Users } from 'lucide-react'
import { Card3D } from '../components/Card3D'
import { FadeUp } from '../components/FadeUp'
import { TOURS, WHATSAPP, LANGUAGES } from '../lib/data'

export default function TourDetail() {
  const { id } = useParams()
  const tour = TOURS.find((t) => t.id === id)

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🗾</div>
          <h2 className="font-serif text-2xl text-white mb-3">Tour not found</h2>
          <Link to="/tours" className="text-japan-red hover:text-japan-orange">← Back to Tours</Link>
        </div>
      </div>
    )
  }

  const waMsg = encodeURIComponent(`Hi Tony! I'm very interested in the "${tour.title}" tour. Could you share more details and availability?`)

  return (
    <>
      {/* Hero */}
      <section className={`relative pt-24 pb-0 overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-b from-japan-dark via-[#08060F] to-japan-surface" />
        <div className={`absolute inset-0 bg-gradient-to-br ${tour.gradient} opacity-15`} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-20"
          style={{ background: tour.accent }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-16">
          <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.4 }}>
            <Link to="/tours" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-8 transition-colors">
              <ArrowLeft size={14} /> All Tours
            </Link>
          </motion.div>

          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.1 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl">{tour.emoji}</span>
              <div>
                <div className="text-xs font-semibold tracking-wider" style={{ color:tour.accent }}>{tour.subtitle}</div>
                <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                  <Clock size={11} />{tour.duration}
                </div>
              </div>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-semibold text-white mb-4 leading-tight">{tour.title}</h1>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif text-3xl font-bold text-gradient-japan">{tour.price}</span>
              <span className="text-sm text-white/40">per tour (not per person)</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href={`${WHATSAPP}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white font-semibold shadow-lg shadow-japan-red/40 hover:scale-105 transition-transform">
                <MessageCircle size={15} /> Book This Tour
              </a>
              <Link to="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-white/80 hover:text-white border border-white/10 hover:border-japan-red/30 transition-all">
                View All Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-28">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-8">
              <FadeUp>
                <div className="glass rounded-2xl p-7 border border-white/6">
                  <h2 className="font-serif text-2xl font-semibold text-white mb-4">About this Tour</h2>
                  <p className="text-white/65 leading-relaxed text-[15px]">{tour.longDescription}</p>
                </div>
              </FadeUp>

              <FadeUp delay={0.1}>
                <div className="glass rounded-2xl p-7 border border-white/6">
                  <h2 className="font-serif text-2xl font-semibold text-white mb-5">What You'll Experience</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {tour.highlights.map((h) => (
                      <div key={h} className="flex items-start gap-2.5 text-sm text-white/70">
                        <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color:tour.accent }} />{h}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.2}>
                <div className="glass rounded-2xl p-7 border border-white/6">
                  <h2 className="font-serif text-2xl font-semibold text-white mb-5">What's Included</h2>
                  <div className="space-y-2.5">
                    {tour.includes.map((inc) => (
                      <div key={inc} className="flex items-center gap-2.5 text-sm text-white/70">
                        <div className="w-5 h-5 rounded-full bg-japan-red/15 flex items-center justify-center flex-shrink-0">
                          <Check size={10} className="text-japan-red" />
                        </div>{inc}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <FadeUp delay={0.15}>
                <Card3D glowColor={`${tour.accent}25`}>
                  <div className="glass rounded-2xl p-6 border border-white/6 space-y-4">
                    <h3 className="font-serif text-lg font-semibold text-white">Quick Info</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2.5 text-white/60">
                        <Clock size={14} className="text-japan-red" />{tour.duration}
                      </div>
                      <div className="flex items-center gap-2.5 text-white/60">
                        <MapPin size={14} className="text-japan-red" />{tour.meetingPoint}
                      </div>
                      <div className="flex items-center gap-2.5 text-white/60">
                        <Users size={14} className="text-japan-red" />Private — no shared groups
                      </div>
                    </div>
                    <div className="pt-3 border-t border-white/5">
                      <div className="text-xs text-white/35 mb-2 font-medium">Available languages</div>
                      <div className="flex gap-1.5 flex-wrap">
                        {LANGUAGES.map(({ flag, code }) => (
                          <span key={code} className="text-lg" title={code}>{flag}</span>
                        ))}
                      </div>
                    </div>
                    <a href={`${WHATSAPP}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white text-sm font-semibold shadow-md shadow-japan-red/30 hover:scale-105 transition-transform mt-2">
                      <MessageCircle size={14} /> Book Now
                    </a>
                  </div>
                </Card3D>
              </FadeUp>

              <FadeUp delay={0.2}>
                <div className="glass rounded-2xl p-6 border border-white/6 text-center">
                  <div className="text-2xl mb-2">⭐⭐⭐⭐⭐</div>
                  <div className="text-sm font-semibold text-white mb-1">5.0 · 200+ tours</div>
                  <div className="text-xs text-white/40">All private, all personal</div>
                </div>
              </FadeUp>

              {/* Other tours */}
              <FadeUp delay={0.25}>
                <div className="glass rounded-2xl p-6 border border-white/6">
                  <h4 className="text-sm font-semibold text-white/50 mb-3">Other Tours</h4>
                  <div className="space-y-2">
                    {TOURS.filter((t) => t.id !== tour.id).map((t) => (
                      <Link key={t.id} to={`/tours/${t.id}`}
                        className="flex items-center gap-2.5 text-sm text-white/65 hover:text-white py-1 transition-colors">
                        <span className="text-base">{t.emoji}</span>
                        <span>{t.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
