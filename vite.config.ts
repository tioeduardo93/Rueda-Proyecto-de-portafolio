import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    // Los tests de flujo y de axe montan la app entera en jsdom: con todos los archivos en paralelo pueden pasar
    // de los 5 s por defecto. No esperan ningún tiempo; es margen de ejecución.
    testTimeout: 20_000,
  },
})
