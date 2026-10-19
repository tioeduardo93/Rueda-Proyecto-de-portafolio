import { cn } from '../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'ghost'
export type ButtonSize = 'md' | 'lg' | 'xl'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-accent font-extrabold text-white hover:bg-accent-hover',
  secondary: 'border border-line-strong bg-surface text-ink hover:bg-[#F1F4F4]',
  dark: 'bg-ink text-white hover:bg-[#1F2E35]',
  ghost: 'px-1! text-accent underline underline-offset-2 hover:text-ink',
}

const SIZES: Record<ButtonSize, string> = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[15px]',
  xl: 'h-[54px] px-7 text-base',
}

export interface ButtonStyleProps {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Ocupa todo el ancho disponible. */
  block?: boolean
}

/** Clases compartidas por `Button` y `ButtonLink`. */
export function buttonClasses({ variant = 'primary', size = 'md', block }: ButtonStyleProps, className?: string) {
  return cn(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-btn font-bold no-underline',
    'transition-[background-color,border-color,color,transform] duration-150 motion-safe:active:scale-[.98]',
    'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-line disabled:text-muted disabled:active:scale-100',
    VARIANTS[variant],
    SIZES[size],
    block && 'w-full',
    className,
  )
}
