import { Link } from 'react-router'
import { cn } from '../lib/cn'
import { buttonClasses } from './button-styles'
import { CloseIcon, CompareIcon } from './icons'

export interface CompareBarItem {
  id: string
  name: string
}

export interface CompareBarProps {
  items: CompareBarItem[]
  max: number
  onRemove: (id: string) => void
  /** Ruta del comparador. */
  to: string
  className?: string
}

function hint(count: number, max: number) {
  if (count < 2) return 'Elige al menos 2 coches'
  if (count < max) return `Puedes añadir ${max - count} más`
  return 'Máximo alcanzado'
}

/**
 * Barra flotante del comparador. En móvil, compacta (título y nombres);
 * desde `md`, con un chip por coche para quitarlo y una pista de cuántos faltan.
 */
export function CompareBar({ items, max, onRemove, to, className }: CompareBarProps) {
  const title = `Comparar (${items.length}/${max})`
  return (
    <section
      aria-label="Comparador"
      className={cn(
        'flex animate-fade-up items-center gap-3 rounded-card bg-ink py-2.5 pr-2.5 pl-4 text-white shadow-bar md:gap-4 md:py-3 md:pr-3 md:pl-5',
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col md:flex-none md:flex-row md:items-center md:gap-2.5">
        <CompareIcon size={22} className="hidden flex-none md:block" />
        <strong className="text-[15px] tabular-nums" aria-live="polite">
          {title}
        </strong>
        <span className="text-xs text-pretty text-subtle md:hidden">{items.map((i) => i.name).join(' · ')}</span>
      </div>

      <ul className="hidden flex-1 flex-wrap gap-2 md:flex">
        {items.map((item) => (
          <li
            key={item.id}
            className="inline-flex h-8 items-center gap-1 rounded-full bg-white/12 pr-1 pl-3 text-[13px] font-semibold"
          >
            {item.name}
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              aria-label={`Quitar ${item.name} del comparador`}
              className="relative flex size-[26px] items-center justify-center rounded-full text-white hover:bg-white/15 after:absolute after:-inset-[9px] after:content-['']"
            >
              <CloseIcon size={14} />
            </button>
          </li>
        ))}
      </ul>

      <span className="hidden text-[13px] text-subtle lg:inline">{hint(items.length, max)}</span>

      <Link to={to} className={buttonClasses({ variant: 'primary', size: 'md' }, 'px-[18px] md:px-5')}>
        <span className="md:hidden">Comparar</span>
        <span className="hidden md:inline">Comparar ahora</span>
      </Link>
    </section>
  )
}
