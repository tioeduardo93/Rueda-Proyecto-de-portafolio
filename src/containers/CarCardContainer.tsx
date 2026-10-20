import type { ReactNode } from 'react'
import { CarCard } from '../components/CarCard'
import { carPhotos } from '../lib/car'
import { cuotaDesde } from '../lib/finance'
import { MAX_COMPARE, useCompare } from '../store/compare'
import { useFavorites, useIsFavorite } from '../store/favorites'
import type { Car } from '../types'

interface CarCardContainerProps {
  car: Car
  photoBadge?: ReactNode
  meta?: ReactNode
  headingLevel?: 'h2' | 'h3'
  priority?: boolean
  className?: string
}

/** Conecta `CarCard` con sus fotos, favoritos, comparador y la cuota estándar. */
export function CarCardContainer({ car, ...rest }: CarCardContainerProps) {
  const isFavorite = useIsFavorite(car.id)
  const toggleFavorite = useFavorites((s) => s.toggle)
  const isComparing = useCompare((s) => s.ids.includes(car.id))
  const compareFull = useCompare((s) => s.ids.length >= MAX_COMPARE)
  const toggleCompare = useCompare((s) => s.toggle)

  return (
    <CarCard
      car={car}
      photos={carPhotos(car)}
      monthlyFee={cuotaDesde(car.precio)}
      isFavorite={isFavorite}
      onToggleFavorite={() => toggleFavorite(car.id)}
      isComparing={isComparing}
      compareDisabled={!isComparing && compareFull}
      onToggleCompare={() => toggleCompare(car.id)}
      {...rest}
    />
  )
}
