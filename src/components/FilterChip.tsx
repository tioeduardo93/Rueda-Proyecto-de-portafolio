import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'
import { CloseIcon } from './icons'

/** Amplía el área táctil hasta 44 px sin cambiar el tamaño visual del chip. */
const HIT_AREA = "relative after:absolute after:inset-x-0 after:-inset-y-[5px] after:content-['']"

type BaseProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

type ToggleChipProps = BaseProps & {
  children: ReactNode
  selected: boolean
  /** `pill` para opciones en línea; `tile` para rejillas (cambio, etiqueta, plazos). */
  shape?: 'pill' | 'tile'
  onRemove?: never
}

type RemovableChipProps = BaseProps & {
  /** Texto del filtro; también forma el nombre accesible («Quitar filtro …»). */
  children: string
  /** Chip de filtro activo: al pulsarlo se quita el filtro. */
  onRemove: () => void
  selected?: never
  shape?: never
}

export type FilterChipProps = ToggleChipProps | RemovableChipProps

export function FilterChip(props: FilterChipProps) {
  if (props.onRemove) {
    const { onRemove, children, className, ...rest } = props
    return (
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Quitar filtro ${children}`}
        className={cn(
          HIT_AREA,
          'inline-flex h-[34px] flex-none items-center gap-1.5 rounded-full border border-accent-line bg-accent-faint pr-2.5 pl-3.5',
          'text-[13px] font-bold text-ink tabular-nums transition-colors duration-150 hover:border-accent',
          className,
        )}
        {...rest}
      >
        <span>{children}</span>
        <CloseIcon size={14} />
      </button>
    )
  }

  const { selected, shape = 'pill', children, className, ...rest } = props
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        HIT_AREA,
        'border text-[13px] font-semibold transition-colors duration-150 hover:border-accent',
        shape === 'pill' ? 'h-9 rounded-full px-3.5' : 'h-10 rounded-field',
        selected ? 'border-accent bg-accent-soft text-accent' : 'border-line-strong bg-surface text-ink-2',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
