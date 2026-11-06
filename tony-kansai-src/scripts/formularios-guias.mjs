#!/usr/bin/env node
// Genera los formularios de reseñas de los otros guías:
//   /tr/yorum/   Ferhat, en turco, con aire de azulejo de İznik
//   /ru/otzyv/   Larion, en ruso, con aire de porcelana Gzhel
//   /fr/avis/    Iheb, en francés, con aire de toile de Jouy
//   /familias/opiniones/  Antonio, en español, con aire de seigaiha (olas japonesas)
//   /private/review/  Mario, en inglés, con el aire de juego de /private/ (FAN/EASY)
// Envían al mismo receptor que /opinar.html (Worker /api/resenas) con `guide`,
// y el Worker las publica solas en la página de ese guía (no en la de Tony).
// HTML suelto, sin React: rutas-estaticas.mjs no los pisa (data-estatica) y
// llevan noindex porque un formulario no responde a ninguna búsqueda.
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { equipoHTML, equipoCSS, equipoFuente } from './equipo-estatico.mjs'
import { IHEB_IDIOMAS_CSS, ihebIdiomas } from './iheb-estilo.mjs'

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
  {
    ruta: 'familias/opiniones', lang: 'es', guia: 'antonio', pagina: '/familias/opiniones-clientes/', serit: 'Antonio · Viajes a Japón para familias y grupos',
    ciudades: ['Kioto', 'Osaka', 'Tokio', 'Nara', 'Hakone y monte Fuji', 'Alpes japoneses', 'Hiroshima y Miyajima', 'Viaje completo por Japón'],
    // Seigaiha: verde pino y oro sobre papel washi, los colores de /familias/.
    tema: { fondo: '#f3f2ee', tinta: '#15211c', acento: '#1d5c45', acento2: '#c9861d', resalte: '#a8432c', kart: '#fbfbf8' },
    patron: `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='40' viewBox='0 0 80 40'><g fill='none' stroke='%231d5c45' stroke-width='1.4'><path d='M0 40a20 20 0 0 1 40 0M8 40a12 12 0 0 1 24 0M16 40a4 4 0 0 1 8 0'/><path d='M40 40a20 20 0 0 1 40 0M48 40a12 12 0 0 1 24 0M56 40a4 4 0 0 1 8 0'/><path d='M-20 20a20 20 0 0 1 40 0M20 20a20 20 0 0 1 40 0M60 20a20 20 0 0 1 40 0' stroke='%23c9861d'/></g></svg>`,
    t: {
      titulo: '¿Qué tal el viaje con Antonio?',
      baslik: 'Dejar una opinión a Antonio | Viajes a Japón para familias y grupos',
      giris: 'Con unas frases basta. Tu opinión se publica en la página de Antonio y ayuda a otras familias y grupos a preparar su viaje a Japón.',
      puan: 'Tu nota', ad: 'Tu nombre', adOrnek: 'Ej. Familia García', ulke: 'Ciudad / país', ulkeOrnek: 'Ej. Guadalajara, México',
      tur: '¿Qué viaje?', turSec: 'Elegir (opcional)', diger: 'Otro',
      yorum: 'Tu opinión', yorumOrnek: '¿Cómo fue el viaje? ¿Qué es lo que más te gustó de cómo lo organizó Antonio?',
      izin: 'Acepto que mi opinión se publique en la web con mi nombre y mi ciudad.',
      gonder: 'Enviar opinión', gonderiliyor: 'Enviando…',
      eksik: 'Pon una nota, escribe tu nombre, una opinión de al menos 20 caracteres y marca la casilla de permiso.',
      hata: 'No se ha podido enviar. Revisa la conexión e inténtalo de nuevo.',
      tamam: '¡Gracias! Tu opinión ya está publicada.', bekle: '¡Gracias! Hemos recibido tu opinión y se publicará en breve.',
      gor: 'Ver las opiniones sobre Antonio →',
    },
  },
  {
    ruta: 'private/review', lang: 'en', guia: 'mario', pagina: '/private/reviews/', serit: 'MARIO · PRIVATE GUIDE · JAPAN',
    variante: 'private', inicio: '/private/',
    ciudades: ['Kyoto', 'Tokyo', 'Osaka & Nara', 'Mount Fuji & Hakone', 'Nikko & Kamakura', 'Himeji & Kobe', 'Hiroshima & Miyajima', 'Multi-day journey', 'Otaku Japan', 'Full-service trip'],
    // Mismos colores y letras que /private/ (scripts/private.mjs): FAN de noche
    // con neón rosa y cian, EASY claro; se respeta el modo que eligió en la sección.
    tema: { fondo: '#0b0b1a', tinta: '#f4f4ff', acento: '#ff2e88', acento2: '#00e5ff', resalte: '#ff5a36', kart: '#15152e' },
    patron: `<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8'/>`,
    cabeza: `<meta name="theme-color" content="#0b0b1a">
<script>try{var m=localStorage.getItem('mario-modo');if(m==='easy'||m==='fan')document.documentElement.className=m}catch(e){}</script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Inter:wght@400;600&display=swap">`,
    css: `:root,html.fan{--fondo:#0b0b1a;--tinta:#f4f4ff;--kart:#15152e;--suave:#c2c2e0;--acento:#ff2e88;--acento2:#00e5ff;--resalte:#ff5a36;--yel:#ffe14d;--win:#fff;--ink:#0b0b1a;--line:#34345f;--sombra:#ff2e88;--glow:0 0 4px rgba(255,46,136,.9),0 0 14px rgba(255,46,136,.6),0 0 28px rgba(255,46,136,.35);--disp:"Dela Gothic One","Arial Black",Impact,sans-serif;--px:"DotGothic16","Courier New",monospace;--sans:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color-scheme:dark}
html.easy{--fondo:#fbf6ea;--tinta:#15131a;--kart:#fff;--suave:#3b3846;--acento:#b0124f;--acento2:#006c80;--resalte:#b8321a;--yel:#ffd21f;--win:#15131a;--ink:#15131a;--line:#d6cdb8;--sombra:#15131a;--glow:none;color-scheme:light}
body{font-family:var(--sans);background:radial-gradient(rgba(255,255,255,.55) 1px,transparent 1.5px) 0 0/56px 56px,radial-gradient(rgba(0,229,255,.35) 1px,transparent 1.5px) 28px 28px/56px 56px,repeating-linear-gradient(transparent 0 3px,rgba(255,255,255,.025) 3px 4px),var(--fondo)}
html.easy body{background:var(--fondo)}
.serit{background:var(--fondo);color:var(--yel);font:400 15px/1.4 var(--px);letter-spacing:.12em;border-bottom:4px solid var(--win);padding:18px 16px}
.serit::before,.serit::after{display:none}
html.easy .serit{color:var(--tinta)}
.serit a{color:inherit;text-decoration:none}
.kap{max-width:620px;padding-top:32px}
.kart{border:3px solid var(--win);border-radius:0;background:var(--kart);box-shadow:6px 6px 0 var(--sombra)}
h1{font-family:var(--disp);font-weight:400;color:#fff;-webkit-text-stroke:6px var(--ink);paint-order:stroke fill;text-shadow:4px 4px 0 var(--ink),var(--glow);letter-spacing:.01em;font-size:clamp(26px,6vw,34px)}
html.easy h1{color:var(--tinta);-webkit-text-stroke:0;text-shadow:3px 3px 0 var(--yel)}
.ante{display:inline-block;font:400 14px/1.4 var(--px);letter-spacing:.08em;color:var(--ink);background:var(--yel);padding:4px 12px;margin:0 0 16px}
html.easy .ante{color:#15131a}
label{font:400 16px/1.4 var(--px);letter-spacing:.06em;color:var(--yel)}
html.easy label{color:var(--acento)}
label.izin{font-family:var(--sans);color:var(--tinta)}
input[type=text],textarea,select{border:3px solid var(--line);border-radius:0;background:var(--fondo)}
select option{background:var(--fondo);color:var(--tinta)}
input:focus,textarea:focus,select:focus{outline:3px solid var(--acento2);border-color:var(--acento2)}
.yildiz button{color:var(--line)}
.yildiz button.on{color:var(--yel);text-shadow:2px 2px 0 var(--ink)}
html.easy .yildiz button.on{color:#e3a400}
.btn{background:var(--yel);color:#0b0b1a;border:3px solid var(--win);border-radius:0;box-shadow:4px 4px 0 var(--sombra);font:400 18px/1 var(--px);letter-spacing:.08em;padding:17px;transition:transform .08s steps(2)}
.btn:hover,.btn:focus-visible{transform:translate(-2px,-2px);box-shadow:6px 6px 0 var(--sombra)}
.uyari{border-radius:0;border:2px solid var(--resalte)}
.tamam a{color:var(--acento2);font-family:var(--px)}
.otra{margin:18px 0 0;font-size:15px;color:var(--suave)}.otra a{color:var(--acento2)}`,
    ante: 'GUEST REVIEW',
    t: {
      titulo: 'How was your day with Mario?',
      baslik: 'Leave a review for Mario | Private English-speaking guide in Japan',
      giris: 'A few sentences are enough. Your review is published on Mario’s reviews page, as written, and helps other travelers plan their trip to Japan.',
      puan: 'Your rating', ad: 'Your name', adOrnek: 'e.g. Sarah and James', ulke: 'City / country', ulkeOrnek: 'e.g. Melbourne, Australia',
      tur: 'Which tour?', turSec: 'Choose (optional)', diger: 'Other',
      yorum: 'Your review', yorumOrnek: 'How did the day go? What did you enjoy most about touring with Mario?',
      izin: 'I agree that my review may be published on the website with my name and city.',
      gonder: 'SEND REVIEW ▶', gonderiliyor: 'Sending…',
      eksik: 'Please give a rating, write your name, a review of at least 20 characters, and tick the consent box.',
      hata: 'It could not be sent. Check your connection and try again.',
      tamam: 'Thank you! Your review is published.', bekle: 'Thank you! Your review has been received and will be published shortly.',
      gor: 'See all reviews of Mario →',
    },
  },
]

