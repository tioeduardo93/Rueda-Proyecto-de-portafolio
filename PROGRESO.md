# Progreso de Rueda

Registro de avance por fases. Se actualiza al cerrar cada fase.

| Fase | Estado | Fecha |
| --- | --- | --- |
| 0. Plan y repositorio | ✅ Hecha | 19/10/2026 |
| 1. Estructura, tokens, datos y componentes base | ✅ Aprobada por el revisor | 19/10/2026 |
| 2. Listado con filtros, orden y URL | ✅ Aprobada por el revisor | 19/10/2026 |
| 3. Ficha y calculadora | ✅ Aprobada por el revisor | 19/10/2026 |
| 4. Comparador y favoritos | ✅ Aprobada por el revisor | 20/10/2026 |
| 5. Responsive, accesibilidad, tests y README | ✅ Aprobada por el revisor | 20/10/2026 |
| 6. Pulido para la candidatura | 🔍 Pendiente de revisión | 20/10/2026 |

## Estructura

```
src/
├── main.tsx · App.tsx         Entrada y router
├── routes.tsx                 Rutas (/, /coche/:id, /comparar, /favoritos, 404; /componentes solo en desarrollo)
├── index.css                  Tokens del diseño (@theme de Tailwind 4) y utilidades (fondo de foto, skeleton, slider doble)
├── types.ts                   Tipos Car y Photo y uniones (combustible, cambio, etiqueta, carrocería)
├── config/site.ts             Dominio (de VITE_SITE_URL), autor y enlaces del pie
├── data/cars.ts               24 coches (13 del diseño + 11 nuevos)
├── data/photos.ts             Vistas de las fotos de cada coche (generado desde scripts/photos.json)
├── lib/
│   ├── format.ts              Precios, km, decimales, matrícula, fechas relativas (sin Intl: agrupa 4 cifras)
│   ├── finance.ts             Única fuente de la financiación: 96 meses, 15 %, TIN 8,99 %, sistema francés
│   ├── filters.ts             Filtrado, orden, facetas, modelos por marca y chips activos (funciones puras)
│   ├── url.ts                 Filtros y orden ↔ parámetros de la URL, con validación
│   ├── car.ts                 Textos derivados del coche y coches similares
│   ├── compare.ts             Filas del comparador, «Mejor» por fila y «solo diferencias» (funciones puras)
│   ├── listingMemory.ts       Última búsqueda del listado, para «Volver a resultados»
│   ├── api.ts                 API simulada (retardo configurable en `latency`, cancelable, 404 tipado)
│   └── cn.ts                  Unión de clases
├── store/                     Zustand persistido: favoritos (con fecha de guardado) y comparador (máx. 3)
├── hooks/                     useCars, useListingQuery (URL), useMediaQuery, useSimulatedRefresh, useDocumentTitle,
│                              useStaleIdsCleanup
├── components/                Presentacionales, sin lógica de negocio:
│   │                          Button/ButtonLink, FilterChip, DgtBadge, Badge, CarPhoto, CarCard, CarCardSkeleton,
│   │                          RangeSlider, CompareBar, EmptyState, ActiveFilterChips, SortSelect, BottomSheet, Logo, icons,
│   │                          MobilePageHeader, PopularSearches
│   ├── filters/               FilterGroup, BrandFilter, ModelSelect, OptionChips, FilterFields, FiltersSidebar
│   ├── compare/               CompareTable, BestLegend
│   └── detail/                Gallery, CarSummary, DetailSection, SpecGrid, EquipmentList, FinanceCalculator,
│                              Breadcrumbs, StickyContactBar, DetailSkeleton (además CarMiniCard y Toast en components/)
├── containers/                Conectan componentes con stores y lógica (CarCard, CompareBar, MobileFiltersSheet)
├── layout/                    AppLayout (enlace «Saltar al contenido»), SiteHeader (búsqueda en vivo), SiteFooter,
│                              slots (huecos que rellenan las páginas por portal)
├── pages/                     ListingPage, CarDetailPage, ComparePage, FavoritesPage, NotFoundPage, ComponentsPage (dev)
└── test/                      Setup de Vitest, matchMedia simulado, renderApp, axe, flujos y accesibilidad
```

## Fase 6 · Pulido para la candidatura

