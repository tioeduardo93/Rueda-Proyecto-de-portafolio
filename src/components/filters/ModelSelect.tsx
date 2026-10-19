import { useId } from 'react'
import { cn } from '../../lib/cn'
import type { ModelGroup } from '../../lib/filters'

export interface ModelSelectProps {
  /** Modelos de las marcas elegidas. Vacío = sin marca elegida. */
  groups: ModelGroup[]
  value: string
  onChange: (model: string) => void
  size?: 'md' | 'lg'
}

export function ModelSelect({ groups, value, onChange, size = 'md' }: ModelSelectProps) {
  const id = useId()
  const hintId = useId()
  const disabled = groups.length === 0
  const big = size === 'lg'

  const options = (models: string[]) =>
    models.map((m) => (
      <option key={m} value={m}>
        {m}
      </option>
    ))

  return (
    <div className="flex flex-col gap-2 border-t border-line-soft py-4">
      <label htmlFor={id} className={cn('font-extrabold', big ? 'text-[15px]' : 'text-sm')}>
        Modelo
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        aria-describedby={disabled ? hintId : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'rounded-field border border-line-strong bg-surface px-3 text-ink disabled:cursor-not-allowed disabled:bg-field disabled:text-muted',
          big ? 'h-12 rounded-btn text-base' : 'h-11 text-sm',
        )}
      >
        <option value="">{disabled ? 'Selecciona una marca' : 'Todos los modelos'}</option>
        {groups.length === 1
          ? options(groups[0]!.modelos)
          : groups.map((g) => (
              <optgroup key={g.marca} label={g.marca}>
                {options(g.modelos)}
              </optgroup>
            ))}
      </select>
      {disabled && (
        <span id={hintId} className="text-xs text-muted">
          Elige antes una marca para ver sus modelos.
        </span>
      )}
    </div>
  )
}
