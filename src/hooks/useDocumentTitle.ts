import { useEffect } from 'react'

const SUFFIX = 'Rueda'

/** Título de la pestaña por ruta: «SEAT León FR · Rueda». Sin título, solo la marca y el lema. */
export function useDocumentTitle(title?: string | null) {
  useEffect(() => {
    document.title = title ? `${title} · ${SUFFIX}` : `${SUFFIX} · Coches de segunda mano`
  }, [title])
}
