import type { ReactNode } from 'react'
import { FilterChip } from '../FilterChip'
import { FilterGroup } from './FilterGroup'

export interface ChipOption<T extends string> {
  value: T
  label: ReactNode
  /** Nombre accesible cuando `label` no es texto (p. ej. una etiqueta DGT). */
  ariaLabel?: string
}

export interface OptionChipsProps<T extends string> {
  title: string
  options: ChipOption<T>[]
  selected: readonly T[]
  onToggle: (value: T) => void
  shape?: 'pill' | 'tile'
  size?: 'md' | 'lg'
  /** Disposición de los chips (flex o rejilla). */
  layoutClassName?: string
  chipClassName?: string
}

/** Grupo de opciones de selección múltiple (combustible, cambio, etiqueta). */
export function OptionChips<T extends string>({
  title,
  options,
  selected,
  onToggle,
  shape = 'pill',
  size = 'md',
  layoutClassName = 'flex flex-wrap gap-2',
  chipClassName,
}: OptionChipsProps<T>) {
  return (
    <FilterGroup title={title} size={size}>
      <div className={layoutClassName}>
        {options.map((o) => (
          <FilterChip
            key={o.value}
            shape={shape}
            selected={selected.includes(o.value)}
            onClick={() => onToggle(o.value)}
            aria-label={o.ariaLabel}
            className={chipClassName}
          >
            {o.label}
          </FilterChip>
        ))}
      </div>
    </FilterGroup>
  )
}
