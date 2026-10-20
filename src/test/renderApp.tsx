import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from '../routes'

/** Monta la app completa (layout, cabecera y rutas reales) en una URL, con un router en memoria. */
export function renderApp(url: string) {
  const router = createMemoryRouter(routes, { initialEntries: [url] })
  render(<RouterProvider router={router} />)
  return router
}
