import { describe, expect, it } from 'vitest'
import { CARS } from '../data/cars'
import { carDescription, carName, carPhotos, gearboxLabel, moreOfBodyLabel, priceDrop, similarCars, versionLine } from './car'
import { NBSP } from './format'

const byId = (id: string) => CARS.find((c) => c.id === id)!

describe('textos del coche', () => {
  it('nombre, versión y cambio como en el diseño', () => {
    const leon = byId('leon')
    expect(carName(leon)).toBe('SEAT León')
    expect(versionLine(leon)).toBe('1.5 TSI FR · 150 CV')
    expect(gearboxLabel(leon)).toBe('Manual, 6 vel.')
    expect(gearboxLabel(byId('model3'))).toBe('Automático')
  })

  it('da a cada foto su archivo y un texto alternativo en español', () => {
    expect(carPhotos(byId('leon'))).toEqual([
      { src: '/cars/leon-1.webp', label: 'Frontal', alt: 'SEAT León negro, vista frontal' },
      { src: '/cars/leon-2.webp', label: 'Lateral', alt: 'SEAT León negro, vista lateral' },
      { src: '/cars/leon-3.webp', label: 'Interior', alt: 'Interior del SEAT León' },
    ])
    // Otra unidad del mismo modelo con otro color: el texto describe la foto, no el anuncio.
    expect(carPhotos(byId('sandero'))[2]?.alt).toBe('Dacia Sandero Stepway gris, vista trasera')
  })

  it('enlace a más coches de la misma carrocería', () => {
    expect(moreOfBodyLabel('Compacto')).toBe('Ver más compactos')
    expect(moreOfBodyLabel('SUV')).toBe('Ver más SUV')
  })

  it('describe el coche para la meta description', () => {
    expect(carDescription(byId('leon')).replaceAll(NBSP, ' ')).toBe(
      'SEAT León 1.5 TSI FR de 2021 con 48.200 km, gasolina y cambio manual, en Madrid. 18.990 € o desde 236 €/mes.',
    )
  })

  it('calcula la bajada de precio', () => {
    expect(priceDrop(byId('chr'))).toBe(600)
    expect(priceDrop(byId('leon'))).toBe(0)
  })
})

describe('similarCars', () => {
  it('devuelve 3 coches, sin el propio', () => {
    const similar = similarCars(byId('leon'), CARS)
    expect(similar).toHaveLength(3)
    expect(similar.map((c) => c.id)).not.toContain('leon')
  })

  it('prefiere la misma carrocería y un precio cercano', () => {
    const similar = similarCars(byId('leon'), CARS)
    // Compactos cerca de 18.990 €: Golf (17.450 €) es el más parecido.
    expect(similar[0]?.id).toBe('golf')
    expect(similar.every((c) => Math.abs(c.precio - 18990) < 8000)).toBe(true)
  })

  it('es determinista', () => {
    expect(similarCars(byId('x1'), CARS)).toEqual(similarCars(byId('x1'), [...CARS].reverse()))
  })
})
