// Decodifica el DEM horneado (PNG del GSI) fuera del hilo principal: eran
// ~300 ms de CPU por monte en móvil, ocho veces, mientras la página cargaba.
interface Pide { url: string; n: number; min: number; escala: number }

self.onmessage = async (e: MessageEvent<Pide>) => {
  const { url, n, min, escala } = e.data
  try {
    const blob = await fetch(url).then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
    const dem = await createImageBitmap(blob, { colorSpaceConversion: 'none', premultiplyAlpha: 'none' })
    const c = new OffscreenCanvas(dem.width, dem.height)
    const g = c.getContext('2d', { willReadFrequently: true })!
    g.drawImage(dem, 0, 0)
    const px = g.getImageData(0, 0, c.width, c.height).data
    const paso = c.width / n
    const alturas = new Float32Array(n * n)
    for (let fila = 0; fila < n; fila++) {
      for (let col = 0; col < n; col++) {
        const i = (Math.floor(fila * paso + paso / 2) * c.width + Math.floor(col * paso + paso / 2)) * 4
        const x = px[i] * 65536 + px[i + 1] * 256 + px[i + 2]
        // Codificación del dem_png del GSI: 2^23 = sin dato (mar).
        const m = x === 8388608 ? min : (x > 8388608 ? x - 16777216 : x) * 0.01
        alturas[fila * n + col] = (m - min) * escala
      }
    }
    ;(self as unknown as Worker).postMessage({ url, alturas }, [alturas.buffer])
  } catch (err) {
    ;(self as unknown as Worker).postMessage({ url, error: String(err) })
  }
}
