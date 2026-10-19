import { describe, expect, it } from 'vitest'
import { CARS } from '../data/cars'
import type { Car } from '../types'
import { DGT_RANK, bestIndexes, buildCompareRows, onlyDifferences, resolveCars } from './compare'
import { NBSP } from './format'

const byId = (id: string) => CARS.find((c) => c.id === id)!
const row = (cars: Car[], id: string) => buildCompareRows(cars).find((r) => r.id === id)!
const bests = (cars: Car[], id: string) => row(cars, id).cells.map((c) => c.best)

// Los tres coches del diseño del comparador.
const DESIGN = [byId('leon'), byId('chr'), byId('p3008')]

describe('bestIndexes', () => {
  it('elige el menor o el mayor', () => {
    expect(bestIndexes([3, 1, 2], 'min')).toEqual([1])
    expect(bestIndexes([3, 1, 2], 'max')).toEqual([0])
  })

  it('marca a todos los que empatan en el mejor valor', () => {
    expect(bestIndexes([1, 1, 2], 'min')).toEqual([0, 1])
  })

  it('no hay ganador si todos empatan o si hay menos de 2', () => {
    expect(bestIndexes([5, 5, 5], 'max')).toEqual([])
    expect(bestIndexes([5], 'max')).toEqual([])
    expect(bestIndexes([], 'min')).toEqual([])
  })
})

describe('buildCompareRows', () => {
  it('tiene las filas del diseño en su orden', () => {
    expect(buildCompareRows(DESIGN).map((r) => r.label)).toEqual([
      'Precio',
      'Cuota estimada',
      'Año',
      'Kilómetros',
      'Potencia',
      'Consumo mixto',
      'Maletero',
      'Combustible',
      'Cambio',
      'Etiqueta DGT',
      'Color',
      'Puertas',
      'Plazas',
    ])
  })

  it('marca los mejores valores del diseño (León, C-HR, 3008)', () => {
    expect(bests(DESIGN, 'precio')).toEqual([true, false, false]) // 18.990 €
    expect(bests(DESIGN, 'cuota')).toEqual([true, false, false])
    expect(bests(DESIGN, 'anio')).toEqual([true, true, false]) // empate en 2021
    expect(bests(DESIGN, 'km')).toEqual([true, false, false])
    expect(bests(DESIGN, 'cv')).toEqual([true, false, false]) // 150 CV
    expect(bests(DESIGN, 'consumo')).toEqual([false, true, false]) // 4,9 l
    expect(bests(DESIGN, 'maletero')).toEqual([false, false, true]) // 520 l
    expect(bests(DESIGN, 'etiqueta')).toEqual([false, true, false]) // ECO
  })

  it('usa cuotaDesde y los formatos del proyecto', () => {
    const r = row(DESIGN, 'cuota')
    expect(r.cells[0]!.text.replaceAll(NBSP, ' ')).toBe('236 €/mes')
    expect(row(DESIGN, 'km').cells[2]!.text.replaceAll(NBSP, ' ')).toBe('66.300 km')
    expect(row(DESIGN, 'precio').cells[1]!.text.replaceAll(NBSP, ' ')).toBe('21.900 €')
  })

  it('las filas sin regla no tienen ganador', () => {
    for (const id of ['combustible', 'cambio', 'color', 'puertas', 'plazas']) {
      expect(bests(DESIGN, id).some(Boolean)).toBe(false)
    }
  })

  it('la etiqueta DGT gana por rango: 0 > ECO > C > B', () => {
    expect(DGT_RANK['0']).toBeGreaterThan(DGT_RANK.ECO)
    expect(DGT_RANK.ECO).toBeGreaterThan(DGT_RANK.C)
    expect(DGT_RANK.C).toBeGreaterThan(DGT_RANK.B)
    expect(bests([byId('astra'), byId('id3'), byId('chr')], 'etiqueta')).toEqual([false, true, false])
    expect(row([byId('astra')], 'etiqueta').cells[0]!.dgt).toBe('B')
  })

  it('el consumo solo se compara entre coches con la misma unidad', () => {
    // León (5,7 l) y Golf (4,4 l) frente a un eléctrico (14,9 kWh): gana el Golf; el eléctrico no compite.
    expect(bests([byId('leon'), byId('golf'), byId('model3')], 'consumo')).toEqual([false, true, false])
    // Un gasolina contra un eléctrico: nadie gana.
    expect(bests([byId('leon'), byId('model3')], 'consumo')).toEqual([false, false])
    // Dos eléctricos: gana el que menos gasta.
    expect(bests([byId('model3'), byId('niro')], 'consumo')).toEqual([true, false])
  })

  it('sin «Mejor» si todos empatan', () => {
    // Mismo año, puertas y plazas en León y C-HR.
    expect(bests([byId('leon'), byId('chr')], 'anio')).toEqual([false, false])
  })

  it('con un solo coche no hay ningún «Mejor»', () => {
    expect(buildCompareRows([byId('leon')]).every((r) => r.cells.every((c) => !c.best))).toBe(true)
  })
})

describe('onlyDifferences', () => {
  it('quita las filas en las que todos coinciden', () => {
    const labels = onlyDifferences(buildCompareRows(DESIGN)).map((r) => r.id)
    expect(labels).not.toContain('puertas') // 5, 5, 5
    expect(labels).not.toContain('plazas')
    expect(labels).toContain('precio')
    expect(labels).toContain('anio') // 2021, 2021, 2020
  })

  it('distingue consumos con distinta unidad aunque el número coincida', () => {
    const fake = { ...byId('model3'), consumo: { valor: 5.7, unidad: 'kWh/100 km' as const } }
    expect(onlyDifferences(buildCompareRows([byId('leon'), fake])).map((r) => r.id)).toContain('consumo')
  })
})

describe('resolveCars', () => {
  it('respeta el orden y descarta ids que ya no existen', () => {
    expect(resolveCars(['chr', 'retirado', 'leon'], CARS).map((c) => c.id)).toEqual(['chr', 'leon'])
  })
})
