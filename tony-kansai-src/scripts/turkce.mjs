#!/usr/bin/env node
// Genera public/tr/**: la sección en turco de Ferhat, guía turco en Kansai.
//
//   node scripts/turkce.mjs
//
// Son HTML estáticos a propósito, sin React: GPTBot, ClaudeBot y PerplexityBot
// no ejecutan JavaScript, y quien pregunta a una IA «Japonya'da Türkçe rehber»
// tiene que encontrar el texto entero en la primera respuesta del servidor.
// rutas-estaticas.mjs no las pisa (llevan data-estatica en <html>).
//
// Regla de contenido: nada que no sea verdad. De Ferhat solo consta (23-10-2026,
// por Tony): turco, guía, solo habla turco, 4 años en Japón, las mismas zonas
// que Tony, y el precio lo da por WhatsApp según el grupo. Sin reseñas todavía:
// no inventar ninguna, ni apellido, ni licencias.
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://tonykansaiguide.com'
const HOY = '2026-10-23'

// WhatsApp de Ferhat (lo dio Tony el 23-10-2026). Las reservas le llegan
// directamente a él.
const WA_NUMERO = '818024786402'
const WA_VISIBLE = '+81 80 2478 6402'
const wa = (texto) => `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(texto)}`
const WA_GENEL = wa('Merhaba Ferhat, Japonya için Türkçe rehber arıyorum. Tarihler: ')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const SEHIRLER = [
  {
    yol: 'kyoto', ad: 'Kyoto', foto: '/v7/fotos/kioto',
    baslik: "Kyoto'da Türkçe Rehber Ferhat | Özel Kyoto Turu",
    aciklama: "Kyoto'da Türkçe konuşan özel rehber: Fushimi Inari, Kiyomizu-dera, Gion ve Arashiyama. Sadece sizin grubunuz için, otel lobisinde buluşma. Fiyat WhatsApp'tan.",
    giris: "Kyoto, Japonya'nın bin yılı aşkın süre başkenti olmuş şehri. Tapınakları, geyşa sokakları ve bambu ormanıyla çoğu gezginin Japonya'daki en önemli günü. Ferhat bu günü sizin hızınıza göre, Türkçe anlatarak planlar.",
    yerler: [
      ['Fushimi Inari Taisha', 'Binlerce turuncu torii kapısıyla dağa tırmanan yol. Kalabalıktan kaçmak için sabah erken gitmek en iyisi.'],
      ['Kiyomizu-dera', 'Ahşap terasıyla şehre bakan tapınak ve önündeki eski taş sokaklar: Ninenzaka ve Sannenzaka.'],
      ['Gion', 'Ahşap çay evleri ve dar sokaklarıyla Kyoto\'nun geyşa mahallesi.'],
      ['Arashiyama', 'Bambu ormanı, Togetsukyo Köprüsü ve nehir kenarı.'],
      ['Kinkaku-ji', 'Altın Köşk: göl kenarında altın yaprak kaplı tapınak.'],
      ['Nishiki Pazarı', 'Kyoto\'nun mutfağı: yerel atıştırmalıklar ve pazar tezgâhları.'],
    ],
    ipucu: "Osaka'da kalıyorsanız Kyoto'ya trenle yaklaşık 30-45 dakikada gidilir. Sonbahar (kasım) ve kiraz çiçeği mevsimi (mart sonu-nisan başı) en kalabalık dönemlerdir; erken rezervasyon önerilir.",
  },
  {
    yol: 'osaka', ad: 'Osaka', foto: '/v7/fotos/osaka',
    baslik: "Osaka'da Türkçe Rehber Ferhat | Özel Osaka Turu",
    aciklama: "Osaka'da Türkçe konuşan özel rehber: Osaka Kalesi, Dotonbori, Shinsekai ve Kuromon Pazarı. Helal yemek ve cami bilgisi. Fiyat WhatsApp'tan.",
    giris: "Osaka, Japonya'nın mutfağı olarak bilinir: sokak yemekleri, neon ışıklar ve samimi insanlar. Kansai havalimanına (KIX) en yakın büyük şehir olduğu için çoğu Türk gezgin yolculuğuna burada başlar.",
    yerler: [
      ['Osaka Kalesi', 'Şehrin simgesi; parkı ve surlarıyla sabah yürüyüşü için ideal.'],
      ['Dotonbori', 'Kanal kenarındaki ışıklı tabelalar ve sokak yemekleri.'],
      ['Shinsekai', 'Tsutenkaku Kulesi\'nin çevresindeki eski Osaka mahallesi.'],
      ['Kuromon Pazarı', 'Taze deniz ürünleri ve meyve tezgâhlarıyla "Osaka\'nın mutfağı".'],
      ['Umeda', 'Gökdelenler, alışveriş ve şehrin manzarası.'],
    ],
    ipucu: "Osaka'da birçok helal sertifikalı veya Müslüman dostu restoran var; Ferhat gün içinde yemek ve namaz molalarını programa ekleyebilir.",
  },
  {
    yol: 'nara', ad: 'Nara', foto: '/v7/fotos/nara',
    baslik: "Nara'da Türkçe Rehber Ferhat | Nara Geyikleri ve Todai-ji",
    aciklama: "Nara'da Türkçe konuşan özel rehber: Nara Parkı'nın geyikleri, Todai-ji'deki dev Buda ve Kasuga Taisha. Osaka veya Kyoto'dan günübirlik. Fiyat WhatsApp'tan.",
    giris: "Nara, Japonya'nın ilk kalıcı başkenti. Parkta serbestçe dolaşan geyikler ve dünyanın en büyük ahşap yapılarından biri olan Todai-ji ile Osaka veya Kyoto'dan yarım günde rahatça gezilir.",
    yerler: [
      ['Nara Parkı', 'Selamlaşmak için başını eğen geyikleriyle ünlü park.'],
      ['Todai-ji', 'İçinde dev bronz Buda heykeli bulunan ahşap tapınak.'],
      ['Kasuga Taisha', 'Yüzlerce taş ve bronz fenerle çevrili Şinto tapınağı.'],
      ['Naramachi', 'Eski tüccar evlerinin bulunduğu sakin mahalle.'],
    ],
    ipucu: "Nara, Kyoto ile aynı gün birleştirilebilir (sabah Fushimi Inari, öğleden sonra Nara) ya da Osaka'dan yarım günlük tur olarak yapılabilir.",
  },
  {
    yol: 'kobe', ad: 'Kobe', foto: '/v7/fotos/kobe',
    baslik: "Kobe'de Türkçe Rehber Ferhat | Kobe Camii ve Liman",
    aciklama: "Kobe'de Türkçe konuşan özel rehber: 1935'te açılan Kobe Camii (Japonya'nın ilk camisi), Kitano, liman ve Rokko Dağı. Fiyat WhatsApp'tan.",
    giris: "Kobe, dağ ile deniz arasında kurulmuş liman şehri. Müslüman gezginler için özel bir yeri var: 1935'te açılan Kobe Camii, Japonya'da inşa edilen ilk camidir ve bugün de cuma namazı kılınır.",
    yerler: [
      ['Kobe Camii', '1935\'te açılan, Japonya\'nın ilk camisi. Kitano mahallesinde.'],
      ['Kitano İjinkan', 'Yabancı tüccarların 19. yüzyılda yaptırdığı Batı tarzı evler.'],
      ['Harborland ve Meriken Parkı', 'Liman kenarında yürüyüş ve Kobe Port Tower.'],
      ['Rokko Dağı', 'Teleferikle çıkılan ve şehri tepeden gören dağ.'],
    ],
    ipucu: "Kobe, Osaka'dan trenle yaklaşık 20-30 dakika. Cuma günü Kobe Camii'de namaz kılmak isteyenler için program buna göre ayarlanabilir.",
  },
  {
    yol: 'himeji', ad: 'Himeji', foto: '/v7/fotos/himeji',
    baslik: "Himeji Kalesi Türkçe Rehber Ferhat | Himeji Turu",
    aciklama: "Himeji'de Türkçe konuşan özel rehber: UNESCO Dünya Mirası Himeji Kalesi ve Kokoen bahçesi. Osaka veya Kobe'den günübirlik. Fiyat WhatsApp'tan.",
    giris: "Himeji Kalesi, beyaz duvarları yüzünden \"Beyaz Balıkçıl Kalesi\" diye anılır ve 1993'te UNESCO Dünya Mirası listesine giren Japonya'nın ilk yerlerinden biridir. Savaşlardan ve depremlerden sağlam çıkmış özgün kalelerin en büyüğüdür.",
    yerler: [
      ['Himeji Kalesi', 'Özgün ahşap iç yapısıyla ana kuleye tırmanış.'],
      ['Kokoen', 'Kalenin hemen yanındaki Japon bahçeleri.'],
    ],
    ipucu: "Himeji, Shinkansen ile Shin-Osaka'dan yaklaşık 30 dakika. Kobe ile aynı gün birleştirmek mümkündür.",
  },
]

