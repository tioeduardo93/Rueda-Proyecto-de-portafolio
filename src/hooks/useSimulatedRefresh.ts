import { useEffect, useState } from 'react'

/**
 * Devuelve `true` durante `ms` cada vez que cambia `key`. El listado filtra en local, pero el diseño
 * muestra esqueletos al cambiar un filtro discreto: así se imita el tiempo de respuesta de la API.
 */
export function useSimulatedRefresh(key: string, ms: number): boolean {
  const [settledKey, setSettledKey] = useState(key)
  const pending = key !== settledKey

  useEffect(() => {
    if (!pending) return
    const timer = setTimeout(() => setSettledKey(key), ms)
    return () => clearTimeout(timer)
  }, [key, pending, ms])

  return pending
}
