import type { Consumo } from '../types'

/** Espacio de no separación: evita que «€» o «km» queden solos al final de una línea. */
export const NBSP = ' '

/**
 * Número con separador de miles «.» y decimal «,».
 * No usamos `Intl.NumberFormat('es-ES')` porque no agrupa los números de 4 cifras (8990).
 */
export function formatNumber(value: number, decimals = 0): string {
  const sign = value < 0 ? '-' : ''
  const [int = '0', dec] = Math.abs(value).toFixed(decimals).split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return sign + grouped + (dec ? ',' + dec : '')
}

/** 18990 → «18.990 €» (redondeado al euro). */
export function formatPrice(value: number): string {
  return `${formatNumber(Math.round(value))}${NBSP}€`
}

/** 236 → «236 €/mes». */
export function formatMonthly(value: number): string {
  return `${formatPrice(value)}/mes`
}

/** 45000 → «45.000 km». */
export function formatKm(value: number): string {
  return `${formatNumber(Math.round(value))}${NBSP}km`
}

/** 5.7 → «5,7 l/100 km». */
export function formatConsumo({ valor, unidad }: Consumo): string {
  return `${formatNumber(valor, 1)}${NBSP}${unidad}`
}

/** Mes y año de matriculación: (3, 2021) → «03/2021». */
export function formatRegistration(mes: number, anio: number): string {
  return `${String(mes).padStart(2, '0')}/${anio}`
}

/** «1 coche», «12 coches». */
export function pluralize(count: number, singular: string, plural: string): string {
  return `${formatNumber(count)} ${count === 1 ? singular : plural}`
}

const DAY_MS = 86_400_000

/** Días naturales entre dos fechas, sin depender de la hora ni de la zona horaria. */
export function daysBetween(from: Date, to: Date): number {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate())
  return Math.round((b - a) / DAY_MS)
}

/** Fecha ISO (AAAA-MM-DD) como fecha local, sin desfase por zona horaria. */
export function parseISODate(iso: string): Date {
  const [y = 1970, m = 1, d = 1] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** «hoy», «hace 1 día», «hace 3 días», «hace 2 semanas», «hace 1 mes»… */
export function formatRelativeDays(iso: string, now: Date = new Date()): string {
  const days = Math.max(0, daysBetween(parseISODate(iso), now))
  if (days === 0) return 'hoy'
  if (days < 7) return days === 1 ? 'hace 1 día' : `hace ${days} días`
  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return weeks === 1 ? 'hace 1 semana' : `hace ${weeks} semanas`
  }
  if (days < 365) {
    const months = Math.floor(days / 30)
    return months === 1 ? 'hace 1 mes' : `hace ${months} meses`
  }
  const years = Math.floor(days / 365)
  return years === 1 ? 'hace 1 año' : `hace ${years} años`
}
