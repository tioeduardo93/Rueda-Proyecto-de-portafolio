import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

/** Enlace a otro sitio: abre en una pestaña nueva, sin dar acceso a `window.opener`, y lo avisa a lectores de pantalla. */
export function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn('inline-flex min-h-11 items-center', className)}>
      {children}{' '}
      <span className="sr-only">(se abre en una pestaña nueva)</span>
    </a>
  )
}
