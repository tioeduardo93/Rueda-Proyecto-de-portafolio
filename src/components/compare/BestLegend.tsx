import { cn } from '../../lib/cn'

/** Leyenda del color de «Mejor valor». Decorativa para lectores de pantalla: cada celda ya dice «Mejor». */
export function BestLegend({ compact, className }: { compact?: boolean; className?: string }) {
  return (
    <span aria-hidden="true" className={cn('inline-flex items-center gap-2 text-[13px] text-ink-2', compact && 'gap-1.5 text-xs font-semibold text-muted', className)}>
      <span className={cn('inline-block rounded-[5px] border border-accent bg-accent-soft', compact ? 'size-3.5 rounded-[4px]' : 'size-[18px]')} />
      {compact ? 'Mejor valor' : 'Mejor valor de la fila'}
    </span>
  )
}
