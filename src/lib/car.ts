import { CAR_PHOTOS } from '../data/photos'
import type { Car, Carroceria, Photo, PhotoView } from '../types'
import { cuotaDesde } from './finance'
import { formatKm, formatMonthly, formatPrice } from './format'

export const carName = (car: Car) => `${car.marca} ${car.modelo}`

/** «1.5 TSI FR · 150 CV» */
export const versionLine = (car: Car) => `${car.version} · ${car.cv} CV`

/** Meta description de la ficha: «SEAT León 1.5 TSI FR de 2021 con 48.200 km, gasolina y cambio manual, en Madrid…». */
export const carDescription = (car: Car) =>
  `${carName(car)} ${car.version} de ${car.anio} con ${formatKm(car.km)}, ${car.combustible.toLowerCase()} y cambio ` +
  `${car.cambio.toLowerCase()}, en ${car.ciudad}. ${formatPrice(car.precio)} o desde ${formatMonthly(cuotaDesde(car.precio))}.`

/** «Manual, 6 vel.»; sin marchas fijas, solo el tipo de cambio. */
export const gearboxLabel = (car: Car) => (car.marchas ? `${car.cambio}, ${car.marchas} vel.` : car.cambio)

const VIEW_LABELS: Record<PhotoView, string> = {
  frontal: 'Frontal',
  lateral: 'Lateral',
  trasera: 'Trasera',
  interior: 'Interior',
  detalle: 'Detalle',
}

/** Fotos del coche, en orden, con su texto alternativo: «SEAT León negro, vista frontal». */
export function carPhotos(car: Car): Photo[] {
  const name = carName(car)
  // «Negro Medianoche» → «negro»: el nombre comercial del color no ayuda a describir la foto.
  const color = car.color.split(' ')[0]!.toLowerCase()
  return (CAR_PHOTOS[car.id] ?? []).map((p, i) => ({
    src: `/cars/${car.id}-${i + 1}.webp`,
    label: VIEW_LABELS[p.vista],
    alt: p.alt ?? (p.vista === 'interior' ? `Interior del ${name}` : `${name} ${p.color ?? color}, vista ${p.vista}`),
  }))
}

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
