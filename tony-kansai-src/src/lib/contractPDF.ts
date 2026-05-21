export type ContractLang = 'en' | 'es' | 'ru' | 'cs'

export interface ContractBookingData {
  clientName?: string
  tour?: string
  tourDate?: string
  guests?: number
  guide?: string
  totalPrice?: number
}

const LANG_META: Record<ContractLang, { label: string; flag: string; htmlLang: string }> = {
  en: { label: 'English',  flag: '🇬🇧', htmlLang: 'en' },
  es: { label: 'Español',  flag: '🇪🇸', htmlLang: 'es' },
  ru: { label: 'Русский',  flag: '🇷🇺', htmlLang: 'ru' },
  cs: { label: 'Čeština',  flag: '🇨🇿', htmlLang: 'cs' },
}
export const CONTRACT_LANGS = Object.entries(LANG_META) as [ContractLang, typeof LANG_META['en']][]

interface Template {
  title: string
  subtitle: string
  agreementDate: string
  clientLabel: string
  tourLabel: string
  tourDateLabel: string
  guestsLabel: string
  guideLabel: string
  priceLabel: string
  sections: { title: string; body: string }[]
  sigClientLabel: string
  sigNameLabel: string
  sigGuideLabel: string
  sigDateLabel: string
  returnNote: string
  footer: string
}

