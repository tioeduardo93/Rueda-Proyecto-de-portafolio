import { describe, expect, it } from 'vitest'
import { CARS, PHOTO_LABELS } from './cars'

describe('catálogo', () => {
  it('tiene 24 coches con id y referencia únicos', () => {
    expect(CARS).toHaveLength(24)
    expect(new Set(CARS.map((c) => c.id)).size).toBe(CARS.length)
    expect(new Set(CARS.map((c) => c.referencia)).size).toBe(CARS.length)
  })

  it('cabe en los rangos de los filtros', () => {
    for (const car of CARS) {
      expect(car.precio).toBeGreaterThanOrEqual(3000)
      expect(car.precio).toBeLessThanOrEqual(60000)
      expect(car.anio).toBeGreaterThanOrEqual(2010)
      expect(car.anio).toBeLessThanOrEqual(2025)
      expect(car.km).toBeLessThanOrEqual(200000)
    }
  })

  it('tiene datos coherentes', () => {
    for (const car of CARS) {
      expect(car.mes).toBeGreaterThanOrEqual(1)
      expect(car.mes).toBeLessThanOrEqual(12)
      expect(car.fotos).toBeLessThanOrEqual(PHOTO_LABELS.length)
      expect(car.equipamiento.length).toBeGreaterThan(0)
      expect(car.publicadoEl).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      if (car.precioAnterior) expect(car.precioAnterior).toBeGreaterThan(car.precio)
      if (car.combustible === 'Eléctrico') {
        expect(car.etiqueta).toBe('0')
        expect(car.consumo.unidad).toBe('kWh/100 km')
      }
    }
  })
})
