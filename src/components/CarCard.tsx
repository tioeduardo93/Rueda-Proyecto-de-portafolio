import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '../lib/cn'
import { formatKm, formatMonthly, formatPrice } from '../lib/format'
import type { Car } from '../types'
import { Badge } from './Badge'
import { CarPhoto } from './CarPhoto'
import { DgtBadge } from './DgtBadge'
import { CalendarIcon, FuelIcon, GaugeIcon, GearboxIcon, HeartIcon, PinIcon } from './icons'

export interface CarCardProps {
  car: Car
  /** Cuota «desde» ya calculada (la calcula quien usa la tarjeta). */
  monthlyFee: number
  isFavorite: boolean
  onToggleFavorite: () => void
  isComparing: boolean
  /** El comparador está lleno y este coche no está en él. */
  compareDisabled?: boolean
  onToggleCompare: () => void
  /**
   * Etiqueta sobre la foto, abajo a la izquierda, visible en todos los anchos. Sin la prop, el número
   * de fotos (solo desde `sm`, como en el diseño); con `null`, ninguna.
   */
  photoBadge?: ReactNode
  /** Dato del pie, a la derecha. Por defecto, la ciudad. */
  meta?: ReactNode
  headingLevel?: 'h2' | 'h3'
  className?: string
}

/**
 * Tarjeta de coche. En móvil (una columna) el precio va a la derecha del título y los datos
 * como etiquetas; desde `sm` sigue el diseño de escritorio, con iconos en rejilla.
 */
export function CarCard({
  car,
  monthlyFee,
  isFavorite,
  onToggleFavorite,
  isComparing,
  compareDisabled = false,
  onToggleCompare,
  photoBadge,
  meta,
  headingLevel: Heading = 'h3',
  className,
}: CarCardProps) {
  const name = `${car.marca} ${car.modelo}`
  const href = `/coche/${car.id}`

  const specs = [
    { icon: CalendarIcon, label: 'Año', value: String(car.anio) },
    { icon: GaugeIcon, label: 'Kilómetros', value: formatKm(car.km) },
    { icon: FuelIcon, label: 'Combustible', value: car.combustible },
    { icon: GearboxIcon, label: 'Cambio', value: car.cambio },
  ]

  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden rounded-card border border-line bg-surface',
        'transition-[transform,box-shadow,border-color] duration-200 ease-out',
        'motion-safe:active:scale-[.99] sm:motion-safe:active:scale-100',
        'sm:hover:border-line-hover sm:hover:shadow-card sm:motion-safe:hover:-translate-y-[3px]',
        className,
      )}
    >
      <div className="relative">
        {/* El título ya enlaza a la ficha: la foto es un atajo para ratón y táctil, fuera del orden de tabulación. */}
        <Link to={href} tabIndex={-1} aria-hidden="true" className="block">
          <CarPhoto label={name} silhouette={64} className="aspect-[16/9] sm:aspect-[16/10]" labelClassName="text-[10px] sm:text-[11px]" />
        </Link>
        <DgtBadge label={car.etiqueta} ring className="absolute top-3 left-3" />
        {photoBadge === undefined ? (
          <div className="absolute bottom-3 left-3 hidden sm:block">
            <Badge tone="overlay">{car.fotos} fotos</Badge>
          </div>
        ) : (
          photoBadge && <div className="absolute bottom-3 left-3">{photoBadge}</div>
        )}
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Quitar ${name} de favoritos` : `Añadir ${name} a favoritos`}
          className="absolute top-2.5 right-2.5 flex size-11 items-center justify-center rounded-full bg-white/95 shadow-float transition-transform duration-150 motion-safe:hover:scale-[1.08]"
        >
          <HeartIcon
            size={22}
            className={isFavorite ? 'fill-fav text-fav' : 'text-ink'}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-4 pt-3.5 pb-2.5 sm:gap-3 sm:pt-4 sm:pb-3">
        <div className="flex items-start justify-between gap-3 sm:flex-col sm:justify-start">
          <div className="min-w-0">
            <Heading className="text-[17px] font-extrabold tracking-[-0.01em]">
              <Link to={href} className="relative text-ink no-underline after:absolute after:inset-x-0 after:-inset-y-[11px] after:content-[''] hover:text-accent">
                {name}
              </Link>
            </Heading>
            <p className="mt-0.5 text-[13px] text-pretty text-muted sm:mt-[3px]">
              {car.version} · {car.cv} CV
            </p>
          </div>
          <div className="flex flex-none flex-col items-end gap-0.5 sm:items-start">
            <span className="text-2xl leading-[1.1] font-extrabold tracking-[-0.025em] tabular-nums sm:text-[27px]">
              {formatPrice(car.precio)}
            </span>
            <span className="text-xs text-muted sm:text-[13px]">
              desde <strong className="font-extrabold text-accent tabular-nums">{formatMonthly(monthlyFee)}</strong>
            </span>
          </div>
        </div>

        <ul className="flex flex-wrap gap-1.5 text-xs font-bold text-ink-2 tabular-nums sm:grid sm:grid-cols-2 sm:gap-x-3 sm:gap-y-2 sm:border-t sm:border-line-soft sm:pt-3 sm:text-[13px] sm:font-semibold">
          {specs.map(({ icon: SpecIcon, label, value }) => (
            <li key={label} className="flex items-center gap-[7px] rounded-md bg-tint px-2 py-[5px] sm:rounded-none sm:bg-transparent sm:p-0">
              <SpecIcon size={16} className="hidden flex-none text-muted sm:block" />
              <span className="sr-only">{label}:</span>{' '}
              {value}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-line-soft pt-1 sm:border-t-0 sm:pt-0">
          <label
            className={cn(
              'flex min-h-11 items-center gap-2 text-[13px] font-bold',
              compareDisabled && 'cursor-not-allowed text-muted',
            )}
            title={compareDisabled ? 'Ya tienes 3 coches en el comparador' : undefined}
          >
            <input
              type="checkbox"
              checked={isComparing}
              disabled={compareDisabled}
              onChange={onToggleCompare}
              className="m-0 size-5 sm:size-[18px]"
            />
            Comparar{' '}<span className="sr-only">{name}</span>
          </label>
          <span className="flex min-w-0 items-center gap-1 text-xs text-muted">
            {meta ?? (
              <>
                <PinIcon size={14} className="hidden flex-none sm:block" />
                <span className="sr-only">Ubicación:</span>{' '}
                {car.ciudad}
              </>
            )}
          </span>
        </div>
      </div>
    </article>
  )
}
