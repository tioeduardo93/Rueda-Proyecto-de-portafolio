# Revisiones de Rueda

## Fase 1 — 19/10/2026
Estado: APROBADA

Comprobado:
- `npm run build`, `npm run lint` y `npm test` (49 tests) sin errores ni avisos, antes y después de las correcciones.
- Navegador a 1440 px y 390 px: esqueletos de carga, listado de 24 coches, favoritos (contador de cabecera y `aria-label`), comparador (máx. 3, el 4.º queda deshabilitado con aviso), barra del comparador (quitar coches, «Puedes añadir 1 más», «Máximo alcanzado»), persistencia en localStorage tras recargar, rutas provisionales, 404, `/componentes`, enlace «Saltar al contenido» y orden de tabulación.
- Consola sin errores ni warnings de React. Sin scroll horizontal en móvil.
- Diseño: tokens, tipografía, tamaños de tarjeta (título 17 px, precio 27 px, radio 16 px), etiquetas DGT y barra del comparador coinciden con `Main.dc.html`, `Listado-movil.dc.html`, `Cargando-movil.dc.html` y `Componentes.dc.html`.
- Datos: los 13 coches del diseño coinciden campo a campo (precio, año, km, versión, potencia, etiqueta, ciudad, fotos, y consumo/maletero/color de los del comparador). Cuotas «desde» iguales a las del diseño (León 236 €, Golf 217 €, C-HR 273 €…).
- Código: sin `any`, `@ts-ignore`, `console.log` ni `eslint-disable`. Formateo sin `Intl` y con espacio de no separación real antes de «€» y «km».

Corregido por el revisor:
- `src/layout/AppLayout.tsx`: el enlace «Saltar al contenido» aparecía sin relleno y encima del logo (`sr-only`/`not-sr-only` ponen el padding a 0). Ahora se esconde fuera de pantalla y baja al recibir el foco.
- `src/pages/ListingPage.tsx`: en móvil la barra del comparador era `fixed` y tapaba el pie con el aviso de las cuotas al llegar al final. Ahora es `sticky` en todos los anchos y se queda al final de los resultados; se reduce el margen inferior que compensaba la barra.
- `src/pages/ListingPage.tsx`: plantilla de texto innecesaria alrededor de `pluralize`.
- `src/containers/CarCardContainer.tsx`: usa `useIsFavorite` del store en vez de repetir el mismo selector.
- `src/lib/api.ts`: el comentario decía que la API devuelve copias para evitar mutaciones, pero son copias superficiales; se ajusta a lo que hace.

Pendiente para el constructor (no bloquea; para la fase 2):
1. `src/layout/SiteHeader.tsx:43`: en móvil el placeholder del buscador se corta («…p. ej. SEAT L»). El diseño móvil usa «Marca o modelo»; conviene un texto que quepa a 390 px, o uno distinto por ancho.
2. `src/layout/SiteHeader.tsx:12`: la prop `showSearch` no se usa todavía. Si el comparador o favoritos no la necesitan en la fase 4, quitarla.
3. `src/components/icons.tsx`: hay iconos aún sin uso (`ShareIcon`, `ChevronLeftIcon`, `PlusIcon`…). Están bien si se usan en las fases 3 y 4; los que sobren al final, borrarlos.

Para que Eduardo lo entienda:
La fase 1 monta la base con Vite, React 18, TypeScript estricto y Tailwind 4, y convierte los colores, radios y sombras del diseño en tokens de Tailwind, así los componentes usan `bg-accent` o `rounded-card` en vez de valores sueltos. Los componentes de `src/components` solo pintan lo que reciben por props; los «containers» son los que leen los stores de Zustand (favoritos y comparador, guardados en localStorage) y calculan la cuota, lo que separa la presentación de la lógica y facilita probar cada parte. Toda la financiación vive en `lib/finance.ts` con el sistema francés, y los tests comprueban que las cuotas coinciden con las del diseño. Los precios se formatean a mano porque `Intl.NumberFormat('es-ES')` no pone el punto en números de cuatro cifras. La API es simulada con un retardo de 500 ms y se puede cancelar, para que la app ya tenga estados de carga y error reales cuando llegue una API de verdad.

## Fase 2 — 19/10/2026
Estado: APROBADA

Comprobado:
- `npm run build`, `npm run lint` y `npm test` (87 tests en 9 archivos) sin errores ni avisos, antes y después de las correcciones.
- Escritorio (1440 px):
  - Barra lateral completa: marcas con «Ver todas», modelo dependiente de la marca, sliders, combustible, cambio, etiqueta DGT y contador «N activos».
  - Chips de filtros activos y «Limpiar todo». Al quitar una marca se quita también su modelo.
  - Orden «Precio: de menor a mayor».
  - Búsqueda sin tildes y en cualquier orden («leon seat» → 1 coche).
  - Estado vacío con «Limpiar filtros».
  - «Cargar más» (9 → 17, muestra «Cargando…» y pasa el foco al primer coche nuevo).
  - Esqueletos al cambiar un filtro.
