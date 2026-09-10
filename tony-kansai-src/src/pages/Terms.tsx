import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { PageSEO } from '../components/PageSEO'
import { useLanguage } from '../contexts/LanguageContext'
import { LegalFooterLinks } from '../components/LegalPage'

const CONTACT_WA = 'https://wa.me/34634193106'
const UPDATED = 'May 2026'

export default function Terms() {
  const { tc } = useLanguage()

  return (
    <>
      <PageSEO
        title={tc('Terms and Conditions')}
        description={tc('Terms and conditions for booking a private guided tour with Tony Kansai Guide in Osaka, Kyoto and Kansai region.')}
        path="/terms"
      />
      <section className="relative pt-32 pb-28 min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-japan-dark to-japan-surface pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto px-6">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-10 h-10 rounded-xl bg-japan-red/15 flex items-center justify-center flex-shrink-0">
              <FileText size={18} className="text-japan-red" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-semibold text-white">{tc('Terms and Conditions')}</h1>
              <p className="text-xs text-white/50 mt-0.5">{tc('Last updated')}: {tc(UPDATED)}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="prose-custom space-y-8 text-white/70 text-sm leading-relaxed"
          >
            <div className="glass rounded-xl border border-white/6 p-5 text-white/55 text-xs">
              {tc('Please read these Terms and Conditions carefully before booking a tour with Tony Kansai Guide. By confirming a booking you agree to the terms set out below.')}
            </div>

            <Section title={tc('1. About the Service')}>
              <p>{tc('Tony Kansai Guide ("we", "us", "the guide") provides 100% private, bespoke guided tour experiences in the Kansai region of Japan, including but not limited to Osaka, Kyoto, Nara, Kobe, Himeji and Kōyasan. Tours are conducted personally by Tony Hanma or by one of our approved guides (Johnny Coletta, Larion).')}</p>
              <p className="mt-2">{tc('All tours are private — your group only. We do not operate shared or group tours with other guests.')}</p>
            </Section>

            <Section title={tc('2. Booking Process')}>
              <p>{tc('Bookings are made directly via WhatsApp. A booking is confirmed only when both parties have agreed on the tour date, time, meeting point, and price, and the client has received a written confirmation from the guide.')}</p>
              <p className="mt-2">{tc('No automated booking system or online payment is in place. Payment arrangements are agreed individually during the booking conversation.')}</p>
            </Section>

            <Section title={tc('3. Pricing and Payment')}>
              <p>
                {tc("All prices are quoted per group, not per person, unless explicitly stated otherwise. Prices cover the guide's time and expertise for the agreed duration. The following are")}{' '}
                <strong className="text-white/80">{tc('not included')}</strong> {tc('unless specifically confirmed in writing:')}
              </p>
              <ul className="mt-2 space-y-1 list-none">
                <Li label={tc('Transport')}>{tc('Train, bus, taxi or other transport costs are paid by the client directly.')}</Li>
                <Li label={tc('Entry fees')}>{tc('Temple, museum or attraction admission fees are paid by the client.')}</Li>
                <Li label={tc('Food and drink')}>{tc("All meals, tastings and drinks are at the client's own expense.")}</Li>
                <Li label={tc('Tips')}>{tc("Gratuities are entirely at the client's discretion and never expected.")}</Li>
              </ul>
              <p className="mt-3">{tc('Payment method (cash, bank transfer, etc.) is agreed at the time of booking. We reserve the right to request a deposit for tours booked more than 30 days in advance.')}</p>
            </Section>

            <Section title={tc('4. Cancellation Policy')}>
              <p>{tc('We understand that plans change. Our cancellation terms are as follows:')}</p>
              <div className="mt-3 space-y-2">
                <div className="flex gap-3 items-start">
                  <span className="w-28 flex-shrink-0 text-japan-gold font-medium">{tc('72 h or more')}</span>
                  <span>{tc('Full refund of any deposit paid. No charge.')}</span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-28 flex-shrink-0 text-japan-orange font-medium">{tc('48 – 72 h')}</span>
                  <span>{tc('50% of the agreed tour price is charged.')}</span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-28 flex-shrink-0 text-japan-red font-medium">{tc('Less than 24 h')}</span>
                  <span>{tc('Full tour price is charged. No refund.')}</span>
                </div>
              </div>
              <p className="mt-3">{tc('Cancellations must be communicated directly via WhatsApp. The time of the WhatsApp message is used to determine the notice period.')}</p>
              <p className="mt-2">{tc('In the rare event that we must cancel (illness, force majeure, extreme weather), a full refund of any deposit will be issued and we will offer to reschedule at no extra cost.')}</p>
            </Section>

            <Section title={tc('5. Meeting and Punctuality')}>
              <p>{tc('The meeting point and start time are agreed at the time of booking. If a client is more than 30 minutes late without prior notice, we reserve the right to treat the tour as a no-show and apply the full cancellation fee.')}</p>
              <p className="mt-2">{tc('We are not responsible for delays or missed connections caused by public transport, traffic, or circumstances outside our control.')}</p>
            </Section>

            <Section title={tc('6. Health, Safety and Conduct')}>
              <p>{tc('Clients participate in all activities at their own risk. Tour routes may include walking on uneven terrain, stairs, or steep paths. Please inform us of any mobility limitations or medical conditions when booking so we can adapt the itinerary.')}</p>
              <p className="mt-2">{tc("We reserve the right to refuse service or end a tour without refund if a client's behaviour is disruptive, disrespectful to local culture or religious sites, or poses a risk to themselves or others.")}</p>
              <p className="mt-2">{tc('Japanese customs and temple/shrine etiquette will be explained during the tour. Clients are expected to follow guidance given by the guide on-site.')}</p>
            </Section>

            <Section title={tc('7. Photography and Privacy')}>
              <p>{tc('You are welcome to photograph and film throughout the tour for personal use. Some sacred sites may restrict photography — your guide will advise you on the spot.')}</p>
              <p className="mt-2">{tc('We may occasionally photograph tour moments for use on our website or social media. If you prefer not to appear in any published photos, please let us know at the start of the tour and we will respect that preference entirely.')}</p>
            </Section>

            <Section title={tc('8. Limitation of Liability')}>
              <p>{tc('Tony Kansai Guide acts as a private guide service and is not a licensed travel agency. We are not responsible for loss, theft, injury, or damage to property during any tour.')}</p>
              <p className="mt-2">{tc('We strongly recommend all clients obtain comprehensive travel insurance before travelling to Japan, covering medical expenses, personal liability, and trip cancellation.')}</p>
              <p className="mt-2">{tc('Our maximum liability in any circumstances shall not exceed the total amount paid for the tour in question.')}</p>
            </Section>

            <Section title={tc('9. Changes to the Tour')}>
              <p>{tc('Itineraries are suggestions, not fixed contracts. The guide may adapt the route on the day due to weather, crowds, opening hours, or client preference. This flexibility is a feature of private guiding, not a deficiency.')}</p>
              <p className="mt-2">{tc('Significant changes requested by the client on the day (e.g. adding a full-day stop not in the original plan) may incur additional fees, agreed verbally at the time.')}</p>
            </Section>

            <Section title={tc('10. Governing Law')}>
              <p>{tc('These terms are governed by the laws of Japan. Any disputes shall be resolved first through good-faith negotiation via WhatsApp. If resolution cannot be reached, disputes shall be subject to the jurisdiction of the courts of Osaka, Japan.')}</p>
            </Section>

            <Section title={tc('11. Contact')}>
              <p>{tc('Questions about these terms? Reach us directly:')}</p>
              <p className="mt-2">
                <a href={CONTACT_WA} target="_blank" rel="noopener noreferrer" className="text-japan-red">
                  <span className="ltr-num">WhatsApp +34 634 193 106</span>
                </a>
              </p>
            </Section>

            <div className="border-t border-white/8 pt-8 mt-8">
              <p className="text-xs font-semibold text-japan-red uppercase tracking-widest mb-6">⛰️ {tc('Hiking Guide — additional terms')}</p>

              <Section title={tc('12. Mountain guiding service')}>
                <p>{tc('Hiking routes are led personally by Tony Hanma as a private mountain guide. We are not a certified climbing company nor a licensed adventure-sports operator. The service consists of accompaniment, route-finding and narration of the places visited.')}</p>
                <p className="mt-2">{tc('Each route states its difficulty grade (Easy / Moderate / Hard / Technical / Expert Only). The client is responsible for honestly assessing their own fitness before booking. If there is any medical doubt, consult your doctor before confirming.')}</p>
              </Section>

              <Section title={tc('13. Mountain safety and disclaimer')}>
                <p>{tc('Hiking routes carry inherent risks: uneven ground, loose rock, steep slopes, sun exposure, rain, fog or extreme cold. By confirming the booking the client accepts and understands these risks.')}</p>
                <div className="mt-3 space-y-1.5">
                  <Li label={tc('Fitness')}>{tc('The client confirms they are in adequate physical condition for the route booked.')}</Li>
                  <Li label={tc('Equipment')}>{tc('The client is responsible for bringing the gear listed on the route page (hiking footwear, water, clothing layers, etc.).')}</Li>
                  <Li label={tc('Emergencies')}>{tc('In a mountain emergency the Japanese emergency numbers will be called (110 police / 119 ambulance). The client bears any rescue costs incurred.')}</Li>
                  <Li label={tc('Insurance')}>{tc('We strongly recommend taking out travel insurance with mountain-rescue cover before attempting any route.')}</Li>
                </div>
                <p className="mt-3">{tc('Tony Kansai Guide accepts no liability for injury, accident, loss of personal belongings or emergency situations occurring during or after a hiking route.')}</p>
              </Section>

              <Section title={tc('14. Cancellation due to weather')}>
                <p>{tc('Hiking routes may be cancelled or modified because of adverse weather (storm, heavy snow, typhoon warning, trails closed by the authorities). In those cases:')}</p>
                <div className="mt-2 space-y-2">
                  <div className="flex gap-3 items-start">
                    <span className="w-36 flex-shrink-0 text-japan-gold font-medium">{tc('Weather cancellation')}</span>
                    <span>{tc('Full refund of any deposit paid. No penalty.')}</span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="w-36 flex-shrink-0 text-japan-orange font-medium">{tc('Alternative route')}</span>
                    <span>{tc('If both parties agree on an alternative route of similar grade, the original price stands.')}</span>
                  </div>
                </div>
                <p className="mt-2">{tc('The decision to cancel for safety reasons rests with the guide. Their judgement prevails over the client’s preference.')}</p>
              </Section>

              <Section title={tc('15. Contracts and booking confirmation')}>
                <p>{tc('For high-grade hiking bookings (Hard, Technical, Expert Only) or groups of more than 4 people, a written service contract may be requested. It states: client name, route, date, agreed price, payment method, and the signed disclaimer.')}</p>
                <p className="mt-2">{tc('The contract is generated from our internal panel and sent to the client by WhatsApp as a PDF before the tour. It can be signed digitally (WhatsApp) or on paper on the day.')}</p>
              </Section>

              <Section title={tc('16. Payment methods and deposits')}>
                <p>{tc('We accept the following payment methods for hiking services:')}</p>
                <div className="mt-3 space-y-1.5">
                  <Li label={tc('Cash')}>{tc('Japanese yen (JPY) on the day of the tour. Preferred method.')}</Li>
                  <Li label="Wise">{tc('International transfer via Wise to a EUR/GBP/USD account. Details provided on confirming the booking.')}</Li>
                  <Li label={tc('Bank transfer')}>{tc('Available for bookings made more than 7 days in advance.')}</Li>
                  <Li label={tc('Card')}>{tc('On prior request, subject to availability.')}</Li>
                </div>
                <p className="mt-3">
                  {tc('For Expert Only or Consultation routes we may require a')}{' '}
                  <strong className="text-white/80">{tc('non-refundable 30% deposit')}</strong> {tc('on confirming the booking, to cover the route planning done beforehand.')}
                </p>
                <p className="mt-2">{tc('Prices shown on the site are indicative. The final price is agreed by WhatsApp and confirmed in writing before the tour.')}</p>
              </Section>
            </div>

            <LegalFooterLinks current="/terms" />
          </motion.div>
        </div>
      </section>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-white mb-2">{title}</h2>
      {children}
    </div>
  )
}

function Li({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="text-japan-red font-medium flex-shrink-0">{label}:</span>
      <span>{children}</span>
    </li>
  )
}
