import { describe, expect, it } from 'vitest'
import { CARS } from '../data/cars'
import {
  FINANCE,
  cuotaDesde,
  defaultDownPayment,
  maxDownPayment,
  monthlyPayment,
  simulateFinancing,
} from './finance'

describe('monthlyPayment (sistema francés)', () => {
  it('calcula la cuota con TIN 8,99 %', () => {
    // 10.000 € a 12 meses al 8,99 %: 874,47 €
    expect(monthlyPayment(10000, 12)).toBe(874.47)
  })

  it('reparte el capital a partes iguales con TIN 0', () => {
    expect(monthlyPayment(12000, 24, 0)).toBe(500)
  })

  it('devuelve 0 si no hay nada que financiar', () => {
    expect(monthlyPayment(0, 96)).toBe(0)
    expect(monthlyPayment(-500, 96)).toBe(0)
    expect(monthlyPayment(1000, 0)).toBe(0)
  })

  it('a más plazo, menos cuota', () => {
    expect(monthlyPayment(15000, 96)).toBeLessThan(monthlyPayment(15000, 72))
  })
})

describe('cuotaDesde', () => {
  it('usa 96 meses, entrada del 15 % y TIN 8,99 %', () => {
    expect(FINANCE).toMatchObject({ meses: 96, entrada: 0.15, tin: 0.0899 })
  })

  it.each([
    [18990, 236], // SEAT León
    [17450, 217], // Volkswagen Golf
    [18450, 230], // Ford Puma
    [19750, 246], // Peugeot 3008
    [21900, 273], // Toyota C-HR
  ])('%i € → %i €/mes (valores del diseño)', (precio, cuota) => {
    expect(cuotaDesde(precio)).toBe(cuota)
  })

  it.each(CARS.map((c) => [c.id, c.precio] as const))(
    '%s: coincide con la calculadora recién abierta y con el 15 % exacto',
    (_, precio) => {
      const calculator = simulateFinancing(precio, defaultDownPayment(precio), FINANCE.meses)
      expect(cuotaDesde(precio)).toBe(Math.round(calculator.cuota))
      expect(cuotaDesde(precio)).toBe(Math.round(monthlyPayment(precio * (1 - FINANCE.entrada), FINANCE.meses)))
    },
  )
})

describe('entrada de la calculadora', () => {
  it('por defecto es el 15 % ajustado a pasos de 10 €', () => {
    expect(defaultDownPayment(18990)).toBe(2850) // 2.848,5 → 2.850
    expect(defaultDownPayment(20000)).toBe(3000)
  })

  it('como máximo es la mitad del precio, ajustada hacia abajo', () => {
    expect(maxDownPayment(18990)).toBe(9490)
    expect(maxDownPayment(7990)).toBe(3990)
  })
})

describe('simulateFinancing', () => {
  it('cuadra financiado, cuota, total e intereses', () => {
    const s = simulateFinancing(18990, 3000, 72)
    expect(s.financiado).toBe(15990)
    expect(s.cuota).toBe(monthlyPayment(15990, 72))
    expect(s.totalAPlazos).toBeCloseTo(s.cuota * 72 + 3000, 2)
    expect(s.intereses).toBeCloseTo(s.cuota * 72 - 15990, 2)
  })

  it('no financia nada si la entrada cubre el precio', () => {
    const s = simulateFinancing(5000, 6000, 48)
    expect(s).toMatchObject({ financiado: 0, cuota: 0, totalAPlazos: 5000, intereses: 0 })
  })
})
