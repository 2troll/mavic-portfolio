/** Ejecuta `fn` cuando la página ya ha cargado y el navegador está libre: lo
 *  que no hace falta para pintar (diccionario, aviso de cookies) no compite
 *  con la foto de portada por la red ni por la CPU. */
export function trasCarga(fn: () => void): () => void {
  let id = 0, vivo = true
  const libre = () => {
    if (!vivo) return
    if ('requestIdleCallback' in window) id = window.requestIdleCallback(() => vivo && fn(), { timeout: 2500 })
    else id = setTimeout(() => vivo && fn(), 300) as unknown as number
  }
  if (document.readyState === 'complete') libre()
  else addEventListener('load', libre, { once: true })
  return () => {
    vivo = false
    removeEventListener('load', libre)
    if ('cancelIdleCallback' in window) window.cancelIdleCallback(id)
    clearTimeout(id)
  }
}
