import { createContext } from 'react'

/**
 * Huecos del layout que rellena cada página:
 * - `headerToolbar`: dentro de la cabecera fija, debajo del buscador (fila «Filtros / Ordenar» del listado en móvil).
 * - `mobileHeader`: antes de `<main>`, para que la cabecera propia de una página sea el `banner` de la página.
 */
export interface LayoutSlots {
  headerToolbar: HTMLElement | null
  mobileHeader: HTMLElement | null
}

export const LayoutSlotsContext = createContext<LayoutSlots>({ headerToolbar: null, mobileHeader: null })
