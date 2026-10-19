import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FavoriteEntry {
  id: string
  /** Momento en que se guardó (ISO), para mostrar «Guardado hace 2 días». */
  savedAt: string
}

interface FavoritesState {
  /** Más recientes primero. */
  items: FavoriteEntry[]
  toggle: (id: string) => void
  remove: (id: string) => void
  clear: () => void
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set) => ({
      items: [],
      toggle: (id) =>
        set((s) =>
          s.items.some((f) => f.id === id)
            ? { items: s.items.filter((f) => f.id !== id) }
            : { items: [{ id, savedAt: new Date().toISOString() }, ...s.items] },
        ),
      remove: (id) => set((s) => ({ items: s.items.filter((f) => f.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'rueda:favoritos', version: 1 },
  ),
)

export const useIsFavorite = (id: string) => useFavorites((s) => s.items.some((f) => f.id === id))
export const useFavoriteCount = () => useFavorites((s) => s.items.length)
