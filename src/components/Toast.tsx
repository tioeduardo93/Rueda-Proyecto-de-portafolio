import { cn } from '../lib/cn'

/**
 * Aviso breve («Enlace copiado»). La región `status` existe siempre para que los lectores de pantalla
 * anuncien el texto al aparecer; quien lo usa decide cuándo vaciarlo.
 */
export function Toast({ message, className }: { message: string | null; className?: string }) {
  return (
    <div role="status" className={cn('pointer-events-none fixed inset-x-4 z-40 flex justify-center', className)}>
      {message && (
        <span className="max-w-md animate-fade-up rounded-btn bg-ink px-4 py-3 text-center text-sm font-semibold text-white shadow-bar">
          {message}
        </span>
      )}
    </div>
  )
}