const SSS = [
  ['Ferhat kimdir?', "Ferhat, Türk bir tur rehberidir ve 4 yıldır Japonya'da yaşıyor. Kansai bölgesinde (Kyoto, Osaka, Nara, Kobe, Himeji) Türkçe özel turlar yapıyor. Tony Kansai Guide ekibinin Türkçe rehberidir."],
  ['Tur hangi dilde?', 'Tur tamamen Türkçe. Ferhat yalnızca Türkçe rehberlik yapar; bu yüzden Japonya\'da kendi dilinizde soru sorup cevap alabilirsiniz.'],
  ['Fiyat ne kadar?', "Fiyat; kişi sayısına, tur süresine ve gidilecek yerlere göre değişir. Ferhat fiyatı WhatsApp'tan, programınızı öğrendikten sonra net olarak bildirir. Fiyatları makuldür."],
  ['Fiyata neler dahil değil?', 'Tren ve otobüs biletleri, müze ve tapınak giriş ücretleri ve yemekler genellikle fiyata dahil değildir; gün içinde siz ödersiniz.'],
  ['Tur özel mi, grup turu mu?', 'Özel tur: rehber sadece sizin aileniz veya arkadaş grubunuz içindir. Başka turistlerle birleştirilmez.'],
  ['Helal yemek ve namaz için yardım var mı?', "Evet. Kyoto ve Osaka'daki helal ve Müslüman dostu restoranlar ile camiler (örneğin Kobe Camii) programa eklenebilir, namaz vakitlerine göre mola verilir."],
  ['Nasıl rezervasyon yapılır?', `WhatsApp'tan yazın (${WA_VISIBLE}): tarihlerinizi, kişi sayısını ve kaldığınız otel veya şehri belirtin. Ferhat size Türkçe dönüş yapar.`],
  ['Hangi şehirlerde tur var?', "Kyoto, Osaka, Nara, Kobe ve Himeji. Hiroshima, Miyajima ve Koyasan gibi daha uzak yerlere günübirlik turlar için de WhatsApp'tan sorabilirsiniz."],
]

