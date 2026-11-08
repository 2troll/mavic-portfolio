#!/usr/bin/env node
// Genera public/ru/filipp/index.html: página de Филипп (Philips), hermano de
// Larion y guía en ruso. 8-11-2026, Tony: «estilo rockero, de música, que es
// lo que le gusta a él; para rusos mayores que pagan bien. Haz lo mejor que puedas».
//
//   node scripts/filipp.mjs
//
// HTML estático como kndr.mjs / russkij.mjs (las IAs no ejecutan JavaScript);
// rutas-estaticas.mjs no la pisa (data-estatica en <html>).
//
// Lo que consta de Filipp (no inventar más): hermano de Larion, ruso, guía en
// ruso, le encanta el rock. Sin foto, sin reseñas propias, sin precio fijo.
// Zonas: las de Larion en Kansai (supuesto del 8-11, a confirmar con Tony).
// Contacto: aún no ha dado Telegram ni WhatsApp → coordina Tony (@LUiGi19).
// Cuando lleguen, cambiar TG_USUARIO (y WA si hace falta) y el contacto de
// GUIAS_PLAN.filipp en src/v7/datosPlanes.ts y de equipo.json.
//
// Datos de rock usados (comprobables): Deep Purple grabó «Made in Japan» en
// agosto de 1972 en el Festival Hall de Osaka y en el Budokan de Tokio; Queen
// grabó «Teo Torriatte» con estribillo en japonés (1976) y Freddie Mercury
// coleccionaba arte japonés; los vinilos japoneses con «obi» son buscados por
// coleccionistas; Yamaha, Ibanez y ESP son marcas japonesas. Nada de alcohol.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { equipoHTML, equipoCSS } from './equipo-estatico.mjs'
import { navHTML, pieHTML, menuCSS } from './menu-estatico.mjs'
import { planesBloque, planesCSS } from './planes-estatico.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://tonykansaiguide.com'
const RUTA = '/ru/filipp/'
const URL_PAG = `${BASE}${RUTA}`
const HOY = '2026-11-08'
const TG_USUARIO = 'LUiGi19'
const TG_URL = `https://t.me/${TG_USUARIO}`
const TG_VISIBLE = `@${TG_USUARIO}`
const TG_NOTA = 'Отвечает координатор Тони и сразу передаёт Филиппу'
const TG_ICONO = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M21.4 3.6 2.9 10.7c-1 .4-1 1.7 0 2l4.6 1.5 1.8 5.6c.3.8 1.3 1 1.9.4l2.6-2.5 4.8 3.5c.7.5 1.7.1 1.9-.7l3.1-15c.2-1-.8-1.8-1.7-1.4ZM9.6 14.3l-.5 3.3-1.2-3.9 9.6-6.2-7.9 6.8Z"/></svg>'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// --- Fotos ya licenciadas (Wikimedia Commons) de /tr/ y /private/ ---
const FOTOS = {}
for (const [archivo, dir] of [['turkce-fotolar.json', '/tr/foto'], ['private-photos.json', '/private/foto']]) {
  for (const [k, v] of Object.entries(JSON.parse(readFileSync(join(root, 'scripts', archivo), 'utf8')))) FOTOS[k] ??= { ...v, dir: v.dir ?? dir }
}
const foto = (k) => { if (!FOTOS[k]) throw new Error(`filipp: falta la foto ${k}`); return FOTOS[k] }
const ancho = (k, max) => foto(k).anchos.filter((w) => w <= max).sort((a, b) => b - a)[0] ?? Math.min(...foto(k).anchos)
const srcset = (k) => foto(k).anchos.map((w) => `${foto(k).dir}/${k}-${w}.webp ${Math.min(w, foto(k).w)}w`).join(', ')
const img = (k, alt, { sizes = '100vw', max = 1080, prioridad = false } = {}) => `<img src="${foto(k).dir}/${k}-${ancho(k, max)}.webp" srcset="${srcset(k)}" sizes="${sizes}" alt="${esc(alt)}" width="${foto(k).w}" height="${foto(k).h}"${prioridad ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}>`
const credito = (k) => `<a href="${esc(foto(k).kaynak)}" rel="nofollow">${esc(foto(k).autor)}</a> · ${esc(foto(k).lisans)}`

