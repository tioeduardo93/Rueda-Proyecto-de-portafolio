import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
// Testing Library normaliza los espacios del DOM: el espacio de no separación se busca como uno normal.
import { useFavorites } from '../store/favorites'
import CarDetailPage from './CarDetailPage'

function renderCar(id: string) {
  const router = createMemoryRouter([{ path: '/coche/:id', element: <CarDetailPage /> }], { initialEntries: [`/coche/${id}`] })
  render(<RouterProvider router={router} />)
}

const title = () => screen.findByRole('heading', { level: 1 })
const liveText = (text: string) => screen.getByText((_, el) => el?.getAttribute('aria-live') === 'polite' && el.textContent === text)

beforeEach(() => useFavorites.setState({ items: [] }))

describe('CarDetailPage', () => {
  it('muestra la ficha del coche', async () => {
    renderCar('leon')
    expect(await title()).toHaveTextContent('SEAT León')
    await waitFor(() => expect(document.title).toBe('SEAT León 1.5 TSI FR · Rueda'))
    const specs = screen.getByRole('region', { name: 'Ficha técnica' })
    expect(within(specs).getByText('03/2021')).toBeInTheDocument()
    expect(within(specs).getByText('Manual, 6 vel.')).toBeInTheDocument()
    expect(within(specs).getByRole('img', { name: 'Etiqueta ambiental C' })).toBeInTheDocument()
    expect(screen.getAllByText('236 €/mes').length).toBeGreaterThan(0)
  })

  it('la galería avanza con botones, miniaturas y teclado, y da la vuelta', async () => {
    renderCar('leon')
    await title()
    expect(liveText('Foto 1 de 14: Exterior frontal')).toBeInTheDocument()
    await userEvent.click(screen.getAllByRole('button', { name: 'Foto siguiente' })[0]!)
    expect(liveText('Foto 2 de 14: Lateral izquierdo')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Interior (foto 4: Interior)' }))
    expect(liveText('Foto 4 de 14: Interior')).toBeInTheDocument()

    const gallery = screen.getByRole('region', { name: 'Fotos de SEAT León' })
    fireEvent.keyDown(gallery, { key: 'End' })
    expect(liveText('Foto 14 de 14: Techo')).toBeInTheDocument()
    fireEvent.keyDown(gallery, { key: 'ArrowRight' })
    expect(liveText('Foto 1 de 14: Exterior frontal')).toBeInTheDocument()
    fireEvent.keyDown(gallery, { key: 'ArrowLeft' })
    expect(liveText('Foto 14 de 14: Techo')).toBeInTheDocument()
  })

  it('la calculadora recalcula la cuota al cambiar plazo y entrada', async () => {
    renderCar('leon')
    await title()
    const calc = screen.getByRole('region', { name: 'Calcula tu financiación' })
    // Por defecto: 15 % de entrada (2.850 €) a 96 meses, la misma cuota que el «desde» de la ficha.
    expect(within(calc).getByLabelText('Entrada')).toHaveValue('2850')
    expect(within(calc).getByRole('button', { name: '96 meses' })).toHaveAttribute('aria-pressed', 'true')
    const cuota = () => within(calc).getAllByText((_, el) => el?.getAttribute('aria-live') === 'polite')[0]!.textContent

    const before = cuota()
    expect(before?.replace(/\s/g, ' ')).toBe('236 €/mes')
    await userEvent.click(within(calc).getByRole('button', { name: '48 meses' }))
    const shorter = cuota()
    expect(shorter).not.toBe(before)

    fireEvent.change(within(calc).getByLabelText('Entrada'), { target: { value: '9000' } })
    expect(cuota()).not.toBe(shorter)
    expect(within(calc).getAllByText('9.990 €').length).toBeGreaterThan(0)
  })

  it('guarda en favoritos', async () => {
    renderCar('chr')
    await title()
    await userEvent.click(screen.getByRole('button', { name: 'Añadir a favoritos' }))
    expect(useFavorites.getState().items.map((f) => f.id)).toEqual(['chr'])
    expect(screen.getByRole('button', { name: 'Guardado en favoritos' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('muestra 3 coches similares', async () => {
    renderCar('leon')
    await title()
    const similar = screen.getByRole('heading', { name: 'Coches similares' }).closest('section')!
    expect(within(similar).getByRole('link', { name: 'Ver más compactos' })).toHaveAttribute('href', '/?carroceria=Compacto')
    expect(within(similar).getAllByRole('heading', { level: 3 })).toHaveLength(3)
  })

  it('avisa si el coche no existe', async () => {
    renderCar('no-existe')
    expect(await title()).toHaveTextContent('Este coche ya no está disponible')
    await waitFor(() => expect(document.title).toBe('Coche no encontrado · Rueda'))
  })
})
