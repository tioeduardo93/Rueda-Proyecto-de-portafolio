import { describe, expect, it } from 'vitest'
import { DEFAULT_FILTERS, type Filters } from './filters'
import { listingHref, parseListingParams, toListingParams } from './url'

const parse = (qs: string) => parseListingParams(new URLSearchParams(qs))

describe('URL del listado', () => {
  it('sin parámetros da los filtros y el orden por defecto', () => {
    expect(parse('')).toEqual({ filters: DEFAULT_FILTERS, sort: 'recientes' })
  })

  it('los valores por defecto no aparecen en la URL', () => {
    expect(toListingParams({ filters: DEFAULT_FILTERS, sort: 'recientes' }).toString()).toBe('')
  })

  it('ida y vuelta conserva todos los filtros', () => {
    const filters: Filters = {
      q: 'seat leon',
      marcas: ['SEAT', 'Toyota'],
      modelo: 'León',
      precio: [5000, 30000],
      anio: [2018, 2025],
      km: [0, 80000],
      combustibles: ['Gasolina', 'Híbrido'],
      cambios: ['Automático'],
      etiquetas: ['ECO', '0'],
      carrocerias: ['SUV'],
    }
    const params = toListingParams({ filters, sort: 'precio-asc' })
    expect(parseListingParams(new URLSearchParams(params.toString()))).toEqual({ filters, sort: 'precio-asc' })
  })

  it('escribe una URL corta y legible', () => {
    const params = toListingParams({
      filters: { ...DEFAULT_FILTERS, marcas: ['SEAT'], precio: [3000, 30000], anio: [2020, 2025] },
      sort: 'km',
    })
    expect(decodeURIComponent(params.toString())).toBe('marca=SEAT&precioMax=30000&anioMin=2020&orden=km')
  })

  it('ajusta los rangos a los límites y al paso del slider', () => {
    expect(parse('precioMin=1000&precioMax=99999').filters.precio).toEqual([3000, 60000])
    expect(parse('precioMax=30260').filters.precio).toEqual([3000, 30500])
    expect(parse('kmMax=12000').filters.km).toEqual([0, 10000])
  })

  it('intercambia mínimo y máximo si llegan al revés', () => {
    expect(parse('anioMin=2022&anioMax=2015').filters.anio).toEqual([2015, 2022])
  })

  it('ignora valores no válidos', () => {
    const { filters, sort } = parse('precioMax=mucho&combustible=Gasolina,Vapor&etiqueta=Z&orden=raro&cambio=')
    expect(filters.precio).toEqual(DEFAULT_FILTERS.precio)
    expect(filters.combustibles).toEqual(['Gasolina'])
    expect(filters.etiquetas).toEqual([])
    expect(filters.cambios).toEqual([])
    expect(sort).toBe('recientes')
  })

  it('quita duplicados', () => {
    expect(parse('marca=SEAT,SEAT,Kia').filters.marcas).toEqual(['SEAT', 'Kia'])
  })

  it('ignora el modelo si no hay marca', () => {
    expect(parse('modelo=León').filters.modelo).toBe('')
    expect(parse('marca=SEAT&modelo=León').filters.modelo).toBe('León')
  })

  it('listingHref construye enlaces con filtros', () => {
    expect(listingHref()).toBe('/')
    expect(decodeURIComponent(listingHref({ carrocerias: ['SUV'], precio: [3000, 25000] }))).toBe('/?precioMax=25000&carroceria=SUV')
  })
})
