import { PHOTO_LABELS } from '../data/cars'
import type { Car, Carroceria } from '../types'

export const carName = (car: Car) => `${car.marca} ${car.modelo}`

/** «1.5 TSI FR · 150 CV» */
export const versionLine = (car: Car) => `${car.version} · ${car.cv} CV`

/** «Manual, 6 vel.»; sin marchas fijas, solo el tipo de cambio. */
export const gearboxLabel = (car: Car) => (car.marchas ? `${car.cambio}, ${car.marchas} vel.` : car.cambio)

/** Nombres de las fotos del coche, en orden. */
export const photoLabels = (car: Car) => PHOTO_LABELS.slice(0, car.fotos)

const BODY_PLURAL: Record<Carroceria, string> = {
  Utilitario: 'utilitarios',
  Compacto: 'compactos',
  Berlina: 'berlinas',
  Familiar: 'familiares',
  SUV: 'SUV',
}

/** «Ver más compactos», «Ver más SUV». */
export const moreOfBodyLabel = (body: Carroceria) => `Ver más ${BODY_PLURAL[body]}`

/** Cuánto ha bajado de precio, o 0 si no ha bajado. */
export const priceDrop = (car: Car) => (car.precioAnterior ? car.precioAnterior - car.precio : 0)

/**
 * Coches parecidos: misma carrocería y precio cercano pesan más; el combustible desempata.
 * Devuelve los `count` más parecidos, sin el propio coche.
 */
export function similarCars(car: Car, cars: readonly Car[], count = 3): Car[] {
  const score = (other: Car) =>
    Math.abs(other.precio - car.precio) / car.precio +
    (other.carroceria === car.carroceria ? 0 : 0.5) +
    (other.combustible === car.combustible ? 0 : 0.1)
  return cars
    .filter((c) => c.id !== car.id)
    .map((c) => ({ c, s: score(c) }))
    .sort((a, b) => a.s - b.s || a.c.id.localeCompare(b.c.id))
    .slice(0, count)
    .map(({ c }) => c)
}
