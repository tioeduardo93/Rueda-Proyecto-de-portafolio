import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { ActiveFilterChips } from '../components/ActiveFilterChips'
import { Button } from '../components/Button'
import { CarCardSkeleton } from '../components/CarCardSkeleton'
import { EmptyState } from '../components/EmptyState'
import { FiltersSidebar } from '../components/filters/FiltersSidebar'
import { FiltersIcon } from '../components/icons'
import { SortSelect } from '../components/SortSelect'
import { CarCardContainer } from '../containers/CarCardContainer'
import { CompareBarContainer } from '../containers/CompareBarContainer'
import { MobileFiltersSheet } from '../containers/MobileFiltersSheet'
import { useCars } from '../hooks/useCars'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useListingQuery } from '../hooks/useListingQuery'
import { MEDIA, useMediaQuery } from '../hooks/useMediaQuery'
import { useSimulatedRefresh } from '../hooks/useSimulatedRefresh'
import { latency } from '../lib/api'
import {
  SORTS,
  activeFilters,
  brandFacets,
  filterCars,
  modelGroups,
  sortCars,
  toggleBrand,
  type Filters,
  type SortKey,
} from '../lib/filters'
import { pluralize } from '../lib/format'
import { LayoutSlot } from '../layout/slots'
import { rememberListingSearch } from '../lib/listingMemory'
import { toListingParams } from '../lib/url'
import type { Car } from '../types'

const PAGE_SIZE = 9
const NO_CARS: Car[] = []

/** Solo los filtros discretos y el orden muestran esqueletos; búsqueda y sliders filtran al momento. */
function discreteKey(f: Filters, sort: SortKey) {
  return JSON.stringify([f.marcas, f.modelo, f.combustibles, f.cambios, f.etiquetas, f.carrocerias, sort])
}