const T: Record<ContractLang, Template> = {

  // ── ENGLISH ──────────────────────────────────────────────────────────────
  en: {
    title: 'PRIVATE TOUR SERVICE AGREEMENT',
    subtitle: 'Tony Hanma Private Kansai Tours',
    agreementDate: 'Agreement Date',
    clientLabel: 'Client',
    tourLabel: 'Tour',
    tourDateLabel: 'Tour Date',
    guestsLabel: 'Participants',
    guideLabel: 'Guide',
    priceLabel: 'Agreed Price',
    sections: [
      {
        title: '1. Service',
        body: 'The Guide agrees to provide a 100% private guided tour in the Kansai region of Japan as described above. This booking is exclusively private — no other groups or individuals will join.',
      },
      {
        title: '2. Health, Safety & Liability Waiver',
        body: 'Tours involve walking, stairs, and varied terrain including natural environments. Weather and ground conditions may vary. By signing this agreement the Client confirms:\n\n(a) They are in adequate physical health to participate in the scheduled activities.\n\n(b) They accept full personal responsibility for any injury, accident, illness, loss of personal belongings, or damage to property occurring during or in connection with the tour.\n\n(c) Tony Hanma Private Kansai Tours, its guides and associates, accept NO liability whatsoever for personal injury, accident, medical emergency, loss, theft, or damage of any kind arising before, during, or after the tour.',
      },
      {
        title: '3. Travel Insurance (Mandatory)',
        body: 'The Client MUST hold valid comprehensive travel insurance prior to commencement of the tour, covering at minimum: medical emergencies, emergency evacuation, personal accident, and trip cancellation.\n\nTony Hanma Private Kansai Tours accepts NO responsibility for any costs or consequences arising from the Client\'s failure to obtain or maintain adequate insurance coverage.',
      },
      {
        title: '4. Cancellation & Refund Policy',
        body: '• Cancellation 72+ hours before tour start: full refund.\n• Cancellation 24–72 hours before tour start: 50% refund.\n• Cancellation less than 24 hours before tour start: no refund.\n• No-show on the day: no refund.\n\nRescheduling may be arranged subject to availability when requested with sufficient advance notice. Rescheduling within 24 hours of the tour is treated as a cancellation.',
      },
      {
        title: '5. Weather & Force Majeure',
        body: 'Tours may be modified, shortened, or cancelled due to extreme weather (typhoon, heavy rain, extreme heat), natural disasters, government-imposed restrictions, transport disruptions, or other circumstances beyond our reasonable control. In such cases a full refund or complimentary reschedule will be offered at the Client\'s choice.',
      },
      {
        title: '6. Code of Conduct',
        body: 'The Client agrees to respect Japanese laws, cultural norms, temple and shrine regulations, and the Guide\'s safety instructions at all times. The consumption of alcohol or other substances that impair behaviour before or during the tour is not permitted.\n\nThe Guide reserves the right to terminate a tour immediately if the Client\'s behaviour endangers others, causes distress, or violates local regulations or religious customs. No refund will be issued in such cases.',
      },
      {
        title: '7. Photography & Privacy',
        body: 'The Guide may take photographs and short videos during the tour for the Client\'s personal use as a courtesy. The Client consents to being photographed in a tour context. Any commercial use of images featuring the Guide requires prior written consent from Tony Hanma Private Kansai Tours.',
      },
      {
        title: '8. Payment Terms',
        body: 'Payment is due on the terms agreed at the time of booking. Accepted methods: cash (JPY), bank transfer, or Wise. Non-payment of the agreed amount entitles the Guide to cancel services without refund.\n\nAll prices are in Japanese Yen (JPY) unless otherwise agreed in writing.',
      },
    ],
    sigClientLabel: 'Client Signature',
    sigNameLabel: 'Print Name',
    sigGuideLabel: 'Guide — Tony Hanma Private Kansai Tours',
    sigDateLabel: 'Date',
    returnNote: 'Please sign and return this document via WhatsApp (+34 634 193 106) before your tour date.',
    footer: 'Tony Hanma Private Kansai Tours · WhatsApp +34 634 193 106 · tonykansaiguide.surge.sh',
  },

  // ── SPANISH ───────────────────────────────────────────────────────────────
  es: {
    title: 'ACUERDO DE SERVICIO DE TOUR PRIVADO',
    subtitle: 'Tony Hanma Private Kansai Tours',
    agreementDate: 'Fecha del acuerdo',
    clientLabel: 'Cliente',
    tourLabel: 'Tour',
    tourDateLabel: 'Fecha del tour',
    guestsLabel: 'Participantes',
    guideLabel: 'Guía',
    priceLabel: 'Precio acordado',
    sections: [
      {
        title: '1. Servicio',
        body: 'El Guía se compromete a prestar un servicio de tour guiado 100% privado en la región de Kansai, Japón, tal y como se describe más arriba. Esta reserva es exclusivamente privada — ningún otro grupo o persona se unirá al tour.',
      },
      {
        title: '2. Salud, Seguridad y Exención de Responsabilidad',
        body: 'Los tours implican caminar, subir escaleras y moverse por terrenos variados, incluyendo entornos naturales. Las condiciones meteorológicas y del terreno pueden variar. Al firmar este acuerdo, el Cliente confirma:\n\n(a) Que se encuentra en un estado de salud físico adecuado para participar en las actividades programadas.\n\n(b) Que asume plena responsabilidad personal por cualquier lesión, accidente, enfermedad, pérdida de pertenencias personales o daño a la propiedad que ocurra durante o en relación con el tour.\n\n(c) Tony Hanma Private Kansai Tours, sus guías y colaboradores NO aceptan responsabilidad alguna por lesiones personales, accidentes, emergencias médicas, pérdidas, robos o daños de cualquier naturaleza, antes, durante o después del tour.',
      },
      {
        title: '3. Seguro de Viaje (Obligatorio)',
        body: 'El Cliente DEBE disponer de un seguro de viaje completo y en vigor antes del comienzo del tour, que cubra como mínimo: emergencias médicas, evacuación de emergencia, accidentes personales y cancelación del viaje.\n\nTony Hanma Private Kansai Tours NO acepta ninguna responsabilidad por costes o consecuencias derivadas de la ausencia o insuficiencia de cobertura de seguro por parte del Cliente.',
      },
      {
        title: '4. Política de Cancelación y Reembolso',
        body: '• Cancelación con más de 72 horas de antelación: reembolso completo.\n• Cancelación entre 24 y 72 horas antes del inicio: reembolso del 50%.\n• Cancelación con menos de 24 horas de antelación: sin reembolso.\n• No presentación el día del tour: sin reembolso.\n\nEl cambio de fecha puede gestionarse sujeto a disponibilidad si se solicita con suficiente antelación. Los cambios solicitados dentro de las 24 horas previas al tour se tratarán como cancelación.',
      },
      {
        title: '5. Condiciones Meteorológicas y Fuerza Mayor',
        body: 'Los tours podrán modificarse, acortarse o cancelarse por condiciones meteorológicas extremas (tifón, lluvias intensas, calor extremo), desastres naturales, restricciones gubernamentales, interrupciones del transporte u otras circunstancias fuera de nuestro control razonable. En tal caso se ofrecerá reembolso completo o cambio de fecha sin cargo, a elección del Cliente.',
      },
      {
        title: '6. Código de Conducta',
        body: 'El Cliente se compromete a respetar en todo momento las leyes japonesas, las normas culturales, las regulaciones de templos y santuarios, y las instrucciones de seguridad del Guía. El consumo de alcohol u otras sustancias que alteren el comportamiento antes o durante el tour no está permitido.\n\nEl Guía se reserva el derecho a dar por terminado el tour de forma inmediata si el comportamiento del Cliente pone en peligro a otras personas, causa molestias o infringe la normativa local o las costumbres religiosas. No se realizará reembolso en tales casos.',
      },
      {
        title: '7. Fotografía y Privacidad',
        body: 'El Guía podrá tomar fotografías y vídeos cortos durante el tour para uso personal del Cliente, como cortesía. El Cliente consiente ser fotografiado en el contexto del tour. El uso comercial de imágenes en las que aparezca el Guía requiere consentimiento previo por escrito de Tony Hanma Private Kansai Tours.',
      },
      {
        title: '8. Condiciones de Pago',
        body: 'El pago se realizará en los términos acordados en el momento de la reserva. Métodos aceptados: efectivo (JPY), transferencia bancaria o Wise. El impago del importe acordado faculta al Guía a cancelar los servicios sin reembolso.\n\nTodos los precios se expresan en yenes japoneses (JPY) salvo acuerdo escrito en contrario.',
      },
    ],
    sigClientLabel: 'Firma del Cliente',
    sigNameLabel: 'Nombre en mayúsculas',
    sigGuideLabel: 'Guía — Tony Hanma Private Kansai Tours',
    sigDateLabel: 'Fecha',
    returnNote: 'Por favor, firma y devuelve este documento por WhatsApp (+34 634 193 106) antes de la fecha del tour.',
    footer: 'Tony Hanma Private Kansai Tours · WhatsApp +34 634 193 106 · tonykansaiguide.surge.sh',
  },

  // ── RUSSIAN ───────────────────────────────────────────────────────────────
  ru: {
    title: 'ДОГОВОР ОБ ОКАЗАНИИ УСЛУГ ЧАСТНОЙ ЭКСКУРСИИ',
    subtitle: 'Tony Hanma Private Kansai Tours',
    agreementDate: 'Дата соглашения',
    clientLabel: 'Клиент',
    tourLabel: 'Экскурсия',
    tourDateLabel: 'Дата экскурсии',
    guestsLabel: 'Участники',
    guideLabel: 'Гид',
    priceLabel: 'Согласованная цена',
    sections: [
      {
        title: '1. Услуги',
        body: 'Гид обязуется провести 100% частную экскурсию по региону Кансай в Японии в соответствии с условиями, указанными выше. Данное бронирование является исключительно частным — к экскурсии не присоединятся никакие другие группы или лица.',
      },
      {
        title: '2. Здоровье, безопасность и отказ от ответственности',
        body: 'Экскурсии предполагают ходьбу, преодоление ступеней и передвижение по разнообразному рельефу, включая природные территории. Погодные и дорожные условия могут меняться. Подписывая настоящее соглашение, Клиент подтверждает:\n\n(а) Наличие достаточного физического здоровья для участия в запланированных мероприятиях.\n\n(б) Принятие полной личной ответственности за любые травмы, несчастные случаи, заболевания, утрату личного имущества или ущерб имуществу, возникшие в ходе экскурсии или в связи с ней.\n\n(в) Компания Tony Hanma Private Kansai Tours, её гиды и сотрудники НЕ несут никакой ответственности за телесные повреждения, несчастные случаи, медицинские экстренные ситуации, потери, кражи или ущерб любого рода, возникшие до, во время или после экскурсии.',
      },
      {
        title: '3. Туристическое страхование (обязательно)',
        body: 'До начала экскурсии Клиент ОБЯЗАН иметь действующий комплексный страховой полис, покрывающий как минимум: медицинские экстренные случаи, экстренную эвакуацию, несчастные случаи и отмену поездки.\n\nКомпания Tony Hanma Private Kansai Tours НЕ несёт ответственности за расходы или последствия, возникшие вследствие отсутствия или недостаточности страхового покрытия у Клиента.',
      },
      {
        title: '4. Условия отмены и возврата средств',
        body: '• Отмена более чем за 72 часа до начала экскурсии: полный возврат средств.\n• Отмена за 24–72 часа до начала экскурсии: возврат 50%.\n• Отмена менее чем за 24 часа до начала экскурсии: без возврата средств.\n• Неявка в день экскурсии: без возврата средств.\n\nПеренос даты может быть согласован при наличии свободных мест, если запрос поступил заблаговременно. Запрос на перенос, поданный менее чем за 24 часа до экскурсии, расценивается как отмена.',
      },
      {
        title: '5. Погодные условия и форс-мажор',
        body: 'Экскурсии могут быть изменены, сокращены или отменены вследствие экстремальных погодных условий (тайфун, сильные дожди, экстремальная жара), стихийных бедствий, ограничений со стороны властей, перебоев в работе транспорта или иных обстоятельств, находящихся вне нашего разумного контроля. В таких случаях по выбору Клиента будет предложен полный возврат средств или бесплатный перенос на другую дату.',
      },
      {
        title: '6. Правила поведения',
        body: 'Клиент обязуется неукоснительно соблюдать японское законодательство, культурные нормы, правила посещения храмов и святилищ, а также инструкции гида по безопасности. Употребление алкоголя или иных веществ, влияющих на поведение, до или во время экскурсии не допускается.\n\nГид оставляет за собой право немедленно завершить экскурсию, если поведение Клиента создаёт угрозу для других людей, причиняет неудобства или нарушает местное законодательство либо религиозные традиции. В таких случаях возврат средств не производится.',
      },
      {
        title: '7. Фотосъёмка и конфиденциальность',
        body: 'В ходе экскурсии гид может любезно делать фотографии и короткие видеозаписи для личного пользования Клиентом. Клиент соглашается на фотосъёмку в контексте экскурсии. Коммерческое использование изображений, на которых присутствует гид, требует предварительного письменного согласия компании Tony Hanma Private Kansai Tours.',
      },
      {
        title: '8. Условия оплаты',
        body: 'Оплата производится на условиях, согласованных при бронировании. Принимаемые способы оплаты: наличные (иены, JPY), банковский перевод или Wise. Неоплата согласованной суммы даёт гиду право аннулировать услуги без возврата средств.\n\nВсе цены указаны в японских иенах (JPY), если иное не оговорено в письменном виде.',
      },
    ],
    sigClientLabel: 'Подпись клиента',
    sigNameLabel: 'Имя печатными буквами',
    sigGuideLabel: 'Гид — Tony Hanma Private Kansai Tours',
    sigDateLabel: 'Дата',
    returnNote: 'Пожалуйста, подпишите и верните этот документ через WhatsApp (+34 634 193 106) до даты экскурсии.',
    footer: 'Tony Hanma Private Kansai Tours · WhatsApp +34 634 193 106 · tonykansaiguide.surge.sh',
  },

  // ── CZECH ─────────────────────────────────────────────────────────────────
  cs: {
    title: 'SMLOUVA O POSKYTNUTÍ SOUKROMÉ PRŮVODCOVSKÉ SLUŽBY',
    subtitle: 'Tony Hanma Private Kansai Tours',
    agreementDate: 'Datum smlouvy',
    clientLabel: 'Klient',
    tourLabel: 'Výlet',
    tourDateLabel: 'Datum výletu',
    guestsLabel: 'Účastníci',
    guideLabel: 'Průvodce',
    priceLabel: 'Dohodnutá cena',
    sections: [
      {
        title: '1. Služba',
        body: 'Průvodce se zavazuje poskytnout 100% soukromou průvodcovskou službu v regionu Kansai v Japonsku dle výše uvedených podmínek. Toto rezervace je výhradně soukromá — k výletu se nepřipojí žádná jiná skupina ani jednotlivec.',
      },
      {
        title: '2. Zdraví, bezpečnost a vzdání se nároků na náhradu škody',
        body: 'Výlety zahrnují chůzi, schody a pohyb v různorodém terénu včetně přírodního prostředí. Povětrnostní podmínky a stav terénu se mohou měnit. Podpisem této smlouvy klient potvrzuje:\n\n(a) Že je ve vhodném zdravotním a fyzickém stavu pro účast na naplánovaných aktivitách.\n\n(b) Že přebírá plnou osobní odpovědnost za jakékoli zranění, nehody, nemoci, ztráty osobních věcí nebo škody na majetku vzniklé v průběhu výletu nebo v souvislosti s ním.\n\n(c) Společnost Tony Hanma Private Kansai Tours, její průvodci a spolupracovníci NEPŘEBÍRAJÍ žádnou odpovědnost za osobní zranění, nehody, lékařské pohotovosti, ztráty, krádeže ani škody jakéhokoli druhu vzniklé před, během nebo po výletu.',
      },
      {
        title: '3. Cestovní pojištění (povinné)',
        body: 'Před zahájením výletu musí mít klient platné komplexní cestovní pojištění pokrývající minimálně: lékařské pohotovosti, nouzovou evakuaci, úrazové pojištění a storno.\n\nSpolečnost Tony Hanma Private Kansai Tours NEPŘEBÍRÁ žádnou odpovědnost za náklady ani důsledky vzniklé v důsledku nedostatečného pojistného krytí klienta.',
      },
      {
        title: '4. Podmínky zrušení a vrácení peněz',
        body: '• Zrušení více než 72 hodin před začátkem výletu: plné vrácení peněz.\n• Zrušení 24–72 hodin před začátkem výletu: vrácení 50%.\n• Zrušení méně než 24 hodin před začátkem výletu: bez vrácení peněz.\n• Nedostavení se v den výletu: bez vrácení peněz.\n\nPřeložení termínu lze dojednat dle dostupnosti při dostatečném předchozím upozornění. Žádost o přeložení podaná méně než 24 hodin před výletem je považována za zrušení.',
      },
      {
        title: '5. Počasí a vyšší moc',
        body: 'Výlety mohou být upraveny, zkráceny nebo zrušeny z důvodu extrémního počasí (tajfun, silný déšť, extrémní vedro), přírodních katastrof, vládních omezení, výpadků dopravy nebo jiných okolností mimo naši rozumnou kontrolu. V takovém případě bude na výběr klienta nabídnuto plné vrácení peněz nebo bezplatné přeobjednání.',
      },
      {
        title: '6. Kodex chování',
        body: 'Klient se zavazuje po celou dobu respektovat japonské zákony, kulturní normy, pravidla chrámů a svatyní a bezpečnostní pokyny průvodce. Konzumace alkoholu nebo jiných látek ovlivňujících chování před výletem nebo během něj není povolena.\n\nPrůvodce si vyhrazuje právo okamžitě ukončit výlet, pokud chování klienta ohrožuje ostatní, způsobuje problémy nebo porušuje místní předpisy či náboženské zvyky. V takovém případě nevzniká nárok na vrácení peněz.',
      },
      {
        title: '7. Fotografie a soukromí',
        body: 'Průvodce může v průběhu výletu jako laskavost pořizovat fotografie a krátká videa pro osobní potřebu klienta. Klient souhlasí s fotografováním v kontextu výletu. Komerční použití fotografií zobrazujících průvodce vyžaduje předchozí písemný souhlas společnosti Tony Hanma Private Kansai Tours.',
      },
      {
        title: '8. Platební podmínky',
        body: 'Platba je splatná za podmínek dohodnutých při rezervaci. Přijímané způsoby platby: hotovost (JPY), bankovní převod nebo Wise. Nesplnění dohodnuté platby opravňuje průvodce ke zrušení služeb bez vrácení peněz.\n\nVšechny ceny jsou v japonských jenech (JPY), pokud není písemně dohodnuto jinak.',
      },
    ],
    sigClientLabel: 'Podpis klienta',
    sigNameLabel: 'Jméno hůlkovým písmem',
    sigGuideLabel: 'Průvodce — Tony Hanma Private Kansai Tours',
    sigDateLabel: 'Datum',
    returnNote: 'Prosím, podepište a vraťte tento dokument přes WhatsApp (+34 634 193 106) před datem výletu.',
    footer: 'Tony Hanma Private Kansai Tours · WhatsApp +34 634 193 106 · tonykansaiguide.surge.sh',
  },
}

