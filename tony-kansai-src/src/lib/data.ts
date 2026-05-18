export const WHATSAPP = 'https://wa.me/34634193106'
export const WHATSAPP_NUMBER = '+34 634 193 106'
export const EMAIL = 'tony@kansaiguide.jp'

export const TOURS = [
  {
    id: 'osaka-kyoto',
    title: 'Osaka & Kyoto',
    subtitle: 'City Experience',
    duration: 'Full Day · 10h',
    price: '¥68,000',
    gradient: 'from-rose-900/80 via-red-800/60 to-orange-900/80',
    accent: '#E53030',
    badge: 'Most Popular',
    emoji: '🏯',
    description: 'Dive into the urban soul of Japan. Skip tourist crowds and discover the hidden alleys, secret shrines, and authentic flavors that locals treasure. Tony takes you behind the famous facades to the living culture within.',
    longDescription: 'Begin the day at dawn in Fushimi Inari before the crowds arrive — thousands of vermillion torii gates leading up a sacred mountain, just you and the birdsong. Then descend into Kyoto\'s Nishiki Market, where 400-year-old vendors still sell the same pickles and fish their great-grandparents did. After lunch in a hidden machiya townhouse, take the train to Osaka for Dotonbori street food with Tony guiding each bite and its story. End the evening at a standing izakaya that has no English menu and no tourist prices.',
    highlights: [
      'Fushimi Inari at dawn (before crowds)',
      'Nishiki Market — the "Kyoto Kitchen"',
      'Hidden machiya townhouse lunch',
      'Dotonbori street food tour',
      'Local izakaya dinner (no English menu)',
      'Gion evening walk',
    ],
    includes: ['Private guide all day', 'Transit navigation', 'IC card top-up assistance', 'Restaurant bookings', 'Cultural commentary'],
    meetingPoint: 'Kyoto Station Central Exit',
    languages: ['EN', 'ES', 'РУ', 'CS', 'AR'],
  },
  {
    id: 'trails-peaks',
    title: 'Trails & Peaks',
    subtitle: 'Mountain & Nature',
    duration: 'Full Day · 9h',
    price: '¥68,000',
    gradient: 'from-emerald-900/80 via-teal-800/60 to-cyan-900/80',
    accent: '#10B981',
    badge: 'Adventure',
    emoji: '⛰️',
    description: 'Escape into Japan\'s sacred wilderness. Walk ancient pilgrimage routes, breathe mountain air, and find the spiritual calm that has drawn seekers for centuries.',
    longDescription: 'The Kurama mountain trail north of Kyoto was walked by emperors seeking enlightenment. Today it remains largely unchanged — cedar forests, moss-covered stone lanterns, mountain shrines smelling of incense. Tony walks the full trail with you, sharing the folklore of each landmark. Descend through the bamboo groves of Arashiyama, stopping at a hidden waterfall meditation spot that no guidebook mentions. The day ends with a traditional tea ceremony performed in a garden that overlooks the hills you just crossed.',
    highlights: [
      'Kurama mountain pilgrimage trail',
      'Ancient cedar forest shrines',
      'Hidden waterfall meditation spot',
      'Arashiyama bamboo grove (off-hour)',
      'Traditional tea ceremony in nature',
      'Monkey park optional stop',
    ],
    includes: ['Private guide all day', 'Trail navigation', 'Forest shrine rituals explanation', 'Tea ceremony included', 'Packed snack recommendation'],
    meetingPoint: 'Kurama Station Exit',
    languages: ['EN', 'ES', 'РУ', 'CS', 'AR'],
  },
  {
    id: 'multi-language',
    title: 'Multi-Language Tour',
    subtitle: 'Flexible · Any Area',
    duration: 'Half Day or Full Day',
    price: 'From ¥55,000',
    gradient: 'from-amber-900/80 via-yellow-800/60 to-orange-900/80',
    accent: '#D4A847',
    badge: '5 Languages',
    emoji: '🌏',
    description: 'Experience Japan in your own language. Tony speaks 5 languages fluently — every story, joke, and historical nuance comes alive in yours.',
    longDescription: 'Language shapes how we understand a place. When Tony guides in your native tongue — whether English, Spanish, Russian, Czech, or Arabic — the experience changes completely. Subtle humor, untranslatable concepts, and the true emotional weight of history all come through. This tour is fully customizable: tell Tony your interests (food, architecture, history, anime, nature, photography) and he builds the day around you. Completely private, completely personal.',
    highlights: [
      'Fully customizable itinerary',
      'Guided in EN · ES · РУ · CS · AR',
      'Any area of Kansai',
      'Solo, couples, or groups',
      'Flexible start/end times',
      'Insider recommendations only',
    ],
    includes: ['Private guide', 'Flexible route', 'All ages welcome', 'Custom pace', 'WhatsApp planning support'],
    meetingPoint: 'Agreed upon booking',
    languages: ['EN', 'ES', 'РУ', 'CS', 'AR'],
  },
]

