import { Link } from 'react-router'
import { carName, carPhotos } from '../lib/car'
import { cn } from '../lib/cn'
import { formatKm, formatPrice } from '../lib/format'
import type { Car } from '../types'
import { CarPhoto } from './CarPhoto'

/** Tarjeta compacta de los carruseles horizontales en móvil (coches similares). Toda ella es el enlace. */
export function CarMiniCard({ car, className }: { car: Car; className?: string }) {
  const name = carName(car)
  const photo = carPhotos(car)[0]
  return (
    <Link
      to={`/coche/${car.id}`}
      className={cn('block overflow-hidden rounded-[14px] border border-line bg-surface text-ink no-underline', className)}
    >
      {/* Decorativa: el nombre del coche ya da nombre al enlace. */}
      {photo && <CarPhoto photo={photo} alt="" className="aspect-[16/9]" />}
      <div className="flex flex-col gap-1 p-3">
        <span className="text-[15px] font-extrabold">{name}</span>
        <span className="text-xs text-muted tabular-nums">
          {car.anio} · {formatKm(car.km)} · {car.combustible}
        </span>
        <span className="mt-1 text-xl font-extrabold tracking-[-0.02em] tabular-nums">{formatPrice(car.precio)}</span>
      </div>
    </Link>
  )
}
