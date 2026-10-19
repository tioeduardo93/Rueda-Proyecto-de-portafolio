import { useId } from 'react'
import { Link } from 'react-router'
import { cn } from '../lib/cn'

export interface PopularSearch {
  label: string
  to: string
}

/** Atajos a búsquedas ya filtradas. Pastillas de 36 px con zona pulsable de 44 px. */
export function PopularSearches({ searches, className }: { searches: PopularSearch[]; className?: string }) {
  const id = useId()
  return (
    <nav aria-labelledby={id} className={cn('flex w-full flex-col gap-2.5 text-left', className)}>
      <h2 id={id} className="text-[13px] font-extrabold text-ink-2">
        Búsquedas populares
      </h2>
      <ul className="flex flex-wrap gap-2">
        {searches.map((s) => (
          <li key={s.label}>
            <Link
              to={s.to}
              className="relative inline-flex h-9 items-center rounded-full border border-line-strong bg-surface px-3.5 text-[13px] font-semibold text-ink-2 no-underline transition-colors after:absolute after:inset-x-0 after:-inset-y-1 after:content-[''] hover:border-accent"
            >
              {s.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
