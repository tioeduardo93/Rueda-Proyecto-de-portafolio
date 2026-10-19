import { useId, type CSSProperties } from 'react'
import { cn } from '../lib/cn'

export type Range = readonly [number, number]

export interface RangeSliderProps {
  label: string
  min: number
  max: number
  step: number
  value: Range
  onChange: (value: [number, number]) => void
  formatValue: (value: number) => string
  /** Muestra los extremos (mín. y máx.) bajo el slider. */
  showBounds?: boolean
  /** `lg` agranda los mandos para el panel de filtros en móvil. */
  size?: 'md' | 'lg'
  className?: string
}

/**
 * Slider de rango con dos mandos: dos `input[type=range]` nativos superpuestos,
 * así el teclado (flechas, Inicio, Fin, RePág, AvPág) y los lectores de pantalla funcionan sin más.
 */
export function RangeSlider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  formatValue,
  showBounds = true,
  size = 'md',
  className,
}: RangeSliderProps) {
  const labelId = useId()
  const [lo, hi] = value
  const span = max - min || 1
  const left = ((lo - min) / span) * 100
  const right = ((max - hi) / span) * 100
  // Si los dos mandos se juntan en un extremo, el de mínimo debe quedar encima en la mitad derecha
  // (si no, no se podría arrastrar hacia la izquierda).
  const loOnTop = lo > min + span / 2

  const big = size === 'lg'
  const track = big ? 'top-[14px]' : 'top-3'

  return (
    <div role="group" aria-labelledby={labelId} className={cn('flex flex-col gap-2.5', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span id={labelId} className={cn('font-extrabold', big ? 'text-[15px]' : 'text-sm')}>
          {label}
        </span>
        <span className={cn('font-bold text-ink-2 tabular-nums', big ? 'text-sm' : 'text-[13px]')}>
          {formatValue(lo)} – {formatValue(hi)}
        </span>
      </div>

      <div className={cn('relative', big ? 'h-8' : 'h-7')} style={{ '--thumb': big ? '26px' : '22px' } as CSSProperties}>
        <div className={cn('absolute inset-x-0 h-1 rounded bg-line', track)} />
        <div className={cn('absolute h-1 rounded bg-accent', track)} style={{ left: `${left}%`, right: `${right}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={lo}
          aria-label={`${label} mínimo`}
          aria-valuetext={formatValue(lo)}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi - step), hi])}
          className={cn('dual-range', loOnTop ? 'z-20' : 'z-10')}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={hi}
          aria-label={`${label} máximo`}
          aria-valuetext={formatValue(hi)}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo + step)])}
          className="dual-range z-[15]"
        />
      </div>

      {showBounds && (
        <div aria-hidden="true" className="flex justify-between text-[11px] text-muted tabular-nums">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      )}
    </div>
  )
}
