const KEY = 'rueda:ultimo-listado'

/** Guarda la búsqueda del listado (`?marca=SEAT…`) para que «Volver a resultados» la recupere. */
export function rememberListingSearch(search: string) {
  try {
    sessionStorage.setItem(KEY, search)
  } catch {
    // Sin almacenamiento (modo privado estricto): «Volver» lleva al listado sin filtros.
  }
}

export function lastListingHref(): string {
  try {
    const search = sessionStorage.getItem(KEY)
    return search ? `/${search}` : '/'
  } catch {
    return '/'
  }
}
