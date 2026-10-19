# Progreso de Rueda

Registro de avance por fases. Se actualiza al cerrar cada fase.

| Fase | Estado | Fecha |
| --- | --- | --- |
| 0. Plan y repositorio | ✅ Hecha | 19/10/2026 |
| 1. Estructura, tokens, datos y componentes base | ✅ Aprobada por el revisor | 19/10/2026 |
| 2. Listado con filtros, orden y URL | ✅ Hecha · pendiente de revisión | 19/10/2026 |
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
│   ├── filters.ts             Filtrado, orden, facetas, modelos por marca y chips activos (funciones puras)
│   ├── url.ts                 Filtros y orden ↔ parámetros de la URL, con validación
│   ├── api.ts                 API simulada (500 ms, cancelable, 404 tipado)
│   └── cn.ts                  Unión de clases
├── store/                     Zustand persistido: favoritos (con fecha de guardado) y comparador (máx. 3)
├── hooks/                     useCars, useListingQuery (URL), useMediaQuery, useSimulatedRefresh, useDocumentTitle
├── components/                Presentacionales, sin lógica de negocio:
│   │                          Button/ButtonLink, FilterChip, DgtBadge, Badge, CarPhoto, CarCard, CarCardSkeleton,
│   │                          RangeSlider, CompareBar, EmptyState, ActiveFilterChips, SortSelect, BottomSheet, Logo, icons
│   └── filters/               FilterGroup, BrandFilter, ModelSelect, OptionChips, FilterFields, FiltersSidebar
├── containers/                Conectan componentes con stores y lógica (CarCard, CompareBar, MobileFiltersSheet)
├── layout/                    AppLayout (enlace «Saltar al contenido»), SiteHeader (búsqueda en vivo), SiteFooter
├── pages/                     ListingPage, NotFoundPage, ComingSoonPage, ComponentsPage (dev)
└── test/                      Setup de Vitest y matchMedia simulado
```

## Fase 2 · Listado con filtros, orden y URL

**Pendientes del revisor (fase 1)**
1. ✅ Placeholder del buscador: «Marca o modelo» por debajo de 640 px, como en el diseño móvil, y el texto largo desde ahí.
2. ✅ `SiteHeader`: quitada la prop `showSearch`, que no se usaba. Si el comparador de la fase 4 necesita una cabecera sin buscador, se vuelve a añadir entonces.
3. ⏳ Iconos sin uso (`ShareIcon`, `ChevronLeftIcon`, `PlusIcon`…): los usarán la ficha y el comparador. En la fase 5 se borran los que sobren.

**Hecho**
- Búsqueda por marca, modelo o versión mientras se escribe: no distingue tildes ni mayúsculas, y vale cualquier orden de palabras («leon seat»).
- Filtros: marca múltiple (6 visibles + «Ver todas»), modelo dependiente de la marca (agrupado por marca si hay varias), sliders de precio, año y km, combustible, cambio y etiqueta DGT. Botón «Limpiar filtros».
- Chips de filtros activos que se quitan al pulsarlos («Hasta 30.000 €», «Desde 2020», «Etiqueta ECO»…). Al quitar una marca se quita su modelo, como en el diseño.
- Orden (5 criterios, estable), contador de resultados con `aria-live`, rejilla de 1/2/3 columnas, «Cargar más» de 9 en 9 con «Cargando…», estado vacío y skeletons.
- Filtros y orden en la URL. Se pueden compartir, sobreviven a la recarga y «Atrás» funciona. Los valores se validan: fuera de rango se ajusta, lo desconocido se ignora y min/max invertidos se intercambian.
- Móvil y tablet (< 1024 px): botón «Filtros» con el número de filtros activos y selector de orden compacto. El panel inferior va sobre `<dialog>` modal: atrapa el foco, se cierra con Escape, la X o tocando fuera, bloquea el scroll del fondo, devuelve el foco al botón y tiene «Ver N coches» con el recuento en vivo (también anunciado a lectores de pantalla).
- 87 tests (38 nuevos): filtrado, búsqueda, orden, facetas, chips, URL de ida y vuelta, validación, `useMediaQuery` e integración del listado (URL → resultados, quitar chip, estado vacío, paginación).
- `npm run build`, `npm run lint` y `npm test` sin errores ni avisos.
- Probado en el navegador a 1440, 820 y 390 px: filtros, URL, recarga, «Atrás», slider con teclado, «Cargar más» con el foco en el primer coche nuevo, búsqueda, estado vacío y panel móvil (borrador, Escape, aplicar, foco atrapado y devuelto). Consola sin errores ni warnings.

**Decisiones de esta fase**
1. **Historial**: los filtros discretos añaden una entrada («Atrás» los deshace). Escribir y arrastrar sliders la sustituyen, para no llenar el historial.
2. **Skeletons**: como en el diseño, aparecen ~500 ms al cambiar un filtro discreto o el orden. Búsqueda y sliders filtran al momento. El filtrado es local sobre el catálogo en caché; el retardo imita a la API (`useSimulatedRefresh`).
3. **Barra lateral desde 1024 px**; por debajo, panel inferior. A 768 px la barra dejaría una sola columna estrecha.
4. **Marcas ordenadas por número de coches** y, a igualdad, alfabéticamente. Los recuentos son del catálogo completo, como en el diseño.
5. **Carrocería** se filtra solo desde la URL (`?carroceria=SUV`), para los enlaces de las fases 3 y 4. No tiene control en la barra lateral, pero sí chip.
6. **«Cargar más» no va a la URL**: al recargar se vuelve a los 9 primeros. Al cambiar filtros u orden también.
7. **«Limpiar» del panel móvil conserva la búsqueda**, porque no se edita en el panel. «Limpiar filtros» de la barra lateral y del estado vacío la borra también, como en el diseño.

**Limitaciones de la verificación**
- El panel del navegador estaba oculto: no se han podido hacer capturas ni comparar el resultado a ojo con el diseño, y las animaciones no avanzaban. Medidas, textos, estados y comportamiento se han comprobado por DOM.

## Fase 1 · Estructura, tokens, datos y componentes base

**Hecho**
- Vite 8 + React 18.3 + TypeScript 5.9 (strict, `noUncheckedIndexedAccess`) + Tailwind 4 + React Router 7 + Zustand 5 + Vitest 5.
- ESLint 9 con `typescript-eslint`, `react-hooks` y `jsx-a11y`.
- Manrope autoalojada (`@fontsource-variable/manrope`): sin peticiones a Google Fonts.
- Tokens de `CLAUDE.md` y `Componentes.dc.html` como utilidades de Tailwind (`bg-accent`, `bg-accent-soft`, `rounded-card`…). El acento sale de `--accent`.
- Componentes base con la disposición de móvil y de escritorio del diseño en el mismo marcado.
- 49 tests: formateadores, cuota (cuadra con las del diseño: León 236 €, Golf 217 €, C-HR 273 €…), integridad del catálogo, API y stores.

**Decisiones por defecto aplicadas** (se pueden cambiar)
1. **React Router 7**, no 8: la 8 exige React 19 y `CLAUDE.md` fija React 18. **TypeScript 5.9** y **ESLint 9**: las versiones nuevas aún no son compatibles con `typescript-eslint` y `jsx-a11y`.
2. **Filtros por defecto = rangos completos** (3.000–60.000 €, 2010–2025, 0–200.000 km). El estado inicial del diseño (hasta 30.000 € y 80.000 km) era de demostración y ocultaría coches sin que el usuario lo pidiera.
3. **Calculadora**: entrada inicial del 15 % y plazo de 96 meses, para que coincida con el «desde X €/mes» de la ficha. Entrada máxima: el 50 % del precio, en pasos de 250 €, en vez del tope fijo de 9.000 € del diseño.
4. **Carrocería** como dato del coche, para los «Coches similares», el enlace «Ver más compactos» y las búsquedas populares de favoritos («SUV hasta 25.000 €»).
5. **Consumo con unidad**: l/100 km o kWh/100 km. El comparador solo marcará «Mejor» entre valores de la misma unidad.
6. **Fechas relativas a hoy**: la API simulada desplaza las fechas de publicación para que el catálogo no envejezca.
7. **Filtros en móvil**: el panel trabaja sobre un borrador. «Ver N coches» lo aplica; Escape o tocar fuera lo descartan.
8. **Áreas táctiles de 44 px**: corazón de 44 px también en escritorio (el diseño usa 40). Los chips mantienen 34–36 px a la vista, pero su zona pulsable llega a 44 px.
9. **Favoritos y comparador empiezan vacíos**: el diseño los mostraba con datos de ejemplo.
