import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { DEFAULT_FILTERS, type Filters, type SortKey } from '../lib/filters'
import { parseListingParams, toListingParams } from '../lib/url'

export interface UpdateOptions {
  /**
   * Sustituye la entrada del historial en vez de añadir una. Para cambios continuos
   * (arrastrar un slider, escribir) que no deberían llenar el botón «Atrás».
   */
  replace?: boolean
}

/** Filtros y orden del listado, con la URL como única fuente de verdad. */
export function useListingQuery() {
  const [params, setParams] = useSearchParams()
  const { filters, sort } = useMemo(() => parseListingParams(params), [params])

  const write = useCallback(
    (next: (current: { filters: Filters; sort: SortKey }) => { filters: Filters; sort: SortKey }, { replace }: UpdateOptions = {}) =>
      setParams((prev) => toListingParams(next(parseListingParams(prev))), { replace, preventScrollReset: true }),
    [setParams],
  )

  const setFilters = useCallback(
    (update: Filters | ((f: Filters) => Filters), options?: UpdateOptions) =>
      write((q) => ({ ...q, filters: typeof update === 'function' ? update(q.filters) : update }), options),
    [write],
  )

  const setSort = useCallback((sort: SortKey) => write((q) => ({ ...q, sort })), [write])

  /** Quita filtros y búsqueda; conserva el orden. */
  const clearAll = useCallback(() => write((q) => ({ ...q, filters: DEFAULT_FILTERS })), [write])

  return { filters, sort, setFilters, setSort, clearAll }
}
