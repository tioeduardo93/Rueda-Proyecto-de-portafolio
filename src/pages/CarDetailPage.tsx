import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Button, ButtonLink } from '../components/Button'
import { CarMiniCard } from '../components/CarMiniCard'
import { Breadcrumbs } from '../components/detail/Breadcrumbs'
import { CarSummary, INTEREST_SENT_MESSAGE } from '../components/detail/CarSummary'
import { DetailSection } from '../components/detail/DetailSection'
import { DetailSkeleton } from '../components/detail/DetailSkeleton'
import { EquipmentList } from '../components/detail/EquipmentList'
import { FinanceCalculator } from '../components/detail/FinanceCalculator'
import { Gallery } from '../components/detail/Gallery'
import { SpecGrid, type Spec } from '../components/detail/SpecGrid'
import { StickyContactBar } from '../components/detail/StickyContactBar'
import { DgtBadge } from '../components/DgtBadge'
import { EmptyState } from '../components/EmptyState'
import { ChevronLeftIcon, HeartIcon, ShareIcon, ShieldCheckIcon } from '../components/icons'
import { Toast } from '../components/Toast'
import { CarCardContainer } from '../containers/CarCardContainer'
import { useCars } from '../hooks/useCars'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { carName, gearboxLabel, moreOfBodyLabel, photoLabels, priceDrop, similarCars } from '../lib/car'
import {
  FINANCE,
  cuotaDesde,
  defaultDownPayment,
  maxDownPayment,
  simulateFinancing,
} from '../lib/finance'
import { NBSP, formatConsumo, formatKm, formatRegistration, formatRelativeDays } from '../lib/format'
import { lastListingHref } from '../lib/listingMemory'
import { listingHref } from '../lib/url'
import { useFavorites, useIsFavorite } from '../store/favorites'
import type { Car } from '../types'

const TOAST_MS = 3500

const OVERLAY_BUTTON =
  'flex size-11 items-center justify-center rounded-full bg-white/95 text-ink shadow-float no-underline transition-transform motion-safe:active:scale-95'

function specsOf(car: Car): Spec[] {
  return [
    { label: 'Año', value: formatRegistration(car.mes, car.anio) },
    { label: 'Kilómetros', value: formatKm(car.km) },
    { label: 'Combustible', value: car.combustible },
    { label: 'Cambio', value: gearboxLabel(car) },
    { label: 'Potencia', value: `${car.cv} CV` },
    { label: 'Color', value: car.color },
    { label: 'Puertas', value: String(car.puertas) },
    { label: 'Plazas', value: String(car.plazas) },
    { label: 'Carrocería', value: car.carroceria },
    { label: 'Consumo', value: formatConsumo(car.consumo) },
    { label: 'Maletero', value: `${car.maletero}${NBSP}l` },
    { label: 'Etiqueta DGT', value: <DgtBadge label={car.etiqueta} size="sm" /> },
  ]
}

/** En móvil la ficha no tiene cabecera del sitio: en los estados sin foto hace falta una forma de volver. */
function MobileBack() {
  return (
    <div className="border-b border-line bg-surface px-2 py-3 lg:hidden">
      <Link to={lastListingHref()} className="inline-flex min-h-11 items-center gap-1 px-2 text-sm font-bold text-ink no-underline">
        <ChevronLeftIcon />
        Volver a resultados
      </Link>
    </div>
  )
}

export default function CarDetailPage() {
  const { id = '' } = useParams()
  const cars = useCars()
  const car = cars.status === 'success' ? cars.data.find((c) => c.id === id) : undefined
  const notFound = cars.status === 'success' && !car
  useDocumentTitle(car ? `${carName(car)} ${car.version}` : notFound ? 'Coche no encontrado' : null)

  if (cars.status === 'loading') {
    return (
      <div className="mx-auto max-w-[1280px] pb-10 lg:px-6 lg:pt-[84px]">
        <span className="sr-only" role="status">
          Cargando el coche…
        </span>
        <DetailSkeleton />
      </div>
    )
  }

  if (cars.status === 'error' || !car) {
    return (
      <>
        <MobileBack />
        <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-6 sm:py-16">
          {cars.status === 'error' ? (
            <EmptyState illustration="search" headingLevel="h1" title="No hemos podido cargar el coche" description="Revisa tu conexión y vuelve a intentarlo.">
              <Button size="lg" onClick={cars.retry}>
                Reintentar
              </Button>
            </EmptyState>
          ) : (
            <EmptyState
              illustration="search"
              headingLevel="h1"
              title="Este coche ya no está disponible"
              description="Puede que se haya vendido o que el enlace no sea correcto. Hay muchos más esperándote."
            >
              <ButtonLink to="/" size="lg" block className="sm:w-auto">
                Ver todos los coches
              </ButtonLink>
            </EmptyState>
          )}
        </div>
      </>
    )
  }

  // `key`: al pasar a un coche similar, galería y calculadora empiezan de cero.
  return <CarDetail key={car.id} car={car} cars={cars.data} />
}

