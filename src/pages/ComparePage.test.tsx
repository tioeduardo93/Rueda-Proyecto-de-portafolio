import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { useCompare } from '../store/compare'
import ComparePage from './ComparePage'

function renderCompare(ids: string[]) {
  useCompare.setState({ ids })
  const router = createMemoryRouter([{ path: '/comparar', element: <ComparePage /> }], { initialEntries: ['/comparar'] })
  render(<RouterProvider router={router} />)
}

// Espera a que llegue el catálogo: la API simulada responde sin retardo en los tests, pero sigue siendo asíncrona.
const table = () => screen.findByRole('table', { name: 'Comparativa de especificaciones' })
const rowOf = (t: HTMLElement, label: string) => within(t).getByRole('rowheader', { name: label }).closest('tr')!

beforeEach(() => localStorage.clear())

describe('ComparePage', () => {
  it('muestra los coches del comparador con el mejor valor de cada fila', async () => {
    renderCompare(['leon', 'chr', 'p3008'])
    const t = await table()
    const headers = within(t).getAllByRole('columnheader').map((h) => h.textContent)
    expect(headers[0]).toContain('Especificación')
    expect(headers.slice(1).map((h) => h?.match(/SEAT León|Toyota C-HR|Peugeot 3008/)?.[0])).toEqual([
      'SEAT León',
      'Toyota C-HR',
      'Peugeot 3008',
    ])
    const precio = within(rowOf(t, 'Precio')).getAllByRole('cell')
    expect(precio[0]).toHaveTextContent('Mejor')
    expect(precio[1]).not.toHaveTextContent('Mejor')
    expect(within(rowOf(t, 'Etiqueta DGT')).getAllByRole('cell')[1]).toHaveTextContent('Mejor')
  })

  it('«Mostrar solo diferencias» oculta las filas iguales', async () => {
    renderCompare(['leon', 'chr', 'p3008'])
    const t = await table()
    expect(within(t).getByRole('rowheader', { name: 'Puertas' })).toBeInTheDocument()
    await userEvent.click(screen.getAllByRole('checkbox', { name: /Mostrar solo diferencias/ })[0]!)
    expect(within(t).queryByRole('rowheader', { name: 'Puertas' })).not.toBeInTheDocument()
    expect(within(t).getByRole('rowheader', { name: 'Precio' })).toBeInTheDocument()
  })

  it('quita un coche desde su columna y deja un hueco para añadir otro', async () => {
    renderCompare(['leon', 'chr', 'p3008'])
    const t = await table()
    expect(within(t).queryByRole('link', { name: /Añadir otro coche/ })).not.toBeInTheDocument()
    await userEvent.click(within(t).getByRole('button', { name: 'Quitar Toyota C-HR de la comparación' }))
    expect(useCompare.getState().ids).toEqual(['leon', 'p3008'])
    expect(within(t).getByRole('link', { name: /Añadir otro coche/ })).toHaveAttribute('href', '/')
    // El foco no se pierde: pasa al coche que ocupa la columna.
    expect(within(t).getByRole('button', { name: 'Quitar Peugeot 3008 de la comparación' })).toHaveFocus()
  })

  it('al quitar coches el foco sigue en la tabla, y sin coches se ve el estado vacío', async () => {
    renderCompare(['leon', 'chr'])
    const t = await table()
    await userEvent.click(within(t).getByRole('button', { name: 'Quitar Toyota C-HR de la comparación' }))
    expect(within(t).getByRole('button', { name: 'Quitar SEAT León de la comparación' })).toHaveFocus()
    await userEvent.click(within(t).getByRole('button', { name: 'Quitar SEAT León de la comparación' }))
    // Sin coches se muestra el estado vacío, sin tabla.
    expect(screen.getByRole('heading', { name: 'Aún no has elegido coches para comparar' })).toBeInTheDocument()
  })

  it('con un solo coche avisa y desactiva «solo diferencias»', async () => {
    renderCompare(['leon'])
    const t = await table()
    expect(screen.getByText('Añade al menos otro coche para ver cuál gana en cada fila.')).toBeInTheDocument()
    expect(within(t).getAllByRole('link', { name: /Añadir otro coche/ })).toHaveLength(2)
    expect(within(t).queryByText('Mejor')).not.toBeInTheDocument()
    for (const box of screen.getAllByRole('checkbox', { name: /Mostrar solo diferencias/ })) expect(box).toBeDisabled()
  })

  it('sin coches muestra el estado vacío', async () => {
    renderCompare([])
    expect(await screen.findByRole('heading', { name: 'Aún no has elegido coches para comparar' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Explorar coches' })).toHaveAttribute('href', '/')
  })

  // Borrarlos del store lo hace el layout (ver test/flow.test.tsx); la página solo no los muestra.
  it('no muestra los ids que ya no están en el catálogo', async () => {
    renderCompare(['leon', 'retirado', 'chr'])
    await table()
    expect(screen.getAllByRole('heading', { level: 1 }).map((h) => h.textContent)).toContain('Comparar (2/3)')
  })
})
