import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { setViewportWidth } from '../test/matchMedia'
import { MEDIA, useMediaQuery } from './useMediaQuery'

afterEach(() => setViewportWidth(390))

describe('useMediaQuery', () => {
  it('se actualiza al cruzar el breakpoint', () => {
    setViewportWidth(390)
    const { result } = renderHook(() => useMediaQuery(MEDIA.sm))
    expect(result.current).toBe(false)
    act(() => setViewportWidth(820))
    expect(result.current).toBe(true)
    act(() => setViewportWidth(390))
    expect(result.current).toBe(false)
  })
})