const CSS = `
:root{--bg:#fbfaf7;--fg:#1b1b1b;--soluk:#5c5c5c;--kart:#fff;--cizgi:#e6e2da;--kirmizi:#c8102e;--yesil:#128c4a}
@media (prefers-color-scheme:dark){:root{--bg:#121212;--fg:#ededed;--soluk:#a8a8a8;--kart:#1c1c1c;--cizgi:#2e2e2e;--kirmizi:#ff4d5e;--yesil:#2fbf71}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--fg);font:17px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.kap{max-width:760px;margin:0 auto;padding:0 16px}
header{border-bottom:1px solid var(--cizgi)}header .kap{display:flex;justify-content:space-between;align-items:center;gap:12px;padding-block:14px;flex-wrap:wrap}
header a{color:var(--fg);text-decoration:none;font-weight:600}header nav{display:flex;gap:14px;flex-wrap:wrap;font-size:15px}header nav a{font-weight:500;color:var(--soluk)}
.kahraman{position:relative;margin:0;aspect-ratio:16/8;overflow:hidden;background:#333}.kahraman img{width:100%;height:100%;object-fit:cover;display:block}
h1{font-size:clamp(28px,5vw,40px);line-height:1.2;margin:28px 0 8px}h2{font-size:24px;margin:40px 0 10px}h3{font-size:18px;margin:0 0 4px}
.alt{font-size:19px;color:var(--soluk);margin:0 0 20px}
.btn{display:inline-block;background:var(--yesil);color:#fff;text-decoration:none;font-weight:600;padding:13px 22px;border-radius:999px;margin:8px 0}
.etiket{display:block;margin-top:20px;font-size:13px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--kirmizi)}
ul.ozet{padding-left:20px}ul.ozet li{margin:4px 0}
.izgara{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;padding:0;list-style:none}
.izgara li{background:var(--kart);border:1px solid var(--cizgi);border-radius:12px;padding:14px 16px}
.izgara a{color:var(--fg);text-decoration:none}.izgara p{margin:0;color:var(--soluk);font-size:15px}
details{background:var(--kart);border:1px solid var(--cizgi);border-radius:12px;padding:12px 16px;margin:8px 0}summary{font-weight:600;cursor:pointer}details p{margin:8px 0 0}
footer{border-top:1px solid var(--cizgi);margin-top:48px;padding:20px 0 40px;color:var(--soluk);font-size:14px}footer a{color:var(--soluk)}
a{color:var(--kirmizi)}`

