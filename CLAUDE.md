# Rueda — buscador de coches de segunda mano

Proyecto de portafolio. Debe parecer un producto real y listo para producción.

## Stack
- Vite + React 18 + TypeScript (strict)
- Tailwind CSS
- React Router (rutas: `/`, `/coche/:id`, `/comparar`, `/favoritos`)
- Zustand para favoritos y comparador (persistidos en localStorage)
- Vitest + Testing Library para tests

## Referencia de diseño
La carpeta `design/` contiene el diseño aprobado. Cada `*.dc.html` es una pantalla.
No se pueden abrir directamente en el navegador (dependen de un runtime externo):
léelos como código fuente para copiar colores, tamaños, espaciados, textos, datos y comportamiento.
- `Main.dc.html` → listado escritorio (con la lógica de filtrado y ordenación en el `<script>`)
- `Detalle-escritorio.dc.html`, `Comparador-escritorio.dc.html`, `Favoritos-escritorio.dc.html`
- `*-movil.dc.html` → las mismas pantallas en móvil, más filtros (panel inferior), cargando y sin resultados
- `Componentes.dc.html` → tokens y componentes base

## Tokens
- Tinta `#0E1A1F` · texto secundario `#56616B` · fondo `#F4F6F6` · superficie `#FFFFFF` · borde `#E3E7EA`
- Acento `#0B7A75` (variable CSS `--accent`) · acento suave = acento al 10 % sobre blanco · favorito `#E5484D`
- Etiquetas DGT: 0 `#1559B8`, ECO mitad `#24803A` / mitad `#1559B8`, C `#24803A`, B `#F2C00F` con texto `#2B2200`
- Fuente Manrope (400–800). Cifras con `tabular-nums`
- Radios: 10 px (campos), 12 px (botones), 16 px (tarjetas), 20 px (paneles)

## Reglas
- Todo el texto en español de España.
- Formato: `18.990 €`, `45.000 km`. Ojo: `Intl.NumberFormat('es-ES')` NO agrupa números de 4 cifras (da `8990`); usa `useGrouping: 'always'` o un formateador propio, y espacio de no separación antes de `€` y `km`.
- Cuota: 96 meses, entrada 15 %, TIN 8,99 % (sistema francés). Centralízalo en `src/lib/finance.ts`.
- Sin logos de marcas: solo nombres en texto. Fotos = placeholders con el nombre del coche.
- Mobile-first. Áreas táctiles ≥ 44 px. Accesible: botones y enlaces reales, `aria-label` en botones de icono, foco visible, contraste AA.
- Componentes pequeños y reutilizables en `src/components/`, sin lógica de negocio dentro.
- Antes de dar algo por terminado: `npm run build`, `npm run lint` y `npm test` sin errores.
