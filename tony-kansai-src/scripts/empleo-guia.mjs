#!/usr/bin/env node
// Oferta de trabajo: guía musulmana, mujer y freelance en Japón (21-11-2026).
// Genera tres páginas estáticas (data-estatica: rutas-estaticas.mjs no las pisa):
//   /en/careers/muslim-female-guide/   (con un bloque en indonesio/malayo)
//   /es/empleo/guia-musulmana/
//   /ar/wazaif/murshida-muslima/
// Cada una lleva JobPosting en JSON-LD para que salga en Google Empleos.
// No se publica tarifa: la pone ella. Ejecutar: node scripts/empleo-guia.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { cabeceraEsHTML, cabeceraEsCSS } from './cabecera-es.mjs'
import { pieEsHTML, pieEsCSS } from './pie-es.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://tonykansaiguide.com'
const WA = '34634193106'
const MAIL = 'tony@tonykansaiguide.com'
const PUBLICADO = '2026-11-21'
const CADUCA = '2027-03-31T23:59:00+09:00'

const RUTAS = { en: '/en/careers/muslim-female-guide/', es: '/es/empleo/guia-musulmana/', ar: '/ar/wazaif/murshida-muslima/' }
const NOMBRE_IDIOMA = { en: 'English', es: 'Español', ar: 'العربية' }

