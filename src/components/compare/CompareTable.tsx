import { useEffect, useRef, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { cn } from '../../lib/cn'
import type { CompareRow } from '../../lib/compare'
import { ButtonLink } from '../Button'
import { CarPhoto } from '../CarPhoto'
import { DgtBadge } from '../DgtBadge'
import { CheckIcon, CloseIcon, PlusIcon } from '../icons'

export interface CompareColumn {
  id: string
  name: string
  version: string
  price: string
  href: string
}

export interface CompareTableProps {
  columns: CompareColumn[]
  rows: CompareRow[]
  /** Huecos libres hasta el máximo, con «Añadir otro coche». */
  emptySlots: number
  addHref: string
  onRemove: (id: string) => void
  className?: string
}

const CELL_BORDER = 'border-t border-l border-line-soft'

/**
 * Tabla del comparador. Una sola `<table>` para todos los anchos: en móvil, columnas de 172 px con
 * scroll horizontal y la columna de etiquetas fija a la izquierda; desde `lg`, la tabla del diseño de escritorio.
 */
export function CompareTable({ columns, rows, emptySlots, addHref, onRemove, className }: CompareTableProps) {
  const slots = Array.from({ length: emptySlots }, (_, i) => i)
  const totalColumns = columns.length + emptySlots
  const regionRef = useRef<HTMLDivElement>(null)
  const removedIndex = useRef<number | null>(null)

  // Al quitar un coche su botón desaparece: el foco pasa al «Quitar» de la columna que ocupa su sitio
  // o, si no queda ninguna, al primer «Añadir otro coche», para no perderse en el <body>.
  useEffect(() => {
    const index = removedIndex.current
    if (index === null) return
    removedIndex.current = null
    const region = regionRef.current
    const buttons = region?.querySelectorAll<HTMLElement>('[data-remove]')
    const target = buttons?.[Math.min(index, buttons.length - 1)] ?? region?.querySelector<HTMLElement>('[data-add]')
    target?.focus()
  }, [columns.length])

  function remove(id: string, index: number) {
    removedIndex.current = index
    onRemove(id)
  }

  return (
    <div
      ref={regionRef}
      role="region"
      aria-label="Tabla comparativa"
      // Enfocable para poder desplazarla con el teclado cuando no cabe.
      tabIndex={0}
      className={cn('overflow-x-auto border-y border-line bg-surface lg:rounded-panel lg:border', className)}
    >
      <table
        style={{ '--cols': totalColumns } as CSSProperties}
        className="w-full min-w-[calc(100px+172px*var(--cols))] table-fixed border-separate border-spacing-0 lg:min-w-[860px]"
      >
        <caption className="sr-only">Comparativa de especificaciones</caption>
        <colgroup>
          <col className="w-[100px] lg:w-[220px]" />
        </colgroup>
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-10 bg-surface p-3 text-left align-bottom text-[13px] font-normal text-muted lg:p-6"
            >
              <span className="max-lg:sr-only">Especificación</span>
            </th>
            {columns.map((c, index) => (
              <th key={c.id} scope="col" className="border-l border-line-soft px-2.5 py-3 text-left align-top font-normal lg:p-5">
                <div className="flex flex-col gap-2 lg:gap-3">
                  <div className="relative">
                    <CarPhoto
                      label={c.name}
                      silhouette={0}
                      className="aspect-[4/3] rounded-field lg:hidden"
                      labelClassName="text-[9px]"
                    />
                    <CarPhoto label={c.name} silhouette={60} className="hidden aspect-[16/10] rounded-btn lg:flex" labelClassName="text-[10px]" />
                    <button
                      type="button"
                      data-remove
                      onClick={() => remove(c.id, index)}
                      aria-label={`Quitar ${c.name} de la comparación`}
                      className="absolute top-1 right-1 flex size-8 items-center justify-center rounded-full bg-white/95 text-ink shadow-float after:absolute after:-inset-1.5 after:content-[''] lg:top-2 lg:right-2 lg:size-9 lg:after:-inset-1"
                    >
                      <CloseIcon size={14} className="lg:size-4" />
                    </button>
                  </div>
                  <div>
                    <Link
                      to={c.href}
                      className="relative block text-sm leading-tight font-extrabold text-ink no-underline after:absolute after:inset-x-0 after:-inset-y-[13px] after:content-[''] lg:hidden"
                    >
                      {c.name}
                    </Link>
                    <span className="hidden text-lg font-extrabold text-ink lg:block">{c.name}</span>
                    <span className="mt-0.5 hidden text-[13px] text-muted lg:block">{c.version}</span>
                  </div>
                  <span className="text-[19px] font-extrabold tracking-[-0.02em] text-ink tabular-nums lg:text-[28px] lg:tracking-[-0.025em]">
                    {c.price}
                  </span>
                  <ButtonLink to={c.href} variant="secondary" block className="max-lg:hidden">
                    Ver ficha{' '}<span className="sr-only">de {c.name}</span>
                  </ButtonLink>
                </div>
              </th>
            ))}
            {slots.map((i) => (
              <td key={i} className="border-l border-line-soft px-2.5 py-3 align-top lg:p-5">
                <Link
                  to={addHref}
                  data-add
                  className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-field border-2 border-dashed border-line-hover bg-surface text-center text-[13px] font-bold text-ink-2 no-underline transition-colors hover:border-accent hover:bg-accent-faint lg:aspect-[16/10] lg:rounded-btn lg:text-sm"
                >
                  <PlusIcon size={28} className="text-accent" />
                  Añadir otro coche
                </Link>
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={totalColumns + 1} className="border-t border-line-soft p-6 text-center text-sm text-muted">
                Estos coches coinciden en todo lo que comparamos.
              </td>
            </tr>
          )}
          {rows.map((r) => (
            <tr key={r.id} className="group">
              <th
                scope="row"
                className="sticky left-0 z-10 border-t border-line-soft bg-field p-3 text-left text-xs font-bold text-ink-2 shadow-[1px_0_0_var(--color-line-soft)] group-hover:bg-[#F1F4F4] lg:bg-surface lg:px-6 lg:py-4 lg:text-sm lg:shadow-none lg:group-hover:bg-[#F9FAFA]"
              >
                {/* A la vista, la etiqueta corta en móvil; para lectores de pantalla, siempre la completa. */}
                <span aria-hidden="true" className="lg:hidden">
                  {r.shortLabel}
                </span>
                <span className="max-lg:sr-only">{r.label}</span>
              </th>
              {r.cells.map((cell, i) => (
                <td
                  key={columns[i]?.id ?? i}
                  className={cn(
                    CELL_BORDER,
                    'px-2.5 py-3 text-sm font-semibold text-ink tabular-nums lg:px-5 lg:py-4 lg:text-base',
                    cell.best ? 'bg-accent-soft font-extrabold text-accent' : 'lg:group-hover:bg-[#F9FAFA]',
                  )}
                >
                  <span className="flex flex-wrap items-center gap-1.5 lg:gap-2">
                    {cell.dgt ? <DgtBadge label={cell.dgt} size="sm" /> : <span>{cell.text}</span>}
                    {cell.best && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold tracking-[0.06em] uppercase lg:rounded-full lg:bg-accent lg:px-2 lg:py-[3px] lg:text-white">
                        <CheckIcon size={14} strokeWidth={3} className="lg:size-[11px] lg:stroke-[3.5]" />
                        <span className="max-lg:sr-only">Mejor</span>
                      </span>
                    )}
                  </span>
                </td>
              ))}
              {slots.map((i) => (
                <td key={i} className={CELL_BORDER} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