**Hecho**
- **Fotos reales**: 74 fotos (3 o 4 por coche: exterior frontal, lateral o trasera e interior) de Unsplash y Pexels con licencia libre, ninguna de Unsplash+ ni de iStock. En `public/cars/` como WebP de 1200×800 (máx. 148 KB, media 74 KB). `scripts/photos.json` + `npm run photos` las regeneran junto a `src/data/photos.ts` y `CREDITS.md`. `<img>` con `width`/`height`, `loading="lazy"` salvo la primera visible (`fetchpriority="high"`), fondo rayado mientras cargan y alt en español («SEAT León negro, vista frontal»). Galería con miniaturas de imagen. Colores de 18 anuncios ajustados a sus fotos.
- **Pie**: «Proyecto de portafolio de Eduardo Cebrián López», enlaces a GitHub y al repositorio (pestaña nueva, `noopener noreferrer`). El del portafolio sale cuando se rellene `SITE.portfolioUrl`.
- **Open Graph y Twitter Card** con URLs absolutas desde `VITE_SITE_URL` y `public/og-image.jpg` (1200×630). Cada ficha actualiza título y meta description.
- **Zona segura de iOS**: `viewport-fit=cover`, márgenes laterales y la barra del comparador separada del indicador de inicio.
- **Un solo panel de filtros** (`containers/ListingFilters.tsx`) y un solo selector de orden; «Precio: de menor a mayor» en todos los anchos.
- Fuera el marcador `CarPhoto` de texto, `PHOTO_LABELS` y `CarSilhouette`. README y capturas renovados.
- 186 tests (eran 184): fotos y archivos de cada coche, texto alternativo, carga diferida del listado, galería con fotos, meta description de la ficha y panel de filtros único.

**Decisiones**
1. **Lo que tapaba el pie en móvil era la insignia de Netlify** (un `iframe` fijo que inyecta Netlify), no la barra del comparador, que es `sticky` y se queda al final de los resultados. Se quita desde el panel de Netlify; en el código solo se ha añadido la zona segura.
2. **Modelos parecidos** cuando no había fotos libres del exacto (CX-30, Corolla Touring Sports, generaciones anteriores de Golf, Ibiza y Captur, interiores de otro modelo de la marca). `CREDITS.md` lo dice en cada coche.
3. **Imagen para redes** compuesta en un `<canvas>` con Manrope (sharp no lee `.woff2`).

## Fase 5 · Responsive, accesibilidad, tests y README

**Corrección del revisor (aprobada en `d2a12da`)**
- `src/test/setup.ts`: `configure({ asyncUtilTimeout: 5000 })`. Con la máquina cargada, el primer montaje de la app en jsdom pasaba de 1 s, que es lo que esperan por defecto `findBy*` y `waitFor`, y algunos tests fallaban de forma intermitente sin nada roto. El `testTimeout` de 20 s que puse yo ampliaba el tiempo total de cada test, pero no ese tope de espera. Con los dos, todas las baterías en verde, también con dos ejecuciones a la vez.

**Sugerencias del revisor, aplicadas tras la aprobación**
1. `useStaleIdsCleanup`: el efecto dependía de `cars`, un objeto nuevo en cada render, así que se ejecutaba en cada render del layout. Ahora depende del array del catálogo, que es siempre el mismo porque está en caché, y de los ids de los stores.
2. `docs/capturas/ficha-escritorio.jpg`: repetida sin el anillo de foco en la flecha «Foto siguiente».

**Pendientes acumulados del revisor**
1. ✅ **Fila «Filtros / Ordenar» dentro de la cabecera fija en móvil** (fase 2). El layout ofrece huecos (`layout/slots.tsx`) que las páginas rellenan con un portal: el listado pinta la fila en el hueco de la cabecera y el estado sigue en el listado. A 360 px la cabecera mide 185 px de 780, como en `Listado-movil.dc.html`. Las cabeceras móviles de comparador y favoritos van por el mismo camino a un hueco antes de `<main>`, así que ahora son el landmark `banner` de la página.
2. ✅ **Ids retirados limpiados en un sitio común** (fase 4). `useStaleIdsCleanup` va en el layout: en cuanto llega el catálogo, borra de favoritos y del comparador los coches que ya no existen, en cualquier página. El contador de la cabecera ya no los cuenta (test en `test/flow.test.tsx`). Se quitan las limpiezas de cada página.
3. ✅ **Iconos sin uso** (fase 1): ahora se usan todos (los que faltaban los usan la ficha y el comparador), así que no hay que borrar ninguno.

