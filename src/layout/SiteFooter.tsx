import { ExternalLink } from '../components/ExternalLink'
import { SITE } from '../config/site'
import { cn } from '../lib/cn'
import { FINANCE } from '../lib/finance'
import { formatNumber } from '../lib/format'

const LINKS = [
  { label: 'GitHub', href: SITE.githubUrl },
  { label: 'Repositorio del proyecto', href: SITE.repoUrl },
  { label: 'Portafolio', href: SITE.portfolioUrl },
].filter((l) => l.href)

export function SiteFooter({ className }: { className?: string }) {
  const year = new Date().getFullYear()
  return (
    <footer className={cn('border-t border-line bg-surface', className)}>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-3 p-6 text-[13px] text-muted">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <p>
            © {year} {SITE.name} · Proyecto de portafolio de <span className="font-semibold text-ink-2">{SITE.author}</span>
          </p>
          <nav aria-label="Enlaces del autor">
            <ul className="flex flex-wrap gap-x-5">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <ExternalLink href={l.href} className="font-bold text-accent hover:text-ink">
                    {l.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p>
          Precios con IVA incluido. Cuotas orientativas a {FINANCE.meses} meses con entrada del {FINANCE.entrada * 100}&nbsp;%, TIN{' '}
          {formatNumber(FINANCE.tin * 100, 2)}&nbsp;%.
        </p>
      </div>
    </footer>
  )
}
