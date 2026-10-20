import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { api } from '../lib/api'
import { axeViolations } from './axe'
import { setViewportWidth } from './matchMedia'
import { renderApp } from './renderApp'

afterEach(() => vi.restoreAllMocks())

// Archivo propio: el catálogo se guarda en caché por módulo, y aquí la primera petición tiene que fallar.
describe('error al cargar el catálogo', () => {
  it('muestra el error y «Reintentar» vuelve a pedir los coches', async () => {
    setViewportWidth(1440)
    const getCars = vi.spyOn(api, 'getCars').mockRejectedValueOnce(new Error('Sin conexión'))
    renderApp('/')
    expect(await screen.findByRole('heading', { name: 'No hemos podido cargar los coches' })).toBeInTheDocument()
    expect(await axeViolations()).toEqual([])

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(await screen.findByRole('heading', { name: '24 coches encontrados' })).toBeInTheDocument()
    expect(getCars).toHaveBeenCalledTimes(2)
  })
})
