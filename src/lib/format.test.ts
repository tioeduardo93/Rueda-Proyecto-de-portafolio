import { describe, expect, it } from 'vitest'
import {
  NBSP,
  formatConsumo,
  formatKm,
  formatMonthly,
  formatNumber,
  formatPrice,
  formatRegistration,
  formatRelativeDays,
  pluralize,
} from './format'

describe('formatNumber', () => {
  it('agrupa también los números de 4 cifras', () => {
    expect(formatNumber(8990)).toBe('8.990')
    expect(formatNumber(1000)).toBe('1.000')
  })

  it('no agrupa números de 3 cifras o menos', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(999)).toBe('999')
  })

  it('agrupa millones', () => {
    expect(formatNumber(1234567)).toBe('1.234.567')
  })

  it('usa coma decimal', () => {
    expect(formatNumber(5.7, 1)).toBe('5,7')
    expect(formatNumber(1234.5, 2)).toBe('1.234,50')
  })

  it('respeta el signo negativo', () => {
    expect(formatNumber(-18990)).toBe('-18.990')
  })
})

describe('formatPrice y formatKm', () => {
  it('añade espacio de no separación antes de la unidad', () => {
    expect(formatPrice(18990)).toBe(`18.990${NBSP}€`)
    expect(formatKm(45000)).toBe(`45.000${NBSP}km`)
  })

  it('redondea al entero', () => {
    expect(formatPrice(235.6)).toBe(`236${NBSP}€`)
    expect(formatKm(19800.4)).toBe(`19.800${NBSP}km`)
  })

  it('formatea cuotas mensuales', () => {
    expect(formatMonthly(236)).toBe(`236${NBSP}€/mes`)
  })
})

describe('otros formatos', () => {
  it('formatea el consumo con coma decimal', () => {
    expect(formatConsumo({ valor: 5.7, unidad: 'l/100 km' })).toBe(`5,7${NBSP}l/100 km`)
    expect(formatConsumo({ valor: 15, unidad: 'kWh/100 km' })).toBe(`15,0${NBSP}kWh/100 km`)
  })

  it('formatea la fecha de matriculación', () => {
    expect(formatRegistration(3, 2021)).toBe('03/2021')
    expect(formatRegistration(11, 2015)).toBe('11/2015')
  })

  it('pluraliza', () => {
    expect(pluralize(1, 'coche', 'coches')).toBe('1 coche')
    expect(pluralize(0, 'coche', 'coches')).toBe('0 coches')
    expect(pluralize(1200, 'coche', 'coches')).toBe('1.200 coches')
  })
})

describe('formatRelativeDays', () => {
  const now = new Date(2026, 9, 19, 23, 30)

  it.each([
    ['2026-10-19', 'hoy'],
    ['2026-10-18', 'hace 1 día'],
    ['2026-10-14', 'hace 5 días'],
    ['2026-10-12', 'hace 1 semana'],
    ['2026-09-30', 'hace 2 semanas'],
    ['2026-09-19', 'hace 1 mes'],
    ['2026-06-01', 'hace 4 meses'],
    ['2024-10-01', 'hace 2 años'],
  ])('%s → %s', (iso, expected) => {
    expect(formatRelativeDays(iso, now)).toBe(expected)
  })

  it('trata las fechas futuras como «hoy»', () => {
    expect(formatRelativeDays('2026-10-25', now)).toBe('hoy')
  })
})
