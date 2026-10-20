import axe from 'axe-core'

/**
 * Infracciones de axe en `root`, en texto legible para que el fallo de un test diga qué arreglar.
 *
 * Reglas desactivadas en jsdom, que no carga el CSS (`css: false`) ni calcula estilos:
 * - `color-contrast`: necesita los colores reales. El contraste se comprueba con axe en el navegador.
 * - `landmark-no-duplicate-banner` y `landmark-unique`: sin CSS se ven a la vez la cabecera del sitio y la móvil
 *   de la página, que en el navegador nunca coinciden (`lg:hidden` / `max-lg:hidden`).
 */
export async function axeViolations(root: Element = document.body): Promise<string[]> {
  const results = await axe.run(root, {
    rules: {
      'color-contrast': { enabled: false },
      'landmark-no-duplicate-banner': { enabled: false },
      'landmark-unique': { enabled: false },
    },
  })
  return results.violations.map((v) => `${v.id}: ${v.help} → ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)
}
