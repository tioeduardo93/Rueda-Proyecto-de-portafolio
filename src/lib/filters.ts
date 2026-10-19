import type { Cambio, Car, Carroceria, Combustible, EtiquetaDgt } from '../types'
import { formatKm, formatPrice } from './format'

export const RANGES = {
  precio: { label: 'Precio', min: 3000, max: 60000, step: 500, format: formatPrice },
  anio: { label: 'Año', min: 2010, max: 2025, step: 1, format: String },
  km: { label: 'Kilómetros', min: 0, max: 200000, step: 5000, format: formatKm },
} as const

export type RangeKey = keyof typeof RANGES
export type Range = [number, number]

export const RANGE_KEYS = Object.keys(RANGES) as RangeKey[]
export const FUELS: Combustible[] = ['Gasolina', 'Diésel', 'Híbrido', 'Eléctrico']
export const GEARBOXES: Cambio[] = ['Manual', 'Automático']
export const DGT_LABELS: EtiquetaDgt[] = ['0', 'ECO', 'C', 'B']
export const BODY_TYPES: Carroceria[] = ['Utilitario', 'Compacto', 'Berlina', 'Familiar', 'SUV']

export const SORTS = [
  { value: 'recientes', label: 'Más recientes', shortLabel: 'Más recientes' },
  { value: 'precio-asc', label: 'Precio: de menor a mayor', shortLabel: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: de mayor a menor', shortLabel: 'Precio: mayor a menor' },
  { value: 'km', label: 'Menos kilómetros', shortLabel: 'Menos kilómetros' },
  { value: 'anio', label: 'Año: más nuevos', shortLabel: 'Año: más nuevos' },
] as const

export type SortKey = (typeof SORTS)[number]['value']
export const DEFAULT_SORT: SortKey = 'recientes'

export interface Filters {
  q: string
  marcas: string[]
  modelo: string
  precio: Range
  anio: Range
  km: Range
  combustibles: Combustible[]
  cambios: Cambio[]
  etiquetas: EtiquetaDgt[]
  /** Sin control en la barra lateral: llega desde enlaces («Ver más compactos», búsquedas populares). */
  carrocerias: Carroceria[]
}

export const DEFAULT_FILTERS: Filters = {
  q: '',
  marcas: [],
  modelo: '',
  precio: [RANGES.precio.min, RANGES.precio.max],
  anio: [RANGES.anio.min, RANGES.anio.max],
  km: [RANGES.km.min, RANGES.km.max],
  combustibles: [],
  cambios: [],
  etiquetas: [],
  carrocerias: [],
}

export function toggle<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

/** Minúsculas y sin tildes: «leon» encuentra «León». */
export function normalize(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

/** Todas las palabras de la búsqueda deben aparecer en marca, modelo o versión, en cualquier orden. */
export function matchesQuery(car: Car, query: string): boolean {
  const words = normalize(query).split(/\s+/).filter(Boolean)
  if (words.length === 0) return true
  const haystack = normalize(`${car.marca} ${car.modelo} ${car.version}`)
  return words.every((w) => haystack.includes(w))
}

const inRange = (value: number, [lo, hi]: Range) => value >= lo && value <= hi
const anyOf = <T>(selected: readonly T[], value: T) => selected.length === 0 || selected.includes(value)

export function filterCars(cars: readonly Car[], f: Filters): Car[] {
  return cars.filter(
    (car) =>
      matchesQuery(car, f.q) &&
      anyOf(f.marcas, car.marca) &&
      (!f.modelo || car.modelo === f.modelo) &&
      inRange(car.precio, f.precio) &&
      inRange(car.anio, f.anio) &&
      inRange(car.km, f.km) &&
      anyOf(f.combustibles, car.combustible) &&
      anyOf(f.cambios, car.cambio) &&
      anyOf(f.etiquetas, car.etiqueta) &&
      anyOf(f.carrocerias, car.carroceria),
  )
}

const COMPARATORS: Record<SortKey, (a: Car, b: Car) => number> = {
  recientes: (a, b) => b.publicadoEl.localeCompare(a.publicadoEl),
  'precio-asc': (a, b) => a.precio - b.precio,
  'precio-desc': (a, b) => b.precio - a.precio,
  km: (a, b) => a.km - b.km,
  anio: (a, b) => b.anio - a.anio,
}

/** Orden estable: a igualdad, el más reciente primero y después por id. */
export function sortCars(cars: readonly Car[], sort: SortKey): Car[] {
  return [...cars].sort(
    (a, b) => COMPARATORS[sort](a, b) || COMPARATORS.recientes(a, b) || a.id.localeCompare(b.id),
  )
}

export interface BrandFacet {
  name: string
  count: number
}

/** Marcas del catálogo, las que más coches tienen primero. */
export function brandFacets(cars: readonly Car[]): BrandFacet[] {
  const counts = new Map<string, number>()
  for (const car of cars) counts.set(car.marca, (counts.get(car.marca) ?? 0) + 1)
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'es'))
}

