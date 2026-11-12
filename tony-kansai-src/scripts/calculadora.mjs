// Calculadora «¿Te compensa un guía privado en Kioto?» (ES y EN), HTML estático.
// El viajero dice cuántos días tiene, cuántos son, si van niños o mayores y qué quiere ver;
// la página le recomienda medio día o día completo (o ir por su cuenta, si es lo honesto),
// calcula el precio por persona con las tarifas reales y abre WhatsApp con todo escrito.
// Precios: los de la web (38.000 ¥ medio día, 58.000 ¥ día, hasta 6 personas por grupo).
// Uso: node scripts/calculadora.mjs  →  public/es/calculadora-guia/ y public/en/private-guide-calculator/
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const BASE = 'https://tonykansaiguide.com'
const WA = '34634193106'
const PRECIO = { medio: 38000, dia: 58000, max: 6 }
const RUTA = { es: '/es/calculadora-guia/', en: '/en/private-guide-calculator/', ar: '/ar/private-guide-calculator/' }

const T = {
  es: {
    title: '¿Te compensa un guía privado en Kioto? Calculadora con precio por persona',
    desc: 'Responde 4 preguntas y te digo si te compensa un guía privado en Kioto, Osaka o Nara, cuánto sale por persona y qué ruta haría. Guía en español, precios reales.',
    eti: 'Calculadora · 30 segundos',
    h1: '¿Te compensa un guía privado en Kioto?',
    lead: 'Cuatro preguntas. Te digo la verdad, aunque la respuesta sea «ve por tu cuenta».',
    q1: '¿Cuántos días tienes para Kioto?', d: ['1 día', '2 días', '3 o más'],
    q2: '¿Cuántos sois?', q3: '¿Viajáis con…?', who: ['Niños', 'Personas mayores o con poca movilidad', 'Es nuestra primera vez en Japón'],
    q4: '¿Qué queréis ver sobre todo?', want: ['Templos famosos sin colas', 'Nara y los ciervos', 'Comida y barrios', 'Fotos y TikTok', 'Halal y rezo'],
    res: 'Mi recomendación', per: 'por persona', grupo: 'por grupo', wa: 'Pedir esta ruta por WhatsApp',
    medio: 'Medio día con guía (4 h)', dia: 'Día completo con guía (8 h)', solo: 'Puedes ir por tu cuenta',
    porque: {
      corto: 'Con poco tiempo en Kioto, el guía te ahorra horas de autobuses llenos y colas: ves lo esencial a la hora buena.',
      ninos: 'Con niños o mayores, la ruta se adapta al ritmo y se evitan los autobuses de Kioto, que van muy llenos.',
      primera: 'Siendo la primera vez, un día con guía te deja preparado para moverte solo el resto del viaje.',
      largo: 'Con 3 días o más y sin necesidades especiales, puedes hacerlo por tu cuenta. Si quieres, te paso mi guía gratis «Ve tú solo».',
      nara: 'Kioto y Nara en un día solo merece la pena con guía: el tren y los horarios se comen media jornada.',
    },
    grande: 'Más de 6 personas: el precio va bajo consulta (segundo guía o suplemento).',
    nota: 'Precio del guía. Entradas, transporte y comidas, aparte.',
    msg: 'Hola, Tony. Vengo de la calculadora.',
    labels: { dias: 'Días', personas: 'Personas', con: 'Con', ver: 'Quiero ver', ruta: 'Recomendación' },
    gratis: 'Guía gratis «Ve tú solo»', faq_t: 'Preguntas',
    faq: [
      ['¿Cuánto cuesta un guía privado en español en Kioto?', '38.000 ¥ medio día (4 h) y 58.000 ¥ el día completo (8 h), por grupo de hasta 6 personas. Entradas, transporte y comidas aparte.'],
      ['¿Cuándo compensa un guía privado?', 'Cuando tienes 1 o 2 días en Kioto, viajas con niños o personas mayores, es tu primera vez en Japón o quieres hacer Kioto y Nara en un día.'],
      ['¿Y cuándo no?', 'Con 3 días o más, sin prisas y sin necesidades especiales, puedes ir por tu cuenta con una buena guía.'],
      ['¿Hay algo más corto que medio día?', 'Sí: el tour de 2 horas cuesta 25.000 ¥ por grupo de hasta 6. Va bien para Gion al atardecer, Fushimi Inari temprano o Kiyomizu.'],
      ['¿Dónde empieza el tour?', 'Te recojo en el vestíbulo de tu hotel en Kioto u Osaka, y el día es solo para tu grupo.'],
      ['¿Cómo se paga?', 'En efectivo el mismo día, o por adelantado con PayPal o Wise.'],
      ['¿Y si tengo que cancelar?', 'Cancelar hasta 72 horas antes no cuesta nada; si tu vuelo se retrasa, buscamos otro día.'],
      ['¿Y si somos más de 6?', 'Hasta 14 personas, bajo consulta (con un segundo guía o un suplemento).'],
      ['¿Y las excursiones largas?', 'Kōyasan, Amanohashidate o Kumano, desde 70.000 ¥ por grupo.'],
    ],
    tabla_t: 'Precio por persona según cuántos seáis', tabla_c: ['Personas', 'Medio día (4 h)', 'Día completo (8 h)'],
    rel_t: 'Para seguir planeando', rel: [['/es/kyoto/', 'Guía privado en Kioto: precios y rutas'], ['/es/guia-privado-kioto-2-horas/', 'Tour de 2 horas en Kioto'], ['/es/tour-privado-bici-kioto/', 'Tour privado en bici por Kioto'], ['/es/rutas/', 'Planes de un día, hora a hora']],
    inicio: 'Tony Kansai Guide',
  },
  en: {
    title: 'Is a private guide in Kyoto worth it? Calculator with price per person',
    desc: 'Answer 4 questions and see whether a private guide in Kyoto, Osaka or Nara is worth it for you, the price per person and the route I would do. Real prices.',
    eti: 'Calculator · 30 seconds',
    h1: 'Is a private guide in Kyoto worth it?',
    lead: 'Four questions. An honest answer, even if it is “go on your own”.',
    q1: 'How many days do you have for Kyoto?', d: ['1 day', '2 days', '3 or more'],
    q2: 'How many of you?', q3: 'Travelling with…?', who: ['Children', 'Older people or limited mobility', 'It is our first time in Japan'],
    q4: 'What do you most want to see?', want: ['Famous temples without crowds', 'Nara and the deer', 'Food and neighbourhoods', 'Photos and TikTok', 'Halal and prayer'],
    res: 'My recommendation', per: 'per person', grupo: 'per group', wa: 'Ask for this route on WhatsApp',
    medio: 'Half day with a guide (4 h)', dia: 'Full day with a guide (8 h)', solo: 'You can go on your own',
    porque: {
      corto: 'With little time in Kyoto, a guide saves you hours of crowded buses and queues: the essentials at the right hour.',
      ninos: 'With children or older relatives, the pace adapts and you skip Kyoto’s very crowded buses.',
      primera: 'On a first trip, one guided day sets you up to get around alone for the rest of it.',
      largo: 'With 3+ days and no special needs, you can do it on your own. I can send you my free “Go on your own” guide.',
      nara: 'Kyoto and Nara in one day only works with a guide: trains and timings eat half the day.',
    },
    grande: 'More than 6 people: price on request (second guide or supplement).',
    nota: 'Guide fee. Tickets, transport and meals are extra.',
    msg: 'Hi Tony, I am coming from the calculator.',
    labels: { dias: 'Days', personas: 'People', con: 'With', ver: 'Want to see', ruta: 'Recommendation' },
    gratis: 'Free “Go on your own” guide', faq_t: 'Questions',
    faq: [
      ['How much is a private guide in Kyoto?', '¥38,000 for a half day (4 h) and ¥58,000 for a full day (8 h), per group of up to 6. Tickets, transport and meals extra.'],
      ['When is a private guide worth it?', 'When you have 1-2 days in Kyoto, travel with children or older relatives, it is your first time in Japan, or you want Kyoto and Nara in one day.'],
      ['And when is it not?', 'With 3+ days, no rush and no special needs, you can go on your own with a good guidebook.'],
      ['Is there anything shorter than a half day?', 'Yes: the 2-hour tour is ¥25,000 per group of up to 6. Good for Gion at sunset, Fushimi Inari early or Kiyomizu.'],
      ['Where does the tour start?', 'I meet you in your hotel lobby in Kyoto or Osaka, and the day is for your group only.'],
      ['How do I pay?', 'Cash on the day, or in advance with PayPal or Wise.'],
      ['What if I need to cancel?', 'Free cancellation up to 72 hours before; if your flight is delayed, we find another day.'],
      ['What if we are more than 6?', 'Up to 14 people on request (with a second guide or a supplement).'],
      ['And long day trips?', 'Kōyasan, Amanohashidate or Kumano, from ¥70,000 per group.'],
    ],
    tabla_t: 'Price per person by group size', tabla_c: ['People', 'Half day (4 h)', 'Full day (8 h)'],
    rel_t: 'Keep planning', rel: [['/en/kyoto/', 'Private guide in Kyoto: prices and routes'], ['/en/kyoto-private-guide-2-hours/', '2-hour tour in Kyoto'], ['/en/kyoto-private-bike-tour/', 'Private bike tour in Kyoto'], ['/en/routes/', 'Day plans, hour by hour']],
    inicio: 'Tony Kansai Guide',
  },
  ar: {
    title: 'هل يستحق المرشد الخاص في كيوتو؟ حاسبة بالسعر لكل شخص',
    desc: 'أجب عن 4 أسئلة لتعرف إن كان المرشد الخاص في كيوتو وأوساكا ونارا مناسبًا لك، وكم يكلّف للشخص، وأي مسار أقترحه. مرشد بالعربية، وطعام حلال وأوقات صلاة.',
    eti: 'حاسبة · 30 ثانية',
    h1: 'هل يستحق المرشد الخاص في كيوتو؟',
    lead: 'أربعة أسئلة. جواب صادق، حتى لو كان «اذهب وحدك».',
    q1: 'كم يومًا لديك في كيوتو؟', d: ['يوم واحد', 'يومان', '3 أيام أو أكثر'],
    q2: 'كم عددكم؟', q3: 'هل تسافرون مع…؟', who: ['أطفال', 'كبار في السن أو حركة محدودة', 'إنها أول مرة لنا في اليابان'],
    q4: 'ماذا تريدون أن تروا أكثر؟', want: ['المعابد الشهيرة بدون زحام', 'نارا والغزلان', 'الطعام والأحياء', 'الصور وتيك توك', 'حلال وأماكن الصلاة'],
    res: 'اقتراحي', per: 'للشخص', grupo: 'للمجموعة', wa: 'اطلب هذا المسار عبر واتساب',
    medio: 'نصف يوم مع مرشد (4 ساعات)', dia: 'يوم كامل مع مرشد (8 ساعات)', solo: 'يمكنك الذهاب وحدك',
    porque: {
      corto: 'مع وقت قصير في كيوتو، يوفّر عليك المرشد ساعات في الحافلات المزدحمة والطوابير: ترى الأهم في الوقت المناسب.',
      ninos: 'مع الأطفال أو كبار السن، يتكيّف الإيقاع وتتجنّب حافلات كيوتو المزدحمة جدًا.',
      primera: 'في أول رحلة، يوم واحد مع مرشد يجعلك مستعدًا للتنقل وحدك بقية الرحلة.',
      largo: 'مع 3 أيام أو أكثر ودون احتياجات خاصة، يمكنك الذهاب وحدك. أستطيع أن أرسل لك دليلي المجاني «اذهب وحدك».',
      nara: 'كيوتو ونارا في يوم واحد لا تنجح إلا مع مرشد: القطارات والمواعيد تأخذ نصف اليوم.',
    },
    grande: 'أكثر من 6 أشخاص: السعر عند الطلب (مرشد ثانٍ أو مبلغ إضافي).',
    nota: 'أجر المرشد فقط. التذاكر والمواصلات والوجبات على حسابكم.',
    msg: 'مرحبًا توني، أتيت من صفحة الحاسبة.',
    labels: { dias: 'الأيام', personas: 'الأشخاص', con: 'مع', ver: 'نريد أن نرى', ruta: 'الاقتراح' },
    gratis: 'دليل مجاني «اذهب وحدك»', faq_t: 'أسئلة',
    faq: [
      ['كم يكلّف المرشد الخاص في كيوتو؟', '38,000 ين لنصف يوم (4 ساعات) و58,000 ين لليوم الكامل (8 ساعات)، للمجموعة حتى 6 أشخاص. التذاكر والمواصلات والوجبات منفصلة.'],
      ['متى يستحق المرشد الخاص؟', 'عندما يكون لديك يوم أو يومان في كيوتو، أو تسافر مع أطفال أو كبار في السن، أو إنها أول مرة في اليابان، أو تريد كيوتو ونارا في يوم واحد.'],
      ['ومتى لا يستحق؟', 'مع 3 أيام أو أكثر، بدون استعجال ولا احتياجات خاصة، يمكنك الذهاب وحدك مع دليل جيد.'],
      ['هل يوجد ما هو أقصر من نصف يوم؟', 'نعم: جولة الساعتين بـ25,000 ين للمجموعة حتى 6 أشخاص. مناسبة لحيّ غيون عند الغروب أو فوشيمي إيناري في الصباح الباكر أو كيوميزو.'],
      ['من أين تبدأ الجولة؟', 'ألتقي بكم في بهو الفندق في كيوتو أو أوساكا، واليوم مخصّص لمجموعتكم فقط.'],
      ['كيف يكون الدفع؟', 'نقدًا في يوم الجولة، أو مسبقًا عبر PayPal أو Wise.'],
      ['وإذا اضطررت إلى الإلغاء؟', 'الإلغاء مجاني حتى 72 ساعة قبل الموعد، وإذا تأخرت رحلتكم نختار يومًا آخر.'],
      ['وإذا كنا أكثر من 6؟', 'حتى 14 شخصًا عند الطلب (بمرشد ثانٍ أو برسوم إضافية).'],
      ['والرحلات الطويلة؟', 'كوياسان أو أمانوهاشيداته أو كومانو، ابتداءً من 70,000 ين للمجموعة.'],
    ],
    tabla_t: 'السعر للشخص حسب عدد أفراد المجموعة', tabla_c: ['الأشخاص', 'نصف يوم (4 ساعات)', 'يوم كامل (8 ساعات)'],
    rel_t: 'لمتابعة التخطيط', rel: [['/ar/kyoto/', 'مرشد خاص في كيوتو: الأسعار والمسارات'], ['/ar/kyoto-private-guide-2-hours/', 'جولة الساعتين في كيوتو'], ['/ar/kyoto-private-bike-tour/', 'جولة خاصة بالدراجة في كيوتو'], ['/ar/routes/', 'خطط اليوم ساعة بساعة']],
    inicio: 'Tony Kansai Guide',
  },
}

