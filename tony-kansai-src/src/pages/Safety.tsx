import { ShieldCheck } from 'lucide-react'
import { LegalPage, Section, Li, Warning } from '../components/LegalPage'
import { useLanguage } from '../contexts/LanguageContext'

const UPDATED = 'September 2026'

export default function Safety() {
  const { tc } = useLanguage()

  return (
    <LegalPage
      title={tc('Safety & Insurance')}
      description={tc('How Tony Kansai Guide handles safety on tours and mountain routes: emergency procedure, what the guide carries, what insurance you need, and when a route is called off.')}
      path="/safety"
      icon={<ShieldCheck size={18} className="text-japan-red" />}
      updated={UPDATED}
      intro={tc('Walking in the Japanese mountains is safe when it is done properly and dangerous when it is not. This page says exactly what we do, what you have to do, and where the line is.')}
    >
      <Section title={tc('1. Who is responsible for what')}>
        <p>{tc('Tony Kansai Guide is a private guiding service, not a licensed travel agency and not a certified mountaineering company. The guide is responsible for route choice, pacing, navigation and for calling the day off. You are responsible for arriving in the condition and with the equipment the route requires.')}</p>
        <p className="mt-2">{tc('Nothing on this page limits your rights under Japanese consumer law, and nothing in it makes us responsible for risks that are inherent to walking in the mountains.')}</p>
      </Section>

      <Section title={tc('2. Before you book')}>
        <ul className="mt-1 space-y-2 list-none">
          <Li label={tc('Tell us the truth about fitness')}>{tc('Every route states a grade. Overstating what you can do is the single most common cause of trouble on a mountain, and it puts the guide at risk too.')}</Li>
          <Li label={tc('Declare medical conditions')}>{tc('Heart conditions, asthma, diabetes, recent surgery, pregnancy, knee or ankle injuries, severe allergies. We adapt the plan; we do not share it with anyone.')}</Li>
          <Li label={tc('Medication')}>{tc('Bring what you need for the whole day plus a margin, and tell the guide where you keep it.')}</Li>
          <Li label={tc('Children')}>{tc('Under-18s are welcome on city tours and on Easy routes, always accompanied by a parent or guardian who remains responsible for them. Hard, Technical and Expert Only routes are 18+.')}</Li>
        </ul>
      </Section>

      <Section title={tc('3. What the guide carries')}>
        <ul className="mt-1 space-y-1.5 list-none">
          <Li label={tc('First aid')}>{tc('A kit sized for the route, including a blister kit, bandages and an emergency blanket.')}</Li>
          <Li label={tc('Navigation')}>{tc('Offline maps of the whole area, a charged phone and a power bank. Mobile coverage is not assumed.')}</Li>
          <Li label={tc('Communication')}>{tc('Emergency numbers, the local mountain rescue contact, and your emergency contact if you have given it.')}</Li>
          <Li label={tc('Light')}>{tc('A headlamp on every route, and spare headlamps on the tunnel and evening routes.')}</Li>
          <Li label={tc('Water')}>{tc('A reserve above what the guide needs, for the person who runs out first.')}</Li>
        </ul>
      </Section>

      <Section title={tc('4. In an emergency')}>
        <p>{tc('Japan has two emergency numbers and both answer 24 hours a day:')}</p>
        <div className="mt-3 space-y-2">
          <div className="flex gap-3 items-start">
            <span className="w-16 flex-shrink-0 ltr-num text-japan-red font-bold text-base">110</span>
            <span>{tc('Police. Also the number for a lost person or a mountain rescue.')}</span>
          </div>
          <div className="flex gap-3 items-start">
            <span className="w-16 flex-shrink-0 ltr-num text-japan-orange font-bold text-base">119</span>
            <span>{tc('Ambulance and fire. Say "kyūkyū" for ambulance.')}</span>
          </div>
        </div>
        <p className="mt-3">{tc('The guide makes the call and speaks Japanese to the operator. If the group has to split, nobody is ever left alone: we stay together and walk out together, or we wait together.')}</p>
        <Warning>
          {tc('Mountain rescue in Japan is not free. A helicopter evacuation by a private operator can run into millions of yen, and the cost falls on the person rescued. This is the single strongest reason to travel insured.')}
        </Warning>
      </Section>

      <Section title={tc('5. Insurance')}>
        <p>{tc('We require every guest to hold travel insurance valid in Japan for the dates of the tour. For city tours, standard travel cover is enough. For any mountain route, the policy must also cover:')}</p>
        <ul className="mt-3 space-y-1.5 list-none">
          <Li label={tc('Medical treatment')}>{tc('Hospital care and repatriation.')}</Li>
          <Li label={tc('Mountain rescue')}>{tc('Search, rescue and helicopter evacuation. Many standard policies exclude this — check the wording, not the summary.')}</Li>
          <Li label={tc('Hiking altitude')}>{tc('Some policies cap covered hiking at a given altitude. Our highest route reaches 1,125 m.')}</Li>
          <Li label={tc('Trip cancellation')}>{tc('So that a cancellation on your side is not also a financial loss.')}</Li>
        </ul>
        <p className="mt-3">{tc('The guide may ask to see proof of cover before a Hard, Technical or Expert Only route, and may decline to run it without one.')}</p>
      </Section>

      <Section title={tc('6. Weather, and who decides')}>
        <p>{tc('The decision to change or cancel a route for safety belongs to the guide, and it is final. It is not a commercial decision and it is not open to negotiation on the day.')}</p>
        <ul className="mt-3 space-y-1.5 list-none">
          <Li label={tc('Typhoon or storm warning')}>{tc('Cancelled. Full refund of any deposit, or a new date at no cost.')}</Li>
          <Li label={tc('Heavy rain')}>{tc('Rock and roots turn lethal on steep ground. Usually swapped for a lower route or a city day.')}</Li>
          <Li label={tc('Snow and ice')}>{tc('December to March, crampons are mandatory on the high routes. Without them the route is not run.')}</Li>
          <Li label={tc('Heat')}>{tc('July and August in Kansai are genuinely dangerous. We start at dawn, shorten the day, or move it.')}</Li>
        </ul>
      </Section>

      <Section title={tc('7. On the mountain')}>
        <ul className="mt-1 space-y-1.5 list-none">
          <Li label={tc('Stay in sight')}>{tc('Never go ahead of the guide on an unmarked route. If you need to stop, say so — we stop.')}</Li>
          <Li label={tc('If you get separated')}>{tc('Stay where you are. Do not descend to look for the path. Call the guide and wait to be found.')}</Li>
          <Li label={tc('Wildlife')}>{tc('Wild boar, macaques and deer are common. Keep food packed, never feed anything, do not run, and give any animal a wide berth.')}</Li>
          <Li label={tc('Sacred ground')}>{tc('Shrines and temples on the route are working religious sites. The guide will say where photography stops and silence starts.')}</Li>
        </ul>
      </Section>

      <Section title={tc('8. Group size')}>
        <p>{tc('City tours run up to the group size stated in each package. Mountain routes are capped at six people, and Technical or Expert Only routes at three, because that is the number one guide can keep safe on difficult ground.')}</p>
      </Section>

      <Section title={tc('9. Reporting a problem')}>
        <p>{tc('If something goes wrong — during the tour or after it — tell us directly on WhatsApp. We answer every message ourselves, usually within a few hours, and we would rather hear it from you than read it in a review.')}</p>
      </Section>
    </LegalPage>
  )
}