function sayfa({ yol, baslik, aciklama, gorsel, jsonld, govde }) {
  const url = `${BASE}/tr/${yol ? `${yol}/` : ''}`
  return `<!doctype html>
<html lang="tr" data-estatica="turkce">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(baslik)}</title>
<meta name="description" content="${esc(aciklama)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="tr" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Tony Kansai Guide">
<meta property="og:locale" content="tr_TR">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(baslik)}">
<meta property="og:description" content="${esc(aciklama)}">
<meta property="og:image" content="${BASE}${gorsel}.webp">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<style>${CSS}</style>
</head>
<body>
<header><div class="kap"><a href="/tr/">Ferhat · Japonya Türkçe Rehber</a>
<nav aria-label="Şehirler">${SEHIRLER.map((s) => `<a href="/tr/${s.yol}/">${s.ad}</a>`).join('')}</nav></div></header>
<main>
${govde}
</main>
<footer><div class="kap">
<p>Ferhat, <a href="/en/">Tony Kansai Guide</a> ekibinin Türkçe rehberidir (Kansai, Japonya). WhatsApp: <a href="${WA_GENEL}">${WA_VISIBLE}</a> · <a href="mailto:tony@tonykansaiguide.com">tony@tonykansaiguide.com</a></p>
<p>Diğer diller: <a href="/es/" hreflang="es">Español</a> · <a href="/en/" hreflang="en">English</a> · <a href="/ar/" hreflang="ar">العربية</a> · <a href="/ru/" hreflang="ru">Русский</a> · Son güncelleme: ${HOY}</p>
</div></footer>
</body>
</html>
`
}

const rehber = {
  '@type': 'Person', '@id': `${BASE}/tr/#ferhat`, name: 'Ferhat',
  jobTitle: 'Türkçe tur rehberi', nationality: { '@type': 'Country', name: 'Türkiye' },
  knowsLanguage: [{ '@type': 'Language', name: 'Türkçe', alternateName: 'tr' }],
  homeLocation: { '@type': 'Place', name: 'Kansai, Japonya' },
  worksFor: { '@type': 'Organization', '@id': `${BASE}/#organization`, name: 'Tony Kansai Guide', url: `${BASE}/` },
  url: `${BASE}/tr/`, description: "4 yıldır Japonya'da yaşayan Türk tur rehberi. Kyoto, Osaka, Nara, Kobe ve Himeji'de Türkçe özel turlar.",
}
const hizmet = (sehir) => ({
  '@type': 'Service', name: sehir ? `${sehir.ad} Türkçe özel tur` : "Japonya'da Türkçe özel rehberli tur (Kansai)",
  serviceType: 'Özel tur rehberliği', provider: { '@id': `${BASE}/tr/#ferhat` }, availableLanguage: 'tr',
  areaServed: (sehir ? [sehir] : SEHIRLER).map((s) => ({ '@type': 'City', name: s.ad, containedInPlace: { '@type': 'Country', name: 'Japonya' } })),
  audience: { '@type': 'Audience', audienceType: 'Türkiye\'den ve Türkçe konuşan gezginler', geographicArea: { '@type': 'Country', name: 'Türkiye' } },
  url: `${BASE}/tr/${sehir ? `${sehir.yol}/` : ''}`,
})
const iletisim = `<p><a class="btn" href="${WA_GENEL}">WhatsApp'tan Ferhat'a yaz</a></p>`

