import {
  BODY_TYPES,
  DEFAULT_FILTERS,
  DEFAULT_SORT,
  DGT_LABELS,
  FUELS,
  GEARBOXES,
  RANGE_KEYS,
  RANGES,
  SORTS,
  type Filters,
  type Range,
  type RangeKey,
  type SortKey,
} from './filters'

/**
 * Nombres de los parámetros de la URL. Listas separadas por comas y rangos con mín./máx. por separado:
 * /?q=leon&marca=SEAT,Toyota&precioMax=30000&anioMin=2020&combustible=Híbrido&orden=precio-asc
 */
export const PARAMS = {
  q: 'q',
  marcas: 'marca',
  modelo: 'modelo',
  combustibles: 'combustible',
  cambios: 'cambio',
  etiquetas: 'etiqueta',
  carrocerias: 'carroceria',
  orden: 'orden',
} as const

const rangeParams = (key: RangeKey) => [`${key}Min`, `${key}Max`] as const

export interface ListingQuery {
  filters: Filters
  sort: SortKey
}

function readList<T extends string>(params: URLSearchParams, name: string, allowed?: readonly T[]): T[] {
  const values = (params.get(name) ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
  const valid = allowed ? values.filter((v): v is T => (allowed as readonly string[]).includes(v)) : (values as T[])
  return [...new Set(valid)]
}

function readRange(params: URLSearchParams, key: RangeKey): Range {
  const { min, max, step } = RANGES[key]
  const [minName, maxName] = rangeParams(key)
  const read = (name: string, fallback: number) => {
    const raw = params.get(name)
    const n = raw === null || raw.trim() === '' ? NaN : Number(raw)
    if (!Number.isFinite(n)) return fallback
    // Dentro de los límites y ajustado al paso del slider.
    return Math.min(max, Math.max(min, min + Math.round((n - min) / step) * step))
  }
  const lo = read(minName, min)
  const hi = read(maxName, max)
  return lo <= hi ? [lo, hi] : [hi, lo]
}

/** Lee filtros y orden de la URL. Lo que no es válido se ignora en vez de romper la página. */
export function parseListingParams(params: URLSearchParams): ListingQuery {
  const marcas = readList(params, PARAMS.marcas)
  const sort = params.get(PARAMS.orden)
  const filters: Filters = {
    q: params.get(PARAMS.q) ?? '',
    marcas,
    // Sin marca, el selector de modelo está deshabilitado: un modelo suelto no tiene sentido.
    modelo: marcas.length ? (params.get(PARAMS.modelo)?.trim() ?? '') : '',
    precio: readRange(params, 'precio'),
    anio: readRange(params, 'anio'),
    km: readRange(params, 'km'),
    combustibles: readList(params, PARAMS.combustibles, FUELS),
    cambios: readList(params, PARAMS.cambios, GEARBOXES),
    etiquetas: readList(params, PARAMS.etiquetas, DGT_LABELS),
    carrocerias: readList(params, PARAMS.carrocerias, BODY_TYPES),
  }
  return {
    filters,
    sort: SORTS.some((s) => s.value === sort) ? (sort as SortKey) : DEFAULT_SORT,
  }
}

/** Escribe solo lo que difiere de los valores por defecto, para que las URL sean cortas y legibles. */
export function toListingParams({ filters: f, sort }: ListingQuery): URLSearchParams {
  const params = new URLSearchParams()
  if (f.q.trim()) params.set(PARAMS.q, f.q)
  if (f.marcas.length) params.set(PARAMS.marcas, f.marcas.join(','))
  if (f.modelo) params.set(PARAMS.modelo, f.modelo)
  for (const key of RANGE_KEYS) {
    const [minName, maxName] = rangeParams(key)
    const [lo, hi] = f[key]
    if (lo !== DEFAULT_FILTERS[key][0]) params.set(minName, String(lo))
    if (hi !== DEFAULT_FILTERS[key][1]) params.set(maxName, String(hi))
  }
  if (f.combustibles.length) params.set(PARAMS.combustibles, f.combustibles.join(','))
  if (f.cambios.length) params.set(PARAMS.cambios, f.cambios.join(','))
  if (f.etiquetas.length) params.set(PARAMS.etiquetas, f.etiquetas.join(','))
  if (f.carrocerias.length) params.set(PARAMS.carrocerias, f.carrocerias.join(','))
  if (sort !== DEFAULT_SORT) params.set(PARAMS.orden, sort)
  return params
}

/** Enlace al listado con algunos filtros ya puestos (coches similares, búsquedas populares…). */
export function listingHref(filters: Partial<Filters> = {}, sort: SortKey = DEFAULT_SORT): string {
  const qs = toListingParams({ filters: { ...DEFAULT_FILTERS, ...filters }, sort }).toString()
  return qs ? `/?${qs}` : '/'
}