export interface ModelGroup {
  marca: string
  modelos: string[]
}

/** Modelos disponibles de las marcas elegidas, agrupados por marca. */
export function modelGroups(cars: readonly Car[], marcas: readonly string[]): ModelGroup[] {
  return marcas.map((marca) => ({
    marca,
    modelos: [...new Set(cars.filter((c) => c.marca === marca).map((c) => c.modelo))].sort((a, b) =>
      a.localeCompare(b, 'es'),
    ),
  }))
}

/** Marca o desmarca una marca. El modelo se conserva solo si sigue perteneciendo a alguna marca elegida. */
export function toggleBrand(cars: readonly Car[], f: Filters, marca: string): Filters {
  const marcas = toggle(f.marcas, marca)
  const keepModel = cars.some((c) => c.modelo === f.modelo && marcas.includes(c.marca))
  return { ...f, marcas, modelo: keepModel ? f.modelo : '' }
}

export function isDefaultRange(key: RangeKey, [lo, hi]: Range): boolean {
  return lo === RANGES[key].min && hi === RANGES[key].max
}

/** «Hasta 30.000 €», «Desde 2020», «2018 – 2022». */
export function rangeLabel(key: RangeKey, [lo, hi]: Range): string {
  const { min, max, format } = RANGES[key]
  if (lo === min) return `Hasta ${format(hi)}`
  if (hi === max) return `Desde ${format(lo)}`
  return `${format(lo)} – ${format(hi)}`
}

export interface ActiveFilter {
  id: string
  label: string
  /** Devuelve los filtros sin este. */
  remove: (f: Filters) => Filters
}

/** Filtros activos como chips, en el orden de la barra lateral. La búsqueda no cuenta: ya está en su campo. */
export function activeFilters(f: Filters): ActiveFilter[] {
  const chips: ActiveFilter[] = []
  for (const marca of f.marcas) {
    // Al quitar una marca se quita también el modelo, como en el diseño.
    chips.push({ id: `marca:${marca}`, label: marca, remove: (x) => ({ ...x, marcas: x.marcas.filter((m) => m !== marca), modelo: '' }) })
  }
  if (f.modelo) chips.push({ id: 'modelo', label: f.modelo, remove: (x) => ({ ...x, modelo: '' }) })
  for (const key of RANGE_KEYS) {
    if (isDefaultRange(key, f[key])) continue
    chips.push({ id: key, label: rangeLabel(key, f[key]), remove: (x) => ({ ...x, [key]: DEFAULT_FILTERS[key] }) })
  }
  for (const v of f.combustibles) chips.push({ id: `combustible:${v}`, label: v, remove: (x) => ({ ...x, combustibles: toggle(x.combustibles, v) }) })
  for (const v of f.cambios) chips.push({ id: `cambio:${v}`, label: v, remove: (x) => ({ ...x, cambios: toggle(x.cambios, v) }) })
  for (const v of f.etiquetas) chips.push({ id: `etiqueta:${v}`, label: `Etiqueta ${v}`, remove: (x) => ({ ...x, etiquetas: toggle(x.etiquetas, v) }) })
  for (const v of f.carrocerias) chips.push({ id: `carroceria:${v}`, label: v, remove: (x) => ({ ...x, carrocerias: toggle(x.carrocerias, v) }) })
  return chips
}