const T = {
  en: {
    title: 'Freelance Muslim female tour guide in Japan (Osaka, Kyoto, Nara) | Tony Kansai Guide',
    desc: 'Hiring: Muslim women living in Japan to guide Muslim women and families on private tours in Osaka, Kyoto, Nara and Kobe. Freelance, flexible days, you set your rate.',
    jobTitle: 'Freelance Muslim Female Tour Guide (Osaka / Kyoto)',
    kicker: 'Freelance · Kansai, Japan',
    h1: 'We are looking for Muslim women guides in Japan',
    sub: 'Muslim women and families visiting Osaka, Kyoto and Nara often ask us for a female guide who understands prayer times, halal food and modesty. If you live in Japan, guide with us.',
    wa: 'Apply on WhatsApp', mail: 'Apply by email',
    trabajoH: 'The work',
    trabajo: [
      'Private day tours for Muslim women, families and small groups in Osaka, Kyoto, Nara and Kobe.',
      'Freelance: you choose the days you can work. No minimum.',
      'Paid per tour day. Tell us your usual rate; we agree it before each tour.',
      'For every tour you get the route, timings, halal restaurants and prayer spots.',
    ],
    perfilH: 'Who we are looking for',
    perfil: [
      'A Muslim woman who lives in Japan. Kansai is ideal; Tokyo is also welcome.',
      'You speak English, Arabic, Malay/Indonesian, Turkish, French or Spanish. Japanese is a plus.',
      'You know your city, you enjoy people and you are on time.',
      'Your residence status allows this kind of work in Japan.',
      'A guide licence (通訳案内士) is welcome but not required: since 2018 anyone may guide for pay in Japan.',
    ],
    pasosH: 'How to apply',
    pasos: [
      ['Send a message', 'Your name, city, languages, the days you are usually free, any guiding experience and, if you like, your daily rate.'],
      ['Short call', 'We meet by video or voice call, 15 minutes, to get to know each other.'],
      ['First tour', 'We match you with the next tour that fits your days and send you the full plan.'],
    ],
    privacidad: 'We do not publish your details. They are only used to contact you about tours.',
    enlaces: 'What our guests book: <a href="/en/muslim-female-guide-japan/">private tours with a Muslim female guide</a>, planned around <a href="/en/mosques-kansai/">mosques and prayer rooms in Kansai</a> and <a href="/en/halal-kyoto-osaka/">halal food in Kyoto and Osaka</a>. Many families also add <a href="/en/kobe-private-guide-one-day/">a day in Kobe</a> or <a href="/en/nara-day-trip-from-osaka/">a Nara day trip</a>.',
    compartirH: 'Know someone?',
    compartir: 'Share this page with a sister, a friend or your community group.',
    copiar: 'Copy link', copiado: 'Link copied', waCompartir: 'Share on WhatsApp',
    waTexto: 'Assalamu alaikum Tony, I would like to apply as a freelance guide.\nName:\nCity:\nLanguages:\nAvailability:',
    waShare: 'Freelance job for Muslim women guides in Japan (Osaka, Kyoto, Nara):',
    asunto: 'Freelance guide application',
    credito: 'Photo: Kobe Mosque, Zairon, CC BY-SA 4.0',
    pie: 'Tony Kansai Guide · Private guide in Osaka, Japan',
  },
  es: {
    title: 'Guía turística musulmana freelance en Japón (Osaka, Kioto, Nara) | Tony Kansai Guide',
    desc: 'Buscamos mujeres musulmanas que vivan en Japón para guiar a mujeres y familias musulmanas en tours privados por Osaka, Kioto, Nara y Kobe. Freelance, días flexibles, tú pones tu tarifa.',
    jobTitle: 'Guía turística musulmana freelance (Osaka / Kioto)',
    kicker: 'Freelance · Kansai, Japón',
    h1: 'Buscamos guías musulmanas en Japón',
    sub: 'Las mujeres y familias musulmanas que visitan Osaka, Kioto y Nara nos piden a menudo una guía mujer que entienda los horarios de oración, la comida halal y el recato. Si vives en Japón, guía con nosotros.',
    wa: 'Apúntate por WhatsApp', mail: 'Apúntate por correo',
    trabajoH: 'El trabajo',
    trabajo: [
      'Tours privados de un día para mujeres, familias y grupos pequeños musulmanes en Osaka, Kioto, Nara y Kobe.',
      'Freelance: eliges los días que puedes trabajar. Sin mínimo.',
      'Se paga por día de tour. Dinos tu tarifa habitual; la acordamos antes de cada tour.',
      'Para cada tour recibes la ruta, los horarios, los restaurantes halal y los sitios para rezar.',
    ],
    perfilH: 'A quién buscamos',
    perfil: [
      'Una mujer musulmana que viva en Japón. Lo ideal es Kansai; Tokio también vale.',
      'Hablas inglés, árabe, malayo/indonesio, turco, francés o español. El japonés suma.',
      'Conoces tu ciudad, te gusta la gente y eres puntual.',
      'Tu estatus de residencia te permite hacer este trabajo en Japón.',
      'La licencia de guía (通訳案内士) se valora, pero no hace falta: desde 2018 cualquiera puede guiar cobrando en Japón.',
    ],
    pasosH: 'Cómo apuntarte',
    pasos: [
      ['Mándanos un mensaje', 'Tu nombre, ciudad, idiomas, los días que sueles tener libres, tu experiencia como guía si la tienes y, si quieres, tu tarifa por día.'],
      ['Llamada corta', 'Hablamos por vídeo o por voz, 15 minutos, para conocernos.'],
      ['Primer tour', 'Te asignamos el siguiente tour que encaje con tus días y te mandamos el plan completo.'],
    ],
    privacidad: 'No publicamos tus datos. Solo se usan para contactarte sobre tours.',
    enlaces: 'Lo que reservan nuestras clientas: <a href="/es/guia-musulmana-japon/">tours privados con guía musulmana</a> en <a href="/es/osaka/">Osaka</a>, <a href="/es/kyoto/">Kioto</a>, <a href="/es/nara/">Nara</a> y <a href="/es/kobe/">Kobe</a>. Tony, que coordina el equipo, es <a href="/es/guia-espanol-arabe-japon/">guía en español y árabe en Japón</a>.',
    compartirH: '¿Conoces a alguien?',
    compartir: 'Comparte esta página con una hermana, una amiga o tu grupo de la comunidad.',
    copiar: 'Copiar enlace', copiado: 'Enlace copiado', waCompartir: 'Compartir por WhatsApp',
    waTexto: 'Assalamu alaikum Tony, quiero apuntarme como guía freelance.\nNombre:\nCiudad:\nIdiomas:\nDisponibilidad:',
    waShare: 'Trabajo freelance para guías musulmanas en Japón (Osaka, Kioto, Nara):',
    asunto: 'Candidatura guía freelance',
    credito: 'Foto: Mezquita de Kobe, Zairon, CC BY-SA 4.0',
    pie: 'Tony Kansai Guide · Guía privado en Osaka, Japón',
  },
  ar: {
    title: 'نبحث عن مرشدات سياحيات مسلمات في اليابان (أوساكا، كيوتو، نارا) | Tony Kansai Guide',
    desc: 'فرصة عمل حر: نبحث عن نساء مسلمات مقيمات في اليابان لإرشاد النساء والعائلات المسلمة في جولات خاصة في أوساكا وكيوتو ونارا وكوبي. أيام مرنة، وأنتِ تحددين أجرك.',
    jobTitle: 'مرشدة سياحية مسلمة (عمل حر) في أوساكا وكيوتو',
    kicker: 'عمل حر · كانساي، اليابان',
    h1: 'نبحث عن مرشدات سياحيات مسلمات في اليابان',
    sub: 'كثيرًا ما تطلب منا النساء والعائلات المسلمة الزائرة لأوساكا وكيوتو ونارا مرشدةً تفهم أوقات الصلاة والطعام الحلال والحشمة. إن كنتِ تقيمين في اليابان، فانضمي إلينا.',
    wa: 'قدّمي عبر واتساب', mail: 'قدّمي عبر البريد',
    trabajoH: 'طبيعة العمل',
    trabajo: [
      'جولات خاصة ليوم واحد للنساء والعائلات والمجموعات الصغيرة المسلمة في أوساكا وكيوتو ونارا وكوبي.',
      'عمل حر: تختارين الأيام التي تناسبك، دون حد أدنى.',
      'الأجر عن كل يوم جولة. أخبرينا بأجرك المعتاد ونتفق عليه قبل كل جولة.',
      'لكل جولة تصلك الخطة كاملة: المسار والمواعيد والمطاعم الحلال وأماكن الصلاة.',
    ],
    perfilH: 'من نبحث عنها',
    perfil: [
      'امرأة مسلمة مقيمة في اليابان، ويُفضَّل في منطقة كانساي، ونرحب أيضًا بالمقيمات في طوكيو.',
      'تتحدثين العربية أو الإنجليزية أو الماليزية/الإندونيسية أو التركية أو الفرنسية أو الإسبانية، واليابانية ميزة إضافية.',
      'تعرفين مدينتك جيدًا، وتحبين التعامل مع الناس، وتلتزمين بالمواعيد.',
      'وضع إقامتك يسمح لك بهذا النوع من العمل في اليابان.',
      'رخصة الإرشاد (通訳案内士) ميزة لكنها ليست شرطًا: منذ عام 2018 يحق لأي شخص العمل مرشدًا بأجر في اليابان.',
    ],
    pasosH: 'كيف تتقدمين',
    pasos: [
      ['أرسلي رسالة', 'اسمك ومدينتك واللغات التي تتحدثينها والأيام التي تكونين فيها متفرغة، وخبرتك في الإرشاد إن وُجدت، وأجرك اليومي إن أحببتِ.'],
      ['مكالمة قصيرة', 'نتعارف في مكالمة صوتية أو مرئية مدتها 15 دقيقة.'],
      ['أول جولة', 'نرشّحك لأقرب جولة تناسب أيامك ونرسل لك الخطة كاملة.'],
    ],
    privacidad: 'لا ننشر بياناتك، ونستخدمها فقط للتواصل معك بخصوص الجولات.',
    enlaces: 'ما تحجزه ضيفاتنا: <a href="/ar/murshida-muslima-yaban/">جولات خاصة مع مرشدة مسلمة</a>، مخطّطة حول <a href="/ar/mosques-kansai/">المساجد والمصليات في كانساي</a> و<a href="/ar/halal-kyoto-osaka/">الطعام الحلال في كيوتو وأوساكا</a>، ومنها <a href="/ar/hiroshima-miyajima-day-trip/">رحلة يوم إلى هيروشيما وميياجيما</a>.',
    compartirH: 'تعرفين أحدًا؟',
    compartir: 'شاركي هذه الصفحة مع أخت أو صديقة أو مجموعة جاليتك.',
    copiar: 'نسخ الرابط', copiado: 'تم نسخ الرابط', waCompartir: 'مشاركة عبر واتساب',
    waTexto: 'السلام عليكم توني، أرغب في التقدم للعمل مرشدةً.\nالاسم:\nالمدينة:\nاللغات:\nالأيام المتاحة:',
    waShare: 'فرصة عمل حر لمرشدات سياحيات مسلمات في اليابان (أوساكا، كيوتو، نارا):',
    asunto: 'طلب عمل مرشدة سياحية',
    credito: 'الصورة: مسجد كوبي، Zairon، CC BY-SA 4.0',
    pie: 'Tony Kansai Guide · مرشد خاص في أوساكا، اليابان',
  },
}