// Ana sayfa
{
  const govde = `
<figure class="kahraman"><img src="/v7/fotos/kioto.webp" alt="Kyoto, Fushimi Inari" width="1600" height="800"></figure>
<div class="kap">
<span class="etiket">Japonya · Kansai · Türkçe</span>
<h1>Japonya'da Türkçe Rehber: Ferhat</h1>
<p class="alt">Kyoto, Osaka, Nara, Kobe ve Himeji'de Türkçe özel turlar. Rehber sadece sizin grubunuz için.</p>
${iletisim}
<h2>Kısaca</h2>
<ul class="ozet">
<li><strong>Kim:</strong> Ferhat, Türk tur rehberi; 4 yıldır Japonya'da yaşıyor.</li>
<li><strong>Dil:</strong> Türkçe. Tur baştan sona Türkçe anlatılır.</li>
<li><strong>Nerede:</strong> Kansai bölgesi: Kyoto, Osaka, Nara, Kobe, Himeji. Hiroshima, Miyajima ve Koyasan için günübirlik turlar sorulabilir.</li>
<li><strong>Tur tipi:</strong> Özel tur, sadece sizin aileniz veya grubunuz. Başka turistlerle birleştirilmez.</li>
<li><strong>Fiyat:</strong> Gruba ve programa göre WhatsApp'tan bildirilir; makul fiyatlar. Ulaşım, giriş ücretleri ve yemekler genellikle dahil değildir.</li>
<li><strong>Müslüman gezginler için:</strong> Helal ve Müslüman dostu restoranlar, camiler ve namaz molaları programa eklenebilir.</li>
<li><strong>İletişim:</strong> WhatsApp <a href="${WA_GENEL}">${WA_VISIBLE}</a></li>
</ul>
<h2>Neden Türkçe rehber?</h2>
<p>Japonya'da İngilizce her yerde konuşulmaz; tabelalar, tren hatları ve menüler ilk gelişte kafa karıştırabilir. Türkçe bir rehberle tarihi ve kültürü kendi dilinizde dinler, sorularınızı rahatça sorarsınız. Ferhat 4 yıldır Japonya'da yaşadığı için trenleri, kalabalık saatleri, nerede ne yeneceğini ve Türk gezginlerin nelere dikkat etmesi gerektiğini bilir.</p>
<h2>Turlar ve şehirler</h2>
<ul class="izgara">
${SEHIRLER.map((s) => `<li><a href="/tr/${s.yol}/"><h3>${s.ad}</h3><p>${esc(s.yerler.slice(0, 3).map((y) => y[0]).join(', '))}</p></a></li>`).join('\n')}
</ul>
<h2>Nasıl çalışır?</h2>
<ol>
<li>WhatsApp'tan yazın: tarihler, kişi sayısı, kaldığınız şehir veya otel.</li>
<li>Ferhat size Türkçe bir program ve fiyat önerir.</li>
<li>Tur günü buluşur, gün boyunca Türkçe anlatımla gezersiniz.</li>
</ol>
<h2>Sık sorulan sorular</h2>
${SSS.map(([s, c]) => `<details><summary>${esc(s)}</summary><p>${esc(c)}</p></details>`).join('\n')}
<h2>Rezervasyon</h2>
<p>Tarihlerinizi ve kişi sayınızı yazın, Ferhat Türkçe dönüş yapsın.</p>
${iletisim}
</div>`
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      rehber, hizmet(null),
      { '@type': 'FAQPage', inLanguage: 'tr', mainEntity: SSS.map(([s, c]) => ({ '@type': 'Question', name: s, acceptedAnswer: { '@type': 'Answer', text: c } })) },
      { '@type': 'WebPage', url: `${BASE}/tr/`, inLanguage: 'tr', name: "Japonya'da Türkçe Rehber: Ferhat", dateModified: HOY, about: { '@id': `${BASE}/tr/#ferhat` } },
    ],
  }
  yaz('', sayfa({
    yol: '', gorsel: '/v7/fotos/kioto', jsonld, govde,
    baslik: "Japonya'da Türkçe Rehber Ferhat | Kyoto, Osaka, Nara Özel Tur",
    aciklama: "Ferhat, 4 yıldır Japonya'da yaşayan Türk rehber. Kyoto, Osaka, Nara, Kobe ve Himeji'de Türkçe özel turlar; helal yemek ve cami bilgisi. Fiyat WhatsApp'tan.",
  }))
}

