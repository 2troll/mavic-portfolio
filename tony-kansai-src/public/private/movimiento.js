// Interfaz de juego de /private/ (Mario). Sin JS todo funciona igual: el menú
// es un <details> con enlaces, la página abre en su modo por defecto y nada se
// oculta. Con JS: menú de comandos tipo JRPG (↑↓ mover, ○ = O/Enter/Espacio
// elegir, × = X/Escape/Retroceso volver), interruptor FAN/EASY recordado,
// «PRESS ○ TO START», filas escalonadas, títulos que aparecen en píxeles,
// precios que se descifran, filtro con Flip y cartas holográficas.
(() => {
  const d = document, raiz = d.documentElement
  const quieto = () => matchMedia('(prefers-reduced-motion: reduce)').matches || raiz.classList.contains('easy')
  const fino = matchMedia('(hover: hover) and (pointer: fine)').matches
  const g = window.gsap
  const guarda = (m) => { try { localStorage.setItem('mario-modo', m) } catch (e) { /* modo privado: sin memoria */ } }
  const ponModo = (m) => { raiz.classList.remove('fan', 'easy'); raiz.classList.add(m); guarda(m); pintaModo() }

  // ---- Interruptor de modo ----
  const modoBtn = d.querySelector('[data-modo-btn]')
  const pintaModo = () => { if (modoBtn) modoBtn.setAttribute('aria-pressed', String(raiz.classList.contains('easy'))) }
  if (modoBtn) {
    modoBtn.hidden = false
    pintaModo()
    modoBtn.addEventListener('click', () => ponModo(raiz.classList.contains('easy') ? 'fan' : 'easy'))
  }
  // SELECT PLAYER: elegir puerta también fija el modo.
  d.querySelectorAll('[data-modo-sec]').forEach((a) => a.addEventListener('click', () => guarda(a.dataset.modoSec)))

  // ---- Menú de comandos ----
  const menu = d.querySelector('details.menu')
  if (menu) {
    const sum = menu.querySelector('summary'), pan = menu.querySelector('.menu-pan')
    const alt = pan.querySelector('.alt-ac'), sub = pan.querySelector('#bolgeler')
    // Con JS la lista de regiones empieza plegada (sin JS se ve entera).
    if (alt && sub) {
      sub.hidden = true; alt.setAttribute('aria-expanded', 'false')
      alt.addEventListener('click', () => { const abre = sub.hidden; sub.hidden = !abre; alt.setAttribute('aria-expanded', String(abre)); if (abre) sub.querySelector('a').focus() })
    }
    const items = () => [...pan.querySelectorAll('.komut a, .komut button')].filter((x) => x.offsetParent !== null)
    const marca = (el) => { items().forEach((x) => x.classList.toggle('imlec', x === el)); el.focus() }
    const cierra = (devuelve = true) => { menu.open = false; if (devuelve) sum.focus() }
    sum.setAttribute('aria-expanded', 'false')
    menu.addEventListener('toggle', () => {
      sum.setAttribute('aria-expanded', String(menu.open))
      if (menu.open) {
        requestAnimationFrame(() => marca(items()[0]))
        if (g && !quieto()) g.from(pan, { scale: 0.92, opacity: 0, duration: 0.24, ease: 'steps(4)', transformOrigin: 'top right' })
      }
    })
    pan.addEventListener('mouseover', (e) => { const x = e.target.closest('.komut a, .komut button'); if (x) marca(x) })
    menu.addEventListener('keydown', (e) => {
      if (!menu.open) return
      const lista = items(), i = lista.indexOf(d.activeElement), k = e.key
      if (k === 'ArrowDown' || k === 'ArrowUp') {
        e.preventDefault()
        marca(lista[(i + (k === 'ArrowDown' ? 1 : -1) + lista.length) % lista.length])
      } else if ((k === 'o' || k === 'O' || k === ' ' || k === 'Enter') && i >= 0) {
        e.preventDefault(); lista[i].click()
      } else if (k === 'x' || k === 'X' || k === 'Escape' || k === 'Backspace') {
        e.preventDefault()
        // × vuelve atrás: primero cierra el submenú, luego el menú.
        if (sub && !sub.hidden && sub.contains(d.activeElement)) { alt.click(); marca(alt) } else cierra()
      } else if (k === 'Tab') {
        // Foco atrapado dentro de la ventana mientras está abierta.
        e.preventDefault()
        marca(lista[(i + (e.shiftKey ? -1 : 1) + lista.length) % lista.length])
      }
    })
    d.addEventListener('click', (e) => { if (menu.open && !menu.contains(e.target)) cierra(false) })
  }

  // ---- PRESS ○ TO START ----
  const press = d.querySelector('[data-press]')
  if (press) {
    const empieza = (e) => {
      if (e) e.preventDefault()
      const sel = d.getElementById('select')
      if (sel) { (lenis ? lenis.scrollTo(sel, { offset: -88 }) : sel.scrollIntoView()); const k = sel.querySelector('.kapi'); if (k) setTimeout(() => k.focus({ preventScroll: true }), 500) }
    }
    press.addEventListener('click', empieza)
    d.addEventListener('keydown', (e) => {
      const t = e.target
      if (menu && menu.open) return
      if (t.closest && t.closest('a,button,input,textarea,select,summary')) return
      if (e.key === 'o' || e.key === 'O' || e.key === 'Enter') empieza(e)
    })
  }

  // ---- Filtro del hub otaku (Flip si está disponible) ----
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
      const estado = g && window.Flip && !quieto() ? window.Flip.getState(cartas) : null
      cartas.forEach((c) => { c.hidden = f !== 'todo' && !c.dataset.tipo.split(' ').includes(f) })
      if (estado) window.Flip.from(estado, { duration: 0.45, ease: 'power2.inOut', absolute: true, onEnter: (el) => g.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3 }), onLeave: (el) => g.to(el, { opacity: 0, duration: 0.2 }) })
    })
  }

  // ---- Filas escalonadas (losetas MAP SELECT) ----
  if ('IntersectionObserver' in window && !quieto()) {
    raiz.classList.add('js-rows')
    const mira = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('gor'); mira.unobserve(e.target) } }), { threshold: 0.1 })
    d.querySelectorAll('.liste').forEach((l) => { l.querySelectorAll('.tour-row').forEach((f, i) => f.style.setProperty('--i', i)); mira.observe(l) })
  }

  // ---- Lenis ----
  let lenis = null
  if (window.Lenis && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    lenis = new window.Lenis({ lerp: 0.12 })
    const bucle = (t) => { lenis.raf(t); requestAnimationFrame(bucle) }
    requestAnimationFrame(bucle)
    d.querySelectorAll('a[href^="#"]:not([data-press])').forEach((a) => a.addEventListener('click', (e) => {
      const h = a.getAttribute('href'), destino = h.length > 1 && d.querySelector(h)
      if (destino) { e.preventDefault(); lenis.scrollTo(destino, { offset: -88 }) }
    }))
  }

  if (!g || quieto()) return
  const ST = window.ScrollTrigger
  if (ST) g.registerPlugin(ST)
  if (window.ScrambleTextPlugin) g.registerPlugin(window.ScrambleTextPlugin)
  if (window.Flip) g.registerPlugin(window.Flip)
  if (lenis && ST) lenis.on('scroll', ST.update)

  // Placas de título: «pop» en escalones de píxel al entrar.
  if (ST) {
    d.querySelectorAll('main h2:not(.menu-pan h2)').forEach((h) => {
      g.from(h, { scale: 0.9, opacity: 0, duration: 0.4, ease: 'steps(4)', transformOrigin: 'left center', scrollTrigger: { trigger: h, start: 'top 90%', once: true } })
    })
  }

  // Precios y el WhatsApp del pie se descifran una vez (el lector lee aria-label).
  if (window.ScrambleTextPlugin && ST) {
    d.querySelectorAll('[data-cifra]').forEach((el) => {
      if (el.closest('.calma')) return
      const final = el.textContent
      if (!el.closest('a,button')) el.setAttribute('aria-label', final)
      ST.create({ trigger: el, start: 'top 95%', once: true, onEnter: () => g.to(el, { duration: 0.8, scrambleText: { text: final, chars: '0123456789¥', speed: 0.5 } }) })
    })
  }

  // Cartas holográficas de la zona otaku: inclinación y brillo con el ratón.
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
