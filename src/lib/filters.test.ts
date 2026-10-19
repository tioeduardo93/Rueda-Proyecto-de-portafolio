import { describe, expect, it } from 'vitest'
import { CARS } from '../data/cars'
import {
  DEFAULT_FILTERS,
  activeFilters,
  brandFacets,
  filterCars,
  matchesQuery,
  modelGroups,
  normalize,
  rangeLabel,
  sortCars,
  toggle,
  toggleBrand,
  type Filters,
} from './filters'
import { NBSP } from './format'

const f = (patch: Partial<Filters>): Filters => ({ ...DEFAULT_FILTERS, ...patch })
const ids = (cars: { id: string }[]) => cars.map((c) => c.id)
const byId = (id: string) => CARS.find((c) => c.id === id)!

describe('búsqueda', () => {
  it('ignora mayúsculas y tildes', () => {
    expect(normalize('León ÉLÉCTRICO')).toBe('leon electrico')
    expect(matchesQuery(byId('leon'), 'seat leon')).toBe(true)
    expect(matchesQuery(byId('captur'), 'e-tech')).toBe(true)
  })

  it('exige todas las palabras, en cualquier orden', () => {
    expect(matchesQuery(byId('leon'), 'leon seat')).toBe(true)
    expect(matchesQuery(byId('leon'), 'seat ibiza')).toBe(false)
  })

  it('busca también en la versión', () => {
    expect(ids(filterCars(CARS, f({ q: 'tdi' })))).toEqual(['golf'])
  })

  it('sin texto no filtra', () => {
    expect(filterCars(CARS, f({ q: '   ' }))).toHaveLength(CARS.length)
  })
})

describe('filterCars', () => {
  it('sin filtros devuelve todo el catálogo', () => {
    expect(filterCars(CARS, DEFAULT_FILTERS)).toHaveLength(24)
  })

  it('filtra por varias marcas (O) y modelo', () => {
    expect(ids(filterCars(CARS, f({ marcas: ['Tesla', 'Opel'] }))).sort()).toEqual(['astra', 'model3', 'modely'])
    expect(ids(filterCars(CARS, f({ marcas: ['Tesla'], modelo: 'Model Y' })))).toEqual(['modely'])
  })

  it('filtra por rangos con los extremos incluidos', () => {
    const cars = filterCars(CARS, f({ precio: [3000, 12990] }))
    expect(ids(cars).sort()).toEqual(['astra', 'c3', 'p208', 'sandero'])
    expect(filterCars(CARS, f({ anio: [2023, 2025] })).every((c) => c.anio >= 2023)).toBe(true)
    expect(ids(filterCars(CARS, f({ km: [100000, 200000] })))).toEqual(['astra'])
  })

  it('combina criterios de distintos grupos (Y)', () => {
    const cars = filterCars(CARS, f({ combustibles: ['Eléctrico'], precio: [3000, 30000] }))
    expect(ids(cars).sort()).toEqual(['id3', 'model3', 'niro'])
  })

  it('filtra por cambio, etiqueta y carrocería', () => {
    expect(filterCars(CARS, f({ cambios: ['Manual'] })).every((c) => c.cambio === 'Manual')).toBe(true)
    expect(ids(filterCars(CARS, f({ etiquetas: ['B'] })))).toEqual(['astra'])
    expect(ids(filterCars(CARS, f({ carrocerias: ['Familiar'] })))).toEqual(['corolla'])
  })

  it('devuelve vacío si nada encaja', () => {
    expect(filterCars(CARS, f({ marcas: ['Tesla'], combustibles: ['Diésel'] }))).toEqual([])
  })
})

