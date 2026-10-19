import { useEffect, useId, useRef, type ReactNode } from 'react'
import { CloseIcon } from './icons'

export interface BottomSheetProps {
  title: string
  onClose: () => void
  children: ReactNode
  /** Barra de acciones fija abajo. */
  footer?: ReactNode
  closeLabel?: string
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Panel inferior modal sobre `<dialog>` nativo: el resto de la página queda inerte y Escape lo cierra.
 * Además atrapa el foco (Tab no sale al navegador), bloquea el scroll del fondo y, al cerrarse,
 * devuelve el foco al control que lo abrió. Se monta abierto: para cerrarlo, desmóntalo.
 */
export function BottomSheet({ title, onClose, children, footer, closeLabel = 'Cerrar' }: BottomSheetProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const opener = document.activeElement as HTMLElement | null
    if (typeof dialog.showModal === 'function') dialog.showModal()
    else dialog.setAttribute('open', '')
    const { overflow } = document.documentElement.style
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = overflow
      if (dialog.open) dialog.close?.()
      opener?.focus?.()
    }
  }, [])

  // Atajos de ratón y teclado sobre el propio <dialog>; el botón de cerrar y Escape son la vía accesible.
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const items = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)]
      const first = items[0]
      const last = items.at(-1)
      if (!first || !last) return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    // Un clic cuyo destino es el propio <dialog> cae en el fondo oscuro, fuera del panel.
    const onClick = (e: MouseEvent) => e.target === dialog && onCloseRef.current()
    dialog.addEventListener('keydown', onKeyDown)
    dialog.addEventListener('click', onClick)
    return () => {
      dialog.removeEventListener('keydown', onKeyDown)
      dialog.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        // Escape: cerramos desde React para que el estado y el DOM no se desincronicen.
        e.preventDefault()
        onClose()
      }}
      className="m-0 mt-auto h-[calc(100dvh-3.5rem)] max-h-none w-full max-w-none animate-sheet overflow-hidden rounded-t-[24px] bg-surface p-0 text-ink shadow-[0_-12px_40px_rgb(14_26_31/0.2)] backdrop:bg-ink/50"
    >
      <div className="flex h-full flex-col">
        <div className="flex flex-none flex-col items-center px-4 pt-2">
          <span aria-hidden="true" className="h-[5px] w-10 rounded-full bg-line-strong" />
          <div className="flex w-full items-center justify-between border-b border-line-soft pt-2 pb-3">
            <h2 id={titleId} className="text-xl font-extrabold">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="flex size-11 items-center justify-center rounded-full bg-tint text-ink hover:bg-line"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-4 pt-1 pb-4">{children}</div>
        {footer && <div className="flex flex-none gap-2.5 border-t border-line bg-surface px-4 pt-3 pb-6">{footer}</div>}
      </div>
    </dialog>
  )
}
