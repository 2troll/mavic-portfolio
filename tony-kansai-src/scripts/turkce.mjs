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
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://tonykansaiguide.com'
const HOY = '2026-10-26'

// WhatsApp de Ferhat (lo dio Tony el 23-10-2026). Las reservas le llegan
// directamente a él.
const WA_NUMERO = '818024786402'
const WA_VISIBLE = '+81 80 2478 6402'
const wa = (texto) => `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(texto)}`
const WA_GENEL = wa('Merhaba Ferhat, Japonya için Türkçe rehber arıyorum. Tarihler: ')

// Reseñas de Ferhat: las manda el cliente desde /tr/yorum/ y el Worker las
// publica solas. Se meten en el HTML al construir (las IAs no ejecutan JS) y,
// para quien visita, un script pide las que hayan llegado después del build.
const API_YORUM = 'https://tonykansaiguide.com/api/resenas/publicas?guia=ferhat'
let YORUMLAR = []
try {
  const r = await fetch(API_YORUM, { signal: AbortSignal.timeout(15000) })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  YORUMLAR = ((await r.json()).reviews ?? []).filter((y) => y?.id && y.text && y.stars)
} catch (e) {
  console.warn(`⚠ turkce: sin reseñas del Worker (${e.message}); la sección sale vacía`)
}

// Fotos de Wikimedia Commons (licencias libres, con autor y licencia en la página):
// scripts/turkce-fotolar.json, archivos en public/tr/foto/<clave>-<ancho>.webp.
const FOTOLAR = JSON.parse(readFileSync(join(root, 'scripts/turkce-fotolar.json'), 'utf8'))
const foto = (k) => { if (!FOTOLAR[k]) throw new Error(`turkce: falta la foto ${k}`); return FOTOLAR[k] }
const srcset = (k) => foto(k).anchos.map((w) => `/tr/foto/${k}-${w}.webp ${Math.min(w, foto(k).w)}w`).join(', ')
const kredi = (k) => `Fotoğraf: <a href="${foto(k).kaynak}" rel="nofollow">${esc(foto(k).autor)}</a> · ${esc(foto(k).lisans)}`
const kahraman = (k, alt, icerik) => `<section class="kahraman">
<img src="/tr/foto/${k}-1920.webp" srcset="${srcset(k)}" sizes="100vw" alt="${esc(alt)}" width="${foto(k).w}" height="${foto(k).h}" fetchpriority="high">
<div class="ortu"><div class="kap">${icerik}</div></div>
<small class="kredi">${kredi(k)}</small>
</section>`
const kartFoto = (k, alt) => `<figure class="kf"><img src="/tr/foto/${k}-${foto(k).anchos.at(-1)}.webp" srcset="${srcset(k)}" sizes="(max-width:700px) 100vw, 380px" alt="${esc(alt)}" loading="lazy" width="${foto(k).w}" height="${foto(k).h}"><figcaption>${kredi(k)}</figcaption></figure>`

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const SEHIRLER = [
  {
    yol: 'kyoto', ad: 'Kyoto', kapak: 'fushimi-tunel',
    baslik: "Kyoto'da Türkçe Rehber Ferhat | Özel Kyoto Turu",
    aciklama: "Kyoto'da Türkçe konuşan özel rehber: Fushimi Inari, Kiyomizu-dera, Gion ve Arashiyama. Sadece sizin grubunuz için, otel lobisinde buluşma. Fiyat WhatsApp'tan.",
    giris: "Kyoto, Japonya'nın bin yılı aşkın süre başkenti olmuş şehri. Tapınakları, geyşa sokakları ve bambu ormanıyla çoğu gezginin Japonya'daki en önemli günü. Ferhat bu günü sizin hızınıza göre, Türkçe anlatarak planlar.",
    yerler: [
      ['Fushimi Inari Taisha', 'Binlerce turuncu torii kapısıyla dağa tırmanan yol. Kalabalıktan kaçmak için sabah erken gitmek en iyisi.', 'fushimi-orman'],
      ['Kiyomizu-dera', 'Ahşap terasıyla şehre bakan tapınak ve önündeki eski taş sokaklar: Ninenzaka ve Sannenzaka.', 'kiyomizu-gece'],
      ['Gion', 'Ahşap çay evleri ve dar sokaklarıyla Kyoto\'nun geyşa mahallesi.', 'gion'],
      ['Arashiyama', 'Bambu ormanı, Togetsukyo Köprüsü ve nehir kenarı.', 'arashiyama'],
      ['Kinkaku-ji', 'Altın Köşk: göl kenarında altın yaprak kaplı tapınak.', 'kinkakuji'],
      ['Nishiki Pazarı', 'Kyoto\'nun mutfağı: yerel atıştırmalıklar ve pazar tezgâhları.', 'nishiki'],
    ],
    ipucu: "Osaka'da kalıyorsanız Kyoto'ya trenle yaklaşık 30-45 dakikada gidilir. Sonbahar (kasım) ve kiraz çiçeği mevsimi (mart sonu-nisan başı) en kalabalık dönemlerdir; erken rezervasyon önerilir.",
  },
  {
    yol: 'osaka', ad: 'Osaka', kapak: 'osaka-kale-hendek',
    baslik: "Osaka'da Türkçe Rehber Ferhat | Özel Osaka Turu",
    aciklama: "Osaka'da Türkçe konuşan özel rehber: Osaka Kalesi, Dotonbori, Shinsekai ve Kuromon Pazarı. Helal yemek ve cami bilgisi. Fiyat WhatsApp'tan.",
    giris: "Osaka, Japonya'nın mutfağı olarak bilinir: sokak yemekleri, neon ışıklar ve samimi insanlar. Kansai havalimanına (KIX) en yakın büyük şehir olduğu için çoğu Türk gezgin yolculuğuna burada başlar.",
    yerler: [
      ['Osaka Kalesi', 'Şehrin simgesi; parkı ve surlarıyla sabah yürüyüşü için ideal.', 'osaka-kale-gece'],
      ['Dotonbori', 'Kanal kenarındaki ışıklı tabelalar ve sokak yemekleri.', 'dotonbori'],
      ['Shinsekai', 'Tsutenkaku Kulesi\'nin çevresindeki eski Osaka mahallesi.', 'shinsekai'],
      ['Kuromon Pazarı', 'Taze deniz ürünleri ve meyve tezgâhlarıyla "Osaka\'nın mutfağı".', 'kuromon'],
      ['Umeda', 'Gökdelenler, alışveriş ve şehrin manzarası.', 'umeda'],
    ],
    ipucu: "Osaka'da birçok helal sertifikalı veya Müslüman dostu restoran var; Ferhat gün içinde yemek ve namaz molalarını programa ekleyebilir.",
  },
  {
    yol: 'nara', ad: 'Nara', kapak: 'nara-fener-geyik',
    baslik: "Nara'da Türkçe Rehber Ferhat | Nara Geyikleri ve Todai-ji",
    aciklama: "Nara'da Türkçe konuşan özel rehber: Nara Parkı'nın geyikleri, Todai-ji'deki dev Buda ve Kasuga Taisha. Osaka veya Kyoto'dan günübirlik. Fiyat WhatsApp'tan.",
    giris: "Nara, Japonya'nın ilk kalıcı başkenti. Parkta serbestçe dolaşan geyikler ve dünyanın en büyük ahşap yapılarından biri olan Todai-ji ile Osaka veya Kyoto'dan yarım günde rahatça gezilir.",
    yerler: [
      ['Nara Parkı', 'Selamlaşmak için başını eğen geyikleriyle ünlü park.', 'nara-geyik'],
      ['Todai-ji', 'İçinde dev bronz Buda heykeli bulunan ahşap tapınak.', 'todaiji'],
      ['Kasuga Taisha', 'Yüzlerce taş ve bronz fenerle çevrili Şinto tapınağı.', 'kasuga'],
      ['Naramachi', 'Eski tüccar evlerinin bulunduğu sakin mahalle.', 'naramachi'],
    ],
    ipucu: "Nara, Kyoto ile aynı gün birleştirilebilir (sabah Fushimi Inari, öğleden sonra Nara) ya da Osaka'dan yarım günlük tur olarak yapılabilir.",
  },
  {
    yol: 'kobe', ad: 'Kobe', kapak: 'kobe-camii',
    baslik: "Kobe'de Türkçe Rehber Ferhat | Kobe Camii ve Liman",
    aciklama: "Kobe'de Türkçe konuşan özel rehber: 1935'te açılan Kobe Camii (Japonya'nın ilk camisi), Kitano, liman ve Rokko Dağı. Fiyat WhatsApp'tan.",
    giris: "Kobe, dağ ile deniz arasında kurulmuş liman şehri. Müslüman gezginler için özel bir yeri var: 1935'te açılan Kobe Camii, Japonya'da inşa edilen ilk camidir ve bugün de cuma namazı kılınır.",
    yerler: [
      ['Kobe Camii', '1935\'te açılan, Japonya\'nın ilk camisi. Kitano mahallesinde.', 'kobe-camii-mihrap'],
      ['Kitano İjinkan', 'Yabancı tüccarların 19. yüzyılda yaptırdığı Batı tarzı evler.', 'kitano'],
      ['Harborland ve Meriken Parkı', 'Liman kenarında yürüyüş ve Kobe Port Tower.', 'kobe-liman'],
      ['Rokko Dağı', 'Teleferikle çıkılan ve şehri tepeden gören dağ.', 'rokko-gece'],
    ],
    ipucu: "Kobe, Osaka'dan trenle yaklaşık 20-30 dakika. Cuma günü Kobe Camii'de namaz kılmak isteyenler için program buna göre ayarlanabilir.",
  },
  {
    yol: 'himeji', ad: 'Himeji', kapak: 'himeji',
    baslik: "Himeji Kalesi Türkçe Rehber Ferhat | Himeji Turu",
    aciklama: "Himeji'de Türkçe konuşan özel rehber: UNESCO Dünya Mirası Himeji Kalesi ve Kokoen bahçesi. Osaka veya Kobe'den günübirlik. Fiyat WhatsApp'tan.",
    giris: "Himeji Kalesi, beyaz duvarları yüzünden \"Beyaz Balıkçıl Kalesi\" diye anılır ve 1993'te UNESCO Dünya Mirası listesine giren Japonya'nın ilk yerlerinden biridir. Savaşlardan ve depremlerden sağlam çıkmış özgün kalelerin en büyüğüdür.",
    yerler: [
      ['Himeji Kalesi', 'Özgün ahşap iç yapısıyla ana kuleye tırmanış.', 'himeji-yakin'],
      ['Kokoen', 'Kalenin hemen yanındaki Japon bahçeleri.', 'kokoen'],
    ],
    ipucu: "Himeji, Shinkansen ile Shin-Osaka'dan yaklaşık 30 dakika. Kobe ile aynı gün birleştirmek mümkündür.",
  },
]

