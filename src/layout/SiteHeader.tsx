import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import { HeartIcon, SearchIcon } from '../components/icons'
import { Logo } from '../components/Logo'
import { cn } from '../lib/cn'
import { useFavoriteCount } from '../store/favorites'

/**
 * Cabecera común. En móvil: logo y favoritos arriba, buscador debajo.
 * Desde `sm`: todo en una fila, como en el diseño de escritorio.
 */
export function SiteHeader({ showSearch = true }: { showSearch?: boolean }) {
  const favCount = useFavoriteCount()
  const { pathname } = useLocation()
  const onFavorites = pathname === '/favoritos'
  const [params] = useSearchParams()
  const urlQuery = pathname === '/' ? (params.get('q') ?? '') : ''
  const navigate = useNavigate()

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const q = String(new FormData(e.currentTarget).get('q') ?? '').trim()
    navigate(q ? `/?q=${encodeURIComponent(q)}` : '/')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-7 gap-y-3 px-4 pt-3.5 pb-3 sm:px-6 sm:py-3.5">
        <Link to="/" aria-label="Rueda, inicio" className="flex min-h-11 items-center text-ink no-underline">
          <Logo />
        </Link>

        {showSearch && (
          // `key`: si la búsqueda cambia desde fuera (atrás/adelante), el campo se reinicia con ella.
          <form key={urlQuery} role="search" onSubmit={onSubmit} className="order-last basis-full sm:order-none sm:max-w-[640px] sm:flex-[1_1_320px]">
            <label className="relative flex items-center">
              <span className="sr-only">Buscar por marca o modelo</span>
              <SearchIcon className="pointer-events-none absolute left-3.5 text-muted sm:left-4" />
              <input
                type="search"
                name="q"
                defaultValue={urlQuery}
                placeholder="Busca por marca o modelo, p. ej. SEAT León"
                enterKeyHint="search"
                className="h-[46px] w-full rounded-btn border border-line-strong bg-field pr-3.5 pl-[42px] text-base text-ink placeholder:text-muted sm:h-12 sm:pr-4 sm:pl-[46px] sm:text-[15px]"
              />
            </label>
          </form>
        )}

        <Link
          to="/favoritos"
          aria-label={`Favoritos: ${favCount} ${favCount === 1 ? 'coche guardado' : 'coches guardados'}`}
          aria-current={onFavorites ? 'page' : undefined}
          className={cn(
            'relative ml-auto flex size-11 items-center justify-center gap-2 rounded-btn text-sm font-bold text-ink no-underline transition-colors',
            'sm:w-auto sm:border sm:px-3.5',
            onFavorites ? 'sm:border-accent sm:bg-accent-faint' : 'sm:border-line sm:bg-surface sm:hover:bg-[#F1F4F4]',
          )}
        >
          <HeartIcon size={24} className={cn('sm:size-5', onFavorites && 'fill-fav text-fav')} />
          <span className="hidden sm:inline">Favoritos</span>
          <span
            className={cn(
              'flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-[5px] text-[11px] font-extrabold text-white tabular-nums',
              'absolute top-1 right-0.5 shadow-[0_0_0_2px_#fff]',
              'sm:static sm:h-[22px] sm:min-w-[22px] sm:px-1.5 sm:text-xs sm:font-bold sm:shadow-none',
            )}
          >
            {favCount}
          </span>
        </Link>
      </div>
    </header>
  )
}