- URL:
  - Los filtros se escriben en la URL y «Atrás» recupera el estado anterior.
  - Los sliders no llenan el historial.
  - Los valores inválidos (`orden=raro`, `combustible=Vapor`, `anioMin=abc`, precios fuera de rango o invertidos, modelo sin marca) se ignoran o se ajustan sin romper la página.
- Móvil (390 px):
  - Botón «Filtros» con el número de filtros activos y orden compacto.
  - Panel inferior modal: borrador con «Ver N coches» en vivo, Escape y la X descartan, «Ver N coches» aplica, el foco queda atrapado y vuelve al botón, y el fondo no hace scroll.
  - Placeholder «Marca o modelo».
  - Estado vacío con «Ajustar filtros».
  - Sin scroll horizontal y áreas táctiles de 44 px (los chips llegan con su zona ampliada).
- Consola sin errores ni warnings de React.
- Diseño: barra lateral, chips, orden y panel móvil coinciden con `Main.dc.html`, `Filtros-movil.dc.html` y `Sin-resultados-movil.dc.html`. Las capturas que el constructor no pudo hacer se han hecho aquí.
- Los 3 pendientes de la fase 1: placeholder y `showSearch`, resueltos; los iconos quedan para la fase 5, como se acordó.

Corregido por el revisor:
- `src/components/ActiveFilterChips.tsx`: clases de «Limpiar todo» reordenadas (las de `after:` estaban en medio de las de texto).
- `src/pages/ListingPage.tsx`: el comentario de la paginación decía que se reinicia «cuando cambia la búsqueda»; también se reinicia con filtros y orden.

Pendiente para el constructor (no bloquea; sugerencias):
1. `src/pages/ListingPage.tsx:130`: en móvil, la fila «Filtros / Ordenar» se va con el scroll. En `Listado-movil.dc.html` forma parte de la cabecera fija. Valorar en la fase 5 si se mete en la cabecera sticky.
2. `src/hooks/useListingQuery.ts`: si la URL trae valores inválidos, la página los ignora bien, pero la barra de direcciones los conserva (`?orden=raro`). Se podría reescribir la URL limpia al cargar con `replace`.

Para que Eduardo lo entienda:
La URL es la única fuente de verdad del listado: los filtros y el orden se leen de ella y se escriben en ella, así una búsqueda se puede compartir, sobrevive a la recarga y el botón «Atrás» funciona sin estado duplicado. El filtrado, el orden y los chips son funciones puras en `lib/filters.ts`, sin React, y por eso se prueban de forma sencilla y la barra lateral y el panel móvil las reutilizan. La lectura de la URL valida todo lo que llega, porque cualquiera puede escribir una URL a mano. En móvil, el panel trabaja sobre una copia de los filtros y solo los aplica al pulsar «Ver N coches», como en las apps de compra; está hecho con el `<dialog>` nativo, que da gratis el modo modal y la tecla Escape. Los esqueletos al cambiar un filtro son simulados, para imitar a una API real aunque el filtrado sea local e instantáneo.

## Fase 3 — 19/10/2026
Estado: CON CAMBIOS PENDIENTES

Comprobado:
- `npm run build`, `npm run lint` y `npm test` (101 tests en 11 archivos) sin errores ni avisos, antes y después de las correcciones.
- Escritorio (1440 px), ficha del SEAT León:
  - Miga de pan con «Volver a resultados» que recupera `?marca=SEAT` y enlace a la marca.
  - Galería: flechas que dan la vuelta (1 → 14), miniatura «+8 fotos» (abre la 7.ª), Inicio/Fin y flechas del teclado, anuncio «Foto 7 de 14: Asientos traseros».
  - Resumen fijo al hacer scroll, «Me interesa» con su mensaje y favorito con el contador de la cabecera.
  - Ficha técnica (12 datos, «Manual, 6 vel.», «5,7 l/100 km»), equipamiento completo, calculadora (entrada 3.000 € a 72 meses → 288 €/mes, 15.990 € financiados, 23.747 € en total).
  - Coches similares y «Ver más compactos» → `/?carroceria=Compacto`. Al abrir un similar, la página vuelve arriba y la calculadora empieza de cero.
- Móvil (390 px):
  - Sin cabecera del sitio, foto a sangre con «Volver», «Compartir» y favorito; tocar la foto pasa a la siguiente.
  - 4 casillas de datos, equipamiento 6 + «Ver todo» (con `aria-expanded`), carrusel de similares, barra inferior y aviso de «Me interesa» encima de la barra.
  - Sin scroll horizontal.
