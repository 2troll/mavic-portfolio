// Páginas 3-11-2026 para /tr/: lo que un turco musulmán o una pareja de luna de
// miel pregunta a ChatGPT antes de ir a Kansai (halal en Kioto y Osaka, rezo,
// Ramadán, vuelos desde Estambul, presupuesto, kimono, ruta de 7 días).
// Mismo esquema que turkce-cevaplar-yeni.mjs. De Ferhat solo lo que consta en
// turkce.mjs: turco, 4 años en Japón, guía solo en turco, Kansai, precio por
// WhatsApp. Nada de alcohol. Restaurantes con nombre solo si salen en una lista
// oficial (kyoto.travel) o, en Osaka, como ejemplo con aviso de comprobarlo.
// Datos de terceros comprobados el 3-11-2026 (fuentes en `kaynaklar`).
export function musulmanCevaplar({ WA_GENEL, WA_VISIBLE }) {
  const ferhat = `<a href="${WA_GENEL}">${WA_VISIBLE}</a>`
  return [
    {
      yol: 'kyoto-helal-restoranlar',
      kapak: 'nishiki',
      baslik: "Kyoto'da Helal Restoranlar ve Helal Yemek | Türkçe Rehber",
      aciklama: "Kyoto'da helal yemek nerede yenir? Resmi listedeki Muslim Friendly restoranlar, helal etiketleri ve Türkçe rehber Ferhat ile helal molalı Kyoto günü.",
      h1: "Kyoto'da helal restoranlar: nerede, nasıl yenir?",
      kisa: 'Resmi listedeki Muslim Friendly restoranlar ve helal etiketlerinin anlamı.',
      cevap: `Kyoto'da helal yemek için en güvenilir kaynak, Kyoto şehrinin resmi turizm sitesindeki "Halal / Muslim Friendly" listesidir. Bu listede Gion'da helal Kobe bifteği teppanyaki, helal A5 wagyu yakiniku, Kyoto kaiseki mutfağı sunan Honke Tankuma Honten ve Arashiyama tarafında Yoshiya Okunoniwa gibi yerler yer alır. "Muslim Friendly" etiketi, ayrı bir helal menü olduğu anlamına gelir; normal menüde helal olmayan ürünler bulunabilir. Kyoto'yu Türkçe ve helal molalarla gezmek için 4 yıldır Japonya'da yaşayan Türk rehber Ferhat'a WhatsApp'tan yazabilirsiniz: ${WA_VISIBLE}.`,
      bolumler: [
        ['Kyoto\'daki helal etiketleri ne anlama geliyor?', `<p>Kyoto'nun resmi turizm sitesi, restoranları Kyoto Müslüman Derneği (KMA) ve Kyoto Council for Sharia and Halal Affairs ile birlikte hazırlanan dört gruba ayırır. Bu ayrımı bilmek, menüye bakarken neyi sormanız gerektiğini gösterir:</p>
<ul class="ozet">
<li><strong>Halal:</strong> Sadece helal yemek sunan restoran veya kafe.</li>
<li><strong>Muslim Friendly:</strong> Helal logolu ayrı bir menüsü olan restoran. Normal menüde helal olmayan yemekler de olabilir; siparişi helal menüden verin.</li>
<li><strong>Muslim Welcome:</strong> Domuz ve domuz ürünü kullanmayan, ama ayrı helal menüsü olmayan yer.</li>
<li><strong>Pork-Free:</strong> Domuz ve et kullanmayan yer.</li>
</ul>
<p>Japon mutfağında soya sosu, dashi (balık suyu) ve mirin gibi temel malzemeler her yemekte kullanılır. Bu yüzden "et yok" demek her zaman helal anlamına gelmez; emin olmak için listelenmiş restoranları tercih etmek en kolay yoldur.</p>`],
        ['Resmi listedeki Muslim Friendly restoranlar', `<p>Kasım 2026'da Kyoto turizm sitesinin "Finding Halal Food" sayfasında Muslim Friendly olarak şu yerler listeleniyor. Hepsi farklı tarzda; bir günü bunlardan biriyle planlamak kolaydır:</p>
<table><tr><th>Restoran</th><th>Mutfak</th><th>Not</th></tr>
<tr><td>Kobe Beef Gion Sudaku Teppan</td><td>Teppanyaki</td><td>Gion'da, helal Kobe bifteği. Akşam yemeği için rezervasyon yapmak iyi olur.</td></tr>
<tr><td>Halal A5 Wagyu Yakiniku Sudaku Kyoto</td><td>Yakiniku (masada ızgara)</td><td>Helal wagyu; aileler ve gruplar için uygun.</td></tr>
<tr><td>Honke Tankuma Honten</td><td>Kyo kaiseki</td><td>Kyoto'nun çok tabaklı geleneksel mutfağını helal menüyle tatmak için.</td></tr>
<tr><td>Yoshiya Okunoniwa</td><td>Kyoto-Saga mutfağı, kafe</td><td>Arashiyama gezisinin arasına uyan sakin bir mola.</td></tr>
<tr><td>Café Restaurant "Le Temps" (Hotel Granvia Kyoto)</td><td>Kontinental</td><td>Kyoto İstasyonu'nun içindeki otelde; trene binmeden önce pratik.</td></tr>
<tr><td>Kyoto University Coop Cafeteria Rune</td><td>Kebap köşesi</td><td>Kyoto Üniversitesi kampüsünde, ekonomik seçenek.</td></tr></table>
<p>Liste zaman zaman güncellenir ve restoranların saatleri değişebilir. Gitmeden önce resmi listeyi ve restoranın kendi sitesini kontrol edin.</p>`],
        ['Kyoto gezisinde yemek ve namaz nasıl planlanır?', `<p>Kyoto'da turistik yerler birbirinden uzaktır: Fushimi Inari güneyde, Kinkaku-ji kuzeybatıda, Arashiyama batıda. Helal restoranlar ise belli bölgelerde toplanır. İyi bir plan, öğle yemeğini gezdiğiniz bölgeye göre seçmektir:</p>
<ol>
<li><strong>Doğu Kyoto (Kiyomizu-dera, Gion):</strong> Akşam yemeği için Gion'daki teppanyaki iyi bir kapanış olur.</li>
<li><strong>Arashiyama:</strong> Bambu ormanından sonra Saga tarafında sakin bir mola.</li>
<li><strong>Kyoto İstasyonu çevresi:</strong> Osaka'ya dönmeden önce istasyondaki otel restoranı.</li>
</ol>
<p>Namaz için Kyoto turizm sitesine göre Nijo Kalesi, Kyoto Uluslararası Manga Müzesi ve Kyoto Handicraft Center gibi yerlerde ücretsiz namaz alanları var; cuma namazı Kyoto Camii'nde kılınır. Ayrıntılar için <a href="/tr/japonyada-namaz-vakitleri-ve-mescitler/">Japonya'da namaz vakitleri ve mescitler</a> sayfasına bakın.</p>`],
        ['Helal restoran yoksa ne yenir?', `<p>Gün içinde listelenmiş bir restorana ulaşamıyorsanız, birçok Müslüman ziyaretçi deniz ürünlü veya sebzeli seçeneklere yönelir: onigiri (pirinç topu) türlerinden ton balıklı ya da somonlu olanlar, sebzeli tempura veya balıklı sushi. Yine de sos ve pişirme yağı konusunda tam emin olunamayacağını unutmayın. Konbini denilen marketlerde (7-Eleven, Lawson, FamilyMart) paketli ürünlerin içindekiler Japonca yazılıdır; telefonunuzdaki kamera çeviri uygulaması işinizi kolaylaştırır.</p>
<p>Kyoto'ya Osaka'dan geliyorsanız Osaka'daki seçenekler için <a href="/tr/osaka-helal-restoranlar/">Osaka helal restoranlar</a> sayfasına da göz atın.</p>`],
        ['Ferhat ile helal molalı Kyoto günü', `<p>Ferhat, 4 yıldır Japonya'da yaşayan Türk tur rehberidir ve Kyoto, Osaka, Nara, Kobe ve Himeji'de yalnızca Türkçe özel turlar yapar. Tur sadece sizin grubunuza özeldir; gün, namaz vakitlerine göre planlanabilir ve yemek molası helal veya Müslüman dostu bir yerde verilebilir. Restoran ücretleri genellikle tura dahil değildir. Fiyatı gruba ve programa göre WhatsApp'tan bildirir: ${ferhat}.</p>`],
      ],
      sss: [
        ["Kyoto'da helal yemek bulmak zor mu?", "Zor değil, ama plan ister. Resmi Kyoto turizm sitesindeki Muslim Friendly listesi ve Halal Gourmet Japan gibi veritabanları ile Gion, Kyoto İstasyonu ve Arashiyama çevresinde seçenek bulunur."],
        ["Muslim Friendly restoran helal mi demek?", "Ayrı bir helal menüsü olduğu anlamına gelir. Normal menüde helal olmayan ürünler olabileceği için siparişi helal menüden verin."],
        ["Kyoto'da helal wagyu yenir mi?", "Evet. Resmi listede helal A5 wagyu yakiniku ve Gion'da helal Kobe bifteği sunan teppanyaki restoranı var. Akşamları yer ayırtmak iyi olur."],
        ["Ferhat helal restoran rezervasyonu yapar mı?", "Ferhat gün planına helal veya Müslüman dostu yemek molası ekleyebilir. Ayrıntıları ve fiyatı WhatsApp'tan konuşabilirsiniz."],
        ["Kyoto'da sushi helal mi?", "Çiğ balığın kendisi sorun olmasa da pirincin sirkesi, sos ve mirin konusunda emin olunamaz. Emin olmak istiyorsanız listelenmiş restoranları seçin."],
      ],
      kaynaklar: [['Kyoto Turizm: helal yemek bulma', 'https://kyoto.travel/en/muslim/finding-halal-food/'], ['Kyoto Turizm: Müslüman ziyaretçiler', 'https://kyoto.travel/en/muslim/'], ['Halal Gourmet Japan', 'https://www.halalgourmet.jp/']],
    },
    {
      yol: 'osaka-helal-restoranlar',
      kapak: 'kuromon',
      baslik: "Osaka'da Helal Restoranlar: Namba, Dotonbori | Türkçe Rehber",
      aciklama: "Osaka'da helal ramen, wagyu ve takoyaki nerede? Namba ve Dotonbori'de helal yemek bulma yolları, mescitler ve Türkçe rehber Ferhat ile helal molalı tur.",
      h1: "Osaka'da helal restoranlar: Namba, Dotonbori ve Umeda",
      kisa: 'Helal ramen, wagyu ve takoyaki: nerede bulunur, nasıl doğrulanır.',
      cevap: `Osaka'da helal restoranlar en çok Namba ve Dotonbori çevresinde toplanır: helal ramen, helal wagyu yakiniku, helal takoyaki ve Kobe bifteği sunan yerler bu bölgededir. Restoran açılıp kapanabildiği için Halal Gourmet Japan gibi güncel bir veritabanından ve restoranın kendi sitesinden kontrol etmek en güvenli yoldur. Namaz için en yakın büyük cami Osaka'nın kuzeyindeki İbaraki şehrindedir. Osaka'yı Türkçe ve helal molalarla gezmek için 4 yıldır Japonya'da yaşayan Türk rehber Ferhat'a WhatsApp'tan yazabilirsiniz: ${WA_VISIBLE}.`,
      bolumler: [
        ['Osaka neden "Japonya\'nın mutfağı" sayılır?', `<p>Osaka'da yemek, gezinin kendisidir. Takoyaki (ahtapotlu hamur topları), okonomiyaki (Japon usulü yassı tava böreği) ve kushikatsu bu şehirde doğdu. Sorun şu: sokak tezgâhlarının çoğu helal sertifikalı değildir ve aynı tavada farklı malzemeler pişer. Bu yüzden Osaka'da helal beslenmek, "her yerde bir şey bulurum" yerine birkaç güvenilir adresi önceden bilmekle kolaylaşır.</p>
<p>İyi haber: Osaka, Japonya'da Müslüman ziyaretçilere en çok hazırlanan şehirlerden biridir. Kansai Havalimanı'nda mescitler, şehirde Müslüman dostu restoranlar ve Kaiyukan Akvaryumu gibi yerlerde namaz alanları vardır.</p>`],
        ['Helal yemek nerede bulunur?', `<p>Helal restoranlar Osaka'da üç bölgede yoğunlaşır:</p>
<ul class="ozet">
<li><strong>Namba ve Dotonbori:</strong> Helal ramen dükkânları, helal wagyu ve Kobe bifteği restoranları, helal takoyaki. Örneğin Halal Ramen Honolu (Namba) ve Dotonbori'de helal takoyaki satan Creo-Ru, 2026'da birçok rehberde listeleniyor.</li>
<li><strong>Umeda (Osaka İstasyonu):</strong> Helal wagyu yakiniku ve shabu-shabu seçenekleri.</li>
<li><strong>Shin-Osaka İstasyonu:</strong> Shinkansen'e binmeden önce helal ramen gibi pratik seçenekler.</li>
</ul>
<p>Önemli not: Osaka'da helal restoranların listesi hızla değişir; bazı dükkânlar taşınır, adını değiştirir ya da kapanır. Yukarıdaki isimler örnektir; gitmeden önce Halal Gourmet Japan'da ve restoranın kendi sayfasında açık olup olmadığını ve sertifikasını kontrol edin. Akşam yemekleri için, özellikle wagyu restoranlarında, 2-3 gün önceden rezervasyon önerilir.</p>`],
        ['Sertifika nasıl kontrol edilir?', `<p>Japonya'da tek bir resmi helal kurumu yoktur; restoranlar farklı kuruluşlardan sertifika alır. Kapıda veya menüde helal logosunu görün, gerekirse sorun:</p>
<ol>
<li>Restoranın helal sertifikası mı var, yoksa "Muslim Friendly" (ayrı helal menü) mi?</li>
<li>Et helal kesim mi ve tedarikçi belli mi?</li>
<li>Soslarda ve pişirmede kullanılan malzemeler helal mi?</li>
</ol>
<p>Japonca bilmiyorsanız bu soruları önceden telefonunuza Japonca yazdırın. Kyoto'daki etiket sistemini anlatan <a href="/tr/kyoto-helal-restoranlar/">Kyoto helal restoranlar</a> sayfası, Osaka'da da işe yarayan bir çerçeve verir.</p>`],
        ['Osaka\'da namaz nerede kılınır?', `<p>Osaka'daki ana cami, şehrin kuzeyindeki İbaraki'de bulunan Osaka İbaraki Camii'dir (4-6-13 Toyokawa, Ibaraki-shi); her hafta cuma namazı kılınır, saati camiye sorun. Şehir merkezinde ise bazı yerler namaz alanı sunar: Kansai Havalimanı'nda kadın ve erkek için ayrı mescitler, Osaka Aquarium Kaiyukan'da ve Osaka Station City'de namaz odaları olduğu bildiriliyor (kullanmadan önce danışmaya sorun). Kobe'deki Kobe Camii'ne Osaka'dan JR treniyle Sannomiya'ya yaklaşık 20-30 dakikada, oradan yürüyerek gidilir. Ayrıntılar <a href="/tr/japonyada-namaz-vakitleri-ve-mescitler/">namaz vakitleri ve mescitler</a> sayfasında.</p>`],
        ['Ferhat ile helal molalı Osaka turu', `<p>Ferhat, Osaka Kalesi, Kuromon Pazarı, Dotonbori ve Shinsekai'yi Türkçe anlatarak gezdirir; yemek ve namaz molalarını programa ekleyebilir. Tur sadece sizin grubunuza özeldir, fiyatı gruba ve programa göre WhatsApp'tan bildirir: ${ferhat}. Bir günlük rota örneği için <a href="/tr/osaka-bir-gunde/">Osaka'da 1 günde ne yapılır</a> sayfasına bakın.</p>`],
      ],
      sss: [
        ["Osaka'da helal ramen var mı?", "Evet. Namba, Dotonbori ve Shin-Osaka İstasyonu çevresinde helal tavuk veya helal wagyu ile yapılan ramen dükkânları var. Açık olduklarını gitmeden önce kontrol edin."],
        ["Dotonbori'de helal takoyaki yenir mi?", "Dotonbori'de helal takoyaki satan dükkân var, ama tezgâhların çoğu helal değildir. Logosu olan yeri seçin."],
        ["Osaka'da helal Kobe bifteği nerede?", "Namba ve Umeda çevresinde helal wagyu ve Kobe bifteği sunan restoranlar var. Akşam için birkaç gün önceden rezervasyon önerilir."],
        ["Osaka'da cami var mı?", "Evet, Osaka'nın kuzeyindeki İbaraki şehrinde Osaka İbaraki Camii var. Kobe Camii de trenle yakındır."],
        ["Ferhat Osaka'da helal restorana götürür mü?", "Ferhat gün planına helal veya Müslüman dostu bir yemek molası ekleyebilir. Ayrıntılar ve fiyat WhatsApp'tan."],
      ],
      kaynaklar: [['Halal Gourmet Japan', 'https://www.halalgourmet.jp/'], ['Halal Media Japan: Osaka namaz alanları', 'https://halalmedia.jp/archives/825/prayer-rooms-osaka-station-city-opened/'], ['Halal Media Japan: Kaiyukan', 'https://halalmedia.jp/archives/32198/lets-go-osaka-halal-foods-pray-space-available-osaka-aquarium-kaiyukan/'], ['Osaka Ibaraki Mosque', 'http://osakamosque.org']],
    },
    {
      yol: 'japonyada-namaz-vakitleri-ve-mescitler',
      kapak: 'kobe-camii',
      baslik: "Japonya'da Namaz Vakitleri, Camiler ve Mescitler | Kansai",
      aciklama: "Kyoto, Osaka ve Kobe'de namaz: Kobe Camii, Osaka İbaraki Camii, Kyoto Camii, havalimanı ve müzelerdeki mescitler, mevsime göre vakitler. Türkçe rehber Ferhat.",
      h1: "Japonya'da namaz: vakitler, camiler ve mescitler (Kansai)",
      kisa: 'Kansai\'deki üç cami, ücretsiz mescitler ve mevsime göre namaz vakitleri.',
      cevap: `Kansai'de namaz kılmak için üç ana cami var: 1935'te açılan Kobe Camii, Osaka'nın kuzeyinde Osaka İbaraki Camii ve beş vakit ile cuma namazının kılındığı Kyoto Camii. Bunların dışında Kansai Havalimanı'nda kadın ve erkek için ayrı mescitler, Kyoto'da Nijo Kalesi gibi yerlerde ücretsiz namaz alanları bulunur. Vakitler mevsime göre çok değişir: yazın sabah namazı çok erken, kışın akşam namazı 17:00'den önce olabilir. Gezinizi namaz vakitlerine göre planlamak için 4 yıldır Japonya'da yaşayan Türk rehber Ferhat'a WhatsApp'tan yazabilirsiniz: ${WA_VISIBLE}.`,
      bolumler: [
        ['Kansai\'deki camiler', `<table><tr><th>Cami</th><th>Yer</th><th>Bilmeniz gerekenler</th></tr>
<tr><td>Kobe Camii (Kobe Muslim Mosque)</td><td>2-25-14 Nakayamate-dori, Chuo-ku, Kobe</td><td>1935'te açıldı; Japonya'nın en eski camisi. Savaşı ve 1995 depremini ayakta atlattı. Kitano mahallesinde, Sannomiya'dan yürüme mesafesinde.</td></tr>
<tr><td>Osaka İbaraki Camii</td><td>4-6-13 Toyokawa, Ibaraki-shi, Osaka</td><td>Her hafta cuma namazı kılınır; saati camiye sorun. Osaka merkezinden trenle gidilir.</td></tr>
<tr><td>Kyoto Camii ve İslam Kültür Merkezi</td><td>İmparatorluk Sarayı yakını, Kyoto</td><td>1987'de kurulan Kyoto Müslüman Derneği (KMA) yönetir. Beş vakit, cuma ve bayram namazları kılınır.</td></tr></table>
<p>Cuma namazı saatleri ve hutbe dili camiden camiye değişir; gitmeden önce caminin sitesine bakın ya da telefonla sorun. Kobe Camii'nin hikâyesi ve çevresi için <a href="/tr/kobe/">Kobe sayfasına</a> bakabilirsiniz.</p>`],
        ['Gezerken nerede namaz kılınır?', `<p>Camiye her vakitte gitmek mümkün olmadığı için gün içinde mescit veya sessiz bir köşe bulmak gerekir. Bilinen yerler:</p>
<ul class="ozet">
<li><strong>Kansai Havalimanı (KIX):</strong> Kadın ve erkek için ayrı, abdest yeri olan mescitler; Müslüman yolculara 24 saat açık oldukları bildiriliyor.</li>
<li><strong>Kyoto:</strong> Kyoto turizm sitesine göre Nijo Kalesi, Kyoto Uluslararası Manga Müzesi, Kyoto Handicraft Center ve Kyoto International Community House'ta ücretsiz namaz alanları var. Bazı Müslüman dostu oteller kıble pusulası ve seccade de verir.</li>
<li><strong>Osaka:</strong> Osaka Aquarium Kaiyukan'da ve Osaka Station City'de namaz odaları olduğu bildiriliyor; kullanmadan önce danışmaya sorun, saatler değişebilir.</li>
</ul>
<p>Mescit olmayan yerlerde sakin bir park köşesi veya otel odası en pratik çözümdür. Tapınakların içinde namaz kılmak yerine, tapınak bahçesinin dışındaki sessiz alanları tercih etmek hem saygılı hem rahattır.</p>`],
        ['Mevsime göre namaz vakitleri', `<p>Japonya Türkiye'den 6 saat ileridedir ve yaz saati uygulamaz. Kansai'de (Osaka, Kyoto) vakitler yaklaşık olarak şöyledir; kesin saatler için konumunuza göre çalışan bir namaz vakti uygulaması kullanın:</p>
<table><tr><th>Dönem</th><th>Sabah</th><th>Öğle</th><th>Akşam</th><th>Yatsı</th></tr>
<tr><td>Haziran sonu</td><td>~03:10</td><td>~12:00</td><td>~19:15</td><td>~20:50</td></tr>
<tr><td>Mart ve Eylül sonu</td><td>~04:40</td><td>~11:55</td><td>~18:10</td><td>~19:25</td></tr>
<tr><td>Aralık sonu</td><td>~05:45</td><td>~11:55</td><td>~16:55</td><td>~18:20</td></tr></table>
<p>Değerler yaklaşıktır ve hesaplama yöntemine göre birkaç dakika değişir. Pratik sonuç: kışın Kyoto'da tapınakları gezerken öğle, ikindi ve akşam namazları kısa bir zaman aralığına sıkışır; günü buna göre planlamak gerekir. Hangi mevsimde gideceğinize karar vermediyseniz <a href="/tr/japonya-ne-zaman-gidilir/">Japonya'ya ne zaman gidilir</a> sayfasına bakın.</p>`],
        ['Kıble ve abdest', `<p>Japonya'dan kıble yaklaşık batı-kuzeybatı yönündedir (Kansai'den kuzeyden yaklaşık 293 derece). Telefonunuzdaki pusula uygulaması yeterlidir. Japon tuvaletleri çok temizdir ve çoğunda bide fonksiyonu vardır; abdest için ayrıca yer aramak gerekmeyebilir, ama lavabo çevresini kuru ve temiz bırakmak Japonya'da çok önemsenir.</p>
<p>Ramazan'da seyahat edecekseniz <a href="/tr/ramazanda-japonya/">Ramazan'da Japonya</a> sayfasında oruç süreleri ve iftar ipuçları var. Helal yemek için <a href="/tr/kyoto-helal-restoranlar/">Kyoto</a> ve <a href="/tr/osaka-helal-restoranlar/">Osaka</a> sayfalarına bakın.</p>`],
        ['Ferhat ile namaz vakitlerine göre tur', `<p>Ferhat'ın turu sadece sizin grubunuza özel olduğu için gün, namaz vakitlerine göre kurulabilir: cuma günü Kobe Camii'ni rotaya eklemek, öğle namazı için bir molayı uygun yere denk getirmek gibi. Ferhat 4 yıldır Japonya'da yaşıyor, Kyoto, Osaka, Nara, Kobe ve Himeji'de yalnızca Türkçe rehberlik yapıyor. Fiyatı gruba göre WhatsApp'tan bildirir: ${ferhat}.</p>`],
      ],
      sss: [
        ["Japonya'da cuma namazı nerede kılınır?", "Kansai'de Kobe Camii, Osaka İbaraki Camii ve Kyoto Camii'nde. Saatleri camiden öğrenin."],
        ["Kyoto'da mescit var mı?", "Evet. Kyoto Camii'nin yanı sıra Nijo Kalesi, Kyoto Uluslararası Manga Müzesi ve Kyoto Handicraft Center'da ücretsiz namaz alanları var."],
        ["Kansai Havalimanı'nda mescit var mı?", "Evet, kadın ve erkek için ayrı, abdest yeri olan mescitler var."],
        ["Japonya'da kıble hangi yönde?", "Kansai'den yaklaşık batı-kuzeybatı (kuzeyden yaklaşık 293 derece). Telefon pusulası yeterlidir."],
        ["Kışın namaz vakitleri nasıl?", "Aralık sonunda akşam namazı yaklaşık 16:55'te, yatsı yaklaşık 18:20'de. Gün kısa olduğu için öğleden sonraki vakitler birbirine yakındır."],
      ],
      kaynaklar: [['Kobe Muslim Mosque', 'https://www.kobemosque.com'], ['Osaka Ibaraki Mosque', 'http://osakamosque.org'], ['Kyoto Turizm: Müslüman ziyaretçiler', 'https://kyoto.travel/en/muslim/'], ['Halal Media Japan: Kansai Havalimanı mescitleri', 'https://halalmedia.jp/archives/5343/prayer-rooms-at-kansai-international-airport/2/']],
    },
    {
      yol: 'ramazanda-japonya',
      kapak: 'osaka-kale-gece',
      baslik: "Ramazan'da Japonya'ya Gitmek: Oruç, İftar, 2027 | Türkçe Rehber",
      aciklama: "Ramazan 2027'de Japonya: tahmini tarihler, Kansai'de oruç süresi, iftar ve sahur için pratik çözümler, camiler. Türkçe rehber Ferhat ile oruca uygun tur.",
      h1: "Ramazan'da Japonya: oruç, iftar ve gezi planı",
      kisa: '2027 Ramazanı şubat-mart aylarına denk geliyor: oruç kısa, hava serin.',
      cevap: `2027'de Ramazan ayının yaklaşık 8 Şubat'ta başlayıp 9 Mart civarında bitmesi bekleniyor (kesin tarihler hilale göre belli olur). Bu dönemde Kansai'de hava serin ve günler kısa olduğu için oruç yaklaşık 12-13 saat sürer; gezmek için zor bir dönem değildir. Sahur için otel odasında hazırlık, iftar için helal restoran veya cami en pratik çözümlerdir. Oruçlu tempoya uygun, Türkçe bir tur için 4 yıldır Japonya'da yaşayan Türk rehber Ferhat'a WhatsApp'tan yazabilirsiniz: ${WA_VISIBLE}.`,
      bolumler: [
        ['2027 Ramazanı hangi tarihlere denk geliyor?', `<p>Hicri takvime göre 1448 Ramazanı'nın 2027 Şubat'ının ilk haftasının sonunda başlaması, Ramazan Bayramı'nın da Mart'ın ilk haftalarına denk gelmesi bekleniyor. Kesin tarihler, Diyanet ve Japonya'daki camilerin açıklamasıyla belli olur; yolculuğu buna göre esnek planlayın.</p>
<p>Bu dönem Japonya'da kışın sonudur. Kyoto ve Osaka'da gündüz sıcaklıkları genellikle 8-12 derece civarındadır, kar nadirdir. Şubat sonu ve Mart başı erik çiçeklerinin (ume) açtığı dönemdir; kiraz çiçekleri ise genellikle Mart sonunda başlar. Sakura dönemine göre turist kalabalığı daha azdır.</p>`],
        ['Oruç kaç saat sürer?', `<p>Şubat ortasında Osaka'da imsak yaklaşık 05:20, iftar (akşam ezanı) yaklaşık 17:40 civarındadır; yani oruç yaklaşık 12 saat sürer. Mart başında imsak yaklaşık 05:00, iftar yaklaşık 18:00 olur. Türkiye'deki yaz Ramazanlarıyla karşılaştırıldığında oldukça kısadır. Kesin vakitler için konumunuza göre çalışan bir uygulama kullanın.</p>
<p>Japonya Türkiye'den 6 saat ileride olduğu için, uçakta veya ilk gün vakitleri karıştırmamak önemlidir: oruca Japonya saatiyle başlayın ve uygulamanızın konumunu Japonya'ya ayarlayın.</p>`],
        ['Sahur ve iftar için pratik çözümler', `<ul class="ozet">
<li><strong>Sahur:</strong> Japon otellerinde kahvaltı genellikle 06:30-07:00'de başlar, yani imsaktan sonra. Sahuru odada yapmak için akşamdan meyve, ekmek, yoğurt veya helal paketli yiyecek alın. Mutfaklı bir daire kiralamak aileler için en rahatıdır.</li>
<li><strong>İftar:</strong> Helal restoranlar akşam 17:30-18:00 civarında dolabilir; iftar saatine yakın bir rezervasyon yapın. Kyoto ve Osaka'daki seçenekler için <a href="/tr/kyoto-helal-restoranlar/">Kyoto</a> ve <a href="/tr/osaka-helal-restoranlar/">Osaka helal restoranlar</a> sayfalarına bakın.</li>
<li><strong>Camiler:</strong> Kobe Camii, Osaka İbaraki Camii ve Kyoto Camii'nde Ramazan boyunca teravih ve topluca iftar düzenlenip düzenlenmediğini, saatleriyle birlikte camiye sorun.</li>
<li><strong>Su:</strong> Japonya'da musluk suyu içilebilir; iftarda su şişenizi otelden doldurabilirsiniz.</li>
</ul>`],
        ['Oruçluyken gezi nasıl planlanır?', `<p>Oruçlu gezide en büyük hata, normal bir gündeki gibi 20.000 adım atmaya çalışmaktır. Daha rahat bir plan:</p>
<ol>
<li><strong>Sabah erken başlayın:</strong> Fushimi Inari veya Kiyomizu-dera gibi kalabalık yerler sabah hem sakin hem serindir.</li>
<li><strong>Öğleden sonrayı hafif tutun:</strong> Müze, bahçe veya kısa bir tren yolculuğu gibi az yorucu planlar.</li>
<li><strong>İftarı rotanın sonuna koyun:</strong> Son durak, helal restorana yakın olsun; Osaka'da Namba, Kyoto'da Gion veya Kyoto İstasyonu gibi.</li>
<li><strong>Merdivenli yerleri seçerek gidin:</strong> Fushimi Inari'nin zirvesi yerine ilk bölümü yeterli olabilir.</li>
</ol>
<p>Ramazan Bayramı'nı Japonya'da geçirecekseniz bayram namazı için camilerin duyurularını takip edin. Namaz yerleri ve vakitleri için <a href="/tr/japonyada-namaz-vakitleri-ve-mescitler/">namaz vakitleri ve mescitler</a> sayfasına bakın.</p>`],
        ['Ferhat ile oruca uygun tur', `<p>Ferhat'ın turu sadece sizin grubunuza özeldir; tempo, oruçlu bir güne göre ayarlanabilir ve gün namaz vakitlerine göre kurulabilir. Ferhat 4 yıldır Japonya'da yaşayan Türk rehberdir ve Kyoto, Osaka, Nara, Kobe ve Himeji'de yalnızca Türkçe rehberlik yapar. Fiyatı gruba ve programa göre WhatsApp'tan bildirir: ${ferhat}.</p>`],
      ],
      sss: [
        ["2027'de Ramazan ne zaman?", "Yaklaşık 8 Şubat - 9 Mart 2027 arası bekleniyor. Kesin tarihler hilale göre belli olur."],
        ["Japonya'da oruç kaç saat?", "Şubat-Mart'ta Kansai'de yaklaşık 12-13 saat. Yazın bu süre 16 saati geçer."],
        ["Japonya'da iftar nerede yapılır?", "Helal restoranlarda veya camilerde. Restoranlarda iftar saatine yakın rezervasyon yapmak iyi olur."],
        ["Ramazan'da Japonya'ya gitmek mantıklı mı?", "Evet. 2027'de Ramazan kışın sonuna denk geliyor; günler kısa, hava serin ve sakura dönemine göre kalabalık az."],
        ["Japonya'da bayram namazı kılınır mı?", "Evet, Kansai'deki camilerde bayram namazı kılınır. Saat için caminin duyurusunu bekleyin."],
      ],
      kaynaklar: [['Kyoto Turizm: Müslüman ziyaretçiler', 'https://kyoto.travel/en/muslim/'], ['Kobe Muslim Mosque', 'https://www.kobemosque.com'], ['Japonya Meteoroloji Ajansı', 'https://www.jma.go.jp/jma/indexe.html']],
    },
    {
      yol: 'japonya-balayi-7-gun',
      kapak: 'kiyomizu-sonbahar',
      baslik: "Japonya Balayı Rotası 7 Gün: Kyoto, Osaka, Kobe | Türkçe Rehber",
      aciklama: "Kansai'de 7 günlük balayı rotası: Kyoto, Nara, Osaka, Kobe ve Himeji, ryokan gecesi, helal yemek ve namaz molaları. Türkçe rehber Ferhat ile gün gün plan.",
      h1: 'Japonya balayı rotası: Kansai\'de 7 gün',
      kisa: 'Gün gün 7 günlük plan: Kyoto, Nara, Osaka, Kobe ve Himeji.',
      cevap: `Japonya'da 7 günlük bir balayı için tek bölgeye, Kansai'ye odaklanmak en rahat seçimdir: 3 gün Kyoto (biri ryokan gecesiyle), 1 gün Nara, 2 gün Osaka ve 1 gün Kobe ile Himeji. Böylece her gün otel değiştirmeden, iki konaklama noktasıyla gezersiniz. Bu rota helal yemek ve namaz molalarına da uygundur. Rotayı Türkçe ve sadece ikinize özel gezmek için 4 yıldır Japonya'da yaşayan Türk rehber Ferhat'a WhatsApp'tan yazabilirsiniz: ${WA_VISIBLE}.`,
      bolumler: [
        ['Neden 7 gün Kansai?', `<p>Balayında en çok zaman kaybettiren şey sürekli valiz taşımaktır. Kansai'de Kyoto, Osaka, Nara, Kobe ve Himeji birbirine trenle 15 dakika ile 1 saat arasında uzaklıktadır. İki konaklama noktası (Kyoto ve Osaka) yeterlidir. Tokyo'yu da görmek istiyorsanız rotanın başına veya sonuna 2-3 gün ekleyin; Tokyo'dan Kyoto'ya Shinkansen ile yaklaşık 2 saat 15 dakikadır (<a href="/tr/tokyodan-kyotoya/">ayrıntılar</a>).</p>
<p>Daha kısa, 4-5 günlük romantik bir rota arıyorsanız <a href="/tr/japonya-balayi/">Japonya'da balayı: Kyoto ve Osaka</a> sayfasına bakın. Bu sayfa, bir haftalık balayı için gün gün plan veriyor.</p>`],
        ['Gün gün plan', `<ol>
<li><strong>1. gün, varış ve Osaka akşamı:</strong> Kansai Havalimanı'na (KIX) iniş, Osaka'daki otele geçiş (<a href="/tr/kansai-havalimani-ulasim/">havalimanı ulaşımı</a>). Akşam Dotonbori'nin ışıkları ve helal bir akşam yemeği.</li>
<li><strong>2. gün, Osaka:</strong> Sabah Osaka Kalesi parkında yürüyüş, öğlen Kuromon Pazarı, gün batımında Umeda Sky Building.</li>
<li><strong>3. gün, Nara:</strong> Nara Parkı'nın geyikleri, Todai-ji'deki dev Buda ve fenerli Kasuga Taisha. Akşam Kyoto'ya geçiş.</li>
<li><strong>4. gün, Doğu Kyoto:</strong> Sabah erken Fushimi Inari, öğleden sonra Kiyomizu-dera ve taş sokaklar Ninenzaka-Sannenzaka, akşam Gion. Bu gün kimono kiralamak için en güzel gündür (<a href="/tr/kyoto-kimono-kiralama/">kimono rehberi</a>).</li>
<li><strong>5. gün, Arashiyama ve ryokan:</strong> Bambu ormanı ve Togetsukyo Köprüsü, ardından odasına özel onsen banyosu olan bir ryokanda akşam. Ryokan seçerken helal veya özel yemek isteğinizi rezervasyonda belirtin.</li>
<li><strong>6. gün, Kinkaku-ji ve dinlenme:</strong> Sabah Altın Köşk, öğleden sonra serbest zaman veya alışveriş. Akşam Osaka'ya dönüş.</li>
<li><strong>7. gün, Kobe ve Himeji:</strong> Sabah Himeji Kalesi, öğleden sonra Kobe'de Kobe Camii, Kitano ve liman. Kobe'de helal bir Kobe bifteği akşam yemeği balayının güzel bir kapanışı olur.</li>
</ol>`],
        ['Balayı çiftlerine pratik ipuçları', `<ul class="ozet">
<li><strong>Oda:</strong> Japon otel odaları küçüktür. "Double" oda tek büyük yatak, "twin" iki ayrı yatak demektir; rezervasyonda dikkat edin.</li>
<li><strong>Ryokan:</strong> Ortak onsenler kadın ve erkek ayrıdır ve çıplak girilir. Mahremiyet için odasına özel banyosu olan (kashikiri veya özel açık hava banyolu) odaları seçin.</li>
<li><strong>Bavul:</strong> Kyoto'ya geçerken büyük valizleri otelden otele kargo (takkyubin) ile göndermek trenlerde çok rahatlatır.</li>
<li><strong>Mevsim:</strong> Kasım sonu sonbahar renkleri ve Mart sonu-Nisan başı kiraz çiçekleri en romantik ama en kalabalık dönemlerdir; otelleri erken ayırtın.</li>
<li><strong>Ücretler:</strong> Himeji Kalesi'nin yetişkin giriş ücreti 1 Mart 2026'dan beri Himeji'de oturmayanlar için 2.500 ¥'dir.</li>
</ul>`],
        ['Helal yemek ve namaz', `<p>Bu rota, helal restoranların yoğun olduğu Namba, Gion ve Kobe'den geçer. Cuma günü denk gelirse 7. günü cumaya alıp Kobe Camii'nde namaz kılabilirsiniz. Ayrıntılar için <a href="/tr/japonyada-namaz-vakitleri-ve-mescitler/">namaz vakitleri ve mescitler</a> ve <a href="/tr/helal-yemek-cami/">helal yemek ve camiler</a> sayfalarına bakın.</p>`],
        ['Ferhat ile balayı rotası', `<p>Ferhat, bu 7 günün tamamında veya sadece seçtiğiniz günlerde (örneğin Kyoto ve Nara) sizinle olabilir. Tur sadece ikinize özeldir, tamamen Türkçedir ve fotoğraf molaları, yemek ve namaz araları sizin temponuza göre ayarlanır. Ferhat 4 yıldır Japonya'da yaşıyor; fiyatı programa göre WhatsApp'tan bildirir: ${ferhat}.</p>`],
      ],
      sss: [
        ["Japonya balayı için kaç gün yeterli?", "Sadece Kansai için 7 gün rahat bir süredir. Tokyo'yu da eklemek istiyorsanız 10 gün düşünün."],
        ["Balayında Japonya'nın en romantik yeri neresi?", "Çoğu çift için Kyoto: akşam Gion sokakları, Kiyomizu-dera'nın terası ve Arashiyama'da bir ryokan gecesi."],
        ["Ryokanda helal yemek olur mu?", "Bazı ryokanlar helal veya özel yemek isteğini kabul eder. Rezervasyon sırasında yazılı olarak sorun."],
        ["Balayı için hangi ay daha iyi?", "Kasım sonu ve Mart sonu-Nisan başı en güzel ama en kalabalık dönemlerdir. Ekim ve Mayıs daha sakin ve yine çok güzeldir."],
        ["Ferhat tüm hafta bizimle olabilir mi?", "Ferhat seçtiğiniz günlerde Kansai'de rehberlik yapar. Gün sayısı ve fiyat için WhatsApp'tan yazın."],
      ],
      kaynaklar: [['Himeji: yabancı ziyaretçi ücreti (Japan Times)', 'https://www.japantimes.co.jp/news/2025/02/16/japan/himeji-castle-fee-rise'], ['Kyoto resmi turizm sitesi', 'https://kyoto.travel/en/']],
    },
    {
      yol: 'turkiyeden-japonyaya-ucus',
      kapak: 'kix',
      baslik: "Türkiye'den Japonya'ya Uçuş: İstanbul-Osaka | Türkçe Rehber",
      aciklama: "İstanbul'dan Osaka (Kansai) ve Tokyo'ya direkt uçuşlar, uçuş süreleri, saat farkı ve hangi havalimanının seçilmesi gerektiği. Kansai'de Türkçe rehber Ferhat.",
      h1: "Türkiye'den Japonya'ya uçuş: İstanbul'dan Osaka ve Tokyo",
      kisa: 'THY ile İstanbul-Osaka ve İstanbul-Tokyo direkt; süreler ve saat farkı.',
      cevap: `Türkiye'den Japonya'ya direkt uçuşlar İstanbul'dan kalkar: Türk Hava Yolları İstanbul Havalimanı'ndan hem Osaka Kansai'ye (KIX) hem Tokyo'ya (Narita ve Haneda) direkt uçar. İstanbul-Osaka yaklaşık 11 saat, dönüş yaklaşık 13 saat sürer. Kyoto, Osaka ve Nara'yı gezecekseniz Kansai Havalimanı'na inmek en pratik seçenektir. Japonya Türkiye'den 6 saat ileridedir. Kansai'de Türkçe özel tur için 4 yıldır Japonya'da yaşayan Türk rehber Ferhat'a WhatsApp'tan yazabilirsiniz: ${WA_VISIBLE}.`,
      bolumler: [
        ['Direkt uçuşlar', `<table><tr><th>Güzergâh</th><th>Havayolu</th><th>Süre (yaklaşık)</th><th>Kimin için</th></tr>
<tr><td>İstanbul (IST) → Osaka Kansai (KIX)</td><td>Türk Hava Yolları</td><td>Gidiş ~10 sa 45 dk, dönüş ~12 sa 50 dk</td><td>Kyoto, Osaka, Nara, Kobe, Himeji gezenler</td></tr>
<tr><td>İstanbul (IST) → Tokyo Narita (NRT)</td><td>Türk Hava Yolları</td><td>~11-12 saat</td><td>Tokyo'dan başlayanlar</td></tr>
<tr><td>İstanbul (IST) → Tokyo Haneda (HND)</td><td>Türk Hava Yolları</td><td>~11-12 saat</td><td>Tokyo merkezine yakın havalimanı isteyenler</td></tr></table>
<p>İstanbul-Osaka seferi 2026'da düzenli olarak uçuyor; sezona göre uçak tipi ve haftalık sefer sayısı değişiyor. ANA bu sefere ortak uçuş (codeshare) satıyor. Sefer günleri ve saatleri değişebilir; biletinizi almadan önce havayolunun sitesinden kontrol edin. Ankara, İzmir veya Antalya'dan uçacaksanız İstanbul aktarmalı bilet alırsınız.</p>`],
        ['Osaka mı Tokyo mu: hangi havalimanı?', `<p>Rotanız Kansai ağırlıklıysa Kansai Havalimanı'na inin. KIX'ten Osaka'nın Namba bölgesine Nankai treniyle yaklaşık 40-45 dakika, Kyoto'ya Haruka ekspresiyle yaklaşık 75-80 dakikadır (<a href="/tr/kansai-havalimani-ulasim/">havalimanından şehre ulaşım</a>).</p>
<p>Hem Tokyo'yu hem Kyoto'yu görecekseniz en verimli yöntem çoğu zaman <strong>"açık uçlu" bilettir</strong>: Tokyo'ya inip Osaka'dan dönmek (veya tersi). Böylece aynı yolu iki kez yapmazsınız; Tokyo-Kyoto arası Shinkansen ile yaklaşık 2 saat 15 dakikadır (<a href="/tr/tokyodan-kyotoya/">ayrıntılar</a>).</p>`],
        ['Aktarmalı alternatifler', `<p>Direkt uçuş fiyatları yüksek olduğunda Körfez veya Asya aktarmalı biletler (örneğin Dubai, Doha, Seul veya Şanghay üzerinden) daha uygun olabilir. Toplam yolculuk süresi uzar ve aktarma ülkesinin transit kurallarını kontrol etmeniz gerekir. Helal yemek için havayolundan önceden "Muslim meal" (MOML) isteyebilirsiniz.</p>`],
        ['Saat farkı ve jet lag', `<p>Japonya (UTC+9), Türkiye'den (UTC+3) 6 saat ileridedir ve iki ülke de yaz saati uygulamaz; fark yıl boyunca aynıdır. İstanbul'dan gece kalkan uçuşlar Japonya'ya ertesi gün akşamüstü veya akşam ulaşır. İlk günü hafif tutun: otele yerleşin, kısa bir akşam yürüyüşü yapın ve ağır turu ikinci güne bırakın. Namaz vakitlerini telefonunuzda Japonya konumuna göre ayarlamayı unutmayın (<a href="/tr/japonyada-namaz-vakitleri-ve-mescitler/">namaz vakitleri</a>).</p>`],
        ['Vize ve giriş', `<p>Umuma mahsus pasaport taşıyan Türk vatandaşları turistik amaçla Japonya'ya 90 güne kadar vizesiz girebilir; Japonya Dışişleri Bakanlığı'nın listesine göre bu muafiyet makinece okunabilir pasaport (ICAO standardında) gerektirir. Ayrıntılar <a href="/tr/japonya-vize/">Japonya vizesi</a> sayfasında. Göçmenlik ve gümrük formlarını Visit Japan Web'de önceden doldurabilirsiniz.</p>`],
        ['Kansai\'ye indikten sonra', `<p>Ferhat, 4 yıldır Japonya'da yaşayan Türk tur rehberidir ve Kyoto, Osaka, Nara, Kobe ve Himeji'de yalnızca Türkçe özel turlar yapar. Uçuş tarihlerinizi ve kaç gün kalacağınızı yazarsanız rotanızı birlikte planlayabilirsiniz; fiyatı gruba göre WhatsApp'tan bildirir: ${ferhat}.</p>`],
      ],
      sss: [
        ["İstanbul'dan Osaka'ya direkt uçuş var mı?", "Evet, Türk Hava Yolları İstanbul-Osaka Kansai arasında direkt uçuyor. Sefer günleri sezona göre değişir."],
        ["İstanbul Osaka kaç saat?", "Gidiş yaklaşık 10 saat 45 dakika, dönüş rüzgâr nedeniyle yaklaşık 12 saat 50 dakika."],
        ["Japonya ile Türkiye arasında saat farkı ne kadar?", "6 saat. Japonya ileridedir ve fark yıl boyunca değişmez."],
        ["Kyoto'ya gitmek için hangi havalimanına inmeliyim?", "Kansai Havalimanı'na (KIX). Kyoto'ya Haruka ekspresiyle yaklaşık 75-80 dakikadır."],
        ["Ankara'dan Japonya'ya direkt uçuş var mı?", "Hayır, Ankara, İzmir ve diğer şehirlerden İstanbul aktarmalı uçulur."],
      ],
      kaynaklar: [['Türk Hava Yolları: Osaka uçuşları', 'https://www.turkishairlines.com/'], ['Flightmapper: TK IST-KIX', 'https://info.flightmapper.net/route/Turkish_Airlines_TK_IST_KIX'], ['Japonya Dışişleri Bakanlığı: vize muafiyeti', 'https://www.mofa.go.jp/j_info/visit/visa/short/novisa.html'], ['Visit Japan Web', 'https://services.digital.go.jp/en/visit-japan-web/']],
    },
    {
      yol: 'japonya-butce-hesabi',
      kapak: 'umeda',
      baslik: "Japonya Gezisi Kaç Para? Günlük Bütçe Hesabı | Türkçe Rehber",
      aciklama: "Japonya gezisi bütçesi: Kansai'de konaklama, yemek, ulaşım ve giriş ücretleri yen olarak, TL'ye nasıl çevrilir, nerede tasarruf edilir. Türkçe rehber Ferhat.",
      h1: 'Japonya gezisi kaç para? Kansai için günlük bütçe',
      kisa: 'Konaklama, yemek, ulaşım ve giriş ücretleri yen olarak; TL hesabı.',
      cevap: `Kansai'de (Kyoto, Osaka, Nara) orta seviye bir gezi için kişi başı günlük bütçe, konaklama hariç yaklaşık 6.000-10.000 ¥'dir: yemek 3.000-6.000 ¥, şehir içi ulaşım 1.000-1.500 ¥, tapınak girişleri 500-2.500 ¥. İki kişilik orta sınıf bir otel odası sezona göre gecelik yaklaşık 12.000-30.000 ¥ arasıdır. Döviz kuru sık değiştiği için bütçenizi yen olarak yapıp TL'ye güncel kurdan çevirin. Rehberli bir gün için 4 yıldır Japonya'da yaşayan Türk rehber Ferhat fiyatı gruba göre WhatsApp'tan bildirir: ${WA_VISIBLE}.`,
      bolumler: [
        ['Neden bütçeyi yen olarak yapmalı?', `<p>TL ile yen arasındaki kur kısa sürede çok değişebilir. Bu sayfadaki tüm rakamlar yen (¥) olarak verilmiştir; planladığınız toplamı, yola çıkmadan önce bankanızın veya güncel bir döviz sitesinin kuruyla TL'ye çevirin ve kur farkı için yüzde 10-15 pay bırakın. Japonya'da kartla ödeme yaygındır, ama küçük tapınaklar, pazar tezgâhları ve bazı restoranlar sadece nakit kabul eder; günlük 10.000-20.000 ¥ nakit bulundurmak iyi olur. Yen, 7-Eleven ATM'lerinden yabancı kartlarla çekilebilir.</p>`],
        ['Kalem kalem günlük harcamalar', `<table><tr><th>Kalem</th><th>Yaklaşık tutar (kişi başı)</th><th>Not</th></tr>
<tr><td>Kahvaltı (konbini veya kafe)</td><td>500-1.500 ¥</td><td>Otel kahvaltısı genellikle daha pahalı.</td></tr>
<tr><td>Öğle yemeği (helal ramen, set menü)</td><td>1.200-2.000 ¥</td><td>Helal restoranlar normal restoranlardan biraz pahalı olabilir.</td></tr>
<tr><td>Akşam yemeği</td><td>2.000-5.000 ¥</td><td>Helal wagyu veya Kobe bifteği çok daha pahalıdır.</td></tr>
<tr><td>Şehir içi tren ve otobüs</td><td>1.000-1.500 ¥</td><td>Kyoto otobüsü tek ücret; IC kartla ödenir.</td></tr>
<tr><td>Kiyomizu-dera, Kinkaku-ji</td><td>Her biri yaklaşık 500 ¥</td><td>Fushimi Inari ücretsiz.</td></tr>
<tr><td>Himeji Kalesi</td><td>2.500 ¥</td><td>1 Mart 2026'dan beri Himeji'de oturmayan yetişkinler için; 18 yaş altı ücretsiz.</td></tr></table>
<p>Ücretler değişebilir; özellikle giriş ücretleri 2025-2026'da birçok yerde arttı. Gitmeden önce resmi siteleri kontrol edin.</p>`],
        ['Konaklama ve şehirler arası ulaşım', `<ul class="ozet">
<li><strong>Otel:</strong> Osaka'da orta sınıf bir "business hotel" iki kişilik oda gecelik yaklaşık 12.000-25.000 ¥; Kyoto'da sonbahar ve kiraz döneminde bu rakam iki katına çıkabilir. Ryokan geceleri akşam yemeği dahil kişi başı çok daha yüksektir.</li>
<li><strong>Konaklama vergisi:</strong> Kyoto, 1 Mart 2026'dan beri oda fiyatına göre kişi başı gecelik 200-10.000 ¥ arasında konaklama vergisi alır; Osaka da kendi vergisini uygular.</li>
<li><strong>Osaka-Kyoto treni:</strong> Hankyu veya Keihan ile yaklaşık 400-450 ¥ (<a href="/tr/osakadan-kyotoya-ulasim/">ayrıntılar</a>).</li>
<li><strong>JR Pass:</strong> 7 günlük normal JR Pass 50.000 ¥'dir. Sadece Kansai'de kalacaksanız genellikle gerekmez; tek tek bilet veya IC kart daha ucuza gelir.</li>
<li><strong>Çıkış vergisi:</strong> 1 Temmuz 2026'dan beri uluslararası turist vergisi 3.000 ¥'dir ve genellikle uçak biletine dahildir.</li>
</ul>`],
        ['Örnek: iki kişi, 5 gece Kansai', `<p>İki kişilik bir çiftin orta seviyede 5 gece Kansai gezisi için kabaca hesap (uçak bileti hariç):</p>
<ol>
<li>Otel: 5 gece × 18.000 ¥ = yaklaşık 90.000 ¥</li>
<li>Yemek ve ulaşım: 2 kişi × 5 gün × 7.000 ¥ = yaklaşık 70.000 ¥</li>
<li>Girişler, IC kart, küçük alışveriş: yaklaşık 20.000-30.000 ¥</li>
</ol>
<p>Toplam yaklaşık 180.000-190.000 ¥ eder. Bu tutarı TL'ye güncel kurdan çevirin. Rehberli günler, ryokan gecesi ve hediyelik alışveriş bunun üzerine eklenir.</p>`],
        ['Nerede tasarruf edilir?', `<ul class="ozet">
<li>Konbini kahvaltısı ve öğle için set menüler (teishoku) çok ekonomiktir.</li>
<li>Kansai'de kalıyorsanız JR Pass yerine ICOCA kartı kullanın.</li>
<li>1 Kasım 2026'dan beri tax-free alışverişte vergi önce ödenir, çıkışta iade edilir; fişlerinizi saklayın.</li>
<li>Musluk suyu içilebilir; şişe su almak zorunda değilsiniz.</li>
<li>Fushimi Inari, Nara Parkı ve Arashiyama bambu ormanı ücretsizdir.</li>
</ul>`],
        ['Ferhat\'ın fiyatı', `<p>Ferhat'ın fiyatı sabit değildir; kişi sayısına, tur süresine ve gidilecek yerlere göre değişir ve sadece WhatsApp'tan bildirilir: ${ferhat}. Sitenin diğer dillerindeki sabit fiyatlar (örneğin 4 saat 38.000 ¥, 8 saat 58.000 ¥) Tony'nin turlarıdır, Ferhat'ın değil. Tren biletleri, giriş ücretleri ve yemekler genellikle tura dahil değildir.</p>`],
      ],
      sss: [
        ["Japonya'da günlük ne kadar para harcanır?", "Kansai'de konaklama hariç kişi başı orta seviyede günlük yaklaşık 6.000-10.000 ¥. Helal wagyu gibi özel yemekler bunu artırır."],
        ["Japonya'ya ne kadar nakit götürmeliyim?", "Kart yaygın, ama günlük 10.000-20.000 ¥ nakit bulundurun. 7-Eleven ATM'lerinden yabancı kartla yen çekilebilir."],
        ["Japonya pahalı mı?", "Otel ve şehirler arası tren pahalı; günlük yemek ve şehir içi ulaşım Avrupa'ya göre makul. En büyük kalem genellikle uçak ve otel."],
        ["JR Pass almaya değer mi?", "Sadece Kansai'de kalacaksanız çoğu zaman hayır. Tokyo-Kyoto gidiş dönüş ve uzun yolculuklar varsa hesaplayın; 7 günlük pas 50.000 ¥."],
        ["Ferhat'ın tur fiyatı ne kadar?", "Fiyat gruba ve programa göre WhatsApp'tan verilir. Sitedeki 38.000 ¥ ve 58.000 ¥ gibi fiyatlar Tony'nin turlarıdır."],
      ],
      kaynaklar: [['Kyoto konaklama vergisi', 'https://kyoto.travel/en/news/tax-change/'], ['Japonya çıkış vergisi 3.000 ¥', 'https://www.japan.travel/en/ca/news/japans-international-tourist-tax-is-increasing/'], ['Himeji Kalesi ücreti (Japan Times)', 'https://www.japantimes.co.jp/news/2025/02/16/japan/himeji-castle-fee-rise'], ['Tax-free iade sistemi', 'https://www.japan-guide.com/news/tax-free-shopping.html'], ['JR Pass resmi sitesi', 'https://japanrailpass.net/en/']],
    },
    {
      yol: 'kyoto-kimono-kiralama',
      kapak: 'gion',
      baslik: "Kyoto'da Kimono Kiralama ve Tesettür | Türkçe Rehber",
      aciklama: "Kyoto'da kimono kiralama nasıl yapılır, ne kadar sürer, tesettürlü giyilir mi, hangi rotada yürünür? Gion ve Kiyomizu için ipuçları. Türkçe rehber Ferhat.",
      h1: "Kyoto'da kimono kiralama: nasıl yapılır, tesettürle olur mu?",
      kisa: 'Rezervasyon, giyinme süresi, başörtüsüyle kimono ve en güzel rota.',
      cevap: `Kyoto'da kimono kiralamak kolaydır: Kiyomizu-dera, Gion ve Kyoto İstasyonu çevresindeki kiralama dükkânlarında internetten rezervasyon yapıp gelirsiniz, giydirme ve saç yaklaşık 30-60 dakika sürer, kimonoyu akşam aynı dükkâna geri verirsiniz. Basit planlar genellikle birkaç bin yenden başlar. Kimono uzun kollu ve bol kesimlidir; başörtüsüyle giymek mümkündür, rezervasyonda belirtin. Kimonoyla Kyoto'yu Türkçe gezmek için 4 yıldır Japonya'da yaşayan Türk rehber Ferhat'a WhatsApp'tan yazabilirsiniz: ${WA_VISIBLE}.`,
      bolumler: [
        ['Kimono kiralama nasıl işler?', `<ol>
<li><strong>Rezervasyon:</strong> Dükkânın sitesinden tarih, saat ve plan seçilir. Hafta sonları, sonbahar ve kiraz döneminde erken yer ayırtın.</li>
<li><strong>Seçim:</strong> Dükkânda yüzlerce desen arasından kimono, kuşak (obi) ve çanta seçersiniz.</li>
<li><strong>Giydirme:</strong> Personel kimonoyu giydirir; kadınlarda saç yapımı genellikle ek ücretlidir. Toplam 30-60 dakika sürer.</li>
<li><strong>Gezi:</strong> Kendi kıyafetleriniz dükkânda kalır. Kimonoyla gün boyu gezersiniz.</li>
<li><strong>İade:</strong> Akşam dükkânın kapanış saatinden önce geri verilir. Bazı zincirler ertesi gün iade veya farklı şubeye iade seçeneği sunar.</li>
</ol>
<p>Kyoto'da Okamoto, Yumeyakata ve Wargo gibi birden fazla şubesi olan kiralama zincirleri ve çok sayıda küçük dükkân vardır. Fiyatlar plana göre değişir: basit planlar genellikle birkaç bin yenden başlar; saç, ipek kimono, erkekler için hakama veya fotoğraf çekimi gibi eklemeler fiyatı yükseltir. Güncel fiyatı dükkânın kendi sitesinden kontrol edin.</p>`],
        ['Başörtüsüyle kimono giyilir mi?', `<p>Evet. Kimono uzun kollu, bilekleri ve ayak bileklerini örten bol bir giysidir; tesettüre uygun bir kıyafettir. Dikkat edilecek birkaç nokta:</p>
<ul class="ozet">
<li>Rezervasyonda başörtüsü taktığınızı belirtin; saç yapımı planını seçmeyin.</li>
<li>Kimono içine giyilecek ince bir iç kıyafeti (uzun kollu tişört ve tayt) yanınızda getirin; bazı dükkânlar kendi iç giysilerini verir.</li>
<li>Başörtünüzü kimononun rengine uyacak düz bir renkte seçmek fotoğraflarda çok güzel durur.</li>
<li>Giydirme sırasında kadın personel isteyebilirsiniz; çoğu dükkânda kadınları kadın personel giydirir.</li>
</ul>`],
        ['Kimonoyla en güzel rota', `<p>Kimonoyla yürümek, normal yürüyüşten yavaştır ve geta veya zori denen geleneksel terlikler uzun mesafede yorar. Bu yüzden rotayı kısa ve fotoğraf dolu tutmak en iyisidir:</p>
<ol>
<li><strong>Kiyomizu-dera:</strong> Ahşap teras ve şehir manzarası.</li>
<li><strong>Sannenzaka ve Ninenzaka:</strong> Taş merdivenli eski sokaklar; kimonolu fotoğrafın klasik yeri.</li>
<li><strong>Yasaka Pagodası (Hokan-ji):</strong> Beş katlı pagoda ve dar sokaklar.</li>
<li><strong>Gion ve Hanamikoji:</strong> Ahşap çay evleri. Özel sokaklarda fotoğraf çekmenin yasak olduğu tabelalara dikkat edin.</li>
</ol>
<p>Bu rota bir öğleden sonraya sığar ve dükkânlar da tam bu bölgededir. Sabah erken başlarsanız kalabalıktan önce fotoğraf çekersiniz. Kyoto'nun geri kalanı için <a href="/tr/kyoto-bir-gunde/">Kyoto'da 1 günde ne yapılır</a> sayfasına bakın.</p>`],
        ['Pratik ipuçları', `<ul class="ozet">
<li>Yağmurlu günde birçok dükkân ücretsiz şemsiye ve uygun terlik verir; yine de iptal koşullarını önceden okuyun.</li>
<li>Kimonoyla tren ve otobüse binilir, ama Arashiyama gibi uzak bir bölgeye gidecekseniz o bölgedeki bir dükkândan kiralamak daha rahattır.</li>
<li>Namaz için kimonoyla eğilmek ve secde etmek zorlaşabilir; namaz vakitlerini kiralama saatine göre ayarlayın. Kyoto'daki mescitler için <a href="/tr/japonyada-namaz-vakitleri-ve-mescitler/">namaz sayfasına</a> bakın.</li>
<li>Kimonoyla yemek yerken kollara dikkat edin; dükkânlar genellikle önlük vermez. Helal öğle yemeği seçenekleri için <a href="/tr/kyoto-helal-restoranlar/">Kyoto helal restoranlar</a> sayfasına bakın.</li>
</ul>`],
        ['Ferhat ile kimonolu Kyoto günü', `<p>Ferhat'a kimono kiralayacağınızı söylerseniz Kyoto gününü buna göre, kimonoyla yürünebilecek kısa ve fotoğraf dolu bir rotayla planlayabilirsiniz. Ferhat 4 yıldır Japonya'da yaşayan Türk rehberdir ve Kansai'de yalnızca Türkçe özel tur yapar; kimono kiralama ücreti tura dahil değildir. Fiyatı gruba göre WhatsApp'tan bildirir: ${ferhat}. Balayı çiftleri için kimono günü, <a href="/tr/japonya-balayi-7-gun/">7 günlük balayı rotasının</a> 4. günüdür.</p>`],
      ],
      sss: [
        ["Kyoto'da kimono kiralama ne kadar?", "Basit planlar genellikle birkaç bin yenden başlar. Saç, ipek kimono veya fotoğraf çekimi gibi eklemeler fiyatı artırır; güncel fiyatı dükkânın sitesinden kontrol edin."],
        ["Kimono giymek kaç dakika sürer?", "Giydirme ve saçla birlikte genellikle 30-60 dakika."],
        ["Tesettürlü kimono giyilir mi?", "Evet. Kimono uzun kollu ve boldur; başörtüsüyle giyilebilir. Rezervasyonda belirtin."],
        ["Erkekler kimono kiralayabilir mi?", "Evet, erkek kimonosu ve hakama planları var. Çiftler için ortak planlar da sunulur."],
        ["Kimonoyla nerede fotoğraf çekilir?", "Kiyomizu-dera, Sannenzaka, Ninenzaka, Yasaka Pagodası ve Gion. Sabah erken saatler en sakinidir."],
      ],
      kaynaklar: [['Kyoto resmi turizm sitesi', 'https://kyoto.travel/en/'], ['Kyoto Turizm: Müslüman ziyaretçiler', 'https://kyoto.travel/en/muslim/']],
    },
  ]
}