// Precio redondeado a 100 ¥ con el separador de cada idioma (38.000 ¥ / ¥38,000 / 38,000 ين).
const yen = (n, lang) => { const v = (Math.round(n / 100) * 100).toLocaleString(lang === 'es' ? 'es-ES' : 'en-US', { useGrouping: 'always' }); return lang === 'es' ? `${v} ¥` : lang === 'ar' ? `${v} ين` : `¥${v}` }
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const CSS = `:root{--f:#fbfaf7;--t:#17151a;--g:#5d5a63;--b:#e4e0d8;--c:#ffffff;--a:#c8402c;--ok:#1d7a4f}
@media (prefers-color-scheme:dark){:root{--f:#111014;--t:#f2f0ee;--g:#a9a5ad;--b:#2a2830;--c:#1a191e;--a:#ff6a52;--ok:#3cc488}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}body{margin:0;background:var(--f);color:var(--t);font:16px/1.55 Inter,system-ui,-apple-system,"Segoe UI","Geeza Pro","Noto Kufi Arabic",sans-serif}
.res ul{padding-inline-start:20px}
a{color:inherit}.w{width:min(760px,100% - 32px);margin-inline:auto}
header{padding:18px 0;border-bottom:1px solid var(--b)}header a{font-weight:700;text-decoration:none}
.eti{font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--a);margin:40px 0 8px}
h1{font-size:clamp(32px,6vw,52px);line-height:1.05;letter-spacing:-.02em;margin:0 0 12px;text-wrap:balance}
.lead{color:var(--g);font-size:18px;margin:0 0 28px;max-width:52ch}
fieldset{border:0;padding:0;margin:0 0 26px}legend{font-weight:700;font-size:18px;margin-bottom:10px}
.ops{display:flex;flex-wrap:wrap;gap:8px}.ops label{position:relative}
.ops input{position:absolute;opacity:0;inset:0;cursor:pointer}
.ops span{display:inline-block;padding:11px 16px;border:1px solid var(--b);border-radius:999px;background:var(--c);cursor:pointer;transition:border-color .2s,background .2s}
.ops input:checked+span{border-color:var(--a);background:color-mix(in srgb,var(--a) 12%,var(--c));font-weight:600}
.ops input:focus-visible+span{outline:2px solid var(--a);outline-offset:2px}
.num{display:flex;align-items:center;gap:12px}.num button{width:44px;height:44px;border-radius:50%;border:1px solid var(--b);background:var(--c);color:var(--t);font-size:22px;cursor:pointer}
.num output{font-size:28px;font-weight:700;min-width:2ch;text-align:center;font-variant-numeric:tabular-nums}
.res{margin:10px 0 40px;padding:24px;border-radius:20px;background:var(--c);border:1px solid var(--b)}
.res .eti{margin:0 0 6px}.res h2{margin:0 0 6px;font-size:26px;line-height:1.15}
.precio{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 18px;margin:14px 0}
.precio b{font-size:40px;letter-spacing:-.02em;font-variant-numeric:tabular-nums}.precio span{color:var(--g)}
.res ul{margin:10px 0 0;padding-left:20px;color:var(--g)}.res .nota{font-size:14px;color:var(--g);margin:14px 0 0}
.btn{display:inline-flex;align-items:center;gap:8px;margin-top:18px;padding:15px 22px;border-radius:999px;background:var(--ok);color:#fff;font-weight:700;text-decoration:none}
.btn:active{transform:scale(.97)}.sec{margin-inline-start:12px;color:var(--g)}
.faq details{border-top:1px solid var(--b);padding:14px 0}.faq summary{font-weight:600;cursor:pointer}.faq p{color:var(--g);margin:8px 0 0}
.tabla table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}.tabla th,.tabla td{padding:10px 8px;border-bottom:1px solid var(--b);text-align:start}.tabla th{font-size:14px;color:var(--g);font-weight:600}
.rel ul{list-style:none;padding:0;margin:0}.rel li{border-top:1px solid var(--b)}.rel a{display:block;padding:14px 0;text-decoration:none;font-weight:600}.rel a::after{content:' →'}[dir=rtl] .rel a::after{content:' ←'}
footer{padding:30px 0 50px;color:var(--g);font-size:14px}`

