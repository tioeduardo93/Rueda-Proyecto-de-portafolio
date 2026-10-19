import type { ReactNode } from 'react'

export interface Spec {
  label: string
  value: ReactNode
}

/** Ficha técnica: pares dato/valor en rejilla (2 columnas en móvil, automáticas en escritorio). */
export function SpecGrid({ specs }: { specs: Spec[] }) {
  return (
    <dl className="grid grid-cols-2 gap-2 tabular-nums lg:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] lg:gap-3">
      {specs.map((s) => (
        <div key={s.label} className="flex flex-col gap-0.5 rounded-btn bg-field px-3 py-2.5 lg:gap-1 lg:rounded-[14px] lg:px-4 lg:py-3.5">
          <dt className="text-[11px] font-bold tracking-[0.06em] text-muted uppercase lg:text-xs">{s.label}</dt>
          <dd className="flex min-h-[26px] items-center gap-2 text-[15px] font-extrabold lg:text-[17px]">{s.value}</dd>
        </div>
      ))}
    </dl>
  )
}
