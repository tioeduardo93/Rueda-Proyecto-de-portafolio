import { useEffect, useId, useRef } from 'react'
import { NBSP, formatNumber, formatPrice } from '../../lib/format'
import { FilterChip } from '../FilterChip'

export interface FinanceCalculatorProps {
  downPayment: number
  maxDownPayment: number
  step: number
  onDownPaymentChange: (value: number) => void
  term: number
  terms: readonly number[]
  onTermChange: (months: number) => void
  /** Resultado ya calculado por quien usa el componente. */
  monthly: number
  financed: number
  total: number
  /** TIN en tanto por uno (0,0899). */
  tin: number
}

/** Calculadora de cuota: entrada con slider, plazo con botones y resumen en panel oscuro. */
export function FinanceCalculator({
  downPayment,
  maxDownPayment,
  step,
  onDownPaymentChange,
  term,
  terms,
  onTermChange,
  monthly,
  financed,
  total,
  tin,
}: FinanceCalculatorProps) {
  const downId = useId()
  const termId = useId()
  const termsRef = useRef<HTMLDivElement>(null)

  // En móvil la fila de plazos tiene scroll horizontal: el plazo elegido (96, al final) debe verse.
  // Solo se mueve la fila; `scrollIntoView` desplazaría también la página.
  useEffect(() => {
    const row = termsRef.current
    const chip = row?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!row || !chip || row.scrollWidth <= row.clientWidth) return
    const padding = parseFloat(getComputedStyle(row).paddingLeft) || 0
    const left = chip.offsetLeft - padding
    const right = chip.offsetLeft + chip.offsetWidth + padding - row.clientWidth
    if (row.scrollLeft > left) row.scrollLeft = left
    else if (row.scrollLeft < right) row.scrollLeft = right
  }, [term])
  const tinText = `${formatNumber(tin * 100, 2)}${NBSP}%`

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:gap-7">
      <div className="flex flex-col gap-4 lg:flex-[3_1_340px] lg:gap-[22px]">
        <p className="hidden text-sm text-muted lg:block">Ajusta la entrada y el plazo para ver tu cuota al momento.</p>

        <div className="flex flex-col gap-1.5 lg:gap-2.5">
          <div className="flex items-baseline justify-between">
            <label htmlFor={downId} className="text-sm font-extrabold">
              Entrada
            </label>
            <span className="text-[15px] font-extrabold tabular-nums lg:text-lg">{formatPrice(downPayment)}</span>
          </div>
          <input
            id={downId}
            type="range"
            min={0}
            max={maxDownPayment}
            step={step}
            value={downPayment}
            aria-valuetext={formatPrice(downPayment)}
            onChange={(e) => onDownPaymentChange(Number(e.target.value))}
            className="m-0 h-11 w-full"
          />
          <div aria-hidden="true" className="flex justify-between text-xs text-muted tabular-nums">
            <span>{formatPrice(0)}</span>
            <span>{formatPrice(maxDownPayment)}</span>
          </div>
        </div>

        <div role="group" aria-labelledby={termId} className="flex flex-col gap-2 lg:gap-2.5">
          <span id={termId} className="text-sm font-extrabold">
            Plazo <span className="lg:hidden">(meses)</span>
          </span>
          <div
            ref={termsRef}
            className="no-scrollbar relative -mx-4 flex gap-1.5 overflow-x-auto px-4 py-[3px] lg:mx-0 lg:grid lg:grid-cols-7 lg:overflow-visible lg:px-0"
          >
            {terms.map((n) => (
              <FilterChip
                key={n}
                shape="tile"
                selected={term === n}
                onClick={() => onTermChange(n)}
                aria-label={`${n} meses`}
                className="h-11! w-[52px] flex-none text-sm font-bold tabular-nums lg:w-auto"
              >
                {n}
              </FilterChip>
            ))}
          </div>
          <span aria-hidden="true" className="hidden text-xs text-muted lg:block">
            Meses
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-[2_1_240px]">
        <div className="flex items-center justify-between rounded-[14px] bg-ink p-4 text-white lg:flex-1 lg:flex-col lg:items-stretch lg:justify-start lg:gap-3.5 lg:rounded-card lg:p-6">
          <div className="flex flex-col gap-0.5 lg:gap-3.5">
            <span className="text-xs text-subtle lg:text-[13px] lg:font-bold lg:tracking-[0.08em] lg:uppercase">
              <span className="lg:hidden">Cuota mensual</span>
              <span className="max-lg:hidden">Tu cuota mensual</span>
            </span>
            <span aria-live="polite" className="text-[30px] leading-none font-extrabold tracking-[-0.03em] tabular-nums lg:text-[44px]">
              {formatPrice(monthly)}
              <span className="text-[18px] font-bold text-subtle max-lg:text-white max-lg:text-[30px] max-lg:font-extrabold">/mes</span>
            </span>
          </div>
          <div className="flex flex-col gap-0.5 text-right text-xs text-subtle tabular-nums lg:hidden">
            <span>Financias {formatPrice(financed)}</span>
            <span>TIN {tinText}</span>
          </div>
          <dl className="hidden flex-col gap-2 border-t border-white/15 pt-3.5 text-sm tabular-nums lg:flex">
            {[
              ['Importe financiado', formatPrice(financed)],
              ['Plazo', `${term} meses`],
              ['TIN', tinText],
              ['Total a plazos', formatPrice(total)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <dt className="text-subtle">{k}</dt>
                <dd className="font-bold">{v}</dd>
              </div>
            ))}
          </dl>
          <span className="hidden text-xs text-subtle lg:block">Cálculo orientativo. Sujeto a estudio y aprobación de la entidad financiera.</span>
        </div>
        <span className="text-xs text-muted lg:hidden">Cálculo orientativo. Sujeto a estudio y aprobación de la entidad financiera.</span>
      </div>
    </div>
  )
}
