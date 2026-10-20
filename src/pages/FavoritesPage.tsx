import { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router'
import { Badge } from '../components/Badge'
import { Button, ButtonLink } from '../components/Button'
import { CarCardSkeleton } from '../components/CarCardSkeleton'
import { EmptyState } from '../components/EmptyState'
import { CompareIcon } from '../components/icons'
import { MobilePageHeader } from '../components/MobilePageHeader'
import { LayoutSlot } from '../layout/slots'
import { PopularSearches } from '../components/PopularSearches'
import { CarCardContainer } from '../containers/CarCardContainer'
import { useCars } from '../hooks/useCars'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { priceDrop } from '../lib/car'
import { formatPrice, formatRelativeDays, pluralize } from '../lib/format'
import { lastListingHref } from '../lib/listingMemory'
import { listingHref } from '../lib/url'
import { MAX_COMPARE, useCompare } from '../store/compare'
import { useFavorites } from '../store/favorites'
import type { Car } from '../types'

const NO_CARS: Car[] = []

const POPULAR_SEARCHES = [
  { label: 'Híbridos ECO', to: listingHref({ combustibles: ['Híbrido'], etiquetas: ['ECO'] }) },
  { label: 'SUV hasta 25.000 €', to: listingHref({ carrocerias: ['SUV'], precio: [3000, 25000] }) },
  { label: 'Eléctricos', to: listingHref({ combustibles: ['Eléctrico'] }) },
  { label: 'Automáticos', to: listingHref({ cambios: ['Automático'] }) },
]

const GRID = 'grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3'

export default function FavoritesPage() {
  useDocumentTitle('Tus favoritos')
  const cars = useCars()
  const catalog = cars.status === 'success' ? cars.data : NO_CARS
  const items = useFavorites((s) => s.items)
  const setCompare = useCompare((s) => s.set)
  const navigate = useNavigate()

  // Más recientes primero, por fecha de guardado. Los que ya no están en el catálogo no se muestran
  // (el layout los borra del store en cuanto llega el catálogo).
  const favorites = useMemo(
    () =>
      items
        .flatMap((f) => catalog.filter((c) => c.id === f.id).map((car) => ({ car, savedAt: new Date(f.savedAt) })))
        .sort((a, b) => b.savedAt.getTime() - a.savedAt.getTime()),
    [items, catalog],
  )
  const count = favorites.length

  // Al quitar un favorito su tarjeta desaparece y el foco caería en el <body>: pasa a la tarjeta que ocupa
  // su sitio o, si no queda ninguna, a «Explorar coches».
  const contentRef = useRef<HTMLDivElement>(null)
  const previousIds = useRef<string[]>([])
  const ids = favorites.map((f) => f.car.id).join(',')
  useEffect(() => {
    const current = ids ? ids.split(',') : []
    const removedAt = previousIds.current.findIndex((id) => !current.includes(id))
    previousIds.current = current
    if (removedAt === -1 || document.activeElement !== document.body) return
    const titles = contentRef.current?.querySelectorAll<HTMLElement>('article h2 a')
    const target = titles?.[Math.min(removedAt, titles.length - 1)] ?? contentRef.current?.querySelector<HTMLElement>('a[href="/"]')
    target?.focus()
  }, [ids])

  function compareFavorites() {
    setCompare(favorites.slice(0, MAX_COMPARE).map((f) => f.car.id))
    navigate('/comparar')
  }

  const loading = cars.status === 'loading'
  const backTo = lastListingHref()

  return (
    <>
      <LayoutSlot name="mobileHeader">
        <MobilePageHeader
          title="Favoritos"
          backTo={backTo}
          aside={
            count > 0 && (
              <span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-white tabular-nums">
                {count}
                {' '}<span className="sr-only">{count === 1 ? 'coche guardado' : 'coches guardados'}</span>
              </span>
            )
          }
        />
      </LayoutSlot>

      <div ref={contentRef} className="mx-auto flex max-w-[1280px] flex-col gap-5 px-4 pt-5 pb-10 sm:px-6 lg:gap-6 lg:pt-8 lg:pb-[72px]">
        <div className="flex flex-wrap items-end justify-between gap-4 empty:hidden">
          <div className="flex flex-col gap-1.5">
            {/* En móvil el h1 es el de MobilePageHeader. */}
            <h1 className="hidden text-[34px] font-extrabold tracking-[-0.03em] lg:block">Tus favoritos</h1>
            {count > 0 && (
              <p className="text-[15px] text-muted tabular-nums">
                {pluralize(count, 'coche guardado', 'coches guardados')}. Te avisamos si alguno baja de precio.
              </p>
            )}
          </div>
          {count >= 2 && (
            <div className="flex w-full flex-col items-stretch gap-1.5 sm:w-auto sm:items-end">
              <Button size="lg" onClick={compareFavorites}>
                <CompareIcon />
                Comparar favoritos
              </Button>
              {count > MAX_COMPARE && (
                <span className="text-xs text-muted">Se comparan los {MAX_COMPARE} guardados más recientes.</span>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div aria-busy="true">
            <span className="sr-only" role="status">
              Cargando tus favoritos…
            </span>
            <div className={GRID}>
              {Array.from({ length: Math.min(Math.max(items.length, 1), 3) }, (_, i) => (
                <CarCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : cars.status === 'error' ? (
          <EmptyState illustration="search" title="No hemos podido cargar tus favoritos" description="Revisa tu conexión y vuelve a intentarlo.">
            <Button size="lg" onClick={cars.retry}>
              Reintentar
            </Button>
          </EmptyState>
        ) : count === 0 ? (
          <EmptyState
            illustration="favorites"
            title="Aún no tienes favoritos"
            description={
              <>
                <span className="lg:hidden">Toca el corazón de cualquier coche para guardarlo aquí. Te avisaremos si baja de precio.</span>
                <span className="max-lg:hidden">Toca el corazón de cualquier coche para guardarlo aquí y compararlo cuando quieras.</span>
              </>
            }
          >
            <ButtonLink to="/" size="xl" block className="mt-1 h-[52px]! rounded-[14px] sm:w-auto lg:h-12! lg:rounded-btn lg:text-[15px]">
              Explorar coches
            </ButtonLink>
            <PopularSearches searches={POPULAR_SEARCHES} className="mt-7 lg:hidden" />
          </EmptyState>
        ) : (
          <ul className={GRID}>
            {favorites.map(({ car, savedAt }, i) => {
              const drop = priceDrop(car)
              return (
                <li key={car.id} className="flex animate-fade-up">
                  <CarCardContainer
                    car={car}
                    priority={i === 0}
                    headingLevel="h2"
                    className="w-full"
                    photoBadge={drop > 0 ? <Badge tone="solid">Ha bajado {formatPrice(drop)}</Badge> : null}
                    meta={<span className="tabular-nums">Guardado {formatRelativeDays(savedAt)}</span>}
                  />
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
