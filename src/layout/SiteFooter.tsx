import { cn } from '../lib/cn'
import { FINANCE } from '../lib/finance'
import { formatNumber } from '../lib/format'

export function SiteFooter({ className }: { className?: string }) {
  const year = new Date().getFullYear()
  return (
    <footer className={cn('border-t border-line bg-surface', className)}>
      <div className="mx-auto flex max-w-[1280px] flex-wrap justify-between gap-3 p-6 text-[13px] text-muted">
        <span>© {year} Rueda · Proyecto de portafolio</span>
        <span>
          Precios con IVA incluido. Cuotas orientativas a {FINANCE.meses} meses con entrada del{' '}
          {FINANCE.entrada * 100}&nbsp;%, TIN {formatNumber(FINANCE.tin * 100, 2)}&nbsp;%.
        </span>
      </div>
    </footer>
  )
}
