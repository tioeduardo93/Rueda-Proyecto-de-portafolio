import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { useCompare } from '../store/compare'
import { useFavorites } from '../store/favorites'
import { axeViolations } from './axe'
import { setViewportWidth } from './matchMedia'
import { renderApp } from './renderApp'

const savedAt = new Date().toISOString()

beforeEach(() => {
  localStorage.clear()
  useFavorites.setState({ items: [] })
  useCompare.setState({ ids: [] })
  setViewportWidth(1440)
})

/** Cada pantalla y estado, con lo que hay que esperar para saber que ya ha cargado. */
const PAGES: { name: string; url: string; ready: () => Promise<HTMLElement>; setup?: () => void }[] = [
  { name: 'listado', url: '/', ready: () => screen.findByRole('heading', { name: '24 coches encontrados' }) },
  {
    name: 'listado con filtros',
    url: '/?marca=SEAT&combustible=Gasolina&precioMax=20000',
    ready: () => screen.findByRole('heading', { name: /coches? encontrados?/ }),
  },
  { name: 'listado sin resultados', url: '/?marca=Tesla&combustible=Diésel', ready: () => screen.findByRole('heading', { name: 'No hay coches con estos filtros' }) },
  { name: 'ficha', url: '/coche/leon', ready: () => screen.findByRole('heading', { level: 1, name: 'SEAT León' }) },
  { name: 'ficha inexistente', url: '/coche/no-existe', ready: () => screen.findByRole('heading', { name: 'Este coche ya no está disponible' }) },
  {
    name: 'comparador',
    url: '/comparar',
    setup: () => useCompare.setState({ ids: ['leon', 'chr', 'p3008'] }),
    ready: () => screen.findByRole('table'),
  },
  {
    name: 'comparador con 1 coche',
    url: '/comparar',
    setup: () => useCompare.setState({ ids: ['leon'] }),
    ready: () => screen.findByRole('table'),
  },
  { name: 'comparador vacío', url: '/comparar', ready: () => screen.findByRole('heading', { name: 'Aún no has elegido coches para comparar' }) },
  {
    name: 'favoritos',
    url: '/favoritos',
    setup: () => useFavorites.setState({ items: [{ id: 'chr', savedAt }, { id: 'model3', savedAt }] }),
    ready: () => screen.findByRole('heading', { level: 2, name: 'Toyota C-HR' }),
  },
  { name: 'favoritos vacío', url: '/favoritos', ready: () => screen.findByRole('heading', { name: 'Aún no tienes favoritos' }) },
  { name: '404', url: '/no-existe', ready: () => screen.findByRole('heading', { level: 1, name: 'Esta página no existe' }) },
]

describe('accesibilidad (axe)', () => {
  it('el ayudante detecta infracciones (control del propio test)', async () => {
    const div = document.createElement('div')
    div.innerHTML = '<main><button type="button"><svg aria-hidden="true"></svg></button></main>'
    document.body.append(div)
    expect((await axeViolations(div)).join()).toContain('button-name')
    div.remove()
  })

  it.each(PAGES)('$name: sin infracciones', async ({ url, ready, setup }) => {
    setup?.()
    renderApp(url)
    await ready()
    expect(await axeViolations()).toEqual([])
  })

  it('panel de filtros en móvil: sin infracciones', async () => {
    setViewportWidth(390)
    renderApp('/')
    await screen.findByRole('heading', { name: '24 coches encontrados' })
    await userEvent.click(screen.getByRole('button', { name: /^Filtros/ }))
    await screen.findByRole('dialog', { name: 'Filtros' })
    expect(await axeViolations()).toEqual([])
  })

  it.each(PAGES.filter((p) => p.name !== 'listado con filtros'))('$name: landmarks y un solo h1 visible por ancho', async ({ url, ready, setup }) => {
    setup?.()
    renderApp(url)
    await ready()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getAllByRole('banner').length).toBeGreaterThan(0)
    // Sin CSS se ven a la vez los h1 de móvil y de escritorio: como mucho uno de cada.
    expect(screen.getAllByRole('heading', { level: 1 }).length).toBeLessThanOrEqual(2)
  })
})
