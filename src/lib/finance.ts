/**
 * Financiación orientativa. Único sitio donde viven las condiciones:
 * 96 meses, entrada del 15 % y TIN del 8,99 % con sistema francés (cuota constante).
 */
export const FINANCE = {
  meses: 96,
  entrada: 0.15,
  tin: 0.0899,
  /** Plazos disponibles en la calculadora, en meses. */
  plazos: [24, 36, 48, 60, 72, 84, 96],
  /** Paso del slider de entrada, en euros. */
  pasoEntrada: 250,
  /** Entrada máxima como fracción del precio. */
  entradaMaxima: 0.5,
} as const

export type Plazo = (typeof FINANCE.plazos)[number]

const roundCents = (value: number) => Math.round(value * 100) / 100

/**
 * Cuota mensual con sistema francés: C · r / (1 − (1 + r)^−n), con r = TIN / 12.
 * Devuelve céntimos (redondeado a 2 decimales).
 */
export function monthlyPayment(capital: number, meses: number, tin: number = FINANCE.tin): number {
  if (capital <= 0 || meses <= 0) return 0
  const r = tin / 12
  if (r === 0) return roundCents(capital / meses)
  return roundCents((capital * r) / (1 - Math.pow(1 + r, -meses)))
}

/** Cuota «desde» que se muestra en tarjetas y fichas: condiciones estándar, redondeada al euro. */
export function cuotaDesde(precio: number): number {
  return Math.round(monthlyPayment(precio * (1 - FINANCE.entrada), FINANCE.meses))
}

/** Entrada por defecto de la calculadora: el 15 % del precio, ajustado al paso del slider. */
export function defaultDownPayment(precio: number): number {
  return Math.round((precio * FINANCE.entrada) / FINANCE.pasoEntrada) * FINANCE.pasoEntrada
}

/** Entrada máxima de la calculadora: la mitad del precio, ajustada al paso del slider. */
export function maxDownPayment(precio: number): number {
  return Math.floor((precio * FINANCE.entradaMaxima) / FINANCE.pasoEntrada) * FINANCE.pasoEntrada
}

export interface FinanceSimulation {
  financiado: number
  cuota: number
  meses: number
  /** Entrada + todas las cuotas. */
  totalAPlazos: number
  intereses: number
}

export function simulateFinancing(precio: number, entrada: number, meses: number): FinanceSimulation {
  const financiado = Math.max(precio - entrada, 0)
  const cuota = monthlyPayment(financiado, meses)
  const totalCuotas = roundCents(cuota * meses)
  return {
    financiado,
    cuota,
    meses,
    totalAPlazos: roundCents(totalCuotas + Math.min(entrada, precio)),
    intereses: roundCents(totalCuotas - financiado),
  }
}
