/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Dominio de producción, sin barra final (ver `.env`). */
  readonly VITE_SITE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
