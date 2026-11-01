// Generado por scripts/familias.mjs. Mejora progresiva: sin esto la página se ve entera.
(function () {
  var html = document.documentElement
  if (!html.classList.contains('js-anim')) return
  var CDN = 'https://cdn.jsdelivr.net/npm/'
  function cargar(src) { return new Promise(function (ok, mal) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = mal; document.head.appendChild(s) }) }
  Promise.all([cargar(CDN + 'gsap@3.15.0/dist/gsap.min.js'), cargar(CDN + 'lenis@1.3.27/dist/lenis.min.js')])
    .then(function () { return cargar(CDN + 'gsap@3.15.0/dist/ScrollTrigger.min.js') })
    .then(iniciar)
    .catch(function () { html.classList.remove('js-anim') })

  function iniciar() {
    window.__famAnim = true
    html.classList.add('js-anim')
    var gsap = window.gsap, ST = window.ScrollTrigger
    gsap.registerPlugin(ST)
    var lenis = new window.Lenis({ anchors: { offset: -16 }, stopInertiaOnNavigate: true })
    lenis.on('scroll', ST.update)
    gsap.ticker.add(function (t) { lenis.raf(t * 1000) })
    gsap.ticker.lagSmoothing(0)
    var q = function (s) { return gsap.utils.toArray(s) }

    // Hero: la foto se acerca, el titular sube palabra a palabra y el resto entra después.
    var foto = document.querySelector('.hero .fondo > *')
    if (foto) {
      gsap.fromTo(foto, { scale: 1.12 }, { scale: 1, duration: 2.4, ease: 'expo.out' })
      gsap.to(foto, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    }
    var palabras = q('.hero h1 .w > span'), entra = q('.hero .entra')
    gsap.set(palabras, { y: 0, yPercent: 105 })
    gsap.set(entra, { y: 26, autoAlpha: 0 })
    html.classList.add('anim-listo')
    gsap.to(palabras, { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.055, delay: 0.1 })
    gsap.to(entra, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', stagger: 0.09, delay: 0.55 })

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

    // Aparición escalonada de tarjetas y bloques.
    function aparecer(sel, extra) {
      var els = q(sel); if (!els.length) return
      gsap.set(els, Object.assign({ y: 40, autoAlpha: 0 }, extra && extra.desde))
      ST.batch(els, { start: 'top 88%', once: true, onEnter: function (b) {
        gsap.to(b, Object.assign({ y: 0, x: 0, rotation: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', stagger: 0.09, overwrite: true }, extra && extra.hasta))
      } })
    }
    aparecer('.servicios > li')
    aparecer('.guias > li', { desde: { y: 30 } })
    aparecer('.siono > div', { desde: { y: 50 } })
    aparecer('.datos > div', { desde: { y: 20 } })
    // Billetes: se reparten sobre la bandeja con un giro leve, y luego cae el sello.
    q('.billete').forEach(function (b, i) {
      gsap.set(b, { y: 70, rotation: i % 2 ? 2.5 : -2.5, autoAlpha: 0 })
      var s = b.querySelector('.sello'); if (s) gsap.set(s, { scale: 1.8, autoAlpha: 0 })
      ST.create({ trigger: b, start: 'top 86%', once: true, onEnter: function () {
        gsap.to(b, { y: 0, rotation: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out' })
        if (s) gsap.to(s, { scale: 1, autoAlpha: 1, rotation: -12, duration: 0.55, ease: 'back.out(2.2)', delay: 0.55 })
      } })
    })

    // Pasos: la línea se dibuja con el scroll y cada número se enciende al pasar.
    var linea = document.querySelector('.p-linea span')
    if (linea) {
      gsap.fromTo(linea, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.pasos', start: 'top 70%', end: 'bottom 60%', scrub: 0.6 } })
      q('.pasos > li').forEach(function (li) {
        ST.create({ trigger: li, start: 'top 68%', onToggle: function (st) { li.classList.toggle('activo', st.isActive || st.progress === 1) }, end: 'max' })
      })
    }
    // Corea: el rótulo de fondo se desliza despacio.
    var k = document.querySelector('.corea .kanji')
    if (k) gsap.fromTo(k, { xPercent: 8 }, { xPercent: -14, ease: 'none', scrollTrigger: { trigger: '.corea', start: 'top bottom', end: 'bottom top', scrub: true } })

    window.addEventListener('load', function () { ST.refresh() })
  }
})()
