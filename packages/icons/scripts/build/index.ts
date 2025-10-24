import type { IconNode } from './normalize-ast'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import manifest from '@univerjs/icons-svg/manifest'
import { rolldown } from 'rolldown'
import { normalizeAST } from './normalize-ast'
import { parseSvg } from './parse-svg'
import { getIconComponent } from './templates'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

function createComponentFiles() {
  const groups = Object.values(manifest)
  const tsDir = resolve(__dirname, '../../ts')

  if (!existsSync(tsDir)) {
    mkdirSync(tsDir)
  }

  const exportsFileLines: string[] = []
  for (const icons of groups) {
    for (const icon of icons) {
      const raw = readFileSync(icon.path, 'utf-8')

      const ast = parseSvg(raw)
      const element = normalizeAST(icon.name, ast.children as unknown as IconNode[])[0]

      const tsx = getIconComponent({
        element,
        name: icon.name,
        componentName: icon.componentName,
      })

      exportsFileLines.push(`export { ${icon.componentName} } from './${icon.name}';`)

      writeFileSync(`${tsDir}/${icon.name}.tsx`, tsx)
    }
  }

  writeFileSync(`${tsDir}/index.tsx`, exportsFileLines.join('\n'), 'utf-8')
}

async function compileTsFile() {
  for (const icon of [{ name: 'base' }, ...Object.values(manifest).flat(), { name: 'index' }]) {
    const bundle = await rolldown({
      input: `ts/${icon.name}.tsx`,
      external: [
        /^react/,
        /^.\//,
      ],
    })

    await bundle.write({
      file: `dist/esm/${icon.name}.js`,
      format: 'es',
      exports: 'named',
    })
    await bundle.write({
      file: `dist/cjs/${icon.name}.cjs`,
      format: 'cjs',
      exports: 'named',
    })
  }
}

function main() {
  createComponentFiles()
  compileTsFile()
}

main()
