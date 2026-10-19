import type { ReactNode } from 'react'
import { CarCard } from '../components/CarCard'
import { cuotaDesde } from '../lib/finance'
import { MAX_COMPARE, useCompare } from '../store/compare'
import { useFavorites } from '../store/favorites'
import type { Car } from '../types'

interface CarCardContainerProps {
  car: Car
  photoBadge?: ReactNode
  meta?: ReactNode
  headingLevel?: 'h2' | 'h3'
  className?: string
}

/** Conecta `CarCard` con favoritos, comparador y la cuota estándar. */
export function CarCardContainer({ car, ...rest }: CarCardContainerProps) {
  const isFavorite = useFavorites((s) => s.items.some((f) => f.id === car.id))
  const toggleFavorite = useFavorites((s) => s.toggle)
  const isComparing = useCompare((s) => s.ids.includes(car.id))
  const compareFull = useCompare((s) => s.ids.length >= MAX_COMPARE)
  const toggleCompare = useCompare((s) => s.toggle)

  return (
    <CarCard
      car={car}
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