export function generateContract(lang: ContractLang, data?: ContractBookingData): string {
  const t = T[lang]
  const meta = LANG_META[lang]
  const today = new Date().toLocaleDateString(meta.htmlLang, { year: 'numeric', month: 'long', day: 'numeric' })
  const fmtPrice = (n?: number) => n ? `¥${n.toLocaleString('ja-JP')}` : '________________'

  const infoRows = [
    [t.agreementDate, today],
    [t.clientLabel, data?.clientName || '___________________________________'],
    [t.tourLabel, data?.tour || '___________________________________'],
    [t.tourDateLabel, data?.tourDate || '________________'],
    [t.guestsLabel, data?.guests ? String(data.guests) : '____'],
    [t.guideLabel, data?.guide || '_______________'],
    [t.priceLabel, fmtPrice(data?.totalPrice)],
  ].map(([label, val]) => `
    <tr>
      <td class="info-label">${label}</td>
      <td class="info-val">${val}</td>
    </tr>`).join('')

  const sectionsHtml = t.sections.map(s => `
    <div class="section">
      <h3 class="sec-title">${s.title}</h3>
      <p class="sec-body">${s.body.replace(/\n/g, '<br>')}</p>
    </div>`).join('')

  return `<!DOCTYPE html>
<html lang="${meta.htmlLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${t.title}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #1a1a1a; background: #fff; }
  @page { size: A4; margin: 18mm 20mm; }
  @media print { .no-print { display: none !important; } body { font-size: 10.5pt; } }

  /* Print button */
  .no-print {
    position: fixed; top: 16px; right: 16px; z-index: 99;
    background: #E53030; color: #fff; border: none; border-radius: 10px;
    padding: 10px 20px; font-size: 13px; font-weight: 600; cursor: pointer;
    box-shadow: 0 4px 14px rgba(229,48,48,0.35);
  }
  .no-print:hover { background: #c42020; }

  .page { max-width: 760px; margin: 0 auto; padding: 32px 24px 48px; }

  /* Header */
  .header { display: flex; align-items: center; gap: 16px; padding-bottom: 16px; border-bottom: 3px solid #E53030; margin-bottom: 22px; }
  .header-icon { font-size: 36px; line-height: 1; }
  .header-company { font-size: 19pt; font-weight: 700; color: #1a1a1a; letter-spacing: -0.5px; }
  .header-tagline { font-size: 9pt; color: #666; margin-top: 2px; }

  /* Contract title */
  .contract-title { font-size: 13pt; font-weight: 700; color: #E53030; text-align: center; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }

  /* Info table */
  .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; background: #f8f8f8; border-radius: 8px; overflow: hidden; }
  .info-table tr { border-bottom: 1px solid #e8e8e8; }
  .info-table tr:last-child { border-bottom: none; }
  .info-label { padding: 7px 14px; font-size: 9pt; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; width: 38%; }
  .info-val { padding: 7px 14px; font-size: 10.5pt; color: #1a1a1a; font-weight: 500; }

  /* Sections */
  .section { margin-bottom: 16px; }
  .sec-title { font-size: 10.5pt; font-weight: 700; color: #1a1a1a; margin-bottom: 5px; }
  .sec-body { font-size: 10pt; color: #333; line-height: 1.65; }

  /* Signatures */
  .sig-section { margin-top: 32px; padding-top: 20px; border-top: 2px solid #e0e0e0; }
  .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 20px; }
  .sig-block { }
  .sig-label { font-size: 8.5pt; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 32px; }
  .sig-line { border-bottom: 1.5px solid #333; margin-bottom: 6px; height: 1px; }
  .sig-name-label { font-size: 8.5pt; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 18px; margin-bottom: 26px; }
  .date-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .date-block { }
  .date-label { font-size: 8.5pt; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 22px; }
  .date-line { border-bottom: 1.5px solid #333; }

  /* Return note */
  .return-note { margin-top: 24px; padding: 12px 16px; background: #fff8f0; border-left: 4px solid #E53030; border-radius: 0 6px 6px 0; font-size: 9.5pt; color: #555; }

  /* Footer */
  .doc-footer { margin-top: 28px; padding-top: 12px; border-top: 1px solid #e0e0e0; font-size: 8.5pt; color: #999; text-align: center; }
</style>
</head>
<body>
<button class="no-print" onclick="window.print()">🖨 Imprimir / Guardar PDF</button>
<div class="page">

  <div class="header">
    <div class="header-icon">⛩</div>
    <div>
      <div class="header-company">TONY HANMA</div>
      <div class="header-tagline">Private Kansai Tours · Japan</div>
    </div>
  </div>

  <h2 class="contract-title">${t.title}</h2>

  <table class="info-table"><tbody>${infoRows}</tbody></table>

  ${sectionsHtml}

  <div class="sig-section">
    <div class="sig-grid">
      <div class="sig-block">
        <div class="sig-label">${t.sigClientLabel}</div>
        <div class="sig-line"></div>
        <div class="sig-name-label">${t.sigNameLabel}</div>
        <div class="sig-line"></div>
      </div>
      <div class="sig-block">
        <div class="sig-label">${t.sigGuideLabel}</div>
        <div class="sig-line"></div>
      </div>
    </div>
    <div class="date-row">
      <div class="date-block">
        <div class="date-label">${t.sigDateLabel}</div>
        <div class="date-line"></div>
      </div>
      <div class="date-block">
        <div class="date-label">${t.sigDateLabel}</div>
        <div class="date-line"></div>
      </div>
    </div>
  </div>

  <div class="return-note">${t.returnNote}</div>

  <div class="doc-footer">${t.footer}</div>
</div>
</body>
</html>`
}