// --- Сет-лист: las opciones de tour, como canciones de un concierto ---
const SETLIST = [
  { n: '01', titulo: 'Made in Japan', dur: 'Весь день · Осака', foto: 'dotonbori', alt: 'Неоновый Дотонбори в Осаке вечером',
    texto: 'Рок-маршрут по Осаке. Наканосима, где стоит Festival Hall: в августе 1972 года Deep Purple записали здесь и в токийском Будокане легендарный «Made in Japan». Потом Амэрикамура с магазинами винила и винтажа, гитарные магазины Синсайбаси и неон Дотонбори вечером.' },
  { n: '02', titulo: 'Охота за винилом', dur: 'Полдня · Осака', foto: 'umeda', alt: 'Квартал Умэда в Осаке',
    texto: 'Японские пластинки с «оби» — мечта коллекционеров по всему миру. Филипп знает, где искать рок 70-х и 80-х, японские прессы и редкие издания, и поможет объясниться с продавцом.' },
  { n: '03', titulo: 'Гитары и звук', dur: 'Полдня · Осака', foto: 'shinsekai', alt: 'Квартал Синсэкай в Осаке',
    texto: 'Япония — родина Yamaha, Ibanez и ESP. Магазины инструментов и аудиотехники, где можно спокойно попробовать гитару, а потом — Синсэкай, старая Осака с характером.' },
  { n: '04', titulo: 'Киото без спешки', dur: 'Весь день · Киото', foto: 'gion', alt: 'Улица Гиона в Киото',
    texto: 'Классика Киото в комфортном темпе: Золотой павильон, Гион, Киёмидзу-дэра. С паузами, такси между точками, если нужно, и без толп — как хорошая баллада.' },
  { n: '05', titulo: 'Teo Torriatte', dur: 'Весь день · Киото', foto: 'kinkakuji', alt: 'Золотой павильон Кинкаку-дзи',
    texto: 'Queen записали «Teo Torriatte» с припевом на японском, а Фредди Меркьюри собирал японский фарфор и гравюры. День японского искусства: мастерские, ремёсла и старые кварталы Киото.' },
  { n: '06', titulo: 'Нара: тихий трек', dur: 'Полдня или день · Нара', foto: 'nara-geyik', alt: 'Олени в парке Нары',
    texto: 'Олени, храм Тодай-дзи и Великий Будда, старый квартал Нарамати. Спокойный день, после которого хочется вернуться.' },
  { n: '07', titulo: 'Хиросима и Миядзима', dur: 'Долгий день', foto: 'miyajima-torii', alt: 'Ворота тории на острове Миядзима',
    texto: 'Утром — Мемориал мира в Хиросиме, днём — остров Миядзима с воротами в море. Всегда вместе, за один день: так и логистика проще, и впечатление цельное.' },
  { n: '08', titulo: 'Бис: тур на несколько дней', dur: 'Под ключ', foto: 'osaka-kale-gece', alt: 'Замок Осаки ночью',
    texto: 'Несколько дней с одним гидом: программа под вас, удобный темп, поезда и билеты продуманы заранее. Машину с водителем организуем через лицензированных партнёров.' },
]

