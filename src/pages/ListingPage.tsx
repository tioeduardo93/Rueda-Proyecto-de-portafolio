import { Button } from '../components/Button'
import { CarCardSkeleton } from '../components/CarCardSkeleton'
import { EmptyState } from '../components/EmptyState'
import { CarCardContainer } from '../containers/CarCardContainer'
import { CompareBarContainer } from '../containers/CompareBarContainer'
import { useCars } from '../hooks/useCars'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { pluralize } from '../lib/format'

/**
 * Listado (versión de la fase 1): catálogo completo con esqueletos, favoritos y comparador.
 * Buscador, filtros, orden, URL y «Cargar más» llegan en la fase 2.
 */
export default function ListingPage() {
  useDocumentTitle(null)
  const cars = useCars()

  return (
    <div className="mx-auto max-w-[1280px] px-4 pt-4 pb-28 sm:px-6 sm:pt-8 sm:pb-16">
      {/* En móvil el diseño no muestra la cabecera de la página, pero el h1 sigue ahí para lectores de pantalla. */}
      <div className="sr-only flex-col gap-1.5 sm:not-sr-only sm:mb-7 sm:flex">
        <p className="text-[13px] font-bold tracking-[0.08em] text-accent uppercase">Coches de segunda mano</p>
        <h1 className="text-[34px] leading-[1.15] font-extrabold tracking-[-0.03em]">Encuentra tu próximo coche</h1>
        <p className="text-base text-muted">Todos revisados, con historial verificado y precio final sin sorpresas.</p>
      </div>

      <section aria-labelledby="resultados" className="flex flex-col gap-4">
        <h2 id="resultados" className="text-[17px] font-extrabold tabular-nums sm:text-xl" aria-live="polite">
          {cars.status === 'success' ? `${pluralize(cars.data.length, 'coche encontrado', 'coches encontrados')}` : 'Buscando coches…'}
        </h2>

        {cars.status === 'loading' && (
          <div aria-busy="true" className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <CarCardSkeleton key={i} />
            ))}
          </div>
        )}

        {cars.status === 'error' && (
          <EmptyState
            illustration="search"
            title="No hemos podido cargar los coches"
            description="Revisa tu conexión y vuelve a intentarlo."
          >
            <Button size="lg" onClick={cars.retry}>
              Reintentar
            </Button>
          </EmptyState>
        )}

        {cars.status === 'success' && (
          <>
            <ul className="grid animate-fade-up grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {cars.data.map((car) => (
                <li key={car.id} className="flex">
                  <CarCardContainer car={car} className="w-full" />
                </li>
              ))}
            </ul>
            <CompareBarContainer
              cars={cars.data}
              className="fixed inset-x-3 bottom-4 z-20 sm:sticky sm:inset-x-auto sm:bottom-5 sm:mt-2"
            />
          </>
        )}
      </section>
    </div>
  )
}
