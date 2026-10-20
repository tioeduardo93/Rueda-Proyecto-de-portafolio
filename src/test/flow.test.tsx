import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { useCompare } from '../store/compare'
import { useFavorites } from '../store/favorites'
import { setViewportWidth } from './matchMedia'
import { renderApp } from './renderApp'

const results = (name: string | RegExp) => screen.findByRole('heading', { level: 2, name })

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  useFavorites.setState({ items: [] })
  useCompare.setState({ ids: [] })
  setViewportWidth(1440)
})

describe('flujo principal', () => {
  it('buscar y filtrar → ficha → favorito → volver → comparar → favoritos', async () => {
    const user = userEvent.setup()
    const router = renderApp('/')
    await results('24 coches encontrados')

    // Buscar y filtrar: los dos van a la URL.
    await user.type(screen.getByRole('searchbox', { name: 'Buscar por marca o modelo' }), 'volkswagen')
    await results('3 coches encontrados')
    const sidebar = screen.getByRole('complementary', { name: 'Filtros' })
    await user.click(within(sidebar).getByRole('button', { name: 'Diésel' }))
    await results('1 coche encontrado')
    expect(decodeURIComponent(router.state.location.search)).toBe('?q=volkswagen&combustible=Diésel')

    // Abrir la ficha y guardarla en favoritos.
    await user.click(screen.getByRole('link', { name: 'Volkswagen Golf' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Volkswagen Golf' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Añadir a favoritos' }))
    expect(screen.getByRole('link', { name: 'Favoritos 1 coche guardado' })).toBeInTheDocument()

    // «Volver a resultados» recupera la búsqueda.
    await user.click(screen.getAllByRole('link', { name: 'Volver a resultados' })[0]!)
    await results('1 coche encontrado')
    expect(decodeURIComponent(router.state.location.search)).toBe('?q=volkswagen&combustible=Diésel')
    expect(screen.getByRole('searchbox', { name: 'Buscar por marca o modelo' })).toHaveValue('volkswagen')

    // Elegir dos coches para comparar.
    await user.click(screen.getByRole('checkbox', { name: 'Comparar Volkswagen Golf' }))
    // La barra lateral se ha vuelto a montar al volver de la ficha.
    const sidebarAgain = screen.getByRole('complementary', { name: 'Filtros' })
    await user.click(within(sidebarAgain).getByRole('button', { name: 'Limpiar filtros' }))
    await results('24 coches encontrados')
    await user.click(screen.getByRole('checkbox', { name: 'Comparar SEAT León' }))
    const bar = screen.getByRole('region', { name: 'Comparador' })
    expect(within(bar).getByText('Comparar (2/3)')).toBeInTheDocument()

    await user.click(within(bar).getByRole('link', { name: /Comparar/ }))
    const table = await screen.findByRole('table', { name: 'Comparativa de especificaciones' })
    const columns = within(table).getAllByRole('columnheader').map((h) => h.textContent ?? '')
    expect(columns.some((c) => c.includes('Volkswagen Golf'))).toBe(true)
    expect(columns.some((c) => c.includes('SEAT León'))).toBe(true)

    // Favoritos, desde la cabecera.
    await user.click(screen.getByRole('link', { name: 'Favoritos 1 coche guardado' }))
    expect(await screen.findByRole('heading', { level: 2, name: 'Volkswagen Golf' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/favoritos')
  })

  it('en móvil los filtros se aplican desde el panel inferior', async () => {
    setViewportWidth(390)
    const user = userEvent.setup()
    const router = renderApp('/')
    await results('24 coches encontrados')
    // La fila «Filtros / Ordenar» está dentro de la cabecera fija.
    const header = screen.getAllByRole('banner')[0]!
    await user.click(within(header).getByRole('button', { name: /^Filtros/ }))
    const sheet = await screen.findByRole('dialog', { name: 'Filtros' })
    await user.click(within(sheet).getByRole('button', { name: 'Eléctrico' }))
    await user.click(within(sheet).getByRole('button', { name: 'Ver 4 coches' }))
    await results('4 coches encontrados')
    expect(decodeURIComponent(router.state.location.search)).toBe('?combustible=Eléctrico')
    expect(within(header).getByRole('button', { name: /^Filtros/ })).toHaveTextContent('1')
  })

  it('el contador de favoritos no cuenta coches retirados del catálogo', async () => {
    useFavorites.setState({
      items: [
        { id: 'retirado', savedAt: new Date().toISOString() },
        { id: 'leon', savedAt: new Date().toISOString() },
      ],
    })
    useCompare.setState({ ids: ['retirado', 'chr'] })
    renderApp('/')
    // Sin pasar por /favoritos ni /comparar: lo limpia el layout al llegar el catálogo.
    expect(await screen.findByRole('link', { name: 'Favoritos 1 coche guardado' })).toBeInTheDocument()
    expect(useCompare.getState().ids).toEqual(['chr'])
  })
})

describe('un solo panel de filtros y un solo selector de orden', () => {
  const SORT_LABELS = ['Más recientes', 'Precio: de menor a mayor', 'Precio: de mayor a menor', 'Menos kilómetros', 'Año: más nuevos']

  it.each([
    { width: 1440, sidebar: 1 },
    { width: 390, sidebar: 0 },
  ])('a $width px', async ({ width, sidebar }) => {
    setViewportWidth(width)
    const user = userEvent.setup()
    const router = renderApp('/')
    await results('24 coches encontrados')

    expect(screen.queryAllByRole('complementary', { name: 'Filtros' })).toHaveLength(sidebar)
    const sorts = screen.getAllByRole('combobox', { name: 'Ordenar por' })
    expect(sorts).toHaveLength(1)
    expect(within(sorts[0]!).getAllByRole('option').map((o) => o.textContent)).toEqual(SORT_LABELS)

    await user.selectOptions(sorts[0]!, 'Precio: de menor a mayor')
    expect(router.state.location.search).toBe('?orden=precio-asc')
  })
})

describe('fotos del listado', () => {
  it('solo la primera tarjeta pide su foto enseguida, y todas reservan su tamaño', async () => {
    setViewportWidth(1440)
    renderApp('/')
    await results('24 coches encontrados')
    // Las fotos de las tarjetas cuelgan de un enlace oculto (el título ya enlaza): se buscan en el DOM.
    const photos = [...document.querySelectorAll<HTMLImageElement>('article img')]
    expect(photos.length).toBeGreaterThan(1)
    expect(photos.map((img) => img.getAttribute('loading'))).toEqual(['eager', ...photos.slice(1).map(() => 'lazy')])
    for (const img of photos) {
      expect(img).toHaveAttribute('width', '1200')
      expect(img).toHaveAttribute('height', '800')
      expect(img.getAttribute('src')).toMatch(/^\/cars\/[\w-]+-1\.webp$/)
      expect(img.alt).toMatch(/, vista /)
    }
  })
})
