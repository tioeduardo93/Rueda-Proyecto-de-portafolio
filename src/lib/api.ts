import { CARS } from '../data/cars'
import type { Car } from '../types'
import { daysBetween, parseISODate } from './format'

/**
 * Retardos simulados de red, para que se vean los esqueletos y el «Cargando…». Es un objeto y no una
 * constante para que los tests lo pongan a 0 y no dependan de tiempos (ver `test/setup.ts`).
 */
export const latency = {
  /** Respuesta de la API (y esqueletos al cambiar un filtro discreto). */
  apiMs: 500,
  /** «Cargar más coches». */
  loadMoreMs: 600,
}

/** Fecha a la que se refieren las fechas de publicación del catálogo. */
const CATALOG_DATE = '2026-10-19'

function toISODate(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${m}-${d}`
}

/**
 * Desplaza las fechas de publicación para que el catálogo parezca recién publicado
 * se abra cuando se abra la app («hace 1 día» sigue siendo «hace 1 día»).
 */
export function rebaseDates(cars: Car[], today: Date): Car[] {
  const offset = daysBetween(parseISODate(CATALOG_DATE), today)
  return cars.map((car) => {
    const date = parseISODate(car.publicadoEl)
    date.setDate(date.getDate() + offset)
    return { ...car, publicadoEl: toISODate(date) }
  })
}

function delay<T>(value: T, signal?: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason)
    const timer = setTimeout(() => resolve(value), latency.apiMs)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(signal.reason)
      },
      { once: true },
    )
  })
}

export class NotFoundError extends Error {
  constructor(id: string) {
    super(`No existe ningún coche con id «${id}»`)
    this.name = 'NotFoundError'
  }
}

/** API simulada. Cada llamada devuelve objetos nuevos, con las fechas ya desplazadas. */
export const api = {
  getCars(signal?: AbortSignal): Promise<Car[]> {
    return delay(rebaseDates(CARS, new Date()), signal)
  },

  async getCar(id: string, signal?: AbortSignal): Promise<Car> {
    const cars = await api.getCars(signal)
    const car = cars.find((c) => c.id === id)
    if (!car) throw new NotFoundError(id)
    return car
  },
}
