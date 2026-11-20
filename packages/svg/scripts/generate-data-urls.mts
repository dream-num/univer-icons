import { readFileSync, writeFileSync } from 'node:fs'

const svg = readFileSync(new URL('../single/broken-image-icon.svg', import.meta.url), 'utf8')
const artwork = svg.replaceAll('="black"', '="#788391"')
const url = `data:image/svg+xml;base64,${Buffer.from(artwork).toString('base64')}`
writeFileSync(
  new URL('../ts/data-urls.generated.ts', import.meta.url),
  `export const brokenImageUrl: string = '${url}'\n`,
)
