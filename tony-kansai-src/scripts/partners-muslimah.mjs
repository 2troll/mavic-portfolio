#!/usr/bin/env node
// Hanma Travel Partners — guías musulmanas mujeres para AGENCIAS (B2B), 27-11-2026.
// Marca de agencias (ver memoria marcas-separadas): estética de /partners/ (negro, letra del
// sistema), sin enlaces a páginas de turistas. Todo contacto va primero a Tony, que asigna la guía.
// Solo hechos ciertos: 4 guías musulmanas que viven en Osaka y Kioto; AR/ID/EN/FR/JA; sin nombres,
// sin licencias, sin precios (tarifa neta por grupo a petición).
// Rutas: /partners/muslimah-guides/ (en) · ar/ · id/ · ms/. Ejecutar: node scripts/partners-muslimah.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://tonykansaiguide.com'
const WA = '34634193106'
const MAIL = 'tony@tonykansaiguide.com'
const MODIFICADO = '2026-11-27'

export const RUTAS_PM = {
  en: '/partners/muslimah-guides/',
  ar: '/partners/muslimah-guides/ar/',
  id: '/partners/muslimah-guides/id/',
  ms: '/partners/muslimah-guides/ms/',
}
const NOMBRE = { en: 'English', ar: 'العربية', id: 'Bahasa Indonesia', ms: 'Bahasa Melayu' }

