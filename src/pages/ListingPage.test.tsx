import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { setViewportWidth } from '../test/matchMedia'
import ListingPage from './ListingPage'

function renderAt(url: string) {
  const router = createMemoryRouter([{ path: '/', element: <ListingPage /> }], { initialEntries: [url] })
  render(<RouterProvider router={router} />)
  return router
}

// Espera al retardo de la API simulada (solo la primera vez: después el catálogo está en caché).
const heading = () => screen.findByRole('heading', { level: 2, name: /encontrados?$/ }, { timeout: 2000 })

describe('ListingPage', () => {
  it('aplica los filtros y el orden de la URL', async () => {
    setViewportWidth(1440)
    renderAt('/?marca=Tesla&orden=precio-desc')
    expect(await heading()).toHaveTextContent('2 coches encontrados')
    const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(titles).toEqual(['Tesla Model Y', 'Tesla Model 3'])
  })

  it('quitar un chip quita el filtro de la URL', async () => {
    setViewportWidth(1440)
    const router = renderAt('/?etiqueta=B')
    expect(await heading()).toHaveTextContent('1 coche encontrado')
    const chips = screen.getByRole('list', { name: 'Filtros activos' })
    await userEvent.click(within(chips).getByRole('button', { name: 'Quitar filtro Etiqueta B' }))
    expect(router.state.location.search).toBe('')
    expect(await heading()).toHaveTextContent('24 coches encontrados')
  })

  it('muestra el estado vacío y lo limpia', async () => {
    setViewportWidth(1440)
    const router = renderAt('/?marca=Tesla&combustible=Diésel')
    expect(await screen.findByRole('heading', { name: 'No hay coches con estos filtros' }, { timeout: 2000 })).toBeInTheDocument()
    await userEvent.click(screen.getAllByRole('button', { name: 'Limpiar filtros' }).at(-1)!)
    expect(router.state.location.search).toBe('')
  })

  it('reescribe la URL sin los valores inválidos', async () => {
    setViewportWidth(1440)
    const router = renderAt('/?orden=raro&precioMax=30260&combustible=Vapor,Diésel')
    await heading()
    expect(decodeURIComponent(router.state.location.search)).toBe('?precioMax=30500&combustible=Diésel')
  })

  it('pagina de 9 en 9', async () => {
    setViewportWidth(1440)
    renderAt('/')
    await heading()
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(9)
    expect(screen.getByText('Mostrando 9 de 24')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cargar más coches (15)' })).toBeInTheDocument()
  })
})
