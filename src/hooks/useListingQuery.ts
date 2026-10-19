import { useCallback, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { DEFAULT_FILTERS, type Filters, type SortKey } from '../lib/filters'
import { parseListingParams, toListingParams } from '../lib/url'

/** Mismos parámetros y valores, sin importar el orden (el buscador añade `q` al final). */
function sameParams(a: URLSearchParams, b: URLSearchParams) {
  const key = (p: URLSearchParams) => [...p].map(([k, v]) => `${k}=${v}`).sort().join('&')
  return key(a) === key(b)
}

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

  // Si la URL trae valores inválidos o sin ajustar (`?orden=raro`, `precioMax=30260`), se reescribe limpia
  // para que lo que se comparte coincida con lo que se ve.
  const canonical = useMemo(() => toListingParams({ filters, sort }), [filters, sort])
  useEffect(() => {
    if (!sameParams(params, canonical)) setParams(canonical, { replace: true, preventScrollReset: true })
  }, [params, canonical, setParams])

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
