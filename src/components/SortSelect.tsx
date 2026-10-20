import { cn } from '../lib/cn'

export interface SortOption<T extends string> {
  value: T
  label: string
}

export interface SortSelectProps<T extends string> {
  options: readonly SortOption<T>[]
  value: T
  onChange: (value: T) => void
  /** Versión móvil: etiqueta «Ordenar por» oculta (sigue para lectores de pantalla) y a todo el ancho disponible. */
  compact?: boolean
  className?: string
}

/** Selector de orden. Los textos vienen de `SORTS` (`lib/filters.ts`), los mismos en móvil y escritorio. */
export function SortSelect<T extends string>({ options, value, onChange, compact, className }: SortSelectProps<T>) {
  return (
    <label className={cn('flex items-center gap-2.5 text-sm text-muted', className)}>
      <span className={cn(compact && 'sr-only')}>Ordenar por</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={cn(
          'h-11 border border-line-strong bg-surface text-ink',
          compact ? 'w-full min-w-0 rounded-btn px-2.5 text-[13px] font-semibold' : 'rounded-field px-3 text-sm font-bold',
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
