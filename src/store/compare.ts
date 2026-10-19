import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const MAX_COMPARE = 3

interface CompareState {
  /** Ids en el orden en que se añadieron. */
  ids: string[]
  toggle: (id: string) => void
  remove: (id: string) => void
  /** Sustituye la selección (se recorta a `MAX_COMPARE`). */
  set: (ids: string[]) => void
  clear: () => void
}

export const useCompare = create<CompareState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) =>
        set((s) => {
          if (s.ids.includes(id)) return { ids: s.ids.filter((x) => x !== id) }
          if (s.ids.length >= MAX_COMPARE) return s
          return { ids: [...s.ids, id] }
        }),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      set: (ids) => set({ ids: [...new Set(ids)].slice(0, MAX_COMPARE) }),
      clear: () => set({ ids: [] }),
    }),
    { name: 'rueda:comparador', version: 1 },
  ),
)
