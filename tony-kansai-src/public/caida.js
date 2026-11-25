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

  // Botón para apagarla (Tony, 25-11-2026: «una cosa para desactivar las hojas»).
  // La elección se guarda en el navegador: quien la apaga no la vuelve a ver.
  var CLAVE = 'tk-caida'
  function apagada() { try { return localStorage.getItem(CLAVE) === 'no' } catch (e) { return false } }
  var NOMBRE = { otono: 'las hojas', invierno: 'la nieve', ume: 'los pétalos', sakura: 'los pétalos' }

  function boton(t, cfg) {
    if (d.getElementById('caida-boton')) return
    var st = d.getElementById('caida-boton-estilo') || d.createElement('style'); st.id = 'caida-boton-estilo'
    st.textContent =
      '#caida-boton{position:fixed;right:max(12px,env(safe-area-inset-right));top:var(--caida-arriba,76px);z-index:46;' +
      'width:40px;height:40px;border-radius:50%;border:1px solid rgba(30,42,54,.18);background:rgba(255,255,255,.88);' +
      'box-shadow:0 2px 10px rgba(30,42,54,.12);display:grid;place-items:center;padding:0;cursor:pointer;font-size:19px;line-height:1;' +
      '-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);transition:opacity .2s}' +
      '#caida-boton:focus-visible{outline:2px solid #2d684c;outline-offset:2px}' +
      '#caida-boton[aria-pressed="false"]>span{opacity:.45;filter:grayscale(1)}' +
      '#caida-boton[aria-pressed="false"]::after{content:"";position:absolute;width:24px;height:2px;background:#1e2a36;transform:rotate(-45deg);border-radius:2px}' +
      'html[data-tema="oscuro"] #caida-boton{background:rgba(29,26,38,.88);border-color:rgba(255,255,255,.2)}' +
      'html[data-tema="oscuro"] #caida-boton[aria-pressed="false"]::after{background:#f3eef0}' +
      'body:has(.v7-expedicion) #caida-boton,html.cab-es-bloqueo #caida-boton{display:none}@media print{#caida-boton{display:none}}'
    d.head.appendChild(st)
    var bt = d.createElement('button')
    bt.id = 'caida-boton'; bt.type = 'button'
    bt.innerHTML = '<span aria-hidden="true">' + cfg[0][0] + '</span>'
    function pinta() {
      var on = !apagada()
      bt.setAttribute('aria-pressed', on ? 'true' : 'false')
      var txt = (on ? 'Quitar ' : 'Poner ') + (NOMBRE[t] || 'la animación') + ' que caen'
      bt.setAttribute('aria-label', txt); bt.title = txt
    }
    bt.addEventListener('click', function () {
      var on = !apagada()
      try { localStorage.setItem(CLAVE, on ? 'no' : 'si') } catch (e) {}
      var c = d.getElementById('caida')
      if (on) { if (c) c.remove() } else lluvia(cfg)
      pinta()
    })
    pinta()
    d.body.appendChild(bt)
    // Arriba a la derecha, justo bajo la cabecera fija: abajo están las cookies y la barra de WhatsApp.
    function sitio() {
      var h = d.querySelector('.cab-es, .cab-en, .v7-cabecera')
      var alto = h ? h.getBoundingClientRect().height : 64
      d.documentElement.style.setProperty('--caida-arriba', Math.round(Math.min(alto, 120) + 10) + 'px')
    }
    sitio(); if (!w.__caidaSitio) { w.__caidaSitio = 1; w.addEventListener('resize', sitio) }
  }

  var actual = null   // temporada que se está viendo ahora
  function montar() {
    if (!enEspanol()) return
    var t = temporada(), cfg = T[t]
    actual = t
    if (!cfg || !d.body) return
    var b = d.body
    if (b.classList.contains('v7-expedicion') || d.querySelector('.v7-expedicion')) return
    boton(t, cfg)
    if (!apagada()) lluvia(cfg)
  }

  function lluvia(cfg) {
    if (d.getElementById('caida')) return
    var b = d.body
    var movil = w.innerWidth < 768
    var n = Math.round((movil ? 13 : 21) * cfg[1])
    if (!d.getElementById('caida-estilo')) {
    var st = d.createElement('style'); st.id = 'caida-estilo'
    st.textContent =
      '#caida{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:45;contain:strict;opacity:0;transition:opacity 2s}' +
      '#caida.on{opacity:1}#caida.pausa *{animation-play-state:paused!important}' +
      'body:has(.v7-expedicion) #caida{display:none}html.cab-es-bloqueo #caida,html.cab-es-bloqueo #caida-boton{display:none}' +
      '#caida>i{position:absolute;top:0;font-style:normal;line-height:1;will-change:transform;animation:cd-cae linear infinite}' +
      '#caida>i>b{display:block;font-weight:400;animation:cd-va ease-in-out infinite alternate}' +
      '@keyframes cd-cae{0%{transform:translate3d(0,-12vh,0);opacity:0}8%{opacity:var(--o)}88%{opacity:var(--o)}100%{transform:translate3d(var(--dx),108vh,0);opacity:0}}' +
      '@keyframes cd-va{0%{transform:translateX(calc(var(--s)*-1)) rotate(-25deg)}100%{transform:translateX(var(--s)) rotate(35deg)}}' +
      '@media (prefers-reduced-motion:reduce){#caida{display:none}}'
    d.head.appendChild(st)
    }
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
    d.addEventListener('visibilitychange', function () { var k = d.getElementById('caida'); if (k) k.classList.toggle('pausa', d.hidden) })
    try {
      w.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function (e) { if (e.matches) c.remove() })
    } catch (e) {}
  }

  // La SPA cambia de página sin recargar (Tony, 25-11-2026: «cuando cambio en el
  // menú se queda siempre la anterior»): al cambiar la ruta se vuelve a mirar la
  // temporada y, si es otra, se quitan la caída y el botón y se montan los nuevos.
  function quitar() {
    var c = d.getElementById('caida'), k = d.getElementById('caida-boton')
    if (c) c.remove(); if (k) k.remove()
  }
  function revisar() {
    if (!enEspanol()) return
    var t = temporada()
    if (t === actual) return
    quitar(); actual = null; montar()
  }
  var ruta = location.pathname + location.search
  function alCambiarRuta() {
    var r = location.pathname + location.search
    if (r === ruta) return
    ruta = r; setTimeout(revisar, 60)   // tras pintar la página nueva (lang, .v7-expedicion)
  }
  ;['pushState', 'replaceState'].forEach(function (m) {
    var orig = history[m]
    if (!orig) return
    history[m] = function () { var x = orig.apply(this, arguments); alCambiarRuta(); return x }
  })
  w.addEventListener('popstate', alCambiarRuta)

  function luego() { (w.requestIdleCallback || function (f) { setTimeout(f, 200) })(montar, { timeout: 3000 }) }
  if (d.readyState === 'complete') luego(); else w.addEventListener('load', luego)
  // La SPA cambia <html lang> al navegar: fuera la caída al salir del español, y vuelve al entrar.
  try {
    new MutationObserver(function () {
      var c = d.getElementById('caida'), k = d.getElementById('caida-boton')
      if (enEspanol()) { if (c) c.style.display = ''; if (k) k.style.display = ''; if (!k && d.readyState === 'complete') luego(); else if (!c && !apagada() && d.readyState === 'complete') luego() }
      else { if (c) c.style.display = 'none'; if (k) k.style.display = 'none' }
    }).observe(d.documentElement, { attributes: true, attributeFilter: ['lang'] })
  } catch (e) {}
})()