**Accesibilidad**
- **axe-core como test** (`test/a11y.test.tsx`): las 11 pantallas y estados (listado, con filtros, sin resultados, ficha, ficha inexistente, comparador con 3, con 1 y vacío, favoritos con coches y vacío, 404) y el panel de filtros en móvil, sin infracciones. Incluye un control que comprueba que el ayudante sí detecta fallos.
  - En jsdom no se evalúan el contraste ni los landmarks duplicados (no hay CSS); eso se ha comprobado con axe en el navegador real.
  - `vitest-axe` lleva un año sin publicar nada (0.1.0), así que se usa `axe-core` directamente con un ayudante de pocas líneas (`test/axe.ts`).
- **axe en el navegador, con contraste**, en las 7 pantallas a 360, 390, 768, 1024 y 1440 px y en el panel móvil: 0 infracciones de WCAG 2.2 AA y buenas prácticas.
- **Corregido a raíz del repaso**:
  - Nombre accesible igual al texto visible (WCAG 2.5.3, control por voz): el enlace de Favoritos se leía «Favoritos: 4 coches guardados» mostrando «Favoritos 4», y dos miniaturas («Salpic.», «+8 fotos») tenían un `aria-label` sin su texto visible.
  - Espacios en los nombres accesibles: con el espacio dentro del `span` solo para lectores, el nombre salía «CompararVolkswagen Golf» o «Volkswagen,3coches». Ahora el espacio va fuera.
  - **Indicador de foco con contraste 3:1** (WCAG 1.4.11): el diseño lo pone al 40 % del acento, ~1,7:1 sobre blanco. Ahora es el acento sólido (token `--color-focus`).
  - Zonas táctiles de 44 px:
    - Sliders (eran de 28 px de alto).
    - «Ver todas las marcas» (40 px).
    - Títulos enlazados de las tarjetas y nombres del comparador en móvil (23 y 18 px; zona ampliada con `::after`).
    - Enlace de marca de la miga de pan (31 px de ancho).
- **Teclado**: recorrido real con Tab en listado y ficha. El orden es lógico (cabecera → miga → galería → resumen → calculadora → similares → pie), el foco se ve siempre y solo queda atrapado en el panel de filtros (probado en la fase 2 y en el test de flujo).
- **Títulos y landmarks**: un `h1` por pantalla y ancho, sin saltos de nivel, con `header`, `main` y `footer` en todas las pantallas. Excepción: la ficha en móvil no tiene `header`, porque el diseño la abre con la foto a todo el ancho; sus botones «Volver», «Compartir» y favorito van sobre la foto.
- `aria-live` ya estaba en recuento de resultados, panel de filtros, cuota, galería y barra del comparador. `prefers-reduced-motion` ya desactivaba animaciones y transiciones (`index.css`).

**Responsive**
- Recorrido por DOM de las 4 pantallas, la 404 y los estados de carga, error de ficha, vacío y sin resultados, a 360, 390, 768, 1024 y 1440 px.
  - Sin scroll horizontal de página.
  - Nada tapado por barras fijas al final.
  - Ningún elemento fuera de pantalla.
- **Textos cortados**: tres textos se recortaban con puntos suspensivos, como en el diseño: la versión larga de una tarjeta («E-Tech full hybrid 145 Techno · 143 CV»), los nombres de la barra del comparador en móvil y el título de la cabecera móvil. Ahora saltan de línea.
- **768 px**: usa las disposiciones de móvil (panel inferior, ficha a sangre) con 2 columnas; cabecera en una fila y fila de filtros debajo. Revisado también a ojo con captura.
- **Capturas a ojo**: listado, ficha, comparador y favoritos en escritorio; listado y ficha en móvil; listado en tablet. Coinciden con sus diseños.

**Tests**
- **Sin tiempos**: la API simulada tiene el retardo en un objeto (`latency`), que el setup pone a 0. Fuera los `timeout: 2000`: los tests esperan a que aparezca algo, no a que pase un tiempo. El test de la API sí prueba el retardo, con temporizadores falsos.
- **Flujo principal** con la app completa y las rutas reales (`routes.tsx` + `test/renderApp.tsx`):
  - Buscar «volkswagen» → filtrar por Diésel (en la URL) → abrir la ficha del Golf → favorito (contador de la cabecera) → «Volver a resultados» con la búsqueda intacta → marcar dos coches → «Comparar ahora» → tabla → Favoritos desde la cabecera.
  - En móvil: filtros desde el panel inferior de la cabecera.
  - Ids retirados limpiados por el layout.
