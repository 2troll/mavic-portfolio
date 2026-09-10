import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import {
  Plane, Banknote, TrainFront, Wifi, Plug, CalendarDays, HandHeart,
  UtensilsCrossed, Moon, Luggage, Siren, MessageSquare, MessageCircle,
} from 'lucide-react'
import { HeroTextKinetic } from '../components/HeroTextKinetic'
import { PageSEO } from '../components/PageSEO'
import { FadeUp } from '../components/FadeUp'
import { WHATSAPP } from '../lib/data'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * Guía práctica de Kansai. No vende nada: responde lo que los clientes
 * preguntan por WhatsApp antes de venir, para que no tengan que preguntarlo.
 * Las cifras son aproximadas a propósito — cambian, y el precio de un billete
 * no es lo que hace útil esta página.
 */

/** El clima de Kansai mes a mes, con lo que hay que meter en la maleta. */
const MESES = [
  { m: 'January – February', t: '3–10 °C', k: 'Cold and dry, almost nobody about. Snow on the high routes.', w: 'Coat, layers, gloves.' },
  { m: 'March', t: '8–15 °C', k: 'Cool. The cherry blossom starts at the very end of the month.', w: 'Jacket and a jumper.' },
  { m: 'April', t: '12–20 °C', k: 'Cherry blossom, and the busiest two weeks of the year.', w: 'Light layers, a jacket for the evening.' },
  { m: 'May', t: '17–25 °C', k: 'The best month in Kansai. Warm, dry, green, and quiet after Golden Week.', w: 'Shirt sleeves, light jacket.' },
  { m: 'June', t: '21–28 °C', k: 'Tsuyu, the rainy season. Wet, humid, and the hydrangeas are extraordinary.', w: 'Umbrella, quick-dry clothes.' },
  { m: 'July – August', t: '26–35 °C', k: 'Hot and very humid. Genuinely dangerous on a mountain at midday.', w: 'Lightest clothes, hat, salt tablets.' },
  { m: 'September', t: '23–31 °C', k: 'Still hot, and typhoon season. Plans may move by a day.', w: 'Rain jacket, light clothes.' },
  { m: 'October – November', t: '12–23 °C', k: 'The other best time. Clear skies and the autumn leaves.', w: 'Layers, jacket for the evening.' },
  { m: 'December', t: '4–12 °C', k: 'Cold, clear and empty. Winter illuminations in every city.', w: 'Coat, scarf, warm shoes.' },
]

/** Lo que de verdad se usa. Nadie necesita una lista de treinta frases. */
const FRASES = [
  { jp: 'Arigatō gozaimasu', k: 'Thank you' },
  { jp: 'Sumimasen', k: 'Excuse me / sorry / hello over here' },
  { jp: 'Onegaishimasu', k: 'Please' },
  { jp: 'Oishii', k: 'Delicious' },
  { jp: 'Toire wa doko desu ka', k: 'Where is the toilet?' },
  { jp: 'Eigo no menyū arimasu ka', k: 'Do you have an English menu?' },
  { jp: 'Buta niku nashi de onegaishimasu', k: 'Without pork, please' },
  { jp: 'Daijōbu desu', k: "It's fine / no thank you" },
]

function Bloque({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <FadeUp>
      <div className="glass rounded-2xl border border-white/6 p-6 md:p-7 h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-japan-red/12 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <h2 className="font-serif text-lg font-semibold text-white leading-snug">{title}</h2>
        </div>
        <div className="text-sm text-white/60 leading-relaxed space-y-2.5">{children}</div>
      </div>
    </FadeUp>
  )
}

function Dato({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p><span className="text-japan-gold font-medium">{label}:</span> {children}</p>
  )
}

