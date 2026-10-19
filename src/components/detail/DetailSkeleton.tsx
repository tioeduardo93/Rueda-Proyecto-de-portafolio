/** Esqueleto de la ficha mientras llega el coche. Decorativo. */
export function DetailSkeleton() {
  return (
    <div aria-hidden="true" className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(340px,400px)] lg:gap-7">
      <div className="flex flex-col gap-3">
        <div className="skeleton aspect-[4/3] rounded-none! sm:aspect-[16/10] lg:rounded-panel!" />
        <div className="hidden grid-cols-7 gap-2.5 lg:grid">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="skeleton aspect-[4/3] rounded-field!" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3 bg-surface px-4 py-5 lg:rounded-panel lg:border lg:border-line lg:p-6">
        <div className="skeleton h-6 w-40" />
        <div className="skeleton h-8 w-[70%]" />
        <div className="skeleton h-4 w-[85%]" />
        <div className="skeleton mt-2 h-10 w-[55%]" />
        <div className="skeleton mt-2 hidden h-[54px] lg:block" />
        <div className="skeleton hidden h-[50px] lg:block" />
      </div>
    </div>
  )
}
