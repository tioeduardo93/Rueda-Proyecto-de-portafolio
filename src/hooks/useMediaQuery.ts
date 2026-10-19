import { useCallback, useSyncExternalStore } from 'react'

/** Breakpoints de Tailwind usados desde JS. */
export const MEDIA = {
  sm: '(min-width: 40rem)',
  lg: '(min-width: 64rem)',
} as const

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia?.(query)
      mql?.addEventListener('change', onChange)
      return () => mql?.removeEventListener('change', onChange)
    },
    [query],
  )
  return useSyncExternalStore(subscribe, () => window.matchMedia?.(query).matches ?? false, () => false)
}