export default function Guide() {
  const { tc } = useLanguage()
  const waMsg = encodeURIComponent(tc('Hi Tony! I have a question about planning my trip to Kansai.'))

  return (
    <>
      <PageSEO
        title={tc('Kansai Practical Guide')}
        description={tc('Everything a first-time visitor to Kansai actually needs: airport to city, money, IC cards, when to come, etiquette, halal and vegetarian food, prayer spaces, luggage and emergencies.')}
        path="/guide"
        breadcrumb={[{ name: tc('Kansai Practical Guide'), path: '/guide' }]}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-japan-dark to-japan-surface" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-japan-red font-semibold tracking-[0.2em] uppercase mb-4"
          >
            {tc('Before You Come')}
          </motion.div>
          <div className="mb-4">
            <HeroTextKinetic
              text={tc('Kansai Practical Guide')}
              className="justify-center text-4xl md:text-5xl font-serif font-semibold"
              delay={0.1}
            />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/50 text-lg font-light max-w-2xl mx-auto"
          >
            {tc('These are the questions guests ask on WhatsApp before they fly. Answered here so you do not have to ask them — and so you arrive knowing more than most people who have been here a week.')}
          </motion.p>
        </div>
      </section>

      {/* ── Bloques ──────────────────────────────────────────── */}
      <section className="pb-8">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-5">

          <Bloque icon={<Plane size={17} className="text-japan-red" />} title={tc('From the airport')}>
            <Dato label={tc('Kansai Airport (KIX)')}>{tc('The Nankai Rapi:t reaches Namba in about 40 minutes. The JR Haruka goes straight to Kyoto in about 80. Both are far better than a taxi, which costs many times more and is not faster.')}</Dato>
            <Dato label={tc('Itami Airport (ITM)')}>{tc('Domestic only, and much closer: about 30 minutes to central Osaka by monorail or airport bus.')}</Dato>
            <Dato label={tc('Kobe')}>{tc('The Bay Shuttle ferry from KIX crosses in about 30 minutes and is the most enjoyable arrival in Kansai.')}</Dato>
            <p className="text-white/45">{tc('Tell Tony your flight number when you book and he will tell you exactly which train to take, from which platform, with what on your IC card.')}</p>
          </Bloque>

          <Bloque icon={<Banknote size={17} className="text-japan-red" />} title={tc('Money')}>
            <Dato label={tc('Cash still matters')}>{tc('Cards work in department stores and chains. The small places Tony takes you to — the ones worth going to — are often cash only.')}</Dato>
            <Dato label={tc('Withdrawing')}>{tc('ATMs in 7-Eleven and at post offices take foreign cards around the clock. Bank ATMs frequently do not.')}</Dato>
            <Dato label={tc('Tipping')}>{tc('There is none, anywhere, ever. Leaving money on a table causes genuine confusion and someone will chase you down the street to return it.')}</Dato>
            <Dato label={tc('A day of eating')}>{tc('Roughly ¥3,000–6,000 per person if you eat where the locals eat, which is what we do.')}</Dato>
          </Bloque>

          <Bloque icon={<TrainFront size={17} className="text-japan-red" />} title={tc('Getting around')}>
            <Dato label={tc('ICOCA card')}>{tc('Buy one at any station on arrival. It works on nearly every train and bus in Kansai and pays for things in convenience stores. There is a small refundable deposit.')}</Dato>
            <Dato label={tc('The JR Pass')}>{tc('Rarely worth it if you are staying inside Kansai. It only pays off when you are crossing the country. Ask Tony before you buy one.')}</Dato>
            <Dato label={tc('Last trains')}>{tc('The single most useful thing to know: most lines stop around midnight, and there is no night service. Missing the last train means a taxi at a memorable price.')}</Dato>
            <Dato label={tc('Rush hour')}>{tc('08:00–09:00 into the cities is genuinely packed. Tony plans around it.')}</Dato>
          </Bloque>

          <Bloque icon={<Wifi size={17} className="text-japan-red" />} title={tc('Staying connected')}>
            <Dato label={tc('eSIM')}>{tc('The simplest option now: buy one before you fly and it works the moment you land. No shop, no queue, no deposit.')}</Dato>
            <Dato label={tc('Pocket wifi')}>{tc('Still makes sense for a family sharing one connection. Collect it at the airport, post it back at the end.')}</Dato>
            <Dato label={tc('Free wifi')}>{tc('Exists in stations and convenience stores and is not reliable enough to navigate on. Do not plan around it.')}</Dato>
          </Bloque>

          <Bloque icon={<Plug size={17} className="text-japan-red" />} title={tc('Plugs and power')}>
            <Dato label={tc('Sockets')}>{tc('Type A, the same flat two-pin as North America. European and British plugs need an adapter.')}</Dato>
            <Dato label={tc('Voltage')}>{tc('100 V, at 60 Hz in Kansai. Phone and laptop chargers handle it; a hairdryer from home may not.')}</Dato>
            <Dato label={tc('Power bank')}>{tc('Worth carrying. A full day of maps, photos and translation empties a phone by mid-afternoon.')}</Dato>
          </Bloque>

          <Bloque icon={<Luggage size={17} className="text-japan-red" />} title={tc('Luggage')}>
            <Dato label={tc('Send it ahead')}>{tc('Takkyubin will move a suitcase from one hotel to the next overnight for a modest fee. It is the reason Japanese travellers never drag bags around, and almost no visitor uses it.')}</Dato>
            <Dato label={tc('Coin lockers')}>{tc('Every major station has them, and they fill up by ten in the morning in high season.')}</Dato>
            <Dato label={tc('On a tour day')}>{tc('Tell Tony and he will arrange the lockers or the forwarding before you arrive, so you start the day with your hands free.')}</Dato>
          </Bloque>
        </div>
      </section>

      {/* ── Cuándo venir ─────────────────────────────────────── */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto px-6">
          <FadeUp>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-japan-red/12 flex items-center justify-center flex-shrink-0">
                <CalendarDays size={17} className="text-japan-red" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-white">{tc('When to come')}</h2>
            </div>
          </FadeUp>
          <FadeUp>
            <div className="overflow-x-auto rounded-2xl border border-white/8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/4 text-white/55">
                    <th className="text-start font-medium px-4 py-3">{tc('Month')}</th>
                    <th className="text-start font-medium px-4 py-3 whitespace-nowrap">{tc('Typical')}</th>
                    <th className="text-start font-medium px-4 py-3">{tc('What it is like')}</th>
                    <th className="text-start font-medium px-4 py-3">{tc('Pack')}</th>
                  </tr>
                </thead>
                <tbody>
                  {MESES.map((r) => (
                    <tr key={r.m} className="border-t border-white/6 align-top">
                      <td className="px-4 py-3 text-white/80 font-medium whitespace-nowrap">{tc(r.m)}</td>
                      <td className="px-4 py-3 whitespace-nowrap"><span className="ltr-num text-japan-gold">{r.t}</span></td>
                      <td className="px-4 py-3 text-white/60">{tc(r.k)}</td>
                      <td className="px-4 py-3 text-white/50">{tc(r.w)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeUp>
          <FadeUp>
            <p className="text-xs text-white/50 mt-3">{tc('Golden Week (end of April into early May) and the mid-August Obon holiday are the two weeks when all of Japan travels at once. Everything is full and everything costs more. Tony will say so honestly if you ask for those dates.')}</p>
          </FadeUp>
        </div>
      </section>

      {/* ── Comida, rezo, etiqueta ───────────────────────────── */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-5">

          <Bloque icon={<UtensilsCrossed size={17} className="text-japan-red" />} title={tc('Halal, vegetarian and allergies')}>
            <p>{tc('This is where a guide earns their fee. Japanese food is not labelled the way you are used to, and the things that catch people out are invisible.')}</p>
            <Dato label={tc('Halal')}>{tc('Osaka has certified halal restaurants and Kyoto has a handful. Tony is Muslim, knows which ones are genuine, and books ahead so you are not standing outside a closed door at eight in the evening.')}</Dato>
            <Dato label={tc('Vegetarian and vegan')}>{tc('Dashi, a fish stock, is in almost everything including the vegetable dishes. Shojin ryori, the Buddhist temple cuisine, is the great exception and it is superb.')}</Dato>
            <Dato label={tc('Pork and cooking alcohol')}>{tc('Both turn up where you would not expect them — in broths, in sauces, in the dressing on a salad. We ask on your behalf, in Japanese, before you order.')}</Dato>
            <Dato label={tc('Allergies')}>{tc('Tell Tony when you book, not on the day. He carries the wording in Japanese and calls restaurants in advance.')}</Dato>
          </Bloque>

          <Bloque icon={<Moon size={17} className="text-japan-red" />} title={tc('Prayer and quiet space')}>
            <p>{tc('Kansai is easier for a Muslim traveller than most people expect, and much easier with someone who already knows where to go.')}</p>
            <Dato label={tc('Mosques')}>{tc('Osaka Masjid, the Kobe Muslim Mosque — the oldest in Japan, opened in 1935 and still standing after the war and the earthquake — and the Kyoto Muslim Association.')}</Dato>
            <Dato label={tc('At the airport')}>{tc('Kansai Airport has prayer rooms in both terminals, with washing facilities.')}</Dato>
            <Dato label={tc('On the route')}>{tc('Tony builds prayer stops into the day without losing the day. It is planned in from the start, not squeezed in when you ask.')}</Dato>
            <Dato label={tc('Quiet, not only prayer')}>{tc('The same applies to anyone who needs a still half hour — after a long flight, with a small child, or with a condition that needs it.')}</Dato>
          </Bloque>

          <Bloque icon={<HandHeart size={17} className="text-japan-red" />} title={tc('Etiquette that actually matters')}>
            <p>{tc('Most etiquette lists are noise. These five are the ones locals notice.')}</p>
            <Dato label={tc('Shoes')}>{tc('Off at temple halls, traditional restaurants, and any home. If you see a raised wooden step, that is the line.')}</Dato>
            <Dato label={tc('On the train')}>{tc('Phones on silent and no calls. It is the quietest public transport in the world and visitors are the ones who break it.')}</Dato>
            <Dato label={tc('Eating')}>{tc('Not while walking, as a rule. Eat at the stall, then move on.')}</Dato>
            <Dato label={tc('Chopsticks')}>{tc('Never stand them upright in rice and never pass food chopstick to chopstick — both belong to a funeral.')}</Dato>
            <Dato label={tc('Queues')}>{tc('Real, orderly and respected. Marks on the platform floor tell you exactly where to stand.')}</Dato>
          </Bloque>

          <Bloque icon={<Siren size={17} className="text-japan-red" />} title={tc('If something goes wrong')}>
            <Dato label={tc('Emergencies')}>{tc('110 for police, 119 for ambulance and fire. Both answer around the clock. On a tour, the guide makes the call in Japanese.')}</Dato>
            <Dato label={tc('Japan Visitor Hotline')}>{tc('050-3816-2787, run by the national tourism organisation. Open 24 hours in English, Chinese and Korean, for accidents, illness and lost property.')}</Dato>
            <Dato label={tc('Pharmacies')}>{tc('Common medicines are behind the counter and named differently. Bring what you rely on rather than hoping to find it.')}</Dato>
            <Dato label={tc('Lost something')}>{tc('Japan returns it. Hand anything you find to a station office, and ask at one if you lose something — the recovery rate is remarkable.')}</Dato>
          </Bloque>
        </div>
      </section>

      {/* ── Frases ───────────────────────────────────────────── */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto px-6">
          <FadeUp>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-japan-red/12 flex items-center justify-center flex-shrink-0">
                <MessageSquare size={17} className="text-japan-red" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-white">{tc('Eight phrases worth knowing')}</h2>
            </div>
            <p className="text-sm text-white/45 mb-5 ms-12">{tc('You do not need Japanese — that is what the guide is for. But these eight open doors, and people notice that you tried.')}</p>
          </FadeUp>
          <div className="grid sm:grid-cols-2 gap-3">
            {FRASES.map((f) => (
              <FadeUp key={f.jp}>
                <div className="glass rounded-xl border border-white/6 px-4 py-3">
                  <div className="ltr-num font-serif text-base text-white/90">{f.jp}</div>
                  <div className="text-xs text-white/45 mt-0.5">{tc(f.k)}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-serif text-2xl font-semibold text-white mb-3">
            {tc('Still have a question?')}
          </h2>
          <p className="text-white/45 text-sm leading-relaxed mb-7">
            {tc('Ask it. Tony answers every message himself, in Spanish, Arabic or English, whether or not you end up booking anything. Nobody has ever been charged for a question.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`${WHATSAPP}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-japan-red to-japan-orange text-white font-semibold shadow-lg shadow-japan-red/30 hover:scale-105 transition-transform"
            >
              <MessageCircle size={15} /> {tc('Ask Tony directly')}
            </a>
            <Link
              to="/faq"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/25 font-medium transition-all"
            >
              {tc('Read the FAQ')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
