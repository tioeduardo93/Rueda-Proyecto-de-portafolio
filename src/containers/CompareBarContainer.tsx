import { CompareBar } from '../components/CompareBar'
import { MAX_COMPARE, useCompare } from '../store/compare'
import type { Car } from '../types'

/** Barra del comparador con la selección actual. No se pinta si no hay coches seleccionados. */
export function CompareBarContainer({ cars, className }: { cars: Car[]; className?: string }) {
  const ids = useCompare((s) => s.ids)
  const remove = useCompare((s) => s.remove)

  const items = ids.flatMap((id) => {
    const car = cars.find((c) => c.id === id)
    return car ? [{ id, name: `${car.marca} ${car.modelo}` }] : []
  })
  if (items.length === 0) return null

  return <CompareBar items={items} max={MAX_COMPARE} onRemove={remove} to="/comparar" className={className} />
}