const FAQ = [
  ['Кто такой Филипп?', 'Филипп — брат Лариона и русскоязычный гид команды Tony Kansai Guide. Он проводит частные экскурсии на русском по Кансаю: Киото, Осака, Нара. Любит рок и музыку, поэтому особенно хорошо показывает музыкальную Осаку: винил, гитары и историю «Made in Japan».'],
  ['Сколько стоит экскурсия с Филиппом?', `Цена зависит от программы и длительности, её называют сразу в Telegram ${TG_VISIBLE}. Поезда, входные билеты и еда оплачиваются отдельно, по факту.`],
  ['Подходит ли экскурсия для людей старшего возраста?', 'Да. Темп выбираете вы: паузы, кафе, такси между точками, меньше лестниц. Можно взять полдня вместо целого дня или разбить программу на несколько дней.'],
  ['Можно ли совместить экскурсию с чайной церемонией или кимоно?', 'Да. В программах ниже гид и впечатления наших партнёров собраны вместе: чайная церемония, кимоно, мастерские, самурайские доспехи. Мы бронируем сами, а скидки партнёров действуют для всех гостей команды.'],
  ['Можно ли попасть на концерт в Японии?', 'Подскажем, какие концерты и клубы живой музыки работают в ваши даты, и объясним, как купить билеты: в Японии это часто делается через местные сервисы на японском.'],
  ['Чем Филипп отличается от Лариона?', 'Это братья и одна команда. У Лариона 201 отзыв и маршруты по всему западу Японии; Филипп добавляет музыкальные программы для любителей рока. Если один занят, второй подстрахует.'],
  ['Как связаться с Филиппом?', `Пишите в Telegram ${TG_VISIBLE}: отвечает координатор Тони и сразу передаёт ваш запрос Филиппу. Укажите даты, сколько вас и что вам интересно.`],
]

