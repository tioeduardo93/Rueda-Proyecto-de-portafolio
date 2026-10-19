export type Combustible = 'Gasolina' | 'Diésel' | 'Híbrido' | 'Eléctrico'
export type Cambio = 'Manual' | 'Automático'
export type EtiquetaDgt = '0' | 'ECO' | 'C' | 'B'
export type Carroceria = 'Utilitario' | 'Compacto' | 'Berlina' | 'Familiar' | 'SUV'

export interface Consumo {
  valor: number
  unidad: 'l/100 km' | 'kWh/100 km'
}

export interface Car {
  id: string
  marca: string
  modelo: string
  /** Versión sin la potencia, p. ej. «1.5 TSI FR». */
  version: string
  precio: number
  /** Precio antes de la última rebaja, si la ha habido. */
  precioAnterior?: number
  anio: number
  /** Mes de matriculación (1–12). */
  mes: number
  km: number
  combustible: Combustible
  cambio: Cambio
  /** Número de marchas; `null` en cambios sin marchas fijas (e-CVT, eléctricos). */
  marchas: number | null
  cv: number
  color: string
  puertas: number
  plazas: number
  etiqueta: EtiquetaDgt
  ciudad: string
  carroceria: Carroceria
  consumo: Consumo
  /** Capacidad del maletero en litros. */
  maletero: number
  fotos: number
  equipamiento: string[]
  /** Fecha de publicación en formato ISO (AAAA-MM-DD). */
  publicadoEl: string
  garantiaMeses: number
  unicoPropietario: boolean
  referencia: string
}
