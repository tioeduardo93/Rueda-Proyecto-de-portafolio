import { cn } from '../../lib/cn'
import { formatMonthly, formatPrice } from '../../lib/format'
import { Button } from '../Button'

export interface StickyContactBarProps {
  price: number
  monthlyFee: number
  onInterest: () => void
  className?: string
}

/** Barra fija inferior de la ficha en móvil: precio siempre a la vista y «Me interesa». */
export function StickyContactBar({ price, monthlyFee, onInterest, className }: StickyContactBarProps) {
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-20 flex items-center gap-3.5 border-t border-line bg-surface px-4 pt-3',
        'pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgb(14_26_31/0.2)]',
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[22px] leading-[1.1] font-extrabold tracking-[-0.025em] tabular-nums">{formatPrice(price)}</span>
        <span className="text-xs text-muted">
          desde <strong className="font-extrabold text-accent tabular-nums">{formatMonthly(monthlyFee)}</strong>
        </span>
      </div>
      <Button size="xl" onClick={onInterest} className="h-[52px] rounded-[14px] px-7">
        Me interesa
      </Button>
    </div>
  )
}
