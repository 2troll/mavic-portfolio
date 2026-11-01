// Movimiento de /tr/: Lenis (scroll suave) + GSAP ScrollTrigger.
// Sin JS o con «reducir movimiento» la página se ve entera y quieta:
// la clase .hz (que oculta para animar) solo se pone si todo ha cargado.
(() => {
  const g = window.gsap, ST = window.ScrollTrigger
  if (!g || !ST || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  g.registerPlugin(ST)

  if (window.Lenis) {
    const lenis = new window.Lenis({ lerp: 0.1 })
    lenis.on('scroll', ST.update)
    g.ticker.add((t) => lenis.raf(t * 1000))
    g.ticker.lagSmoothing(0)
    document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const d = document.querySelector(a.getAttribute('href'))
      if (d) { e.preventDefault(); lenis.scrollTo(d, { offset: -20 }) }
    }))
  }

  // Portada: el texto sube por partes y la foto se mueve más despacio que el scroll.
  const ortu = document.querySelector('.kahraman .ortu .kap')
  if (ortu) g.from(ortu.children, { y: 36, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.15 })
  const foto = document.querySelector('.kahraman > img')
  if (foto) g.to(foto, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.kahraman', start: 'top top', end: 'bottom top', scrub: true } })

  // Entradas al hacer scroll: tarjetas, títulos, listas y reseñas.
  document.documentElement.classList.add('hz')
  const gir = g.utils.toArray('main h2, .izgara > li, ul.ozet > li, ul.yorumlar > li, details, .cevap, main ol > li')
  gir.forEach((el) => el.classList.add('gir'))
  ST.batch(gir, {
    start: 'top 90%', once: true,
    onEnter: (b) => g.to(b, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, overwrite: true }),
  })
  // Lo que ya está a la vista al cargar no debe quedarse oculto.
  ST.refresh()

  // Cifras que cuentan desde 0.
  g.utils.toArray('[data-say]').forEach((el) => {
    const fin = +el.dataset.say, o = { v: 0 }
    g.to(o, { v: fin, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate: () => { el.textContent = Math.round(o.v) } })
  })

  // Botones «imán»: siguen un poco al ratón (solo con ratón de verdad).
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.btn, .wa-sabit, .btn2').forEach((b) => {
      const x = g.quickTo(b, 'x', { duration: 0.4, ease: 'power3' }), y = g.quickTo(b, 'y', { duration: 0.4, ease: 'power3' })
      b.addEventListener('mousemove', (e) => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * 0.3); y((e.clientY - r.top - r.height / 2) * 0.3) })
      b.addEventListener('mouseleave', () => { x(0); y(0) })
    })
  }
})()
