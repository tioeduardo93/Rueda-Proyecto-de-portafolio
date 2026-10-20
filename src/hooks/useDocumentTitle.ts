import { useEffect } from 'react'
import { SITE } from '../config/site'

/**
 * Título de la pestaña y meta description por ruta: «SEAT León FR · Rueda». Sin título, la marca y el lema;
 * sin descripción, la general del sitio (la misma que trae `index.html`).
 */
export function useDocumentTitle(title?: string | null, description?: string | null) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE.name}` : `${SITE.name} · Coches de segunda mano`
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = Object.assign(document.createElement('meta'), { name: 'description' })
      document.head.append(meta)
    }
    meta.content = description || SITE.description
  }, [title, description])
}
