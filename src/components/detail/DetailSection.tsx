import { useId, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface DetailSectionProps {
  title: string
  children: ReactNode
  className?: string
}

/** Bloque de la ficha. En móvil, banda blanca a todo el ancho; desde `lg`, tarjeta. */
export function DetailSection({ title, children, className }: DetailSectionProps) {
  const id = useId()
  return (
    <section
      aria-labelledby={id}
      className={cn('border-y border-line bg-surface px-4 py-5 lg:rounded-panel lg:border lg:p-7', className)}
    >
      <h2 id={id} className="mb-3.5 text-[19px] font-extrabold lg:mb-5 lg:text-[22px] lg:tracking-[-0.02em]">
        {title}
      </h2>
      {children}
    </section>
  )
}
