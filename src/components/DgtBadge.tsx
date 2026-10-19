import { cn } from '../lib/cn'
import type { EtiquetaDgt } from '../types'

const COLORS: Record<EtiquetaDgt, string> = {
  '0': 'bg-dgt-0 text-white',
  ECO: 'bg-[linear-gradient(90deg,var(--color-dgt-c)_50%,var(--color-dgt-0)_50%)] text-white',
  C: 'bg-dgt-c text-white',
  B: 'bg-dgt-b text-dgt-b-ink',
}

const SIZES = {
  sm: { box: 'size-[26px]', text: 'text-[11px]', eco: 'text-[8px]' },
  md: { box: 'size-[30px]', text: 'text-xs', eco: 'text-[8.5px]' },
}

export interface DgtBadgeProps {
  label: EtiquetaDgt
  size?: keyof typeof SIZES
  /** Aro blanco para separarlo de fotos y fondos de color. */
  ring?: boolean
  /** Úsalo cuando el control que lo contiene ya nombra la etiqueta. */
  decorative?: boolean
  className?: string
}

export function DgtBadge({ label, size = 'md', ring, decorative, className }: DgtBadgeProps) {
  const s = SIZES[size]
  const name = `Etiqueta ambiental ${label}`
  return (
    <span
      {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': name, title: name })}
      className={cn(
        'inline-flex flex-none items-center justify-center rounded-full font-extrabold leading-none',
        s.box,
        label === 'ECO' ? s.eco : s.text,
        COLORS[label],
        ring && 'shadow-[0_0_0_2px_#fff]',
        className,
      )}
    >
      {label}
    </span>
  )
}
