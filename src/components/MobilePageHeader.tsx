import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '../lib/cn'
import { ChevronLeftIcon } from './icons'

export interface MobilePageHeaderProps {
  title: ReactNode
  backTo: string
  backLabel?: string
  /** Contenido a la derecha del título (leyenda, contador…). */
  aside?: ReactNode
  className?: string
}

/** Cabecera propia de las pantallas móviles de comparador y favoritos: «Volver» y título. Solo por debajo de `lg`. */
export function MobilePageHeader({ title, backTo, backLabel = 'Volver', aside, className }: MobilePageHeaderProps) {
  return (
    <header className={cn('sticky top-0 z-30 flex items-center gap-1 border-b border-line bg-surface py-3 pr-3 pl-2 lg:hidden', className)}>
      <Link to={backTo} aria-label={backLabel} className="flex size-11 flex-none items-center justify-center text-ink">
        <ChevronLeftIcon size={22} />
      </Link>
      <h1 className="min-w-0 flex-1 truncate text-[19px] font-extrabold tabular-nums">{title}</h1>
      {aside}
    </header>
  )
}
