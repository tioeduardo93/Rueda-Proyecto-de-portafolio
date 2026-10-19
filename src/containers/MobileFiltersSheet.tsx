import { useMemo, useState } from 'react'
import { BottomSheet } from '../components/BottomSheet'
import { Button } from '../components/Button'
import { FilterFields } from '../components/filters/FilterFields'
import { DEFAULT_FILTERS, brandFacets, filterCars, modelGroups, toggleBrand, type Filters } from '../lib/filters'
import { formatNumber } from '../lib/format'
import type { Car } from '../types'

interface MobileFiltersSheetProps {
  cars: Car[]
  filters: Filters
  onApply: (filters: Filters) => void
  onClose: () => void
}

function ctaLabel(count: number) {
  if (count === 0) return 'Sin resultados'
  return count === 1 ? 'Ver 1 coche' : `Ver ${formatNumber(count)} coches`
}

function liveLabel(count: number) {
  if (count === 0) return 'Ningún coche con estos filtros'
  return count === 1 ? '1 coche con estos filtros' : `${formatNumber(count)} coches con estos filtros`
}

/**
 * Filtros en móvil. Se edita una copia: «Ver N coches» la aplica;
 * cerrar (X, Escape o tocar fuera) la descarta.
 */
export function MobileFiltersSheet({ cars, filters, onApply, onClose }: MobileFiltersSheetProps) {
  const [draft, setDraft] = useState(filters)
  const brands = useMemo(() => brandFacets(cars), [cars])
  const count = useMemo(() => filterCars(cars, draft).length, [cars, draft])
  const cta = ctaLabel(count)

  return (
    <BottomSheet
      title="Filtros"
      closeLabel="Cerrar filtros"
      onClose={onClose}
      footer={
        <>
          {/* La búsqueda no se edita aquí, así que «Limpiar» la conserva. */}
          <Button variant="secondary" size="xl" className="flex-1 px-0" onClick={() => setDraft((d) => ({ ...DEFAULT_FILTERS, q: d.q }))}>
            Limpiar
          </Button>
          <Button size="xl" className="flex-[2] px-0 tabular-nums" onClick={() => onApply(draft)}>
            {cta}
          </Button>
        </>
      }
    >
      <FilterFields
        variant="sheet"
        filters={draft}
        brands={brands}
        models={modelGroups(cars, draft.marcas)}
        onChange={(patch) => setDraft((d) => ({ ...d, ...patch }))}
        onToggleBrand={(brand) => setDraft((d) => toggleBrand(cars, d, brand))}
      />
      <p className="sr-only" aria-live="polite">
        {liveLabel(count)}
      </p>
    </BottomSheet>
  )
}
