import { cn } from '../lib/cn'

export interface SortOption<T extends string> {
  value: T
  label: string
  shortLabel: string
}

export interface SortSelectProps<T extends string> {
  options: readonly SortOption<T>[]
  value: T
  onChange: (value: T) => void
  /** Versión móvil: etiqueta oculta, textos cortos y a todo el ancho. */
  compact?: boolean
  className?: string
}

export function SortSelect<T extends string>({ options, value, onChange, compact, className }: SortSelectProps<T>) {
  return (
    <label className={cn('flex items-center gap-2.5 text-sm text-muted', className)}>
      <span className={cn(compact && 'sr-only')}>Ordenar por</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={cn(
          'h-11 border border-line-strong bg-surface px-3 text-sm font-bold text-ink',
          compact ? 'w-full rounded-btn' : 'rounded-field',
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {compact ? o.shortLabel : o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
