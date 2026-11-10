// Movimiento de /es/leyendas/: Lenis + GSAP ScrollTrigger y la linterna de la portada.
// Sin JS o con «reducir movimiento» todo se ve quieto y entero (.mv solo se pone si GSAP cargó).
(() => {
  const portada = document.getElementById('portada')
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches
  // Linterna: la zona iluminada sigue al ratón o al dedo
  if (portada && !reducir) {
    const mover = (x, y) => {
      const r = portada.getBoundingClientRect()
      portada.style.setProperty('--x', ((x - r.left) / r.width * 100) + '%')
      portada.style.setProperty('--y', ((y - r.top) / r.height * 100) + '%')
    }
    portada.addEventListener('pointermove', (e) => mover(e.clientX, e.clientY))
  }
  const g = window.gsap, ST = window.ScrollTrigger
  if (!g || !ST || reducir) return
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
  const kap = portada && portada.querySelector('.kap')
  if (kap) g.from(kap.children, { y: 36, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: 0.14, delay: 0.1 })
  const foto = portada && portada.querySelector('img')
  if (foto) g.to(foto, { yPercent: -10, ease: 'none', scrollTrigger: { trigger: portada, start: 'top top', end: 'bottom top', scrub: true } })
  document.documentElement.classList.add('mv')
  ST.batch('.ent', { start: 'top 88%', once: true, onEnter: (els) => g.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1 }) })
  // Las fotos de cada capítulo se «acercan» al pasar: entras en la escena
  g.utils.toArray('.cap figure img').forEach((img) => g.to(img, { scale: 1, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } }))
})()