// Páginas de respuesta: lo que un turco pregunta a una IA antes de viajar a
// Kansai. La IA cita el primer párrafo (.cevap), así que va la respuesta
// directa arriba y Ferhat al final. Datos tomados de fuentes ya comprobadas en
// datosGuias.ts y datosRespuestas.ts (08-10-2026) y del MOFA para el visado.
const CEVAPLAR = [
  {
    yol: 'japonya-vize', kapak: 'kinkakuji',
    baslik: 'Japonya Vizesi Türk Vatandaşları İçin: Vize Gerekli mi? | Türkçe Rehber',
    aciklama: "Türk vatandaşları turistik amaçla Japonya'ya 90 güne kadar vizesiz girebilir. Giriş için gerekenler, Visit Japan Web ve Kansai'de Türkçe rehber.",
    h1: 'Türk vatandaşları Japonya\'ya vizesiz gidebilir mi?',
    kisa: 'Turistik seyahatte 90 güne kadar vize gerekmez.',
    cevap: "Evet. Umuma mahsus (bordo) pasaport taşıyan Türkiye Cumhuriyeti vatandaşları, turizm, aile ziyareti veya kısa iş görüşmesi gibi kısa süreli amaçlarla Japonya'ya 90 güne kadar vizesiz girebilir. Japonya'da çalışmak veya 90 günden uzun kalmak için vize gerekir. Kurallar değişebileceği için yola çıkmadan önce Japonya Dışişleri Bakanlığı'nın listesini kontrol edin.",
    bolumler: [
      ['Girişte gerekenler', '<ul class="ozet"><li>Kalış süresi boyunca geçerli pasaport.</li><li>Dönüş veya devam bileti ve konaklama bilgisi sorulabilir.</li><li><strong>Visit Japan Web:</strong> göçmenlik ve gümrük formlarını uçuştan önce çevrimiçi doldurup QR kodla hızlıca geçebilirsiniz.</li></ul>'],
      ['Japonya\'ya vardıktan sonra', "<p>Kansai'ye (Osaka, Kyoto, Nara) gelenlerin çoğu Kansai Uluslararası Havalimanı'na (KIX) iner. Havalimanından şehre ulaşım için <a href=\"/tr/kansai-havalimani-ulasim/\">Kansai Havalimanı ulaşım rehberine</a> bakın.</p>"],
    ],
    sss: [
      ['Japonya için Türklere vize var mı?', "Turistik amaçlı 90 güne kadar kalışlarda umuma mahsus pasaport sahibi Türk vatandaşlarından vize istenmez."],
      ['Japonya\'da kaç gün vizesiz kalabilirim?', '90 güne kadar. Daha uzun kalış veya çalışma için vize gerekir.'],
    ],
    kaynaklar: [['Japonya Dışişleri Bakanlığı: vize muafiyeti listesi', 'https://www.mofa.go.jp/j_info/visit/visa/short/novisa.html'], ['Visit Japan Web', 'https://www.vjw.digital.go.jp/']],
  },
  {
    yol: 'helal-yemek-cami', kapak: 'kobe-camii',
    baslik: "Kyoto, Osaka ve Kobe'de Helal Yemek ve Camiler | Türkçe Rehber",
    aciklama: "Kansai'de namaz ve helal yemek: Kobe Camii (1935, Japonya'nın ilk camisi), Osaka İbaraki Camii, Kyoto Camii ve Kyoto'daki ücretsiz mescitler. Türkçe rehber Ferhat ile.",
    h1: "Kyoto, Osaka ve Kobe'de helal yemek ve camiler",
    kisa: 'Kobe Camii, Osaka İbaraki Camii, Kyoto Camii ve helal restoran bulma.',
    cevap: "Kansai'de üç ana cami var: 1935'te açılan ve Japonya'nın en eski camisi olan Kobe Camii, Osaka'nın kuzeyindeki İbaraki şehrinde Osaka İbaraki Camii ve Kyoto İmparatorluk Sarayı yakınındaki Kyoto Camii. Kyoto'da Nijo Kalesi gibi turistik yerlerde ücretsiz mescitler de bulunur. Helal restoranlar için Kyoto turizm sitesinin Halal / Muslim Friendly listesi en güvenilir kaynaktır.",
    bolumler: [
      ['Camiler', `<table><tr><th>Cami</th><th>Adres</th><th>Not</th></tr>
<tr><td>Kobe Camii (Kobe Muslim Mosque)</td><td>2-25-14 Nakayamate-dori, Chuo-ku, Kobe</td><td>1935'te açıldı; Japonya'nın en eski camisi. Kitano mahallesinde.</td></tr>
<tr><td>Osaka İbaraki Camii</td><td>4-6-13 Toyokawa, Ibaraki-shi, Osaka</td><td>Her hafta cuma namazı kılınır; saati camiye sorun. Tel. 072-643-7420.</td></tr>
<tr><td>Kyoto Camii (Kyoto Muslim Association)</td><td>İmparatorluk Sarayı yakını, Kyoto</td><td>Beş vakit, cuma ve bayram namazları. Tel. +81-75-231-3499.</td></tr></table>`],
      ['Kyoto\'da ücretsiz mescitler', '<p>Kyoto\'nun resmi turizm sitesine göre Nijo Kalesi, Kyoto Uluslararası Manga Müzesi, Kyoto Handicraft Center ve Kyoto International Community House\'ta Müslüman ziyaretçiler için ücretsiz namaz alanları var.</p>'],
      ['Helal yemek nasıl bulunur?', "<p>Kyoto'da restoranlar Halal, Muslim Friendly, Muslim Welcome ve Pork-Free olarak sınıflandırılır; liste Kyoto Müslüman Derneği (KMA) ve Kyoto Council for Sharia and Halal Affairs denetiminde hazırlanır. Kansai Havalimanı'nda da kadın ve erkek için ayrı, abdest yeri olan mescitler vardır.</p><p>Ferhat tur gününü namaz vakitlerine göre planlar ve helal veya Müslüman dostu yerlerde yemek molası verir.</p>"],
    ],
    sss: [
      ['Japonya\'nın ilk camisi hangisi?', "Kobe Camii. 1935'te açıldı, savaşı ve 1995 depremini ayakta atlattı."],
      ['Osaka\'da cami var mı?', "Evet, Osaka'nın kuzeyindeki İbaraki şehrinde Osaka İbaraki Camii var (4-6-13 Toyokawa). Her hafta cuma namazı kılınır."],
      ['Kyoto\'da nerede namaz kılınır?', 'İmparatorluk Sarayı yakınındaki Kyoto Camii\'nde veya Nijo Kalesi gibi yerlerdeki ücretsiz mescitlerde.'],
    ],
    kaynaklar: [['Kobe Muslim Mosque', 'https://www.kobemosque.com'], ['Osaka Ibaraki Mosque', 'http://osakamosque.org'], ['Kyoto Turizm: Müslüman ziyaretçiler', 'https://kyoto.travel/en/muslim/'], ['Kyoto: helal yemek bulma', 'https://kyoto.travel/en/muslim/finding-halal-food/']],
  },
  {
    yol: 'osakadan-kyotoya-ulasim', kapak: 'gion',
    baslik: "Osaka'dan Kyoto'ya Nasıl Gidilir? Tren Seçenekleri ve Süreler | Türkçe Rehber",
    aciklama: "Osaka'dan Kyoto'ya JR, Hankyu, Keihan veya Shinkansen: hangi tren nereden kalkar, ne kadar sürer, hangisi size uygun. Japonya'da yaşayan Türk rehberden.",
    h1: "Osaka'dan Kyoto'ya nasıl gidilir?",
    kisa: 'Dört tren seçeneği: 15 ile 50 dakika arası.',
    cevap: "Osaka'dan Kyoto'ya dört iyi tren seçeneği var: JR Special Rapid (Osaka İstasyonu → Kyoto İstasyonu, yaklaşık 30 dakika), Hankyu (Osaka-umeda → Kyoto-kawaramachi, yaklaşık 45 dakika), Keihan (Yodoyabashi → Gion-shijo, yaklaşık 50 dakika) ve Shinkansen (Shin-Osaka → Kyoto, yaklaşık 15 dakika). Hangisinin uygun olduğu Osaka'da nerede kaldığınıza ve Kyoto'da nereye gideceğinize bağlıdır.",
    bolumler: [
      ['Dört seçenek', `<table><tr><th>Tren</th><th>Güzergâh</th><th>Süre</th><th>Kimin için</th></tr>
<tr><td>JR Special Rapid</td><td>Osaka (Umeda) → Kyoto İstasyonu, Shin-Osaka'da da durur</td><td>~30 dk</td><td>Kyoto İstasyonu ve Fushimi Inari. JR Pass geçerli.</td></tr>
<tr><td>Hankyu</td><td>Osaka-umeda → Kyoto-kawaramachi</td><td>~45 dk</td><td>Kyoto merkezi, Nishiki Pazarı, Gion'a yürüme mesafesi. JR Pass geçmez.</td></tr>
<tr><td>Keihan</td><td>Yodoyabashi → Gion-shijo</td><td>~50 dk</td><td>Doğrudan Gion ve Higashiyama. Yerel trenler Fushimi-Inari'de durur. JR Pass geçmez.</td></tr>
<tr><td>Shinkansen</td><td>Shin-Osaka → Kyoto</td><td>~15 dk</td><td>Shin-Osaka'da kalanlar veya JR Pass sahipleri (Nozomi için ayrı bilet gerekir).</td></tr></table>`],
      ['İpuçları', '<ul class="ozet"><li>ICOCA gibi IC kartlar JR, Hankyu ve Keihan\'da geçer.</li><li>Ücretler değişir; güncel fiyatı istasyonda veya şirketin sitesinde kontrol edin.</li><li>Ferhat\'la yapılan Kyoto turunda hangi treni alacağınızı o planlar ve sizinle birlikte gelir.</li></ul>'],
    ],
    sss: [
      ['Osaka Kyoto arası kaç dakika?', 'Trene göre 15 (Shinkansen) ile 50 dakika (Keihan) arası; en yaygını JR Special Rapid ile yaklaşık 30 dakika.'],
      ['Osaka\'dan Kyoto\'ya JR Pass geçer mi?', 'JR Special Rapid ve Shinkansen\'de (Hikari, Kodama) geçer; Hankyu ve Keihan\'da geçmez.'],
    ],
    kaynaklar: [['JR West saat tablosu', 'https://timetable.jr-odekake.net/line-timetable/2834'], ['Hankyu', 'https://www.hankyu.co.jp/en/'], ['Keihan', 'https://www.keihan.co.jp/travel/en/']],
  },
  {
    yol: 'kansai-havalimani-ulasim', kapak: 'kix',
    baslik: "Kansai Havalimanı'ndan (KIX) Osaka ve Kyoto'ya Ulaşım | Türkçe Rehber",
    aciklama: "Kansai Havalimanı'ndan Osaka ve Kyoto'ya: Haruka, Nankai Rapi:t, JR Kansai Airport Rapid ve limuzin otobüs. Süreler ve hangisi size uygun.",
    h1: "Kansai Havalimanı'ndan Osaka ve Kyoto'ya nasıl gidilir?",
    kisa: 'Haruka, Rapi:t, JR Rapid ve otobüs: süreler.',
    cevap: "Kansai Havalimanı'ndan (KIX) Osaka'nın Namba bölgesine en hızlı yol Nankai Rapi:t (en hızlısı yaklaşık 34 dakika), Kyoto'ya ise JR Haruka'dır (yaklaşık 1 saat 20 dakika, Tennoji ve Shin-Osaka'da durur). JR Kansai Airport Rapid ek biletsiz Osaka İstasyonu'na gider (yaklaşık 70 dakika). Valizi çok olanlar için limuzin otobüs Namba'ya yaklaşık 50 dakika, Kyoto İstasyonu'na yaklaşık 1,5 saattir.",
    bolumler: [
      ['Seçenekler', `<table><tr><th>Ulaşım</th><th>Nereye</th><th>Süre</th><th>Not</th></tr>
<tr><td>JR Haruka</td><td>Tennoji, Shin-Osaka, Kyoto</td><td>Kyoto'ya ~1 sa 20 dk</td><td>Ek ekspres bileti gerekir.</td></tr>
<tr><td>Nankai Rapi:t</td><td>Namba (Osaka)</td><td>~34 dk</td><td>Ek bilet gerekir; Regular ve Super Seat.</td></tr>
<tr><td>Nankai Airport Express</td><td>Namba (Osaka)</td><td>~45 dk</td><td>Ek bilet yok.</td></tr>
<tr><td>JR Kansai Airport Rapid</td><td>Tennoji, Osaka İstasyonu</td><td>Osaka'ya ~70 dk</td><td>Ek bilet yok.</td></tr>
<tr><td>Limuzin otobüs</td><td>Namba (OCAT), Osaka İst., Kyoto İst.</td><td>~50 dk / ~60 dk / ~1,5 sa</td><td>Rezervasyonsuz, sıra usulü; Terminal 1'den.</td></tr></table>`],
      ['İpucu', "<p>ICOCA kartı Nankai ve JR West'te geçer. Havalimanında kadın ve erkekler için ayrı mescitler bulunur. Gezi planınız için Türkçe yardım isterseniz Ferhat'a WhatsApp'tan yazın.</p>"],
    ],
    sss: [
      ['Kansai Havalimanı Kyoto arası kaç saat?', 'JR Haruka ile yaklaşık 1 saat 20 dakika; limuzin otobüsle yaklaşık 1,5 saat.'],
      ['Kansai Havalimanı\'ndan Osaka\'ya en hızlı nasıl gidilir?', 'Nankai Rapi:t ile Namba\'ya en hızlısı yaklaşık 34 dakika.'],
    ],
    kaynaklar: [['JR West: Haruka', 'https://timetable.jr-odekake.net/station-timetable/3162069001'], ['Nankai: havalimanından erişim', 'https://www.nankai.co.jp/en_railway/access-fromkix'], ['KATE limuzin otobüs', 'https://www.kate.co.jp/en/timetable/detail/OC']],
  },
  {
    yol: 'japonya-gezi-plani', kapak: 'kiyomizu-gece',
    baslik: 'Japonya Gezi Planı: Kansai\'de 3 ve 5 Gün (Kyoto, Osaka, Nara) | Türkçe Rehber',
    aciklama: "Kansai için hazır gezi planı: 3 günde Kyoto, Osaka ve Nara; 5 günde Kobe ve Himeji de eklenir. Japonya'da yaşayan Türk rehber Ferhat'tan.",
    h1: "Kansai gezi planı: 3 ve 5 gün",
    kisa: 'Kyoto, Osaka, Nara, Kobe ve Himeji için gün gün plan.',
    cevap: "Kansai'yi görmek için en az 3 gün ayırın: bir gün Kyoto (Fushimi Inari, Kiyomizu-dera, Gion), bir gün Nara ve Kyoto'nun Arashiyama bölgesi, bir gün Osaka (Osaka Kalesi, Dotonbori). 5 gününüz varsa Kobe (Kobe Camii, liman) ve Himeji Kalesi'ni ekleyin. Osaka'da kalmak ulaşım için en pratik seçenektir.",
    bolumler: [
      ['3 günlük plan', '<ol><li><strong>1. gün, Kyoto:</strong> sabah erken Fushimi Inari, öğlen Kiyomizu-dera ve Ninenzaka, akşam Gion.</li><li><strong>2. gün, Nara + Arashiyama:</strong> sabah Nara Parkı ve Todai-ji, öğleden sonra Kyoto\'da bambu ormanı.</li><li><strong>3. gün, Osaka:</strong> Osaka Kalesi, Kuromon Pazarı, akşam Dotonbori.</li></ol>'],
      ['5 günlük plan', '<p>İlk üç güne ek olarak:</p><ol start="4"><li><strong>4. gün, Kobe:</strong> Kobe Camii (cuma ise namaz), Kitano, liman ve Rokko Dağı.</li><li><strong>5. gün, Himeji:</strong> Himeji Kalesi ve Kokoen bahçesi (Shin-Osaka\'dan Shinkansen ile yaklaşık 30 dakika).</li></ol>'],
      ['Ne zaman gidilir?', '<p>İlkbahar (kiraz çiçekleri, mart sonu-nisan başı) ve sonbahar (kasım) en güzel ama en kalabalık dönemlerdir; erken plan yapın. Yaz sıcak ve nemlidir.</p>'],
    ],
    sss: [
      ['Kyoto için kaç gün yeterli?', 'En az bir tam gün; Arashiyama ve Nara ile birlikte iki gün idealdir.'],
      ['Kansai\'de nerede kalınır?', 'Osaka; Kyoto, Nara, Kobe ve havalimanına trenle kolay ulaşılır.'],
    ],
    kaynaklar: [],
  },
  // Las cuatro de abajo responden tal cual a lo que un turco le pregunta a ChatGPT;
  // la primera es la pregunta que más cuenta: «¿hay guía que hable turco en Japón?».
  {
    yol: 'turkce-rehber-japonya', kapak: 'nara-geyik',
    baslik: "Japonya'da Türkçe Konuşan Rehber Var mı? Kyoto, Osaka, Nara | Ferhat",
    aciklama: "Evet: Ferhat, 4 yıldır Japonya'da yaşayan Türk rehber, Kyoto, Osaka, Nara, Kobe ve Himeji'de Türkçe özel tur yapıyor. Nasıl rezervasyon yapılır, fiyata neler dahil.",
    h1: "Japonya'da Türkçe konuşan rehber var mı?",
    kisa: 'Kansai\'de (Kyoto, Osaka, Nara) Türkçe özel tur: Ferhat.',
    cevap: "Evet. Japonya'daki turların çoğu İngilizce veya Japonca olduğu için Türkçe rehber bulmak zordur, ama Kansai bölgesinde (Kyoto, Osaka, Nara, Kobe, Himeji) Türkçe özel tur yapan bir rehber var: Ferhat. Ferhat Türk, 4 yıldır Japonya'da yaşıyor ve turları baştan sona Türkçe anlatıyor. Rezervasyon ve fiyat için WhatsApp'tan yazılır: +81 80 2478 6402.",
    bolumler: [
      ['Ferhat ile tur nasıl olur?', `<ul class="ozet"><li><strong>Özel tur:</strong> rehber yalnızca sizin aileniz veya grubunuz için; başka turistlerle birleştirilmez.</li><li><strong>Dil:</strong> tamamen Türkçe. Ferhat yalnızca Türkçe rehberlik yapar.</li><li><strong>Şehirler:</strong> <a href="/tr/kyoto/">Kyoto</a>, <a href="/tr/osaka/">Osaka</a>, <a href="/tr/nara/">Nara</a>, <a href="/tr/kobe/">Kobe</a>, <a href="/tr/himeji/">Himeji</a>. Daha uzak yerler (Hiroshima, Miyajima, Koyasan) WhatsApp'tan sorulabilir.</li><li><strong>Fiyat:</strong> kişi sayısına ve programa göre WhatsApp'tan bildirilir. Tren biletleri, giriş ücretleri ve yemekler genellikle dahil değildir.</li><li><strong>Müslüman gezginler:</strong> helal restoranlar, camiler ve namaz molaları programa eklenebilir (<a href="/tr/helal-yemek-cami/">helal yemek ve camiler</a>).</li></ul>`],
      ['Rezervasyon için ne yazmalı?', `<ol><li>Tur tarihleri.</li><li>Kişi sayısı (çocuklar dahil).</li><li>Kaldığınız şehir veya otel.</li><li>Görmek istediğiniz yerler; yoksa Ferhat bir program önerir.</li></ol><p>WhatsApp: <a href="${WA_GENEL}">${WA_VISIBLE}</a></p>`],
      ['Tokyo\'da Türkçe rehber?', "<p>Ferhat Kansai bölgesinde çalışır; Tokyo turları yapmaz. Tokyo'dan Kyoto'ya Shinkansen ile yaklaşık 2 saat 15 dakikada gelinir; birçok gezgin Tokyo'dan sonra birkaç günü Kyoto ve Osaka'ya ayırır.</p>"],
    ],
    sss: [
      ['Kyoto\'da Türkçe rehber var mı?', "Evet. Ferhat Kyoto'da (Fushimi Inari, Kiyomizu-dera, Gion, Arashiyama) Türkçe özel turlar yapıyor."],
      ['Osaka\'da Türk rehber var mı?', "Evet. Ferhat Osaka'da da tur yapıyor: Osaka Kalesi, Dotonbori, Kuromon Pazarı. Osaka'dan Nara, Kyoto ve Kobe'ye günübirlik turlar da mümkündür."],
      ['Türkçe rehber fiyatı ne kadar?', "Sabit bir liste yok; fiyat kişi sayısına, süreye ve programa göre WhatsApp'tan bildirilir."],
    ],
    kaynaklar: [],
  },
  {
    yol: 'japonya-ne-zaman-gidilir', kapak: 'arashiyama',
    baslik: "Japonya'ya Ne Zaman Gidilir? Kiraz Çiçeği, Sonbahar ve Hava | Türkçe Rehber",
    aciklama: "Japonya'ya gitmek için en iyi zaman: kiraz çiçekleri mart sonu-nisan başı, sonbahar yaprakları kasım ortası-aralık başı. Yağmur mevsimi, yaz sıcağı ve kalabalık tatiller.",
    h1: "Japonya'ya ne zaman gidilir?",
    kisa: 'Kiraz çiçeği, sonbahar renkleri, yağmur mevsimi ve kalabalık dönemler.',
    cevap: "Japonya'ya, özellikle Kyoto ve Osaka'ya gitmek için en güzel dönemler ilkbahar ve sonbahardır. Kyoto'da kiraz çiçekleri genellikle mart sonu ile nisan başı arasında, sonbahar yaprakları kasım ortası ile aralık başı arasında görülür. Bu dönemler en kalabalık ve otellerin en pahalı olduğu zamanlardır; erken rezervasyon yapın. Haziran-temmuz arası yağmur mevsimi, temmuz-ağustos ise çok sıcak ve nemlidir.",
    bolumler: [
      ['Aylara göre Kansai', `<table><tr><th>Dönem</th><th>Hava</th><th>Not</th></tr>
<tr><td>Mart sonu – nisan başı</td><td>Ilık</td><td>Kiraz çiçekleri (sakura). En kalabalık dönemlerden biri.</td></tr>
<tr><td>Nisan sonu – mayıs başı</td><td>Ilık</td><td>Golden Week: Japonların tatili, trenler ve oteller dolu.</td></tr>
<tr><td>Haziran – temmuz ortası</td><td>Yağmurlu</td><td>Yağmur mevsimi (tsuyu); daha az turist.</td></tr>
<tr><td>Temmuz – ağustos</td><td>Çok sıcak, nemli</td><td>Gün ortasında yürüyüş yorucu; sabah erken gezin. Ağustos ortasında Obon tatili.</td></tr>
<tr><td>Ağustos – eylül</td><td>Sıcak</td><td>Tayfun dönemi; tren seferleri iptal olabilir.</td></tr>
<tr><td>Kasım ortası – aralık başı</td><td>Serin</td><td>Sonbahar yaprakları (momiji); Kyoto'nun en güzel zamanlarından.</td></tr>
<tr><td>Aralık – şubat</td><td>Soğuk, kuru</td><td>Daha sakin ve ucuz. Yılbaşında birçok yer kapanabilir.</td></tr></table>`],
      ['Kalabalıktan kaçmak için', '<p>Ünlü tapınaklara sabah erken gidin (Fushimi Inari gün doğumunda neredeyse boştur). Golden Week ve Obon tarihlerinden kaçının. Kiraz çiçeği ve sonbahar dönemlerinde hafta içi gidin.</p>'],
    ],
    sss: [
      ['Kyoto\'da kiraz çiçekleri ne zaman açar?', 'Genellikle mart sonu ile nisan başı arasında; tarih her yıl birkaç gün değişir.'],
      ['Japonya\'da sonbahar yaprakları ne zaman?', 'Kyoto ve Osaka\'da genellikle kasım ortası ile aralık başı arası.'],
      ['Japonya\'ya gitmek için en ucuz zaman?', 'Ocak-şubat (yılbaşı hariç) ve haziran; oteller daha ucuz, kalabalık daha az.'],
    ],
    kaynaklar: [['JNTO (Japonya Ulusal Turizm Örgütü)', 'https://www.japan.travel/en/'], ['Kyoto resmi turizm sitesi', 'https://kyoto.travel/en/']],
  },
  {
    yol: 'japonya-oncesi-bilinmesi-gerekenler', kapak: 'umeda',
    baslik: "Japonya'ya Gitmeden Önce Bilinmesi Gerekenler: Para, ICOCA, İnternet, Priz | Türkçe Rehber",
    aciklama: "Japonya'ya giden Türkler için pratik bilgiler: nakit ve kart, ICOCA kartı, internet (eSIM), priz adaptörü, bahşiş, Visit Japan Web. Japonya'da yaşayan Türk rehber Ferhat'tan.",
    h1: "Japonya'ya gitmeden önce bilinmesi gerekenler",
    kisa: 'Para, ICOCA kartı, internet, priz, bahşiş ve giriş formları.',
    cevap: "Japonya'ya gitmeden önce: yanınızda biraz nakit yen bulundurun (küçük tapınak ve dükkanlarda kart geçmeyebilir), trenler için bir IC kart (Kansai'de ICOCA) alın, internet için eSIM veya cep Wi-Fi ayarlayın ve A tipi priz adaptörü götürün (Japonya'da 100 V, Türkiye'deki prizler uymaz). Japonya'da bahşiş verilmez. Giriş formlarını Visit Japan Web'de önceden doldurabilirsiniz.",
    bolumler: [
      ['Para ve ödeme', '<ul class="ozet"><li>Büyük mağaza, otel ve restoranlarda kredi kartı geçer; küçük dükkan, tapınak ve bazı restoranlarda nakit gerekir.</li><li>Yabancı kartla nakit çekmek için 7-Eleven ve Japan Post (postane) ATM\'leri en kolay seçeneklerdir.</li><li><strong>Bahşiş yok:</strong> Japonya\'da bahşiş verilmez, hesaba dahil değildir.</li></ul>'],
      ['ICOCA kartı', '<p>ICOCA, Kansai\'de tren, metro ve otobüslerde kullanılan şarjlı karttır; her binişte bilet almak zorunda kalmazsınız. Market (konbini) ve otomatlarda da ödeme yapılır. Havalimanında ve JR istasyonlarında alınıp şarj edilir. Tokyo\'daki Suica ve PASMO kartları da Kansai\'de geçer.</p>'],
      ['İnternet', '<p>En pratik yol telefonunuza Japonya eSIM\'i yüklemektir; telefonunuz eSIM desteklemiyorsa havalimanında cep Wi-Fi kiralanabilir. Google Haritalar trenleri ve aktarmaları iyi gösterir.</p>'],
      ['Priz ve elektrik', '<p>Japonya\'da A tipi (iki yassı uçlu) priz ve 100 V kullanılır. Türkiye\'den getirdiğiniz şarj aletleri için adaptör gerekir; telefon ve bilgisayar şarj aletleri genellikle 100-240 V\'u destekler, ama saç kurutma makinesi gibi cihazları kontrol edin.</p>'],
      ['Görgü kuralları', '<p>Trende telefonla konuşulmaz, yürürken yemek yemek hoş karşılanmaz, çöp kutusu azdır (çöpünüzü yanınızda taşıyın). Tapınaklarda ve bazı restoranlarda ayakkabı çıkarılır.</p>'],
    ],
    sss: [
      ['Japonya\'da kredi kartı geçer mi?', 'Şehirlerde çoğu yerde geçer, ama küçük dükkan ve tapınaklar için nakit bulundurun.'],
      ['Japonya\'da hangi priz kullanılır?', 'A tipi priz, 100 V. Türkiye\'den gelenler adaptör getirmeli.'],
      ['Japonya\'da bahşiş verilir mi?', 'Hayır. Restoran, taksi ve otellerde bahşiş verilmez.'],
    ],
    kaynaklar: [['JNTO: pratik bilgiler', 'https://www.japan.travel/en/'], ['Visit Japan Web', 'https://www.vjw.digital.go.jp/']],
  },
  {
    yol: 'kyoto-bir-gunde', kapak: 'fushimi-orman',
    baslik: "Kyoto'da 1 Günde Ne Yapılır? Saat Saat Gezi Planı | Türkçe Rehber",
    aciklama: "Kyoto'da bir gününüz varsa: sabah Fushimi Inari, öğlen Kiyomizu-dera ve Ninenzaka, akşam Gion. Saat saat plan, ulaşım ve Türkçe rehber Ferhat.",
    h1: "Kyoto'da 1 günde ne yapılır?",
    kisa: 'Fushimi Inari, Kiyomizu-dera ve Gion: saat saat plan.',
    cevap: "Kyoto'da tek gününüz varsa güneyden kuzeye gidin: sabah erken Fushimi Inari'nin kırmızı torii kapıları, öğlen Kiyomizu-dera tapınağı ve Ninenzaka-Sannenzaka eski sokakları, akşamüstü Gion ve Yasaka Tapınağı. Bu üç yer birbirine yakındır ve tren ile otobüsle kolayca bağlanır. Osaka'dan gelenler için Kyoto'ya trenle yaklaşık 30-50 dakikadır.",
    bolumler: [
      ['Saat saat plan', '<ol><li><strong>07:30–09:30, Fushimi Inari:</strong> erken giderseniz kalabalıktan önce torii tünellerinde yürürsünüz. Giriş ücretsiz.</li><li><strong>10:00–13:00, Kiyomizu-dera:</strong> ahşap terasıyla ünlü tapınak; ardından Ninenzaka ve Sannenzaka sokakları.</li><li><strong>13:00–14:00, öğle yemeği:</strong> helal veya Müslüman dostu restoranlar için <a href="/tr/helal-yemek-cami/">bu sayfaya</a> bakın.</li><li><strong>14:30–17:00, Gion ve Yasaka:</strong> Hanamikoji sokağı, Yasaka Tapınağı, Kamo Nehri kıyısı.</li><li><strong>Akşam:</strong> Nishiki Pazarı (erken kapanır) veya Pontocho sokağı.</li></ol>'],
      ['Vaktiniz kalırsa', '<p>Arashiyama bambu ormanı ve Kinkaku-ji (Altın Köşk) şehrin batı ve kuzeyindedir; tek günde hepsini görmek koşturmaca olur. İki gününüz varsa ikinci güne Arashiyama ve Nara\'yı koyun (<a href="/tr/japonya-gezi-plani/">3 ve 5 günlük plan</a>).</p>'],
      ['Ulaşım', '<p>Fushimi Inari\'ye JR Nara hattıyla Inari İstasyonu\'na gidilir. Kiyomizu-dera ve Gion arası yürünebilir. Osaka\'dan Kyoto\'ya ulaşım için <a href="/tr/osakadan-kyotoya-ulasim/">bu rehbere</a> bakın.</p>'],
    ],
    sss: [
      ['Kyoto için bir gün yeterli mi?', 'Ana yerleri görmek için yeter, ama acele edersiniz; iki gün daha rahat.'],
      ['Fushimi Inari\'ye ne zaman gidilmeli?', 'Sabah erken; saat 9\'dan sonra kalabalık artar. Giriş ücretsizdir ve 24 saat açıktır.'],
    ],
    kaynaklar: [['Kyoto resmi turizm sitesi', 'https://kyoto.travel/en/']],
  },
]

