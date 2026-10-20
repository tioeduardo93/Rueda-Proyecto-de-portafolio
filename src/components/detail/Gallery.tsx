import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { Photo } from '../../types'
import { CarPhoto } from '../CarPhoto'
import { ChevronLeftIcon, ChevronRightIcon } from '../icons'

export interface GalleryProps {
  /** Nombre del coche, para los textos accesibles. */
  title: string
  photos: readonly Photo[]
  /** Botones sobre la foto en móvil (volver, compartir, favorito). */
  overlay?: ReactNode
  /** Etiqueta abajo a la izquierda en escritorio. */
  badge?: ReactNode
  className?: string
}

const SWIPE_PX = 40

/** Índice circular: después de la última vuelve a la primera y al revés. */
const wrap = (i: number, total: number) => ((i % total) + total) % total

/**
 * Galería: foto grande con flechas y miniaturas (escritorio) o foto a sangre con puntos (móvil).
 * Con el foco dentro, ← → cambian de foto e Inicio/Fin van a la primera/última. En táctil, deslizar.
 */
export function Gallery({ title, photos, overlay, badge, className }: GalleryProps) {
  const [index, setIndex] = useState(0)
  const regionRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const total = photos.length
  const photo = photos[index]

  const go = (i: number) => setIndex(wrap(i, total))

  // Teclado y gestos con listeners nativos: la vía accesible son los botones y la región enfocable.
  useEffect(() => {
    const region = regionRef.current
    const stage = stageRef.current
    if (!region || !stage) return
    const onKeyDown = (e: KeyboardEvent) => {
      const moves: Record<string, (i: number) => number> = {
        ArrowLeft: (i) => i - 1,
        ArrowRight: (i) => i + 1,
        Home: () => 0,
        End: () => total - 1,
      }
      const move = moves[e.key]
      if (!move) return
      e.preventDefault()
      setIndex((i) => wrap(move(i), total))
    }
    let startX: number | null = null
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') startX = e.clientX
    }
    const onPointerUp = (e: PointerEvent) => {
      if (startX === null) return
      const dx = e.clientX - startX
      startX = null
      if (Math.abs(dx) >= SWIPE_PX) setIndex((i) => wrap(dx < 0 ? i + 1 : i - 1, total))
    }
    region.addEventListener('keydown', onKeyDown)
    stage.addEventListener('pointerdown', onPointerDown)
    stage.addEventListener('pointerup', onPointerUp)
    return () => {
      region.removeEventListener('keydown', onKeyDown)
      stage.removeEventListener('pointerdown', onPointerDown)
      stage.removeEventListener('pointerup', onPointerUp)
    }
  }, [total])

  return (
    <div
      ref={regionRef}
      role="region"
      tabIndex={0}
      aria-roledescription="galería"
      aria-label={`Fotos de ${title}`}
      className={cn('flex flex-col gap-3 outline-offset-4', className)}
    >
      <div ref={stageRef} className="relative touch-pan-y overflow-hidden select-none lg:rounded-panel">
        {photo && (
          // `key`: cada foto es una imagen nueva, así no se ve la anterior mientras carga la siguiente.
          <CarPhoto key={photo.src} photo={photo} priority={index === 0} className="aspect-[4/3] sm:aspect-[16/10]" />
        )}
        <p className="sr-only" aria-live="polite">
          Foto {index + 1} de {total}: {photo?.alt}
        </p>

        {/* En móvil, tocar la foto pasa a la siguiente, como en el diseño. */}
        <button type="button" onClick={() => go(index + 1)} aria-label="Foto siguiente" className="absolute inset-0 lg:hidden" />

        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Foto anterior"
          className="absolute top-1/2 left-4 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-ink shadow-[0_4px_14px_rgb(14_26_31/0.15)] transition-transform motion-safe:active:scale-95 lg:flex"
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Foto siguiente"
          className="absolute top-1/2 right-4 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-ink shadow-[0_4px_14px_rgb(14_26_31/0.15)] transition-transform motion-safe:active:scale-95 lg:flex"
        >
          <ChevronRightIcon />
        </button>

        <span
          aria-hidden="true"
          className="absolute right-3 bottom-3 rounded-lg bg-ink/75 px-2.5 py-[5px] text-xs font-bold text-white tabular-nums lg:right-4 lg:bottom-4 lg:px-3 lg:py-1.5 lg:text-[13px]"
        >
          {index + 1} / {total}
        </span>
        {badge && <div className="absolute bottom-4 left-4 hidden lg:block">{badge}</div>}

        <div aria-hidden="true" className="absolute inset-x-0 bottom-[18px] flex justify-center gap-[5px] lg:hidden">
          {photos.map((p, i) => (
            <span
              key={p.src}
              className={cn('h-1.5 rounded-full shadow-[0_0_3px_rgb(14_26_31/0.5)] transition-[width,background-color] duration-200', i === index ? 'w-[18px] bg-white' : 'w-1.5 bg-white/60')}
            />
          ))}
        </div>

        {overlay}
      </div>

      <div className="hidden grid-cols-5 gap-2.5 lg:grid">
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => go(i)}
            aria-pressed={index === i}
            className={cn(
              'relative overflow-hidden rounded-field border-2 transition-[border-color] duration-150 hover:border-line-hover',
              index === i ? 'border-accent!' : 'border-transparent',
            )}
          >
            <CarPhoto photo={p} alt="" className="aspect-[4/3]" />
            {/* El nombre empieza por lo que se ve («Interior») para el control por voz (WCAG 2.5.3). */}
            <span className="absolute bottom-1.5 left-1.5 rounded-md bg-ink/75 px-1.5 py-0.5 text-[11px] font-bold text-white">{p.label}</span>{' '}
            <span className="sr-only">
              (foto {i + 1}: {p.alt})
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
