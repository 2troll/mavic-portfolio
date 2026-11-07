// Fotos de las opiniones en las páginas de cada guía (Ferhat, Mario, Antonio, Iheb…).
// <script src="/resena-foto.js" data-guia="ferhat" data-lista="yorumListe" defer>
// Pone la foto pequeña (1000 px, rápida) en cada opinión que la tenga; al tocarla se
// abre la grande (hasta 4096 px) a pantalla completa. Sin JS no se ve la foto, el
// texto de la opinión sí (ya va en el HTML).
(() => {
  const s = document.currentScript
  const guia = s?.dataset.guia, ul = document.getElementById(s?.dataset.lista || '')
  if (!guia || !ul || ul.dataset.rf) return
  ul.dataset.rf = '1'

  if (!document.getElementById('rf-css')) {
    const st = document.createElement('style')
    st.id = 'rf-css'
    st.textContent = `.rf{display:block;margin:10px 0 4px;padding:0;border:0;background:none;cursor:zoom-in;border-radius:14px;overflow:hidden;width:100%;max-width:420px;aspect-ratio:4/3}
.rf img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s}.rf:hover img{transform:scale(1.04)}
.rf-caja{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.92);display:grid;place-items:center;padding:12px;cursor:zoom-out;opacity:0;transition:opacity .25s}
.rf-caja.on{opacity:1}.rf-caja img{max-width:100%;max-height:100%;object-fit:contain;border-radius:8px}
.rf-caja b{position:absolute;top:10px;right:14px;color:#fff;font:700 30px/1 system-ui}`
    document.head.appendChild(st)
  }

  const abrir = (src, chica) => {
    const c = document.createElement('div')
    c.className = 'rf-caja'
    c.setAttribute('role', 'dialog')
    c.innerHTML = '<b aria-hidden="true">×</b>'
    const img = new Image()
    img.alt = ''
    img.src = chica                 // la pequeña al instante…
    const g = new Image()
    g.onload = () => { img.src = src } // …y la grande en cuanto llega
    g.src = src
    c.appendChild(img)
    const cerrar = () => { c.remove(); document.removeEventListener('keydown', esc) }
    const esc = (e) => { if (e.key === 'Escape') cerrar() }
    c.addEventListener('click', cerrar)
    document.addEventListener('keydown', esc)
    document.body.appendChild(c)
    requestAnimationFrame(() => c.classList.add('on'))
  }

  const fotos = new Map()
  const poner = () => {
    for (const li of ul.querySelectorAll('li[data-id]')) {
      const f = fotos.get(li.dataset.id)
      if (!f || li.querySelector('.rf')) continue
      const b = document.createElement('button')
      b.type = 'button'
      b.className = 'rf'
      b.setAttribute('aria-label', 'Photo')
      const img = new Image()
      img.loading = 'lazy'
      img.alt = ''
      img.src = f.photo
      b.appendChild(img)
      b.addEventListener('click', () => abrir(f.photoFull || f.photo, f.photo))
      const estrellas = li.firstElementChild
      estrellas ? estrellas.after(b) : li.prepend(b)
    }
  }

  fetch('/api/resenas/publicas?guia=' + encodeURIComponent(guia), { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      for (const y of d?.reviews || []) if (y.id && y.photo) fotos.set(y.id, y)
      poner()
      // La propia página añade después las opiniones nuevas: las vigilamos.
      new MutationObserver(poner).observe(ul, { childList: true })
    })
    .catch(() => {})
})()
