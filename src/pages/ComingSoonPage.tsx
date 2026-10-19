import { ButtonLink } from '../components/Button'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

/** Marcador temporal para las rutas que se construyen en fases posteriores. */
export default function ComingSoonPage({ title, phase }: { title: string; phase: number }) {
  useDocumentTitle(title)
  return (
    <div className="mx-auto flex max-w-[720px] flex-col items-start gap-3 px-4 py-12 sm:px-6">
      <p className="text-[13px] font-bold tracking-[0.08em] text-accent uppercase">Fase {phase}</p>
      <h1 className="text-[32px] font-extrabold tracking-[-0.03em]">{title}</h1>
      <p className="text-muted">Esta pantalla se construye en la fase {phase}.</p>
      <ButtonLink to="/" variant="secondary">
        Volver al listado
      </ButtonLink>
    </div>
  )
}
