import { useEffect, useId, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Button, ButtonLink } from '../components/Button'
import { BestLegend } from '../components/compare/BestLegend'
import { CompareTable } from '../components/compare/CompareTable'
import { EmptyState } from '../components/EmptyState'
import { ArrowLeftIcon, ArrowRightIcon } from '../components/icons'
import { MobilePageHeader } from '../components/MobilePageHeader'
import { useCars } from '../hooks/useCars'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { carName, versionLine } from '../lib/car'
import { buildCompareRows, onlyDifferences, resolveCars } from '../lib/compare'
import { FINANCE } from '../lib/finance'
import { formatNumber, formatPrice } from '../lib/format'
import { lastListingHref } from '../lib/listingMemory'
import { MAX_COMPARE, useCompare } from '../store/compare'
import type { Car } from '../types'

const NO_CARS: Car[] = []

function OnlyDifferencesToggle({ checked, disabled, onChange }: { checked: boolean; disabled: boolean; onChange: (v: boolean) => void }) {
  const hintId = useId()
  return (
    <label className="flex min-h-11 items-center gap-2.5 text-sm font-bold has-disabled:cursor-not-allowed has-disabled:text-muted">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-describedby={disabled ? hintId : undefined}
        onChange={(e) => onChange(e.target.checked)}
        className="m-0 size-[18px]"
      />
      Mostrar solo diferencias
      {disabled && (
        <span id={hintId} className="sr-only">
          (necesitas al menos 2 coches)
        </span>
      )}
    </label>
  )
}

export default function ComparePage() {
  useDocumentTitle('Comparar coches')
  const cars = useCars()
  const catalog = cars.status === 'success' ? cars.data : NO_CARS
  const ids = useCompare((s) => s.ids)
  const remove = useCompare((s) => s.remove)
  const setIds = useCompare((s) => s.set)
  const [onlyDiff, setOnlyDiff] = useState(false)

  const selected = useMemo(() => resolveCars(ids, catalog), [ids, catalog])
  const count = selected.length
  const canCompare = count >= 2

  // Un id guardado que ya no está en el catálogo (anuncio retirado) se quita del comparador.
  useEffect(() => {
    if (cars.status === 'success' && selected.length !== ids.length) setIds(selected.map((c) => c.id))
  }, [cars.status, selected, ids.length, setIds])

  const rows = useMemo(() => {
    const all = buildCompareRows(selected)
    return onlyDiff && canCompare ? onlyDifferences(all) : all
  }, [selected, onlyDiff, canCompare])

  const backTo = lastListingHref()
  const title = `Comparar (${count}/${MAX_COMPARE})`
  const columns = selected.map((c) => ({
    id: c.id,
    name: carName(c),
    version: versionLine(c),
    price: formatPrice(c.precio),
    href: `/coche/${c.id}`,
  }))

  return (
    <>
      <MobilePageHeader title={title} backTo={backTo} aside={count > 0 && <BestLegend compact />} />

      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 pb-10 lg:gap-6 lg:px-6 lg:pt-6 lg:pb-[72px]">
        <div className="hidden flex-wrap items-end justify-between gap-4 lg:flex">
          <div className="flex flex-col gap-2">
            <Link to={backTo} className="inline-flex min-h-11 items-center gap-1.5 self-start text-sm font-bold no-underline">
              <ArrowLeftIcon size={16} />
              Volver a resultados
            </Link>
            <h1 className="text-[32px] font-extrabold tracking-[-0.03em]">Comparar coches</h1>
            <p className="text-[15px] text-muted tabular-nums">
              {count} de {MAX_COMPARE} coches seleccionados · resaltamos el mejor valor de cada fila
            </p>
          </div>
          {count > 0 && (
            <div className="flex flex-wrap items-center gap-5">
              <BestLegend />
              <OnlyDifferencesToggle checked={onlyDiff} disabled={!canCompare} onChange={setOnlyDiff} />
            </div>
          )}
        </div>

        {cars.status === 'loading' ? (
          <div aria-busy="true" className="flex flex-col gap-3 px-4 pt-4 lg:px-0">
            <span className="sr-only" role="status">
              Cargando el comparador…
            </span>
            <div aria-hidden="true" className="skeleton h-[420px] lg:rounded-panel!" />
          </div>
        ) : cars.status === 'error' ? (
          <EmptyState illustration="search" title="No hemos podido cargar los coches" description="Revisa tu conexión y vuelve a intentarlo." className="mx-4 lg:mx-0">
            <Button size="lg" onClick={cars.retry}>
              Reintentar
            </Button>
          </EmptyState>
        ) : count === 0 ? (
          <EmptyState
            illustration="search"
            title="Aún no has elegido coches para comparar"
            description="Marca «Comparar» en hasta 3 coches del listado o de tus favoritos y los verás aquí, lado a lado."
            className="mx-4 mt-4 lg:mx-0 lg:mt-0"
          >
            <ButtonLink to={backTo} size="lg" block className="sm:w-auto">
              Explorar coches
            </ButtonLink>
          </EmptyState>
        ) : (
          <>
            <div className="flex flex-col border-b border-line-soft bg-field lg:hidden">
              <p className="flex items-center gap-1.5 px-4 pt-2.5 text-xs font-semibold text-muted">
                <ArrowRightIcon size={16} />
                Desliza horizontalmente para ver todos los coches
              </p>
              <div className="px-4">
                <OnlyDifferencesToggle checked={onlyDiff} disabled={!canCompare} onChange={setOnlyDiff} />
              </div>
            </div>

            {!canCompare && (
              <p role="status" className="mx-4 rounded-btn bg-accent-soft px-3.5 py-3 text-sm font-semibold text-ink lg:mx-0">
                Añade al menos otro coche para ver cuál gana en cada fila.
              </p>
            )}

            <CompareTable
              columns={columns}
              rows={rows}
              emptySlots={MAX_COMPARE - count}
              addHref={backTo}
              onRemove={remove}
            />

            <p className="px-4 text-[13px] text-muted lg:px-0">
              Consumo mixto homologado WLTP. Cuotas orientativas a {FINANCE.meses} meses con entrada del{' '}
              {FINANCE.entrada * 100}&nbsp;%, TIN {formatNumber(FINANCE.tin * 100, 2)}&nbsp;%.
            </p>
          </>
        )}
      </div>
    </>
  )
}
