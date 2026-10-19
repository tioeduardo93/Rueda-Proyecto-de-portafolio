import { beforeEach, describe, expect, it } from 'vitest'
import { MAX_COMPARE, useCompare } from './compare'
import { useFavorites } from './favorites'

beforeEach(() => {
  localStorage.clear()
  useFavorites.setState({ items: [] })
  useCompare.setState({ ids: [] })
})

describe('favoritos', () => {
  it('añade al principio y quita al volver a pulsar', () => {
    const { toggle } = useFavorites.getState()
    toggle('leon')
    toggle('chr')
    expect(useFavorites.getState().items.map((f) => f.id)).toEqual(['chr', 'leon'])
    toggle('leon')
    expect(useFavorites.getState().items.map((f) => f.id)).toEqual(['chr'])
  })

  it('persiste en localStorage', () => {
    useFavorites.getState().toggle('golf')
    expect(localStorage.getItem('rueda:favoritos')).toContain('"golf"')
  })
})

describe('comparador', () => {
  it(`admite como máximo ${MAX_COMPARE} coches`, () => {
    const { toggle } = useCompare.getState()
    ;['a', 'b', 'c', 'd'].forEach(toggle)
    expect(useCompare.getState().ids).toEqual(['a', 'b', 'c'])
  })

  it('quita un coche al volver a pulsar', () => {
    const { toggle } = useCompare.getState()
    toggle('a')
    toggle('b')
    toggle('a')
    expect(useCompare.getState().ids).toEqual(['b'])
  })

  it('set recorta y elimina duplicados', () => {
    useCompare.getState().set(['a', 'a', 'b', 'c', 'd'])
    expect(useCompare.getState().ids).toEqual(['a', 'b', 'c'])
  })

  it('persiste en localStorage', () => {
    useCompare.getState().toggle('leon')
    expect(localStorage.getItem('rueda:comparador')).toContain('"leon"')
  })
})
