import { useEffect } from 'react'
import { useCompare } from '../store/compare'
import { useFavorites } from '../store/favorites'
import { useCars } from './useCars'

/**
 * Cuando llega el catálogo, borra de favoritos y del comparador los coches que ya no están (anuncios
 * retirados). Va en el layout para que el contador de la cabecera sea correcto en cualquier página.
 */
export function useStaleIdsCleanup() {
  const cars = useCars()
  // El array del catálogo es siempre el mismo (está en caché); el objeto de estado de `useCars` es nuevo en cada render.
  const catalog = cars.status === 'success' ? cars.data : null
  const favoriteIds = useFavorites((s) => s.items.map((f) => f.id).join(','))
  const compareIds = useCompare((s) => s.ids.join(','))

  useEffect(() => {
    if (!catalog) return
    const exists = new Set(catalog.map((c) => c.id))
    const favorites = useFavorites.getState()
    favorites.items.filter((f) => !exists.has(f.id)).forEach((f) => favorites.remove(f.id))
    const compare = useCompare.getState()
    if (compare.ids.some((id) => !exists.has(id))) compare.set(compare.ids.filter((id) => exists.has(id)))
  }, [catalog, favoriteIds, compareIds])
}
