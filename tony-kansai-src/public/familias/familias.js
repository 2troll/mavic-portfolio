// Generado por scripts/familias.mjs. Mejora progresiva: sin esto la página se ve entera.
(function () {
  var html = document.documentElement
  var reducido = matchMedia('(prefers-reduced-motion: reduce)').matches
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }

  // ------------------------------------------------ configurador (siempre que haya JS)
  function configurador() {
    var raiz = document.getElementById('disena'), datosEl = document.getElementById('cfg-datos')
    if (!raiz || !datosEl) return
    var D; try { D = JSON.parse(datosEl.textContent) } catch (e) { console.error('familias: cfg-datos no parsea', e); return }
    var pasos = $$('.cfg-paso', raiz), final = raiz.querySelector('.cfg-final')
    var barra = raiz.querySelector('.cfg-barra span'), estado = raiz.querySelector('.cfg-estado')
    var atras = raiz.querySelector('[data-atras]'), sig = raiz.querySelector('[data-sig]')
    if (!pasos.length || !final || !sig || !atras) return
    raiz.classList.add('cfg-js')
    var total = pasos.length, actual = 0, eleccion = {}, espera = null

    function valores(campo) { return eleccion[campo] || [] }
    function texto(campo) { return valores(campo).map(function (v) { return v.valor }).join(', ') }
    function pase() {
      $$('[data-pase]', raiz).forEach(function (dd) {
        var t = texto(dd.getAttribute('data-pase'))
        dd.textContent = t || dd.getAttribute('data-vacio')
        dd.classList.toggle('vacio', !t)
      })
    }
    function etiquetaSig() {
      if (actual >= total) return
      var hay = valores(pasos[actual].getAttribute('data-campo')).length
      sig.textContent = actual === total - 1 ? 'Ver el resumen' : (hay ? 'Siguiente' : 'Saltar este paso')
    }
    function mostrar(n, enfocar) {
      actual = Math.max(0, Math.min(n, total))
      pasos.forEach(function (p, k) { p.hidden = k !== actual })
      final.hidden = actual !== total
      barra.style.width = (Math.min(actual + 1, total) / total * 100) + '%'
      estado.textContent = actual < total ? 'Paso ' + (actual + 1) + ' de ' + total : 'Resumen del viaje'
      atras.hidden = actual === 0
      sig.hidden = actual === total
      etiquetaSig()
      if (actual === total) pintarFinal()
      var vis = actual < total ? pasos[actual] : final
      if (enfocar) {
        var h = vis.querySelector('h3'); if (h) h.focus({ preventScroll: true })
        var caja = raiz.querySelector('.cfg-caja'), r = caja.getBoundingClientRect()
        if (r.top < 0 || r.top > innerHeight * 0.5) window.scrollTo({ top: scrollY + r.top - 24, behavior: reducido ? 'auto' : 'smooth' })
      }
      if (window.gsap && !reducido) window.gsap.fromTo($$('.op, .cfg-reco li, .cfg-resumen > *', vis), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, ease: 'power3.out', stagger: 0.025, overwrite: true })
    }

    // Puntuación: palabras clave en el texto de cada página (sin acentos).
    var CLAVES = {
      templos: ['templo', 'santuario', 'cultura', 'castillo', 'tradicion', 'historia', 'kioto', 'nara'],
      naturaleza: ['naturaleza', 'montana', 'fuji', 'hakone', 'alpes', 'takayama', 'senderismo', 'bosque', 'kumano', 'lago'],
      ryokan: ['ryokan', 'onsen', 'aguas termales'],
      anime: ['anime', 'manga', 'akihabara', 'ghibli', 'pokemon', 'videojuego', 'otaku', 'nintendo'],
      parques: ['parque tematico', 'parques tematicos', 'universal', 'disney', 'usj', 'atracciones'],
      gastro: ['gastronomia', 'comer', 'comida', 'mercado', 'ramen', 'sushi', 'cocina', 'restaurante'],
      compras: ['compras', 'tiendas', 'shopping', 'artesania', 'mercadillo'],
      ninos: ['ninos', 'pequenos', 'bebe', 'carrito'],
      abuelos: ['abuelos', 'mayores', 'ritmo', 'tranquilo', 'suave', 'movilidad', 'descanso']
    }
    var EPOCA = [
      ['invierno', 'nieve', 'enero', 'febrero', 'diciembre', 'ano nuevo'], ['invierno', 'nieve', 'enero', 'febrero', 'diciembre'], ['primavera', 'sakura', 'cerezo', 'marzo', 'semana santa'],
      ['primavera', 'sakura', 'cerezo', 'abril', 'semana santa'], ['primavera', 'mayo', 'golden week'], ['verano', 'junio', 'lluvias'],
      ['verano', 'julio', 'vacaciones de verano'], ['verano', 'agosto', 'vacaciones de verano'], ['otono', 'septiembre'],
      ['otono', 'octubre', 'momiji'], ['otono', 'noviembre', 'momiji', 'koyo'], ['invierno', 'diciembre', 'nieve', 'navidad']
    ]
    function hits(t, lista) { var n = 0; lista.forEach(function (w) { if (t.indexOf(w) !== -1) n++ }); return n }
    function recomendar() {
      var gustos = valores('gustos').map(function (v) { return v.clave })
      var dias = +((valores('dias')[0] || {}).clave || 0)
      var mes = (valores('mes')[0] || {}).clave
      var mesN = mes && mes !== 'nose' ? +mes : -1
      var lista = D.paginas.map(function (p) {
        var s = { itinerario: 3, destino: 2, temporada: 1, ocasion: 1 }[p.cat] || 0
        gustos.forEach(function (g) { s += 3 * Math.min(2, hits(p.txt, CLAVES[g] || [])) })
        if (dias && p.ndias && Math.abs(p.ndias - dias) <= 3) s += 6
        if (dias && p.txt.indexOf(dias + ' dias') !== -1) s += 4
        if (mesN >= 0 && p.cat === 'temporada') s += hits(p.txt, EPOCA[mesN]) ? 8 : -2
        if (gustos.indexOf('ninos') !== -1 && p.slug === 'viaje-japon-con-ninos') s += 4
        if (gustos.indexOf('abuelos') !== -1 && p.txt.indexOf('abuelos') !== -1) s += 3
        return { p: p, s: s }
      }).filter(function (x) { return ['itinerario', 'destino', 'temporada', 'ocasion'].indexOf(x.p.cat) !== -1 })
      lista.sort(function (a, b) { return b.s - a.s })
      var elegidas = lista.slice(0, 2).map(function (x) { return x.p })
      var origen = (valores('origen')[0] || {}).clave
      var deOrigen = origen && D.paginas.filter(function (p) { return p.slug === 'viaje-japon-desde-' + origen })[0]
      var personas = (valores('personas')[0] || {}).clave
      var grupo = personas === 'mas10' && D.paginas.filter(function (p) { return p.slug === 'viaje-japon-grupo-10-personas' })[0]
      var extra = deOrigen || grupo
      if (extra) elegidas.push(extra)
      else if (lista[2]) elegidas.push(lista[2].p)
      return elegidas
    }
    function pintarFinal() {
      var dl = final.querySelector('.cfg-resumen'); dl.innerHTML = ''
      pasos.forEach(function (p, k) {
        var dt = document.createElement('dt'); dt.textContent = p.getAttribute('data-etiqueta')
        var dd = document.createElement('dd'); dd.textContent = texto(p.getAttribute('data-campo')) || 'Por decidir'
        var c = document.createElement('div'); c.className = 'cambiar'
        var b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-ir', k); b.textContent = 'Cambiar'
        b.setAttribute('aria-label', 'Cambiar: ' + dt.textContent)
        c.appendChild(b); dl.appendChild(dt); dl.appendChild(dd); dl.appendChild(c)
      })
      var reco = recomendar(), ul = final.querySelector('.cfg-reco'); ul.innerHTML = ''
      reco.forEach(function (p) {
        var li = document.createElement('li'), a = document.createElement('a'); a.href = p.href
        var im = document.createElement('span'); im.className = 'im'; if (p.img) im.style.backgroundImage = 'url(' + p.img + ')'
        var tx = document.createElement('span'); tx.className = 'tx'
        var sm = document.createElement('small'); sm.textContent = p.catNombre
        var st = document.createElement('strong'); st.textContent = p.h1
        tx.appendChild(sm); tx.appendChild(st); a.appendChild(im); a.appendChild(tx); li.appendChild(a); ul.appendChild(li)
      })
      var l = ['Hola ' + D.nombre + ', queremos organizar un viaje a Japón.', '']
      pasos.forEach(function (p) { l.push('· ' + p.getAttribute('data-etiqueta') + ': ' + (texto(p.getAttribute('data-campo')) || 'por decidir')) })
      if (reco.length) { l.push('', 'Guías que nos interesan:'); reco.forEach(function (p) { l.push('· ' + p.h1 + ' (' + D.base + p.href + ')') }) }
      l.push('', 'Quedamos a la espera de una propuesta. Gracias.')
      final.querySelector('[data-wa]').href = 'https://wa.me/' + D.wa + '?text=' + encodeURIComponent(l.join('\n'))
    }

    raiz.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || !raiz.contains(b)) return
      if (b.classList.contains('op')) {
        var paso = b.closest('.cfg-paso'), campo = paso.getAttribute('data-campo'), varios = paso.getAttribute('data-tipo') === 'varios'
        var ops = $$('.op', paso)
        if (varios) b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true')
        else ops.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false') })
        eleccion[campo] = ops.filter(function (o) { return o.getAttribute('aria-pressed') === 'true' }).map(function (o) { return { valor: o.getAttribute('data-valor'), clave: o.getAttribute('data-clave') } })
        pase(); etiquetaSig()
        clearTimeout(espera)
        if (!varios) espera = setTimeout(function () { mostrar(actual + 1, true) }, 380)
      } else if (b.hasAttribute('data-sig')) mostrar(actual + 1, true)
      else if (b.hasAttribute('data-atras')) mostrar(actual - 1, true)
      else if (b.hasAttribute('data-ir')) mostrar(+b.getAttribute('data-ir'), true)
      else if (b.hasAttribute('data-reinicio')) {
        eleccion = {}; $$('.op', raiz).forEach(function (o) { o.setAttribute('aria-pressed', 'false') }); pase(); mostrar(0, true)
      }
    })
    pase(); mostrar(0, false)
  }

  // ------------------------------------------------ filas horizontales: flechas en escritorio
  function filas() {
    $$('.fila').forEach(function (ul) {
      var cab = document.querySelector('[data-fila="' + ul.id + '"]'); if (!cab) return
      var bt = document.createElement('div'); bt.className = 'fila-bt'
      var flecha = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
      bt.innerHTML = '<button type="button" class="izq" aria-label="Anteriores">' + flecha + '</button><button type="button" aria-label="Siguientes">' + flecha + '</button>'
      cab.appendChild(bt)
      var b = bt.querySelectorAll('button')
      function paso() { var li = ul.querySelector('li'); return li ? li.getBoundingClientRect().width + 16 : 300 }
      function estado() { b[0].disabled = ul.scrollLeft < 4; b[1].disabled = ul.scrollLeft + ul.clientWidth >= ul.scrollWidth - 4 }
      b[0].addEventListener('click', function () { ul.scrollBy({ left: -paso(), behavior: reducido ? 'auto' : 'smooth' }) })
      b[1].addEventListener('click', function () { ul.scrollBy({ left: paso(), behavior: reducido ? 'auto' : 'smooth' }) })
      ul.addEventListener('scroll', estado, { passive: true }); addEventListener('resize', estado); estado()
    })
  }

  // ------------------------------------------------ mapa: la lista de paradas ilumina su punto
  function paradas() {
    $$('[data-parada]').forEach(function (li) {
      var p = document.querySelector('.mapa-grande .punto[data-k="' + li.getAttribute('data-parada') + '"]'); if (!p) return
      function on() { p.classList.add('foco') } function off() { p.classList.remove('foco') }
      li.addEventListener('mouseenter', on); li.addEventListener('mouseleave', off); li.addEventListener('focusin', on); li.addEventListener('focusout', off)
    })
  }

  // El botón flotante de WhatsApp se esconde donde ya hay uno propio (configurador, caja lateral, pie) para no tapar nada.
  function waFijo() {
    var b = document.querySelector('.wa-fijo'); if (!b || !('IntersectionObserver' in window)) return
    var zonas = $$('#disena, footer, .lateral .caja'), vistas = new Set()
    if (!zonas.length) return
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) vistas.add(e.target); else vistas.delete(e.target) })
      b.classList.toggle('oculto', vistas.size > 0)
    }, { rootMargin: '0px 0px -60px 0px' })
    zonas.forEach(function (z) { io.observe(z) })
  }
  configurador(); filas(); paradas(); waFijo()
  if (!html.classList.contains('js-anim')) return

  // ------------------------------------------------ animación (GSAP + ScrollTrigger + SplitText + Lenis)
  var CDN = 'https://cdn.jsdelivr.net/npm/', GS = CDN + 'gsap@3.15.0/dist/'
  function cargar(src) { return new Promise(function (ok, mal) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = mal; document.head.appendChild(s) }) }
  Promise.all([cargar(GS + 'gsap.min.js'), cargar(CDN + 'lenis@1.3.27/dist/lenis.min.js')])
    .then(function () { return Promise.all([cargar(GS + 'ScrollTrigger.min.js'), cargar(GS + 'SplitText.min.js')]) })
    .then(iniciar)
    .catch(function () { html.classList.remove('js-anim') })

  function iniciar() {
    window.__famAnim = true
    var gsap = window.gsap, ST = window.ScrollTrigger, Split = window.SplitText
    gsap.registerPlugin(ST, Split)
    var lenis = new window.Lenis({ anchors: { offset: -16 }, stopInertiaOnNavigate: true, allowNestedScroll: true })
    lenis.on('scroll', ST.update)
    gsap.ticker.add(function (t) { lenis.raf(t * 1000) })
    gsap.ticker.lagSmoothing(0)
    var q = function (s) { return gsap.utils.toArray(s) }

    // Hero: la foto se acerca, sigue al ratón y se desplaza con el scroll.
    var hero = document.querySelector('.hero'), foto = document.querySelector('.hero .fondo > *')
    if (foto) {
      gsap.fromTo(foto, { scale: 1.16 }, { scale: 1.05, duration: 2.6, ease: 'expo.out' })
      gsap.to(foto, { yPercent: 14, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
      if (matchMedia('(pointer: fine)').matches) {
        var xTo = gsap.quickTo(foto, 'x', { duration: 1.4, ease: 'power3' }), yTo = gsap.quickTo(foto, 'y', { duration: 1.4, ease: 'power3' })
        hero.addEventListener('pointermove', function (e) {
          var r = hero.getBoundingClientRect()
          xTo(((e.clientX - r.left) / r.width - 0.5) * -34); yTo(((e.clientY - r.top) / r.height - 0.5) * -22)
        })
      }
      gsap.to('.hero .kap', { yPercent: -10, autoAlpha: 0.25, ease: 'none', scrollTrigger: { trigger: hero, start: 'center center', end: 'bottom top', scrub: true } })
    }
    // Titular: letras que suben desde una máscara por palabra (SplitText).
    var h1 = document.querySelector('.hero h1')
    if (h1) Split.create(h1, { type: 'words,chars', wordsClass: 'pal', mask: 'words', autoSplit: true, onSplit: function (self) {
      return gsap.from(self.chars, { yPercent: 118, rotate: 4, duration: 1.25, ease: 'expo.out', stagger: 0.014, delay: 0.15 })
    } })
    var entra = q('.hero .entra')
    gsap.set(entra, { y: 26, autoAlpha: 0 })
    html.classList.add('anim-listo')
    gsap.to(entra, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', stagger: 0.09, delay: 0.6 })
    var cinta = document.querySelector('.cinta')
    if (cinta) gsap.from(cinta, { yPercent: 100, autoAlpha: 0, duration: 1.2, ease: 'expo.out', delay: 0.9 })

    // Gancho rotatorio: una frase cada 2,8 s.
    var g = q('.g-rot > span')
    if (g.length > 1) {
      gsap.set(g.slice(1), { yPercent: 100, autoAlpha: 0 })
      var tl = gsap.timeline({ repeat: -1, delay: 2.4 })
      g.forEach(function (el, i) {
        var sig = g[(i + 1) % g.length]
        tl.to(el, { yPercent: -100, autoAlpha: 0, duration: 0.7, ease: 'power3.in' }, '+=2.1')
          .fromTo(sig, { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', immediateRender: false }, '-=0.25')
      })
    }

    // Titulares de sección: líneas que suben desde una máscara.
    q('.seccion h2, .mapa-s h2, .cfg h2').forEach(function (h) {
      Split.create(h, { type: 'lines', mask: 'lines', autoSplit: true, onSplit: function (self) {
        return gsap.from(self.lines, { yPercent: 105, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: h, start: 'top 88%', once: true } })
      } })
    })

    // Aparición escalonada de tarjetas y bloques.
    function aparecer(sel, extra) {
      var els = q(sel); if (!els.length) return
      gsap.set(els, Object.assign({ y: 40, autoAlpha: 0 }, extra && extra.desde))
      ST.batch(els, { start: 'top 90%', once: true, onEnter: function (b) {
        gsap.to(b, Object.assign({ y: 0, x: 0, rotation: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', stagger: 0.08, overwrite: true }, extra && extra.hasta))
      } })
    }
    aparecer('.servicios > li')
    aparecer('.guias > li', { desde: { y: 30 } })
    aparecer('.fila > li', { desde: { y: 0, x: 80 } })
    aparecer('.siono > div', { desde: { y: 50 } })
    aparecer('.datos > div', { desde: { y: 20 } })
    aparecer('.cfg-caja, .cfg-pase, .cats', { desde: { y: 50 } })
    aparecer('.paradas li', { desde: { y: 0, x: -24 } })
    // Billetes: se reparten sobre la bandeja con un giro leve, y luego cae el sello.
    q('.billete').forEach(function (b, i) {
      gsap.set(b, { y: 70, rotation: i % 2 ? 2.5 : -2.5, autoAlpha: 0 })
      var s = b.querySelector('.sello'); if (s) gsap.set(s, { scale: 1.8, autoAlpha: 0 })
      ST.create({ trigger: b, start: 'top 86%', once: true, onEnter: function () {
        gsap.to(b, { y: 0, rotation: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out' })
        if (s) gsap.to(s, { scale: 1, autoAlpha: 1, rotation: -12, duration: 0.55, ease: 'back.out(2.2)', delay: 0.55 })
      } })
    })

    // Líneas verticales (pasos y día a día): se dibujan con el scroll y cada punto se enciende al pasar.
    function linea(lin, lista, items) {
      var l = document.querySelector(lin); if (!l) return
      gsap.fromTo(l, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: lista, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 } })
      q(items).forEach(function (li) {
        ST.create({ trigger: li, start: 'top 68%', end: 'max', onToggle: function (st) { li.classList.toggle('activo', st.isActive || st.progress === 1) } })
      })
    }
    linea('.p-linea span', '.pasos', '.pasos > li')
    linea('.dias-linea span', '.dias', '.dias > li')
    aparecer('.dias > li', { desde: { y: 0, x: 36 } })

    // Mapas: la ruta se dibuja tramo a tramo (stroke-dashoffset) y cada parada aparece al llegar.
    q('.mapa svg').forEach(function (svg) {
      var segs = svg.querySelectorAll('.seg'), puntos = svg.querySelectorAll('.punto'), grande = svg.classList.contains('mapa-grande')
      gsap.set(segs, { strokeDasharray: 1, strokeDashoffset: 1 })
      gsap.set(svg.querySelectorAll('.punto circle'), { scale: 0, transformOrigin: '50% 50%' })
      gsap.set(svg.querySelectorAll('.punto text'), { autoAlpha: 0 })
      var tl = gsap.timeline({ scrollTrigger: grande
        ? { trigger: svg, start: 'top 80%', end: 'bottom 55%', scrub: 0.8 }
        : { trigger: svg, start: 'top 85%', once: true } })
      Array.prototype.forEach.call(puntos, function (p, i) {
        if (i > 0) tl.to(segs[i - 1], { strokeDashoffset: 0, duration: 1, ease: grande ? 'none' : 'power1.inOut' })
        tl.to(p.querySelectorAll('circle'), { scale: 1, duration: 0.4, ease: 'back.out(3)', stagger: 0.05 }, i > 0 ? '-=0.15' : 0)
          .to(p.querySelector('text'), { autoAlpha: 1, duration: 0.35 }, '<')
      })
      if (!grande) tl.timeScale(Math.max(1, puntos.length / 2.2))
    })

    // Corea: el rótulo de fondo se desliza despacio.
    var k = document.querySelector('.corea .kanji')
    if (k) gsap.fromTo(k, { xPercent: 8 }, { xPercent: -14, ease: 'none', scrollTrigger: { trigger: '.corea', start: 'top bottom', end: 'bottom top', scrub: true } })

    window.addEventListener('load', function () { ST.refresh() })
  }
})()
