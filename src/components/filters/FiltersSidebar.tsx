import type { BrandFacet, Filters, ModelGroup } from '../../lib/filters'
import { cn } from '../../lib/cn'
import { Button } from '../Button'
import { FilterFields, type FilterFieldsProps } from './FilterFields'

export interface FiltersSidebarProps {
  filters: Filters
  brands: BrandFacet[]
  models: ModelGroup[]
  activeCount: number
  onChange: FilterFieldsProps['onChange']
  onToggleBrand: (brand: string) => void
  onClearAll: () => void
  className?: string
}

export function FiltersSidebar({ activeCount, onClearAll, className, ...fields }: FiltersSidebarProps) {
  return (
    <aside aria-labelledby="filtros-titulo" className={cn('rounded-card border border-line bg-surface px-5 pt-1.5 pb-5', className)}>
      <div className="flex items-center justify-between py-3.5">
        <h2 id="filtros-titulo" className="text-lg font-extrabold">
          Filtros
        </h2>
        {activeCount > 0 && (
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-bold text-accent tabular-nums">
            {activeCount} {activeCount === 1 ? 'activo' : 'activos'}
          </span>
        )}
      </div>
      <FilterFields variant="sidebar" {...fields} />
      <Button variant="secondary" block onClick={onClearAll} className="mt-1">
        Limpiar filtros
      </Button>
    </aside>
  )
}