export const PRICING = [
  {
    id: 'essential',
    name: 'Essential',
    subtitle: 'Half Day',
    price: '¥55,000',
    priceUSD: '≈ $370',
    duration: '4–5 hours',
    features: ['Up to 4 guests', 'One city or area', 'Transit assistance', 'Flexible route', 'All 5 languages'],
    cta: 'Book Essential',
    hot: false,
  },
  {
    id: 'signature',
    name: 'Signature',
    subtitle: 'Full Day',
    price: '¥68,000',
    priceUSD: '≈ $455',
    duration: '8–10 hours',
    features: ['Up to 6 guests', 'Multiple areas', 'Private transport option', 'Lunch recommendation', 'Cultural deep-dives', 'Evening extension option'],
    cta: 'Book Signature',
    hot: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    subtitle: 'Multi-Day',
    price: '¥120,000',
    priceUSD: '≈ $800',
    duration: '2+ full days',
    features: ['Unlimited guests', 'All Kansai region', 'Full itinerary design', 'Private transport', 'Restaurant reservations', 'Priority WhatsApp support', '24h availability'],
    cta: 'Book Premium',
    hot: false,
  },
]

export const FAQS = [
  { q: 'Are tours truly private?', a: 'Yes — 100% private. Your booking is exclusively yours. No other groups, no shared coaches. Just you and Tony with full attention on your experience.' },
  { q: 'How far in advance should I book?', a: 'Tony recommends booking 2–3 weeks ahead for weekends and peak seasons (March–May cherry blossom, October–November autumn). Weekday slots are often available 1 week out.' },
  { q: 'What is the cancellation policy?', a: 'Full refund for cancellations 72+ hours before the tour. 50% refund within 48 hours. No refund within 24 hours. Tony is flexible with reschedules — just reach out via WhatsApp.' },
  { q: 'Is transport included?', a: 'Tony assists with all transit navigation and IC card top-up. Private vehicle options are available for Signature and Premium packages. Public transit is used for the authentic local experience.' },
  { q: 'Which languages does Tony guide in?', a: 'Tony guides fluently in English, Spanish, Russian, Czech, and Arabic — all at native-level proficiency. No broken phrases, no confusion, just natural conversation.' },
  { q: 'Can Tony help with restaurant reservations?', a: 'Absolutely. Tony has relationships with local restaurants — including hidden spots that don\'t appear on any app. He can book in advance and even pre-order special dishes for you.' },
  { q: 'What areas does Tony cover?', a: 'Tony covers the full Kansai region: Osaka, Kyoto, Nara, Kobe, Himeji, Nara, Arashiyama, Kurama, Fushimi, and more. Multi-day tours can extend further.' },
]

export const STATS = [
  { value: '3', label: 'Prefectures', icon: '📍' },
  { value: '200+', label: 'Tours Completed', icon: '⭐' },
  { value: '5', label: 'Languages', icon: '🌐' },
  { value: '100%', label: 'Private', icon: '🔒' },
]

export const LANGUAGES = [
  { flag: '🇬🇧', name: 'English', code: 'EN' },
  { flag: '🇪🇸', name: 'Spanish', code: 'ES' },
  { flag: '🇷🇺', name: 'Russian', code: 'РУ' },
  { flag: '🇨🇿', name: 'Czech', code: 'CS' },
  { flag: '🇸🇦', name: 'Arabic', code: 'AR' },
]
