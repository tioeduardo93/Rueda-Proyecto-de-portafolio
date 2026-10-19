import { useId, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface FilterGroupProps {
  title: string
  /** `lg` para el panel de filtros en móvil. */
  size?: 'md' | 'lg'
  children: ReactNode
  className?: string
}

/** Bloque de filtro con título y separador superior. */
export function FilterGroup({ title, size = 'md', children, className }: FilterGroupProps) {
  const id = useId()
  return (
    <div role="group" aria-labelledby={id} className={cn('flex flex-col gap-2.5 border-t border-line-soft py-4', className)}>
      <span id={id} className={cn('font-extrabold', size === 'lg' ? 'text-[15px]' : 'text-sm')}>
        {title}
      </span>
      {children}
    </div>
  )
}
