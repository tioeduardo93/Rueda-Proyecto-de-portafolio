import { Link } from 'react-router'
import { cn } from '../../lib/cn'
import { ArrowLeftIcon } from '../icons'

export interface Crumb {
  label: string
  to?: string
}

export interface BreadcrumbsProps {
  backTo: string
  /** Del más general al actual; el último no lleva enlace. */
  crumbs: Crumb[]
  className?: string
}

export function Breadcrumbs({ backTo, crumbs, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Ruta de navegación" className={cn('flex flex-wrap items-center gap-x-2 text-[13px] text-muted', className)}>
      <Link to={backTo} className="inline-flex min-h-11 items-center gap-1.5 font-bold text-accent no-underline hover:text-ink">
        <ArrowLeftIcon size={16} />
        Volver a resultados
      </Link>
      <span aria-hidden="true">·</span>
      <ol className="flex flex-wrap items-center gap-x-2">
        {crumbs.map((c, i) => (
          <li key={c.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">›</span>}
            {c.to ? (
              <Link to={c.to} className="inline-flex min-h-11 items-center text-muted hover:text-ink">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-semibold text-ink">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
