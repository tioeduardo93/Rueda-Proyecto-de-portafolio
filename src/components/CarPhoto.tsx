import { cn } from '../lib/cn'
import type { Photo } from '../types'

export interface CarPhotoProps {
  photo: Photo
  /** Solo la primera foto visible al cargar la página: se pide enseguida y con prioridad. */
  priority?: boolean
  /** Vacío cuando la foto es decorativa (la acompaña un texto que ya dice lo mismo). */
  alt?: string
  className?: string
}

/** Foto de coche a 3:2 recortada al hueco; mientras llega, el fondo rayado ocupa su sitio. */
export function CarPhoto({ photo, priority = false, alt = photo.alt, className }: CarPhotoProps) {
  return (
    <img
      src={photo.src}
      alt={alt}
      width={1200}
      height={800}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      // En minúsculas: React 18 no conoce `fetchPriority` y lo pasaría al DOM con aviso.
      {...{ fetchpriority: priority ? 'high' : 'auto' }}
      className={cn('photo-placeholder block h-auto w-full object-cover', className)}
    />
  )
}
