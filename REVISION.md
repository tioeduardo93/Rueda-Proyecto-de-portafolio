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
