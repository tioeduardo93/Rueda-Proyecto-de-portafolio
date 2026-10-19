import { FINANCE } from '../lib/finance'
import { formatNumber } from '../lib/format'

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-line bg-surface">
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