- **Estado de error** (`test/errorState.test.tsx`), que no tenía test: la API falla una vez, se ve «No hemos podido cargar los coches» sin infracciones de axe, y «Reintentar» trae los 24 coches.
- **Fallo intermitente encontrado y corregido**: con todos los archivos en paralelo, el test de flujo tardaba 5,1 s y superaba el límite de 5 s de Vitest (la auditoría axe del listado llegaba a 4,2 s). No esperaba ningún tiempo; era margen de ejecución de jsdom. `testTimeout` sube a 20 s en `vite.config.ts`, con la explicación.
- **181 tests en 17 archivos**, 5 ejecuciones seguidas de la batería completa en verde. `npm run build` y `npm run lint` sin errores ni avisos.

**README.md**: qué es, capturas de las pantallas (`docs/capturas/`), stack y por qué, decisiones técnicas, cómo arrancarlo, estructura y límites conocidos. Se añade `engines.node >= 22.12` a `package.json`, que es lo que piden Vite, Vitest y jsdom.

**Decisiones de esta fase**
1. **Huecos del layout con portal** en vez de mover la fila de filtros al layout: el estado de filtros sigue viviendo en el listado y el layout no sabe nada de él.
2. **Textos sin recortar**, aunque el diseño use puntos suspensivos: el encargo de esta fase pide que no se corten, y la información es útil.
3. **Foco con acento sólido** en vez del 40 % del diseño, por contraste.
4. **Ficha en móvil sin landmark `header`**, por fidelidad al diseño (ver arriba).

**Limitaciones de la verificación**
- **Capturas**: el panel inferior de filtros no sale en ellas, porque la herramienta de captura no recoge la capa superior del navegador donde va el `<dialog>`. Lo he comprobado por DOM (posición, modal, contraste con axe), pero no a ojo, y no hay captura suya en el README.
- **Animaciones**: con el panel del navegador en segundo plano no avanzaban. Para medir el panel de filtros las he terminado a mano.
- **Recorrido con teclado**: completo en listado y ficha. En comparador y favoritos solo lo cubren los tests (foco al quitar, nombres accesibles) y axe, no un recorrido real con Tab.
- **Estado de error de la API**: no se puede provocar en el navegador (la API simulada no falla). Lo cubre el test `errorState.test.tsx`, con axe, pero no se ha visto a ojo.
- **Sin probar** con lector de pantalla real ni en dispositivos táctiles reales.

## Fase 4 · Comparador y favoritos

**Pendientes de la revisión anterior**: ninguno de la fase 3. La fila «Filtros / Ordenar» en la cabecera móvil sigue para la fase 5.

**Hecho**
- **Comparador (`/comparar`)**
  - Tabla con los coches del store en el orden en que se añadieron y las 13 filas del diseño. Precio y cuota (con `cuotaDesde`), año, km, potencia, consumo, maletero, combustible, cambio, etiqueta DGT, color, puertas y plazas.
  - «Mejor» por fila (`lib/compare.ts`):
    - Precio, cuota, km y consumo: gana el menor. Año, potencia y maletero: el mayor.
    - Etiqueta DGT por rango: 0 > ECO > C > B.
    - Si varios empatan en el mejor valor, ganan todos. Si empatan todos, no gana nadie.
    - Consumo: solo compiten los coches con la misma unidad. Uno solo en su unidad (un eléctrico entre gasolinas) no gana ni pierde.
    - Combustible, cambio, color, puertas y plazas no tienen ganador.
  - «Mostrar solo diferencias» quita las filas en las que todos coinciden. Dos consumos con el mismo número y distinta unidad cuentan como diferencia. Si no queda ninguna fila, la tabla lo dice.
  - Quitar un coche desde su columna. Los huecos libres («Añadir otro coche») llevan al listado con la última búsqueda.
  - Escritorio: una `<table>` con `caption`, `<th scope="col">` por coche y `<th scope="row">` por fila, con leyenda «Mejor valor de la fila» y nota de WLTP y cuotas.
  - Móvil: la misma tabla con scroll horizontal (columnas de 172 px), columna de etiquetas fija con textos cortos («Cuota», «Etiqueta») y aviso «Desliza horizontalmente…». En las celdas ganadoras, la marca de verificación lleva el texto «Mejor» para lectores de pantalla.
