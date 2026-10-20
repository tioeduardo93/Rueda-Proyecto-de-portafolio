import { useState } from 'react'
import type { BrandFacet } from '../../lib/filters'
import { FilterChip } from '../FilterChip'
import { FilterGroup } from './FilterGroup'

export interface BrandFilterProps {
  brands: BrandFacet[]
  selected: string[]
  onToggle: (brand: string) => void
  /** `list`: casillas con recuento (escritorio). `chips`: botones (panel móvil). */
  variant?: 'list' | 'chips'
  /** Marcas visibles en `list` antes de «Ver todas». */
  visibleCount?: number
}

export function BrandFilter({ brands, selected, onToggle, variant = 'list', visibleCount = 6 }: BrandFilterProps) {
  const [expanded, setExpanded] = useState(false)

  if (variant === 'chips') {
    return (
      <FilterGroup title="Marca" size="lg">
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <FilterChip key={b.name} selected={selected.includes(b.name)} onClick={() => onToggle(b.name)} className="h-10! text-sm">
              {b.name}
            </FilterChip>
          ))}
        </div>
      </FilterGroup>
    )
  }

  // Si hay elegida una marca de las ocultas, la lista se muestra entera para que se vea marcada.
  const hiddenSelected = brands.slice(visibleCount).some((b) => selected.includes(b.name))
  const showAll = expanded || hiddenSelected
  const visible = showAll ? brands : brands.slice(0, visibleCount)

  return (
    <FilterGroup title="Marca">
      <div className="flex flex-col">
        {visible.map((b) => (
          <label key={b.name} className="flex min-h-11 items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(b.name)}
              onChange={() => onToggle(b.name)}
              className="m-0 size-[18px]"
            />
            <span className="flex-1">{b.name}</span>
            <span className="text-xs text-muted tabular-nums">
              <span className="sr-only">,</span>{' '}
              {b.count}
              {' '}<span className="sr-only">{b.count === 1 ? 'coche' : 'coches'}</span>
            </span>
          </label>
        ))}
      </div>
      {brands.length > visibleCount && !hiddenSelected && (
        <button
          type="button"
          aria-expanded={showAll}
          onClick={() => setExpanded((v) => !v)}
          className="-my-1 min-h-11 self-start text-[13px] font-bold text-accent hover:text-ink"
        >
          {showAll ? 'Ver menos marcas' : `Ver todas las marcas (${brands.length})`}
        </button>
      )}
    </FilterGroup>
  )
}
