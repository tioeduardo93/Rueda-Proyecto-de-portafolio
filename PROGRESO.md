# Progreso de Rueda

Registro de avance por fases. Se actualiza al cerrar cada fase.

| Fase | Estado | Fecha |
| --- | --- | --- |
| 0. Plan y repositorio | ✅ Hecha | 19/10/2026 |
| 1. Estructura, tokens, datos y componentes base | ✅ Hecha · pendiente de revisión | 19/10/2026 |
| 2. Listado con filtros, orden y URL | ⏳ Pendiente | — |
| 3. Ficha y calculadora | ⏳ Pendiente | — |
| 4. Comparador y favoritos | ⏳ Pendiente | — |
| 5. Responsive, accesibilidad, tests y README | ⏳ Pendiente | — |

## Estructura

```
src/
├── main.tsx · App.tsx         Entrada y rutas (/, /coche/:id, /comparar, /favoritos, 404; /componentes solo en desarrollo)
├── index.css                  Tokens del diseño (@theme de Tailwind 4) y utilidades (placeholder, skeleton, slider doble)
├── types.ts                   Tipo Car y uniones (combustible, cambio, etiqueta, carrocería)
├── data/cars.ts               24 coches (13 del diseño + 11 nuevos) y nombres de las fotos de la galería
├── lib/
│   ├── format.ts              Precios, km, decimales, matrícula, fechas relativas (sin Intl: agrupa 4 cifras)
│   ├── finance.ts             Única fuente de la financiación: 96 meses, 15 %, TIN 8,99 %, sistema francés
│   ├── api.ts                 API simulada (500 ms, cancelable, 404 tipado)
│   └── cn.ts                  Unión de clases
├── store/                     Zustand persistido: favoritos (con fecha de guardado) y comparador (máx. 3)
├── hooks/                     useCars (con caché de sesión), useDocumentTitle
├── components/                Presentacionales, sin lógica de negocio:
│                              Button/ButtonLink, FilterChip, DgtBadge, Badge, CarPhoto, CarCard,
│                              CarCardSkeleton, RangeSlider, CompareBar, EmptyState, Logo, icons
├── containers/                Conectan componentes con stores y finanzas (CarCardContainer, CompareBarContainer)
├── layout/                    AppLayout (enlace «Saltar al contenido»), SiteHeader, SiteFooter
└── pages/                     ListingPage (provisional), NotFoundPage, ComingSoonPage, ComponentsPage (dev)
```

## Fase 1 · Estructura, tokens, datos y componentes base

**Hecho**
- Vite 8 + React 18.3 + TypeScript 5.9 (strict, `noUncheckedIndexedAccess`) + Tailwind 4 + React Router 7 + Zustand 5 + Vitest 5.
- ESLint 9 con `typescript-eslint`, `react-hooks` y `jsx-a11y`.
- Manrope autoalojada (`@fontsource-variable/manrope`): sin peticiones a Google Fonts.
- Tokens de `CLAUDE.md` y `Componentes.dc.html` como utilidades de Tailwind (`bg-accent`, `bg-accent-soft`, `rounded-card`…). El acento sale de `--accent`.
- Componentes base con la disposición de móvil y de escritorio del diseño en el mismo marcado.
- `/` ya muestra el catálogo real, con skeletons, favoritos, comparador y su barra flotante. Los filtros llegan en la fase 2.
- 49 tests: formateadores, cuota (cuadra con las del diseño: León 236 €, Golf 217 €, C-HR 273 €…), integridad del catálogo, API y stores.
- `npm run build`, `npm run lint` y `npm test` sin errores ni avisos. Revisado en el navegador a 1280 px y a 375 px: sin errores en consola ni scroll horizontal.

**Decisiones por defecto aplicadas** (se pueden cambiar)
1. **React Router 7**, no 8: la 8 exige React 19 y `CLAUDE.md` fija React 18. **TypeScript 5.9** y **ESLint 9**: las versiones nuevas aún no son compatibles con `typescript-eslint` y `jsx-a11y`.
2. **Filtros por defecto = rangos completos** (3.000–60.000 €, 2010–2025, 0–200.000 km). El estado inicial del diseño (hasta 30.000 € y 80.000 km) era de demostración y ocultaría coches sin que el usuario lo pidiera.
3. **Calculadora**: entrada inicial del 15 % y plazo de 96 meses, para que coincida con el «desde X €/mes» de la ficha. Entrada máxima: el 50 % del precio, en pasos de 250 €, en vez del tope fijo de 9.000 € del diseño.
4. **Carrocería** como dato del coche, para los «Coches similares», el enlace «Ver más compactos» y las búsquedas populares de favoritos («SUV hasta 25.000 €»).
5. **Consumo con unidad**: l/100 km o kWh/100 km. El comparador solo marcará «Mejor» entre valores de la misma unidad.
6. **Fechas relativas a hoy**: la API simulada desplaza las fechas de publicación para que el catálogo no envejezca.
7. **Filtros en móvil (fase 2)**: el panel trabaja sobre un borrador. «Ver N coches» lo aplica; Escape o tocar fuera lo descartan.
8. **Áreas táctiles de 44 px**: corazón de 44 px también en escritorio (el diseño usa 40). Los chips mantienen 34–36 px a la vista, pero su zona pulsable llega a 44 px.
9. **Favoritos y comparador empiezan vacíos**: el diseño los mostraba con datos de ejemplo.

**Pendiente**
- Primer commit: falta configurar la identidad de git (`user.name` / `user.email`).