const SSS = [
  ['Ferhat kimdir?', "Ferhat, Türk bir tur rehberidir ve 4 yıldır Japonya'da yaşıyor. Kansai bölgesinde (Kyoto, Osaka, Nara, Kobe, Himeji) Türkçe özel turlar yapıyor. Tony Kansai Guide ekibinin Türkçe rehberidir."],
  ["Japonya'da Türkçe konuşan rehber var mı?", "Evet. Ferhat, Kansai bölgesinde (Kyoto, Osaka, Nara, Kobe, Himeji) Türkçe özel tur yapan Türk rehberdir. Rezervasyon WhatsApp'tan."],
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
.kap{max-width:1080px;margin:0 auto;padding:0 16px}main>.kap>p,main>.kap>ul.ozet,main>.kap>ol,main>.kap>details,main>.kap>.cevap,main>.kap>table,main>.kap>h3{max-width:760px}
h1,h2,h3{font-family:Fraunces,Georgia,serif;font-weight:600;letter-spacing:-.01em}h2{font-size:clamp(26px,3.4vw,34px)!important;margin-top:56px!important}
header{border-bottom:1px solid var(--cizgi)}header .kap{display:flex;justify-content:space-between;align-items:center;gap:12px;padding-block:14px;flex-wrap:wrap}
header a{color:var(--fg);text-decoration:none;font-weight:600}header nav{display:flex;gap:14px;flex-wrap:wrap;font-size:15px}header nav a{font-weight:500;color:var(--soluk)}
.kahraman{position:relative;min-height:min(86vh,940px);display:flex;align-items:flex-end;overflow:hidden;background:#111;color:#fff}
.kahraman>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;animation:yakin 18s ease-out both}
@keyframes yakin{from{transform:scale(1.08)}to{transform:scale(1)}}@media (prefers-reduced-motion:reduce){.kahraman>img{animation:none}}
.kahraman .ortu{position:relative;width:100%;padding:120px 0 64px;background:linear-gradient(180deg,transparent 0,rgba(0,0,0,.35) 35%,rgba(0,0,0,.78) 100%)}
.kahraman h1{color:#fff;font-size:clamp(36px,7vw,72px);line-height:1.05;margin:10px 0 14px;text-shadow:0 2px 24px rgba(0,0,0,.4)}
.kahraman .alt{color:rgba(255,255,255,.9);font-size:clamp(18px,2.4vw,22px);max-width:34em}
.kahraman .etiket{color:#ffd166;margin:0}.kahraman .etiket a{color:#ffd166}
.kredi{position:absolute;right:10px;top:8px;font-size:11px;color:rgba(255,255,255,.7)}.kredi a{color:inherit}
.kf{margin:0;position:relative;aspect-ratio:4/3;overflow:hidden;background:#222}.kf img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease}
.kf figcaption{position:absolute;left:0;right:0;bottom:0;padding:14px 8px 4px;font-size:10px;color:rgba(255,255,255,.75);background:linear-gradient(transparent,rgba(0,0,0,.55))}.kf figcaption a{color:inherit}
.ki{padding:14px 16px 18px}
h1{font-size:clamp(28px,5vw,40px);line-height:1.2;margin:28px 0 8px}h2{font-size:24px;margin:40px 0 10px}h3{font-size:18px;margin:0 0 4px}
.alt{font-size:19px;color:var(--soluk);margin:0 0 20px}
.btn{display:inline-block;background:var(--yesil);color:#fff;text-decoration:none;font-weight:600;padding:13px 22px;border-radius:999px;margin:8px 0}
.etiket{display:block;margin-top:20px;font-size:13px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--kirmizi)}
ul.ozet{padding-left:20px}ul.ozet li{margin:4px 0}
.izgara{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px;padding:0;list-style:none}
.izgara li{background:var(--kart);border:1px solid var(--cizgi);border-radius:16px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.04),0 12px 32px -18px rgba(0,0,0,.35)}
.izgara li:hover .kf img{transform:scale(1.05)}
.izgara a{color:var(--fg);text-decoration:none}.izgara p{margin:0;color:var(--soluk);font-size:15px}
details{background:var(--kart);border:1px solid var(--cizgi);border-radius:12px;padding:12px 16px;margin:8px 0}summary{font-weight:600;cursor:pointer}details p{margin:8px 0 0}
footer{border-top:1px solid var(--cizgi);margin-top:48px;padding:20px 0 40px;color:var(--soluk);font-size:14px}footer a{color:var(--soluk)}
a{color:var(--kirmizi)}
body{padding-bottom:76px}.wa-sabit{position:fixed;right:16px;bottom:16px;z-index:9;background:var(--yesil);color:#fff;text-decoration:none;font-weight:600;padding:13px 20px;border-radius:999px;box-shadow:0 6px 20px rgba(0,0,0,.25)}
.cevap{background:var(--kart);border-left:4px solid var(--kirmizi);padding:14px 16px;border-radius:8px;font-size:18px}
table{border-collapse:collapse;width:100%;font-size:15px}td,th{border-bottom:1px solid var(--cizgi);padding:8px 6px;text-align:left;vertical-align:top}
.kaynak{font-size:14px;color:var(--soluk)}
ul.yorumlar{list-style:none;padding:0;display:grid;gap:12px}ul.yorumlar li{background:var(--kart);border:1px solid var(--cizgi);border-radius:12px;padding:14px 16px}ul.yorumlar p{margin:4px 0}.yildizlar{color:#e3a400;letter-spacing:2px}`

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
<meta property="og:image" content="${BASE}/tr/foto/${gorsel}-1920.webp">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&display=swap">
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
<p>Türkçe bilgiler: ${CEVAPLAR.map((c) => `<a href="/tr/${c.yol}/">${esc(c.h1)}</a>`).join(' · ')}</p>
<p>Diğer diller: <a href="/es/" hreflang="es">Español</a> · <a href="/en/" hreflang="en">English</a> · <a href="/ar/" hreflang="ar">العربية</a> · <a href="/ru/" hreflang="ru">Русский</a> · Son güncelleme: ${HOY}</p>
</div></footer>
<a class="wa-sabit" href="${WA_GENEL}">WhatsApp: Ferhat</a>
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

const yorumKarti = (y) => `<li data-id="${esc(y.id)}"><p class="yildizlar" aria-label="${y.stars}/5">${'★'.repeat(y.stars)}${'☆'.repeat(5 - y.stars)}</p><p>${esc(y.text)}</p><p class="kaynak">${esc(y.name)}${y.country ? ` · ${esc(y.country)}` : ''}${y.tour ? ` · ${esc(y.tour)}` : ''}${y.date ? ` · ${esc(y.date)}` : ''}</p></li>`
// Sección de reseñas: las del build y, debajo, el script que añade las nuevas.
const yorumlarBolumu = `
<h2 id="yorumlar">Misafir yorumları</h2>
<ul class="yorumlar" id="yorumListe">${YORUMLAR.map(yorumKarti).join('')}</ul>
<p id="yorumBos" ${YORUMLAR.length ? 'hidden' : ''}>Henüz yorum yok. Ferhat'la tur yaptıysanız ilk yorumu siz yazın.</p>
<p><a href="/tr/yorum/">Ferhat ile tur yaptınız mı? Yorum yazın →</a></p>
<script>
fetch('/api/resenas/publicas?guia=ferhat',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(d=>{
  const ul=document.getElementById('yorumListe'); if(!d||!ul) return
  const e=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c])
  for(const y of d.reviews||[]){ if(!y.text||!y.stars||ul.querySelector('[data-id="'+CSS.escape(y.id)+'"]')) continue
    ul.insertAdjacentHTML('afterbegin','<li data-id="'+e(y.id)+'"><p class="yildizlar">'+'★'.repeat(y.stars)+'☆'.repeat(5-y.stars)+'</p><p>'+e(y.text)+'</p><p class="kaynak">'+e(y.name)+(y.country?' · '+e(y.country):'')+(y.tour?' · '+e(y.tour):'')+'</p></li>')
    document.getElementById('yorumBos').hidden=true }
}).catch(()=>{})
</script>`
// JSON-LD: cada reseña como Review del guía, sin aggregateRating (ver el commit
// «sin aggregateRating ni Review…»: Google no da estrellas a reseñas propias, pero
// las IAs sí leen el texto).
// Google no acepta una Person como itemReviewed («El tipo de objeto del campo
// itemReviewed no es válido», Search Console 25-10): la reseña va al negocio,
// con tipo y nombre en línea porque /tr/ no incluye la declaración de index.html.
const NEGOCIO_LD = { '@type': 'LocalBusiness', '@id': `${BASE}/#negocio`, name: 'Tony Kansai Guide', url: `${BASE}/`, address: { '@type': 'PostalAddress', addressLocality: 'Osaka', addressRegion: 'Osaka', addressCountry: 'JP' } }
const yorumLd = YORUMLAR.map((y) => ({ '@type': 'Review', reviewRating: { '@type': 'Rating', ratingValue: y.stars, bestRating: 5 }, author: { '@type': 'Person', name: y.name }, reviewBody: y.text, inLanguage: y.lang || 'tr', itemReviewed: NEGOCIO_LD }))

// Ana sayfa
{
  const govde = `
${kahraman('kiyomizu-sonbahar', 'Sonbaharda Kyoto, Kiyomizu-dera', `<span class="etiket">Japonya · Kansai · Türkçe</span>
<h1>Japonya'da Türkçe Rehber: Ferhat</h1>
<p class="alt">Kyoto, Osaka, Nara, Kobe ve Himeji'de Türkçe özel turlar. Rehber sadece sizin grubunuz için.</p>
${iletisim}`)}
<div class="kap">
<h2>Kısaca</h2>
<ul class="ozet">
<li><strong>Kim:</strong> Ferhat, Türk tur rehberi; 4 yıldır Japonya'da yaşıyor.</li>
<li><strong>Dil:</strong> Türkçe. Tur baştan sona Türkçe anlatılır.</li>
<li><strong>Nerede:</strong> Kansai bölgesi: Kyoto, Osaka, Nara, Kobe, Himeji. Hiroshima, Miyajima ve Koyasan için günübirlik turlar sorulabilir.</li>
<li><strong>Tur tipi:</strong> Özel tur, sadece sizin aileniz veya grubunuz. Başka turistlerle birleştirilmez.</li>
<li><strong>Fiyat:</strong> Gruba ve programa göre WhatsApp'tan bildirilir; makul fiyatlar. Ulaşım, giriş ücretleri ve yemekler genellikle dahil değildir.</li>
<li><strong>Müslüman gezginler için:</strong> Helal ve Müslüman dostu restoranlar, camiler ve namaz molaları programa eklenebilir.</li>
<li><strong>İletişim:</strong> WhatsApp <a href="${WA_GENEL}">${WA_VISIBLE}</a></li>
<li><strong>Yorumlar:</strong> ${YORUMLAR.length ? `${YORUMLAR.length} misafir yorumu, <a href="#yorumlar">okuyun</a>` : '<a href="/tr/yorum/">ilk yorumu yazın</a>'}</li>
</ul>
<h2>Neden Türkçe rehber?</h2>
<p>Japonya'da İngilizce her yerde konuşulmaz; tabelalar, tren hatları ve menüler ilk gelişte kafa karıştırabilir. Türkçe bir rehberle tarihi ve kültürü kendi dilinizde dinler, sorularınızı rahatça sorarsınız. Ferhat 4 yıldır Japonya'da yaşadığı için trenleri, kalabalık saatleri, nerede ne yeneceğini ve Türk gezginlerin nelere dikkat etmesi gerektiğini bilir.</p>
<h2>Turlar ve şehirler</h2>
<ul class="izgara">
${SEHIRLER.map((s) => `<li><a href="/tr/${s.yol}/">${kartFoto(s.kapak, s.ad)}<div class="ki"><h3>${s.ad}</h3><p>${esc(s.yerler.slice(0, 3).map((y) => y[0]).join(', '))}</p></div></a></li>`).join('\n')}
</ul>
<h2>Nasıl çalışır?</h2>
<ol>
<li>WhatsApp'tan yazın: tarihler, kişi sayısı, kaldığınız şehir veya otel.</li>
<li>Ferhat size Türkçe bir program ve fiyat önerir.</li>
<li>Tur günü buluşur, gün boyunca Türkçe anlatımla gezersiniz.</li>
</ol>
${yorumlarBolumu}
<h2>Japonya gezisi için Türkçe bilgiler</h2>
<ul class="izgara">
${CEVAPLAR.map((c) => `<li><a href="/tr/${c.yol}/">${kartFoto(c.kapak, c.h1)}<div class="ki"><h3>${esc(c.h1)}</h3><p>${esc(c.kisa)}</p></div></a></li>`).join('\n')}
</ul>
<h2>Sık sorulan sorular</h2>
${SSS.map(([s, c]) => `<details><summary>${esc(s)}</summary><p>${esc(c)}</p></details>`).join('\n')}
<h2>Rezervasyon</h2>
<p>Tarihlerinizi ve kişi sayınızı yazın, Ferhat Türkçe dönüş yapsın.</p>
${iletisim}
</div>`
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      rehber, hizmet(null), ...yorumLd,
      { '@type': 'FAQPage', inLanguage: 'tr', mainEntity: SSS.map(([s, c]) => ({ '@type': 'Question', name: s, acceptedAnswer: { '@type': 'Answer', text: c } })) },
      { '@type': 'WebPage', url: `${BASE}/tr/`, inLanguage: 'tr', name: "Japonya'da Türkçe Rehber: Ferhat", dateModified: HOY, about: { '@id': `${BASE}/tr/#ferhat` } },
    ],
  }
  yaz('', sayfa({
    yol: '', gorsel: 'kiyomizu-sonbahar', jsonld, govde,
    baslik: "Japonya'da Türkçe Rehber Ferhat | Kyoto, Osaka, Nara Özel Tur",
    aciklama: "Ferhat, 4 yıldır Japonya'da yaşayan Türk rehber. Kyoto, Osaka, Nara, Kobe ve Himeji'de Türkçe özel turlar; helal yemek ve cami bilgisi. Fiyat WhatsApp'tan.",
  }))
}

// Şehir sayfaları
for (const s of SEHIRLER) {
  const yazi = wa(`Merhaba Ferhat, ${s.ad} için Türkçe rehber arıyorum. Tarihler: `)
  const govde = `
${kahraman(s.kapak, s.ad, `<span class="etiket"><a href="/tr/">Türkçe rehber</a> · ${s.ad}</span>
<h1>${s.ad}'${s.ad === 'Kobe' || s.ad === 'Himeji' ? 'de' : 'da'} Türkçe Rehber: Ferhat</h1>
<p class="alt">${esc(s.giris)}</p>
<p><a class="btn" href="${yazi}">WhatsApp'tan ${s.ad} turu sor</a></p>`)}
<div class="kap">
<h2>${s.ad}'${s.ad === 'Kobe' || s.ad === 'Himeji' ? 'de' : 'da'} neler görülür?</h2>
<ul class="izgara">
${s.yerler.map(([ad, metin, k]) => `<li>${kartFoto(k, ad)}<div class="ki"><h3>${esc(ad)}</h3><p>${esc(metin)}</p></div></li>`).join('\n')}
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
${yorumlarBolumu}
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
  yaz(s.yol, sayfa({ yol: s.yol, baslik: s.baslik, aciklama: s.aciklama, gorsel: s.kapak, jsonld, govde }))
}

// Páginas de respuesta
for (const c of CEVAPLAR) {
  const yazi = wa(`Merhaba Ferhat, "${c.h1}" sayfasını okudum. Japonya için Türkçe rehber arıyorum. Tarihler: `)
  const govde = `
${kahraman(c.kapak, '', `<span class="etiket"><a href="/tr/">Türkçe rehber</a> · Bilgi</span>
<h1>${esc(c.h1)}</h1>`)}
<div class="kap">
<p class="cevap">${esc(c.cevap)}</p>
${c.bolumler.map(([h, html]) => `<h2>${esc(h)}</h2>\n${html}`).join('\n')}
<h2>Sık sorulan sorular</h2>
${c.sss.map(([s, y]) => `<h3>${esc(s)}</h3>\n<p>${esc(y)}</p>`).join('\n')}
<h2>Japonya'da Türkçe rehber</h2>
<p>Ferhat, 4 yıldır Japonya'da yaşayan Türk tur rehberi. Kyoto, Osaka, Nara, Kobe ve Himeji'de Türkçe özel turlar yapıyor; fiyatı gruba göre WhatsApp'tan bildiriyor.</p>
<p><a class="btn" href="${yazi}">WhatsApp'tan Ferhat'a yaz</a></p>
${c.kaynaklar.length ? `<p class="kaynak">Kaynaklar: ${c.kaynaklar.map(([t, u]) => `<a href="${u}" rel="nofollow">${esc(t)}</a>`).join(' · ')}. Bilgiler ${HOY} tarihinde kontrol edildi; süreler yaklaşıktır.</p>` : ''}
</div>`
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', headline: c.h1, inLanguage: 'tr', dateModified: HOY, author: { '@id': `${BASE}/tr/#ferhat` }, mainEntityOfPage: `${BASE}/tr/${c.yol}/`, description: c.aciklama },
      rehber,
      { '@type': 'FAQPage', inLanguage: 'tr', mainEntity: [[c.h1, c.cevap], ...c.sss].map(([s, y]) => ({ '@type': 'Question', name: s, acceptedAnswer: { '@type': 'Answer', text: y } })) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Türkçe rehber', item: `${BASE}/tr/` },
        { '@type': 'ListItem', position: 2, name: c.h1, item: `${BASE}/tr/${c.yol}/` },
      ] },
    ],
  }
  yaz(c.yol, sayfa({ yol: c.yol, baslik: c.baslik, aciklama: c.aciklama, gorsel: c.kapak, jsonld, govde }))
}

function yaz(yol, html) {
  const dir = join(root, 'public/tr', yol)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
}
console.log(`tr: ${SEHIRLER.length + CEVAPLAR.length + 1} sayfa en public/tr/`)
