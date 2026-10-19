import type { Car, EtiquetaDgt } from '../types'
import { cuotaDesde } from './finance'
import { NBSP, formatConsumo, formatKm, formatMonthly, formatPrice } from './format'

/** Para «Mejor», una etiqueta más limpia gana: 0 > ECO > C > B. */
export const DGT_RANK: Record<EtiquetaDgt, number> = { '0': 4, ECO: 3, C: 2, B: 1 }

type Rule = 'min' | 'max'

interface RowDefinition {
  id: string
  label: string
  /** Etiqueta de la columna fija en móvil, más estrecha. */
  shortLabel: string
  text: (car: Car) => string
  /** Número que se compara para el «Mejor». Sin él, la fila no tiene ganador. */
  score?: (car: Car) => number
  best?: Rule
  /** Solo se comparan entre sí los coches del mismo grupo (el consumo, por unidad). */
  group?: (car: Car) => string
  dgt?: boolean
}

const ROWS: RowDefinition[] = [
  { id: 'precio', label: 'Precio', shortLabel: 'Precio', text: (c) => formatPrice(c.precio), score: (c) => c.precio, best: 'min' },
  {
    id: 'cuota',
    label: 'Cuota estimada',
    shortLabel: 'Cuota',
    text: (c) => formatMonthly(cuotaDesde(c.precio)),
    score: (c) => cuotaDesde(c.precio),
    best: 'min',
  },
  { id: 'anio', label: 'Año', shortLabel: 'Año', text: (c) => String(c.anio), score: (c) => c.anio, best: 'max' },
  { id: 'km', label: 'Kilómetros', shortLabel: 'Kilómetros', text: (c) => formatKm(c.km), score: (c) => c.km, best: 'min' },
  { id: 'cv', label: 'Potencia', shortLabel: 'Potencia', text: (c) => `${c.cv}${NBSP}CV`, score: (c) => c.cv, best: 'max' },
  {
    id: 'consumo',
    label: 'Consumo mixto',
    shortLabel: 'Consumo',
    text: (c) => formatConsumo(c.consumo),
    score: (c) => c.consumo.valor,
    best: 'min',
    group: (c) => c.consumo.unidad,
  },
  { id: 'maletero', label: 'Maletero', shortLabel: 'Maletero', text: (c) => `${c.maletero}${NBSP}l`, score: (c) => c.maletero, best: 'max' },
  { id: 'combustible', label: 'Combustible', shortLabel: 'Combustible', text: (c) => c.combustible },
  { id: 'cambio', label: 'Cambio', shortLabel: 'Cambio', text: (c) => c.cambio },
  {
    id: 'etiqueta',
    label: 'Etiqueta DGT',
    shortLabel: 'Etiqueta',
    text: (c) => c.etiqueta,
    score: (c) => DGT_RANK[c.etiqueta],
    best: 'max',
    dgt: true,
  },
  { id: 'color', label: 'Color', shortLabel: 'Color', text: (c) => c.color },
  { id: 'puertas', label: 'Puertas', shortLabel: 'Puertas', text: (c) => String(c.puertas) },
  { id: 'plazas', label: 'Plazas', shortLabel: 'Plazas', text: (c) => String(c.plazas) },
]

export interface CompareCell {
  text: string
  best: boolean
  /** Presente en la fila de etiqueta DGT, para pintar el distintivo. */
  dgt?: EtiquetaDgt
}

export interface CompareRow {
  id: string
  label: string
  shortLabel: string
  cells: CompareCell[]
  /** Todos los coches tienen el mismo valor. */
  allSame: boolean
}

/**
 * Posiciones ganadoras de una fila. Hacen falta al menos 2 valores comparables; si todos empatan,
 * no gana nadie. Varios pueden ganar a la vez si empatan en el mejor valor.
 */
export function bestIndexes(scores: readonly number[], rule: Rule): number[] {
  if (scores.length < 2) return []
  const target = rule === 'min' ? Math.min(...scores) : Math.max(...scores)
  if (scores.every((s) => s === target)) return []
  return scores.flatMap((s, i) => (s === target ? [i] : []))
}

function winners(def: RowDefinition, cars: readonly Car[]): Set<number> {
  const { score, best } = def
  if (!score || !best) return new Set()
  const groups = new Map<string, number[]>()
  cars.forEach((car, i) => {
    const key = def.group?.(car) ?? ''
    groups.set(key, [...(groups.get(key) ?? []), i])
  })
  const result = new Set<number>()
  for (const indexes of groups.values()) {
    const won = bestIndexes(indexes.map((i) => score(cars[i]!)), best)
    won.forEach((w) => result.add(indexes[w]!))
  }
  return result
}

/** Filas de la tabla del comparador, en el orden del diseño, con el «Mejor» de cada una. */
export function buildCompareRows(cars: readonly Car[]): CompareRow[] {
  return ROWS.map((def) => {
    const won = winners(def, cars)
    // Se compara el texto: dos consumos con el mismo número y distinta unidad cuentan como diferencia.
    const values = cars.map(def.text)
    return {
      id: def.id,
      label: def.label,
      shortLabel: def.shortLabel,
      allSame: values.every((v) => v === values[0]),
      cells: cars.map((car, i) => ({ text: def.text(car), best: won.has(i), ...(def.dgt ? { dgt: car.etiqueta } : {}) })),
    }
  })
}

/** «Mostrar solo diferencias»: quita las filas en las que todos coinciden. */
export function onlyDifferences(rows: readonly CompareRow[]): CompareRow[] {
  return rows.filter((r) => !r.allSame)
}

/**
 * Coches del comparador en el orden en que se añadieron. Los ids que ya no están en el catálogo
 * (un anuncio retirado) se descartan.
 */
export function resolveCars(ids: readonly string[], cars: readonly Car[]): Car[] {
  return ids.flatMap((id) => cars.find((c) => c.id === id) ?? [])
}
