import { cn } from '../lib/cn'
import { CarSilhouette } from './icons'

export interface CarPhotoProps {
  /** Texto del placeholder, p. ej. «SEAT León» o «Exterior frontal». */
  label: string
  /** Ancho de la silueta en px. */
  silhouette?: number
  className?: string
  labelClassName?: string
}

/** Placeholder de foto: no hay fotos reales en el proyecto, solo el nombre del coche. */
export function CarPhoto({ label, silhouette = 72, className, labelClassName }: CarPhotoProps) {
  return (
    <div className={cn('photo-placeholder flex flex-col items-center justify-center gap-1.5 text-muted', className)}>
      {silhouette > 0 && <CarSilhouette width={silhouette} strokeWidth={silhouette > 100 ? 1.4 : 1.6} />}
      <span className={cn('px-2 text-center text-[11px] font-bold tracking-[0.08em] uppercase', labelClassName)}>
        Foto · {label}
      </span>
    </div>
  )
}
