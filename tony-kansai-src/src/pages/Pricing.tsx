import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, MessageCircle, Clock } from 'lucide-react'
import { Card3D } from '../components/Card3D'
import { HeroText } from '../components/HeroText'
import { FadeUp } from '../components/FadeUp'
import { PRICING, WHATSAPP, WHATSAPP_NUMBER } from '../lib/data'

export default function Pricing() {
  return (
    <>
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-japan-dark to-japan-surface" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full bg-japan-red/7 blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-4">Pricing</motion.div>
          <div className="mb-6">
            <HeroText text="Simple, Transparent Pricing" className="justify-center text-4xl md:text-5xl font-serif font-semibold" delay={0.1} />
          </div>
          <motion.p initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
            className="text-white/50 text-lg font-light max-w-xl mx-auto">
            Price is per tour — not per person. No hidden fees.
          </motion.p>
        </div>
      </section>

      <section className="pb-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {PRICING.map((tier, i) => (
              <FadeUp key={tier.id} delay={i * 0.1}>
                <Card3D glowColor={tier.hot ? 'rgba(229,48,48,0.3)' : 'rgba(255,255,255,0.05)'} className="h-full">
                  <div className={`relative rounded-2xl overflow-hidden h-full flex flex-col ${
                    tier.hot ? 'bg-gradient-to-b from-japan-surface2 to-japan-surface border border-japan-red/40' : 'glass-light border border-white/6'
                  }`}>
                    {tier.hot && (
                      <>
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-japan-red to-transparent" />
                        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-japan-red text-white text-xs font-bold">HOT</div>
                      </>
                    )}
                    <div className="p-7 flex flex-col flex-1">
                      <div className="text-xs font-medium text-white/40 tracking-wider uppercase mb-1">{tier.subtitle}</div>
                      <div className="font-serif text-2xl font-semibold text-white mb-3">{tier.name}</div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className={`font-serif text-4xl font-bold ${tier.hot ? 'text-gradient-japan' : 'text-white'}`}>{tier.price}</span>
                      </div>
                      <div className="text-xs text-white/35 mb-6">{tier.priceUSD} · {tier.duration}</div>

                      <ul className="space-y-2.5 mb-8 flex-1">
                        {tier.features.map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-sm text-white/65">
                            <Check size={13} className={`mt-0.5 flex-shrink-0 ${tier.hot ? 'text-japan-red' : 'text-white/40'}`} />{f}
                          </li>
                        ))}
                      </ul>

                      <a
                        href={`${WHATSAPP}?text=${encodeURIComponent(`Hi Tony! I'd like to book the ${tier.name} (${tier.subtitle}) package. Could you confirm availability?`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 ${
                          tier.hot
                            ? 'bg-gradient-to-r from-japan-red to-japan-orange text-white shadow-lg shadow-japan-red/30'
                            : 'glass text-white/80 hover:text-white border border-white/10 hover:border-japan-red/30'
                        }`}>
                        <MessageCircle size={14} /> {tier.cta}
                      </a>
                    </div>
                  </div>
                </Card3D>
              </FadeUp>
            ))}
          </div>

          {/* Note */}
          <FadeUp className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass border border-white/6 text-sm text-white/50">
              <Clock size={14} className="text-japan-red" />
              Tony typically replies within 2 hours · {WHATSAPP_NUMBER}
            </div>
          </FadeUp>

          {/* Compare */}
          <FadeUp delay={0.1}>
            <div className="glass rounded-2xl border border-white/6 overflow-hidden">
              <div className="px-6 py-5 border-b border-white/5">
                <h3 className="font-serif text-xl font-semibold text-white">What's always included</h3>
              </div>
              <div className="p-6 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  '100% private — no shared groups',
                  'Guided in your language',
                  'Flexible itinerary',
                  'Transit navigation',
                  'Cultural commentary',
                  'WhatsApp planning support',
                  'Restaurant recommendations',
                  'All ages welcome',
                  'Cancellation protection',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-white/65">
                    <Check size={13} className="text-japan-red flex-shrink-0" />{item}
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.15} className="text-center mt-10">
            <Link to="/faq" className="text-sm text-japan-red hover:text-japan-orange transition-colors">
              Have questions? Read the FAQ →
            </Link>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
