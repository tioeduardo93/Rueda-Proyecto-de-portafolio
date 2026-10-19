import { cn } from '../lib/cn'

/** Esqueleto con la misma silueta que `CarCard` en móvil y escritorio. Decorativo. */
export function CarCardSkeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('overflow-hidden rounded-card border border-line bg-surface', className)}>
      <div className="skeleton aspect-[16/9] rounded-none! sm:aspect-[16/10]" />
      <div className="flex flex-col gap-2.5 px-4 py-3.5 sm:p-4">
        <div className="flex justify-between gap-4 sm:flex-col sm:gap-2.5">
          <div className="flex flex-1 flex-col gap-2 sm:gap-2.5">
            <div className="skeleton h-4 w-[70%] sm:h-[18px] sm:w-[60%]" />
            <div className="skeleton h-3 w-[90%] sm:w-[80%]" />
          </div>
          <div className="skeleton h-[26px] w-24 sm:mt-1.5 sm:w-[45%]" />
        </div>
        <div className="flex gap-1.5 sm:mt-1.5 sm:grid sm:grid-cols-2 sm:gap-2">
          <div className="skeleton h-6 w-12 sm:h-3 sm:w-auto" />
          <div className="skeleton h-6 w-20 sm:h-3 sm:w-auto" />
          <div className="skeleton h-6 w-16 sm:h-3 sm:w-auto" />
          <div className="skeleton h-6 w-[60px] sm:h-3 sm:w-auto" />
        </div>
      </div>
    </div>
  )
}
