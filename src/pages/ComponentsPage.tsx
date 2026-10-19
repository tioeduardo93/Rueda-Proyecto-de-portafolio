import { useState, type ReactNode } from 'react'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { CarCard } from '../components/CarCard'
import { CarCardSkeleton } from '../components/CarCardSkeleton'
import { CompareBar } from '../components/CompareBar'
import { DgtBadge } from '../components/DgtBadge'
import { EmptyState } from '../components/EmptyState'
import { FilterChip } from '../components/FilterChip'
import { RangeSlider } from '../components/RangeSlider'
import { CARS } from '../data/cars'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { cuotaDesde } from '../lib/finance'
import { formatKm, formatPrice } from '../lib/format'

const COLORS = [
  ['Tinta', '#0E1A1F', 'bg-ink'],
  ['Texto 2', '#56616B', 'bg-muted'],
  ['Fondo', '#F4F6F6', 'bg-canvas'],
  ['Superficie', '#FFFFFF', 'bg-surface'],
  ['Borde', '#E3E7EA', 'bg-line'],
  ['Acento', 'var(--accent)', 'bg-accent'],
  ['Acento suave', 'acento 10 %', 'bg-accent-soft'],
  ['Favorito', '#E5484D', 'bg-fav'],
] as const

function Panel({ title, code, children }: { title: string; code?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3.5 rounded-panel border border-line bg-surface p-6">
      <h2 className="text-lg font-extrabold">{title}</h2>
      {children}
      {code && <code className="font-mono text-xs text-muted">{code}</code>}
    </section>
  )
}

/** Catálogo de componentes base (solo en desarrollo, en /componentes). Réplica de Componentes.dc.html. */
export default function ComponentsPage() {
  useDocumentTitle('Componentes')
  const [fuel, setFuel] = useState<string[]>(['Híbrido'])
  const [price, setPrice] = useState<[number, number]>([3000, 30000])
  const [fav, setFav] = useState(true)
  const [cmp, setCmp] = useState(true)
  const car = CARS.find((c) => c.id === 'chr') ?? CARS[0]!

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-[40px] font-extrabold tracking-[-0.03em]">Componentes y tokens</h1>
        <p className="text-muted">Piezas reutilizables de <code>src/components</code>. Esta página solo existe en desarrollo.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6">
          <Panel title="Color">
            <div className="grid grid-cols-4 gap-3">
              {COLORS.map(([name, value, cls]) => (
                <div key={name} className="flex flex-col gap-1.5">
                  <div className={`h-14 rounded-btn border border-line ${cls}`} />
                  <span className="text-xs font-bold">{name}</span>
                  <span className="font-mono text-[11px] text-muted">{value}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Tipografía · Manrope">
            <span className="text-[40px] leading-none font-extrabold tracking-[-0.035em] tabular-nums">{formatPrice(18990)}</span>
            <span className="text-[26px] font-extrabold tracking-[-0.03em]">SEAT León</span>
            <span className="text-[17px] font-extrabold tabular-nums">{formatKm(45000)}</span>
            <span className="text-[15px] font-medium">Revisado y con garantía</span>
            <span className="text-[13px] text-muted">1.5 TSI FR · 150 CV</span>
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Button" code="variant: primary | secondary | dark | ghost · size: md | lg | xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <Button size="lg">Me interesa</Button>
              <Button size="lg" variant="secondary">
                Añadir a favoritos
              </Button>
              <Button size="lg" variant="dark">
                Filtros
              </Button>
              <Button size="lg" disabled>
                Deshabilitado
              </Button>
              <Button variant="ghost">Limpiar todo</Button>
            </div>
          </Panel>
          <Panel title="FilterChip" code="selected · shape: pill | tile · onRemove">
            <div className="flex flex-wrap items-center gap-2">
              {['Diésel', 'Híbrido'].map((f) => (
                <FilterChip
                  key={f}
                  selected={fuel.includes(f)}
                  onClick={() => setFuel((xs) => (xs.includes(f) ? xs.filter((x) => x !== f) : [...xs, f]))}
                >
                  {f}
                </FilterChip>
              ))}
              <FilterChip onRemove={() => setPrice([3000, 60000])}>{`Hasta ${formatPrice(price[1])}`}</FilterChip>
            </div>
          </Panel>
          <Panel title="DgtBadge y Badge" code="label: '0' | 'ECO' | 'C' | 'B'">
            <div className="flex items-center gap-4">
              <DgtBadge label="0" />
              <DgtBadge label="ECO" />
              <DgtBadge label="C" />
              <DgtBadge label="B" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>Garantía 12 meses</Badge>
              <Badge tone="neutral">Único propietario</Badge>
              <Badge tone="solid">Ha bajado {formatPrice(600)}</Badge>
              <Badge tone="overlay">14 fotos</Badge>
            </div>
          </Panel>
          <Panel title="RangeSlider" code="value: [min, max] · formatValue">
            <RangeSlider label="Precio" min={3000} max={60000} step={500} value={price} onChange={setPrice} formatValue={formatPrice} />
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <CarCard
            car={car}
            monthlyFee={cuotaDesde(car.precio)}
            isFavorite={fav}
            onToggleFavorite={() => setFav((v) => !v)}
            isComparing={cmp}
            onToggleCompare={() => setCmp((v) => !v)}
          />
          <CarCardSkeleton />
          <CompareBar
            items={[
              { id: 'leon', name: 'SEAT León' },
              { id: 'chr', name: 'Toyota C-HR' },
            ]}
            max={3}
            onRemove={() => {}}
            to="/comparar"
          />
        </div>
      </div>

      <EmptyState
        illustration="search"
        title="No hay coches con estos filtros"
        description="Prueba a ampliar el rango de precio o kilómetros, o quita alguno de los filtros activos."
      >
        <Button size="lg">Limpiar filtros</Button>
      </EmptyState>
    </div>
  )
}
