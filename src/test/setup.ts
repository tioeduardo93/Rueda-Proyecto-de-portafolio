import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterEach } from 'vitest'
import { latency } from '../lib/api'
import { installMatchMedia } from './matchMedia'

installMatchMedia()

// Sin retardos simulados: los tests esperan a que pase algo, no a que pase un tiempo.
latency.apiMs = 0
latency.loadMoreMs = 0

// Con la máquina cargada, el primer montaje de la app en jsdom pasa de 1 s (lo que esperan por defecto
// `findBy*` y `waitFor`) y el test fallaba sin haber nada roto. No es un retardo: es el tope de espera.
configure({ asyncUtilTimeout: 5000 })

// Sin `globals` de Vitest, Testing Library no desmonta solo entre tests.
afterEach(cleanup)
