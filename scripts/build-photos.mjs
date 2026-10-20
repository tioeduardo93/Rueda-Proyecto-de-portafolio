// Descarga las fotos de `photos.json`, las deja en `public/cars/` (WebP 1200×800, ≤150 KB)
// y genera `src/data/photos.ts` y `CREDITS.md`. Uso: node scripts/build-photos.mjs [carpeta de originales]
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const ORIGINALS = process.argv[2] ?? join(tmpdir(), 'rueda-fotos', 'originales')
const OUT = join(ROOT, 'public', 'cars')
const WIDTH = 1200
const HEIGHT = 800
const MAX_BYTES = 150 * 1024

const manifest = JSON.parse(await readFile(join(ROOT, 'scripts', 'photos.json'), 'utf8'))
// Node quita los tipos al importar .ts: el nombre del coche sale de los mismos datos que usa la app.
const { CARS } = await import('../src/data/cars.ts')
const carTitle = (id) => { const c = CARS.find((car) => car.id === id); return `${c.marca} ${c.modelo}` }

const sourceUrl = (p) =>
  p.unsplash
    ? `https://images.unsplash.com/${p.img}?w=1800&q=90&fm=jpg`
    : `https://images.pexels.com/photos/${p.pexels}/pexels-photo-${p.pexels}.jpeg?auto=compress&cs=tinysrgb&w=1800`
const pageUrl = (p) => (p.unsplash ? `https://unsplash.com/es/fotos/${p.unsplash}` : `https://www.pexels.com/es-es/foto/${p.pexels}/`)
const authorUrl = (p) => (p.unsplash ? `https://unsplash.com/@${p.usuario}` : `https://www.pexels.com/es-es/@${p.usuario}/`)
const originalName = (p) => (p.unsplash ? `unsplash-${p.unsplash}.jpg` : `pexels-${p.pexels}.jpg`)

async function original(p) {
  const file = join(ORIGINALS, originalName(p))
  if (existsSync(file)) return readFile(file)
  const res = await fetch(sourceUrl(p))
  if (!res.ok) throw new Error(`${res.status} al descargar ${sourceUrl(p)}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(file, buf)
  return buf
}

async function toWebp(buf) {
  const resized = await sharp(buf).rotate().resize(WIDTH, HEIGHT, { fit: 'cover' }).toBuffer()
  for (let quality = 80; quality >= 40; quality -= 5) {
    const out = await sharp(resized).webp({ quality, effort: 6 }).toBuffer()
    if (out.length <= MAX_BYTES) return out
  }
  throw new Error('No baja de 150 KB')
}

await mkdir(ORIGINALS, { recursive: true })
await mkdir(OUT, { recursive: true })

const sizes = []
for (const [id, { photos }] of Object.entries(manifest)) {
  for (const [i, p] of photos.entries()) {
    const webp = await toWebp(await original(p))
    await writeFile(join(OUT, `${id}-${i + 1}.webp`), webp)
    sizes.push(webp.length)
  }
}

const data = Object.entries(manifest)
  .map(([id, { photos }]) => {
    const items = photos.map((p) => {
      const extra = [p.color && `color: '${p.color}'`, p.alt && `alt: '${p.alt}'`].filter(Boolean)
      return `{ vista: '${p.vista}'${extra.length ? `, ${extra.join(', ')}` : ''} }`
    })
    return `  ${/^\w+$/.test(id) ? id : `'${id}'`}: [\n    ${items.join(',\n    ')},\n  ],`
  })
  .join('\n')

await writeFile(
  join(ROOT, 'src', 'data', 'photos.ts'),
  `// Generado por scripts/build-photos.mjs a partir de scripts/photos.json: no editar a mano.
import type { PhotoSpec } from '../types'

/** Fotos de cada coche, en orden: \`public/cars/<id>-<n>.webp\`. */
export const CAR_PHOTOS: Record<string, readonly PhotoSpec[]> = {
${data}
}
`,
)

const credits = Object.entries(manifest)
  .map(([id, { photos, nota }]) => {
        const rows = photos.map(
      (p, i) =>
        `| \`${id}-${i + 1}.webp\` | ${p.vista} | [${p.autor}](${authorUrl(p)}) | [${p.unsplash ? 'Unsplash' : 'Pexels'}](${pageUrl(p)}) |`,
    )
    return [`### ${carTitle(id)}`, '', ...(nota ? [`${nota}`, ''] : []), '| Archivo | Vista | Autor | Original |', '| --- | --- | --- | --- |', ...rows, ''].join(
      '\n',
    )
  })
  .join('\n')

await writeFile(
  join(ROOT, 'CREDITS.md'),
  `# Créditos de las fotos

Todas las fotos de \`public/cars/\` son de [Unsplash](https://unsplash.com) o [Pexels](https://www.pexels.com) y se usan bajo
la [Licencia Unsplash](https://unsplash.com/es/licencia) o la [Licencia Pexels](https://www.pexels.com/es-es/license/):
permiten el uso comercial gratuito sin pedir permiso. Ninguna es de Unsplash+.

Se han recortado a 1200×800 y convertido a WebP con \`scripts/build-photos.mjs\`. Cuando no había fotos libres del modelo
exacto se ha usado uno parecido, y se indica en cada coche. Los anuncios son ficticios: ni los fotógrafos ni las marcas
tienen relación con este proyecto.

La imagen para redes (\`public/og-image.jpg\`, 1200×630) usa la foto frontal del Tesla Model 3.

${credits}`,
)

const kb = (n) => `${Math.round(n / 1024)} KB`
console.log(`${sizes.length} fotos · máx. ${kb(Math.max(...sizes))} · media ${kb(sizes.reduce((a, b) => a + b, 0) / sizes.length)}`)