const CSS = `
:root{--bg:#0b0a0a;--papel:#151313;--tinta:#f4efe6;--suave:#b9b0a3;--linea:rgba(244,239,230,.14);--chip:rgba(244,239,230,.07);--acento:#e3262b;--oro:#f2b33d;--cromo:#d9dde2}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%;overflow-x:clip}
body{margin:0;background:var(--bg);color:var(--tinta);font:400 17px/1.6 'Golos Text',system-ui,sans-serif;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.07;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
main,header,footer{position:relative;z-index:1}
a{color:inherit}img{max-width:100%;display:block}
h1,h2,h3{font-family:'Russo One',Impact,sans-serif;font-weight:400;line-height:1.05;margin:0;letter-spacing:.01em}
.kap{max-width:1160px;margin:0 auto;padding:0 16px}
.ceja{display:inline-block;font:600 12px/1 'Oswald',sans-serif;letter-spacing:.24em;text-transform:uppercase;color:var(--oro);margin-bottom:12px}
.top{position:sticky;top:0;z-index:20;background:rgba(11,10,10,.86);backdrop-filter:blur(10px);border-bottom:1px solid var(--linea)}
.top .kap{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:60px}
.marca{font:400 20px/1 'Russo One',sans-serif;text-decoration:none;display:flex;align-items:center;gap:8px}.marca i{font-style:normal;color:var(--acento)}
.heroe{position:relative;min-height:min(92svh,860px);display:grid;align-items:end;overflow:hidden;isolation:isolate}
.heroe>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.25) brightness(.55);z-index:-2}
.heroe::after{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(11,10,10,.2),rgba(11,10,10,.55) 45%,var(--bg)),linear-gradient(90deg,rgba(227,38,43,.55),transparent 60%);mix-blend-mode:normal}
.heroe .kap{display:grid;grid-template-columns:1.2fr .8fr;gap:32px;align-items:end;padding-block:120px 56px;width:100%}
.heroe h1{font-size:clamp(46px,9vw,112px);text-transform:uppercase;text-shadow:0 4px 0 rgba(0,0,0,.4)}
.heroe h1 span{display:block;color:var(--acento);-webkit-text-stroke:0}
.heroe h1 em{font-style:normal;color:transparent;-webkit-text-stroke:2px var(--tinta)}
.lead{font-size:clamp(17px,2vw,20px);max-width:56ch;color:#e8e1d5;margin:18px 0 26px}
.btns{display:flex;flex-wrap:wrap;gap:12px}
.btn{display:inline-flex;align-items:center;gap:8px;padding:15px 24px;border-radius:999px;font:600 16px/1 'Oswald',sans-serif;letter-spacing:.06em;text-transform:uppercase;text-decoration:none;background:var(--acento);color:#fff;box-shadow:0 0 0 0 rgba(227,38,43,.6);transition:transform .15s,box-shadow .3s}
.btn:hover{box-shadow:0 0 34px 2px rgba(227,38,43,.55)}.btn:active{transform:scale(.95)}
.btn.linea{background:transparent;border:2px solid var(--tinta);color:var(--tinta);box-shadow:none}
.credito{position:absolute;right:10px;bottom:6px;font-size:11px;opacity:.55}
.disco{position:relative;justify-self:end;width:min(100%,380px);aspect-ratio:1}
.vinilo{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,var(--acento) 0 17%,#111 17.4% 18%,transparent 18.4%),repeating-radial-gradient(circle,#161616 0 2px,#0c0c0c 2px 4px);box-shadow:0 30px 60px rgba(0,0,0,.6),inset 0 0 0 6px #070707;animation:gira 6s linear infinite}
.vinilo::before{content:'';position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 30deg,transparent 0 40deg,rgba(255,255,255,.14) 60deg,transparent 80deg 220deg,rgba(255,255,255,.1) 240deg,transparent 260deg)}
.vinilo::after{content:'';position:absolute;left:50%;top:50%;width:3%;height:3%;margin:-1.5%;border-radius:50%;background:var(--bg)}
.etiqueta-disco{position:absolute;inset:0;display:grid;place-items:center;text-align:center;font:400 13px/1.15 'Russo One',sans-serif;color:#fff;pointer-events:none}
.etiqueta-disco b{display:block;font-size:22px}
@keyframes gira{to{transform:rotate(360deg)}}
.boleto{position:absolute;left:-12%;bottom:-6%;background:var(--oro);color:#1a1206;padding:14px 22px 14px 18px;border-radius:10px;font:600 13px/1.3 'Oswald',sans-serif;letter-spacing:.08em;text-transform:uppercase;transform:rotate(-7deg);box-shadow:0 14px 30px rgba(0,0,0,.45);-webkit-mask:radial-gradient(circle 9px at 0 50%,transparent 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 9px at 100% 50%,transparent 98%,#000) right/51% 100% no-repeat;mask:radial-gradient(circle 9px at 0 50%,transparent 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 9px at 100% 50%,transparent 98%,#000) right/51% 100% no-repeat}
.boleto b{display:block;font:400 20px/1.1 'Russo One',sans-serif;letter-spacing:0}
.cinta{border-block:1px solid var(--linea);background:var(--acento);color:#fff;overflow:hidden;white-space:nowrap;transform:rotate(-1.2deg);margin:10px 0}
.cinta div{display:inline-block;padding:12px 0;font:400 20px/1 'Russo One',sans-serif;text-transform:uppercase;animation:corre 26s linear infinite}
@keyframes corre{to{transform:translateX(-50%)}}
section.bloque{padding:72px 0}
.bloque h2{font-size:clamp(32px,5vw,58px);text-transform:uppercase;margin-bottom:14px}
.sub{color:var(--suave);max-width:60ch;margin:0 0 30px}
.eq-bar{display:inline-flex;gap:4px;align-items:flex-end;height:22px;margin-inline-start:10px;vertical-align:middle}
.eq-bar i{width:5px;background:var(--acento);animation:salta 1s ease-in-out infinite}
.eq-bar i:nth-child(2){animation-delay:-.3s;background:var(--oro)}.eq-bar i:nth-child(3){animation-delay:-.6s}.eq-bar i:nth-child(4){animation-delay:-.15s;background:var(--oro)}
@keyframes salta{0%,100%{height:20%}50%{height:100%}}
.setlist{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:18px}
.track{position:relative;display:flex;flex-direction:column;background:var(--papel);border:1px solid var(--linea);border-radius:18px;overflow:hidden;transition:transform .25s,border-color .25s}
.track:hover{transform:translateY(-4px);border-color:var(--acento)}
.track figure{margin:0;position:relative;aspect-ratio:16/9;overflow:hidden}
.track figure img{width:100%;height:100%;object-fit:cover;filter:grayscale(.85) contrast(1.15);transition:filter .4s,transform .6s}
.track:hover figure img{filter:none;transform:scale(1.04)}
.track figure small{position:absolute;right:8px;bottom:6px;font-size:10px;opacity:.7;background:rgba(0,0,0,.5);padding:1px 6px;border-radius:6px}
.track .num{position:absolute;left:14px;top:12px;font:400 44px/1 'Russo One',sans-serif;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.7)}
.track .cuerpo{padding:18px;display:grid;gap:8px;flex:1}
.track h3{font-size:24px}
.track .dur{font:600 12px/1 'Oswald',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--oro)}
.track p{margin:0;color:#ddd5c8;font-size:15px}
.track a.pedir{margin-top:auto;justify-self:start;font:600 14px/1 'Oswald',sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--acento);text-decoration:none}
.amps{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.amp{background:linear-gradient(180deg,#1d1a1a,#121010);border:1px solid var(--linea);border-radius:16px;padding:22px 18px;position:relative}
.amp::before{content:'';position:absolute;inset:10px 10px auto auto;width:10px;height:10px;border-radius:50%;background:var(--acento);box-shadow:0 0 10px var(--acento)}
.perilla{width:52px;height:52px;border-radius:50%;margin-bottom:14px;background:radial-gradient(circle at 35% 30%,#fafafa,#8b8f94 55%,#3a3d40);position:relative;box-shadow:0 4px 10px rgba(0,0,0,.5)}
.perilla::after{content:'';position:absolute;left:50%;top:6px;width:3px;height:16px;margin-left:-1.5px;background:#111;border-radius:2px;transform-origin:50% 20px;transform:rotate(var(--g,120deg))}
.amp h3{font-size:19px;margin-bottom:6px}.amp p{margin:0;color:var(--suave);font-size:15px}
.pasos{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;counter-reset:p}
.pasos li{counter-increment:p;border-top:3px solid var(--acento);padding-top:16px}
.pasos li::before{content:counter(p,decimal-leading-zero);font:400 40px/1 'Russo One',sans-serif;color:var(--oro);display:block;margin-bottom:8px}
.pasos b{display:block;font-size:19px;margin-bottom:4px}.pasos span{color:var(--suave)}
.otvet{background:var(--papel);border-left:4px solid var(--oro);padding:18px 20px;border-radius:0 14px 14px 0;max-width:80ch}
details{border-bottom:1px solid var(--linea);padding:16px 0}
summary{cursor:pointer;font:600 19px/1.3 'Oswald',sans-serif;list-style:none;display:flex;justify-content:space-between;gap:16px}
summary::after{content:'+';color:var(--acento);font-size:26px;line-height:1}details[open] summary::after{content:'–'}
details p{color:#ddd5c8;margin:10px 0 0}
.cierre{text-align:center;padding:64px 20px;border-radius:26px;background:radial-gradient(circle at 50% 0,rgba(227,38,43,.35),transparent 60%),var(--papel);border:1px solid var(--linea)}
.cierre h2{font-size:clamp(32px,5vw,56px);text-transform:uppercase;margin-bottom:12px}.cierre p{color:var(--suave);max-width:52ch;margin:0 auto 24px}.cierre .btns{justify-content:center}
.tg-fijo{position:fixed;right:14px;bottom:14px;z-index:30;display:inline-flex;align-items:center;gap:8px;padding:13px 18px;border-radius:999px;background:var(--acento);color:#fff;text-decoration:none;font:600 15px/1 'Oswald',sans-serif;letter-spacing:.05em;text-transform:uppercase;box-shadow:0 10px 30px rgba(0,0,0,.5)}
.pl{--pl-acento:var(--acento)}.pl h2{font-family:'Russo One',sans-serif;font-weight:400;text-transform:uppercase}.pl-t{background:var(--papel)}
footer{border-top:1px solid var(--linea);margin-top:40px}
.sube{opacity:1}
@media (max-width:900px){.heroe .kap{grid-template-columns:1fr;padding-block:100px 40px}.disco{justify-self:center;width:min(78vw,320px);margin-top:10px}.boleto{left:-4%}.amps{grid-template-columns:repeat(2,1fr)}}
@media (max-width:700px){
  .setlist,.amps{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:14px;margin-inline:-16px;padding:4px 16px 18px;scroll-padding-inline:16px;scrollbar-width:none}
  .setlist>li,.amps>article{flex:0 0 82%;scroll-snap-align:start}
  .pasos{grid-template-columns:1fr}section.bloque{padding:52px 0}
  .tg-fijo span{display:none}
}
@media (prefers-reduced-motion:reduce){.vinilo,.cinta div,.eq-bar i{animation:none}}
`

