export type Combustible = 'Gasolina' | 'Diésel' | 'Híbrido' | 'Eléctrico'
export type Cambio = 'Manual' | 'Automático'
export type EtiquetaDgt = '0' | 'ECO' | 'C' | 'B'
export type Carroceria = 'Utilitario' | 'Compacto' | 'Berlina' | 'Familiar' | 'SUV'

/** Qué enseña cada foto; los archivos están en `public/cars/<id>-<n>.webp`. */
export type PhotoView = 'frontal' | 'lateral' | 'trasera' | 'interior' | 'detalle'

export interface PhotoSpec {
  vista: PhotoView
  /** Color de esa foto cuando no coincide con el del anuncio (otra unidad del mismo modelo). */
  color?: string
  /** Texto alternativo cuando la vista no basta para describirla. */
  alt?: string
}

/** Foto lista para pintar. */
export interface Photo {
  src: string
  alt: string
  /** Nombre corto de la vista: «Frontal», «Interior»… */
  label: string
}

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
  equipamiento: string[]
  /** Fecha de publicación en formato ISO (AAAA-MM-DD). */
  publicadoEl: string
  garantiaMeses: number
  unicoPropietario: boolean
  referencia: string
}