// Şehir sayfaları
for (const s of SEHIRLER) {
  const yazi = wa(`Merhaba Ferhat, ${s.ad} için Türkçe rehber arıyorum. Tarihler: `)
  const govde = `
<figure class="kahraman"><img src="${s.foto}.webp" alt="${esc(s.ad)}" width="1600" height="800"></figure>
<div class="kap">
<span class="etiket"><a href="/tr/">Türkçe rehber</a> · ${s.ad}</span>
<h1>${s.ad}'${s.ad === 'Kobe' || s.ad === 'Himeji' ? 'de' : 'da'} Türkçe Rehber: Ferhat</h1>
<p class="alt">${esc(s.giris)}</p>
<p><a class="btn" href="${yazi}">WhatsApp'tan ${s.ad} turu sor</a></p>
<h2>${s.ad}'${s.ad === 'Kobe' || s.ad === 'Himeji' ? 'de' : 'da'} neler görülür?</h2>
<ul class="izgara">
${s.yerler.map(([ad, metin]) => `<li><h3>${esc(ad)}</h3><p>${esc(metin)}</p></li>`).join('\n')}
</ul>
<h2>İpucu</h2>
<p>${esc(s.ipucu)}</p>
<h2>Tur bilgileri</h2>
<ul class="ozet">
<li><strong>Rehber:</strong> Ferhat, Türk; 4 yıldır Japonya'da yaşıyor.</li>
<li><strong>Dil:</strong> Türkçe.</li>
<li><strong>Tur tipi:</strong> Özel tur, sadece sizin grubunuz.</li>
<li><strong>Fiyat:</strong> Gruba ve programa göre WhatsApp'tan; makul fiyatlar.</li>
<li><strong>İletişim:</strong> WhatsApp <a href="${yazi}">${WA_VISIBLE}</a></li>
</ul>
<p>Diğer şehirler: ${SEHIRLER.filter((x) => x !== s).map((x) => `<a href="/tr/${x.yol}/">${x.ad}</a>`).join(' · ')} · <a href="/tr/">Ana sayfa</a></p>
</div>`
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      rehber, hizmet(s),
      { '@type': 'TouristDestination', name: s.ad, includesAttraction: s.yerler.map(([ad]) => ({ '@type': 'TouristAttraction', name: ad })) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Türkçe rehber', item: `${BASE}/tr/` },
        { '@type': 'ListItem', position: 2, name: s.ad, item: `${BASE}/tr/${s.yol}/` },
      ] },
    ],
  }
  yaz(s.yol, sayfa({ yol: s.yol, baslik: s.baslik, aciklama: s.aciklama, gorsel: s.foto, jsonld, govde }))
}

function yaz(yol, html) {
  const dir = join(root, 'public/tr', yol)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
}
console.log(`tr: ${SEHIRLER.length + 1} sayfa en public/tr/`)
