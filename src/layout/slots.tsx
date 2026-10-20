import { useContext, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { LayoutSlotsContext, type LayoutSlots } from './slotsContext'

/**
 * Pinta `children` en un hueco del layout (ver `slotsContext.ts`). Sin layout (en los tests de una página
 * suelta) o si el hueco aún no existe, lo pinta donde está, para no perder contenido.
 */
export function LayoutSlot({ name, children }: { name: keyof LayoutSlots; children: ReactNode }) {
  const target = useContext(LayoutSlotsContext)[name]
  return target ? createPortal(children, target) : children
}
