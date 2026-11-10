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
const RUTA = { es: '/es/calculadora-guia/', en: '/en/private-guide-calculator/' }

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
    ],
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
    ],
    inicio: 'Tony Kansai Guide',
  },
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const CSS = `:root{--f:#fbfaf7;--t:#17151a;--g:#5d5a63;--b:#e4e0d8;--c:#ffffff;--a:#c8402c;--ok:#1d7a4f}
@media (prefers-color-scheme:dark){:root{--f:#111014;--t:#f2f0ee;--g:#a9a5ad;--b:#2a2830;--c:#1a191e;--a:#ff6a52;--ok:#3cc488}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}body{margin:0;background:var(--f);color:var(--t);font:16px/1.55 Inter,system-ui,-apple-system,"Segoe UI",sans-serif}
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
.btn:active{transform:scale(.97)}.sec{margin-left:12px;color:var(--g)}
.faq details{border-top:1px solid var(--b);padding:14px 0}.faq summary{font-weight:600;cursor:pointer}.faq p{color:var(--g);margin:8px 0 0}
footer{padding:30px 0 50px;color:var(--g);font-size:14px}`

function pagina(lang) {
  const t = T[lang]
  const otra = lang === 'es' ? 'en' : 'es'
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
<html lang="${lang}" data-estatica="calculadora">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<link rel="canonical" href="${BASE}${RUTA[lang]}">
<link rel="alternate" hreflang="${lang}" href="${BASE}${RUTA[lang]}"><link rel="alternate" hreflang="${otra}" href="${BASE}${RUTA[otra]}"><link rel="alternate" hreflang="x-default" href="${BASE}${RUTA.en}">
<meta property="og:title" content="${esc(t.title)}"><meta property="og:description" content="${esc(t.desc)}"><meta property="og:url" content="${BASE}${RUTA[lang]}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<style>${CSS}</style>
</head>
<body>
<header><div class="w"><a href="/${lang}/">${esc(t.inicio)}</a> · <a href="${RUTA[otra]}" hreflang="${otra}" lang="${otra}">${otra.toUpperCase()}</a></div></header>
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
<a class="sec" id="r-solo" href="/${lang === 'es' ? 'es/ventajas' : 'en/perks'}/" hidden>${esc(t.gratis)} →</a>
</section>
<section class="faq"><p class="eti">${esc(t.faq_t)}</p>${t.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section>
</main>
<footer class="w"><a href="/${lang}/">${esc(t.inicio)}</a> · <a href="https://www.instagram.com/tonykansaiguide/">Instagram</a> · tony@tonykansaiguide.com</footer>
<script>
(function(){
var T=${JSON.stringify({ medio: t.medio, dia: t.dia, solo: t.solo, porque: t.porque, per: t.per, grupo: t.grupo, grande: t.grande, msg: t.msg, labels: t.labels, d: t.d, who: t.who, want: t.want })};
var P=${JSON.stringify(PRECIO)},WA="${WA}",lang="${lang}";
var f=document.getElementById('calc'),pers=document.getElementById('pers'),n=2;
var yen=function(v){return '¥'+Math.round(v).toLocaleString(lang==='es'?'es-ES':'en-US')};
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
