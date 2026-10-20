import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { useCompare } from '../store/compare'
import { useFavorites, type FavoriteEntry } from '../store/favorites'
import FavoritesPage from './FavoritesPage'

const daysAgo = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function renderFavorites(items: FavoriteEntry[], compare: string[] = []) {
  useFavorites.setState({ items })
  useCompare.setState({ ids: compare })
  const router = createMemoryRouter(
    [
      { path: '/favoritos', element: <FavoritesPage /> },
      { path: '/comparar', element: <p>Comparador</p> },
    ],
    { initialEntries: ['/favoritos'] },
  )
  render(<RouterProvider router={router} />)
  return router
}

// Espera a que llegue el catálogo: la API simulada responde sin retardo en los tests, pero sigue siendo asíncrona.
const cards = () => screen.findAllByRole('article', {})
const card = (name: string) => screen.getByRole('heading', { level: 2, name }).closest('article')!

beforeEach(() => localStorage.clear())

describe('FavoritesPage', () => {
  it('muestra cuándo se guardó cada coche y si ha bajado de precio', async () => {
    renderFavorites([
      { id: 'chr', savedAt: daysAgo(2) },
      { id: 'model3', savedAt: daysAgo(5) },
    ])
    expect(await cards()).toHaveLength(2)
    expect(screen.getByText('2 coches guardados. Te avisamos si alguno baja de precio.')).toBeInTheDocument()
    expect(within(card('Toyota C-HR')).getByText('Guardado hace 2 días')).toBeInTheDocument()
    expect(within(card('Toyota C-HR')).getByText('Ha bajado 600 €')).toBeInTheDocument()
    expect(within(card('Tesla Model 3')).queryByText(/Ha bajado/)).not.toBeInTheDocument()
  })

  it('quita un favorito con el corazón', async () => {
    renderFavorites([
      { id: 'chr', savedAt: daysAgo(1) },
      { id: 'leon', savedAt: daysAgo(3) },
    ])
    await cards()
    await userEvent.click(screen.getByRole('button', { name: 'Quitar Toyota C-HR de favoritos' }))
    expect(useFavorites.getState().items.map((f) => f.id)).toEqual(['leon'])
    expect(screen.getAllByRole('article')).toHaveLength(1)
    // El foco pasa a la tarjeta que ocupa su sitio.
    expect(screen.getByRole('link', { name: 'SEAT León' })).toHaveFocus()
    await userEvent.click(screen.getByRole('button', { name: 'Quitar SEAT León de favoritos' }))
    expect(screen.getByRole('link', { name: 'Explorar coches' })).toHaveFocus()
  })

  it('la casilla «Comparar» usa el comparador y respeta su límite de 3', async () => {
    renderFavorites(
      [
        { id: 'chr', savedAt: daysAgo(1) },
        { id: 'leon', savedAt: daysAgo(2) },
      ],
      ['golf', 'puma', 'clio'],
    )
    await cards()
    const box = within(card('Toyota C-HR')).getByRole('checkbox', { name: /Comparar/ })
    expect(box).toBeDisabled()
    useCompare.setState({ ids: ['golf'] })
    await userEvent.click(await within(card('Toyota C-HR')).findByRole('checkbox', { name: /Comparar/ }))
    expect(useCompare.getState().ids).toEqual(['golf', 'chr'])
  })

  it('«Comparar favoritos» lleva al comparador con los 3 guardados más recientes', async () => {
    // Desordenados a propósito: cuenta la fecha de guardado, no la posición en el store.
    const router = renderFavorites([
      { id: 'puma', savedAt: daysAgo(4) },
      { id: 'chr', savedAt: daysAgo(1) },
      { id: 'golf', savedAt: daysAgo(3) },
      { id: 'leon', savedAt: daysAgo(2) },
    ])
    await cards()
    expect(screen.getByText('Se comparan los 3 guardados más recientes.')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Comparar favoritos' }))
    expect(useCompare.getState().ids).toEqual(['chr', 'leon', 'golf'])
    expect(router.state.location.pathname).toBe('/comparar')
  })

  it('con un solo favorito no ofrece «Comparar favoritos»', async () => {
    renderFavorites([{ id: 'chr', savedAt: daysAgo(1) }])
    await cards()
    expect(screen.queryByRole('button', { name: 'Comparar favoritos' })).not.toBeInTheDocument()
  })

  it('sin favoritos muestra el estado vacío con búsquedas populares', async () => {
    renderFavorites([])
    expect(await screen.findByRole('heading', { name: 'Aún no tienes favoritos' })).toBeInTheDocument()
    const popular = screen.getByRole('navigation', { name: 'Búsquedas populares' })
    const hrefs = within(popular)
      .getAllByRole('link')
      .map((a) => [a.textContent, decodeURIComponent(a.getAttribute('href')!)])
    expect(hrefs).toEqual([
      ['Híbridos ECO', '/?combustible=Híbrido&etiqueta=ECO'],
      ['SUV hasta 25.000 €', '/?precioMax=25000&carroceria=SUV'],
      ['Eléctricos', '/?combustible=Eléctrico'],
      ['Automáticos', '/?cambio=Automático'],
    ])
  })

  // Borrarlos del store lo hace el layout (ver test/flow.test.tsx); la página solo no los muestra.
  it('no muestra los favoritos que ya no están en el catálogo', async () => {
    renderFavorites([
      { id: 'retirado', savedAt: daysAgo(1) },
      { id: 'leon', savedAt: daysAgo(2) },
    ])
    expect(await cards()).toHaveLength(1)
    expect(screen.getByText('1 coche guardado. Te avisamos si alguno baja de precio.')).toBeInTheDocument()
  })
})