describe('sortCars', () => {
  it('ordena por precio en ambos sentidos', () => {
    const asc = sortCars(CARS, 'precio-asc')
    expect(asc[0]?.id).toBe('astra')
    expect(asc.at(-1)?.id).toBe('modely')
    expect(sortCars(CARS, 'precio-desc')[0]?.id).toBe('modely')
  })

  it('ordena por kilómetros y año', () => {
    expect(sortCars(CARS, 'km')[0]?.id).toBe('captur')
    expect(sortCars(CARS, 'anio')[0]?.anio).toBe(2023)
  })

  it('«Más recientes» pone primero lo último publicado y desempata de forma estable', () => {
    const sorted = sortCars(CARS, 'recientes')
    expect(ids(sorted.slice(0, 2))).toEqual(['corolla', 'leon'])
    expect(ids(sortCars([...CARS].reverse(), 'recientes'))).toEqual(ids(sorted))
  })

  it('no muta la lista original', () => {
    const copy = [...CARS]
    sortCars(CARS, 'precio-asc')
    expect(CARS).toEqual(copy)
  })
})

describe('facetas', () => {
  it('cuenta coches por marca, las más frecuentes primero', () => {
    const facets = brandFacets(CARS)
    expect(facets[0]).toEqual({ name: 'Volkswagen', count: 3 })
    expect(facets.reduce((n, b) => n + b.count, 0)).toBe(24)
  })

  it('agrupa los modelos por marca elegida', () => {
    expect(modelGroups(CARS, ['Tesla', 'SEAT'])).toEqual([
      { marca: 'Tesla', modelos: ['Model 3', 'Model Y'] },
      { marca: 'SEAT', modelos: ['Ibiza', 'León'] },
    ])
  })
})

describe('toggleBrand', () => {
  it('conserva el modelo si sigue siendo de una marca elegida', () => {
    const next = toggleBrand(CARS, f({ marcas: ['SEAT'], modelo: 'León' }), 'Tesla')
    expect(next).toMatchObject({ marcas: ['SEAT', 'Tesla'], modelo: 'León' })
  })

  it('quita el modelo si se desmarca su marca', () => {
    const next = toggleBrand(CARS, f({ marcas: ['SEAT', 'Tesla'], modelo: 'León' }), 'SEAT')
    expect(next).toMatchObject({ marcas: ['Tesla'], modelo: '' })
  })
})

describe('chips de filtros activos', () => {
  it('no hay chips con los filtros por defecto (la búsqueda no cuenta)', () => {
    expect(activeFilters(f({ q: 'seat' }))).toEqual([])
  })

  it('genera las etiquetas del diseño', () => {
    const labels = activeFilters(
      f({
        marcas: ['SEAT'],
        modelo: 'León',
        precio: [3000, 30000],
        anio: [2020, 2025],
        km: [10000, 80000],
        combustibles: ['Híbrido'],
        etiquetas: ['ECO'],
      }),
    ).map((c) => c.label)
    expect(labels).toEqual(['SEAT', 'León', `Hasta 30.000${NBSP}€`, 'Desde 2020', `10.000${NBSP}km – 80.000${NBSP}km`, 'Híbrido', 'Etiqueta ECO'])
  })

  it('cada chip sabe quitarse; quitar la marca quita también el modelo', () => {
    const start = f({ marcas: ['SEAT'], modelo: 'León', precio: [3000, 30000], cambios: ['Manual'] })
    const [brand, , price, gear] = activeFilters(start)
    expect(brand!.remove(start)).toMatchObject({ marcas: [], modelo: '' })
    expect(price!.remove(start).precio).toEqual(DEFAULT_FILTERS.precio)
    expect(gear!.remove(start).cambios).toEqual([])
  })

  it('rangeLabel cubre los tres casos', () => {
    expect(rangeLabel('precio', [3000, 15000])).toBe(`Hasta 15.000${NBSP}€`)
    expect(rangeLabel('anio', [2022, 2025])).toBe('Desde 2022')
    expect(rangeLabel('anio', [2018, 2022])).toBe('2018 – 2022')
  })
})

describe('toggle', () => {
  it('añade y quita', () => {
    expect(toggle(['a'], 'b')).toEqual(['a', 'b'])
    expect(toggle(['a', 'b'], 'a')).toEqual(['b'])
  })
})
