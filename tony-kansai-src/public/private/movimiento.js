// Movimiento de /private/ (Mario), según el Figma «Cómo se implementa»:
// las filas entran escalonadas (70 ms entre una y otra, suben 16 px) al entrar
// la sección en pantalla; GSAP solo para lo sutil (título por líneas, precios
// que se descifran una vez). La zona «modo juego» (.oyun) añade inclinación y
// brillo holográfico a las cartas y el filtro con Flip.
// Sin JS o con «reducir movimiento» la página se ve entera y quieta.
(() => {
  const d = document, raiz = d.documentElement
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches
  const fino = matchMedia('(hover: hover) and (pointer: fine)').matches
  const g = window.gsap

  // Filtro del hub otaku: los botones solo aparecen con JS; Flip anima si puede.
  const filtro = d.querySelector('[data-filtro-grupo]')
  if (filtro) {
    const rejilla = d.getElementById(filtro.dataset.filtroGrupo)
    const cartas = rejilla ? [...rejilla.querySelectorAll('[data-tipo]')] : []
    filtro.hidden = false
    filtro.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-filtro]')
      if (!b) return
      const f = b.dataset.filtro
      filtro.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
      const estado = g && window.Flip && !quieto ? window.Flip.getState(cartas) : null
      cartas.forEach((c) => { c.hidden = f !== 'todo' && !c.dataset.tipo.split(' ').includes(f) })
      if (estado) window.Flip.from(estado, { duration: 0.5, ease: 'power2.inOut', absolute: true, onEnter: (el) => g.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.35 }), onLeave: (el) => g.to(el, { opacity: 0, duration: 0.25 }) })
    })
  }

  if (quieto) return

  // Filas de tour: se ocultan solo cuando hay JS y se revelan al entrar en pantalla.
  if ('IntersectionObserver' in window) {
    raiz.classList.add('js-rows')
    const mira = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('gor'); mira.unobserve(e.target) }
    }), { threshold: 0.12 })
    d.querySelectorAll('.liste').forEach((l) => {
      l.querySelectorAll('.tour-row').forEach((f, i) => f.style.setProperty('--i', i))
      mira.observe(l)
    })
  }

  // Lenis: scroll suave.
  let lenis = null
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.12 })
    const bucle = (t) => { lenis.raf(t); requestAnimationFrame(bucle) }
    requestAnimationFrame(bucle)
    d.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const destino = a.getAttribute('href').length > 1 && d.querySelector(a.getAttribute('href'))
      if (destino) { e.preventDefault(); lenis.scrollTo(destino, { offset: -72 }) }
    }))
  }

  if (!g) return
  if (window.ScrollTrigger) g.registerPlugin(window.ScrollTrigger)
  if (window.SplitText) g.registerPlugin(window.SplitText)
  if (window.ScrambleTextPlugin) g.registerPlugin(window.ScrambleTextPlugin)
  if (window.Flip) g.registerPlugin(window.Flip)
  if (lenis && window.ScrollTrigger) lenis.on('scroll', window.ScrollTrigger.update)

  // Título principal: aparece por líneas, sin rebotes.
  const h1 = d.querySelector('.kahraman h1')
  if (h1 && window.SplitText) {
    window.SplitText.create(h1, { type: 'lines', mask: 'lines', autoSplit: true, onSplit: (sp) => g.from(sp.lines, { yPercent: 100, duration: 0.9, ease: 'power3.out', stagger: 0.08 }) })
  }

  // Precios (y el WhatsApp del pie) se descifran una sola vez al verse; el
  // lector de pantalla lee el texto final (aria-label).
  if (window.ScrambleTextPlugin && window.ScrollTrigger) {
    d.querySelectorAll('[data-cifra]').forEach((el) => {
      if (el.closest('.calma')) return
      const final = el.textContent
      if (!el.closest('a,button')) el.setAttribute('aria-label', final)
      window.ScrollTrigger.create({ trigger: el, start: 'top 95%', once: true, onEnter: () => g.to(el, { duration: 0.9, scrambleText: { text: final, chars: '0123456789¥,', speed: 0.5 } }) })
    })
  }

  // Zona «modo juego»: cartas que se inclinan hacia el puntero y brillo
  // holográfico que lo sigue (--mx/--my). Solo con ratón.
  if (fino) {
    raiz.classList.add('js-tilt')
    d.querySelectorAll('.oyun .tcg-c').forEach((c) => {
      g.set(c, { transformPerspective: 900 })
      const rx = g.quickTo(c, 'rotationX', { duration: 0.4, ease: 'power3' }), ry = g.quickTo(c, 'rotationY', { duration: 0.4, ease: 'power3' })
      const holo = c.querySelector('.holo')
      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
        rx((0.5 - y) * 12); ry((x - 0.5) * 14)
        c.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`); c.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
        if (holo) holo.style.opacity = '.7'
      })
      c.addEventListener('pointerleave', () => { rx(0); ry(0); if (holo) holo.style.opacity = '' })
    })
  }
})()