function pagina(lang) {
  const t = T[lang]
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebApplication', name: t.h1, url: BASE + RUTA[lang], applicationCategory: 'TravelApplication', operatingSystem: 'Any', inLanguage: lang, offers: { '@type': 'Offer', price: 0, priceCurrency: 'JPY' }, provider: { '@type': 'Person', name: 'Tony Hanma', url: `${BASE}/${lang}/`, sameAs: ['https://www.instagram.com/tonykansaiguide/'] } },
      { '@type': 'FAQPage', inLanguage: lang, mainEntity: t.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
      { '@type': 'Service', name: t.medio, provider: { '@type': 'Person', name: 'Tony Hanma' }, areaServed: 'Kyoto', offers: [{ '@type': 'Offer', name: t.medio, price: PRECIO.medio, priceCurrency: 'JPY' }, { '@type': 'Offer', name: t.dia, price: PRECIO.dia, priceCurrency: 'JPY' }] },
    ],
  }
  const radios = (name, ops, sel) => `<div class="ops">${ops.map((o, i) => `<label><input type="radio" name="${name}" value="${i}"${i === sel ? ' checked' : ''}><span>${esc(o)}</span></label>`).join('')}</div>`
  const checks = (name, ops) => `<div class="ops">${ops.map((o, i) => `<label><input type="checkbox" name="${name}" value="${i}"><span>${esc(o)}</span></label>`).join('')}</div>`
  return `<!doctype html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}" data-estatica="calculadora">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<link rel="canonical" href="${BASE}${RUTA[lang]}">
${Object.keys(RUTA).map((l) => `<link rel="alternate" hreflang="${l}" href="${BASE}${RUTA[l]}">`).join('')}<link rel="alternate" hreflang="x-default" href="${BASE}${RUTA.en}">
<meta property="og:title" content="${esc(t.title)}"><meta property="og:description" content="${esc(t.desc)}"><meta property="og:url" content="${BASE}${RUTA[lang]}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<style>${CSS}</style>
</head>
<body>
<header><div class="w"><a href="/${lang}/">${esc(t.inicio)}</a> · ${Object.keys(RUTA).filter((l) => l !== lang).map((l) => `<a href="${RUTA[l]}" hreflang="${l}" lang="${l}">${l === 'ar' ? 'عربي' : l.toUpperCase()}</a>`).join(' · ')}</div></header>
<main class="w">
<p class="eti">${esc(t.eti)}</p>
<h1>${esc(t.h1)}</h1>
<p class="lead">${esc(t.lead)}</p>
<form id="calc" onsubmit="return false">
<fieldset><legend>${esc(t.q1)}</legend>${radios('dias', t.d, 0)}</fieldset>
<fieldset><legend>${esc(t.q2)}</legend><div class="num"><button type="button" data-n="-1" aria-label="−">−</button><output id="pers" aria-live="polite">2</output><button type="button" data-n="1" aria-label="+">+</button></div></fieldset>
<fieldset><legend>${esc(t.q3)}</legend>${checks('con', t.who)}</fieldset>
<fieldset><legend>${esc(t.q4)}</legend>${checks('ver', t.want)}</fieldset>
</form>
<section class="res" aria-live="polite">
<p class="eti">${esc(t.res)}</p>
<h2 id="r-t"></h2>
<div class="precio" id="r-p"></div>
<ul id="r-why"></ul>
<p class="nota" id="r-nota">${esc(t.nota)}</p>
<a class="btn" id="r-wa" href="https://wa.me/${WA}" target="_blank" rel="noopener">${esc(t.wa)}</a>
<a class="sec" id="r-solo" href="/${lang === 'es' ? 'es/ventajas' : lang === 'ar' ? 'ar/perks' : 'en/perks'}/" hidden>${esc(t.gratis)} →</a>
</section>
<section class="tabla"><p class="eti">${esc(t.tabla_t)}</p><table><thead><tr>${t.tabla_c.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${[1, 2, 3, 4, 5, 6].map((n) => `<tr><td>${n}</td><td>${yen(PRECIO.medio / n, lang)}</td><td>${yen(PRECIO.dia / n, lang)}</td></tr>`).join('')}</tbody></table><p class="nota">${esc(t.nota)}</p></section>
<section class="faq"><p class="eti">${esc(t.faq_t)}</p>${t.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section>
<nav class="rel" aria-label="${esc(t.rel_t)}"><p class="eti">${esc(t.rel_t)}</p><ul>${t.rel.map(([h, x]) => `<li><a href="${h}">${esc(x)}</a></li>`).join('')}</ul></nav>
</main>
<footer class="w"><a href="/${lang}/">${esc(t.inicio)}</a> · <a href="https://www.instagram.com/tonykansaiguide/">Instagram</a> · tony@tonykansaiguide.com</footer>
<script>
(function(){
var T=${JSON.stringify({ medio: t.medio, dia: t.dia, solo: t.solo, porque: t.porque, per: t.per, grupo: t.grupo, grande: t.grande, msg: t.msg, labels: t.labels, d: t.d, who: t.who, want: t.want })};
var P=${JSON.stringify(PRECIO)},WA="${WA}",lang="${lang}";
var f=document.getElementById('calc'),pers=document.getElementById('pers'),n=2;
var yen=function(v){return '<bdi dir="ltr">¥'+Math.round(v).toLocaleString(lang==='es'?'es-ES':'en-US')+'</bdi>'};
document.querySelectorAll('[data-n]').forEach(function(b){b.addEventListener('click',function(){n=Math.max(1,Math.min(20,n+Number(b.dataset.n)));pers.textContent=n;calc()})});
f.addEventListener('change',calc);
function marcados(name){return Array.prototype.map.call(f.querySelectorAll('input[name='+name+']:checked'),function(i){return Number(i.value)})}
function calc(){
  var dias=Number(f.querySelector('input[name=dias]:checked').value),con=marcados('con'),ver=marcados('ver');
  var why=[],tipo;
  var nara=ver.indexOf(1)>=0,ninos=con.indexOf(0)>=0||con.indexOf(1)>=0,primera=con.indexOf(2)>=0;
  if(dias<=1){why.push(T.porque.corto)}
  if(ninos)why.push(T.porque.ninos);
  if(primera)why.push(T.porque.primera);
  if(nara)why.push(T.porque.nara);
  if(dias>=2&&!ninos&&!primera&&!nara){tipo='solo';why=[T.porque.largo]}
  else tipo=(nara||dias<=1&&ver.length>=2||ninos&&dias<=1)?'dia':'medio';
  document.getElementById('r-t').textContent=T[tipo];
  var p=document.getElementById('r-p'),solo=document.getElementById('r-solo');
  if(tipo==='solo'){p.innerHTML='';solo.hidden=false}
  else{solo.hidden=true;var g=P[tipo];
    p.innerHTML=n>P.max?'<span>'+T.grande+'</span>':'<b>'+yen(g/n)+'</b><span>'+T.per+' · '+yen(g)+' '+T.grupo+'</span>'}
  document.getElementById('r-why').innerHTML=why.map(function(w){return '<li>'+w+'</li>'}).join('');
  var L=T.labels,txt=T.msg+'\\n\\n'+L.dias+': '+T.d[dias]+'\\n'+L.personas+': '+n+(con.length?'\\n'+L.con+': '+con.map(function(i){return T.who[i]}).join(', '):'')+(ver.length?'\\n'+L.ver+': '+ver.map(function(i){return T.want[i]}).join(', '):'')+'\\n'+L.ruta+': '+T[tipo];
  document.getElementById('r-wa').href='https://wa.me/'+WA+'?text='+encodeURIComponent(txt);
}
calc();
})();
</script>
</body>
</html>
`
}

for (const lang of Object.keys(T)) {
  const dir = join('public', RUTA[lang])
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), pagina(lang))
}
console.log(`calculadora: ${Object.values(RUTA).join(' ')}`)