- Coche inexistente: título «Coche no encontrado», «Volver a resultados» y «Ver todos los coches».
- Consola sin errores ni warnings de React.
- Diseño: coincide con `Detalle-escritorio.dc.html` y `Detalle-movil.dc.html` en estructura, tamaños y textos. Las capturas que el constructor no pudo hacer se han hecho aquí.
- Pendientes de la fase 2: URL limpia, resuelto; fila de filtros en la cabecera, aplazado a la fase 5, como se acordó.

Corregido por el revisor:
- `src/components/CarMiniCard.tsx`: usa `carName` de `lib/car.ts` en vez de repetir el nombre a mano.

Pendiente para el constructor:
1. `src/lib/finance.ts:38` (`defaultDownPayment`): la ficha dice «o desde 236 €/mes» y la calculadora abre con 238 €/mes en el mismo plazo de 96 meses. En móvil se ven las dos cifras a la vez (calculadora y barra inferior). La cuota «desde» usa el 15 % exacto (2.848,50 €), pero la entrada de la calculadora se ajusta a pasos de 250 € (2.750 €). La decisión 3 de la fase 1 pedía que coincidieran. Opciones:
   - a) Paso de la entrada de 50 €: 2.850 € da 236 € y cuadra en el León.
   - b) Calcular la cuota «desde» con la misma entrada ajustada que la calculadora.

   Elegir una y comprobar que cuadra en todo el catálogo, con un test que lo asegure.
2. `src/pages/CarDetailPage.tsx:275` (`StickyContactBar`): en móvil, al llegar al final, la barra fija tapa el pie de página con el aviso de las cuotas (pie de 725 a 844 px y barra desde 761 px). El `pb-28` está en el contenido, no en el pie. Es el mismo fallo que se corrigió en el listado en la fase 1.
3. (Sugerencia) `src/components/detail/FinanceCalculator.tsx:72`: en móvil, el plazo elegido por defecto (96) queda medio cortado al final de la fila de plazos. Se podría desplazar la fila para que se vea al abrir.

Para que Eduardo lo entienda:
La ficha usa el mismo marcado para móvil y escritorio. Cambia de disposición con Tailwind en 1024 px y no mantiene dos páginas distintas; la ruta avisa al layout para que esconda la cabecera del sitio en móvil, porque ahí la foto ocupa todo el ancho. La galería es una región enfocable que se maneja con las flechas del teclado o deslizando, y anuncia cada foto a los lectores de pantalla. La calculadora no calcula nada por su cuenta: recibe los resultados de `lib/finance.ts`, que es la única fuente de las condiciones. Precisamente por eso se nota el pendiente 1: la ficha y la calculadora llaman a la misma librería con entradas distintas. «Volver a resultados» guarda la última búsqueda en `sessionStorage` en vez de usar el «Atrás» del navegador, para que funcione aunque se llegue a la ficha desde un enlace compartido.

## Fase 3 (segunda revisión) — 19/10/2026
Estado: APROBADA

Comprobado:
- `npm run build` y `npm run lint` sin errores ni avisos; `npm test` dos veces seguidas, 125 de 125 en verde, sin el fallo intermitente del título.
- Pendiente 1, cuotas: resuelto. `cuotaDesde` usa la misma entrada con la que abre la calculadora, y el paso de la entrada baja a 10 €.
  - SEAT León: la ficha, la barra inferior y la calculadora marcan 236 €/mes, con 2.850 € de entrada y 16.140 € financiados.
  - Toyota C-HR: 273 €/mes en la ficha y en la calculadora, igual que en el diseño.
  - Un test por coche asegura que cuadra en los 24.
- Pendiente 2, barra que tapaba el pie: resuelto. La ruta declara `mobileBottomBar` y el pie se alarga en móvil lo que mide la barra. A 390 px el texto del pie queda por encima de la barra; en escritorio el pie no cambia (padding 0).
- Pendiente 3, plazo cortado: resuelto. Al abrir, la fila de plazos se desplaza y el 96 se ve entero, sin mover la página.
- Consola sin errores ni warnings de React.

Corregido por el revisor: nada nuevo.

Pendiente para el constructor: nada de esta fase. Sigue aplazada a la fase 5 la fila «Filtros / Ordenar» en la cabecera móvil.

Para que Eduardo lo entienda:
Las dos cuotas no coincidían porque se calculaban con entradas distintas: el 15 % exacto y el 15 % redondeado al paso del slider. La solución hace que ambas usen la misma función, así coinciden por construcción y no por casualidad. Reducir el paso a 10 € mantiene las cifras del diseño, y hay un test por cada coche para que nadie lo rompa sin darse cuenta. El hueco del pie lo decide el layout a partir de lo que declara cada ruta, en vez de que cada página meta márgenes a mano.
