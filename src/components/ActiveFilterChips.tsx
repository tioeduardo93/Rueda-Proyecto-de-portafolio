import { cn } from '../lib/cn'
import { FilterChip } from './FilterChip'

export interface ActiveFilterChipsProps {
  chips: { id: string; label: string }[]
  onRemove: (id: string) => void
  onClearAll: () => void
  className?: string
}

/** Filtros activos. En móvil, una fila con scroll horizontal; desde `sm`, en varias líneas. */
export function ActiveFilterChips({ chips, onRemove, onClearAll, className }: ActiveFilterChipsProps) {
  if (chips.length === 0) return null
  return (
    <div
      className={cn(
        'no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 py-[5px]',
        'sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0',
        className,
      )}
    >
      <ul aria-label="Filtros activos" className="flex flex-none gap-2 sm:flex-initial sm:flex-wrap">
        {chips.map((c) => (
          <li key={c.id} className="flex-none">
            <FilterChip onRemove={() => onRemove(c.id)}>{c.label}</FilterChip>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onClearAll}
        className="relative h-[34px] flex-none px-2 text-[13px] font-bold whitespace-nowrap text-accent underline underline-offset-2 after:absolute after:inset-x-0 after:-inset-y-[5px] after:content-[''] hover:text-ink"
      >
        Limpiar todo
      </button>
    </div>
  )
}