const MOVIMIENTO = `(function(){if(matchMedia('(prefers-reduced-motion: reduce)').matches||!window.gsap)return;
var L=window.Lenis?new Lenis({lerp:.12}):null;if(L){(function r(t){L.raf(t);requestAnimationFrame(r)})(0)}
gsap.registerPlugin(ScrollTrigger);if(L)L.on('scroll',ScrollTrigger.update);
gsap.from('.heroe h1 span,.heroe h1 em,.heroe h1',{y:40,opacity:0,duration:.8,stagger:.08,ease:'power3.out'});
gsap.from('.boleto',{rotate:-25,y:60,opacity:0,duration:1,delay:.4,ease:'back.out(1.6)'});
document.querySelectorAll('.bloque h2,.track,.amp,.pasos li,.pl-t').forEach(function(el){gsap.from(el,{y:34,opacity:0,duration:.7,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 90%'}})});
document.querySelectorAll('.perilla').forEach(function(p,i){gsap.fromTo(p,{'--g':'-130deg'},{'--g':(90+i*25)+'deg',duration:1.2,ease:'power2.out',scrollTrigger:{trigger:p,start:'top 90%'}})});
})();`

const cta = (texto = 'Написать в Telegram') => `<div class="btns"><a class="btn" href="${TG_URL}" aria-label="${esc(`${texto}: ${TG_VISIBLE}. ${TG_NOTA}`)}">${TG_ICONO} ${esc(texto)}</a><a class="btn linea" href="#setlist">Сет-лист туров</a></div>`

