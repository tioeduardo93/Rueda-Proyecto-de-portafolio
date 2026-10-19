import { lazy, Suspense } from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { AppLayout, type RouteHandle } from './layout/AppLayout'
import CarDetailPage from './pages/CarDetailPage'
import ComingSoonPage from './pages/ComingSoonPage'
import ListingPage from './pages/ListingPage'
import NotFoundPage from './pages/NotFoundPage'

// Galería de componentes: solo en desarrollo (no llega al build de producción).
function devRoutes(): RouteObject[] {
  if (!import.meta.env.DEV) return []
  const ComponentsPage = lazy(() => import('./pages/ComponentsPage'))
  return [
    {
      path: 'componentes',
      element: (
        <Suspense>
          <ComponentsPage />
        </Suspense>
      ),
    },
  ]
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <ListingPage /> },
      { path: 'coche/:id', element: <CarDetailPage />, handle: { ownMobileHeader: true, mobileBottomBar: true } satisfies RouteHandle },
      { path: 'comparar', element: <ComingSoonPage title="Comparar coches" phase={4} /> },
      { path: 'favoritos', element: <ComingSoonPage title="Tus favoritos" phase={4} /> },
      ...devRoutes(),
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
