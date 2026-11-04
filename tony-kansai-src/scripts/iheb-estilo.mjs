// Estilo «anime» de las páginas de Iheb (/fr/, /ar/tokyo/, /en/tokyo-anime-guide/).
// 4-11-2026 (Tony): que parezca anime y cartas coleccionables, lo que gusta al
// público americano y otaku. Diseño PROPIO: viñetas de manga con contorno grueso,
// sombras duras, tramas de puntos y una «carta coleccionable» con brillo holo para
// presentar a Iheb. Sin logos, Poké Ball ni personajes de Nintendo/The Pokémon
// Company (marca registrada): solo la idea de carta, nunca su diseño.
//
// Se añade DESPUÉS del CSS base de cada generador: redefine las mismas variables
// (--bg, --fg, --kirmizi…) que leen el menú y la franja del equipo (variante 'fr').

export const ANIME_FUENTES = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=M+PLUS+Rounded+1c:wght@500;800&family=Lalezar&family=Tajawal:wght@500;800&display=swap">'

export const ANIME_CSS = `
:root{--bg:#fff8ec;--fg:#16132a;--soluk:#4d4866;--kart:#fff;--cizgi:#16132a;--kirmizi:#e8325a;--yesil:#13a05a;--sol:#ffd23f;--gok:#3ec5ff;--mor:#7b5cff;--golge:#16132a;--nokta:rgba(22,19,42,.07)}
@media (prefers-color-scheme:dark){:root{--bg:#14112a;--fg:#f4f1ff;--soluk:#bdb6dc;--kart:#1f1a3d;--cizgi:#f4f1ff;--kirmizi:#ff6d8a;--yesil:#2fd27f;--sol:#ffd23f;--gok:#5fd1ff;--mor:#a48bff;--golge:#000;--nokta:rgba(255,255,255,.06)}}
body{font-family:"M PLUS Rounded 1c",system-ui,-apple-system,"Segoe UI",sans-serif;font-weight:500;background-color:var(--bg);background-image:radial-gradient(var(--nokta) 1.4px,transparent 1.5px);background-size:14px 14px}
h1,h2,h3{font-family:"Dela Gothic One","M PLUS Rounded 1c",system-ui,sans-serif;font-weight:400;letter-spacing:0}
h2{position:relative;display:inline-block;padding:0 .2em;background:linear-gradient(transparent 58%,var(--sol) 58%,var(--sol) 92%,transparent 92%)}
@media (prefers-color-scheme:dark){h2{background:linear-gradient(transparent 58%,var(--mor) 58%,var(--mor) 92%,transparent 92%)}}
header{background:var(--bg);border-bottom:3px solid var(--cizgi)}
header .kap>a:first-child{font-family:"Dela Gothic One",system-ui,sans-serif;font-weight:400}
/* Héroe: viñeta de manga con líneas de velocidad */
.kahraman{border-bottom:4px solid var(--cizgi)}
.kahraman .ortu{background:repeating-conic-gradient(from 0deg at 70% 40%,rgba(255,255,255,.07) 0 2deg,transparent 2deg 9deg),linear-gradient(180deg,transparent 0,rgba(10,8,30,.35) 35%,rgba(10,8,30,.85) 100%)}
.kahraman h1{-webkit-text-stroke:1.5px #16132a;paint-order:stroke fill;text-shadow:4px 4px 0 #16132a,0 0 30px rgba(62,197,255,.35)}
.kahraman .etiket{display:inline-block;background:var(--sol);color:#16132a;border:3px solid #16132a;border-radius:10px;padding:4px 12px;transform:rotate(-2deg);box-shadow:3px 3px 0 #16132a;letter-spacing:.06em}
.kahraman .etiket a{color:#16132a}
/* Botones: pegatina amarilla con sombra dura */
.btn{background:var(--sol);color:#16132a;border:3px solid #16132a;box-shadow:4px 4px 0 #16132a;font-weight:800;transition:transform .15s ease,box-shadow .15s ease}
.btn:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 #16132a}.btn:active{transform:translate(2px,2px);box-shadow:1px 1px 0 #16132a}
.wa-sabit{background:var(--yesil);border:3px solid #16132a;box-shadow:4px 4px 0 #16132a}
/* Tarjetas: viñetas */
.izgara li{border:3px solid var(--cizgi);border-radius:18px;box-shadow:6px 6px 0 var(--golge);transition:transform .18s ease,box-shadow .18s ease}
.izgara li:hover{transform:translate(-3px,-3px) rotate(-.4deg);box-shadow:9px 9px 0 var(--kirmizi)}
.izgara li:nth-child(3n+2):hover{box-shadow:9px 9px 0 var(--gok)}.izgara li:nth-child(3n):hover{box-shadow:9px 9px 0 var(--mor)}
.izgara h3{font-size:19px}
.kf{border-bottom:3px solid var(--cizgi)}
/* Respuesta directa = bocadillo de cómic */
.cevap{position:relative;border:3px solid var(--cizgi);border-left-width:3px;border-radius:22px;box-shadow:5px 5px 0 var(--golge);margin-bottom:34px}
.cevap::after{content:"";position:absolute;left:44px;bottom:-19px;width:26px;height:26px;background:var(--kart);border-right:3px solid var(--cizgi);border-bottom:3px solid var(--cizgi);transform:skewX(30deg) rotate(45deg)}
[dir=rtl] .cevap::after{left:auto;right:44px;transform:skewX(-30deg) rotate(45deg)}
details,.fiche,.iheb-mini,ul.yorumlar li{border:3px solid var(--cizgi);box-shadow:4px 4px 0 var(--golge)}
summary{font-weight:800}
table{border:3px solid var(--cizgi);border-radius:12px;overflow:hidden;background:var(--kart)}th{background:var(--sol);color:#16132a}
/* Retrato de Iheb = carta coleccionable con brillo holo */
.guide .portrait{border:10px solid #fff;outline:3px solid #16132a;border-radius:20px;box-shadow:8px 8px 0 #16132a;transform:rotate(-2deg)}
.tcg{position:relative;max-width:340px;margin:0 auto;padding:12px;border-radius:22px;background:linear-gradient(135deg,var(--sol),#ff9f1c 45%,var(--kirmizi));border:3px solid #16132a;box-shadow:8px 8px 0 #16132a;transform:rotate(-2deg);color:#16132a}
.tcg::before{content:"";position:absolute;inset:0;border-radius:20px;pointer-events:none;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.55) 45%,rgba(62,197,255,.35) 52%,transparent 66%);background-size:250% 250%;animation:holo 6s ease-in-out infinite;mix-blend-mode:soft-light}
@keyframes holo{0%,100%{background-position:100% 100%}50%{background-position:0 0}}
@media (prefers-reduced-motion:reduce){.tcg::before{animation:none}}
.tcg-ust{display:flex;justify-content:space-between;align-items:center;gap:8px;background:#fff;border:3px solid #16132a;border-radius:12px;padding:6px 12px;font-family:"Dela Gothic One",system-ui,sans-serif}
.tcg-ust b{font-size:22px;font-weight:400}.tcg-ust span{font-size:13px;background:var(--gok);border:2px solid #16132a;border-radius:999px;padding:1px 10px}
.tcg img{display:block;width:100%;height:auto;aspect-ratio:1/1;object-fit:cover;margin:10px 0;border:3px solid #16132a;border-radius:12px;background:#fff}
.tcg-kutu{background:#fff;border:3px solid #16132a;border-radius:12px;padding:8px 12px;font-size:14px;line-height:1.5}
.tcg-kutu p{margin:4px 0}.tcg-kutu strong{font-family:"Dela Gothic One",system-ui,sans-serif;font-weight:400}
.tcg-rozet{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 0}.tcg-rozet span{background:var(--sol);border:2px solid #16132a;border-radius:999px;padding:1px 10px;font-size:13px;font-weight:800}
/* Pegatinas y bandas */
.rozetler{display:flex;flex-wrap:wrap;gap:10px;padding:0;list-style:none;margin:18px 0}
.rozetler li{background:var(--kart);border:3px solid var(--cizgi);border-radius:999px;padding:6px 14px;font-weight:800;box-shadow:3px 3px 0 var(--golge)}
.rozetler li:nth-child(4n+1){background:var(--sol);color:#16132a}.rozetler li:nth-child(4n+3){background:var(--gok);color:#16132a}
.bant{background:var(--fg);color:var(--bg);border-block:4px solid var(--sol);padding:26px 0;margin-top:56px}
.bant h2{background:none;color:var(--sol)!important;margin-top:0!important}.bant p,.bant li{color:var(--bg)}.bant a{color:var(--sol)}
.adimlar{counter-reset:a;list-style:none;padding:0;display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.adimlar li{counter-increment:a;position:relative;background:var(--kart);color:var(--fg);border:3px solid var(--cizgi);border-radius:16px;padding:40px 16px 16px;box-shadow:5px 5px 0 var(--golge)}
.adimlar li::before{content:counter(a);position:absolute;top:-16px;inset-inline-start:14px;width:42px;height:42px;display:grid;place-items:center;font-family:"Dela Gothic One",sans-serif;background:var(--kirmizi);color:#fff;border:3px solid #16132a;border-radius:50%}
/* Árabe: fuentes y dirección */
[lang=ar] body,body[lang=ar],html[lang=ar] body{font-family:Tajawal,"M PLUS Rounded 1c",system-ui,sans-serif}
html[lang=ar] h1,html[lang=ar] h2,html[lang=ar] h3,html[lang=ar] .tcg-ust,html[lang=ar] .tcg-kutu strong,html[lang=ar] header .kap>a:first-child{font-family:Lalezar,Tajawal,system-ui,sans-serif;letter-spacing:0}
html[lang=ar] .wa-sabit{right:auto;left:16px}
html[lang=ar] ul.ozet{padding-left:0;padding-right:20px}
html[lang=ar] td,html[lang=ar] th{text-align:right}
`
