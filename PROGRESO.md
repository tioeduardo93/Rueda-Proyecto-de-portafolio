# Progreso de Rueda

Registro de avance por fases. Se actualiza al cerrar cada fase.

| Fase | Estado | Fecha |
| --- | --- | --- |
| 0. Plan y repositorio | ✅ Hecha | 19/10/2026 |
| 1. Estructura, tokens, datos y componentes base | ✅ Aprobada por el revisor | 19/10/2026 |
| 2. Listado con filtros, orden y URL | ✅ Aprobada por el revisor | 19/10/2026 |
| 3. Ficha y calculadora | ✅ Hecha · pendiente de revisión | 19/10/2026 |
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
│   ├── car.ts                 Textos derivados del coche y coches similares
│   ├── listingMemory.ts       Última búsqueda del listado, para «Volver a resultados»
│   ├── api.ts                 API simulada (500 ms, cancelable, 404 tipado)
│   └── cn.ts                  Unión de clases
├── store/                     Zustand persistido: favoritos (con fecha de guardado) y comparador (máx. 3)
├── hooks/                     useCars, useListingQuery (URL), useMediaQuery, useSimulatedRefresh, useDocumentTitle
├── components/                Presentacionales, sin lógica de negocio:
│   │                          Button/ButtonLink, FilterChip, DgtBadge, Badge, CarPhoto, CarCard, CarCardSkeleton,
│   │                          RangeSlider, CompareBar, EmptyState, ActiveFilterChips, SortSelect, BottomSheet, Logo, icons
│   ├── filters/               FilterGroup, BrandFilter, ModelSelect, OptionChips, FilterFields, FiltersSidebar
│   └── detail/                Gallery, CarSummary, DetailSection, SpecGrid, EquipmentList, FinanceCalculator,
│                              Breadcrumbs, StickyContactBar, DetailSkeleton (además CarMiniCard y Toast en components/)
├── containers/                Conectan componentes con stores y lógica (CarCard, CompareBar, MobileFiltersSheet)
├── layout/                    AppLayout (enlace «Saltar al contenido»), SiteHeader (búsqueda en vivo), SiteFooter
├── pages/                     ListingPage, CarDetailPage, NotFoundPage, ComingSoonPage, ComponentsPage (dev)
└── test/                      Setup de Vitest y matchMedia simulado
```

## Fase 3 · Ficha y calculadora

**Correcciones tras la revisión de la fase 3**
1. ✅ **«Desde X €/mes» ≠ calculadora** (236 € frente a 238 € en el León). Se combinan las dos opciones del revisor:
   - De la b), `cuotaDesde` se calcula ahora con la misma entrada con la que abre la calculadora (`defaultDownPayment`), así que coinciden por construcción, también con coches nuevos.
   - El paso de la entrada pasa de 250 € a 10 €, para que esa entrada redondeada no cambie ninguna cifra del diseño. Con 50 € (opción a) seguían fallando 4 coches, entre ellos el C-HR (273 → 272). Con 10 € cuadran los 24.
   - Un test por coche comprueba las dos cosas: igual a la calculadora recién abierta e igual al 15 % exacto. El de la ficha comprueba que la calculadora abre con 236 €/mes.
   - Con el teclado, las flechas mueven la entrada de 10 en 10 € y RePág/AvPág un 10 % del recorrido (probado: 2.850 → 3.800 €).
2. ✅ **La barra fija tapaba el pie en móvil.** La ruta declara `mobileBottomBar` en su `handle` y el layout alarga el pie por debajo de `lg` lo que mide la barra (65 px + margen inferior con la zona segura). El hueco va en el pie blanco, no en el contenido, así que en los estados sin barra (cargando, 404) no queda una franja gris. Probado a 390 px: el texto del pie termina por encima de la barra. En escritorio el pie no cambia.
3. ✅ **El plazo elegido quedaba cortado en móvil.** Al abrir (y al cambiar de plazo), la fila de plazos se desplaza para que se vea entero. Se mueve solo la fila (`scrollLeft`): `scrollIntoView` también desplazaría la página. Probado: el 96 se ve entero y la página no se mueve.
- **Test intermitente encontrado de paso**: «muestra la ficha del coche» fallaba en 2 de cada 5 ejecuciones porque leía `document.title` antes de que el efecto lo actualizara. Ahora espera con `waitFor` (también en el del 404). 6 de 6 ejecuciones seguidas en verde.
- 125 tests (24 nuevos, uno por coche). `npm run build`, `npm run lint` y `npm test` sin errores ni avisos.

**Pendientes del revisor (fase 2)**
1. ⏳ Fila «Filtros / Ordenar» dentro de la cabecera fija en móvil: queda para la fase 5, como propuso el revisor.
2. ✅ URL con valores inválidos: el listado la reescribe limpia con `replace` (`?orden=raro&precioMax=30260` → `?precioMax=30500`). Compara los parámetros sin tener en cuenta su orden, para no reescribir la URL en cada tecla. Tiene test.

**Hecho**
- `/coche/:id` con el diseño de escritorio a partir de 1024 px: miga de pan con «Volver a resultados» (recupera los filtros de la última búsqueda), galería y secciones a la izquierda y resumen fijo (sticky) a la derecha.
- Por debajo de 1024 px, el diseño móvil: sin cabecera del sitio, foto a sangre con «Volver», «Compartir» y favorito encima, datos en 4 casillas y barra fija inferior con precio, cuota y «Me interesa».
- Galería: flechas, 7 miniaturas (la última resume «+8 fotos»), contador y puntos en móvil. Con el foco en la galería, ← → Inicio y Fin cambian de foto y dan la vuelta. En táctil se puede tocar o deslizar. Cada cambio se anuncia a lectores de pantalla.
- Ficha técnica con 12 datos (los 9 del diseño más carrocería, consumo y maletero, que ya existían para el comparador) y equipamiento: completo en escritorio, 6 + «Ver todo» en móvil.
- Calculadora: entrada (0 € – 50 % del precio, pasos de 10 €), 7 plazos, cuota en vivo, importe financiado, TIN y total a plazos. Todo el cálculo sale de `lib/finance.ts`.
- Coches similares: misma carrocería y precio cercano (`similarCars`), con «Ver más compactos/SUV…» que abre el listado filtrado. En móvil, carrusel horizontal de tarjetas mini.
- «Me interesa»: mensaje en escritorio y aviso emergente en móvil. «Compartir»: menú nativo del sistema o, si no lo hay, copia el enlace.
- Estados de carga (skeleton), error con «Reintentar» y coche inexistente, con título de página propio.
- 101 tests (14 nuevos): textos del coche, similares, URL limpia e integración de la ficha (datos, galería con botones, miniaturas y teclado, calculadora, favoritos, similares y 404).
- `npm run build`, `npm run lint` y `npm test` sin errores ni avisos.
- Probado en el navegador a 1440 y 390 px, sin errores en consola: «Volver» conserva `?marca=SEAT`, resumen fijo al hacer scroll, la página empieza arriba al navegar, galería con flechas reales del teclado, favorito y contador de la cabecera, mensaje de «Me interesa», barra inferior y foto que avanza al tocarla.

**Decisiones de esta fase**
1. **Cabecera en móvil**: la ruta de la ficha declara `handle: { ownMobileHeader: true }` y el layout esconde la cabecera del sitio por debajo de `lg`. En los estados sin foto (error, 404) hay un «Volver a resultados» propio.
2. **Miniaturas sin opacidad**: el diseño atenúa las inactivas al 75 %. Con texto de 10 px el contraste bajaría de AA (~3,2:1), así que se distinguen por el borde y el color del texto.
3. **«Me interesa» no envía nada**: es una demo sin backend. Muestra la confirmación del diseño.
4. **La galería es una región enfocable** (`role="region"` + `tabIndex`), el patrón de carrusel de WAI-ARIA. Se ha permitido en la regla `jsx-a11y/no-noninteractive-tabindex`.
5. **«Volver a resultados»** usa la última búsqueda guardada en `sessionStorage` (`lib/listingMemory.ts`), no `history.back()`: también funciona si se llega a la ficha desde un enlace compartido.

**Limitaciones de la verificación**
- El panel del navegador seguía oculto: sin capturas ni comparación a ojo con `Detalle-escritorio.dc.html` y `Detalle-movil.dc.html`. Medidas, textos y comportamiento se han comprobado por DOM.
- No probado con un dispositivo táctil real: deslizar en la galería y el menú nativo de «Compartir».
- La primera vez que se pulsó «Me interesa» en móvil, el aviso no apareció al leerlo a los 100 ms; en los intentos siguientes sí. No he podido reproducirlo. Lo más probable es que fuera el temporizador frenado en la pestaña oculta, pero no está confirmado.

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
3. **Calculadora**: entrada inicial del 15 % y plazo de 96 meses, para que coincida con el «desde X €/mes» de la ficha. Entrada máxima: el 50 % del precio, en pasos de 10 € (eran 250 € hasta la revisión de la fase 3), en vez del tope fijo de 9.000 € del diseño.
4. **Carrocería** como dato del coche, para los «Coches similares», el enlace «Ver más compactos» y las búsquedas populares de favoritos («SUV hasta 25.000 €»).
5. **Consumo con unidad**: l/100 km o kWh/100 km. El comparador solo marcará «Mejor» entre valores de la misma unidad.
6. **Fechas relativas a hoy**: la API simulada desplaza las fechas de publicación para que el catálogo no envejezca.
7. **Filtros en móvil**: el panel trabaja sobre un borrador. «Ver N coches» lo aplica; Escape o tocar fuera lo descartan.
8. **Áreas táctiles de 44 px**: corazón de 44 px también en escritorio (el diseño usa 40). Los chips mantienen 34–36 px a la vista, pero su zona pulsable llega a 44 px.
9. **Favoritos y comparador empiezan vacíos**: el diseño los mostraba con datos de ejemplo.