// 6-11-2026: Iheb también recibe clientes árabes (Golfo, Magreb) y de habla inglesa:
// mismo diseño que /fr/avis/, en su idioma. Las reseñas van todas a la página de Iheb.
{
  const fr = FORMULARIOS.find((f) => f.guia === 'iheb')
  FORMULARIOS.push(
    { ...fr, ruta: 'ar/tokyo/taqyim', lang: 'ar', dir: 'rtl', serit: 'إيهاب · مرشد عربي في طوكيو',
      ciudades: ['طوكيو', 'جبل فوجي', 'هاكوني', 'يوكوهاما', 'ناغانو', 'شيزوكا'],
      t: {
        titulo: 'كيف كانت جولتكم مع إيهاب؟',
        baslik: 'اكتب رأيك في إيهاب | مرشد عربي في طوكيو',
        giris: 'بضع جمل تكفي. يُنشر رأيكم في صفحة إيهاب ويساعد عائلات عربية أخرى على التخطيط لرحلتها إلى اليابان.',
        puan: 'تقييمكم', ad: 'الاسم', adOrnek: 'مثال: أبو خالد وعائلته', ulke: 'المدينة / البلد', ulkeOrnek: 'مثال: الرياض، السعودية',
        tur: 'أي جولة؟', turSec: 'اختر (اختياري)', diger: 'أخرى',
        yorum: 'رأيكم', yorumOrnek: 'كيف كان اليوم؟ ما الذي أعجبكم أكثر في إيهاب؟',
        izin: 'أوافق على نشر رأيي في الموقع مع اسمي ومدينتي.',
        gonder: 'إرسال الرأي', gonderiliyor: 'جارٍ الإرسال…',
        eksik: 'يرجى اختيار التقييم، وكتابة الاسم، وكتابة رأي من 20 حرفًا على الأقل، والموافقة على النشر.',
        hata: 'تعذّر الإرسال. تحقّقوا من الاتصال بالإنترنت وحاولوا مرة أخرى.',
        tamam: 'شكرًا لكم! تم نشر رأيكم.', bekle: 'شكرًا لكم! وصلنا رأيكم وسيُنشر قريبًا.',
        gor: 'كل الآراء عن إيهاب ←',
      } },
    { ...fr, ruta: 'en/tokyo-anime-guide/review', lang: 'en', serit: 'Iheb · Tokyo private guide',
      ciudades: ['Tokyo', 'Anime & Pokémon day', 'Mt. Fuji', 'Hakone', 'Yokohama', 'Nagano', 'Shizuoka'],
      t: {
        titulo: 'How was your day with Iheb?',
        baslik: 'Leave a review for Iheb | Tokyo private guide',
        giris: 'A few sentences are enough. Your review is published on Iheb’s page and helps other travelers plan their trip to Japan.',
        puan: 'Your rating', ad: 'Your first name', adOrnek: 'e.g. Sarah and Adam', ulke: 'City / country', ulkeOrnek: 'e.g. Toronto, Canada',
        tur: 'Which tour?', turSec: 'Choose (optional)', diger: 'Other',
        yorum: 'Your review', yorumOrnek: 'How was the day? What did you like most about Iheb?',
        izin: 'I agree that my review may be published on the website with my first name and city.',
        gonder: 'Send review', gonderiliyor: 'Sending…',
        eksik: 'Please give a rating, enter your first name, write at least 20 characters and tick the consent box.',
        hata: 'Could not send. Check your connection and try again.',
        tamam: 'Thank you! Your review is published.', bekle: 'Thank you! Your review was received and will be published soon.',
        gor: 'See all reviews of Iheb →',
      } },
  )
}