const cuerpo = `<section class="heroe">
${img('dotonbori', 'Неоновая Осака вечером', { prioridad: true, max: 1600 })}
<div class="kap">
<div>
<span class="ceja">Гид на русском · Киото · Осака · Нара</span>
<h1>Япония <em>на полной</em> <span>громкости</span></h1>
<p class="lead">Филипп — брат Лариона и русскоязычный гид нашей команды. Он живёт рок-музыкой и показывает Японию так, как её чувствуют музыканты: с драйвом, но в вашем темпе, с комфортом и на родном языке.</p>
${cta()}
</div>
<div class="disco" aria-hidden="true">
<div class="vinilo"></div>
<div class="etiqueta-disco"><span><b>ФИЛИПП</b>Kansai Tour</span></div>
<div class="boleto">Admit one<b>Филипп · гид</b>Киото · Осака · Нара</div>
</div>
</div>
<small class="credito">Фото: ${credito('dotonbori')}</small>
</section>
<div class="cinta" aria-hidden="true"><div>${' Made in Japan ✦ Осака ✦ Киото ✦ Нара ✦ Винил ✦ Гитары ✦ На русском ✦'.repeat(6)}</div></div>

<section class="bloque" id="setlist"><div class="kap">
<span class="ceja">Сет-лист<span class="eq-bar" aria-hidden="true"><i></i><i></i><i></i><i></i></span></span>
<h2>Выберите свой тур</h2>
<p class="sub">Каждая программа — как трек в концерте: можно взять один, а можно собрать весь альбом на несколько дней. Всё частным образом, только ваша компания.</p>
<ol class="setlist">${SETLIST.map((t) => `<li class="track">
<figure>${img(t.foto, t.alt, { sizes: '(max-width:700px) 82vw, 380px' })}<span class="num" aria-hidden="true">${t.n}</span><small>${credito(t.foto)}</small></figure>
<div class="cuerpo"><span class="dur">${esc(t.dur)}</span><h3>${esc(t.titulo)}</h3><p>${esc(t.texto)}</p>
<a class="pedir" href="${TG_URL}">Хочу этот тур →</a></div></li>`).join('\n')}</ol>
</div></section>

<section class="bloque" id="pochemu"><div class="kap">
<span class="ceja">Почему с Филиппом</span>
<h2>Звук настроен под вас</h2>
<div class="amps">
<article class="amp"><div class="perilla" aria-hidden="true"></div><h3>Всё по-русски</h3><p>История, детали, общение в магазинах и ресторанах — на вашем языке, без переводчика в телефоне.</p></article>
<article class="amp"><div class="perilla" aria-hidden="true"></div><h3>Комфортный темп</h3><p>Паузы, такси между точками, меньше лестниц и толп. Вы отдыхаете, а не бегаете за группой.</p></article>
<article class="amp"><div class="perilla" aria-hidden="true"></div><h3>Музыкальная Япония</h3><p>Винил, гитары, клубы живой музыки и рок-история, которую не найти в обычном путеводителе.</p></article>
<article class="amp"><div class="perilla" aria-hidden="true"></div><h3>Команда за спиной</h3><p>Филипп — брат Лариона (201 отзыв). Партнёры, бронирования и скидки команды — для вас тоже.</p></article>
</div>
</div></section>

${planesBloque('ru', 'filipp', URL_PAG)}

<section class="bloque" id="kak"><div class="kap">
<span class="ceja">Как это работает</span>
<h2>Три аккорда</h2>
<ol class="pasos">
<li><b>Напишите</b><span>Даты, сколько вас и что вам интересно — рок, классика или всё вместе.</span></li>
<li><b>Программа</b><span>Филипп собирает маршрут под ваш темп и называет цену заранее.</span></li>
<li><b>Встреча</b><span>Встречаем вас у отеля — и Япония звучит.</span></li>
</ol>
</div></section>

<section class="bloque"><div class="kap">
<p class="otvet"><strong>Кто такой Филипп?</strong> Филипп — брат Лариона и русскоязычный гид команды Tony Kansai Guide. Частные экскурсии на русском по Киото, Осаке и Наре в комфортном темпе, а для любителей рока — музыкальная Осака: винил, гитары и история «Made in Japan». Запись в Telegram ${TG_VISIBLE}.</p>
</div></section>

<section class="bloque" id="voprosy"><div class="kap">
<span class="ceja">Вопросы</span>
<h2>Частые вопросы</h2>
<div>${FAQ.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
</div></section>

<section class="bloque"><div class="kap"><div class="cierre">
<span class="ceja">Encore</span>
<h2>Ваша Япония ждёт</h2>
<p>Напишите, когда вы приезжаете и что любите. Остальное Филипп возьмёт на себя.</p>
${cta('Написать Филиппу')}
<p style="margin:16px 0 0;font-size:14px">${esc(TG_NOTA)}</p>
</div></div></section>`

