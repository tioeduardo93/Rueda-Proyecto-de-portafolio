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
