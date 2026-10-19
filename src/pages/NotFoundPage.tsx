import { ButtonLink } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFoundPage() {
  useDocumentTitle('Página no encontrada')
  return (
    <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-6 sm:py-16">
      <EmptyState
        illustration="search"
        headingLevel="h1"
        title="Esta página no existe"
        description="Puede que el enlace esté mal escrito o que el anuncio ya no esté publicado."
      >
        <ButtonLink to="/" size="lg" block className="sm:w-auto">
          Ver todos los coches
        </ButtonLink>
      </EmptyState>
    </div>
  )
}