const PERSONA = {
  '@type': 'Person', '@id': `${URL_PAG}#filipp`, name: 'Филипп', alternateName: ['Filipp', 'Philips'],
  jobTitle: 'Русскоязычный частный гид в Японии', knowsLanguage: ['ru'], url: URL_PAG,
  knowsAbout: ['Киото', 'Осака', 'Нара', 'рок-музыка', 'виниловые пластинки', 'Deep Purple Made in Japan'],
  worksFor: { '@id': `${BASE}/#organization` }, sibling: { '@id': `${BASE}/#larion` },
  areaServed: ['Kyoto', 'Osaka', 'Nara', 'Kobe', 'Hiroshima', 'Miyajima'],
}
const jsonld = { '@context': 'https://schema.org', '@graph': [
  PERSONA,
  { '@type': 'Organization', '@id': `${BASE}/#organization`, name: 'Tony Kansai Guide', url: `${BASE}/` },
  { '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  { '@type': 'ItemList', name: 'Сет-лист туров с Филиппом', itemListElement: SETLIST.map((t, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'TouristTrip', name: t.titulo, description: t.texto, provider: { '@id': `${URL_PAG}#filipp` }, url: `${URL_PAG}#setlist` } })) },
  { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Гиды на русском', item: `${BASE}/ru/` }, { '@type': 'ListItem', position: 2, name: 'Филипп', item: URL_PAG }] },
] }

const TITULO = 'Филипп — гид на русском в Киото и Осаке | Рок-туры и частные экскурсии'
const DESC = 'Филипп, брат Лариона, — частный гид на русском в Киото, Осаке и Наре. Комфортный темп, а для любителей рока — музыкальная Осака: винил, гитары, «Made in Japan». Запись в Telegram.'

const html = `<!doctype html>
<html lang="ru" data-estatica="filipp">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(TITULO)}</title>
<meta name="description" content="${esc(DESC)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#0b0a0a">
<link rel="canonical" href="${URL_PAG}">
<link rel="alternate" hreflang="ru" href="${URL_PAG}">
<meta property="og:type" content="profile">
<meta property="og:site_name" content="Tony Kansai Guide">
<meta property="og:locale" content="ru_RU">
<meta property="og:url" content="${URL_PAG}">
<meta property="og:title" content="${esc(TITULO)}">
<meta property="og:description" content="${esc(DESC)}">
<meta property="og:image" content="${BASE}${foto('dotonbori').dir}/dotonbori-${ancho('dotonbori', 1600)}.webp">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;600&family=Oswald:wght@500;600&family=Russo+One&display=swap">
<style>${CSS}${equipoCSS}${menuCSS}${planesCSS}</style>
<link rel="stylesheet" href="/rb/rb.css"><style>:root{--rb-acento:#e3262b;--rb-acento2:#f2b33d}</style>
</head>
<body>
<header class="top"><div class="kap"><a class="marca" href="${RUTA}"><i>▶</i> Филипп</a>
${navHTML({ etiqueta: 'Разделы', abrir: 'Открыть меню', variante: 'filipp', grupos: [
  { t: 'Туры', enlaces: SETLIST.map((t) => [esc(t.titulo), '#setlist']).slice(0, 6).concat([['Программы с впечатлениями', '#planes']]) },
  { t: 'Филипп', enlaces: [['Почему с Филиппом', '#pochemu'], ['Как это работает', '#kak'], ['Вопросы', '#voprosy']] },
  { t: 'Команда', enlaces: [['Ларион — гид на русском', '/ru/'], ['Ответы для туристов из России', '/ru/otvety/'], ['Полезное для поездки', '/ru/perks/'], ['Наши гиды', '#eq-titulo-ru']] },
], cta: { t: `${TG_ICONO} Написать`, h: TG_URL, aria: `Telegram ${TG_VISIBLE}: ${TG_NOTA}` } })}</div></header>
<main>
${cuerpo}
</main>
<footer>${pieHTML({ variante: 'filipp', mas: 'Показать все',
  intro: `<p>Филипп — русскоязычный гид команды <a href="/ru/">Tony Kansai Guide</a>, брат <a href="/ru/">Лариона</a>. Запись через координатора Тони в Telegram ${TG_VISIBLE}.</p>`,
  columnas: [
    { t: 'Туры', enlaces: SETLIST.map((t) => [esc(t.titulo), '#setlist']) },
    { t: 'Команда', enlaces: [['Ларион: Япония и Южная Корея', '/ru/'], ['Ответы на русском', '/ru/otvety/'], ['Полезное для поездки', '/ru/perks/']] },
    { t: 'Контакт', fija: true, html: `<p>Telegram: <a href="${TG_URL}">${TG_VISIBLE}</a></p><p>${esc(TG_NOTA)}</p><p><a href="mailto:tony@tonykansaiguide.com">tony@tonykansaiguide.com</a></p>` },
  ],
  equipo: equipoHTML({ lang: 'ru', actual: 'filipp', variante: 'filipp' }),
  fin: `<span>© Tony Kansai Guide</span><a href="mailto:tony@tonykansaiguide.com">tony@tonykansaiguide.com</a><span>Обновлено: ${HOY}</span>`,
})}</footer>
<a class="tg-fijo" href="${TG_URL}" aria-label="Telegram ${TG_VISIBLE}: ${TG_NOTA}">${TG_ICONO} <span>Написать</span></a>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.3.27/dist/lenis.min.js" defer></script>
<script>addEventListener('load',function(){${MOVIMIENTO}})</script>
<script src="/rb/rb.js" defer></script>
</body>
</html>
`

const dir = join(root, 'public/ru/filipp')
mkdirSync(dir, { recursive: true })
writeFileSync(join(dir, 'index.html'), html)
if (!existsSync(join(dir, 'index.html'))) throw new Error('filipp: no se escribió la página')
console.log(`filipp: ${RUTA} (${Math.round(html.length / 1024)} KB)`)
