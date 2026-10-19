import { cn } from '../../lib/cn'
import {
  DGT_LABELS,
  FUELS,
  GEARBOXES,
  RANGE_KEYS,
  RANGES,
  toggle,
  type BrandFacet,
  type Filters,
  type ModelGroup,
} from '../../lib/filters'
import { DgtBadge } from '../DgtBadge'
import { RangeSlider } from '../RangeSlider'
import { BrandFilter } from './BrandFilter'
import { ModelSelect } from './ModelSelect'
import { OptionChips } from './OptionChips'

export interface FilterFieldsProps {
  filters: Filters
  brands: BrandFacet[]
  models: ModelGroup[]
  /** `continuous`: el cambio llega de un slider que se está arrastrando. */
  onChange: (patch: Partial<Filters>, change: { continuous: boolean }) => void
  onToggleBrand: (brand: string) => void
  /** `sidebar` (escritorio) o `sheet` (panel inferior en móvil, controles más grandes). */
  variant: 'sidebar' | 'sheet'
}

/** Todos los controles de filtro. La barra lateral y el panel móvil los comparten. */
export function FilterFields({ filters, brands, models, onChange, onToggleBrand, variant }: FilterFieldsProps) {
  const sheet = variant === 'sheet'
  const size = sheet ? 'lg' : 'md'
  const discrete = { continuous: false }

  return (
    <div className={cn(sheet && '[&>*:first-child]:border-t-0')}>
      <BrandFilter brands={brands} selected={filters.marcas} onToggle={onToggleBrand} variant={sheet ? 'chips' : 'list'} />
      <ModelSelect groups={models} value={filters.modelo} onChange={(modelo) => onChange({ modelo }, discrete)} size={size} />

      {RANGE_KEYS.map((key) => {
        const r = RANGES[key]
        return (
          <div key={key} className="border-t border-line-soft py-4">
            <RangeSlider
              label={r.label}
              min={r.min}
              max={r.max}
              step={r.step}
              value={filters[key]}
              formatValue={r.format}
              onChange={(value) => onChange({ [key]: value }, { continuous: true })}
              showBounds={!sheet}
              size={size}
            />
          </div>
        )
      })}

      <OptionChips
        title="Combustible"
        options={FUELS.map((v) => ({ value: v, label: v }))}
        selected={filters.combustibles}
        onToggle={(v) => onChange({ combustibles: toggle(filters.combustibles, v) }, discrete)}
        shape={sheet ? 'tile' : 'pill'}
        size={size}
        layoutClassName={sheet ? 'grid grid-cols-2 gap-2' : undefined}
        chipClassName={sheet ? 'h-11! rounded-btn! text-sm' : undefined}
      />
      <OptionChips
        title="Cambio"
        options={GEARBOXES.map((v) => ({ value: v, label: v }))}
        selected={filters.cambios}
        onToggle={(v) => onChange({ cambios: toggle(filters.cambios, v) }, discrete)}
        shape="tile"
        size={size}
        layoutClassName="grid grid-cols-2 gap-2"
        chipClassName={sheet ? 'h-11! rounded-btn! text-sm' : undefined}
      />
      <OptionChips
        title="Etiqueta ambiental DGT"
        options={DGT_LABELS.map((v) => ({ value: v, label: <DgtBadge label={v} decorative />, ariaLabel: `Etiqueta ${v}` }))}
        selected={filters.etiquetas}
        onToggle={(v) => onChange({ etiquetas: toggle(filters.etiquetas, v) }, discrete)}
        shape="tile"
        size={size}
        layoutClassName="grid grid-cols-4 gap-2"
        chipClassName={cn('flex items-center justify-center rounded-btn!', sheet ? 'h-[52px]!' : 'h-12!')}
      />
    </div>
  )
}
