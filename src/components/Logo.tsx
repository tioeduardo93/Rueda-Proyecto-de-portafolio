import { cn } from '../lib/cn'

export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="12.5" fill="none" stroke="var(--accent)" strokeWidth="4" />
      <circle cx="16" cy="16" r="4" fill="#0E1A1F" />
      <path d="M16 7.5v4.5M16 20v4.5M7.5 16H12M20 16h4.5" stroke="#0E1A1F" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** Marca «Rueda»: rueda + nombre. Más pequeña en móvil, como en el diseño. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2 sm:gap-2.5', className)}>
      <span className="sm:hidden">
        <LogoMark size={26} />
      </span>
      <span className="hidden sm:inline">
        <LogoMark size={30} />
      </span>
      <span className="text-[22px] font-extrabold tracking-[-0.03em] sm:text-2xl">Rueda</span>
    </span>
  )
}
