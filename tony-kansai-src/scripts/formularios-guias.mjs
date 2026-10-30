#!/usr/bin/env node
// Genera los formularios de reseñas de los otros guías:
//   /tr/yorum/   Ferhat, en turco, con aire de azulejo de İznik
//   /ru/otzyv/   Larion, en ruso, con aire de porcelana Gzhel
//   /fr/avis/    Iheb, en francés, con aire de toile de Jouy
// Envían al mismo receptor que /opinar.html (Worker /api/resenas) con `guide`,
// y el Worker las publica solas en la página de ese guía (no en la de Tony).
// HTML suelto, sin React: rutas-estaticas.mjs no los pisa (data-estatica) y
// llevan noindex porque un formulario no responde a ninguna búsqueda.
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const FORMULARIOS = [
  {
    ruta: 'tr/yorum', lang: 'tr', guia: 'ferhat', pagina: '/tr/', serit: 'Ferhat · Japonya Türkçe Rehber',
    ciudades: ['Kyoto', 'Osaka', 'Nara', 'Kobe', 'Himeji', 'Hiroshima'],
    // İznik: cobalto, turquesa y rojo coral sobre blanco roto.
    tema: { fondo: '#f7f4ee', tinta: '#14213d', acento: '#1f4fa3', acento2: '#0e9aa7', resalte: '#c8102e', kart: '#fffdf8' },
    patron: `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><g fill='none' stroke-width='2'><path d='M40 8c10 14 10 26 0 32-10-6-10-18 0-32z' stroke='%231f4fa3'/><path d='M40 72c10-14 10-26 0-32-10 6-10 18 0 32z' stroke='%231f4fa3'/><path d='M8 40c14-10 26-10 32 0-6 10-18 10-32 0z' stroke='%230e9aa7'/><path d='M72 40c-14-10-26-10-32 0 6 10 18 10 32 0z' stroke='%230e9aa7'/><circle cx='40' cy='40' r='4' fill='%23c8102e' stroke='none'/></g></svg>`,
    t: {
      titulo: 'Ferhat ile turunuz nasıldı?',
      baslik: 'Ferhat için yorum yazın | Japonya Türkçe Rehber',
      giris: 'Birkaç cümle yeterli. Yorumunuz Ferhat\'ın sayfasında yayınlanır ve Japonya\'ya gelecek diğer Türk gezginlere yardımcı olur.',
      puan: 'Puanınız', ad: 'Adınız', adOrnek: 'Örn. Ayşe ve Mehmet', ulke: 'Şehir / ülke', ulkeOrnek: 'Örn. İstanbul, Türkiye',
      tur: 'Hangi tur?', turSec: 'Seçin (isteğe bağlı)', diger: 'Diğer',
      yorum: 'Yorumunuz', yorumOrnek: 'Gün nasıl geçti? Ferhat\'ın en çok neyini beğendiniz?',
      izin: 'Yorumumun adım ve şehrimle birlikte web sitesinde yayınlanmasına izin veriyorum.',
      gonder: 'Yorumu gönder', gonderiliyor: 'Gönderiliyor…',
      eksik: 'Lütfen puan verin, adınızı yazın, en az 20 karakterlik bir yorum yazın ve izin kutusunu işaretleyin.',
      hata: 'Gönderilemedi. İnternet bağlantınızı kontrol edip tekrar deneyin.',
      tamam: 'Teşekkürler! Yorumunuz yayınlandı.', bekle: 'Teşekkürler! Yorumunuz alındı ve kısa süre içinde yayınlanacak.',
      gor: 'Ferhat\'ın sayfasında görün →',
    },
  },
  {
    ruta: 'ru/otzyv', lang: 'ru', guia: 'larion', pagina: '/ru/', serit: 'Ларион · гид по Японии на русском',
    ciudades: ['Киото', 'Осака', 'Нара', 'Хиросима', 'Миядзима', 'Химэдзи'],
    // Gzhel: azul cobalto sobre blanco porcelana.
    tema: { fondo: '#f4f7fc', tinta: '#0d1b3e', acento: '#1d3fa0', acento2: '#3a63d6', resalte: '#1d3fa0', kart: '#ffffff' },
    patron: `<svg xmlns='http://www.w3.org/2000/svg' width='90' height='90' viewBox='0 0 90 90'><g fill='none' stroke='%231d3fa0' stroke-width='2'><path d='M45 20c8 8 8 17 0 25-8-8-8-17 0-25z'/><path d='M45 45c10-4 18 0 22 9-10 4-18 0-22-9z'/><path d='M45 45c-10-4-18 0-22 9 10 4 18 0 22-9z'/><path d='M45 45v28' /><circle cx='45' cy='12' r='3' fill='%231d3fa0'/></g></svg>`,
    t: {
      titulo: 'Как прошла экскурсия с Ларионом?',
      baslik: 'Оставить отзыв Лариону | Гид по Японии на русском',
      giris: 'Хватит пары предложений. Отзыв появится на странице Лариона и поможет другим путешественникам.',
      puan: 'Ваша оценка', ad: 'Ваше имя', adOrnek: 'Например, Анна и Сергей', ulke: 'Город / страна', ulkeOrnek: 'Например, Москва, Россия',
      tur: 'Какая экскурсия?', turSec: 'Выберите (необязательно)', diger: 'Другое',
      yorum: 'Ваш отзыв', yorumOrnek: 'Как прошёл день? Что больше всего понравилось?',
      izin: 'Разрешаю опубликовать мой отзыв на сайте с моим именем и городом.',
      gonder: 'Отправить отзыв', gonderiliyor: 'Отправляем…',
      eksik: 'Поставьте оценку, укажите имя, напишите отзыв (не меньше 20 символов) и отметьте согласие.',
      hata: 'Не удалось отправить. Проверьте интернет и попробуйте ещё раз.',
      tamam: 'Спасибо! Ваш отзыв опубликован.', bekle: 'Спасибо! Отзыв получен и скоро появится на сайте.',
      gor: 'Посмотреть на странице Лариона →',
    },
  },
  {
    ruta: 'fr/avis', lang: 'fr', guia: 'iheb', pagina: '/fr/avis-clients/', serit: 'Iheb · Guide francophone à Tokyo',
    ciudades: ['Tokyo', 'Kamakura', 'Nikko', 'Hakone', 'Mont Fuji', 'Nagano', 'Shizuoka'],
    // Toile de Jouy: bleu de Prusse et rouge garance sur écru.
    tema: { fondo: '#f6f3ec', tinta: '#1b2440', acento: '#24407a', acento2: '#5b7bb5', resalte: '#a6243a', kart: '#fffdf7' },
    patron: `<svg xmlns='http://www.w3.org/2000/svg' width='84' height='84' viewBox='0 0 84 84'><g fill='none' stroke='%2324407a' stroke-width='1.6'><path d='M42 14c6 8 6 16 0 22-6-6-6-14 0-22z'/><path d='M42 36c-9 2-15 8-16 16 9-1 15-7 16-16z'/><path d='M42 36c9 2 15 8 16 16-9-1-15-7-16-16z'/><path d='M42 36v34'/><circle cx='42' cy='72' r='3' fill='%23a6243a' stroke='none'/></g></svg>`,
    t: {
      titulo: 'Comment s’est passée votre visite avec Iheb ?',
      baslik: 'Laisser un avis à Iheb | Guide francophone à Tokyo',
      giris: 'Quelques phrases suffisent. Votre avis sera publié sur la page d’Iheb et aidera d’autres voyageurs francophones à préparer leur séjour au Japon.',
      puan: 'Votre note', ad: 'Votre prénom', adOrnek: 'Ex. Claire et Karim', ulke: 'Ville / pays', ulkeOrnek: 'Ex. Lyon, France',
      tur: 'Quelle visite ?', turSec: 'Choisir (facultatif)', diger: 'Autre',
      yorum: 'Votre avis', yorumOrnek: 'Comment s’est passée la journée ? Qu’avez-vous le plus apprécié chez Iheb ?',
      izin: 'J’accepte que mon avis soit publié sur le site avec mon prénom et ma ville.',
      gonder: 'Envoyer l’avis', gonderiliyor: 'Envoi…',
      eksik: 'Merci de donner une note, d’indiquer votre prénom, d’écrire un avis d’au moins 20 caractères et de cocher la case d’accord.',
      hata: 'Envoi impossible. Vérifiez votre connexion et réessayez.',
      tamam: 'Merci ! Votre avis est publié.', bekle: 'Merci ! Votre avis a bien été reçu et sera publié sous peu.',
      gor: 'Voir tous les avis sur Iheb →',
    },
  },
]

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function html(f) {
  const { t, tema: c } = f
  return `<!doctype html>
<html lang="${f.lang}" data-estatica="formulario">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(t.baslik)}</title>
<meta name="robots" content="noindex, follow">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>
:root{--fondo:${c.fondo};--tinta:${c.tinta};--acento:${c.acento};--acento2:${c.acento2};--resalte:${c.resalte};--kart:${c.kart};--suave:#5b6478}
@media (prefers-color-scheme:dark){:root{--fondo:#0f1424;--tinta:#e9edf7;--kart:#18203a;--suave:#a5afc7}}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;color:var(--tinta);font:17px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  background:var(--fondo) url("data:image/svg+xml,${f.patron.replace(/"/g, "'").replace(/#/g, '%23')}") repeat;background-size:80px}
.kap{max-width:560px;margin:0 auto;padding:20px 16px 48px}
.serit{background:var(--acento);color:#fff;text-align:center;font-weight:700;letter-spacing:.06em;font-size:15px;padding:16px;border-bottom:6px double var(--acento2)}
.serit::before,.serit::after{content:"";display:block;height:34px;margin:-16px -16px 12px;background:var(--fondo) url("data:image/svg+xml,${f.patron.replace(/"/g, "'").replace(/#/g, '%23')}") repeat-x center/48px}
.serit::after{margin:12px -16px -16px}
.kart{background:var(--kart);border:2px solid var(--acento);border-radius:18px;padding:24px 20px;box-shadow:0 0 0 6px var(--kart),0 0 0 8px var(--acento2),0 18px 40px rgba(0,0,0,.18);margin-top:12px}
h1{margin:0 0 8px;font-size:clamp(24px,6vw,30px);line-height:1.2;color:var(--acento)}
@media (prefers-color-scheme:dark){h1{color:var(--tinta)}}
p.giris{margin:0 0 18px;color:var(--suave)}
label{display:block;font-weight:600;margin:16px 0 6px}
input[type=text],textarea,select{width:100%;font:inherit;color:inherit;background:transparent;border:1.5px solid color-mix(in srgb,var(--acento) 45%,transparent);border-radius:10px;padding:11px 12px}
textarea{min-height:140px;resize:vertical}
input:focus,textarea:focus,select:focus{outline:2px solid var(--acento2);outline-offset:1px}
.yildiz{display:flex;gap:6px}
.yildiz button{font-size:36px;line-height:1;background:none;border:0;padding:2px;cursor:pointer;color:color-mix(in srgb,var(--tinta) 25%,transparent)}
.yildiz button.on{color:#e3a400}
.izin{display:flex;gap:10px;align-items:flex-start;font-weight:400;font-size:15px}
.izin input{margin-top:4px;width:20px;height:20px;flex:none}
.btn{display:block;width:100%;margin-top:20px;background:var(--acento);color:#fff;border:0;border-radius:999px;padding:15px;font:600 18px system-ui,sans-serif;cursor:pointer}
.btn:disabled{opacity:.6}
.uyari{display:none;margin-top:14px;padding:10px 12px;border-radius:10px;background:color-mix(in srgb,var(--resalte) 12%,transparent);color:var(--resalte);font-size:15px}
.uyari.on{display:block}
.tamam{display:none;text-align:center}.tamam.on{display:block}
.tamam a{display:inline-block;margin-top:14px;color:var(--acento);font-weight:600}
.gizli{position:absolute;left:-9999px}
</style>
</head>
<body>
<div class="serit">${esc(f.serit)}</div>
<main class="kap">
<div class="kart">
<form id="form" novalidate>
<h1>${esc(t.titulo)}</h1>
<p class="giris">${esc(t.giris)}</p>
<label id="puanEt">${esc(t.puan)}</label>
<div class="yildiz" role="radiogroup" aria-labelledby="puanEt">
${[1, 2, 3, 4, 5].map((n) => `<button type="button" role="radio" aria-checked="false" aria-label="${n}/5" data-n="${n}">★</button>`).join('')}
</div>
<label for="ad">${esc(t.ad)}</label>
<input type="text" id="ad" maxlength="60" autocomplete="name" placeholder="${esc(t.adOrnek)}">
<label for="ulke">${esc(t.ulke)}</label>
<input type="text" id="ulke" maxlength="40" placeholder="${esc(t.ulkeOrnek)}">
<label for="tur">${esc(t.tur)}</label>
<select id="tur"><option value="">${esc(t.turSec)}</option>${f.ciudades.map((x) => `<option>${esc(x)}</option>`).join('')}<option value="">${esc(t.diger)}</option></select>
<label for="yorum">${esc(t.yorum)}</label>
<textarea id="yorum" maxlength="1200" placeholder="${esc(t.yorumOrnek)}"></textarea>
<input class="gizli" type="text" id="web" tabindex="-1" autocomplete="off" aria-hidden="true">
<label class="izin"><input type="checkbox" id="izin"> <span>${esc(t.izin)}</span></label>
<button class="btn" id="gonder" type="submit">${esc(t.gonder)}</button>
<div class="uyari" id="uyari" role="alert"></div>
</form>
<div class="tamam" id="tamam" role="status">
<h1 id="tamamMetin"></h1>
<a href="${f.pagina}">${esc(t.gor)}</a>
</div>
</div>
</main>
<script>
const T = ${JSON.stringify({ eksik: t.eksik, hata: t.hata, tamam: t.tamam, bekle: t.bekle, gonder: t.gonder, gonderiliyor: t.gonderiliyor })};
const $ = (id) => document.getElementById(id);
let puan = 0;
document.querySelectorAll('.yildiz button').forEach((b) => b.addEventListener('click', () => {
  puan = +b.dataset.n;
  document.querySelectorAll('.yildiz button').forEach((x) => {
    x.classList.toggle('on', +x.dataset.n <= puan);
    x.setAttribute('aria-checked', String(+x.dataset.n === puan));
  });
}));
$('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const uyari = (m) => { $('uyari').textContent = m; $('uyari').classList.add('on'); };
  $('uyari').classList.remove('on');
  const ad = $('ad').value.trim(), yorum = $('yorum').value.trim();
  if (!puan || ad.length < 2 || yorum.length < 20 || !$('izin').checked) return uyari(T.eksik);
  const b = $('gonder'); b.disabled = true; b.textContent = T.gonderiliyor;
  try {
    const r = await fetch('/api/resenas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
      stars: puan, name: ad, country: $('ulke').value.trim(), tour: $('tur').value, text: yorum,
      lang: '${f.lang}', guide: '${f.guia}', consent: true, website: $('web').value, page: location.href,
    }) });
    if (!r.ok) throw new Error(r.status);
    const res = await r.json().catch(() => ({}));
    $('tamamMetin').textContent = res.publicada ? T.tamam : T.bekle;
    $('form').style.display = 'none'; $('tamam').classList.add('on');
  } catch { uyari(T.hata); b.disabled = false; b.textContent = T.gonder; }
});
</script>
</body>
</html>
`
}

for (const f of FORMULARIOS) {
  const dir = join(root, 'public', f.ruta)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html(f))
}
console.log(`formularios: ${FORMULARIOS.map((f) => '/' + f.ruta + '/').join(' ')}`)
