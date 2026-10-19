import { carName, versionLine } from '../../lib/car'
import { cn } from '../../lib/cn'
import { formatKm, formatMonthly, formatNumber, formatPrice } from '../../lib/format'
import type { Car } from '../../types'
import { Badge } from '../Badge'
import { Button } from '../Button'
import { DocumentIcon, HeartIcon, PinIcon, ReturnIcon } from '../icons'

export interface CarSummaryProps {
  car: Car
  monthlyFee: number
  /** Euros que ha bajado; 0 si no ha bajado. */
  priceDrop: number
  /** «hace 1 día» */
  published: string
  isFavorite: boolean
  onToggleFavorite: () => void
  onInterest: () => void
  interestSent: boolean
  className?: string
}

export const INTEREST_SENT_MESSAGE = 'Solicitud enviada. Un asesor te llamará en menos de 24 h.'

/**
 * Resumen del coche: título, precio y datos clave. En escritorio es la columna fija de la derecha,
 * con las acciones; en móvil va bajo la foto y las acciones están en la barra inferior.
 */
export function CarSummary({
  car,
  monthlyFee,
  priceDrop,
  published,
  isFavorite,
  onToggleFavorite,
  onInterest,
  interestSent,
  className,
}: CarSummaryProps) {
  const facts = [
    { label: 'Año', value: String(car.anio) },
    { label: 'km', value: formatNumber(car.km), full: formatKm(car.km) },
    { label: 'Motor', value: car.combustible },
    { label: 'Cambio', value: car.cambio },
  ]

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-col gap-3.5 border-b border-line bg-surface px-4 pt-[18px] pb-5 lg:gap-[18px] lg:rounded-panel lg:border lg:p-6">
        <div className="flex flex-wrap gap-1.5 lg:gap-2">
          <Badge>Garantía {car.garantiaMeses} meses</Badge>
          <Badge tone="neutral" className="lg:hidden">
            Revisado en 150 puntos
          </Badge>
          {car.unicoPropietario && (
            <Badge tone="neutral" className="max-lg:hidden">
              Único propietario
            </Badge>
          )}
          {priceDrop > 0 && <Badge tone="solid">Ha bajado {formatPrice(priceDrop)}</Badge>}
        </div>

        <div>
          <h1 className="text-[26px] leading-[1.15] font-extrabold tracking-[-0.03em] lg:text-[30px]">{carName(car)}</h1>
          <p className="mt-0.5 text-sm text-muted lg:mt-1 lg:text-[15px]">
            {versionLine(car)} · {car.puertas} puertas
          </p>
        </div>

        <ul className="hidden flex-wrap gap-2 text-[13px] font-bold text-ink-2 tabular-nums lg:flex">
          {facts.map((f) => (
            <li key={f.label} className="rounded-lg border border-line px-2.5 py-1.5">
              {f.full ?? f.value}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 lg:flex-col lg:items-start lg:gap-1 lg:border-t lg:border-line-soft lg:pt-[18px]">
          <span className="text-[34px] leading-none font-extrabold tracking-[-0.035em] tabular-nums lg:text-[40px]">
            {formatPrice(car.precio)}
          </span>
          <span className="text-sm text-muted lg:text-[15px]">
            o desde <strong className="font-extrabold text-accent tabular-nums">{formatMonthly(monthlyFee)}</strong>
            <span className="max-lg:hidden"> con financiación</span>
          </span>
        </div>

        <dl className="grid grid-cols-4 gap-1.5 text-center tabular-nums lg:hidden">
          {facts.map((f) => (
            <div key={f.label} className="flex flex-col-reverse rounded-field bg-canvas px-1 py-2.5">
              <dt className="text-[11px] text-muted">{f.label}</dt>
              <dd className="text-sm font-extrabold">{f.value}</dd>
            </div>
          ))}
        </dl>

        <div className="hidden flex-col gap-2.5 lg:flex">
          <Button size="xl" onClick={onInterest} className="h-[54px] rounded-[14px] text-base">
            Me interesa
          </Button>
          <Button variant="secondary" size="lg" aria-pressed={isFavorite} onClick={onToggleFavorite} className="h-[50px] rounded-[14px]">
            <HeartIcon className={isFavorite ? 'fill-fav text-fav' : 'text-ink'} />
            {isFavorite ? 'Guardado en favoritos' : 'Añadir a favoritos'}
          </Button>
          <p role="status" className="empty:hidden">
            {interestSent && (
              <span className="block animate-fade-up rounded-btn bg-accent-soft px-3.5 py-3 text-sm font-semibold text-ink">
                {INTEREST_SENT_MESSAGE}
              </span>
            )}
          </p>
        </div>

        <ul className="hidden flex-col gap-3 border-t border-line-soft pt-[18px] text-sm text-ink-2 lg:flex">
          <li className="flex items-center gap-2.5">
            <PinIcon size={18} className="flex-none text-accent" />
            Disponible en {car.ciudad} · entrega en 48 h
          </li>
          <li className="flex items-center gap-2.5">
            <ReturnIcon size={18} className="flex-none text-accent" />
            14 días de devolución
          </li>
          <li className="flex items-center gap-2.5">
            <DocumentIcon size={18} className="flex-none text-accent" />
            Libro de mantenimiento al día
          </li>
        </ul>
      </div>

      <p className="mx-1 hidden text-xs text-muted tabular-nums lg:block">
        Ref. {car.referencia} · Publicado {published}
      </p>
    </div>
  )
}