function SkeletonGrid() {
  return (
    <div aria-hidden="true" className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <CarCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default function ListingPage() {
  useDocumentTitle(null)
  const cars = useCars()
  const catalog = cars.status === 'success' ? cars.data : NO_CARS
  const { filters, sort, setFilters, setSort, clearAll } = useListingQuery()
  const { search } = useLocation()
  useEffect(() => rememberListingSearch(search), [search])
  const isDesktop = useMediaQuery(MEDIA.lg)
  const [sheetOpen, setSheetOpen] = useState(false)

  const results = useMemo(() => sortCars(filterCars(catalog, filters), sort), [catalog, filters, sort])
  const chips = useMemo(() => activeFilters(filters), [filters])
  const brands = useMemo(() => brandFacets(catalog), [catalog])
  const models = useMemo(() => modelGroups(catalog, filters.marcas), [catalog, filters.marcas])
  const refreshing = useSimulatedRefresh(discreteKey(filters, sort), latency.apiMs)
  const loading = cars.status === 'loading' || refreshing

  // La paginación vuelve a la primera página cuando cambian la búsqueda, los filtros o el orden.
  const listKey = toListingParams({ filters, sort }).toString()
  const [page, setPage] = useState({ key: listKey, limit: PAGE_SIZE })
  const limit = page.key === listKey ? page.limit : PAGE_SIZE
  const [loadingMore, setLoadingMore] = useState(false)
  const loadMoreTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const listRef = useRef<HTMLUListElement>(null)
  const focusIndex = useRef<number | null>(null)

  useEffect(() => () => clearTimeout(loadMoreTimer.current), [])

  // Tras «Cargar más», el foco pasa al primer coche nuevo para que el teclado no vuelva al principio.
  useEffect(() => {
    if (focusIndex.current === null) return
    listRef.current?.children[focusIndex.current]?.querySelector<HTMLElement>('h3 a')?.focus()
    focusIndex.current = null
  }, [limit])

  function loadMore() {
    setLoadingMore(true)
    loadMoreTimer.current = setTimeout(() => {
      focusIndex.current = limit
      setPage({ key: listKey, limit: limit + PAGE_SIZE })
      setLoadingMore(false)
    }, latency.loadMoreMs)
  }

  function removeChip(id: string) {
    const chip = chips.find((c) => c.id === id)
    if (chip) setFilters(chip.remove)
  }

  function applySheet(next: Filters) {
    setFilters(next)
    setSheetOpen(false)
  }

  const total = results.length
  const shown = Math.min(limit, total)
  const remaining = total - shown

  return (
    <div className="mx-auto max-w-[1280px] px-4 pt-4 pb-10 sm:px-6 sm:pt-8 sm:pb-16">
      {/* En móvil el diseño no muestra la cabecera de la página, pero el h1 sigue ahí para lectores de pantalla. */}
      <div className="sr-only flex-col gap-1.5 sm:not-sr-only sm:mb-7 sm:flex">
        <p className="text-[13px] font-bold tracking-[0.08em] text-accent uppercase">Coches de segunda mano</p>
        <h1 className="text-[34px] leading-[1.15] font-extrabold tracking-[-0.03em]">Encuentra tu próximo coche</h1>
        <p className="text-base text-muted">Todos revisados, con historial verificado y precio final sin sorpresas.</p>
      </div>

      <div className="lg:flex lg:items-start lg:gap-7">
        <FiltersSidebar
          className="hidden w-[300px] flex-none lg:block"
          filters={filters}
          brands={brands}
          models={models}
          activeCount={chips.length}
          onChange={(patch, { continuous }) => setFilters((f) => ({ ...f, ...patch }), { replace: continuous })}
          onToggleBrand={(brand) => setFilters((f) => toggleBrand(catalog, f, brand))}
          onClearAll={clearAll}
        />

        <section aria-labelledby="resultados" className="flex min-w-0 flex-1 flex-col gap-3.5 sm:gap-4">
          {/* En móvil va dentro de la cabecera fija, como en el diseño (Listado-movil.dc.html). */}
          <LayoutSlot name="headerToolbar">
            <div className="flex gap-2 lg:hidden">
              <Button
                variant="dark"
                className="flex-1 font-extrabold"
                aria-haspopup="dialog"
                aria-expanded={sheetOpen}
                onClick={() => setSheetOpen(true)}
              >
                <FiltersIcon size={18} />
                Filtros
                {chips.length > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] tabular-nums">
                    {chips.length}
                    {' '}<span className="sr-only">{chips.length === 1 ? 'activo' : 'activos'}</span>
                  </span>
                )}
              </Button>
              <SortSelect options={SORTS} value={sort} onChange={setSort} compact className="flex-1" />
            </div>
          </LayoutSlot>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id="resultados" aria-live="polite" className="text-[17px] font-extrabold tabular-nums sm:text-xl">
              {cars.status === 'loading' ? 'Buscando coches…' : pluralize(total, 'coche encontrado', 'coches encontrados')}
            </h2>
            <SortSelect options={SORTS} value={sort} onChange={setSort} className="hidden lg:flex" />
          </div>

          <ActiveFilterChips chips={chips} onRemove={removeChip} onClearAll={clearAll} />

          {cars.status === 'error' ? (
            <EmptyState illustration="search" title="No hemos podido cargar los coches" description="Revisa tu conexión y vuelve a intentarlo.">
              <Button size="lg" onClick={cars.retry}>
                Reintentar
              </Button>
            </EmptyState>
          ) : loading ? (
            <div aria-busy="true">
              <span className="sr-only">Cargando resultados</span>
              <SkeletonGrid />
            </div>
          ) : total === 0 ? (
            <EmptyState
              illustration="search"
              title="No hay coches con estos filtros"
              description="Prueba a ampliar el rango de precio o kilómetros, o quita alguno de los filtros activos."
            >
              <Button size="lg" block className="sm:w-auto" onClick={clearAll}>
                Limpiar filtros
              </Button>
              <Button variant="ghost" className="no-underline! lg:hidden" onClick={() => setSheetOpen(true)}>
                Ajustar filtros
              </Button>
            </EmptyState>
          ) : (
            <>
              <ul ref={listRef} className="grid animate-fade-up grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                {results.slice(0, limit).map((car) => (
                  <li key={car.id} className="flex">
                    <CarCardContainer car={car} className="w-full" />
                  </li>
                ))}
              </ul>
              <div className="flex flex-col items-center gap-2.5 py-3">
                <span className="text-[13px] text-muted tabular-nums">
                  Mostrando {shown} de {total}
                </span>
                {remaining > 0 && (
                  <Button variant="secondary" size="lg" block className="sm:w-auto sm:px-7" onClick={loadingMore ? undefined : loadMore} aria-disabled={loadingMore}>
                    {loadingMore ? 'Cargando…' : `Cargar más coches (${remaining})`}
                  </Button>
                )}
              </div>
            </>
          )}

          <CompareBarContainer cars={catalog} className="sticky bottom-4 z-20 mt-2 sm:bottom-5" />
        </section>
      </div>

      {sheetOpen && !isDesktop && cars.status === 'success' && (
        <MobileFiltersSheet cars={catalog} filters={filters} onApply={applySheet} onClose={() => setSheetOpen(false)} />
      )}
    </div>
  )
}
