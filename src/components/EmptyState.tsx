import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

function SearchIllustration() {
  return (
    <svg width="168" height="120" viewBox="0 0 168 120" fill="none" aria-hidden="true">
      <ellipse cx="84" cy="104" rx="64" ry="7" fill="#E3E7EA" />
      <path
        d="M30 92H24v-9c0-1.6 1.2-3 2.8-3.2L42 78l11-9.5h28l14 9.8 15 2.6c1.6.3 2.6 1.6 2.6 3.2V92h-5"
        stroke="#B9C3C8"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="41" cy="92" r="8" stroke="#B9C3C8" strokeWidth="3" />
      <circle cx="96" cy="92" r="8" stroke="#B9C3C8" strokeWidth="3" />
      <circle cx="122" cy="44" r="22" fill="#fff" stroke="var(--accent)" strokeWidth="4" />
      <path d="M138 60l14 14" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
      <path d="M114 36l16 16M130 36l-16 16" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

function FavoritesIllustration() {
  return (
    <svg width="150" height="130" viewBox="0 0 140 120" fill="none" aria-hidden="true" className="motion-safe:animate-pop">
      <ellipse cx="70" cy="108" rx="48" ry="6" fill="#E3E7EA" />
      <circle cx="70" cy="56" r="44" fill="color-mix(in srgb, var(--accent) 12%, #fff)" />
      <path
        d="M70 82S44 66 44 46.5A14.5 14.5 0 0 1 70 37.5a14.5 14.5 0 0 1 26 9C96 66 70 82 70 82z"
        fill="#fff"
        stroke="var(--accent)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M104 24v12M98 30h12M30 20v8M26 24h8" stroke="#B9C3C8" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export interface EmptyStateProps {
  illustration: 'search' | 'favorites'
  title: string
  description: string
  /** Botones o enlaces de acción. */
  children?: ReactNode
  headingLevel?: 'h1' | 'h2' | 'h3'
  className?: string
}

/** Estado vacío. En móvil va sobre el fondo; desde `sm`, dentro de un panel. */
export function EmptyState({
  illustration,
  title,
  description,
  children,
  headingLevel: Heading = 'h2',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex animate-fade-up flex-col items-center gap-3 px-6 py-8 text-center',
        'sm:rounded-panel sm:border sm:border-line sm:bg-surface sm:py-14',
        className,
      )}
    >
      {illustration === 'search' ? <SearchIllustration /> : <FavoritesIllustration />}
      <Heading className="mt-2 text-[22px] font-extrabold tracking-[-0.02em]">{title}</Heading>
      <p className="max-w-[400px] text-[15px] leading-normal text-muted">{description}</p>
      {children && <div className="mt-2 flex w-full flex-col items-center gap-1 sm:mt-2 sm:w-auto">{children}</div>}
    </div>
  )
}
