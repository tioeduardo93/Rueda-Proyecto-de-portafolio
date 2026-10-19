import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

const TONES = {
  /** «Garantía 12 meses» */
  accent: 'rounded-full bg-accent-soft px-2.5 py-[5px] text-xs font-bold text-accent',
  /** «Único propietario» */
  neutral: 'rounded-full bg-line-soft px-2.5 py-[5px] text-xs font-bold text-ink-2',
  /** «Ha bajado 600 €» */
  solid: 'rounded-md bg-accent px-2.5 py-[5px] text-xs font-extrabold text-white',
  /** «14 fotos», sobre una foto */
  overlay: 'rounded-md bg-ink/75 px-2 py-1 text-[11px] font-bold text-white',
}

export interface BadgeProps {
  tone?: keyof typeof TONES
  children: ReactNode
  className?: string
}

export function Badge({ tone = 'accent', children, className }: BadgeProps) {
  return <span className={cn('inline-flex items-center gap-1.5 tabular-nums', TONES[tone], className)}>{children}</span>
}
