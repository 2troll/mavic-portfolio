/* Caída de temporada: momiji en otoño, nieve en invierno, sakura en primavera.
   Decorativo: fixed, sin clics, aria-hidden, solo transform/opacity. Fecha en Asia/Tokyo.
   ?temporada=otono|invierno|sakura|nada la fuerza para probar. */
(function () {
  if (window.__caida) return; window.__caida = 1
  var d = document, w = window
  try { if (w.matchMedia('(prefers-reduced-motion: reduce)').matches) return } catch (e) {}

  function temporada() {
    var q = /[?&]temporada=(otono|invierno|sakura|nada)/.exec(location.search)
    if (q) return q[1]
    // La página de una temporada lleva su caída aunque se lea en otra época.
    var ru = location.pathname
    if (/invierno-kansai|kansai-winter/.test(ru)) return 'invierno'
    if (/sakura|cherry-blossom/.test(ru)) return 'sakura'
    var md
    try {
      var p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo', month: '2-digit', day: '2-digit' }).formatToParts(new Date())
      var m = 0, dd = 0
      for (var i = 0; i < p.length; i++) { if (p[i].type === 'month') m = +p[i].value; if (p[i].type === 'day') dd = +p[i].value }
      md = m * 100 + dd
    } catch (e) { var t = new Date(Date.now() + 324e5); md = (t.getUTCMonth() + 1) * 100 + t.getUTCDate() }
    if (md >= 1020 && md <= 1212) return 'otono'
    if (md >= 1213 || md <= 228) return 'invierno'
    if (md >= 301 && md <= 314) return 'ume' // anticipo: pocos pétalos sueltos
    if (md >= 315 && md <= 425) return 'sakura'
    return 'nada'
  }

  // [emojis, factor de cantidad, opacidad máx., segundos de caída mín.]
  var T = {
    otono: [['🍁', '🍂', '🍁'], 1, 0.75, 13],
    invierno: [['❄️'], 0.55, 0.6, 16],
    ume: [['🌸'], 0.4, 0.65, 15],
    sakura: [['🌸'], 1, 0.75, 14]
  }

  // Solo en español (Tony, 24-11-2026): /en/, /ar/, /ru/ y /larion/ sin caída.
  function enEspanol() {
    return /^es\b/i.test(d.documentElement.lang || '') || /^\/es(\/|$)/.test(location.pathname)
  }

  function montar() {
    if (!enEspanol()) return
    var cfg = T[temporada()]
    if (!cfg || d.getElementById('caida') || !d.body) return
    var b = d.body
    if (b.classList.contains('v7-expedicion') || d.querySelector('.v7-expedicion')) return
    var movil = w.innerWidth < 768
    var n = Math.round((movil ? 13 : 21) * cfg[1])
    var st = d.createElement('style')
    st.textContent =
      '#caida{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:45;contain:strict;opacity:0;transition:opacity 2s}' +
      '#caida.on{opacity:1}#caida.pausa *{animation-play-state:paused!important}' +
      'body:has(.v7-expedicion) #caida{display:none}' +
      '#caida>i{position:absolute;top:0;font-style:normal;line-height:1;will-change:transform;animation:cd-cae linear infinite}' +
      '#caida>i>b{display:block;font-weight:400;animation:cd-va ease-in-out infinite alternate}' +
      '@keyframes cd-cae{0%{transform:translate3d(0,-12vh,0);opacity:0}8%{opacity:var(--o)}88%{opacity:var(--o)}100%{transform:translate3d(var(--dx),108vh,0);opacity:0}}' +
      '@keyframes cd-va{0%{transform:translateX(calc(var(--s)*-1)) rotate(-25deg)}100%{transform:translateX(var(--s)) rotate(35deg)}}' +
      '@media (prefers-reduced-motion:reduce){#caida{display:none}}'
    d.head.appendChild(st)
    var c = d.createElement('div')
    c.id = 'caida'; c.setAttribute('aria-hidden', 'true')
    var html = '', r = Math.random
    for (var i = 0; i < n; i++) {
      var dur = cfg[3] + r() * 10
      html += '<i style="left:' + (r() * 98).toFixed(1) + '%;font-size:' + Math.round(14 + r() * 14) + 'px;--o:' +
        (cfg[2] * (0.55 + r() * 0.45)).toFixed(2) + ';--dx:' + Math.round(r() * 120 - 60) + 'px;animation-duration:' +
        dur.toFixed(1) + 's;animation-delay:-' + (r() * dur).toFixed(1) + 's"><b style="--s:' + Math.round(10 + r() * 22) +
        'px;animation-duration:' + (2.5 + r() * 3).toFixed(1) + 's">' + cfg[0][i % cfg[0].length] + '</b></i>'
    }
    c.innerHTML = html
    b.appendChild(c)
    setTimeout(function () { c.classList.add('on') }, 50)
    d.addEventListener('visibilitychange', function () { c.classList.toggle('pausa', d.hidden) })
    try {
      w.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function (e) { if (e.matches) c.remove() })
    } catch (e) {}
  }

  function luego() { (w.requestIdleCallback || function (f) { setTimeout(f, 200) })(montar, { timeout: 3000 }) }
  if (d.readyState === 'complete') luego(); else w.addEventListener('load', luego)
  // La SPA cambia <html lang> al navegar: fuera la caída al salir del español, y vuelve al entrar.
  try {
    new MutationObserver(function () {
      var c = d.getElementById('caida')
      if (enEspanol()) { if (c) c.style.display = ''; else if (d.readyState === 'complete') luego() }
      else if (c) c.style.display = 'none'
    }).observe(d.documentElement, { attributes: true, attributeFilter: ['lang'] })
  } catch (e) {}
})()