// Bloque corto para la comunidad indonesia y malaya de Kansai (solo en la página inglesa).
const BAHASA = {
  h: 'Bahasa Indonesia / Melayu',
  p: 'Kami mencari pemandu wisata Muslimah yang tinggal di Jepang (freelance) untuk memandu perempuan dan keluarga Muslim di Osaka, Kyoto, Nara dan Kobe. Hari kerja fleksibel, Anda yang menentukan tarif. Lisensi pemandu tidak wajib.',
  wa: 'Daftar lewat WhatsApp',
  waTexto: 'Assalamualaikum Tony, saya ingin mendaftar sebagai pemandu freelance.\nNama:\nKota:\nBahasa:\nHari yang tersedia:',
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const waLink = (texto) => `https://wa.me/${WA}?text=${encodeURIComponent(texto)}`

function jobPosting(lang, t) {
  const lugar = (ciudad) => ({ '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: ciudad, addressRegion: ciudad === 'Kyoto' ? 'Kyoto' : 'Osaka', addressCountry: 'JP' } })
  const html = `<p>${esc(t.sub)}</p><h3>${esc(t.trabajoH)}</h3><ul>${t.trabajo.map((x) => `<li>${esc(x)}</li>`).join('')}</ul><h3>${esc(t.perfilH)}</h3><ul>${t.perfil.map((x) => `<li>${esc(x)}</li>`).join('')}</ul><h3>${esc(t.pasosH)}</h3><ol>${t.pasos.map(([a, b]) => `<li>${esc(a)}: ${esc(b)}</li>`).join('')}</ol>`
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: t.jobTitle,
    description: html,
    inLanguage: lang,
    datePosted: PUBLICADO,
    validThrough: CADUCA,
    employmentType: ['CONTRACTOR', 'PART_TIME'],
    hiringOrganization: { '@type': 'Organization', name: 'Tony Kansai Guide', sameAs: `${BASE}/`, logo: `${BASE}/firma/sp/mini/tkg-v4.png` },
    jobLocation: [lugar('Osaka'), lugar('Kyoto')],
    directApply: false,
    url: BASE + RUTAS[lang],
  }
}

// 24-11-2026: la paleta «sakura empolvado» solo va en español; EN/AR siguen con la hoja de siempre.
const CSS_ES = `:root{--fg:#1e2a36;--suave:#515b67;--fondo:#fdeff2;--verde:#2d684c;--bermellon:#2d684c;--linea:#eccdd5;--rosa:#8e3b55}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--fondo);color:var(--fg);font:18px/1.7 'Source Sans 3',system-ui,sans-serif}
[dir=rtl] body,[lang=ar] body{font-family:Tajawal,system-ui,sans-serif}
h1,h2{font-family:Fraunces,Georgia,serif;font-weight:700;line-height:1.15;letter-spacing:-.01em}
[dir=rtl] h1,[dir=rtl] h2{font-family:Tajawal,system-ui,sans-serif;font-weight:800;letter-spacing:0}
a{color:var(--verde)}
.kap{max-width:1040px;margin:0 auto;padding:0 20px}
header{position:absolute;inset:0 0 auto;z-index:2}
header .kap{display:flex;justify-content:space-between;align-items:center;gap:12px;padding-block:16px;flex-wrap:wrap}
header a,header b{color:#fff;text-decoration:none;font-weight:700}
.idiomas{display:flex;gap:8px;font-size:15px;color:rgba(255,255,255,.75)}.idiomas a{font-weight:600;color:rgba(255,255,255,.85)}
.heroe{position:relative;min-height:min(88vh,860px);display:flex;align-items:flex-end;color:#fff;background:#0c2724;overflow:hidden}
.heroe img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55}
.heroe::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(12,39,36,.35),rgba(12,39,36,.92))}
.heroe .kap{position:relative;z-index:1;padding-block:140px 72px;width:100%}
.kicker{display:inline-block;font-size:14px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#f3c9a8}
[dir=rtl] .kicker{letter-spacing:0}
.heroe h1{font-size:clamp(36px,6.4vw,68px);margin:12px 0 18px;max-width:14em}
.heroe p{font-size:clamp(18px,2.2vw,22px);max-width:36em;color:rgba(255,255,255,.92);margin:0 0 30px}
.btns{display:flex;gap:12px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:0 24px;border-radius:999px;font-weight:700;text-decoration:none;border:2px solid transparent;font-size:17px;cursor:pointer;font-family:inherit}
.btn.wa{background:var(--bermellon);color:#fff}.btn.wa:hover{background:#23513c}
.btn.borde{border-color:currentColor;color:inherit;background:transparent}
.heroe .btn.borde{color:#fff}
.credito{position:absolute;z-index:1;inset-inline-end:12px;bottom:8px;font-size:12px;color:rgba(255,255,255,.65)}
.bloque{padding-block:64px 8px}
.bloque h2{font-size:clamp(28px,3.6vw,40px);margin:0 0 22px;color:var(--fg)}
.dos{display:grid;grid-template-columns:1fr 1fr;gap:56px}
ul.lista{list-style:none;margin:0;padding:0}
ul.lista li{position:relative;padding-inline-start:30px;margin-bottom:14px}
ul.lista li::before{content:"";position:absolute;inset-inline-start:0;top:.62em;width:12px;height:2px;background:var(--rosa)}
ol.pasos{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:28px;counter-reset:paso}
ol.pasos li{counter-increment:paso;border-top:2px solid var(--rosa);padding-top:16px}
ol.pasos li::before{content:counter(paso,decimal-leading-zero);display:block;font-family:Fraunces,Georgia,serif;font-size:34px;color:var(--rosa);line-height:1;margin-bottom:10px}
ol.pasos b{display:block;font-size:19px;margin-bottom:4px}
ol.pasos p{margin:0;color:var(--suave)}
.nota{color:var(--suave);font-size:16px;margin-top:28px}
.final{margin-top:72px;background:#ffffff;color:var(--fg);padding-block:64px}
.final h2{color:var(--fg)}.final p{color:var(--suave);max-width:34em}
.final .btn.borde{color:var(--fg)}
footer{padding-block:28px;font-size:15px;color:var(--suave)}
footer a{color:var(--suave)}
.rev{opacity:0;transform:translateY(18px);transition:opacity .7s ease,transform .7s ease}.rev.vis{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.rev{opacity:1;transform:none;transition:none}}
@media (max-width:760px){body{font-size:17px}.dos{grid-template-columns:1fr;gap:8px}ol.pasos{grid-template-columns:1fr}.btn{width:100%}.heroe .kap{padding-block:120px 56px}.bloque{padding-block:48px 0}}`
const CSS = `:root{--fg:#1d2422;--suave:#56605d;--fondo:#f6f1e8;--verde:#123f3a;--bermellon:#c4472f;--linea:#e2d9c8}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--fondo);color:var(--fg);font:18px/1.7 'Source Sans 3',system-ui,sans-serif}
[dir=rtl] body,[lang=ar] body{font-family:Tajawal,system-ui,sans-serif}
h1,h2{font-family:Fraunces,Georgia,serif;font-weight:700;line-height:1.15;letter-spacing:-.01em}
[dir=rtl] h1,[dir=rtl] h2{font-family:Tajawal,system-ui,sans-serif;font-weight:800;letter-spacing:0}
a{color:var(--verde)}
.kap{max-width:1040px;margin:0 auto;padding:0 20px}
header{position:absolute;inset:0 0 auto;z-index:2}
header .kap{display:flex;justify-content:space-between;align-items:center;gap:12px;padding-block:16px;flex-wrap:wrap}
header a,header b{color:#fff;text-decoration:none;font-weight:700}
.idiomas{display:flex;gap:8px;font-size:15px;color:rgba(255,255,255,.75)}.idiomas a{font-weight:600;color:rgba(255,255,255,.85)}
.heroe{position:relative;min-height:min(88vh,860px);display:flex;align-items:flex-end;color:#fff;background:#0c2724;overflow:hidden}
.heroe img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55}
.heroe::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(12,39,36,.35),rgba(12,39,36,.92))}
.heroe .kap{position:relative;z-index:1;padding-block:140px 72px;width:100%}
.kicker{display:inline-block;font-size:14px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#f3c9a8}
[dir=rtl] .kicker{letter-spacing:0}
.heroe h1{font-size:clamp(36px,6.4vw,68px);margin:12px 0 18px;max-width:14em}
.heroe p{font-size:clamp(18px,2.2vw,22px);max-width:36em;color:rgba(255,255,255,.92);margin:0 0 30px}
.btns{display:flex;gap:12px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:0 24px;border-radius:999px;font-weight:700;text-decoration:none;border:2px solid transparent;font-size:17px;cursor:pointer;font-family:inherit}
.btn.wa{background:var(--bermellon);color:#fff}.btn.wa:hover{background:#a93a25}
.btn.borde{border-color:currentColor;color:inherit;background:transparent}
.heroe .btn.borde{color:#fff}
.credito{position:absolute;z-index:1;inset-inline-end:12px;bottom:8px;font-size:12px;color:rgba(255,255,255,.65)}
.bloque{padding-block:64px 8px}
.bloque h2{font-size:clamp(28px,3.6vw,40px);margin:0 0 22px;color:var(--verde)}
.dos{display:grid;grid-template-columns:1fr 1fr;gap:56px}
ul.lista{list-style:none;margin:0;padding:0}
ul.lista li{position:relative;padding-inline-start:30px;margin-bottom:14px}
ul.lista li::before{content:"";position:absolute;inset-inline-start:0;top:.62em;width:12px;height:2px;background:var(--bermellon)}
ol.pasos{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:28px;counter-reset:paso}
ol.pasos li{counter-increment:paso;border-top:2px solid var(--verde);padding-top:16px}
ol.pasos li::before{content:counter(paso,decimal-leading-zero);display:block;font-family:Fraunces,Georgia,serif;font-size:34px;color:var(--bermellon);line-height:1;margin-bottom:10px}
ol.pasos b{display:block;font-size:19px;margin-bottom:4px}
ol.pasos p{margin:0;color:var(--suave)}
.nota{color:var(--suave);font-size:16px;margin-top:28px}
.final{margin-top:72px;background:var(--verde);color:#fff;padding-block:64px}
.final h2{color:#fff}.final p{color:rgba(255,255,255,.88);max-width:34em}
.final .btn.borde{color:#fff}
footer{padding-block:28px;font-size:15px;color:var(--suave)}
footer a{color:var(--suave)}
.rev{opacity:0;transform:translateY(18px);transition:opacity .7s ease,transform .7s ease}.rev.vis{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.rev{opacity:1;transform:none;transition:none}}
@media (max-width:760px){body{font-size:17px}.dos{grid-template-columns:1fr;gap:8px}ol.pasos{grid-template-columns:1fr}.btn{width:100%}.heroe .kap{padding-block:120px 56px}.bloque{padding-block:48px 0}}`

function pagina(lang) {
  const t = T[lang]
  const rtl = lang === 'ar'
  const url = BASE + RUTAS[lang]
  const alternos = Object.entries(RUTAS).map(([l, r]) => `<link rel="alternate" hreflang="${l}" href="${BASE + r}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${BASE + RUTAS.en}">`
  const idiomas = Object.entries(RUTAS).map(([l, r]) => l === lang ? `<b>${NOMBRE_IDIOMA[l]}</b>` : `<a href="${r}" hreflang="${l}" lang="${l}">${NOMBRE_IDIOMA[l]}</a>`).join('<span aria-hidden="true">·</span>')
  const mailto = `mailto:${MAIL}?subject=${encodeURIComponent(t.asunto)}&body=${encodeURIComponent(t.waTexto)}`
  const bahasa = lang === 'en' ? `
<section class="kap bloque rev" lang="id">
  <h2>${BAHASA.h}</h2>
  <p>${BAHASA.p}</p>
  <a class="btn wa" href="${waLink(BAHASA.waTexto)}" target="_blank" rel="noopener">${BAHASA.wa}</a>
</section>` : ''
  return `<!doctype html>
<html lang="${lang}"${rtl ? ' dir="rtl"' : ''} data-estatica="empleo">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}">
${alternos}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Tony Kansai Guide">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(t.h1)}">
<meta property="og:description" content="${esc(t.desc)}">
<meta property="og:image" content="${BASE}/tr/foto/kobe-camii-1920.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="${lang === 'es' ? '#fdeff2' : '#123f3a'}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(jobPosting(lang, t))}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Source+Sans+3:wght@400;600;700&family=Tajawal:wght@400;500;800&display=swap">
<style>
${lang === 'es' ? CSS_ES + cabeceraEsCSS + pieEsCSS : CSS}
</style>
</head>
<body>
${lang === 'es' ? cabeceraEsHTML({ actual: RUTAS.es, idiomas: ['en', 'ar'].map((l) => ({ lang: l, ruta: RUTAS[l], texto: l === 'ar' ? 'العربية' : 'English' })) }) : `<header><div class="kap"><a href="/${lang}/">Tony Kansai Guide</a><nav class="idiomas" aria-label="Language">${idiomas}</nav></div></header>`}
<main>
<section class="heroe">
  <img src="/tr/foto/kobe-camii-1920.webp" srcset="/tr/foto/kobe-camii-1080.webp 1080w, /tr/foto/kobe-camii-1920.webp 1920w, /tr/foto/kobe-camii-3840.webp 3840w" sizes="100vw" alt="" fetchpriority="high">
  <div class="kap">
    <span class="kicker">${t.kicker}</span>
    <h1>${t.h1}</h1>
    <p>${t.sub}</p>
    <div class="btns">
      <a class="btn wa" href="${waLink(t.waTexto)}" target="_blank" rel="noopener">${t.wa}</a>
      <a class="btn borde" href="${esc(mailto)}">${t.mail}</a>
    </div>
  </div>
  <a class="credito" href="https://commons.wikimedia.org/wiki/File:Kobe_Kobe-Moschee_Innen_Gebetsraum_2.jpg" rel="noopener" target="_blank">${t.credito}</a>
</section>
<section class="kap bloque dos">
  <div class="rev"><h2>${t.trabajoH}</h2><ul class="lista">${t.trabajo.map((x) => `<li>${x}</li>`).join('')}</ul><p class="nota">${t.enlaces}</p></div>
  <div class="rev"><h2>${t.perfilH}</h2><ul class="lista">${t.perfil.map((x) => `<li>${x}</li>`).join('')}</ul></div>
</section>
<section class="kap bloque rev">
  <h2>${t.pasosH}</h2>
  <ol class="pasos">${t.pasos.map(([a, b]) => `<li><b>${a}</b><p>${b}</p></li>`).join('')}</ol>
  <p class="nota">${t.privacidad}</p>
</section>${bahasa}
<section class="final">
  <div class="kap rev">
    <h2>${t.compartirH}</h2>
    <p>${t.compartir}</p>
    <div class="btns">
      <a class="btn wa" href="https://wa.me/?text=${encodeURIComponent(t.waShare + ' ' + url)}" target="_blank" rel="noopener">${t.waCompartir}</a>
      <button class="btn borde" type="button" id="copiar" data-ok="${esc(t.copiado)}">${t.copiar}</button>
    </div>
  </div>
</section>
</main>
${lang === 'es' ? pieEsHTML({ idiomas: ['en', 'ar'].map((l) => ({ lang: l, ruta: RUTAS[l], texto: l === 'ar' ? 'العربية' : 'English' })), extra: esc(t.pie) }) : `<footer><div class="kap">${t.pie} · <a href="mailto:${MAIL}">${MAIL}</a></div></footer>`}
<script>
document.getElementById('copiar').addEventListener('click',function(e){var b=e.currentTarget;navigator.clipboard&&navigator.clipboard.writeText(${JSON.stringify(url)}).then(function(){b.textContent=b.dataset.ok})});
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('vis');io.unobserve(x.target)}})},{threshold:.15});document.querySelectorAll('.rev').forEach(function(el){io.observe(el)})}else{document.querySelectorAll('.rev').forEach(function(el){el.classList.add('vis')})}
</script>
${lang === 'es' ? '<script src="/caida.js" defer></script>\n' : ''}</body>
</html>
`
}

for (const lang of Object.keys(RUTAS)) {
  const dir = join(root, 'public', RUTAS[lang])
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), pagina(lang))
  console.log('ok', RUTAS[lang])
}
