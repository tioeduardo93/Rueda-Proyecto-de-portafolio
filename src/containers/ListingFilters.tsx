import { useMemo } from 'react'
import { FiltersSidebar } from '../components/filters/FiltersSidebar'
import type { UpdateOptions } from '../hooks/useListingQuery'
import { brandFacets, modelGroups, toggleBrand, type Filters } from '../lib/filters'
import type { Car } from '../types'
import { MobileFiltersSheet } from './MobileFiltersSheet'

interface ListingFiltersProps {
  /** Desde `lg`, barra lateral que filtra al momento; por debajo, panel inferior con borrador. */
  isDesktop: boolean
  cars: Car[]
  filters: Filters
  activeCount: number
  setFilters: (update: Filters | ((f: Filters) => Filters), options?: UpdateOptions) => void
  onClearAll: () => void
  /** Panel inferior abierto (solo móvil). Lo abre el botón «Filtros» de la cabecera o «Ajustar filtros». */
  sheetOpen: boolean
  onCloseSheet: () => void
  className?: string
}

/**
 * Filtros del listado: un solo panel en el DOM, que cambia de presentación según el ancho.
 * Los dos usan los mismos controles (`FilterFields`), así que textos y comportamiento son los mismos.
 */
export function ListingFilters({
  isDesktop,
  cars,
  filters,
  activeCount,
  setFilters,
  onClearAll,
  sheetOpen,
  onCloseSheet,
  className,
}: ListingFiltersProps) {
  const brands = useMemo(() => brandFacets(cars), [cars])
  const models = useMemo(() => modelGroups(cars, filters.marcas), [cars, filters.marcas])

  if (isDesktop) {
    return (
      <FiltersSidebar
        className={className}
        filters={filters}
        brands={brands}
        models={models}
        activeCount={activeCount}
        onChange={(patch, { continuous }) => setFilters((f) => ({ ...f, ...patch }), { replace: continuous })}
        onToggleBrand={(brand) => setFilters((f) => toggleBrand(cars, f, brand))}
        onClearAll={onClearAll}
      />
    )
  }

  if (!sheetOpen || cars.length === 0) return null
  return (
    <MobileFiltersSheet
      cars={cars}
      filters={filters}
      onApply={(next) => {
        setFilters(next)
        onCloseSheet()
      }}
      onClose={onCloseSheet}
    />
  )
}
