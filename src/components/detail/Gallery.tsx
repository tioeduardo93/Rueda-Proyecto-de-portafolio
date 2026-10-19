import { useEffect, useRef, useState, type ReactNode } from 'react'
import { PHOTO_SHORT_LABELS } from '../../data/cars'
import { cn } from '../../lib/cn'
import { CarSilhouette, ChevronLeftIcon, ChevronRightIcon } from '../icons'

export interface GalleryProps {
  /** Nombre del coche, para los textos accesibles. */
  title: string
  /** Nombre de cada foto («Exterior frontal», «Interior»…). */
  photos: readonly string[]
  /** Botones sobre la foto en móvil (volver, compartir, favorito). */
  overlay?: ReactNode
  /** Etiqueta abajo a la izquierda en escritorio. */
  badge?: ReactNode
  className?: string
}

const MAX_THUMBS = 7
const MAX_DOTS = 6
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
  const label = photos[index] ?? ''

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

  // Con más fotos que huecos, la última miniatura resume el resto («+8 fotos») y abre la siguiente.
  const overflow = total > MAX_THUMBS
  const thumbs = (overflow ? photos.slice(0, MAX_THUMBS - 1) : photos).map((name, i) => ({
    i,
    name,
    text: PHOTO_SHORT_LABELS[i] ?? name,
    on: index === i,
  }))
  if (overflow) {
    const i = MAX_THUMBS - 1
    thumbs.push({ i, name: photos[i] ?? '', text: `+${total - i} fotos`, on: index >= i })
  }

  const dot = Math.min(index, MAX_DOTS - 1)

  return (
    <div
      ref={regionRef}
      role="region"
      tabIndex={0}
      aria-roledescription="galería"
      aria-label={`Fotos de ${title}`}
      className={cn('flex flex-col gap-3 outline-offset-4', className)}
    >
      <div
        ref={stageRef}
        className="photo-placeholder relative flex aspect-[4/3] touch-pan-y flex-col items-center justify-center gap-2.5 overflow-hidden text-muted select-none sm:aspect-[16/10] lg:rounded-panel"
      >
        <span className="sm:hidden">
          <CarSilhouette width={110} strokeWidth={1.4} />
        </span>
        <span className="hidden sm:block">
          <CarSilhouette width={140} strokeWidth={1.4} />
        </span>
        <span key={index} className="animate-fade-up px-4 text-center text-[11px] font-bold tracking-[0.08em] uppercase sm:text-[13px]">
          Foto · {label}
        </span>
        <p className="sr-only" aria-live="polite">
          Foto {index + 1} de {total}: {label}
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
          {Array.from({ length: Math.min(total, MAX_DOTS) }, (_, i) => (
            <span
              key={i}
              className={cn('h-1.5 rounded-full transition-[width,background-color] duration-200', i === dot ? 'w-[18px] bg-white' : 'w-1.5 bg-white/60')}
            />
          ))}
        </div>

        {overlay}
      </div>

      <div className="hidden grid-cols-7 gap-2.5 lg:grid">
        {thumbs.map((t) => (
          <button
            key={t.i}
            type="button"
            onClick={() => go(t.i)}
            aria-label={`Ver foto ${t.i + 1}: ${t.name}`}
            aria-pressed={t.on}
            className={cn(
              'photo-placeholder flex aspect-[4/3] items-center justify-center rounded-field border-2 p-1 text-center text-[10px] font-bold tracking-[0.04em] uppercase',
              // El diseño atenúa las inactivas con opacidad; con texto de 10 px bajaría de AA, así que cambia el color.
              'transition-[border-color,color] duration-150 hover:border-line-hover hover:text-ink',
              t.on ? 'border-accent! text-ink' : 'border-transparent text-muted',
            )}
          >
            {t.text}
          </button>
        ))}
      </div>
    </div>
  )
}