const T = {
  en: {
    title: 'Female Muslim guides in Japan for halal travel agencies | Hanma Travel Partners',
    desc: 'B2B supply of Muslim women guides in Osaka, Kyoto, Nara and Kobe for halal and Muslimah tour operators. Prayer-planned routes, halal meals, net rates per group.',
    kicker: 'For travel agencies · Japan',
    h1: 'Muslim women guides for your groups in Japan',
    sub: 'Hanma Travel Partners supplies female Muslim guides in Osaka, Kyoto, Nara and Kobe to halal and Muslimah tour operators. One contact, a net rate per group, and a day planned around prayer.',
    wa: 'Ask for a net rate', waTexto: 'Assalamu alaikum, we are a travel agency and need a Muslim female guide in Japan.\nAgency:\nDates:\nGroup size:\nCities:\nLanguage:',
    datos: [['4', 'Muslim women guides living in Osaka and Kyoto'], ['5', 'languages: Arabic, Indonesian, English, French, Japanese'], ['1', 'contact for your agency: Tony']],
    porqueH: 'Why agencies ask for this',
    porque: 'Muslimah groups and families often ask their agency for a woman guide, and in Japan they are hard to find. Japan ranks 7th among non-OIC destinations in the Global Muslim Travel Index 2026, but its weakest pillar is communication (31 out of 100). A Muslim guide who speaks your clients\' language closes that gap.',
    ofreceH: 'What your group gets',
    ofrece: [
      ['Women-only option', 'Guide and group all women, for Muslimah tours.'],
      ['Prayer built into the route', 'Dhuhr, Asr and Maghrib at mosques in Osaka, Kobe and Kyoto or at prayer rooms; Jumu\'ah on Fridays on request.'],
      ['Halal meals arranged', 'Halal-certified or Muslim-friendly restaurants chosen in advance; the guide checks ingredients in Japanese.'],
      ['Families and seniors', 'Rest stops, lifts and taxis between sites.'],
      ['Ramadan programmes', 'Shorter days and iftar close to a mosque.'],
      ['Male guides too', 'Muslim male guides in Kansai (Arabic, Spanish, English) and Tokyo (Arabic, French, English) when the group needs both.'],
    ],
    pasosH: 'How booking works',
    pasos: [['Send the group profile', 'Dates, group size, cities, language and whether it is women only.'], ['Tony confirms the guide', 'He checks who is free and sends a net rate per group for your quote.'], ['The guide meets your group', 'At the hotel or station. Tony stays your single contact before and during the tour.']],
    faqH: 'Questions from agencies',
    faq: [
      ['Do we contact the guides directly?', 'No. Every request goes to Tony first on WhatsApp or email. He assigns the guide and stays responsible for the booking.'],
      ['Do you give net rates?', 'Yes. We send a net rate per group and per day so your agency can add its own margin.'],
      ['Which cities do you cover?', 'Osaka, Kyoto, Nara and Kobe with women guides; Tokyo with a Muslim male guide.'],
      ['How far ahead should we book?', 'The guides are freelance: 2 to 4 weeks ahead for groups, longer for spring and autumn.'],
      ['What is not included?', 'The rate covers guiding. Transport, entrance tickets and meals are paid separately; the guide can arrange them.'],
    ],
    finalH: 'Send us your next group',
    final: 'Dates, size and cities are enough. We reply with a guide and a net rate.',
    mail: 'or email', idiomas: 'Other languages', volver: 'All partner services',
  },
  ar: {
    title: 'مرشدات سياحيات مسلمات في اليابان لوكالات السفر الحلال | Hanma Travel Partners',
    desc: 'نوفّر لوكالات السفر الحلال ومنظّمي رحلات النساء مرشدات مسلمات في أوساكا وكيوتو ونارا وكوبي. مسارات حول أوقات الصلاة، وجبات حلال، وأسعار صافية لكل مجموعة.',
    kicker: 'لوكالات السفر · اليابان',
    h1: 'مرشدات مسلمات لمجموعاتكم في اليابان',
    sub: 'توفّر Hanma Travel Partners مرشدات مسلمات في أوساكا وكيوتو ونارا وكوبي لوكالات السفر الحلال ورحلات النساء. جهة اتصال واحدة، وسعر صافٍ لكل مجموعة، ويوم مخطَّط حول الصلاة.',
    wa: 'اطلبوا السعر الصافي', waTexto: 'السلام عليكم، نحن وكالة سفر ونحتاج مرشدة مسلمة في اليابان.\nالوكالة:\nالتواريخ:\nعدد المجموعة:\nالمدن:\nاللغة:',
    datos: [['4', 'مرشدات مسلمات يقمن في أوساكا وكيوتو'], ['5', 'لغات: العربية، الإندونيسية، الإنجليزية، الفرنسية، اليابانية'], ['1', 'جهة اتصال واحدة لوكالتكم: طوني']],
    porqueH: 'لماذا تطلب الوكالات هذه الخدمة',
    porque: 'كثيراً ما تطلب مجموعات النساء والعائلات المسلمة من وكالتها مرشدة امرأة، ومن الصعب إيجادها في اليابان. تحتل اليابان المرتبة السابعة بين الوجهات غير الإسلامية في مؤشر السفر الإسلامي العالمي 2026، لكن أضعف نقاطها هي التواصل (31 من 100). مرشدة مسلمة تتحدث لغة عملائكم تسدّ هذه الفجوة.',
    ofreceH: 'ما تحصل عليه مجموعتكم',
    ofrece: [
      ['خيار للنساء فقط', 'المرشدة والمجموعة كلهن نساء، لرحلات النساء.'],
      ['الصلاة ضمن المسار', 'الظهر والعصر والمغرب في مساجد أوساكا وكوبي وكيوتو أو في المصليات، وصلاة الجمعة عند الطلب.'],
      ['وجبات حلال مرتّبة', 'مطاعم حلال معتمدة أو صديقة للمسلمين تُختار مسبقاً، وتتحقق المرشدة من المكونات باليابانية.'],
      ['العائلات وكبار السن', 'استراحات ومصاعد وسيارات أجرة بين الأماكن.'],
      ['برامج رمضان', 'أيام أقصر وإفطار قريب من مسجد.'],
      ['مرشدون رجال أيضاً', 'مرشدون مسلمون في كانساي (العربية والإسبانية والإنجليزية) وفي طوكيو (العربية والفرنسية والإنجليزية) عندما تحتاج المجموعة إلى الاثنين.'],
    ],
    pasosH: 'كيف يتم الحجز',
    pasos: [['أرسلوا بيانات المجموعة', 'التواريخ وعدد الأفراد والمدن واللغة، وهل هي للنساء فقط.'], ['يؤكد طوني المرشدة', 'يتحقق من المتاحة ويرسل سعراً صافياً لكل مجموعة لعرضكم.'], ['تستقبل المرشدة مجموعتكم', 'في الفندق أو المحطة، ويبقى طوني جهة اتصالكم الوحيدة قبل الجولة وأثناءها.']],
    faqH: 'أسئلة الوكالات',
    faq: [
      ['هل نتواصل مع المرشدات مباشرة؟', 'لا. كل طلب يصل أولاً إلى طوني عبر واتساب أو البريد الإلكتروني، وهو يحدد المرشدة ويبقى مسؤولاً عن الحجز.'],
      ['هل تقدمون أسعاراً صافية؟', 'نعم. نرسل سعراً صافياً لكل مجموعة ولكل يوم لتضيف وكالتكم هامشها.'],
      ['ما المدن التي تغطونها؟', 'أوساكا وكيوتو ونارا وكوبي مع المرشدات، وطوكيو مع مرشد مسلم.'],
      ['كم من الوقت مسبقاً يجب الحجز؟', 'المرشدات يعملن بشكل حر: من أسبوعين إلى أربعة أسابيع للمجموعات، وأكثر في الربيع والخريف.'],
      ['ما الذي لا يشمله السعر؟', 'السعر يشمل الإرشاد فقط. المواصلات وتذاكر الدخول والوجبات تُدفع منفصلة، ويمكن للمرشدة ترتيبها.'],
    ],
    finalH: 'أرسلوا لنا مجموعتكم القادمة',
    final: 'تكفي التواريخ والعدد والمدن، ونرد عليكم بمرشدة وسعر صافٍ.',
    mail: 'أو عبر البريد', idiomas: 'لغات أخرى', volver: 'جميع خدمات الشركاء',
  },
  id: {
    title: 'Pemandu wisata muslimah di Jepang untuk agen travel halal | Hanma Travel Partners',
    desc: 'Penyediaan pemandu wisata wanita muslim di Osaka, Kyoto, Nara dan Kobe untuk agen travel halal dan tur muslimah. Rute mengikuti waktu salat, makanan halal, harga net per grup.',
    kicker: 'Untuk agen travel · Jepang',
    h1: 'Pemandu muslimah untuk rombongan Anda di Jepang',
    sub: 'Hanma Travel Partners menyediakan pemandu wanita muslim di Osaka, Kyoto, Nara dan Kobe untuk agen travel halal dan tur muslimah. Satu kontak, harga net per grup, dan hari yang direncanakan mengikuti waktu salat.',
    wa: 'Minta harga net', waTexto: 'Assalamualaikum, kami agen travel dan membutuhkan pemandu muslimah di Jepang.\nAgen:\nTanggal:\nJumlah peserta:\nKota:\nBahasa:',
    datos: [['4', 'pemandu muslimah yang tinggal di Osaka dan Kyoto'], ['5', 'bahasa: Arab, Indonesia, Inggris, Prancis, Jepang'], ['1', 'kontak untuk agen Anda: Tony']],
    porqueH: 'Mengapa agen travel membutuhkannya',
    porque: 'Rombongan muslimah dan keluarga sering meminta pemandu wanita kepada agennya, dan di Jepang sulit ditemukan. Jepang berada di peringkat ke-7 di antara destinasi non-OKI dalam Global Muslim Travel Index 2026, tetapi nilai terendahnya adalah komunikasi (31 dari 100). Pemandu muslimah yang berbicara dalam bahasa klien Anda menutup kekurangan itu.',
    ofreceH: 'Yang didapat rombongan Anda',
    ofrece: [
      ['Pilihan khusus wanita', 'Pemandu dan rombongan semuanya wanita, untuk tur muslimah.'],
      ['Salat masuk dalam rute', 'Zuhur, Asar dan Magrib di masjid Osaka, Kobe dan Kyoto atau di musala; salat Jumat jika diminta.'],
      ['Makanan halal diatur', 'Restoran bersertifikat halal atau ramah muslim dipilih sebelumnya; pemandu mengecek bahan dalam bahasa Jepang.'],
      ['Keluarga dan lansia', 'Waktu istirahat, lift dan taksi antar tempat.'],
      ['Program Ramadan', 'Hari lebih singkat dan berbuka dekat masjid.'],
      ['Pemandu pria juga', 'Pemandu muslim pria di Kansai (Arab, Spanyol, Inggris) dan Tokyo (Arab, Prancis, Inggris) jika rombongan membutuhkan keduanya.'],
    ],
    pasosH: 'Cara memesan',
    pasos: [['Kirim profil rombongan', 'Tanggal, jumlah peserta, kota, bahasa, dan apakah khusus wanita.'], ['Tony mengonfirmasi pemandu', 'Ia mengecek siapa yang tersedia dan mengirim harga net per grup untuk penawaran Anda.'], ['Pemandu menjemput rombongan', 'Di hotel atau stasiun. Tony tetap menjadi satu-satunya kontak Anda sebelum dan selama tur.']],
    faqH: 'Pertanyaan dari agen travel',
    faq: [
      ['Apakah kami menghubungi pemandu langsung?', 'Tidak. Setiap permintaan masuk lebih dulu ke Tony lewat WhatsApp atau email. Ia menentukan pemandu dan bertanggung jawab atas pemesanan.'],
      ['Apakah ada harga net?', 'Ada. Kami mengirim harga net per grup per hari agar agen Anda bisa menambahkan margin sendiri.'],
      ['Kota mana saja yang dilayani?', 'Osaka, Kyoto, Nara dan Kobe dengan pemandu wanita; Tokyo dengan pemandu muslim pria.'],
      ['Berapa lama sebelumnya harus memesan?', 'Para pemandu bekerja lepas: 2 sampai 4 minggu sebelumnya untuk rombongan, lebih lama untuk musim semi dan gugur.'],
      ['Apa yang tidak termasuk?', 'Harga mencakup jasa pemandu. Transportasi, tiket masuk dan makan dibayar terpisah; pemandu bisa mengaturnya.'],
    ],
    finalH: 'Kirimkan rombongan Anda berikutnya',
    final: 'Cukup tanggal, jumlah dan kota. Kami membalas dengan pemandu dan harga net.',
    mail: 'atau email', idiomas: 'Bahasa lain', volver: 'Semua layanan mitra',
  },
  ms: {
    title: 'Pemandu pelancong muslimah di Jepun untuk agensi pelancongan halal | Hanma Travel Partners',
    desc: 'Pembekalan pemandu pelancong wanita Muslim di Osaka, Kyoto, Nara dan Kobe untuk agensi pelancongan halal dan lawatan muslimah. Laluan mengikut waktu solat, makanan halal, harga nett setiap kumpulan.',
    kicker: 'Untuk agensi pelancongan · Jepun',
    h1: 'Pemandu muslimah untuk kumpulan anda di Jepun',
    sub: 'Hanma Travel Partners membekalkan pemandu wanita Muslim di Osaka, Kyoto, Nara dan Kobe kepada agensi pelancongan halal dan lawatan muslimah. Satu kenalan, harga nett setiap kumpulan, dan hari yang dirancang mengikut waktu solat.',
    wa: 'Minta harga nett', waTexto: 'Assalamualaikum, kami agensi pelancongan dan memerlukan pemandu muslimah di Jepun.\nAgensi:\nTarikh:\nBilangan peserta:\nBandar:\nBahasa:',
    datos: [['4', 'pemandu muslimah yang tinggal di Osaka dan Kyoto'], ['5', 'bahasa: Arab, Indonesia, Inggeris, Perancis, Jepun'], ['1', 'kenalan untuk agensi anda: Tony']],
    porqueH: 'Mengapa agensi memerlukannya',
    porque: 'Kumpulan muslimah dan keluarga sering meminta pemandu wanita daripada agensi mereka, dan di Jepun ia sukar dicari. Jepun berada di tempat ke-7 antara destinasi bukan OIC dalam Global Muslim Travel Index 2026, tetapi markah terendahnya ialah komunikasi (31 daripada 100). Pemandu muslimah yang bertutur dalam bahasa pelanggan anda menutup jurang itu.',
    ofreceH: 'Apa yang kumpulan anda dapat',
    ofrece: [
      ['Pilihan wanita sahaja', 'Pemandu dan kumpulan semuanya wanita, untuk lawatan muslimah.'],
      ['Solat dalam laluan', 'Zohor, Asar dan Maghrib di masjid Osaka, Kobe dan Kyoto atau di surau; solat Jumaat atas permintaan.'],
      ['Makanan halal diatur', 'Restoran diperakui halal atau mesra Muslim dipilih lebih awal; pemandu menyemak bahan dalam bahasa Jepun.'],
      ['Keluarga dan warga emas', 'Waktu rehat, lif dan teksi antara tempat.'],
      ['Program Ramadan', 'Hari lebih pendek dan berbuka puasa berhampiran masjid.'],
      ['Pemandu lelaki juga', 'Pemandu Muslim lelaki di Kansai (Arab, Sepanyol, Inggeris) dan Tokyo (Arab, Perancis, Inggeris) apabila kumpulan memerlukan kedua-duanya.'],
    ],
    pasosH: 'Cara menempah',
    pasos: [['Hantar profil kumpulan', 'Tarikh, bilangan peserta, bandar, bahasa dan sama ada wanita sahaja.'], ['Tony mengesahkan pemandu', 'Beliau menyemak siapa yang lapang dan menghantar harga nett setiap kumpulan untuk sebut harga anda.'], ['Pemandu menyambut kumpulan anda', 'Di hotel atau stesen. Tony kekal satu-satunya kenalan anda sebelum dan semasa lawatan.']],
    faqH: 'Soalan daripada agensi',
    faq: [
      ['Adakah kami menghubungi pemandu secara terus?', 'Tidak. Setiap permintaan sampai kepada Tony dahulu melalui WhatsApp atau e-mel. Beliau menetapkan pemandu dan bertanggungjawab atas tempahan.'],
      ['Adakah harga nett diberikan?', 'Ya. Kami menghantar harga nett setiap kumpulan setiap hari supaya agensi anda boleh menambah margin sendiri.'],
      ['Bandar mana yang diliputi?', 'Osaka, Kyoto, Nara dan Kobe dengan pemandu wanita; Tokyo dengan pemandu Muslim lelaki.'],
      ['Berapa awal perlu menempah?', 'Pemandu bekerja secara bebas: 2 hingga 4 minggu lebih awal untuk kumpulan, lebih awal untuk musim bunga dan luruh.'],
      ['Apa yang tidak termasuk?', 'Harga meliputi khidmat pemandu. Pengangkutan, tiket masuk dan makanan dibayar berasingan; pemandu boleh mengaturnya.'],
    ],
    finalH: 'Hantar kumpulan anda yang seterusnya',
    final: 'Tarikh, bilangan dan bandar sudah memadai. Kami membalas dengan pemandu dan harga nett.',
    mail: 'atau e-mel', idiomas: 'Bahasa lain', volver: 'Semua perkhidmatan rakan kongsi',
  },
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const wa = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`

function jsonLd(lang, t) {
  const url = BASE + RUTAS_PM[lang]
  const org = { '@type': 'Organization', '@id': BASE + '/partners/#htp', name: 'Hanma Travel Partners', url: BASE + '/partners/', email: MAIL, telephone: '+34634193106', parentOrganization: { '@type': 'Organization', name: 'HBH Group', url: 'https://hbh.tonykansaiguide.com/' } }
  return { '@context': 'https://schema.org', '@graph': [
    org,
    { '@type': 'WebPage', '@id': url + '#pagina', url, name: t.title, description: t.desc, inLanguage: lang, dateModified: MODIFICADO, about: { '@id': url + '#servicio' } },
    { '@type': 'Service', '@id': url + '#servicio', name: t.h1, description: t.desc, serviceType: 'B2B tour guide supply for travel agencies', provider: { '@id': BASE + '/partners/#htp' },
      areaServed: ['Osaka', 'Kyoto', 'Nara', 'Kobe', 'Tokyo'].map((n) => ({ '@type': 'City', name: n, containedInPlace: { '@type': 'Country', name: 'Japan' } })),
      audience: { '@type': 'BusinessAudience', audienceType: 'Halal travel agencies and Muslimah tour operators' },
      availableLanguage: ['ar', 'id', 'ms', 'en', 'fr', 'ja', 'es'], termsOfService: 'Net rate per group and per day, quoted before booking' },
    { '@type': 'FAQPage', inLanguage: lang, mainEntity: t.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ] }
}

const CSS = `:root{--bg:#000;--card:#0f0f10;--line:#232326;--line2:#333338;--text:#fafafa;--muted:#a1a1aa;--ok:#22c55e;--f:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}
[dir=rtl]{--f:-apple-system,"SF Arabic","Geeza Pro","Noto Kufi Arabic","Segoe UI",Tahoma,sans-serif}
*{box-sizing:border-box}html{color-scheme:dark}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.6 var(--f);-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit}.wrap{max-width:1080px;margin:0 auto;padding-inline:max(16px,env(safe-area-inset-left,0px))}
h1,h2,h3{font-weight:600;letter-spacing:-.03em;line-height:1.1;text-wrap:balance;margin:0}[dir=rtl] h1,[dir=rtl] h2,[dir=rtl] h3{letter-spacing:0;line-height:1.4}p{margin:0;text-wrap:pretty}
.top{position:sticky;top:0;z-index:5;background:rgba(0,0,0,.75);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}.top .wrap{display:flex;justify-content:space-between;align-items:center;height:58px;gap:12px}
.brand{font-weight:600;font-size:15px;text-decoration:none}.brand span{color:var(--muted);font-weight:500}
.lab{display:inline-block;font:500 13px/1 var(--f);color:var(--muted);border:1px solid var(--line2);border-radius:99px;padding:7px 12px}
.hero{padding-block:clamp(56px,10vw,120px);border-bottom:1px solid var(--line)}.hero h1{font-size:clamp(38px,7.5vw,80px);margin:20px 0 18px;max-width:16ch}.hero .sub{color:var(--muted);font-size:clamp(17px,2.2vw,20px);max-width:60ch}
.cta{display:flex;flex-wrap:wrap;align-items:center;gap:14px 20px;margin-top:28px}.btn{display:inline-flex;align-items:center;gap:8px;background:#fff;color:#000;text-decoration:none;font-weight:600;border-radius:10px;padding:13px 20px;min-height:48px}.cta .m{color:var(--muted);font-size:15px}
.datos{display:grid;gap:1px;background:var(--line);border-block:1px solid var(--line);margin:0;padding:0;list-style:none}.datos li{background:var(--bg);padding:22px 0}.datos b{display:block;font-size:40px;font-weight:600;letter-spacing:-.03em}.datos span{color:var(--muted)}
.sec{padding-block:clamp(48px,7vw,88px);border-bottom:1px solid var(--line)}.sec h2{font-size:clamp(28px,4.5vw,44px);margin-bottom:22px}.sec>.wrap>p{color:var(--muted);max-width:66ch;font-size:17px}
.rej{display:grid;gap:12px}.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:20px}.card h3{font-size:18px;margin-bottom:6px;letter-spacing:-.01em}.card p{color:var(--muted)}
ol.pasos{list-style:none;margin:0;padding:0;display:grid;gap:12px;counter-reset:p}ol.pasos li{counter-increment:p}ol.pasos li h3::before{content:counter(p) ". ";color:var(--ok)}
.faq div{padding:18px 0;border-bottom:1px solid var(--line)}.faq h3{font-size:17px;letter-spacing:-.01em;margin-bottom:6px}.faq p{color:var(--muted)}
footer{padding-block:36px 96px;color:var(--muted);font-size:14px}footer nav{display:flex;flex-wrap:wrap;gap:6px 14px;margin-top:10px}
.fijo{position:fixed;inset-inline:12px;bottom:max(12px,env(safe-area-inset-bottom,0px));z-index:6;display:flex;justify-content:center}.fijo .btn{box-shadow:0 8px 30px rgba(0,0,0,.6)}
@media(min-width:760px){.datos{grid-template-columns:repeat(3,1fr)}.datos li{padding:26px 22px}.rej{grid-template-columns:repeat(3,1fr)}ol.pasos{grid-template-columns:repeat(3,1fr)}.fijo{display:none}}`

function pagina(lang) {
  const t = T[lang], rtl = lang === 'ar', url = BASE + RUTAS_PM[lang]
  const alt = Object.entries(RUTAS_PM).map(([l, r]) => `<link rel="alternate" hreflang="${l}" href="${BASE + r}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${BASE + RUTAS_PM.en}">`
  const mailto = `mailto:${MAIL}?subject=${encodeURIComponent(t.h1)}&body=${encodeURIComponent(t.waTexto)}`
  const btn = `<a class="btn" href="${wa(t.waTexto)}" target="_blank" rel="noopener">${t.wa}</a>`
  return `<!doctype html>
<html lang="${lang}"${rtl ? ' dir="rtl"' : ''} data-estatica="partners-muslimah">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${url}">
${alt}
<meta property="og:type" content="website"><meta property="og:site_name" content="Hanma Travel Partners"><meta property="og:url" content="${url}"><meta property="og:title" content="${esc(t.h1)}"><meta property="og:description" content="${esc(t.desc)}">
<meta name="theme-color" content="#000000">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(jsonLd(lang, t))}</script>
<style>${CSS}</style>
</head>
<body>
<header class="top"><div class="wrap"><a class="brand" href="/partners/">Hanma <span>Travel Partners</span></a></div></header>
<main>
<section class="hero"><div class="wrap"><span class="lab">${t.kicker}</span><h1>${t.h1}</h1><p class="sub">${t.sub}</p><div class="cta">${btn}<span class="m">${t.mail} <a href="${esc(mailto)}">${MAIL}</a></span></div></div></section>
<div class="wrap"><ul class="datos">${t.datos.map(([n, d]) => `<li><b>${n}</b><span>${d}</span></li>`).join('')}</ul></div>
<section class="sec"><div class="wrap"><h2>${t.porqueH}</h2><p>${t.porque}</p></div></section>
<section class="sec"><div class="wrap"><h2>${t.ofreceH}</h2><div class="rej">${t.ofrece.map(([a, b]) => `<div class="card"><h3>${a}</h3><p>${b}</p></div>`).join('')}</div></div></section>
<section class="sec"><div class="wrap"><h2>${t.pasosH}</h2><ol class="pasos">${t.pasos.map(([a, b]) => `<li class="card"><h3>${a}</h3><p>${b}</p></li>`).join('')}</ol></div></section>
<section class="sec"><div class="wrap"><h2>${t.faqH}</h2><div class="faq">${t.faq.map(([q, a]) => `<div><h3>${q}</h3><p>${a}</p></div>`).join('')}</div></div></section>
<section class="sec"><div class="wrap"><h2>${t.finalH}</h2><p>${t.final}</p><div class="cta">${btn}</div></div></section>
</main>
<footer><div class="wrap">
<div>Hanma Travel Partners · Osaka, Japan · <a href="mailto:${MAIL}">${MAIL}</a> · <a href="/partners/">${t.volver}</a> · A company of <a href="https://hbh.tonykansaiguide.com/">HBH Group</a></div>
<nav aria-label="${esc(t.idiomas)}">${t.idiomas}: ${Object.entries(RUTAS_PM).filter(([l]) => l !== lang).map(([l, r]) => `<a href="${r}" hreflang="${l}" lang="${l}">${NOMBRE[l]}</a>`).join('')}</nav>
</div></footer>
<div class="fijo">${btn}</div>
</body>
</html>
`
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const lang of Object.keys(RUTAS_PM)) {
    const dir = join(root, 'public', RUTAS_PM[lang])
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'index.html'), pagina(lang))
    console.log('ok', RUTAS_PM[lang])
  }
}
