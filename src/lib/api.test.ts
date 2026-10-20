import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CARS } from '../data/cars'
import { NotFoundError, api, latency, rebaseDates } from './api'

describe('rebaseDates', () => {
  it('desplaza las fechas para que el catálogo parezca reciente', () => {
    const [leon] = rebaseDates(CARS.slice(0, 1), new Date(2027, 0, 10))
    // El 18/10/2026 era «ayer» respecto al 19/10/2026
    expect(leon?.publicadoEl).toBe('2027-01-09')
  })

  it('no muta el catálogo original', () => {
    const before = CARS[0]?.publicadoEl
    rebaseDates(CARS, new Date(2030, 5, 1))
    expect(CARS[0]?.publicadoEl).toBe(before)
  })
})

describe('api', () => {
  // Aquí sí se prueba el retardo: el setup lo pone a 0 para el resto de tests.
  const DELAY = 500
  beforeEach(() => {
    vi.useFakeTimers()
    latency.apiMs = DELAY
  })
  afterEach(() => {
    vi.useRealTimers()
    latency.apiMs = 0
  })

  it('devuelve el catálogo tras el retardo simulado', async () => {
    const promise = api.getCars()
    await vi.advanceTimersByTimeAsync(DELAY)
    await expect(promise).resolves.toHaveLength(CARS.length)
  })

  it('devuelve un coche por id', async () => {
    const promise = api.getCar('leon')
    await vi.advanceTimersByTimeAsync(DELAY)
    await expect(promise).resolves.toMatchObject({ marca: 'SEAT', modelo: 'León' })
  })

  it('lanza NotFoundError si el id no existe', async () => {
    const assertion = expect(api.getCar('no-existe')).rejects.toBeInstanceOf(NotFoundError)
    await vi.advanceTimersByTimeAsync(DELAY)
    await assertion
  })

  it('se puede cancelar con AbortSignal', async () => {
    const controller = new AbortController()
    const promise = api.getCars(controller.signal)
    controller.abort()
    await expect(promise).rejects.toBeDefined()
  })
})
