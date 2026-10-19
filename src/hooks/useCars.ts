import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Car } from '../types'

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: unknown }

// Caché a nivel de módulo: el catálogo se pide una vez por sesión, como haría una caché de peticiones.
let request: Promise<Car[]> | null = null
let resolved: Car[] | null = null

function loadCars(): Promise<Car[]> {
  request ??= api.getCars().then(
    (cars) => (resolved = cars),
    (error: unknown) => {
      request = null
      throw error
    },
  )
  return request
}

/** Catálogo completo. La primera vez tarda lo que la API simulada; después es inmediato. */
export function useCars(): AsyncState<Car[]> & { retry: () => void } {
  const [state, setState] = useState<AsyncState<Car[]>>(() =>
    resolved ? { status: 'success', data: resolved } : { status: 'loading' },
  )
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (resolved) return
    let active = true
    loadCars().then(
      (data) => active && setState({ status: 'success', data }),
      (error: unknown) => active && setState({ status: 'error', error }),
    )
    return () => {
      active = false
    }
  }, [attempt])

  const retry = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((n) => n + 1)
  }, [])

  return { ...state, retry }
}
