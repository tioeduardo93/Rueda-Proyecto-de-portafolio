/** Datos del sitio y de la autoría, en un solo sitio. El dominio sale de `.env` (`VITE_SITE_URL`). */
export const SITE = {
  name: 'Rueda',
  url: import.meta.env.VITE_SITE_URL,
  description: 'Rueda: coches de segunda mano revisados, con historial verificado y precio final sin sorpresas.',
  author: 'Eduardo Cebrián López',
  githubUrl: 'https://github.com/tioeduardo93',
  repoUrl: 'https://github.com/tioeduardo93/Rueda-Proyecto-de-portafolio',
  /** Si se deja vacío, el pie no muestra el enlace. */
  portfolioUrl: 'https://eduardocebrian.dev/',
} as const
