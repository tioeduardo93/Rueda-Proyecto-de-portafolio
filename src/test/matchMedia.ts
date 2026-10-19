/** `matchMedia` de mentira para jsdom: el ancho se cambia con `setViewportWidth` y avisa a los oyentes. */
type Listener = (e: MediaQueryListEvent) => void

let width = 390
const lists = new Set<{ query: string; listeners: Set<Listener>; last: boolean }>()

function evaluate(query: string): boolean {
  const m = /min-width:\s*([\d.]+)(px|rem)/.exec(query)
  if (!m) return false
  const px = Number(m[1]) * (m[2] === 'rem' ? 16 : 1)
  return width >= px
}

export function installMatchMedia() {
  window.matchMedia = (query: string) => {
    const entry = { query, listeners: new Set<Listener>(), last: evaluate(query) }
    lists.add(entry)
    return {
      get matches() {
        return evaluate(query)
      },
      media: query,
      onchange: null,
      addEventListener: (_: string, l: Listener) => entry.listeners.add(l),
      removeEventListener: (_: string, l: Listener) => entry.listeners.delete(l),
      addListener: (l: Listener) => entry.listeners.add(l),
      removeListener: (l: Listener) => entry.listeners.delete(l),
      dispatchEvent: () => false,
    } as MediaQueryList
  }
}

export function setViewportWidth(next: number) {
  width = next
  for (const entry of lists) {
    const matches = evaluate(entry.query)
    if (matches === entry.last) continue
    entry.last = matches
    entry.listeners.forEach((l) => l({ matches, media: entry.query } as MediaQueryListEvent))
  }
}