function CarDetail({ car, cars }: { car: Car; cars: Car[] }) {
  const isFavorite = useIsFavorite(car.id)
  const toggleFavorite = useFavorites((s) => s.toggle)
  const [downPayment, setDownPayment] = useState(() => defaultDownPayment(car.precio))
  const [term, setTerm] = useState<number>(FINANCE.meses)
  const [interestSent, setInterestSent] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), TOAST_MS)
    return () => clearTimeout(timer)
  }, [toast])

  const name = carName(car)
  const monthlyFee = cuotaDesde(car.precio)
  const finance = simulateFinancing(car.precio, downPayment, term)
  const similar = similarCars(car, cars)
  const backTo = lastListingHref()

  function interest() {
    setInterestSent(true)
    setToast(INTEREST_SENT_MESSAGE)
  }

  async function share() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: `${name} · Rueda`, url })
      } catch {
        // El usuario ha cerrado el menú de compartir: no es un error.
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setToast('Enlace copiado')
    } catch {
      setToast('No se ha podido copiar el enlace')
    }
  }

  return (
    <div className="mx-auto max-w-[1280px] pb-8 lg:px-6 lg:pt-5 lg:pb-[72px]">
      <Breadcrumbs
        className="mb-4 hidden lg:flex"
        backTo={backTo}
        crumbs={[
          { label: 'Coches', to: '/' },
          { label: car.marca, to: listingHref({ marcas: [car.marca] }) },
          { label: `${car.modelo} ${car.version}` },
        ]}
      />

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(340px,400px)] lg:items-start lg:gap-x-7 lg:gap-y-6">
        <Gallery
          className="lg:col-start-1 lg:row-start-1"
          title={name}
          photos={photoLabels(car)}
          badge={
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-[13px] font-bold text-ink">
              <ShieldCheckIcon size={16} className="text-accent" />
              Revisado en 150 puntos
            </span>
          }
          overlay={
            <>
              <Link to={backTo} aria-label="Volver a resultados" className={`${OVERLAY_BUTTON} absolute top-3 left-3 lg:hidden`}>
                <ChevronLeftIcon />
              </Link>
              <div className="absolute top-3 right-3 flex gap-2 lg:hidden">
                <button type="button" onClick={share} aria-label="Compartir" className={OVERLAY_BUTTON}>
                  <ShareIcon />
                </button>
                <button
                  type="button"
                  onClick={() => toggleFavorite(car.id)}
                  aria-pressed={isFavorite}
                  aria-label={isFavorite ? `Quitar ${name} de favoritos` : `Añadir ${name} a favoritos`}
                  className={OVERLAY_BUTTON}
                >
                  <HeartIcon size={22} className={isFavorite ? 'fill-fav text-fav' : 'text-ink'} />
                </button>
              </div>
            </>
          }
        />

        <CarSummary
          className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1"
          car={car}
          monthlyFee={monthlyFee}
          priceDrop={priceDrop(car)}
          published={formatRelativeDays(car.publicadoEl)}
          isFavorite={isFavorite}
          onToggleFavorite={() => toggleFavorite(car.id)}
          onInterest={interest}
          interestSent={interestSent}
        />

        <div className="mt-2.5 flex flex-col gap-2.5 lg:col-start-1 lg:row-start-2 lg:mt-0 lg:gap-6">
          <DetailSection title="Ficha técnica">
            <SpecGrid specs={specsOf(car)} />
          </DetailSection>
          <DetailSection title="Equipamiento destacado">
            <EquipmentList items={car.equipamiento} />
          </DetailSection>
          <DetailSection title="Calcula tu financiación">
            <FinanceCalculator
              downPayment={downPayment}
              maxDownPayment={maxDownPayment(car.precio)}
              step={FINANCE.pasoEntrada}
              onDownPaymentChange={setDownPayment}
              term={term}
              terms={FINANCE.plazos}
              onTermChange={setTerm}
              monthly={finance.cuota}
              financed={finance.financiado}
              total={finance.totalAPlazos}
              tin={FINANCE.tin}
            />
          </DetailSection>
          <p className="px-4 text-xs text-muted tabular-nums lg:hidden">
            Ref. {car.referencia} · Publicado {formatRelativeDays(car.publicadoEl)}
          </p>
        </div>
      </div>

      {similar.length > 0 && (
        <section aria-labelledby="similares" className="mt-6 flex flex-col gap-3 lg:mt-7 lg:gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 px-4 lg:px-0">
            <h2 id="similares" className="text-[19px] font-extrabold lg:text-2xl lg:tracking-[-0.02em]">
              Coches similares
            </h2>
            <Link to={listingHref({ carrocerias: [car.carroceria] })} className="inline-flex min-h-11 items-center text-sm font-bold">
              {moreOfBodyLabel(car.carroceria)}
            </Link>
          </div>
          <ul className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:hidden">
            {similar.map((c) => (
              <li key={c.id} className="w-[250px] flex-none snap-start">
                <CarMiniCard car={c} />
              </li>
            ))}
          </ul>
          <ul className="hidden grid-cols-2 gap-5 px-4 sm:grid lg:grid-cols-3 lg:px-0">
            {similar.map((c) => (
              <li key={c.id} className="flex">
                <CarCardContainer car={c} className="w-full" />
              </li>
            ))}
          </ul>
        </section>
      )}

      <StickyContactBar className="lg:hidden" price={car.precio} monthlyFee={monthlyFee} onInterest={interest} />
      <Toast message={toast} className="bottom-24 lg:hidden" />
    </div>
  )
}