- **Favoritos (`/favoritos`)**
  - La misma tarjeta del listado, con «Guardado hace…» (desde `savedAt`) y «Ha bajado X €» (desde `precioAnterior`, visible también en móvil).
  - Corazón para quitar y casilla «Comparar» conectada al comparador, con su límite de 3.
  - «N coches guardados. Te avisamos si alguno baja de precio.» y «Comparar favoritos» a partir de 2.
  - Estado vacío del diseño, con el texto de móvil o de escritorio. En móvil, «Búsquedas populares» abren el listado ya filtrado con `listingHref`:
    - Híbridos ECO → `?combustible=Híbrido&etiqueta=ECO`
    - SUV hasta 25.000 € → `?precioMax=25000&carroceria=SUV`
    - Eléctricos → `?combustible=Eléctrico`
    - Automáticos → `?cambio=Automático`
- **Cabecera propia en móvil** para las dos pantallas (`MobilePageHeader`: «Volver» de 44 px y título, más la leyenda en el comparador y el contador en favoritos). Las rutas usan el `handle` `ownMobileHeader`, como la ficha.
- **Foco al quitar**: al quitar un coche del comparador o un favorito, su botón desaparece. El foco pasa al elemento que ocupa su sitio (o a «Añadir otro coche» / «Explorar coches») en vez de perderse en el `<body>`.
- **Cambios pequeños en piezas compartidas**:
  - `CarCard`: `photoBadge={null}` quita la etiqueta de la foto.
  - `EmptyState`: admite nodos como descripción.
  - `formatRelativeDays`: acepta un `Date`.
  - Borrado `ComingSoonPage`, que ya no se usaba.
- **154 tests** (29 nuevos): lógica del comparador, `formatRelativeDays` con `Date` e integración de comparador y favoritos (mejor valor, solo diferencias, quitar con foco, 1 coche, vacío, ids retirados, límite de 3, «Comparar favoritos» con 4, búsquedas populares).
- `npm run build`, `npm run lint` y `npm test` (3 ejecuciones seguidas) sin errores ni avisos.
- **Probado en el navegador:**
  - 1440 px: tabla del diseño (León, C-HR y 3008 con los mismos «Mejor» del diseño), solo diferencias, quitar con hueco nuevo, «Ver ficha», favoritos en 3 columnas, «Comparar favoritos» con 4.
  - 390 px: tabla de 616 px con la columna fija al desplazar, «Mejor» de consumo sin el eléctrico, cabeceras propias, estado vacío y búsqueda popular que abre el listado filtrado.
  - Sin errores en consola al cargar ni al navegar entre las dos páginas. Los que salieron antes eran del recargado en caliente de Vite mientras editaba `App.tsx`.

**Decisiones de esta fase** (casos que el diseño no cubre)
1. **Comparador con 0 coches**: estado vacío «Aún no has elegido coches para comparar» con «Explorar coches» (a la última búsqueda).
2. **Comparador con 1 coche**: tabla con ese coche y 2 huecos, sin ningún «Mejor», aviso «Añade al menos otro coche para ver cuál gana en cada fila» y «Mostrar solo diferencias» desactivado.
3. **«Comparar favoritos» con más de 3**: sustituye la selección del comparador por los 3 guardados más recientes (por `savedAt`, no por la posición en el store) y lo indica bajo el botón: «Se comparan los 3 guardados más recientes».
4. **Ids que ya no existen en el catálogo** (anuncio retirado): no se muestran, y se borran del store en cuanto llega el catálogo, en el comparador y en favoritos. Así no ocupan uno de los 3 huecos ni descuadran el contador.
5. **Cabecera de escritorio del comparador con buscador**: el diseño no lo pone, pero la cabecera es común a todo el sitio y quitarlo solo aquí sería incoherente.
6. **Filas del comparador iguales en móvil y escritorio**: el diseño móvil enseña 10 y el de escritorio 13. En móvil también salen color, puertas y plazas, que caben de sobra con el scroll.
7. **En móvil el nombre del coche enlaza a la ficha**, porque el diseño no tiene «Ver ficha»; en escritorio, el botón «Ver ficha» del diseño.
8. **«Búsquedas populares» solo en móvil**, como en el diseño: en escritorio el estado vacío queda igual que en `Favoritos-escritorio.dc.html`.

**Limitaciones de la verificación**
- El panel del navegador seguía oculto: sin capturas ni comparación a ojo con los cuatro diseños. Medidas, textos, orden y comportamiento se han comprobado por DOM.
- No probado con lector de pantalla real (los nombres accesibles se comprueban en los tests con Testing Library) ni con scroll táctil real en la tabla.

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
