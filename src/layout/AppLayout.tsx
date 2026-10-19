import { Outlet, ScrollRestoration, useMatches } from 'react-router'
import { cn } from '../lib/cn'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export interface RouteHandle {
  /** La página trae su propia cabecera en móvil (la ficha: foto a sangre con botones encima). */
  ownMobileHeader?: boolean
  /** La página tiene una barra fija abajo en móvil: se deja su hueco bajo el pie para que no lo tape. */
  mobileBottomBar?: boolean
}

export function AppLayout() {
  const handles = useMatches().map((m) => (m.handle ?? {}) as RouteHandle)
  const ownMobileHeader = handles.some((h) => h.ownMobileHeader)
  const mobileBottomBar = handles.some((h) => h.mobileBottomBar)

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenido"
        className="fixed top-3 left-3 z-50 -translate-y-24 rounded-btn bg-ink px-4 py-3 font-bold text-white no-underline focus:translate-y-0"
      >
        Saltar al contenido
      </a>
      <SiteHeader className={ownMobileHeader ? 'max-lg:hidden' : undefined} />
      <main id="contenido" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      {/* Hueco = alto de StickyContactBar: 12 px arriba + botón de 52 px + 1 px de borde + margen inferior. */}
      <SiteFooter className={cn(mobileBottomBar && 'max-lg:pb-[calc(65px_+_max(1rem,env(safe-area-inset-bottom)))]')} />
      <ScrollRestoration />
    </div>
  )
}
