import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import { HeartIcon, SearchIcon } from '../components/icons'
import { Logo } from '../components/Logo'
import { MEDIA, useMediaQuery } from '../hooks/useMediaQuery'
import { cn } from '../lib/cn'
import { PARAMS } from '../lib/url'
import { useFavoriteCount } from '../store/favorites'

/**
 * Cabecera común. En móvil: logo y favoritos arriba, buscador debajo.
 * Desde `sm`: todo en una fila, como en el diseño de escritorio.
 */
interface SiteHeaderProps {
  className?: string
  /** Hueco bajo el buscador, solo en móvil, que rellenan las páginas (ver `layout/slots.tsx`). */
  toolbarRef?: (el: HTMLDivElement | null) => void
}

export function SiteHeader({ className, toolbarRef }: SiteHeaderProps) {
  const favCount = useFavoriteCount()
  const { pathname } = useLocation()
  const onListing = pathname === '/'
  const onFavorites = pathname === '/favoritos'
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const wide = useMediaQuery(MEDIA.sm)

  const urlQuery = onListing ? (params.get(PARAMS.q) ?? '') : ''
  const [query, setQuery] = useState(urlQuery)
  const [syncedQuery, setSyncedQuery] = useState(urlQuery)
  // Si la búsqueda cambia desde fuera («Limpiar filtros», atrás/adelante), el campo la refleja.
  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery)
    setQuery(urlQuery)
  }

  function onChange(value: string) {
    setQuery(value)
    if (!onListing) return
    // En el listado la búsqueda filtra mientras se escribe.
    setSyncedQuery(value.trim() ? value : '')
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value.trim()) next.set(PARAMS.q, value)
        else next.delete(PARAMS.q)
        return next
      },
      { replace: true, preventScrollReset: true },
    )
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (onListing) return
    const q = query.trim()
    navigate(q ? `/?${PARAMS.q}=${encodeURIComponent(q)}` : '/')
  }

  return (
    <header className={cn('sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur-md', className)}>
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-7 gap-y-3 px-4 pt-3.5 pb-3 sm:px-6 sm:py-3.5">
        <Link to="/" aria-label="Rueda, inicio" className="flex min-h-11 items-center text-ink no-underline">
          <Logo />
        </Link>

        <form role="search" onSubmit={onSubmit} className="order-last basis-full sm:order-none sm:max-w-[640px] sm:flex-[1_1_320px]">
          <label className="relative flex items-center">
            <span className="sr-only">Buscar por marca o modelo</span>
            <SearchIcon className="pointer-events-none absolute left-3.5 text-muted sm:left-4" />
            <input
              type="search"
              value={query}
              onChange={(e) => onChange(e.target.value)}
              placeholder={wide ? 'Busca por marca o modelo, p. ej. SEAT León' : 'Marca o modelo'}
              enterKeyHint="search"
              className="h-[46px] w-full rounded-btn border border-line-strong bg-field pr-3.5 pl-[42px] text-base text-ink placeholder:text-muted sm:h-12 sm:pr-4 sm:pl-[46px] sm:text-[15px]"
            />
          </label>
        </form>
        <div ref={toolbarRef} className="order-last basis-full empty:hidden lg:hidden" />

        <Link
          to="/favoritos"
          aria-current={onFavorites ? 'page' : undefined}
          className={cn(
            'relative ml-auto flex size-11 items-center justify-center gap-2 rounded-btn text-sm font-bold text-ink no-underline transition-colors',
            'sm:w-auto sm:border sm:px-3.5',
            onFavorites ? 'sm:border-accent sm:bg-accent-faint' : 'sm:border-line sm:bg-surface sm:hover:bg-[#F1F4F4]',
          )}
        >
          <HeartIcon size={24} className={cn('sm:size-5', onFavorites && 'fill-fav text-fav')} />
          {/* Nombre accesible desde el texto visible («Favoritos 4») más «coches guardados», sin aria-label:
              así quien usa control por voz puede decir lo que ve (WCAG 2.5.3). */}
          <span className="sr-only sm:not-sr-only">Favoritos</span>{' '}
          <span
            className={cn(
              'flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-[5px] text-[11px] font-extrabold text-white tabular-nums',
              'absolute top-1 right-0.5 shadow-[0_0_0_2px_#fff]',
              'sm:static sm:h-[22px] sm:min-w-[22px] sm:px-1.5 sm:text-xs sm:font-bold sm:shadow-none',
            )}
          >
            {favCount}
          </span>{' '}
          <span className="sr-only">{favCount === 1 ? 'coche guardado' : 'coches guardados'}</span>
        </Link>
      </div>
    </header>
  )
}