// 6-11-2026: los tres formularios de Iheb llevan su selector de idioma (fr · ar · en).
for (const f of FORMULARIOS) if (f.guia === 'iheb') f.idiomas = ihebIdiomas(`/${f.ruta}/`, f.lang)
// Colores del formulario (no los del estilo anime), también en modo oscuro.
const IDIOMAS_FORM_CSS = `${IHEB_IDIOMAS_CSS}
.idiomas{justify-content:center;padding:12px 16px 0}
.idiomas a,.idiomas span{color:var(--tinta);background:var(--kart);border-color:var(--acento)}
.idiomas [aria-current]{background:var(--acento);color:#fff;box-shadow:none}`

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function html(f) {
  const { t, tema: c } = f
  return `<!doctype html>
<html lang="${f.lang}"${f.dir ? ` dir="${f.dir}"` : ''} data-estatica="formulario">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(t.baslik)}</title>
<meta name="robots" content="noindex, follow">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
${equipoFuente}${f.cabeza ? '\n' + f.cabeza : ''}
<style>${equipoCSS}
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
.gizli{position:absolute;inset-inline-start:0;width:1px!important;height:1px!important;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0;padding:0;opacity:0}${f.css ? '\n' + f.css : ''}${f.idiomas ? IDIOMAS_FORM_CSS : ''}
</style>
</head>
<body>
<div class="serit">${f.inicio ? `<a href="${f.inicio}">${esc(f.serit)}</a>` : esc(f.serit)}</div>
${f.idiomas ?? ''}<main class="kap">
<div class="kart">
<form id="form" novalidate>
${f.ante ? `<p class="ante">${esc(f.ante)}</p>\n` : ''}<h1>${esc(t.titulo)}</h1>
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
${equipoHTML({ lang: f.lang, actual: f.guia, variante: f.variante ?? null })}
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
