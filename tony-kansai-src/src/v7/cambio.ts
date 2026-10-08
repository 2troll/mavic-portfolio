// Cambio del yen al día (open.er-api.com, gratis y sin clave), guardado en la
// sesión para no pedirlo en cada página. Sin conexión, la web se queda en yenes.
import { useEffect, useState } from 'react'

export function useCambio(divisas: string[]) {
  const [tasas, setTasas] = useState<Record<string, number> | null>(null)
  useEffect(() => {
    const CLAVE = 'v7-cambio-jpy'
    try {
      const guardado = JSON.parse(sessionStorage.getItem(CLAVE) || 'null')
      if (guardado?.rates) { setTasas(guardado.rates); return }
    } catch { /* almacenamiento bloqueado */ }
    const ctrl = new AbortController()
    fetch('https://open.er-api.com/v6/latest/JPY', { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => {
        if (d?.result !== 'success') return
        setTasas(d.rates)
        try { sessionStorage.setItem(CLAVE, JSON.stringify({ rates: d.rates })) } catch { /* nada */ }
      })
      .catch(() => { /* sin cambio: se queda sólo en yenes */ })
    return () => ctrl.abort()
  }, [])
  return tasas ? divisas.filter((d) => tasas[d]).map((d) => ({ divisa: d, tasa: tasas[d] })) : []
}
